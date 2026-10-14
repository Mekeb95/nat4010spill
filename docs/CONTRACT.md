# Modulkontrakt — hvordan du legger til innhold, mini-spill og grafikk

Spillet er ren HTML/CSS/JS uten rammeverk og uten bundler. `tools/build.mjs` limer
filene sammen til `dist/index.html` i denne rekkefølgen:
`src/core/*.js` → `src/art/*.js` → `src/content/**/*.js` → `src/minigames/*.js` → `src/ui/*.js` → `src/main.js`.
CSS: `src/ui/tokens.css`, `src/ui/base.css`, så andre `src/ui/*.css`. Mini-spill injiserer egen CSS med `NG.css(\`...\`)`.

Alt registreres på det globale objektet `NG` (definert i `src/core/00-ns.js`).
**Hver fil pakkes i en IIFE** `(function(){ 'use strict'; ... })();` — ingen globale variabler utover `NG`.
Ingen eksterne biblioteker, ingen nettverkskall, ingen `alert/confirm/prompt`. Alt må fungere på
en mobil i portrett (≈ 360–430 px bred), med berøring. Bruk `NG.makeRng`/`api.rng` — aldri `Math.random()`
i innhold/spillogikk (kosmetisk partikkelstøy i canvas er greit).

## Kommandoer
```
node tools/validate.mjs                 # validerer alt innhold, viser statistikk. Må gi OK.
node tools/build.mjs                    # dist/index.html
node tools/build.mjs --mg=<id>          # dist/mg-<id>.html — kjører bare mini-spillet (stub-API, ?seed=N&d=1..3)
node tools/build.mjs --q=<region|all>   # dist/q-<region>.html — blar gjennom spørsmål (?i=N)
node tools/shot.mjs <html> <png> [--click="css"]...  # skjermbilde i mobilformat (390×844)
```

## Språk og faglig kvalitet
- All tekst er **norsk bokmål**, presis og faglig korrekt på lærerutdanningsnivå (NAT4010).
- Bruk fagbegrepene slik pensum bruker dem (fagstoffet holdes utenfor repoet). Skill hverdagsspråk og fagspråk.
- Forklaringer skal *forklare* (hvorfor/mekanisme), ikke bare gjenta fasiten.
- Distraktorer skal være **ekte elevforestillinger/misoppfatninger**, ikke tull. Forklar dem i `why`.
- Tall: desimalkomma i tekst («9,81 m/s²»). Enheter alltid med. g = 9,81 m/s² med mindre annet står.
- Unngå «alle/ingen av alternativene over» (alternativene stokkes).

## Innhold (`src/content/<region>-*.js`)
Regions-id-er: `energi, stoffer, liv, jorda, kropp, teknologi, praksis, didaktikk`.
ID-er er globalt unike: prefiks med region (`energi.varme.03`, `myte.kulde-overfores`).

### Begreper (begrepskort)
```js
NG.content.addConcepts([{
  id: 'varme',                 // kort, kebab-case, unik på tvers av regioner
  name: 'Varme',
  region: 'energi',
  def: 'Energi som overføres fordi det er temperaturforskjell. Noe en ting ikke *har*, men noe som *skjer*.',
  example: 'Kaffekoppen avgir varme til lufta i rommet til de har samme temperatur.',
  everyday: 'I hverdagen: «det er mye varme i ovnen» (hverdagsspråk, egentlig indre energi).', // valgfri
  related: ['temperatur', 'indre-energi', 'energioverforing'],   // begrep-id-er (nettverket)
  key: true,                   // true = står som nøkkelbegrep på Naturfagsenterets nøkkelark
}]);
```

### Myter (misoppfatninger)
```js
NG.content.addMyths([{ id: 'myte.kulde-overfores', text: 'Kulde strømmer fra kalde ting inn i varme ting.',
  fix: 'Det er energi som overføres – alltid fra varmt til kaldt. «Kulde» er mangel på …', source: 'Henriksen & Angell 2019' }]);
```

### Spørsmål
Felles felt: `id, region, topic, concepts[], level (1–5), type, prompt, explain` + valgfritt
`myth, difficulty (1–3), source, figure` (`figure` = SVG-streng eller grafikk-id).
`level` følger begrepsstigen: 1 Gjenkjenne · 2 Definere · 3 Nettverk (sammenhenger) · 4 Anvende (regne/bruke i ny situasjon) · 5 Overføre (nytt fenomen, didaktisk bruk, forklare for elev).
Mål for hver region: ca. 25 % L1–2, 35 % L3, 40 % L4–5.

Typer:
```js
{ type: 'mc', options: ['A', 'B', 'C', 'D'], answer: 2, why: { 0: 'Hvorfor A er feil …', 1: '…', 3: '…' } }
{ type: 'multi', options: [...], answer: [0, 3] }
{ type: 'tf', answer: false }                       // prompt er en påstand
{ type: 'order', items: ['første', 'andre', 'tredje', ...] }        // RIKTIG rekkefølge; motoren stokker (3–7)
{ type: 'sort', buckets: ['Rent stoff', 'Blanding'], items: [{ t: 'Saltvann', b: 1 }, ...] }  // 2–4 bøtter, 3–8 items
{ type: 'num', answer: 9.9, tol: 0.03, unit: 'm/s', hint: 'Bruk v = √(2gh)' }  // tol = relativ (std 0,02) eller abs: 0.5
```
Prompt/forklaring støtter mini-markup: `**fet**`, `*kursiv*`, `` `kode` ``, `^2^` hevet, `~2~` senket, `\n` linjeskift.

