/* Chronoscope — Atlas view, Test bench view, hypothesis modal. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 1400, H = 740;
  const HOLE_Y = 72, AXIS_Y = 660, Y0 = 1870, Y1 = 2030, X0 = 190, X1 = 1170, XEXP = 1262;
  const SYM = { yes: "✓", part: "◐", no: "✗", na: "–", unk: "?" };
  const SYM_WORD = { yes: "passes", part: "partly / evades", no: "fails or ignores", na: "not applicable", unk: "unknown" };

  const state = {
    view: "atlas",
    camps: new Set(),                                    // filters are show-only: empty = show everything (D-039)
    tags: new Set(),
    selected: null,   // {type:'hole'|'idea', id}
    hover: null
  };

  const $ = s => document.querySelector(s);
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const campColor = id => `var(--c-${id})`;
  const campOf = id => Chrono.CAMPS.find(c => c.id === id);
  const holeOf = id => Chrono.HOLES.find(h => h.id === id);
  const allIdeas = () => Chrono.IDEAS.concat(Chrono.hyp.asIdeas());
  const campOn = id => !state.camps.size || state.camps.has(id);
  const visible = i => campOn(i.camp) && (!state.tags.size || state.tags.has(i.tag)) && Chrono.shows(Chrono.tierOf(i));
  const visHoles = () => Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h)));
  const isExp = x => Chrono.tierOf(x) === "exploratory";
  const xOf = y => X0 + (y - Y0) / (Y1 - Y0) * (X1 - X0);
  const laneY = camp => 226 + Chrono.CAMPS.findIndex(c => c.id === camp) * 62;
  const holeX = i => { const n = visHoles().length; return n < 2 ? (X0 + X1) / 2 : X0 - 20 + i * ((X1 - X0 + 40) / (n - 1)); };
  const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- filters toolbar: one Filter menu, tick to show only those (D-039) ---------- */
  let fOpen = false;
  function renderFilters() {
    const f = $("#filters"), tags = Object.keys(Chrono.TAGS).filter(t => Chrono.shows(Chrono.TIER_OF_TAG[t])), n = state.camps.size + state.tags.size;
    const names = [...state.camps].map(id => campOf(id).name).concat([...state.tags].map(t => Chrono.TAGS[t]));
    f.innerHTML = `<div class="fdrop ${fOpen ? "open" : ""}"><button class="btn ${n ? "primary" : ""}" id="fbtn" aria-expanded="${fOpen}">Filter${n ? ` · ${n}` : ""} ▾</button>
      <div class="fpanel"><div class="fcols">
        <div class="fcol"><div class="eyebrow">Approach</div>${Chrono.CAMPS.map(c => `<label title="${esc(c.desc)}"><input type="checkbox" data-fc="${c.id}" ${state.camps.has(c.id) ? "checked" : ""}><i class="camp-dot" style="background:${campColor(c.id)}"></i>${esc(c.name)}</label>`).join("")}</div>
        <div class="fcol"><div class="eyebrow">How sure</div>${tags.map(t => `<label><input type="checkbox" data-ft="${t}" ${state.tags.has(t) ? "checked" : ""}><span class="tag ${t}">${Chrono.TAGS[t]}</span></label>`).join("")}</div>
      </div><p class="meta">Tick to show only those. Nothing ticked shows everything.</p>
      <button class="linkish" data-fclear ${n ? "" : "disabled"}>Clear filters</button></div></div>
      <span class="fsum meta">${n ? `Showing only: ${esc(names.join(", "))} · <button class="linkish" data-fclear>show everything</button>` : "Showing everything"}</span>
      <span class="spacer"></span>`;
    $("#fbtn").onclick = e => { e.stopPropagation(); fOpen = !fOpen; f.querySelector(".fdrop").classList.toggle("open", fOpen); $("#fbtn").setAttribute("aria-expanded", fOpen); };
    f.querySelectorAll("[data-fc]").forEach(x => x.onchange = () => { toggle(state.camps, x.dataset.fc); renderAll(); });
    f.querySelectorAll("[data-ft]").forEach(x => x.onchange = () => { toggle(state.tags, x.dataset.ft); renderAll(); });
    f.querySelectorAll("[data-fclear]").forEach(x => x.onclick = () => { state.camps.clear(); state.tags.clear(); renderAll(); });
    if (Chrono.shows("exploratory")) [["+ Your hypothesis", "primary", "add"], ["Export", "", "export"], ["Import", "", "import"]]
      .forEach(([t, cls, a]) => { const b = document.createElement("button"); b.className = "btn " + cls; b.textContent = t; b.onclick = () => Chrono.hypAction(a); f.appendChild(b); });
  }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }
  document.addEventListener("click", e => { if (fOpen && !e.target.closest(".fdrop")) { fOpen = false; const d = $(".fdrop"); if (d) d.classList.remove("open"); } });

  /* ---------- atlas (SVG) ---------- */
  function renderAtlas() {
    const host = $("#atlas");
    host.innerHTML = `<div class="atlas-hint">The map is wide — swipe sideways to explore it, or tap a hole in the list below.</div>`;
    const vw = Chrono.shows("exploratory") ? W : XEXP - 22;   // Learn mode has no exploratory column: crop it so the map draws larger
    const svg = el("svg", { viewBox: `0 0 ${vw} ${H}`, preserveAspectRatio: "xMidYMid meet" }, host);
    const defs = el("defs", {}, svg);
    const glow = el("filter", { id: "glow", x: "-100%", y: "-100%", width: "300%", height: "300%" }, defs);
    el("feGaussianBlur", { stdDeviation: "6", result: "b" }, glow);
    const m = el("feMerge", {}, glow); el("feMergeNode", { in: "b" }, m); el("feMergeNode", { in: "SourceGraphic" }, m);
    svg.addEventListener("click", e => { if (e.target === svg) Chrono.nav("#atlas"); });

    // lanes + axis
    Chrono.CAMPS.forEach(c => {
      const y = laneY(c.id);
      el("line", { x1: X0 - 10, x2: X1 + 20, y1: y, y2: y, stroke: "var(--line)", "stroke-dasharray": "2 6", opacity: campOn(c.id) ? 1 : .3 }, svg);
      const t = el("text", { x: 20, y: y + 4, class: "lane-label", fill: campColor(c.id) }, svg);
      t.style.fill = campColor(c.id); t.style.opacity = campOn(c.id) ? .9 : .3;
      t.textContent = c.name;
    });
    const ax = el("g", { class: "axis" }, svg);
    el("line", { x1: X0, x2: X1, y1: AXIS_Y, y2: AXIS_Y, stroke: "var(--line)" }, ax);
    for (let y = 1900; y <= 2030; y += 10) {
      el("line", { x1: xOf(y), x2: xOf(y), y1: AXIS_Y, y2: AXIS_Y + (y % 50 ? 4 : 8), stroke: "var(--muted)" }, ax);
      if (y % 20 === 0) { const t = el("text", { x: xOf(y), y: AXIS_Y + 22, "text-anchor": "middle" }, ax); t.textContent = y; }
    }
    [[1905, 1930, "relativity & quantum born"], [1960, 1972, "quantum gravity"], [1980, 2000, "quantum cosmology"], [2022, 2027, "JWST · DESI"]]
      .forEach(([a, b, label]) => {
        el("rect", { x: xOf(a), y: 190, width: xOf(b) - xOf(a), height: AXIS_Y - 190, fill: "var(--text)", opacity: .025 }, svg);
        const t = el("text", { x: xOf(a) + 4, y: AXIS_Y - 8, class: "lane-label" }, svg);
        t.style.fontSize = "9px"; t.style.opacity = .6; t.textContent = label;
      });

    if (Chrono.shows("exploratory")) {
      el("line", { x1: XEXP - 44, x2: XEXP - 44, y1: 190, y2: AXIS_Y, stroke: "var(--t-hyp)", "stroke-dasharray": "3 5", opacity: .6 }, svg);
      const t1 = el("text", { x: XEXP - 34, y: AXIS_Y - 22, class: "lane-label" }, svg); t1.style.fill = "var(--t-hyp)"; t1.textContent = "◌ Exploratory";
      const t2 = el("text", { x: XEXP - 34, y: AXIS_Y - 9, class: "lane-label" }, svg); t2.style.fill = "var(--muted)"; t2.style.fontSize = "9px"; t2.textContent = "not mainstream";
    }
    // idea positions (nudge collisions within lane)
    const ideas = allIdeas().filter(visible);
    const placed = {};
    const pos = {};
    ideas.slice().sort((a, b) => a.year - b.year).forEach(i => {
      const x = isExp(i) ? XEXP : xOf(i.year);
      const lane = placed[i.camp] || (placed[i.camp] = []);
      let dy = 0, k = 0;
      while (lane.some(p => Math.abs(p.x - x) < 22 && p.dy === dy)) { k++; dy = (k % 2 ? -1 : 1) * Math.ceil(k / 2) * (isExp(i) ? 16 : 20); }
      lane.push({ x, dy });
      pos[i.id] = { x, y: laneY(i.camp) + dy };
    });

    // arcs
    const arcs = el("g", {}, svg);
    ideas.forEach(i => i.holes.forEach(hid => {
      const hi = visHoles().findIndex(h => h.id === hid);
      if (hi < 0) return;
      const p = pos[i.id], hx = holeX(hi), hy = HOLE_Y + 22;
      const path = el("path", {
        d: `M${p.x},${p.y - 6} C${p.x},${p.y - 90} ${hx},${hy + 90} ${hx},${hy}`,
        class: "arc", stroke: campColor(i.camp), "data-idea": i.id, "data-hole": hid
      }, arcs);
      if (isExp(i)) path.setAttribute("stroke-dasharray", "4 4");
    }));

    // holes
    const counts = {};
    ideas.forEach(i => i.holes.forEach(h => counts[h] = (counts[h] || 0) + 1));
    visHoles().forEach((h, idx) => {
      const g = el("g", { class: "node hole", "data-hole": h.id, transform: `translate(${holeX(idx)},${HOLE_Y})` }, svg);
      const r = 12 + Math.min(10, (counts[h.id] || 0) * 1.3);
      el("circle", { r: r + 6, fill: "none", stroke: "var(--accent)", opacity: .15 }, g);
      el("circle", { r, fill: "var(--bg)", stroke: isExp(h) ? "var(--t-hyp)" : "var(--accent)", "stroke-width": 1.5, filter: "url(#glow)", "stroke-dasharray": isExp(h) ? "4 3" : "none" }, g);
      const id = el("text", { y: 4, class: "hole-id" }, g); id.textContent = h.id;
      const words = h.name.split(" "); const lines = [""];
      words.forEach(w => { if ((lines[lines.length - 1] + " " + w).trim().length > 15) lines.push(w); else lines[lines.length - 1] = (lines[lines.length - 1] + " " + w).trim(); });
      lines.forEach((ln, li) => { const t = el("text", { y: r + 22 + li * 15, class: "hole-label" }, g); t.textContent = ln; });
      const c = el("text", { y: r + 22 + lines.length * 15 + 2, class: "hole-id" }, g); c.textContent = `${counts[h.id] || 0} attempts`;
      g.addEventListener("mouseenter", () => setHover({ type: "hole", id: h.id }));
      g.addEventListener("mouseleave", () => setHover(null));
      g.addEventListener("click", () => select({ type: "hole", id: h.id }));
    });

    // idea nodes
    ideas.forEach(i => {
      const p = pos[i.id];
      const g = el("g", { class: "node idea", "data-idea": i.id, transform: `translate(${p.x},${p.y})` }, svg);
      el("circle", { r: 14, fill: "transparent" }, g);
      if (isExp(i)) { el("circle", { r: 8, fill: "none", stroke: campColor(i.camp), "stroke-dasharray": "3 3" }, g); el("circle", { r: 2.5, fill: campColor(i.camp) }, g); }
      else el("circle", { r: 6, fill: campColor(i.camp), stroke: "var(--bg)", "stroke-width": 2 }, g);
      const t = isExp(i) ? el("text", { x: 11, y: 4, class: "idea-label" }, g) : el("text", { x: 7, y: -9, class: "idea-label", transform: "rotate(-28)" }, g);
      const lim = isExp(i) ? 17 : 30;
      t.textContent = i.name.length > lim ? i.name.slice(0, lim - 1) + "…" : i.name;
      if (isExp(i)) t.style.fill = "var(--t-hyp)";
      g.addEventListener("mouseenter", () => setHover({ type: "idea", id: i.id }));
      g.addEventListener("mouseleave", () => setHover(null));
      g.addEventListener("click", e => { e.stopPropagation(); select({ type: "idea", id: i.id }); });
    });
    applyHighlight();
  }

  function focusSets(f) {
    if (!f) return null;
    const ideas = allIdeas().filter(visible);
    if (f.type === "hole") return { holes: new Set([f.id]), ideas: new Set(ideas.filter(i => i.holes.includes(f.id)).map(i => i.id)) };
    const i = ideas.find(x => x.id === f.id);
    return i ? { holes: new Set(i.holes), ideas: new Set([i.id]) } : null;
  }
  function applyHighlight() {
    const f = focusSets(state.hover || state.selected);
    document.querySelectorAll("#atlas .hole").forEach(n => n.classList.toggle("dim", !!f && !f.holes.has(n.dataset.hole)));
    document.querySelectorAll("#atlas .idea").forEach(n => { n.classList.toggle("dim", !!f && !f.ideas.has(n.dataset.idea)); n.classList.toggle("hot", !!f && f.ideas.has(n.dataset.idea)); });
    document.querySelectorAll("#atlas .arc").forEach(n => {
      const on = f && f.ideas.has(n.dataset.idea) && f.holes.has(n.dataset.hole);
      n.style.opacity = f ? (on ? .95 : .05) : .3;
      n.style.strokeWidth = on ? 2 : 1.2;
    });
  }
  function setHover(h) { state.hover = h; applyHighlight(); }
  function select(s) { Chrono.nav(`#${state.view === "bench" ? "bench" : "atlas"}/${s.id}`); }

  /* ---------- aside ---------- */
  function renderAside() {
    const a = $("#aside"), cr = Chrono.crumb ? Chrono.crumb() : "";
    const s = state.selected;
    if (!s) return a.innerHTML = cr + (state.view === "bench" ? benchIntroHTML() : introHTML());
    if (s.type === "hole") return a.innerHTML = cr + holeHTML(holeOf(s.id)), wireAside();
    const i = allIdeas().find(x => x.id === s.id);
    a.innerHTML = cr + (i ? ideaHTML(i) : introHTML());
    wireAside();
  }
  function wireAside() {
    document.querySelectorAll("#aside [data-go-hole]").forEach(b => b.onclick = () => select({ type: "hole", id: b.dataset.goHole }));
    document.querySelectorAll("#aside [data-go-idea]").forEach(b => b.onclick = () => select({ type: "idea", id: b.dataset.goIdea }));
    document.querySelectorAll("#aside [data-myscore]").forEach(sel => sel.onchange = () => {
      const s = state.selected; if (!s || s.type !== "idea") return;
      Chrono.progress.setScore(s.id, sel.dataset.myscore, sel.value || null);
      if (state.view === "bench") renderBench();
    });
    const sm = $("#aside [data-scoreme]"); if (sm) sm.onclick = () => { const t = $("#aside table.bench"); t.classList.toggle("scoring"); sm.textContent = t.classList.contains("scoring") ? "Hide my scores" : "Score it yourself"; };
    const del = $("#aside [data-del]");
    if (del) del.onclick = () => { Chrono.hyp.remove(del.dataset.del); Chrono.nav("#atlas"); };
    const back = $("#aside [data-back]");
    if (back) back.onclick = () => Chrono.nav("#" + state.view);
  }
  function introHTML() {
    const ideas = allIdeas().filter(visible);
    const bars = visHoles().map(h => {
      const on = ideas.filter(i => i.holes.includes(h.id));
      const seg = Chrono.CAMPS.map(c => { const n = on.filter(i => i.camp === c.id).length; return n ? `<span style="flex:${n};background:${campColor(c.id)}" title="${c.name}: ${n}"></span>` : ""; }).join("");
      return `<div class="barrow" data-go-hole="${h.id}"><span>${h.id}</span><div class="stack">${seg}</div><span>${on.length}</span></div>`;
    }).join("");
    setTimeout(wireAside);
    /* Phones get the holes as a tappable list (UX spec: a list view on mobile); touch screens get tap wording, not hover. */
    const narrow = window.matchMedia("(max-width: 900px) and (orientation: portrait), (max-width: 600px)").matches, touch = window.matchMedia("(hover: none)").matches;
    return `
      <div class="eyebrow">The Atlas</div>
      <h2>Why does our universe have exactly one time dimension?</h2>
      <p>Nobody knows for sure — and that's one of the holes in physics' account of time. Think of that account as a map with holes in it: places where the theories don't add up. The ${visHoles().length} glowing nodes along the top are those <b>holes</b>. Every dot below is someone's <b>attempt</b> to fill one, placed by year and coloured by approach.</p>
      ${touch ? `<p>Tap a hole to see who has tried to fill it, or tap any dot for its story. The map scrolls sideways; the list below has every hole.</p>`
        : `<p>Hover a hole to see who has tried to fill it${Chrono.mode() === "learn" ? " — names appear as you hover" : ""}. Click anything to read the detail.</p>`}
      ${narrow ? `<h3>The holes</h3><div class="holelist">${visHoles().map(h => { const n = Chrono.IDEAS.filter(i => i.holes.includes(h.id) && Chrono.shows(Chrono.tierOf(i))).length;
        return `<button class="hl" data-go-hole="${h.id}"><b>${h.id} · ${h.name}</b><span>${h.one} · ${n} attempt${n === 1 ? "" : "s"}</span></button>`; }).join("")}</div>` : ""}
      ${Chrono.mode() === "learn" && Chrono.maxLevel >= 3 ? `<p class="meta">Want the raw version — this project's own challenges to the mainstream, your own hypotheses, every label? Switch to <b>◌ Workbench</b> in the Guide menu (top right).</p>` : ""}
      <h3>Who attacks which hole</h3>
      <div class="bars">${bars}</div>
      <p class="meta" style="margin-top:8px">Colour shows the approach (the "camp"): some add more time or dimensions, some argue time is less fundamental than it looks, some look to the cosmos. Notice where "more time" and "less time" aim at the same hole — two opposite repairs for one crack.</p>
      ${Chrono.shows("exploratory") ? `<h3>Add your own</h3>
      <p>Use <b>+ Your hypothesis</b> to put a loose idea on the map. Say what it would predict and what would kill it. Export the file to share with friends; they import it to see yours.</p>` : ""}
      ${Chrono.tierLegend()}
      <p class="caveat">Test-bench scores are a first-pass judgement drafted with Claude, an AI — made to be argued with.</p>`;
  }
  const HURDLE_WHY = {
    rel: "Relativity has passed every test for over a century; any idea about time has to agree with it.",
    pred: "If knowing 'now' doesn't fix what comes next, physics can't forecast anything.",
    matter: "Atoms, planets and people have to be able to exist.",
    arrow: "A full account of time should say why it runs one way.",
    test: "An idea that predicts nothing new can't be checked."
  };
  function benchIntroHTML() {
    return `
      <div class="eyebrow">Test bench</div>
      <h2>Every idea against the same five hurdles</h2>
      <p class="intro">A good theory of time has to clear all five. Few do. Click any row to see why it scored as it did — and set your own score where you disagree.</p>
      <h3>The five hurdles</h3>
      <dl class="hurdles">${Chrono.CONSTRAINTS.map(c => `<dt>${c.name} ${Chrono.info ? Chrono.info("h-" + c.id) : ""}</dt><dd>${HURDLE_WHY[c.id]}</dd>`).join("")}</dl>
      <p class="meta">✓ passes · ◐ partly / evades · ✗ fails or ignores · – doesn't apply · ? unknown · <a href="#concepts/hurdles">More on the hurdles →</a></p>
      <p class="caveat">Scores are a first-pass judgement drafted with Claude, an AI — made to be argued with.</p>`;
  }
  function holeHTML(h) {
    const ideas = allIdeas().filter(visible).filter(i => i.holes.includes(h.id)).sort((a, b) => a.year - b.year);
    const list = ideas.map(i => `<div class="barrow" style="grid-template-columns:44px 1fr" data-go-idea="${esc(i.id)}"><span>${i.year}</span><span style="color:var(--text)"><i class="camp-dot" style="background:${campColor(i.camp)}"></i>${esc(i.name)}</span></div>`).join("");
    return `
      <button class="btn" data-back>← Atlas</button>
      <div class="eyebrow" style="margin-top:14px">Hole ${h.id}</div>
      <h2>${esc(h.name)}</h2>
      ${h.one ? `<p class="intro">${esc(h.one)}</p>` : ""}
      ${isExp(h) ? Chrono.expBanner() : ""}
      <span class="tag ${h.tag}">${Chrono.TAGS[h.tag]}</span> <span class="meta">${isExp(h) ? "our framing" : "that this is an open problem"}</span>
      <p style="margin-top:12px">${esc(h.plain)}</p>
      <h3>Why physicists take it seriously</h3>
      <p>${esc(h.why)}</p>
      <h3>Attempts to fill it (${ideas.length})</h3>
      ${list || '<p class="meta">None visible with current filters.</p>'}`;
  }
  function ideaHTML(i) {
    const camp = campOf(i.camp);
    const holes = i.holes.filter(holeOf).map(h => `<span class="holepill" data-go-hole="${esc(h)}">${esc(h)} · ${esc(holeOf(h).name)}</span>`).join("");
    const mine = k => Chrono.progress.score(i.id, k);
    const bench = Chrono.CONSTRAINTS.map(c => `<tr><td>${c.name}</td><td class="sc"><span class="v-${i.c[c.id]}">${i.user ? "" : `${SYM[i.c[c.id]]} ${SYM_WORD[i.c[c.id]]}`}</span>${i.user ? "" : `<div class="why">${esc(Chrono.benchWhy(i, c.id))}</div>`}
      <label class="yours">${i.user ? "Your score" : "You"} <select class="myscore" data-myscore="${c.id}" aria-label="Your score: ${c.name}"><option value="">${i.user ? "—" : "agree"}</option>${Object.keys(SYM).map(v => `<option value="${v}"${mine(c.id) === v ? " selected" : ""}>${SYM[v]} ${SYM_WORD[v]}</option>`).join("")}</select></label></td></tr>`).join("");
    const benchBlock = i.camp === "bench"
      ? `<h3>Role</h3><p>This is a <b>constraint</b>: a result other ideas are tested against, not an attempt to fill a hole.</p>`
      : i.tag === "ANALOGY" ? "" : `<h3>Test bench ${i.user ? "(unscored — yours to argue)" : ""}</h3>
        <table class="bench${Chrono.CONSTRAINTS.some(c => mine(c.id)) || i.user ? " scoring" : ""}">${bench}</table>
        ${i.user ? "" : `<button class="linkish scoreme" data-scoreme>Score it yourself</button>`}
        <p class="meta">Scores are a first-pass judgement drafted with Claude, an AI. Disagree? Press <b>Score it yourself</b> and set your own — kept in your browser and shown on the Test bench.</p>`;
    const [hp, hk] = i.tag === "RULEDOUT" ? ["What it predicted", "What killed it"] : i.tag === "ESTABLISHED" ? ["Predicts", "What would overturn it"] : i.camp === "bench" ? ["Predicts", "What would overturn it"] : ["Would predict", "Would be killed by"];
    return `
      <button class="btn" data-back>← Atlas</button>
      <div class="eyebrow" style="margin-top:14px"><i class="camp-dot" style="background:${campColor(i.camp)}"></i>${camp.name} · ${i.user ? "your hypothesis" : i.year}</div>
      <h2>${esc(i.name)}</h2>
      ${isExp(i) ? Chrono.expBanner(i.user) : ""}
      <div class="meta">${esc(i.who)} · ${esc(i.outcome)}</div>
      <span class="tag ${i.tag}">${Chrono.TAGS[i.tag]}</span>
      <p style="margin-top:12px">${esc(i.plain)}</p>
      ${i.why ? `<h3>The thinking behind it</h3><p>${esc(i.why)}</p>` : ""}
      ${i.predicts ? `<h3>${hp}</h3><p>${esc(i.predicts)}</p>` : ""}
      ${i.kill ? `<h3>${hk}</h3><p>${esc(i.kill)}</p>` : ""}
      <h3>Holes it targets</h3><div class="pillrow">${holes}</div>
      ${benchBlock}
      ${i.note ? `<p class="note" style="margin-top:14px">${esc(i.note)}</p>` : ""}
      ${i.user ? `<div class="row" style="justify-content:flex-start"><button class="btn" data-del="${esc(i.id)}">Remove</button></div>` : ""}`;
  }

  /* ---------- test bench table ---------- */
  function renderBench() {
    const v = $("#benchview");
    const ideas = allIdeas().filter(visible).filter(i => i.camp !== "bench" && i.tag !== "ANALOGY").sort((a, b) => a.year - b.year);
    const head = Chrono.CONSTRAINTS.map(c => `<th style="text-align:center" title="${c.name}: ${HURDLE_WHY[c.id]}">${c.short} ${Chrono.info ? Chrono.info("h-" + c.id) : ""}</th>`).join("");
    const rows = ideas.map(i => `<tr data-go-idea="${esc(i.id)}" style="${state.selected && state.selected.id === i.id ? "outline:1px solid var(--accent)" : ""}">
      <td>${i.user ? "yours" : i.year}${isExp(i) ? ' <span class="expdot" title="Exploratory">◌</span>' : ""}</td>
      <td><i class="camp-dot" style="background:${campColor(i.camp)}"></i>${esc(i.name)}</td>
      <td><span class="tag ${i.tag}">${Chrono.TAGS[i.tag]}</span></td>
      ${Chrono.CONSTRAINTS.map(c => { const m = Chrono.progress.score(i.id, c.id); return `<td class="sym v-${i.c[c.id]}" title="${esc(SYM_WORD[i.c[c.id]] + (Chrono.benchWhy(i, c.id) ? " — " + Chrono.benchWhy(i, c.id) : "") + (m ? ` · You: ${SYM_WORD[m]}` : ""))}">${SYM[i.c[c.id]]}${m && m !== i.c[c.id] ? `<sup class="mine v-${m}" aria-label="your score">${SYM[m]}</sup>` : ""}</td>`; }).join("")}
    </tr>`).join("");
    v.innerHTML = `<p class="meta">Every attempt against the same hurdles. ✓ passes · ◐ partly / evades · ✗ fails or ignores · – n/a · ? unknown. First-pass scores by Claude — hover a score for the reason, click a row to argue with it. Small raised marks are your own scores.</p>
      <table><thead><tr><th>Year</th><th>Idea</th><th>Status</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    v.querySelectorAll("[data-go-idea]").forEach(r => r.onclick = () => select({ type: "idea", id: r.dataset.goIdea }));
  }

  /* ---------- modal ---------- */
  function openModal() {
    $("#h-camp").innerHTML = Chrono.CAMPS.filter(c => c.id !== "bench").map(c => `<option value="${c.id}"${c.id === "more" ? " selected" : ""}>${c.name}</option>`).join("");
    $("#h-holes").innerHTML = visHoles().map(h => `<label><input type="checkbox" value="${h.id}">${h.id} ${esc(h.name)}</label>`).join("");
    ["#h-name", "#h-plain", "#h-pred", "#h-kill"].forEach(s => $(s).value = "");
    $("#modal").style.display = "flex";
    $("#h-name").focus();
  }
  $("#h-cancel").onclick = () => $("#modal").style.display = "none";
  $("#h-save").onclick = () => {
    const name = $("#h-name").value.trim();
    const holes = [...document.querySelectorAll("#h-holes input:checked")].map(x => x.value);
    if (!name || !holes.length) { alert("Give it a name and at least one hole."); return; }
    const h = { id: "u" + Date.now(), name, camp: $("#h-camp").value, holes, plain: $("#h-plain").value.trim(),
      pred: $("#h-pred").value.trim(), kill: $("#h-kill").value.trim(), who: $("#h-who").value.trim() || "You" };
    Chrono.hyp.add(h);
    if (state.camps.size) state.camps.add(h.camp); if (state.tags.size) state.tags.add("HYPOTHESIS");   // keep a new idea visible under active filters
    $("#modal").style.display = "none";
    Chrono.nav("#atlas/" + h.id);
  };
  $("#importfile").onchange = e => { const f = e.target.files[0]; if (f) Chrono.hyp.importJSON(f, (ok, added, skipped) => { if (!ok) alert("That file couldn't be read."); else if (skipped) alert(`Imported ${added} idea(s); skipped ${skipped} (already here, or missing a name, camp or known hole).`); renderAll(); }); e.target.value = ""; };

  Chrono.hypAction = a => a === "add" ? openModal() : a === "export" ? Chrono.hyp.exportJSON() : $("#importfile").click();

  /* ---------- ◌ Workbench: exploratory ideas, in one place (Workbench mode, D-039) ---------- */
  Chrono.lab.register({
    id: "ideas", kind: "doc", title: "Exploratory ideas", eyebrow: "◌ Workbench", tier: "exploratory",
    page() {
      const ex = allIdeas().filter(isExp), ours = ex.filter(i => !i.user), mine = ex.filter(i => i.user), holes = Chrono.HOLES.filter(isExp);
      const card = i => `<a class="xcard" href="#atlas/${esc(i.id)}"><span class="eyebrow">${i.user ? "Yours" : i.year} · ${esc((campOf(i.camp) || {}).name || "")}</span><b>${esc(i.name)}</b><span>${esc(i.plain || "")}</span><span class="hgo">On the Atlas →</span></a>`;
      return `<div class="docwrap ideas">
        <div class="eyebrow">◌ Workbench mode</div>
        <h1>Exploratory ideas</h1>
        <p class="lede">This project's own challenges to mainstream physics, and yours. Each one says what it would predict and what would kill it, and each gets scored on the Test bench like everything else. They're here to be tested, not believed.</p>
        ${holes.length ? `<h2 class="sect">Open questions this project adds</h2><div class="xgrid">${holes.map(h => `<a class="xcard" href="#atlas/${esc(h.id)}"><span class="eyebrow">${esc(h.id)}</span><b>${esc(h.name)}</b><span>${esc(h.one || "")}</span><span class="hgo">On the Atlas →</span></a>`).join("")}</div>` : ""}
        <h2 class="sect">This project's ideas</h2><div class="xgrid">${ours.map(card).join("")}</div>
        <h2 class="sect">Your hypotheses</h2>${mine.length ? `<div class="xgrid">${mine.map(card).join("")}</div>` : `<p class="meta">None yet. Add one: name it, say which hole it fills, what it predicts, and what would prove it wrong.</p>`}
        <div class="xbtns"><button class="btn primary" data-hyp2="add">+ Add your hypothesis</button> <button class="btn" data-hyp2="export">Export</button> <button class="btn" data-hyp2="import">Import</button></div>
      </div>`;
    },
    wire() { document.querySelectorAll("[data-hyp2]").forEach(b => b.onclick = () => Chrono.hypAction(b.dataset.hyp2)); },
    aside: () => `<p><b>◌ Workbench mode</b> is the place for ideas that aren't mainstream physics yet.</p>
      <p>Here you'll find this project's own exploratory ideas and your hypotheses, the Dimension Map, and the tools to add, export and share ideas.</p>
      <p class="meta">Everything here carries the <span class="tag HYPOTHESIS">Hypothesis</span> tag. Switch back to Learn in the Guide menu (top right) for physics as physicists hold and debate it.</p>`
  });

  /* ---------- views ---------- */
  document.querySelectorAll("header button[data-view]").forEach(b => b.onclick = () => Chrono.nav("#" + b.dataset.view));
  function renderAll() {
    const mod = Chrono.views && Chrono.views[state.view];
    ["#atlas", "#benchview", "#flatland", "#lab", "#doc"].forEach(sel => { const n = $(sel); if (n) n.style.display = "none"; });
    Object.keys(Chrono.views || {}).forEach(k => { if (k !== state.view && Chrono.views[k].hide) Chrono.views[k].hide(); });
    renderLevel();
    if (mod) { $("#filters").style.display = "none"; mod.show(); return; }
    $("#filters").style.display = "";
    $("#atlas").style.display = state.view === "atlas" ? "" : "none";
    $("#benchview").style.display = state.view === "bench" ? "block" : "none";
    renderFilters();
    if (state.view === "atlas") renderAtlas(); else renderBench();
    renderAside();
  }
  function renderLevel() {
    const host = $("#levelctl"); if (!host) return;
    document.body.classList.toggle("mode-lab", Chrono.mode() === "lab");
    document.body.classList.toggle("mode-learn", Chrono.mode() === "learn");
    host.innerHTML = Chrono.maxLevel < 3 ? "" : `<div class="modesw" role="group" aria-label="Mode">
      <button class="${Chrono.mode() === "learn" ? "on" : ""}" data-lvl="2" title="Physics as physicists hold and debate it, plus published fringe proposals. Guided and uncluttered.">Learn</button>
      <button class="lab ${Chrono.mode() === "lab" ? "on" : ""}" data-lvl="3" title="Workbench mode: adds this project's own exploratory ideas, your hypotheses and the Dimension Map (under Explore). Not mainstream physics.">◌ Workbench</button></div>`;
    host.querySelectorAll("[data-lvl]").forEach(b => b.onclick = () => Chrono.setLevel(+b.dataset.lvl));
    document.querySelectorAll("header [data-tier]").forEach(b => b.style.display = Chrono.shows(b.dataset.tier) ? "" : "none");
    if (Chrono.navSync) Chrono.navSync();
  }
  Chrono.onLevel.push(() => { state.tags = new Set([...state.tags].filter(t => Chrono.shows(Chrono.TIER_OF_TAG[t]))); rendered = false; route(); });
  Chrono.views = Chrono.views || {};
  if (Chrono.flatland) Chrono.views.flatland = { show: () => { $("#flatland").style.display = "flex"; Chrono.flatland.show(); }, hide: () => Chrono.flatland.hide() };
  Chrono.goView = v => Chrono.nav("#" + v);
  Chrono.goHole = id => Chrono.nav("#atlas/" + id);

  /* ---------- routing: #view · #atlas/H5 · #atlas/<idea id> · #bench/<idea id> · #flatland/3 ----------
     Every navigation goes through the URL hash, so views can be linked to and Back works. */
  let rendered = false;
  Chrono.nav = hash => { if (location.hash === hash) route(); else location.hash = hash; };
  function route() {
    const [v0, arg] = decodeURIComponent(location.hash.slice(1)).split("/");
    const btn = document.querySelector(`header button[data-view="${v0}"]`);
    const known = btn || v0 === "home";
    const v = !v0 ? "home" : known && (!btn || !btn.dataset.tier || Chrono.shows(btn.dataset.tier)) ? v0 : "atlas";
    if (v0 && v !== v0) history.replaceState(null, "", "#atlas");
    let sel = null;
    if ((v === "atlas" || v === "bench") && arg) {
      const h = holeOf(arg), i = allIdeas().find(x => x.id === arg);
      if (h && Chrono.shows(Chrono.tierOf(h))) sel = { type: "hole", id: arg };
      else if (i && Chrono.shows(Chrono.tierOf(i))) sel = { type: "idea", id: arg };
    }
    const same = rendered && v === state.view && (v === "atlas" || v === "bench");
    state.view = v; state.selected = sel;
    Chrono.progress.visit(v);
    const fl = v === "flatland" && parseInt(arg, 10);
    if (v !== "home") Chrono.progress.setLast("#" + v + (sel ? "/" + sel.id : fl ? "/" + fl : ""));
    document.querySelectorAll("header button[data-view]").forEach(x => { x.classList.toggle("on", x.dataset.view === v); x.classList.toggle("seen", Chrono.progress.seen(x.dataset.view)); });
    if (v === "flatland" && Chrono.flatland && arg) Chrono.flatland.setChapter(parseInt(arg, 10) - 1);
    if (v === "concepts") Chrono.conceptSel = arg || null;
    if (v === "review") Chrono.reviewSel = arg || null;
    document.body.classList.toggle("onhome", v === "home");   // Home has no sidebar (UX spec §5)
    Chrono.tour.renderBar();
    if (Chrono.navSync) Chrono.navSync();
    if (same) { applyHighlight(); renderAside(); if (v === "bench") renderBench(); return; }
    rendered = true;
    renderAll();
  }
  window.addEventListener("hashchange", route);
  route();
})();
