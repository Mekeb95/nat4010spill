/* Regioner, kartposisjoner og opplåsing. Fargene speiles i src/ui/tokens.css (--r-<id>). */
(function () {
  'use strict';
  NG.REGIONS = [
    { id: 'energi', name: 'Energidalen', sheet: 'Energi', color: 'var(--r-energi)', boss: 'evighetsmaskinen',
      x: 22, y: 78, unlock: [], blurb: 'Hvor blir energien av? Følg den fra sola til spillvarmen.' },
    { id: 'stoffer', name: 'Stoffgruvene', sheet: 'Stoffer', color: 'var(--r-stoffer)', boss: 'alkymisten',
      x: 74, y: 80, unlock: [], blurb: 'Atomer, bindinger og reaksjoner — der ingenting forsvinner.' },
    { id: 'liv', name: 'Livsskogen', sheet: 'Livet på jorda', color: 'var(--r-liv)', boss: 'pustetrollet',
      x: 18, y: 52, unlock: ['energi'], blurb: 'Stoff går i kretsløp, energi strømmer gjennom.' },
    { id: 'praksis', name: 'Utforskertårnet', sheet: 'Naturvitenskapelige praksiser', color: 'var(--r-praksis)', boss: 'dogmatikeren',
      x: 50, y: 60, unlock: ['energi', 'stoffer'], unlockAny: true, blurb: 'Spørsmål, data, modeller og argumenter.' },
    { id: 'teknologi', name: 'Verkstedet', sheet: 'Teknologi', color: 'var(--r-teknologi)', boss: 'buggen',
      x: 80, y: 52, unlock: ['stoffer'], blurb: 'Design, prototyper og programmering som utforsker.' },
    { id: 'kropp', name: 'Kroppsbyen', sheet: 'Kropp og helse', color: 'var(--r-kropp)', boss: 'kvakksalveren',
      x: 26, y: 28, unlock: ['liv'], blurb: 'Celler, systemer og kritisk helseinformasjon.' },
    { id: 'jorda', name: 'Himmelfjellet', sheet: 'Jorda og universet', color: 'var(--r-jorda)', boss: 'arstidsdragen',
      x: 74, y: 26, unlock: ['praksis'], blurb: 'Fra big bang til årstider og drivhuseffekt.' },
    { id: 'didaktikk', name: 'Akademiet', sheet: 'Språk, begreper og undervisning', color: 'var(--r-didaktikk)', boss: 'hverdagsspraket',
      x: 50, y: 9, unlock: [], needBosses: 5, blurb: 'Finalen: fra ord til begrep — og fra student til lærer.' },
  ];
  NG.region = (id) => NG.REGIONS.find((r) => r.id === id);
  NG.isUnlocked = function (state, r) {
    const beaten = state.bossesBeaten || {};
    if (r.needBosses) return Object.keys(beaten).length >= r.needBosses;
    if (!r.unlock.length) return true;
    return r.unlockAny ? r.unlock.some((u) => beaten[u]) : r.unlock.every((u) => beaten[u]);
  };
})();

/* Begrepsstigen fra NAT4010 (ord → begrep). Indeks = kortnivå / spørsmålsnivå. */
NG.LADDER = ['Ukjent', 'Gjenkjenne', 'Definere', 'Nettverk', 'Anvende', 'Overføre'];
