/* Himmelfjellet (jorda) — spørsmål del 3: flere grunnleggende spørsmål (nivå 1–2). */
(function () {
  'use strict';
  const UN = 'Universet og solsystemet';
  const DA = 'Døgn og årstider';
  const MT = 'Månen og tidevann';
  const PG = 'Platetektonikk og geologi';
  const AD = 'Atmosfære og drivhuseffekt';
  const KV = 'Klima og vær';

  const Q = [
    { id: 'jorda.univ.13', topic: UN, concepts: ['stjerne', 'solsystem'], level: 1, type: 'mc',
      prompt: 'Hva er sola?',
      options: ['En stjerne', 'En planet', 'En galakse', 'En komet'], answer: 0,
      why: { 1: 'Planeter lyser ikke selv; de går i bane rundt en stjerne.', 2: 'En galakse består av milliarder av stjerner – sola er én av dem i Melkeveien.', 3: 'Kometer er små kropper av is og støv.' },
      explain: 'Sola er en helt vanlig stjerne: en stor kule av gass der kjernereaksjoner (fusjon av hydrogen til helium) frigjør enorme mengder energi.' },
    { id: 'jorda.univ.14', topic: UN, concepts: ['galakse', 'solsystem', 'stjerne'], level: 1, type: 'order',
      prompt: 'Sorter fra **minst** til **størst**:',
      items: ['Månen', 'Jorda', 'Sola', 'Melkeveien', 'Universet'],
      explain: 'Månen er mindre enn jorda, og sola har en diameter over hundre ganger jordas. Melkeveien er en galakse med hundrevis av milliarder stjerner, og universet inneholder milliarder av galakser.' },
    { id: 'jorda.univ.15', topic: UN, concepts: ['solsystem'], level: 2, type: 'tf',
      prompt: 'Lyset fra sola bruker omtrent 8 minutter på veien til jorda.', answer: true,
      explain: 'Sant. Avstanden er ca. 150 millioner km, og lyset går ca. 300 000 km/s: 150 000 000 / 300 000 = 500 s ≈ 8 minutter. Ser du på sola (ikke gjør det!), ser du den slik den var for 8 minutter siden.' },
    { id: 'jorda.univ.16', topic: UN, concepts: ['planet', 'solsystem'], level: 2, type: 'mc',
      prompt: 'Hvorfor kalles Jupiter og Saturn **gasskjemper**?',
      options: ['De er store og består mest av hydrogen og helium', 'De er laget av stein og is, akkurat som Merkur', 'De er gamle stjerner som har sluttet å lyse', 'De er store skyer av gass som er uten tyngdekraft'], answer: 0,
      why: { 1: 'Merkur, Venus, jorda og Mars er steinplaneter; gasskjempene er noe helt annet.', 2: 'De har aldri vært stjerner – de er for små til at fusjon kan starte.', 3: 'De har sterk tyngdekraft – det er den som holder på gassen.' },
      explain: 'De fire indre planetene er små steinplaneter. De ytre er gasskjemper (Jupiter, Saturn) og isgiganter (Uranus, Neptun), med tykke atmosfærer av hydrogen og helium.' },
    { id: 'jorda.arst.14', topic: DA, concepts: ['dogn'], level: 1, type: 'mc',
      prompt: 'Hva er årsaken til at vi får dag og natt?',
      options: ['Jorda roterer om sin egen akse', 'Jorda går i bane rundt sola', 'Sola går i bane rundt jorda', 'Månen skygger for sola om natta'], answer: 0,
      why: { 1: 'Banen rundt sola tar ett år og gir årstidene sammen med aksehelningen – ikke døgnet.', 2: 'Det ser slik ut fra jorda, men det er jorda som roterer.', 3: 'Månen gir bare skygge ved solformørkelse, og da bare et lite område.' },
      explain: 'Jorda roterer én gang rundt sin egen akse på et døgn. Den siden som vender mot sola, har dag; den andre har natt.' },
    { id: 'jorda.arst.15', topic: DA, concepts: ['arstid', 'solsystem'], level: 1, type: 'mc',
      prompt: 'Hvor lang tid bruker jorda på én runde rundt sola?',
      options: ['Omtrent ett år', 'Omtrent ett døgn', 'Omtrent én måned', 'Omtrent én uke'], answer: 0,
      why: { 1: 'Ett døgn er tiden jorda bruker på å rotere én gang rundt sin egen akse.', 2: 'En måned er omtrent tiden månen bruker rundt jorda.', 3: 'En uke er en menneskeskapt tidsenhet uten astronomisk grunnlag.' },
      explain: 'Et år er ca. 365,25 døgn. Kvartdøgnet som blir til overs, samles opp til en skuddag hvert fjerde år.' },
    { id: 'jorda.mane.11', topic: MT, concepts: ['mane'], level: 1, type: 'mc',
      prompt: 'Hvorfor lyser månen?',
      options: ['Den reflekterer lys fra sola', 'Den har glødende stein inni seg', 'Den lager lys ved kjernereaksjoner', 'Den reflekterer lys fra jorda'], answer: 0,
      why: { 1: 'Månens indre er stort sett avkjølt, og lyset kommer uansett fra overflaten.', 2: 'Kjernereaksjoner skjer i stjerner som sola, ikke på månen.', 3: 'Litt jordlys gjør at vi av og til kan ane den mørke delen av månen, men det sterke måneskinnet er sollys.' },
      explain: 'Månen lyser ikke selv. Det er sollys som reflekteres fra overflaten. Derfor er alltid halve månen belyst – den halvdelen som vender mot sola.' },
    { id: 'jorda.geo.13', topic: PG, concepts: ['jordskorpe', 'platetektonikk'], level: 1, type: 'mc',
      prompt: 'Hva kalles de store, stive delene det ytterste laget av jorda er delt opp i?',
      options: ['Litosfæreplater', 'Kontinentalsokler', 'Sedimentlag', 'Magmakamre'], answer: 0,
      why: { 1: 'Kontinentalsokkelen er den grunne havbunnen langs kysten – en del av en plate.', 2: 'Sedimentlag er avsetninger som legger seg oppå hverandre.', 3: 'Et magmakammer er et område med smeltet stein under en vulkan.' },
      explain: 'Litosfæren (jordskorpa og den øverste, stive delen av mantelen) er delt i plater som beveger seg noen centimeter i året. Der platene møtes, får vi jordskjelv, vulkaner og fjellkjeder.' },
    { id: 'jorda.geo.14', topic: PG, concepts: ['geologisk-kretslop'], level: 2, type: 'sort',
      prompt: 'Hvilken type bergart er dette?',
      buckets: ['Størkningsbergart', 'Sedimentær bergart', 'Omdannet bergart'],
      items: [{ t: 'Granitt', b: 0 }, { t: 'Basalt', b: 0 }, { t: 'Sandstein', b: 1 }, { t: 'Kalkstein', b: 1 }, { t: 'Gneis', b: 2 }, { t: 'Marmor', b: 2 }],
      explain: 'Størkningsbergarter dannes av magma som stivner (granitt dypt nede, basalt i lava). Sedimentære bergarter dannes av avsetninger som presses sammen. Omdannede bergarter dannes når andre bergarter utsettes for høyt trykk og høy temperatur – marmor er omdannet kalkstein.' },
    { id: 'jorda.atm.11', topic: AD, concepts: ['atmosfaere'], level: 1, type: 'mc',
      prompt: 'Hvilken gass er det **mest** av i lufta?',
      options: ['Nitrogen', 'Oksygen', 'Karbondioksid', 'Argon'], answer: 0,
      why: { 1: 'Oksygen utgjør ca. 21 %.', 2: 'CO₂ er bare ca. 0,04 % – men har stor betydning for drivhuseffekten.', 3: 'Argon utgjør knapt 1 %.' },
      explain: 'Tørr luft er ca. 78 % nitrogen (N₂), 21 % oksygen (O₂), 0,9 % argon og 0,04 % CO₂. I tillegg kommer varierende mengder vanndamp.' },
    { id: 'jorda.klima.08', topic: KV, concepts: ['vaer', 'klima'], level: 2, type: 'mc',
      prompt: 'Hva er forskjellen på **vær** og **klima**?',
      options: ['Vær er her og nå, klima er snittet over 30 år', 'Vær gjelder Norge, klima gjelder hele jorda', 'Vær er temperaturen, klima er nedbør og vind', 'Vær måles på land, klima måles ute på havet'], answer: 0,
      why: { 1: 'Både vær og klima kan beskrives for et sted eller for hele jorda.', 2: 'Både vær og klima omfatter temperatur, nedbør, vind og mer.', 3: 'Begge måles både på land og på havet.' },
      explain: 'Vær er tilstanden i atmosfæren på et bestemt sted og tidspunkt. Klima er gjennomsnittsværet og variasjonen over lang tid – vanligvis 30 år.' },
    { id: 'jorda.klima.09', topic: AD, concepts: ['drivhuseffekt'], level: 2, type: 'tf',
      prompt: 'Uten den naturlige drivhuseffekten ville jorda vært mye kaldere enn i dag.', answer: true,
      explain: 'Sant. Uten drivhusgasser ville gjennomsnittstemperaturen vært ca. −18 °C, mot ca. 15 °C i dag. Problemet er den *forsterkede* drivhuseffekten fra menneskelige utslipp.' },
  ];

  NG.content.addQuestions(Q.map((q) => Object.assign({ region: 'jorda' }, q)));
})();
