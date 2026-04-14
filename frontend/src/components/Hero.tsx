import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import valentinaPhoto from '@/assets/valentina-photo.png';

const Hero = () => {
  return (
    <section className="bg-gradient-hero min-h-screen flex items-center section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Testo */}
          <div className="animate-fade-up">
            <h1 className="mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-4">
                Dott.ssa Valentina Rita Andolfi
              </span>
              <span className="block text-2xl md:text-3xl font-serif text-foreground italic">
                Psicologa e Psicoterapeuta a Milano e online
              </span>
            </h1>

            <div className="space-y-6 text-xl leading-relaxed text-foreground mb-10 max-w-2xl">
              <p className="text-2xl font-medium leading-snug">
                Ti è mai capitato di sentirti bloccato,<br />
                come se ci fosse qualcosa dentro di te che vorresti capire,<br />
                ma non sai da dove iniziare?
              </p>
              <p>
                A volte non è chiaro. Ma si sente.
              </p>
              <p>
                Nei pensieri che tornano, nelle relazioni che fanno più fatica,
                o in una distanza sottile da sé stessi.
              </p>
              <p>
                Non è necessario avere tutto chiaro per iniziare.<br />
                <strong>Possiamo partire da qui: da uno spazio in cui poterti ascoltare, fino in fondo.</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
                <Link to="/contatti">Prenota un primo colloquio</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-outline text-lg px-8 py-4">
                <a href="https://wa.me/393466051282">Scrivimi su WhatsApp</a>
              </Button>
            </div>
          </div>

          {/* Foto */}
          <div className="animate-fade-up lg:pl-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl transform rotate-3"></div>
              <img
                src={valentinaPhoto}
                alt="Valentina Rita Andolfi - Psicologa e Psicoterapeuta"
                className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto lg:max-w-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
