

# Ottimizzazione SEO e GEO (Generative Engine Optimization)

## Panoramica

Implementare ottimizzazioni per i motori di ricerca tradizionali (SEO) e per i motori di ricerca generativi basati su AI (GEO), come Google AI Overviews, ChatGPT Search, Perplexity.

## Cosa manca attualmente

- Nessun dato strutturato (Schema.org JSON-LD)
- Meta tag per pagina mancanti (ogni pagina ha lo stesso title/description dell'homepage)
- Nessun sitemap.xml
- robots.txt senza riferimento al sitemap
- Heading hierarchy non sempre ottimale per GEO
- Nessun contenuto FAQ strutturato (fondamentale per GEO)
- Alt text immagini migliorabili

## Modifiche previste

### 1. Componente SEO dinamico per pagina (nuovo file)
Creare `src/components/SEOHead.tsx` usando `react-helmet-async` per impostare title, description, canonical e og:tags unici per ogni pagina. Installare `react-helmet-async`.

### 2. Schema.org JSON-LD (GEO + SEO)
Aggiungere dati strutturati direttamente in `index.html` e nei componenti:
- **LocalBusiness + Psychologist** nella homepage: nome, indirizzo, telefono, orari, area servita
- **FAQPage** nella pagina Chi Sono (sezione "Facciamo un po' di chiarezza") e Servizi
- **BreadcrumbList** per la navigazione
- **Person + MedicalBusiness** con credenziali professionali
- **BlogPosting** per ogni articolo del blog

### 3. Meta tag per ogni pagina
| Pagina | Title | Description |
|--------|-------|-------------|
| Home | Valentina Rita Andolfi - Psicologa e Psicoterapeuta a Milano e Online | Psicologa e psicoterapeuta a Milano... |
| Chi Sono | Chi Sono - Dott.ssa Valentina Rita Andolfi, Psicologa PhD | La mia storia, formazione e approccio... |
| Servizi | Servizi - Consulenza Psicologica Individuale, di Coppia e Online | Consulenza individuale, di coppia, giovani adulti... |
| Blog | Blog di Psicologia - Articoli su Benessere e Crescita Personale | Articoli e riflessioni... |
| Contatti | Contatti - Prenota un Colloquio Gratuito | Contattami per prenotare... |

### 4. Sitemap.xml statico
Creare `public/sitemap.xml` con tutte le pagine del sito e relative priorità.

### 5. Aggiornare robots.txt
Aggiungere riferimento al sitemap e regole per i bot AI (GPTBot, ChatGPT-User, PerplexityBot, Google-Extended).

### 6. Sezione FAQ strutturata per GEO
Aggiungere una sezione FAQ visibile in fondo alla pagina Servizi con domande comuni:
- "Quanto dura una seduta?"
- "Quanto costa una seduta?"
- "Come funziona la terapia online?"
- "Serve la prescrizione medica?"
Queste risposte strutturate sono il contenuto primario che i motori AI estraggono.

### 7. Ottimizzazioni contenuto per GEO
- Aggiungere frasi "citabili" nel testo (affermazioni chiare e concise che un AI può estrarre)
- Assicurare che ogni sezione abbia un heading semantico chiaro (h2/h3)
- Aggiungere attributi `itemScope`/`itemType` dove rilevante

## Dettagli tecnici

- **Nuova dipendenza**: `react-helmet-async`
- **Nuovi file**: `src/components/SEOHead.tsx`, `public/sitemap.xml`
- **File modificati**: `index.html`, `public/robots.txt`, `src/main.tsx`, `src/App.tsx`, tutte le pagine (Index, ChiSono, Servizi, Blog, Contatti, PrivacyPolicy, CookiePolicy)
- **Nessuna modifica al backend**

