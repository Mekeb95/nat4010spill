/* Energidalen — Misforståelsene (id-er låst i docs/ROSTER.md). */
(function () {
  'use strict';
  NG.content.addEnemies([
    {
      id: 'kuldespokelset', name: 'Kuldespøkelset', region: 'energi', tier: 'normal',
      myth: 'myte.kulde-overfores', hp: 30, atk: 6,
      intro: 'Et iskaldt gufs siver ut av bordbeinet og formes til et skjelvende spøkelse med istapper i stedet for fingre.',
      taunts: [
        'Lukk døra! Ellers slipper jeg inn all kulda mi!',
        'Hører du isbiten? Den pumper kulde inn i brusen din. Glugg, glugg.',
        'Jeg kryper inn gjennom vindusglasset hver natt. Det er derfor det trekker.',
        'Ta på metallet, du. Kjenn hvordan kulda mi renner opp i armen.',
      ],
      defeat: 'Spøkelset blir til en dam av romtemperert vann. Det var aldri kulde som strømmet inn – det var energi som strømmet ut av deg, fra varmt til kaldt.',
      topics: ['Varme og temperatur', 'Varmetransport'],
    },
    {
      id: 'kraftkjempen', name: 'Kraftkjempen', region: 'energi', tier: 'normal',
      myth: 'myte.energi-er-kraft', hp: 34, atk: 7,
      intro: 'Kraftkjempen står og presser mot en fjellvegg med blodårene stående ut i panna. Veggen har ikke rikket seg på tre hundre år.',
      taunts: [
        'Se på all energien jeg putter i denne veggen! Hundre år med ren kraft!',
        'Kraft, energi, styrke, power – samme greia. Jeg har masse av alt!',
        'Jeg trenger ikke flytte noe. Det holder å presse HARDT.',
        'Måles energi i newton? Selvfølgelig! Og i muskler!',
      ],
      defeat: 'Kjempen synker sammen. Kraft er et dytt som virker nå; energi er det som er bevart. Bare når kraften flytter noe, overføres energi – det er arbeid, W = F · s. Veggen fikk null joule.',
      topics: ['Arbeid og effekt', 'Energiformer'],
    },
    {
      id: 'forbrukeren', name: 'Forbrukeren', region: 'energi', tier: 'normal',
      myth: 'myte.energi-brukes-opp', hp: 32, atk: 6,
      intro: 'En sulten skikkelse med handlenett full av flate batterier sleper seg fram mens den gumler på en lyspære.',
      taunts: [
        'Nam! Nå har jeg spist opp all energien i batteriet. Den er BORTE.',
        'Når ballen slutter å sprette, er energien brukt opp. Enkel matte.',
        'Jo mer jeg forbruker, jo mindre energi finnes det i universet. Jeg er en helt.',
        'Varme? Nei, nei. Når energien er brukt, blir den til ingenting.',
      ],
      defeat: 'Forbrukeren raper opp en skvett spillvarme og forsvinner. Energi er bevart – den ender som spredt termisk energi. Det som «forbrukes», er kvaliteten, ikke mengden.',
      topics: ['Energibevaring', 'Energikvalitet'],
    },
    {
      id: 'hvilesteinen', name: 'Hvilesteinen', region: 'energi', tier: 'normal',
      myth: 'myte.energi-krever-bevegelse', hp: 36, atk: 5,
      intro: 'Høyt oppe på en hylle ligger en mosegrodd stein og snorker. Den åpner ett øye: «Jeg er helt ufarlig. Jeg har null energi.»',
      taunts: [
        'Ser du meg bevege meg? Nei. Altså har jeg ingen energi. Zzz …',
        'Energi er for løpere og vind. Steiner er fritatt.',
        'Matpakken din ligger jo stille også. Null energi i den!',
        'Hvis jeg skulle falle … nei, det skjer ikke. Jeg har ikke energi til det.',
      ],
      defeat: 'Steinen ramler ned og slår et hull i gulvet. Den hadde stillingsenergi hele tiden – Eₚ = mgh – og den ble til bevegelsesenergi i fallet. Energi trenger ikke bevegelse for å finnes.',
      topics: ['Energiformer', 'Mekanisk energi'],
    },
    {
      id: 'glodende-molekyl', name: 'Det glødende molekylet', region: 'energi', tier: 'normal',
      myth: 'myte.varme-molekyler', hp: 28, atk: 7,
      intro: 'Et lite vannmolekyl gløder rødt som en kokeplate og svever stolt over kaffekoppen. «Jeg er det VARMESTE molekylet i hele koppen!»',
      taunts: [
        'Kjenn på meg! Jeg er 95 grader helt alene!',
        'Når vannet koker, blir hvert eneste molekyl rødglødende. Logisk.',
        'Kalde molekyler er blå. Varme er røde. Har du ikke sett tegningene?',
        'Jeg har mi egen temperatur, takk. Jeg trenger ikke de andre.',
      ],
      defeat: 'Molekylet slukner og forsvinner i mengden. Temperatur er et gjennomsnitt over milliarder av partikler. Ett molekyl har fart og bevegelsesenergi – men ingen temperatur.',
      topics: ['Varme og temperatur', 'Indre energi'],
    },
    {
      id: 'jernhanden', name: 'Jernhånden', region: 'energi', tier: 'elite',
      myth: 'myte.metall-er-kaldt', hp: 60, atk: 9,
      intro: 'Fra bordbeinet av stål reiser seg en enorm hanske av jern. Den griper etter deg – og du kjenner hvor KALD den er.',
      taunts: [
        'Jeg er laget av metall. Metall ER kaldt. Det er naturens lov.',
        'Treplata og jeg står i samme rom, men jeg er minst ti grader kaldere. Kjenn selv!',
        'Ull er varmt, jern er kaldt. Sånn har det alltid vært.',
        'Termometer? Pff. Hånda di lyver aldri.',
        'Legg isbiten på metallplata – den smelter jo saktere der, fordi jeg er kaldest!',
      ],
      defeat: 'Hanskens fingre sprekker. Metall og tre i samme rom har samme temperatur – nulte lov. Metallet føles kaldt fordi frie elektroner leder energi raskt bort fra hånda. (Og isbiten smelter faktisk *raskere* på metallet, av samme grunn.)',
      topics: ['Varme og temperatur', 'Varmetransport'],
    },
    {
      id: 'kilowatt-trollet', name: 'Kilowatt-trollet', region: 'energi', tier: 'elite',
      myth: 'myte.kw-er-energi', hp: 64, atk: 10,
      intro: 'Under strømledningene bor et troll med en kalkulator der alle tastene er «kW». Det krever bompenger: «Betal i kilowatt per time!»',
      taunts: [
        'Strømregningen din er på 2000 kilowatt. Per time. Per måned. Eller noe.',
        'Vannkokeren bruker mer energi enn kjøleskapet. Den har jo flere watt!',
        'Kilowatt, kilowattime – bare en time-forskjell, liksom.',
        'Jeg har EFFEKT! Det betyr at jeg har masse energi lagret!',
      ],
      defeat: 'Kalkulatoren eksploderer i en sky av joule. Effekt (kW) sier hvor fort; energi (kWh) er effekt *ganger* tid. Et kjøleskap på 100 W som går hele døgnet, bruker 2,4 kWh – mer enn vannkokeren på 2000 W bruker på 30 minutter (1 kWh).',
      topics: ['Arbeid og effekt', 'Virkningsgrad'],
    },
    {
      id: 'evighetsmaskinen', name: 'Evighetsmaskinen', region: 'energi', tier: 'boss',
      myth: 'myte.evighetsmaskin', hp: 140, atk: 12,
      intro: 'Dypest i Energidalen klirrer et vanvittig apparat av hjul, kuler og magneter. Over døra står det: «PATENTERT. GÅR FOR ALLTID. GIR UT MER ENN DEN FÅR INN.»',
      taunts: [
        'Hjulet mitt har aldri stoppet! Vel, bortsett fra hver gang. Men det teller ikke!',
        'Generatoren driver motoren, motoren driver generatoren. Gratis strøm for evig!',
        'Friksjon er bare et dårlig rykte spredt av fysikklærere.',
        'Spillvarme? Jeg samler den opp igjen, hver eneste joule, og bruker den på nytt!',
        'Varmepumpa har 300 % virkningsgrad. Altså lager den energi. Altså kan jeg også!',
      ],
      phases: [
        { at: 0.66, text: 'Kulene skrangler fortere. Evighetsmaskinen kobler motoren til sin egen generator: «Nå får jeg ut MER enn jeg putter inn!» (1. hovedsetning står på spill.)' },
        { at: 0.33, text: 'Maskinen begynner å gløde av spillvarme. Den prøver desperat å suge varmen tilbake til hjulet: «Ingenting går tapt hos meg!» (Nå handler det om energikvalitet – 2. hovedsetning.)' },
      ],
      defeat: 'Hjulene sakker, gnisser og står stille, og maskinen er varm å ta på. Energien er ikke borte – den er spredt som varme i lagrene og lufta. 1. hovedsetning: du får aldri ut mer enn du putter inn. 2. hovedsetning: kvaliteten synker i hver prosess, så ingen maskin kan gå evig.',
      topics: ['Termodynamikkens lover', 'Energikvalitet', 'Virkningsgrad'],
    },
  ]);
})();
