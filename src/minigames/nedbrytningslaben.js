/* Mini-spill: Tea Bag-laben (liv) — design et rettferdig nedbrytingsforsøk med Tea Bag Index,
   kjør en simulert 90-dagers nedgraving og tolk k og S. Myr, permafrost og tilbakekobling. */
(function () {
  'use strict';
  const ID = 'nedbrytningslaben';

  NG.css(`
.mg-nedbrytningslaben { display: flex; flex-direction: column; gap: 12px; }
.mg-nedbrytningslaben .nl-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.mg-nedbrytningslaben .nl-q { border-left: 4px solid var(--r-liv); padding: 8px 12px; background: var(--board-2); border-radius: 0 var(--r-m) var(--r-m) 0; font-weight: 700; }
.mg-nedbrytningslaben .nl-var { display: grid; grid-template-columns: minmax(0, 1fr) repeat(3, 66px); gap: 4px; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--line); }
.mg-nedbrytningslaben .nl-var .nl-name { font-size: var(--t-s); line-height: 1.25; }
.mg-nedbrytningslaben .nl-var .nl-name small { display: block; color: var(--chalk-dim); font-size: var(--t-xs); }
.mg-nedbrytningslaben .nl-seg { min-height: 44px; padding: 2px; font-size: 0.74rem; border-radius: var(--r-s); border: 2px solid var(--line-strong); background: var(--board-2); color: var(--chalk); font-weight: 700; cursor: pointer; touch-action: manipulation; }
.mg-nedbrytningslaben .nl-seg.on { border-color: var(--warn); background: var(--board-4); }
.mg-nedbrytningslaben .nl-seg.ok { border-color: var(--good); }
.mg-nedbrytningslaben .nl-seg.no { border-color: var(--bad); }
.mg-nedbrytningslaben .nl-seg:disabled { cursor: default; }
.mg-nedbrytningslaben .nl-hdr { display: grid; grid-template-columns: minmax(0, 1fr) repeat(3, 66px); gap: 4px; }
.mg-nedbrytningslaben .nl-hdr span { font-size: 0.66rem; text-align: center; color: var(--chalk-dim); font-family: var(--f-mono); text-transform: uppercase; }
.mg-nedbrytningslaben .nl-site { display: grid; grid-template-columns: 1fr; gap: 6px; }
.mg-nedbrytningslaben .nl-bag { display: grid; grid-template-columns: 74px 1fr 52px; gap: 8px; align-items: center; font-size: var(--t-s); }
.mg-nedbrytningslaben .nl-bag .bar { height: 14px; }
.mg-nedbrytningslaben .nl-bag .num { text-align: right; }
.mg-nedbrytningslaben .nl-kS { display: flex; gap: 8px; flex-wrap: wrap; }
.mg-nedbrytningslaben .nl-svg svg { display: block; width: 100%; height: auto; }
`);

  const HG = 0.842, HR = 0.552; // hydrolyserbar fraksjon i grønn te og rooibos (Keuskamp mfl. 2013)
  const DAYS = 90;

  const QUESTIONS = [
    { id: 'temp', q: 'Påvirker temperatur nedbrytningen?', uv: 'temp',
      setup: 'Like potter med samme jord står i tre klimaskap.',
      sites: [{ n: '4 °C', k: 0.006, S: 0.30 }, { n: '12 °C', k: 0.012, S: 0.23 }, { n: '20 °C', k: 0.020, S: 0.16 }],
      expl: 'Høyere temperatur gir mer aktive nedbrytere (sopp og bakterier) — raskere nedbryting.' },
    { id: 'fukt', q: 'Påvirker fuktighet nedbrytningen?', uv: 'fukt',
      setup: 'Like potter med samme jord og temperatur, men ulikt vanninnhold.',
      sites: [{ n: 'Tørr', k: 0.005, S: 0.33 }, { n: 'Fuktig', k: 0.018, S: 0.18 }, { n: 'Vannmettet (som myr)', k: 0.004, S: 0.37 }],
      expl: 'Nedbryterne trenger vann — men i vannmettet jord blir det lite oksygen, og nedbrytingen går tregt igjen. Mest fart i fuktig, luftig jord.' },
    { id: 'ph', q: 'Påvirker surhet (pH) i jorda nedbrytningen?', uv: 'ph',
      setup: 'Like potter med samme jordtype, kalket til ulik pH.',
      sites: [{ n: 'pH 4,5', k: 0.006, S: 0.31 }, { n: 'pH 6,0', k: 0.011, S: 0.24 }, { n: 'pH 7,5', k: 0.016, S: 0.18 }],
      expl: 'Mange nedbrytere, særlig bakterier, trives dårlig i sur jord. Derfor brytes for eksempel torv i sur myr ned sakte.' },
  ];

  const VARS = [
    { id: 'temp', name: 'Temperatur' },
    { id: 'fukt', name: 'Fuktighet' },
    { id: 'ph', name: 'pH i jorda' },
    { id: 'jord', name: 'Jordtype' },
    { id: 'tid', name: 'Tid i jorda', sub: '90 dager' },
    { id: 'pose', name: 'Tepose-type', sub: 'grønn te + rooibos' },
    { id: 'masse', name: 'Massetap', sub: 'vei posene før/etter' },
  ];
  const ROLES = ['Endres', 'Måles', 'Konstant'];

  NG.minigames.register({
    id: ID, region: 'liv', title: 'Tea Bag-laben', icon: 'flask',
    concepts: ['nedbryting', 'tea-bag-index', 'nedbrytingsforsok', 'karbonlager', 'pr-variabelkontroll'],
    blurb: 'Design et rettferdig nedbrytingsforsøk med teposer og finn ut hvorfor myr lagrer karbon.',
    minutes: 3,
    start(root, api) {
      const h = api.el;
      const rng = api.rng;
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      root.classList.add('mg-' + ID);
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      let anim = null;
      let dead = false;
      const stop = () => { if (anim) { clearInterval(anim); anim = null; } };
      const fmt = (n, dd) => Number(n).toLocaleString('nb-NO', { minimumFractionDigits: dd, maximumFractionDigits: dd });
      const scrollUp = () => { try { root.scrollIntoView({ block: 'start' }); } catch (e) { /* ok */ } };

      const Q = rng.pick(QUESTIONS);
      let correct = 0, total = 0;
      const notes = [];

      function header(title, chip) {
        return h('div', { class: 'nl-top' }, [h('h2', { class: 'h-display', text: title }), chip ? h('span', { class: 'chip', text: chip }) : null]);
      }

      // ---------- 1. Design forsøket ----------
      function design() {
        root.innerHTML = '';
        const pick = {};
        const rowsBtns = {};
        const rows = VARS.map((v) => {
          const btns = ROLES.map((r, ri) => h('button', { class: 'nl-seg', 'data-var': v.id, 'data-role': String(ri), 'aria-label': v.name + ': ' + r, onclick: () => {
            pick[v.id] = ri; sfx('click');
            btns.forEach((b, j) => b.classList.toggle('on', j === ri));
          } }, r));
          rowsBtns[v.id] = btns;
          return h('div', { class: 'nl-var' }, [h('div', { class: 'nl-name', html: v.name + (v.sub ? `<small>${v.sub}</small>` : '') }), ...btns]);
        });
        const fbBox = h('div', { class: 'stack' });
        let checkBtn;
        root.append(
          header('Tea Bag-laben', 'Steg 1/3 · Design'),
          h('div', { class: 'small', html: api.md('**Tea Bag Index** er borgerforskning: man graver ned to teposer og veier dem etter 90 dager. **Grønn te** brytes raskt ned, **rooibos** sakte. Massetapet gir **k** (hastighet) og **S** (stabilisering: hvor mye som «låses» og ikke brytes ned).') }),
          h('div', { class: 'nl-q', text: 'Forskningsspørsmål: «' + Q.q + '»' }),
          h('div', { class: 'small muted', text: 'Gi hver variabel en rolle. Et rettferdig forsøk endrer én ting om gangen.' }),
          h('div', { class: 'nl-hdr' }, [h('span'), ...ROLES.map((r) => h('span', { text: r }))]),
          h('div', null, rows),
          checkBtn = h('button', { class: 'btn primary block', id: 'nl-check', onclick: check }, 'Sjekk designet'),
          fbBox,
        );
        scrollUp();

        function want(id) { return id === Q.uv ? 0 : id === 'masse' ? 1 : 2; }
        function check() {
          checkBtn.disabled = true;
          const msgs = [];
          const changed = VARS.filter((v) => pick[v.id] === 0).map((v) => v.id);
          const uvOk = pick[Q.uv] === 0 && pick.masse === 1;
          const constOk = VARS.every((v) => v.id === Q.uv || v.id === 'masse' || pick[v.id] === 2);
          if (pick[Q.uv] !== 0) msgs.push(`Spørsmålet handler om **${VARS.find((v) => v.id === Q.uv).name.toLowerCase()}** — det er den du endrer (**uavhengig variabel**).`);
          if (pick.masse !== 1) msgs.push('**Massetapet** er det du måler (**avhengig variabel**) — responsen du vil se om endrer seg.');
          if (changed.length > 1) msgs.push('Du endrer flere variabler samtidig. Da kan du ikke vite hvilken av dem som ga forskjellen i massetap.');
          if (!constOk) msgs.push('Alt annet må holdes likt i alle potter (**kontrollvariabler**) — også tiden og teposene, ellers sammenligner du epler og pærer.');
          if (pick.pose === 0) msgs.push('Begge teposetypene graves ned *overalt* — samme par i alle potter. Paret er det som gjør at vi kan regne ut både k og S.');
          total += 2; correct += (uvOk ? 1 : 0) + (constOk ? 1 : 0);
          if (!uvOk) notes.push('uavhengig/avhengig variabel feil');
          if (!constOk) notes.push('kontrollvariabler ikke holdt konstant');
          sfx(uvOk && constOk ? 'good' : 'bad');
          // vis riktig design
          VARS.forEach((v) => rowsBtns[v.id].forEach((b, j) => {
            b.disabled = true; b.classList.remove('on');
            if (j === want(v.id)) b.classList.add(pick[v.id] === j ? 'ok' : 'on');
            else if (pick[v.id] === j) b.classList.add('no');
          }));
          fbBox.append(h('div', { class: 'feedback ' + (uvOk && constOk ? 'good' : 'bad'), html: uvOk && constOk
            ? api.md('**Rettferdig forsøk!** Én uavhengig variabel, massetap som avhengig variabel, resten kontrollvariabler. ' + Q.setup)
            : api.md(msgs.join('\n') + '\nRiktig design er markert. ' + Q.setup) }),
          h('button', { class: 'btn primary block', id: 'nl-next', onclick: bury }, 'Grav ned teposene →'));
        }
      }

      // ---------- 2. Simulert nedgraving ----------
      let data = null;
      function simulate() {
        const noise = () => (rng.next() - 0.5) * 0.02; // ±1 prosentpoeng
        return Q.sites.map((s) => {
          const ag = HG * (1 - s.S);
          const ar = HR * (1 - s.S);
          const lossG = NG.clamp(ag + noise(), 0.3, 0.95);
          const lossR = NG.clamp(ar * (1 - Math.exp(-s.k * DAYS)) + noise() * 0.8, 0.05, 0.6);
          // TBI-utregning fra «målte» data
          const S = 1 - lossG / HG;
          const arM = HR * (1 - S);
          const rem = (1 - lossR) - (1 - arM);
          const k = rem > 0.005 ? Math.log(arM / rem) / DAYS : 0.04;
          return { n: s.n, lossG, lossR, S, k };
        });
      }

      function bury() {
        root.innerHTML = '';
        data = simulate();
        const order = rng.shuffle(data.map((x, i) => i));
        const dayLbl = h('span', { class: 'chip num', text: 'Dag 0' });
        const cards = order.map((i) => {
          const s = data[i];
          const gBar = h('i', { style: { width: '100%', background: 'var(--r-liv)' } });
          const rBar = h('i', { style: { width: '100%', background: 'var(--heat)' } });
          const gNum = h('span', { class: 'num small', text: '0 %' });
          const rNum = h('span', { class: 'num small', text: '0 %' });
          const kS = h('div', { class: 'nl-kS' });
          const card = h('div', { class: 'card nl-site' }, [
            h('strong', { text: s.n }),
            h('div', { class: 'nl-bag' }, [h('span', { text: 'Grønn te' }), h('div', { class: 'bar' }, gBar), gNum]),
            h('div', { class: 'nl-bag' }, [h('span', { text: 'Rooibos' }), h('div', { class: 'bar' }, rBar), rNum]),
            kS,
          ]);
          return { s, gBar, rBar, gNum, rNum, kS, card };
        });
        let nextBtn;
        root.append(header('90 dager i jorda', 'Steg 2/3 · Data'),
          h('div', { class: 'small muted', text: Q.setup + ' Stolpene viser masse som er igjen; tallet er massetapet.' }),
          h('div', { class: 'row' }, [h('span', { class: 'label', text: 'Tid' }), dayLbl]),
          ...cards.map((c) => c.card),
          nextBtn = h('button', { class: 'btn primary block', id: 'nl-next', disabled: true, onclick: interpret }, 'Tolk dataene →'));
        scrollUp();
        let day = 0;
        anim = setInterval(() => {
          if (dead) return;
          day = Math.min(DAYS, day + 3);
          const f = day / DAYS;
          dayLbl.textContent = 'Dag ' + day;
          for (const c of cards) {
            // grønn te: rask fase først; rooibos: jevnt og sakte (kosmetisk forløp mot målt sluttverdi)
            const g = c.s.lossG * (1 - Math.exp(-5 * f)) / (1 - Math.exp(-5));
            const r = c.s.lossR * f;
            c.gBar.style.width = ((1 - g) * 100).toFixed(1) + '%';
            c.rBar.style.width = ((1 - r) * 100).toFixed(1) + '%';
            c.gNum.textContent = Math.round(g * 100) + ' %';
            c.rNum.textContent = Math.round(r * 100) + ' %';
          }
          if (day >= DAYS) {
            stop();
            for (const c of cards) {
              c.gNum.textContent = fmt(c.s.lossG * 100, 1) + ' %';
              c.rNum.textContent = fmt(c.s.lossR * 100, 1) + ' %';
              c.kS.append(h('span', { class: 'chip', text: 'k = ' + fmt(c.s.k, 3) + ' per døgn' }), h('span', { class: 'chip', text: 'S = ' + fmt(c.s.S, 2) }));
            }
            nextBtn.disabled = false;
            sfx('coin');
          }
        }, 45);
      }

      // ---------- 3. Tolkning ----------
      function interpret() {
        const best = data.reduce((a, b) => (b.k > a.k ? b : a));
        const qs = [
          { q: 'Hvilken behandling har **høyest k** (raskest nedbryting)?',
            options: data.map((s) => s.n), answer: data.indexOf(best),
            why: `**${best.n}**: k = ${fmt(best.k, 3)} per døgn. ${Q.expl} Legg merke til at høy k ofte følger med lav S — mindre av materialet blir stabilisert.` },
          { q: 'Myr og permafrost lagrer enorme mengder karbon. Hvorfor?',
            options: ['Nedbrytingen går svært sakte (kaldt, vannmettet, lite oksygen), så dødt plantemateriale hoper seg opp', 'Plantene der har mer fotosyntese enn i skogen', 'Det finnes ingen nedbrytere i myr og permafrost', 'Karbonet blir til jord og er dermed ute av kretsløpet for alltid'],
            answer: 0,
            why: 'Lav k: mer dødt materiale tilføres enn det som brytes ned. Torv og frossen jord er et karbonlager bygd opp over tusenvis av år. Nedbrytere finnes der — de er bare trege.' },
          { q: 'Hva skjer hvis permafrosten tiner?',
            options: ['Nedbrytingen øker → mer CO~2~ og metan til lufta → sterkere drivhuseffekt → mer tining', 'Flere planter vokser og tar opp akkurat like mye karbon, så ingenting endres', 'Karbonet er låst for alltid, så ingenting skjer', 'Det lagres mer karbon fordi varmen gjør jorda fruktbar'],
            answer: 0,
            why: 'Det er en **positiv tilbakekobling**: oppvarming → raskere nedbryting → mer klimagass → mer oppvarming. Endringer i nedbryting virker altså tilbake på klimaet.' },
        ];
        if (d >= 2) qs.splice(1, 0, {
          q: 'Hvorfor graver man ned **både** grønn te og rooibos?',
          options: ['Grønn te viser hvor mye som stabiliseres (S), rooibos brytes sakte nok til å måle hastigheten (k)', 'For å ha en reserve hvis én pose blir borte', 'Rooibos er kontrollgruppen som ikke brytes ned', 'For å teste hvilken te nedbryterne liker best'],
          answer: 0,
          why: 'Grønn te er nesten ferdig nedbrutt i den raske fasen etter 90 dager → gir S. Rooibos er fortsatt i den raske fasen → gir k. To materialer, to faser.' });
        let qi = 0;
        function show() {
          root.innerHTML = '';
          const q = qs[qi];
          const order = rng.shuffle(q.options.map((x, i) => i));
          const fbBox = h('div', { class: 'stack' });
          let picked = false;
          const btns = order.map((oi) => h('button', { class: 'option', html: api.md(q.options[oi]), onclick: () => choose(oi) }));
          function choose(oi) {
            if (picked) return; picked = true;
            const ok = oi === q.answer;
            total++; if (ok) correct++; else notes.push('tolkning: ' + q.q.replace(/\*/g, '').slice(0, 40));
            sfx(ok ? 'good' : 'bad');
            btns.forEach((b, k) => { const i = order[k]; b.disabled = true; b.classList.add(i === q.answer ? 'correct' : i === oi ? 'wrong' : 'dim'); });
            fbBox.append(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), html: (ok ? '<strong>Riktig.</strong> ' : '<strong>Ikke helt.</strong> ') + api.md(q.why) }),
              h('button', { class: 'btn primary block', id: 'nl-next', onclick: () => { qi++; if (qi < qs.length) show(); else summary(); } }, 'Videre →'));
          }
          const tbl = qi === 0 ? h('div', { class: 'card small num', html: data.map((s) => `${s.n}: k = ${fmt(s.k, 3)} · S = ${fmt(s.S, 2)}`).join('<br>') }) : null;
          root.append(header('Tolk dataene', `Steg 3/3 · ${qi + 1}/${qs.length}`), tbl, h('div', { html: api.md(q.q) }), h('div', { class: 'stack-s' }, btns), fbBox);
          scrollUp();
        }
        show();
      }

      function summary() {
        root.innerHTML = '';
        const score = total ? correct / total : 0;
        let doneBtn;
        root.append(header('Sakte nedbryting = karbonlager', null),
          h('div', { class: 'card stack-s' }, [
            h('div', { class: 'label', text: `Resultat: ${correct} av ${total}` }),
            h('div', { html: api.md('**Variabelkontroll:** endre én variabel (uavhengig), mål massetapet (avhengig), hold resten likt (kontrollvariabler).\n**Nedbryting** styres av temperatur, fuktighet, pH, næring, materialet og hvilke nedbrytere som finnes. **k** = hastighet, **S** = hvor mye som stabiliseres.\nDer nedbrytingen er treg (myr, permafrost), hoper karbonet seg opp. Tiner eller dreneres slike lagre, øker nedbrytingen — og klimaet påvirkes tilbake (**tilbakekobling**).') }),
          ]),
          doneBtn = h('button', { class: 'btn primary block', id: 'nl-done', onclick: () => { doneBtn.disabled = true; stop(); api.done({ score, correct, total, notes: notes.join('; ') || 'alt riktig (' + Q.id + ')' }); } }, 'Fullfør laben'));
        scrollUp();
      }

      design();
      return { destroy() { dead = true; stop(); } };
    },
  });
})();
