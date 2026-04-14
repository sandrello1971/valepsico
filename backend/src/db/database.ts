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
  `);

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
