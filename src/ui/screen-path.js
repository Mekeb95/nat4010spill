/* Ekspedisjonsstien + enkle noder (hendelse, solgløtt, kiste). */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  NG.screen('path', (app) => {
    const s = NG.state();
    if (!s.run) { NG.go('camp'); return; }
    const r = s.run;
    const reg = NG.region(r.region);
    app.style.setProperty('--rc', reg.color);
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row path-head' }, [
      NG.artEl('icon-' + reg.id, 'ph-icon'),
      el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Ekspedisjon' }), el('h1', { class: 'h-display', text: reg.name })]),
      el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') }),
    ]));
    const choosable = NG.choosable(s);
    const list = el('ol', { class: 'path', reversed: true });
    for (let li = r.layers.length - 1; li >= 0; li--) {
      const layer = r.layers[li];
      const row = el('li', { class: 'path-layer' + (li === r.layer + 1 ? ' next' : '') + (li <= r.layer ? ' past' : '') });
      layer.forEach((n, ni) => {
        const can = choosable.some((c) => c.layer === li && c.idx === ni);
        const here = li === r.layer && ni === r.idx;
        const t = NG.NODE_TYPES[n.type];
        const btn = el('button', {
          class: 'pnode t-' + n.type + (n.done ? ' done' : '') + (can ? ' can' : '') + (here ? ' here' : '') + (li <= r.layer && !here ? ' skipped' : ''),
          disabled: !can || null, 'aria-label': t.name + (n.done ? ' (ferdig)' : ''),
          onclick: () => { NG.sfx('click'); enter(li, ni); },
        }, [NG.artEl(t.art, 'pnode-art'), el('span', { class: 'pnode-l', text: t.name })]);
        row.appendChild(btn);
      });
      list.appendChild(row);
    }
    app.appendChild(list);
    const hint = choosable.length ? 'Velg neste steg. ' + choosable.map((c) => NG.NODE_TYPES[c.node.type].name + ': ' + NG.NODE_TYPES[c.node.type].desc).join(' ') : '';
    if (hint) app.appendChild(el('p', { class: 'small muted path-hint', text: hint }));
    setTimeout(() => { const n = app.querySelector('.path-layer.next'); if (n) try { n.scrollIntoView({ block: 'center' }); } catch (e) { /* */ } }, 30);

    function enter(li, ni) {
      const node = NG.enterNode(s, li, ni);
      NG.save();
      NG.openNode(node);
    }
  });

  NG.openNode = function (node) {
    if (node.type === 'kamp' || node.type === 'elite' || node.type === 'boss') NG.go('combat', { enemy: node.enemy });
    else if (node.type === 'lab') NG.go('lab', { id: node.lab, inRun: true });
    else if (node.type === 'hendelse') NG.go('event', { id: node.event });
    else if (node.type === 'sol') NG.go('sol');
    else NG.go('chest');
  };

  // Ferdig med en node i ekspedisjonen
  NG.nodeDone = function () {
    const s = NG.state();
    NG.completeNode(s);
    NG.save();
    NG.go('path');
  };

  /* ---------- Hendelse ---------- */
  NG.screen('event', (app, p) => {
    const s = NG.state();
    const ev = NG.content.store.events.find((e) => e.id === p.id);
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
      choices.appendChild(el('button', { class: 'option', html: NG.md(ch.label), onclick: () => pick(ch) }));
    });
    wrap.appendChild(choices);
    app.appendChild(wrap);

    function pick(ch) {
      NG.sfx(ch.correct ? 'good' : 'bad');
      choices.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const rw = ch.reward || {};
      const lines = [];
      if (rw.xp) { const ups = NG.gainXp(s, rw.xp); lines.push((rw.xp > 0 ? '+' : '') + rw.xp + ' XP'); if (ups) NG.announce({ levelUps: ups }); }
      if (rw.joule) { s.joule = Math.max(0, s.joule + rw.joule); if (s.run && rw.joule > 0) s.run.joule += rw.joule; lines.push((rw.joule > 0 ? '+' : '') + rw.joule + ' ◆'); }
      if (rw.hp) { s.hp = NG.clamp(s.hp + rw.hp, 1, NG.maxHp(s)); lines.push((rw.hp > 0 ? '+' : '') + rw.hp + ' HP'); }
      if (rw.energy) {
        if (rw.energy > 0) { s.energy += rw.energy; lines.push('+' + rw.energy + ' J'); }
        else { const e = Math.min(s.energy, -rw.energy); s.energy -= e; s.heat += e; lines.push('−' + e + ' J (til spillvarme)'); }
      }
      if (rw.item) { const it = NG.item(rw.item); if (it) { if (it.kind === 'relic') { if (!NG.hasRelic(s, it.id)) s.relics.push(it.id); } else s.items[it.id] = (s.items[it.id] || 0) + 1; lines.push(it.name); } }
      // Begrepene i hendelsen telles som et svar på nivå 4
      if (ev.concepts && ev.concepts.length) NG.announce({ cardUps: NG.updateCards(s, { concepts: ev.concepts, level: 4 }, !!ch.correct) });
      NG.save();
      wrap.appendChild(el('div', { class: 'feedback ' + (ch.correct ? 'good' : 'bad') + ' stack-s' }, [
        el('div', { class: 'h-display fb-title', text: ch.correct ? 'Godt valgt' : 'Det gikk ikke helt' }),
        el('div', { html: NG.md(ch.result || '') }),
        lines.length ? el('div', { class: 'num small', text: lines.join(' · ') }) : null,
        el('button', { class: 'btn primary block', text: 'Videre', onclick: () => (s.run ? NG.nodeDone() : NG.go('camp')) }),
      ]));
    }
  });

  /* ---------- Solgløtt ---------- */
  NG.screen('sol', (app) => {
    const s = NG.state();
    const maxE = NG.maxEnergy(s);
    const radiated = s.heat;
    const gained = Math.max(0, maxE - s.energy);
    const healed = Math.min(NG.maxHp(s) - s.hp, Math.round(NG.maxHp(s) * 0.3));
    s.heat = 0; s.energy = Math.max(s.energy, maxE); s.hp += healed;
    NG.save();
    NG.sfx('heal');
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'stack sol' }, [
      el('div', { class: 'row' }, [NG.artEl('node-sol', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Hvil' }), el('h1', { class: 'h-display', text: 'Solgløtt' })])]),
      el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Energiregnskap' }),
        el('div', { class: 'num small', html: `Spillvarme strålt ut i verdensrommet: <strong>${radiated} J</strong><br>Ny energi fra sola: <strong>${gained} J</strong><br>HP: <strong>+${healed}</strong>` }),
        el('p', { class: 'small muted', text: 'Jorda kvitter seg med spillvarme ved å stråle den ut som infrarød stråling — og får ny høyverdig energi fra sola. Uten den strømmen ville alt endt som lunken, ubrukelig varme.' }),
      ]),
      el('p', { text: 'Vil du bruke hvilen til å repetere? Tre riktige gir en bonus.' }),
      el('button', { class: 'btn primary block', text: 'Repeter 3 spørsmål (+bonus)', onclick: () => NG.go('review', { region: s.run ? s.run.region : null, count: 3, fromSol: true }) }),
      NG.oracleAvailable ? el('button', { class: 'btn block', text: 'Spør Orakelet', onclick: () => NG.go('oracle', { region: s.run && s.run.region, fromSol: true }) }) : null,
      el('button', { class: 'btn block ghost', text: 'Gå videre', onclick: () => NG.nodeDone() }),
    ]));
  });

  /* ---------- Kiste ---------- */
  NG.screen('chest', (app) => {
    const s = NG.state();
    const rng = NG.runRng(s, 7);
    const region = s.run ? s.run.region : 'energi';
    const j = rng.int(12, 30);
    s.joule += j; if (s.run) s.run.joule += j;
    const items = ['matpakke', 'kakao', 'repetisjonskort'];
    const itemId = rng.pick(items);
    s.items[itemId] = (s.items[itemId] || 0) + 1;
    // Et begrepskort fra regionen (helst et du ikke kan godt)
    const cs = NG.content.store.concepts.filter((c) => c.region === region);
    cs.sort((a, b) => ((s.cards[a.id] || {}).lvl || 0) - ((s.cards[b.id] || {}).lvl || 0));
    const c = cs.length ? cs[Math.min(cs.length - 1, rng.int(0, 3))] : null;
    if (c) { const k = NG.card(s, c.id); if (k.lvl === 0) k.lvl = 1; }
    NG.save();
    NG.sfx('coin');
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'stack' }, [
      el('div', { class: 'row' }, [NG.artEl('node-kiste', 'ev-art'), el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Funn' }), el('h1', { class: 'h-display', text: 'Kiste' })])]),
      el('div', { class: 'card row' }, [NG.artEl(NG.item(itemId).art, 'loot-art'), el('div', { class: 'grow stack-s' }, [el('strong', { text: NG.item(itemId).name }), el('span', { class: 'small muted', text: NG.item(itemId).desc })])]),
      el('div', { class: 'card row' }, [el('strong', { class: 'num gold', text: '+' + j + ' ◆' }), el('span', { class: 'small muted', text: 'joule til Materiallageret' })]),
      c ? el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Begrepskort funnet — les det!' }),
        el('h3', { class: 'h-display', text: c.name }),
        el('div', { html: NG.md(c.def) }),
        c.example ? el('div', { class: 'small muted', html: NG.md(c.example) }) : null,
      ]) : null,
      el('button', { class: 'btn primary block', text: 'Videre', onclick: () => NG.nodeDone() }),
    ]));
  });
})();
