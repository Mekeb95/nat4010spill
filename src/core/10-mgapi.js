/* API-et som hvert mini-spill får i start(root, api). Se docs/CONTRACT.md. */
(function () {
  'use strict';
  /* Toasts: små beskjeder øverst, rett under HUD-en. Maks 2 synlige samtidig (resten venter i kø),
     kort varighet, og de tar aldri imot trykk — de skal aldri sperre svaralternativene. */
  const TOAST_MAX = 2;
  const toastQueue = [];
  let toastLive = 0;
  function toastTop(wrap) {
    let top = 0;
    try {
      const hud = document.querySelector('#app .hud');
      if (hud) { const r = hud.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight / 2) top = r.bottom + 6; }
    } catch (e) { /* */ }
    wrap.style.top = top ? Math.round(top) + 'px' : '';
  }
  function showToast(item) {
    const wrap = document.getElementById('toasts');
    if (!wrap) return;
    toastTop(wrap);
    toastLive++;
    const t = NG.el('div', { class: 'toast' + (item.cls ? ' ' + item.cls : ''), text: item.text });
    wrap.appendChild(t);
    // Varighet etter lengde (1,6–3,2 s; ønsket varighet kappes ved 3,6 s), så køen aldri hoper seg opp.
    const ms = item.ms ? NG.clamp(item.ms, 1200, 3600) : NG.clamp(1400 + 30 * item.text.length, 1600, 3200);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => {
        t.remove(); toastLive = Math.max(0, toastLive - 1);
        if (toastQueue.length) showToast(toastQueue.shift());
      }, 180);
    }, ms);
  }
  NG.toast = function (text, ms, cls) {
    if (!text) return;
    const item = { text: String(text), ms, cls };
    if (toastLive < TOAST_MAX) showToast(item);
    else { toastQueue.push(item); if (toastQueue.length > 3) toastQueue.shift(); }
  };

  NG.conceptById = function (id) {
    return NG.content.store.concepts.find((c) => c.id === id) || null;
  };

  NG.makeMinigameApi = function (opts) {
    opts = opts || {};
    const seed = opts.seed != null ? opts.seed : Date.now() % 1e9;
    let finished = false;
    return {
      seed,
      rng: NG.makeRng(seed),
      difficulty: opts.difficulty || 1, // 1–3, stiger med regionsbesøk/nivå
      el: NG.el,
      md: NG.md,
      sfx: NG.sfx,
      toast: NG.toast,
      concept: NG.conceptById,
      // result: { score: 0..1, correct?: n, total?: n, notes?: 'kort oppsummering av hva spilleren lærte/bommet på' }
      done(result) {
        if (finished) return;
        finished = true;
        const r = Object.assign({ score: 0 }, result || {});
        r.score = NG.clamp(Number(r.score) || 0, 0, 1);
        if (opts.onDone) opts.onDone(r);
      },
      get finished() { return finished; },
    };
  };
})();
