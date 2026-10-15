/* Mini-spill: Matpakkereisen (kropp). Følg en bit av matpakka gjennom fordøyelseskanalen. På hver stasjon
   bestemmer du hva som skjer, og ser stivelse, protein og fett brytes ned til små byggesteiner som tas opp i blodet. */
(function () {
  'use strict';
  const ID = 'matpakkereisen';

  NG.css(`
.mg-matpakkereisen .mp-top { display: grid; grid-template-columns: 44% 1fr; gap: 8px; align-items: start; }
.mg-matpakkereisen .mp-body, .mg-matpakkereisen .mp-mol { background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); padding: 6px; }
.mg-matpakkereisen svg { display: block; width: 100%; height: auto; }
.mg-matpakkereisen .mp-st { fill: var(--board-3); stroke: var(--chalk-faint); stroke-width: 2; transition: fill .3s; }
.mg-matpakkereisen .mp-st.on { fill: var(--warn); stroke: var(--warn); }
.mg-matpakkereisen .mp-st.done { fill: var(--good); stroke: var(--good); }
.mg-matpakkereisen .mp-row { display: grid; grid-template-columns: 64px 1fr; align-items: center; gap: 4px; font-size: var(--t-xs); }
.mg-matpakkereisen .mp-row span { color: var(--chalk-dim); line-height: 1.15; }
.mg-matpakkereisen .mp-row svg { height: 26px; }
.mg-matpakkereisen .mp-state { font: 600 var(--t-xs) var(--f-mono); color: var(--chalk); text-align: center; min-height: 2.4em; padding-top: 4px; }
.mg-matpakkereisen .mp-blood { font: 600 var(--t-xs) var(--f-mono); color: var(--bad); text-align: center; }
.mg-matpakkereisen .mp-piece { transition: transform .6s ease, opacity .6s ease; }
@media (prefers-reduced-motion: reduce) { .mg-matpakkereisen .mp-piece, .mg-matpakkereisen .mp-st { transition: none; } }
`);

  // Stasjoner langs kanalen (SVG 0 0 140 300)
  const ST = [
    { n: 'Munnen', x: 70, y: 30 },
    { n: 'Spiserøret', x: 70, y: 80 },
    { n: 'Magesekken', x: 86, y: 128 },
    { n: 'Tynntarmen', x: 70, y: 196 },
    { n: 'Tykktarmen', x: 30, y: 230 },
  ];
  const NUT = [
    { k: 'stivelse', n: 'Stivelse', c: '#ffd166', end: 'glukose' },
    { k: 'protein', n: 'Protein', c: '#ff8fa6', end: 'aminosyrer' },
    { k: 'fett', n: 'Fett', c: '#7cc8ff', end: 'fettsyrer, glyserol' },
    { k: 'fiber', n: 'Kostfiber', c: '#93df84', end: 'til tykktarmen' },
  ];

  NG.minigames.register({
    id: ID, region: 'kropp', title: 'Matpakkereisen', icon: 'apple',
    concepts: ['fordoyelse', 'kroppens-energi', 'organsystem', 'form-og-funksjon'],
    blurb: 'Følg en bit av matpakka fra munnen til tarmen – og se næringsstoffene brytes ned til byggesteiner.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let qRight = 0; let qTotal = 0; const missed = [];
      // nedbrytingsgrad per næringsstoff: 0 = lang kjede / stor dråpe, 1 = delvis, 2 = byggesteiner, 3 = tatt opp i blodet
      const lvl = { stivelse: 0, protein: 0, fett: 0, fiber: 0 };
      let at = -1;

      const NS = 'http://www.w3.org/2000/svg';
      const body = document.createElementNS(NS, 'svg');
      body.setAttribute('viewBox', '0 0 140 300');
      body.setAttribute('role', 'img');
      body.setAttribute('aria-label', 'Fordøyelseskanalen fra munnen via spiserøret og magesekken til tynntarmen og tykktarmen');
      body.innerHTML = `
        <path d="M70 6c-22 0 -30 14 -30 26s10 22 30 22s30 -10 30 -22s-8 -26 -30 -26z" fill="none" stroke="var(--chalk-faint)" stroke-width="2"/>
        <path d="M70 46v62" stroke="var(--r-kropp)" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>
        <path d="M70 108c0 -6 30 -10 34 8s-8 34 -34 32c-14 -1 -14 -14 -4 -16" fill="color-mix(in srgb, var(--r-kropp) 25%, transparent)" stroke="var(--r-kropp)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M44 162h52M44 162c-8 0 -8 12 0 12h52c8 0 8 12 0 12h-52c-8 0 -8 12 0 12h52c8 0 8 12 0 12h-52c-8 0 -8 12 0 12h40" fill="none" stroke="var(--r-kropp)" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        <path d="M84 234h24v-82h-84v100h46v32" fill="none" stroke="color-mix(in srgb, var(--r-kropp) 60%, var(--chalk))" stroke-width="9" stroke-linejoin="round" opacity=".55"/>
        <path d="M112 112c10 -10 24 -2 22 10s-18 12 -24 4z" fill="color-mix(in srgb, var(--r-liv) 25%, transparent)" stroke="var(--r-liv)" stroke-width="2.5"/>
        <text x="122" y="104" font-size="8" fill="var(--chalk-dim)" text-anchor="middle" font-family="var(--f-mono)">lever</text>
        <path d="M92 152c8 -2 20 -2 30 2" stroke="var(--warn)" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>
        <text x="112" y="146" font-size="7" fill="var(--chalk-dim)" text-anchor="middle" font-family="var(--f-mono)">bukspytt</text>
        ${ST.map((s, i) => `<circle class="mp-st" data-i="${i}" cx="${s.x}" cy="${s.y}" r="6"/>`).join('')}
        <g id="mp-bite" class="mp-piece"><circle r="9" fill="var(--gold)" stroke="var(--board)" stroke-width="2"/><path d="M-4 -2h8M-3 2h6" stroke="var(--board)" stroke-width="1.6"/></g>`;
      const bite = body.querySelector('#mp-bite');
      const moveBite = (x, y, s) => bite.setAttribute('transform', `translate(${x},${y}) scale(${s || 1})`);
      moveBite(70, 30, 1.25);

      const molBox = el('div', { class: 'mp-mol stack-s' });
      const stateTxt = el('div', { class: 'mp-state', 'aria-live': 'polite', text: 'Matpakke: brød med egg' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Kroppsbyen · lab' }), el('span', { class: 'chip', text: 'Fordøyelse' })]),
        el('h2', { class: 'h-display', text: 'Matpakkereisen' }),
        el('div', { class: 'small', html: api.md('Du tar en bit av brødskiva med egg. Følg biten gjennom kroppen: **hva skjer på hver stasjon?** Til høyre ser du næringsstoffene.') }),
        el('div', { class: 'mp-top' }, [el('div', { class: 'mp-body' }, [body]), el('div', { class: 'stack-s' }, [molBox, stateTxt])]),
        stage,
      ]));

      // Tegn næringsstoffene som kjeder/dråper etter nedbrytingsgrad
      function molSvg(nut, L) {
        const c = nut.c; let g = '';
        const bead = (x, y, r, sh) => (sh === 'hex'
          ? `<polygon class="mp-piece" points="${[0, 1, 2, 3, 4, 5].map((k) => (x + r * Math.cos(k * Math.PI / 3)).toFixed(1) + ',' + (y + r * Math.sin(k * Math.PI / 3)).toFixed(1)).join(' ')}" fill="${c}"/>`
          : `<circle class="mp-piece" cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`);
        if (nut.k === 'fett') {
          if (L === 0) g = `<ellipse cx="60" cy="13" rx="28" ry="10" fill="${c}"/>`;
          else if (L === 1) g = [20, 44, 68, 92].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 9 : 16}" r="6" fill="${c}"/>`).join('');
          else if (L === 2) g = [10, 34, 58, 82].map((x) => `<path d="M${x} 13h18" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`).join('') + `<path d="M108 6v14" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
        } else if (nut.k === 'fiber') {
          g = L >= 3 ? '' : `<path d="M6 13q10 -10 20 0t20 0t20 0t20 0t20 0" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        } else {
          const sh = nut.k === 'stivelse' ? 'hex' : 'circle';
          const n = 8;
          for (let i = 0; i < n; i++) {
            const gap = L === 0 ? 0 : L === 1 ? (i % 3 === 0 ? 7 : 0) : 8;
            const x = 8 + i * 12 + (L === 0 ? 0 : L === 1 ? Math.floor(i / 3) * 7 : i * 2) - (L === 2 ? 6 : 0);
            if (L < 2 && i > 0 && gap === 0) g += `<path d="M${x - 12 + 5} 13h7" stroke="${c}" stroke-width="2"/>`;
            g += bead(x, L === 2 ? (i % 2 ? 8 : 18) : 13, 5, sh);
          }
        }
        return `<svg viewBox="0 0 130 26" aria-hidden="true">${g}</svg>`;
      }
      function drawMol() {
        molBox.innerHTML = '';
        for (const nut of NUT) {
          const L = lvl[nut.k];
          const label = L >= 3 ? (nut.k === 'fiber' ? 'tarmbakterier' : nut.end) : L === 2 ? nut.end : nut.n;
          molBox.appendChild(el('div', { class: 'mp-row' }, [el('span', { text: label }), el('div', { html: L >= 3 && nut.k !== 'fiber' ? '<div class="mp-blood">→ blodet</div>' : molSvg(nut, L) })]));
        }
      }

      function mark() { body.querySelectorAll('.mp-st').forEach((c) => { const i = Number(c.dataset.i); c.classList.toggle('on', i === at); c.classList.toggle('done', i < at); }); }

      const STATIONS = [
        {
          q: {
            type: 'mc', topic: 'Munnen', level: 2, miss: 'amylase i spyttet',
            prompt: '**Munnen.** Hva skjer med biten her?',
            options: ['Tennene deler den opp, og enzymet amylase i spyttet begynner å bryte ned stivelse', 'Spyttet bryter ned fettet til fettsyrer', 'Proteinene i egget brytes ned til aminosyrer', 'Næringsstoffene tas opp i blodet gjennom tunga'],
            answer: 0,
            why: { 1: 'Spyttet inneholder nesten ikke fettspaltende enzymer; fettet brytes ned i tynntarmen.', 2: 'Proteinnedbrytingen starter i magesekken.', 3: 'Opptaket skjer i tynntarmen, der overflaten er enorm.' },
            explain: 'Tygging er **mekanisk** nedbryting (større overflate), og amylase i spyttet starter den **kjemiske** nedbrytingen av stivelse. Tygg lenge på en brødbit, så kjenner du at den smaker søtere!',
          },
          after: () => { lvl.stivelse = 1; stateTxt.textContent = 'Biten er tygget: stivelsen kuttes i kortere kjeder.'; },
        },
        {
          q: {
            type: 'tf', topic: 'Spiserøret', level: 2, miss: 'peristaltikk',
            prompt: '**Spiserøret.** Påstand: Maten skyves ned av bølger av muskelsammentrekninger – du kan svelge selv om du står på hodet.',
            answer: true,
            explain: 'Glatt muskulatur i veggen trekker seg sammen i bølger bak matbiten (**peristaltikk**). Tyngdekraften trengs ikke. Det samme skjer videre i hele tarmen.',
          },
          after: () => { stateTxt.textContent = 'Muskelbølger skyver biten ned til magesekken.'; },
        },
        {
          q: {
            type: 'mc', topic: 'Magesekken', level: 3, miss: 'magesekkens oppgave',
            prompt: '**Magesekken.** Hva er det viktigste som skjer her?',
            options: ['Saltsyre dreper mange mikrober, og enzymet pepsin begynner å bryte ned proteiner', 'Det meste av næringsstoffene tas opp i blodet', 'Stivelsen brytes helt ned til glukose', 'Fettet forbrennes og varmer opp kroppen'],
            answer: 0,
            why: { 1: 'Magesekken tar opp lite (litt vann og alkohol). Opptaket skjer i tynntarmen.', 2: 'Amylasen fra spyttet slutter å virke i det sure miljøet. Stivelsen brytes ferdig ned i tynntarmen.', 3: 'Energien frigjøres i cellene i celleåndingen, ikke i magen.' },
            explain: 'Magesaften er svært sur (pH ca. 1–2). Syra dreper mange mikrober og gjør at **pepsin** kan begynne å kutte proteinkjedene. Magen elter maten til en tyktflytende grøt.',
          },
          after: () => { lvl.protein = 1; stateTxt.textContent = 'Pepsin kutter proteinkjedene i biter.'; },
        },
        {
          q: {
            type: 'multi', topic: 'Tynntarmen', level: 3, miss: 'galle og bukspytt',
            prompt: '**Tynntarmen.** Hva skjer her?',
            options: ['Enzymer fra bukspyttkjertelen bryter ned karbohydrater, proteiner og fett', 'Galle fra leveren deler fettet i små dråper, så enzymene kommer til', 'Små molekyler tas opp gjennom tarmtottene og inn i blodet og lymfen', 'Kroppens egne enzymer bryter ned kostfiberen til glukose', ...(d >= 2 ? ['Gallen er et enzym som spalter fett til fettsyrer'] : [])],
            answer: [0, 1, 2],
            explain: 'Tynntarmen er hovedstedet for både nedbryting og opptak. Gallen er **ikke** et enzym: den emulgerer fettet (små dråper = stor overflate). Tarmtottene gir en enorm overflate – form følger funksjon. Kostfiber kan ikke brytes ned av våre enzymer.',
          },
          after: () => {
            lvl.stivelse = 2; lvl.protein = 2; lvl.fett = 1; stateTxt.textContent = 'Galle emulgerer fettet; enzymer bryter ned alt til byggesteiner …';
            setTimeout(() => { if (ended) return; lvl.fett = 2; drawMol(); }, 700);
            setTimeout(() => { if (ended) return; lvl.stivelse = 3; lvl.protein = 3; lvl.fett = 3; stateTxt.textContent = 'Glukose, aminosyrer, fettsyrer og glyserol tas opp i tarmtottene.'; drawMol(); api.sfx('heal'); }, 1500);
          },
        },
        {
          q: {
            type: 'mc', topic: 'Tykktarmen', level: 3, miss: 'tykktarmen og kostfiber',
            prompt: '**Tykktarmen.** Det som er igjen, er mest vann og kostfiber. Hva skjer?',
            options: ['Vann tas opp, og tarmbakterier bryter ned noe av kostfiberen', 'Proteinene brytes ned til aminosyrer', 'Det meste av glukosen tas opp her', 'Restene gjøres om til fett som lagres i kroppen'],
            answer: 0,
            why: { 1: 'Proteinene er allerede brutt ned og tatt opp i tynntarmen.', 2: 'Glukosen er allerede tatt opp i tynntarmen.', 3: 'Fett lagres i fettvev etter at næringsstoffene er fraktet med blodet – ikke i tarmen.' },
            explain: 'Tykktarmen tar opp vann og salter. Milliarder av **tarmbakterier** bryter ned noe av kostfiberen (og lager blant annet gasser). Resten skilles ut som avføring.',
          },
          after: () => { lvl.fiber = 3; stateTxt.textContent = 'Vann tas opp; tarmbakterier jobber med fiberen.'; },
        },
      ];

      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + qTotal }, q), {
          rng,
          onAnswer: (res) => { qTotal++; if (res.correct) qRight++; else missed.push(q.miss); if (q.onAns) q.onAns(res); },
          onContinue: () => after(),
        });
      }

      function nextStation() {
        if (ended) return;
        at++;
        if (at >= STATIONS.length) { mark(); wrapUp(); return; }
        const s = ST[at];
        moveBite(s.x, s.y, Math.max(0.55, 1.2 - at * 0.15));
        mark();
        const st = STATIONS[at];
        ask(Object.assign({}, st.q, { onAns: () => { st.after(); drawMol(); } }), nextStation);
      }

      function wrapUp() {
        bite.style.opacity = '0';
        const kh = rng.pick([25, 30, 35]); const pr = rng.pick([8, 10, 12]); const ft = rng.pick([6, 8, 10]);
        const kj = kh * 17 + pr * 17 + ft * 37;
        const list = [
          {
            type: 'mc', topic: 'Kroppens energi', miss: 'energien frigjøres i cellene', level: 4,
            prompt: 'Glukosen fra brødskiva er nå i blodet. **Hvor** blir energien i den frigjort, slik at musklene kan bruke den?',
            options: ['I cellene, i celleåndingen: glukose + oksygen → karbondioksid + vann', 'I magesekken, når maten fordøyes', 'I blodet, når glukosen løses opp', 'I tarmen, når tarmbakteriene bryter ned maten'],
            answer: 0,
            why: { 1: 'Fordøyelsen deler store molekyler i små, men frigjør nesten ingen energi som kroppen kan bruke.', 2: 'Å løses i blodet er transport, ikke energifrigjøring.', 3: 'Tarmbakteriene bruker mest energien selv.' },
            explain: 'Fordøyelsen gjør store molekyler så små at de kommer gjennom tarmveggen. Selve energien frigjøres i **cellene** – i mitokondriene – i celleåndingen, der glukose reagerer med oksygen. Derfor trenger vi både mat og pust.',
          },
          {
            type: 'mc', topic: 'Hvorfor fordøye?', miss: 'små molekyler gjennom tarmveggen', level: 3,
            prompt: 'Hvorfor må stivelse, proteiner og fett brytes ned før de kan brukes?',
            options: ['Molekylene er for store til å komme gjennom tarmveggen og inn i blodet', 'Fordi kroppen bare tåler flytende mat', 'For at maten skal bli varm nok til å gi energi', 'For at magen skal få plass til mer mat'],
            answer: 0,
            why: { 1: 'Maten blir riktignok grøtaktig, men det er molekylstørrelsen som teller.', 2: 'Temperaturen har ingenting med energiinnholdet å gjøre.', 3: 'Det handler om opptak, ikke plass.' },
            explain: 'Store molekyler må deles i **byggesteiner** – glukose, aminosyrer, fettsyrer og glyserol – som er små nok til å tas opp. Kroppen bygger så sine egne molekyler av dem eller bruker dem som energikilde.',
          },
        ];
        if (d >= 2) list.push({
          type: 'num', topic: 'Energiinnhold', miss: 'energiinnhold i næringsstoffer', level: 4, unit: 'kJ', answer: kj, tol: 0.02,
          prompt: `Matpakka inneholder ${kh} g karbohydrater, ${pr} g protein og ${ft} g fett. Karbohydrater og protein gir 17 kJ/g, fett 37 kJ/g. Hvor mye energi inneholder matpakka?`,
          hint: 'Gang hver mengde med energiverdien og legg sammen',
          explain: `${kh} · 17 + ${pr} · 17 + ${ft} · 37 = ${kh * 17} + ${pr * 17} + ${ft * 37} = **${kj} kJ**. Fett gir over dobbelt så mye energi per gram.`,
        });
        if (d >= 3) list.push({
          type: 'sort', topic: 'Byggesteiner', miss: 'byggesteiner', level: 2,
          prompt: 'Hvilken byggestein ender næringsstoffet som?',
          buckets: ['Glukose', 'Aminosyrer', 'Fettsyrer og glyserol'],
          items: [{ t: 'Stivelse i poteter', b: 0 }, { t: 'Protein i kjøtt', b: 1 }, { t: 'Fett i olivenolje', b: 2 }, { t: 'Stivelse i ris', b: 0 }, { t: 'Protein i bønner', b: 1 }, { t: 'Fett i smør', b: 2 }],
          explain: 'Karbohydrater → glukose (og andre enkle sukkerarter), proteiner → aminosyrer, fett → fettsyrer og glyserol.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true;
        const score = qTotal ? qRight / qTotal : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `Fremme! ${qRight} av ${qTotal} riktige` }),
          el('ul', { html: [
            'Fordøyelsen er **mekanisk** (tygging, elting) og **kjemisk** (enzymer).',
            'Munnen: amylase → stivelse. Magesekken: syre og pepsin → protein. Tynntarmen: bukspytt og galle → alt, og **opptak** gjennom tarmtottene.',
            'Tykktarmen tar opp vann; tarmbakterier bryter ned noe kostfiber.',
            'Energien frigjøres ikke i magen, men i **cellene** (celleånding).',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: qRight, total: qTotal, notes: 'Matpakkereisen. ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      drawMol();
      stage.append(el('button', { class: 'btn primary block', text: 'Ta en bit', onclick: () => { api.sfx('click'); nextStation(); } }));
      return { destroy() { ended = true; } };
    },
  });
})();
