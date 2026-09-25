/* Chronoscope — How it all fits together (D-041): the big picture as a comic strip. Replaces the systems map (D-040).
   The cast in three groups: Things (stuff that is), Doers (stuff that does) and the Rules every panel obeys —
   time only runs forward, entropy only rises — drawn as two gauges on each panel. Eight panels, each one
   cause → effect, with a tag and a link to the lab that shows it, then an epilogue of what we don't know.
   The illustrations are simplified pictures, not simulations (tagged ANALOGY); the claims in the captions are tagged as usual. */
(function () {
  const TAU = Math.PI * 2;
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;

  /* ---------- the cast: small inline icons ---------- */
  const I = {
    gas: `<svg viewBox="0 0 24 24"><g fill="#8fd3ff">${[[6, 8], [12, 5], [17, 9], [8, 15], [14, 13], [19, 17], [11, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join("")}</g></svg>`,
    dark: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#8a90a2" stroke-width="2" stroke-dasharray="3 3"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#ffd35a"/><g stroke="#ffd35a" stroke-width="2" stroke-linecap="round"><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/></g></svg>`,
    planet: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="#3f7fd0"/><path d="M8 9c3 1 4 4 3 7M14 7c2 2 3 3 3 6" stroke="#6fbf73" stroke-width="2" fill="none"/></svg>`,
    hole: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#ff9a59" stroke-width="2"/><circle cx="12" cy="12" r="5.5" fill="#000" stroke="#e6e8ee" stroke-width="1.2"/></svg>`,
    light: `<svg viewBox="0 0 24 24"><path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0" fill="none" stroke="#ffd35a" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    gravity: `<svg viewBox="0 0 24 24"><g stroke="#7cc4ff" stroke-width="2" stroke-linecap="round" fill="none"><path d="M3 3l6 6M21 3l-6 6M3 21l6-6M21 21l-6-6"/><path d="M9 6v3H6M15 6v3h3M9 18v-3H6M15 18v-3h3"/></g><circle cx="12" cy="12" r="2.5" fill="#7cc4ff"/></svg>`,
    fusion: `<svg viewBox="0 0 24 24"><path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="#ff7a59"/></svg>`,
    radiation: `<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="3" fill="#ffd35a"/><g fill="none" stroke="#ffd35a" stroke-width="2" stroke-linecap="round"><path d="M11 7c2 3 2 7 0 10"/><path d="M15 5c3 4 3 10 0 14"/><path d="M19 3c4 5 4 13 0 18"/></g></svg>`,
    darkenergy: `<svg viewBox="0 0 24 24"><g stroke="#c9a0ff" stroke-width="2" stroke-linecap="round" fill="none"><path d="M12 12L3 12M12 12l9 0M12 12L12 3M12 12l0 9"/><path d="M6 9l-3 3 3 3M18 9l3 3-3 3M9 6l3-3 3 3M9 18l3 3 3-3"/></g></svg>`,
    clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#e36bd0" stroke-width="2"/><path d="M12 7v5l4 2" stroke="#e36bd0" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    meter: `<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="3" fill="none" stroke="#4fd1a5" stroke-width="2"/><rect x="4.5" y="10.5" width="11" height="3" rx="1.5" fill="#4fd1a5"/><path d="M18 5l2-2 2 2M20 3v4" stroke="#4fd1a5" stroke-width="1.6" fill="none"/></svg>`
  };
  const CAST = [
    ["Things", "stuff that is", [["gas", "Gas"], ["dark", "Dark matter"], ["star", "Stars"], ["planet", "Planets"], ["hole", "Black holes"], ["light", "Light"]]],
    ["Doers", "stuff that does", [["gravity", "Gravity: pulls"], ["fusion", "Fusion: lights stars"], ["radiation", "Radiation: carries energy away"], ["darkenergy", "Dark energy: stretches space"]]],
    ["The rules", "every panel obeys them", [["clock", "Time only runs forward"], ["meter", "Entropy only rises"]]]
  ];

  /* ---------- drawing helpers ---------- */
  function rng(seed) { return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
  const dot = (c, x, y, r, col) => { if (!(r > 0)) return; c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const glow = (c, x, y, r, col, blur) => { c.shadowColor = col; c.shadowBlur = blur; dot(c, x, y, r, col); c.shadowBlur = 0; };
  const R1 = rng(11), P1 = Array.from({ length: 110 }, () => ({ u: R1(), v: R1(), dm: R1() < 0.35, k: Math.floor(R1() * 3), o: R1() * TAU, q: R1() }));
  const R2 = rng(29), SPARK = Array.from({ length: 70 }, () => ({ a: R2() * TAU, f: R2(), s: 0.6 + R2() * 0.8 }));
  const ELEM = ["#ff7a59", "#ffd35a", "#4fd1a5", "#7cc4ff", "#c9a0ff", "#e36bd0", "#e6e8ee"];

  /* each draw(c, w, h, t): t in seconds, looping */
  const DRAW = {
    gravity(c, w, h, t) {
      const L = 8, p = (t % L) / L, k = ease(clamp((p - 0.08) / 0.6)), fade = p > 0.9 ? 1 - (p - 0.9) / 0.1 : p < 0.05 ? p / 0.05 : 1;
      const C3 = [[0.25, 0.4], [0.62, 0.62], [0.8, 0.3]];
      c.globalAlpha = fade;
      P1.forEach(d => { const [cx, cy] = C3[d.k], kk = d.dm ? ease(clamp((p - 0.02) / 0.5)) : k, rr = (d.dm ? 0.13 : 0.07) * (0.4 + d.q);
        const x = (d.u + (cx + Math.cos(d.o) * rr - d.u) * kk * 0.9) * w, y = (d.v + (cy + Math.sin(d.o) * rr * 1.3 - d.v) * kk * 0.9) * h;
        dot(c, x, y, d.dm ? 3.2 : 1.8, d.dm ? "rgba(138,144,162,0.35)" : "#8fd3ff"); });
      if (k > 0.85) C3.forEach(([cx, cy]) => glow(c, cx * w, cy * h, 3 + 3 * (k - 0.85) / 0.15, "#ffd35a", 12));
      c.globalAlpha = 1;
    },
    ignite(c, w, h, t) {
      const L = 6, p = (t % L) / L, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42;
      if (p < 0.5) { const s = 1 - ease(p / 0.5) * 0.8; P1.slice(0, 80).forEach(d => dot(c, cx + Math.cos(d.o) * R * s * (0.3 + d.q * 0.7), cy + Math.sin(d.o) * R * s * (0.3 + d.q * 0.7), 1.8, "#8fd3ff")); }
      else { const q = (p - 0.5) / 0.5, r = R * 0.28 * (1 + 0.05 * Math.sin(t * 6)); c.globalAlpha = Math.min(1, q * 4);
        glow(c, cx, cy, r, "#ffb347", 40); dot(c, cx, cy, r * 0.45, "#fff3c4");
        c.strokeStyle = "rgba(255,211,90,0.6)"; c.lineWidth = 2; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * 0.3; c.beginPath(); c.moveTo(cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * 1.2); c.lineTo(cx + Math.cos(a) * r * 1.6, cy + Math.sin(a) * r * 1.6); c.stroke(); }
        c.globalAlpha = 1; }
    },
    shine(c, w, h, t) {
      const cx = w * 0.18, cy = h / 2, max = Math.hypot(w, h);
      SPARK.forEach(s => { const f = (t * 0.18 * s.s + s.f) % 1, r = 18 + f * max; dot(c, cx + Math.cos(s.a) * r, cy + Math.sin(s.a) * r, 1.6, `rgba(255,211,90,${(1 - f) * 0.9})`); });
      glow(c, cx, cy, 16, "#ffb347", 30); dot(c, cx, cy, 7, "#fff3c4");
    },
    planet(c, w, h, t) {
      const sx = -h * 0.2, ex = w * 0.66, ey = h / 2, er = Math.min(w, h) * 0.17;
      glow(c, sx, ey, h * 0.45, "#ffd35a", 30);
      for (let k = 0; k < 4; k++) { const f = (t * 0.35 + k / 4) % 1, x = h * 0.3 + (ex - er - h * 0.3) * f; dot(c, x, ey + (k - 1.5) * er * 0.4, 4, "#ffd35a"); }
      SPARK.forEach(s => { const f = (t * 0.22 * s.s + s.f) % 1, r = er + f * er * 2.6; dot(c, ex + Math.cos(s.a) * r, ey + Math.sin(s.a) * r, 1.3, `rgba(255,122,89,${(1 - f) * 0.9})`); });
      dot(c, ex, ey, er, "#2f6fbf"); c.fillStyle = "#6fbf73"; c.beginPath(); c.ellipse(ex - er * 0.2, ey - er * 0.1, er * 0.35, er * 0.5, 0.5, 0, TAU); c.fill();
      c.fillStyle = "rgba(0,0,0,0.4)"; c.beginPath(); c.arc(ex, ey, er, -Math.PI / 2, Math.PI / 2); c.fill();
    },
    die(c, w, h, t) {
      const L = 8, p = (t % L) / L, cx = w * 0.45, cy = h / 2, R = Math.min(w, h) * 0.2;
      if (p < 0.35) glow(c, cx, cy, R * (0.7 + p), "#ff5a3c", 25);
      else if (p < 0.42) glow(c, cx, cy, R * 2 * (1 - (p - 0.35) / 0.07 * 0.3), "#ffffff", 60);
      if (p >= 0.38) { const q = clamp((p - 0.38) / 0.45), rr = R + q * Math.max(w, h) * 0.55;
        SPARK.forEach((s, i) => dot(c, cx + Math.cos(s.a) * rr * (0.8 + s.f * 0.3), cy + Math.sin(s.a) * rr * (0.8 + s.f * 0.3) * 0.8, 2, ELEM[i % ELEM.length] + Math.round((1 - q * 0.7) * 255).toString(16).padStart(2, "0"))); }
      if (p > 0.75) { const q = clamp((p - 0.75) / 0.2); c.globalAlpha = q; glow(c, w * 0.8, h * 0.35, 7, "#ffd35a", 18); dot(c, w * 0.8 + 18, h * 0.35 + 10, 3, "#3f7fd0"); c.globalAlpha = 1; }
      dot(c, cx, cy, 2.5, p >= 0.42 ? "#e6e8ee" : "rgba(0,0,0,0)");
    },
    hole(c, w, h, t) {
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.45;
      SPARK.forEach(s => { const f = (t * 0.1 * s.s + s.f) % 1, r = R * (1 - f) + 10, a = s.a + t * 0.6 * s.s + f * 6;
        dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.45, 1.8, `rgba(255,154,89,${0.3 + f * 0.7})`); });
      c.strokeStyle = "rgba(255,154,89,0.7)"; c.lineWidth = 3; c.beginPath(); c.ellipse(cx, cy, 34, 11, 0, 0, TAU); c.stroke();
      dot(c, cx, cy, 16, "#000"); c.strokeStyle = "#e6e8ee"; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, 16, 0, TAU); c.stroke();
    },
    stretch(c, w, h, t) {
      const L = 7, p = (t % L) / L, s = 0.55 + ease(p) * 0.9, fade = p > 0.9 ? (1 - p) / 0.1 : p < 0.06 ? p / 0.06 : 1, cx = w / 2, cy = h / 2;
      c.globalAlpha = fade;
      const G = []; for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) G.push([cx + i * w * 0.2 * s, cy + j * h * 0.32 * s]);
      G.forEach(([x, y]) => { c.fillStyle = "rgba(201,160,255,0.85)"; c.beginPath(); c.ellipse(x, y, 7, 3.5, 0.6, 0, TAU); c.fill(); dot(c, x, y, 2, "#fff"); });
      const [ax, ay] = G[4], [bx, by] = G[10], lam = 10 * s, red = Math.round(clamp((s - 0.55) / 0.9) * 255);
      c.strokeStyle = `rgb(${120 + red * 0.53 | 0},${200 - red * 0.5 | 0},${255 - red * 0.8 | 0})`; c.lineWidth = 2; c.beginPath();
      for (let x = ax + 10; x < bx - 10; x += 2) { const y = ay + Math.sin((x - ax) / lam * TAU) * 5; x === ax + 10 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
      c.globalAlpha = 1;
    },
    wait(c, w, h, t) {
      const L = 9, p = (t % L) / L, cx = w / 2, cy = h / 2;
      const R3 = rng(5); for (let i = 0; i < 40; i++) { const x = R3() * w, y = R3() * h; dot(c, x, y, 1.2, `rgba(255,243,196,${clamp(1 - p * 3) * 0.8})`); }
      const r = 18 * Math.cbrt(clamp(1 - p / 0.85));
      if (r > 0.5) { dot(c, cx, cy, r, "#000"); c.strokeStyle = "rgba(230,232,238,0.8)"; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); }
      else if (p < 0.88) glow(c, cx, cy, 6, "#ffffff", 30);
      SPARK.forEach(s => { const f = (t * 0.05 * s.s + s.f) % 1, rr = 20 + f * Math.max(w, h) * 0.6; dot(c, cx + Math.cos(s.a) * rr, cy + Math.sin(s.a) * rr, 1, `rgba(79,209,165,${(1 - f) * 0.5 * clamp(p * 3)})`); });
    }
  };

  /* ---------- the story ---------- */
  const PANELS = [
    { d: "gravity", t: "Gravity pulls", doer: ["gravity"], on: ["gas", "dark"], tags: ["ESTABLISHED"],
      c: "After the Big Bang, gas and dark matter were spread almost perfectly evenly. Gravity pulls them into clumps, with dark matter as the scaffolding. With gravity, clumping is the likely direction.", go: [["#janus", "The Janus point"]] },
    { d: "ignite", t: "A star lights up", doer: ["gravity", "fusion"], on: ["star"], tags: ["ESTABLISHED"],
      c: "Squeeze a clump hard enough and its core gets hot enough to ignite. Fusion turns a little of the star's mass into energy and builds heavier elements from lighter ones.", go: [["#timeline", "Cosmic timeline"]] },
    { d: "shine", t: "Light carries it away", doer: ["radiation"], on: ["light"], tags: ["ESTABLISHED"],
      c: "The energy leaves as light. Each fusion reaction in a star like the Sun ends up as about 20 million photons of sunlight, streaming into space. They never come back.", go: [["#entropy", "Entropy box"]] },
    { d: "planet", t: "A planet catches some", doer: ["radiation"], on: ["planet"], tags: ["ESTABLISHED"],
      c: "Earth catches a little sunlight and sends the same energy back out as about twenty times as many infrared photons. Weather, plants and people all run on that difference.", go: [["#energy", "Earth's energy budget"]] },
    { d: "die", t: "Big stars die", doer: ["gravity"], on: ["star", "gas"], tags: ["ESTABLISHED"],
      c: "Big stars burn fast and die young: they collapse and explode, scattering the elements they made. New stars and planets form from that dust. The iron in your blood was made inside stars that died before the Sun was born.", go: [["#timeline", "Cosmic timeline"]] },
    { d: "hole", t: "Some collapse completely", doer: ["gravity"], on: ["hole"], tags: ["ESTABLISHED"],
      c: "The biggest collapse all the way into black holes. They swallow whatever comes too close, and now hold far more entropy than everything else in the universe combined.", go: [["#river", "The River"], ["#hawking", "Black holes evaporate"]] },
    { d: "stretch", t: "Meanwhile, space stretches", doer: ["darkenergy"], on: ["light"], tags: ["ESTABLISHED", "CONTESTED"],
      c: "All the while, dark energy stretches space. Galaxy groups drift apart, light stretches redder on its way, and faraway clocks appear to run slow. What dark energy is, nobody knows.", go: [["#expand", "Expanding universe"], ["#horizons", "Cosmic horizons"]] },
    { d: "wait", t: "The long wait", doer: ["radiation"], on: ["hole", "light"], tags: ["ESTABLISHED"],
      c: "The stars go out. Over up to 10¹⁰⁰ years even black holes evaporate back into faint light. Everything ends spread impossibly thin, and the clock has only ever run one way. (Physics we trust, projected far ahead.)", go: [["#hawking", "Black holes evaporate"], ["#timeline", "Cosmic timeline"]] }
  ];
  const METER = [4, 10, 28, 40, 52, 82, 86, 100];            // entropy gauge per panel: schematic, not to scale

  const chip = k => { const f = CAST.flatMap(g => g[2]).find(x => x[0] === k); return `<span class="stchip">${I[k]}${f ? f[1].split(":")[0] : k}</span>`; };
  function page() {
    const lab = Chrono.shows("exploratory");
    return `<div class="docwrap story">
      <div class="eyebrow">Guide · the big picture</div>
      <h1>How it all fits together</h1>
      <p class="lede">The labs each show one piece. Here is the whole story in eight panels: what acts on what, and what happens next. Every panel obeys the same two rules.</p>
      <div class="stcast">${CAST.map(([n, sub, items], gi) => `<div class="stgroup g${gi}"><div class="eyebrow">${n} <span>· ${sub}</span></div>
        <div class="stitems">${items.map(([k, label]) => `<span class="stitem">${I[k]}<span>${label}</span></span>`).join("")}</div></div>`).join("")}</div>
      <div class="stgrid">${PANELS.map((p, i) => `<figure class="stpanel">
        <div class="sthead"><span class="stnum">${i + 1}</span><b>${p.t}</b>
          <span class="stgauges" title="Time only runs forward; entropy only rises (schematic)"><span class="stclock" style="--a:${30 + i * 40}deg"></span><span class="stmeter"><i style="width:${METER[i]}%"></i></span></span></div>
        <canvas data-st="${i}" aria-label="${p.t}: illustration"></canvas>
        <div class="stwho">${p.doer.map(chip).join("")}<span class="starrow">acts on</span>${p.on.map(chip).join("")}</div>
        <figcaption>${p.c}</figcaption>
        <div class="stfoot">${p.tags.map(TG).join(" ")} ${p.go.map(([h, n]) => `<a href="${h}">${n} →</a>`).join(" ")}</div>
      </figure>`).join("")}
      <figure class="stpanel stepi">
        <div class="sthead"><span class="stnum">?</span><b>What we don't know</b></div>
        <ul class="stq">
          <li><b>What is dark matter?</b> Its pull built every galaxy; no particle has been found. ${TG("CONTESTED")}</li>
          <li><b>What is dark energy, and is it changing?</b> <a href="#expand">Expanding universe →</a> ${TG("CONTESTED")}</li>
          <li><b>Why did it all start so smooth?</b> The entropy gauge had to start low. Why it did is an open hole. <a href="#atlas/H3">Hole H3 →</a></li>
          <li><b>How do gravity and quantum theory fit together?</b> They disagree about what time is. <a href="#atlas/H1">Hole H1 →</a></li>
          ${lab ? `<li class="sthyp"><b>Is it a cycle?</b> Penrose's conformal cyclic cosmology says the far-future universe becomes the next Big Bang; the black-hole cycle says black holes are the recycling stage. <a href="#atlas/wc-bhcycle">The black-hole cycle →</a> ${TG("HYPOTHESIS")}</li>` : ""}
        </ul>
      </figure></div>
      <p class="meta">The illustrations are simplified pictures, not simulations ${TG("ANALOGY")}; the gauges are schematic. The captions' claims are tagged as everywhere else, and each links to a lab that runs the real equations.</p>
    </div>`;
  }

  /* one animation loop for every panel; it stops itself when the page is left */
  let raf = 0;
  function run() {
    cancelAnimationFrame(raf);
    const cvs = [...document.querySelectorAll("canvas[data-st]")], still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, t0 = performance.now();
    const frame = now => {
      if (!cvs.length || !document.body.contains(cvs[0])) return;
      const t = still ? 5.2 : Math.max(0, now - t0) / 1000, dpr = window.devicePixelRatio || 1;
      cvs.forEach(cv => { const w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        const c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#0c0f16"; c.fillRect(0, 0, w, h);
        DRAW[PANELS[+cv.dataset.st].d](c, w, h, t); });
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  Chrono.lab.register({
    id: "story", kind: "doc", title: "How it all fits together", eyebrow: "Guide · the big picture", tier: "none",
    page, wire: run,
    aside: () => `<p><b>The cast</b> comes in three groups: <b>things</b> (gas, stars, planets, black holes, light), <b>doers</b> (gravity, fusion, radiation, dark energy), and <b>the rules</b> every panel obeys. The rules are the two gauges on each panel: a clock that only moves forward, and an entropy meter that only rises.</p>
      <div class="try"><b>Try:</b> read the panels in order and watch the gauges. Then follow any panel's link into the lab that runs the real equations.</div>
      <p class="meta">The story is the standard picture of physics today ${TG("ESTABLISHED")}, except where a panel says otherwise. The last panel lists what nobody knows yet.</p>`
  });
})();
