/* Akademiet (didaktikk) — spørsmål del 7: tallsvar i didaktikken. Å lese klassens svar som data
   (andeler, prosentpoeng) og å planlegge tid er en del av lærerens hverdag. */
(function () {
  'use strict';
  const R = 'didaktikk';
  const VUR = 'Vurdering';
  const PLAN = 'Undervisningsplanlegging';

  const Q = [
    { id: 'didaktikk.data.01', topic: VUR, concepts: ['di-elevforestilling', 'di-vfl'], level: 4, type: 'num',
      prompt: 'Før undervisningen valgte **7 av 28** elever svaralternativet «planter får maten sin fra jorda» på en diagnostisk oppgave. Hvor mange **prosent** av klassen er det?',
      answer: 25, abs: 0.5, unit: '%',
      explain: '7 / 28 = 0,25 = **25 %**. Diagnostiske oppgaver der distraktorene er kjente elevforestillinger, gir læreren data om *hvilke* forestillinger klassen har – ikke bare hvor mange som svarte feil.' },
    { id: 'didaktikk.data.02', topic: VUR, concepts: ['di-elevforestilling', 'di-grubletegning'], level: 4, type: 'num',
      prompt: 'På en grubletegning om ullsokken og isbiten var **18 av 24** elever enige i at «ull er varmt» før undervisningen. Etterpå var det **6 av 24**. Hvor mange **prosentpoeng** gikk andelen ned?',
      answer: 50, abs: 0.5, unit: 'prosentpoeng',
      explain: 'Før: 18/24 = 75 %. Etter: 6/24 = 25 %. Nedgangen er 75 − 25 = **50 prosentpoeng** (men en nedgang på 67 *prosent*, regnet av 75 %). Skillet mellom prosent og prosentpoeng er viktig når en rapporterer elevdata.' },
    { id: 'didaktikk.data.03', topic: PLAN, concepts: ['di-mal-aktivitet', 'pr-5e'], level: 3, type: 'num',
      prompt: 'Du planlegger en økt på 90 minutter etter 5E-modellen: 10 min Engage, 25 min Explore, 20 min Explain og 15 min Elaborate. Hvor mange minutter er igjen til **Evaluate**?',
      answer: 20, abs: 0, unit: 'min',
      explain: '90 − (10 + 25 + 20 + 15) = **20 min**. Å sette av tid til vurdering til slutt i økta – f.eks. en exit-lapp mot læringsmålet – blir lett skviset ut hvis den ikke planlegges.' },
  ];

  NG.content.addQuestions(Q.map((q) => Object.assign({ region: R }, q)));
})();
