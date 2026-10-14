/* Enkle reserve-ikoner. Lastes først; senere art-filer med samme id overstyrer disse. */
(function () {
  'use strict';
  const S = (inner, vb) => `<svg viewBox="${vb || '0 0 48 48'}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const A = NG.art.add;
  A('_fallback', S('<path d="M40 88c-18-4-24-26-12-40 10-12 34-14 46-2 12 12 6 30-8 34-6 2-8 6-8 12v6" stroke="var(--chalk)" stroke-width="7"/><circle cx="58" cy="112" r="1" stroke="var(--chalk)" stroke-width="8"/><circle cx="46" cy="58" r="3" fill="var(--bad)" stroke="none"/><circle cx="68" cy="56" r="3" fill="var(--bad)" stroke="none"/><path d="M50 72q8 -5 14 0" stroke="var(--chalk)"/>', '0 0 120 120'));
  A('laerling', S('<circle cx="60" cy="38" r="18" fill="var(--board-3)" stroke="var(--chalk)"/><path d="M42 36q18-20 36 0" stroke="var(--r-didaktikk)" stroke-width="5"/><circle cx="53" cy="40" r="2" fill="var(--chalk)" stroke="none"/><circle cx="67" cy="40" r="2" fill="var(--chalk)" stroke="none"/><path d="M54 47q6 4 12 0" stroke="var(--chalk)"/><path d="M38 108V78q0-16 22-16t22 16v30" stroke="var(--chalk)" fill="color-mix(in srgb, var(--r-praksis) 25%, transparent)"/><path d="M46 62l14 10 14-10" stroke="var(--r-energi)" stroke-width="5"/><rect x="66" y="78" width="22" height="26" rx="2" stroke="var(--chalk)" fill="color-mix(in srgb, var(--r-energi) 30%, transparent)"/><path d="M30 86l-6-10" stroke="var(--chalk)" stroke-width="5"/>', '0 0 120 120'));
  const ICONS = {
    'icon-energi': '<path d="M26 4L10 28h12l-4 16 18-26H24z"/>',
    'icon-stoffer': '<ellipse cx="24" cy="24" rx="20" ry="8"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="3" fill="currentColor"/>',
    'icon-liv': '<path d="M24 44V22"/><path d="M24 30C10 30 6 18 8 8c12 0 18 8 16 22z"/><path d="M24 24c10 0 16-8 14-18-10 0-16 6-14 18z"/>',
    'icon-jorda': '<circle cx="24" cy="24" r="10"/><ellipse cx="24" cy="24" rx="21" ry="7" transform="rotate(-20 24 24)"/>',
    'icon-kropp': '<path d="M24 42S6 30 6 17a9 9 0 0118-3 9 9 0 0118 3c0 13-18 25-18 25z"/>',
    'icon-teknologi': '<circle cx="24" cy="24" r="7"/><path d="M24 4v7M24 37v7M4 24h7M37 24h7M10 10l5 5M33 33l5 5M10 38l5-5M33 15l5-5"/>',
    'icon-praksis': '<circle cx="20" cy="20" r="12"/><path d="M29 29l13 13"/>',
    'icon-didaktikk': '<path d="M4 10h18a4 4 0 014 4v28a4 4 0 00-4-4H4z"/><path d="M44 10H30a4 4 0 00-4 4v28a4 4 0 014-4h14z"/>',
    'node-kamp': '<path d="M10 38L34 14M34 14l4-8-8 4M14 14l24 24M14 14l-4-8 8 4M8 32l8 8M40 32l-8 8"/>',
    'node-elite': '<path d="M8 36l4-22 10 10 2-14 2 14 10-10 4 22z"/><path d="M8 42h32"/>',
    'node-lab': '<path d="M18 4v14L6 40a3 3 0 003 4h30a3 3 0 003-4L30 18V4M14 4h20"/><path d="M12 30h24"/>',
    'node-hendelse': '<rect x="6" y="12" width="36" height="26" rx="3"/><path d="M6 14l18 14 18-14"/>',
    'node-sol': '<circle cx="24" cy="24" r="9"/><path d="M24 3v6M24 39v6M3 24h6M39 24h6M9 9l4 4M35 35l4 4M9 39l4-4M35 13l4-4"/>',
    'node-kiste': '<rect x="6" y="18" width="36" height="22" rx="3"/><path d="M6 18q18-16 36 0M6 26h36"/><rect x="21" y="23" width="6" height="7"/>',
    'node-boss': '<path d="M24 6c-11 0-17 8-17 17 0 6 3 9 7 11v8h20v-8c4-2 7-5 7-11 0-9-6-17-17-17z"/><circle cx="17" cy="23" r="4"/><circle cx="31" cy="23" r="4"/><path d="M20 42v-5M28 42v-5"/>',
    'item-vernebriller': '<circle cx="14" cy="26" r="8"/><circle cx="34" cy="26" r="8"/><path d="M22 26h4M6 24L2 18M42 24l4-6"/>',
    'item-varmepumpe': '<rect x="6" y="8" width="36" height="32" rx="4"/><circle cx="24" cy="24" r="9"/><path d="M24 15v18M15 24h18"/>',
    'item-termos': '<rect x="14" y="10" width="20" height="34" rx="5"/><path d="M18 4h12v6H18zM14 20h20"/>',
    'item-notatbok': '<rect x="10" y="4" width="28" height="40" rx="3"/><path d="M16 14h16M16 22h16M16 30h10"/>',
    'item-partikkelbriller': '<circle cx="14" cy="26" r="8"/><circle cx="34" cy="26" r="8"/><path d="M22 26h4"/><circle cx="12" cy="24" r="1.5" fill="currentColor"/><circle cx="16" cy="28" r="1.5" fill="currentColor"/><circle cx="34" cy="24" r="1.5" fill="currentColor"/>',
    'item-kalorimeter': '<path d="M12 14h24v26a4 4 0 01-4 4H16a4 4 0 01-4-4z"/><path d="M24 4v26"/><circle cx="24" cy="34" r="4"/>',
    'item-lupe': '<circle cx="20" cy="20" r="12"/><path d="M29 29l13 13"/><path d="M14 18a6 6 0 016-6"/>',
    'item-periodesystem': '<rect x="4" y="10" width="8" height="8"/><rect x="36" y="10" width="8" height="8"/><rect x="4" y="18" width="8" height="8"/><rect x="12" y="18" width="8" height="8"/><rect x="28" y="18" width="8" height="8"/><rect x="36" y="18" width="8" height="8"/><rect x="4" y="26" width="40" height="8"/>',
    'item-solcelle': '<path d="M6 34l6-22h24l6 22z"/><path d="M9 23h30M18 12l-3 22M30 12l3 22M24 34v8M16 42h16"/>',
    'item-begrepskort': '<rect x="8" y="10" width="26" height="34" rx="3"/><path d="M14 4h26v34"/><path d="M14 22h14M14 30h10"/>',
  };
  for (const k in ICONS) A(k, S(ICONS[k]));
})();
