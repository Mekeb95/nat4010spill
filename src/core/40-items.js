/* Gjenstander, evner og ekspedisjonsrelikvier.
   kind: 'use' = forbruksvare (brukes i kamp eller leir), 'relic' = varig effekt (kjøpes i Materiallageret).
   NG.RUN_RELICS = relikvier som bare varer én ekspedisjon (s.run.relics). Effektene håndteres i kampkoden etter id.
   Teksten forklarer alltid naturfaget bak. */
(function () {
  'use strict';
  NG.ITEMS = [
    { id: 'matpakke', kind: 'use', name: 'Matpakke', art: 'item-notatbok', price: 15, combat: true,
      desc: '+20 J energi (opp til maks — resten blir spillvarme).', lore: 'Kjemisk energi i maten blir til energi du kan bruke. Celleåndingen *lager* ikke energi — den omdanner den.' },
    { id: 'kakao', kind: 'use', name: 'Termos med kakao', art: 'item-termos', price: 15, combat: true,
      desc: 'Gjenopprett 25 HP.', lore: 'Termosen holder på varmen fordi vakuumet stopper ledning og strømning, og den blanke flata reflekterer stråling.' },
    { id: 'repetisjonskort', kind: 'use', name: 'Repetisjonskort', art: 'item-begrepskort', price: 20, combat: true,
      desc: 'Neste spørsmål gir dobbel skade hvis riktig.', lore: 'Spredt repetisjon slår massiv pugging.' },
    { id: 'lakmus', kind: 'use', name: 'Lakmuspapir', art: 'relic-lakmus', price: 20, combat: true,
      desc: 'Avslører om ett av svaralternativene er riktig eller galt (flervalg).', lore: 'Lakmus blir rødt i sur løsning og blått i basisk. En god indikator gir et entydig ja/nei-svar.' },
    { id: 'brannteppe', kind: 'use', name: 'Brannteppe', art: 'relic-brannteppe', price: 18, combat: true,
      desc: 'Gir et skjold mot neste angrep.', lore: 'Teppet kveler flammen ved å stenge oksygenet ute. Fjerner du én side av branntrekanten, slokner brannen.' },
    { id: 'torris', kind: 'use', name: 'Tørris', art: 'relic-torris', price: 22, combat: true,
      desc: 'Fryser Misforståelsens neste trekk: den bare lurer.', lore: 'Fast CO~2~ sublimerer ved −78,5 °C — rett fra fast stoff til gass uten å bli væske.' },
    { id: 'magnesium', kind: 'use', name: 'Magnesiumbånd', art: 'relic-magnesium', price: 25, combat: true,
      desc: 'Neste riktige svar blir et kritisk treff.', lore: 'Magnesium brenner med blendende hvitt lys og danner magnesiumoksid (MgO). Ikke se rett på flammen!' },
    { id: 'vernebriller', kind: 'relic', name: 'Vernebriller', art: 'item-vernebriller', price: 90,
      desc: 'Første feilsvar i hver kamp gir ingen skade.', lore: 'Verneutstyr er siste skanse i en risikovurdering — men den skansen redder øyne.' },
    { id: 'termos', kind: 'relic', name: 'Isolert termos', art: 'item-termos', price: 105,
      desc: 'Du tar 20 % mindre skade.', lore: 'Isolasjon bremser energioverføringen. Den stopper den ikke.' },
    { id: 'notatbok', kind: 'relic', name: 'Feynmans notatbok', art: 'item-notatbok', price: 80,
      desc: '+1 hint i hver kamp.', lore: '«What I cannot create, I do not understand.»' },
    { id: 'partikkelbriller', kind: 'relic', name: 'Partikkelbrillene', art: 'item-partikkelbriller', price: 95,
      desc: 'Partikkelblikket koster 5 J mindre.', lore: 'Se mikronivået bak makronivået.' },
    { id: 'kalorimeter', kind: 'relic', name: 'Kalorimeteret', art: 'item-kalorimeter', price: 75,
      desc: '+15 % XP fra kamper.', lore: 'Det du måler, kan du gjøre regnskap for.' },
    { id: 'lupe', kind: 'relic', name: 'Forskerlupa', art: 'item-lupe', price: 65,
      desc: 'Du ser alltid hva Misforståelsen planlegger to trekk frem.', lore: 'Observasjon først — slutning etterpå.' },
    { id: 'periodesystem', kind: 'relic', name: 'Lommeperiodesystemet', art: 'item-periodesystem', price: 90,
      desc: '+25 % skade i Stoffgruvene.', lore: 'Mendelejev lot hull stå åpne for grunnstoffer ingen hadde funnet ennå.' },
    { id: 'solcelle', kind: 'relic', name: 'Solcellepanelet', art: 'item-solcelle', price: 105,
      desc: '+10 maks energi og +5 J etter hver seier.', lore: 'Nesten alle energikjeder starter i sola.' },
    { id: 'varmepumpe', kind: 'relic', name: 'Varmepumpa', art: 'item-varmepumpe', price: 120,
      desc: 'Ny evne: bruk 5 J for å hente 15 J ut av spillvarmen.', lore: 'En varmepumpe bruker høyverdig energi til å flytte lavverdig varme dit vi vil ha den. Den lager ikke energi.' },
  ];
  NG.item = (id) => NG.ITEMS.find((i) => i.id === id);
  NG.combatItems = () => NG.ITEMS.filter((i) => i.kind === 'use' && i.combat);

  /* ---------- Ekspedisjonsrelikvier (varer én ekspedisjon) ---------- */
  NG.RARITY = {
    vanlig: { name: 'Vanlig', color: 'var(--chalk-dim)' },
    sjelden: { name: 'Sjelden', color: 'var(--r-stoffer)' },
    episk: { name: 'Episk', color: 'var(--xp)' },
    boss: { name: 'Boss', color: 'var(--bad)' },
  };
  NG.RUN_RELICS = [
    { id: 'newtons-vugge', name: 'Newtons vugge', rarity: 'vanlig', art: 'relic-vugge',
      desc: 'Et feilsvar halverer rekka di i stedet for å nullstille den.', lore: 'Kulene sender bevegelsesmengde og energi videre fra støt til støt — lite går tapt hver gang.' },
    { id: 'bunsenbrenner', name: 'Bunsenbrenneren', rarity: 'vanlig', art: 'relic-bunsen',
      desc: '+3 J energi for hvert riktige svar når rekka er 3 eller mer.', lore: 'Med lufthullet åpent brenner gassen fullstendig: blå, varm flamme og mer energi frigjort per gram.' },
    { id: 'termoelement', name: 'Termoelementet', rarity: 'vanlig', art: 'relic-termoelement',
      desc: '+1 skade per 10 J spillvarme du har (maks +6).', lore: 'Seebeck-effekten: to ulike metaller og en temperaturforskjell gir en spenning. Litt av spillvarmen kan gjøre nytte igjen.' },
    { id: 'mikroskop', name: 'Mikroskopet', rarity: 'vanlig', art: 'relic-mikroskop',
      desc: 'Hint fjerner også ett galt alternativ på flervalgsspørsmål.', lore: 'Antoni van Leeuwenhoek så «dyrekryp» i en vanndråpe gjennom hjemmeslipte linser. Observasjon kom før teorien.' },
    { id: 'feltdagbok', name: 'Feltdagboka', rarity: 'vanlig', art: 'item-notatbok',
      desc: 'Etter et feilsvar gjenvinner du 4 J fra spillvarmen.', lore: 'Et mislykket forsøk er også data — hvis du skriver det ned og reflekterer over det.' },
    { id: 'katalysator', name: 'Katalysatoren', rarity: 'sjelden', art: 'relic-katalysator',
      desc: 'Den første evnen du bruker i hver kamp, er gratis.', lore: 'En katalysator senker aktiveringsenergien og kommer selv uforandret ut av reaksjonen.' },
    { id: 'leitner', name: 'Leitner-boksen', rarity: 'sjelden', art: 'item-begrepskort',
      desc: 'Dobbelt så mange gjenferd (repetisjonsspørsmål), og riktige svar på gjenferd gjør ×1,5 skade.', lore: 'Sebastian Leitners kortboks (1972): kort du kan, flyttes bakover og kommer sjeldnere. Spredt repetisjon slår pugging.' },
    { id: 'kontrollforsok', name: 'Kontrollforsøket', rarity: 'sjelden', art: 'relic-kontroll',
      desc: 'Etter et feilsvar kommer et nytt spørsmål fra samme tema. Svarer du riktig på det, gjør det ×1,5 skade.', lore: 'Endre én variabel om gangen og sammenlign med en kontroll — da vet du hva som gjorde forskjellen.' },
    { id: 'prisme', name: 'Prismet', rarity: 'sjelden', art: 'relic-prisme',
      desc: '+15 % sjanse for kritisk treff på spørsmål på nivå 4–5 (Anvende/Overføre).', lore: 'Newton viste at hvitt lys er sammensatt: prismet bryter de ulike bølgelengdene ulikt.' },
    { id: 'vandegraaff', name: 'Van de Graaff-generatoren', rarity: 'episk', art: 'relic-vdg',
      desc: 'Hvert 4. riktige svar i en kamp utløser en gnist: ekstra skade lik grunnskaden din.', lore: 'Beltet fører ladning opp til kula til spenningen blir så stor at lufta slår gjennom.' },
    { id: 'dna-modell', name: 'DNA-modellen', rarity: 'episk', art: 'relic-dna',
      desc: 'Begrepskortene dine gir dobbelt så stor skadebonus (opptil +60 %).', lore: 'Watson og Crick bygde modellen — men det var Rosalind Franklins røntgenbilde 51 som avslørte dobbelheliksen.' },
    { id: 'tannhjul', name: 'Evighetsmaskinens tannhjul', rarity: 'boss', art: 'relic-tannhjul',
      desc: 'Evner er gratis de to første rundene i hver kamp. Ulempe: du tar 10 % mer skade.', lore: 'Ingen evighetsmaskin har noen gang virket — 1. hovedsetning forbyr det. «Gratis» energi har alltid en pris et sted.' },
    { id: 'dewar', name: 'Dewar-kolben', rarity: 'boss', art: 'item-termos',
      desc: 'Når du svarer riktig, slår ikke Misforståelsen i det hele tatt. Ulempe: feilsvar gjør 25 % mer skade.', lore: 'James Dewars vakuumkolbe isolerer nesten perfekt: det som er inne, blir inne — på godt og vondt.' },
    { id: 'schrodinger', name: 'Schrödingers eske', rarity: 'boss', art: 'relic-eske',
      desc: '+25 % sjanse for kritisk treff. Ulempe: treff som ikke er kritiske, gjør 15 % mindre skade.', lore: 'Tankeeksperimentet skulle vise hvor rart det blir å bruke kvantemekanikk på en katt. Utfallet er uvisst til du åpner esken.' },
  ];
  NG.runRelic = (id) => NG.RUN_RELICS.find((r) => r.id === id) || null;
  NG.relicDef = (id) => NG.runRelic(id) || NG.item(id) || null;
  NG.runRelics = (s) => (s && s.run && Array.isArray(s.run.relics) ? s.run.relics : []);

  // Trekk n ulike relikvier spilleren ikke har. source: 'elite' | 'boss' | 'kiste' | 'butikk'
  NG.rollRelics = function (s, rng, n, source) {
    rng = rng || NG.makeRng(Date.now());
    n = n || 3;
    let avail = NG.RUN_RELICS.filter((r) => !NG.hasRelic(s, r.id));
    const W = { elite: [50, 35, 15], kiste: [70, 25, 5] }[source] || [60, 30, 10];
    const out = [];
    for (let i = 0; i < n && avail.length; i++) {
      let pool = [];
      if (source === 'boss') {
        pool = avail.filter((r) => r.rarity === 'boss');
        if (!pool.length) pool = avail.filter((r) => r.rarity === 'episk');
      } else {
        let rar;
        if (source === 'elite' && rng.chance(0.1)) rar = 'boss';
        else { const x = rng.next() * 100; rar = x < W[0] ? 'vanlig' : x < W[0] + W[1] ? 'sjelden' : 'episk'; }
        pool = avail.filter((r) => r.rarity === rar);
      }
      if (!pool.length) pool = avail.filter((r) => r.rarity !== 'boss');
      if (!pool.length) pool = avail;
      const pick = rng.pick(pool);
      out.push(pick.id);
      avail = avail.filter((r) => r !== pick);
    }
    return out;
  };

  // Gi spilleren en relikvie/gjenstand. Returnerer definisjonen (eller null).
  NG.gainRelic = function (s, id) {
    const rr = NG.runRelic(id);
    if (rr) {
      if (!s.run) return null;
      if (!Array.isArray(s.run.relics)) s.run.relics = [];
      if (s.run.relics.indexOf(id) < 0) s.run.relics.push(id);
      return rr;
    }
    const it = NG.item(id);
    if (!it) return null;
    if (it.kind === 'relic') {
      if (!Array.isArray(s.relics)) s.relics = [];
      if (s.relics.indexOf(id) < 0) { s.relics.push(id); if (id === 'solcelle') NG.addEnergy(s, 10); } // maks er hevet med 10
    } else s.items[id] = (s.items[id] || 0) + 1;
    return it;
  };

  /* ---------- Evner (med mestringsnivå 1–5 som følger spilleren) ---------- */
  NG.ABILITIES = [
    { id: 'blikk', name: 'Partikkelblikket', short: 'Partikkel­blikk', cost: 10, icon: 'item-partikkelbriller',
      desc: 'Fjern to gale svaralternativer (flervalg).',
      science: 'Partikkelmodellen: mange fenomener på makronivå — smelting, diffusjon, trykk — blir forståelige når vi «ser» partiklene på mikronivå. Blikket skreller bort alternativene som ikke stemmer med modellen.',
      levels: [null, 'Fjerner 2 gale alternativer på flervalgsspørsmål.', 'Svarer du riktig, gjenvinner du 3 J fra spillvarmen.', 'Koster 3 J mindre.', 'Det første Partikkelblikket i hver kamp er gratis.', 'Viser også begrepene spørsmålet bygger på (gratis hint).'] },
    { id: 'gruble', name: 'Grubletegning', short: 'Gruble­tegning', cost: 15, icon: 'item-lupe',
      desc: 'Skjold mot neste angrep, og du ser Misforståelsens plan to trekk frem.',
      science: 'Å tegne tanken sin — en skisse, en modell på papir — gjør den synlig for deg selv og andre. Elevtegninger avslører forestillinger som ord skjuler.',
      levels: [null, 'Skjold mot neste angrep, og du ser planen to trekk frem.', 'Koster 3 J mindre.', 'Når skjoldet tar et angrep, slår du tilbake med halve skaden (motargument).', 'Skjoldet tåler to angrep.', 'Gir også +1 hint i kampen.'] },
    { id: 'peb', name: 'PEB-kombo', short: 'PEB-kombo', cost: 25, icon: 'item-begrepskort',
      desc: 'Start en argumentkjede: tre riktige på rad (påstand → evidens → begrunnelse) gir et knusende argument.',
      science: 'Argumentasjon i naturfag: en påstand blir sterk først når den støttes av evidens og en begrunnelse som knytter evidensen til påstanden (Toulmins modell i skoleversjon).',
      levels: [null, 'Tre riktige på rad gir et knusende argument (2,2 × grunnskade).', 'Det knusende argumentet blir sterkere (2,7 ×).', 'Koster 5 J mindre.', 'Et feilsvar bryter ikke kjeden — du går bare ett steg tilbake.', 'Krever bare to riktige (evidens og begrunnelse i ett).'] },
    { id: 'pumpe', name: 'Varmepumpe', short: 'Varme­pumpe', cost: 5, icon: 'item-varmepumpe', needs: 'varmepumpe',
      desc: 'Hent 15 J ut av spillvarmen.',
      science: 'En varmepumpe bruker litt høyverdig energi (arbeid) til å flytte mye lavverdig varme. Forholdet kalles effektfaktor (COP), typisk 3–4. Den lager ikke energi — 2. hovedsetning sier at det koster arbeid å flytte varme «oppover».',
      levels: [null, 'Henter 15 J ut av spillvarmen.', 'Henter 18 J.', 'Henter 21 J.', 'Koster bare 3 J.', 'Henter 25 J.'] },
    { id: 'modell', name: 'Modellbygging', short: 'Modell­bygging', cost: 20, icon: 'relic-modell', unlock: 6,
      desc: 'Bygg en modell av fenomenet: neste riktige svar gir ekstra skade for hvert nivå begrepskortene i spørsmålet har.',
      science: 'Modeller forenkler virkeligheten for å forklare og forutsi. Jo bedre du kjenner begrepene, jo sterkere modell kan du bygge — men modellen er aldri selve virkeligheten.',
      levels: [null, 'Neste riktige svar: +3 skade per kortnivå (minst +6).', 'Koster 4 J mindre.', '+4 skade per kortnivå.', 'Riktig svar med modellen gir også 6 HP.', 'Modellen holder for to riktige svar.'] },
  ];
  NG.ABILITY_NEED = [0, 4, 6, 9, 12]; // mestrings-XP fra nivå n til n+1
  NG.ability = (id) => NG.ABILITIES.find((a) => a.id === id) || null;
  NG.abilityState = function (s, id) {
    if (!s.abilities || typeof s.abilities !== 'object') s.abilities = {};
    let a = s.abilities[id];
    if (!a || typeof a !== 'object') a = s.abilities[id] = { lvl: 1, xp: 0 };
    if (!(a.lvl >= 1)) a.lvl = 1;
    if (!(a.xp >= 0)) a.xp = 0;
    return a;
  };
  NG.abilityLevel = (s, id) => NG.abilityState(s, id).lvl;
  NG.abilityUnlocked = function (s, ab) {
    if (ab.needs && !NG.hasRelic(s, ab.needs)) return false;
    if (ab.unlock && s.level < ab.unlock) return false;
    return true;
  };
  NG.abilityCost = function (s, ab) {
    const lvl = NG.abilityLevel(s, ab.id);
    let c = ab.cost;
    if (ab.id === 'blikk') { if (lvl >= 3) c -= 3; if (NG.hasRelic(s, 'partikkelbriller')) c -= 5; c = Math.max(2, c); }
    if (ab.id === 'gruble' && lvl >= 2) c -= 3;
    if (ab.id === 'peb' && lvl >= 3) c -= 5;
    if (ab.id === 'pumpe' && lvl >= 4) c = 3;
    if (ab.id === 'modell' && lvl >= 2) c -= 4;
    return c;
  };
  NG.pumpAmount = (s) => [0, 15, 18, 21, 21, 25][NG.abilityLevel(s, 'pumpe')] || 15;
  // Gi mestrings-XP. Returnerer { id, lvl } ved nivå opp, ellers null.
  NG.abilityXp = function (s, id, amount) {
    const a = NG.abilityState(s, id);
    if (a.lvl >= 5) return null;
    a.xp += amount;
    let up = null;
    while (a.lvl < 5 && a.xp >= NG.ABILITY_NEED[a.lvl]) { a.xp -= NG.ABILITY_NEED[a.lvl]; a.lvl++; up = { id, lvl: a.lvl }; }
    if (a.lvl >= 5) a.xp = 0;
    return up;
  };
  NG.abilityUpText = function (up) {
    const ab = NG.ability(up.id);
    return ab ? ab.name + ' nivå ' + up.lvl + ': ' + ab.levels[up.lvl] : '';
  };
  // Trening (f.eks. hvileplassens «Tren»): gir mestrings-XP til evnen med lavest nivå (eller id).
  // Returnerer en kort tekst om hva som ble oppnådd.
  NG.trainAbility = function (s, id, amount) {
    amount = amount || 5;
    let ab = id ? NG.ability(id) : null;
    if (!ab) {
      const open = NG.ABILITIES.filter((a) => NG.abilityUnlocked(s, a) && NG.abilityLevel(s, a.id) < 5);
      open.sort((a, b) => (NG.abilityLevel(s, a.id) - NG.abilityLevel(s, b.id)) || (NG.abilityState(s, b.id).xp - NG.abilityState(s, a.id).xp));
      ab = open[0];
    }
    if (!ab) { const ups = NG.gainXp(s, 25); return 'Alle evnene dine er på toppnivå. Du fikk +25 XP i stedet' + (ups ? ' — og gikk opp et nivå!' : '.'); }
    const up = NG.abilityXp(s, ab.id, amount);
    if (up) return ab.name + ' nådde nivå ' + up.lvl + ': ' + ab.levels[up.lvl];
    const a = NG.abilityState(s, ab.id);
    return ab.name + ': +' + amount + ' mestring (' + a.xp + '/' + NG.ABILITY_NEED[a.lvl] + ' mot nivå ' + (a.lvl + 1) + ').';
  };
})();
