import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { format as formatTz } from 'date-fns-tz';

/**
 * Tipi locali minimi per il payload Stripe.
 * Evita di importare il namespace Stripe (broken nel .d.ts CJS di stripe@22).
 * Forma: solo i campi che usiamo realmente.
 */
interface StripeCheckoutSession {
  id: string;
  payment_intent: string | { id: string } | null | undefined;
  metadata?: { booking_id?: string } | null;
}
interface StripeWebhookEvent {
  type: string;
  data: { object: unknown };
}

import {
  db,
  AvailabilityRule,
  AvailabilityException,
  Booking,
  BookingSettings,
  BookingStatus,
} from '../db/database';
import { requireAuth } from '../middleware/auth';
import { getStripe, getWebhookSecret, isStripeConfigured } from '../lib/stripe';
import {
  ALL_KEYS,
  AppSettingKey,
  listStatuses,
  setSetting,
} from '../lib/appSettings';
import {
  computeAvailableSlots,
  computeRangeSummary,
  getSettings,
  isSlotStillAvailable,
} from '../lib/availability';
import { buildIcs } from '../lib/ics';
import {
  buildConsentUrl,
  exchangeCodeForTokens,
  createCalendarEvent,
  deleteCalendarEvent,
  disconnectGoogle,
  getOauthRow,
  isConnected,
} from '../lib/googleCalendar';

/* ============================================================
 * Mailer riutilizzato dal pattern di contact.ts
 * ============================================================ */
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  FRONTEND_URL,
} = process.env;

const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 465),
  secure: (SMTP_SECURE ?? 'true') === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const ORGANIZER_EMAIL = CONTACT_TO || SMTP_USER || 'info@valentinaandolfi.it';
const ORGANIZER_NAME = 'Dott.ssa Valentina Rita Andolfi';
const SITE_URL = (FRONTEND_URL || 'https://valentinaandolfi.it').replace(/\/$/, '');

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function fmtItalian(iso: string, timezone: string): string {
  // Es: "lunedì 12 maggio 2026, 10:00"
  return formatTz(new Date(iso), "EEEE d MMMM yyyy, HH:mm", {
    timeZone: timezone,
  });
}

/* ============================================================
 * PUBLIC ROUTER
 * ============================================================ */
export const bookingRouter = Router();

// GET /api/booking/settings — espone solo i campi utili al frontend
bookingRouter.get('/settings', (_req: Request, res: Response) => {
  const s = getSettings();
  return res.json({
    slot_minutes: s.slot_minutes,
    deposit_cents: s.deposit_cents,
    currency: s.currency,
    min_notice_hours: s.min_notice_hours,
    max_days_ahead: s.max_days_ahead,
    timezone: s.timezone,
  });
});

// GET /api/booking/availability?date=YYYY-MM-DD
bookingRouter.get('/availability', (req: Request, res: Response) => {
  const date = String(req.query.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Parametro date mancante o invalido (YYYY-MM-DD)' });
  }
  try {
    const slots = computeAvailableSlots(date);
    return res.json({ date, slots });
  } catch (err) {
    console.error('[booking] availability error', err);
    return res.status(500).json({ error: 'Errore calcolo disponibilità' });
  }
});

// GET /api/booking/availability/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
// Riepilogo per il calendario: stato per ogni giorno del range richiesto.
bookingRouter.get('/availability/summary', (req: Request, res: Response) => {
  const from = String(req.query.from || '').trim();
  const to = String(req.query.to || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return res
      .status(400)
      .json({ error: 'Parametri from/to mancanti o invalidi (YYYY-MM-DD)' });
  }
  // Cap a 92 giorni per evitare richieste enormi.
  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const toMs = Date.parse(`${to}T00:00:00Z`);
  if (toMs - fromMs > 92 * 24 * 3600 * 1000) {
    return res.status(400).json({ error: 'Range troppo ampio (max 92 giorni)' });
  }
  try {
    const days = computeRangeSummary(from, to);
    return res.json({ from, to, days });
  } catch (err) {
    console.error('[booking] availability summary error', err);
    return res.status(500).json({ error: 'Errore calcolo summary' });
  }
});

interface CreateBookingBody {
  start_at?: string;
  end_at?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  notes?: string;
  modality?: string;
  privacy_consent?: boolean;
}

