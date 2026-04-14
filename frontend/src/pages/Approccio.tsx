import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
          <h1 className="text-section-title mb-4">Il mio approccio terapeutico</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Il mio lavoro come psicologa e psicoterapeuta si basa sull'Approccio Centrato sulla Persona, sviluppato da Carl Rogers.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            Per me, però, più che un modello teorico è un modo di guardare le persone e di stare nella relazione.
          </p>
        </header>

        {/* La relazione al centro */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold mb-4">La relazione al centro</h2>
          <p className="text-lg leading-relaxed">
            Nel mio lavoro non parto da etichette o diagnosi.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Al centro del percorso c'è la tua esperienza, così com'è, nel modo in cui la vivi.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Lo spazio terapeutico è pensato per permetterti di portare ciò che stai attraversando, senza doverlo sistemare o chiarire prima.
          </p>
        </section>

        {/* Uno spazio di ascolto */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold mb-4">Uno spazio di ascolto</h2>
          <p className="text-lg leading-relaxed">
            Durante il percorso puoi esplorare pensieri, emozioni e vissuti anche complessi, senza la pressione di doverli definire subito in modo chiaro.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Nel tempo, ciò che porti diventa parte del lavoro terapeutico: non qualcosa da correggere, ma qualcosa da comprendere insieme.
          </p>
        </section>

        {/* Il mio ruolo */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold mb-4">Il mio ruolo</h2>
          <p className="text-lg leading-relaxed">
            Il mio ruolo come psicoterapeuta non è quello di guidarti verso una risposta già definita.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            È restare accanto mentre provi a dare senso a ciò che stai vivendo.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Con ascolto, attenzione e rispetto dei tuoi tempi.
          </p>
        </section>

        {/* Le risorse personali */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold mb-4">Le risorse personali</h2>
          <p className="text-lg leading-relaxed">
            Credo che ogni persona abbia dentro di sé risorse che, in alcuni momenti della vita, possono sembrare lontane o difficili da riconoscere.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Il percorso di psicoterapia può essere anche questo: uno spazio per tornare gradualmente a sentirle e riattivarle.
          </p>
        </section>

        {/* Il ritmo */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-serif font-semibold mb-4">Il ritmo del percorso</h2>
          <p className="text-lg leading-relaxed">
            Non esiste un modo giusto o veloce per iniziare un percorso psicologico.
          </p>
          <p className="text-lg leading-relaxed mt-3">
            Ogni percorso ha il suo ritmo, fatto di passi, pause e comprensioni che emergono nel tempo.
          </p>
        </section>

        {/* Citazione Rogers */}
        <blockquote className="animate-fade-up border-l-4 border-primary pl-6 italic text-xl text-muted-foreground">
          "Esiste un curioso paradosso: quando mi accetto per come sono, allora posso cambiare."
          <footer className="mt-2 text-base not-italic font-medium">— Carl Rogers</footer>
        </blockquote>

        {/* CTA */}
        <section className="animate-fade-up text-center space-y-4">
          <p className="text-lg leading-relaxed">
            Se senti che questo modo di lavorare può risuonare con te, puoi contattarmi per un primo colloquio.
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
