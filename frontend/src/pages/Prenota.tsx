import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  bookingApi,
  type AvailabilitySlot,
  type BookingSettings,
  type DayStatus,
} from '@/lib/api';
import SEOHead from '@/components/SEOHead';

const formSchema = z.object({
  client_name: z
    .string()
    .trim()
    .min(2, { message: 'Inserisci il tuo nome' })
    .max(80, { message: 'Nome troppo lungo' }),
  client_email: z
    .string()
    .trim()
    .email({ message: 'Email non valida' })
    .max(255),
  client_phone: z
    .string()
    .trim()
    .min(8, { message: 'Telefono non valido' })
    .max(20),
  notes: z.string().trim().max(1000).optional(),
  modality: z.enum(['presenza', 'online']),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'È necessario il consenso al trattamento dei dati' }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

function fmtDate(d: Date): string {
  // Local YYYY-MM-DD (no timezone conversion, è il giorno scelto dall'utente)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

const Prenota = () => {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mese visualizzato + mappa status per giorno (chiave YYYY-MM-DD)
  const [calendarMonth, setCalendarMonth] = useState<Date>(startOfMonth(new Date()));
  const [daySummary, setDaySummary] = useState<Record<string, DayStatus>>({});

  // Carica settings al mount
  useEffect(() => {
    bookingApi.settings().then(setSettings).catch((err) => {
      console.error(err);
      toast.error('Impossibile caricare le impostazioni di prenotazione');
    });
  }, []);

  // Carica summary del mese visibile (+ adiacenze visibili nel calendario)
  useEffect(() => {
    const from = fmtDate(startOfMonth(calendarMonth));
    // Carica anche qualche giorno del mese successivo per coprire le celle
    // "outside" che react-day-picker visualizza nella griglia.
    const monthEnd = endOfMonth(calendarMonth);
    const to = fmtDate(new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + 7));
    bookingApi
      .availabilitySummary(from, to)
      .then((r) => {
        const map: Record<string, DayStatus> = {};
        for (const d of r.days) map[d.date] = d.status;
        setDaySummary((prev) => ({ ...prev, ...map }));
      })
      .catch((err) => {
        console.error('summary error', err);
        // non bloccante: il giorno verrà comunque cliccabile, e step 2 mostrerà
        // "Nessun orario disponibile" se appropriato
      });
  }, [calendarMonth]);

  // Carica slot quando cambia data
  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);
    bookingApi
      .availability(fmtDate(date))
      .then((r) => setSlots(r.slots))
      .catch((err) => {
        console.error(err);
        toast.error('Errore nel caricamento degli orari disponibili');
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [date]);

  // Limiti calendario
  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const max = settings
      ? new Date(min.getTime() + settings.max_days_ahead * 24 * 3600 * 1000)
      : new Date(min.getTime() + 60 * 24 * 3600 * 1000);
    return { minDate: min, maxDate: max };
  }, [settings]);

  // Set di Date per i giorni "pieni" e "parzialmente occupati", per i modifiers
  // di react-day-picker (vuole array di Date, non di stringhe).
  const { partialDays, fullDays } = useMemo(() => {
    const partial: Date[] = [];
    const full: Date[] = [];
    for (const [ymd, status] of Object.entries(daySummary)) {
      const [y, m, d] = ymd.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      if (status === 'partial') partial.push(dt);
      else if (status === 'full') full.push(dt);
    }
    return { partialDays: partial, fullDays: full };
  }, [daySummary]);

  // Un giorno è "non selezionabile" se: fuori range, chiuso, o pieno.
  function isDayDisabled(d: Date): boolean {
    if (d < minDate || d > maxDate) return true;
    const key = fmtDate(d);
    const status = daySummary[key];
    return status === 'closed' || status === 'full';
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      notes: '',
      modality: 'presenza',
      privacy_consent: false as unknown as true,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!selectedSlot) {
      toast.error('Seleziona un orario');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingApi.create({
        start_at: selectedSlot.startUtc,
        end_at: selectedSlot.endUtc,
        client_name: values.client_name,
        client_email: values.client_email,
        client_phone: values.client_phone,
        notes: values.notes || undefined,
        modality: values.modality,
        privacy_consent: true,
      });
      // Redirect a Stripe Checkout hosted
      window.location.href = res.checkout_url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore nella prenotazione';
      toast.error(msg);
      setSubmitting(false);
    }
  }

  const depositLabel = settings
    ? `€ ${(settings.deposit_cents / 100).toFixed(2)}`
    : '';

  return (
    <div className="section-padding">
      <SEOHead
        title="Prenota un primo colloquio | Valentina Rita Andolfi — Psicologa a Buccinasco"
        description="Prenota online un primo colloquio con la Dott.ssa Valentina Rita Andolfi. In presenza a Buccinasco (Milano) o online. Acconto a conferma dell'appuntamento."
        path="/prenota"
      />
      <div className="max-w-4xl mx-auto container-padding">
        <header className="mb-12 animate-fade-up">
          <h1 className="text-section-title mb-4">Prenota un primo colloquio</h1>
          <p className="text-lg text-muted-foreground">
            Scegli giorno e orario, inserisci i tuoi dati e versa un acconto a
            conferma dell'appuntamento. Il saldo si concorda in seduta.
          </p>
        </header>

        {/* STEP 1 — Calendario */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">1. Scegli il giorno</h2>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDayDisabled}
              fromDate={minDate}
              toDate={maxDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              weekStartsOn={1}
              modifiers={{ partial: partialDays, full: fullDays }}
              modifiersClassNames={{
                partial:
                  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-amber-500",
                full: 'line-through opacity-40',
              }}
              className="rounded-xl border bg-card p-4 md:p-6 shadow-sm"
              classNames={{
                months: 'flex flex-col sm:flex-row gap-8',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-lg font-semibold',
                nav: 'space-x-1 flex items-center',
                nav_button:
                  'h-9 w-9 bg-transparent p-0 opacity-70 hover:opacity-100 inline-flex items-center justify-center rounded-md border',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse',
                head_row: 'flex',
                head_cell:
                  'text-muted-foreground rounded-md w-12 md:w-14 font-medium text-xs uppercase tracking-wide',
                row: 'flex w-full mt-1',
                cell: 'h-12 w-12 md:h-14 md:w-14 text-center text-base p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-12 w-12 md:h-14 md:w-14 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md hover:bg-muted',
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground font-semibold',
                day_outside: 'text-muted-foreground opacity-40',
                day_disabled: 'text-muted-foreground opacity-40 cursor-not-allowed',
                day_hidden: 'invisible',
              }}
            />
            <div className="text-sm text-muted-foreground space-y-2 md:pt-2">
              <p className="font-medium text-foreground">Legenda</p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Alcuni orari già occupati</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 text-center line-through opacity-40">
                  15
                </span>
                <span>Giorno completo o chiuso</span>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 — Slot del giorno */}
        {date && (
          <section className="mb-12 animate-fade-up">
            <h2 className="text-xl font-semibold mb-4">
              2. Orari disponibili
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {date.toLocaleDateString('it-IT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </h2>
            {loadingSlots ? (
              <p className="text-muted-foreground">Caricamento orari…</p>
            ) : slots.length === 0 ? (
              <p className="text-muted-foreground">
                Nessun orario disponibile in questo giorno. Prova un'altra data.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => {
                  const active = selectedSlot?.startUtc === s.startUtc;
                  return (
                    <button
                      key={s.startUtc}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* STEP 3 — Form dati */}
        {selectedSlot && (
          <section className="animate-fade-up">
            <h2 className="text-xl font-semibold mb-4">3. I tuoi dati</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Nome e cognome</Label>
                  <Input
                    id="client_name"
                    {...form.register('client_name')}
                    autoComplete="name"
                  />
                  {form.formState.errors.client_name && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.client_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="client_phone">Telefono</Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    {...form.register('client_phone')}
                    autoComplete="tel"
                  />
                  {form.formState.errors.client_phone && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.client_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="client_email">Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  {...form.register('client_email')}
                  autoComplete="email"
                />
                {form.formState.errors.client_email && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.client_email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Modalità</Label>
                <RadioGroup
                  defaultValue="presenza"
                  onValueChange={(v) =>
                    form.setValue('modality', v as 'presenza' | 'online')
                  }
                  className="mt-2 flex gap-6"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="presenza" id="m-presenza" />
                    <span>In presenza</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="online" id="m-online" />
                    <span>Online</span>
                  </label>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="notes">Note (facoltative)</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  {...form.register('notes')}
                  placeholder="Se vuoi, scrivi qualcosa che ritieni utile sapere in anticipo."
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy_consent"
                  onCheckedChange={(checked) =>
                    form.setValue('privacy_consent', checked === true ? true : (false as unknown as true))
                  }
                />
                <label
                  htmlFor="privacy_consent"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  Acconsento al trattamento dei miei dati personali secondo
                  l'<a href="/privacy-policy" className="underline">informativa privacy</a>.
                </label>
              </div>
              {form.formState.errors.privacy_consent && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.privacy_consent.message}
                </p>
              )}

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                Acconto a conferma dell'appuntamento:{' '}
                <strong className="text-foreground">{depositLabel}</strong>.
                Il saldo del costo della seduta si concorda in seduta.
              </div>

              <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto">
                {submitting ? 'Attendere…' : 'Procedi al pagamento'}
              </Button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default Prenota;
