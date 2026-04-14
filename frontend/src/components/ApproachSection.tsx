import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import approachImage from '@/assets/NDRSFN_29092024_86.jpg';

const ApproachSection = () => {
  return (
    <>
      {/* Sezione "Come lavoro" */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif">
              Come lavoro
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Immagine */}
            <div className="relative">
              <img
                src={approachImage}
                alt="Approccio terapeutico"
                className="w-full aspect-video object-cover rounded-2xl shadow-elegant"
              />
            </div>

            {/* Testo */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-foreground">
                Il percorso terapeutico &egrave; uno spazio in cui puoi portare ci&ograve; che vivi, cos&igrave; com'&egrave;, senza doverlo sistemare prima.
              </p>

              <p className="text-lg font-medium text-foreground">Lavoreremo insieme per:</p>
              <ul className="space-y-3 text-lg leading-relaxed text-foreground">
                <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> dare senso alle emozioni, anche quando sembrano confuse</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> comprendere cosa accade nelle tue relazioni</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> riconoscere schemi che si ripetono</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> ritrovare un contatto pi&ugrave; autentico con te stesso</li>
              </ul>

              <div className="space-y-4 text-lg leading-relaxed text-foreground">
                <p>
                  Con il tempo, le persone iniziano a vedersi in modo diverso. A fidarsi di pi&ugrave; di ci&ograve; che sentono. A sentirsi pi&ugrave; libere di essere se stesse.
                </p>
                <p>
                  Non si tratta solo di parlare. Si tratta di iniziare a comprendere davvero ci&ograve; che ti riguarda. Di ascoltarti.
                </p>
              </div>

              <p className="text-xl font-medium text-foreground italic">
                Che significato ha per te tutto questo?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione "Uno spazio per fermarti" */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif">
            Uno spazio per fermarti
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              Questo &egrave; uno spazio dedicato alla cura, all'ascolto e alla comprensione di s&eacute;.
            </p>
            <p>
              Sono <strong>Valentina Rita Andolfi</strong>, psicologa, psicoterapeuta e dottore di ricerca, iscritta all'Ordine degli Psicologi della Lombardia (n. 17065).
            </p>
            <p>
              <strong>Nel mio lavoro aiuto persone che si sentono confuse, vuote o non pi&ugrave; in contatto con s&eacute; stesse, che stanno affrontando perdite o cambiamenti, a ritrovarsi, sentirsi viste e costruire un modo pi&ugrave; autentico di stare al mondo.</strong>
            </p>
            <p>
              Molte persone arrivano con una sensazione difficile da dire, ma molto presente: <strong>&ldquo;forse cos&igrave; come sono, non vado bene.&rdquo;</strong>
            </p>
            <p>
              Nel mio lavoro, questo pu&ograve; iniziare a cambiare. Non perch&eacute; tu debba diventare diverso, ma perch&eacute; tu possa iniziare a vederti &mdash; e sentirti visto &mdash; in modo nuovo.
            </p>
          </div>
        </div>
      </section>

      {/* Sezione "Forse ti riconosci in questo" */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif">
            Forse ti riconosci in questo
          </h2>
          <ul className="space-y-3 text-lg leading-relaxed text-foreground mb-8">
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> sentirsi in ansia senza comprenderne fino in fondo il motivo</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> vivere relazioni che fanno soffrire ma da cui &egrave; difficile allontanarsi</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> sentirsi confusi, come se mancasse qualcosa</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> avere la sensazione di non riconoscersi pi&ugrave;</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> non sapere chi si &egrave; o chi si potrebbe diventare</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold mt-1">&bull;</span> percepire un vuoto difficile da spiegare</li>
          </ul>

          <div className="space-y-4 text-lg leading-relaxed text-foreground mb-8">
            <p>
              <strong>Quando qualcosa si ripete o fa male, fermarsi ad ascoltarlo &egrave; gi&agrave; un primo passo.</strong>
            </p>
          </div>

          <div className="space-y-4 text-lg text-foreground mb-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <p className="italic text-muted-foreground border border-border rounded-lg p-4">&ldquo;Non mi riconosco pi&ugrave;&rdquo;</p>
              <p className="italic text-muted-foreground border border-border rounded-lg p-4">&ldquo;Mi sento vuoto, anche quando sembra andare tutto bene&rdquo;</p>
              <p className="italic text-muted-foreground border border-border rounded-lg p-4">&ldquo;Non capisco perch&eacute; mi succede sempre questo&rdquo;</p>
              <p className="italic text-muted-foreground border border-border rounded-lg p-4">&ldquo;Nessuno vede davvero come sto&rdquo;</p>
            </div>
            <p className="text-muted-foreground italic mt-4">Se ti ritrovi in queste parole, non sei l'unico.</p>
          </div>
        </div>
      </section>

      {/* Citazione Jung */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <blockquote className="text-2xl italic font-serif text-foreground">
            <p>&ldquo;Non diventiamo illuminati immaginando figure di luce, ma rendendo cosciente l'oscurit&agrave;.&rdquo;</p>
            <footer className="mt-4 text-lg text-muted-foreground not-italic">&mdash; Carl Gustav Jung</footer>
          </blockquote>
        </div>
      </section>

      {/* Sezione "Chi sono" breve */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif">
            Chi sono
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              Sono una psicoterapeuta e mi occupo principalmente di <strong>relazioni, identit&agrave; e momenti di difficolt&agrave; personale</strong>.
            </p>
            <p>
              Nel mio lavoro creo uno spazio <strong>accogliente e non giudicante</strong>, in cui puoi portare anche le parti pi&ugrave; fragili o difficili.
            </p>
            <p>
              Accanto alla pratica clinica, svolgo attivit&agrave; di ricerca in ambito accademico, che contribuisce a mantenere il mio approccio <strong>solido, attento e aggiornato</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Principale */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <p className="text-xl text-foreground mb-8">
            Se ti sei riconosciuto anche in parte, puoi contattarmi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
              <Link to="/contatti">
                Prenota un primo colloquio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-outline text-lg px-8 py-4">
              <a href="https://wa.me/393466051282">
                Scrivimi su WhatsApp: 346 6051282
              </a>
            </Button>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p>Ti risponder&ograve; entro 24 ore.</p>
            <p>Non serve essere pronti. &Egrave; sufficiente essere curiosi e non voler restare soli in ci&ograve; che si sta vivendo.</p>
          </div>
        </div>
      </section>

      {/* Sezione "Dove ricevo" */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif text-center">
            Dove ricevo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <MapPin className="mx-auto text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Milano</h3>
              <p className="text-muted-foreground">Studio Velasca, Piazza Velasca 6</p>
            </div>
            <div className="text-center p-6">
              <MapPin className="mx-auto text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Buccinasco</h3>
              <p className="text-muted-foreground">Centro Persona, via degli Aceri 2</p>
            </div>
            <div className="text-center p-6">
              <MapPin className="mx-auto text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Online</h3>
              <p className="text-muted-foreground">Quando necessario</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ApproachSection;
