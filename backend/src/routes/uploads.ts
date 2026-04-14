import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { db } from '../db/database';
import { requireAuth } from '../middleware/auth';

const router = Router();

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || './uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const hash = crypto.randomBytes(8).toString('hex');
    const ts = Date.now();
    cb(null, `${ts}-${hash}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Tipo di file non consentito'));
    }
    cb(null, true);
  },
});

// POST /api/admin/upload
router.post(
  '/',
  requireAuth,
  upload.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file ricevuto' });
    }

    const url = `/uploads/${req.file.filename}`;
    db.prepare(
      'INSERT INTO uploads (filename, original_name, url, size) VALUES (?, ?, ?, ?)'
    ).run(req.file.filename, req.file.originalname, url, req.file.size);

    return res.status(201).json({
      url,
      filename: req.file.filename,
      size: req.file.size,
    });
  }
);

// Error handler multer
router.use(
  (
    err: Error & { code?: string },
    _req: Request,
    res: Response,
    _next: unknown
  ) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ error: err.message });
    }
  }
);

export default router;
