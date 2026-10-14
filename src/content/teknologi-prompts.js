/* Verkstedet — Orakel-oppgaver (fritekst) */
(function () {
  'use strict';
  const R = 'teknologi';
  NG.content.addPrompts([
    { id: 'teknologi.or.1', region: R, concepts: ['tek-simulering', 'tek-tidssteg'],
      prompt: 'Forklar for en 10.-klassing hvordan et program kan simulere at en kopp kaffe blir kald, og hvorfor simuleringen er en modell med begrensninger.',
      rubric: 'Variabel for temperatur; løkke som går framover i tidssteg; regel (f.eks. tap proporsjonalt med temperaturforskjell til rommet, eller enklere fast tap). Simuleringen som modell: forutsetninger (konstant romtemperatur, fast k, ingen fordamping/lokk), tidsstegets betydning, behov for å sammenligne med målinger. Gjerne kobling til energioverføring.',
      model: 'Vi lagrer temperaturen i en variabel og lar en løkke gå ett minutt om gangen. Hvert minutt trekker vi fra litt, og mer jo større forskjellen er til romtemperaturen, fordi energien overføres raskere når forskjellen er stor. Simuleringen er en modell: den antar at rommet holder konstant temperatur og at koppen alltid taper energi like lett. Den ser bort fra fordamping og lokk. Derfor må vi sjekke den mot ekte målinger og justere.' },
    { id: 'teknologi.or.2', region: R, concepts: ['tek-designprosess', 'tek-kravspesifikasjon', 'tek-prototyp'],
      prompt: 'Beskriv den teknologiske utviklingsprosessen med et eksempel, og forklar hvorfor den er iterativ.',
      rubric: 'Brukerbehov → kravspesifikasjon (målbare krav) → ideer → prototyp → test mot krav → forbedring. Iterasjon: testing gir ny kunnskap som fører tilbake til tidligere steg. Konkret eksempel. Gjerne kobling til form/funksjon/materiale og til utforskende arbeid.',
      model: 'Eldre med leddgikt trenger en matboks som er lett å åpne. Kravene blir at den skal kunne åpnes med én hånd og tåle oppvaskmaskin. Vi skisserer tre lokk og bygger en prototyp av papp og strikk. Testpersonene klarer ikke å åpne den, så vi endrer mekanismen til en vippe og tester igjen. Prosessen er iterativ fordi hver test avslører noe vi ikke kunne vite på forhånd.' },
    { id: 'teknologi.or.3', region: R, concepts: ['tek-styring-kontroll', 'tek-tilbakekobling', 'tek-sensor', 'tek-aktuator'],
      prompt: 'Forklar forskjellen på styring med og uten tilbakekobling, med ett eksempel på hver, og beskriv hvordan elever kan bygge et system med tilbakekobling med micro:bit.',
      rubric: 'Uten tilbakekobling: fast instruks/tidsur (brødrister). Med tilbakekobling: sensor måler resultatet, styringen justerer (termostat). Sensor → styring → aktuator. micro:bit-eksempel: f.eks. lyssensor + LED, temperatursensor + vifte, fuktsensor + pumpe, med løkke og betingelse.',
      model: 'En brødrister med tidsur stopper etter en fast tid, uansett hvor brunt brødet er. Det er styring uten tilbakekobling. En panelovn med termostat måler romtemperaturen og slår seg av når det er varmt nok, så resultatet styrer handlingen. Med micro:bit kan elevene lage en «nattlampe»: i en evig løkke leses lyssensoren, og hvis lyset er under en grense, tennes LED-ene.' },
    { id: 'teknologi.or.4', region: R, concepts: ['tek-simulering', 'tek-microbit'],
      prompt: 'Buggen påstår at programmering i naturfag «bare er koding». Argumenter mot ham med et konkret undervisningsopplegg for ungdomstrinnet.',
      rubric: 'Påstand: programmering er et verktøy for å utforske fenomener (kompetansemålet). Eksempel med fenomen + data/simulering: f.eks. avkjøling, fritt fall, populasjon, logging med micro:bit. Begrunnelse: elevene stiller spørsmål, samler data, lager og tester modeller, drøfter begrensninger. Gjerne kilder (Programmering i skolen kap. 8/14).',
      model: 'Kompetansemålet sier «bruke programmering til å utforske naturfaglige fenomener», og koden er verktøyet. Elevene logger temperaturen i en kopp med micro:bit og en ekstern probe, og programmerer en avkjølingsmodell. Så sammenligner de kurvene og justerer modellen til den passer. Slik stiller de spørsmål, samler data, lager en modell og drøfter hvor den svikter, og det er utforskende naturfag.' },
  ]);
})();
