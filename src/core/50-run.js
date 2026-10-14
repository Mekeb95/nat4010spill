/* Ekspedisjoner: et forgreinet kart (à la Slay the Spire) gjennom en region, avsluttet med boss.
   r.map = { rows, lanes, nodes: [{ id, row, lane, type, done, enemy?, event?, lab? }], edges: [[fra, til], …] }
   r.at = id-en til noden du står på (null før første steg), r.path = id-ene du har besøkt. */
(function () {
  'use strict';
  NG.NODE_TYPES = {
    kamp: { name: 'Kamp', art: 'node-kamp', desc: 'En Misforståelse sperrer veien.' },
    elite: { name: 'Elite', art: 'node-elite', desc: 'En seiglivet Misforståelse. Bedre belønning.' },
    lab: { name: 'Laben', art: 'node-lab', desc: 'Et utforskende mini-spill.' },
    hendelse: { name: 'Hendelse', art: 'node-hendelse', desc: 'En situasjon der faget avgjør utfallet.' },
    sol: { name: 'Solgløtt', art: 'node-sol', desc: 'Sola fyller alltid på energien. Velg så: hvile, studere eller trene.' },
    butikk: { name: 'Handelsmann', art: 'node-butikk', desc: 'Vandrende handelsmann: kjøp gjenstander for joule (◆).' },
    kiste: { name: 'Kiste', art: 'node-kiste', desc: 'Noe er gjemt her.' },
    boss: { name: 'Boss', art: 'node-boss', desc: 'Misforståelsen som holder nøkkelarket.' },
  };

  const ROWS = 9;          // rad 0–7 + bossrad 8
  const LANES = 4;
  const LAST = ROWS - 2;   // siste rad før bossen (Solgløtt)
  const WEIGHTS = { kamp: 45, hendelse: 20, lab: 15, elite: 10, sol: 7, butikk: 8 };
  const NO_REPEAT = { sol: 1, elite: 1, butikk: 1 }; // aldri to av disse etter hverandre langs en kant

  const nid = (row, lane) => row + '-' + lane;

  /* ---------- Kartgenerering ---------- */
  function genMap(rng, firstVisit) {
    const nodes = []; const byId = {};
    const edges = []; const edgeKey = {};
    const addNode = (row, lane) => {
      const id = nid(row, lane);
      if (!byId[id]) { byId[id] = { id, row, lane, type: null, done: false }; nodes.push(byId[id]); }
      return byId[id];
    };
    const addEdge = (a, b) => { const k = a + '>' + b; if (!edgeKey[k]) { edgeKey[k] = 1; edges.push([a, b]); } };
    // krysser steget (row, from → to) en eksisterende kant mellom samme to rader?
    const crosses = (row, from, to) => edges.some(([a, b]) => {
      const A = byId[a]; const B = byId[b];
      if (!A || !B || A.row !== row || B.row !== row + 1) return false;
      return (A.lane < from && B.lane > to) || (A.lane > from && B.lane < to);
    });

    const nPaths = rng.chance(0.5) ? 3 : 4;
    const starts = [];
    for (let p = 0; p < nPaths; p++) {
      let lane = rng.int(0, LANES - 1);
      if (p === 1) { while (lane === starts[0]) lane = rng.int(0, LANES - 1); } // minst to ulike startspor
      starts.push(lane);
      addNode(0, lane);
      for (let row = 0; row < LAST; row++) {
        const opts = rng.shuffle([lane - 1, lane, lane + 1].filter((l) => l >= 0 && l < LANES)).filter((l) => !crosses(row, lane, l));
        const to = opts.length ? opts[0] : lane; // rett frem krysser aldri (steg er maks ±1)
        addNode(row + 1, to);
        addEdge(nid(row, lane), nid(row + 1, to));
        lane = to;
      }
    }
    const boss = { id: 'boss', row: LAST + 1, lane: (LANES - 1) / 2, type: 'boss', done: false };
    nodes.filter((n) => n.row === LAST).forEach((n) => addEdge(n.id, boss.id));
    nodes.push(boss); byId.boss = boss;

    const parents = (id) => edges.filter((e) => e[1] === id).map((e) => byId[e[0]]);
    const children = (id) => edges.filter((e) => e[0] === id).map((e) => byId[e[1]]);
    const allowed = (n, t) => {
      if (t === 'elite' && n.row < (firstVisit ? 4 : 3)) return false;
      if (t === 'sol' && (n.row < 3 || n.row === LAST - 1)) return false; // rad 6 leder rett inn i Solgløtt
      if (t === 'butikk' && n.row < 2) return false;
      if (NO_REPEAT[t] && parents(n.id).concat(children(n.id)).some((m) => m && m.type === t)) return false;
      return true;
    };
    const pickType = (n, avoid) => {
      let opts = Object.keys(WEIGHTS).filter((t) => allowed(n, t));
      const varied = opts.filter((t) => avoid.indexOf(t) < 0);
      if (varied.length) opts = varied;
      let sum = 0; opts.forEach((t) => { sum += WEIGHTS[t]; });
      let x = rng.next() * sum;
      for (const t of opts) { x -= WEIGHTS[t]; if (x < 0) return t; }
      return opts[opts.length - 1] || 'kamp';
    };
    for (let row = 0; row <= LAST; row++) {
      const rowNodes = nodes.filter((n) => n.row === row).sort((a, b) => a.lane - b.lane);
      for (const n of rowNodes) {
        if (row === 0) n.type = 'kamp';
        else if (row === 4) n.type = 'kiste';
        else if (row === LAST) n.type = 'sol';
        else {
          // søsken (andre barn av samme forelder) får helst ulike typer
          const sib = [];
          parents(n.id).forEach((p) => children(p.id).forEach((c) => { if (c !== n && c.type) sib.push(c.type); }));
          n.type = pickType(n, sib);
        }
      }
    }
    // Minst én handelsmann på kartet
    if (!nodes.some((n) => n.type === 'butikk')) {
      const cand = nodes.filter((n) => n.row >= 2 && n.row <= LAST - 1 && n.row !== 4 && (n.type === 'kamp' || n.type === 'hendelse') && allowed(n, 'butikk'));
      if (cand.length) rng.pick(cand).type = 'butikk';
    }
    return { rows: ROWS, lanes: LANES, nodes, edges };
  }
  NG.genRunMap = genMap; // for testing

  /* ---------- Bakoverkompatibilitet: gammel lag-sti → kart ---------- */
  function convertLayers(r) {
    const nodes = []; const edges = [];
    const rows = r.layers.length;
    r.layers.forEach((layer, li) => {
      layer.forEach((n, ni) => {
        const lane = (LANES - 1) / 2 + (ni - (layer.length - 1) / 2) * 2; // 1 node: midt, 2 noder: 25 % / 75 %
        nodes.push(Object.assign({}, n, { id: li + '-' + ni, row: li, lane, done: !!n.done }));
      });
      if (li > 0) r.layers[li - 1].forEach((_, a) => layer.forEach((__, b) => edges.push([(li - 1) + '-' + a, li + '-' + b])));
    });
    r.map = { rows, lanes: LANES, nodes, edges };
    r.at = r.layer >= 0 ? r.layer + '-' + r.idx : null;
    r.path = nodes.filter((n) => n.done && n.id !== r.at).map((n) => n.id);
    if (r.at) r.path.push(r.at);
    delete r.layers; delete r.layer; delete r.idx;
  }

  // Sørger for at s.run har kartformat (konverterer eldre lagringer). Returnerer kartet eller null.
  NG.runMap = function (s) {
    const r = s && s.run; if (!r) return null;
    if (!r.map && Array.isArray(r.layers)) { try { convertLayers(r); } catch (e) { r.map = null; } }
    if (!r.map || !Array.isArray(r.map.nodes)) return null;
    if (!Array.isArray(r.map.edges)) r.map.edges = [];
    if (!Array.isArray(r.path)) r.path = r.at ? [r.at] : [];
    if (r.at === undefined) r.at = null;
    ['seenEnemies', 'seenEvents', 'seenLabs', 'usedQ'].forEach((k) => { if (!Array.isArray(r[k])) r[k] = []; });
    return r.map;
  };
  NG.mapNode = function (s, id) {
    const m = NG.runMap(s); if (!m || id == null) return null;
    return m.nodes.find((n) => n.id === id) || null;
  };
  // Noden du står på nå
  NG.runNode = (s) => (s && s.run ? NG.mapNode(s, s.run.at) : null);
  // Engangsbelønning: true første gang (og markerer noden), false etterpå
  NG.claimNode = function (s, key) {
    const n = NG.runNode(s); if (!n) return true;
    const k = key || 'claimed';
    if (n[k]) return false;
    n[k] = true;
    return true;
  };

  NG.startRun = function (s, region) {
    const seed = (Date.now() ^ NG.hashStr(region)) >>> 0;
    const rng = NG.makeRng(seed);
    const firstVisit = !(s.regionVisits[region] > 0);
    const map = genMap(rng, firstVisit);
    s.run = { region, seed, map, at: null, path: [], joule: 0, startedAt: Date.now(), seenEnemies: [], seenEvents: [], seenLabs: [], usedQ: [], ghostsBeaten: 0 };
    s.regionVisits[region] = (s.regionVisits[region] || 0) + 1;
    return s.run;
  };

  // Vanskelighetstrinn for en region: antall fullførte ekspedisjoner (boss slått), maks 4.
  // Brukes til skalering av fiender — avbrutte/tapte forsøk teller ikke (ingen dødsspiral).
  NG.regionTier = function (s, region) {
    const c = (s.regionClears && s.regionClears[region]) || (s.bossesBeaten && s.bossesBeaten[region] ? 1 : 0);
    return Math.max(0, Math.min(4, c | 0));
  };

  NG.runRng = function (s, salt) {
    const r = s.run;
    const n = NG.runNode(s);
    const row = n ? n.row : -1;
    const lane = n ? Math.round(n.lane * 2) : 0;
    return NG.makeRng((r.seed + (row + 1) * 7919 + (lane + 1) * 3571 + (salt || 0) * 104729) >>> 0);
  };

  // Hvilke noder kan velges nå? (nodeobjekter)
  NG.choosable = function (s) {
    const m = NG.runMap(s); if (!m) return [];
    const r = s.run;
    if (r.at == null) return m.nodes.filter((n) => n.row === 0);
    const cur = NG.mapNode(s, r.at);
    if (!cur) return m.nodes.filter((n) => n.row === 0);
    if (!cur.done) return [cur]; // avbrutt node (f.eks. appen ble lukket midt i kampen) kan tas opp igjen
    return m.edges.filter((e) => e[0] === cur.id).map((e) => NG.mapNode(s, e[1])).filter(Boolean);
  };

  NG.enterNode = function (s, id) {
    const r = s.run;
    if (!NG.runMap(s)) return null;
    const node = NG.mapNode(s, id);
    if (!node) return null;
    r.at = id;
    if (r.path[r.path.length - 1] !== id) r.path.push(id);
    const rng = NG.runRng(s, 1);
    const S = NG.content.store;
    if ((node.type === 'kamp' || node.type === 'elite' || node.type === 'boss') && !node.enemy) {
      const tier = node.type === 'kamp' ? 'normal' : node.type;
      if (tier === 'boss') {
        // Bossnoden er alltid regionens egen boss
        const bossId = NG.region(r.region).boss;
        const b = S.enemies.find((e) => e.id === bossId);
        node.enemy = b ? b.id : '_fallback-boss';
      } else {
        const pool = S.enemies.filter((e) => e.region === r.region && e.tier === tier);
        const fresh = pool.filter((e) => r.seenEnemies.indexOf(e.id) < 0);
        const e = (fresh.length ? rng.pick(fresh) : pool.length ? rng.pick(pool) : null);
        node.enemy = e ? e.id : '_fallback-' + tier;
      }
      r.seenEnemies.push(node.enemy);
    }
    if (node.type === 'hendelse' && !node.event) {
      const seen = s.seenEvents || (s.seenEvents = {});
      const pool = S.events.filter((e) => e.region === r.region && r.seenEvents.indexOf(e.id) < 0);
      pool.sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0));
      const least = pool.filter((e) => (seen[e.id] || 0) === (seen[pool[0] && pool[0].id] || 0));
      const ev = least.length ? rng.pick(least) : null;
      if (ev) { node.event = ev.id; r.seenEvents.push(ev.id); seen[ev.id] = (seen[ev.id] || 0) + 1; }
      else node.type = 'kiste';
    }
    if (node.type === 'lab' && !node.lab) {
      let pool = NG.minigames.forRegion(r.region).filter((m) => r.seenLabs.indexOf(m.id) < 0);
      if (!pool.length) pool = NG.minigames.list.filter((m) => r.seenLabs.indexOf(m.id) < 0);
      if (pool.length) {
        // foretrekk de du har spilt minst / dårligst
        pool.sort((a, b) => (s.labs[a.id] != null ? 1 + s.labs[a.id] : 0) - (s.labs[b.id] != null ? 1 + s.labs[b.id] : 0));
        const m = rng.chance(0.7) ? pool[0] : rng.pick(pool);
        node.lab = m.id; r.seenLabs.push(m.id);
      } else node.type = 'kamp';
      if (node.type === 'kamp') return NG.enterNode(s, id);
    }
    return node;
  };

  NG.completeNode = function (s) {
    const node = NG.runNode(s);
    if (node) node.done = true;
  };

  NG.endRun = function (s, outcome) {
    const r = s.run;
    s.run = null;
    if (!r) return null;
    if (outcome === 'win') {
      const c = s.regionClears || (s.regionClears = {});
      c[r.region] = (c[r.region] || 0) + 1;
    }
    if (outcome === 'death') {
      const lost = Math.floor(r.joule / 2);
      s.joule = Math.max(0, s.joule - lost);
      s.counters.deaths++;
      s.hp = Math.ceil(NG.maxHp(s) * 0.6);
      return { lost };
    }
    return { lost: 0 };
  };

  NG.fallbackEnemy = function (id) {
    const tier = (id.split('-')[1]) || 'normal';
    const t = { normal: [30, 6], elite: [60, 9], boss: [130, 12] }[tier] || [30, 6];
    return { id, name: tier === 'boss' ? 'Den store Misforståelsen' : 'En Misforståelse', region: 'energi', tier, hp: t[0], atk: t[1], art: '_fallback',
      intro: 'Et ullent vesen av halvforståtte ord glir frem.', taunts: ['Hverdagsspråk er godt nok!', 'Hvorfor forklare når man kan pugge?'], defeat: 'Begreper vokser når de brukes.' };
  };
  NG.enemyDef = function (id) {
    return NG.content.store.enemies.find((e) => e.id === id) || NG.fallbackEnemy(id);
  };
})();
