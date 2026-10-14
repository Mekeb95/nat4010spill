#!/usr/bin/env node
// Automatisk gjennomspilling i mobilformat: tittel → intro → leir → ekspedisjon → noder → kamp …
//   node tools/playtest.mjs [utmappe] [--steps=200] [--region=energi] [--smart] [--dev]
// --smart svarer riktig (leser fasit fra NG.content), ellers tilfeldig.
// --dev starter med en utviklerlagring der regionen er låst opp (forutsetningsbossene slått, nivå 5).
// Tar skjermbilder av hver ny skjermtype og rapporterer konsollfeil og horisontal overflow.
import { chromium } from 'playwright';
import { resolve, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const outDir = resolve(args.find((a) => !a.startsWith('--')) || '/tmp/playtest');
const opt = (k, d) => { const a = args.find((x) => x.startsWith('--' + k)); return a ? (a.split('=')[1] ?? true) : d; };
const STEPS = Number(opt('steps', 200));
const REGION = opt('region', 'energi');
const SMART = !!opt('smart', false);
const DEV = !!opt('dev', false);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const errs = [];
let scrNow = 'start';
page.on('pageerror', (e) => errs.push('pageerror (' + scrNow + '): ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console (' + scrNow + '): ' + m.text()); });
await page.goto('file://' + resolve('dist/index.html'));
await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await page.reload();
await page.waitForTimeout(300);
if (DEV) {
  await page.evaluate((reg) => {
    const s = NG.resetSave();
    s.introSeen = true; s.level = 5; s.stats = { forstaelse: 3, utholdenhet: 3, nysgjerrighet: 2 }; s.joule = 120;
    const r = NG.region(reg);
    const want = r.needBosses ? NG.REGIONS.filter((x) => x.id !== reg).slice(0, r.needBosses).map((x) => x.id) : r.unlock;
    want.forEach((id) => { s.bossesBeaten[id] = Date.now(); });
    s.hp = NG.maxHp(s); s.energy = NG.maxEnergy(s);
    NG.save({ now: true }); NG.go('title');
  }, REGION);
  await page.waitForTimeout(200);
}
const seen = new Map();
let shots = 0;
async function shot(tag) {
  const n = (seen.get(tag) || 0) + 1; seen.set(tag, n);
  if (n > 2) return;
  shots++;
  await page.screenshot({ path: join(outDir, `${String(shots).padStart(2, '0')}-${tag}.png`) });
}
const click = async (sel) => { const l = page.locator(sel).first(); if (await l.count() && await l.isEnabled().catch(() => false)) { await l.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(180); return true; } return false; };

