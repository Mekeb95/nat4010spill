#!/usr/bin/env node
// Bygger spillet til én selvstendig HTML-fil.
//   node tools/build.mjs              -> dist/index.html (fullt dokument) + dist/artifact.html (fragment for Artifact)
//   node tools/build.mjs --mg=<id>    -> dist/mg-<id>.html (kjører bare mini-spillet <id> med stub-API, for testing)
//   node tools/build.mjs --q=<region> -> dist/q-<region>.html (blar gjennom regionens spørsmål i spørsmålsvisningen)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');
if (!existsSync(dist)) mkdirSync(dist);

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [a, true];
}));

function files(dir, ext) {
  const p = join(src, dir);
  if (!existsSync(p)) return [];
  const out = [];
  for (const f of readdirSync(p).sort()) {
    const full = join(p, f);
    if (statSync(full).isDirectory()) out.push(...files(join(dir, f), ext));
    else if (f.endsWith(ext)) out.push(full);
  }
  return out;
}

const cssFiles = [join(src, 'ui/tokens.css'), join(src, 'ui/base.css'),
  ...files('ui', '.css').filter((f) => !/\/(tokens|base)\.css$/.test(f))];
const jsFiles = [
  ...files('core', '.js'),
  ...files('art', '.js'),
  ...files('content', '.js'),
  ...files('minigames', '.js'),
  ...files('ui', '.js'),
  ...(existsSync(join(src, 'main.js')) ? [join(src, 'main.js')] : []),
];

const css = cssFiles.map((f) => `/* ${f.slice(root.length + 1)} */\n` + readFileSync(f, 'utf8')).join('\n');
const js = jsFiles.map((f) => `/* ===== ${f.slice(root.length + 1)} ===== */\n` + readFileSync(f, 'utf8')).join('\n;\n');

const FONTS = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat+Brush&family=IBM+Plex+Mono:wght@400;600&display=swap';

function page(extraHead, extraTail) {
  return `<title>Nøkkelvokteren</title>
<meta name="theme-color" content="#17221f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>
${extraHead || ''}
<div id="app" aria-live="polite"></div>
<div class="toast-wrap" id="toasts"></div>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
${extraTail || ''}`;
}

function full(body) {
  return `<!doctype html>
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
</head>
<body>
${body}
</body>
</html>
`;
}

if (args.mg || args.q) {
  const harness = readFileSync(join(root, 'tools/dev-harness.js'), 'utf8');
  const flag = args.mg ? `{mg:${JSON.stringify(args.mg)}}` : `{q:${JSON.stringify(args.q)}}`;
  const out = full(page(`<script>window.NG_DEV=${flag};</script>`, `<script>\n${harness}\n</script>`));
  const name = args.mg ? `mg-${args.mg}.html` : `q-${args.q}.html`;
  writeFileSync(join(dist, name), out);
  console.log('dist/' + name, (out.length / 1024).toFixed(0) + ' KB');
} else {
  const body = page();
  writeFileSync(join(dist, 'artifact.html'), body);
  writeFileSync(join(dist, 'index.html'), full(body));
  console.log('dist/index.html + dist/artifact.html', (body.length / 1024).toFixed(0) + ' KB,', jsFiles.length, 'js-filer');
}
