/* Oppstart. */
(function () {
  'use strict';
  if (window.NG_DEV) return; // dev-harness tar over
  NG.load();
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
