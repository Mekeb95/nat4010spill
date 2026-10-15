/* Mini-spill: Smittesimulatoren (kropp). En by med 140 innbyggere: slipp løs en smitte uten vaksine, velg så
   vaksinasjonsdekning og se om smitten dør ut. Oppdag flokkimmunitet og terskelen 1 − 1/R₀ – og hvem den beskytter. */
(function () {
  'use strict';
  const ID = 'smittesimulatoren';
  const COLS = 14; const ROWS = 10; const N = COLS * ROWS;

  NG.css(`
.mg-smittesimulatoren .ss-canvas { display: block; width: 100%; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); touch-action: manipulation; }
.mg-smittesimulatoren .ss-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; text-align: center; font-size: var(--t-xs); }
.mg-smittesimulatoren .ss-stats b { display: block; font: 600 var(--t-m) var(--f-mono); }
.mg-smittesimulatoren .ss-legend { display: flex; flex-wrap: wrap; gap: 10px; font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-smittesimulatoren .ss-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: -1px; }
.mg-smittesimulatoren .ss-pick { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.mg-smittesimulatoren .ss-pick .option { text-align: center; padding: 10px 2px; font: 600 var(--t-s) var(--f-mono); }
.mg-smittesimulatoren .ss-log { font-family: var(--f-mono); font-size: var(--t-xs); color: var(--chalk-dim); }
`);

  NG.minigames.register({
    id: ID, region: 'kropp', title: 'Smittesimulatoren', icon: 'shield',
    concepts: ['flokkimmunitet', 'vaksine', 'immunsystem', 'folkehelse'],
    blurb: 'Slipp løs en smitte i en liten by og finn ut hvor mange som må være vaksinert for å stoppe den.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
      const cs = getComputedStyle(document.documentElement);
      const col = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
      const C = { s: col('--chalk-dim', '#a8b6ae'), v: col('--good', '#8fe39b'), i: col('--bad', '#ff7d6e'), r: col('--xp', '#c4a6ff'), line: col('--line', 'rgba(238,240,230,.16)'), board: col('--board', '#17221f'), warn: col('--warn', '#ffd166'), mono: col('--f-mono', 'monospace') };

      const R0 = d === 1 ? 4 : d === 2 ? rng.pick([3, 5]) : rng.pick([6, 8]);
      const threshold = 1 - 1 / R0;
      // Sårbare: spedbarn og personer med svekket immunforsvar – kan ikke vaksineres
      const vulnerable = new Set(rng.shuffle([...Array(N).keys()]).slice(0, 8));

      let ended = false; let timer = 0; let raf = 0;
      let qRight = 0; let qTotal = 0; const missed = [];
      let people = []; let links = []; let gen = 0; let running = false;
      const runs = []; // { cov, infected, vulnHit, susceptibleStart }

      const cv = el('canvas', { class: 'ss-canvas', 'aria-label': 'Rutenett med 140 innbyggere som blir smittet, immune eller vaksinert' });
      const stats = el('div', { class: 'ss-stats' });
      const log = el('div', { class: 'ss-log', 'aria-live': 'polite' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Kroppsbyen · lab' }), el('span', { class: 'chip', text: 'R₀ = ' + R0 })]),
        el('h2', { class: 'h-display', text: 'Smittesimulatoren' }),
        el('div', { class: 'small', html: api.md(`En ny smitte har **R₀ = ${R0}**: én smittet person smitter i snitt ${R0} andre – *hvis alle rundt er mottakelige*. De med ring kan ikke vaksineres (spedbarn, svekket immunforsvar).`) }),
        cv,
        el('div', { class: 'ss-legend' }, [
          el('span', { html: `<i style="background:${C.s}"></i>mottakelig` }), el('span', { html: `<i style="background:${C.v}"></i>vaksinert` }),
          el('span', { html: `<i style="background:${C.i}"></i>smittet` }), el('span', { html: `<i style="background:${C.r}"></i>immun etter sykdom` }),
          el('span', { html: `<i style="background:transparent;border:2px solid ${C.warn}"></i>sårbar` }),
        ]),
        stats, log, stage,
      ]));

      let W = 340; let H = 240; let ctx = null; let cell = 24;
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340; cell = W / COLS; H = Math.round(cell * ROWS);
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const pos = (k) => [(k % COLS + 0.5) * cell, (Math.floor(k / COLS) + 0.5) * cell];

      function setup(coverage) {
        // vaksiner en andel av dem som kan vaksineres
        const can = [...Array(N).keys()].filter((k) => !vulnerable.has(k));
        const nV = Math.round(coverage * N);
        const vacc = new Set(rng.shuffle(can).slice(0, Math.min(nV, can.length)));
        people = [...Array(N).keys()].map((k) => ({ st: vacc.has(k) ? 'v' : 's', t: 0 }));
        // to smittede blant de uvaksinerte (aldri en sårbar som «pasient null»)
        const seedable = rng.shuffle([...Array(N).keys()].filter((k) => people[k].st === 's' && !vulnerable.has(k)));
        seedable.slice(0, 2).forEach((k) => { people[k].st = 'i'; people[k].t = 0; });
        links = []; gen = 0;
        draw(); updStats();
      }

      function count() {
        const c = { s: 0, v: 0, i: 0, r: 0 };
        people.forEach((p) => c[p.st]++);
        return c;
      }
      function updStats() {
        const c = count();
        stats.innerHTML = '';
        [['mottakelige', c.s], ['vaksinert', c.v], ['smittet nå', c.i], ['har vært syke', c.r + c.i]].forEach(([l, v]) => stats.appendChild(el('div', {}, [el('b', { text: String(v) }), l])));
      }

      function contactOf(k) {
        if (rng.chance(0.7)) {
          const x = k % COLS; const y = Math.floor(k / COLS);
          for (let tries = 0; tries < 6; tries++) {
            const nx = x + rng.int(-2, 2); const ny = y + rng.int(-2, 2);
            if ((nx !== x || ny !== y) && nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS) return ny * COLS + nx;
          }
        }
        let j = rng.int(0, N - 1); if (j === k) j = (j + 1) % N; return j;
      }

      function step() {
        const infected = people.map((p, k) => (p.st === 'i' ? k : -1)).filter((k) => k >= 0);
        if (!infected.length) return false;
        const fresh = [];
        links = [];
        for (const k of infected) {
          // R₀ kontakter som *ville* blitt smittet om de var mottakelige
          for (let c = 0; c < R0; c++) {
            const j = contactOf(k);
            if (people[j].st === 's' && fresh.indexOf(j) < 0) { fresh.push(j); links.push([k, j]); }
          }
          people[k].st = 'r';
        }
        fresh.forEach((j) => { people[j].st = 'i'; people[j].t = gen + 1; });
        gen++;
        return true;
      }

      function draw(pulse) {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        // smittelinjer fra forrige generasjon
        ctx.strokeStyle = C.i; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.5;
        for (const [a, b] of links) { const [x1, y1] = pos(a); const [x2, y2] = pos(b); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
        ctx.globalAlpha = 1;
        const r = cell * 0.3;
        people.forEach((p, k) => {
          const [x, y] = pos(k);
          ctx.fillStyle = C[p.st];
          const rr = p.st === 'i' ? r * (1 + 0.25 * (pulse || 0)) : r;
          ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.29); ctx.fill();
          if (p.st === 'v') { ctx.strokeStyle = C.board; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x - r * 0.1, y + r * 0.4); ctx.lineTo(x + r * 0.5, y - r * 0.4); ctx.stroke(); }
          if (vulnerable.has(k)) { ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 3.5, 0, 6.29); ctx.stroke(); }
        });
      }

      function run(coverage, after) {
        running = true;
        setup(coverage);
        const c0 = count();
        log.textContent = `Generasjon 0: ${c0.i} smittet.`;
        const tick = () => {
          if (ended) return;
          const more = step();
          const c = count();
          if (more) log.textContent = `Generasjon ${gen}: ${c.i} nye smittet.`;
          draw(); updStats();
          if (more && c.i > 0) {
            if (!reduce) { const t0 = performance.now(); const pul = (now) => { if (ended || !running) return; const ph = ((now - t0) % 500) / 500; draw(Math.sin(ph * Math.PI)); raf = requestAnimationFrame(pul); }; cancelAnimationFrame(raf); raf = requestAnimationFrame(pul); }
            timer = setTimeout(tick, reduce ? 150 : 650);
          } else {
            running = false; cancelAnimationFrame(raf); links = []; draw();
            const vulnHit = [...vulnerable].filter((k) => people[k].st === 'r').length;
            const res = { cov: coverage, infected: c.r, vulnHit, susceptibleStart: c0.s + c0.i };
            runs.push(res);
            log.textContent = `Smitten døde ut etter ${gen} generasjoner. ${c.r} ble syke, ${vulnHit} av ${vulnerable.size} sårbare.`;
            api.sfx(c.r > N * 0.3 ? 'bad' : 'good');
            after(res);
          }
        };
        timer = setTimeout(tick, reduce ? 100 : 700);
      }

      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + qTotal }, q), {
          rng,
          onAnswer: (res) => { qTotal++; if (res.correct) qRight++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
      }

      /* ---------- 1. Uten vaksine ---------- */
      function phase1() {
        fit(); setup(0);
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [
          el('div', { html: api.md('**Forsøk 1:** Ingen er vaksinert. To personer er smittet. Trykk for å slippe smitten løs.') }),
          el('button', { class: 'btn primary block', text: 'Start smitten', onclick: (e) => { e.target.disabled = true; api.sfx('click'); run(0, () => phase2()); } }),
        ]));
      }

      /* ---------- 2. Velg dekning, forutsi ---------- */
      function phase2() {
        const first = runs[0];
        stage.innerHTML = '';
        const COV = [0.2, 0.4, 0.6, 0.8, 0.9];
        let chosen = null;
        const go = el('button', { class: 'btn primary block', text: 'Velg dekning først', disabled: true });
        const pick = el('div', { class: 'ss-pick' }, COV.map((x) => el('button', {
          class: 'option', text: Math.round(x * 100) + ' %',
          onclick: (e) => { chosen = x; api.sfx('click'); pick.querySelectorAll('.option').forEach((b) => b.classList.remove('selected')); e.target.classList.add('selected'); go.disabled = false; go.textContent = 'Forutsi og kjør'; },
        })));
        go.onclick = () => predict(chosen);
        stage.append(el('div', { class: 'card stack-s' }, [
          el('div', { html: api.md(`Uten vaksine ble **${first.infected} av ${N}** syke, også ${first.vulnHit} av de sårbare. **Forsøk 2:** Hvor stor andel av byen vil du vaksinere? Vaksinen beskytter den som får den.`) }),
          pick, go,
        ]));
      }

      const PRED = ['Smitten tar av og når de fleste uvaksinerte', 'Noen blir smittet, men det blir ikke et stort utbrudd', 'Smitten dør ut nesten med en gang'];
      let predicted = null;
      function predict(cov) {
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Forutsi før du kjører' }),
          el('div', { html: api.md(`Med **${Math.round(cov * 100)} %** vaksinert og R₀ = ${R0}: hva tror du skjer?`) }),
          ...PRED.map((t, i) => el('button', { class: 'option', text: t, onclick: () => { predicted = i; api.sfx('click'); stage.innerHTML = ''; run(cov, (r) => verdict(r)); } })),
        ]));
      }

      function verdict(r) {
        const unv = Math.max(1, r.susceptibleStart);
        const rate = r.infected / unv;
        const actual = rate > 0.5 ? 0 : rate > 0.12 ? 1 : 2;
        qTotal++; const ok = predicted === actual; if (ok) qRight++; else missed.push('forutsi utbrudd');
        const effR = R0 * (1 - r.cov);
        stage.innerHTML = '';
        stage.append(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
          el('div', { class: 'h-display', text: ok ? 'Godt forutsagt!' : 'Forsøket viste noe annet' }),
          el('div', { class: 'small', html: api.md(`Du tippet: «${PRED[predicted]}».`) }),
          el('div', { html: api.md(`${r.infected} ble syke (${Math.round(rate * 100)} % av de uvaksinerte), ${r.vulnHit} av ${vulnerable.size} sårbare. Med ${Math.round(r.cov * 100)} % vaksinert smitter hver syk i snitt bare **R = R₀ · (1 − andel immune) ≈ ${NG.fmt(effR, 1)}** andre. ` + (effR < 1 ? 'Er R under 1, krymper hver generasjon – smitten dør ut.' : 'Er R over 1, vokser hver generasjon.')) }),
          el('button', { class: 'btn primary block', text: 'Videre', onclick: () => { api.sfx('click'); questions(); } }),
        ]));
      }

      /* ---------- 3. Begrepene ---------- */
      function questions() {
        const list = [
          {
            type: 'num', topic: 'Terskelen', miss: 'terskel 1 − 1/R₀', level: 4, unit: '%', answer: Math.round(threshold * 1000) / 10, abs: 2,
            prompt: `Smitten dør ut når hver syk smitter færre enn én ny: R₀ · (1 − p) < 1. **Hvor stor andel p** (i prosent) må være immune når R₀ = ${R0}?`,
            hint: 'p = 1 − 1/R₀',
            explain: `p = 1 − 1/R₀ = 1 − 1/${R0} ≈ **${NG.fmt(threshold * 100, 1)} %**. Jo mer smittsom sykdommen er, desto høyere dekning trengs. For meslinger (R₀ ≈ 12–18) må over 90 % være immune.`,
          },
          {
            type: 'mc', topic: 'Flokkimmunitet', miss: 'hvem flokkimmunitet beskytter', level: 3,
            prompt: 'Hva betyr **flokkimmunitet**?',
            options: ['Når mange nok er immune, sprer smitten seg så dårlig at også de som ikke er immune blir beskyttet', 'At hele flokken har fått sykdommen og derfor er immun', 'At vaksinen gir beskyttelse til de nærmeste familiemedlemmene dine', 'At immunforsvaret blir sterkere av å være sammen med mange mennesker'],
            answer: 0,
            why: { 1: 'Immunitet kan komme fra sykdom, men poenget er at smitten stopper før den når alle.', 2: 'Vaksinen virker bare i kroppen til den som får den – det er smittekjedene som brytes.', 3: 'Immunforsvaret trenes av antigener, ikke av å være i en flokk.' },
            explain: 'Flokkimmunitet er en effekt på befolkningsnivå: smittekjedene brytes fordi smitten stadig treffer immune personer. Det beskytter de som ikke kan vaksineres – spedbarn og personer med svekket immunforsvar.',
          },
          {
            type: 'mc', topic: 'Vaksine', miss: 'hvordan vaksiner virker', level: 3,
            prompt: 'Hvordan gjør en vaksine kroppen immun?',
            options: ['Den viser immunforsvaret ufarlige deler av smittestoffet, så det lager hukommelsesceller og kan svare raskt senere', 'Den inneholder antistoffer som dreper alle bakterier og virus i kroppen', 'Den gir deg en mild utgave av sykdommen i noen uker', 'Den virker som antibiotika og dreper smittestoffet hvis du blir smittet'],
            answer: 0,
            why: { 1: 'Det er immunforsvaret selv som lager antistoffene – og de er spesifikke for ett smittestoff.', 2: 'De fleste vaksiner gir ikke sykdommen; de gir bare et antigen å øve på.', 3: 'Antibiotika virker på bakterier, ikke virus, og er noe helt annet enn vaksiner.' },
            explain: 'Vaksinen inneholder antigener (svekkede/drepte smittestoffer, deler av dem eller oppskriften på dem). Immunforsvaret lager antistoffer og **hukommelsesceller**, slik at det reagerer raskt og kraftig ved ekte smitte.',
          },
        ];
        if (d >= 2) list.push({
          type: 'tf', topic: 'Antibiotika', miss: 'antibiotika virker ikke på virus', level: 2,
          prompt: 'Antibiotika er et godt middel mot en virusinfeksjon som influensa.',
          answer: false,
          explain: 'Antibiotika virker på bakterier (f.eks. ved å ødelegge celleveggen deres). Virus har ikke slike strukturer. Unødig bruk gir dessuten **antibiotikaresistens** – et stort folkehelseproblem.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true; clearTimeout(timer); cancelAnimationFrame(raf);
        const score = qTotal ? qRight / qTotal : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${qRight} av ${qTotal} riktige` }),
          el('ul', { html: [
            `Uten immunitet sprer smitten seg eksponentielt så lenge **R > 1**.`,
            `Med en andel p immune blir R = R₀ · (1 − p). Terskelen for flokkimmunitet er **p = 1 − 1/R₀** – her ${Math.round(threshold * 100)} %.`,
            'Flokkimmunitet beskytter også dem som **ikke kan vaksineres**.',
            'Modellen er forenklet: ekte vaksiner er ikke 100 % effektive, og folk møter ikke tilfeldige naboer.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: qRight, total: qTotal, notes: `Smittesimulatoren (R₀ = ${R0}): ` + runs.map((r) => `${Math.round(r.cov * 100)} % vaksinert → ${r.infected} syke`).join('; ') + '.' + (missed.length ? ' Bommet på: ' + missed.join(', ') + '.' : '') });
      }

      const onResize = () => { if (!ended) { fit(); draw(); } };
      window.addEventListener('resize', onResize);
      phase1();
      return { destroy() { ended = true; clearTimeout(timer); cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
    },
  });
})();
