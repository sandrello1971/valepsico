import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Lightbulb, Users2, Target } from 'lucide-react';

const Approccio = () => {
  const principles = [
    {
      icon: Heart,
      title: "Relazione Autentica",
      description: "La base di ogni percorso terapeutico è una relazione genuina, basata sulla fiducia reciproca e sull'accettazione incondizionata.",
      details: "Credo che solo in un clima di autentica accoglienza sia possibile esplorare le proprie difficoltà e trovare nuove risorse."
    },
    {
      icon: Users2,
      title: "Approccio Sistemico",
      description: "Ogni persona è parte di un sistema di relazioni che influenza il suo benessere. Lavoriamo considerando questo contesto.",
      details: "Esploriamo come le relazioni familiari, sociali e professionali influenzano il tuo equilibrio psicologico."
    },
    {
      icon: Target,
      title: "Obiettivi Condivisi",
      description: "Insieme definiamo obiettivi realistici e significativi, adattando il percorso alle tue esigenze specifiche.",
      details: "Ogni persona ha tempi e modi diversi di crescita. Rispetto la tua unicità nel trovare il percorso più adatto."
    },
    {
      icon: Lightbulb,
      title: "Empowerment",
      description: "Il mio ruolo è aiutarti a riconoscere e potenziare le risorse che già possiedi, non sostituirmi alle tue decisioni.",
      details: "Ti accompagno nella scoperta delle tue capacità, sostenendoti nel diventare protagonista del tuo cambiamento."
    }
  ];

  const methodology = [
    {
      step: "1",
      title: "Primo Incontro",
      description: "Ci conosciamo in un colloquio gratuito di 30 minuti per valutare insieme se posso essere la professionista giusta per te."
    },
    {
      step: "2", 
      title: "Definizione Obiettivi",
      description: "Esploriamo insieme la tua situazione attuale e definiamo obiettivi chiari e condivisi per il nostro percorso."
    },
    {
      step: "3",
      title: "Percorso Personalizzato",
      description: "Sviluppiamo strategie specifiche per le tue esigenze, con un approccio flessibile che si adatta ai tuoi progressi."
    },
    {
      step: "4",
      title: "Monitoraggio",
      description: "Valutiamo regolarmente i progressi e adattiamo il percorso, celebrando i risultati raggiunti e affrontando le nuove sfide."
    }
  ];

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto container-padding">
        {/* Page Header */}
        <header className="text-center mb-16 animate-fade-up">
          <h1 className="text-section-title mb-6">Il mio Approccio</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La mia metodologia si basa su principi scientifici e un approccio umano, 
            per creare un percorso terapeutico efficace e rispettoso della tua unicità.
          </p>
        </header>

        {/* Philosophy Quote */}
        <Card className="bg-gradient-hero mb-20 animate-fade-up">
          <CardContent className="p-12 text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-primary">
              "Non esiste un percorso uguale per tutti. Ogni persona ha la sua storia, 
              le sue risorse e i suoi tempi. Il mio compito è creare uno spazio sicuro 
              dove tu possa essere autenticamente te stesso."
            </blockquote>
            <cite className="block mt-6 text-lg font-medium text-accent">
              - Valentina Rita Andolfi
            </cite>
          </CardContent>
        </Card>

        {/* Principles */}
        <section className="mb-20">
          <h2 className="text-section-title text-center mb-12 animate-fade-up">
            I Principi del mio Lavoro
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="animate-fade-up hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="text-primary mr-4">
                      <principle.icon size={32} />
                    </div>
                    <h3 className="text-card-title">{principle.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {principle.description}
                  </p>
                  <p className="text-sm leading-relaxed font-medium text-accent">
                    {principle.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-20">
          <h2 className="text-section-title text-center mb-12 animate-fade-up">
            Come Lavoriamo Insieme
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((item, index) => (
              <Card key={index} className="animate-fade-up text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Therapeutic Approach */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-section-title mb-6">Approccio Sistemico-Relazionale</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Il mio approccio si basa sulla comprensione che ogni persona è parte 
                  di un sistema complesso di relazioni che influenzano il suo benessere psicologico.
                </p>
                <p>
                  Questo significa che non guardiamo solo ai sintomi individuali, ma 
                  esploriamo insieme come le tue relazioni - familiari, lavorative, sociali - 
                  contribuiscono alla tua situazione attuale.
                </p>
                <p>
                  L'obiettivo è aiutarti a comprendere questi patterns e sviluppare 
                  nuove modalità di relazione più sane e soddisfacenti.
                </p>
              </div>
            </div>

            <Card className="animate-fade-up bg-accent text-accent-foreground">
              <CardContent className="p-8">
                <h3 className="text-card-title mb-6">Cosa Aspettarti</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Un ambiente sicuro e senza giudizi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Ascolto attento e presenza autentica</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Collaborazione attiva nel definire gli obiettivi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Rispetto dei tuoi tempi e ritmi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Strumenti pratici per il quotidiano</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground text-center animate-fade-up">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-6">Pronto per iniziare?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Il primo passo verso il cambiamento inizia con una conversazione. 
              Prenota il tuo colloquio conoscitivo gratuito.
            </p>
            <Button asChild className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
              <Link to="/contatti">Prenota Subito</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Approccio;