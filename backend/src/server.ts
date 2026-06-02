import path from 'path';
import dotenv from 'dotenv';

// Carica il .env dalla root del backend, indipendentemente dalla cwd del processo.
// In produzione __dirname = backend/dist, quindi .. → backend/.
// In sviluppo (tsx) __dirname = backend/src, idem.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';

import { initDatabase } from './db/database';
import authRoutes from './routes/auth';
import { publicArticlesRouter, adminArticlesRouter } from './routes/articles';
import uploadsRoutes from './routes/uploads';
import sitemapRoutes from './routes/sitemap';
import { publicImageSlotsRouter, adminImageSlotsRouter } from './routes/imageSlots';
import contactRoutes from './routes/contact';
import {
  bookingRouter,
  adminBookingRouter,
  googleOauthCallbackRouter,
  runExpireSweep,
  stripeWebhookHandler,
} from './routes/booking';

const PORT = Number(process.env.PORT || 3001);
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://valentinaandolfi.it';
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || './uploads');

const app = express();

// CORS
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:8080',
];
app.use(
  cors({
    origin: (origin, cb) => {
      // richieste senza origin (curl, server-to-server) → consenti
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origine non consentita: ${origin}`));
    },
    credentials: true,
  })
);

// CRITICO: il webhook Stripe deve ricevere il body raw (Buffer) per verificare
// la firma. Va montato PRIMA del middleware express.json(), altrimenti il body
// viene già parsato e la verifica della firma fallisce.
app.post(
  '/api/booking/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Inizializza DB + admin
initDatabase();

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static per immagini caricate (fallback se Nginx non intercetta /uploads)
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1y', immutable: true }));

// Sitemap (servito a /sitemap.xml)
app.use('/', sitemapRoutes);

// Auth
app.use('/api/auth', authRoutes);

// Articles
app.use('/api/articles', publicArticlesRouter);
app.use('/api/admin/articles', adminArticlesRouter);

// Uploads
app.use('/api/admin/upload', uploadsRoutes);

// Image Slots
app.use('/api/image-slots', publicImageSlotsRouter);
app.use('/api/admin/image-slots', adminImageSlotsRouter);

// Contact form
app.use('/api/contact', contactRoutes);

// Booking (il webhook è già montato sopra con express.raw)
app.use('/api/booking', bookingRouter);
app.use('/api/booking', googleOauthCallbackRouter); // /google/oauth/callback (no auth)
app.use('/api/admin/booking', adminBookingRouter);

// 404
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Error handler finale
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[error]', err);
    res.status(500).json({ error: err.message || 'Errore interno' });
  }
);

app.listen(PORT, () => {
  console.log(`[server] In ascolto su http://localhost:${PORT}`);
  console.log(`[server] FRONTEND_URL: ${FRONTEND_URL}`);
  console.log(`[server] UPLOADS_DIR: ${UPLOADS_DIR}`);
});

// Cleanup periodico delle prenotazioni 'pending' scadute.
// Frequenza: ogni 2 minuti. Esegue anche subito all'avvio.
const EXPIRE_SWEEP_MS = 2 * 60 * 1000;
runExpireSweep();
setInterval(runExpireSweep, EXPIRE_SWEEP_MS).unref();
