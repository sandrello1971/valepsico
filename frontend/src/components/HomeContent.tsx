import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const HomeContent = () => {
  return (
    <main>

      {/* ── 1. TI RICONOSCI? ── */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
            Ti riconosci in questo?
          </h2>
          <ul className="space-y-4 text-xl leading-relaxed text-foreground mb-8">
            {[
              "sentirsi in tensione, anche senza un motivo chiaro",
              "vivere relazioni che fanno soffrire ma da cui è difficile allontanarsi",
              "sentirsi bloccati o confusi rispetto a ciò che si desidera",
              "riconoscere schemi che si ripetono nel tempo",
              "attraversare un cambiamento senza sapere come orientarsi",
              "sentire un vuoto o una mancanza difficile da definire",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xl text-foreground mb-8">
            Se ti ritrovi anche solo in una parte di questo,
            può avere senso fermarsi a guardarlo.
          </p>
          <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground mb-10">
            "Non diventiamo illuminati immaginando figure di luce,
            ma rendendo cosciente l'oscurità."
            <footer className="mt-2 text-base not-italic font-medium">— Carl Gustav Jung</footer>
          </blockquote>
          <Button asChild variant="outline" size="lg">
            <Link to="/contatti">Scrivimi per un primo contatto</Link>
          </Button>
        </div>
      </section>

      {/* ── 2. CHI SONO (breve) ── */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
            <img
              src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_56.jpg"
              loading="lazy"
              decoding="async"
              alt="Valentina Rita Andolfi in ascolto"
              className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg"
            />
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
                Chi sono
              </h2>
              <div className="space-y-4 text-xl leading-relaxed text-foreground">
                <p>
                  Sono la <strong>Dott.ssa Valentina Rita Andolfi</strong>,
                  psicologa, psicoterapeuta e ricercatrice,
                  iscritta all'Ordine degli Psicologi della Lombardia n. 17065.
                </p>
                <p>
                  Lavoro a Buccinasco (Milano) e online con adolescenti, adulti, coppie e gruppi.
                </p>
                <p>
                  Nel tempo ho integrato attività clinica e ricerca tra Italia e Stati Uniti.
                  Questo mi permette di unire uno sguardo rigoroso a un modo di lavorare
                  attento, umano e rispettoso.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-muted/30 rounded-2xl p-8 space-y-4 text-xl leading-relaxed text-foreground">
              <p>
                Nel mio lavoro incontro persone che si sentono confuse,
                bloccate, in difficoltà nelle relazioni o lontane da sé stesse.
              </p>
              <p>
                Momenti in cui qualcosa si complica, fa male o perde direzione:
                relazioni difficili, ansia, cambiamenti, perdite.
              </p>
              <p>
                Spesso non è immediato capire cosa stia succedendo.
                A volte serve uno spazio in cui poterlo guardare insieme.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/chi-sono">Scopri di più su di me</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 3. COSA SUCCEDE QUI ── */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
            Come funziona la psicoterapia
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground mb-10">
            <p>
              Il percorso terapeutico è uno spazio in cui puoi portare ciò che vivi,
              così com'è.
            </p>
            <p>
              Senza doverlo chiarire prima. Senza doverlo sistemare.
            </p>
            <p>
              È uno spazio di ascolto, in cui quello che porti può trovare forma,
              poco alla volta.
            </p>
            <p>
              Non troverai risposte preconfezionate, ma un luogo in cui iniziare
              a comprendere davvero ciò che ti riguarda.
            </p>
          </div>

          {/* Sezione resistenza */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-10">
            <p className="text-xl font-medium text-foreground mb-4">
              A volte può emergere un pensiero:
            </p>
            <p className="text-2xl font-serif italic text-foreground mb-6">
              "E se parlare non servisse?"
            </p>
            <div className="space-y-3 text-lg text-foreground">
              <p>È un dubbio comprensibile.</p>
              <p>
                Perché non si tratta solo di parlare. Si tratta di ciò che accade
                mentre lo fai: sentirsi ascoltati, riconosciuti, accolti.
              </p>
              <p>
                Ed è spesso da lì che qualcosa può iniziare a muoversi.
              </p>
            </div>
          </div>

          <div className="animate-fade-up mb-8">
            <img
              src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_113.jpg"
              loading="lazy"
              decoding="async"
              alt="Citazione Anaïs Nin scritta a mano"
              className="w-full max-w-sm mx-auto aspect-[4/3] object-cover rounded-2xl shadow-md"
            />
          </div>
          <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground">
            "E venne il giorno in cui il rischio di rimanere chiuso in un bocciolo
            divenne più doloroso del rischio di sbocciare."
            <footer className="mt-2 text-base not-italic font-medium">— Anaïs Nin</footer>
          </blockquote>
        </div>
      </section>

      {/* ── 4. COME POSSO AIUTARTI ── */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
            Come posso aiutarti
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground mb-8">
            <p>Possiamo lavorare insieme attraverso:</p>
            <ul className="space-y-3">
              {[
                "percorsi individuali",
                "percorsi di coppia",
                "gruppi di incontro",
                "percorsi di crescita personale",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Non si tratta di "risolvere", ma di comprendere e attraversare
              ciò che stai vivendo, ritrovando maggiore chiarezza.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/percorsi">Scopri i percorsi</Link>
          </Button>
        </div>
      </section>

      {/* ── 5. DOVE RICEVO ── */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
            Dove ricevo
          </h2>
          <ul className="space-y-4 text-xl text-foreground">
            {[
              { luogo: "Buccinasco (Milano)", dettaglio: "Centro Persona, Via degli Aceri 2" },
              { luogo: "Online", dettaglio: "videochiamata, su appuntamento" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>
                  <strong>{item.luogo}</strong> — {item.dettaglio}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <img
              src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_74.jpg"
              loading="lazy"
              decoding="async"
              alt="Studio di psicoterapia a Buccinasco, Milano"
              className="w-full aspect-video object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ── 6. CTA FINALE ── */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <p className="text-2xl font-serif text-foreground mb-4">
            Se ti sei riconosciuto anche solo in parte,
            possiamo iniziare da qui.
          </p>
          <p className="text-xl text-muted-foreground mb-10">
            Non serve essere pronti.<br />
            È sufficiente non voler restare soli in quello che stai vivendo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
              <Link to="/contatti">Prenota un primo colloquio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <a href="https://wa.me/393466051282">WhatsApp: 346 6051282</a>
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomeContent;
