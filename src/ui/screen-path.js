/* Ekspedisjonskartet + enkle noder (hendelse, solgløtt, kiste, handelsmann). */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);
  const ROW_H = 86;   // px per rad på kartet
  const PAD = 34;     // luft over bossen og under startraden

  // Ikon for handelsmannen (markedsbod med markise og mynt) — registreres her hvis ingen grafikkfil har det
  if (!NG.art.map['node-butikk']) {
    NG.art.add('node-butikk', '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 17l4-9h28l4 9" fill="currentColor" fill-opacity=".22"/><path d="M6 17q4 5 9 0q4.5 5 9 0q4.5 5 9 0q5 5 9 0"/>' +
      '<path d="M9 21v20M39 21v20M5 41h38"/><circle cx="24" cy="31" r="5.5" fill="currentColor" fill-opacity=".22"/><path d="M24 28.5v5" stroke-width="2.4"/></svg>');
  }

  /* ---------- Kartet ---------- */
  NG.screen('path', (app) => {
    const s = NG.state();
    if (!s.run) { NG.go('camp'); return; }
    const r = s.run;
    const map = NG.runMap(s);
    if (!map) { NG.endRun(s, 'abandon'); NG.save(); NG.go('camp'); return; }
    const reg = NG.region(r.region);
    app.style.setProperty('--rc', reg.color);
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row path-head' }, [
      NG.artEl('icon-' + reg.id, 'ph-icon'),
      el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Ekspedisjon' }), el('h1', { class: 'h-display', text: reg.name })]),
      el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') }),
    ]));

    const choosable = NG.choosable(s);
    const canIds = {}; choosable.forEach((n) => { canIds[n.id] = 1; });
    const cur = NG.runNode(s);
    const resume = cur && !cur.done;
    const byId = {}; map.nodes.forEach((n) => { byId[n.id] = n; });
    // Noder du fortsatt kan nå (fremover fra de valgbare)
    const reach = {};
    const stack = choosable.map((n) => n.id);
    while (stack.length) {
      const id = stack.pop();
      if (reach[id]) continue;
      reach[id] = 1;
      map.edges.forEach((e) => { if (e[0] === id && !reach[e[1]]) stack.push(e[1]); });
    }
    const taken = {};
    for (let i = 1; i < r.path.length; i++) taken[r.path[i - 1] + '>' + r.path[i]] = 1;

    const H = map.rows * ROW_H + PAD * 2;
    const pos = (n) => {
      const h = NG.hashStr(r.seed + ':' + n.id);
      const boss = n.type === 'boss';
      const jx = boss ? 0 : ((h % 1000) / 1000 - 0.5) * 8;          // ±4 %
      const jy = boss ? 0 : (((h >>> 10) % 1000) / 1000 - 0.5) * 20; // ±10 px
      return { x: ((n.lane + 0.5) / map.lanes) * 100 + jx, y: PAD + (map.rows - 1 - n.row) * ROW_H + ROW_H / 2 + jy };
    };
    const P = {}; map.nodes.forEach((n) => { P[n.id] = pos(n); });

    // Linjer
    let lines = '';
    map.edges.forEach(([a, b]) => {
      if (!P[a] || !P[b]) return;
      let cls = 'dim';
      if (taken[a + '>' + b]) cls = 'taken';
      else if (cur && cur.done && a === cur.id && canIds[b]) cls = 'open';
      else if (reach[a] && reach[b]) cls = 'ahead';
      lines += `<line class="ml-${cls}" x1="${P[a].x.toFixed(2)}" y1="${P[a].y.toFixed(1)}" x2="${P[b].x.toFixed(2)}" y2="${P[b].y.toFixed(1)}" vector-effect="non-scaling-stroke"/>`;
    });
    const svg = `<svg class="rmap-lines" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
    const wrap = el('div', { class: 'rmap', style: { height: H + 'px' }, html: svg });

    const bossDef = NG.enemyDef(reg.boss);
    map.nodes.forEach((n) => {
      const t = NG.NODE_TYPES[n.type] || NG.NODE_TYPES.kamp;
      const can = !!canIds[n.id];
      const here = cur && cur.id === n.id;
      const st = can ? ' can' : n.done ? ' done' : reach[n.id] ? ' ahead' : ' gone';
      const label = n.type === 'boss' ? bossDef.name : can ? t.name : '';
      const b = el('button', {
        class: 'mnode t-' + n.type + st + (here ? ' here' : ''),
        style: { left: P[n.id].x + '%', top: P[n.id].y + 'px' },
        disabled: !can || null,
        'aria-label': t.name + (n.done ? ' (ferdig)' : can ? ' (kan velges)' : ''),
        'data-id': n.id,
        onclick: () => { NG.sfx('click'); enter(n.id); },
      }, [
        NG.artEl(t.art, 'mnode-art'),
        n.done ? el('span', { class: 'mnode-ok', text: '✓', 'aria-hidden': 'true' }) : null,
      ]);
      wrap.appendChild(b);
      if (label) wrap.appendChild(el('span', { class: 'mnode-l' + (n.type === 'boss' ? ' boss' : ''), style: { left: P[n.id].x + '%', top: P[n.id].y + 'px' }, text: label }));
    });
    wrap.appendChild(el('span', { class: 'rmap-start label', text: 'Start' }));
    app.appendChild(wrap);

    const hint = resume ? 'Du ble avbrutt her. Trykk på noden for å fortsette.'
      : r.at == null ? 'Velg hvor du vil begynne. Stiene deler seg og møtes — planlegg ruten mot bossen.'
        : choosable.length ? 'Velg neste steg langs en sti.' : '';
    if (hint) app.appendChild(el('p', { class: 'small muted path-hint', text: hint }));

    // Tegnforklaring — trykk for å lese hva nodetypen er
    const present = Object.keys(NG.NODE_TYPES).filter((k) => map.nodes.some((n) => n.type === k));
    app.appendChild(el('div', { class: 'rmap-legend' }, present.map((k) => {
      const t = NG.NODE_TYPES[k];
      return el('button', { class: 'rmap-leg t-' + k, onclick: () => NG.sheet(t.name, el('div', { class: 'row' }, [NG.artEl(t.art, 'loot-art sm'), el('p', { class: 'grow', text: t.desc })])) }, [
        NG.artEl(t.art, 'rmap-leg-art'), el('span', { text: t.name }),
      ]);
    })));

    setTimeout(() => {
      const n = app.querySelector('.mnode.can') || app.querySelector('.mnode.here');
      if (n) try { n.scrollIntoView({ block: 'center' }); } catch (e) { /* */ }
    }, 30);

    function enter(id) {
      const node = NG.enterNode(s, id);
      NG.save();
      if (node) NG.openNode(node); else NG.go('path');
    }
  });

  NG.openNode = function (node) {
    if (node.type === 'kamp' || node.type === 'elite' || node.type === 'boss') NG.go('combat', { enemy: node.enemy });
    else if (node.type === 'lab') NG.go('lab', { id: node.lab, inRun: true });
    else if (node.type === 'hendelse') NG.go('event', { id: node.event });
    else if (node.type === 'sol') NG.go('sol');
    else if (node.type === 'butikk') NG.go('merchant');
    else NG.go('chest');
  };

  // Ferdig med en node i ekspedisjonen
  NG.nodeDone = function () {
    const s = NG.state();
    NG.completeNode(s);
    NG.save();
    NG.go(s.run ? 'path' : 'camp');
  };

  // Belønning fra hendelse/kiste o.l. — returnerer tekstlinjer
  function grant(s, rw) {
    const lines = [];
    if (rw.xp) { const ups = NG.gainXp(s, rw.xp); lines.push((rw.xp > 0 ? '+' : '') + rw.xp + ' XP'); if (ups) NG.announce({ levelUps: ups }); }
    if (rw.joule) { s.joule = Math.max(0, s.joule + rw.joule); if (s.run && rw.joule > 0) s.run.joule += rw.joule; lines.push((rw.joule > 0 ? '+' : '') + rw.joule + ' ◆'); }
    if (rw.hp) { s.hp = NG.clamp(s.hp + rw.hp, 1, NG.maxHp(s)); lines.push((rw.hp > 0 ? '+' : '') + rw.hp + ' HP'); }
    if (rw.energy) {
      if (rw.energy > 0) { s.energy += rw.energy; lines.push('+' + rw.energy + ' J'); }
      else { const e = Math.min(s.energy, -rw.energy); s.energy -= e; s.heat += e; lines.push('−' + e + ' J (til spillvarme)'); }
    }
    if (rw.item) {
      const def = (id) => (NG.relicDef ? NG.relicDef(id) : NG.item(id));
      const it = def(rw.item) || def(String(rw.item).replace(/^item-/, ''));
      if (it) { if (it.kind === 'relic' || (NG.runRelic && NG.runRelic(it.id))) gainRelic(s, it.id); else s.items[it.id] = (s.items[it.id] || 0) + 1; lines.push(it.name); }
    }
    return lines;
  }
  function gainRelic(s, id) {
    if (NG.hasRelic(s, id)) return;
    if (typeof NG.gainRelic === 'function') { NG.gainRelic(s, id); return; }
    s.relics.push(id);
    if (id === 'solcelle') s.energy += 10;
  }

  /* ---------- Hendelse ---------- */
  NG.screen('event', (app, p) => {
    const s = NG.state();
    const ev = NG.content.store.events.find((e) => e.id === p.id);
    const node = NG.runNode(s);
    app.appendChild(NG.hud(s));
    if (!ev) { NG.nodeDone(); return; }
    const reg = NG.region(ev.region);
    app.style.setProperty('--rc', reg ? reg.color : 'var(--chalk)');
    const wrap = el('div', { class: 'stack event' }, [
      el('div', { class: 'row' }, [NG.artEl('node-hendelse', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Hendelse' }), el('h1', { class: 'h-display', text: ev.title })])]),
      el('p', { class: 'ev-text', html: NG.md(ev.text) }),
    ]);
    const choices = el('div', { class: 'stack-s' });
    const order = NG.runRng(s, 99).shuffle(ev.choices.map((_, i) => i));
    order.forEach((i) => {
      const ch = ev.choices[i];
      choices.appendChild(el('button', { class: 'option', html: NG.md(ch.label), onclick: () => pick(i) }));
    });
    wrap.appendChild(choices);
    app.appendChild(wrap);
    // Allerede valgt (f.eks. tilbake fra sekken): vis utfallet uten ny belønning
    if (node && node.picked != null && ev.choices[node.picked]) show(node.picked, node.pickedLines || []);

    function pick(i) {
      if (node && node.picked != null) return;
      const ch = ev.choices[i];
      NG.sfx(ch.correct ? 'good' : 'bad');
      const lines = grant(s, ch.reward || {});
      if (node) { node.picked = i; node.pickedLines = lines; }
      // Begrepene i hendelsen telles som et svar på nivå 4
      if (ev.concepts && ev.concepts.length) NG.announce({ cardUps: NG.updateCards(s, { concepts: ev.concepts, level: 4 }, !!ch.correct) });
      NG.save();
      show(i, lines);
    }
    function show(i, lines) {
      const ch = ev.choices[i];
      choices.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      wrap.appendChild(el('div', { class: 'feedback ' + (ch.correct ? 'good' : 'bad') + ' stack-s' }, [
        el('div', { class: 'h-display fb-title', text: ch.correct ? 'Godt valgt' : 'Det gikk ikke helt' }),
        el('div', { html: NG.md(ch.result || '') }),
        lines.length ? el('div', { class: 'num small', text: lines.join(' · ') }) : null,
        el('button', { class: 'btn primary block', text: 'Videre', onclick: () => (s.run ? NG.nodeDone() : NG.go('camp')) }),
      ]));
    }
  });

  /* ---------- Solgløtt: energien fylles alltid, så velger du én ting ---------- */
  NG.screen('sol', (app) => {
    const s = NG.state();
    const node = NG.runNode(s) || {};
    const maxE = NG.maxEnergy(s);
    if (!node.solE) {
      node.solE = { radiated: s.heat, gained: Math.max(0, maxE - s.energy) };
      NG.sfx('heal');
    }
    s.heat = 0; s.energy = Math.max(s.energy, maxE);
    NG.save();
    const canTrain = typeof NG.trainAbility === 'function';
    const maxHp = NG.maxHp(s);
    const heal = Math.min(maxHp - s.hp, Math.round(maxHp * 0.4));
    app.appendChild(NG.hud(s));
    const box = el('div', { class: 'stack sol' }, [
      el('div', { class: 'row' }, [NG.artEl('node-sol', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Hvil' }), el('h1', { class: 'h-display', text: 'Solgløtt' })])]),
      el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Energiregnskap' }),
        el('div', { class: 'num small', html: `Spillvarme strålt ut i verdensrommet: <strong>${node.solE.radiated} J</strong><br>Ny energi fra sola: <strong>${node.solE.gained} J</strong>` }),
        el('p', { class: 'small muted', text: 'Jorda kvitter seg med spillvarme ved å stråle den ut som infrarød stråling — og får ny høyverdig energi fra sola. Uten den strømmen ville alt endt som lunken, ubrukelig varme.' }),
      ]),
    ]);
    app.appendChild(box);

    if (node.sol) { result(); return; }

    box.appendChild(el('p', { class: 'sol-q', text: 'Sola har fylt energien. Hva bruker du hvilen på? Du rekker bare én ting.' }));
    const opts = el('div', { class: 'stack-s sol-choices' });
    opts.appendChild(choice('hvil', 'item-termos', 'Hvil', heal > 0 ? '+' + heal + ' HP (40 % av maks)' : 'Du har allerede full HP.', () => {
      s.hp = Math.min(maxHp, s.hp + heal);
      node.solMsg = heal > 0 ? 'Du sover i solveggen. +' + heal + ' HP.' : 'Du hviler, men var allerede i full form.';
      NG.sfx('heal');
    }));
    opts.appendChild(choice('studer', 'item-begrepskort', 'Studer', '3 repetisjonsspørsmål. Bonus-XP for hvert riktige svar.', null, () => {
      NG.go('review', { region: s.run ? s.run.region : null, count: 3, fromSol: true });
    }));
    if (canTrain) {
      opts.appendChild(choice('tren', 'item-partikkelbriller', 'Tren', 'Øv på en evne, så den blir sterkere.', () => {
        let res = null;
        try { res = NG.trainAbility(s); } catch (e) { res = null; }
        node.solMsg = typeof res === 'string' ? res : res && (res.text || res.msg) ? (res.text || res.msg) : 'Du øver på evnene dine i sollyset.';
        NG.sfx('level');
      }));
    }
    if (NG.oracleAvailable) {
      opts.appendChild(choice('orakel', 'item-lupe', 'Spør Orakelet', 'Forklar et fenomen med egne ord og få vurdering.', null, () => {
        NG.go('oracle', { region: s.run && s.run.region, fromSol: true });
      }));
    }
    box.appendChild(opts);

    function choice(id, art, name, sub, apply, go) {
      return el('button', { class: 'option row sol-choice', 'data-choice': id, onclick: () => {
        if (node.sol) return;
        node.sol = id;
        if (apply) apply();
        NG.save();
        if (go) go(); else NG.go('sol');
      } }, [NG.artEl(art, 'loot-art sm'), el('div', { class: 'grow stack-s' }, [el('strong', { text: name }), el('span', { class: 'small muted', text: sub })])]);
    }
    function result() {
      box.appendChild(el('div', { class: 'feedback good stack-s' }, [
        el('div', { class: 'h-display fb-title', text: { hvil: 'Uthvilt', tren: 'Trent', studer: 'Studert', orakel: 'Orakelet' }[node.sol] || 'Hvilt' }),
        node.solMsg ? el('div', { text: node.solMsg }) : null,
      ]));
      box.appendChild(el('button', { class: 'btn primary block', text: 'Videre', onclick: () => NG.nodeDone() }));
    }
  });

  /* ---------- Kiste ---------- */
  NG.screen('chest', (app) => {
    const s = NG.state();
    const node = NG.runNode(s);
    let loot = node && node.loot;
    if (!loot) {
      // Rull og gi belønningen én gang — lagres på noden
      const rng = NG.runRng(s, 7);
      const region = s.run ? s.run.region : 'energi';
      const j = rng.int(8, 18);
      s.joule += j; if (s.run) s.run.joule += j;
      const uses = NG.ITEMS.filter((i) => i.kind === 'use').map((i) => i.id);
      const itemId = rng.pick(uses.length ? uses : ['matpakke']);
      s.items[itemId] = (s.items[itemId] || 0) + 1;
      // Et begrepskort fra regionen (helst et du ikke kan godt)
      const cs = NG.content.store.concepts.filter((c) => c.region === region);
      cs.sort((a, b) => ((s.cards[a.id] || {}).lvl || 0) - ((s.cards[b.id] || {}).lvl || 0));
      const c = cs.length ? cs[Math.min(cs.length - 1, rng.int(0, 3))] : null;
      if (c) { const k = NG.card(s, c.id); if (k.lvl === 0) k.lvl = 1; }
      loot = { j, itemId, concept: c ? c.id : null };
      if (node) node.loot = loot;
      NG.save();
      NG.sfx('coin');
    }
    const it = NG.item(loot.itemId);
    const c = loot.concept ? NG.conceptById(loot.concept) : null;
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'stack' }, [
      el('div', { class: 'row' }, [NG.artEl('node-kiste', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Funn' }), el('h1', { class: 'h-display', text: 'Kiste' })])]),
      it ? el('div', { class: 'card row' }, [NG.artEl(it.art, 'loot-art'), el('div', { class: 'grow stack-s' }, [el('strong', { text: it.name }), el('span', { class: 'small muted', text: it.desc })])]) : null,
      el('div', { class: 'card row' }, [el('strong', { class: 'num gold', text: '+' + loot.j + ' ◆' }), el('span', { class: 'small muted', text: 'joule til Materiallageret' })]),
      c ? el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Begrepskort funnet — les det!' }),
        el('h3', { class: 'h-display', text: c.name }),
        el('div', { html: NG.md(c.def) }),
        c.example ? el('div', { class: 'small muted', html: NG.md(c.example) }) : null,
      ]) : null,
      el('button', { class: 'btn primary block', text: 'Videre', onclick: () => NG.nodeDone() }),
    ]));
  });

  /* ---------- Vandrende handelsmann ---------- */
  NG.screen('merchant', (app) => {
    const s = NG.state();
    const node = NG.runNode(s);
    if (!node) { NG.go(s.run ? 'path' : 'camp'); return; }
    if (!node.stock) {
      const rng = NG.runRng(s, 31);
      let relics = [];
      if (typeof NG.rollRelics === 'function') {
        try { relics = (NG.rollRelics(s, rng, 3, 'butikk') || []).map((x) => (typeof x === 'string' ? x : x && x.id)).filter(Boolean); } catch (e) { relics = []; }
      }
      if (!relics.length) relics = rng.shuffle(NG.ITEMS.filter((i) => i.kind === 'relic' && !NG.hasRelic(s, i.id))).slice(0, 3).map((i) => i.id);
      const uses = rng.shuffle(NG.ITEMS.filter((i) => i.kind === 'use')).slice(0, 3).map((i) => i.id);
      node.stock = { relics, uses, sold: [] };
      NG.save();
    }
    const st = node.stock;
    const reg = s.run ? NG.region(s.run.region) : null;
    if (reg) app.style.setProperty('--rc', reg.color);
    app.appendChild(NG.hud(s));
    const list = el('div', { class: 'stack-s shop-list' });
    const section = (title, ids) => {
      const items = ids.map((id) => (NG.relicDef ? NG.relicDef(id) : NG.item(id))).filter(Boolean);
      if (!items.length) return;
      list.appendChild(el('span', { class: 'label', text: title }));
      items.forEach((it) => {
        const sold = st.sold.indexOf(it.id) >= 0;
        const relic = isRelic(it);
        const owned = relic && NG.hasRelic(s, it.id);
        const has = !relic && s.items[it.id] ? ' (har ' + s.items[it.id] + ')' : '';
        const rar = it.rarity && NG.RARITY && NG.RARITY[it.rarity];
        list.appendChild(el('div', { class: 'card row item-row shop-row' + (sold ? ' sold' : '') }, [
          NG.artEl(it.art, 'loot-art sm'),
          el('div', { class: 'grow stack-s' }, [
            el('strong', { text: it.name + has }),
            rar ? el('span', { class: 'chip shop-rar', style: { color: rar.color, borderColor: rar.color }, text: rar.name + (NG.runRelic && NG.runRelic(it.id) ? ' · denne ekspedisjonen' : '') }) : null,
            el('span', { class: 'small', text: it.desc }), it.lore ? el('span', { class: 'small muted', html: NG.md(it.lore) }) : null]),
          el('button', { class: 'btn small shop-buy', disabled: sold || owned || s.joule < price(it) || null, text: sold ? 'Solgt' : owned ? 'Eies' : price(it) + ' ◆', onclick: () => buy(it) }),
        ]));
      });
    };
    section('Varige gjenstander', st.relics);
    section('Forbruksvarer', st.uses);
    app.appendChild(el('div', { class: 'stack' }, [
      el('div', { class: 'row' }, [NG.artEl('node-butikk', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Vandrende handelsmann' }), el('h1', { class: 'h-display', text: 'Handelsmannen' })])]),
      el('p', { class: 'ev-text', text: '«Jeg tar betalt i joule. Energien forsvinner ikke når du handler — den bare skifter eier.»' }),
      el('div', { class: 'card row' }, [el('span', { class: 'grow small muted', text: 'Du har' }), el('strong', { class: 'num gold', text: s.joule + ' ◆' })]),
      list,
      el('button', { class: 'btn primary block', text: 'Gå videre', onclick: () => NG.nodeDone() }),
    ]));

    function isRelic(it) { return it.kind === 'relic' || !!(NG.runRelic && NG.runRelic(it.id)); }
    // Pris: gjenstandens egen pris, ellers etter sjeldenhet (ekspedisjonsrelikvier varer bare én tur)
    function price(it) { return it.price || ({ vanlig: 35, sjelden: 55, episk: 80, boss: 110 }[it.rarity]) || 50; }
    function buy(it) {
      const cost = price(it);
      if (st.sold.indexOf(it.id) >= 0 || s.joule < cost) return;
      if (isRelic(it) && NG.hasRelic(s, it.id)) return;
      s.joule -= cost;
      if (isRelic(it)) gainRelic(s, it.id); else s.items[it.id] = (s.items[it.id] || 0) + 1;
      st.sold.push(it.id);
      NG.sfx('coin'); NG.toast('Kjøpt: ' + it.name);
      NG.save();
      NG.go('merchant');
    }
  });
})();
