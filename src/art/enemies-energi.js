/* Fiender — region energi. Krittegning på tavle, viewBox 120×120. */
(function () {
  'use strict';
  const H = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">';
  // Øye: krittfylt hvite + tavlefarget pupill (dx/dy = blikkretning)
  const eye = (x, y, r, dx, dy) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (dx || 0)}" cy="${y + (dy || 0)}" r="${(r * 0.48).toFixed(1)}" fill="var(--board)" stroke="none"/>`;
  const flake = (x, y, s) => `<path stroke-width="2" d="M${x - s} ${y}h${2 * s}M${x - s / 2} ${y - s * 0.87}l${s} ${s * 1.73}M${x + s / 2} ${y - s * 0.87}l${-s} ${s * 1.73}"/>`;

  NG.art.add('kuldespokelset', `${H}
<path d="M36 90C33 58 35 24 60 20C85 24 87 58 84 90L79 84L73 92L67 85L60 93L53 85L47 92L41 84Z" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M40 76l10-10M42 86l14-14M70 84l12-12M76 64l6-6" stroke="var(--r-energi)" stroke-width="2.5" opacity=".6"/>
<path d="M42 87L45 103L48 88ZM57 92L60 110L63 92ZM70 89L73 102L76 87Z" fill="var(--chalk)" fill-opacity=".35" stroke-width="2.5"/>
<path d="M37 56C27 55 21 49 17 41M83 56C93 55 99 49 103 41"/>
<path d="M24 50l1 9l3-8M96 50l-1 9l-3-8" stroke-width="2.5"/>
<g stroke="var(--chalk-dim)" stroke-width="3"><path d="M30 72L10 82M10 82h8M10 82l4-7M90 72l20 10M110 82h-8M110 82l-4-7M38 30L24 18M24 18l2 7M24 18l7 1M82 30l14-12M96 18l-2 7M96 18l-7 1"/></g>
${flake(14, 96, 5)}${flake(106, 96, 5)}${flake(16, 8, 4)}${flake(104, 8, 4)}
<path d="M43 36l11 4M77 36l-11 4" stroke-width="3"/>
${eye(50, 47, 6, 1.5, 1)}${eye(70, 47, 6, 1.5, 1)}
<path d="M47 60Q60 73 73 60Q60 65 47 60Z" fill="var(--board)"/>
<path d="M53 63v3M60 64v4M67 63v3" stroke-width="2"/>
</svg>`);

  NG.art.add('kraftkjempen', `${H}
<path d="M48 96l-2 13h-9M72 96l2 13h9"/>
<path d="M40 56C37 80 44 98 60 99C76 98 83 80 80 56C71 49 49 49 40 56Z" fill="var(--r-energi)" fill-opacity=".32"/>
<ellipse cx="28" cy="58" rx="14" ry="10" transform="rotate(-12 28 58)" fill="var(--r-energi)" fill-opacity=".32"/>
<ellipse cx="92" cy="58" rx="14" ry="10" transform="rotate(12 92 58)" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M17 55C11 47 12 38 16 31M28 49C27 43 27 37 26 31M103 55C109 47 108 38 104 31M92 49C93 43 93 37 94 31"/>
<circle cx="21" cy="25" r="7.5" fill="var(--r-energi)" fill-opacity=".3"/><circle cx="99" cy="25" r="7.5" fill="var(--r-energi)" fill-opacity=".3"/>
<path d="M30 56q4-4 8 0M90 56q-4-4-8 0" stroke-width="2"/>
<circle cx="60" cy="40" r="10" fill="var(--r-energi)" fill-opacity=".3"/>
<path d="M53 36l7 3l7-3" stroke-width="3"/>
<circle cx="56" cy="41" r="1.8" fill="var(--chalk)" stroke="none"/><circle cx="64" cy="41" r="1.8" fill="var(--chalk)" stroke="none"/>
<path d="M55 46h10" stroke-width="2.5"/>
<path d="M60 88C45 79 44 64 52 64C56 64 60 67 60 70C60 67 64 64 68 64C76 64 75 79 60 88Z" stroke="var(--bad)" stroke-width="2.5" fill="var(--bad)" fill-opacity=".15"/>
<path d="M51 69v8M51 69h4M51 73h3M51 77h4M58 71h4M58 75h4M66 69v8M66 69h4M66 73h3" stroke="var(--chalk)" stroke-width="1.8"/>
<path d="M50 94h20" stroke-width="2"/>
<g stroke="var(--warn)" stroke-width="2.5"><path d="M8 18l-4-4M21 11V5M34 18l4-4M112 18l4-4M99 11V5M86 18l-4-4"/></g>
</svg>`);

  NG.art.add('forbrukeren', `${H}
<path d="M24 70C22 44 40 28 62 30C86 32 100 50 98 72C96 94 78 104 60 104C40 104 26 92 24 70Z" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M42 104l-2 8M78 104l2 8"/>
<path d="M40 66C46 88 78 88 84 63C70 69 54 70 40 66Z" fill="var(--board)"/>
<path d="M54 82q8-6 16-1" stroke="var(--bad)" stroke-width="3"/>
<path d="M45 68l2 4M53 70l1 4M62 70v4M71 69l-1 4" stroke-width="2"/>
${eye(50, 48, 8, 2, 2)}${eye(72, 46, 8, -1, 2)}
<path d="M40 36l12 4M82 34l-10 4" stroke-width="3"/>
<path transform="translate(4 -3)" d="M112 24L96 44l8 1L86 66l4-13l-8-1L96 22Z" fill="var(--warn)" fill-opacity=".45" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M98 72q8-4 8-12" />
<path d="M26 62C18 58 14 50 12 42M8 30l3 10l3-10M11 30v10M6 42h10" stroke-width="2.5"/>
<g stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="2 4"><circle cx="13" cy="98" r="6"/><circle cx="104" cy="100" r="5"/><circle cx="112" cy="88" r="3"/></g>
</svg>`);

  NG.art.add('hvilesteinen', `${H}
<path d="M10 80h82M20 80v10l10-10M80 80v10l-10-10" stroke-width="3"/>
<path d="M26 79C21 60 33 42 56 41C80 39 95 55 92 79Z" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M40 46C44 28 64 22 82 30L100 46" fill="var(--chalk)" fill-opacity=".12"/>
<circle cx="102" cy="50" r="5" fill="var(--chalk)" fill-opacity=".4"/>
<path d="M41 61q5 4 10 0M62 61q5 4 10 0" />
<path d="M51 70q6 4 12-1"  stroke-width="2.5"/>
<path d="M36 72l3 2M80 70l-3 3M60 52l2 2" stroke-width="2" stroke="var(--chalk-dim)"/>
<path d="M88 12h7l-7 8h7M100 4h5l-5 6h5" stroke-width="2.5"/>
<path d="M106 82v28M102 86l4-5l4 5M102 106l4 5l4-5" stroke="var(--warn)" stroke-width="2.5" stroke-dasharray="1 0"/>
<path d="M4 113h112" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-dasharray="6 5"/>
</svg>`);

  NG.art.add('glodende-molekyl', `${H}
<g stroke="var(--bad)" stroke-width="2.5"><path d="M40 30q-4-6 0-12t0-12M60 22q-4-6 0-10M80 30q4-6 0-12t0-12"/></g>
<circle cx="60" cy="62" r="34" stroke="var(--warn)" stroke-width="2" stroke-dasharray="3 6"/>
<path d="M44 76L33 89M76 76L87 89" stroke-width="5"/>
<circle cx="29" cy="93" r="12" fill="var(--r-energi)" fill-opacity=".25"/>
<circle cx="91" cy="93" r="12" fill="var(--r-energi)" fill-opacity=".25"/>
<circle cx="60" cy="60" r="22" fill="var(--bad)" fill-opacity=".28"/>
<path d="M44 54h32" stroke-width="3"/>
<path d="M45 53h12v5q-6 5-12 0ZM63 53h12v5q-6 5-12 0Z" fill="var(--board)" stroke-width="2.5"/>
<path d="M52 70q8 5 16-2" stroke-width="2.5"/>
<path d="M78 44l12-16" stroke-width="5"/><circle cx="92" cy="25" r="4" fill="var(--bad)" stroke-width="2"/>
<path d="M78 44l12-16" stroke="var(--bad)" stroke-width="1.5"/>
<path d="M76 66q3 5 0 7" stroke="var(--chalk-dim)" stroke-width="2"/>
<path d="M26 92h6M88 92h6" stroke-width="2"/>
</svg>`);

  NG.art.add('jernhanden', `${H}
<path d="M40 112l2-22h38l2 22Z" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M42 101h38" stroke-width="2.5"/>
<g fill="var(--chalk)" stroke="none"><circle cx="48" cy="95.5" r="2"/><circle cx="61" cy="95.5" r="2"/><circle cx="74" cy="95.5" r="2"/><circle cx="48" cy="107" r="2"/><circle cx="74" cy="107" r="2"/></g>
<path d="M40 52V28a5 5 0 0 1 10 0V52M51 52V22a5 5 0 0 1 10 0V52M62 52V25a5 5 0 0 1 10 0V52M73 54V35a5 5 0 0 1 10 0V58" fill="var(--chalk-dim)" fill-opacity=".25"/>
<path d="M41 40h8M52 36h8M63 38h8M74 45h8" stroke-width="2"/>
<path d="M40 25q5-5 10 0M51 19q5-5 10 0M62 22q5-5 10 0M73 32q5-5 10 0" stroke-width="5" stroke="var(--chalk)" stroke-opacity=".85"/>
<path d="M36 90C33 76 34 62 38 52H84C88 62 88 76 84 90Z" fill="var(--chalk-dim)" fill-opacity=".25"/>
<path d="M37 76C29 72 23 64 21 55a5 5 0 0 1 9-4C33 57 35 61 38 63" fill="var(--chalk-dim)" fill-opacity=".25"/>
<path d="M45 61l9 4M78 61l-9 4" stroke-width="3" stroke="var(--bad)"/>
${eye(52, 70, 5, 0, 1)}${eye(70, 70, 5, 0, 1)}
<path d="M53 84q8-6 16 0" stroke-width="3"/>
<path d="M24 62l1 8l3-6M36 90l2 8l2-8M84 90l1 7l2-7" stroke-width="2.5" fill="var(--chalk)" fill-opacity=".3"/>
${flake(14, 30, 6)}${flake(100, 16, 5)}${flake(12, 84, 5)}${flake(28, 12, 4)}
<path d="M102 88V52a4 4 0 0 1 8 0V88" stroke-width="2.5"/><circle cx="106" cy="94" r="6" fill="var(--chalk)" fill-opacity=".25" stroke-width="2.5"/>
<path d="M106 92v-8" stroke="var(--r-energi)" stroke-width="3"/>
<path d="M98 60h3M98 70h3M98 80h3" stroke-width="2"/>
</svg>`);

  NG.art.add('kilowatt-trollet', `${H}
<path d="M46 26V12M72 26V12" stroke-width="5"/>
<path d="M30 108C18 82 26 50 60 48C94 50 102 82 90 108Z" fill="var(--r-energi)" fill-opacity=".32"/>
<path d="M36 52C32 30 46 20 60 20C74 20 88 30 84 52C76 58 44 58 36 52Z" fill="var(--r-energi)" fill-opacity=".3"/>
<path d="M56 40c-3 6-1 10 4 10c5 0 7-4 4-10" fill="var(--chalk)" fill-opacity=".2" stroke-width="3"/>
<path d="M44 30l8 3M76 30l-8 3" stroke-width="3"/>
${eye(48, 37, 4, 1, 0)}${eye(72, 37, 4, -1, 0)}
<path d="M48 54h24M50 54l2 6l3-6M70 54l-2 6l-3-6" stroke-width="2.5" fill="var(--chalk)" fill-opacity=".4"/>
<path d="M44 90a16 16 0 0 1 32 0Z" fill="var(--board)" stroke-width="3"/>
<path d="M49 86l2 1M60 77v3M71 86l-2 1" stroke-width="2"/>
<path d="M60 89l12-9" stroke="var(--bad)" stroke-width="3"/>
<path d="M30 66C18 60 12 48 14 38" />
<path d="M8 6L20 22l-6 1l12 18l-14-12l6-2L4 10Z" fill="var(--warn)" fill-opacity=".45" stroke="var(--warn)" stroke-width="2.5"/>
<path d="M90 66c10 0 16 8 16 16"/>
<path d="M98 82h16l-6 9l6 9H98l6-9Z" fill="var(--chalk)" fill-opacity=".15" stroke-width="2.5"/>
<path d="M104 91h4" stroke-width="2"/>
<path d="M44 108v6h-10M76 108v6h10"/>
<path d="M88 104c10 4 18 2 22 8" stroke-width="2.5"/>
</svg>`);

  NG.art.add('evighetsmaskinen', `${H}
<path d="M60 56L36 110M60 56L84 110M24 111h72" stroke-width="4"/>
<path d="M46 111c-6-6 6-12 10-6c4 6-6 12-10 6Zm28 0c6-6-6-12-10-6c-4 6 6 12 10 6Z" stroke="var(--chalk-dim)" stroke-width="2"/>
<circle cx="22" cy="96" r="11" stroke="var(--chalk-dim)" stroke-width="7" stroke-dasharray="4.3 4.3"/>
<circle cx="22" cy="96" r="8" fill="var(--r-energi)" fill-opacity=".32" stroke-width="2.5"/>
<circle cx="22" cy="96" r="2" fill="var(--chalk)"/>
<circle cx="60" cy="54" r="38" fill="var(--r-energi)" fill-opacity=".12"/>
<circle cx="60" cy="54" r="33" stroke-width="2"/>
<g stroke-width="2.5"><path d="M60 21v66M27 54h66M37 31l46 46M83 31L37 77"/></g>
<circle cx="60" cy="54" r="17" stroke="var(--chalk-dim)" stroke-width="5" stroke-dasharray="3.4 3.3"/>
<circle cx="60" cy="54" r="13" fill="var(--board)" stroke-width="3"/>
<path d="M49 54q11-11 22 0q-11 11-22 0Z" fill="var(--chalk)" stroke-width="2"/>
<circle cx="61" cy="54" r="4.5" fill="var(--bad)" stroke="none"/><circle cx="61" cy="54" r="1.8" fill="var(--board)" stroke="none"/>
<path d="M47 45l8 4M73 45l-8 4" stroke="var(--bad)" stroke-width="3"/>
<g stroke-width="3"><path d="M98 54l12 3M87 81l8 11M60 92l4 11M87 27l9-10M60 16l11-7M33 81l8-9M22 54l11 5M33 27l10 5"/></g>
<g fill="var(--r-energi)" fill-opacity=".45" stroke-width="2.5"><circle cx="110" cy="58" r="5"/><circle cx="96" cy="93" r="5"/><circle cx="65" cy="105" r="5"/><circle cx="97" cy="16" r="5"/><circle cx="72" cy="8" r="5"/><circle cx="42" cy="71" r="5"/><circle cx="34" cy="60" r="5"/><circle cx="44" cy="33" r="5"/></g>
<g stroke="var(--warn)" stroke-width="2.5"><path d="M10 40A50 50 0 0 1 36 10M36 10l-7-1M36 10l-3 6M112 74a52 52 0 0 1-8 18M104 92l1-7M104 92l-6 1"/>
<path d="M8 66l-5 2M14 76l-4 4M114 34l4-3M108 26l3-5"/></g>
</svg>`);
})();
