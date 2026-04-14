import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Sparkles, CircleDot } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import FAQSection, { faqJsonLd } from '@/components/FAQSection';

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://valentinaandolfi.it/" },
    { "@type": "ListItem", "position": 2, "name": "Percorsi", "item": "https://valentinaandolfi.it/percorsi" }
  ]
};

const Servizi = () => {
  return (
    <div className="section-padding">
      <SEOHead
        title="Percorsi – Dott.ssa Valentina Rita Andolfi, Psicologa e Psicoterapeuta Milano"
        description="Percorsi individuali, di coppia, per giovani adulti e gruppi di incontro. Psicoterapeuta a Milano e online. Approccio centrato sulla persona."
        path="/percorsi"
        jsonLd={[breadcrumbJsonLd, faqJsonLd]}
      />
      <div className="max-w-3xl mx-auto container-padding space-y-16">

        {/* Header */}
        <header className="animate-fade-up">
          <h1 className="text-section-title mb-6">Percorsi</h1>
          <p className="text-xl text-muted-foreground italic">
            Psicologa e Psicoterapeuta a Milano e online
          </p>
        </header>

        {/* Intro */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Non esiste un solo modo di stare bene
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Non esiste un solo modo di iniziare un percorso psicologico.
              E non esiste un'unica direzione valida per tutti.
            </p>
            <p>
              Per questo non lavoro con soluzioni standard,
              ma con percorsi costruiti sulla persona, sul suo momento di vita
              e su ciò che sta attraversando.
            </p>
            <p>
              A volte si arriva con chiarezza.
              Altre volte solo con una sensazione difficile da spiegare.
              Entrambe le cose vanno bene per iniziare.
            </p>
          </div>
        </section>

        {/* I percorsi */}
        <section className="animate-fade-up space-y-12">
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            I percorsi
          </h2>

          <div className="space-y-8">

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Percorso individuale</h3>
                <p className="text-lg leading-relaxed text-foreground">Uno spazio dedicato a te.</p>
                <p className="text-lg leading-relaxed text-foreground mt-2">
                  Per esplorare ciò che stai vivendo, dare senso alle emozioni,
                  e ritrovare una direzione più chiara dentro di te.
                </p>
                <p className="text-lg leading-relaxed text-foreground mt-2">
                  Un lavoro che parte da ciò che senti, anche quando è confuso.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Percorso di coppia</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  Per coppie che vivono distanza, incomprensioni o difficoltà nel dialogo.
                </p>
                <p className="text-lg leading-relaxed text-foreground mt-2">
                  Uno spazio in cui rallentare, ascoltarsi e ritrovare possibilità di incontro,
                  senza dover "sapere già come fare".
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Giovani adulti</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  Per chi sta attraversando fasi di passaggio: scelte, identità, autonomia, cambiamenti.
                </p>
                <p className="text-lg leading-relaxed text-foreground mt-2">
                  Un tempo in cui è facile sentirsi sospesi o disorientati.
                  Qui puoi iniziare a rimettere ordine dentro ciò che stai vivendo.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CircleDot className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Gruppi di incontro</h3>
                <p className="text-lg leading-relaxed text-foreground">Uno spazio condiviso.</p>
                <p className="text-lg leading-relaxed text-foreground mt-2">
                  Dove la relazione con gli altri diventa parte del percorso:
                  ascolto, confronto, consapevolezza e crescita personale.
                </p>
                <div className="mt-4">
                  <img
                    src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_101.jpg"
                    alt="Gruppo di incontro terapeutico"
                    className="w-full aspect-video object-cover rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Come funziona il primo colloquio */}
        <section className="animate-fade-up bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Come funziona il primo colloquio
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>Il primo colloquio è uno spazio di conoscenza.</p>
            <p>
              Parliamo di ciò che stai vivendo, di cosa ti ha portato qui
              e di cosa senti di aver bisogno in questo momento.
            </p>
            <p>
              Insieme iniziamo a dare una direzione al percorso:
              obiettivi, tempi, frequenza e modalità (in studio a Milano o online).
            </p>
            <p>
              Non è un impegno rigido,
              ma un primo spazio per capire se e come lavorare insieme.
            </p>
            <p className="text-base text-muted-foreground italic mt-4">
              Le prestazioni psicologiche sono detraibili fiscalmente al 19%
              secondo normativa vigente, anche senza prescrizione medica.
            </p>
          </div>
        </section>

        {/* Il mio lavoro */}
        <section className="animate-fade-up space-y-10">
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            Il mio lavoro
          </h2>
          <p className="text-xl leading-relaxed text-foreground">
            Il mio lavoro si articola in più aree, che si integrano tra loro.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Attività clinica</h3>
              <p className="text-lg leading-relaxed text-foreground">
                Mi occupo di percorsi psicologici con adolescenti, adulti e coppie.
                Uno spazio di ascolto in cui dare significato a ciò che si sta vivendo
                e ritrovare maggiore equilibrio emotivo e relazionale.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Crescita personale</h3>
              <p className="text-lg leading-relaxed text-foreground">
                Accanto all'attività clinica propongo percorsi di crescita personale
                e sviluppo delle risorse individuali.
                Un lavoro orientato alla consapevolezza, alla regolazione emotiva
                e alla possibilità di attraversare i cambiamenti con maggiore stabilità interna.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Formazione e progettazione</h3>
              <p className="text-lg leading-relaxed text-foreground">
                Mi occupo anche di formazione e progettazione in ambito psicologico.
                Collaboro con scuole, aziende ed enti su temi legati a:
                benessere psicologico, comunicazione, relazioni e sviluppo
                delle competenze emotive.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* CTA */}
        <section className="animate-fade-up text-center space-y-6 pb-8">
          <p className="text-2xl font-serif text-foreground italic">
            Ogni percorso è diverso, perché ogni persona lo è.
          </p>
          <p className="text-xl text-foreground">
            Se vuoi, possiamo capire insieme cosa può davvero aiutarti
            in questo momento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary">
              <Link to="/contatti">Prenota un primo colloquio</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://wa.me/393466051282">WhatsApp: 346 6051282</a>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Servizi;
