/* Nøkkelvokteren — globalt navnerom og registre.
   Lastes FØRST. Alle andre filer registrerer seg her. Ingen moduler/bundler:
   tools/build.mjs limer filene sammen i fast rekkefølge (se docs/CONTRACT.md). */
(function () {
  'use strict';
  const NG = (window.NG = window.NG || {});

  /* ---------- Innholdsregistre ---------- */
  const store = { questions: [], concepts: [], myths: [], enemies: [], events: [], prompts: [], items: [] };
  function adder(key) {
    return function (list) {
      if (!Array.isArray(list)) list = [list];
      for (const x of list) store[key].push(x);
    };
  }
  NG.content = {
    store,
    addQuestions: adder('questions'),
    addConcepts: adder('concepts'),
    addMyths: adder('myths'),
    addEnemies: adder('enemies'),
    addEvents: adder('events'),
    addPrompts: adder('prompts'),
    addItems: adder('items'),
  };

  /* ---------- Mini-spill ---------- */
  const minigames = [];
  NG.minigames = {
    list: minigames,
    register(def) { minigames.push(def); },
    get(id) { return minigames.find((m) => m.id === id) || null; },
    forRegion(r) { return minigames.filter((m) => m.region === r); },
  };

  /* ---------- Grafikk (SVG-strenger) ---------- */
  const art = {};
  NG.art = {
    map: art,
    add(id, svg) { art[id] = svg; },
    get(id) { return art[id] || art['_fallback'] || ''; },
  };

  /* ---------- CSS-injeksjon (mini-spill og moduler kan ha egen CSS) ---------- */
  NG.css = function (text) {
    const s = document.createElement('style');
    s.textContent = text;
    document.head.appendChild(s);
  };

  /* ---------- Frøsatt RNG (mulberry32) ---------- */
  NG.makeRng = function (seed) {
    let a = (typeof seed === 'number' ? seed : hashStr(String(seed))) >>> 0;
    const next = function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      int(lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick(arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle(arr) {
        const b = arr.slice();
        for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
        return b;
      },
      chance(p) { return next() < p; },
    };
  };
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  NG.hashStr = hashStr;

  /* ---------- DOM-hjelpere ---------- */
  // el('div', {class:'x', onclick: fn, html:'<b>..</b>'}, [children|string])
  NG.el = function (tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    if (children != null) {
      if (!Array.isArray(children)) children = [children];
      for (const c of children) {
        if (c == null || c === false) continue;
        e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
      }
    }
    return e;
  };

  // Mini-markup for innhold: **fet**, *kursiv*, `kode`, ^hevet^, ~senket~, linjeskift.
  NG.md = function (text) {
    if (text == null) return '';
    let s = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/\^([^^\s]{1,8})\^/g, '<sup>$1</sup>');
    s = s.replace(/~([^~\s]{1,8})~/g, '<sub>$1</sub>');
    s = s.replace(/\n/g, '<br>');
    return s;
  };

  NG.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  NG.fmt = (n, d) => Number(n).toLocaleString('nb-NO', { maximumFractionDigits: d == null ? 1 : d });
})();
