#!/usr/bin/env node
// Validerer alt innhold i src/content (+ registrerte mini-spill og grafikk-ID-er).
//   node tools/validate.mjs            -> feil og statistikk
//   node tools/validate.mjs --region=energi
// Avslutter med kode 1 hvis det finnes feil.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const onlyRegion = (process.argv.find((a) => a.startsWith('--region=')) || '').split('=')[1];

function files(dir) {
  const p = join(src, dir);
  if (!existsSync(p)) return [];
  const out = [];
  for (const f of readdirSync(p).sort()) {
    const full = join(p, f);
    if (statSync(full).isDirectory()) out.push(...files(join(dir, f)));
    else if (f.endsWith('.js')) out.push(full);
  }
  return out;
}

const fakeEl = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : fakeEl()), apply: () => fakeEl(), set: () => true });
const sandbox = { console, Math, Date, JSON, Number, String, Array, Object, Set, Map, setTimeout: () => 0, clearTimeout: () => {}, localStorage: { getItem: () => null, setItem: () => {} } };
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
sandbox.removeEventListener = () => {};
sandbox.document = { createElement: () => fakeEl(), head: fakeEl(), getElementById: () => null, addEventListener: () => {} };
vm.createContext(sandbox);
const load = [...files('core'), ...files('art'), ...files('content'), ...files('minigames')];
let loadErrors = 0;
for (const f of load) {
  try { vm.runInContext(readFileSync(f, 'utf8'), sandbox, { filename: f }); }
  catch (e) { loadErrors++; console.error('LASTEFEIL', f.slice(root.length + 1), '\n  ', e.message); }
}
const NG = sandbox.NG;
const S = NG.content.store;
const REG = new Set(NG.REGIONS.map((r) => r.id));
const errors = []; const warns = [];
const E = (m) => errors.push(m); const W = (m) => warns.push(m);

const ids = new Map();
function uniq(kind, id) {
  if (!id || typeof id !== 'string') { E(`${kind} mangler id`); return; }
  const k = kind + ':' + id;
  if (ids.has(k)) E(`Duplikat ${kind}-id: ${id}`);
  ids.set(k, true);
}
const conceptIds = new Set(S.concepts.map((c) => c.id));
const mythIds = new Set(S.myths.map((m) => m.id));

for (const c of S.concepts) {
  uniq('concept', c.id);
  if (!c.name || !c.def) E(`Begrep ${c.id}: mangler name/def`);
  if (!REG.has(c.region)) E(`Begrep ${c.id}: ukjent region ${c.region}`);
  for (const r of c.related || []) if (!conceptIds.has(r)) W(`Begrep ${c.id}: related '${r}' finnes ikke`);
}
for (const m of S.myths) { uniq('myth', m.id); if (!m.text || !m.fix) E(`Myte ${m.id}: mangler text/fix`); }

