/* Chronoscope — Cosmos: the universe as a whole. Expanding universe · Cosmic horizons · Boot a Universe · Janus point.
   Cosmology: Friedmann equations for a homogeneous universe (matter, radiation, dark energy, curvature).
   Time unit inside the solver: 1/H0; converted to billions of years with 977.8 / H0 (km/s/Mpc). */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;
  const OR = 9.1e-5;   // radiation (photons + neutrinos) today

  /* ---------- shared solver ---------- */
  const E2 = (a, m, l) => OR / a ** 4 + m / a ** 3 + (1 - m - l - OR) / a ** 2 + l;
  /* a(t) from the acceleration equation  a'' = −OR/a³ − (Ωm/2)/a² + ΩΛ·a  (H0 = 1), starting deep in the
     radiation era. Handles recollapse and universes that never reach today's size. */
  function solve(m, l) {
    let a = 1e-4, v = a * Math.sqrt(E2(a, m, l)), t = a * a / (2 * Math.sqrt(OR));
    const acc = a => -OR / a ** 3 - m / (2 * a * a) + l * a, pts = [[t, a]];
    let t0 = null, fate = "expands forever", amax = a;
    for (let i = 0; i < 200000; i++) {
      const h = Math.min(0.004, 0.02 * a / Math.max(Math.abs(v), 1e-9));
      const k1v = acc(a), k1a = v, k2v = acc(a + h / 2 * k1a), k2a = v + h / 2 * k1v, k3v = acc(a + h / 2 * k2a), k3a = v + h / 2 * k2v, k4v = acc(a + h * k3a), k4a = v + h * k3v;
      const na = a + h / 6 * (k1a + 2 * k2a + 2 * k3a + k4a), nv = v + h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
      if (t0 === null && a < 1 && na >= 1 && nv > 0) t0 = t + h * (1 - a) / (na - a);
      a = na; v = nv; t += h; amax = Math.max(amax, a);
      if (i % 4 === 0) pts.push([t, a]);
      if (a < 1e-4 && v < 0) { fate = "recollapses (a Big Crunch)"; pts.push([t, a]); break; }
      if (a > 12 || t > 4.5) break;
    }
    if (fate !== "recollapses (a Big Crunch)" && pts[pts.length - 1][1] < amax * 0.98) fate = "recollapses (a Big Crunch)";
    return { pts, t0, fate, tEnd: pts[pts.length - 1][0], amax };
  }
  const aAt = (S, t) => { const p = S.pts; let lo = 0, hi = p.length - 1; if (t <= p[0][0]) return p[0][1] * Math.sqrt(t / p[0][0] || 0); while (hi - lo > 1) { const mid = (lo + hi) >> 1; p[mid][0] < t ? lo = mid : hi = mid; } const f = (t - p[lo][0]) / (p[hi][0] - p[lo][0] || 1); return p[lo][1] + f * (p[hi][1] - p[lo][1]); };
  const Hat = (S, t) => { const d = 1e-4; return (aAt(S, t + d) - aAt(S, t - d)) / (2 * d) / aAt(S, t); };
  const GYR = H0 => 977.8 / H0;

  /* =====================================================================
     EXPANDING UNIVERSE
     ===================================================================== */
  const PRESETS = [
    { id: "ours", n: "Our universe", m: 0.315, l: 0.685 },
    { id: "nolambda", n: "No dark energy", m: 1, l: 0 },
    { id: "heavy", n: "Heavy: recollapses", m: 3, l: 0 },
    { id: "empty", n: "Nearly empty", m: 0.02, l: 0 }
  ];
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const GAL = (() => { const R = rng(11), g = []; for (let i = 0; i < 90; i++) g.push([(R() * 2 - 1) * 1.6, (R() * 2 - 1) * 1.6]); g[0] = [0, 0]; return g; })();
  const EX = { m: 0.315, l: 0.685, H0: 67.4, S: null, t: null, play: true, home: 0, preset: "ours", geo: null };
  const exSolve = () => { EX.S = solve(EX.m, EX.l); if (EX.t === null || EX.t > EX.S.tEnd) EX.t = 0.02; };

  Chrono.lab.register({
    predict: { q: "Almost every distant galaxy is moving away from us — the farther, the faster. Does that put us at the centre of the universe?",
      options: ["Yes — we're at the centre of the expansion", "No — every galaxy sees exactly the same thing", "Nobody knows"], answer: 1,
      explain: "Space itself is stretching, everywhere at once. From <i>any</i> galaxy, the others recede with speed proportional to distance (Hubble's law), so every galaxy looks like the centre and none is. Click any galaxy in the lab to stand on it." },
    id: "expand", title: "Expanding universe", eyebrow: "Cosmos · is everything flying away from us?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    enter() { if (!EX.S) exSolve(); },
    controls() {
      return PRESETS.map(p => `<button class="btn ${EX.preset === p.id ? "primary" : ""}" data-pre="${p.id}">${p.n}</button>`).join("") +
        `<label class="ctl">Matter <input type="range" id="ex-m" min="0" max="300" value="${Math.round(EX.m * 100)}"><output id="ex-mo">${EX.m.toFixed(2)}</output></label>
        <label class="ctl">Dark energy <input type="range" id="ex-l" min="0" max="150" value="${Math.round(EX.l * 100)}"><output id="ex-lo">${EX.l.toFixed(2)}</output></label>
        <button class="btn ${EX.H0 === 67.4 ? "primary" : ""}" data-h0="67.4">H₀ = 67.4</button><button class="btn ${EX.H0 === 73 ? "primary" : ""}" data-h0="73">H₀ = 73</button>
        <button class="btn" id="ex-play">${EX.play ? "Pause" : "Play"}</button><span class="ctl">Click a galaxy to stand on it</span>`;
    },
    wire() {
      document.querySelectorAll("[data-pre]").forEach(b => b.onclick = () => { const p = PRESETS.find(x => x.id === b.dataset.pre); Object.assign(EX, { m: p.m, l: p.l, preset: p.id, t: 0.02, play: true }); exSolve(); Chrono.lab.rebuild(); });
      $("#ex-m").oninput = e => { EX.m = e.target.value / 100; EX.preset = null; $("#ex-mo").textContent = EX.m.toFixed(2); exSolve(); };
      $("#ex-l").oninput = e => { EX.l = e.target.value / 100; EX.preset = null; $("#ex-lo").textContent = EX.l.toFixed(2); exSolve(); };
      document.querySelectorAll("[data-h0]").forEach(b => b.onclick = () => { EX.H0 = +b.dataset.h0; Chrono.lab.rebuild(); });
      $("#ex-play").onclick = () => { EX.play = !EX.play; if (EX.play && EX.t >= EX.S.tEnd - 1e-3) EX.t = 0.02; Chrono.lab.rebuild(); };
    },
    tick(dt) { if (EX.play && EX.S) { EX.t += dt * EX.S.tEnd / 14; if (EX.t >= EX.S.tEnd) { EX.t = EX.S.tEnd; EX.play = false; Chrono.lab.rebuild(); } } },
    pointer(type, x, y) {
      if (type !== "pointerdown" || !EX.geo) return;
      const { cx, cy, k } = EX.geo, h = GAL[EX.home]; let best = null, bd = 16;
      GAL.forEach((p, i) => { const d = Math.hypot(cx + (p[0] - h[0]) * k - x, cy - (p[1] - h[1]) * k - y); if (d < bd) { bd = d; best = i; } });
      if (best !== null) EX.home = best;
    },
    draw(g) {
      const { ctx } = g, S = EX.S, { A, B } = g.split(0.56), a = aAt(S, EX.t), H = Hat(S, EX.t), gy = GYR(EX.H0);
      g.panel(A.x, A.y, A.w, A.h, `Galaxies at ${(EX.t * gy).toFixed(2)} billion years`);
      const cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 8, k = Math.min(A.w, A.h) * 0.3 * a, h = GAL[EX.home];
      EX.geo = { cx, cy, k };
      ctx.save(); ctx.beginPath(); ctx.rect(A.x + 1, A.y + 26, A.w - 2, A.h - 27); ctx.clip();
      GAL.forEach((p, i) => {
        const dx = (p[0] - h[0]) * k, dy = (p[1] - h[1]) * k, x = cx + dx, y = cy - dy;
        if (i !== EX.home) { const s = Math.min(0.3, H * 0.05 / Math.max(a, 0.05)); g.line(x, y, x + dx * s, y - dy * s, g.alpha(C.orange, 0.55), 1); }
        g.dot(x, y, i === EX.home ? 6 : 3, i === EX.home ? C.accent : C.violet);
      });
      ctx.restore();
      g.label("you are here (click any galaxy to move)", cx + 10, cy + 4, C.accent, 10);
      g.label("arrows: recession speed, proportional to distance — from every galaxy", A.x + 14, A.y + A.h - 14, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Size of the universe over time");
      const px = B.x + 40, pw = B.w - 60, py = B.y + 40, ph = Math.max(60, B.h * 0.48), tMax = S.tEnd, aTop = Math.min(S.amax, 12) * 1.05;
      const P = (t, v) => [px + t / tMax * pw, py + ph - v / aTop * ph];
      g.line(px, py + ph, px + pw, py + ph, C.muted); g.line(px, py, px, py + ph, C.muted);
      ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); S.pts.forEach(([t, v], i) => { const q = P(t, v); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); ctx.lineWidth = 1;
      if (S.t0 !== null) { const q = P(S.t0, 1); g.dot(...q, 4, C.accent); g.label("today", q[0] + 6, q[1] - 6, C.accent, 10); }
      const cur = P(EX.t, a); g.line(cur[0], py, cur[0], py + ph, g.alpha(C.pink, 0.6)); g.dot(...cur, 4, C.pink);
      g.label("time →", px + pw, py + ph + 14, C.muted, 9, "right"); g.label("size", px - 34, py + 8, C.muted, 9);
      const x0 = B.x + 14; let y = py + ph + 38;
      if (S.t0 !== null) { g.text(`Age today: ${(S.t0 * gy).toFixed(2)} billion years`, x0, y, C.text, 13); y += 20; }
      else { g.text("This universe never grows to today's size.", x0, y, C.pink, 13); y += 20; }
      g.label(`Future: ${S.fate}.`, x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 18;
      const q = EX.m / 2 - EX.l;
      g.label(`Expansion ${S.t0 !== null ? (q < 0 ? "is speeding up today (dark energy wins)" : "is slowing down today (gravity wins)") : ""}`, x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 22;
      g.label(`At the pink line: expansion rate ${(H * EX.H0).toFixed(1)} km/s per megaparsec.`, x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 16;
      if (S.t0 !== null && EX.t < S.t0) g.label(`Light sent then arrives today stretched ${(1 / a).toFixed(2)}× (redshift z = ${(1 / a - 1).toFixed(2)}).`, x0, y, C.teal, 11, "left", "Inter, sans-serif");
    },
    aside: () => `
      <p>Space itself is stretching. Galaxies aren't flying through space away from a centre — the distances between them grow, everywhere at once.</p>
      <div class="try"><b>Try:</b> click any galaxy to stand on it. The arrows always point away, longer for farther galaxies — <b>Hubble's law</b>, seen from everywhere. Then try the presets: without dark energy expansion slows; with too much matter the universe falls back in a Big Crunch.</div>
      <p><b>Cosmic clocks run slow too.</b> Light crossing expanding space is stretched: its wavelength grows by the same factor as the universe (redshift) — and so does everything carried by it. A supernova at redshift 1 appears to unfold twice as slowly. That's measured (see <a href="#" data-view-link="sure">How sure are we?</a>).</p>
      <p><b>How old is it?</b> That depends on the expansion rate today, called H₀: how fast space stretches, in km/s for every megaparsec (3.26 million light-years). With the best-measured matter and dark energy, <b>13.8 billion years</b> for H₀ = 67.4 — but 12.7 if the expansion rate is 73, as nearby measurements say. That disagreement is the Hubble tension, hole <a href="#" data-hole="H10">H10</a> <span class="tag CONTESTED">Contested</span>.</p>
      <p class="meta">Model assumption: a smooth, uniform universe (Friedmann equations) with matter, radiation, dark energy as a constant, and curvature set by the total. Galaxies' own motions ignored; the galaxy field is a comoving grid. <span class="tag ESTABLISHED">Established</span></p>`,
    next: { q: "If space has been stretching for 13.8 billion years, how far away is the most distant thing we can see?", href: "#horizons", label: "Cosmic horizons" },
    sources: "A. Friedmann (1922); G. Lemaître (1927); E. Hubble (1929); Planck Collaboration, A&A 641, A6 (2020); A. Riess et al. (SH0ES); DES supernova time dilation (2024)."
  });

  /* =====================================================================
     COSMIC HORIZONS — conformal diagram and ordinary-distance diagram (ΛCDM)
     ===================================================================== */
  const HZ = { m: 0.315, l: 0.685, H0: 67.4, view: "conformal", chi: 20, T: null, drag: false, geo: null };
  function hzTables() {
    /* η(a) = ∫ da / (a² E(a)) and t(a) = ∫ da / (a E(a)), on a log grid from a = 1e-8 to a = 1e3 (units 1/H0; c = 1) */
    const N = 4000, la0 = Math.log(1e-8), la1 = Math.log(1e3), A = [], ET = [], TT = [];
    let eta = 1e-8 / Math.sqrt(OR), t = 1e-16 / (2 * Math.sqrt(OR));
    for (let i = 0; i <= N; i++) {
      const la = la0 + (la1 - la0) * i / N, a = Math.exp(la);
      if (i) { const am = Math.exp(la - (la1 - la0) / N / 2), d = (la1 - la0) / N, e = Math.sqrt(E2(am, HZ.m, HZ.l)); eta += d / (am * e); t += d / e; }
      A.push(a); ET.push(eta); TT.push(t);
    }
    const interp = (X, Y, x) => { let lo = 0, hi = X.length - 1; if (x <= X[0]) return Y[0]; if (x >= X[hi]) return Y[hi]; while (hi - lo > 1) { const md = (lo + hi) >> 1; X[md] < x ? lo = md : hi = md; } const f = (x - X[lo]) / (X[hi] - X[lo]); return Y[lo] + f * (Y[hi] - Y[lo]); };
    const gy = GYR(HZ.H0), eta0 = interp(A, ET, 1), etaInf = ET[N], etaLS = interp(A, ET, 1 / 1090);
    return { A, ET, TT, gy, eta0, etaInf, etaLS, aOfEta: e => interp(ET, A, e), tOfEta: e => interp(ET, TT, e), etaOfT: t => interp(TT, ET, t), aOfT: t => interp(TT, A, t), t0: interp(A, TT, 1) };
  }
  Chrono.lab.register({
    predict: { q: "The universe is 13.8 billion years old. How far away — today — is the most distant matter whose light we can see?",
      options: ["13.8 billion light-years", "About 46 billion light-years", "Infinitely far"], answer: 1,
      explain: "While the oldest light was travelling towards us, space kept stretching behind it. The matter that sent it is now about 46 billion light-years away — the edge of the observable universe. And because expansion is accelerating, there's another edge: galaxies beyond about 16 billion light-years today can never receive a signal we send now." },
    id: "horizons", title: "Cosmic horizons", eyebrow: "Cosmos · how far can we ever see?", tier: "mainstream", tags: ["ESTABLISHED"],
    enter() { if (!HZ.T) HZ.T = hzTables(); },
    controls() {
      return `<button class="btn ${HZ.view === "conformal" ? "primary" : ""}" id="hz-conf">Light at 45° (stretched view)</button>
        <button class="btn ${HZ.view === "proper" ? "primary" : ""}" id="hz-prop">Ordinary distance and time</button>
        <label class="ctl">A galaxy, today at <input type="range" id="hz-chi" min="1" max="60" value="${HZ.chi}"><output id="hz-chio">${HZ.chi} billion ly</output></label>`;
    },
    wire() {
      $("#hz-conf").onclick = () => { HZ.view = "conformal"; Chrono.lab.rebuild(); };
      $("#hz-prop").onclick = () => { HZ.view = "proper"; Chrono.lab.rebuild(); };
      $("#hz-chi").oninput = e => { HZ.chi = +e.target.value; $("#hz-chio").textContent = HZ.chi + " billion ly"; };
    },
    pointer(type, x) {
      if (!HZ.geo || HZ.view !== "conformal") return;
      if (type === "pointerdown") HZ.drag = true; if (type === "pointerup") HZ.drag = false;
      if (HZ.drag && (type === "pointermove" || type === "pointerdown")) { HZ.chi = Math.max(1, Math.min(60, Math.round((x - HZ.geo.ox) / HZ.geo.s))); const o = $("#hz-chio"), r = $("#hz-chi"); if (o) o.textContent = HZ.chi + " billion ly"; if (r) r.value = HZ.chi; }
    },
    draw(g) {
      const { ctx } = g, T = HZ.T, gy = T.gy, { A, B } = g.split(0.6);
      const e0 = T.eta0 * gy, eInf = T.etaInf * gy, eLS = T.etaLS * gy, chi = HZ.chi;
      if (HZ.view === "conformal") {
        g.panel(A.x, A.y, A.w, A.h, "Spacetime of the universe, stretched so light runs at 45°");
        const s = Math.min((A.w - 90) / 64, (A.h - 70) / (eInf * 1.02)), ox = A.x + 70, oy = A.y + A.h - 30;
        const P = (x, e) => [ox + x * s, oy - e * s]; HZ.geo = { ox, s };
        [["Big Bang", 0], ["today", e0], ["end of conformal time", eInf]].forEach(([n, e]) => { g.line(...P(0, e), ...P(64, e), n === "today" ? g.alpha(C.accent, 0.7) : C.line, n === "today" ? 1.5 : 1); g.label(n, ...P(64, e).map((v, i) => v + (i ? -5 : 0)), n === "today" ? C.accent : C.muted, 9, "right"); });
        g.line(...P(0, eLS), ...P(64, eLS), g.alpha(C.orange, 0.5)); g.label(A.w < 520 ? "microwave background" : "microwave background released (380,000 years)", ...P(20, eLS).map((v, i) => v + (i ? -14 : 0)), C.orange, 9);
        [10, 20, 30, 40, 50, 60].forEach(x => { g.line(...P(x, 0), ...P(x, eInf), "rgba(255,255,255,0.04)"); g.label(`${x}`, ...P(x, 0).map((v, i) => v + (i ? 14 : 0)), C.muted, 9, "center"); });
        g.label("distance today (billion light-years) →", ...P(64, 0).map((v, i) => v + (i ? 28 : 0)), C.muted, 9, "right");
        ctx.fillStyle = g.alpha(C.accent, 0.07); ctx.beginPath(); ctx.moveTo(...P(0, e0)); ctx.lineTo(...P(e0, 0)); ctx.lineTo(...P(0, 0)); ctx.closePath(); ctx.fill();
        g.line(...P(0, e0), ...P(e0, 0), C.accent, 2); g.label("our past light cone", ...P(e0 * 0.45, e0 * 0.55).map((v, i) => v + (i ? -6 : 8)), C.accent, 10);
        ctx.setLineDash([5, 5]); g.line(...P(0, eInf), ...P(eInf, 0), C.pink, 1.5); ctx.setLineDash([]);
        g.label(A.w < 520 ? "event horizon" : "event horizon: light from beyond it never reaches us", ...P(eInf - e0 + 1, e0 + 1).map((v, i) => v + (i ? -4 : 4)), C.pink, 9);
        g.line(...P(0, 0), ...P(0, eInf), C.accent, 2.5); g.label("us", ...P(0, eInf).map((v, i) => v + (i ? -6 : 8)), C.accent, 10);
        g.line(...P(chi, 0), ...P(chi, eInf), C.violet, 2);
        const eEm = e0 - chi;
        if (eEm > eLS) { g.dot(...P(chi, eEm), 5, C.teal); g.line(...P(chi, eEm), ...P(0, e0), g.alpha(C.teal, 0.7), 1.5); }
        g.label("drag to move the galaxy", ...P(chi, eInf).map((v, i) => v + (i ? 12 : 6)), C.violet, 9);
      } else {
        g.panel(A.x, A.y, A.w, A.h, "The same, in ordinary distance and cosmic time");
        const tMax = 30, dMax = 30, ox = A.x + A.w / 2, s = Math.min((A.w - 60) / (2 * dMax), (A.h - 70) / tMax), oy = A.y + A.h - 30;
        const P = (d, t) => [ox + d * s, oy - t * s];
        g.line(...P(-dMax, 0), ...P(dMax, 0), C.line); g.label("Big Bang", ...P(-dMax, 0).map((v, i) => v + (i ? -5 : 0)), C.muted, 9);
        const t0 = T.t0 * gy; g.line(...P(-dMax, t0), ...P(dMax, t0), g.alpha(C.accent, 0.6)); g.label("today", ...P(-dMax, t0).map((v, i) => v + (i ? -5 : 0)), C.accent, 9);
        g.line(...P(0, 0), ...P(0, tMax), C.accent, 2);
        const curve = (f, col, w, dash) => { [1, -1].forEach(sg => { ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); let on = false;
          for (let i = 1; i <= 300; i++) { const t = i / 300 * tMax, d = f(t); if (d === null || d > dMax) { on = false; continue; } const q = P(sg * d, t); on ? ctx.lineTo(...q) : ctx.moveTo(...q); on = true; } ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; }); };
        [5, 10, 20, 30, 46].forEach(x => curve(t => T.aOfT(t / gy) * x, "rgba(155,140,255,0.25)", 1));
        curve(t => t <= t0 ? T.aOfT(t / gy) * (e0 - T.etaOfT(t / gy) * gy) : null, C.accent, 2.2);
        curve(t => T.aOfT(t / gy) * (eInf - T.etaOfT(t / gy) * gy), C.pink, 1.5, [5, 5]);
        curve(t => { const a = T.aOfT(t / gy); return 977.8 / HZ.H0 / Math.sqrt(E2(a, HZ.m, HZ.l)); }, C.orange, 1, [2, 4]);
        curve(t => T.aOfT(t / gy) * chi, C.violet, 2);
        g.label("our past light cone (the 'teardrop')", ...P(3, t0 * 0.35), C.accent, 10);
        g.label("event horizon", ...P(-dMax + 2, 26), C.pink, 10); g.label("Hubble distance", ...P(-dMax + 2, 23), C.orange, 10);
        g.label("faint lines: galaxies carried apart by expansion", A.x + 14, A.y + A.h - 12, C.muted, 9);
        g.label("time (billion years) ↑", ...P(0, tMax).map((v, i) => v + (i ? 12 : 6)), C.muted, 9);
      }
      g.panel(B.x, B.y, B.w, B.h, `A galaxy now ${chi} billion light-years away`);
      const x0 = B.x + 14, mw = B.w - 28, sans = "Inter, system-ui, sans-serif"; let y = B.y + 50;
      const eEm = e0 - chi;
      if (eEm <= 0) { y += g.wrap("No light from it has reached us yet.", x0, y, mw, 18, C.pink, 13, sans); y += g.wrap("It is beyond the particle horizon — outside the observable universe.", x0, y, mw); }
      else if (eEm < eLS) { y += g.wrap("Hidden behind the microwave background.", x0, y, mw, 18, C.orange, 13, sans); y += g.wrap("Its light left before the universe became transparent.", x0, y, mw); }
      else {
        const aE = T.aOfEta(eEm / gy), tE = T.tOfEta(eEm / gy) * gy;
        y += g.wrap(`The light we see left it ${tE < 1 ? (tE * 1000).toFixed(0) + " million" : tE.toFixed(2) + " billion"} years after the Big Bang.`, x0, y, mw, 18, C.teal, 13, sans) + 2;
        y += g.wrap(`It has travelled ${(T.t0 * gy - tE).toFixed(2)} billion years. Redshift z = ${(1 / aE - 1).toFixed(2)}.`, x0, y, mw);
        y += g.wrap(`When that light set out, the galaxy was only ${(aE * chi).toFixed(2)} billion light-years away.`, x0, y, mw);
      }
      y += 14;
      const reach = chi < eInf - e0;
      y += g.wrap(reach ? "A message we send today will reach it." : "A message we send today will never reach it.", x0, y, mw, 18, reach ? C.text : C.pink, 13, sans);
      y += g.wrap(`The event horizon is ${(eInf - e0).toFixed(1)} billion light-years away today.`, x0, y, mw) + 12;
      if (y < B.y + B.h - 60) { y += g.wrap(`Observable universe (particle horizon): ${e0.toFixed(1)} billion light-years.`, x0, y, mw); g.wrap(`Microwave background shell: ${(e0 - eLS).toFixed(1)} billion light-years.`, x0, y, mw); }
      g.label("Model: flat ΛCDM (Planck 2018), H₀ = 67.4.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>The universe has edges — not in space, but in what can ever be seen or reached. Both come from light's finite speed in stretching space.</p>
      <p>The left diagram stretches the universe's history so that light always travels at 45°, like the Spacetime lab. Our <b style="color:var(--accent)">past light cone</b> is everything we can see today. Galaxies stand still in this picture; space's growth is built into the grid.</p>
      <div class="try"><b>Try:</b> drag the galaxy outward. Watch when its light left, how stretched it arrives, and whether we could ever signal it. Then switch to <b>Ordinary distance and time</b>: our past light cone becomes a teardrop — the oldest light we see set out when its source was close, and space carried it away.</div>
      <p><b>Two horizons.</b> The <b>observable universe</b> reaches about 46 billion light-years today. The <b style="color:var(--c-lens)">event horizon</b>, about 16 billion light-years today, is the limit of where our signals can ever arrive — because expansion is accelerating, galaxies beyond it are leaving our reach for good.</p>
      <p>Before about 380,000 years the universe was opaque: that first light is the <b>microwave background</b>, a shell just inside the observable edge. What came before the Big Bang? That's hole <a href="#" data-hole="H6">H6</a>.</p>
      <p class="meta">Model assumption: a smooth, flat universe with matter, radiation and constant dark energy (ΛCDM, Planck 2018 values), H₀ = 67.4 km/s/Mpc. Distances are 'today' (comoving) unless stated. <span class="tag ESTABLISHED">Established</span> within the model.</p>`,
    next: { q: "Why does our universe have three space dimensions and one time — could it have been otherwise?", href: "#boot", label: "Boot a Universe" },
    sources: "T. Davis & C. Lineweaver, 'Expanding confusion', Publ. Astron. Soc. Aust. 21, 97 (2004); Planck Collaboration (2020)."
  });

  /* =====================================================================
     BOOT A UNIVERSE — Tegmark's (space, time) map as a boot log; orbits in n dimensions
     ===================================================================== */
  const BT = { mode: "boot", n: 3, m: 1, log: [], shown: 0, geo: null, on: 3.0, orb: null, trail: [] };
  const OK = "ok", ERR = "err", WARN = "warn";
  function bootLines(n, m) {
    const L = [[`> BOOT universe (${n} space, ${m} time)`, null, null]];
    if (m === 0) { L.push(["checking time … no time direction", ERR, "ERR_NO_EVOLUTION: the laws only relate places to places. Nothing evolves, nothing is predicted.", "ESTABLISHED"]); L.push(["RESULT: no observers — nothing happens.", ERR]); return L; }
    if (m >= 2) {
      L.push([`checking time … ${m} time dimensions`, WARN, "future and past no longer separate cleanly", "ESTABLISHED"]);
      L.push(["checking prediction …", ERR, "ERR_ILL_POSED: a complete snapshot of 'now' doesn't fix the future (see Two Films).", "ESTABLISHED"]);
      L.push(["checking matter …", ERR, "ERR_MATTER_UNSTABLE: particles can decay into heavier ones (Dorling, 1970).", "ESTABLISHED"]);
      if (n === 1 && m === 3) L.push(["note …", WARN, "WARN_TACHYONIC: this is our world with space and time swapped — only faster-than-light particles.", "CONTESTED"]);
      if (n === 4 && m === 2) L.push(["note …", WARN, "Itzhak Bars's two-time physics starts from exactly this (4, 2) world and proposes a hidden symmetry that removes these problems, leaving an effective 3 + 1 world as its 'shadow'.", "SPECULATIVE"]);
      L.push(["RESULT: unpredictable — no stable observers expected.", ERR]); return L;
    }
    L.push(["checking time … 1 time dimension", OK, "the present predicts the future", "ESTABLISHED"]);
    if (n === 0) { L.push(["checking space … none", ERR, "nothing to move in", "ESTABLISHED"]); L.push(["RESULT: no structure.", ERR]); return L; }
    L.push([`checking gravity … force falls as 1/r${n - 1 === 1 ? "" : n - 1 === 2 ? "²" : n - 1 === 3 ? "³" : "⁴"}`, OK, null, "ESTABLISHED"]);
    if (n < 3) { L.push(["checking structure …", WARN, `WARN_TOO_SIMPLE: in ${n}+1, gravity can't pull on separated masses the ordinary way; complex structures may be impossible.`, "CONTESTED"]); L.push(["RESULT: boots, but probably too simple for observers (argued, not proven).", WARN]); return L; }
    if (n > 3) {
      L.push(["checking orbits …", ERR, "ERR_ORBIT_UNSTABLE: no stable orbits — planets spiral in or fly off. (Try Orbits mode.)", "ESTABLISHED"]);
      L.push(["checking atoms …", ERR, "no stable atoms — electrons fall in or escape", "ESTABLISHED"]);
      L.push(["RESULT: no stable structures.", ERR]); return L;
    }
    L.push(["checking orbits …", OK, "stable orbits", "ESTABLISHED"]); L.push(["checking atoms …", OK, "stable atoms", "ESTABLISHED"]);
    L.push(["RESULT: boots. Planets, atoms, observers possible — this is our universe.", OK]); return L;
  }
  function boot(n, m) { BT.n = n; BT.m = m; BT.log = bootLines(n, m); BT.shown = 0.01; }
  function orbReset() { BT.orb = { x: 1, y: 0, vx: 0.02, vy: 1, t: 0, dead: "" }; BT.trail = []; }   // circular speed for F = 1/r^(n−1) at r = 1 is 1; a tiny radial kick starts it
  function orbStep(h) {
    const o = BT.orb, k = BT.on - 1, f = (x, y) => { const r = Math.hypot(x, y); return [-x / r ** (k + 1), -y / r ** (k + 1)]; };
    let [ax, ay] = f(o.x, o.y); o.vx += ax * h / 2; o.vy += ay * h / 2; o.x += o.vx * h; o.y += o.vy * h; [ax, ay] = f(o.x, o.y); o.vx += ax * h / 2; o.vy += ay * h / 2; o.t += h;
    const r = Math.hypot(o.x, o.y); if (r < 0.05) o.dead = "fell into the centre"; else if (r > 6) o.dead = "flew off to infinity";
  }

  Chrono.lab.register({
    predict: { q: "Suppose space had four dimensions instead of three (and time still one). Gravity would then weaken as 1/r³ instead of 1/r². What happens to planets' orbits?",
      options: ["Nothing much — orbits work the same", "Orbits become unstable: planets spiral in or fly away", "Planets orbit twice as fast"], answer: 1,
      explain: "With gravity falling off as 1/r³ or faster, a circular orbit is balanced on a knife-edge: the slightest nudge sends the planet spiralling in or flying off. Only with three space dimensions (or fewer) are orbits — and, similarly, atoms — stable. Switch to Orbits mode and slide the number of dimensions." },
    id: "boot", title: "Boot a Universe", eyebrow: "Cosmos · why 3 + 1?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    enter() { if (!BT.log.length) boot(3, 1); if (!BT.orb) orbReset(); },
    controls() {
      return `<button class="btn ${BT.mode === "boot" ? "primary" : ""}" id="bt-boot">Boot a universe</button>
        <button class="btn ${BT.mode === "orbit" ? "primary" : ""}" id="bt-orbit">Orbits in n dimensions</button>
        ${BT.mode === "boot" ? `<span class="ctl">Click a square: space dimensions across, time dimensions up</span>` :
        `<label class="ctl">Space dimensions n <input type="range" id="bt-n" min="200" max="500" value="${Math.round(BT.on * 100)}"><output id="bt-no">${BT.on.toFixed(2)}</output></label>
         <button class="btn" id="bt-nudge">Nudge the planet</button><button class="btn" id="bt-reset">Reset orbit</button>`}`;
    },
    wire() {
      $("#bt-boot").onclick = () => { BT.mode = "boot"; Chrono.lab.rebuild(); };
      $("#bt-orbit").onclick = () => { BT.mode = "orbit"; orbReset(); Chrono.lab.rebuild(); };
      const n = $("#bt-n"); if (n) n.oninput = e => { BT.on = e.target.value / 100; $("#bt-no").textContent = BT.on.toFixed(2); orbReset(); };
      const nu = $("#bt-nudge"); if (nu) nu.onclick = () => { BT.orb.vx += 0.08; };
      const r = $("#bt-reset"); if (r) r.onclick = orbReset;
    },
    tick(dt) {
      if (BT.mode === "boot" && BT.shown > 0 && BT.shown < BT.log.length) BT.shown = Math.min(BT.log.length, BT.shown + dt * 3);
      if (BT.mode === "orbit" && dt) { if (BT.orb.dead) { BT.orb.wait = (BT.orb.wait || 0) + dt; if (BT.orb.wait > 2.5) orbReset(); return; } for (let i = 0; i < 40; i++) { orbStep(0.004); if (BT.orb.dead) break; } BT.trail.push([BT.orb.x, BT.orb.y]); if (BT.trail.length > 900) BT.trail.shift(); }
    },
    pointer(type, x, y) {
      if (type !== "pointerdown" || BT.mode !== "boot" || !BT.geo) return;
      const { gx, gy, cs } = BT.geo, n = Math.floor((x - gx) / cs), m = 4 - Math.floor((y - gy) / cs);
      if (n >= 0 && n <= 5 && m >= 0 && m <= 4) boot(n, m);
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.58);
      if (BT.mode === "boot") {
        g.panel(A.x, A.y, A.w, A.h, "The (space, time) map — after Tegmark (1997)");
        const cs = Math.min((A.w - 90) / 6, (A.h - 100) / 5), gx = A.x + 60, gy = A.y + 52; BT.geo = { gx, gy, cs };
        const kind = (n, m) => m === 0 ? ["no evolution", C.teal] : m >= 2 ? [n === 1 && m === 3 ? "tachyons only" : "unpredictable", C.amber] : n === 3 ? ["our universe", C.accent] : n > 3 ? ["unstable", C.orange] : ["too simple", C.violet];
        for (let n = 0; n <= 5; n++) for (let m = 0; m <= 4; m++) {
          const [lab, col] = kind(n, m), x = gx + n * cs, y = gy + (4 - m) * cs, sel = n === BT.n && m === BT.m;
          ctx.fillStyle = g.alpha(col, n === 3 && m === 1 ? 0.35 : 0.13); ctx.fillRect(x + 2, y + 2, cs - 4, cs - 4);
          if (sel) { ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.strokeRect(x + 2, y + 2, cs - 4, cs - 4); ctx.lineWidth = 1; }
          if (cs > 50) { const two = cs < 84 && lab.includes(" "); two ? lab.split(" ").forEach((w, i, arr) => g.label(w, x + cs / 2, y + cs / 2 + 4 + (i - (arr.length - 1) / 2) * 11, g.alpha(col, 0.95), 9, "center", "Inter, sans-serif")) : g.label(lab, x + cs / 2, y + cs / 2 + 4, g.alpha(col, 0.95), cs < 84 ? 8 : 9, "center", "Inter, sans-serif"); }
        }
        for (let n = 0; n <= 5; n++) g.label(String(n), gx + n * cs + cs / 2, gy + 5 * cs + 16, C.muted, 11, "center");
        for (let m = 0; m <= 4; m++) g.label(String(m), gx - 10, gy + (4 - m) * cs + cs / 2 + 4, C.muted, 11, "right");
        g.label("space dimensions →", gx + 6 * cs, gy + 5 * cs + 32, C.muted, 10, "right"); g.label("time ↑", gx - 44, gy - 8, C.muted, 10);

        g.panel(B.x, B.y, B.w, B.h, "Boot log");
        let y = B.y + 48; const x0 = B.x + 14, colOf = s => s === OK ? C.teal : s === ERR ? C.orange : s === WARN ? C.amber : C.text;
        BT.log.slice(0, Math.floor(BT.shown)).forEach(([t, st, detail, tag]) => {
          g.label(t + (st ? (st === OK ? "  ✓" : st === ERR ? "  ✗" : "  !") : ""), x0, y, st ? colOf(st) : C.text, 12); y += 17;
          if (detail) { const words = detail.split(" "); let line = ""; words.forEach(w => { if ((line + " " + w).length > Math.floor((B.w - 40) / 6.3)) { g.label(line, x0 + 12, y, C.muted, 10, "left", "Inter, sans-serif"); y += 14; line = w; } else line = (line + " " + w).trim(); }); if (line) { g.label(line + (tag ? `  [${tag.toLowerCase()}]` : ""), x0 + 12, y, C.muted, 10, "left", "Inter, sans-serif"); y += 14; } }
          y += 6;
        });
      } else {
        g.panel(A.x, A.y, A.w, A.h, `A planet round a star in ${BT.on.toFixed(2)} space dimensions`);
        const cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 8, s = Math.min(A.w, A.h - 40) / 7;
        ctx.shadowColor = C.amber; ctx.shadowBlur = 20; g.dot(cx, cy, 8, C.amber); ctx.shadowBlur = 0;
        g.ring(cx, cy, s, "rgba(255,255,255,0.08)", 1, [3, 5]);
        if (BT.trail.length > 1) { ctx.strokeStyle = g.alpha(C.accent, 0.6); ctx.beginPath(); BT.trail.forEach(([x, y], i) => { const q = [cx + x * s, cy - y * s]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); }
        g.dot(cx + BT.orb.x * s, cy - BT.orb.y * s, 5, C.accent);
        if (BT.orb.dead) g.text(`The planet ${BT.orb.dead}.`, A.x + 14, A.y + A.h - 16, C.orange, 13);
        g.panel(B.x, B.y, B.w, B.h, "What decides it");
        const x0 = B.x + 14; let y = B.y + 50, k = BT.on - 1;
        g.text(`Gravity falls as 1/r^${k.toFixed(2)}`, x0, y, C.text, 14); y += 26;
        const st = BT.on < 3.995 ? ["Stable: nudged orbits wobble but stay bounded.", C.teal] : BT.on < 4.005 ? ["Knife-edge: n = 4 is the borderline.", C.amber] : ["Unstable: any nudge grows until the planet falls in or escapes.", C.orange];
        g.text(st[0], x0, y, st[1], 12); y += 26;
        ["A circular orbit is stable only if gravity weakens more slowly", "than 1/r³ — that is, for fewer than 4 space dimensions.", "", "At exactly n = 3 orbits close into ellipses (Kepler).", "At other n < 4 they wobble in rosettes, but stay put."].forEach(t => { g.label(t, x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 15; });
        g.label("Model: one planet, fixed star, Newtonian force ∝ 1/r^(n−1).", x0, B.y + B.h - 14, C.muted, 10);
      }
    },
    aside: () => BT.mode === "boot" ? `
      <p>Our universe has three space dimensions and one time dimension. Why? Nobody has derived it — but you can <b>test the alternatives</b>.</p>
      <p>Each square is a possible universe: space dimensions across, time dimensions up. Click one to boot it. Each check is real physics; each failure is a reason observers like us couldn't exist there.</p>
      <div class="try"><b>Try:</b> boot (3, 1) — ours. Then (4, 1), (2, 1), (3, 2) and (3, 0). For (4, 1), switch to <b>Orbits in n dimensions</b> and watch a planet fail.</div>
      <p><b>How sure is this?</b> The individual checks are <span class="tag ESTABLISHED">Established</span> mathematics. The overall conclusion — that only 3 + 1 allows observers — is <span class="tag CONTESTED">Contested</span>: it assumes laws like ours, and "too simple" for 2 + 1 is an argument, not a proof. It explains why <i>we</i> find ourselves in 3 + 1, not why the universe had to be that way. That's hole <a href="#" data-hole="H5">H5</a>.</p>
      <p class="meta">The map follows Tegmark, 'On the dimensionality of spacetime' (1997), which draws on Ehrenfest (1917) for orbits and atoms, Dorling (1970) for matter with two times, and Craig &amp; Weinstein (2009) for prediction.</p>` : `
      <p>Gravity spreads out through space. In three dimensions its pull weakens as 1/r² — the area of a sphere. In n dimensions it weakens as 1/r<sup>n−1</sup>.</p>
      <div class="try"><b>Try:</b> start at 3.00 and press <b>Nudge the planet</b>: the orbit wobbles but survives. Slide to 3.50, nudge again. Then slide past 4 — the planet can no longer stay.</div>
      <p>The same maths applies to electrons in atoms: with four or more space dimensions there are no stable atoms. A universe like that has no chemistry, no planets, no observers.</p>
      <p class="meta">Model assumption: one planet round a fixed star, Newtonian gravity generalised to n dimensions (force ∝ 1/r^(n−1)), integrated with a time-reversible (velocity-Verlet) method. Non-integer n is a mathematical bridge between the real cases. <span class="tag ESTABLISHED">Established</span></p>`,
    next: { q: "Our universe boots. But why does its time run one way? A cosmic answer, from gravity itself.", href: "#janus", label: "The Janus point" },
    sources: "M. Tegmark, Class. Quantum Grav. 14, L69 (1997); P. Ehrenfest (1917); J. Dorling, Am. J. Phys. 38, 539 (1970); W. Craig & S. Weinstein, Proc. R. Soc. A 465 (2009)."
  });

  /* =====================================================================
     THE JANUS POINT — gravitating swarm with zero energy; complexity grows away from its minimum both ways
     ===================================================================== */
  const JN = { N: 60, eps: 0.04, h: 0.002, steps: 16000, every: 80, snaps: null, k: 0, play: true, seed: 3 };   // checked: energy stays zero to ~1e-6; complexity grows ~4× each way
  function jnForces(x, a) {
    const N = JN.N, e2 = JN.eps * JN.eps; a.fill(0); let V = 0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = x[2 * j] - x[2 * i], dy = x[2 * j + 1] - x[2 * i + 1], r2 = dx * dx + dy * dy + e2, ir = 1 / Math.sqrt(r2), f = ir * ir * ir / N;
      a[2 * i] += f * dx; a[2 * i + 1] += f * dy; a[2 * j] -= f * dx; a[2 * j + 1] -= f * dy; V -= ir / (N * N);   // masses 1/N: V = −Σ mᵢmⱼ/r
    }
    return V;
  }
  function jnMeasure(x) {
    const N = JN.N; let I = 0, s2 = 0, inv = 0, cx = 0, cy = 0;
    for (let i = 0; i < N; i++) { cx += x[2 * i] / N; cy += x[2 * i + 1] / N; }
    for (let i = 0; i < N; i++) I += (x[2 * i] - cx) ** 2 + (x[2 * i + 1] - cy) ** 2;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const r2 = (x[2 * j] - x[2 * i]) ** 2 + (x[2 * j + 1] - x[2 * i + 1]) ** 2; s2 += r2; inv += 1 / Math.sqrt(r2 + JN.eps * JN.eps); }
    return { I, C: Math.sqrt(s2) * inv / N ** 3, cx, cy };   // shape complexity: rms length × mean inverse length (Barbour–Koslowski–Mercati), softened like the force
  }
  function jnRun() {
    const N = JN.N, R = rng(JN.seed), x0 = new Float64Array(2 * N), v0 = new Float64Array(2 * N);
    for (let i = 0; i < N; i++) { const r = Math.sqrt(R()), a = R() * TAU; x0[2 * i] = r * Math.cos(a); x0[2 * i + 1] = r * Math.sin(a); v0[2 * i] = R() - 0.5; v0[2 * i + 1] = R() - 0.5; }
    const mean = arr => { let sx = 0, sy = 0; for (let i = 0; i < N; i++) { sx += arr[2 * i]; sy += arr[2 * i + 1]; } return [sx / N, sy / N]; };
    const [mx, my] = mean(x0), [mvx, mvy] = mean(v0); for (let i = 0; i < N; i++) { x0[2 * i] -= mx; x0[2 * i + 1] -= my; v0[2 * i] -= mvx; v0[2 * i + 1] -= mvy; }
    let L = 0, I = 0, D = 0; for (let i = 0; i < N; i++) { L += x0[2 * i] * v0[2 * i + 1] - x0[2 * i + 1] * v0[2 * i]; I += x0[2 * i] ** 2 + x0[2 * i + 1] ** 2; }
    const w = L / I; for (let i = 0; i < N; i++) { v0[2 * i] += w * x0[2 * i + 1]; v0[2 * i + 1] -= w * x0[2 * i]; }          // no overall rotation
    for (let i = 0; i < N; i++) D += x0[2 * i] * v0[2 * i] + x0[2 * i + 1] * v0[2 * i + 1];
    for (let i = 0; i < N; i++) { v0[2 * i] -= D / I * x0[2 * i]; v0[2 * i + 1] -= D / I * x0[2 * i + 1]; }                 // dI/dt = 0: this is the Janus point
    const acc = new Float64Array(2 * N), V = jnForces(x0, acc); let K = 0; for (let q = 0; q < 2 * N; q++) K += v0[q] ** 2 / 2 / N;
    const sc = Math.sqrt(-V / K); for (let q = 0; q < 2 * N; q++) v0[q] *= sc;                                                    // total energy exactly zero
    const run = dir => {
      const x = x0.slice(), v = v0.map(u => u * dir), a = new Float64Array(2 * N), out = []; jnForces(x, a);
      for (let s = 0; s <= JN.steps; s++) {
        if (s % JN.every === 0) out.push({ x: x.slice(), ...jnMeasure(x) });
        for (let q = 0; q < 2 * N; q++) { v[q] += a[q] * JN.h / 2; x[q] += v[q] * JN.h; }
        jnForces(x, a); for (let q = 0; q < 2 * N; q++) v[q] += a[q] * JN.h / 2;
      }
      return out;
    };
    JN.snaps = { fwd: run(1), back: run(-1) }; JN.k = 0;
  }

  Chrono.lab.register({
    predict: { q: "A swarm of stars starts almost evenly spread out. Run time forward and gravity pulls it into clumps and clusters. Now run time <b>backwards</b> from the same moment. What happens?",
      options: ["It spreads out perfectly evenly", "It clumps into clusters too", "It freezes in place"], answer: 1,
      explain: "It clumps too. The starting moment is a 'Janus point' — the most uniform, least structured moment in the swarm's history — and structure grows away from it in <i>both</i> directions. Observers on either side would each see their past pointing back towards it. Barbour, Koslowski and Mercati propose that the Big Bang could be such a point, with time's arrow pointing away from it on both sides." },
    id: "janus", title: "The Janus point", eyebrow: "Cosmos · an arrow of time from gravity", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    enter() { if (!JN.snaps) jnRun(); },
    controls() {
      return `<button class="btn" id="jn-play">${JN.play ? "Pause" : "Play"}</button><button class="btn" id="jn-restart">From the Janus point</button>
        <button class="btn" id="jn-new">A new swarm</button>`;
    },
    wire() {
      $("#jn-play").onclick = () => { JN.play = !JN.play; if (JN.play && JN.k >= JN.snaps.fwd.length - 1) JN.k = 0; Chrono.lab.rebuild(); };
      $("#jn-restart").onclick = () => { JN.k = 0; JN.play = true; Chrono.lab.rebuild(); };
      $("#jn-new").onclick = () => { JN.seed++; jnRun(); JN.play = true; Chrono.lab.rebuild(); };
    },
    tick(dt) { if (JN.play && JN.snaps) { JN.k = Math.min(JN.snaps.fwd.length - 1, JN.k + dt * 16); if (JN.k >= JN.snaps.fwd.length - 1) { JN.play = false; Chrono.lab.rebuild(); } } },
    draw(g) {
      const { ctx } = g, { A, B, stacked } = g.split(0.62), k = Math.floor(JN.k), F = JN.snaps.fwd, Bk = JN.snaps.back;
      g.panel(A.x, A.y, A.w, A.h, A.w < 620 ? "The same swarm, run both ways" : "The same swarm, run both ways from its Janus point (shape only — scale removed)");
      const hw = stacked ? A.w - 24 : (A.w - 36) / 2, hh = stacked ? (A.h - 60) / 2 : A.h - 60;
      [[Bk[k], "← one direction", C.violet, 0], [F[k], "the other direction →", C.teal, 1]].forEach(([sn, lab, col, j]) => {
        const x0 = stacked ? A.x + 12 : A.x + 12 + j * (hw + 12), y0 = stacked ? A.y + 32 + j * (hh + 8) : A.y + 32, s = Math.min(hw, hh) / 2 / (Math.sqrt(sn.I / JN.N) * 2.6);
        ctx.strokeStyle = C.line; ctx.strokeRect(x0, y0, hw, hh);
        for (let i = 0; i < JN.N; i++) g.dot(x0 + hw / 2 + (sn.x[2 * i] - sn.cx) * s, y0 + hh / 2 - (sn.x[2 * i + 1] - sn.cy) * s, 2.4, col);
        g.label(lab, x0 + 8, y0 + 16, col, 10);
      });
      g.label(`time from the Janus point: ${(k * JN.every * JN.h).toFixed(2)} (both ways)`, A.x + 14, A.y + A.h - 12, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Size and structure through the whole history");
      const px = B.x + 36, pw = B.w - 56, n = F.length, rows = [["size (spread of the swarm)", "I", C.accent], ["complexity (clumpiness)", "C", C.amber]];
      const ph = Math.max(40, (B.h - 120) / 2);
      rows.forEach(([name, key, col], r) => {
        const py = B.y + 40 + r * (ph + 34), vals = Bk.slice().reverse().concat(F.slice(1)).map(s => s[key]), lo = Math.min(...vals), hi = Math.max(...vals);
        const P = (i, v) => [px + i / (vals.length - 1) * pw, py + ph - (v - lo) / (hi - lo || 1) * ph];
        g.label(name, px, py - 6, col, 10);
        ctx.strokeStyle = C.line; ctx.strokeRect(px, py, pw, ph);
        ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); vals.forEach((v, i) => { const q = P(i, v); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); ctx.lineWidth = 1;
        const mid = P(n - 1, lo)[0]; g.line(mid, py, mid, py + ph, g.alpha(C.pink, 0.6));
        [n - 1 - k, n - 1 + k].forEach(i => g.dot(...P(i, vals[i]), 3.5, C.pink));
      });
      const yb = B.y + 40 + 2 * (ph + 34);
      g.label(B.w < 480 ? "pink line: the Janus point" : "Janus point (pink line): smallest, least structured moment", px, yb - 14, C.pink, 10);
      g.label("Model: 60 bodies, 2D gravity, zero energy.", B.x + 14, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>The Entropy box explained why a gas spreads — but only if it <i>starts</i> ordered. Why was the universe's start ordered? Julian Barbour, Tim Koslowski and Flavio Mercati found a surprise in the simplest gravitating system.</p>
      <p>Take a swarm of bodies with zero total energy. Newton's laws guarantee its size has <b>one minimum</b> (the <b>Janus point</b>, after the two-faced Roman god). From there it spreads — and gravity pulls it into clumps — in <b>both</b> directions of time.</p>
      <div class="try"><b>Try:</b> press <b>From the Janus point</b>. The two panels show the same swarm run forwards and backwards from one moment. Both clump. On the right, size and complexity are lowest at the Janus point and grow either way. Then try <b>A new swarm</b>.</div>
      <p><b>Why it matters:</b> observers on either side would each find their 'past' at the Janus point and their 'future' away from it — an arrow of time that comes from gravity itself, with no special starting condition assumed.</p>
      <p><b>How sure?</b> That the size has a single minimum (for zero or positive energy) is <span class="tag ESTABLISHED">Established</span> mathematics (the Lagrange–Jacobi relation). That our Big Bang is such a Janus point, with a mirror history beyond it, is a <span class="tag CONTESTED">Contested</span> proposal. Related holes: <a href="#" data-hole="H3">H3</a> (the arrow) and <a href="#" data-hole="H6">H6</a> (before the Big Bang).</p>
      <p class="meta">Model assumption: 60 equal masses in two dimensions, Newtonian gravity softened at very short range, total energy and angular momentum zero, integrated with velocity-Verlet. Complexity = root-mean-square distance × mean inverse distance. Shown shape-only: the view rescales as the swarm grows.</p>`,
    next: { q: "Gravity may give time its direction. So is one time dimension a law of nature — or just where we happen to live?", href: "#atlas/H5", label: "Atlas · hole H5" },
    sources: "J. Barbour, T. Koslowski & F. Mercati, 'Identification of a gravitational arrow of time', Phys. Rev. Lett. 113, 181101 (2014); J. Barbour, The Janus Point (2020)."
  });
})();
