# Valentina Andolfi — Sito + Blog CMS

Sito pubblico + CMS admin per il blog di [valentinaandolfi.it](https://valentinaandolfi.it).

```
/var/www/valentina/
├── frontend/      # sito pubblico (React + Vite + Tailwind + shadcn)
├── admin/         # CMS admin (React + Vite + Tailwind + TipTap)
├── backend/       # API REST (Node + Express + SQLite)
├── nginx/         # snippet di configurazione Nginx
├── ecosystem.config.js   # PM2
└── deploy.sh      # build + restart completo
```

---

## Architettura

- **Frontend pubblico** → build statica servita da Nginx su `valentinaandolfi.it`.
  Chiama `/api/articles` (stesso origin, proxy Nginx → Node 3001).
- **Admin CMS** → build statica servita da Nginx su `valentinaandolfi.it/gestione-contenuti-vra2024`.
  Protetto da login JWT. URL segreto + `X-Robots-Tag: noindex`.
- **Backend** → Node/Express in ascolto su `127.0.0.1:3001`, gestito da PM2.
  Database SQLite (`backend/data/blog.db`), immagini in `backend/uploads/`.
- **Nginx** fa da reverse proxy per `/api`, `/sitemap.xml` e serve `/uploads/*` direttamente.

---

## Prima installazione sul VPS

### 1. Clona/copia i file e installa le dipendenze

```bash
cd /var/www/valentina

# Backend
cd backend
cp .env.example .env
#   → modifica .env: genera JWT_SECRET (64+ char hex) e imposta ADMIN_EMAIL/ADMIN_PASSWORD
nano .env
npm ci
npm run build
cd ..

# Frontend
cd frontend
npm ci
npm run build
cd ..

# Admin
cd admin
npm ci
npm run build
cd ..
```

Per generare un `JWT_SECRET` sicuro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Avvia il backend con PM2

```bash
cd /var/www/valentina
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # (solo la prima volta, per l'avvio automatico al boot)
```

Al primo avvio il backend:
- crea il database SQLite in `backend/data/blog.db`
- crea l'utente admin con le credenziali di `.env` (se non esiste)

### 3. Configura Nginx

Copia lo snippet `nginx/valentina.conf` dentro il tuo server block
(`/etc/nginx/sites-available/valentina`), poi:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Lo snippet aggiunge:
- `/gestione-contenuti-vra2024` → admin SPA
- `/api` → proxy a Node
- `/sitemap.xml` → proxy al sitemap dinamico
- `/uploads` → servizio statico delle immagini caricate

### 4. Verifica

```bash
curl https://valentinaandolfi.it/api/health
# → {"status":"ok",...}

curl https://valentinaandolfi.it/sitemap.xml | head
# → <?xml version="1.0" encoding="UTF-8"?>
```

---

## Accesso all'admin

Vai su: **https://valentinaandolfi.it/gestione-contenuti-vra2024**

Login con `ADMIN_EMAIL` / `ADMIN_PASSWORD` impostati in `backend/.env`.

> ⚠️ L'URL admin non è referenziato da nessuna pagina pubblica né dal sitemap.
> Condividilo solo con chi deve accedere.

### Funzionalità admin

- **Dashboard** — statistiche e ultimi articoli
- **Lista articoli** — filtro bozze/pubblicati, pubblica/bozza/elimina
- **Editor articolo** — TipTap rich text con:
  - titoli H1/H2/H3, paragrafo, colore testo, allineamento
  - grassetto/corsivo/sottolineato/barrato
  - liste puntate/numerate, citazioni, separatori
  - link + immagini inline con 4 modalità di allineamento
    (sinistra / centro / destra / larghezza intera)
  - annulla/ripristina
- **Metadati SEO** per ogni articolo (meta title, meta description, excerpt)
- **Cover image** via drag&drop
- **Anteprima** bozza su `/blog/[slug]?preview=true`

---

## Deploy successivi

Un solo comando ricompila tutto e riavvia:

```bash
bash /var/www/valentina/deploy.sh
```

Lo script esegue `npm ci && build` per frontend, admin e backend,
riavvia PM2 e ricarica Nginx.

---

## Sviluppo in locale

```bash
# Backend
cd backend
cp .env.example .env        # configura le variabili
npm install
npm run dev                 # http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev                 # http://localhost:8080

# Admin
cd admin
npm install
npm run dev                 # http://localhost:5174/gestione-contenuti-vra2024
```

Gli `.env.development` di frontend/admin puntano già a `http://localhost:3001`.

---

## API reference (essenziale)

### Pubbliche

| Metodo | Path | Descrizione |
|---|---|---|
| GET | `/api/articles?limit=3&category=Benessere` | lista articoli pubblicati |
| GET | `/api/articles/:slug` | singolo articolo per slug |
| GET | `/sitemap.xml` | sitemap XML (pagine statiche + blog) |
| GET | `/api/health` | healthcheck |

### Admin (richiedono `Authorization: Bearer <token>`)

| Metodo | Path | Descrizione |
|---|---|---|
| POST | `/api/auth/login` | login → `{ token, user }` |
| GET | `/api/auth/me` | verifica token |
| GET | `/api/admin/articles` | lista (anche bozze) |
| GET | `/api/admin/articles/:id` | singolo per id |
| POST | `/api/admin/articles` | crea |
| PUT | `/api/admin/articles/:id` | aggiorna |
| DELETE | `/api/admin/articles/:id` | elimina |
| PATCH | `/api/admin/articles/:id/publish` | pubblica |
| PATCH | `/api/admin/articles/:id/unpublish` | metti in bozza |
| POST | `/api/admin/upload` | upload immagine (`multipart/form-data`, campo `file`) |

---

## SEO & GEO

Ogni articolo include automaticamente:

- `<title>`, `<meta description>`, canonical
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type=article`, `og:url`, `og:locale=it_IT`
- Twitter Card: `summary_large_image`
- JSON-LD **BlogPosting** con: headline, description, image, datePublished,
  dateModified, author (Person), publisher (Organization), mainEntityOfPage,
  articleSection, wordCount, timeRequired, inLanguage

Il sitemap dinamico (`/sitemap.xml`) include tutte le pagine statiche e ogni
articolo pubblicato con `lastmod` aggiornato.

---

## Backup

Il database è un singolo file SQLite:

```bash
# Backup
cp /var/www/valentina/backend/data/blog.db /backup/blog-$(date +%F).db

# Immagini
tar -czf /backup/uploads-$(date +%F).tgz /var/www/valentina/backend/uploads
```

---

## Troubleshooting

- **`pm2 logs valentina-backend`** — log in tempo reale del backend
- **`tail -f /var/www/valentina/backend/logs/out.log`** — log storico
- **`sudo nginx -t`** — verifica configurazione Nginx
- **401 su /api/admin** — il token è scaduto, rifare login
- **CORS errors in dev** — controlla che `FRONTEND_URL` in `backend/.env` corrisponda all'origin del browser
