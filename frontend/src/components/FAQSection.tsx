import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Quanto dura una seduta di psicoterapia?",
    answer: "Una seduta individuale dura circa 50 minuti. Le sedute di coppia e i gruppi di incontro possono avere una durata diversa, generalmente tra i 60 e i 90 minuti. La durata viene concordata insieme in base alle esigenze specifiche."
  },
  {
    question: "Come funziona la terapia online?",
    answer: "Le sedute online si svolgono tramite videochiamata sicura e offrono la stessa qualità professionale degli incontri in presenza. Sono ideali per chi ha difficoltà a raggiungere lo studio, vive fuori Milano o preferisce la comodità di casa propria. Serve solo una connessione internet stabile e un ambiente tranquillo e riservato."
  },
  {
    question: "Serve la prescrizione medica per andare dallo psicologo?",
    answer: "No, non è necessaria alcuna prescrizione medica per rivolgersi a uno psicologo o psicoterapeuta. Puoi contattarmi direttamente per fissare un primo colloquio. Le prestazioni psicologiche sono inoltre detraibili fiscalmente al 19%, anche senza prescrizione medica."
  },
  {
    question: "Come si svolge il primo colloquio?",
    answer: "Il primo colloquio è un momento di conoscenza reciproca: ti ascolto, raccogli informazioni sul tuo vissuto e insieme definiamo gli obiettivi del percorso. È anche un'occasione per te di valutare se ti senti a tuo agio con me e con il mio modo di lavorare. Non c'è alcun obbligo di proseguire."
  },
  {
    question: "Con quale frequenza si svolgono le sedute?",
    answer: "La frequenza viene concordata insieme e dipende dalle tue esigenze e obiettivi. Generalmente si parte con una seduta settimanale, per poi adattare il ritmo nel tempo. La flessibilità è un valore importante nel mio approccio."
  },
  {
    question: "Posso detrarre le spese dallo psicologo?",
    answer: "Sì, le prestazioni rese da uno psicologo iscritto all'Albo professionale danno diritto alla detrazione fiscale del 19% nella dichiarazione dei redditi, anche in assenza di prescrizione medica. Ti rilascerò regolare fattura per la detrazione."
  },
  {
    question: "Come faccio a capire se la terapia fa per me?",
    answer: "Il primo colloquio è proprio lo spazio per capirlo insieme. Non è un impegno: è un'occasione per raccontare cosa stai vivendo, fare domande e vedere se ti senti a tuo agio. Non c'è nessun obbligo di continuare."
  },
  {
    question: "Cosa succede se non mi sento a mio agio con il terapeuta?",
    answer: "È una possibilità reale e importante da considerare. La relazione terapeutica è il cuore del percorso: se non ti senti a tuo agio, ha senso cercarne uno con cui la connessione funzioni meglio. Puoi dirmelo in qualsiasi momento, senza imbarazzo."
  }
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const FAQSection = () => {
  return (
    <section className="mb-20" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-section-title text-center mb-12 animate-fade-up">
        Domande frequenti
      </h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="animate-fade-up border rounded-lg px-6">
              <AccordionTrigger className="text-lg text-left font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
