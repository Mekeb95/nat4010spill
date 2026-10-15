/* Mini-spill: Strømmåleren (energi). Hvem bruker mest energi – vannkokeren på 2000 W i tre minutter eller lyspæra
   hele døgnet? Skill effekt (W) fra energi (kWh), regn E = P · t, og finn ut hvorfor en varmepumpe ikke jukser. */
(function () {
  'use strict';
  const ID = 'strommaleren';

  NG.css(`
.mg-strommaleren .sm-meter { display: flex; align-items: center; gap: 12px; background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); padding: 8px 12px; }
.mg-strommaleren .sm-meter svg { width: 64px; height: 64px; flex: none; }
.mg-strommaleren .sm-disc { transform-origin: 32px 32px; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .mg-strommaleren .sm-disc { transition: none; } }
.mg-strommaleren .sm-count { font: 600 var(--t-xl) var(--f-mono); letter-spacing: .04em; }
.mg-strommaleren .sm-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-strommaleren .sm-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; text-align: center; }
.mg-strommaleren .sm-card svg { width: 54px; height: 54px; }
.mg-strommaleren .sm-card b { font: 600 var(--t-s) var(--f-mono); }
.mg-strommaleren .sm-card .sm-n { font-weight: 700; }
.mg-strommaleren .sm-bar { height: 14px; border-radius: 7px; background: var(--board-4); overflow: hidden; width: 100%; }
.mg-strommaleren .sm-bar i { display: block; height: 100%; width: 0; background: var(--r-energi); transition: width 1s ease; }
.mg-strommaleren .sm-kwh { font: 600 var(--t-s) var(--f-mono); color: var(--r-energi); min-height: 1.3em; }
`);

  const I = (b) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
  const ICON = {
    vannkoker: I('<path d="M12 40h24l-3-24H15z"/><path d="M33 20c6 0 7 10 1 12"/><path d="M15 16l2-6h14l2 6"/><path d="M20 4v3M28 4v3" stroke-width="2"/>'),
    led: I('<path d="M17 30c-4-3-6-7-6-11a13 13 0 0 1 26 0c0 4-2 8-6 11v5H17z"/><path d="M19 40h10M21 44h6"/><path d="M20 22l4 4 4-4" stroke-width="2"/>'),
    gloede: I('<path d="M17 30c-4-3-6-7-6-11a13 13 0 0 1 26 0c0 4-2 8-6 11v5H17z"/><path d="M19 40h10M21 44h6"/><path d="M20 26c0-6 8-6 8 0" stroke-width="2"/>'),
    ovn: I('<rect x="6" y="12" width="36" height="24" rx="3"/><path d="M14 16v16M22 16v16M30 16v16M38 16v16" stroke-width="2"/><path d="M10 36v5M38 36v5"/>'),
    lader: I('<rect x="15" y="4" width="18" height="30" rx="3"/><path d="M24 34v6c0 4-6 4-6 0"/><path d="M22 14l-3 6h6l-3 6" stroke-width="2"/>'),
    tv: I('<rect x="5" y="9" width="38" height="24" rx="2"/><path d="M18 41h12M24 33v8"/>'),
    kjoleskap: I('<rect x="12" y="4" width="24" height="40" rx="3"/><path d="M12 18h24M17 10v4M17 23v6"/>'),
    stekeovn: I('<rect x="6" y="6" width="36" height="36" rx="3"/><rect x="12" y="16" width="24" height="18" rx="2"/><path d="M12 11h4M20 11h4"/>'),
    foner: I('<path d="M8 14h20a8 8 0 0 1 0 16H22l-4 14h-6l3-14H8z"/><path d="M38 18h6M38 26h6" stroke-width="2"/>'),
    laptop: I('<rect x="10" y="10" width="28" height="20" rx="2"/><path d="M4 36h40l-3 4H7z"/>'),
    stovsuger: I('<circle cx="14" cy="36" r="6"/><path d="M18 32l18-24h4"/><path d="M20 36h20l-2-6H22"/>'),
  };
  const A = {
    vannkoker: { n: 'Vannkoker', p: 2000 }, led: { n: 'LED-pære', p: 8 }, gloede: { n: 'Glødepære', p: 60 }, ovn: { n: 'Panelovn', p: 1000 },
    lader: { n: 'Mobillader', p: 10 }, tv: { n: 'TV', p: 80 }, kjoleskap: { n: 'Kjøleskap (snitt)', p: 100 }, stekeovn: { n: 'Stekeovn', p: 2500 },
    foner: { n: 'Hårføner', p: 1800 }, laptop: { n: 'Bærbar PC', p: 45 }, stovsuger: { n: 'Støvsuger', p: 1500 },
  };
  // [apparat, minutter]
  const PAIRS = [
    [['vannkoker', 3], ['led', 24 * 60]],
    [['ovn', 8 * 60], ['vannkoker', 10]],
    [['lader', 120], ['tv', 180]],
    [['kjoleskap', 24 * 60], ['stekeovn', 30]],
    [['foner', 5], ['laptop', 300]],
    [['stovsuger', 20], ['gloede', 300]],
  ];
  const tTxt = (m) => (m < 60 ? m + ' min' : m % 60 ? NG.fmt(m / 60, 1) + ' timer' : (m / 60) + (m === 60 ? ' time' : ' timer'));
  const kwh = (a, m) => (A[a].p / 1000) * (m / 60);

  NG.minigames.register({
    id: ID, region: 'energi', title: 'Strømmåleren', icon: 'plug',
    concepts: ['effekt', 'kilowattime', 'virkningsgrad', 'varmepumpe', 'energibevaring', 'elektrisk-energi'],
    blurb: 'Vannkoker eller lyspære – hva bruker mest energi? Skill watt fra kilowattimer.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let right = 0; let total = 0; const missed = [];
      let meterKwh = 0;

      const disc = '<g class="sm-disc"><circle cx="32" cy="32" r="22" fill="var(--board-3)" stroke="var(--chalk-dim)" stroke-width="2"/><path d="M32 12v8" stroke="var(--bad)" stroke-width="4" stroke-linecap="round"/></g>';
      const meterSvg = el('div', { html: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="10" fill="var(--board)" stroke="var(--line-strong)" stroke-width="2"/>${disc}</svg>` });
      const count = el('div', { class: 'sm-count', text: '0,00 kWh' });
      const meter = el('div', { class: 'sm-meter', 'aria-live': 'polite' }, [meterSvg, el('div', {}, [el('span', { class: 'label', text: 'Strømmåleren' }), count])]);
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Energidalen · lab' }), el('span', { class: 'chip', text: 'E = P · t' })]),
        el('h2', { class: 'h-display', text: 'Strømmåleren' }),
        meter, stage,
      ]));
      function addMeter(k) {
        meterKwh += k;
        count.textContent = NG.fmt(meterKwh, 2) + ' kWh';
        const g = meterSvg.querySelector('.sm-disc');
        if (g) g.style.transform = `rotate(${Math.round(meterKwh * 720 + 30)}deg)`;
      }

      /* ---------- 1. Hvem bruker mest? ---------- */
      const pairs = rng.shuffle(PAIRS).slice(0, d === 1 ? 3 : 4);
      let pi = 0;
      function pair() {
        if (ended) return;
        if (pi >= pairs.length) { calc(); return; }
        const pr = rng.shuffle(pairs[pi++]);
        const E = pr.map(([a, m]) => kwh(a, m));
        const win = E[0] > E[1] ? 0 : 1;
        stage.innerHTML = '';
        let done = false;
        const cards = pr.map(([a, m], i) => {
          const bar = el('i'); const out = el('div', { class: 'sm-kwh' });
          const b = el('button', { class: 'option sm-card', onclick: () => pick(i) }, [
            el('div', { html: ICON[a] }), el('span', { class: 'sm-n', text: A[a].n }),
            el('b', { text: `${A[a].p} W` }), el('span', { class: 'small', text: tTxt(m) }),
            el('div', { class: 'sm-bar' }, [bar]), out,
          ]);
          b._bar = bar; b._out = out;
          return b;
        });
        function pick(i) {
          if (done) return; done = true; total++;
          const ok = i === win;
          if (ok) { right++; api.sfx('good'); } else { api.sfx('bad'); missed.push(A[pr[win][0]].n.toLowerCase() + ' bruker mer'); }
          const max = Math.max(...E);
          cards.forEach((c, k) => {
            c.classList.add(k === win ? 'correct' : k === i ? 'wrong' : 'dim');
            c._out.textContent = NG.fmt(E[k], E[k] < 0.1 ? 3 : 2) + ' kWh';
            setTimeout(() => { c._bar.style.width = Math.max(3, 100 * E[k] / max) + '%'; }, 30);
          });
          addMeter(E[0] + E[1]);
          const [a, m] = pr[win]; const [b2, m2] = pr[1 - win];
          const highP = A[pr[0][0]].p > A[pr[1][0]].p ? 0 : 1;
          stage.append(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
            el('div', { html: api.md(`E = P · t: ${A[a].n} ${NG.fmt(A[a].p / 1000, 3)} kW · ${NG.fmt(m / 60, 2)} h = **${NG.fmt(E[win], 3)} kWh**, mot ${NG.fmt(E[1 - win], 3)} kWh.` + (highP !== win ? ' Høy **effekt** betyr at energien brukes *raskt* – ikke nødvendigvis at det brukes *mye*. Tiden teller like mye.' : '')) }),
            el('button', { class: 'btn primary block', text: 'Neste', onclick: () => { api.sfx('click'); pair(); } }),
          ]));
        }
        stage.append(
          el('div', { class: 'small', html: api.md(`**${pi} av ${pairs.length}:** Hvilken bruker mest **energi**?` + (d === 1 ? ' Tips: energi = effekt · tid.' : '')) }),
          el('div', { class: 'sm-pair' }, cards),
        );
      }

      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) right++; else missed.push(q.miss); if (res.correct && q.meter) addMeter(q.meter); },
          onContinue: () => after(),
        });
      }

      /* ---------- 2. Regn og forklar ---------- */
      function calc() {
        const P = rng.pick([800, 1000, 1200, 1500]); const h = rng.pick([3, 4, 5, 6]); const price = rng.pick([1.2, 1.5, 2]);
        const need = rng.pick([24, 30, 36]); const cop = rng.pick([3, 4]);
        const list = [
          {
            type: 'num', topic: 'Kilowattime', miss: 'E = P · t i kWh', level: 4, unit: 'kWh', answer: P * h / 1000, tol: 0.01, meter: P * h / 1000,
            prompt: `En panelovn på **${P} W** står på i **${h} timer**. Hvor mye energi bruker den?`,
            hint: d <= 2 ? `${P} W = ${NG.fmt(P / 1000, 1)} kW, og E = P · t` : undefined,
            explain: `E = P · t = ${NG.fmt(P / 1000, 1)} kW · ${h} h = **${NG.fmt(P * h / 1000, 1)} kWh**. Kilowattime er en energienhet: 1 kWh = 1000 W · 3600 s = 3,6 MJ.`,
          },
          {
            type: 'mc', topic: 'Virkningsgrad', miss: 'virkningsgrad i lyspærer', level: 3,
            prompt: 'En glødepære på 60 W og en LED-pære på 8 W gir omtrent like mye lys. Hvor blir det av resten av energien i glødepæra?',
            options: ['Den blir termisk energi – glødepæra er en liten ovn med lav virkningsgrad', 'Den blir borte i ledningene før den når pæra', 'Den lagres i glasset og brukes neste gang du skrur på', 'Glødepæra lager mer usynlig lys som også lyser opp rommet'],
            answer: 0,
            why: { 1: 'Tapet i ledningene er lite. Og energien blir ikke borte – den omdannes.', 2: 'Glass lagrer ikke energi på den måten.', 3: 'Glødepæra sender riktignok ut mye infrarød stråling – men det oppfattes som varme, ikke lys.' },
            explain: `**Virkningsgrad** = nyttig energi / tilført energi. Glødepæra gjør bare noen få prosent om til synlig lys; resten blir varme. Energien er bevart (1. hovedsetning) – men det meste får en form vi ikke ville ha.`,
          },
          {
            type: 'mc', topic: 'Varmepumpe', miss: 'varmepumpa henter energi utenfra', level: 4,
            prompt: `En varmepumpe gir ${cop} kWh varme for hver kWh strøm den bruker. Bryter den loven om energibevaring?`,
            options: ['Nei: den flytter energi fra uteluften inn i huset, og strømmen driver bare flyttingen', 'Ja, men det er tillatt fordi det er fornybar energi', 'Nei: strømmen blir mer verdt når den går gjennom kompressoren', 'Ja: den lager energi av ingenting, derfor er den så effektiv'],
            answer: 0,
            why: { 1: 'Ingen maskin kan bryte energibevaringen, uansett energikilde.', 2: 'Energien blir ikke «mer verdt»; det kommer energi fra et annet sted.', 3: 'Energi kan ikke lages av ingenting (1. hovedsetning).' },
            explain: `Varmepumpa henter ${cop - 1} kWh fra uteluften (som har indre energi selv om den er kald) og bruker 1 kWh strøm til å «pumpe» den opp til høyere temperatur. Totalt ${cop} kWh inn i huset. Energiregnskapet går opp.`,
          },
        ];
        if (d >= 2) list.push({
          type: 'num', topic: 'Varmepumpe', miss: 'strømbehov med varmepumpe', level: 4, unit: 'kWh', answer: Math.round(need / cop * 100) / 100, tol: 0.02,
          prompt: `Et kaldt døgn trenger huset **${need} kWh varme**. Med panelovner trengs ${need} kWh strøm. Hvor mye strøm trengs med en varmepumpe som gir ${cop} kWh varme per kWh strøm?`,
          explain: `${need} kWh / ${cop} = **${NG.fmt(need / cop, 1)} kWh** strøm. Resten, ${NG.fmt(need - need / cop, 1)} kWh, hentes fra uteluften.`,
        });
        if (d >= 3) list.push({
          type: 'num', topic: 'Strømpris', miss: 'kostnad', level: 4, unit: 'kr', answer: Math.round(P * h / 1000 * price * 100) / 100, tol: 0.01,
          prompt: `Panelovnen på ${P} W står på i ${h} timer. Strømmen koster ${NG.fmt(price, 2)} kr/kWh. Hva koster det?`,
          explain: `${NG.fmt(P * h / 1000, 1)} kWh · ${NG.fmt(price, 2)} kr/kWh = **${NG.fmt(P * h / 1000 * price, 2)} kr**. Vi betaler for energi (kWh), ikke for effekt (W).`,
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
            '**Effekt** (W) er hvor *raskt* energi omdannes. **Energi** (kWh, J) er hvor *mye*.',
            '**E = P · t.** 1 kWh er 1000 W i én time.',
            '**Virkningsgrad** = nyttig energi / tilført energi. Resten blir som regel varme.',
            'En varmepumpe flytter energi fra uteluften – den bryter ikke energibevaringen.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Strømmåleren. ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      pair();
      return { destroy() { ended = true; } };
    },
  });
})();