// POST /api/booking/create
bookingRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateBookingBody;
    const start_at = String(body.start_at || '').trim();
    const end_at = String(body.end_at || '').trim();
    const client_name = String(body.client_name || '').trim();
    const client_email = String(body.client_email || '').trim();
    const client_phone = String(body.client_phone || '').trim();
    const notes = body.notes ? String(body.notes).trim() : null;
    const modality = body.modality === 'online' ? 'online' : 'presenza';
    const privacy = body.privacy_consent === true;

    if (!start_at || !end_at) return res.status(400).json({ error: 'Slot non specificato' });
    if (Number.isNaN(Date.parse(start_at)) || Number.isNaN(Date.parse(end_at))) {
      return res.status(400).json({ error: 'Date non valide' });
    }
    if (client_name.length < 2 || client_name.length > 80) {
      return res.status(400).json({ error: 'Nome non valido' });
    }
    if (!isValidEmail(client_email) || client_email.length > 255) {
      return res.status(400).json({ error: 'Email non valida' });
    }
    if (client_phone.length < 8 || client_phone.length > 20) {
      return res.status(400).json({ error: 'Telefono non valido' });
    }
    if (notes && notes.length > 1000) {
      return res.status(400).json({ error: 'Note troppo lunghe' });
    }
    if (!privacy) {
      return res.status(400).json({ error: 'Consenso privacy obbligatorio' });
    }

    const settings = getSettings();
    const successUrl =
      (process.env.BOOKING_SUCCESS_URL ||
        `${SITE_URL}/prenota/conferma?session_id={CHECKOUT_SESSION_ID}`);
    const cancelUrl =
      process.env.BOOKING_CANCEL_URL || `${SITE_URL}/prenota`;

    // Transazione: ri-verifica + insert atomici. La race condition fra due
    // utenti che cliccano lo stesso slot si chiude qui.
    const tx = db.transaction(() => {
      if (!isSlotStillAvailable(start_at, end_at)) {
        return { conflict: true as const };
      }
      const holdExpires = new Date(
        Date.now() + settings.hold_minutes * 60 * 1000
      ).toISOString();
      const info = db
        .prepare(
          `INSERT INTO bookings (
              start_at, end_at, client_name, client_email, client_phone,
              notes, modality, status, deposit_cents, hold_expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
        )
        .run(
          start_at,
          end_at,
          client_name,
          client_email,
          client_phone,
          notes,
          modality,
          settings.deposit_cents,
          holdExpires
        );
      return { conflict: false as const, id: Number(info.lastInsertRowid) };
    });
    const txResult = tx();
    if (txResult.conflict) {
      return res.status(409).json({ error: 'Slot non più disponibile' });
    }
    const bookingId = txResult.id;

    if (!isStripeConfigured()) {
      // Rollback del pending appena creato
      db.prepare(
        `UPDATE bookings SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(bookingId);
      return res.status(503).json({
        error:
          'Pagamenti non ancora configurati. Riprovare più tardi o contattare la segreteria.',
      });
    }

    // Crea Stripe Checkout Session — il tipo è inferito dal SDK (CJS)
    const stripeClient = getStripe();
    let session: Awaited<ReturnType<typeof stripeClient.checkout.sessions.create>>;
    try {
      session = await stripeClient.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: client_email,
        client_reference_id: String(bookingId),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: settings.currency,
              unit_amount: settings.deposit_cents,
              product_data: {
                name: 'Acconto a conferma appuntamento',
                description: `Primo colloquio con la Dott.ssa Valentina Rita Andolfi — ${fmtItalian(
                  start_at,
                  settings.timezone
                )} (${modality})`,
              },
            },
          },
        ],
        expires_at: Math.floor(
          (Date.now() + settings.hold_minutes * 60 * 1000) / 1000
        ),
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          booking_id: String(bookingId),
        },
      });
    } catch (err) {
      // Rollback: marca il booking expired così lo slot torna libero
      db.prepare(
        `UPDATE bookings SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(bookingId);
      console.error('[booking] stripe checkout session error', err);
      return res.status(502).json({ error: 'Errore nella creazione del pagamento' });
    }

    // Aggiorna booking con session_id
    db.prepare(
      `UPDATE bookings SET stripe_session_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(session.id, bookingId);

    return res.json({
      booking_id: bookingId,
      session_id: session.id,
      checkout_url: session.url,
    });
  } catch (err) {
    console.error('[booking] create error', err);
    return res.status(500).json({ error: 'Errore nella prenotazione' });
  }
});

