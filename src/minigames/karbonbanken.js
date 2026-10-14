/* Mini-spill: Karbonbanken (liv) — karbonkretsløpet som en bank med kontoer.
   Hendelser flytter karbon mellom kontoer; spilleren forutsier effekten på atmosfæren og flytter riktig vei.
   Skiller rask del (fotosyntese/celleånding) fra langsom del (lagre i jord og fossile lagre). */
(function () {
  'use strict';
  const ID = 'karbonbanken';

  NG.css(`
.mg-karbonbanken { display: flex; flex-direction: column; gap: 12px; }
.mg-karbonbanken .kb-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.mg-karbonbanken .kb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-karbonbanken .kb-acc { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; min-height: 76px; padding: 8px 10px; border-radius: var(--r-m);
  border: 2px solid var(--line-strong); background: var(--board-2); color: var(--chalk); text-align: left; cursor: pointer; touch-action: manipulation; }
.mg-karbonbanken .kb-acc:disabled { cursor: default; }
.mg-karbonbanken .kb-acc.wide { grid-column: 1 / -1; }
.mg-karbonbanken .kb-acc .kb-name { font-weight: 700; }
.mg-karbonbanken .kb-acc .kb-val { font-family: var(--f-mono); font-size: 1.1rem; color: var(--r-liv); }
.mg-karbonbanken .kb-acc .kb-tag { font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-karbonbanken .kb-acc.armed { border-color: var(--r-liv); }
.mg-karbonbanken .kb-acc.from { border-color: var(--warn); background: var(--board-4); }
.mg-karbonbanken .kb-acc.hit { border-color: var(--good); }
.mg-karbonbanken .kb-acc.miss { border-color: var(--bad); }
.mg-karbonbanken .kb-delta { position: absolute; right: 8px; top: 8px; font-family: var(--f-mono); font-weight: 700; animation: kbPop 1.6s ease forwards; }
.mg-karbonbanken .kb-delta.up { color: var(--good); }
.mg-karbonbanken .kb-delta.down { color: var(--bad); }
@keyframes kbPop { 0% { transform: translateY(6px); opacity: 0; } 15% { opacity: 1; transform: none; } 80% { opacity: 1; } 100% { opacity: 0; } }
.mg-karbonbanken .kb-event { border-left: 4px solid var(--r-liv); }
.mg-karbonbanken .kb-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mg-karbonbanken .kb-three .option { text-align: center; padding: 8px 4px; }
.mg-karbonbanken .kb-log { font-family: var(--f-mono); font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-karbonbanken .kb-pick { display: flex; flex-direction: column; gap: 8px; }
`);

  const ACC = [
    { id: 'atm', name: 'Atmosfære', v: 780, tag: 'rask del · CO₂ i lufta', wide: true },
    { id: 'pla', name: 'Planter', v: 575, tag: 'rask del · biomasse' },
    { id: 'hav', name: 'Hav', v: 38000, tag: 'overflate rask, dyphav langsom' },
    { id: 'jord', name: 'Jord', v: 2700, tag: 'langsom del · myr, permafrost' },
    { id: 'fos', name: 'Fossile lagre', v: 1500, tag: 'langsom del · kull, olje, gass (anslag)' },
  ];
  const NAMES = Object.fromEntries(ACC.map((a) => [a.id, a.name]));

  // eff: +1 atmosfæren øker, −1 minker, 0 uendret (nå)
  const EVENTS = [
    { id: 'brann', title: 'Skogbrann', icon: '🔥', text: 'Et lyngbål sprer seg, og en stor skog brenner ned.', from: 'pla', to: 'atm', amt: 3, eff: 1, slow: false,
      why: 'Forbrenning er rask oksidasjon — kjemisk det samme som celleånding. Karbonet ble tatt opp fra lufta for noen tiår siden, så dette er den **raske delen**: ny skog kan ta det opp igjen.' },
    { id: 'gjengroing', title: 'Gjengroing', icon: '🌲', text: 'Gamle beitemarker gror igjen med bjørk og gran.', from: 'atm', to: 'pla', amt: 2, eff: -1, slow: false,
      why: '**Fotosyntese**: CO~2~ fra lufta bygges inn i ved og blader. Massen i et tre kommer fra lufta — ikke fra jorda. Rask del.' },
    { id: 'myr', title: 'Myr drenert', icon: '⛏', text: 'En myr grøftes ut for å bli dyrket mark.', from: 'jord', to: 'atm', amt: 2, eff: 1, slow: true,
      why: 'Når vannet forsvinner, kommer oksygen ned i torva, og nedbryterne setter fart. Karbon som er lagret over **tusenvis av år** (langsom del), slippes ut på noen tiår.' },
    { id: 'permafrost', title: 'Permafrost tiner', icon: '🧊', text: 'Varmere somre får frossen jord i Arktis til å tine.', from: 'jord', to: 'atm', amt: 4, eff: 1, slow: true,
      why: 'Frossent plantemateriale har nesten ikke brutt ned. Tiner det, våkner nedbryterne: CO~2~ og metan slippes ut → mer oppvarming → mer tining (**tilbakekobling**). Langsom del frigjøres.' },
    { id: 'kull', title: 'Kullkraftverk', icon: '🏭', text: 'Et kraftverk brenner kull døgnet rundt.', from: 'fos', to: 'atm', amt: 8, eff: 1, slow: true,
      why: 'Kullet er planterester som har vært **ute av kretsløpet i millioner av år**. Nå flyttes karbonet inn i den raske delen — et netto tilskudd til lufta, hav og planter samlet.' },
    { id: 'alger', title: 'Algeoppblomstring', icon: '🌊', text: 'Planteplankton blomstrer i Nordsjøen om våren.', from: 'atm', to: 'hav', amt: 2, eff: -1, slow: false,
      why: 'Planteplankton driver **fotosyntese** med CO~2~ løst i vannet, og havet tar opp mer CO~2~ fra lufta. Noe av det døde planktonet synker til dyphavet og blir liggende lenge.' },
    { id: 'lov', title: 'Høstløv', icon: '🍂', text: 'Løvet faller og blir liggende på skogbunnen.', from: 'pla', to: 'jord', amt: 3, eff: 0, slow: false,
      why: 'Dødt plantemateriale blir til organisk materiale i jorda. Atmosfæren endres ikke **nå** — men nedbryterne vil i løpet av noen år sende mye av karbonet tilbake som CO~2~ (celleånding hos sopp og bakterier).' },
    { id: 'natt', title: 'Natt i skogen', icon: '🌙', text: 'En stille sommernatt i en stor skog.', from: 'pla', to: 'atm', amt: 2, eff: 1, slow: false,
      why: 'Om natta er det ingen fotosyntese, men **celleåndingen** går som alltid. Netto går karbon fra plantene til lufta — og tilbake igjen om dagen. Rask del.' },
  ];

  NG.minigames.register({
    id: ID, region: 'liv', title: 'Karbonbanken', icon: 'coins',
    concepts: ['karbonkretslop', 'karbonlager', 'stoffkretslop-energistrom', 'fotosyntese', 'celleanding'],
    blurb: 'Flytt karbon mellom bankkontoene og se hva som skjer med atmosfæren.',
    minutes: 3,
    start(root, api) {
      const h = api.el;
      const rng = api.rng;
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      root.classList.add('mg-' + ID);
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const timers = new Set();
      let dead = false;
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (!dead) fn(); }, ms); timers.add(t); };
      const clearAll = () => { for (const t of timers) clearTimeout(t); timers.clear(); };
      const scrollUp = () => { try { root.scrollIntoView({ block: 'start' }); } catch (e) { /* ok */ } };
      const fmtN = (n) => Number(n).toLocaleString('nb-NO');

      // Velg hendelser: minst én fra langsom del og minst ett opptak fra lufta
      const n = d === 1 ? 4 : 5;
      const slow = rng.pick(EVENTS.filter((e) => e.slow));
      const up = rng.pick(EVENTS.filter((e) => e.eff < 0));
      const rest = rng.shuffle(EVENTS.filter((e) => e !== slow && e !== up)).slice(0, n - 2);
      const events = rng.shuffle([slow, up, ...rest]);

      const bal = Object.fromEntries(ACC.map((a) => [a.id, a.v]));
      const accEls = {};
      let correct = 0, total = 0;
      const notes = [];
      const log = [];

      function header(title, chip) {
        return h('div', { class: 'kb-top' }, [h('h2', { class: 'h-display', text: title }), chip ? h('span', { class: 'chip', text: chip }) : null]);
      }

      function bank(onTap) {
        const grid = h('div', { class: 'kb-grid' });
        for (const a of ACC) {
          const val = h('span', { class: 'kb-val', text: fmtN(bal[a.id]) + ' Gt C' });
          const b = h('button', { class: 'kb-acc' + (a.wide ? ' wide' : ''), 'data-acc': a.id, disabled: !onTap, onclick: () => onTap && onTap(a.id) }, [
            h('span', { class: 'kb-name', text: a.name }), val, h('span', { class: 'kb-tag', text: a.tag })]);
          accEls[a.id] = { b, val };
          grid.append(b);
        }
        return grid;
      }

      function transfer(from, to, amt) {
        bal[from] -= amt; bal[to] += amt;
        for (const [id, sign] of [[from, -1], [to, 1]]) {
          const e = accEls[id]; if (!e) continue;
          e.val.textContent = fmtN(bal[id]) + ' Gt C';
          const dl = h('span', { class: 'kb-delta ' + (sign > 0 ? 'up' : 'down'), text: (sign > 0 ? '+' : '−') + amt });
          e.b.append(dl);
          later(() => dl.remove(), 1700);
        }
      }

      // ---------- Intro ----------
      function intro() {
        root.innerHTML = '';
        root.append(header('Karbonbanken', null),
          h('div', { html: api.md('Karbon blir aldri borte — det flyttes bare mellom **kontoer**. Tallene er gigatonn karbon (Gt C).\n**Rask del:** fotosyntese og celleånding flytter karbon mellom luft, planter og havoverflate på dager til tiår.\n**Langsom del:** myr, permafrost og fossile lagre bindes og frigjøres over tusenvis til millioner av år.') }),
          bank(null),
          h('button', { class: 'btn primary block', id: 'kb-next', onclick: () => step(0) }, `Åpne banken (${events.length} hendelser) →`));
        scrollUp();
      }

      // ---------- Hendelser ----------
      function step(i) {
        clearAll();
        const ev = events[i];
        root.innerHTML = '';
        const effBox = h('div', { class: 'stack-s' });
        const fbBox = h('div', { class: 'stack' });
        const prompt = h('div', { class: 'small', html: '<strong>1.</strong> Forutsi: hva skjer med <strong>atmosfærens</strong> konto?' });
        const effs = [{ v: 1, t: '↑ Øker' }, { v: 0, t: '= Uendret' }, { v: -1, t: '↓ Minker' }];
        let predOk = false;
        const effBtns = effs.map((o) => h('button', { class: 'option', onclick: () => predict(o.v) }, o.t));
        effBox.append(prompt, h('div', { class: 'kb-three' }, effBtns));
        let from = null;
        const grid = bank(null);
        const moveTxt = h('div', { class: 'small muted', html: '<strong>2.</strong> Flytt karbonet: trykk kontoen det kommer <em>fra</em>, så kontoen det går <em>til</em>.' });
        root.append(header(ev.icon + ' ' + ev.title, `Hendelse ${i + 1}/${events.length}`),
          h('div', { class: 'card kb-event', text: ev.text }), effBox, moveTxt, grid, fbBox,
          log.length ? h('div', { class: 'kb-log', text: 'Logg: ' + log.join(' · ') }) : null);
        moveTxt.style.opacity = '0.45';
        scrollUp();

        function predict(v) {
          if (effBtns[0].disabled) return;
          predOk = v === ev.eff;
          effBtns.forEach((b, k) => { b.disabled = true; const ov = effs[k].v; b.classList.add(ov === ev.eff ? 'correct' : ov === v ? 'wrong' : 'dim'); });
          sfx('click');
          moveTxt.style.opacity = '1';
          for (const a of ACC) { const e = accEls[a.id]; e.b.disabled = false; e.b.classList.add('armed'); e.b.onclick = () => tap(a.id); }
        }
        function tap(id) {
          if (!from) { from = id; accEls[id].b.classList.add('from'); sfx('click'); return; }
          if (id === from) { accEls[id].b.classList.remove('from'); from = null; return; }
          const to = id;
          const moveOk = from === ev.from && to === ev.to;
          for (const a of ACC) { const e = accEls[a.id]; e.b.disabled = true; e.b.classList.remove('armed', 'from'); }
          accEls[ev.from].b.classList.add('hit'); accEls[ev.to].b.classList.add('hit');
          if (!moveOk) { if (from !== ev.from && from !== ev.to) accEls[from].b.classList.add('miss'); if (to !== ev.from && to !== ev.to) accEls[to].b.classList.add('miss'); }
          transfer(ev.from, ev.to, ev.amt);
          log.push(`${NAMES[ev.from]}→${NAMES[ev.to]} ${ev.amt}`);
          total += 2; correct += (predOk ? 1 : 0) + (moveOk ? 1 : 0);
          if (!predOk) notes.push(ev.id + ': feil forutsigelse');
          if (!moveOk) notes.push(ev.id + ': feil retning');
          sfx(predOk && moveOk ? 'good' : 'bad');
          const head = moveOk
            ? (predOk ? '<strong>Riktig flytt og riktig forutsigelse.</strong> ' : '<strong>Riktig flytt</strong> — men se på atmosfæren. ')
            : `<strong>Karbonet går fra ${NAMES[ev.from]} til ${NAMES[ev.to]}.</strong> `;
          fbBox.append(h('div', { class: 'feedback ' + (predOk && moveOk ? 'good' : 'bad'), html: head +
            `<span class="chip" style="margin:0 4px">${ev.slow ? 'langsom → rask' : 'rask del'}</span> ` + api.md(ev.why) }),
          h('button', { class: 'btn primary block', id: 'kb-next', onclick: () => (i + 1 < events.length ? step(i + 1) : slowQ()) }, 'Neste →'));
        }
      }

      // ---------- Rask/langsom ----------
      function slowQ() {
        clearAll();
        root.innerHTML = '';
        const chosen = new Set();
        const fbBox = h('div', { class: 'stack' });
        const btns = events.map((ev) => h('button', { class: 'option', onclick: () => {
          if (chosen.has(ev.id)) chosen.delete(ev.id); else chosen.add(ev.id);
          btn(ev).classList.toggle('selected', chosen.has(ev.id)); sfx('click');
        } }, ev.icon + ' ' + ev.title));
        const btn = (ev) => btns[events.indexOf(ev)];
        let checkBtn;
        root.append(header('Rask eller langsom?', 'Til slutt 1/2'),
          h('div', { html: api.md('Hvilke hendelser flyttet karbon fra den **langsomme delen** (lagret i tusenvis til millioner av år) inn i den raske? Velg alle som passer.') }),
          h('div', { class: 'kb-pick' }, btns),
          checkBtn = h('button', { class: 'btn primary block', id: 'kb-check', onclick: check }, 'Sjekk'), fbBox);
        scrollUp();
        function check() {
          checkBtn.disabled = true;
          const ok = events.every((ev) => chosen.has(ev.id) === ev.slow);
          total++; if (ok) correct++; else notes.push('skilte ikke rask/langsom del');
          sfx(ok ? 'good' : 'bad');
          events.forEach((ev) => { const b = btn(ev); b.disabled = true; b.classList.remove('selected'); b.classList.add(ev.slow ? 'correct' : chosen.has(ev.id) ? 'wrong' : 'dim'); });
          fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: api.md((ok ? '**Riktig.** ' : '**De grønne er riktige.** ') +
            'Fotosyntese, celleånding, brann og løvfall flytter karbon som har vært i lufta nylig — det kan tas opp igjen. Fossilt karbon og torv/permafrost har vært lagret svært lenge; når det frigjøres, øker mengden karbon i den raske delen totalt.') }),
          h('button', { class: 'btn primary block', id: 'kb-next', onclick: energyQ }, 'Videre →'));
        }
      }

      // ---------- Stoff og energi ----------
      function energyQ() {
        root.innerHTML = '';
        const q = {
          q: 'Vi sier: «**Stoff går i kretsløp, energi strømmer gjennom.**» Hva betyr det?',
          options: [
            'Karbonatomene brukes om og om igjen, mens energien fra sola til slutt går ut som varme og ikke kommer tilbake',
            'Energien lagres i karbonet og går rundt i kretsløpet sammen med det',
            'Karbon brukes opp i celleåndingen og må hele tiden fylles på fra sola',
            'Både stoff og energi forsvinner når noe brennes, derfor trengs nye tilførsler',
          ],
          answer: 0,
          why: 'Summen av karbon i alle kontoene er konstant — se banken din. Energi kommer inn som sollys, bindes som kjemisk energi i fotosyntesen og frigjøres i celleåndingen, men ender som spredt varme. Derfor må sola hele tiden fylle på.',
        };
        const order = rng.shuffle(q.options.map((x, i) => i));
        const fbBox = h('div', { class: 'stack' });
        let picked = false;
        const btns = order.map((oi) => h('button', { class: 'option', html: api.md(q.options[oi]), onclick: () => {
          if (picked) return; picked = true;
          const ok = oi === q.answer;
          total++; if (ok) correct++; else notes.push('stoff vs. energi');
          sfx(ok ? 'good' : 'bad');
          btns.forEach((b, k) => { const i = order[k]; b.disabled = true; b.classList.add(i === q.answer ? 'correct' : i === oi ? 'wrong' : 'dim'); });
          fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Riktig.</strong> ' : '<strong>Ikke helt.</strong> ') + api.md(q.why) }),
            h('button', { class: 'btn primary block', id: 'kb-next', onclick: summary }, 'Se kontoutskriften →'));
        } }));
        root.append(header('Stoff og energi', 'Til slutt 2/2'), h('div', { html: api.md(q.q) }), h('div', { class: 'stack-s' }, btns), fbBox);
        scrollUp();
      }

      function summary() {
        clearAll();
        root.innerHTML = '';
        const score = total ? correct / total : 0;
        const dAtm = bal.atm - 780;
        const sumStart = ACC.reduce((s, a) => s + a.v, 0);
        const sumNow = ACC.reduce((s, a) => s + bal[a.id], 0);
        let doneBtn;
        root.append(header('Kontoutskrift', null),
          bank(null),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: `Resultat: ${correct} av ${total}` }),
            h('div', { html: api.md(`Atmosfæren endte på **${fmtN(bal.atm)} Gt C** (${dAtm >= 0 ? '+' : '−'}${Math.abs(dAtm)}). Sum i alle kontoer: ${fmtN(sumStart)} → ${fmtN(sumNow)} Gt C — **karbon er bevart**, det bare flytter seg.\n**Rask del:** fotosyntese tar karbon ut av lufta, celleånding (og brann, nedbryting) sender det tilbake.\n**Langsom del:** myr, permafrost og fossile lagre. Tapper vi dem, vokser atmosfærens konto — og klimaet endres.\n**Stoff går i kretsløp, energi strømmer gjennom.**`) }),
          ]),
          doneBtn = h('button', { class: 'btn primary block', id: 'kb-done', onclick: () => { doneBtn.disabled = true; clearAll(); api.done({ score, correct, total, notes: notes.join('; ') || 'alt riktig' }); } }, 'Fullfør laben'));
        scrollUp();
      }

      intro();
      return { destroy() { dead = true; clearAll(); } };
    },
  });
})();
