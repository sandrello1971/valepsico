import Hero from "@/components/Hero";
import HomeContent from "@/components/HomeContent";
import SEOHead from "@/components/SEOHead";

const SITE_URL = "https://valentinaandolfi.it";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const OPL_PROFILE_URL = "https://www.opl.it/psicologi/17065/Andolfi-Valentina-Rita";

// Scheda Google Business Profile (sede di Buccinasco — Centro Persona).
// NB: link del pannello informativo Google; sostituire con il link breve stabile
// della scheda Maps (https://maps.app.goo.gl/… o g.page/…) appena disponibile.
const GOOGLE_BUSINESS_URL = "https://www.google.com/search?q=Dott.ssa+Valentina+Rita+Andolfi+Psicoterapeuta";

// Profili social pubblici (mantenere allineati al Footer — vedi src/components/Footer.tsx)
const SOCIAL_PROFILES = [
  "https://www.linkedin.com/in/valentinaritaandolfi/",
  "https://www.facebook.com/valentinaritaandolfi",
  "https://www.instagram.com/valentina.rita.andolfi/"
];

// Sede primaria: Centro Persona, Buccinasco (MI). Collegata al profilo Google Business.
const centroPersonaJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MedicalBusiness"],
  "@id": `${SITE_URL}/#centro-persona`,
  "name": "Centro Persona — Dott.ssa Valentina Rita Andolfi",
  "description": "Studio di psicoterapia a Buccinasco (Milano sud-ovest), Via degli Aceri 2. Approccio Centrato sulla Persona. Sedute individuali, di coppia e per giovani adulti, anche online.",
  "url": SITE_URL,
  "image": OG_IMAGE,
  "logo": `${SITE_URL}/favicon.png`,
  "telephone": "+393466051282",
  "email": "info@valentinaandolfi.it",
  "priceRange": "€€",
  "medicalSpecialty": "Psychotherapy",
  "availableLanguage": ["it"],
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Bonifico bancario",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via degli Aceri 2",
    "addressLocality": "Buccinasco",
    "addressRegion": "Lombardia",
    "postalCode": "20090",
    "addressCountry": "IT"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 45.4147, "longitude": 9.0843 },
  "hasMap": GOOGLE_BUSINESS_URL,
  "areaServed": [
    { "@type": "City", "name": "Buccinasco" },
    { "@type": "City", "name": "Milano" },
    { "@type": "Country", "name": "Italia" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "20:00"
  },
  "sameAs": [...SOCIAL_PROFILES, GOOGLE_BUSINESS_URL],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Percorsi di psicoterapia",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Psicoterapia individuale", "serviceType": "Psychotherapy", "url": `${SITE_URL}/percorsi` } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Psicoterapia di coppia", "serviceType": "Couples therapy", "url": `${SITE_URL}/percorsi` } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consulenza per giovani adulti", "serviceType": "Young adults counseling", "url": `${SITE_URL}/percorsi` } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gruppi di incontro", "serviceType": "Group therapy", "url": `${SITE_URL}/percorsi` } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Psicoterapia online", "serviceType": "Online psychotherapy", "url": `${SITE_URL}/percorsi` } }
    ]
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  "name": "Valentina Rita Andolfi",
  "honorificPrefix": "Dott.ssa",
  "honorificSuffix": "PhD",
  "jobTitle": "Psicologa e Psicoterapeuta",
  "description": "Psicologa, psicoterapeuta e dottore di ricerca. Iscritta all'Ordine degli Psicologi della Lombardia n. 17065.",
  "url": SITE_URL,
  "image": OG_IMAGE,
  "telephone": "+393466051282",
  "email": "info@valentinaandolfi.it",
  "gender": "Female",
  "nationality": "IT",
  "knowsLanguage": ["it"],
  "worksFor": [
    { "@id": `${SITE_URL}/#centro-persona` }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Ordine degli Psicologi della Lombardia",
    "identifier": "17065",
    "url": "https://www.opl.it/"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "Iscrizione Ordine degli Psicologi della Lombardia",
    "credentialCategory": "Albo professionale",
    "identifier": "17065",
    "recognizedBy": {
      "@type": "Organization",
      "name": "Ordine degli Psicologi della Lombardia",
      "url": "https://www.opl.it/"
    },
    "url": OPL_PROFILE_URL
  },
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Università Cattolica del Sacro Cuore", "address": "Milano, IT" },
    { "@type": "CollegeOrUniversity", "name": "Tufts University", "address": "Boston, US" },
    { "@type": "EducationalOrganization", "name": "IACP — Istituto dell'Approccio Centrato sulla Persona", "address": "Milano, IT" }
  ],
  "knowsAbout": [
    "psicoterapia umanistica",
    "approccio centrato sulla persona",
    "relazioni e identità",
    "consulenza psicologica di coppia",
    "supporto psicologico per giovani adulti",
    "ansia e momenti di cambiamento"
  ],
  "sameAs": [...SOCIAL_PROFILES, GOOGLE_BUSINESS_URL, OPL_PROFILE_URL]
};

const Index = () => {
  return (
    <div>
      <SEOHead
        title="Psicologa e Psicoterapeuta a Buccinasco | V. R. Andolfi"
        description="Dott.ssa Valentina Rita Andolfi, psicologa e psicoterapeuta a Buccinasco (Milano) e online. Approccio centrato sulla persona. Prenota un primo colloquio."
        path="/"
        jsonLd={[centroPersonaJsonLd, personJsonLd]}
      />
      <Hero />
      <HomeContent />
    </div>
  );
};

export default Index;