// POST /api/booking/webhook — montato direttamente in server.ts con express.raw()
// (NON dentro questo router, altrimenti dovrebbe ri-dispatchare il body).
export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  if (!sig || Array.isArray(sig)) {
    return res.status(400).send('Firma mancante');
  }

  let event: StripeWebhookEvent;
  try {
    event = getStripe().webhooks.constructEvent(
      // req.body è un Buffer grazie a express.raw()
      req.body as Buffer,
      sig,
      getWebhookSecret()
    );
  } catch (err) {
    console.error('[booking] webhook signature failure', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Risposta rapida: gli effetti collaterali (calendar/email) vanno fatti
  // dopo res.send() per non sforare il timeout Stripe (~10s).
  res.status(200).json({ received: true });

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as StripeCheckoutSession);
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as StripeCheckoutSession;
      db.prepare(
        `UPDATE bookings
            SET status = 'expired', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_session_id = ? AND status = 'pending'`
      ).run(session.id);
    }
  } catch (err) {
    // Log only — il webhook 2xx è già partito; Stripe non riproverà
    console.error('[booking] webhook handler error', err);
  }
}

async function handleCheckoutCompleted(session: StripeCheckoutSession) {
  // Idempotency: se il booking è già confirmed, esci
  const booking = db
    .prepare(`SELECT * FROM bookings WHERE stripe_session_id = ?`)
    .get(session.id) as Booking | undefined;
  if (!booking) {
    console.warn('[booking] webhook: nessun booking per session', session.id);
    return;
  }
  if (booking.status === 'confirmed') return;

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Confirm + salva PI
  db.prepare(
    `UPDATE bookings
        SET status = 'confirmed',
            stripe_payment_intent_id = ?,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
  ).run(paymentIntentId, booking.id);

  const settings = getSettings();

  // 1) Google Calendar (best effort)
  let googleEventId: string | null = null;
  if (isConnected()) {
    try {
      const evt = await createCalendarEvent({
        summary: `Primo colloquio — ${booking.client_name}`,
        description: [
          `Modalità: ${booking.modality}`,
          `Email: ${booking.client_email}`,
          `Telefono: ${booking.client_phone}`,
          booking.notes ? `\nNote del paziente:\n${booking.notes}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        startUtc: booking.start_at,
        endUtc: booking.end_at,
        attendeeEmail: booking.client_email,
        attendeeName: booking.client_name,
        timezone: settings.timezone,
        location:
          booking.modality === 'online'
            ? 'Videochiamata (link inviato a parte)'
            : 'Studio Velasca, Piazza Velasca 6, Milano',
      });
      googleEventId = evt.id;
      db.prepare(
        `UPDATE bookings SET google_event_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(googleEventId, booking.id);
    } catch (err) {
      console.error('[booking] errore Google Calendar', err);
    }
  } else {
    console.warn('[booking] Google Calendar non collegato: skip evento');
  }

  // 2) Email conferma a paziente + Valentina (con .ics)
  try {
    await sendBookingEmails(booking, settings);
  } catch (err) {
    console.error('[booking] errore email conferma', err);
  }
}

async function sendBookingEmails(booking: Booking, settings: BookingSettings) {
  const whenLocal = fmtItalian(booking.start_at, settings.timezone);
  const ics = buildIcs({
    uid: `booking-${booking.id}@valentinaandolfi.it`,
    startUtc: booking.start_at,
    endUtc: booking.end_at,
    summary: `Primo colloquio — Dott.ssa Andolfi`,
    description: `Appuntamento confermato.\nModalità: ${booking.modality}`,
    location:
      booking.modality === 'online'
        ? 'Videochiamata'
        : 'Studio Velasca, Piazza Velasca 6, Milano',
    organizerName: ORGANIZER_NAME,
    organizerEmail: ORGANIZER_EMAIL,
    attendeeName: booking.client_name,
    attendeeEmail: booking.client_email,
  });

  const icsAttachment = {
    filename: 'appuntamento.ics',
    content: ics,
    contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
  };

  // → paziente
  const clientText = [
    `Gentile ${booking.client_name},`,
    ``,
    `ho ricevuto la conferma del pagamento dell'acconto.`,
    `L'appuntamento è confermato per ${whenLocal}.`,
    `Modalità: ${booking.modality}.`,
    ``,
    booking.modality === 'online'
      ? `Le invierò il link alla videochiamata in prossimità dell'appuntamento.`
      : `L'indirizzo è Studio Velasca — Piazza Velasca 6, 20122 Milano.`,
    ``,
    `Il saldo del costo della seduta sarà concordato in seduta.`,
    ``,
    `In allegato il file .ics da aggiungere al suo calendario.`,
    ``,
    `Per qualunque modifica o disdetta, mi può scrivere a ${ORGANIZER_EMAIL}.`,
    ``,
    `— Dott.ssa Valentina Rita Andolfi`,
    `Psicologa e Psicoterapeuta`,
  ].join('\n');

  const clientHtml = `
    <p>Gentile ${esc(booking.client_name)},</p>
    <p>ho ricevuto la conferma del pagamento dell'acconto.</p>
    <p>L'appuntamento è confermato per <strong>${esc(whenLocal)}</strong>.<br>
       Modalità: <strong>${esc(booking.modality)}</strong>.</p>
    <p>${
      booking.modality === 'online'
        ? `Le invierò il link alla videochiamata in prossimità dell'appuntamento.`
        : `L'indirizzo è <strong>Studio Velasca — Piazza Velasca 6, 20122 Milano</strong>.`
    }</p>
    <p>Il saldo del costo della seduta sarà concordato in seduta.</p>
    <p>In allegato il file <code>.ics</code> da aggiungere al suo calendario.</p>
    <p>Per qualunque modifica o disdetta, mi può scrivere a
       <a href="mailto:${esc(ORGANIZER_EMAIL)}">${esc(ORGANIZER_EMAIL)}</a>.</p>
    <p>— <strong>Dott.ssa Valentina Rita Andolfi</strong><br>Psicologa e Psicoterapeuta</p>
  `;

  await mailer.sendMail({
    from: `"${ORGANIZER_NAME}" <${SMTP_USER}>`,
    to: booking.client_email,
    replyTo: ORGANIZER_EMAIL,
    subject: 'Conferma appuntamento — Valentina Rita Andolfi',
    text: clientText,
    html: clientHtml,
    attachments: [icsAttachment],
  });

  // → Valentina
  const adminText = [
    `Nuova prenotazione confermata`,
    ``,
    `Quando: ${whenLocal}`,
    `Modalità: ${booking.modality}`,
    `Cliente: ${booking.client_name}`,
    `Email: ${booking.client_email}`,
    `Telefono: ${booking.client_phone}`,
    ``,
    booking.notes ? `Note:\n${booking.notes}` : 'Nessuna nota.',
    ``,
    `Acconto: € ${(booking.deposit_cents / 100).toFixed(2)}`,
  ].join('\n');

  const adminHtml = `
    <h2>Nuova prenotazione confermata</h2>
    <p><strong>Quando:</strong> ${esc(whenLocal)}</p>
    <p><strong>Modalità:</strong> ${esc(booking.modality)}</p>
    <p><strong>Cliente:</strong> ${esc(booking.client_name)}</p>
    <p><strong>Email:</strong> ${esc(booking.client_email)}</p>
    <p><strong>Telefono:</strong> ${esc(booking.client_phone)}</p>
    ${
      booking.notes
        ? `<p><strong>Note:</strong></p><p style="white-space:pre-wrap">${esc(
            booking.notes
          )}</p>`
        : ''
    }
    <p><strong>Acconto:</strong> € ${(booking.deposit_cents / 100).toFixed(2)}</p>
  `;

  await mailer.sendMail({
    from: `"Prenotazioni valentinaandolfi.it" <${SMTP_USER}>`,
    to: ORGANIZER_EMAIL,
    replyTo: booking.client_email,
    subject: `Nuovo appuntamento — ${booking.client_name} — ${whenLocal}`,
    text: adminText,
    html: adminHtml,
    attachments: [icsAttachment],
  });
}

// GET /api/booking/confirm?session_id=...
// Espone solo lo stato del booking; NON conferma nulla (lato server fa il webhook).
bookingRouter.get('/confirm', (req: Request, res: Response) => {
  const sid = String(req.query.session_id || '').trim();
  if (!sid) return res.status(400).json({ error: 'session_id mancante' });
  const booking = db
    .prepare(`SELECT * FROM bookings WHERE stripe_session_id = ?`)
    .get(sid) as Booking | undefined;
  if (!booking) {
    return res.status(404).json({ error: 'Prenotazione non trovata' });
  }
  const settings = getSettings();
  return res.json({
    status: booking.status,
    when_local: fmtItalian(booking.start_at, settings.timezone),
    modality: booking.modality,
    client_email: booking.client_email,
  });
});

/* ============================================================
 * ADMIN ROUTER
 * ============================================================ */
export const adminBookingRouter = Router();
adminBookingRouter.use(requireAuth);

// ----- Rules CRUD -----
adminBookingRouter.get('/rules', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM availability_rules ORDER BY weekday, start_time')
    .all() as AvailabilityRule[];
  res.json(rows);
});

adminBookingRouter.post('/rules', (req, res) => {
  const { weekday, start_time, end_time, active } = req.body || {};
  const wd = Number(weekday);
  if (!Number.isInteger(wd) || wd < 0 || wd > 6) {
    return res.status(400).json({ error: 'weekday non valido (0-6)' });
  }
  if (!/^\d{2}:\d{2}$/.test(start_time) || !/^\d{2}:\d{2}$/.test(end_time)) {
    return res.status(400).json({ error: 'orario non valido (HH:MM)' });
  }
  if (start_time >= end_time) {
    return res.status(400).json({ error: 'end_time deve essere > start_time' });
  }
  const info = db
    .prepare(
      `INSERT INTO availability_rules (weekday, start_time, end_time, active)
       VALUES (?, ?, ?, ?)`
    )
    .run(wd, start_time, end_time, active === false ? 0 : 1);
  const row = db
    .prepare('SELECT * FROM availability_rules WHERE id = ?')
    .get(info.lastInsertRowid) as AvailabilityRule;
  res.status(201).json(row);
});

adminBookingRouter.put('/rules/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db
    .prepare('SELECT * FROM availability_rules WHERE id = ?')
    .get(id) as AvailabilityRule | undefined;
  if (!existing) return res.status(404).json({ error: 'Regola non trovata' });
  const { weekday, start_time, end_time, active } = req.body || {};
  const wd = weekday === undefined ? existing.weekday : Number(weekday);
  const st = start_time ?? existing.start_time;
  const et = end_time ?? existing.end_time;
  const ac = active === undefined ? existing.active : active ? 1 : 0;
  if (!Number.isInteger(wd) || wd < 0 || wd > 6) {
    return res.status(400).json({ error: 'weekday non valido' });
  }
  if (!/^\d{2}:\d{2}$/.test(st) || !/^\d{2}:\d{2}$/.test(et) || st >= et) {
    return res.status(400).json({ error: 'orario non valido' });
  }
  db.prepare(
    `UPDATE availability_rules
        SET weekday = ?, start_time = ?, end_time = ?, active = ?
      WHERE id = ?`
  ).run(wd, st, et, ac, id);
  const row = db
    .prepare('SELECT * FROM availability_rules WHERE id = ?')
    .get(id) as AvailabilityRule;
  res.json(row);
});

adminBookingRouter.delete('/rules/:id', (req, res) => {
  db.prepare('DELETE FROM availability_rules WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ----- Exceptions CRUD -----
adminBookingRouter.get('/exceptions', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM availability_exceptions ORDER BY date DESC')
    .all() as AvailabilityException[];
  res.json(rows);
});

adminBookingRouter.post('/exceptions', (req, res) => {
  const { date, type, start_time, end_time, note } = req.body || {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: 'date non valida (YYYY-MM-DD)' });
  }
  if (type !== 'closed' && type !== 'open') {
    return res.status(400).json({ error: "type deve essere 'closed' o 'open'" });
  }
  if (type === 'open') {
    if (!/^\d{2}:\d{2}$/.test(start_time) || !/^\d{2}:\d{2}$/.test(end_time)) {
      return res.status(400).json({ error: 'open richiede start_time/end_time HH:MM' });
    }
    if (start_time >= end_time) {
      return res.status(400).json({ error: 'end_time > start_time' });
    }
  }
  const info = db
    .prepare(
      `INSERT INTO availability_exceptions (date, type, start_time, end_time, note)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      date,
      type,
      type === 'open' ? start_time : null,
      type === 'open' ? end_time : null,
      note ?? null
    );
  const row = db
    .prepare('SELECT * FROM availability_exceptions WHERE id = ?')
    .get(info.lastInsertRowid) as AvailabilityException;
  res.status(201).json(row);
});

