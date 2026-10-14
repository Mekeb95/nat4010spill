/* Spilltilstand + lagring. localStorage straks; db-kapabiliteten (privat dokument per bruker)
   i bakgrunnen når den finnes, slik at fremgangen følger brukeren mellom enheter. */
(function () {
  'use strict';
  const KEY = 'ng.save.v1';
  const VERSION = 1;

  NG.newState = function () {
    return {
      v: VERSION,
      created: Date.now(),
      updated: Date.now(),
      name: 'Lærling',
      introSeen: false,
      level: 1,
      xp: 0,
      statPoints: 0,
      stats: { forstaelse: 1, utholdenhet: 1, nysgjerrighet: 1 },
      hp: null, // settes til maks ved første oppstart
      energy: null,
      heat: 0,
      joule: 30,
      items: { matpakke: 1, kakao: 1 }, // forbruksvarer: id -> antall
      relics: [], // varige gjenstander (id)
      cards: {}, // begrep-id -> { lvl, sub, seen, right, wrong }
      srs: {}, // spørsmål-id -> { box, due, seen, right, wrong, last }
      bossesBeaten: {},
      regionVisits: {},
      sheets: {}, // nøkkelark restaurert: region -> true
      run: null,
      labs: {}, // mini-spill-id -> beste score
      counters: { answered: 0, correct: 0, bestStreak: 0, fights: 0, wins: 0, deaths: 0, labs: 0, oracle: 0 },
      daily: { date: '', reviewed: 0, goalClaimed: false },
      tips: {}, // viste veiledningstips
    };
  };

  let state = null;
  let dbRef = null;
  let dbTimer = null;
  let lastDbWrite = 0;

  NG.state = function () { return state; };

  function migrate(s) {
    const base = NG.newState();
    for (const k in base) if (s[k] === undefined) s[k] = base[k];
    for (const k in base.counters) if (s.counters[k] === undefined) s.counters[k] = 0;
    for (const k in base.stats) if (s.stats[k] === undefined) s.stats[k] = 1;
    s.v = VERSION;
    return s;
  }

  NG.load = function () {
    let s = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) s = JSON.parse(raw);
    } catch (e) { s = null; }
    state = s ? migrate(s) : NG.newState();
    if (state.hp == null) { state.hp = NG.maxHp(state); state.energy = NG.maxEnergy(state); }
    return state;
  };

  NG.save = function (opts) {
    if (!state) return;
    state.updated = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privat modus o.l. */ }
    scheduleDb(opts && opts.now);
  };

  NG.resetSave = function () {
    state = NG.newState();
    state.hp = NG.maxHp(state); state.energy = NG.maxEnergy(state);
    NG.save({ now: true });
    return state;
  };

  NG.exportSave = function () {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { return ''; }
  };
  NG.importSave = function (code) {
    try {
      const s = JSON.parse(decodeURIComponent(escape(atob(String(code).trim()))));
      if (!s || typeof s !== 'object' || !s.cards) return false;
      state = migrate(s);
      NG.save({ now: true });
      return true;
    } catch (e) { return false; }
  };

  /* ---------- Sky-lagring via db-kapabiliteten ---------- */
  function scheduleDb(now) {
    if (!dbRef) return;
    clearTimeout(dbTimer);
    const wait = now ? 0 : Math.max(1500, 8000 - (Date.now() - lastDbWrite));
    dbTimer = setTimeout(writeDb, wait);
  }
  function writeDb() {
    if (!dbRef || !state) return;
    lastDbWrite = Date.now();
    dbRef.set({ json: JSON.stringify(state), updated: state.updated, v: VERSION }).catch(() => { /* prøver igjen ved neste lagring */ });
  }

  // Kalles fra main etter oppstart. onNewer(state) kalles hvis skyen har nyere lagring.
  NG.connectCloud = async function (onNewer) {
    try {
      if (!window.claude || !window.claude.use) return false;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return false;
      const uid = await user.id();
      if (!uid) return false;
      dbRef = db.doc('data/users/' + uid + '/save');
      const snap = await dbRef.get();
      const remote = snap.exists ? snap.data() : null;
      if (remote && remote.json && Number(remote.updated) > (state ? state.updated : 0) + 1000) {
        try {
          state = migrate(JSON.parse(remote.json));
          try { localStorage.setItem(KEY, remote.json); } catch (e) { /* */ }
          if (onNewer) onNewer(state);
        } catch (e) { /* korrupt sky-lagring: behold lokal */ }
      } else {
        writeDb();
      }
      NG.cloud = true;
      return true;
    } catch (e) {
      return false;
    }
  };
  window.addEventListener('pagehide', () => { if (dbRef && state && state.updated > lastDbWrite) writeDb(); });
})();
