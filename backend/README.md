# valentina-backend

Backend Express + TypeScript + better-sqlite3 per **valentinaandolfi.it**.

## Avvio

```bash
npm install
cp .env.example .env  # poi compila i valori
npm run dev           # tsx watch
# oppure
npm run build && npm start
```

In produzione gira sotto PM2: `ecosystem.config.js` nella root del progetto.

## Sistema di prenotazione

### Endpoint pubblici (`/api/booking/*`)

| Endpoint | Note |
|---|---|
| `GET /api/booking/settings` | Espone slot_minutes, deposit_cents, max_days_ahead… |
| `GET /api/booking/availability?date=YYYY-MM-DD` | Slot liberi del giorno (Europe/Rome) |
| `POST /api/booking/create` | Crea booking `pending` + Stripe Checkout session |
| `POST /api/booking/webhook` | Webhook Stripe — **body raw** |
| `GET /api/booking/confirm?session_id=...` | Stato del booking dopo redirect Stripe |
| `GET /api/booking/google/oauth/callback` | Redirect URI OAuth Google (no auth) |

### Endpoint admin (`/api/admin/booking/*`, JWT)

- CRUD `rules` (regole settimanali) e `exceptions` (ferie/aperture)
- `GET/PUT /settings`
- `GET /bookings?from=&to=&status=`, `POST /bookings/:id/cancel`
- `GET /google/status`, `GET /google/oauth/start`, `POST /google/disconnect`

### Setup Stripe — registrazione webhook

1. Dashboard Stripe → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://valentinaandolfi.it/api/booking/webhook`
3. Eventi: spunta **solo** `checkout.session.completed` e `checkout.session.expired`
4. Salva, copia il **Signing secret** (`whsec_…`) nella variabile `STRIPE_WEBHOOK_SECRET` del `.env`
5. Riavvia PM2: `pm2 restart valentina-backend`

Verifica:
```bash
curl -i https://valentinaandolfi.it/api/booking/settings   # → 200 con settings
```

Test webhook in locale (opzionale):
```bash
stripe listen --forward-to localhost:3001/api/booking/webhook
stripe trigger checkout.session.completed
```

### Setup Google OAuth — primo collegamento

Il sistema crea automaticamente eventi sul calendario di Valentina al momento della conferma di una prenotazione. Usa OAuth con `refresh_token` salvato nel DB.

**Prima di tutto, nel Google Cloud Console**:

1. Crea/usa un progetto Google Cloud
2. **APIs & Services** → **Library** → abilita "Google Calendar API"
3. **APIs & Services** → **OAuth consent screen**
   - User type: External
   - Pubblica l'app: **stato "Published"** (non "Testing"!)
     - In stato Testing il `refresh_token` scade dopo 7 giorni e la sincronizzazione si rompe silenziosamente
   - Scope richiesto: solo `.../auth/calendar.events`
4. **APIs & Services** → **Credentials** → **Create credentials** → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://valentinaandolfi.it/api/booking/google/oauth/callback`
5. Copia `client_id` e `client_secret` nel `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_OAUTH_REDIRECT=https://valentinaandolfi.it/api/booking/google/oauth/callback
   ```

**Poi, dal pannello admin del sito**:

1. Accedere a `/gestione-contenuti-vra2024` → **Google Calendar**
2. Click su **Collega Google** → si apre la consent screen in una nuova tab
3. Selezionare l'account Google di Valentina, approvare il permesso `calendar.events`
4. Al ritorno, la pagina conferma "Google Calendar collegato"

Il `refresh_token` viene salvato in DB (`google_oauth` table). Da quel momento il backend rinnova autonomamente l'access token (durata 1h) ad ogni chiamata.

### Sanity check post-deploy

```bash
curl -i https://valentinaandolfi.it/api/booking/settings
# HTTP/2 200
# {"slot_minutes":50,"deposit_cents":3000,...}
```

### Architettura webhook (importante)

Il webhook Stripe richiede il **body raw** per la verifica della firma. In [`src/server.ts`](src/server.ts) viene montato esplicitamente con `express.raw()` **prima** di `express.json()`:

```ts
app.post('/api/booking/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);
app.use(express.json({ limit: '5mb' })); // tutto il resto
```

Tutto il resto dell'API resta JSON. Non spostare l'ordine.

### Anti-doppione (slot occupato)

In [`src/routes/booking.ts`](src/routes/booking.ts) il `POST /create` esegue una transazione `db.transaction(...)` di better-sqlite3 che ri-verifica `isSlotStillAvailable()` immediatamente prima dell'INSERT. Se due utenti cliccano lo stesso slot a 100ms di distanza, uno dei due riceve `409 Conflict`.

Uno slot è "occupato" se esiste un booking:
- `confirmed`, OPPURE
- `pending` con `hold_expires_at > now`

I `pending` scaduti vengono marcati `expired` da un setInterval di 2 minuti in [`server.ts`](src/server.ts).

### Schema DB

5 tabelle aggiunte: `availability_rules`, `availability_exceptions`, `booking_settings` (singleton), `bookings`, `google_oauth` (singleton). Definite in [`src/db/database.ts`](src/db/database.ts).

### Build & restart

```bash
npm run build      # tsc
pm2 restart valentina-backend
```