### Fiender
```js
NG.content.addEnemies([{
  id: 'kuldespokelset', name: 'Kuldespøkelset', region: 'energi', tier: 'normal' | 'elite' | 'boss',
  myth: 'myte.kulde-overfores', hp: 30, atk: 6,          // normal ~ hp 24–40 atk 5–8; elite ~ 50–70/8–11; boss ~ 110–160/10–14
  art: 'kuldespokelset',                                  // grafikk-id (src/art), default = id
  intro: 'Et iskaldt gufs siver ut av bordbeinet …',      // vises når kampen starter
  taunts: ['Kjenn hvordan kulda kryper inn i fingrene dine!', ...],  // 3–5 replikker = misoppfatningen i munnen
  defeat: 'Det var energien din som strømmet ut i metallet – ikke kulde inn.',  // faglig poeng når den taper
  topics: ['Varme og temperatur'],                         // valgfritt: foretrukne spørsmålstemaer
}]);
```
Bossen for regionen må ha id som i `src/core/01-regions.js`. Bosser får i tillegg
`phases: [{ at: 0.5, text: 'Bossen skifter strategi …' }]` (valgfritt).

### Hendelser (✉-noder: små valgsituasjoner med faglig poeng)
```js
NG.content.addEvents([{ id: 'energi.ev.bilradio', region: 'energi', title: 'Bilradioen',
  text: 'En elev sier: «Radioen bruker opp energien fra batteriet.» Hva svarer du?',
  choices: [
    { label: 'Energien blir til lyd og varme – den forsvinner ikke.', correct: true, result: 'Eleven nikker …', reward: { xp: 20 } },
    { label: 'Ja, den er brukt opp.', correct: false, result: 'Misforståelsen vokser seg sterkere …', reward: { hp: -5 } },
  ] }]);
```
`reward`: `{ xp, joule, hp, energy, item: 'item-id' }` (negative tall = straff).

### Orakelet (fritekst vurdert av Claude, valgfritt)
```js
NG.content.addPrompts([{ id: 'energi.or.1', region: 'energi', concepts: ['varme'],
  prompt: 'Forklar for en 8.-klassing hvorfor metallbeinet føles kaldere enn treplata selv om de har samme temperatur.',
  rubric: 'Påstand: samme temperatur. Evidens: termometer/nulte lov. Begrunnelse: metall leder varme bedre (frie elektroner), så energi strømmer raskere ut av hånda.',
  model: 'Eksempelsvar …' }]);
```

## Mini-spill (`src/minigames/<id>.js`)
```js
(function () {
  'use strict';
  NG.css(`.mg-varmekurve { ... }`);           // alle klasser prefikses mg-<id>
  NG.minigames.register({
    id: 'varmekurve', region: 'energi', title: 'Varmekurven', icon: 'flame',
    concepts: ['faseovergang', 'temperatur'],  // begrep-id-er som trenes
    blurb: 'Varm opp is og finn ut hvorfor termometeret står stille.',  // 1 setning
    minutes: 2,
    start(root, api) {
      // root: tom <div>. Bygg alt inni den. Returner gjerne { destroy() } for å rydde timere.
      // api.rng (next/int/pick/shuffle/chance), api.difficulty (1–3), api.el, api.md, api.sfx(name),
      // api.toast(text), api.concept(id), api.done({ score: 0..1, correct, total, notes })
      // sfx-navn: click good bad hit crit coin level heal boss win lose
    },
  });
})();
```
Krav til mini-spill:
- 1–3 minutter. Kall `api.done(...)` nøyaktig én gang når spilleren er ferdig (score 0–1).
- Lærerikt: spilleren må *bruke* begrepet (forutsi, regne, sortere, bygge), og få forklaring underveis/til slutt.
- Variasjon via `api.rng` og `api.difficulty` slik at det kan spilles flere ganger.
- Bruk delte klasser fra `src/ui/base.css` (`btn`, `btn primary`, `option`, `card`, `chip`, `feedback good|bad`, `label`, `h-display`, `stack`, `row`, `bar`) og CSS-variablene i `src/ui/tokens.css`.
- Berøring først: trykk-for-å-velge fremfor dra-og-slipp (dra kan være tillegg). Ingen hover-avhengighet.
  Mål ≥ 44 px trykkflater. Ingen horisontal scrolling. Canvas skal skalere til bredden (devicePixelRatio).
- Rydd opp timere/animasjonsløkker i `destroy()` og når `done` er kalt.

## Grafikk (`src/art/*.js`)
```js
NG.art.add('kuldespokelset', `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">…</svg>`);
```
- Stil: krittegning på tavle — tydelige konturer (stroke ~3–4, `stroke-linecap="round"`), flate fargekritt-fyll med lav opasitet, litt «håndtegnet» ujevnhet. Bruk CSS-variabler i `style`/`fill`, f.eks. `fill="var(--r-energi)"`, `stroke="var(--chalk)"`.
- `viewBox="0 0 120 120"` for figurer, kvadratisk. Ingen eksterne referanser, ingen `<script>`, ingen tekst som må leses.
- Hold hver figur under ~4 KB.
