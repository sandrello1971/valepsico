// Postbuild prerender meta-only per il sito vetrina.
// Genera dist/<rotta>/index.html con title/meta/canonical/JSON-LD pre-iniettati,
// così crawler social/AI vedono i tag corretti senza dover eseguire JS.
//
// DRIFT WARNING: mantenere ROUTES allineato con i componenti <SEOHead>
// nei file src/pages/* — vedi commento "PRERENDER:KEEP_IN_SYNC" nei file.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const TEMPLATE = readFileSync(join(DIST, 'index.html'), 'utf8');

const SITE = 'https://valentinaandolfi.it';
const OG_IMAGE = `${SITE}/og-image.jpg`;
const OG_IMAGE_ALT = 'Dott.ssa Valentina Rita Andolfi, psicologa e psicoterapeuta a Milano';
const OPL_PROFILE_URL = 'https://www.opl.it/psicologi/17065/Andolfi-Valentina-Rita';

// Scheda Google Business Profile (sede di Buccinasco — Centro Persona).
// NB: link del pannello informativo Google; quando disponibile sostituire con
// il link breve stabile della scheda Maps (https://maps.app.goo.gl/… o g.page/…).
const GOOGLE_BUSINESS_URL =
  'https://www.google.com/search?q=Dott.ssa+Valentina+Rita+Andolfi+Psicoterapeuta';

// Profili social pubblici (mantenere allineati al Footer — vedi src/components/Footer.tsx)
const SOCIAL_PROFILES = [
  'https://www.linkedin.com/in/valentinaritaandolfi/',
  'https://www.facebook.com/valentinaritaandolfi',
  'https://www.instagram.com/valentina.rita.andolfi/',
];

// ---------- JSON-LD condivisi ----------

// Sede primaria: Centro Persona, Buccinasco (MI). Collegata al profilo Google Business.
const centroPersonaJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'MedicalBusiness'],
  '@id': `${SITE}/#centro-persona`,
  name: 'Centro Persona — Dott.ssa Valentina Rita Andolfi',
  description:
    'Studio di psicoterapia a Buccinasco (Milano sud-ovest), Via degli Aceri 2. Approccio Centrato sulla Persona. Sedute individuali, di coppia e per giovani adulti, anche online.',
  url: SITE,
  image: OG_IMAGE,
  logo: `${SITE}/favicon.png`,
  telephone: '+393466051282',
  email: 'info@valentinaandolfi.it',
  priceRange: '€€',
  medicalSpecialty: 'Psychotherapy',
  availableLanguage: ['it'],
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Bonifico bancario',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via degli Aceri 2',
    addressLocality: 'Buccinasco',
    addressRegion: 'Lombardia',
    postalCode: '20090',
    addressCountry: 'IT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 45.4147, longitude: 9.0843 },
  hasMap: GOOGLE_BUSINESS_URL,
  areaServed: [
    { '@type': 'City', name: 'Buccinasco' },
    { '@type': 'City', name: 'Milano' },
    { '@type': 'Country', name: 'Italia' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '20:00',
  },
  sameAs: [...SOCIAL_PROFILES, GOOGLE_BUSINESS_URL],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Percorsi di psicoterapia',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Psicoterapia individuale', serviceType: 'Psychotherapy', url: `${SITE}/percorsi` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Psicoterapia di coppia', serviceType: 'Couples therapy', url: `${SITE}/percorsi` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consulenza per giovani adulti', serviceType: 'Young adults counseling', url: `${SITE}/percorsi` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gruppi di incontro', serviceType: 'Group therapy', url: `${SITE}/percorsi` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Psicoterapia online', serviceType: 'Online psychotherapy', url: `${SITE}/percorsi` } },
    ],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Valentina Rita Andolfi',
  honorificPrefix: 'Dott.ssa',
  honorificSuffix: 'PhD',
  jobTitle: 'Psicologa e Psicoterapeuta',
  description:
    "Psicologa, psicoterapeuta e dottore di ricerca. Iscritta all'Ordine degli Psicologi della Lombardia n. 17065.",
  url: SITE,
  image: OG_IMAGE,
  telephone: '+393466051282',
  email: 'info@valentinaandolfi.it',
  gender: 'Female',
  nationality: 'IT',
  knowsLanguage: ['it'],
  worksFor: [
    { '@id': `${SITE}/#centro-persona` },
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'Ordine degli Psicologi della Lombardia',
    identifier: '17065',
    url: 'https://www.opl.it/',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Iscrizione Ordine degli Psicologi della Lombardia',
    credentialCategory: 'Albo professionale',
    identifier: '17065',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Ordine degli Psicologi della Lombardia',
      url: 'https://www.opl.it/',
    },
    url: OPL_PROFILE_URL,
  },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Università Cattolica del Sacro Cuore', address: 'Milano, IT' },
    { '@type': 'CollegeOrUniversity', name: 'Tufts University', address: 'Boston, US' },
    { '@type': 'EducationalOrganization', name: "IACP — Istituto dell'Approccio Centrato sulla Persona", address: 'Milano, IT' },
  ],
  knowsAbout: [
    'psicoterapia umanistica',
    'approccio centrato sulla persona',
    'relazioni e identità',
    'consulenza psicologica di coppia',
    'supporto psicologico per giovani adulti',
    'ansia e momenti di cambiamento',
  ],
  sameAs: [...SOCIAL_PROFILES, GOOGLE_BUSINESS_URL, OPL_PROFILE_URL],
};

