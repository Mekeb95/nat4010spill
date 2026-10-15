/* Mini-spill: Ionebyggeren (stoffer). Legg til eller fjern elektroner i skallmodellen til du får et stabilt ion
   med fullt ytterskall, og bygg så nøytrale ioneforbindelser (NaCl, MgCl₂, Al₂O₃ …) ved å balansere ladningene. */
(function () {
  'use strict';
  const ID = 'ionebyggeren';

  NG.css(`
.mg-ionebyggeren .ib-atom { background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); display: flex; justify-content: center; padding: 4px; }
.mg-ionebyggeren .ib-atom svg { width: 100%; max-width: 260px; height: auto; }
.mg-ionebyggeren .ib-ctrl { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-ionebyggeren .ib-info { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 4px; font-size: var(--t-xs); }
.mg-ionebyggeren .ib-info b { display: block; font: 600 var(--t-l) var(--f-mono); }
.mg-ionebyggeren .ib-e { transition: opacity .25s; }
.mg-ionebyggeren .ib-mix { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; min-height: 64px; align-items: center; padding: 8px; background: var(--board-2); border: 1px solid var(--line); border-radius: var(--r-m); }
.mg-ionebyggeren .ib-ion { width: 54px; height: 54px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font: 700 var(--t-s) var(--f-mono); color: var(--board); animation: ib-pop .25s ease-out; }
.mg-ionebyggeren .ib-ion small { font-size: 0.7rem; }
.mg-ionebyggeren .ib-ion.pos { background: var(--r-energi); }
.mg-ionebyggeren .ib-ion.neg { background: var(--r-stoffer); width: 62px; height: 62px; }
@keyframes ib-pop { from { transform: scale(.4); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .mg-ionebyggeren .ib-ion { animation: none; } }
.mg-ionebyggeren .ib-step { display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; align-items: center; }
.mg-ionebyggeren .ib-step b { font: 600 var(--t-l) var(--f-mono); min-width: 1.5em; text-align: center; }
.mg-ionebyggeren .ib-step .btn { min-width: 48px; }
.mg-ionebyggeren .ib-sum { font: 600 var(--t-m) var(--f-mono); text-align: center; }
`);

  // Z, skallkonfigurasjon, forventet ionladning
  const EL = {
    Li: { n: 'Litium', z: 3, sh: [2, 1], q: 1 }, Na: { n: 'Natrium', z: 11, sh: [2, 8, 1], q: 1 }, K: { n: 'Kalium', z: 19, sh: [2, 8, 8, 1], q: 1 },
    Mg: { n: 'Magnesium', z: 12, sh: [2, 8, 2], q: 2 }, Ca: { n: 'Kalsium', z: 20, sh: [2, 8, 8, 2], q: 2 }, Al: { n: 'Aluminium', z: 13, sh: [2, 8, 3], q: 3 },
    F: { n: 'Fluor', z: 9, sh: [2, 7], q: -1 }, Cl: { n: 'Klor', z: 17, sh: [2, 8, 7], q: -1 }, O: { n: 'Oksygen', z: 8, sh: [2, 6], q: -2 }, S: { n: 'Svovel', z: 16, sh: [2, 8, 6], q: -2 },
  };
  const ION_NAME = { Li: 'litiumion', Na: 'natriumion', K: 'kaliumion', Mg: 'magnesiumion', Ca: 'kalsiumion', Al: 'aluminiumion', F: 'fluoridion', Cl: 'kloridion', O: 'oksidion', S: 'sulfidion' };
  const COMP = [
    { a: 'Na', b: 'Cl', na: 1, nb: 1, n: 'natriumklorid (koksalt)' }, { a: 'Mg', b: 'Cl', na: 1, nb: 2, n: 'magnesiumklorid' }, { a: 'Ca', b: 'F', na: 1, nb: 2, n: 'kalsiumfluorid' },
    { a: 'K', b: 'O', na: 2, nb: 1, n: 'kaliumoksid' }, { a: 'Mg', b: 'O', na: 1, nb: 1, n: 'magnesiumoksid' }, { a: 'Al', b: 'Cl', na: 1, nb: 3, n: 'aluminiumklorid' }, { a: 'Al', b: 'O', na: 2, nb: 3, n: 'aluminiumoksid' },
  ];
  const sup = (q) => { const m = { 1: '', 2: '²', 3: '³' }; return (Math.abs(q) === 1 ? '' : m[Math.abs(q)]) + (q > 0 ? '⁺' : '⁻'); };
  const sub = (n) => (n === 1 ? '' : '₀₁₂₃₄₅₆₇₈₉'[n]);
  const cap = (k) => (k === 0 ? 2 : 8);

  NG.minigames.register({
    id: ID, region: 'stoffer', title: 'Ionebyggeren', icon: 'atom',
    concepts: ['ion', 'elektronskall', 'elektron', 'ionebinding', 'periodesystemet', 'atom', 'proton'],
    blurb: 'Gi og ta elektroner til atomene får fullt ytterskall – og bygg ioneforbindelser med riktig formel.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let right = 0; let total = 0; const missed = [];

      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Stoffgruvene · lab' }), el('span', { class: 'chip', text: 'Skallmodellen' })]),
        el('h2', { class: 'h-display', text: 'Ionebyggeren' }),
        stage,
      ]));

      function atomSvg(sym, sh) {
        const e = EL[sym];
        const R = [30, 52, 74, 94];
        let h = '';
        sh.forEach((n, k) => {
          const outer = k === sh.length - 1;
          h += `<circle cx="100" cy="100" r="${R[k]}" fill="none" stroke="${outer ? 'var(--chalk-dim)' : 'var(--line-strong)'}" stroke-width="1.5" ${outer ? '' : 'stroke-dasharray="3 4"'}/>`;
          for (let i = 0; i < n; i++) {
            // to og to elektroner, slik skallmodellen ofte tegnes
            const pair = Math.floor(i / 2); const side = i % 2;
            const slots = Math.min(4, Math.ceil(cap(k) / 2));
            const ang = (pair / slots) * Math.PI * 2 - Math.PI / 2 + (side ? 0.22 : -0.22) * (k === 0 ? 3 : 1);
            const x = 100 + R[k] * Math.cos(ang); const y = 100 + R[k] * Math.sin(ang);
            h += `<circle class="ib-e" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${outer ? 'var(--r-stoffer)' : 'var(--chalk-dim)'}" stroke="var(--board)" stroke-width="1.5"/>`;
          }
        });
        h += `<circle cx="100" cy="100" r="19" fill="var(--r-energi)"/><text x="100" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="var(--board)" font-family="var(--f-mono)">${e.z}p⁺</text><text x="100" y="111" text-anchor="middle" font-size="9" fill="var(--board)" font-family="var(--f-mono)">${sym}</text>`;
        return `<svg viewBox="0 0 200 200" role="img" aria-label="${e.n}: ${e.z} protoner, elektroner i skall: ${sh.join(', ')}">${h}</svg>`;
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

      /* ---------- 1. Bygg ioner ---------- */
      const metals = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'];
      const nonmetals = ['F', 'Cl', 'O', 'S'];
      const nAt = d === 1 ? 3 : d === 2 ? 4 : 5;
      const atoms = rng.shuffle([...rng.shuffle(metals).slice(0, Math.ceil(nAt / 2)), ...rng.shuffle(nonmetals).slice(0, Math.floor(nAt / 2))]);
      let ai = 0;

      function buildIon() {
        if (ended) return;
        if (ai >= atoms.length) { compounds(); return; }
        const sym = atoms[ai++];
        const e = EL[sym];
        let sh = e.sh.slice();
        let tries = 0;
        stage.innerHTML = '';
        const fig = el('div', { class: 'ib-atom' });
        const info = el('div', { class: 'ib-info', 'aria-live': 'polite' });
        const fb = el('div');
        const elec = () => sh.reduce((a, b) => a + b, 0);
        const draw = () => {
          fig.innerHTML = atomSvg(sym, sh);
          const q = e.z - elec();
          info.innerHTML = '';
          info.append(
            el('div', {}, [el('b', { text: String(e.z) }), 'protoner']),
            el('div', {}, [el('b', { text: String(elec()) }), 'elektroner']),
            el('div', {}, [el('b', { text: q === 0 ? '0' : (q > 0 ? '+' : '−') + Math.abs(q) }), 'ladning']),
          );
        };
        const add = () => {
          if (elec() - e.z >= 4) { api.toast('Så mange ekstra elektroner tar ikke et atom opp.'); return; }
          const k = sh.length - 1;
          if (sh[k] >= cap(k)) sh.push(1); else sh[k]++;
          api.sfx('click'); draw();
        };
        const rem = () => {
          if (e.z - elec() >= 4) { api.toast('Så mange elektroner gir ikke et atom fra seg.'); return; }
          const k = sh.length - 1;
          sh[k]--; if (!sh[k]) sh.pop();
          api.sfx('click'); draw();
        };
        const done = el('button', { class: 'btn primary block', text: 'Stabilt ion – sjekk', onclick: () => {
          const q = e.z - elec();
          const full = sh[sh.length - 1] === cap(sh.length - 1);
          if (q === e.q) {
            if (!tries) right++; total++;
            api.sfx('good');
            stage.innerHTML = '';
            stage.append(fig, el('div', { class: 'feedback good stack-s' }, [
              el('div', { class: 'h-display', text: `${sym}${sup(q)} – ${ION_NAME[sym]}` }),
              el('div', { html: api.md(q > 0
                ? `${e.n} har ${e.sh[e.sh.length - 1]} elektron${e.q > 1 ? 'er' : ''} i ytterskallet. Det er lettere å **gi fra seg** ${e.q} enn å ta opp ${8 - e.sh[e.sh.length - 1]}. Det nest ytterste skallet er fullt og blir det nye ytterskallet. Protonene er de samme, så ionet får ladning **+${q}**.`
                : `${e.n} har ${e.sh[e.sh.length - 1]} elektroner i ytterskallet og **tar opp** ${-q} til det er fullt (8). Flere elektroner enn protoner gir ladning **${q}**.`) }),
              el('button', { class: 'btn primary block', text: 'Neste atom', onclick: () => { api.sfx('click'); buildIon(); } }),
            ]));
            return;
          }
          tries++; api.sfx('bad');
          if (tries === 1) { total++; missed.push(ION_NAME[sym]); }
          fb.innerHTML = '';
          let msg;
          if (!full) msg = 'Ytterskallet er ikke fullt ennå. Et stabilt ion har fullt ytterskall (som en edelgass).';
          else if (q === 0) msg = 'Atomet er nøytralt – du har ikke laget et ion.';
          else if (Math.sign(q) !== Math.sign(e.q)) msg = e.q > 0 ? `Fullt skall, men det krever ${-q} ekstra elektroner. Det er mye lettere for ${e.n.toLowerCase()} å gi fra seg ${e.q}.` : `Fullt skall, men da måtte ${e.n.toLowerCase()} gi fra seg ${q} elektroner. Det er lettere å ta opp ${-e.q}.`;
          else msg = 'Nesten – tell elektronene i ytterskallet igjen.';
          fb.appendChild(el('div', { class: 'feedback bad small', text: msg }));
        } });
        draw();
        stage.append(
          el('div', { class: 'small', html: api.md(`**Atom ${ai} av ${atoms.length}: ${e.n} (${sym})**, atomnummer ${e.z}. Gi eller ta elektroner til atomet blir et **stabilt ion** med fullt ytterskall.`) }),
          fig, info,
          el('div', { class: 'ib-ctrl' }, [el('button', { class: 'btn', text: '− fjern elektron', onclick: rem }), el('button', { class: 'btn', text: '+ legg til elektron', onclick: add })]),
          done, fb,
        );
      }

      /* ---------- 2. Ioneforbindelser ---------- */
      function compounds() {
        const pool = d === 1 ? COMP.slice(0, 3) : COMP;
        const list = rng.shuffle(pool).slice(0, d === 1 ? 2 : 3);
        if (d >= 3 && !list.some((c) => c.a === 'Al' && c.b === 'O')) list[list.length - 1] = COMP[6];
        let ci = 0;
        const next = () => {
          if (ended) return;
          if (ci >= list.length) { questions(); return; }
          const c = list[ci++]; const A = EL[c.a]; const B = EL[c.b];
          let na = 1; let nb = 1; let tries = 0;
          stage.innerHTML = '';
          const mix = el('div', { class: 'ib-mix', 'aria-live': 'polite' });
          const sum = el('div', { class: 'ib-sum' });
          const nA = el('b'); const nB = el('b');
          const draw = () => {
            mix.innerHTML = '';
            for (let i = 0; i < na; i++) mix.appendChild(el('div', { class: 'ib-ion pos' }, [c.a, el('small', { text: sup(A.q) })]));
            for (let i = 0; i < nb; i++) mix.appendChild(el('div', { class: 'ib-ion neg' }, [c.b, el('small', { text: sup(B.q) })]));
            nA.textContent = na; nB.textContent = nb;
            const s = na * A.q + nb * B.q;
            sum.textContent = `Ladning: ${na}·(+${A.q}) + ${nb}·(${B.q}) = ${s > 0 ? '+' : s < 0 ? '−' : ''}${Math.abs(s)}`;
            sum.style.color = s === 0 ? 'var(--good)' : '';
          };
          const step = (which, delta) => () => { if (which === 'a') na = NG.clamp(na + delta, 1, 4); else nb = NG.clamp(nb + delta, 1, 4); api.sfx('click'); draw(); };
          const fb = el('div');
          stage.append(
            el('div', { class: 'small', html: api.md(`**Forbindelse ${ci} av ${list.length}:** ${ION_NAME[c.a]} (${c.a}${sup(A.q)}) og ${ION_NAME[c.b]} (${c.b}${sup(B.q)}). Hvor mange av hver trengs for at forbindelsen skal bli **nøytral**?`) }),
            mix, sum,
            el('div', { class: 'ib-step' }, [el('span', { text: c.a + sup(A.q) }), el('button', { class: 'btn', text: '−', 'aria-label': 'Færre ' + c.a, onclick: step('a', -1) }), nA, el('button', { class: 'btn', text: '+', 'aria-label': 'Flere ' + c.a, onclick: step('a', 1) })]),
            el('div', { class: 'ib-step' }, [el('span', { text: c.b + sup(B.q) }), el('button', { class: 'btn', text: '−', 'aria-label': 'Færre ' + c.b, onclick: step('b', -1) }), nB, el('button', { class: 'btn', text: '+', 'aria-label': 'Flere ' + c.b, onclick: step('b', 1) })]),
            el('button', { class: 'btn primary block', text: 'Sjekk formelen', onclick: () => {
              const s = na * A.q + nb * B.q;
              const simplest = na === c.na && nb === c.nb;
              if (s === 0 && simplest) {
                total++; if (!tries) right++;
                api.sfx('good');
                stage.innerHTML = '';
                stage.append(mix, el('div', { class: 'feedback good stack-s' }, [
                  el('div', { class: 'h-display', text: `${c.a}${sub(c.na)}${c.b}${sub(c.nb)} – ${c.n}` }),
                  el('div', { html: api.md(`${c.na} · (+${A.q}) + ${c.nb} · (${B.q}) = 0. Formelen viser **forholdet** mellom ionene i et stort iongitter – ikke ett molekyl.`) }),
                  el('button', { class: 'btn primary block', text: 'Neste', onclick: () => { api.sfx('click'); next(); } }),
                ]));
                return;
              }
              tries++; api.sfx('bad'); if (tries === 1) { total++; missed.push('formel ' + c.a + c.b); }
              fb.innerHTML = '';
              fb.appendChild(el('div', { class: 'feedback bad small', text: s !== 0 ? 'Summen av ladningene er ikke null ennå.' : 'Ladningen er null, men formelen skal ha det minste mulige forholdet.' }));
            } }),
            fb,
          );
          draw();
        };
        next();
      }

      function questions() {
        const list = [
          {
            type: 'mc', topic: 'Ioner', miss: 'hvorfor metaller gir fra seg elektroner', level: 3,
            prompt: 'Hvorfor danner metaller som natrium og magnesium **positive** ioner?',
            options: ['De har få elektroner i ytterskallet, og det er lettere å gi dem fra seg enn å ta opp mange nye', 'De får flere protoner når de reagerer', 'Positive ioner er alltid mer stabile enn negative', 'Metaller tiltrekker seg elektroner sterkere enn ikke-metaller'],
            answer: 0,
            why: { 1: 'Antall protoner endres aldri i en kjemisk reaksjon – da ville det blitt et annet grunnstoff.', 2: 'Kloridioner og oksidioner er like stabile – de har også fullt ytterskall.', 3: 'Det er omvendt: ikke-metaller har høyere elektronegativitet.' },
            explain: 'Med 1–3 elektroner i ytterskallet er det «billigst» å gi dem bort. Da blir det fulle skallet under det nye ytterskallet. Ikke-metaller med 5–7 ytterelektroner tar heller opp de som mangler.',
          },
          {
            type: 'mc', topic: 'Ionebinding', miss: 'iongitter, ikke molekyler', level: 4,
            prompt: 'En elev skriver: «Et NaCl-molekyl består av ett natriumatom og ett kloratom.» Hva er feil?',
            options: ['NaCl består av ioner i et stort gitter; formelen viser forholdet 1 : 1, ikke et molekyl', 'Det skal stå to kloratomer, siden klor er Cl₂', 'Natrium og klor deler elektroner, så det er riktig å kalle det et molekyl', 'Ingenting – det er en god beskrivelse'],
            answer: 0,
            why: { 1: 'Klor som grunnstoff er Cl₂, men i saltet er klor kloridioner.', 2: 'Å dele elektroner er kovalent binding. I NaCl er elektronet overført.', 3: 'Både «molekyl» og «atom» er feil her – det er ioner.' },
            explain: 'I en ionebinding overføres elektroner, og de motsatt ladde ionene trekker på hverandre i alle retninger. Det gir et **iongitter** med milliarder av ioner. Formelen NaCl er et forhold.',
          },
        ];
        if (d >= 2) list.push({
          type: 'tf', topic: 'Ioner', miss: 'protoner endres ikke', level: 2,
          prompt: 'Når et magnesiumatom blir et Mg²⁺-ion, mister det to protoner.',
          answer: false,
          explain: 'Det mister to **elektroner**. Antall protoner (12) er det samme – det er det som gjør det til magnesium. 12 protoner og 10 elektroner gir ladning +2.',
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
            'Ioner dannes når atomer **gir fra seg eller tar opp elektroner** – protonene er de samme.',
            'Metaller gir fra seg (positive ioner), ikke-metaller tar opp (negative ioner) til ytterskallet er fullt.',
            'Ladningen = antall protoner − antall elektroner.',
            'I en ioneforbindelse er summen av ladningene **null**; formelen viser forholdet i gitteret.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Ionebyggeren (' + atoms.join(', ') + '). ' + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      buildIon();
      return { destroy() { ended = true; } };
    },
  });
})();
