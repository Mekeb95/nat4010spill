/* Kroppsbyen — hendelser (✉-noder). */
(function () {
  'use strict';
  NG.content.addEvents([
    { id: 'kropp.ev.forkjolelse', region: 'kropp', title: 'Snørrete legevakt',
      text: 'På venterommet sitter en hostende mann: «Jeg skal be om antibiotika. Har hatt forkjølelse i tre dager.» Han ser på deg. «Det hjelper vel?»',
      choices: [
        { label: '«Forkjølelse er virus. Antibiotika virker bare på bakterier – og unødvendig bruk gir resistente bakterier.»', correct: true,
          result: 'Mannen nikker, kjøper seg en kanne te og går hjem. Antibiotika-alven mister vingene.', reward: { xp: 20 } },
        { label: '«Ja, det tar knekken på bakteriene og virusene.»', correct: false,
          result: 'Antibiotika-alven danser rundt på venterommet. Resistente bakterier jubler i tarmen hans.', reward: { hp: -6 } },
      ] },
    { id: 'kropp.ev.fotbad', region: 'kropp', title: 'Det brune fotbadet',
      text: 'En bod på torget selger «ionisk detox-fotbad». Vannet blir brunt etter ti minutter. «Se! Giftstoffene kommer ut gjennom føttene!» roper selgeren.',
      choices: [
        { label: '«Kan vi prøve uten føtter i vannet?»', correct: true,
          result: 'Selgeren nøler, men du skrur på apparatet med tom balje: vannet blir brunt likevel. Det er elektrodene som ruster. Detox-dragen flykter. Et kontrollforsøk sier mer enn tusen vitnesbyrd.', reward: { xp: 30, item: 'item-vernebriller' } },
        { label: '«Imponerende! Hvor mye koster det?»', correct: false,
          result: 'Du betaler 600 kr for brunt vann. Lever og nyrer ler stille.', reward: { hp: -5, joule: -10 } },
      ] },
    { id: 'kropp.ev.vaksineprat', region: 'kropp', title: 'Foreldremøtet',
      text: 'På et foreldremøte sier en mor: «Vi vaksinerer ikke. Det er jo vårt valg og angår bare vårt barn.» Hva sier du?',
      choices: [
        { label: '«Vaksiner beskytter også andre: høy dekning gir flokkimmunitet som verner spedbarn og syke som ikke kan vaksineres.»', correct: true,
          result: 'Det blir stille. En annen forelder forteller om datteren som fikk cellegift og ikke kan vaksineres. Moren lover å lese mer på fhi.no. Ryktesprederen hvisker litt svakere.', reward: { xp: 25 } },
        { label: '«Det er sant, det angår bare dere.»', correct: false,
          result: 'Ryktesprederen sprer budskapet videre i byen. Smittekjedene har fått et nytt hull å krype gjennom.', reward: { hp: -6 } },
        { label: '«Dere er dumme som ikke vaksinerer.»', correct: false,
          result: 'Moren går i forsvar, og samtalen er over. Fakta uten respekt når sjelden fram.', reward: { hp: -4 } },
      ] },
    { id: 'kropp.ev.tvillinger', region: 'kropp', title: 'Tvillingene',
      text: 'To eneggede tvillinger på 70 år sitter på en benk. Den ene løper maraton, den andre bruker rullator. «Vi har jo nøyaktig de samme genene,» sier de i kor. «Hvordan kan det ha seg?»',
      choices: [
        { label: '«Gener gir anlegg, men livsstil og miljø gjennom et helt liv påvirker hvordan det går.»', correct: true,
          result: 'Tvillingene ler og forteller om røyking, skiftarbeid og fjellturer. Genfatalisten sniker seg ut av parken.', reward: { xp: 20 } },
        { label: '«Én av dere må ha fått andre gener.»', correct: false,
          result: 'Eneggede tvillinger har (nesten) likt DNA. Genfatalisten nikker fornøyd.', reward: { hp: -5 } },
      ] },
    { id: 'kropp.ev.slanking', region: 'kropp', title: 'Treningsstudioet',
      text: 'En personlig trener forklarer en kunde: «Fettet ditt blir forbrent og omdannet til ren energi.» Kunden ser på deg: «Stemmer det?»',
      choices: [
        { label: '«Energien frigjøres, men atomene må et sted: det meste av fettet pustes ut som CO₂, resten blir vann.»', correct: true,
          result: 'Kunden puster ut demonstrativt. «Så jeg puster bort magen?» «Mer eller mindre!» Treneren noterer.', reward: { xp: 25 } },
        { label: '«Ja, fettet blir til energi og forsvinner.»', correct: false,
          result: 'Masse forsvinner ikke i kjemiske prosesser. Massebevaringen gjelder også i treningsstudioet.', reward: { hp: -5 } },
      ] },
  ]);
})();
