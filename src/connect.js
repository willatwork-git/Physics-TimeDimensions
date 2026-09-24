/* Chronoscope — How it all connects (D-040): a systems map of gravity, light, time, entropy, the universe,
   black holes and the dark sector. Each arrow is one claim, tagged, with the lab that shows it. There is no
   single equation joining them — that would be the theory physics doesn't have — so the map says so.
   The cosmic-time slider resizes nodes from the real energy budget: the Friedmann equation with Planck 2018
   values (radiation ∝ a⁻⁴, matter ∝ a⁻³, dark energy constant). Where the entropy sits is a rough schematic
   from published estimates (Egan & Lineweaver 2010), with the far future a projection. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;

  /* ---------- the map ---------- */
  const N = {
    bigbang: { t: "The beginning", x: 0.09, y: 0.08, col: "#f2c94c", d: "The hot, dense, remarkably smooth start, 13.8 billion years ago.", gap: "Why so ordered at the start? What, if anything, came before?" },
    expansion: { t: "Expansion", x: 0.47, y: 0.07, col: "#9b8cff", d: "Space itself stretching, carrying galaxies apart." },
    darkenergy: { t: "Dark energy", x: 0.88, y: 0.08, col: "#c9a0ff", d: "About 70% of today's energy budget. It makes the expansion speed up.", gap: "What is it? Is it changing over time?" },
    darkmatter: { t: "Dark matter", x: 0.08, y: 0.42, col: "#8a90a2", d: "About 85% of all matter, seen only through its gravity.", gap: "What is it? No particle has been found." },
    gravity: { t: "Gravity", x: 0.33, y: 0.36, col: "#7cc4ff", d: "Curved spacetime (general relativity), tested to high precision." },
    light: { t: "Light", x: 0.63, y: 0.36, col: "#ffd35a", d: "Radiation: starlight, the cosmic background, and in the far future Hawking radiation." },
    quantum: { t: "Quantum", x: 0.92, y: 0.40, col: "#5ee0e6", d: "The rules at the smallest scale: undecided paths, entanglement." },
    structure: { t: "Stars & galaxies", x: 0.16, y: 0.70, col: "#ff7a59", d: "Gas gathered by gravity into stars and galaxies, which shine and forge new elements." },
    entropy: { t: "Entropy", x: 0.55, y: 0.70, col: "#4fd1a5", d: "The number of ways things can be arranged. It always rises overall." },
    time: { t: "Time", x: 0.86, y: 0.68, col: "#e36bd0", d: "What clocks measure. It runs at different rates, and in one direction.", gap: "Why one time dimension? What is 'now'?" },
    blackholes: { t: "Black holes", x: 0.33, y: 0.93, col: "#e6e8ee", d: "Where gravity wins completely: the universe's biggest store of entropy." },
    earth: { t: "Earth & life", x: 0.78, y: 0.93, col: "#6fbf73", d: "A planet running on the low entropy of sunlight." }
  };
  /* [from, to, verb, claim, tags, href, where, gap?, labOnly?] */
  const E = [
    ["gravity", "time", "slows", "Clocks run slower deeper in gravity. A GPS satellite's clock gains 45 microseconds a day on the ground's from this alone.", ["ESTABLISHED"], "#clocks", "Clock Lab"],
    ["gravity", "light", "bends and traps", "Gravity bends light's path, and at a black hole's horizon traps it completely.", ["ESTABLISHED"], "#river", "The River"],
    ["gravity", "structure", "gathers", "Gravity pulls gas into stars and galaxies. With gravity, clumping is the likely direction: it turns the usual 'spread out is likely' rule on its head.", ["ESTABLISHED"], "#janus", "The Janus point"],
    ["darkmatter", "gravity", "adds to", "Something unseen adds gravity: about five times as much as all ordinary matter. Its pull is measured; what it is, nobody knows.", ["ESTABLISHED", "CONTESTED"], "#expand", "Expanding universe"],
    ["darkmatter", "structure", "scaffolds", "Galaxies grew inside clumps of dark matter. Without its extra pull there wouldn't have been time for them to form.", ["ESTABLISHED"], "#timeline", "Cosmic timeline"],
    ["darkenergy", "expansion", "accelerates", "Dark energy has made the expansion speed up for about the last six billion years. What it is is unknown, and recent surveys hint it may be changing.", ["ESTABLISHED", "CONTESTED"], "#expand", "Expanding universe"],
    ["gravity", "expansion", "brakes", "The gravity of all the matter slows the expansion. For the first eight billion years or so, it won.", ["ESTABLISHED"], "#expand", "Expanding universe"],
    ["expansion", "light", "stretches", "Light's wavelength stretches with space: redshift. That's how the cosmic background cooled from about 3,000 K to 2.7 K.", ["ESTABLISHED"], "#expand", "Expanding universe"],
    ["expansion", "time", "slows distant clocks", "Faraway supernovae unfold more slowly, stretched by exactly the redshift factor: cosmic time dilation, measured.", ["ESTABLISHED"], "#sure", "How sure are we?"],
    ["expansion", "structure", "separates", "Accelerating expansion is carrying galaxy groups apart for good; beyond our event horizon they can never be reached.", ["ESTABLISHED"], "#horizons", "Cosmic horizons"],
    ["bigbang", "expansion", "set going", "The universe began hot, dense and expanding, and has kept expanding for 13.8 billion years.", ["ESTABLISHED"], "#timeline", "Cosmic timeline"],
    ["bigbang", "entropy", "started it low", "The early universe was astonishingly smooth: low entropy, as far as gravity is concerned. Everything since runs downhill from there. Why it started that way is an open hole.", ["ESTABLISHED"], "#atlas/H3", "Atlas · hole H3", true],
    ["structure", "light", "shines", "Stars turn a little of their mass into light, and forge heavier elements as they go.", ["ESTABLISHED"], "#energy", "Earth's energy budget"],
    ["light", "earth", "feeds", "Earth takes in sunlight: relatively few, high-energy photons.", ["ESTABLISHED"], "#energy", "Earth's energy budget"],
    ["earth", "entropy", "exports", "Earth sends the same energy back out as about twenty times as many infrared photons. Weather and life run on the difference.", ["ESTABLISHED"], "#energy", "Earth's energy budget"],
    ["light", "entropy", "carries", "Radiation carries entropy away. Starlight streaming out into expanding space never comes back.", ["ESTABLISHED"], "#entropy", "Entropy box"],
    ["structure", "blackholes", "collapses into", "The most massive stars end as black holes, and galaxy centres hold giant ones.", ["ESTABLISHED"], "#river", "The River"],
    ["blackholes", "entropy", "hold most of", "Black holes hold far more entropy than everything else in the observable universe combined.", ["ESTABLISHED"], "#hawking", "Black holes evaporate"],
    ["blackholes", "light", "evaporate into", "Hawking radiation: black holes slowly turn back into radiation. Established as theory; never observed.", ["ESTABLISHED"], "#hawking", "Black holes evaporate"],
    ["entropy", "time", "gives an arrow", "Entropy rising gives time its direction. Whether the arrow simply is entropy, or something deeper, is argued over.", ["ESTABLISHED", "CONTESTED"], "#entropy", "Entropy box"],
    ["quantum", "time", "may create", "Time may emerge from entanglement: a universe frozen as a whole whose parts still see time pass.", ["CONTESTED"], "#frozen", "The frozen universe"],
    ["quantum", "light", "leaves undecided", "A photon has no definite path until it's measured, even if the choice of measurement comes late.", ["ESTABLISHED"], "#delayed", "Delayed choice"],
    ["blackholes", "quantum", "information?", "When a black hole evaporates, does what fell in come back out? Page's curve says it must; how it does is still argued over.", ["CONTESTED"], "#hawking", "Black holes evaporate", true],
    ["gravity", "quantum", "don't fit", "Our two best theories disagree about what time even is. Joining them is the biggest gap in physics.", ["ESTABLISHED"], "#atlas/H1", "Atlas · hole H1", true],
    ["blackholes", "bigbang", "recycle into?", "The black-hole cycle: the universe condenses into black holes and is reborn from one. Penrose's conformal cyclic cosmology is a relative.", ["HYPOTHESIS"], "#atlas/wc-bhcycle", "Atlas · the black-hole cycle", false, true]
  ].map(([a, b, v, c, tags, href, where, gap, lab], i) => ({ i, a, b, v, c, tags, href, where, gap: !!gap, lab: !!lab }));
  const PATHS = {
    arrow: { t: "The arrow of time", s: [11, 2, 12, 13, 14, 16, 17, 18, 19] },
    photon: { t: "A photon's life", s: [12, 1, 7, 21, 13, 14, 18] },
    dark: { t: "The dark things", s: [3, 4, 6, 5, 9] },
    gaps: { t: "The gaps", s: ["darkmatter", "darkenergy", 23, 11, 22, 19, "time"] }
  };
  const CX = { sel: null, hover: null, path: null, step: 0, logt: 10.14, geo: null };
  const edges = () => E.filter(e => !e.lab || Chrono.shows("exploratory"));

  /* ---------- the energy budget over cosmic time: Friedmann, flat, Planck 2018 ---------- */
  const OR = 9.1e-5, OM = 0.315, OB = 0.049, OL = 1 - OM - OR, H0 = 0.06893;      // H0 in 1/Gyr (67.4 km/s/Mpc)
  const Hof = a => H0 * Math.sqrt(OR / a ** 4 + OM / a ** 3 + OL);
  const TAB = (() => {                                     // t(a) by integrating dt = d(ln a) / H, from deep in the radiation era
    const out = [], lo = Math.log(1e-12), hi = Math.log(60), n = 6000, dl = (hi - lo) / n;
    let a = Math.exp(lo), t = a * a / (2 * H0 * Math.sqrt(OR));
    for (let k = 0; k <= n; k++) { const la = lo + k * dl; out.push([t, la]); const a1 = Math.exp(la), a2 = Math.exp(la + dl / 2), a3 = Math.exp(la + dl);
      t += dl / 6 * (1 / Hof(a1) + 4 / Hof(a2) + 1 / Hof(a3)); }
    return out;
  })();
  function aAt(tGyr) {
    if (tGyr >= TAB[TAB.length - 1][0]) return Infinity;
    let lo = 0, hi = TAB.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; TAB[m][0] < tGyr ? lo = m : hi = m; }
    const [t0, l0] = TAB[lo], [t1, l1] = TAB[hi]; return Math.exp(l0 + (l1 - l0) * (tGyr - t0) / (t1 - t0));
  }
  function budget(tYr) {
    const a = aAt(tYr / 1e9);
    if (!isFinite(a)) return { rad: 0, dm: 0, bar: 0, de: 1 };
    const r = OR / a ** 4, m = OM / a ** 3, tot = r + m + OL;
    return { rad: r / tot, dm: m * (OM - OB) / OM / tot, bar: m * OB / OM / tot, de: OL / tot };
  }
  /* where the entropy sits, as log10 (in units of Boltzmann's constant, for the volume that is today's observable universe) */
  const lerp = (x, x0, x1, y0, y1) => y0 + (y1 - y0) * Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  function ent(lt) {                                        // lt = log10(years)
    const bh = lt < 8 || lt > 100 ? null : lt < 10.14 ? lerp(lt, 8, 10.14, 97, 104.5) : lt < 14 ? lerp(lt, 10.14, 14, 104.5, 105) : 105;
    const hawk = lt < 98 ? null : lerp(lt, 98, 100, 100, 105.2);
    return { rad: 88.6, bh, hawk };
  }
  function era(lt) {
    const y = 10 ** lt;
    return y < 5.1e4 ? "Radiation era: light and neutrinos dominate; not even atoms yet."
      : y < 3.8e5 ? "Matter takes over: gravity can start gathering things together."
      : y < 1.5e8 ? "The dark ages: atoms and the cosmic background light, but no stars yet."
      : y < 7.7e9 ? "Stars and galaxies: gravity builds structure, and entropy starts piling up in black holes."
      : y < 1e14 ? `Dark energy takes over: expansion speeds up and galaxy groups drift out of reach.${Math.abs(lt - 10.14) < 0.08 ? " You are here." : ""}`
      : y < 1e40 ? "The stars have gone out: cold remnants and black holes."
      : y < 1e100 ? "The black-hole era: black holes hold nearly all the entropy, slowly evaporating."
      : "The dark era: only faint radiation, spread impossibly thin. The entropy is back in light.";
  }
  function alive(id, lt) {                                  // which things exist at this moment (faded when not)
    const y = 10 ** lt;
    return id === "structure" ? y >= 1.5e8 && y <= 1e14 : id === "blackholes" ? y >= 1e8 && y <= 1e100 : id === "earth" ? y >= 9.23e9 && y <= 1.9e10 : true;
  }
  function when(lt) {
    const y = 10 ** lt, s = y * 3.156e7;
    if (s < 120) return `${+s.toPrecision(2)} seconds`;
    if (y < 1) return `${Math.round(y * 365)} days`;
    if (y < 1e4) return `${Math.round(y).toLocaleString("en-AU")} years`;
    if (y < 1e6) return `${+(y / 1e3).toPrecision(2)} thousand years`;
    if (y < 1e9) return `${+(y / 1e6).toPrecision(2)} million years`;
    if (y < 1e12) return `${+(y / 1e9).toPrecision(3)} billion years`;
    return `10${String(Math.round(lt)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("")} years`;
  }

  /* ---------- drawing ---------- */
  function arrow(g, x1, y1, x2, y2, col, w, dash) {
    const { ctx } = g, a = Math.atan2(y2 - y1, x2 - x1);
    if (dash) ctx.setLineDash(dash); g.line(x1, y1, x2, y2, col, w); ctx.setLineDash([]);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4)); ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
  }
  const focus = () => {                                     // what's highlighted: a path step, a selected edge or node, or a hovered node
    if (CX.path) { const s = PATHS[CX.path].s[CX.step]; return typeof s === "number" ? { e: s } : { n: s }; }
    return CX.sel || (CX.hover ? { n: CX.hover } : null);
  };

  function draw(g) {
    const { ctx } = g, narrow = g.W < 560, { A, B } = g.split(narrow ? 0.6 : 0.64), lt = CX.logt, bud = budget(10 ** lt), F = focus();
    g.panel(A.x, A.y, A.w, A.h, "How it all connects — click a circle or an arrow");
    const R = Math.max(15, Math.min(30, Math.min(A.w, A.h) * 0.05));
    const scale = { light: bud.rad, darkmatter: bud.dm, structure: bud.bar, darkenergy: bud.de };
    const P = {}; Object.entries(N).forEach(([id, n]) => { P[id] = { x: A.x + 30 + n.x * (A.w - 60), y: A.y + 44 + n.y * (A.h - (narrow ? 112 : 84)),
      r: id in scale ? R * (0.55 + 0.9 * Math.sqrt(scale[id])) : R };
    });
    const hot = e => F && (F.e === e.i || (F.n && (e.a === F.n || e.b === F.n)));
    const vis = edges(); CX.geo = { P, vis };
    vis.forEach(e => {                                      // arrows, dim unless in focus
      const p = P[e.a], q = P[e.b], d = Math.hypot(q.x - p.x, q.y - p.y), ux = (q.x - p.x) / d, uy = (q.y - p.y) / d, on = hot(e);
      const col = e.lab ? C.hyp : e.gap ? C.amber : C.text, al = on ? 0.95 : F ? 0.08 : 0.22;
      arrow(g, p.x + ux * (p.r + 3), p.y + uy * (p.r + 3), q.x - ux * (q.r + 5), q.y - uy * (q.r + 5), g.alpha(col, al), on ? 2 : 1.2, e.gap || e.lab ? [5, 4] : null);
      if (on) { let mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, best = -1;   // label where it's furthest from any node
        for (let t = 0.3; t <= 0.701; t += 0.05) { const x = p.x + (q.x - p.x) * t, y = p.y + (q.y - p.y) * t, dmin = Math.min(...Object.values(P).map(o => Math.hypot(o.x - x, o.y + o.r * 0.6 - y) - o.r)); if (dmin > best) { best = dmin; mx = x; my = y; } }
        ctx.font = "11px Inter, system-ui, sans-serif"; const w = ctx.measureText(e.v).width + 10;
        ctx.fillStyle = C.bg; ctx.fillRect(mx - w / 2, my - 9, w, 17); g.label(e.v, mx, my + 4, col, 11, "center", "Inter, system-ui, sans-serif"); }
    });
    Object.entries(N).forEach(([id, n]) => {                // the nodes
      const p = P[id], live = alive(id, lt), on = F && F.n === id, al = live ? 1 : 0.25;
      ctx.globalAlpha = al;
      if (on) { ctx.shadowColor = n.col; ctx.shadowBlur = 18; }
      g.dot(p.x, p.y, p.r, id === "blackholes" ? "#000" : g.alpha(n.col, 0.22)); ctx.shadowBlur = 0;
      g.ring(p.x, p.y, p.r, n.col, on ? 2.5 : 1.5);
      g.label(n.t, p.x, p.y + p.r + 14, on ? C.text : g.alpha(C.text, 0.85), 11, "center", "Inter, system-ui, sans-serif");
      if (n.gap) g.label("?", p.x + p.r * 0.72, p.y - p.r * 0.72, C.amber, 12, "center");
      ctx.globalAlpha = 1;
    });
    const cap = F && F.e !== undefined ? E[F.e].c : F && F.n ? N[F.n].d : "Solid lines: established links. Amber dashes: open gaps. ? marks an unknown.";
    g.wrap(cap, A.x + 14, A.y + A.h - (A.w < 480 ? 34 : 18), A.w - 28, 14, g.alpha(C.text, 0.8), 11);

    g.panel(B.x, B.y, B.w, B.h, "The universe at this moment");
    const x0 = B.x + 14, bw = B.w - 28, tight = B.h < 330, rh = tight ? 13 : 18; let y = B.y + (tight ? 40 : 46);
    g.text(`${when(lt)} after the Big Bang`, x0, y, C.amber, tight ? 13 : 14); y += tight ? 15 : 18;
    y += g.wrap(era(lt), x0, y, bw, tight ? 13 : 15, C.text, tight ? 11 : 12) + (tight ? 6 : 12);
    g.label("WHAT IT'S MADE OF (SHARE OF ENERGY)", x0, y, C.muted, 9); y += tight ? 2 : 8;
    [["Light & neutrinos", bud.rad, "#ffd35a"], ["Dark matter", bud.dm, "#8a90a2"], ["Ordinary matter", bud.bar, "#ff7a59"], ["Dark energy", bud.de, "#c9a0ff"]].forEach(([n, f, col]) => {
      y += rh - 12; g.bar(x0, y, bw * 0.5, 8, f, col); g.label(`${n} ${f < 0.001 && f > 0 ? "<0.1" : (f * 100).toFixed(f < 0.1 ? 1 : 0)}%`, x0 + bw * 0.53, y + 8, C.text, 11, "left", "Inter, system-ui, sans-serif"); y += 12;
    });
    const S = ent(lt), sup = v => "10" + String(Math.round(v)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("");
    if (tight) { y += 14; g.wrap(`Entropy (rough): background light ${sup(S.rad)}${S.bh ? ` · black holes ${sup(S.bh)}` : ""}${S.hawk ? ` · Hawking radiation ${sup(S.hawk)}` : ""}`, x0, y, bw, 13, C.text, 11); return; }
    y += 16; g.label("WHERE THE ENTROPY IS (ROUGH, POWERS OF TEN)", x0, y, C.muted, 9); y += 8;
    const rows = [["Background light", S.rad, "#ffd35a"], ["Black holes", S.bh, "#e6e8ee"], ["Hawking radiation", S.hawk, C.teal]];
    rows.forEach(([n, v, col]) => { y += 6; g.bar(x0, y, bw * 0.5, 8, v ? (v - 80) / 26 : 0, col); g.label(`${n} ${v ? "10" + String(Math.round(v)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("") : "—"}`, x0 + bw * 0.53, y + 8, v ? C.text : C.muted, 11, "left", "Inter, system-ui, sans-serif"); y += 12; });
    g.label("Model: Friedmann (Planck 2018); entropy: estimates.", x0, B.y + B.h - 14, C.muted, 10);
  }
  function hit(x, y) {
    if (!CX.geo) return null;
    const { P, vis } = CX.geo;
    for (const [id, p] of Object.entries(P)) if (Math.hypot(x - p.x, y - p.y) < p.r + 6) return { n: id };
    let best = null, bd = 8;
    vis.forEach(e => { const p = P[e.a], q = P[e.b], dx = q.x - p.x, dy = q.y - p.y, t = Math.max(0, Math.min(1, ((x - p.x) * dx + (y - p.y) * dy) / (dx * dx + dy * dy))), d = Math.hypot(x - p.x - t * dx, y - p.y - t * dy); if (d < bd) { bd = d; best = { e: e.i }; } });
    return best;
  }

  /* ---------- the side panel follows the selection ---------- */
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;
  const edgeLine = e => `<button class="cxl" data-cx-e="${e.i}"><b>${N[e.a].t}</b> ${e.v} <b>${N[e.b].t}</b>${e.gap ? " <i>gap</i>" : ""}</button>`;
  function selHTML() {
    const F = focus(); if (!F) return "";
    if (F.e !== undefined) { const e = E[F.e];
      return `<div class="cxsel"><div class="eyebrow">${CX.path ? `${PATHS[CX.path].t} · ${CX.step + 1} of ${PATHS[CX.path].s.length}` : "Link"}</div>
        <h3>${N[e.a].t} → ${e.v} → ${N[e.b].t}</h3><p>${e.c}</p><div class="pillrow">${e.tags.map(TG).join(" ")}</div>
        <a class="nextq" href="${e.href}"><span class="eyebrow">See it in the app</span><span class="hgo">${e.where} →</span></a></div>`; }
    const n = N[F.n], ins = edges().filter(e => e.b === F.n), outs = edges().filter(e => e.a === F.n);
    return `<div class="cxsel"><div class="eyebrow">${CX.path ? `${PATHS[CX.path].t} · ${CX.step + 1} of ${PATHS[CX.path].s.length}` : "Node"}</div><h3>${n.t}</h3><p>${n.d}</p>
      ${n.gap ? `<p class="cxgap"><b>Unknown:</b> ${n.gap}</p>` : ""}
      ${outs.length ? `<div class="eyebrow">What it drives</div>${outs.map(edgeLine).join("")}` : ""}
      ${ins.length ? `<div class="eyebrow">What drives it</div>${ins.map(edgeLine).join("")}` : ""}</div>`;
  }

  Chrono.lab.register({
    id: "connect", title: "How it all connects", eyebrow: "Guide · a map of the big ideas", tier: "mainstream", tags: ["ESTABLISHED", "CONTESTED"],
    controls() {
      return `<label class="ctl">Cosmic time <input type="range" id="cx-t" min="-70" max="1010" value="${Math.round(CX.logt * 10)}"><output id="cx-to">${when(CX.logt)}</output></label>
        <button class="btn" id="cx-now">Today</button>
        <span class="ctl">Follow:</span>${Object.entries(PATHS).map(([k, p]) => `<button class="btn ${CX.path === k ? "primary" : ""}" data-cx-path="${k}">${p.t}</button>`).join("")}
        ${CX.path ? `<button class="btn" id="cx-prev">◀</button><button class="btn" id="cx-next">▶</button>` : ""}
        ${CX.path || CX.sel ? `<button class="btn" id="cx-clear">Clear</button>` : ""}`;
    },
    wire() {
      $("#cx-t").oninput = e => { CX.logt = e.target.value / 10; $("#cx-to").textContent = when(CX.logt); };
      $("#cx-now").onclick = () => { CX.logt = 10.14; Chrono.lab.rebuild(); };
      document.querySelectorAll("[data-cx-path]").forEach(b => b.onclick = () => { CX.path = CX.path === b.dataset.cxPath ? null : b.dataset.cxPath; CX.step = 0; CX.sel = null; Chrono.lab.rebuild(); });
      const pv = $("#cx-prev"), nx = $("#cx-next"), cl = $("#cx-clear"), L = () => PATHS[CX.path].s.length;
      if (pv) pv.onclick = () => { CX.step = (CX.step - 1 + L()) % L(); Chrono.lab.rebuild(); };
      if (nx) nx.onclick = () => { CX.step = (CX.step + 1) % L(); Chrono.lab.rebuild(); };
      if (cl) cl.onclick = () => { CX.path = null; CX.sel = null; Chrono.lab.rebuild(); };
    },
    pointer(type, x, y) {
      const h = hit(x, y);
      if (type === "pointermove") { const n = h && h.n ? h.n : null; if (n !== CX.hover) CX.hover = n; }
      if (type === "pointerdown") { CX.path = null; CX.sel = h; Chrono.lab.rebuild(); }
    },
    draw,
    aside: () => `${selHTML()}
      <p>Gravity, light, time, entropy, the expanding universe, black holes and the dark sector, on one page. Each arrow is <b>one claim</b>, tagged by how sure we are and linked to the lab that shows it.</p>
      <div class="try"><b>Try:</b> press <b>The arrow of time</b> and step through with ▶. Then <b>The gaps</b>. Then drag <b>Cosmic time</b> from the first seconds to 10¹⁰⁰ years and watch what the universe is made of — and where its entropy sits — change.</div>
      <p><b>What this isn't:</b> a single equation. Every arrow has its own tested physics, but no theory joins them all. Gravity and quantum theory still disagree about what time is. The amber dashes are where the map runs out: good places to start thinking.</p>
      <p class="meta">Model assumption: circle sizes for light, dark matter, ordinary matter and dark energy come from the Friedmann equation (flat universe, Planck 2018 values). Entropy values are rough: today's from Egan & Lineweaver (2010), for the volume that is today's observable universe; the far future is a projection. Arrows are claims, not a simulation.</p>`,
    wireAside() { document.querySelectorAll("#aside [data-cx-e]").forEach(b => b.onclick = () => { CX.path = null; CX.sel = { e: +b.dataset.cxE }; Chrono.lab.rebuild(); }); },
    sources: "Planck Collaboration, A&A 641, A6 (2020); C. A. Egan & C. H. Lineweaver, ApJ 710, 1825 (2010); and the sources of each linked lab."
  });
})();
