/* Akademiet — spørsmål del 6: grunnleggende gjenkjenning og definisjoner */
(function () {
  'use strict';
  const R = 'didaktikk';
  NG.content.addQuestions([
    { id: 'didaktikk.grunn.01', region: R, topic: 'Begrepsstigen', concepts: ['di-begrepsstigen'], level: 1, type: 'mc',
      prompt: 'Hva er det **øverste** trinnet på begrepsstigen?',
      options: ['Overføring', 'Definisjon', 'Gjenkjennelse', 'Nettverk'],
      answer: 0,
      why: { 1: 'Definisjon er trinn 2.', 2: 'Gjenkjennelse er det nederste trinnet.', 3: 'Nettverk er trinn 3 – i midten.' },
      explain: 'Overføring betyr at eleven kan bruke begrepet på et nytt fenomen hen ikke har møtt før. Det er der forståelsen viser seg sterkest.' },
    { id: 'didaktikk.grunn.02', region: R, topic: 'Språkaktiviteter', concepts: ['di-bindeord'], level: 1, type: 'tf',
      prompt: 'Påstand: «Fordi» og «derfor» er eksempler på bindeord.',
      answer: true,
      explain: 'Riktig. Bindeord knytter sammen setninger og ideer. Årsaksbindeord som «fordi» og «derfor» er særlig viktige i naturfag, fordi de gjør beskrivelser til forklaringer.' },
    { id: 'didaktikk.grunn.03', region: R, topic: 'Elevforestillinger om energi', concepts: ['di-elevforestilling'], level: 2, type: 'mc',
      prompt: 'Hva menes med en **elevforestilling**?',
      options: [
        "En idé eleven har fra før om et fenomen.",
        "Et skuespill elevene framfører for klassen.",
        "Et feilsvar på en prøve som skyldes slurv.",
        "Lærerens forventninger til eleven.",
      ],
      answer: 0,
      why: { 1: 'Ordspill – «forestilling» betyr her en tankemessig idé.', 2: 'Slurvefeil er tilfeldige; forestillinger er systematiske og robuste.', 3: 'Lærerforventninger er et annet tema.' },
      explain: 'Elevforestillinger er ikke tilfeldige feil, men sammenhengende ideer som fungerer i hverdagen («metall er kaldt»). Derfor er de seiglivede – og derfor må undervisningen ta dem på alvor.' },
    { id: 'didaktikk.grunn.04', region: R, topic: 'Vurdering', concepts: ['di-tilbakemelding'], level: 2, type: 'mc',
      prompt: 'Hva er en **fremovermelding**?',
      options: [
        "Et konkret neste steg mot målet.",
        "En melding til foreldrene om neste prøve.",
        "En karakter som varsler hvordan sluttkarakteren blir.",
        "Ros for det eleven har gjort bra.",
      ],
      answer: 0,
      why: { 1: 'Fremovermelding gis til eleven og handler om læring.', 2: 'En karakter sier ikke hva eleven skal gjøre.', 3: 'Ros ser bakover; fremovermelding ser framover.' },
      explain: 'Tilbakemeldingen sier hvor eleven er; fremovermeldingen sier hva neste steg er. Sammen gir de eleven både et bilde og en retning.' },
    { id: 'didaktikk.grunn.05', region: R, topic: 'Språkaktiviteter', concepts: ['di-sjanger'], level: 2, type: 'mc',
      prompt: 'Hvilken naturvitenskapelig sjanger har som hovedformål å svare på **hvorfor** noe skjer?',
      options: ['Forklaring', 'Instruksjon', 'Beskrivelse', 'Forsøksrapport'],
      answer: 0,
      why: { 1: 'En instruksjon forteller hvordan noe skal gjøres.', 2: 'En beskrivelse forteller hvordan noe er.', 3: 'En rapport dokumenterer en undersøkelse – den kan inneholde forklaring i drøftingen, men har et bredere formål.' },
      explain: 'Forklaringssjangeren er bygd som en årsakskjede: fenomenet presenteres, og så følger årsak–virkning med bindeord.' },
    { id: 'didaktikk.grunn.06', region: R, topic: 'Ord og begrep', concepts: ['di-overbegrep'], level: 2, type: 'tf',
      prompt: 'Påstand: «Energiform» er et overbegrep, og «kinetisk energi» er et av underbegrepene.',
      answer: true,
      explain: 'Riktig. Kinetisk, potensiell, kjemisk, termisk og elektrisk energi er underbegreper av energiform. Slike hierarkier gir elevene et kart å plassere nye begreper i.' },
  ]);
})();
