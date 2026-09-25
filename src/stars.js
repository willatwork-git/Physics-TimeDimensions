/* Chronoscope — Stars forge the elements (D-048), Cosmos.
   Scene 1 · Inside a massive star: the burning stages of a 25-Sun-mass star, each far shorter than the last
   (published model values: Woosley, Heger & Weaver 2002), drawn as an onion of shells and a countdown.
   Scene 2 · Where each element came from: the periodic table coloured by origin, filling in as cosmic time
   passes (rounded shares after Johnson 2019 and Kobayashi, Karakas & Lugaro 2020). Data, not computed. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2, YR = 3.156e7;

  /* ---------- scene 1: the stages of a 25-Sun-mass star ---------- */
  const STAGES = [
    { f: "Hydrogen", a: "Helium", yr: 6.7e6, T: 0.038, col: "#8fd3ff" },
    { f: "Helium", a: "Carbon, oxygen", yr: 8.4e5, T: 0.20, col: "#ffd35a" },
    { f: "Carbon", a: "Neon, magnesium", yr: 522, T: 0.81, col: "#ffb347" },
    { f: "Neon", a: "Oxygen, magnesium", yr: 0.89, T: 1.57, col: "#ff7a59" },
    { f: "Oxygen", a: "Silicon, sulfur", yr: 0.40, T: 2.09, col: "#e36bd0" },
    { f: "Silicon", a: "Iron", yr: 2 / 365.25, T: 3.65, col: "#9b8cff" }
  ];
  const SHELL = ["#3a6ea5", "#8fd3ff", "#ffd35a", "#ffb347", "#ff7a59", "#e36bd0", "#9b8cff"];   // envelope, then each stage's ash
  const ST = { scene: "star", s: 0, play: false };
  function dur(yr) {
    const s = yr * YR;
    if (s < 120) return `${+s.toPrecision(2)} seconds`;
    if (yr < 1 / 12) return `${Math.round(yr * 365.25)} days`;
    if (yr < 2) return `${Math.round(yr * 12)} months`;
    if (yr < 1e4) return `${Math.round(yr).toLocaleString("en-AU")} years`;
    if (yr < 1e6) return `${+(yr / 1e3).toPrecision(2)} thousand years`;
    return `${+(yr / 1e6).toPrecision(2)} million years`;
  }

  function drawStar(g) {
    const { ctx } = g, { A, B } = g.split(0.5), i = Math.min(6, Math.floor(ST.s)), done = i >= 6, f = ST.s - i;
    g.panel(A.x, A.y, A.w, A.h, "Inside a star of 25 Sun masses (not to scale)");
    const cx = A.x + A.w / 2, cy = A.y + A.h * 0.46, R = Math.min(A.w, A.h) * 0.36;
    if (!done) {
      const n = i + 1;                                     // envelope + one shell of ash per finished stage
      for (let k = 0; k <= n; k++) { const r = R * Math.pow(0.72, k); g.dot(cx, cy, r, g.alpha(SHELL[Math.min(k, SHELL.length - 1)], k ? 0.55 : 0.35)); }
      const rc = R * Math.pow(0.72, n + 0.6), pulse = 1 + 0.08 * Math.sin(performance.now() / 180);
      ctx.shadowColor = STAGES[i].col; ctx.shadowBlur = 25; g.dot(cx, cy, rc * pulse, "#fff3c4"); ctx.shadowBlur = 0;
      g.label(`core: ${STAGES[i].f.toLowerCase()} burning`, cx, cy + R + 22, STAGES[i].col, 11, "center");
    } else {
      const q = Math.min(1, f * 2 + 0.3);
      ctx.shadowColor = "#fff"; ctx.shadowBlur = 50; g.dot(cx, cy, R * (0.25 + q * 0.6), g.alpha("#ffffff", 1 - q * 0.6)); ctx.shadowBlur = 0;
      for (let k = 0; k < 60; k++) { const a = k / 60 * TAU, r = R * (0.4 + q * 0.75); g.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, g.alpha(SHELL[1 + k % 6], 0.9)); }
      g.label("the core collapses in under a second — the star explodes", cx, cy + R + 22, C.text, 11, "center");
    }
    if (cy + R + 40 < A.y + A.h - 14) g.label("outer layers: hydrogen", A.x + 14, A.y + A.h - 14, C.muted, 10);   // short stacked panel (phones): no room

    g.panel(B.x, B.y, B.w, B.h, "The countdown: each stage far shorter than the last");
    const x0 = B.x + 14, bw = B.w - 28, lmax = Math.log10(6.7e6 * YR), tight = B.h < 340;   // tight: the readout bar carries the "Now" line
    const row = tight ? Math.max(16, (B.h - 64) / 7) : Math.min(40, (B.h - 150) / 7), fs = tight ? 10 : 11;
    let y = B.y + (tight ? 40 : 48);
    STAGES.concat([{ f: "Core collapse", a: "", yr: 0.5 / YR, col: "#ffffff" }]).forEach((s, k) => {
      const on = k === i, len = Math.max(0.02, Math.log10(s.yr * YR) / lmax), d = dur(s.yr).replace("0.5 seconds", "under a second");
      ctx.font = `${fs}px Inter, system-ui, sans-serif`; let t = `${s.f}${s.a ? " → " + s.a : ""}`;
      const dw = (ctx.font = `${fs}px JetBrains Mono, monospace`, ctx.measureText(d).width);
      ctx.font = `${fs}px Inter, system-ui, sans-serif`; if (ctx.measureText(t).width + dw + 12 > bw) t = s.f;   // no room for the products: fuel only
      g.label(t, x0, y, on ? C.text : C.muted, fs, "left", "Inter, system-ui, sans-serif");
      g.label(d, x0 + bw, y, on ? s.col : C.muted, fs, "right");
      g.bar(x0, y + (tight ? 3 : 5), bw * len, tight ? 3 : 6, 1, g.alpha(s.col, on ? 1 : 0.35)); y += row;
    });
    y += 6;
    if (!tight && !done) {
      const s = STAGES[i];
      y += g.wrap(`Now: ${s.f.toLowerCase()} burning at about ${s.T < 0.1 ? Math.round(s.T * 1000) + " million" : s.T.toFixed(1) + " billion"} degrees, making ${s.a.toLowerCase()}. It lasts ${dur(s.yr)}${i ? ` — about ${Math.round(STAGES[i - 1].yr / s.yr).toLocaleString("en-AU")} times shorter than the stage before` : ""}.`, x0, y, bw, 15, C.text, 12) + 6;
    } else if (!tight) y += g.wrap("Iron is where fusion stops paying: fusing it takes energy instead of giving it. With nothing left to hold it up, the core collapses and the star explodes, scattering everything it made.", x0, y, bw, 15, C.text, 12) + 6;
    g.label("Model: published stage times for a 25-Sun-mass star.", x0, B.y + B.h - 14, C.muted, 10);
  }

  /* ---------- scene 2: where each element came from ---------- */
  /* Sources, by letter. Shares below are in tenths, rounded, after Johnson (2019) and Kobayashi et al. (2020). */
  const SRC = {
    b: { n: "Big Bang", s: "Big Bang", col: "#8fd3ff" },
    c: { n: "Cosmic rays", s: "cosmic rays", col: "#4fd1a5" },
    m: { n: "Exploding massive stars", s: "big stars", col: "#ff7a59" },
    w: { n: "Exploding white dwarfs", s: "white dwarfs", col: "#f2c94c" },
    g: { n: "Ageing giant stars", s: "giant stars", col: "#9b8cff" },
    n: { n: "Colliding neutron stars", s: "neutron stars", col: "#e36bd0" },
    d: { n: "Short-lived: from decay", s: "decay", col: "#5d6478" },
    p: { n: "Made in labs", s: "labs", col: "#3d4252" }
  };
  const RAW = "H Hydrogen b10,He Helium b9m1,Li Lithium b2c2g6,Be Beryllium c10,B Boron c8m2,C Carbon g5m5,N Nitrogen g7m3,O Oxygen m10,F Fluorine g5m5,Ne Neon m10," +
    "Na Sodium m9g1,Mg Magnesium m10,Al Aluminium m10,Si Silicon m8w2,P Phosphorus m10,S Sulfur m7w3,Cl Chlorine m8w2,Ar Argon m7w3,K Potassium m9w1,Ca Calcium m7w3," +
    "Sc Scandium m10,Ti Titanium m7w3,V Vanadium m5w5,Cr Chromium m3w7,Mn Manganese m2w8,Fe Iron m4w6,Co Cobalt m6w4,Ni Nickel m5w5,Cu Copper m8g2,Zn Zinc m8g2," +
    "Ga Gallium m5g5,Ge Germanium m5g5,As Arsenic m5g3n2,Se Selenium m5g2n3,Br Bromine m4g2n4,Kr Krypton m4g3n3,Rb Rubidium m3g4n3,Sr Strontium m2g7n1,Y Yttrium m1g6n3,Zr Zirconium m1g6n3," +
    "Nb Niobium g6n4,Mo Molybdenum g5n5,Tc Technetium p10,Ru Ruthenium g3n7,Rh Rhodium g2n8,Pd Palladium g5n5,Ag Silver g2n8,Cd Cadmium g6n4,In Indium g3n7,Sn Tin g6n4," +
    "Sb Antimony g3n7,Te Tellurium g2n8,I Iodine g1n9,Xe Xenon g2n8,Cs Caesium g2n8,Ba Barium g9n1,La Lanthanum g7n3,Ce Cerium g8n2,Pr Praseodymium g5n5,Nd Neodymium g6n4," +
    "Pm Promethium p10,Sm Samarium g3n7,Eu Europium n10,Gd Gadolinium g2n8,Tb Terbium g1n9,Dy Dysprosium g2n8,Ho Holmium g1n9,Er Erbium g2n8,Tm Thulium g1n9,Yb Ytterbium g4n6," +
    "Lu Lutetium g2n8,Hf Hafnium g5n5,Ta Tantalum g4n6,W Tungsten g6n4,Re Rhenium g1n9,Os Osmium g1n9,Ir Iridium n10,Pt Platinum g1n9,Au Gold g1n9,Hg Mercury g6n4," +
    "Tl Thallium g7n3,Pb Lead g8n2,Bi Bismuth g2n8,Po Polonium d10,At Astatine d10,Rn Radon d10,Fr Francium d10,Ra Radium d10,Ac Actinium d10,Th Thorium n10," +
    "Pa Protactinium d10,U Uranium n10";
  const EL = RAW.split(",").map((e, k) => { const [sym, name, code] = e.split(" "), sh = {};
    code.replace(/([a-z])(\d+)/g, (_, s, v) => { sh[s] = +v / 10; }); return { z: k + 1, sym, name, sh }; });
  /* Where each tile sits: [row, column] in the usual layout; La–Lu and Ac–U in the two rows underneath. */
  function cell(z) {
    if (z === 1) return [0, 0]; if (z === 2) return [0, 17];
    if (z <= 10) return [1, z <= 4 ? z - 3 : z + 7];
    if (z <= 18) return [2, z <= 12 ? z - 11 : z - 1];
    if (z <= 36) return [3, z - 19];
    if (z <= 54) return [4, z - 37];
    if (z <= 56) return [5, z - 55];
    if (z <= 71) return [7.4, z - 55];
    if (z <= 86) return [5, z - 69];
    if (z <= 88) return [6, z - 87];
    return [8.4, z - 87];
  }
  /* Cosmic-time steps: which sources had made anything by then. */
  const TIMES = [
    { t: "3 minutes", on: "b" },
    { t: "~200 million years", on: "bm" },
    { t: "~500 million years", on: "bmnd" },
    { t: "~1 billion years", on: "bmndwgc" },
    { t: "9.2 billion years: the Sun forms", on: "bmndwgc" },
    { t: "Today", on: "bmndwgcp" }
  ];
  Object.assign(ST, { step: 5, sel: 26, tiles: [], clock: 0, from: 5, lit: 1 });   // from, lit: the step before a change and how far the new tiles have faded in
  /* Electrons per shell in the ground state: fill subshells in the usual order (1s 2s 2p 3s 3p 4s 3d …), then apply the
     measured exceptions, where one or two electrons sit in a different shell ([element, from shell, to shell, count]). */
  const ORDER = [[1, 2], [2, 2], [2, 6], [3, 2], [3, 6], [4, 2], [3, 10], [4, 6], [5, 2], [4, 10], [5, 6], [6, 2], [4, 14], [5, 10], [6, 6], [7, 2], [5, 14], [6, 10]];
  const EXC = [[24, 4, 3, 1], [29, 4, 3, 1], [41, 5, 4, 1], [42, 5, 4, 1], [44, 5, 4, 1], [45, 5, 4, 1], [46, 5, 4, 2], [47, 5, 4, 1],
    [57, 4, 5, 1], [58, 4, 5, 1], [64, 4, 5, 1], [78, 6, 5, 1], [79, 6, 5, 1], [89, 5, 6, 1], [90, 5, 6, 2], [91, 5, 6, 1], [92, 5, 6, 1]];
  function shells(z) {
    const n = [0, 0, 0, 0, 0, 0, 0]; let left = z;
    for (const [sh, cap] of ORDER) { const k = Math.min(cap, left); n[sh - 1] += k; left -= k; if (!left) break; }
    EXC.forEach(([e, a, b, k]) => { if (e === z) { n[a - 1] -= k; n[b - 1] += k; } });
    return n.filter(x => x > 0);
  }
  /* A picture of the atom, not to scale (ANALOGY): nucleus, shell rings, electrons circling — outer shells slower. */
  function drawAtom(g, el, cx, cy, R) {
    const sh = shells(el.z), col = SRC[main(el)].col, t = ST.clock, nucl = Math.max(4, R * 0.09);
    sh.forEach((ne, k) => {
      const r = nucl + (R - nucl) * (k + 1) / sh.length, w = 0.9 / Math.pow(k + 1, 0.7) * (k % 2 ? -1 : 1);
      g.ring(cx, cy, r, g.alpha(col, 0.18), 1);
      for (let e = 0; e < ne; e++) { const a = t * w + e / ne * TAU + k * 0.7;
        g.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.max(1.6, R * 0.028), g.alpha(col, 0.95)); }
    });
    g.ctx.shadowColor = col; g.ctx.shadowBlur = 18 * (1 + 0.15 * Math.sin(t * 2.2)); g.dot(cx, cy, nucl, "#fff3c4"); g.ctx.shadowBlur = 0;
    return sh;
  }
  const has = (el, on) => Object.keys(el.sh).some(s => on.includes(s));
  const main = el => Object.keys(el.sh).sort((a, b) => el.sh[b] - el.sh[a])[0];

  const STORY = {
    H: "Made in the first few minutes. Nearly every hydrogen atom in you is about 13.8 billion years old.",
    He: "Mostly from the first few minutes; stars have added a little since. Found in the Sun's light (1868) before anyone found it on Earth.",
    Li: "Old stars show about three times less than the Big Bang should have made: the lithium problem, still unsolved.",
    C: "Built from helium in ageing stars. About half was puffed out gently by giant stars, half blown out by exploding ones.",
    O: "Mostly from massive stars, scattered when they explode. By mass, the most common element in you.",
    Fe: "Where fusion stops paying. Most came from exploding white dwarfs, the rest from massive stars. The iron in your blood is older than the Sun.",
    Au: "Too heavy for any star's core. Most came from colliding neutron stars: in 2017 one was seen in gravitational waves and in light.",
    Pb: "Mostly built slowly inside ageing giant stars, over thousands of years."
  };
  /* One star's own core, over its normal life: which elements its fusion reaches, by starting mass. Mass thresholds
     rounded from stellar models (Woosley, Heger & Weaver 2002; Karakas & Lattanzio 2014); the 8–10 Sun boundary is uncertain. */
  const IRON = [2, 6, 7, 8].concat(Array.from({ length: 19 }, (_, k) => k + 10));     // helium, carbon to oxygen, neon to nickel
  const STARS = [null,
    { m: 0.2, n: "0.2 Suns", k: "a red dwarf", z: [2], reach: "helium", life: "trillions of years", end: "a helium white dwarf, one day", col: "#ff9a6b",
      note: "Hydrogen into helium only, and so slowly that no red dwarf has finished yet." },
    { m: 1, n: "1 Sun", k: "our Sun", z: [2, 6, 8], reach: "carbon and oxygen", life: "about 10 billion years", end: "a white dwarf of carbon and oxygen", col: "#ffd35a",
      note: "The Sun will never make iron. It isn't heavy enough to squeeze its core past burning helium." },
    { m: 4, n: "4 Suns", k: "a bigger star", z: [2, 6, 7, 8], reach: "carbon and oxygen", life: "about 200 million years", end: "a white dwarf of carbon and oxygen", col: "#fff3c4",
      note: "Still stops at oxygen. Late in life, stars around this size also build heavier elements slowly in their outer layers, a different route: much of the purple." },
    { m: 9, n: "9 Suns", k: "near the dividing line", z: [2, 6, 7, 8, 10, 11, 12, 13], reach: "neon and magnesium", life: "about 30 million years", end: "a white dwarf, or a faint explosion", col: "#cfe3ff",
      note: "Heavy enough to burn carbon. Whether stars this size explode is still being worked out." },
    { m: 12, n: "12 Suns", k: "a massive star", z: IRON, reach: "iron", life: "about 20 million years", end: "an explosion that leaves a neutron star", col: "#8fd3ff",
      note: "From about 10 Suns up, fusion runs all the way to iron, and no further." },
    { m: 25, n: "25 Suns", k: "a very massive star", z: IRON, reach: "iron", life: "about 7.5 million years", end: "an explosion that leaves a neutron star or a black hole", col: "#7cc4ff",
      note: "Bigger stars burn faster and die younger, but they still stop at iron." }];
  ST.star = 0;
  function drawTable(g) {
    const { A, B, stacked } = g.split(0.66), on = TIMES[ST.step].on, was = TIMES[ST.from].on;
    if (stacked) { const d = A.h - ((A.w - 24) / 18 * 9.6 + 60); if (d > 0) { A.h -= d; B.y -= d; B.h += d; } }   // phones: the table takes only the height it needs
    const star = STARS[ST.star];
    g.panel(A.x, A.y, A.w, A.h, star ? `What a star of ${star.n} makes in its core` : `Where the elements came from · ${TIMES[ST.step].t}`);
    const s = Math.min((A.w - 24) / 18, (A.h - 44) / 9.6), x0 = A.x + (A.w - s * 18) / 2, y0 = A.y + 32;
    ST.tiles = [];
    EL.forEach(el => {
      const [r, c] = cell(el.z), x = x0 + c * s, y = y0 + r * s, w = s - 2, made = star && star.z.includes(el.z), lit = made || (!star && has(el, on));
      g.ctx.fillStyle = "#1b2030"; g.ctx.fillRect(x, y, w, w);
      if (star) { g.ctx.globalAlpha = 0.22; }                         // star mode: the source colours stay faintly underneath
      if (lit && !star) { let yy = y + w;                             // stacked bars: each active source's share, bottom up; new shares grow in
        Object.keys(el.sh).forEach(k => { if (!on.includes(k)) return; const h = w * el.sh[k] * (was.includes(k) ? 1 : ST.lit); yy -= h; g.ctx.fillStyle = g.alpha(SRC[k].col, 0.85); g.ctx.fillRect(x, yy, w, h); }); }
      if (star && !made && has(el, on)) { let yy = y + w; Object.keys(el.sh).forEach(k => { if (!on.includes(k)) return; const h = w * el.sh[k]; yy -= h; g.ctx.fillStyle = SRC[k].col; g.ctx.fillRect(x, yy, w, h); }); }
      g.ctx.globalAlpha = 1;
      if (made) { g.ctx.shadowColor = star.col; g.ctx.shadowBlur = 10 + 4 * Math.sin(ST.clock * 2.2 + el.z); g.ctx.fillStyle = star.col; g.ctx.fillRect(x, y, w, w); g.ctx.shadowBlur = 0; }
      if (el.z === ST.sel) { g.ctx.shadowColor = "#ffffff"; g.ctx.shadowBlur = 8 + 4 * Math.sin(ST.clock * 2.2); g.ctx.strokeStyle = "#ffffff"; g.ctx.lineWidth = 2; g.ctx.strokeRect(x - 1, y - 1, w + 2, w + 2); g.ctx.lineWidth = 1; g.ctx.shadowBlur = 0; }
      g.label(el.sym, x + w / 2, y + w * 0.66, lit ? "#0d1017" : C.muted, Math.max(8, Math.floor(s * 0.42)), "center", "Inter, system-ui, sans-serif");
      ST.tiles.push({ z: el.z, x, y, w });
    });
    g.label("Tap an element", A.x + 14, A.y + A.h - 14, C.muted, 10);

    g.panel(B.x, B.y, B.w, B.h, star ? `${star.n}: ${star.k}` : "Sources");
    const bx = B.x + 14, bw = B.w - 28, lh = B.h < 360 ? 15 : 18, cols = stacked ? 2 : 1;
    let y = B.y + 42;
    if (star) {                                                         // the star, drawn by size (square root of mass: a picture, not to scale)
      const sr = Math.min(26, 5 + 5 * Math.sqrt(star.m)), sx = bx + 28, sy = y + 10;
      g.ctx.shadowColor = star.col; g.ctx.shadowBlur = 20 + 6 * Math.sin(ST.clock * 1.6); g.dot(sx, sy, sr, star.col); g.ctx.shadowBlur = 0;
      g.label(`core fusion reaches ${star.reach}`, bx + 66, y + 2, C.text, 11, "left", "Inter, system-ui, sans-serif");
      g.label(`lives ${star.life}`, bx + 66, y + 18, C.muted, 11, "left", "Inter, system-ui, sans-serif");
      y += 44; y += g.wrap(`Ends as ${star.end}. ${star.note}`, bx, y, bw, 15, C.text, 12) + 4;
    } else {
    Object.keys(SRC).forEach((k, n) => { const live = on.includes(k), lx = bx + (n % cols) * bw / cols, ly = y + Math.floor(n / cols) * lh;
      g.ctx.fillStyle = g.alpha(SRC[k].col, live ? 0.9 : 0.2); g.ctx.fillRect(lx, ly - 9, 10, 10);
      g.label(SRC[k].n, lx + 16, ly, live ? C.text : C.muted, stacked ? 10 : 11, "left", "Inter, system-ui, sans-serif"); });
    y += Math.ceil(8 / cols) * lh; }
    const el = EL[ST.sel - 1]; y += 10; const yName = y;
    g.text(`${el.name} (${el.z})`, bx, y, C.text, 14); y += 20;
    Object.keys(el.sh).forEach(k => { g.label(`${Math.round(el.sh[k] * 100)}%  ${SRC[k].n.toLowerCase()}`, bx, y, on.includes(k) ? SRC[k].col : C.muted, 11); y += 16; });
    const story = STORY[el.sym];
    if (story && y < B.y + B.h - 40) y += 6 + g.wrap(story, bx, y + 6, bw, 15, C.text, 12);
    const room = B.y + B.h - 44 - (y + 12), R = Math.min(bw / 2 - 4, room / 2 - 14, 150);
    if (R >= 34) { const sh = drawAtom(g, el, bx + bw / 2, y + 12 + R, R);
      g.label(`electrons per shell: ${sh.join(" · ")}`, bx + bw / 2, y + 12 + 2 * R + 18, C.muted, 10, "center");
      g.label("a picture, not to scale", bx + bw / 2, y + 12 + 2 * R + 32, C.muted, 10, "center"); y += 2 * R + 46; }
    else drawAtom(g, el, bx + bw - 30, yName + 20, 28);              // no room below (phones): a small one beside the name
    if (y < B.y + B.h - 30) g.label("Data: rounded shares, not computed here.", bx, B.y + B.h - 14, C.muted, 10);   // tight panels: the aside carries it
  }

  /* The entropy strip: one helium nucleus made in the Sun's core (26.2 MeV left after neutrinos) leaves the Sun as
     sunlight photons, then leaves Earth as infrared. Mean black-body photon energy 2.70 kT; Earth radiates at 255 K. */
  const MEV = 26.2e6, KB = 8.617e-5, photons = T => MEV / (2.701 * KB * T);
  const mil = n => `${Math.round(n / 1e6)} million`;

  Chrono.lab.register({
    id: "stars", title: "Stars forge the elements", eyebrow: "Cosmos · where did everything come from?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    predict: { q: "A big star fuses light elements into heavier ones in its core, stage after stage. Where does that core fusion stop?",
      options: ["At carbon", "At iron", "At gold", "It never stops: it runs until the fuel is gone"], answer: 1,
      explain: "At iron. Up to iron, each fusion gives energy out, which holds the star up. Fusing iron takes energy in, so the core loses its support, collapses in under a second, and the star explodes. Anything heavier than iron was made another way: in ageing giant stars, or when neutron stars collide.",
      setup() { Object.assign(ST, { scene: "star", s: 0, play: false }); } },
    applySetup(o) { Object.assign(ST, o); },
    state() { return { scene: ST.scene, stage: Math.min(6, Math.floor(ST.s)), step: ST.step, sel: ST.sel, star: STARS[ST.star] ? STARS[ST.star].m : 0 }; },   // read-only, for missions
    readouts() {
      if (ST.scene === "star") { const i = Math.min(6, Math.floor(ST.s)), s = STAGES[i];
        return i < 6 ? [["Stage lasts", dur(s.yr)], ["Core temperature", s.T < 0.1 ? `${Math.round(s.T * 1000)} million K` : `${s.T.toFixed(1)} billion K`]]
          : [["Collapse takes", "under a second"], ["Stage", "7 of 7"]]; }
      const star = STARS[ST.star]; if (star) return [["Star size", star.n], ["Core fusion reaches", star.reach], ["Lives", star.life.replace("about ", "")]];
      const on = TIMES[ST.step].on, el = EL[ST.sel - 1], k = main(el);
      return [["Cosmic time", TIMES[ST.step].t.split(":")[0]], ["Elements made so far", `${EL.filter(e => has(e, on)).length} of 92`], [`${el.name}, mostly from`, SRC[k].s]];
    },
    controls() {
      const sc = [["star", "Inside a star"], ["table", "Where the elements came from"]].map(([id, n]) => `<button class="btn ${ST.scene === id ? "primary" : ""}" data-st="${id}">${n}</button>`).join("");
      return sc + (ST.scene === "star"
        ? `<label class="ctl">Stage <input type="range" id="st-s" min="0" max="6" step="1" value="${Math.min(6, Math.floor(ST.s))}"><output id="st-so">${Math.min(6, Math.floor(ST.s)) + 1} of 7</output></label>
           <button class="btn" id="st-play">${ST.play ? "❚❚ Pause" : "▶ Play the countdown"}</button>`
        : `<label class="ctl">Cosmic time <input type="range" id="st-t" min="0" max="5" step="1" value="${ST.step}"><output id="st-to">${TIMES[ST.step].t.split(":")[0]}</output></label>
           <label class="ctl">Star size <input type="range" id="st-m" min="0" max="6" step="1" value="${ST.star}"><output id="st-mo">${STARS[ST.star] ? STARS[ST.star].n : "off"}</output></label>`);
    },
    wire() {
      document.querySelectorAll("[data-st]").forEach(b => b.onclick = () => { ST.scene = b.dataset.st; ST.play = false; Chrono.lab.rebuild(); });
      const s = $("#st-s"); if (s) s.oninput = e => { ST.s = +e.target.value; ST.play = false; $("#st-so").textContent = `${ST.s + 1} of 7`; };
      const p = $("#st-play"); if (p) p.onclick = () => { if (!ST.play && ST.s >= 6) ST.s = 0; ST.play = !ST.play; Chrono.lab.rebuild(); };
      const m = $("#st-m"); if (m) m.oninput = e => { ST.star = +e.target.value; $("#st-mo").textContent = STARS[ST.star] ? STARS[ST.star].n : "off"; };
      const t = $("#st-t"); if (t) t.oninput = e => { if (+e.target.value !== ST.step) { ST.from = ST.step; ST.lit = 0; } ST.step = +e.target.value; $("#st-to").textContent = TIMES[ST.step].t.split(":")[0]; };
    },
    tick(dt) {
      ST.clock += dt; ST.lit = Math.min(1, ST.lit + dt / 0.7);
      if (!ST.play) return;
      ST.s = Math.min(6.99, ST.s + dt * 0.4);
      const s = $("#st-s"); if (s && +s.value !== Math.min(6, Math.floor(ST.s))) { s.value = Math.min(6, Math.floor(ST.s)); $("#st-so").textContent = `${+s.value + 1} of 7`; }
      if (ST.s >= 6.99) { ST.play = false; Chrono.lab.rebuild(); }
    },
    pointer(type, x, y) {
      if (type !== "pointerdown" || ST.scene !== "table") return;
      const t = ST.tiles.find(q => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.w); if (t) ST.sel = t.z;
    },
    draw(g) { if (ST.scene === "star") drawStar(g); else drawTable(g); },
    aside: () => `
      <p>Almost everything around you was made inside stars. The Big Bang left hydrogen, helium and a trace of lithium. Everything else came later, from stars living and dying over billions of years, each generation seeding the next.</p>
      <p><b>Inside a star.</b> A massive star burns its fuel in stages, each one hotter and far shorter than the last: millions of years of hydrogen, then days of silicon. It stops at iron, because fusing iron takes energy instead of giving it. The core collapses and the star explodes. <span class="tag ESTABLISHED">Established</span></p>
      <p><b>Our Sun can't make iron.</b> How far a star's fusion gets depends on its mass. A star like the Sun stops at carbon and oxygen and ends as a white dwarf. Only stars of about ten Suns or more burn all the way to iron. Try <b>Star size</b> on the element table. <span class="tag ESTABLISHED">Established</span> (the exact dividing line, 8–10 Suns, <span class="tag CONTESTED">Contested</span>)</p>
      <p><b>Heavier than iron.</b> Those come two ways: slowly, inside ageing giant stars, and quickly, when neutron stars collide. In 2017 a collision was seen both in gravitational waves and in light, glowing with new heavy elements. How the fast share splits between collisions and rare kinds of exploding star is still argued over. <span class="tag CONTESTED">Contested</span></p>
      <p><b>What this has to do with time.</b> Every fusion in the Sun makes a helium nucleus, and its energy leaves the Sun as about <b>${mil(photons(5772))}</b> photons of sunlight. Earth sends that same energy out again as about <b>${mil(photons(255))}</b> infrared photons. Same energy, many more pieces: entropy going up, one fusion at a time. Stars are how a smooth young universe runs down, and everything that happens here runs on that. <span class="tag ESTABLISHED">Established</span></p>
      <p class="meta">Model assumption: scene 1 uses published stage times and temperatures for a 25-Sun-mass star (Woosley, Heger & Weaver 2002); the onion isn't to scale. Scene 2's shares are rounded to the nearest 10% after Johnson (2019) and Kobayashi, Karakas & Lugaro (2020); for the Solar System, not computed here. Cosmic-time steps are rounded, and when neutron stars first collided is uncertain. Photon counts use the mean black-body photon energy (2.70 kT). The atom is a picture: electrons drawn as dots on rings, with each shell's real ground-state count; real electrons form clouds, not orbits. <span class="tag ANALOGY">Analogy</span></p>`,
    next: { q: "Earth gets sunlight and sends out infrared. So what does it actually take from the Sun?", href: "#energy", label: "Voyages · Earth's energy budget" },
    sources: "S. E. Woosley, A. Heger & T. A. Weaver, Rev. Mod. Phys. 74, 1015 (2002); J. A. Johnson, Science 363, 474 (2019); C. Kobayashi, A. I. Karakas & M. Lugaro, ApJ 900, 179 (2020); B. P. Abbott et al., Phys. Rev. Lett. 119, 161101 (2017); E. M. Burbidge et al., Rev. Mod. Phys. 29, 547 (1957); A. I. Karakas & J. C. Lattanzio, PASA 31, e030 (2014); G. Laughlin, P. Bodenheimer & F. C. Adams, ApJ 482, 420 (1997)."
  });
})();
