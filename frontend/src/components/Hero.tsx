import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import valentinaPhoto from '@/assets/valentina-photo.png';

const Hero = () => {
  return (
    <section className="bg-gradient-hero min-h-screen flex items-center section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-fade-up">
            <h1 className="mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-4">
                Dott.ssa Valentina Rita Andolfi
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2">
                Psicologa e Psicoterapeuta
              </span>
              <span className="block text-2xl md:text-3xl font-serif font-bold text-foreground italic">
                a Milano e online
              </span>
            </h1>

            <div className="space-y-6 text-xl leading-relaxed text-foreground mb-8 max-w-2xl">
              <p>
                Ti &egrave; mai capitato di sentirti bloccato, come se ci fosse qualcosa dentro di te che vorresti capire, ma non sai da dove iniziare?
              </p>
              <p>
                A volte non &egrave; chiaro. Ma si sente.
              </p>
              <p>
                Nei pensieri che tornano, nelle relazioni che fanno pi&ugrave; fatica, o in una distanza sottile da s&eacute; stessi.
              </p>
              <p>
                E si continua ad andare avanti, anche quando qualcosa dentro chiede di fermarsi.
              </p>
              <p>
                Non &egrave; necessario avere tutto chiaro per iniziare. Possiamo partire da qui: da uno spazio in cui poterti ascoltare, fino in fondo.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
                <Link to="/contatti">
                  Prenota un primo colloquio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-outline text-lg px-8 py-4">
                <a href="https://wa.me/393466051282">
                  Scrivimi su WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Iscritta all'Ordine degli Psicologi della Lombardia n. 17065 &middot; Ricevo a Milano e Online
            </p>
          </div>

          {/* Hero Image */}
          <div className="animate-fade-up lg:pl-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl transform rotate-3"></div>
              <img
                src={valentinaPhoto}
                alt="Dott.ssa Valentina Rita Andolfi - Psicologa e Psicoterapeuta"
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
