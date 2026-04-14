import Hero from "@/components/Hero";
import HomeContent from "@/components/HomeContent";
import SEOHead from "@/components/SEOHead";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MedicalBusiness"],
  "name": "Dott.ssa Valentina Rita Andolfi – Psicologa e Psicoterapeuta",
  "description": "Psicologa, psicoterapeuta e ricercatrice a Milano e online. Specializzata in relazioni, identità e momenti di difficoltà personale. Approccio Centrato sulla Persona.",
  "url": "https://valentinaandolfi.it",
  "telephone": "+393466051282",
  "email": "info@valentinaandolfi.it",
  "priceRange": "€€",
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "Piazza Velasca 6",
      "addressLocality": "Milano",
      "addressRegion": "Lombardia",
      "postalCode": "20122",
      "addressCountry": "IT",
      "name": "Studio Velasca"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "Via degli Aceri 2",
      "addressLocality": "Buccinasco",
      "addressRegion": "Lombardia",
      "postalCode": "20090",
      "addressCountry": "IT",
      "name": "Centro Persona"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Milano" },
    { "@type": "City", "name": "Buccinasco" },
    { "@type": "Country", "name": "Italia" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "20:00"
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Valentina Rita Andolfi",
  "honorificPrefix": "Dott.ssa",
  "jobTitle": "Psicologa e Psicoterapeuta",
  "description": "Psicologa, psicoterapeuta e dottore di ricerca. Iscritta all'Ordine degli Psicologi della Lombardia n. 17065.",
  "url": "https://valentinaandolfi.it",
  "telephone": "+393466051282",
  "memberOf": {
    "@type": "Organization",
    "name": "Ordine degli Psicologi della Lombardia",
    "identifier": "17065"
  },
  "knowsAbout": [
    "psicoterapia umanistica",
    "approccio centrato sulla persona",
    "relazioni e identità",
    "consulenza psicologica di coppia",
    "supporto psicologico per giovani adulti",
    "ansia e momenti di cambiamento"
  ]
};

const Index = () => {
  return (
    <div>
      <SEOHead
        title="Psicoterapeuta Milano | Valentina Andolfi PhD"
        description="Psicologa e psicoterapeuta a Milano e online. Approccio centrato sulla persona. Riceve in Piazza Velasca 6 e online. Prenota un primo colloquio."
        path="/"
        jsonLd={[localBusinessJsonLd, personJsonLd]}
      />
      <Hero />
      <HomeContent />
    </div>
  );
};

export default Index;
