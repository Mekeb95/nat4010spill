/* Kampskjermen. */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  NG.screen('combat', (app, p) => {
    const s = NG.state();
    const rng = NG.makeRng((s.run ? s.run.seed : Date.now()) + (s.counters.answered * 31) + 17);
    const used = new Set(s.run ? s.run.usedQ : []);
    const c = NG.Combat.create(s, p.enemy, { rng, region: s.run ? s.run.region : null, used });
    if (!c.region) c.region = c.def.region;
    const reg = NG.region(c.region);
    app.style.setProperty('--rc', reg.color);
    s.counters.fights++;
    let busy = false;

    const hudSlot = el('div');
    const enemyArt = NG.artEl(c.def.art || c.def.id, 'en-art tier-' + c.tier);
    const enemyHp = el('i', { style: { background: 'var(--bad)' } });
    const enemyHpTxt = el('span', { class: 'num small' });
    const intentPill = el('span', { class: 'intent' });
    const bubble = el('div', { class: 'bubble' });
    const status = el('div', { class: 'row cb-status' });
    const abil = el('div', { class: 'abilities' });
    const qbox = el('div', { class: 'qbox' });
    const arena = el('section', { class: 'arena' }, [
      el('div', { class: 'en-top row' }, [
        el('div', { class: 'grow stack-s' }, [
          el('div', { class: 'row' }, [el('strong', { class: 'en-name', text: c.def.name }), el('span', { class: 'chip', text: { normal: 'Misforståelse', elite: 'Elite', boss: 'BOSS' }[c.tier] || '' })]),
          el('div', { class: 'row' }, [el('div', { class: 'bar grow' }, enemyHp), enemyHpTxt]),
        ]),
      ]),
      el('div', { class: 'en-stage' }, [enemyArt, bubble, intentPill]),
    ]);
    app.append(hudSlot, arena, status, abil, qbox);

    function refresh() {
      hudSlot.innerHTML = ''; hudSlot.appendChild(NG.hud(s, { noNav: true }));
      enemyHp.style.width = (100 * c.enemy.hp / c.enemy.maxHp) + '%';
      enemyHpTxt.textContent = c.enemy.hp + '/' + c.enemy.maxHp;
      const it = NG.Combat.intent(c);
      const info = NG.INTENT_TEXT[it];
      intentPill.className = 'intent i-' + it;
      intentPill.innerHTML = '';
      intentPill.append(el('strong', { text: info.name }), el('span', { class: 'small', text: ' · ' + info.desc }));
      if (NG.hasRelic(s, 'lupe')) {
        const seq = [1, 2].map((k) => { const cc = Object.assign({}, c, { turn: c.turn + k }); return NG.INTENT_TEXT[NG.Combat.intent(cc)].name; });
        intentPill.append(el('span', { class: 'small muted', text: ' → ' + seq.join(' → ') }));
      }
      status.innerHTML = '';
      if (c.streak >= 2) status.appendChild(el('span', { class: 'chip st-streak', text: 'Rekke ×' + c.streak }));
      if (c.shield) status.appendChild(el('span', { class: 'chip st-shield', text: 'Skjold' }));
      if (c.peb) status.appendChild(el('span', { class: 'chip st-peb', text: 'PEB ' + ['Påstand', 'Evidens', 'Begrunnelse'][c.peb - 1] + '…' }));
      if (c.double) status.appendChild(el('span', { class: 'chip', text: 'Dobbel skade' }));
      if (c.wrongBlocked) status.appendChild(el('span', { class: 'chip', text: 'Vernebriller' }));
      if (c.ghost) status.appendChild(el('span', { class: 'chip st-ghost', text: 'Gjenferd fra ' + NG.region(c.q.region).name }));
      renderAbilities();
    }

    function renderAbilities() {
      abil.innerHTML = '';
      const locked = busy || !c.q || c.over;
      for (const ab of NG.ABILITIES) {
        if (ab.needs && !NG.hasRelic(s, ab.needs)) continue;
        const cost = NG.abilityCost(s, ab);
        abil.appendChild(el('button', { class: 'ab', disabled: locked || s.energy < cost || null, title: ab.desc, onclick: () => {
          const r = NG.Combat.useAbility(s, c, ab.id);
          NG.toast(r.msg);
          if (r.ok) { NG.sfx('click'); NG.save(); if (ab.id === 'blikk') showQuestion(true); refresh(); }
          else NG.sfx('bad');
        } }, [el('span', { class: 'ab-n', text: ab.name }), el('span', { class: 'ab-c num', text: cost + ' J' })]));
      }
      abil.appendChild(el('button', { class: 'ab', disabled: locked || c.hints <= 0 || null, title: 'Vis begrepskortene spørsmålet handler om', onclick: hint },
        [el('span', { class: 'ab-n', text: 'Hint' }), el('span', { class: 'ab-c num', text: c.hints + ' igjen' })]));
      const nItems = ['matpakke', 'kakao', 'repetisjonskort'].reduce((a, k) => a + (s.items[k] || 0), 0);
      abil.appendChild(el('button', { class: 'ab', disabled: locked || !nItems || null, onclick: items },
        [el('span', { class: 'ab-n', text: 'Sekk' }), el('span', { class: 'ab-c num', text: nItems + ' ting' })]));
    }

    function hint() {
      if (c.hints <= 0 || !c.q) return;
      c.hints--;
      const body = el('div', { class: 'stack' }, (c.q.concepts || []).map((id) => {
        const cc = NG.conceptById(id);
        return cc ? el('div', { class: 'card stack-s' }, [el('strong', { text: cc.name }), el('div', { class: 'small', html: NG.md(cc.def) })]) : null;
      }));
      body.appendChild(el('p', { class: 'small muted', text: 'Hintet viser begrepene spørsmålet bygger på — ikke svaret.' }));
      NG.sheet('Hint', body);
      refresh();
    }

    function items() {
      const body = el('div', { class: 'stack-s' });
      const sh = NG.sheet('Sekken', body);
      for (const id of ['matpakke', 'kakao', 'repetisjonskort']) {
        if (!(s.items[id] > 0)) continue;
        const it = NG.item(id);
        body.appendChild(el('button', { class: 'option row', onclick: () => {
          const r = NG.Combat.useItem(s, c, id);
          NG.toast(r.msg); if (r.ok) { NG.sfx('heal'); NG.save(); }
          sh.close(); refresh();
        } }, [NG.artEl(it.art, 'loot-art sm'), el('div', { class: 'grow stack-s' }, [el('strong', { text: it.name + ' ×' + s.items[id] }), el('span', { class: 'small muted', text: it.desc })])]));
      }
    }

    function say(text) {
      bubble.textContent = text || '';
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    }

    function showQuestion(keep) {
      if (!keep) {
        const q = NG.Combat.nextQuestion(s, c);
        if (!q) { qbox.innerHTML = ''; qbox.appendChild(el('div', { class: 'feedback', text: 'Ingen spørsmål i denne regionen ennå. Kampen er avlyst.' })); endWin(); return; }
        if (s.run && s.run.usedQ.indexOf(q.id) < 0) s.run.usedQ.push(q.id);
      }
      NG.renderQuestion(qbox, c.q, {
        rng: NG.makeRng(rng.int(0, 1e9)),
        eliminate: c.eliminate,
        onAnswer: onAnswer,
        onContinue: afterAnswer,
        continueLabel: 'Videre',
      });
    }

    let lastOut = null;
    function onAnswer(res) {
      busy = true;
      const rec = NG.recordAnswer(s, c.q, res);
      const out = NG.Combat.answer(s, c, res);
      lastOut = out;
      s.counters.bestStreak = Math.max(s.counters.bestStreak, c.streak);
      NG.save();
      // animasjon
      if (out.dealt) {
        NG.sfx(out.crit || out.finisher ? 'crit' : 'hit');
        enemyArt.classList.remove('shake'); void enemyArt.offsetWidth; enemyArt.classList.add('shake');
        NG.floatText(arena.querySelector('.en-stage'), '−' + out.dealt + (out.crit ? '!' : ''), out.crit || out.finisher ? 'crit' : 'dmg');
      }
      if (out.taken) {
        setTimeout(() => { NG.sfx('hit'); document.body.classList.add('hurt'); setTimeout(() => document.body.classList.remove('hurt'), 350); }, 250);
        say(NG.makeRng(c.turn + 3).pick(c.def.taunts || ['Ha!']));
        NG.floatText(hudSlot, '−' + out.taken + ' HP', 'hurt-t');
      } else if (out.blocked) say('…!');
      else if (res.correct) say(['Grr…', 'Hmpf.', 'Det … stemmer vel.', 'Argh!'][c.turn % 4]);
      out.notes.forEach((n, i) => n && setTimeout(() => NG.toast(n), 300 + i * 500));
      if (out.phase) setTimeout(() => { NG.sfx('boss'); NG.toast(out.phase, 3500); }, 600);
      NG.announce(rec);
      refresh();
    }

    function afterAnswer() {
      busy = false;
      if (c.over === 'win') endWin();
      else if (c.over === 'lose') endLose();
      else { showQuestion(); refresh(); }
    }

    function endWin() {
      const rw = NG.Combat.rewards(s, c);
      const ups = NG.gainXp(s, rw.xp);
      s.joule += rw.joule; if (s.run) s.run.joule += rw.joule;
      if (rw.energy) s.energy += rw.energy;
      if (rw.item) s.items[rw.item] = (s.items[rw.item] || 0) + 1;
      if (rw.relic && !NG.hasRelic(s, rw.relic)) s.relics.push(rw.relic);
      s.counters.wins++;
      const isBoss = c.tier === 'boss' && c.def.id === reg.boss;
      if (isBoss) { s.bossesBeaten[reg.id] = Date.now(); s.sheets[reg.id] = true; }
      NG.save();
      NG.sfx(isBoss ? 'win' : 'coin');
      if (ups) NG.announce({ levelUps: ups });
      app.innerHTML = '';
      app.appendChild(NG.hud(s));
      const acc = c.answered ? Math.round(100 * c.correct / c.answered) : 100;
      app.appendChild(el('div', { class: 'stack victory' }, [
        el('div', { class: 'row' }, [NG.artEl(c.def.art || c.def.id, 'en-art small defeated'), el('div', { class: 'grow stack-s' }, [
          el('span', { class: 'label', text: isBoss ? 'Boss beseiret' : 'Seier' }),
          el('h1', { class: 'h-display', text: c.def.name + ' er oppløst' }),
        ])]),
        c.def.defeat ? el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Faglig poeng' }), el('div', { html: NG.md(c.def.defeat) })]) : null,
        el('div', { class: 'card rw-grid' }, [
          rwCell('+' + rw.xp, 'XP'), rwCell('+' + rw.joule, '◆ joule'), rwCell(c.correct + '/' + c.answered, 'riktige (' + acc + ' %)'), rwCell('×' + c.bestStreak, 'beste rekke'),
        ]),
        rw.relic ? lootRow(NG.item(rw.relic), 'Ny varig gjenstand!') : null,
        rw.item ? lootRow(NG.item(rw.item), 'Lagt i sekken') : null,
        rw.energy ? el('p', { class: 'small muted', text: 'Solcellepanelet ga +' + rw.energy + ' J.' }) : null,
        isBoss ? el('div', { class: 'feedback good stack-s' }, [el('strong', { text: 'Nøkkelarket «' + reg.sheet + '» er restaurert!' }), el('span', { class: 'small', text: 'Les det under Nøkkelarkene i leiren. Nye regioner kan ha åpnet seg.' })]) : null,
        el('button', { class: 'btn primary block', id: 'btn-after-win', text: isBoss ? 'Tilbake til leiren' : 'Videre', onclick: () => {
          if (isBoss) { NG.endRun(s, 'win'); NG.save(); NG.go(Object.keys(s.bossesBeaten).length >= 8 ? 'finale' : 'sheets', { open: reg.id }); }
          else if (s.run) NG.nodeDone(); else NG.go('camp');
        } }),
      ]));
    }

    function endLose() {
      const lost = s.run ? NG.endRun(s, 'death') : { lost: 0 };
      if (!s.run && !lost.lost) s.hp = Math.ceil(NG.maxHp(s) * 0.6);
      NG.save();
      NG.sfx('lose');
      app.innerHTML = '';
      app.appendChild(NG.hud(s));
      const missed = [...c.used].map((id) => NG.content.store.questions.find((q) => q.id === id)).filter((q) => q && s.srs[q.id] && s.srs[q.id].due < Date.now() + 3600e3 && s.srs[q.id].box <= 1);
      app.appendChild(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [NG.artEl(c.def.art || c.def.id, 'en-art small'), el('div', { class: 'grow stack-s' }, [
          el('span', { class: 'label', text: 'Nederlag' }),
          el('h1', { class: 'h-display', text: c.def.name + ' vant denne gangen' }),
        ])]),
        el('p', { text: 'Du våkner i leiren. Du beholder XP og alle begrepskort — det du har lært, forsvinner ikke' + (lost.lost ? ', men du mistet ' + lost.lost + ' ◆ på veien.' : '.') }),
        missed.length ? el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Dette kommer tilbake som Gjenferd' }),
          ...missed.slice(0, 5).map((q) => el('div', { class: 'small', html: '• ' + NG.md(q.topic + ': ' + q.prompt.split('\n')[0].slice(0, 90)) }))]) : null,
        el('button', { class: 'btn primary block', text: 'Repeter det du bommet på', onclick: () => NG.go('review') }),
        el('button', { class: 'btn block', text: 'Til leiren', onclick: () => NG.go('camp') }),
      ]));
    }

    function rwCell(v, l) { return el('div', { class: 'rw' }, [el('strong', { class: 'num', text: v }), el('span', { class: 'small muted', text: l })]); }
    function lootRow(it, label) {
      return el('div', { class: 'card row' }, [NG.artEl(it.art, 'loot-art'), el('div', { class: 'grow stack-s' }, [
        el('span', { class: 'label', text: label }), el('strong', { text: it.name }), el('span', { class: 'small', text: it.desc }), el('span', { class: 'small muted', html: NG.md(it.lore) })])]);
    }

    // Start
    say(c.def.intro || '');
    if (c.tier === 'boss') NG.sfx('boss');
    showQuestion();
    refresh();
    if (!s.tips.combat) {
      s.tips.combat = 1; NG.save();
      NG.sheet('Slik kjemper du', el('div', { class: 'stack small' }, [
        el('p', { html: '<strong>Svar riktig</strong> → du angriper. Rekker, vanskelige spørsmål og sterke begrepskort gir mer skade.' }),
        el('p', { html: '<strong>Svar feil</strong> → Misforståelsen slår, og du får forklaringen. Spørsmålet kommer tilbake senere som et <em>Gjenferd</em>.' }),
        el('p', { html: '<strong>Planen</strong> under fienden viser neste trekk. «Slag» og «Storslag» treffer litt selv om du svarer riktig.' }),
        el('p', { html: '<strong>Evner</strong> koster energi (J). Brukt energi blir <em>spillvarme</em> — den er ikke borte, men du kan ikke bruke den. Solgløtt fyller på.' }),
      ]), [{ label: 'Kjør på!', primary: true }]);
    }
  });
})();
