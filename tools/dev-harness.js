/* Dev-harness: kjører ett mini-spill (NG_DEV.mg) eller blar i en regions spørsmål (NG_DEV.q). Ikke med i produksjon. */
(function () {
  'use strict';
  const app = document.getElementById('app');
  const D = window.NG_DEV || {};
  const el = NG.el;
  let seed = Number(new URLSearchParams(location.search).get('seed')) || 12345;
  const diff = Number(new URLSearchParams(location.search).get('d')) || 1;

  if (D.mg) {
    const def = NG.minigames.get(D.mg);
    function run() {
      app.innerHTML = '';
      if (!def) { app.textContent = 'Fant ikke mini-spill: ' + D.mg + '. Registrert: ' + NG.minigames.list.map((m) => m.id).join(', '); return; }
      const root = el('div', { class: 'mg-root', id: 'mg-root' });
      const out = el('pre', { id: 'mg-result', class: 'small muted', style: { whiteSpace: 'pre-wrap' } });
      app.append(el('div', { class: 'row' }, [el('span', { class: 'label', text: 'DEV · ' + def.id + ' · frø ' + seed + ' · d' + diff })]), root, out);
      const api = NG.makeMinigameApi({ seed, difficulty: diff, onDone: (r) => { out.textContent = 'DONE ' + JSON.stringify(r); window.__mgResult = r;
        out.after(el('button', { class: 'btn', id: 'mg-again', text: 'Nytt frø', onclick: () => { seed++; run(); } })); } });
      window.__mgApi = api;
      def.start(root, api);
    }
    run();
  } else if (D.q) {
    const qs = NG.content.store.questions.filter((q) => q.region === D.q || D.q === 'all');
    let i = Number(new URLSearchParams(location.search).get('i')) || 0;
    function show() {
      app.innerHTML = '';
      const root = el('div', { id: 'q-root' });
      app.append(el('div', { class: 'row' }, [el('span', { class: 'label', text: (i + 1) + '/' + qs.length + ' · ' + (qs[i] && qs[i].id) })]), root);
      if (!qs[i]) return;
      NG.renderQuestion(root, qs[i], { rng: NG.makeRng(seed + i), onContinue: () => { i = (i + 1) % qs.length; show(); } });
    }
    show();
  }
})();
