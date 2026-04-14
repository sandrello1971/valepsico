import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { blogApi, resolveImageUrl, formatDate, type Article } from '@/lib/api';

const DEFAULT_CATEGORIES = [
  'Tutti',
  'Benessere',
  'Relazioni',
  'Crescita Personale',
  'Mindfulness',
  'Ansia',
  'Coppia',
];

const Blog = () => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');

  useEffect(() => {
    blogApi
      .list()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  // Categorie effettivamente presenti + quelle di default
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    articles?.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  const filtered = useMemo(() => {
    if (!articles) return [];
    if (activeCategory === 'Tutti') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => a.id !== featured?.id);

  return (
    <div className="section-padding">
      <SEOHead
        title="Blog di Psicologia - Articoli su Benessere e Crescita Personale"
        description="Articoli, riflessioni e strumenti pratici di psicologia per il benessere emotivo, la crescita personale, la gestione dell'ansia e il miglioramento delle relazioni."
        path="/blog"
      />
      <div className="max-w-6xl mx-auto container-padding">
        {/* Page Header */}
        <header className="text-center mb-16 animate-fade-up">
          <h1 className="text-section-title mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Articoli, riflessioni e strumenti pratici per il tuo benessere
            psicologico. Esplora temi di crescita personale, relazioni e salute mentale.
          </p>
        </header>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full ${
                activeCategory === category ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="bg-muted h-48" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            Nessun articolo disponibile.
          </div>
        )}

        {/* Featured Article */}
        {featured && <FeaturedCard article={featured} />}

        {/* Articles Grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card className="bg-primary text-primary-foreground text-center animate-fade-up">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Rimani aggiornato</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Iscriviti alla newsletter per ricevere i nuovi articoli e consigli pratici
              per il tuo benessere psicologico direttamente nella tua inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground"
              />
              <Button className="bg-white text-primary hover:bg-white/90 px-8">
                Iscriviti
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const FeaturedCard = ({ article }: { article: Article }) => {
  const cover = resolveImageUrl(article.cover_image);

  return (
    <Link to={`/blog/${article.slug}`} className="block">
      <Card className="mb-16 overflow-hidden animate-fade-up bg-gradient-hero hover:shadow-2xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="bg-primary/10 p-12 flex items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    In Evidenza
                  </span>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
                {article.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(article.published_at || article.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {article.read_time} min di lettura
                  </div>
                </div>
                <Button className="btn-primary">
                  Leggi l'articolo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gradient-primary min-h-[300px] lg:min-h-[400px]">
              {cover && (
                <img
                  src={cover}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  const cover = resolveImageUrl(article.cover_image);

  return (
    <Link to={`/blog/${article.slug}`} className="group block">
      <Card className="animate-fade-up hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
        <CardContent className="p-0">
          <div className="h-48 overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="bg-gradient-warm h-full w-full" aria-hidden="true" />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-accent/20 text-accent px-2 py-1 rounded text-sm font-medium">
                {article.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(article.published_at || article.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {article.read_time} min
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-3 leading-tight group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80">
              Leggi di più
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Blog;
