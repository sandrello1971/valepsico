import { fromZonedTime, toZonedTime, format as formatTz } from 'date-fns-tz';
import {
  db,
  AvailabilityRule,
  AvailabilityException,
  BookingSettings,
  Booking,
} from '../db/database';

/**
 * Tutto a DB è UTC. Le rules/exceptions invece sono in time-of-day Europe/Rome
 * (HH:MM). I confronti si fanno convertendo le rules in istanti UTC del giorno
 * richiesto. date-fns-tz gestisce DST automaticamente.
 */

export function getSettings(): BookingSettings {
  const row = db
    .prepare('SELECT * FROM booking_settings WHERE id = 1')
    .get() as BookingSettings | undefined;
  if (!row) {
    throw new Error('booking_settings riga id=1 mancante: seed non eseguito?');
  }
  return row;
}

export function parseHHMM(hhmm: string): { h: number; m: number } {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) throw new Error(`Orario non valido: ${hhmm}`);
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) {
    throw new Error(`Orario fuori range: ${hhmm}`);
  }
  return { h, m: min };
}

/** Restituisce 0..6 dove 0 = domenica, 6 = sabato (compatibile con getDay()). */
export function weekdayInTz(dateUtc: Date, timezone: string): number {
  const zoned = toZonedTime(dateUtc, timezone);
  return zoned.getDay();
}

/** Da 'YYYY-MM-DD' (in tz Europe/Rome) ai Date UTC inizio-giorno e fine-giorno. */
export function dayBoundsUtc(
  ymd: string,
  timezone: string
): { startUtc: Date; endUtc: Date } {
  const startUtc = fromZonedTime(`${ymd}T00:00:00`, timezone);
  const endUtc = fromZonedTime(`${ymd}T23:59:59.999`, timezone);
  return { startUtc, endUtc };
}

/** Combina 'YYYY-MM-DD' + 'HH:MM' (tz locale) → istante UTC. */
export function localDateTimeToUtc(
  ymd: string,
  hhmm: string,
  timezone: string
): Date {
  return fromZonedTime(`${ymd}T${hhmm}:00`, timezone);
}

/** Formatta un Date UTC come 'YYYY-MM-DD' nel tz dato. */
export function ymdInTz(dateUtc: Date, timezone: string): string {
  return formatTz(toZonedTime(dateUtc, timezone), 'yyyy-MM-dd', {
    timeZone: timezone,
  });
}

/** Formatta un Date UTC come 'HH:mm' nel tz dato. */
export function hhmmInTz(dateUtc: Date, timezone: string): string {
  return formatTz(toZonedTime(dateUtc, timezone), 'HH:mm', { timeZone: timezone });
}

export interface ComputedSlot {
  /** ISO 8601 UTC */
  startUtc: string;
  endUtc: string;
  /** 'HH:MM' Europe/Rome (per il frontend, evita di farlo client-side) */
  label: string;
}

/** Tutti i booking che "occupano" lo slot per un dato giorno (UTC bounds). */
function blockingBookings(startUtc: Date, endUtc: Date, nowUtc: Date): Booking[] {
  // Considera 'confirmed' sempre + 'pending' non scaduti.
  const rows = db
    .prepare(
      `SELECT * FROM bookings
        WHERE end_at > ? AND start_at < ?
          AND (
            status = 'confirmed'
            OR (status = 'pending' AND (hold_expires_at IS NULL OR hold_expires_at > ?))
          )`
    )
    .all(startUtc.toISOString(), endUtc.toISOString(), nowUtc.toISOString()) as Booking[];
  return rows;
}

/** Ritorna true se [aStart, aEnd) si sovrappone a [bStart, bEnd). */
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Costruisce gli intervalli "aperti" di un giorno specifico, combinando rules
 * settimanali + eccezioni (closed/open).
 */
function openIntervalsForDay(
  ymd: string,
  timezone: string
): { startUtc: Date; endUtc: Date }[] {
  // 1) Eccezione closed → giorno chiuso
  const closed = db
    .prepare(
      `SELECT * FROM availability_exceptions WHERE date = ? AND type = 'closed'`
    )
    .get(ymd) as AvailabilityException | undefined;
  if (closed) return [];

  const intervals: { startUtc: Date; endUtc: Date }[] = [];

  // 2) Rules ricorrenti per il weekday di quel giorno
  const dayUtc = fromZonedTime(`${ymd}T12:00:00`, timezone); // mezzogiorno per evitare DST edge
  const wd = weekdayInTz(dayUtc, timezone);
  const rules = db
    .prepare(
      `SELECT * FROM availability_rules
        WHERE active = 1 AND weekday = ?
        ORDER BY start_time ASC`
    )
    .all(wd) as AvailabilityRule[];
  for (const r of rules) {
    intervals.push({
      startUtc: localDateTimeToUtc(ymd, r.start_time, timezone),
      endUtc: localDateTimeToUtc(ymd, r.end_time, timezone),
    });
  }

  // 3) Eccezioni open su quel giorno (apertura straordinaria)
  const openExceptions = db
    .prepare(
      `SELECT * FROM availability_exceptions WHERE date = ? AND type = 'open'`
    )
    .all(ymd) as AvailabilityException[];
  for (const ex of openExceptions) {
    if (!ex.start_time || !ex.end_time) continue;
    intervals.push({
      startUtc: localDateTimeToUtc(ymd, ex.start_time, timezone),
      endUtc: localDateTimeToUtc(ymd, ex.end_time, timezone),
    });
  }

  // Merge intervalli sovrapposti per evitare slot duplicati
  intervals.sort((a, b) => a.startUtc.getTime() - b.startUtc.getTime());
  const merged: { startUtc: Date; endUtc: Date }[] = [];
  for (const iv of intervals) {
    const last = merged[merged.length - 1];
    if (last && iv.startUtc <= last.endUtc) {
      if (iv.endUtc > last.endUtc) last.endUtc = iv.endUtc;
    } else {
      merged.push({ ...iv });
    }
  }
  return merged;
}

