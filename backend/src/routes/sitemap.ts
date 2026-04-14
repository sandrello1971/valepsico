import { Router, Request, Response } from 'express';
import { db, Article } from '../db/database';

const router = Router();

const STATIC_PATHS: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/chi-sono', priority: '0.8', changefreq: 'monthly' },
  { path: '/servizi', priority: '0.9', changefreq: 'monthly' },
  { path: '/approccio', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/contatti', priority: '0.8', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/sitemap.xml', (_req: Request, res: Response) => {
  const frontendUrl = (process.env.FRONTEND_URL || 'https://valentinaandolfi.it').replace(
    /\/$/,
    ''
  );

  const articles = db
    .prepare(
      "SELECT slug, updated_at, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC"
    )
    .all() as Pick<Article, 'slug' | 'updated_at' | 'published_at'>[];

  const now = new Date().toISOString();
  const urls: string[] = [];

  for (const p of STATIC_PATHS) {
    urls.push(
      `  <url>\n    <loc>${escapeXml(frontendUrl + p.path)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    );
  }

  for (const a of articles) {
    const lastmod = a.updated_at || a.published_at || now;
    urls.push(
      `  <url>\n    <loc>${escapeXml(`${frontendUrl}/blog/${a.slug}`)}</loc>\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
