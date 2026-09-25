/* Chronoscope — Labs: Field Ocean, Clock Lab, River, Two Films. Real equations throughout; any
   illustrative or exploratory overlay is labelled on screen. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;

  /* =====================================================================
     FIELD OCEAN — Klein–Gordon field on a 1D lattice: φ_tt = φ_xx − m²φ
     ===================================================================== */
  const FO = { N: 720, dt: 0.4, m: 0.18, speed: 6, lanes: null, t: 0, mode: "travel" };
  function kgLane(m) { return { m, phi: new Float64Array(FO.N), prev: new Float64Array(FO.N), xbar: 0, v: 0, hist: [], phase: 0 }; }
  function omegaLat(k, m) { return Math.sqrt(4 * Math.sin(k / 2) ** 2 + m * m); }
  function launch(L, mode) {
    const N = FO.N, dt = FO.dt, sig = 26, A = 1;
    L.phi.fill(0); L.prev.fill(0); L.hist = []; L.v = 0; L.hh = []; L.vHalf = 0;
    if (mode === "travel") {
      const k = 0.25, w = omegaLat(k, L.m), vg = Math.sin(k) / w, x0 = 90;
      for (let i = 0; i < N; i++) {
        L.phi[i] = A * Math.exp(-((i - x0) ** 2) / (2 * sig * sig)) * Math.cos(k * i);
        L.prev[i] = A * Math.exp(-((i - x0 + vg * dt) ** 2) / (2 * sig * sig)) * Math.cos(k * i + w * dt);
      }
      L.theory = vg;
    } else {
      const x0 = N / 2;
      for (let i = 0; i < N; i++) { const g = A * Math.exp(-((i - x0) ** 2) / (2 * 14 * 14)); L.phi[i] = g; L.prev[i] = g * Math.cos(L.m * dt); }
      L.theory = 0;
    }
  }
  function stepLane(L) {
    const N = FO.N, dt2 = FO.dt * FO.dt, m2 = L.m * L.m, next = new Float64Array(N);
    for (let i = 1; i < N - 1; i++) next[i] = 2 * L.phi[i] - L.prev[i] + dt2 * (L.phi[i + 1] - 2 * L.phi[i] + L.phi[i - 1] - m2 * L.phi[i]);
    for (let i = 0; i < 40; i++) { const d = 1 - 0.06 * (1 - i / 40); next[i] *= d; next[N - 1 - i] *= d; }   // absorbing edges
    L.prev = L.phi; L.phi = next;
  }
  function energyCentroid(L) {
    const N = FO.N, dt = FO.dt; let E = 0, X = 0;
    for (let i = 1; i < N - 1; i++) {
      const pt = (L.phi[i] - L.prev[i]) / dt, px = (L.phi[i + 1] - L.phi[i - 1]) / 2;
      const e = 0.5 * (pt * pt + px * px + L.m * L.m * L.phi[i] * L.phi[i]); E += e; X += e * i;
    }
    return [E > 1e-9 ? X / E : 0, E];
  }
  Chrono.lab.register({
    predict: { q: "You pluck the <b>massive</b> field at one spot and let go. What does the ripple do?",
      options: ["Splits in two and flies apart at light speed", "Stays centred and vibrates, spreading only slowly", "Disappears almost at once"], answer: 1,
      explain: "Splitting and racing away is what the <i>massless</i> field does. The mass term lets a ripple oscillate in place — and a ripple that stays put and vibrates is exactly what a particle at rest is. Try <b>Pluck one spot</b> to see both." },
    id: "field", title: "The Field Ocean", eyebrow: "Lab · particles as ripples", tier: "mainstream", tags: ["ESTABLISHED"],
    enter() { if (!FO.lanes) { FO.lanes = [kgLane(0), kgLane(FO.m)]; FO.lanes.forEach(L => launch(L, FO.mode)); } },
    controls() {
      return `<button class="btn ${FO.mode === "travel" ? "primary" : ""}" id="fo-travel">Send a ripple</button>
        <button class="btn ${FO.mode === "rest" ? "primary" : ""}" id="fo-rest">Pluck one spot</button>
        <label class="ctl">Mass (coupling to the Higgs field) <input type="range" id="fo-m" min="0" max="40" value="${Math.round(FO.m * 100)}"><output id="fo-mo">${FO.m.toFixed(2)}</output></label>`;
    },
    wire() {
      $("#fo-travel").onclick = () => { FO.mode = "travel"; FO.lanes.forEach(L => launch(L, "travel")); Chrono.lab.rebuild(); };
      $("#fo-rest").onclick = () => { FO.mode = "rest"; FO.lanes.forEach(L => launch(L, "rest")); Chrono.lab.rebuild(); };
      $("#fo-m").oninput = e => { FO.m = e.target.value / 100; $("#fo-mo").textContent = FO.m.toFixed(2); FO.lanes[1].m = FO.m; launch(FO.lanes[1], FO.mode); launch(FO.lanes[0], FO.mode); };
    },
    tick(dt) {
      if (!dt) return;
      FO.lanes.forEach(L => {
        for (let s = 0; s < FO.speed; s++) stepLane(L);
        const [x, E] = energyCentroid(L);
        L.hist.push(x); if (L.hist.length > 30) L.hist.shift();
        if (L.hist.length > 10) L.v = Math.abs(L.hist[L.hist.length - 1] - L.hist[0]) / ((L.hist.length - 1) * FO.speed * FO.dt);
        L.xbar = x; L.E = E;
        if (FO.mode === "rest" && L.m === 0) { const half = { phi: L.phi.slice(FO.N / 2), prev: L.prev.slice(FO.N / 2), m: 0 }; const N0 = FO.N; FO.N = N0 / 2; const [xh] = energyCentroid(half); FO.N = N0; L.hh = (L.hh || []); L.hh.push(xh); if (L.hh.length > 30) L.hh.shift(); if (L.hh.length > 10) L.vHalf = Math.abs(L.hh[L.hh.length - 1] - L.hh[0]) / ((L.hh.length - 1) * FO.speed * FO.dt); }
        L.phase += dt * 2.2 * (L.m > 0 ? Math.sqrt(Math.max(0, 1 - L.v * L.v)) : 0);
      });
      if (FO.mode === "travel" && FO.lanes.some(L => L.xbar > FO.N - 80 || L.E < 1e-4)) FO.lanes.forEach(L => launch(L, "travel"));
    },
    draw(g) {
      const { W, H, ctx } = g, pad = 16, laneH = (H - pad * 3) / 2;
      FO.lanes.forEach((L, li) => {
        const y0 = pad + li * (laneH + pad), cy = y0 + laneH * 0.62, sx = (W - pad * 2 - 40) / FO.N, ox = pad + 20;
        const col = li === 0 ? C.amber : C.teal;
        g.panel(pad, y0, W - pad * 2, laneH, li === 0 ? "Massless field — like light (m = 0)" : `Massive field — like any particle with mass (m = ${L.m.toFixed(2)})`);
        g.line(ox, cy, ox + FO.N * sx, cy, C.line);
        const amp = laneH * 0.3;
        ctx.beginPath();
        for (let i = 0; i < FO.N; i++) { const pt = (L.phi[i] - L.prev[i]) / FO.dt, e = 0.5 * (pt * pt + L.m * L.m * L.phi[i] * L.phi[i]); const y = cy - Math.min(1, e * 6) * amp * 0.9; i ? ctx.lineTo(ox + i * sx, y) : ctx.moveTo(ox, y); }
        ctx.lineTo(ox + FO.N * sx, cy); ctx.lineTo(ox, cy); ctx.closePath(); ctx.fillStyle = g.alpha(col, 0.12); ctx.fill();
        ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i < FO.N; i++) { const y = cy - L.phi[i] * amp; i ? ctx.lineTo(ox + i * sx, y) : ctx.moveTo(ox, y); }
        ctx.stroke(); ctx.shadowBlur = 0; ctx.lineWidth = 1;
        // internal clock at the packet
        const px = ox + L.xbar * sx, py = y0 + 48;
        g.ring(px, py, 14, C.muted);
        if (L.m > 0) { const a = L.phase - Math.PI / 2; g.line(px, py, px + 11 * Math.cos(a), py + 11 * Math.sin(a), C.text, 2); }
        else g.label("—", px, py + 4, C.muted, 12, "center");
        // readouts
        const rx = W - pad - 250, ry = y0 + 34;
        const v = FO.mode === "rest" ? (L.m > 0 ? 0 : Math.min(1, L.vHalf || 0)) : Math.min(1, L.v), tfrac = Math.sqrt(Math.max(0, 1 - v * v));
        const split = FO.mode === "rest" && L.m === 0;
        g.label(split ? `splits in two — each half ≈ ${(L.vHalf || 0).toFixed(2)} c` : `speed ≈ ${v.toFixed(2)} c${FO.mode === "travel" ? `   (theory ${L.theory.toFixed(2)} c)` : ""}`, rx, ry, C.text, 11);
        g.label("motion through space", rx, ry + 18, C.muted, 10); g.bar(rx, ry + 22, 230, 6, v, C.amber);
        g.label("motion through time (clock rate)", rx, ry + 42, C.muted, 10); g.bar(rx, ry + 46, 230, 6, L.m > 0 ? tfrac : 0, C.teal);
      });
    },
    aside: () => `
      <p>Imagine all of space filled with a medium — a <b>field</b>. In quantum field theory, the framework behind all of particle physics, <b>particles are ripples of fields</b>. An electron isn't a ball sitting in space; it is a ripple of the electron field.</p>
      <p>Both lanes run the real equation for such a field (the Klein–Gordon equation, φ<sub>tt</sub> = φ<sub>xx</sub> − m²φ). The only difference is the <b>mass</b> term — in nature, mass comes from how strongly a field couples to the Higgs field.</p>
      <div class="try"><b>Try:</b> <b>Send a ripple</b> — the massless one races at the speed limit; the massive one lags. Then <b>Pluck one spot</b>: the massless pluck splits and flies apart at light speed; the massive one <i>stays centred and vibrates</i> (spreading only slowly). That staying-put is what a particle at rest is.</div>
      <h3>The light–time link</h3>
      <p>Watch the little clocks. A massive ripple carries an internal "tick" (its vibration). The faster it moves, the slower its clock — the speed-budget bars trade off exactly. The massless ripple has no clock at all: <b>light spends its whole budget on space and none on time</b>.</p>
      <p class="meta">Grid effect: on this finite lattice the massless ripple travels at ~0.99 c rather than exactly c.</p>
      ${Chrono.shows("exploratory") ? `<div class="exp-box">${Chrono.expBanner()}<p>This project's exploratory <b>membrane</b> idea goes one step further: that the fields and spacetime itself are one medium, and the dark sector is a property of it. See the Atlas card "The membrane: one ocean".</p></div>` : ""}`,
    next: { q: "A moving ripple's clock slows down. Is that just ripples — or every clock there is?", href: "#clocks", label: "Clock Lab" },
    sources: "Klein–Gordon equation (standard QFT); Higgs mechanism (confirmed 2012)."
  });

  /* =====================================================================
     CLOCK LAB — light clock (special relativity) and orbit clocks (GPS)
     ===================================================================== */
  const CL = { mode: "light", v: 0.6, T: 0, trail: [], alt: 20200 };
  const GM = 3.986004e14, c = 2.99792458e8, RE = 6.371e6, DAY_US = 86400e6;
  function orbitShift(hkm) {
    const r = RE + hkm * 1000;
    const grav = GM / (c * c) * (1 / RE - 1 / r) * DAY_US;
    const vel = hkm < 100 ? 0 : -(GM / r) / (2 * c * c) * DAY_US;
    return { grav, vel, net: grav + vel, v: hkm < 100 ? 0 : Math.sqrt(GM / r) };
  }
  Chrono.lab.register({
    predict: { setup() { CL.mode = "light"; CL.v = 0.87; CL.T = 0; CL.trail = []; },
      q: "A perfect clock moves past you at 0.87 of light speed. For every 2 ticks of your clock, how many does it make?",
      options: ["2 — a clock is a clock", "About 1 — it runs at half speed", "About 4 — motion speeds it up"], answer: 1,
      explain: "At 0.87 c the slowing factor γ is about 2, so the moving clock ticks about once for every two of yours. Set the slider to 0.87 and count. Not a fault in the clock: every process on board — atoms, heartbeats — slows the same way." },
    applySetup(o) { Object.assign(CL, o); CL.T = 0; CL.trail = []; },
    id: "clocks", title: "Clock Lab", eyebrow: "Lab · why clocks disagree", tier: "mainstream", tags: ["ESTABLISHED"],
    controls() {
      return `<button class="btn ${CL.mode === "light" ? "primary" : ""}" id="cl-light">Light clock</button>
        <button class="btn ${CL.mode === "gps" ? "primary" : ""}" id="cl-gps">Clocks in orbit (GPS)</button>
        ${CL.mode === "light" ? `<label class="ctl">Speed of the moving clock <input type="range" id="cl-v" min="0" max="99" value="${Math.round(CL.v * 100)}"><output id="cl-vo">${CL.v.toFixed(2)} c</output></label>` :
        `<label class="ctl">Altitude <input type="range" id="cl-alt" min="0" max="40000" step="10" value="${CL.alt}"><output id="cl-ao">${CL.alt.toLocaleString()} km</output></label>
         <button class="btn" data-alt="0">Ground</button><button class="btn" data-alt="408">ISS</button><button class="btn" data-alt="20200">GPS</button><button class="btn" data-alt="35786">Geostationary</button>`}`;
    },
    wire() {
      $("#cl-light").onclick = () => { CL.mode = "light"; Chrono.lab.rebuild(); };
      $("#cl-gps").onclick = () => { CL.mode = "gps"; Chrono.lab.rebuild(); };
      const v = $("#cl-v"); if (v) v.oninput = e => { CL.v = e.target.value / 100; $("#cl-vo").textContent = CL.v.toFixed(2) + " c"; CL.T = 0; CL.trail = []; };
      const a = $("#cl-alt"); if (a) a.oninput = e => { CL.alt = +e.target.value; $("#cl-ao").textContent = CL.alt.toLocaleString() + " km"; };
      document.querySelectorAll("[data-alt]").forEach(b => b.onclick = () => { CL.alt = +b.dataset.alt; Chrono.lab.rebuild(); });
    },
    tick(dt) { CL.T += dt * 0.9; },
    draw(g) { CL.mode === "light" ? drawLightClock(g) : drawGPS(g); },
    aside: () => CL.mode === "light" ? `
      <p>A <b>light clock</b> is the simplest possible clock: a pulse of light bouncing between two mirrors. One bounce up and back = one tick.</p>
      <p>Now move the clock sideways. Seen by us, the light must travel a longer, <b>diagonal</b> path — but light always travels at the same speed. So each tick takes longer. The moving clock <i>really</i> ticks slower, by a factor physicists call gamma: at 87% of light speed it's 2, so the moving clock ticks half as fast.</p><p class="meta">For the technically minded: γ = 1/√(1 − v²/c²).</p>
      <div class="try"><b>Try:</b> push the speed toward 0.99 c and watch the moving clock nearly stop. At exactly c there'd be no vertical motion left at all — which is why <b>light's own clock never ticks</b>.</div>
      <p>This isn't a quirk of light clocks: every clock, heartbeat and atom slows the same way. It's measured daily — see the GPS mode.</p>` : `
      <p>Clocks run at different rates depending on <b>speed</b> and <b>gravity</b>. A satellite clock gains time because it sits higher up, where gravity is weaker, and loses time because it moves fast.</p>
      <p>For GPS, the two effects don't cancel: satellite clocks gain about <b>38 microseconds a day</b>. Uncorrected, GPS positions would drift by kilometres per day. Engineers build the correction into every satellite.</p>
      <div class="try"><b>Try:</b> compare the ISS (low and fast: speed wins, its clocks run slow) with GPS (high: gravity wins). Find the altitude where the two effects cancel.</div>
      <p class="meta">Computed from Earth's mass and orbital speed at each altitude; Earth's own rotation (a small extra effect) is ignored.</p>`,
    next: { q: "Speed slows clocks, and so does gravity. What happens where gravity is strongest of all?", href: "#river", label: "The River" },
    sources: "Einstein (1905, 1915); Hafele–Keating (1971); GPS relativistic corrections (Ashby, Living Reviews in Relativity, 2003)."
  });
  function drawLightClock(g) {
    const { W, H } = g, pad = 16, narrow = W < 640, foot = narrow ? 140 : 120, pw = (W - pad * 3) / 2, ph = H - pad * 2 - foot;
    const Lpx = Math.min(ph * 0.55, 260), gamma = 1 / Math.sqrt(1 - CL.v * CL.v), vert = Math.sqrt(1 - CL.v * CL.v);
    [0, 1].forEach(k => {
      const x0 = pad + k * (pw + pad), y0 = pad;
      g.panel(x0, y0, pw, ph, k === 0 ? "Clock at rest (next to you)" : `Clock moving at ${CL.v.toFixed(2)} c`);
      const top = y0 + (ph - Lpx) / 2 + 10, bot = top + Lpx;
      const speed = k === 0 ? 1 : vert, t = CL.T * speed, ph2 = t % 2, yN = ph2 < 1 ? bot - ph2 * Lpx : top + (ph2 - 1) * Lpx;
      let cx;
      if (k === 0) cx = x0 + pw / 2;
      else { const span = pw - 80, travel = (CL.T * CL.v * Lpx) % span; cx = x0 + 40 + travel; if (CL.trail.length && cx < CL.trail[CL.trail.length - 1][0]) CL.trail = []; CL.trail.push([cx, yN]); if (CL.trail.length > 400) CL.trail.shift(); }
      g.line(cx - 34, top, cx + 34, top, C.muted, 3); g.line(cx - 34, bot, cx + 34, bot, C.muted, 3);
      if (k === 1 && CL.trail.length > 1) { const ctx = g.ctx; ctx.strokeStyle = g.alpha(C.amber, 0.45); ctx.beginPath(); CL.trail.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
      g.ctx.shadowColor = C.amber; g.ctx.shadowBlur = 14; g.dot(cx, yN, 5, C.amber); g.ctx.shadowBlur = 0;
      const ticks = Math.floor(t / 2);
      g.text(`${ticks} ticks`, x0 + pw / 2, y0 + ph - 18, C.text, 16, "center");
    });
    const by = H - pad - foot + 20, bw = Math.min(320, W - pad * 2);
    g.text(`γ = ${gamma.toFixed(3)}  —  ${narrow ? "" : "the moving clock "}ticks ${gamma.toFixed(2)}× slower`, pad, by + 10, C.text, 14);
    g.label(`In your frame: 1 year on the moving clock = ${gamma < 10 ? gamma.toFixed(1) : Math.round(gamma)} years on yours`, narrow ? pad : pad + 340, narrow ? by + 26 : by + 34, C.amber, narrow ? 10 : 12, "left", "Inter, system-ui, sans-serif");
    g.label("MOTION THROUGH SPACE", pad, by + 38, C.muted, 10); g.bar(pad, by + 44, bw, 8, CL.v, C.amber);
    g.label("MOTION THROUGH TIME (clock rate)", pad, by + 70, C.muted, 10); g.bar(pad, by + 76, bw, 8, vert, C.teal);
    if (narrow) g.label("One budget: faster through space = slower through time.", pad, by + 104, C.muted, 10);
    else g.label("Every clock shares one budget: faster through space means slower through time.", pad + 340, by + 60, C.muted, 11);
  }
  function drawGPS(g) {
    const { W, H, ctx } = g, pad = 16, tall = H > W * 1.05, lw = Math.floor((W - pad * 3) * 0.55);
    const L = tall ? { x: pad, y: pad, w: W - pad * 2, h: Math.floor((H - pad * 3) * 0.5) } : { x: pad, y: pad, w: lw, h: H - pad * 2 };
    const Rp = tall ? { x: pad, y: pad * 2 + L.h, w: W - pad * 2, h: H - pad * 3 - L.h } : { x: pad * 2 + lw, y: pad, w: W - pad * 3 - lw, h: H - pad * 2 };
    g.panel(L.x, L.y, L.w, L.h, "Earth and your clock's orbit (to scale)");
    const cx = L.x + L.w / 2, cy = L.y + L.h / 2 + 8, maxR = Math.min(L.w, L.h) / 2 - 24, s = maxR / (RE / 1000 + 40000);
    const er = RE / 1000 * s, orr = (RE / 1000 + CL.alt) * s;
    const grd = ctx.createRadialGradient(cx - er * .3, cy - er * .3, er * .1, cx, cy, er); grd.addColorStop(0, "#5fa8e8"); grd.addColorStop(1, "#123a5c");
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, er, 0, TAU); ctx.fill();
    [[20200, "GPS"], [35786, "GEO"], [408, "ISS"]].forEach(([h, n]) => { g.ring(cx, cy, (RE / 1000 + h) * s, "rgba(255,255,255,0.07)", 1, [3, 5]); g.label(n, cx + (RE / 1000 + h) * s * 0.707 + 4, cy - (RE / 1000 + h) * s * 0.707, C.muted, 9); });
    const o = orbitShift(CL.alt), ang = CL.alt < 100 ? -Math.PI / 2 : CL.T * 0.4 * Math.sqrt(26571 / (RE / 1000 + CL.alt)) ** 3;
    g.ring(cx, cy, orr, C.accent, 1);
    g.dot(cx + orr * Math.cos(ang), cy + orr * Math.sin(ang), 6, C.amber);
    const x0 = Rp.x, y0 = Rp.y, rw = Rp.w, gap = tall ? 52 : 74, top = tall ? 50 : 70;
    g.panel(x0, y0, rw, Rp.h, "Clock gain per day vs a clock on the ground");
    const rows = [["Gravity (weaker up high → faster)", o.grav, C.teal], ["Speed (moving → slower)", o.vel, C.orange], ["Net", o.net, C.amber]];
    const maxv = 60, bx = x0 + 20, bw = rw - 40, mid = bx + bw / 2;
    rows.forEach(([name, val, col], i) => {
      const y = y0 + top + i * gap;
      g.text(name, bx, y, C.text, 13);
      g.line(mid, y + 12, mid, y + 34, C.muted);
      const w = Math.max(-1, Math.min(1, val / maxv)) * bw / 2;
      ctx.fillStyle = col; ctx.fillRect(w >= 0 ? mid : mid + w, y + 16, Math.abs(w), 14);
      g.label(`${val >= 0 ? "+" : ""}${val.toFixed(2)} µs/day`, bx + bw, y, col, 12, "right");
    });
    const km = Math.abs(o.net) * 1e-6 * c / 1000;
    g.text(CL.alt < 100 ? "On the ground: no difference (by definition)." : `Uncorrected, ${tall ? "positions" : "a navigation system"} would drift ~${km.toFixed(1)} km per day.`, bx, y0 + top + 3 * gap + 10, C.muted, 12);
    if (CL.alt >= 100) g.text(`Orbital speed: ${(o.v / 1000).toFixed(2)} km/s`, bx, y0 + top + 3 * gap + 32, C.muted, 12);
  }

  /* =====================================================================
     THE RIVER — Gullstrand–Painlevé "river model": space flows inward at
     v(r) = c·√(rs/r); light moves at c relative to the local flow.
     ===================================================================== */
  const RV = { dots: null, flashes: [], cursor: null, eddies: false, T: 0 };
  Chrono.lab.register({
    predict: { q: "A flash of light is fired straight outward from <b>just outside</b> a black hole's horizon. What happens to it?",
      options: ["It escapes easily", "It escapes, but crawls away very slowly at first", "It is swept in"], answer: 1,
      explain: "Just outside the horizon the inflow is almost light speed, so outward light barely gains ground — but the current weakens as it climbs, and it gets away. From inside the horizon it would be swept in. Press <b>Fire outward from 3 distances</b>: the middle flash starts just outside." },
    id: "river", title: "The River", eyebrow: "Lab · time and space near a black hole", tier: "mainstream", tags: ["ESTABLISHED"],
    enter() { if (!RV.dots) RV.dots = Array.from({ length: 520 }, () => ({ a: Math.random() * TAU, r: 0.3 + Math.random() * 5 })); },
    controls() {
      return `<span class="ctl">Click anywhere to fire a flash of light</span>
        <button class="btn" id="rv-radial">Fire outward from 3 distances</button>
        ${Chrono.shows("exploratory") ? `<label class="ctl exp-ctl"><input type="checkbox" id="rv-eddy" ${RV.eddies ? "checked" : ""}> ◌ Exploratory overlay: turbulent time river</label>` : ""}`;
    },
    wire() {
      $("#rv-radial").onclick = () => [2.6, 1.25, 0.8].forEach(k => fire(k, 0, true));
      const e = $("#rv-eddy"); if (e) e.onchange = ev => RV.eddies = ev.target.checked;
    },
    pointer(type, x, y) {
      const { cx, cy, Rs } = RV.geo || {}; if (!Rs) return;
      if (type === "pointermove") RV.cursor = [x, y];
      if (type === "pointerdown") { const dx = (x - cx) / Rs, dy = (y - cy) / Rs; fire(Math.hypot(dx, dy), Math.atan2(dy, dx), false); }
    },
    tick(dt) {
      RV.T += dt;
      if (!RV.geo || !dt) return;
      const cS = 0.9, k = 0.6;   // light speed in units of rs per second; k = shared playback rate for flow and light
      RV.dots.forEach(d => { const v = cS * Math.sqrt(1 / d.r); d.r -= v * dt * k; if (RV.eddies && Chrono.shows("exploratory")) d.a += dt * 0.3 * Math.sin(d.r * 3 + RV.T) / d.r; if (d.r < 0.08) { d.r = 4 + Math.random() * 1.5; d.a = Math.random() * TAU; } });
      RV.flashes.forEach(f => f.pts.forEach(p => {
        if (p.dead) return;
        const r = Math.hypot(p.x, p.y), ux = p.x / r, uy = p.y / r, v = cS * Math.sqrt(1 / r);
        p.x += (cS * p.nx - v * ux) * dt * k; p.y += (cS * p.ny - v * uy) * dt * k;
        p.trail.push([p.x, p.y]); if (p.trail.length > 60) p.trail.shift();
        if (r < 0.05 || r > 7) p.dead = true;
      }));
      RV.flashes = RV.flashes.filter(f => f.pts.some(p => !p.dead)).slice(-12);
    },
    draw(g) {
      const { W, H, ctx } = g, pad = 16;
      g.panel(pad, pad, W - pad * 2, H - pad * 2, "Space flowing into a black hole (top view)");
      const cx = W / 2, cy = H / 2 + 10, Rs = Math.min(W, H) * 0.11; RV.geo = { cx, cy, Rs };
      const P = (r, a) => [cx + r * Rs * Math.cos(a), cy + r * Rs * Math.sin(a)];
      RV.dots.forEach(d => { const [x, y] = P(d.r, d.a), v = Math.min(1.5, Math.sqrt(1 / d.r)); g.dot(x, y, 1.2, RV.eddies && Chrono.shows("exploratory") ? g.alpha(C.hyp, 0.5) : g.alpha(C.violet, 0.25 + 0.4 * Math.min(1, v))); });
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rs); grd.addColorStop(0, "#000"); grd.addColorStop(1, "#05060a");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, Rs, 0, TAU); ctx.fill();
      g.ring(cx, cy, Rs, C.orange, 2); g.label("horizon: the flow reaches light speed", cx, cy - Rs - 10, C.orange, 11, "center");
      RV.flashes.forEach(f => f.pts.forEach(p => {
        if (p.trail.length > 1) { ctx.strokeStyle = g.alpha(C.amber, 0.35); ctx.beginPath(); p.trail.forEach(([x, y], i) => { const q = [cx + x * Rs, cy + y * Rs]; i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); }
        if (!p.dead) g.dot(cx + p.x * Rs, cy + p.y * Rs, 2.2, C.amber);
      }));
      if (RV.cursor) {
        const [x, y] = RV.cursor, r = Math.hypot(x - cx, y - cy) / Rs;
        const txt = r > 1 ? `Here: flow ${Math.sqrt(1 / r).toFixed(2)} c · a clock held still ticks at ${(Math.sqrt(1 - 1 / r) * 100).toFixed(0)}% of a distant clock's rate` : "Inside the horizon: the flow outruns light — nothing can stay still";
        g.text(txt, pad + 14, H - pad - 14, C.text, 12);
      }
      g.label("Sideways light-bending simplified; radial motion exact.", W - pad - 14, W < 640 ? pad + 40 : H - pad - 14, C.muted, 10, "right");
      if (RV.eddies && Chrono.shows("exploratory")) { ctx.fillStyle = g.alpha(C.hyp, 0.12); ctx.fillRect(pad + 1, pad + 26, W - pad * 2 - 2, 26); g.label("◌ EXPLORATORY OVERLAY — this project's turbulent-time idea. Illustrative only: no equations, not mainstream physics.", pad + 12, pad + 43, C.hyp, 11); }
    },
    aside: () => `
      <p>One exact way to picture a black hole: <b>space itself flows inward like a river</b>, faster and faster as it approaches the centre (Hamilton &amp; Lisle, 2008). Light always moves at light speed <i>relative to the water around it</i>.</p>
      <p>Far out, the current is gentle and light swims away easily. At the <b>horizon</b> the current reaches light speed: light aimed outward just holds its place. Inside, even outward-pointing light is swept in.</p>
      <div class="try"><b>Try:</b> press <b>Fire outward from 3 distances</b>. Then hover to see how slowly a clock held still near the horizon ticks — the same slowing as the Clock Lab, caused here by gravity.</div>
      <p>This is <i>where</i> the Atlas hole <a href="#" data-hole="H7">H7 — Time at the edge</a> lives: at the horizon, space and time swap roles.</p>
      ${Chrono.shows("exploratory") ? `<div class="exp-box">${Chrono.expBanner()}<p>The optional overlay adds eddies to the flow — this project's picture of time as a <b>turbulent river</b>. It is illustrative only, with no equations behind it.</p></div>` : ""}`,
    next: { q: "At the horizon, space and time trade places. What if there were a second time direction to trade with?", href: "#films", label: "Two Films" },
    sources: "A. Hamilton & J. Lisle, 'The river model of black holes', Am. J. Phys. 76, 519 (2008)."
  });
  function fire(r, a, radialOnly) {
    const x = r * Math.cos(a), y = r * Math.sin(a), pts = [];
    if (radialOnly) { const n = 3; for (let i = 0; i < n; i++) { const b = -Math.PI / 2 + (i - 1) * 0.5, px = r * Math.cos(b), py = r * Math.sin(b); pts.push({ x: px, y: py, nx: Math.cos(b), ny: Math.sin(b), trail: [] }); } RV.flashes.push({ pts }); return; }
    for (let i = 0; i < 40; i++) { const b = i / 40 * TAU; pts.push({ x, y, nx: Math.cos(b), ny: Math.sin(b), trail: [] }); }
    RV.flashes.push({ pts });
  }

  /* =====================================================================
     TWO FILMS — exact solutions of u_tt + u_ss − u_xx = 0 (two times t, s)
     u_A = cos2x·cos2t ;  u_B = u_A + ε·cos3x·[cos3t − cos(√5 t)·cos2s]
     ===================================================================== */
  const TF = { t: 0, play: false, eps: 0.35, reveal: false, img: null };
  const S5 = Math.sqrt(5);
  const uA = (x, t) => Math.cos(2 * x) * Math.cos(2 * t);
  const uB = (x, t, s) => uA(x, t) + TF.eps * Math.cos(3 * x) * (Math.cos(3 * t) - Math.cos(S5 * t) * Math.cos(2 * s));
  Chrono.lab.register({
    predict: { q: "Two films start from <b>exactly</b> the same frame — same shape, same rate of change in every direction. You press play. Do they stay identical?",
      options: ["Yes — same start, same future", "They drift apart, but only through rounding errors", "They genuinely diverge"], answer: 2,
      explain: "Both films are exact solutions — no rounding is involved. With two time directions, even a perfect snapshot of 'now' isn't enough data to fix the future (Craig &amp; Weinstein, 2009). In our one-time universe, it is." },
    id: "films", title: "Two Films", eyebrow: "Lab · prediction with two times", tier: "frontier", tags: ["ESTABLISHED", "SPECULATIVE"],
    controls() {
      return `<button class="btn primary" id="tf-play">${TF.play ? "Pause" : TF.t > 0 ? "Continue" : "Predict ▶"}</button>
        <button class="btn" id="tf-reset">Back to the starting frame</button>
        <button class="btn ${TF.reveal ? "primary" : ""}" id="tf-reveal">${TF.reveal ? "Hide" : "Reveal"} the hidden time direction</button>
        <label class="ctl">Difference size ε <input type="range" id="tf-eps" min="10" max="60" value="${Math.round(TF.eps * 100)}"></label>`;
    },
    wire() {
      $("#tf-play").onclick = () => { TF.play = !TF.play; Chrono.lab.rebuild(); };
      $("#tf-reset").onclick = () => { TF.t = 0; TF.play = false; Chrono.lab.rebuild(); };
      $("#tf-reveal").onclick = () => { TF.reveal = !TF.reveal; Chrono.lab.rebuild(); };
      $("#tf-eps").oninput = e => TF.eps = e.target.value / 100;
    },
    tick(dt) { if (TF.play) { TF.t += dt * 0.6; if (TF.t > 12) TF.t = 12; } },
    draw(g) {
      const { W, H, ctx } = g, pad = 16, topH = TF.reveal ? (H - pad * 3) * 0.48 : (H - pad * 3) * 0.5;
      const plot = (x0, y0, w, h, title, t, s, both) => {
        g.panel(x0, y0, w, h, title);
        const cy = y0 + h / 2 + 10, amp = h * 0.28, ox = x0 + 20, ww = w - 40;
        g.line(ox, cy, ox + ww, cy, C.line);
        [[x => uA(x, t), C.accent, 3], [x => uB(x, t, s), C.pink, 1.8]].forEach(([f, col, lw]) => {
          ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
          for (let i = 0; i <= 240; i++) { const x = i / 240 * TAU, y = cy - f(x) * amp; i ? ctx.lineTo(ox + i / 240 * ww, y) : ctx.moveTo(ox, y); }
          ctx.stroke(); ctx.lineWidth = 1;
        });
      };
      if (!TF.reveal) {
        plot(pad, pad, W - pad * 2, topH, "The starting frame (t = 0) — both films", 0, 0);
        g.text(W < 760 ? "Same shape and rates of change in t and s." : "Film A (blue) and Film B (pink) have identical shape, identical rate of change in t, and identical rate of change in s here.", pad + 20, pad + topH - 16, C.muted, 12);
        plot(pad, pad * 2 + topH, W - pad * 2, topH, `The prediction at t = ${TF.t.toFixed(2)} (still at s = 0)`, TF.t, 0);
        let d = 0; for (let i = 0; i <= 120; i++) { const x = i / 120 * TAU; d = Math.max(d, Math.abs(uB(x, TF.t, 0) - uA(x, TF.t))); }
        g.text(`Largest difference between the films: ${d.toFixed(3)}`, pad + 20, H - pad - 16, d > 0.05 ? C.pink : C.muted, 13);
      } else {
        const tall = H > W * 1.05, hw = tall ? W - pad * 2 : (W - pad * 3) / 2, hh = tall ? (H - pad * 3) / 2 : H - pad * 2;
        [["Film A — every s looks the same", (x, s) => uA(x, TF.t)], ["Film B — it was different away from s = 0 all along", (x, s) => uB(x, TF.t, s)]].forEach(([title, f], k) => {
          const x0 = tall ? pad : pad + k * (hw + pad), y0 = tall ? pad + k * (hh + pad) : pad; g.panel(x0, y0, hw, hh, `${title} (t = ${TF.t.toFixed(2)})`);
          const gw = 160, gh = 110, img = ctx.createImageData(gw, gh);
          for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
            const x = i / gw * TAU, s = (j / (gh - 1) - 0.5) * TAU, v = Math.max(-1, Math.min(1, f(x, s) / 1.3)), o = (j * gw + i) * 4;
            const a = Math.abs(v); img.data[o] = v > 0 ? 227 * a + 11 * (1 - a) : 124 * a + 11 * (1 - a); img.data[o + 1] = v > 0 ? 107 * a + 13 * (1 - a) : 196 * a + 13 * (1 - a); img.data[o + 2] = v > 0 ? 208 * a + 18 * (1 - a) : 255 * a + 18 * (1 - a); img.data[o + 3] = 255;
          }
          const off = document.createElement("canvas"); off.width = gw; off.height = gh; off.getContext("2d").putImageData(img, 0, 0);
          const dx = x0 + 40, dy = y0 + 40, dw = hw - 60, dh = hh - 90;
          ctx.imageSmoothingEnabled = true; ctx.drawImage(off, dx, dy, dw, dh);
          g.line(dx, dy + dh / 2, dx + dw, dy + dh / 2, C.text, 1.5); g.label("s = 0 — the only slice we could observe", dx + 6, dy + dh / 2 - 6, C.text, 10);
          g.label("x →", dx + dw - 30, dy + dh + 16, C.muted, 10); g.label("s (second time) ↑", dx - 30, dy - 8, C.muted, 10);
        });
      }
    },
    aside: () => `
      <p>Suppose a universe had <b>two time directions</b>, t and s. Could you predict its future if you knew everything about the present moment?</p>
      <p>These two "films" are exact solutions of a wave equation with two times (u<sub>tt</sub> + u<sub>ss</sub> − u<sub>xx</sub> = 0). At the starting frame they are <b>identical</b> — same shape, same rates of change in both t and s. Press <b>Predict</b>: they separate anyway.</p>
      <div class="try"><b>Try:</b> predict, then <b>Reveal the hidden time direction</b>. Along s = 0 — the only slice we saw — the two films matched. Everywhere else in s, Film B was different from the start.</div>
      <p><b>"The frame was accurate. It just wasn't enough data."</b></p>
      <p class="meta">Maths: ESTABLISHED (a periodic toy example of the non-uniqueness Craig &amp; Weinstein, 2009, describe). Relevance to our universe: SPECULATIVE. Check it yourself: substitute either film into the equation — both satisfy it exactly.</p>
      <p>Compare <a href="#" data-view-link="flatland">Flatland chapter 7</a>: with one time, "now" is a single slice through the block. With two, a moment is only a line through a time <i>plane</i> — and a line leaves out too much.</p>`,
    next: { q: "So is one time dimension a law of nature? See who has tried to explain it — and how far they got.", href: "#atlas/H5", label: "Atlas · hole H5" },
    sources: "W. Craig & S. Weinstein, 'On determinism and well-posedness in multiple time dimensions', Proc. R. Soc. A 465 (2009)."
  });
})();
