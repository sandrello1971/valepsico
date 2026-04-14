import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import ApproachSection from "@/components/ApproachSection";
import PersonalitySection from "@/components/PersonalitySection";
import BlogPreview from "@/components/BlogPreview";
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
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Bank Transfer",
  "medicalSpecialty": "Psychiatry",
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
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "45.4608",
    "longitude": "9.1905"
  },
  "areaServed": [
    { "@type": "City", "name": "Milano" },
    { "@type": "City", "name": "Buccinasco" },
    { "@type": "Country", "name": "Italia" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "20:00"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servizi di psicologia e psicoterapia",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Psicoterapia individuale", "description": "Percorso individuale per chi si sente confuso, bloccato o lontano da sé stesso." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Psicoterapia di coppia", "description": "Supporto per coppie che vivono distanza, incomprensioni o conflitti che si ripetono." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consulenza per giovani adulti", "description": "Percorso per chi sta attraversando un momento di passaggio tra identità, scelte e autonomia." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gruppi di incontro", "description": "Spazio condiviso per esplorare sé stessi attraverso la relazione con gli altri." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sedute online", "description": "Psicoterapia tramite videochiamata, stessa qualità professionale degli incontri in studio." } }
    ]
  },
  "sameAs": [
    "https://valentinaandolfi.it"
  ]
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Valentina Rita Andolfi",
  "givenName": "Valentina Rita",
  "familyName": "Andolfi",
  "honorificPrefix": "Dott.ssa",
  "jobTitle": "Psicologa e Psicoterapeuta",
  "description": "Psicologa, psicoterapeuta e dottore di ricerca. Iscritta all'Ordine degli Psicologi della Lombardia n. 17065. Specializzata in relazioni, identità e momenti di difficoltà personale. Approccio Centrato sulla Persona.",
  "url": "https://valentinaandolfi.it",
  "telephone": "+393466051282",
  "memberOf": {
    "@type": "Organization",
    "name": "Ordine degli Psicologi della Lombardia",
    "identifier": "17065"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Laurea",
      "name": "Laurea in Psicologia, Empowerment e Benessere",
      "educationalLevel": "Laurea magistrale",
      "recognizedBy": { "@type": "CollegeOrUniversity", "name": "Università Cattolica del Sacro Cuore di Milano" }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "PhD",
      "name": "Dottorato di ricerca in Psicologia dello Sviluppo e del Benessere",
      "educationalLevel": "Dottorato",
      "recognizedBy": [
        { "@type": "CollegeOrUniversity", "name": "Università Cattolica del Sacro Cuore di Milano" },
        { "@type": "CollegeOrUniversity", "name": "Tufts University, Boston" }
      ]
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Specializzazione",
      "name": "Specializzazione in Psicoterapia Umanistica",
      "recognizedBy": { "@type": "Organization", "name": "IACP – Istituto dell'Approccio Centrato sulla Persona, Milano" }
    }
  ],
  "knowsAbout": [
    "psicoterapia umanistica",
    "approccio centrato sulla persona",
    "psicologia del benessere",
    "relazioni e identità",
    "consulenza psicologica di coppia",
    "supporto psicologico per giovani adulti",
    "ansia e momenti di cambiamento",
    "empowerment"
  ],
  "workLocation": [
    { "@type": "Place", "name": "Studio Velasca", "address": "Piazza Velasca 6, Milano" },
    { "@type": "Place", "name": "Centro Persona", "address": "Via degli Aceri 2, Buccinasco" }
  ],
  "sameAs": [
    "https://valentinaandolfi.it"
  ]
};

const Index = () => {
  return (
    <div>
      <SEOHead
        title="Valentina Rita Andolfi - Psicologa e Psicoterapeuta a Milano e Online"
        description="Valentina Rita Andolfi, psicologa e psicoterapeuta a Milano e online. Iscritta all'Ordine degli Psicologi della Lombardia n. 17065. Specializzata in relazioni, identità e difficoltà personale. Approccio Centrato sulla Persona. Riceve in Piazza Velasca 6, Milano e online."
        path="/"
        jsonLd={[localBusinessJsonLd, personJsonLd]}
      />
      <Hero />
      <IntroSection />
      <ApproachSection />
      <PersonalitySection />
      <BlogPreview />
    </div>
  );
};

export default Index;
