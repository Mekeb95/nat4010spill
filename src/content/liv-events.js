/* Livsskogen — hendelser (✉-noder). */
(function () {
  'use strict';
  NG.content.addEvents([
    { id: 'liv.ev.potet', region: 'liv', title: 'Poteten i skapet',
      text: 'I skolekjøkkenet finner du en glemt potet med lange, bleke spirer. En elev kikker inn: «Den har jo ikke fått lys på flere uker. Hvor får den kraft til å vokse fra?»',
      choices: [
        { label: '«Stivelsen i poteten brytes ned i celleånding – den går hele tiden, også i mørket.»', correct: true,
          result: 'Eleven vil teste det: dere legger poteten i en pose med bromtymolblått-vann ved siden av. Neste dag er vannet gult. CO₂! Begrepskortet for celleånding gløder.', reward: { xp: 25 } },
        { label: '«Den har lagret lys fra før den ble tatt opp.»', correct: false,
          result: 'Lys kan ikke lagres som lys. Det var kjemisk energi i stivelsen – og det var celleånding som frigjorde den. Nattpusteren fniser i skyggen.', reward: { hp: -5 } },
        { label: '«Planter trenger ikke energi før de har blader.»', correct: false,
          result: 'All vekst krever energi. Poteten blir lettere og lettere – karbonet går ut som CO₂.', reward: { hp: -5 } },
      ] },
    { id: 'liv.ev.flaskehage', region: 'liv', title: 'Flaskehagen',
      text: 'En gammel mann har en forseglet glassflaske med grønne planter. «Den har ikke vært åpnet på femti år,» sier han. «Hva tror du er hemmeligheten?»',
      choices: [
        { label: '«Lys inn, varme ut – og nedbryterne resirkulerer stoffet.»', correct: true,
          result: '«Nettopp,» smiler han. «Stoffet går rundt, energien går gjennom. Sett den i et mørkt skap, og den dør.» Han gir deg en lupe.', reward: { xp: 20, item: 'item-lupe' } },
        { label: '«Energien går i kretsløp i flaska.»', correct: false,
          result: 'Han rister på hodet. «Prøv å sette den i mørket, du.» Evighetskjeden rasler et sted i skogen.', reward: { hp: -5 } },
        { label: '«Plantene har ikke celleånding, så de bruker ikke opp noe.»', correct: false,
          result: '«Da ville det vært mer og mer oksygen og ingen CO₂ igjen etter noen uker,» sier han. «Plantene hadde sultet.»', reward: { hp: -5 } },
      ] },
    { id: 'liv.ev.myra', region: 'liv', title: 'Grøftegravingen',
      text: 'En gravemaskin står klar ved kanten av en stor myr. Sjåføren roper: «Vi skal grøfte og plante gran – det er klimatiltak! Trær binder CO₂!» Hva svarer du?',
      choices: [
        { label: '«Pass på regnskapet: drenering slipper oksygen ned i torva, og nedbrytningen kan slippe ut mer CO₂ enn skogen binder.»', correct: true,
          result: 'Sjåføren slår av motoren og ringer kommunen. Karbonkraken krymper litt i det fjerne. Myra får ligge.', reward: { xp: 25, joule: 10 } },
        { label: '«Godt tiltak. Myr er bare våt jord uten karbon.»', correct: false,
          result: 'Grøftene graves. Det bobler. Torv som har ligget i tusenvis av år, begynner å råtne.', reward: { hp: -8 } },
        { label: '«Det spiller ingen rolle hva dere gjør med myra.»', correct: false,
          result: 'Myra er et av de tetteste karbonlagrene vi har – og et leveområde for mange arter.', reward: { hp: -5 } },
      ] },
    { id: 'liv.ev.teposer', region: 'liv', title: 'Teposeforsøket',
      text: 'En 8. klasse vil delta i Tea Bag Index. Læreren spør deg: «Vi har 12 poser. Skal vi sette én pose på tolv forskjellige steder, eller fire poser på tre steder?»',
      choices: [
        { label: '«Fire poser på tre steder – da ser dere spredningen og kan skille ekte forskjeller fra tilfeldig variasjon.»', correct: true,
          result: 'Klassen velger tre steder som varierer i fuktighet, men ellers er like. Resultatene blir sendt inn til forskerne. Muggmesteren mister en tentakel.', reward: { xp: 25 } },
        { label: '«Tolv steder – jo flere steder, jo mer lærer de.»', correct: false,
          result: 'Med én pose per sted kan ingen si om forskjellene skyldes stedet eller tilfeldigheter. Muggmesteren nikker fornøyd.', reward: { hp: -5 } },
      ] },
    { id: 'liv.ev.orn', region: 'liv', title: 'Ørnas regnskap',
      text: 'En kongeørn sirkler over dalen. En turist sier: «Det burde vært like mange ørner som mus her – det er jo nok plass i lufta!»',
      choices: [
        { label: '«Det handler om energi: for hvert ledd i næringskjeden går ca. 90 % ut som varme. Én ørn trenger et enormt område med mus.»', correct: true,
          result: 'Turisten regner: 1 kg ørn ≈ 1000 kg gress. «Ja vel, da forstår jeg hvorfor det er få av dem.»', reward: { xp: 20 } },
        { label: '«Ørnene spiser opp all energien, så den er borte.»', correct: false,
          result: 'Energien er ikke borte – den er blitt varme. Men konklusjonen om få ørner stemmer i hvert fall.', reward: { hp: -3, xp: 5 } },
        { label: '«Musene har mer energi fordi de er mindre.»', correct: false,
          result: 'Det er ikke størrelsen, men plasseringen i næringskjeden som bestemmer hvor mye energi som er tilgjengelig.', reward: { hp: -5 } },
      ] },
    { id: 'liv.ev.giraff', region: 'liv', title: 'Elevteksten',
      text: 'Du retter en elevtekst: «Fuglene på Galápagos fikk kraftigere nebb fordi de trengte å knekke harde frø i tørkeåret.» Hvilken kommentar gir du?',
      choices: [
        { label: '«Bra observasjon! Kan du skrive det som naturlig utvalg: hvem overlevde tørken, og hva arvet ungene deres?»', correct: true,
          result: 'Eleven skriver om: fugler med litt kraftigere nebb fikk mer mat, overlevde og fikk unger med kraftige nebb. Lamarck-larven tørker ut.', reward: { xp: 25 } },
        { label: '«Riktig, fuglene utviklet sterkere nebb ved å trene.»', correct: false,
          result: 'Trening endrer ikke genene i kjønnscellene. Lamarck-larven danser av glede.', reward: { hp: -6 } },
      ] },
  ]);
})();
