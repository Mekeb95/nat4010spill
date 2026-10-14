/* Ruter, HUD og felles UI-byggesteiner. Hver skjerm registreres med NG.screen(navn, render). */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);
  const screens = {};
  let current = null;
  let cleanup = null;

  NG.screen = function (name, render) { screens[name] = render; };

  NG.go = function (name, params) {
    if (cleanup) { try { cleanup(); } catch (e) { /* */ } cleanup = null; }
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'scr-' + name;
    current = { name, params: params || {} };
    const r = screens[name];
    if (!r) { app.textContent = 'Ukjent skjerm: ' + name; return; }
    const ret = r(app, params || {});
    if (typeof ret === 'function') cleanup = ret;
    try { window.scrollTo(0, 0); } catch (e) { /* */ }
  };
  NG.current = () => current;

  /* ---------- Grafikk ---------- */
  NG.artEl = function (id, cls) {
    return el('div', { class: 'art ' + (cls || ''), html: NG.art.get(id), 'aria-hidden': 'true' });
  };

  /* ---------- HUD ---------- */
  NG.hud = function (s, opts) {
    opts = opts || {};
    const maxHp = NG.maxHp(s);
    const total = s.energy + s.heat;
    const bar = el('header', { class: 'hud' }, [
      el('button', { class: 'hud-who', 'aria-label': 'Ryggsekk og egenskaper', onclick: () => opts.noNav ? null : NG.go('sekk', { back: current }) }, [
        NG.artEl('laerling', 'hud-ava'),
        el('div', { class: 'hud-lvl' }, [el('span', { class: 'label', text: 'Nivå' }), el('strong', { class: 'num', text: String(s.level) })]),
      ]),
      el('div', { class: 'hud-bars' }, [
        el('div', { class: 'hud-row' }, [
          el('span', { class: 'hud-k', text: 'HP' }),
          el('div', { class: 'bar grow' }, el('i', { style: { width: (100 * s.hp / maxHp) + '%', background: 'var(--hp)' } })),
          el('span', { class: 'num hud-v', text: s.hp + '/' + maxHp }),
        ]),
        el('div', { class: 'hud-row', title: 'Energiregnskap: energi + spillvarme er bevart' }, [
          el('span', { class: 'hud-k', text: 'J' }),
          el('div', { class: 'bar grow ebar' }, [
            el('i', { style: { width: (total ? 100 * s.energy / Math.max(total, NG.maxEnergy(s)) : 0) + '%', background: 'var(--energy)' } }),
            el('i', { class: 'heat', style: { left: (total ? 100 * s.energy / Math.max(total, NG.maxEnergy(s)) : 0) + '%', width: (total ? 100 * s.heat / Math.max(total, NG.maxEnergy(s)) : 0) + '%' } }),
          ]),
          el('span', { class: 'num hud-v', text: s.energy + (s.heat ? '+' + s.heat : '') }),
        ]),
        el('div', { class: 'hud-row' }, [
          el('span', { class: 'hud-k', text: 'XP' }),
          el('div', { class: 'bar grow thin' }, el('i', { style: { width: (100 * s.xp / NG.xpNeed(s.level)) + '%', background: 'var(--xp)' } })),
          el('span', { class: 'num hud-v gold', text: s.joule + ' ◆' }),
        ]),
      ]),
    ]);
    if (s.statPoints > 0 && !opts.noNav) bar.querySelector('.hud-who').appendChild(el('span', { class: 'hud-dot', text: '+' + s.statPoints }));
    return bar;
  };

  /* ---------- Modal-ark (bunnark på mobil) ---------- */
  NG.sheet = function (title, content, actions) {
    const back = el('div', { class: 'sheet-back', onclick: (e) => { if (e.target === back) close(); } });
    const box = el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    function close() { back.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    box.appendChild(el('div', { class: 'row sheet-head' }, [
      el('h2', { class: 'h-display grow', text: title }),
      el('button', { class: 'btn ghost small', 'aria-label': 'Lukk', text: '✕', onclick: close }),
    ]));
    const body = el('div', { class: 'sheet-body stack' });
    if (content) body.appendChild(content);
    box.appendChild(body);
    if (actions && actions.length) {
      box.appendChild(el('div', { class: 'sheet-actions' }, actions.map((a) => el('button', {
        class: 'btn ' + (a.primary ? 'primary' : '') + ' grow', text: a.label, disabled: a.disabled || null,
        onclick: () => { if (a.keepOpen !== true) close(); a.onclick && a.onclick(); },
      }))));
    }
    back.appendChild(box);
    document.body.appendChild(back);
    return { close, body };
  };

  /* ---------- Feiring/flyttall ---------- */
  NG.floatText = function (anchor, text, cls) {
    if (!anchor) return;
    const f = el('div', { class: 'float ' + (cls || ''), text });
    anchor.appendChild(f);
    setTimeout(() => f.remove(), 1100);
  };

  NG.conceptChip = function (id) {
    const c = NG.conceptById(id);
    const s = NG.state();
    const k = s && s.cards[id];
    return el('button', { class: 'chip concept-chip', onclick: () => NG.showConcept(id) }, [
      c ? c.name : id, k && k.lvl ? el('span', { class: 'pips', text: '●'.repeat(k.lvl) + '○'.repeat(5 - k.lvl) }) : null,
    ]);
  };

  NG.showConcept = function (id) {
    const c = NG.conceptById(id);
    if (!c) return;
    const s = NG.state();
    const k = s.cards[id] || { lvl: 0 };
    const reg = NG.region(c.region);
    const body = el('div', { class: 'stack concept-card', style: { '--rc': reg ? reg.color : 'var(--chalk)' } }, [
      el('div', { class: 'row' }, [el('span', { class: 'chip', text: reg ? reg.name : '' }), c.key ? el('span', { class: 'chip key', text: 'Nøkkelbegrep' }) : null]),
      ladderView(k.lvl),
      el('div', { class: 'cc-def', html: NG.md(c.def) }),
      c.example ? el('div', { class: 'small', html: '<span class="label">Eksempel</span><br>' + NG.md(c.example) }) : null,
      c.everyday ? el('div', { class: 'small muted', html: '<span class="label">Hverdagsspråk</span><br>' + NG.md(c.everyday) }) : null,
      c.related && c.related.length ? el('div', { class: 'stack-s' }, [el('span', { class: 'label', text: 'Nettverk' }),
        el('div', { class: 'row' }, c.related.filter((r) => NG.conceptById(r)).map((r) => NG.conceptChip(r)))]) : null,
    ]);
    NG.sheet(c.name, body);
  };

  function ladderView(lvl) {
    return el('ol', { class: 'ladder', 'aria-label': 'Begrepsstigen' }, NG.LADDER.slice(1).map((name, i) =>
      el('li', { class: i + 1 <= lvl ? 'on' : '' }, [el('span', { class: 'num', text: String(i + 1) }), name])));
  }
  NG.ladderView = ladderView;

  /* Felles: vis nivå-opp og kort-opp etter svar */
  NG.announce = function (r) {
    if (!r) return;
    for (const u of r.cardUps || []) {
      const c = NG.conceptById(u.id);
      if (c && u.lvl >= 2) NG.toast('«' + c.name + '» → ' + NG.LADDER[u.lvl]);
    }
    if (r.levelUps) { NG.sfx('level'); NG.toast('Nivå opp! Du er nå nivå ' + NG.state().level + ' — fordel et poeng i sekken.', 3200); }
  };
})();
