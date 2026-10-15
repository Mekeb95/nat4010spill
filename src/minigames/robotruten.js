/* Mini-spill: Robotruten (teknologi). Programmer en robot med blokker: først en sekvens, så en løkke (gjenta),
   og til slutt feilsøking av et program som nesten virker. Algoritmisk tenkning: presise steg, mønstre og testing. */
(function () {
  'use strict';
  const ID = 'robotruten';
  const N = 6; const CELL = 50;
  const DX = [0, 1, 0, -1]; const DY = [-1, 0, 1, 0]; // 0 = nord, 1 = øst, 2 = sør, 3 = vest

  NG.css(`
.mg-robotruten .rr-board { background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); padding: 6px; }
.mg-robotruten .rr-board svg { display: block; width: 100%; height: auto; max-height: 46vh; }
.mg-robotruten .rr-robot { transition: transform .32s ease; }
@media (prefers-reduced-motion: reduce) { .mg-robotruten .rr-robot { transition: none; } }
.mg-robotruten .rr-pal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.mg-robotruten .rr-pal .btn { padding: 8px 4px; font-size: var(--t-s); }
.mg-robotruten .rr-prog { display: flex; flex-wrap: wrap; gap: 5px; min-height: 52px; padding: 8px; border: 2px dashed var(--line-strong); border-radius: var(--r-m); align-items: center; }
.mg-robotruten .rr-prog.loop { border-color: var(--r-teknologi); border-style: solid; }
.mg-robotruten .rr-blk { min-width: 44px; min-height: 44px; border-radius: 10px; border: 1px solid var(--line-strong); background: var(--board-3); color: var(--chalk); font: 700 var(--t-l) var(--f-mono); display: inline-flex; align-items: center; justify-content: center; }
.mg-robotruten .rr-blk.now { background: var(--warn); color: var(--board); }
.mg-robotruten .rr-blk.bug { border-color: var(--bad); }
.mg-robotruten .rr-empty { color: var(--chalk-faint); font-size: var(--t-s); }
.mg-robotruten .rr-rep { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font: 600 var(--t-s) var(--f-mono); }
.mg-robotruten .rr-rep button { min-width: 48px; min-height: 44px; border-radius: 10px; border: 1px solid var(--line-strong); background: var(--board-3); color: var(--chalk); font: 600 var(--t-s) var(--f-mono); }
.mg-robotruten .rr-rep button.sel { background: var(--r-teknologi); color: var(--board); }
`);

  const SYM = { F: '↑', L: '↺', R: '↻' };
  const NAME = { F: 'frem', L: 'venstre', R: 'høyre' };

  // Baner: start {x,y,dir}, mål, steiner, (løsning for feilsøking)
  const MAPS1 = [
    { s: [0, 5, 0], g: [4, 1], rocks: [[0, 2], [1, 2], [2, 4], [3, 4], [3, 1], [5, 3]] },
    { s: [0, 0, 1], g: [5, 5], rocks: [[3, 0], [4, 2], [1, 3], [2, 4], [0, 5]] },
  ];
  const MAP2 = { s: [0, 5, 1], rocks: [[2, 5], [3, 4], [0, 4], [1, 3], [2, 2], [5, 2], [4, 4]] };
  const MAP3 = { s: [0, 5, 0], g: [5, 0], rocks: [[1, 3], [2, 1], [3, 4], [4, 2], [5, 4]], sol: 'FFFRFFFLFFRFF' };

  NG.minigames.register({
    id: ID, region: 'teknologi', title: 'Robotruten', icon: 'robot',
    concepts: ['tek-algoritme', 'tek-sekvens', 'tek-lokke', 'tek-feilsoking'],
    blurb: 'Programmer roboten fram til flagget – med sekvens, løkke og litt feilsøking.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
      let ended = false; let timer = 0;
      let right = 0; let total = 0; const missed = []; const notes = [];
      const mirror = rng.chance(0.5);
      const mx = (p) => (mirror ? [N - 1 - p[0], p[1]] : p);
      const mdir = (dir) => (mirror && (dir === 1 || dir === 3) ? 4 - dir : dir);
      const mturn = (c) => (mirror ? (c === 'L' ? 'R' : c === 'R' ? 'L' : c) : c);

      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${N * CELL} ${N * CELL}`);
      svg.setAttribute('role', 'img');
      const board = el('div', { class: 'rr-board' }, [svg]);
      const status = el('div', { class: 'small', 'aria-live': 'polite' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Verkstedet · lab' }), el('span', { class: 'chip', text: 'Algoritmer' })]),
        el('h2', { class: 'h-display', text: 'Robotruten' }),
        board, status, stage,
      ]));

      let level = null; // { start, goal, rocks:Set }
      const key = (x, y) => x + ',' + y;
      function drawBoard(lv) {
        let h = '';
        for (let i = 0; i <= N; i++) h += `<path d="M${i * CELL} 0V${N * CELL}M0 ${i * CELL}H${N * CELL}" stroke="var(--line)" stroke-width="1"/>`;
        for (const r of lv.rocks) {
          const [x, y] = r.split(',').map(Number);
          h += `<path d="M${x * CELL + 9} ${y * CELL + 38}l6 -22l14 -8l13 10l2 20z" fill="var(--board-4)" stroke="var(--chalk-faint)" stroke-width="2.5" stroke-linejoin="round"/>`;
        }
        const [gx, gy] = lv.goal;
        h += `<g transform="translate(${gx * CELL},${gy * CELL})"><path d="M16 42V9" stroke="var(--chalk)" stroke-width="3" stroke-linecap="round"/><path d="M17 10h20l-5 7l5 7h-20z" fill="var(--good)"/></g>`;
        h += '<g id="rr-trail"></g>';
        h += `<g id="rr-robot" class="rr-robot"><g id="rr-rot" class="rr-robot"><rect x="-15" y="-15" width="30" height="30" rx="8" fill="var(--r-teknologi)" stroke="var(--board)" stroke-width="2"/><path d="M-7 -6h14l-7 -9z" fill="var(--board)"/><circle cx="-6" cy="4" r="3" fill="var(--board)"/><circle cx="6" cy="4" r="3" fill="var(--board)"/></g></g>`;
        svg.innerHTML = h;
        svg.setAttribute('aria-label', `Rutenett ${N} ganger ${N}. Roboten står i kolonne ${lv.start[0] + 1}, rad ${lv.start[1] + 1}. Flagget er i kolonne ${gx + 1}, rad ${gy + 1}.`);
      }
      let rot = 0;
      function placeRobot(x, y, dir, instant) {
        const r = svg.querySelector('#rr-robot'); const rr = svg.querySelector('#rr-rot');
        // korteste vei rundt ved sving
        const target = dir * 90; let delta = ((target - rot) % 360 + 540) % 360 - 180; rot += delta;
        if (instant) { r.style.transition = 'none'; rr.style.transition = 'none'; }
        r.setAttribute('transform', `translate(${x * CELL + CELL / 2},${y * CELL + CELL / 2})`);
        rr.style.transform = `rotate(${rot}deg)`;
        if (instant) { void r.getBoundingClientRect(); r.style.transition = ''; rr.style.transition = ''; }
      }
      function trailDot(x, y) { const g = svg.querySelector('#rr-trail'); g.insertAdjacentHTML('beforeend', `<circle cx="${x * CELL + CELL / 2}" cy="${y * CELL + CELL / 2}" r="4" fill="var(--r-teknologi)" opacity=".5"/>`); }

      function setLevel(raw) {
        const s = mx(raw.s); const g = mx(raw.g);
        level = { start: [s[0], s[1], mdir(raw.s[2])], goal: g, rocks: new Set(raw.rocks.map((p) => key(...mx(p)))) };
        rot = level.start[2] * 90;
        drawBoard(level); placeRobot(...level.start, true);
      }

      // Kjører en liste med kommandoer. Returnerer via cb({ ok, crash, steps })
      function execute(cmds, progEl, cb) {
        let [x, y, dir] = level.start;
        placeRobot(x, y, dir, true);
        svg.querySelector('#rr-trail').innerHTML = '';
        trailDot(x, y);
        let i = 0;
        const blks = progEl ? progEl.querySelectorAll('.rr-blk') : [];
        const tick = () => {
          if (ended) return;
          blks.forEach((b) => b.classList.remove('now'));
          if (i >= cmds.length) { cb({ ok: false, steps: i }); return; }
          const c = cmds[i];
          const bi = c.bi != null ? c.bi : i; if (blks[bi]) blks[bi].classList.add('now');
          if (c.c === 'L') dir = (dir + 3) % 4;
          else if (c.c === 'R') dir = (dir + 1) % 4;
          else {
            const nx = x + DX[dir]; const ny = y + DY[dir];
            if (nx < 0 || ny < 0 || nx >= N || ny >= N || level.rocks.has(key(nx, ny))) { api.sfx('hit'); NG.replay && NG.replay(board, 'shake'); cb({ ok: false, crash: true, steps: i + 1, at: bi }); return; }
            x = nx; y = ny; trailDot(x, y); api.sfx('click');
          }
          placeRobot(x, y, dir);
          i++;
          if (x === level.goal[0] && y === level.goal[1]) { timer = setTimeout(() => { blks.forEach((b) => b.classList.remove('now')); cb({ ok: true, steps: i }); }, reduce ? 50 : 350); return; }
          timer = setTimeout(tick, reduce ? 60 : 380);
        };
        timer = setTimeout(tick, reduce ? 30 : 250);
      }

      /* ---------- Programmeringsflate ---------- */
      function editor({ title, text, max, loop, onDone }) {
        stage.innerHTML = '';
        let prog = []; let reps = 1; let tries = 0; let busy = false;
        const progEl = el('div', { class: 'rr-prog' + (loop ? ' loop' : '') });
        const render = () => {
          progEl.innerHTML = '';
          if (!prog.length) progEl.appendChild(el('span', { class: 'rr-empty', text: loop ? 'Løkkekroppen er tom' : 'Programmet er tomt – trykk på blokkene under' }));
          prog.forEach((c, i) => progEl.appendChild(el('button', { class: 'rr-blk', 'aria-label': NAME[c] + ' (trykk for å fjerne)', text: SYM[c], onclick: () => { if (busy) return; prog.splice(i, 1); api.sfx('click'); render(); } })));
          count.textContent = `${prog.length}/${max} blokker`;
        };
        const count = el('span', { class: 'label' });
        const add = (c) => { if (busy) return; if (prog.length >= max) { api.toast(`Maks ${max} blokker${loop ? ' i løkka' : ''}.`); return; } prog.push(c); api.sfx('click'); render(); };
        const pal = el('div', { class: 'rr-pal' }, ['F', 'L', 'R'].map((c) => el('button', { class: 'btn', text: SYM[c] + ' ' + NAME[c], onclick: () => add(c) })));
        let repRow = null;
        if (loop) {
          repRow = el('div', { class: 'rr-rep' }, [el('span', { text: 'gjenta' })]);
          [1, 2, 3, 4].forEach((k) => repRow.appendChild(el('button', { class: k === reps ? 'sel' : '', text: k + '×', onclick: (e) => { if (busy) return; reps = k; api.sfx('click'); repRow.querySelectorAll('button').forEach((b) => b.classList.remove('sel')); e.target.classList.add('sel'); } })));
        }
        const fb = el('div', { 'aria-live': 'polite' });
        const run = el('button', { class: 'btn primary grow', text: '▶ Kjør', onclick: () => {
          if (busy || !prog.length) return;
          busy = true; tries++; fb.innerHTML = '';
          const cmds = [];
          for (let r = 0; r < reps; r++) prog.forEach((c, i) => cmds.push({ c, bi: i }));
          execute(cmds, progEl, (res) => {
            busy = false;
            if (res.ok) { api.sfx('good'); onDone(tries, prog, reps); return; }
            api.sfx('bad');
            fb.appendChild(el('div', { class: 'feedback bad small', html: api.md(res.crash ? 'Krasj! Roboten traff en stein eller kanten. Se hvor den stoppet, og finn blokken som sendte den feil vei.' : 'Programmet er ferdig, men roboten er ikke ved flagget.') }));
          });
        } });
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: title }),
          el('div', { class: 'small', html: api.md(text) }),
          el('div', { class: 'row' }, [count]),
          progEl, repRow, pal,
          el('div', { class: 'row' }, [el('button', { class: 'btn', text: 'Tøm', onclick: () => { if (busy) return; prog = []; render(); } }), run]),
          fb,
        ]));
        render();
      }

      /* ---------- Nivåene ---------- */
      const plan = d === 1 ? ['seq', 'debug'] : ['seq', 'loop', 'debug'];
      let li = 0;
      function nextLevel() {
        if (ended) return;
        const k = plan[li++];
        if (!k) { questions(); return; }
        status.textContent = `Bane ${li} av ${plan.length}`;
        if (k === 'seq') {
          setLevel(rng.pick(MAPS1));
          editor({ title: 'Bane 1: sekvens', text: 'Lag en **sekvens** av blokker som får roboten til flagget. ↺/↻ snur roboten på stedet.', max: 14, loop: false, onDone: (tries) => levelDone('Sekvens', tries) });
        } else if (k === 'loop') {
          const reps = d >= 3 ? 4 : 3;
          setLevel(Object.assign({}, MAP2, { g: reps === 4 ? [4, 1] : [3, 2] }));
          editor({ title: 'Bane 2: løkke', text: `Ruta er en trapp. Du har bare plass til **4 blokker** – men de kan gjentas. Finn mønsteret!`, max: 4, loop: true, onDone: (tries, prog, r) => levelDone('Løkke', tries, `${r} × [${prog.map((c) => NAME[c]).join(', ')}]`) });
        } else debug();
      }

      function levelDone(name, tries, extra) {
        total++;
        const sc = tries <= 1 ? 1 : tries === 2 ? 0.8 : tries <= 4 ? 0.6 : 0.4;
        right += sc;
        notes.push(`${name}: ${tries} forsøk` + (extra ? ` (${extra})` : ''));
        if (tries > 2) missed.push(name.toLowerCase());
        stage.innerHTML = '';
        stage.append(el('div', { class: 'feedback good stack-s' }, [
          el('div', { class: 'h-display', text: tries === 1 ? 'Rett i mål på første forsøk!' : `I mål etter ${tries} forsøk` }),
          el('div', { class: 'small', html: api.md(name === 'Løkke' ? 'Løkka gjentar det samme mønsteret. Kortere program, færre feil – og lett å endre: vil du gå én trapp lenger, endrer du bare tallet.' : 'En algoritme er en presis rekkefølge av steg. Roboten gjør *nøyaktig* det du skriver – ikke det du mener.') }),
          el('button', { class: 'btn primary block', text: 'Neste', onclick: () => { api.sfx('click'); nextLevel(); } }),
        ]));
      }

      function debug() {
        setLevel(MAP3);
        const good = MAP3.sol.split('').map(mturn);
        // én feil: bytt en sving med motsatt sving
        const turns = good.map((c, i) => (c !== 'F' ? i : -1)).filter((i) => i >= 0);
        const bugAt = rng.pick(turns);
        let prog = good.slice(); prog[bugAt] = prog[bugAt] === 'L' ? 'R' : 'L';
        let tries = 0; let busy = false;
        stage.innerHTML = '';
        const progEl = el('div', { class: 'rr-prog' });
        const cycle = { F: 'L', L: 'R', R: 'F' };
        const render = () => {
          progEl.innerHTML = '';
          prog.forEach((c, i) => progEl.appendChild(el('button', { class: 'rr-blk', 'aria-label': `Blokk ${i + 1}: ${NAME[c]} (trykk for å endre)`, text: SYM[c], onclick: () => { if (busy) return; prog[i] = cycle[c]; api.sfx('click'); render(); } })));
        };
        const fb = el('div', { 'aria-live': 'polite' });
        const run = el('button', { class: 'btn primary block', text: '▶ Kjør', onclick: () => {
          if (busy) return; busy = true; tries++; fb.innerHTML = '';
          execute(prog.map((c) => ({ c })), progEl, (res) => {
            busy = false;
            if (res.ok) { api.sfx('good'); levelDone('Feilsøking', tries); return; }
            api.sfx('bad');
            fb.appendChild(el('div', { class: 'feedback bad small', html: api.md(res.crash ? `Krasj ved blokk ${res.at + 1}. Feilen er ofte *før* krasjet: hvor begynte roboten å gå en annen vei enn planen?` : 'Roboten kom ikke fram. Følg den steg for steg.') }));
            if (tries >= 4) {
              progEl.querySelectorAll('.rr-blk')[bugAt].classList.add('bug');
              fb.appendChild(el('div', { class: 'small', text: `Hint: se på blokk ${bugAt + 1}.` }));
            }
          });
        } });
        render();
        stage.append(el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: `Bane ${plan.length}: feilsøking` }),
          el('div', { class: 'small', html: api.md('En elev har skrevet programmet under. Det skal nå flagget, men **én blokk er feil**. Kjør det, se hvor det går galt, og trykk på blokken for å endre den (↑ → ↺ → ↻).') }),
          progEl, run, fb,
        ]));
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
        status.textContent = '';
        const list = [
          {
            type: 'mc', topic: 'Algoritme', miss: 'hva en algoritme er', level: 2,
            prompt: 'Hva er en **algoritme**?',
            options: ['En presis, trinnvis fremgangsmåte som løser et problem', 'Et program skrevet i et bestemt programmeringsspråk', 'En datamaskin som kan tenke selv', 'En feil i et program'],
            answer: 0,
            why: { 1: 'Et program er én måte å skrive ned en algoritme på – en oppskrift eller et flytdiagram kan også være algoritmer.', 2: 'En algoritme er en oppskrift, ikke en maskin.', 3: 'En feil i et program heter en bug.' },
            explain: 'En algoritme er en presis oppskrift: entydige steg i riktig rekkefølge. Den kan skrives i kode, på papir eller som blokker. Grunnstrukturene er **sekvens**, **løkke** (gjentakelse) og **betingelse** (valg).',
          },
          {
            type: 'mc', topic: 'Løkke', miss: 'hvorfor løkker', level: 3,
            prompt: 'Hvorfor er en løkke bedre enn å skrive de samme blokkene om igjen mange ganger?',
            options: ['Programmet blir kortere, lettere å lese og lettere å endre', 'Roboten kjører fortere i en løkke', 'Det er umulig å skrive samme blokk flere ganger', 'Løkker gjør at programmet aldri får feil'],
            answer: 0,
            why: { 1: 'Roboten gjør de samme stegene i samme tempo.', 2: 'Det er fullt mulig – bare tungvint og lett å gjøre feil.', 3: 'En feil inne i løkka gjentas også!' },
            explain: 'Å se **mønsteret** og bruke en løkke er kjernen i algoritmisk tenkning. Én endring i løkka virker på alle gjentakelsene – det gjelder også feil.',
          },
        ];
        if (d >= 2) list.push({
          type: 'order', topic: 'Feilsøking', miss: 'systematisk feilsøking', level: 3,
          prompt: 'Sett trinnene i **systematisk feilsøking** i en fornuftig rekkefølge:',
          items: ['Kjør programmet og se hva som skjer', 'Sammenlign med det du ville skulle skje', 'Finn det første stedet der det går galt', 'Endre én ting', 'Test på nytt'],
          explain: 'Feilsøking er en undersøkelse: observer, sammenlign med forventningen, lokaliser, endre **én** ting om gangen og test igjen. Endrer du mange ting samtidig, vet du ikke hva som hjalp.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true; clearTimeout(timer);
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${NG.fmt(right, 1)} av ${total} poeng` }),
          el('ul', { html: [
            '**Sekvens:** stegene utføres i nøyaktig den rekkefølgen de står.',
            '**Løkke:** et mønster som gjentas skrives én gang.',
            '**Feilsøking:** kjør, observer, finn første avvik, endre én ting, test igjen.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: Math.round(right), total, notes: 'Robotruten. ' + notes.join('; ') + '.' + (missed.length ? ' Bommet på: ' + missed.join(', ') + '.' : '') });
      }

      nextLevel();
      return { destroy() { ended = true; clearTimeout(timer); } };
    },
  });
})();
