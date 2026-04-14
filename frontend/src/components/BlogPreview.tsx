import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogApi, resolveImageUrl, formatDate, type Article } from '@/lib/api';

const BlogPreview = () => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    blogApi
      .list({ limit: 3 })
      .then((data) => {
        if (!cancelled) setArticles(data);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fallback silenzioso: se l'API fallisce o non ci sono articoli, nascondi la sezione
  if (!loading && (!articles || articles.length === 0)) {
    return null;
  }

  return (
    <section className="section-padding bg-muted/20" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 id="blog-heading" className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Il mio blog: ascolto, racconto e intreccio racconti di vita
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ho molte cose da dirti, riflessioni e curiosità da condividere.
          </p>
          <p className="text-foreground font-bold text-lg">
            Segui il mio blog per scoprirle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : articles!.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>

        <div className="text-center">
          <Button asChild className="btn-primary">
            <Link to="/blog">
              Leggi tutti gli articoli
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  const coverUrl = resolveImageUrl(article.cover_image);

  return (
    <Link to={`/blog/${article.slug}`} className="group block">
      <Card className="h-full overflow-hidden shadow-elegant hover:shadow-2xl transition-all duration-300">
        <div className="aspect-video overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary" aria-hidden="true" />
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded">
              {article.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};

const SkeletonCard = () => (
  <Card className="overflow-hidden shadow-elegant">
    <div className="aspect-video bg-muted animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
      <div className="h-6 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
    </div>
  </Card>
);

export default BlogPreview;
