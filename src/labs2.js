/* Chronoscope — Labs: Spacetime diagram and Entropy box. Real equations; model assumptions on screen.
   Spacetime: exact Lorentz transformations (special relativity, c = 1).
   Entropy box: soft discs under Newton's laws, integrated in integer arithmetic so that reversing every
   velocity retraces the motion exactly (Levesque & Verlet, 1993). */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;

  /* =====================================================================
     SPACETIME DIAGRAM — whose "now"? and the twin paradox
     ===================================================================== */
  const gam = v => 1 / Math.sqrt(1 - v * v);
  const boost = (t, x, u) => { const g = gam(u); return [g * (t - u * x), g * (x - u * t)]; };   // (t, x) seen from a frame moving at u
  const relV = (a, b) => (a - b) / (1 - a * b);                                                   // velocity a, seen from a frame moving at b
  const EVENTS0 = [{ id: "A", t: 3, x: -3 }, { id: "B", t: 3, x: 3 }, { id: "C", t: 5.5, x: 0.5 }];
  const SP = { mode: "now", v: 0.6, view: 0, viewTarget: 0, drag: null, geo: null,
    events: EVENTS0.map(e => ({ ...e })), twinV: 0.8, twinD: 4, twinT: 0, play: true, hyp: false,
    pbV: 0.8, pbView: 0, pbTarget: 0, pbT: 0.5 };
  /* Pole and barn (after Tao's applet scene): barn from x = −2 to 2 (length 4); pole of rest length 5, centred in the
     barn at t = 4 (barn frame); both doors shut for a moment at t = 4 in the barn frame. Everything else follows. */
  const PB = { barn: 4, pole: 5, t0: 4, shut: 0.15 };

  function orderText(times) {
    const s = times.slice().sort((a, b) => a.t - b.t);
    return s.map((e, i) => (i ? (Math.abs(e.t - s[i - 1].t) < 0.05 ? " = " : " → ") : "") + e.id).join("");
  }

  function drawNow(g) {
    const { ctx } = g, { A, B } = g.split(0.64), d = SP.view, theirs = Math.abs(d - SP.v) < 0.02 && SP.v !== 0;
    g.panel(A.x, A.y, A.w, A.h, theirs ? "Spacetime drawn the moving observer's way" : "Spacetime drawn your way");
    const s = Math.min(A.w / 13.5, (A.h - 44) / 9.6), ox = A.x + A.w / 2, oy = A.y + A.h - 18 - s;
    const P = (t, x) => [ox + x * s, oy - t * s];
    SP.geo = { s, ox, oy };
    ctx.save(); ctx.beginPath(); ctx.rect(A.x + 1, A.y + 26, A.w - 2, A.h - 27); ctx.clip();
    for (let x = -8; x <= 8; x++) g.line(...P(-2, x), ...P(10, x), "rgba(255,255,255,0.035)");
    for (let t = -2; t <= 10; t++) g.line(...P(t, -8), ...P(t, 8), "rgba(255,255,255,0.035)");
    // light cone of the origin event (same in every frame)
    ctx.fillStyle = g.alpha(C.amber, 0.05); ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(10, -10)); ctx.lineTo(...P(10, 10)); ctx.closePath(); ctx.fill();
    [[10, 10], [10, -10], [-2, 2], [-2, -2]].forEach(([t, x]) => g.line(...P(0, 0), ...P(t, x), g.alpha(C.amber, 0.35), 1));
    if (SP.hyp) {                                          // t² − x² = const: the same curves in every frame
      const curve = f => { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const q = P(...f(-3 + i * 6 / 80)); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); };
      ctx.lineWidth = 1;
      for (let k = 1; k <= 9; k++) {
        ctx.strokeStyle = g.alpha(C.teal, k % 3 ? 0.18 : 0.4); curve(h => [k * Math.cosh(h), k * Math.sinh(h)]);
        ctx.strokeStyle = g.alpha(C.violet || "#9b8cff", 0.14); curve(h => [k * Math.sinh(h), k * Math.cosh(h)]); curve(h => [k * Math.sinh(h), -k * Math.cosh(h)]);
        if (k % 3 === 0) g.label(`τ = ${k}`, ...P(k + 0.15, 0.1), g.alpha(C.teal, 0.8), 9);
      }
    }
    // the two observers: their clocks' paths and their "now" lines
    [[0, C.accent, "you"], [SP.v, C.orange, "moving observer"]].forEach(([vf, col, who]) => {
      const u = relV(vf, d);
      g.line(...P(-2, -2 * u), ...P(10, 10 * u), col, 2);
      g.line(...P(-8 * u, -8), ...P(8 * u, 8), g.alpha(col, 0.8), 1.5);
      const [lx, ly] = P(6.8, 6.8 * u); g.label(who === "you" ? "your clock" : "their clock", lx + 6, ly + 12, col, 10);
      const [nx, ny] = P(6.4 * u, 6.4); g.label(who === "you" ? "your 'now'" : "their 'now'", nx - 4, ny - 6, col, 10, "right");
    });
    // events, with each observer's "now" through them
    const disp = SP.events.map(e => { const [t, x] = boost(e.t, e.x, d); return { ...e, dt: t, dx: x }; });
    disp.forEach(e => [[0, C.accent], [SP.v, C.orange]].forEach(([vf, col]) => {
      const u = relV(vf, d); ctx.setLineDash([3, 5]); g.line(...P(e.dt + u * (-8 - e.dx), -8), ...P(e.dt + u * (8 - e.dx), 8), g.alpha(col, 0.35), 1); ctx.setLineDash([]);
    }));
    disp.forEach(e => { const [px, py] = P(e.dt, e.dx); ctx.shadowColor = C.pink; ctx.shadowBlur = 10; g.dot(px, py, 7, C.pink); ctx.shadowBlur = 0; g.label(e.id, px, py + 4, C.bg, 11, "center"); });
    ctx.restore();
    g.label("space →", A.x + A.w - 14, oy + 14, C.muted, 10, "right");
    g.label("time ↑", ox + 6, A.y + 40, C.muted, 10);

    // the table: when does each event happen, for each observer?
    g.panel(B.x, B.y, B.w, B.h, "When does each event happen?");
    const mine = SP.events.map(e => ({ id: e.id, t: e.t })), theirsT = SP.events.map(e => ({ id: e.id, t: boost(e.t, e.x, SP.v)[0] }));
    const x0 = B.x + 14, c1 = B.x + B.w * 0.36, c2 = B.x + B.w * 0.66;
    let y = B.y + 48;
    const c3 = B.x + B.w - 14;
    g.label("EVENT", x0, y, C.muted, 10); g.label(B.w < 420 ? "YOURS" : "YOUR TIME", c1, y, C.accent, 10); g.label(B.w < 420 ? "THEIRS" : "THEIR TIME", c2, y, C.orange, 10); g.label("t² − x²", c3, y, C.teal, 10, "right");
    SP.events.forEach((e, i) => { y += 22; g.label(e.id, x0, y, C.pink, 13); g.label(mine[i].t.toFixed(2), c1, y, C.text, 13); g.label(theirsT[i].t.toFixed(2), c2, y, C.text, 13); g.label((e.t * e.t - e.x * e.x).toFixed(1), c3, y, C.teal, 13, "right"); });
    y += 16; g.label("t² − x²: the same for both (the interval)", x0, y, C.muted, 10);
    y += 34; g.text(`Your order: ${orderText(mine)}`, x0, y, C.accent, 13);
    y += 20; g.text(`Their order: ${orderText(theirsT)}`, x0, y, C.orange, 13);
    const swapped = [];
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
      const dm = mine[i].t - mine[j].t, dt = theirsT[i].t - theirsT[j].t;
      if ((Math.abs(dm) > 0.05 || Math.abs(dt) > 0.05) && dm * dt <= 0) swapped.push(SP.events[i].id + SP.events[j].id);
    }
    y += 28;
    if (swapped.length) {
      g.text(`Order differs for ${swapped.map(p => p[0] + " and " + p[1]).join(", ")}.`, x0, y, C.pink, 13);
      y += 18; g.label("Only possible for events outside each other's light", x0, y, C.muted, 11, "left", "Inter, sans-serif");
      y += 15; g.label("cones — no signal could pass between them.", x0, y, C.muted, 11, "left", "Inter, sans-serif");
    } else g.label("Same order for both — try a higher speed, or drag the events.", x0, y, C.muted, 11, "left", "Inter, sans-serif");
    if (y < B.y + B.h - 36) g.label("Model: special relativity, flat spacetime, c = 1.", x0, B.y + B.h - 14, C.muted, 10);
  }

  function drawTwins(g) {
    const { ctx } = g, { A, B } = g.split(0.64);
    const v = SP.twinV, D = SP.twinD, ga = gam(v), half = D / v, T = 2 * half, tc = Math.min(SP.twinT, T);
    g.panel(A.x, A.y, A.w, A.h, "Twin paradox — drawn in Earth's frame (years, light-years)");
    const s = Math.min((A.w - 110) / (D + 1.2), (A.h - 70) / (T * 1.03)), ox = A.x + 70, oy = A.y + A.h - 28;
    const P = (t, x) => [ox + x * s, oy - t * s];
    const trav = t => (t <= half ? v * t : D - v * (t - half));
    g.line(...P(0, 0), ...P(Math.min(T, (A.w - 90) / s), Math.min(T, (A.w - 90) / s)), g.alpha(C.amber, 0.3), 1);
    g.line(...P(0, 0), ...P(T, 0), C.accent, 2.5);
    g.line(...P(0, 0), ...P(half, D), C.orange, 2.5); g.line(...P(half, D), ...P(T, 0), C.orange, 2.5);
    const step = T > 40 ? 5 : T > 16 ? 2 : 1;
    for (let k = step; k < T - 1e-9; k += step) { const [x, y] = P(k, 0); g.line(x - 5, y, x + 5, y, C.accent, 1.5); if (k % (step * 2) === 0 || step > 1) g.label(String(k), x - 9, y + 4, C.muted, 9, "right"); }
    for (let tau = step; tau < T / ga - 1e-9; tau += step) { const t = tau * ga, [x, y] = P(t, trav(t)); g.dot(x, y, 2.6, C.orange); }
    // the traveller's "now" just before and just after the turnaround
    const tb = half - v * D, ta = half + v * D;
    ctx.setLineDash([4, 5]); g.line(...P(half, D), ...P(tb, 0), g.alpha(C.orange, 0.7), 1); g.line(...P(half, D), ...P(ta, 0), g.alpha(C.orange, 0.7), 1); ctx.setLineDash([]);
    g.line(...P(tb, 0), ...P(ta, 0), C.pink, 5);
    const [jx, jy] = P((tb + ta) / 2, 0); g.label(`'now' swings: ${(ta - tb).toFixed(1)} yr`, jx + 10, jy + 4, C.pink, 11);
    g.label("Earth", ...P(T, 0).map((q, i) => q + (i ? -8 : -18)), C.accent, 11);
    const [sx, sy] = P(half, D); g.label(`star, ${D} ly`, sx + 8, sy + 4, C.orange, 11);
    const [ex, ey] = P(tc, 0), [qx, qy] = P(tc, trav(tc));
    g.dot(ex, ey, 6, C.accent); g.dot(qx, qy, 6, C.orange);

    g.panel(B.x, B.y, B.w, B.h, "Who ages how much?");
    const x0 = B.x + 14; let y = B.y + 50;
    g.text(`Speed ${v.toFixed(2)} c · star ${D} light-years away · γ = ${ga.toFixed(3)}`, x0, y, C.text, 12);
    y += 32; g.label(`RIGHT NOW (Earth frame t = ${tc.toFixed(1)} yr)`, x0, y, C.muted, 10);
    y += 20; g.text(`Earth twin's clock ${tc.toFixed(1)} · traveller's clock ${(tc / ga).toFixed(1)}`, x0, y, C.text, 12);
    y += 30; g.label("Dots on each path: one per " + (step === 1 ? "year" : step + " years") + " of that twin's own time.", x0, y, C.muted, 11, "left", "Inter, sans-serif");
    g.label("Model: special relativity, instant turnaround.", x0, B.y + B.h - 14, C.muted, 10);
  }

  function drawBarn(g) {
    const { ctx } = g, { A, B } = g.split(0.62), v = SP.pbV, ga = gam(v), d = SP.pbView, half = PB.pole / (2 * ga), fits = half < PB.barn / 2;
    const inPole = Math.abs(d - v) < 0.02;
    g.panel(A.x, A.y, A.w, A.h, inPole ? "Pole and barn — drawn in the pole's frame" : Math.abs(d) < 0.02 ? "Pole and barn — drawn in the barn's frame" : "Pole and barn — changing frame…");
    const s = Math.min(A.w / 13.5, (A.h - 44) / 11), ox = A.x + A.w / 2, oy = A.y + A.h - 18 - s * 1.2;
    const P = (t, x) => [ox + x * s, oy - t * s];
    const tr = (t, x) => { const [a, b] = boost(t - PB.t0, x, d); return [PB.t0 + a, b]; };   // barn-frame event → display frame
    const wl = xAt => [tr(-30, xAt(-30)), tr(40, xAt(40))];                                    // a straight worldline, as two display points
    const xAtT = (L, T) => L[0][1] + (T - L[0][0]) * (L[1][1] - L[0][1]) / (L[1][0] - L[0][0]);
    const lines = { back: wl(() => -PB.barn / 2), front: wl(() => PB.barn / 2), rear: wl(t => -half + v * (t - PB.t0)), nose: wl(t => half + v * (t - PB.t0)) };
    const doors = [["entrance door", -PB.barn / 2], ["exit door", PB.barn / 2]].map(([n, x]) => ({ n, a: tr(PB.t0 - PB.shut, x), b: tr(PB.t0 + PB.shut, x), e: tr(PB.t0, x) }));
    ctx.save(); ctx.beginPath(); ctx.rect(A.x + 1, A.y + 26, A.w - 2, A.h - 27); ctx.clip();
    for (let t = -2; t <= 11; t++) g.line(...P(t, -8), ...P(t, 8), "rgba(255,255,255,0.035)");
    ctx.fillStyle = g.alpha(C.orange, 0.13); ctx.beginPath(); ctx.moveTo(...P(...lines.rear[0])); ctx.lineTo(...P(...lines.nose[0])); ctx.lineTo(...P(...lines.nose[1])); ctx.lineTo(...P(...lines.rear[1])); ctx.closePath(); ctx.fill();
    [lines.rear, lines.nose].forEach(L => g.line(...P(...L[0]), ...P(...L[1]), C.orange, 2));
    [lines.back, lines.front].forEach(L => g.line(...P(...L[0]), ...P(...L[1]), C.accent, 2));
    doors.forEach(D => { g.line(...P(...D.a), ...P(...D.b), C.pink, 7); });
    doors.forEach(D => { const [px, py] = P(...D.e); g.label(`${D.n} shuts`, px + 8, py + 4, C.pink, 10); });
    // the display frame's 'now', sweeping upward
    g.line(...P(SP.pbT, -8), ...P(SP.pbT, 8), g.alpha(C.text, 0.5), 1);
    ctx.restore();
    g.label("space →", A.x + A.w - 14, oy + 14, C.muted, 10, "right"); g.label("time ↑", ox + 6, A.y + 40, C.muted, 10);
    g.label("blue: the barn's walls · orange: the pole · pink: a door shut", A.x + 14, A.y + A.h - 10, C.muted, 10);

    g.panel(B.x, B.y, B.w, B.h, "What you'd see at the white 'now' line");
    const x0 = B.x + 14, T = SP.pbT, sx = (B.w - 40) / 13, mid = B.x + B.w / 2, sy = B.y + 70;
    const X = x => mid + x * sx, xb = xAtT(lines.back, T), xf = xAtT(lines.front, T), xr = xAtT(lines.rear, T), xn = xAtT(lines.nose, T);
    ctx.fillStyle = g.alpha(C.accent, 0.08); ctx.fillRect(X(xb), sy - 22, X(xf) - X(xb), 44);
    g.line(X(xb), sy - 22, X(xf), sy - 22, C.accent, 2); g.line(X(xb), sy + 22, X(xf), sy + 22, C.accent, 2);
    doors.forEach((D, i) => { const lo = Math.min(D.a[0], D.b[0]), hi = Math.max(D.a[0], D.b[0]), shut = T >= lo && T <= hi, x = X(i ? xf : xb);
      g.line(x, sy - 22, x, sy + 22, shut ? C.pink : g.alpha(C.accent, 0.25), shut ? 4 : 1); });
    ctx.fillStyle = C.orange; ctx.fillRect(X(xr), sy - 5, X(xn) - X(xr), 10);
    g.label(`t = ${T.toFixed(1)}`, x0, B.y + 42, C.muted, 10);
    let y = sy + 50;
    const tIn = doors[0].e[0], tOut = doors[1].e[0], same = Math.abs(tIn - tOut) < 0.02;
    y += g.wrap(`Barn's frame: the moving pole is ${(PB.pole / ga).toFixed(2)} long (rest length 5); the barn is 4. ${fits ? "It fits." : "It doesn't fit."}`, x0, y, B.w - 28, 16, C.accent, 12) + 6;
    y += g.wrap(`Pole's frame: the moving barn is ${(PB.barn / ga).toFixed(2)} long; the pole is 5. It never fits.`, x0, y, B.w - 28, 16, C.orange, 12) + 10;
    y += g.wrap(same ? "In this frame both doors shut at the same moment." : `In this frame the ${tOut < tIn ? "exit" : "entrance"} door shuts first — ${Math.abs(tIn - tOut).toFixed(2)} time units before the other.`, x0, y, B.w - 28, 16, C.text, 12) + 10;
    y += g.wrap(fits ? "Neither door touches the pole, in either frame. Whether the door hits the pole is a single event — everyone agrees on it." : "At this speed the doors hit the pole — in every frame. A collision is an event, and everyone agrees on events.", x0, y, B.w - 28, 16, fits ? C.teal : C.pink, 12);
    g.label("Model: special relativity, c = 1.", x0, B.y + B.h - 14, C.muted, 10);
  }

  Chrono.lab.register({
    predict: { q: "Two lamps, far apart, flash at <b>exactly the same moment</b> for you. Someone flies past at high speed. For them, do the flashes still happen together?",
      options: ["Yes — 'the same moment' is the same for everyone", "No — for them one flash comes first", "Only if they fly exactly between the lamps"], answer: 1,
      explain: "Relativity has no single 'now' shared by everyone: each observer's line of simultaneity tilts with their speed. For events too far apart for any signal to connect them, different observers can even disagree about which came first. Events A and B start out as your two lamps — set the speed and read the table." },
    applySetup(o) { Object.assign(SP, o); SP.twinT = 0; SP.view = SP.viewTarget = 0; SP.pbView = SP.pbTarget = 0; },
    state() {                                              // read-only, for missions
      const A = SP.events.find(e => e.id === "A"), B = SP.events.find(e => e.id === "B"), g = gam(SP.twinV), T = 2 * SP.twinD / SP.twinV;
      return { mode: SP.mode, v: SP.v, simul: Math.abs(A.t - B.t) < 0.1, aFirst: boost(A.t, A.x, SP.v)[0] < boost(B.t, B.x, SP.v)[0] - 0.1,
        twinDiff: T - T / g, pbV: SP.pbV, fits: PB.pole / (2 * gam(SP.pbV)) < PB.barn / 2 };
    },
    readouts() {                                           // headline numbers for the readout bar (3b)
      if (SP.mode === "twins") { const ga = gam(SP.twinV), T = 2 * SP.twinD / SP.twinV;
        return [["Earth twin ages", `${T.toFixed(2)} yr`], ["Traveller ages", `${(T / ga).toFixed(2)} yr`], ["Difference", `${(T - T / ga).toFixed(2)} yr`]]; }
      if (SP.mode === "barn") { const ga = gam(SP.pbV), len = PB.pole / ga;
        return [["Pole speed", `${SP.pbV.toFixed(2)} c`], ["Pole length, barn's frame", `${len.toFixed(2)} (barn 4)`], ["Fits in the barn's frame", len < PB.barn ? "Yes" : "No"]]; }
      return [["Your speed", `${SP.v.toFixed(2)} c`], ["γ", gam(SP.v).toFixed(3)]];
    },
    id: "spacetime", title: "Spacetime diagram", eyebrow: "Lab · whose 'now'?", tier: "mainstream", tags: ["ESTABLISHED"],
    controls() {
      return `<button class="btn ${SP.mode === "now" ? "primary" : ""}" id="sp-now">Whose 'now'?</button>
        <button class="btn ${SP.mode === "twins" ? "primary" : ""}" id="sp-twins">Twin paradox</button>
        <button class="btn ${SP.mode === "barn" ? "primary" : ""}" id="sp-barn">Pole and barn</button>
        ${SP.mode === "barn" ? `<label class="ctl">Pole's speed <input type="range" id="pb-v" min="30" max="90" value="${Math.round(SP.pbV * 100)}"><output id="pb-vo">${SP.pbV.toFixed(2)} c</output></label>
          <button class="btn ${SP.pbTarget === 0 ? "primary" : ""}" id="pb-barn">Barn's frame</button>
          <button class="btn ${SP.pbTarget !== 0 ? "primary" : ""}" id="pb-pole">Pole's frame</button>
          <button class="btn" id="tw-play">${SP.play ? "Pause" : "Play"}</button>`
        : SP.mode === "now" ? `<label class="ctl">Moving observer's speed <input type="range" id="sp-v" min="-90" max="90" value="${Math.round(SP.v * 100)}"><output id="sp-vo">${SP.v.toFixed(2)} c</output></label>
          <button class="btn ${SP.viewTarget === 0 ? "primary" : ""}" id="sp-mine">Draw it your way</button>
          <button class="btn ${SP.viewTarget !== 0 ? "primary" : ""}" id="sp-theirs">Draw it their way</button>
          <button class="btn" id="sp-reset">Reset events</button>
          <label class="ctl"><input type="checkbox" id="sp-hyp" ${SP.hyp ? "checked" : ""}> Equal-interval curves</label><span class="ctl">Drag the events</span>`
        : `<label class="ctl">Speed <input type="range" id="tw-v" min="30" max="99" value="${Math.round(SP.twinV * 100)}"><output id="tw-vo">${SP.twinV.toFixed(2)} c</output></label>
          <label class="ctl">Distance <input type="range" id="tw-d" min="1" max="10" value="${SP.twinD}"><output id="tw-do">${SP.twinD} ly</output></label>
          <button class="btn" id="tw-play">${SP.play ? "Pause" : "Play"}</button>`}`;
    },
    wire() {
      $("#sp-now").onclick = () => { SP.mode = "now"; Chrono.lab.rebuild(); };
      $("#sp-twins").onclick = () => { SP.mode = "twins"; SP.twinT = 0; Chrono.lab.rebuild(); };
      $("#sp-barn").onclick = () => { SP.mode = "barn"; SP.pbT = 0.5; Chrono.lab.rebuild(); };
      const pv = $("#pb-v"); if (pv) pv.oninput = e => { SP.pbV = e.target.value / 100; $("#pb-vo").textContent = SP.pbV.toFixed(2) + " c"; if (SP.pbTarget !== 0) SP.pbTarget = SP.pbV; };
      const pbb = $("#pb-barn"); if (pbb) pbb.onclick = () => { SP.pbTarget = 0; SP.pbT = 0.5; Chrono.lab.rebuild(); };
      const pbp = $("#pb-pole"); if (pbp) pbp.onclick = () => { SP.pbTarget = SP.pbV; SP.pbT = -1.5; Chrono.lab.rebuild(); };
      const hy = $("#sp-hyp"); if (hy) hy.onchange = e => { SP.hyp = e.target.checked; };
      const v = $("#sp-v"); if (v) v.oninput = e => { SP.v = e.target.value / 100; $("#sp-vo").textContent = SP.v.toFixed(2) + " c"; if (SP.viewTarget !== 0) SP.viewTarget = SP.v; };
      const m = $("#sp-mine"); if (m) m.onclick = () => { SP.viewTarget = 0; Chrono.lab.rebuild(); };
      const t = $("#sp-theirs"); if (t) t.onclick = () => { SP.viewTarget = SP.v; Chrono.lab.rebuild(); };
      const r = $("#sp-reset"); if (r) r.onclick = () => { SP.events = EVENTS0.map(e => ({ ...e })); };
      const tv = $("#tw-v"); if (tv) tv.oninput = e => { SP.twinV = e.target.value / 100; $("#tw-vo").textContent = SP.twinV.toFixed(2) + " c"; SP.twinT = 0; };
      const td = $("#tw-d"); if (td) td.oninput = e => { SP.twinD = +e.target.value; $("#tw-do").textContent = SP.twinD + " ly"; SP.twinT = 0; };
      const tp = $("#tw-play"); if (tp) tp.onclick = () => { SP.play = !SP.play; tp.textContent = SP.play ? "Pause" : "Play"; };
    },
    tick(dt) {
      SP.view += (SP.viewTarget - SP.view) * Math.min(1, dt * 3);
      if (Math.abs(SP.viewTarget - SP.view) < 1e-4) SP.view = SP.viewTarget;
      SP.pbView += (SP.pbTarget - SP.pbView) * Math.min(1, dt * 3);
      if (Math.abs(SP.pbTarget - SP.pbView) < 1e-4) SP.pbView = SP.pbTarget;
      if (SP.mode === "barn" && SP.play) { SP.pbT += dt * 0.9; if (SP.pbT > 10) SP.pbT = SP.pbTarget ? -1.5 : 0.5; }
      if (SP.mode === "twins" && SP.play) { const T = 2 * SP.twinD / SP.twinV; SP.twinT += dt * T / 9; if (SP.twinT > T + T * 0.15) SP.twinT = 0; }
    },
    draw(g) { SP.mode === "now" ? drawNow(g) : SP.mode === "twins" ? drawTwins(g) : drawBarn(g); },
    pointer(type, px, py) {
      if (SP.mode !== "now" || !SP.geo) return;
      const { s, ox, oy } = SP.geo, d = SP.view;
      const toDisp = (x, y) => [(oy - y) / s, (x - ox) / s];
      if (type === "pointerdown") {
        let best = null, bd = 18;
        SP.events.forEach(e => { const [t, x] = boost(e.t, e.x, d), q = Math.hypot(ox + x * s - px, oy - t * s - py); if (q < bd) { bd = q; best = e; } });
        SP.drag = best;
      } else if (type === "pointermove" && SP.drag) {
        let [t, x] = toDisp(px, py); t = Math.max(-1, Math.min(9, t)); x = Math.max(-6.5, Math.min(6.5, x));
        const [rt, rx] = boost(t, x, -d); SP.drag.t = rt; SP.drag.x = rx;
      } else if (type === "pointerup") SP.drag = null;
    },
    aside: () => SP.mode === "barn" ? `
      <p>A classic puzzle. A pole 5 units long races through a barn only 4 units long. In the barn's frame the moving pole is shorter — at 0.8 c, just 3 — so for an instant both doors can be shut with the pole inside.</p>
      <p>But in the pole's frame it's the <b>barn</b> that's moving and short: 2.4. A 5-unit pole can't fit in 2.4. Who's right?</p>
      <div class="try"><b>Try:</b> watch the strip on the right in the barn's frame: both doors shut together. Then press <b>Pole's frame</b>. The exit door shuts and opens again <i>before</i> the pole reaches it; only later does the entrance door shut behind it. Then slow the pole below 0.6 c.</div>
      <p><b>Both are right.</b> 'Both doors shut at the same moment' is a statement about simultaneity, and simultaneity depends on the frame. What every observer agrees on are <b>events</b>: whether a door ever strikes the pole. Below 0.6 c it does, in every frame.</p>
      <p class="meta">Model assumption: special relativity, flat spacetime, c = 1; rigid doors that shut for 0.3 time units in the barn's frame. The diagram is the same history drawn two ways (a Lorentz transformation). <span class="tag ESTABLISHED">Established</span></p>` : SP.mode === "now" ? `
      <p>Even with one time dimension, 'now' is stranger than it looks. In relativity, observers moving relative to each other slice spacetime into moments <b>differently</b>.</p>
      <p><b style="color:var(--accent)">Blue</b>: your clock's path (straight up — you're at rest) and your 'now' (flat). <b style="color:#ff7a59">Orange</b>: someone moving at speed v. Their clock's path tilts toward the light ray — and so does their 'now', by the same angle.</p>
      <div class="try"><b>Try:</b> A and B are simultaneous for you. Set the speed to 0.6 and read the table: for the moving observer, B comes first. Then press <b>Draw it their way</b> — the diagram redraws so their 'now' is flat and yours tilts. Nobody's drawing is the 'real' one.</div>
      <p><b>Why nothing breaks:</b> order can only flip for events <i>outside each other's light cones</i> — too far apart, too close in time, for any signal to pass between them. If one event could cause the other, every observer agrees which came first. Drag C inside A's cone and try.</p>
      <p><b>What everyone agrees on:</b> tick <b>Equal-interval curves</b>. Each curve joins the events at the same spacetime interval from the origin (t² − x², the table's last column). Switch between drawing it your way and theirs: the events slide <i>along</i> their curves. Times and distances change between observers; the interval doesn't.</p>
      <p>This is why relativity has no universal 'now' — hole <a href="#" data-hole="H4">H4</a>. It's also why many physicists picture spacetime as a block (see Flatland chapter 7).</p>
      <p class="meta">Model assumption: special relativity in flat spacetime; one space dimension drawn; units where light travels one unit of distance per unit of time, so light rays run at 45°. <span class="tag ESTABLISHED">Established</span></p>` : `
      <p>One twin stays on Earth. The other flies to a star and back at a steady speed. When they meet again, the traveller is <b>younger</b> — not an illusion, but the same effect measured in the Clock Lab.</p>
      <div class="try"><b>Try:</b> speed 0.80 c, distance 4 light-years. The Earth twin ages 10 years, the traveller 6. Then push the speed to 0.99.</div>
      <p><b>Isn't motion relative?</b> Only one twin <i>turns around</i>. The dashed lines are the traveller's 'now' just before and just after the turn. Changing direction means changing frame, and with it which Earth events count as happening 'now': that assignment swings across the <b style="color:var(--c-lens)">pink</b> stretch of Earth's history. Nothing happens on Earth; it's the traveller's bookkeeping that changes.</p>
      <p>What nobody can dispute is the reunion: the traveller is younger. Add it up from the traveller's side — Earth's clock runs slow on both legs, plus the swing — and the total is exactly Earth's own elapsed time. Every observer's accounts agree.</p>
      <p class="meta">Tested: atomic clocks flown round the world (Hafele–Keating, 1971), fast-moving muons that live longer, and the daily GPS corrections. Model: special relativity, flat spacetime, an instant turnaround. <span class="tag ESTABLISHED">Established</span></p>`,
    next: { q: "If every observer slices spacetime into 'nows' differently, what is 'now' at all?", href: "#flatland/7", label: "Flatland · Time as a slice" },
    sources: "A. Einstein (1905); H. Minkowski, 'Space and Time' (1908); J. C. Hafele & R. E. Keating, Science 177 (1972)."
  });

  /* =====================================================================
     ENTROPY BOX — why time runs one way (the Loschmidt reversal)
     Integer leapfrog: x(n+1) = 2x(n) − x(n−1) + round(F(x(n))·dt²). Every quantity is an integer, so the
     map is exactly invertible: swapping x(n) and x(n+1) makes the system retrace its history bit for bit.
     ===================================================================== */
  const L = 1e8;                                   // box height in integer units; the box is 2L × L
  const EB = { N: 240, sig: 0.045 * L, k: 0.05, kw: 0.2, x: null, xp: null, F: null, col: null, part: true,
    t: 0, removedAt: 0, revTarget: null, back: 0, nudged: false, hold: 0, msg: "", hist: [], lnF: null, Smax: 1, Smin: 0 };

  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /* Complexity (D-055): how much you'd need to say to describe the pattern. Coarse-grain the discs onto a 16 × 8 grid,
     smooth over neighbouring cells, sort each cell into empty / even / crowded, and count the runs of the same level
     along each row — a simple stand-in for the compressed size used by Aaronson, Carroll & Ouellette (2014).
     All on one side: few runs. Evenly spread: fewer still. In between, while the gas pours across: more. */
  function complexity() {
    const GX = 16, GY = 8, g = Array.from({ length: GY }, () => new Array(GX).fill(0)), even = EB.N / (GX * GY);
    for (let i = 0; i < EB.N; i++) { const x = Math.max(0, Math.min(GX - 1, Math.floor(EB.x[2 * i] / (2 * L) * GX))), y = Math.max(0, Math.min(GY - 1, Math.floor(EB.x[2 * i + 1] / L * GY))); g[y][x]++; }
    let n = 0;
    for (let y = 0; y < GY; y++) { let prev = null; for (let x = 0; x < GX; x++) { let s = 0, c = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < GY && xx >= 0 && xx < GX) { s += g[yy][xx]; c++; } }
      const q = Math.max(0, Math.min(2, Math.round(s / c / even))); if (q !== prev) n++; prev = q; } }
    return n;
  }
  const CX_LO = 8, CX_HI = 36, cxFrac = v => Math.max(0, Math.min(1, (v - CX_LO) / (CX_HI - CX_LO)));
  function lnW(counts) { return EB.lnF[EB.N] - counts.reduce((a, n) => a + EB.lnF[n], 0); }
  function ebReset() {
    const N = EB.N, R = rng(7), cols = 15, rows = 16, sx = (L - EB.sig) / cols, sy = (L - EB.sig) / rows, v0 = 0.004 * L;
    EB.x = new Float64Array(2 * N); EB.xp = new Float64Array(2 * N); EB.F = new Float64Array(2 * N); EB.col = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      const x = Math.round(EB.sig / 2 + (c + 0.5 + (R() - 0.5) * 0.3) * sx), y = Math.round(EB.sig / 2 + (r + 0.5 + (R() - 0.5) * 0.3) * sy);
      const a = R() * TAU, sp = v0 * (0.7 + 0.6 * R());
      EB.x[2 * i] = x; EB.x[2 * i + 1] = y; EB.xp[2 * i] = x - Math.round(sp * Math.cos(a)); EB.xp[2 * i + 1] = y - Math.round(sp * Math.sin(a));
      EB.col[i] = x / L;
    }
    EB.part = true; EB.t = 0; EB.removedAt = 0; EB.revTarget = null; EB.back = 0; EB.nudged = false; EB.hold = 0; EB.hist = []; EB.chist = []; EB.cx = null; EB.msg = "";
    if (!EB.lnF) { EB.lnF = new Float64Array(N + 1); for (let n = 1; n <= N; n++) EB.lnF[n] = EB.lnF[n - 1] + Math.log(n); }
    const even = Array.from({ length: 32 }, (_, i) => Math.floor(N / 32) + (i < N % 32 ? 1 : 0));
    const left = Array.from({ length: 32 }, (_, i) => (i % 8) < 4 ? N / 16 : 0);   // all discs spread evenly over the left half's 16 cells (N = 240)
    EB.Smax = lnW(even); EB.Smin = lnW(left);
  }
  function forces() {
    const N = EB.N, x = EB.x, F = EB.F, s = EB.sig, s2 = s * s, k = EB.k, kw = EB.kw, h = s / 2, right = EB.part ? L : 2 * L;
    F.fill(0);
    for (let i = 0; i < N; i++) {
      const xi = x[2 * i], yi = x[2 * i + 1];
      for (let j = i + 1; j < N; j++) {
        const dx = x[2 * j] - xi; if (dx >= s || dx <= -s) continue;
        const dy = x[2 * j + 1] - yi; if (dy >= s || dy <= -s) continue;
        const r2 = dx * dx + dy * dy; if (r2 >= s2 || r2 === 0) continue;
        const r = Math.sqrt(r2), f = k * (s - r) / r;
        F[2 * i] -= f * dx; F[2 * i + 1] -= f * dy; F[2 * j] += f * dx; F[2 * j + 1] += f * dy;
      }
      if (xi < h) F[2 * i] += kw * (h - xi); else if (xi > right - h) F[2 * i] -= kw * (xi - (right - h));
      if (yi < h) F[2 * i + 1] += kw * (h - yi); else if (yi > L - h) F[2 * i + 1] -= kw * (yi - (L - h));
    }
    for (let q = 0; q < 2 * N; q++) F[q] = Math.round(F[q]);
  }
  function step() {
    forces();
    const x = EB.x, xp = EB.xp, F = EB.F;
    for (let q = 0; q < x.length; q++) { const xn = 2 * x[q] - xp[q] + F[q]; xp[q] = x[q]; x[q] = xn; }
    EB.t++;
  }
  function measure() {
    const counts = new Array(32).fill(0); let left = 0;
    for (let i = 0; i < EB.N; i++) {
      const x = EB.x[2 * i], y = EB.x[2 * i + 1];
      const c = Math.max(0, Math.min(7, Math.floor(x / (L / 4)))), r = Math.max(0, Math.min(3, Math.floor(y / (L / 4))));
      counts[r * 8 + c]++; if (x < L) left++;
    }
    return { S: (lnW(counts) - EB.Smin) / (EB.Smax - EB.Smin), left: left / EB.N };
  }
  /* Reversal is offered once the gas has run ~800 steps (≈4½ s): long enough for collisions to amplify a
     millionth-of-the-box nudge into a failed reversal (checked: exact reversal returns 100% of discs to the
     left half; nudged, about 55–60%). Earlier than that, a nudge barely shows. */
  const spread = () => !EB.part && EB.t - EB.removedAt >= 800;
  function reverse(nudge) {
    if (nudge) EB.x[0] += 100;                     // one disc moved by a millionth of the box height
    const t = EB.x; EB.x = EB.xp; EB.xp = t;
    EB.revTarget = EB.t - EB.removedAt; EB.back = 0; EB.nudged = nudge;
    EB.msg = nudge ? "Nudged one disc by a millionth of the box, then reversed." : "Every velocity reversed — watch it run backwards.";
  }

  Chrono.lab.register({
    predict: { q: "The gas has spread through the whole box. You reverse the velocity of <b>every</b> disc, exactly. What happens?",
      options: ["Nothing special — it stays spread out", "It gathers itself back into the left half", "It gathers back partly, then gives up"], answer: 1,
      explain: "Newton's laws run just as well backwards, so an exact reversal retraces every collision and the gas un-mixes — entropy goes down. The catch: it needs perfection. Nudge one disc by a millionth of the box first, and the error grows with every collision until the reversal fails. That's why nobody ever sees it happen." },
    applySetup(o) {
      if (o.open && EB.part) { EB.part = false; EB.removedAt = EB.t; EB.msg = ""; }
      if (o.reverse !== undefined) EB.auto = o.reverse === "nudge";   // reverse (or nudge, then reverse) as soon as the gas has spread
    },
    state() { const m = EB.x ? measure() : { left: 1 }; return { open: !EB.part, left: m.left, last: EB.last || null, N: EB.N, lnW }; },   // read-only, for missions and the maths page's checks
    readouts() { const m = EB.x ? measure() : { left: 1, S: 0 }; return [["Discs in the left half", `${Math.round(m.left * 100)}%`], ["Entropy · packed 0 → spread 100", Math.round(Math.max(0, Math.min(1, m.S)) * 100)], ["Complexity · pattern count", EB.cx === null ? "—" : Math.round(EB.cx)]]; },
    id: "entropy", title: "Entropy box", eyebrow: "Lab · why time runs one way", tier: "mainstream", tags: ["ESTABLISHED"],
    enter() { if (!EB.x) ebReset(); },
    controls() {
      const can = spread() && EB.revTarget === null;
      return `${EB.part ? `<button class="btn primary" id="eb-open">Remove the partition</button>` : ""}
        <button class="btn" id="eb-rev" ${can ? "" : "disabled"} title="${can ? "" : "Remove the partition and let the gas run for a few seconds first"}">Reverse every velocity</button>
        <button class="btn" id="eb-nudge" ${can ? "" : "disabled"} title="${can ? "" : "Remove the partition and let the gas run for a few seconds first"}">Nudge one disc, then reverse</button>
        <button class="btn" id="eb-reset">Reset</button>`;
    },
    wire() {
      const o = $("#eb-open"); if (o) o.onclick = () => { EB.part = false; EB.removedAt = EB.t; EB.msg = ""; Chrono.lab.rebuild(); };
      $("#eb-rev").onclick = () => { reverse(false); Chrono.lab.rebuild(); };
      $("#eb-nudge").onclick = () => { reverse(true); Chrono.lab.rebuild(); };
      $("#eb-reset").onclick = () => { ebReset(); Chrono.lab.rebuild(); };
    },
    tick(dt) {
      if (!dt) return;
      if (EB.hold > 0) { EB.hold -= dt; return; }
      if (EB.auto !== undefined && spread() && EB.revTarget === null) { reverse(EB.auto); EB.auto = undefined; Chrono.lab.rebuild(); }   // a mission's "Show me"
      const wasSpread = spread();
      for (let n = 0; n < 3; n++) {
        step();
        if (EB.revTarget !== null) {
          EB.back++;
          if (EB.back === EB.revTarget) {
            const m = measure();
            EB.msg = EB.nudged ? `Back at the moment the partition came out — but only ${(m.left * 100).toFixed(0)}% are in the left half. The nudge wrecked it.`
              : "Back to the exact starting arrangement — every disc in the left half. Now it spreads again.";
            EB.last = { nudged: EB.nudged, left: m.left };
            EB.hold = 2.5; EB.revTarget = null; EB.removedAt = EB.t; break;
          }
        }
      }
      const m = measure(); EB.hist.push(m.S); if (EB.hist.length > 700) EB.hist.shift();
      const c = complexity(); EB.cx = EB.cx === null ? c : EB.cx + (c - EB.cx) * 0.08; EB.chist.push(EB.cx); if (EB.chist.length > 700) EB.chist.shift();   // smoothed over about a second
      if (wasSpread !== spread()) Chrono.lab.rebuild();
    },
    draw(g) {
      const { ctx } = g, { A, B, stacked } = g.split(0.62), m = measure();
      if (stacked) { A.h = Math.min(A.h, Math.round((A.w - 28) / 2) + 80); B.y = A.y + A.h + 16; B.h = g.H - 16 - B.y; }   // phones: box as tall as it needs, graph gets the rest
      g.panel(A.x, A.y, A.w, A.h, "240 discs, Newton's laws, exactly reversible");
      const bw = Math.min(A.w - 28, (A.h - 70) * 2), bh = bw / 2, bx = A.x + (A.w - bw) / 2, by = A.y + 30 + (A.h - 56 - bh) / 2, sc = bh / L;
      ctx.fillStyle = "#0e1118"; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
      for (let c = 1; c < 8; c++) g.line(bx + c * bw / 8, by, bx + c * bw / 8, by + bh, "rgba(255,255,255,0.04)");
      for (let r = 1; r < 4; r++) g.line(bx, by + r * bh / 4, bx + bw, by + r * bh / 4, "rgba(255,255,255,0.04)");
      if (EB.part) g.line(bx + bw / 2, by, bx + bw / 2, by + bh, C.amber, 3);
      const rad = Math.max(1.5, EB.sig / 2 * sc);
      for (let i = 0; i < EB.N; i++) {
        const u = Math.max(0, Math.min(1, EB.col[i]));
        ctx.fillStyle = `rgb(${Math.round(79 + (155 - 79) * u)},${Math.round(209 + (140 - 209) * u)},${Math.round(165 + (255 - 165) * u)})`;
        ctx.beginPath(); ctx.arc(bx + EB.x[2 * i] * sc, by + bh - EB.x[2 * i + 1] * sc, rad, 0, TAU); ctx.fill();
      }
      ctx.lineWidth = 1;
      if (EB.msg) g.text(EB.msg, A.x + 14, A.y + A.h - 14, EB.nudged ? C.pink : C.teal, 12);
      else g.label(A.w < 520 ? "Colour = where each disc started" : "Colour = where each disc started (left edge teal → partition violet)", A.x + 14, A.y + A.h - 14, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Entropy");
      const x0 = B.x + 14;
      g.label("ENTROPY (coarse-grained)", x0, B.y + 78, C.muted, 10); g.bar(x0, B.y + 84, B.w - 28, 8, m.S, C.amber);
      const gx = x0, gy = B.y + 110, gw = B.w - 28, gh = Math.max(50, B.h - 196);
      ctx.strokeStyle = C.line; ctx.strokeRect(gx, gy, gw, gh);
      g.label("max", gx + gw - 4, gy + 12, C.muted, 9, "right"); g.label("time →", gx + gw - 4, gy + gh + 14, C.muted, 9, "right");
      if (EB.hist.length > 1) { ctx.strokeStyle = C.amber; ctx.lineWidth = 1.5; ctx.beginPath(); EB.hist.forEach((v, i) => { const X = gx + i / 699 * gw, Y = gy + gh - Math.max(0, Math.min(1, v)) * (gh - 4); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.lineWidth = 1; }
      if (EB.chist.length > 1) { ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5; ctx.beginPath(); EB.chist.forEach((v, i) => { const X = gx + i / 699 * gw, Y = gy + gh - cxFrac(v) * (gh - 4); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.lineWidth = 1; }
      g.label("— complexity", gx + gw, B.y + 78, C.teal, 10, "right"); g.label("— entropy", gx + gw - 96, B.y + 78, C.amber, 10, "right");   // key beside the bar, clear of the lines: entropy only climbs; complexity rises, then falls
      const ly = gy + gh + 34;
      g.label("S = ln W: the number of ways to arrange the discs", x0, ly, C.muted, 10, "left", "Inter, sans-serif");
      g.label("among the 32 cells that give these counts.", x0, ly + 14, C.muted, 10, "left", "Inter, sans-serif");
      g.label("Model: 240 soft discs · Newton's laws · integer-exact.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>The laws of motion don't care which way time runs: film two billiard balls colliding and the film looks fine backwards. So why does a gas spread out but never gather itself back up?</p>
      <p>Each disc here obeys Newton's laws exactly. With the partition in, they're all in the left half: few arrangements look like that. Remove it and they spread — into the kind of arrangement there are overwhelmingly more of. That count is the <b>entropy</b>.</p>
      <div class="try"><b>Try:</b> <b>Remove the partition</b> and let the gas run until the reverse buttons light up (a few seconds). Press <b>Reverse every velocity</b>: every collision replays backwards and the gas gathers itself back into the left half. Then <b>Reset</b>, and try <b>Nudge one disc, then reverse</b>.</div>
      <p><b>What it shows</b> <span class="tag ESTABLISHED">Established</span>: un-mixing is allowed by the laws but needs a perfectly exact starting point. A disturbance of one part in a million, amplified by collision after collision, destroys it. Real gases have around 10²³ molecules — the one-way-ness becomes overwhelming.</p>
      <p><b>What it doesn't show:</b> why the universe started in the ordered, low-entropy state that let everything spread since. That is hole <a href="#" data-hole="H3">H3</a> — and still open.</p>
      <p><b>Entropy climbs; complexity rises and falls.</b> Watch the teal line. With every disc on one side, the pattern is simple to describe. Evenly spread, it's simpler still. In between, while the gas pours across in streams and eddies, it takes the most describing. Entropy only ever goes up, but interesting structure lives in the middle. The universe is the same: stars, planets and life belong to its middle age, between a smooth start and a thin, even end. <span class="tag ESTABLISHED">Established</span> for entropy; how best to measure complexity is still argued over <span class="tag CONTESTED">Contested</span>. <a href="#concepts/arrow">More in The arrow of time</a>.</p>
      <p class="meta">Model assumption: 240 soft discs in two dimensions under Newton's laws, computed in whole numbers so that reversal is exact rather than approximate (Levesque &amp; Verlet, 1993). Entropy is coarse-grained over an 8 × 4 grid.</p>`,
    next: { q: "Almost all the laws run the same both ways — the one known exception is far too small to explain the arrow. So why did the universe start out so ordered?", href: "#atlas/H3", label: "Atlas · hole H3" },
    sources: "L. Boltzmann (1877); J. Loschmidt (1876); D. Levesque & L. Verlet, 'Molecular dynamics and time reversibility', J. Stat. Phys. 72, 519 (1993)."
  });
})();
