/* Stoffgruvene — spørsmål (Kjemi for lærere kap. 2, 4, 5, 6; Kjemi fagdidaktikk kap. 2 og 5).
   Nivå: 1 Gjenkjenne · 2 Definere · 3 Nettverk · 4 Anvende · 5 Overføre/didaktikk. */
(function () {
  'use strict';
  const R = 'stoffer';
  const T_STOFF = 'Stoffer og blandinger';
  const T_ATOM = 'Atomet og isotoper';
  const T_PS = 'Periodesystemet';
  const T_BIND = 'Ioner og bindinger';
  const T_LOS = 'Polaritet og løselighet';
  const T_FASE = 'Faser og partikkelmodellen';
  const T_REAK = 'Kjemiske reaksjoner';
  const T_LIKN = 'Reaksjonslikninger';
  const T_MASSE = 'Massebevaring';
  const T_NIVA = 'Kjemiens tre nivåer';

  /* =====================================================================
     STOFFER OG BLANDINGER
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.stoff.01', region: R, topic: T_STOFF, concepts: ['stoff'], level: 1, type: 'mc',
      prompt: 'Nøkkelarket for stoffer gir en kort definisjon av hva et **stoff** er. Hvilken er riktig?',
      options: [
        'Alt som tar opp plass og har masse',
        'Alt vi kan se og ta på',
        'Alt som er bygd opp av molekyler',
        'Kjemikalier som er laget i et laboratorium',
      ],
      answer: 0,
      why: {
        1: 'Luft og andre gasser kan vi verken se eller ta på, men de har masse og tar opp plass – de er stoffer.',
        2: 'Metaller og salter består ikke av molekyler, men av atomer eller ioner i gitter. De er like fullt stoffer.',
        3: 'Dette er hverdagsbetydningen. Vann, stein og sukker er også stoffer, enten de er naturlige eller laget i fabrikk.',
      },
      explain: 'Et stoff er alt som har masse og tar opp plass. Lys, lyd og varme er ikke stoffer. Definisjonen omfatter også gasser, som elever lett glemmer fordi de er usynlige.',
    },
    {
      id: 'stoffer.stoff.02', region: R, topic: T_STOFF, concepts: ['rent-stoff', 'blanding'], level: 2, type: 'sort',
      prompt: 'Sorter: er stoffet et **rent stoff** eller en **blanding**?',
      buckets: ['Rent stoff', 'Blanding'],
      items: [
        { t: 'Destillert vann', b: 0 },
        { t: 'Saltvann', b: 1 },
        { t: 'Luft', b: 1 },
        { t: '24 karat gull', b: 0 },
        { t: 'Messing (kobber + sink)', b: 1 },
        { t: 'Sukker', b: 0 },
        { t: 'Melk', b: 1 },
        { t: 'Karbondioksid', b: 0 },
      ],
      explain: 'Et rent stoff har bare én type partikler – ett grunnstoff (gull) eller én forbindelse (H₂O, sukker, CO₂). Saltvann, luft, melk og messing er blandinger: flere rene stoffer som ikke er kjemisk bundet sammen, og sammensetningen kan variere.',
    },
    {
      id: 'stoffer.stoff.03', region: R, topic: T_STOFF, concepts: ['grunnstoff', 'kjemisk-forbindelse'], level: 2, type: 'sort',
      prompt: 'Sorter de rene stoffene: **grunnstoff** eller **kjemisk forbindelse**?',
      buckets: ['Grunnstoff', 'Kjemisk forbindelse'],
      items: [
        { t: 'Oksygengass, O₂', b: 0 },
        { t: 'Vann, H₂O', b: 1 },
        { t: 'Diamant', b: 0 },
        { t: 'Natriumklorid, NaCl', b: 1 },
        { t: 'Ozon, O₃', b: 0 },
        { t: 'Karbondioksid, CO₂', b: 1 },
        { t: 'Jern', b: 0 },
        { t: 'Glukose, C₆H₁₂O₆', b: 1 },
      ],
      explain: 'Grunnstoff = bare én atomtype, selv om atomene sitter sammen i molekyler (O₂, O₃) eller i et nettverk (diamant er bare karbon). Forbindelse = minst to ulike atomtyper som er kjemisk bundet. Mange tror O₂ er en forbindelse «fordi det er to atomer», men atomene er av samme slag.',
    },
    {
      id: 'stoffer.stoff.04', region: R, topic: T_STOFF, concepts: ['grunnstoff', 'kjemisk-forbindelse', 'blanding'], level: 3, type: 'sort',
      prompt: 'Grunnstoff, kjemisk forbindelse eller blanding?',
      buckets: ['Grunnstoff', 'Forbindelse', 'Blanding'],
      items: [
        { t: 'Nitrogengass', b: 0 },
        { t: 'Luft', b: 2 },
        { t: 'Jernoksid, Fe₂O₃', b: 1 },
        { t: 'Sjøvann', b: 2 },
        { t: 'Kobbertråd', b: 0 },
        { t: 'Bordsalt, NaCl', b: 1 },
        { t: 'Bronse', b: 2 },
        { t: 'Etanol, C₂H₅OH', b: 1 },
      ],
      explain: 'Grunnstoffer: én atomtype (N₂, Cu). Forbindelser: ulike atomtyper bundet i et fast forhold (Fe₂O₃, NaCl, etanol). Blandinger: flere rene stoffer som ikke er bundet – luft (N₂, O₂, Ar, CO₂ …), sjøvann (vann og salter) og bronse (en legering av kobber og tinn).',
    },
    {
      id: 'stoffer.stoff.05', region: R, topic: T_STOFF, concepts: ['blanding', 'rent-stoff'], level: 1, type: 'tf',
      prompt: 'En blanding består av to eller flere rene stoffer som ikke er kjemisk bundet sammen.',
      answer: true,
      explain: 'Sant. Fordi stoffene ikke er bundet, beholder hvert av dem egenskapene sine, og de kan skilles med fysiske metoder som filtrering, inndamping, destillasjon eller magnet.',
    },
    {
      id: 'stoffer.stoff.06', region: R, topic: T_STOFF, concepts: ['blanding', 'kjemisk-forbindelse', 'egenskap'], level: 3, type: 'mc',
      myth: 'myte.blanding-er-forbindelse',
      prompt: 'Du rører jernfilspon og svovelpulver sammen til et gråaktig pulver. Hvilken observasjon viser best at dette er en **blanding** og ikke en kjemisk forbindelse?',
      options: [
        'En magnet trekker ut jernet, og svovelet blir liggende igjen',
        'Pulveret inneholder to ulike grunnstoffer',
        'Massen av pulveret er lik massen av jern og svovel til sammen',
        'Pulveret har en annen farge enn hvert av stoffene alene',
      ],
      answer: 0,
      why: {
        1: 'Jernsulfid (FeS) inneholder også jern og svovel. To grunnstoffer skiller ikke blanding fra forbindelse – spørsmålet er om atomene er bundet sammen.',
        2: 'Massen er bevart både når stoffer blandes og når de reagerer, så massen skiller ikke de to.',
        3: 'Et pulver av to stoffer får en mellomting av fargene. Det sier lite om stoffene er bundet sammen.',
      },
      explain: 'I en blanding beholder hvert stoff egenskapene sine – jern er fortsatt magnetisk – og stoffene kan skilles med fysiske metoder. Varmer du blandingen, reagerer jern og svovel til jernsulfid, og da kan ikke magneten lenger trekke ut jern.',
    },
    {
      id: 'stoffer.stoff.07', region: R, topic: T_STOFF, concepts: ['kjemisk-forbindelse', 'egenskap', 'kjemisk-reaksjon'], level: 3, type: 'mc',
      myth: 'myte.atomer-har-stoffets-egenskaper',
      prompt: 'Jern- og svovelblandingen varmes til den gløder, og det dannes et svart, sprøtt stoff. Nå klarer ikke magneten å trekke ut jern. Hvorfor?',
      options: [
        'Jern og svovel er bundet sammen i et nytt stoff',
        'Jernatomene mistet magnetismen sin fordi de ble så varme',
        'Jernet har brent opp og forsvunnet i varmen',
        'Svovelet har smeltet og ligger som et skall rundt jernkornene',
      ],
      answer: 0,
      why: {
        1: 'Jern mister riktignok magnetismen over ca. 770 °C, men avkjølt jern er magnetisk igjen – jernsulfid er det ikke. Det er stoffet som er endret, ikke temperaturen.',
        2: 'Atomene forsvinner ikke. Produktet veier like mye som jernet og svovelet som reagerte.',
        3: 'Et tynt svovellag ville ikke stoppet magneten. Produktet er dessuten et nytt, ensartet stoff, ikke jernkorn med skall.',
      },
      explain: 'Fe + S → FeS. Jern- og svovelatomene er bundet sammen i jernsulfid, som har nye egenskaper: svart, sprøtt og praktisk talt ikke magnetisk (trekker magneten svakt i produktet fra et skoleforsøk, skyldes det som regel litt jern som ikke har reagert). Det er det klassiske skillet: i en blanding beholder stoffene egenskapene sine, i en forbindelse får du et nytt stoff.',
    },
    {
      id: 'stoffer.stoff.08', region: R, topic: T_STOFF, concepts: ['egenskap'], level: 2, type: 'sort',
      prompt: 'Er dette en **fysisk** eller en **kjemisk** egenskap?',
      buckets: ['Fysisk egenskap', 'Kjemisk egenskap'],
      items: [
        { t: 'Smeltepunkt', b: 0 },
        { t: 'Tetthet', b: 0 },
        { t: 'Farge', b: 0 },
        { t: 'Brennbarhet', b: 1 },
        { t: 'Leder strøm', b: 0 },
        { t: 'Reagerer med syre', b: 1 },
        { t: 'Ruster i fuktig luft', b: 1 },
        { t: 'Løselighet i vann', b: 0 },
      ],
      explain: 'Fysiske egenskaper kan måles uten at stoffet blir et annet stoff: smeltepunkt, tetthet, farge, ledningsevne og løselighet. Kjemiske egenskaper viser seg bare når stoffet reagerer – brennbarhet, reaksjon med syre, rusting. Når du har målt en kjemisk egenskap, har du ikke lenger det samme stoffet.',
    },
    {
      id: 'stoffer.stoff.09', region: R, topic: T_STOFF, concepts: ['kjemisk-reaksjon', 'faseovergang-partikler'], level: 3, type: 'sort',
      myth: 'myte.faseovergang-er-reaksjon',
      prompt: 'Fysisk endring eller kjemisk reaksjon?',
      buckets: ['Fysisk endring', 'Kjemisk reaksjon'],
      items: [
        { t: 'Is smelter', b: 0 },
        { t: 'Et stearinlys brenner', b: 1 },
        { t: 'Sukker løses i te', b: 0 },
        { t: 'Jern ruster', b: 1 },
        { t: 'Vann koker', b: 0 },
        { t: 'Brødet får brun skorpe i ovnen', b: 1 },
        { t: 'Natron og eddik bruser', b: 1 },
        { t: 'Tørris blir borte i romluft', b: 0 },
      ],
      explain: 'Kjemisk reaksjon = nye stoffer dannes: brenning (CO₂ og H₂O), rust (jernoksid), bruning av brødskorpe og CO₂-gass fra natron og eddik. Smelting, koking, oppløsning og sublimasjon av tørris (fast CO₂ → CO₂-gass) gir ingen nye stoffer. Bobler betyr ikke alltid reaksjon – i kokende vann er boblene vanndamp.',
    },
    {
      id: 'stoffer.stoff.10', region: R, topic: T_STOFF, concepts: ['stoff', 'kjemisk-forbindelse'], level: 1, type: 'mc',
      prompt: 'Hva menes med et **organisk** stoff i kjemi?',
      options: [
        'En karbonforbindelse, med noen enkle unntak som CO₂',
        'Et stoff som er laget av en levende organisme',
        'Et naturlig stoff uten kunstige eller syntetiske tilsetninger',
        'Et stoff som brytes raskt ned i naturen',
      ],
      answer: 0,
      why: {
        1: 'Dette var den gamle definisjonen. Wöhler laget urea av uorganiske stoffer i 1828, og i dag lages mange organiske stoffer (plast, medisiner) i fabrikker.',
        2: 'Dette er hverdagsbetydningen fra «organisk/økologisk mat». Kjemisk sett er plast organisk og bordsalt uorganisk, uansett opphav.',
        3: 'Mange organiske stoffer, som plast, brytes svært sakte ned. Nedbrytbarhet er ikke definisjonen.',
      },
      explain: 'Organisk kjemi er karbonkjemi: stoffer bygd rundt kjeder og ringer av karbon, som sukker, fett, proteiner, etanol og plast. Uorganiske stoffer er resten – salter, metaller, vann og enkle karbonforbindelser som CO₂ og CaCO₃.',
    },
    {
      id: 'stoffer.stoff.11', region: R, topic: T_STOFF, concepts: ['rent-stoff', 'blanding'], level: 4, type: 'mc',
      prompt: 'En elev sier: «Vannet fra springen er helt rent, så det er et rent stoff.» Hva er det faglig beste svaret?',
      options: [
        'Springvann er en blanding; «rent» betyr her trygt å drikke',
        'Eleven har rett: drikkevann er renset og består bare av H₂O-molekyler',
        'Springvann er en kjemisk forbindelse av vann og mineraler',
        'Springvann er et grunnstoff, fordi vann er et av de fire elementene',
      ],
      answer: 0,
      why: {
        1: 'Vannverket fjerner bakterier og partikler, men oppløste ioner (Ca²⁺, Mg²⁺, Cl⁻ …) og gasser som O₂ blir igjen. Damp inn springvann, og du ser et hvitt belegg.',
        2: 'Mineralene er ikke kjemisk bundet til vannmolekylene. De er oppløst og kan skilles ut ved inndamping – altså en blanding.',
        3: 'De fire elementene er en historisk idé. Vann er en forbindelse av hydrogen og oksygen, og springvann er dessuten en blanding.',
      },
      explain: 'Her møtes hverdagsspråk og fagspråk. «Rent» betyr i hverdagen trygt og uten skitt; «rent stoff» i kjemi betyr én type partikler. Destillert vann er et rent stoff, mens springvann og flaskevann er blandinger. Kalkbelegget i vannkokeren er rester av de oppløste stoffene.',
    },
    {
      id: 'stoffer.stoff.12', region: R, topic: T_STOFF, concepts: ['rent-stoff', 'egenskap', 'blanding'], level: 4, type: 'multi',
      prompt: 'Du har en ukjent, klar væske. Hvilke observasjoner tyder på at den er et **rent stoff**?',
      options: [
        'Temperaturen står stille mens væsken koker',
        'Væsken fryser ved én bestemt temperatur',
        'Det blir ingen rest igjen når en dråpe dampes inn',
        'Væsken er klar og gjennomsiktig',
        'Væsken lukter ingenting',
      ],
      answer: [0, 1, 2],
      explain: 'Et rent stoff har faste egenskaper: bestemt smelte- og kokepunkt, og temperaturen står stille under faseovergangen. En løsning koker over et temperaturintervall og etterlater ofte rest når den dampes inn. Klar og luktfri sier lite: saltvann og sukkervann er også klare og luktfrie.',
    },
    {
      id: 'stoffer.stoff.13', region: R, topic: T_STOFF, concepts: ['grunnstoff', 'kjemisk-forbindelse', 'blanding'], level: 5, type: 'mc',
      myth: 'myte.blanding-er-forbindelse',
      prompt: 'Klassen sorterer stoffkort. Selma legger «vann» under *grunnstoff* og sier: «Vann er jo et av de fire elementene!» Hvilket lærergrep gir henne best grunnlag for å endre forestillingen?',
      options: [
        'Anerkjenne den historiske ideen, og vise elektrolyse av vann til to gasser',
        'Si at svaret er feil, og be henne lære definisjonen av grunnstoff utenat til neste time',
        'Forklare at vann egentlig er en blanding av hydrogengass og oksygengass',
        'Vise at vann koker ved nøyaktig 100 °C, slik bare grunnstoffer gjør',
      ],
      answer: 0,
      why: {
        1: 'Å rette uten evidens gir ofte et pugget svar som lever side om side med den gamle forestillingen. Hun trenger noe som kan overbevise henne.',
        2: 'Dette er en ny misoppfatning: vann er en forbindelse, ikke en blanding. Det finnes ingen hydrogengass eller oksygengass i vannet.',
        3: 'Alle rene stoffer, også forbindelser, har bestemte kokepunkter. Kokepunktet skiller ikke grunnstoff fra forbindelse.',
      },
      explain: 'Ta forestillingen på alvor – den har en lang historie – og gi evidens. Elektrolyse spalter vann til hydrogen og oksygen i volumforholdet 2 : 1, som stemmer med formelen H₂O. Da kobles makro (to gasser), mikro (H₂O-molekyler brytes, nye bindinger dannes) og representasjon (2H₂O → 2H₂ + O₂).',
    },
  ]);

  /* =====================================================================
     ATOMET OG ISOTOPER
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.atom.01', region: R, topic: T_ATOM, concepts: ['proton', 'grunnstoff'], level: 1, type: 'mc',
      prompt: 'Hva bestemmer hvilket **grunnstoff** et atom er?',
      options: ['Antall protoner', 'Antall nøytroner', 'Antall elektroner', 'Nukleontallet'],
      answer: 0,
      why: {
        1: 'Ulikt antall nøytroner gir ulike isotoper av samme grunnstoff, ikke nye grunnstoffer.',
        2: 'Elektronantallet endres når atomet blir et ion, men Cl⁻ er fortsatt klor.',
        3: 'Nukleontallet (protoner + nøytroner) skiller isotoper. Klor-35 og klor-37 er begge klor.',
      },
      explain: 'Atomnummeret (Z) er antall protoner, og det definerer grunnstoffet. Alle atomer med 17 protoner er klor, og alle med 6 er karbon – uansett antall nøytroner eller elektroner.',
    },
    {
      id: 'stoffer.atom.02', region: R, topic: T_ATOM, concepts: ['atom', 'proton', 'elektron'], level: 1, type: 'tf',
      prompt: 'Et atom er elektrisk nøytralt fordi nøytronene opphever ladningen til protonene.',
      answer: false,
      explain: 'Usant. Nøytronene har ladning 0 og endrer ikke summen. Atomet er nøytralt fordi det har like mange elektroner (−1 hver) som protoner (+1 hver). Navnet «nøytron» betyr bare at partikkelen selv er uladet.',
    },
    {
      id: 'stoffer.atom.03', region: R, topic: T_ATOM, concepts: ['atom', 'proton', 'elektron'], level: 2, type: 'mc',
      prompt: 'Hvor sitter nesten all **massen** i et atom?',
      options: ['I kjernen', 'I elektronskyen', 'Jevnt fordelt i hele atomet', 'I det ytterste elektronskallet'],
      answer: 0,
      why: {
        1: 'Elektronskyen tar nesten hele volumet, men elektronet har bare ca. 1/2000 av massen til et proton. Stort volum betyr ikke stor masse.',
        2: 'Atomet er ingen kompakt kule. Det er nesten bare tomrom rundt en bitte liten, tett kjerne.',
        3: 'Ytterelektronene er viktige for kjemien, men bidrar nesten ingenting til massen.',
      },
      explain: 'Protoner og nøytroner veier ca. 1 u hver, elektronet bare ca. 1/1836 u. Over 99,9 % av massen sitter derfor i kjernen, som bare utgjør en ørliten del av volumet.',
    },
    {
      id: 'stoffer.atom.04', region: R, topic: T_ATOM, concepts: ['proton', 'isotop'], level: 3, type: 'num',
      prompt: 'Aluminium har atomnummer 13. Hvor mange **nøytroner** har et atom av aluminium-27?',
      answer: 14, abs: 0.1, unit: '', hint: 'Nøytroner = nukleontall − atomnummer',
      explain: 'Nukleontallet 27 er protoner + nøytroner. Atomnummeret 13 gir 13 protoner, så nøytronene er 27 − 13 = 14.',
    },
    {
      id: 'stoffer.atom.05', region: R, topic: T_ATOM, concepts: ['proton', 'isotop'], level: 4, type: 'num',
      prompt: 'Jod-127 er den stabile jodisotopen i jodtabletter. Jod har atomnummer 53. Hvor mange **nøytroner** har et ¹²⁷I-atom?',
      answer: 74, abs: 0.1, unit: '', hint: 'Nukleontall − protoner',
      explain: '127 − 53 = 74 nøytroner. Tunge atomer har flere nøytroner enn protoner – nøytronene bidrar til å holde den store kjernen sammen mot frastøtningen mellom protonene.',
    },
    {
      id: 'stoffer.atom.06', region: R, topic: T_ATOM, concepts: ['ion', 'elektron', 'proton'], level: 4, type: 'num',
      prompt: 'Jern (Z = 26) danner blant annet ionet Fe³⁺. Hvor mange **elektroner** har ett Fe³⁺-ion?',
      answer: 23, abs: 0.1, unit: '', hint: 'Ladningen +3 betyr tre elektroner færre enn protoner',
      explain: 'Et nøytralt jernatom har 26 elektroner. Fe³⁺ har avgitt tre, så det har 23 elektroner og fortsatt 26 protoner: 26 − 23 = +3. Jern er et innskuddsmetall og kan også danne Fe²⁺.',
    },
    {
      id: 'stoffer.atom.07', region: R, topic: T_ATOM, concepts: ['ion', 'elektron', 'elektronskall'], level: 4, type: 'num',
      prompt: 'Svovel (Z = 16) danner sulfidionet S²⁻. Hvor mange **elektroner** har ett S²⁻-ion?',
      answer: 18, abs: 0.1, unit: '',
      explain: 'Svovel har 16 elektroner (2, 8, 6). Det tar opp 2 og får 18 (2, 8, 8) – samme elektronfordeling som argon. Ladningen er 16 − 18 = −2.',
    },
    {
      id: 'stoffer.atom.08', region: R, topic: T_ATOM, concepts: ['ion', 'proton', 'elektron'], level: 4, type: 'num',
      prompt: 'Et ion har 12 protoner, 12 nøytroner og 10 elektroner. Hva er **ladningen** til ionet? Skriv et tall med fortegn (f.eks. −1 eller 3).',
      answer: 2, abs: 0.1, unit: '', hint: 'Ladning = protoner − elektroner',
      explain: '12 − 10 = +2. Tolv protoner betyr magnesium, og ionet er Mg²⁺ (magnesium-24). Nøytronene påvirker ikke ladningen.',
    },
    {
      id: 'stoffer.atom.09', region: R, topic: T_ATOM, concepts: ['atom'], level: 3, type: 'mc',
      prompt: 'Tenk deg at atomkjernen forstørres til en ert på 1 cm. Omtrent hvor langt unna er da de ytterste elektronene?',
      options: ['Ca. 1 km', 'Ca. 1 cm', 'Ca. 10 cm', 'Ca. 1 m'],
      answer: 0,
      why: {
        1: 'Lærebokfigurer med tette skall gir inntrykk av at elektronene ligger like ved kjernen. Skalaen er sterkt fortegnet.',
        2: 'Fortsatt altfor lite. Atomet er omtrent 10 000–100 000 ganger større enn kjernen.',
        3: 'Fortsatt for lite. Elektronene er så langt ute at atomet er nesten bare tomrom.',
      },
      explain: 'Atomet er nesten tomt. Kjernen har en diameter på rundt 10⁻¹⁵–10⁻¹⁴ m, atomet rundt 10⁻¹⁰ m. Med kjernen som en ert er atomet på størrelse med et stadion eller mer. Det er en fin anledning til å diskutere at modelltegninger aldri viser riktig skala.',
    },
    {
      id: 'stoffer.atom.10', region: R, topic: T_ATOM, concepts: ['elektronskall', 'elektron'], level: 3, type: 'mc',
      prompt: 'Hva er elektronskallene i skallmodellen egentlig et uttrykk for?',
      options: [
        'Områder der sannsynligheten for å finne elektronene er stor',
        'Faste sirkelbaner som elektronene går i, som planeter rundt sola',
        'Fysiske kuleskall av et eget materiale',
        'Lagene der protonene og nøytronene ligger',
      ],
      answer: 0,
      why: {
        1: 'Dette er planetmodellen, som skallmodellen ofte forveksles med. Elektronene har ingen bestemte baner.',
        2: 'Modellen tas bokstavelig. Skallene er en måte å ordne elektronene etter energi, ikke ting.',
        3: 'Protonene og nøytronene er i kjernen. Skallene gjelder elektronene.',
      },
      explain: 'Skallmodellen er en forenkling av en kvantemekanisk sky-/sannsynlighetsmodell. Den er nyttig fordi den forklarer ytterelektroner, grupper og ioner, men den har begrensninger – et godt eksempel på at modeller har styrker og svakheter.',
    },
    {
      id: 'stoffer.atom.11', region: R, topic: T_ATOM, concepts: ['elektronskall', 'periodesystemet'], level: 3, type: 'mc',
      prompt: 'Hva er elektronfordelingen til kalium (Z = 19)?',
      options: ['2, 8, 8, 1', '2, 8, 9', '2, 9, 8', '2, 8, 18, 1'],
      answer: 0,
      why: {
        1: 'M-skallet kan ha 18 elektroner (2n²), men et ytterskall har maks 8. Elektron nr. 19 havner derfor i N-skallet.',
        2: 'Skallene fylles innenfra: L-skallet har plass til 8, ikke 9.',
        3: 'Da blir summen 2 + 8 + 18 + 1 = 29 – det er kobber, ikke kalium.',
      },
      explain: 'K 2, L 8, M 8, N 1. Ytterskallsregelen (maks 8 ytterst) gjør at kalium får ett ytterelektron, akkurat som Li (2, 1) og Na (2, 8, 1). Derfor står kalium i gruppe 1 og oppfører seg som et alkalimetall.',
    },
    {
      id: 'stoffer.atom.12', region: R, topic: T_ATOM, concepts: ['atom', 'kjemiens-tre-nivaer', 'egenskap'], level: 5, type: 'mc',
      myth: 'myte.atomer-har-stoffets-egenskaper',
      prompt: 'I en modelltegning farger Jonas kobberatomene rødbrune «fordi kobber er rødbrunt». Hvilken oppfølging er faglig og didaktisk best?',
      options: [
        'Spørre om ett atom kan ha farge, og knytte farge til makronivået',
        'Rose tegningen: kobberatomene må være rødbrune, ellers ville ikke kobber vært det',
        'Be ham bruke grått i stedet, fordi alle atomer egentlig er grå',
        'Si at farger ikke er viktige i kjemi, og gå videre',
      ],
      answer: 0,
      why: {
        1: 'Dette forsterker misoppfatningen. Stoffets egenskaper er ikke summen av små utgaver av samme egenskap hos atomene.',
        2: 'Atomer er ikke grå heller. Farge er ikke en egenskap ved enkeltatomer, så det finnes ingen «riktig atomfarge».',
        3: 'Da går han glipp av en god anledning til å skille makro og mikro – kjernen i kjemiens tre nivåer.',
      },
      explain: 'Elever overfører ofte makroegenskaper til partikler (Kjemi fagdidaktikk kap. 2). Fargen til kobber oppstår når lys vekselvirker med elektronene i metallet som helhet. Farger i modeller er konvensjoner – i kalottmodeller er O rød og C svart – ikke virkelige farger. Gjør nivåskiftet eksplisitt: «På makronivå er kobber rødbrunt – hva skjer på mikronivå?»',
    },

    /* ---------- Isotoper ---------- */
    {
      id: 'stoffer.iso.01', region: R, topic: T_ATOM, concepts: ['isotop', 'proton'], level: 2, type: 'mc',
      prompt: 'Hva er **isotoper**?',
      options: [
        'Atomer av samme grunnstoff med ulikt antall nøytroner',
        'Atomer med samme antall nøytroner, men ulikt antall protoner',
        'Atomer av samme grunnstoff med ulik ladning',
        'Ulike grunnstoffer i samme gruppe i periodesystemet',
      ],
      answer: 0,
      why: {
        1: 'Rollene er snudd. Ulikt antall protoner gir ulike grunnstoffer.',
        2: 'Ulik ladning betyr ulikt antall elektroner – det er ioner, ikke isotoper.',
        3: 'Det er en familie (gruppe), for eksempel halogenene. Isotoper er samme grunnstoff.',
      },
      explain: '«Iso» = samme, «topos» = sted: isotopene står på samme plass i periodesystemet. Klor-35 (17 p, 18 n) og klor-37 (17 p, 20 n) er isotoper av klor.',
    },
    {
      id: 'stoffer.iso.02', region: R, topic: T_ATOM, concepts: ['isotop', 'periodesystemet'], level: 4, type: 'num',
      prompt: 'Omtrent 3 av 4 kloratomer er klor-35, resten er klor-37. Regn ut den gjennomsnittlige atommassen til klor. Regn hver isotop som like mange u som nukleontallet.',
      answer: 35.5, abs: 0.05, unit: 'u', hint: '(3 · 35 + 1 · 37) / 4',
      explain: 'Veid gjennomsnitt: 0,75 · 35 u + 0,25 · 37 u = 35,5 u. Tabellverdien er 35,45 u fordi den virkelige andelen klor-35 er ca. 76 %, og isotopmassene ikke er helt lik nukleontallet.',
    },
    {
      id: 'stoffer.iso.03', region: R, topic: T_ATOM, concepts: ['isotop'], level: 4, type: 'num',
      prompt: 'Bor består av ca. 20 % bor-10 og 80 % bor-11. Hva blir den gjennomsnittlige atommassen? Regn hver isotop som like mange u som nukleontallet.',
      answer: 10.8, abs: 0.05, unit: 'u', hint: '0,20 · 10 + 0,80 · 11',
      explain: '0,20 · 10 u + 0,80 · 11 u = 2,0 u + 8,8 u = 10,8 u. Tabellverdien er 10,81 u. Atommassen ligger nærmest den vanligste isotopen.',
    },
    {
      id: 'stoffer.iso.04', region: R, topic: T_ATOM, concepts: ['isotop'], level: 4, type: 'num',
      prompt: 'Klor har atommasse 35,45 u og består av klor-35 og klor-37. Hvor mange **prosent** av kloratomene er klor-35? (Regn med isotopmasser 35 u og 37 u.)',
      answer: 77.5, abs: 0.6, unit: '%', hint: '35x + 37(1 − x) = 35,45',
      explain: '35x + 37 − 37x = 35,45 gir 2x = 1,55 og x = 0,775, altså 77,5 %. Boka forenkler til «ca. 3 av 4» (75 %). Med nøyaktige isotopmasser (34,97 u og 36,97 u) blir svaret ca. 76 %.',
    },
    {
      id: 'stoffer.iso.05', region: R, topic: T_ATOM, concepts: ['isotop', 'periodesystemet'], level: 3, type: 'mc',
      prompt: 'Hvorfor står atommassen til klor som 35,45 u og ikke som et helt tall?',
      options: [
        'Det er et veid gjennomsnitt av isotopene slik de forekommer i naturen',
        'Elektronene i kloratomet veier til sammen 0,45 u',
        'Kloratomet har 35,45 protoner og nøytroner i snitt fordi partiklene kan deles',
        'Det er en avrundingsfeil som ikke er rettet opp',
      ],
      answer: 0,
      why: {
        1: 'Elektronene er altfor lette. 17 elektroner veier under 0,01 u til sammen.',
        2: 'Protoner og nøytroner kan ikke deles. Hvert enkelt atom har et helt antall – det er gjennomsnittet over mange atomer som blir et desimaltall.',
        3: 'Tabellverdien er svært nøyaktig målt. Desimalene forteller noe om isotopfordelingen.',
      },
      explain: 'Ca. 3/4 klor-35 og 1/4 klor-37 gir et gjennomsnitt nær 35,5 u. Ingen enkeltatomer veier 35,45 u – akkurat som ingen familie har 1,8 barn.',
    },
    {
      id: 'stoffer.iso.06', region: R, topic: T_ATOM, concepts: ['isotop', 'elektron'], level: 3, type: 'tf',
      prompt: 'Karbon-14 og karbon-12 reagerer kjemisk nesten likt, fordi de har like mange elektroner.',
      answer: true,
      explain: 'Sant. Kjemien bestemmes av elektronene, og begge isotopene har 6. Forskjellen er to ekstra nøytroner i kjernen hos karbon-14, som gjør den tyngre og radioaktiv. Derfor tas karbon-14 opp i planter og dyr akkurat som karbon-12 – grunnlaget for karbondatering.',
    },
    {
      id: 'stoffer.iso.07', region: R, topic: T_ATOM, concepts: ['isotop'], level: 4, type: 'mc',
      prompt: 'Kobber har atommasse 63,55 u. 69 % av kobberatomene er kobber-63. Hvilken er den andre stabile isotopen?',
      options: ['Kobber-65', 'Kobber-64', 'Kobber-66', 'Kobber-62'],
      answer: 0,
      why: {
        1: 'Det kan virke som at noe «like over 63,5» må være 64, men da glemmer man vektingen: 0,69 · 63 + 0,31 · 64 = 63,31 u, som er for lite.',
        2: '0,69 · 63 + 0,31 · 66 = 63,93 u – for mye.',
        3: 'En isotop lettere enn 63 ville trukket snittet under 63, men snittet er 63,55 u.',
      },
      explain: '0,31 · x = 63,55 − 0,69 · 63 = 20,08, så x ≈ 64,8, som betyr kobber-65. Kontroll: 0,69 · 63 + 0,31 · 65 = 63,62 u – nær tabellverdien (de virkelige isotopmassene er litt under nukleontallet).',
    },
    {
      id: 'stoffer.iso.08', region: R, topic: T_ATOM, concepts: ['isotop', 'proton', 'elektron'], level: 3, type: 'multi',
      prompt: 'Vanlig hydrogen (¹H) og deuterium (²H) er isotoper. Hva har atomene **felles**?',
      options: [
        'Antall protoner',
        'Antall elektroner (som nøytrale atomer)',
        'Plassen i periodesystemet',
        'Antall nøytroner',
        'Massen',
      ],
      answer: [0, 1, 2],
      explain: 'Begge har 1 proton og 1 elektron og står på samme plass i periodesystemet. Deuterium har i tillegg 1 nøytron og omtrent dobbelt så stor masse – derfor kalles D₂O «tungtvann».',
    },
    {
      id: 'stoffer.iso.09', region: R, topic: T_ATOM, concepts: ['isotop', 'grunnstoff', 'proton'], level: 5, type: 'mc',
      prompt: 'En elev sier: «Klor-37 må være et annet grunnstoff enn klor-35, siden atomene er forskjellige.» Hva er den beste forklaringen å gi?',
      options: [
        'Begge har 17 protoner, så begge er klor; bare massen er ulik',
        'Eleven har rett, fordi ulikt nukleontall betyr ulikt grunnstoff',
        'Klor-37 er et ion av klor, fordi det har flere partikler i kjernen',
        'Klor-37 er radioaktivt og regnes derfor som et eget grunnstoff',
      ],
      answer: 0,
      why: {
        1: 'Nukleontallet skiller isotoper, ikke grunnstoffer. Bare protontallet avgjør hvilket grunnstoff det er.',
        2: 'Et ion har ulikt antall protoner og elektroner. Klor-37-atomet har 17 av hvert og er nøytralt – det har bare to nøytroner mer.',
        3: 'Klor-37 er stabilt. Og selv radioaktive isotoper, som karbon-14, er samme grunnstoff.',
      },
      explain: 'Isotopbegrepet binder sammen tre ideer: protoner = identitet, nøytroner = masse, elektroner = kjemi. Atomfilmen oppsummerer: «Protonene bestemmer grunnstoffet, nøytronene gir isotoper, elektronene gir ioner og kjemi.» Det er et nyttig nettverk å bygge eksplisitt med elevene.',
    },
  ]);

  /* =====================================================================
     PERIODESYSTEMET
     ===================================================================== */
  NG.content.addQuestions([
    {
      id: 'stoffer.ps.01', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall'], level: 1, type: 'mc',
      prompt: 'Hva forteller **periodenummeret** (raden) i periodesystemet?',
      options: ['Antall elektronskall', 'Antall ytterelektroner', 'Antall protoner', 'Når grunnstoffet ble oppdaget'],
      answer: 0,
      why: {
        1: 'Det er gruppen (kolonnen) som henger sammen med antall ytterelektroner.',
        2: 'Antall protoner er atomnummeret, som øker ett for ett bortover hele systemet.',
        3: '«Periode» har her ingenting med tid å gjøre. Det viser til at egenskapene gjentar seg periodisk.',
      },
      explain: 'Periode 3 (Na til Ar) har tre elektronskall. For hver ny periode starter et nytt skall, og egenskapene gjentar seg – derav «periodesystemet».',
    },
    {
      id: 'stoffer.ps.02', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall'], level: 1, type: 'mc',
      prompt: 'Hvorfor ligner grunnstoffene i samme hovedgruppe hverandre kjemisk?',
      options: ['De har like mange ytterelektroner', 'De har like mange protoner', 'De har like mange nøytroner', 'De har omtrent like stor atommasse'],
      answer: 0,
      why: {
        1: 'Like mange protoner betyr samme grunnstoff. Protontallet øker nedover i gruppen.',
        2: 'Nøytroner påvirker ikke kjemien, og antallet øker nedover i gruppen.',
        3: 'Atommassen øker kraftig nedover i en gruppe (Li 6,9 u, Cs 133 u), men egenskapene ligner likevel.',
      },
      explain: 'Det er ytterelektronene som deltar i reaksjoner og bindinger. Alkalimetallene har ett ytterelektron, halogenene sju – derfor reagerer de i hver sin familie på lignende måter.',
    },
    {
      id: 'stoffer.ps.03', region: R, topic: T_PS, concepts: ['periodesystemet', 'proton'], level: 2, type: 'tf',
      prompt: 'Dagens periodesystem er ordnet etter økende atommasse.',
      answer: false,
      explain: 'Usant. Systemet er ordnet etter økende atomnummer (antall protoner) og elektronfordeling. Mendelejev brukte atomvekt i 1869, men Moseley viste i 1913 at atomnummeret er det grunnleggende. Derfor står argon (39,95 u) foran kalium (39,10 u).',
    },
    {
      id: 'stoffer.ps.04', region: R, topic: T_PS, concepts: ['periodesystemet', 'proton', 'isotop'], level: 3, type: 'mc',
      prompt: 'Argon har atommasse 39,95 u og kalium 39,10 u. Likevel står argon (Z = 18) **foran** kalium (Z = 19). Hvorfor?',
      options: [
        'Systemet er ordnet etter atomnummer, ikke etter atommasse',
        'Det er en gammel trykkfeil som har blitt stående av tradisjon',
        'Argon er en gass, og gasser plasseres alltid foran metaller',
        'Atommassene er feilmålt; egentlig er kalium tyngst',
      ],
      answer: 0,
      why: {
        1: 'Rekkefølgen er bevisst. Mendelejev byttet om slike par for at egenskapene skulle passe, og Moseley ga det en forklaring.',
        2: 'Fasen bestemmer ikke plasseringen: brom (væske) og jod (fast stoff) står i samme gruppe som klor (gass).',
        3: 'Verdiene stemmer. Argon er tyngre fordi argon i naturen nesten bare er argon-40, med mange nøytroner.',
      },
      explain: 'Protontallet bestemmer plassen, og elektronfordelingen gir gruppen: kalium (2, 8, 8, 1) har ett ytterelektron og er et alkalimetall; argon (2, 8, 8) har fullt ytterskall og er en edelgass. Isotopfordelingen gjør at atommassen ikke alltid øker i takt med atomnummeret.',
    },
    {
      id: 'stoffer.ps.05', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall', 'ion'], level: 3, type: 'mc',
      prompt: 'Hvorfor reagerer kalium voldsommere med vann enn natrium gjør?',
      options: [
        'Ytterelektronet er lenger fra kjernen og avgis lettere',
        'Kalium har flere ytterelektroner å gi bort',
        'Kalium er lettere enn natrium og flyter bedre på vannet',
        'Kalium har færre protoner som holder på elektronene',
      ],
      answer: 0,
      why: {
        1: 'Begge har ett ytterelektron – de står i gruppe 1.',
        2: 'Kalium er tyngre per atom. Begge flyter fordi metallene har lav tetthet, men det forklarer ikke reaktiviteten.',
        3: 'Kalium har flere protoner (19 mot 11). Avstanden og skjermingen fra de indre skallene veier tyngst.',
      },
      explain: 'Nedover i gruppe 1 får atomene flere skall. Ytterelektronet havner lenger fra kjernen og skjermes av de indre elektronene, så det rives lettere løs. Derfor øker reaktiviteten fra Li til Na til K og videre nedover.',
    },
    {
      id: 'stoffer.ps.06', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall'], level: 3, type: 'mc',
      prompt: 'Hvorfor står helium i gruppe 18, selv om det bare har 2 ytterelektroner?',
      options: [
        'Ytterskallet er fullt, som hos de andre edelgassene',
        'Det er en inkonsekvens i systemet som ingen har rettet',
        'Helium har egentlig 8 ytterelektroner',
        'Helium er et metall, og gruppe 18 er for lette metaller',
      ],
      answer: 0,
      why: {
        1: 'Det er gjennomtenkt: helium plasseres etter egenskaper, og de ligner edelgassenes.',
        2: 'Helium har bare 2 elektroner totalt. Regelen «edelgass = 8» kan ikke brukes blindt.',
        3: 'Helium er en edelgass. Gruppe 2, som også har 2 ytterelektroner, er jordalkalimetallene.',
      },
      explain: 'K-skallet er fullt med 2 elektroner. Helium reagerer derfor nesten ikke, som de andre edelgassene. Eksempelet viser at «siste siffer i gruppenummeret = antall ytterelektroner» er en tommelfingerregel med unntak.',
    },
    {
      id: 'stoffer.ps.07', region: R, topic: T_PS, concepts: ['periodesystemet', 'egenskap'], level: 2, type: 'sort',
      prompt: 'Er dette typisk for et **metall** eller et **ikke-metall**?',
      buckets: ['Metall', 'Ikke-metall'],
      items: [
        { t: 'Leder strøm godt', b: 0 },
        { t: 'Har metallglans', b: 0 },
        { t: 'Kan bankes flatt', b: 0 },
        { t: 'Danner positive ioner', b: 0 },
        { t: 'Er sprøtt i fast form', b: 1 },
        { t: 'Danner negative ioner', b: 1 },
        { t: 'De fleste er gasser', b: 1 },
        { t: 'Isolerer godt', b: 1 },
      ],
      explain: 'Metaller (ca. 2/3 av grunnstoffene) har frie elektroner som gir ledningsevne, glans og formbarhet, og de avgir elektroner og blir positive ioner. Ikke-metallene står øverst til høyre, er sprø eller gasser, isolerer og tar opp elektroner. Unntak finnes: grafitt (karbon) leder strøm.',
    },
    {
      id: 'stoffer.ps.08', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall', 'ion'], level: 4, type: 'mc',
      prompt: 'Et grunnstoff har **tre** elektronskall og **to** ytterelektroner. Hvilket grunnstoff er det, og hvilket ion danner det?',
      options: [
        'Magnesium, som danner Mg²⁺',
        'Beryllium, som danner Be²⁺',
        'Kalsium, som danner Ca²⁺',
        'Svovel, som danner S²⁻',
      ],
      answer: 0,
      why: {
        1: 'Beryllium (2, 2) har to ytterelektroner, men bare to skall – periode 2.',
        2: 'Kalsium (2, 8, 8, 2) har fire skall – periode 4.',
        3: 'Svovel har tre skall, men seks ytterelektroner (2, 8, 6), og tar opp to.',
      },
      explain: 'Tre skall = periode 3; to ytterelektroner = gruppe 2. Det er magnesium (2, 8, 2). Mg avgir de to ytterelektronene og blir Mg²⁺ med neons elektronfordeling (2, 8).',
    },
    {
      id: 'stoffer.ps.09', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall', 'ion'], level: 4, type: 'mc',
      prompt: 'Rubidium står i gruppe 1, periode 5. Hva kan du **forutsi** om stoffet, ut fra periodesystemet alene?',
      options: [
        'Det reagerer enda kraftigere med vann enn kalium og danner Rb⁺-ioner',
        'Det reagerer svakere enn kalium, fordi flere protoner holder bedre på ytterelektronet',
        'Det er en edelgass-lignende og lite reaktiv gass',
        'Det danner Rb⁻-ioner, fordi det har så mange elektroner',
      ],
      answer: 0,
      why: {
        1: 'Fristende resonnement, men avstanden og skjermingen fra fire indre skall veier tyngre enn den økte kjerneladningen.',
        2: 'Edelgassene står i gruppe 18. Gruppe 1 har ett ytterelektron og er svært reaktive metaller.',
        3: 'Totalt antall elektroner er ikke poenget. Ett ytterelektron avgis lettest, så det blir Rb⁺.',
      },
      explain: 'Periodesystemet er en modell som lar deg forutsi: gruppe 1 = ett ytterelektron = +1-ion og reaksjon med vann; lenger ned = ytterelektronet lenger fra kjernen = enda mer reaktivt. Rubidium tar fyr i lufta og reagerer eksplosivt med vann.',
    },
    {
      id: 'stoffer.ps.10', region: R, topic: T_PS, concepts: ['elektron', 'elektronskall', 'grunnstoff'], level: 4, type: 'mc',
      prompt: 'Du skal lage **rødt** fyrverkeri. Hvilket salt bør du bruke?',
      options: ['Et strontiumsalt', 'Et natriumsalt, f.eks. NaCl', 'Et kobbersalt', 'Et kaliumsalt'],
      answer: 0,
      why: {
        1: 'Natrium gir sterk gul flamme, som ofte overdøver andre farger.',
        2: 'Kobber gir blågrønn flamme.',
        3: 'Kalium gir en svak fiolett (lilla) flamme.',
      },
      explain: 'Flammefargene er grunnstoffenes «fingeravtrykk»: Li og Sr rød, Na gul, K fiolett, Cu blågrønn, Ba gulgrønn. Fargen kommer fra metallet – natriumklorid og natriumkarbonat gir den samme gule flammen.',
    },
    {
      id: 'stoffer.ps.11', region: R, topic: T_PS, concepts: ['elektron', 'elektronskall'], level: 3, type: 'mc',
      prompt: 'Hvorfor gir et natriumsalt **gul** flamme?',
      options: [
        'Eksiterte elektroner faller tilbake og sender ut lys med natriums farge',
        'Saltet brenner, og produktet av forbrenningen er gult',
        'Natriumatomer er gule, og fargen blir synlig når de varmes',
        'Flammen blir varmere når saltet tilsettes, og varmere flammer er gulere',
      ],
      answer: 0,
      why: {
        1: 'Saltet brenner ikke – NaCl reagerer ikke med oksygen. Det er atomene som eksiteres i den varme flammen.',
        2: 'Enkeltatomer har ikke farge. Natriummetall er sølvhvitt og bordsalt er hvitt, men begge gir samme gule flamme.',
        3: 'Flammefargen skyldes ikke temperaturen, men energien i bestemte elektronhopp.',
      },
      myth: 'myte.atomer-har-stoffets-egenskaper',
      explain: 'Varmen eksiterer atomene: et elektron løftes ut til et ytre skall. Når det faller tilbake, sendes energiforskjellen ut som lys med en bestemt bølgelengde. Energiforskjellene er ulike for hvert grunnstoff, og derfor får hvert metall sin egen flammefarge.',
    },
    {
      id: 'stoffer.ps.12', region: R, topic: T_PS, concepts: ['elektron', 'kjemiens-tre-nivaer', 'egenskap'], level: 5, type: 'mc',
      myth: 'myte.atomer-har-stoffets-egenskaper',
      prompt: 'Under flammeprøver sier en elev: «Flammen blir gul fordi natrium er gult.» Hvilken respons gir eleven best evidens?',
      options: [
        'Sammenligne hvitt bordsalt og annet natriumsalt i flammen: samme gule farge',
        'Bekrefte at natrium er gult, og la eleven gå videre til neste stoff',
        'Si at flammen bare blir varmere når saltet tilsettes, og derfor ser gulere ut',
        'Forklare at den gule fargen egentlig kommer fra kloret i bordsaltet',
      ],
      answer: 0,
      why: {
        1: 'Da forsterkes forestillingen om at atomer har stoffets farge – og eleven går glipp av mekanismen.',
        2: 'Temperaturen endres knapt. Fargen er knyttet til hvilket metall som er i flammen.',
        3: 'Natriumkarbonat og natriumklorid gir samme gule flamme, mens kobberklorid gir blågrønn. Det er metallet, ikke kloret.',
      },
      explain: 'Gode grep bygger på evidens: stoffer med ulik farge (men samme metall) gir lik flammefarge. Mekanismen ligger på mikronivå – eksiterte elektroner som faller tilbake – mens fargen vi ser, er makronivå. Den samme ideen brukes til å finne grunnstoffer i stjerner.',
    },
    {
      id: 'stoffer.ps.13', region: R, topic: T_PS, concepts: ['elektronegativitet', 'periodesystemet'], level: 4, type: 'order',
      prompt: 'Ordne grunnstoffene i periode 2 etter **økende elektronegativitet** (lavest først).',
      items: ['Litium (Li)', 'Beryllium (Be)', 'Bor (B)', 'Karbon (C)', 'Oksygen (O)', 'Fluor (F)'],
      explain: 'Elektronegativiteten øker bortover en periode (Li 1,0 – Be 1,6 – B 2,0 – C 2,6 – O 3,4 – F 4,0 på Paulings skala). Kjerneladningen øker, mens antall skall er det samme, så atomene trekker hardere på bindingselektronene. Fluor er det mest elektronegative grunnstoffet.',
    },
    {
      id: 'stoffer.ps.14', region: R, topic: T_PS, concepts: ['elektron', 'grunnstoff'], level: 2, type: 'tf',
      prompt: 'Neongass i reklameskilt lyser gult.',
      answer: false,
      explain: 'Usant. Neon gir rødoransje lys. Det gule lyset i gamle gatelys kommer fra natriumdamp. Andre farger i «neonskilt» lages med andre gasser (argon gir blåfiolett) eller med fluorescerende belegg på innsiden av røret. Mekanismen er den samme som ved flammeprøver: eksiterte elektroner faller tilbake og sender ut lys med bestemte farger.',
    },
    {
      id: 'stoffer.ps.15', region: R, topic: T_PS, concepts: ['periodesystemet', 'elektronskall', 'ion'], level: 3, type: 'multi',
      prompt: 'Hvilke påstander om **alkalimetallene** (gruppe 1, uten hydrogen) stemmer?',
      options: [
        'De har ett ytterelektron',
        'De oppbevares under parafin',
        'De blir mer reaktive nedover i gruppen',
        'De danner ioner med ladning −1',
        'De er lite reaktive, som edelgassene',
      ],
      answer: [0, 1, 2],
      explain: 'Alkalimetallene har ett ytterelektron som de avgir lett, så de danner +1-ioner (Li⁺, Na⁺, K⁺). De reagerer med vann og oksygen, og oppbevares derfor under parafin. Reaktiviteten øker nedover fordi ytterelektronet er lenger fra kjernen.',
    },
    {
      id: 'stoffer.ps.16', region: R, topic: T_PS, concepts: ['elektronskall', 'periodesystemet'], level: 3, type: 'num',
      prompt: 'Svovel har atomnummer 16 og står i gruppe 16. Hvor mange **ytterelektroner** har et svovelatom?',
      answer: 6, abs: 0.1, unit: '',
      explain: 'Elektronfordeling 2, 8, 6 – seks ytterelektroner, som også følger av siste siffer i gruppenummeret. Svovel tar derfor opp to elektroner og danner S²⁻, akkurat som oksygen over seg.',
    },
    {
      id: 'stoffer.ps.17', region: R, topic: T_PS, concepts: ['periodesystemet', 'grunnstoff'], level: 5, type: 'mc',
      prompt: 'Før klassen ser en video av cesium i vann, ber du elevene **forutsi** hva som vil skje ut fra cesiums plass i periodesystemet. Hva er den viktigste didaktiske begrunnelsen?',
      options: [
        'De bruker periodesystemet som modell for å forutsi, slik Mendelejev gjorde',
        'Elevene lærer atommassen til cesium utenat, som er grunnlaget for alt videre arbeid',
        'Elevene får se at periodesystemet ofte tar feil, slik at de blir kritiske',
        'Elevene kan senere gjøre forsøket selv på pulten, siden de da vet hva som skjer',
      ],
      answer: 0,
      why: {
        1: 'Utenatlæring av tall er ikke målet. Mønstrene (gruppe, periode, ytterelektroner) er det som gir forklaringskraft.',
        2: 'Forutsigelsen vil stemme – cesium reagerer svært voldsomt. Poenget er å vise hvor godt modellen fungerer.',
        3: 'Cesium er altfor reaktivt for elevforsøk. Risikovurdering sier video eller lærerdemonstrasjon med små mengder Li/Na.',
      },
      explain: 'Forutsi–observere–forklare (POE) gjør modellbruken synlig. Elevene må koble gruppe 1 → ett ytterelektron → avgis lett, og periode 6 → mange skall → elektronet sitter løst. Det er nettopp slik periodesystemet ble overbevisende: Mendelejev forutsa egenskapene til germanium før det ble oppdaget.',
    },
    {
      id: 'stoffer.ps.18', region: R, topic: T_PS, concepts: ['periodesystemet', 'proton', 'elektronskall'], level: 4, type: 'mc',
      prompt: 'Natrium (Z = 11) og klor (Z = 17) har begge tre elektronskall, men kloratomet er mye **mindre**. Hvorfor?',
      options: [
        'Klor har flere protoner, som trekker skallene tettere inn',
        'Klor har flere elektroner, og elektronene trekker hverandre sammen',
        'Klor er en gass, og gassatomer er mindre enn metallatomer',
        'Natrium har flere nøytroner, som tar mye plass',
      ],
      answer: 0,
      why: {
        1: 'Elektroner frastøter hverandre. Det er den økende kjerneladningen som trekker dem innover.',
        2: 'Fasen er en makroegenskap ved stoffet og sier ingenting om størrelsen på enkeltatomene.',
        3: 'Nøytronene sitter i den bitte lille kjernen og påvirker ikke atomets størrelse merkbart. Klor-35 har dessuten flere nøytroner (18) enn natrium-23 (12).',
      },
      explain: 'Bortover en periode øker antall protoner, mens antall skall er det samme. Den økende kjerneladningen trekker elektronene nærmere, så atomene blir mindre mot høyre. Det forklarer også at elektronegativiteten øker bortover en periode.',
    },
  ]);
})();
