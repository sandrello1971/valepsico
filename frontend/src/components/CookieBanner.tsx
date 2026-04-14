import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  timestamp: string;
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, timestamp: new Date().toISOString() });
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, timestamp: new Date().toISOString() });
  };

  const savePreferences = () => {
    saveConsent({ necessary: true, analytics, timestamp: new Date().toISOString() });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consenso cookie"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-2">🍪 Utilizziamo i cookie</h2>
            <p className="text-sm text-muted-foreground">
              Questo sito utilizza cookie tecnici necessari al funzionamento e, con il tuo consenso, cookie analitici per migliorare la tua esperienza. 
              Puoi scegliere quali accettare. Per maggiori informazioni consulta la nostra{' '}
              <Link to="/cookie-policy" className="text-primary hover:underline font-medium">Cookie Policy</Link> e l'
              <Link to="/privacy-policy" className="text-primary hover:underline font-medium">Informativa Privacy</Link>.
            </p>
          </div>
          <button
            onClick={rejectAll}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Chiudi e rifiuta cookie non necessari"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3 border-t border-border pt-4" role="group" aria-label="Preferenze cookie">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Cookie Tecnici (Necessari)</p>
                <p className="text-xs text-muted-foreground">Essenziali per il funzionamento del sito</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Sempre attivi</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Cookie Analitici</p>
                <p className="text-xs text-muted-foreground">Ci aiutano a capire come viene utilizzato il sito</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Attiva cookie analitici"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-4">
          {showDetails ? (
            <Button onClick={savePreferences} size="sm">
              Salva preferenze
            </Button>
          ) : (
            <Button
              onClick={() => setShowDetails(true)}
              variant="outline"
              size="sm"
            >
              Personalizza
            </Button>
          )}
          <Button onClick={rejectAll} variant="outline" size="sm">
            Rifiuta tutti
          </Button>
          <Button onClick={acceptAll} size="sm">
            Accetta tutti
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
