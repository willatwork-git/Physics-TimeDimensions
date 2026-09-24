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
  Chrono.expBanner = user => `<div class="exp-banner"><b>◌ Exploratory</b> — ${user ? "a visitor's hypothesis" : "Will &amp; Claude's own thinking"}. Not mainstream physics; shown to invite testing, not belief.</div>`;
  Chrono.tierPill = tier => ({
    mainstream: `<span class="tier tier-main">Mainstream</span>`,
    frontier: `<span class="tier tier-front">Frontier</span>`,
    exploratory: `<span class="tier tier-exp">◌ Exploratory</span>`,
    lens: `<span class="tier tier-lens">Lens</span>`
  }[tier] || "");
  Chrono.tierLegend = () => `
    <h3>How to read the tags</h3>
    <div class="legend">
      <div>${Chrono.tierPill("mainstream")} <span class="tag ESTABLISHED">Established</span> <span class="tag CONTESTED">Contested</span><br><span class="meta">What working physicists hold, or actively debate.</span></div>
      ${Chrono.shows("frontier") ? `<div>${Chrono.tierPill("frontier")} <span class="tag SPECULATIVE">Speculative</span><br><span class="meta">Published proposals, not yet supported by evidence.</span></div>` : ""}
      ${Chrono.shows("exploratory") ? `<div>${Chrono.tierPill("exploratory")} <span class="tag HYPOTHESIS">Hypothesis</span><br><span class="meta">Will &amp; Claude's ideas and visitors' hypotheses. Dashed outlines. Not mainstream physics.</span></div>` : ""}
      <div>${Chrono.tierPill("lens")} <span class="tag ANALOGY">Analogy</span><br><span class="meta">Stories, history and analogies that help thinking.</span></div>
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
    bar(x, y, w, h, frac, color, bg = "#171b25") { ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, Math.min(1, frac)), h); }
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
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active.tick) active.tick(reduce ? 0 : dt);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    G.ctx = ctx; G.W = W; G.H = H;
    active.draw(G);
    raf = requestAnimationFrame(frame);
  }
  function pos(e) { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function initCanvas() {
    canvas = $("#lab-canvas"); ctx = canvas.getContext("2d"); G.ctx = ctx;
    window.addEventListener("resize", () => active && resize());
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
          $("#lab").style.display = "flex"; active = def; resize();
          if (def.enter) def.enter(G);
          Chrono.lab.rebuild();
          cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame);
        },
        hide() { if (active === def) { active = null; cancelAnimationFrame(raf); } }
      };
    },
    size: () => [W, H]
  };
  function renderLabAside(def) {
    const tier = def.tier || "mainstream";
    $("#aside").innerHTML = `
      <div class="eyebrow">${def.eyebrow || "Lab"}</div>
      <h2>${def.title}</h2>
      <div class="pillrow">${Chrono.tierPill(tier)} ${(def.tags || []).map(t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`).join(" ")}</div>
      ${tier === "exploratory" ? Chrono.expBanner() : ""}
      ${typeof def.aside === "function" ? def.aside() : (def.aside || "")}
      ${def.sources ? `<p class="caveat">Sources: ${def.sources}</p>` : ""}`;
    document.querySelectorAll("#aside [data-hole]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goHole(a.dataset.hole); });
    document.querySelectorAll("#aside [data-view-link]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goView(a.dataset.viewLink); });
    if (def.wireAside) def.wireAside();
  }
})();
