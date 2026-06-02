import { createEvent, EventAttributes } from 'ics';

export interface IcsInput {
  uid: string;
  startUtc: string;       // ISO 8601 UTC
  endUtc: string;
  summary: string;
  description: string;
  location?: string;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
}

/**
 * Genera un file .ics (RFC 5545) come stringa.
 * Allegato di fallback alle email di conferma per chi non usa Google Calendar.
 */
export function buildIcs(input: IcsInput): string {
  const start = new Date(input.startUtc);
  const end = new Date(input.endUtc);

  const toArray = (d: Date): [number, number, number, number, number] => [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];

  const event: EventAttributes = {
    uid: input.uid,
    title: input.summary,
    description: input.description,
    location: input.location,
    start: toArray(start),
    startInputType: 'utc',
    startOutputType: 'utc',
    end: toArray(end),
    endInputType: 'utc',
    endOutputType: 'utc',
    organizer: { name: input.organizerName, email: input.organizerEmail },
    attendees: [
      {
        name: input.attendeeName,
        email: input.attendeeEmail,
        rsvp: true,
        partstat: 'NEEDS-ACTION',
        role: 'REQ-PARTICIPANT',
      },
    ],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    productId: 'valentinaandolfi.it/booking',
  };

  const { error, value } = createEvent(event);
  if (error || !value) {
    throw new Error(
      `Errore generazione .ics: ${error?.message ?? 'output vuoto'}`
    );
  }
  return value;
}
