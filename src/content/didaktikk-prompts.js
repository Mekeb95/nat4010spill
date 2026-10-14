/* Akademiet — Orakel-oppgaver (fritekst) */
(function () {
  'use strict';
  const R = 'didaktikk';
  NG.content.addPrompts([
    { id: 'didaktikk.or.1', region: R, concepts: ['di-elevforestilling', 'di-energiverktoy'],
      prompt: 'En elev sier: «Metallbeinet er kaldere enn treplata.» Hvilken forestilling er dette, og hvordan vil du møte den i undervisningen? Begrunn med kilder.',
      rubric: 'Identifiserer forestillingen «temperatur som materialegenskap» (Henriksen & Angell 2019). Faglig: samme temperatur (nulte lov, termometer), metall leder varme bedre (frie elektroner), hånda mister energi raskere. Grep: grubletegning/prediksjon, måling som evidens, forklaring, overføring til ny situasjon; hverdagsspråk → fagspråk. Kildebegrunnelse.',
      model: 'Eleven ser temperatur som en egenskap ved materialet (Henriksen & Angell, 2019). Jeg starter med en grubletegning og lar elevene forutsi. Så måler de begge med termometer og finner samme temperatur. Da må vi forklare hvorfor metallet likevel føles kaldt: hånda er varmere, og metallet leder energien raskere bort, slik at huden kjøles mer. Til slutt bruker elevene ideen på trehåndtaket på stekepanna.' },
    { id: 'didaktikk.or.2', region: R, concepts: ['di-ord-begrep', 'di-begrepsstigen'],
      prompt: 'Forklar forskjellen på ord og begrep, og vis med et eksempel fra naturfag hvordan du kan hjelpe elevene opp begrepsstigen.',
      rubric: 'Ord = form, begrep = innhold/nettverk. Eksempel med samme ord/ulikt begrep (arbeid, varme) eller ulike ord/samme begrep. Begrepsstigen: gjenkjennelse → definisjon → nettverk → anvendelse → overføring. Konkrete aktiviteter for nettverk (ordkort, bindeord, begrepsvegg) og overføring (nytt fenomen). Få nøkkelbegreper over tid.',
      model: 'Ordet «varme» er formen; begrepet er ideen om energi som overføres på grunn av temperaturforskjell. Elever kan ha ordet uten begrepet: de sier at «ullgenseren er varm». Først bygger jeg nettverk med ordkoblinger (varme–temperatur–energi, med «fordi»). Deretter bruker elevene begrepet i forsøk med isbiter. Til slutt overfører de det til et nytt fenomen: hvorfor smelter isbiten i ullsokken saktere?' },
    { id: 'didaktikk.or.3', region: R, concepts: ['di-laeringsmal', 'di-mal-aktivitet', 'di-kompetansemal'],
      prompt: 'Velg et kompetansemål i naturfag etter 10. trinn. Skriv ett læringsmål som kan vurderes, beskriv en aktivitet som henger sammen med målet, og si hvordan du vil vurdere underveis.',
      rubric: 'Læringsmål med handlingsverb (ikke «forstå/kjenne til»), tydelig knyttet til kompetansemålet. Aktivitet der elevene faktisk gjør det målet sier. Underveisvurdering (exit-lapp, kriterier, tilbakemelding med neste steg) som måler nettopp målet. Gjerne kildebegrunnelse og bærekraftkobling.',
      model: 'Kompetansemål: «bruke programmering til å utforske naturfaglige fenomener». Læringsmål: «Jeg kan lage en enkel simulering av hvordan kaffe avkjøles og sammenligne den med egne målinger.» Elevene måler temperaturen i en kaffekopp hvert minutt og programmerer en avkjølingsmodell, som de justerer til den passer med målingene. Underveis viser de grafen til meg og forklarer hvor modellen avviker og hvorfor. Exit-lappen spør etter én begrensning ved modellen.' },
    { id: 'didaktikk.or.4', region: R, concepts: ['di-beskrive-forklare', 'di-bindeord'],
      prompt: 'Hva er forskjellen på å beskrive og å forklare i naturfag? Gi et eksempel på hvert, og foreslå én støttestruktur som hjelper elever fra beskrivelse til forklaring.',
      rubric: 'Beskrive = hva/hvordan; forklare = hvorfor (årsak, mekanisme). Gode, parallelle eksempler (f.eks. dugg på glass). Støttestruktur: årsaksbindeord/setningsstartere, skriveramme for forklaringssjangeren, modelltekst. Gjerne kobling til begrepsstigen eller sjangerpedagogikk.',
      model: '«Det dannes dråper på utsiden av glasset» er en beskrivelse. Forklaringen er: «Vanndamp i lufta avkjøles mot det kalde glasset og kondenserer, fordi kald luft kan holde på mindre vanndamp.» Jeg gir elevene setningsstartere med bindeord («Dette skjer fordi …», «Det fører til at …») og en modelltekst der årsakskjeden er markert.' },
    { id: 'didaktikk.or.5', region: R, concepts: ['di-refleksjonsmodellen', 'di-kildebegrunnelse'],
      prompt: 'Skriv en kort refleksjon etter modellen Hva? – Hva så? – Hva nå? om en naturfagtime (gjerne en du har hatt i praksis eller kan tenke deg).',
      rubric: 'Hva?: konkret, observerbar beskrivelse. Hva så?: tolkning med teori/kilde – hvorfor ble det slik? Hva nå?: konkret, etterprøvbar endring. Tydelig skille mellom leddene; ikke bare beskrivelse.',
      model: 'Hva? I krabbe-aktiviteten skrev 15 av 26 elever slutninger i observasjonskolonnen. Hva så? Jeg forklarte aldri skillet eksplisitt, og NOS-forskningen viser at slike skiller må løftes eksplisitt og refleksivt. I tillegg var materialet nytt, så den kognitive belastningen ble høy. Hva nå? Neste gang starter jeg med et felles eksempel og en sorteringsoppgave. Etterpå sjekker jeg med en exit-lapp om flere klarer skillet.' },
  ]);
})();
