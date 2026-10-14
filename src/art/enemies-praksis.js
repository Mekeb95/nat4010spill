/* Fiendegrafikk — Utforskertårnet (praksis). Krittegning på tavle, viewBox 0 0 120 120. */
(function () {
  'use strict';
  const R = 'var(--r-praksis)';
  // Hver figur får egen <svg>. SVG-interne id-er (gradienter) prefikses med figur-id.
  const add = (id, b) => NG.art.add(id, `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`);
  const f = (o, c) => `fill="${c || R}" fill-opacity="${o == null ? 0.32 : o}"`;
  const eye = (x, y, r, px, py) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (px || 0)}" cy="${y + (py || 0)}" r="${(r * 0.5).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const shadow = (rx, cx) => `<ellipse cx="${cx || 60}" cy="111" rx="${rx || 30}" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>`;
  const spark = (x, y, s) => `<path d="M${x} ${y - s}v${2 * s}M${x - s} ${y}h${2 * s}" stroke-width="2.5"/>`;
  // Liten flytdiagram-rekke □→□→□ (Dogmatikerens ene metode).
  const flow = (x, y, s, c) => `<g stroke="${c}" stroke-width="${s > 6 ? 2.5 : 1.8}"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="1"/><rect x="${x + s * 1.8}" y="${y}" width="${s}" height="${s}" rx="1"/><rect x="${x + s * 3.6}" y="${y}" width="${s}" height="${s}" rx="1"/><path d="M${x + s * 1.1} ${y + s / 2}h${s * 0.55}M${x + s * 2.9} ${y + s / 2}h${s * 0.55}"/></g>`;

  /* Kokebok-kokken: følger oppskriften blindt — kolbe i stekepanna, hakelister i kokeboka. */
  add('kokebokkokken', `${shadow(40)}
<path d="M52 98v8h-6M68 98v8h6"/>
<path d="M40 66q-4 18 0 34h40q4-16 0-34Z" ${f(0.16, 'var(--chalk)')}/>
<path d="M48 70h24v28H48Z" ${f(0.35)} stroke-width="3"/>
<circle cx="60" cy="52" r="13" ${f(0.14, 'var(--chalk)')}/>
<path d="M44 40C34 38 34 22 44 22c0-12 16-16 22-8 10-6 22 6 14 16 2 6-2 10-4 10Z" ${f(0.3, 'var(--chalk)')}/>
<path d="M45 36h30" stroke-width="3"/>
${eye(55, 51, 3.5, 0, 1.8)}${eye(66, 51, 3.5, 0, 1.8)}
<path d="M52 59q4-3 8 0 4-3 8 0" stroke-width="3"/>
<path d="M30 70q-8-4-16 0v20q8-4 16 0 8-4 16 0V70q-8-4-16 0ZM30 70v20" ${f(0.2, 'var(--chalk)')} stroke-width="3"/>
<path d="M17 76l2 2 4-4M17 83l2 2 4-4" stroke="var(--good)" stroke-width="2.2"/><path d="M34 76h8M34 82h8M34 88h5" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M42 70q-4 2-6 6"/>
<path d="M78 70q6 4 6 10"/>
<path d="M86 84H76" stroke-width="4.5"/>
<path d="M86 84h28q0 6-14 6t-14-6Z" ${f(0.25, 'var(--chalk)')}/>
<path d="M96 60v8l-7 13h22l-7-13v-8Z" ${f(0.5)} stroke-width="3"/>
<path d="M95 60h10" stroke-width="3"/>
<circle cx="98" cy="52" r="2" stroke-width="2"/><circle cx="103" cy="45" r="2.5" stroke-width="2"/>
<path d="M90 92q-2 4 0 8M100 92q-2 4 0 8M110 92q-2 4 0 8" stroke="var(--bad)" stroke-width="2.5"/>`);

  /* Bevistrollet: selvgodt troll med dommerklubbe og steintavle — ✓ og ∎, «endelig bevist». */
  add('bevistrollet', `${shadow(40)}
<path d="M48 98v8h-8M70 98v8h8"/>
<ellipse cx="60" cy="80" rx="26" ry="22" ${f(0.32)}/>
<path d="M48 84q12 6 24 0" stroke-width="2.5" stroke="var(--chalk-dim)"/>
<path d="M38 72q-14-2-18-18"/>
<path d="M21 56L13 40" stroke-width="4"/>
<rect x="2" y="29" width="22" height="11" rx="2" transform="rotate(-25 13 34)" ${f(0.55, 'var(--heat)')} stroke-width="3"/>
<path d="M26 22q4-6 10-6M4 52q-2-6 2-10" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M44 30l-6-12 10 6M70 26l8-10v12" ${f(0.4, 'var(--chalk)')} stroke-width="3"/>
<path d="M42 40q-8-4-8-12 6 0 10 6M74 40q8-4 8-12-6 0-10 6" ${f(0.36)} stroke-width="3"/>
<circle cx="58" cy="42" r="18" ${f(0.38)}/>
<path d="M52 24q2-8 6-6 0-6 6-2" stroke-width="3"/>
<path d="M47 38q4-4 8 0M63 36q4-4 8 0"/>
<ellipse cx="62" cy="47" rx="7" ry="6" ${f(0.55)} stroke-width="3"/>
<path d="M48 55q10 7 20 0" stroke-width="3"/><path d="M56 57v3h4v-2" stroke-width="2"/>
<path d="M80 72q4-4 6-8"/>
<path d="M82 84V52a14 10 0 0 1 28 0v32Z" ${f(0.2, 'var(--chalk)')}/>
<path d="M87 62l6 6 12-14" stroke="var(--good)" stroke-width="4.5"/>
<rect x="99" y="74" width="7" height="7" fill="var(--chalk)" stroke="none"/>
<path d="M88 77h6" stroke="var(--chalk-dim)" stroke-width="2"/>`);

  /* Observasjonsblanderen: en blender som mikser et øye (observasjon) og en lyspære (slutning) til grøt. */
  add('observasjonsblanderen', `${shadow(36)}
<path d="M36 76h48l4 30H32Z" ${f(0.38)}/>
${eye(50, 88, 4.5, 0, -1.5)}${eye(70, 88, 4.5, 0, -1.5)}
<path d="M51 98q9 6 18 0" stroke-width="3"/>
<circle cx="40" cy="100" r="2" fill="var(--chalk)" stroke="none"/><circle cx="80" cy="100" r="2" fill="var(--bad)" stroke="none"/>
<path d="M34 22h52l-6 54H40Z" ${f(0.08, 'var(--chalk)')}/>
<path d="M86 30q12 2 10 20-2 10-12 10" stroke-width="3"/>
<path d="M42 64q18 10 36-4M40 48q20 12 40-2M46 34q14 6 30 0" stroke="${R}" stroke-opacity=".7" stroke-width="2.5"/>
<g transform="rotate(-20 52 44)"><ellipse cx="52" cy="44" rx="8" ry="5.5" fill="var(--chalk)" stroke-width="2"/><circle cx="53" cy="44" r="2.8" fill="var(--board)" stroke="none"/></g>
<g transform="rotate(30 68 56)"><circle cx="68" cy="53" r="6.5" ${f(0.6, 'var(--warn)')} stroke-width="2.5"/><path d="M65 60h6v4h-6Z" stroke-width="2"/></g>
<path d="M54 72l6-3 6 3" stroke-width="2.5"/>
<path d="M32 22h56v-7H32Z" ${f(0.5)} stroke-width="3"/>
<path d="M56 15v-5h8v5" stroke-width="3"/>
<path d="M22 34q-4 6 0 12M16 30q-6 10 0 20M98 66q4 4 2 10" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M40 8q-2-4 2-6M78 8q2-4-2-6" stroke="${R}" stroke-width="2.5"/>`);

  /* Alt-varieren: vrir på alle knottene samtidig — fem armer, fem variabler, null kontroll. */
  const knob = (x, a) => `<circle cx="${x}" cy="97" r="7" ${f(0.35)} stroke-width="3"/><path d="M${x} 97l${(6 * Math.cos(a)).toFixed(1)} ${(6 * Math.sin(a)).toFixed(1)}" stroke-width="2.5"/>`;
  add('altvarieren', `<rect x="8" y="86" width="104" height="22" rx="4" ${f(0.6, 'var(--board-3)')}/>
${knob(22, -2.2)}${knob(41, -0.4)}${knob(60, -1.6)}${knob(79, 0.6)}${knob(98, -2.8)}
<path d="M44 56q-20 6-22 32M48 64q-8 10-7 24M60 66v22M72 64q8 10 7 24M76 56q20 6 22 32" stroke-width="4"/>
<path d="M18 84l4 4 4-4M37 84l4 4 4-4M56 84l4 4 4-4M75 84l4 4 4-4M94 84l4 4 4-4" stroke-width="2.5"/>
<path d="M50 24l-2-10 6 6 6-10 3 10 7-6-2 10" stroke-width="3"/>
<circle cx="60" cy="44" r="22" ${f(0.32)}/>
${eye(51, 40, 6, -2.5, -1)}${eye(69, 41, 7.5, 3, 1.5)}
<path d="M48 52q12 12 24 0Z" fill="var(--board)" stroke-width="3"/>
<path d="M56 57q4 4 8 0" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M30 30q-6-4-4-12M90 30q6-4 4-12M14 70q-6-4-4-10M106 70q6-4 4-10" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M88 46q-3 5 0 6 3-1 0-6Z" fill="var(--r-stoffer)" stroke="var(--r-stoffer)" stroke-width="1.5"/>`);

  /* Modellmonumentet: en atommodell-statue med laurbærkrans som tror den ER virkeligheten (modell = verden). */
  add('modellmonumentet', `${shadow(40)}
<rect x="26" y="102" width="68" height="8" rx="1.5" ${f(0.2, 'var(--chalk)')}/>
<rect x="36" y="82" width="48" height="20" ${f(0.12, 'var(--chalk)')}/>
<rect x="30" y="76" width="60" height="7" rx="1.5" ${f(0.2, 'var(--chalk)')}/>
<rect x="44" y="86" width="32" height="12" rx="2" ${f(0.4)} stroke-width="2.5"/>
<circle cx="51" cy="92" r="3" stroke-width="1.8"/><path d="M56 90.5h6M56 93.5h6" stroke-width="1.8"/><circle cx="68" cy="92" r="3.5" stroke-width="1.8"/><path d="M65 91q3 2 6-1" stroke-width="1.5"/>
<path d="M82 84l-4 6 3 4-4 6" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M60 62v14" stroke-width="4"/>
<g stroke="var(--chalk-dim)" stroke-width="2.5"><ellipse cx="60" cy="44" rx="34" ry="11" transform="rotate(28 60 44)"/><ellipse cx="60" cy="44" rx="34" ry="11" transform="rotate(-28 60 44)"/><ellipse cx="60" cy="44" rx="11" ry="34"/></g>
<circle cx="31" cy="27" r="3.5" fill="${R}" stroke="none"/><circle cx="91" cy="58" r="3.5" fill="${R}" stroke="none"/><circle cx="60" cy="10" r="3.5" fill="${R}" stroke="none"/><circle cx="88" cy="30" r="3.5" fill="${R}" stroke="none"/>
<circle cx="60" cy="44" r="15" ${f(0.3, 'var(--chalk-dim)')}/>
<path d="M46 36q14-14 28 0" stroke="var(--good)" stroke-width="2.5"/>
<path d="M48 33l-3-3M51 30l-1-4M56 28v-4M64 28v-4M69 30l1-4M72 33l3-3" stroke="var(--good)" stroke-width="3"/>
<path d="M51 42q3-3 6 0M63 42q3-3 6 0" stroke-width="2.5"/>
<path d="M58 46l2-3 2 3" stroke-width="2"/>
<path d="M55 52q5 2 10-1" stroke-width="2.5"/>
<path d="M98 82l3-6M104 88l6-2M16 82l-3-6M10 92l-6-1" stroke="var(--warn)" stroke-width="2.5"/>`);

  /* Hypotesehaien (elite): haien kaster piler i blinde — «en hypotese er bare en vill gjetning». */
  add('hypotesehaien', `<path d="M4 104q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0" stroke="var(--r-stoffer)" stroke-width="3"/>
<circle cx="54" cy="18" r="14" ${f(0.12, 'var(--chalk)')}/><circle cx="54" cy="18" r="8" ${f(0.35, 'var(--bad)')} stroke-width="3"/><circle cx="54" cy="18" r="3" fill="var(--chalk)" stroke="none"/>
<path d="M26 10l-6 6M86 6l6 6M8 60l6-5" stroke-width="3"/>
<path d="M20 16l-3-1 1-3M92 12l3 1-1 3M14 55l-1 3 3 1" stroke="var(--bad)" stroke-width="2"/>
<path d="M40 68L22 46l32 8" ${f(0.4)}/>
<path d="M12 106c6-26 22-46 46-54 16-5 34-3 48 6-6 6-16 10-28 10 8 4 12 10 10 16-14 0-28 4-38 12-4 4-8 8-10 10Z" ${f(0.36)}/>
<path d="M78 68l22-9-10 22Z" fill="var(--board)" stroke-width="2.5"/>
<path d="M82 67l2 4 3-5 3 4 3-5 3 3M84 76l3-3 1 4 3-4" stroke-width="2"/>
<path d="M30 100c10-12 26-18 50-18" ${f(0.15, 'var(--chalk)')} stroke="none"/>
<path d="M64 62q-3 6 0 12M58 64q-3 6 0 12" stroke-width="2.5"/>
<path d="M64 52l32 6" stroke="var(--bad)" stroke-width="8"/>
<path d="M64 52l-8-8M64 52l-10 2" stroke="var(--bad)" stroke-width="3.5"/>
<path d="M50 88l-12 12 16-4" ${f(0.4)} stroke-width="3"/>
<path d="M44 92l20-16" stroke-width="3"/><path d="M62 74l4 0-1 4M42 90l-3 4M45 93l-4 3" stroke-width="2.2"/>
<path d="M104 40q2-6 7-5 4 2 0 6l-2 3M109 50v0M84 34q2-5 6-4 3 2 0 5l-2 2M88 42v0" stroke="var(--warn)" stroke-width="3"/>`);

  /* Sikkerhetsslurven (elite): vernebrillene i panna, ikke på øynene — og kolben søler etsende grønt. */
  add('sikkerhetsslurven', `${shadow(48)}
<path d="M4 108l14-22 14 22Z" ${f(0.4, 'var(--warn)')} stroke-width="3" transform="rotate(-70 18 100)"/>
<path d="M50 96l-2 12h-10M70 96l2 12h10"/>
<path d="M36 108q-4 4 2 6M86 108q6 2 2 6" stroke-width="2" stroke="var(--chalk-dim)"/>
<path d="M36 52c-6 18-8 38-6 48h60c2-10 0-30-6-48Z" ${f(0.22, 'var(--chalk)')}/>
<path d="M50 52l4 48h12l4-48" ${f(0.35)} stroke-width="3"/>
<circle cx="42" cy="78" r="4" fill="var(--good)" fill-opacity=".5" stroke="none"/><circle cx="78" cy="66" r="3" fill="var(--heat)" fill-opacity=".6" stroke="none"/><circle cx="40" cy="92" r="2.5" fill="var(--bad)" fill-opacity=".5" stroke="none"/>
<path d="M38 60q-14 8-16 20"/>
<circle cx="21" cy="82" r="5" ${f(0.2, 'var(--chalk)')} stroke-width="3"/><path d="M20 77v-8" stroke-width="4"/>
<circle cx="60" cy="38" r="16" ${f(0.14, 'var(--chalk)')}/>
<path d="M44 30l-4-10 7 3 1-9 6 6 4-9 4 8 6-7 1 9 7-3-3 10" ${f(0.5, 'var(--board-3)')} stroke-width="3"/>
<path d="M50 14q-4-4 0-8M64 12q4-4 0-8M76 18q4-2 4-6" stroke="var(--chalk-faint)" stroke-width="2.5"/>
<path d="M42 28h36" stroke-width="2.5"/>
<circle cx="52" cy="27" r="6" ${f(0.4, 'var(--r-stoffer)')} stroke-width="3"/><circle cx="68" cy="27" r="6" ${f(0.4, 'var(--r-stoffer)')} stroke-width="3"/>
${eye(53, 40, 4, 1, 1)}${eye(67, 40, 4, 1, 1)}
<path d="M48 38h10M62 38h10" stroke-width="3"/>
<path d="M50 47q10 8 20 0" stroke-width="3"/><path d="M58 51q3 4 6 0" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M82 60q8 4 6 12"/>
<g transform="rotate(115 92 70)"><path d="M88 58v8l-8 14h24l-8-14v-8Z" ${f(0.45, 'var(--good)')} stroke-width="3"/><path d="M87 58h10" stroke-width="3"/></g>
<path d="M104 77q4 12 2 26" stroke="var(--good)" stroke-width="4"/>
<path d="M96 108q8-4 22 0" ${f(0.4, 'var(--good)')} stroke="var(--good)" stroke-width="3"/>
<circle cx="104" cy="102" r="2" stroke="var(--good)" stroke-width="1.8"/><circle cx="112" cy="100" r="1.5" stroke="var(--good)" stroke-width="1.5"/>
<path d="M100 96q-4-6 0-10M110 92q4-6 0-10" stroke="var(--chalk-faint)" stroke-width="2.5"/>`);

  /* Dogmatikeren (boss): stiv som en linjal, skylapper og ett gigantisk stempel med den ENE metoden. */
  add('dogmatikeren', `<radialGradient id="dogmatikeren-aura"><stop offset="0" stop-color="${R}" stop-opacity=".22"/><stop offset="1" stop-color="${R}" stop-opacity="0"/></radialGradient>
<circle cx="50" cy="56" r="52" fill="url(#dogmatikeren-aura)" stroke="none"/>
${shadow(50, 58)}
<path d="M6 92h30v16H6Z" ${f(0.15, 'var(--chalk)')} stroke-width="2.5"/><path d="M4 96" />
${flow(10, 97, 5, R)}
${flow(84, 103, 5, R)}
<path d="M42 92v16h-8M58 92v16h8" stroke-width="4"/>
<rect x="30" y="50" width="40" height="44" rx="3" ${f(0.34)}/>
<path d="M50 50v14l-3 6 3 4 3-4-3-6" fill="var(--bad)" fill-opacity=".5" stroke-width="2.5"/>
<path d="M44 52v40M56 52v40" stroke="var(--chalk-dim)" stroke-width="1.5"/>
<path d="M30 54L26 92" stroke-width="4.5"/>
<path d="M70 54l14-14" stroke-width="4.5"/>
<rect x="34" y="18" width="32" height="30" rx="5" ${f(0.16, 'var(--chalk)')}/>
<path d="M28 16l22-8 22 8-22 8Z" ${f(0.85, 'var(--board-3)')} stroke-width="3"/>
<path d="M72 16v10" stroke-width="2.5"/><circle cx="72" cy="28" r="2.5" fill="${R}" stroke="none"/>
<rect x="25" y="25" width="9" height="17" rx="1.5" fill="#000" fill-opacity=".7" stroke-width="3"/>
<rect x="66" y="25" width="9" height="17" rx="1.5" fill="#000" fill-opacity=".7" stroke-width="3"/>
<path d="M34 28h-1M67 28h-1" />
${eye(44, 33, 3.6)}${eye(56, 33, 3.6)}
<path d="M39 27h10M51 27h10" stroke-width="4"/>
<path d="M44 42h12" stroke-width="3.5"/>
<circle cx="99" cy="9" r="6" ${f(0.7, 'var(--heat)')} stroke-width="3"/>
<path d="M96 15h6v13h-6Z" ${f(0.4, 'var(--heat)')} stroke-width="3"/>
<path d="M78 28h42l-2 6H80Z" ${f(0.5, 'var(--heat)')} stroke-width="3"/>
<rect x="78" y="34" width="40" height="22" rx="2" ${f(0.25, 'var(--chalk)')}/>
${flow(82, 41, 8, 'var(--chalk)')}
<path d="M83 38l2-2M114 52l-2 2" stroke="var(--chalk-dim)" stroke-width="1.5"/>
<path d="M86 64q2 6 8 6M110 64q-2 6-8 6" stroke="var(--chalk-dim)" stroke-width="2.5"/>`);
})();
