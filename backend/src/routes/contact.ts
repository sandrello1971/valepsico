import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 465),
  secure: (SMTP_SECURE ?? 'true') === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, email, telefono, messaggio, preferenza } = req.body || {};

    if (!nome || !email || !telefono || !messaggio || !preferenza) {
      return res.status(400).json({ error: 'Campi mancanti' });
    }
    const n = String(nome).trim();
    const e = String(email).trim();
    const t = String(telefono).trim();
    const m = String(messaggio).trim();
    const p = String(preferenza).trim();

    if (n.length < 2 || n.length > 50) return res.status(400).json({ error: 'Nome non valido' });
    if (!isValidEmail(e) || e.length > 255) return res.status(400).json({ error: 'Email non valida' });
    if (t.length < 8 || t.length > 20) return res.status(400).json({ error: 'Telefono non valido' });
    if (m.length < 10 || m.length > 1000) return res.status(400).json({ error: 'Messaggio non valido' });
    if (!['presenza', 'online', 'entrambe'].includes(p)) {
      return res.status(400).json({ error: 'Preferenza non valida' });
    }

    const to = CONTACT_TO || SMTP_USER || 'info@valentinaandolfi.it';
    const subject = `Nuovo messaggio dal sito – ${n}`;

    const text = [
      `Nuovo messaggio dal form di contatto di valentinaandolfi.it`,
      ``,
      `Nome: ${n}`,
      `Email: ${e}`,
      `Telefono: ${t}`,
      `Preferenza: ${p}`,
      ``,
      `Messaggio:`,
      m,
    ].join('\n');

    const html = `
      <h2>Nuovo messaggio dal form di contatto</h2>
      <p><strong>Nome:</strong> ${esc(n)}</p>
      <p><strong>Email:</strong> ${esc(e)}</p>
      <p><strong>Telefono:</strong> ${esc(t)}</p>
      <p><strong>Preferenza:</strong> ${esc(p)}</p>
      <p><strong>Messaggio:</strong></p>
      <p style="white-space:pre-wrap">${esc(m)}</p>
    `;

    await transporter.sendMail({
      from: `"Sito valentinaandolfi.it" <${SMTP_USER}>`,
      to,
      replyTo: e,
      subject,
      text,
      html,
    });

    // Copia di conferma al mittente
    const confirmText = [
      `Gentile ${n},`,
      ``,
      `ho ricevuto correttamente il tuo messaggio e ti risponderò personalmente entro 24–48 ore.`,
      ``,
      `Di seguito trovi una copia di ciò che hai inviato.`,
      ``,
      `— Dott.ssa Valentina Rita Andolfi`,
      `Psicologa e Psicoterapeuta`,
      ``,
      `──────────────`,
      `Nome: ${n}`,
      `Email: ${e}`,
      `Telefono: ${t}`,
      `Preferenza: ${p}`,
      ``,
      `Messaggio:`,
      m,
    ].join('\n');

    const confirmHtml = `
      <p>Gentile ${esc(n)},</p>
      <p>ho ricevuto correttamente il tuo messaggio e ti risponderò personalmente entro 24–48 ore.</p>
      <p>Di seguito trovi una copia di ciò che hai inviato.</p>
      <p>— <strong>Dott.ssa Valentina Rita Andolfi</strong><br>Psicologa e Psicoterapeuta</p>
      <hr>
      <p><strong>Nome:</strong> ${esc(n)}</p>
      <p><strong>Email:</strong> ${esc(e)}</p>
      <p><strong>Telefono:</strong> ${esc(t)}</p>
      <p><strong>Preferenza:</strong> ${esc(p)}</p>
      <p><strong>Messaggio:</strong></p>
      <p style="white-space:pre-wrap">${esc(m)}</p>
    `;

    try {
      await transporter.sendMail({
        from: `"Dott.ssa Valentina Rita Andolfi" <${SMTP_USER}>`,
        to: e,
        replyTo: to,
        subject: 'Abbiamo ricevuto il tuo messaggio – Valentina Rita Andolfi',
        text: confirmText,
        html: confirmHtml,
      });
    } catch (confirmErr) {
      console.error('[contact] errore invio conferma al mittente', confirmErr);
      // Non blocca la risposta: la mail alla dottoressa è già partita
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[contact] errore invio email', err);
    return res.status(500).json({ error: 'Errore nell\'invio del messaggio' });
  }
});

export default router;
