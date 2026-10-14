/* Mini-spill: Elevsamtalen (didaktikk). Dialogsimulering: en elev avslører en elevforestilling
   om energi/varme (Henriksen & Angell 2019). Spilleren 1) diagnostiserer, 2) velger undervisningsgrep,
   3) velger hva hun/han sier. Elevens forståelsesmåler stiger eller synker. */
(function () {
  'use strict';
  const ID = 'elevsamtalen';

  NG.css(`
.mg-elevsamtalen { display: flex; flex-direction: column; gap: 12px; }
.mg-elevsamtalen .es-top { display: flex; gap: 12px; align-items: center; }
.mg-elevsamtalen .es-face { flex: 0 0 64px; width: 64px; height: 64px; }
.mg-elevsamtalen .es-face svg { width: 64px; height: 64px; display: block; }
.mg-elevsamtalen .es-meter { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.mg-elevsamtalen .es-bubble { position: relative; background: var(--chalk); color: var(--board); border-radius: 16px; padding: 12px 14px; font-size: 1.02rem; line-height: 1.4; }
.mg-elevsamtalen .es-bubble::before { content: ''; position: absolute; left: 22px; top: -10px; border: 10px solid transparent; border-top: 0; border-bottom-color: var(--chalk); }
.mg-elevsamtalen .es-bubble.me { background: var(--board-3); color: var(--chalk); border: 2px solid var(--r-didaktikk); }
.mg-elevsamtalen .es-bubble.me::before { left: auto; right: 22px; border-bottom-color: var(--r-didaktikk); }
.mg-elevsamtalen .es-ctx { font-size: var(--t-s); color: var(--chalk-dim); }
.mg-elevsamtalen .es-step { font-family: var(--f-mono); font-size: var(--t-xs); color: var(--r-didaktikk); text-transform: uppercase; letter-spacing: 0.08em; }
.mg-elevsamtalen .es-tool small { display: block; color: var(--chalk-dim); font-size: var(--t-xs); margin-top: 2px; }
.mg-elevsamtalen .es-delta { font-family: var(--f-mono); font-weight: 600; }
.mg-elevsamtalen .es-delta.up { color: var(--good); }
.mg-elevsamtalen .es-delta.down { color: var(--bad); }
.mg-elevsamtalen .es-pill { color: var(--r-didaktikk); border-color: color-mix(in srgb, var(--r-didaktikk) 50%, transparent); }
.mg-elevsamtalen .es-list { margin: 0; padding-left: 1.2em; }
`);

  const MIS = {
    levende: 'Energi finnes bare i levende ting',
    bevegelse: 'Energi krever bevegelse',
    kraft: 'Energi er det samme som kraft',
    bevaring: 'Energi blir brukt opp (bevaring trengs ikke for å forklare)',
    biologi: 'Biologiske prosesser lager energi',
    stoff: 'Energi er et stoff som ligger lagret i ting',
    metall: 'Temperatur er en egenskap ved materialet («metall er kaldt»)',
    molekyl: 'Enkeltmolekyler kan være varme',
    kulde: 'Kulde overføres',
  };
  // Forestillinger som ligner så mye at de ikke bør stå som distraktorer for hverandre
  const NEAR = { bevaring: ['stoff'], stoff: ['bevaring', 'levende'], levende: ['biologi', 'stoff'], biologi: ['levende'], metall: ['kulde'], kulde: ['metall'] };

  const TOOLS = {
    grubletegning: { name: 'Grubletegning', desc: 'Figurer med ulike påstander om fenomenet. Elevene diskuterer hvem som har rett.' },
    energikjede: { name: 'Energikjede', desc: 'Følg energien fra kilden, gjennom omdanninger, til der den havner.' },
    partikkel: { name: 'Partikkelmodellen', desc: 'Forklar fenomenet med partikler som hele tiden er i bevegelse.' },
    sprakbro: { name: 'Bro fra hverdagsspråk til fagspråk', desc: 'Sammenlign hvordan ordet brukes i hverdagen og i faget.' },
    termometer: { name: 'Forsøk med termometer', desc: 'Eleven forutsier, måler og sammenligner med det hun eller han kjenner.' },
    peb: { name: 'Påstand – evidens – begrunnelse', desc: 'Eleven formulerer en påstand, finner evidens og begrunner.' },
    definisjon: { name: 'Gi riktig definisjon og gå videre', desc: 'Si fasiten tydelig, så eleven kan skrive den ned.' },
  };

  const SC = [
    { m: 'levende', ctx: 'Klassen snakker om hva som har energi.',
      says: 'Det er bare levende ting som har energi. Bilen har ikke energi, den har jo bensin.',
      best: 'energikjede', ok: 'sprakbro',
      why: 'En energikjede viser at energien i bensinen (kjemisk energi) kommer fra sola via planter for millioner av år siden, og blir til bevegelse og varme i bilen. Energi er ikke knyttet til liv.',
      say: [
        { k: 'good', t: '«Hva skjer med bensinen når bilen kjører? La oss tegne hvor energien kommer fra og hvor den går.»', r: '«Hm … bensinen brenner, og da får bilen fart. Så energien er i bensinen, selv om den ikke lever?»' },
        { k: 'tell', t: '«Det er feil. Bensin inneholder kjemisk energi. Det står i læreboka på side 40.»', r: '«Ok …» (Eleven skriver det ned, men vet ikke hvorfor.)' },
        { k: 'bad', t: '«Ja, det stemmer at levende ting har mer energi enn ting som ikke lever.»', r: '«Ja, steiner og biler er jo døde. De har ingenting.»' },
      ] },
    { m: 'bevegelse', ctx: 'En ball ligger oppå klasseromsskapet.',
      says: 'Ballen oppå skapet har ingen energi. Den får energi først når den faller.',
      best: 'grubletegning', ok: 'energikjede',
      why: 'En grubletegning med ulike påstander om ballen på skapet får elevene til å argumentere. Ballen har stillingsenergi (potensiell energi) fordi noen gjorde arbeid da den ble løftet opp.',
      say: [
        { k: 'good', t: '«Hvor kommer farten fra når ballen faller? Var det noe der før den falt?»', r: '«Noen løftet den opp … så kanskje energien ble lagret da? Stillingsenergi?»' },
        { k: 'tell', t: '«Den har potensiell energi, Ep = mgh. Skriv det ned i boka di nå.»', r: '«Hva betyr mgh igjen?» (Formelen henger ikke sammen med noe for eleven.)' },
        { k: 'bad', t: '«Helt riktig, for energi er det samme som at noe er i bevegelse.»', r: '«Da har jeg ingen energi når jeg sover!»' },
      ] },
    { m: 'kraft', ctx: 'Etter en armbryting i friminuttet.',
      says: 'Energi og kraft er det samme. Jo sterkere du er, jo mer energi har du.',
      best: 'sprakbro', ok: 'grubletegning',
      why: 'I hverdagen brukes «kraft» og «energi» om hverandre. I fagspråket er kraft et dytt eller drag (newton), mens energi er det som kan få noe til å skje (joule). Arbeid (W = F·s) er broen mellom dem.',
      say: [
        { k: 'good', t: '«Du kan dytte hardt på veggen uten at den flytter seg. Brukte du kraft? Fikk veggen energi?»', r: '«Jeg dyttet med kraft … men veggen fikk ikke fart. Så kraft og energi er ikke helt det samme?»' },
        { k: 'tell', t: '«Kraft måles i newton og energi i joule, så de er to helt ulike størrelser.»', r: '«Ok, ulike enheter.» (Men eleven vet ikke hvordan de henger sammen.)' },
        { k: 'bad', t: '«Ja, sterke folk har mye energi lagret i musklene sine, det er sant.»', r: '«Så vektløftere har mest energi i hele verden!»' },
      ] },
    { m: 'bevaring', ctx: 'Lommelykta har lyst hele natta på leirskolen.',
      says: 'Når batteriet i lommelykta er tomt, er energien brukt opp. Den er bare borte.',
      best: 'energikjede', ok: 'grubletegning',
      why: 'Energikjeden batteri → elektrisk energi → lys og varme → litt varmere rom viser at energien ikke forsvinner. Den sprer seg og blir mindre nyttig fordi energikvaliteten synker.',
      say: [
        { k: 'good', t: '«Hvor ble det av energien? Ble lykta varm, og hvor ble det av alt lyset?»', r: '«Den ble varm … og lyset traff veggene. Så energien er i rommet, bare spredt utover?»' },
        { k: 'tell', t: '«Energi kan ikke forsvinne. Det sier energibevaringsloven, så husk den.»', r: '«Men batteriet ER jo tomt …» (Eleven ser ikke sammenhengen.)' },
        { k: 'bad', t: '«Ja, derfor må vi spare på energien, så den ikke tar slutt på jorda.»', r: '«Så energien i hele verden blir mindre og mindre?»' },
      ] },
    { m: 'biologi', ctx: 'Klassen har sådd karse i vinduskarmen.',
      says: 'Plantene lager energi når de gjør fotosyntese.',
      best: 'energikjede', ok: 'sprakbro',
      why: 'En energikjede som starter i sola viser at planten omdanner lysenergi til kjemisk energi. Planten lager stoff (glukose), men ikke energi.',
      say: [
        { k: 'good', t: '«Hvor får planten energien fra? Kan den gjøre fotosyntese inne i et mørkt skap?»', r: '«Nei, den trenger lys … så energien kommer fra sola, og planten gjør den om?»' },
        { k: 'tell', t: '«Planter omdanner energi. De lager den ikke. Det er en viktig forskjell.»', r: '«Hva er egentlig forskjellen på å lage og å omdanne?»' },
        { k: 'bad', t: '«Ja, plantene er naturens egne energifabrikker, det er helt riktig.»', r: '«Så hvis vi har nok planter, får vi uendelig med energi!»' },
      ] },
    { m: 'stoff', ctx: 'Matpakkelesing: det står kJ på brødposen.',
      says: 'Det er energi i brødskiva, som en usynlig saft som renner inn i musklene når vi spiser.',
      best: 'partikkel', ok: 'sprakbro',
      why: 'Med partikkelmodellen kan du vise at maten består av molekyler. Den kjemiske energien henger sammen med hvordan atomene er bundet, og frigjøres når stoffene reagerer med oksygen i cellene. Energi er ikke et eget stoff.',
      say: [
        { k: 'good', t: '«Hva skjer med stoffene i maten inne i kroppen? Trenger cellene noe mer enn maten?»', r: '«Maten blir brutt ned … og reagerer med oksygen? Så det er stoffene som endrer seg, og da frigjøres energi?»' },
        { k: 'tell', t: '«Energi er ikke et stoff, men en størrelse vi kan regne med. Husk det.»', r: '«Men det står jo kJ på brødposen?»' },
        { k: 'bad', t: '«Ja, og jo mer energisaft det er i maten, jo flere kalorier.»', r: '«Kan man helle energien over i en flaske da?»' },
      ] },
    { m: 'metall', ctx: 'Eleven legger hånda på bordbeinet og så på bordplaten.',
      says: 'Bordbeinet av metall er kaldere enn bordplaten av tre. Kjenn selv!',
      best: 'termometer', ok: 'peb',
      why: 'Mål begge med termometer. De har samme temperatur, romtemperatur. Metall føles kaldere fordi det leder energi raskere bort fra hånda. Forsøket gir evidens som eleven må forklare.',
      say: [
        { k: 'good', t: '«Godt observert! Hva tror du et termometer viser på beinet og på plata? La oss teste.»', r: '«Begge viser 21 °C?! Men metallet føles kaldere … Kanskje det leder varmen ut av hånda fortere?»' },
        { k: 'tell', t: '«Begge har romtemperatur. Det er bare følelsen din som lurer deg her.»', r: '«Men jeg KJENNER jo at det er kaldere …»' },
        { k: 'bad', t: '«Ja, metall er et kaldt materiale. Derfor er kjøleskap laget av metall.»', r: '«Så metall er alltid kaldt, til og med om sommeren?»' },
      ] },
    { m: 'molekyl', ctx: 'Vannet koker i en kjele på kjøkkenbenken.',
      says: 'Når vannet koker, blir hvert eneste vannmolekyl varmt.',
      best: 'partikkel', ok: 'grubletegning',
      why: 'Partikkelmodellen viser at temperatur er et mål på den *gjennomsnittlige* bevegelsesenergien til veldig mange partikler. Ett molekyl har en fart, men ingen temperatur.',
      say: [
        { k: 'good', t: '«Hvordan beveger molekylene seg i kokende vann sammenlignet med kaldt? Kan ett molekyl ha temperatur?»', r: '«De beveger seg fortere … og temperaturen er et slags gjennomsnitt av alle sammen? Da kan ikke ett molekyl være «varmt».»' },
        { k: 'tell', t: '«Molekyler er ikke varme. Temperatur gjelder bare for veldig mange partikler.»', r: '«Hvorfor det? Hvis alle er varme, er vel hver av dem varm?»' },
        { k: 'bad', t: '«Ja, de varme molekylene blir større og lyser litt rødt når de koker.»', r: '«Så molekylene vokser når vannet koker?»' },
      ] },
    { m: 'kulde', ctx: 'Brus med isbiter i kantina.',
      says: 'Isbitene gir kulde til brusen, derfor blir den kald.',
      best: 'partikkel', ok: 'termometer',
      why: 'Med partikkelmodellen ser eleven at de raske partiklene i brusen støter borti isen og overfører energi til den. Energi går fra varmt til kaldt: isen smelter og brusen avkjøles. «Kulde» overføres ikke.',
      say: [
        { k: 'good', t: '«Isen smelter jo. Hva trengs for å smelte is, og hvor kommer det fra her?»', r: '«Det trengs energi for å smelte … og den må komme fra brusen! Så energien går fra brusen til isen?»' },
        { k: 'tell', t: '«Det er varme som går fra brusen til isen, ikke kulde som går motsatt vei.»', r: '«Er ikke det bare to måter å si det samme på?»' },
        { k: 'bad', t: '«Ja, isen sender kulde ut i brusen, akkurat som en liten fryser.»', r: '«Da kan vi lagre kulde i fryseren til sommeren!»' },
      ] },
  ];

  const NAMES = ['Aisha', 'Jonas', 'Sofie', 'Emil', 'Nora', 'Ali', 'Ingrid', 'Mats', 'Leah', 'Sander', 'Fatima', 'Oskar', 'Maja', 'Elias', 'Selma', 'Tobias'];
  const HAIR = ['var(--r-energi)', 'var(--chalk-dim)', 'var(--heat)', 'var(--board-4)', 'var(--r-didaktikk)', 'var(--r-kropp)'];

  function face(hair, meter) {
    const m = meter / 100; // 0..1 -> munn
    const curve = Math.round((m - 0.45) * 16);
    const brow = m < 0.35 ? 'M22 24l8 3M42 27l8-3' : 'M22 25h8M42 25h8';
    return `<svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="38" r="24" fill="var(--board-3)" stroke="var(--chalk)" stroke-width="3"/>
<path d="M12 34q4-24 24-24t24 24q-10-12-24-12t-24 12z" fill="${hair}" stroke="var(--chalk)" stroke-width="2.5" stroke-linejoin="round"/>
<path d="${brow}" stroke="var(--chalk)" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="27" cy="34" r="2.6" fill="var(--chalk)"/><circle cx="45" cy="34" r="2.6" fill="var(--chalk)"/>
<path d="M27 ${48 - curve / 2}q9 ${curve} 18 0" fill="none" stroke="var(--chalk)" stroke-width="3" stroke-linecap="round"/></svg>`;
  }

  NG.minigames.register({
    id: ID, region: 'didaktikk', title: 'Elevsamtalen', icon: 'chat',
    concepts: ['di-elevforestilling', 'di-grubletegning', 'di-energiverktoy', 'di-hverdagssprak', 'pr-peb', 'partikkelmodellen'],
    blurb: 'Diagnostiser elevforestillinger om energi og varme, og velg grepet og ordene som flytter forståelsen.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      const nStud = d >= 2 ? 4 : 3;
      const scen = rng.shuffle(SC).slice(0, nStud);
      const names = rng.shuffle(NAMES);
      const students = scen.map((s, i) => ({ s, name: names[i], hair: rng.pick(HAIR), meter: 30, diag: false, grep: 0, say: '' }));
      let si = 0;

      const wrap = el('div', { class: 'mg-elevsamtalen' });
      root.appendChild(wrap);

      function header(sub) {
        return el('div', { class: 'stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Akademiet · elevforestillinger' }), el('span', { class: 'spacer' }), el('span', { class: 'chip es-pill', text: sub })]),
          el('h2', { class: 'h-display', text: 'Elevsamtalen' }),
        ]);
      }

      function renderStudent() {
        const st = students[si];
        const s = st.s;
        wrap.innerHTML = '';
        wrap.appendChild(header('Elev ' + (si + 1) + ' av ' + students.length));
        const faceBox = el('div', { class: 'es-face', html: face(st.hair, st.meter) });
        const bar = el('i', { style: { width: st.meter + '%', background: 'var(--r-didaktikk)' } });
        const delta = el('span', { class: 'es-delta' });
        wrap.appendChild(el('div', { class: 'es-top' }, [faceBox, el('div', { class: 'es-meter' }, [
          el('div', { class: 'row' }, [el('strong', { text: st.name }), el('span', { class: 'spacer' }), delta]),
          el('div', { class: 'small muted', text: 'Forståelse' }),
          el('div', { class: 'bar' }, [bar]),
        ])]));
        wrap.appendChild(el('div', { class: 'es-ctx', text: s.ctx }));
        const log = el('div', { class: 'stack' });
        wrap.appendChild(log);
        log.appendChild(el('div', { class: 'es-bubble', text: '«' + s.says + '»' }));
        const area = el('div', { class: 'stack' });
        wrap.appendChild(area);

        function bump(dv) {
          st.meter = NG.clamp(st.meter + dv, 0, 100);
          bar.style.width = st.meter + '%';
          faceBox.innerHTML = face(st.hair, st.meter);
          delta.className = 'es-delta ' + (dv >= 0 ? 'up' : 'down');
          delta.textContent = (dv >= 0 ? '+' : '') + dv;
        }
        function choose(opts, onPick) {
          const btns = [];
          opts.forEach((o) => {
            const b = el('button', { class: 'option small' + (o.tool ? ' es-tool' : ''), html: o.html });
            b.addEventListener('click', () => {
              if (b.disabled) return;
              btns.forEach((x) => { x.b.disabled = true; if (x.o.right) x.b.classList.add('correct'); else if (x.b !== b) x.b.classList.add('dim'); });
              if (!o.right) b.classList.add(o.half ? 'selected' : 'wrong');
              onPick(o);
            });
            btns.push({ b, o });
            area.appendChild(b);
          });
        }
        function next(label, fn) {
          const b = el('button', { class: 'btn primary block', id: 'es-next', text: label, onclick: () => { sfx('click'); fn(); } });
          area.appendChild(b);
          try { b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
        }

        // Steg 1: diagnose
        function step1() {
          area.innerHTML = '';
          area.appendChild(el('div', { class: 'es-step', text: 'Steg 1 · Hvilken forestilling ligger bak?' }));
          const others = rng.shuffle(Object.keys(MIS).filter((k) => k !== s.m && !(NEAR[s.m] || []).includes(k))).slice(0, 3);
          const opts = rng.shuffle([s.m].concat(others)).map((k) => ({ k, right: k === s.m, html: md(MIS[k]) }));
          choose(opts, (o) => {
            st.diag = o.right;
            bump(o.right ? 15 : -5);
            sfx(o.right ? 'good' : 'bad');
            area.appendChild(el('div', { class: 'feedback small ' + (o.right ? 'good' : 'bad'), html: md(o.right
              ? 'Riktig diagnose. Å kjenne igjen forestillingen er første steg. Den er ikke «dum», men bygger på hverdagserfaring.'
              : 'Ikke helt. Eleven uttrykker forestillingen **' + MIS[s.m].toLowerCase() + '**. Lytt etter *hva* eleven tror skjer, ikke bare etter ordene.') }));
            next('Velg undervisningsgrep', step2);
          });
        }
        // Steg 2: grep
        function step2() {
          area.innerHTML = '';
          area.appendChild(el('div', { class: 'es-step', text: 'Steg 2 · Hvilket grep passer best?' }));
          const extra = rng.shuffle(Object.keys(TOOLS).filter((k) => k !== s.best && k !== s.ok && k !== 'definisjon'))[0];
          const keys = rng.shuffle([s.best, s.ok, 'definisjon', extra]);
          const opts = keys.map((k) => ({ k, tool: true, right: k === s.best, half: k === s.ok, html: '<strong>' + TOOLS[k].name + '</strong><small>' + TOOLS[k].desc + '</small>' }));
          choose(opts, (o) => {
            st.grep = o.right ? 1 : o.half ? 0.5 : 0;
            bump(o.right ? 25 : o.half ? 12 : -5);
            sfx(o.right ? 'good' : o.half ? 'click' : 'bad');
            let txt;
            if (o.right) txt = '**Godt valg.** ' + s.why;
            else if (o.half) txt = '**Brukbart.** ' + TOOLS[o.k].name + ' kan hjelpe, men ' + TOOLS[s.best].name.toLowerCase() + ' treffer kjernen bedre her. ' + s.why;
            else if (o.k === 'definisjon') txt = '**Svakt grep.** En riktig definisjon endrer sjelden en elevforestilling. Eleven må selv oppleve at forestillingen ikke strekker til, og få et alternativ som gir mening. Bedre: ' + TOOLS[s.best].name.toLowerCase() + '. ' + s.why;
            else txt = '**Treffer ikke kjernen.** Bedre: ' + TOOLS[s.best].name.toLowerCase() + '. ' + s.why;
            area.appendChild(el('div', { class: 'feedback small ' + (o.right ? 'good' : 'bad'), html: md(txt) }));
            next('Hva sier du?', step3);
          });
        }
        // Steg 3: hva sier du
        function step3() {
          area.innerHTML = '';
          area.appendChild(el('div', { class: 'es-step', text: 'Steg 3 · Hva sier du til ' + st.name + '?' }));
          const opts = rng.shuffle(s.say).map((x) => ({ x, right: x.k === 'good', half: x.k === 'tell', html: md(x.t) }));
          choose(opts, (o) => {
            st.say = o.x.k;
            area.innerHTML = '';
            log.appendChild(el('div', { class: 'es-bubble me', html: md(o.x.t) }));
            const weakGrep = st.grep === 0 && o.x.k === 'good';
            log.appendChild(el('div', { class: 'es-bubble', html: md(o.x.r + (weakGrep ? ' (Men uten et godt grep å jobbe videre med, glipper det fort igjen.)' : '')) }));
            const dv = o.x.k === 'good' ? (weakGrep ? 20 : 30) : o.x.k === 'tell' ? 8 : -20;
            bump(dv);
            sfx(o.x.k === 'good' ? 'good' : o.x.k === 'tell' ? 'click' : 'bad');
            const expl = o.x.k === 'good'
              ? '**Godt grep.** Du tok forestillingen på alvor, utfordret den med et spørsmål eller en test, og lot eleven gjøre tenkingen selv.'
              : o.x.k === 'tell'
                ? '**Riktig fag, svak effekt.** Du sa fasiten, men eleven fikk ikke oppleve *hvorfor*. Forestillingen lever trolig videre ved siden av fasiten.'
                : '**Dette forsterket forestillingen.** Å bekrefte hverdagsforestillinger gjør dem sterkere og vanskeligere å endre senere.';
            area.appendChild(el('div', { class: 'feedback small ' + (o.x.k === 'good' ? 'good' : 'bad'), html: md(expl) }));
            const last = si >= students.length - 1;
            next(last ? 'Se oppsummering' : 'Neste elev', () => { if (last) renderSummary(); else { si++; renderStudent(); } });
            try { log.lastChild.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { /* */ }
          });
        }
        step1();
      }

      let result = null;
      function renderSummary() {
        const total = students.length * 3;
        let correct = 0; let pts = 0;
        students.forEach((st) => {
          correct += (st.diag ? 1 : 0) + (st.grep === 1 ? 1 : 0) + (st.say === 'good' ? 1 : 0);
          pts += st.meter / 100;
        });
        const score = Math.round(NG.clamp(pts / students.length, 0, 1) * 100) / 100;
        const missDiag = students.filter((st) => !st.diag).map((st) => MIS[st.s.m].toLowerCase());
        result = {
          score, correct, total,
          notes: 'Elevsamtaler: ' + students.map((st) => st.name + ' (' + MIS[st.s.m].toLowerCase() + ') ' + st.meter + ' %').join('; ') + '.' +
            (missDiag.length ? ' Feildiagnose: ' + missDiag.join(', ') + '.' : ''),
        };
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        const card = el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Gjennomsnittlig forståelse' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(score * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(score * 100) + '%', background: 'var(--r-didaktikk)' } })]),
        ]);
        const ul = el('ul', { class: 'es-list small' });
        students.forEach((st) => ul.appendChild(el('li', { html: '<strong>' + st.name + '</strong>: ' + md(MIS[st.s.m]) + ' – ' + st.meter + ' % <span class="muted">(' + TOOLS[st.s.best].name.toLowerCase() + ')</span>' })));
        card.appendChild(ul);
        wrap.appendChild(card);
        wrap.appendChild(el('div', { class: 'feedback small', html: md(
          '**Læringspoenget**\n' +
          'Elevforestillinger er ikke tilfeldige feil. De bygger på hverdagserfaring og hverdagsspråk, og en definisjon alene endrer dem sjelden. ' +
          'Først **diagnostiserer** du (lytt etter hva eleven tror skjer). Så velger du et **grep** som gjør forestillingen synlig og prøvbar: grubletegning, energikjede, partikkelmodellen, termometerforsøk, påstand–evidens–begrunnelse, eller en bevisst bro fra hverdagsspråk til fagspråk. ' +
          'Til slutt stiller du **spørsmål** som lar eleven gjøre tenkingen selv. (Henriksen & Angell 2019)') }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'es-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        api.done(result);
        const b = wrap.querySelector('#es-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }

      renderStudent();
      return { destroy() { /* ingen timere */ } };
    },
  });
})();
