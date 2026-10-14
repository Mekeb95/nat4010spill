/* Kroppsbyen — Orakel-oppgaver. */
(function () {
  'use strict';
  NG.content.addPrompts([
    { id: 'kropp.or.1', region: 'kropp', concepts: ['respirasjon', 'sirkulasjon', 'kroppens-energi'],
      prompt: 'Følg et oksygenmolekyl fra lufta til det brukes i kroppen, og et karbonatom fra brødskiva til det forlater kroppen. Hvilke organsystemer er med, og hva skjer i cellene?',
      rubric: 'O₂: luftveier → lungeblærer → diffusjon til blodet → hjertet pumper → kapillærer → celle → mitokondrie (celleånding). C: fordøyelse (stivelse → glukose) → opptak i tynntarm → blod → celle → celleånding → CO₂ → blod → lunger → ut. Kobler respirasjon og celleånding; energi frigjøres (ikke lages) og blir til slutt varme. Viser kroppen som system.',
      model: 'Oksygenet pustes inn til lungeblærene, diffunderer over i blodet og fraktes av hjertet ut til en muskelcelle. Der brukes det i mitokondriene i celleåndingen. Karbonet i brødskiva fordøyes fra stivelse til glukose, tas opp i tynntarmen og fraktes med blodet til den samme cellen. I celleåndingen blir glukosen og oksygenet til CO₂ og vann, og energi frigjøres til arbeid og varme. CO₂-en tar blodet tilbake til lungene, og jeg puster ut karbonet fra brødskiva.' },
    { id: 'kropp.or.2', region: 'kropp', concepts: ['vaksine', 'flokkimmunitet', 'folkehelse'],
      prompt: 'Forklar for en skeptisk forelder hvordan vaksiner virker og hvorfor vaksinering angår flere enn ens eget barn.',
      rubric: 'Påstand: vaksiner trener immunsystemet og gir hukommelsesceller; høy dekning gir flokkimmunitet. Evidens: sykdommer har nesten forsvunnet etter vaksinasjonsprogram; utbrudd der dekningen synker; terskel 1 − 1/R₀ (meslinger ca. 93–95 %). Begrunnelse: smitte stopper når hver smittet smitter færre enn én; beskytter de som ikke kan vaksineres. Respektfull tone, tar bekymringen på alvor.',
      model: 'En vaksine viser immunforsvaret en ufarlig del av smittestoffet, så kroppen lager hukommelsesceller uten å bli syk. Møter barnet den ekte sykdommen senere, slår forsvaret til med en gang. Men vaksinen beskytter også andre: når nesten alle er immune, finner smitten ingen å gå videre til. Det beskytter spedbarn og barn med kreft som ikke kan vaksineres. For meslinger må rundt 95 % være immune – der dekningen har sunket, har utbruddene kommet tilbake.' },
    { id: 'kropp.or.3', region: 'kropp', concepts: ['helseinformasjon', 'helse'],
      prompt: 'En influencer skriver: «Jeg kuttet gluten og ble kvitt hodepine, tretthet og eksem! Alle burde prøve.» Vurder påstanden kildekritisk.',
      rubric: 'Identifiserer: anekdote (én person), mulig placebo/naturlig variasjon/andre endringer samtidig, mulig økonomisk interesse, generalisering til «alle». Peker på hva slags evidens som trengs (kontrollerte studier, mange deltakere, blinding) og troverdige kilder (helsenorge, FHI, lege). Skiller mellom at det kan stemme for noen (cøliaki) og at det ikke er vist for alle.',
      model: 'Dette er én persons erfaring – en anekdote. Hun kan ha endret mye annet samtidig, symptomene kan ha gått over av seg selv, og forventningen om å bli bedre kan i seg selv hjelpe. Tjener hun penger på saken? Å si at «alle» burde gjøre det samme er en stor generalisering. For noen med cøliaki er glutenfritt nødvendig, men for å vite om det hjelper folk flest, trengs kontrollerte studier med mange deltakere. Jeg ville sjekket helsenorge.no eller spurt lege.' },
  ]);
})();
