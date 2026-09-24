/* Chronoscope — Quantum: time at the smallest scale. Delayed choice · The frozen universe.
   Delayed choice: an ideal Mach–Zehnder interferometer with single photons; detection probabilities from
   quantum amplitudes (P(D1) = cos²(φ/2) with the second beam splitter in; ½ and which-path without).
   Frozen universe: the Page–Wootters "history state" of a 12-reading clock and a spin, exact linear algebra. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;
  const QC = "#5ee0e6";   // Quantum scale colour

  /* =====================================================================
     DELAYED CHOICE — Wheeler's thought experiment, done with single photons (Jacques et al. 2007)
     ===================================================================== */
  const BINS = 16;
  const DC = { mode: "random", phi: 0, sweep: false, run: true, fast: false, flying: [], clock: 0,
    counts: { in: [0, 0], out: [0, 0] }, fr: Array.from({ length: BINS }, () => [0, 0]), last: null };
  const pD1 = (bs2, phi) => bs2 ? Math.cos(phi / 2) ** 2 : 0.5;
  function fire() { DC.flying.push({ t: 0, bs2: DC.mode === "in" ? true : DC.mode === "out" ? false : null, phi: DC.phi }); }
  function detect(p) {
    if (p.bs2 === null) p.bs2 = Math.random() < 0.5;
    const d1 = Math.random() < pD1(p.bs2, p.phi), k = p.bs2 ? "in" : "out";
    DC.counts[k][d1 ? 0 : 1]++;
    if (p.bs2) { const b = Math.min(BINS - 1, Math.floor(((p.phi % TAU) + TAU) % TAU / TAU * BINS)); DC.fr[b][d1 ? 0 : 1]++; }
    DC.last = { d1, bs2: p.bs2, age: 0 };
  }
  function resetDC() { DC.counts = { in: [0, 0], out: [0, 0] }; DC.fr = Array.from({ length: BINS }, () => [0, 0]); DC.flying = []; DC.last = null; }

  Chrono.lab.register({
    predict: { q: "A single photon has <b>already passed</b> the first beam splitter. Only then do you decide whether to put the second one in. Can your late decision still change what you see?",
      options: ["No — too late, the photon has already taken one path", "Yes — the results always match whatever is there when the photon arrives", "It breaks the experiment"], answer: 1,
      explain: "The results match the set-up at the moment of detection: second beam splitter in → interference; out → each photon shows up on the detector for one arm. That's been done with real single photons (2007). But nothing travels back in time: the pattern only appears when you sort the records afterwards, so no signal reaches the past. The lesson is subtler — don't picture the photon as having taken one path before it's measured." },
    id: "delayed", title: "Delayed choice", eyebrow: "Quantum · when is a photon's path decided?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    controls() {
      return `<span class="ctl">Second beam splitter:</span>
        <button class="btn ${DC.mode === "in" ? "primary" : ""}" data-dc="in">In</button><button class="btn ${DC.mode === "out" ? "primary" : ""}" data-dc="out">Out</button>
        <button class="btn ${DC.mode === "random" ? "primary" : ""}" data-dc="random">Decide late, at random</button>
        <label class="ctl">Phase φ <input type="range" id="dc-phi" min="0" max="628" value="${Math.round(DC.phi * 100)}"><output id="dc-phio">${(DC.phi / Math.PI).toFixed(2)} π</output></label>
        <button class="btn ${DC.sweep ? "primary" : ""}" id="dc-sweep">Sweep the phase</button>
        <button class="btn" id="dc-run">${DC.run ? "Pause" : "Fire photons"}</button>
        <button class="btn ${DC.fast ? "primary" : ""}" id="dc-fast">Many photons</button>
        <button class="btn" id="dc-reset">Reset counts</button>`;
    },
    wire() {
      document.querySelectorAll("[data-dc]").forEach(b => b.onclick = () => { DC.mode = b.dataset.dc; Chrono.lab.rebuild(); });
      $("#dc-phi").oninput = e => { DC.phi = e.target.value / 100; DC.sweep = false; $("#dc-phio").textContent = (DC.phi / Math.PI).toFixed(2) + " π"; };
      $("#dc-sweep").onclick = () => { DC.sweep = !DC.sweep; Chrono.lab.rebuild(); };
      $("#dc-run").onclick = () => { DC.run = !DC.run; Chrono.lab.rebuild(); };
      $("#dc-fast").onclick = () => { DC.fast = !DC.fast; Chrono.lab.rebuild(); };
      $("#dc-reset").onclick = () => resetDC();
    },
    tick(dt) {
      if (!dt) return;
      if (DC.sweep) { DC.phi = (DC.phi + dt * 0.35) % TAU; const o = $("#dc-phio"), r = $("#dc-phi"); if (o) o.textContent = (DC.phi / Math.PI).toFixed(2) + " π"; if (r) r.value = Math.round(DC.phi * 100); }
      if (DC.run) {
        if (DC.fast) { for (let i = 0; i < 40; i++) { const p = { t: 1, bs2: DC.mode === "in" ? true : DC.mode === "out" ? false : null, phi: DC.phi }; detect(p); } }
        else { DC.clock += dt; if (DC.clock > 0.45) { DC.clock = 0; fire(); } }
      }
      DC.flying.forEach(p => { const before = p.t; p.t += dt * 0.55; if (before < 0.5 && p.t >= 0.5 && p.bs2 === null) p.bs2 = Math.random() < 0.5; });
      DC.flying.filter(p => p.t >= 1).forEach(detect);
      DC.flying = DC.flying.filter(p => p.t < 1);
      if (DC.last) DC.last.age += dt;
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.55);
      g.panel(A.x, A.y, A.w, A.h, "A Mach–Zehnder interferometer, one photon at a time");
      const narrow = A.w < 480, S = Math.min((A.w - 80) / 1.5, (A.h - (narrow ? 130 : 110)) / 1.25), ox = A.x + 30, oy = A.y + A.h - (narrow ? 54 : 40);
      const P = (x, y) => [ox + x * S, oy - y * S];
      const src = P(0, 0.2), bs1 = P(0.35, 0.2), m1 = P(0.35, 1.0), m2 = P(1.15, 0.2), bs2 = P(1.15, 1.0), d1 = P(1.45, 1.0), d2 = P(1.15, 1.25);
      const showBS2 = p => p === true;
      g.line(...src, ...bs1, g.alpha(C.amber, 0.35), 1.5);
      [[bs1, m1], [bs1, m2], [m1, bs2], [m2, bs2], [bs2, d1], [bs2, d2]].forEach(([a, b]) => g.line(...a, ...b, "rgba(255,255,255,0.12)", 1));
      const mirror = (q, ang) => { ctx.save(); ctx.translate(...q); ctx.rotate(ang); ctx.fillStyle = "#c9d2e3"; ctx.fillRect(-14, -2, 28, 4); ctx.restore(); };
      mirror(m1, -Math.PI / 4); mirror(m2, -Math.PI / 4);
      const splitter = (q, on) => { ctx.save(); ctx.translate(...q); ctx.rotate(-Math.PI / 4); ctx.fillStyle = on ? g.alpha(QC, 0.55) : "rgba(255,255,255,0.06)"; ctx.fillRect(-15, -3, 30, 6); ctx.strokeStyle = on ? QC : "rgba(255,255,255,0.25)"; ctx.setLineDash(on ? [] : [3, 3]); ctx.strokeRect(-15, -3, 30, 6); ctx.setLineDash([]); ctx.restore(); };
      splitter(bs1, true);
      const nowBS2 = DC.mode === "in" ? true : DC.mode === "out" ? false : (DC.flying.find(p => p.t >= 0.5 && p.bs2 !== null) || {}).bs2;
      splitter(bs2, showBS2(nowBS2));
      g.label("source", src[0] - 4, src[1] + 22, C.muted, 9, "left"); g.label("first beam splitter", bs1[0] - 6, bs1[1] + 22, C.muted, 9, "left");
      g.label("second beam splitter", bs2[0] - 10, bs2[1] - 18, QC, 9, "right");
      if (DC.mode === "random") g.wrap("Random mode: whether the second beam splitter is in or out is chosen after the photon has passed the first.", A.x + 14, A.y + 36, A.w - 28, 14, QC, 10, "JetBrains Mono, monospace");
      g.label(`phase φ = ${(DC.phi / Math.PI).toFixed(2)}π on this arm`, m2[0] - 10, (m2[1] + bs2[1]) / 2, C.muted, 9, "right");
      [[d1, "D1", 0], [d2, "D2", 1]].forEach(([q, n, i]) => { const hit = DC.last && DC.last.age < 0.35 && (DC.last.d1 ? 0 : 1) === i; ctx.shadowColor = C.amber; ctx.shadowBlur = hit ? 22 : 0; g.dot(...q, 11, hit ? C.amber : "#2a3040"); ctx.shadowBlur = 0; g.label(n, q[0], q[1] + 4, hit ? C.bg : C.text, 10, "center"); });
      /* the photon: a single packet before BS1, an amplitude spread over BOTH arms after it, a click at the end */
      DC.flying.forEach(p => {
        const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        if (p.t < 0.25) { const q = lerp(src, bs1, p.t / 0.25); ctx.shadowColor = C.amber; ctx.shadowBlur = 12; g.dot(...q, 5, C.amber); ctx.shadowBlur = 0; }
        else if (p.t < 0.75) { const f = (p.t - 0.25) / 0.5, a = f < 0.5 ? lerp(bs1, m1, f * 2) : lerp(m1, bs2, f * 2 - 1), b = f < 0.5 ? lerp(bs1, m2, f * 2) : lerp(m2, bs2, f * 2 - 1);
          [a, b].forEach(q => { ctx.shadowColor = C.amber; ctx.shadowBlur = 10; g.dot(...q, 4, g.alpha(C.amber, 0.55)); ctx.shadowBlur = 0; }); }
        else { const f = (p.t - 0.75) / 0.25; [lerp(bs2, d1, f), lerp(bs2, d2, f)].forEach(q => g.dot(...q, 3.5, g.alpha(C.amber, 0.4))); }
      });
      g.wrap("the photon is drawn as a wave in both arms until a detector clicks", A.x + 14, A.y + A.h - (narrow ? 28 : 14), A.w - 28, 14, C.muted, 10, "JetBrains Mono, monospace");

      g.panel(B.x, B.y, B.w, B.h, "Results, sorted by what was chosen");
      const x0 = B.x + 14, [i1, i2] = DC.counts.in, [o1, o2] = DC.counts.out, ni = i1 + i2, no = o1 + o2;
      let y = B.y + 50;
      g.text("Second beam splitter IN", x0, y, QC, 13); y += 18;
      g.label(`D1 ${i1} · D2 ${i2}${ni ? ` → D1 ${Math.round(i1 / ni * 100)}%` : ""} · theory at this φ: ${Math.round(pD1(true, DC.phi) * 100)}%`, x0, y, C.text, 11); y += 16;
      g.label("Which arm? Unknowable — the arms interfere.", x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 28;
      g.text("Second beam splitter OUT", x0, y, C.muted, 13); y += 18;
      g.label(`D1 ${o1} · D2 ${o2}${no ? ` → D1 ${Math.round(o1 / no * 100)}%` : ""} · theory: 50%`, x0, y, C.text, 11); y += 16;
      g.label("Which arm? Known — each detector sees one arm.", x0, y, C.muted, 11, "left", "Inter, sans-serif"); y += 28;
      const gx = x0, gw = B.w - 28, gh = Math.max(60, B.y + B.h - y - 60), gy = y + 12;
      g.label("D1 SHARE vs PHASE — 'IN' RUNS ONLY (the interference fringe)", gx, y, C.muted, 9);
      ctx.strokeStyle = C.line; ctx.strokeRect(gx, gy, gw, gh);
      ctx.strokeStyle = g.alpha(QC, 0.5); ctx.beginPath(); for (let i = 0; i <= 100; i++) { const ph = i / 100 * TAU, X = gx + i / 100 * gw, Y = gy + gh - pD1(true, ph) * gh; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
      DC.fr.forEach(([a, b], i) => { const n = a + b; if (!n) return; g.dot(gx + (i + 0.5) / BINS * gw, gy + gh - a / n * gh, Math.min(6, 2 + Math.log2(n)), C.amber); });
      g.label("0", gx, gy + gh + 12, C.muted, 9); g.label("2π", gx + gw, gy + gh + 12, C.muted, 9, "right"); g.label("line: quantum prediction · dots: your photons", gx + gw / 2, gy + gh + 12, C.muted, 9, "center");
      g.label("Model: ideal interferometer, single photons.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>A single photon meets a half-silvered mirror (a <b>beam splitter</b>). Mirrors bring both routes together again at a second beam splitter, then two detectors.</p>
      <p>With the second beam splitter <b>in</b>, the two routes interfere: the phase φ decides which detector clicks, like a wave. With it <b>out</b>, each detector only sees one route, and the photon turns up at one or the other at random, like a particle taking one path.</p>
      <div class="try"><b>Try:</b> choose <b>Decide late, at random</b> — the choice is made after each photon has passed the first splitter. Turn on <b>Many photons</b> and <b>Sweep the phase</b>. Sort by what was chosen: the 'in' photons trace the interference fringe, the 'out' photons split 50/50 — even though each photon was 'already inside' when the choice was made.</div>
      <p><b>What it shows</b> <span class="tag ESTABLISHED">Established</span>: done with real single photons, with the choice made by a quantum random number after the photon entered (Jacques et al., 2007). The results always match the set-up at detection.</p>
      <p><b>What it means</b> <span class="tag CONTESTED">Contested</span>: popular accounts say the photon 'decides its past'. Standard quantum mechanics needs nothing so dramatic — no signal goes backwards (the pattern only appears once records are sorted). What fails is the picture of a photon taking one definite path before it's measured. Interpretations still argue over what's really there.</p>
      <p class="meta">Model assumption: an ideal Mach–Zehnder interferometer with perfect optics; detection probabilities from quantum amplitudes — P(D1) = cos²(φ/2) with the second splitter in, ½ without. Random numbers stand in for quantum randomness.</p>`,
    next: { q: "If a photon has no definite path until measured, what about time itself — could it emerge from quantum correlations?", href: "#frozen", label: "The frozen universe" },
    sources: "J. A. Wheeler (1978); V. Jacques et al., 'Experimental realization of Wheeler's delayed-choice gedanken experiment', Science 315, 966 (2007)."
  });

  /* =====================================================================
     THE FROZEN UNIVERSE — Page–Wootters: |Ψ⟩ = (1/√N) Σₖ |k⟩_clock ⊗ Uᵏ|ψ₀⟩_spin
     ===================================================================== */
  const FZ = { N: 12, f: 1, k: 0, play: true, ent: true, clk: 0, check: null };
  const angle = k => TAU * FZ.f * k / FZ.N;                                   // spin's direction (about the vertical axis) when the clock reads k
  const spinAt = k => FZ.ent ? angle(k) : 0;                                    // not entangled: the spin is the same whatever the clock says
  function globalOverlap() {                                                   // |⟨Ψ|W|Ψ⟩|², W = one tick of everything (clock shift ⊗ U)
    if (FZ.ent) return 1;
    const th = TAU * FZ.f / FZ.N; return Math.cos(th / 2) ** 2;               // product state: uniform clock ⊗ ψ₀ → overlap |⟨ψ₀|U|ψ₀⟩|²
  }
  Chrono.lab.register({
    predict: { q: "This whole universe is in <b>one unchanging quantum state</b> — it never evolves. Can anything inside it experience time passing?",
      options: ["No — if nothing changes, there's no time", "Yes — a part that reads a clock sees the rest change", "Only if you add a clock from outside"], answer: 1,
      explain: "Yes. The universe as a whole is frozen, but its parts are correlated (entangled): whenever the clock reads 3, the spin points one way; when it reads 4, another. Anything inside that uses the clock sees the spin turn — time appears from the correlation. Remove the entanglement and the spin looks the same at every clock reading: no time at all. This is the Page–Wootters idea (1983), demonstrated in miniature with photons (2014)." },
    id: "frozen", title: "The frozen universe", eyebrow: "Quantum · time from entanglement", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    controls() {
      return `<button class="btn ${FZ.ent ? "primary" : ""}" id="fz-ent">Entangled (clock ↔ spin)</button><button class="btn ${!FZ.ent ? "primary" : ""}" id="fz-prod">Not entangled</button>
        <label class="ctl">Read the clock at <input type="range" id="fz-k" min="0" max="${FZ.N - 1}" value="${FZ.k}"><output id="fz-ko">${FZ.k}</output></label>
        <button class="btn" id="fz-play">${FZ.play ? "Pause" : "Step through the readings"}</button>
        <label class="ctl">Spin turns <input type="range" id="fz-f" min="1" max="3" value="${FZ.f}"><output id="fz-fo">${FZ.f}×</output> per clock cycle</label>
        <button class="btn" id="fz-check">Evolve the whole universe one tick</button>`;
    },
    wire() {
      $("#fz-ent").onclick = () => { FZ.ent = true; FZ.check = null; Chrono.lab.rebuild(); };
      $("#fz-prod").onclick = () => { FZ.ent = false; FZ.check = null; Chrono.lab.rebuild(); };
      $("#fz-k").oninput = e => { FZ.k = +e.target.value; FZ.play = false; $("#fz-ko").textContent = FZ.k; };
      $("#fz-play").onclick = () => { FZ.play = !FZ.play; Chrono.lab.rebuild(); };
      $("#fz-f").oninput = e => { FZ.f = +e.target.value; FZ.check = null; $("#fz-fo").textContent = FZ.f + "×"; };
      $("#fz-check").onclick = () => { FZ.check = { o: globalOverlap(), age: 0 }; };
    },
    tick(dt) {
      if (FZ.play && dt) { FZ.clk += dt; if (FZ.clk > 0.8) { FZ.clk = 0; FZ.k = (FZ.k + 1) % FZ.N; const o = $("#fz-ko"), r = $("#fz-k"); if (o) o.textContent = FZ.k; if (r) r.value = FZ.k; } }
      if (FZ.check) FZ.check.age += dt;
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.52);
      const spin = (cx, cy, R, ang, col, hl) => {           // a spin's direction, drawn as an arrow in a circle (seen from above)
        g.ring(cx, cy, R, hl ? g.alpha(col, 0.9) : "rgba(255,255,255,0.18)", hl ? 2 : 1);
        const x = cx + Math.cos(ang - Math.PI / 2) * R * 0.85, y = cy + Math.sin(ang - Math.PI / 2) * R * 0.85;
        g.line(cx, cy, x, y, col, hl ? 2.5 : 1.5); g.dot(x, y, hl ? 3.5 : 2.2, col);
      };
      g.panel(A.x, A.y, A.w, A.h, "The whole universe — one state, never changing");
      const cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 10, R = Math.min(A.w, A.h - 60) * 0.36, r = Math.max(12, R * 0.17);
      g.ring(cx, cy, R, "rgba(255,255,255,0.06)", 1);
      for (let k = 0; k < FZ.N; k++) {
        const a = k / FZ.N * TAU - Math.PI / 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, hl = k === FZ.k;
        spin(x, y, r, spinAt(k), hl ? QC : g.alpha(QC, 0.6), hl);
        g.label(String(k), cx + Math.cos(a) * (R - r - 14), cy + Math.sin(a) * (R - r - 14) + 4, hl ? C.text : C.muted, 10, "center");
      }
      g.label(FZ.ent ? "every clock reading paired with its own spin direction" : "the spin is the same whatever the clock reads", cx, A.y + A.h - 32, FZ.ent ? QC : C.muted, 10, "center");
      g.label("|Ψ⟩ = (1/√12) Σ |clock k⟩ ⊗ |spin k⟩", A.x + 14, A.y + A.h - 14, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Inside view: read the clock, look at the spin");
      const bx = B.x + B.w / 2, by = B.y + 40 + Math.min(B.w, B.h) * 0.2, rr = Math.min(B.w * 0.18, B.h * 0.16);
      const cxx = bx - rr * 1.5, sxx = bx + rr * 1.5;
      g.ring(cxx, by, rr, C.muted, 1.5); for (let k = 0; k < FZ.N; k++) { const a = k / FZ.N * TAU - Math.PI / 2; g.line(cxx + Math.cos(a) * rr * 0.85, by + Math.sin(a) * rr * 0.85, cxx + Math.cos(a) * rr, by + Math.sin(a) * rr, C.muted, 1); }
      const ha = FZ.k / FZ.N * TAU - Math.PI / 2; g.line(cxx, by, cxx + Math.cos(ha) * rr * 0.8, by + Math.sin(ha) * rr * 0.8, C.text, 2.5);
      g.label(`clock reads ${FZ.k}`, cxx, by + rr + 20, C.text, 11, "center");
      spin(sxx, by, rr, spinAt(FZ.k), QC, true); g.label("spin, given that reading", sxx, by + rr + 20, QC, 11, "center");
      const x0 = B.x + 14; let y = by + rr + 50;
      const pX = Math.cos(spinAt(FZ.k) / 2) ** 2;
      g.label(`Chance the spin points 'up the page' when measured: ${Math.round(pX * 100)}%`, x0, y, C.text, 11, "left", "Inter, sans-serif"); y += 26;
      y += g.wrap(FZ.ent ? "Step the clock: the spin turns. Nothing outside is changing — time is the correlation between the clock and the spin." : "Step the clock: the spin never moves. Without entanglement there's no correlation, so nothing inside can tell one moment from another.", x0, y, B.w - 28, 16, FZ.ent ? QC : C.pink, 12) + 10;
      if (FZ.check) {
        const ok = FZ.check.o > 0.999;
        y += g.wrap(`One tick applied to the whole universe (clock and spin together): overlap with before = ${FZ.check.o.toFixed(3)} — ${ok ? "the universe is exactly unchanged. It really is frozen." : "it has changed. An unentangled universe isn't frozen — it just has no clock."}`, x0, y, B.w - 28, 16, ok ? C.teal : C.orange, 12);
      }
      g.label("Model: 12-reading clock ⊗ spin-½, exact.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>Apply quantum rules to the whole universe and the equation you get — the Wheeler–DeWitt equation — has no time in it. The universe as a whole just <i>is</i>. So where does time come from? (Hole <a href="#" data-hole="H1">H1</a>.)</p>
      <p>Don Page and William Wootters (1983) proposed an answer. Split the universe into a <b>clock</b> and <b>everything else</b> — here, a single spin. The whole thing sits in one unchanging state, but in that state the two are <b>entangled</b>: each clock reading comes paired with its own spin direction.</p>
      <div class="try"><b>Try:</b> step through the readings — the spin turns. Press <b>Evolve the whole universe one tick</b>: nothing changes. Then choose <b>Not entangled</b> and do both again.</div>
      <p><b>How sure?</b> The mathematics is <span class="tag ESTABLISHED">Established</span>, and it has been demonstrated in miniature with entangled photons (Moreva et al., 2014), where an 'inside' observer saw evolution while the whole stayed static. Whether our universe's time really arises this way is <span class="tag CONTESTED">Contested</span>.</p>
      <p><b>Picture it this way</b> <span class="tag ANALOGY">Analogy</span>: a flip-book is complete and still on the table; time appears only when you relate one page to the next. Here the pages are the clock readings.</p>
      <p class="meta">Model assumption: a 12-state clock and a spin-½ system in the Page–Wootters history state |Ψ⟩ = (1/√12) Σₖ |k⟩ ⊗ Uᵏ|ψ₀⟩, with U a rotation. Everything shown is computed exactly.</p>`,
    next: { q: "From the very small back to people: how far could a crew travel in a lifetime — by their own clocks?", href: "#voyage", label: "Voyages · The 1 g voyage" },
    sources: "D. Page & W. Wootters, Phys. Rev. D 27, 2885 (1983); E. Moreva et al., Phys. Rev. A 89, 052122 (2014); B. DeWitt, Phys. Rev. 160, 1113 (1967)."
  });
})();
