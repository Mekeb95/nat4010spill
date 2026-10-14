/* Mini-spill: Partikkelboksen (stoffer). Juster temperaturen og se stoffet på tre nivåer samtidig:
   makro (det vi ser), mikro (partiklene) og representasjon (H₂O(s) → H₂O(l)). Med sublimasjon og
   vanlige misoppfatninger (molekylene smelter, luft mellom partiklene, bobler er luft). */
(function () {
  'use strict';
  const ID = 'partikkelboksen';

  NG.css(`
.mg-partikkelboksen .pb-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-partikkelboksen .pb-read { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.mg-partikkelboksen .pb-temp { font-family: var(--f-mono); font-size: var(--t-l); font-weight: 600; color: var(--r-stoffer); }
.mg-partikkelboksen .pb-repg { display: inline-flex; align-items: baseline; gap: 8px; }
.mg-partikkelboksen .pb-rep { font-family: var(--f-mono); font-size: var(--t-xl); font-weight: 600; }
.mg-partikkelboksen .pb-range { -webkit-appearance: none; appearance: none; width: 100%; height: 48px; background: transparent; margin: 0; touch-action: pan-y; }
.mg-partikkelboksen .pb-range:focus-visible { outline: 3px solid var(--warn); outline-offset: 2px; border-radius: 8px; }
.mg-partikkelboksen .pb-range::-webkit-slider-runnable-track { height: 12px; border-radius: 999px; background: linear-gradient(90deg, var(--r-stoffer), var(--board-4) 50%, var(--heat)); }
.mg-partikkelboksen .pb-range::-moz-range-track { height: 12px; border-radius: 999px; background: linear-gradient(90deg, var(--r-stoffer), var(--board-4) 50%, var(--heat)); }
.mg-partikkelboksen .pb-range::-webkit-slider-thumb { -webkit-appearance: none; width: 40px; height: 40px; margin-top: -14px; border-radius: 50%; background: var(--chalk); border: 3px solid var(--board); box-shadow: 0 2px 8px rgba(0,0,0,.4); }
.mg-partikkelboksen .pb-range::-moz-range-thumb { width: 36px; height: 36px; border-radius: 50%; background: var(--chalk); border: 3px solid var(--board); }
.mg-partikkelboksen .pb-scale { display: flex; justify-content: space-between; font-family: var(--f-mono); font-size: var(--t-xs); color: var(--chalk-dim); margin-top: -6px; }
.mg-partikkelboksen .pb-steps { display: flex; gap: 4px; }
.mg-partikkelboksen .pb-steps i { flex: 1; height: 5px; border-radius: 3px; background: var(--board-4); }
.mg-partikkelboksen .pb-steps i.on { background: var(--r-stoffer); }
.mg-partikkelboksen .pb-sum ul { margin: 0; padding-left: 1.2em; }
`);

  const STOFF = {
    vann: { navn: 'vann', formel: 'H₂O', min: -60, max: 160, start: 20, tegn: 'h2o',
      phase: (T) => (T < 0 ? 's' : T < 100 ? 'l' : 'g'),
      makro: { s: 'en isbit', l: 'vann i glasset', g: 'vanndamp – usynlig gass' } },
    co2: { navn: 'karbondioksid', formel: 'CO₂', min: -130, max: 20, start: -110, tegn: 'co2',
      phase: (T) => (T < -78.5 ? 's' : 'g'),
      makro: { s: 'tørris (fast CO₂)', g: 'CO₂-gass – usynlig' } },
  };
  const PH = { s: 'fast stoff', l: 'væske', g: 'gass' };

  NG.minigames.register({
    id: ID, region: 'stoffer', title: 'Partikkelboksen', icon: 'atom',
    concepts: ['partikkelmodellen', 'kjemiens-tre-nivaer', 'fase', 'faseovergang-partikler', 'fast-stoff', 'vaeske', 'gass', 'molekyl'],
    blurb: 'Skru på temperaturen og koble det du ser, partiklene og formelen – kjemiens tre nivåer.',
    minutes: 3,
    start(root, api) {
      const el = api.el;
      const rng = api.rng;
      const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
      const C = {
        chalk: col('--chalk', '#eef0e6'), dim: col('--chalk-dim', '#a8b6ae'), faint: col('--chalk-faint', '#6f7f77'), line: col('--line', 'rgba(238,240,230,.16)'),
        stoff: col('--r-stoffer', '#7cc8ff'), jorda: col('--r-jorda', '#c4a6ff'), heat: col('--heat', '#c9785d'), board: col('--board', '#17221f'),
        board3: col('--board-3', '#2a3c37'), board4: col('--board-4', '#344a44'), mono: col('--f-mono', 'monospace'), bad: col('--bad', '#ff7d6e'),
      };
      const cosm = NG.makeRng((api.seed || 1) + 99);

      let ended = false; let raf = 0; let last = 0;
      let correct = 0; let total = 0; const missed = [];
      let S = STOFF.vann; let T = S.start; let ph = S.phase(T);

      /* ---------- DOM ---------- */
      const cv = el('canvas', { class: 'pb-canvas', 'aria-label': 'Makronivå og mikronivå for stoffet' });
      const tempEl = el('span', { class: 'pb-temp' });
      const repEl = el('span', { class: 'pb-rep' });
      const range = el('input', { class: 'pb-range', id: 'pb-range', type: 'range', step: '1', 'aria-label': 'Temperatur' });
      const scaleEl = el('div', { class: 'pb-scale' });
      const steps = el('div', { class: 'pb-steps' });
      const panel = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Stoffgruvene · lab' }), el('span', { class: 'chip', text: 'trykk: 1 atm' })]),
        el('h2', { class: 'h-display', text: 'Partikkelboksen' }),
        steps,
        el('div', { class: 'stack-s' }, [cv, el('div', { class: 'pb-read' }, [tempEl, el('span', { class: 'pb-repg' }, [el('span', { class: 'label', text: 'symbol' }), repEl])]), range, scaleEl]),
        panel,
      ]));
      range.addEventListener('input', () => { T = Number(range.value); update(); });

      function setStoff(s) {
        S = s; range.min = String(s.min); range.max = String(s.max); range.value = String(s.start); T = s.start;
        scaleEl.innerHTML = '';
        scaleEl.append(el('span', { text: String(s.min).replace('-', '−') + ' °C' }), el('span', { text: 'temperatur' }), el('span', { text: String(s.max) + ' °C' }));
        parts.forEach((p) => { p.mode = null; });
        update();
      }
      function update() {
        ph = S.phase(T);
        tempEl.textContent = 'T = ' + String(Math.round(T)).replace('-', '−') + ' °C · ' + PH[ph];
        repEl.textContent = S.formel + '(' + ph + ')';
      }

      /* ---------- canvas ---------- */
      const H = 240; let W = 340; let ctx = null;
      const N = 30; const COLS = 6; const ROWS = 5;
      const parts = [];
      let box = { x: 0, y: 0, w: 0, h: 0, s: 10 };
      for (let i = 0; i < N; i++) parts.push({ x: 0, y: 0, vx: 0, vy: 0, a: cosm.next() * 6.28, va: 0, ph: cosm.next() * 6.28, f: 0.7 + cosm.next() * 0.6 });
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const mx = W * 0.38;
        box = { x: mx + 8, y: 26, w: W - mx - 16, h: H - 38 };
        box.s = Math.min(box.w / (COLS + 1), box.h / (ROWS + 2.5));
        parts.forEach((p, i) => {
          const r = Math.floor(i / COLS); const c = i % COLS;
          p.hx = box.x + (box.w - box.s * (COLS - 1)) / 2 + box.s * c;
          p.hy = box.y + box.h - box.s * (ROWS - r) + box.s * 0.4;
          if (!p.mode) { p.x = p.hx; p.y = p.hy; }
        });
      }

      function step(dt, time) {
        const k = Math.sqrt((T + 273.15) / 273.15);
        const s = box.s; const r = s * 0.42;
        const liqTop = box.y + box.h - s * (ROWS + 0.3);
        for (const p of parts) {
          if (p.mode !== ph) {
            if (ph !== 's') { const a = cosm.next() * 6.28; const v0 = ph === 'g' ? 90 : 25; p.vx = Math.cos(a) * v0; p.vy = Math.sin(a) * v0; p.va = (cosm.next() - 0.5) * 4; }
            p.mode = ph;
          }
          if (ph === 's') {
            const A = s * 0.06 * k * k;
            p.x += (p.hx + Math.sin(time * 16 * p.f * k + p.ph) * A - p.x) * Math.min(1, dt * 8);
            p.y += (p.hy + Math.cos(time * 13 * p.f * k + p.ph * 1.7) * A - p.y) * Math.min(1, dt * 8);
            p.a += (Math.sin(time * 9 * p.f + p.ph) * 0.15 - (p.a % 6.28 > 3.14 ? 0 : 0)) * dt;
            continue;
          }
          const vt = (ph === 'g' ? 95 : 24) * k;
          p.vx += (cosm.next() - 0.5) * vt * 8 * dt; p.vy += (cosm.next() - 0.5) * vt * 8 * dt;
          const sp = Math.hypot(p.vx, p.vy) || 1;
          p.vx += (p.vx * vt / sp - p.vx) * Math.min(1, dt * 3); p.vy += (p.vy * vt / sp - p.vy) * Math.min(1, dt * 3);
          if (ph === 'l') p.vy += 50 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt * (ph === 'g' ? 2 : 1);
          const top = ph === 'l' ? liqTop : box.y + 2;
          if (p.x < box.x + r) { p.x = box.x + r; p.vx = Math.abs(p.vx); }
          if (p.x > box.x + box.w - r) { p.x = box.x + box.w - r; p.vx = -Math.abs(p.vx); }
          if (p.y < top + r) { p.y = top + r; p.vy = Math.abs(p.vy); }
          if (p.y > box.y + box.h - r) { p.y = box.y + box.h - r; p.vy = -Math.abs(p.vy); }
        }
        if (ph === 'l') {
          const minD = s * 0.82;
          for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
            const a = parts[i]; const b = parts[j];
            const dx = a.x - b.x; const dy = a.y - b.y; const dd = Math.hypot(dx, dy) || 0.01;
            if (dd < minD) { const pu = (minD - dd) / 2; a.x += dx / dd * pu; a.y += dy / dd * pu; b.x -= dx / dd * pu; b.y -= dy / dd * pu; }
          }
        }
      }

      function molecule(p, r) {
        if (S.tegn === 'h2o') {
          ctx.fillStyle = C.stoff; ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.62, 0, 6.29); ctx.fill();
          ctx.fillStyle = C.chalk;
          for (const sgn of [-1, 1]) {
            const a = p.a + sgn * 0.91;
            ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * r * 0.62, p.y + Math.sin(a) * r * 0.62, r * 0.34, 0, 6.29); ctx.fill();
          }
        } else {
          const cx = Math.cos(p.a) * r * 0.6; const cy = Math.sin(p.a) * r * 0.6;
          ctx.fillStyle = C.jorda;
          ctx.beginPath(); ctx.arc(p.x - cx, p.y - cy, r * 0.36, 0, 6.29); ctx.fill();
          ctx.beginPath(); ctx.arc(p.x + cx, p.y + cy, r * 0.36, 0, 6.29); ctx.fill();
          ctx.fillStyle = C.dim; ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.3, 0, 6.29); ctx.fill();
        }
      }

      function drawMakro(time) {
        const mx = W * 0.38; const cx = mx / 2; const bot = H - 22;
        ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('MAKRO', cx, 8);
        ctx.textBaseline = 'bottom'; ctx.fillStyle = C.chalk; ctx.font = '11px ' + C.mono;
        const lab = S.makro[ph];
        const words = lab.split(' – ');
        ctx.fillText(words[0], cx, H - 14 + (words[1] ? -12 : 0) + 12);
        if (words[1]) { ctx.fillStyle = C.dim; ctx.fillText(words[1], cx, H - 2); }
        const gw = Math.min(70, mx - 30); const gh = 100; const gx = cx - gw / 2; const gy = bot - gh - 26;
        if (S.tegn === 'h2o') {
          // glass
          ctx.strokeStyle = C.chalk; ctx.lineWidth = 3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + 6, gy + gh); ctx.lineTo(gx + gw - 6, gy + gh); ctx.lineTo(gx + gw, gy); ctx.stroke();
          if (ph === 's') {
            ctx.fillStyle = C.stoff; ctx.globalAlpha = 0.45; ctx.fillRect(cx - 18, gy + gh - 40, 36, 36); ctx.globalAlpha = 1;
            ctx.strokeStyle = C.stoff; ctx.lineWidth = 2; ctx.strokeRect(cx - 18, gy + gh - 40, 36, 36);
          } else if (ph === 'l') {
            ctx.fillStyle = C.stoff; ctx.globalAlpha = 0.35;
            ctx.beginPath(); ctx.moveTo(gx + 3.5, gy + gh * 0.4); ctx.lineTo(gx + 6, gy + gh - 1); ctx.lineTo(gx + gw - 6, gy + gh - 1); ctx.lineTo(gx + gw - 3.5, gy + gh * 0.4); ctx.fill();
            ctx.globalAlpha = 1;
            if (T > 90) for (let i = 0; i < 4; i++) { const by = gy + gh - ((time * 40 + i * 25) % (gh * 0.55)); ctx.strokeStyle = C.chalk; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(gx + 16 + i * (gw - 32) / 3, by, 3, 0, 6.29); ctx.stroke(); }
          } else {
            ctx.strokeStyle = C.faint; ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) { const x = gx + 14 + i * (gw - 28) / 2; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const yy = gy - 4 - k * 2.5; const xx = x + Math.sin(k * 0.6 + time * 3 + i) * 4; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke(); }
          }
        } else {
          ctx.strokeStyle = C.chalk; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx - 6, bot - 24); ctx.lineTo(gx + gw + 6, bot - 24); ctx.stroke();
          const sz = ph === 's' ? 46 : 0;
          if (sz) { ctx.fillStyle = C.chalk; ctx.globalAlpha = 0.8; ctx.fillRect(cx - sz / 2, bot - 24 - sz, sz, sz); ctx.globalAlpha = 1; }
          else {
            ctx.fillStyle = C.chalk;
            for (let i = 0; i < 5; i++) { ctx.globalAlpha = 0.12 + 0.06 * Math.sin(time * 2 + i); ctx.beginPath(); ctx.ellipse(cx - 20 + i * 10 + Math.sin(time + i) * 6, bot - 34 - i * 6, 22, 9, 0, 0, 6.29); ctx.fill(); }
            ctx.globalAlpha = 1;
          }
        }
      }

      function draw(time) {
        ctx.clearRect(0, 0, W, H);
        drawMakro(time);
        const mx = W * 0.38;
        ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx, 8); ctx.lineTo(mx, H - 8); ctx.stroke();
        ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('MIKRO', box.x + box.w / 2, 8);
        ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.strokeRect(box.x, box.y, box.w, box.h);
        const r = box.s * 0.5;
        for (const p of parts) molecule(p, r);
      }

      function loop(now) {
        if (ended) return;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
        last = now;
        step(dt, now / 1000);
        draw(now / 1000);
        raf = requestAnimationFrame(loop);
      }

      /* ---------- oppgaver ---------- */
      const scrollTo = (n) => setTimeout(() => { try { n.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 40);
      function ask(q, after) {
        panel.innerHTML = '';
        const host = el('div', { class: 'card' });
        panel.appendChild(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) correct++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
      }

      function target(stoff, want, prompt, explainOk, after, hint) {
        panel.innerHTML = '';
        const fb = el('div');
        const go = el('button', { class: 'btn primary block', id: 'pb-check', text: 'Sjekk' });
        go.onclick = () => {
          go.remove();
          total++;
          const ok = ph === want;
          if (ok) correct++; else missed.push('fase ved riktig temperatur');
          api.sfx(ok ? 'good' : 'bad');
          fb.appendChild(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
            el('div', { class: 'h-display', text: ok ? 'Riktig!' : 'Ikke helt' }),
            el('div', { html: api.md((ok ? '' : `Ved ${String(Math.round(T)).replace('-', '−')} °C er ${stoff.navn} ${PH[ph]}. ${PH[want][0].toUpperCase() + PH[want].slice(1)} får du ${hint}. Da gjelder: `) + explainOk) }),
            el('button', { class: 'btn primary block', text: 'Videre', onclick: () => { api.sfx('click'); after(); } }),
          ]));
          scrollTo(fb);
        };
        panel.append(el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Oppgave' }), el('div', { html: api.md(prompt) }), go]), fb);
      }

      const MICRO = {
        s: 'Mikro: partiklene **vibrerer på faste plasser** og holdes sammen av bindinger.',
        l: 'Mikro: partiklene ligger tett, men **glir forbi hverandre** – bindingene brytes og dannes hele tiden.',
        g: 'Mikro: partiklene **beveger seg fritt og raskt** med store tomrom mellom seg.',
      };

      const MYTHS = [
        { type: 'mc', topic: 'Misoppfatning', miss: 'molekylene smelter/utvider seg selv',
          prompt: 'En elev sier: «Når isen smelter, smelter vannmolekylene.» **Hva skjer egentlig med molekylene?**',
          options: ['De er like store og hele – det er bindingene *mellom* dem som brytes', 'De blir myke og flyter utover, som is', 'De utvider seg, derfor tar væska annen plass', 'De deler seg i hydrogen og oksygen'],
          answer: 0,
          why: { 1: 'Egenskaper vi ser på makronivå (myk, flytende) gjelder ikke enkeltpartikler.', 2: 'Molekylene endrer ikke størrelse. Det er avstanden og ordenen mellom dem som endres.', 3: 'Det ville vært en kjemisk reaksjon. Smelting er en faseovergang – stoffet er fortsatt H₂O.' },
          explain: 'Se molekylene i boksen: de er like, uansett temperatur. Makroegenskaper (smelte, være varm, være myk) skal ikke overføres til enkeltpartikler – en klassisk sammenblanding av makro- og mikronivå.' },
        { type: 'mc', topic: 'Misoppfatning', miss: 'luft mellom partiklene',
          prompt: '**Hva er det mellom vannmolekylene** i flytende vann og i vanndamp?',
          options: ['Ingenting – tomrom', 'Luft', 'Vanndamp', 'Mer vann i mindre biter'],
          answer: 0,
          why: { 1: 'Luft er selv partikler (N₂, O₂ …). Det trengs ikke noe «fyll» mellom partiklene.', 2: 'Vanndamp er også vannmolekyler – det forklarer ikke mellomrommet.', 3: 'Partikkelmodellen sier at stoffet består av partikler – mellom dem er det ingenting.' },
          explain: 'I partikkelmodellen er det tomrom mellom partiklene. Elever fyller ofte mellomrommet med «luft» – men da trenger lufta også mellomrom, og så videre.' },
        { type: 'mc', topic: 'Misoppfatning', miss: 'bobler er luft',
          prompt: 'Vannet koker og det dannes **store bobler nederst** i kjelen. **Hva er inni boblene?**',
          options: ['Vanndamp – vannmolekyler som har blitt gass', 'Luft som var løst i vannet', 'Hydrogen og oksygen fra vannmolekyler som spaltes', 'Varme'],
          answer: 0,
          why: { 1: 'Litt løst luft kommer ut som små bobler før koking – men de store kokeboblene er vanndamp.', 2: 'Vannmolekylene spaltes ikke ved koking; det er en faseovergang, ikke en reaksjon.', 3: 'Varme er energi som overføres, ikke et stoff som kan fylle en boble.' },
          explain: 'Ved kokepunktet får molekyler nok energi til å rive seg løs og danne gass *inne i* væska. Boblene er H₂O(g). Skru opp over 100 °C og se partiklene slippe fri.' },
      ];

      const SORT = {
        type: 'sort', topic: 'Kjemiens tre nivåer', miss: 'makro/mikro/representasjon',
        prompt: 'Sorter beskrivelsene etter **kjemiens tre nivåer**.',
        buckets: ['Makro', 'Mikro', 'Representasjon'],
        items: [
          { t: 'Isbiten blir mindre, og det blir en dam på bordet', b: 0 },
          { t: 'Det kommer bobler i kokende vann', b: 0 },
          { t: 'Molekylene vibrerer kraftigere og løsner fra plassene sine', b: 1 },
          { t: 'Molekylene i gassen beveger seg fritt med store mellomrom', b: 1 },
          { t: 'H₂O(s) → H₂O(l)', b: 2 },
          { t: 'CO₂(s) → CO₂(g)', b: 2 },
        ],
        explain: '**Makro:** det vi kan se, kjenne og måle. **Mikro:** partiklene vi ikke kan se (modellen). **Representasjon:** symboler, formler og likninger vi bruker for å beskrive begge. Elever sliter når undervisningen hopper mellom nivåene uten å si det – vis alle tre samtidig.',
      };

      const REP = {
        type: 'mc', topic: 'Representasjon', miss: 'representasjon av faseovergang',
        prompt: 'Hvilken **representasjon** beskriver at en isbit smelter?',
        options: ['H₂O(s) → H₂O(l)', 'H₂O(l) → H₂O(g)', '2 H₂O(s) → 2 H₂(g) + O₂(g)', 'H₂O(s) + kulde → H₂O(l)'],
        answer: 0,
        why: { 1: 'Det er fordamping/koking: væske → gass.', 2: 'Det er en kjemisk reaksjon (spalting). Ved smelting er stoffet fortsatt H₂O.', 3: 'Kulde er ikke et stoff eller en energiform. Smelting krever at energi *tilføres*.' },
        explain: 'Tilstandssymbolene (s), (l) og (g) står for fast stoff (solid), væske (liquid) og gass. Formelen er den samme på begge sider – det er en faseovergang, ikke en reaksjon.',
      };

      const SUBL = d >= 3 ? {
        type: 'mc', topic: 'Sublimasjon', miss: 'tåka fra tørris',
        prompt: 'Det velter **hvit tåke** ut fra tørrisen. CO₂ er en fargeløs gass. **Hva er den hvite tåka?**',
        options: ['Små vanndråper: lufta kjøles ned så vanndamp i lufta kondenserer', 'CO₂-gass – den er hvit når den er kald', 'Røyk fordi tørrisen brenner', 'Fast CO₂-støv som flyr av'],
        answer: 0,
        why: { 1: 'CO₂-gass er usynlig også når den er kald.', 2: 'Ingenting brenner – det er en faseovergang uten forbrenning.', 3: 'Tørrisen går rett til gass (sublimasjon), ikke til støv.' },
        explain: 'Tørris sublimerer: CO₂(s) → CO₂(g). Den kalde gassen kjøler lufta rundt slik at vanndamp i lufta kondenserer til små dråper – det er dem vi ser. Makronivået kan lure oss!',
      } : {
        type: 'mc', topic: 'Sublimasjon', miss: 'sublimasjon',
        prompt: 'Tørrisen gikk **rett fra fast stoff til gass** uten å bli væske. Hva heter denne faseovergangen?',
        options: ['Sublimasjon', 'Fordamping', 'Smelting', 'Kondensasjon'],
        answer: 0,
        why: { 1: 'Fordamping er væske → gass.', 2: 'Smelting er fast → væske.', 3: 'Kondensasjon er gass → væske.' },
        explain: 'Sublimasjon: fast stoff → gass direkte. Ved vanlig lufttrykk kan CO₂ ikke være flytende, så tørris sublimerer ved −78,5 °C. Den hvite «røyken» er faktisk kondenserte vanndråper fra lufta – CO₂-gass er usynlig.',
      };

      const want1 = rng.pick(['s', 'l', 'g']);
      const myths = rng.shuffle(MYTHS).slice(0, d);
      const plan = [];
      plan.push((next) => { setStoff(STOFF.vann); T = want1 === 'l' ? -30 : 20; range.value = String(T); update(); target(STOFF.vann, want1,
        `Du har **${STOFF.vann.formel}**. Bruk glidebryteren og still temperaturen slik at stoffet er **${PH[want1]}**. Følg med på alle tre nivåene: glasset, partiklene og formelen.`,
        MICRO[want1] + ` Makro: ${STOFF.vann.makro[want1]}. Representasjon: H₂O(${want1}).`, next, { s: 'under 0 °C', l: 'mellom 0 og 100 °C', g: 'over 100 °C' }[want1]); });
      plan.push((next) => ask(REP, next));
      myths.forEach((q) => plan.push((next) => ask(q, next)));
      plan.push((next) => ask(SORT, next));
      plan.push((next) => { setStoff(STOFF.co2); target(STOFF.co2, 'g',
        'Nytt stoff: **tørris – fast CO₂** ved −110 °C. Varm den opp mot romtemperatur. **Still temperaturen slik at all tørrisen er borte.** Se nøye på hva som skjer – blir den noen gang væske?',
        'CO₂ går **rett fra fast stoff til gass** ved −78,5 °C (ved 1 atm). Den blir aldri væske. ' + MICRO.g, next, 'over −78,5 °C'); });
      plan.push((next) => ask(SUBL, next));
      steps.append(...plan.map(() => el('i')));
      let idx = 0;
      function next() {
        if (ended) return;
        [...steps.children].forEach((s, i) => s.classList.toggle('on', i < idx + 1));
        if (idx < plan.length) { const f = plan[idx++]; f(next); if (idx > 1) scrollTo(panel); }
        else summary();
      }

      function summary() {
        if (ended) return;
        ended = true;
        cancelAnimationFrame(raf);
        const score = total ? correct / total : 0;
        panel.innerHTML = '';
        panel.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s pb-sum' }, [
          el('h3', { class: 'h-display', text: 'Tre nivåer – ' + correct + ' av ' + total }),
          el('ul', { html: [
            '**Makro** (det vi ser), **mikro** (partiklene) og **representasjon** (H₂O(s) → H₂O(l)) beskriver det samme – på ulike nivåer.',
            'Ved en faseovergang endres **avstand og bevegelse** mellom partiklene – ikke partiklene selv.',
            'Mellom partiklene er det **tomrom**, ikke luft. Kokebobler er **vanndamp**.',
            '**Sublimasjon:** CO₂(s) → CO₂(g) direkte. Den hvite tåka er kondensert vann fra lufta.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        range.disabled = true;
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        scrollTo(panel);
        api.done({ score, correct, total, notes: 'Partikkelboksen. ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      const onResize = () => { fit(); draw(performance.now() / 1000); };
      window.addEventListener('resize', onResize);
      setStoff(STOFF.vann);
      fit();
      raf = requestAnimationFrame(loop);
      next();

      return { destroy() { ended = true; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
    },
  });
})();
