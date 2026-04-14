import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

const Approccio = () => {
  return (
    <div className="section-padding">
      <SEOHead
        title="Il mio approccio – Dott.ssa Valentina Rita Andolfi, Psicoterapeuta Milano"
        description="L'approccio centrato sulla persona di Valentina Rita Andolfi. Come funziona la psicoterapia, il ruolo della relazione terapeutica e cosa puoi aspettarti dal percorso."
        path="/approccio"
      />
      <div className="max-w-3xl mx-auto container-padding space-y-16">

        {/* Titolo */}
        <header className="animate-fade-up">
          <h1 className="text-section-title mb-6">Il mio approccio terapeutico</h1>
          <p className="text-xl text-foreground leading-relaxed">
            Il mio lavoro come psicologa e psicoterapeuta si basa sull'Approccio
            Centrato sulla Persona, sviluppato da Carl Rogers.
          </p>
          <p className="text-xl text-foreground leading-relaxed mt-4">
            Per me, però, più che un modello teorico è un modo di guardare le persone
            e di stare nella relazione.
          </p>
          <p className="text-xl text-foreground leading-relaxed mt-4">
            Significa che non sei qualcuno da osservare o interpretare dall'esterno,
            ma una persona che può essere ascoltata mentre prova a comprendersi
            e accompagnata a riscoprire le proprie risorse.
          </p>
        </header>

        {/* Foto placeholder */}
        <div className="animate-fade-up">
          <img
            src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_88.jpg"
            alt="Valentina Rita Andolfi in ascolto"
            className="w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-lg"
          />
        </div>

        {/* La relazione al centro */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            La relazione al centro
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>Nel mio lavoro non parto da etichette o diagnosi.</p>
            <p>
              Al centro del percorso c'è la tua esperienza, così com'è,
              nel modo in cui la vivi.
            </p>
            <p>
              Lo spazio terapeutico è pensato per permetterti di portare
              ciò che stai attraversando, senza doverlo sistemare o chiarire prima.
            </p>
          </div>
        </section>

        {/* Uno spazio di ascolto */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Uno spazio di ascolto
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Durante il percorso puoi esplorare pensieri, emozioni e vissuti
              anche complessi, senza la pressione di doverli definire subito
              in modo chiaro.
            </p>
            <p>
              Nel tempo, ciò che porti diventa parte del lavoro terapeutico:
              non qualcosa da correggere, ma qualcosa da comprendere insieme.
            </p>
          </div>
        </section>

        {/* Il mio ruolo */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Il mio ruolo
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Il mio ruolo come psicoterapeuta non è quello di guidarti
              verso una risposta già definita.
            </p>
            <p>
              È restare accanto mentre provi a dare senso a ciò che stai vivendo.
            </p>
            <p>Con ascolto, attenzione e rispetto dei tuoi tempi.</p>
          </div>
        </section>

        {/* Le risorse personali */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Le risorse personali
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Credo che ogni persona abbia dentro di sé risorse che, in alcuni
              momenti della vita, possono sembrare lontane o difficili da riconoscere.
            </p>
            <p>
              Il percorso di psicoterapia può essere anche questo: uno spazio
              per tornare gradualmente a sentirle e riattivarle.
            </p>
          </div>
        </section>

        {/* Il ritmo */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            Il ritmo del percorso
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Non esiste un modo giusto o veloce per iniziare un percorso psicologico.
            </p>
            <p>
              Ogni percorso ha il suo ritmo, fatto di passi, pause e comprensioni
              che emergono nel tempo.
            </p>
          </div>
        </section>

        {/* In sintesi */}
        <section className="animate-fade-up bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
            In sintesi
          </h2>
          <div className="space-y-4 text-xl leading-relaxed text-foreground">
            <p>
              Il mio lavoro nasce dall'idea che il cambiamento in psicoterapia
              non sia qualcosa da forzare,
            </p>
            <p>
              ma qualcosa che può emergere dentro una relazione terapeutica
              in cui ci si sente visti, ascoltati e compresi.
            </p>
          </div>
        </section>

        {/* Citazione Rogers */}
        <blockquote className="animate-fade-up border-l-4 border-primary pl-6 italic text-xl text-muted-foreground">
          "Esiste un curioso paradosso: quando mi accetto per come sono,
          allora posso cambiare."
          <footer className="mt-2 text-base not-italic font-medium">— Carl Rogers</footer>
        </blockquote>

        {/* CTA */}
        <section className="animate-fade-up text-center space-y-4 pb-8">
          <p className="text-xl text-foreground leading-relaxed">
            Se senti che questo modo di lavorare può risuonare con te,
            puoi contattarmi per un primo colloquio.
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

export default Approccio;
