/* Chronoscope — Deep time (D-038): Black holes evaporate · Cosmic timeline · Earth's energy budget.
   Black holes evaporate: Hawking's formulas for a non-rotating black hole radiating as a black body from its
   horizon — T = ħc³/(8πGMk), P = ħc⁶/(15360πG²M²), lifetime 5120πG²M³/(ħc⁴), M(t) = M₀(1 − t/τ)^⅓ — and the
   Page curve drawn as the smaller of the black hole's entropy and the entropy it has radiated.
   Cosmic timeline: published times (Planck 2018 ΛCDM; far future from Adams & Laughlin 1997) on a log axis.
   Earth's energy budget: radiative balance (1 − A)S/4 = σT⁴, a one-layer greenhouse, photon and entropy counts
   for black-body radiation (mean photon energy 2.70 kT; entropy flux 4E/3T). */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const sup = n => String(n).split("").map(c => SUP[c] || c).join("");
  const sci = (x, d = 1) => { if (x === 0) return "0"; const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e;
    return e >= -2 && e < 5 ? (+x.toPrecision(d + 1)).toLocaleString("en-AU") : `${m.toFixed(d)} × 10${sup(e)}`; };
  const YR = 3.156e7;
  function dur(s) {                                        // a duration in words
    const y = s / YR;
    if (s < 1e-3) return sci(s) + " s";
    if (s < 120) return `${+s.toPrecision(2)} seconds`;
    if (s < 7200) return `${Math.round(s / 60)} minutes`;
    if (y < 2) return `${Math.round(s / 86400)} days`;
    if (y < 1e4) return `${Math.round(y).toLocaleString("en-AU")} years`;
    if (y < 1e6) return `${+(y / 1e3).toPrecision(2)} thousand years`;
    if (y < 1e9) return `${+(y / 1e6).toPrecision(3)} million years`;
    if (y < 1e12) return `${+(y / 1e9).toPrecision(3)} billion years`;
    return sci(y) + " years";
  }

  /* =====================================================================
     BLACK HOLES EVAPORATE — Hawking radiation and the Page curve
     ===================================================================== */
  const HB = 1.054571817e-34, CL = 2.99792458e8, GN = 6.6743e-11, KB = 1.380649e-23, MSUN = 1.989e30, TCMB = 2.725;
  const hawkT = M => HB * CL ** 3 / (8 * Math.PI * GN * M * KB);
  const hawkP = M => HB * CL ** 6 / (15360 * Math.PI * GN * GN * M * M);
  const life = M => 5120 * Math.PI * GN * GN * M ** 3 / (HB * CL ** 4);
  const rs = M => 2 * GN * M / (CL * CL);
  const M_NOW = Math.cbrt(13.8e9 * YR * HB * CL ** 4 / (5120 * Math.PI * GN * GN));     // lifetime = the universe's age
  const PRESETS = [["sun", "The Sun's mass", MSUN], ["moon", "The Moon's mass", 7.35e22], ["mtn", "A mountain", 1e12], ["now", "Dying today", M_NOW]];
  const HK = { M0: MSUN, f: 0, play: false, parts: [], acc: 0 };
  const PAGE_F = 1 - Math.pow(2, -1.5);                     // S_BH = ½ S₀ → the Page time, 0.646 of the lifetime
  function size(m) { return m < 1e-12 ? sci(m * 1e15) + " fm" : m < 1e-6 ? sci(m * 1e9) + " nm" : m < 1 ? sci(m * 1e3) + " mm" : m < 1e4 ? `${+m.toPrecision(3)} m` : `${+(m / 1e3).toPrecision(3)} km`; }
  function massWords(M) { return M > 1e29 ? `${+(M / MSUN).toPrecision(3)} × the Sun` : M > 1e21 ? `${+(M / 7.35e22).toPrecision(2)} × the Moon` : M > 3e9 ? `${sci(M / 1e12)} × a mountain (10¹² kg)` : "a large asteroid's worth"; }
  function tempCol(T) { const q = Math.max(0, Math.min(1, (Math.log10(T) + 1) / 12)); return `hsl(${10 + q * 200}, 90%, ${55 + q * 25}%)`; }

  Chrono.lab.register({
    predict: { q: "A black hole slowly radiates away its mass and shrinks. As it gets smaller, does it get hotter or colder?",
      options: ["Colder, like a coal burning down", "Hotter, and it radiates faster and faster", "Its temperature stays the same"], answer: 1,
      explain: "Hotter. A black hole's temperature goes as one over its mass, so as it shrinks it heats up, radiates faster, and shrinks faster still. It ends in a final flash. A black hole with the Sun's mass is colder than the cosmic background (60 billionths of a degree), so real ones aren't shrinking yet." },
    applySetup(o) { Object.assign(HK, o); if (o.M0) { HK.f = 0; HK.parts = []; } },
    state() { return { M0: HK.M0, f: HK.f, T: hawkT(HK.M0), page: PAGE_F }; },   // read-only, for missions
    readouts() { const M = HK.M0 * Math.cbrt(Math.max(0, 1 - HK.f)); return HK.f >= 1 ? [["Through its life", "100%"], ["Black hole", "gone"]] : [["Through its life", `${Math.round(HK.f * 100)}%`], ["Temperature", `${sci(hawkT(M), 2)} K`], ["Time left", dur(life(M))]]; },
    id: "hawking", title: "Black holes evaporate", eyebrow: "Physics · do black holes last forever?", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    controls() {
      return PRESETS.map(([id, n, M]) => `<button class="btn ${Math.abs(HK.M0 / M - 1) < 1e-6 ? "primary" : ""}" data-hk="${id}">${n}</button>`).join("") +
        `<label class="ctl">Starting mass <input type="range" id="hk-m" min="90" max="310" value="${Math.round(Math.log10(HK.M0) * 10)}"><output id="hk-mo">${sci(HK.M0)} kg</output></label>
        <label class="ctl">Through its life <input type="range" id="hk-f" min="0" max="1000" value="${Math.round(HK.f * 1000)}"><output id="hk-fo">${Math.round(HK.f * 100)}%</output></label>
        <button class="btn" id="hk-play">${HK.play ? "Pause" : "Play its life"}</button>`;
    },
    wire() {
      document.querySelectorAll("[data-hk]").forEach(b => b.onclick = () => { HK.M0 = PRESETS.find(p => p[0] === b.dataset.hk)[2]; HK.f = 0; HK.parts = []; Chrono.lab.rebuild(); });
      $("#hk-m").oninput = e => { HK.M0 = 10 ** (e.target.value / 10); $("#hk-mo").textContent = sci(HK.M0) + " kg"; HK.f = 0; HK.parts = []; };
      $("#hk-f").oninput = e => { HK.f = e.target.value / 1000; $("#hk-fo").textContent = Math.round(HK.f * 100) + "%"; };
      $("#hk-play").onclick = () => { if (HK.f >= 1) HK.f = 0; HK.play = !HK.play; Chrono.lab.rebuild(); };
    },
    tick(dt) {
      if (HK.play && dt) { HK.f = Math.min(1, HK.f + dt / 14); const r = $("#hk-f"), o = $("#hk-fo"); if (r) r.value = Math.round(HK.f * 1000); if (o) o.textContent = Math.round(HK.f * 100) + "%"; if (HK.f >= 1) { HK.play = false; Chrono.lab.rebuild(); } }
      if (HK.f < 1) { HK.acc += dt * Math.min(160, 10 * Math.pow(1 - HK.f, -2 / 3)); while (HK.acc > 1) { HK.acc--; const a = Math.random() * TAU; HK.parts.push({ a, r: 0, v: 0.6 + Math.random() * 0.6 }); } }
      HK.parts.forEach(p => p.r += p.v * dt); HK.parts = HK.parts.filter(p => p.r < 1.2).slice(-500);
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.5), f = HK.f, M = HK.M0 * Math.cbrt(Math.max(0, 1 - f)), T = hawkT(M || 1e-9);
      g.panel(A.x, A.y, A.w, A.h, "The black hole, shrinking (not to scale)");
      const rows = f < 1 ? [["Mass", `${sci(M)} kg — ${massWords(M)}`], ["Temperature", `${sci(T, 2)} K`], ["Size (horizon radius)", size(rs(M))], ["Power radiated", `${sci(hawkP(M))} W`], ["Time left", dur(life(M))]]
        : [["Its whole life", dur(life(HK.M0))]];
      const warn = f < 1 && T < TCMB, top = A.y + A.h - 12 - rows.length * 19 - (warn ? (A.w < 620 ? 34 : 20) : 0), room = top - A.y - 30;
      const cx = A.x + A.w / 2, cy = A.y + 26 + room / 2, R0 = Math.min(A.w * 0.2, room * 0.28), r = R0 * Math.cbrt(Math.max(0, 1 - f)), reach = Math.min(A.w * 0.45, room * 0.5);
      const col = tempCol(T);
      HK.parts.forEach(p => { const d = r + p.r * (reach - r); g.dot(cx + Math.cos(p.a) * d, cy + Math.sin(p.a) * d, 1.8, col); });
      if (f < 1) { ctx.shadowColor = col; ctx.shadowBlur = 8 + 30 * Math.min(1, f * 1.2); g.dot(cx, cy, Math.max(1.5, r), "#000"); ctx.shadowBlur = 0; g.ring(cx, cy, Math.max(1.5, r), g.alpha(C.text, 0.4), 1); }
      else { ctx.shadowColor = "#fff"; ctx.shadowBlur = 40; g.dot(cx, cy, 10, "#fff"); ctx.shadowBlur = 0; g.label("gone — a final flash of radiation", cx, cy + 34, C.text, 12, "center"); }
      const x0 = A.x + 14; let y = top + 12;
      rows.forEach(([k, v]) => { g.label(k.toUpperCase(), x0, y, C.muted, 9); g.text(v, x0 + Math.min(170, A.w * 0.36), y, C.text, 12); y += 19; });
      if (warn) g.wrap(`Colder than the cosmic background (2.7 K): today it absorbs more than it emits, so it isn't shrinking yet.`, x0, y + 4, A.w - 28, 15, C.amber, 11);

      g.panel(B.x, B.y, B.w, B.h, "Where does the information go? The Page curve");
      const compact = B.h < 360, px = B.x + 44, pw = B.w - 64, py = B.y + 50, ph = Math.max(60, B.h - (compact ? 120 : 190));
      const X = q => px + q * pw, Y = s => py + ph - s * ph;
      g.line(px, py + ph, px + pw, py + ph, C.line); g.line(px, py, px, py + ph, C.line);
      g.label("entropy", px - 6, py - 6, C.muted, 9, "left"); g.label("its lifetime →", px + pw, py + ph + 16, C.muted, 9, "right");
      const curve = (fn, col, w, dash) => { ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (let i = 0; i <= 200; i++) { const q = i / 200, s = fn(q); i ? ctx.lineTo(X(q), Y(s)) : ctx.moveTo(X(q), Y(s)); } ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; };
      const sBH = q => Math.pow(1 - q, 2 / 3), sH = q => 1 - sBH(q), sP = q => Math.min(sBH(q), sH(q));
      curve(sBH, C.violet, 1.5); curve(sH, C.orange, 1.5, [5, 4]); curve(sP, C.teal, 3);
      ctx.setLineDash([2, 4]); g.line(X(PAGE_F), py, X(PAGE_F), py + ph, g.alpha(C.text, 0.3)); ctx.setLineDash([]);
      g.label("Page time", X(PAGE_F), py - 6, C.muted, 9, "center");
      g.line(X(f), py, X(f), py + ph, g.alpha(C.amber, 0.7), 1); g.dot(X(f), Y(sP(f)), 4, C.amber);
      let ly = py + ph + (compact ? 30 : 34);
      if (compact) g.wrap("violet: the black hole · dashed orange: Hawking, information lost · teal: Page, information comes out", px - 30, ly - 4, pw + 30, 13, C.text, 10);
      else [[C.violet, "the black hole's entropy — it shrinks"], [C.orange, "Hawking (1976): the radiation's entropy keeps rising — information lost"], [C.teal, "Page (1993): it must turn over and fall to zero — information comes out"]].forEach(([c, t]) => {
        g.line(px - 30, ly - 4, px - 12, ly - 4, c, 2.5); ly += g.wrap(t, px - 6, ly, pw, 14, C.text, 11) + 4; });
      g.label("Model: Hawking's formulas; Page curve shape only.", B.x + 14, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>In 1974 Stephen Hawking combined quantum theory with gravity and found that black holes aren't quite black. They glow, with a temperature that goes as <b>one over the mass</b>. They lose mass as they glow, so they heat up, glow harder, and eventually vanish in a flash.</p>
      <div class="try"><b>Try:</b> pick <b>The Sun's mass</b> and read its temperature and lifetime. Then <b>Dying today</b>: a black hole the mass of a small asteroid, formed in the early universe, would be finishing now. Press <b>Play its life</b> and watch the right-hand curve.</div>
      <p><b>How sure?</b> Hawking radiation is <span class="tag ESTABLISHED">Established</span> as theory: it follows from two well-tested theories. But no black hole's glow has been detected. Star-mass black holes are far colder than the cosmic background, and 'dying today' black holes are <span class="tag SPECULATIVE">Speculative</span>: searches for their final flashes have found none. Lab analogues, with sound in place of light, show the same effect (Steinhauer, 2016 and 2019).</p>
      <p><b>The information puzzle.</b> Hawking's radiation is random, so when the black hole is gone, whatever fell in seems erased. Quantum theory forbids that. Don Page showed that if information does come out, the radiation's entropy must follow his curve: rising, turning over at about the halfway point (the <b>Page time</b>), and falling to zero. Calculations since 2019 reproduce the Page curve in simplified models; how the information gets out is still argued over. <span class="tag CONTESTED">Contested</span></p>
      <p>Black holes also have the largest entropy of anything: a Sun-mass one about 10⁷⁷ (in units of Boltzmann's constant), vastly more than the Sun itself. That's one reason black holes sit at the centre of the arrow-of-time story.</p>
      <p class="meta">Model assumption: a non-rotating, uncharged black hole radiating as a perfect black body from its horizon (photons only). Counting every particle type makes small black holes evaporate faster: 'dying today' is then about 5 × 10¹¹ kg rather than ${sci(M_NOW)} kg. The Page curve is drawn as the smaller of the black hole's entropy and the entropy it has lost; real radiation carries about 1.5 times more.</p>`,
    next: { q: "10⁶⁷ years for the Sun's mass: where does that sit on the timeline of the universe?", href: "#timeline", label: "Cosmos · Cosmic timeline" },
    sources: "S. W. Hawking, Nature 248, 30 (1974); D. N. Page, Phys. Rev. D 13, 198 (1976) and Phys. Rev. Lett. 71, 3743 (1993); G. Penington, JHEP (2020); A. Almheiri et al., JHEP (2019); J. Steinhauer, Nature Physics 12, 959 (2016); B. Carr et al., Phys. Rev. D 81, 104019 (2010)."
  });

  /* =====================================================================
     COSMIC TIMELINE — from the Planck-time boundary to the last black hole
     ===================================================================== */
  const EVENTS = [
    { t: 5.4e-44, n: "Planck time", tag: "SPECULATIVE", d: "The earliest moment today's physics can describe, even in principle. Before it we'd need quantum gravity, which we don't have. Any account of 'before' is speculative." },
    { t: 1e-34, n: "Inflation?", tag: "CONTESTED", d: "A proposed burst of extremely fast expansion that would explain why the universe is so smooth and flat. It fits the data well, but it isn't confirmed, and some physicists prefer alternatives." },
    { t: 1e-11, n: "Particles get mass", tag: "ESTABLISHED", d: "The Higgs field switches on and particles acquire mass (the electroweak transition). The Large Hadron Collider reaches energies like these." },
    { t: 1e-5, n: "Protons form", tag: "ESTABLISHED", d: "The universe cools enough for quarks to bind into protons and neutrons." },
    { t: 1, n: "Neutrinos fly free", tag: "ESTABLISHED", d: "Neutrinos stop interacting and stream freely. A background of them still fills the universe, too faint to detect directly, but its effects show up in the cosmic microwave background." },
    { t: 180, n: "First nuclei", tag: "ESTABLISHED", d: "In about three minutes, protons and neutrons fuse into helium and a little lithium. The predicted amounts match what we measure (lithium is the one that doesn't quite fit)." },
    { t: 5.1e4 * YR, n: "Matter takes over", tag: "ESTABLISHED", d: "Matter now outweighs radiation, and gravity can start pulling it into clumps." },
    { t: 3.8e5 * YR, n: "Atoms; the CMB", tag: "ESTABLISHED", d: "Electrons join nuclei to make atoms and the universe turns transparent. The light released then is the cosmic microwave background, the oldest light we can see." },
    { t: 1.5e8 * YR, n: "First stars", tag: "CONTESTED", d: "The first stars light up, probably 100 to 200 million years in. The exact timing is still being measured." },
    { t: 2.9e8 * YR, n: "Earliest galaxies seen", tag: "ESTABLISHED", d: "The James Webb Space Telescope has seen galaxies as they were about 300 million years after the Big Bang (2024–25). They're brighter and more numerous than many models expected." },
    { t: 7.7e9 * YR, n: "Expansion speeds up", tag: "ESTABLISHED", d: "Dark energy starts to dominate and the expansion begins to accelerate. What dark energy is remains unknown, and recent surveys (DESI, 2024–25) hint it may be changing (contested)." },
    { t: 9.23e9 * YR, n: "Sun and Earth", tag: "ESTABLISHED", d: "The Sun and Earth form, 4.57 billion years ago. Dated from meteorites." },
    { t: 13.8e9 * YR, n: "Today", tag: "ESTABLISHED", d: "13.8 billion years after the Big Bang (from the Planck satellite's measurements, assuming the standard model of cosmology)." },
    { t: 18.8e9 * YR, n: "Sun a red giant", tag: "ESTABLISHED", d: "In about 5 billion years the Sun runs low on hydrogen in its core and swells into a red giant. A projection from well-tested stellar physics." },
    { t: 1e14 * YR, n: "Last stars fade", tag: "ESTABLISHED", d: "Gas for new stars runs out; the longest-lived red dwarfs burn out around 10¹⁴ years. A projection from today's physics (Adams & Laughlin, 1997): nobody can check it." },
    { t: 1e34 * YR, n: "Protons decay?", tag: "SPECULATIVE", d: "Some theories predict protons eventually decay. Experiments show their lifetime is longer than about 10³⁴ years, if they decay at all." },
    { t: 2.1e67 * YR, n: "Sun-mass black holes evaporate", tag: "ESTABLISHED", d: "A black hole with the Sun's mass evaporates by Hawking radiation in about 10⁶⁷ years (see Black holes evaporate). Established as theory, never observed." },
    { t: 1e100 * YR, n: "Largest black holes gone", tag: "ESTABLISHED", d: "The biggest black holes, billions of times the Sun's mass, take around 10¹⁰⁰ years. Then a dark era: a cold, dilute universe with almost nothing left to happen. A projection from today's physics." }
  ];
  const TODAY_S = 13.8e9 * YR, LO = -44, HI = 108;
  const TL = { mode: "log", sel: 12, geo: [], btns: [], ay: 0 };
  function calendar(t) {                                   // the universe so far, squeezed into one year
    const day = t / TODAY_S * 365, MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day >= 364) { const s = (365 - day) * 86400; return s < 1 ? "the last instant of 31 December" : s < 60 ? `${Math.round(s)} seconds before midnight on 31 December` : `${Math.round(s / 60)} minutes before midnight on 31 December`; }
    if (day < 1) { const min = day * 1440; return min < 1 ? `1 January, ${Math.max(1, Math.round(min * 60))} seconds after midnight` : min < 90 ? `1 January, ${Math.round(min)} minutes after midnight` : `1 January, about ${Math.round(min / 60)} am`; }
    let d = Math.floor(day), m = 0; while (d >= LEN[m]) { d -= LEN[m]; m++; }
    return `${d + 1} ${MON[m]}`;
  }
  function when(t) { return t < 1 ? `${sci(t, 0)} s after the Big Bang` : t === TODAY_S ? "now" : `${dur(t)} after the Big Bang`; }

  Chrono.lab.register({
    predict: { q: "Lay out cosmic time in powers of ten, from the Planck time — where today's physics stops being reliable — to the last black hole evaporating. Where does 'today' fall on that chart?",
      options: ["Near the very end: we're latecomers", "Near the very beginning", "A little under halfway along"], answer: 2,
      explain: "About 40% of the way across this chart. That's a position on a logarithmic scale whose endpoints we chose — not a fraction of the universe's lifetime. On an ordinary clock we're at the very start: 13.8 billion years out of 10¹⁰⁰. But as many powers of ten lie between the Planck time (10⁻⁴⁴ s) and today (10¹⁷ s) as between today and the last black holes." },
    applySetup(o) { Object.assign(TL, o); },
    readouts() { const e = EVENTS[TL.sel]; return [["Event", `${TL.sel + 1} of ${EVENTS.length}`], ["When", when(e.t)]]; },
    id: "timeline", title: "Cosmic timeline", eyebrow: "Cosmos · from the Planck time to the last black hole", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED", "SPECULATIVE"],
    controls() {
      return `<button class="btn ${TL.mode === "log" ? "primary" : ""}" data-tl="log">Powers of ten</button>
        <button class="btn ${TL.mode === "lin" ? "primary" : ""}" data-tl="lin">Ordinary time: the story so far</button>
        <button class="btn" id="tl-prev">← Earlier</button><button class="btn" id="tl-next">Later →</button><span class="ctl">Click any event</span>`;
    },
    wire() {
      document.querySelectorAll("[data-tl]").forEach(b => b.onclick = () => { TL.mode = b.dataset.tl; if (TL.mode === "lin" && EVENTS[TL.sel].t > 20e9 * YR) TL.sel = 12; Chrono.lab.rebuild(); });
      $("#tl-prev").onclick = () => { TL.sel = Math.max(0, TL.sel - 1); };
      $("#tl-next").onclick = () => { TL.sel = Math.min(EVENTS.length - 1, TL.sel + 1); };
    },
    pointer(type, x, y) {
      if (type !== "pointerdown") return;
      const hit = TL.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (hit) { TL.sel = Math.max(0, Math.min(EVENTS.length - 1, TL.sel + hit.d)); return; }
      let best = null, bd = 22; TL.geo.forEach(q => { const d = Math.hypot(q.x - x, q.y - y); if (d < bd) { bd = d; best = q.i; } });
      if (best === null && Math.abs(y - TL.ay) < 40) {          // near the axis: the closest marker along it
        bd = 1e9; TL.geo.forEach(q => { if (q.y === TL.ay && Math.abs(q.x - x) < bd) { bd = Math.abs(q.x - x); best = q.i; } });
      }
      if (best !== null) TL.sel = best;
    },
    enter() { if (!TL.keys) { TL.keys = true; document.addEventListener("keydown", e => { if (location.hash !== "#timeline" || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName)) return;
      if (e.key === "ArrowLeft") TL.sel = Math.max(0, TL.sel - 1); else if (e.key === "ArrowRight") TL.sel = Math.min(EVENTS.length - 1, TL.sel + 1); }); } },
    draw(g) {
      const { ctx } = g, W = g.W, H = g.H, pad = 16, A = { x: pad, y: pad, w: W - 2 * pad, h: H - 2 * pad };
      const lin = TL.mode === "lin";
      g.panel(A.x, A.y, A.w, A.h, lin ? "The universe so far, on an ordinary clock" : "All of cosmic time, in powers of ten (seconds after the Big Bang)");
      const ax = A.x + 30, aw = A.w - 60, ay = A.y + Math.max(150, A.h * 0.5); TL.ay = ay;
      const LMAX = 20e9 * YR;
      const X = t => lin ? ax + Math.min(1, t / LMAX) * aw : ax + (Math.log10(t) - LO) / (HI - LO) * aw;
      g.line(ax, ay, ax + aw, ay, C.muted, 1.5);
      const narrow = aw < 520;
      if (lin) { for (let b = 0; b <= 20; b += narrow ? 10 : 5) { const x = X(b * 1e9 * YR); g.line(x, ay - 4, x, ay + 4, C.muted); g.label(b ? `${b} billion yr` : "0", x, ay + 18, C.muted, 9, b === 20 ? "right" : "center"); } }
      else for (let e = -40; e <= 100; e += narrow ? 40 : 20) { const x = X(10 ** e); g.line(x, ay - 4, x, ay + 4, C.muted); g.label(`10${sup(e)} s`, x, ay + 18, C.muted, 9, "center"); }
      if (!lin && !narrow) { const xs = X(1), xy = X(YR * 1e9); g.label("1 second", xs, ay + 32, g.alpha(C.muted, 0.7), 9, "center"); g.label("a billion years", xy, ay + 32, g.alpha(C.muted, 0.7), 9, "center"); }
      // markers, with labels stacked in rows so they don't collide
      const shown = EVENTS.map((e, i) => ({ e, i })).filter(({ e }) => !lin || (e.t >= 1e8 * YR && e.t <= LMAX));
      const rowsUsed = [], rowH = 17, top = A.y + 40, maxRow = Math.max(3, Math.floor((ay - 24 - top) / rowH));
      TL.geo = [];
      ctx.font = "11px Inter, system-ui, sans-serif";
      shown.forEach(({ e, i }) => {
        const x = X(e.t), w = ctx.measureText(e.n).width + 10, sel = i === TL.sel;
        const named = !narrow || sel || e.n === "Today";   // on a phone, only the selected event and 'Today' carry labels
        const flip = x + w > A.x + A.w - 8, l = flip ? x - w : x, rt = flip ? x : x + w;   // near the right edge: label to the left
        if (!named) { g.dot(x, ay, 4, g.alpha(C.text, 0.6)); TL.geo.push({ x, y: ay, i }); return; }
        let r = 0; while (r < maxRow - 1 && (rowsUsed[r] || []).some(([a, b]) => l < b + 4 && rt > a - 4)) r++;
        (rowsUsed[r] = rowsUsed[r] || []).push([l, rt]);
        const ly = ay - 18 - r * rowH, col = e.n === "Today" ? C.accent : sel ? C.amber : C.text;
        g.line(x, ay, x, ly + 3, g.alpha(col, sel ? 0.8 : 0.25), 1);
        g.dot(x, ay, sel ? 6 : 4, e.n === "Today" ? C.accent : sel ? C.amber : g.alpha(C.text, 0.6));
        g.label(e.n, flip ? x - 3 : x + 3, ly, col, 11, flip ? "right" : "left", "Inter, system-ui, sans-serif");
        TL.geo.push({ x, y: ay, i }, { x: flip ? x - w / 2 : x + w / 2, y: ly - 4, i });
      });
      if (lin) { const x = X(0); g.dot(x, ay, 5, C.pink); g.label("Big Bang, and everything up to 100 million years", x + 2, ay + 44, C.pink, 10);
        g.label("the far future: switch to powers of ten →", ax + aw, ay - 4 - maxRow * rowH, C.muted, 10, "right"); }
      else { const x = X(TODAY_S); g.label("you are here", x, ay + 46, C.accent, 10, "center"); }
      // the selected event
      const e = EVENTS[TL.sel], x0 = A.x + 16, bw = Math.min(A.w - 32, 720);
      let y = ay + 70;
      const btn = (bx, d, t) => { const on = d < 0 ? TL.sel > 0 : TL.sel < EVENTS.length - 1; ctx.strokeStyle = on ? C.accent : C.line; ctx.lineWidth = 1; ctx.strokeRect(bx + .5, y - 13.5, 44, 30); g.label(t, bx + 22, y + 6, on ? C.accent : C.muted, 15, "center"); TL.btns.push({ x: bx, y: y - 14, w: 44, h: 30, d }); };
      TL.btns = []; btn(x0, -1, "◀"); btn(x0 + 52, 1, "▶");
      g.label(`${TL.sel + 1} / ${EVENTS.length} · or use ← → keys`, x0 + 110, y + 5, C.muted, 10); y += 38;
      g.text(e.n, x0, y, C.amber, 16); y += 20;
      g.label(`${when(e.t)} · ${Chrono.TAGS[e.tag].toUpperCase()}`, x0, y, C.muted, 10); y += 18;
      y += g.wrap(e.d, x0, y, bw, 16, C.text, 12) + 6;
      if (e.t <= TODAY_S && e.t > 1e4 * YR) g.wrap(`On a calendar with the universe so far squeezed into one year: ${calendar(e.t)}.`, x0, y, bw, 16, C.teal, 12);
      g.label("Times: published values (Planck 2018; far future from Adams & Laughlin 1997).", A.x + 14, A.y + A.h - 12, C.muted, 10);
    },
    aside: () => `
      <p>Everything from the Planck-time boundary, where today's physics stops being reliable, to the last black hole, on one line. The trick is <b>powers of ten</b>: each tick is ten times longer than the one before, so a trillionth of a second and a trillion years both fit.</p>
      <div class="try"><b>Try:</b> step through with <b>Later →</b> and read how sure we are of each. Then switch to <b>Ordinary time</b>: on a one-year calendar of the universe so far, the Sun forms in early September, and modern humans turn up about ${Math.round(3e5 * YR / TODAY_S * 365 * 1440)} minutes before midnight on 31 December.</div>
      <p><b>The arrow on the largest scale.</b> Early on, things happened fast and the universe was astonishingly smooth: low entropy. Everything since, from stars to life, has been that order running down. Far in the future there's almost nothing left to happen.</p>
      <p><b>How sure?</b> The first three minutes onwards are <span class="tag ESTABLISHED">Established</span>: the predicted helium and the cosmic microwave background match what we measure. Inflation is <span class="tag CONTESTED">Contested</span>. Before the Planck time, everything is <span class="tag SPECULATIVE">Speculative</span>. The far future is a projection of today's physics: sure physics, but nobody can check it.</p>
      <p class="meta">Model assumption: published times from the standard model of cosmology (Planck 2018) and far-future projections (Adams & Laughlin 1997); not computed here. The axis runs from 10⁻⁴⁴ s to 10¹⁰⁸ s.</p>`,
    next: { q: "Here and now, what keeps the arrow of time running on Earth?", href: "#energy", label: "Voyages · Earth's energy budget" },
    sources: "Planck Collaboration, A&A 641, A6 (2020); F. C. Adams & G. Laughlin, Rev. Mod. Phys. 69, 337 (1997); C. Sagan, The Dragons of Eden (1977) — the cosmic calendar."
  });

  /* =====================================================================
     EARTH'S ENERGY BUDGET — the arrow of time at the scale of a planet
     ===================================================================== */
  const SIG = 5.670374e-8, S0 = 1361, TSUN = 5772, AREA = 5.1e14;
  const EN = { A: 0.30, eps: 0.78, parts: [], acc: 0 };
  const budget = () => { const Q = (1 - EN.A) * S0 / 4, Te = Math.pow(Q / SIG, 0.25), Ts = Te * Math.pow(2 / (2 - EN.eps), 0.25);
    return { Q, Te, Ts, ratio: TSUN / Te, sIn: 4 / 3 * Q / TSUN, sOut: 4 / 3 * Q / Te }; };
  const cel = K => `${Math.round(Math.round(K) - 273.15)} °C`;
  const EPRE = [["today", "Earth today", 0.30, 0.78], ["bare", "No greenhouse", 0.30, 0], ["snow", "Snowball Earth", 0.60, 0.78]];

  Chrono.lab.register({
    predict: { q: "Earth absorbs a huge amount of energy from the Sun every day. Over a year, how much of it does Earth send back out into space?",
      options: ["Almost none: oceans, air and life store it", "About half", "Almost exactly all of it"], answer: 2,
      explain: "Almost all of it: if Earth kept much, it would heat up fast. (The small imbalance measured today, well under 1%, is what's warming the planet.) So what Earth gets from the Sun isn't really energy. It's low entropy: each photon of sunlight that's absorbed leaves again as about 20 photons of infrared." },
    applySetup(o) { Object.assign(EN, o); },
    state() { return { A: EN.A, eps: EN.eps, Tc: budget().Ts - 273.15 }; },   // read-only, for missions
    readouts() { const E = budget(); return [["Average surface", cel(E.Ts)], ["Radiating to space", `${Math.round(E.Te)} K`], ["Sunlight reflected", `${Math.round(EN.A * 100)}%`]]; },
    id: "energy", title: "Earth's energy budget", eyebrow: "Voyages · what keeps time's arrow running here?", tier: "mainstream", tags: ["ESTABLISHED"],
    controls() {
      return EPRE.map(([id, n, a, e]) => `<button class="btn ${EN.A === a && EN.eps === e ? "primary" : ""}" data-en="${id}">${n}</button>`).join("") +
        `<label class="ctl">Reflected sunlight (albedo) <input type="range" id="en-a" min="5" max="75" value="${Math.round(EN.A * 100)}"><output id="en-ao">${Math.round(EN.A * 100)}%</output></label>
        <label class="ctl">Greenhouse layer absorbs <input type="range" id="en-e" min="0" max="100" value="${Math.round(EN.eps * 100)}"><output id="en-eo">${Math.round(EN.eps * 100)}%</output></label>`;
    },
    wire() {
      document.querySelectorAll("[data-en]").forEach(b => b.onclick = () => { const p = EPRE.find(q => q[0] === b.dataset.en); EN.A = p[2]; EN.eps = p[3]; Chrono.lab.rebuild(); });
      $("#en-a").oninput = e => { EN.A = e.target.value / 100; $("#en-ao").textContent = e.target.value + "%"; };
      $("#en-e").oninput = e => { EN.eps = e.target.value / 100; $("#en-eo").textContent = e.target.value + "%"; };
    },
    tick(dt) {
      const B = budget();
      EN.acc += dt * 3;
      while (EN.acc > 1) { EN.acc--; EN.parts.push({ k: "in", x: 0, y: (Math.random() - 0.5) * 1.6, v: 0.5 }); }
      const out = [];
      EN.parts.forEach(p => {
        if (p.k === "in") { p.x += p.v * dt; if (p.x >= 1 - Math.sqrt(Math.max(0, 0.64 - p.y * p.y)) * 0.18) { if (Math.random() < EN.A) { p.k = "ref"; } else { p.k = "gone"; const n = Math.round(B.ratio); for (let j = 0; j < n; j++) { const a = Math.random() * TAU; out.push({ k: "ir", a, r: 1, v: 0.35 + Math.random() * 0.3 }); } } } }
        else if (p.k === "ref") p.x -= p.v * dt;
        else if (p.k === "ir") p.r += p.v * dt;
      });
      EN.parts = EN.parts.concat(out).filter(p => p.k !== "gone" && (p.k !== "ref" || p.x > 0) && (p.k !== "ir" || p.r < 3.2)).slice(-900);
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.42), E = budget();
      g.panel(A.x, A.y, A.w, A.h, "Sunlight in, infrared out (not to scale)");
      const sx = A.x + 10, ex = A.x + A.w * 0.68, ey = A.y + A.h * 0.5, er = Math.min(A.w, A.h) * 0.13, lane = Math.min(A.h * 0.28, er * 2.2);
      ctx.save(); ctx.beginPath(); ctx.rect(A.x + 1, A.y + 26, A.w - 2, A.h - 27); ctx.clip();
      ctx.shadowColor = C.amber; ctx.shadowBlur = 30; g.dot(sx - A.h * 0.3, ey, A.h * 0.38, "#ffd35a"); ctx.shadowBlur = 0;
      EN.parts.forEach(p => {
        if (p.k === "in" || p.k === "ref") { const x = sx + p.x * (ex - er * 0.9 - sx), y = ey + p.y * lane * 0.5; g.dot(x, y, 4, p.k === "ref" ? g.alpha("#ffd35a", 0.55) : "#ffd35a"); }
        else if (p.k === "ir") { g.dot(ex + Math.cos(p.a) * er * p.r, ey + Math.sin(p.a) * er * p.r, 1.6, g.alpha(C.orange, Math.max(0, 1 - (p.r - 1) / 2.2))); }
      });
      ctx.shadowColor = C.accent; ctx.shadowBlur = 14; g.dot(ex, ey, er, "#1f4f7a"); ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.beginPath(); ctx.arc(ex, ey, er, -Math.PI / 2, Math.PI / 2); ctx.fill();
      g.ring(ex, ey, er * (1 + 0.12 * EN.eps), g.alpha(C.teal, 0.15 + 0.4 * EN.eps), 2);
      ctx.restore();
      g.label("Sun, 5,772 K", A.x + 14, A.y + A.h - 34, "#ffd35a", 11);
      g.label(`Earth radiates at ${Math.round(E.Te)} K`, ex, ey + er + 24, C.orange, 11, "center");
      g.label("big dots: sunlight · small dots: infrared", A.x + 14, A.y + A.h - 14, C.muted, 10);

      g.panel(B.x, B.y, B.w, B.h, "Per square metre of Earth, averaged");
      const x0 = B.x + 14, bw = B.w - 28, tight = B.h < 380, bh = tight ? 7 : 9, gap = tight ? 11 : 14;
      let y = B.y + (tight ? 40 : 48);
      const bars = (title, a, b, la, lb, cb) => {
        g.label(title, x0, y, C.muted, 10); y += tight ? 7 : 10;
        const m = Math.max(a, b);
        g.bar(x0, y, bw * 0.6, bh, a / m, "#ffd35a"); g.label(la, x0 + bw * 0.62, y + bh - 1, C.text, 11); y += gap;
        g.bar(x0, y, bw * 0.6, bh, b / m, cb); g.label(lb, x0 + bw * 0.62, y + bh - 1, C.text, 11); y += tight ? 20 : 26;
      };
      bars("ENERGY", E.Q, E.Q, `in ${Math.round(E.Q)} W`, `out ${Math.round(E.Q)} W`, C.orange);
      bars("PHOTONS", 1, E.ratio, "in: 1", `out: ${E.ratio.toFixed(1)}`, C.orange);
      bars("ENTROPY", E.sIn, E.sOut, `in ${E.sIn.toFixed(2)} W/K`, `out ${E.sOut.toFixed(2)} W/K`, C.orange);
      if (B.h >= 380) y += g.wrap(`Same energy out as in, but ${E.ratio.toFixed(0)} times as many photons, carrying ${E.ratio.toFixed(0)} times the entropy. Earth takes in low entropy and sends out high entropy: about ${sci((E.sOut - E.sIn) * AREA)} W/K for the whole planet.`, x0, y, bw, 16, C.text, 12) + 12;
      g.label("TEMPERATURES", x0, y, C.muted, 10); y += tight ? 16 : 18;
      g.text(`${tight ? "To space" : "Radiating to space"}: ${Math.round(E.Te)} K (${cel(E.Te)})`, x0, y, C.orange, 12); y += tight ? 16 : 18;
      g.text(`${tight || !EN.eps ? "Surface" : "Surface, under the greenhouse layer"}${EN.eps ? "" : " (no greenhouse)"}: ${Math.round(E.Ts)} K (${cel(E.Ts)})`, x0, y, C.teal, 12); y += 18;
      g.label(tight ? "Model: one-layer greenhouse; not a climate model." : "Model: radiative balance, one-layer greenhouse. Not a climate model.", x0, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>Earth is bathed in sunlight, and it sends almost exactly the same energy back out into space. So what does it actually <i>get</i> from the Sun?</p>
      <p>The answer is <b>low entropy</b>. Sunlight comes from a surface at 5,772 K, in fairly few high-energy photons. Earth sends the same energy away at about 255 K, as roughly twenty times as many low-energy infrared photons. Many photons can be arranged in far more ways than few: entropy goes out about twenty times faster than it comes in.</p>
      <div class="try"><b>Try:</b> watch one big dot of sunlight arrive and about twenty small dots leave. Then press <b>No greenhouse</b>: the surface drops to about −18 °C, but the photon count barely changes. The greenhouse layer warms the ground, not the balance with space.</div>
      <p><b>Why it matters for time.</b> Weather, rivers, plants and you all run on that difference. Every process that builds order here, from a leaf to a thought, is paid for by entropy shipped out to space. That's the arrow of time at the scale of a planet, and it traces back to the Sun, and the Sun's order back to a smooth early universe. <span class="tag ESTABLISHED">Established</span></p>
      <p><b>How sure?</b> The balance is measured by satellites (CERES). Earth currently keeps a little under 1% of what it absorbs, about 1 W per square metre, and that is the warming. <span class="tag ESTABLISHED">Established</span></p>
      <p class="meta">Model assumption: sunlight 1,361 W/m² spread over the whole sphere (÷ 4); Earth and Sun as black bodies; a single greenhouse layer that absorbs the chosen share of infrared. Photon numbers from the mean black-body photon energy (2.70 kT); entropy flux 4E/3T. Real climate needs clouds, water vapour, oceans and feedbacks. This isn't a climate model.</p>`,
    next: { q: "Black holes have the most entropy of anything. Do they last forever?", href: "#hawking", label: "Physics · Black holes evaporate" },
    sources: "E. Schrödinger, What is Life? (1944); R. Penrose, The Emperor's New Mind (1989), ch. 7; A. Kleidon, Naturwissenschaften 96, 653 (2009); N. G. Loeb et al., Geophys. Res. Lett. 48, e2021GL093047 (2021)."
  });
})();
