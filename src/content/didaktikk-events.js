/* Akademiet — hendelser (✉-noder): korte lærersituasjoner */
(function () {
  'use strict';
  const R = 'didaktikk';
  NG.content.addEvents([
    { id: 'didaktikk.ev.stein', region: R, title: 'Steinen på hylla',
      text: 'En elev i 6. klasse sier: «Steinen på hylla har ingen energi. Den gjør jo ingenting.»',
      choices: [
        { label: 'Dytt steinen forsiktig ned i en sandkasse: «Hvor kom bevegelsen fra?» – og innfør stillingsenergi.', correct: true,
          result: 'Eleven ser krateret i sanda og sier: «Den må ha hatt noe i seg på hylla!» Forestillingen «energi krever bevegelse» vakler.', reward: { xp: 25 } },
        { label: '«Feil. Steinen har potensiell energi, Eₚ = mgh.»', correct: false,
          result: 'Eleven skriver formelen pent ned – og tror fortsatt at steinen er tom for energi.', reward: { xp: 5 } },
      ] },
    { id: 'didaktikk.ev.maal', region: R, title: 'Læringsmålet på tavla',
      text: 'Praksislæreren ber deg skrive dagens læringsmål på tavla. Timen handler om fotosyntese.',
      choices: [
        { label: '«Jeg kan forklare hvor plantens energi og stoff kommer fra, og vise det i en energikjede.»', correct: true,
          result: 'Målet kan vurderes – og exit-lappen kan spørre om nettopp dette. Det umålbare målet krymper.', reward: { xp: 20 } },
        { label: '«Vi skal forstå fotosyntesen.»', correct: false,
          result: 'Hvordan skal du – eller elevene – vite om de har forstått? Det umålbare målet vokser seg tykkere.', reward: { hp: -5 } },
        { label: '«Vi skal ha det gøy med karse!»', correct: false,
          result: 'Aktivitetsjageren jubler. Gøy er fint – men det er ikke et læringsmål.', reward: { hp: -5 } },
      ] },
    { id: 'didaktikk.ev.ros', region: R, title: 'Kommentarfeltet',
      text: 'Du har 28 forsøksrapporter og 40 minutter. Hva skriver du?',
      choices: [
        { label: 'Én konkret styrke og ett neste steg knyttet til målet på hver rapport – og setter av tid i neste time til at elevene bruker det.', correct: true,
          result: 'Kort, målrettet og brukt. Elevene forbedrer ett avsnitt hver. Fasitfanten mister grepet om den røde pennen.', reward: { xp: 25 } },
        { label: '«Bra!» på alle, så rekker du det.', correct: false,
          result: 'Raskt, men elevene vet ikke hva som var bra eller hva de skal gjøre annerledes.', reward: { xp: 0 } },
        { label: 'Karakter på alle – det er raskest og tydeligst.', correct: false,
          result: 'Elevene sammenligner karakterer i friminuttet. Ingen leser kommentarene du ikke skrev.', reward: { hp: -5 } },
      ] },
    { id: 'didaktikk.ev.ordflom', region: R, title: 'Kapittel 7',
      text: 'Læreboka har 31 uthevede ord i kapitlet om stoffer. Du har tre uker.',
      choices: [
        { label: 'Velg 5 nøkkelbegreper til begrepsveggen og bruk dem hver time; de andre ordene kobles til dem etter hvert.', correct: true,
          result: 'Etter tre uker kan elevene forklare sammenhengene mellom de fem – og mange av de andre ordene har fått en plass i nettverket.', reward: { xp: 20, item: 'notatbok' } },
        { label: 'Alle 31 på en ordliste til prøven.', correct: false,
          result: 'Ordflommen skyller over klassen. Prøven går greit, men om to uker er alt borte.', reward: { hp: -6 } },
      ] },
    { id: 'didaktikk.ev.genser', region: R, title: 'Ullgenseren',
      text: 'En elev sier: «Ullgenseren er varm – kjenn selv!»',
      choices: [
        { label: '«Skal vi teste? Vi pakker et termometer inn i genseren på bordet og ser hva som skjer.»', correct: true,
          result: 'Termometeret står stille. «Den lager ikke varme – den holder på varmen fra meg!» Eleven har bygd broen selv.', reward: { xp: 25 } },
        { label: '«Ja, ull er et varmt materiale.»', correct: false,
          result: 'Hverdagsspråket smiler fornøyd. Temperatur som materialegenskap har fått et nytt rotfeste.', reward: { hp: -6 } },
      ] },
    { id: 'didaktikk.ev.kilde', region: R, title: 'Begrunnelsen',
      text: 'I eksamensutkastet ditt står det: «Jeg bruker grubletegninger fordi det fungerte bra i praksis.» Du har én time igjen.',
      choices: [
        { label: 'Legg til at Henriksen & Angell (2019) viser at forestillingene er robuste, og forklar hvorfor grubletegninger gjør dem synlige.', correct: true,
          result: 'Erfaring og forskning trekker i samme retning. Kildeløse Kåre ser bort.', reward: { xp: 20 } },
        { label: 'La det stå – erfaring er den beste læreren.', correct: false,
          result: 'Sensor skriver i margen: «Begrunn med kilder.» Kåre nikker anerkjennende til deg.', reward: { hp: -5 } },
      ] },
    { id: 'didaktikk.ev.refleksjon', region: R, title: 'Refleksjonsnotatet',
      text: 'Notatet ditt beskriver praksistimen i detalj over to sider. Veilederen spør: «Og så?»',
      choices: [
        { label: 'Skriv en *Hva så?* som tolker hvorfor timen ble slik med hjelp av teori, og en *Hva nå?* med én konkret endring.', correct: true,
          result: 'Notatet går fra dagbok til refleksjon. Veilederen setter et hjerte i margen.', reward: { xp: 20 } },
        { label: 'Legg til enda flere detaljer om hva som skjedde.', correct: false,
          result: 'Tre sider beskrivelse. Beskriveren er stolt av deg.', reward: { hp: -4 } },
      ] },
  ]);
})();
