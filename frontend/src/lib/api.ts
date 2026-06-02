/**
 * Client API pubblico per il blog.
 * Legge VITE_API_URL dall'environment:
 * - dev:  http://localhost:3001
 * - prod: https://valentinaandolfi.it (stesso origin via Nginx proxy)
 */
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  read_time: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

async function jsonFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Errore ${res.status}`);
  }
  return res.json();
}

// ============================================================
// BOOKING
// ============================================================

export interface BookingSettings {
  slot_minutes: number;
  deposit_cents: number;
  currency: string;
  min_notice_hours: number;
  max_days_ahead: number;
  timezone: string;
}

export interface AvailabilitySlot {
  startUtc: string;
  endUtc: string;
  label: string; // 'HH:MM' Europe/Rome
}

export interface AvailabilityResponse {
  date: string;
  slots: AvailabilitySlot[];
}

export type DayStatus = 'free' | 'partial' | 'full' | 'closed';

export interface DaySummary {
  date: string;
  status: DayStatus;
}

export interface AvailabilitySummaryResponse {
  from: string;
  to: string;
  days: DaySummary[];
}

export interface CreateBookingInput {
  start_at: string;
  end_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes?: string;
  modality: 'presenza' | 'online';
  privacy_consent: true;
}

export interface CreateBookingResponse {
  booking_id: number;
  session_id: string;
  checkout_url: string;
}

export interface ConfirmResponse {
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
  when_local: string;
  modality: 'presenza' | 'online';
  client_email: string;
}

async function jsonPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Errore ${res.status}`);
  }
  return res.json();
}

export const bookingApi = {
  settings() {
    return jsonFetch<BookingSettings>('/api/booking/settings');
  },
  availability(date: string) {
    return jsonFetch<AvailabilityResponse>(
      `/api/booking/availability?date=${encodeURIComponent(date)}`
    );
  },
  availabilitySummary(from: string, to: string) {
    return jsonFetch<AvailabilitySummaryResponse>(
      `/api/booking/availability/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
  },
  create(input: CreateBookingInput) {
    return jsonPost<CreateBookingResponse>('/api/booking/create', input);
  },
  confirm(sessionId: string) {
    return jsonFetch<ConfirmResponse>(
      `/api/booking/confirm?session_id=${encodeURIComponent(sessionId)}`
    );
  },
};

export const blogApi = {
  list(params?: { limit?: number; category?: string }) {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.category && params.category !== 'Tutti')
      qs.set('category', params.category);
    const q = qs.toString();
    return jsonFetch<Article[]>(`/api/articles${q ? `?${q}` : ''}`);
  },
  getBySlug(slug: string) {
    return jsonFetch<Article>(`/api/articles/${encodeURIComponent(slug)}`);
  },
};

/**
 * Risolve l'URL assoluto di un'immagine caricata dal backend.
 * - URL esterni → invariati
 * - path relativi `/uploads/...` → prefissati con API_URL (o origin in prod)
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // In prod API_URL == origin del sito, quindi l'URL risultante è corretto
  return `${API_URL}${url}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
