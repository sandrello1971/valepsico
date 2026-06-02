import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.DB_PATH || './data/blog.db';

// Assicuriamoci che la directory del DB esista
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(path.resolve(DB_PATH));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      category TEXT DEFAULT 'Benessere',
      status TEXT DEFAULT 'draft',
      featured INTEGER DEFAULT 0,
      read_time INTEGER DEFAULT 5,
      meta_title TEXT,
      meta_description TEXT,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      url TEXT NOT NULL,
      size INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS image_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slot_name TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      page TEXT NOT NULL,
      image_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ============================================================
    -- BOOKING SYSTEM
    -- ============================================================

    CREATE TABLE IF NOT EXISTS availability_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weekday INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS availability_exceptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_exceptions_date ON availability_exceptions(date);

    CREATE TABLE IF NOT EXISTS booking_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      slot_minutes INTEGER NOT NULL DEFAULT 50,
      buffer_minutes INTEGER NOT NULL DEFAULT 10,
      deposit_cents INTEGER NOT NULL DEFAULT 3000,
      currency TEXT NOT NULL DEFAULT 'eur',
      min_notice_hours INTEGER NOT NULL DEFAULT 24,
      max_days_ahead INTEGER NOT NULL DEFAULT 60,
      hold_minutes INTEGER NOT NULL DEFAULT 10,
      timezone TEXT NOT NULL DEFAULT 'Europe/Rome'
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      notes TEXT,
      modality TEXT NOT NULL DEFAULT 'presenza',
      status TEXT NOT NULL DEFAULT 'pending',
      deposit_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      stripe_payment_intent_id TEXT,
      google_event_id TEXT,
      hold_expires_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_at);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_session ON bookings(stripe_session_id);

    CREATE TABLE IF NOT EXISTS google_oauth (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      refresh_token TEXT,
      calendar_id TEXT DEFAULT 'primary',
      connected_email TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Settings applicativi key/value (Stripe keys, Google OAuth credentials,
    -- altri parametri runtime modificabili dall'admin). I valori in questa
    -- tabella hanno PRIORITÀ sulle variabili d'ambiente: il .env fa da
    -- fallback se la chiave non è presente qui.
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed booking_settings (singola riga id=1) se mancante
  const settingsCount = db
    .prepare('SELECT COUNT(*) as count FROM booking_settings')
    .get() as { count: number };
  if (settingsCount.count === 0) {
    db.prepare('INSERT INTO booking_settings (id) VALUES (1)').run();
    console.log('[db] Creata riga booking_settings di default');
  }

  // Seed image slots if empty
  const slotCount = db.prepare('SELECT COUNT(*) as count FROM image_slots').get() as { count: number };
  if (slotCount.count === 0) {
    const insertSlot = db.prepare(
      'INSERT INTO image_slots (slot_name, label, description, page) VALUES (?, ?, ?, ?)'
    );
    const slots = [
      ['hero-photo', 'Foto Hero', 'Foto seduta in studio, luce naturale', 'Home'],
      ['about-portrait', 'Ritratto Chi Sono (Home)', 'Ritratto ravvicinato, caldo', 'Home'],
      ['studio-room', 'Ambiente Studio', 'Ambiente studio, senza persone', 'Home'],
      ['about-personal', 'Foto Personale (Chi Sono)', 'Foto autentica, meno posata', 'Chi Sono'],
      ['about-working', 'Foto Lavoro (Chi Sono)', 'Foto alla scrivania / poltrone', 'Chi Sono'],
      ['services-detail', 'Dettaglio Studio (Percorsi)', 'Dettaglio studio (poltrona, luce)', 'Percorsi'],
      ['contact-portrait', 'Foto Contatti', 'Foto piccola, rassicurante', 'Contatti'],
    ];
    for (const [slot_name, label, description, page] of slots) {
      insertSlot.run(slot_name, label, description, page);
    }
    console.log('[db] Creati image slots predefiniti');
  }

  // Crea admin di default se non esiste
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = db
      .prepare('SELECT id FROM admin_users WHERE email = ?')
      .get(adminEmail) as { id: number } | undefined;

    if (!existing) {
      const hash = bcrypt.hashSync(adminPassword, 12);
      db.prepare(
        'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)'
      ).run(adminEmail, hash);
      console.log(`[db] Creato utente admin: ${adminEmail}`);
    }
  } else {
    console.warn(
      '[db] ADMIN_EMAIL o ADMIN_PASSWORD non impostati — nessun admin creato.'
    );
  }
}

// Tipi
export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  status: 'draft' | 'published';
  featured: number;
  read_time: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
}

export interface ImageSlot {
  id: number;
  slot_name: string;
  label: string;
  description: string | null;
  page: string;
  image_url: string | null;
  updated_at: string;
}

// ============================================================
// BOOKING SYSTEM TYPES
// ============================================================

export interface AvailabilityRule {
  id: number;
  weekday: number;        // 0=domenica … 6=sabato
  start_time: string;     // 'HH:MM'
  end_time: string;       // 'HH:MM'
  active: number;         // 0|1
  created_at: string;
}

export type AvailabilityExceptionType = 'closed' | 'open';

export interface AvailabilityException {
  id: number;
  date: string;           // 'YYYY-MM-DD'
  type: AvailabilityExceptionType;
  start_time: string | null;
  end_time: string | null;
  note: string | null;
  created_at: string;
}

export interface BookingSettings {
  id: 1;
  slot_minutes: number;
  buffer_minutes: number;
  deposit_cents: number;
  currency: string;
  min_notice_hours: number;
  max_days_ahead: number;
  hold_minutes: number;
  timezone: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'expired' | 'cancelled';
export type BookingModality = 'presenza' | 'online';

export interface Booking {
  id: number;
  start_at: string;             // ISO 8601 UTC
  end_at: string;               // ISO 8601 UTC
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
  modality: BookingModality;
  status: BookingStatus;
  deposit_cents: number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  google_event_id: string | null;
  hold_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleOauth {
  id: 1;
  refresh_token: string | null;
  calendar_id: string;
  connected_email: string | null;
  updated_at: string;
}

export interface AppSetting {
  key: string;
  value: string | null;
  updated_at: string;
}
