/* Sekk/egenskaper, Materiallageret, Laben, Orakelet, Innstillinger og finale. */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  /* ---------- Sekken ---------- */
  const STATS = [
    { id: 'forstaelse', name: 'Forståelse', desc: 'Mer skade per riktig svar.' },
    { id: 'utholdenhet', name: 'Utholdenhet', desc: '+10 maks HP.' },
    { id: 'nysgjerrighet', name: 'Nysgjerrighet', desc: '+6 maks energi, flere hint, mer XP og kritiske treff.' },
  ];
  NG.screen('sekk', (app, p) => {
    const s = NG.state();
    const back = () => (p.back && p.back.name !== 'sekk' ? NG.go(p.back.name, p.back.params) : NG.go('camp'));
    app.appendChild(NG.hud(s, { noNav: true }));
    app.appendChild(el('div', { class: 'row' }, [el('h1', { class: 'h-display grow', text: 'Ryggsekken' }), el('button', { class: 'btn ghost small', text: 'Tilbake', onclick: back })]));
    const acc = s.counters.answered ? Math.round(100 * s.counters.correct / s.counters.answered) : 0;
    app.appendChild(el('div', { class: 'card row sekk-head' }, [NG.artEl('laerling', 'sekk-ava'), el('div', { class: 'grow stack-s' }, [
      el('strong', { class: 'h-display', style: { fontSize: 'var(--t-xl)' }, text: s.name + ' · nivå ' + s.level }),
      el('span', { class: 'small muted num', text: s.xp + ' / ' + NG.xpNeed(s.level) + ' XP til neste nivå' }),
      el('span', { class: 'small muted num', text: s.counters.answered + ' svar · ' + acc + ' % riktige · beste rekke ' + s.counters.bestStreak }),
    ])]));
    const st = el('div', { class: 'card stack-s' }, [el('div', { class: 'row' }, [el('span', { class: 'label grow', text: 'Egenskaper' }), s.statPoints ? el('span', { class: 'chip', text: s.statPoints + ' poeng å fordele' }) : null])]);
    for (const x of STATS) {
      st.appendChild(el('div', { class: 'row stat-row' }, [
        el('div', { class: 'grow stack-s' }, [el('strong', { text: x.name + ' ' + s.stats[x.id] }), el('span', { class: 'small muted', text: x.desc })]),
        el('button', { class: 'btn small', disabled: !s.statPoints || null, 'aria-label': 'Øk ' + x.name, text: '+1', onclick: () => {
          s.stats[x.id]++; s.statPoints--;
          if (x.id === 'utholdenhet') s.hp += 10;
          if (x.id === 'nysgjerrighet') NG.addEnergy(s, 6); // maks er allerede hevet med 6
          NG.sfx('level'); NG.save(); NG.go('sekk', p);
        } }),
      ]));
    }
    app.appendChild(st);
    // Evner med mestringsnivå
    const abs = el('div', { class: 'card stack-s' }, [el('div', { class: 'row' }, [el('span', { class: 'label grow', text: 'Evner' }), el('span', { class: 'small muted', text: 'Trykk for detaljer' })])]);
    for (const ab of NG.ABILITIES) abs.appendChild(abilityRow(s, ab));
    abs.appendChild(el('p', { class: 'small muted', text: 'Evnene får mestring når du bruker dem og svarer riktig etterpå (litt også ved feil). Nivå 1 → 5, og hvert nivå gir en ny effekt.' }));
    app.appendChild(abs);
    if (s.run) {
      const rr = el('div', { class: 'card stack-s' }, [el('div', { class: 'row' }, [el('span', { class: 'label grow', text: 'Ekspedisjonsrelikvier' }), el('span', { class: 'small muted', text: 'varer ut ekspedisjonen' })])]);
      const ids = NG.runRelics(s);
      if (!ids.length) rr.appendChild(el('p', { class: 'small muted', text: 'Ingen ennå. Eliter gir deg «Velg én av tre».' }));
      for (const id of ids) { const d = NG.runRelic(id); if (d) rr.appendChild(relicRow(d)); }
      app.appendChild(rr);
    }
    const relics = el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Varige gjenstander' })]);
    if (!s.relics.length) relics.appendChild(el('p', { class: 'small muted', text: 'Ingen ennå. Eliter og bosser slipper dem, og Materiallageret selger dem.' }));
    for (const id of s.relics) { const it = NG.item(id); if (it) relics.appendChild(itemRow(it)); }
    app.appendChild(relics);
    const inv = el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Forbruksvarer' })]);
    let any = false;
    for (const id in s.items) {
      if (!(s.items[id] > 0)) continue; any = true;
      const it = NG.item(id); if (!it) continue;
      const row = itemRow(it, ' ×' + s.items[id]);
      if (id === 'kakao' && s.hp < NG.maxHp(s)) row.appendChild(el('button', { class: 'btn small', text: 'Bruk', onclick: () => { s.items[id]--; s.hp = Math.min(NG.maxHp(s), s.hp + 25); NG.sfx('heal'); NG.save(); NG.go('sekk', p); } }));
      if (id === 'matpakke' && s.energy < NG.maxEnergy(s)) row.appendChild(el('button', { class: 'btn small', text: 'Spis', onclick: () => { s.items[id]--; const r = NG.addEnergy(s, 20); NG.toast('+' + r.gained + ' J' + (r.heat ? ' (' + r.heat + ' J ble spillvarme)' : '')); NG.sfx('heal'); NG.save(); NG.go('sekk', p); } }));
      inv.appendChild(row);
    }
    if (!any) inv.appendChild(el('p', { class: 'small muted', text: 'Tom.' }));
    app.appendChild(inv);
    app.appendChild(el('div', { class: 'card stack-s' }, [
      el('span', { class: 'label', text: 'Energiregnskap' }),
      el('p', { class: 'small num', html: `Energi: <strong>${s.energy} J</strong> · Spillvarme: <strong>${s.heat} J</strong> · Sum: <strong>${s.energy + s.heat} J</strong>` }),
      el('p', { class: 'small muted', text: 'Når du bruker evner, flyttes energi til spillvarme. Summen endres bare når energi tilføres (sola, mat) eller stråler ut (Solgløtt). Det er 1. og 2. hovedsetning i lommeformat.' }),
    ]));
  });
  function itemRow(it, extra) {
    return el('div', { class: 'row item-row' }, [NG.artEl(it.art, 'loot-art sm'), el('div', { class: 'grow stack-s' }, [
      el('strong', { text: it.name + (extra || '') }), el('span', { class: 'small', html: NG.md(it.desc) }), el('span', { class: 'small muted', html: NG.md(it.lore) })])]);
  }
  function relicRow(d) {
    return el('button', { class: 'row item-row relic-line r-' + d.rarity, onclick: () => NG.showRelic(d.id) }, [NG.artEl(d.art, 'loot-art sm'), el('div', { class: 'grow stack-s' }, [
      el('div', { class: 'row rc-head' }, [el('strong', { text: d.name }), el('span', { class: 'chip rar', text: NG.RARITY[d.rarity].name })]),
      el('span', { class: 'small', text: d.desc })])]);
  }
  function pips(lvl) { return el('span', { class: 'pips ab-pips', 'aria-label': 'Nivå ' + lvl + ' av 5', text: '●'.repeat(lvl) + '○'.repeat(5 - lvl) }); }
  function abilityRow(s, ab) {
    const open = NG.abilityUnlocked(s, ab);
    const a = NG.abilityState(s, ab.id);
    const lockTxt = ab.needs && !NG.hasRelic(s, ab.needs) ? 'Krever ' + NG.item(ab.needs).name : ab.unlock && s.level < ab.unlock ? 'Låses opp på nivå ' + ab.unlock : '';
    return el('button', { class: 'row item-row ab-line' + (open ? '' : ' locked'), onclick: () => NG.showAbility(ab.id) }, [
      NG.artEl(ab.icon, 'loot-art sm'),
      el('div', { class: 'grow stack-s' }, [
        el('div', { class: 'row rc-head' }, [el('strong', { text: ab.name }), open ? pips(a.lvl) : el('span', { class: 'chip', text: 'Låst' })]),
        el('span', { class: 'small', text: open ? ab.desc : lockTxt }),
        open && a.lvl < 5 ? el('div', { class: 'bar thin' }, el('i', { style: { width: (100 * a.xp / NG.ABILITY_NEED[a.lvl]) + '%', background: 'var(--xp)' } })) : null,
      ]),
      el('span', { class: 'chip num', text: NG.abilityCost(s, ab) + ' J' }),
    ]);
  }

  // Detaljark for en evne: hva den gjør, kostnad, naturfaget bak, nivå og neste nivå.
  NG.showAbility = function (id) {
    const s = NG.state();
    const ab = NG.ability(id);
    if (!ab) return;
    const a = NG.abilityState(s, id);
    const open = NG.abilityUnlocked(s, ab);
    const body = el('div', { class: 'stack ab-sheet' }, [
      el('div', { class: 'row' }, [NG.artEl(ab.icon, 'loot-art'), el('div', { class: 'grow stack-s' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip num', text: NG.abilityCost(s, ab) + ' J' }), pips(a.lvl), el('span', { class: 'small muted', text: 'nivå ' + a.lvl + '/5' })]),
        el('span', { text: ab.desc }),
      ])]),
      !open ? el('div', { class: 'feedback', text: ab.needs && !NG.hasRelic(s, ab.needs) ? 'Krever ' + NG.item(ab.needs).name + ' (Materiallageret).' : 'Låses opp når du når nivå ' + ab.unlock + '.' }) : null,
      el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Naturfaget bak' }), el('div', { class: 'small', html: NG.md(ab.science) })]),
      el('div', { class: 'stack-s' }, [
        el('span', { class: 'label', text: 'Mestring' }),
        a.lvl < 5 ? el('div', { class: 'row small' }, [el('div', { class: 'bar grow' }, el('i', { style: { width: (100 * a.xp / NG.ABILITY_NEED[a.lvl]) + '%', background: 'var(--xp)' } })), el('span', { class: 'num', text: a.xp + '/' + NG.ABILITY_NEED[a.lvl] })]) : el('span', { class: 'small', text: 'Fullt mestret!' }),
        el('ol', { class: 'ab-levels' }, ab.levels.slice(1).map((txt, i) => el('li', { class: i + 1 <= a.lvl ? 'on' : (i + 1 === a.lvl + 1 ? 'next' : '') }, [
          el('span', { class: 'num ab-lv', text: String(i + 1) }), el('span', { class: 'small', text: txt + (i + 1 === a.lvl + 1 ? ' (neste)' : '') })]))),
        el('p', { class: 'small muted', text: 'Mestring: +2 når du bruker evnen og svarer riktig, +1 ved feil svar. Trening på hvileplasser gir også mestring.' }),
      ]),
    ]);
    NG.sheet(ab.name, body);
  };

  // Detaljark for en relikvie (ekspedisjon eller varig)
  NG.showRelic = function (id) {
    const d = NG.relicDef(id);
    if (!d) return;
    const run = !!NG.runRelic(id);
    NG.sheet(d.name, el('div', { class: 'stack' }, [
      el('div', { class: 'row' }, [NG.artEl(d.art, 'loot-art'), el('div', { class: 'grow stack-s' }, [
        el('div', { class: 'row' }, [run ? el('span', { class: 'chip rar r-' + d.rarity, text: NG.RARITY[d.rarity].name }) : el('span', { class: 'chip', text: 'Varig' }),
          el('span', { class: 'small muted', text: run ? 'Varer ut ekspedisjonen' : 'Følger deg alltid' })]),
        el('span', { html: NG.md(d.desc) }),
      ])]),
      el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Naturfaget bak' }), el('div', { class: 'small', html: NG.md(d.lore) })]),
    ]));
  };

  /* ---------- Materiallageret ---------- */
  NG.screen('shop', (app) => {
    const s = NG.state();
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row' }, [el('h1', { class: 'h-display grow', text: 'Materiallageret' }), el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') })]));
    app.appendChild(el('p', { class: 'small muted', text: 'Joule (◆) får du fra kamper, kister og dagens repetisjon.' }));
    const list = el('div', { class: 'stack-s' });
    for (const it of NG.ITEMS) {
      const owned = it.kind === 'relic' && NG.hasRelic(s, it.id);
      const row = itemRow(it, it.kind === 'use' && s.items[it.id] ? ' (har ' + s.items[it.id] + ')' : '');
      row.classList.add('card');
      row.appendChild(el('button', { class: 'btn small', disabled: owned || s.joule < it.price || null, text: owned ? 'Eies' : it.price + ' ◆', onclick: () => {
        s.joule -= it.price;
        NG.gainRelic(s, it.id);
        NG.sfx('coin'); NG.save(); NG.go('shop');
      } }));
      list.appendChild(row);
    }
    app.appendChild(list);
  });

  /* ---------- Laben: oversikt (øvingsmodus) ---------- */
  NG.screen('labs', (app) => {
    const s = NG.state();
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row' }, [el('h1', { class: 'h-display grow', text: 'Laben' }), el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') })]));
    app.appendChild(el('p', { class: 'small muted', text: 'Alle mini-spill du har låst opp kan øves her (halv XP). Nye dukker opp når du møter dem på ekspedisjon — eller når regionen er åpen.' }));
    const list = el('div', { class: 'stack-s' });
    for (const r of NG.REGIONS) {
      const ms = NG.minigames.forRegion(r.id);
      if (!ms.length) continue;
      const open = NG.isUnlocked(s, r);
      list.appendChild(el('span', { class: 'label', style: { color: r.color }, text: r.name }));
      for (const m of ms) {
        const best = s.labs[m.id];
        list.appendChild(el('button', { class: 'option row lab-row', disabled: !open || null, style: { '--rc': r.color }, onclick: () => NG.go('lab', { id: m.id }) }, [
          NG.artEl('node-lab', 'loot-art sm'),
          el('div', { class: 'grow stack-s' }, [el('strong', { text: m.title }), el('span', { class: 'small muted', text: m.blurb || '' })]),
          el('span', { class: 'chip num', text: best != null ? Math.round(best * 100) + ' %' : (open ? 'Ny' : 'Låst') }),
        ]));
      }
    }
    app.appendChild(list);
  });

  /* ---------- Laben: spill ett mini-spill ---------- */
  NG.screen('lab', (app, p) => {
    const s = NG.state();
    const m = NG.minigames.get(p.id);
    if (!m) { if (p.inRun) NG.nodeDone(); else NG.go('labs'); return; }
    // Allerede gjennomført i denne ekspedisjonen (f.eks. tilbake fra sekken): ingen ny belønning
    const runNode = p.inRun && s.run && NG.runNode ? NG.runNode(s) : null;
    if (runNode && runNode.claimed) { NG.nodeDone(); return; }
    let left = false;
    const reg = NG.region(m.region);
    app.style.setProperty('--rc', reg.color);
    app.appendChild(el('div', { class: 'row lab-head' }, [
      NG.artEl('node-lab', 'ph-icon'),
      el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Laben · ' + reg.name + ' · ' + m.title })]),
      el('button', { class: 'btn ghost small', text: p.inRun ? 'Hopp over' : 'Avbryt', onclick: () => { left = true; stop(); p.inRun ? NG.nodeDone() : NG.go('labs'); } }),
    ]));
    const root = el('div', { class: 'mg-root' });
    app.appendChild(root);
    const visits = NG.regionTier ? NG.regionTier(s, m.region) + 1 : (s.regionVisits[m.region] || 0);
    let inst = null;
    const api = NG.makeMinigameApi({
      seed: (Date.now() ^ NG.hashStr(m.id)) >>> 0,
      difficulty: NG.clamp(1 + Math.floor(visits / 2) + (s.labs[m.id] > 0.8 ? 1 : 0), 1, 3),
      onDone: (r) => setTimeout(() => finish(r), 300),
    });
    try { inst = m.start(root, api); } catch (e) {
      root.appendChild(el('div', { class: 'feedback bad', text: 'Mini-spillet krasjet: ' + e.message }));
    }
    function stop() { if (inst && inst.destroy) try { inst.destroy(); } catch (e) { /* */ } }
    function finish(r) {
      if (left) return;
      left = true;
      stop();
      if (runNode) runNode.claimed = true;
      const prev = s.labs[m.id];
      s.labs[m.id] = Math.max(prev || 0, r.score);
      s.counters.labs++;
      let xp = Math.round((15 + 45 * r.score) * (p.inRun ? 1 : 0.5));
      const ups = NG.gainXp(s, xp);
      const j = p.inRun ? Math.round(8 + 20 * r.score) : 0;
      s.joule += j; if (s.run) s.run.joule += j;
      const cardUps = NG.updateCards(s, { concepts: (m.concepts || []).filter((c) => NG.conceptById(c)), level: r.score >= 0.85 ? 4 : 3 }, r.score >= 0.6);
      NG.save();
      NG.announce({ cardUps, levelUps: ups });
      NG.sfx(r.score >= 0.6 ? 'win' : 'coin');
      app.innerHTML = '';
      app.append(NG.hud(s), el('div', { class: 'stack' }, [
        el('span', { class: 'label', text: 'Laben · ' + reg.name }),
        el('h1', { class: 'h-display', text: m.title + ': ' + Math.round(r.score * 100) + ' %' }),
        el('div', { class: 'card rw-grid' }, [cell('+' + xp, 'XP'), cell(j ? '+' + j : '–', '◆'), cell(r.total ? r.correct + '/' + r.total : '–', 'riktige'), cell(prev != null ? Math.round(prev * 100) + ' %' : 'ny', 'forrige beste')]),
        r.notes ? el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Hva du øvde på' }), el('div', { class: 'small', html: NG.md(r.notes) })]) : null,
        (m.concepts || []).filter((c) => NG.conceptById(c)).length ? el('div', { class: 'row' }, (m.concepts || []).filter((c) => NG.conceptById(c)).map((c) => NG.conceptChip(c))) : null,
        el('button', { class: 'btn primary block', text: 'Videre', onclick: () => (p.inRun && s.run ? NG.nodeDone() : NG.go('labs')) }),
        p.inRun ? null : el('button', { class: 'btn block', text: 'Spill igjen', onclick: () => NG.go('lab', p) }),
      ]));
    }
    function cell(v, l) { return el('div', { class: 'rw' }, [el('strong', { class: 'num', text: v }), el('span', { class: 'small muted', text: l })]); }
    return () => { left = true; stop(); };
  });

  /* ---------- Innstillinger ---------- */
  NG.screen('settings', (app) => {
    const s = NG.state();
    app.appendChild(el('div', { class: 'row' }, [el('h1', { class: 'h-display grow', text: 'Innstillinger' }), el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') })]));
    const name = el('input', { class: 'num-in', id: 'set-name', value: s.name, maxlength: '24', 'aria-label': 'Navn' });
    const code = el('textarea', { class: 'num-in code-area', id: 'set-code', rows: '3', 'aria-label': 'Lagringskode', placeholder: 'Lim inn en lagringskode for å hente fremgang fra en annen enhet' });
    app.appendChild(el('div', { class: 'stack' }, [
      el('div', { class: 'card stack-s' }, [el('label', { class: 'label', for: 'set-name', text: 'Navnet ditt' }), el('div', { class: 'row' }, [name, el('button', { class: 'btn small', text: 'Lagre', onclick: () => { s.name = name.value.trim() || 'Lærling'; NG.save(); NG.toast('Lagret'); } })])]),
      el('div', { class: 'card row' }, [el('span', { class: 'grow', text: 'Lyd' }), el('button', { class: 'btn small', id: 'set-sound', text: NG.audio.muted ? 'Av' : 'På', onclick: (e) => { NG.audio.setMuted(!NG.audio.muted); e.target.textContent = NG.audio.muted ? 'Av' : 'På'; NG.sfx('click'); } })]),
      NG.music ? el('div', { class: 'card stack-s' }, [
        el('div', { class: 'row' }, [el('span', { class: 'grow', text: 'Musikk' }), el('button', { class: 'btn small', id: 'set-music', text: NG.music.enabled ? 'På' : 'Av', onclick: (e) => { NG.music.setEnabled(!NG.music.enabled); e.target.textContent = NG.music.enabled ? 'På' : 'Av'; } })]),
        el('input', { type: 'range', id: 'set-music-vol', min: '0', max: '100', step: '5', value: String(Math.round(NG.music.volume * 100)), 'aria-label': 'Musikkvolum', style: { width: '100%', accentColor: 'var(--xp)' }, oninput: (e) => NG.music.setVolume(e.target.value / 100) }),
      ]) : null,
      NG.wakeLock.supported ? el('div', { class: 'card row' }, [
        el('div', { class: 'grow stack-s' }, [el('span', { text: 'Skjerm alltid på' }), el('span', { class: 'small muted', text: 'Hindrer at skjermen slukker mens du tenker.' })]),
        el('button', { class: 'btn small', id: 'set-wake', text: NG.wakeLock.on ? 'På' : 'Av', onclick: (e) => { NG.wakeLock.set(!NG.wakeLock.on); e.target.textContent = NG.wakeLock.on ? 'På' : 'Av'; NG.sfx('click'); } }),
      ]) : null,
      installCard(),
      el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Flytt fremgang' }),
        el('p', { class: 'small muted', text: NG.cloud ? 'Fremgangen din lagres i skyen og følger deg når du åpner spillet på en annen enhet. Koden under er en ekstra sikkerhetskopi.' : 'Fremgangen lagres i nettleseren på denne enheten. Kopier koden for å ta den med til en annen enhet.' }),
        el('div', { class: 'row' }, [
          el('button', { class: 'btn small', text: 'Kopier min kode', onclick: () => {
            const c = NG.exportSave(); code.value = c;
            try { navigator.clipboard.writeText(c).then(() => NG.toast('Kopiert'), () => { code.select(); NG.toast('Merk og kopier teksten'); }); } catch (e) { code.select(); }
          } }),
          el('button', { class: 'btn small', text: 'Hent fra kode', onclick: () => { if (NG.importSave(code.value)) { NG.toast('Fremgang hentet'); NG.go('camp'); } else NG.toast('Ugyldig kode'); } }),
        ]),
        code,
      ]),
      el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Om spillet' }),
        el('p', { class: 'small', text: 'Laget for NAT4010 (Naturfag 1: Energi, stoffer og praksiser). Innholdet bygger på Naturfagsenterets nøkkelark og emnets pensum. Spørsmålene kommer tilbake etter et repetisjonsskjema (1, 2, 4, 8 … dager).' }),
        el('p', { class: 'small muted num', text: NG.content.store.questions.length + ' spørsmål · ' + NG.content.store.concepts.length + ' begreper · ' + NG.minigames.list.length + ' mini-spill' }),
      ]),
      el('button', { class: 'btn ghost block', text: 'Til tittelskjermen', onclick: () => NG.go('title') }),
    ]));
  });

  function installCard() {
    const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
    if (standalone) return null;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (NG.installPrompt) {
      return el('div', { class: 'card row' }, [
        el('div', { class: 'grow stack-s' }, [el('strong', { text: 'Installer appen' }), el('span', { class: 'small muted', text: 'Legg Nøkkelvokteren på hjemskjermen. Den virker også uten nett.' })]),
        el('button', { class: 'btn small primary', text: 'Installer', onclick: () => { const p = NG.installPrompt; NG.installPrompt = null; p.prompt(); } }),
      ]);
    }
    if (ios && location.protocol === 'https:') {
      return el('div', { class: 'card stack-s' }, [el('strong', { text: 'Installer appen' }),
        el('span', { class: 'small muted', text: 'Trykk på Del-knappen i Safari og velg «Legg til på Hjem-skjerm».' })]);
    }
    return null;
  }

  /* ---------- Finale ---------- */
  NG.screen('finale', (app) => {
    const s = NG.state();
    const acc = s.counters.answered ? Math.round(100 * s.counters.correct / s.counters.answered) : 0;
    const top = NG.content.store.concepts.filter((c) => (s.cards[c.id] || {}).lvl >= 4).length;
    app.appendChild(el('div', { class: 'stack finale' }, [
      el('span', { class: 'label', text: 'Alle åtte nøkkelark er restaurert' }),
      el('h1', { class: 'h-display title-h', text: 'Nøkkelvokter' }),
      NG.artEl('laerling', 'title-hero'),
      el('p', { text: s.name + ', du har gått fra ord til begrep. Hverdagsspråket er ikke slått ut — det trengs som bro. Men nå kan du bygge broen selv, for elevene dine.' }),
      el('div', { class: 'card rw-grid' }, [
        cell(String(s.counters.answered), 'svar'), cell(acc + ' %', 'riktige'), cell(String(top), 'kort på Anvende+'), cell(String(s.level), 'nivå'),
      ]),
      el('p', { class: 'small muted', text: 'Spillet slutter ikke her: regionene blir vanskeligere for hvert besøk, og repetisjonen holder begrepene varme til eksamen.' }),
      el('button', { class: 'btn primary block', text: 'Tilbake til leiren', onclick: () => NG.go('camp') }),
    ]));
    function cell(v, l) { return el('div', { class: 'rw' }, [el('strong', { class: 'num', text: v }), el('span', { class: 'small muted', text: l })]); }
  });
})();
