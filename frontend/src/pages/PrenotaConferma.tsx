import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { bookingApi, type ConfirmResponse } from '@/lib/api';
import SEOHead from '@/components/SEOHead';

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 20; // ~30 secondi totali

const PrenotaConferma = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [data, setData] = useState<ConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setError('session_id mancante');
      return;
    }
    let active = true;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const r = await bookingApi.confirm(sessionId);
        if (!active) return;
        setData(r);
        // Se ancora pending, continua polling — il webhook potrebbe arrivare
        // qualche secondo dopo il redirect dell'utente
        if (r.status === 'pending' && attempts < MAX_POLL_ATTEMPTS) {
          timer = window.setTimeout(() => {
            setAttempts((a) => a + 1);
          }, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Errore');
      }
    };
    poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId, attempts]);

  const renderBody = () => {
    if (error) {
      return (
        <>
          <h1 className="text-section-title mb-4">Stato non disponibile</h1>
          <p className="text-muted-foreground mb-6">
            Non riesco a recuperare lo stato della prenotazione: {error}
          </p>
          <p className="text-muted-foreground mb-6">
            Se hai completato il pagamento, riceverai comunque l'email di
            conferma. In caso di dubbi, contattami a{' '}
            <a href="mailto:info@valentinaandolfi.it" className="underline">
              info@valentinaandolfi.it
            </a>
            .
          </p>
        </>
      );
    }
    if (!data) {
      return (
        <>
          <h1 className="text-section-title mb-4">Verifica in corso…</h1>
          <p className="text-muted-foreground">Sto controllando lo stato della prenotazione.</p>
        </>
      );
    }
    if (data.status === 'confirmed') {
      return (
        <>
          <h1 className="text-section-title mb-4">Appuntamento confermato</h1>
          <p className="text-foreground mb-3">
            La prenotazione è confermata per <strong>{data.when_local}</strong>.
          </p>
          <p className="text-muted-foreground mb-3">
            Modalità: <strong>{data.modality}</strong>.
          </p>
          <p className="text-muted-foreground mb-6">
            Ho inviato una conferma a <strong>{data.client_email}</strong> con
            il riepilogo e un allegato per aggiungere l'appuntamento al
            calendario.
          </p>
        </>
      );
    }
    if (data.status === 'pending') {
      return (
        <>
          <h1 className="text-section-title mb-4">In attesa di conferma del pagamento</h1>
          <p className="text-muted-foreground">
            Il pagamento è in elaborazione. La pagina si aggiorna automaticamente.
          </p>
          {attempts >= MAX_POLL_ATTEMPTS && (
            <p className="mt-4 text-muted-foreground">
              Sta richiedendo più tempo del previsto: puoi chiudere questa pagina
              — riceverai l'email di conferma appena il pagamento sarà processato.
            </p>
          )}
        </>
      );
    }
    if (data.status === 'expired' || data.status === 'cancelled') {
      return (
        <>
          <h1 className="text-section-title mb-4">Prenotazione non confermata</h1>
          <p className="text-muted-foreground mb-6">
            La prenotazione non è andata a buon fine{' '}
            {data.status === 'expired' ? '(slot scaduto)' : '(annullata)'}. Puoi
            riprovare scegliendo un nuovo orario.
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="section-padding">
      <SEOHead
        title="Conferma prenotazione | Valentina Rita Andolfi"
        description="Conferma della prenotazione del primo colloquio."
        path="/prenota/conferma"
        noindex
      />
      <div className="max-w-2xl mx-auto container-padding">
        <div className="bg-card rounded-2xl border p-8 animate-fade-up">
          {renderBody()}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/">
              <Button variant="outline">Torna alla home</Button>
            </Link>
            {data?.status !== 'confirmed' && (
              <Link to="/prenota">
                <Button>Prenota un nuovo orario</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrenotaConferma;
