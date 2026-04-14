import SEOHead from '@/components/SEOHead';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Informativa sulla Privacy - Valentina Rita Andolfi"
        description="Informativa sulla privacy e trattamento dei dati personali del sito web della Dott.ssa Valentina Rita Andolfi, ai sensi del GDPR."
        path="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto container-padding py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Informativa sulla Privacy</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Titolare del Trattamento</h2>
            <p className="text-muted-foreground">
              Il Titolare del trattamento dei dati personali è <strong>Dott.ssa Valentina Rita Andolfi</strong>, Psicologa e Psicoterapeuta, 
              con sede operativa a Milano. Email: <a href="mailto:info@valentinaritandolfi.it" className="text-primary hover:underline">info@valentinaritandolfi.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Tipologia di Dati Raccolti</h2>
            <p className="text-muted-foreground">I dati personali raccolti attraverso questo sito web includono:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, orario di accesso.</li>
              <li><strong>Dati forniti volontariamente:</strong> nome, cognome, indirizzo email e altri dati inseriti nei moduli di contatto.</li>
              <li><strong>Cookie:</strong> dati raccolti tramite cookie tecnici e, previo consenso, cookie analitici e di profilazione.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Finalità del Trattamento</h2>
            <p className="text-muted-foreground">I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Rispondere alle richieste di contatto e informazioni inviate tramite il sito.</li>
              <li>Gestire la navigazione e il corretto funzionamento del sito web.</li>
              <li>Analisi statistiche anonime sull'utilizzo del sito (previo consenso).</li>
              <li>Adempiere ad obblighi di legge.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Base Giuridica del Trattamento</h2>
            <p className="text-muted-foreground">
              Il trattamento dei dati si basa su: consenso dell'interessato (art. 6, par. 1, lett. a GDPR), 
              esecuzione di misure precontrattuali (art. 6, par. 1, lett. b GDPR), 
              adempimento di obblighi legali (art. 6, par. 1, lett. c GDPR), 
              legittimo interesse del Titolare (art. 6, par. 1, lett. f GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Modalità del Trattamento</h2>
            <p className="text-muted-foreground">
              I dati personali sono trattati con strumenti automatizzati e non automatizzati, con logiche strettamente correlate 
              alle finalità indicate e con l'adozione di adeguate misure di sicurezza per prevenire accessi non autorizzati, 
              divulgazione, modifica o distruzione non autorizzata dei dati.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Conservazione dei Dati</h2>
            <p className="text-muted-foreground">
              I dati personali sono conservati per il tempo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti. 
              I dati relativi alle richieste di contatto sono conservati per un massimo di 24 mesi dalla raccolta, salvo diversa indicazione normativa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Comunicazione e Diffusione dei Dati</h2>
            <p className="text-muted-foreground">
              I dati personali non saranno diffusi e potranno essere comunicati esclusivamente a soggetti autorizzati al trattamento 
              (es. responsabili hosting, servizi email) che agiscono in qualità di responsabili del trattamento ai sensi dell'art. 28 GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Diritti dell'Interessato</h2>
            <p className="text-muted-foreground">Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto di:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Accedere ai propri dati personali.</li>
              <li>Richiedere la rettifica o la cancellazione dei dati.</li>
              <li>Richiedere la limitazione del trattamento.</li>
              <li>Opporsi al trattamento.</li>
              <li>Richiedere la portabilità dei dati.</li>
              <li>Revocare il consenso in qualsiasi momento.</li>
              <li>Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali.</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Per esercitare i propri diritti, è possibile contattare il Titolare all'indirizzo: 
              <a href="mailto:info@valentinaritandolfi.it" className="text-primary hover:underline">info@valentinaritandolfi.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Modifiche all'Informativa</h2>
            <p className="text-muted-foreground">
              Il Titolare si riserva il diritto di modificare la presente informativa in qualsiasi momento. 
              Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
