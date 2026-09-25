/* Chronoscope — Stars forge the elements (D-043), Cosmos.
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
    g.label("outer layers: hydrogen", A.x + 14, A.y + A.h - 14, C.muted, 10);

    g.panel(B.x, B.y, B.w, B.h, "The countdown: each stage far shorter than the last");
    const x0 = B.x + 14, bw = B.w - 28, lmax = Math.log10(6.7e6 * YR), row = Math.min(40, (B.h - 150) / 7);
    let y = B.y + 48;
    STAGES.concat([{ f: "Core collapse", a: "", yr: 0.5 / YR, col: "#ffffff" }]).forEach((s, k) => {
      const on = k === i, len = Math.max(0.02, Math.log10(s.yr * YR) / lmax);
      g.label(`${s.f}${s.a ? " → " + s.a : ""}`, x0, y, on ? C.text : C.muted, 11, "left", "Inter, system-ui, sans-serif");
      g.label(dur(s.yr).replace("0.5 seconds", "under a second"), x0 + bw, y, on ? s.col : C.muted, 11, "right");
      g.bar(x0, y + 5, bw * len, 6, 1, g.alpha(s.col, on ? 1 : 0.35)); y += row;
    });
    y += 6;
    if (!done) {
      const s = STAGES[i];
      y += g.wrap(`Now: ${s.f.toLowerCase()} burning at about ${s.T < 0.1 ? Math.round(s.T * 1000) + " million" : s.T.toFixed(1) + " billion"} degrees, making ${s.a.toLowerCase()}. It lasts ${dur(s.yr)}${i ? ` — about ${Math.round(STAGES[i - 1].yr / s.yr).toLocaleString("en-AU")} times shorter than the stage before` : ""}.`, x0, y, bw, 15, C.text, 12) + 6;
    } else y += g.wrap("Iron is where fusion stops paying: fusing it takes energy instead of giving it. With nothing left to hold it up, the core collapses and the star explodes, scattering everything it made.", x0, y, bw, 15, C.text, 12) + 6;
    g.label("Model: published stage times for a 25-Sun-mass star.", x0, B.y + B.h - 14, C.muted, 10);
  }

  /* ---------- WORK IN PROGRESS (2026-09-25) — not yet loaded by index.html ----------
     Still to write: scene 2 (periodic table of origins: element data 1–92, origin shares, cosmic-time steps,
     click-an-element detail), Chrono.lab.register({ id: "stars", … }) with predict, controls, tick, aside,
     then wiring (nav Cosmos, home SCALES, arrow thread, guides, stick, concepts KEY, story panel links).
     Plan and data sources: todo.md → "Stars forge the elements". */
  void drawStar; void ST;
})();
