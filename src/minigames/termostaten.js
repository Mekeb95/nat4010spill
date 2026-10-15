/* Mini-spill: Termostaten (teknologi). Sorter delene i et styresystem, prøv en tidsstyrt varmeovn, og programmer så
   en termostat med sensor og tilbakekobling. Et vindu åpnes midt i simuleringen – hvilket system takler det? */
(function () {
  'use strict';
  const ID = 'termostaten';
  const MIN = 150; // simulerte minutter
  const T_OUT = 2; const LO = 19; const HI = 23;

  NG.css(`
.mg-termostaten .ts-sys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; align-items: center; text-align: center; font-size: var(--t-xs); }
.mg-termostaten .ts-box { border: 2px solid var(--line-strong); border-radius: 10px; padding: 6px 2px; background: var(--board-2); transition: border-color .2s, background .2s; }
.mg-termostaten .ts-box b { display: block; font: 600 var(--t-xs) var(--f-mono); color: var(--r-teknologi); }
.mg-termostaten .ts-box.on { border-color: var(--warn); background: var(--board-3); }
.mg-termostaten .ts-fb { font: 600 var(--t-xs) var(--f-mono); color: var(--chalk-dim); text-align: center; }
.mg-termostaten .ts-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-termostaten .ts-code { font: 600 var(--t-s) var(--f-mono); background: #111a17; border: 1px solid var(--line); border-radius: var(--r-m); padding: 10px 12px; line-height: 2.1; }
.mg-termostaten .ts-code .k { color: var(--r-stoffer); }
.mg-termostaten .ts-code .c { color: var(--chalk-faint); }
.mg-termostaten .ts-chip { display: inline-flex; gap: 2px; vertical-align: middle; }
.mg-termostaten .ts-chip button { min-height: 36px; min-width: 40px; padding: 2px 6px; border-radius: 8px; border: 1px solid var(--line-strong); background: var(--board-3); color: var(--chalk); font: 600 var(--t-s) var(--f-mono); }
.mg-termostaten .ts-chip button.sel { background: var(--warn); color: var(--board); border-color: var(--warn); }
.mg-termostaten .ts-res { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 4px; font-size: var(--t-xs); }
.mg-termostaten .ts-res b { display: block; font: 600 var(--t-m) var(--f-mono); }
`);

  NG.minigames.register({
    id: ID, region: 'teknologi', title: 'Termostaten', icon: 'thermo',
    concepts: ['tek-sensor', 'tek-aktuator', 'tek-tilbakekobling', 'tek-styring-kontroll', 'tek-betingelse', 'tek-system'],
    blurb: 'Programmer en termostat som holder stua varm – også når noen åpner vinduet.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
      const C = { chalk: col('--chalk', '#eef0e6'), dim: col('--chalk-dim', '#a8b6ae'), line: col('--line', 'rgba(238,240,230,.16)'), good: col('--good', '#8fe39b'), bad: col('--bad', '#ff7d6e'), warn: col('--warn', '#ffd166'), mono: col('--f-mono', 'monospace') };
      let ended = false; let raf = 0;
      let right = 0; let total = 0; const missed = [];
      const windowAt = rng.int(70, 90); const windowLen = rng.int(25, 35);
      const runs = {};

      const boxes = ['Sensor', 'Styreenhet', 'Aktuator', 'Rommet'].map((n, i) => el('div', { class: 'ts-box' }, [el('b', { text: ['🌡', '⚙', '🔥', '🏠'][i] }), n]));
      const sys = el('div', { class: 'stack-s' }, [
        el('div', { class: 'ts-sys' }, boxes),
        el('div', { class: 'ts-fb', text: '↑ tilbakekobling: rommets temperatur måles igjen ←←←←←←' }),
      ]);
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Verkstedet · lab' }), el('span', { class: 'chip', text: `mål: ${LO}–${HI} °C` })]),
        el('h2', { class: 'h-display', text: 'Termostaten' }),
        el('div', { class: 'small', html: api.md(`Det er ${T_OUT} °C ute. Stua skal holde **${LO}–${HI} °C** med en varmeovn som enten er på eller av.`) }),
        sys, stage,
      ]));
      const light = (k) => boxes.forEach((b, i) => b.classList.toggle('on', i === k));

      // ---------- simulering ----------
      // program(t, målt, ovnPå) -> ovnPå
      function simulate(program) {
        let T = 15; let on = false; let sw = 0; let inBand = 0; let counted = 0;
        const pts = [];
        const noise = NG.makeRng(api.seed + 7);
        for (let t = 0; t <= MIN; t++) {
          const open = t >= windowAt && t < windowAt + windowLen;
          const k = open ? 0.05 : 0.03; // varmetap per minutt per grad forskjell
          const measured = T + (noise.next() - 0.5) * 0.6; // sensoren har litt støy
          const was = on;
          on = !!program(t, measured, on);
          if (on !== was && t > 0) sw++;
          T += (on ? 1.1 : 0) - k * (T - T_OUT);
          if (t >= 20) { counted++; if (T >= LO && T <= HI) inBand++; }
          pts.push({ t, T, on, open });
        }
        return { pts, sw, pct: inBand / counted };
      }

      function canvasFor(res, onDone) {
        const cv = el('canvas', { class: 'ts-canvas', 'aria-label': 'Graf over romtemperatur og når ovnen er på' });
        const H = 200; let W = 340;
        setTimeout(() => {
          const dpr = Math.min(window.devicePixelRatio || 1, 3);
          W = cv.clientWidth || 340; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
          const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const x0 = 30; const x1 = W - 6; const yT = 10; const yB = H - 38;
          const X = (t) => x0 + (t / MIN) * (x1 - x0); const Y = (T) => yB - ((T - 10) / 20) * (yB - yT);
          const n = res.pts.length; let shown = 0; const t0 = performance.now();
          const frame = (now) => {
            if (ended) return;
            shown = reduce ? n : Math.max(0, Math.min(n, Math.floor((now - t0) / 18)));
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(143,227,155,.12)'; ctx.fillRect(x0, Y(HI), x1 - x0, Y(LO) - Y(HI));
            ctx.fillStyle = 'rgba(124,200,255,.12)'; ctx.fillRect(X(windowAt), yT, X(windowAt + windowLen) - X(windowAt), yB - yT);
            ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textAlign = 'center'; ctx.fillText('vindu åpent', X(windowAt + windowLen / 2), yT + 10);
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            [10, 15, 20, 25, 30].forEach((v) => { ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); ctx.fillText(v + '°', x0 - 4, Y(v)); });
            ctx.textBaseline = 'alphabetic';
            // ovn på/av
            for (let i = 0; i < shown; i++) if (res.pts[i].on) { ctx.fillStyle = C.warn; ctx.fillRect(X(i), yB + 8, Math.max(1, X(1) - X(0)), 8); }
            ctx.fillStyle = C.dim; ctx.textAlign = 'left'; ctx.fillText('ovn', 2, yB + 16);
            ctx.textAlign = 'center'; ctx.fillText('minutter', (x0 + x1) / 2, H - 4);
            ctx.strokeStyle = C.chalk; ctx.lineWidth = 2.5; ctx.beginPath();
            for (let i = 0; i < shown; i++) { const p = res.pts[i]; if (!i) ctx.moveTo(X(p.t), Y(p.T)); else ctx.lineTo(X(p.t), Y(p.T)); }
            ctx.stroke();
            if (shown < n) { light(res.pts[shown].on ? 2 : 1); raf = requestAnimationFrame(frame); } else { light(-1); onDone(); }
          };
          cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
        }, 30);
        return cv;
      }

      function resultRow(res) {
        return el('div', { class: 'ts-res' }, [
          el('div', {}, [el('b', { text: Math.round(res.pct * 100) + ' %' }), 'av tiden i målområdet']),
          el('div', {}, [el('b', { text: String(res.sw) }), 'av/på-skift']),
          el('div', {}, [el('b', { text: NG.fmt(Math.min(...res.pts.slice(windowAt).map((p) => p.T)), 1) + '°' }), 'laveste etter vinduet']),
        ]);
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

      /* ---------- 1. Delene i systemet ---------- */
      function parts() {
        ask({
          type: 'sort', topic: 'System', miss: 'sensor, styreenhet og aktuator', level: 2,
          prompt: 'Et styresystem har **inndata → prosessering → utdata**. Sorter delene:',
          buckets: ['Sensor (inndata)', 'Styreenhet', 'Aktuator (utdata)'],
          items: rng.shuffle([{ t: 'Termometer', b: 0 }, { t: 'Lyssensor', b: 0 }, { t: 'micro:bit med program', b: 1 }, { t: 'Varmeovn', b: 2 }, { t: 'Motor som åpner en luke', b: 2 }, { t: 'Trykknapp', b: 0 }, { t: 'Høyttaler', b: 2 }]).slice(0, d >= 2 ? 7 : 5),
          explain: '**Sensorer** måler noe i omgivelsene. **Styreenheten** (her et program) bestemmer hva som skal skje. **Aktuatorer** gjør noe fysisk: varmer, beveger, lager lyd.',
        }, timed);
      }

      /* ---------- 2. Tidsstyring (åpen styring) ---------- */
      function timed() {
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Forsøk 1: tidsstyrt ovn' }),
          el('div', { class: 'ts-code', html: '<span class="k">for alltid:</span><br>&nbsp;&nbsp;ovn.på()<br>&nbsp;&nbsp;vent(5) <span class="c"># minutter</span><br>&nbsp;&nbsp;ovn.av()<br>&nbsp;&nbsp;vent(5)' }),
          el('div', { class: 'small', text: 'Ovnen går på et fast tidsskjema. Den har ingen sensor.' }),
          el('button', { class: 'btn primary block', text: 'Kjør simuleringen', onclick: (e) => {
            e.target.remove(); api.sfx('click');
            const res = simulate((t) => (t % 10) < 5);
            runs.timed = res;
            const after = el('div', { class: 'stack-s' });
            stage.append(canvasFor(res, () => {
              after.append(resultRow(res), el('div', { class: 'small', html: api.md('Da vinduet ble åpnet, falt temperaturen – og ovnen merket ingenting. Dette er **styring uten tilbakekobling**: systemet vet ikke hva som faktisk skjer.') }),
                el('button', { class: 'btn primary block', text: 'Lag en termostat', onclick: () => { api.sfx('click'); thermostat(false); } }));
            }), after);
          } }),
        ]));
      }

      /* ---------- 3. Termostat med sensor ---------- */
      function chips(vals, cur, onPick) {
        const w = el('span', { class: 'ts-chip' });
        vals.forEach((v) => w.appendChild(el('button', { class: v === cur ? 'sel' : '', text: String(v), onclick: (e) => { api.sfx('click'); w.querySelectorAll('button').forEach((b) => b.classList.remove('sel')); e.target.classList.add('sel'); onPick(v); } })));
        return w;
      }

      function thermostat(hyst) {
        stage.innerHTML = '';
        let a = hyst ? 20 : 15; let b = 22;
        const code = el('div', { class: 'ts-code' });
        if (!hyst) {
          code.append(el('span', { class: 'k', text: 'for alltid:' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;t = termometer.les()' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;<span class="k">hvis</span> t &lt; ' }), chips([15, 18, 21, 25], a, (v) => { a = v; }), el('span', { text: ' :' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;&nbsp;&nbsp;ovn.på()' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;<span class="k">ellers</span>:' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;&nbsp;&nbsp;ovn.av()' }));
        } else {
          code.append(el('span', { class: 'k', text: 'for alltid:' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;t = termometer.les()' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;<span class="k">hvis</span> t &lt; ' }), chips([19, 20, 21], a, (v) => { a = v; }), el('span', { text: ' :' }), el('br'), el('span', { html: '&nbsp;&nbsp;&nbsp;&nbsp;ovn.på()' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;<span class="k">hvis</span> t &gt; ' }), chips([21, 22, 23], b, (v) => { b = v; }), el('span', { text: ' :' }), el('br'), el('span', { html: '&nbsp;&nbsp;&nbsp;&nbsp;ovn.av()' }), el('br'),
            el('span', { html: '&nbsp;&nbsp;<span class="c"># ellers: uendret</span>' }));
        }
        const out = el('div', { class: 'stack-s' });
        let tries = 0;
        const run = el('button', { class: 'btn primary block', text: 'Kjør simuleringen', onclick: () => {
          if (hyst && a >= b) { api.toast('Grensen for «på» må være lavere enn grensen for «av».'); return; }
          api.sfx('click'); run.disabled = true; out.innerHTML = '';
          const res = simulate(hyst ? (t, m, on) => (m < a ? true : m > b ? false : on) : (t, m) => m < a);
          out.append(canvasFor(res, () => {
            const ok = res.pct >= 0.85 && (!hyst || res.sw <= 30);
            out.append(resultRow(res));
            if (!hyst) {
              runs.single = res;
              if (res.pct >= 0.85) {
                total++; right++; api.sfx('good');
                out.append(el('div', { class: 'feedback good stack-s' }, [
                  el('div', { html: api.md(`Termostaten holdt stua varm – også med åpent vindu! Sensoren måler hele tiden, så ovnen står lenger på når det blir kaldt. Det er **tilbakekobling**.\n\nMen se på den gule stripa: ovnen skiftet **${res.sw} ganger**. Rundt grensen gjør litt støy i målingene at ovnen hakker av og på.`) }),
                  el('button', { class: 'btn primary block', text: d >= 2 ? 'Fiks hakkingen' : 'Videre', onclick: () => { api.sfx('click'); if (d >= 2) thermostat(true); else questions(); } }),
                ]));
              } else {
                api.sfx('bad'); tries++;
                out.append(el('div', { class: 'feedback bad stack-s' }, [
                  el('div', { html: api.md(a < LO ? `Med grense ${a} °C slår ovnen seg av før stua når ${LO} °C.` : `Med grense ${a} °C blir det for varmt – ovnen står på til det er over ${HI} °C.`) + (tries >= 3 ? ' Grensen må ligge inne i målområdet, f.eks. 21 °C.' : '') }),
                  tries >= 3
                    ? el('button', { class: 'btn block', text: 'Gå videre', onclick: () => { total++; missed.push('terskel i termostaten'); questions(); } })
                    : el('button', { class: 'btn block', text: 'Prøv en annen grense', onclick: () => { run.disabled = false; out.innerHTML = ''; } }),
                ]));
              }
            } else {
              runs.hyst = res; total++;
              if (ok) { right++; api.sfx('good'); } else { api.sfx('bad'); missed.push('hysterese'); }
              out.append(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
                el('div', { html: api.md((ok ? `Fra ${runs.single ? runs.single.sw : '?'} til **${res.sw}** skift!` : `${res.sw} skift og ${Math.round(res.pct * 100)} % i målområdet.`) + ' Med to grenser (**hysterese**) får ovnen et «dødbånd» der den lar være å skifte. Slik virker ekte termostater – og det sparer reléet for slitasje.') }),
                el('button', { class: 'btn primary block', text: 'Videre', onclick: () => { api.sfx('click'); questions(); } }),
              ]));
            }
          }));
        } });
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: hyst ? 'Forsøk 3: to grenser' : 'Forsøk 2: termostat med sensor' }),
          el('div', { class: 'small', text: hyst ? 'Velg når ovnen skal slå seg på og når den skal slå seg av.' : 'Velg temperaturgrensen i programmet:' }),
          code, run,
        ]), out);
      }

      function questions() {
        const list = [
          {
            type: 'mc', topic: 'Tilbakekobling', miss: 'tilbakekobling', level: 3,
            prompt: 'Hvorfor klarte termostaten det åpne vinduet, mens den tidsstyrte ovnen ikke gjorde det?',
            options: ['Termostaten måler resultatet og justerer ut fra det – målingen kobles tilbake til styringen', 'Termostaten har en kraftigere ovn', 'Programmet til termostaten vet på forhånd når vinduet åpnes', 'Den tidsstyrte ovnen hadde for kort løkke'],
            answer: 0,
            why: { 1: 'Ovnen var den samme i alle forsøkene.', 2: 'Programmet vet ingenting om vinduet – det reagerer på målingen.', 3: 'Løkkelengden var ikke problemet; den manglet en sensor.' },
            explain: 'Med **tilbakekobling** (lukket sløyfe) måler sensoren virkningen av det aktuatoren gjør, og styringen justerer. Uten tilbakekobling (åpen styring) går systemet i blinde.',
          },
          {
            type: 'mc', topic: 'Kodelesing', miss: 'hvorfor for alltid', level: 3,
            prompt: 'Hvorfor står termostatprogrammet inne i en **for alltid**-løkke?',
            options: ['Temperaturen endrer seg hele tiden, så den må måles og vurderes igjen og igjen', 'For at ovnen aldri skal slå seg av', 'Fordi en hvis-setning bare virker inne i en løkke', 'For at programmet skal gå fortere'],
            answer: 0,
            why: { 1: 'Løkka gjentar målingen; det er hvis-setningen som bestemmer på eller av.', 2: 'En hvis-setning virker fint uten løkke – men da sjekkes den bare én gang.', 3: 'Løkka gjør ikke programmet raskere.' },
            explain: 'Uten løkka ville programmet lest temperaturen én gang og så stoppet. Løkka gjør at systemet hele tiden kan reagere på endringer – forutsetningen for tilbakekobling.',
          },
        ];
        if (d >= 3) list.push({
          type: 'mc', topic: 'System', miss: 'tilbakekobling i kroppen', level: 5,
          prompt: 'Hvilket eksempel fra kroppen ligner mest på termostaten?',
          options: ['Du svetter når kroppstemperaturen stiger, og slutter når den synker igjen', 'Hjertet slår fordi hjernen sender et fast signal hvert sekund', 'Maten går gjennom tarmen i samme tempo uansett', 'Neglene vokser like fort hele året'],
          answer: 0,
          why: { 1: 'Hjerterytmen justeres faktisk etter behov, men eksempelet beskriver en fast takt.', 2: 'Det beskriver en prosess uten måling og justering.', 3: 'Ingen måling og justering her.' },
          explain: 'Temperaturreguleringen i kroppen er en tilbakekoblingssløyfe: sensorer i huden og hjernen måler, hjernen styrer, og svettekjertler og blodårer er «aktuatorer». Systemtenkning går på tvers av teknologi og biologi.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true; cancelAnimationFrame(raf);
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${right} av ${total} riktige` }),
          el('ul', { html: [
            'Et styresystem: **sensor** (inndata) → **styreenhet** (program) → **aktuator** (utdata).',
            'Tidsstyring uten sensor kan ikke reagere på endringer.',
            '**Tilbakekobling**: sensoren måler resultatet, og programmet justerer – i en løkke.',
            'Én grense gir hakking; to grenser (**hysterese**) gir et rolig system.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Termostaten: ' + Object.entries(runs).map(([k, r]) => `${k} ${Math.round(r.pct * 100)} % i mål, ${r.sw} skift`).join('; ') + '.' + (missed.length ? ' Bommet på: ' + missed.join(', ') + '.' : '') });
      }

      parts();
      return { destroy() { ended = true; cancelAnimationFrame(raf); } };
    },
  });
})();
