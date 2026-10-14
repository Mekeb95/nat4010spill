/* Fiender — region liv. Krittegning på tavle, viewBox 120×120. */
(function () {
  'use strict';
  const H = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">';
  const eye = (x, y, r, dx, dy) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (dx || 0)}" cy="${y + (dy || 0)}" r="${(r * 0.48).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const bolt = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M4-10L-4 1h5l-3 9l8-12h-5l3-8Z" fill="var(--warn)" fill-opacity=".5" stroke="var(--warn)" stroke-width="${(2.5 / s).toFixed(2)}"/>`;
  const leaf = (x, y, a, s) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})" d="M0 0C4-8 14-10 20-8C16 0 8 4 0 0ZM0 0l12-5" fill="var(--r-liv)" fill-opacity=".45" stroke-width="2.5"/>`;

  NG.art.add('energimakeren', `${H}
<path d="M40 88l-4 18h-8M76 88l4 18h8"/>
<path d="M14 62C14 40 36 30 60 30C86 30 104 42 104 62C104 82 84 92 60 92C34 92 14 84 14 62Z" fill="var(--r-liv)" fill-opacity=".3"/>
<path d="M22 64c4-10 8-10 10 0s8 10 10 0s8-10 10 0s8 10 10 0s8-10 10 0s8 10 10 0s8-10 10 0" stroke="var(--r-liv)" stroke-width="2.5"/>
${eye(46, 48, 6, 1, 1)}${eye(68, 47, 6, 1, 1)}
<path d="M38 38l10 4M76 37l-9 4" stroke-width="3"/>
<path d="M48 78q12 8 24-1" stroke-width="3"/>
<path d="M104 60h8v-16h6" stroke-width="3"/>
<circle cx="118" cy="44" r="1" stroke-width="5"/>
<path d="M108 32a10 10 0 0 0-8-8M100 24l1 5M100 24l5 0" stroke="var(--chalk-dim)" stroke-width="2"/>
${bolt(36, 16, 1.1)}${bolt(60, 10, 1.3)}${bolt(84, 18, 1)}
<path d="M16 22h6M19 19v6M98 6h6M101 3v6" stroke="var(--warn)" stroke-width="2"/>
</svg>`);

  NG.art.add('nattpusteren', `${H}
<path d="M18 8A14 14 0 1 0 32 30A11 11 0 1 1 18 8Z" fill="var(--warn)" fill-opacity=".3" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M44 10h6M47 7v6M100 12h6M103 9v6M110 70h4M112 68v4" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M40 112l-4-24h48l-4 24Z" fill="var(--chalk-dim)" fill-opacity=".22"/>
<path d="M34 88h52" stroke-width="4"/>
<path d="M60 88V60"/>
${leaf(60, 78, 200, 1.1)}${leaf(60, 74, -20, 1.1)}
<circle cx="56" cy="48" r="20" fill="var(--r-liv)" fill-opacity=".35"/>
<path d="M38 40C40 22 60 14 74 22L88 34" fill="var(--r-stoffer)" fill-opacity=".25"/>
<circle cx="90" cy="37" r="4.5" fill="var(--chalk)" fill-opacity=".5"/>
<path d="M44 48q4 3 8 0M60 48q4 3 8 0" stroke-width="3"/>
<circle cx="66" cy="58" r="3" stroke-width="2.5"/>
<g stroke="var(--chalk-dim)" stroke-width="2.5" fill="var(--chalk)" fill-opacity=".1"><circle cx="80" cy="62" r="5"/><circle cx="92" cy="58" r="7"/><circle cx="106" cy="52" r="9"/></g>
</svg>`);

  NG.art.add('jordspiseren', `${H}
<path d="M6 104h108" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M40 98c-4 6-10 6-14 10M54 100c0 6-4 10-2 14M70 98c4 6 10 6 12 12" stroke-width="3"/>
<path d="M26 70C26 48 40 38 56 38C72 38 86 48 86 70C86 92 72 100 56 100C40 100 26 92 26 70Z" fill="var(--r-liv)" fill-opacity=".32"/>
${leaf(52, 40, -110, 1.1)}${leaf(58, 40, -60, 1.2)}${leaf(48, 42, -150, 1)}
<path d="M34 58q5-4 10 0M58 58q5-4 10 0" stroke-width="3"/>
<circle cx="36" cy="72" r="5" fill="var(--bad)" fill-opacity=".3" stroke="none"/><circle cx="72" cy="72" r="5" fill="var(--bad)" fill-opacity=".3" stroke="none"/>
<path d="M44 70q10 14 22 0Z" fill="var(--board)" stroke-width="3"/>
<path d="M84 74c8 0 12-6 16-12M64 74l34-14" stroke-width="3"/>
<path d="M96 54c4-4 12-2 12 4c-2 6-10 6-12-4Z" fill="var(--heat)" fill-opacity=".7" stroke-width="2.5"/>
<path d="M90 112l4-20h20l4 20" fill="var(--heat)" fill-opacity=".25" stroke-width="3"/>
<path d="M94 96c4-4 8-2 10-4s6-2 10 2" stroke="var(--heat)" stroke-width="3"/>
<g fill="var(--heat)" stroke="none"><circle cx="50" cy="82" r="1.8"/><circle cx="60" cy="86" r="1.8"/><circle cx="56" cy="80" r="1.4"/><circle cx="30" cy="94" r="1.8"/></g>
</svg>`);

  NG.art.add('evighetskjeden', `${H}
<path d="M44 62a16 16 0 1 1 6 12" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M50 74l-1-7M50 74l-7 1" stroke="var(--warn)" stroke-width="2.5"/>
${bolt(60, 62, 1.4)}
<g stroke-width="3"><ellipse cx="80" cy="34.5" rx="11" ry="6" transform="rotate(36 80 34.5)" fill="var(--r-liv)" fill-opacity=".4"/><ellipse cx="92.3" cy="51.5" rx="11" ry="6" transform="rotate(72 92.3 51.5)"/><ellipse cx="92.3" cy="72.5" rx="11" ry="6" transform="rotate(108 92.3 72.5)" fill="var(--r-liv)" fill-opacity=".4"/><ellipse cx="80" cy="89.5" rx="11" ry="6" transform="rotate(144 80 89.5)"/><ellipse cx="60" cy="96" rx="11" ry="6" fill="var(--r-liv)" fill-opacity=".4"/><ellipse cx="40" cy="89.5" rx="11" ry="6" transform="rotate(36 40 89.5)"/><ellipse cx="27.7" cy="72.5" rx="11" ry="6" transform="rotate(72 27.7 72.5)" fill="var(--r-liv)" fill-opacity=".4"/><ellipse cx="27.7" cy="51.5" rx="11" ry="6" transform="rotate(108 27.7 51.5)"/><ellipse cx="40" cy="34.5" rx="11" ry="6" transform="rotate(144 40 34.5)" fill="var(--r-liv)" fill-opacity=".4"/></g>
<path d="M84 26C80 14 68 10 58 14C48 18 46 26 48 32L60 30L52 38C58 42 70 40 76 34" fill="var(--r-liv)" fill-opacity=".45"/>
${eye(68, 20, 4.5, -1.5, 0)}
<path d="M62 14l10 2" stroke-width="2.5"/>
<path d="M51 32l3 3M57 31l1 3" stroke-width="2"/>
${leaf(100, 84, 20, .9)}${leaf(18, 60, 200, .9)}
<path d="M106 34l6-4M110 44h6M8 88l-5 3M12 98l-4 4" stroke="var(--warn)" stroke-width="2"/>
</svg>`);

  NG.art.add('lamarck-larven', `${H}
${leaf(88, 14, 0, 1.2)}<path d="M88 14l-6-4" stroke-width="2.5"/>
<path d="M14 108l-2 5M28 110v4M42 110v4M56 108l2 5" stroke-width="2.5"/>
<g fill="var(--r-liv)" fill-opacity=".35"><circle cx="16" cy="98" r="10"/><circle cx="30" cy="100" r="10"/><circle cx="44" cy="100" r="10"/><circle cx="58" cy="97" r="10"/></g>
<path d="M62 88C64 70 70 50 76 38L94 40C88 54 80 74 74 96" fill="var(--r-liv)" fill-opacity=".35"/>
<path d="M66 78l12 4M69 66l13 4M73 54l13 4M76 44l11 3" stroke="var(--chalk)" stroke-width="2" opacity=".6"/>
<g fill="var(--warn)" fill-opacity=".5" stroke="none"><circle cx="72" cy="72" r="3"/><circle cx="80" cy="60" r="2.5"/><circle cx="76" cy="86" r="2.5"/></g>
<circle cx="86" cy="32" r="13" fill="var(--r-liv)" fill-opacity=".4"/>
<path d="M80 20l-6-10M90 20l4-12" stroke-width="2.5"/>
<circle cx="74" cy="9" r="2.5" fill="var(--chalk)" stroke="none"/><circle cx="94" cy="7" r="2.5" fill="var(--chalk)" stroke="none"/>
${eye(82, 30, 4, 1.5, -1.5)}${eye(93, 29, 4, 1.5, -1.5)}
<path d="M77 23l8 3M98 22l-6 3" stroke-width="2.5"/>
<path d="M84 39h10M86 37v4M90 37v4" stroke-width="2"/>
<path d="M104 30q3 4 0 6q-3-2 0-6ZM100 42q3 4 0 6q-3-2 0-6Z" fill="var(--r-stoffer)" fill-opacity=".6" stroke="var(--r-stoffer)" stroke-width="1.5"/>
<path d="M60 48l-6-2M62 40l-6-4M100 60l6-2" stroke="var(--chalk-dim)" stroke-width="2.5"/>
${eye(12, 96, 2.5)}
</svg>`);

  NG.art.add('muggmesteren', `${H}
<path d="M6 112V88C6 76 18 72 26 78C30 66 48 64 56 72C62 64 80 64 86 72C94 66 114 70 114 86V112" fill="var(--warn)" fill-opacity=".18" stroke-width="3"/>
<path d="M14 112V90C14 84 20 82 26 86M106 112V90C106 84 100 82 94 86" stroke="var(--warn)" stroke-width="2" opacity=".6"/>
<path d="M30 46V24M44 40V12M60 38V6M76 40V12M90 46V24M38 42l-6-12M84 42l6-12" stroke-width="2.5"/>
<g fill="var(--r-liv)" fill-opacity=".6" stroke-width="2.5"><circle cx="30" cy="22" r="4"/><circle cx="44" cy="10" r="4"/><circle cx="60" cy="5" r="4"/><circle cx="76" cy="10" r="4"/><circle cx="90" cy="22" r="4"/><circle cx="31" cy="29" r="3"/><circle cx="91" cy="29" r="3"/></g>
<path d="M22 92C14 90 14 80 20 76C14 70 18 60 26 60C26 50 36 44 44 48C48 40 60 40 64 46C70 40 82 42 84 50C92 48 100 56 96 64C104 66 106 76 100 80C106 86 100 94 92 92Z" fill="var(--r-liv)" fill-opacity=".35"/>
<g stroke="var(--r-liv)" stroke-width="2"><path d="M30 70l-4-3M88 70l4-3M40 54l-2-4M80 56l3-3M24 84l-4 1M98 84l4 1"/></g>
${eye(48, 66, 7, 2, -1)}${eye(72, 66, 7, -2, -1)}
<path d="M38 56l12 3M82 56l-12 3" stroke-width="3"/>
<path d="M50 80q10 8 20 0" stroke-width="3"/>
<path d="M54 82l2 4M64 82l-1 4" stroke-width="2"/>
<path d="M4 40h12v20q0 4-4 4H8q-4 0-4-4Z M104 40h12v20q0 4-4 4h-4q-4 0-4-4Z" fill="var(--chalk)" fill-opacity=".1" stroke-width="2.5"/>
<path d="M8 48q2-3 4 0q0 2-2 3v2M108 48q2-3 4 0q0 2-2 3v2" stroke="var(--warn)" stroke-width="2"/>
<circle cx="10" cy="58" r=".8" stroke="var(--warn)" stroke-width="2"/><circle cx="110" cy="58" r=".8" stroke="var(--warn)" stroke-width="2"/>
</svg>`);

  NG.art.add('karbonkraken', `${H}
<path d="M8 112c6-6 14-6 20-2c4-6 12-6 16 0" fill="var(--heat)" fill-opacity=".3" stroke="var(--heat)" stroke-width="2.5"/>
<path d="M14 104v-6l-3-4M14 98l4-5M32 102v-6" stroke="var(--r-liv)" stroke-width="2"/>
<g fill="var(--r-liv)" fill-opacity=".3"><path d="M40 62C30 72 18 70 14 60C12 54 18 50 22 54"/><path d="M80 62C90 72 102 70 106 60C108 54 102 50 98 54"/></g>
<path d="M40 62C30 72 18 70 14 60C12 54 18 50 22 54M80 62C90 72 102 70 106 60C108 54 102 50 98 54M46 68C42 84 30 92 22 88M74 68C78 84 90 92 98 88M54 70C52 88 54 100 62 106C66 108 70 104 66 100M66 70C70 84 76 92 86 98"/>
<path d="M44 42C38 64 46 74 60 74C74 74 82 64 76 42C72 22 48 22 44 42Z" fill="var(--r-liv)" fill-opacity=".35"/>
<path d="M50 26C46 18 54 12 60 12C68 12 76 18 70 26" fill="var(--r-liv)" fill-opacity=".35"/>
${eye(52, 50, 6, 1, 1)}${eye(68, 50, 6, -1, 1)}
<path d="M44 40l12 5M76 40l-12 5" stroke-width="3"/>
<path d="M54 64q6-4 12 0" stroke-width="3"/>
<g fill="var(--chalk-dim)" fill-opacity=".3" stroke-width="2.5"><circle cx="18" cy="26" r="6"/><circle cx="104" cy="26" r="6"/><circle cx="104" cy="104" r="5"/></g>
<g fill="var(--bad)" fill-opacity=".45" stroke-width="2.5"><circle cx="7" cy="26" r="4.5"/><circle cx="29" cy="26" r="4.5"/><circle cx="93" cy="26" r="4.5"/><circle cx="115" cy="26" r="4.5"/><circle cx="95" cy="104" r="3.5"/><circle cx="113" cy="104" r="3.5"/></g>
<path d="M22 54C20 44 18 36 18 32M98 54C100 44 104 36 104 32" stroke-width="3"/>
<path d="M34 112l-4-6M30 112l4-6" stroke="var(--bad)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('pustetrollet', `${H}
<path d="M24 112C18 92 22 74 34 70H86C98 74 102 92 96 112Z" fill="var(--r-liv)" fill-opacity=".28"/>
<path d="M34 70C22 74 18 66 22 60C18 54 26 48 32 52M86 70C98 74 102 66 98 60C102 54 94 48 88 52" fill="var(--r-liv)" fill-opacity=".55" stroke-width="3"/>
<path d="M36 86c-8 6-10 14-8 22M84 86c8 6 10 14 8 22" stroke-width="3"/>
<path d="M40 96c2-4 6-4 8 0q2-3 4 0M72 104c2-4 6-4 8 0" stroke="var(--r-liv)" stroke-width="2.5"/>
<path d="M28 44C14 40 10 30 12 24C20 26 26 32 30 38M92 44C106 40 110 30 108 24C100 26 94 32 90 38" fill="var(--r-liv)" fill-opacity=".3" stroke-width="3"/>
<path d="M30 46C28 24 42 14 60 14C78 14 92 24 90 46C90 66 78 76 60 76C42 76 30 66 30 46Z" fill="var(--r-liv)" fill-opacity=".3"/>
<path d="M30 34C30 18 46 8 60 10C76 8 92 18 90 34C84 28 78 32 74 26C70 32 62 28 58 24C54 30 46 28 42 26C40 32 34 30 30 34Z" fill="var(--r-liv)" fill-opacity=".6" stroke-width="3"/>
<path d="M60 11V4" stroke-width="2.5"/>
${leaf(60, 5, -160, .6)}${leaf(60, 5, -20, .6)}
<path d="M40 38l8 4l-8 4M80 38l-8 4l8 4" stroke-width="3"/>
<path d="M38 34l10 2M82 34l-10 2" stroke-width="2.5"/>
<circle cx="40" cy="58" r="11" fill="var(--bad)" fill-opacity=".5" stroke="var(--bad)" stroke-width="3"/>
<circle cx="80" cy="58" r="11" fill="var(--bad)" fill-opacity=".5" stroke="var(--bad)" stroke-width="3"/>
<path d="M36 55l3-2M76 55l3-2" stroke="var(--chalk)" stroke-width="2" opacity=".7"/>
<ellipse cx="60" cy="52" rx="8" ry="7" fill="var(--r-liv)" fill-opacity=".45" stroke-width="3"/>
<path d="M52 66q8 3 16 0" stroke-width="3"/>
<path d="M51 63l1 3M69 63l-1 3" stroke-width="2.5"/>
<path d="M14 56q-4-4-2-8M106 56q4-4 2-8M18 66h-6M102 66h6" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M26 18q3 4 0 6q-3-2 0-6ZM96 16q3 4 0 6q-3-2 0-6Z" fill="var(--r-stoffer)" fill-opacity=".6" stroke="var(--r-stoffer)" stroke-width="1.5"/>
<path d="M100 112v-8a6 4 0 0 1 12 0h-12M108 104v8" stroke="var(--warn)" stroke-width="2.5" fill="var(--warn)" fill-opacity=".25"/>
<path d="M10 112c0-6 4-10 10-8" stroke="var(--r-liv)" stroke-width="2.5"/>
</svg>`);
})();
