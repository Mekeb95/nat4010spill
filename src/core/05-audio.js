/* Små synth-lyder med WebAudio. Ingen filer. Starter først etter brukerinteraksjon. */
(function () {
  'use strict';
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem('ng.muted') === '1'; } catch (e) { /* ingen lagring */ }

  function ac() {
    if (muted) return null;
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function tone(freq, dur, type, vol, when, slide) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  const SFX = {
    click: () => tone(660, 0.05, 'square', 0.04),
    good: () => { tone(523, 0.09, 'triangle', 0.1); tone(784, 0.14, 'triangle', 0.1, 0.08); },
    bad: () => { tone(220, 0.18, 'sawtooth', 0.06, 0, 150); },
    hit: () => tone(140, 0.12, 'square', 0.08, 0, 70),
    crit: () => { tone(880, 0.06, 'square', 0.07); tone(1320, 0.12, 'square', 0.07, 0.05); },
    coin: () => { tone(988, 0.06, 'square', 0.05); tone(1319, 0.1, 'square', 0.05, 0.06); },
    level: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.09, i * 0.09)); },
    heal: () => tone(392, 0.3, 'sine', 0.08, 0, 784),
    boss: () => { tone(110, 0.5, 'sawtooth', 0.07, 0, 82); tone(165, 0.5, 'sawtooth', 0.05, 0.1, 110); },
    win: () => { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 'triangle', 0.09, i * 0.1)); },
    lose: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.08, i * 0.14)); },
  };
  NG.sfx = function (name) { try { (SFX[name] || SFX.click)(); } catch (e) { /* lyd er valgfritt */ } };
  NG.audio = {
    get muted() { return muted; },
    setMuted(m) { muted = !!m; try { localStorage.setItem('ng.muted', muted ? '1' : '0'); } catch (e) { /* */ } },
  };
})();