for (let step = 0; step < STEPS; step++) {
  const scr = await page.evaluate(() => (document.getElementById('app').className || '').split(' ')[0].replace('scr-', ''));
  scrNow = scr;
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (ov > 0) errs.push(`overflow ${ov}px på ${scr}`);
  // Lukk eventuelle ark (tips) først
  if (await page.locator('.sheet').count()) {
    await shot('sheet-' + scr);
    if (!(await click('.sheet-actions .btn.primary'))) await click('.sheet-head .btn');
    continue;
  }
  await shot(scr);
  if (scr === 'title') { await click('#btn-continue') || await click('#btn-new'); }
  else if (scr === 'intro') { await click('#btn-next'); }
  else if (scr === 'camp') {
    const hasRun = await page.locator('.run-banner').count();
    if (hasRun) await click('.run-banner');
    else { await click(`.map-node[aria-label^="${await page.evaluate((r) => NG.region(r).name, REGION)}"]`); await page.waitForTimeout(200); }
  }
  else if (scr === 'path') { if (!(await click('.relic-card:not([disabled])')) && !(await click('.mnode.can'))) await click('.btn.ghost'); }
  else if (['combat', 'review'].includes(scr)) {
    // svar på spørsmålet
    const fbBtn = page.locator('.q-fb .btn.primary');
    if (await fbBtn.count()) { await fbBtn.first().click().catch(() => {}); await page.waitForTimeout(150); continue; }
    if (await page.locator('#btn-after-win').count()) { await shot('victory'); if (Math.random() < 0.8) await click('.relic-card:not([disabled])'); await click('#btn-after-win'); continue; }
    const type = await page.evaluate(() => {
      if (document.querySelector('.num-in:not([disabled])')) return 'num';
      if (document.querySelector('.sort-row')) return 'sort';
      if (document.querySelector('.order-pool')) return 'order';
      if (document.querySelector('.tf-row')) return 'tf';
      if (document.querySelector('.opt-box')) return 'multi';
      if (document.querySelector('.q-body .option')) return 'mc';
      return null;
    });
    if (!type) { if (!(await click('.btn.primary'))) await click('.btn'); continue; }
    const smartNow = SMART && Math.random() < 0.85; // svarer av og til feil for å teste begge veier
    const q = await page.evaluate(() => { const id = document.querySelector('.q') && document.querySelector('.q').dataset.qid; const q = NG.content.store.questions.find((x) => x.id === id); return q ? { type: q.type, answer: q.answer, n: (q.items || []).length } : null; });
    if (type === 'mc' || type === 'tf') {
      if (smartNow && q) await click(type === 'mc' ? `.q-body .option[data-i="${q.answer}"]` : `.q-body .option[data-v="${q.answer}"]`);
      else { const opts = page.locator('.q-body .option:not([disabled])'); const n = await opts.count(); await opts.nth(Math.floor(Math.random() * n)).click().catch(() => {}); }
    } else if (type === 'multi') {
      if (smartNow && q) { for (const i of q.answer) await click(`.q-body .option[data-i="${i}"]`); }
      else await page.locator('.q-body .option').first().click();
      await click('.q-body .btn.primary');
    } else if (type === 'order') {
      if (smartNow && q) { for (let i = 0; i < q.n; i++) await click(`.pool-item[data-i="${i}"]`); }
      else for (let k = 0; k < 8 && await page.locator('.pool-item').count(); k++) await page.locator('.pool-item').first().click();
      await click('.q-body .btn.primary');
    } else if (type === 'sort') {
      const rows = page.locator('.sort-row');
      const n = await rows.count();
      for (let k = 0; k < n; k++) { const b = smartNow ? Number(await rows.nth(k).getAttribute('data-b')) : 0; await rows.nth(k).locator('.seg').nth(b).click(); }
      await click('.q-body .btn.primary');
    } else if (type === 'num') {
      await page.locator('.num-in').first().fill(smartNow && q ? String(q.answer).replace('.', ',') : '42'); await click('.num-row .btn');
    }
    await page.waitForTimeout(250);
    await shot(scr + '-answered');
  }
  else if (scr === 'lab') { await page.waitForTimeout(500); await shot('lab-inner'); if (!(await click('.lab-head .btn'))) await click('.btn.primary'); }
  else if (scr === 'event') { if (!(await click('.event .option:not([disabled])'))) await click('.btn.primary'); }
  else if (['sol', 'chest', 'sheets', 'finale'].includes(scr)) { if (scr === 'sol') { if (!(await click('.sol-choice[data-choice="hvil"]'))) await click('.btn.primary'); } else await click('.btn.primary') || await click('.btn'); }
  else { if (!(await click('.btn.primary'))) await click('.btn'); }
}
const state = await page.evaluate(() => { const s = NG.state(); return { regionClears: s.regionClears || {}, level: s.level, xp: s.xp, hp: s.hp, answered: s.counters.answered, correct: s.counters.correct, wins: s.counters.wins, fights: s.counters.fights, labs: s.counters.labs, joule: s.joule, deaths: s.counters.deaths, run: s.run && { at: s.run.at, path: (s.run.path || []).length }, cards: Object.keys(s.cards).length, beaten: Object.keys(s.bossesBeaten) }; });
console.log(JSON.stringify(state));
console.log(errs.length ? [...new Set(errs)].join('\n') : 'ingen feil');
console.log('skjermbilder:', outDir);
await browser.close();
