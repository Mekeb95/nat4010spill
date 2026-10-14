/* Orakelet: skriv en forklaring med egne ord, Claude vurderer den (sample-kapabiliteten).
   Uten sample vises modellsvar og egenvurdering i stedet — funksjonen virker uansett. */
(function () {
  'use strict';
  const el = (...a) => NG.el(...a);
  let sampleFn = null;
  NG.oracleAvailable = false;

  NG.connectOracle = async function () {
    try {
      if (!window.claude || !window.claude.use) return;
      const s = await window.claude.use('sample');
      if (s) { sampleFn = s; NG.oracleAvailable = true; }
    } catch (e) { /* ikke tilgjengelig */ }
  };

  function buildPrompt(pr, answer) {
    const concepts = (pr.concepts || []).map((id) => { const c = NG.conceptById(id); return c ? c.name + ': ' + c.def : id; }).join('\n');
    return [
      'Du er en vennlig, faglig presis naturfagdidaktiker som vurderer en lærerstudents korte forklaring (emnet NAT4010, lærerutdanning 5–10).',
      'Vurder svaret mot rubrikken og strukturen påstand–evidens–begrunnelse. Vær konkret og oppmuntrende, men ikke smigrende. Skriv på norsk bokmål.',
      '',
      'OPPGAVE: ' + pr.prompt,
      'RUBRIKK (hva et godt svar inneholder): ' + pr.rubric,
      concepts ? 'RELEVANTE BEGREPER:\n' + concepts : '',
      '',
      'STUDENTENS SVAR:\n"""' + answer.slice(0, 2500) + '"""',
      '',
      'Svar KUN med JSON på formen:',
      '{"score":0-3,"pastand":true|false,"evidens":true|false,"begrunnelse":true|false,"styrke":"én setning om det som er bra","forbedring":"én til to setninger om det viktigste å forbedre","misoppfatning":"navngi en misoppfatning i svaret, eller null","fagord":["fagbegreper studenten brukte riktig"]}',
      'score: 0 = mangler/feil, 1 = noe riktig men vesentlige hull, 2 = godt, 3 = presist og fullstendig.',
    ].filter(Boolean).join('\n');
  }

  NG.screen('oracle', (app, p) => {
    const s = NG.state();
    const prompts = NG.content.store.prompts.filter((x) => NG.isUnlocked(s, NG.region(x.region)) && (!p.region || x.region === p.region));
    const back = () => (p.fromSol && s.run ? NG.nodeDone() : NG.go('camp'));
    app.appendChild(NG.hud(s));
    app.appendChild(el('div', { class: 'row' }, [
      NG.artEl('item-lupe', 'ph-icon'),
      el('div', { class: 'grow stack-s' }, [el('span', { class: 'label', text: 'Forklar med egne ord' }), el('h1', { class: 'h-display', text: 'Orakelet' })]),
      el('button', { class: 'btn ghost small', text: p.fromSol ? 'Videre' : 'Leiren', onclick: back }),
    ]));
    if (!prompts.length) { app.appendChild(el('p', { class: 'muted', text: 'Ingen oppgaver tilgjengelig ennå.' })); return; }
    const rng = NG.makeRng(Date.now());
    const done = s.oracleDone || (s.oracleDone = {});
    let pr = p.id ? prompts.find((x) => x.id === p.id) : null;
    if (!pr) { const fresh = prompts.filter((x) => !done[x.id]); pr = rng.pick(fresh.length ? fresh : prompts); }
    const reg = NG.region(pr.region);
    app.style.setProperty('--rc', reg.color);
    const ta = el('textarea', { class: 'num-in oracle-in', id: 'oracle-in', rows: '7', placeholder: 'Skriv forklaringen din her. Tenk påstand → evidens → begrunnelse.', 'aria-label': 'Ditt svar' });
    const out = el('div', { class: 'stack' });
    const go = el('button', { class: 'btn primary block', text: NG.oracleAvailable ? 'Få vurdering fra Orakelet' : 'Sammenlign med modellsvar' });
    app.appendChild(el('div', { class: 'stack' }, [
      el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: reg.name }), el('div', { class: 'oracle-q', html: NG.md(pr.prompt) }),
        pr.concepts && pr.concepts.length ? el('div', { class: 'row' }, pr.concepts.filter((c) => NG.conceptById(c)).map((c) => NG.conceptChip(c))) : null]),
      ta, go, out,
      el('button', { class: 'btn ghost block', text: 'Ny oppgave', onclick: () => NG.go('oracle', Object.assign({}, p, { id: null, _: Date.now() })) }),
    ]));
    go.onclick = async () => {
      const ans = ta.value.trim();
      if (ans.length < 30) { NG.toast('Skriv litt mer — minst et par setninger.'); return; }
      go.disabled = true;
      out.innerHTML = '';
      if (NG.oracleAvailable && sampleFn) {
        const wait = el('div', { class: 'card small muted', text: 'Orakelet leser svaret ditt …' });
        out.appendChild(wait);
        try {
          const r = await sampleFn.json(buildPrompt(pr, ans), { modelTier: 'default', cache: false });
          wait.remove();
          showResult(r);
        } catch (e) {
          wait.remove();
          if (e && e.code === 'not_granted') NG.oracleAvailable = false;
          out.appendChild(el('div', { class: 'feedback bad', text: 'Orakelet svarte ikke (' + ((e && e.code) || 'feil') + '). Her er modellsvaret i stedet.' }));
          selfAssess();
        }
      } else selfAssess();
    };

    // self = egenvurdering (uten Claude): kortene løftes høyst til nivå 3 (Nettverk).
    // XP gis bare én gang per oppgave per dag, så Orakelet ikke kan «farmes».
    function reward(score, self) {
      done[pr.id] = Math.max(done[pr.id] || 0, score);
      s.counters.oracle++;
      const today = NG.today();
      if (!s.oracleXp || s.oracleXp.date !== today) s.oracleXp = { date: today, ids: [] };
      const first = s.oracleXp.ids.indexOf(pr.id) < 0;
      if (first) s.oracleXp.ids.push(pr.id);
      const xp = first ? Math.round(10 + 15 * score) : 0;
      const ups = xp ? NG.gainXp(s, xp) : 0;
      if (!first) NG.toast('Du har allerede fått XP for denne oppgaven i dag.');
      const cardUps = NG.updateCards(s, { concepts: pr.concepts || [], level: self ? 3 : (score >= 2 ? 5 : 3) }, score >= 2);
      NG.save();
      NG.announce({ cardUps, levelUps: ups });
      NG.sfx(score >= 2 ? 'win' : 'coin');
      return xp;
    }

    function showResult(r) {
      const score = NG.clamp(Number(r && r.score) || 0, 0, 3);
      const xp = reward(score);
      const peb = el('div', { class: 'row' }, [['Påstand', r.pastand], ['Evidens', r.evidens], ['Begrunnelse', r.begrunnelse]].map(([n, ok]) => el('span', { class: 'chip ' + (ok ? 'ok' : 'no'), text: (ok ? '✓ ' : '✗ ') + n })));
      out.appendChild(el('div', { class: 'feedback ' + (score >= 2 ? 'good' : 'bad') + ' stack-s' }, [
        el('div', { class: 'h-display fb-title', text: ['Ikke ennå', 'På vei', 'Godt forklart', 'Presist!'][score] + ' (' + score + '/3)' }),
        peb,
        r.styrke ? el('div', { html: '<span class="label">Styrke</span><br>' + NG.md(String(r.styrke)) }) : null,
        r.forbedring ? el('div', { html: '<span class="label">Forbedring</span><br>' + NG.md(String(r.forbedring)) }) : null,
        r.misoppfatning && r.misoppfatning !== 'null' ? el('div', { html: '<span class="label">Misoppfatning</span><br>' + NG.md(String(r.misoppfatning)) }) : null,
        el('div', { class: 'small num', text: '+' + xp + ' XP' }),
      ]));
      if (pr.model) out.appendChild(modelBox());
    }

    function selfAssess() {
      out.appendChild(modelBox());
      const pick = el('div', { class: 'stack-s' }, [el('span', { class: 'label', text: 'Egenvurdering: hvor godt traff du?' })]);
      [['Bommet', 0], ['Delvis', 1], ['Godt', 2], ['Presist', 3]].forEach(([n, v]) => pick.appendChild(el('button', { class: 'option', text: n, onclick: () => {
        pick.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        const xp = reward(v, true); if (xp) NG.toast('+' + xp + ' XP');
      } })));
      out.appendChild(pick);
    }
    function modelBox() {
      return el('div', { class: 'card stack-s' }, [
        el('span', { class: 'label', text: 'Rubrikk' }), el('div', { class: 'small', html: NG.md(pr.rubric) }),
        pr.model ? el('span', { class: 'label', text: 'Modellsvar' }) : null, pr.model ? el('div', { class: 'small', html: NG.md(pr.model) }) : null,
      ]);
    }
  });
})();
