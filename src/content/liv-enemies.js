/* Livsskogen — Misforståelsene (id-er låst i docs/ROSTER.md). */
(function () {
  'use strict';
  NG.content.addEnemies([
    {
      id: 'energimakeren', name: 'Energimakeren', region: 'liv', tier: 'normal',
      myth: 'myte.biologi-lager-energi', hp: 30, atk: 6,
      intro: 'Under en bregne står en liten mann med tusen mitokondrier i lommene og en skilt-hatt: «ENERGI LAGES HER – FERSK HVER DAG».',
      taunts: [
        'Cellene mine LAGER energi! Helt fra bunnen av! Ingen sol nødvendig!',
        'Fotosyntesen? Ren energifabrikk. Inn med ingenting, ut med energi!',
        'Jeg spiste en brødskive og laget 200 nye joule. Takk, mitokondrier!',
        'Bevaring? Det er for fysikere. Biologien har sine egne regler.',
      ],
      defeat: 'Energimakeren tømmer lommene: bare sukker og oksygen inn, CO₂, vann og varme ut. Celler lager ikke energi – de *omdanner* kjemisk energi og frigjør den. Lysenergi ble kjemisk energi i fotosyntesen, og alt ender som varme.',
      topics: ['Fotosyntese og celleånding', 'Næringskjeder og energi'],
    },
    {
      id: 'nattpusteren', name: 'Nattpusteren', region: 'liv', tier: 'normal',
      myth: 'myte.liv-natt-celleanding', hp: 32, atk: 6,
      intro: 'En søvnig plante med nattlue og pysjamas strekker seg mot månen. Om dagen later den som den ikke puster i det hele tatt.',
      taunts: [
        'Om dagen fotosyntese, om natta celleånding. Ordentlig skiftarbeid, det!',
        'Psst … jeg holder pusten til sola går ned.',
        'Mitokondriene mine har dagvakt fri. De kommer på jobb kl. 22.',
        'Røttene? De venter i mørket på natta, de også. Logisk.',
      ],
      defeat: 'Nattpusteren gjesper ut CO₂ midt på dagen og innser det selv: celleåndingen trenger sukker og oksygen, ikke mørke. Den går hele døgnet. Om dagen går fotosyntesen *i tillegg* – likningene er motsatte i retning, ikke i tid.',
      topics: ['Fotosyntese og celleånding'],
    },
    {
      id: 'jordspiseren', name: 'Jordspiseren', region: 'liv', tier: 'normal',
      myth: 'myte.liv-masse-fra-jorda', hp: 34, atk: 7,
      intro: 'Et digert tre med munn i rotklumpen tygger høylytt på jordsmonnet. «Mer mold! Jeg skal bli 30 meter!»',
      taunts: [
        'Hvert gram av meg er spist fra jorda. Se så stor jeg er blitt!',
        'Lufta? Luft veier jo ingenting. Ha!',
        'Gi meg plantenæring, så vokser jeg en meter i uka.',
        'Van Helmont? Han målte sikkert feil.',
      ],
      defeat: 'Jordspiseren veier jorda i potta: nesten like mye som før. Treet er bygd av CO₂ fra lufta og vann – karbonet i en tømmerstokk var luft for noen tiår siden. Fra jorda kommer vann og litt næringssalter.',
      topics: ['Karbonkretsløpet', 'Fotosyntese og celleånding'],
    },
    {
      id: 'evighetskjeden', name: 'Evighetskjeden', region: 'liv', tier: 'normal',
      myth: 'myte.liv-energi-kretslop', hp: 32, atk: 7,
      intro: 'En lenke av gress, hare, rev og sopp ringer seg sammen til en sirkel som snurrer og snurrer. «Energien går rundt og rundt for alltid!»',
      taunts: [
        'Reven dør, soppen spiser, gresset vokser – og energien kommer tilbake til start!',
        'Hvem trenger sola? Vi resirkulerer energien selv.',
        'Hundre prosent gjenvinning, hver runde. Bærekraft, baby!',
        'Varme? Den sniker seg tilbake inn i gresset når ingen ser.',
      ],
      defeat: 'Kjeden går i stå – den mangler sollys. Stoff går i kretsløp, men energien strømmer én vei: inn som lys, ut som varme som stråler til verdensrommet. Uten påfyll fra sola stopper alt.',
      topics: ['Næringskjeder og energi'],
    },
    {
      id: 'lamarck-larven', name: 'Lamarck-larven', region: 'liv', tier: 'normal',
      myth: 'myte.liv-lamarck', hp: 28, atk: 6,
      intro: 'En larve trener strekkhals i et apparat av greiner. «Hvis jeg strekker meg nok, får barna mine lang hals!»',
      taunts: [
        'Jeg VILLE ha vinger, så jeg fikk vinger. Det kalles motivasjon.',
        'Giraffen strakk seg mot bladene – og vips, barna fikk lengre hals.',
        'Jeg har trent opp beina mine. Avkommet blir født med sixpack.',
        'Mutasjoner kommer når man trenger dem. Sånn er det bare.',
      ],
      defeat: 'Larven blir sommerfugl – akkurat som alle andre av arten, uansett hvor mye den trente. Ervervede egenskaper arves ikke. Variasjon oppstår tilfeldig, og naturlig utvalg avgjør hvilke varianter som blir vanligere over generasjoner.',
      topics: ['Evolusjon og arv'],
    },
    {
      id: 'muggmesteren', name: 'Muggmesteren', region: 'liv', tier: 'elite',
      myth: 'myte.liv-nedbryting-lik', hp: 58, atk: 9,
      intro: 'En pelskledd soppkonge troner på en haug av halvråtne teposer. Han har gravd dem ned overalt – i myra, i plenen, i fryseren – helt uten system.',
      taunts: [
        'Råtne gjør alt av seg selv. Nedbrytere? Bare pynt.',
        'Jeg sammenlignet en tepose i varm, våt kompost med en i tørr sand på fjellet. Konklusjon: sand er dårlig!',
        'Én pose holder. Gjentak er for pyser.',
        'Temperatur, fukt, pH, materiale … jeg endrer alt på en gang. Effektivt!',
        'k og S? Det står for «Kanskje» og «Sikkert».',
      ],
      defeat: 'Muggmesteren faller sammen til humus. Nedbrytning gjøres av organismer, og farten avhenger av temperatur, fuktighet, pH, næring, materiale og nedbrytere. Vil du vite hva én faktor gjør, endrer du bare den – og har flere poser per behandling.',
      topics: ['Nedbrytning'],
    },
    {
      id: 'karbonkraken', name: 'Karbonkraken', region: 'liv', tier: 'elite',
      myth: 'myte.liv-karbon-lufta-storst', hp: 64, atk: 10,
      intro: 'Opp av en grøftet myr stiger en svart blekksprut med torv i tentaklene. Hver gang den rører på seg, bobler det CO₂ opp av bakken.',
      taunts: [
        'Myr? Bare søle og mygg. Grøft den og plant gran!',
        'Det meste av karbonet ligger i lufta. Jorda er bare … jord.',
        'Permafrosten kan godt tine. Den har jo ikke noe i seg.',
        'Litt varmere jord gjør ingenting med karbonet. Det ligger der det ligger.',
      ],
      defeat: 'Kraken tørker ut og smuldrer. Jordsmonnet holder ca. 2700 Gt karbon – mer enn lufta (780) og plantene (575) til sammen. Myr og permafrost er kalde, våte og oksygenfattige, så nedbrytningen går sakte. Varmes eller dreneres de, skyter nedbrytningen fart og CO₂ forsterker oppvarmingen.',
      topics: ['Karbonkretsløpet', 'Nedbrytning'],
    },
    {
      id: 'pustetrollet', name: 'Pustetrollet', region: 'liv', tier: 'boss',
      myth: 'myte.liv-planter-puster-ikke', hp: 140, atk: 12,
      intro: 'Midt i Livsskogen reiser en mosegrodd trollkjempe seg. Den holder pusten så den blir blå i fjeset, og brøler: «PLANTER PUSTER IKKE! DE LAGER BARE OKSYGEN TIL DERE!»',
      taunts: [
        'Grønne blader, null mitokondrier. Det vet alle!',
        'Om dagen gir jeg dere oksygen. Om natta … sover jeg.',
        'Netto? Brutto? Det er bankord. Jeg produserer OKSYGEN.',
        'Røttene mine trenger ikke energi. De bare … henger der.',
        'Jeg har aldri sluppet ut en eneste CO₂ i hele mitt liv!',
      ],
      phases: [
        { at: 0.66, text: 'Trollet innrømmer motvillig at det har mitokondrier – «men de jobber bare om natta!» Det skifter til Nattpusterens strategi.' },
        { at: 0.33, text: 'Trollet roper «Vel, jeg produserer i hvert fall bare O₂ om dagen!» Nå må du skille *produserer* fra *avgir netto*.' },
      ],
      defeat: 'Pustetrollet slipper pusten med et sukk – og det er CO₂ i sukket. Planteceller har både kloroplaster og mitokondrier. Celleåndingen går hele døgnet i alle levende celler; det som snur mellom dag og natt, er netto gassutveksling. Planta produserer CO₂ hele tiden, men avgir det netto bare når celleåndingen er større enn fotosyntesen.',
      topics: ['Fotosyntese og celleånding', 'Karbonkretsløpet'],
    },
  ]);
})();