/**
 * Calcola gli slot prenotabili per un giorno (in YYYY-MM-DD locale).
 * Esclude slot che si sovrappongono a booking confirmed/pending non scaduti.
 * Applica min_notice_hours e max_days_ahead.
 */
export function computeAvailableSlots(ymd: string): ComputedSlot[] {
  const settings = getSettings();
  const nowUtc = new Date();

  // Finestra di prenotabilità
  const maxAheadUtc = new Date(
    nowUtc.getTime() + settings.max_days_ahead * 24 * 3600 * 1000
  );
  const minNoticeUtc = new Date(
    nowUtc.getTime() + settings.min_notice_hours * 3600 * 1000
  );

  const { startUtc: dayStart, endUtc: dayEnd } = dayBoundsUtc(ymd, settings.timezone);

  // Giorno fuori finestra ammessa
  if (dayEnd < nowUtc || dayStart > maxAheadUtc) return [];

  const intervals = openIntervalsForDay(ymd, settings.timezone);
  if (intervals.length === 0) return [];

  const blockers = blockingBookings(dayStart, dayEnd, nowUtc);
  const stepMs = settings.slot_minutes * 60 * 1000;
  const bufferMs = settings.buffer_minutes * 60 * 1000;

  const out: ComputedSlot[] = [];
  for (const iv of intervals) {
    let cursor = iv.startUtc.getTime();
    while (cursor + stepMs <= iv.endUtc.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor + stepMs);

      // Filtra slot troppo vicini (min notice)
      if (slotStart >= minNoticeUtc) {
        const conflict = blockers.some((b) =>
          overlaps(
            slotStart,
            slotEnd,
            new Date(b.start_at),
            new Date(b.end_at)
          )
        );
        if (!conflict) {
          out.push({
            startUtc: slotStart.toISOString(),
            endUtc: slotEnd.toISOString(),
            label: hhmmInTz(slotStart, settings.timezone),
          });
        }
      }
      cursor += stepMs + bufferMs;
    }
  }
  return out;
}

/**
 * Verifica disponibilità di uno slot specifico ESATTO.
 * Usato dal flow create per validare l'input client prima del checkout.
 */
export function isSlotStillAvailable(startUtc: string, endUtc: string): boolean {
  const settings = getSettings();
  const ymd = ymdInTz(new Date(startUtc), settings.timezone);
  const slots = computeAvailableSlots(ymd);
  return slots.some((s) => s.startUtc === startUtc && s.endUtc === endUtc);
}

/**
 * Calcola il numero massimo TEORICO di slot in un giorno, ignorando i booking
 * esistenti. Usato per distinguere "free" da "partial" nel summary del calendario.
 */
function countMaxSlotsForDay(ymd: string, timezone: string): number {
  const intervals = openIntervalsForDay(ymd, timezone);
  if (intervals.length === 0) return 0;
  const settings = getSettings();
  const stepMs = settings.slot_minutes * 60 * 1000;
  const bufferMs = settings.buffer_minutes * 60 * 1000;
  let count = 0;
  for (const iv of intervals) {
    let cursor = iv.startUtc.getTime();
    while (cursor + stepMs <= iv.endUtc.getTime()) {
      count++;
      cursor += stepMs + bufferMs;
    }
  }
  return count;
}

export type DayStatus = 'free' | 'partial' | 'full' | 'closed';

export interface DaySummary {
  date: string;     // 'YYYY-MM-DD'
  status: DayStatus;
}

/**
 * Riepilogo disponibilità per un intervallo di date (inclusivo).
 * Performance: una manciata di query SQLite per giorno, irrilevante per range di
 * 30-60 giorni. Da rivedere se si arriverà a range mensili tipo 365 gg.
 */
export function computeRangeSummary(fromYmd: string, toYmd: string): DaySummary[] {
  const settings = getSettings();
  const tz = settings.timezone;
  const out: DaySummary[] = [];

  // Iterazione per giorno usando UTC noon come ancora (safe vs DST).
  const start = new Date(`${fromYmd}T12:00:00Z`);
  const end = new Date(`${toYmd}T12:00:00Z`);
  if (start > end) return out;

  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const ymd = d.toISOString().slice(0, 10);
    const max = countMaxSlotsForDay(ymd, tz);
    if (max === 0) {
      out.push({ date: ymd, status: 'closed' });
      continue;
    }
    const free = computeAvailableSlots(ymd).length;
    let status: DayStatus;
    if (free === 0) status = 'full';
    else if (free === max) status = 'free';
    else status = 'partial';
    out.push({ date: ymd, status });
  }
  return out;
}
