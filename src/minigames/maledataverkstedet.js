/* Mini-spill: Måledataverkstedet (praksis). En klasse har målt hvor lang tid en sukkerbit bruker på å løses ved ulike
   vanntemperaturer. Finn variablene, oppdag uteliggeren i grafen, regn gjennomsnitt og trekk en slutning dataene tåler. */
(function () {
  'use strict';
  const ID = 'maledataverkstedet';
  const TEMPS = [10, 20, 30, 40, 50, 60];

  NG.css(`
.mg-maledataverkstedet .md-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); touch-action: manipulation; }
.mg-maledataverkstedet .md-table { width: 100%; border-collapse: collapse; font: 600 var(--t-xs) var(--f-mono); text-align: center; }
.mg-maledataverkstedet .md-table th, .mg-maledataverkstedet .md-table td { border-bottom: 1px solid var(--line); padding: 4px 2px; }
.mg-maledataverkstedet .md-table th { color: var(--chalk-dim); font-weight: 400; }
.mg-maledataverkstedet .md-table td.hi { color: var(--warn); }
`);

  NG.minigames.register({
    id: ID, region: 'praksis', title: 'Måledataverkstedet', icon: 'chart',
    concepts: ['pr-data', 'pr-feilkilde', 'pr-slutning', 'pr-observasjon', 'pr-uavhengig-variabel', 'pr-avhengig-variabel', 'pr-kontrollvariabel'],
    blurb: 'Finn uteliggeren i klassens måledata – og trekk en slutning som dataene faktisk tåler.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
      const C = { chalk: col('--chalk', '#eef0e6'), dim: col('--chalk-dim', '#a8b6ae'), line: col('--line', 'rgba(238,240,230,.16)'), pt: col('--r-praksis', '#63e0cf'), warn: col('--warn', '#ffd166'), bad: col('--bad', '#ff7d6e'), good: col('--good', '#8fe39b'), mono: col('--f-mono', 'monospace') };
      let ended = false;
      let right = 0; let total = 0; const missed = [];

      // Data: tre gjentak per temperatur, avtagende tid + støy, én uteligger
      const base = rng.pick([170, 190, 210]);
      const data = TEMPS.map((T) => [0, 1, 2].map(() => Math.round(base * Math.exp(-0.024 * (T - 10)) * (1 + (rng.next() - 0.5) * 0.12))));
      const oT = rng.pick([1, 2, 3, 4]); const oR = rng.int(0, 2);
      data[oT][oR] = Math.round(data[oT][oR] * rng.pick([1.9, 2.1, 0.4]));
      const outlierHigh = data[oT][oR] > data[oT][(oR + 1) % 3];
      let outlierFound = false;

      const cv = el('canvas', { class: 'md-canvas', 'aria-label': 'Punktdiagram: tid for å løse sukkerbiten mot vanntemperatur, tre målinger per temperatur' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Utforskertårnet · lab' }), el('span', { class: 'chip', text: 'Data og slutning' })]),
        el('h2', { class: 'h-display', text: 'Måledataverkstedet' }),
        el('div', { class: 'small', html: api.md('9B undersøkte: **Hvordan påvirker vanntemperaturen hvor lang tid en sukkerbit bruker på å løses?** Hver gruppe målte tre ganger ved hver temperatur.') }),
        cv, stage,
      ]));

      let W = 340; const H = 230; let ctx = null;
      const x0 = 42; const yT = 14; const yB = H - 34;
      const tMax = Math.max(...data.flat()) * 1.1;
      const X = (T) => x0 + ((T - 5) / 60) * (W - x0 - 10);
      const Y = (t) => yB - (t / tMax) * (yB - yT);
      const pts = [];
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function draw(opts) {
        opts = opts || {};
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = C.line; ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.lineWidth = 1;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const step = tMax > 300 ? 100 : 50;
        for (let v = 0; v < tMax; v += step) { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(W - 6, Y(v)); ctx.stroke(); ctx.fillText(v + ' s', x0 - 4, Y(v)); }
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        TEMPS.forEach((T) => ctx.fillText(T + '°', X(T), yB + 6));
        ctx.fillText('vanntemperatur (°C)', (x0 + W) / 2, H - 13);
        if (opts.trend) {
          ctx.strokeStyle = C.good; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
          TEMPS.forEach((T, i) => { const v = data[i].filter((_, r) => !(i === oT && r === oR)); const m = v.reduce((a, b) => a + b, 0) / v.length; if (!i) ctx.moveTo(X(T), Y(m)); else ctx.lineTo(X(T), Y(m)); });
          ctx.stroke(); ctx.setLineDash([]);
        }
        pts.length = 0;
        TEMPS.forEach((T, i) => data[i].forEach((t, r) => {
          const x = X(T) + (r - 1) * 7; const y = Y(t);
          pts.push({ x, y, i, r });
          const isO = i === oT && r === oR;
          ctx.fillStyle = isO && outlierFound ? C.bad : C.pt;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.29); ctx.fill();
          if (isO && outlierFound) { ctx.strokeStyle = C.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.29); ctx.stroke(); }
          if (opts.wrong && opts.wrong.i === i && opts.wrong.r === r) { ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.29); ctx.stroke(); }
        }));
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

      /* ---------- 1. Variablene ---------- */
      function variables() {
        ask({
          type: 'sort', topic: 'Variabelkontroll', miss: 'variabeltyper', level: 2,
          prompt: 'Hva slags variabel er hver av disse i undersøkelsen?',
          buckets: ['Uavhengig (vi endrer)', 'Avhengig (vi måler)', 'Kontrollvariabel (holdes lik)'],
          items: rng.shuffle([{ t: 'Vanntemperaturen', b: 0 }, { t: 'Tiden til sukkerbiten er borte', b: 1 }, { t: 'Mengden vann', b: 2 }, { t: 'Størrelsen på sukkerbiten', b: 2 }, { t: 'Om vi rører eller ikke', b: 2 }]).slice(0, d >= 2 ? 5 : 4),
          explain: 'Vi endrer **én** ting (temperaturen) og måler virkningen (tiden). Alt annet som kan påvirke tiden, holdes likt – ellers vet vi ikke hva som forårsaket forskjellen.',
        }, outlier);
      }

      /* ---------- 2. Finn uteliggeren ---------- */
      function outlier() {
        fit(); draw();
        let tries = 0;
        stage.innerHTML = '';
        const fb = el('div', { 'aria-live': 'polite' });
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Se på grafen' }),
          el('div', { html: api.md('Én måling skiller seg tydelig ut fra de andre ved samme temperatur. **Trykk på uteliggeren** i grafen.') }),
          fb,
        ]));
        const tap = (e) => {
          if (outlierFound) return;
          const r = cv.getBoundingClientRect();
          const x = (e.clientX - r.left) * (W / r.width); const y = (e.clientY - r.top) * (H / r.height);
          let best = null; let bd = 22;
          for (const p of pts) { const dd = Math.hypot(p.x - x, p.y - y); if (dd < bd) { bd = dd; best = p; } }
          if (!best) return;
          if (best.i === oT && best.r === oR) {
            outlierFound = true; total++; if (tries < 2) right++; else missed.push('uteligger');
            api.sfx('good'); cv.removeEventListener('pointerdown', tap);
            draw({ trend: true });
            fb.innerHTML = '';
            fb.append(el('div', { class: 'feedback good stack-s' }, [
              el('div', { html: api.md(`**${data[oT][oR]} s ved ${TEMPS[oT]} °C** passer ikke med de to andre (${data[oT].filter((_, k) => k !== oR).join(' s og ')} s). ` + (outlierHigh ? 'Kanskje glemte gruppa å stoppe klokka i tide, eller rørte ikke?' : 'Kanskje startet de klokka for sent, eller knuste biten?') + ' Ikke bare slett den: noter den, se etter årsak, og mål på nytt hvis mulig. Den stiplede linja viser gjennomsnittet uten uteliggeren.') }),
              el('button', { class: 'btn primary block', text: 'Videre', onclick: () => { api.sfx('click'); analysis(); } }),
            ]));
          } else {
            tries++; api.sfx('bad'); draw({ wrong: best });
            fb.innerHTML = '';
            fb.append(el('div', { class: 'feedback bad small', text: tries >= 2 ? `Hint: se på målingene ved ${TEMPS[oT]} °C.` : 'Den ligger nær de andre målingene ved samme temperatur. Let etter en som skiller seg ut.' }));
          }
        };
        cv.addEventListener('pointerdown', tap);
      }

      /* ---------- 3. Analyse og slutning ---------- */
      function analysis() {
        const mi = rng.pick([0, 5]); // uteliggeren ligger aldri ved 10 eller 60 °C
        const vals = data[mi]; const mean = vals.reduce((a, b) => a + b, 0) / 3;
        const list = [
          {
            type: 'num', topic: 'Data', miss: 'gjennomsnitt', level: 3, unit: 's', answer: Math.round(mean * 10) / 10, abs: 0.6,
            prompt: `Ved ${TEMPS[mi]} °C målte gruppa **${vals.join(' s, ')} s**. Hva er gjennomsnittet?`,
            explain: `(${vals.join(' + ')}) / 3 = **${NG.fmt(mean, 1)} s**. Gjentatte målinger og gjennomsnitt gjør resultatet mindre sårbart for tilfeldige feil.`,
          },
          {
            type: 'mc', topic: 'Slutning', miss: 'slutning dataene tåler', level: 4,
            prompt: 'Hvilken slutning tåler dataene best?',
            options: ['Mellom 10 og 60 °C løste sukkerbiten seg raskere jo varmere vannet var', 'Sukker løser seg alltid raskere i varmere vann, uansett temperatur', 'Temperaturen er det eneste som påvirker hvor fort sukker løses', 'Varmt vann kan løse mer sukker enn kaldt vann'],
            answer: 0,
            why: { 1: 'Vi har ikke målt over 60 °C. Å trekke slutninger utenfor måleområdet er å ekstrapolere.', 2: 'Vi holdt de andre variablene like – vi testet ikke om de også påvirker.', 3: 'Kanskje sant, men vi målte *tid*, ikke *hvor mye* som løser seg (løselighet).' },
            explain: 'En god slutning holder seg **innenfor det som er målt** og svarer på spørsmålet som ble stilt. Påstand – evidens – begrunnelse: «raskere i varmt vann» (påstand), tidene i grafen (evidens), og partikkelmodellen kan brukes i begrunnelsen.',
          },
          {
            type: 'sort', topic: 'Feilkilder', miss: 'systematisk eller tilfeldig feil', level: 3,
            prompt: 'Er dette en **systematisk** eller en **tilfeldig** feilkilde?',
            buckets: ['Systematisk', 'Tilfeldig'],
            items: rng.shuffle([{ t: 'Termometeret viser alltid 2 °C for mye', b: 0 }, { t: 'Stoppeklokka startes alltid litt etter at biten slippes', b: 0 }, { t: 'Reaksjonstiden varierer fra gang til gang', b: 1 }, { t: 'Sukkerbitene er litt ulike i størrelse', b: 1 }, { t: 'Vannet kjøles litt ned i løpet av målingen, mer jo varmere det er', b: 0 }]).slice(0, d >= 2 ? 5 : 4),
            explain: '**Systematiske** feil drar alle målingene samme vei og forsvinner ikke med flere målinger – de må finnes og rettes. **Tilfeldige** feil går begge veier og jevnes ut med gjentak og gjennomsnitt.',
          },
        ];
        if (d >= 2) list.push({
          type: 'sort', topic: 'Observasjon og slutning', miss: 'observasjon eller slutning', level: 3,
          prompt: 'Er utsagnet en **observasjon** eller en **slutning**?',
          buckets: ['Observasjon', 'Slutning'],
          items: [{ t: 'Sukkerbiten var borte etter 95 sekunder', b: 0 }, { t: 'Vannet ble litt uklart rundt biten', b: 0 }, { t: 'Vannpartiklene beveger seg raskere i varmt vann', b: 1 }, { t: 'Røring ville gjort det enda raskere', b: 1 }],
          explain: 'En **observasjon** er det vi registrerer med sansene eller instrumenter. En **slutning** går lenger: den tolker, forklarer eller generaliserer – og må begrunnes.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true;
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${right} av ${total} riktige` }),
          el('ul', { html: [
            'Endre **én** variabel, mål **én**, hold resten likt.',
            '**Uteliggere** noteres og undersøkes – de slettes ikke i stillhet.',
            'Gjentak og gjennomsnitt demper **tilfeldige** feil; **systematiske** må finnes.',
            'En god slutning holder seg innenfor det som er målt.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Måledataverkstedet. ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      const onResize = () => { if (!ended && ctx) { fit(); draw({ trend: outlierFound }); } };
      window.addEventListener('resize', onResize);
      fit(); draw();
      variables();
      return { destroy() { ended = true; window.removeEventListener('resize', onResize); } };
    },
  });
})();
