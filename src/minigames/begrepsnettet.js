/* Mini-spill: Begrepsnettet (didaktikk). Lag et begrepskart: trykk begrep A → begrep B og velg
   bindeord. Holdbare påstander (proposisjoner) blir piler i kartet; gale gir forklaring.
   Avsluttes med begrepsstigen – begrepskart trener nivå 3, nettverk. */
(function () {
  'use strict';
  const ID = 'begrepsnettet';

  NG.css(`
.mg-begrepsnettet { display: flex; flex-direction: column; gap: 12px; }
.mg-begrepsnettet .bn-map { border-radius: var(--r-m); border: 2px solid var(--line-strong); background: var(--board-2); }
.mg-begrepsnettet .bn-map svg { display: block; width: 100%; height: auto; user-select: none; -webkit-user-select: none; }
.mg-begrepsnettet .bn-node { cursor: pointer; }
.mg-begrepsnettet .bn-node rect { fill: var(--board); stroke: var(--chalk); stroke-width: 2; }
.mg-begrepsnettet .bn-node text { fill: var(--chalk); font: 700 12.5px var(--f-body); }
.mg-begrepsnettet .bn-node.sel rect { stroke: var(--warn); stroke-width: 3.5; fill: var(--board-3); }
.mg-begrepsnettet .bn-node.a rect { stroke: var(--r-didaktikk); stroke-width: 3.5; fill: var(--board-3); }
.mg-begrepsnettet .bn-edge { stroke: var(--good); stroke-width: 2.2; fill: none; }
.mg-begrepsnettet .bn-elab rect { fill: var(--board-2); stroke: color-mix(in srgb, var(--good) 50%, transparent); stroke-width: 1; }
.mg-begrepsnettet .bn-elab text { fill: var(--good); font: 600 10px var(--f-body); }
.mg-begrepsnettet .bn-words { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.mg-begrepsnettet .bn-words .btn { font-size: var(--t-s); padding: 8px 8px; }
.mg-begrepsnettet .bn-prop { font-family: var(--f-display); font-size: var(--t-l); line-height: 1.2; }
.mg-begrepsnettet .bn-status { font-family: var(--f-mono); font-size: var(--t-s); color: var(--r-didaktikk); }
.mg-begrepsnettet .bn-ladder { display: flex; flex-direction: column; gap: 6px; }
.mg-begrepsnettet .bn-ladder .option.done { border-color: var(--good); }
.mg-begrepsnettet .bn-ladder .option.shake { animation: bnShake .3s; border-color: var(--bad); }
@keyframes bnShake { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
.mg-begrepsnettet .bn-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.mg-begrepsnettet .bn-steps li { padding: 6px 10px; border-radius: 10px; border: 2px solid var(--good); background: color-mix(in srgb, var(--good) 12%, var(--board-2)); font-size: var(--t-s); }
.mg-begrepsnettet .bn-pill { color: var(--r-didaktikk); border-color: color-mix(in srgb, var(--r-didaktikk) 50%, transparent); }
`);

  const THEMES = {
    energi: {
      name: 'Energi og varme',
      nodes: [['energi', 'Energi'], ['varme', 'Varme'], ['temp', 'Temperatur'], ['tdiff', 'Temperatur- forskjell'], ['part', 'Partikler'], ['bev', 'Bevegelse'], ['stoff', 'Stoff']],
      words: ['består av', 'er alltid i', 'er et mål på', 'overføres ved', 'fører til', 'har', 'er en form for', 'er en egenskap ved'],
      valid: [
        ['stoff', 'består av', 'part', 'Alt stoff består av partikler: atomer, ioner eller molekyler.'],
        ['part', 'er alltid i', 'bev', 'Partiklene er alltid i bevegelse. I faste stoffer vibrerer de.'],
        ['temp', 'er et mål på', 'bev', 'Temperatur er et mål på partiklenes *gjennomsnittlige* bevegelsesenergi.'],
        ['energi', 'overføres ved', 'varme', 'Varme er energi som overføres fordi det er en temperaturforskjell.'],
        ['tdiff', 'fører til', 'varme', 'En temperaturforskjell fører til varme: energi går fra varmt til kaldt til temperaturen er lik.'],
        ['part', 'har', 'energi', 'Partiklene har bevegelsesenergi, og stillingsenergi knyttet til bindingene.'],
        ['stoff', 'har', 'energi', 'Et stoff har indre energi: summen av partiklenes bevegelses- og bindingsenergi.'],
      ],
      wrong: [
        ['temp', 'er en form for', 'energi', 'Temperatur er ikke energi. Den måles i °C eller K, ikke i joule. Temperatur er et *mål på* partiklenes gjennomsnittlige bevegelsesenergi.'],
        ['varme', 'er en form for', 'energi', 'Varme er ikke en energiform, men en måte energi *overføres* på (som arbeid og stråling). Prøv: Energi – overføres ved – Varme.'],
        ['varme', 'er et mål på', 'temp', 'Det er temperatur vi måler med termometer. Varme er energi som overføres.'],
        ['temp', 'er en egenskap ved', 'stoff', 'Temperatur er en *tilstand*, ikke en materialegenskap. Metall og tre i samme rom har samme temperatur.'],
        ['bev', 'er en form for', 'energi', 'Nesten! Det er *bevegelsesenergi* (kinetisk energi) som er en energiform. Bevegelse er det som skjer.'],
        ['stoff', 'har', 'varme', 'Dette er hverdagsspråk. Et stoff *har* indre energi, men varme er noe som *skjer* (overføring).'],
        ['energi', 'består av', 'part', 'Energi er ikke et stoff og består ikke av partikler. Det er en størrelse vi regner med.'],
        ['varme', 'overføres ved', 'energi', 'Snu det: det er energien som overføres, og varme er måten det skjer på.'],
      ],
    },
    stoffer: {
      name: 'Stoffer',
      nodes: [['stoff', 'Stoff'], ['rent', 'Rent stoff'], ['bland', 'Blanding'], ['grunn', 'Grunnstoff'], ['forb', 'Kjemisk forbindelse'], ['mol', 'Molekyl'], ['atom', 'Atomer']],
      words: ['er en type', 'består av én type', 'består av flere typer', 'er bygd opp av', 'kan være', 'er det samme som'],
      valid: [
        ['rent', 'er en type', 'stoff', 'Stoffer deles i rene stoffer og blandinger.'],
        ['bland', 'er en type', 'stoff', 'Stoffer deles i rene stoffer og blandinger.'],
        ['grunn', 'er en type', 'rent', 'Et grunnstoff er et rent stoff med bare én atomtype.'],
        ['forb', 'er en type', 'rent', 'En kjemisk forbindelse er et rent stoff. Atomene er kjemisk bundet i et fast forhold.'],
        ['rent', 'kan være', 'grunn', 'Et rent stoff er enten ett grunnstoff eller én kjemisk forbindelse.'],
        ['rent', 'kan være', 'forb', 'Et rent stoff er enten ett grunnstoff eller én kjemisk forbindelse.'],
        ['grunn', 'består av én type', 'atom', 'Et grunnstoff består av én atomtype. Alle grunnstoffene står i periodesystemet.'],
        ['forb', 'består av flere typer', 'atom', 'En kjemisk forbindelse består av to eller flere atomtyper som er kjemisk bundet.'],
        ['bland', 'består av flere typer', 'rent', 'En blanding består av to eller flere rene stoffer som ikke er kjemisk bundet til hverandre.'],
        ['mol', 'er bygd opp av', 'atom', 'Et molekyl er atomer bundet sammen med kovalente bindinger.'],
        ['stoff', 'er bygd opp av', 'atom', 'Alle stoffer er bygd opp av atomer.'],
        ['forb', 'er bygd opp av', 'atom', 'Forbindelser er bygd opp av atomer av minst to slag.'],
        ['grunn', 'er bygd opp av', 'atom', 'Grunnstoffer er bygd opp av atomer av ett slag.'],
        ['forb', 'kan være', 'mol', 'En kjemisk forbindelse kan være et molekyl (H₂O) eller en ioneforbindelse (NaCl).'],
        ['grunn', 'kan være', 'mol', 'Noen grunnstoffer finnes som molekyler, for eksempel O₂ og N₂.'],
      ],
      wrong: [
        ['forb', 'består av én type', 'atom', 'Det er grunnstoffet som har én atomtype. En forbindelse har minst to.'],
        ['grunn', 'består av flere typer', 'atom', 'Et grunnstoff har bare én atomtype. Flere typer, kjemisk bundet, gir en forbindelse.'],
        ['bland', 'er en type', 'rent', 'En blanding er nettopp *ikke* et rent stoff. Den består av flere rene stoffer.'],
        ['forb', 'er en type', 'bland', 'I en forbindelse er atomene kjemisk bundet i et fast forhold. I en blanding er stoffene bare blandet og kan skilles fysisk.'],
        ['bland', 'er en type', 'forb', 'En blanding er ikke kjemisk bundet. Saltvann er en blanding, mens salt (NaCl) er en forbindelse.'],
        ['bland', 'er det samme som', 'forb', 'Dette er en vanlig forveksling. En forbindelse har kjemiske bindinger mellom atomtypene, mens en blanding ikke har det.'],
        ['forb', 'er det samme som', 'bland', 'Dette er en vanlig forveksling. En forbindelse har kjemiske bindinger mellom atomtypene, mens en blanding ikke har det.'],
        ['atom', 'er bygd opp av', 'mol', 'Feil retning: molekyler er bygd opp av atomer.'],
        ['mol', 'er det samme som', 'atom', 'Et molekyl er to eller flere atomer som er bundet sammen.'],
      ],
    },
    foto: {
      name: 'Fotosyntese og celleånding',
      nodes: [['foto', 'Fotosyntese'], ['celle', 'Celleånding'], ['co2', 'Karbon- dioksid'], ['vann', 'Vann'], ['gluk', 'Glukose'], ['o2', 'Oksygen'], ['energi', 'Energi']],
      words: ['bruker', 'lager', 'omdanner', 'lagrer'],
      valid: [
        ['foto', 'bruker', 'co2', 'Fotosyntesen bruker karbondioksid fra lufta. Karbonet havner i glukosen.'],
        ['foto', 'bruker', 'vann', 'Fotosyntesen bruker vann, og oksygenet som frigjøres, kommer fra vannet.'],
        ['foto', 'lager', 'gluk', 'Fotosyntesen lager glukose. Det meste av plantens masse kommer fra CO₂ i lufta.'],
        ['foto', 'lager', 'o2', 'Fotosyntesen lager oksygen.'],
        ['foto', 'omdanner', 'energi', 'Fotosyntesen omdanner lysenergi til kjemisk energi.'],
        ['foto', 'bruker', 'energi', 'Fotosyntesen bruker lysenergi og omdanner den til kjemisk energi.'],
        ['celle', 'bruker', 'gluk', 'Celleåndingen bruker glukose.'],
        ['celle', 'bruker', 'o2', 'Celleåndingen bruker oksygen. Det skjer i alle levende celler, også i planter, hele døgnet.'],
        ['celle', 'lager', 'co2', 'Celleåndingen lager karbondioksid.'],
        ['celle', 'lager', 'vann', 'Celleåndingen lager vann.'],
        ['celle', 'omdanner', 'energi', 'Celleåndingen omdanner kjemisk energi i glukose til en form cellene kan bruke, og til varme.'],
        ['gluk', 'lagrer', 'energi', 'Glukose lagrer kjemisk energi. Strengt tatt er energien knyttet til systemet glukose + oksygen.'],
      ],
      wrong: [
        ['foto', 'lager', 'energi', 'Energi kan ikke lages (energibevaring). Fotosyntesen *omdanner* lysenergi til kjemisk energi.'],
        ['celle', 'lager', 'energi', 'Celleåndingen lager ikke energi. Den *omdanner* kjemisk energi fra glukose.'],
        ['celle', 'lager', 'o2', 'Celleåndingen *bruker* oksygen og lager karbondioksid.'],
        ['foto', 'bruker', 'o2', 'Fotosyntesen *lager* oksygen. Plantecellene bruker riktignok oksygen, men i celleåndingen, som pågår hele tiden.'],
        ['foto', 'lager', 'co2', 'Fotosyntesen *bruker* CO₂.'],
        ['celle', 'bruker', 'co2', 'Celleåndingen *lager* CO₂.'],
        ['o2', 'lagrer', 'energi', 'Oksygen er nødvendig for å frigjøre energien, men det er glukose (sammen med oksygen) vi sier lagrer kjemisk energi.'],
      ],
    },
  };

  const LADDER = ['Gjenkjennelse', 'Definisjon', 'Nettverk', 'Anvendelse', 'Overføring'];
  const LADDER_DESC = ['kjenner igjen ordet', 'kan si hva det betyr', 'ser sammenhenger med andre begreper', 'bruker begrepet i nye situasjoner', 'bruker det på nye fenomener og forklarer for andre'];

  NG.minigames.register({
    id: ID, region: 'didaktikk', title: 'Begrepsnettet', icon: 'network',
    concepts: ['di-bindeord', 'di-begrepsstigen', 'di-ord-begrep', 'di-ordkort', 'di-nokkelbegrep'],
    blurb: 'Bygg et begrepskart med bindeord, og se hvorfor nettverk er et eget trinn på begrepsstigen.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const d = NG.clamp(api.difficulty || 1, 1, 3);
      const target = 3 + d; // 4/5/6
      const themeKey = rng.pick(Object.keys(THEMES));
      const TH = THEMES[themeKey];
      const label = {}; TH.nodes.forEach(([id, l]) => { label[id] = l.replace('- ', ''); });

      // Layout: noder på en ellipse, stokket rekkefølge
      const VW = 340, VH = 300;
      const order = rng.shuffle(TH.nodes.map((n) => n[0]));
      const nodes = {};
      order.forEach((id, i) => {
        const ang = -Math.PI / 2 + (i / order.length) * Math.PI * 2;
        const raw = TH.nodes.find((n) => n[0] === id)[1];
        const lines = wrapLabel(raw);
        const w = Math.max(76, Math.max(...lines.map((s) => s.length)) * 7.6 + 18);
        const h = Math.max(42, lines.length * 15 + 16);
        let cx = VW / 2 + Math.cos(ang) * 112;
        let cy = VH / 2 + Math.sin(ang) * 112;
        cx = NG.clamp(cx, w / 2 + 4, VW - w / 2 - 4);
        cy = NG.clamp(cy, h / 2 + 4, VH - h / 2 - 4);
        nodes[id] = { id, lines, w, h, cx, cy };
      });
      function wrapLabel(s) {
        if (s.includes('- ')) { const [a, b] = s.split('- '); return [a + '-', b]; }
        if (s.length > 11 && s.includes(' ')) { const i = s.indexOf(' '); return [s.slice(0, i), s.slice(i + 1)]; }
        return [s];
      }

      const edges = []; // {a, w, b}
      let wrong = 0; let sel = null; let picking = null;
      const wrongSeen = new Set();
      let ladderErr = 0; let qOk = false;

      const wrap = el('div', { class: 'mg-begrepsnettet' });
      root.appendChild(wrap);
      function header(sub) {
        return el('div', { class: 'stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Akademiet · begrepskart' }), el('span', { class: 'spacer' }), el('span', { class: 'chip bn-pill', text: sub })]),
          el('h2', { class: 'h-display', text: 'Begrepsnettet' }),
        ]);
      }

      /* ---------- Kartet ---------- */
      let mapBox; let panel; let status;
      function renderMap() {
        wrap.innerHTML = '';
        wrap.appendChild(header('Tema: ' + TH.name));
        wrap.appendChild(el('div', { class: 'small', html: md('Lag **' + target + ' holdbare påstander**. Trykk på ett begrep, så på et annet, og velg **bindeord**. Pila går fra det første til det andre begrepet. Les påstanden høyt: holder den faglig?') }));
        mapBox = el('div', { class: 'bn-map' });
        wrap.appendChild(mapBox);
        status = el('div', { class: 'bn-status' });
        wrap.appendChild(status);
        panel = el('div', { class: 'stack' });
        wrap.appendChild(panel);
        drawMap();
        idlePanel();
      }
      function drawMap() {
        const ns = 'http://www.w3.org/2000/svg';
        let s = `<svg viewBox="0 0 ${VW} ${VH}" xmlns="${ns}" role="img" aria-label="Begrepskart">`;
        s += '<defs><marker id="bn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--good)"/></marker></defs>';
        edges.forEach((e) => {
          const A = nodes[e.a]; const B = nodes[e.b];
          const p1 = clip(A, B.cx, B.cy); const p2 = clip(B, A.cx, A.cy);
          s += `<path class="bn-edge" d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" marker-end="url(#bn-arr)"/>`;
        });
        edges.forEach((e) => {
          const A = nodes[e.a]; const B = nodes[e.b];
          const mx = (A.cx + B.cx) / 2; const my = (A.cy + B.cy) / 2;
          const w = e.w.length * 5.3 + 10;
          s += `<g class="bn-elab"><rect x="${(mx - w / 2).toFixed(1)}" y="${(my - 8).toFixed(1)}" width="${w.toFixed(1)}" height="16" rx="5"/><text x="${mx.toFixed(1)}" y="${(my + 3.5).toFixed(1)}" text-anchor="middle">${esc(e.w)}</text></g>`;
        });
        Object.values(nodes).forEach((n) => {
          const cls = 'bn-node' + (sel === n.id ? ' sel' : '') + (picking && picking.b === n.id ? ' a' : '');
          s += `<g class="${cls}" data-node="${n.id}" role="button" tabindex="0" aria-label="${esc(label[n.id])}"><rect x="${(n.cx - n.w / 2).toFixed(1)}" y="${(n.cy - n.h / 2).toFixed(1)}" width="${n.w.toFixed(1)}" height="${n.h}" rx="12"/>`;
          n.lines.forEach((ln, i) => {
            const y = n.cy + (i - (n.lines.length - 1) / 2) * 15 + 4.5;
            s += `<text x="${n.cx.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle">${esc(ln)}</text>`;
          });
          s += '</g>';
        });
        s += '</svg>';
        mapBox.innerHTML = s;
        mapBox.querySelectorAll('[data-node]').forEach((g) => {
          g.addEventListener('click', () => tapNode(g.getAttribute('data-node')));
          g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tapNode(g.getAttribute('data-node')); } });
        });
        status.textContent = 'Påstander: ' + Math.min(edges.length, target) + ' / ' + target + (wrong ? ' · ikke holdbare: ' + wrong : '');
      }
      function clip(n, tx, ty) {
        const dx = tx - n.cx; const dy = ty - n.cy;
        const sx = dx === 0 ? Infinity : (n.w / 2 + 3) / Math.abs(dx);
        const sy = dy === 0 ? Infinity : (n.h / 2 + 3) / Math.abs(dy);
        const t = Math.min(sx, sy, 1);
        return [n.cx + dx * t, n.cy + dy * t];
      }
      function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

      function tapNode(id) {
        if (edges.length >= target && !picking) return;
        sfx('click');
        if (picking) { picking = null; sel = null; }
        if (sel === null) { sel = id; drawMap(); idlePanel(); return; }
        if (sel === id) { sel = null; drawMap(); idlePanel(); return; }
        picking = { a: sel, b: id };
        drawMap();
        wordPanel();
      }
      function idlePanel(fb) {
        panel.innerHTML = '';
        if (fb) panel.appendChild(fb);
        if (edges.length >= target) {
          panel.appendChild(el('div', { class: 'feedback good small', html: md('**Kartet er ferdig!** Hver pil er en påstand (proposisjon) som kan være sann eller usann. Det er bindeordene som gjør ord til et nettverk av begreper.') }));
          panel.appendChild(el('button', { class: 'btn primary block', id: 'bn-next', text: 'Videre: begrepsstigen', onclick: () => { sfx('click'); renderLadder(); } }));
          return;
        }
        panel.appendChild(el('div', { class: 'small muted', html: sel ? 'Valgt: <strong>' + esc(label[sel]) + '</strong>. Trykk på begrepet pila skal gå <em>til</em>.' : 'Trykk på et begrep for å starte en påstand.' }));
        if (edges.length >= 2) panel.appendChild(el('button', { class: 'btn ghost block', id: 'bn-skip', text: 'Ferdig med kartet (' + edges.length + ' påstander)', onclick: () => { sfx('click'); renderLadder(); } }));
      }
      function wordPanel() {
        panel.innerHTML = '';
        const { a, b } = picking;
        panel.appendChild(el('div', { class: 'bn-prop', html: esc(label[a]) + ' <span class="muted">→ … →</span> ' + esc(label[b]) }));
        const grid = el('div', { class: 'bn-words' });
        TH.words.forEach((w) => grid.appendChild(el('button', { class: 'btn', text: w, onclick: () => pick(w) })));
        panel.appendChild(grid);
        panel.appendChild(el('button', { class: 'btn ghost block', text: 'Avbryt', onclick: () => { sfx('click'); picking = null; sel = null; drawMap(); idlePanel(); } }));
        try { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
      }
      function pick(w) {
        const { a, b } = picking;
        picking = null; sel = null;
        const prop = '«' + label[a] + ' ' + w + ' ' + label[b].toLowerCase() + '»';
        let fb;
        if (edges.some((e) => e.a === a && e.b === b && e.w === w)) {
          fb = el('div', { class: 'feedback small', html: md('Den påstanden har du allerede.') });
        } else {
          const v = TH.valid.find((x) => x[0] === a && x[1] === w && x[2] === b);
          if (v) {
            edges.push({ a, w, b });
            sfx(edges.length >= target ? 'win' : 'good');
            fb = el('div', { class: 'feedback good small', html: md('**Holdbar:** ' + prop + '. ' + v[3]) });
          } else {
            wrong++;
            sfx('bad');
            const wr = TH.wrong.find((x) => x[0] === a && x[1] === w && x[2] === b);
            const rev = TH.valid.find((x) => x[0] === b && x[1] === w && x[2] === a);
            let txt;
            if (wr) txt = wr[3];
            else if (rev) txt = 'Riktig bindeord, men **feil retning**. Prøv «' + label[b] + ' ' + w + ' ' + label[a].toLowerCase() + '».';
            else {
              const other = TH.valid.find((x) => x[0] === a && x[2] === b);
              txt = other ? 'Det finnes et bedre bindeord mellom disse to begrepene. Les påstanden høyt og vurder om den holder.' : 'Det er vanskelig å forsvare denne påstanden faglig. Kanskje henger disse to begrepene bare sammen *via* et tredje?';
            }
            wrongSeen.add(prop);
            fb = el('div', { class: 'feedback bad small', html: md('**Ikke holdbar:** ' + prop + '. ' + txt) });
          }
        }
        drawMap();
        idlePanel(fb);
      }

      /* ---------- Begrepsstigen ---------- */
      function renderLadder() {
        wrap.innerHTML = '';
        wrap.appendChild(header('Begrepsstigen'));
        wrap.appendChild(el('div', { class: 'small', html: md('Fra **ord** til **begrep**: trykk på trinnene i stigen i riktig rekkefølge, fra nederst til øverst.') }));
        const done = el('ol', { class: 'bn-steps' });
        wrap.appendChild(done);
        const box = el('div', { class: 'bn-ladder' });
        wrap.appendChild(box);
        const fb = el('div', { class: 'stack' });
        wrap.appendChild(fb);
        let next = 0;
        rng.shuffle(LADDER.map((s, i) => i)).forEach((i) => {
          const b = el('button', { class: 'option', text: LADDER[i] });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (i === next) {
              sfx('good');
              b.remove();
              done.appendChild(el('li', { html: '<strong>' + (i + 1) + '. ' + LADDER[i] + '</strong> <span class="muted">– ' + LADDER_DESC[i] + '</span>' }));
              next++;
              if (next === LADDER.length) question(fb);
            } else {
              ladderErr++;
              sfx('bad');
              b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
            }
          });
          box.appendChild(b);
        });
      }
      function question(fb) {
        fb.appendChild(el('div', { html: md('Hvilket trinn trener begrepskartet du nettopp laget, **mest direkte**?') }));
        const btns = [];
        LADDER.forEach((s, i) => {
          const b = el('button', { class: 'option small', text: (i + 1) + '. ' + s });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            qOk = i === 2;
            btns.forEach((x, j) => { x.disabled = true; if (j === 2) x.classList.add('correct'); else if (x !== b) x.classList.add('dim'); });
            if (!qOk) b.classList.add('wrong');
            sfx(qOk ? 'good' : 'bad');
            fb.appendChild(el('div', { class: 'feedback small ' + (qOk ? 'good' : 'bad'), html: md('**Nettverk (nivå 3).** Et begrepskart får eleven til å se *sammenhenger*: hvert begrep får mening gjennom forbindelsene til andre begreper. En definisjon (nivå 2) står alene. Anvendelse (nivå 4) krever at begrepet brukes på en ny situasjon, for eksempel å forklare hvorfor metallbeinet føles kaldt.') }));
            fb.appendChild(el('button', { class: 'btn primary block', id: 'bn-next', text: 'Se oppsummering', onclick: () => { sfx('click'); renderSummary(); } }));
            try { fb.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
          });
          btns.push(b);
          fb.appendChild(b);
        });
        try { fb.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* */ }
      }

      /* ---------- Oppsummering ---------- */
      let result = null;
      function renderSummary() {
        const got = Math.min(edges.length, target);
        const mapScore = NG.clamp(got / target - 0.08 * wrong, 0, 1);
        const ladScore = NG.clamp(1 - ladderErr / 5, 0, 1);
        const score = Math.round((0.6 * mapScore + 0.2 * ladScore + 0.2 * (qOk ? 1 : 0)) * 100) / 100;
        result = {
          score, correct: got + (ladderErr === 0 ? 1 : 0) + (qOk ? 1 : 0), total: target + 2,
          notes: `Begrepskart (${TH.name}): ${got}/${target} holdbare påstander, ${wrong} ikke holdbare; begrepsstigen ${ladderErr ? ladderErr + ' feiltrykk' : 'feilfritt'}; nettverk = nivå 3 ${qOk ? 'riktig' : 'feil'}.`,
        };
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Resultat' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(score * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(score * 100) + '%', background: 'var(--r-didaktikk)' } })]),
          el('div', { class: 'small', text: `Påstander: ${got}/${target} · ikke holdbare: ${wrong} · stigen: ${ladderErr} feil · spørsmål: ${qOk ? 'riktig' : 'feil'}` }),
        ]));
        if (edges.length) {
          const ul = el('ul', { class: 'small', style: { margin: 0, paddingLeft: '1.2em' } });
          edges.forEach((e) => ul.appendChild(el('li', { text: label[e.a] + ' ' + e.w + ' ' + label[e.b].toLowerCase() + '.' })));
          wrap.appendChild(el('div', { class: 'card stack-s' }, [el('div', { class: 'label', text: 'Kartet ditt som setninger' }), ul]));
        }
        wrap.appendChild(el('div', { class: 'feedback small', html: md(
          '**Læringspoenget**\n' +
          'Et ord er formen, et begrep er innholdet. Et begrep får mening gjennom **forbindelsene** til andre begreper. Bindeord gjør forbindelsene eksplisitte og etterprøvbare: hver pil er en påstand som kan diskuteres. ' +
          'Begrepsstigen går fra gjenkjennelse → definisjon → **nettverk** → anvendelse → overføring. Ordkoblinger og begrepskart trener nivå 3 og avslører elevforestillinger, for eksempel «temperatur er en form for energi». Velg få nøkkelbegreper og bruk dem over tid.') }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'bn-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        api.done(result);
        const b = wrap.querySelector('#bn-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }

      renderMap();
      return { destroy() { /* ingen timere */ } };
    },
  });
})();
