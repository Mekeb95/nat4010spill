import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './sandbox.mjs';

const { NG } = loadGame();
const plain = (x) => JSON.parse(JSON.stringify(x)); // vm-arrays har en annen prototype
const fresh = () => { const s = NG.newState(); s.hp = NG.maxHp(s); s.energy = NG.maxEnergy(s); return s; };

test('begrepskort: første riktige svar gir «Gjenkjenne», et høyere spørsmål løfter ett trinn', () => {
  const s = fresh();
  assert.deepEqual(plain(NG.updateCards(s, { concepts: ['varme'], level: 1 }, true).map((u) => u.lvl)), [1]);
  assert.deepEqual(plain(NG.updateCards(s, { concepts: ['varme'], level: 3 }, true).map((u) => u.lvl)), [2]);
  assert.equal(s.cards.varme.lvl, 2);
});

test('begrepskort: tre riktige på lavt nivå gir bare opp til «Definere»', () => {
  const s = fresh();
  s.cards.varme = { lvl: 2, sub: 0, seen: 0, right: 0, wrong: 0 };
  for (let i = 0; i < 6; i++) NG.updateCards(s, { concepts: ['varme'], level: 1 }, true);
  assert.equal(s.cards.varme.lvl, 2);
});

test('begrepskort: synker etter to feil på rad på eget nivå, men aldri under 1', () => {
  const s = fresh();
  s.cards.varme = { lvl: 3, sub: 0, seen: 0, right: 0, wrong: 0 };
  assert.equal(NG.updateCards(s, { concepts: ['varme'], level: 3 }, false).length, 0);
  const down = NG.updateCards(s, { concepts: ['varme'], level: 2 }, false);
  assert.deepEqual(plain(down.map((u) => [u.lvl, u.down])), [[2, true]]);
  for (let i = 0; i < 10; i++) NG.updateCards(s, { concepts: ['varme'], level: 1 }, false);
  assert.equal(s.cards.varme.lvl, 1);
});

test('begrepskort: feil over kortets nivå teller ikke, og et riktig svar nullstiller rekka', () => {
  const s = fresh();
  s.cards.varme = { lvl: 2, sub: 0, seen: 0, right: 0, wrong: 0 };
  for (let i = 0; i < 5; i++) NG.updateCards(s, { concepts: ['varme'], level: 5 }, false);
  assert.equal(s.cards.varme.lvl, 2);
  NG.updateCards(s, { concepts: ['varme'], level: 2 }, false);
  NG.updateCards(s, { concepts: ['varme'], level: 1 }, true);
  NG.updateCards(s, { concepts: ['varme'], level: 2 }, false);
  assert.equal(s.cards.varme.lvl, 2);
});

test('Leitner: riktig flytter opp en boks, feil sender til boks 1 med kort frist', () => {
  const s = fresh();
  const q = { id: 'x.1' };
  NG.srsUpdate(s, q, true); NG.srsUpdate(s, q, true);
  assert.equal(s.srs['x.1'].box, 2);
  assert.ok(s.srs['x.1'].due > Date.now() + 23 * 3600 * 1000);
  NG.srsUpdate(s, q, false);
  assert.equal(s.srs['x.1'].box, 1);
  assert.ok(s.srs['x.1'].due < Date.now() + 11 * 60 * 1000);
});

test('forfalte spørsmål: de med flest feil kommer først', () => {
  const s = fresh();
  const [a, b] = NG.content.store.questions.filter((q) => q.region === 'energi');
  s.srs[a.id] = { box: 1, due: 0, seen: 1, right: 0, wrong: 1, last: 0 };
  s.srs[b.id] = { box: 1, due: 0, seen: 4, right: 0, wrong: 4, last: 0 };
  assert.deepEqual(plain(NG.dueQuestions(s, 'energi').map((q) => q.id).slice(0, 2)), [b.id, a.id]);
});

test('spørsmålsvalg: holder seg i regionen og gjentar ikke brukte spørsmål', () => {
  const s = fresh();
  const rng = NG.makeRng(7);
  const used = new Set();
  const n = NG.content.store.questions.filter((q) => q.region === 'kropp').length;
  for (let i = 0; i < n; i++) {
    const { q } = NG.pickQuestion(s, { region: 'kropp', tier: 'normal', used, rng });
    assert.equal(q.region, 'kropp');
    assert.ok(!used.has(q.id), 'gjentok ' + q.id);
    used.add(q.id);
  }
  assert.ok(NG.pickQuestion(s, { region: 'kropp', tier: 'normal', used, rng }).q, 'starter på nytt når bunken er tom');
});

test('XP: nivå opp gir statpoeng og full HP', () => {
  const s = fresh();
  s.hp = 1;
  const ups = NG.gainXp(s, NG.xpNeed(1));
  assert.equal(ups, 1);
  assert.equal(s.level, 2);
  assert.equal(s.statPoints, 1);
  assert.equal(s.hp, NG.maxHp(s));
});

test('energi: overskudd blir spillvarme, og spillvarme kan hentes tilbake', () => {
  const s = fresh();
  s.energy = NG.maxEnergy(s) - 5;
  assert.deepEqual({ ...NG.addEnergy(s, 12) }, { gained: 5, heat: 7 });
  s.energy -= 10;
  assert.equal(NG.recoverHeat(s, 100), 7);
  assert.equal(s.heat, 0);
});

test('regiontrinn følger fullførte ekspedisjoner, maks 4', () => {
  const s = fresh();
  assert.equal(NG.regionTier(s, 'energi'), 0);
  s.regionClears = { energi: 9 };
  assert.equal(NG.regionTier(s, 'energi'), 4);
});

test('ekspedisjonskart: første rad kan velges, og alle noder kan nås fra start', () => {
  const s = fresh();
  NG.startRun(s, 'energi');
  const m = NG.runMap(s);
  const start = NG.choosable(s);
  assert.ok(start.length >= 2);
  const seen = new Set(start.map((n) => n.id));
  const stack = [...seen];
  while (stack.length) { const id = stack.pop(); for (const e of m.edges) if (e[0] === id && !seen.has(e[1])) { seen.add(e[1]); stack.push(e[1]); } }
  assert.equal(seen.size, m.nodes.length);
  assert.ok(m.nodes.some((n) => n.type === 'boss'));
});
