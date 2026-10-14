/* Mini-spill: Årstidsmaskinen (jorda). Jorda i bane rundt sola med skrå akse (23,4°). Spilleren flytter
   jorda, forutsier årstid i Norge og Australia, daglengde og solhøyde i Oslo – og avslører myten om at
   sommer skyldes at jorda er nærmere sola (jorda er nærmest sola tidlig i januar). */
(function () {
  'use strict';
  const ID = 'arstidsmaskinen';

  NG.css(`
.mg-arstidsmaskinen { display: flex; flex-direction: column; gap: 12px; }
.mg-arstidsmaskinen .am-stage { border-radius: var(--r-m); border: 2px solid var(--line-strong); background: var(--board-2); overflow: hidden; }
.mg-arstidsmaskinen .am-stage svg { display: block; width: 100%; height: auto; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
.mg-arstidsmaskinen .am-ctrl { display: grid; grid-template-columns: 48px 1fr 48px; gap: 8px; align-items: center; }
.mg-arstidsmaskinen .am-ctrl .btn { padding: 0; }
.mg-arstidsmaskinen .am-range { width: 100%; height: 44px; accent-color: var(--r-jorda); margin: 0; }
.mg-arstidsmaskinen .am-pos { text-align: center; font-family: var(--f-mono); font-size: var(--t-s); color: var(--r-jorda); min-height: 1.4em; }
.mg-arstidsmaskinen .am-legend { display: flex; flex-wrap: wrap; gap: 12px; font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-arstidsmaskinen .am-legend b { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: -1px; }
.mg-arstidsmaskinen .am-q { display: flex; flex-direction: column; gap: 6px; }
.mg-arstidsmaskinen .am-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.mg-arstidsmaskinen .am-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.mg-arstidsmaskinen .am-grid .option, .mg-arstidsmaskinen .am-grid3 .option { text-align: center; padding: 10px 6px; }
.mg-arstidsmaskinen .am-view svg { display: block; width: 100%; height: auto; }
.mg-arstidsmaskinen .am-pill { color: var(--r-jorda); border-color: color-mix(in srgb, var(--r-jorda) 50%, transparent); }
`);

  const MONTHS = ['21. desember', '21. januar', '21. februar', '21. mars', '21. april', '21. mai', '21. juni', '21. juli', '21. august', '21. september', '21. oktober', '21. november'];
  const SHORT = ['des', 'jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov'];
  const SEASONS = ['Vinter', 'Vår', 'Sommer', 'Høst'];
  // m: 0 = 21. des (vintersolverv), 3 = 21. mars, 6 = 21. juni, 9 = 21. sept
  const KEY = {
    0: { no: 0, au: 2, day: 0, sun: 0, name: 'vintersolverv' },
    3: { no: 1, au: 3, day: 1, sun: 1, name: 'vårjevndøgn' },
    6: { no: 2, au: 0, day: 2, sun: 2, name: 'sommersolverv' },
    9: { no: 3, au: 1, day: 1, sun: 1, name: 'høstjevndøgn' },
  };
  const DAY = ['ca. 6 timer', 'ca. 12 timer', 'ca. 19 timer'];
  const DAYH = [6, 12.2, 18.8];
  const SUN = ['ca. 7°', 'ca. 30°', 'ca. 53°'];
  const SUNDEG = [6.7, 30.1, 53.5];

  const CX = 180, CY = 122, RX = 128, RY = 62, SUNX = 194, TILT = 23.4 * Math.PI / 180;
  function pos(m) {
    const th = m * Math.PI / 6;
    return [CX + RX * Math.cos(th), CY - RY * Math.sin(th)];
  }

  NG.minigames.register({
    id: ID, region: 'jorda', title: 'Årstidsmaskinen', icon: 'globe',
    concepts: ['arstid', 'aksehelning', 'dogn', 'solsystem'],
    blurb: 'Flytt jorda rundt sola, forutsi årstid, daglengde og solhøyde – og avslør avstandsmyten.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      let m = 3;
      let showDates = false;
      let locked = false;
      let score = 0; let total = 0;
      const log = [];

      // Runder: 1 plassering + 2 avlesninger + myte
      const placeTarget = rng.pick([0, 6]);
      const readA = placeTarget === 0 ? 6 : 0;
      const readB = rng.pick([3, 9]);
      const reads = rng.shuffle([readA, readB]);

      const wrap = el('div', { class: 'mg-arstidsmaskinen' });
      root.appendChild(wrap);
      function header(sub) {
        return el('div', { class: 'stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Himmelfjellet · årstider' }), el('span', { class: 'spacer' }), el('span', { class: 'chip am-pill', text: sub })]),
          el('h2', { class: 'h-display', text: 'Årstidsmaskinen' }),
        ]);
      }

      /* ---------- Tegning ---------- */
      let stage; let svgEl; let range; let posLbl;
      function earthSvg(mm) {
        const [ex, ey] = pos(mm);
        const r = 17;
        const dx = SUNX - ex; const dy = CY - ey;
        const phi = Math.atan2(dy, dx) * 180 / Math.PI;
        const ux = Math.sin(TILT); const uy = -Math.cos(TILT); // akse opp (nord)
        const px = Math.cos(TILT); const py = Math.sin(TILT); // vinkelrett (ekvator)
        let s = `<clipPath id="am-ec"><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${r}"/></clipPath>`;
        s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${r}" fill="var(--board)"/>`;
        s += `<g clip-path="url(#am-ec)"><rect x="${ex.toFixed(1)}" y="${(ey - r - 2).toFixed(1)}" width="${r + 2}" height="${2 * r + 4}" fill="var(--r-stoffer)" fill-opacity="0.75" transform="rotate(${phi.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)})"/>`;
        s += `<path d="M${(ex - px * r).toFixed(1)} ${(ey - py * r).toFixed(1)}L${(ex + px * r).toFixed(1)} ${(ey + py * r).toFixed(1)}" stroke="var(--chalk)" stroke-width="1.2" stroke-dasharray="3 3"/></g>`;
        s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${r}" fill="none" stroke="var(--chalk)" stroke-width="2.5"/>`;
        s += `<path d="M${(ex - ux * (r + 9)).toFixed(1)} ${(ey - uy * (r + 9)).toFixed(1)}L${(ex + ux * (r + 9)).toFixed(1)} ${(ey + uy * (r + 9)).toFixed(1)}" stroke="var(--chalk)" stroke-width="2.4" stroke-linecap="round"/>`;
        s += `<text x="${(ex + ux * (r + 15)).toFixed(1)}" y="${(ey + uy * (r + 15) + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--chalk)">N</text>`;
        // Norge (ca. 60° N) og Australia (ca. 30° S) på siden mot betrakteren
        const nx = ex + r * 0.87 * ux + r * 0.5 * (-px) * 0.9; const ny = ey + r * 0.87 * uy + r * 0.5 * (-py) * 0.9;
        const ax = ex - r * 0.5 * ux + r * 0.86 * px * 0.6; const ay = ey - r * 0.5 * uy + r * 0.86 * py * 0.6;
        s += `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="3.4" fill="var(--r-jorda)" stroke="var(--board)" stroke-width="1"/>`;
        s += `<circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="3.4" fill="var(--warn)" stroke="var(--board)" stroke-width="1"/>`;
        return s;
      }
      function draw() {
        let s = `<svg viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jorda i bane rundt sola">`;
        // bane (bakre halvdel først)
        s += `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="none" stroke="var(--chalk-faint)" stroke-width="1.6"/>`;
        for (let i = 0; i < 12; i++) {
          const [x, y] = pos(i);
          s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="var(--chalk-faint)"/>`;
          if (showDates && i % 3 === 0) {
            const ly = i === 3 ? y - 10 : i === 9 ? y + 20 : y + 36;
            s += `<text x="${x.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="11" font-family="var(--f-mono)" fill="var(--chalk-dim)">${SHORT[i]}</text>`;
          }
        }
        // bevegelsesretning (mot klokka sett ovenfra)
        const arrow = (i) => { const [x1, y1] = pos(i); const [x2, y2] = pos(i + 0.35); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="var(--r-jorda)" stroke-width="2" marker-end="url(#am-arr)"/>`; };
        s += '<defs><marker id="am-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--r-jorda)"/></marker></defs>';
        s += arrow(1.3) + arrow(4.3) + arrow(7.3) + arrow(10.3);
        // sola
        s += `<circle cx="${SUNX}" cy="${CY}" r="22" fill="var(--r-energi)" stroke="var(--warn)" stroke-width="3"/>`;
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; s += `<path d="M${(SUNX + Math.cos(a) * 27).toFixed(1)} ${(CY + Math.sin(a) * 27).toFixed(1)}L${(SUNX + Math.cos(a) * 33).toFixed(1)} ${(CY + Math.sin(a) * 33).toFixed(1)}" stroke="var(--r-energi)" stroke-width="2.5" stroke-linecap="round"/>`; }
        s += earthSvg(m);
        s += `<text x="8" y="244" font-size="10" fill="var(--chalk-faint)">Ikke målestokk. Avstandsforskjellen er overdrevet.</text>`;
        s += '</svg>';
        stage.innerHTML = s;
        svgEl = stage.querySelector('svg');
        if (range) range.value = String(m);
        if (posLbl) posLbl.textContent = showDates ? MONTHS[m] : 'Posisjon ' + (m + 1) + ' av 12';
      }
      function stageBlock() {
        stage = el('div', { class: 'am-stage' });
        stage.addEventListener('click', (ev) => {
          if (locked || !svgEl) return;
          const mt = svgEl.getScreenCTM(); if (!mt) return;
          const p = svgEl.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
          const q = p.matrixTransform(mt.inverse());
          let best = m; let bd = Infinity;
          for (let i = 0; i < 12; i++) { const [x, y] = pos(i); const dd = (x - q.x) ** 2 + (y - q.y) ** 2; if (dd < bd) { bd = dd; best = i; } }
          if (bd < 50 * 50) { m = best; sfx('click'); draw(); }
        });
        range = el('input', { class: 'am-range', type: 'range', min: '0', max: '11', step: '1', value: String(m), 'aria-label': 'Jordas posisjon i banen' });
        range.addEventListener('input', () => { if (locked) return; m = Number(range.value); draw(); });
        const prev = el('button', { class: 'btn', id: 'am-prev', 'aria-label': 'Flytt jorda bakover', text: '◀', onclick: () => { if (locked) return; sfx('click'); m = (m + 11) % 12; draw(); } });
        const next = el('button', { class: 'btn', id: 'am-fwd', 'aria-label': 'Flytt jorda fremover i banen', text: '▶', onclick: () => { if (locked) return; sfx('click'); m = (m + 1) % 12; draw(); } });
        posLbl = el('div', { class: 'am-pos' });
        const ctrl = el('div', { class: 'am-ctrl' }, [prev, range, next]);
        const legend = el('div', { class: 'am-legend' }, [
          el('span', {}, [el('b', { style: { background: 'var(--r-jorda)' } }), 'Norge (60° N)']),
          el('span', {}, [el('b', { style: { background: 'var(--warn)' } }), 'Australia (30° S)']),
          el('span', {}, [el('b', { style: { background: 'var(--r-stoffer)' } }), 'dagside']),
          el('span', { text: 'N = nordpolen, pila viser banen' }),
        ]);
        return { stage, ctrl, posLbl, legend };
      }
      function setLocked(v) {
        locked = v;
        if (range) range.disabled = v;
        wrap.querySelectorAll('#am-prev, #am-fwd').forEach((b) => { b.disabled = v; });
      }

      /* ---------- Runde 1: plasser jorda ---------- */
      function round1() {
        wrap.innerHTML = '';
        wrap.appendChild(header('1 · Plasser jorda'));
        const goal = placeTarget === 6 ? '**midtsommer i Norge** (sommersolverv)' : '**midtvinter i Norge** (vintersolverv)';
        wrap.appendChild(el('div', { class: 'small', html: md('Flytt jorda til der det er ' + goal + '. Bruk glideren, pilene, eller trykk på banen. Se på hvilken vei nordpolen (N) heller.') }));
        const b = stageBlock();
        wrap.append(b.stage, b.posLbl, b.ctrl, b.legend);
        m = rng.pick([2, 4, 8, 10]);
        showDates = false; setLocked(false);
        draw();
        const fb = el('div', { class: 'stack' });
        const go = el('button', { class: 'btn primary block', id: 'am-check', text: 'Her er det!', onclick: () => {
          go.remove(); setLocked(true);
          total += 1;
          const diff = Math.min((m - placeTarget + 12) % 12, (placeTarget - m + 12) % 12);
          const pts = diff === 0 ? 1 : diff === 1 ? 0.5 : 0;
          score += pts;
          log.push('plassering ' + (pts === 1 ? 'riktig' : pts ? 'nesten' : 'feil'));
          sfx(pts === 1 ? 'good' : 'bad');
          const want = placeTarget;
          const txt = (pts === 1 ? '**Riktig!** ' : pts ? '**Nesten**, én måned unna. ' : '**Ikke her.** ') +
            (want === 6
              ? 'Midtsommer (21. juni) er når nordpolen heller **mot** sola. Da står sola høyest på himmelen i Norge, og dagene er lengst.'
              : 'Midtvinter (21. desember) er når nordpolen heller **bort fra** sola. Da står sola lavt, og dagene er korte. Legg merke til at jorda her er på den siden av banen som er **nærmest** sola!');
          showDates = true; m = want; draw();
          fb.appendChild(el('div', { class: 'feedback small ' + (pts === 1 ? 'good' : 'bad'), html: md(txt + ' Aksen peker hele tiden samme vei i rommet, mot Polarstjerna. Det er posisjonen i banen som endrer seg.') }));
          fb.appendChild(el('button', { class: 'btn primary block', id: 'am-next', text: 'Neste: les av modellen', onclick: () => { sfx('click'); readRound(0); } }));
        } });
        wrap.append(go, fb);
      }

      /* ---------- Runde 2–3: les av ---------- */
      function readRound(ri) {
        const mm = reads[ri];
        const K = KEY[mm];
        wrap.innerHTML = '';
        wrap.appendChild(header((ri + 2) + ' · Forutsi'));
        wrap.appendChild(el('div', { class: 'small', html: md('Jorda står i posisjonen under. Datoen er skjult. Bruk aksen og banens retning for å forutsi.') }));
        const b = stageBlock();
        wrap.append(b.stage, b.posLbl, b.legend);
        m = mm; showDates = false; setLocked(true);
        draw();
        const qs = [
          { key: 'no', label: 'Årstid i **Norge**?', opts: SEASONS, want: K.no, grid: 'am-grid' },
          { key: 'au', label: 'Årstid i **Australia**?', opts: SEASONS, want: K.au, grid: 'am-grid' },
          { key: 'day', label: 'Hvor lang er dagen (sola over horisonten) i **Oslo**?', opts: DAY, want: K.day, grid: 'am-grid3' },
        ];
        if (d >= 2) qs.push({ key: 'sun', label: 'Hvor høyt står sola ved middagstid i **Oslo**?', opts: SUN, want: K.sun, grid: 'am-grid3' });
        const equinox = mm === 3 || mm === 9;
        const ans = {};
        const holder = el('div', { class: 'stack' });
        wrap.appendChild(holder);
        let answered = 0;
        qs.forEach((q) => {
          const box = el('div', { class: 'am-q' });
          box.appendChild(el('div', { class: 'small', html: md(q.label) }));
          const g = el('div', { class: q.grid });
          const btns = q.opts.map((o, i) => {
            const bt = el('button', { class: 'option small', text: o });
            bt.addEventListener('click', () => {
              if (bt.disabled) return;
              let ok = i === q.want;
              // d1: ved jevndøgn godtas både vår og høst
              if (!ok && d === 1 && equinox && (q.key === 'no' || q.key === 'au') && (i === 1 || i === 3)) ok = true;
              ans[q.key] = ok;
              btns.forEach((x, j) => { x.disabled = true; if (j === q.want || (ok && j === i)) x.classList.add('correct'); else if (x !== bt) x.classList.add('dim'); });
              if (!ok) bt.classList.add('wrong');
              sfx(ok ? 'good' : 'bad');
              answered++;
              if (answered === qs.length) reveal();
            });
            g.appendChild(bt);
            return bt;
          });
          box.appendChild(g);
          holder.appendChild(box);
        });
        function reveal() {
          let ok = 0; qs.forEach((q) => { if (ans[q.key]) ok++; });
          score += ok; total += qs.length;
          log.push(K.name + ' ' + ok + '/' + qs.length);
          showDates = true; draw();
          const fb = el('div', { class: 'stack' });
          fb.appendChild(el('div', { class: 'feedback small ' + (ok === qs.length ? 'good' : 'bad'), html: md('**' + MONTHS[mm] + ' – ' + K.name + '.** ' + explain(mm)) }));
          fb.appendChild(el('div', { class: 'am-view card', html: oslo(mm) }));
          const last = ri >= reads.length - 1;
          fb.appendChild(el('button', { class: 'btn primary block', id: 'am-next', text: last ? 'Neste: myten' : 'Neste posisjon', onclick: () => { sfx('click'); if (last) mythRound(); else readRound(ri + 1); } }));
          holder.appendChild(fb);
          try { fb.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
        }
      }
      function explain(mm) {
        if (mm === 6) return 'Nordpolen heller mot sola. I Norge står sola høyt, og dagen er lang, så hver kvadratmeter får mye energi. På den sørlige halvkula er det vinter.';
        if (mm === 0) return 'Nordpolen heller bort fra sola. I Norge står sola lavt, og dagen er kort. Strålene treffer på skrå og sprer energien over et større areal. Australia har sommer.';
        const dir = mm === 3 ? 'Jorda er på vei mot posisjonen der nordpolen heller mot sola, så det går mot sommer i nord (vår) og mot vinter i sør (høst).' : 'Jorda er på vei mot posisjonen der nordpolen heller bort fra sola, så det går mot vinter i nord (høst) og mot sommer i sør (vår).';
        return 'Aksen heller verken mot eller bort fra sola, så dag og natt er omtrent like lange over hele jorda (jevndøgn). ' + dir;
      }
      function oslo(mm) {
        const k = KEY[mm];
        const deg = SUNDEG[k.sun]; const h = DAYH[k.day];
        const a = deg * Math.PI / 180;
        const sx = 60 + Math.cos(a) * 110; const sy = 110 - Math.sin(a) * 110;
        const dayW = (h / 24) * 300;
        return `<div class="label">Oslo ved middagstid · ${MONTHS[mm]}</div>
<svg viewBox="0 0 340 150" aria-label="Solhøyde og daglengde i Oslo">
<path d="M10 110H330" stroke="var(--chalk)" stroke-width="2.5"/>
<path d="M60 110L${sx.toFixed(1)} ${sy.toFixed(1)}" stroke="var(--warn)" stroke-width="2" stroke-dasharray="5 4"/>
<path d="M110 110A50 50 0 0 0 ${(60 + Math.cos(a) * 50).toFixed(1)} ${(110 - Math.sin(a) * 50).toFixed(1)}" fill="none" stroke="var(--warn)" stroke-width="1.6"/>
<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="11" fill="var(--r-energi)"/>
<path d="M54 110v-14h12v14" fill="var(--r-jorda)" fill-opacity="0.6" stroke="var(--chalk)" stroke-width="1.5"/>
<text x="118" y="104" font-size="12" fill="var(--warn)" font-family="var(--f-mono)">${NG.fmt(deg, 0)}°</text>
<rect x="20" y="124" width="300" height="12" rx="6" fill="var(--board-4)"/>
<rect x="${(170 - dayW / 2).toFixed(1)}" y="124" width="${dayW.toFixed(1)}" height="12" rx="6" fill="var(--r-energi)"/>
<text x="20" y="148" font-size="10.5" fill="var(--chalk-dim)">00</text><text x="170" y="148" text-anchor="middle" font-size="10.5" fill="var(--chalk-dim)">12 · dag ca. ${NG.fmt(h, 0)} t</text><text x="320" y="148" text-anchor="end" font-size="10.5" fill="var(--chalk-dim)">24</text>
</svg>`;
      }

      /* ---------- Runde 4: myten ---------- */
      function mythRound() {
        wrap.innerHTML = '';
        wrap.appendChild(header('4 · Avstandsmyten'));
        const b = stageBlock();
        wrap.append(b.stage, b.posLbl, b.ctrl);
        m = 1; showDates = true; setLocked(false);
        draw();
        const holder = el('div', { class: 'stack' });
        wrap.appendChild(holder);
        const q1 = {
          prompt: 'Banen er en ellipse. Når i året er jorda **nærmest** sola? (Du kan flytte jorda for å se.)',
          opts: [
            { t: 'Tidlig i januar', ok: true },
            { t: 'Tidlig i juli', why: 'Tidlig i juli er jorda faktisk lengst fra sola.' },
            { t: 'Avstanden er alltid lik', why: 'Banen er en svak ellipse, så avstanden varierer med ca. 3 %.' },
          ],
          explain: 'Jorda er nærmest sola rundt **3. januar** (ca. 147 millioner km) og lengst unna rundt **4. juli** (ca. 152 millioner km). Det er bare ca. 3 % forskjell. Norge har altså vinter når vi er *nærmest* sola.',
        };
        const q2 = {
          prompt: 'Hvorfor er det da sommer i Norge i juli?',
          opts: [
            { t: 'Aksen heller 23,4° og peker samme vei i rommet. I juli heller nordlige halvkule mot sola: høyere sol og lengre dager.', ok: true },
            { t: 'Jorda snur aksen sin mot sola om sommeren og bort fra sola om vinteren, slik at den nordlige halvkula får mer lys og varme.', why: 'Aksen snur ikke. Den peker hele tiden mot samme punkt på himmelen, nær Polarstjerna. Det er jordas *posisjon* i banen som endrer seg.' },
            { t: 'Jorda er litt nærmere sola om sommeren, og selv en liten avstandsforskjell gir mye mer energi per kvadratmeter.', why: 'Dette er selve myten. Jorda er lengst fra sola i juli, og da ville hele jorda hatt sommer samtidig.' },
          ],
          explain: 'Høy sol betyr at strålene treffer mer rett på, så energien fordeles på et mindre areal. Lange dager gir flere timer med innstråling. Et sterkt argument mot avstandsmyten er at Norge og Australia har *motsatte* årstider samtidig.',
        };
        let res2 = 0;
        const ask = (q, then) => {
          holder.appendChild(el('div', { html: md(q.prompt) }));
          const fb = el('div', { class: 'stack' });
          const btns = [];
          rng.shuffle(q.opts).forEach((o) => {
            const bt = el('button', { class: 'option small', html: md(o.t) });
            bt.addEventListener('click', () => {
              if (bt.disabled) return;
              btns.forEach((x) => { x.b.disabled = true; if (x.o.ok) x.b.classList.add('correct'); else if (x.b !== bt) x.b.classList.add('dim'); });
              if (!o.ok) bt.classList.add('wrong');
              if (o.ok) res2++;
              sfx(o.ok ? 'good' : 'bad');
              fb.appendChild(el('div', { class: 'feedback small ' + (o.ok ? 'good' : 'bad'), html: (o.ok ? '' : md(o.why) + '<br>') + md(q.explain) }));
              then(fb);
            });
            btns.push({ b: bt, o });
            holder.appendChild(bt);
          });
          holder.appendChild(fb);
        };
        ask(q1, (fb) => {
          m = 0; draw();
          fb.appendChild(el('button', { class: 'btn primary block', id: 'am-next', text: 'Neste spørsmål', onclick: (ev) => {
            sfx('click'); ev.currentTarget.remove();
            ask(q2, (fb2) => {
              score += res2; total += 2;
              log.push('myte ' + res2 + '/2');
              fb2.appendChild(el('button', { class: 'btn primary block', id: 'am-next', text: 'Se oppsummering', onclick: () => { sfx('click'); renderSummary(); } }));
              try { fb2.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
            });
          } }));
        });
      }

      /* ---------- Oppsummering ---------- */
      let result = null;
      function renderSummary() {
        const sc = Math.round(NG.clamp(score / total, 0, 1) * 100) / 100;
        result = { score: sc, correct: Math.floor(score), total, notes: 'Årstider: ' + log.join('; ') + '.' };
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Resultat' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(sc * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(sc * 100) + '%', background: 'var(--r-jorda)' } })]),
          el('div', { class: 'small', text: log.join(' · ') }),
        ]));
        wrap.appendChild(el('div', { class: 'feedback small', html: md(
          '**Læringspoenget**\n' +
          'Årstidene skyldes at jordaksen heller **23,4°** og hele tiden peker samme vei i rommet, mens jorda går rundt sola. Når nordlige halvkule heller mot sola, står sola **høyere** (strålene treffer mer rett på), og **dagene er lengre**. Det gir sommer i Norge og vinter i Australia samtidig. ' +
          'Avstanden betyr lite: jorda er faktisk **nærmest sola tidlig i januar**. Til elever: la dem bruke lampe og globus med skrå akse og teste avstandsforklaringen mot evidensen om motsatte årstider.') }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'am-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        api.done(result);
        const b = wrap.querySelector('#am-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }

      round1();
      return { destroy() { /* ingen timere */ } };
    },
  });
})();
