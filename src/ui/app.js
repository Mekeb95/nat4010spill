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
    const same = current && current.name === name;
    app.innerHTML = '';
    // Skjermovergang: innholdet glir mykt inn (ikke når samme skjerm tegnes på nytt, f.eks. etter et kjøp)
    app.className = 'scr-' + name + (same ? '' : ' scr-in');
    current = { name, params: params || {} };
    if (HUBS.includes(name)) lastHub = name;
    if (name !== 'title') arm(); else disarmTitle();
    try { if (NG.music) NG.music.auto(name, params || {}); } catch (e) { /* musikk er valgfritt */ }
    const r = screens[name];
    if (!r) { app.textContent = 'Ukjent skjerm: ' + name; return; }
    const ret = r(app, params || {});
    if (typeof ret === 'function') cleanup = ret;
    try { window.scrollTo(0, 0); } catch (e) { /* */ }
    // Tilgjengelighet: flytt fokus til skjermens overskrift (uten synlig ramme/hopp).
    const ae = document.activeElement;
    if (!ae || ae === document.body || !document.contains(ae)) {
      const h = app.querySelector('h1');
      if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { /* */ } }
    }
  };
  NG.current = () => current;

  /* ---------- Tilbakeknapp (Android/nettleser) ----------
     Én «felle»-oppføring i historikken: tilbake lukker et åpent ark eller går til en fornuftig forelder
     i appen, i stedet for å lukke PWA-en. Ekspedisjon, kamp og noder blir stående (ingen flukt midt i
     en kamp, og belønningsskjermer tegnes aldri på nytt). Av i iframe (Artifact-visning). */
  const HUBS = ['title', 'camp', 'path'];
  const STAY = ['path', 'combat', 'event', 'chest', 'sol', 'merchant'];
  const SAFE_BACK = ['camp', 'path', 'labs', 'exams', 'sheets', 'wall', 'settings', 'shop', 'review'];
  let lastHub = 'camp';
  let armed = false;
  const sheets = [];
  const useHistory = (() => { try { return window.top === window && !!(window.history && history.pushState); } catch (e) { return false; } })();
  let skipPop = false;   // vi tok selv bort fella (history.back) — den neste popstate skal ignoreres
  let armLater = false;  // arm() ble bedt om mens den bortgangen fortsatt var underveis
  function arm() {
    if (!useHistory || armed) return;
    if (skipPop) { armLater = true; return; }
    try { history.pushState({ ng: 1 }, ''); armed = true; } catch (e) { /* */ }
  }
  // Tittelskjermen skal aldri ha en felle liggende: da gjør første tilbaketrykk ingenting og det andre
  // lukker appen. Kommer vi dit uten å bruke tilbake (knapp, lukket ark), fjerner vi fella selv.
  function disarmTitle() {
    if (!useHistory || !armed || sheets.length) return;
    if (current && current.name !== 'title') return;
    armed = false; skipPop = true;
    try { history.back(); } catch (e) { skipPop = false; }
  }
  function backTarget() {
    const cur = current || { name: 'title', params: {} };
    const n = cur.name, p = cur.params || {};
    const s = NG.state && NG.state();
    const run = s && s.run;
    if (n === 'title') return null;
    if (n === 'camp' || n === 'intro') return { name: 'title' };
    if (STAY.includes(n) || (n === 'lab' && p.inRun)) return run || n === 'path' || n === 'combat' ? 'stay' : { name: 'camp' };
    if (n === 'lab') return { name: 'labs' };
    if (p.back && SAFE_BACK.includes(p.back.name) && p.back.name !== n) {
      return p.back.name === 'path' && !run ? { name: 'camp' } : p.back;
    }
    return { name: lastHub === 'path' && run ? 'path' : 'camp' };
  }
  if (useHistory) {
    window.addEventListener('popstate', () => {
      if (skipPop) { skipPop = false; if (armLater) { armLater = false; arm(); } return; }
      armed = false;
      const onTitle = !current || current.name === 'title';
      if (sheets.length) { if (!onTitle) arm(); sheets[sheets.length - 1](true); return; }
      const t = backTarget();
      if (!t) return; // tittelskjermen: tilbake lukker appen
      if (t === 'stay') arm();
      else NG.go(t.name, t.params); // NG.go setter fella på nytt (unntatt for tittelskjermen)
    });
  }

  /* ---------- Grafikk ---------- */
  NG.artEl = function (id, cls) {
    return el('div', { class: 'art ' + (cls || ''), html: NG.art.get(id), 'aria-hidden': 'true' });
  };

  /* ---------- HUD ----------
     HUD-en tegnes på nytt ved hver skjerm/oppdatering. Søylene starter på forrige verdi og glir til den nye
     (CSS-transition), og endringer gir små signaler: HP ned → rød blink + rist, HP opp → grønn glød,
     nytt nivå → glød rundt nivåtallet. */
  let hudPrev = null;
  NG.hud = function (s, opts) {
    opts = opts || {};
    const maxHp = NG.maxHp(s);
    const total = s.energy + s.heat;
    const eMax = Math.max(total, NG.maxEnergy(s));
    const now = {
      hp: 100 * s.hp / maxHp,
      en: total ? 100 * s.energy / eMax : 0,
      heat: total ? 100 * s.heat / eMax : 0,
      xp: 100 * s.xp / NG.xpNeed(s.level),
      rawHp: s.hp, level: s.level,
    };
    const prev = hudPrev || now;
    hudPrev = now;
    const fill = (w, bg, cls) => el('i', { class: cls || null, style: { width: w + '%', background: bg } });
    const hpI = fill(prev.hp, 'var(--hp)');
    const enI = fill(prev.en, 'var(--energy)');
    const heatI = el('i', { class: 'heat', style: { left: prev.en + '%', width: prev.heat + '%' } });
    // XP: nytt nivå → søylen starter fra null igjen
    const xpI = fill(now.level > prev.level ? 0 : prev.xp, 'var(--xp)');
    const hpBar = el('div', { class: 'bar grow hp-bar' }, hpI);
    const lvl = el('div', { class: 'hud-lvl' }, [el('span', { class: 'label', text: 'Nivå' }), el('strong', { class: 'num', text: String(s.level) })]);
    const bar = el('header', { class: 'hud' }, [
      el('button', { class: 'hud-who', 'aria-label': 'Ryggsekk og egenskaper', onclick: () => opts.noNav ? null : NG.go('sekk', { back: current }) }, [
        NG.artEl('laerling', 'hud-ava'),
        lvl,
      ]),
      el('div', { class: 'hud-bars' }, [
        el('div', { class: 'hud-row' }, [
          el('span', { class: 'hud-k', text: 'HP' }),
          hpBar,
          el('span', { class: 'num hud-v', text: s.hp + '/' + maxHp }),
        ]),
        el('div', { class: 'hud-row', title: 'Energiregnskap: energi + spillvarme er bevart' }, [
          el('span', { class: 'hud-k', text: 'J' }),
          el('div', { class: 'bar grow ebar' }, [enI, heatI]),
          el('span', { class: 'num hud-v', text: s.energy + (s.heat ? '+' + s.heat : '') }),
        ]),
        el('div', { class: 'hud-row' }, [
          el('span', { class: 'hud-k', text: 'XP' }),
          el('div', { class: 'bar grow thin' }, xpI),
          el('span', { class: 'num hud-v gold', text: s.joule + ' ◆' }),
        ]),
      ]),
    ]);
    if (s.statPoints > 0 && !opts.noNav) bar.querySelector('.hud-who').appendChild(el('span', { class: 'hud-dot', text: '+' + s.statPoints }));
    // Signaler om endringer siden forrige HUD
    if (now.rawHp < prev.rawHp) { hpBar.classList.add('flash-bad'); bar.classList.add('hud-hit'); }
    else if (now.rawHp > prev.rawHp) hpBar.classList.add('flash-good');
    if (now.level > prev.level) lvl.classList.add('lvl-up');
    // Gli fra forrige verdi til den nye når HUD-en er i dokumentet
    const settle = () => {
      hpI.style.width = now.hp + '%'; enI.style.width = now.en + '%';
      heatI.style.left = now.en + '%'; heatI.style.width = now.heat + '%';
      xpI.style.width = now.xp + '%';
    };
    if (prev === now || NG.reducedMotion()) settle();
    else requestAnimationFrame(() => requestAnimationFrame(settle));
    return bar;
  };

  NG.reducedMotion = function () {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  };
  // Start en CSS-animasjon på nytt (fjern klassen, tving reflow, legg til igjen)
  NG.replay = function (node, cls) {
    if (!node) return;
    node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
  };

  /* ---------- Modal-ark (bunnark på mobil) ---------- */
  NG.sheet = function (title, content, actions) {
    const back = el('div', { class: 'sheet-back', onclick: (e) => { if (e.target === back) close(); } });
    const box = el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title, tabindex: '-1' });
    const prevFocus = document.activeElement;
    let open = true;
    function close(viaBack) {
      if (!open) return;
      open = false;
      back.remove(); document.removeEventListener('keydown', onKey);
      const i = sheets.indexOf(close); if (i >= 0) sheets.splice(i, 1);
      if (!viaBack) setTimeout(disarmTitle, 0);
      const tgt = prevFocus && prevFocus !== document.body && document.contains(prevFocus) ? prevFocus : document.querySelector('#app h1[tabindex]');
      if (tgt && tgt.focus) try { tgt.focus({ preventScroll: true }); } catch (e) { /* */ }
    }
    sheets.push(close);
    arm();
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    box.appendChild(el('div', { class: 'row sheet-head' }, [
      el('h2', { class: 'h-display grow', text: title }),
      el('button', { class: 'btn ghost small', 'aria-label': 'Lukk', text: '✕', onclick: () => close() }),
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
    try { box.focus({ preventScroll: true }); } catch (e) { /* */ }
    return { close, body };
  };

  /* ---------- Feiring/flyttall ---------- */
  NG.floatText = function (anchor, text, cls) {
    if (!anchor) return;
    const f = el('div', { class: 'float ' + (cls || ''), text, 'aria-hidden': 'true' });
    // litt sideveis variasjon så flere tall etter hverandre ikke legger seg oppå hverandre
    f.style.setProperty('--fx', ((Date.now() % 7) - 3) * 5 + 'px');
    anchor.appendChild(f);
    setTimeout(() => f.remove(), 1100);
  };
  // Usynlig levende område: det som bare vises som animasjon (skade, blokkering) leses opp av skjermlesere.
  NG.srSay = function (text) {
    let live = document.getElementById('sr-live');
    if (!live) { live = el('div', { id: 'sr-live', class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' }); document.body.appendChild(live); }
    live.textContent = '';
    setTimeout(() => { live.textContent = String(text); }, 30);
  };
  // Stjerneutbrudd (kritisk treff, relikvie, nivå) sentrert på et element
  NG.burst = function (anchor, cls) {
    if (!anchor || NG.reducedMotion()) return;
    const b = el('div', { class: 'burst ' + (cls || ''), 'aria-hidden': 'true' });
    anchor.appendChild(b);
    setTimeout(() => b.remove(), 520);
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
      if (c && u.down) NG.toast('«' + c.name + '» ↓ ' + NG.LADDER[u.lvl] + ' – repeter begrepet');
      else if (c && u.lvl >= 2) NG.toast('«' + c.name + '» → ' + NG.LADDER[u.lvl], null, 'spark');
    }
    if (r.levelUps) { NG.sfx('level'); NG.toast('Nivå opp! Du er nå nivå ' + NG.state().level + ' — fordel et poeng i sekken.', 3200, 'spark'); }
  };
})();
