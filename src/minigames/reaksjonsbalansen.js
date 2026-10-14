/* Mini-spill: Reaksjonsbalansen (stoffer) — balanser reaksjonslikninger med koeffisienter.
   Atomtelling per grunnstoff, mikronivå-tegning og en vekt som viser massebevaring. */
(function () {
  'use strict';
  const ID = 'reaksjonsbalansen';

  NG.css(`
.mg-reaksjonsbalansen { display: flex; flex-direction: column; gap: 12px; }
.mg-reaksjonsbalansen .rb-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.mg-reaksjonsbalansen .rb-eq { font-size: 1.25rem; font-weight: 700; text-align: center; line-height: 1.6; padding: 8px 6px;
  background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); overflow-wrap: anywhere; }
.mg-reaksjonsbalansen .rb-eq .rb-k { color: var(--r-stoffer); font-family: var(--f-mono); }
.mg-reaksjonsbalansen .rb-eq .rb-k.one { color: var(--chalk-faint); }
.mg-reaksjonsbalansen .rb-eq .rb-arrow { color: var(--chalk-dim); padding: 0 4px; }
.mg-reaksjonsbalansen .rb-sides { display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: start; }
.mg-reaksjonsbalansen .rb-col { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.mg-reaksjonsbalansen .rb-mid { align-self: center; font-size: 1.4rem; color: var(--chalk-dim); }
.mg-reaksjonsbalansen .rb-sp { background: var(--board-2); border: 1px solid var(--line-strong); border-radius: var(--r-m); padding: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.mg-reaksjonsbalansen .rb-formula { background: none; border: 0; padding: 2px 6px; font-size: 1.15rem; font-weight: 700; color: var(--chalk); cursor: pointer; min-height: 32px; }
.mg-reaksjonsbalansen .rb-step { display: flex; align-items: center; gap: 4px; }
.mg-reaksjonsbalansen .rb-step .btn { min-width: 44px; min-height: 44px; padding: 0; font-size: 1.3rem; line-height: 1; }
.mg-reaksjonsbalansen .rb-step .rb-n { min-width: 30px; text-align: center; font-family: var(--f-mono); font-size: 1.3rem; color: var(--r-stoffer); }
.mg-reaksjonsbalansen .rb-count { width: 100%; border-collapse: collapse; font-family: var(--f-mono); font-size: var(--t-s); }
.mg-reaksjonsbalansen .rb-count th, .mg-reaksjonsbalansen .rb-count td { padding: 4px 6px; text-align: center; border-bottom: 1px solid var(--line); }
.mg-reaksjonsbalansen .rb-count th { color: var(--chalk-dim); font-weight: 400; font-size: var(--t-xs); text-transform: uppercase; letter-spacing: .06em; }
.mg-reaksjonsbalansen .rb-count tr.ok td { color: var(--good); }
.mg-reaksjonsbalansen .rb-count tr.no td { color: var(--bad); }
.mg-reaksjonsbalansen .rb-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; vertical-align: -1px; margin-right: 4px; border: 1px solid rgba(0,0,0,.4); }
.mg-reaksjonsbalansen .rb-micro { display: grid; grid-template-columns: 1fr auto 1fr; gap: 4px; align-items: center; background: var(--board-2); border: 1px dashed var(--line-strong); border-radius: var(--r-m); padding: 8px 6px; }
.mg-reaksjonsbalansen .rb-pile { display: flex; flex-wrap: wrap; gap: 5px 7px; align-items: center; justify-content: center; min-height: 40px; min-width: 0; }
.mg-reaksjonsbalansen .rb-pile svg { display: block; max-width: 100%; height: auto; }
.mg-reaksjonsbalansen .rb-scale svg { display: block; width: 100%; height: auto; }
.mg-reaksjonsbalansen .rb-beam { transition: transform .45s ease; }
.mg-reaksjonsbalansen .rb-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-reaksjonsbalansen .rb-legend { display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-reaksjonsbalansen .rb-sum li { margin-bottom: 4px; }
`);

  // Molare masser (g/mol), fargekritt og navn per grunnstoff
  const MM = { H: 1.008, C: 12.01, N: 14.01, O: 16.0, Na: 22.99, Mg: 24.31, Al: 26.98, Cl: 35.45, Fe: 55.85 };
  const COL = { H: '#eef0e6', C: '#59605c', N: '#7cc8ff', O: '#ff7d6e', Na: '#c4a6ff', Mg: '#ffe166', Al: '#b9c4be', Cl: '#93df84', Fe: '#c9785d' };
  const NAME = { H: 'hydrogen', C: 'karbon', N: 'nitrogen', O: 'oksygen', Na: 'natrium', Mg: 'magnesium', Al: 'aluminium', Cl: 'klor', Fe: 'jern' };

  // Forenklede romlige modeller (enhet ≈ atomdiameter). Ikke ekte bindingsvinkler — et mikronivå-bilde.
  function ringGlucose() {
    const a = [];
    for (let i = 0; i < 6; i++) {
      const t = (Math.PI / 3) * i;
      a.push(['C', Math.cos(t) * 0.95, Math.sin(t) * 0.95]);
      a.push(['O', Math.cos(t) * 1.85, Math.sin(t) * 1.85]);
      a.push(['H', Math.cos(t + 0.32) * 2.55, Math.sin(t + 0.32) * 2.55]);
      a.push(['H', Math.cos(t - 0.32) * 2.55, Math.sin(t - 0.32) * 2.55]);
    }
    return a;
  }
  const SHAPE = {
    H2: [['H', -0.32, 0], ['H', 0.32, 0]],
    O2: [['O', -0.45, 0], ['O', 0.45, 0]],
    N2: [['N', -0.45, 0], ['N', 0.45, 0]],
    Cl2: [['Cl', -0.45, 0], ['Cl', 0.45, 0]],
    H2O: [['O', 0, -0.1], ['H', -0.62, 0.38], ['H', 0.62, 0.38]],
    CO2: [['O', -0.9, 0], ['C', 0, 0], ['O', 0.9, 0]],
    CH4: [['C', 0, 0], ['H', -0.55, -0.55], ['H', 0.55, -0.55], ['H', -0.55, 0.55], ['H', 0.55, 0.55]],
    NH3: [['N', 0, -0.15], ['H', -0.66, 0.3], ['H', 0.66, 0.3], ['H', 0, 0.66]],
    NaCl: [['Na', -0.47, 0], ['Cl', 0.47, 0]],
    MgO: [['Mg', -0.47, 0], ['O', 0.47, 0]],
    Na: [['Na', 0, 0]], Mg: [['Mg', 0, 0]], Fe: [['Fe', 0, 0]], Al: [['Al', 0, 0]],
    Fe2O3: [['O', -1.8, 0.28], ['Fe', -0.9, -0.28], ['O', 0, 0.28], ['Fe', 0.9, -0.28], ['O', 1.8, 0.28]],
    Al2O3: [['O', -1.8, 0.28], ['Al', -0.9, -0.28], ['O', 0, 0.28], ['Al', 0.9, -0.28], ['O', 1.8, 0.28]],
    C3H8: [['C', -0.9, 0], ['C', 0, 0], ['C', 0.9, 0], ['H', -1.55, 0], ['H', -0.9, -0.62], ['H', -0.9, 0.62],
      ['H', 0, -0.62], ['H', 0, 0.62], ['H', 0.9, -0.62], ['H', 0.9, 0.62], ['H', 1.55, 0]],
    C6H12O6: ringGlucose(),
  };

  // Likningsbank. sol = minste hele tall. tempt = fristende indeksendring og hvorfor den lager et annet stoff.
  const BANK = [
    { id: 'vann', tier: 1, name: 'Hydrogen brenner (knallgass)', L: ['H2', 'O2'], R: ['H2O'], sol: [2, 1, 2],
      tempt: { from: 'H2O', to: 'H2O2', text: '**H~2~O~2~** er hydrogenperoksid — et blekemiddel, ikke vann. Indeksene forteller *hvilket stoff* det er; koeffisientene forteller *hvor mange* partikler.' } },
    { id: 'salt', tier: 1, name: 'Natrium + klor gir koksalt', L: ['Na', 'Cl2'], R: ['NaCl'], sol: [2, 1, 2],
      tempt: { from: 'NaCl', to: 'NaCl2', text: '**NaCl~2~** finnes ikke. Natrium danner Na^+^ og klor Cl^−^, så ionene må stå i forholdet 1 : 1. Formelen er bestemt av ladningene, ikke av hva som passer i regnestykket.' } },
    { id: 'magnesium', tier: 1, name: 'Magnesium brenner', L: ['Mg', 'O2'], R: ['MgO'], sol: [2, 1, 2],
      tempt: { from: 'MgO', to: 'MgO2', text: '**MgO~2~** ville vært magnesiumperoksid, et annet stoff enn det hvite pulveret magnesiumoksid. Mg^2+^ og O^2−^ gir forholdet 1 : 1.' } },
    { id: 'ammoniakk', tier: 1, name: 'Ammoniakk lages (Haber–Bosch)', L: ['N2', 'H2'], R: ['NH3'], sol: [1, 3, 2],
      tempt: { from: 'NH3', to: 'N2H3', text: '**N~2~H~3~** er ikke ammoniakk. Endrer du indeksen, beskriver du et annet stoff — og likningen handler ikke lenger om reaksjonen du observerte.' } },
    { id: 'metan', tier: 2, name: 'Metan (naturgass) brenner', L: ['CH4', 'O2'], R: ['CO2', 'H2O'], sol: [1, 2, 1, 2],
      tempt: { from: 'H2O', to: 'H2O2', text: 'Med **H~2~O~2~** (hydrogenperoksid) ville likningen påstå at et blekemiddel dannes når gass brenner. Det er ikke det vi observerer — det dannes vanndamp.' } },
    { id: 'rust', tier: 2, name: 'Jern ruster', L: ['Fe', 'O2'], R: ['Fe2O3'], sol: [4, 3, 2],
      tempt: { from: 'Fe2O3', to: 'Fe2O2', text: '**Fe~2~O~2~** (dvs. FeO) er jern(II)oksid, et svart stoff — ikke rødbrun rust. Rust er jern(III)oksid fordi Fe^3+^ og O^2−^ gir forholdet 2 : 3.' } },
    { id: 'aluminium', tier: 2, name: 'Aluminium får oksidlag', L: ['Al', 'O2'], R: ['Al2O3'], sol: [4, 3, 2],
      tempt: { from: 'Al2O3', to: 'AlO', text: '**AlO** er ikke aluminiumoksid. Al^3+^ og O^2−^ må gå i forholdet 2 : 3 for at ladningene skal gå opp — derfor Al~2~O~3~.' } },
    { id: 'propan', tier: 3, name: 'Propan (gassgrill) brenner', L: ['C3H8', 'O2'], R: ['CO2', 'H2O'], sol: [1, 5, 3, 4],
      tempt: { from: 'C3H8', to: 'C3H6', text: '**C~3~H~6~** er propen, ikke propan. Ett H-tall endret = et annet stoff med andre egenskaper.' } },
    { id: 'fotosyntese', tier: 3, name: 'Fotosyntese', L: ['CO2', 'H2O'], R: ['C6H12O6', 'O2'], sol: [6, 6, 1, 6],
      tempt: { from: 'O2', to: 'O12', text: '**O~12~** finnes ikke som stoff — oksygen fra fotosyntesen er O~2~-molekyler. Å endre indeksen ville beskrevet et oppdiktet stoff.' } },
  ];

  function parse(f) {
    const out = {};
    f.replace(/([A-Z][a-z]?)(\d*)/g, (m, el, n) => { out[el] = (out[el] || 0) + (n ? Number(n) : 1); return m; });
    return out;
  }
  const fhtml = (f) => f.replace(/(\d+)/g, '<sub>$1</sub>');
  const molar = (f) => { const p = parse(f); let s = 0; for (const e in p) s += MM[e] * p[e]; return s; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fmt = (n, d) => Number(n).toLocaleString('nb-NO', { minimumFractionDigits: d, maximumFractionDigits: d });

  function moleculeSvg(f, U) {
    const atoms = SHAPE[f] || [[Object.keys(parse(f))[0], 0, 0]];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    const rr = (e) => (e === 'H' ? 0.3 : 0.47);
    for (const [e, x, y] of atoms) { const r = rr(e); x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r); }
    const pad = 0.06; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    // tegn H sist (ytterst) for et ryddigere bilde
    const sorted = atoms.slice().sort((a, b) => (a[0] === 'H') - (b[0] === 'H'));
    const circles = sorted.map(([e, x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${rr(e)}" fill="${COL[e]}" stroke="rgba(10,16,14,.75)" stroke-width="0.07"/>`).join('');
    const w = (x1 - x0) * U, h = (y1 - y0) * U;
    return `<svg viewBox="${x0.toFixed(2)} ${y0.toFixed(2)} ${(x1 - x0).toFixed(2)} ${(y1 - y0).toFixed(2)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" aria-hidden="true">${circles}</svg>`;
  }

  NG.minigames.register({
    id: ID, region: 'stoffer', title: 'Reaksjonsbalansen', icon: 'scale',
    concepts: ['reaksjonslikning', 'massebevaringsloven', 'kjemiens-tre-nivaer', 'kjemisk-reaksjon'],
    blurb: 'Balanser reaksjonslikninger med koeffisienter — og se at ingen atomer forsvinner.',
    minutes: 3,
    start(root, api) {
      const h = api.el;
      const rng = api.rng;
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      const timers = new Set();
      let dead = false;
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (!dead) fn(); }, ms); timers.add(t); };
      const clearAll = () => { for (const t of timers) clearTimeout(t); timers.clear(); };
      root.classList.add('mg-' + ID);
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* lyd er valgfritt */ } };

      // Velg likninger: økende vanskelighet, styrt av difficulty
      const tiers = d === 1 ? [1, 1, 2] : d === 2 ? [1, 2, 3] : [2, 3, 3];
      const used = new Set();
      const eqs = tiers.map((t) => {
        const pool = rng.shuffle(BANK.filter((e) => e.tier === t && !used.has(e.id)));
        const e = pool[0]; used.add(e.id); return e;
      });

      let idx = 0;
      let coef = [];
      let fails = 0;
      let solved = false;
      let revealed = false;
      let tempted = 0;
      let showTempt = false;
      const results = [];
      let correct = 0, total = 0;
      const notes = [];

      function count(eq, side) {
        const list = side === 'L' ? eq.L : eq.R;
        const off = side === 'L' ? 0 : eq.L.length;
        const c = {};
        list.forEach((f, i) => { const p = parse(f); for (const e in p) c[e] = (c[e] || 0) + p[e] * coef[off + i]; });
        return c;
      }
      function elementsOf(eq) {
        const order = [];
        for (const f of eq.L.concat(eq.R)) for (const e in parse(f)) if (!order.includes(e)) order.push(e);
        return order;
      }
      function massOf(eq, side) {
        const list = side === 'L' ? eq.L : eq.R;
        const off = side === 'L' ? 0 : eq.L.length;
        return list.reduce((s, f, i) => s + molar(f) * coef[off + i], 0);
      }
      function isBalanced(eq) {
        const a = count(eq, 'L'), b = count(eq, 'R');
        return elementsOf(eq).every((e) => (a[e] || 0) === (b[e] || 0));
      }

      function startEq() {
        const eq = eqs[idx];
        coef = eq.L.concat(eq.R).map(() => 1);
        fails = 0; solved = false; revealed = false; showTempt = false;
        render(true);
      }

      function eqLine(eq) {
        const part = (list, off) => list.map((f, i) => {
          const k = coef[off + i];
          return `<span class="rb-k${k === 1 ? ' one' : ''}">${k}</span>&#8239;${fhtml(f)}`;
        }).join(' + ');
        return part(eq.L, 0) + '<span class="rb-arrow"> → </span>' + part(eq.R, eq.L.length);
      }

      function speciesCard(eq, f, i) {
        const minus = h('button', { class: 'btn', 'aria-label': 'Færre ' + f, disabled: solved || coef[i] <= 1, onclick: () => { coef[i]--; sfx('click'); render(); } }, '−');
        const plus = h('button', { class: 'btn', 'aria-label': 'Flere ' + f, disabled: solved || coef[i] >= 12, onclick: () => { coef[i]++; sfx('click'); render(); } }, '+');
        return h('div', { class: 'rb-sp' }, [
          h('button', { class: 'rb-formula', html: fhtml(f), 'aria-label': 'Formel ' + f, onclick: () => { if (!solved) { showTempt = true; tempted++; render(); } } }),
          h('div', { class: 'rb-step' }, [minus, h('span', { class: 'rb-n', text: String(coef[i]) }), plus]),
        ]);
      }

      function countTable(eq) {
        const a = count(eq, 'L'), b = count(eq, 'R');
        const rows = elementsOf(eq).map((e) => {
          const ok = (a[e] || 0) === (b[e] || 0);
          return `<tr class="${ok ? 'ok' : 'no'}"><td style="text-align:left"><span class="rb-dot" style="background:${COL[e]}"></span>${e} <span class="muted small">${NAME[e]}</span></td><td>${a[e] || 0}</td><td>${ok ? '=' : '≠'}</td><td>${b[e] || 0}</td></tr>`;
        }).join('');
        return h('table', { class: 'rb-count', html: `<thead><tr><th style="text-align:left">Atom</th><th>Venstre</th><th></th><th>Høyre</th></tr></thead><tbody>${rows}</tbody>` });
      }

      function micro(eq) {
        const totalAtoms = (list, off) => list.reduce((s, f, i) => s + Object.values(parse(f)).reduce((x, y) => x + y, 0) * coef[off + i], 0);
        const big = Math.max(totalAtoms(eq.L, 0), totalAtoms(eq.R, eq.L.length));
        const U = big > 30 ? 10 : big > 16 ? 13 : 19;
        const pile = (list, off) => {
          let s = '';
          list.forEach((f, i) => { for (let k = 0; k < coef[off + i]; k++) s += moleculeSvg(f, U); });
          return h('div', { class: 'rb-pile', html: s });
        };
        const legend = elementsOf(eq).map((e) => `<span><span class="rb-dot" style="background:${COL[e]}"></span>${e}</span>`).join('');
        return h('div', { class: 'stack-s' }, [
          h('div', { class: 'label', text: 'Mikronivå — hver kule er ett atom (forenklet modell)' }),
          h('div', { class: 'rb-micro' }, [pile(eq.L, 0), h('span', { class: 'muted', text: '→' }), pile(eq.R, eq.L.length)]),
          h('div', { class: 'rb-legend', html: legend }),
        ]);
      }

      function scale(eq) {
        const mL = massOf(eq, 'L'), mR = massOf(eq, 'R');
        const diff = mR - mL;
        const ang = NG.clamp((diff / Math.max(mL, mR)) * 30, -14, 14);
        const rad = (ang * Math.PI) / 180;
        const cx = 160, cy = 40, arm = 110;
        const lx = cx - arm * Math.cos(rad), ly = cy - arm * Math.sin(rad);
        const rx = cx + arm * Math.cos(rad), ry = cy + arm * Math.sin(rad);
        const pan = (x, y, label, col) => `
          <line x1="${x}" y1="${y}" x2="${x - 30}" y2="${y + 40}" stroke="var(--chalk-dim)" stroke-width="1.5"/>
          <line x1="${x}" y1="${y}" x2="${x + 30}" y2="${y + 40}" stroke="var(--chalk-dim)" stroke-width="1.5"/>
          <path d="M${x - 40} ${y + 40} Q ${x} ${y + 58} ${x + 40} ${y + 40} Z" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="3" stroke-linecap="round"/>
          <text x="${x}" y="${y + 72}" text-anchor="middle" fill="var(--chalk)" font-size="15" font-family="var(--f-mono)">${label}</text>`;
        const svg = `<svg viewBox="0 0 320 146" role="img" aria-label="Vekt: venstre ${fmt(mL, 1)} g, høyre ${fmt(mR, 1)} g">
          <path d="M${cx} ${cy} L ${cx - 18} 118 L ${cx + 18} 118 Z" fill="var(--board-3)" stroke="var(--chalk)" stroke-width="3" stroke-linejoin="round"/>
          <line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${ry.toFixed(1)}" stroke="var(--chalk)" stroke-width="5" stroke-linecap="round"/>
          <circle cx="${cx}" cy="${cy}" r="5" fill="var(--chalk)"/>
          ${pan(Math.round(lx), Math.round(ly), fmt(mL, 1) + ' g', 'var(--r-stoffer)')}
          ${pan(Math.round(rx), Math.round(ry), fmt(mR, 1) + ' g', 'var(--r-stoffer)')}
        </svg>`;
        const same = Math.abs(diff) < 0.05;
        const txt = same
          ? 'Lik masse på begge sider: atomene er bare satt sammen på en ny måte.'
          : `Som likningen står nå, ${diff < 0 ? 'forsvinner' : 'oppstår'} ${fmt(Math.abs(diff), 1)} g. Det skjer aldri i virkeligheten — derfor må likningen balanseres.`;
        return h('div', { class: 'rb-scale stack-s' }, [
          h('div', { class: 'label', text: 'Massebevaring — masse (g) når hver koeffisient leses som mol' }),
          h('div', { html: svg }),
          h('div', { class: 'small ' + (same ? '' : 'muted'), style: same ? { color: 'var(--good)' } : null, text: txt }),
        ]);
      }

      function temptCard(eq) {
        const t = eq.tempt;
        return h('div', { class: 'feedback bad stack-s' }, [
          h('strong', { html: `Fristende: ${fhtml(t.from)} → ${fhtml(t.to)}?` }),
          h('div', { html: api.md(t.text) }),
          h('div', { class: 'small muted', text: 'Derfor er indeksene låst. Balanser bare med koeffisientene (de store tallene foran).' }),
          h('button', { class: 'btn small', onclick: () => { showTempt = false; render(); } }, 'Skjønner — tilbake'),
        ]);
      }

      function check() {
        const eq = eqs[idx];
        if (isBalanced(eq)) {
          const g = coef.reduce((a, b) => gcd(a, b));
          if (g > 1) {
            sfx('click');
            fb = { cls: 'bad', html: `Balansert — men alle koeffisientene kan deles på ${g}. Skriv likningen med <strong>minste hele tall</strong>.` };
            render();
            return;
          }
          solved = true;
          const pts = fails === 0 ? 1 : fails <= 2 ? 0.5 : 0.25;
          results.push({ id: eq.id, pts, fails });
          correct += pts; total += 1;
          sfx('good');
          fb = { cls: 'good', html: `<strong>Balansert!</strong> ${eqLine(eq)}<br><span class="small">Like mange atomer av hvert grunnstoff på begge sider — og dermed lik masse: ${fmt(massOf(eq, 'L'), 1)} g = ${fmt(massOf(eq, 'R'), 1)} g.</span>` };
          render();
        } else {
          fails++;
          sfx('bad');
          const a = count(eq, 'L'), b = count(eq, 'R');
          const off = elementsOf(eq).filter((e) => (a[e] || 0) !== (b[e] || 0));
          const e = off[0];
          fb = { cls: 'bad', html: `Ikke balansert ennå: <strong>${e}</strong> har ${a[e] || 0} til venstre og ${b[e] || 0} til høyre.` +
            (fails === 1 ? '<br><span class="small">Tips: begynn med grunnstoffet som bare finnes i ett stoff på hver side, og ta O eller H til slutt.</span>' : '') };
          render();
        }
      }

      function reveal() {
        const eq = eqs[idx];
        coef = eq.sol.slice();
        revealed = true; solved = true;
        results.push({ id: eq.id, pts: 0, fails });
        total += 1;
        notes.push('fasit vist: ' + eq.name);
        fb = { cls: 'bad', html: `Fasit: ${eqLine(eq)}<br><span class="small">Sjekk tabellen: nå er hvert grunnstoff likt på begge sider.</span>` };
        render();
      }

      let fb = null;
      function render(scrollTop) {
        const eq = eqs[idx];
        root.innerHTML = '';
        const head = h('div', { class: 'rb-top' }, [
          h('h2', { class: 'h-display', text: 'Reaksjonsbalansen' }),
          h('span', { class: 'chip', text: `Likning ${idx + 1}/${eqs.length}` }),
        ]);
        const intro = h('div', { class: 'small muted', html: `<strong style="color:var(--chalk)">${eq.name}.</strong> Trykk <strong>+ / −</strong> på koeffisientene. De små tallene (indeksene) ligger fast — de bestemmer hvilket stoff det er.` });
        const sides = h('div', { class: 'rb-sides' }, [
          h('div', { class: 'rb-col' }, eq.L.map((f, i) => speciesCard(eq, f, i))),
          h('div', { class: 'rb-mid', text: '→' }),
          h('div', { class: 'rb-col' }, eq.R.map((f, i) => speciesCard(eq, f, eq.L.length + i))),
        ]);
        const parts = [head, intro, h('div', { class: 'rb-eq', html: eqLine(eq) }), sides];
        if (showTempt) parts.push(temptCard(eq));
        parts.push(countTable(eq), micro(eq), scale(eq));
        if (fb) parts.push(h('div', { class: 'feedback ' + fb.cls, html: fb.html }));
        if (!solved) {
          parts.push(h('div', { class: 'rb-actions' }, [
            h('button', { class: 'btn primary', id: 'rb-check', onclick: check }, 'Sjekk'),
            h('button', { class: 'btn ghost', id: 'rb-tempt', onclick: () => { showTempt = true; tempted++; sfx('click'); render(); } }, '✎ Endre formel'),
          ]));
          if (fails >= 2) parts.push(h('button', { class: 'btn ghost block small', id: 'rb-reveal', onclick: reveal }, 'Vis fasit (0 poeng)'));
        } else {
          parts.push(h('button', { class: 'btn primary block', id: 'rb-next', onclick: () => { fb = null; idx++; if (idx < eqs.length) startEq(); else quizStart(); } },
            idx < eqs.length - 1 ? 'Neste likning →' : 'Til vekta →'));
        }
        root.append(...parts);
        if (scrollTop) scrollUp();
      }

      function scrollUp() { try { root.scrollIntoView({ block: 'start' }); } catch (e) { /* ok */ } }

      // ---------- Avsluttende massebevaringsspørsmål ----------
      const QUIZ = [
        { q: 'I en lukket beholder reagerer **16 g metan** fullstendig med **64 g oksygen**. Hvor mye veier produktene (CO~2~ + vann) til sammen?',
          options: ['80 g', 'Mindre enn 80 g — noe av stoffet brennes opp', 'Mer enn 80 g — det dannes nye gasser', '16 g — bare metanet blir til produkter'],
          answer: 0,
          why: 'Massebevaringsloven: atomene i 16 g + 64 g settes bare sammen på nye måter, så produktene veier 80 g. «Brenne opp» er hverdagsspråk — stoffet forsvinner ikke, det blir til gass.' },
        { q: 'Du brenner **stålull (jern)** på en vekt i åpen luft. Hva skjer med det vekta viser?',
          options: ['Den øker — oksygen fra lufta bindes i jernoksidet', 'Den synker — noe av jernet brenner opp', 'Den står stille — masse er bevart', 'Den synker — røyken tar med seg masse'],
          answer: 0,
          why: 'Fe + O~2~ → jernoksid. Oksygenatomene kommer fra lufta (utenfor vekta), så massen på vekta øker. Massen er bevart i hele systemet — men systemet er ikke lukket rundt vekta.' },
        { q: 'Et stearinlys brenner på en vekt i åpen luft. Vekta viser mindre og mindre. Hvordan forklarer du det med massebevaringsloven?',
          options: ['CO~2~ og vanndamp dannes og forsvinner ut i lufta — massen finnes der', 'Masse omdannes til lys og varme', 'Stearinet brenner opp og blir borte', 'Flammen gjør lyset lettere ved å varme det opp'],
          answer: 0,
          why: 'Produktene er gasser som forlater vekta. Samler du dem (lukket system), er massen lik før og etter. Lys og varme er energi — ikke stoff som «brennes bort».' },
      ];
      const quiz = [QUIZ[0], rng.pick(QUIZ.slice(1))];
      let qi = 0;

      function quizStart() { qi = 0; showQuiz(); }
      function showQuiz() {
        const q = quiz[qi];
        root.innerHTML = '';
        const order = rng.shuffle(q.options.map((t, i) => i));
        const fbBox = h('div');
        const btns = order.map((oi) => h('button', { class: 'option', html: api.md(q.options[oi]), onclick: () => pick(oi) }));
        let picked = false;
        function pick(oi) {
          if (picked) return; picked = true;
          const ok = oi === q.answer;
          total += 1; if (ok) correct += 1; else notes.push('massebevaring: ' + q.options[oi].slice(0, 40));
          sfx(ok ? 'good' : 'bad');
          btns.forEach((b, k) => { const i = order[k]; b.disabled = true; if (i === q.answer) b.classList.add('correct'); else if (i === oi) b.classList.add('wrong'); else b.classList.add('dim'); });
          fbBox.replaceChildren(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Riktig.</strong> ' : '<strong>Ikke helt.</strong> ') + api.md(q.why) }),
            h('button', { class: 'btn primary block', id: 'rb-next', style: { marginTop: '10px' }, onclick: () => { qi++; if (qi < quiz.length) showQuiz(); else summary(); } }, 'Videre →'));
        }
        root.append(
          h('div', { class: 'rb-top' }, [h('h2', { class: 'h-display', text: 'Vekta lyver ikke' }), h('span', { class: 'chip', text: `Spørsmål ${qi + 1}/${quiz.length}` })]),
          h('div', { html: api.md(q.q) }),
          h('div', { class: 'stack-s' }, btns),
          fbBox,
        );
        scrollUp();
      }

      function summary() {
        root.innerHTML = '';
        const score = total ? correct / total : 0;
        const list = results.map((r) => {
          const e = BANK.find((b) => b.id === r.id);
          const txt = e.L.map((f, i) => `${e.sol[i] > 1 ? e.sol[i] + ' ' : ''}${fhtml(f)}`).join(' + ') + ' → ' + e.R.map((f, i) => `${e.sol[e.L.length + i] > 1 ? e.sol[e.L.length + i] + ' ' : ''}${fhtml(f)}`).join(' + ');
          return `<li>${txt} <span class="muted small">${r.pts === 1 ? '✓' : r.pts > 0 ? '✓ (etter forsøk)' : 'fasit vist'}</span></li>`;
        }).join('');
        if (tempted) notes.push(`fristet til å endre formel ${tempted}×`);
        let doneBtn;
        root.append(
          h('h2', { class: 'h-display', text: 'Ingenting forsvant' }),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: `Resultat: ${NG.fmt(correct, 1)} av ${total}` }),
            h('ul', { class: 'rb-sum', style: { margin: 0, paddingLeft: '1.2em' }, html: list }),
          ]),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: 'Læringspoenget' }),
            h('div', { html: api.md('**Koeffisienter** sier *hvor mange* partikler; **indekser** sier *hvilket stoff*. Endrer du en indeks, skriver du om et annet stoff.\nI en reaksjon omgrupperes atomene — like mange av hvert grunnstoff før og etter. Derfor er massen bevart (**massebevaringsloven**).\nLikningen kobler kjemiens tre nivåer: *makro* (det vi ser og veier), *mikro* (atomene) og *representasjon* (formler og tall).') }),
          ]),
          doneBtn = h('button', { class: 'btn primary block', id: 'rb-done', onclick: () => { doneBtn.disabled = true; finish(score); } }, 'Fullfør laben'),
        );
        scrollUp();
      }

      function finish(score) {
        if (api.finished) return;
        clearAll();
        api.done({ score, correct: Math.round(correct * 10) / 10, total, notes: notes.join('; ') || 'alle likninger balansert uten hjelp' });
      }

      startEq();
      return { destroy() { dead = true; clearAll(); } };
    },
  });
})();
