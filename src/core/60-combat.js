/* Kamplogikk (ren tilstand, ingen DOM). UI-et i src/ui/screen-combat.js driver den.
   Riktig svar = du angriper. Feil svar = Misforståelsen slår. I tillegg har fienden en plan
   (intensjon) som kan slå uansett — det gir press og gjør Grubletegning/skjold verdifullt. */
(function () {
  'use strict';
  const INTENTS = {
    normal: ['vent', 'vent', 'slag'],
    elite: ['vent', 'slag', 'vent', 'slag'],
    boss: ['vent', 'slag', 'vent', 'storslag'],
  };
  const INTENT_TEXT = {
    vent: { name: 'Lurer', desc: 'Slår bare hvis du svarer feil.' },
    slag: { name: 'Slag', desc: 'Slår litt selv om du svarer riktig — hardt hvis du svarer feil.' },
    storslag: { name: 'Storslag', desc: 'Et kraftig angrep uansett. Skjold hjelper!' },
  };
  NG.INTENT_TEXT = INTENT_TEXT;

  NG.Combat = {
    create(s, enemyId, opts) {
      const def = NG.enemyDef(enemyId);
      const visits = s.regionVisits[def.region] || 1;
      const scale = 1 + 0.12 * Math.max(0, visits - 1) + 0.03 * Math.max(0, s.level - 3);
      const hp = Math.round(def.hp * scale);
      const c = {
        def,
        enemy: { hp, maxHp: hp, atk: Math.round(def.atk * (1 + 0.08 * Math.max(0, visits - 1))) },
        tier: def.tier,
        turn: 0,
        streak: 0,
        bestStreak: 0,
        hints: NG.hintsPerFight(s),
        shield: false,
        peb: 0, // 0 = av, 1..3 = aktiv (antall riktige så langt + 1)
        eliminate: 0,
        double: false,
        wrongBlocked: NG.hasRelic(s, 'vernebriller'),
        phaseIdx: 0,
        enraged: 1,
        rng: opts.rng,
        region: opts.region || def.region,
        used: opts.used || new Set(),
        q: null,
        ghost: false,
        correct: 0,
        answered: 0,
        over: null,
      };
      return c;
    },

    intent(c) {
      const seq = INTENTS[c.tier] || INTENTS.normal;
      return seq[c.turn % seq.length];
    },

    nextQuestion(s, c) {
      const picked = NG.pickQuestion(s, { region: c.region, tier: c.tier, used: c.used, rng: c.rng, topics: c.def.topics, ghostChance: 0.12 });
      if (!picked) { c.q = null; return null; }
      c.q = picked.q; c.ghost = !!picked.ghost;
      c.used.add(c.q.id);
      return c.q;
    },

    baseDamage(s) { return 5 + 2 * s.stats.forstaelse + 0.5 * s.level; },

    useAbility(s, c, id) {
      const ab = NG.ABILITIES.find((a) => a.id === id);
      if (!ab) return { ok: false, msg: 'Ukjent evne' };
      if (ab.needs && !NG.hasRelic(s, ab.needs)) return { ok: false, msg: 'Krever ' + NG.item(ab.needs).name };
      const cost = NG.abilityCost(s, ab);
      if (s.energy < cost) return { ok: false, msg: 'For lite energi (' + cost + ' J trengs)' };
      if (id === 'blikk') {
        if (!c.q || c.q.type !== 'mc') return { ok: false, msg: 'Virker bare på flervalgsspørsmål' };
        if (c.eliminate) return { ok: false, msg: 'Allerede aktiv' };
        c.eliminate = 2;
      } else if (id === 'gruble') {
        if (c.shield) return { ok: false, msg: 'Skjoldet er allerede oppe' };
        c.shield = true;
      } else if (id === 'peb') {
        if (c.peb) return { ok: false, msg: 'PEB-kombo er allerede i gang' };
        c.peb = 1;
      } else if (id === 'pumpe') {
        if (s.heat < 15) return { ok: false, msg: 'For lite spillvarme å hente (15 J trengs)' };
        s.energy -= cost; s.heat += cost; // drivenergien blir også til varme …
        s.heat -= 15; s.energy += 15; // … og varmepumpa løfter 15 J tilbake
        return { ok: true, msg: 'Varmepumpa løftet 15 J ut av spillvarmen' };
      }
      // Energien forsvinner ikke: den blir spillvarme.
      s.energy -= cost; s.heat += cost;
      return { ok: true, msg: ab.name + ' (−' + cost + ' J → spillvarme)' };
    },

    useItem(s, c, id) {
      const it = NG.item(id);
      if (!it || !(s.items[id] > 0)) return { ok: false, msg: 'Har ikke ' + (it ? it.name : id) };
      if (id === 'matpakke') { s.energy += 20; }
      else if (id === 'kakao') { if (s.hp >= NG.maxHp(s)) return { ok: false, msg: 'Du har full HP' }; s.hp = Math.min(NG.maxHp(s), s.hp + 25); }
      else if (id === 'repetisjonskort') { c.double = true; }
      else return { ok: false, msg: 'Kan ikke brukes her' };
      s.items[id]--;
      return { ok: true, msg: it.name + ' brukt' };
    },

    // res: { correct, partial }. Returnerer hva som skjedde, for animasjon/tekst.
    answer(s, c, res) {
      const q = c.q;
      const out = { dealt: 0, crit: false, taken: 0, blocked: false, finisher: false, phase: null, intent: NG.Combat.intent(c), notes: [] };
      c.answered++;
      if (res.correct) { c.correct++; c.streak++; c.bestStreak = Math.max(c.bestStreak, c.streak); }
      else c.streak = 0;

      // --- spillerens angrep ---
      const part = res.correct ? 1 : (res.partial || 0) * 0.5;
      if (part > 0) {
        let dmg = NG.Combat.baseDamage(s);
        dmg *= 1 + 0.1 * Math.min(c.streak, 5);
        let cardSum = 0;
        for (const id of q.concepts || []) { const k = s.cards[id]; if (k) cardSum += k.lvl; }
        dmg *= Math.min(1.3, 1 + 0.03 * cardSum);
        if (q.level >= 5) dmg *= 1.3; else if (q.level >= 4) dmg *= 1.15;
        if (c.region === 'stoffer' && NG.hasRelic(s, 'periodesystem')) dmg *= 1.25;
        if (c.double && res.correct) { dmg *= 2; out.notes.push('Repetisjonskortet doblet skaden!'); }
        if (c.ghost && res.correct) dmg *= 1.2;
        if (res.correct && c.rng.chance(0.08 + 0.02 * s.stats.nysgjerrighet)) { dmg *= 1.5; out.crit = true; }
        dmg *= part;
        out.dealt = Math.max(1, Math.round(dmg));
      }
      c.double = false;

      // --- PEB-kombo ---
      if (c.peb) {
        if (res.correct) {
          if (c.peb >= 3) {
            const fin = Math.round(NG.Combat.baseDamage(s) * 2.2);
            out.dealt += fin; out.finisher = true; c.peb = 0;
            out.notes.push('Påstand, evidens og begrunnelse sitter: knusende argument (+' + fin + ')!');
          } else { c.peb++; out.notes.push(['', 'Påstand ✓', 'Evidens ✓'][c.peb - 1] || ''); }
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
        const intent = out.intent;
        const atk = c.enemy.atk * c.enraged;
        let dmg = 0;
        if (intent === 'vent') dmg = res.correct ? 0 : atk * (1 - (res.partial || 0) * 0.5);
        else if (intent === 'slag') dmg = res.correct ? atk * 0.35 : atk * 1.2;
        else if (intent === 'storslag') dmg = res.correct ? atk * 0.7 : atk * 1.6;
        if (dmg > 0 && !res.correct && c.wrongBlocked) { c.wrongBlocked = false; dmg = 0; out.blocked = true; out.notes.push('Vernebrillene tok støyten.'); }
        if (dmg > 0 && c.shield) { c.shield = false; dmg = 0; out.blocked = true; out.notes.push('Grubletegningen skjermet deg.'); }
        if (dmg > 0 && NG.hasRelic(s, 'termos')) dmg *= 0.8;
        out.taken = Math.round(dmg);
        s.hp = Math.max(0, s.hp - out.taken);
      }
      c.turn++;
      c.eliminate = 0;
      if (c.enemy.hp <= 0) c.over = 'win';
      else if (s.hp <= 0) c.over = 'lose';
      return out;
    },

    // Belønning ved seier
    rewards(s, c) {
      const tierXp = { normal: 15, elite: 30, boss: 80 }[c.tier] || 15;
      let xp = tierXp + 2 * c.bestStreak;
      if (NG.hasRelic(s, 'kalorimeter')) xp = Math.round(xp * 1.15);
      const j = { normal: c.rng.int(6, 12), elite: c.rng.int(18, 28), boss: 60 }[c.tier] || 8;
      const out = { xp, joule: j, item: null, relic: null, energy: 0, heal: Math.round(NG.maxHp(s) * 0.08) };
      if (NG.hasRelic(s, 'solcelle')) out.energy = 5;
      if (c.tier === 'elite' || c.tier === 'boss') {
        const unowned = NG.ITEMS.filter((i) => i.kind === 'relic' && !NG.hasRelic(s, i.id));
        if (unowned.length && (c.tier === 'boss' || c.rng.chance(0.55))) out.relic = c.rng.pick(unowned).id;
      }
      if (!out.relic && c.rng.chance(c.tier === 'normal' ? 0.3 : 0.6)) out.item = c.rng.pick(['matpakke', 'kakao', 'repetisjonskort']);
      return out;
    },
  };
})();