const breadcrumb = (label, path) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: label, item: `${SITE}${path}` },
  ],
});

const faqs = [
  ['Quanto dura una seduta di psicoterapia?', 'Una seduta individuale dura circa 50 minuti. Le sedute di coppia e i gruppi di incontro possono avere una durata diversa, generalmente tra i 60 e i 90 minuti.'],
  ['Come funziona la terapia online?', 'Le sedute online si svolgono tramite videochiamata sicura e offrono la stessa qualità professionale degli incontri in presenza. Serve solo una connessione internet stabile.'],
  ['Serve la prescrizione medica per andare dallo psicologo?', 'No, non è necessaria alcuna prescrizione medica. Le prestazioni psicologiche sono inoltre detraibili fiscalmente al 19%.'],
  ['Come si svolge il primo colloquio?', "Il primo colloquio è un momento di conoscenza reciproca: ti ascolto, raccolgo informazioni sul tuo vissuto e insieme definiamo gli obiettivi del percorso. Non c'è obbligo di proseguire."],
  ['Con quale frequenza si svolgono le sedute?', 'La frequenza viene concordata insieme e dipende dalle tue esigenze. Generalmente si parte con una seduta settimanale.'],
  ['Posso detrarre le spese dallo psicologo?', "Sì, le prestazioni rese da uno psicologo iscritto all'Albo professionale danno diritto alla detrazione fiscale del 19% nella dichiarazione dei redditi."],
];
const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

// ---------- Routes ----------

