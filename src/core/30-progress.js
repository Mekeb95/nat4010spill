/* Progresjon: XP og nivå, statistikk, begrepskort (begrepsstigen), repetisjon (Leitner) og spørsmålsvalg. */
(function () {
  'use strict';
  const DAY = 24 * 3600 * 1000;
  const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32];

  /* ---------- Avledede verdier ---------- */
  NG.maxHp = (s) => 60 + 10 * s.stats.utholdenhet + 5 * s.level;
  NG.maxEnergy = (s) => 40 + 6 * s.stats.nysgjerrighet + (NG.hasRelic(s, 'solcelle') ? 10 : 0);
  NG.hintsPerFight = (s) => 1 + Math.floor(s.stats.nysgjerrighet / 2) + (NG.hasRelic(s, 'notatbok') ? 1 : 0);
  NG.xpNeed = (lvl) => 60 + 45 * lvl;
  // Varige relikvier (s.relics) og ekspedisjonsrelikvier (s.run.relics)
  NG.hasRelic = (s, id) => (Array.isArray(s.relics) && s.relics.indexOf(id) >= 0) ||
    !!(s.run && Array.isArray(s.run.relics) && s.run.relics.indexOf(id) >= 0);
  // Tilfør energi opp til maks. Overskuddet blir spillvarme (energien er bevart, men lite nyttig).
  // Returnerer { gained, heat }.
  NG.addEnergy = function (s, amount) {
    const room = Math.max(0, NG.maxEnergy(s) - s.energy);
    const gained = Math.min(room, amount);
    s.energy += gained;
    const heat = amount - gained;
    if (heat > 0) s.heat += heat;
    return { gained, heat };
  };

  /* ---------- XP og nivå ---------- */
  // Returnerer antall nivåer opp.
  NG.gainXp = function (s, amount) {
    const mult = 1 + 0.05 * (s.stats.nysgjerrighet - 1);
    s.xp += Math.round(amount * mult);
    let ups = 0;
    while (s.xp >= NG.xpNeed(s.level)) {
      s.xp -= NG.xpNeed(s.level);
      s.level++;
      s.statPoints++;
      ups++;
    }
    if (ups) { s.hp = NG.maxHp(s); }
    return ups;
  };

  /* ---------- Begrepskort ---------- */
  NG.card = function (s, id) {
    if (!s.cards[id]) s.cards[id] = { lvl: 0, sub: 0, seen: 0, right: 0, wrong: 0 };
    return s.cards[id];
  };
  // Oppdater kort etter svar. Returnerer liste over {id, lvl} som steg.
  NG.updateCards = function (s, q, correct) {
    const ups = [];
    for (const id of q.concepts || []) {
      const c = NG.card(s, id);
      c.seen++;
      if (correct) {
        c.right++;
        if (c.lvl === 0) { c.lvl = 1; ups.push({ id, lvl: 1 }); continue; }
        if (q.level >= c.lvl + 1 && c.lvl < 5) { c.lvl++; c.sub = 0; ups.push({ id, lvl: c.lvl }); }
        else {
          c.sub++;
          // Gjentatte riktige svar på lavere nivå løfter bare opp til «Definere».
          if (c.sub >= 3 && c.lvl < 2) { c.lvl++; c.sub = 0; ups.push({ id, lvl: c.lvl }); }
        }
      } else {
        c.wrong++;
        c.sub = 0;
        if (c.lvl === 0) c.lvl = 0;
      }
    }
    return ups;
  };
  NG.regionMastery = function (s, region) {
    const cs = NG.content.store.concepts.filter((c) => c.region === region);
    if (!cs.length) return { avg: 0, known: 0, total: 0, pct: 0 };
    let sum = 0; let known = 0;
    for (const c of cs) { const k = s.cards[c.id]; const l = k ? k.lvl : 0; sum += l; if (l > 0) known++; }
    return { avg: sum / cs.length, known, total: cs.length, pct: sum / (cs.length * 5) };
  };

  /* ---------- Repetisjon (Leitner) ---------- */
  NG.srsUpdate = function (s, q, correct) {
    const r = s.srs[q.id] || (s.srs[q.id] = { box: 0, due: 0, seen: 0, right: 0, wrong: 0, last: 0 });
    r.seen++; r.last = Date.now();
    if (correct) { r.right++; r.box = Math.min(6, r.box + 1); r.due = Date.now() + BOX_DAYS[r.box] * DAY; }
    else { r.wrong++; r.box = 1; r.due = Date.now() + 10 * 60 * 1000; }
  };
  NG.dueQuestions = function (s, region) {
    const now = Date.now();
    const qs = NG.content.store.questions;
    const out = [];
    for (const q of qs) {
      if (region && q.region !== region) continue;
      const r = s.srs[q.id];
      if (r && r.due <= now && (r.wrong > 0 || r.box < 6)) out.push(q);
    }
    // de du har bommet mest på først
    out.sort((a, b) => (s.srs[b.id].wrong - s.srs[b.id].right * 0.5) - (s.srs[a.id].wrong - s.srs[a.id].right * 0.5));
    return out;
  };

  /* ---------- Spørsmålsvalg ---------- */
  // ctx: { region, tier: 'normal'|'elite'|'boss', used: Set, rng, topics?: [], ghostChance }
  NG.pickQuestion = function (s, ctx) {
    const rng = ctx.rng;
    const used = ctx.used || new Set();
    const all = NG.content.store.questions;
    // Gjenferd: forfalt repetisjonsspørsmål fra hvilken som helst region
    if (ctx.ghostChance && rng.chance(ctx.ghostChance)) {
      const due = NG.dueQuestions(s).filter((q) => !used.has(q.id));
      if (due.length) { const q = due[Math.min(due.length - 1, rng.int(0, 2))]; return { q, ghost: q.region !== ctx.region }; }
    }
    const pool = all.filter((q) => q.region === ctx.region && !used.has(q.id));
    if (!pool.length) {
      const any = all.filter((q) => q.region === ctx.region);
      used.clear();
      return any.length ? { q: rng.pick(any) } : null;
    }
    const m = NG.regionMastery(s, ctx.region).avg;
    // Vanskelighet følger fullførte ekspedisjoner (NG.regionTier), ikke avbrutte/tapte forsøk.
    let tierN = null;
    if (NG.regionTier) { try { tierN = NG.regionTier(s, ctx.region); } catch (e) { tierN = null; } }
    if (!isFinite(tierN)) tierN = Math.max(0, (s.regionVisits[ctx.region] || 1) - 1);
    let target = 1.6 + m + Math.min(1.5, 0.4 + 0.4 * NG.clamp(tierN, 0, 4)) + (ctx.tier === 'elite' ? 0.8 : ctx.tier === 'boss' ? 1.4 : 0);
    target = NG.clamp(target, 1, 5);
    const now = Date.now();
    const weights = pool.map((q) => {
      let w = 1 / (1 + Math.abs(q.level - target));
      const r = s.srs[q.id];
      if (!r) w *= 1.6; // usett
      else if (r.due <= now) w *= 2.2; // forfalt
      else w *= 0.25 + 0.1 * Math.max(0, 5 - r.box); // nylig mestret: sjeldnere
      if (ctx.topics && ctx.topics.indexOf(q.topic) >= 0) w *= 1.8;
      // begreper du er svak på
      for (const c of q.concepts || []) { const k = s.cards[c]; if (k && k.wrong > k.right) w *= 1.3; }
      return w;
    });
    let tot = 0; for (const w of weights) tot += w;
    let x = rng.next() * tot;
    for (let i = 0; i < pool.length; i++) { x -= weights[i]; if (x <= 0) return { q: pool[i] }; }
    return { q: pool[pool.length - 1] };
  };

  /* ---------- Svar-registrering (felles for kamp, repetisjon, solgløtt) ---------- */
  // Returnerer { xp, cardUps, levelUps }
  NG.recordAnswer = function (s, q, res) {
    s.counters.answered++;
    if (res.correct) s.counters.correct++;
    NG.srsUpdate(s, q, res.correct);
    const cardUps = NG.updateCards(s, q, res.correct);
    const xp = res.correct ? 2 + q.level : Math.round(1 + 2 * (res.partial || 0));
    const levelUps = NG.gainXp(s, xp);
    return { xp, cardUps, levelUps };
  };

  NG.today = function () {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  };
})();
