import { Router, Request, Response } from 'express';
import { db, Article } from '../db/database';
import { requireAuth } from '../middleware/auth';
import { slugify } from '../lib/slug';
import { sanitizeArticleHtml } from '../lib/sanitize';

/* ---------- helpers ---------- */

function mapArticle(row: Article) {
  return {
    ...row,
    featured: row.featured === 1,
  };
}

function ensureUniqueSlug(baseSlug: string, excludeId?: number): string {
  let slug = baseSlug || 'articolo';
  let i = 2;
  while (true) {
    const existing = db
      .prepare('SELECT id FROM articles WHERE slug = ? AND id != ?')
      .get(slug, excludeId ?? -1) as { id: number } | undefined;
    if (!existing) return slug;
    slug = `${baseSlug}-${i++}`;
  }
}

interface ArticleInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string | null;
  category?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
}

/* ---------- PUBLIC ROUTER ---------- */
export const publicArticlesRouter = Router();

// GET /api/articles?limit=3&category=Benessere
publicArticlesRouter.get('/', (req: Request, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10) || 50, 100);
  const category = req.query.category ? String(req.query.category) : null;

  let sql = "SELECT * FROM articles WHERE status = 'published'";
  const params: (string | number)[] = [];

  if (category && category !== 'Tutti') {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY published_at DESC, created_at DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(sql).all(...params) as Article[];
  return res.json(rows.map(mapArticle));
});

// GET /api/articles/:slug
publicArticlesRouter.get('/:slug', (req: Request, res: Response) => {
  const row = db
    .prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'")
    .get(req.params.slug) as Article | undefined;

  if (!row) {
    return res.status(404).json({ error: 'Articolo non trovato' });
  }
  return res.json(mapArticle(row));
});

/* ---------- ADMIN ROUTER ---------- */
export const adminArticlesRouter = Router();

adminArticlesRouter.use(requireAuth);

// GET /api/admin/articles
adminArticlesRouter.get('/', (_req: Request, res: Response) => {
  const rows = db
    .prepare('SELECT * FROM articles ORDER BY updated_at DESC')
    .all() as Article[];
  return res.json(rows.map(mapArticle));
});

// GET /api/admin/articles/:id
adminArticlesRouter.get('/:id', (req: Request, res: Response) => {
  const row = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(req.params.id) as Article | undefined;
  if (!row) return res.status(404).json({ error: 'Articolo non trovato' });
  return res.json(mapArticle(row));
});

// POST /api/admin/articles
adminArticlesRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as ArticleInput;
  if (!body.title || !body.content) {
    return res.status(400).json({ error: 'title e content sono obbligatori' });
  }

  const baseSlug = slugify(body.slug || body.title);
  const slug = ensureUniqueSlug(baseSlug);
  const cleanContent = sanitizeArticleHtml(body.content);
  const status = body.status === 'published' ? 'published' : 'draft';
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  const info = db
    .prepare(
      `INSERT INTO articles (
        title, slug, excerpt, content, cover_image, category,
        status, featured, read_time, meta_title, meta_description,
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      body.title,
      slug,
      body.excerpt ?? null,
      cleanContent,
      body.cover_image ?? null,
      body.category ?? 'Benessere',
      status,
      body.featured ? 1 : 0,
      body.read_time ?? 5,
      body.meta_title ?? null,
      body.meta_description ?? null,
      publishedAt
    );

  const created = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(info.lastInsertRowid) as Article;
  return res.status(201).json(mapArticle(created));
});

// PUT /api/admin/articles/:id
adminArticlesRouter.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id) as Article | undefined;
  if (!existing) return res.status(404).json({ error: 'Articolo non trovato' });

  const body = req.body as ArticleInput;
  const baseSlug = slugify(body.slug || body.title || existing.slug);
  const slug = ensureUniqueSlug(baseSlug, id);
  const cleanContent = body.content
    ? sanitizeArticleHtml(body.content)
    : existing.content;
  const status = body.status === 'published' ? 'published' : 'draft';

  // Imposta published_at al primo publish
  let publishedAt = existing.published_at;
  if (status === 'published' && !existing.published_at) {
    publishedAt = new Date().toISOString();
  }

  db.prepare(
    `UPDATE articles SET
      title = ?,
      slug = ?,
      excerpt = ?,
      content = ?,
      cover_image = ?,
      category = ?,
      status = ?,
      featured = ?,
      read_time = ?,
      meta_title = ?,
      meta_description = ?,
      published_at = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`
  ).run(
    body.title ?? existing.title,
    slug,
    body.excerpt ?? existing.excerpt,
    cleanContent,
    body.cover_image !== undefined ? body.cover_image : existing.cover_image,
    body.category ?? existing.category,
    status,
    body.featured ? 1 : 0,
    body.read_time ?? existing.read_time,
    body.meta_title ?? existing.meta_title,
    body.meta_description ?? existing.meta_description,
    publishedAt,
    id
  );

  const updated = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id) as Article;
  return res.json(mapArticle(updated));
});

// DELETE /api/admin/articles/:id
adminArticlesRouter.delete('/:id', (req: Request, res: Response) => {
  const info = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Articolo non trovato' });
  }
  return res.json({ success: true });
});

// PATCH /api/admin/articles/:id/publish
adminArticlesRouter.patch('/:id/publish', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id) as Article | undefined;
  if (!existing) return res.status(404).json({ error: 'Articolo non trovato' });

  const publishedAt = existing.published_at || new Date().toISOString();
  db.prepare(
    "UPDATE articles SET status = 'published', published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(publishedAt, id);

  const updated = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id) as Article;
  return res.json(mapArticle(updated));
});

// PATCH /api/admin/articles/:id/unpublish
adminArticlesRouter.patch('/:id/unpublish', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const info = db
    .prepare(
      "UPDATE articles SET status = 'draft', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Articolo non trovato' });
  }
  const updated = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id) as Article;
  return res.json(mapArticle(updated));
});
