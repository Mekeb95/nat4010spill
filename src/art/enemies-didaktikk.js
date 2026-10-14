/* Fiendegrafikk — Akademiet (didaktikk). Krittegning på tavle, viewBox 0 0 120 120. */
(function () {
  'use strict';
  const R = 'var(--r-didaktikk)';
  // Hver figur får egen <svg>. SVG-interne id-er (gradienter) prefikses med figur-id.
  const add = (id, b) => NG.art.add(id, `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`);
  const f = (o, c) => `fill="${c || R}" fill-opacity="${o == null ? 0.32 : o}"`;
  const eye = (x, y, r, px, py) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (px || 0)}" cy="${y + (py || 0)}" r="${(r * 0.5).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const shadow = (rx, cx) => `<ellipse cx="${cx || 60}" cy="111" rx="${rx || 30}" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>`;
  const spark = (x, y, s) => `<path d="M${x} ${y - s}v${2 * s}M${x - s} ${y}h${2 * s}" stroke-width="2.5"/>`;
  const spiral = (x, y) => `<path d="M${x} ${y}a1.6 1.6 0 1 1 2 1.2 3.4 3.4 0 1 1-5-3.8" stroke="var(--board)" stroke-width="1.8"/>`;
  const wordBlock = (x, y, w, r) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="2" fill="var(--chalk)" fill-opacity=".6" stroke="none"${r ? ` transform="rotate(${r} ${x} ${y})"` : ''}/>`;

  /* Pugghuggeren: hakkespett som hakker definisjoner inn i et kortstokk — glassaktige spiraløyne, null forståelse. */
  add('pugghuggeren', `${shadow(38, 56)}
<rect x="84" y="52" width="28" height="40" rx="2" ${f(0.12, 'var(--chalk)')} stroke-width="2.5" transform="rotate(6 98 72)"/>
<rect x="80" y="48" width="28" height="40" rx="2" ${f(0.2, 'var(--chalk)')} stroke-width="3"/>
<path d="M86 58h16M86 66h12M86 74h16M86 82h8" stroke="var(--chalk-dim)" stroke-width="2"/>
<circle cx="84" cy="44" r="1.8" fill="var(--board)" stroke="none"/><circle cx="90" cy="52" r="1.8" fill="var(--chalk)" stroke="none"/>
<path d="M42 96v12M52 94v14M38 108h8M48 108h8" stroke-width="3"/>
<path d="M30 90l-12 18M34 94l-6 14" stroke-width="3"/>
<ellipse cx="44" cy="74" rx="19" ry="24" transform="rotate(-15 44 74)" ${f(0.36)}/>
<path d="M50 60q8 14 0 32" ${f(0.25, 'var(--chalk)')} stroke-width="2.5"/>
<path d="M34 62q-8 16 6 26" ${f(0.5)} stroke-width="3"/>
<path d="M42 28l-4-12 8 6 2-12 6 10 4-8 2 10" ${f(0.6, 'var(--bad)')} stroke-width="3"/>
<circle cx="52" cy="40" r="14" ${f(0.42)}/>
<path d="M64 36l22 4-22 6Z" ${f(0.6, 'var(--warn)')} stroke-width="3"/>
<circle cx="54" cy="36" r="5" fill="var(--chalk)" stroke="none"/>${spiral(54, 36)}
<path d="M90 30l4-4M92 40l6 0M90 50l4 4" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<rect x="100" y="22" width="6" height="4" fill="var(--chalk)" fill-opacity=".6" stroke="none" transform="rotate(20 100 22)"/><rect x="108" y="38" width="5" height="4" fill="var(--chalk)" fill-opacity=".6" stroke="none"/>
<path d="M22 22a12 12 0 1 1 6 14" stroke="var(--chalk-dim)" stroke-width="2.5"/><path d="M24 31l4 5-6 1" stroke="var(--chalk-dim)" stroke-width="2.5"/>`);

  /* Ordflommen: en flodbølge av nye ord — en liten elevhånd stikker opp av flommen. */
  add('ordflommen', `<path d="M4 108q10-4 20 0t20 0 20 0 20 0 20 0 20 0" stroke="${R}" stroke-width="2.5"/>
<path d="M6 106C8 76 22 44 52 30c24-10 52-4 58 18 4 14-10 24-20 16-6-6-2-14 6-12-2-8-14-12-24-6-14 8-16 34-2 60Z" ${f(0.34)}/>
${wordBlock(18, 92, 12)}${wordBlock(34, 98, 10)}${wordBlock(16, 80, 8)}${wordBlock(28, 50, 10, -30)}${wordBlock(44, 40, 12, -18)}${wordBlock(60, 60, 8, -60)}${wordBlock(58, 88, 9)}
${eye(34, 66, 6, 2, 0)}${eye(50, 62, 6, 2, 0)}
<path d="M28 58l9-2M46 54l9 2" stroke-width="3"/>
<ellipse cx="43" cy="82" rx="7" ry="6" fill="var(--board)" stroke-width="3"/>
${wordBlock(96, 18, 10, 20)}${wordBlock(108, 30, 8, 60)}${wordBlock(80, 10, 9, -10)}${wordBlock(112, 12, 6, 40)}${wordBlock(70, 20, 7, -30)}
<path d="M96 108v-14M92 98l-2-6M96 94v-6M100 94l2-6M103 98l4-4" stroke-width="3"/>
<path d="M84 96q-4-4-2-8M110 92q4-2 4-6" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Beskriveren: ramser opp alt den ser på en endeløs liste — men forklaringspæra er slukket. */
  add('beskriveren', `${shadow(48)}
<path d="M58 48h32v56H58Z" ${f(0.16, 'var(--chalk)')} stroke-width="3"/>
<path d="M90 104h18q6 0 6-5t-6-5h-4" stroke-width="3"/>
<path d="M56 46h36v-5H56Z" ${f(0.4)} stroke-width="3"/>
<g stroke-width="2.5"><path d="M64 56v0M64 64v0M64 72v0M64 80v0M64 88v0M64 96v0" stroke-width="4"/><path d="M70 56h14M70 64h12M70 72h14M70 80h10M70 88h14M70 96h12" stroke="var(--chalk-dim)" stroke-width="2"/></g>
<path d="M28 104v-8M40 104v-8"/>
<ellipse cx="34" cy="78" rx="18" ry="20" ${f(0.34)}/>
<path d="M50 72q6-6 8-14M18 72q-8 6-6 14"/>
<path d="M58 58l6-2" stroke-width="3"/>
<circle cx="34" cy="38" r="16" ${f(0.38)}/>
${eye(28, 36, 4, 1.5, 0)}${eye(42, 36, 4, 1.5, 0)}
<circle cx="42" cy="36" r="7" stroke-width="2.5"/><path d="M48 40q4 8 2 14" stroke="var(--chalk-dim)" stroke-width="1.5"/>
<path d="M26 47q8 6 14 0" fill="var(--board)" stroke-width="3"/>
<path d="M14 26q-6-2-8 2M10 36q-6 0-6 4" stroke="var(--chalk-dim)" stroke-width="2"/>
<circle cx="100" cy="18" r="10" stroke="var(--chalk-faint)" stroke-width="3" stroke-dasharray="4 4"/>
<path d="M95 30h10M96 34h8" stroke="var(--chalk-faint)" stroke-width="3"/>
<path d="M97 15q0-4 3-4t3 3-3 4v2M100 24v0" stroke="var(--chalk-faint)" stroke-width="2.5"/>
<path d="M86 8l-4-4M114 8l4-4" stroke="var(--chalk-faint)" stroke-width="2" stroke-dasharray="2 3"/>`);

  /* Aktivitetsjageren: løper etter alt som glitrer med sommerfuglhåv — blinken (læringsmålet) står glemt bak. */
  add('aktivitetsjageren', `${shadow(36, 62)}
<circle cx="16" cy="42" r="13" stroke="var(--chalk-faint)" stroke-width="3"/><circle cx="16" cy="42" r="7" stroke="var(--chalk-faint)" stroke-width="3"/><circle cx="16" cy="42" r="2" fill="var(--chalk-faint)" stroke="none"/>
<path d="M4 30l10 10M4 38q6 0 8-6M10 29q0 6 6 6" stroke="var(--chalk-faint)" stroke-width="1.2"/>
<path d="M16 56v40" stroke="var(--chalk-faint)" stroke-width="3"/>
<path d="M36 56h-10M34 66h-14M36 76h-8" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M54 74l-10 14-8-2M68 76l12 8 2 10"/>
<ellipse cx="60" cy="60" rx="18" ry="17" transform="rotate(-12 60 60)" ${f(0.38)}/>
${eye(60, 52, 6, 2.5, -1)}${eye(73, 50, 6, 2.5, -1)}
<path d="M58 66q8 6 16-2" fill="var(--board)" stroke-width="3"/><path d="M68 68q2 6 5 4" stroke="var(--bad)" stroke-width="3"/>
<path d="M44 52q-4-6-2-10" stroke="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M76 60l26-26" stroke-width="3.5"/>
<path d="M44 66q-8 6-10 12"/>
<circle cx="106" cy="26" r="10" ${f(0.1, 'var(--chalk)')} stroke-width="3"/>
<path d="M99 20l14 12M100 30l12-10M106 16v20" stroke="var(--chalk-dim)" stroke-width="1.5"/>
<path d="M110 56l2 5 5 1-4 3 1 5-4-3-5 3 1-5-4-3 5-1Z" ${f(0.6, 'var(--warn)')} stroke-width="2"/>
<circle cx="88" cy="8" r="5" ${f(0.5, 'var(--r-kropp)')} stroke-width="2"/><path d="M88 13q-2 4 1 8" stroke-width="1.5"/>
<rect x="96" y="74" width="5" height="3" fill="var(--r-liv)" stroke="none" transform="rotate(30 96 74)"/><rect x="110" y="84" width="5" height="3" fill="var(--r-stoffer)" stroke="none" transform="rotate(-20 110 84)"/><rect x="88" y="90" width="5" height="3" fill="var(--warn)" stroke="none"/>`);

  /* Det umålbare målet: en blinkeskive av tåke — linjalen som skal måle den, henger slapt. */
  add('umalbare-malet', `${shadow(40)}
<path d="M24 78C12 78 10 60 24 58c-2-16 16-24 26-14 6-14 28-14 32 0 14-6 26 6 18 18 12 4 8 20-4 18Z" ${f(0.3)}/>
<circle cx="76" cy="58" r="14" stroke="var(--bad)" stroke-width="3" stroke-dasharray="3 5"/>
<circle cx="76" cy="58" r="7" stroke="var(--bad)" stroke-width="3" stroke-dasharray="2 4"/>
<circle cx="76" cy="58" r="2.5" fill="var(--bad)" fill-opacity=".5" stroke="none"/>
${eye(36, 64, 4, 0.5, -1.8)}${eye(50, 63, 4, 0.5, -1.8)}
<path d="M38 72q6 4 12 0" stroke-width="3"/>
<circle cx="31" cy="71" r="2.5" fill="var(--bad)" fill-opacity=".4" stroke="none"/>
<path d="M22 92Q60 82 98 102l-2 6Q60 90 24 99Z" ${f(0.4, 'var(--warn)')} stroke-width="3"/>
<path d="M34 92l1 4M44 90l1 4M54 89v4M64 90l-1 4M74 92l-1 4M84 95l-2 4" stroke-width="2"/>
<path d="M98 102q6-10 2-18" stroke-width="3"/>
<path d="M10 40q6-4 12 0M88 26q6-4 12 0M100 40q4-3 8 0M12 102q4-3 8 0" stroke="var(--chalk-faint)" stroke-width="2.5"/>
<path d="M60 22q0-5 4-5t4 4-4 5v3M64 34v0" stroke="var(--chalk-dim)" stroke-width="3"/>`);

  /* Fasitfanten (elite): et prøveark med sinte øyne, rødpenn-lanse og stoppeklokke — vurdering = karakter. */
  add('fasitfanten', `${shadow(46)}
<path d="M44 104v6h-6M74 104v6h6"/>
<path d="M28 18h50l14 14v72H28Z" ${f(0.22, 'var(--chalk)')}/>
<path d="M78 18v14h14" stroke-width="3"/>
<path d="M36 22q10 6 8 0" stroke="none"/>
${eye(46, 38, 5.5, 1, 1)}${eye(66, 38, 5.5, -1, 1)}
<path d="M38 28l12 6M74 28l-12 6" stroke-width="4"/>
<rect x="46" y="48" width="20" height="8" rx="2" fill="var(--board)" stroke-width="3"/><path d="M51 48v8M56 48v8M61 48v8" stroke-width="1.5"/>
<g stroke-width="2"><path d="M46 68h22M46 78h22M46 88h16" stroke="var(--chalk-dim)"/></g>
<path d="M34 66l6 6M40 66l-6 6M34 86l6 6M40 86l-6 6" stroke="var(--bad)" stroke-width="3"/><path d="M33 78l3 3 5-6" stroke="var(--good)" stroke-width="3"/>
<circle cx="78" cy="88" r="10" stroke="var(--bad)" stroke-width="3"/><path d="M74 92q2-8 4-8t2 4-6 4h8" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M28 60q-12 4-14 14"/>
<circle cx="14" cy="84" r="10" ${f(0.15, 'var(--chalk)')}/><path d="M14 72v-3M10 69h8M14 84l4-5" stroke-width="2.5"/>
<path d="M92 64q8 0 12-8"/>
<path d="M90 92L116 22" stroke-width="10"/><path d="M90 92L116 22" stroke="var(--bad)" stroke-width="5"/>
<path d="M113 30l7-14-1 15Z" ${f(0.8, 'var(--chalk)')} stroke-width="2"/>
<path d="M100 18l-4-4M108 12l-1-5" stroke="var(--bad)" stroke-width="2.5"/>`);

  /* Kildeløse Kåre (elite): selvsikker med armene i kors, står på sin egen meningsboble — bøkene ligger urørt med spindelvev. */
  add('kildelose-kare', `${shadow(44, 64)}
<rect x="4" y="100" width="28" height="9" rx="2" ${f(0.35)} stroke-width="2.5"/>
<rect x="8" y="91" width="24" height="9" rx="2" ${f(0.2, 'var(--chalk)')} stroke-width="2.5"/>
<path d="M4 84l12 10M4 92q6-2 8-8M10 86q0 4 4 6" stroke="var(--chalk-faint)" stroke-width="1.3"/>
<path d="M40 88h48a8 8 0 0 1 8 8v2a8 8 0 0 1-8 8H58l-8 7v-7H40a8 8 0 0 1-8-8v-2a8 8 0 0 1 8-8Z" ${f(0.16, 'var(--chalk)')} stroke-width="3"/>
<path d="M64 92v6M64 102v0" stroke="var(--warn)" stroke-width="3.5"/>
<path d="M56 80v8h-6M72 80v8h6" stroke-width="3.5"/>
<path d="M42 50c-4 10-4 22-2 32h48c2-10 2-22-2-32Z" ${f(0.38)}/>
<path d="M28 74L98 52" stroke="var(--heat)" stroke-width="3"/>
<path d="M44 56l6 4 6-4 6 4 6-4 6 4 6-4 6 4" stroke="var(--bad)" stroke-width="2"/>
<path d="M42 64q22 12 44 0M42 72q22-10 44 0" ${f(0.3)} stroke-width="3.5"/>
<circle cx="64" cy="32" r="15" ${f(0.16, 'var(--chalk)')}/>
<path d="M49 28q0-16 14-16 8-8 16 0-6 0-8 4 6 4 8 12-8-6-16-6-8 0-14 6Z" ${f(0.8, 'var(--board-3)')} stroke-width="3"/>
<path d="M55 31q3-3 6 0M67 31q3-3 6 0" stroke-width="2.5"/>
<path d="M54 40q5-4 10 0 5-4 10 0" ${f(1, 'var(--chalk-dim)')} stroke-width="3"/>
<path d="M58 45q6 2 10-1" stroke-width="2.5"/>
<path d="M104 30q3-5 8-2M100 18q2-4 6-4" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Hverdagsspråket (finaleboss): en gigantisk snakkeboble med gapende munn og virvlende ord-tentakler. */
  const tent = 'M28 58C10 54 6 40 16 32c8-6 14 2 8 6M30 82C14 90 8 104 20 108c8 2 10-6 4-8M92 56c16-6 22-20 12-26-8-4-12 4-6 7M90 82c16 8 20 22 8 26-8 2-10-6-4-8M60 20c-2-10 8-16 14-12 6 4-2 10-4 5';
  add('hverdagsspraket', `<radialGradient id="hverdagsspraket-aura"><stop offset="0" stop-color="${R}" stop-opacity=".3"/><stop offset="1" stop-color="${R}" stop-opacity="0"/></radialGradient>
<circle cx="60" cy="56" r="58" fill="url(#hverdagsspraket-aura)" stroke="none"/>
<path d="${tent}" stroke-width="9"/><path d="${tent}" stroke="${R}" stroke-width="4.5"/>
${wordBlock(8, 46, 9, -60)}${wordBlock(14, 94, 9, 50)}${wordBlock(108, 44, 9, -120)}${wordBlock(108, 92, 9, 120)}${wordBlock(64, 4, 8, 10)}
<path d="M60 18c28 0 40 16 40 36 0 22-14 36-38 36L48 104l2-15C32 86 20 72 20 54c0-20 12-36 40-36Z" ${f(0.38)}/>
<path d="M34 34q4-8 12-8M86 34q-4-8-12-8" stroke-width="3"/>
${eye(46, 41, 8, 2, 1)}${eye(74, 41, 8, -2, 1)}
<path d="M33 56q27-8 54 0-2 28-27 28T33 56Z" fill="var(--board)"/>
<path d="M37 57l4 6 4-7 4 6 4-7 4 6 4-6 4 6 4-6 4 7 4-6 4 6 3-5" stroke-width="2.2"/>
<path d="M46 81q14-14 28 0" ${f(0.6, 'var(--bad)')} stroke-width="2.5"/>
<path d="M60 74v6" stroke="var(--board)" stroke-width="2"/>
<path d="M2 66q3-4 6 0t6 0M98 70q3-4 6 0t6 0M80 104q3-4 6 0t6 0" stroke="var(--chalk-dim)" stroke-width="2.5"/>`);
})();
