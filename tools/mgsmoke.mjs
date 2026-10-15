#!/usr/bin/env node
// Røyktest for mini-spill: bygger hvert mini-spill alene (som --mg=<id>), åpner det i mobilformat og
// trykker seg gjennom med tilfeldige (men gyldige) valg. Feiler ved konsollfeil, sidefeil eller horisontal overflow.
//   node tools/mgsmoke.mjs                 -> alle mini-spill, vanskelighetsgrad 1 og 3
//   node tools/mgsmoke.mjs varmekurve      -> bare ett
//   --steps=120  --shots=/tmp/mg  (skjermbilde av slutten)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const STEPS = Number(opt('steps', 150));
const SHOTS = opt('shots', '');
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const all = readdirSync(join(root, 'src/minigames')).filter((f) => f.endsWith('.js')).map((f) => {
  const m = readFileSync(join(root, 'src/minigames', f), 'utf8').match(/id:\s*'([^']+)'\s*,\s*region:/) || readFileSync(join(root, 'src/minigames', f), 'utf8').match(/const ID = '([^']+)'/);
  return m ? m[1] : f.replace(/\.js$/, '');
});
const ids = args.filter((a) => !a.startsWith('--'));
const list = ids.length ? ids : all;

const browser = await chromium.launch();
let failed = 0;
for (const id of list) {
  execFileSync('node', [join(root, 'tools/build.mjs'), '--mg=' + id], { stdio: 'ignore' });
  for (const d of [1, 3]) {
    const page = await browser.newPage({ viewport: { width: 360, height: 760 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    const errs = [];
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.goto('file://' + resolve(root, 'dist/mg-' + id + '.html') + `?seed=${17 + d}&d=${d}`);
    await page.waitForTimeout(200);
    let k = 0;
    for (; k < STEPS; k++) {
      if (await page.evaluate(() => !!window.__mgResult)) break;
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (ov > 1) { errs.push('horisontal overflow ' + ov + 'px'); break; }
      // tall-felt: skriv noe
      const num = page.locator('#mg-root input:not([disabled])').first();
      if (await num.count() && !(await num.inputValue())) { await num.fill(String(1 + (k % 5))).catch(() => {}); }
      const cands = page.locator('#mg-root button:not([disabled]):visible, #mg-root [role="button"]:visible');
      const n = await cands.count();
      if (!n) {
        const cv = page.locator('#mg-root canvas').first();
        if (await cv.count()) { const b = await cv.boundingBox(); if (b) await page.mouse.click(b.x + b.width * ((k * 37) % 100) / 100, b.y + b.height * ((k * 53) % 100) / 100); }
        await page.waitForTimeout(250);
        continue;
      }
      // foretrekk «primær»-knapper av og til, ellers et tilfeldig valg
      const prim = page.locator('#mg-root .btn.primary:not([disabled]):visible');
      const usePrim = (k % 3 === 2) && await prim.count();
      const target = usePrim ? prim.last() : cands.nth((k * 7919 + d) % n);
      await target.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(90);
    }
    const res = await page.evaluate(() => window.__mgResult || null);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${id}-d${d}.png`), fullPage: true });
    const status = errs.length ? 'FEIL' : res ? 'ok  ' : 'ok* ';
    if (errs.length) failed++;
    console.log(status, id.padEnd(20), 'd' + d, res ? 'score ' + res.score.toFixed(2) + ' (' + k + ' trykk)' : 'ikke ferdig etter ' + k + ' trykk', errs.length ? '\n     ' + [...new Set(errs)].join('\n     ') : '');
    await page.close();
  }
}
await browser.close();
console.log(failed ? `\n${failed} kjøring(er) med feil` : '\nOK (ok* = ikke fullført med tilfeldige trykk, men ingen feil)');
if (failed) process.exit(1);
