/* Fiender — region jorda. Krittegning på tavle, viewBox 120×120. */
(function () {
  'use strict';
  const H = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">';
  const eye = (x, y, r, dx, dy) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (dx || 0)}" cy="${y + (dy || 0)}" r="${(r * 0.48).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const star = (x, y, s) => `<path d="M${x - s} ${y}h${2 * s}M${x} ${y - s}v${2 * s}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
  const flake = (x, y, s) => `<path stroke-width="2" d="M${x - s} ${y}h${2 * s}M${x - s / 2} ${y - s * 0.87}l${s} ${s * 1.73}M${x + s / 2} ${y - s * 0.87}l${-s} ${s * 1.73}"/>`;
  const sun = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--warn)" fill-opacity=".35" stroke="var(--warn)" stroke-width="2.5"/><path stroke="var(--warn)" stroke-width="2.5" d="M${x} ${y - r - 3}v-4M${x} ${y + r + 3}v4M${x - r - 3} ${y}h-4M${x + r + 3} ${y}h4M${x - r} ${y - r}l-3-3M${x + r} ${y - r}l3-3M${x - r} ${y + r}l-3 3M${x + r} ${y + r}l3 3"/>`;

  NG.art.add('manefaseskyggen', `${H}
${sun(104, 14, 7)}
<path d="M30 80C14 86 8 98 14 110C18 100 24 98 30 98C28 106 32 112 38 114C38 104 40 98 44 94" fill="var(--r-jorda)" fill-opacity=".3" stroke-width="3"/>
<circle cx="56" cy="62" r="34" fill="var(--r-jorda)" fill-opacity=".35"/>
<path d="M56 28A34 34 0 0 1 56 96A20 34 0 0 0 56 28Z" fill="var(--chalk)" fill-opacity=".45" stroke-width="3"/>
<path d="M30 46c4-2 8 0 8 4c-2 4-8 4-10 0ZM40 80c4-4 10-2 10 2c-2 4-8 4-10-2Z" fill="var(--chalk-dim)" fill-opacity=".3" stroke="none"/>
<path d="M30 42l12 6M60 40l-10 6" stroke="var(--warn)" stroke-width="2.5"/>
<ellipse cx="38" cy="54" rx="4" ry="3" fill="var(--warn)" stroke="none"/><ellipse cx="52" cy="52" rx="4" ry="3" fill="var(--warn)" stroke="none"/>
<path d="M32 66q10 10 22 0q-10 4-22 0Z" fill="var(--board)" stroke-width="2.5"/>
<path d="M37 68l2 3M43 69v3M49 68l-1 3" stroke-width="1.8"/>
<path d="M60 36c6-2 10 0 10 4M62 32l4-4M66 36l5-3M60 90c6 2 10 0 10-4M62 94l4 4M66 90l5 3" stroke-width="2.5"/>
${eye(80, 58, 4, -1.5, 0)}
<path d="M75 52l8-2" stroke-width="2"/>
<path d="M78 70q4-2 6 0" stroke-width="2"/>
<path d="M86 64q2 4 0 6q-2-2 0-6Z" fill="var(--r-stoffer)" fill-opacity=".6" stroke="var(--r-stoffer)" stroke-width="1.5"/>
</svg>`);

  NG.art.add('tyngdelosingen', `${H}
${star(10, 14, 3)}${star(108, 50, 3)}${star(80, 10, 2.5)}${star(52, 108, 2.5)}
<circle cx="18" cy="102" r="11" fill="var(--r-jorda)" fill-opacity=".35"/>
<path d="M2 106c10-8 26-14 34-12" stroke-width="2.5"/>
<path d="M60 90L36 100M36 100l8 1M36 100l5-6" stroke="var(--warn)" stroke-width="2.5" stroke-dasharray="1 0"/>
<path d="M50 88l-6 2" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M82 86l16 6l8-6M78 92l12 14l8-4" stroke-width="5"/>
<ellipse cx="72" cy="76" rx="20" ry="13" transform="rotate(35 72 76)" fill="var(--r-jorda)" fill-opacity=".35"/>
<path d="M66 70l12 8" stroke-width="2.5"/>
<path d="M62 62C44 68 26 56 28 36" stroke-width="5"/>
<path d="M78 64C86 50 76 34 66 28" stroke-width="5"/>
<circle cx="50" cy="44" r="20" fill="var(--chalk)" fill-opacity=".08"/>
<path d="M38 36q4-8 12-10" stroke="var(--chalk)" stroke-width="2.5" opacity=".6"/>
<circle cx="52" cy="46" r="12" fill="var(--r-jorda)" fill-opacity=".35" stroke-width="2.5"/>
<path d="M45 44q3 2 6 0M54 43q3 2 6 0" stroke-width="2.5"/>
<path d="M48 51q4 3 8 0" stroke-width="2.5"/>
<path d="M50 24V16" stroke-width="2.5"/><circle cx="50" cy="13" r="3" fill="var(--bad)" stroke="none"/>
<path d="M100 22c-4-6 4-10 6-4c4-6 10 2 4 8c-2 3-6 4-6 4c0 0-4-2-4-8Z" fill="var(--bad)" fill-opacity=".45" stroke-width="2.5"/>
<path d="M106 18l2-6" stroke-width="2"/>
<path d="M88 32l-4 2M94 40l-2 3" stroke="var(--chalk-dim)" stroke-width="2"/>
</svg>`);

  NG.art.add('ozonhullet', `${H}
${sun(60, 10, 5)}
<path d="M0 106Q60 86 120 106V120H0Z" fill="var(--r-jorda)" fill-opacity=".25" stroke="none"/>
<path d="M0 106Q60 86 120 106"/>
<path d="M2 44Q20 30 46 24M74 24Q100 30 118 44" stroke="var(--r-jorda)" stroke-width="7" stroke-dasharray="3 3"/>
<path d="M46 20l-2 8M74 20l2 8" stroke-width="2.5"/>
<path d="M60 22C52 28 66 34 58 42C52 48 50 50 50 52" stroke-width="3"/>
<path d="M60 22C68 28 56 34 64 42C70 48 72 50 72 52" stroke-width="3"/>
<path d="M44 66C40 50 52 46 60 46C68 46 82 50 76 66C74 80 66 86 60 86C52 86 46 80 44 66Z" fill="var(--r-jorda)" fill-opacity=".35"/>
${eye(53, 60, 4.5, 1.5, -1)}${eye(67, 60, 4.5, 1.5, -1)}
<path d="M48 54l8 2M72 54l-8 2" stroke-width="2.5"/>
<path d="M52 72q8 6 16 0" stroke-width="3"/>
<path d="M76 62C86 58 92 50 92 42M92 42l-2-6M92 42l4-5" stroke-width="3"/>
<path d="M44 66C34 70 28 76 26 82" stroke-width="3"/>
<path d="M22 86V70a4 4 0 0 1 8 0V86" stroke-width="2.5"/>
<circle cx="26" cy="90" r="5" fill="var(--bad)" fill-opacity=".5" stroke-width="2.5"/>
<path d="M26 86V72" stroke="var(--bad)" stroke-width="3"/>
<g stroke="var(--bad)" stroke-width="2.5"><path d="M86 100q-3-5 0-10t0-10M100 102q-3-5 0-10M14 102q3-5 0-10"/></g>
<g stroke="var(--warn)" stroke-width="2" stroke-dasharray="3 4"><path d="M56 18l-8 20M64 18l8 20"/></g>
</svg>`);

  NG.art.add('vaervirvelen', `${H}
<path d="M24 34C30 62 48 82 58 110C68 82 88 62 96 34Z" fill="var(--r-jorda)" fill-opacity=".3"/>
<path d="M30 48q30 10 60 0M38 64q22 8 44 0M46 80q12 6 28 0M52 94q6 4 12 0" stroke="var(--chalk)" stroke-width="2.5" opacity=".6"/>
<path d="M18 30C10 30 8 20 16 18C16 8 30 6 34 12C40 4 54 4 58 12C64 4 80 6 82 14C90 8 104 12 102 22C110 24 108 34 100 34Z" fill="var(--chalk)" fill-opacity=".18"/>
<path d="M30 40l2 6M44 40l-2 7M76 40l2 6" stroke="var(--r-stoffer)" stroke-width="2.5"/>
<path d="M44 52c0-3 4-3 4 0s-6 5-7 0s6-8 10-3" stroke-width="2.5"/>
${eye(70, 52, 5, 1, 1)}
<path d="M48 64q10 8 22-2" stroke-width="3"/>
<path d="M30 56C20 60 16 66 16 74" stroke-width="3"/>
${sun(14, 84, 7)}
<path d="M90 56C100 60 104 66 104 74" stroke-width="3"/>
<g stroke="var(--r-stoffer)">${flake(104, 86, 7)}</g>
<path d="M92 0L84 12h6l-6 10" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M14 104c4-6 10-4 12 0c-4 4-10 4-12 0Z" fill="var(--r-jorda)" fill-opacity=".4" stroke-width="2"/>
<path d="M98 104l6-4M104 112l6-2M8 46l-4 2" stroke="var(--chalk-dim)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('bangbomben', `${H}
<path d="M74 36l10-10l10 10l-10 10Z" fill="var(--chalk-dim)" fill-opacity=".3" stroke-width="3"/>
<path d="M90 30C96 20 92 14 100 10" stroke-width="3"/>
<path d="M100 10l8-6M100 10l10 2M100 10l4 10M100 10l-2-8M100 10l-8 2" stroke="var(--warn)" stroke-width="2.5"/>
<circle cx="100" cy="10" r="3" fill="var(--bad)" stroke="none"/>
<circle cx="54" cy="70" r="38" fill="var(--r-jorda)" fill-opacity=".32"/>
<path d="M28 52a30 30 0 0 1 18-18" stroke="var(--chalk)" stroke-width="3" opacity=".6"/>
${eye(42, 62, 9, 3, 2)}${eye(66, 58, 5.5, -2, 2)}
<path d="M32 50l10 3M60 48l12-2" stroke-width="3"/>
<path d="M34 80q18 14 38-4q-18 6-38 4Z" fill="var(--board)" stroke-width="3"/>
<path d="M42 82l1 4M50 83v5M58 82v5M66 80l-1 4" stroke-width="2"/>
<path d="M28 96c-4-4 2-8 5-5c2 3-2 6-5 4c-3-3 2-10 8-7" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M72 98c-3-3 2-6 4-4c2 2-2 5-4 3c-3-3 2-8 6-5" stroke="var(--chalk-dim)" stroke-width="2"/>
${star(52, 100, 2)}${star(82, 86, 2)}${star(22, 74, 2)}
<g stroke="var(--warn)" stroke-width="2.5"><path d="M10 20l6 6M6 34h7M22 8l2 7M112 34l-6 3M114 50h-7"/></g>
</svg>`);

  NG.art.add('kontinentkjempen', `${H}
<path d="M30 98l-2 14h22l-1-14M70 98l1 14h22l-2-14" fill="var(--r-jorda)" fill-opacity=".3" stroke-width="3"/>
<path d="M20 44L100 40L108 98L12 100Z" fill="var(--r-jorda)" fill-opacity=".3"/>
<path d="M14 78l14-4l8 8l16-10l12 8l14-10l14 6l14-4M58 42l-4 12l8 8" stroke="var(--chalk)" stroke-width="2.5" opacity=".6"/>
<path d="M22 54L82 60L80 72L20 66Z" fill="var(--r-jorda)" fill-opacity=".4" stroke-width="3"/>
<path d="M98 54L38 60L40 72L100 66Z" fill="var(--r-jorda)" fill-opacity=".4" stroke-width="3"/>
<path d="M44 12L76 10L80 40L42 42Z" fill="var(--r-jorda)" fill-opacity=".4"/>
<path d="M48 22l26-2" stroke-width="3.5"/>
<path d="M50 28h8M64 27h8" stroke-width="3"/>
<circle cx="55" cy="29" r="1.8" fill="var(--chalk)"/><circle cx="68" cy="28" r="1.8" fill="var(--chalk)"/>
<path d="M54 36l12-1" stroke-width="3"/>
<path d="M16 44l6-12l6 12" fill="var(--heat)" fill-opacity=".45" stroke-width="2.5"/>
<path d="M22 30c-4-6 4-8 0-14" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M100 40v-8M96 34l4-6l4 6" stroke="var(--r-liv)" stroke-width="2.5"/>
<path d="M4 82h8M4 82l3-3M4 82l3 3M116 84h-8M116 84l-3-3M116 84l-3 3" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M26 92l-3 3M90 92l4 2" stroke="var(--chalk-dim)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('drivhusdemonen', `${H}
${sun(12, 12, 6)}
<path d="M22 22l20 20M28 14l22 22" stroke="var(--warn)" stroke-width="2" stroke-dasharray="3 4"/>
<path d="M34 44C26 36 22 28 22 18C28 26 34 30 40 38M86 44C94 36 98 28 98 18C92 26 86 30 80 38" fill="var(--chalk)" fill-opacity=".2" stroke-width="3"/>
<path d="M98 96C110 98 116 88 110 78" stroke-width="3"/>
<path d="M104 78l6-6l4 8Z" fill="var(--bad)" fill-opacity=".5" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M22 108V56L60 24L98 56V108Z" fill="var(--r-jorda)" fill-opacity=".25"/>
<path d="M41 40V108M79 40V108M60 24V82M22 82H98M32 48h56" stroke-width="2" opacity=".7"/>
<path d="M30 74c4-8 12-6 12-6M24 58l4 4" stroke="var(--chalk)" stroke-width="2" opacity=".5"/>
<path d="M30 60l12 6l-12 4ZM90 60l-12 6l12 4Z" fill="var(--bad)" fill-opacity=".7" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M46 108V86H74V108" fill="var(--board)" stroke-width="3"/>
<path d="M46 86l4 6l4-6l4 6l4-6l4 6l4-6l4 6" fill="var(--chalk)" fill-opacity=".5" stroke-width="2"/>
<path d="M28 100q4-6 0-12M92 100q-4-6 0-12M54 104q3-4 6 0t6 0" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M10 108h100" stroke="var(--chalk-dim)" stroke-width="2.5"/>
</svg>`);

  NG.art.add('arstidsdragen', `${H}
<ellipse cx="60" cy="66" rx="50" ry="22" transform="rotate(-12 60 66)" stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="3 5"/>
<path d="M54 44C50 28 38 14 16 6Q22 18 16 28Q26 30 26 40Q34 42 38 50Z" fill="var(--r-jorda)" fill-opacity=".3" stroke-width="3"/>
<path d="M52 42L18 28M46 44L26 40" stroke-width="2"/>
<path d="M21 52l2-8l5 6M35 46l4-7l3 7M51 42l4-7l3 7M76 40l5-6l2 7M96 43l6-5l1 7" fill="var(--chalk)" fill-opacity=".3" stroke-width="2.5"/>
<path d="M11 75.6A50 22-12 0 1 108.7 54.9" stroke-width="14"/>
<path d="M11 75.6A50 22-12 0 1 108.7 54.9" stroke="var(--board)" stroke-width="8"/>
<path d="M11 75.6A50 22-12 0 1 108.7 54.9" stroke="var(--r-jorda)" stroke-opacity=".45" stroke-width="8"/>
<path d="M11 75.6A50 22-12 0 1 108.7 54.9" stroke-width="1.5" stroke-dasharray="1 6"/>
<circle cx="74" cy="64" r="22" fill="var(--warn)" fill-opacity=".12" stroke="none"/>
<circle cx="74" cy="64" r="13" fill="var(--warn)" fill-opacity=".45" stroke="var(--warn)" stroke-width="3"/>
<path stroke="var(--warn)" stroke-width="2.5" d="M74 46v-3M74 82v3M56 64h-3M92 64h3M61 51l-2-2M87 51l2-2M61 77l-2 2M87 77l2 2"/>
<path d="M69 61v1M79 61v1M70 69q4-3 8 0" stroke="var(--board)" stroke-width="2.5"/>
<path d="M84 56q2 4 0 6q-2-2 0-6Z" fill="var(--r-stoffer)" stroke="none"/>
<path d="M32.1 89.2A50 22-12 0 1 11 75.6" stroke-width="10"/>
<path d="M32.1 89.2A50 22-12 0 1 11 75.6" stroke="var(--board)" stroke-width="4"/>
<path d="M32.1 89.2A50 22-12 0 1 11 75.6" stroke="var(--r-jorda)" stroke-opacity=".45" stroke-width="4"/>
<path d="M32 89l8 6l-2-9l-6 3" fill="var(--bad)" fill-opacity=".5" stroke-width="2.5"/>
<path d="M108.7 54.9A50 22-12 0 1 100.4 71.9C110 66 116 48 106 36" stroke-width="14"/>
<path d="M108.7 54.9A50 22-12 0 1 100.4 71.9C110 66 116 48 106 36" stroke="var(--board)" stroke-width="8"/>
<path d="M108.7 54.9A50 22-12 0 1 100.4 71.9C110 66 116 48 106 36" stroke="var(--r-jorda)" stroke-opacity=".45" stroke-width="8"/>
<path d="M90 80l-6 12M84 92l-3 3M84 92h4" stroke-width="3"/>
<circle cx="80" cy="100" r="7" fill="var(--r-stoffer)" fill-opacity=".45" stroke-width="2.5"/>
<path d="M76 98q3-3 5 0t4 2M78 104h4" stroke="var(--r-liv)" stroke-width="2"/>
<path d="M114 32C112 20 102 16 94 20L80 24C76 26 77 32 82 32L94 34C102 38 112 38 114 32Z" fill="var(--r-jorda)" fill-opacity=".5"/>
<path d="M104 20l10-12M98 19l2-12" stroke-width="3"/>
${eye(98, 26, 3.6, -1.5, 0)}
<path d="M93 22l8 1" stroke-width="2.5"/>
<path d="M84 32l3 3M90 33l1 3" stroke-width="2"/>
<path d="M78 26C70 22 66 28 58 24M78 30C70 32 66 30 60 34" stroke="var(--bad)" stroke-width="2.5"/>
<path d="M54 22q-4-2-6 2q4 2 6-2ZM56 36q-4 2-2 6q4-2 2-6Z" fill="var(--warn)" fill-opacity=".6" stroke="var(--warn)" stroke-width="1.5"/>
<g stroke="var(--r-stoffer)">${flake(8, 96, 5)}</g>
<path d="M112 92q-3-5 0-10M104 98q-3-5 0-10" stroke="var(--bad)" stroke-width="2.5"/>
</svg>`);
})();
