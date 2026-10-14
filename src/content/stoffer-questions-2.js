/* Stoffgruvene — spørsmål del 2: bindinger, løselighet, faser, reaksjoner, likninger,
   massebevaring og kjemiens tre nivåer. */
(function () {
  'use strict';
  const R = 'stoffer';
  const T_BIND = 'Ioner og bindinger';
  const T_LOS = 'Polaritet og løselighet';
  const T_FASE = 'Faser og partikkelmodellen';
  const T_REAK = 'Kjemiske reaksjoner';
  const T_LIKN = 'Reaksjonslikninger';
  const T_MASSE = 'Massebevaring';
  const T_NIVA = 'Kjemiens tre nivåer';

  /* =====================================================================
     IONER OG BINDINGER
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.bind.01', region: R, topic: T_BIND, concepts: ['ion'], level: 1, type: 'mc',
      prompt: 'Hva er et **ion**?',
      options: [
        'Et atom eller en atomgruppe med elektrisk ladning',
        'Et atom med ekstra nøytroner i kjernen',
        'Et molekyl som består av to like atomer',
        'Et atom som har fullt ytterskall og ikke reagerer',
      ],
      answer: 0,
      why: {
        1: 'Ekstra nøytroner gir en isotop. Nøytronene har ingen ladning.',
        2: 'Det er et toatomig molekyl, som O₂ eller Cl₂. Det er uladet.',
        3: 'Det beskriver en edelgass. Ioner får riktignok ofte fullt ytterskall, men det som gjør dem til ioner, er ladningen.',
      },
      explain: 'Et ion har ulikt antall protoner og elektroner. Avgir et atom elektroner, blir det positivt (Na⁺); tar det opp elektroner, blir det negativt (Cl⁻). Også atomgrupper kan være ioner, f.eks. karbonat, CO₃²⁻.',
    },
    {
      id: 'stoffer.bind.02', region: R, topic: T_BIND, concepts: ['ion', 'elektronskall'], level: 2, type: 'mc',
      prompt: 'Magnesium har elektronfordelingen 2, 8, 2. Hvilket ion danner magnesium?',
      options: ['Mg²⁺', 'Mg⁺', 'Mg²⁻', 'Mg⁶⁻'],
      answer: 0,
      why: {
        1: 'Avgir magnesium bare ett elektron, blir det stående igjen ett alene i ytterskallet. Begge ytterelektronene avgis.',
        2: 'Metaller avgir elektroner og blir positive. Negative ioner dannes av ikke-metaller.',
        3: 'Å ta opp seks elektroner krever langt mer energi enn å avgi to. Atomet går den veien som flytter færrest elektroner.',
      },
      explain: 'Mg avgir de to ytterelektronene og blir Mg²⁺ med elektronfordelingen 2, 8 – samme som neon. Ionet har 12 protoner og 10 elektroner: ladning +2.',
    },
    {
      id: 'stoffer.bind.03', region: R, topic: T_BIND, concepts: ['ionebinding', 'ion'], level: 3, type: 'mc',
      prompt: 'Aluminium danner Al³⁺ og oksygen danner O²⁻. Hva er formelen for aluminiumoksid?',
      options: ['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃'],
      answer: 0,
      why: {
        1: 'AlO gir ladningen +3 − 2 = +1. Et salt må være elektrisk nøytralt.',
        2: 'Indeksene er byttet om: 3 · (+3) + 2 · (−2) = +5.',
        3: '+3 + 3 · (−2) = −3. Ladningen balanserer ikke.',
      },
      explain: 'Totalladningen må bli 0 med minste hele tall: 2 · (+3) + 3 · (−2) = 0, altså Al₂O₃. Formelen forteller forholdet mellom ionene i gitteret (2 : 3), ikke at det finnes Al₂O₃-molekyler.',
    },
    {
      id: 'stoffer.bind.04', region: R, topic: T_BIND, concepts: ['ionebinding', 'kovalent-binding', 'metallbinding'], level: 3, type: 'sort',
      prompt: 'Hvilken bindingstype holder stoffet sammen?',
      buckets: ['Ionebinding', 'Kovalent', 'Metallbinding'],
      items: [
        { t: 'Natriumklorid, NaCl', b: 0 },
        { t: 'Vann, H₂O', b: 1 },
        { t: 'Kobber', b: 2 },
        { t: 'Kalsiumoksid, CaO', b: 0 },
        { t: 'Metan, CH₄', b: 1 },
        { t: 'Jern', b: 2 },
        { t: 'Diamant', b: 1 },
        { t: 'Magnesiumklorid, MgCl₂', b: 0 },
      ],
      explain: 'Metall + ikke-metall gir ioner og ionebinding (NaCl, CaO, MgCl₂). Ikke-metaller seg imellom deler elektronpar – kovalent binding – i molekyler (H₂O, CH₄) eller nettverk (diamant). Metaller alene holdes sammen av metallbinding: positive ioner i et hav av frie elektroner.',
    },
    {
      id: 'stoffer.bind.05', region: R, topic: T_BIND, concepts: ['ionebinding', 'kovalent-binding', 'metallbinding', 'molekyl'], level: 3, type: 'sort',
      prompt: 'Hva slags stoff er det: **metall**, **salt**, **molekylstoff** eller **nettverksstoff**?',
      buckets: ['Metall', 'Salt', 'Molekylstoff', 'Nettverk'],
      items: [
        { t: 'Sølv', b: 0 },
        { t: 'Kaliumklorid', b: 1 },
        { t: 'Sukker', b: 2 },
        { t: 'Kvarts, SiO₂', b: 3 },
        { t: 'Kalk, CaCO₃', b: 1 },
        { t: 'Vann', b: 2 },
        { t: 'Diamant', b: 3 },
        { t: 'Aluminium', b: 0 },
      ],
      explain: 'Kjemi for lærere kap. 5 deler stoffer i fire grupper etter partikler og binding. Metaller: metallbinding. Salter: ioner i gitter (KCl, CaCO₃). Molekylstoffer: avgrensede molekyler med svake krefter mellom seg – lave smeltepunkter (vann, sukker). Nettverksstoffer: kovalente bindinger gjennom hele krystallen – svært harde og med høye smeltepunkter (diamant, kvarts).',
    },
    {
      id: 'stoffer.bind.06', region: R, topic: T_BIND, concepts: ['ionebinding', 'molekyl', 'ion'], level: 4, type: 'mc',
      myth: 'myte.salt-er-molekyler',
      prompt: 'Hvor mange **NaCl-molekyler** finnes det i en liten saltkrystall?',
      options: [
        'Ingen – saltet er et iongitter, og NaCl angir bare forholdet 1 : 1 mellom ionene',
        'Omtrent like mange som det er natriumatomer i krystallen',
        'Halvparten så mange som det er ioner i krystallen',
        'Bare ett, fordi hele krystallen er ett stort molekyl',
      ],
      answer: 0,
      why: {
        1: 'Dette forutsetter at Na⁺ og Cl⁻ sitter i faste par. Hvert Na⁺ er omgitt av seks Cl⁻ like langt unna – ingen av dem er «partneren».',
        2: 'Samme tankefeil: å telle par forutsetter avgrensede molekyler, og det finnes ikke i et salt.',
        3: 'Et molekyl holdes sammen av delte elektronpar. I saltet er bindingen elektrisk tiltrekning mellom ioner i alle retninger.',
      },
      explain: 'Ionebindingen er ikke retningsbestemt: hvert ion tiltrekker alle naboer med motsatt ladning. Det gir et sammenhengende gitter, og formelen NaCl er en formelenhet (forholdstall), ikke et molekyl. Molekyler finnes i molekylstoffer som vann og sukker.',
    },
    {
      id: 'stoffer.bind.07', region: R, topic: T_BIND, concepts: ['metallbinding', 'elektron', 'egenskap'], level: 3, type: 'mc',
      prompt: 'Hvorfor leder metaller elektrisk strøm godt?',
      options: [
        'Ytterelektronene er ikke bundet til ett atom og kan bevege seg fritt gjennom metallet',
        'Metallatomene er pakket så tett at strømmen hopper fra atom til atom',
        'Metallionene er positive og vandrer mot minuspolen',
        'Metaller er harde, og harde stoffer leder strøm bedre',
      ],
      answer: 0,
      why: {
        1: 'Tett pakking alene gir ikke ledningsevne – salter og diamant er også tettpakket, men leder ikke. Det må finnes ladde partikler som kan bevege seg.',
        2: 'Metallionene sitter fast i gitteret. Det er elektronene som beveger seg i en metalltråd.',
        3: 'Diamant er hardere enn alle metaller, men leder ikke strøm. Hardhet og ledningsevne er ulike egenskaper.',
      },
      explain: 'Metallbinding: positive metallioner i et gitter holdes sammen av et «hav» av delokaliserte elektroner. Kobles en spenning til, driver elektronene gjennom metallet. De frie elektronene forklarer også varmeledning og metallglans.',
    },
    {
      id: 'stoffer.bind.08', region: R, topic: T_BIND, concepts: ['ion', 'loselighet', 'ionebinding'], level: 4, type: 'mc',
      prompt: 'Saltvann leder strøm, men sukkervann gjør det ikke. Hva er forklaringen?',
      options: [
        'Salt løses som frie ioner som kan bevege seg; sukker løses som uladde molekyler',
        'Salt inneholder metallet natrium, og metaller leder strøm',
        'Saltvann har flere partikler oppløst enn sukkervann',
        'Sukker er en isolator som stenger strømmen i vannet',
      ],
      answer: 0,
      why: {
        1: 'Det finnes ikke natriummetall i saltvannet, bare Na⁺-ioner. Det er ladningen og bevegeligheten som teller, ikke at grunnstoffet «er et metall».',
        2: 'Antall partikler er ikke poenget. En løsning med mange uladde molekyler leder fortsatt ikke.',
        3: 'Sukker blokkerer ikke strøm. Rent vann leder også svært dårlig – det mangler ioner.',
      },
      explain: 'Strøm er ladning i bevegelse. Når NaCl løses, går gitteret fra hverandre og Na⁺ og Cl⁻ blir omgitt av vannmolekyler og kan vandre mot hver sin pol. Sukkermolekyler er nøytrale, så løsningen leder ikke.',
    },
    {
      id: 'stoffer.bind.09', region: R, topic: T_BIND, concepts: ['metallbinding', 'ionebinding', 'egenskap'], level: 4, type: 'mc',
      prompt: 'Et kobberstykke kan bankes flatt, mens en saltkrystall knuses av et hammerslag. Hva er forklaringen på partikkelnivå?',
      options: [
        'I metallet glir ionelagene over hverandre mens elektronsjøen holder dem sammen; i saltet havner like ladninger ved siden av hverandre og frastøter',
        'Kobberatomene er myke, mens natrium- og kloratomene er harde',
        'Kobber har sterkere bindinger enn salt, så det tåler mer',
        'Saltet inneholder vann som gjør det sprøtt',
      ],
      answer: 0,
      why: {
        1: 'Atomer er ikke myke eller harde. Hardhet og sprøhet er makroegenskaper som forklares med hvordan partiklene er bundet.',
        2: 'Bindingene i salt er svært sterke (NaCl smelter ved 801 °C). Forskjellen ligger i hvordan gitteret reagerer når lagene forskyves.',
        3: 'Tørre saltkrystaller er like sprø. Sprøheten skyldes ionegitteret.',
      },
      myth: 'myte.atomer-har-stoffets-egenskaper',
      explain: 'Forskyves et lag i et metall, er omgivelsene til hvert ion de samme – elektronene følger med. Forskyves et lag i et salt, kommer Na⁺ ved siden av Na⁺ og Cl⁻ ved siden av Cl⁻. Frastøtningen kløyver krystallen langs et plan.',
    },
    {
      id: 'stoffer.bind.10', region: R, topic: T_BIND, concepts: ['kovalent-binding', 'egenskap', 'grunnstoff'], level: 4, type: 'multi',
      prompt: 'Diamant og grafitt er to former av samme grunnstoff. Hvilke påstander er **riktige**?',
      options: [
        'Begge består bare av karbonatomer',
        'Diamant er et nettverksstoff der hvert C-atom er bundet kovalent til fire andre',
        'Grafitt leder strøm fordi hvert C-atom har ett elektron som kan bevege seg langs lagene',
        'Diamant er hard fordi karbonatomene i diamant er harde',
        'Diamant og grafitt er to isotoper av karbon',
      ],
      answer: [0, 1, 2],
      explain: 'Diamant og grafitt er allotroper (ulike strukturer av samme grunnstoff), ikke isotoper. I diamant binder hvert C-atom fire andre i et stivt 3D-nettverk – svært hardt, ingen frie elektroner. I grafitt binder hvert C-atom tre andre i lag; det fjerde elektronet kan bevege seg, og lagene glir lett (blyant). Egenskapene kommer av strukturen, ikke av «harde atomer».',
    },
    {
      id: 'stoffer.bind.11', region: R, topic: T_BIND, concepts: ['ion', 'ionebinding', 'elektronskall'], level: 5, type: 'mc',
      myth: 'myte.salt-er-molekyler',
      prompt: 'En elev forklarer: «Natrium gir bort elektronet sitt fordi det **vil ha** fullt ytterskall.» Hvordan kan du best videreutvikle forklaringen hennes?',
      options: [
        'Påpeke at atomer ikke vil noe: det koster energi å fjerne elektronet, men tiltrekningen mellom ionene i gitteret frigjør mer, så systemet ender lavere i energi',
        'Bekrefte forklaringen; ønsket om fullt skall er drivkraften bak alle reaksjoner',
        'Si at natrium gir bort elektronet fordi elektronet er negativt og natrium er positivt',
        'Si at natrium gjør det for å bli lik neon, og at alle atomer prøver å bli edelgasser',
      ],
      answer: 0,
      why: {
        1: 'Det er en menneskeliggjøring (antropomorf forklaring) som skjuler mekanismen. Oktettregelen er en nyttig huskeregel, ikke en årsak.',
        2: 'Et nøytralt natriumatom er ikke positivt. Det har like mange protoner og elektroner.',
        3: 'Na⁺ har samme elektronfordeling som neon, men blir ikke neon – protontallet er fortsatt 11. Og «prøver» er igjen et ønske, ikke en mekanisme.',
      },
      explain: 'Taber og Kjemi fagdidaktikk peker på at oktettregelen ofte blir en falsk forklaring. Bedre: et fritt Na-atom «gir» ikke frivillig bort noe – ioniseringen koster energi. Men når Na⁺ og Cl⁻ samles i et gitter, frigjøres mye energi (derfor er reaksjonen eksoterm). Det er energien som avgjør, og et godt grep er å ta språket opp eksplisitt med elevene.',
    },
    {
      id: 'stoffer.bind.12', region: R, topic: T_BIND, concepts: ['ionebinding', 'partikkelmodellen', 'kjemiens-tre-nivaer'], level: 5, type: 'mc',
      prompt: 'Elevene bygger bordsalt med en kule-pinne-byggesett og lager mange små Na–Cl-par. Hvilken **begrensning** ved modellen er viktigst å ta opp?',
      options: [
        'Modellen viser avgrensede par, men i saltet er hvert Na⁺ omgitt av seks Cl⁻ i et gitter uten faste partnere',
        'Modellen mangler pinnene for elektronparene som natrium og klor deler',
        'Det skulle vært to Cl-kuler per Na-kule, fordi klor er toatomig',
        'Kulene burde hatt samme størrelse, fordi alle ioner er like store',
      ],
      answer: 0,
      why: {
        1: 'Ionebinding er ikke delte elektronpar – det er elektrisk tiltrekning mellom ioner. Pinner i modellen kan forsterke denne misoppfatningen.',
        2: 'Klorgass er Cl₂, men i saltet finnes klor som Cl⁻-ioner i forholdet 1 : 1 med Na⁺. Formelen er NaCl.',
        3: 'Ionene er ikke like store: Cl⁻ er nesten dobbelt så stort som Na⁺. Størrelsesforskjellen er en styrke ved en god gittermodell.',
      },
      myth: 'myte.salt-er-molekyler',
      explain: 'Kjemi fagdidaktikk kap. 5: alle modeller har styrker og begrensninger, og elevene bør lære å vurdere dem. En kule-pinne-modell egner seg for molekyler, men gir et misvisende bilde av salter. En gittermodell (kuler i et kubisk mønster uten pinner) viser bedre at bindingen virker i alle retninger.',
    },
  ]);

  /* =====================================================================
     POLARITET OG LØSELIGHET
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.los.01', region: R, topic: T_LOS, concepts: ['elektronegativitet'], level: 2, type: 'mc',
      prompt: 'Hva er **elektronegativitet**?',
      options: [
        'Hvor sterkt et atom i en binding trekker på de delte elektronene',
        'Hvor mange elektroner et atom har i ytterskallet',
        'Hvor negativt ladet et ion er',
        'Hvor lett et atom gir fra seg elektroner til andre atomer',
      ],
      answer: 0,
      why: {
        1: 'Antall ytterelektroner henger sammen med gruppen, men elektronegativitet er en tiltrekningsevne – helium har to ytterelektroner og ingen målt elektronegativitet.',
        2: 'Ladningen til et ion er noe annet. Elektronegativitet handler om atomer som deler elektroner i en binding.',
        3: 'Dette er nærmest det motsatte: atomer med lav elektronegativitet (metaller) avgir lett elektroner.',
      },
      explain: 'Elektronegativiteten øker bortover en periode og oppover i en gruppe; fluor er høyest. Forskjellen mellom to atomer avgjør bindingen: liten forskjell gir upolar kovalent binding, middels gir polar kovalent binding, stor gir ioner.',
    },
    {
      id: 'stoffer.los.02', region: R, topic: T_LOS, concepts: ['elektronegativitet', 'molekyl', 'kovalent-binding'], level: 3, type: 'mc',
      prompt: 'Hvorfor er vannmolekylet **polart**?',
      options: [
        'Oksygen trekker hardere på elektronene enn hydrogen, og molekylet er vinklet så ladningene ikke opphever hverandre',
        'Vann er en væske, og væsker er polare',
        'Oksygenatomet i vann er et O²⁻-ion',
        'Hydrogenatomene er mye større enn oksygenatomet',
      ],
      answer: 0,
      why: {
        1: 'Fasen sier ikke noe om polaritet. Bensin er en upolar væske.',
        2: 'Vann er et molekyl med delte elektronpar. Oksygen får en delvis negativ ladning (δ−), ikke en hel ladning.',
        3: 'Hydrogen er det minste atomet. Størrelse er ikke grunnen.',
      },
      explain: 'O (3,4) er mye mer elektronegativt enn H (2,2), så bindingselektronene forskyves mot O: δ− på oksygen, δ+ på hydrogenene. Fordi molekylet er vinklet (ca. 105°), får det en negativ og en positiv side. Det forklarer at vann løser salter og sukker.',
    },
    {
      id: 'stoffer.los.03', region: R, topic: T_LOS, concepts: ['elektronegativitet', 'molekyl'], level: 4, type: 'mc',
      prompt: 'Bindingene C=O i karbondioksid er polare, men CO₂-molekylet er **upolart**. Hvordan kan det ha seg?',
      options: [
        'Molekylet er lineært og symmetrisk, så de to polare bindingene trekker like mye i hver sin retning',
        'Karbon og oksygen har lik elektronegativitet',
        'CO₂ er en gass, og gassmolekyler er alltid upolare',
        'Dobbeltbindinger kan ikke være polare',
      ],
      answer: 0,
      why: {
        1: 'O (3,4) er tydelig mer elektronegativt enn C (2,6). Bindingene er polare.',
        2: 'Vanndamp er en gass med polare molekyler. Polaritet avhenger av molekylet, ikke av fasen.',
        3: 'Dobbeltbindinger kan godt være polare – C=O i CO₂ er nettopp det.',
      },
      explain: 'O=C=O er rett: de to bindingsdipolene peker i motsatt retning og opphever hverandre. Vann er vinklet, så dipolene legges sammen. Formen er like viktig som elektronegativiteten – et fint eksempel på at mikrostrukturen bestemmer makroegenskaper som løselighet.',
    },
    {
      id: 'stoffer.los.04', region: R, topic: T_LOS, concepts: ['loselighet', 'elektronegativitet'], level: 3, type: 'sort',
      prompt: 'Løses stoffet **godt** eller **dårlig** i vann?',
      buckets: ['Løses godt', 'Løses dårlig'],
      items: [
        { t: 'Sukker', b: 0 },
        { t: 'Bordsalt', b: 0 },
        { t: 'Matolje', b: 1 },
        { t: 'Etanol', b: 0 },
        { t: 'Stearin', b: 1 },
        { t: 'Bensin', b: 1 },
        { t: 'Eddiksyre', b: 0 },
      ],
      explain: '«Likt løser likt.» Vann er polart og løser salter (ioner) og polare molekyler med OH-grupper (sukker, etanol, eddiksyre), fordi de kan danne sterke bindinger til vannmolekylene. Olje, stearin og bensin er lange, upolare hydrokarbonkjeder som ikke vekselvirker godt med vann.',
    },
    {
      id: 'stoffer.los.05', region: R, topic: T_LOS, concepts: ['loselighet', 'elektronegativitet', 'molekyl'], level: 4, type: 'mc',
      prompt: 'Rent vann fjerner ikke en fettflekk på genseren, men såpevann gjør det. Hvorfor?',
      options: [
        'Såpemolekylene har en upolar hale som løses i fettet og en polar/ladd ende som løses i vannet',
        'Såpe gjør vannet varmere, slik at fettet smelter',
        'Såpe reagerer kjemisk med fettet og gjør det om til vann',
        'Såpe gjør vannmolekylene mindre, slik at de kommer inn i fettet',
      ],
      answer: 0,
      why: {
        1: 'Såpe endrer ikke temperaturen merkbart. Det virker også i kaldt vann.',
        2: 'Fettet blir ikke til vann. Det pakkes inn i små kuler (miceller) og skylles bort.',
        3: 'Molekyler endrer ikke størrelse. Det er såpemolekylets to ulike ender som gjør jobben.',
      },
      myth: 'myte.atomer-har-stoffets-egenskaper',
      explain: 'Fett er upolart og blander seg ikke med polart vann. Såpemolekylet er en «bro»: den lange hydrokarbonhalen løses i fettet, mens den ladde enden peker ut i vannet. Fettdråpene omgis av såpe (miceller) og følger med skyllevannet.',
    },
    {
      id: 'stoffer.los.06', region: R, topic: T_LOS, concepts: ['loselighet', 'partikkelmodellen', 'massebevaringsloven'], level: 3, type: 'mc',
      myth: 'myte.stoff-forsvinner',
      prompt: 'Du rører en teskje sukker ut i te til du ikke ser det lenger. Hva har skjedd med sukkeret?',
      options: [
        'Sukkermolekylene har spredt seg mellom vannmolekylene og er for små til å sees',
        'Sukkeret har smeltet på grunn av den varme teen',
        'Sukkeret har forsvunnet, men smaken er igjen',
        'Sukkeret har reagert med vannet og blitt et nytt stoff',
      ],
      answer: 0,
      why: {
        1: 'Smelting er overgang fra fast stoff til væske for ett stoff og krever 186 °C for sukker. Her fordeler sukkeret seg i vannet – det er oppløsning.',
        2: 'Smaken er selve evidensen for at sukkeret fortsatt er der. Massen av teen har også økt med massen av sukkeret.',
        3: 'Det dannes ikke noe nytt stoff. Damp inn teen, og sukkeret kommer tilbake.',
      },
      explain: 'Ved oppløsning løsner sukkermolekylene fra krystallen og omgis av vannmolekyler. Partiklene er bevart: massen er summen av te og sukker, og løsningen smaker søtt. Hverdagsuttrykket «sukkeret smelter» er et godt utgangspunkt for å skille smelting og oppløsning.',
    },
    {
      id: 'stoffer.los.07', region: R, topic: T_LOS, concepts: ['loselighet', 'ion', 'kjemiens-tre-nivaer'], level: 4, type: 'mc',
      prompt: 'Hvilken partikkeltegning viser best en løsning av bordsalt i vann?',
      options: [
        'Na⁺- og Cl⁻-ioner hver for seg, omgitt av vannmolekyler som vender O-siden mot Na⁺ og H-siden mot Cl⁻',
        'Små NaCl-molekyler som svømmer rundt mellom vannmolekylene',
        'Små saltkorn som flyter mellom vannmolekylene',
        'Tomrom der saltet var, fordi saltet har forsvunnet',
      ],
      answer: 0,
      why: {
        1: 'Salt består ikke av molekyler. Gitteret løses opp i enkeltioner.',
        2: 'Saltkorn er makronivå. På mikronivå er kornene løst opp i enkeltioner – tegningen blander nivåene.',
        3: 'Saltet er der fortsatt, som ioner. Massen og den salte smaken viser det.',
      },
      myth: 'myte.salt-er-molekyler',
      explain: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq). Den negative O-enden av vannmolekylet trekkes mot Na⁺, og de positive H-ene mot Cl⁻. Sukker løses derimot som hele molekyler. Forskjellen viser seg på makronivå: saltvann leder strøm, sukkervann gjør det ikke.',
    },
  ]);

  /* =====================================================================
     FASER OG PARTIKKELMODELLEN
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.fase.01', region: R, topic: T_FASE, concepts: ['partikkelmodellen', 'partikkel'], level: 1, type: 'mc',
      prompt: 'Hva er kjernen i **partikkelmodellen**?',
      options: [
        'Alle stoffer består av små partikler som alltid er i bevegelse',
        'Alle stoffer består av små korn som ligger i ro',
        'Bare gasser består av partikler; faste stoffer er sammenhengende',
        'Partiklene i et stoff har samme egenskaper som stoffet',
      ],
      answer: 0,
      why: {
        1: 'Partiklene står aldri helt i ro. Selv i et fast stoff vibrerer de.',
        2: 'Alle faser består av partikler – forskjellen er avstand og bevegelse.',
        3: 'Partiklene har ikke stoffets makroegenskaper. Et vannmolekyl er ikke vått, og et jernatom ruster ikke.',
      },
      explain: 'Nøkkelarket: stoffer er bygd opp av partikler – atomer, ioner eller molekyler – som alltid er i bevegelse. Jo høyere temperatur, jo raskere bevegelse. Mellom partiklene er det tomt rom.',
    },
    {
      id: 'stoffer.fase.02', region: R, topic: T_FASE, concepts: ['fast-stoff', 'vaeske', 'gass'], level: 2, type: 'sort',
      prompt: 'Hvilken fase beskrives?',
      buckets: ['Fast stoff', 'Væske', 'Gass'],
      items: [
        { t: 'Partiklene vibrerer om faste plasser', b: 0 },
        { t: 'Har egen form og eget volum', b: 0 },
        { t: 'Partiklene glir forbi hverandre, men holder sammen', b: 1 },
        { t: 'Har fast volum, men tar form etter beholderen', b: 1 },
        { t: 'Partiklene farer fritt med store avstander', b: 2 },
        { t: 'Fyller hele beholderen og kan presses sammen', b: 2 },
      ],
      explain: 'Fast stoff: tett, ordnet, vibrasjon. Væske: nesten like tett, men partiklene kan flytte på seg. Gass: store avstander og fri bevegelse, derfor kan gassen presses sammen. Overgangene skyldes at partiklene får nok energi til å overvinne kreftene som holder dem sammen.',
    },
    {
      id: 'stoffer.fase.03', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'partikkelmodellen', 'fase'], level: 3, type: 'order',
      prompt: 'Du varmer is fra −10 °C til vanndamp. Ordne beskrivelsene på partikkelnivå i riktig rekkefølge.',
      items: [
        'Molekylene vibrerer stadig raskere om faste plasser i isen',
        'Molekylene får nok energi til å løsne fra plassene sine – isen smelter',
        'Molekylene glir forbi hverandre og beveger seg raskere når temperaturen stiger',
        'Molekyler river seg løs inne i væsken og danner gassbobler – vannet koker',
        'Molekylene farer fritt rundt med store avstander – vanndamp',
      ],
      explain: 'Under oppvarming øker bevegelsen (temperaturen stiger). Ved smelting og koking går energien til å løsne molekylene fra hverandre, så temperaturen står stille. Molekylene er H₂O hele veien – det er bevegelse og avstand som endres.',
    },
    {
      id: 'stoffer.fase.04', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'gass', 'fase'], level: 3, type: 'mc',
      myth: 'myte.bobler-er-luft',
      prompt: 'Hva er inni de store boblene i vann som koker?',
      options: [
        'Vanndamp – vannmolekyler i gassfase',
        'Luft som har vært oppløst i vannet',
        'Hydrogengass og oksygengass fra vannmolekyler som er spaltet',
        'Ingenting – boblene er tomrom',
      ],
      answer: 0,
      why: {
        1: 'Litt oppløst luft kommer ut som små bobler tidlig i oppvarmingen, men den er snart borte. Vann som har kokt lenge, bobler fortsatt.',
        2: 'Å spalte vann krever mye mer energi (f.eks. elektrolyse). Vanndamp kondenserer til vann igjen, så molekylene er intakte.',
        3: 'Boblene er fylt med gass som presser mot vannet rundt – ellers ville de klappet sammen.',
      },
      explain: 'Ved kokepunktet får så mange molekyler nok energi at det dannes damplommer inne i væsken. Boblene vokser og stiger. Mange elever (og voksne) tror boblene er luft eller H₂ og O₂ – et klassisk eksempel på at faseovergang blandes med kjemisk reaksjon.',
    },
    {
      id: 'stoffer.fase.05', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'gass', 'vaeske'], level: 3, type: 'mc',
      myth: 'myte.kondens-siver-ut',
      prompt: 'En flaske tas ut av kjøleskapet, og etter litt er den dekket av små dråper på utsiden. Hvor kommer vannet fra?',
      options: [
        'Vanndamp i lufta kondenserer når den treffer den kalde flaska',
        'Vann fra innsiden siver ut gjennom glasset',
        'Kulda fra flaska blir til vann på overflaten',
        'Oksygen og hydrogen i lufta reagerer og danner vann på den kalde flaska',
      ],
      answer: 0,
      why: {
        1: 'Glass er tett. Dråpene dannes også på en tom, kald flaske, og de er fargeløse selv om flaska inneholder saft.',
        2: 'Kulde er ikke et stoff og kan ikke bli til vann. Den kalde flaska tar opp energi fra vanndampen.',
        3: 'Det er ikke en reaksjon. Vannmolekylene finnes allerede i lufta som usynlig vanndamp.',
      },
      explain: 'Lufta inneholder alltid vanndamp. Når vannmolekyler treffer den kalde overflaten, avgir de energi, beveger seg langsommere og holdes sammen som væske. Det samme skjer med dugg på gresset og når brilleglassene dugger.',
    },
    {
      id: 'stoffer.fase.06', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'kjemisk-reaksjon'], level: 1, type: 'tf',
      myth: 'myte.faseovergang-er-reaksjon',
      prompt: 'Når is smelter, dannes det et nytt stoff.',
      answer: false,
      explain: 'Usant. Is og flytende vann er begge H₂O. Smelting er en faseovergang: molekylene løsner fra de faste plassene, men selve molekylene er de samme. Fryser du vannet igjen, får du is med de samme egenskapene.',
    },
    {
      id: 'stoffer.fase.07', region: R, topic: T_FASE, concepts: ['partikkelmodellen', 'gass'], level: 3, type: 'mc',
      myth: 'myte.luft-mellom-partiklene',
      prompt: 'Hva er det **mellom** molekylene i en gass, for eksempel i lufta?',
      options: ['Tomt rom', 'Luft', 'Vanndamp', 'Varme'],
      answer: 0,
      why: {
        1: 'Luft er selv et stoff som består av molekyler (N₂, O₂ …). Hva skulle da være mellom luftmolekylene?',
        2: 'Vanndamp er også molekyler. Det kan finnes vannmolekyler i lufta, men mellom alle molekylene er det tomrom.',
        3: 'Varme er ikke et stoff som fyller rommet. Varme er energioverføring, og termisk energi er knyttet til partiklenes bevegelse.',
      },
      explain: 'I en gass utgjør selve molekylene bare omtrent 0,1 % av volumet. Resten er tomt rom. Ideen om tomrom er en av de vanskeligste delene av partikkelmodellen – mange elever fyller tomrommet med «luft».',
    },
    {
      id: 'stoffer.fase.08', region: R, topic: T_FASE, concepts: ['partikkelmodellen', 'faseovergang-partikler', 'kjemiens-tre-nivaer'], level: 4, type: 'mc',
      myth: 'myte.atomer-har-stoffets-egenskaper',
      prompt: 'En elev sier: «Vanndamp tar mye mer plass enn vann fordi vannmolekylene blåses opp når de varmes.» Hvilken forklaring er riktig?',
      options: [
        'Molekylene er like store; det er avstanden mellom dem som øker kraftig',
        'Eleven har rett: molekylene utvider seg når de får mer energi',
        'Molekylene deler seg i flere mindre molekyler, som tar mer plass',
        'Det kommer luft inn mellom vannmolekylene når vannet koker',
      ],
      answer: 0,
      why: {
        1: 'Utvidelse er en makroegenskap ved stoffet. Den forklares med større avstand mellom partiklene, ikke større partikler.',
        2: 'Molekylene deler seg ikke. Vanndamp er fortsatt H₂O.',
        3: 'Mellom gassmolekylene er det tomrom, ikke luft.',
      },
      explain: 'Ved 100 °C tar vanndamp ca. 1700 ganger så stort volum som flytende vann. Molekylene har samme størrelse, men beveger seg fritt med store avstander. Elever overfører ofte makroegenskaper (utvidelse) til enkeltpartiklene.',
    },
    {
      id: 'stoffer.fase.09', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'partikkelmodellen', 'faseovergang-energi'], level: 4, type: 'mc',
      myth: 'myte.faseovergang-er-reaksjon',
      prompt: 'Vann på kokeplata står på 100 °C så lenge det koker, selv om plata stadig tilfører energi. Hva skjer med energien på partikkelnivå?',
      options: [
        'Den brukes til å trekke molekylene fra hverandre, ikke til å øke farten deres',
        'Den brukes til å spalte vannmolekylene til hydrogen og oksygen',
        'Den forsvinner, fordi vann ikke kan ta imot mer energi',
        'Den går inn i termometeret, som ikke klarer å vise mer enn 100 °C',
      ],
      answer: 0,
      why: {
        1: 'Vannmolekylene spaltes ikke ved koking. Dampen kondenserer tilbake til vann.',
        2: 'Energi forsvinner ikke. Den går med til å løsne molekylene og følger med dampen ut.',
        3: 'Termometeret virker fint. Varmer du dampen videre, stiger temperaturen over 100 °C.',
      },
      explain: 'Temperatur henger sammen med molekylenes gjennomsnittlige bevegelsesenergi. Under kokingen går energien til å bryte bindingene mellom molekylene (økt potensiell energi), så farten – og temperaturen – står stille til alt vannet er fordampet.',
    },
    {
      id: 'stoffer.fase.10', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'fast-stoff', 'gass'], level: 4, type: 'mc',
      prompt: 'Klesvask som henger ute i −10 °C, blir tørr etter noen dager, selv om den frøs stiv. Hvordan er det mulig?',
      options: [
        'Isen sublimerer: vannmolekyler river seg løs fra iskrystallene og går rett over til vanndamp',
        'Kulda suger vannet ut av klærne',
        'Isen smelter litt hver dag fordi kroppstemperaturen til klypene varmer',
        'Vannet fryser bort – is forsvinner etter en stund',
      ],
      answer: 0,
      why: {
        1: 'Kulde er ikke noe som virker aktivt. Det er vannmolekylene selv som forlater isen.',
        2: 'Klesklyper har lufttemperaturen. Isen smelter ikke i −10 °C.',
        3: 'Is «forsvinner» ikke – molekylene går over i lufta som usynlig vanndamp.',
      },
      explain: 'Også i is har noen molekyler nok energi til å rive seg løs fra overflaten. I tørr, kald luft går de rett over til gass – sublimasjon. Det motsatte, deposisjon, ser vi som rimfrost. Tørris (fast CO₂) sublimerer ved −78 °C.',
    },
    {
      id: 'stoffer.fase.11', region: R, topic: T_FASE, concepts: ['partikkelmodellen', 'gass', 'massebevaringsloven'], level: 4, type: 'mc',
      prompt: 'En oppblåst ballong legges i fryseren og blir mindre. Hva er forklaringen på partikkelnivå?',
      options: [
        'Luftmolekylene beveger seg saktere og støter sjeldnere og svakere mot ballongveggen innenfra',
        'Noe av lufta forsvinner i kulda',
        'Luftmolekylene krymper når de blir kalde',
        'Kulda presser ballongen sammen utenfra',
      ],
      answer: 0,
      why: {
        1: 'Antall molekyler og massen er den samme. Tar du ballongen ut, blir den like stor som før.',
        2: 'Molekylene endrer ikke størrelse. Det er avstanden mellom dem som minker.',
        3: 'Kulde er ikke en kraft. Lufttrykket utenfor er omtrent det samme – det er trykket innenfra som synker.',
      },
      myth: 'myte.atomer-har-stoffets-egenskaper',
      explain: 'Lavere temperatur betyr lavere gjennomsnittsfart. Færre og svakere støt mot ballongveggen gir lavere trykk inne, og ballongen trekker seg sammen til trykket balanserer igjen. Massen er bevart – ballongen veier det samme.',
    },
    {
      id: 'stoffer.fase.12', region: R, topic: T_FASE, concepts: ['vaeske', 'partikkelmodellen', 'gass'], level: 5, type: 'mc',
      prompt: 'Ida tegner partiklene i vann med store avstander mellom seg «fordi vann renner». Hvilken aktivitet gir henne best **evidens** til å revurdere tegningen?',
      options: [
        'Presse stempelet i to tette sprøyter, en med luft og en med vann – vannet lar seg nesten ikke presse sammen',
        'Si at tegningen er feil og vise lærebokas figur',
        'La henne helle vann mellom to glass og observere at det renner',
        'Forklare at avstanden mellom partiklene ikke er viktig i modellen',
      ],
      answer: 0,
      why: {
        1: 'Fasit uten evidens gir lite grunnlag for begrepsendring – hun vet ikke hvorfor lærebokas figur er bedre enn hennes.',
        2: 'At vann renner, er nettopp det som har ledet henne til tegningen. Det tester ikke avstanden.',
        3: 'Avstanden er sentral: den forklarer hvorfor gasser kan presses sammen og væsker ikke.',
      },
      explain: 'En god grubletegning blir et utgangspunkt for undersøkelse. Sprøyteforsøket kobler makro (vann kan ikke presses sammen) til mikro (partiklene ligger tett). At vann renner, forklares med at partiklene kan gli forbi hverandre – ikke med store avstander.',
    },
    {
      id: 'stoffer.fase.13', region: R, topic: T_FASE, concepts: ['faseovergang-partikler', 'gass', 'vaeske'], level: 5, type: 'mc',
      myth: 'myte.kondens-siver-ut',
      prompt: 'Flere elever mener at dråpene utenpå en kald brusflaske har sivet ut gjennom glasset. Hvilket forsøk gir den sterkeste evidensen mot denne ideen?',
      options: [
        'Fylle en flaske med isvann farget med konditorfarge og vise at dråpene utenpå er fargeløse',
        'Tørke flaska og vise at nye dråper kommer igjen',
        'Veie flaska før og etter, for å vise at den har blitt lettere',
        'Sette en flaske med romtemperert vann ved siden av og vise at den ikke dugger',
      ],
      answer: 0,
      why: {
        1: 'At dråpene kommer igjen, passer like godt med elevenes idé om at vann siver ut.',
        2: 'Flaska blir faktisk litt tyngre, fordi vann fra lufta legger seg på den. Men forskjellen er liten og vanskelig å måle i klasserommet.',
        3: 'Viser at temperaturen betyr noe, men utelukker ikke at kaldt vann «siver». Det er et godt tilleggsforsøk, men ikke det sterkeste.',
      },
      explain: 'Farget innhold og fargeløse dråper er direkte evidens for at vannet ikke kommer innenfra. Da må det komme fra lufta. Kombiner gjerne med en tom, kald flaske. Elevene bygger påstand–evidens–begrunnelse: vanndamp i lufta kondenserer på den kalde overflaten.',
    },
  ]);

  /* =====================================================================
     MASSEBEVARING
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.masse.01', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'kjemisk-reaksjon'], level: 1, type: 'tf',
      prompt: 'I en kjemisk reaksjon er den totale massen av produktene lik den totale massen av utgangsstoffene.',
      answer: true,
      explain: 'Sant – massebevaringsloven. Atomene forsvinner ikke og skapes ikke; de settes bare sammen på nye måter. Når vekta likevel viser en endring, er det fordi en gass har sluppet ut eller blitt tatt opp fra lufta.',
    },
    {
      id: 'stoffer.masse.02', region: R, topic: T_MASSE, concepts: ['gass', 'massebevaringsloven'], level: 2, type: 'tf',
      myth: 'myte.gass-er-vektlos',
      prompt: 'En liter luft ved romtemperatur veier omtrent 1,2 gram.',
      answer: true,
      explain: 'Sant. Lufta i et klasserom på 200 m³ veier rundt 240 kg. Gasser har masse fordi de består av molekyler med masse – de er bare spredt utover et stort volum.',
    },
    {
      id: 'stoffer.masse.03', region: R, topic: T_MASSE, concepts: ['gass', 'massebevaringsloven', 'partikkelmodellen'], level: 4, type: 'mc',
      myth: 'myte.gass-er-vektlos',
      prompt: 'En slapp fotball ligger på en nøyaktig vekt. Du pumper den hard. Hva skjer med vekta?',
      options: [
        'Den viser noen gram mer, fordi det er presset inn mer luft',
        'Den viser det samme, fordi luft ikke har masse',
        'Den viser mindre, fordi luft gjør ting lettere',
        'Den viser det samme, fordi lufta bare presses sammen',
      ],
      answer: 0,
      why: {
        1: 'Luft har masse: ca. 1,2 g per liter ved vanlig trykk.',
        2: 'Hverdagserfaring med ballonger som «stiger» gir denne ideen. En heliumballong stiger fordi helium er lettere enn lufta rundt, ikke fordi gass er negativt tung.',
        3: 'Sammenpresset luft har like mye masse som før – og her er det pumpet inn flere molekyler.',
      },
      explain: 'Pumpa presser flere luftmolekyler inn i ballen. En fotball på ca. 5,5 L med ca. 0,8 bar overtrykk inneholder ca. 4–5 L ekstra luft regnet ved vanlig trykk – rundt 5 g. Små endringer, men målbare – et fint forsøk mot misoppfatningen om at gass er vektløs.',
    },
    {
      id: 'stoffer.masse.04', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'gass', 'produkt'], level: 4, type: 'num',
      prompt: 'Et åpent begerglass med eddik og 8,4 g natron veier totalt 158,4 g. All natronen reagerer, og det dannes 4,4 g CO₂ som slipper ut i rommet. Hva viser vekta etterpå?',
      answer: 154.0, abs: 0.05, unit: 'g', hint: 'Hvilket produkt forlater systemet?',
      explain: '158,4 g − 4,4 g = 154,0 g. Massen er ikke borte: CO₂-molekylene har forlatt begerglasset. I en lukket flaske ville vekta vist 158,4 g hele tiden. (NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂.)',
    },
    {
      id: 'stoffer.masse.05', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'reaksjonslikning', 'utgangsstoff'], level: 4, type: 'num',
      prompt: '4,0 g hydrogengass reagerer fullstendig med 32,0 g oksygengass: 2H₂ + O₂ → 2H₂O. Hvor mange gram vann dannes?',
      answer: 36.0, abs: 0.1, unit: 'g',
      explain: 'Alle atomene i utgangsstoffene havner i vannet, så massen blir 4,0 g + 32,0 g = 36,0 g. Det stemmer med molare masser: 2 mol H₂ (4 g) + 1 mol O₂ (32 g) → 2 mol H₂O (2 · 18 g).',
    },
    {
      id: 'stoffer.masse.06', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'produkt', 'gass'], level: 4, type: 'mc',
      myth: 'myte.masse-forsvinner-ved-brenning',
      prompt: 'Et stearinlys står på en vekt og brenner i en time. Vekta viser at lyset har blitt lettere. Hvor ble det av massen?',
      options: [
        'Den finnes i CO₂ og vanndamp som har forsvunnet ut i rommet',
        'Massen er omdannet til lys og varme',
        'Stearinet er brent opp og finnes ikke lenger',
        'Stearinet har smeltet og fordampet uten å reagere',
      ],
      answer: 0,
      why: {
        1: 'I kjemiske reaksjoner er masseendringen fra energiutvekslingen helt neglisjerbar (milliarddeler av et gram). E = mc² merkes først i kjernereaksjoner.',
        2: '«Brent opp» er hverdagsspråk. Atomene i stearinet finnes i produktene CO₂ og H₂O.',
        3: 'Det meste av stearinet reagerer med oksygen i flammen. Smeltet stearin som renner ned, blir på vekta.',
      },
      explain: 'Stearin (karbon og hydrogen) + O₂ → CO₂ + H₂O. Produktene er usynlige gasser som forlater vekta. Massen av produktene er faktisk større enn massen av stearinet som brant, fordi oksygen fra lufta er med. Hold et kaldt glass over flammen, og vanndampen kondenserer.',
    },
    {
      id: 'stoffer.masse.07', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'kjemisk-reaksjon', 'utgangsstoff'], level: 5, type: 'mc',
      myth: 'myte.masse-forsvinner-ved-brenning',
      prompt: 'Stålull brennes på en vekt, og vekta viser at massen **øker**. En elev sier: «Det må være sot fra flammen som legger seg på.» Hvilken oppfølging er best?',
      options: [
        'Spørre hvor nye atomer kan komme fra, og la elevene teste ideen om at jernet binder oksygen fra lufta – f.eks. ved å brenne stålull i et lukket glass på vekta',
        'Forklare at brenning alltid gjør stoffer tyngre',
        'Forklare at jernet utvider seg når det blir varmt, og derfor blir tyngre',
        'Si at varmen fra brenningen har masse som blir igjen i stålulla',
      ],
      answer: 0,
      why: {
        1: 'Overgeneralisering: et stearinlys blir lettere når det brenner. Det avgjørende er om produktene er gasser som forsvinner, eller faste stoffer som blir igjen.',
        2: 'Utvidelse endrer volumet, ikke massen. Dessuten øker massen også etter at stålulla er avkjølt.',
        3: 'Varme er energioverføring, ikke et stoff med masse.',
      },
      explain: 'Jern + oksygen → jernoksid. Oksygenatomene fra lufta bindes til jernet og blir igjen som fast stoff, så massen øker. I et lukket glass står vekta stille: oksygenet som bindes, var allerede med på vekta. Elevens hypotese (sot) er god å teste – stålull tent med et 9 V-batteri, uten noen flamme som kan sote, gir samme økning.',
    },
    {
      id: 'stoffer.masse.08', region: R, topic: T_MASSE, concepts: ['massebevaringsloven', 'gass', 'kjemisk-reaksjon'], level: 5, type: 'mc',
      prompt: 'Elevene skal vise at massen er bevart når natron og eddik reagerer. Hvilket oppsett gir best evidens?',
      options: [
        'En flaske med eddik og en ballong med natron over åpningen, veid før og etter at natronen drysses ned',
        'Et åpent begerglass på vekta, med natron og eddik blandet',
        'Veie produktene etter reaksjonen og sammenligne med utgangsstoffene veid hver for seg',
        'Bruke ti ganger så mye natron og eddik, så målefeilen blir relativt mindre',
      ],
      answer: 0,
      why: {
        1: 'I et åpent system slipper CO₂ ut, og vekta viser mindre. Det kan forsterke ideen om at masse forsvinner.',
        2: 'Gassen er også et produkt. Uten et lukket system får du ikke veid den.',
        3: 'Mer stoff gir mer gass som slipper ut. Problemet er det åpne systemet, ikke målefeilen.',
      },
      explain: 'Et lukket system holder på alle atomene, også dem i gassen. Ballongen fylles med CO₂, men vekta viser det samme. Sammenlign gjerne med det åpne begerglasset: forskjellen er massen av gassen som slapp ut. (Pass på at ballongen ikke blir for stor – oppdriften fra lufta kan gi et lite utslag.)',
    },
  ]);

  /* =====================================================================
     KJEMISKE REAKSJONER
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.reak.01', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'produkt'], level: 1, type: 'mc',
      prompt: 'Hva kjennetegner en **kjemisk reaksjon**?',
      options: [
        'Det dannes nye stoffer med andre egenskaper enn utgangsstoffene',
        'Stoffet skifter fase, for eksempel fra fast stoff til væske',
        'Stoffet løses opp og blir usynlig',
        'Det blir varmt',
      ],
      answer: 0,
      why: {
        1: 'Faseoverganger gir ikke nye stoffer – is og vann er begge H₂O.',
        2: 'Oppløsning er en fysisk endring. Sukkeret er fortsatt sukker.',
        3: 'Mange reaksjoner frigjør varme, men noen tar opp varme. Varmeutvikling alene beviser heller ikke reaksjon – en kokeplate blir også varm.',
      },
      explain: 'Utgangsstoffer → produkter. Bindinger brytes og nye dannes, og atomene settes sammen på nye måter. Det er de nye egenskapene (farge, løselighet, brennbarhet …) som avslører at nye stoffer er dannet.',
    },
    {
      id: 'stoffer.reak.02', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'atom', 'produkt'], level: 1, type: 'tf',
      prompt: 'Produktene i en kjemisk reaksjon inneholder de samme atomene som utgangsstoffene, bare satt sammen på nye måter.',
      answer: true,
      explain: 'Sant – slik står det på nøkkelarket. I en kjemisk reaksjon endres ikke atomkjernene, så ingen atomer blir til andre grunnstoffer. Derfor er massen bevart, og derfor må reaksjonslikninger balanseres.',
    },
    {
      id: 'stoffer.reak.03', region: R, topic: T_REAK, concepts: ['utgangsstoff', 'produkt', 'reaksjonslikning'], level: 2, type: 'mc',
      prompt: 'Hva er **utgangsstoffene** i reaksjonen 2H₂ + O₂ → 2H₂O?',
      options: ['Hydrogengass og oksygengass', 'Vann', 'Hydrogengass, oksygengass og vann', 'Hydrogenatomer og oksygenatomer hver for seg'],
      answer: 0,
      why: {
        1: 'Vann står til høyre for pilen. Det er produktet.',
        2: 'Pilen skiller utgangsstoffer (venstre) fra produkter (høyre).',
        3: 'Formlene H₂ og O₂ viser at hydrogen og oksygen foreligger som toatomige molekyler, ikke frie atomer.',
      },
      explain: 'Utgangsstoffene står til venstre for pilen, produktene til høyre. Her reagerer hydrogengass (H₂) og oksygengass (O₂) og danner vann. Reaksjonen frigjør mye energi – den driver hydrogenbiler og rakettmotorer.',
    },
    {
      id: 'stoffer.reak.04', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'produkt', 'egenskap'], level: 3, type: 'multi',
      prompt: 'Du blander to stoffer. Hvilke observasjoner kan **tyde på** at det har skjedd en kjemisk reaksjon?',
      options: [
        'Det dannes gassbobler',
        'Det oppstår en ny farge',
        'Det dannes et fast bunnfall i en klar løsning',
        'Det ene stoffet blir usynlig i det andre',
        'Blandingen har en farge midt mellom de to stoffene',
      ],
      answer: [0, 1, 2],
      explain: 'Gass, ny farge, bunnfall, lys og temperaturendring er tegn på at nye stoffer kan ha blitt dannet. Det er tegn, ikke bevis – kokende vann bobler også. Å bli usynlig er typisk for oppløsning, og en mellomfarge er typisk for en blanding.',
    },
    {
      id: 'stoffer.reak.05', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'partikkelmodellen'], level: 3, type: 'mc',
      prompt: 'Stålull tar lett fyr i en flamme, mens en jernspiker bare blir varm. Hva er hovedgrunnen?',
      options: [
        'Stålulla har mye større overflate, så langt flere jernatomer kan treffes av oksygenmolekyler samtidig',
        'Stålull er laget av et annet grunnstoff enn spikeren',
        'Spikeren inneholder mindre oksygen enn stålulla',
        'Stålullatomene er mindre og lettere å antenne',
      ],
      answer: 0,
      why: {
        1: 'Begge er i hovedsak jern. Forskjellen er hvor finfordelt jernet er.',
        2: 'Oksygenet kommer fra lufta, ikke fra jernet.',
        3: 'Jernatomene er like store i begge. Det er mengden atomer i overflaten som er forskjellig.',
      },
      explain: 'Reaksjoner skjer når partikler kolliderer. Finfordeling gir mer overflate og flere kollisjoner per sekund. De tynne trådene varmes også raskt opp. Det samme forklarer støveksplosjoner i møller og at knust tablett virker raskere.',
    },
    {
      id: 'stoffer.reak.06', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'partikkelmodellen', 'temperatur'], level: 4, type: 'mc',
      prompt: 'Hvorfor holder melk seg lenger i kjøleskapet enn på kjøkkenbenken? Svar på partikkelnivå.',
      options: [
        'Ved lav temperatur beveger partiklene seg saktere, så færre kollisjoner har nok energi til å gi reaksjon',
        'Kulda dreper alle bakteriene i melka',
        'Kulda trekker inn i melka og stopper alle reaksjoner',
        'Melka fryser, og frosne stoffer kan ikke reagere',
      ],
      answer: 0,
      why: {
        1: 'De fleste bakterier overlever i kjøleskapet – de bare formerer seg mye langsommere fordi reaksjonene i dem går saktere.',
        2: 'Kulde er ikke noe som strømmer inn. Melka avgir energi til omgivelsene og får lavere temperatur. Reaksjonene går saktere, men stopper ikke.',
        3: 'Melka fryser ikke ved ca. 4 °C. Dessuten reagerer også frosne matvarer, bare svært sakte.',
      },
      explain: 'Reaksjonsfarten øker med temperaturen fordi partiklene beveger seg raskere og kolliderer oftere og hardere. Lavere temperatur gir færre kollisjoner med nok energi. En tommelfingerregel er at farten omtrent halveres for hver 10 °C nedkjøling.',
    },
    {
      id: 'stoffer.reak.07', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'kjemisk-energi', 'kovalent-binding'], level: 4, type: 'mc',
      myth: 'myte.bindingsbrudd-gir-energi',
      prompt: 'Når metan brenner (CH₄ + 2O₂ → CO₂ + 2H₂O), frigjøres mye energi. Hvor kommer energien fra?',
      options: [
        'Dannelsen av de sterke bindingene i CO₂ og H₂O frigjør mer energi enn det kostet å bryte bindingene i CH₄ og O₂',
        'Energien er lagret i bindingene i metan og slippes fri når de brytes',
        'Energien kommer fra fyrstikka som tenner gassen',
        'Energien skapes i reaksjonen når de nye stoffene dannes fra ingenting',
      ],
      answer: 0,
      why: {
        1: 'Å bryte en binding krever alltid energi. «Energi lagret i bindinger» er en svært vanlig misoppfatning, også i lærebøker.',
        2: 'Fyrstikka gir bare aktiveringsenergien som skal til for å starte reaksjonen. Den frigjorte energien er mye større.',
        3: 'Energi kan ikke skapes. Den frigjorte energien er forskjellen i kjemisk energi mellom utgangsstoffene og produktene.',
      },
      explain: 'Eksoterm reaksjon: bindingsbrudd koster energi, bindingsdannelse frigjør energi. Bindingene i CO₂ og H₂O er sterkere enn dem i CH₄ og O₂, så nettoresultatet er at energi frigjøres som varme og lys. Den kjemiske energien tilhører hele systemet, ikke metanmolekylet alene.',
    },
    {
      id: 'stoffer.reak.08', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'produkt', 'utgangsstoff'], level: 3, type: 'mc',
      prompt: 'Hva menes med at en kjemisk reaksjon er i **likevekt**?',
      options: [
        'Reaksjonen går begge veier like raskt, så mengdene av stoffene holder seg konstante',
        'Reaksjonen har stoppet helt opp',
        'Det er like mye produkter som utgangsstoffer',
        'Det er like mange atomer av hvert slag på begge sider av pilen',
      ],
      answer: 0,
      why: {
        1: 'Likevekt er dynamisk: begge reaksjonene pågår hele tiden, bare like raskt.',
        2: 'Mengdene er konstante, men ikke nødvendigvis like. Likevekten kan ligge langt mot produktsiden eller utgangsstoffsiden.',
        3: 'Det er en balansert reaksjonslikning, som gjelder alle reaksjoner. Ordet «likevekt» betyr noe annet.',
      },
      explain: 'I en likevekt (⇌) dannes produktene like raskt som de omdannes tilbake til utgangsstoffer. På makronivå ser alt stille ut, på mikronivå er det full aktivitet. Et eksempel er CO₂ i en lukket brusflaske: CO₂ går stadig mellom gassen og væsken.',
    },
    {
      id: 'stoffer.reak.09', region: R, topic: T_REAK, concepts: ['kjemisk-reaksjon', 'massebevaringsloven', 'utgangsstoff'], level: 3, type: 'order',
      prompt: 'Klassen undersøker: «Endrer massen seg når stålull brenner?» Ordne trinnene i et utforskende opplegg.',
      items: [
        'Formulere spørsmålet og en hypotese: massen øker fordi jern binder oksygen fra lufta',
        'Planlegge: stålull i en skål på vekta, samme vekt og samme mengde hele veien',
        'Veie stålulla før tenning og registrere massen',
        'Tenne stålulla, la den brenne ut og veie igjen',
        'Bearbeide og forklare: sammenligne resultatet med hypotesen og partikkelmodellen',
        'Formidle funnene og diskutere feilkilder og nye spørsmål',
      ],
      explain: 'Utforskingsmodellen: spørsmål og hypotese → planlegge → samle data → bearbeide og forklare → formidle. Hypotesen gir en forutsigelse som kan testes. Feilkilder (biter som faller av, sot fra fyrstikk) og nye spørsmål («hva om glasset er lukket?») tar utforskingen videre.',
    },
  ]);

  /* =====================================================================
     REAKSJONSLIKNINGER OG MOLAR MASSE
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.likn.01', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'molekyl'], level: 2, type: 'mc',
      prompt: 'I uttrykket 2H₂O: hva betyr det store **2-tallet foran**, og hva betyr den lille **₂-en etter H**?',
      options: [
        'Foran: to vannmolekyler. Etter H: to hydrogenatomer i hvert molekyl',
        'Foran: to hydrogenatomer. Etter H: to vannmolekyler',
        'Begge betyr at det er to oksygenatomer',
        'Foran: vannet er dobbelt så tungt. Etter H: to hydrogenmolekyler',
      ],
      answer: 0,
      why: {
        1: 'Rollene er byttet om. Koeffisienten foran gjelder hele formelen; indeksen gjelder bare atomet foran seg.',
        2: 'Det finnes bare ett O-atom per vannmolekyl. 2H₂O har til sammen to O-atomer fordi det er to molekyler.',
        3: 'Koeffisienten er et antall, ikke en masse. Og hvert vannmolekyl har to H-atomer, ikke H₂-molekyler.',
      },
      explain: 'Koeffisienten (foran) teller molekyler eller formelenheter. Indeksen (nede) forteller hvor mange atomer av et slag hvert molekyl har, og bestemmer hvilket stoff det er. 2H₂O = 2 molekyler = 4 H-atomer og 2 O-atomer.',
    },
    {
      id: 'stoffer.likn.02', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'massebevaringsloven'], level: 3, type: 'mc',
      myth: 'myte.indekser-kan-endres',
      prompt: 'Hydrogengass reagerer med oksygengass og danner vann. Hvilken likning er riktig **balansert**?',
      options: ['2H₂ + O₂ → 2H₂O', 'H₂ + O₂ → H₂O₂', 'H₂ + O → H₂O', 'H₂ + O₂ → 2H₂O'],
      answer: 0,
      why: {
        1: 'Atomene stemmer, men H₂O₂ er hydrogenperoksid – et helt annet stoff. Indeksene kan ikke endres for å balansere.',
        2: 'Oksygen finnes som O₂-molekyler i lufta. Likningen må vise stoffene slik de faktisk er.',
        3: 'Venstre side har 2 H, høyre side 4 H. Likningen er ikke balansert.',
      },
      explain: 'Venstre: 4 H og 2 O. Høyre: 2 · H₂O = 4 H og 2 O. Bare koeffisientene er endret. Balansering er massebevaringsloven skrevet med symboler: ingen atomer forsvinner eller skapes.',
    },
    {
      id: 'stoffer.likn.03', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'kjemisk-reaksjon'], level: 4, type: 'num',
      prompt: 'Balanser forbrenningen av metan:\nCH₄ + __ O₂ → CO₂ + 2H₂O\nHvilken koeffisient skal stå foran O₂?',
      answer: 2, abs: 0.1, unit: '', hint: 'Tell O-atomene på høyre side',
      explain: 'Høyre side har 2 O i CO₂ og 2 · 1 O i 2H₂O = 4 O. Det krever 2 O₂. Ferdig: CH₄ + 2O₂ → CO₂ + 2H₂O, med 1 C, 4 H og 4 O på hver side.',
    },
    {
      id: 'stoffer.likn.04', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'kjemisk-reaksjon'], level: 4, type: 'num',
      prompt: 'Propan i gassgrillen brenner:\nC₃H₈ + __ O₂ → 3CO₂ + 4H₂O\nHvilken koeffisient skal stå foran O₂?',
      answer: 5, abs: 0.1, unit: '', hint: 'Høyre side: 3 · 2 + 4 · 1 oksygenatomer',
      explain: 'Høyre side har 3 · 2 = 6 O i CO₂ og 4 · 1 = 4 O i vannet, til sammen 10 O. Det krever 5 O₂. Kontroll: 3 C, 8 H og 10 O på hver side.',
    },
    {
      id: 'stoffer.likn.05', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'produkt'], level: 3, type: 'num',
      prompt: 'Fotosyntesen:\n6CO₂ + 6H₂O → C₆H₁₂O₆ + __ O₂\nHvilken koeffisient skal stå foran O₂?',
      answer: 6, abs: 0.1, unit: '',
      explain: 'Venstre side: 6 · 2 + 6 · 1 = 18 O. Glukose har 6 O, så det mangler 12 O = 6 O₂. Merk at oksygenet som frigjøres, kommer fra vannet, ikke fra CO₂ – det viser isotopforsøk med oksygen-18.',
    },
    {
      id: 'stoffer.likn.06', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'atom', 'molekyl'], level: 2, type: 'num',
      prompt: 'Hvor mange **atomer** er det til sammen i 2H₂O?',
      answer: 6, abs: 0.1, unit: '',
      explain: 'Hvert vannmolekyl har 2 H + 1 O = 3 atomer. To molekyler gir 6 atomer: 4 H og 2 O.',
    },
    {
      id: 'stoffer.likn.07', region: R, topic: T_LIKN, concepts: ['reaksjonslikning'], level: 3, type: 'tf',
      myth: 'myte.indekser-kan-endres',
      prompt: 'Likningen H₂ + O₂ → H₂O kan balanseres ved å endre H₂O til H₂O₂.',
      answer: false,
      explain: 'Usant. Da har du endret produktet fra vann til hydrogenperoksid, et blekemiddel. Indeksene beskriver hvilket stoff det er og skal aldri endres. Riktig balansering: 2H₂ + O₂ → 2H₂O.',
    },
    {
      id: 'stoffer.likn.08', region: R, topic: T_LIKN, concepts: ['reaksjonslikning'], level: 3, type: 'sort',
      prompt: 'Gjelder utsagnet **koeffisienten** eller **indeksen**?',
      buckets: ['Koeffisient', 'Indeks'],
      items: [
        { t: '2-tallet i 2H₂O', b: 0 },
        { t: '2-tallet i O₂', b: 1 },
        { t: 'Kan endres når vi balanserer', b: 0 },
        { t: 'Må aldri endres når vi balanserer', b: 1 },
        { t: 'Antall atomer av et slag i én formel', b: 1 },
        { t: 'Antall molekyler eller formelenheter', b: 0 },
      ],
      explain: 'Koeffisienten står foran formelen og teller hvor mange molekyler/formelenheter som reagerer. Indeksen står nede etter et atomsymbol og er en del av stoffets identitet. Å bytte indeks er å bytte stoff.',
    },
    {
      id: 'stoffer.likn.09', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'ionebinding', 'ion'], level: 5, type: 'mc',
      myth: 'myte.indekser-kan-endres',
      prompt: 'En elev balanserer natrium + klor slik: Na + Cl₂ → NaCl₂. Hva viser feilen, og hva er en god oppfølging?',
      options: [
        'Eleven bruker indeksen til å balansere og lager et stoff som ikke finnes; ta utgangspunkt i ionene Na⁺ og Cl⁻ og balanser så med koeffisienter: 2Na + Cl₂ → 2NaCl',
        'Likningen er riktig fordi antall atomer stemmer på begge sider',
        'Eleven skulle skrevet Na₂ på venstre side, siden klor er toatomig',
        'Eleven bør lære svaret utenat, for balansering er prøving og feiling',
      ],
      answer: 0,
      why: {
        1: 'Atomene stemmer, men NaCl₂ finnes ikke. Na⁺ og Cl⁻ må være 1 : 1 for at ladningen skal bli 0.',
        2: 'Natrium er et metall og består ikke av Na₂-molekyler. Formelen må vise stoffet slik det er.',
        3: 'Pugging fjerner ikke den underliggende misoppfatningen. Eleven trenger å se at formelen bestemmes av kjemien (ioneladningene), ikke av regnestykket.',
      },
      explain: 'Feilen avslører at eleven ser formler som tall som kan justeres, ikke som representasjoner av virkelige stoffer. Grep: bestem formelen først (Na⁺ + Cl⁻ → NaCl), balanser deretter med koeffisienter. Konkreter (kuler, kort) som må «brukes opp» på begge sider, gjør forskjellen synlig.',
    },
    {
      id: 'stoffer.likn.10', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'molekyl', 'proton'], level: 3, type: 'num',
      prompt: 'Regn ut den **molare massen** til vann, H₂O. Bruk H = 1,0 g/mol og O = 16,0 g/mol.',
      answer: 18.0, abs: 0.05, unit: 'g/mol',
      explain: '2 · 1,0 + 16,0 = 18,0 g/mol. Ett vannmolekyl veier 18 u, og 1 mol vannmolekyler (6,02 · 10²³ stk.) veier 18 g – omtrent en slurk.',
    },
    {
      id: 'stoffer.likn.11', region: R, topic: T_LIKN, concepts: ['reaksjonslikning', 'massebevaringsloven', 'produkt'], level: 5, type: 'num',
      prompt: 'Magnesium brenner: 2Mg + O₂ → 2MgO. Hvor mange gram magnesiumoksid dannes av 4,8 g magnesium? Bruk Mg = 24 g/mol og O = 16 g/mol.',
      answer: 8.0, tol: 0.02, unit: 'g', hint: 'Stoffmengde Mg = masse / molar masse; MgO dannes i forholdet 1 : 1',
      explain: '4,8 g / 24 g/mol = 0,20 mol Mg, som gir 0,20 mol MgO. MgO har molar masse 24 + 16 = 40 g/mol, så massen blir 0,20 · 40 = 8,0 g. Økningen på 3,2 g er oksygenet som er bundet fra lufta – massebevaring i et åpent system der et produkt blir igjen.',
    },
  ]);

  /* =====================================================================
     KJEMIENS TRE NIVÅER (Kjemi fagdidaktikk kap. 2 og 5)
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.niva.01', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer'], level: 1, type: 'mc',
      prompt: 'Hvilke tre nivåer beskriver kjemien, ifølge Kjemi fagdidaktikk?',
      options: [
        'Makronivå, mikronivå og representasjonsnivå',
        'Fast stoff, væske og gass',
        'Atom, molekyl og ion',
        'Observasjon, hypotese og konklusjon',
      ],
      answer: 0,
      why: {
        1: 'Det er de tre fasene, ikke beskrivelsesnivåene.',
        2: 'Det er tre typer partikler – alle hører hjemme på mikronivået.',
        3: 'Det er trinn i utforskende arbeid, ikke kjemiens nivåer.',
      },
      explain: 'Makro: det vi ser og måler (stoffet bruser, vekta viser 154 g). Mikro: partiklene (atomer, ioner, molekyler). Representasjon: symboler, formler, likninger og modeller. Johnstone kalte dette kjemiens trekant.',
    },
    {
      id: 'stoffer.niva.02', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer', 'partikkelmodellen', 'reaksjonslikning'], level: 3, type: 'sort',
      prompt: 'Hvilket nivå hører beskrivelsen til?',
      buckets: ['Makro', 'Mikro', 'Representasjon'],
      items: [
        { t: 'Vannet koker ved 100 °C', b: 0 },
        { t: 'H₂O', b: 2 },
        { t: 'Vannmolekyler river seg løs fra hverandre', b: 1 },
        { t: 'Saltet er hvitt og smaker salt', b: 0 },
        { t: 'Na⁺ og Cl⁻ sitter i et gitter', b: 1 },
        { t: '2H₂ + O₂ → 2H₂O', b: 2 },
        { t: 'En kule-pinne-modell av metan', b: 2 },
        { t: 'Stålulla blir svart, og vekta viser mer', b: 0 },
      ],
      explain: 'Makro er det som kan observeres og måles. Mikro er hva partiklene gjør – tenkt, ikke sett. Representasjon er språket vi bruker for å vise mikronivået: formler, likninger, tegninger og fysiske modeller. Mange elever tror H₂O «er» vannet og ikke et symbol for det.',
    },
    {
      id: 'stoffer.niva.03', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer', 'grunnstoff'], level: 3, type: 'sort',
      prompt: 'Ordet «oksygen» brukes på alle tre nivåene. Hvilket nivå er det snakk om?',
      buckets: ['Makro', 'Mikro', 'Representasjon'],
      items: [
        { t: 'Oksygengass i en trykkflaske', b: 0 },
        { t: 'Ett O-atom med 8 protoner', b: 1 },
        { t: 'Symbolet O i periodesystemet', b: 2 },
        { t: 'O₂ skrevet i en reaksjonslikning', b: 2 },
        { t: 'Et O₂-molekyl', b: 1 },
        { t: 'En glødende flis blusser opp i oksygen', b: 0 },
      ],
      explain: 'Atomlaben peker på at elever blander nivåene fordi «oksygen» kan bety stoffet, atomtypen eller symbolet. Gode lærere markerer nivået i språket: «oksygengassen» (makro), «oksygenmolekylene» (mikro), «formelen O₂» (representasjon).',
    },
    {
      id: 'stoffer.niva.04', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer'], level: 3, type: 'mc',
      prompt: 'Hva er ifølge Kjemi fagdidaktikk en hovedgrunn til at kjemi oppleves vanskelig for elever?',
      options: [
        'Undervisningen veksler stadig mellom makro, mikro og representasjon, ofte uten å si fra',
        'Kjemi krever mer matematikk enn de andre naturfagene',
        'Elevene har ingen hverdagserfaringer med stoffer',
        'Det finnes for mange grunnstoffer å lære utenat',
      ],
      answer: 0,
      why: {
        1: 'Matematikk kan være en terskel i kjemi, men det er ikke hovedpoenget i analysen av kjemiens tre nivåer.',
        2: 'Elevene har mange hverdagserfaringer med stoffer – derfor har de også mange hverdagsforestillinger.',
        3: 'Elevene trenger ikke pugge alle grunnstoffene. Mønstrene i periodesystemet er viktigere.',
      },
      explain: 'Eksperter hopper lett mellom nivåene; nybegynnere mister tråden. En lærer kan si «vann er H₂O som koker når molekylene får nok energi» i én setning – tre nivåer på en gang. Gjør nivåskiftene eksplisitte og la elevene øve på å oversette mellom dem.',
    },
    {
      id: 'stoffer.niva.05', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer', 'faseovergang-partikler', 'reaksjonslikning'], level: 5, type: 'mc',
      myth: 'myte.faseovergang-er-reaksjon',
      prompt: 'Nora tegner kokende vann. I boblene tegner hun løse H-er og O-er. Hvilke nivåer blander hun, og hva er den underliggende misoppfatningen?',
      options: [
        'Hun lar symbolet H₂O styre mikrotegningen og tror koking bryter molekylene – representasjon og mikro blandes',
        'Hun blander makro og mikro, fordi bobler ikke kan tegnes på mikronivå',
        'Hun blander ingen nivåer – tegningen er riktig, fordi vann består av H og O',
        'Hun blander mikro og representasjon fordi hun brukte bokstaver i stedet for farger',
      ],
      answer: 0,
      why: {
        1: 'En boble er gjerne et makrofenomen, men det er greit å vise hva som er inni den på mikronivå. Problemet er hva hun tegner inni.',
        2: 'Vann består av H₂O-molekyler. Dampen er også H₂O-molekyler – atomene skilles ikke ved koking.',
        3: 'Bokstaver eller farger er bare valg av representasjon. Feilen er det faglige innholdet.',
      },
      explain: 'Formelen H₂O leses som «H og O», og eleven tror at faseovergangen er en spaltning. Grep: la henne sammenligne med kondens på et kaldt lokk – kommer det hydrogen og oksygen ut, eller vann? Tegn deretter H₂O-molekyler tett i væsken og spredt i boblene.',
    },
    {
      id: 'stoffer.niva.06', region: R, topic: T_NIVA, concepts: ['kjemiens-tre-nivaer', 'kjemisk-reaksjon', 'massebevaringsloven'], level: 5, type: 'order',
      prompt: 'Du planlegger en økt om stearinlys som brenner. Ordne aktivitetene slik at elevene beveger seg fra det konkrete til det abstrakte og tilbake.',
      items: [
        'Observere et lys som brenner på en vekt og notere at massen avtar (makro)',
        'Holde et kaldt glass over flammen og teste gassen med kalkvann – vann og CO₂ dannes (makro, evidens)',
        'Tegne partikkelmodeller av stearin og oksygen som blir til CO₂- og H₂O-molekyler (mikro)',
        'Skrive reaksjonslikningen med formler og balansere den (representasjon)',
        'Bruke modellen til å forklare hvorfor lyset ble lettere (tilbake til makro)',
      ],
      explain: 'Kjemi fagdidaktikk anbefaler å starte i makro, bygge mikro-forklaringen og innføre symbolene etterpå – og så vende tilbake til fenomenet. Da får elevene evidens før modell, og modellen blir et verktøy for å forklare, ikke en ny ting å pugge.',
    },
    {
      id: 'stoffer.niva.07', region: R, topic: T_NIVA, concepts: ['partikkelmodellen', 'kjemiens-tre-nivaer', 'fase'], level: 5, type: 'mc',
      myth: 'myte.atomer-har-stoffets-egenskaper',
      prompt: 'Elevene modellerer smelting med fargede klinkekuler i en eske som de rister. Hvilken **begrensning** ved modellen er viktigst å diskutere med dem?',
      options: [
        'Ekte partikler har ikke farge og hardhet, beveger seg hele tiden av seg selv, og har tomrom – ikke luft – mellom seg',
        'Kulene er for store; med riktig størrelse ville modellen vært en eksakt kopi',
        'Modellen er feil og bør erstattes av en definisjon av smelting',
        'Ingen – en god modell har ingen begrensninger',
      ],
      answer: 0,
      why: {
        1: 'Ingen modell blir en eksakt kopi. Også en «riktig» skala ville vist harde, fargede kuler med lufta i esken mellom seg.',
        2: 'Modellen er nyttig: den viser ordnet og uordnet pakking. Begrensninger er ikke en grunn til å forkaste den, men til å drøfte den.',
        3: 'Alle modeller har styrker og begrensninger – det står eksplisitt i kompetansemålet for 10. trinn.',
      },
      explain: 'Kjemi fagdidaktikk kap. 5: elevene skal lære å vurdere modeller, ikke bare bruke dem. Klinkekulene viser fint pakking og bevegelse, men kan forsterke at partikler har makroegenskaper (farge, hardhet), at de står stille uten ytre risting, og at det er luft mellom dem.',
    },
  ]);
})();
