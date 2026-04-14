import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';
import { blogApi, resolveImageUrl, formatDate, type Article } from '@/lib/api';

const SITE_URL = 'https://valentinaandolfi.it';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Reset quando cambia lo slug
    setArticle(null);
    setLoading(true);
    setError(null);

    blogApi
      .getBySlug(slug)
      .then(async (a) => {
        setArticle(a);
        // Carica articoli correlati (stessa categoria)
        try {
          const rel = await blogApi.list({ limit: 6, category: a.category });
          setRelated(rel.filter((r) => r.id !== a.id).slice(0, 3));
        } catch {
          setRelated([]);
        }
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));

    // Scroll in cima all'articolo al cambio slug
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="section-padding">
        <SEOHead
          title="Articolo non trovato"
          description="L'articolo cercato non esiste o è stato rimosso."
          path={`/blog/${slug}`}
        />
        <div className="max-w-4xl mx-auto container-padding text-center py-24">
          <h1 className="text-3xl font-bold mb-4">Articolo non trovato</h1>
          <p className="text-muted-foreground mb-8">
            L'articolo che stai cercando non esiste o è stato rimosso.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const coverUrl = resolveImageUrl(article.cover_image);
  const publishedAt = article.published_at || article.created_at;
  const wordCount = article.content
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const metaTitle = article.meta_title || article.title;
  const metaDescription =
    article.meta_description || article.excerpt || article.title;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: metaDescription,
    ...(coverUrl ? { image: coverUrl } : {}),
    datePublished: new Date(publishedAt).toISOString(),
    dateModified: new Date(article.updated_at).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Valentina Rita Andolfi',
      jobTitle: 'Psicologa e Psicoterapeuta',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Valentina Rita Andolfi - Psicologa',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    articleSection: article.category,
    wordCount,
    timeRequired: `PT${article.read_time}M`,
    inLanguage: 'it-IT',
  };

  return (
    <article>
      <SEOHead
        title={`${metaTitle} | Blog Valentina Andolfi`}
        description={metaDescription}
        path={`/blog/${article.slug}`}
        type="article"
        image={coverUrl || undefined}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <header className="relative">
        <div className="relative h-[50vh] min-h-[360px] max-h-[560px] overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto container-padding w-full pb-10 md:pb-16 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-white/90">
                  <Clock size={14} />
                  {article.read_time} min di lettura
                </span>
                <span className="flex items-center gap-1 text-sm text-white/90">
                  <Calendar size={14} />
                  <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-lg md:text-xl text-white/90 mt-4 max-w-3xl">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-3xl mx-auto container-padding py-12 md:py-16">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="clear-both mt-12 pt-8 border-t border-border text-center">
          <Button asChild variant="outline">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="max-w-6xl mx-auto container-padding">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Articoli correlati
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((a) => (
                <RelatedCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

const RelatedCard = ({ article }: { article: Article }) => {
  const cover = resolveImageUrl(article.cover_image);

  return (
    <Link to={`/blog/${article.slug}`} className="group block">
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="h-40 overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="bg-gradient-warm h-full" aria-hidden="true" />
            )}
          </div>
          <div className="p-5">
            <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded">
              {article.category}
            </span>
            <h3 className="text-lg font-semibold mt-3 mb-2 leading-tight group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            <time
              dateTime={article.published_at || article.created_at}
              className="text-xs text-muted-foreground"
            >
              {formatDate(article.published_at || article.created_at)}
            </time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogArticle;
