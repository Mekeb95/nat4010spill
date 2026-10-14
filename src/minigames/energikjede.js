/* Mini-spill: Energikjeden (energi). Bygg en energikjede ledd for ledd, merk hver pil som omdanning
   eller overføring, og se energiregnskapet: totalen er konstant, men spillvarmen (lavverdig) vokser. */
(function () {
  'use strict';
  const ID = 'energikjede';

  NG.css(`
.mg-energikjede .ek-chain { display: flex; flex-direction: column; gap: 0; }
.mg-energikjede .ek-link { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: var(--r-m); border: 2px solid var(--line-strong); background: var(--board-2); }
.mg-energikjede .ek-link .ek-n { font-family: var(--f-mono); color: var(--chalk-dim); font-size: var(--t-s); min-width: 1.2em; }
.mg-energikjede .ek-name { flex: 1 1 auto; min-width: 0; font-weight: 700; line-height: 1.25; }
.mg-energikjede .ek-form { font-size: var(--t-xs); font-family: var(--f-mono); padding: 2px 8px; border-radius: 999px; border: 1.5px solid currentColor; white-space: nowrap; }
.mg-energikjede .ek-arrow { display: flex; align-items: center; gap: 8px; padding: 4px 0 4px 18px; min-height: 34px; }
.mg-energikjede .ek-arrow .ek-ar { font-size: 1.3rem; color: var(--chalk-dim); width: 1.2em; text-align: center; }
.mg-energikjede .ek-arrow .segs { flex: 1 1 auto; }
.mg-energikjede .ek-arrow .seg { min-height: 44px; }
.mg-energikjede .ek-arrow.ok .seg.on { background: var(--good); border-color: var(--good); color: var(--board); }
.mg-energikjede .ek-arrow.no .seg.on { background: var(--bad); border-color: var(--bad); color: var(--board); }
.mg-energikjede .ek-arrow .ek-why { font-size: var(--t-s); color: var(--chalk-dim); }
.mg-energikjede .ek-pool { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-energikjede .ek-card { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; text-align: left; min-height: 64px; }
.mg-energikjede .ek-card.shake { animation: ekShake .3s; border-color: var(--bad); }
.mg-energikjede .ek-slot { border-style: dashed; color: var(--chalk-faint); justify-content: center; }
@keyframes ekShake { 0%,100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
.mg-energikjede .ek-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-energikjede .ek-legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: var(--t-s); }
.mg-energikjede .ek-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
.mg-energikjede .ek-sum ul { margin: 0; padding-left: 1.2em; }
`);

  // Energiformer og farger (CSS-variabler).
  const FORM = {
    pot: { t: 'potensiell', c: '--r-jorda' },
    kin: { t: 'kinetisk', c: '--r-praksis' },
    el: { t: 'elektrisk', c: '--r-teknologi' },
    kj: { t: 'kjemisk', c: '--r-liv' },
    term: { t: 'termisk', c: '--heat' },
    lys: { t: 'stråling (lys)', c: '--chalk' },
  };

  // eta = andel av den nyttige energien som går videre som nyttig i neste ledd (omtrentlige tall).
  const SCEN = [
    { id: 'lampe', title: 'Leselampa på kvelden', tekst: 'Du leser i senga. Strømmen kommer fra et vannkraftverk i fjellet.', d: 1, origin: 0,
      links: [
        { n: 'Vannet i magasinet', s: 'Magasin', f: 'pot' },
        { n: 'Vannet som fosser i rørgata', s: 'Rørgate', f: 'kin', eta: 0.95 },
        { n: 'Turbin og generator', s: 'Generator', f: 'el', eta: 0.92 },
        { n: 'Strømnettet fram til huset', s: 'Nettet', f: 'el', eta: 0.94 },
        { n: 'LED-pæra i leselampa', s: 'Lampa', f: 'lys', eta: 0.4 },
      ],
      end: 'Du har lest i en time. Lyset har truffet boka, veggene og deg. **Hvor er energien nå?**',
      firstWhy: 'Sola fordamper vann fra havet. Vanndampen stiger, blir til nedbør og havner høyt oppe i magasinet med potensiell energi.' },
    { id: 'sykkel', title: 'Syklisten opp bakken', tekst: 'Ida sykler opp en bratt bakke etter å ha spist ei brødskive.', d: 1, origin: 0,
      links: [
        { n: 'Brødskiva', s: 'Brød', f: 'kj' },
        { n: 'Næringsstoffer lagret i musklene', s: 'Musklene', f: 'kj', eta: 0.9 },
        { n: 'Bena og pedalene i bevegelse', s: 'Pedaler', f: 'kin', eta: 0.25 },
        { n: 'Ida og sykkelen på toppen', s: 'Toppen', f: 'pot', eta: 0.85 },
      ],
      end: 'Ida triller ned igjen og bremser til stopp ved butikken. **Hvor er energien nå?**',
      firstWhy: 'Kornet i brødet bandt solenergi som kjemisk energi gjennom fotosyntesen. «Brødskiva du spiste i dag, var sollys for noen måneder siden.»' },
    { id: 'solcelle', title: 'Solcellelampa i hagen', tekst: 'Ei lita lampe i bedet lader om dagen og lyser om kvelden.', d: 1, origin: 0,
      links: [
        { n: 'Solcellepanelet', s: 'Panel', f: 'el' },
        { n: 'Ledningen til batteriet', s: 'Ledning', f: 'el', eta: 0.97 },
        { n: 'Det oppladbare batteriet', s: 'Batteri', f: 'kj', eta: 0.85 },
        { n: 'Lysdioden som lyser om kvelden', s: 'Lysdiode', f: 'lys', eta: 0.35 },
      ],
      end: 'Lampa har lyst hele kvelden og batteriet er tomt. **Hvor er energien nå?**',
      firstWhy: 'Solcellepanelet omdanner sollys direkte til elektrisk energi.' },
    { id: 'grill', title: 'Grillen med kull', tekst: 'Familien griller pølser på en kullgrill.', d: 1, origin: 0,
      links: [
        { n: 'Treet som vokste i skogen', s: 'Treet', f: 'kj' },
        { n: 'Grillkullet i posen', s: 'Kullet', f: 'kj', eta: 0.6 },
        { n: 'De glødende kullene', s: 'Glørne', f: 'term', eta: 0.9 },
        { n: 'Pølsa på risten', s: 'Pølsa', f: 'term', eta: 0.25 },
      ],
      end: 'Pølsene er spist og grillen er kald. **Hvor er energien nå?**',
      firstWhy: 'Treet bandt solenergi som kjemisk energi gjennom fotosyntesen. Kull er forkullet trevirke.' },
    { id: 'elbil', title: 'Elbilen fra vindkraft', tekst: 'En elbil lades med strøm fra en vindpark på kysten.', d: 2, origin: 0,
      links: [
        { n: 'Vinden over kysten', s: 'Vinden', f: 'kin' },
        { n: 'Vindturbinen', s: 'Turbin', f: 'el', eta: 0.45 },
        { n: 'Strømnettet til laderen', s: 'Nettet', f: 'el', eta: 0.94 },
        { n: 'Bilbatteriet', s: 'Batteri', f: 'kj', eta: 0.9 },
        { n: 'Bilen i fart', s: 'I fart', f: 'kin', eta: 0.85 },
      ],
      end: 'Bilen har kjørt til hytta og står parkert. **Hvor er energien nå?**',
      firstWhy: 'Sola varmer jorda ujevnt. Varm luft stiger og kald luft strømmer inn – det er vind.' },
    { id: 'tidevann', title: 'Vannkokeren fra tidevannskraft', tekst: 'Strømmen til vannkokeren kommer fra en turbin i en sterk tidevannsstrøm.', d: 2, origin: 1,
      links: [
        { n: 'Tidevannsstrømmen i sundet', s: 'Strømmen', f: 'kin' },
        { n: 'Undervannsturbinen', s: 'Turbin', f: 'el', eta: 0.4 },
        { n: 'Strømnettet', s: 'Nettet', f: 'el', eta: 0.94 },
        { n: 'Vannet i vannkokeren', s: 'Vannet', f: 'term', eta: 0.9 },
      ],
      end: 'Teen er drukket og koppen er kald. **Hvor er energien nå?**',
      firstWhy: 'Tidevannet drives av månens (og solas) tyngdekraft og jordas rotasjon – et av få unntak fra «alt kommer fra sola».' },
    { id: 'jordvarme', title: 'Stua varmet med jordvarme', tekst: 'Et hus på Island varmes med varmt vann pumpet opp fra dypet.', d: 2, origin: 2,
      links: [
        { n: 'Varmt vann fra dypet', s: 'Dypvann', f: 'term' },
        { n: 'Varmeveksleren i kjelleren', s: 'Veksler', f: 'term', eta: 0.85 },
        { n: 'Radiatoren i stua', s: 'Radiator', f: 'term', eta: 0.95 },
        { n: 'Lufta i stua', s: 'Lufta', f: 'term', eta: 0.95 },
      ],
      end: 'Det er natt og huset kjøles langsomt ned. **Hvor er energien nå?**',
      firstWhy: 'Jordas indre er varmt på grunn av radioaktiv nedbrytning og restvarme fra da jorda ble dannet – ikke fra sola.' },
  ];

  const DISTRACT = [
    { n: 'Kulde som trekker inn utenfra', f: '«kulde»', why: 'Kulde er ikke en energiform som strømmer. Energi går alltid fra varmt til kaldt.' },
    { n: 'Ny energi som lages underveis', f: '«ny energi»', why: 'Energi kan verken lages eller forsvinne (energibevaring). Den bare omdannes og overføres.' },
    { n: 'Energi som brukes opp og blir borte', f: '«borte»', why: 'Energi brukes ikke opp. Det som «brukes» er kvaliteten: energien spres som lavverdig varme.' },
  ];

  const ORIGINS = [
    'Sola (fusjon i solas indre)',
    'Månens tyngdekraft og jordas rotasjon (tidevann)',
    'Jordas indre varme (radioaktiv nedbrytning)',
    'Kjernespalting av uran i et kjernekraftverk',
  ];

  NG.minigames.register({
    id: ID, region: 'energi', title: 'Energikjeden', icon: 'link',
    concepts: ['energikjede', 'energiomdanning', 'energioverforing', 'energibevaring', 'energikvalitet', 'energikilde'],
    blurb: 'Bygg energikjeden ledd for ledd og se at totalen er konstant mens kvaliteten synker.',
    minutes: 3,
    start(root, api) {
      const el = api.el;
      const rng = api.rng;
      const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);

      const pool = SCEN.filter((s) => s.d <= d);
      const S = rng.pick(pool);
      const L = S.links;
      const nA = L.length - 1;
      const distract = d >= 2 ? rng.shuffle(DISTRACT).slice(0, d >= 3 ? 2 : 1) : [];

      let ended = false; let raf = 0; const timers = [];
      let mistakes = 0; let arrowsOk = 0; let mcOk = 0; let mcTotal = 0;
      const missed = [];

      const head = el('div', { class: 'stack-s' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Energidalen · lab' }), el('span', { class: 'chip', text: S.title })]),
        el('h2', { class: 'h-display', text: 'Energikjeden' }),
        el('div', { html: api.md(S.tekst) }),
      ]);
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [head, stage]));

      const formChip = (f) => {
        const F = FORM[f];
        return el('span', { class: 'ek-form', style: { color: F ? `var(${F.c})` : 'var(--chalk-faint)' }, text: F ? F.t : f });
      };
      const kind = (i) => (L[i].f === L[i + 1].f ? 'over' : 'om');
      const scrollTo = (n) => setTimeout(() => { try { n.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 40);

      /* ---------- 1. Bygg kjeden ---------- */
      function build() {
        const chosen = [];
        const cards = rng.shuffle(L.map((x, i) => ({ i, n: x.n, f: x.f })).concat(distract.map((x) => ({ i: -1, n: x.n, f: x.f, why: x.why }))));
        const chain = el('div', { class: 'ek-chain' });
        const poolEl = el('div', { class: 'ek-pool' });
        const fb = el('div', { class: 'small muted', html: api.md('Trykk på kortene i **riktig rekkefølge**, fra første ledd til sluttbrukeren.') });
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Steg 1 av 4 · bygg kjeden' }), fb]), chain, el('span', { class: 'label', text: 'Kort' }), poolEl);
        function draw() {
          chain.innerHTML = '';
          chosen.forEach((i, k) => {
            if (k > 0) chain.appendChild(el('div', { class: 'ek-arrow' }, [el('span', { class: 'ek-ar', text: '↓' })]));
            chain.appendChild(el('div', { class: 'ek-link' }, [el('span', { class: 'ek-n', text: String(k + 1) }), el('span', { class: 'ek-name', text: L[i].n }), formChip(L[i].f)]));
          });
          if (chosen.length < L.length) {
            if (chosen.length) chain.appendChild(el('div', { class: 'ek-arrow' }, [el('span', { class: 'ek-ar', text: '↓' })]));
            chain.appendChild(el('div', { class: 'ek-link ek-slot', text: chosen.length ? 'Neste ledd?' : 'Første ledd?' }));
          }
          poolEl.innerHTML = '';
          cards.forEach((c) => {
            if (c.used) return;
            const b = el('button', { class: 'option ek-card', html: '<span>' + api.md(c.n) + '</span>' });
            b.appendChild(formChip(c.f));
            b.onclick = () => tap(c, b);
            poolEl.appendChild(b);
          });
        }
        function tap(c, b) {
          if (c.i === -1) {
            mistakes++; c.used = true; api.sfx('bad');
            fb.innerHTML = api.md('**Det kortet hører ikke hjemme i en energikjede.** ' + c.why);
            missed.push('misoppfatningskort i kjeden');
            draw(); return;
          }
          if (c.i === chosen.length) {
            c.used = true; chosen.push(c.i); api.sfx('click');
            fb.innerHTML = api.md(chosen.length === 1 ? '**Godt valg.** Hvor går energien videre?' : 'Riktig. Energien går fra «' + L[c.i - 1].s + '» til «' + L[c.i].s + '».');
            draw();
            if (chosen.length === L.length) { const t = setTimeout(arrows, 700); timers.push(t); }
            return;
          }
          mistakes++; api.sfx('bad');
          b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          fb.innerHTML = api.md(c.i > chosen.length ? '**Ikke ennå** – hva må skje før energien kan komme hit?' : 'Det leddet kommer tidligere.');
        }
        draw();
      }

      /* ---------- 2. Omdanning eller overføring ---------- */
      function arrows() {
        if (ended) return;
        stage.innerHTML = '';
        const picks = new Array(nA).fill(null);
        const rows = [];
        const go = el('button', { class: 'btn primary block', id: 'ek-check', text: 'Sjekk pilene', disabled: true });
        const chain = el('div', { class: 'ek-chain' });
        L.forEach((x, i) => {
          chain.appendChild(el('div', { class: 'ek-link' }, [el('span', { class: 'ek-n', text: String(i + 1) }), el('span', { class: 'ek-name', text: x.n }), formChip(x.f)]));
          if (i < nA) {
            const segs = [['om', 'Omdanning'], ['over', 'Overføring']].map(([v, t]) => el('button', { class: 'seg', 'data-v': v, text: t, onclick: () => {
              picks[i] = v; segs.forEach((s) => s.classList.toggle('on', s.dataset.v === v)); api.sfx('click');
              go.disabled = picks.some((p) => !p);
            } }));
            const why = el('div', { class: 'ek-why' });
            const row = el('div', { class: 'ek-arrow' }, [el('span', { class: 'ek-ar', text: '↓' }), el('div', { class: 'stack-s grow' }, [el('div', { class: 'segs' }, segs), why])]);
            rows.push({ row, segs, why });
            chain.appendChild(row);
          }
        });
        const fb = el('div');
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Steg 2 av 4 · merk pilene' }),
          el('div', { html: api.md('**Omdanning:** energien bytter *form* (f.eks. kinetisk → elektrisk).\n**Overføring:** samme form, men energien flytter til et annet system eller sted.') }),
        ]), chain, go, fb);
        go.onclick = () => {
          go.remove();
          rows.forEach((r, i) => {
            const want = kind(i); const ok = picks[i] === want;
            if (ok) arrowsOk++;
            r.row.classList.add(ok ? 'ok' : 'no');
            r.segs.forEach((s) => { s.disabled = true; });
            r.why.textContent = (ok ? '✓ ' : '✗ ') + FORM[L[i].f].t + ' → ' + FORM[L[i + 1].f].t + (want === 'om' ? ': formen endres = omdanning.' : ': samme form, nytt system = overføring.');
          });
          if (arrowsOk < nA) missed.push('omdanning vs. overføring');
          api.sfx(arrowsOk === nA ? 'good' : 'bad');
          fb.appendChild(el('div', { class: 'feedback ' + (arrowsOk === nA ? 'good' : 'bad') + ' stack-s' }, [
            el('div', { html: api.md(`**${arrowsOk} av ${nA} piler riktig.** Tips: se på energiformene. Bytter formen, er det en omdanning – ellers en overføring. I hvert ledd skjer det i tillegg en *omdanning* til termisk energi (spillvarme).`) }),
            el('button', { class: 'btn primary block', text: 'Videre til energiregnskapet', onclick: () => { api.sfx('click'); predictTotal(); } }),
          ]));
          scrollTo(fb);
        };
      }

      /* ---------- spørsmål ---------- */
      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.appendChild(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + mcTotal }, q), {
          rng,
          onAnswer: (res) => { mcTotal++; if (res.correct) mcOk++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
        scrollTo(root);
      }

      /* ---------- 3. Forutsi totalen + regnskap ---------- */
      function predictTotal() {
        ask({
          type: 'mc', topic: 'Forutsi', miss: 'energibevaring i kjeden',
          prompt: `Vi starter med **100 enheter** energi i «${L[0].s}». Hva skjer med den **totale** energimengden gjennom kjeden?`,
          options: ['Den er konstant – 100 enheter i hvert ledd', 'Den minker for hvert ledd, fordi noe energi går tapt underveis', 'Den øker, fordi kraftverk og muskler lager ny energi', 'Den er null til slutt, når alt er brukt'],
          answer: 0,
          why: { 1: 'Det som minker, er den *nyttige* delen. Det «tapte» er fortsatt der som spillvarme.', 2: 'Kraftverk og muskler *omdanner* energi – de lager den ikke.', 3: 'Energi forsvinner aldri (1. hovedsetning).' },
          explain: 'Energibevaring (1. hovedsetning): energi kan ikke skapes eller forsvinne. Se regnskapet: søylene er like høye hele veien.',
        }, ledger);
      }

      function ledger() {
        if (ended) return;
        stage.innerHTML = '';
        // beregn nyttig andel per ledd
        const useful = [100];
        for (let i = 1; i < L.length; i++) useful.push(useful[i - 1] * L[i].eta);
        const cv = el('canvas', { class: 'ek-canvas', 'aria-label': 'Energiregnskap: nyttig energi og spillvarme per ledd' });
        const txt = el('div', { class: 'small' });
        const next = el('button', { class: 'btn primary block', id: 'ek-next', text: 'Videre', disabled: true, onclick: () => { api.sfx('click'); askEnd(); } });
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Steg 3 av 4 · energiregnskap' }),
          cv,
          el('div', { class: 'ek-legend' }, [
            el('span', { html: `<i style="background:var(--energy)"></i>nyttig (høyverdig)` }),
            el('span', { html: `<i style="background:var(--heat)"></i>spillvarme (lavverdig)` }),
          ]),
          txt,
        ]), next);
        const H = 200; let W = 300; let ctx = null;
        const fit = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 3);
          W = cv.clientWidth || 300;
          cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
          ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        fit();
        const C = { energy: col('--energy', '#ffb454'), heat: col('--heat', '#c9785d'), chalk: col('--chalk', '#eef0e6'), dim: col('--chalk-dim', '#a8b6ae'), line: col('--line', 'rgba(238,240,230,.16)'), mono: col('--f-mono', 'monospace'), board: col('--board', '#17221f') };
        const shown = L.map(() => 0); // animert andel 0..1 per søyle
        const t0 = performance.now();
        function frame(now) {
          if (ended) return;
          const el2 = (now - t0) / 1000;
          for (let i = 0; i < L.length; i++) shown[i] = NG.clamp((el2 - i * 0.7) / 0.5, 0, 1);
          ctx.clearRect(0, 0, W, H);
          const n = L.length; const top = 22; const bot = H - 34; const gap = 10;
          const bw = Math.min(56, (W - 20 - gap * (n - 1)) / n);
          const x0 = (W - (bw * n + gap * (n - 1))) / 2;
          const sc = (bot - top) / 100;
          ctx.strokeStyle = C.line; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(8, top); ctx.lineTo(W - 8, top); ctx.stroke(); ctx.setLineDash([]);
          ctx.font = '10px ' + C.mono; ctx.textAlign = 'right'; ctx.fillStyle = C.dim; ctx.textBaseline = 'bottom';
          ctx.fillText('totalt 100', W - 8, top - 3);
          for (let i = 0; i < n; i++) {
            const x = x0 + i * (bw + gap);
            const a = shown[i]; if (a <= 0) continue;
            const u = useful[i]; const h = 100 - u;
            ctx.globalAlpha = a;
            ctx.fillStyle = C.energy; ctx.fillRect(x, bot - u * sc * a, bw, u * sc * a);
            ctx.fillStyle = C.heat; ctx.fillRect(x, bot - 100 * sc * a, bw, h * sc * a);
            ctx.fillStyle = C.board; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '600 11px ' + C.mono;
            if (u * sc > 16) ctx.fillText(String(Math.round(u)), x + bw / 2, bot - u * sc / 2);
            if (h * sc > 16) { ctx.fillStyle = C.chalk; ctx.fillText(String(Math.round(h)), x + bw / 2, bot - u * sc - h * sc / 2); }
            ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textBaseline = 'top';
            ctx.fillText(L[i].s.slice(0, 9), x + bw / 2, bot + 6);
            ctx.globalAlpha = 1;
          }
          if (shown[n - 1] >= 1) {
            if (next.disabled) {
              next.disabled = false;
              const last = useful[n - 1];
              txt.innerHTML = api.md(`Hver søyle er **100 enheter** – energien er bevart. Men den nyttige delen krymper: bare **${Math.round(last)}** enheter ender som ${FORM[L[n - 1].f].t} i «${L[n - 1].s}». Resten (**${Math.round(100 - last)}**) er spredt som spillvarme. *Energi forbrukes ikke – det er kvaliteten vi forbruker.* (Omtrentlige tall.)`);
            }
            return;
          }
          raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
      }

      /* ---------- 4. Hvor ender den, og hvor startet den? ---------- */
      function askEnd() {
        cancelAnimationFrame(raf);
        ask({
          type: 'mc', topic: 'Energikvalitet', miss: 'energikvalitet / hvor energien ender',
          prompt: S.end,
          options: ['Spredt som termisk energi i omgivelsene – like mye som før, men lavverdig', 'Brukt opp – den er forbrukt og finnes ikke lenger noe sted', 'Tilbake i «' + L[0].s + '», klar til å brukes på nytt', 'Mesteparten har blitt til kulde som sprer seg i omgivelsene'],
          answer: 0,
          why: { 1: 'Energi blir aldri borte (1. hovedsetning). Den er bare spredt.', 2: 'Spredt energi samler seg ikke av seg selv igjen (2. hovedsetning).', 3: 'Kulde er ikke en energiform – kaldt betyr bare lav temperatur.' },
          explain: 'Til slutt blir nesten all energien termisk energi spredt i lufta, bakken og omgivelsene – noen få tideler av en grad varmere. Mengden er den samme, men **kvaliteten** er lav: spredt energi kan nesten ikke gjøre nytte igjen. Derfor trenger vi stadig ny høyverdig energi.',
        }, askOrigin);
      }

      function askOrigin() {
        ask({
          type: 'mc', topic: 'Kilden', miss: 'hvor energikjeden starter',
          prompt: `Kjeden din startet i «${L[0].n.toLowerCase()}». **Hvor kom den energien opprinnelig fra?**`,
          options: ORIGINS.slice(),
          answer: S.origin,
          explain: S.firstWhy + ' Nesten alle energikjeder på jorda starter i sola. **Unntakene** er tidevann (månen og jordrotasjonen), jordvarme (jordas indre) og kjerneenergi (uran).',
        }, summary);
      }

      function summary() {
        if (ended) return;
        ended = true;
        cancelAnimationFrame(raf); timers.forEach(clearTimeout);
        const buildOk = mistakes === 0;
        const buildScore = Math.max(0, 1 - mistakes * 0.25);
        const total = 1 + nA + mcTotal;
        const correct = (buildOk ? 1 : 0) + arrowsOk + mcOk;
        const score = (buildScore + arrowsOk + mcOk) / total;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s ek-sum' }, [
          el('h3', { class: 'h-display', text: 'Regnskapet går opp – ' + correct + ' av ' + total }),
          el('div', { class: 'small', text: buildOk ? 'Kjeden bygde du feilfritt.' : 'Kjeden: ' + mistakes + ' feiltrykk underveis.' }),
          el('ul', { html: [
            '**Energibevaring:** totalen er den samme i hvert ledd – energi lages ikke og blir ikke borte.',
            '**Energikvalitet:** i hvert ledd blir mer av energien lavverdig spillvarme. Det er kvaliteten vi forbruker.',
            '**Omdanning** = ny form. **Overføring** = samme form, nytt system.',
            'Nesten alle kjeder starter i **sola** – unntak: tidevann, jordvarme og kjerneenergi.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        scrollTo(stage);
        api.done({ score, correct, total, notes: 'Energikjede: ' + S.title + '. ' + (missed.length ? 'Bommet på: ' + Array.from(new Set(missed)).join(', ') + '.' : 'Alt riktig.') });
      }

      build();
      return { destroy() { ended = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); } };
    },
  });
})();
