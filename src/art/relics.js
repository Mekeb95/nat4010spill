/* Ikoner for ekspedisjonsrelikvier, nye forbruksvarer og evnen Modellbygging (48×48, currentColor). */
(function () {
  'use strict';
  const A = NG.art.add;
  const icon = (b) => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`;
  const soft = 'fill="currentColor" fill-opacity=".22"';

  A('relic-lakmus', icon(`<path d="M17 6h14v36H17z" ${soft}/><path d="M17 26h14"/><path d="M21 33h6M21 38h6" stroke-width="2.4"/><path d="M24 12v8" stroke-width="2.4"/>`));
  A('relic-brannteppe', icon(`<path d="M10 8h28v24c-4 3-10 4-14 4s-10-1-14-4z" ${soft}/><path d="M10 8l-2 6M38 8l2 6"/><path d="M24 42c-5-3-5-8 0-12 1 3 4 4 4 7s-2 4-4 5z"/>`));
  A('relic-torris', icon(`<path d="M10 20l14-8 14 8v14l-14 8-14-8z" ${soft}/><path d="M10 20l14 8 14-8M24 28v14"/><path d="M18 8c0-3 3-3 3-6M28 9c0-3 3-3 3-6" stroke-width="2.4"/>`));
  A('relic-magnesium', icon(`<path d="M8 40c8-4 10-12 18-14"/><path d="M33 22l3-9M33 22l9-3M33 22l7 7M33 22l-2 10M33 22l-9-6" stroke-width="2.6"/><circle cx="33" cy="22" r="4" ${soft}/>`));
  A('relic-vugge', icon(`<path d="M6 8h36M6 8v6M42 8v6"/><path d="M14 8v24M20 8v24M26 8v24M32 8l8 18" stroke-width="2.2"/><circle cx="14" cy="35" r="3.6" ${soft}/><circle cx="20" cy="35" r="3.6" ${soft}/><circle cx="26" cy="35" r="3.6" ${soft}/><circle cx="41" cy="29" r="3.6" ${soft}/>`));
  A('relic-bunsen', icon(`<path d="M18 42h12M20 42l2-22h4l2 22"/><path d="M24 18c-5-3-4-9 0-14 4 5 5 11 0 14z" ${soft}/><path d="M24 14c-1-1-1-3 0-5" stroke-width="2.2"/><path d="M28 32h6"/>`));
  A('relic-termoelement', icon(`<path d="M8 40l14-22M40 40L26 18"/><circle cx="24" cy="15" r="4" ${soft}/><path d="M8 40h6M34 40h6"/><path d="M18 30h12" stroke-dasharray="2 3" stroke-width="2.4"/>`));
  A('relic-mikroskop', icon(`<path d="M10 42h28M16 42c0-6 4-10 10-10"/><path d="M20 8l8 4-7 14-8-4z" ${soft}/><path d="M24 26l6 3M30 22c5 2 6 8 4 12"/>`));
  A('relic-katalysator', icon(`<path d="M6 36c6 0 8-20 18-20s12 20 18 20" stroke-dasharray="3 4" stroke-width="2.4"/><path d="M6 36c6 0 10-10 18-10s12 10 18 10"/><circle cx="24" cy="12" r="4" ${soft}/>`));
  A('relic-kontroll', icon(`<path d="M10 8v26a5 5 0 0 0 10 0V8M28 8v26a5 5 0 0 0 10 0V8"/><path d="M10 24h10" stroke-width="2.4"/><path d="M28 18h10" stroke-width="2.4"/><path d="M10 34a5 5 0 0 0 10 0V24H10z" ${soft}/><path d="M7 8h16M25 8h16"/>`));
  A('relic-prisme', icon(`<path d="M24 8l14 26H10z" ${soft}/><path d="M2 24l15 2"/><path d="M31 22l15-6M32 25l14 0M33 28l13 6" stroke-width="2.4"/>`));
  A('relic-vdg', icon(`<circle cx="24" cy="14" r="10" ${soft}/><path d="M20 24v16M28 24v16M14 42h20"/><path d="M38 6l-4 6h5l-4 6" stroke-width="2.4"/>`));
  A('relic-dna', icon(`<path d="M14 4c0 10 20 10 20 20s-20 10-20 20"/><path d="M34 4c0 10-20 10-20 20s20 10 20 20"/><path d="M17 10h14M19 18h10M19 30h10M17 38h14" stroke-width="2.2"/>`));
  A('relic-tannhjul', icon(`<circle cx="24" cy="24" r="11" ${soft}/><circle cx="24" cy="24" r="4"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/>`));
  A('relic-eske', icon(`<path d="M8 18h32v22H8z" ${soft}/><path d="M8 18l6-8h32l-6 8M40 40l6-8V10"/><path d="M18 30c2-3 6-3 8 0M22 26v1" stroke-width="2.4"/>`));
  A('relic-modell', icon(`<circle cx="24" cy="24" r="5" ${soft}/><ellipse cx="24" cy="24" rx="18" ry="7"/><ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)"/>`));
})();
