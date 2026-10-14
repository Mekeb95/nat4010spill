/* Mini-spill: Kodelaben – kaffen som kjølner (teknologi). Bygg en enkel simulering av avkjøling
   med blokker (variabel, løkke, betingelse), juster parameteren k mot «målte» data, og vurder
   modellens begrensninger. Kompetansemål: «bruke programmering til å utforske naturfaglige fenomener». */
(function () {
  'use strict';
  const ID = 'kodelaben';

  NG.css(`
.mg-kodelaben { display: flex; flex-direction: column; gap: 12px; }
.mg-kodelaben .kl-canvas { display: block; width: 100%; height: 210px; border-radius: var(--r-m); background: var(--board-2); border: 1px solid var(--line); }
.mg-kodelaben .kl-prog { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: var(--r-m); background: var(--board-2); border: 2px solid var(--line-strong); }
.mg-kodelaben .kl-line { display: flex; align-items: center; gap: 6px; }
.mg-kodelaben .kl-code { flex: 1 1 auto; min-width: 0; font-family: var(--f-mono); font-size: 0.86rem; padding: 8px 10px; border-radius: 10px; background: var(--board); border: 2px solid var(--line); overflow-wrap: anywhere; line-height: 1.3; }
.mg-kodelaben .kl-line.in .kl-code { margin-left: 18px; border-left: 4px solid var(--r-teknologi); }
.mg-kodelaben .kl-code.loop { color: var(--r-teknologi); }
.mg-kodelaben .kl-code.cond { color: var(--r-kropp); }
.mg-kodelaben .kl-code.bad { border-color: var(--bad); }
.mg-kodelaben .kl-ib { flex: 0 0 auto; width: 44px; height: 44px; padding: 0; border-radius: 10px; border: 2px solid var(--line-strong); background: var(--board-3); color: var(--chalk); font-size: 1.05rem; font-weight: 700; cursor: pointer; touch-action: manipulation; }
.mg-kodelaben .kl-ib:disabled { opacity: 0.3; cursor: default; }
.mg-kodelaben .kl-ib:active { transform: scale(0.95); }
.mg-kodelaben .kl-pal { display: flex; flex-wrap: wrap; gap: 6px; }
.mg-kodelaben .kl-pal .btn { font-family: var(--f-mono); font-size: 0.82rem; font-weight: 600; }
.mg-kodelaben .kl-k { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; }
.mg-kodelaben .kl-kval { font-family: var(--f-mono); font-size: var(--t-l); color: var(--r-teknologi); text-align: center; min-width: 5.5em; }
.mg-kodelaben .kl-legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-kodelaben .kl-legend i { display: inline-block; width: 14px; height: 4px; border-radius: 2px; vertical-align: middle; margin-right: 4px; }
.mg-kodelaben .kl-legend b { display: inline-block; width: 8px; height: 8px; border-radius: 50%; vertical-align: middle; margin-right: 4px; background: var(--chalk); }
.mg-kodelaben .kl-pill { color: var(--r-teknologi); border-color: color-mix(in srgb, var(--r-teknologi) 50%, transparent); }
`);

  const BLOCKS = {
    sett90: { code: 'sett T = 90', cls: '' },
    sett20: { code: 'sett T = 20', cls: '' },
    gjenta: { code: 'gjenta 30 ganger:', cls: 'loop' },
    oppdater: { code: 'T = T − k·(T − 20)', cls: '' },
    tegn: { code: 'tegn punkt (t, T)', cls: '' },
    hvis: { code: 'hvis T < 60: varsle', cls: 'cond' },
  };
  const N = 30; const ROOM = 20; const T0 = 90;

  function run(lines, k) {
    // Tolker: alt etter «gjenta» er inni løkka. t øker med 1 min for hver oppdatering.
    const g = lines.indexOf('gjenta');
    const pre = g < 0 ? lines.slice() : lines.slice(0, g);
    const body = g < 0 ? [] : lines.slice(g + 1);
    const out = { points: [], warns: [], err: null };
    let T = null; let t = 0;
    const exec = (id) => {
      if (id === 'sett90') T = T0;
      else if (id === 'sett20') T = ROOM;
      else if (id === 'oppdater') { if (T == null) { out.err = 'T har ingen verdi ennå'; return; } T = T - k * (T - ROOM); t++; }
      else if (id === 'tegn') { if (T == null) { out.err = 'T har ingen verdi ennå'; return; } out.points.push([t, T]); }
      else if (id === 'hvis') { if (T != null && T < 60) out.warns.push(t); }
    };
    pre.forEach(exec);
    if (g >= 0) for (let i = 0; i < N && !out.err; i++) body.forEach(exec);
    return out;
  }
  function diagnose(lines) {
    const g = lines.indexOf('gjenta');
    const inBody = (id) => g >= 0 && lines.indexOf(id) > g;
    const has = (id) => lines.includes(id);
    if (!has('gjenta')) return 'Programmet har ingen **løkke**. Uten den kjøres hver blokk bare én gang, så du får bare ett tidssteg.';
    if (!has('sett90')) return 'T får aldri en **startverdi**. Legg til `sett T = 90` før løkka.';
    if (inBody('sett90')) return '`sett T = 90` står **inni løkka**. Da settes T tilbake til 90 i hver runde, og kaffen kjølner aldri. Startverdien skal settes én gang, før løkka.';
    if (has('sett20')) return '`sett T = 20` overskriver temperaturen, så kaffen er i romtemperatur og ingenting skjer. Fjern blokka (✕).';
    if (!inBody('oppdater')) return 'Oppdateringen `T = T − k·(T − 20)` må stå **inni løkka**. Ellers regnes bare ett tidssteg.';
    if (!inBody('tegn')) return '`tegn punkt` står utenfor løkka, så du får bare ett punkt. Flytt den ned i løkka.';
    return null;
  }

  NG.minigames.register({
    id: ID, region: 'teknologi', title: 'Kodelaben: kaffen som kjølner', icon: 'code',
    concepts: ['tek-simulering', 'tek-lokke', 'tek-variabel', 'tek-betingelse', 'tek-tidssteg', 'tek-feilsoking'],
    blurb: 'Programmer en simulering av kaffe som kjølner, og tilpass modellen til målte data.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      let alive = true;

      // «Målte» data: ekte avkjøling (fin tidsoppløsning) + støy. Fra d2 er fordamping med.
      const kTrue = 0.05 + rng.int(0, 40) / 1000; // per minutt
      const evap = d >= 2 ? 0.035 + rng.int(0, 15) / 1000 : 0;
      const measured = [];
      (function () {
        let T = T0; const dt = 0.02; const r = -Math.log(1 - kTrue);
        for (let s = 0; s <= N / dt + 0.5; s++) {
          const t = s * dt;
          if (Math.abs(t / 3 - Math.round(t / 3)) < 1e-6) {
            const noise = (rng.next() - 0.5) * 1.2;
            measured.push([Math.round(t), T + noise]);
          }
          const x = T - ROOM;
          T -= dt * (r * x + evap * x * (x / 70) * (x / 70));
        }
      })();
      function rms(k) {
        const res = run(['sett90', 'gjenta', 'oppdater', 'tegn'], k).points;
        const at = { 0: T0 }; res.forEach(([t, T]) => { at[t] = T; });
        let s = 0; measured.forEach(([t, T]) => { s += (at[t] - T) ** 2; });
        return Math.sqrt(s / measured.length);
      }
      let bestK = 0.05; let bestR = Infinity;
      for (let k = 0.01; k <= 0.3; k += 0.001) { const r = rms(k); if (r < bestR) { bestR = r; bestK = k; } }

      // Tilstand
      const start = ['sett90', 'gjenta', 'oppdater', 'tegn'];
      if (d >= 2) start.push('sett20');
      let prog = rng.shuffle(start);
      for (let i = 0; i < 10 && !diagnose(prog); i++) prog = rng.shuffle(start);
      let runs = 0; let buildOk = false;
      let k = 0.15;
      let fitScore = 0; let fitRms = 0;
      const quiz = []; // {ok}
      let lastRun = null;
      let phase = 'build';

      const wrap = el('div', { class: 'mg-kodelaben' });
      root.appendChild(wrap);

      function header(sub) {
        return el('div', { class: 'stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Verkstedet · programmering' }), el('span', { class: 'spacer' }), el('span', { class: 'chip kl-pill', text: sub })]),
          el('h2', { class: 'h-display', text: 'Kaffen som kjølner' }),
        ]);
      }

      /* ---------- Graf ---------- */
      let canvas = null;
      function makeCanvas() {
        canvas = el('canvas', { class: 'kl-canvas', role: 'img', 'aria-label': 'Graf: temperatur mot tid' });
        return canvas;
      }
      function cssVar(name, fb) { const v = getComputedStyle(wrap).getPropertyValue(name).trim(); return v || fb; }
      function draw() {
        if (!canvas || !canvas.isConnected) return;
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.clientWidth || 340; const H = canvas.clientHeight || 210;
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        const c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        const L = 34, R = 10, T = 12, B = 26;
        const x = (t) => L + (t / N) * (W - L - R);
        const y = (v) => T + (1 - (v - 15) / 80) * (H - T - B);
        const chalk = cssVar('--chalk', '#eee'); const dim = cssVar('--chalk-faint', '#777'); const tek = cssVar('--r-teknologi', '#fe6'); const bad = cssVar('--bad', '#f76');
        c.font = '11px ' + cssVar('--f-mono', 'monospace');
        c.strokeStyle = dim; c.fillStyle = dim; c.lineWidth = 1;
        for (const v of [20, 40, 60, 80]) { c.globalAlpha = 0.35; c.beginPath(); c.moveTo(L, y(v)); c.lineTo(W - R, y(v)); c.stroke(); c.globalAlpha = 1; c.fillText(String(v), 6, y(v) + 4); }
        for (const t of [0, 10, 20, 30]) c.fillText(String(t), x(t) - 6, H - 8);
        c.fillText('min', x(25) - 10, H - 8);
        c.fillText('°C', 6, T + 2);
        c.setLineDash([5, 5]); c.strokeStyle = cssVar('--r-stoffer', '#7cf'); c.globalAlpha = 0.7;
        c.beginPath(); c.moveTo(L, y(ROOM)); c.lineTo(W - R, y(ROOM)); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
        // målinger
        c.fillStyle = chalk;
        measured.forEach(([t, v]) => { c.beginPath(); c.arc(x(t), y(v), 3.2, 0, Math.PI * 2); c.fill(); });
        // simulering
        if (lastRun && lastRun.points.length) {
          const pts = lastRun.points;
          c.strokeStyle = tek; c.fillStyle = tek; c.lineWidth = 2.5;
          if (pts.length > 1) {
            c.beginPath(); pts.forEach(([t, v], i) => { const px = x(Math.min(t, N)); const py = y(NG.clamp(v, 10, 100)); if (i) c.lineTo(px, py); else c.moveTo(px, py); }); c.stroke();
          }
          pts.forEach(([t, v]) => { c.beginPath(); c.arc(x(Math.min(t, N)), y(NG.clamp(v, 10, 100)), 2, 0, Math.PI * 2); c.fill(); });
          if (lastRun.warns.length) {
            c.strokeStyle = bad; c.lineWidth = 2;
            lastRun.warns.forEach((t) => { c.beginPath(); c.moveTo(x(t), y(60) - 7); c.lineTo(x(t), y(60) + 7); c.stroke(); });
            c.setLineDash([3, 4]); c.globalAlpha = 0.6; c.beginPath(); c.moveTo(L, y(60)); c.lineTo(W - R, y(60)); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
          }
        }
      }
      const onResize = () => { if (alive) draw(); };
      window.addEventListener('resize', onResize);
      function legend(extra) {
        return el('div', { class: 'kl-legend' }, [
          el('span', {}, [el('b'), '«målt» temperatur']),
          el('span', {}, [el('i', { style: { background: 'var(--r-teknologi)' } }), 'simulering']),
          el('span', {}, [el('i', { style: { background: 'var(--r-stoffer)' } }), 'romtemperatur']),
          extra ? el('span', {}, [el('i', { style: { background: 'var(--bad)' } }), 'varsel']) : null,
        ]);
      }

      /* ---------- Fase 1: bygg programmet ---------- */
      function renderBuild(msg) {
        phase = 'build';
        wrap.innerHTML = '';
        wrap.appendChild(header('1 · Bygg simuleringen'));
        wrap.appendChild(el('div', { class: 'small', html: md('Kaffe på 90 °C står i et rom på 20 °C. Modellen: i hvert minutt synker temperaturen med en andel **k** av temperaturforskjellen. Sett blokkene i riktig rekkefølge med ↑ ↓. Alt **under** `gjenta` er inni løkka. Trykk så **Kjør**.') }));
        wrap.appendChild(makeCanvas());
        wrap.appendChild(legend());
        const box = el('div', { class: 'kl-prog', 'aria-label': 'Program' });
        const g = prog.indexOf('gjenta');
        prog.forEach((id, i) => {
          const line = el('div', { class: 'kl-line' + (g >= 0 && i > g ? ' in' : '') });
          line.append(
            el('div', { class: 'kl-code ' + BLOCKS[id].cls, text: BLOCKS[id].code }),
            el('button', { class: 'kl-ib', 'aria-label': 'Flytt opp', text: '↑', disabled: i === 0 || null, onclick: () => { sfx('click'); [prog[i - 1], prog[i]] = [prog[i], prog[i - 1]]; renderBuild(); } }),
            el('button', { class: 'kl-ib', 'aria-label': 'Flytt ned', text: '↓', disabled: i === prog.length - 1 || null, onclick: () => { sfx('click'); [prog[i + 1], prog[i]] = [prog[i], prog[i + 1]]; renderBuild(); } }),
            el('button', { class: 'kl-ib', 'aria-label': 'Fjern', text: '✕', onclick: () => { sfx('click'); prog.splice(i, 1); renderBuild(); } }),
          );
          box.appendChild(line);
        });
        if (!prog.length) box.appendChild(el('div', { class: 'small muted', text: 'Programmet er tomt.' }));
        wrap.appendChild(box);
        const missing = ['sett90', 'gjenta', 'oppdater', 'tegn', 'sett20'].filter((id) => !prog.includes(id) && (id !== 'sett20' || d >= 2));
        if (missing.length) {
          wrap.appendChild(el('div', { class: 'label', text: 'Legg til blokk' }));
          wrap.appendChild(el('div', { class: 'kl-pal' }, missing.map((id) => el('button', { class: 'btn small', text: '+ ' + BLOCKS[id].code, onclick: () => { sfx('click'); prog.push(id); renderBuild(); } }))));
        }
        const fb = el('div', { class: 'kl-fb' });
        if (msg) fb.appendChild(msg);
        wrap.appendChild(fb);
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'kl-run', text: '▶ Kjør programmet', onclick: () => doRun(fb) }));
        draw();
      }
      function doRun() {
        runs++;
        lastRun = run(prog, k);
        const dia = diagnose(prog);
        if (!dia) {
          buildOk = true;
          sfx('good');
          const box = el('div', { class: 'feedback good small', html: md('**Det virker!** Variabelen `T` husker temperaturen fra runde til runde, og løkka gjentar ett tidssteg (1 min) 30 ganger. Men kurven passer ikke med målingene ennå.') });
          renderBuild(box);
          const btn = wrap.querySelector('#kl-run');
          btn.replaceWith(el('button', { class: 'btn primary block', id: 'kl-next', text: 'Videre: juster k', onclick: () => { sfx('click'); renderFit(); } }));
        } else {
          sfx('bad');
          renderBuild(el('div', { class: 'feedback bad small', html: '<strong>Feilsøking:</strong> ' + md(dia) + (lastRun.err ? '<br><span class="muted">Feilmelding: ' + lastRun.err + '.</span>' : '') }));
        }
        draw();
      }

      /* ---------- Fase 2: tilpass k ---------- */
      function renderFit() {
        phase = 'fit';
        wrap.innerHTML = '';
        wrap.appendChild(header('2 · Tilpass modellen'));
        wrap.appendChild(el('div', { class: 'small', html: md('Juster parameteren **k** til den simulerte kurven treffer de målte punktene best mulig. Stor k betyr rask avkjøling. Avviket er gjennomsnittlig avstand mellom modell og måling (RMS).') }));
        wrap.appendChild(makeCanvas());
        wrap.appendChild(legend());
        const kval = el('div', { class: 'kl-kval' });
        const dev = el('div', { class: 'small num', style: { textAlign: 'center' } });
        const step = (dk) => () => { sfx('click'); k = NG.clamp(Math.round((k + dk) * 1000) / 1000, 0.01, 0.3); update(); };
        const row1 = el('div', { class: 'kl-k' }, [
          el('button', { class: 'btn', id: 'kl-kminus', text: '− 0,01', onclick: step(-0.01) }), kval,
          el('button', { class: 'btn', id: 'kl-kplus', text: '+ 0,01', onclick: step(0.01) }),
        ]);
        const row2 = el('div', { class: 'kl-k' }, [
          el('button', { class: 'btn small', text: '− 0,002', onclick: step(-0.002) }), dev,
          el('button', { class: 'btn small', text: '+ 0,002', onclick: step(0.002) }),
        ]);
        wrap.append(row1, row2);
        const accept = el('button', { class: 'btn primary block', id: 'kl-next', text: 'Godta modellen', onclick: () => { sfx('click'); acceptFit(); } });
        wrap.appendChild(accept);
        function update() {
          lastRun = run(['sett90', 'gjenta', 'oppdater', 'tegn'], k);
          const r = rms(k);
          kval.textContent = 'k = ' + NG.fmt(k, 3);
          dev.textContent = 'avvik ' + NG.fmt(r, 1) + ' °C';
          dev.style.color = r <= bestR + 0.6 ? 'var(--good)' : r <= bestR + 2.5 ? 'var(--warn)' : 'var(--chalk-dim)';
          draw();
        }
        update();
      }
      function acceptFit() {
        fitRms = rms(k);
        fitScore = NG.clamp(1 - (fitRms - bestR) / 4, 0, 1);
        sfx(fitScore > 0.8 ? 'good' : 'bad');
        renderCond();
      }

      /* ---------- Fase 3: betingelse ---------- */
      function renderCond() {
        phase = 'cond';
        wrap.innerHTML = '';
        wrap.appendChild(header('3 · Betingelse'));
        const good = fitScore > 0.8;
        wrap.appendChild(el('div', { class: 'feedback small ' + (good ? 'good' : 'bad'), html: md((good ? '**God tilpasning.** ' : '**Kunne passet bedre.** ') + 'Du valgte k = ' + NG.fmt(k, 3) + ' (avvik ' + NG.fmt(fitRms, 1) + ' °C). Best mulig er omtrent k = ' + NG.fmt(bestK, 3) + ' (avvik ' + NG.fmt(bestR, 1) + ' °C). Å tilpasse en parameter til data kalles å **kalibrere** modellen.') }));
        const p2 = ['sett90', 'gjenta', 'oppdater', 'tegn', 'hvis'];
        lastRun = run(p2, k);
        wrap.appendChild(el('div', { class: 'small', html: md('Nå legger vi til en **betingelse** inni løkka, slik at programmet varsler når kaffen er god å drikke (under 60 °C).') }));
        const box = el('div', { class: 'kl-prog' });
        p2.forEach((id, i) => box.appendChild(el('div', { class: 'kl-line' + (i > 1 ? ' in' : '') }, [el('div', { class: 'kl-code ' + BLOCKS[id].cls, text: BLOCKS[id].code })])));
        wrap.appendChild(box);
        wrap.appendChild(makeCanvas());
        wrap.appendChild(legend(true));
        const w = lastRun.warns;
        wrap.appendChild(el('div', { class: 'small', html: md(w.length ? 'Programmet varslet **' + w.length + ' ganger**, første gang etter ' + w[0] + ' min (røde streker).' : 'Programmet varslet aldri.') }));
        draw();
        const qs = [];
        qs.push({
          prompt: 'Programmet varsler i **hver** runde etter at T har falt under 60 °C. Hvordan får du bare **ett** varsel?',
          opts: [
            { t: 'Lag variabelen `varslet = usann` før løkka. Varsle bare hvis `T < 60` og `varslet` er usann, og sett så `varslet = sann`.', ok: true },
            { t: 'Flytt `hvis`-blokka opp foran løkka, så den bare kjøres én gang før selve simuleringen starter.', why: 'Da sjekkes betingelsen bare én gang, mens T = 90. Programmet varsler aldri.' },
            { t: 'Bytt `T < 60` med `T = 60`, slik at betingelsen bare slår til i det ene tidssteget der kaffen er nøyaktig 60 °C.', why: 'T endres i små hopp og blir nesten aldri nøyaktig 60,0. Da varsler programmet trolig aldri.' },
          ],
          explain: 'En betingelse sjekkes på nytt hver gang programmet kommer til den. Ekstra variabler («flagg») lar programmet huske hva som allerede har skjedd.',
        });
        const pool = [
          {
            prompt: 'Hva betyr det at oppdateringen står inni `gjenta 30 ganger`?',
            opts: [
              { t: 'Hver runde er ett tidssteg (1 min). Ny temperatur regnes ut fra forrige verdi, 30 ganger.', ok: true },
              { t: 'Datamaskinen regner ut temperaturen etter 30 minutter direkte, med én formel og helt uten mellomsteg.', why: 'Simuleringen går steg for steg. Hvert steg bygger på det forrige.' },
              { t: 'Den samme temperaturen tegnes 30 ganger.', why: 'T endres i hver runde fordi oppdateringen står inni løkka.' },
            ],
            explain: 'Løkka gjør simuleringen mulig: vi beskriver bare hva som skjer *i ett lite tidssteg*, og lar datamaskinen gjenta det.',
          },
          {
            prompt: 'Hvorfor må `sett T = 90` stå **før** løkka?',
            opts: [
              { t: 'T er en variabel som skal huske temperaturen fra runde til runde. Den skal bare få startverdien én gang.', ok: true },
              { t: 'Fordi datamaskinen egentlig leser programmet nedenfra og opp, så linja som står øverst, kjøres til slutt.', why: 'Programmet kjøres ovenfra og ned. Det er en **sekvens**.' },
              { t: 'Det spiller ingen rolle hvor den står.', why: 'Står den inni løkka, settes T tilbake til 90 i hver runde.' },
            ],
            explain: 'En variabel er et navngitt lager for en verdi som kan endres. Rekkefølgen (sekvensen) bestemmer når den endres.',
          },
          {
            prompt: 'Hvorfor kommer T aldri under 20 °C i simuleringen?',
            opts: [
              { t: 'Når T nærmer seg 20 °C, går temperaturforskjellen (T − 20) mot null, og da blir det nesten ingen energioverføring.', ok: true },
              { t: 'Fordi løkka har en innebygd sperre som stopper simuleringen så snart temperaturen har nådd romtemperatur, 20 °C.', why: 'Løkka går alltid 30 ganger. Det er formelen som gjør at endringen blir stadig mindre.' },
              { t: 'Fordi kaffen etter hvert har brukt opp all varmen den hadde i seg, og da kan den ikke bli kaldere enn rommet.', why: 'Varme er ikke noe kaffen *har*. Det er energi som overføres så lenge det er en temperaturforskjell.' },
            ],
            explain: 'Varme er energi som overføres på grunn av temperaturforskjell. Uten forskjell blir det ingen netto overføring (termofysikkens nulte lov).',
          },
        ];
        qs.push(...rng.shuffle(pool).slice(0, 1));
        qs.push(evap ? {
          prompt: 'I starten faller de målte temperaturene **raskere** enn modellen, og senere går de litt saktere. Hva er en sannsynlig forklaring?',
          opts: [
            { t: 'Når kaffen er veldig varm, tar fordamping fra overflaten med seg mye energi. Det er ikke med i modellen.', ok: true },
            { t: 'Målingene må være feil, for modellen bygger på en kjent naturlov, og da er det den som har rett.', why: 'Når data og modell ikke stemmer, er det like gjerne modellen som må forbedres. Den er en forenkling.' },
            { t: 'Kulde fra rommet strømmer raskere inn i kaffen når forskjellen er stor, og det har modellen ikke tatt med.', why: 'Det er energi som overføres fra den varme kaffen til omgivelsene. «Kulde» overføres ikke.' },
          ],
          explain: 'Newtons avkjølingslov er en **modell**. Den passer godt når varmetapet er omtrent proporsjonalt med temperaturforskjellen. Fordamping, lokk, koppens materiale og omrøring er ikke med. En simulering er ikke virkeligheten, men et verktøy for å utforske den.',
        } : {
          prompt: 'Den simulerte kurven passer bra med målingene. Hva er den beste konklusjonen?',
          opts: [
            { t: 'Modellen er en nyttig forenkling: fordamping, lokk, koppens materiale og omrøring er ikke med, eller er «gjemt» i k.', ok: true },
            { t: 'Simuleringen beviser at Newtons avkjølingslov er sann, og at den gjelder for all slags avkjøling i alle situasjoner.', why: 'At en modell passer med data, styrker den, men det beviser ingenting endelig.' },
            { t: 'Siden kurven passer så godt, vil den samme verdien av k også passe for kaffe med lokk i en termokopp.', why: 'k avhenger av kopp, lokk og omgivelser. Da må modellen kalibreres på nytt.' },
          ],
          explain: 'Newtons avkjølingslov er en **modell** med et gyldighetsområde. En simulering er ikke virkeligheten, men et verktøy for å utforske den. Styrker og begrensninger ved modeller er en del av kompetansemålet.',
        });
        let qi = 0;
        const holder = el('div', { class: 'stack' });
        wrap.appendChild(holder);
        const showQ = () => {
          holder.innerHTML = '';
          const q = qs[qi];
          holder.appendChild(el('div', { class: 'label', text: 'Spørsmål ' + (qi + 1) + ' av ' + qs.length }));
          holder.appendChild(el('div', { html: md(q.prompt) }));
          const btns = [];
          const fb = el('div', { class: 'stack' });
          rng.shuffle(q.opts).forEach((o) => {
            const b = el('button', { class: 'option small', html: md(o.t) });
            b.addEventListener('click', () => {
              if (b.disabled) return;
              btns.forEach((x) => { x.b.disabled = true; if (x.o.ok) x.b.classList.add('correct'); else if (x.b !== b) x.b.classList.add('dim'); });
              if (!o.ok) b.classList.add('wrong');
              quiz.push({ ok: !!o.ok });
              sfx(o.ok ? 'good' : 'bad');
              fb.appendChild(el('div', { class: 'feedback small ' + (o.ok ? 'good' : 'bad'), html: (o.ok ? '' : md(o.why || '') + '<br>') + md(q.explain) }));
              const last = qi >= qs.length - 1;
              fb.appendChild(el('button', { class: 'btn primary block', id: 'kl-next', text: last ? 'Se oppsummering' : 'Neste spørsmål', onclick: () => { sfx('click'); if (last) renderSummary(); else { qi++; showQ(); } } }));
              try { fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
            });
            btns.push({ b, o });
            holder.appendChild(b);
          });
          holder.appendChild(fb);
        };
        showQ();
      }

      /* ---------- Oppsummering ---------- */
      let result = null;
      function renderSummary() {
        phase = 'summary';
        const buildScore = !buildOk ? 0 : runs <= 1 ? 1 : runs === 2 ? 0.7 : 0.4;
        const qOk = quiz.filter((q) => q.ok).length;
        const total = 2 + quiz.length;
        const score = NG.clamp((buildScore + fitScore + qOk) / total, 0, 1);
        const correct = (buildScore >= 0.7 ? 1 : 0) + (fitScore > 0.8 ? 1 : 0) + qOk;
        result = {
          score: Math.round(score * 100) / 100, correct, total,
          notes: `Bygde simuleringen etter ${runs} kjøring(er); k = ${NG.fmt(k, 3)} mot beste ${NG.fmt(bestK, 3)} (avvik ${NG.fmt(fitRms, 1)} °C); spørsmål ${qOk}/${quiz.length} (løkke/variabel/betingelse/modellens begrensninger).`,
        };
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Resultat' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(score * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(score * 100) + '%', background: 'var(--r-teknologi)' } })]),
          el('div', { class: 'small', text: `Program: ${runs} kjøring(er) · tilpasning: ${Math.round(fitScore * 100)} % · spørsmål: ${qOk}/${quiz.length}` }),
        ]));
        wrap.appendChild(el('div', { class: 'feedback small', html: md(
          '**Læringspoenget**\n' +
          'Du brukte programmering til å **utforske et fenomen**, ikke bare til å «kode». **Variabelen** T husker tilstanden, **løkka** gjentar ett lite tidssteg, og **betingelsen** reagerer på tilstanden. ' +
          'Simuleringen er en **modell**: du kalibrerte k mot målinger og så hva modellen ikke får med. Med elever kan du la dem endre k (lokk, kopptype) og teste prediksjonene med termometer. Det kobler kompetansemålet «bruke programmering til å utforske naturfaglige fenomener» til arbeid med modellers styrker og begrensninger.') }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'kl-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        cleanup();
        api.done(result);
        const b = wrap.querySelector('#kl-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }
      function cleanup() { alive = false; window.removeEventListener('resize', onResize); }

      renderBuild();
      return { destroy() { cleanup(); } };
    },
  });
})();
