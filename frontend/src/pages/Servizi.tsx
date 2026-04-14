import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Sparkles, Brain, GraduationCap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import FAQSection, { faqJsonLd } from '@/components/FAQSection';

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://valentinaandolfi.it/" },
    { "@type": "ListItem", "position": 2, "name": "Percorsi", "item": "https://valentinaandolfi.it/servizi" }
  ]
};

const Servizi = () => {
  return (
    <div className="section-padding">
      <SEOHead
        title="Percorsi - Consulenza Psicologica Individuale, di Coppia e Online | Milano"
        description="Consulenza psicologica individuale, di coppia, per giovani adulti, gruppi e percorsi di crescita. Sedute in studio a Milano e online. Psicoterapeuta Valentina Andolfi."
        path="/servizi"
        jsonLd={[breadcrumbJsonLd, faqJsonLd]}
      />
      <div className="max-w-6xl mx-auto container-padding">
        {/* Page Header */}
        <header className="text-center mb-16 animate-fade-up">
          <h1 className="text-section-title mb-6">Ogni percorso &egrave; diverso. Perch&eacute; ogni persona lo &egrave;, e merita uno spazio che le assomigli.</h1>
        </header>

        {/* Consulenza Individuale */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="text-primary" size={40} />
              <h2 className="text-card-title">Consulenza individuale</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Per chi si sente confuso, bloccato o lontano da s&eacute; stesso e desidera ritrovare chiarezza, stabilit&agrave; e un senso di direzione.
            </p>
          </CardContent>
        </Card>

        {/* Coppia */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Users className="text-primary" size={40} />
              <h2 className="text-card-title">Coppia</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Per chi sente distanza, incomprensioni o conflitti che si ripetono e desidera ritrovare dialogo e connessione.
            </p>
          </CardContent>
        </Card>

        {/* Giovani adulti */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Sparkles className="text-primary" size={40} />
              <h2 className="text-card-title">Giovani adulti</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Per chi sta attraversando un momento di passaggio e sente il bisogno di orientarsi tra identit&agrave;, scelte e autonomia.
            </p>
          </CardContent>
        </Card>

        {/* Gruppi */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Brain className="text-primary" size={40} />
              <h2 className="text-card-title">Gruppi</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Uno spazio condiviso per esplorare s&eacute; stessi attraverso la relazione con gli altri, e iniziare a vedersi anche attraverso uno sguardo diverso.
            </p>
          </CardContent>
        </Card>

        {/* Crescita ed empowerment */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <GraduationCap className="text-primary" size={40} />
              <h2 className="text-card-title">Crescita ed empowerment</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Percorsi per sviluppare consapevolezza, fiducia in s&eacute; e capacit&agrave; relazionali.
            </p>
          </CardContent>
        </Card>

        {/* Formazione e progettazione */}
        <Card className="animate-fade-up mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="text-primary" size={40} />
              <h2 className="text-card-title">Formazione e progettazione</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Accanto all'attivit&agrave; clinica, mi occupo di formazione, ricerca e progettazione.
            </p>
          </CardContent>
        </Card>

        {/* Chiusura */}
        <div className="text-center mb-20 animate-fade-up">
          <p className="text-2xl font-serif italic text-foreground">
            Ogni percorso &egrave; diverso. Perch&eacute; ogni persona lo &egrave;.
          </p>
        </div>

        {/* FAQ Section */}
        <FAQSection />

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

export default Servizi;