const TYPES = new Set(['mc', 'multi', 'tf', 'order', 'sort', 'num']);
for (const q of S.questions) {
  const p = `Spørsmål ${q.id}`;
  uniq('question', q.id);
  if (!REG.has(q.region)) E(`${p}: ukjent region ${q.region}`);
  if (!TYPES.has(q.type)) { E(`${p}: ukjent type ${q.type}`); continue; }
  if (!q.prompt) E(`${p}: mangler prompt`);
  if (!q.explain || q.explain.length < 25) E(`${p}: explain mangler/for kort`);
  if (!(q.level >= 1 && q.level <= 5)) E(`${p}: level må være 1–5`);
  if (!Array.isArray(q.concepts) || !q.concepts.length) E(`${p}: mangler concepts`);
  else for (const c of q.concepts) if (!conceptIds.has(c)) E(`${p}: begrep '${c}' finnes ikke`);
  if (q.myth && !mythIds.has(q.myth)) E(`${p}: myte '${q.myth}' finnes ikke`);
  switch (q.type) {
    case 'mc':
      if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 5) E(`${p}: mc trenger 3–5 options`);
      else if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) E(`${p}: ugyldig answer`);
      if (q.why) for (const k of Object.keys(q.why)) if (!(+k >= 0 && +k < (q.options || []).length) || +k === q.answer) E(`${p}: why-nøkkel ${k} ugyldig`);
      if (q.options && new Set(q.options).size !== q.options.length) E(`${p}: like alternativ`);
      if (q.options && q.options.some((o) => /alle (de )?(over|ovenfor)|ingen av (de )?(over|ovenfor)/i.test(o))) W(`${p}: «alle/ingen ovenfor» virker dårlig når alternativene stokkes`);
      break;
    case 'multi':
      if (!Array.isArray(q.options) || q.options.length < 3) E(`${p}: multi trenger ≥3 options`);
      if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((i) => !(i >= 0 && i < q.options.length))) E(`${p}: ugyldig answer-liste`);
      break;
    case 'tf':
      if (typeof q.answer !== 'boolean') E(`${p}: tf answer må være true/false`);
      break;
    case 'order':
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 7) E(`${p}: order trenger 3–7 items`);
      break;
    case 'sort':
      if (!Array.isArray(q.buckets) || q.buckets.length < 2 || q.buckets.length > 4) E(`${p}: sort trenger 2–4 buckets`);
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 8) E(`${p}: sort trenger 3–8 items`);
      else for (const it of q.items) if (!it.t || !(it.b >= 0 && it.b < q.buckets.length)) E(`${p}: sort-item ugyldig: ${JSON.stringify(it)}`);
      break;
    case 'num':
      if (typeof q.answer !== 'number' || !isFinite(q.answer)) E(`${p}: num answer må være tall`);
      break;
  }
}
for (const e of S.enemies) {
  uniq('enemy', e.id);
  if (!REG.has(e.region)) E(`Fiende ${e.id}: ukjent region`);
  if (!['normal', 'elite', 'boss'].includes(e.tier)) E(`Fiende ${e.id}: tier må være normal/elite/boss`);
  if (!(e.hp > 0 && e.atk > 0)) E(`Fiende ${e.id}: hp/atk`);
  if (e.myth && !mythIds.has(e.myth)) E(`Fiende ${e.id}: myte '${e.myth}' finnes ikke`);
  if (!NG.art.map[e.art || e.id]) W(`Fiende ${e.id}: mangler grafikk '${e.art || e.id}'`);
}
for (const ev of S.events) {
  uniq('event', ev.id);
  if (!REG.has(ev.region)) E(`Hendelse ${ev.id}: ukjent region`);
  if (!Array.isArray(ev.choices) || ev.choices.length < 2) E(`Hendelse ${ev.id}: trenger ≥2 valg`);
  else if (!ev.choices.some((c) => c.correct)) E(`Hendelse ${ev.id}: ingen riktige valg`);
}
for (const pr of S.prompts) { uniq('prompt', pr.id); if (!pr.prompt || !pr.rubric) E(`Orakel ${pr.id}: mangler prompt/rubric`); }
for (const mg of NG.minigames.list) {
  uniq('minigame', mg.id);
  if (!REG.has(mg.region)) E(`Mini-spill ${mg.id}: ukjent region`);
  if (typeof mg.start !== 'function') E(`Mini-spill ${mg.id}: mangler start()`);
}
for (const r of NG.REGIONS) {
  const boss = S.enemies.find((e) => e.id === r.boss);
  if (!boss) W(`Region ${r.id}: bossen '${r.boss}' er ikke definert ennå`);
}

// Statistikk
console.log('\nINNHOLD PER REGION');
console.log('region       spm   mc multi tf order sort num | L1 L2 L3 L4 L5 | begrep fiender hend. orakel mini');
for (const r of NG.REGIONS) {
  if (onlyRegion && r.id !== onlyRegion) continue;
  const qs = S.questions.filter((q) => q.region === r.id);
  const t = (x) => String(qs.filter((q) => q.type === x).length).padStart(3);
  const l = (x) => String(qs.filter((q) => q.level === x).length).padStart(2);
  const c = (arr) => String(arr.filter((x) => x.region === r.id).length).padStart(5);
  console.log(`${r.id.padEnd(12)} ${String(qs.length).padStart(4)} ${t('mc')} ${t('multi')}${t('tf')} ${t('order')} ${t('sort')} ${t('num')} | ${l(1)} ${l(2)} ${l(3)} ${l(4)} ${l(5)} | ${c(S.concepts)} ${c(S.enemies)} ${c(S.events)} ${c(S.prompts)} ${c(NG.minigames.list)}`);
}
console.log(`\nTotalt: ${S.questions.length} spørsmål, ${S.concepts.length} begreper, ${S.myths.length} myter, ${S.enemies.length} fiender, ${S.events.length} hendelser, ${S.prompts.length} orakel, ${NG.minigames.list.length} mini-spill, ${Object.keys(NG.art.map).length} grafikk`);
const show = (arr, label) => { if (arr.length) { console.log(`\n${label} (${arr.length}):`); arr.slice(0, 80).forEach((m) => console.log('  - ' + m)); if (arr.length > 80) console.log('  …'); } };
show(warns, 'ADVARSLER');
show(errors, 'FEIL');
if (errors.length || loadErrors) process.exit(1);
console.log('\nOK');
