/* Mini-spill: Tilbakemeldingsverkstedet (didaktikk). Les et elevsvar med en typisk elevforestilling og sett sammen en
   læringsfremmende tilbakemelding: hva er målet, hvor er eleven nå, og hva er neste steg? Underveisvurdering i praksis. */
(function () {
  'use strict';
  const ID = 'tilbakemeldingsverkstedet';

  NG.css(`
.mg-tilbakemeldingsverkstedet .tv-paper { background: #f4efd6; color: #24302b; border-radius: var(--r-m); padding: 12px 14px; font-size: var(--t-s); line-height: 1.45; box-shadow: 0 2px 0 rgba(0,0,0,.25); }
.mg-tilbakemeldingsverkstedet .tv-paper .tv-who { font: 600 var(--t-xs) var(--f-mono); color: #5d6a64; text-transform: uppercase; letter-spacing: .06em; }
.mg-tilbakemeldingsverkstedet .tv-paper .tv-hand { font-family: var(--f-display); font-size: 1.25rem; line-height: 1.25; }
.mg-tilbakemeldingsverkstedet .tv-goal { font-size: var(--t-xs); color: var(--chalk-dim); }
.mg-tilbakemeldingsverkstedet .tv-slot { border-left: 4px solid var(--line-strong); padding: 4px 0 4px 10px; min-height: 1.4em; }
.mg-tilbakemeldingsverkstedet .tv-slot.s0 { border-color: var(--r-stoffer); }
.mg-tilbakemeldingsverkstedet .tv-slot.s1 { border-color: var(--r-liv); }
.mg-tilbakemeldingsverkstedet .tv-slot.s2 { border-color: var(--r-energi); }
.mg-tilbakemeldingsverkstedet .tv-slot.empty { color: var(--chalk-faint); font-style: italic; }
.mg-tilbakemeldingsverkstedet .tv-slot.bad { background: color-mix(in srgb, var(--bad) 12%, transparent); }
.mg-tilbakemeldingsverkstedet .tv-slot.good { background: color-mix(in srgb, var(--good) 12%, transparent); }
`);

  const SLOTS = ['Hvor skal eleven? (mål og kriterier)', 'Hvor er eleven nå? (om arbeidet)', 'Hva er neste steg? (fremovermelding)'];
  // Hver oppgave: elevsvar, mål og tre valg per del. Første valg i hver liste er det læringsfremmende.
  const CASES = [
    {
      who: 'Ida, 8. trinn – energi', goal: 'Forklare varmeoverføring med fagbegreper.',
      text: '«Metallbeinet på stolen føles kaldere enn treplata fordi kulden fra metallet går inn i hånda mi.»',
      myth: 'Kulde som noe som strømmer – det er energien som går fra hånda til metallet.',
      opts: [
        ['Målet er å forklare hvilken vei energien går, og hvorfor noe føles kaldt, med ordene varme og temperatur.', 'Målet er at du kan definisjonene av varme og temperatur utenat og kan gjengi dem riktig på prøven på fredag.', 'Målet er at du jobber godt, er nøye og leverer en fin, ryddig og godt strukturert tekst om energi.'],
        ['Du har sett at metall og tre føles ulikt selv om de har samme temperatur – bra! Men du skriver at «kulden går inn».', 'Du er kjempeflink og har skrevet et veldig fint og gjennomtenkt svar – bare fortsett akkurat sånn videre!', 'Svaret er dessverre feil, fordi kulde ikke kan gå noe sted. Du får derfor 2 av 6 mulige poeng på denne.'],
        ['Skriv setningen på nytt der energi er det som flytter seg: fra hånda til metallet, eller motsatt? Bruk «varmeleder».', 'Les kapitlet om energi en gang til, og skriv et sammendrag på minst en halv side til neste time.', 'Neste gang må du jobbe hardere og konsentrere deg bedre i timen, så klarer du det helt sikkert til slutt.'],
      ],
    },
    {
      who: 'Jonas, 9. trinn – fotosyntese', goal: 'Forklare hvor plantens masse kommer fra.',
      text: '«Treet blir tyngre fordi det henter mat fra jorda gjennom røttene.»',
      myth: 'At planten «spiser» jord – mesteparten av massen kommer fra CO₂ i lufta.',
      opts: [
        ['Målet er å forklare hvilke stoffer planten bygger seg opp av, og knytte det til fotosyntesen.', 'Målet er at du kan alle de viktige ordene fra kapitlet om planter, fotosyntese og celleånding.', 'Målet er å skrive et så langt og utfyllende svar som mulig, med mange fagord og gode eksempler.'],
        ['Det stemmer at røttene tar opp vann og mineraler, men du har ikke med CO₂ fra lufta – der kommer det meste fra.', 'Godt jobba, Jonas! Dette ser veldig bra ut, og jeg ser at du har jobbet skikkelig godt med det.', 'Du har dessverre misforstått hele fotosyntesen, så dette må vi ta helt på nytt sammen neste uke.'],
        ['Skriv likningen for fotosyntesen og marker hva som kommer fra lufta og hva fra jorda. Hvor kommer karbonet fra?', 'Se videoen om fotosyntese på læringsplattformen igjen, og ta gode notater underveis mens du ser.', 'Prøv å være litt mer nøye neste gang, og les nøye gjennom hele svaret ditt før du leverer.'],
      ],
    },
    {
      who: 'Sara, 10. trinn – forsøksrapport', goal: 'Drøfte et resultat med fagbegreper og knytte det til hypotesen.',
      text: '«Resultat: Isbiten i ullsokken smeltet sist. Drøfting: Det var fordi ull er varmt.»',
      myth: 'At ull «er varmt» og gir varme – ull isolerer og bremser energioverføringen begge veier.',
      opts: [
        ['I drøftingen skal du forklare hvorfor resultatet ble som det ble, med fagbegreper, og vurdere hypotesen.', 'Drøftingen skal være minst en halv side lang og ha med minst tre fagord fra kapitlet vi har jobbet med.', 'Drøftingen skal være ryddig, pent skrevet og ha en tydelig overskrift, innledning og avslutning.'],
        ['Resultat og drøfting er godt skilt. I drøftingen står det at ull «er varmt», men sokken hadde romtemperatur.', 'Dette er en fin rapport, og du er tydeligvis veldig flink med forsøk og med å skrive rapporter!', 'Rapporten er grei, men mangler noe i drøftingen. Samlet vurdering av rapporten: 4+ på denne.'],
        ['Bytt ut «ull er varmt» med en forklaring som bruker «isolator»: hva gjør ulla med energien fra lufta?', 'Neste gang bør du skrive mer i drøftingen, så blir rapporten mye bedre og mer fullstendig totalt sett.', 'Se på eksempelrapporten i læreboka og rett opp rapporten din så den ligner mer på den.'],
      ],
    },
    {
      who: 'Emil, 8. trinn – stoffer', goal: 'Bruke partikkelmodellen til å forklare hva som skjer når et stoff løses.',
      text: '«Når jeg rører sukker ut i vann, blir sukkeret borte.»',
      myth: 'At stoff forsvinner når det løses – partiklene spres mellom vannpartiklene, og massen er bevart.',
      opts: [
        ['Målet er å forklare hva som skjer med sukkerpartiklene, og hvordan vi kan vite at sukkeret er der.', 'Målet er at du husker hva ordet oppløsning betyr, og kan skrive definisjonen riktig med egne ord.', 'Målet er at du jobber godt i timen og er aktiv og deltar godt i gruppearbeidet med de andre.'],
        ['Du beskriver riktig det du ser: sukkeret blir usynlig. Men «borte» stemmer ikke – vannet smaker jo søtt.', 'Supert, Emil! Du er en stjerne, og dette svaret viser at du kan dette stoffet veldig godt!', 'Feil. Sukker forsvinner ikke når det løses i vann, så svaret ditt er dessverre ikke riktig her.'],
        ['Tegn sukkerbiten med partikler før og etter. Hvordan kan du vise med en vekt at sukkeret ikke er borte?', 'Øv mer på partikkelmodellen hjemme, for eksempel med alle oppgavene bakerst i kapitlet om stoffer.', 'Spør en medelev hva svaret er, og skriv det riktige svaret inn i boka di før neste time.'],
      ],
    },
  ];
  const WHY = [
    ['', 'Karakter eller prøve er ikke et læringsmål – eleven vet ikke hva hun skal kunne.', 'For generelt: «flinkere i naturfag» sier ikke hva som skal læres.'],
    ['', 'Ros av personen sier ingenting om hva som er bra i arbeidet, og hjelper ikke eleven videre.', 'En dom uten innhold: eleven får ikke vite *hva* som er bra eller *hva* som mangler.'],
    ['', 'For generelt – eleven vet ikke hva hun skal se etter.', 'Handler om innsats, ikke om hva eleven konkret skal gjøre.'],
  ];

  NG.minigames.register({
    id: ID, region: 'didaktikk', title: 'Tilbakemeldingsverkstedet', icon: 'pen',
    concepts: ['di-tilbakemelding', 'di-vfl', 'di-kriterier', 'di-egenvurdering', 'di-elevforestilling'],
    blurb: 'Sett sammen en tilbakemelding som faktisk hjelper eleven videre – mål, nåsituasjon og neste steg.',
    minutes: 3,
    start(root, api) {
      const el = api.el; const rng = api.rng; const d = api.difficulty;
      root.classList.add('mg-' + ID);
      let ended = false;
      let right = 0; let total = 0; const missed = [];
      const cases = rng.shuffle(CASES).slice(0, d === 1 ? 2 : 3);
      let ci = 0;

      const stage = el('div', { class: 'stack' });
      root.append(el('div', { class: 'stack' }, [
        el('div', { class: 'row' }, [el('span', { class: 'chip', text: 'Akademiet · lab' }), el('span', { class: 'chip', text: 'Underveisvurdering' })]),
        el('h2', { class: 'h-display', text: 'Tilbakemeldingsverkstedet' }),
        el('div', { class: 'small', html: api.md('God underveisvurdering svarer på tre spørsmål: **Hvor skal eleven? Hvor er eleven nå? Hva er neste steg?** Velg én setning til hver del.') }),
        stage,
      ]));

      function nextCase() {
        if (ended) return;
        if (ci >= cases.length) { questions(); return; }
        const c = cases[ci++];
        const chosen = [null, null, null];
        const orders = c.opts.map((o) => rng.shuffle(o.map((_, k) => k)));
        stage.innerHTML = '';
        const slots = SLOTS.map((s, k) => el('div', { class: 'tv-slot empty s' + k, text: s }));
        const letter = el('div', { class: 'card stack-s' }, [el('span', { class: 'label', text: 'Din tilbakemelding' }), ...slots]);
        const picker = el('div', { class: 'stack-s' });
        const check = el('button', { class: 'btn primary block', text: 'Gi tilbakemeldingen', disabled: true });
        let part = 0;
        const showPart = () => {
          picker.innerHTML = '';
          if (part >= 3) { picker.append(check); return; }
          picker.append(el('span', { class: 'label', text: `Del ${part + 1} av 3: ${SLOTS[part]}` }));
          orders[part].forEach((k) => picker.append(el('button', { class: 'option', html: api.md(c.opts[part][k]), onclick: () => {
            chosen[part] = k; api.sfx('click');
            slots[part].classList.remove('empty'); slots[part].innerHTML = api.md(c.opts[part][k]);
            part++; showPart();
          } })));
          if (part > 0) picker.append(el('button', { class: 'btn ghost small', text: '← Angre forrige', onclick: () => { part--; chosen[part] = null; slots[part].classList.add('empty'); slots[part].textContent = SLOTS[part]; showPart(); } }));
        };
        check.disabled = false;
        check.onclick = () => {
          api.sfx('click');
          let ok = 0;
          chosen.forEach((k, s) => { total++; if (k === 0) { ok++; right++; slots[s].classList.add('good'); } else { slots[s].classList.add('bad'); missed.push(SLOTS[s].split(' (')[0].toLowerCase()); } });
          api.sfx(ok === 3 ? 'good' : 'bad');
          picker.innerHTML = '';
          const notes = chosen.map((k, s) => (k === 0 ? null : el('div', { class: 'small', html: api.md(`**Del ${s + 1}:** ${WHY[s][k]} Bedre: «${c.opts[s][0]}»`) }))).filter(Boolean);
          picker.append(el('div', { class: 'feedback ' + (ok === 3 ? 'good' : 'bad') + ' stack-s' }, [
            el('div', { class: 'h-display', text: ok === 3 ? 'Læringsfremmende!' : `${ok} av 3 deler treffer` }),
            ...notes,
            el('div', { class: 'small', html: api.md(`**Elevforestillingen bak:** ${c.myth} En god tilbakemelding tar forestillingen på alvor og gir eleven noe konkret å gjøre.`) }),
            el('button', { class: 'btn primary block', text: ci < cases.length ? 'Neste elevsvar' : 'Videre', onclick: () => { api.sfx('click'); nextCase(); } }),
          ]));
        };
        stage.append(
          el('div', { class: 'tv-paper stack-s' }, [el('span', { class: 'tv-who', text: c.who }), el('div', { class: 'tv-hand', text: c.text })]),
          el('div', { class: 'tv-goal', html: api.md('**Læringsmål:** ' + c.goal) }),
          letter, picker,
        );
        showPart();
      }

      function ask(q, after) {
        stage.innerHTML = '';
        const host = el('div', { class: 'card' });
        stage.append(host);
        NG.renderQuestion(host, Object.assign({ id: ID + '.' + total }, q), {
          rng,
          onAnswer: (res) => { total++; if (res.correct) right++; else missed.push(q.miss); },
          onContinue: () => after(),
        });
      }

      function questions() {
        const list = [
          {
            type: 'mc', topic: 'Vurdering', miss: 'ros av personen', level: 3,
            prompt: 'Hvorfor er «Du er så flink!» en svak tilbakemelding, selv om den er hyggelig?',
            options: ['Den handler om personen, ikke om arbeidet – eleven får ikke vite hva som var bra eller hva som er neste steg', 'Fordi elever aldri skal få ros', 'Fordi den er for kort – tilbakemeldinger skal være lange', 'Fordi den bør kombineres med en karakter'],
            answer: 0,
            why: { 1: 'Ros kan være bra – men den bør være knyttet til konkrete sider ved arbeidet.', 2: 'Lengde er ikke poenget; presisjon er det.', 3: 'Karakterer har ofte motsatt effekt: eleven ser på tallet, ikke på kommentaren.' },
            explain: 'Læringsfremmende tilbakemeldinger handler om **oppgaven og prosessen**: hva som er godt, hva som mangler, og hvordan eleven kan forbedre seg. Ros av personen gir lite informasjon.',
          },
          {
            type: 'mc', topic: 'Vurdering', miss: 'elevene må bruke tilbakemeldingen', level: 4,
            prompt: 'Læreren skriver gode kommentarer, men elevene leser dem knapt. Hva er det beste grepet?',
            options: ['Sett av tid i timen der elevene jobber videre med arbeidet ut fra kommentaren', 'Skriv enda lengre og mer detaljerte kommentarer', 'Slutt å skrive kommentarer', 'Gi en karakter i tillegg, så de i alle fall ser noe'],
            answer: 0,
            why: { 1: 'Mer tekst hjelper ikke hvis den ikke blir brukt.', 2: 'Da mister elevene informasjonen helt.', 3: 'Karakteren tar gjerne oppmerksomheten bort fra kommentaren.' },
            explain: 'En tilbakemelding virker først når eleven **bruker** den. Tid til å forbedre arbeidet – og egenvurdering mot kriteriene – gjør eleven aktiv i egen læring.',
          },
        ];
        if (d >= 2) list.push({
          type: 'multi', topic: 'Underveisvurdering', miss: 'prinsippene for underveisvurdering', level: 2,
          prompt: 'Hvilke av disse hører med i god **underveisvurdering**?',
          options: ['Elevene forstår hva de skal lære og hva som er forventet', 'Elevene får vite hva som er bra i arbeidet og hva som kan bli bedre', 'Elevene får råd om hvordan de kan forbedre seg', 'Elevene vurderer selv eget arbeid og egen utvikling', 'Elevene får en karakter på hver innlevering', 'Elevene sammenlignes med de beste i klassen'],
          answer: [0, 1, 2, 3],
          explain: 'Dette er de fire prinsippene for god underveisvurdering: forstå målet, få vite om kvaliteten, få råd om forbedring, og være involvert gjennom **egenvurdering**. Karakterer og sammenligning med andre er ikke en del av dem.',
        });
        let i = 0;
        const go = () => (i < list.length ? ask(list[i++], go) : summary());
        go();
      }

      function summary() {
        if (ended) return;
        ended = true;
        const score = total ? right / total : 0;
        stage.innerHTML = '';
        stage.appendChild(el('div', { class: 'feedback ' + (score >= 0.6 ? 'good' : 'bad') + ' stack-s' }, [
          el('h3', { class: 'h-display', text: `${right} av ${total} riktige` }),
          el('ul', { html: [
            'Tre spørsmål: **Hvor skal eleven? Hvor er eleven nå? Hva er neste steg?**',
            'Vær konkret om **arbeidet** – ikke om personen eller karakteren.',
            'Ta **elevforestillingen** på alvor og gi en oppgave som utfordrer den.',
            'Gi tid til å bruke tilbakemeldingen, og la elevene vurdere seg selv.',
          ].map((x) => '<li>' + api.md(x) + '</li>').join('') }),
        ]));
        api.sfx(score >= 0.6 ? 'win' : 'lose');
        api.done({ score, correct: right, total, notes: 'Tilbakemeldingsverkstedet. ' + (missed.length ? 'Bommet på: ' + [...new Set(missed)].join(', ') + '.' : 'Alt riktig.') });
      }

      nextCase();
      return { destroy() { ended = true; } };
    },
  });
})();
