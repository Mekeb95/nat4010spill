/* Mini-spill: Pendellaben (praksis). Utforsk hva som bestemmer svingetiden til en pendel.
   Endre lengde, masse og utslag (helst én om gangen), mål 10 svingninger med realistisk målestøy,
   og trekk en konklusjon: T = 2π√(L/g), uavhengig av masse, nesten uavhengig av lite utslag. */
(function () {
  'use strict';
  const ID = 'pendellaben';
  const g = 9.81;

  NG.css(`
.mg-pendellaben .pl-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-pendellaben .pl-ctrl { display: grid; grid-template-columns: 4.6em 1fr; gap: 8px 10px; align-items: center; }
.mg-pendellaben .pl-ctrl .label { margin: 0; }
.mg-pendellaben .pl-len { display: grid; grid-template-columns: 48px 1fr 48px; gap: 8px; align-items: center; }
.mg-pendellaben .pl-len .btn { padding: 0; font-size: 1.4rem; }
.mg-pendellaben .pl-len .num { text-align: center; font-size: var(--t-l); }
.mg-pendellaben .segs { display: flex; gap: 6px; }
.mg-pendellaben .seg { flex: 1 1 0; min-width: 0; min-height: 44px; padding: 6px 4px; border-radius: 10px; border: 2px solid var(--line-strong); background: var(--board); color: var(--chalk-dim); font-size: var(--t-s); font-weight: 700; cursor: pointer; touch-action: manipulation; }
.mg-pendellaben .seg.on { background: var(--chalk); color: var(--board); border-color: var(--chalk); }
.mg-pendellaben .pl-table { width: 100%; border-collapse: collapse; font-family: var(--f-mono); font-size: 0.78rem; font-variant-numeric: tabular-nums; }
.mg-pendellaben .pl-table th { font-weight: 600; color: var(--chalk-dim); text-align: right; padding: 4px 3px; border-bottom: 1px solid var(--line-strong); }
.mg-pendellaben .pl-table td { text-align: right; padding: 5px 3px; border-bottom: 1px solid var(--line); }
.mg-pendellaben .pl-table td.ch { color: var(--warn); font-weight: 600; }
.mg-pendellaben .pl-table td.t { color: var(--r-praksis); font-weight: 600; }
.mg-pendellaben .pl-table th:first-child, .mg-pendellaben .pl-table td:first-child { text-align: left; color: var(--chalk-faint); }
.mg-pendellaben .pl-goal { display: flex; gap: 6px; flex-wrap: wrap; }
.mg-pendellaben .pl-goal .chip.ok { border-color: var(--good); color: var(--good); }
.mg-pendellaben .pl-sum ul { margin: 0; padding-left: 1.2em; }
`);

  const MASSES = [50, 100, 200];
  const ANGLES = [10, 20, 45, 70];
  const VARS = { L: 'lengden', m: 'massen', a: 'utslaget' };

  function period(Lcm, deg) {
    const th = deg * Math.PI / 180;
    return 2 * Math.PI * Math.sqrt(Lcm / 100 / g) * (1 + th * th / 16 + 11 * Math.pow(th, 4) / 3072);
  }

  NG.minigames.register({
    id: ID, region: 'praksis', title: 'Pendellaben', icon: 'clock',
    concepts: ['pr-variabelkontroll', 'pr-uavhengig-variabel', 'pr-avhengig-variabel', 'pr-kontrollvariabel', 'pr-pendelmodellen', 'pr-gyldighetsomrade', 'pr-feilkilde'],
    blurb: 'Finn ut hva som bestemmer svingetiden – én variabel om gangen.',
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
        bob: col('--r-praksis', '#63e0cf'), warn: col('--warn', '#ffd166'), mono: col('--f-mono', 'monospace'), board: col('--board', '#17221f'),
      };

      const minN = d >= 2 ? 5 : 4;
      const f2 = (x) => x.toFixed(2).replace('.', ',');
      let ended = false; let raf = 0; let last = 0;
      const cur = { L: rng.pick([40, 50, 60]), m: rng.pick(MASSES), a: rng.pick([10, 20]) };
      const rows = [];
      let fair = 0; let unfair = 0;
      let meas = null; // pågående måling
      let simT = 0; // fase-tid for animasjonen
      let qCorrect = 0; let qTotal = 0; const missed = [];

      /* ---------- DOM ---------- */
      const cv = el('canvas', { class: 'pl-canvas', 'aria-label': 'Pendel' });
      const lenVal = el('span', { class: 'num' });
      const lenRow = el('div', { class: 'pl-len' }, [
        el('button', { class: 'btn', id: 'pl-lminus', 'aria-label': 'Kortere tråd', text: '−', onclick: () => setL(cur.L - 10) }),
        lenVal,
        el('button', { class: 'btn', id: 'pl-lplus', 'aria-label': 'Lengre tråd', text: '+', onclick: () => setL(cur.L + 10) }),
      ]);
      function segRow(list, key, unit, idp) {
        const segs = list.map((v) => el('button', { class: 'seg', id: idp + v, text: v + unit, onclick: () => { if (meas || ended) return; cur[key] = v; api.sfx('click'); refresh(); } }));
        return { box: el('div', { class: 'segs' }, segs), segs, list, key };
      }
      const mRow = segRow(MASSES, 'm', ' g', 'pl-m');
      const aRow = segRow(ANGLES, 'a', '°', 'pl-a');
      const measBtn = el('button', { class: 'btn primary block', id: 'pl-measure', text: 'Mål 10 svingninger', onclick: startMeasure });
      const fb = el('div', { class: 'small' });
      const goal = el('div', { class: 'pl-goal' });
      const tbody = el('tbody');
      const table = el('table', { class: 'pl-table' }, [
        el('thead', {}, el('tr', {}, ['#', 'L (cm)', 'm (g)', 'utslag', '10T (s)', 'T (s)'].map((h) => el('th', { text: h })))), tbody,
      ]);
      const tableCard = el('div', { class: 'card stack-s', hidden: true }, [el('span', { class: 'label', text: 'Måletabell' }), table]);
      const concludeBtn = el('button', { class: 'btn block', id: 'pl-conclude', text: `Trekk konklusjon (minst ${minN} målinger)`, disabled: true, onclick: conclude });
      const lab = el('div', { class: 'stack' }, [
        el('div', { class: 'card stack-s' }, [
          el('div', { html: api.md('**Undersøkbart spørsmål:** Hva bestemmer svingetiden *T* (én hel svingning fram og tilbake)? Endre **én variabel om gangen** og mål.') }),
          goal,
        ]),
        cv,
        el('div', { class: 'card pl-ctrl' }, [
          el('span', { class: 'label', text: 'Lengde' }), lenRow,
          el('span', { class: 'label', text: 'Masse' }), mRow.box,
          el('span', { class: 'label', text: 'Utslag' }), aRow.box,
        ]),
        measBtn, fb, tableCard, concludeBtn,
      ]);
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Utforskertårnet · lab' }), el('span', { class: 'chip', text: 'g = 9,81 m/s²' })]),
        el('h2', { class: 'h-display', text: 'Pendellaben' }),
        lab, stage,
      ]));

      function setL(v) { if (meas || ended) return; cur.L = NG.clamp(v, 20, 120); api.sfx('click'); refresh(); }
      function tested() {
        const t = { L: false, m: false, a: false };
        for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
          const diff = ['L', 'm', 'a'].filter((k) => rows[i][k] !== rows[j][k]);
          if (diff.length === 1) t[diff[0]] = true;
        }
        return t;
      }
      function refresh() {
        lenVal.textContent = cur.L + ' cm';
        [mRow, aRow].forEach((r) => r.segs.forEach((s, i) => s.classList.toggle('on', r.list[i] === cur[r.key])));
        const t = tested();
        goal.innerHTML = '';
        ['L', 'm', 'a'].forEach((k) => goal.appendChild(el('span', { class: 'chip' + (t[k] ? ' ok' : ''), text: (t[k] ? '✓ ' : '○ ') + VARS[k] + ' testet' })));
        concludeBtn.disabled = rows.length < minN || !!meas;
        concludeBtn.className = 'btn block' + (rows.length >= minN ? ' primary' : '');
        concludeBtn.textContent = rows.length >= minN ? 'Trekk konklusjon' : `Trekk konklusjon (minst ${minN} målinger)`;
        measBtn.disabled = !!meas || rows.length >= 9;
        lenRow.querySelectorAll('button').forEach((b) => { b.disabled = !!meas; });
        [mRow, aRow].forEach((r) => r.segs.forEach((s) => { s.disabled = !!meas; }));
      }

      /* ---------- måling ---------- */
      function startMeasure() {
        if (meas || ended) return;
        api.sfx('click');
        const T = period(cur.L, cur.a);
        const noise = (rng.next() - 0.5) * 0.4 + (rng.next() - 0.5) * 0.1; // reaksjonstid ved start og stopp
        meas = { T, t: 0, set: Object.assign({}, cur), noise };
        simT = 0;
        fb.textContent = 'Slipper fra ytterpunktet … teller svingninger (spilt av raskere).';
        refresh();
      }
      function finishMeasure() {
        const r = Object.assign({}, meas.set);
        r.ten = Math.round((10 * meas.T + meas.noise) * 100) / 100;
        r.T = r.ten / 10;
        const prev = rows[rows.length - 1];
        rows.push(r);
        meas = null;
        let msg;
        if (!prev) msg = '**Første måling** – dette er referansen din. Endre én variabel og mål igjen.';
        else {
          const ch = ['L', 'm', 'a'].filter((k) => prev[k] !== r[k]);
          if (ch.length === 0) msg = '**Gjentak** med samme oppsett. Forskjellen skyldes målestøy (reaksjonstid) – gjentak gjør resultatet mer pålitelig.';
          else if (ch.length === 1) { fair++; const dT = r.T - prev.T; msg = `**Rettferdig test:** bare ${VARS[ch[0]]} er endret. T endret seg med ${NG.fmt(dT, 2).replace('-', '−')} s` + (Math.abs(dT) < 0.03 ? ' – det er innenfor målestøyen.' : '.'); }
          else { unfair++; msg = `**Obs:** du endret både ${ch.map((k) => VARS[k]).join(' og ')} samtidig. Hvis T endrer seg, vet du ikke hvilken variabel som var årsaken.`; api.sfx('bad'); }
        }
        fb.innerHTML = api.md(msg);
        tableCard.hidden = false;
        tbody.innerHTML = '';
        rows.forEach((x, i) => {
          const p = rows[i - 1];
          const c = (k) => (p && p[k] !== x[k] ? 'ch' : '');
          tbody.appendChild(el('tr', {}, [
            el('td', { text: String(i + 1) }), el('td', { class: c('L'), text: String(x.L) }), el('td', { class: c('m'), text: String(x.m) }),
            el('td', { class: c('a'), text: x.a + '°' }), el('td', { text: f2(x.ten) }), el('td', { class: 't', text: x.T.toFixed(3).replace('.', ',') }),
          ]));
        });
        api.sfx('coin');
        refresh();
      }

      /* ---------- canvas ---------- */
      const H = 200; let W = 340; let ctx = null;
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function draw() {
        if (!ctx) return;
        const set = meas ? meas.set : cur;
        const T = period(set.L, set.a);
        const th0 = set.a * Math.PI / 180;
        const th = th0 * Math.cos(2 * Math.PI * simT / T);
        const maxPx = Math.min(H - 30, (W / 2 - 20) / Math.sin(70 * Math.PI / 180));
        const Lpx = 24 + (set.L / 120) * (maxPx - 24);
        const px = W / 2; const py = 14;
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = C.chalk; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px - 40, py); ctx.lineTo(px + 40, py); ctx.stroke();
        // utslag-bue
        ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + Lpx + 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(px, py, Lpx, Math.PI / 2 - th0, Math.PI / 2 + th0); ctx.stroke();
        ctx.setLineDash([]);
        const bx = px + Math.sin(th) * Lpx; const by = py + Math.cos(th) * Lpx;
        ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
        const r = 6 + Math.sqrt(set.m / 50) * 3.5;
        ctx.fillStyle = C.bob; ctx.beginPath(); ctx.arc(bx, by, r, 0, 6.29); ctx.fill();
        ctx.fillStyle = C.dim; ctx.font = '11px ' + C.mono; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(`L = ${set.L} cm`, 8, H - 38); ctx.fillText(`m = ${set.m} g`, 8, H - 22); ctx.fillText(`utslag ${set.a}°`, 8, H - 6);
        if (meas) {
          ctx.textAlign = 'right'; ctx.fillStyle = C.warn; ctx.font = '600 15px ' + C.mono;
          ctx.fillText('⏱ ' + f2(meas.t) + ' s', W - 8, 8);
          ctx.font = '11px ' + C.mono; ctx.fillStyle = C.dim;
          ctx.fillText('svingning ' + Math.min(10, Math.floor(meas.t / meas.T)) + '/10', W - 8, 28);
        } else if (rows.length) {
          const lr = rows[rows.length - 1];
          ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillStyle = C.dim; ctx.font = '11px ' + C.mono;
          ctx.fillText('siste: 10T = ' + f2(lr.ten) + ' s', W - 8, H - 6);
        }
      }
      function loop(now) {
        if (ended) return;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
        last = now;
        if (meas) {
          const sp = 10 * meas.T / 3.2; // hele målingen tar ca. 3 s
          meas.t = Math.min(10 * meas.T, meas.t + dt * sp);
          simT = meas.t;
          if (meas.t >= 10 * meas.T) { simT = 0; finishMeasure(); }
        } else simT += dt;
        draw();
        raf = requestAnimationFrame(loop);
      }

      /* ---------- konklusjon ---------- */
      const scrollTo = (n) => setTimeout(() => { try { n.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 40);
      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.appendChild(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + qTotal }, q), {
          rng,
          onAnswer: (res) => { qTotal++; if (res.correct) qCorrect++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
        scrollTo(stage);
      }

      function conclude() {
        if (ended || meas) return;
        api.sfx('click');
        cancelAnimationFrame(raf); raf = 0;
        lab.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        measBtn.hidden = true; concludeBtn.hidden = true;
        const inv = d >= 2 ? rng.pick(['L', 'm', 'a']) : 'L';
        const ctrlOf = ['L', 'm', 'a'].filter((k) => k !== inv);
        const nameOf = { L: 'Trådlengden', m: 'Massen til kula', a: 'Utslaget (startvinkelen)' };
        const list = [];
        list.push({
          type: 'sort', topic: 'Konklusjon', miss: 'hva som påvirker T',
          prompt: 'Bruk tabellen din. **Hvor stor effekt har hver variabel på svingetiden?**',
          buckets: ['Ingen merkbar', 'Liten', 'Stor'],
          items: [
            { t: 'Trådlengden', b: 2 },
            { t: 'Massen til kula', b: 0 },
            { t: 'Utslaget når det er lite (10–20°)', b: 0 },
            { t: 'Utslaget når det er stort (45–70°)', b: 1 },
          ],
          explain: 'Modellen **T = 2π√(L/g)** inneholder bare lengden. **Massen** har ingen effekt: en tung kule trekkes hardere, men er like mye tregere å sette i fart. **Utslaget** betyr nesten ingenting for små vinkler (+0,8 % ved 20°), men merkes ved store (+4 % ved 45°, +10 % ved 70°). Det viser modellens **gyldighetsområde**.',
        });
        list.push({
          type: 'sort', topic: 'Variabelkontroll', miss: 'uavhengig/avhengig/kontrollvariabel',
          prompt: `Du vil undersøke om **${VARS[inv]}** påvirker svingetiden. Hvilken rolle har hver størrelse i forsøket?`,
          buckets: ['Uavhengig', 'Avhengig', 'Kontroll'],
          items: [
            { t: nameOf[inv], b: 0 },
            { t: 'Svingetiden', b: 1 },
            { t: nameOf[ctrlOf[0]], b: 2 },
            { t: nameOf[ctrlOf[1]], b: 2 },
          ],
          explain: `**Uavhengig variabel** er den du bevisst endrer (${VARS[inv]}). **Avhengig variabel** er den du måler (svingetiden). **Kontrollvariabler** holdes like (${VARS[ctrlOf[0]]}, ${VARS[ctrlOf[1]]}, samme tråd, samme person på klokka) – ellers vet du ikke hva som forårsaket endringen.`,
        });
        const extra = [{
          type: 'mc', topic: 'Lengden', miss: 'T ∝ √L',
          prompt: 'Trådlengden **firedobles** fra 30 cm til 120 cm. Hva skjer med svingetiden?',
          options: ['Den dobles (1,10 s → 2,20 s)', 'Den firedobles', 'Den halveres', 'Den er uendret'],
          answer: 0,
          why: { 1: 'T er ikke proporsjonal med L, men med √L.', 2: 'Lengre pendel svinger saktere, ikke fortere.', 3: 'Lengden er nettopp den variabelen som betyr mest.' },
          explain: 'T = 2π√(L/g) ⇒ T ∝ √L. √4 = 2, så svingetiden dobles. En vanlig misoppfatning er at T er proporsjonal med L.',
        }, {
          type: 'mc', topic: 'Måling', miss: 'hvorfor 10 svingninger',
          prompt: 'Hvorfor tar man tiden på **10 svingninger** og deler på 10, i stedet for å måle én?',
          options: ['Reaksjonstidsfeilen er like stor uansett, så den blir 10 ganger mindre per svingning', 'Fordi den første svingningen alltid er feil', 'For å få pendelen skikkelig i gang', 'For å bli ferdig fortere'],
          answer: 0,
          why: { 1: 'Alle svingningene er like lange (for samme utslag).', 2: 'Pendelen skal slippes, ikke dyttes – den er i gang med én gang.', 3: 'Det tar tvert imot lengre tid.' },
          explain: 'Du trykker på stoppeklokka med noen tideler sekunds unøyaktighet ved start og stopp. Den feilen er like stor om du måler 1 eller 10 svingninger – delt på 10 blir den ti ganger mindre per svingning. Gjentak og snitt gjør resultatet enda mer pålitelig.',
        }];
        if (d >= 3) extra.push({
          type: 'num', topic: 'Sekundpendel', miss: 'L = g(T/2π)²', unit: 'cm', answer: 99.4, tol: 0.02,
          prompt: 'Hvor lang må tråden være for at svingetiden skal bli **T = 2,00 s** (små utslag)?',
          hint: 'Snu T = 2π√(L/g): L = g · (T/2π)²',
          explain: 'L = 9,81 m/s² · (2,00 s / 2π)² ≈ 0,994 m = **99,4 cm**. Derfor er gulvklokker med sekundpendel høye.',
        });
        list.push(rng.pick(extra));
        list.push({
          type: 'mc', topic: 'Modell', miss: 'modellens gyldighetsområde',
          prompt: 'Et forsøksark sier at «utslaget ikke betyr noe for svingetiden». Hva er **mest presist**?',
          options: ['Det stemmer bare for små utslag – modellen T = 2π√(L/g) har et gyldighetsområde', 'Det stemmer alltid, uansett vinkel', 'Utslaget er den viktigste variabelen', 'Større utslag gir kortere svingetid fordi kula får mer fart'],
          answer: 0,
          why: { 1: 'Ved 90° er T ca. 18 % lengre. En modell gjelder ikke uten grenser.', 2: 'Lengden betyr mye mer.', 3: 'Kula får mer fart, men har også lengre vei – og T blir faktisk litt *lengre*.' },
          explain: 'Formelen bygger på en tilnærming som bare gjelder for små vinkler. Å vite hvor en modell gjelder – og hvor den svikter – er en del av å bruke modeller i naturfag.',
        });
        let i = 0;
        const go = () => { if (i < list.length) ask(list[i++], go); else summary(); };
        go();
      }

      function summary() {
        if (ended) return;
        ended = true;
        cancelAnimationFrame(raf);
        const t = tested();
        const nTested = ['L', 'm', 'a'].filter((k) => t[k]).length;
        const fairFrac = fair + unfair ? fair / (fair + unfair) : 0; // gjentak straffes ikke
        const total = qTotal + 2;
        const correct = qCorrect + (fairFrac >= 0.75 ? 1 : 0) + (nTested === 3 ? 1 : 0);
        const score = (qCorrect + fairFrac + nTested / 3) / total;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s pl-sum' }, [
          el('h3', { class: 'h-display', text: 'Laboratorierapport – ' + correct + ' av ' + total }),
          el('div', { class: 'small', html: api.md(`${rows.length} målinger · ${fair} rettferdige tester · ${unfair} med flere endringer samtidig · ${nTested} av 3 variabler testet rettferdig.`) }),
          el('ul', { html: [
            '**T = 2π√(L/g)**: bare lengden betyr noe for små utslag – firedobbel lengde gir dobbel svingetid.',
            '**Massen** påvirker ikke svingetiden. **Utslaget** nesten ikke for små vinkler – modellen har et **gyldighetsområde**.',
            '**Variabelkontroll:** endre én uavhengig variabel, mål den avhengige, hold resten konstant.',
            'Mål **10 svingninger** og del på 10 for å gjøre reaksjonstidsfeilen liten.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        scrollTo(stage);
        api.done({ score, correct, total, notes: `Pendellab: ${rows.length} målinger, ${fair} rettferdige, ${unfair} uryddige. ` + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alle konklusjonsspørsmål riktig.') });
      }

      const onResize = () => { fit(); draw(); };
      window.addEventListener('resize', onResize);
      fit();
      refresh();
      raf = requestAnimationFrame(loop);
      return { destroy() { ended = true; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
    },
  });
})();
