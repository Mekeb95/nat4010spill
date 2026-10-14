/* Mini-spill: Plantedøgnet (liv) — vannpest i BTB-løsning i et lukket glass.
   Lys styrer fotosyntesen; celleåndingen går hele tiden. Netto gassutveksling farger indikatoren. */
(function () {
  'use strict';
  const ID = 'plantedognet';

  NG.css(`
.mg-plantedognet { display: flex; flex-direction: column; gap: 12px; }
.mg-plantedognet .pd-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.mg-plantedognet .pd-scene { border-radius: var(--r-m); overflow: hidden; border: 1px solid var(--line-strong); background: var(--board-2); }
.mg-plantedognet .pd-scene svg { display: block; width: 100%; height: auto; }
.mg-plantedognet .pd-bars { display: grid; grid-template-columns: 96px 1fr; gap: 6px 10px; align-items: center; font-size: var(--t-s); }
.mg-plantedognet .pd-bars .bar { height: 16px; }
.mg-plantedognet .pd-net { position: relative; height: 18px; border-radius: 999px; background: var(--board-4); overflow: hidden; }
.mg-plantedognet .pd-net::after { content: ''; position: absolute; left: 50%; top: -2px; bottom: -2px; width: 2px; background: var(--chalk); opacity: .7; }
.mg-plantedognet .pd-net > i { position: absolute; top: 0; bottom: 0; display: block; transition: left .2s, width .2s; }
.mg-plantedognet .pd-netlbl { display: flex; justify-content: space-between; font-size: var(--t-xs); color: var(--chalk-dim); font-family: var(--f-mono); }
.mg-plantedognet .pd-ctrl { display: flex; flex-direction: column; gap: 8px; }
.mg-plantedognet input[type=range] { width: 100%; height: 44px; accent-color: var(--warn); margin: 0; }
.mg-plantedognet .pd-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.mg-plantedognet .pd-steps .btn { padding: 6px 0; }
.mg-plantedognet .pd-status { font-size: var(--t-s); min-height: 2.6em; }
.mg-plantedognet .pd-bubble { background: var(--board-2); border: 2px solid var(--line-strong); border-radius: var(--r-m) var(--r-m) var(--r-m) 4px; padding: 10px 12px; }
.mg-plantedognet .pd-two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-plantedognet .pd-opts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mg-plantedognet .pd-opt { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; }
.mg-plantedognet .pd-sw { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--chalk); }
`);

  const R = 0.25; // celleånding, konstant (andel av maks fotosyntese)
  const P = (L) => (2 * L) / (L + 1); // fotosyntese: metning, P(1) = 1
  const LC = R / (2 - R); // kompensasjonspunkt ≈ 0,143
  const net = (L) => R - P(L); // > 0: netto CO₂ ut av planta (CO₂ i vannet øker)

  // BTB: blå (lite CO₂) → grønn → gul (mye CO₂)
  const BLUE = [74, 127, 214], GREEN = [96, 178, 110], YELLOW = [232, 205, 72];
  function btb(c) {
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const rgb = c < 0.5 ? mix(BLUE, GREEN, c / 0.5) : mix(GREEN, YELLOW, (c - 0.5) / 0.5);
    return `rgb(${rgb.join(',')})`;
  }
  function sky(L) {
    const n = [14, 22, 44], d = [92, 150, 190];
    return `rgb(${n.map((v, i) => Math.round(v + (d[i] - v) * Math.sqrt(L))).join(',')})`;
  }

  const STATEMENTS = [
    { id: 'ingen', who: 'Elev A', text: 'Planter har ikke celleånding — de har fotosyntese i stedet.', ok: false,
      why: 'Planteceller har både kloroplaster og mitokondrier. Celleåndingen går hele døgnet i alle levende celler — også i røttene, som aldri får lys.' },
    { id: 'tid', who: 'Elev B', text: 'Planter driver fotosyntese om dagen og celleånding om natta.', ok: false,
      why: 'Fotosyntese når det er lys, celleånding *hele tiden*. Om dagen går begge. Likningene er motsatte i *retning*, ikke i *tid*.' },
    { id: 'produserer', who: 'Elev C', text: 'Planter produserer oksygen om dagen og karbondioksid om natta.', ok: false, key: true,
      why: 'CO~2~ *produseres* hele døgnet av celleåndingen. Det som snur, er **netto** gassutveksling. «Produserer» og «avgir netto» er ikke det samme — den vanligste feilen, også hos voksne.' },
    { id: 'netto', who: 'Elev D', text: 'En solrik dag avgir planta netto O₂. Om natta avgir den netto CO₂.', ok: true, key: true,
      why: 'Presist! I sterkt lys er fotosyntesen større enn celleåndingen, så *nettoregnskapet* er CO~2~ inn og O~2~ ut. I mørket snur det.' },
    { id: 'komp', who: 'Elev E', text: 'I kompensasjonspunktet har planta stoppet både fotosyntese og celleånding.', ok: false,
      why: 'Begge går — like fort. Netto null betyr ikke at ingenting skjer: får du 100 kr og bruker 100 kr, har du fortsatt både fått og brukt penger.' },
    { id: 'energi', who: 'Elev F', text: 'Celleåndingen lager energi til planta.', ok: false,
      why: 'Energi lages ikke. Celleåndingen *frigjør* kjemisk energi som er lagret i sukker (opprinnelig fra sollyset) og gjør den tilgjengelig for cellen.' },
    { id: 'skap', who: 'Elev G', text: 'Setter vi glasset i et mørkt skap, blir BTB-løsningen etter hvert gul.', ok: true,
      why: 'Riktig: i mørket går bare celleåndingen, CO~2~ hoper seg opp i vannet, og løsningen blir sur → gul.' },
  ];

  NG.minigames.register({
    id: ID, region: 'liv', title: 'Plantedøgnet', icon: 'leaf',
    concepts: ['fotosyntese', 'celleanding', 'netto-gassutveksling', 'kompensasjonspunkt'],
    blurb: 'Styr lyset over en plante i BTB-løsning og avslør om planter «puster».',
    minutes: 3,
    start(root, api) {
      const h = api.el;
      const rng = api.rng;
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      root.classList.add('mg-' + ID);
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      let dead = false;
      let tick = null;
      let anim = null;
      const stopLoops = () => { if (tick) { clearInterval(tick); tick = null; } if (anim) { clearInterval(anim); anim = null; } };

      let L = 0.6; // lys 0..1
      let c = 0.5; // CO₂-nivå i vannet 0..1 (0,5 = grønn startfarge)
      let t = 0; // kosmetisk tid for bobler
      let correct = 0, total = 0;
      const notes = [];
      let refs = null; // elementer i scenen som oppdateres

      function scrollUp() { try { root.scrollIntoView({ block: 'start' }); } catch (e) { /* ok */ } }

      // ---------- Scene ----------
      function sceneSvg() {
        const leaves = [];
        const stems = [[150, 0.0], [170, 0.35], [190, -0.25]];
        stems.forEach(([x, bend], si) => {
          leaves.push(`<path d="M${x} 186 Q ${x + bend * 40} 140 ${x + bend * 20} 96" fill="none" stroke="#5fae55" stroke-width="3.5" stroke-linecap="round"/>`);
          for (let k = 0; k < 6; k++) {
            const y = 176 - k * 14; const tt = (186 - y) / 90; const cx = x + bend * 40 * tt * (1 - tt) * 2 + bend * 20 * tt * tt;
            const s = k % 2 ? 1 : -1;
            leaves.push(`<ellipse cx="${(cx + s * 7).toFixed(1)}" cy="${y}" rx="8" ry="3.2" transform="rotate(${s * -28} ${(cx + s * 7).toFixed(1)} ${y})" fill="#93df84" fill-opacity=".75" stroke="#5fae55" stroke-width="1"/>`);
          }
        });
        let bub = '';
        for (let i = 0; i < 7; i++) bub += `<circle class="pd-b" r="${2 + (i % 3)}" cx="0" cy="0" fill="none" stroke="#eef0e6" stroke-width="1.3" opacity="0"/>`;
        return `<svg viewBox="0 0 320 210" role="img" aria-label="Vannpest i BTB-løsning i et lukket glass">
          <rect class="pd-sky" x="0" y="0" width="320" height="210" fill="${sky(L)}"/>
          <circle class="pd-sun" cx="52" cy="40" r="20" fill="#ffd166" stroke="#ffe9a8" stroke-width="3"/>
          <circle class="pd-moon" cx="52" cy="40" r="14" fill="#eef0e6"/>
          <circle class="pd-moonc" cx="59" cy="35" r="12" fill="${sky(L)}"/>
          <rect x="0" y="196" width="320" height="14" fill="#3b2f26"/>
          <path d="M118 52 L 118 192 Q 118 198 124 198 L 216 198 Q 222 198 222 192 L 222 52" fill="none" stroke="#eef0e6" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="112" y="40" width="116" height="12" rx="3" fill="#6f7f77" stroke="#eef0e6" stroke-width="2.5"/>
          <path class="pd-liquid" d="M120 74 L 220 74 L 220 192 Q 220 196 216 196 L 124 196 Q 120 196 120 192 Z" fill="${btb(c)}" fill-opacity=".72"/>
          ${leaves.join('')}
          ${bub}
          <text x="236" y="30" fill="#eef0e6" font-size="13" font-family="var(--f-mono)" class="pd-lux">Lys 60 %</text>
          <text x="236" y="50" fill="#eef0e6" font-size="12" font-family="var(--f-mono)" class="pd-clock"></text>
          <text x="170" y="66" fill="#eef0e6" font-size="11" text-anchor="middle" font-family="var(--f-mono)">lokk: lukket</text>
        </svg>`;
      }

      function buildScene(parent) {
        const sc = h('div', { class: 'pd-scene', html: sceneSvg() });
        const pBar = h('i', { style: { background: 'var(--r-liv)', width: '0%' } });
        const rBar = h('i', { style: { background: 'var(--heat)', width: (R * 100) + '%' } });
        const nBar = h('i');
        const status = h('div', { class: 'pd-status' });
        const bars = h('div', { class: 'stack-s' }, [
          h('div', { class: 'pd-bars' }, [
            h('span', { text: 'Fotosyntese' }), h('div', { class: 'bar' }, pBar),
            h('span', { text: 'Celleånding' }), h('div', { class: 'bar' }, rBar),
          ]),
          h('div', { class: 'label', text: 'Netto gassutveksling (fotosyntese − celleånding)' }),
          h('div', { class: 'pd-net' }, nBar),
          h('div', { class: 'pd-netlbl' }, [h('span', { text: '← netto CO₂ ut' }), h('span', { text: 'netto CO₂ inn →' })]),
          status,
        ]);
        parent.append(sc, bars);
        refs = { svg: sc.querySelector('svg'), pBar, nBar, status };
        update();
      }

      function update(clockText) {
        if (!refs) return;
        const s = refs.svg;
        const p = P(L), n = net(L);
        s.querySelector('.pd-sky').setAttribute('fill', sky(L));
        s.querySelector('.pd-moonc').setAttribute('fill', sky(L));
        const day = L > 0.02;
        s.querySelector('.pd-sun').setAttribute('opacity', day ? String(0.35 + 0.65 * L) : '0');
        s.querySelector('.pd-moon').setAttribute('opacity', day ? '0' : '1');
        s.querySelector('.pd-moonc').setAttribute('opacity', day ? '0' : '1');
        s.querySelector('.pd-sun').setAttribute('cy', String(70 - 40 * L));
        s.querySelector('.pd-liquid').setAttribute('fill', btb(c));
        s.querySelector('.pd-lux').textContent = 'Lys ' + Math.round(L * 100) + ' %';
        s.querySelector('.pd-clock').textContent = clockText || '';
        // O₂-bobler: synlige når planta avgir netto O₂ (kosmetisk)
        const bubs = s.querySelectorAll('.pd-b');
        const rate = NG.clamp(-n / 0.75, 0, 1);
        bubs.forEach((b, i) => {
          const ph = ((t * (0.5 + rate) + i / bubs.length) % 1);
          const x = 140 + ((i * 37) % 60);
          b.setAttribute('cx', String(x + Math.sin((ph + i) * 6) * 3));
          b.setAttribute('cy', String(170 - ph * 96));
          b.setAttribute('opacity', rate > 0.02 && i / bubs.length < rate + 0.15 ? String(0.85 * (1 - ph)) : '0');
        });
        refs.pBar.style.width = (p * 100).toFixed(1) + '%';
        const nn = NG.clamp(-n / 0.75, -1, 1); // + = netto CO₂ inn
        if (nn >= 0) Object.assign(refs.nBar.style, { left: '50%', width: (nn * 50).toFixed(1) + '%', background: 'var(--r-liv)' });
        else Object.assign(refs.nBar.style, { left: (50 + nn * 50).toFixed(1) + '%', width: (-nn * 50).toFixed(1) + '%', background: 'var(--heat)' });
      }

      function statusText() {
        const n = net(L);
        if (Math.abs(n) < 0.02) return '<strong>Netto ≈ 0.</strong> Fotosyntese og celleånding går like fort.';
        if (n > 0) return `<strong>Netto CO₂ ut, O₂ inn.</strong> ${L < 0.01 ? 'Ingen fotosyntese i mørket —' : 'For lite lys —'} celleåndingen vinner.`;
        return '<strong>Netto CO₂ inn, O₂ ut.</strong> Fotosyntesen er større enn celleåndingen.';
      }

      function startLive() {
        stopLoops();
        tick = setInterval(() => {
          if (dead) return;
          t += 0.03;
          c = NG.clamp(c + net(L) * 0.012, 0.03, 0.97);
          update();
          if (refs) refs.status.innerHTML = statusText();
        }, 100);
      }

      function lightControls(onChange) {
        const range = h('input', { type: 'range', min: '0', max: '100', step: '1', value: String(Math.round(L * 100)), 'aria-label': 'Lysstyrke i prosent' });
        const set = (v) => { L = NG.clamp(v, 0, 100) / 100; range.value = String(Math.round(L * 100)); update(); if (refs) refs.status.innerHTML = statusText(); if (onChange) onChange(); };
        range.addEventListener('input', () => set(Number(range.value)));
        const step = (dv) => h('button', { class: 'btn', onclick: () => { sfx('click'); set(Math.round(L * 100) + dv); } }, (dv > 0 ? '+' : '−') + Math.abs(dv) + ' %');
        return h('div', { class: 'pd-ctrl' }, [
          h('div', { class: 'row' }, [h('span', { class: 'label', text: '🌙 Natt' }), h('span', { class: 'spacer' }), h('span', { class: 'label', text: 'Full sol ☀' })]),
          range,
          h('div', { class: 'pd-steps' }, [step(-10), step(-1), step(1), step(10)]),
        ]);
      }

      function header(title, chip) {
        return h('div', { class: 'pd-top' }, [h('h2', { class: 'h-display', text: title }), chip ? h('span', { class: 'chip', text: chip }) : null]);
      }

      // ---------- 1. Utforsk ----------
      function explore() {
        root.innerHTML = '';
        L = 0.6; c = 0.5;
        root.append(header('Plantedøgnet', 'Utforsk'),
          h('div', { class: 'small', html: api.md('Vannpest står i **BTB-løsning** i et lukket glass. BTB er **blå** ved lite CO~2~, **grønn** i midten og **gul** ved mye CO~2~ (CO~2~ gjør vannet surt).\nDra i lyset eller bruk knappene. Legg merke til celleåndings-stolpen.') }));
        buildScene(root);
        root.append(lightControls());
        root.append(h('button', { class: 'btn primary block', id: 'pd-next', onclick: () => predIntro(0) }, 'Jeg har sett nok — test meg →'));
        startLive();
      }

      // ---------- 2. Forutsigelser ----------
      const weak = rng.chance(d >= 2 ? 0.6 : 0.4)
        ? { L: 0.08, txt: 'en **mørk desemberdag** med tett skydekke (8 % lys)', ans: 0,
          why: 'Lyset er under kompensasjonspunktet: fotosyntesen er i gang, men mindre enn celleåndingen. Netto CO~2~ ut → svakt gul. Slik har planter i Oslo netto *tap* hele døgnet i desember — de vokser ikke om vinteren.' }
        : { L: 0.4, txt: 'en **overskyet sommerdag** (40 % lys)', ans: 2,
          why: 'Selv svakt dagslys er godt over kompensasjonspunktet: fotosyntesen er større enn celleåndingen, netto CO~2~ inn → blå.' };
      const PREDS = [
        { L: 0, txt: 'Glasset står i **mørket hele natta** (12 timer).', ans: 0,
          why: 'Uten lys ingen fotosyntese — men **celleåndingen går hele tiden**. CO~2~ hoper seg opp i vannet → gul.' },
        { L: 1, txt: 'Glasset står i **full sol** i 12 timer.', ans: 2,
          why: 'Fotosyntesen er mye større enn celleåndingen. Planta tar opp mer CO~2~ enn den lager → blå. Celleåndingen er fortsatt i gang!' },
      ];
      const OPTS = [{ t: 'Gul', c: 0.95, s: 'mer CO₂' }, { t: 'Grønn', c: 0.5, s: 'uendret' }, { t: 'Blå', c: 0.05, s: 'mindre CO₂' }];

      function predIntro(i) { predict(i < 2 ? PREDS[i] : Object.assign({}, weak, { txt: 'Glasset står gjennom ' + weak.txt + ' i 12 timer.' }), i); }

      function predict(pr, i) {
        stopLoops();
        root.innerHTML = '';
        c = 0.5; L = pr.L; t = 0;
        const n = i + 1;
        root.append(header('Forutsi fargen', `Forutsigelse ${n}/3`), h('div', { html: api.md(pr.txt + ' BTB er **grønn** nå. Hvilken farge har den etterpå?') }));
        buildScene(root);
        refs.status.innerHTML = '<span class="muted">Velg før du ser fasit.</span>';
        const fbBox = h('div', { class: 'stack' });
        let picked = false;
        const btns = OPTS.map((o, k) => h('button', { class: 'option pd-opt', onclick: () => go(k) }, [
          h('span', { class: 'pd-sw', style: { background: btb(o.c) } }), h('strong', { text: o.t }), h('span', { class: 'small muted', text: o.s })]));
        root.append(h('div', { class: 'pd-opts' }, btns), fbBox);
        function go(k) {
          if (picked) return; picked = true;
          btns.forEach((b, j) => { b.disabled = true; if (j === k) b.classList.add('selected'); });
          // Simuler 12 timer
          const target = NG.clamp(0.5 + net(L) * 2.5, 0.03, 0.97);
          let step = 0; const steps = 24;
          anim = setInterval(() => {
            if (dead) return;
            step++; t += 0.05;
            c = 0.5 + (target - 0.5) * (step / steps);
            update(Math.round((step / steps) * 12) + ' t');
            refs.status.innerHTML = statusText();
            if (step >= steps) {
              clearInterval(anim); anim = null;
              const ok = k === pr.ans;
              total++; if (ok) correct++; else notes.push(`forutsa ${OPTS[k].t.toLowerCase()} ved ${Math.round(pr.L * 100)} % lys`);
              sfx(ok ? 'good' : 'bad');
              btns.forEach((b, j) => { b.classList.remove('selected'); if (j === pr.ans) b.classList.add('correct'); else if (j === k) b.classList.add('wrong'); else b.classList.add('dim'); });
              fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Riktig.</strong> ' : `<strong>Den ble ${OPTS[pr.ans].t.toLowerCase()}.</strong> `) + api.md(pr.why) }),
                h('button', { class: 'btn primary block', id: 'pd-next', onclick: () => (i === 0 ? predIntro(1) : i === 1 ? comp() : grubl()) }, 'Videre →'));
            }
          }, 70);
        }
        scrollUp();
      }

      // ---------- 3. Kompensasjonspunktet ----------
      let compTries = 0;
      function comp() {
        stopLoops();
        root.innerHTML = '';
        L = rng.pick([0.02, 0.5, 0.8]); c = 0.5;
        root.append(header('Kompensasjonspunktet', 'Oppdrag'),
          h('div', { html: api.md('Finn lysstyrken der **fotosyntese = celleånding**. Da er netto gassutveksling null — og BTB-fargen står stille.') }));
        buildScene(root);
        const fbBox = h('div', { class: 'stack' });
        let lockBtn;
        root.append(lightControls(), lockBtn = h('button', { class: 'btn primary block', id: 'pd-lock', onclick: lock }, 'Her er det!'), fbBox);
        startLive();
        function lock() {
          compTries++;
          const n = net(L);
          if (Math.abs(n) <= 0.045) {
            const pts = compTries === 1 ? 1 : compTries === 2 ? 0.5 : 0.25;
            correct += pts; total++;
            sfx('good');
            finishComp(true);
          } else {
            sfx('bad');
            fbBox.replaceChildren(h('div', { class: 'feedback bad', html: n > 0
              ? 'Celleåndingen er fortsatt større — fargen kryper mot gul. Mer lys.'
              : 'Fotosyntesen er større — fargen kryper mot blå. Mindre lys.' }));
            if (compTries >= 3) { L = LC; update(); total++; notes.push('fant ikke kompensasjonspunktet'); finishComp(false); }
          }
        }
        function finishComp(ok) {
          lockBtn.disabled = true;
          root.querySelectorAll('.pd-ctrl button, .pd-ctrl input').forEach((b) => { b.disabled = true; });
          fbBox.replaceChildren(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: api.md((ok ? '**Funnet!** ' : '**Her er det: ca. ' + Math.round(LC * 100) + ' % lys.** ') +
            'I kompensasjonspunktet produserer planta *både* O~2~ og CO~2~ — like mye som den bruker. Netto er null, men begge prosessene går for fullt. Kompensasjonspunktet ligger lavt: selv svakt dagslys gir netto opptak av CO~2~.') }),
          h('button', { class: 'btn primary block', id: 'pd-next', onclick: () => predIntro(2) }, 'Videre →'));
        }
        scrollUp();
      }

      // ---------- 4. Grubletegning «Puster planter?» ----------
      function grubl() {
        stopLoops();
        refs = null;
        const keys = STATEMENTS.filter((s) => s.key);
        const rest = rng.shuffle(STATEMENTS.filter((s) => !s.key)).slice(0, 2);
        const list = rng.shuffle(keys.concat(rest));
        let i = 0;
        function show() {
          root.innerHTML = '';
          const s = list[i];
          const fbBox = h('div', { class: 'stack' });
          let picked = false;
          const b1 = h('button', { class: 'option', style: { textAlign: 'center' }, onclick: () => pick(true) }, 'Enig');
          const b2 = h('button', { class: 'option', style: { textAlign: 'center' }, onclick: () => pick(false) }, 'Uenig');
          function pick(v) {
            if (picked) return; picked = true;
            const ok = v === s.ok;
            total++; if (ok) correct++; else notes.push('grubletegning: ' + s.id);
            sfx(ok ? 'good' : 'bad');
            [b1, b2].forEach((b) => { b.disabled = true; });
            (s.ok ? b1 : b2).classList.add('correct');
            if (!ok) (v ? b1 : b2).classList.add('wrong');
            fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Godt vurdert.</strong> ' : '<strong>Tenk igjen.</strong> ') + api.md(s.why) }),
              h('button', { class: 'btn primary block', id: 'pd-next', onclick: () => { i++; if (i < list.length) show(); else summary(); } }, 'Videre →'));
          }
          root.append(header('Puster planter?', `Grubletegning ${i + 1}/${list.length}`),
            h('div', { class: 'small muted', text: 'Elevene diskuterer forsøket. Er du enig eller uenig?' }),
            h('div', { class: 'label', text: s.who }),
            h('div', { class: 'pd-bubble', text: '«' + s.text + '»' }),
            h('div', { class: 'pd-two' }, [b1, b2]), fbBox);
          scrollUp();
        }
        show();
      }

      // ---------- 5. Oppsummering ----------
      function summary() {
        stopLoops();
        root.innerHTML = '';
        const score = total ? correct / total : 0;
        let doneBtn;
        root.append(header('Puster planter? Ja — hele tiden', null),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: `Resultat: ${NG.fmt(correct, 2)} av ${total}` }),
            h('div', { html: api.md('**Celleånding** går hele døgnet i alle levende celler. **Fotosyntese** går bare når det er lys.\nDet som varierer mellom dag og natt, er **netto gassutveksling**: over kompensasjonspunktet tar planta netto opp CO~2~ og avgir netto O~2~; under det snur regnskapet.\nSi «planta *avgir netto* O~2~», ikke «planta *produserer* O~2~ om dagen og CO~2~ om natta».\nOrdet «puste» er hverdagsspråk (lunger); planter har diffusjon gjennom spalteåpninger — men ånding ligger i selve fagordet *celleånding*.') }),
          ]),
          doneBtn = h('button', { class: 'btn primary block', id: 'pd-done', onclick: () => { doneBtn.disabled = true; finish(score); } }, 'Fullfør laben'));
        scrollUp();
      }

      function finish(score) {
        stopLoops();
        if (api.finished) return;
        api.done({ score, correct: Math.round(correct * 100) / 100, total, notes: notes.join('; ') || 'alt riktig' });
      }

      explore();
      return { destroy() { dead = true; stopLoops(); } };
    },
  });
})();
