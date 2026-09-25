/* Chronoscope — shared UI helpers and the lab harness (canvas labs + HTML doc pages). */
(function () {
  const $ = s => document.querySelector(s);
  const TAU = Math.PI * 2;
  const C = {
    bg: "#151924", panel: "#12151d", line: "#232836", text: "#e6e8ee", muted: "#8a90a2",
    accent: "#7cc4ff", pink: "#e36bd0", violet: "#9b8cff", teal: "#4fd1a5", amber: "#f2c94c", orange: "#ff7a59", hyp: "#7cc4ff"
  };
  Chrono.C = C;
  /* Panel titles in capitals — but physics symbols keep their case: a unit after a number ("0.87 c") and a variable
     before "=" ("t = 2", "m = 0.18") stay lowercase, and Greek is never touched (capital gamma Γ is a different symbol). */
  Chrono.capsTitle = t => String(t).replace(/(\d )([a-z])\b/g, "$1\u0001$2").replace(/\b([a-z])( ?=)/g, "\u0001$1$2")
    .replace(/\u0001(.)|[a-z]/g, (m, keep) => keep !== undefined ? keep : m.toUpperCase());

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
      ${Chrono.shows("exploratory") ? `<div>${Chrono.tierPill("exploratory")} <span class="tag HYPOTHESIS">Hypothesis</span> ${Chrono.info ? Chrono.info("tier-exploratory") : ""}<br><span class="meta">This project's own ideas and visitors' hypotheses (Workbench mode). Dashed outlines. Not mainstream physics.</span></div>` : ""}
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
    panel(x, y, w, h, title) { ctx.fillStyle = "rgba(255,255,255,0.025)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 10) : ctx.rect(x, y, w, h); ctx.fill();   // a surface, not a border (3b)
      if (title) G.label(Chrono.capsTitle(title), x + 12, y + 20, C.muted, 10); },
    line(x1, y1, x2, y2, color = C.line, w = 1) { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineWidth = 1; },
    dot(x, y, r, color) { if (!(r > 0)) return; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); },
    ring(x, y, r, color, w = 1, dash) { if (!(r > 0)) return; ctx.strokeStyle = color; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; },
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
  /* Readout bar (UX spec 3b): up to three big labelled numbers under the canvas, from def.readouts() → [[label, value], …].
     Hidden until the lab is free, so a number can't give away the prediction. Refreshed ~10× a second, written only on change. */
  let roT = 0, roHTML = "";
  function readouts() {
    const el = $("#lab-readouts"); if (!el) return;
    const r = active && active.readouts && lockState(active) === "free" ? active.readouts() : null;
    const html = r ? r.slice(0, 3).map(([k, v]) => `<div class="ro"><b>${v}</b><span>${k}</span></div>`).join("") : "";
    if (html !== roHTML) { roHTML = html; el.innerHTML = html; el.hidden = !html; }
  }
  /* Control hints (UX 3c): each control is matched by name to its row in guides.js. Sliders get the row's first sentence
     as a grey line underneath — in Learn mode, until that slider is first moved (remembered in this browser). Every
     matched control also gets the full row as its tooltip. Workbench mode keeps the toolbar compact. */
  Chrono.controlHints = (def, box) => controlHints(def, box);
  const HINT_KEY = "chronoscope.hintsUsed.v1";
  const hintsUsed = () => { try { return JSON.parse(localStorage.getItem(HINT_KEY)) || {}; } catch (e) { return {}; } };
  function controlHints(def, box = "#lab-controls") {
    const rows = Chrono.guideRows ? Chrono.guideRows(def.id) : []; if (!rows.length) return;
    const norm = t => String(t).toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    const parts = k => String(k).split(/,|\/| or /).map(norm).filter(q => q.length >= 3);   // "Matter, Dark energy" names two controls
    const find = t => { const n = norm(t).slice(0, 14); return n.length < 3 ? null : rows.find(([k]) => k && parts(k).some(q => q.startsWith(n) || n.startsWith(q.slice(0, 14)))); };
    const learn = !Chrono.mode || Chrono.mode() !== "lab", used = hintsUsed(), shown = new Set();
    document.querySelectorAll(`${box} label.ctl`).forEach(lb => {
      const input = lb.querySelector('input[type="range"]'); if (!input) return;
      const row = find([...lb.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(" ")); if (!row) return;
      lb.title = row[1]; const key = def.id + ":" + row[0];
      if (!learn || used[key] || lb.querySelector(".hint") || shown.has(row)) return;   // a row naming two sliders hints once
      shown.add(row);
      const h = document.createElement("small"); h.className = "hint"; h.textContent = row[1].split(/(?<=\.)\s/)[0]; lb.appendChild(h); lb.classList.add("has-hint");
      input.addEventListener("input", () => { const u = hintsUsed(); u[key] = 1; try { localStorage.setItem(HINT_KEY, JSON.stringify(u)); } catch (e) { } h.remove(); lb.classList.remove("has-hint"); }, { once: true });
    });
    document.querySelectorAll(`${box} .btn:not([data-ctlhelp])`).forEach(b => { if (b.title) return; const row = find(b.textContent); if (row) b.title = row[1]; });
  }
  function frame(ts) {
    if (!active) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (active.tick && lockState(active) === "free") active.tick(Chrono.motion.dt(dt));   // paused on the question's setup until the guess is run
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    G.ctx = ctx; G.W = W; G.H = H;
    active.draw(G);
    if (Chrono.missions && lockState(active) === "free") Chrono.missions.tick(active, dt);
    if (ts - roT > 100) { roT = ts; readouts(); }
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
    rebuild() {
      if (!active) return;
      const help = Chrono.guideFor ? Chrono.guideFor(active.id) : "", pop = $("#ctl-pop");
      $("#lab-controls").innerHTML = (active.controls ? active.controls() : "") + (help ? `<button class="btn ctlhelp" data-ctlhelp aria-expanded="false" title="What each control does">ⓘ What the controls do</button>` : "");
      if (pop) { pop.hidden = true; pop.innerHTML = help; }
      const b = $("#lab-controls [data-ctlhelp]"); if (b && pop) b.onclick = () => { pop.hidden = !pop.hidden; b.setAttribute("aria-expanded", !pop.hidden); };
      if (active.wire) active.wire(); renderLabAside(active); readouts(); controlHints(active);
    },
    register(def) {
      labs[def.id] = def;
      Chrono.views = Chrono.views || {};
      Chrono.views[def.id] = def.kind === "doc" ? {
        show() { document.body.dataset.scale = ""; $("#doc").style.display = "block"; $("#doc").innerHTML = def.page(); if (def.wire) def.wire(); renderLabAside(def); },
        hide() { }
      } : {
        show() {
          if (!canvas) initCanvas();
          document.body.dataset.scale = Chrono.scaleOf ? Chrono.scaleOf(def.id) : ""; $("#lab").style.display = "flex"; active = def; resize(); Chrono.motion.reset();
          if (def.enter) def.enter(G);
          const fresh = lockState(def) !== "free" || !!framing(def).st;   // a tour stop always starts from its setup
          if (fresh) setUp(def);
          Chrono.lab.rebuild();
          if (fresh) setUp(def);                                         // some setups press a control, so run again once controls exist
          cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame);
        },
        hide() { if (active === def) { active = null; cancelAnimationFrame(raf); } applyLock(null); }
      };
    },
    size: () => [W, H],
    def: id => labs[id],
    /* Draw with the shared helpers on another canvas (the Home hero), then restore the lab's own canvas. */
    drawOn(cv, fn) {
      const w = cv.clientWidth, h = cv.clientHeight, dpr = window.devicePixelRatio || 1; if (!w || !h) return;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c2 = cv.getContext("2d"), keep = [ctx, G.ctx, G.W, G.H];
      c2.setTransform(dpr, 0, 0, dpr, 0, 0); c2.fillStyle = C.bg; c2.fillRect(0, 0, w, h);
      ctx = c2; G.ctx = c2; G.W = w; G.H = h;
      try { fn(G); } finally { [ctx, G.ctx, G.W, G.H] = keep; }
    }                                    // read-only lookup (tests step a lab's physics directly)
  };
  /* Predict first: the visitor commits to a guess before anything can give the answer away (D-042, UX spec P0).
     def.predict = { q, options: [...], answer: index, explain, setup? }. States:
       locked  — no guess yet: sim paused on the question's setup, blurred (so no readout gives it away), controls off
       guessed — guess made: still locked; "Run it" unlocks
       free    — ran it, chose a route without guessing ("Read the explanation first" / "Explore freely"), or no
                 prediction: normal sandbox at the question's setup, explanation open. Nothing is held back.
     setup() puts the lab in the exact state the question describes (e.g. Clock Lab at 0.87 c).
     On phones the card sits above the sim, not below it. */
  const NARROW = "(max-width: 900px) and (orientation: portrait), (max-width: 600px)";
  /* Framing (D-043): arriving through a tour stop, the lab takes that stop's question, setup and guess key
     (lab:tour:stop); otherwise its own. stop.predict === null means no guess at that stop. */
  function framing(def) {
    const st = def && Chrono.stopFor ? Chrono.stopFor() : null;
    const P = st && st.stop.predict !== undefined ? st.stop.predict : def && def.predict;
    return { st, P, key: st ? `${def.id}:${st.tourId}:${st.i}` : def && def.id };
  }
  function setUp(def) {                                   // put the lab in the state its question describes
    const { st, P } = framing(def);
    if (st && st.stop.setup && def.applySetup) def.applySetup(st.stop.setup);
    else if (P && P.setup) P.setup();
  }
  function lockState(def) {
    const { P, key } = framing(def);
    if (!def || !P) return "free";
    const g = Chrono.progress.pred(key);
    return g.guess === undefined ? "locked" : g.guess >= 0 && !g.checked ? "guessed" : "free";
  }
  function applyLock(def) {
    const st = lockState(def), on = def && st !== "free", wrap = $("#lab-canvas-wrap"), veil = $("#lab-veil");
    if (wrap) wrap.classList.toggle("locked", on);
    const ctl = $("#lab-controls"); if (ctl) { ctl.classList.toggle("locked", on); ctl.inert = on; }
    if (veil) veil.innerHTML = !on ? "" : st === "locked"
      ? `<div class="veil-msg"><b>Guess first — or skip it</b><span>Pick an answer in the question ${window.matchMedia(NARROW).matches ? "above" : "on the right"}, or go straight in:</span>
          <span class="veil-routes"><button class="btn" data-guess="-1" data-read>Read the explanation first</button><button class="btn" data-guess="-1">Explore freely</button></span></div>`
      : `<div class="veil-msg"><button class="btn primary big" data-pcheck>▶ Run it</button><span>See if you were right.</span></div>`;
  }
  /* Shared with Flatland: Chrono.predictCard(key, p) renders the card; Chrono.wirePredict(key, rerender) wires it. */
  function predictCard(def) { const f = framing(def); return f.P ? Chrono.predictCard(f.key, f.P, "▶ Run it") : ""; }
  Chrono.predictCard = function (key, p, run) {
    const g = Chrono.progress.pred(key);
    if (g.guess === undefined) return `<div class="predict"><div class="eyebrow">Predict first</div><p>${p.q}</p>
      <div class="popts">${p.options.map((o, i) => `<button class="btn" data-guess="${i}">${o}</button>`).join("")}</div>
      <div class="proutes"><span>Or, without guessing:</span> <button class="linkish" data-guess="-1" data-read>Read the explanation first</button> · <button class="linkish" data-guess="-1">Explore freely</button></div></div>`;
    if (g.guess < 0) return "";
    const right = g.guess === p.answer;
    return `<div class="predict">${!g.checked
      ? `<div class="eyebrow">Your guess</div><p><b>${p.options[g.guess]}</b></p>${run ? "" : `<p class="meta">Now try it, then check.</p>`}<button class="btn primary" data-pcheck>${run || "Check my prediction"}</button>`
      : `<div class="eyebrow">${right ? "✓ You predicted it" : "Not quite — and that's the useful kind of wrong"}</div><p class="meta">You said: ${p.options[g.guess]}${right ? "" : ` · Answer: <b>${p.options[p.answer]}</b>`}</p><p>${p.explain}</p><button class="linkish" data-pagain>Ask me again</button>`}</div>`;
  }
  Chrono.wirePredict = function (key, rerender) {
    const W = "#aside, #lab-predict, #lab-veil", q = s => document.querySelectorAll(W.split(", ").map(w => `${w} ${s}`).join(", "));
    q("[data-guess]").forEach(b => b.onclick = () => {
      const read = b.hasAttribute("data-read");
      Chrono.progress.setPred(key, { guess: +b.dataset.guess }); rerender();
      if (read) { const t = document.querySelector("#aside .intro") || document.querySelector("#aside"); t.scrollIntoView({ behavior: "smooth", block: "start" }); }   // reading route: straight to the explanation, sim unlocked
    });
    q("[data-pcheck]").forEach(b => b.onclick = () => { Chrono.progress.setPred(key, Object.assign(Chrono.progress.pred(key), { checked: true })); rerender(); });
    q("[data-pagain]").forEach(b => b.onclick = () => { Chrono.progress.setPred(key, {}); rerender(); });
  };
  /* End card at a tour stop: what you just saw, its limit, the handoff, and one primary action (UX spec §6). */
  /* One end card for every lab (UX spec §6). In a tour: the stop's takeaway, limit, handoff and Next. Otherwise: the
     lab's Remember line and its next question. Both: "Where this leads" (the threads) and when the review question returns. */
  function endCard(def, st) {
    const leads = Chrono.leadsFor ? Chrono.leadsFor(def.id) : [], rl = Chrono.reviewLine ? Chrono.reviewLine(def.id) : "";
    const take = st ? st.stop.takeaway : Chrono.rememberText ? Chrono.rememberText(def.id) : "";
    if (!st && !take && !def.next && !leads.length) return "";
    const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;
    return `<div class="endcard"><div class="eyebrow">What you just saw${st ? ` · stop ${st.i + 1} of ${st.n}` : ""}</div>
      ${take ? `<p class="ec-take">${take} ${st ? (st.stop.tags || []).map(TG).join(" ") : ""}</p>` : ""}
      ${st && st.stop.limit ? `<p class="meta">Limit: ${st.stop.limit}</p>` : ""}
      ${st && st.stop.handoff ? `<p class="ec-hand">${st.stop.handoff}</p>` : !st && def.next ? `<p class="ec-hand">${def.next.q}</p>` : ""}
      ${st ? `<button class="btn primary" data-tour-next>${st.next ? `Next: ${st.next.q} →` : "Finish the tour ✓"}</button>`
        : def.next ? `<a class="btn primary ec-next" href="${def.next.href}">Next: ${def.next.label} →</a>` : ""}
      ${st && st.stop.go ? `<div class="ec-go"><span class="eyebrow">Go deeper</span>${st.stop.go.map(([h, t]) => `<a href="${h}">${t} →</a>`).join("")}</div>` : ""}
      ${leads.length ? `<div class="ec-go"><span class="eyebrow">Where this leads</span>${leads.map(([k, n, sc, th]) => `<a href="#${k}" title="${th}"><i>${sc}</i> ${n} →</a>`).join("")}</div>` : ""}
      ${rl ? `<p class="meta ec-rev">🔁 ${rl}</p>` : ""}</div>`;
  }
  Chrono.endCard = endCard;                                // Flatland's chapters use the same end card
  function renderLabAside(def) {
    const tier = def.tier || "mainstream", st = lockState(def), waiting = st !== "free", fr = framing(def);
    if (st !== "free" && def.lastLock === "free") setUp(def);   // "Ask me again": back to the question's setup
    def.lastLock = st;
    const above = waiting && def.kind !== "doc" && window.matchMedia(NARROW).matches;   // phones: the card goes above the sim
    const lp = $("#lab-predict"); if (lp) lp.innerHTML = above ? predictCard(def) : "";
    $("#aside").innerHTML = `${Chrono.crumb ? Chrono.crumb() : ""}
      <div class="eyebrow">${def.eyebrow || "Lab"}</div>
      <h2>${def.title}</h2>
      <div class="pillrow">${Chrono.tierPill(tier)} ${(def.tags || []).map(t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`).join(" ")}</div>
      ${tier === "exploratory" ? Chrono.expBanner() : ""}
      ${Chrono.introFor ? Chrono.introFor(def.id) : ""}
      ${!above ? predictCard(def) : ""}
      ${!waiting && def.kind !== "doc" && Chrono.missions ? Chrono.missions.card(def) : ""}
      ${waiting ? "" : typeof def.aside === "function" ? def.aside() : (def.aside || "")}
      ${waiting || !Chrono.stickFor ? "" : Chrono.stickFor(def.id)}
      ${waiting || !Chrono.keyIdeas ? "" : Chrono.keyIdeas(def.id)}
      ${waiting ? "" : def.kind === "doc" ? (fr.st ? endCard(def, fr.st) : def.next ? `<a class="nextq" href="${def.next.href}"><span class="eyebrow">Next question</span><span class="nq">${def.next.q}</span><span class="hgo">${def.next.label} →</span></a>` : "") : endCard(def, fr.st)}
      ${def.sources ? `<p class="caveat">Sources: ${def.sources}</p>` : ""}`;
    document.querySelectorAll("#aside [data-hole]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goHole(a.dataset.hole); });
    document.querySelectorAll("#aside [data-view-link]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goView(a.dataset.viewLink); });
    if (def.kind !== "doc") applyLock(def);
    if (Chrono.missions && !waiting) Chrono.missions.wire(def);
    Chrono.wirePredict(fr.key, () => renderLabAside(def));
    document.querySelectorAll("#aside [data-tour-next]").forEach(b => b.onclick = () => Chrono.tourNext && Chrono.tourNext());
    if (def.wireAside) def.wireAside();
  }
})();
/* Shift + arrow keys move any slider in big steps (a tenth of its range); plain arrows keep the fine step. */
document.addEventListener("keydown", e => {
  const t = e.target, dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
  if (!e.shiftKey || !dir || !t.matches || !t.matches('input[type="range"]')) return;
  e.preventDefault();
  const step = +t.step || 1, big = Math.max(step, Math.round((+t.max - +t.min) / 10 / step) * step);
  t.value = +t.value + dir * big; t.dispatchEvent(new Event("input", { bubbles: true }));
});
