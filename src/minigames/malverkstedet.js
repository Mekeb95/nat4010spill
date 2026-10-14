/* Mini-spill: Målverkstedet (didaktikk). Planlegg en økt fra et kompetansemål: velg læringsmål som kan
   vurderes, en aktivitet som henger sammen med målet, underveisvurdering og kildebegrunnelse, og sorter
   refleksjonsutsagn i Hva? / Hva så? / Hva nå?. Poeng for sammenheng mål–aktivitet–vurdering. */
(function () {
  'use strict';
  const ID = 'malverkstedet';

  NG.css(`
.mg-malverkstedet { display: flex; flex-direction: column; gap: 12px; }
.mg-malverkstedet .mv-km { border-left: 4px solid var(--r-didaktikk); padding: 10px 12px; background: var(--board-2); border-radius: 0 var(--r-m) var(--r-m) 0; }
.mg-malverkstedet .mv-km q { font-style: italic; }
.mg-malverkstedet .mv-chain { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 4px; align-items: center; }
.mg-malverkstedet .mv-link { text-align: center; padding: 6px 4px; border-radius: 10px; border: 2px dashed var(--line-strong); font-size: var(--t-xs); color: var(--chalk-faint); font-weight: 700; }
.mg-malverkstedet .mv-link.on { border-style: solid; border-color: var(--good); color: var(--good); background: color-mix(in srgb, var(--good) 12%, transparent); }
.mg-malverkstedet .mv-link.off { border-style: solid; border-color: var(--bad); color: var(--bad); }
.mg-malverkstedet .mv-arrow { color: var(--chalk-faint); font-weight: 700; }
.mg-malverkstedet .mv-arrow.on { color: var(--good); }
.mg-malverkstedet .mv-step { font-family: var(--f-mono); font-size: var(--t-xs); color: var(--r-didaktikk); text-transform: uppercase; letter-spacing: 0.08em; }
.mg-malverkstedet .mv-box { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 10px; border: 2px solid var(--chalk-dim); border-radius: 4px; vertical-align: -0.15em; }
.mg-malverkstedet .option.selected .mv-box { background: var(--warn); border-color: var(--warn); }
.mg-malverkstedet .mv-row { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border-radius: var(--r-m); border: 2px solid var(--line); background: var(--board-2); }
.mg-malverkstedet .mv-row.correct { border-color: var(--good); }
.mg-malverkstedet .mv-row.wrong { border-color: var(--bad); }
.mg-malverkstedet .mv-segs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.mg-malverkstedet .mv-seg { min-height: 44px; padding: 4px 6px; border-radius: 10px; border: 2px solid var(--line-strong); background: var(--board); color: var(--chalk-dim); font-weight: 700; font-size: var(--t-s); cursor: pointer; touch-action: manipulation; }
.mg-malverkstedet .mv-seg.on { background: var(--chalk); color: var(--board); border-color: var(--chalk); }
.mg-malverkstedet .mv-seg.want { border-color: var(--good); color: var(--good); }
.mg-malverkstedet .mv-seg:disabled { cursor: default; }
.mg-malverkstedet .mv-pill { color: var(--r-didaktikk); border-color: color-mix(in srgb, var(--r-didaktikk) 50%, transparent); }
.mg-malverkstedet .mv-why { font-size: var(--t-xs); color: var(--chalk-dim); }
`);

  const SETS = [
    {
      id: 'energi', trinn: 'etter 7. trinn', km: 'utforske og beskrive hvordan energi omdannes …', topic: 'energiomdanning',
      goals: [
        { t: 'Jeg kan tegne en energikjede for en lommelykt og vise hvor energien omdannes.', ok: true },
        { t: 'Jeg kan forklare hvorfor energien ikke forsvinner selv om batteriet blir «tomt».', ok: true },
        { t: 'Jeg skal forstå energi og hvordan energi fungerer i hverdagen.', why: 'Vagt: hva betyr «forstå», og hvordan skal det vises? Bruk verb som kan observeres: tegne, forklare, sammenligne.' },
        { t: 'Jeg skal bli mer interessert i energi og synes det er gøy.', why: 'Interesse er verdifullt, men det er ikke et faglig læringsmål som kan vurderes.' },
        { t: 'Vi skal jobbe med kapittel 4 om energi i læreboka.', why: 'Dette beskriver en aktivitet, ikke hva elevene skal lære.' },
      ],
      act: [
        { t: 'Elevene undersøker lommelykt, vannkoker og leketøysbil, tegner energikjeder og diskuterer i par hvor energien blir av.', ok: true },
        { t: 'Elevene ser en film om vannkraftverk og svarer etterpå på fem faktaspørsmål om hvordan kraftverket er bygd opp og drives.', why: 'Passivt, og det trener mest gjenkjenning. Elevene tegner ikke selv kjeder og forklarer ikke omdanninger.' },
        { t: 'Elevene lager plakat om favorittdyret sitt og regner ut hvor mange kalorier det trenger hver dag.', why: 'Aktivitetsjag: det er engasjerende, men målet om omdanning i energikjeder blir knapt trent.' },
      ],
      ass: [
        { t: 'Exit-lapp: tegn energikjeden for en vannkoker og marker hvor energien havner. Svarene styrer neste time.', ok: true },
        { t: 'Kapittelprøve med karakter etter fire uker, der elevene får tilbake prøven med poengsum og en kort kommentar.', why: 'Dette er summativ vurdering, og den kommer sent. Den gir ikke informasjon du kan bruke underveis.' },
        { t: 'Du avslutter timen med å spørre klassen: «Har alle forstått nå?», og går videre til neste tema hvis ingen rekker opp hånda.', why: 'Det gir ingen evidens. Elever som ikke har forstått, sier sjelden fra i plenum.' },
      ],
      src: [
        { t: 'Henriksen & Angell (2019): mange elever tror energi «brukes opp». Energikjeder gjør bevaring synlig.', ok: true },
        { t: 'Det er en morsom og variert aktivitet som elevene i klassen min liker godt, og de jobber godt sammen i par.', why: 'Motivasjon er viktig, men dette er ingen fagdidaktisk begrunnelse, og det mangler kilde.' },
        { t: 'Slik lærte jeg det selv på ungdomsskolen, og det fungerte fint for meg og de fleste andre i klassen min den gangen.', why: 'Egen erfaring er ikke en kildebasert begrunnelse.' },
      ],
      refl: [
        { t: 'Seks elever skrev på exit-lappen at energien «forsvant».', b: 0 },
        { t: 'Parsamtalene om vannkokeren tok dobbelt så lang tid som planlagt.', b: 0 },
        { t: 'Det tyder på at forestillingen «energi brukes opp» lever videre, slik Henriksen & Angell beskriver.', b: 1 },
        { t: 'Tidsbruken viser at elevene trengte mer tid til å sette ord på omdanningene.', b: 1 },
        { t: 'Neste time starter jeg med en grubletegning om batteriet for å utfordre forestillingen.', b: 2 },
        { t: 'Jeg kutter ett av de tre apparatene og gir mer tid til samtalen.', b: 2 },
      ],
    },
    {
      id: 'arstider', trinn: 'etter 7. trinn', km: '… hvordan bevegelsene til jorda og månen gir dag og natt, månefaser og årstider', topic: 'årstider',
      goals: [
        { t: 'Jeg kan bruke lampe og globus til å vise hvorfor det er sommer i Norge når det er vinter i Australia.', ok: true },
        { t: 'Jeg kan forklare hvorfor dagene i Norge er lengre om sommeren enn om vinteren.', ok: true },
        { t: 'Jeg skal lære mye om verdensrommet, sola og planetene.', why: 'Vagt og uten observerbart verb. Hva skal eleven kunne gjøre?' },
        { t: 'Jeg kan ramse opp navnene på de åtte planetene i rekkefølge.', why: 'Dette kan vurderes, men det henger ikke sammen med kompetansemålet om årstider. Det er ren gjengivelse.' },
        { t: 'Vi skal gå ut og se på stjernehimmelen en kveld.', why: 'Dette beskriver en aktivitet, ikke hva elevene skal lære.' },
      ],
      act: [
        { t: 'Elevene modellerer årstidene med lampe og globus med skrå akse, og sammenligner hvor lenge «Norge» er belyst.', ok: true },
        { t: 'Elevene leser en faktatekst om solsystemet og lager en tidslinje over de viktigste hendelsene i romfartens historie.', why: 'Det er faglig innhold, men det trener ikke forklaringen på årstider (aksehelning, solhøyde, dagslengde).' },
        { t: 'Elevene tegner og fargelegger det fineste bildet de klarer av sola og planetene, og henger det opp i gangen.', why: 'Aktivitetsjag: det er hyggelig, men det har ingen kobling til målet.' },
      ],
      ass: [
        { t: 'Elevene forklarer med globusen til en medelev etter kriterier (akse, solhøyde, dagslengde). Læreren gir fremovermelding.', ok: true },
        { t: 'Elevene tar en flervalgsprøve om planetenes navn, størrelse og avstand fra sola, og får tilbake poengsum.', why: 'Prøven vurderer noe annet enn målet, og poeng alene gir lite fremovermelding.' },
        { t: 'Læreren spør høyt i klassen: «Har alle skjønt årstidene nå?», og går videre til neste tema i boka hvis det er helt stille.', why: 'Det gir ingen evidens for hva elevene faktisk kan forklare.' },
      ],
      src: [
        { t: 'Myten «sommer fordi jorda er nærmere sola» er utbredt. En fysisk modell lar elevene teste forklaringen (jf. Nøkkelbegreper, kap. 9).', ok: true },
        { t: 'Skolen har mange globuser og lamper stående på naturfagrommet, så aktiviteten er billig, rask å rigge og enkel å gjennomføre.', why: 'Praktiske hensyn er greie, men de begrunner ikke valget fagdidaktisk, og det mangler kilde.' },
        { t: 'Jeg så et veldig fint klipp om årstidene på sosiale medier i helgen, og det hadde mange tusen visninger.', why: 'Popularitet er ikke en faglig kilde. Begrunnelsen bør bygge på forskning eller pensum.' },
      ],
      refl: [
        { t: 'Flere grupper holdt globusen rett opp, uten skrå akse.', b: 0 },
        { t: 'Tre grupper sa at «Norge» fikk mest lys når globusen var nærmest lampa.', b: 0 },
        { t: 'Uten skrå akse fungerer ikke modellen, så elevene så ikke koblingen mellom akse og dagslengde.', b: 1 },
        { t: 'Det tyder på at avstandsmyten styrte hvordan de tolket modellen.', b: 1 },
        { t: 'Før neste gang fester jeg aksen i 23° med en pinne i leire.', b: 2 },
        { t: 'Jeg lar elevene sammenligne med ekte data: jorda er nærmest sola i januar.', b: 2 },
      ],
    },
    {
      id: 'programmering', trinn: 'etter 10. trinn', km: 'bruke programmering til å utforske naturfaglige fenomener', topic: 'simulering',
      goals: [
        { t: 'Jeg kan endre en parameter i en simulering av avkjøling og forklare hvordan kurven endrer seg.', ok: true },
        { t: 'Jeg kan peke på to forenklinger i simuleringen og si hvordan de påvirker resultatet.', ok: true },
        { t: 'Jeg skal bli god i programmering og forstå hvordan datamaskiner fungerer.', why: 'Vagt, og det mangler den naturfaglige delen: å utforske et fenomen.' },
        { t: 'Jeg skal lære meg alle kommandoene i Python.', why: 'Programmeringsspråket er et verktøy. Målet må handle om fenomenet som utforskes.' },
        { t: 'Vi skal bruke datamaskinene i to skoletimer.', why: 'Dette beskriver en aktivitet, ikke hva elevene skal lære.' },
      ],
      act: [
        { t: 'Elevene måler avkjølingen av en kopp vann, programmerer en enkel modell og justerer k til den passer med målingene.', ok: true },
        { t: 'Elevene programmerer et eget dataspill med poeng og liv, og velger selv tema og figurer for spillet.', why: 'Det er god programmeringstrening, men uten et naturfaglig fenomen å utforske.' },
        { t: 'Elevene skriver av en ferdig kode fra tavla, kjører den og leverer et skjermbilde av resultatet til læreren etter timen.', why: 'Avskrift gir lite utforsking. Elevene tester verken prediksjoner eller modellen.' },
      ],
      ass: [
        { t: 'Elevene leverer en graf (modell mot måling) og forklarer avviket kort. Læreren gir tilbakemelding før neste økt.', ok: true },
        { t: 'Koden vurderes etter om den kjører uten feilmeldinger, om variablene har fornuftige navn, og om koden er ryddig og kommentert.', why: 'Det vurderer programmering, ikke om eleven har brukt programmet til å utforske fenomenet.' },
        { t: 'Elevene fyller ut et skjema der de krysser av for hvor gøy de syntes det var å programmere denne uka.', why: 'Det sier noe om motivasjon, men gir ingen evidens for læringsmålet.' },
      ],
      src: [
        { t: 'Simuleringer lar elevene teste og vurdere modeller, i tråd med pensumboka Programmering i skolen og modellmålet i LK20.', ok: true },
        { t: 'Alle elever trenger koding i fremtidens arbeidsliv, og derfor bør vi bruke så mye tid som overhodet mulig på det i alle fag.', why: 'Det er en generell begrunnelse, ikke naturfagdidaktisk, og den mangler kilde.' },
        { t: 'Det står i læreplanen at elevene skal programmere, så da må vi gjøre det i naturfag også, uansett hvordan.', why: 'Kompetansemålet sier at programmering skal brukes til å *utforske fenomener*. Begrunnelsen må forklare hvorfor valget fremmer læring.' },
      ],
      refl: [
        { t: 'De fleste gruppene fikk koden til å kjøre, men få kommenterte avviket fra målingene.', b: 0 },
        { t: 'Én gruppe så at målingene falt raskere i starten enn modellen.', b: 0 },
        { t: 'Arbeidet med å få koden til å virke tok fokus, så naturfaget kom i bakgrunnen.', b: 1 },
        { t: 'Funnet åpnet for en diskusjon om fordamping, som modellen ikke tar med.', b: 1 },
        { t: 'Neste gang gir jeg ferdig kode og bruker tiden på å teste prediksjoner.', b: 2 },
        { t: 'Jeg lar gruppen presentere funnet sitt som start på en samtale om modellens begrensninger.', b: 2 },
      ],
    },
  ];
  const BUCKETS = ['Hva?', 'Hva så?', 'Hva nå?'];
  const BUCKET_DESC = ['beskriv hva som skjedde', 'tolk og forklar, gjerne med teori', 'konsekvens for neste gang'];

  NG.minigames.register({
    id: ID, region: 'didaktikk', title: 'Målverkstedet', icon: 'target',
    concepts: ['di-laeringsmal', 'di-kompetansemal', 'di-mal-aktivitet', 'di-vfl', 'di-kildebegrunnelse', 'di-refleksjonsmodellen'],
    blurb: 'Planlegg en naturfagøkt med rød tråd fra mål via aktivitet til vurdering, og reflekter med Hva? Hva så? Hva nå?',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const md = api.md;
      const sfx = (n) => { try { if (api.sfx) api.sfx(n); } catch (e) { /* valgfritt */ } };
      const S = rng.pick(SETS);
      const res = { goals: 0, act: false, ass: false, src: false, refl: 0 };
      const wrap = el('div', { class: 'mg-malverkstedet' });
      root.appendChild(wrap);

      function header(sub) {
        return el('div', { class: 'stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Akademiet · undervisningsplan' }), el('span', { class: 'spacer' }), el('span', { class: 'chip mv-pill', text: sub })]),
          el('h2', { class: 'h-display', text: 'Målverkstedet' }),
        ]);
      }
      function kmBox() {
        return el('div', { class: 'mv-km small stack-s' }, [
          el('div', { class: 'label', text: 'Kompetansemål, naturfag ' + S.trinn }),
          el('div', { html: 'Elevene skal kunne <q>' + md(S.km) + '</q>' }),
          el('div', { class: 'mv-why', text: 'Gjengitt tett på LK20, og noen mål er forkortet. Sjekk den fulle ordlyden på udir.no når du skriver en ekte plan.' }),
        ]);
      }
      function chain() {
        const g = res.goals >= 1 ? 'on' : (stepNo > 1 ? 'off' : '');
        const a = res.act ? 'on' : (stepNo > 2 ? 'off' : '');
        const v = res.ass ? 'on' : (stepNo > 3 ? 'off' : '');
        return el('div', { class: 'mv-chain', 'aria-label': 'Rød tråd' }, [
          el('div', { class: 'mv-link ' + g, text: 'Mål' }), el('span', { class: 'mv-arrow' + (g === 'on' && a === 'on' ? ' on' : ''), text: '→' }),
          el('div', { class: 'mv-link ' + a, text: 'Aktivitet' }), el('span', { class: 'mv-arrow' + (a === 'on' && v === 'on' ? ' on' : ''), text: '→' }),
          el('div', { class: 'mv-link ' + v, text: 'Vurdering' }),
        ]);
      }
      let stepNo = 1;
      function frame(sub, title) {
        wrap.innerHTML = '';
        wrap.appendChild(header(sub));
        wrap.appendChild(kmBox());
        wrap.appendChild(chain());
        wrap.appendChild(el('div', { class: 'mv-step', text: title }));
      }
      function nextBtn(label, fn, host) {
        const b = el('button', { class: 'btn primary block', id: 'mv-next', text: label, onclick: () => { sfx('click'); fn(); } });
        (host || wrap).appendChild(b);
        try { b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* */ }
      }

      /* 1: læringsmål (velg to) */
      function stepGoals() {
        stepNo = 1;
        frame('1/5 · Læringsmål', 'Steg 1 · Velg de TO læringsmålene som kan vurderes');
        wrap.appendChild(el('div', { class: 'small muted', text: 'Et godt læringsmål sier hva eleven skal kunne gjøre, slik at du kan se det. Det skal også henge sammen med kompetansemålet.' }));
        const picked = new Set();
        const items = rng.shuffle(S.goals);
        const btns = items.map((g) => {
          const b = el('button', { class: 'option small', html: '<span class="mv-box"></span>' + md(g.t) });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            sfx('click');
            if (picked.has(g)) { picked.delete(g); b.classList.remove('selected'); }
            else if (picked.size < 2) { picked.add(g); b.classList.add('selected'); }
            check.disabled = picked.size !== 2;
          });
          wrap.appendChild(b);
          return { b, g };
        });
        const fb = el('div', { class: 'stack' });
        const check = el('button', { class: 'btn primary block', id: 'mv-check', text: 'Sjekk', disabled: true });
        check.addEventListener('click', () => {
          if (check.disabled) return;
          check.remove();
          let hit = 0;
          btns.forEach(({ b, g }) => {
            b.disabled = true;
            b.classList.remove('selected');
            if (g.ok) b.classList.add('correct');
            else if (picked.has(g)) b.classList.add('wrong');
            else b.classList.add('dim');
            if (g.ok && picked.has(g)) hit++;
          });
          res.goals = hit / 2;
          sfx(hit === 2 ? 'good' : 'bad');
          const wrongs = [...picked].filter((g) => !g.ok);
          fb.appendChild(el('div', { class: 'feedback small ' + (hit === 2 ? 'good' : 'bad'), html: md((hit === 2 ? '**Begge holder.** ' : '**' + hit + ' av 2.** ') +
            'De gode målene har et observerbart verb (*tegne, forklare, vise, peke på*) og ligger tett på kompetansemålet.' +
            (wrongs.length ? '\n' + wrongs.map((g) => '• ' + g.why).join('\n') : '')) }));
          stepNo = 2;
          nextBtn('Velg aktivitet', stepAct, fb);
        });
        wrap.append(check, fb);
      }

      /* 2–4: én-valg */
      function single(no, sub, title, intro, list, key, nextLabel, nextFn, goodText) {
        stepNo = no;
        frame(sub, title);
        if (intro) wrap.appendChild(el('div', { class: 'small muted', text: intro }));
        const fb = el('div', { class: 'stack' });
        const btns = [];
        rng.shuffle(list).forEach((o) => {
          const b = el('button', { class: 'option small', html: md(o.t) });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            btns.forEach((x) => { x.b.disabled = true; if (x.o.ok) x.b.classList.add('correct'); else if (x.b !== b) x.b.classList.add('dim'); });
            if (!o.ok) b.classList.add('wrong');
            res[key] = !!o.ok;
            sfx(o.ok ? 'good' : 'bad');
            stepNo = no + 1;
            const ch = wrap.querySelector('.mv-chain');
            if (ch) ch.replaceWith(chain());
            fb.appendChild(el('div', { class: 'feedback small ' + (o.ok ? 'good' : 'bad'), html: md(o.ok ? goodText : '**Svakere valg.** ' + o.why + '\n' + goodText) }));
            nextBtn(nextLabel, nextFn, fb);
          });
          btns.push({ b, o });
          wrap.appendChild(b);
        });
        wrap.appendChild(fb);
      }
      function stepAct() {
        single(2, '2/5 · Aktivitet', 'Steg 2 · Hvilken aktivitet henger sammen med målene?', 'Spør: Hva gjør elevene, og trener det akkurat det målet sier?',
          S.act, 'act', 'Velg vurdering', stepAss,
          'Den beste aktiviteten lar elevene **gjøre det målet beskriver**. Sammenhengen mellom mål og aktivitet er et eget vurderingskriterium i oppgavene i emnet.');
      }
      function stepAss() {
        single(3, '3/5 · Vurdering', 'Steg 3 · Hvilken underveisvurdering passer?', 'Vurdering for læring: få evidens for hva elevene kan, og bruk den til å justere undervisningen.',
          S.ass, 'ass', 'Velg begrunnelse', stepSrc,
          'God underveisvurdering gir **evidens** knyttet til læringsmålet, gir eleven fremovermelding og hjelper læreren å planlegge neste steg.');
      }
      function stepSrc() {
        single(4, '4/5 · Begrunnelse', 'Steg 4 · Hvilken begrunnelse holder fagdidaktisk?', 'Fagdidaktiske valg skal begrunnes med kilder, altså forskning eller pensum, ikke bare erfaring eller praktiske hensyn.',
          S.src, 'src', 'Til refleksjonen', stepRefl,
          'En god begrunnelse kobler valget til **kunnskap om elevers læring** og viser til en kilde.');
      }

      /* 5: Hva? Hva så? Hva nå? */
      function stepRefl() {
        stepNo = 5;
        frame('5/5 · Refleksjon', 'Steg 5 · Sorter utsagnene etter timen');
        wrap.appendChild(el('div', { class: 'small muted', html: BUCKETS.map((b, i) => '<strong>' + b + '</strong> ' + BUCKET_DESC[i]).join(' · ') }));
        const picks = {};
        const items = rng.shuffle(S.refl);
        const rows = items.map((it, idx) => {
          const segs = BUCKETS.map((bn, bi) => {
            const s = el('button', { class: 'mv-seg', text: bn, 'aria-pressed': 'false' });
            s.addEventListener('click', () => {
              if (s.disabled) return;
              sfx('click');
              picks[idx] = bi;
              segs.forEach((x, j) => { x.classList.toggle('on', j === bi); x.setAttribute('aria-pressed', j === bi ? 'true' : 'false'); });
              check.disabled = Object.keys(picks).length !== items.length;
            });
            return s;
          });
          const row = el('div', { class: 'mv-row' }, [el('div', { class: 'small', text: it.t }), el('div', { class: 'mv-segs' }, segs)]);
          wrap.appendChild(row);
          return { row, segs, it, idx };
        });
        const fb = el('div', { class: 'stack' });
        const check = el('button', { class: 'btn primary block', id: 'mv-check', text: 'Sjekk', disabled: true });
        check.addEventListener('click', () => {
          if (check.disabled) return;
          check.remove();
          let ok = 0;
          rows.forEach(({ row, segs, it, idx }) => {
            const good = picks[idx] === it.b;
            if (good) ok++;
            row.classList.add(good ? 'correct' : 'wrong');
            segs.forEach((s, j) => { s.disabled = true; if (j === it.b && !good) s.classList.add('want'); });
          });
          res.refl = ok / items.length;
          sfx(ok === items.length ? 'good' : 'bad');
          fb.appendChild(el('div', { class: 'feedback small ' + (ok === items.length ? 'good' : 'bad'), html: md('**' + ok + ' av ' + items.length + ' riktig.** *Hva?* beskriver observasjoner uten tolkning. *Hva så?* tolker dem og kobler til teori, for eksempel elevforestillinger. *Hva nå?* er konkrete endringer i neste undervisning.') }));
          nextBtn('Se oppsummering', renderSummary, fb);
        });
        wrap.append(check, fb);
      }

      /* Oppsummering */
      let result = null;
      function renderSummary() {
        const parts = [res.goals, res.act ? 1 : 0, res.ass ? 1 : 0, res.src ? 1 : 0, res.refl];
        const red = res.goals >= 1 && res.act && res.ass;
        const score = Math.round(NG.clamp(parts.reduce((a, b) => a + b, 0) / 5, 0, 1) * 100) / 100;
        const correct = (res.goals === 1 ? 1 : 0) + (res.act ? 1 : 0) + (res.ass ? 1 : 0) + (res.src ? 1 : 0) + (res.refl === 1 ? 1 : 0);
        result = {
          score, correct, total: 5,
          notes: `Planla økt om ${S.topic} (${S.trinn}): læringsmål ${Math.round(res.goals * 2)}/2, aktivitet ${res.act ? 'ok' : 'feil'}, vurdering ${res.ass ? 'ok' : 'feil'}, kildebegrunnelse ${res.src ? 'ok' : 'feil'}, refleksjon ${Math.round(res.refl * 100)} %. ${red ? 'Rød tråd mål–aktivitet–vurdering.' : 'Brudd i rød tråd mål–aktivitet–vurdering.'}`,
        };
        stepNo = 6;
        wrap.innerHTML = '';
        wrap.appendChild(header('Oppsummering'));
        wrap.appendChild(chain());
        wrap.appendChild(el('div', { class: 'card stack-s' }, [
          el('div', { class: 'row' }, [el('span', { class: 'label', text: 'Resultat' }), el('span', { class: 'spacer' }), el('span', { class: 'num', text: Math.round(score * 100) + ' %' })]),
          el('div', { class: 'bar' }, [el('i', { style: { width: Math.round(score * 100) + '%', background: 'var(--r-didaktikk)' } })]),
          el('div', { class: 'small', text: `Mål ${Math.round(res.goals * 2)}/2 · aktivitet ${res.act ? '✓' : '✗'} · vurdering ${res.ass ? '✓' : '✗'} · kilde ${res.src ? '✓' : '✗'} · refleksjon ${Math.round(res.refl * 100)} %` }),
          el('div', { class: 'small', html: md(red ? '**Rød tråd!** Målet, aktiviteten og vurderingen henger sammen.' : 'Den røde tråden brister et sted. Sjekk at aktiviteten trener målet, og at vurderingen gir evidens for nettopp det.') }),
        ]));
        wrap.appendChild(el('div', { class: 'feedback small', html: md(
          '**Læringspoenget**\n' +
          'Start i kompetansemålet, og formuler læringsmål som **kan vurderes**, med observerbare verb. Velg en aktivitet som faktisk trener målet. Planlegg **underveisvurdering** som gir evidens og fremovermelding. ' +
          'Begrunn de fagdidaktiske valgene **med kilder**. Etterpå reflekterer du systematisk: *Hva?* (beskrivelse) → *Hva så?* (tolkning med teori) → *Hva nå?* (endring). Sammenhengen mål–aktivitet–vurdering er et eget vurderingskriterium i NAT4010.') }));
        wrap.appendChild(el('button', { class: 'btn primary block', id: 'mv-finish', text: 'Fullfør', onclick: () => { sfx('win'); finish(); } }));
      }
      function finish() {
        if (api.finished) return;
        api.done(result);
        const b = wrap.querySelector('#mv-finish');
        if (b) { b.disabled = true; b.textContent = 'Fullført'; }
      }

      stepGoals();
      return { destroy() { /* ingen timere */ } };
    },
  });
})();
