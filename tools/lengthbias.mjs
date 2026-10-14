#!/usr/bin/env node
// Måler hvor ofte riktig mc-alternativ er det (strengt) lengste — en avslørende skjevhet.
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
const sb = { console, Math, Date, JSON, setTimeout: () => 0, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} } };
sb.window = sb; sb.document = { createElement: () => ({}), head: { appendChild() {} }, getElementById: () => null, addEventListener() {} };
vm.createContext(sb);
for (const d of ['core', 'content']) for (const f of readdirSync('src/' + d).sort()) if (f.endsWith('.js')) vm.runInContext(readFileSync(`src/${d}/${f}`, 'utf8'), sb);
const by = {};
for (const q of sb.NG.content.store.questions) {
  if (q.type !== 'mc') continue;
  const L = q.options.map((o) => o.length);
  const max = Math.max(...L);
  const longest = L[q.answer] === max && L.filter((x) => x === max).length === 1;
  const ratio = L[q.answer] / (L.reduce((a, b) => a + b, 0) / L.length);
  const r = (by[q.region] ||= { n: 0, longest: 0, ratio: 0, ids: [] });
  r.n++; if (longest) { r.longest++; if (ratio > 1.35) r.ids.push(q.id); } r.ratio += ratio;
}
for (const [k, r] of Object.entries(by)) console.log(k.padEnd(10), 'mc', r.n, 'lengst:', Math.round(100 * r.longest / r.n) + '%', 'snitt-ratio', (r.ratio / r.n).toFixed(2), 'grove:', r.ids.length);
if (process.argv[2]) console.log(by[process.argv[2]].ids.join('\n'));
