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
    { id: "quantum", name: "Quantum", sub: "The very small", col: "var(--quantum)", labs: [["delayed", "Delayed choice"], ["frozen", "The frozen universe"]] },
    { id: "voyages", name: "Voyages", sub: "People and spacecraft", col: "var(--voyages)", labs: [["missions", "Mission clocks"], ["mars", "Talking to Mars"], ["voyage", "The 1 g voyage"], ["energy", "Earth's energy budget"]] },
    { id: "labs", name: "Physics", sub: "The laws underneath", col: "var(--physics)", labs: [["flatland", "Flatland"], ["field", "Field Ocean"], ["clocks", "Clock Lab"], ["spacetime", "Spacetime"], ["river", "River"], ["hawking", "Black holes evaporate"], ["entropy", "Entropy box"], ["films", "Two Films"], ["wormhole", "Wormholes"], ["loops", "Time loops"]] },
    { id: "cosmos", name: "Cosmos", sub: "The universe as a whole", col: "var(--cosmos)", labs: [["timeline", "Cosmic timeline"], ["stars", "Stars forge the elements"], ["expand", "Expanding universe"], ["horizons", "Cosmic horizons"], ["boot", "Boot a Universe"], ["janus", "The Janus point"]] }
  ];
  Chrono.scaleOf = id => (SCALES.find(s => s.labs.some(l => l[0] === id)) || {}).id || "";   // which scale a lab belongs to (its stage glow colour)
  /* Threads: [view key, label, scale] — scale V (voyages), P (physics), C (cosmos), A (atlas). */
  const THREADS = [
    { id: "clock", icon: "⏱", name: "Clocks disagree", stops: [["frozen", "A clock in a frozen universe", "Q"], ["missions", "Mission clocks", "V"], ["clocks", "Clock Lab", "P"], ["spacetime", "Twin paradox", "P"], ["river", "Clocks near a black hole", "P"], ["expand", "Cosmic clocks (redshift)", "C"]] },
    { id: "now", icon: "◬", name: "Light and 'now'", stops: [["delayed", "Delayed choice", "Q"], ["mars", "Talking to Mars", "V"], ["spacetime", "Whose 'now'?", "P"], ["flatland/7", "Time as a slice", "P"], ["films", "Two Films", "P"], ["horizons", "Cosmic horizons", "C"]] },
    { id: "arrow", icon: "→", name: "The arrow of time", stops: [["entropy", "Entropy box", "P"], ["stars", "Stars forge the elements", "C"], ["energy", "Earth's energy budget", "V"], ["hawking", "Black holes evaporate", "P"], ["timeline", "Cosmic timeline", "C"], ["janus", "The Janus point", "C"], ["atlas/H3", "Hole H3: why the arrow?", "A"]] },
    { id: "dims", icon: "◇", name: "Why 3 + 1?", stops: [["flatland/4", "A 4D visitor", "P"], ["films", "Two Films", "P"], ["boot", "Boot a Universe", "C"], ["atlas/H5", "Hole H5: why one time?", "A"]] }
  ];
  const SCALE_NAME = { Q: "Quantum", V: "Voyages", P: "Physics", C: "Cosmos", A: "Atlas" };
  const TOTAL = ["atlas", "bench", "concepts", "review", "story", ...SCALES.flatMap(s => s.labs.map(l => l[0])), "sure"];
  Chrono.SCALES = SCALES; Chrono.TOTAL = TOTAL;                // the passport and the header bar count against the same list

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
    /* Back after 14+ days mid-tour: offer the takeaways of the stops already visited (UX spec §Resume). */
    const recap = id => { const at = P.lastAt(), done = P.tourVisited(id).slice().sort((a, b) => a - b).filter(i => TOURS[id].stops[i] && TOURS[id].stops[i].takeaway);
      return at && Date.now() - at > 14 * 864e5 && done.length ? `<details class="recap"><summary>It's been a while — quick recap first?</summary><ol>${done.map(i => `<li><b>${TOURS[id].stops[i].where}</b> — ${TOURS[id].stops[i].takeaway}</li>`).join("")}</ol></details>` : ""; };
    /* UX spec §5: five blocks — Continue · Hero · Pick a tour · Four scales · Go deeper. No sidebar on Home. */
    return `
      <div class="docwrap home home2">
        ${running ? `<div class="contcard"><button class="cc-x" data-cc-x="tour" title="Leave the tour. Stops you've visited stay recorded; resume any time from the Tours menu.">Not now ×</button><div class="eyebrow">Continue</div>
          <p><b>Tour ${TOUR_NUM[rid]} · stop ${t + 1} of ${TOURS[rid].stops.length}:</b> ${TOURS[rid].stops[t].q} <span class="meta">— ${TOURS[rid].stops[t].where}</span></p>
          ${recap(rid)}
          <button class="btn primary big" data-go-tour="${t}" data-tour-id="${rid}">▶ Continue the tour</button></div>`
          : lastName ? `<div class="contcard"><button class="cc-x" data-cc-x="last" title="Hide this">Not now ×</button><div class="eyebrow">Continue</div><p>Where you left off: <b>${lastName}</b></p><a class="btn primary" href="${last}">Continue →</a></div>` : ""}
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
          <a class="dcard" href="#story"><b>📖 How it all fits together</b><span>The big picture in eight illustrated panels.</span><canvas class="dcv" data-dcv="story" aria-hidden="true"></canvas></a>
          <a class="dcard" href="#atlas"><b>🗺 The Atlas</b><span>${Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h))).length} open problems about time, and a century of attempts to fill them.</span><canvas class="dcv" data-dcv="atlas" aria-hidden="true"></canvas></a>
          <a class="dcard" href="#sure"><b>⚖ How sure are we?</b><span>How a claim earns the label 'established'.</span><canvas class="dcv" data-dcv="sure" aria-hidden="true"></canvas></a>
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

  /* "Go deeper" tiles: a small moving picture of what's behind each link — decoration, not a simulation. Same loop
     rules as the hero: paused off-screen, stopped once Home is left, one still frame under reduced motion. */
  const TAUd = Math.PI * 2;
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const pr = (k => () => (k = (k * 16807) % 2147483647) / 2147483647)(7);
  const ATT = Array.from({ length: 18 }, (_, i) => ({ x: pr(), y: pr(), col: i % 4, to: [Math.floor(pr() * 10), Math.floor(pr() * 10)] }));
  const DEEP = {
    story(c, w, h, t) {                                    // three panels light up in turn: cause → effect
      const C = Chrono.C, gap = 18, pw = (w - 2 * gap - 16) / 3, on = Math.floor(t / 3) % 3;
      for (let i = 0; i < 3; i++) {
        const x = 8 + i * (pw + gap), y = 10, ph = h - 20, act = i === on, cx = x + pw / 2, cy = y + ph / 2, u = t * 2.2;
        rr(c, x, y, pw, ph, 8); c.fillStyle = act ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)"; c.fill();
        if (act) { c.strokeStyle = "rgba(124,196,255,0.45)"; c.lineWidth = 1; c.stroke(); }
        c.globalAlpha = act ? 1 : 0.45;
        if (i === 0) { const s = ph * 0.26, q = (u % 2), yy = q < 1 ? cy + s - q * 2 * s : cy - s + (q - 1) * 2 * s;   // a light clock
          c.fillStyle = C.muted; c.fillRect(cx - 14, cy - s - 3, 28, 2); c.fillRect(cx - 14, cy + s + 1, 28, 2);
          c.fillStyle = C.amber; c.beginPath(); c.arc(cx, yy, 3.5, 0, TAUd); c.fill(); }
        else if (i === 1) { for (let k = 0; k < 3; k++) { const r = ((t * 0.6 + k / 3) % 1) * ph * 0.45;   // a spreading ripple
          c.strokeStyle = `rgba(155,140,255,${1 - r / (ph * 0.45)})`; c.beginPath(); c.arc(cx, cy, r, 0, TAUd); c.stroke(); } }
        else { const f = (t * 0.25) % 1;                  // a gas spreading out
          for (let k = 0; k < 14; k++) { const a = k * 2.39996, d = (4 + 12 * (k % 4)) * (0.25 + 0.75 * f);
            c.fillStyle = C.teal; c.beginPath(); c.arc(cx - pw * 0.25 + Math.cos(a) * d + f * pw * 0.25, cy + Math.sin(a) * d * 0.7, 2, 0, TAUd); c.fill(); } }
        c.globalAlpha = 1;
        if (i < 2) { c.fillStyle = C.muted; c.font = "12px Inter, sans-serif"; c.textAlign = "center"; c.fillText("→", x + pw + gap / 2, cy + 4); }
      }
    },
    atlas(c, w, h, t, awake) {                                    // ten holes, attempts below, pulses along the links
      const C = Chrono.C, cols = [C.teal, "#5ee0e6", C.pink, C.violet], nx = i => 16 + i * (w - 32) / 9, ny = 18;
      const ax = a => 20 + a.x * (w - 40), ay = a => 42 + a.y * (h - 54);
      c.lineWidth = 1;
      ATT.forEach(a => a.to.forEach(j => { c.strokeStyle = "rgba(255,255,255,0.07)"; c.beginPath(); c.moveTo(ax(a), ay(a)); c.lineTo(nx(j), ny); c.stroke(); }));
      for (let k = 0; k < (awake ? 3 : 1); k++) {          // one pulse at rest, three when the card is hovered
        const n = Math.floor(t / 0.9) + k * 7, a = ATT[n % ATT.length], j = a.to[n % 2], f = ((t / 0.9) % 1);
        const x = ax(a) + (nx(j) - ax(a)) * f, y = ay(a) + (ny - ay(a)) * f;
        c.fillStyle = cols[a.col]; c.shadowColor = cols[a.col]; c.shadowBlur = 8; c.beginPath(); c.arc(x, y, 2.2, 0, TAUd); c.fill(); c.shadowBlur = 0;
      }
      ATT.forEach(a => { c.fillStyle = cols[a.col]; c.globalAlpha = 0.8; c.beginPath(); c.arc(ax(a), ay(a), 2.4, 0, TAUd); c.fill(); c.globalAlpha = 1; });
      for (let i = 0; i < 10; i++) { const g = 0.55 + 0.45 * Math.sin(t * 1.6 + i);
        c.strokeStyle = `rgba(124,196,255,${0.35 + 0.4 * g})`; c.lineWidth = 1.5; c.beginPath(); c.arc(nx(i), ny, 5.5, 0, TAUd); c.stroke(); c.lineWidth = 1; }
    },
    sure(c, w, h, t) {                                     // evidence drops into one pan until the claim tips to 'established'
      const C = Chrono.C, P = 7, q = t % P, n = Math.min(8, Math.floor(q / 0.55)), tilt = -0.14 * Math.min(1, n / 8), k = h / 84;   // drawn to the strip's height
      const px = w / 2, py = 16 * k, L = Math.min(w * 0.3, 110), ends = [-1, 1].map(s => [px + s * L * Math.cos(tilt), py + s * L * Math.sin(tilt)]);
      c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(...ends[0]); c.lineTo(...ends[1]); c.stroke(); c.lineWidth = 1;
      c.fillStyle = C.muted; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 6, h - 8); c.lineTo(px + 6, h - 8); c.closePath(); c.fill();
      ends.forEach(([x, y], s) => { const by = y + 26 * k; c.strokeStyle = "rgba(255,255,255,0.25)"; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 16, by); c.moveTo(x, y); c.lineTo(x + 16, by); c.stroke();
        c.strokeStyle = C.muted; c.beginPath(); c.arc(x, by, 18 * k, 0.15, Math.PI - 0.15); c.stroke();
        if (s === 0) for (let j = 0; j < n; j++) { c.fillStyle = C.teal; c.beginPath(); c.arc(x - 10 + (j % 4) * 6.5, by + 6 * k - Math.floor(j / 4) * 5, 2.4, 0, TAUd); c.fill(); } });
      if (n < 8) { const f = (q % 0.55) / 0.55, [x, y] = ends[0]; c.fillStyle = C.teal; c.globalAlpha = 1 - f * 0.3; c.beginPath(); c.arc(x, 4 + f * (y + 26 * k - 4), 2.4, 0, TAUd); c.fill(); c.globalAlpha = 1; }
      else { c.globalAlpha = Math.min(1, (q - 8 * 0.55) / 0.6); c.fillStyle = C.teal; c.font = "600 10px 'JetBrains Mono', monospace"; c.textAlign = "left"; c.fillText("ESTABLISHED", ends[0][0] + 26 * k, Math.min(h - 6, ends[0][1] + 30 * k)); c.globalAlpha = 1; }
    }
  };
  let deepRaf = 0;
  function runDeeper() {
    cancelAnimationFrame(deepRaf);
    const cvs = [...document.querySelectorAll("canvas[data-dcv]")]; if (!cvs.length) return;
    /* Calm at rest (a third of the speed, 60% bright) so the text leads; a card wakes up when hovered or focused. */
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, vis = new Map(cvs.map(cv => [cv, true]));
    const clock = new Map(cvs.map(cv => [cv, 0])), awake = cv => cv.parentElement.matches(":hover, :focus-visible");
    let last = 0;
    if (window.IntersectionObserver) { const io = new IntersectionObserver(es => es.forEach(e => vis.set(e.target, e.isIntersecting))); cvs.forEach(cv => io.observe(cv)); }
    const frame = now => {
      if (!document.body.contains(cvs[0])) return;
      const dt = Math.min(0.05, Math.max(0, now - (last || now)) / 1000), dpr = window.devicePixelRatio || 1; last = now;
      cvs.forEach(cv => { if (!vis.get(cv)) return; const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
        const on = awake(cv), t = still ? 5.2 : clock.get(cv) + dt * (on ? 1 : 0.35); clock.set(cv, t);
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        const c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
        c.globalAlpha = 1; DEEP[cv.dataset.dcv](c, w, h, t, on); cv.style.opacity = on || still ? 1 : 0.6; });
      if (!still) deepRaf = requestAnimationFrame(frame);
    };
    deepRaf = requestAnimationFrame(frame);
  }

  Chrono.lab.register({
    id: "home", kind: "doc", title: "How this works", eyebrow: "About", tier: "none",
    page,
    wire() {
      document.querySelectorAll("[data-go-tour]").forEach(b => b.onclick = () => startTour(+b.dataset.goTour, b.dataset.tourId));
      runHero(); runDeeper();
      document.querySelectorAll("[data-cc-x]").forEach(b => b.onclick = () => { if (b.dataset.ccX === "tour") P.setTour(null); P.clearLast(); Chrono.tour.renderBar(); $("#doc").innerHTML = page(); this.wire(); });
    },
    aside: () => `
      <p>Everything here is labelled by how sure physicists are — you'll see these tags on every page.</p>
      <p><b>Learn</b> mode (the default) shows physics as physicists hold and debate it, plus published ideas from the fringe — every claim tagged.${Chrono.maxLevel >= 3 ? ` <b>◌ Workbench</b> mode adds: this project's own exploratory ideas, your hypotheses and the Dimension Map. Switch in the Guide menu.` : ""}</p>
      ${Chrono.tierLegend()}
      <p class="meta">Press <b>?</b> any time for the Guide. Every view has its own link — share the address bar.</p>`
  });
})();
