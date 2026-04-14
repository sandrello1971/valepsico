import { Card } from '@/components/ui/card';

const IntroSection = () => {
  return (
    <>
      {/* Griglia 3 colonne */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Piacere, mi presento */}
            <Card className="p-8 bg-white border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-foreground mb-6 font-serif">
                Piacere, mi presento...
              </h2>
              <div className="space-y-4 text-foreground text-base leading-relaxed">
                <p>
                  sono <strong>Psicologa</strong>, <strong>Psicoterapeuta</strong> e <strong>Dottore di Ricerca</strong>, iscritta all'Ordine degli Psicologi e degli Psicoterapeuti della Lombardia (n. 17065).
                </p>
                <p>
                  Ti accompagno a <strong>conoscere</strong> meglio <strong>te stesso</strong> e <strong>gli altri</strong>, a <strong>sviluppare</strong> nuove <strong>abilit&agrave;</strong> e a <strong>costruire</strong> una <strong>vita</strong> pi&ugrave; serena.
                </p>
                <p>
                  <strong>Affrontare i cambiamenti</strong> pu&ograve; essere sfidante ma in questo percorso <strong>non sei solo</strong>.
                </p>
                <p>
                  <strong>Insieme, trasformeremo</strong> gli ostacoli in <strong>opportunit&agrave;</strong> di crescita.
                </p>
                <p>
                  Fare il primo passo richiede <strong>coraggio</strong>. Prendi un respiro e <strong>ascoltati</strong>: &egrave; arrivato il momento di <strong>cambiare</strong>?
                </p>
                <p className="text-foreground font-bold italic">
                  Io sono pronta ad accompagnarti in questo viaggio!
                </p>
              </div>
            </Card>

            {/* Puoi rivolgerti a me se */}
            <Card className="p-8 bg-white border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-foreground mb-6 font-serif">
                Puoi rivolgerti a me se:
              </h2>
              <div className="space-y-4 text-foreground text-base leading-relaxed">
                <p>
                  Le <strong>emozioni</strong> che stai vivendo ti bloccano o ti creano sofferenza.
                </p>
                <p>
                  Ti senti <strong>solo</strong>, come se nessuno potesse capire quello che provi.
                </p>
                <p>
                  Vuoi affrontare un <strong>conflitto</strong> che ti sembra irrisolvibile.
                </p>
                <p>
                  Senti il bisogno di capire meglio i tuoi <strong>bisogni</strong> e vuoi attuare un cambiamento.
                </p>
                <p>
                  Sei in difficolt&agrave; perch&eacute; non riesci a superare una <strong>perdita</strong> o un evento doloroso.
                </p>
                <p>
                  Stai lottando per affrontare delle <strong>decisioni</strong> e non riesci a orientarti.
                </p>
                <p>
                  Desideri conoscere meglio <strong>te stesso</strong>, essere consapevole delle tue risorse e trasformare la tua vita in meglio.
                </p>
              </div>
            </Card>

            {/* Cosa posso fare per te */}
            <Card className="p-8 bg-white border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-foreground mb-6 font-serif">
                Cosa posso fare per te?
              </h2>
              <div className="space-y-4 text-foreground text-base leading-relaxed">
                <p>
                  Tanti <strong>percorsi</strong> tra cui <strong>scegliere</strong> per rispondere ai tuoi <strong>bisogni</strong>.
                </p>

                <div className="space-y-4">
                  <div>
                    <strong className="block mb-1">Consulenza psicologica individuale</strong>: ti accompagno a fare vivere in armonia <strong>emozioni, pensieri e comportamenti</strong>.
                  </div>

                  <div>
                    <strong className="block mb-1">Consulenza psicologica di coppia</strong>: vi aiuto a ristabilire un <strong>dialogo costruttivo</strong>, affrontare insieme le sfide e condividere i traguardi.
                  </div>

                  <div>
                    <strong className="block mb-1">Gruppi di incontro</strong>: facilito spazi di condivisione e <strong>supporto</strong> reciproco, in cui affrontare temi comuni e <strong>crescere</strong> insieme.
                  </div>

                  <div>
                    <strong className="block mb-1">Percorsi di empowerment e life skills</strong>: sviluppa competenze essenziali per il <strong>benessere</strong> personale e professionale.
                  </div>

                  <div>
                    <strong className="block mb-1">Formazione, progettazione e ricerca</strong>: consulenze e percorsi costruiti <strong>ad hoc</strong> per aziende, scuole e istituzioni.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sezione Apertura */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 font-serif text-center">
            Ti &egrave; mai capitato di sentire che qualcosa dentro di te non sta bene, anche se &egrave; difficile da spiegare?
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              Forse &egrave; una sensazione sottile, o qualcosa di pi&ugrave; intenso: ansia, confusione, relazioni che fanno soffrire, momenti in cui ti senti bloccato o lontano da te stesso.
            </p>
            <p>
              A volte si va avanti cos&igrave; per molto tempo, cercando di capire da soli, senza riuscirci davvero.
            </p>
            <p>
              Qualunque cosa sia, pu&ograve; essere importante darle spazio.
            </p>
            <p>
              <strong>Non &egrave; necessario avere subito risposte chiare.</strong> A volte &egrave; pi&ugrave; importante iniziare ad ascoltarsi, con qualcuno accanto.
            </p>
          </div>
        </div>
      </section>

      {/* Sottotitolo Trasformativo */}
      <section className="section-padding bg-muted/20">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <p className="text-2xl font-bold text-foreground mb-4">
            Ti aiuto a comprendere ci&ograve; che stai vivendo e a ritrovare un equilibrio nelle relazioni e dentro di te.
          </p>
          <p className="text-xl text-foreground">
            Per passare dal sentirti confuso o bloccato a sentirti pi&ugrave; chiaro, pi&ugrave; stabile, pi&ugrave; vicino a chi sei.
          </p>
        </div>
      </section>

      {/* Citazione 1 */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <blockquote className="text-2xl italic font-serif text-foreground">
            <p>&ldquo;E venne il giorno in cui il rischio di rimanere chiuso in un bocciolo divenne pi&ugrave; doloroso del rischio di sbocciare.&rdquo;</p>
            <footer className="mt-4 text-lg text-muted-foreground not-italic">&mdash; Ana&iuml;s Nin</footer>
          </blockquote>
        </div>
      </section>

    </>
  );
};

export default IntroSection;
