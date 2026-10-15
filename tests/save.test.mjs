import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './sandbox.mjs';

test('lagring overlever lagre → laste', () => {
  const sb = loadGame({ dirs: ['core'] });
  const { NG } = sb;
  const s = NG.load();
  s.level = 4; s.counters.answered = 12; s.cards.varme = { lvl: 3, sub: 0, seen: 5, right: 4, wrong: 1 };
  NG.save();
  const t = NG.load();
  assert.equal(t.level, 4);
  assert.equal(t.cards.varme.lvl, 3);
});

test('eksportkode kan importeres igjen, og import tar sikkerhetskopi først', () => {
  const { NG } = loadGame({ dirs: ['core'] });
  const s = NG.load();
  s.counters.answered = 7; s.name = 'Æøå-test';
  NG.save();
  const code = NG.exportSave();
  s.counters.answered = 99; s.name = 'annen';
  assert.ok(NG.importSave(code));
  assert.equal(NG.state().name, 'Æøå-test');
  assert.equal(NG.state().counters.answered, 7);
  assert.ok(NG.snapshots().some((x) => x.why === 'før import'));
  assert.ok(NG.importSave(NG.exportFile().text), 'godtar også ren JSON fra sikkerhetskopi-fil');
});

test('ødelagt eller fremmed import avvises og endrer ingenting', () => {
  const { NG } = loadGame({ dirs: ['core'] });
  const s = NG.load();
  s.level = 3;
  assert.equal(NG.importSave('dette er ikke en lagring'), false);
  assert.equal(NG.importSave('{"hei": 1}'), false);
  assert.equal(NG.state().level, 3);
});

test('ødelagt lagring gir ny start, men råteksten tas vare på', () => {
  const sb = loadGame({ dirs: ['core'] });
  sb.localStorage.setItem('ng.save.v1', '{ødelagt');
  const s = sb.NG.load();
  assert.equal(s.level, 1);
  assert.equal(sb.localStorage.getItem('ng.save.v1.bak'), '{ødelagt');
  assert.ok(sb.NG.saveWasCorrupt);
});

test('migrering fyller inn manglende felt og retter ugyldige tall', () => {
  const sb = loadGame({ dirs: ['core'] });
  sb.localStorage.setItem('ng.save.v1', JSON.stringify({ level: -2, xp: 'x', cards: {}, counters: { answered: 3 }, stats: { forstaelse: 2 } }));
  const s = sb.NG.load();
  assert.equal(s.level, 1);
  assert.equal(s.xp, 0);
  assert.equal(s.stats.utholdenhet, 1);
  assert.equal(s.counters.answered, 3);
  assert.ok(s.hp > 0 && s.hp <= sb.NG.maxHp(s));
});
