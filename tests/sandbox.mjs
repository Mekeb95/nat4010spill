// Laster spillets kildefiler i en vm-sandkasse (samme rekkefølge som tools/build.mjs), uten nettleser.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    clear: () => m.clear(),
    get length() { return m.size; },
  };
}

// dirs: hvilke src-mapper som lastes; extra: enkeltfiler (relativt til src/)
export function loadGame({ dirs = ['core', 'content'], extra = [] } = {}) {
  const fakeEl = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : fakeEl()), apply: () => fakeEl(), set: () => true });
  const sb = {
    console, Math, Date, JSON, Number, String, Array, Object, Set, Map, Promise,
    setTimeout: () => 0, clearTimeout: () => {}, btoa, atob,
    localStorage: memoryStorage(),
    navigator: {},
  };
  sb.window = sb;
  sb.addEventListener = () => {};
  sb.removeEventListener = () => {};
  sb.document = { createElement: () => fakeEl(), head: fakeEl(), body: fakeEl(), getElementById: () => null, querySelector: () => null, addEventListener: () => {}, documentElement: fakeEl() };
  vm.createContext(sb);
  const files = [];
  for (const d of dirs) {
    const dir = join(root, 'src', d);
    for (const f of readdirSync(dir).sort()) if (f.endsWith('.js')) files.push(join(dir, f));
  }
  for (const f of extra) files.push(join(root, 'src', f));
  for (const f of files) vm.runInContext(readFileSync(f, 'utf8'), sb, { filename: f });
  return sb;
}
