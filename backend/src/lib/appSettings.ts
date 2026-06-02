import { db } from '../db/database';

/**
 * Chiavi note (white-list) usate dall'app. Tenere allineato con la UI admin.
 * I valori sono stringhe; un valore NULL o vuoto significa "non impostato"
 * → il backend usa il fallback su variabile d'ambiente.
 */
export type AppSettingKey =
  | 'stripe.secret_key'
  | 'stripe.webhook_secret'
  | 'google.client_id'
  | 'google.client_secret'
  | 'google.oauth_redirect';

export const ALL_KEYS: readonly AppSettingKey[] = [
  'stripe.secret_key',
  'stripe.webhook_secret',
  'google.client_id',
  'google.client_secret',
  'google.oauth_redirect',
];

/** Mapping chiave → env var di fallback. */
const ENV_FALLBACK: Record<AppSettingKey, string> = {
  'stripe.secret_key': 'STRIPE_SECRET_KEY',
  'stripe.webhook_secret': 'STRIPE_WEBHOOK_SECRET',
  'google.client_id': 'GOOGLE_CLIENT_ID',
  'google.client_secret': 'GOOGLE_CLIENT_SECRET',
  'google.oauth_redirect': 'GOOGLE_OAUTH_REDIRECT',
};

/** Indica se una chiave contiene un valore sensibile (da non echeggiare). */
const IS_SECRET: Record<AppSettingKey, boolean> = {
  'stripe.secret_key': true,
  'stripe.webhook_secret': true,
  'google.client_id': false,    // semi-pubblico (lato client OAuth), ma trattiamolo come "non echeggiare in chiaro"
  'google.client_secret': true,
  'google.oauth_redirect': false,
};

export function isSecretKey(key: AppSettingKey): boolean {
  return IS_SECRET[key];
}

/**
 * Legge il valore di una chiave: prima dal DB, poi fallback alla variabile
 * d'ambiente corrispondente. Ritorna stringa vuota se nessuna delle due è
 * impostata (caller decide cosa fare).
 */
export function getEffectiveSetting(key: AppSettingKey): string {
  const row = db
    .prepare('SELECT value FROM app_settings WHERE key = ?')
    .get(key) as { value: string | null } | undefined;
  if (row && row.value && row.value.length > 0) return row.value;
  const envVar = ENV_FALLBACK[key];
  return process.env[envVar] || '';
}

/**
 * Aggiorna il valore di una chiave. Valore vuoto / null = elimina la riga.
 */
export function setSetting(key: AppSettingKey, value: string | null): void {
  if (value === null || value.trim() === '') {
    db.prepare('DELETE FROM app_settings WHERE key = ?').run(key);
    return;
  }
  db.prepare(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
  ).run(key, value);
}

/** Indica se la chiave ha un valore EFFETTIVO (DB o env). */
export function isConfigured(key: AppSettingKey): boolean {
  return getEffectiveSetting(key).length > 0;
}

/** Indica se la chiave è settata nel DB (non solo via env). */
export function isInDb(key: AppSettingKey): boolean {
  const row = db
    .prepare('SELECT value FROM app_settings WHERE key = ?')
    .get(key) as { value: string | null } | undefined;
  return !!(row && row.value && row.value.length > 0);
}

/** Mostra solo gli ultimi 4 caratteri di un secret. */
export function maskSecret(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '••••';
  return '•'.repeat(Math.max(4, value.length - 4)) + value.slice(-4);
}

export interface SettingStatus {
  key: AppSettingKey;
  is_configured: boolean;
  in_db: boolean;
  /** Per i NON-secret: il valore effettivo. Per i secret: solo masked preview. */
  display_value: string;
}

export function listStatuses(): SettingStatus[] {
  return ALL_KEYS.map((key) => {
    const value = getEffectiveSetting(key);
    const is_configured = value.length > 0;
    const in_db = isInDb(key);
    const display_value = is_configured
      ? (IS_SECRET[key] ? maskSecret(value) : value)
      : '';
    return { key, is_configured, in_db, display_value };
  });
}
