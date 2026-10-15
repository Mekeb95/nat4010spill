import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './sandbox.mjs';

const { NG } = loadGame({ dirs: ['core'], extra: ['ui/question.js'] });

test('tallsvar: komma, mellomrom og relativ toleranse', () => {
  const q = { type: 'num', answer: 9.9, tol: 0.03 };
  assert.ok(NG.checkAnswer(q, '9,9').correct);
  assert.ok(NG.checkAnswer(q, ' 10,1 ').correct);
  assert.ok(!NG.checkAnswer(q, '10,3').correct);
  assert.ok(!NG.checkAnswer(q, '').correct);
  assert.ok(NG.checkAnswer({ type: 'num', answer: 0.5, abs: 0.1 }, '0,58').correct);
  assert.ok(NG.checkAnswer({ type: 'num', answer: -4 }, '−4').correct);
});

test('flervalg med flere svar gir delpoeng, og feil kryss trekker', () => {
  const q = { type: 'multi', answer: [0, 2] };
  assert.ok(NG.checkAnswer(q, [2, 0]).correct);
  assert.equal(NG.checkAnswer(q, [0]).partial, 0.5);
  assert.equal(NG.checkAnswer(q, [0, 1]).partial, 0);
});

test('rekkefølge og sortering gir andel riktige plasser', () => {
  assert.equal(NG.checkAnswer({ type: 'order', items: ['a', 'b', 'c', 'd'] }, [0, 1, 3, 2]).partial, 0.5);
  const sort = { type: 'sort', items: [{ b: 0 }, { b: 1 }, { b: 1 }, { b: 0 }] };
  assert.ok(NG.checkAnswer(sort, [0, 1, 1, 0]).correct);
  assert.equal(NG.checkAnswer(sort, [1, 1, 1, 0]).partial, 0.75);
});

test('sant/usant og enkelt flervalg', () => {
  assert.ok(NG.checkAnswer({ type: 'tf', answer: false }, false).correct);
  assert.ok(!NG.checkAnswer({ type: 'mc', answer: 2 }, 1).correct);
});
