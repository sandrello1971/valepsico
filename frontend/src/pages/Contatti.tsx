import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { z } from 'zod';

const contactSchema = z.object({
  nome: z.string().trim().min(2, { message: "Il nome deve essere di almeno 2 caratteri" }).max(50, { message: "Il nome non può superare i 50 caratteri" }),
  email: z.string().trim().email({ message: "Inserisci un indirizzo email valido" }).max(255, { message: "L'email non può superare i 255 caratteri" }),
  telefono: z.string().trim().min(8, { message: "Inserisci un numero di telefono valido" }).max(20, { message: "Il telefono non può superare i 20 caratteri" }),
  messaggio: z.string().trim().min(10, { message: "Il messaggio deve essere di almeno 10 caratteri" }).max(1000, { message: "Il messaggio non può superare i 1000 caratteri" }),
  preferenza: z.enum(["presenza", "online", "entrambe"], { message: "Seleziona una preferenza valida" })
});

const Contatti = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
    preferenza: 'entrambe'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = contactSchema.parse(formData);

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Messaggio inviato con successo!",
        description: "Mi prenderò cura della tua richiesta e ti risponderò al più presto.",
      });

      setFormData({
        nome: '',
        email: '',
        telefono: '',
        messaggio: '',
        preferenza: 'entrambe'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Errore nell'invio",
          description: "Si è verificato un errore. Riprova più tardi o contattami direttamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefono / WhatsApp",
      details: "346 6051282",
      description: "Chiamami o scrivimi su WhatsApp"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@valentinaandolfi.it",
      description: "Scrivimi per qualsiasi informazione"
    },
    {
      icon: MapPin,
      title: "Milano",
      details: "Studio Velasca, Piazza Velasca 6",
      description: ""
    },
    {
      icon: MapPin,
      title: "Buccinasco",
      details: "Centro Persona, Via degli Aceri 2",
      description: ""
    },
    {
      icon: MapPin,
      title: "Online",
      details: "Sedute a distanza",
      description: ""
    }
  ];

  return (
    <div className="section-padding">
      <SEOHead
        title="Contatti - Prenota un Primo Colloquio | Psicologa Milano"
        description="Contatta la Dott.ssa Valentina Andolfi per prenotare un primo colloquio. Studio a Milano (Piazza Velasca 6), Buccinasco e sedute online."
        path="/contatti"
      />
      <div className="max-w-6xl mx-auto container-padding">
        {/* Page Header */}
        <header className="text-center mb-16 animate-fade-up">
          <h1 className="text-section-title mb-6">Contattami</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Se senti che è il momento di iniziare un percorso o vuoi semplicemente
            avere più informazioni, puoi scrivermi qui.
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-3">
            Ti risponderò personalmente.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="animate-fade-up">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-card-title mb-4">Scrivimi</h2>
                <p className="text-muted-foreground">
                  Il primo messaggio non deve essere "perfetto".
                  Può essere anche solo una sensazione, una domanda o un dubbio.
                </p>
                <p className="text-muted-foreground mt-3">
                  Ogni percorso inizia da qui.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <Label htmlFor="nome">Nome e Cognome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={errors.nome ? "border-destructive" : ""}
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? "nome-error" : undefined}
                    required
                    autoComplete="name"
                  />
                  {errors.nome && <p id="nome-error" role="alert" className="text-destructive text-sm mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-destructive" : ""}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    required
                    autoComplete="email"
                  />
                  {errors.email && <p id="email-error" role="alert" className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="telefono">Telefono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={errors.telefono ? "border-destructive" : ""}
                    aria-invalid={!!errors.telefono}
                    aria-describedby={errors.telefono ? "telefono-error" : undefined}
                    required
                    autoComplete="tel"
                  />
                  {errors.telefono && <p id="telefono-error" role="alert" className="text-destructive text-sm mt-1">{errors.telefono}</p>}
                </div>

                <div>
                  <Label htmlFor="preferenza">Preferenza per gli incontri *</Label>
                  <select
                    id="preferenza"
                    name="preferenza"
                    value={formData.preferenza}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-invalid={!!errors.preferenza}
                    aria-describedby={errors.preferenza ? "preferenza-error" : undefined}
                    required
                  >
                    <option value="presenza">In presenza</option>
                    <option value="online">Online</option>
                    <option value="entrambe">Entrambe le modalit&agrave;</option>
                  </select>
                  {errors.preferenza && <p id="preferenza-error" role="alert" className="text-destructive text-sm mt-1">{errors.preferenza}</p>}
                </div>

                <div>
                  <Label htmlFor="messaggio">Messaggio *</Label>
                  <Textarea
                    id="messaggio"
                    name="messaggio"
                    value={formData.messaggio}
                    onChange={handleInputChange}
                    placeholder="Raccontami liberamente cosa ti ha portato qui e cosa stai cercando in questo momento."
                    className={`min-h-[120px] ${errors.messaggio ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.messaggio}
                    aria-describedby={errors.messaggio ? "messaggio-error" : undefined}
                    required
                  />
                  {errors.messaggio && <p id="messaggio-error" role="alert" className="text-destructive text-sm mt-1">{errors.messaggio}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Invio in corso..." : "Invia Richiesta"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Compilando questo modulo accetti il trattamento dei dati personali
                  secondo la normativa vigente, esclusivamente per finalità di contatto professionale.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="animate-fade-up mb-8">
              <img
                src="https://valentinaandolfi.it/foto-review/NDRSFN_29092024_88.jpg"
                alt="Valentina Rita Andolfi"
                className="w-full max-h-64 object-cover rounded-2xl shadow-md"
              />
            </div>
            {/* Contatto diretto */}
            <Card className="animate-fade-up bg-gradient-hero">
              <CardContent className="p-8 text-center">
                <h3 className="text-card-title mb-4">Preferisci un contatto più diretto?</h3>
                <p className="text-muted-foreground mb-4 italic">
                  Puoi scrivermi anche solo per capire se questo percorso è adatto a te.
                </p>
                <p className="text-muted-foreground mb-2">
                  WhatsApp: 346 6051282
                </p>
                <p className="text-muted-foreground mb-4">
                  Email: info@valentinaandolfi.it
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Di solito rispondo entro 24–48 ore.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full btn-primary">
                    <a href="https://wa.me/393466051282">
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp: 346 6051282
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="animate-fade-up">
                  <CardContent className="p-6 text-center">
                    <div className="text-primary mb-3">
                      <info.icon size={32} className="mx-auto" />
                    </div>
                    <h4 className="font-semibold mb-2">{info.title}</h4>
                    <p className="font-medium text-foreground mb-1">{info.details}</p>
                    {info.description && <p className="text-sm text-muted-foreground">{info.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contatti;
