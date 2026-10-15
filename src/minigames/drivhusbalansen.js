/* Mini-spill: Drivhusbalansen (jorda). Først er du et CO₂-molekyl: fang varmestrålingen (IR) fra bakken, men la
   sollyset passere. Så skrur du på mengden drivhusgasser i en enkel strålingsmodell og leser av temperaturen. */
(function () {
  'use strict';
  const ID = 'drivhusbalansen';

  NG.css(`
.mg-drivhusbalansen .dh-wrap { position: relative; }
.mg-drivhusbalansen .dh-canvas { display: block; width: 100%; border-radius: var(--r-m); border: 1px solid var(--line); background: linear-gradient(#0f1b26, #1b2c3a 55%, #22352c); touch-action: manipulation; }
.mg-drivhusbalansen .dh-hud { display: flex; justify-content: space-between; gap: 8px; font: 600 var(--t-s) var(--f-mono); }
.mg-drivhusbalansen .dh-levels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.mg-drivhusbalansen .dh-levels .option { text-align: center; padding: 8px 2px; font-size: var(--t-xs); }
.mg-drivhusbalansen .dh-temp { font: 600 var(--t-xl) var(--f-mono); text-align: center; }
.mg-drivhusbalansen .dh-temp small { display: block; font: 400 var(--t-xs) var(--f-body); color: var(--chalk-dim); }
`);

  // Enkel ettlags strålingsmodell: Ts = Te · (2 / (2 − ε))^(1/4), Te = 255 K (−18 °C)
  const LEVELS = [
    { n: 'Ingen', eps: 0, mol: 0 },
    { n: 'Lite', eps: 0.5, mol: 4 },
    { n: 'Som i dag', eps: 0.78, mol: 9 },
    { n: 'Mye mer', eps: 0.9, mol: 15 },
  ];
  const tempOf = (eps) => 255 * Math.pow(2 / (2 - eps), 0.25) - 273.15;

  NG.minigames.register({
    id: ID, region: 'jorda', title: 'Drivhusbalansen', icon: 'sun',
    concepts: ['drivhuseffekt', 'drivhusgass', 'atmosfaere', 'klima', 'klimaendring', 'vaer'],
    blurb: 'Vær et CO₂-molekyl som fanger varmestråling – og skru på drivhusgassene til jorda.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
      let ended = false; let raf = 0; let timer = 0;
      let right = 0; let total = 0; const missed = [];
      let catchScore = 0;

      const cv = el('canvas', { class: 'dh-canvas', 'aria-label': 'Sollys inn mot bakken, varmestråling opp fra bakken og drivhusgassmolekyler i atmosfæren' });
      const hud = el('div', { class: 'dh-hud', 'aria-live': 'polite' });
      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Himmelfjellet · lab' }), el('span', { class: 'chip', text: 'Stråling' })]),
        el('h2', { class: 'h-display', text: 'Drivhusbalansen' }),
        el('div', { class: 'dh-wrap' }, [cv]), hud, stage,
      ]));

      let W = 340; const H = 270; let ctx = null;
      const GROUND = H - 34; const ATM0 = 70; const ATM1 = 160;
      function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        W = cv.clientWidth || 340;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
        ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // Partikler: { kind: 'sun'|'ir', x, y, vx, vy, age }
      let photons = []; let mols = []; let level = LEVELS[2];
      let spawnAcc = 0; let last = 0; let glow = [];
      const fx = NG.makeRng(api.seed + 99); // kosmetisk støy
      function setMols(n) {
        mols = [];
        for (let i = 0; i < n; i++) mols.push({ x: 20 + fx.next() * (W - 40), y: ATM0 + 10 + fx.next() * (ATM1 - ATM0 - 20), a: fx.next() * 6.28, hot: 0 });
      }
      function spawnSun() { const x = W * (0.15 + fx.next() * 0.75); photons.push({ kind: 'sun', x: x - 60, y: -6, vx: 38, vy: 120, age: 0 }); }
      function spawnIr(x, y, up) {
        const ang = up === false ? (Math.PI / 2 + (fx.next() - 0.5) * 1.6) : (-Math.PI / 2 + (fx.next() - 0.5) * 1.6);
        photons.push({ kind: 'ir', x, y, vx: Math.cos(ang) * 70, vy: Math.sin(ang) * 70, age: 0, cool: 0.25 });
      }

      function physics(dt, mode) {
        spawnAcc += dt;
        const rate = mode === 'catch' ? 0.55 : 0.32;
        while (spawnAcc > rate) { spawnAcc -= rate; spawnSun(); }
        for (const p of photons) {
          p.x += p.vx * dt; p.y += p.vy * dt; p.age += dt; if (p.cool) p.cool = Math.max(0, p.cool - dt);
          if (p.kind === 'sun' && p.y >= GROUND) { p.dead = true; spawnIr(p.x, GROUND - 2); }
          if (p.kind === 'ir') {
            if (p.y >= GROUND && p.vy > 0) { p.dead = true; glow.push({ x: p.x, t: 0.6 }); }
            if (p.y < -10) p.dead = true;
            if (mode !== 'catch' && !p.cool) for (const m of mols) {
              if (Math.hypot(m.x - p.x, m.y - p.y) < 13) { p.dead = true; m.hot = 0.5; setTimeout(() => { if (!ended) spawnIr(m.x, m.y, fx.next() < 0.5); }, 120); break; }
            }
          }
          if (p.x < -20 || p.x > W + 20) p.dead = true;
        }
        photons = photons.filter((p) => !p.dead);
        for (const m of mols) { m.a += dt * 0.8; m.hot = Math.max(0, m.hot - dt); }
        for (const g of glow) g.t -= dt;
        glow = glow.filter((g) => g.t > 0);
      }

      function draw(mode) {
        ctx.clearRect(0, 0, W, H);
        // sola
        ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(18, 10, 26, 0, 6.29); ctx.fill();
        // atmosfærelaget
        ctx.fillStyle = 'rgba(124,200,255,0.07)'; ctx.fillRect(0, ATM0, W, ATM1 - ATM0);
        ctx.fillStyle = 'rgba(238,240,230,0.45)'; ctx.font = '10px ' + 'monospace'; ctx.textAlign = 'right'; ctx.fillText('atmosfæren', W - 6, ATM0 + 12);
        // bakken
        ctx.fillStyle = '#3d5a3f'; ctx.fillRect(0, GROUND, W, H - GROUND);
        for (const g of glow) { ctx.fillStyle = `rgba(255,125,110,${(g.t * 0.6).toFixed(2)})`; ctx.beginPath(); ctx.arc(g.x, GROUND, 10, Math.PI, 0); ctx.fill(); }
        // molekyler O=C=O
        for (const m of mols) {
          ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(Math.sin(m.a) * 0.5);
          ctx.strokeStyle = m.hot ? '#ff7d6e' : 'rgba(238,240,230,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.stroke();
          ctx.fillStyle = m.hot ? '#ff7d6e' : '#9aa59f'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, 6.29); ctx.fill();
          ctx.fillStyle = m.hot ? '#ffb3a8' : '#ff8fa6'; ctx.beginPath(); ctx.arc(-11, 0, 4, 0, 6.29); ctx.arc(11, 0, 4, 0, 6.29); ctx.fill();
          ctx.restore();
        }
        // fotoner
        for (const p of photons) {
          const len = Math.hypot(p.vx, p.vy); const ux = p.vx / len; const uy = p.vy / len;
          if (p.kind === 'sun') {
            ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.x - ux * 14, p.y - uy * 14); ctx.lineTo(p.x, p.y); ctx.stroke();
          } else {
            ctx.strokeStyle = '#ff6f6f'; ctx.lineWidth = 3; ctx.beginPath();
            for (let k = 0; k <= 16; k++) { const s = -k; const wob = Math.sin(k * 1.2 + p.age * 12) * 3; ctx.lineTo(p.x + ux * s - uy * wob, p.y + uy * s + ux * wob); }
            ctx.stroke();
          }
        }
        if (mode === 'catch') { ctx.fillStyle = 'rgba(238,240,230,.5)'; ctx.textAlign = 'left'; ctx.fillText('trykk på varmestrålingen', 8, GROUND + 22); }
      }

      function loop(mode, onTick) {
        last = 0;
        const frame = (now) => {
          if (ended) return;
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
          physics(dt, mode); draw(mode);
          if (onTick && onTick(dt) === false) return; // false = stopp løkka
          raf = requestAnimationFrame(frame);
        };
        cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
      }

      /* ---------- 1. Fang varmestrålingen ---------- */
      function intro() {
        fit(); setMols(0); photons = [];
        if (reduce) { draw(); } else loop('show');
        hud.textContent = '';
        stage.innerHTML = '';
        stage.append(el('div', { class: 'card stack-s' }, [
          el('div', { html: api.md('**Gult** = sollys (mest synlig lys). **Rødt** = varmestråling (infrarød, IR) som bakken sender ut når den er varmet opp.\n\nDu er et **CO₂-molekyl**. Drivhusgasser slipper sollyset gjennom, men absorberer IR. Trykk på de røde – og la de gule passere!') }),
          el('button', { class: 'btn primary block', text: 'Start (20 sekunder)', onclick: () => { api.sfx('click'); catchGame(); } }),
        ]));
      }

      function catchGame() {
        stage.innerHTML = '';
        photons = []; let left = d >= 3 ? 25 : 20; let hit = 0; let wrong = 0;
        const upd = () => { hud.innerHTML = `<span>IR fanget: ${hit}</span><span>sollys stoppet: ${wrong}</span><span>${Math.ceil(left)} s</span>`; };
        upd();
        const tap = (e) => {
          const r = cv.getBoundingClientRect();
          const x = (e.clientX - r.left) * (W / r.width); const y = (e.clientY - r.top) * (H / r.height);
          let best = null; let bd = 26;
          for (const p of photons) { const dd = Math.hypot(p.x - x, p.y - y); if (dd < bd) { bd = dd; best = p; } }
          if (!best) return;
          best.dead = true;
          if (best.kind === 'ir') { hit++; api.sfx('coin'); mols.push({ x: best.x, y: best.y, a: 0, hot: 0.5, temp: 0.6 }); setTimeout(() => { mols = mols.filter((m) => !m.temp); }, 600); }
          else { wrong++; api.sfx('bad'); api.toast('Sollys går rett gjennom drivhusgassene!'); }
          upd();
        };
        cv.addEventListener('pointerdown', tap);
        if (reduce) {
          // uten animasjon: vis et stillbilde og la spilleren hoppe over fangsten
          cv.removeEventListener('pointerdown', tap);
          catchScore = 0.5; afterCatch(0, 0); return;
        }
        loop('catch', (dt) => {
          left -= dt;
          if (left <= 0) { cv.removeEventListener('pointerdown', tap); afterCatch(hit, wrong); return false; }
          if (Math.floor(left) !== Math.floor(left + dt)) upd();
          return true;
        });
      }

      function afterCatch(hit, wrong) {
        if (ended) return;
        if (!reduce) catchScore = Math.min(1, hit / 8) * (hit + wrong ? hit / (hit + wrong) : 0);
        total++; right += catchScore;
        hud.textContent = '';
        stage.innerHTML = '';
        stage.append(el('div', { class: 'feedback ' + (catchScore >= 0.5 ? 'good' : 'bad') + ' stack-s' }, [
          el('div', { class: 'h-display', text: reduce ? 'Fangst hoppet over' : `${hit} IR-fotoner fanget, ${wrong} solstråler stoppet` }),
          el('div', { html: api.md('Et drivhusgassmolekyl som har absorbert IR, sender den ut igjen **i en tilfeldig retning** – omtrent halvparten tilbake mot bakken. Bakken får altså energi både fra sola *og* fra atmosfæren, og blir varmere enn den ellers ville vært.') }),
          el('button', { class: 'btn primary block', text: 'Til modellen', onclick: () => { api.sfx('click'); model(); } }),
        ]));
      }

      /* ---------- 2. Modellen ---------- */
      function model() {
        setMols(level.mol);
        if (!reduce) loop('show'); else draw();
        let pred = null;
        stage.innerHTML = '';
        const pq = el('div', { class: 'card stack-s' }, [
          el('span', { class: 'label', text: 'Forutsi' }),
          el('div', { html: api.md('Med dagens mengde drivhusgasser er gjennomsnittstemperaturen ved bakken ca. **15 °C**. Hva tror du den ville vært **uten** drivhusgasser?') }),
          ...[['Omtrent som nå, ca. 15 °C', 0], ['Litt kaldere, ca. 5 °C', 1], ['Langt under frysepunktet, ca. −18 °C', 2], ['Varmere, fordi mer sollys slipper inn', 3]].map(([t, k]) => el('button', { class: 'option', text: t, onclick: () => { if (pred != null) return; pred = k; api.sfx('click'); predicted(k); } })),
        ]);
        stage.append(pq);
        function predicted(k) {
          total++; if (k === 2) { right++; api.sfx('good'); } else { api.sfx('bad'); missed.push('jorda uten drivhuseffekt'); }
          explore(k === 2);
        }
      }

      function explore(ok) {
        stage.innerHTML = '';
        const temp = el('div', { class: 'dh-temp', 'aria-live': 'polite' });
        const tried = new Set();
        const go = el('button', { class: 'btn primary block', text: 'Prøv alle fire nivåene', disabled: true, onclick: () => { api.sfx('click'); questions(); } });
        const levels = el('div', { class: 'dh-levels' }, LEVELS.map((L) => el('button', { class: 'option' + (L === level ? ' selected' : ''), text: L.n, onclick: (e) => {
          level = L; tried.add(L.n); setMols(L.mol); api.sfx('click');
          levels.querySelectorAll('.option').forEach((b) => b.classList.remove('selected')); e.target.classList.add('selected');
          show();
          if (tried.size >= 4) { go.disabled = false; go.textContent = 'Videre'; }
        } })));
        function show() {
          const t = tempOf(level.eps);
          temp.innerHTML = `${t < 0 ? '−' : ''}${NG.fmt(Math.abs(t), 0)} °C<small>gjennomsnitt ved bakken i modellen (${level.n.toLowerCase()} drivhusgasser)</small>`;
        }
        tried.add(level.n); show();
        stage.append(
          el('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: api.md(ok ? '**Riktig:** uten drivhuseffekt ville jorda hatt ca. −18 °C i snitt.' : 'Uten drivhuseffekt ville jorda hatt ca. **−18 °C** i snitt – frossen.') }),
          el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Mengde drivhusgasser' }), levels, temp,
            el('div', { class: 'small muted', text: 'Modellen er sterkt forenklet (ett luftlag, ingen skyer eller tilbakekoblinger), men viser mekanismen.' })]),
          go,
        );
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
        const list = [
          {
            type: 'multi', topic: 'Drivhusgasser', miss: 'hvilke gasser er drivhusgasser', level: 2,
            prompt: 'Hvilke av gassene i lufta er **drivhusgasser**?',
            options: ['Vanndamp (H₂O)', 'Karbondioksid (CO₂)', 'Metan (CH₄)', 'Nitrogen (N₂)', 'Oksygen (O₂)'],
            answer: [0, 1, 2],
            explain: 'Vanndamp, CO₂ og metan absorberer IR. N₂ og O₂ – til sammen 99 % av lufta – gjør det nesten ikke. Vanndamp er den viktigste naturlige drivhusgassen, men mengden styres av temperaturen; CO₂ og metan er det vi mennesker øker.',
          },
          {
            type: 'mc', topic: 'Drivhuseffekten', miss: 'ozonhullet er ikke drivhuseffekten', level: 3,
            prompt: 'En elev sier: «Global oppvarming skyldes at hullet i ozonlaget slipper inn mer sol.» Hva svarer du?',
            options: ['Ozonlaget stopper UV-stråling; oppvarmingen skyldes at flere drivhusgasser absorberer mer av varmestrålingen fra bakken', 'Det stemmer – ozonhullet er hovedårsaken til at det blir varmere', 'Ozonlaget og drivhuseffekten er to ord for det samme', 'Oppvarmingen skyldes at sola har blitt mye sterkere de siste hundre årene'],
            answer: 0,
            why: { 1: 'Ozonhullet slipper inn mer UV, som er skadelig for levende vesener, men er ikke årsaken til global oppvarming.', 2: 'Det er to ulike miljøproblemer med ulike årsaker.', 3: 'Målinger av solinnstrålingen viser ingen slik økning.' },
            explain: 'To ulike problemer: ozonlaget (stratosfæren) absorberer UV-stråling. Den **forsterkede drivhuseffekten** skyldes økt CO₂, metan og lystgass fra fossil energi, landbruk og avskoging.',
          },
          {
            type: 'num', topic: 'Drivhuseffekten', miss: '33 grader varmere', level: 4, unit: '°C', answer: 33, abs: 1,
            prompt: 'Uten drivhuseffekt: ca. −18 °C. Med: ca. 15 °C. Hvor mange grader varmere gjør den **naturlige** drivhuseffekten jorda?',
            explain: '15 °C − (−18 °C) = **33 °C**. Den naturlige drivhuseffekten er livsviktig. Problemet er at vi forsterker den.',
          },
        ];
        if (d >= 2) list.push({
          type: 'mc', topic: 'Vær og klima', miss: 'vær er ikke klima', level: 3,
          prompt: 'Det var en uvanlig kald vinter i Trøndelag. Betyr det at det ikke blir varmere på jorda?',
          options: ['Nei: én vinter er vær; klima er gjennomsnittet over minst 30 år for hele jorda', 'Ja: kalde vintre viser at oppvarmingen har stoppet', 'Ja: hvis det var global oppvarming, ville alle vintre vært varmere', 'Nei, fordi det bare er Norge som blir varmere'],
          answer: 0,
          why: { 1: 'Én sesong på ett sted sier lite om trenden.', 2: 'Det er store naturlige svingninger fra år til år – trenden ser man over tiår.', 3: 'Oppvarmingen gjelder hele jorda, og varierer fra sted til sted.' },
          explain: '**Vær** er tilstanden i atmosfæren nå. **Klima** er gjennomsnittsværet over lang tid (normalt 30 år). Trenden ses i lange måleserier, ikke i én vinter.',
        });
        if (d >= 3) list.push({
          type: 'order', topic: 'Drivhuseffekten', miss: 'drivhuseffektens mekanisme', level: 3,
          prompt: 'Sett trinnene i drivhuseffekten i riktig rekkefølge:',
          items: ['Sollys går gjennom atmosfæren', 'Bakken absorberer sollyset og blir varm', 'Bakken sender ut varmestråling (IR)', 'Drivhusgasser absorberer en del av IR-strålingen', 'Gassene stråler ut igjen i alle retninger, også ned mot bakken'],
          explain: 'Sollys inn → bakken varmes → IR ut → drivhusgasser absorberer → ny utstråling, delvis ned igjen. Bakken mottar dermed mer energi og må bli varmere for å sende ut like mye som den får.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true; cancelAnimationFrame(raf); clearTimeout(timer);
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${NG.fmt(right, 1)} av ${total} poeng` }),
          el('ul', { html: [
            'Drivhusgasser slipper **sollys** gjennom, men absorberer **varmestråling (IR)** fra bakken.',
            'De stråler ut igjen i alle retninger – også ned. Derfor er bakken ca. 15 °C og ikke −18 °C.',
            'Mer CO₂ og metan gir en **forsterket** drivhuseffekt og høyere temperatur.',
            'Ozonhullet og drivhuseffekten er to ulike ting. Vær er ikke klima.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: Math.round(right), total, notes: `Drivhusbalansen: fangst ${Math.round(catchScore * 100)} %. ` + (missed.length ? 'Bommet på: ' + missed.join(', ') + '.' : 'Alt riktig.') });
      }

      const onResize = () => { if (!ended) { fit(); setMols(level.mol); } };
      window.addEventListener('resize', onResize);
      intro();
      return { destroy() { ended = true; cancelAnimationFrame(raf); clearTimeout(timer); window.removeEventListener('resize', onResize); } };
    },
  });
})();
