/* Mini-spill: HMS-jakten (praksis). Finn farene i en tegnet skolelab, og gjør en enkel
   risikovurdering (sannsynlighet × konsekvens) med tiltak. Kompetansemål: «delta i
   risikovurderinger knyttet til forsøk og følge sikkerhetstiltakene». */
(function () {
  'use strict';
  const ID = 'hmsjakten';

  NG.css(`
.mg-hmsjakten { display: flex; flex-direction: column; gap: 12px; }
.mg-hmsjakten .mg-hms-head { display: flex; flex-direction: column; gap: 4px; }
.mg-hmsjakten .mg-hms-scene { position: relative; border-radius: var(--r-m); border: 2px solid var(--line-strong); overflow: hidden; background: var(--board); }
.mg-hmsjakten .mg-hms-scene svg { display: block; width: 100%; height: auto; touch-action: manipulation; cursor: pointer; user-select: none; -webkit-user-select: none; }
.mg-hmsjakten .c:not([fill]) { fill: none; }
.mg-hmsjakten .c { stroke: var(--chalk); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.mg-hmsjakten .cf { stroke: var(--chalk-faint); }
.mg-hmsjakten .hit { fill: transparent; stroke: none; }
.mg-hmsjakten .mark-bad { fill: none; stroke: var(--bad); stroke-width: 3; }
.mg-hmsjakten .mark-miss { fill: none; stroke: var(--warn); stroke-width: 3; stroke-dasharray: 6 5; }
.mg-hmsjakten .mark-ok { fill: none; stroke: var(--good); stroke-width: 2.5; stroke-dasharray: 3 4; }
.mg-hmsjakten .mark-num { fill: var(--bad); font: 700 13px var(--f-body); }
.mg-hmsjakten .pop { animation: mgHmsPop .3s ease; transform-box: fill-box; transform-origin: center; }
@keyframes mgHmsPop { from { transform: scale(1.6); opacity: 0; } to { transform: none; opacity: 1; } }
.mg-hmsjakten .mg-hms-count { font-family: var(--f-mono); color: var(--r-praksis); }
.mg-hmsjakten .mg-hms-info { min-height: 72px; }
.mg-hmsjakten .mg-hms-grid { display: grid; grid-template-columns: auto repeat(3, 1fr); gap: 4px; align-items: stretch; }
.mg-hmsjakten .mg-hms-grid .ax { font-size: var(--t-xs); color: var(--chalk-dim); display: flex; align-items: center; justify-content: center; text-align: center; padding: 2px; line-height: 1.15; }
.mg-hmsjakten .mg-hms-cell { min-height: 48px; border-radius: 10px; border: 2px solid var(--line-strong); color: var(--chalk); font-weight: 700; font-size: var(--t-xs); cursor: pointer; touch-action: manipulation; padding: 2px; }
.mg-hmsjakten .mg-hms-cell.lav { background: color-mix(in srgb, var(--good) 22%, var(--board-2)); }
.mg-hmsjakten .mg-hms-cell.middels { background: color-mix(in srgb, var(--warn) 24%, var(--board-2)); }
.mg-hmsjakten .mg-hms-cell.hoy { background: color-mix(in srgb, var(--bad) 26%, var(--board-2)); }
.mg-hmsjakten .mg-hms-cell.picked { outline: 3px solid var(--chalk); outline-offset: 1px; }
.mg-hmsjakten .mg-hms-cell.want { border-color: var(--good); border-style: dashed; }
.mg-hmsjakten .mg-hms-cell:disabled { cursor: default; }
.mg-hmsjakten .mg-hms-list { margin: 0; padding-left: 1.2em; }
.mg-hmsjakten .mg-hms-list li { margin: 2px 0; }
.mg-hmsjakten .mg-hms-pill { color: var(--r-praksis); border-color: color-mix(in srgb, var(--r-praksis) 50%, transparent); }
`);

  /* ---------------- Scenarier ---------------- */
  const SCEN = {
    oppvarming: {
      name: 'Oppvarming av kobberkarbonat i reagensrør',
      short: 'Grønt kobberkarbonat varmes over gassbrenner og blir til svart kobberoksid og CO₂.',
      slots: { S1: 'briller', S2: 'har', S3: 'ror', S4: 'etikett', S5: 'mat', S6: 'avfall', S7: 'ganger', S8: null, S9: 'brennbar' },
      gas: false, flame: true, waste: 'glass',
    },
    elektrolyse: {
      name: 'Elektrolyse av kobberkloridløsning',
      short: 'Likestrøm gjennom CuCl₂-løsning: kobber felles ut på katoden, klorgass dannes ved anoden.',
      slots: { S1: 'briller', S2: 'lukt', S3: null, S4: 'etikett', S5: 'mat', S6: 'avfall', S7: 'ganger', S8: 'avtrekk', S9: 'sol' },
      gas: 'klorgass', flame: false, waste: 'kobber',
    },
    syrebase: {
      name: 'Nøytralisering: saltsyre og natronlut',
      short: 'Titrering med indikator. Saltsyren fortynnes fra konsentrert løsning først.',
      slots: { S1: 'briller', S2: 'pipette', S3: null, S4: 'etikett', S5: 'mat', S6: 'avfall', S7: 'ganger', S8: 'avtrekk', S9: 'kant' },
      gas: 'HCl-damp', flame: false, waste: 'glass',
    },
    staalull: {
      name: 'Brenning av stålull',
      short: 'Stålull brennes i gassflammen – massen øker fordi jern reagerer med oksygen.',
      slots: { S1: 'briller', S2: 'har', S3: 'underlag', S4: 'etikett', S5: 'mat', S6: 'avfall', S7: 'ganger', S8: null, S9: 'papir' },
      gas: false, flame: true, waste: 'glod',
    },
  };

  /* Farer. p = sannsynlighet (1–3), k = konsekvens (1–3). ok = godtatte risikonivå. */
  const HAZ = {
    briller: {
      name: 'Mangler vernebriller',
      find: 'Eleven til venstre har ikke vernebriller. Sprut av kjemikalier eller glassbiter kan gi varig øyeskade. Alle i rommet bruker briller så lenge noen jobber med kjemikalier eller varme.',
      safe: 'I orden: eleven bruker vernebriller.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Sprut skjer ofte nok (middels sannsynlighet), og øyeskade er alvorlig → **høy risiko**.',
      tiltak: [
        { t: 'Alle tar på vernebriller før start og har dem på til ryddingen er ferdig.', ok: true },
        { t: 'Bare den som heller eller varmer bruker briller. De som bare ser på, kan stå litt unna benken i stedet.', why: 'Sprut treffer også tilskuere. Regelen gjelder alle i rommet.' },
        { t: 'Skyll øynene i øyedusjen hvis det spruter.', why: 'Det er beredskap (hva vi gjør etterpå), ikke et forebyggende tiltak.' },
      ],
    },
    har: {
      name: 'Langt, løst hår ved åpen flamme',
      find: 'Eleven til høyre har langt, løst hår nær gassflammen. Hår tar lett fyr. Sett opp håret og hold avstand til flammen.',
      safe: 'I orden: håret er satt opp.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Det skjer ikke hver gang, men brannskade i ansiktet er alvorlig → **høy risiko**.',
      tiltak: [
        { t: 'Sett opp håret før gassbrenneren tennes.', ok: true },
        { t: 'Be eleven være ekstra forsiktig og passe godt på håret sitt mens flammen er tent.', why: '«Passe på» er et svakt tiltak. Fjern faren i stedet (sett opp håret).' },
        { t: 'Ha brannteppet klart ved benken, så det er raskt å slukke hvis noe tar fyr.', why: 'Brannteppe er beredskap. Det hindrer ikke at håret tar fyr.' },
      ],
    },
    ror: {
      name: 'Reagensrøret peker mot en medelev',
      find: 'Munningen på reagensrøret peker mot eleven til høyre. Ved støtkoking kan varmt innhold sprute ut. Pek alltid munningen bort fra alle.',
      safe: 'I orden: reagensrøret peker bort fra alle.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Støtkoking er ikke uvanlig, og sprut i ansiktet er alvorlig → **høy risiko**.',
      tiltak: [
        { t: 'Pek munningen bort fra alle, og varm forsiktig mens du beveger røret.', ok: true },
        { t: 'Medeleven tar på seg vernebriller og stiller seg litt lenger unna benken.', why: 'Briller hjelper, men det er bedre å fjerne selve faren: pek røret bort.' },
        { t: 'Varm raskere og kraftigere, så blir oppvarmingen fort ferdig.', why: 'Rask, ujevn oppvarming øker faren for støtkoking.' },
      ],
    },
    brennbar: {
      name: 'Brannfarlig væske ved flammen',
      find: 'Flaska med etanol står like ved gassflammen. Etanoldamp tar lett fyr (CLP-piktogram: flamme). Brannfarlige væsker skal stå langt unna åpen flamme.',
      safe: 'I orden: det er bare et begerglass med vann ved flammen.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Damp kan nå flammen (middels), og brann er alvorlig → **høy risiko**.',
      tiltak: [
        { t: 'Flytt etanolen langt unna flammen, eller dropp åpen flamme.', ok: true },
        { t: 'Sett korken på flaska og la den stå der den står nå, ved siden av brenneren.', why: 'Kork hjelper litt, men flaska skal ikke stå ved flammen i det hele tatt.' },
        { t: 'Skru ned flammen til den nesten ikke synes.', why: 'En liten flamme tenner også damp.' },
      ],
    },
    papir: {
      name: 'Papir og brennbart materiale ved flammen',
      find: 'Arbeidsark og papir ligger like ved flammen der stålulla brenner. Glødende stålull drysser gnister. Hold benken fri for brennbart materiale.',
      safe: 'I orden: det er bare et begerglass med vann ved flammen.',
      p: 2, k: 2, ok: ['middels', 'hoy'],
      risk: 'Gnister lander ofte på benken (middels), og en papirbrann er moderat til alvorlig → **middels til høy risiko**.',
      tiltak: [
        { t: 'Rydd bort papir og annet brennbart fra benken før forsøket starter.', ok: true },
        { t: 'Ha et glass vann klart ved siden av, så dere kan slukke raskt om papiret tar fyr.', why: 'Det er beredskap. Fjern det brennbare først.' },
        { t: 'Hold arket litt unna med hånda mens stålulla brenner.', why: 'Hånda nær gnister og flamme er en ny fare.' },
      ],
    },
    underlag: {
      name: 'Stålull brennes over papir, ikke ildfast underlag',
      find: 'Stålulla brennes over et papirark. Glødende jern holder over 1000 °C. Bruk ildfast plate og tang.',
      safe: 'I orden: stålulla brennes over en ildfast plate.',
      p: 3, k: 2, ok: ['middels', 'hoy'],
      risk: 'Gnister faller nesten alltid (høy), og konsekvensen er brann i papiret → **høy risiko**.',
      tiltak: [
        { t: 'Bruk ildfast plate under og hold stålulla med tang.', ok: true },
        { t: 'Legg to eller tre lag med papir under, så tåler underlaget mer varme.', why: 'Papir brenner uansett tykkelse.' },
        { t: 'Brenn en mindre dott stålull, så blir det færre gnister.', why: 'Mindre dott gir færre gnister, men underlaget må fortsatt være ildfast.' },
      ],
    },
    lukt: {
      name: 'Lukter rett over begeret',
      find: 'Eleven til høyre bøyer seg over begeret og snuser. Klorgass er giftig og irriterer luftveiene. Lukt ved å vifte forsiktig mot deg, og bruk avtrekk.',
      safe: 'I orden: eleven vifter forsiktig med hånda i stedet for å snuse rett over begeret.',
      p: 2, k: 2, ok: ['middels', 'hoy'],
      risk: 'Det skjer lett (middels), og irriterte luftveier er moderat til alvorlig → **middels til høy risiko**.',
      tiltak: [
        { t: 'Gjør forsøket i avtrekk, og lær elevene vifteteknikken.', ok: true },
        { t: 'Be eleven holde pusten mens hun eller han lukter over begeret.', why: 'Det er et svakt tiltak. Gassen skal fjernes med avtrekk.' },
        { t: 'Åpne vinduene etter timen, så lufta i rommet blir byttet ut.', why: 'Det er for sent. Eksponeringen skjer under forsøket.' },
      ],
    },
    pipette: {
      name: 'Pipetterer med munnen',
      find: 'Eleven til høyre suger opp løsning med munnen. Syre eller lut kan komme i munnen. Bruk alltid peleusball eller pipettepumpe.',
      safe: 'I orden: eleven bruker peleusball på pipetten.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Det skjer lett (middels), og etseskade i munnen er alvorlig → **høy risiko**.',
      tiltak: [
        { t: 'Bruk peleusball eller pipettepumpe. Munnpipettering er forbudt.', ok: true },
        { t: 'Sug forsiktig og sakte, og stopp i god tid før væsken når toppen.', why: 'Selv forsiktig suging kan gi væske i munnen.' },
        { t: 'Bruk mer fortynnet løsning, så blir det mindre farlig om noe kommer i munnen.', why: 'Det reduserer konsekvensen litt, men munnpipettering er fortsatt uakseptabelt.' },
      ],
    },
    kant: {
      name: 'Åpen syreflaske på skrå ved kanten',
      find: 'Flaska med konsentrert saltsyre står åpen og ustødig ved benkekanten (CLP: etsende). Sett på korken og plasser flaska trygt inne på benken – helst i avtrekk.',
      safe: 'I orden: flaska står stødig med kork på.',
      p: 2, k: 3, ok: ['hoy'],
      risk: 'Flasker veltes lett (middels), og konsentrert syre gir alvorlige etseskader → **høy risiko**.',
      tiltak: [
        { t: 'Kork på, flaska inn i avtrekket, og bare læreren håndterer konsentrert syre.', ok: true },
        { t: 'Legg tørkepapir under flaska, så tar papiret opp syra hvis den renner over.', why: 'Papir stopper ikke etsende syre.' },
        { t: 'Si til elevene at de må passe seg så de ikke dulter borti flaska ved kanten.', why: '«Ikke dult borti» er et svakt tiltak når faren kan fjernes.' },
      ],
    },
    sol: {
      name: 'Vannsøl ved strømforsyningen',
      find: 'Det er sølt vann rundt strømforsyningen. Den er koblet til 230 V. Vann og strøm hører ikke sammen. Tørk opp, og hold væsker unna elektrisk utstyr.',
      safe: 'I orden: benken rundt strømforsyningen er tørr.',
      p: 1, k: 3, ok: ['middels'],
      risk: 'Det er lite sannsynlig at det går galt (lav), men strømgjennomgang kan være alvorlig → **middels risiko**.',
      tiltak: [
        { t: 'Slå av, tørk opp, og plasser strømforsyningen unna væsker.', ok: true },
        { t: 'Alle tar på laboratoriehansker før de rører strømforsyningen.', why: 'Vanlige laboratoriehansker beskytter ikke mot strøm.' },
        { t: 'Fortsett: det er jo bare lav spenning til elektrodene.', why: 'Spenningen til elektrodene er lav, men strømforsyningen er koblet til 230 V.' },
      ],
    },
    avtrekk: {
      name: 'Gass uten avtrekk',
      find: '', // settes per scenario
      safe: 'I orden: avtrekket står på, og gassutviklende trinn gjøres der.',
      p: 3, k: 2, ok: ['middels', 'hoy'],
      risk: 'Gassen dannes helt sikkert (høy), og konsekvensen er irriterte luftveier (moderat) → **høy risiko**.',
      tiltak: [
        { t: 'Gjør det gassutviklende trinnet i avtrekksskap med avtrekket på.', ok: true },
        { t: 'Åpne vinduene på vidt gap, så gassen luftes ut av rommet underveis.', why: 'Lufting er et svakere tiltak enn avtrekk. Gassen passerer fortsatt ansiktene.' },
        { t: 'Alle bruker vernebriller hele tiden.', why: 'Briller beskytter øynene, ikke luftveiene.' },
      ],
    },
    etikett: {
      name: 'Ukjent stoff uten etikett',
      find: 'Flaska har ingen etikett eller farepiktogram. Ingen vet hva den inneholder eller hvor farlig den er. Alle beholdere skal merkes med navn og CLP-farepiktogram. Informasjon om håndtering står i sikkerhetsdatabladet.',
      safe: 'I orden: flaska er merket med navn og farepiktogram.',
      p: 2, k: 2, ok: ['middels', 'hoy'],
      risk: 'Forveksling skjer (middels), og konsekvensen avhenger av stoffet (moderat–alvorlig) → **middels til høy risiko**.',
      tiltak: [
        { t: 'Ikke bruk stoffet. Læreren identifiserer eller kasserer det, og all merking sjekkes.', ok: true },
        { t: 'Lukt forsiktig på innholdet med vifteteknikken for å finne ut hva det er, og skriv det på.', why: 'Ukjente stoffer skal aldri luktes på eller smakes på for å identifiseres.' },
        { t: 'Skriv «Ukjent» på flaska og sett den tilbake.', why: 'Da gjenstår faren for neste klasse. Stoffet må identifiseres eller kasseres som farlig avfall.' },
      ],
    },
    mat: {
      name: 'Mat og drikke på labbenken',
      find: 'Det står mat eller drikke på labbenken. Kjemikalier kan komme i maten, og mat kan forveksles med reagenser. Mat og drikke skal ikke være på laben.',
      safe: 'I orden: det er en spruteflaske med vann, og den hører hjemme på laben.',
      p: 1, k: 2, ok: ['lav', 'middels'],
      risk: 'Det skjer sjelden (lav), og konsekvensen er moderat → **lav til middels risiko**. Regelen er likevel enkel å følge.',
      tiltak: [
        { t: 'Ingen mat eller drikke på laben. Den legges i sekken eller spises utenfor.', ok: true },
        { t: 'Sett koppen og matpakka helt i andre enden av benken, langt unna forsøket.', why: 'Kjemikalier og mat skal ikke være i samme rom.' },
        { t: 'Det er greit hvis det er lokk på.', why: 'Lokket hindrer ikke at hendene tar med seg kjemikalier til munnen.' },
      ],
    },
    avfall: {
      name: 'Feil avfallshåndtering',
      find: '',
      safe: 'I orden: avfallet går i en merket avfallsbeholder.',
      p: 2, k: 2, ok: ['middels', 'hoy'],
      risk: 'Det skjer lett (middels), og konsekvensen er moderat (kutt, brann eller miljøskade) → **middels risiko**.',
      tiltak: [
        { t: 'Ha merkede avfallsbeholdere klare, og gå gjennom sorteringen før forsøket.', ok: true },
        { t: 'Læreren rydder og sorterer alt avfallet selv etter at elevene har gått.', why: 'Faren oppstår mens elevene rydder. Sortering må planlegges inn i forsøket.' },
        { t: 'Skyll alt ned i vasken med mye vann.', why: 'Tungmetaller og glødende eller skarpt avfall skal ikke i vasken eller søpla.' },
      ],
    },
    ganger: {
      name: 'Sekker blokkerer veien til nødutstyret',
      find: 'Skolesekker ligger på gulvet foran øyedusjen og brannteppet. Du kan snuble, og nødutstyret må være lett å nå. Sekker skal ligge utenfor laben eller i hylle.',
      safe: 'I orden: gulvet er ryddig, og det er fri vei til øyedusj og brannteppe.',
      p: 2, k: 2, ok: ['middels'],
      risk: 'Snubling skjer (middels), og forsinket førstehjelp er moderat til alvorlig → **middels risiko**.',
      tiltak: [
        { t: 'Sekker legges utenfor laben eller i hylle, så veien til nødutstyret er fri.', ok: true },
        { t: 'Skyv sekkene inn under benken eller helt inntil den, så de tar mindre plass.', why: 'Da kan du fortsatt snuble i dem.' },
        { t: 'Gå forsiktig.', why: 'Det er et svakt tiltak. Fjern faren.' },
      ],
    },
  };

  function hazText(id, sc) {
    const h = HAZ[id];
    if (id === 'avtrekk') {
      return sc === 'elektrolyse'
        ? 'Klorgass (grønnlig, stikkende) dannes ved anoden, men forsøket står på benken og avtrekket er av. Elektrolysen skal gjøres i avtrekk.'
        : 'Konsentrert saltsyre avgir stikkende HCl-damp. Fortynningen skjer på benken mens avtrekket står av. Konsentrert syre skal håndteres i avtrekk.';
    }
    if (id === 'avfall') {
      const w = SCEN[sc].waste;
      if (w === 'kobber') return 'Rester av kobberklorid helles i søpla. Kobberforbindelser er miljøfarlige (CLP: miljøfare) og skal i egen merket avfallsbeholder, ikke i søpla eller vasken.';
      if (w === 'glod') return 'Varm, glødende stålull er kastet i papirkurven. Den kan starte en brann etter timen. La den kjøles på ildfast plate, og kast den i metallboks.';
      return 'Knust glass ligger i papirkurven. Renholderen kan skjære seg. Knust glass skal i egen merket glassboks.';
    }
    return h.find;
  }

  /* ---------------- Tegning ---------------- */
  const svgNS = 'http://www.w3.org/2000/svg';
  // Treffrektangler per plass: [x, y, w, h] og markørpunkt.
  const HIT = {
    S1: { r: [[100, 96, 54, 104]], m: [128, 122] },
    S2: { r: [[232, 92, 62, 68]], m: [262, 122] },
    S3: { r: [[154, 150, 76, 58]], m: [192, 180] },
    S4: { r: [[6, 152, 52, 56]], m: [29, 185] },
    S5: { r: [[296, 160, 60, 48]], m: [324, 186] },
    S6: { r: [[4, 252, 82, 76]], m: [40, 292] },
    S7: { r: [[230, 262, 126, 66], [312, 24, 44, 92]], m: [300, 298] },
    S8: { r: [[4, 6, 90, 140], [160, 100, 74, 48]], m: [48, 70] },
    S9: { r: [[226, 160, 46, 48]], m: [248, 186] },
  };

  function drawScene(sc, hazOn) {
    const S = SCEN[sc];
    const on = (slot) => !!S.slots[slot] && hazOn.has(S.slots[slot]);
    const g = [];
    // vegg, vindu, benk, gulv
    g.push('<rect x="0" y="0" width="360" height="330" fill="var(--board)"/>');
    g.push('<rect class="c cf" x="176" y="20" width="62" height="52" rx="3"/><path class="c cf" d="M207 20v52M176 46h62"/>');
    g.push('<path class="c cf" d="M0 262h360"/>');
    g.push('<rect x="0" y="205" width="360" height="9" fill="var(--board-3)"/><path class="c" d="M0 205h360M0 214h360"/>');
    g.push('<path class="c cf" d="M6 214v46M96 214v46M186 214v46M276 214v46M354 214v46"/><path class="c cf" d="M86 236v8M106 236v8M266 236v8M286 236v8"/>');
    // nødutstyr på høyre vegg
    g.push('<rect x="316" y="28" width="36" height="32" rx="4" fill="var(--good)" fill-opacity="0.35" class="c"/><ellipse cx="334" cy="44" rx="10" ry="6" class="c"/><circle cx="334" cy="44" r="2.5" fill="var(--chalk)"/>');
    g.push('<rect x="318" y="70" width="32" height="42" rx="4" fill="var(--bad)" fill-opacity="0.40" class="c"/><path class="c" d="M324 80h20M324 88h20"/>');

    // S8 avtrekksskap
    g.push('<path class="c" d="M40 0v8M58 0v8"/><rect class="c" x="6" y="8" width="86" height="140" rx="4" fill="var(--board-2)"/>');
    g.push('<rect class="c" x="14" y="40" width="70" height="64" rx="2" fill="var(--chalk)" fill-opacity="0.06"/><path class="c cf" d="M14 72h70M22 112h54"/>');
    if (S.slots.S8) {
      const off = on('S8');
      g.push(`<circle cx="80" cy="22" r="6" fill="${off ? 'var(--bad)' : 'var(--good)'}"/><text x="68" y="26" text-anchor="end" font-size="11" font-family="var(--f-mono)" fill="var(--chalk-dim)">${off ? 'AV' : 'PÅ'}</text>`);
      if (off) {
        const col = sc === 'elektrolyse' ? 'var(--r-liv)' : 'var(--chalk-dim)';
        g.push(`<path d="M176 146c-6-8 6-12 0-20s6-12 0-20M194 142c-6-8 6-12 0-20s6-12 0-20M212 146c-6-8 6-12 0-20s6-12 0-20" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`);
      }
    }

    // S4 flaske (etikett)
    g.push('<rect class="c" x="22" y="164" width="12" height="10" fill="var(--board-3)"/><rect class="c" x="16" y="174" width="24" height="31" rx="4" fill="var(--r-stoffer)" fill-opacity="0.22"/>');
    if (!on('S4')) g.push('<rect x="19" y="181" width="18" height="16" fill="var(--chalk)" opacity=".85"/><path d="M28 183l6 6-6 6-6-6z" fill="none" stroke="var(--bad)" stroke-width="1.8"/>');

    // S1 elev til venstre (vernebriller)
    g.push(student(128, 'var(--r-stoffer)', !on('S1'), 'short'));
    g.push('<path class="c" d="M114 156l26 26 14 2"/>');

    // S2 elev til høyre
    const s2 = S.slots.S2;
    if (s2 === 'har') g.push(student(262, 'var(--r-energi)', true, on('S2') ? 'long' : 'bun'));
    else if (s2 === 'lukt' && on('S2')) g.push(student(244, 'var(--r-energi)', true, 'short', 10));
    else g.push(student(262, 'var(--r-energi)', true, 'short'));
    if (s2 === 'pipette') {
      g.push('<path class="c" d="M282 205v-14h18v14" fill="var(--r-stoffer)" fill-opacity="0.25"/>');
      if (on('S2')) g.push('<path d="M262 134L291 200" stroke="var(--chalk)" stroke-width="3" stroke-linecap="round"/><path class="c" d="M276 160l12 4"/>');
      else g.push('<path d="M266 162L291 200" stroke="var(--chalk)" stroke-width="3" stroke-linecap="round"/><circle cx="264" cy="157" r="7" fill="var(--bad)" opacity=".8"/><path class="c" d="M276 160l-8-2"/>');
    } else if (s2 === 'lukt') {
      if (on('S2')) g.push('<path d="M228 140c-4-5 4-8 0-13M220 150c-4-5 4-8 0-13" fill="none" stroke="var(--r-liv)" stroke-width="2" stroke-linecap="round"/>');
      else g.push('<path class="c" d="M276 158l-30 4"/><path d="M236 150a12 12 0 0 1 0 22M228 154a8 8 0 0 1 0 14" fill="none" stroke="var(--chalk-dim)" stroke-width="2" stroke-linecap="round"/>');
    } else {
      g.push('<path class="c" d="M276 158l-14 26-8 4"/>');
    }

    // S3 apparat
    if (sc === 'oppvarming' || sc === 'staalull') {
      g.push('<rect class="c" x="196" y="182" width="12" height="23" fill="var(--board-3)"/><rect class="c" x="188" y="201" width="28" height="4"/>');
      g.push('<path d="M202 182c-8-8-4-16 0-24 4 8 8 16 0 24z" fill="var(--r-energi)" fill-opacity="0.70" stroke="var(--r-energi)" stroke-width="2"/>');
    }
    if (sc === 'oppvarming') {
      if (on('S3')) g.push('<path d="M186 164L244 138" stroke="var(--chalk)" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M188 163L244 138" stroke="var(--board)" stroke-width="4.5" stroke-linecap="round"/><circle cx="192" cy="161" r="3" fill="var(--r-liv)"/><path class="c" d="M154 184L214 151"/>');
      else g.push('<path d="M200 164L184 112" stroke="var(--chalk)" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M199 162L184 112" stroke="var(--board)" stroke-width="4.5" stroke-linecap="round"/><circle cx="198" cy="160" r="3" fill="var(--r-liv)"/><path class="c" d="M154 184L192 138"/>');
    } else if (sc === 'staalull') {
      if (on('S3')) g.push('<path d="M160 203l44-2 2 4-46 2z" fill="var(--chalk)" opacity=".85"/><path d="M166 203h30" stroke="var(--board-3)" stroke-width="1"/>');
      else g.push('<rect x="158" y="198" width="50" height="7" fill="var(--board-4)" class="c"/><path class="c cf" d="M164 205l6-7M174 205l6-7M184 205l6-7M194 205l6-7"/>');
      g.push('<path d="M176 168c6-6 14-2 12 4s-12 6-14 0 6-10 12-6" fill="none" stroke="var(--chalk-dim)" stroke-width="2.4"/><path class="c" d="M154 184L176 172"/>');
      g.push('<circle cx="170" cy="182" r="1.8" fill="var(--r-energi)"/><circle cx="186" cy="190" r="1.8" fill="var(--r-energi)"/><circle cx="178" cy="194" r="1.6" fill="var(--warn)"/><circle cx="192" cy="178" r="1.6" fill="var(--warn)"/>');
    } else if (sc === 'elektrolyse') {
      g.push('<path class="c" d="M168 160v42q0 3 3 3h40q3 0 3-3v-42" /><path d="M170 172h42v30h-42z" fill="var(--r-stoffer)" fill-opacity="0.35"/>');
      g.push('<rect x="178" y="150" width="6" height="46" fill="var(--board-4)" class="c"/><rect x="198" y="150" width="6" height="46" fill="var(--board-4)" class="c"/>');
      g.push('<path d="M181 150c0-14 30-14 50 24M201 150c0-8 20-10 36 26" fill="none" stroke="var(--bad)" stroke-width="1.8"/>');
      g.push('<circle cx="206" cy="182" r="1.8" class="c"/><circle cx="208" cy="174" r="1.5" class="c"/><circle cx="206" cy="166" r="1.3" class="c"/>');
    } else if (sc === 'syrebase') {
      g.push('<rect class="c" x="166" y="200" width="56" height="5"/><path class="c" d="M216 200V60M216 92h-22"/>');
      g.push('<rect class="c" x="188" y="62" width="8" height="104" fill="var(--chalk)" fill-opacity="0.10"/><path class="c" d="M192 166v8M186 168h12"/>');
      g.push('<path class="c" d="M186 176v8l-12 18h36l-12-18v-8z" fill="var(--r-kropp)" fill-opacity="0.40"/>');
    }

    // S9
    if (sc === 'oppvarming') {
      if (on('S9')) g.push(bottle(240, 'var(--r-energi)', true));
      else g.push(beaker(236));
    } else if (sc === 'staalull') {
      if (on('S9')) g.push('<path d="M226 203l36-6 2 6-36 6z" fill="var(--chalk)" opacity=".8"/><path d="M228 198l34-8 2 6-34 8z" fill="var(--chalk)" opacity=".65"/><path class="c cf" d="M234 196l20-4"/>');
      else g.push(beaker(236));
    } else if (sc === 'elektrolyse') {
      g.push('<rect class="c" x="230" y="176" width="36" height="29" rx="3" fill="var(--board-3)"/><circle cx="240" cy="188" r="3.5" fill="var(--bad)"/><circle cx="256" cy="188" r="3.5" fill="var(--chalk)"/>');
      if (on('S9')) g.push('<ellipse cx="248" cy="207" rx="26" ry="4" fill="var(--r-stoffer)" fill-opacity="0.60"/><path d="M236 214v8M258 214v12M246 214v5" stroke="var(--r-stoffer)" stroke-width="2.4" stroke-linecap="round"/>');
    } else if (sc === 'syrebase') {
      if (on('S9')) g.push('<g transform="rotate(22 252 204)">' + bottle(240, 'var(--bad)', false, true) + '</g><path d="M266 210v10" stroke="var(--r-stoffer)" stroke-width="2.4" stroke-linecap="round"/>');
      else g.push(bottle(240, 'var(--bad)', false));
    }

    // S5 mat/drikke
    if (on('S5')) {
      const v = sc.length % 3;
      if (v === 0) g.push('<rect class="c" x="314" y="176" width="18" height="29" rx="3" fill="var(--bad)" fill-opacity="0.45"/><path class="c" d="M316 182h14"/>');
      else if (v === 1) g.push('<path class="c" d="M310 180h22l-3 25h-16z" fill="var(--board-3)"/><path class="c" d="M332 186c8 0 8 10 0 10"/><path class="c cf" d="M316 174c-3-4 3-6 0-10M326 174c-3-4 3-6 0-10"/>');
      else g.push('<path class="c" d="M306 204l18-20 18 20z" fill="var(--r-energi)" fill-opacity="0.35"/><path class="c" d="M312 198h24"/>');
    } else {
      g.push('<path class="c" d="M316 205v-20q0-6 6-6h6q6 0 6 6v20z" fill="var(--chalk)" fill-opacity="0.15"/><path class="c" d="M325 179v-8l12-6"/>');
    }

    // S6 avfall
    if (on('S6')) {
      g.push('<path class="c" d="M14 268h52l-6 54h-40z" fill="var(--board-3)"/>');
      if (S.waste === 'glass') g.push('<path class="c" d="M24 268l6-14 4 14M38 268l8-12 2 12M50 268l-2-10 6 10"/>');
      else if (S.waste === 'kobber') g.push('<path d="M60 238l-14 22" stroke="var(--chalk)" stroke-width="2"/><path class="c" d="M56 226l14 8-6 12-14-8z"/><path d="M46 262q-2 6 2 10" stroke="var(--r-stoffer)" stroke-width="3" fill="none"/><ellipse cx="40" cy="270" rx="18" ry="3" fill="var(--r-stoffer)" fill-opacity="0.60"/>');
      else g.push('<path d="M30 262c4-6 14-6 18 0" fill="none" stroke="var(--chalk-dim)" stroke-width="2.4"/><circle cx="34" cy="262" r="2" fill="var(--r-energi)"/><circle cx="44" cy="260" r="2" fill="var(--warn)"/><path d="M38 254c-4-6 4-8 0-14" fill="none" stroke="var(--chalk-faint)" stroke-width="2"/>');
    } else {
      g.push('<path class="c" d="M18 274h44v48h-44z" fill="var(--board-3)"/><path class="c" d="M28 274v-8h24v8"/><rect x="24" y="284" width="32" height="24" fill="var(--chalk)" opacity=".85"/><path d="M40 287l9 9-9 9-9-9z" fill="none" stroke="var(--bad)" stroke-width="1.8"/>');
    }

    // S7 sekker
    if (on('S7')) {
      g.push('<path class="c" d="M262 322v-34q0-10 12-10h16q12 0 12 10v34z" fill="var(--r-jorda)" fill-opacity="0.40"/><path class="c" d="M270 300h24"/>');
      g.push('<path class="c" d="M310 324l4-30q2-8 12-8h10q10 0 10 8l2 30z" fill="var(--r-liv)" fill-opacity="0.35"/>');
    }

    // treff-flater (usynlige)
    for (const k of Object.keys(HIT)) {
      HIT[k].r.forEach((r) => g.push(`<rect class="hit" data-slot="${k}" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`));
    }
    return `<svg viewBox="0 0 360 330" xmlns="${svgNS}" role="img" aria-label="Skolelab med forsøket ${S.name}">${g.join('')}<g class="marks"></g></svg>`;
  }

  function student(cx, col, goggles, hair, lean) {
    const dy = lean || 0;
    const hy = 120 + dy;
    let s = `<path class="c" d="M${cx - 20} 205l4-52q2-6 8-6h16q6 0 8 6l4 52" fill="${col}" fill-opacity="0.28"/>`;
    s += `<path class="c" d="M${cx} ${hy + 17}v10"/>`;
    if (hair === 'long') s += `<path d="M${cx - 17} ${hy - 4}c-6 24-2 44-10 60M${cx + 17} ${hy - 4}c6 24 4 40 10 52M${cx - 13} ${hy - 8}c-4 30-8 44-16 56" fill="none" stroke="var(--r-energi)" stroke-width="3" stroke-linecap="round"/>`;
    s += `<circle class="c" cx="${cx}" cy="${hy}" r="17" fill="var(--board-3)"/>`;
    if (hair === 'bun') s += `<circle class="c" cx="${cx}" cy="${hy - 22}" r="7" fill="var(--r-energi)" fill-opacity="0.40"/><path class="c" d="M${cx - 16} ${hy - 6}q16-14 32 0"/>`;
    else if (hair === 'long') s += `<path d="M${cx - 17} ${hy - 4}q17-20 34 0" fill="none" stroke="var(--r-energi)" stroke-width="3"/>`;
    else s += `<path class="c" d="M${cx - 16} ${hy - 6}q16-16 32 0"/>`;
    if (goggles) s += `<rect x="${cx - 15}" y="${hy - 4}" width="30" height="10" rx="4" fill="var(--r-praksis)" fill-opacity="0.45" stroke="var(--r-praksis)" stroke-width="2"/>`;
    else s += `<circle cx="${cx - 6}" cy="${hy}" r="2" fill="var(--chalk)"/><circle cx="${cx + 6}" cy="${hy}" r="2" fill="var(--chalk)"/>`;
    s += `<path class="c" d="M${cx - 5} ${hy + 9}q5 3 10 0"/>`;
    return s;
  }
  function bottle(x, col, flame, open) {
    let s = `<rect class="c" x="${x + 2}" y="168" width="10" height="9" fill="var(--board-3)"/>`;
    if (!open) s += `<rect x="${x + 1}" y="164" width="12" height="5" fill="var(--chalk-dim)"/>`;
    s += `<rect class="c" x="${x - 4}" y="177" width="22" height="28" rx="4" fill="${col}" fill-opacity="0.18"/>`;
    s += `<rect x="${x - 1}" y="182" width="16" height="16" fill="var(--chalk)" opacity=".9"/><path d="M${x + 7} 183l7 7-7 7-7-7z" fill="none" stroke="var(--bad)" stroke-width="1.8"/>`;
    if (flame) s += `<path d="M${x + 7} 194c-3-2-2-5 0-7 2 2 3 5 0 7z" fill="var(--board)"/>`;
    return s;
  }
  function beaker(x) {
    return `<path class="c" d="M${x} 180v24h24v-24"/><path d="M${x + 1} 190h22v14h-22z" fill="var(--r-stoffer)" fill-opacity="0.30"/>`;
  }

  /* ---------------- Spillet ---------------- */
  NG.minigames.register({
    id: ID, region: 'praksis', title: 'HMS-jakten', icon: 'goggles',
    concepts: ['pr-risikovurdering', 'pr-tiltakshierarki', 'pr-farepiktogram', 'pr-sikkerhetsdatablad', 'pr-verneutstyr', 'pr-avfall'],
    blurb: 'Finn farene på skolelaben, og gjør en risikovurdering med sannsynlighet × konsekvens.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* lyd er valgfritt */ } };
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      const timers = [];
      let alive = true;

      const sc = rng.pick(Object.keys(SCEN));
      const S = SCEN[sc];
      const slotOf = {}; // fare-id -> plass
      const all = [];
      for (const k of Object.keys(S.slots)) if (S.slots[k]) { slotOf[S.slots[k]] = k; all.push(S.slots[k]); }
      const nHaz = Math.min(all.length, 5 + d);
      const hazards = rng.shuffle(all).slice(0, nHaz);
      const hazOn = new Set(hazards);
      const found = []; // rekkefølge
      const checked = new Set();
      let falseAlarms = 0;
      let phase = 'find';
      const riskRes = []; // {id, cellOk, tiltakOk}
      let qOk = false;

      const wrap = el('div', { class: 'mg-hmsjakten' });
      root.appendChild(wrap);

      function header(sub) {
        return el('div', { class: 'mg-hms-head' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Utforskertårnet · HMS' }), el('span', { class: 'spacer' }), sub ? el('span', { class: 'chip mg-hms-pill', text: sub }) : null]),
          el('h2', { class: 'h-display', text: 'HMS-jakten' }),
        ]);
      }

      /* ---------- Fase 1: finn farene ---------- */
      let svg; let marks; let info; let counter;
      function renderFind() {
        wrap.innerHTML = '';
        wrap.appendChild(header('1 · Finn farene'));
        wrap.appendChild(el('div', { class: 'small', html: '<strong>' + S.name + '.</strong> ' + S.short + ' Trykk på alt som er en <strong>fare</strong>. Det er ' + nHaz + ' farer i bildet.' }));
        const scene = el('div', { class: 'mg-hms-scene', html: drawScene(sc, hazOn) });
        wrap.appendChild(scene);
        svg = scene.querySelector('svg');
        marks = svg.querySelector('.marks');
        svg.addEventListener('click', onTap);
        counter = el('div', { class: 'mg-hms-count', text: '' });
        info = el('div', { class: 'feedback mg-hms-info small', html: 'Se etter mennesker, utstyr, merking, avfall og rømningsveier. Trykk på noe du mener er i orden for å sjekke det.' });
        const doneBtn = el('button', { class: 'btn primary block', id: 'mg-hms-done', text: 'Ferdig med å lete', onclick: () => { sfx('click'); revealMissed(); } });
        wrap.append(el('div', { class: 'row' }, [counter]), info, doneBtn);
        updateCount();
      }
      function updateCount() { counter.textContent = 'Farer funnet: ' + found.length + ' / ' + nHaz + (falseAlarms ? ' · falske alarmer: ' + falseAlarms : ''); }

      function svgPoint(evt) {
        const m = svg.getScreenCTM();
        if (!m) return null;
        const p = svg.createSVGPoint(); p.x = evt.clientX; p.y = evt.clientY;
        return p.matrixTransform(m.inverse());
      }
      function onTap(evt) {
        if (phase !== 'find') return;
        const p = svgPoint(evt);
        if (!p) return;
        let best = null; let bestA = Infinity;
        for (const k of Object.keys(HIT)) {
          for (const r of HIT[k].r) {
            if (p.x >= r[0] && p.x <= r[0] + r[2] && p.y >= r[1] && p.y <= r[1] + r[3]) {
              const a = r[2] * r[3];
              if (a < bestA) { bestA = a; best = k; }
            }
          }
        }
        if (!best) { info.className = 'feedback mg-hms-info small'; info.textContent = 'Ingenting å sjekke akkurat der. Trykk på personer og ting.'; return; }
        tapSlot(best);
      }
      function addMark(slot, cls, label) {
        const [x, y] = HIT[slot].m;
        const c = document.createElementNS(svgNS, 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', cls === 'mark-ok' ? 14 : 22);
        c.setAttribute('class', cls + ' pop');
        marks.appendChild(c);
        if (label) {
          const t = document.createElementNS(svgNS, 'text');
          t.setAttribute('x', x + 16); t.setAttribute('y', y - 16); t.setAttribute('class', 'mark-num');
          t.setAttribute('fill', cls === 'mark-miss' ? 'var(--warn)' : 'var(--bad)');
          t.textContent = label;
          marks.appendChild(t);
        }
      }
      function tapSlot(slot) {
        const id = S.slots[slot];
        if (id && hazOn.has(id)) {
          if (found.includes(id)) { showInfo('bad', HAZ[id].name, hazText(id, sc)); return; }
          found.push(id);
          addMark(slot, 'mark-bad', String(found.length));
          sfx('good');
          showInfo('bad', '⚠ ' + HAZ[id].name, hazText(id, sc));
          updateCount();
          if (found.length === nHaz) {
            const t = setTimeout(() => { if (alive && phase === 'find') { api.toast && api.toast('Alle farene funnet!'); revealMissed(); } }, 900);
            timers.push(t);
          }
          return;
        }
        // Trygt / lokkemiddel
        let txt;
        if (id) txt = HAZ[id].safe;
        else if (slot === 'S8') txt = 'Avtrekksskapet trengs ikke i dette forsøket fordi det ikke dannes giftige gasser. Det er i orden.';
        else if (slot === 'S3') txt = sc === 'elektrolyse' ? 'Elektrolyseoppsettet er i orden: lav likespenning (ca. 4–6 V) og stødig begerglass.' : 'Titreringsoppsettet er i orden: byretten er festet i stativ, og kolben står stødig.';
        else txt = 'Dette ser greit ut.';
        if (!checked.has(slot)) {
          checked.add(slot);
          falseAlarms++;
          addMark(slot, 'mark-ok');
          sfx('bad');
          updateCount();
          showInfo('good', 'Falsk alarm', txt);
        } else showInfo('good', 'I orden', txt);
      }
      function showInfo(kind, title, text) {
        info.className = 'feedback mg-hms-info small ' + kind;
        info.innerHTML = '<strong>' + md(title) + '</strong><br>' + md(text);
      }
      function revealMissed() {
        if (phase !== 'find') return;
        phase = 'reveal';
        const missed = hazards.filter((h) => !found.includes(h));
        missed.forEach((h) => addMark(slotOf[h], 'mark-miss', '!'));
        sfx(missed.length ? 'bad' : 'win');
        const doneBtn = wrap.querySelector('#mg-hms-done');
        if (doneBtn) doneBtn.remove();
        const box = el('div', { class: 'feedback ' + (missed.length ? 'bad' : 'good') + ' stack-s small' });
        box.appendChild(el('strong', { text: missed.length ? 'Du oversåg ' + missed.length + ' fare' + (missed.length > 1 ? 'r' : '') + ' (gul stiplet ring):' : 'Du fant alle farene!' }));
        if (missed.length) {
          const ul = el('ul', { class: 'mg-hms-list' });
          missed.forEach((h) => ul.appendChild(el('li', { html: '<strong>' + HAZ[h].name + '.</strong> ' + md(hazText(h, sc)) })));
          box.appendChild(ul);
        }
        box.appendChild(el('div', { class: 'muted', text: 'Å finne farer er første steg i en risikovurdering. Neste steg er å vurdere hvor alvorlige de er, og velge tiltak.' }));
        info.replaceWith(box);
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'mg-hms-next', text: 'Videre til risikovurdering', onclick: () => { sfx('click'); startRisk(); } }));
        try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
      }

      /* ---------- Fase 2: risikovurdering ---------- */
      const nRisk = d >= 3 ? 3 : 2;
      let riskList = [];
      let riskIdx = 0;
      function startRisk() {
        phase = 'risk';
        const pref = rng.shuffle(found.filter((h) => h !== 'mat'));
        const rest = rng.shuffle(hazards.filter((h) => !pref.includes(h) && h !== 'mat'));
        riskList = pref.concat(rest).slice(0, nRisk);
        riskIdx = 0;
        renderRisk();
      }
      const CAT = (p, k) => { const v = p * k; return v <= 2 ? 'lav' : v <= 4 ? 'middels' : 'hoy'; };
      const CATNAME = { lav: 'lav', middels: 'middels', hoy: 'høy' };
      function renderRisk() {
        const id = riskList[riskIdx];
        const h = HAZ[id];
        wrap.innerHTML = '';
        wrap.appendChild(header('2 · Risikovurdering ' + (riskIdx + 1) + '/' + riskList.length));
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'label', text: 'Fare' }),
          el('div', { html: '<strong>' + h.name + '</strong>' }),
          el('div', { class: 'small muted', text: 'Hvor sannsynlig er det at noe skjer, og hvor alvorlig blir det i så fall? Trykk på én rute. Risiko = sannsynlighet × konsekvens.' }),
        ]));
        const grid = el('div', { class: 'mg-hms-grid', role: 'group', 'aria-label': 'Risikomatrise' });
        const K = [[3, 'Alvorlig'], [2, 'Moderat'], [1, 'Liten']];
        const P = [[1, 'Lav'], [2, 'Middels'], [3, 'Høy']];
        const cells = [];
        K.forEach(([k, kn]) => {
          grid.appendChild(el('div', { class: 'ax', text: kn }));
          P.forEach(([p]) => {
            const cat = CAT(p, k);
            const b = el('button', { class: 'mg-hms-cell ' + cat, 'data-p': p, 'data-k': k, 'aria-label': 'Sannsynlighet ' + p + ', konsekvens ' + kn, text: CATNAME[cat] });
            b.addEventListener('click', () => pickCell(b, p, k));
            cells.push(b);
            grid.appendChild(b);
          });
        });
        grid.appendChild(el('div', { class: 'ax', text: '' }));
        P.forEach(([, pn]) => grid.appendChild(el('div', { class: 'ax', text: pn })));
        wrap.appendChild(el('div', { class: 'row small muted' }, [el('span', { text: '↑ Konsekvens' }), el('span', { class: 'spacer' }), el('span', { text: 'Sannsynlighet →' })]));
        wrap.appendChild(grid);
        const fb = el('div', { class: 'stack' });
        wrap.appendChild(fb);
        let picked = false;
        function pickCell(btn, p, k) {
          if (picked) return;
          picked = true;
          cells.forEach((c) => { c.disabled = true; if (+c.dataset.p === h.p && +c.dataset.k === h.k) c.classList.add('want'); });
          btn.classList.add('picked');
          const ok = h.ok.includes(CAT(p, k));
          sfx(ok ? 'good' : 'bad');
          const res = { id, cellOk: ok, tiltakOk: false };
          riskRes.push(res);
          fb.appendChild(el('div', { class: 'feedback small ' + (ok ? 'good' : 'bad'), html: '<strong>' + (ok ? 'Rimelig vurdering.' : 'Vurder på nytt neste gang.') + '</strong> ' + md(h.risk) + ' <span class="muted">(Stiplet rute = én rimelig plassering. Risikovurdering er et faglig skjønn.)</span>' }));
          // tiltak
          fb.appendChild(el('div', { class: 'label', text: 'Velg det beste tiltaket' }));
          const opts = rng.shuffle(h.tiltak.slice());
          const btns = [];
          opts.forEach((o) => {
            const b = el('button', { class: 'option small', html: md(o.t) });
            b.addEventListener('click', () => {
              if (b.disabled) return;
              btns.forEach((x) => { x.b.disabled = true; if (x.o.ok) x.b.classList.add('correct'); else if (x.b !== b) x.b.classList.add('dim'); });
              if (!o.ok) b.classList.add('wrong');
              res.tiltakOk = !!o.ok;
              sfx(o.ok ? 'good' : 'bad');
              fb.appendChild(el('div', { class: 'feedback small ' + (o.ok ? 'good' : 'bad'), html: o.ok
                ? '<strong>Godt tiltak.</strong> Fjern eller reduser faren først (eliminering eller tekniske tiltak). Verneutstyr og «pass på» kommer sist.'
                : '<strong>Svakere tiltak.</strong> ' + md(o.why || '') }));
              const last = riskIdx >= riskList.length - 1;
              fb.appendChild(el('button', { class: 'btn primary block', id: 'mg-hms-next', text: last ? 'Videre' : 'Neste fare', onclick: () => { sfx('click'); riskIdx++; if (last) renderSds(); else renderRisk(); } }));
              try { fb.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
            });
            btns.push({ b, o });
            fb.appendChild(b);
          });
          try { fb.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
        }
      }

      /* ---------- Fase 3: farepiktogram / sikkerhetsdatablad ---------- */
      function renderSds() {
        phase = 'sds';
        wrap.innerHTML = '';
        wrap.appendChild(header('3 · Merking'));
        const flameQ = S.flame && rng.chance(0.6);
        const q = flameQ ? {
          prompt: 'En flaske er merket med CLP-farepiktogrammet under: rød rombe med flamme. Hva betyr det?',
          fig: '<svg viewBox="0 0 80 80" width="88" height="88" aria-hidden="true"><path d="M40 6l34 34-34 34L6 40z" fill="var(--chalk)" stroke="var(--bad)" stroke-width="5"/><path d="M40 58c-10 0-14-8-10-16 2 4 4 5 6 5-2-8 2-14 8-18 0 6 4 8 6 12 2 4 2 17-10 17z" fill="var(--board)"/><path d="M26 60h28" stroke="var(--board)" stroke-width="3"/></svg>',
          opts: [
            { t: 'Brannfarlig: stoffet eller dampen tar lett fyr.', ok: true },
            { t: 'Varmt innhold: du kan brenne deg hvis du tar på flaska.', why: 'Piktogrammet beskriver stoffets egenskaper, ikke temperaturen på flaska.' },
            { t: 'Oksiderende: stoffet gir næring til brann.', why: 'Oksiderende har en flamme *over en sirkel*. Det er et annet piktogram.' },
          ],
          explain: 'CLP-piktogrammene (rød rombe) gir et raskt varsel. I **sikkerhetsdatabladet** står det mer: farer, verneutstyr, førstehjelp, lagring og avfall. Det er grunnlaget for risikovurderingen.',
        } : {
          prompt: 'Du skal vurdere risikoen ved et kjemikalie i forsøket. Hvor finner du utfyllende opplysninger om farer, verneutstyr, førstehjelp og avfallshåndtering?',
          fig: '',
          opts: [
            { t: 'I sikkerhetsdatabladet (SDS) for stoffet.', ok: true },
            { t: 'Farepiktogrammet på etiketten sier alt som trengs.', why: 'Piktogrammet er et raskt varsel, men sier ikke noe om verneutstyr, førstehjelp eller avfall.' },
            { t: 'I forsøksbeskrivelsen i læreboka.', why: 'Den kan være utdatert og er ikke laget for ditt stoff, din konsentrasjon eller din skole.' },
          ],
          explain: 'Sikkerhetsdatabladet har faste avsnitt om blant annet fareidentifikasjon, førstehjelp, håndtering, verneutstyr og avfall. Skolen skal ha stoffkartotek med datablad for kjemikaliene den har.',
        };
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          q.fig ? el('div', { class: 'row', style: { justifyContent: 'center' }, html: q.fig }) : null,
          el('div', { html: md(q.prompt) }),
        ]));
        const fb = el('div', { class: 'stack' });
        const btns = [];
        rng.shuffle(q.opts).forEach((o) => {
          const b = el('button', { class: 'option', html: md(o.t) });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            btns.forEach((x) => { x.b.disabled = true; if (x.o.ok) x.b.classList.add('correct'); else if (x.b !== b) x.b.classList.add('dim'); });
            if (!o.ok) b.classList.add('wrong');
            qOk = !!o.ok;
            sfx(o.ok ? 'good' : 'bad');
            fb.appendChild(el('div', { class: 'feedback small ' + (o.ok ? 'good' : 'bad'), html: (o.ok ? '' : md(o.why || '') + '<br>') + md(q.explain) }));
            fb.appendChild(el('button', { class: 'btn primary block', id: 'mg-hms-next', text: 'Se oppsummering', onclick: () => { sfx('click'); renderSummary(); } }));
          });
          btns.push({ b, o });
          wrap.appendChild(b);
        });
        wrap.appendChild(fb);
      }

      /* ---------- Oppsummering ---------- */
      let result = null;
      function renderSummary() {
        phase = 'summary';
        const riskOk = riskRes.reduce((s, r) => s + (r.cellOk ? 1 : 0) + (r.tiltakOk ? 1 : 0), 0);
        const findPts = Math.max(0, found.length - 0.5 * falseAlarms);
        const total = nHaz + 2 * riskRes.length + 1;
        const correct = found.length + riskOk + (qOk ? 1 : 0);
        const score = NG.clamp((findPts + riskOk + (qOk ? 1 : 0)) / total, 0, 1);
        result = {
          score: Math.round(score * 100) / 100, correct, total,
          notes: `${S.name}: fant ${found.length}/${nHaz} farer (${falseAlarms} falske alarmer); risikovurdering ${riskOk}/${2 * riskRes.length}; ${qOk ? 'merking/SDS riktig' : 'bommet på merking/SDS'}.` +
            (found.length < nHaz ? ' Oversett: ' + hazards.filter((h) => !found.includes(h)).map((h) => HAZ[h].name.toLowerCase()).join(', ') + '.' : ''),
        };
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Resultat' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(score * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(score * 100) + '%', background: 'var(--r-praksis)' } })]),
          el('div', { class: 'small', text: `Farer funnet: ${found.length}/${nHaz} · falske alarmer: ${falseAlarms} · risikovurdering: ${riskOk}/${2 * riskRes.length} · merking: ${qOk ? 'riktig' : 'feil'}` }),
        ]));
        wrap.appendChild(el('div', { class: 'feedback small', html:
          '<strong>Læringspoenget</strong><br>' +
          'En risikovurdering har tre steg: 1) <strong>finn farene</strong> (stoffer, utstyr, mennesker, rom), 2) <strong>vurder risikoen</strong> som sannsynlighet × konsekvens, og 3) <strong>velg tiltak</strong>. Prøv i denne rekkefølgen: fjern faren, bytt til noe tryggere, bruk tekniske tiltak (for eksempel avtrekk eller ildfast plate), lag rutiner, og bruk til slutt verneutstyr.<br>' +
          'Farepiktogrammene (CLP) gir et raskt varsel. Sikkerhetsdatabladet gir grunnlaget for vurderingen. ' +
          'Kompetansemålet sier at elevene skal <em>«delta i risikovurderinger knyttet til forsøk og følge sikkerhetstiltakene»</em>. La derfor elevene gjøre en slik jakt selv før forsøket.' }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'mg-hms-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        cleanup();
        api.done(result);
        const b = wrap.querySelector('#mg-hms-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }
      function cleanup() { alive = false; while (timers.length) clearTimeout(timers.pop()); }

      renderFind();
      return { destroy() { cleanup(); if (svg) svg.removeEventListener('click', onTap); } };
    },
  });
})();
