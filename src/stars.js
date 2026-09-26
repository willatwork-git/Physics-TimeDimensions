/* Chronoscope — Stars forge the elements (D-048, reworked D-054), Cosmos. A star is an engine, not a light bulb:
   fuel goes in, light and new elements come out. Mode "One star": pick a star's mass and play its life — the core
   burns stage after stage (published stage times: Woosley, Heger & Weaver 2002), each stage's products fly to their
   tiles on the periodic table, and the star ends as a white dwarf or explodes, scattering what it made. How far the
   engine runs depends on mass. Mode "Generations": cosmic time, stars living and dying, the table filling in by
   source (rounded shares after Johnson 2019 and Kobayashi, Karakas & Lugaro 2020). The moving pictures are
   pictures (ANALOGY); which star makes what, and every share, is data. */
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
  const has = (el, on) => Object.keys(el.sh).some(s => on.includes(s));
  const main = el => Object.keys(el.sh).sort((a, b) => el.sh[b] - el.sh[a])[0];

  const STORY = {
    H: "Made in the first few minutes. Nearly every hydrogen atom in you is about 13.8 billion years old.",
    He: "Mostly from the first few minutes; stars have added a little since. Found in the Sun's light (1868) before anyone found it on Earth.",
    Li: "Old stars show about three times less than the Big Bang should have made: the lithium problem, still unsolved.",
    C: "Built from helium in ageing stars. About half was puffed out gently by giant stars, half blown out by exploding ones.",
    O: "Mostly from massive stars, scattered when they explode. By mass, the most common element in you.",
    Fe: "Where fusion stops paying. Most came from exploding white dwarfs, the rest from massive stars. The iron in your blood is older than the Sun.",
    Au: "No star can make it by burning. Most came from colliding neutron stars — in 2017 one was seen in gravitational waves and in light — and rare kinds of collapsing star may have made some too.",
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
  /* ---------- a star's life, as an engine: fuel in, light and new elements out ---------- */
  /* Which burning stage first makes each element (rounded; stages as in STAGES): helium from hydrogen; carbon, nitrogen
     and oxygen from helium; neon to aluminium from carbon; silicon to calcium from oxygen; the iron group from silicon. */
  const stageOf = z => z === 2 ? 0 : z <= 8 ? 1 : z <= 13 ? 2 : z <= 20 ? 4 : 5;
  const STAGE_COL = ["#8fd3ff", "#ffd35a", "#ffb347", "#ff7a59", "#e36bd0", "#9b8cff"];   // ash colour of each stage: its shell and its tiles
  const lifeOf = star => {                                                          // stages this star burns, and how it ends
    const n = star.m < 0.5 ? 1 : star.m < 8 ? 2 : star.m < 10 ? 3 : 6;
    return { n, end: star.m < 0.5 ? "none" : star.m < 10 ? "dwarf" : "boom", secs: star.m < 0.5 ? 5 : star.m < 2 ? 3.2 : star.m < 10 ? 2.4 : 1.4 };   // bigger stars play faster: they live faster
  };
  const BODY = { 8: 65, 6: 18, 1: 10, 7: 3, 20: 1.5, 15: 1, 19: 0.4, 16: 0.3, 11: 0.2, 17: 0.2, 12: 0.1, 26: 0.01 };   // % of a human body's mass
  Object.assign(ST, { mode: "star", star: 2, p: 0, play: false, lit: {}, fly: [], nuc: [], light: [], burst: [], sky: [], you: false, pulse: {}, geo: null, hp: 0, lit2: 1 });
  delete ST.scene;
  const heaviest = () => Math.max(1, ...Object.keys(ST.lit).map(Number));
  function resetLife() { Object.assign(ST, { p: 0, lit: { 1: 1 }, fly: [], burst: [], pulse: {} }); seedCore(0); }
  function seedCore(i) { ST.nuc = Array.from({ length: 12 }, () => ({ a: Math.random() * TAU, r: Math.random(), c: i, w: 0.6 + Math.random() })); }
  const tileOf = z => ST.tiles.find(t => t.z === z);
  function launch(z, from, col, delay = 0) {                                       // an element flies from the star to its tile
    const t = tileOf(z); if (!t || !from) return;
    ST.fly.push({ z, x0: from[0], y0: from[1], x1: t.x + t.w / 2, y1: t.y + t.w / 2, t: -delay, col });
  }

  /* ---------- the stage: one star (left) and the table it fills (right) ---------- */
  function drawEngine(g, A) {
    const { ctx } = g, star = STARS[ST.star], L = lifeOf(star), i = Math.min(L.n - 1, Math.floor(ST.p)), dying = ST.p >= L.n, d = dying ? Math.min(1, ST.p - L.n) : 0;
    g.panel(A.x, A.y, A.w, A.h, `The engine · ${star.n}, ${star.k}`);
    const cx = A.x + A.w / 2, cy = A.y + A.h * 0.47, R = Math.min(A.w, A.h) * (0.2 + 0.035 * Math.sqrt(star.m)), core = R * 0.34;
    ST.geo = { cx, cy, R };
    if (!dying || L.end === "none") {
      ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y + 26, A.w, A.h - 26); ctx.clip();   // light streaks stay inside the panel, clear of its title
      ST.light.forEach(f => { g.ctx.globalAlpha = Math.max(0, 1 - f.r / 1.9); g.line(cx + Math.cos(f.a) * R * f.r, cy + Math.sin(f.a) * R * f.r, cx + Math.cos(f.a) * R * (f.r + 0.12), cy + Math.sin(f.a) * R * (f.r + 0.12), "#ffe9a8", 2); });
      g.ctx.globalAlpha = 1; ctx.restore();
      ctx.shadowColor = star.col; ctx.shadowBlur = 30; g.dot(cx, cy, R, g.alpha(star.col, 0.28)); ctx.shadowBlur = 0;   // the envelope: still mostly hydrogen
      for (let k = Math.floor(Math.min(ST.p, L.n)); k >= 1; k--) g.dot(cx, cy, core + (R - core) * 0.62 * (k / Math.max(2, L.n)), g.alpha(STAGE_COL[k - 1], 0.5));   // one shell of ash per finished stage
      ctx.shadowColor = STAGE_COL[i]; ctx.shadowBlur = 20; g.dot(cx, cy, core, "#fff3c4"); ctx.shadowBlur = 0;
      const fuel = i ? STAGE_COL[i - 1] : "#cfe3ff";                                  // this stage burns the last one's ash; a flash makes this stage's
      ST.nuc.forEach(n => { const r = core * 0.82 * Math.sqrt(n.r); if (n.big > 0) { ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 12; } g.dot(cx + Math.cos(n.a) * r, cy + Math.sin(n.a) * r, n.big > 0 ? 4.5 : 3, n.big > 0 ? STAGE_COL[i] : fuel); ctx.shadowBlur = 0; });
      g.label(L.end === "none" && ST.p >= 0.95 ? "still burning: no red dwarf has finished yet" : `burning ${STAGES[i].f.toLowerCase()} → making ${STAGES[i].a.toLowerCase()}${star.m === 25 ? ` · lasts ${dur(STAGES[i].yr)}` : ""}`, cx, cy + R + 24, STAGE_COL[i], 11, "center");
    } else if (L.end === "dwarf") {                                                  // outer layers drift away; a white dwarf is left
      g.ring(cx, cy, R * (1 + d * 1.4), g.alpha(star.col, 0.5 * (1 - d)), 3);
      g.ring(cx, cy, R * (0.8 + d * 1.1), g.alpha("#4fd1a5", 0.4 * (1 - d)), 2);
      ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 16; g.dot(cx, cy, Math.max(4, core * (1 - d * 0.7)), "#ffffff"); ctx.shadowBlur = 0;
      g.label("the outer layers drift off · a white dwarf is left", cx, cy + R + 24, C.text, 11, "center");
    } else {                                                                         // the core collapses, the star explodes
      ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 60 * (1 - d); g.dot(cx, cy, R * (0.3 + d * 0.9), g.alpha("#ffffff", 0.9 * (1 - d))); ctx.shadowBlur = 0;
      g.dot(cx, cy, 3, "#cfe3ff");
      g.label(`it explodes · ${star.end.replace("an explosion that ", "")}`, cx, cy + R + 24, C.text, 11, "center");
    }
    g.label("a picture, not to scale", A.x + 14, A.y + A.h - 14, C.muted, 10);
  }
  function drawSky(g, A) {
    const on = TIMES[ST.step].on;
    g.panel(A.x, A.y, A.w, A.h, `Generations of stars · ${TIMES[ST.step].t.split(":")[0]}`);
    ST.geo = { x: A.x, y: A.y, w: A.w, h: A.h };
    if (ST.step === 0) { const cx = A.x + A.w / 2, cy = A.y + A.h / 2, q = 0.5 + 0.5 * Math.sin(ST.clock * 2);
      g.ctx.shadowColor = "#8fd3ff"; g.ctx.shadowBlur = 40; g.dot(cx, cy, 18 + 6 * q, g.alpha("#cfe3ff", 0.6)); g.ctx.shadowBlur = 0;
      g.label("no stars yet: only what the Big Bang made", cx, cy + 50, C.muted, 11, "center"); }
    FIELD.forEach(([u, v, b]) => g.dot(A.x + 12 + u * (A.w - 24), A.y + 34 + v * (A.h - 110), 1, g.alpha("#cfe3ff", 0.12 + 0.18 * b * (0.6 + 0.4 * Math.sin(ST.clock * 1.3 + u * 40)))));   // the sky
    ST.sky.forEach(s => { const age = s.t / s.life, x = A.x + 20 + s.x * (A.w - 40), y = A.y + 40 + s.y * (A.h - 120);
      if (age < 1) { g.ctx.shadowColor = s.col; g.ctx.shadowBlur = 14; g.dot(x, y, s.r * (0.5 + 0.5 * Math.min(1, age * 4)) * (1 + 0.12 * Math.sin(ST.clock * 5 + s.x * 20)), s.col); g.ctx.shadowBlur = 0; }
      else { const q = Math.min(1, (age - 1) * 2.5); g.ctx.shadowColor = s.col; g.ctx.shadowBlur = 20 * (1 - q); g.dot(x, y, s.r * 1.6 * (1 - q), "#ffffff"); g.ctx.shadowBlur = 0; g.ring(x, y, s.r + q * 30, g.alpha(s.col, 1 - q), 2.5); } });
    if (ST.step === 4) {                                                              // the Sun forms, out of what earlier stars made
      const sx = A.x + A.w / 2, sy = A.y + A.h * 0.42, q = 0.5 + 0.5 * Math.sin(ST.clock * 1.5);
      for (let k = 0; k < 3; k++) g.ring(sx, sy, 14 + k * 9 + q * 2, g.alpha("#ffd35a", 0.35 - k * 0.1), 1.5);
      g.ctx.shadowColor = "#ffd35a"; g.ctx.shadowBlur = 22; g.dot(sx, sy, 8, "#fff3c4"); g.ctx.shadowBlur = 0;
      g.ctx.fillStyle = g.alpha("#12151d", 0.85); g.ctx.fillRect(A.x + 8, sy + 34, A.w - 16, 60);   // a backing, so drifting stars don't cross the words
      g.wrap("The Sun and Earth form from gas that earlier stars enriched. By now a 25-Sun star could have lived and died more than a thousand times over.", A.x + 16, sy + 50, A.w - 32, 15, C.text, 12);
    }
    if (ST.step > 0) {                                                                // key: each kind of star, in its tile colour
      const keys = [["m", "big stars explode"], ["g", "giant stars puff out"], ["w", "white dwarfs explode"], ["n", "neutron stars collide"]].filter(([k]) => on.includes(k));
      keys.forEach(([k, n], j) => { const kx = A.x + 14 + (j % 2) * (A.w - 28) / 2, ky = A.y + A.h - 44 + Math.floor(j / 2) * 16; g.dot(kx + 4, ky - 4, 4, SKY_COL[k]); g.label(n, kx + 14, ky, C.muted, 10, "left", "Inter, system-ui, sans-serif"); });
      g.label("dying stars scatter what they made", A.x + 14, A.y + A.h - 10 + (keys.length > 2 ? 4 : -12), C.muted, 10);
    }
  }
  function drawTable(g, B) {
    const star = STARS[ST.star], hist = ST.mode === "history", on = TIMES[ST.step].on, was = TIMES[ST.from].on;
    g.panel(B.x, B.y, B.w, B.h, ST.you ? "What you are made of" : hist ? "What had been made by then" : `What ${star.n === "1 Sun" ? "our Sun" : "this star"} makes`);
    const s = Math.max(12, Math.min((B.w - 24) / 18, (B.h - 190) / 9.6)), x0 = B.x + (B.w - s * 18) / 2, y0 = B.y + 34;
    ST.tiles = [];
    EL.forEach(el => {
      const [r, c] = cell(el.z), x = x0 + c * s, y = y0 + r * s, w = s - 2, ctx = g.ctx;
      let fill = null, a = 1;
      if (ST.you) { fill = BODY[el.z] ? SRC[main(el)].col : null; }
      else if (hist) { if (has(el, on)) { fill = SRC[Object.keys(el.sh).filter(k => on.includes(k)).sort((a, b) => el.sh[b] - el.sh[a])[0]].col; /* the biggest source active by then */ a = Object.keys(el.sh).some(k => on.includes(k) && !was.includes(k)) ? ST.lit2 : 1; } }
      else if (ST.lit[el.z]) fill = el.z === 1 ? "#3a6ea5" : STAGE_COL[stageOf(el.z)];
      ctx.fillStyle = "#1b2030"; ctx.fillRect(x, y, w, w);
      if (fill) { const pu = ST.pulse[el.z] || 0; ctx.globalAlpha = a; if (pu > 0) { ctx.shadowColor = fill; ctx.shadowBlur = 18 * pu; } ctx.fillStyle = fill; ctx.fillRect(x, y, w, w); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
      if (el.z === ST.sel && !ST.you) { ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.strokeRect(x - 1, y - 1, w + 2, w + 2); ctx.lineWidth = 1; }
      g.label(el.sym, x + w / 2, y + w * 0.66, fill ? "#0d1017" : g.alpha(C.muted, 0.7), Math.max(8, Math.floor(s * 0.42)), "center", "Inter, system-ui, sans-serif");
      ST.tiles.push({ z: el.z, x, y, w });
    });
    let y = y0 + 9.6 * s + 16; const bx = B.x + 14, bw = B.w - 28;
    if (ST.you) {
      y += g.wrap("By mass you are about 65% oxygen, 18% carbon, 10% hydrogen, 3% nitrogen, then calcium, phosphorus and a pinch of the rest. The hydrogen is from the Big Bang. Nearly everything else was made in stars.", bx, y, bw, 16, C.text, 13);
      const by = {}; let tot = 0;                                                     // your mass, by where it was made: body share × each element's source shares
      Object.entries(BODY).forEach(([z, pc]) => Object.entries(EL[z - 1].sh).forEach(([k, f]) => { by[k] = (by[k] || 0) + pc * f; tot += pc * f; }));
      y += 14; g.label("YOUR MASS, BY WHERE IT WAS MADE", bx, y, C.muted, 10); y += 8;
      let xx = bx; const order = Object.keys(by).sort((a, b) => by[b] - by[a]);
      order.forEach(k => { const w = bw * by[k] / tot; g.ctx.fillStyle = SRC[k].col; g.ctx.fillRect(xx, y, Math.max(1, w - 1), 14); xx += w; });
      y += 30; y += g.wrap(order.filter(k => by[k] / tot >= 0.02).map(k => `${Math.round(by[k] / tot * 100)}% ${SRC[k].n.toLowerCase()}`).join(" · "), bx, y, bw, 15, C.muted, 11);
    } else {
      const el = EL[ST.sel - 1]; g.text(`${el.name} (${el.z})`, bx, y, C.text, 14); y += 10;
      let xx = bx; Object.keys(el.sh).forEach(k => { const w = bw * el.sh[k]; g.ctx.fillStyle = SRC[k].col; g.ctx.fillRect(xx, y, Math.max(1, w - 1), 8); xx += w; });   // where it came from, share by share
      y += 22; y += g.wrap(Object.keys(el.sh).map(k => `${Math.round(el.sh[k] * 100)}% ${SRC[k].n.toLowerCase()}`).join(" · "), bx, y, bw, 15, C.muted, 11) + 4;
      if (STORY[el.sym] && y < B.y + B.h - 40) g.wrap(STORY[el.sym], bx, y + 4, bw, 15, C.text, 12);
    }
    g.label(ST.you ? "Tap an element for its story" : "Tap an element · shares rounded, not computed here", B.x + 14, B.y + B.h - 14, C.muted, 10);
  }
  function drawFlights(g) {
    ST.fly.forEach(f => { if (f.t < 0 || f.t > 1) return; const e = f.t * f.t * (3 - 2 * f.t), x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e - Math.sin(Math.PI * e) * 40;
      g.ctx.shadowColor = f.col; g.ctx.shadowBlur = 12; g.dot(x, y, 4, f.col); g.ctx.shadowBlur = 0; });
    ST.burst.forEach(b => { if (b.t > 1) return; const { cx, cy, R } = ST.geo || {}; if (!cx) return;
      g.dot(cx + Math.cos(b.a) * R * (0.3 + b.t * b.v), cy + Math.sin(b.a) * R * (0.3 + b.t * b.v), 2.5, g.alpha(b.col, 1 - b.t)); });
  }

  /* ---------- time passing ---------- */
  function tickStar(dt) {
    const star = STARS[ST.star], L = lifeOf(star), before = ST.p;
    ST.nuc.forEach(n => { n.big = (n.big || 0) - dt; n.a += dt * n.w * 0.8; n.r = Math.min(1, Math.max(0.05, n.r + (Math.random() - 0.5) * dt)); });
    if (ST.p < L.n) {                                                              // fusion: now and then two nuclei merge into a bigger one
      if (Math.random() < dt * 3) { ST.nuc[Math.floor(Math.random() * ST.nuc.length)].big = 0.25; }
      if (Math.random() < dt * 14) ST.light.push({ a: Math.random() * TAU, r: 1 });   // and light leaves the surface
    }
    ST.light.forEach(f => f.r += dt * 0.9); ST.light = ST.light.filter(f => f.r < 1.9);
    if (ST.play) {
      ST.p = Math.min(L.end === "none" ? 0.96 : L.n + 1, ST.p + dt / L.secs);
      if (ST.p >= (L.end === "none" ? 0.96 : L.n + 1)) { ST.play = false; Chrono.lab.rebuild(); }
    }
    const g = ST.geo; if (!g || !g.cx) return;
    for (let j = 0; j < L.n; j++) if (before < j + 0.5 && ST.p >= j + 0.5)           // halfway through a stage, what it makes flies to the table
      star.z.filter(z => stageOf(z) === j && !ST.lit[z]).forEach((z, n) => launch(z, [g.cx, g.cy], STAGE_COL[j], n * 0.12));
    for (let k = Math.floor(before) + 1; k <= Math.floor(ST.p) && k < L.n; k++) seedCore(k);   // the next stage burns this one's ash
    if (before < L.n && ST.p >= L.n && L.end === "boom") {                          // the explosion scatters everything
      for (let k = 0; k < 90; k++) ST.burst.push({ a: Math.random() * TAU, v: 1 + Math.random() * 2.2, t: 0, col: STAGE_COL[k % 6] });
      Object.keys(ST.lit).forEach(z => ST.pulse[z] = 1.5);
    }
    if (before < L.n && ST.p >= L.n && L.end === "dwarf") [6, 7].forEach(z => ST.lit[z] && (ST.pulse[z] = 1.2));   // the drifting layers carry carbon and nitrogen out
  }
  const SKY_COL = { m: "#ff7a59", w: "#f2c94c", g: "#9b8cff", n: "#e36bd0" };     // the same colours as their sources in the table
  const FIELD = Array.from({ length: 70 }, (_, k) => [(k * 0.618034) % 1, (k * 0.381966 * 3.7) % 1, (k * 0.271) % 1]);   // faint background stars
  function tickSky(dt) {
    const on = TIMES[ST.step].on, types = Object.keys(SKY_COL).filter(k => on.includes(k));
    if (ST.step > 0 && types.length && Math.random() < dt * 4.5 && ST.sky.length < 40) {
      const k = types[Math.floor(Math.random() * types.length)];
      ST.sky.push({ x: Math.random(), y: Math.random(), r: k === "m" ? 6.5 : 4.5, life: 1.2 + Math.random() * 2.5, t: 0, k, col: SKY_COL[k] });
    }
    ST.sky.forEach(s => { const was = s.t < s.life; s.t += dt;
      if (was && s.t >= s.life && ST.geo && ST.geo.w) {                             // it dies: something it made flies to the table
        const pick = EL.filter(e => e.sh[s.k] >= 0.3); const e = pick[Math.floor(Math.random() * pick.length)];
        if (e) launch(e.z, [ST.geo.x + 20 + s.x * (ST.geo.w - 40), ST.geo.y + 40 + s.y * (ST.geo.h - 120)], s.col);
      } });
    ST.sky = ST.sky.filter(s => s.t < s.life + 0.4);
    if (ST.play) { ST.hp += dt; if (ST.hp > 2.6) { ST.hp = 0; if (ST.step < TIMES.length - 1) { ST.from = ST.step; ST.step++; ST.lit2 = 0; const r = $("#st-t"), o = $("#st-to"); if (r) r.value = ST.step; if (o) o.textContent = TIMES[ST.step].t.split(":")[0]; } else { ST.play = false; Chrono.lab.rebuild(); } } }
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
      setup() { Object.assign(ST, { mode: "star", star: 6, play: false, you: false }); resetLife(); } },
    applySetup(o) {
      Object.assign(ST, o);
      if (ST.mode === "star" && (o.star !== undefined || o.p !== undefined)) {        // jump into a life: what earlier stages made is already on the table
        const p = o.p || 0, star = STARS[ST.star]; resetLife(); ST.p = p; ST.play = !!o.play;
        star.z.filter(z => stageOf(z) + 0.5 <= p).forEach(z => ST.lit[z] = 1);   // everything whose stage has passed its midpoint (when its products fly) seedCore(Math.min(lifeOf(star).n - 1, Math.floor(p)));
      }
      if (o.step !== undefined) { ST.from = ST.step; ST.lit2 = 1; }
    },
    state() { const star = STARS[ST.star], L = lifeOf(star);
      const by = {}; let tot = 0; Object.entries(BODY).forEach(([z, pc]) => Object.entries(EL[z - 1].sh).forEach(([k, f]) => { by[k] = (by[k] || 0) + pc * f; tot += pc * f; }));
      return { mode: ST.mode, mass: star.m, stage: Math.min(L.n - 1, Math.floor(ST.p)), ended: L.end !== "none" && ST.p >= L.n + 1, step: ST.step, sel: ST.sel, you: ST.you, bodyStars: 1 - (by.b || 0) / tot }; },   // read-only, for missions
    readouts() {
      if (ST.you) return [["Made in stars", "about 90% of you"], ["From the Big Bang", "the hydrogen, about 10%"]];
      if (ST.mode === "star") { const star = STARS[ST.star]; return [["Star", star.n], ["Lives", star.life.replace("about ", "")], ["Heaviest made so far", EL[heaviest() - 1].name]]; }
      const on = TIMES[ST.step].on, el = EL[ST.sel - 1];
      return [["Cosmic time", TIMES[ST.step].t.split(":")[0]], ["Elements made so far", `${EL.filter(e => has(e, on)).length} of 92`], [`${el.name}, mostly from`, SRC[main(el)].s]];
    },
    controls() {
      const star = STARS[ST.star], L = lifeOf(star), over = ST.mode === "star" ? ST.p >= (L.end === "none" ? 0.96 : L.n + 1) : ST.step >= TIMES.length - 1;
      const modes = [["star", "One star"], ["history", "Generations"]].map(([id, n]) => `<button class="btn ${ST.mode === id && !ST.you ? "primary" : ""}" data-st="${id}">${n}</button>`).join("");
      const main = ST.mode === "star"
        ? `<label class="ctl">Star mass <input type="range" id="st-m" min="1" max="6" step="1" value="${ST.star}"><output id="st-mo">${star.n}</output></label>`
        : `<label class="ctl">Cosmic time <input type="range" id="st-t" min="0" max="5" step="1" value="${ST.step}"><output id="st-to">${TIMES[ST.step].t.split(":")[0]}</output></label>`;
      return modes + main + `<button class="btn" id="st-play">${ST.play ? "❚❚ Pause" : over ? "↺ Again" : ST.mode === "star" ? "▶ Play its life" : "▶ Play history"}</button>
        <button class="btn ${ST.you ? "primary" : ""}" id="st-you">${ST.you ? "Back to the stars" : "What am I made of?"}</button>`;
    },
    wire() {
      document.querySelectorAll("[data-st]").forEach(b => b.onclick = () => { ST.mode = b.dataset.st; ST.play = false; ST.you = false; if (ST.mode === "star") resetLife(); Chrono.lab.rebuild(); });
      const m = $("#st-m"); if (m) m.oninput = e => { ST.star = +e.target.value; ST.play = false; resetLife(); $("#st-mo").textContent = STARS[ST.star].n; const p = $("#st-play"); if (p) p.textContent = "▶ Play its life"; };
      const t = $("#st-t"); if (t) t.oninput = e => { const v = +e.target.value; if (v !== ST.step) { ST.from = ST.step; ST.lit2 = 0; } ST.step = v; ST.play = false; $("#st-to").textContent = TIMES[v].t.split(":")[0]; };
      $("#st-play").onclick = () => {
        const star = STARS[ST.star], L = lifeOf(star);
        if (!ST.play && ST.mode === "star" && ST.p >= (L.end === "none" ? 0.96 : L.n + 1)) resetLife();
        if (!ST.play && ST.mode === "history" && ST.step >= TIMES.length - 1) { ST.from = 0; ST.step = 0; ST.sky = []; ST.hp = 0; }
        ST.play = !ST.play; ST.you = false; Chrono.lab.rebuild();
      };
      $("#st-you").onclick = () => { ST.you = !ST.you; if (ST.you) { ST.mode = "history"; ST.from = ST.step; ST.step = 5; ST.play = false; } Chrono.lab.rebuild(); };
    },
    enter() { if (!ST.nuc.length) resetLife(); },
    tick(dt) {
      ST.clock += dt; ST.lit2 = Math.min(1, ST.lit2 + dt / 0.7);
      Object.keys(ST.pulse).forEach(z => { ST.pulse[z] -= dt; if (ST.pulse[z] <= 0) delete ST.pulse[z]; });
      ST.fly.forEach(f => { const was = f.t; f.t += dt / 0.9; if (was < 1 && f.t >= 1) { if (ST.mode === "star") ST.lit[f.z] = 1; ST.pulse[f.z] = 1; } });
      ST.fly = ST.fly.filter(f => f.t < 1.05);
      ST.burst.forEach(b => b.t += dt / 1.6); ST.burst = ST.burst.filter(b => b.t < 1);
      if (ST.mode === "star") tickStar(dt); else tickSky(dt);
    },
    pointer(type, x, y) {
      if (type !== "pointerdown") return;
      const t = ST.tiles.find(q => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.w); if (!t) return;
      ST.sel = t.z; if (ST.you) { ST.you = false; Chrono.lab.rebuild(); }
    },
    draw(g) {
      const { A, B, stacked } = g.split(0.42);
      if (stacked) { const need = (B.w - 24) / 18 * 9.6 + 190, d = need - B.h; if (d > 0) { const k = Math.min(d, A.h - 200); A.h -= k; B.y -= k; B.h += k; } }   // phones: the table gets the height it needs
      if (ST.mode === "star" && !ST.you) drawEngine(g, A); else drawSky(g, A);
      drawTable(g, B); drawFlights(g);
    },
    aside: () => `
      <p>A star isn't a light bulb. It's an engine: hydrogen goes in, and out come light and <b>new elements</b>. The Big Bang left hydrogen, helium and a trace of lithium. Nearly everything else, from the carbon in you to the iron in your blood, was made inside stars, which then died and scattered it for the next stars. <span class="tag ESTABLISHED">Established</span></p>
      <p><b>Stars change as they age.</b> A big star burns its fuel in stages, each hotter and far shorter than the last: millions of years of hydrogen, then days of silicon. The ash of one stage is the fuel of the next. It stops at iron, because fusing iron takes energy instead of giving it. The core collapses and the star explodes. <span class="tag ESTABLISHED">Established</span></p>
      <p><b>Size decides what it can make.</b> A star like the Sun stops at carbon and oxygen and ends as a white dwarf, with most of what it made locked inside. Only stars of about ten Suns or more reach iron, and their explosions scatter everything. Bigger stars also live faster: millions of years, against the Sun's ten billion. <span class="tag ESTABLISHED">Established</span> (the exact dividing line, 8–10 Suns, <span class="tag CONTESTED">Contested</span>)</p>
      <p><b>Heavier than iron.</b> Those come two ways: slowly, inside ageing giant stars, and quickly, when neutron stars collide. In 2017 a collision was seen both in gravitational waves and in light, glowing with new heavy elements. How the fast share splits between collisions and rare kinds of exploding star is still argued over. <span class="tag CONTESTED">Contested</span></p>
      <p><b>What you're made of.</b> By mass you're about 65% oxygen, 18% carbon and 10% hydrogen, then nitrogen, calcium and phosphorus. The hydrogen is from the Big Bang; nearly all the rest was made in stars. Press <b>What am I made of?</b> <span class="tag ESTABLISHED">Established</span></p>
      <p><b>What this has to do with time.</b> Every fusion in the Sun makes a helium nucleus, and its energy leaves the Sun as about <b>${mil(photons(5772))}</b> photons of sunlight. Earth sends that same energy out again as about <b>${mil(photons(255))}</b> infrared photons. Same energy, many more pieces: entropy going up, one fusion at a time. Stars are how a smooth young universe runs down, and everything that happens here runs on that. <span class="tag ESTABLISHED">Established</span></p>
      <p class="meta">Model assumption: the moving pictures — nuclei merging, elements flying to the table, the star's size — are pictures, not to scale <span class="tag ANALOGY">Analogy</span>. Which stage makes which element is rounded; stage times are for a 25-Sun star (Woosley, Heger & Weaver 2002); the lifetimes and mass thresholds are rounded from stellar models. The table's shares are rounded to the nearest 10% after Johnson (2019) and Kobayashi, Karakas & Lugaro (2020), for the Solar System; not computed here. Cosmic-time steps are rounded, and when neutron stars first collided is uncertain. Body composition after Emsley (2011). Photon counts use the mean black-body photon energy (2.70 kT).</p>`,
    next: { q: "Earth gets sunlight and sends out infrared. So what does it actually take from the Sun?", href: "#energy", label: "Voyages · Earth's energy budget" },
    sources: "S. E. Woosley, A. Heger & T. A. Weaver, Rev. Mod. Phys. 74, 1015 (2002); J. A. Johnson, Science 363, 474 (2019); C. Kobayashi, A. I. Karakas & M. Lugaro, ApJ 900, 179 (2020); B. P. Abbott et al., Phys. Rev. Lett. 119, 161101 (2017); E. M. Burbidge et al., Rev. Mod. Phys. 29, 547 (1957); A. I. Karakas & J. C. Lattanzio, PASA 31, e030 (2014); G. Laughlin, P. Bodenheimer & F. C. Adams, ApJ 482, 420 (1997); J. Emsley, Nature's Building Blocks, 2nd ed., OUP (2011)."
  });
})();
