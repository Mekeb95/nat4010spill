/* UI-grafikk: spillerfiguren, regionikoner, kartnode-ikoner, gjenstander og reservefiguren.
   Ikoner (48×48) bruker currentColor slik at de kan fargelegges med CSS `color`. Overstyrer 00-placeholders.js. */
(function () {
  'use strict';
  const A = NG.art.add;
  const icon = (b) => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`;
  const fig = (b) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--chalk)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`;
  const soft = 'fill="currentColor" fill-opacity=".22"';
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
  const eye = (x, y, r, px, py) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--chalk)" stroke="none"/><circle cx="${x + (px || 0)}" cy="${y + (py || 0)}" r="${(r * 0.52).toFixed(1)}" fill="var(--board)" stroke="none"/>`;

  // Tannhjul generert som én sti (n tenner).
  function gear(cx, cy, ro, ri, n) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, w = Math.PI / n;
      const pts = [[ri, a - w * 0.62], [ro, a - w * 0.34], [ro, a + w * 0.34], [ri, a + w * 0.62]];
      for (const [r, t] of pts) d += `${d ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
    }
    return d + 'Z';
  }

  /* ---------- Spillerfiguren ---------- */
  A('laerling', fig(`<ellipse cx="60" cy="111" rx="28" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>
<path d="M49 90h10l-1 16h-9ZM61 90h10l1 16h-10Z" fill="var(--board-3)" stroke-width="3"/>
<path d="M44 108q-2-5 6-5h8v5ZM76 108q2-5-6-5h-8v5Z" fill="var(--heat)" fill-opacity=".8" stroke-width="2.5"/>
<path d="M43 58c-6 8-8 22-6 34h46c2-12 0-26-6-34Z" fill="var(--r-stoffer)" fill-opacity=".35"/>
<path d="M54 60l6 30 6-30" fill="var(--chalk)" fill-opacity=".22" stroke-width="2.5"/>
<path d="M47 60l18 28" stroke="var(--heat)" stroke-width="2.5"/>
<path d="M78 62q10-6 12-18"/>
<rect x="22" y="68" width="18" height="24" rx="2" fill="var(--r-liv)" fill-opacity=".55" stroke-width="3"/>
<path d="M27 75h9M27 80h9M27 85h6" stroke="var(--chalk)" stroke-width="1.8"/>
<path d="M22 71v18" stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="1 3"/>
<path d="M44 62q-6 10-4 22q-4 0-6 2" stroke-width="3.5"/>
<path d="M43 40q-3 10 3 15M77 40q3 10-3 15" fill="var(--heat)" fill-opacity=".95" stroke-width="3"/>
<circle cx="60" cy="38" r="17" fill="var(--board-2)"/>
<circle cx="60" cy="38" r="17" fill="var(--r-didaktikk)" fill-opacity=".8" stroke="none"/>
<path d="M43 39c-3-15 6-23 17-23s20 8 17 23c-3-6-9-10-15-9-7-4-15 1-19 9Z" fill="var(--heat)" fill-opacity=".95" stroke-width="3"/>
<path d="M60 16q3-6 8-5" stroke-width="3"/>
<circle cx="53" cy="41" r="3.3" fill="var(--board)" stroke="none"/><circle cx="67" cy="41" r="3.3" fill="var(--board)" stroke="none"/>
<circle cx="54.2" cy="39.8" r="1.2" fill="var(--chalk)" stroke="none"/><circle cx="68.2" cy="39.8" r="1.2" fill="var(--chalk)" stroke="none"/>
<path d="M48 35l7 .5M72 35l-7 .5" stroke="var(--board)" stroke-width="2.5"/>
<path d="M54 47q6 5 12 0" stroke="var(--board)" stroke-width="2.8"/>
<circle cx="48" cy="46" r="2.6" fill="var(--r-kropp)" fill-opacity=".7" stroke="none"/><circle cx="72" cy="46" r="2.6" fill="var(--r-kropp)" fill-opacity=".7" stroke="none"/>
<path d="M45 54q15 9 30 0l-1 7q-14 7-28 0Z" fill="var(--r-energi)" fill-opacity=".85" stroke-width="3"/>
<path d="M64 61l5 20 7-3-4-19" fill="var(--r-energi)" fill-opacity=".85" stroke-width="3"/>
<path d="M69 81l-1 4M72 80l0 4M75 79l1 4" stroke="var(--r-energi)" stroke-width="2"/>
<path d="M52 58v4M58 60v4" stroke="var(--board)" stroke-opacity=".5" stroke-width="1.8"/>
<rect x="88" y="28" width="5" height="13" rx="1.5" fill="var(--chalk)" transform="rotate(20 90 34)" stroke-width="2"/>
<circle cx="90" cy="44" r="4.5" fill="var(--board-2)" stroke-width="2.8"/>
<circle cx="90" cy="44" r="4.5" fill="var(--r-didaktikk)" fill-opacity=".55" stroke="none"/>
<path d="M99 20v6M96 23h6M104 30v4M102 32h4" stroke="var(--chalk-dim)" stroke-width="2"/>`));

  /* ---------- Reservefigur: ullent spørsmålstegn-vesen ---------- */
  const q = 'M40 46c0-14 10-22 22-22s22 8 22 20c0 10-8 14-14 18-6 4-8 8-8 14v6';
  A('_fallback', fig(`<ellipse cx="62" cy="111" rx="24" ry="4.5" fill="var(--chalk)" fill-opacity=".09" stroke="none"/>
<path d="${q}" stroke="var(--chalk-dim)" stroke-width="36" stroke-linecap="butt" stroke-dasharray="1.2 2.4"/>
<path d="${q}" stroke-width="30"/>
<path d="${q}" stroke="var(--board-2)" stroke-width="24"/>
<path d="${q}" stroke="var(--chalk-dim)" stroke-opacity=".3" stroke-width="24"/>
<circle cx="62" cy="99" r="10.5" stroke="var(--chalk-dim)" stroke-width="5" stroke-linecap="butt" stroke-dasharray="1.2 2.2"/>
<circle cx="62" cy="99" r="9.5" fill="var(--board-2)" stroke-width="3"/><circle cx="62" cy="99" r="8" fill="var(--chalk-dim)" fill-opacity=".3" stroke="none"/>
${eye(50, 30, 5.5, 1.5, 1)}${eye(66, 25, 5.5, 1.5, 1)}
<path d="M44 21l8 3M70 15l-6 5" stroke-width="2.5"/>
<path d="M76 38q4 2 5 6" stroke-width="2.5"/>
<path d="M38 60q-8 2-12 8M86 56q8 0 12 6" stroke-width="3"/>
<path d="M56 108l-2 3M68 108l2 3" stroke-width="3"/>`));

  /* ---------- Regionikoner ---------- */
  A('icon-energi', icon(`<path d="M28 3L9 27h13l-4 18 21-26H26Z" ${soft}/>`));
  A('icon-stoffer', icon(`<g stroke-width="2.6"><ellipse cx="24" cy="24" rx="20" ry="7.5"/><ellipse cx="24" cy="24" rx="20" ry="7.5" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="7.5" transform="rotate(120 24 24)"/></g>${dot(24, 24, 4.5)}`));
  A('icon-liv', icon(`<path d="M7 41C7 19 21 7 42 6c0 21-13 34-35 35Z" ${soft}/><path d="M7 41L31 17M18 30v-8M24 24h8"/>`));
  A('icon-jorda', icon(`<circle cx="24" cy="24" r="11" ${soft}/><path d="M17 20q4 4 2 8M28 15q-2 5 3 7" stroke-width="2.2"/><ellipse cx="24" cy="24" rx="21" ry="7" transform="rotate(-22 24 24)" stroke-width="2.6"/>${dot(42, 13, 3)}`));
  A('icon-kropp', icon(`<path d="M24 42S5 30 5 17A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 19 4c0 13-19 25-19 25Z" ${soft}/><path d="M11 25h8l3-6 4 11 3-5h8" stroke-width="2.6"/>`));
  A('icon-teknologi', icon(`<path d="${gear(24, 24, 20, 14.5, 8)}" ${soft} stroke-width="2.8"/><circle cx="24" cy="24" r="5.5"/>`));
  A('icon-praksis', icon(`<path d="M7 44V15h17v29ZM5 15V6h5v4h4V6h4v4h4V6h4v9" ${soft} stroke-width="2.8"/><path d="M13 44v-6a2.5 2.5 0 0 1 5 0v6M13 24h5" stroke-width="2.4"/><circle cx="33" cy="24" r="8.5" fill="currentColor" fill-opacity=".12"/><path d="M39 31l6 11" stroke-width="4.5"/>`));
  A('icon-didaktikk', icon(`<path d="M24 13C18 8 10 8 4 10v29c6-2 14-2 20 3 6-5 14-5 20-3V10c-6-2-14-2-20 3Z" ${soft}/><path d="M24 13v29M9 18h9M9 24h9M30 18h9M30 24h6" stroke-width="2.4"/>`));

  /* ---------- Kartnoder ---------- */
  A('node-kamp', icon(`<path d="M41 7L19 29M7 7l22 22"/><path d="M41 7l-1 6M41 7l-6 1M7 7l1 6M7 7l6 1" stroke-width="2.6"/><path d="M14 24l10 10M34 24L24 34" stroke-width="3.6"/><path d="M19 29L9 39M29 29l10 10" stroke-width="4"/>${dot(8, 40, 3)}${dot(40, 40, 3)}`));
  A('node-elite', icon(`<path d="M13 16L6 4l12 7M35 16l7-12-12 7" stroke-width="2.8"/><path d="M10 24c0-10 6-14 14-14s14 4 14 14c0 10-6 19-14 19S10 34 10 24Z" ${soft}/><path d="M15 22l7 3M33 22l-7 3"/>${dot(19, 26, 2)}${dot(29, 26, 2)}<path d="M17 34l3.5-3 3.5 3 3.5-3 3.5 3" stroke-width="2.6"/>`));
  A('node-lab', icon(`<path d="M19 5h10M21 5v13L9 38a3 3 0 0 0 3 5h24a3 3 0 0 0 3-5L27 18V5"/><path d="M14 30h20l5 8a3 3 0 0 1-3 5H12a3 3 0 0 1-3-5Z" fill="currentColor" fill-opacity=".3" stroke="none"/><circle cx="21" cy="36" r="1.8" stroke-width="2"/><circle cx="28" cy="33" r="1.4" stroke-width="2"/>`));
  A('node-hendelse', icon(`<rect x="4" y="11" width="40" height="27" rx="3" ${soft}/><path d="M5 13l19 15 19-15M5 37l14-12M43 37L29 25" stroke-width="2.6"/>`));
  A('node-sol', icon(`<circle cx="24" cy="24" r="9" ${soft}/><path d="M24 3v6M24 39v6M3 24h6M39 24h6M9 9l4 4M35 35l4 4M9 39l4-4M35 13l4-4"/>`));
  A('node-kiste', icon(`<path d="M5 21c0-8 7-12 19-12s19 4 19 12Z" ${soft}/><rect x="5" y="21" width="38" height="20" rx="2" ${soft}/><path d="M14 10v31M34 10v31" stroke-width="2.4"/><rect x="20.5" y="18" width="7" height="9" rx="1.5" fill="currentColor" stroke="none"/>`));
  A('node-boss', icon(`<path d="M10 17L13 5l6 6 5-8 5 8 6-6 3 12Z" ${soft} stroke-width="2.6"/><path d="M11 32c0-8 5-12 13-12s13 4 13 12c0 4-2 6-5 7v5H16v-5c-3-1-5-3-5-7Z" ${soft}/>${dot(18.5, 31, 3.4)}${dot(29.5, 31, 3.4)}<path d="M21 44v-4M27 44v-4" stroke-width="2.4"/>`));

  /* ---------- Gjenstander ---------- */
  A('item-vernebriller', icon(`<path d="M8 15h32a5 5 0 0 1 5 5v5a9 9 0 0 1-9 9h-6l-3-4h-6l-3 4h-6a9 9 0 0 1-9-9v-5a5 5 0 0 1 5-5Z" ${soft}/><path d="M24 15v9M10 21q3-3 7-3M30 21q3-3 7-3" stroke-width="2.4"/>`));
  A('item-varmepumpe', icon(`<rect x="3" y="10" width="42" height="28" rx="3" ${soft}/><circle cx="17" cy="24" r="9"/><path d="M17 24q0-6 5-6M17 24q5 3 3 8M17 24q-6 1-7-4" stroke-width="2.4"/><path d="M32 17h9M32 23h9M32 29h9" stroke-width="2.4"/><path d="M8 38v4M40 38v4"/><path d="M30 7q2-2 0-4M36 7q2-2 0-4" stroke-width="2.2"/>`));
  A('item-termos', icon(`<rect x="13" y="13" width="20" height="31" rx="5" ${soft}/><rect x="15" y="4" width="16" height="9" rx="2"/><path d="M13 22h20M13 36h20" stroke-width="2.4"/><path d="M38 12q-3-3 0-6t0-5" stroke-width="2.4"/>`));
  A('item-notatbok', icon(`<rect x="10" y="4" width="31" height="40" rx="3" ${soft}/><path d="M6 10h8M6 18h8M6 26h8M6 34h8" stroke-width="2.6"/><path d="M19 13h16M19 20h16M19 27h10" stroke-width="2.4"/><path d="M37 30l-8 10-3 1 1-3 8-10Z" stroke-width="2.2"/>`));
  A('item-partikkelbriller', icon(`<circle cx="13" cy="26" r="9" fill="currentColor" fill-opacity=".14"/><circle cx="35" cy="26" r="9" fill="currentColor" fill-opacity=".14"/><path d="M22 25q2-3 4 0M4 24L2 17M44 24l2-7"/>${dot(10, 23, 2)}${dot(16, 26, 1.6)}${dot(11, 30, 1.6)}${dot(32, 24, 2)}${dot(38, 28, 1.6)}${dot(33, 30, 1.4)}`));
  A('item-kalorimeter', icon(`<path d="M9 16h30l-4 28H13Z" ${soft}/><path d="M7 16h34" stroke-width="3.6"/><rect x="27" y="3" width="6" height="27" rx="3" stroke-width="2.4"/><circle cx="30" cy="32" r="3.5" fill="currentColor" stroke="none"/><path d="M17 7v24M14 31h6" stroke-width="2.4"/>`));
  A('item-lupe', icon(`<circle cx="19" cy="19" r="13" fill="currentColor" fill-opacity=".12"/><path d="M12 15a8 8 0 0 1 6-6" stroke-width="2.4"/><path d="M29 29l13 13" stroke-width="6"/>`));
  let pt = '';
  const cells = [[0, 0], [6, 0], [0, 1], [1, 1], [5, 1], [6, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3]];
  for (const [c, r] of cells) pt += `<rect x="${3 + c * 6}" y="${7 + r * 6}" width="6" height="6"${(c + r) % 3 === 0 ? ' fill="currentColor" fill-opacity=".35"' : ''}/>`;
  A('item-periodesystem', icon(`<g stroke-width="1.8">${pt}<rect x="12" y="35" width="24" height="5"/></g>`));
  A('item-solcelle', icon(`<circle cx="9" cy="9" r="4.5"/><path d="M9 1v1.5M17 9h-1.5M1 9h1.5M14.5 3.5l-1 1" stroke-width="2.2"/><path d="M8 34l8-15h30l-8 15Z" ${soft}/><path d="M18 34l8-15M28 34l8-15M12 27h30" stroke-width="2"/><path d="M27 34v8M19 43h16"/>`));
  A('item-begrepskort', icon(`<rect x="5" y="9" width="24" height="32" rx="3" transform="rotate(-12 17 25)" stroke-width="2.4" stroke-opacity=".6"/><rect x="16" y="6" width="26" height="36" rx="3" ${soft}/><circle cx="29" cy="17" r="5"/><path d="M29 22v13M29 29h4M29 34h4" stroke-width="2.8"/>`));
})();
