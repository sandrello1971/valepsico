import SEOHead from '@/components/SEOHead';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cookie Policy | Valentina Rita Andolfi"
        description="Cookie Policy del sito di Valentina Rita Andolfi, psicologa e psicoterapeuta. Informazioni sui cookie tecnici e analitici utilizzati."
        path="/cookie-policy"
        noindex
      />
      <div className="max-w-4xl mx-auto container-padding py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Cosa sono i Cookie</h2>
            <p className="text-muted-foreground">
              I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell'utente, 
              dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. 
              I cookie sono utilizzati per diverse finalità, hanno caratteristiche diverse, e possono essere utilizzati 
              sia dal titolare del sito che da terze parti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Tipologie di Cookie Utilizzati</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6">Cookie Tecnici (Necessari)</h3>
            <p className="text-muted-foreground">
              Questi cookie sono essenziali per il corretto funzionamento del sito web. Includono cookie di sessione 
              e cookie funzionali che memorizzano le preferenze dell'utente (es. preferenze sui cookie). 
              Non richiedono il consenso dell'utente ai sensi dell'art. 122, comma 1 del Codice Privacy.
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Cookie</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Finalità</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 text-sm text-muted-foreground">cookie_consent</td>
                    <td className="p-3 text-sm text-muted-foreground">Memorizza le preferenze sui cookie</td>
                    <td className="p-3 text-sm text-muted-foreground">12 mesi</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-foreground mt-6">Cookie Analitici (Previo Consenso)</h3>
            <p className="text-muted-foreground">
              Questi cookie sono utilizzati per raccogliere informazioni sull'utilizzo del sito in forma aggregata e anonima. 
              Vengono attivati solo previo consenso esplicito dell'utente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Base Giuridica</h2>
            <p className="text-muted-foreground">
              Per i cookie tecnici, la base giuridica è il legittimo interesse del Titolare al corretto funzionamento del sito 
              (art. 122, comma 1 del D.Lgs. 196/2003). Per i cookie analitici e di profilazione, la base giuridica è il consenso 
              dell'utente (art. 122, comma 1 del D.Lgs. 196/2003 e art. 6, par. 1, lett. a del GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Gestione dei Cookie</h2>
            <p className="text-muted-foreground">
              L'utente può gestire le proprie preferenze sui cookie in qualsiasi momento attraverso il banner dei cookie 
              presente sul sito o attraverso le impostazioni del proprio browser.
            </p>
            <p className="text-muted-foreground mt-4">
              Per modificare le impostazioni dei cookie nel browser, consulta le guide ufficiali:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Diritti dell'Utente</h2>
            <p className="text-muted-foreground">
              L'utente può esercitare i diritti previsti dagli artt. 15-22 del GDPR contattando il Titolare del trattamento 
              all'indirizzo email: <a href="mailto:info@valentinaandolfi.it" className="text-primary hover:underline">info@valentinaandolfi.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Aggiornamenti</h2>
            <p className="text-muted-foreground">
              La presente Cookie Policy può essere soggetta a modifiche. Si consiglia di consultare periodicamente questa pagina 
              per essere informati su eventuali aggiornamenti.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
