/* Mini-spill: 10 %-pyramiden (liv) — bygg en næringskjede, regn ut energien i hvert ledd
   (ca. 10 % videre), finn ut hvor de 90 % blir av, og hvorfor sola må fylle på. */
(function () {
  'use strict';
  const ID = 'naeringsnettet';

  NG.css(`
.mg-naeringsnettet { display: flex; flex-direction: column; gap: 12px; }
.mg-naeringsnettet .nn-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.mg-naeringsnettet .nn-slots { display: flex; flex-direction: column-reverse; gap: 6px; }
.mg-naeringsnettet .nn-slot { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; min-height: 52px; padding: 6px 12px; border-radius: var(--r-m);
  border: 2px dashed var(--line-strong); background: var(--board-2); color: var(--chalk); text-align: left; cursor: pointer; touch-action: manipulation; }
.mg-naeringsnettet .nn-slot.filled { border-style: solid; }
.mg-naeringsnettet .nn-slot.ok { border-color: var(--good); }
.mg-naeringsnettet .nn-slot.no { border-color: var(--bad); }
.mg-naeringsnettet .nn-slot.next { border-color: var(--warn); }
.mg-naeringsnettet .nn-slot .nn-role { font-size: var(--t-xs); color: var(--chalk-dim); font-family: var(--f-mono); text-transform: uppercase; letter-spacing: .05em; }
.mg-naeringsnettet .nn-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.mg-naeringsnettet .nn-card { min-height: 48px; padding: 8px; border-radius: var(--r-m); border: 2px solid var(--line-strong); background: var(--board-3); color: var(--chalk); font-weight: 700; cursor: pointer; touch-action: manipulation; }
.mg-naeringsnettet .nn-card:disabled { opacity: .3; cursor: default; }
.mg-naeringsnettet .nn-pyr svg { display: block; width: 100%; height: auto; }
.mg-naeringsnettet .nn-two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mg-naeringsnettet .nn-two .option { text-align: center; font-family: var(--f-mono); font-weight: 700; }
`);

  const CHAINS = [
    { id: 'eng', name: 'Enga', links: ['🌾 Gress', '🦗 Gresshoppe', '🐸 Frosk', '🪶 Hegre'] },
    { id: 'hav', name: 'Norskehavet', links: ['🦠 Planteplankton', '🦐 Raudåte', '🐟 Sild', '🐋 Spekkhogger'] },
    { id: 'skog', name: 'Skogen', links: ['🫐 Blåbærlyng', '🐭 Skogmus', '🐾 Røyskatt', '🦉 Hubro'] },
    { id: 'sjo', name: 'Innsjøen', links: ['🌿 Grønnalger', '🦐 Vannloppe', '🐟 Abbor', '🦅 Fiskeørn'] },
  ];
  const DECOYS = [
    { t: '☀ Sola', why: '**Sola** er energikilden, ikke en organisme. Den står utenfor kjeden og fyller på energi i produsentleddet.' },
    { t: '🍄 Sopp', why: '**Sopp** er en nedbryter. Den får dødt materiale fra *alle* ledd og hører ikke til ett trinn i beitekjeden.' },
    { t: '🪱 Meitemark', why: '**Meitemarken** er en nedbryter (detritivor). Den lever av dødt materiale fra alle ledd.' },
  ];
  const ROLES = ['Produsent', 'Primærkonsument', 'Sekundærkonsument', 'Tertiærkonsument (topp)'];

  NG.minigames.register({
    id: ID, region: 'liv', title: '10 %-pyramiden', icon: 'pyramid',
    concepts: ['naeringskjede', 'tiprosentregelen', 'produsent', 'konsument', 'nedbrytere', 'stoffkretslop-energistrom'],
    blurb: 'Bygg en næringskjede og følg energien ledd for ledd — hvor blir det av 90 %?',
    minutes: 3,
    start(root, api) {
      const h = api.el;
      const rng = api.rng;
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      root.classList.add('mg-' + ID);
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const scrollUp = () => { try { root.scrollIntoView({ block: 'start' }); } catch (e) { /* ok */ } };
      const fmtN = (n) => Number(n).toLocaleString('nb-NO', { maximumFractionDigits: 1 });

      const chain = rng.pick(CHAINS);
      const decoys = d === 1 ? [DECOYS[0], DECOYS[1]] : DECOYS.slice();
      const E0 = d === 1 ? 10000 : rng.pick(d === 2 ? [10000, 20000] : [5000, 20000, 30000]);
      const energy = [E0, null, null, null];
      let correct = 0, total = 0;
      const notes = [];

      function header(title, chip) {
        return h('div', { class: 'nn-top' }, [h('h2', { class: 'h-display', text: title }), chip ? h('span', { class: 'chip', text: chip }) : null]);
      }

      // Pyramide (SVG): lineær bredde, så 10 %-fallet blir synlig
      function pyramid(showHeat) {
        const W = 320, rowH = 34, top = 8;
        let s = '';
        for (let i = 3; i >= 0; i--) {
          const y = top + (3 - i) * (rowH + 6);
          const e = energy[i];
          const w = e == null ? 40 : Math.max(6, (e / E0) * 220);
          const x = 150 - w / 2;
          const known = e != null;
          s += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${rowH}" rx="4" fill="var(--r-liv)" fill-opacity="${known ? 0.35 : 0.08}" stroke="var(--r-liv)" stroke-width="2.5" ${known ? '' : 'stroke-dasharray="5 4"'}/>`;
          const inside = w >= 90;
          s += `<text x="${inside ? 150 : (150 + w / 2 + 8).toFixed(1)}" y="${y + 22}" text-anchor="${inside ? 'middle' : 'start'}" fill="var(--chalk)" font-size="13" font-family="var(--f-mono)" font-weight="600">${known ? fmtN(e) + ' kJ' : '? kJ'}</text>`;
          if (showHeat && i > 0 && energy[i] != null) {
            s += `<text x="20" y="${y + 21}" fill="var(--heat)" font-size="11" font-family="var(--f-mono)">× 0,10 · 90 % ut</text>`;
          }
          s += `<text x="4" y="${y + 21}" fill="var(--chalk-dim)" font-size="11" font-family="var(--f-mono)">${i + 1}</text>`;
        }
        const H = top + 4 * (rowH + 6);
        return h('div', { class: 'nn-pyr', html: `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Energipyramide">${s}</svg>` });
      }

      // ---------- 1. Bygg kjeden ----------
      function build() {
        root.innerHTML = '';
        const deck = rng.shuffle(chain.links.map((t) => ({ t, ok: true })).concat(decoys.map((x) => ({ t: x.t, ok: false, why: x.why }))));
        const slots = [null, null, null, null];
        let tries = 0;
        const fbBox = h('div', { class: 'stack' });
        const slotEls = ROLES.map((r, i) => h('button', { class: 'nn-slot', 'data-slot': String(i), onclick: () => { if (slots[i] != null && !locked) { slots[i] = null; sfx('click'); refresh(); } } }));
        const cardEls = deck.map((c, ci) => h('button', { class: 'nn-card', 'data-card': String(ci), onclick: () => place(ci) }, c.t));
        let locked = false;
        const checkBtn = h('button', { class: 'btn primary block', id: 'nn-check', onclick: check }, 'Sjekk kjeden');
        root.append(header('10 %-pyramiden', 'Steg 1/4 · Kjede'),
          h('div', { class: 'small', html: api.md(`**${chain.name}.** Trykk kortene i rekkefølge fra **produsent** (nederst) og oppover. Trykk et fylt ledd for å ta kortet ut igjen. Ikke alle kort hører hjemme i kjeden!`) }),
          h('div', { class: 'nn-slots' }, slotEls), h('div', { class: 'nn-cards' }, cardEls), checkBtn, fbBox);
        refresh();
        scrollUp();

        function place(ci) {
          if (locked || slots.includes(ci)) return;
          const free = slots.indexOf(null);
          if (free < 0) return;
          slots[free] = ci; sfx('click'); refresh();
        }
        function refresh() {
          const next = slots.indexOf(null);
          slotEls.forEach((el, i) => {
            el.className = 'nn-slot' + (slots[i] != null ? ' filled' : '') + (i === next && !locked ? ' next' : '');
            el.replaceChildren(h('span', null, [h('div', { class: 'nn-role', text: (i + 1) + ' · ' + ROLES[i] }), h('div', { text: slots[i] != null ? deck[slots[i]].t : '—' })]),
              h('span', { class: 'muted small', text: slots[i] != null && !locked ? '✕' : '' }));
          });
          cardEls.forEach((el, ci) => { el.disabled = locked || slots.includes(ci); });
          checkBtn.disabled = locked || slots.includes(null);
        }
        function check() {
          tries++;
          const wrongIdx = slots.map((ci, i) => (deck[ci].t === chain.links[i] ? -1 : i)).filter((i) => i >= 0);
          if (!wrongIdx.length) {
            locked = true;
            const pts = tries === 1 ? 1 : 0.5;
            correct += pts; total++;
            sfx('good');
            refresh();
            slotEls.forEach((el) => el.classList.add('ok'));
            fbBox.replaceChildren(h('div', { class: 'feedback good', html: api.md('**Riktig kjede!** Produsenten fanger energi fra sola med fotosyntese; hvert neste ledd spiser leddet under.') }), nextBtn());
            return;
          }
          sfx('bad');
          const msgs = [];
          for (const i of wrongIdx) { const c = deck[slots[i]]; if (!c.ok) msgs.push(c.why); }
          if (!msgs.length) msgs.push('Alle kortene er riktige organismer, men rekkefølgen stemmer ikke. Hvem spiser hvem?');
          if (tries >= 2) {
            locked = true; total++; notes.push('kjeden måtte vises');
            chain.links.forEach((t, i) => { slots[i] = deck.findIndex((c) => c.t === t); });
            refresh();
            slotEls.forEach((el) => el.classList.add('ok'));
            fbBox.replaceChildren(h('div', { class: 'feedback bad', html: api.md(msgs.join('\n') + '\nHer er riktig kjede.') }), nextBtn());
          } else {
            for (const i of wrongIdx) slots[i] = null;
            refresh();
            wrongIdx.forEach((i) => slotEls[i].classList.add('no'));
            fbBox.replaceChildren(h('div', { class: 'feedback bad', html: api.md(msgs.join('\n') + '\nDe gale leddene er tømt — prøv igjen.') }));
          }
        }
        function nextBtn() { return h('button', { class: 'btn primary block', id: 'nn-next', onclick: () => calc(1) }, 'Følg energien →'); }
      }

      // ---------- 2. Regn energien ----------
      function calc(i) {
        root.innerHTML = '';
        const prev = energy[i - 1];
        const right = prev / 10;
        const opts = [
          { v: right, ok: true },
          { v: prev * 0.9, why: 'Det er *tapet* som er ca. 90 %. Bare ca. 10 % går videre til neste ledd.' },
          { v: prev / 2, why: 'Mye mindre enn halvparten går videre — ca. 10 %.' },
          { v: prev / 100, why: 'Ca. 1 % er det produsentene fanger av sollyset. Fra ledd til ledd går ca. 10 % videre.' },
        ];
        const order = rng.shuffle(opts);
        const fbBox = h('div', { class: 'stack' });
        let picked = false;
        const btns = order.map((o) => h('button', { class: 'option', onclick: () => choose(o) }, fmtN(o.v) + ' kJ'));
        const intro = i === 1
          ? `Sollyset gir ca. ${fmtN(E0 * 100)} kJ per m² i året. **${chain.links[0]}** fanger bare ca. 1 % — **${fmtN(E0)} kJ**.\nHvor mye energi når **${chain.links[1]}**?`
          : `**${chain.links[i - 1]}** har ${fmtN(prev)} kJ. Hvor mye når **${chain.links[i]}**?`;
        root.append(header('Følg energien', `Steg 2/4 · Ledd ${i + 1}`), pyramid(false), h('div', { html: api.md(intro) }), h('div', { class: 'nn-two' }, btns), fbBox);
        scrollUp();
        function choose(o) {
          if (picked) return; picked = true;
          total++; if (o.ok) correct++; else notes.push(`ledd ${i + 1}: valgte ${fmtN(o.v)} kJ`);
          sfx(o.ok ? 'good' : 'bad');
          btns.forEach((b, k) => { b.disabled = true; b.classList.add(order[k].ok ? 'correct' : order[k] === o ? 'wrong' : 'dim'); });
          energy[i] = right;
          root.querySelector('.nn-pyr').replaceWith(pyramid(true));
          fbBox.append(h('div', { class: 'feedback ' + (o.ok ? 'good' : 'bad'), html: api.md((o.ok ? '**Riktig:** ' : o.why + '\n') + `${fmtN(prev)} kJ × 0,10 = **${fmtN(right)} kJ**. Resten — ${fmtN(prev - right)} kJ — går ut av kjeden.`) }),
            h('button', { class: 'btn primary block', id: 'nn-next', onclick: () => (i < 3 ? calc(i + 1) : where()) }, i < 3 ? 'Neste ledd →' : 'Hvor ble det av? →'));
        }
      }

      // ---------- 3. Hvor blir 90 % av? ----------
      function where() {
        root.innerHTML = '';
        const OPTS = rng.shuffle([
          { t: 'Celleånding i hvert ledd — blir til slutt varme (kroppsvarme, bevegelse)', ok: true },
          { t: 'Ufordøyd mat (avføring) — går til nedbryterne', ok: true },
          { t: 'Deler som ikke blir spist (røtter, bein, døde planter) — går til nedbryterne', ok: true },
          { t: 'Energien går tilbake til jorda og tas opp av plantene igjen', ok: false },
          { t: 'Energien brukes opp og blir borte', ok: false },
        ]);
        const chosen = new Set();
        const fbBox = h('div', { class: 'stack' });
        const btns = OPTS.map((o, k) => h('button', { class: 'option', onclick: () => {
          if (chosen.has(k)) chosen.delete(k); else chosen.add(k);
          btns[k].classList.toggle('selected', chosen.has(k)); sfx('click');
        } }, o.t));
        let checkBtn;
        root.append(header('Hvor blir 90 % av?', 'Steg 3/4'), pyramid(true),
          h('div', { html: api.md('Velg **alle** riktige.') }), h('div', { class: 'stack-s' }, btns),
          checkBtn = h('button', { class: 'btn primary block', id: 'nn-check', onclick: check }, 'Sjekk'), fbBox);
        scrollUp();
        function check() {
          checkBtn.disabled = true;
          const ok = OPTS.every((o, k) => chosen.has(k) === o.ok);
          total++; if (ok) correct++; else notes.push('hvor 90 % blir av');
          sfx(ok ? 'good' : 'bad');
          OPTS.forEach((o, k) => { const b = btns[k]; b.disabled = true; b.classList.remove('selected'); b.classList.add(o.ok ? 'correct' : chosen.has(k) ? 'wrong' : 'dim'); });
          fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: api.md((ok ? '**Riktig.** ' : '**De grønne er riktige.** ') +
            'Energi blir aldri borte (1. lov), men den blir **spredt som varme** og kan ikke brukes av noe nytt ledd (2. lov). Det nedbryterne får, ender også som varme fra *deres* celleånding. Energien går ikke tilbake til plantene — bare *stoffene* gjør det.') }),
          h('button', { class: 'btn primary block', id: 'nn-next', onclick: () => final(0) }, 'Videre →'));
        }
      }

      // ---------- 4. Konsekvenser ----------
      const top = chain.links[3].replace(/^\S+\s/, '').toLowerCase();
      const prod = chain.links[0].replace(/^\S+\s/, '').toLowerCase();
      const FINAL = [
        { q: 'Hvorfor må **sola hele tiden fylle på** energi i økosystemet?',
          options: ['Energien går ut som varme og kan ikke fanges av produsentene igjen — energi strømmer gjennom, den går ikke i kretsløp',
            'Plantene bruker opp energien i jorda, så den må erstattes',
            'Energien blir ødelagt i hvert ledd',
            'Nedbryterne sender energien tilbake til plantene, men for sakte'],
          answer: 0,
          why: '**Stoff går i kretsløp, energi strømmer gjennom.** Karbon og nitrogen kommer tilbake via nedbryterne; energien forlater systemet som varme. Uten nytt sollys stopper alt.' },
        { q: `Hvorfor finnes det **få toppredatorer** (som ${top}) og mange flere organismer lenger ned?`,
          options: ['På toppen er bare ca. 0,1 % av energien produsentene fanget igjen — det rekker til få individer, og et nytt ledd over ville fått nesten ingenting',
            'Toppredatorer er store og trenger lite mat i forhold til størrelsen',
            'Toppredatorene spiser hverandre',
            'Det er bare tilfeldig — antallet kunne like gjerne vært snudd'],
          answer: 0,
          why: `Fra ${fmtN(E0)} kJ til ${fmtN(energy[3] || E0 / 1000)} kJ på tre ledd. Derfor finnes det få toppredatorer, og næringskjeder har sjelden mer enn 4–5 ledd. (10 % er en tommelfingerregel — i virkeligheten varierer det.)` },
      ];
      if (d >= 2) FINAL.push({
        q: `Med 10 % per ledd: hvor mange kg ${prod} trengs for å lage **1 kg ${top}** gjennom tre ledd?`,
        options: ['1000 kg', '30 kg', '100 kg', '10 000 kg'], answer: 0,
        why: '1 kg topp ← 10 kg ← 100 kg ← **1000 kg**. De fleste gjetter altfor lavt fordi de legger sammen i stedet for å gange med 10 for hvert ledd.' });

      function final(qi) {
        root.innerHTML = '';
        const q = FINAL[qi];
        const order = rng.shuffle(q.options.map((x, i) => i));
        const fbBox = h('div', { class: 'stack' });
        let picked = false;
        const btns = order.map((oi) => h('button', { class: 'option', html: api.md(q.options[oi]), onclick: () => {
          if (picked) return; picked = true;
          const ok = oi === q.answer;
          total++; if (ok) correct++; else notes.push('konsekvens ' + (qi + 1));
          sfx(ok ? 'good' : 'bad');
          btns.forEach((b, k) => { const i = order[k]; b.disabled = true; b.classList.add(i === q.answer ? 'correct' : i === oi ? 'wrong' : 'dim'); });
          fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Riktig.</strong> ' : '<strong>Ikke helt.</strong> ') + api.md(q.why) }),
            h('button', { class: 'btn primary block', id: 'nn-next', onclick: () => (qi + 1 < FINAL.length ? final(qi + 1) : summary()) }, 'Videre →'));
        } }));
        root.append(header('Hva betyr det?', `Steg 4/4 · ${qi + 1}/${FINAL.length}`), h('div', { html: api.md(q.q) }), h('div', { class: 'stack-s' }, btns), fbBox);
        scrollUp();
      }

      function summary() {
        root.innerHTML = '';
        const score = total ? correct / total : 0;
        let doneBtn;
        root.append(header('Energi strømmer gjennom', null), pyramid(true),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: `Resultat: ${fmtN(correct)} av ${total}` }),
            h('div', { html: api.md(`**${chain.links.join(' → ')}**\nCa. **10 %** av energien går videre per ledd; ca. 90 % går tapt som **varme** (celleånding) eller til nedbryterne (ufordøyd og ikke spist) — som også ender som varme.\n**Stoff går i kretsløp, energi strømmer gjennom:** derfor må sola fylle på hele tiden, og derfor er det få toppredatorer.`) }),
          ]),
          doneBtn = h('button', { class: 'btn primary block', id: 'nn-done', onclick: () => { doneBtn.disabled = true; api.done({ score, correct, total, notes: notes.join('; ') || 'alt riktig' }); } }, 'Fullfør laben'));
        scrollUp();
      }

      build();
      return { destroy() { /* ingen timere */ } };
    },
  });
})();
