/* Kampskjermen. */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  // Langt trykk på node → fn(). Hindrer at det etterfølgende klikket også utløses.
  function longPress(node, fn) {
    let t = null; let fired = false;
    const cancel = () => { clearTimeout(t); t = null; };
    node.addEventListener('pointerdown', () => { fired = false; cancel(); t = setTimeout(() => { fired = true; t = null; fn(); }, 480); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => node.addEventListener(ev, cancel));
    node.addEventListener('click', (e) => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
    node.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  NG.longPress = longPress;

  NG.screen('combat', (app, p) => {
    const s = NG.state();
    // Beskyttelse: en kamp i en ekspedisjon som allerede er avgjort, skal ikke kunne startes på nytt.
    if (s.run && NG.runNode) {
      const node = NG.runNode(s);
      if (node && node.done) { NG.go('path'); return; }
    }
    const rng = NG.makeRng((s.run ? s.run.seed : Date.now()) + (s.counters.answered * 31) + 17);
    const used = new Set(s.run ? s.run.usedQ : []);
    const c = NG.Combat.create(s, p.enemy, { rng, region: s.run ? s.run.region : null, used });
    if (!c.region) c.region = c.def.region;
    const reg = NG.region(c.region);
    app.style.setProperty('--rc', reg.color);
    s.counters.fights++;
    let busy = false;
    let settled = null;

    const hudSlot = el('div');
    const enemyArt = NG.artEl(c.def.art || c.def.id, 'en-art tier-' + c.tier);
    const enemyHp = el('i', { style: { background: 'var(--bad)' } });
    const enemyHpTxt = el('span', { class: 'num small' });
    const intentPill = el('button', { class: 'intent', type: 'button', 'aria-label': 'Hva betyr planen?', onclick: () => intentSheet() });
    const bubble = el('div', { class: 'bubble' });
    const relicRow = el('div', { class: 'relic-row', 'aria-label': 'Relikvier' });
    const status = el('div', { class: 'row cb-status' });
    const abil = el('div', { class: 'abilities' });
    const qbox = el('div', { class: 'qbox' });
    const modChips = c.mods.map((m) => el('button', { class: 'chip mod-chip', type: 'button', text: NG.ELITE_MODS[m].name, onclick: () => NG.sheet(NG.ELITE_MODS[m].name, el('p', { text: NG.ELITE_MODS[m].desc })) }));
    const arena = el('section', { class: 'arena' }, [
      el('div', { class: 'en-top row' }, [
        el('div', { class: 'grow stack-s' }, [
          el('div', { class: 'row en-title' }, [el('strong', { class: 'en-name', text: c.def.name }), el('span', { class: 'chip', text: { normal: 'Misforståelse', elite: 'Elite', boss: 'BOSS' }[c.tier] || '' }), ...modChips]),
          el('div', { class: 'row' }, [el('div', { class: 'bar grow' }, enemyHp), enemyHpTxt]),
        ]),
      ]),
      el('div', { class: 'en-stage' }, [enemyArt, bubble, intentPill]),
    ]);
    app.append(hudSlot, arena, relicRow, status, abil, qbox);

    function refresh() {
      if (settled) return;
      hudSlot.innerHTML = ''; hudSlot.appendChild(NG.hud(s, { noNav: true }));
      enemyHp.style.width = (100 * c.enemy.hp / c.enemy.maxHp) + '%';
      enemyHpTxt.textContent = c.enemy.hp + '/' + c.enemy.maxHp;
      const it = NG.Combat.intent(c);
      const info = NG.INTENT_TEXT[it];
      intentPill.className = 'intent i-' + it;
      intentPill.innerHTML = '';
      intentPill.append(el('strong', { text: info.name }), el('span', { class: 'small', text: ' · ' + info.desc }));
      if (NG.hasRelic(s, 'lupe') || c.reveal) {
        const seq = [1, 2].map((k) => NG.INTENT_TEXT[NG.Combat.intent(c, k)].name);
        intentPill.append(el('span', { class: 'small muted', text: ' → ' + seq.join(' → ') }));
      }
      renderRelics();
      status.innerHTML = '';
      const chip = (cls, text) => status.appendChild(el('span', { class: 'chip ' + (cls || ''), text }));
      if (c.streak >= 2) chip('st-streak', 'Rekke ×' + c.streak);
      if (c.shield) chip('st-shield', 'Skjold' + (c.shield > 1 ? ' ×' + c.shield : ''));
      if (c.peb) {
        const need = NG.abilityLevel(s, 'peb') >= 5 ? 2 : 3;
        const names = need === 2 ? ['Påstand', 'Evidens + begrunnelse'] : ['Påstand', 'Evidens', 'Begrunnelse'];
        chip('st-peb', 'PEB: ' + (names[c.peb - 1] || '') + '…');
      }
      if (c.model) chip('st-peb', 'Modell klar' + (c.model > 1 ? ' ×' + c.model : ''));
      if (c.double) chip('', 'Dobbel skade');
      if (c.forceCrit) chip('st-streak', 'Magnesium');
      if (c.wrongBlocked) chip('', 'Vernebriller');
      if (c.infect) chip('st-infect', 'Smitte ' + c.infect);
      if (c.retry) chip('st-ghost', 'Kontrollforsøk ×1,5');
      if (NG.hasRelic(s, 'vandegraaff')) chip('', 'Ladning ' + c.charge + '/4');
      if (c.ghost && c.q) chip('st-ghost', 'Gjenferd fra ' + NG.region(c.q.region).name);
      if (NG.Combat.intent(c) === 'mytekall' && c.q && c.q.myth) chip('st-myth', 'Myten');
      renderAbilities();
    }

    function renderRelics() {
      relicRow.innerHTML = '';
      const ids = NG.runRelics(s).concat((s.relics || []));
      for (const id of ids) {
        const d = NG.relicDef(id); if (!d) continue;
        const run = !!NG.runRelic(id);
        relicRow.appendChild(el('button', { class: 'relic-ic' + (run ? ' run r-' + d.rarity : ' perm'), type: 'button', 'aria-label': d.name, title: d.name, onclick: () => NG.showRelic(id) },
          NG.artEl(d.art, 'relic-art')));
      }
      relicRow.hidden = !relicRow.childNodes.length;
    }

    function renderAbilities() {
      abil.innerHTML = '';
      const locked = busy || !c.q || c.over;
      for (const ab of NG.ABILITIES) {
        if (!NG.abilityUnlocked(s, ab)) continue;
        const ci = NG.Combat.abilityCost(s, c, ab);
        const lvl = NG.abilityLevel(s, ab.id);
        const btn = el('button', { class: 'ab', 'data-ab': ab.id, disabled: locked || s.energy < ci.cost || null, 'aria-label': ab.name + ', nivå ' + lvl + ', ' + ci.cost + ' J', onclick: () => {
          const r = NG.Combat.useAbility(s, c, ab.id);
          NG.toast(r.msg);
          if (r.ok) {
            NG.sfx('click'); NG.save();
            if (r.up) abilityUp(r.up);
            if (ab.id === 'blikk') showQuestion(true);
            if (r.hint) showHint(true);
            refresh();
          } else NG.sfx('bad');
        } }, [
          el('span', { class: 'ab-n', html: ab.short || ab.name }),
          el('span', { class: 'ab-meta' }, [el('span', { class: 'ab-l', 'aria-hidden': 'true', text: '●'.repeat(lvl) + '○'.repeat(5 - lvl) }), el('span', { class: 'ab-c num', text: ci.free ? 'gratis' : ci.cost + ' J' })]),
        ]);
        const wrap = el('div', { class: 'abw' }, [btn, el('button', { class: 'ab-i', type: 'button', 'aria-label': 'Om ' + ab.name, text: 'i', onclick: () => NG.showAbility(ab.id) })]);
        longPress(wrap, () => NG.showAbility(ab.id));
        abil.appendChild(wrap);
      }
      const hintBtn = el('button', { class: 'ab', disabled: locked || c.hints <= 0 || null, onclick: () => showHint(false) },
        [el('span', { class: 'ab-n', text: 'Hint' }), el('span', { class: 'ab-meta' }, el('span', { class: 'ab-c num', text: c.hints + ' igjen' }))]);
      abil.appendChild(el('div', { class: 'abw' }, [hintBtn, el('button', { class: 'ab-i', type: 'button', 'aria-label': 'Om hint', text: 'i', onclick: () => NG.sheet('Hint', el('div', { class: 'stack small' }, [
        el('p', { text: 'Et hint viser begrepskortene spørsmålet bygger på — definisjonen, ikke svaret. Du har ' + NG.hintsPerFight(s) + ' hint per kamp (mer med høy Nysgjerrighet og Feynmans notatbok).' }),
        NG.hasRelic(s, 'mikroskop') ? el('p', { text: 'Mikroskopet: hintet fjerner også ett galt alternativ på flervalg.' }) : null,
      ])) })]));
      const nItems = NG.combatItems().reduce((a, it) => a + (s.items[it.id] || 0), 0);
      abil.appendChild(el('div', { class: 'abw' }, el('button', { class: 'ab', disabled: locked || !nItems || null, onclick: items },
        [el('span', { class: 'ab-n', text: 'Sekk' }), el('span', { class: 'ab-meta' }, el('span', { class: 'ab-c num', text: nItems + ' ting' }))])));
    }

    function abilityUp(u) {
      NG.sfx('level');
      NG.toast('Evne opp! ' + NG.abilityUpText(u), 4200);
    }

    function intentSheet() {
      const it = NG.Combat.intent(c);
      const rows = [el('p', { html: '<strong>' + NG.INTENT_TEXT[it].name + ':</strong> ' + NG.INTENT_TEXT[it].desc })];
      if (NG.hasRelic(s, 'lupe') || c.reveal) rows.push(el('p', { class: 'small muted', text: 'Deretter: ' + [1, 2].map((k) => NG.INTENT_TEXT[NG.Combat.intent(c, k)].name).join(' → ') }));
      else rows.push(el('p', { class: 'small muted', text: 'Grubletegning (eller Forskerlupa) lar deg se to trekk frem.' }));
      NG.sheet('Misforståelsens plan', el('div', { class: 'stack small' }, rows));
    }

    function showHint(free) {
      if (!c.q) return;
      if (!free) {
        if (c.hints <= 0) return;
        c.hints--;
        if (NG.hasRelic(s, 'mikroskop') && c.q.type === 'mc') { c.eliminate += 1; showQuestion(true); }
      }
      const body = el('div', { class: 'stack' }, (c.q.concepts || []).map((id) => {
        const cc = NG.conceptById(id);
        return cc ? el('div', { class: 'card stack-s' }, [el('strong', { text: cc.name }), el('div', { class: 'small', html: NG.md(cc.def) })]) : null;
      }));
      body.appendChild(el('p', { class: 'small muted', text: (free ? 'Partikkelblikket (nivå 5) viser begrepene spørsmålet bygger på. ' : 'Hintet viser begrepene spørsmålet bygger på — ikke svaret.') + (!free && NG.hasRelic(s, 'mikroskop') && c.q.type === 'mc' ? ' Mikroskopet fjernet også ett galt alternativ.' : '') }));
      NG.sheet('Hint', body);
      refresh();
    }

    function items() {
      const body = el('div', { class: 'stack-s' });
      const sh = NG.sheet('Sekken', body);
      for (const it of NG.combatItems()) {
        const id = it.id;
        if (!(s.items[id] > 0)) continue;
        body.appendChild(el('button', { class: 'option row', onclick: () => {
          const r = NG.Combat.useItem(s, c, id);
          NG.toast(r.msg);
          if (r.ok) { NG.sfx('heal'); NG.save(); }
          else NG.sfx('bad');
          sh.close(); refresh();
          if (r.reveal) {
            NG.sheet('Lakmuspapir', el('div', { class: 'stack' }, [
              el('div', { class: 'feedback ' + (r.reveal.right ? 'good' : 'bad') }, [el('div', { html: '«' + NG.md(r.reveal.text) + '» er <strong>' + (r.reveal.right ? (r.reveal.multi ? 'med i svaret' : 'riktig') : (r.reveal.multi ? 'ikke med i svaret' : 'galt')) + '</strong>.' })]),
              el('p', { class: 'small muted', html: NG.md(it.lore) }),
            ]));
          }
        } }, [NG.artEl(it.art, 'loot-art sm'), el('div', { class: 'grow stack-s' }, [el('strong', { text: it.name + ' ×' + s.items[id] }), el('span', { class: 'small muted', html: NG.md(it.desc) })])]));
      }
    }

    function say(text) {
      bubble.textContent = text || '';
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    }

    function showQuestion(keep) {
      if (!keep) {
        const q = NG.Combat.nextQuestion(s, c);
        if (!q) { qbox.innerHTML = ''; qbox.appendChild(el('div', { class: 'feedback', text: 'Ingen spørsmål i denne regionen ennå. Kampen er avlyst.' })); c.over = 'win'; settle(); endWin(); return; }
        if (s.run && s.run.usedQ.indexOf(q.id) < 0) s.run.usedQ.push(q.id);
        if (NG.Combat.intent(c) === 'mytekall' && q.myth) {
          const m = NG.content.store.myths.find((x) => x.id === q.myth);
          if (m) say('«' + m.text + '»');
        }
      }
      NG.renderQuestion(qbox, c.q, {
        rng: NG.makeRng(c.qSeed),
        eliminate: c.eliminate,
        onAnswer: onAnswer,
        onContinue: afterAnswer,
        continueLabel: 'Videre',
      });
    }

    function onAnswer(res) {
      busy = true;
      const rec = NG.recordAnswer(s, c.q, res);
      const out = NG.Combat.answer(s, c, res);
      s.counters.bestStreak = Math.max(s.counters.bestStreak, c.streak);
      if (c.over) settle(); // seier/nederlag lagres med en gang, før spilleren trykker «Videre»
      NG.save();
      // animasjon
      if (out.dealt) {
        NG.sfx(out.crit || out.finisher ? 'crit' : 'hit');
        enemyArt.classList.remove('shake'); void enemyArt.offsetWidth; enemyArt.classList.add('shake');
        NG.floatText(arena.querySelector('.en-stage'), '−' + out.dealt + (out.crit ? '!' : ''), out.crit || out.finisher ? 'crit' : 'dmg');
      }
      if (out.taken) {
        setTimeout(() => { NG.sfx('hit'); const fl = el('div', { class: 'hurt-flash' }); document.body.appendChild(fl); setTimeout(() => fl.remove(), 450); }, 250);
        say(NG.makeRng(c.turn + 3).pick(c.def.taunts || ['Ha!']));
        NG.floatText(hudSlot, '−' + out.taken + ' HP', 'hurt-t');
      } else if (out.blocked) say('…!');
      else if (res.correct) say(['Grr…', 'Hmpf.', 'Det … stemmer vel.', 'Argh!'][c.turn % 4]);
      out.notes.forEach((n, i) => n && setTimeout(() => NG.toast(n), 300 + i * 500));
      out.abilityUps.forEach((u, i) => setTimeout(() => abilityUp(u), 600 + i * 900));
      if (out.phase) setTimeout(() => { NG.sfx('boss'); NG.toast(out.phase, 3500); }, 600);
      NG.announce(rec);
      if (!settled) refresh();
      else { renderAbilities(); hudSlot.innerHTML = ''; hudSlot.appendChild(NG.hud(s, { noNav: true })); enemyHp.style.width = (100 * c.enemy.hp / c.enemy.maxHp) + '%'; enemyHpTxt.textContent = c.enemy.hp + '/' + c.enemy.maxHp; }
    }

    function afterAnswer() {
      busy = false;
      if (c.over === 'win') endWin();
      else if (c.over === 'lose') endLose();
      else { showQuestion(); refresh(); }
    }

    // Anvend utfallet på lagringen nøyaktig én gang (idempotent), straks kampen er avgjort.
    function settle() {
      if (settled) return settled;
      if (c.over === 'win') {
        const rw = NG.Combat.rewards(s, c);
        const ups = NG.gainXp(s, rw.xp);
        s.joule += rw.joule; if (s.run) s.run.joule += rw.joule;
        if (rw.energy) NG.addEnergy(s, rw.energy);
        s.hp = Math.min(NG.maxHp(s), s.hp + rw.heal);
        if (rw.item) s.items[rw.item] = (s.items[rw.item] || 0) + 1;
        if (rw.relic) NG.gainRelic(s, rw.relic);
        s.counters.wins++;
        const isBoss = c.tier === 'boss' && c.def.id === reg.boss;
        if (isBoss) { s.bossesBeaten[reg.id] = Date.now(); s.sheets[reg.id] = true; }
        let choices = [];
        if (s.run) {
          if (isBoss) NG.endRun(s, 'win');
          else {
            NG.completeNode(s);
            if (c.tier === 'elite' || c.tier === 'boss') {
              choices = NG.rollRelics(s, c.rng, 3, c.tier === 'boss' ? 'boss' : 'elite');
              if (choices.length) s.run.pendingRelics = choices.slice();
            }
          }
        }
        settled = { win: true, rw, ups, isBoss, choices };
      } else {
        const lost = s.run ? NG.endRun(s, 'death') : { lost: 0 };
        if (!lost.lost && s.hp <= 0) s.hp = Math.ceil(NG.maxHp(s) * 0.6);
        settled = { win: false, lost };
      }
      NG.save({ now: true });
      return settled;
    }

    function endWin() {
      const st = settle();
      const rw = st.rw;
      const isBoss = st.isBoss;
      NG.sfx(isBoss ? 'win' : 'coin');
      if (st.ups) NG.announce({ levelUps: st.ups });
      app.innerHTML = '';
      app.appendChild(NG.hud(s, { noNav: true }));
      const relicBox = st.choices.length ? relicChoice(st.choices) : null;
      app.appendChild(el('div', { class: 'stack victory' }, [
        el('div', { class: 'row' }, [NG.artEl(c.def.art || c.def.id, 'en-art small defeated'), el('div', { class: 'grow stack-s' }, [
          el('span', { class: 'label', text: isBoss ? 'Boss beseiret' : 'Seier' }),
          el('h1', { class: 'h-display', text: c.def.name + ' er oppløst' }),
        ])]),
        c.def.defeat ? el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Faglig poeng' }), el('div', { html: NG.md(c.def.defeat) })]) : null,
        el('div', { class: 'card rw-grid' }, [
          rwCell('+' + rw.xp, 'XP'), rwCell('+' + rw.joule, '◆ joule'), rwCell(c.correct + '/' + c.answered, 'riktige · beste rekke ×' + c.bestStreak), rwCell('+' + rw.heal, 'HP i pusterommet'),
        ]),
        relicBox,
        rw.relic ? lootRow(NG.item(rw.relic), 'Ny varig gjenstand!') : null,
        rw.item ? lootRow(NG.item(rw.item), 'Lagt i sekken') : null,
        rw.energy ? el('p', { class: 'small muted', text: 'Solcellepanelet ga +' + rw.energy + ' J.' }) : null,
        isBoss ? el('div', { class: 'feedback good stack-s' }, [el('strong', { text: 'Nøkkelarket «' + reg.sheet + '» er restaurert!' }), el('span', { class: 'small', text: 'Les det under Nøkkelarkene i leiren. Nye regioner kan ha åpnet seg.' })]) : null,
        el('button', { class: 'btn primary block', id: 'btn-after-win', text: isBoss ? 'Tilbake til leiren' : 'Videre', onclick: () => {
          if (s.run && s.run.pendingRelics) { delete s.run.pendingRelics; NG.save(); }
          if (isBoss) NG.go(Object.keys(s.bossesBeaten).length >= 8 ? 'finale' : 'sheets', { open: reg.id });
          else if (s.run) NG.nodeDone(); else NG.go('camp');
        } }),
      ]));
    }

    // «Velg én av tre» — ekspedisjonsrelikvier etter elite/boss
    function relicChoice(ids) {
      const box = el('div', { class: 'card stack-s relic-pick' }, [
        el('div', { class: 'row' }, [el('span', { class: 'label grow', text: 'Velg én av tre' }), el('span', { class: 'small muted', text: 'varer ut ekspedisjonen' })]),
      ]);
      const cards = ids.map((id) => {
        const d = NG.runRelic(id);
        const b = el('button', { class: 'relic-card r-' + d.rarity, 'data-relic': id, onclick: () => pick(id, b) }, [
          NG.artEl(d.art, 'loot-art sm'),
          el('div', { class: 'grow stack-s' }, [
            el('div', { class: 'row rc-head' }, [el('strong', { text: d.name }), el('span', { class: 'chip rar', text: NG.RARITY[d.rarity].name })]),
            el('span', { class: 'small', text: d.desc }),
            el('span', { class: 'small muted', html: NG.md(d.lore) }),
          ]),
        ]);
        return b;
      });
      const skip = el('button', { class: 'btn ghost small', text: 'Hopp over', onclick: () => { done(); NG.toast('Du lot relikviene ligge.'); } });
      function done() { cards.forEach((b) => { b.disabled = true; }); skip.remove(); if (s.run) { delete s.run.pendingRelics; NG.save(); } }
      function pick(id, b) {
        const d = NG.gainRelic(s, id);
        done();
        b.classList.add('picked');
        if (d) { NG.sfx('coin'); NG.toast(d.name + ' er med deg resten av ekspedisjonen.'); }
        NG.save();
      }
      cards.forEach((b) => box.appendChild(b));
      box.appendChild(el('div', { class: 'row' }, [el('span', { class: 'spacer' }), skip]));
      return box;
    }

    function endLose() {
      const st = settle();
      const lost = st.lost || { lost: 0 };
      NG.sfx('lose');
      app.innerHTML = '';
      app.appendChild(NG.hud(s, { noNav: true }));
      const missed = [...c.used].map((id) => NG.content.store.questions.find((q) => q.id === id)).filter((q) => q && s.srs[q.id] && s.srs[q.id].due < Date.now() + 3600e3 && s.srs[q.id].box <= 1);
      app.appendChild(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [NG.artEl(c.def.art || c.def.id, 'en-art small'), el('div', { class: 'grow stack-s' }, [
          el('span', { class: 'label', text: 'Nederlag' }),
          el('h1', { class: 'h-display', text: c.def.name + ' vant denne gangen' }),
        ])]),
        el('p', { text: 'Du våkner i leiren. Du beholder XP, evnenivåer og alle begrepskort — det du har lært, forsvinner ikke' + (lost.lost ? ', men du mistet ' + lost.lost + ' ◆ på veien.' : '.') + ' Ekspedisjonsrelikviene ble igjen.' }),
        missed.length ? el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Dette kommer tilbake som Gjenferd' }),
          ...missed.slice(0, 5).map((q) => el('div', { class: 'small', html: '• ' + NG.md(q.topic + ': ' + q.prompt.split('\n')[0].slice(0, 90)) }))]) : null,
        el('button', { class: 'btn primary block', text: 'Repeter det du bommet på', onclick: () => NG.go('review') }),
        el('button', { class: 'btn block', text: 'Til leiren', onclick: () => NG.go('camp') }),
      ]));
    }

    function rwCell(v, l) { return el('div', { class: 'rw' }, [el('strong', { class: 'num', text: v }), el('span', { class: 'small muted', text: l })]); }
    function lootRow(it, label) {
      return el('div', { class: 'card row' }, [NG.artEl(it.art, 'loot-art'), el('div', { class: 'grow stack-s' }, [
        el('span', { class: 'label', text: label }), el('strong', { text: it.name }), el('span', { class: 'small', html: NG.md(it.desc) }), el('span', { class: 'small muted', html: NG.md(it.lore) })])]);
    }

    // Start
    say(c.def.intro || '');
    if (c.tier === 'boss') NG.sfx('boss');
    showQuestion();
    refresh();
    if (!s.tips.combat) {
      s.tips.combat = 1; s.tips.abInfo = 1; NG.save();
      NG.sheet('Slik kjemper du', el('div', { class: 'stack small' }, [
        el('p', { html: '<strong>Svar riktig</strong> → du angriper. Rekker, vanskelige spørsmål og sterke begrepskort gir mer skade.' }),
        el('p', { html: '<strong>Svar feil</strong> → Misforståelsen slår, og du får forklaringen. Spørsmålet kommer tilbake senere som et <em>Gjenferd</em>.' }),
        el('p', { html: '<strong>Planen</strong> under fienden viser neste trekk. «Slag» og «Storslag» treffer litt selv om du svarer riktig. Trykk på planen for å lese mer.' }),
        el('p', { html: '<strong>Evner</strong> koster energi (J). Brukt energi blir <em>spillvarme</em> — den er ikke borte, men du kan ikke bruke den. Solgløtt fyller på.' }),
        el('p', { html: '<strong>Trykk på «i»</strong> (eller hold inne en evne) for å se hva den gjør. Evnene blir sterkere jo mer du bruker dem godt.' }),
      ]), [{ label: 'Kjør på!', primary: true }]);
    } else if (!s.tips.abInfo) {
      s.tips.abInfo = 1; NG.save();
      setTimeout(() => NG.toast('Nytt: trykk på «i» eller hold inne en evne for å se hva den gjør — evnene får nivåer når du bruker dem.', 4500), 700);
    }
    if (c.mods.length) setTimeout(() => NG.toast('Elite: ' + c.mods.map((m) => NG.ELITE_MODS[m].name).join(' + ') + ' — trykk på merket for detaljer.', 3200), 400);
  });
})();
