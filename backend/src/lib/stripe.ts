import Stripe from 'stripe';
import { getEffectiveSetting } from './appSettings';

// Nota tipi: il .d.ts CJS di stripe@22 (cjs/stripe.cjs.node.d.ts) usa
// `export = StripeConstructor`, il che rompe l'accesso a `Stripe.Checkout.Session`
// e all'uso di `Stripe` come tipo se non c'è un value-use al top-level del
// modulo. Per evitarlo costruiamo il client tramite una factory locale e
// ricaviamo il tipo via ReturnType. Le route che servono i tipi del namespace
// (Checkout.Session, Event, ecc.) usano interfacce locali in booking.ts.

const STRIPE_API_VERSION = '2026-05-27.dahlia' as const;

function buildClient(key: string) {
  return new Stripe(key, {
    apiVersion: STRIPE_API_VERSION,
    appInfo: {
      name: 'valentinaandolfi.it booking',
      version: '1.0.0',
    },
  });
}

type StripeInstance = ReturnType<typeof buildClient>;

/**
 * Client Stripe lazy: viene istanziato al primo uso, e ricostruito se la
 * secret_key cambia (es. l'admin la aggiorna via UI senza restart PM2).
 * Cache keyed-by-secret per evitare di ricostruire ad ogni request.
 */
let _client: StripeInstance | null = null;
let _clientForKey: string | null = null;

function currentSecretKey(): string {
  return getEffectiveSetting('stripe.secret_key');
}

export function isStripeConfigured(): boolean {
  return currentSecretKey().length > 0;
}

/**
 * Ritorna un'istanza Stripe pronta all'uso. Lancia se la secret_key non è
 * configurata né in DB né in .env. Le route che chiamano questa funzione devono
 * gestire l'eccezione e ritornare 503 al client.
 */
export function getStripe(): StripeInstance {
  const key = currentSecretKey();
  if (!key) {
    throw new Error(
      'Stripe non configurato: imposta la secret key dalla pagina Integrazioni.'
    );
  }
  if (_client && _clientForKey === key) return _client;
  _client = buildClient(key);
  _clientForKey = key;
  return _client;
}

/**
 * Webhook signing secret. Letto al volo ad ogni richiesta webhook → cambiare
 * il valore in DB ha effetto immediato per i webhook successivi.
 */
export function getWebhookSecret(): string {
  const s = getEffectiveSetting('stripe.webhook_secret');
  if (!s) {
    throw new Error(
      'Webhook secret Stripe non configurato: imposta il valore dalla pagina Integrazioni.'
    );
  }
  return s;
}
