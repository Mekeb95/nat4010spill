/* Fiendegrafikk — Kroppsbyen (kropp). Krittegning på tavle, viewBox 0 0 120 120. */
(function () {
  'use strict';
  const R = 'var(--r-kropp)';
  // Kritt-filter: lett ujevn kontur + kornete kritt. Id prefikses med figur-id (alt ligger inline i samme dokument).
  const chalk = (id) => `<filter id="${id}-k" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" result="d"/><feColorMatrix in="n" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.1 1.6" result="g"/><feComposite in="d" in2="g" operator="in"/></filter>`;
  const add = (id, b) => NG.art.add(id, `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><defs>${chalk(id)}</defs><g filter="url(#${id}-k)">${b}</g></svg>`);
  const f = (o, c) => `fill="${c || R}" fill-opacity="${o == null ? 0.34 : o}"`;
  const eye = (x, y, r, px, py) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (px || 0)}" cy="${y + (py || 0)}" r="${(r * 0.5).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const shadow = (rx, cx) => `<ellipse cx="${cx || 60}" cy="111" rx="${rx || 30}" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>`;
  const spark = (x, y, s) => `<path d="M${x} ${y - s}v${2 * s}M${x - s} ${y}h${2 * s}" stroke-width="2.5"/>`;

  /* Antibiotika-alven: pille-alv som stikker et virus — sverdet bøyer seg, viruset ler. */
  add('antibiotika-alven', `${shadow(36, 62)}
<path d="M44 50C22 26 10 50 34 60M70 42C82 16 104 34 78 54" ${f(0.12, 'var(--chalk)')} stroke="var(--chalk-dim)" stroke-width="2.5"/>
<g transform="rotate(-18 56 62)">
<path d="M41 62V46a15 15 0 0 1 30 0v16Z" ${f(0.45)}/>
<path d="M41 62v16a15 15 0 0 0 30 0V62Z" ${f(0.14, 'var(--chalk)')}/>
${eye(50, 52, 4.5, 1, 0)}${eye(62, 52, 4.5, 1, 0)}
<path d="M51 67q5 4 10 0" stroke-width="3"/>
<path d="M50 93l-3 13M62 93l3 13"/>
</g>
<path d="M72 64q8 0 12 4"/>
<path d="M82 62l6 9" stroke-width="4"/>
<path d="M86 66q10-4 13 4q2 8 7 9" stroke="var(--chalk-dim)"/>
<circle cx="99" cy="96" r="9" ${f(0.35, 'var(--bad)')} stroke="var(--bad)"/>
<path d="M99 84v-4M99 108v4M87 96h-4M111 96h4M90 87l-3-3M108 87l3-3M90 105l-3 3M108 105l3 3" stroke="var(--bad)" stroke-width="3"/>
<circle cx="96" cy="94" r="1.6" fill="var(--chalk)" stroke="none"/><circle cx="103" cy="94" r="1.6" fill="var(--chalk)" stroke="none"/>
<path d="M95 99q4 4 8 0" stroke-width="2.5"/>
${spark(20, 24, 4)}${spark(100, 22, 3)}`);

  /* Detox-dragen: lubben drage med grønn smoothie og stjernestøv. */
  add('detoxdragen', `${shadow(38, 58)}
<path d="M38 96C24 100 14 92 18 82l-7-1 8-5" ${f(0.25)}/>
<path d="M44 64C34 50 22 56 26 68Z" ${f(0.15, 'var(--chalk)')} stroke-width="3"/>
<ellipse cx="58" cy="84" rx="25" ry="22" ${f(0.28)}/>
<path d="M50 74q8 3 16 0M48 84q10 3 20 0M50 94q8 3 16 0" stroke-width="2.5" stroke="var(--chalk-dim)"/>
<path d="M36 64l-7 3 6 4-7 5 7 4-6 6" stroke-width="3"/>
<path d="M50 26l-4-12 10 7M66 22l5-12 3 13" ${f(0.4, 'var(--chalk)')}/>
<path d="M44 44c0-14 10-22 22-22 10 0 16 6 18 12 10 0 16 6 15 13s-8 9-16 9c-4 5-12 8-20 8-12 0-19-8-19-20Z" ${f(0.32)}/>
<path d="M90 43h0M95 43h0" stroke-width="4"/>
<path d="M52 40q4-5 8 0M66 37q4-5 8 0"/>
<circle cx="50" cy="48" r="4" fill="var(--bad)" fill-opacity=".35" stroke="none"/>
<path d="M66 54q8 5 16 0" stroke-width="3"/>
<path d="M82 70l16-2 2 34H86Z" ${f(0.4, 'var(--good)')}/>
<path d="M84 80h15" stroke="var(--good)" stroke-width="2.5"/>
<path d="M93 70l4-18h7" stroke-width="3"/>
<circle cx="84" cy="68" r="5" ${f(0.35, 'var(--good)')} stroke-width="2.5"/>
<path d="M76 78q6 0 8 3M76 92q6 0 10-1" />
${spark(108, 62, 4)}${spark(104, 22, 3)}${spark(22, 34, 3)}`);

  /* Genfatalisten: DNA-spiral med marionettkors — trekker i trådene til en liten, trist dukke. */
  add('genfatalisten', `${shadow(34, 62)}
<path d="M47 47h24M48 57h22M47 71h24M48 81h22M47 95h24" stroke="${R}" stroke-width="3"/>
<path d="M42 40c0 12 36 12 36 24s-36 12-36 24 36 12 36 18M78 40c0 12-36 12-36 24s36 12 36 24-36 12-36 18" stroke-width="4"/>
<circle cx="60" cy="27" r="14" ${f(0.3)}/>
${eye(54, 25, 4, 0, 1.5)}${eye(66, 25, 4, 0, 1.5)}
<path d="M49 18l9 3M71 18l-9 3" stroke-width="3"/>
<path d="M54 34h12" stroke-width="3"/>
<path d="M74 34q10 0 18-6"/>
<path d="M86 22h22M97 14v16" stroke-width="4"/>
<path d="M88 22l-2 46M106 22l2 46M97 30v40" stroke="var(--chalk-dim)" stroke-width="1.5"/>
<circle cx="97" cy="76" r="6" ${f(0.15, 'var(--chalk)')} stroke-width="3"/>
<path d="M95 79q2-2 4 0" stroke-width="2"/>
<path d="M97 82v14M86 68l11 18 11-18M97 96l-6 10M97 96l6 10" stroke-width="3"/>`);

  /* Blodblåen: bloddråpe som maler seg selv blå — rødt titter fram under malingen. */
  add('blodblaen', `${shadow(32, 62)}
<path d="M60 16S30 54 30 76c0 18 14 30 30 30s30-12 30-30C90 54 60 16 60 16Z" ${f(0.45, 'var(--bad)')} stroke="none"/>
<path d="M60 16S30 54 30 76v4q4 7 8 0 4 12 9 0 5 5 9-2 5 12 10 0 4 6 8-1 4 8 8 0 4 6 8 0V76C90 54 60 16 60 16Z" fill="var(--r-stoffer)" fill-opacity=".6" stroke="none"/>
<path d="M60 16S30 54 30 76c0 18 14 30 30 30s30-12 30-30C90 54 60 16 60 16Z"/>
<path d="M44 52q6 8 2 18M74 46q-3 10 4 16" stroke="var(--board)" stroke-opacity=".5" stroke-width="2.5"/>
${eye(51, 66, 5, 2, 0)}${eye(68, 66, 5, 2, 0)}
<path d="M46 58l9 2M74 57l-8 3" stroke-width="3"/>
<path d="M52 80q8 6 16 0"/>
<path d="M104 36L93 62" stroke-width="4"/>
<path d="M95 57l-5 10c-1 4 2 5 4 3l4-11Z" fill="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M89 82q6-6 6-14" stroke-width="3"/>
<path d="M8 92h22l-3 16H11Z" ${f(0.5, 'var(--r-stoffer)')}/>
<path d="M10 92q9-8 18 0" stroke-width="2"/>
<path d="M30 96q4 2 2 8" stroke="var(--r-stoffer)" stroke-width="3"/>`);

  /* Tiprosenten: sovende hjerne med batteri på 10 %. */
  add('tiprosenten', `${shadow(34, 58)}
<path d="M48 82l-4 20h-7M66 82l4 20h7"/>
<path d="M30 70c-12-4-12-22 2-24-2-14 14-20 22-14 6-10 22-8 26 0 12-4 22 10 14 20 10 8 4 24-8 22-2 10-16 12-22 6-8 8-24 6-24-2-6 2-10-2-10-8Z" ${f(0.32)}/>
<path d="M44 42q7 4 3 10M60 34q-4 8 4 12M78 40q-7 6 0 12M88 58q-8 0-8 7M40 64q4-6 10-4" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M45 58q5 4 10 0M64 58q5 4 10 0"/>
<circle cx="60" cy="70" r="3.5" stroke-width="2.5"/>
<path d="M90 16h9l-9 9h9M102 6h6l-6 6h6" stroke-width="2.5"/>
<path d="M86 72q10 6 6 20" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<rect x="80" y="92" width="28" height="14" rx="3" ${f(0.08, 'var(--chalk)')} stroke-width="3"/>
<path d="M110 96v6" stroke-width="4"/>
<rect x="83" y="95" width="4" height="8" fill="var(--bad)" stroke="none"/>`);

  /* Ryktesprederen (elite): sølvpapirhatt, megafon, sprer virus og spørsmålstegn. */
  add('ryktespreder', `${shadow(44, 54)}
<path d="M10 110c-4-30 2-62 32-68 28-6 50 12 48 40l2 28Z" ${f(0.34)}/>
<path d="M30 44L48 4l20 36Z" ${f(0.25, 'var(--chalk)')}/>
<path d="M38 28l6 3-3 5 7 2M52 14l4 6-4 4 6 4" stroke="var(--chalk-dim)" stroke-width="2"/>
${eye(42, 58, 7, 2, -1)}${eye(65, 56, 10, -3, 2)}
<path d="M32 46l14 4M76 42l-10 6" stroke-width="3.5"/>
<path d="M40 76q14 2 26-4q-4 18-14 18t-12-14Z" fill="var(--board)"/>
<path d="M44 77l3 5 3-5 3 5 3-5 3 4" stroke-width="2"/>
<path d="M22 76q-8 10-14 6l-3-6" stroke-width="4"/>
<path d="M84 80q6-2 8-8"/>
<path d="M86 66l6 10 26-18-14-16Z" ${f(0.4, 'var(--warn)')} stroke-width="3"/>
<path d="M104 42l14 16" stroke-width="5"/>
<path d="M90 24q3-6 8-3 3 4-3 7v3M96 37v0M108 30q3-6 8-3 3 4-3 7v3" stroke="var(--warn)" stroke-width="3"/>
<circle cx="76" cy="20" r="5" ${f(0.4, 'var(--bad)')} stroke="var(--bad)" stroke-width="2.5"/>
<path d="M76 11v3M76 26v3M67 20h3M82 20h3" stroke="var(--bad)" stroke-width="2.5"/>
<circle cx="110" cy="10" r="3.5" ${f(0.4, 'var(--bad)')} stroke="var(--bad)" stroke-width="2"/>
<path d="M110 3v2M110 15v2M103 10h2M115 10h2" stroke="var(--bad)" stroke-width="2"/>`);

  /* Kildeforfalskeren (elite): luring i frakk med falsk bart, ett enkelt rykte som «kilde» og en falsk godkjent-stempel. */
  add('kildeforfalskeren', `${shadow(40, 56)}
<path d="M30 110l6-50c2-10 40-10 42 0l6 50Z" ${f(0.24)}/>
<path d="M44 52l12 22 2-22M70 52l-10 22" stroke-width="3"/>
<path d="M33 86h50" stroke-width="5" stroke="var(--chalk-dim)"/>
<rect x="53" y="82" width="9" height="8" rx="1" stroke-width="2.5"/>
<circle cx="57" cy="40" r="13" ${f(0.15, 'var(--chalk)')}/>
<path d="M38 29c0-18 38-18 38 0" ${f(0.8, 'var(--board-3)')}/>
<path d="M30 30q27-6 54 0" stroke-width="4"/>
<path d="M39 22q18 4 36 0" stroke="${R}" stroke-width="3"/>
${eye(52, 39, 3.8, 2, 0)}${eye(63, 39, 3.8, 2, 0)}
<path d="M46 48q5-5 11 0 6-5 11 0M46 48q-4 1-3-3M68 48q4 1 3-3" stroke-width="3"/>
<path d="M83 60l26-6 6 30-26 6Z" ${f(0.12, 'var(--chalk)')} stroke-width="3"/>
<path d="M88 66l14-3M89 71l10-2" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M92 80l4 4 10-12" stroke="var(--good)" stroke-width="4"/>
<circle cx="88" cy="88" r="5" ${f(0.5, 'var(--bad)')} stroke="var(--bad)" stroke-width="2.5"/>
<path d="M86 93l-3 8M90 93l2 8" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M78 66q4 4 6 2"/>
<path d="M36 64q-10 10-6 18l8 4" stroke-width="3.5"/>
<path d="M38 86l-14-30" stroke-width="2.5"/><path d="M24 56q-6-10 0-16 6 8 0 16" ${f(0.3, 'var(--chalk)')} stroke-width="2"/>
<path d="M6 8h32a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H20l-8 7v-7H6a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" ${f(0.1, 'var(--chalk)')} stroke-width="2.5"/>
<circle cx="22" cy="15" r="3" stroke-width="2"/><path d="M22 18v7M17 21h10M22 25l-3 4M22 25l3 4" stroke-width="2"/>`);

  /* Kvakksalveren (boss): flosshatt, voksbart, slangeolje i alle lommer — og en slange rundt flaska. */
  add('kvakksalveren', `<radialGradient id="kvakksalveren-glow"><stop offset="0" stop-color="var(--warn)" stop-opacity=".5"/><stop offset="1" stop-color="var(--warn)" stop-opacity="0"/></radialGradient>
${shadow(46, 58)}
<circle cx="98" cy="38" r="26" fill="url(#kvakksalveren-glow)" stroke="none"/>
<path d="M53 92v14h-8M67 92v14h8" stroke-width="4"/>
<path d="M44 54q-12 6-14 26l-8 26 22-6 8-30ZM76 54q12 6 14 26l6 24-20-4-8-30Z" ${f(0.45)}/>
<path d="M45 54h30l-3 40H48Z" ${f(0.18, 'var(--chalk)')}/>
<path d="M45 54l8 18 5-16M75 54l-8 18-5-16" stroke-width="3"/>
<path d="M52 56l8 4 8-4v8l-8-4-8 4Z" ${f(0.6)} stroke-width="2.5"/>
<circle cx="60" cy="74" r="2.2" fill="var(--gold)" stroke="none"/><circle cx="60" cy="83" r="2.2" fill="var(--gold)" stroke="none"/>
<path d="M58 82q-10 2-12 8" stroke="var(--gold)" stroke-width="1.5"/>
<path d="M27 86h14l-2 12H29Z" ${f(0.25, 'var(--chalk)')} stroke-width="2.5"/>
<path d="M30 86v-8h4v8M35 86v-6h4v6" ${f(0.5, 'var(--good)')} stroke-width="2"/>
<path d="M40 80q8-8 4-14" stroke="var(--good)" stroke-width="3.5"/><circle cx="44" cy="65" r="2.5" fill="var(--good)" stroke="var(--good)" stroke-width="1.5"/>
<path d="M46 63l3-3m-3 3l4 0" stroke="var(--bad)" stroke-width="1.2"/>
<path d="M42 58Q28 64 24 78" stroke-width="4"/>
<path d="M22 74l-5 34" stroke="var(--chalk-dim)" stroke-width="3"/><circle cx="23" cy="70" r="4.5" fill="var(--gold)" fill-opacity=".7" stroke-width="2.5"/>
<path d="M78 58q10-2 12-12" stroke-width="4"/>
<circle cx="60" cy="40" r="13" ${f(0.18, 'var(--chalk)')}/>
<path d="M34 29q26 6 52 0" stroke-width="4"/>
<path d="M44 29l-3-25h38l-3 25" ${f(0.75, 'var(--board)')}/>
<path d="M43 22q17 4 34 0" stroke="${R}" stroke-width="5"/>
${eye(54, 39, 3.6, 1, 0)}
<path d="M62 40q4-3 8 0" stroke-width="3"/>
<path d="M49 32l8 2M62 31l9-3" stroke-width="2.5"/>
<path d="M60 39l-2 6h3" stroke-width="2.5"/>
<path d="M60 48q-8-5-14 0-5 1-4-4M60 48q8-5 14 0 5 1 4-4" stroke-width="3"/>
<path d="M53 51q7 4 14 0" stroke-width="2"/>
<rect x="61" y="51" width="3" height="2.5" fill="var(--gold)" stroke="none"/>
<path d="M95 18h10M97 18v-6h6v6" stroke-width="3"/>
<rect x="95" y="5" width="10" height="7" rx="2" ${f(0.7, 'var(--heat)')} stroke-width="2.5"/>
<path d="M96 18c0 6-10 8-10 16v26c0 3 2 4 4 4h20c2 0 4-1 4-4V34c0-8-10-10-10-16" ${f(0.5, 'var(--good)')}/>
<path d="M87 40q13 3 26 0" stroke="var(--good)" stroke-width="2"/>
<rect x="90" y="40" width="20" height="16" rx="2" ${f(0.55, 'var(--chalk)')} stroke-width="2.5"/>
<path d="M104 44q-8-2-8 3t8 3-8 4" stroke="var(--board)" stroke-width="2.5"/><circle cx="104" cy="44" r="1.5" fill="var(--board)" stroke="none"/>
<path d="M84 50q4-4 8-2M84 54q4-2 8 0" stroke-width="3"/>
${spark(80, 14, 4)}${spark(116, 12, 3)}${spark(117, 70, 3)}${spark(16, 22, 3)}`);
})();
