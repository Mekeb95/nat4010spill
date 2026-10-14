/* Fiender — region stoffer. Krittegning på tavle, viewBox 120×120. */
(function () {
  'use strict';
  const H = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">';
  const eye = (x, y, r, dx, dy) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (dx || 0)}" cy="${y + (dy || 0)}" r="${(r * 0.48).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.6}" fill="var(--chalk)" stroke="none"/>`;

  NG.art.add('forsvinneren', `${H}
<path d="M30 66q8-4 15 0t15 0t15 0t15 0V102q0 6-6 6H36q-6 0-6-6Z" fill="var(--r-stoffer)" fill-opacity=".25" stroke="none"/>
<path d="M28 66q8-4 16 0t16 0t16 0t16 0" stroke="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M24 46h6v56q0 8 8 8h44q8 0 8-8V46h6" />
<path d="M84 52v10M84 76v8" stroke="var(--chalk)" stroke-width="2" opacity=".5"/>
<g opacity=".7">${dot(40, 78)}${dot(48, 90)}${dot(58, 100)}${dot(66, 84)}${dot(76, 96)}${dot(44, 100)}${dot(72, 74)}${dot(54, 80, 1.3)}${dot(80, 88, 1.3)}${dot(62, 94, 1.3)}</g>
<path d="M44 64V26h32v38" fill="var(--chalk)" fill-opacity=".14"/>
<path d="M44 26l8-8h32l-8 8M84 18v38l-8 8" fill="var(--chalk)" fill-opacity=".08"/>
<path d="M44 66v18h32V66M76 66l8-8" stroke-dasharray="2 5" stroke-width="2.5" opacity=".6"/>
<path d="M45 32l8 3" stroke-width="2.5"/>
${eye(54, 41, 4.5, 2, 0)}${eye(68, 41, 4.5, 2, 0)}
<path d="M58 53q3 2 6 0" stroke-width="2.5"/>
<path d="M44 58C52 62 58 60 60 55M60 55V46" stroke-width="3"/>
<path d="M98 30q4-4 8 0M100 22q4-4 8 0" stroke="var(--chalk-dim)" stroke-width="2"/>
</svg>`);

  NG.art.add('smeltemannen', `${H}
<ellipse cx="60" cy="104" rx="50" ry="8" fill="var(--r-stoffer)" fill-opacity=".22" stroke-width="2.5"/>
<path d="M38 36Q60 30 82 36L84 70Q86 82 92 90Q100 96 98 101Q60 108 22 101Q20 96 28 90Q34 82 36 70Z" fill="var(--r-stoffer)" fill-opacity=".3"/>
<path d="M38 36l8-8h38l-2 8M84 28v36l-2 6" fill="var(--r-stoffer)" fill-opacity=".15" stroke-width="3"/>
<path d="M44 42l4-4M76 46l3-3" stroke="var(--chalk)" stroke-width="2.5" opacity=".7"/>
<path d="M37 41h46" stroke-width="3"/>
<circle cx="50" cy="40" r="6" fill="var(--board)" stroke-width="2.5"/><circle cx="70" cy="40" r="6" fill="var(--board)" stroke-width="2.5"/>
<path d="M48 38l2-2M68 38l2-2" stroke="var(--chalk)" stroke-width="1.5"/>
<path d="M44 54q6-4 10 1M66 55q4-5 10-1" stroke-width="2.5"/>
${eye(50, 60, 4.5, 0, 1.5)}${eye(70, 60, 4.5, 0, 1.5)}
<path d="M50 75q5-4 10 0t10 0" stroke-width="3"/>
<path d="M86 64q4 4 1 8q-4 3-6-2Z M30 76q-4 4-1 8q4 3 6-2Z" fill="var(--r-stoffer)" fill-opacity=".5" stroke-width="2"/>
<g stroke="var(--chalk-dim)" stroke-width="2.5"><path d="M48 28q-4-6 0-12t0-10M62 26q4-6 0-12M74 30q-3-6 1-12"/></g>
<path d="M102 10l3 9l9-3l-6 8l7 6l-9 1l1 9l-6-7l-6 7l1-9l-9-1l7-6l-6-8l9 3Z" fill="var(--warn)" fill-opacity=".3" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M102 25v6M99 28h6" stroke="var(--warn)" stroke-width="2"/>
<path d="M88 58q8-6 10-18" stroke-width="3"/>
</svg>`);

  NG.art.add('luftlosen', `${H}
<path d="M24 112l4-20h64l4 20Z" fill="var(--chalk-dim)" fill-opacity=".2"/>
<path d="M20 90h80" stroke-width="4"/>
<circle cx="60" cy="102" r="7" fill="var(--board)" stroke-width="2.5"/>
<path d="M60 102v-6" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M53 100h1M67 100h-1" stroke-width="2"/>
<path d="M60 72C56 78 66 82 60 90" stroke-width="2"/>
<path d="M60 68C38 68 30 50 30 40C30 22 44 10 60 10C76 10 90 22 90 40C90 50 82 68 60 68Z" fill="var(--r-stoffer)" fill-opacity=".3"/>
<path d="M56 68l4 5l4-5" stroke-width="2.5" fill="var(--r-stoffer)" fill-opacity=".4"/>
<path d="M40 26q6-8 14-9" stroke="var(--chalk)" stroke-width="3" opacity=".7"/>
<path d="M42 33q6-4 11 0M67 33q6-4 11 0" stroke-width="2.5"/>
<path d="M44 40q4 3 8 0M68 40q4 3 8 0" stroke-width="3"/>
<path d="M52 52q8 6 16 0" stroke-width="3"/>
<circle cx="42" cy="48" r="4" fill="var(--bad)" fill-opacity=".35" stroke="none"/><circle cx="78" cy="48" r="4" fill="var(--bad)" fill-opacity=".35" stroke="none"/>
<path d="M32 50C22 50 18 44 14 36M88 50C98 50 102 44 106 36" stroke-width="3"/>
<path d="M98 76c8-2 14 4 12 10c-6-1-10-4-12-10ZM98 76l12 10" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M10 64q4-3 8 0M8 74q4-3 8 0M108 58q4-3 8 0" stroke="var(--chalk-dim)" stroke-width="2"/>
</svg>`);

  NG.art.add('atomfargeren', `${H}
<g stroke="var(--chalk-dim)" stroke-width="2.5"><ellipse cx="58" cy="60" rx="44" ry="15" transform="rotate(28 58 60)"/><ellipse cx="58" cy="60" rx="44" ry="15" transform="rotate(-28 58 60)"/></g>
${dot(22, 40, 3)}${dot(96, 82, 3)}${dot(22, 80, 3)}
<circle cx="58" cy="60" r="17" fill="var(--r-stoffer)" fill-opacity=".35"/>
<path d="M40 46C36 34 54 30 66 34C80 36 82 46 72 46C62 44 50 42 40 46Z" fill="var(--bad)" fill-opacity=".35" stroke-width="3"/>
<path d="M60 30v-4" stroke-width="3"/>
${eye(52, 56, 4, 1, 0)}${eye(64, 56, 4, 1, 0)}
<path d="M48 66q5-4 10 0q5-4 10 0" stroke-width="2.5"/>
<path d="M47 66q-4 0-4-4M69 66q4 0 4-4" stroke-width="2"/>
<path d="M74 66l14 8M88 74l12 16" stroke-width="3"/>
<path d="M98 88l6 8l-4 2l-5-7Z" fill="var(--warn)" stroke="var(--warn)" stroke-width="2"/>
<circle cx="102" cy="108" r="7" fill="var(--warn)" fill-opacity=".7" stroke-width="2.5"/>
<path d="M98 116v2M106 116v3" stroke="var(--warn)" stroke-width="2"/>
<path d="M114 100l3-3M116 108h3" stroke="var(--warn)" stroke-width="2"/>
<path d="M42 66L26 74" stroke-width="3"/>
<path d="M6 82c0-10 14-14 22-10c6 3 2 8 6 12c4 6-6 12-16 10C10 92 6 88 6 82Z" fill="var(--chalk)" fill-opacity=".12" stroke-width="2.5"/>
<circle cx="14" cy="82" r="3" fill="var(--warn)" stroke="none"/><circle cx="20" cy="76" r="3" fill="var(--bad)" stroke="none"/><circle cx="20" cy="89" r="3" fill="var(--r-stoffer)" stroke="none"/>
</svg>`);

  NG.art.add('blandingsbeisten', `${H}
<path d="M38 94v14M50 96v12M70 96v12M82 94v14" stroke-width="3.5"/>
<path d="M60 58C42 58 26 66 26 78C26 90 42 98 60 98Z" fill="var(--r-stoffer)" fill-opacity=".32"/>
<path d="M60 58C78 58 94 66 94 78C94 90 78 98 60 98Z" fill="var(--chalk-dim)" fill-opacity=".22"/>
<path d="M60 58v40" stroke-width="2.5" stroke-dasharray="1 0"/>
<path d="M56 62l8 4M56 70l8 4M56 78l8 4M56 86l8 4" stroke-width="2"/>
<g stroke-width="2"><circle cx="38" cy="74" r="3"/><circle cx="46" cy="86" r="3"/><circle cx="36" cy="86" r="2.5"/><circle cx="50" cy="70" r="2.5"/><path d="M70 70h5v5h-5ZM80 82h5v5h-5ZM72 86h4v4h-4ZM84 70h4v4h-4Z"/></g>
<path d="M40 62C36 54 34 50 34 46M80 62C84 54 86 50 86 46" stroke-width="5"/>
<circle cx="32" cy="34" r="15" fill="var(--r-stoffer)" fill-opacity=".32"/>
<path d="M74 20h26v26H74Z" fill="var(--chalk-dim)" fill-opacity=".22"/>
${eye(30, 32, 4.5, 2, 0)}${eye(40, 32, 4.5, 2, 0)}
<path d="M28 42q6-3 12 1" stroke-width="2.5"/>
<path d="M26 25l6 3M44 25l-6 3" stroke-width="2.5"/>
${eye(80, 30, 4.5, -2, 1)}${eye(92, 28, 3.5, -1, -1)}
<path d="M80 40h12l-2 4h-8Z" fill="var(--board)" stroke-width="2.5"/>
<path d="M20 22l-6-6M44 22l6-6M78 18l-4-8M96 18l4-8" stroke-width="3"/>
<path d="M96 76c8-4 14-10 14-20" stroke-width="3"/>
<path d="M104 46c0-4 10-4 10 0s-10 4-10 0ZM109 50v8" stroke-width="2.5"/>
</svg>`);

  NG.art.add('iontyven', `${H}
<path d="M42 112C38 86 44 58 64 52C84 58 90 86 86 112Z" fill="var(--r-stoffer)" fill-opacity=".32"/>
<path d="M46 72h36M44 84h40M43 96h42" stroke="var(--chalk)" stroke-width="2.5" opacity=".55"/>
<circle cx="64" cy="34" r="16" fill="var(--r-stoffer)" fill-opacity=".32"/>
<path d="M48 30C48 14 80 14 80 30Z" fill="var(--board)" stroke-width="3"/>
<path d="M60 18l4-6l4 6" stroke-width="2.5"/>
<path d="M47 34h34v8H47Z" fill="var(--board)" stroke-width="2.5"/>
${eye(57, 38, 3.4, 1.4, 0)}${eye(71, 38, 3.4, 1.4, 0)}
<path d="M56 46q8 6 16 0" stroke-width="2.5"/>
<path d="M30 46C10 46 6 72 22 80C38 86 50 70 46 54Z" fill="var(--chalk-dim)" fill-opacity=".22"/>
<path d="M44 52l6-4M42 58l-4-8" stroke-width="3"/>
<g stroke="var(--r-stoffer)" stroke-width="2.5"><path d="M18 60h6M30 66h6M20 72h6"/></g>
<path d="M50 60C42 60 40 52 44 48" stroke-width="3"/>
<path d="M82 62C90 64 94 70 96 76" stroke-width="3"/>
<path d="M92 78l6 2M94 74l6-2" stroke-width="2.5"/>
<circle cx="104" cy="77" r="4" fill="var(--chalk)" stroke="none"/><path d="M102 77h4" stroke="var(--board)" stroke-width="1.5"/>
<circle cx="96" cy="100" r="6" fill="var(--r-stoffer)" fill-opacity=".5" stroke-width="2.5"/>
<circle cx="96" cy="100" r="15" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M93 99l1 1M98 99l1 1M93 104q3-2 6 0" stroke-width="1.5"/>
<path d="M90 114l-1 4M101 114l1 3" stroke="var(--r-stoffer)" stroke-width="2"/>
<circle cx="83" cy="94" r="2.5" fill="var(--chalk)" stroke="none"/>
<path d="M8 20h8M104 12h8M110 30h6" stroke="var(--chalk-dim)" stroke-width="2.5"/>
<path d="M98 50l3 3M108 56l4 1" stroke="var(--warn)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('koeffisientkaoset', `${H}
<path d="M30 100l60-14M60 93v18M50 112h20" stroke-width="3"/>
<path d="M30 100l-6 10h14ZM90 86l-6 10h14Z" fill="var(--chalk)" fill-opacity=".15" stroke-width="2.5"/>
<path d="M60 22c10-6 22 0 22 8c10 0 16 10 10 18c8 6 2 18-8 16c-2 10-16 12-22 4c-8 8-22 4-22-6c-10 0-14-14-4-18c-6-10 4-22 14-18c2-4 6-6 10-4Z" fill="var(--r-stoffer)" fill-opacity=".3"/>
<path d="M48 44c0-3 4-3 4 0s-6 5-7 0s6-8 10-3" stroke-width="2.5"/>
<path d="M68 44c0-3 4-3 4 0s-6 5-7 0s6-8 10-3" stroke-width="2.5"/>
<path d="M46 60l4 4l4-4l4 4l4-4l4 4l4-4l4 4" stroke-width="2.5"/>
<path d="M36 50C26 46 20 38 18 30" stroke-width="3"/>
<path d="M12 16l12 16M24 16L12 32" stroke-width="2.5"/>
<circle cx="10" cy="14" r="4" stroke-width="2.5"/><circle cx="26" cy="14" r="4" stroke-width="2.5"/>
<path d="M86 42c8-6 12-14 12-22" stroke-width="3"/>
<circle cx="104" cy="14" r="7" fill="var(--bad)" fill-opacity=".45" stroke-width="2.5"/>
<circle cx="90" cy="12" r="5" fill="var(--chalk)" fill-opacity=".25" stroke-width="2.5"/>
<circle cx="112" cy="26" r="4" fill="var(--chalk)" fill-opacity=".25" stroke-width="2.5"/>
<path d="M95 13h2M108 20l2 2" stroke-width="2"/>
<path d="M88 66c8 4 14 10 16 18" stroke-width="3"/>
<path d="M32 66c-8 6-12 12-12 20" stroke-width="3"/>
<g stroke="var(--warn)" stroke-width="2.5"><path d="M98 98q3-3 6 0q0 3-6 7h6M14 44q4-3 6 1q-1 3-3 3q4 0 3 4q-2 3-6 1M104 50q3-3 6 0q0 3-6 7h6"/></g>
<path d="M50 6l2 6M70 4l-2 7" stroke="var(--chalk-dim)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('alkymisten', `${H}
<path d="M30 50C22 72 18 96 14 112H94C90 96 86 72 84 50Z" fill="var(--r-stoffer)" fill-opacity=".28"/>
<path d="M38 74l6-10l6 10ZM66 90a5 5 0 1 0 10 0a5 5 0 1 0-10 0M30 100l6-10l6 10ZM24 94h18" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M72 70l2 4l4 1l-4 2l-1 4l-2-4l-4-1l4-2Z" fill="var(--warn)" fill-opacity=".6" stroke="none"/>
<path d="M28 54C26 26 42 8 58 8C76 8 90 26 86 54C80 62 36 62 28 54Z" fill="var(--r-stoffer)" fill-opacity=".35"/>
<ellipse cx="57" cy="40" rx="15" ry="17" fill="var(--board)" stroke-width="3"/>
<circle cx="51" cy="37" r="5" fill="var(--warn)" fill-opacity=".25" stroke="none"/><circle cx="64" cy="37" r="5" fill="var(--warn)" fill-opacity=".25" stroke="none"/>
<ellipse cx="51" cy="37" rx="2.6" ry="1.8" fill="var(--warn)" stroke="none"/><ellipse cx="64" cy="37" rx="2.6" ry="1.8" fill="var(--warn)" stroke="none"/>
<path d="M45 31l8 3M70 31l-8 3" stroke="var(--warn)" stroke-width="2"/>
<path d="M46 48C42 64 46 78 52 90C54 80 60 86 60 76C64 82 68 70 68 48C60 54 52 54 46 48Z" fill="var(--chalk)" fill-opacity=".3" stroke-width="3"/>
<path d="M52 56q2 10 0 20M60 56q1 8 -1 14" stroke="var(--chalk)" stroke-width="1.5" opacity=".6"/>
<path d="M82 58C88 62 92 64 96 62" stroke-width="7"/>
<path d="M82 58C88 62 92 64 96 62" stroke="var(--board)" stroke-width="1"/>
<path d="M97 48V60a12 12 0 1 0 6 0V48" fill="var(--chalk)" fill-opacity=".12"/>
<path d="M95 47h10" stroke-width="3"/>
<path d="M89 74a12 12 0 0 0 22 0Z" fill="var(--warn)" fill-opacity=".55" stroke="none"/>
<circle cx="96" cy="74" r="1.8" stroke-width="1.5"/><circle cx="103" cy="70" r="1.4" stroke-width="1.5"/><circle cx="100" cy="64" r="1.6" stroke-width="1.5"/>
<path d="M92 98l-4 14M108 98l4 14M90 98h20" stroke-width="3"/>
<path d="M100 96c-6-4-4-8 0-12c0 4 4 2 3 0c4 4 4 8-3 12Z" fill="var(--bad)" fill-opacity=".55" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M100 44C92 38 108 32 100 24C92 16 106 12 100 4M100 34c6 0 10-4 8-8M98 18c-6 0-8-4-6-8" stroke="var(--chalk-dim)" stroke-width="3"/>
<path d="M32 60C24 64 16 62 12 56" stroke-width="7"/>
<path d="M32 60C24 64 16 62 12 56" stroke="var(--board)" stroke-width="1"/>
<path d="M6 52h16" stroke-width="3"/>
<path d="M8 50l2-6h8l2 6" fill="var(--board-4)" stroke-width="2.5"/>
<path d="M14 44c-5-4-3-9 0-12c0 3 3 2 2 0c4 4 3 9-2 12Z" fill="var(--bad)" fill-opacity=".5" stroke="var(--bad)" stroke-width="2"/>
<g stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="2 3"><circle cx="16" cy="24" r="4"/><circle cx="24" cy="14" r="3"/><circle cx="14" cy="8" r="2"/></g>
</svg>`);
})();
