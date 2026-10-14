/* Skjerm alltid på (Screen Wake Lock API). Låsen slippes av nettleseren når appen skjules,
   så den hentes på nytt når appen blir synlig igjen. På av som standard; valget huskes. */
(function () {
  'use strict';
  let on = true;
  try { on = localStorage.getItem('ng.wakelock') !== '0'; } catch (e) { /* ingen lagring */ }
  let lock = null;
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  async function acquire() {
    if (!supported || !on || lock || document.visibilityState !== 'visible') return;
    try {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } catch (e) { lock = null; /* f.eks. strømsparing eller manglende brukerhandling */ }
  }
  function release() {
    if (lock) { try { lock.release(); } catch (e) { /* */ } lock = null; }
  }

  if (supported) {
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') acquire(); });
    // Noen nettlesere krever en brukerhandling før første forespørsel.
    ['pointerdown', 'keydown'].forEach((t) => document.addEventListener(t, acquire, { passive: true }));
    acquire();
  }

  NG.wakeLock = {
    supported,
    get on() { return on; },
    get active() { return !!lock; },
    set(v) {
      on = !!v;
      try { localStorage.setItem('ng.wakelock', on ? '1' : '0'); } catch (e) { /* */ }
      if (on) acquire(); else release();
    },
  };
})();
