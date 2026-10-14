/* Fiendegrafikk — Verkstedet (teknologi). Krittegning på tavle, viewBox 0 0 120 120. */
(function () {
  'use strict';
  const R = 'var(--r-teknologi)';
  // Hver figur får egen <svg>. SVG-interne id-er (gradienter) prefikses med figur-id.
  const add = (id, b) => NG.art.add(id, `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`);
  const f = (o, c) => `fill="${c || R}" fill-opacity="${o == null ? 0.32 : o}"`;
  const eye = (x, y, r, px, py) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (px || 0)}" cy="${y + (py || 0)}" r="${(r * 0.5).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const shadow = (rx, cx) => `<ellipse cx="${cx || 60}" cy="111" rx="${rx || 30}" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>`;
  const spark = (x, y, s) => `<path d="M${x} ${y - s}v${2 * s}M${x - s} ${y}h${2 * s}" stroke-width="2.5"/>`;
  const drop = (x, y) => `<path d="M${x} ${y}q-3.5 5.5 0 7 3.5-1.5 0-7Z" fill="var(--r-stoffer)" fill-opacity=".7" stroke="var(--r-stoffer)" stroke-width="1.5"/>`;

  /* Den uendelige løkka: ∞-briller med svimle spiraløyne, piler som går rundt og rundt. */
  const loop = 'M60 60C48 40 18 38 18 60S48 80 60 60 102 38 102 60 72 80 60 60Z';
  const spiral = (x, y) => `<path d="M${x} ${y}a2 2 0 1 1 2.5 1.5 4.5 4.5 0 1 1-6.5-5 7 7 0 1 1 1 11" stroke="var(--board)" stroke-width="2.2"/>`;
  add('uendelig-lokka', `${shadow(32)}
<path d="M48 96l-4 12h-6M72 96l4 12h6"/>
<circle cx="60" cy="70" r="34" ${f(0.3)}/>
<path d="${loop}" stroke-width="18"/><path d="${loop}" stroke="var(--board)" stroke-width="11.5"/><path d="${loop}" stroke="${R}" stroke-opacity=".55" stroke-width="11.5"/>
<circle cx="34" cy="60" r="9" fill="var(--chalk)" stroke="none"/><circle cx="86" cy="60" r="9" fill="var(--chalk)" stroke="none"/>
${spiral(34, 60)}${spiral(86, 60)}
<path d="M48 88q6-5 12 0t12 0" stroke-width="3"/>
<path d="M22 28A46 46 0 0 1 96 24" stroke-width="3" stroke="var(--chalk-dim)"/><path d="M88 18l9 6-10 4" stroke-width="3" stroke="var(--chalk-dim)"/>
<path d="M100 96A46 46 0 0 1 26 100" stroke-width="3" stroke="var(--chalk-dim)"/><path d="M33 106l-8-6 10-4" stroke-width="3" stroke="var(--chalk-dim)"/>
${drop(102, 44)}${drop(16, 76)}`);

  /* Syntaksnissen: kaster semikolonet over skulderen — står på en rød feil-krusedull. */
  add('syntaksnissen', `<path d="M14 112q3-4 6 0${'t6 0'.repeat(14)}" stroke="var(--bad)" stroke-width="3"/>
<path d="M52 96v10h-8M68 96v10h8"/>
<path d="M42 70l-6 30h48l-6-30Z" ${f(0.4)}/>
<path d="M38 90h44" stroke="var(--chalk-dim)" stroke-width="4"/>
<path d="M40 76q-10 6-10 14M80 74q10-4 14-16"/>
<circle cx="60" cy="56" r="14" ${f(0.14, 'var(--chalk)')}/>
<path d="M45 64c-2 18 7 28 15 28s17-10 15-28q-7 6-15 5-8 1-15-5Z" ${f(0.4, 'var(--chalk)')}/>
<path d="M54 74q6 5 12 0" stroke-width="3"/>
<path d="M44 50C46 28 62 12 88 14 78 20 74 32 78 50Z" ${f(0.5, 'var(--bad)')}/>
<circle cx="90" cy="14" r="5" ${f(0.6, 'var(--chalk)')} stroke-width="2.5"/>
<path d="M42 50q18-6 38 0" stroke-width="5"/>
${eye(53, 56, 3.5, 1.5, 0)}${eye(67, 56, 3.5, 1.5, 0)}
<path d="M48 51l8 2M72 51l-8 2" stroke-width="2.5"/>
<circle cx="60" cy="63" r="4.5" ${f(0.55, 'var(--bad)')} stroke-width="2.5"/>
<circle cx="104" cy="32" r="5" fill="var(--chalk)" stroke="none"/>
<circle cx="104" cy="48" r="5" fill="var(--chalk)" stroke="none"/><path d="M108 49q0 8-7 12" stroke-width="4"/>
<path d="M92 26q2-6 6-8M90 40q-2-4 0-8" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Fossefallsfantomet: spøkelse med en fossefallsmodell på magen — alt renner én vei, nedover. */
  add('fossefallsfantomet', `<path d="M38 104v6M50 104v8M62 104v6M74 104v8M86 104v6" stroke="var(--r-stoffer)" stroke-width="3"/>
<path d="M28 100C24 70 26 40 46 26c14-10 36-6 44 10 8 16 4 44 6 64q-6-6-11 0t-11 0-11 0-11 0-11 0-11 0Z" ${f(0.3)}/>
<ellipse cx="52" cy="40" rx="4.5" ry="6.5" fill="var(--board)"/><ellipse cx="72" cy="40" rx="4.5" ry="6.5" fill="var(--board)"/>
<circle cx="53" cy="38" r="1.3" fill="var(--chalk)" stroke="none"/><circle cx="73" cy="38" r="1.3" fill="var(--chalk)" stroke="none"/>
<ellipse cx="62" cy="54" rx="3.5" ry="4.5" fill="var(--board)" stroke-width="3"/>
<g stroke-width="2.5"><rect x="32" y="60" width="16" height="8" rx="2" ${f(0.3, 'var(--chalk)')}/><rect x="44" y="70" width="16" height="8" rx="2" ${f(0.3, 'var(--chalk)')}/><rect x="56" y="80" width="16" height="8" rx="2" ${f(0.3, 'var(--chalk)')}/><rect x="68" y="90" width="16" height="8" rx="2" ${f(0.3, 'var(--chalk)')}/>
<path d="M48 64h4v4M60 74h4v4M72 84h4v4"/></g>
<path d="M30 58q-12 8-18 0M94 56q14 6 12 26m-4-4 4 4 3-5"/>
<path d="M14 18q4-2 4-6M108 22q-2-4 2-8" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Kravløsen: stolt oppfinner med en paraply full av hull — løsning uten behov. */
  add('kravlosen', `${shadow(28, 46)}
<path d="M98 108q-12-4-24 0" stroke="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M20 50C24 24 96 24 100 50q-10-6-20 0-10-6-20 0-10-6-20 0-10-6-20 0Z" ${f(0.38)}/>
<path d="M60 28L40 50M60 28v22M60 28l20 22" stroke-width="2"/>
<path d="M60 28v-7"/>
<circle cx="34" cy="42" r="3.5" fill="var(--board)" stroke-width="2"/><circle cx="50" cy="36" r="3" fill="var(--board)" stroke-width="2"/><circle cx="70" cy="40" r="4" fill="var(--board)" stroke-width="2"/><circle cx="86" cy="43" r="3" fill="var(--board)" stroke-width="2"/><circle cx="48" cy="46" r="2.5" fill="var(--board)" stroke-width="2"/>
<path d="M60 50v38q0 6 6 6t5-5" stroke-width="3.5"/>
${drop(30, 8)}${drop(56, 4)}${drop(88, 10)}${drop(34, 56)}${drop(70, 54)}${drop(86, 62)}${drop(48, 64)}
<ellipse cx="44" cy="92" rx="21" ry="16" ${f(0.32)}/>
<path d="M33 86q4-5 8 0M47 86q4-5 8 0"/>
<path d="M36 96q8 8 16 0" stroke-width="3"/>
<circle cx="30" cy="93" r="3" fill="var(--bad)" fill-opacity=".35" stroke="none"/>
<path d="M62 94q-2-6-2-8"/>
<path d="M24 92q-8-4-6-14"/>
<circle cx="52" cy="103" r="3.5" ${f(0.7, 'var(--warn)')} stroke-width="2"/><path d="M50 99l-2-5M54 99l2-5" stroke="var(--bad)" stroke-width="2"/>`);

  /* Svartboksen: svart kasse med trollmannshatt og tryllestav — «det er bare magi». */
  add('svartboksen', `${shadow(36, 58)}
<path d="M40 96v10M66 96v10"/>
<path d="M28 48l16-14h48L76 48Z" ${f(0.18, 'var(--chalk)')}/>
<path d="M76 48l16-14v48L76 96Z" fill="#000" fill-opacity=".45"/>
<rect x="28" y="48" width="48" height="48" fill="#000" fill-opacity=".6"/>
<ellipse cx="44" cy="68" rx="5" ry="3.5" fill="${R}" stroke="none"/><ellipse cx="60" cy="68" rx="5" ry="3.5" fill="${R}" stroke="none"/>
<circle cx="45" cy="68" r="1.6" fill="var(--board)" stroke="none"/><circle cx="61" cy="68" r="1.6" fill="var(--board)" stroke="none"/>
<path d="M42 80q10 6 20 0" stroke="${R}" stroke-width="2.5"/>
<path d="M46 42C54 30 58 16 72 6c-2 12 0 24 6 36" ${f(0.42)}/>
<ellipse cx="62" cy="42" rx="18" ry="4" ${f(0.55)} stroke-width="3"/>
<path d="M62 24l1 3 3 0-2 2 1 3-3-2-3 2 1-3-2-2 3 0Z" fill="var(--chalk)" stroke="none"/>
<path d="M90 62q8 0 10-8"/>
<path d="M100 54l10-16" stroke-width="4"/>
${spark(112, 32, 5)}${spark(98, 22, 3)}${spark(116, 50, 3)}
<path d="M14 40q0-6 5-6t5 5-5 6v3M19 54v0M12 76q0-5 4-5t4 4-4 5v2M16 88v0" stroke="var(--chalk-dim)" stroke-width="3"/>`);

  /* Off-by-one-ogeren (elite): holder opp seks fingre og teller feil — én boks faller ut av beltet. */
  let fingers = '';
  for (let i = 0; i < 6; i++) {
    const a = ((200 + i * 30) * Math.PI) / 180;
    fingers += `M${(100 + 7 * Math.cos(a)).toFixed(1)} ${(30 + 7 * Math.sin(a)).toFixed(1)}L${(100 + 17 * Math.cos(a)).toFixed(1)} ${(30 + 17 * Math.sin(a)).toFixed(1)}`;
  }
  add('off-by-one-ogeren', `${shadow(46, 58)}
<path d="M18 110C12 80 22 50 48 44c28-6 50 16 46 40l2 26Z" ${f(0.36)}/>
<path d="M82 54q14-6 16-18"/>
<path d="${fingers}" stroke-width="4.5"/>
<circle cx="100" cy="30" r="8" ${f(0.5)}/>
<path d="M24 64q-10 14-8 28"/>
<path d="M17 98L8 66" stroke-width="5"/><ellipse cx="7" cy="56" rx="6" ry="11" transform="rotate(-16 7 56)" ${f(0.3, 'var(--chalk)')}/>
<path d="M3 47l-2-3M10 46l2-3M13 56l3 0" stroke-width="2.5"/>
<path d="M33 30q-7-1-7 6 2 5 7 3M71 30q7-1 7 6-2 5-7 3" ${f(0.42)} stroke-width="3"/>
<circle cx="52" cy="34" r="19" ${f(0.45)}/>
<path d="M40 27l9 3M64 27l-9 3" stroke-width="4"/>
${eye(45, 35, 4.5, 1.5, 1)}${eye(59, 35, 4.5, 1.5, 1)}
<path d="M50 40q2 6 6 2" stroke-width="3"/>
<path d="M40 48q12 7 24 0" stroke-width="3.5"/>
<path d="M42 49l1-9 5 7ZM62 49l-1-9-5 7Z" fill="var(--chalk)" stroke-width="2"/>
<path d="M24 86h68" stroke="var(--chalk-dim)" stroke-width="3"/>
<g stroke-width="2.5" ${f(0.25, 'var(--chalk)')}><rect x="26" y="80" width="12" height="12" rx="1.5"/><rect x="40" y="80" width="12" height="12" rx="1.5"/><rect x="54" y="80" width="12" height="12" rx="1.5"/><rect x="68" y="80" width="12" height="12" rx="1.5"/><rect x="82" y="80" width="12" height="12" rx="1.5"/></g>
<rect x="98" y="94" width="12" height="12" rx="1.5" transform="rotate(24 104 100)" ${f(0.4, 'var(--bad)')} stroke="var(--bad)" stroke-width="2.5"/>
<path d="M96 88q4 2 6 6M104 86q4 0 8 4" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Simulatorsirenen (elite): havfrue med VR-briller som stiger ut av skjermen og synger deg inn i modellen. */
  const note = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--chalk)" stroke="none"/><path d="M${x + 2.6} ${y}V${y - 12}l6 3" stroke-width="2.5"/>`;
  add('simulatorsirenen', `${shadow(40)}
<path d="M54 102l-4 8h20l-4-8"/>
<rect x="10" y="56" width="100" height="46" rx="5" fill="#000" fill-opacity=".45"/>
<path d="M16 96h8v-4h8v4h8v-4h8v4h8v-4h8v4h8v-4h8v4h8v-4h8v4h4" stroke="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M46 58c-2 20 14 30 34 28l18 8-4-14 6-14-18 10c-10 2-10-10-8-18Z" ${f(0.5)}/>
<g fill="${R}" fill-opacity=".9" stroke="none"><rect x="52" y="64" width="4" height="4"/><rect x="60" y="70" width="4" height="4"/><rect x="56" y="76" width="4" height="4"/><rect x="68" y="78" width="4" height="4"/><rect x="64" y="64" width="4" height="4"/></g>
<path d="M86 84l4 2M90 76l4-4" stroke="var(--board)" stroke-width="2"/>
<path d="M48 24C38 34 34 50 24 56c12 2 22-6 26-18M72 24c8 10 10 22 18 28-10 2-18-4-20-14" ${f(0.55, 'var(--r-praksis)')}/>
<path d="M46 58c-2-10 0-16 6-20h16c6 4 8 10 6 20" ${f(0.18, 'var(--chalk)')}/>
<circle cx="60" cy="27" r="12" ${f(0.18, 'var(--chalk)')}/>
<path d="M48 22q2-12 12-12t12 12q-6-6-12-4-6-2-12 4Z" ${f(0.6, 'var(--r-praksis)')} stroke-width="3"/>
<rect x="47" y="21" width="26" height="9" rx="4" fill="${R}" fill-opacity=".85" stroke-width="3"/>
<path d="M51 25.5h18" stroke="var(--board)" stroke-width="2" stroke-dasharray="2 3"/>
<ellipse cx="60" cy="35" rx="3" ry="3.5" fill="var(--board)" stroke-width="2.5"/>
<path d="M74 44q14 2 20-12M94 32l-2-5M94 32l4-3M94 32l5 1"/>
<path d="M46 46q-12 4-16 0" />
${note(100, 18)}${note(86, 10)}${note(112, 34)}`);

  /* Buggen (boss): et insekt bygd av kode-klammer { } med alt for mange bein og røde feilmeldings-øyne. */
  let legs = '';
  for (let i = 0; i < 6; i++) {
    const y = 50 + i * 9;
    const kx = 20 - (i % 2) * 6, ky = y - 8 + i, fx = 8 + (i % 3) * 2, fy = y + 12;
    legs += `M50 ${y}L${kx} ${ky}L${fx} ${fy}M70 ${y}L${120 - kx} ${ky}L${120 - fx} ${fy}`;
  }
  add('buggen', `<radialGradient id="buggen-glow"><stop offset="0" stop-color="var(--bad)" stop-opacity=".45"/><stop offset="1" stop-color="var(--bad)" stop-opacity="0"/></radialGradient>
${shadow(50)}
<circle cx="60" cy="36" r="26" fill="url(#buggen-glow)" stroke="none"/>
<path d="${legs}" stroke="var(--chalk-dim)" stroke-width="2.8"/>
<path d="M40 28C30 28 32 42 32 52s-4 12-10 12c6 0 10 2 10 12s-2 22 8 22l14-18-2-34ZM80 28c10 0 8 14 8 24s4 12 10 12c-6 0-10 2-10 12s2 22-8 22L66 80l2-34Z" ${f(0.22)} stroke="none"/>

<ellipse cx="60" cy="84" rx="15" ry="19" ${f(0.45)}/>
<path d="M47 78q13 5 26 0M46 90q14 5 28 0" stroke-width="2.5"/>
<circle cx="56" cy="84" r="2" fill="var(--board)" stroke="none"/><path d="M56 89q1 3-2 5" stroke="var(--board)" stroke-width="2"/>
<circle cx="66" cy="96" r="1.8" fill="var(--board)" stroke="none"/><path d="M66 100q1 3-2 4" stroke="var(--board)" stroke-width="2"/>
<path d="M60 103v7" stroke-width="3"/>
<ellipse cx="60" cy="58" rx="13" ry="10" ${f(0.4)}/>
<path d="M40 28C30 28 32 42 32 52s-4 12-10 12c6 0 10 2 10 12s-2 22 8 22M80 28c10 0 8 14 8 24s4 12 10 12c-6 0-10 2-10 12s2 22-8 22" stroke-width="11"/>
<path d="M40 28C30 28 32 42 32 52s-4 12-10 12c6 0 10 2 10 12s-2 22 8 22M80 28c10 0 8 14 8 24s4 12 10 12c-6 0-10 2-10 12s2 22-8 22" stroke="${R}" stroke-width="5.5"/>
<path d="M54 24C50 12 40 8 32 12M66 24c4-12 14-16 22-12"/>
<circle cx="31" cy="12" r="3.5" ${f(0.8)} stroke-width="2.5"/><circle cx="89" cy="12" r="3.5" ${f(0.8)} stroke-width="2.5"/>
<circle cx="60" cy="36" r="14" ${f(0.5)}/>
<circle cx="53" cy="34" r="6" fill="var(--bad)" stroke="none"/><circle cx="67" cy="34" r="6" fill="var(--bad)" stroke="none"/>
<circle cx="54" cy="35" r="2.6" fill="var(--board)" stroke="none"/><circle cx="66" cy="35" r="2.6" fill="var(--board)" stroke="none"/>
<path d="M45 26l10 4M75 26l-10 4" stroke-width="3"/>
<path d="M56 44l-6 4 6 4M64 44l6 4-6 4" stroke-width="3.5"/>
<path d="M14 26v8M14 40v0M106 26v8M106 40v0M24 100l-2 6M100 98l2 6" stroke="var(--bad)" stroke-width="3.5"/>`);
})();
