/* Stoffgruvene — Misforståelsene (låste id-er fra docs/ROSTER.md). */
(function () {
  'use strict';
  NG.content.addEnemies([
    {
      id: 'forsvinneren', name: 'Forsvinneren', region: 'stoffer', tier: 'normal',
      myth: 'myte.stoff-forsvinner', hp: 28, atk: 5,
      intro: 'En teskje sukker svever over en kopp te. Plopp – og den er borte. «Ta-da!» roper Forsvinneren og bukker for et publikum som ikke finnes.',
      taunts: [
        'Sukkeret er borte! Se selv – ingenting i koppen!',
        'Det du ikke ser, finnes ikke. Første regel i trylleboka.',
        'Salt i suppa? Puff, forsvant. Du trenger ikke engang vekt.',
        'Les tryllestaven min: Opp-løs-ning = ut-av-verden!',
      ],
      defeat: 'Vekta avslører trikset: teen veier like mye som te + sukker til sammen. Sukkermolekylene er bare spredt mellom vannmolekylene – og smaken er beviset.',
      topics: ['Polaritet og løselighet', 'Massebevaring'],
    },
    {
      id: 'smeltemannen', name: 'Smeltemannen', region: 'stoffer', tier: 'normal',
      myth: 'myte.faseovergang-er-reaksjon', hp: 30, atk: 6,
      intro: 'En dryppende skikkelse av is siger ut av en sølepytt. «Jeg reagerer! Jeg blir et nytt stoff!» gurgler han fornøyd.',
      taunts: [
        'Når jeg smelter, blir jeg et helt nytt stoff. Kall meg Vann 2.0!',
        'Boblene i kjelen? Det er meg som spaltes til hydrogen og oksygen!',
        'Smelting er en kjemisk reaksjon – det er jo derfor det heter «smelte-reaksjon» … ikke sant?',
        'Fryser du meg igjen, blir jeg et tredje stoff. Minst!',
      ],
      defeat: 'Smeltemannen fryser til is igjen – akkurat samme H₂O som før. Ved en faseovergang endres bevegelsen og avstanden mellom molekylene, ikke molekylene selv.',
      topics: ['Faser og partikkelmodellen'],
    },
    {
      id: 'luftlosen', name: 'Luftløsen', region: 'stoffer', tier: 'normal',
      myth: 'myte.gass-er-vektlos', hp: 26, atk: 6,
      intro: 'Noe usynlig fniser bak en oppblåst ballong. «Du kan ikke slå meg. Jeg er bare luft, og luft er ingenting!»',
      taunts: [
        'Veie meg? Haha! Gass veier null gram, det vet alle.',
        'Mellom partiklene dine er det luft. Mellom mine også. Luft hele veien ned!',
        'Fotballen blir lettere når du pumper den – den blir jo «lett som luft»!',
        'Lukket flaske eller åpen, det spiller ingen rolle. Gass teller ikke.',
      ],
      defeat: 'Du pumper fotballen og legger den på vekta: den blir flere gram tyngre. En liter luft veier rundt 1,2 g – gass er stoff, og stoff har masse.',
      topics: ['Faser og partikkelmodellen', 'Massebevaring'],
    },
    {
      id: 'atomfargeren', name: 'Atomfargeren', region: 'stoffer', tier: 'normal',
      myth: 'myte.atomer-har-stoffets-egenskaper', hp: 32, atk: 6,
      intro: 'En liten maler med pensel i hver hånd farger atomer: gull blir gule, kobber rødbrune. «Hvordan skulle de ellers fått fargen sin?»',
      taunts: [
        'Gullatomer er gule. Hvorfor tror du ringen din er gul, lissom?',
        'Isen er hard fordi vannmolekylene i den er harde. Logisk!',
        'Når jern varmes, utvider jernatomene seg som små ballonger.',
        'Natrium gir gul flamme fordi natriumatomer er gule. Neste spørsmål!',
      ],
      defeat: 'Fargen på penselen renner av. Farge, hardhet og ledningsevne er makroegenskaper som oppstår når milliarder av partikler virker sammen – enkeltatomer har dem ikke.',
      topics: ['Kjemiens tre nivåer', 'Atomet og isotoper'],
    },
    {
      id: 'blandingsbeisten', name: 'Blandingsbeistet', region: 'stoffer', tier: 'normal',
      myth: 'myte.blanding-er-forbindelse', hp: 34, atk: 7,
      intro: 'Et vesen sydd sammen av jernfilspon og svovelpulver rister seg løs. «Blanding eller forbindelse? Samma det, alt er bare … stæsj.»',
      taunts: [
        'Vann er bare en blanding av hydrogen og oksygen. Rør godt!',
        'Jernsulfid og jern + svovel er samme greia, bare mer blandet.',
        'Saltvann er en kjemisk forbindelse – det står jo salt OG vann i navnet.',
        'Alt som består av to ting, er en blanding. Eller en forbindelse. Whatever.',
      ],
      defeat: 'Du holder fram en magnet: jernet hopper ut av blandingen, men sitter fast i jernsulfidet. I en blanding beholder stoffene egenskapene sine; i en forbindelse er atomene bundet til et nytt stoff.',
      topics: ['Stoffer og blandinger'],
    },
    {
      id: 'iontyven', name: 'Iontyven', region: 'stoffer', tier: 'elite',
      myth: 'myte.salt-er-molekyler', hp: 58, atk: 9,
      intro: 'Med en sekk full av stjålne elektroner sniker Iontyven seg ut fra saltgruva. «Atomene VIL ha fullt skall. Jeg hjelper dem bare … mot et lite gebyr.»',
      taunts: [
        'Kloratomet lengter etter et ekstra elektron. Det står i hjertet dets!',
        'Én saltkrystall, tusen små NaCl-molekyler. Jeg har talt dem.',
        'Natrium gir gladelig bort elektronet sitt – det koster ingenting!',
        'Fast salt leder strøm. Det er jo fullt av ioner!',
        'Magnesium blir Mg⁶⁻. Seks elektroner inn, oktett ut. Enkelt.',
      ],
      defeat: 'Sekken revner. Atomer «vil» ingenting: å rive løs elektronet fra natrium koster energi, men tiltrekningen i iongitteret gir mer tilbake. Og i gitteret finnes ingen molekyler – bare ioner i forholdet 1:1.',
      topics: ['Ioner og bindinger', 'Periodesystemet'],
    },
    {
      id: 'koeffisientkaoset', name: 'Koeffisientkaoset', region: 'stoffer', tier: 'elite',
      myth: 'myte.indekser-kan-endres', hp: 62, atk: 10,
      intro: 'En virvelvind av små og store tall raser gjennom formelboka. «H₂O? Kjedelig! La oss prøve H₂O₂ … eller H₇O₃!»',
      taunts: [
        'Ulik balanse? Bare endre den lille toeren i O₂ til en ener. Ferdig!',
        'Na + Cl₂ → NaCl₂. Telle atomer? Stemmer jo!',
        'Koeffisient, indeks – det er bare tall i ulike størrelser.',
        'H₂ + O₂ → H₂O₂. Balansert og pent. At det er blekemiddel, er en detalj.',
      ],
      defeat: 'Tallene faller på plass: 2H₂ + O₂ → 2H₂O. Indeksene bestemmer hvilket stoff det er; bare koeffisientene teller hvor mange molekyler som reagerer.',
      topics: ['Reaksjonslikninger', 'Massebevaring'],
    },
    {
      id: 'alkymisten', name: 'Alkymisten', region: 'stoffer', tier: 'boss',
      myth: 'myte.masse-forsvinner-ved-brenning', hp: 140, atk: 12,
      intro: 'Dypt i Stoffgruvene bobler en kjele over et blått bål. Alkymisten løfter et stearinlys mot taket: «Se! Det brenner – og massen forsvinner inn i intetheten. Jeg kan skape og ødelegge stoff etter eget forgodtbefinnende!»',
      taunts: [
        'Lyset blir lettere og lettere. Hvor ble stoffet av? Puff – tilintetgjort!',
        'Bålet brant opp veden. Igjen ligger bare litt aske. Resten fins ikke mer.',
        'Med de riktige ordene gjør jeg bly til gull. Atomer er bare forslag.',
        'Massen ble til lys og varme. Det er ren E = mc², lærling!',
        'Stålulla blir tyngre når den brenner? Det må være sot. Eller trolldom.',
      ],
      phases: [
        { at: 0.66, text: 'Alkymisten slenger stålull på vekta og setter fyr på den. «Den blir tyngre – altså SKAPTE jeg masse!» Han prøver å vinne begge veier.' },
        { at: 0.33, text: 'Alkymisten forsegler kjelen med lokk. Vekta står bom stille … og han får panikk. «Hvem har tettet universet mitt?!»' },
      ],
      defeat: 'Alkymistens kjele står på vekta, tett lukket, og viser nøyaktig samme masse før og etter. Atomene forsvinner ikke og skapes ikke – de omgrupperes. Lyset ble lettere fordi CO₂ og vanndamp slapp ut; stålulla ble tyngre fordi jernet bandt oksygen fra lufta.',
      topics: ['Massebevaring', 'Kjemiske reaksjoner', 'Reaksjonslikninger'],
    },
  ]);
})();
