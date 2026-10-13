/* API-et som hvert mini-spill får i start(root, api). Se docs/CONTRACT.md. */
(function () {
  'use strict';
  NG.toast = function (text, ms) {
    const wrap = document.getElementById('toasts');
    if (!wrap) return;
    const t = NG.el('div', { class: 'toast', text });
    wrap.appendChild(t);
    setTimeout(() => t.remove(), ms || 2200);
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
