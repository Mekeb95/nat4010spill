#!/usr/bin/env node
// Skjermbilde i mobilformat. Eksempel:
//   node tools/shot.mjs dist/mg-varmekurve.html /tmp/x.png --click="#start" --wait=500 --click=".option"
// Flagg (i rekkefølge): --click="css" | --wait=ms | --type="css=>tekst" | --eval="js" | --full (helside)
// Skriver også konsollfeil og horisontal overflow til stdout.
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const [, , file, out, ...steps] = process.argv;
if (!file || !out) { console.error('bruk: node tools/shot.mjs <html> <png> [steg...]'); process.exit(2); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
const url = file.startsWith('http') ? file : 'file://' + resolve(file);
await page.goto(url);
await page.waitForTimeout(400);
let full = false;
for (const s of steps) {
  const m = s.match(/^--(\w+)(?:=(.*))?$/s);
  if (!m) continue;
  const [, k, v] = m;
  try {
    if (k === 'click') { await page.locator(v).first().click({ timeout: 3000 }); await page.waitForTimeout(250); }
    else if (k === 'wait') await page.waitForTimeout(Number(v));
    else if (k === 'type') { const [sel, txt] = v.split('=>'); await page.locator(sel).first().fill(txt); }
    else if (k === 'eval') { const r = await page.evaluate(v); if (r !== undefined) console.log('eval:', JSON.stringify(r)); }
    else if (k === 'full') full = true;
  } catch (e) { errs.push(`steg ${s}: ${e.message.split('\n')[0]}`); }
}
const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
if (ov > 0) errs.push(`horisontal overflow: ${ov}px`);
await page.screenshot({ path: out, fullPage: full });
console.log(errs.length ? errs.join('\n') : 'ingen feil');
await browser.close();
