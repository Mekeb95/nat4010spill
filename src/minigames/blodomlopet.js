/* Mini-spill: Blodomløpet (kropp). Los en rød blodcelle gjennom det doble kretsløpet – stasjon for stasjon –
   og se den skifte farge i lungene. Etterpå: arterie/vene, form og funksjon i hjertet, og minuttvolum. */
(function () {
  'use strict';
  const ID = 'blodomlopet';

  NG.css(`
.mg-blodomlopet .bo-fig { position: relative; background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); padding: 6px; }
.mg-blodomlopet svg { display: block; width: 100%; height: auto; max-height: 52vh; }
.mg-blodomlopet .bo-heart { transform-origin: 160px 165px; animation: bo-beat 1.1s ease-in-out infinite; }
@keyframes bo-beat { 0%, 100% { transform: scale(1); } 12% { transform: scale(1.035); } 24% { transform: scale(0.99); } }
@media (prefers-reduced-motion: reduce) { .mg-blodomlopet .bo-heart { animation: none; } }
.mg-blodomlopet .bo-st { fill: var(--board-3); stroke: var(--chalk-faint); stroke-width: 1.5; }
.mg-blodomlopet .bo-st.on { fill: var(--warn); stroke: var(--warn); }
.mg-blodomlopet .bo-st.done { fill: var(--chalk-dim); }
.mg-blodomlopet .bo-lab { font: 600 9px var(--f-mono); fill: var(--chalk-dim); }
.mg-blodomlopet .bo-ch { font: 700 11px var(--f-mono); fill: var(--chalk); }
.mg-blodomlopet .bo-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-blodomlopet .bo-opts .option { text-align: center; padding: 10px 6px; font-size: var(--t-s); }
.mg-blodomlopet .bo-info { min-height: 3.2em; }
.mg-blodomlopet .bo-legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-blodomlopet .bo-legend i { display: inline-block; width: 14px; height: 4px; border-radius: 2px; vertical-align: middle; margin-right: 4px; }
`);

  const RED = '#ff5a5f';
  const BLUE = '#6aa8ff';
  // Stasjoner i rekkefølge. x/y i SVG-koordinater. Sett forfra: kroppens høyre side er til venstre på figuren.
  const ST = [
    { n: 'Kroppens kapillærer', x: 160, y: 300, info: 'Ute i kroppen avgir blodet O₂ til cellene og tar opp CO₂ – ved diffusjon, fra høy til lav konsentrasjon. Blodet blir oksygenfattig.' },
    { n: 'Hulvenene', x: 55, y: 215, info: 'Venene samler oksygenfattig blod fra hele kroppen og fører det **til** hjertet.' },
    { n: 'Høyre forkammer', x: 130, y: 140, info: 'Forkammeret tar imot blodet. Seilklaffen hindrer at det renner tilbake.' },
    { n: 'Høyre hjertekammer', x: 130, y: 192, info: 'Høyre hjertekammer pumper blodet en kort vei – bare til lungene.' },
    { n: 'Lungearterien', x: 100, y: 100, info: 'En arterie fører blod **bort fra** hjertet – her er blodet likevel oksygenfattig!' },
    { n: 'Lungenes kapillærer', x: 160, y: 48, info: 'I lungeblærene diffunderer CO₂ ut og O₂ inn. Blodet blir oksygenrikt (lyst rødt).' },
    { n: 'Lungevenene', x: 220, y: 100, info: 'Lungevenene fører oksygenrikt blod tilbake **til** hjertet.' },
    { n: 'Venstre forkammer', x: 190, y: 140, info: 'Venstre forkammer tar imot det oksygenrike blodet fra lungene.' },
    { n: 'Venstre hjertekammer', x: 190, y: 192, info: 'Venstre hjertekammer har tykkest muskelvegg: det skal presse blodet ut i hele kroppen.' },
    { n: 'Aorta (hovedpulsåren)', x: 265, y: 215, info: 'Aorta forgrener seg til arterier, så til kapillærer i alle organer.' },
  ];
  // Veipunkter fra stasjon i til i+1
  const WAY = [
    [[160, 300], [55, 300], [55, 215]],
    [[55, 215], [55, 140], [130, 140]],
    [[130, 140], [130, 192]],
    [[130, 192], [145, 170], [145, 120], [100, 120], [100, 100]],
    [[100, 100], [100, 48], [160, 48]],
    [[160, 48], [220, 48], [220, 100]],
    [[220, 100], [220, 122], [190, 140]],
    [[190, 140], [190, 192]],
    [[190, 192], [175, 170], [175, 108], [265, 108], [265, 215]],
    [[265, 215], [265, 300], [160, 300]],
  ];
  // Vanlige feil: fra stasjon -> forlokkende feil neste stasjon
  const LURE = { 1: [7], 2: [7, 8], 3: [9, 8], 4: [6], 6: [2], 8: [4, 3], 9: [1] };
  const oxyAt = (i) => i >= 5; // veistykket fra lungene og fram til kroppen er oksygenrikt

  NG.minigames.register({
    id: ID, region: 'kropp', title: 'Blodomløpet', icon: 'heart',
    concepts: ['sirkulasjon', 'respirasjon', 'form-og-funksjon', 'organsystem'],
    blurb: 'Los en blodcelle gjennom det doble kretsløpet og se hvor den henter oksygen.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
      let ended = false; let raf = 0;
      let at = 0; let steps = 0; let miss = 0; let firstTry = true; let routeOk = 0;
      let qRight = 0; let qTotal = 0; const missed = [];
      const ROUNDS = ST.length; // én hel runde

      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 320 330');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Skisse av det doble kretsløpet: lungene øverst, hjertet med fire rom i midten, kroppen nederst');
      const vessel = (pts, c) => `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;
      let html = '';
      // kapillærnett: lunger og kropp
      html += '<g fill="none" stroke-width="2" opacity=".8">';
      html += `<path d="M118 30q14 -22 30 0t30 0t30 0" stroke="${RED}"/><path d="M118 62q14 22 30 0t30 0t30 0" stroke="${BLUE}"/>`;
      html += `<ellipse cx="96" cy="46" rx="34" ry="30" stroke="var(--chalk-faint)" stroke-width="2.5"/><ellipse cx="224" cy="46" rx="34" ry="30" stroke="var(--chalk-faint)" stroke-width="2.5"/>`;
      html += `<path d="M110 318q12 -22 25 0t25 0t25 0t25 0" stroke="${BLUE}"/><path d="M110 286q12 22 25 0t25 0t25 0t25 0" stroke="${RED}"/>`;
      html += '</g>';
      WAY.forEach((w, i) => { html += vessel(w, oxyAt(i) ? RED : BLUE); });
      // hjertet
      html += `<g class="bo-heart"><rect x="105" y="115" width="110" height="102" rx="26" fill="color-mix(in srgb, var(--r-kropp) 22%, var(--board-2))" stroke="var(--r-kropp)" stroke-width="3.5"/>
        <path d="M160 118v96" stroke="var(--r-kropp)" stroke-width="5" stroke-linecap="round"/><path d="M108 166h104" stroke="var(--r-kropp)" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M215 170v21q0 26 -26 26h-26" fill="none" stroke="var(--r-kropp)" stroke-width="9" stroke-linecap="round"/></g>`;
      html += '<text class="bo-ch" x="118" y="133">HF</text><text class="bo-ch" x="118" y="210">HK</text><text class="bo-ch" x="182" y="133">VF</text><text class="bo-ch" x="182" y="210">VK</text>';
      html += '<text class="bo-lab" x="160" y="12" text-anchor="middle">LUNGENE</text><text class="bo-lab" x="314" y="326" text-anchor="end">KROPPEN</text>';
      ST.forEach((s, i) => { html += `<circle class="bo-st" data-i="${i}" cx="${s.x}" cy="${s.y}" r="5"/>`; });
      html += `<g id="bo-cell"><circle r="8" fill="${BLUE}" stroke="var(--board)" stroke-width="2"/><circle r="3" fill="var(--board)" opacity=".35"/></g>`;
      svg.innerHTML = html;
      const cell = svg.querySelector('#bo-cell');
      const cellDot = cell.firstChild;
      const placeCell = (x, y) => cell.setAttribute('transform', `translate(${x},${y})`);
      placeCell(ST[0].x, ST[0].y);

      const info = el('div', { class: 'small bo-info', 'aria-live': 'polite' });
      const prompt = el('div', { class: 'label' });
      const opts = el('div', { class: 'bo-opts' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Kroppsbyen · lab' }), el('span', { class: 'chip', text: 'Dobbelt kretsløp' })]),
        el('h2', { class: 'h-display', text: 'Blodomløpet' }),
        el('div', { class: 'small', html: api.md('Blodcellen har nettopp levert oksygen ute i kroppen. **Los den én hel runde** – hvor går blodet videre fra hver stasjon?') }),
        el('div', { class: 'bo-fig' }, [svg]),
        el('div', { class: 'bo-legend' }, [
          el('span', { html: `<i style="background:${RED}"></i>oksygenrikt` }), el('span', { html: `<i style="background:${BLUE}"></i>oksygenfattig` }),
          el('span', { text: 'H/V = høyre/venstre (kroppens), F/K = forkammer/hjertekammer' }),
        ]),
        stage,
      ]));
      stage.append(info, prompt, opts);

      function mark() {
        svg.querySelectorAll('.bo-st').forEach((c) => { const i = Number(c.dataset.i); c.classList.toggle('on', i === at); });
      }

      function showStep() {
        mark();
        info.innerHTML = '<strong>' + ST[at].n + ':</strong> ' + api.md(ST[at].info);
        if (steps >= ROUNDS) { setTimeout(questions, reduce ? 50 : 700); opts.innerHTML = ''; prompt.textContent = ''; return; }
        prompt.textContent = 'Hvor går blodet videre fra ' + ST[at].n.toLowerCase() + '?';
        const next = (at + 1) % ST.length;
        const nOpt = d >= 2 ? 4 : 3;
        const pool = new Set([next]);
        for (const l of rng.shuffle(LURE[at] || [])) if (pool.size < nOpt && l !== at) pool.add(l);
        for (const k of rng.shuffle(ST.map((_, i) => i))) if (pool.size < nOpt && k !== at) pool.add(k);
        firstTry = true;
        opts.innerHTML = '';
        rng.shuffle([...pool]).forEach((k) => {
          const b = el('button', { class: 'option', 'data-i': k, text: ST[k].n, onclick: () => choose(k, b) });
          opts.appendChild(b);
        });
      }

      function choose(k, btn) {
        if (ended || opts.classList.contains('busy')) return;
        const next = (at + 1) % ST.length;
        if (k !== next) {
          api.sfx('bad'); miss++; firstTry = false;
          btn.classList.add('wrong'); btn.disabled = true;
          api.toast(wrongWhy(at, k));
          return;
        }
        api.sfx('good');
        if (firstTry) routeOk++;
        btn.classList.add('correct');
        opts.classList.add('busy');
        move(at, () => { opts.classList.remove('busy'); at = next; steps++; if (at === 6) api.sfx('heal'); showStep(); });
      }

      function wrongWhy(from, to) {
        if (from === 3 && to === 9) return 'Høyre hjertekammer pumper til lungene, ikke ut i kroppen.';
        if (from === 8 && (to === 4 || to === 3)) return 'Venstre side pumper oksygenrikt blod ut i kroppen.';
        if ((from === 1 || from === 2) && (to === 7 || to === 8)) return 'Høyre og venstre side av hjertet er skilt av en skillevegg.';
        if (from === 4 && to === 6) return 'Blodet må gjennom lungenes kapillærer før det kommer til venene.';
        if (from === 6 && to === 2) return 'Lungevenene munner ut i venstre forkammer.';
        if (to === (from + ST.length - 1) % ST.length) return 'Klaffene hindrer at blodet renner bakover.';
        return 'Ikke helt – følg blodåren videre.';
      }

      function move(i, cb) {
        const w = WAY[i];
        const turnRed = i === 4; // fra lungearterien inn i lungene
        if (reduce) { const p = w[w.length - 1]; placeCell(p[0], p[1]); if (turnRed) cellDot.setAttribute('fill', RED); if (i === 9) cellDot.setAttribute('fill', BLUE); cb(); return; }
        const segs = []; let len = 0;
        for (let j = 1; j < w.length; j++) { const L = Math.hypot(w[j][0] - w[j - 1][0], w[j][1] - w[j - 1][1]); segs.push(L); len += L; }
        const dur = Math.max(450, len * 5);
        const t0 = performance.now();
        const frame = (now) => {
          if (ended) return;
          const t = Math.min(1, (now - t0) / dur);
          let dist = t * len; let j = 0;
          while (j < segs.length - 1 && dist > segs[j]) { dist -= segs[j]; j++; }
          const f = segs[j] ? dist / segs[j] : 1;
          placeCell(w[j][0] + (w[j + 1][0] - w[j][0]) * f, w[j][1] + (w[j + 1][1] - w[j][1]) * f);
          if (turnRed) cellDot.setAttribute('fill', t > 0.55 ? RED : BLUE);
          if (i === 9) cellDot.setAttribute('fill', t > 0.7 ? BLUE : RED);
          if (t < 1) raf = requestAnimationFrame(frame); else cb();
        };
        raf = requestAnimationFrame(frame);
      }

      /* ---------- Spørsmål etter runden ---------- */
      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + qTotal }, q), {
          rng,
          onAnswer: (res) => { qTotal++; if (res.correct) qRight++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
        setTimeout(() => { try { host.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ } }, 40);
      }

      function questions() {
        if (ended) return;
        const hr = rng.pick([60, 70, 75]); const sv = rng.pick([70, 80]);
        const list = [
          {
            type: 'mc', topic: 'Arterie eller vene?', miss: 'arterie = bort fra hjertet', level: 3,
            prompt: 'Lungearterien fører **oksygenfattig** blod, men heter likevel arterie. Hva avgjør om en blodåre er en arterie?',
            options: ['At den fører blod bort fra hjertet', 'At blodet i den er oksygenrikt', 'At den ligger dypt inne i kroppen', 'At blodet i den er mørkerødt'],
            answer: 0,
            why: { 1: 'Det stemmer for kroppsarteriene, men ikke for lungearterien – og lungevenene fører oksygenrikt blod.', 2: 'Plassering avgjør ikke navnet.', 3: 'Fargen følger oksygeninnholdet, ikke typen blodåre.' },
            explain: 'Arterier fører blod **bort fra** hjertet, vener fører blod **til** hjertet. «Arterier har oksygenrikt blod» stemmer bare i det store kretsløpet.',
          },
          {
            type: 'mc', topic: 'Form og funksjon', miss: 'tykk vegg i venstre kammer', level: 4,
            prompt: 'Muskelveggen i venstre hjertekammer er mye tykkere enn i høyre. Hvorfor?',
            options: ['Den skal presse blodet ut i hele kroppen, mens høyre side bare pumper til lungene', 'Den må pumpe mer blod per slag enn høyre side', 'Oksygenrikt blod er tyngre å pumpe', 'Den trenger mer oksygen fordi den ligger nærmest lungene'],
            answer: 0,
            why: { 1: 'Begge kamrene pumper like mye blod per slag – ellers ville blodet hopet seg opp på den ene siden.', 2: 'Oksygen gjør ikke blodet merkbart tyngre.', 3: 'Plasseringen har ingenting med veggtykkelsen å gjøre.' },
            explain: 'Form følger funksjon: kroppskretsløpet er langt, med mange blodårer og stor motstand, så venstre kammer må lage et mye høyere trykk. Begge kamrene pumper like mye blod per slag.',
          },
        ];
        if (d >= 2) list.push({
          type: 'num', topic: 'Minuttvolum', miss: 'minuttvolum', level: 4, unit: 'L/min', answer: Math.round(hr * sv / 10) / 100, tol: 0.03,
          prompt: `Et hjerte slår ${hr} ganger i minuttet og pumper ${sv} mL blod per slag fra hvert kammer. Hvor mange **liter** pumper venstre kammer per minutt?`,
          hint: 'Slag per minutt · mL per slag, og 1000 mL = 1 L',
          explain: `${hr} · ${sv} mL = ${hr * sv} mL ≈ **${NG.fmt(hr * sv / 1000, 2)} L/min**. En voksen har ca. 5 liter blod, så hele blodmengden går omtrent én runde i minuttet i hvile.`,
        });
        list.push({
          type: 'mc', topic: 'Gassutveksling', miss: 'diffusjon i kapillærene', level: 3,
          prompt: 'I kapillærene i en arbeidende muskel: hvilken vei går O₂ og CO₂, og hvorfor?',
          options: ['O₂ fra blodet til cellene og CO₂ motsatt vei, fordi stoffene diffunderer fra høy til lav konsentrasjon', 'O₂ fra cellene til blodet og CO₂ motsatt vei, fordi cellene lager oksygen', 'Begge går fra blodet til cellene, fordi hjertet presser dem ut', 'Ingen av dem går gjennom veggen; de følger blodet tilbake til lungene'],
          answer: 0,
          why: { 1: 'Cellene bruker O₂ i celleåndingen og lager CO₂ – ikke omvendt.', 2: 'Trykket presser ut væske, men gassene beveger seg ved diffusjon.', 3: 'Kapillærveggen er bare ett cellelag tykk – nettopp for at stoffer skal komme gjennom.' },
          explain: 'Cellene bruker O₂ og lager CO₂ i celleåndingen. Derfor er O₂-konsentrasjonen lav og CO₂-konsentrasjonen høy i vevet, og gassene diffunderer hver sin vei gjennom den tynne kapillærveggen.',
        });
        if (d >= 3) list.push({
          type: 'order', topic: 'Lungekretsløpet', miss: 'rekkefølgen i lungekretsløpet', level: 3,
          prompt: 'Sett det **lille kretsløpet** (lungekretsløpet) i riktig rekkefølge, fra hjertet og tilbake:',
          items: ['Høyre hjertekammer', 'Lungearterien', 'Lungenes kapillærer', 'Lungevenene', 'Venstre forkammer'],
          explain: 'Høyre kammer → lungearterien → kapillærene rundt lungeblærene (gassutveksling) → lungevenene → venstre forkammer. Så starter det store kretsløpet fra venstre kammer.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true; cancelAnimationFrame(raf);
        const routeScore = Math.max(0, routeOk / ROUNDS);
        const score = 0.5 * routeScore + 0.5 * (qTotal ? qRight / qTotal : 0);
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `Ruten: ${routeOk}/${ROUNDS} på første forsøk · spørsmål: ${qRight}/${qTotal}` }),
          el('ul', { html: [
            'Blodet går gjennom hjertet **to ganger** per runde: lungekretsløpet (høyre side) og kroppskretsløpet (venstre side).',
            'Arterier fører blod **bort fra** hjertet, vener **til** hjertet – uansett oksygeninnhold.',
            'Gassutvekslingen skjer i **kapillærene** ved diffusjon.',
            'Venstre kammer har tykkest vegg fordi det må lage høyt trykk – form følger funksjon.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: routeOk + qRight, total: ROUNDS + qTotal, notes: `Blodomløpet: ${miss} feilvalg på ruten.` + (missed.length ? ' Bommet på: ' + missed.join(', ') + '.' : '') });
      }

      showStep();
      return { destroy() { ended = true; cancelAnimationFrame(raf); } };
    },
  });
})();
