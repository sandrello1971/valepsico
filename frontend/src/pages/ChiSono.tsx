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
          <h1 className="text-section-title mb-4">Psicologa, Psicoterapeuta, Ricercatrice</h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto italic font-serif">
            Valentina Rita Andolfi
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
                Il mio incontro con la psicologia nasce presto, da una storia che mi ha profondamente segnata.
              </p>
              <p>
                Da ragazza lessi un libro che raccontava di una bambina che, nonostante una vita difficile, riusc&igrave; a cambiare grazie all'incontro con una persona capace di comprenderla davvero.
              </p>
              <p>
                Quella storia mi fece intuire qualcosa che da allora guida il mio lavoro: <strong>un incontro pu&ograve; cambiare una vita.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Il senso del mio lavoro */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Il senso del mio lavoro</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Nel tempo questa intuizione &egrave; diventata il centro del mio modo di lavorare.
              </p>
              <p>
                Credo che la terapia sia prima di tutto un incontro umano, in cui le persone possono ritrovare fiducia, significato e direzione.
              </p>
              <p>
                Non si tratta solo di &ldquo;risolvere problemi&rdquo;, ma di riattivare risorse interiori che a volte, nei momenti difficili, sembrano non esserci pi&ugrave;.
              </p>
              <p>
                &Egrave; da qui che nasce il cambiamento: da uno spazio sicuro in cui poter tornare a s&eacute; stessi.
              </p>
            </div>

            <blockquote className="mt-8 text-xl italic font-serif text-foreground border-l-4 border-primary pl-6">
              <p>&ldquo;Esiste un curioso paradosso: quando mi accetto per come sono, allora posso cambiare.&rdquo;</p>
              <footer className="mt-2 text-lg text-muted-foreground not-italic">&mdash; Carl Rogers</footer>
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

        {/* Di cosa mi occupo */}
        <Card className="animate-fade-up mb-16 bg-gradient-hero">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Di cosa mi occupo</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Nel mio lavoro incontro persone che stanno attraversando:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> ansia o stati di tensione</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> difficolt&agrave; nelle relazioni</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> momenti di cambiamento o perdita</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> sensazione di blocco o confusione</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">&bull;</span> conflitti o distanza da s&eacute; stessi</li>
              </ul>
              <p>
                Non sono etichette. Sono modi diversi in cui pu&ograve; farsi sentire una difficolt&agrave;.
              </p>
            </div>
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
