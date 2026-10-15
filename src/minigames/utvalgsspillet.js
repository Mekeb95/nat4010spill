/* Mini-spill: Utvalgsspillet (liv). Du er en fugl som spiser nattsvermere på bjørkebark. De du ikke ser, overlever
   og får avkom som ligner dem. Etter noen generasjoner blir barken sotete … Naturlig utvalg i praksis (bjørkemåleren). */
(function () {
  'use strict';
  const ID = 'utvalgsspillet';
  const POP = 24; const EAT = 10;

  NG.css(`
.mg-utvalgsspillet .us-canvas { display: block; width: 100%; border-radius: var(--r-m); border: 1px solid var(--line); touch-action: manipulation; cursor: crosshair; }
.mg-utvalgsspillet .us-hud { display: flex; justify-content: space-between; font: 600 var(--t-s) var(--f-mono); }
.mg-utvalgsspillet .us-graph { display: flex; align-items: flex-end; gap: 6px; height: 110px; padding: 8px; background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); }
.mg-utvalgsspillet .us-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; font: 600 var(--t-xs) var(--f-mono); color: var(--chalk-dim); height: 100%; justify-content: flex-end; }
.mg-utvalgsspillet .us-stack { width: 100%; display: flex; flex-direction: column-reverse; border-radius: 4px; overflow: hidden; height: 70px; }
.mg-utvalgsspillet .us-stack i { display: block; width: 100%; }
`);

  const LIGHT = [217, 210, 192]; const DARK = [43, 38, 34];
  const mix = (t) => LIGHT.map((v, i) => Math.round(v + (DARK[i] - v) * t));
  const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;

  NG.minigames.register({
    id: ID, region: 'liv', title: 'Utvalgsspillet', icon: 'bird',
    concepts: ['naturlig-utvalg', 'evolusjon', 'tilpasning', 'arv', 'reproduksjon'],
    blurb: 'Vær fuglen som jakter nattsvermere – og se bestanden endre seg fra generasjon til generasjon.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let right = 0; let total = 0; const missed = [];
      const GENS = d === 1 ? 4 : 5; const sootFrom = d === 1 ? 2 : 3; // generasjonen der barken blir sotete (0-basert)
      const history = [];
      // bestand: mørkhet 0–1. Starter mest lys, men med variasjon (noen mørke mutanter finnes allerede).
      let moths = [];
      for (let i = 0; i < POP; i++) moths.push({ c: i < 2 ? 0.85 + rng.next() * 0.15 : NG.clamp(0.08 + rng.next() * 0.35, 0, 1) });
      let gen = 0; let eaten = 0; let soot = false;

      const cv = el('canvas', { class: 'us-canvas', 'aria-label': 'Bjørkebark med nattsvermere. Trykk på dem du ser.' });
      const hud = el('div', { class: 'us-hud', 'aria-live': 'polite' });
      const stage = el('div', { class: 'stack' });
      const graph = el('div', { class: 'us-graph', 'aria-label': 'Fargefordeling i hver generasjon' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Livsskogen · lab' }), el('span', { class: 'chip', text: 'Naturlig utvalg' })]),
        el('h2', { class: 'h-display', text: 'Utvalgsspillet' }),
        el('div', { class: 'small', html: api.md(`Du er en fugl. På barken sitter ${POP} nattsvermere. **Spis ${EAT}** – de du får øye på først. De som overlever, får avkom som ligner dem.`) }),
        cv, hud, stage, graph,
      ]));

      let W = 340; let H = 300; let ctx = null; let bark = null;
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340; H = Math.round(W * 0.85);
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      // Barken tegnes én gang per generasjon (frøsatt støy, så den er lik hver gang den tegnes på nytt)
      function makeBark() {
        const r = NG.makeRng(api.seed + gen * 31);
        const base = soot ? 0.82 : 0.12;
        const flecks = [];
        for (let i = 0; i < 260; i++) flecks.push({ x: r.next() * W, y: r.next() * H, w: 6 + r.next() * 30, h: 2 + r.next() * 5, t: NG.clamp(base + (r.next() - 0.5) * 0.5, 0, 1) });
        // mørke, vannrette barkstriper som på bjørk
        for (let i = 0; i < 26; i++) flecks.push({ x: r.next() * W, y: r.next() * H, w: 20 + r.next() * 60, h: 3 + r.next() * 4, t: soot ? 0.98 : 0.75 });
        bark = { base, flecks };
      }
      function drawMoth(m) {
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
        ctx.fillStyle = rgb(mix(m.c));
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(-15, 7); ctx.lineTo(-4, 9); ctx.lineTo(0, 4); ctx.lineTo(4, 9); ctx.lineTo(15, 7); ctx.closePath(); ctx.fill();
        ctx.fillStyle = rgb(mix(NG.clamp(m.c + 0.15, 0, 1))); ctx.fillRect(-1.5, -5, 3, 12);
        ctx.restore();
      }
      function draw() {
        ctx.fillStyle = rgb(mix(bark.base)); ctx.fillRect(0, 0, W, H);
        for (const f of bark.flecks) { ctx.fillStyle = rgb(mix(f.t)); ctx.fillRect(f.x, f.y, f.w, f.h); }
        for (const m of moths) if (!m.dead) drawMoth(m);
      }
      function place() {
        const r = NG.makeRng(api.seed + gen * 97 + 5);
        for (const m of moths) { m.x = 18 + r.next() * (W - 36); m.y = 14 + r.next() * (H - 28); m.a = (r.next() - 0.5) * 0.9; }
      }
      const updHud = () => { hud.innerHTML = `<span>Generasjon ${gen + 1} av ${GENS}</span><span>Spist: ${eaten}/${EAT}</span>`; };

      function tap(e) {
        if (ended || eaten >= EAT) return;
        const r = cv.getBoundingClientRect();
        const x = (e.clientX - r.left) * (W / r.width); const y = (e.clientY - r.top) * (H / r.height);
        let best = null; let bd = 20;
        for (const m of moths) if (!m.dead) { const dd = Math.hypot(m.x - x, m.y - y); if (dd < bd) { bd = dd; best = m; } }
        if (!best) return;
        best.dead = true; eaten++; api.sfx('coin');
        draw(); updHud();
        if (eaten >= EAT) setTimeout(breed, 400);
      }
      cv.addEventListener('pointerdown', tap);

      function stats() {
        const live = moths.filter((m) => !m.dead);
        const bins = [0, 0, 0];
        for (const m of moths) bins[m.c < 0.34 ? 0 : m.c < 0.67 ? 1 : 2]++;
        return { mean: moths.reduce((a, m) => a + m.c, 0) / moths.length, bins, live: live.length };
      }
      function drawGraph() {
        graph.innerHTML = '';
        history.forEach((h, i) => {
          const st = el('div', { class: 'us-stack' }, h.bins.map((n, k) => el('i', { style: { height: (100 * n / POP) + '%', background: rgb(mix([0.15, 0.5, 0.9][k])) } })));
          graph.appendChild(el('div', { class: 'us-col' }, [st, el('span', { text: 'G' + (i + 1) + (h.soot ? '*' : '') })]));
        });
      }

      function startGen() {
        if (ended) return;
        soot = gen >= sootFrom;
        eaten = 0; fit(); makeBark(); place(); draw(); updHud();
        history.push(Object.assign(stats(), { soot }));
        drawGraph();
        stage.innerHTML = '';
        if (gen === sootFrom) stage.append(el('div', { class: 'feedback bad small', html: api.md('**Industrien har kommet til byen.** Sot fra kullfyring har gjort barken mørk. Fortsett å jakte!') }));
      }

      function breed() {
        if (ended) return;
        const survivors = moths.filter((m) => !m.dead);
        const next = [];
        // hver overlevende får avkom som ligner den (arv), med litt variasjon (mutasjon/rekombinasjon)
        const r = NG.makeRng(api.seed + gen * 13 + 1);
        let i = 0;
        while (next.length < POP) {
          const p = survivors[i % survivors.length]; i++;
          next.push({ c: NG.clamp(p.c + (r.next() - 0.5) * 0.16, 0, 1) });
        }
        moths = next;
        gen++;
        if (gen >= GENS) { history.push(Object.assign(stats(), { soot })); drawGraph(); finishHunt(); return; }
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [
          el('div', { html: api.md(`De ${survivors.length} overlevende har fått avkom. Se fordelingen under: ${gen === 1 ? 'hver søyle er én generasjon (lys / middels / mørk).' : ''}`) }),
          el('button', { class: 'btn primary block', text: `Generasjon ${gen + 1}`, onclick: () => { api.sfx('click'); startGen(); } }),
        ]));
        drawGraph();
      }

      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) right++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
      }

      function finishHunt() {
        cv.removeEventListener('pointerdown', tap);
        const before = history[sootFrom]; const after = history[history.length - 1];
        const shifted = after.mean > before.mean + 0.08;
        const list = [
          {
            type: 'mc', topic: 'Naturlig utvalg', miss: 'individer endrer seg ikke', level: 3,
            prompt: shifted ? `Etter at barken ble mørk, økte andelen mørke nattsvermere (fra ${before.bins[2]} til ${after.bins[2]} av ${POP}). Hva er den beste forklaringen?` : 'Hvis andelen mørke nattsvermere øker etter at barken blir mørk – hva er den beste forklaringen?',
            options: ['Mørke individer fantes allerede; de ble sjeldnere spist og fikk flere avkom, som arvet fargen', 'Nattsvermerne ble mørkere fordi de trengte å gjemme seg', 'Soten farget vingene til nattsvermerne', 'Fuglene lærte nattsvermerne å velge mørk bark'],
            answer: 0,
            why: { 1: 'Individer kan ikke endre genene sine fordi de «trenger» det. Det er bestanden som endrer seg over generasjoner.', 2: 'En farge påført utenfra arves ikke.', 3: 'Atferd kan endres, men her endret fargen seg i bestanden – det er arv og utvalg.' },
            explain: '**Variasjon** fantes fra før (noen få mørke). Miljøet endret seg, så mørke individer overlevde oftere og fikk flere avkom (**utvalg**), og avkommet arvet fargen (**arv**). Bestanden ble mørkere – ingen enkeltindivid endret seg.',
          },
          {
            type: 'multi', topic: 'Naturlig utvalg', miss: 'vilkår for naturlig utvalg', level: 2,
            prompt: 'Hvilke vilkår må være oppfylt for at naturlig utvalg skal skje?',
            options: ['Individene i bestanden er forskjellige (variasjon)', 'Egenskapene kan arves', 'Det fødes flere enn som overlever', 'Individene prøver å tilpasse seg', 'Miljøet er uforandret'],
            answer: [0, 1, 2],
            explain: 'Variasjon + arv + overproduksjon (konkurranse/predasjon) gir naturlig utvalg. «Prøve» har ingenting med det å gjøre, og et miljø i endring gjør ofte utvalget tydeligere.',
          },
        ];
        if (d >= 2) list.push({
          type: 'tf', topic: 'Arv', miss: 'ervervede egenskaper arves ikke', level: 3,
          prompt: 'En nattsverm som overlever lenge på mørk bark, får mørkere avkom fordi den har vært på mørk bark.',
          answer: false,
          explain: 'Erfaringer i løpet av livet endrer ikke genene i kjønnscellene. Avkommet ligner foreldrene fordi de **arver** foreldrenes gener – uansett hvor foreldrene har sittet.',
        });
        if (d >= 3) list.push({
          type: 'mc', topic: 'Evolusjon', miss: 'utvalget kan snu', level: 5,
          prompt: 'I England ble bjørkemålerne mørkere på 1800-tallet. Etter at lufta ble renere på 1900-tallet, ble de lyse igjen. Hva viser det?',
          options: ['Utvalget følger miljøet: når barken ble lys igjen, ble de lyse igjen favorisert', 'At evolusjon går i sirkel og alltid kommer tilbake til start', 'At de mørke nattsvermerne døde av forurensningen', 'At evolusjon har et mål, og målet er lys farge'],
          answer: 0,
          why: { 1: 'Evolusjon har ingen fast retning – den følger hvilke egenskaper som gir fordel der og da.', 2: 'Det var ikke forurensningen i seg selv, men hvor godt de var kamuflert, som avgjorde.', 3: 'Evolusjon har ikke noe mål.' },
          explain: 'Naturlig utvalg har ingen plan. Det som er en fordel, avhenger av miljøet. Bjørkemåleren er et klassisk eksempel på at utvalget kan snu når miljøet endrer seg.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary(before, after));
        go();
      }

      function summary(before, after) {
        if (ended) return;
        ended = true;
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${right} av ${total} riktige` }),
          el('div', { class: 'small', text: `Mørke i bestanden: ${before.bins[2]} av ${POP} da barken ble sotete → ${after.bins[2]} av ${POP} til slutt.` }),
          el('ul', { html: [
            'Naturlig utvalg krever **variasjon**, **arv** og at det fødes **flere enn som overlever**.',
            'Det er **bestanden** som endrer seg over generasjoner – ikke individene.',
            'Hva som er en fordel, avhenger av miljøet. Evolusjon har ikke noe mål.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: `Utvalgsspillet: mørke ${before.bins[2]} → ${after.bins[2]} av ${POP}. ` + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      const onResize = () => { if (!ended && bark) { fit(); makeBark(); place(); draw(); } };
      window.addEventListener('resize', onResize);
      startGen();
      return { destroy() { ended = true; cv.removeEventListener('pointerdown', tap); window.removeEventListener('resize', onResize); } };
    },
  });
})();
