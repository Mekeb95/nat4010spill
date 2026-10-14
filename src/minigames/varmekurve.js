/* Mini-spill: Varmekurven (energi). Varm opp et fast stoff med en brenner, se temperatur–tid-grafen
   og partiklene samtidig, og forklar platåene: energien bryter bindinger i stedet for å øke farten. */
(function () {
  'use strict';
  const ID = 'varmekurve';

  NG.css(`
.mg-varmekurve .vk-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); touch-action: manipulation; }
.mg-varmekurve .vk-info { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.mg-varmekurve .vk-temp { font-family: var(--f-mono); font-size: var(--t-l); font-weight: 600; color: var(--r-energi); min-width: 7.5em; }
.mg-varmekurve .vk-where { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.mg-varmekurve .vk-where[hidden] { display: none; }
.mg-varmekurve .vk-where span { padding: 6px 8px; border-radius: 10px; border: 2px solid var(--line); font-size: var(--t-s); color: var(--chalk-faint); text-align: center; }
.mg-varmekurve .vk-where span.on { border-color: var(--r-energi); color: var(--chalk); background: color-mix(in srgb, var(--r-energi) 16%, transparent); }
.mg-varmekurve .vk-burn { min-height: 56px; font-size: var(--t-l); }
.mg-varmekurve .vk-burn.on { background: var(--heat); border-color: var(--r-energi); color: var(--chalk); }
.mg-varmekurve .vk-sketches { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-varmekurve .vk-sketch { padding: 8px; min-height: 96px; }
.mg-varmekurve .vk-sketch svg { width: 100%; height: 64px; display: block; }
.mg-varmekurve .vk-sketch.selected { border-color: var(--warn); }
.mg-varmekurve .vk-sum li { margin-bottom: 4px; }
.mg-varmekurve .vk-sum ul { margin: 0; padding-left: 1.2em; }
`);

  const STOFFER = {
    vann: { navn: 'vann', fast: 'is', formel: 'H₂O', smelt: 0, kok: 100, cf: 2100, cl: 4180, cg: 2010, Lf: 334e3, Lk: 2260e3, start: [-30, -20, -15], over: 15, ratio: 'ca. 7' },
    etanol: { navn: 'etanol', fast: 'fast etanol', formel: 'C₂H₅OH', smelt: -114, kok: 78, cf: 2400, cl: 2440, cg: 1430, Lf: 108e3, Lk: 855e3, start: [-150, -140, -135], over: 20, ratio: 'ca. 8' },
  };

  // Kurveskisser for forutsigelsen (viewBox 0 0 100 60).
  const SKETCH = {
    linje: { pts: '4,56 96,6', label: 'Jevn stigning hele veien' },
    trapp: { pts: '4,56 18,42 30,42 48,26 88,26 96,10', label: 'To flate strekk – det andre mye lengst', right: true },
    likt: { pts: '4,56 20,42 44,42 60,26 84,26 96,10', label: 'To like lange flate strekk' },
    flater: { pts: '4,56 20,30 40,18 60,12 80,9 96,8', label: 'Stiger fort, så stadig saktere' },
  };

  NG.minigames.register({
    id: ID, region: 'energi', title: 'Varmekurven', icon: 'flame',
    concepts: ['faseovergang-energi', 'faseovergang-partikler', 'temperatur', 'indre-energi', 'kinetisk-energi', 'partikkelmodellen'],
    blurb: 'Varm opp is og finn ut hvorfor termometeret står stille selv om brenneren går.',
    minutes: 3,
    start(root, api) {
      const el = api.el;
      const rng = api.rng;
      const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
      const C = {
        board: col('--board', '#17221f'), board2: col('--board-2', '#1f2d29'), board3: col('--board-3', '#2a3c37'),
        chalk: col('--chalk', '#eef0e6'), dim: col('--chalk-dim', '#a8b6ae'), faint: col('--chalk-faint', '#6f7f77'),
        line: col('--line', 'rgba(238,240,230,.16)'), energi: col('--r-energi', '#ffb454'), stoff: col('--r-stoffer', '#7cc8ff'),
        heat: col('--heat', '#c9785d'), warn: col('--warn', '#ffd166'), mono: col('--f-mono', 'monospace'),
      };
      const cosm = NG.makeRng((api.seed || 1) + 777); // kosmetisk partikkelstøy

      /* ---------- oppsett ---------- */
      const key = d >= 2 ? rng.pick(['vann', 'vann', 'etanol']) : 'vann';
      const S = STOFFER[key];
      const m = rng.pick([0.25, 0.5, 1]);
      const T0 = rng.pick(S.start);
      const Tend = S.kok + S.over;
      const seg = [m * S.cf * (S.smelt - T0), m * S.Lf, m * S.cl * (S.kok - S.smelt), m * S.Lk, m * S.cg * (Tend - S.kok)];
      const cum = []; seg.reduce((a, b, i) => (cum[i] = a + b), 0);
      const Etot = cum[4];
      const DUR = 40; // sekunder med brenner på for hele forløpet
      const P = Etot / DUR; // «spill-effekt»
      const Preal = 2000; // en vanlig kokeplate, W
      const speedup = Math.round((Etot / Preal) / DUR);

      function stateAt(E) {
        if (E < cum[0]) return { T: T0 + E / (m * S.cf), phase: 'fast', fl: 0, fg: 0 };
        if (E < cum[1]) return { T: S.smelt, phase: 'smelter', fl: (E - cum[0]) / seg[1], fg: 0 };
        if (E < cum[2]) return { T: S.smelt + (E - cum[1]) / (m * S.cl), phase: 'væske', fl: 1, fg: 0 };
        if (E < cum[3]) return { T: S.kok, phase: 'koker', fl: 1, fg: (E - cum[2]) / seg[3] };
        return { T: Math.min(Tend, S.kok + (E - cum[3]) / (m * S.cg)), phase: 'gass', fl: 1, fg: 1 };
      }
      const PHASE_TXT = { fast: 'fast stoff', smelter: 'smelter', væske: 'væske', koker: 'koker', gass: 'gass' };

      /* ---------- tilstand ---------- */
      let t = 0; let burner = false; let paused = true; let ended = false;
      let raf = 0; let last = 0; let showWhere = false;
      const hist = [[0, T0]];
      let st = stateAt(0);
      let correct = 0; let total = 0;
      const missed = [];
      let prediction = null;
      const fired = {};

      /* ---------- DOM ---------- */
      const head = el('div', { class: 'stack-s' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Energidalen · lab' }), el('span', { class: 'chip', text: NG.fmt(m, 2) + ' kg ' + S.fast })]),
        el('h2', { class: 'h-display', text: 'Varmekurven' }),
      ]);
      const cv = el('canvas', { class: 'vk-canvas', 'aria-label': 'Temperatur–tid-graf og partikkelmodell' });
      const tempEl = el('span', { class: 'vk-temp num' });
      const phaseEl = el('span', { class: 'chip' });
      const whereA = el('span', { text: '↑ Fart (temperatur)' });
      const whereB = el('span', { text: '⛓ Bryte bindinger' });
      const where = el('div', { class: 'vk-where', hidden: true }, [whereA, whereB]);
      const burnBtn = el('button', { class: 'btn block vk-burn', id: 'vk-burn', text: 'Slå på brenneren', disabled: true, onclick: () => setBurner(!burner) });
      const note = el('div', { class: 'small muted' });
      const panel = el('div', { class: 'stack' });
      const live = el('div', { class: 'stack-s' }, [cv, el('div', { class: 'vk-info' }, [tempEl, phaseEl]), where, burnBtn, note]);
      root.append(el('div', { class: 'stack' }, [head, live, panel]));

      /* ---------- canvas ---------- */
      let ctx = null; let W = 0; const H = 210;
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || root.clientWidth || 340;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        layoutParticles();
      }

      // partikler
      const N = 24; const COLS = 6; const ROWS = 4;
      const parts = [];
      let box = { x: 0, y: 0, w: 0, h: 0, s: 10 };
      function layoutParticles() {
        const gx = W * 0.64;
        box = { x: gx + 6, y: 22, w: W - gx - 12, h: H - 60 };
        box.s = box.w / (COLS + 1);
        for (let i = 0; i < N; i++) {
          const r = Math.floor(i / COLS); const c = i % COLS;
          const hx = box.x + box.s * (c + 1);
          const hy = box.y + box.h - box.s * (ROWS - r) + box.s * 0.3;
          if (!parts[i]) parts[i] = { x: hx, y: hy, vx: 0, vy: 0, ph: cosm.next() * 6.28, f: 0.7 + cosm.next() * 0.6 };
          parts[i].hx = hx; parts[i].hy = hy;
          if (!parts[i].free) { parts[i].x = hx; parts[i].y = hy; }
        }
      }

      function stepParticles(dt, time) {
        const k = Math.sqrt((st.T + 273.15) / 273.15);
        const nLiq = Math.round(st.fl * N); const nGas = Math.round(st.fg * N);
        const s = box.s;
        const liqTop = box.y + box.h - s * (ROWS + 1.2);
        for (let i = 0; i < N; i++) {
          const p = parts[i];
          const mode = i < nGas ? 'gas' : (i < nLiq ? 'liq' : 'sol');
          if (mode !== p.mode) {
            if (p.mode === 'sol' || !p.mode) { p.vx = (cosm.next() - 0.5) * 30; p.vy = -cosm.next() * 20; }
            if (mode === 'gas') { const a = cosm.next() * 6.28; p.vx = Math.cos(a) * 90; p.vy = Math.sin(a) * 90 - 40; }
            p.mode = mode; p.free = mode !== 'sol';
          }
          if (mode === 'sol') {
            const A = s * 0.07 * k;
            p.x = p.hx + Math.sin(time * 18 * p.f * k + p.ph) * A;
            p.y = p.hy + Math.cos(time * 15 * p.f * k + p.ph * 1.7) * A;
            continue;
          }
          const vt = (mode === 'gas' ? 85 : 26) * k;
          p.vx += (cosm.next() - 0.5) * vt * 2.2 * dt * 4; p.vy += (cosm.next() - 0.5) * vt * 2.2 * dt * 4;
          const sp = Math.hypot(p.vx, p.vy) || 1; const scale = vt / sp;
          p.vx += (p.vx * scale - p.vx) * Math.min(1, dt * 3); p.vy += (p.vy * scale - p.vy) * Math.min(1, dt * 3);
          if (mode === 'liq') p.vy += 40 * dt; // tyngde holder væska nede
          p.x += p.vx * dt; p.y += p.vy * dt;
          const top = mode === 'liq' ? liqTop : box.y + 4;
          const r = s * 0.32;
          if (p.x < box.x + r) { p.x = box.x + r; p.vx = Math.abs(p.vx); }
          if (p.x > box.x + box.w - r) { p.x = box.x + box.w - r; p.vx = -Math.abs(p.vx); }
          if (p.y < top + r) { p.y = top + r; p.vy = Math.abs(p.vy); }
          if (p.y > box.y + box.h - r) { p.y = box.y + box.h - r; p.vy = -Math.abs(p.vy); }
        }
        // myk frastøtning mellom væskepartikler og fra fast stoff
        const minD = s * 0.8;
        for (let i = 0; i < N; i++) {
          const a = parts[i]; if (a.mode !== 'liq') continue;
          for (let j = 0; j < N; j++) {
            if (i === j) continue;
            const b = parts[j]; if (b.mode === 'gas') continue;
            const dx = a.x - b.x; const dy = a.y - b.y; const dd = Math.hypot(dx, dy) || 0.01;
            if (dd < minD) { const push = (minD - dd) * (b.mode === 'sol' ? 1 : 0.5); a.x += (dx / dd) * push; a.y += (dy / dd) * push; }
          }
        }
      }

      function draw(time) {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        // --- graf ---
        const gx0 = 36; const gx1 = W * 0.62; const gy0 = 14; const gy1 = H - 26;
        const Tmin = T0 - 10; const Tmax = Tend + 10;
        const X = (tt) => gx0 + (tt / DUR) * (gx1 - gx0);
        const Y = (T) => gy1 - ((T - Tmin) / (Tmax - Tmin)) * (gy1 - gy0);
        ctx.strokeStyle = C.line; ctx.lineWidth = 1;
        ctx.font = '10px ' + C.mono; ctx.fillStyle = C.dim; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const step = (Tmax - Tmin) > 200 ? 50 : 25;
        for (let T = Math.ceil(Tmin / step) * step; T <= Tmax; T += step) {
          ctx.beginPath(); ctx.moveTo(gx0, Y(T)); ctx.lineTo(gx1, Y(T)); ctx.stroke();
          ctx.fillText(String(T).replace('-', '−'), gx0 - 4, Y(T));
        }
        ctx.strokeStyle = C.chalk; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(gx0, gy0 - 4); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1 + 2, gy1); ctx.stroke();
        ctx.fillStyle = C.dim; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('°C', gx0 + 6, 2);
        ctx.textAlign = 'right';
        ctx.fillText('tid med brenner på →', gx1, gy1 + 6);
        // faselinjer (vises når de er nådd)
        ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        [[S.smelt, 'smeltepunkt', 0], [S.kok, 'kokepunkt', 2]].forEach(([T, lab, idx]) => {
          if (st.T < T - 0.01 && t < (cum[idx] / P)) return;
          ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(gx0, Y(T)); ctx.lineTo(gx1, Y(T)); ctx.stroke();
          ctx.fillStyle = C.dim; ctx.fillText(lab, gx0 + 4, Y(T) - 2);
        });
        ctx.setLineDash([]);
        // kurven; platå-biter i varmefarge
        ctx.lineWidth = 3; ctx.lineJoin = 'round';
        for (let i = 1; i < hist.length; i++) {
          const a = hist[i - 1]; const b = hist[i];
          ctx.strokeStyle = Math.abs(a[1] - b[1]) < 1e-6 && (b[1] === S.smelt || b[1] === S.kok) ? C.warn : C.energi;
          ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.lineTo(X(b[0]), Y(b[1])); ctx.stroke();
        }
        const lp = hist[hist.length - 1];
        ctx.fillStyle = C.chalk; ctx.beginPath(); ctx.arc(X(lp[0]), Y(lp[1]), 4, 0, 6.29); ctx.fill();

        // --- partikkelboks ---
        ctx.strokeStyle = C.dim; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.lineTo(box.x + box.w, box.y); ctx.stroke();
        ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('mikronivå', box.x + box.w / 2, box.y - 4);
        // bindinger
        const s = box.s; ctx.lineWidth = 1.5;
        for (let i = 0; i < N; i++) {
          const a = parts[i]; if (a.mode === 'gas') continue;
          for (let j = i + 1; j < N; j++) {
            const b = parts[j]; if (b.mode === 'gas') continue;
            const dd = Math.hypot(a.x - b.x, a.y - b.y);
            const lim = a.mode === 'sol' && b.mode === 'sol' ? s * 1.15 : s * 1.05;
            if (dd < lim) { ctx.strokeStyle = a.mode === 'sol' && b.mode === 'sol' ? C.dim : C.faint; ctx.globalAlpha = a.mode === 'sol' && b.mode === 'sol' ? 0.7 : 0.45; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
        }
        ctx.globalAlpha = 1;
        const r = s * 0.3;
        for (const p of parts) {
          ctx.fillStyle = p.mode === 'gas' ? C.chalk : C.stoff;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.29); ctx.fill();
        }
        // brenner
        const by = box.y + box.h + 6; const cx = box.x + box.w / 2;
        ctx.fillStyle = C.board3; ctx.fillRect(box.x + 4, by, box.w - 8, 6);
        if (burner && !paused) {
          for (let i = 0; i < 4; i++) {
            const fx = box.x + 12 + i * (box.w - 24) / 3; const fh = 12 + Math.sin(time * 20 + i * 2) * 4;
            ctx.fillStyle = i % 2 ? C.energi : C.heat;
            ctx.beginPath(); ctx.moveTo(fx - 6, by + 22); ctx.quadraticCurveTo(fx, by + 22 - fh * 2, fx + 6, by + 22); ctx.fill();
          }
        } else {
          ctx.fillStyle = C.faint; ctx.textBaseline = 'top'; ctx.fillText('brenner av', cx, by + 10);
        }
      }

      function updateInfo() {
        tempEl.textContent = 'T = ' + NG.fmt(st.T, 1).replace('-', '−') + ' °C';
        phaseEl.textContent = PHASE_TXT[st.phase];
        const plateau = st.phase === 'smelter' || st.phase === 'koker';
        where.hidden = !showWhere;
        whereA.classList.toggle('on', !plateau && burner && !paused);
        whereB.classList.toggle('on', plateau && burner && !paused);
      }

      function setBurner(on) {
        if (ended || paused) return;
        burner = on;
        burnBtn.textContent = on ? 'Slå av brenneren' : 'Slå på brenneren';
        burnBtn.classList.toggle('on', on);
        api.sfx('click');
        updateInfo();
      }

      /* ---------- hendelser underveis ---------- */
      const EVENTS = [
        { id: 'meltStart', when: () => st.phase === 'smelter', run: askMeltPredict },
        { id: 'meltMid', when: () => st.phase === 'smelter' && st.fl > 0.45, run: askMeltWhere },
        { id: 'liquidMid', when: () => st.phase === 'væske' && st.T > S.smelt + (S.kok - S.smelt) * 0.5 && (d >= 2 || key === 'vann'), run: askLiquid },
        { id: 'boilStart', when: () => st.phase === 'koker', run: askBoilPredict },
        { id: 'end', when: () => t >= DUR - 1e-6, run: askFinal },
      ];

      function loop(now) {
        if (ended) return;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
        last = now;
        if (burner && !paused) {
          t = Math.min(DUR, t + dt);
          st = stateAt(P * t);
          const lp = hist[hist.length - 1];
          if (t - lp[0] > 0.08) hist.push([t, st.T]);
          for (const ev of EVENTS) {
            if (!fired[ev.id] && ev.when()) { fired[ev.id] = true; hist.push([t, st.T]); pauseFor(ev.run); break; }
          }
          updateInfo();
        }
        stepParticles(dt, now / 1000);
        draw(now / 1000);
        raf = requestAnimationFrame(loop);
      }

      function pauseFor(fn) {
        paused = true; burnBtn.disabled = true;
        updateInfo();
        fn();
      }
      function resume(msg) {
        panel.innerHTML = '';
        paused = false; burnBtn.disabled = false;
        burner = true; burnBtn.textContent = 'Slå av brenneren'; burnBtn.classList.add('on');
        if (msg) note.innerHTML = api.md(msg);
        updateInfo();
        try { cv.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
      }

      function ask(q, after) {
        panel.innerHTML = '';
        const host = el('div', { class: 'card' });
        panel.appendChild(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) correct++; else missed.push(q.miss || q.topic || 'spørsmål'); },
          onContinue: () => after(),
        });
        setTimeout(() => { try { host.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 30);
      }

      function askMeltPredict() {
        ask({
          type: 'mc', topic: 'Forutsi', miss: 'temperaturen under smelting',
          prompt: `Termometeret viser ${S.smelt} °C, og ${S.fast} begynner å smelte. Brenneren står fortsatt på. **Hva skjer med temperaturen nå?**`,
          options: ['Den står stille til alt er smeltet', 'Den stiger like fort som før', 'Den synker litt fordi smeltingen «trekker kulde»', 'Den stiger raskere, fordi væske varmes lettere'],
          answer: 0,
          why: { 1: 'Det er den vanligste forventningen – de fleste tegner en rett linje.', 2: 'Kulde er ikke noe som strømmer; det er energi som går fra brenneren til stoffet.', 3: 'Flytende vann trenger faktisk *mer* energi per grad enn is.' },
          explain: 'Følg med på grafen og partiklene. Energien tilføres fortsatt – se hva den brukes til.',
        }, () => resume('Se på partiklene: noen river seg løs fra gitteret mens termometeret står stille.'));
      }

      function askMeltWhere() {
        showWhere = true;
        ask({
          type: 'mc', topic: 'Platået', miss: 'hvor energien går på platået',
          prompt: `Halvparten er smeltet, og termometeret står fortsatt på ${S.smelt} °C. **Hvor går energien fra brenneren?**`,
          options: ['Den bryter bindinger mellom partiklene, så de kan gli fra hverandre', 'Den får partiklene til å bevege seg raskere', 'Den går tapt – den blir borte på platået', 'Den varmer opp de enkelte molekylene, så de smelter'],
          answer: 0,
          why: { 1: 'Raskere bevegelse i snitt *er* høyere temperatur – men temperaturen står jo stille.', 2: 'Energi blir aldri borte. Den lagres som indre energi (bindingsenergi) og kommer tilbake når stoffet fryser.', 3: 'Molekylene selv smelter ikke og blir ikke varme – det er bindingene *mellom* dem som brytes.' },
          explain: `Temperatur er et mål på partiklenes **gjennomsnittlige kinetiske energi**. På platået går energien til å bryte bindinger (potensiell energi på mikronivå), så farten – og temperaturen – endres ikke. Den indre energien øker likevel. Energien som trengs per kg kalles **smeltevarme** (L~f~ = ${NG.fmt(S.Lf / 1000, 0)} kJ/kg for ${S.navn}).`,
        }, () => resume('Følg med på boksene over knappen: hvor går energien akkurat nå?'));
      }

      function askLiquid() {
        const qs = [{
          type: 'mc', topic: 'Partikkelnivå', miss: 'temperatur som gjennomsnittlig kinetisk energi',
          prompt: 'Nå stiger temperaturen igjen. **Hva skjer med partiklene?**',
          options: ['Den gjennomsnittlige farten (kinetiske energien) øker', 'Partiklene blir større og tar mer plass', 'Hver enkelt partikkel blir varmere', 'Det blir flere partikler'],
          answer: 0,
          why: { 1: 'Partiklene endrer ikke størrelse – det er avstanden mellom dem som kan endres.', 2: 'Én partikkel har ikke en temperatur. Temperatur er et gjennomsnitt over mange partikler.', 3: 'Antallet partikler er det samme – stoffet er bevart.' },
          explain: 'Utenfor platåene går tilført energi til raskere bevegelse. Temperaturen er et mål på **gjennomsnittet**, ikke på hver partikkel.',
        }];
        if (key === 'vann') qs.push({
          type: 'mc', topic: 'Stigningen', miss: 'spesifikk varmekapasitet',
          prompt: 'Grafen er **slakere** for flytende vann enn den var for is, selv om brenneren gir like mye energi per sekund. Hvorfor?',
          options: ['Vann trenger mer energi per grad enn is (høyere spesifikk varmekapasitet)', 'Brenneren har blitt svakere', 'Isen hadde mer kulde i seg som først måtte ut', 'Termometeret reagerer tregere i vann'],
          answer: 0,
          why: { 1: 'Brenneren gir like mye hele tiden – det er stoffet som har endret seg.', 2: '«Kulde» er ikke en stoffmengde. Det handler om hvor mye energi én grad koster.', 3: 'Kurven er en modell med perfekt termometer; forskjellen er virkelig.' },
          explain: 'Spesifikk varmekapasitet: is ca. 2100 J/(kg·°C), flytende vann 4180 J/(kg·°C). Én grad koster omtrent dobbelt så mye energi i væskefasen, så kurven blir halvparten så bratt.',
        });
        ask(rng.pick(qs), () => resume(''));
      }

      function askBoilPredict() {
        ask({
          type: 'mc', topic: 'Forutsi', miss: 'fordampingsvarme vs. smeltevarme',
          prompt: `${S.navn[0].toUpperCase() + S.navn.slice(1)} koker ved ${S.kok} °C. **Hvor langt blir dette flate strekket sammenlignet med smelteplatået?**`,
          options: [`Mye lengre – ${S.ratio} ganger så langt`, 'Omtrent like langt', 'Kortere, fordi væska allerede er varm', 'Det blir ikke noe flatt strekk ved koking'],
          answer: 0,
          why: { 1: 'Platåene er ikke symmetriske – det avhenger av hvor sterke bindingene som brytes er.', 2: 'Temperaturen før koking påvirker ikke hvor mye energi som trengs for å rive partiklene helt fra hverandre.', 3: 'Også ved koking står temperaturen stille mens bindinger brytes.' },
          explain: `Ved fordamping må partiklene rives **helt** fra hverandre, ikke bare løsnes. Fordampingsvarmen er ${NG.fmt(S.Lk / 1000, 0)} kJ/kg mot smeltevarmen ${NG.fmt(S.Lf / 1000, 0)} kJ/kg. Med konstant effekt blir kokeplatået ${S.ratio} ganger så langt.`,
        }, () => resume('Kokeplatået: se hvor lenge brenneren må stå på mens partiklene slipper fri.'));
      }

      function askFinal() {
        burner = false; burnBtn.textContent = 'Ferdig oppvarmet'; burnBtn.classList.remove('on'); note.textContent = '';
        const qs = [{
          type: 'mc', topic: 'Temperatur', miss: 'temperatur vs. indre energi',
          prompt: '**Hva er det termometeret egentlig måler?**',
          options: ['Partiklenes gjennomsnittlige kinetiske energi', 'Den totale energien (indre energien) i stoffet', 'Hvor mye varme stoffet inneholder', 'Hvor sterke bindingene mellom partiklene er'],
          answer: 0,
          why: { 1: 'Indre energi er *summen* av bevegelses- og bindingsenergi. Den økte på platåene uten at termometeret rørte seg.', 2: 'Varme er energi som *overføres*, ikke noe en ting har.', 3: 'Bindingsenergien endret seg på platåene – akkurat da sto termometeret stille.' },
          explain: 'Temperatur = gjennomsnittlig bevegelsesenergi per partikkel. Indre energi = summen av all bevegelses- og bindingsenergi. Derfor kan indre energi øke mens temperaturen står stille.',
        }, {
          type: 'mc', topic: 'Indre energi', miss: 'indre energi ved samme temperatur',
          prompt: `Sammenlign ${NG.fmt(m, 2)} kg flytende ${S.navn} ved ${S.kok} °C og like mye ${S.navn}damp ved ${S.kok} °C. **Hva stemmer?**`,
          options: ['Dampen har mest indre energi, men partiklene har samme gjennomsnittsfart', 'De har like mye energi fordi temperaturen er lik', 'Væska har mest energi fordi den er tettere', 'Dampen har høyere temperatur, ellers ville den ikke vært damp'],
          answer: 0,
          why: { 1: 'Lik temperatur betyr lik *gjennomsnittlig kinetisk* energi – ikke lik indre energi.', 2: 'Tetthet sier ikke noe om energien; bindingene er brutt i dampen, og det kostet energi.', 3: 'Begge er på kokepunktet. Det er bindingene, ikke farten, som skiller dem.' },
          explain: `Hele kokeplatået (${NG.fmt(m * S.Lk / 1000, 0)} kJ) ligger lagret i dampen som bindingsenergi. Den kommer tilbake når dampen kondenserer – derfor brenner damp mer enn kokende vann.`,
        }];
        const list = [rng.pick(qs)];
        if (d >= 2) {
          const melt = rng.chance(0.5);
          const L = melt ? S.Lf : S.Lk;
          list.push({
            type: 'num', topic: 'Regn', miss: 'Q = m·L', unit: 'kJ', answer: Math.round(m * L / 1000 * 10) / 10, tol: 0.02,
            prompt: `Hvor mye energi gikk med på **${melt ? 'smelteplatået' : 'kokeplatået'}**? Stoffet veier ${NG.fmt(m, 2)} kg og ${melt ? 'smeltevarmen' : 'fordampingsvarmen'} er ${NG.fmt(L / 1000, 0)} kJ/kg.`,
            hint: 'Q = m · L',
            explain: `Q = m·L = ${NG.fmt(m, 2)} kg · ${NG.fmt(L / 1000, 0)} kJ/kg = ${NG.fmt(m * L / 1000, 1)} kJ. All denne energien ble bindingsenergi – ikke høyere temperatur.`,
          });
        }
        let i = 0;
        const next = () => { if (i < list.length) ask(list[i++], next); else summary(); };
        next();
      }

      /* ---------- forutsigelse før start ---------- */
      function predictStep() {
        const keys = d >= 2 ? ['linje', 'trapp', 'likt', 'flater'] : ['linje', 'trapp', 'flater'];
        const order = rng.shuffle(keys);
        let pick = null;
        const go = el('button', { class: 'btn primary block', id: 'vk-go', text: 'Start forsøket', disabled: true, onclick: () => {
          prediction = pick; api.sfx('click');
          panel.innerHTML = '';
          paused = false; burnBtn.disabled = false;
          note.innerHTML = api.md(`Brenneren gir like mye energi hvert sekund. 1 s i spillet ≈ ${NG.fmt(speedup / 60, 0)} min på en vanlig kokeplate. Slå på brenneren!`);
          try { cv.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
        } });
        const btns = order.map((k, idx) => el('button', { class: 'option vk-sketch', 'data-k': k, id: 'vk-sk-' + idx,
          html: `<svg viewBox="0 0 100 60" aria-hidden="true"><path d="M4 2 V58 H98" fill="none" stroke="${C.faint}" stroke-width="2"/><polyline points="${SKETCH[k].pts}" fill="none" stroke="${C.energi}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="small">${SKETCH[k].label}</span>`,
          onclick: () => { pick = k; btns.forEach((b) => b.classList.toggle('selected', b.dataset.k === k)); go.disabled = false; api.sfx('click'); } }));
        panel.append(el('div', { class: 'card stack' }, [
          el('div', { html: api.md(`Du skal varme **${NG.fmt(m, 2)} kg ${S.fast}** fra **${String(T0).replace('-', '−')} °C** til den er blitt damp, med en brenner som gir like mye energi hvert sekund.\n**Forutsi:** Hvordan tror du temperaturen endrer seg med tida?`) }),
          el('div', { class: 'vk-sketches' }, btns), go,
        ]));
      }

      /* ---------- slutt ---------- */
      function summary() {
        if (ended) return;
        ended = true;
        cancelAnimationFrame(raf);
        burnBtn.disabled = true;
        total++;
        const predOk = SKETCH[prediction] && SKETCH[prediction].right;
        if (predOk) correct++; else missed.push('forutsigelse av kurveformen');
        const score = total ? correct / total : 0;
        panel.innerHTML = '';
        panel.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s vk-sum' }, [
          el('h3', { class: 'h-display', text: 'Hva så? – ' + correct + ' av ' + total + ' riktig' }),
          el('div', { class: 'small', html: api.md(predOk ? 'Forutsigelsen din stemte: to flate strekk, og kokeplatået er det lengste.' : `Du spådde «${SKETCH[prediction] ? SKETCH[prediction].label.toLowerCase() : '–'}». Grafen ble en trapp med to platåer – og kokeplatået er mye lengst.`) }),
          el('ul', { html: [
            '**Temperatur** er partiklenes *gjennomsnittlige* kinetiske energi.',
            'På **platåene** går energien til å bryte bindinger, så temperaturen står stille mens den **indre energien** øker.',
            `Å fordampe krever mye mer energi enn å smelte (${NG.fmt(S.Lk / 1000, 0)} mot ${NG.fmt(S.Lf / 1000, 0)} kJ/kg for ${S.navn}).`,
            'Ingen energi blir borte: den kommer tilbake når stoffet kondenserer og fryser.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        try { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
        api.done({ score, correct, total, notes: 'Varmekurve (' + S.navn + '). ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      const onResize = () => { fit(); draw(performance.now() / 1000); };
      window.addEventListener('resize', onResize);
      fit();
      updateInfo();
      predictStep();
      raf = requestAnimationFrame(loop);

      return {
        destroy() {
          ended = true;
          cancelAnimationFrame(raf);
          window.removeEventListener('resize', onResize);
        },
      };
    },
  });
})();
