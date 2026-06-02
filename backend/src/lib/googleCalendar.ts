import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { db, GoogleOauth } from '../db/database';
import { getEffectiveSetting } from './appSettings';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const DEFAULT_REDIRECT = 'https://valentinaandolfi.it/api/booking/google/oauth/callback';

export function getOauthRow(): GoogleOauth | undefined {
  return db
    .prepare('SELECT * FROM google_oauth WHERE id = 1')
    .get() as GoogleOauth | undefined;
}

function saveOauthRow(data: {
  refresh_token?: string | null;
  calendar_id?: string;
  connected_email?: string | null;
}) {
  const existing = getOauthRow();
  if (!existing) {
    db.prepare(
      `INSERT INTO google_oauth (id, refresh_token, calendar_id, connected_email, updated_at)
       VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).run(
      data.refresh_token ?? null,
      data.calendar_id ?? 'primary',
      data.connected_email ?? null
    );
  } else {
    db.prepare(
      `UPDATE google_oauth
         SET refresh_token = COALESCE(?, refresh_token),
             calendar_id  = COALESCE(?, calendar_id),
             connected_email = COALESCE(?, connected_email),
             updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`
    ).run(
      data.refresh_token ?? null,
      data.calendar_id ?? null,
      data.connected_email ?? null
    );
  }
}

export function disconnectGoogle() {
  db.prepare(
    `UPDATE google_oauth
        SET refresh_token = NULL,
            connected_email = NULL,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`
  ).run();
}

function newOauthClient(): OAuth2Client {
  const clientId = getEffectiveSetting('google.client_id');
  const clientSecret = getEffectiveSetting('google.client_secret');
  const redirectUri = getEffectiveSetting('google.oauth_redirect') || DEFAULT_REDIRECT;
  if (!clientId || !clientSecret) {
    throw new Error(
      'Google OAuth non configurato: imposta client_id e client_secret dalla pagina Integrazioni.'
    );
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function isGoogleOauthConfigured(): boolean {
  return (
    getEffectiveSetting('google.client_id').length > 0 &&
    getEffectiveSetting('google.client_secret').length > 0
  );
}

export function buildConsentUrl(state: string): string {
  const oauth2 = newOauthClient();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // forza il rilascio di un refresh_token nuovo ad ogni consent
    scope: SCOPES,
    state,
    include_granted_scopes: true,
  });
}

export async function exchangeCodeForTokens(code: string): Promise<{
  refresh_token: string;
  email: string | null;
}> {
  const oauth2 = newOauthClient();
  const { tokens } = await oauth2.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error(
      "Google non ha restituito un refresh_token. Revoca l'accesso esistente e ripeti il consent."
    );
  }

  // Recupera l'email dell'account collegato
  oauth2.setCredentials(tokens);
  let email: string | null = null;
  try {
    const userInfo = await google.oauth2({ version: 'v2', auth: oauth2 }).userinfo.get();
    email = userInfo.data.email ?? null;
  } catch {
    // non bloccante: il calendario si crea anche senza email rilevata
  }

  saveOauthRow({ refresh_token: tokens.refresh_token, connected_email: email });
  return { refresh_token: tokens.refresh_token, email };
}

function getAuthorizedClient(): OAuth2Client {
  const row = getOauthRow();
  if (!row?.refresh_token) {
    throw new Error('Google Calendar non collegato: nessun refresh_token salvato');
  }
  const oauth2 = newOauthClient();
  oauth2.setCredentials({ refresh_token: row.refresh_token });
  return oauth2;
}

function getCalendar(): { client: calendar_v3.Calendar; calendarId: string } {
  const auth = getAuthorizedClient();
  const row = getOauthRow();
  const calendarId = row?.calendar_id || 'primary';
  return { client: google.calendar({ version: 'v3', auth }), calendarId };
}

export interface CreateEventInput {
  summary: string;
  description: string;
  startUtc: string;   // ISO 8601 UTC
  endUtc: string;
  attendeeEmail: string;
  attendeeName: string;
  timezone: string;   // es. 'Europe/Rome'
  location?: string;
}

export async function createCalendarEvent(
  input: CreateEventInput
): Promise<{ id: string; htmlLink: string | null }> {
  const { client, calendarId } = getCalendar();
  const res = await client.events.insert({
    calendarId,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startUtc, timeZone: input.timezone },
      end: { dateTime: input.endUtc, timeZone: input.timezone },
      attendees: [
        { email: input.attendeeEmail, displayName: input.attendeeName },
      ],
      location: input.location,
      reminders: { useDefault: true },
    },
    sendUpdates: 'all', // invia inviti agli attendee
  });
  if (!res.data.id) {
    throw new Error('Google Calendar: event id mancante nella risposta');
  }
  return { id: res.data.id, htmlLink: res.data.htmlLink ?? null };
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const { client, calendarId } = getCalendar();
  await client.events.delete({
    calendarId,
    eventId,
    sendUpdates: 'all',
  });
}

export function isConnected(): boolean {
  const row = getOauthRow();
  return !!row?.refresh_token;
}
