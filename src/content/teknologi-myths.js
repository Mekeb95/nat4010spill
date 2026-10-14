/* Verkstedet — misoppfatninger om design, systemer og programmering. */
(function () {
  'use strict';
  NG.content.addMyths([
    { id: 'myte.tek-uendelig', text: 'Programmet skjønner når det er på tide å stoppe – og hva jeg egentlig mente.',
      fix: 'Datamaskinen gjør nøyaktig det koden sier. En løkke uten stoppbetingelse som kan bli usann, går for alltid.',
      source: 'Programmering i skolen kap. 5' },
    { id: 'myte.tek-syntaks', text: 'Små skrivefeil i koden spiller ingen rolle.',
      fix: 'Et manglende kolon eller en parentes kan stoppe hele programmet (syntaksfeil), og et feil tegn (< i stedet for >) kan gi et program som kjører, men gjør feil (logisk feil).',
      source: 'Programmering i skolen' },
    { id: 'myte.tek-fossefall', text: 'Design er en rett linje: tegn, lag, ferdig. Prototyper er bortkastet tid.',
      fix: 'Teknologisk utvikling er iterativ: man lager prototyper, tester, lærer og forbedrer i flere runder.',
      source: 'Nøkkelark TEKNOLOGI, Naturfagsenteret' },
    { id: 'myte.tek-kravlos', text: 'Man kan lage en god løsning uten å vite hvem den er for og hva den må klare.',
      fix: 'Design starter med brukerbehov og en kravspesifikasjon. Uten krav kan løsningen verken testes eller vurderes.',
      source: 'Nøkkelark TEKNOLOGI' },
    { id: 'myte.tek-svartboks', text: 'Teknologi er magi – hvordan den virker innvendig, er uinteressant.',
      fix: 'All teknologi er systemer av deler med form, funksjon og mekanisme. Å åpne svartboksen er å forstå sensorer, styring og aktuatorer.',
      source: 'Nøkkelark TEKNOLOGI' },
    { id: 'myte.tek-off-by-one', text: 'En løkke fra 1 til 10 kjører 10 ganger, og telleren starter der den skal.',
      fix: 'Grensene må sjekkes: `range(1, 10)` gir 9 runder, og en teller som nullstilles inne i løkka, teller aldri over 1.',
      source: 'Programmering i skolen' },
    { id: 'myte.tek-simulering', text: 'En simulering viser hvordan virkeligheten er.',
      fix: 'En simulering er en modell med forenklinger og forutsetninger. Den må sammenlignes med målinger, og tidssteg og parametre påvirker svaret.',
      source: 'Programmering i skolen kap. 8; Haug & Mork kap. 9' },
    { id: 'myte.tek-bare-koding', text: 'Programmering i naturfag er bare å lære å kode.',
      fix: 'Kompetansemålet er å bruke programmering til å utforske naturfaglige fenomener: samle og behandle data, simulere og teste modeller mot målinger.',
      source: 'LK20 naturfag etter 10. trinn; Programmering i skolen kap. 14' },
  ]);
})();
