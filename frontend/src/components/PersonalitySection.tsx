import { Card } from '@/components/ui/card';

const PersonalitySection = () => {
  return (
    <section className="section-padding bg-background" aria-labelledby="personality-heading">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-8">
            {/* Accogliente */}
            <div className="flex gap-6 items-start">
              <div className="w-48 h-32 bg-gradient-primary rounded-2xl shadow-elegant flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <Card className="flex-1 p-6 bg-accent-light/30 border-accent/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Accogliente</h3>
                <p className="text-foreground">
                  Creo uno spazio di comprensione non giudicante, dove ogni storia viene valorizzata nella sua unicit&agrave;.
                </p>
              </Card>
            </div>

            {/* Autentica */}
            <div className="flex gap-6 items-start">
              <div className="w-48 h-32 bg-gradient-primary rounded-2xl shadow-elegant flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <Card className="flex-1 p-6 bg-accent-light/30 border-accent/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Autentica</h3>
                <p className="text-foreground">
                  Mi presento "da persona a persona", unendo competenza e una relazione genuina, basata su integrit&agrave; e rispetto.
                </p>
              </Card>
            </div>

            {/* Creativa */}
            <div className="flex gap-6 items-start">
              <div className="w-48 h-32 bg-gradient-primary rounded-2xl shadow-elegant flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <Card className="flex-1 p-6 bg-accent-light/30 border-accent/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Creativa</h3>
                <p className="text-foreground">
                  Porto innovazione e nuove prospettive, utilizzando metodi che illuminano percorsi inaspettati.
                </p>
              </Card>
            </div>

            {/* Equilibrata */}
            <div className="flex gap-6 items-start">
              <div className="w-48 h-32 bg-gradient-primary rounded-2xl shadow-elegant flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <Card className="flex-1 p-6 bg-accent-light/30 border-accent/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Equilibrata</h3>
                <p className="text-foreground">
                  Cerco armonia tra teoria e pratica, tra supporto e autonomia, rispettando i tempi del tuo percorso.
                </p>
              </Card>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalitySection;
