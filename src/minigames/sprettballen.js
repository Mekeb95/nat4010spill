/* Mini-spill: Sprettballen (energi). Forutsi farten før nedslaget (v = √(2gh), massen forkorter seg)
   og høyden etter sprettet, og se Eₚ, Eₖ og termisk energi som søyler som til sammen er konstante. */
(function () {
  'use strict';
  const ID = 'sprettballen';
  const g = 9.81;

  NG.css(`
.mg-sprettballen .sb-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-sprettballen .sb-pick { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.mg-sprettballen .sb-pick.three { grid-template-columns: repeat(3, 1fr); }
.mg-sprettballen .sb-pick .option { text-align: center; padding: 8px 4px; font-size: var(--t-s); }
.mg-sprettballen .sb-pick .option b { display: block; font-family: var(--f-mono); font-size: var(--t-m); }
.mg-sprettballen .sb-given { font-family: var(--f-mono); font-size: var(--t-s); color: var(--chalk-dim); }
.mg-sprettballen .sb-sum ul { margin: 0; padding-left: 1.2em; }
.mg-sprettballen .sb-cmp { display: grid; grid-template-columns: auto 1fr 1fr; gap: 2px 10px; font-size: var(--t-s); }
.mg-sprettballen .sb-cmp b { font-family: var(--f-mono); }
`);

  const BALLS = [
    { id: 'tennis', n: 'Tennisball', m: 0.06, e: 0.75, r: 9 },
    { id: 'basket', n: 'Basketball', m: 0.6, e: 0.85, r: 14 },
    { id: 'gummi', n: 'Gummiball', m: 0.2, e: 0.8, r: 11 },
  ];
  const HEIGHTS = [1.0, 1.5, 2.0, 2.5, 3.0];

  NG.minigames.register({
    id: ID, region: 'energi', title: 'Sprettballen', icon: 'ball',
    concepts: ['potensiell-energi', 'kinetisk-energi', 'termisk-energi', 'energibevaring', 'andre-hovedsetning', 'energikvalitet'],
    blurb: 'Forutsi farten og spretthøyden – og finn ut hvor energien blir av når ballen ligger stille.',
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
        ep: col('--r-jorda', '#c4a6ff'), ek: col('--energy', '#ffb454'), th: col('--heat', '#c9785d'), ball: col('--r-energi', '#ffb454'),
        mono: col('--f-mono', 'monospace'), board: col('--board', '#17221f'), board3: col('--board-3', '#2a3c37'),
      };

      let ended = false; let raf = 0;
      let correct = 0; let total = 0; const missed = [];
      let ball = rng.pick(BALLS);
      let h = d >= 2 ? rng.pick(HEIGHTS) : rng.pick([1.0, 2.0, 3.0]);
      // litt variasjon i sprettfaktoren
      const eJit = rng.pick([-0.03, 0, 0.02]);
      const eOf = (b) => Math.round((b.e + eJit) * 100) / 100;
      const keepPct = (b) => Math.round(eOf(b) * eOf(b) * 100); // energiandel som blir igjen per sprett (d1)
      let pred = {};

      const head = el('div', { class: 'stack-s' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Energidalen · lab' }), el('span', { class: 'chip', text: 'g = 9,81 m/s²' })]),
        el('h2', { class: 'h-display', text: 'Sprettballen' }),
      ]);
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [head, stage]));
      const scrollTo = (n) => setTimeout(() => { try { n.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 40);
      const fmt = (x, k) => NG.fmt(x, k == null ? 2 : k);

      function givenText() {
        return d >= 2
          ? `Sprettfaktor e = ${fmt(eOf(ball))} (farten rett etter støtet er ${fmt(eOf(ball))} av farten rett før).`
          : `Ballen beholder ${keepPct(ball)} % av den mekaniske energien i hvert sprett.`;
      }

      /* ---------- 1. Velg ball og høyde ---------- */
      function setup() {
        stage.innerHTML = '';
        const hBtns = HEIGHTS.map((x) => el('button', { class: 'option' + (x === h ? ' selected' : ''), html: `<b>${fmt(x, 1)}</b>m`, onclick: () => { h = x; api.sfx('click'); setup(); } }));
        const bBtns = BALLS.map((b) => el('button', { class: 'option' + (b.id === ball.id ? ' selected' : ''), html: `<b>${fmt(b.m * 1000, 0)} g</b>${b.n}`, onclick: () => { ball = b; api.sfx('click'); setup(); } }));
        stage.append(el('div', { class: 'card stack' }, [
          el('div', { html: api.md('Du slipper en ball (uten dytt) og ser bort fra luftmotstand. **Velg slipphøyde og ball:**') }),
          el('span', { class: 'label', text: 'Slipphøyde' }), el('div', { class: 'sb-pick' }, hBtns),
          el('span', { class: 'label', text: 'Ball' }), el('div', { class: 'sb-pick three' }, bBtns),
          el('div', { class: 'sb-given', text: givenText() }),
          el('button', { class: 'btn primary block', id: 'sb-go', text: 'Forutsi før vi slipper', onclick: () => { api.sfx('click'); predictions(); } }),
        ]));
      }

      /* ---------- 2. Forutsigelser ---------- */
      function ask(q, after) {
        stage.innerHTML = '';
        const ctxCard = el('div', { class: 'sb-given', text: `${ball.n}, ${fmt(ball.m * 1000, 0)} g · slippes fra ${fmt(h, 1)} m · ${givenText()}` });
        const host = el('div', { class: 'card' });
        stage.append(ctxCard, host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) correct++; else missed.push(q.miss); if (q.key) pred[q.key] = NG.parseNum(res.picked); },
          onContinue: () => after(),
        });
        scrollTo(root);
      }

      function predictions() {
        const v = Math.sqrt(2 * g * h);
        const e = eOf(ball);
        const h1 = d >= 2 ? e * e * h : (keepPct(ball) / 100) * h;
        const k = rng.pick([2, 3, 10]);
        ask({
          type: 'num', topic: 'Forutsi', key: 'v', miss: 'v = √(2gh)', unit: 'm/s', answer: Math.round(v * 100) / 100, tol: 0.03,
          prompt: `Hvor stor fart har ballen **rett før den treffer bakken**? Svar med to desimaler.`,
          hint: 'Eₚ øverst = Eₖ nederst: mgh = ½mv²',
          explain: `mgh = ½mv² ⇒ v = √(2gh) = √(2 · 9,81 m/s² · ${fmt(h, 1)} m) ≈ **${fmt(v)} m/s**. Legg merke til at massen forkortes bort.`,
        }, () => ask({
          type: 'mc', topic: 'Massen', miss: 'massen forkorter seg',
          prompt: `Hva om ballen var **${k} ganger så tung** (samme høyde, ingen luftmotstand)? Farten rett før nedslaget blir …`,
          options: ['… den samme', `… ${k} ganger så stor`, `… ${k === 2 ? 'halvparten' : '1/' + k} så stor`, `… √${k} ganger så stor, fordi Eₖ = ½mv²`],
          answer: 0,
          why: { 1: 'En tyngre ball har mer potensiell energi, men trenger også mer energi for å få samme fart. Det går opp i opp.', 2: 'Tyngre ting faller ikke saktere uten luftmotstand.', 3: 'Både Eₚ og Eₖ er proporsjonale med m. Massen står på begge sider og forkortes.' },
          explain: `I mgh = ½mv² står m på begge sider og forkortes bort. Energien blir ${k} ganger så stor, men farten er den samme – alt faller like fort uten luftmotstand.`,
        }, () => ask({
          type: 'num', topic: 'Forutsi', key: 'h1', miss: 'høyde etter sprett', unit: 'm', answer: Math.round(h1 * 1000) / 1000, tol: 0.04,
          prompt: d >= 2
            ? `Hvor høyt kommer ballen **etter første sprett**? Sprettfaktoren e = ${fmt(e)} gjelder *farten*.`
            : `Hvor høyt kommer ballen **etter første sprett**, når den beholder ${keepPct(ball)} % av energien?`,
          hint: d >= 2 ? 'Høyden følger energien, og energien følger v². Altså h₁ = e² · h' : 'Eₚ = mgh: halvparten så mye energi gir halvparten så høyt',
          explain: d >= 2
            ? `Eₖ ∝ v², så energiandelen som blir igjen er e² = ${fmt(e * e, 3)}. h₁ = e²·h = ${fmt(e * e, 3)} · ${fmt(h, 1)} m ≈ **${fmt(h1)} m**. Resten (${Math.round((1 - e * e) * 100)} %) er blitt termisk energi.`
            : `Eₚ = mgh er proporsjonal med h. ${keepPct(ball)} % av energien gir ${keepPct(ball)} % av høyden: **${fmt(h1)} m**. Resten er blitt termisk energi i ball og underlag.`,
        }, () => drop(v, h1))));
      }

      /* ---------- 3. Animasjon med energisøyler ---------- */
      function drop(vTrue, h1True) {
        if (ended) return;
        stage.innerHTML = '';
        const cv = el('canvas', { class: 'sb-canvas', 'aria-label': 'Sprettende ball med søyler for potensiell, kinetisk og termisk energi' });
        const info = el('div', { class: 'small muted', text: 'Følg søylene: summen er hele tiden den samme.' });
        const again = el('button', { class: 'btn', text: 'Slipp igjen', disabled: true, onclick: () => { api.sfx('click'); reset(); } });
        const next = el('button', { class: 'btn primary grow', id: 'sb-next', text: 'Videre', disabled: true, onclick: () => { api.sfx('click'); cancelAnimationFrame(raf); afterQs(); } });
        stage.append(el('div', { class: 'stack-s' }, [cv, info, el('div', { class: 'row' }, [again, next])]));
        scrollTo(stage);
        const H = 300; let W = 340; let ctx = null;
        const fit = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 3);
          W = cv.clientWidth || 340;
          cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
          ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        fit();
        const m = ball.m; const e = d >= 2 ? eOf(ball) : Math.sqrt(keepPct(ball) / 100);
        const Etot = m * g * h;
        let y; let v; let Eth; let bounces; let rest; let last; let firstApex; let vImpact; let rising;
        function reset() {
          y = h; v = 0; Eth = 0; bounces = 0; rest = false; last = 0; firstApex = null; vImpact = null; rising = false;
          again.disabled = true;
          cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
        }
        const SLOW = 0.55;
        function step(dt) {
          if (rest) return;
          v -= g * dt; y += v * dt;
          if (rising && v <= 0) { rising = false; if (bounces === 1 && firstApex == null) firstApex = y; }
          if (y <= 0) {
            y = 0;
            if (vImpact == null) vImpact = Math.abs(v);
            const before = 0.5 * m * v * v;
            v = -v * e;
            const after = 0.5 * m * v * v;
            Eth += before - after; bounces++; rising = true;
            if (after / (m * g) < 0.004) { v = 0; Eth = Etot; rest = true; api.sfx('coin'); }
            else api.sfx('click');
          }
        }
        function frame(now) {
          if (ended) return;
          const dt = last ? Math.min(0.04, (now - last) / 1000) * SLOW : 0;
          last = now;
          for (let i = 0; i < 8; i++) step(dt / 8);
          draw();
          if (rest) {
            next.disabled = false; again.disabled = false;
            info.innerHTML = api.md(`Ballen ligger stille etter ${bounces} sprett. **Eₚ = 0 og Eₖ = 0** – men summen er fortsatt ${fmt(Etot, Etot < 1 ? 3 : 2)} J. Hvor er den?`);
            return;
          }
          raf = requestAnimationFrame(frame);
        }
        function draw() {
          const Ep = rest ? 0 : m * g * y;
          const Ek = rest ? 0 : Math.max(0, Etot - Ep - Eth);
          ctx.clearRect(0, 0, W, H);
          // venstre: høydeskala og ball
          const lw = W * 0.42; const top = 24; const floor = H - 30;
          const hMax = 3.2; const Y = (yy) => floor - (yy / hMax) * (floor - top);
          ctx.strokeStyle = C.line; ctx.fillStyle = C.dim; ctx.font = '10px ' + C.mono; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
          for (let k2 = 0; k2 <= 3; k2++) { ctx.beginPath(); ctx.moveTo(30, Y(k2)); ctx.lineTo(lw, Y(k2)); ctx.stroke(); ctx.fillText(k2 + ' m', 26, Y(k2)); }
          ctx.setLineDash([4, 4]); ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(30, Y(h)); ctx.lineTo(lw, Y(h)); ctx.stroke();
          if (firstApex != null) { ctx.strokeStyle = C.ek; ctx.beginPath(); ctx.moveTo(30, Y(firstApex)); ctx.lineTo(lw, Y(firstApex)); ctx.stroke(); }
          ctx.setLineDash([]);
          ctx.strokeStyle = C.chalk; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(14, floor); ctx.lineTo(lw + 4, floor); ctx.stroke();
          const bx = (30 + lw) / 2; const r = ball.r;
          const squash = y < 0.02 && !rest ? 0.8 : 1;
          ctx.fillStyle = C.ball; ctx.beginPath(); ctx.ellipse(bx, Y(y) - r * squash, r / squash, r * squash, 0, 0, 6.29); ctx.fill();
          ctx.strokeStyle = C.board; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, Y(y) - r * squash, r * 0.6, 0.6, 2.5); ctx.stroke();
          // høyre: søyler
          const bars = [['Eₚ', Ep, C.ep], ['Eₖ', Ek, C.ek], ['termisk', Eth, C.th]];
          const x0 = lw + 18; const span = W - x0 - 10; const bw = Math.min(40, span / 5);
          const gap = (span - bw * 4) / 4;
          const sc = (floor - top) / Etot;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          bars.forEach(([lab, val, c], i) => {
            const x = x0 + i * (bw + gap);
            ctx.fillStyle = C.board3; ctx.fillRect(x, top, bw, floor - top);
            ctx.fillStyle = c; ctx.fillRect(x, floor - val * sc, bw, val * sc);
            ctx.fillStyle = C.dim; ctx.font = '11px ' + C.mono; ctx.fillText(lab, x + bw / 2, floor + 6);
          });
          // sum (stablet)
          const xs = x0 + 3 * (bw + gap);
          let acc = 0;
          bars.forEach(([, val, c]) => { ctx.fillStyle = c; ctx.fillRect(xs, floor - (acc + val) * sc, bw, val * sc); acc += val; });
          ctx.strokeStyle = C.chalk; ctx.lineWidth = 2; ctx.strokeRect(xs, top, bw, floor - top);
          ctx.fillStyle = C.chalk; ctx.fillText('sum', xs + bw / 2, floor + 6);
          ctx.textBaseline = 'bottom'; ctx.font = '10px ' + C.mono; ctx.textAlign = 'right';
          ctx.fillText(fmt(Etot, Etot < 1 ? 3 : 2) + ' J', W - 8, top - 4);
        }
        reset();

        function afterQs() {
          const cmp = el('div', { class: 'card stack-s' }, [
            el('span', { class: 'label', text: 'Forutsagt mot «målt»' }),
            el('div', { class: 'sb-cmp' }, [
              el('span', {}), el('span', { class: 'muted', text: 'Du' }), el('span', { class: 'muted', text: 'Simulert' }),
              el('span', { text: 'Fart før nedslag' }), el('b', { text: isFinite(pred.v) ? fmt(pred.v) + ' m/s' : '–' }), el('b', { text: fmt(vImpact || vTrue) + ' m/s' }),
              el('span', { text: 'Høyde etter sprett 1' }), el('b', { text: isFinite(pred.h1) ? fmt(pred.h1) + ' m' : '–' }), el('b', { text: fmt(firstApex || h1True) + ' m' }),
            ]),
          ]);
          const list = [{
            type: 'mc', topic: 'Hvor ble energien av?', miss: 'energien blir termisk, ikke borte',
            prompt: `Ballen ligger stille. Den hadde ${fmt(Etot, Etot < 1 ? 3 : 2)} J da den ble sluppet. **Hvor ble energien av?**`,
            options: ['Den ble termisk energi i ball, underlag og luft – spredt og lavverdig', 'Den er brukt opp og finnes ikke lenger', 'Den ligger fortsatt lagret som potensiell energi i ballen', 'Den ble til lyd som forsvant ut i verdensrommet'],
            answer: 0,
            why: { 1: '«Brukt opp» er en seiglivet hverdagsforestilling. Energi er bevart (1. hovedsetning).', 2: 'Ballen ligger på bakken: h = 0, så Eₚ = 0 (med bakken som nullnivå).', 3: 'Litt ble lyd, men lyden dempes og blir også termisk energi i lufta.' },
            explain: 'For hvert sprett ble en del av den mekaniske energien omdannet til termisk energi (deformasjon, friksjon, lyd). Summen er den samme hele tiden (1. hovedsetning), men energien er nå **spredt** og kan ikke få ballen til å hoppe igjen – energikvaliteten har sunket (2. hovedsetning).',
          }];
          if (d >= 2) list.push({
            type: 'num', topic: 'Regn', miss: 'Eₚ = mgh', unit: 'J', answer: Math.round(Etot * 1000) / 1000, tol: 0.03,
            prompt: `Hvor mye **termisk energi** har til sammen oppstått når ballen (${fmt(m, 2)} kg, sluppet fra ${fmt(h, 1)} m) ligger stille?`,
            hint: 'All den mekaniske energien fra start …',
            explain: `All den opprinnelige potensielle energien er blitt termisk: E = mgh = ${fmt(m, 2)} kg · 9,81 m/s² · ${fmt(h, 1)} m ≈ **${fmt(Etot, 3)} J**. Ingenting er borte.`,
          });
          else list.push({
            type: 'mc', topic: '2. hovedsetning', miss: 'spredt energi samler seg ikke',
            prompt: 'Den termiske energien er jo fortsatt der. **Hvorfor kan ikke ballen samle den opp og hoppe opp igjen av seg selv?**',
            options: ['Energien er spredt på enormt mange partikler – den samler seg ikke spontant igjen', 'Fordi termisk energi ikke er ekte energi', 'Fordi energien ble borte i det siste spretten', 'Det kan den, hvis vi venter lenge nok'],
            answer: 0,
            why: { 1: 'Termisk energi er like ekte – den teller fullt i regnskapet.', 2: 'Ingen energi ble borte, heller ikke i siste sprett.', 3: 'Spredt energi samler seg ikke spontant. Det er 2. hovedsetning – det er derfor evighetsmaskiner er umulige.' },
            explain: '2. hovedsetning: energi sprer seg spontant, men samler seg ikke av seg selv. Samlet (høyverdig) energi kan gjøre nytte; spredt (lavverdig) energi nesten ikke. Det er derfor ballen stopper og ikke starter igjen.',
          });
          let i = 0;
          const go = () => {
            if (i < list.length) { ask(list[i++], go); if (i === 1) stage.prepend(cmp); }
            else summary();
          };
          go();
        }
      }

      function summary() {
        if (ended) return;
        ended = true;
        cancelAnimationFrame(raf);
        const score = total ? correct / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s sb-sum' }, [
          el('h3', { class: 'h-display', text: 'Ingenting ble borte – ' + correct + ' av ' + total }),
          el('ul', { html: [
            'Øverst er all mekanisk energi **potensiell** (mgh), rett før nedslaget er den **kinetisk** (½mv²).',
            '**v = √(2gh)** – massen forkortes, så tunge og lette ting faller like fort uten luftmotstand.',
            'Høyden etter et sprett er **e² · h**, fordi energien følger v².',
            'Hvert sprett omdanner litt til **termisk energi**. Summen er konstant, men spredt energi kan ikke sende ballen opp igjen – **energikvaliteten** synker.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        scrollTo(stage);
        api.done({ score, correct, total, notes: `Sprettball (${ball.n}, ${fmt(h, 1)} m). ` + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      setup();
      return { destroy() { ended = true; cancelAnimationFrame(raf); } };
    },
  });
})();
