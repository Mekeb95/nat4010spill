/* Tittel, intro og leiren (kartet). */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  NG.screen('title', (app) => {
    const s = NG.state();
    const has = s && (s.counters.answered > 0 || s.introSeen);
    app.appendChild(el('div', { class: 'title-wrap stack' }, [
      el('div', { class: 'title-eyebrow label', text: 'NAT4010 · Naturfag 1 · Energi, stoffer og praksiser' }),
      el('h1', { class: 'h-display title-h', html: 'Nøkkel&shy;vokteren' }),
      el('p', { class: 'title-sub', text: 'Misforståelsene har revet nøkkelarkene i filler. Bekjemp dem med påstand, evidens og begrunnelse.' }),
      NG.artEl('laerling', 'title-hero'),
      el('div', { class: 'stack' }, [
        has ? el('button', { class: 'btn primary block', id: 'btn-continue', text: 'Fortsett — nivå ' + s.level, onclick: () => { NG.sfx('click'); NG.go('camp'); } }) : null,
        el('button', { class: 'btn block ' + (has ? '' : 'primary'), id: 'btn-new', text: has ? 'Start ny reise' : 'Start reisen', onclick: () => {
          if (has) {
            NG.sheet('Starte på nytt?', el('p', { text: 'All fremgang (nivå, begrepskort, repetisjon) slettes. Dette kan ikke angres.' }), [
              { label: 'Avbryt' },
              { label: 'Slett og start', primary: true, onclick: () => { NG.resetSave(); NG.go('intro'); } },
            ]);
          } else { NG.sfx('click'); NG.go('intro'); }
        } }),
      ]),
      el('p', { class: 'small muted title-foot', text: 'Spillet lagrer automatisk. Lyd kan slås av i innstillingene.' }),
    ]));
  });

  const INTRO = [
    { art: 'icon-didaktikk', h: 'Nøkkelarkene', t: 'Naturfaget hviler på seks nøkkelark — Energi, Stoffer, Livet på jorda, Jorda og universet, Kropp og helse og Teknologi. Hvert ark samler de store ideene, nøkkelbegrepene og spørsmålene som driver faget.' },
    { art: '_fallback', h: 'Misforståelsene', t: 'Men i natt har Misforståelsene sluppet løs. De lever av hverdagsforestillinger: «Kulda kryper inn». «Energien er brukt opp». «Planter puster ikke». For hver elev som tror på dem, blir de sterkere.' },
    { art: 'laerling', h: 'Du er Lærlingen', t: 'En lærerstudent med en krittbit og en notatbok. Du vinner ikke med sverd, men med argumenter: påstand → evidens → begrunnelse. Svarer du riktig, slår du. Svarer du feil, slår de — men du lærer alltid hvorfor.' },
    { art: 'item-begrepskort', h: 'Begrepsstigen', t: 'Hvert begrep du møter blir et kort. Kortene klatrer på stigen fra pensum: Gjenkjenne → Definere → Nettverk → Anvende → Overføre. Jo høyere, jo sterkere slår du.' },
    { art: 'icon-energi', h: 'Energiregnskapet', t: 'Evnene dine koster energi (J). Brukt energi forsvinner ikke — den blir spillvarme. Summen er bevart, men kvaliteten synker. Bare sola (Solgløtt) fyller deg opp igjen. Kjenner du igjen noe?' },
  ];
  NG.screen('intro', (app, p) => {
    const i = p.i || 0;
    const d = INTRO[i];
    app.appendChild(el('div', { class: 'intro stack' }, [
      el('div', { class: 'label', text: (i + 1) + ' / ' + INTRO.length }),
      NG.artEl(d.art, 'intro-art'),
      el('h2', { class: 'h-display', text: d.h }),
      el('p', { class: 'intro-t', text: d.t }),
      el('div', { class: 'row' }, [
        el('button', { class: 'btn ghost', text: 'Hopp over', onclick: () => finish() }),
        el('span', { class: 'spacer' }),
        el('button', { class: 'btn primary', id: 'btn-next', text: i < INTRO.length - 1 ? 'Neste' : 'Til leiren', onclick: () => { NG.sfx('click'); i < INTRO.length - 1 ? NG.go('intro', { i: i + 1 }) : finish(); } }),
      ]),
    ]));
    function finish() { const s = NG.state(); s.introSeen = true; NG.save(); NG.go('camp'); }
  });

  const LINKS = [['energi', 'liv'], ['energi', 'praksis'], ['stoffer', 'praksis'], ['stoffer', 'teknologi'], ['liv', 'kropp'], ['praksis', 'jorda'], ['teknologi', 'jorda'], ['kropp', 'didaktikk'], ['jorda', 'didaktikk'], ['liv', 'praksis']];

  NG.screen('camp', (app) => {
    const s = NG.state();
    app.appendChild(NG.hud(s));
    const beaten = Object.keys(s.bossesBeaten).length;

    if (s.run) {
      const r = NG.region(s.run.region);
      app.appendChild(el('button', { class: 'card run-banner', style: { '--rc': r.color }, onclick: () => NG.go('path') }, [
        el('span', { class: 'label', text: 'Ekspedisjon pågår' }),
        el('strong', { text: r.name + ' — fortsett' }),
      ]));
    }

    // Kartet
    const map = el('div', { class: 'map', role: 'group', 'aria-label': 'Kart over regionene' });
    const svgLines = LINKS.map(([a, b]) => {
      const A = NG.region(a); const B = NG.region(b);
      const open = NG.isUnlocked(s, A) && NG.isUnlocked(s, B);
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="${open ? 'open' : ''}"/>`;
    }).join('');
    map.appendChild(el('div', { class: 'map-lines', html: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${svgLines}</svg>` }));
    for (const r of NG.REGIONS) {
      const open = NG.isUnlocked(s, r);
      const done = !!s.bossesBeaten[r.id];
      const m = NG.regionMastery(s, r.id);
      const node = el('button', {
        class: 'map-node' + (open ? '' : ' locked') + (done ? ' done' : '') + (s.run && s.run.region === r.id ? ' active' : ''),
        style: { left: r.x + '%', top: r.y + '%', '--rc': r.color }, 'aria-label': r.name + (open ? '' : ' (låst)'),
        onclick: () => { NG.sfx('click'); regionSheet(r); },
      }, [
        el('span', { class: 'map-ring', style: { '--p': Math.round(m.pct * 100) } }, NG.artEl('icon-' + r.id, 'map-icon')),
        el('span', { class: 'map-name', text: r.name }),
      ]);
      map.appendChild(node);
    }
    app.appendChild(el('section', { class: 'stack-s' }, [
      el('div', { class: 'row' }, [el('h1', { class: 'h-display grow', text: 'Leiren' }), el('span', { class: 'chip', text: beaten + ' / 8 nøkkelark' })]),
      map,
    ]));

    // Handlinger
    const due = NG.dueQuestions(s).length;
    const known = Object.values(s.cards).filter((c) => c.lvl > 0).length;
    const tiles = [
      { id: 'repetisjon', label: 'Repetisjon', sub: due ? due + ' venter' : 'Ingenting forfalt', art: 'node-sol', badge: due || null, go: () => NG.go('review') },
      { id: 'begrep', label: 'Begrepsveggen', sub: known + ' / ' + NG.content.store.concepts.length + ' kort', art: 'item-begrepskort', go: () => NG.go('wall') },
      { id: 'eksamen', label: 'Eksamenstrening', sub: 'Øv mot deleksamenene', art: 'item-notatbok', go: () => NG.go('exams') },
      { id: 'orakel', label: 'Orakelet', sub: 'Forklar med egne ord', art: 'item-lupe', go: () => NG.go('oracle') },
      { id: 'lager', label: 'Materiallageret', sub: s.joule + ' ◆ å handle for', art: 'item-solcelle', go: () => NG.go('shop') },
      { id: 'lab', label: 'Laben', sub: 'Øv på mini-spill', art: 'node-lab', go: () => NG.go('labs') },
      { id: 'sekk', label: 'Ryggsekken', sub: s.statPoints ? s.statPoints + ' poeng å fordele' : 'Egenskaper og ting', art: 'item-kalorimeter', badge: s.statPoints || null, go: () => NG.go('sekk', { back: { name: 'camp' } }) },
      { id: 'ark', label: 'Nøkkelarkene', sub: beaten + ' restaurert', art: 'icon-didaktikk', go: () => NG.go('sheets') },
    ];
    app.appendChild(el('section', { class: 'tiles' }, tiles.map((t) => el('button', { class: 'tile', id: 'tile-' + t.id, onclick: () => { NG.sfx('click'); t.go(); } }, [
      NG.artEl(t.art, 'tile-art'),
      el('span', { class: 'tile-l', text: t.label }),
      el('span', { class: 'tile-s small muted', text: t.sub }),
      t.badge ? el('span', { class: 'tile-badge num', text: String(t.badge) }) : null,
    ]))));

    // Dagens mål
    if (s.daily.date !== NG.today()) { s.daily = { date: NG.today(), reviewed: 0, goalClaimed: false }; NG.save(); }
    app.appendChild(el('div', { class: 'card daily row' }, [
      el('div', { class: 'grow stack-s' }, [
        el('span', { class: 'label', text: 'Dagens repetisjon' }),
        el('div', { class: 'bar' }, el('i', { style: { width: Math.min(100, s.daily.reviewed * 10) + '%', background: 'var(--good)' } })),
      ]),
      el('span', { class: 'num', text: Math.min(10, s.daily.reviewed) + '/10' }),
    ]));
    app.appendChild(el('div', { class: 'row camp-foot' }, [
      el('button', { class: 'btn ghost small', text: 'Innstillinger', onclick: () => NG.go('settings') }),
      el('span', { class: 'spacer' }),
      el('span', { class: 'small muted', text: NG.cloud ? 'Lagret i skyen' : 'Lagret på enheten' }),
    ]));

    if (NG.saveWasCorrupt) { NG.saveWasCorrupt = false; setTimeout(() => NG.toast('Den lagrede fremgangen kunne ikke leses. En kopi er tatt vare på (ng.save.v1.bak).', 5000), 300); }
    if (!s.tips.camp) { s.tips.camp = 1; NG.save(); setTimeout(() => NG.toast('Trykk på Energidalen eller Stoffgruvene for å starte.', 3500), 400); }
  });

  function regionSheet(r) {
    const s = NG.state();
    const open = NG.isUnlocked(s, r);
    const m = NG.regionMastery(s, r.id);
    const qn = NG.content.store.questions.filter((q) => q.region === r.id).length;
    const labs = NG.minigames.forRegion(r.id);
    const boss = NG.content.store.enemies.find((e) => e.id === r.boss);
    let lockText = '';
    if (!open) {
      if (r.needBosses) lockText = 'Slå ' + r.needBosses + ' bosser for å åpne Akademiet (' + Object.keys(s.bossesBeaten).length + ' så langt).';
      else lockText = 'Slå bossen i ' + r.unlock.map((u) => NG.region(u).name).join(r.unlockAny ? ' eller ' : ' og ') + ' først.';
    }
    const body = el('div', { class: 'stack', style: { '--rc': r.color } }, [
      el('div', { class: 'row' }, [NG.artEl('icon-' + r.id, 'rs-icon'), el('div', { class: 'grow stack-s' }, [
        el('span', { class: 'label', text: 'Nøkkelark: ' + r.sheet }),
        el('p', { class: 'rs-blurb', text: r.blurb }),
      ])]),
      el('div', { class: 'stack-s' }, [
        el('div', { class: 'row small' }, [el('span', { class: 'grow', text: 'Begrepsmestring' }), el('span', { class: 'num', text: m.known + '/' + m.total + ' kort · ' + Math.round(m.pct * 100) + ' %' })]),
        el('div', { class: 'bar' }, el('i', { style: { width: (m.pct * 100) + '%', background: 'var(--rc)' } })),
      ]),
      el('div', { class: 'row small muted' }, [
        el('span', { text: qn + ' spørsmål' }), el('span', { text: '·' }), el('span', { text: labs.length + ' mini-spill' }), el('span', { text: '·' }),
        el('span', { text: s.bossesBeaten[r.id] ? 'Boss slått ✓' : 'Boss: ' + (boss ? boss.name : '?') }),
      ]),
      lockText ? el('div', { class: 'feedback', text: lockText }) : null,
      s.run && s.run.region !== r.id && open ? el('div', { class: 'small muted', text: 'Du har en ekspedisjon i ' + NG.region(s.run.region).name + '. Starter du her, avbrytes den (du beholder XP og kort).' }) : null,
    ]);
    const actions = [];
    if (open) {
      if (s.run && s.run.region === r.id) actions.push({ label: 'Fortsett ekspedisjonen', primary: true, onclick: () => NG.go('path') });
      else actions.push({ label: 'Dra på ekspedisjon', primary: true, onclick: () => {
        if (s.run) NG.endRun(s, 'abandon'); // ingen gratis helbredelse: du starter med den HP-en du har
        NG.startRun(s, r.id); NG.save(); NG.sfx('boss'); NG.go('path');
      } });
      actions.push({ label: 'Øv på begrepene', onclick: () => NG.go('review', { region: r.id }) });
    }
    NG.sheet(r.name, body, actions);
  }
  NG.regionSheet = regionSheet;
})();
