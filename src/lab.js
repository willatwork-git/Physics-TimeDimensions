/* Chronoscope — shared UI helpers and the lab harness (canvas labs + HTML doc pages). */
(function () {
  const $ = s => document.querySelector(s);
  const TAU = Math.PI * 2;
  const C = {
    bg: "#0b0d12", panel: "#12151d", line: "#232836", text: "#e6e8ee", muted: "#8a90a2",
    accent: "#7cc4ff", pink: "#e36bd0", violet: "#9b8cff", teal: "#4fd1a5", amber: "#f2c94c", orange: "#ff7a59", hyp: "#7cc4ff"
  };
  Chrono.C = C;

  /* ---------- shared UI ---------- */
  Chrono.expBanner = user => `<div class="exp-banner"><b>◌ Exploratory</b> — ${user ? "a visitor's hypothesis" : "this project's own thinking — deliberately challenging the mainstream"}. Not mainstream physics; shown to invite testing, not belief.</div>`;
  Chrono.tierPill = tier => ({
    mainstream: `<span class="tier tier-main">Mainstream</span>`,
    frontier: `<span class="tier tier-front">Frontier</span>`,
    exploratory: `<span class="tier tier-exp">◌ Exploratory</span>`,
    lens: `<span class="tier tier-lens">Lens</span>`
  }[tier] || "");
  Chrono.tierLegend = () => `
    <h3>How to read the tags <a class="h3link" href="#concepts/tags">more →</a></h3>
    <div class="legend">
      <div>${Chrono.tierPill("mainstream")} <span class="tag ESTABLISHED">Established</span> <span class="tag CONTESTED">Contested</span> <span class="tag RULEDOUT">Ruled out</span> ${Chrono.info ? Chrono.info("tier-mainstream") : ""}<br><span class="meta">What working physicists hold, actively debate — or have tested and rejected.</span></div>
      ${Chrono.shows("frontier") ? `<div>${Chrono.tierPill("frontier")} <span class="tag SPECULATIVE">Speculative</span> ${Chrono.info ? Chrono.info("tier-frontier") : ""}<br><span class="meta">Published proposals, not yet supported by evidence.</span></div>` : ""}
      ${Chrono.shows("exploratory") ? `<div>${Chrono.tierPill("exploratory")} <span class="tag HYPOTHESIS">Hypothesis</span> ${Chrono.info ? Chrono.info("tier-exploratory") : ""}<br><span class="meta">This project's own ideas and visitors' hypotheses (Lab mode). Dashed outlines. Not mainstream physics.</span></div>` : ""}
      <div>${Chrono.tierPill("lens")} <span class="tag ANALOGY">Analogy</span> ${Chrono.info ? Chrono.info("tier-lens") : ""}<br><span class="meta">Stories, history and analogies that help thinking.</span></div>
    </div>`;

  /* ---------- drawing helpers ---------- */
  let ctx = null;
  const G = Chrono.G = {
    TAU, C,
    shade(hex, k) { const n = parseInt(hex.slice(1), 16); return `rgb(${Math.round(((n >> 16) & 255) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`; },
    alpha(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; },
    label(txt, x, y, color = C.muted, size = 11, align = "left", font = "JetBrains Mono, monospace") { ctx.fillStyle = color; ctx.font = `${size}px ${font}`; ctx.textAlign = align; ctx.fillText(txt, x, y); },
    text(txt, x, y, color = C.text, size = 13, align = "left") { G.label(txt, x, y, color, size, align, "Inter, system-ui, sans-serif"); },
    panel(x, y, w, h, title) { ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1); if (title) G.label(title.toUpperCase(), x + 12, y + 20, C.muted, 10); },
    line(x1, y1, x2, y2, color = C.line, w = 1) { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineWidth = 1; },
    dot(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); },
    ring(x, y, r, color, w = 1, dash) { ctx.strokeStyle = color; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; },
    bar(x, y, w, h, frac, color, bg = "#171b25") { ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, Math.min(1, frac)), h); },
    /* Wrapped text for narrow panels; returns the height used. */
    wrap(txt, x, y, maxW, lh = 15, color = C.muted, size = 11, font = "Inter, system-ui, sans-serif") {
      ctx.font = `${size}px ${font}`; let line = "", n = 0;
      txt.split(" ").forEach(w => { const t = line ? line + " " + w : w; if (line && ctx.measureText(t).width > maxW) { G.label(line, x, y + n * lh, color, size, "left", font); n++; line = w; } else line = t; });
      if (line) { G.label(line, x, y + n * lh, color, size, "left", font); n++; }
      return n * lh;
    },
    /* Two panes: side by side when wide, stacked (A on top) when tall — every two-pane lab uses this (D-029). */
    split(frac) {
      const pad = 16, W = G.W, H = G.H;
      if (H <= W * 1.05) { const aw = Math.floor((W - pad * 3) * frac); return { stacked: false, A: { x: pad, y: pad, w: aw, h: H - pad * 2 }, B: { x: pad * 2 + aw, y: pad, w: W - pad * 3 - aw, h: H - pad * 2 } }; }
      const ah = Math.floor((H - pad * 3) * Math.max(frac, 0.55));
      return { stacked: true, A: { x: pad, y: pad, w: W - pad * 2, h: ah }, B: { x: pad, y: pad * 2 + ah, w: W - pad * 2, h: H - pad * 3 - ah } };
    }
  };

  /* ---------- reduced motion ----------
     With prefers-reduced-motion, a sim stays still when opened and runs once the visitor interacts
     with it (DESIGN.md → Motion). Each view resets the gate when shown. */
  let engaged = false;
  ["pointerdown", "keydown", "input"].forEach(t => $("#stage").addEventListener(t, () => engaged = true, true));
  Chrono.motion = {
    reset() { engaged = false; },
    dt(dt) { return !engaged && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : dt; }
  };

  /* ---------- lab harness ---------- */
  const labs = {};
  let active = null, raf = 0, last = 0, W = 0, H = 0, canvas = null;
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = Math.max(300, r.width); H = Math.max(300, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(ts) {
    if (!active) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (active.tick && lockState(active) === "free") active.tick(Chrono.motion.dt(dt));   // paused on the question's setup until the guess is run
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    G.ctx = ctx; G.W = W; G.H = H;
    active.draw(G);
    raf = requestAnimationFrame(frame);
  }
  function pos(e) { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function initCanvas() {
    canvas = $("#lab-canvas"); ctx = canvas.getContext("2d"); G.ctx = ctx;
    window.addEventListener("resize", () => active && resize());
    if (window.ResizeObserver) new ResizeObserver(() => active && resize()).observe(canvas.parentElement);   // layout settling after show (phones)
    ["pointerdown", "pointermove", "pointerup"].forEach(type => canvas.addEventListener(type, e => {
      if (active && active.pointer) { const [x, y] = pos(e); active.pointer(type, x, y, e); }
    }));
  }
  Chrono.lab = {
    rebuild() { if (active) { $("#lab-controls").innerHTML = active.controls ? active.controls() : ""; if (active.wire) active.wire(); renderLabAside(active); } },
    register(def) {
      labs[def.id] = def;
      Chrono.views = Chrono.views || {};
      Chrono.views[def.id] = def.kind === "doc" ? {
        show() { $("#doc").style.display = "block"; $("#doc").innerHTML = def.page(); if (def.wire) def.wire(); renderLabAside(def); },
        hide() { }
      } : {
        show() {
          if (!canvas) initCanvas();
          $("#lab").style.display = "flex"; active = def; resize(); Chrono.motion.reset();
          if (def.enter) def.enter(G);
          if (lockState(def) !== "free" && def.predict.setup) def.predict.setup();
          Chrono.lab.rebuild();
          if (lockState(def) !== "free" && def.predict.setup) def.predict.setup();   // some setups press a control, so run again once controls exist
          cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame);
        },
        hide() { if (active === def) { active = null; cancelAnimationFrame(raf); } applyLock(null); }
      };
    },
    size: () => [W, H]
  };
  /* Predict first: the visitor commits to a guess before anything can give the answer away (D-042, UX spec P0).
     def.predict = { q, options: [...], answer: index, explain, setup? }. States:
       locked  — no guess yet: sim paused on the question's setup, blurred (so no readout gives it away), controls off
       guessed — guess made: still locked; "Run it" unlocks
       free    — ran it, skipped ("Just show me"), or no prediction: normal sandbox.
     setup() puts the lab in the exact state the question describes (e.g. Clock Lab at 0.87 c).
     On phones the card sits above the sim, not below it. */
  const NARROW = "(max-width: 900px) and (orientation: portrait), (max-width: 600px)";
  function lockState(def) {
    if (!def || !def.predict) return "free";
    const g = Chrono.progress.pred(def.id);
    return g.guess === undefined ? "locked" : g.guess >= 0 && !g.checked ? "guessed" : "free";
  }
  function applyLock(def) {
    const st = lockState(def), on = def && st !== "free", wrap = $("#lab-canvas-wrap"), veil = $("#lab-veil");
    if (wrap) wrap.classList.toggle("locked", on);
    const ctl = $("#lab-controls"); if (ctl) { ctl.classList.toggle("locked", on); ctl.inert = on; }
    if (veil) veil.innerHTML = !on ? "" : st === "locked"
      ? `<div class="veil-msg"><b>Make your guess first</b><span>The answer is in here — it opens when you've guessed.</span></div>`
      : `<div class="veil-msg"><button class="btn primary big" data-pcheck>▶ Run it</button><span>See if you were right.</span></div>`;
  }
  /* Shared with Flatland: Chrono.predictCard(key, p) renders the card; Chrono.wirePredict(key, rerender) wires it. */
  function predictCard(def) { return Chrono.predictCard(def.id, def.predict, "▶ Run it"); }
  Chrono.predictCard = function (key, p, run) {
    const g = Chrono.progress.pred(key);
    if (g.guess === undefined) return `<div class="predict"><div class="eyebrow">Predict first</div><p>${p.q}</p>
      <div class="popts">${p.options.map((o, i) => `<button class="btn" data-guess="${i}">${o}</button>`).join("")}</div>
      <button class="linkish" data-guess="-1">Just show me</button></div>`;
    if (g.guess < 0) return "";
    const right = g.guess === p.answer;
    return `<div class="predict">${!g.checked
      ? `<div class="eyebrow">Your guess</div><p><b>${p.options[g.guess]}</b></p>${run ? "" : `<p class="meta">Now try it, then check.</p>`}<button class="btn primary" data-pcheck>${run || "Check my prediction"}</button>`
      : `<div class="eyebrow">${right ? "✓ You predicted it" : "Not quite — and that's the useful kind of wrong"}</div><p class="meta">You said: ${p.options[g.guess]}${right ? "" : ` · Answer: <b>${p.options[p.answer]}</b>`}</p><p>${p.explain}</p><button class="linkish" data-pagain>Ask me again</button>`}</div>`;
  }
  Chrono.wirePredict = function (key, rerender) {
    const W = "#aside, #lab-predict, #lab-veil", q = s => document.querySelectorAll(W.split(", ").map(w => `${w} ${s}`).join(", "));
    q("[data-guess]").forEach(b => b.onclick = () => { Chrono.progress.setPred(key, { guess: +b.dataset.guess }); rerender(); });
    q("[data-pcheck]").forEach(b => b.onclick = () => { Chrono.progress.setPred(key, Object.assign(Chrono.progress.pred(key), { checked: true })); rerender(); });
    q("[data-pagain]").forEach(b => b.onclick = () => { Chrono.progress.setPred(key, {}); rerender(); });
  };
  function renderLabAside(def) {
    const tier = def.tier || "mainstream", st = lockState(def), waiting = st !== "free";
    if (st !== "free" && def.lastLock === "free" && def.predict.setup) def.predict.setup();   // "Ask me again": back to the question's setup
    def.lastLock = st;
    const above = waiting && def.kind !== "doc" && window.matchMedia(NARROW).matches;   // phones: the card goes above the sim
    const lp = $("#lab-predict"); if (lp) lp.innerHTML = above ? predictCard(def) : "";
    $("#aside").innerHTML = `${Chrono.crumb ? Chrono.crumb() : ""}
      <div class="eyebrow">${def.eyebrow || "Lab"}</div>
      <h2>${def.title}</h2>
      <div class="pillrow">${Chrono.tierPill(tier)} ${(def.tags || []).map(t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`).join(" ")}</div>
      ${tier === "exploratory" ? Chrono.expBanner() : ""}
      ${Chrono.introFor ? Chrono.introFor(def.id) : ""}
      ${def.predict && !above ? predictCard(def) : ""}
      ${waiting && Chrono.guideFor ? Chrono.guideFor(def.id) : ""}
      ${waiting ? "" : typeof def.aside === "function" ? def.aside() : (def.aside || "")}
      ${!waiting && Chrono.guideFor ? Chrono.guideFor(def.id) : ""}
      ${waiting || !Chrono.rememberFor ? "" : Chrono.rememberFor(def.id)}
      ${waiting || !Chrono.stickFor ? "" : Chrono.stickFor(def.id)}
      ${waiting || !Chrono.keyIdeas ? "" : Chrono.keyIdeas(def.id)}
      ${waiting || !Chrono.threadsFor ? "" : Chrono.threadsFor(def.id)}
      ${def.next ? `<a class="nextq" href="${def.next.href}"><span class="eyebrow">Next question</span><span class="nq">${def.next.q}</span><span class="hgo">${def.next.label} →</span></a>` : ""}
      ${def.sources ? `<p class="caveat">Sources: ${def.sources}</p>` : ""}`;
    document.querySelectorAll("#aside [data-hole]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goHole(a.dataset.hole); });
    document.querySelectorAll("#aside [data-view-link]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goView(a.dataset.viewLink); });
    if (def.kind !== "doc") applyLock(def);
    Chrono.wirePredict(def.id, () => renderLabAside(def));
    if (def.wireAside) def.wireAside();
  }
})();
