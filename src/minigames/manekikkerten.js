/* Mini-spill: Månekikkerten (jorda). Ovenfra ser du sola, jorda og månen i bane. Hvordan ser månen ut fra Norge
   når den står akkurat der? Og omvendt: hvor står månen når den ser slik ut? Avslutter med tidevann og bunden rotasjon. */
(function () {
  'use strict';
  const ID = 'manekikkerten';
  const CX = 160; const CY = 160; const ORB = 112;

  NG.css(`
.mg-manekikkerten .mk-fig { background: #0e1513; border: 1px solid var(--line); border-radius: var(--r-m); padding: 4px; }
.mg-manekikkerten .mk-fig svg { display: block; width: 100%; height: auto; max-height: 50vh; }
.mg-manekikkerten .mk-pick { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.mg-manekikkerten .mk-pick .option { padding: 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mg-manekikkerten .mk-pick svg { width: 100%; max-width: 64px; height: auto; }
.mg-manekikkerten .mk-pick small { font-size: 0.7rem; color: var(--chalk-dim); min-height: 2.2em; text-align: center; line-height: 1.1; }
.mg-manekikkerten .mk-tap { fill: transparent; stroke: var(--warn); stroke-width: 2; stroke-dasharray: 4 4; cursor: pointer; }
.mg-manekikkerten .mk-tap.wrong { stroke: var(--bad); stroke-dasharray: none; }
.mg-manekikkerten .mk-tap.right { stroke: var(--good); stroke-dasharray: none; }
.mg-manekikkerten .mk-moon { transition: transform .7s ease; }
@media (prefers-reduced-motion: reduce) { .mg-manekikkerten .mk-moon { transition: none; } }
.mg-manekikkerten .mk-big { display: flex; justify-content: center; }
.mg-manekikkerten .mk-big svg { width: 96px; height: 96px; }
`);

  const NAMES = { 0: 'Nymåne', 45: 'Voksende månesigd', 90: 'Første kvarter', 135: 'Voksende, nesten full', 180: 'Fullmåne', 225: 'Minkende, nesten full', 270: 'Siste kvarter', 315: 'Minkende månesigd' };

  // Månen slik den ser ut fra den nordlige halvkule. θ = vinkelen sol–jord–måne (0 = nymåne), voksende 0–180.
  function phaseSvg(theta, size) {
    const r = 40; const c = 50;
    const t = ((theta % 360) + 360) % 360;
    const rad = t * Math.PI / 180;
    const rx = Math.abs(Math.cos(rad)) * r;
    const lit = (1 - Math.cos(rad)) / 2;
    const rightLit = t > 0 && t < 180;
    let path = '';
    if (lit > 0.995) path = `<circle cx="${c}" cy="${c}" r="${r}" fill="#f4efd6"/>`;
    else if (lit > 0.005) {
      const crescent = lit < 0.5;
      // halvsirkel på den belyste siden, tilbake langs terminatoren (ellipse)
      const s1 = rightLit ? 1 : 0;
      const s2 = rightLit ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
      path = `<path d="M${c} ${c - r}A${r} ${r} 0 0 ${s1} ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 ${s2} ${c} ${c - r}Z" fill="#f4efd6"/>`;
    }
    return `<svg viewBox="0 0 100 100" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" fill="#2b3431" stroke="#56635e" stroke-width="1.5"/>${path}</svg>`;
  }

  NG.minigames.register({
    id: ID, region: 'jorda', title: 'Månekikkerten', icon: 'moon',
    concepts: ['manefase', 'mane', 'flo-og-fjaere', 'gravitasjon', 'solsystem'],
    blurb: 'Se jorda og månen ovenfra – og finn ut hvordan månen ser ut fra Norge.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let right = 0; let total = 0; const missed = [];
      const NS = 'http://www.w3.org/2000/svg';

      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 320 320');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Jorda og månens bane sett ovenfra nordpolen, med sollys fra høyre');
      let h = '';
      // stjerner (kosmetiske, faste)
      const sr = NG.makeRng(4242);
      for (let i = 0; i < 40; i++) h += `<circle cx="${sr.int(4, 316)}" cy="${sr.int(4, 316)}" r="${sr.next() < 0.2 ? 1.2 : 0.6}" fill="#cfd8d3" opacity="${(0.3 + sr.next() * 0.5).toFixed(2)}"/>`;
      // sollys fra høyre
      for (let y = 36; y <= 284; y += 31) h += `<path d="M314 ${y}h-26m6 -4l-6 4l6 4" stroke="#ffd166" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>`;
      h += '<text x="312" y="20" text-anchor="end" font-size="11" fill="#ffd166" font-family="var(--f-mono)">sollys</text>';
      h += `<circle cx="${CX}" cy="${CY}" r="${ORB}" fill="none" stroke="#56635e" stroke-width="1.5" stroke-dasharray="3 5"/>`;
      h += `<path d="M${CX - 18} ${CY - ORB - 10}a 20 12 0 0 0 -16 10" stroke="var(--chalk-dim)" stroke-width="1.5" fill="none"/><path d="M${CX - 36} ${CY - ORB}l2 -6l4 5" stroke="var(--chalk-dim)" stroke-width="1.5" fill="none"/>`;
      // jorda med dag- og nattside
      h += `<circle cx="${CX}" cy="${CY}" r="26" fill="#1d3b5c"/><path d="M${CX} ${CY - 26}a26 26 0 0 1 0 52z" fill="#4f8fd6"/><circle cx="${CX}" cy="${CY}" r="4" fill="#cfd8d3"/>`;
      h += `<text x="${CX}" y="${CY + 44}" text-anchor="middle" font-size="10" fill="var(--chalk-dim)" font-family="var(--f-mono)">jorda (nordpolen)</text>`;
      h += `<line id="mk-sight" x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY}" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      h += `<g id="mk-moon" class="mk-moon"><circle r="14" fill="#2b3431" stroke="#56635e" stroke-width="1.2"/><path d="M0 -14a14 14 0 0 1 0 28z" fill="#f4efd6"/></g>`;
      h += '<g id="mk-taps"></g>';
      svg.innerHTML = h;
      const moon = svg.querySelector('#mk-moon');
      const sight = svg.querySelector('#mk-sight');
      const taps = svg.querySelector('#mk-taps');
      const xy = (th) => [CX + ORB * Math.cos(th * Math.PI / 180), CY - ORB * Math.sin(th * Math.PI / 180)];
      function placeMoon(th, show) {
        const [x, y] = xy(th);
        moon.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        moon.style.opacity = show === false ? '0' : '1';
        sight.setAttribute('x2', show === false ? CX : x.toFixed(1)); sight.setAttribute('y2', show === false ? CY : y.toFixed(1));
      }

      const stage = el('div', { class: 'stack' });
      const msg = el('div', { class: 'small', 'aria-live': 'polite' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Himmelfjellet · lab' }), el('span', { class: 'chip', text: 'Sett ovenfra' })]),
        el('h2', { class: 'h-display', text: 'Månekikkerten' }),
        el('div', { class: 'small', html: api.md('Figuren viser jorda og månen **ovenfra nordpolen**. Sola er langt ute til høyre. Legg merke til at sola alltid lyser opp *halve* månen – den som vender mot sola.') }),
        el('div', { class: 'mk-fig' }, [svg]),
        msg, stage,
      ]));

      const ANG = [0, 45, 90, 135, 180, 225, 270, 315];
      const nA = d === 1 ? 4 : 3; // runder av typen «hvordan ser den ut?»
      const nB = d === 1 ? 0 : d === 2 ? 2 : 3; // runder av typen «hvor står den?»
      const plan = rng.shuffle(ANG).slice(0, nA).map((a) => ({ k: 'look', a }))
        .concat(rng.shuffle(ANG.filter((a) => a % 90 !== 0 || d >= 3)).slice(0, nB).map((a) => ({ k: 'where', a })));
      let idx = 0;

      function next() {
        if (ended) return;
        taps.innerHTML = '';
        if (idx >= plan.length) { placeMoon(180); questions(); return; }
        const r = plan[idx++];
        (r.k === 'look' ? look : where)(r.a);
      }

      function look(a) {
        placeMoon(a);
        msg.innerHTML = api.md(`**Runde ${idx} av ${plan.length}:** Månen står der den gule linja peker. Hvordan ser den ut fra Norge?`);
        const mirror = (360 - a) % 360;
        const pool = new Set([a]);
        if (mirror !== a) pool.add(mirror);
        pool.add((a + 180) % 360);
        for (const x of rng.shuffle(ANG)) if (pool.size < 4) pool.add(x);
        stage.innerHTML = '';
        const grid = el('div', { class: 'mk-pick' });
        rng.shuffle([...pool]).forEach((x) => {
          const b = el('button', { class: 'option', 'aria-label': NAMES[x], html: phaseSvg(x) + (d === 1 ? `<small>${NAMES[x]}</small>` : '<small></small>'), onclick: () => {
            if (grid.dataset.done) return;
            grid.dataset.done = '1'; total++;
            const ok = x === a;
            if (ok) { right++; api.sfx('good'); b.classList.add('correct'); } else {
              api.sfx('bad'); b.classList.add('wrong'); missed.push(NAMES[a].toLowerCase());
              grid.querySelector(`[aria-label="${NAMES[a]}"]`).classList.add('correct');
            }
            grid.querySelectorAll('small').forEach((sm) => { sm.textContent = sm.parentNode.getAttribute('aria-label'); });
            stage.append(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
              el('div', { html: api.md(`**${NAMES[a]}.** ` + explainLook(a, x)) }),
              el('button', { class: 'btn primary block', text: 'Neste', onclick: () => { api.sfx('click'); next(); } }),
            ]));
          } });
          grid.appendChild(b);
        });
        stage.append(grid);
      }

      function explainLook(a, x) {
        let s;
        if (a === 0) s = 'Månen står mellom jorda og sola: den belyste siden vender bort fra oss.';
        else if (a === 180) s = 'Jorda er mellom sola og månen (men ikke på linje, ellers ble det måneformørkelse): vi ser hele den belyste siden.';
        else if (a < 180) s = 'Månen er på vei fra nymåne mot fullmåne. Vi ser mer og mer av den belyste halvdelen – lyset er på **høyre** side sett fra Norge.';
        else s = 'Månen er på vei fra fullmåne mot nymåne. Lyset er på **venstre** side sett fra Norge.';
        if (x !== a && x === (360 - a) % 360) s += ' Du valgte speilbildet: voksende og minkende måne har lyset på hver sin side.';
        return s;
      }

      function where(a) {
        placeMoon(a, false);
        msg.innerHTML = api.md(`**Runde ${idx} av ${plan.length}:** Fra Norge ser månen slik ut. **Trykk på stedet i banen** der den står.`);
        stage.innerHTML = '';
        stage.append(el('div', { class: 'mk-big' }, [el('div', { html: phaseSvg(a) })]));
        let done = false;
        ANG.forEach((x) => {
          const [px, py] = xy(x);
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); c.setAttribute('r', '19');
          c.setAttribute('class', 'mk-tap'); c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0');
          c.setAttribute('aria-label', 'Posisjon ' + (ANG.indexOf(x) + 1));
          const pick = () => {
            if (done) return; done = true; total++;
            const ok = x === a;
            c.setAttribute('class', 'mk-tap ' + (ok ? 'right' : 'wrong'));
            if (ok) { right++; api.sfx('good'); } else { api.sfx('bad'); missed.push('hvor står ' + NAMES[a].toLowerCase()); taps.querySelectorAll('.mk-tap')[ANG.indexOf(a)].setAttribute('class', 'mk-tap right'); }
            placeMoon(a);
            stage.append(el('div', { class: 'feedback ' + (ok ? 'good' : 'bad') + ' stack-s' }, [
              el('div', { html: api.md(`**${NAMES[a]}.** ` + explainLook(a, a)) }),
              el('button', { class: 'btn primary block', text: 'Neste', onclick: () => { api.sfx('click'); next(); } }),
            ]));
          };
          c.addEventListener('click', pick);
          c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
          taps.appendChild(c);
        });
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

      function questions() {
        msg.textContent = '';
        const list = [
          {
            type: 'mc', topic: 'Månefaser', miss: 'månefaser skyldes ikke jordskyggen', level: 3,
            prompt: 'En elev sier: «Månefasene kommer av at jorda kaster skygge på månen.» Hva er det beste svaret?',
            options: ['Sola lyser alltid opp halve månen; fasen avhenger av hvor mye av den belyste halvdelen vi ser fra jorda', 'Det stemmer – jordskyggen dekker en ulik del av månen hver natt', 'Fasene kommer av at skyer i atmosfæren dekker deler av månen', 'Månen lyser selv, men svakere i noen faser'],
            answer: 0,
            why: { 1: 'Jordskyggen treffer bare månen ved måneformørkelse, og da er det alltid fullmåne. Ved halvmåne peker jordskyggen et helt annet sted.', 2: 'Skyer skjuler månen tilfeldig, ikke i et fast mønster på 29,5 døgn.', 3: 'Månen lyser ikke selv – den reflekterer sollys.' },
            explain: 'Halve månen er alltid belyst. Når månen går i bane rundt jorda, ser vi en større eller mindre del av den belyste halvdelen. Jordskyggen har bare betydning ved **måneformørkelse**.',
          },
          {
            type: 'num', topic: 'Månefaser', miss: 'tid fra nymåne til fullmåne', level: 4, unit: 'døgn', answer: 14.75, abs: 0.4,
            prompt: 'Det tar 29,5 døgn fra en nymåne til den neste. Omtrent hvor mange døgn går det fra **nymåne til fullmåne**?',
            explain: 'Fullmåne er halvveis i syklusen: 29,5 døgn / 2 ≈ **14,8 døgn**. Første kvarter kommer etter omtrent 7,4 døgn.',
          },
          {
            type: 'mc', topic: 'Tidevann', miss: 'to flobølger', level: 3,
            prompt: 'De fleste steder langs norskekysten er det flo **omtrent to ganger i døgnet**. Hvorfor to, og ikke én?',
            options: ['Månens tiltrekning er sterkere på siden nærmest månen og svakere på motsatt side, så havet strekkes ut i to «buler»', 'Det er én flo fra månen og én fra sola', 'Jorda snur seg to ganger i døgnet i forhold til månen', 'Vinden snur to ganger i døgnet og skyver vannet fram og tilbake'],
            answer: 0,
            why: { 1: 'Sola bidrar (spring- og nippflo), men det er forskjellen i tiltrekning som gir to buler – én på hver side.', 2: 'Jorda roterer én gang i døgnet.', 3: 'Vind kan påvirke vannstanden, men tidevannet styres av gravitasjonen.' },
            explain: 'Gravitasjonen fra månen avtar med avstanden. Havet nærmest månen trekkes mer enn jorda, og jorda trekkes mer enn havet på motsatt side. Resultatet er **to flobølger**. Jorda roterer under dem, så vi får to flo og to fjære på ca. 24 t 50 min.',
          },
        ];
        if (d >= 2) list.push({
          type: 'mc', topic: 'Månen', miss: 'bunden rotasjon', level: 4,
          prompt: 'Vi ser alltid den samme siden av månen. Hva betyr det?',
          options: ['Månen roterer én gang om sin egen akse på samme tid som den går én gang rundt jorda', 'Månen roterer ikke i det hele tatt', 'Baksiden av månen er alltid mørk', 'Jorda og månen roterer like fort om sine egne akser'],
          answer: 0,
          why: { 1: 'Uten rotasjon ville vi sett alle sider i løpet av en måned.', 2: 'Baksiden får like mye sollys som forsiden – ved nymåne er det full dag der.', 3: 'Jorda roterer én gang i døgnet, månen én gang i måneden.' },
          explain: '**Bunden rotasjon**: rotasjonstiden er lik omløpstiden (ca. 27 døgn). Tidevannskrefter fra jorda har bremset månens rotasjon over milliarder av år. «Den mørke siden» er en misforståelse – den heter baksiden.',
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
            'Sola lyser alltid opp **halve** månen. Fasen er hvor mye av den belyste halvdelen vi ser.',
            'Nymåne: månen mellom jorda og sola. Fullmåne: jorda mellom sola og månen.',
            'Sett fra Norge er **voksende** måne lys på høyre side, **minkende** på venstre.',
            'Tidevann: forskjellen i månens tiltrekning gir **to** flobølger.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Månekikkerten. ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      next();
      return { destroy() { ended = true; } };
    },
  });
})();
