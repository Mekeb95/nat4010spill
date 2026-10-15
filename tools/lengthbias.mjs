#!/usr/bin/env node
// Måler hvor ofte riktig mc-alternativ er det lengste — en avslørende skjevhet.
//   node tools/lengthbias.mjs              -> tabell per region; avslutter med kode 1 hvis en grense brytes
//   node tools/lengthbias.mjs <region>     -> lister også de tydelig lengste (id-er) i regionen
//   --max-clear=0.15  høyeste andel der riktig svar er *tydelig* lengst (≥ 15 % lengre enn nest lengste)
//   --max-gross=0     høyeste antall grove tilfeller (lengst og > 1,35 × snittlengden)
// Med fire alternativ og ingen skjevhet er riktig svar lengst i ca. 25 % av tilfellene.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith('--' + k + '=')); return a ? Number(a.split('=')[1]) : d; };
const MAX_CLEAR = opt('max-clear', 0.15);
const MAX_GROSS = opt('max-gross', 0);
const only = args.find((a) => !a.startsWith('--'));

const sb = { console, Math, Date, JSON, setTimeout: () => 0, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} } };
sb.window = sb; sb.document = { createElement: () => ({}), head: { appendChild() {} }, getElementById: () => null, addEventListener() {} };
vm.createContext(sb);
for (const d of ['core', 'content']) {
  const dir = join(root, 'src', d);
  for (const f of readdirSync(dir).sort()) if (f.endsWith('.js')) vm.runInContext(readFileSync(join(dir, f), 'utf8'), sb, { filename: f });
}

const by = {};
for (const q of sb.NG.content.store.questions) {
  if (q.type !== 'mc') continue;
  const L = q.options.map((o) => o.length);
  const sorted = [...L].sort((a, b) => b - a);
  const longest = L[q.answer] === sorted[0] && sorted[0] > sorted[1];
  const clear = longest && L[q.answer] >= 1.15 * sorted[1];
  const ratio = L[q.answer] / (L.reduce((a, b) => a + b, 0) / L.length);
  const r = (by[q.region] ||= { n: 0, longest: 0, clear: 0, ratio: 0, gross: [], clearIds: [] });
  r.n++; r.ratio += ratio;
  if (longest) r.longest++;
  if (clear) { r.clear++; r.clearIds.push(q.id); }
  if (longest && ratio > 1.35) r.gross.push(q.id);
}

const pct = (x) => Math.round(100 * x) + '%';
const fails = [];
console.log('region     mc   lengst  tydelig  snitt-ratio  grove');
for (const [k, r] of Object.entries(by).sort()) {
  console.log(k.padEnd(10), String(r.n).padStart(3), pct(r.longest / r.n).padStart(8), pct(r.clear / r.n).padStart(8), (r.ratio / r.n).toFixed(2).padStart(12), String(r.gross.length).padStart(6));
  if (r.clear / r.n > MAX_CLEAR) fails.push(`${k}: riktig svar er tydelig lengst i ${pct(r.clear / r.n)} (grense ${pct(MAX_CLEAR)})`);
  if (r.gross.length > MAX_GROSS) fails.push(`${k}: ${r.gross.length} grove tilfeller: ${r.gross.join(', ')}`);
}
if (only && by[only]) console.log('\nTydelig lengst i ' + only + ':\n' + by[only].clearIds.join('\n'));
if (fails.length) { console.error('\nLENGDESKJEVHET:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('\nOK');
