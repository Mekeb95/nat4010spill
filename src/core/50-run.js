/* Ekspedisjoner: en sti av lag med noder gjennom en region, avsluttet med boss. */
(function () {
  'use strict';
  NG.NODE_TYPES = {
    kamp: { name: 'Kamp', art: 'node-kamp', desc: 'En Misforståelse sperrer veien.' },
    elite: { name: 'Elite', art: 'node-elite', desc: 'En seiglivet Misforståelse. Bedre belønning.' },
    lab: { name: 'Laben', art: 'node-lab', desc: 'Et utforskende mini-spill.' },
    hendelse: { name: 'Hendelse', art: 'node-hendelse', desc: 'En situasjon der faget avgjør utfallet.' },
    sol: { name: 'Solgløtt', art: 'node-sol', desc: 'Hvil: sola fyller på energien, og du kan repetere.' },
    kiste: { name: 'Kiste', art: 'node-kiste', desc: 'Noe er gjemt her.' },
    boss: { name: 'Boss', art: 'node-boss', desc: 'Misforståelsen som holder nøkkelarket.' },
  };

  const PLAN = [
    [['kamp']],
    [['kamp', 'lab', 'hendelse'], ['kamp', 'lab', 'hendelse']],
    [['kamp', 'kiste', 'hendelse'], ['kamp', 'elite', 'lab']],
    [['sol'], ['lab', 'hendelse']],
    [['elite', 'kamp'], ['kamp', 'lab', 'hendelse']],
    [['kamp', 'hendelse', 'kiste'], ['kamp', 'lab', 'elite']],
    [['sol'], ['kiste', 'lab']],
    [['boss']],
  ];

  NG.startRun = function (s, region) {
    const seed = (Date.now() ^ NG.hashStr(region)) >>> 0;
    const rng = NG.makeRng(seed);
    const layers = PLAN.map((slots) => {
      const types = slots.map((opts) => rng.pick(opts));
      // unngå to like noder i samme lag
      if (types.length === 2 && types[0] === types[1]) {
        const alt = slots[1].filter((t) => t !== types[0]);
        if (alt.length) types[1] = rng.pick(alt);
      }
      return types.map((t) => ({ type: t, done: false }));
    });
    // Første besøk: mindre tøft — ingen elite før lag 4
    if (!(s.regionVisits[region] > 0)) {
      layers[2].forEach((n) => { if (n.type === 'elite') n.type = 'lab'; });
    }
    s.run = { region, seed, layers, layer: -1, idx: -1, joule: 0, startedAt: Date.now(), seenEnemies: [], seenEvents: [], seenLabs: [], usedQ: [], ghostsBeaten: 0 };
    s.regionVisits[region] = (s.regionVisits[region] || 0) + 1;
    return s.run;
  };

  NG.runRng = function (s, salt) {
    const r = s.run;
    return NG.makeRng((r.seed + (r.layer + 1) * 7919 + (salt || 0) * 104729) >>> 0);
  };

  // Hvilke noder kan velges nå?
  NG.choosable = function (s) {
    const r = s.run; if (!r) return [];
    const next = r.layer + 1;
    if (next >= r.layers.length) return [];
    return r.layers[next].map((n, i) => ({ layer: next, idx: i, node: n }));
  };

  NG.enterNode = function (s, layer, idx) {
    const r = s.run;
    r.layer = layer; r.idx = idx;
    const node = r.layers[layer][idx];
    const rng = NG.runRng(s, idx + 1);
    const S = NG.content.store;
    if ((node.type === 'kamp' || node.type === 'elite' || node.type === 'boss') && !node.enemy) {
      const tier = node.type === 'kamp' ? 'normal' : node.type;
      let pool = S.enemies.filter((e) => e.region === r.region && e.tier === tier);
      if (tier === 'boss') pool = S.enemies.filter((e) => e.id === NG.region(r.region).boss).concat(pool);
      const fresh = pool.filter((e) => r.seenEnemies.indexOf(e.id) < 0);
      const e = (fresh.length ? rng.pick(fresh) : pool.length ? rng.pick(pool) : null);
      node.enemy = e ? e.id : '_fallback-' + tier;
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
      if (node.type === 'kamp') return NG.enterNode(s, layer, idx);
    }
    return node;
  };

  NG.completeNode = function (s) {
    const r = s.run; if (!r) return;
    const node = r.layers[r.layer][r.idx];
    node.done = true;
  };

  NG.endRun = function (s, outcome) {
    const r = s.run;
    s.run = null;
    if (!r) return null;
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
