/* Chronoscope — Home, the guided tours, the three scales and the threads that run through them.
   Tours: lists of stops, each an existing view plus the question it answers. A bar above the stage carries
   the question and Previous / Next. Add a stop by adding one object to a tour's list.
   Scales: Voyages (people and spacecraft) · Physics (the laws underneath) · Cosmos (the universe as a whole).
   Threads: the same question about time followed across the scales; each lab shows the threads it's on. */
(function () {
  const $ = s => document.querySelector(s);
  const P = Chrono.progress;

  const TOURS = Chrono.STOPS;                             // the tours and their stops live in stops.js (D-043)
  const SCALES = [
    { id: "quantum", name: "Quantum", sub: "The very small", col: "#5ee0e6", labs: [["delayed", "Delayed choice"], ["frozen", "The frozen universe"]] },
    { id: "voyages", name: "Voyages", sub: "People and spacecraft", col: "var(--c-lens)", labs: [["missions", "Mission clocks"], ["mars", "Talking to Mars"], ["voyage", "The 1 g voyage"], ["energy", "Earth's energy budget"]] },
    { id: "labs", name: "Physics", sub: "The laws underneath", col: "var(--t-est)", labs: [["flatland", "Flatland"], ["field", "Field Ocean"], ["clocks", "Clock Lab"], ["spacetime", "Spacetime"], ["river", "River"], ["hawking", "Black holes evaporate"], ["entropy", "Entropy box"], ["films", "Two Films"], ["wormhole", "Wormholes"], ["loops", "Time loops"]] },
    { id: "cosmos", name: "Cosmos", sub: "The universe as a whole", col: "var(--simple, #9b8cff)", labs: [["timeline", "Cosmic timeline"], ["expand", "Expanding universe"], ["horizons", "Cosmic horizons"], ["boot", "Boot a Universe"], ["janus", "The Janus point"]] }
  ];
  /* Threads: [view key, label, scale] — scale V (voyages), P (physics), C (cosmos), A (atlas). */
  const THREADS = [
    { id: "clock", icon: "⏱", name: "Clocks disagree", stops: [["frozen", "A clock in a frozen universe", "Q"], ["missions", "Mission clocks", "V"], ["clocks", "Clock Lab", "P"], ["spacetime", "Twin paradox", "P"], ["river", "Clocks near a black hole", "P"], ["expand", "Cosmic clocks (redshift)", "C"]] },
    { id: "now", icon: "◬", name: "Light and 'now'", stops: [["delayed", "Delayed choice", "Q"], ["mars", "Talking to Mars", "V"], ["spacetime", "Whose 'now'?", "P"], ["flatland/7", "Time as a slice", "P"], ["films", "Two Films", "P"], ["horizons", "Cosmic horizons", "C"]] },
    { id: "arrow", icon: "→", name: "The arrow of time", stops: [["entropy", "Entropy box", "P"], ["energy", "Earth's energy budget", "V"], ["hawking", "Black holes evaporate", "P"], ["timeline", "Cosmic timeline", "C"], ["janus", "The Janus point", "C"], ["atlas/H3", "Hole H3: why the arrow?", "A"]] },
    { id: "dims", icon: "◇", name: "Why 3 + 1?", stops: [["flatland/4", "A 4D visitor", "P"], ["films", "Two Films", "P"], ["boot", "Boot a Universe", "C"], ["atlas/H5", "Hole H5: why one time?", "A"]] }
  ];
  const SCALE_NAME = { Q: "Quantum", V: "Voyages", P: "Physics", C: "Cosmos", A: "Atlas" };
  const TOTAL = ["atlas", "bench", "concepts", "review", "story", ...SCALES.flatMap(s => s.labs.map(l => l[0])), "sure"];

  /* Threads a view belongs to, rendered for its aside. key: "clocks", "flatland/7", … */
  /* "Where this leads" (UX spec §6): the next stop along each thread this view is on (or the one before, at a thread's end); up to three. */
  Chrono.leadsFor = key => {
    const out = [];
    THREADS.forEach(t => { const i = t.stops.findIndex(x => x[0] === key); if (i < 0) return; const p = t.stops[i + 1] || t.stops[i - 1];
      if (p && !out.some(o => o[0] === p[0])) out.push([p[0], p[1], SCALE_NAME[p[2]], t.name]); });
    return out.slice(0, 3);
  };
  Chrono.threadsFor = key => {
    const on = THREADS.filter(t => t.stops.some(s => s[0] === key));
    if (!on.length) return "";
    return `<div class="threads">${on.map(t => `<div class="thread"><span class="th-name">${t.icon} ${t.name} — at every scale ${Chrono.info ? Chrono.info(t.id) : ""}</span>
      <span class="th-stops">${t.stops.map(([k, n, sc]) => k === key ? `<b>${n}</b>` : `<a href="#${k}" title="${SCALE_NAME[sc]}">${n}</a>`).join(" → ")}</span></div>`).join("")}</div>`;
  };

  /* ---------- tour bar ---------- */
  const cur = () => TOURS[P.tourId()] || TOURS.puzzle;
  const TOUR_NUM = { puzzle: 1, zoom: 2, time: 3 };
  function startTour(i, id) { P.setTour(i, id); P.visit("tour:" + id); P.tourVisit(id, i); Chrono.nav(TOURS[id].stops[i].href); }
  Chrono.startTour = startTour;
  /* The stop this view is, if a tour is running and we're on its current stop: { tourId, i, stop, next } */
  Chrono.stopFor = () => {
    const i = P.tour(), id = P.tourId(), T = TOURS[id];
    if (i === null || !T || !T.stops[i] || location.hash !== T.stops[i].href) return null;
    return { tourId: id, i, stop: T.stops[i], next: T.stops[i + 1] || null, n: T.stops.length };
  };
  Chrono.tourNext = () => { const i = P.tour(), id = P.tourId(), T = TOURS[id]; if (i === null) return;
    if (i >= T.stops.length - 1) { P.finishTour(T.stops.length); Chrono.nav("#review/" + id); } else startTour(i + 1, id); };
  Chrono.tourList = () => ["puzzle", "zoom", "time"].map(id => ({ id, name: TOURS[id].name }));
  Chrono.tourStops = id => TOURS[id] ? TOURS[id].stops.map(s => s.href.slice(1)) : [];
  /* The Tours menu (UX spec §3): three tours with progress; resumes a running tour, else starts at the first stop not yet visited. */
  function renderToursMenu() {
    const m = $("#toursmenu"); if (!m) return;
    const ICON = { puzzle: "🧩", zoom: "🚀", time: "⏳" }, run = P.tour(), rid = P.tourId();
    m.innerHTML = `<div class="navscale">Guided tours · about 20 minutes each</div>` + ["puzzle", "zoom", "time"].map(id => {
      const T = TOURS[id], n = T.stops.length, vis = P.tourVisited(id), on = run !== null && rid === id, done = P.tourDone(id);
      const at = on ? run : Math.max(0, T.stops.findIndex((s, i) => !vis.includes(i)));
      return `<button class="tmenu" data-start-tour="${id}" data-at="${at}"><span class="tm-icon" aria-hidden="true">${ICON[id]}</span><span class="tm-body"><b>Tour ${TOUR_NUM[id]} · ${T.name}</b>
        <span>${on ? `On stop ${run + 1} of ${n} — continue` : done ? `✓ Done · ${n} stops` : vis.length ? `${vis.length} of ${n} stops visited` : `${n} stops`}</span></span></button>`;
    }).join("");
    m.querySelectorAll("[data-at]").forEach(b => b.onclick = () => startTour(+b.dataset.at, b.dataset.startTour));
  }
  Chrono.tour = {
    renderBar() {
      renderToursMenu();
      const bar = $("#tourbar"), chip = $("#tourchip"), i = P.tour(), T = cur(), id = P.tourId(), S = T.stops;
      document.body.classList.toggle("touring", i !== null);
      if (i === null || !S[i]) { bar.style.display = "none"; bar.innerHTML = ""; if (chip) chip.innerHTML = ""; return; }
      const s = S[i], on = location.hash === s.href, last = i === S.length - 1, home = !location.hash || location.hash === "#home";
      /* Off the route: no banner (UX spec §3) — a small "Resume" chip in the header instead; Home has its Continue card. */
      if (chip) chip.innerHTML = on || home ? "" : `<button class="tchip" data-tb="resume" title="Back to stop ${i + 1}: ${s.q}">▶ Resume Tour ${TOUR_NUM[id]} · stop ${i + 1}</button><button class="tchip-x" data-tb="leave" title="Leave the tour" aria-label="Leave the tour">×</button>`;
      bar.style.display = on ? "flex" : "none";
      bar.innerHTML = !on ? "" : `
        <span class="tb-step">${T.name} · ${i + 1} / ${S.length}</span>
        <span class="tb-q"><b>${s.q}</b> <span class="meta">${s.say}</span></span>
        <span class="tb-btns">
          <button class="btn" data-tb="prev" ${i === 0 ? "disabled" : ""}>←</button>
          <button class="btn primary" data-tb="next">${last ? "Finish the tour ✓" : `Next: ${S[i + 1].q} →`}</button>
          <button class="btn" data-tb="leave" title="Leave the tour (you can resume from Home)">×</button>
        </span>`;
      document.querySelectorAll("#tourbar [data-tb], #tourchip [data-tb]").forEach(b => b.onclick = () => {
        const a = b.dataset.tb;
        if (a === "prev") startTour(i - 1, id);
        else if (a === "next") Chrono.tourNext();
        else if (a === "resume") Chrono.nav(s.href);
        else if (a === "leave") { P.setTour(null); Chrono.tour.renderBar(); if (Chrono.lab && Chrono.lab.rebuild) Chrono.lab.rebuild(); }   // the lab drops its stop framing
      });
    }
  };

  /* ---------- home ---------- */

  function page() {
    const t = P.tour(), last = P.last(), seen = TOTAL.filter(v => P.seen(v)).length;
    const lb = last && document.querySelector(`header button[data-view="${last.slice(1).split("/")[0]}"]`), lastName = lb && lb.firstChild.textContent.trim();
    const lab = Chrono.mode() === "lab", rid = P.tourId(), running = t !== null && TOURS[rid] && TOURS[rid].stops[t];
    const ICON = { puzzle: "🧩", zoom: "🚀", time: "⏳" }, H = Chrono.heroClock ? Chrono.heroClock.state : { v: 0.6 };
    const firstOpen = id => Math.max(0, TOURS[id].stops.findIndex((x, i) => !P.tourVisited(id).includes(i)));
    /* UX spec §5: five blocks — Continue · Hero · Pick a tour · Four scales · Go deeper. No sidebar on Home. */
    return `
      <div class="docwrap home home2">
        ${running ? `<div class="contcard"><div class="eyebrow">Continue</div>
          <p><b>Tour ${TOUR_NUM[rid]} · stop ${t + 1} of ${TOURS[rid].stops.length}:</b> ${TOURS[rid].stops[t].q} <span class="meta">— ${TOURS[rid].stops[t].where}</span></p>
          <button class="btn primary big" data-go-tour="${t}" data-tour-id="${rid}">▶ Continue the tour</button></div>`
          : lastName ? `<div class="contcard"><div class="eyebrow">Continue</div><p>Where you left off: <b>${lastName}</b></p><a class="btn primary" href="${last}">Continue →</a></div>` : ""}
        ${Chrono.reviewDue && Chrono.reviewDue() ? `<a class="continue revdue" href="#review">🔁 <b>${Chrono.reviewDue()} question${Chrono.reviewDue() > 1 ? "s" : ""} ready</b> · about a minute →</a>` : ""}
        <section class="hero">
          <div class="hero-text">
            <div class="eyebrow">Chronoscope · time, at every scale</div>
            <h1>Two perfect clocks. One is moving. They disagree.</h1>
            <p class="lede">Chronoscope looks at physics through the lens of time, from a single photon to the edge of the universe: more than twenty live simulations running the real equations, and every claim tagged by how sure physicists are.</p>
            <button class="btn ${running || lastName ? "ghost" : "primary"} big" data-go-tour="${P.tourVisited("puzzle").length ? firstOpen("puzzle") : 0}" data-tour-id="puzzle">▶ ${P.tourVisited("puzzle").length ? "Continue" : "Start"} Tour 1: The puzzle of time</button>
            <p class="hook meta">Why is there only one time dimension? Nobody knows for sure — Tour 1 takes you to the edge of that question.</p>
          </div>
          <div class="hero-sim">
            <canvas id="hero-cv" aria-label="Two light clocks, one at rest and one moving"></canvas>
            <label class="hero-ctl"><b>Drag me</b> · speed of the moving clock <input type="range" id="hero-v" min="0" max="99" value="${Math.round(H.v * 100)}"><output id="hero-vo">${H.v.toFixed(2)} c</output></label>
            <p class="meta">Special relativity, an ideal light clock — the same code as <a href="#clocks">Clock Lab</a>. ${Chrono.info ? Chrono.info("dilation") : ""}</p>
          </div>
        </section>
        <h2 class="sect">Pick a tour</h2>
        <div class="tourpick3">${["puzzle", "zoom", "time"].map(id => { const T = TOURS[id], n = T.stops.length, vis = P.tourVisited(id), on = t !== null && rid === id, done = P.tourDone(id);
          return `<button class="tp tp-${id}" data-go-tour="${on ? t : firstOpen(id)}" data-tour-id="${id}">
            <span class="tp-icon" aria-hidden="true">${ICON[id]}</span>
            <span class="tp-body"><span class="tp-num">Tour ${TOUR_NUM[id]}${done ? ' <em class="tp-done">✓ done</em>' : ""}</span><span class="tp-name">${T.name}</span><span class="tp-blurb">${T.blurb}</span>
              <span class="tp-meta">${n} stops · about 20 minutes · ${on ? `on stop ${t + 1} — continue` : vis.length ? `${vis.length} of ${n} visited` : "not started"}</span>
              <span class="tp-prog"><i style="width:${Math.round(vis.length / n * 100)}%"></i></span></span></button>`; }).join("")}</div>
        <details class="allstops"><summary>See every stop</summary><div class="allstops-grid">${["puzzle", "zoom", "time"].map(id => `<div><div class="eyebrow">Tour ${TOUR_NUM[id]} · ${TOURS[id].name}</div><ol>${TOURS[id].stops.map((x, i) => `<li><button class="linkish" data-go-tour="${i}" data-tour-id="${id}">${P.tourVisited(id).includes(i) ? "✓ " : ""}${x.q}</button> <span class="meta">${x.where}</span></li>`).join("")}</ol></div>`).join("")}</div></details>
        <h2 class="sect">Four scales of time</h2>
        <div class="scales">${SCALES.map(s => `<div class="scale" style="--sc:${s.col}"><div class="eyebrow">${s.sub}</div><h3>${s.name} ${Chrono.info ? Chrono.info("sc-" + s.id) : ""}</h3>
          <div class="labchips">${s.labs.map(([v, n]) => `<a href="#${v}" class="${P.seen(v) ? "seen" : ""}">${P.seen(v) ? "✓ " : ""}${n}</a>`).join("")}</div></div>`).join("")}</div>
        <h2 class="sect">Go deeper</h2>
        <div class="deeper">
          <a class="dcard" href="#story"><b>📖 How it all fits together</b><span>The big picture in eight illustrated panels.</span></a>
          <a class="dcard" href="#atlas"><b>🗺 The Atlas</b><span>${Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h))).length} open problems about time, and a century of attempts to fill them.</span></a>
          <a class="dcard" href="#sure"><b>⚖ How sure are we?</b><span>How a claim earns the label 'established'.</span></a>
          ${lab ? `<a class="dcard d-lab" href="#ideas"><b>◌ The Workbench</b><span>This project's own exploratory ideas and your hypotheses. Not mainstream physics.</span></a>` : ""}
        </div>
        <p class="meta">You've explored ${seen} of ${TOTAL.length} sections. Every claim is tagged by how sure physicists are — the Guide menu explains the tags. Progress is kept in this browser only.</p>
      </div>`;
  }
  /* The hero light clock: drawn by Clock Lab's own code on its own canvas; paused off-screen; still under reduced motion. */
  let heroRaf = 0, heroVis = true;
  function runHero() {
    cancelAnimationFrame(heroRaf);
    const cv = $("#hero-cv"); if (!cv || !Chrono.heroClock || !Chrono.lab.drawOn) return;
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.IntersectionObserver) new IntersectionObserver(es => { heroVis = es[0].isIntersecting; }).observe(cv);
    let last = 0;
    const loop = ts => {
      if (!document.body.contains(cv)) return;
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
      if (heroVis) { if (!still) Chrono.heroClock.tick(dt); Chrono.lab.drawOn(cv, g => Chrono.heroClock.draw(g)); }
      if (!still) heroRaf = requestAnimationFrame(loop);
    };
    heroRaf = requestAnimationFrame(loop);
    const r = $("#hero-v"); if (r) r.oninput = e => { const H = Chrono.heroClock.state; H.v = e.target.value / 100; H.T = 0; H.trail = []; $("#hero-vo").textContent = H.v.toFixed(2) + " c"; if (still) Chrono.lab.drawOn(cv, g => Chrono.heroClock.draw(g)); };
  }


  Chrono.lab.register({
    id: "home", kind: "doc", title: "How this works", eyebrow: "About", tier: "none",
    page,
    wire() {
      document.querySelectorAll("[data-go-tour]").forEach(b => b.onclick = () => startTour(+b.dataset.goTour, b.dataset.tourId));
      runHero();
    },
    aside: () => `
      <p>Everything here is labelled by how sure physicists are — you'll see these tags on every page.</p>
      <p><b>Learn</b> mode (the default) shows physics as physicists hold and debate it, plus published ideas from the fringe — every claim tagged.${Chrono.maxLevel >= 3 ? ` <b>◌ Workbench</b> mode adds: this project's own exploratory ideas, your hypotheses and the Dimension Map. Switch top right.` : ""}</p>
      ${Chrono.tierLegend()}
      <p class="meta">Press <b>?</b> any time for the Guide. Every view has its own link — share the address bar.</p>`
  });
})();
