/* Gjenstander. kind: 'use' = forbruksvare (brukes i kamp eller leir), 'relic' = varig effekt.
   Effektene håndteres i kamp-/leir-koden etter id. Teksten forklarer alltid fysikken bak. */
(function () {
  'use strict';
  NG.ITEMS = [
    { id: 'matpakke', kind: 'use', name: 'Matpakke', art: 'item-notatbok', price: 15, combat: true,
      desc: '+20 J energi.', lore: 'Kjemisk energi i maten blir til energi du kan bruke. Celleåndingen *lager* ikke energi — den omdanner den.' },
    { id: 'kakao', kind: 'use', name: 'Termos med kakao', art: 'item-termos', price: 15, combat: true,
      desc: 'Gjenopprett 25 HP.', lore: 'Termosen holder på varmen fordi vakuumet stopper ledning og strømning, og den blanke flata reflekterer stråling.' },
    { id: 'repetisjonskort', kind: 'use', name: 'Repetisjonskort', art: 'item-begrepskort', price: 20, combat: true,
      desc: 'Neste spørsmål gir dobbel skade hvis riktig.', lore: 'Spredt repetisjon slår massiv pugging.' },
    { id: 'vernebriller', kind: 'relic', name: 'Vernebriller', art: 'item-vernebriller', price: 60,
      desc: 'Første feilsvar i hver kamp gir ingen skade.', lore: 'Verneutstyr er siste skanse i en risikovurdering — men den skansen redder øyne.' },
    { id: 'termos', kind: 'relic', name: 'Isolert termos', art: 'item-termos', price: 70,
      desc: 'Du tar 20 % mindre skade.', lore: 'Isolasjon bremser energioverføringen. Den stopper den ikke.' },
    { id: 'notatbok', kind: 'relic', name: 'Feynmans notatbok', art: 'item-notatbok', price: 55,
      desc: '+1 hint i hver kamp.', lore: '«What I cannot create, I do not understand.»' },
    { id: 'partikkelbriller', kind: 'relic', name: 'Partikkelbrillene', art: 'item-partikkelbriller', price: 65,
      desc: 'Partikkelblikket koster 5 J i stedet for 10 J.', lore: 'Se mikronivået bak makronivået.' },
    { id: 'kalorimeter', kind: 'relic', name: 'Kalorimeteret', art: 'item-kalorimeter', price: 50,
      desc: '+15 % XP fra kamper.', lore: 'Det du måler, kan du gjøre regnskap for.' },
    { id: 'lupe', kind: 'relic', name: 'Forskerlupa', art: 'item-lupe', price: 45,
      desc: 'Du ser alltid hva Misforståelsen planlegger.', lore: 'Observasjon først — slutning etterpå.' },
    { id: 'periodesystem', kind: 'relic', name: 'Lommeperiodesystemet', art: 'item-periodesystem', price: 60,
      desc: '+25 % skade i Stoffgruvene.', lore: 'Mendelejev lot hull stå åpne for grunnstoffer ingen hadde funnet ennå.' },
    { id: 'solcelle', kind: 'relic', name: 'Solcellepanelet', art: 'item-solcelle', price: 70,
      desc: '+10 maks energi og +5 J etter hver seier.', lore: 'Nesten alle energikjeder starter i sola.' },
    { id: 'varmepumpe', kind: 'relic', name: 'Varmepumpa', art: 'item-varmepumpe', price: 80,
      desc: 'Ny evne: bruk 5 J for å hente 15 J ut av spillvarmen.', lore: 'En varmepumpe bruker høyverdig energi til å flytte lavverdig varme dit vi vil ha den. Den lager ikke energi.' },
  ];
  NG.item = (id) => NG.ITEMS.find((i) => i.id === id);

  NG.ABILITIES = [
    { id: 'blikk', name: 'Partikkelblikket', cost: 10, desc: 'Fjern to gale svaralternativ.', icon: 'item-partikkelbriller' },
    { id: 'gruble', name: 'Grubletegning', cost: 15, desc: 'Skjold mot neste angrep, og du ser hva Misforståelsen planlegger.', icon: 'item-lupe' },
    { id: 'peb', name: 'PEB-kombo', cost: 25, desc: 'Påstand → Evidens → Begrunnelse: tre riktige på rad gir et knusende argument.', icon: 'item-begrepskort' },
    { id: 'pumpe', name: 'Varmepumpe', cost: 5, desc: 'Hent 15 J fra spillvarmen.', icon: 'item-varmepumpe', needs: 'varmepumpe' },
  ];
  NG.abilityCost = function (s, ab) {
    if (ab.id === 'blikk' && NG.hasRelic(s, 'partikkelbriller')) return 5;
    return ab.cost;
  };
})();
