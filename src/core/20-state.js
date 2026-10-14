/* Spilltilstand + lagring. localStorage straks; db-kapabiliteten (privat dokument per bruker)
   i bakgrunnen når den finnes, slik at fremgangen følger brukeren mellom enheter. */
(function () {
  'use strict';
  const KEY = 'ng.save.v1';
  const BAK = 'ng.save.v1.bak';
  const VERSION = 1;

  NG.newState = function () {
    return {
      v: VERSION,
      created: Date.now(),
      updated: 0, // 0 = aldri lagret (en tom lagring skal aldri overskrive skyen)
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
      abilities: {}, // evne-id -> { lvl 1–5, xp } (mestring som følger spilleren)
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

  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
  function migrate(s) {
    const base = NG.newState();
    for (const k in base) if (s[k] === undefined || (s[k] === null && base[k] !== null && k !== 'run')) s[k] = base[k];
    for (const k of ['counters', 'stats', 'items', 'cards', 'srs', 'bossesBeaten', 'regionVisits', 'sheets', 'labs', 'daily', 'tips', 'abilities']) if (!isObj(s[k])) s[k] = base[k];
    if (!Array.isArray(s.relics)) s.relics = [];
    for (const k in base.counters) if (!isFinite(s.counters[k])) s.counters[k] = 0;
    for (const k in base.stats) if (!(s.stats[k] >= 1)) s.stats[k] = 1;
    for (const k of ['level']) if (!(s[k] >= 1)) s[k] = 1;
    for (const k of ['xp', 'statPoints', 'joule', 'heat', 'updated']) if (!isFinite(s[k]) || s[k] < 0) s[k] = 0;
    for (const id in s.abilities) {
      const a = s.abilities[id];
      if (!isObj(a)) { delete s.abilities[id]; continue; }
      a.lvl = NG.clamp(Math.floor(Number(a.lvl)) || 1, 1, 5);
      a.xp = Math.max(0, Number(a.xp) || 0);
    }
    if (s.run != null && !isObj(s.run)) s.run = null;
    if (s.run) {
      if (!Array.isArray(s.run.layers) && !isObj(s.run.map)) s.run = null; // kartet valideres videre av NG.runMap
      else {
        if (!Array.isArray(s.run.relics)) s.run.relics = [];
        for (const k of ['seenEnemies', 'seenEvents', 'seenLabs', 'usedQ']) if (!Array.isArray(s.run[k])) s.run[k] = [];
      }
    }
    s.v = VERSION;
    return s;
  }
  // HP/energi kan mangle (ny lagring) eller være ødelagt (importert kode).
  function fixVitals(s) {
    if (!isFinite(s.hp) || s.hp == null) s.hp = NG.maxHp(s);
    if (!isFinite(s.energy) || s.energy == null) s.energy = NG.maxEnergy(s);
    s.hp = NG.clamp(Math.round(s.hp), 0, NG.maxHp(s));
    s.energy = Math.max(0, Math.round(s.energy));
    return s;
  }
  // Grovt mål på hvor mye fremgang en lagring har (for å aldri overskrive mer fremgang med mindre).
  function progress(s) { return s && s.counters ? (Number(s.counters.answered) || 0) + 100 * ((Number(s.level) || 1) - 1) : 0; }

  NG.load = function () {
    let s = null;
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (raw) {
      try { s = JSON.parse(raw); } catch (e) { s = null; }
      if (!isObj(s)) {
        // Ødelagt lagring: ta vare på råteksten (overskriv aldri en eksisterende sikkerhetskopi).
        s = null;
        try { if (!localStorage.getItem(BAK)) localStorage.setItem(BAK, raw); } catch (e) { /* */ }
        NG.saveWasCorrupt = true;
      }
    }
    try { state = s ? migrate(s) : NG.newState(); } catch (e) { state = NG.newState(); }
    fixVitals(state);
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* */ }
    return state;
  };

  NG.save = function (opts) {
    if (!state) return;
    state.updated = Date.now();
    const json = JSON.stringify(state);
    try { localStorage.setItem(KEY, json); } catch (e) { /* privat modus o.l. */ }
    autoSnapshot(json);
    scheduleDb(opts && opts.now);
  };

  /* ---------- Lokale sikkerhetskopier ----------
     Én kopi per døgn (de siste SNAP_MAX), pluss en kopi rett før import/gjenoppretting,
     slik at en feil import eller en ødelagt lagring kan rulles tilbake. */
  const SNAPS = 'ng.snaps.v1';
  const SNAP_MAX = 4;
  function readSnaps() {
    try { const a = JSON.parse(localStorage.getItem(SNAPS) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function writeSnaps(a) {
    // Fyller lagringen seg opp, kastes de eldste kopiene først.
    while (a.length) {
      try { localStorage.setItem(SNAPS, JSON.stringify(a)); return; } catch (e) { a.shift(); }
    }
    try { localStorage.removeItem(SNAPS); } catch (e) { /* */ }
  }
  function snapshot(json, why) {
    if (!state || !(state.counters.answered > 0)) return;
    const a = readSnaps();
    a.push({ t: Date.now(), why: why || 'auto', level: state.level, answered: state.counters.answered, json });
    writeSnaps(a.slice(-SNAP_MAX));
  }
  function autoSnapshot(json) {
    const a = readSnaps();
    const last = a.length ? a[a.length - 1] : null;
    if (!last || new Date(last.t).toDateString() !== new Date().toDateString()) snapshot(json, 'auto');
  }
  NG.snapshots = function () {
    return readSnaps().map((x, i) => ({ i, t: x.t, why: x.why, level: x.level, answered: x.answered })).reverse();
  };
  NG.restoreSnapshot = function (i) {
    const x = readSnaps()[i];
    if (!x) return false;
    let s;
    try { s = JSON.parse(x.json); } catch (e) { return false; }
    if (!isObj(s) || !isObj(s.cards) || !isObj(s.counters) || !isObj(s.stats)) return false;
    if (state) snapshot(JSON.stringify(state), 'før gjenoppretting');
    state = fixVitals(migrate(s));
    NG.save({ now: true });
    return true;
  };

  NG.resetSave = function () {
    state = NG.newState();
    state.hp = NG.maxHp(state); state.energy = NG.maxEnergy(state);
    NG.save({ now: true });
    return state;
  };

  NG.exportFile = function () {
    const d = new Date();
    const name = 'nokkelvokteren-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
    return { name, text: JSON.stringify(state) };
  };

  NG.exportSave = function () {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { return ''; }
  };
  NG.importSave = function (code) {
    try {
      // Godtar både lagringskoden (base64) og innholdet i en sikkerhetskopi-fil (ren JSON).
      const txt = String(code).trim();
      const s = JSON.parse(txt.charAt(0) === '{' ? txt : decodeURIComponent(escape(atob(txt))));
      if (!isObj(s) || !isObj(s.cards) || !isObj(s.counters) || !isObj(s.stats)) return false;
      if (state) snapshot(JSON.stringify(state), 'før import');
      state = fixVitals(migrate(s));
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
      let remoteState = null;
      if (remote && remote.json) { try { remoteState = JSON.parse(remote.json); } catch (e) { remoteState = null; } }
      const local = state;
      const localNever = !local || !local.updated;
      const remoteNewer = remoteState && Number(remote.updated) > (local ? local.updated : 0) + 1000;
      // Mer fremgang i skyen enn lokalt, og lokal lagring er ikke en bevisst ny start etter skylagringen.
      const remoteRicher = remoteState && progress(remoteState) > progress(local) && !(local && local.created > Number(remote.updated));
      if (remoteState && (localNever || remoteNewer || remoteRicher)) {
        try {
          state = fixVitals(migrate(remoteState));
          try { localStorage.setItem(KEY, remote.json); } catch (e) { /* */ }
          if (onNewer) onNewer(state);
        } catch (e) { /* korrupt sky-lagring: behold lokal */ }
      } else if (state && state.updated) {
        writeDb(); // aldri skriv en lagring som ikke er lagret lokalt ennå
      }
      NG.cloud = true;
      return true;
    } catch (e) {
      return false;
    }
  };
  window.addEventListener('pagehide', () => { if (dbRef && state && state.updated > lastDbWrite) writeDb(); });
})();
