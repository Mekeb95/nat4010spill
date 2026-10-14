/* Himmelfjellet — Misforståelsene (id-er låst i docs/ROSTER.md). */
(function () {
  'use strict';
  NG.content.addEnemies([
    {
      id: 'manefaseskyggen', name: 'Månefaseskyggen', region: 'jorda', tier: 'normal',
      myth: 'myte.jorda-manefaser-skygge', hp: 30, atk: 6,
      intro: 'En halvmåneformet skygge glir over fjellstien og prøver å dekke til månen med en svart kappe. Den bommer hver gang.',
      taunts: [
        'Ser du sigden? Det er MIN skygge som spiser resten av månen!',
        'Jeg jobber hver natt. Litt mer kappe, litt mindre måne.',
        'Fullmåne? Da har jeg fri.',
        'Sola har ingenting med saken å gjøre. Det er jeg og jorda.',
      ],
      defeat: 'Skyggen innser at den bare når fram til månen ved fullmåne – og da kalles det måneformørkelse. Månefasene er bare vinkelen vi ser den solbelyste halvdelen fra.',
      topics: ['Månen og tidevann'],
    },
    {
      id: 'tyngdelosingen', name: 'Tyngdeløsingen', region: 'jorda', tier: 'normal',
      myth: 'myte.jorda-ingen-tyngdekraft', hp: 30, atk: 6,
      intro: 'En astronaut i flagrende drakt svever rundt i sirkler over fjelltoppen. «Her oppe gjelder ikke tyngdekraften lenger!»',
      taunts: [
        'Litt over skyene skrus tyngdekraften av. Klikk!',
        'Månen? Den bare henger der. Ingen krefter involvert.',
        'Jeg er vektløs fordi jorda har sluppet taket.',
        'Hvorfor faller ikke romstasjonen ned? Fordi det ikke er tyngdekraft, selvsagt!',
      ],
      defeat: 'Tyngdeløsingen oppdager at den har falt hele tiden – rundt jorda. Tyngdekraften på 400 km høyde er nesten 90 % av den ved bakken. Uten den ville romstasjonen og månen fløyet rett ut i rommet.',
      topics: ['Månen og tidevann', 'Universet og solsystemet'],
    },
    {
      id: 'ozonhullet', name: 'Ozonhull-ånden', region: 'jorda', tier: 'normal',
      myth: 'myte.jorda-ozonhull-drivhus', hp: 32, atk: 7,
      intro: 'Et blafrende hull i himmelen vrir seg og snakker med stemmen til en gammel værmelder. «Det er gjennom MEG varmen kommer inn!»',
      taunts: [
        'Tett meg igjen, så forsvinner global oppvarming. Enkelt!',
        'Drivhuseffekt, ozonhull, sur nedbør – alt er samme sak.',
        'Varmen slipper inn gjennom hullet og blir fanget. Logisk, ikke sant?',
        'CO₂? Aldri hørt om. Jeg er hovedpersonen her.',
      ],
      defeat: 'Ånden lukker seg sakte – ozonlaget er faktisk i ferd med å lege seg etter Montreal-protokollen. Men drivhuseffekten er en helt annen mekanisme: drivhusgasser tar opp varmestråling fra jorda. Ozonlaget beskytter mot UV.',
      topics: ['Atmosfære og drivhuseffekt'],
    },
    {
      id: 'vaervirvelen', name: 'Værvirvelen', region: 'jorda', tier: 'normal',
      myth: 'myte.jorda-vaer-klima', hp: 32, atk: 7,
      intro: 'En liten, sur sky med snøfnugg i skjegget snurrer rundt deg. «Brrr! Iskaldt i dag. Så mye for global oppvarming!»',
      taunts: [
        'Det snødde i mai. Klimaet er tydeligvis kaldere!',
        'Meteorologene bommer på været i morgen. Hvordan skal de vite noe om 2070?',
        'Vær og klima – det er bare to ord for det samme.',
        'Én kald uke beviser alt jeg trenger.',
      ],
      defeat: 'Virvelen løser seg opp i en 30-årsnormal. Vær er her og nå; klima er gjennomsnittet over lang tid. Klimaframskrivinger bygger på energibalansen til hele jorda, ikke på å spå enkeltdager.',
      topics: ['Klima og vær'],
    },
    {
      id: 'bangbomben', name: 'Bang-bomben', region: 'jorda', tier: 'normal',
      myth: 'myte.jorda-bigbang-eksplosjon', hp: 28, atk: 6,
      intro: 'En rund, sort bombe med lang lunte ruller ned fjellsiden. «Jeg er sentrum av universet! Alt fløy ut fra MEG!»',
      taunts: [
        'BOOM! Og så fløy galaksene ut i det tomme rommet.',
        'Pek på stedet der big bang skjedde. Det er her. Hos meg.',
        'Før meg var det et stort, mørkt, tomt rom som ventet.',
        'Galaksene flyr bort fra sentrum. Fra meg!',
      ],
      defeat: 'Lunta brenner ut uten smell. Big bang skjedde overalt samtidig – det er rommet selv som utvider seg. Fra hvilken som helst galakse ser det ut som om alle andre fjerner seg. Det finnes ikke noe sentrum.',
      topics: ['Universet og solsystemet'],
    },
    {
      id: 'kontinentkjempen', name: 'Kontinentkjempen', region: 'jorda', tier: 'elite',
      myth: 'myte.jorda-kontinenter-stille', hp: 62, atk: 10,
      intro: 'Et fjell reiser seg på to steinbein. «Jeg har stått her siden tidenes morgen og skal stå her til tidenes ende. Kontinenter FLYTTER SEG IKKE.»',
      taunts: [
        'Har du noen gang sett et kontinent bevege seg? Nei. Saken avgjort.',
        'Fjellene har alltid vært like høye. Erosjon er oppspinn.',
        'At Afrika og Sør-Amerika passer sammen? Ren tilfeldighet.',
        'Jordskjelv skjer bare sånn, helt tilfeldig hvor som helst.',
        'Wegener var en værmann. Hva vet han om stein?',
      ],
      defeat: 'Kjempen sprekker langs en plategrense. Platene beveger seg noen centimeter i året – omtrent som neglene dine vokser. På 200 millioner år ble det et helt Atlanterhav. Jordskjelv og vulkaner følger plategrensene.',
      topics: ['Platetektonikk og geologi'],
    },
    {
      id: 'drivhusdemonen', name: 'Drivhusdemonen', region: 'jorda', tier: 'elite',
      myth: 'myte.jorda-drivhuseffekt-skadelig', hp: 64, atk: 10,
      intro: 'En dugget glassdemon puster damp på fjellsiden. «Drivhuseffekten er ondskap! Fjern den helt, så blir alt bra!»',
      taunts: [
        'Uten drivhuseffekt ville jorda vært et paradis. Kjølig og deilig.',
        'Alle drivhusgasser er menneskeskapte. Vanndamp teller ikke.',
        'Fjern all CO₂ fra lufta – problemet løst!',
        'Drivhuseffekt? Dårlig. Mer drivhuseffekt? Like dårlig. Samme sak.',
      ],
      defeat: 'Demonen fryser til is ved −19 °C og innser feilen. Den naturlige drivhuseffekten holder jorda på ca. 15 °C og er grunnlaget for livet vi kjenner. Det er den *forsterkede* drivhuseffekten fra menneskeskapte utslipp som endrer klimaet.',
      topics: ['Atmosfære og drivhuseffekt', 'Klima og vær'],
    },
    {
      id: 'arstidsdragen', name: 'Årstidsdragen', region: 'jorda', tier: 'boss',
      myth: 'myte.jorda-arstider-avstand', hp: 150, atk: 13,
      intro: 'Fra toppen av Himmelfjellet folder en drage ut vingene: den ene glødende som midtsommer, den andre rimfrosset. Den flyr i en svær ellipse rundt en flammende sol og brøler: «NÆR SOLA – SOMMER! LANGT UNNA – VINTER!»',
      taunts: [
        'Kjenner du varmen? Jeg har nettopp fløyet nærmere sola.',
        'Australia har sommer i desember? Det er sikkert falske nyheter.',
        'Aksehelning? Jorda står da rett som et lys!',
        'Jo nærmere bålet, jo varmere. Barnelærdom.',
        'Midnattssol skyldes at sola jobber overtid.',
      ],
      phases: [
        { at: 0.66, text: 'Dragen innrømmer at banen er nesten sirkulær – men «da må sola brenne kraftigere om sommeren!» Den skifter strategi.' },
        { at: 0.33, text: 'Dragen heller hele kroppen 23,4° og blir forvirret av sin egen skygge. Nå må du forklare innfallsvinkel og daglengde.' },
      ],
      defeat: 'Dragen lander med et sukk i januar – nærmest sola, midt i norsk vinter. Jordas bane er nesten en sirkel; avstanden varierer bare ca. 3 %. Årstidene kommer av aksehelningen: om sommeren står sola høyere, strålene treffer brattere og dagene er lengre. Derfor har nord og sør motsatte årstider samtidig.',
      topics: ['Døgn og årstider'],
    },
  ]);
})();
