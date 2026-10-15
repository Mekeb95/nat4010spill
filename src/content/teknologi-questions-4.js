/* Verkstedet (teknologi) — spørsmål del 4: flere grunnleggende spørsmål (nivå 1–2) om sensorer, programmering,
   design og systemer. */
(function () {
  'use strict';
  const R = 'teknologi';
  const SEN = 'Sensorer og datainnsamling';
  const PROG = 'Programmering: grunnbegreper';
  const KODE = 'Kodelesing';
  const DES = 'Design og utviklingsprosess';
  const FFM = 'Form, funksjon og materiale';
  const SYS = 'System og styring';
  const FEIL = 'Feilsøking';

  const Q = [
    { id: 'teknologi.sens.07', topic: SEN, concepts: ['tek-sensor', 'tek-aktuator'], level: 1, type: 'sort',
      prompt: 'Er delen en **sensor** eller en **aktuator**?',
      buckets: ['Sensor', 'Aktuator'],
      items: [{ t: 'Lyssensor', b: 0 }, { t: 'Temperatursensor', b: 0 }, { t: 'Akselerometer', b: 0 }, { t: 'Motor', b: 1 }, { t: 'Høyttaler', b: 1 }, { t: 'LED-lys', b: 1 }],
      explain: 'Sensorer måler noe i omgivelsene (inndata). Aktuatorer gjør noe i omgivelsene: lager bevegelse, lyd eller lys (utdata).' },
    { id: 'teknologi.sens.08', topic: SEN, concepts: ['tek-sensor', 'tek-microbit'], level: 2, type: 'mc',
      prompt: 'En micro:bit skal slå på en vifte når det blir varmt i rommet. Hva er **sensoren** i dette systemet?',
      options: ['Temperatursensoren', 'Viftemotoren', 'Programmet i micro:biten', 'Batteripakken'], answer: 0,
      why: { 1: 'Viftemotoren er aktuatoren – den gjør noe.', 2: 'Programmet er styringen som bestemmer når viften skal gå.', 3: 'Batteriet gir energi, men måler ingenting.' },
      explain: 'Sensor (temperatur) → styring (programmet med en betingelse) → aktuator (viften). Det er grunnmønsteret i nesten alle styresystemer.' },
    { id: 'teknologi.prog.07', topic: PROG, concepts: ['tek-lokke'], level: 1, type: 'mc',
      prompt: 'Hva kalles en del av et program som **gjentas** flere ganger?',
      options: ['En løkke', 'En variabel', 'En sekvens', 'En betingelse'], answer: 0,
      why: { 1: 'En variabel lagrer en verdi.', 2: 'En sekvens er steg som utføres etter hverandre, én gang.', 3: 'En betingelse er et valg: «hvis … så …».' },
      explain: 'Sekvens, løkke og betingelse er de tre grunnstrukturene i programmering. En løkke kan gjenta et fast antall ganger, eller så lenge noe er sant.' },
    { id: 'teknologi.prog.08', topic: PROG, concepts: ['tek-variabel'], level: 1, type: 'mc',
      prompt: 'Hva er en **variabel** i et program?',
      options: ['Et navn på en plass som lagrer en verdi', 'En kommando som gjentar noe flere ganger', 'En feil som gjør at programmet stopper', 'Et valg mellom to ulike handlinger'], answer: 0,
      why: { 1: 'Det er en løkke.', 2: 'Det er en bug.', 3: 'Det er en betingelse (hvis–ellers).' },
      explain: 'En variabel er som en merket boks: den har et navn (f.eks. `poeng`) og en verdi som kan endres mens programmet kjører.' },
    { id: 'teknologi.kode.15', topic: KODE, concepts: ['tek-variabel', 'tek-sekvens'], level: 2, type: 'mc',
      prompt: 'Hva viser programmet?\n`x = 3`\n`x = x + 2`\n`vis(x)`',
      options: ['5', '3', '32', 'x + 2'], answer: 0,
      why: { 1: 'Linje 2 endrer x før den vises.', 2: 'Det blir 32 bare hvis tekst limes sammen – her er x et tall.', 3: 'Programmet regner ut uttrykket; det viser ikke teksten.' },
      explain: '`x = x + 2` betyr: ta verdien til x (3), legg til 2, og lagre resultatet i x igjen. Likhetstegnet i programmering er en *tilordning*, ikke en likning.' },
    { id: 'teknologi.kode.16', topic: KODE, concepts: ['tek-lokke'], level: 1, type: 'mc',
      prompt: 'Hvor mange ganger vises «Hei»?\n`gjenta 4 ganger:`\n`    vis("Hei")`',
      options: ['4', '1', '5', '3'], answer: 0,
      why: { 1: 'Løkka gjentar innholdet – det er derfor den finnes.', 2: 'Løkka teller ikke med en ekstra runde.', 3: 'Løkka går nøyaktig så mange ganger som det står.' },
      explain: 'Det som står innrykket under `gjenta 4 ganger`, kjøres fire ganger. Innrykket viser hva som hører til løkka.' },
    { id: 'teknologi.des.11', topic: DES, concepts: ['tek-designprosess', 'tek-prototyp'], level: 1, type: 'order',
      prompt: 'Sett trinnene i **designprosessen** i en vanlig rekkefølge:',
      items: ['Finne ut hva brukeren trenger', 'Lage en kravspesifikasjon', 'Skissere og lage en prototyp', 'Teste prototypen', 'Forbedre og teste på nytt'],
      explain: 'Designprosessen starter med brukerens behov og går i runder: prototyp, test, forbedring. I praksis hopper man ofte fram og tilbake – det er en syklus, ikke en rett linje.' },
    { id: 'teknologi.ffm.08', topic: FFM, concepts: ['tek-form', 'tek-funksjon', 'tek-materiale'], level: 2, type: 'sort',
      prompt: 'Handler utsagnet om **form**, **funksjon** eller **materiale**?',
      buckets: ['Form', 'Funksjon', 'Materiale'],
      items: [{ t: 'Sykkelhjelmen er rund og glatt', b: 0 }, { t: 'Hjelmen skal beskytte hodet ved fall', b: 1 }, { t: 'Hjelmen er av støtdempende skumplast', b: 2 }, { t: 'Koppen har en hank', b: 0 }, { t: 'Koppen skal holde drikken varm', b: 1 }, { t: 'Koppen er laget av keramikk', b: 2 }],
      explain: 'Form er utseendet og fasongen, funksjon er hva gjenstanden skal gjøre, og materialet er hva den er laget av. Gode designere velger form og materiale ut fra funksjonen.' },
    { id: 'teknologi.sys.09', topic: SYS, concepts: ['tek-tilbakekobling', 'tek-system'], level: 2, type: 'tf',
      prompt: 'I et system med tilbakekobling måler en sensor resultatet, slik at systemet kan justere seg.', answer: true,
      explain: 'Sant. Termostaten er et klassisk eksempel: den måler temperaturen og slår ovnen av eller på. Uten tilbakekobling (f.eks. en ren tidsbryter) kan systemet ikke reagere på endringer.' },
    { id: 'teknologi.feil.07', topic: FEIL, concepts: ['tek-feilsoking'], level: 2, type: 'mc',
      prompt: 'Programmet ditt virker ikke som det skal. Hva bør du gjøre **først**?',
      options: ['Kjøre det og se nøye hva som faktisk skjer', 'Skrive hele programmet på nytt fra start', 'Endre mange ting samtidig og se om det hjelper', 'Spørre læreren om å få se fasiten'], answer: 0,
      why: { 1: 'Da mister du det som virket, og kan gjøre den samme feilen igjen.', 2: 'Endrer du mange ting samtidig, vet du ikke hva som hjalp – eller hva som ødela.', 3: 'Da lærer du ikke å feilsøke selv.' },
      explain: 'Systematisk feilsøking: observer hva som skjer, sammenlign med det du forventet, finn det første avviket, endre én ting og test igjen.' },
  ];

  NG.content.addQuestions(Q.map((q) => Object.assign({ region: R }, q)));
})();
