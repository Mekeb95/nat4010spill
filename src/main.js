/* Oppstart. */
(function () {
  'use strict';
  try { document.documentElement.lang = 'nb'; } catch (e) { /* */ }
  if (window.NG_DEV) return; // dev-harness tar over
  // PWA: ta vare på installasjonsforespørselen slik at innstillingene kan tilby «Installer appen»
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); NG.installPrompt = e; });
  window.addEventListener('appinstalled', () => { NG.installPrompt = null; NG.toast('Nøkkelvokteren er installert'); });
  NG.load();
  // En ekspedisjon lagret med 0 HP (appen ble lukket i det du falt) regnes som et vanlig tap.
  { const s = NG.state(); if (s && s.run && !(s.hp > 0)) { const r = NG.endRun(s, 'death'); NG.save({ now: true }); setTimeout(() => NG.toast('Du falt i forrige ekspedisjon' + (r && r.lost ? ' og mistet ' + r.lost + ' ◆' : '') + '. Du er tilbake i leiren.', 4000), 600); } }
  // Skyen kan ha nyere lagring (annen enhet). Bytt bare hvis spilleren står på tittel/leir.
  NG.connectCloud((st) => {
    const cur = NG.current();
    if (!cur || cur.name === 'title' || cur.name === 'camp') NG.go(cur ? cur.name : 'title');
    NG.toast('Hentet nyere fremgang fra skyen');
  });
  NG.connectOracle();
  function start() { NG.go('title'); }
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
  else start();
})();
