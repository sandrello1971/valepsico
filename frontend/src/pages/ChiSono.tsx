import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import valentinaPhoto from '@/assets/valentina-photo.png';
import SEOHead from '@/components/SEOHead';

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://valentinaandolfi.it/" },
    { "@type": "ListItem", "position": 2, "name": "Chi Sono", "item": "https://valentinaandolfi.it/chi-sono" }
  ]
};

const ChiSono = () => {
  return (
    <div className="section-padding">
      <SEOHead
        title="Chi Sono - Dott.ssa Valentina Rita Andolfi, Psicologa PhD"
        description="Psicologa, psicoterapeuta e ricercatrice a Milano. Laureata in Psicologia, Dottorato alla Tufts University di Boston, specializzata in Psicoterapia Umanistica. Approccio centrato sulla persona."
        path="/chi-sono"
        jsonLd={breadcrumbJsonLd}
      />
      <div className="max-w-4xl mx-auto container-padding">
        {/* Page Header */}
        <header className="text-center mb-16 animate-fade-up">
          <h1 className="text-section-title mb-4">Chi sono</h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto italic font-serif">
            Psicologa, Psicoterapeuta, Ricercatrice
          </p>
        </header>

        {/* La mia storia */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div className="animate-fade-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-2"></div>
              <img
                src={valentinaPhoto}
                alt="Valentina Rita Andolfi"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>

          <div className="animate-fade-up space-y-6">
            <h2 className="text-card-title text-primary">La mia storia</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Il mio incontro con la psicologia nasce presto, da una storia che mi ha profondamente colpita: quella di una bambina che, grazie alla relazione con qualcuno capace di comprenderla davvero, &egrave; riuscita a trasformare la propria vita.
              </p>
              <p>
                Da allora ho sentito con chiarezza quanto <strong>un incontro possa trasformare una vita.</strong>
              </p>
              <p>
                Nel tempo, questa intuizione &egrave; diventata il cuore del mio lavoro: <strong>la relazione come spazio in cui &egrave; possibile ritrovarsi.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Il mio approccio e il mio modo di lavorare */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Il mio approccio e il mio modo di lavorare</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Il mio lavoro si basa sull'<strong>Approccio Centrato sulla Persona</strong>, che mette al centro <strong>la tua esperienza, il tuo modo di sentire e il tuo ritmo</strong>.
              </p>
              <p>
                Credo che ogni persona possieda risorse profonde che, in alcuni momenti della vita, possono sembrare lontane o difficili da raggiungere.
              </p>
              <p>Per questo creo uno spazio in cui tu possa:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> sentirti <strong>accolto senza giudizio</strong></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> esplorare <strong>pensieri ed emozioni</strong> anche complessi</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> dare <strong>significato</strong> a ci&ograve; che stai vivendo</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> <strong>ritrovare un contatto</strong> pi&ugrave; autentico con te stesso</li>
              </ul>
              <p>
                Nel percorso non sei &ldquo;analizzato&rdquo;, ma <strong>ascoltato e compreso</strong>.
              </p>
              <p>
                <strong>Il cambiamento non nasce da una risposta giusta, ma da un incontro che permette di vedersi in modo nuovo.</strong>
              </p>
            </div>

            <blockquote className="mt-8 text-xl italic font-serif text-foreground border-l-4 border-primary pl-6">
              <p>&ldquo;Il vero viaggio di scoperta non consiste nel cercare nuove terre, ma nell'avere nuovi occhi.&rdquo;</p>
              <footer className="mt-2 text-lg text-muted-foreground not-italic">&mdash; Marcel Proust</footer>
            </blockquote>
          </CardContent>
        </Card>

        {/* Formazione */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Formazione</h2>
            <ul className="space-y-3 text-lg leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> Laurea in Psicologia, Empowerment e Benessere &mdash; Universit&agrave; Cattolica di Milano</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> Dottorato di ricerca (PhD) in Psicologia dello Sviluppo e del Benessere (co-tutela con Tufts University, Boston)</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> Specializzazione in Psicoterapia Umanistica &mdash; IACP Milano</li>
            </ul>
          </CardContent>
        </Card>

        {/* Valori */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6 text-center">Valori</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Empatia</h4>
                <p className="text-muted-foreground text-sm">Ascolto profondo e comprensione</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Rispetto</h4>
                <p className="text-muted-foreground text-sm">Attenzione all'unicit&agrave; di ogni persona</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Professionalit&agrave;</h4>
                <p className="text-muted-foreground text-sm">Competenza e aggiornamento continuo</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Riservatezza</h4>
                <p className="text-muted-foreground text-sm">Uno spazio sicuro e protetto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approccio approfondimento */}
        <Card className="animate-fade-up mb-16 bg-gradient-hero">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Approccio</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Il mio lavoro si basa sull'<strong>Approccio Centrato sulla Persona</strong>.
              </p>
              <p>
                Al centro ci sei tu: <strong>il tuo modo di sentire, la tua esperienza, il tuo ritmo</strong>.
              </p>
              <p>
                Creo uno spazio sicuro, in cui puoi esplorare pensieri, emozioni e vissuti anche complessi, senza giudizio.
              </p>
              <p>
                Credo profondamente che ogni persona abbia dentro di s&eacute; le risorse per affrontare le difficolt&agrave;.
              </p>
              <p>
                <strong>Il mio ruolo &egrave; accompagnarti nel riconoscerle e renderle accessibili.</strong>
              </p>
              <p>
                Questo significa che al centro del percorso ci sei tu. Credo che le risorse non debbano essere costruite, ma riconosciute. Sono gi&agrave; dentro di te.
              </p>
              <p>
                Il cambiamento nasce da un incontro che permette di vedersi in modo nuovo.
              </p>
            </div>

            <blockquote className="mt-8 text-xl italic font-serif text-foreground border-l-4 border-primary pl-6">
              <p>&ldquo;&Egrave; nel momento in cui mi accetto cos&igrave; come sono che divento capace di cambiare.&rdquo;</p>
              <footer className="mt-2 text-lg text-muted-foreground not-italic">&mdash; Carl Rogers</footer>
            </blockquote>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center animate-fade-up">
          <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
            <Link to="/contatti">Prenota un primo colloquio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChiSono;
