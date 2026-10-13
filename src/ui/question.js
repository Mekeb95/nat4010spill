/* Spørsmålsvisning for alle spørsmålstyper. Brukes av kamp, solgløtt, repetisjon og dev-harness.
   NG.renderQuestion(root, q, opts) -> { submit() }
   opts: { rng, eliminate: n (Partikkelblikket: fjern n gale mc-alternativ), onAnswer(res), onContinue(), continueLabel }
   res: { correct: bool, partial: 0..1, picked } */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);

  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s/g, '').replace(',', '.').replace('−', '-');
    // tillat 1e3, 1,2·10^3 skrives som 1.2e3
    return s === '' ? NaN : Number(s);
  }
  NG.parseNum = parseNum;

  NG.checkAnswer = function (q, picked) {
    switch (q.type) {
      case 'mc': return { correct: picked === q.answer, partial: picked === q.answer ? 1 : 0 };
      case 'tf': return { correct: picked === q.answer, partial: picked === q.answer ? 1 : 0 };
      case 'multi': {
        const want = new Set(q.answer); const got = new Set(picked);
        let hit = 0; let wrong = 0;
        got.forEach((i) => (want.has(i) ? hit++ : wrong++));
        const ok = hit === want.size && wrong === 0;
        return { correct: ok, partial: Math.max(0, (hit - wrong) / want.size) };
      }
      case 'order': {
        let pos = 0;
        picked.forEach((it, i) => { if (it === i) pos++; });
        return { correct: pos === q.items.length, partial: pos / q.items.length };
      }
      case 'sort': {
        let ok = 0;
        q.items.forEach((it, i) => { if (picked[i] === it.b) ok++; });
        return { correct: ok === q.items.length, partial: ok / q.items.length };
      }
      case 'num': {
        const v = parseNum(picked);
        if (!isFinite(v)) return { correct: false, partial: 0 };
        const tolAbs = q.abs != null ? q.abs : Math.abs(q.answer) * (q.tol != null ? q.tol : 0.02);
        const ok = Math.abs(v - q.answer) <= tolAbs + 1e-12;
        return { correct: ok, partial: ok ? 1 : 0 };
      }
    }
    return { correct: false, partial: 0 };
  };

  NG.renderQuestion = function (root, q, opts) {
    opts = opts || {};
    const rng = opts.rng || NG.makeRng(Date.now());
    root.innerHTML = '';
    const wrap = el('div', { class: 'q stack' });
    const head = el('div', { class: 'row q-head' }, [
      el('span', { class: 'chip', text: q.topic || 'Spørsmål' }),
      q.level ? el('span', { class: 'chip lvl', title: 'Nivå på begrepsstigen', text: NG.LADDER ? NG.LADDER[q.level] : 'nivå ' + q.level }) : null,
    ]);
    wrap.appendChild(head);
    if (q.figure) wrap.appendChild(el('div', { class: 'q-figure', html: q.figure.trim().startsWith('<') ? q.figure : NG.art.get(q.figure) }));
    wrap.appendChild(el('div', { class: 'q-prompt', html: NG.md(q.prompt) }));
    const body = el('div', { class: 'q-body stack-s' });
    wrap.appendChild(body);
    const fb = el('div', { class: 'q-fb' });
    wrap.appendChild(fb);
    root.appendChild(wrap);

    let answered = false;
    function finish(picked, markFn) {
      if (answered) return;
      answered = true;
      const res = NG.checkAnswer(q, picked);
      res.picked = picked;
      body.classList.add('locked');
      markFn(res);
      NG.sfx(res.correct ? 'good' : 'bad');
      showFeedback(res, picked);
      if (opts.onAnswer) opts.onAnswer(res);
    }

    function showFeedback(res, picked) {
      const box = el('div', { class: 'feedback ' + (res.correct ? 'good' : 'bad') + ' stack-s' });
      box.appendChild(el('div', { class: 'h-display fb-title', text: res.correct ? pickPraise(rng) : (res.partial > 0 ? 'Delvis riktig' : 'Ikke helt') }));
      if (!res.correct && q.why && q.type === 'mc' && q.why[picked] != null) {
        box.appendChild(el('div', { class: 'fb-why', html: '<span class="label">Ditt svar</span><br>' + NG.md(q.why[picked]) }));
      }
      if (!res.correct) box.appendChild(el('div', { class: 'fb-right', html: '<span class="label">Riktig</span><br>' + NG.md(rightText(q)) }));
      box.appendChild(el('div', { class: 'fb-explain', html: NG.md(q.explain || '') }));
      if (q.source) box.appendChild(el('div', { class: 'small muted', text: 'Kilde: ' + q.source }));
      if (opts.onContinue) {
        const b = el('button', { class: 'btn primary block', text: opts.continueLabel || 'Videre', onclick: () => { NG.sfx('click'); opts.onContinue(res); } });
        box.appendChild(b);
        setTimeout(() => { try { b.focus({ preventScroll: true }); } catch (e) { /* */ } }, 50);
      }
      fb.appendChild(box);
      setTimeout(() => { try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ } }, 60);
    }

    const r = RENDER[q.type];
    if (!r) body.appendChild(el('div', { class: 'feedback bad', text: 'Ukjent spørsmålstype: ' + q.type }));
    else r(body, q, rng, finish, opts);
    return { get answered() { return answered; } };
  };

  const PRAISE = ['Riktig!', 'Helt rett!', 'Presist!', 'Godt resonnert!', 'Nettopp!', 'Sterkt!'];
  function pickPraise(rng) { return rng.pick(PRAISE); }

  function rightText(q) {
    switch (q.type) {
      case 'mc': return q.options[q.answer];
      case 'tf': return q.answer ? 'Sant' : 'Usant';
      case 'multi': return q.answer.map((i) => q.options[i]).join(' · ');
      case 'order': return q.items.map((t, i) => (i + 1) + '. ' + t).join('\n');
      case 'sort': return q.buckets.map((b, bi) => '**' + b + ':** ' + q.items.filter((it) => it.b === bi).map((it) => it.t).join(', ')).join('\n');
      case 'num': return NG.fmt(q.answer, 4) + (q.unit ? ' ' + q.unit : '');
    }
    return '';
  }

  const RENDER = {
    mc(body, q, rng, finish, opts) {
      let order = q.options.map((_, i) => i);
      if (q.shuffle !== false) order = rng.shuffle(order);
      const hidden = new Set();
      if (opts.eliminate) {
        const wrong = rng.shuffle(order.filter((i) => i !== q.answer));
        wrong.slice(0, Math.min(opts.eliminate, wrong.length - 1)).forEach((i) => hidden.add(i));
      }
      const btns = [];
      order.forEach((i, k) => {
        const b = el('button', { class: 'option' + (hidden.has(i) ? ' dim' : ''), disabled: hidden.has(i) || null,
          html: '<span class="opt-key">' + 'ABCDEF'[k] + '</span>' + NG.md(q.options[i]),
          onclick: () => finish(i, () => {
            btns.forEach(([j, bb]) => {
              bb.disabled = true;
              if (j === q.answer) bb.classList.add('correct');
              else if (j === i) bb.classList.add('wrong');
              else bb.classList.add('dim');
            });
          }) });
        btns.push([i, b]);
        body.appendChild(b);
      });
    },

    tf(body, q, rng, finish) {
      const row = el('div', { class: 'tf-row' });
      const mk = (val, label) => el('button', { class: 'option tf', html: label, onclick: () => finish(val, () => {
        row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        tBtn.classList.add(q.answer === true ? 'correct' : (val === true ? 'wrong' : 'dim'));
        fBtn.classList.add(q.answer === false ? 'correct' : (val === false ? 'wrong' : 'dim'));
      }) });
      const tBtn = mk(true, '<strong>Sant</strong>');
      const fBtn = mk(false, '<strong>Usant</strong>');
      row.append(tBtn, fBtn);
      body.appendChild(row);
    },

    multi(body, q, rng, finish) {
      body.appendChild(el('div', { class: 'small muted', text: 'Velg alle som stemmer.' }));
      const order = q.shuffle === false ? q.options.map((_, i) => i) : rng.shuffle(q.options.map((_, i) => i));
      const sel = new Set();
      const btns = [];
      order.forEach((i) => {
        const b = el('button', { class: 'option', 'aria-pressed': 'false', html: '<span class="opt-box"></span>' + NG.md(q.options[i]),
          onclick: () => {
            if (sel.has(i)) sel.delete(i); else sel.add(i);
            b.classList.toggle('selected', sel.has(i));
            b.setAttribute('aria-pressed', String(sel.has(i)));
            go.disabled = sel.size === 0;
          } });
        btns.push([i, b]); body.appendChild(b);
      });
      const go = el('button', { class: 'btn primary block', text: 'Svar', disabled: true, onclick: () => finish([...sel], () => {
        go.remove();
        const want = new Set(q.answer);
        btns.forEach(([i, b]) => {
          b.disabled = true;
          if (want.has(i)) b.classList.add('correct');
          else if (sel.has(i)) b.classList.add('wrong');
          else b.classList.add('dim');
        });
      }) });
      body.appendChild(go);
    },

    order(body, q, rng, finish) {
      body.appendChild(el('div', { class: 'small muted', text: 'Trykk i riktig rekkefølge. Trykk på et valgt steg for å angre.' }));
      let pool = rng.shuffle(q.items.map((_, i) => i));
      // unngå at stokket rekkefølge tilfeldigvis er riktig
      if (pool.every((v, i) => v === i) && pool.length > 1) pool = pool.slice(1).concat(pool[0]);
      const chosen = [];
      const list = el('ol', { class: 'order-list' });
      const poolBox = el('div', { class: 'order-pool' });
      const go = el('button', { class: 'btn primary block', text: 'Svar', disabled: true });
      function draw() {
        list.innerHTML = '';
        chosen.forEach((i, k) => list.appendChild(el('li', {}, el('button', { class: 'option order-item', html: '<span class="opt-key">' + (k + 1) + '</span>' + NG.md(q.items[i]),
          onclick: () => { chosen.splice(k, 1); pool.push(i); NG.sfx('click'); draw(); } }))));
        poolBox.innerHTML = '';
        pool.forEach((i, k) => poolBox.appendChild(el('button', { class: 'option pool-item', html: NG.md(q.items[i]),
          onclick: () => { pool.splice(k, 1); chosen.push(i); NG.sfx('click'); draw(); } })));
        go.disabled = pool.length > 0;
        list.hidden = chosen.length === 0;
      }
      go.onclick = () => finish(chosen.slice(), () => {
        go.remove(); poolBox.remove();
        [...list.querySelectorAll('button')].forEach((b, k) => { b.disabled = true; b.classList.add(chosen[k] === k ? 'correct' : 'wrong'); });
      });
      body.append(list, poolBox, go);
      draw();
    },

    sort(body, q, rng, finish) {
      body.appendChild(el('div', { class: 'small muted', text: 'Plasser hvert element i riktig kategori.' }));
      const order = rng.shuffle(q.items.map((_, i) => i));
      const picked = q.items.map(() => -1);
      const rows = [];
      const legend = el('div', { class: 'sort-legend' }, q.buckets.map((b, bi) => el('span', { class: 'chip sort-b' + bi, text: 'ABCDE'[bi] + ' = ' + b })));
      body.appendChild(legend);
      order.forEach((i) => {
        const segs = q.buckets.map((b, bi) => el('button', { class: 'seg sort-b' + bi, 'aria-label': b, title: b, text: q.buckets.length > 3 ? 'ABCDE'[bi] : b,
          onclick: () => {
            picked[i] = bi;
            segs.forEach((s, sj) => s.classList.toggle('on', sj === bi));
            NG.sfx('click');
            go.disabled = picked.some((p) => p < 0);
          } }));
        const row = el('div', { class: 'sort-row' }, [el('div', { class: 'sort-t', html: NG.md(q.items[i].t) }), el('div', { class: 'segs' }, segs)]);
        rows.push([i, row, segs]);
        body.appendChild(row);
      });
      const go = el('button', { class: 'btn primary block', text: 'Svar', disabled: true, onclick: () => finish(picked.slice(), () => {
        go.remove();
        rows.forEach(([i, row, segs]) => {
          segs.forEach((s) => { s.disabled = true; });
          row.classList.add(picked[i] === q.items[i].b ? 'correct' : 'wrong');
          if (picked[i] !== q.items[i].b) segs[q.items[i].b].classList.add('want');
        });
      }) });
      body.appendChild(go);
    },

    num(body, q, rng, finish) {
      const inp = el('input', { class: 'num-in num', type: 'text', inputmode: 'decimal', autocomplete: 'off', enterkeyhint: 'done', placeholder: 'Svar', 'aria-label': 'Tallsvar', id: 'num-' + q.id });
      const unit = q.unit ? el('span', { class: 'num-unit', text: q.unit }) : null;
      const go = el('button', { class: 'btn primary', text: 'Svar' });
      const submit = () => {
        if (!isFinite(parseNum(inp.value))) { NG.toast('Skriv et tall (komma eller punktum går fint)'); return; }
        finish(inp.value, (res) => { inp.disabled = true; go.remove(); inp.classList.add(res.correct ? 'correct' : 'wrong'); });
      };
      go.onclick = submit;
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      body.appendChild(el('div', { class: 'num-row' }, [inp, unit, go]));
      if (q.hint) body.appendChild(el('div', { class: 'small muted', html: NG.md(q.hint) }));
    },
  };
})();
