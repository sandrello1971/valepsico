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
        </header>

        {/* La mia storia */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div className="animate-fade-up">
            <div className="relative">
              <img
                src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_41.jpg"
                alt="Valentina Rita Andolfi nel suo studio"
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
                Da ragazza lessi un libro che raccontava di una bambina che, nonostante una vita difficile, riuscì a cambiare grazie all'incontro con una persona capace di comprenderla davvero.
              </p>
              <p>
                Quella storia mi fece intuire qualcosa che da allora guida il mio lavoro: <strong>un incontro può cambiare una vita.</strong>
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
                Nel tempo questa intuizione è diventata il centro del mio modo di lavorare.
              </p>
              <p>
                Credo che la terapia sia prima di tutto un incontro umano, in cui le persone possono ritrovare fiducia, significato e direzione.
              </p>
              <p>
                Non si tratta solo di "risolvere problemi", ma di riattivare risorse interiori che a volte, nei momenti difficili, sembrano non esserci più.
              </p>
              <p>
                È da qui che nasce il cambiamento: da uno spazio sicuro in cui poter tornare a sé stessi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Il mio approccio terapeutico */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Il mio approccio terapeutico</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Il mio lavoro si basa sull'Approccio Centrato sulla Persona, sviluppato da Carl Rogers.
              </p>
              <p>
                Per me, però, più che un modello teorico, è un modo di stare nella relazione.
              </p>
              <p>
                Significa che non sei qualcuno da osservare o interpretare dall'esterno,
                ma una persona che può essere ascoltata mentre prova a comprendersi
                e accompagnata a riscoprire le proprie risorse.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cosa accade nel percorso */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Cosa accade nel percorso</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Nel tempo, qualcosa può iniziare a cambiare in modo graduale.
              </p>
              <p>A volte le persone iniziano a:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> dare un nome a ciò che sentono</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> riconoscere meglio alcune dinamiche</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> sentirsi un po' meno confuse o bloccate</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> tornare a fidarsi di ciò che percepiscono dentro</li>
              </ul>
              <p>
                Non perché diventano qualcun altro, ma perché iniziano a vedersi in modo diverso.
              </p>
            </div>

            <blockquote className="mt-8 text-xl italic font-serif text-foreground border-l-4 border-primary pl-6">
              <p>"Esiste un curioso paradosso: quando mi accetto per come sono, allora posso cambiare."</p>
              <footer className="mt-2 text-lg text-muted-foreground not-italic">— Carl Rogers</footer>
            </blockquote>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16 animate-fade-up">

          {/* Testo sinistra */}
          <div className="space-y-6">
            <h2 className="text-card-title text-primary">Di cosa mi occupo</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>Nel mio lavoro incontro persone che stanno attraversando:</p>
              <ul className="space-y-3">
                {[
                  "ansia o stati di tensione",
                  "difficoltà nelle relazioni",
                  "momenti di cambiamento o perdita",
                  "sensazione di blocco o confusione",
                  "conflitti o distanza da sé stessi",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground italic mt-4">
                Non sono etichette. Sono modi diversi in cui può farsi
                sentire una difficoltà.
              </p>
            </div>
          </div>

          {/* Foto destra */}
          <img
            src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_48.jpg"
            alt="Valentina Rita Andolfi nel suo studio"
            className="w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-lg"
          />

        </div>

        {/* Formazione */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Formazione</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Il mio percorso è stato un intreccio tra clinica e ricerca.
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> Laurea in Psicologia, Università Cattolica di Milano</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> Dottorato di ricerca in Psicologia dello Sviluppo e del Benessere (co-tutela Tufts University, Boston)</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">—</span> Specializzazione in Psicoterapia Umanistica — IACP Milano</li>
              </ul>
              <p>
                Per me ricerca e lavoro clinico non sono due cose separate.
              </p>
              <p>
                La ricerca mi aiuta a mantenere uno sguardo più ampio, mentre il lavoro clinico
                mi riporta alla complessità delle storie delle persone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Valori */}
        <Card className="animate-fade-up mb-16">
          <CardContent className="p-8">
            <h2 className="text-card-title text-primary mb-6">Valori</h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Nel mio lavoro cerco di portare alcuni valori che considero fondamentali.
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Accoglienza</h3>
                <p>
                  Creo uno spazio di comprensione non giudicante, in cui ogni storia
                  può essere accolta nella sua unicità.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Autenticità</h3>
                <p>
                  Mi presento in modo autentico, da persona a persona, unendo
                  competenza e una relazione professionale ma genuina.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Creatività clinica</h3>
                <p>
                  Nel lavoro cerco di mantenere uno sguardo aperto, che
                  permetta di osservare le situazioni anche da prospettive diverse.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Equilibrio</h3>
                <p>
                  Cerco un equilibrio tra teoria e pratica, tra presenza e autonomia,
                  rispettando i tempi e il ritmo di ogni percorso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intro CTA */}
        <div className="animate-fade-up mb-10">
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>Non sempre si arriva in terapia con chiarezza.</p>
            <p>
              A volte si arriva solo con una sensazione: che qualcosa non sta più
              funzionando come prima.
            </p>
            <p>E questo, spesso, è già un punto di partenza.</p>
            <p>Non serve avere tutto chiaro per iniziare.</p>
            <p>A volte basta non voler restare soli in quello che si sta vivendo.</p>
          </div>
        </div>

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
