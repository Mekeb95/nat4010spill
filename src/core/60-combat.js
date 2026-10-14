/* Kamplogikk (ren tilstand, ingen DOM). UI-et i src/ui/screen-combat.js driver den.
   Riktig svar = du angriper. Feil svar = Misforståelsen slår. I tillegg har fienden en plan
   (intensjon) som kan slå uansett — det gir press og gjør Grubletegning/skjold verdifullt.
   Ekspedisjonsrelikvier (NG.RUN_RELICS) og evnenivåer (s.abilities) hektes inn her. */
(function () {
  'use strict';
  const INTENT_TEXT = {
    vent: { name: 'Lurer', desc: 'Slår bare hvis du svarer feil.' },
    slag: { name: 'Slag', desc: 'Slår litt selv om du svarer riktig — hardt hvis du svarer feil.' },
    storslag: { name: 'Storslag', desc: 'Et kraftig angrep uansett. Skjold hjelper!' },
    mytekall: { name: 'Mytekall', desc: 'Roper på myten sin: spørsmålet handler om den. Riktig svar gjør ×1,5 skade — feil svar slår hardere.' },
    forskanser: { name: 'Forskanser seg', desc: 'Riktige svar gjør bare halv skade, med mindre spørsmålet er på nivå 4–5.' },
    energityv: { name: 'Energityv', desc: 'Gjør 10 J av energien din om til spillvarme (5 J hvis du svarer riktig).' },
    ladeopp: { name: 'Lader opp', desc: 'Svar riktig for å avbryte! Ellers kommer et dobbelt slag neste runde.' },
    utlading: { name: 'Utlading', desc: 'Dobbelt slag hvis du svarer feil — et vanlig slag selv om du svarer riktig.' },
  };
  NG.INTENT_TEXT = INTENT_TEXT;

  const ELITE_MODS = {
    seiglivet: { name: 'Seiglivet', desc: '+30 % HP. Misoppfatninger som har overlevd mange skoleår, sitter godt.' },
    smittsom: { name: 'Smittsom', desc: 'Feilsvar smitter: du mister 3 HP per runde i 3 runder. Et riktig svar renser.' },
    rask: { name: 'Rask', desc: '+15 % angrep, og planen har flere angrep.' },
  };
  NG.ELITE_MODS = ELITE_MODS;

  const has = (s, id) => NG.hasRelic(s, id);

  // Utvid planen (intensjonene) slik at den rekker til tur `upto`.
  function extendPlan(c, upto) {
    const r = c.planRng;
    const rask = c.mods.indexOf('rask') >= 0;
    const pattern = c.tier === 'boss' ? ['calm', 'act', 'calm', 'big']
      : c.tier === 'elite' ? (rask ? ['act', 'calm', 'act'] : ['calm', 'act'])
        : (rask ? ['calm', 'act'] : ['calm', 'calm', 'act']);
    while (c.plan.length <= upto) {
      const t = c.plan.length;
      let it;
      if (t === 0) it = 'vent';
      else if (c.plan[t - 1] !== 'vent' && c.plan[t - 1] !== 'slag' && pattern[t % pattern.length] !== 'big') it = pattern[t % pattern.length] === 'act' ? 'slag' : 'vent';
      else {
        const slot = pattern[t % pattern.length];
        if (slot === 'calm') {
          const opts = ['forskanser'];
          if (c.mythQ) opts.push('mytekall', 'mytekall');
          it = r.chance(0.35) ? r.pick(opts) : 'vent';
        } else if (slot === 'act') it = r.chance(0.35) ? r.pick(['energityv', 'ladeopp']) : 'slag';
        else it = r.chance(0.3) ? 'ladeopp' : 'storslag';
      }
      c.plan.push(it);
    }
  }

  function regionTier(s, region) {
    let t;
    if (NG.regionTier) { try { t = NG.regionTier(s, region); } catch (e) { t = null; } }
    if (!isFinite(t)) t = Math.max(0, (s.regionVisits[region] || 1) - 1);
    return NG.clamp(Math.floor(t), 0, 4);
  }

  NG.Combat = {
    create(s, enemyId, opts) {
      opts = opts || {};
      const def = NG.enemyDef(enemyId);
      const rng = opts.rng || NG.makeRng(Date.now());
      const tierN = regionTier(s, def.region);
      const scale = 1 + 0.1 * tierN + 0.02 * NG.clamp(s.level - 3, 0, 10);
      let hp = def.hp * scale;
      let atk = def.atk * (1 + 0.06 * tierN);
      const mods = [];
      if (def.tier === 'elite') {
        const pool = rng.shuffle(Object.keys(ELITE_MODS));
        mods.push(pool[0]);
        if (tierN >= 2) mods.push(pool[1]);
      }
      if (mods.indexOf('seiglivet') >= 0) hp *= 1.3;
      if (mods.indexOf('rask') >= 0) atk *= 1.15;
      hp = Math.round(hp);
      const S = NG.content.store;
      const c = {
        def,
        enemy: { hp, maxHp: hp, atk: Math.round(atk) },
        tier: def.tier,
        mods,
        tierN,
        turn: 0,
        streak: 0,
        bestStreak: 0,
        hints: NG.hintsPerFight(s),
        shield: 0, // antall angrep skjoldet tåler
        reveal: false, // Grubletegning: se planen to trekk frem
        peb: 0, // 0 = av, 1.. = aktiv (antall riktige så langt + 1)
        eliminate: 0,
        blikkUsed: false,
        double: false,
        forceCrit: false,
        model: 0,
        infect: 0,
        charge: 0,
        retry: false,
        retryTopic: null,
        abUsed: [],
        freeAb: has(s, 'katalysator') ? 1 : 0,
        blikkFree: NG.abilityLevel(s, 'blikk') >= 4 ? 1 : 0,
        wrongBlocked: has(s, 'vernebriller'),
        phaseIdx: 0,
        enraged: 1,
        rng,
        planRng: NG.makeRng(rng.int(0, 1e9)),
        plan: [],
        mythQ: !!(def.myth && S.questions.some((q) => q.myth === def.myth)),
        region: opts.region || def.region,
        used: opts.used || new Set(),
        q: null,
        qSeed: 0,
        ghost: false,
        correct: 0,
        answered: 0,
        over: null,
      };
      extendPlan(c, 3);
      return c;
    },

    // Intensjon for denne turen (k = 0) eller k turer frem.
    intent(c, k) {
      const t = c.turn + (k || 0);
      if (!c.plan) return 'vent';
      extendPlan(c, t);
      return c.plan[t];
    },

    nextQuestion(s, c) {
      const S = NG.content.store;
      let picked = null;
      c.retry = false;
      if (NG.Combat.intent(c) === 'mytekall') {
        const pool = S.questions.filter((q) => q.myth === c.def.myth && !c.used.has(q.id));
        if (pool.length) picked = { q: c.rng.pick(pool) };
        else c.plan[c.turn] = 'vent';
      }
      if (!picked && c.retryTopic) {
        const rt = c.retryTopic;
        const pool = S.questions.filter((q) => q.topic === rt.topic && q.region === rt.region && !c.used.has(q.id));
        if (pool.length) { picked = { q: c.rng.pick(pool) }; c.retry = true; }
      }
      c.retryTopic = null;
      if (!picked) picked = NG.pickQuestion(s, { region: c.region, tier: c.tier, used: c.used, rng: c.rng, topics: c.def.topics, ghostChance: has(s, 'leitner') ? 0.25 : 0.12 });
      if (!picked) { c.q = null; return null; }
      c.q = picked.q; c.ghost = !!picked.ghost;
      c.qSeed = c.rng.int(0, 1e9);
      c.eliminate = 0; c.blikkUsed = false;
      c.used.add(c.q.id);
      return c.q;
    },

    baseDamage(s) { return 5 + 2 * s.stats.forstaelse + 0.5 * s.level; },

    // Hva koster evnen akkurat nå? { cost, free: null|'katalysator'|'tannhjul'|'blikk' }
    abilityCost(s, c, ab) {
      if (c && c.turn < 2 && has(s, 'tannhjul')) return { cost: 0, free: 'tannhjul' };
      if (c && c.freeAb > 0) return { cost: 0, free: 'katalysator' };
      if (c && ab.id === 'blikk' && c.blikkFree > 0) return { cost: 0, free: 'blikk' };
      return { cost: NG.abilityCost(s, ab), free: null };
    },

    useAbility(s, c, id) {
      const ab = NG.ability(id);
      if (!ab) return { ok: false, msg: 'Ukjent evne' };
      if (ab.needs && !has(s, ab.needs)) return { ok: false, msg: 'Krever ' + NG.item(ab.needs).name };
      if (ab.unlock && s.level < ab.unlock) return { ok: false, msg: 'Låses opp på nivå ' + ab.unlock };
      const lvl = NG.abilityLevel(s, id);
      const ci = NG.Combat.abilityCost(s, c, ab);
      const cost = ci.cost;
      if (s.energy < cost) return { ok: false, msg: 'For lite energi (' + cost + ' J trengs)' };
      const out = { ok: true, msg: '', hint: false, up: null };
      if (id === 'blikk') {
        if (!c.q || c.q.type !== 'mc') return { ok: false, msg: 'Virker bare på flervalgsspørsmål' };
        if (c.blikkUsed) return { ok: false, msg: 'Allerede aktiv' };
        c.blikkUsed = true;
        c.eliminate += 2;
        if (lvl >= 5) out.hint = true;
      } else if (id === 'gruble') {
        if (c.shield) return { ok: false, msg: 'Skjoldet er allerede oppe' };
        c.shield = lvl >= 4 ? 2 : 1;
        c.reveal = true;
        if (lvl >= 5) c.hints++;
      } else if (id === 'peb') {
        if (c.peb) return { ok: false, msg: 'PEB-kombo er allerede i gang' };
        c.peb = 1;
      } else if (id === 'modell') {
        if (c.model) return { ok: false, msg: 'Modellen står allerede klar' };
        c.model = lvl >= 5 ? 2 : 1;
      } else if (id === 'pumpe') {
        const amt = NG.pumpAmount(s);
        if (s.heat < amt) return { ok: false, msg: 'For lite spillvarme å hente (' + amt + ' J trengs)' };
        if (s.energy >= NG.maxEnergy(s)) return { ok: false, msg: 'Du er full av energi' };
        s.energy -= cost; s.heat += cost; // drivenergien blir også til varme …
        const got = NG.recoverHeat(s, amt); // … og varmepumpa løfter varme tilbake til nyttig energi (opp til maks)
        out.msg = 'Varmepumpa løftet ' + got + ' J ut av spillvarmen';
        out.up = NG.abilityXp(s, 'pumpe', 2);
      }
      if (id !== 'pumpe') {
        // Energien forsvinner ikke: den blir spillvarme.
        s.energy -= cost; s.heat += cost;
        out.msg = ab.name + (cost ? ' (−' + cost + ' J → spillvarme)' : ' (gratis)');
        if (c.abUsed.indexOf(id) < 0) c.abUsed.push(id);
      }
      if (ci.free === 'katalysator') { c.freeAb--; out.msg += ' — Katalysatoren senket aktiveringsenergien'; }
      else if (ci.free === 'blikk') c.blikkFree = 0;
      else if (ci.free === 'tannhjul') out.msg += ' — tannhjulet snurrer';
      return out;
    },

    useItem(s, c, id) {
      const it = NG.item(id);
      if (!it || !(s.items[id] > 0)) return { ok: false, msg: 'Har ikke ' + (it ? it.name : id) };
      const out = { ok: true, msg: it.name + ' brukt', reveal: null };
      if (id === 'matpakke') {
        if (s.energy >= NG.maxEnergy(s)) return { ok: false, msg: 'Du er full av energi' };
        const r = NG.addEnergy(s, 20);
        out.msg = it.name + ': +' + r.gained + ' J' + (r.heat ? ' (' + r.heat + ' J ble spillvarme)' : '');
      } else if (id === 'kakao') { if (s.hp >= NG.maxHp(s)) return { ok: false, msg: 'Du har full HP' }; s.hp = Math.min(NG.maxHp(s), s.hp + 25); }
      else if (id === 'repetisjonskort') { if (c.double) return { ok: false, msg: 'Allerede aktiv' }; c.double = true; }
      else if (id === 'brannteppe') { c.shield++; out.msg = 'Brannteppet skjermer deg mot neste angrep'; }
      else if (id === 'torris') {
        const it0 = NG.Combat.intent(c);
        if (it0 === 'vent') return { ok: false, msg: 'Misforståelsen lurer allerede' };
        c.plan[c.turn] = 'vent'; out.msg = 'Tørrisen frøs planen: Misforståelsen kan bare lure';
      } else if (id === 'magnesium') { if (c.forceCrit) return { ok: false, msg: 'Allerede aktiv' }; c.forceCrit = true; out.msg = 'Magnesiumbåndet gløder: neste riktige svar blir kritisk'; }
      else if (id === 'lakmus') {
        const q = c.q;
        if (!q || (q.type !== 'mc' && q.type !== 'multi')) return { ok: false, msg: 'Virker bare på flervalgsspørsmål' };
        const i = c.rng.int(0, q.options.length - 1);
        const right = q.type === 'mc' ? i === q.answer : q.answer.indexOf(i) >= 0;
        out.reveal = { text: q.options[i], right, multi: q.type === 'multi' };
        out.msg = 'Lakmuspapiret farges ' + (right ? 'blått' : 'rødt');
      } else return { ok: false, msg: 'Kan ikke brukes her' };
      s.items[id]--;
      return out;
    },

    // res: { correct, partial }. Returnerer hva som skjedde, for animasjon/tekst.
    answer(s, c, res) {
      const q = c.q;
      const intent = NG.Combat.intent(c);
      const out = { dealt: 0, crit: false, taken: 0, blocked: false, finisher: false, phase: null, intent, notes: [], abilityUps: [], counter: 0 };
      const base = NG.Combat.baseDamage(s);
      const pebLvl = NG.abilityLevel(s, 'peb');
      const modLvl = NG.abilityLevel(s, 'modell');
      const ups = [];
      const xp = (id, n) => { const u = NG.abilityXp(s, id, n); if (u) ups.push(u); };
      c.answered++;
      const prevStreak = c.streak;
      if (res.correct) {
        c.correct++; c.streak++; c.bestStreak = Math.max(c.bestStreak, c.streak);
        if (c.infect) { c.infect = 0; out.notes.push('Det riktige svaret renset smitten.'); }
      } else {
        c.streak = has(s, 'newtons-vugge') ? Math.floor(c.streak / 2) : 0;
        if (c.streak > 0 && prevStreak >= 2) out.notes.push('Newtons vugge: rekka svinger videre (×' + c.streak + ').');
      }

      // --- spillerens angrep ---
      const part = res.correct ? 1 : (res.partial || 0) * 0.5;
      if (part > 0) {
        let dmg = base;
        dmg *= 1 + 0.1 * Math.min(c.streak, 5);
        let cardSum = 0;
        for (const id of q.concepts || []) { const k = s.cards[id]; if (k) cardSum += k.lvl; }
        const dna = has(s, 'dna-modell');
        dmg *= Math.min(dna ? 1.6 : 1.3, 1 + (dna ? 0.06 : 0.03) * cardSum);
        if (q.level >= 5) dmg *= 1.3; else if (q.level >= 4) dmg *= 1.15;
        if (c.region === 'stoffer' && has(s, 'periodesystem')) dmg *= 1.25;
        if (has(s, 'termoelement')) dmg += Math.min(6, Math.floor(s.heat / 10));
        if (res.correct) {
          if (c.double) { dmg *= 2; out.notes.push('Repetisjonskortet doblet skaden!'); }
          if (c.ghost) dmg *= has(s, 'leitner') ? 1.5 : 1.2;
          if (c.retry) { dmg *= 1.5; out.notes.push('Kontrollforsøket bekreftet det: ×1,5 skade.'); }
          if (intent === 'mytekall' && q.myth && q.myth === c.def.myth) { dmg *= 1.5; out.notes.push('Du avkreftet myten direkte: ×1,5 skade!'); }
          if (c.model) {
            const bonus = Math.max(6, (modLvl >= 3 ? 4 : 3) * cardSum);
            dmg += bonus; c.model--;
            out.notes.push('Modellen forklarte fenomenet: +' + bonus + ' skade.');
            if (modLvl >= 4) { s.hp = Math.min(NG.maxHp(s), s.hp + 6); }
          }
        }
        if (intent === 'forskanser') {
          if (q.level >= 4) out.notes.push('Et spørsmål på nivå ' + q.level + ' brøt gjennom forskansningen!');
          else { dmg *= 0.5; out.notes.push('Misforståelsen hadde forskanset seg — halv skade.'); }
        }
        if (res.correct) {
          let critP = 0.08 + 0.02 * s.stats.nysgjerrighet;
          if (has(s, 'prisme') && q.level >= 4) critP += 0.15;
          if (has(s, 'schrodinger')) critP += 0.25;
          if (c.forceCrit || c.rng.chance(critP)) { dmg *= 1.5; out.crit = true; if (c.forceCrit) out.notes.push('Magnesiumbåndet blusset opp!'); c.forceCrit = false; }
        }
        if (has(s, 'schrodinger') && !out.crit) dmg *= 0.85;
        dmg *= part;
        out.dealt = Math.max(1, Math.round(dmg));
      }
      c.double = false;

      if (res.correct) {
        if (has(s, 'vandegraaff')) {
          c.charge++;
          if (c.charge >= 4) { c.charge = 0; const sp = Math.round(base); out.dealt += sp; out.notes.push('Van de Graaff: gnisten slo over (+' + sp + ')!'); }
        }
        if (has(s, 'bunsenbrenner') && c.streak >= 3) NG.addEnergy(s, 3);
        if (c.abUsed.indexOf('blikk') >= 0 && NG.abilityLevel(s, 'blikk') >= 2 && s.heat > 0) NG.recoverHeat(s, 3);
      } else {
        if (has(s, 'feltdagbok') && s.heat > 0) { const g = NG.recoverHeat(s, 4); if (g) out.notes.push('Feltdagboka: du lærte av feilen (+' + g + ' J).'); }
        if (has(s, 'kontrollforsok') && q.topic) c.retryTopic = { topic: q.topic, region: q.region };
      }

      // --- PEB-kombo ---
      if (c.peb) {
        const need = pebLvl >= 5 ? 2 : 3;
        if (res.correct) {
          xp('peb', 1);
          if (c.peb >= need) {
            const fin = Math.round(base * (pebLvl >= 2 ? 2.7 : 2.2));
            out.dealt += fin; out.finisher = true; c.peb = 0;
            xp('peb', 2);
            out.notes.push('Påstand, evidens og begrunnelse sitter: knusende argument (+' + fin + ')!');
          } else { c.peb++; out.notes.push(['', 'Påstand ✓', 'Evidens ✓'][c.peb - 1] || ''); }
        } else if (pebLvl >= 4) {
          if (c.peb > 1) c.peb--;
          out.notes.push('Argumentet vaklet, men står — ett steg tilbake.');
        } else { c.peb = 0; out.notes.push('Argumentet falt sammen — PEB-kombo brutt.'); }
      }
      c.enemy.hp = Math.max(0, c.enemy.hp - out.dealt);

      // --- fasebytte for bosser ---
      const phases = c.def.phases || [];
      while (c.phaseIdx < phases.length && c.enemy.hp / c.enemy.maxHp <= phases[c.phaseIdx].at && c.enemy.hp > 0) {
        out.phase = phases[c.phaseIdx].text; c.phaseIdx++; c.enraged *= 1.12;
      }

      // --- fiendens trekk ---
      if (c.enemy.hp > 0) {
        const atk = c.enemy.atk * c.enraged;
        const miss = 1 - (res.partial || 0) * 0.5;
        let dmg = 0;
        if (intent === 'vent') dmg = res.correct ? 0 : atk * miss;
        else if (intent === 'slag') dmg = res.correct ? atk * 0.35 : atk * 1.2;
        else if (intent === 'storslag') dmg = res.correct ? atk * 0.7 : atk * 1.6;
        else if (intent === 'mytekall') dmg = res.correct ? 0 : atk * 1.4 * miss;
        else if (intent === 'forskanser') dmg = res.correct ? 0 : atk * 0.8 * miss;
        else if (intent === 'energityv') {
          dmg = res.correct ? 0 : atk * 0.6 * miss;
          const moved = Math.min(s.energy, res.correct ? 5 : 10);
          s.energy -= moved; s.heat += moved;
          if (moved) out.notes.push('Energityven gjorde ' + moved + ' J om til spillvarme.');
        } else if (intent === 'ladeopp') {
          dmg = res.correct ? 0 : atk * 0.8 * miss;
          if (res.correct) out.notes.push('Du avbrøt oppladningen!');
          else { extendPlan(c, c.turn + 1); c.plan[c.turn + 1] = 'utlading'; out.notes.push('Den lader opp — neste runde kommer et dobbelt slag!'); }
        } else if (intent === 'utlading') dmg = res.correct ? atk * 0.9 : atk * 2;
        if (has(s, 'dewar')) { if (res.correct) dmg = 0; else dmg *= 1.25; }
        if (dmg > 0 && !res.correct && c.wrongBlocked) { c.wrongBlocked = false; dmg = 0; out.blocked = true; out.notes.push('Vernebrillene tok støyten.'); }
        if (dmg > 0 && c.shield > 0) {
          c.shield--;
          out.blocked = true;
          out.notes.push('Skjoldet tok angrepet.');
          if (c.abUsed.indexOf('gruble') >= 0) xp('gruble', 1);
          if (NG.abilityLevel(s, 'gruble') >= 3) {
            out.counter = Math.max(1, Math.round(dmg * 0.5));
            c.enemy.hp = Math.max(0, c.enemy.hp - out.counter);
            out.dealt += out.counter;
            out.notes.push('Motargument: +' + out.counter + ' skade.');
          }
          dmg = 0;
        }
        if (dmg > 0 && has(s, 'termos')) dmg *= 0.8;
        if (dmg > 0 && has(s, 'tannhjul')) dmg *= 1.1;
        out.taken = Math.round(dmg);
        // smitte (elite-modifikator)
        if (c.infect > 0) { out.taken += 3; c.infect--; out.notes.push('Smitten gnager (−3 HP).'); }
        if (!res.correct && c.mods.indexOf('smittsom') >= 0) { c.infect = 3; out.notes.push('Misforståelsen smitter! Svar riktig for å rense.'); }
        s.hp = Math.max(0, s.hp - out.taken);
      }

      // --- mestring for evner brukt denne runden ---
      for (const id of c.abUsed) if (id !== 'peb') xp(id, res.correct ? 2 : 1);
      c.abUsed = [];
      out.abilityUps = ups;

      c.turn++;
      c.eliminate = 0;
      c.retry = false;
      if (c.enemy.hp <= 0) c.over = 'win';
      else if (s.hp <= 0) c.over = 'lose';
      return out;
    },

    // Belønning ved seier
    rewards(s, c) {
      const tierXp = { normal: 15, elite: 30, boss: 80 }[c.tier] || 15;
      let xp = tierXp + 2 * c.bestStreak;
      if (has(s, 'kalorimeter')) xp = Math.round(xp * 1.15);
      const j = { normal: c.rng.int(6, 12), elite: c.rng.int(18, 28), boss: 60 }[c.tier] || 8;
      const out = { xp, joule: j, item: null, relic: null, energy: 0, heal: Math.round(NG.maxHp(s) * 0.08) };
      if (has(s, 'solcelle')) out.energy = 5;
      if (c.tier === 'elite' || c.tier === 'boss') {
        const unowned = NG.ITEMS.filter((i) => i.kind === 'relic' && !(s.relics || []).includes(i.id));
        if (unowned.length && (c.tier === 'boss' || c.rng.chance(0.2))) out.relic = c.rng.pick(unowned).id;
      }
      if (!out.relic && c.rng.chance(c.tier === 'normal' ? 0.3 : 0.6)) out.item = c.rng.pick(NG.combatItems().map((i) => i.id));
      return out;
    },
  };
})();