const ROUTES = [
  {
    path: '/',
    title: 'Psicologa e Psicoterapeuta a Buccinasco | V. R. Andolfi',
    description:
      'Dott.ssa Valentina Rita Andolfi, psicologa e psicoterapeuta a Buccinasco (Milano) e online. Approccio centrato sulla persona. Prenota un primo colloquio.',
    jsonLd: [centroPersonaJsonLd, personJsonLd],
  },
  {
    path: '/chi-sono',
    title: 'Chi Sono | Valentina Rita Andolfi — Psicologa a Buccinasco',
    description:
      'Psicologa, psicoterapeuta e PhD a Buccinasco (Milano). Formata alla Cattolica e alla Tufts University di Boston. Specializzazione in Psicoterapia Umanistica IACP.',
    jsonLd: [breadcrumb('Chi Sono', '/chi-sono')],
  },
  {
    path: '/percorsi',
    title: 'Percorsi di Psicoterapia | Valentina Rita Andolfi — Psicologa a Buccinasco',
    description:
      'Psicoterapia individuale, di coppia, per giovani adulti e gruppi di incontro. A Buccinasco (Milano) e online. Approccio centrato sulla persona.',
    jsonLd: [breadcrumb('Percorsi', '/percorsi'), faqPageJsonLd],
  },
  {
    path: '/approccio',
    title: 'Approccio Centrato sulla Persona | Valentina Rita Andolfi — Psicologa a Buccinasco',
    description:
      "L'Approccio Centrato sulla Persona di Carl Rogers nella mia pratica clinica: come si svolge la psicoterapia, ruolo della relazione e cosa aspettarsi dal percorso.",
    jsonLd: [breadcrumb('Approccio', '/approccio')],
  },
  {
    path: '/contatti',
    title: 'Contatti e Primo Colloquio | Valentina Rita Andolfi — Psicologa a Buccinasco',
    description:
      'Contatta la Dott.ssa Valentina Rita Andolfi per un primo colloquio. Studio in Via degli Aceri 2 a Buccinasco (Milano) e sedute online. Risposta in 24-48h.',
    jsonLd: [breadcrumb('Contatti', '/contatti')],
  },
  {
    path: '/privacy-policy',
    title: 'Informativa Privacy | Valentina Rita Andolfi',
    description:
      'Informativa sulla privacy e trattamento dei dati personali ai sensi del GDPR per il sito di Valentina Rita Andolfi, psicologa e psicoterapeuta.',
    noindex: true,
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy | Valentina Rita Andolfi',
    description:
      'Cookie Policy del sito di Valentina Rita Andolfi, psicologa e psicoterapeuta. Informazioni sui cookie tecnici e analitici utilizzati.',
    noindex: true,
  },
];

// ---------- Renderer ----------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonLdScript(data) {
  // </script> safety: la spec impone escape forward slash nel close tag
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function renderHtml(route) {
  const url = `${SITE}${route.path === '/' ? '/' : route.path}`;
  const robots = route.noindex
    ? 'noindex,follow'
    : 'index,follow,max-image-preview:large,max-snippet:-1';

  let html = TEMPLATE;

  // 1) <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  // 2) meta description
  html = html.replace(
    /<meta\s+name="description"[^>]*\/?>/i,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  );

  // 3) meta robots (rimpiazza se presente, altrimenti aggiunge)
  if (/<meta\s+name="robots"[^>]*\/?>/i.test(html)) {
    html = html.replace(/<meta\s+name="robots"[^>]*\/?>/i, `<meta name="robots" content="${robots}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="robots" content="${robots}" />\n  </head>`);
  }

  // 4) canonical
  html = html.replace(
    /<link\s+rel="canonical"[^>]*\/?>/i,
    `<link rel="canonical" href="${url}" />`
  );

  // 5) Open Graph: title, description, url
  html = html.replace(/<meta\s+property="og:title"[^>]*\/?>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta\s+property="og:description"[^>]*\/?>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/<meta\s+property="og:url"[^>]*\/?>/i, `<meta property="og:url" content="${url}" />`);

  // 6) Twitter: title, description
  html = html.replace(/<meta\s+name="twitter:title"[^>]*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"[^>]*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);

  // 7) JSON-LD: appendo (lasciando intatto il WebSite globale presente nel template)
  if (route.jsonLd && route.jsonLd.length) {
    const scripts = route.jsonLd.map(jsonLdScript).join('\n  ');
    html = html.replace('</head>', `  ${scripts}\n  </head>`);
  }

  return html;
}

// ---------- Esecuzione ----------

let written = 0;
for (const route of ROUTES) {
  const html = renderHtml(route);
  const outDir = route.path === '/' ? DIST : join(DIST, route.path.replace(/^\//, ''));
  const outFile = join(outDir, 'index.html');
  if (route.path !== '/') mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, html, 'utf8');
  written++;
  console.log(`prerender → ${route.path === '/' ? '/' : route.path + '/'}index.html  (${route.title})`);
}
console.log(`\nPrerender done. ${written} HTML files generated.`);
