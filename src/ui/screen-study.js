/* Repetisjon, Begrepsveggen og Nøkkelarkene. */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  /* ---------- Repetisjon ---------- */
  NG.screen('review', (app, p) => {
    const s = NG.state();
    const count = p.count || 10;
    const rng = NG.makeRng(Date.now());
    let queue = NG.dueQuestions(s, p.region || null);
    if (queue.length < count) {
      // fyll på med svake/usette spørsmål
      const pool = NG.content.store.questions.filter((q) => (!p.region || q.region === p.region) && queue.indexOf(q) < 0);
      const scored = pool.map((q) => {
        const r = s.srs[q.id];
        let w = r ? (r.wrong - r.right * 0.6 + (6 - r.box)) : 2.5;
        for (const c of q.concepts) { const k = s.cards[c]; if (k && k.lvl > 0) w += 0.5; }
        return [w + rng.next(), q];
      }).sort((a, b) => b[0] - a[0]);
      queue = queue.concat(scored.slice(0, count - queue.length).map((x) => x[1]));
    }
    queue = queue.slice(0, count);
    let i = 0; let right = 0;
    const head = el('div', { class: 'row' });
    const prog = el('i', { style: { background: 'var(--good)' } });
    const box = el('div');
    app.append(NG.hud(s), el('div', { class: 'stack' }, [
      el('div', { class: 'row' }, [
        el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: p.region ? NG.region(p.region).name : 'Alle regioner' }), el('h1', { class: 'h-display', text: p.fromSol ? 'Repetisjon i solgløttet' : 'Repetisjon' })]),
        el('button', { class: 'btn ghost small', text: 'Avslutt', onclick: () => finish() }),
      ]),
      el('div', { class: 'bar' }, prog), head, box,
    ]));
    if (!queue.length) { box.appendChild(el('p', { text: 'Ingen spørsmål tilgjengelig ennå.' })); return; }
    next();
    function next() {
      if (i >= queue.length) return finish();
      prog.style.width = (100 * i / queue.length) + '%';
      head.innerHTML = '';
      head.appendChild(el('span', { class: 'small muted', text: (i + 1) + ' av ' + queue.length + ' · ' + NG.region(queue[i].region).name }));
      NG.renderQuestion(box, queue[i], {
        rng: NG.makeRng(rng.int(0, 1e9)),
        onAnswer: (res) => {
          const rec = NG.recordAnswer(s, queue[i], res);
          if (res.correct) right++;
          if (s.daily.date !== NG.today()) s.daily = { date: NG.today(), reviewed: 0, goalClaimed: false };
          s.daily.reviewed++;
          if (s.daily.reviewed >= 10 && !s.daily.goalClaimed) {
            s.daily.goalClaimed = true; NG.gainXp(s, 40); s.joule += 20;
            setTimeout(() => { NG.sfx('level'); NG.toast('Dagens mål nådd! +40 XP og +20 ◆', 3000); }, 600);
          }
          NG.save(); NG.announce(rec);
        },
        onContinue: () => { i++; next(); },
      });
    }
    function finish() {
      if (p.fromSol && right >= 2) {
        const hp = Math.min(NG.maxHp(s) - s.hp, 15); s.hp += hp; NG.gainXp(s, 20);
        NG.toast('Godt repetert: +' + hp + ' HP og +20 XP');
      }
      NG.save();
      if (p.fromSol && s.run) NG.nodeDone();
      else if (i > 0) {
        app.innerHTML = '';
        app.append(NG.hud(s), el('div', { class: 'stack' }, [
          el('h1', { class: 'h-display', text: 'Ferdig repetert' }),
          el('div', { class: 'card rw-grid' }, [cell(right + '/' + i, 'riktige'), cell(String(NG.dueQuestions(s).length), 'forfalt nå')]),
          el('p', { class: 'small muted', text: 'Spørsmål du svarte riktig på kommer tilbake om 1, 2, 4, 8 … dager. Feil kommer tilbake om ti minutter.' }),
          el('button', { class: 'btn primary block', text: 'Til leiren', onclick: () => NG.go('camp') }),
        ]));
      } else NG.go('camp');
    }
    function cell(v, l) { return el('div', { class: 'rw' }, [el('strong', { class: 'num', text: v }), el('span', { class: 'small muted', text: l })]); }
  });

  /* ---------- Begrepsveggen ---------- */
  NG.screen('wall', (app, p) => {
    const s = NG.state();
    let filter = p.region || 'alle';
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row' }, [
      el('h1', { class: 'h-display grow', text: 'Begrepsveggen' }),
      el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') }),
    ]));
    app.appendChild(el('p', { class: 'small muted', text: 'Hvert kort klatrer på begrepsstigen når du svarer riktig på spørsmål om det. Trykk på et kort for definisjon, eksempel og nettverk.' }));
    const tabs = el('div', { class: 'tabs', role: 'tablist' });
    const grid = el('div', { class: 'wall' });
    app.append(tabs, grid);
    const opts = [{ id: 'alle', name: 'Alle' }].concat(NG.REGIONS.map((r) => ({ id: r.id, name: r.name })));
    function draw() {
      tabs.innerHTML = '';
      for (const o of opts) tabs.appendChild(el('button', { class: 'tab' + (o.id === filter ? ' on' : ''), role: 'tab', 'aria-selected': String(o.id === filter), text: o.name, onclick: () => { filter = o.id; draw(); } }));
      grid.innerHTML = '';
      const cs = NG.content.store.concepts.filter((c) => filter === 'alle' || c.region === filter);
      const lv = (c) => (s.cards[c.id] || { lvl: 0 }).lvl;
      cs.sort((a, b) => lv(b) - lv(a) || a.name.localeCompare(b.name, 'nb'));
      const counts = [0, 0, 0, 0, 0, 0]; cs.forEach((c) => counts[lv(c)]++);
      grid.appendChild(el('div', { class: 'wall-sum small muted' }, NG.LADDER.map((n, i) => el('span', { text: n + ': ' + counts[i] }))));
      for (const c of cs) {
        const l = lv(c);
        const reg = NG.region(c.region);
        const k = s.cards[c.id];
        grid.appendChild(el('button', { class: 'wcard' + (l ? '' : ' unknown'), style: { '--rc': reg.color }, onclick: () => NG.showConcept(c.id) }, [
          el('span', { class: 'wc-name', text: l ? c.name : c.name }),
          el('span', { class: 'pips', text: '●'.repeat(l) + '○'.repeat(5 - l) }),
          el('span', { class: 'small muted', text: NG.LADDER[l] + (k && k.wrong > k.right ? ' · øv mer' : '') }),
        ]));
      }
    }
    draw();
  });

  /* ---------- Nøkkelarkene ---------- */
  NG.screen('sheets', (app, p) => {
    const s = NG.state();
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row' }, [
      el('h1', { class: 'h-display grow', text: 'Nøkkelarkene' }),
      el('button', { class: 'btn ghost small', text: 'Leiren', onclick: () => NG.go('camp') }),
    ]));
    app.appendChild(el('p', { class: 'small muted', text: 'Slå bossen i en region for å restaurere arket. Arkene oppsummerer de store ideene — les dem før eksamen.' }));
    const list = el('div', { class: 'stack' });
    for (const r of NG.REGIONS) {
      const sh = NG.SHEETS && NG.SHEETS[r.id];
      const open = !!s.sheets[r.id];
      const card = el('details', { class: 'card sheetcard' + (open ? '' : ' torn'), style: { '--rc': r.color }, open: p.open === r.id || null }, [
        el('summary', { class: 'row' }, [NG.artEl('icon-' + r.id, 'sc-icon'), el('span', { class: 'grow h-display sc-t', text: r.sheet }), el('span', { class: 'chip', text: open ? 'Restaurert' : 'Revet' })]),
      ]);
      if (open && sh) {
        card.appendChild(el('div', { class: 'stack-s sc-body' }, [
          sh.questions ? el('div', { class: 'sc-q' }, sh.questions.map((q) => el('div', { class: 'h-display', text: q }))) : null,
          el('div', { html: NG.md(sh.text) }),
          sh.laws ? el('div', { class: 'small', html: '<span class="label">Lover, modeller og teorier</span><br>' + NG.md(sh.laws) }) : null,
          el('span', { class: 'label', text: 'Nøkkelbegreper' }),
          el('div', { class: 'row' }, NG.content.store.concepts.filter((c) => c.region === r.id && c.key).map((c) => NG.conceptChip(c.id))),
        ]));
      } else if (!open) {
        card.appendChild(el('p', { class: 'small muted sc-body', text: 'Arket er revet i filler. Bossen ' + ((NG.content.store.enemies.find((e) => e.id === r.boss) || {}).name || '') + ' holder bitene.' }));
      }
      list.appendChild(card);
    }
    app.appendChild(list);
  });
})();
