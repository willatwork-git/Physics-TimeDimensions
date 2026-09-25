/* Chronoscope — Time-travel labs (Physics scale; Tour 3). Wormholes · Time loops.
   Wormholes: the Kruskal–Szekeres diagram of an eternal (non-rotating) black hole — exact. Light rays are 45° lines;
   the Einstein–Rosen bridge's throat on the slice V = const has radius r with V² = (1 − r/rs)·e^(r/rs).
   Time loops: Gödel's rotating universe (1949). Along a circle of coordinate radius r (s = sinh r), light moving
   around the circle has dt/dφ = −√2 s² ± s√(s² + 1); beyond sinh r = 1 the circle itself is a timelike loop. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;

  /* =====================================================================
     WORMHOLES — Kruskal diagram and the Einstein–Rosen bridge
     ===================================================================== */
  const WH = { rays: [], V: 0, play: false, mode: "in" };
  const throat = V => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; ((1 - m) * Math.exp(m) > V * V) ? lo = m : hi = m; } return lo; };
  function ray(U0, V0, dir) {            // dir −1: inward (towards the black hole), +1: outward. Ends at the singularity or the edge.
    if (dir < 0) { const c = U0 + V0; if (c <= 0) return null; const U = (c * c - 1) / (2 * c); return { a: [U0, V0], b: [U, c - U], fate: "sing" }; }
    const d = U0 - V0, Ue = 2.5; return { a: [U0, V0], b: [Ue, Ue - d], fate: "out" };
  }
  Chrono.lab.register({
    predict: { q: "Einstein and Rosen found that a black hole's complete solution joins two separate universes through a 'bridge'. Could you travel through it to the other side?",
      options: ["Yes, if you go fast enough", "No — it pinches shut faster than anything, even light, can cross", "Only light can cross"], answer: 1,
      explain: "No. The bridge's throat opens and closes again so quickly that not even light can get from one side to the other — anything that tries ends up in the black hole. Real black holes, formed from collapsing stars, don't even have the second universe. Wormholes you could cross would need 'exotic' matter with negative energy, which isn't known to exist in the amounts needed." },
    applySetup(o) { if (o.fire) { const r = ray(...o.fire); if (r) WH.rays.push(r); } if (o.V !== undefined) { WH.V = o.V; WH.play = false; } },
    state() { return { V: WH.V, throat: throat(WH.V), sing: WH.rays.some(r => r.fate === "sing") }; },   // read-only, for missions
    readouts() { return [["Slice at time V", WH.V.toFixed(2)], ["Throat radius", `${throat(Math.abs(WH.V)).toFixed(2)} × horizon`], ["Rays fired", WH.rays.length]]; },
    id: "wormhole", title: "Wormholes", eyebrow: "Physics · can you cross the bridge?", tier: "mainstream", tags: ["ESTABLISHED", "SPECULATIVE"],
    controls() {
      return `<span class="ctl">Click in our universe (right) to fire light:</span>
        <button class="btn ${WH.mode === "in" ? "primary" : ""}" data-wh="in">Inward</button><button class="btn ${WH.mode === "out" ? "primary" : ""}" data-wh="out">Outward</button>
        <label class="ctl">The bridge at time V <input type="range" id="wh-v" min="-99" max="99" value="${Math.round(WH.V * 100)}"><output id="wh-vo">${WH.V.toFixed(2)}</output></label>
        <button class="btn" id="wh-play">${WH.play ? "Pause" : "Watch the bridge open and close"}</button>
        <button class="btn" id="wh-clear">Clear rays</button>`;
    },
    wire() {
      document.querySelectorAll("[data-wh]").forEach(b => b.onclick = () => { WH.mode = b.dataset.wh; Chrono.lab.rebuild(); });
      $("#wh-v").oninput = e => { WH.V = e.target.value / 100; WH.play = false; $("#wh-vo").textContent = WH.V.toFixed(2); };
      $("#wh-play").onclick = () => { WH.play = !WH.play; if (WH.play && WH.V > 0.97) WH.V = -0.99; Chrono.lab.rebuild(); };
      $("#wh-clear").onclick = () => { WH.rays = []; };
    },
    tick(dt) { if (WH.play && dt) { WH.V += dt * 0.25; if (WH.V > 0.99) { WH.V = 0.99; WH.play = false; Chrono.lab.rebuild(); } const o = $("#wh-vo"), r = $("#wh-v"); if (o) o.textContent = WH.V.toFixed(2); if (r) r.value = Math.round(WH.V * 100); } },
    pointer(type, x, y) {
      if (type !== "pointerdown" || !WH.geo) return;
      const { ox, oy, s } = WH.geo, U = (x - ox) / s, V = (oy - y) / s;
      if (U > Math.abs(V) && U < 2.5) { const r = ray(U, V, WH.mode === "in" ? -1 : 1); if (r) { WH.rays.push(r); if (WH.rays.length > 12) WH.rays.shift(); } }
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.6);
      g.panel(A.x, A.y, A.w, A.h, "The complete black hole, drawn so light always runs at 45°");
      const s = Math.min((A.w - 40) / 5.2, (A.h - 70) / 3.4), ox = A.x + A.w / 2, oy = A.y + 30 + (A.h - 50) / 2;
      const P = (U, V) => [ox + U * s, oy - V * s]; WH.geo = { ox, oy, s };
      ctx.save(); ctx.beginPath(); ctx.rect(A.x + 1, A.y + 26, A.w - 2, A.h - 27); ctx.clip();
      [[1, "#1a1320"], [-1, "#16191f"]].forEach(([sg, col]) => {             // interior regions: black hole (top), white hole (bottom)
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...P(0, 0));
        for (let i = 0; i <= 60; i++) { const U = -2.6 + i / 60 * 5.2, V = sg * Math.sqrt(1 + U * U); if (Math.abs(U) <= Math.abs(V)) ctx.lineTo(...P(U, V)); }
        ctx.closePath(); ctx.fill();
      });
      [1, -1].forEach(sg => { ctx.strokeStyle = sg > 0 ? C.orange : g.alpha(C.orange, 0.5); ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 80; i++) { const U = -2.6 + i / 80 * 5.2; const q = P(U, sg * Math.sqrt(1 + U * U)); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); ctx.lineWidth = 1; });
      [[2.6, 2.6], [2.6, -2.6]].forEach(([u, v]) => { ctx.setLineDash([5, 4]); g.line(...P(-u, -v), ...P(u, v), g.alpha(C.amber, 0.7), 1.5); ctx.setLineDash([]); });
      [1.5, 2.2, 3.5].forEach(rr => { const k = (rr - 1) * Math.exp(rr); [1, -1].forEach(side => { ctx.strokeStyle = "rgba(124,196,255,0.14)"; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const V = -1.7 + i / 60 * 3.4, U = side * Math.sqrt(k + V * V); const q = P(U, V); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); }); });
      const sl = [P(-2.6, WH.V), P(2.6, WH.V)]; g.line(...sl[0], ...sl[1], g.alpha(C.violet, 0.8), 1.5);
      WH.rays.forEach(r => { g.line(...P(...r.a), ...P(...r.b), C.amber, 2); g.dot(...P(...r.a), 3, C.amber); if (r.fate === "sing") g.dot(...P(...r.b), 4, C.orange); });
      ctx.restore();
      g.label("OUR UNIVERSE", ...P(1.7, -0.12), C.accent, 11, "center"); g.label("THE OTHER UNIVERSE", ...P(-1.7, -0.12), C.muted, 11, "center");
      g.label("BLACK HOLE", ...P(0, 0.62), C.orange, 11, "center"); g.label("WHITE HOLE (in the past)", ...P(0, -0.66), g.alpha(C.orange, 0.7), 11, "center");
      g.label("singularity", ...P(0, 1.08), C.orange, 9, "center"); g.label("horizons (dashed): light at 45°", ...P(1.5, 1.52), C.amber, 9, "center");
      g.label("time ↑   space →   · violet line: 'now' at time V", A.x + 14, A.y + A.h - 14, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "The bridge, at the violet 'now'");
      const rt = throat(Math.abs(WH.V)), cx = B.x + B.w / 2, cy = B.y + 40 + (B.h - 160) / 2, W = B.w - 50, Hh = Math.max(30, Math.min(B.h - 190, W * 0.55));   // short panes on phones: never negative
      ctx.strokeStyle = g.alpha(C.violet, 0.8); ctx.lineWidth = 2;
      [1, -1].forEach(sg => { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const u = -1 + i / 80 * 2, half = rt * 0.28 + (1 - rt * 0.28) * (Math.abs(u) ** 1.6) * 0.9; const q = [cx + u * W / 2, cy + sg * half * Hh / 2]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); });
      ctx.lineWidth = 1;
      if (rt > 0.02) { ctx.strokeStyle = g.alpha(C.violet, 0.5); ctx.beginPath(); ctx.ellipse(cx, cy, 6, rt * 0.28 * Hh / 2, 0, 0, TAU); ctx.stroke(); }
      g.label("our universe", cx + W / 2 - 4, cy - Hh / 2 - 8, C.accent, 10, "right"); g.label("the other universe", cx - W / 2 + 4, cy - Hh / 2 - 8, C.muted, 10);
      const x0 = B.x + 14; let y = cy + Hh / 2 + 34;
      y += g.wrap(Math.abs(WH.V) < 0.02 ? "Widest at this moment — yet light entering now still can't get through." : Math.abs(WH.V) > 0.97 ? "Pinched shut: the throat has become the singularity." : WH.V > 0 ? "Closing. It will pinch shut before anything reaches the far side." : "Opening — this half of the history lies in the white hole's past.", x0, y, B.w - 28, 16, C.muted, 12);
      g.label("Model: eternal Schwarzschild black hole, exact.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>In 1935 Einstein and Rosen noticed that the full mathematical solution for a black hole contains a <b>bridge</b> joining our universe to a second one. That's the original 'wormhole'.</p>
      <p>This diagram (Kruskal and Szekeres, 1960) draws the whole solution so that light always travels at 45°. Our universe is the right-hand wedge, the other universe the left. Above: the black hole. Below: a <b>white hole</b> — a region things can only come out of.</p>
      <div class="try"><b>Try:</b> click anywhere in our universe to fire light inward. Every ray ends at the singularity — none reaches the other universe. Then press <b>Watch the bridge open and close</b>: the throat on the right widens, then pinches shut before light could cross.</div>
      <p><b>How sure?</b> The geometry is exact general relativity <span class="tag ESTABLISHED">Established</span>. So is the verdict: this bridge can't be crossed (Fuller &amp; Wheeler, 1962). And real black holes, made by collapsing stars, have neither the white hole nor the other universe — those belong to the idealised, eternal solution.</p>
      <p><b>Wormholes you could cross</b> <span class="tag SPECULATIVE">Speculative</span>: Morris and Thorne (1988) worked out what one would need — 'exotic' matter with negative energy to hold the throat open. Small negative energies exist in quantum physics; the large amounts needed are not known to exist. They also showed such a wormhole could be turned into a time machine — see <a href="#" data-view-link="loops">Time loops</a>.</p>
      <p><b>A bold idea</b> <span class="tag SPECULATIVE">Speculative</span>: Maldacena and Susskind (2013) proposed 'ER = EPR' — that every pair of entangled particles is joined by a tiny, uncrossable wormhole. If true, space itself may be stitched together by entanglement. See <a href="#concepts/holography">Holography</a>.</p>
      <p class="meta">Model assumption: an eternal, non-rotating, uncharged black hole (the maximally extended Schwarzschild solution) in Kruskal–Szekeres coordinates. The bridge picture is schematic; the throat radius is exact.</p>`,
    next: { q: "Wormholes won't take you back in time. Could a whole universe — spinning — do it instead?", href: "#loops", label: "Time loops" },
    sources: "A. Einstein & N. Rosen, Phys. Rev. 48, 73 (1935); M. Kruskal, Phys. Rev. 119, 1743 (1960); G. Szekeres (1960); R. Fuller & J. Wheeler, Phys. Rev. 128, 919 (1962); M. Morris & K. Thorne, Am. J. Phys. 56, 395 (1988); J. Maldacena & L. Susskind, Fortsch. Phys. 61, 781 (2013)."
  });

  /* =====================================================================
     TIME LOOPS — Gödel's rotating universe (1949)
     ===================================================================== */
  const GD = { rr: 0.6, P: 100, walk: 0, walking: false };        // rr: coordinate radius; P: rotation period (billion years)
  const RC = Math.asinh(1);                                         // coordinate radius where light cones tip over
  const slopes = r => { const s = Math.sinh(r); return { s, up: -Math.SQRT2 * s * s + s * Math.sqrt(s * s + 1), dn: -Math.SQRT2 * s * s - s * Math.sqrt(s * s + 1) }; };
  Chrono.lab.register({
    predict: { q: "In Gödel's spinning universe, could you travel into your own past without ever going faster than light?",
      options: ["No — going back in time always needs faster-than-light travel", "Yes — far enough out, circling the universe brings you back to the moment you left", "Only by standing still"], answer: 1,
      explain: "Yes, in that universe. Its rotation tips light cones over as you go outwards; beyond a critical distance they tip so far that simply circling round, always slower than light, is a path into your own past. It's an exact solution of Einstein's equations (Gödel, 1949). But our universe isn't spinning measurably — and it expands, which Gödel's doesn't." },
    applySetup(o) { Object.assign(GD, o); },
    state() { return { rr: GD.rr, loop: GD.rr > RC, walked: GD.walk >= 1, P: GD.P, Rc: 0.1984 * GD.P }; },   // read-only, for missions
    readouts() { return [["Your distance", `${(GD.rr / RC).toFixed(2)} × critical`], ["Circle is a time loop", GD.rr > RC ? "Yes" : "No"], ["Loops begin at", `${(0.1984 * GD.P).toFixed(1)} bn ly`]]; },
    id: "loops", title: "Time loops", eyebrow: "Physics · can you meet your past self?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    controls() {
      return `<label class="ctl">Your distance from the centre <input type="range" id="gd-r" min="5" max="160" value="${Math.round(GD.rr / RC * 100)}"><output id="gd-ro">${(GD.rr / RC).toFixed(2)} × critical</output></label>
        <label class="ctl">Universe spins once every <input type="range" id="gd-p" min="1" max="1000" value="${GD.P}"><output id="gd-po">${GD.P} billion years</output></label>
        <button class="btn" id="gd-walk">${GD.walking ? "Stop" : "Walk the circle"}</button>`;
    },
    wire() {
      $("#gd-r").oninput = e => { GD.rr = e.target.value / 100 * RC; $("#gd-ro").textContent = (GD.rr / RC).toFixed(2) + " × critical"; };
      $("#gd-p").oninput = e => { GD.P = +e.target.value; $("#gd-po").textContent = GD.P + " billion years"; };
      $("#gd-walk").onclick = () => { GD.walking = !GD.walking; GD.walk = 0; Chrono.lab.rebuild(); };
    },
    tick(dt) { if (GD.walking && dt) { GD.walk += dt * 0.35; if (GD.walk >= 1) { GD.walk = 1; GD.walking = false; Chrono.lab.rebuild(); } } },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.58), sl = slopes(GD.rr), loop = GD.rr > RC;
      g.panel(A.x, A.y, A.w, A.h, "Gödel's universe: light cones tip over as you go outwards");
      const cx = A.x + A.w / 2, cy = A.y + A.h * 0.58, Rmax = Math.min(A.w * 0.44, A.h * 0.55), sc = Rmax / (1.6 * RC), tilt = 0.42;
      const Pt = (r, a, t) => [cx + r * sc * Math.cos(a), cy + r * sc * Math.sin(a) * tilt - t];   // t lifts the point (time up)
      const ring = (r, col, w, dash) => { ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (let i = 0; i <= 90; i++) { const q = Pt(r, i / 90 * TAU, 0); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; };
      [0.4, 0.8, 1.2, 1.6].forEach(f => ring(f * RC, "rgba(255,255,255,0.08)", 1));
      ring(RC, C.pink, 1.5, [6, 5]); { const q = Pt(RC, Math.PI / 2, 0); g.label("dashed: critical radius — beyond it, circles are time loops", cx, Math.max(q[1] + 18, Pt(1.6 * RC, Math.PI / 2, 0)[1] + 16), C.pink, 10, "center"); }
      ring(GD.rr, loop ? C.amber : C.accent, 2.5);
      g.line(cx, cy, cx, cy - Rmax * 0.8, "rgba(255,255,255,0.2)", 1); g.label("time ↑", cx + 6, cy - Rmax * 0.8, C.muted, 9);
      [0.35, 0.8, 1.25, 1.55].map(f => f * RC).concat([GD.rr]).forEach((r, j, arr) => {               // light-cone slices along the circle
        const { s, up, dn } = slopes(r), L = j === arr.length - 1 ? 30 : 20;
        for (let k = 0; k < 8; k++) {
          const a = k / 8 * TAU + 0.2, p = Pt(r, a, 0), tx = -Math.sin(a), ty = Math.cos(a) * tilt, tn = Math.hypot(tx, ty) || 1;
          const e1 = [s * tx / tn, s * ty / tn - up], e2 = [-s * tx / tn, -s * ty / tn + dn], n1 = Math.hypot(...e1), n2 = Math.hypot(...e2);
          ctx.fillStyle = g.alpha(r > RC ? C.amber : C.teal, j === arr.length - 1 ? 0.45 : 0.22); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(p[0] + e2[0] / n2 * L, p[1] + e2[1] / n2 * L); ctx.lineTo(p[0], p[1] - L); ctx.lineTo(p[0] + e1[0] / n1 * L, p[1] + e1[1] / n1 * L); ctx.closePath(); ctx.fill();   // through 'time-up': the cone can open past 180°
        }
      });
      if (GD.walk > 0) { const a = GD.walk * TAU + 0.2, p = Pt(GD.rr, a, 0); ctx.shadowColor = C.pink; ctx.shadowBlur = 12; g.dot(...p, 6, C.pink); ctx.shadowBlur = 0; }
      g.dot(cx, cy, 4, C.text); g.label("wedges: the future light cone, sliced along each circle", A.x + 14, A.y + A.h - 14, C.muted, 10);
      g.label(A.w < 520 ? "Every point looks the same; the centre is where we stand." : "Gödel's universe looks the same from every point — the centre is just where we stand.", A.x + 14, A.y + A.h - 30, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Your light cone, along the circle");
      const px = B.x + B.w / 2, py = B.y + 40 + (B.h - 200) * 0.55, L2 = Math.min(B.w * 0.36, (B.h - 200) * 0.5);
      g.line(px - L2 - 10, py, px + L2 + 10, py, C.line); g.line(px, py + L2 * 0.6, px, py - L2 - 10, C.line);
      g.label("around the circle →", px + L2 + 8, py + 14, C.muted, 9, "right"); g.label("time ↑", px + 6, py - L2 - 12, C.muted, 9);
      const e1 = [sl.s, sl.up], e2 = [-sl.s, -sl.dn], n1 = Math.hypot(...e1), n2 = Math.hypot(...e2);
      const q1 = [px + e1[0] / n1 * L2, py - e1[1] / n1 * L2], q2 = [px + e2[0] / n2 * L2, py - e2[1] / n2 * L2];
      ctx.fillStyle = g.alpha(loop ? C.amber : C.teal, 0.25); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(...q2); ctx.lineTo(px, py - L2); ctx.lineTo(...q1); ctx.closePath(); ctx.fill();
      g.line(px, py, ...q1, loop ? C.amber : C.teal, 2); g.line(px, py, ...q2, loop ? C.amber : C.teal, 2);
      g.line(px, py, px + L2 * 0.9, py, loop ? C.pink : g.alpha(C.orange, 0.8), 2.5); g.dot(px + L2 * 0.9, py, 4, loop ? C.pink : C.orange);
      const x0 = B.x + 14; let y = py + L2 * 0.6 + 34;
      y += g.wrap(loop ? "The horizontal arrow — going round the circle with no time passing on the universe's clock — is inside your light cone. It's an allowed, slower-than-light path: a closed loop in time." : "The horizontal arrow — going round the circle with no time passing — is outside your light cone. You'd have to travel faster than light. No loop here.", x0, y, B.w - 28, 17, loop ? C.pink : C.text, 13) + 10;
      const Rc = 0.1984 * GD.P;
      y += g.wrap(`At this spin, time loops begin about ${Rc < 10 ? Rc.toFixed(1) : Math.round(Rc)} billion light-years from any point.${GD.walk >= 1 && loop ? " You walked the circle — and arrived back at the very moment you set out, a little older." : ""}`, x0, y, B.w - 28, 16, C.muted, 12);
      g.label("Model: Gödel's exact solution (1949).", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>In 1949 Kurt Gödel — best known for logic — gave Einstein a birthday present: an exact solution of Einstein's equations for a universe in which all matter <b>rotates</b>. Its surprise: it contains loops in time.</p>
      <p>The rotation drags light cones round. Near you, they point up the time axis as usual. Farther out they tip over, until beyond a critical distance a simple circle — travelled slower than light all the way — takes you back to the moment you left. A <b>closed timelike curve</b>.</p>
      <div class="try"><b>Try:</b> slide your distance past <b>1.00 × critical</b> and watch the cone on the right tip until it swallows the horizontal arrow. Press <b>Walk the circle</b>. Then speed the universe's spin up: the loops move closer in.</div>
      <p><b>How sure?</b> Gödel's solution is exact mathematics <span class="tag ESTABLISHED">Established</span>. It isn't our universe: ours expands, Gödel's doesn't, and measurements of the microwave background show no sign of cosmic rotation <span class="tag ESTABLISHED">Established</span>. Gödel's point was philosophical — if Einstein's laws allow such worlds, is the flow of time really fundamental?</p>
      <p><b>What about paradoxes?</b> If you could meet your past self, what stops you changing history? Novikov's answer: only self-consistent histories can happen <span class="tag SPECULATIVE">Speculative</span>. Hawking's 'chronology protection' conjecture: quantum effects always destroy time machines as they form <span class="tag CONTESTED">Contested</span> — unproven either way.</p>
      <p class="meta">Model assumption: Gödel's metric, ds² = 4a²[dt² − dr² − dz² + (sinh⁴r − sinh²r) dφ² + 2√2 sinh²r dφ dt]; light cones computed exactly along circles of constant r. Critical radius where sinh r = 1. Physical distances assume matter rotating once per the chosen period.</p>`,
    next: { q: "Forward in time: yes. Backward: only in strange universes. So — is time travel possible?", href: "#concepts/timetravel", label: "Concept · Is time travel possible?" },
    sources: "K. Gödel, Rev. Mod. Phys. 21, 447 (1949); S. Hawking & G. Ellis, The Large Scale Structure of Space-Time (1973); I. Novikov et al. (1990); S. Hawking, Phys. Rev. D 46, 603 (1992); D. Saadeh et al., Phys. Rev. Lett. 117, 131302 (2016)."
  });
})();
