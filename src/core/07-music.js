/* Generativ bakgrunnsmusikk med WebAudio. Ingen lydfiler.
   Hvert spor er en liten oppskrift (grunntone, modus, tempo, akkordrekke, mønstre, klang). En lookahead-
   planlegger (setTimeout + AudioContext-klokka) lager løkker av oppskriften, og melodien genereres på nytt
   (frøsatt) for hver runde slik at den ikke blir masete. Deler AudioContext med SFX (05-audio.js).
   Sporvalg: NG.go → NG.music.auto(skjerm, params). Overstyr med NG.music.play(id).
   Spor-ID-er: title, camp, lab, rest, map:<region>, combat:<region>, boss:<region>, victory, defeat. */
(function () {
  'use strict';
  const TICK = 40;     // ms mellom planleggerkall (lavt CPU-bruk på mobil)
  const AHEAD = 0.16;  // sekunder som planlegges fram i tid
  const FADE = 1.0;    // krysstoning i sekunder
  const GAIN = 0.55;   // musikkvolum 1.0 tilsvarer denne bus-gainen

  const MODE = {
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11], mixo: [0, 2, 4, 5, 7, 9, 10], phryg: [0, 1, 3, 5, 7, 8, 10], harm: [0, 2, 3, 5, 7, 8, 11],
  };
  const PENTA = [0, 2, 4, 7, 9];
  const MPENTA = [0, 3, 5, 7, 10];

  /* ---------- Oppskrifter ----------
     r: grunntone (MIDI), m: modus, ms: melodiskala, bpm, spb: steg per takt (16 = 4/4, 12 = 3/4),
     prog: akkordtrinn (0-basert), pad/bass/arp/mel: stemmer, drum: mønstre (k spark, s skarp, h hihat, t tom),
     lp: lavpass (Hz), dl: ekko-send, di: takter før trommene kommer inn.
     Mønstre: bass x=grunntone 5=kvint 3=ters o=oktav b=liten sekund; arp sifre = akkordtone 0–5; trommer x/X/g. */
  const REG = {
    energi: { r: 62, m: 'mixo', bpm: 96, prog: [0, 6, 3, 0], lp: 2600, dl: 0.22,
      pad: { w: 'triangle', v: 0.05 }, bass: { w: 'triangle', v: 0.16, p: 'x...x.5.x...x.o.', l: 2 },
      arp: { i: 'pluck', v: 0.07, p: ['0.1.2.1.3.1.2.1.', '0.2.1.2.3.2.4.2.'] }, mel: { i: 'flute', v: 0.07, o: 1, d: 0.45 },
      drum: { k: 'x.......x.......', h: '..g...x...g...x.' }, di: 2 },
    stoffer: { r: 57, m: 'harm', bpm: 84, prog: [0, 5, 3, 4], lp: 3200, dl: 0.28,
      pad: { w: 'sine', v: 0.04, o: -1 }, bass: { w: 'sine', v: 0.2, p: 'x.....x.x.......', l: 3 },
      arp: { i: 'mallet', v: 0.08, p: ['0.2.1.2.3.2.1.2.', '0.1.2.3.4.3.2.1.'] }, mel: { i: 'mallet', v: 0.08, o: 1, d: 0.4 },
      drum: { k: 'x.........x.....', h: '....g.......x...' }, di: 1 },
    liv: { r: 55, m: 'major', ms: PENTA, bpm: 72, prog: [0, 5, 3, 4], lp: 1900, dl: 0.34,
      pad: { w: 'sine', v: 0.07, o: 0 }, bass: { w: 'sine', v: 0.14, p: 'x.......5.......', l: 6 },
      arp: { i: 'pluck', v: 0.045, p: ['0...2...1...3...'] }, mel: { i: 'flute', v: 0.08, o: 1, d: 0.35 } },
    jorda: { r: 64, m: 'lydian', ms: [0, 2, 4, 6, 7, 11], bpm: 64, prog: [0, 1, 5, 1], cp: [0, 0, 1, 4], lp: 4200, dl: 0.45, fb: 0.45,
      pad: { w: 'sine', v: 0.06, o: -1 }, bass: { w: 'sine', v: 0.1, p: 'x...............', l: 12 },
      arp: { i: 'bell', v: 0.035, o: 1, p: ['0.......2.......', '1.......4.......'] }, mel: { i: 'bell', v: 0.05, o: 1, d: 0.25 } },
    kropp: { r: 60, m: 'dorian', bpm: 76, prog: [0, 3, 0, 4], lp: 2100, dl: 0.2,
      pad: { w: 'triangle', v: 0.05, o: -1 }, bass: { w: 'triangle', v: 0.16, p: 'x..x....x..x....', l: 2 },
      arp: { i: 'pluck', v: 0.05, p: ['..0...1...2...1.'] }, mel: { i: 'flute', v: 0.07, o: 1, d: 0.4 },
      drum: { k: 'X..g............' }, di: 0 },
    teknologi: { r: 53, m: 'major', bpm: 112, prog: [5, 3, 0, 4], lp: 3400, dl: 0.12,
      bass: { w: 'triangle', v: 0.17, p: 'x.x.o.x.x.x.o.5.', l: 1 },
      arp: { i: 'chip', v: 0.04, o: 1, p: ['0123210301232103', '0124210402142104'] }, mel: { i: 'chip', v: 0.045, o: 1, d: 0.5 },
      drum: { k: 'x.......x.......', s: '....x.......x...', h: 'g.g.g.g.g.g.g.g.' }, di: 2 },
    praksis: { r: 58, m: 'major', bpm: 92, spb: 12, prog: [0, 2, 3, 4], lp: 2500, dl: 0.2,
      pad: { w: 'triangle', v: 0.04 }, bass: { w: 'sine', v: 0.17, p: 'x...5...5...', l: 3 },
      arp: { i: 'pluck', v: 0.06, p: ['....1.2.....', '....2.1...3.'] }, mel: { i: 'mallet', v: 0.08, o: 1, d: 0.45 },
      drum: { k: 'x...........', h: '....g...g...' }, di: 2 },
    didaktikk: { r: 51, m: 'major', bpm: 80, prog: [0, 4, 5, 3], lp: 1700, dl: 0.25,
      pad: { w: 'organ', v: 0.045, o: 1 }, bass: { w: 'sine', v: 0.18, p: 'x.......x...5...', l: 4 },
      arp: { i: 'pluck', v: 0.05, o: 1, p: ['0...1...2...1...'] }, mel: { i: 'bell', v: 0.06, o: 2, d: 0.35 },
      drum: { k: 'x.......x.......' }, di: 4 },
  };
  const BASE = {
    camp: { r: 53, m: 'major', bpm: 70, prog: [0, 2, 3, 0], lp: 2000, dl: 0.25,
      pad: { w: 'triangle', v: 0.05, o: 1 }, bass: { w: 'sine', v: 0.15, p: 'x.......5.......', l: 6 },
      arp: { i: 'pluck', v: 0.06, o: 1, p: ['0.1.2.3.4.3.2.1.', '0.2.1.3.2.4.3.1.'] }, mel: { i: 'flute', v: 0.07, o: 2, d: 0.3 } },
    title: { r: 53, m: 'major', bpm: 62, prog: [0, 5, 3, 4], lp: 2400, dl: 0.4, fb: 0.4,
      pad: { w: 'triangle', v: 0.06, o: 1 }, bass: { w: 'sine', v: 0.13, p: 'x...............', l: 14 },
      mel: { i: 'bell', v: 0.06, o: 2, d: 0.3 } },
    lab: { r: 60, m: 'major', bpm: 104, prog: [0, 3, 1, 4], lp: 3000, dl: 0.18,
      bass: { w: 'triangle', v: 0.15, p: 'x...x...x...5...', l: 2 },
      arp: { i: 'pluck', v: 0.075, p: ['0.2.1.2.0.2.1.2.', '0.2.1.2.3.2.1.2.'] }, mel: { i: 'mallet', v: 0.1, o: 1, d: 0.4 },
      drum: { k: 'x.......x.......', h: '..g...x...g...x.' }, di: 2 },
    rest: { r: 57, m: 'major', ms: PENTA, bpm: 58, prog: [0, 5, 3, 0], lp: 2200, dl: 0.4, fb: 0.4,
      pad: { w: 'sine', v: 0.07 }, bass: { w: 'sine', v: 0.1, p: 'x...............', l: 14 },
      mel: { i: 'bell', v: 0.05, o: 1, d: 0.22 } },
  };

  function combatOf(id) {
    const b = REG[id] || REG.energi;
    const minorish = /minor|harm|dorian|phryg/.test(b.m);
    return { r: b.r, m: b.m, ms: minorish ? MPENTA : b.ms, bpm: Math.max(112, Math.min(138, Math.round(b.bpm * 1.35))), prog: b.cp || [0, 0, 3, 4],
      lp: 2300, dl: 0.12,
      bass: { w: 'sawtooth', v: 0.13, p: 'x.x.x.x.x.x.o.x.', l: 1 },
      arp: { i: b.arp ? b.arp.i : 'pluck', v: 0.065, o: b.arp && b.arp.o || 0, p: ['0120312001203120', '0123423101234231'] },
      mel: { i: b.mel ? b.mel.i : 'pluck', v: 0.085, o: 1, d: 0.5 },
      drum: { k: 'x.....x...x.....', s: '....x.......x...', h: 'g.x.g.x.g.x.g.xg' }, di: 1 };
  }
  function bossOf(id) {
    const b = REG[id] || REG.energi;
    return { r: b.r - (b.r > 59 ? 12 : 0), m: 'phryg', ms: [0, 1, 3, 5, 7, 8], bpm: Math.max(108, Math.min(124, Math.round(b.bpm * 1.25))), prog: [0, 1, 0, 4],
      lp: 1700, dl: 0.18,
      pad: { w: 'sawtooth', v: 0.035, o: 0 }, bass: { w: 'sawtooth', v: 0.12, p: 'x..x..x.x..x..b.', l: 2 },
      arp: { i: b.arp ? b.arp.i : 'mallet', v: 0.05, o: 1, p: ['0.1.0.2.0.1.0.3.'] },
      mel: { i: 'bell', v: 0.05, o: 1, d: 0.22 },
      drum: { k: 'x.....x.x.......', s: '....x.......x...', t: '........x.....x.', h: '..g...g...g...g.' }, di: 1 };
  }
  const cache = {};
  function specFor(id) {
    if (cache[id]) return cache[id];
    const m = /^(map|combat|boss):(\w+)$/.exec(id);
    let sp = null;
    if (BASE[id]) sp = BASE[id];
    else if (m && REG[m[2]]) sp = m[1] === 'map' ? REG[m[2]] : m[1] === 'combat' ? combatOf(m[2]) : bossOf(m[2]);
    if (sp) cache[id] = sp;
    return sp;
  }

  /* ---------- Hjelpere ---------- */
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const mod = (a, n) => ((a % n) + n) % n;
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rngOf(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const stats = { notes: 0, ticks: 0, tracks: 0 };
  let noiseBuf = null;
  function noise(c) {
    if (!noiseBuf || noiseBuf.sampleRate !== c.sampleRate || noiseBuf._c !== c) {
      noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      noiseBuf._c = c;
    }
    return noiseBuf;
  }

  /* ---------- Stemmer ---------- */
  function env(g, t, a, peak, hold, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    if (hold > 0) g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
    return t + a + hold + rel;
  }
  function osc(p, type, f, t, end, dest, detune) {
    const o = p.c.createOscillator();
    o.type = type; o.frequency.value = f;
    if (detune) o.detune.value = detune;
    o.connect(dest); o.start(t); o.stop(end + 0.05);
    stats.notes++;
    return o;
  }
  function voice(p, inst, t, m, dur, v) {
    const c = p.c, f = mtof(m), g = c.createGain();
    g.connect(p.inn);
    let end;
    switch (inst) {
      case 'mallet': {
        end = env(g, t, 0.004, v, 0, Math.min(0.9, 0.25 + dur));
        osc(p, 'sine', f, t, end, g);
        const g2 = c.createGain(); g2.connect(p.inn);
        osc(p, 'sine', f * 4, t, env(g2, t, 0.002, v * 0.18, 0, 0.07), g2);
        break;
      }
      case 'bell': {
        end = env(g, t, 0.005, v, 0, 1.4 + dur * 0.5);
        osc(p, 'sine', f, t, end, g);
        const g2 = c.createGain(); g2.connect(p.inn);
        osc(p, 'sine', f * 2.76, t, env(g2, t, 0.003, v * 0.22, 0, 0.5), g2);
        break;
      }
      case 'chip':
        end = env(g, t, 0.003, v, dur * 0.6, 0.06);
        osc(p, 'square', f, t, end, g);
        break;
      case 'flute':
        end = env(g, t, 0.06, v, Math.max(0, dur - 0.08), 0.22);
        osc(p, 'sine', f, t, end, g);
        break;
      case 'pluck': default:
        end = env(g, t, 0.005, v, 0, Math.min(1.2, 0.3 + dur * 1.2));
        osc(p, 'triangle', f, t, end, g);
    }
  }
  function pad(p, sp, t, notes, dur) {
    const pd = sp.pad, c = p.c;
    const g = c.createGain(); g.connect(p.inn);
    const a = Math.min(0.8, dur * 0.3);
    const end = env(g, t, a, pd.v, Math.max(0, dur - a - 0.2), 0.7);
    for (const m of notes) {
      const f = mtof(m + 12 * (pd.o || 0));
      if (pd.w === 'organ') { osc(p, 'square', f, t, end, g); osc(p, 'sine', f * 2, t, end, g); }
      else { osc(p, pd.w, f, t, end, g, -6); osc(p, pd.w, f, t, end, g, 6); }
    }
  }
  function bass(p, sp, t, m, dur) {
    const b = sp.bass, g = p.c.createGain(); g.connect(p.inn);
    osc(p, b.w, mtof(m), t, env(g, t, 0.01, b.v, dur * 0.5, Math.max(0.08, dur * 0.6)), g);
  }
  function drum(p, kind, t, v) {
    const c = p.c, g = c.createGain();
    if (kind === 'k' || kind === 't') {
      g.connect(p.dr);
      const o = osc(p, 'sine', kind === 'k' ? 140 : 120, t, env(g, t, 0.003, 0.5 * v, 0, kind === 'k' ? 0.28 : 0.35), g);
      o.frequency.setValueAtTime(kind === 'k' ? 140 : 120, t);
      o.frequency.exponentialRampToValueAtTime(kind === 'k' ? 42 : 70, t + 0.13);
      return;
    }
    const src = c.createBufferSource();
    src.buffer = noise(c);
    src.connect(g); g.connect(kind === 's' ? p.bp : p.hp);
    const end = env(g, t, 0.002, (kind === 's' ? 0.3 : 0.12) * v, 0, kind === 's' ? 0.16 : 0.045);
    src.start(t, Math.random() * 0.8, end - t + 0.02);
    stats.notes++;
  }

  /* ---------- Harmonikk og melodi ---------- */
  function chord(sp, d) {
    const sc = MODE[sp.m];
    return [0, 2, 4].map((k) => { const i = d + k; return sp.r + sc[i % 7] + 12 * Math.floor(i / 7); });
  }
  function melMidi(sp, i) {
    const ms = sp.ms || MODE[sp.m];
    return sp.r + 12 * (sp.mel.o || 0) + ms[mod(i, ms.length)] + 12 * Math.floor(i / ms.length);
  }
  function snap(sp, i, pcs) {
    for (const dd of [0, -1, 1, -2, 2]) if (pcs.includes(mod(melMidi(sp, i + dd), 12))) return i + dd;
    return i;
  }
  function rhythm(rng, spb, d, last) {
    const on = [];
    if (last) { on.push(0); if (rng() < 0.6) on.push(spb === 12 ? 4 : 6); return on; }
    for (let s = 0; s < spb; s += 2) {
      const pr = s === 0 ? d + 0.3 : s % 4 === 0 ? d + 0.15 : d * 0.6;
      if (rng() < pr) on.push(s);
    }
    if (!on.length) on.push(0);
    return on;
  }
  // Ny melodi for hver runde: takt 1 og 3 deler rytme (A A'), siste takt lander på en akkordtone.
  function genMel(p, pass) {
    const sp = p.sp;
    if (!sp.mel || pass === 0 || (pass % 4 === 3 && !/^(combat|boss)/.test(p.id))) return null;
    const rng = rngOf(p.seed + pass * 7919);
    const spb = sp.spb || 16, L = sp.prog.length, d = sp.mel.d || 0.4;
    const rA = rhythm(rng, spb, d), rB = rhythm(rng, spb, d);
    let i = Math.floor(rng() * 5);
    const out = [];
    for (let b = 0; b < L; b++) {
      const last = b === L - 1;
      const on = last ? rhythm(rng, spb, d, true) : (b % 2 === 0 ? rA : rB);
      const pcs = chord(sp, sp.prog[b]).map((m) => mod(m, 12));
      const bar = {};
      on.forEach((s, k) => {
        const r = rng();
        i += r < 0.12 ? -2 : r < 0.4 ? -1 : r < 0.5 ? 0 : r < 0.8 ? 1 : r < 0.92 ? 2 : (rng() < 0.5 ? 3 : -3);
        if (i > 8) i -= 3; if (i < -2) i += 3;
        if (s % 4 === 0 || last) i = snap(sp, i, pcs);
        if (last && k === on.length - 1) i = snap(sp, Math.round(i / 5) * 5, pcs);
        const next = k + 1 < on.length ? on[k + 1] : spb;
        bar[s] = { m: melMidi(sp, i), l: Math.min(next - s, last ? spb : 6) };
      });
      out.push(bar);
    }
    return out;
  }

  /* ---------- Spiller (én per aktivt spor) ---------- */
  function makePlayer(c, dest, id, sp, seed, t0, fadeIn) {
    const p = { c, id, sp, seed, step: 0, t0, endAt: 0, mel: null, nodes: [] };
    const node = (n) => { p.nodes.push(n); return n; };
    p.out = node(c.createGain());
    if (fadeIn) { p.out.gain.setValueAtTime(0.0001, t0); p.out.gain.linearRampToValueAtTime(1, t0 + FADE); }
    p.out.connect(dest);
    const lp = node(c.createBiquadFilter()); lp.type = 'lowpass'; lp.frequency.value = sp.lp || 2400; lp.Q.value = 0.4; lp.connect(p.out);
    p.inn = node(c.createGain()); p.inn.connect(lp);
    if (sp.dl) {
      const sd = 60 / sp.bpm / 4;
      const send = node(c.createGain()); send.gain.value = sp.dl;
      const dly = node(c.createDelay(2)); dly.delayTime.value = sd * 3;
      const damp = node(c.createBiquadFilter()); damp.type = 'lowpass'; damp.frequency.value = 1800;
      const fb = node(c.createGain()); fb.gain.value = sp.fb || 0.32;
      lp.connect(send); send.connect(dly); dly.connect(damp); damp.connect(fb); fb.connect(dly); damp.connect(p.out);
    }
    p.dr = node(c.createGain()); p.dr.gain.value = 0.8; p.dr.connect(p.out);
    p.hp = node(c.createBiquadFilter()); p.hp.type = 'highpass'; p.hp.frequency.value = 7000; p.hp.connect(p.dr);
    p.bp = node(c.createBiquadFilter()); p.bp.type = 'bandpass'; p.bp.frequency.value = 1800; p.bp.Q.value = 0.8; p.bp.connect(p.dr);
    return p;
  }
  function stepTime(p, step) {
    const sd = 60 / p.sp.bpm / 4;
    return p.t0 + step * sd;
  }
  function scheduleStep(p, step, t) {
    const sp = p.sp, spb = sp.spb || 16, sd = 60 / sp.bpm / 4;
    const s = step % spb, bar = Math.floor(step / spb), L = sp.prog.length, lb = bar % L, pass = Math.floor(bar / L);
    if (s === 0 && lb === 0) p.mel = genMel(p, pass);
    const ch = chord(sp, sp.prog[lb]);
    if (s === 0 && sp.pad) pad(p, sp, t, ch, spb * sd);
    if (sp.bass) {
      const c = sp.bass.p[s % sp.bass.p.length];
      if (c !== '.') {
        const root = ch[0] - 24 + 12 * (sp.bass.o || 0);
        const m = { x: root, '5': ch[2] - 24, '3': ch[1] - 24, o: root + 12, b: root + 1 }[c];
        if (m != null) bass(p, sp, t, m, (sp.bass.l || 2) * sd);
      }
    }
    if (sp.arp) {
      const pats = Array.isArray(sp.arp.p) ? sp.arp.p : [sp.arp.p];
      const pat = pats[(pass + (lb >= L / 2 ? 1 : 0)) % pats.length];
      const c = pat[s % pat.length];
      if (c >= '0' && c <= '5') {
        const k = +c, m = ch[k % 3] + 12 * (Math.floor(k / 3) + (sp.arp.o || 0));
        voice(p, sp.arp.i, t, m, sd * 1.5, sp.arp.v);
      }
    }
    if (p.mel && p.mel[lb] && p.mel[lb][s]) { const n = p.mel[lb][s]; voice(p, sp.mel.i, t, n.m, n.l * sd, sp.mel.v); }
    if (sp.drum && bar >= (sp.di || 0)) {
      const fill = lb === L - 1 && pass % 2 === 1 && s >= spb - 4;
      for (const k in sp.drum) {
        const pat = sp.drum[k];
        let c = pat[s % pat.length];
        if (fill && k === 'h' && c === '.') c = 'g';
        if (c !== '.') drum(p, k, t, c === 'X' ? 1.3 : c === 'g' ? 0.45 : 1);
      }
    }
  }
  function fill(p, until) {
    for (;;) {
      const t = stepTime(p, p.step);
      if (t >= until) break;
      if (!p.endAt || t < p.endAt) scheduleStep(p, p.step, t + ((p.step % 2) ? (p.sp.sw || 0) * 60 / p.sp.bpm / 4 : 0));
      p.step++;
    }
  }

  /* ---------- Stikk (seier/tap) ---------- */
  function stinger(c, dest, root, kind, t) {
    const sp = { r: root, bpm: 90, lp: 3000, dl: 0.3, fb: 0.35, pad: { w: 'triangle', v: 0.06 } };
    const p = makePlayer(c, dest, kind, sp, 1, t, false);
    if (kind === 'victory') {
      [0, 4, 7, 12, 16].forEach((iv, k) => voice(p, 'bell', t + k * 0.13, root + 12 + iv, 0.4, 0.06));
      pad(p, sp, t + 0.5, [root, root + 4, root + 7, root + 12], 2.4);
    } else {
      [7, 3, 2, -2].forEach((iv, k) => voice(p, 'flute', t + k * 0.32, root + 12 + iv, 0.3, 0.06));
      pad(p, sp, t + 1.1, [root - 12, root + 3 - 12, root + 7 - 12], 2.6);
    }
    return p;
  }

  /* ---------- Tilstand og API ---------- */
  let enabled = true, vol = 0.5;
  try {
    enabled = localStorage.getItem('ng.music') !== '0';
    const v = parseFloat(localStorage.getItem('ng.musicVol'));
    if (v >= 0 && v <= 1) vol = v;
  } catch (e) { /* ingen lagring */ }
  let bus = null, busCtx = null, players = [], timer = null, want = null, gestured = false, resumeT = null, plays = 0;
  const hidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden';
  const muted = () => !!(NG.audio && NG.audio.muted);
  const canPlay = () => enabled && !muted() && gestured && !hidden();

  function getBus() {
    const c = NG.audio && NG.audio.context && NG.audio.context();
    if (!c || !NG.audio.master) return null;
    if (busCtx !== c) {
      bus = c.createGain(); bus.gain.value = vol * GAIN; bus.connect(NG.audio.master); busCtx = c;
    }
    return bus;
  }
  function tick() {
    timer = null;
    if (!busCtx || hidden()) return;
    stats.ticks++;
    const now = busCtx.currentTime;
    players = players.filter((p) => {
      if (p.endAt && now > p.endAt + 0.3) { p.nodes.forEach((n) => { try { n.disconnect(); } catch (e) { /* */ } }); return false; }
      if (!p.once) {
        if (stepTime(p, p.step) < now) p.t0 = now + 0.05 - p.step * 60 / p.sp.bpm / 4; // hang etter (struping) → hopp fram
        fill(p, now + AHEAD);
      }
      return true;
    });
    if (players.length) timer = setTimeout(tick, TICK);
  }
  function kick() { if (!timer && players.length && !hidden()) timer = setTimeout(tick, 0); }
  function fadeOut(p, now, len) {
    if (p.endAt) return;
    const g = p.out.gain;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0.0001, now + len);
    p.endAt = now + len;
  }
  function fadeAll(len) { if (busCtx) players.forEach((p) => fadeOut(p, busCtx.currentTime, len)); }
  const current = () => players.find((p) => !p.endAt && !p.once) || null;

  function play(id) {
    if (!id) return;
    clearTimeout(resumeT); resumeT = null;
    if (id === 'victory' || id === 'defeat') { stingerNow(id); return; }
    if (!specFor(id)) return;
    want = id;
    if (!canPlay()) return;
    const cur = current();
    if (cur && cur.id === id) return;
    const b = getBus(); if (!b) return;
    const now = busCtx.currentTime;
    fadeAll(FADE);
    players.push(makePlayer(busCtx, b, id, specFor(id), hash(id) + 101 * plays++, now + 0.05, true));
    stats.tracks++;
    kick();
  }
  function stingerNow(kind, after) {
    if (!canPlay()) return;
    const b = getBus(); if (!b) return;
    const cur = current();
    const prev = cur ? cur.id : want;
    const root = cur ? cur.sp.r : 60;
    const now = busCtx.currentTime;
    fadeAll(0.5);
    const p = stinger(busCtx, b, root % 12 + 60, kind, now + 0.55); // etter SFX-fanfaren
    p.once = true; p.endAt = now + 5;
    players.push(p);
    kick();
    want = after || prev;
    if (want) { const w = want; resumeT = setTimeout(() => { resumeT = null; play(w); }, 4500); }
  }
  function runRegion() { try { const s = NG.state && NG.state(); return s && s.run ? s.run.region : null; } catch (e) { return null; } }

  // Skjerm + parametre + ekspedisjonsstatus → spor. null = behold det som spiller.
  function pick(name, params) {
    params = params || {};
    let s = null; try { s = NG.state && NG.state(); } catch (e) { /* */ }
    const run = s && s.run, reg = run ? run.region : null;
    switch (name) {
      case 'title': case 'intro': case 'finale': return 'title';
      case 'camp': case 'shop': return 'camp';
      case 'merchant': return 'rest';
      case 'path': case 'event': case 'chest': return reg ? 'map:' + reg : 'camp';
      case 'sol': case 'oracle': return 'rest';
      case 'lab': case 'labs': case 'exams': case 'review': return 'lab';
      case 'combat': {
        let def = null; try { def = params.enemy && NG.enemyDef ? NG.enemyDef(params.enemy) : null; } catch (e) { /* */ }
        const region = reg || (def && def.region) || 'energi';
        let node = null; try { node = run && NG.runNode ? NG.runNode(s) : null; } catch (e) { /* */ }
        const boss = (node && node.type === 'boss') || (NG.REGIONS || []).some((r) => r.boss === params.enemy);
        return (boss ? 'boss:' : 'combat:') + region;
      }
      default: return null;
    }
  }
  function auto(name, params) {
    let id = pick(name, params);
    if (!id) {
      const w = (current() || {}).id || want;
      id = !w ? 'camp' : (/^(map|combat|boss):/.test(w) && !runRegion() ? 'camp' : null);
    }
    if (id) play(id);
  }

  function unlock() {
    if (gestured) return;
    // Berøring via pointerdown gir ikke «user activation» i Chrome; vent da på touchend/click.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    gestured = true;
    ['pointerdown', 'touchend', 'click', 'keydown'].forEach((t) => document.removeEventListener(t, unlock, true));
    if (enabled && !muted()) play(want || 'camp');
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    ['pointerdown', 'touchend', 'click', 'keydown'].forEach((t) => document.addEventListener(t, unlock, { capture: true, passive: true }));
    document.addEventListener('visibilitychange', () => {
      if (!busCtx) return;
      if (hidden()) { clearTimeout(timer); timer = null; busCtx.suspend().catch(() => {}); }
      else if (gestured) busCtx.resume().then(kick, () => {});
    });
  }

  NG.music = {
    play,
    stop() { want = null; clearTimeout(resumeT); resumeT = null; fadeAll(FADE); },
    get enabled() { return enabled; },
    setEnabled(b) {
      enabled = !!b;
      try { localStorage.setItem('ng.music', enabled ? '1' : '0'); } catch (e) { /* */ }
      NG.music._sync();
    },
    get volume() { return vol; },
    setVolume(v) {
      vol = Math.max(0, Math.min(1, +v || 0));
      try { localStorage.setItem('ng.musicVol', String(vol)); } catch (e) { /* */ }
      if (bus) bus.gain.setTargetAtTime(vol * GAIN, busCtx.currentTime, 0.05);
    },
    get track() { const c = current(); return c ? c.id : null; },
    pick, auto,
    stinger: (kind) => stingerNow(kind === 'defeat' ? 'defeat' : 'victory'),
    tracks: () => ['title', 'camp', 'lab', 'rest', ...Object.keys(REG).flatMap((r) => ['map:' + r, 'combat:' + r, 'boss:' + r])],
    _sync() {
      if (enabled && !muted()) { if (want) { const w = want; want = null; play(w); } else if (gestured) play('camp'); }
      else { const c = current(); if (c) want = c.id; fadeAll(0.4); }
    },
    _onSfx(name) {
      const c = current(); const id = c ? c.id : '';
      const reg = runRegion();
      if (name === 'lose') stingerNow('defeat', reg ? 'map:' + reg : 'camp');
      else if (name === 'win' || (name === 'coin' && /^(combat|boss):/.test(id))) {
        stingerNow('victory', /^(combat|boss):/.test(id) ? (reg ? 'map:' + reg : 'camp') : null);
      }
    },
    debug: () => ({ track: (current() || {}).id || null, want, players: players.length, ctx: busCtx && busCtx.state, gestured, enabled, vol, ...stats }),
    // Testhjelper: render et spor offline og mål topp/RMS. NG.music._render('map:liv', 12).then(console.log)
    _render(id, secs) {
      const sr = 22050, c = new OfflineAudioContext(1, Math.ceil(sr * secs), sr);
      const g = c.createGain(); g.gain.value = vol * GAIN; g.connect(c.destination);
      if (id === 'victory' || id === 'defeat') stinger(c, g, 60, id, 0);
      else fill(makePlayer(c, g, id, specFor(id), hash(id), 0, false), secs);
      return c.startRendering().then((buf) => {
        const d = buf.getChannelData(0); let peak = 0, sum = 0;
        for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; }
        return { id, peak: +peak.toFixed(3), rms: +Math.sqrt(sum / d.length).toFixed(4) };
      });
    },
  };
})();