adminBookingRouter.delete('/exceptions/:id', (req, res) => {
  db.prepare('DELETE FROM availability_exceptions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ----- Settings -----
adminBookingRouter.get('/settings', (_req, res) => {
  res.json(getSettings());
});

adminBookingRouter.put('/settings', (req, res) => {
  const current = getSettings();
  const incoming = req.body || {};
  const next = {
    slot_minutes: Number(incoming.slot_minutes ?? current.slot_minutes),
    buffer_minutes: Number(incoming.buffer_minutes ?? current.buffer_minutes),
    deposit_cents: Number(incoming.deposit_cents ?? current.deposit_cents),
    currency: String(incoming.currency ?? current.currency),
    min_notice_hours: Number(incoming.min_notice_hours ?? current.min_notice_hours),
    max_days_ahead: Number(incoming.max_days_ahead ?? current.max_days_ahead),
    hold_minutes: Number(incoming.hold_minutes ?? current.hold_minutes),
    timezone: String(incoming.timezone ?? current.timezone),
  };
  if (
    !Number.isInteger(next.slot_minutes) || next.slot_minutes < 10 || next.slot_minutes > 240 ||
    !Number.isInteger(next.buffer_minutes) || next.buffer_minutes < 0 || next.buffer_minutes > 120 ||
    !Number.isInteger(next.deposit_cents) || next.deposit_cents < 100 || next.deposit_cents > 100000 ||
    !Number.isInteger(next.min_notice_hours) || next.min_notice_hours < 0 || next.min_notice_hours > 720 ||
    !Number.isInteger(next.max_days_ahead) || next.max_days_ahead < 1 || next.max_days_ahead > 365 ||
    !Number.isInteger(next.hold_minutes) || next.hold_minutes < 1 || next.hold_minutes > 120
  ) {
    return res.status(400).json({ error: 'Valori fuori range' });
  }
  db.prepare(
    `UPDATE booking_settings
        SET slot_minutes = ?, buffer_minutes = ?, deposit_cents = ?, currency = ?,
            min_notice_hours = ?, max_days_ahead = ?, hold_minutes = ?, timezone = ?
      WHERE id = 1`
  ).run(
    next.slot_minutes,
    next.buffer_minutes,
    next.deposit_cents,
    next.currency,
    next.min_notice_hours,
    next.max_days_ahead,
    next.hold_minutes,
    next.timezone
  );
  res.json(getSettings());
});

// ----- Bookings list / cancel -----
adminBookingRouter.get('/bookings', (req, res) => {
  const from = String(req.query.from || '').trim();
  const to = String(req.query.to || '').trim();
  const status = String(req.query.status || '').trim();

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (from) {
    where.push('start_at >= ?');
    params.push(from);
  }
  if (to) {
    where.push('start_at <= ?');
    params.push(to);
  }
  if (status) {
    const allowed: BookingStatus[] = ['pending', 'confirmed', 'expired', 'cancelled'];
    if (!allowed.includes(status as BookingStatus)) {
      return res.status(400).json({ error: 'status non valido' });
    }
    where.push('status = ?');
    params.push(status);
  }
  const sql = `SELECT * FROM bookings ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY start_at DESC LIMIT 500`;
  const rows = db.prepare(sql).all(...params) as Booking[];
  res.json(rows);
});

adminBookingRouter.post('/bookings/:id/cancel', async (req, res) => {
  const id = Number(req.params.id);
  const booking = db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .get(id) as Booking | undefined;
  if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });
  if (booking.status === 'cancelled') return res.json(booking);

  // Cancella evento Google se presente
  if (booking.google_event_id && isConnected()) {
    try {
      await deleteCalendarEvent(booking.google_event_id);
    } catch (err) {
      console.error('[booking] errore delete Google event', err);
    }
  }
  db.prepare(
    `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).run(id);
  const updated = db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .get(id) as Booking;
  res.json(updated);
});

// ----- Integrations (Stripe + Google credentials) -----
adminBookingRouter.get('/integrations', (_req, res) => {
  res.json({ settings: listStatuses() });
});

adminBookingRouter.put('/integrations', (req, res) => {
  const updates = req.body as Partial<Record<AppSettingKey, string | null>> | undefined;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Body non valido' });
  }
  for (const k of Object.keys(updates)) {
    if (!ALL_KEYS.includes(k as AppSettingKey)) {
      return res.status(400).json({ error: `Chiave non riconosciuta: ${k}` });
    }
  }
  for (const k of Object.keys(updates) as AppSettingKey[]) {
    const v = updates[k];
    if (v === undefined) continue; // chiave omessa = non modificare
    setSetting(k, v === null ? null : String(v));
  }
  res.json({ settings: listStatuses() });
});

// ----- Google OAuth -----
adminBookingRouter.get('/google/status', (_req, res) => {
  const row = getOauthRow();
  res.json({
    connected: !!row?.refresh_token,
    email: row?.connected_email || null,
    calendar_id: row?.calendar_id || 'primary',
    updated_at: row?.updated_at || null,
  });
});

adminBookingRouter.get('/google/oauth/start', (_req, res) => {
  try {
    // state = nonce random salvato come cookie firmato sarebbe più solido;
    // qui basta perché l'endpoint richiede già requireAuth.
    const state = crypto.randomBytes(16).toString('hex');
    const url = buildConsentUrl(state);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// IMPORTANTE: il callback Google NON ha il JWT admin → lo monto separatamente.
// Vedi sotto: googleOauthCallbackRouter.

adminBookingRouter.post('/google/disconnect', (_req, res) => {
  disconnectGoogle();
  res.json({ success: true });
});

/* Callback OAuth Google: senza requireAuth perché Google fa la redirect
 * lato browser dell'utente. Il code è single-use, scade in pochi minuti,
 * e include lo state che potremmo cross-check con un cookie. Lo monto come
 * router separato perché va sotto /api/booking/google/oauth/callback (path
 * dichiarato nella Google Cloud Console). */
export const googleOauthCallbackRouter = Router();
googleOauthCallbackRouter.get('/google/oauth/callback', async (req, res) => {
  const code = String(req.query.code || '');
  const errParam = String(req.query.error || '');
  if (errParam) {
    return res
      .status(400)
      .send(`<p>Autorizzazione negata: ${esc(errParam)}</p>`);
  }
  if (!code) {
    return res.status(400).send('<p>Code mancante</p>');
  }
  try {
    const { email } = await exchangeCodeForTokens(code);
    return res.send(`
      <html><head><title>Google Calendar collegato</title>
      <style>body{font-family:system-ui;padding:2rem;max-width:480px;margin:auto;color:#222}</style>
      </head><body>
      <h1>Google Calendar collegato</h1>
      <p>Account: <strong>${esc(email || '—')}</strong></p>
      <p>Puoi chiudere questa finestra e tornare al pannello amministrazione.</p>
      </body></html>
    `);
  } catch (err) {
    console.error('[booking] OAuth callback error', err);
    return res
      .status(500)
      .send(`<p>Errore nel collegamento: ${esc((err as Error).message)}</p>`);
  }
});

/* ============================================================
 * Cleanup periodico dei pending scaduti.
 * Chiamare runExpireSweep() ogni ~2 min dal server.ts.
 * ============================================================ */
export function runExpireSweep() {
  try {
    const now = new Date().toISOString();
    const info = db
      .prepare(
        `UPDATE bookings
            SET status = 'expired', updated_at = CURRENT_TIMESTAMP
          WHERE status = 'pending'
            AND hold_expires_at IS NOT NULL
            AND hold_expires_at < ?`
      )
      .run(now);
    if (info.changes > 0) {
      console.log(`[booking] expire sweep: ${info.changes} pending scaduti`);
    }
  } catch (err) {
    console.error('[booking] expire sweep error', err);
  }
}
