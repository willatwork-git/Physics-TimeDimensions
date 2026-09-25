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
  Chrono.threadsFor = key => {
    const on = THREADS.filter(t => t.stops.some(s => s[0] === key));
    if (!on.length) return "";
    return `<div class="threads">${on.map(t => `<div class="thread"><span class="th-name">${t.icon} ${t.name} — at every scale ${Chrono.info ? Chrono.info(t.id) : ""}</span>
      <span class="th-stops">${t.stops.map(([k, n, sc]) => k === key ? `<b>${n}</b>` : `<a href="#${k}" title="${SCALE_NAME[sc]}">${n}</a>`).join(" → ")}</span></div>`).join("")}</div>`;
  };

  /* ---------- tour bar ---------- */
  const cur = () => TOURS[P.tourId()] || TOURS.puzzle;
  function startTour(i, id) { P.setTour(i, id); P.visit("tour:" + id); Chrono.nav(TOURS[id].stops[i].href); }
  Chrono.startTour = startTour;
  /* The stop this view is, if a tour is running and we're on its current stop: { tourId, i, stop, next } */
  Chrono.stopFor = () => {
    const i = P.tour(), id = P.tourId(), T = TOURS[id];
    if (i === null || !T || !T.stops[i] || location.hash !== T.stops[i].href) return null;
    return { tourId: id, i, stop: T.stops[i], next: T.stops[i + 1] || null, n: T.stops.length };
  };
  Chrono.tourNext = () => { const i = P.tour(), id = P.tourId(), T = TOURS[id]; if (i === null) return;
    if (i >= T.stops.length - 1) { P.finishTour(); Chrono.nav("#review/" + id); } else startTour(i + 1, id); };
  Chrono.tourList = () => ["puzzle", "zoom", "time"].map(id => ({ id, name: TOURS[id].name }));
  Chrono.tourStops = id => TOURS[id] ? TOURS[id].stops.map(s => s.href.slice(1)) : [];
  Chrono.tour = {
    renderBar() {
      const bar = $("#tourbar"), i = P.tour(), T = cur(), id = P.tourId(), S = T.stops;
      document.body.classList.toggle("touring", i !== null);
      if (i === null || !S[i]) { bar.style.display = "none"; bar.innerHTML = ""; return; }
      const s = S[i], on = location.hash === s.href, last = i === S.length - 1;
      bar.style.display = "flex";
      bar.innerHTML = on ? `
        <span class="tb-step">${T.name} · ${i + 1} / ${S.length}</span>
        <span class="tb-q"><b>${s.q}</b> <span class="meta">${s.say}</span></span>
        <span class="tb-btns">
          <button class="btn" data-tb="prev" ${i === 0 ? "disabled" : ""}>←</button>
          <button class="btn primary" data-tb="next">${last ? "Finish: a quick quiz ✓" : `Next: ${S[i + 1].q} →`}</button>
          <button class="btn" data-tb="leave" title="Leave the tour (you can resume from Home)">×</button>
        </span>` : `
        <span class="tb-step">Tour paused</span>
        <span class="tb-q meta">You've stepped off the tour route — explore freely.</span>
        <span class="tb-btns"><button class="btn primary" data-tb="resume">Back to stop ${i + 1}: ${s.q}</button>
          <button class="btn" data-tb="leave" title="Leave the tour">×</button></span>`;
      bar.querySelectorAll("[data-tb]").forEach(b => b.onclick = () => {
        const a = b.dataset.tb;
        if (a === "prev") startTour(i - 1, id);
        else if (a === "next") Chrono.tourNext();
        else if (a === "resume") Chrono.nav(s.href);
        else if (a === "leave") { P.setTour(null); Chrono.tour.renderBar(); if (Chrono.lab && Chrono.lab.rebuild) Chrono.lab.rebuild(); }   // the lab drops its stop framing
      });
    }
  };

  /* ---------- home ---------- */
  let tab = null;                                          // which tour the Home card shows
  function tourCard() {
    const running = P.tour(), rid = P.tourId();
    const id = tab || (running !== null ? rid : "puzzle"), T = TOURS[id], mine = running !== null && rid === id, done = P.tourDone(id);
    const ICON = { puzzle: "🧩", zoom: "🚀", time: "⏳" }, NUM = { puzzle: "Tour 1", zoom: "Tour 2", time: "Tour 3" };
    return `<section class="tourhero">
      <div class="eyebrow">Start here · three guided tours — pick one</div>
      <div class="tourpick">${["puzzle", "zoom", "time"].map(k => [k, TOURS[k]]).map(([k, t]) => `<button class="tp tp-${k} ${k === id ? "on" : ""}" data-tab="${k}" aria-pressed="${k === id}">
          <span class="tp-icon" aria-hidden="true">${ICON[k]}</span>
          <span class="tp-body"><span class="tp-num">${NUM[k]}${k !== "puzzle" && !P.seen("tour:" + k) ? ' <em class="tp-new">New</em>' : ""}${P.tourDone(k) ? ' <em class="tp-done">✓ done</em>' : ""}</span>
          <span class="tp-name">${t.name}</span><span class="tp-blurb">${t.blurb}</span></span></button>`).join("")}</div>
      <div class="th-head">
        <div><h2>${ICON[id]} ${T.name}</h2><p>${["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"][T.stops.length] || T.stops.length} stops, about ${Math.max(10, Math.round(T.stops.length * 3 / 5) * 5)} minutes. No physics background needed.</p></div>
        <div class="th-go"><button class="btn primary big" data-go-tour="${mine ? running : 0}" data-tour-id="${id}">${mine ? `▶ Resume at stop ${running + 1}` : done ? "▶ Take it again" : "▶ Start the tour"}</button>
          ${done && !mine ? `<span class="meta">✓ You've completed this tour${P.quiz(id) ? ` · quiz best ${P.quiz(id).best} of ${P.quiz(id).n}` : ""} · <a href="#review/${id}">${P.quiz(id) ? "Retake" : "Take"} the quiz →</a></span>` : ""}</div>
      </div>
      <ol class="itinerary">${T.stops.map((s, i) => { const st = done && !mine ? "done" : mine && i < running ? "done" : mine && running === i ? "here" : "";
        return `<li class="${st}"><button data-go-tour="${i}" data-tour-id="${id}" title="Go to stop ${i + 1}"><span class="it-dot">${st === "done" ? "✓" : i + 1}</span><span class="it-q">${s.q}</span><span class="it-see">${s.see}</span><span class="it-where">${s.where}</span></button></li>`; }).join("")}</ol>
    </section>`;
  }
  function page() {
    const t = P.tour(), last = P.last(), seen = TOTAL.filter(v => P.seen(v)).length;
    const lb = last && document.querySelector(`header button[data-view="${last.slice(1).split("/")[0]}"]`), lastName = lb && lb.firstChild.textContent.trim();
    const lab = Chrono.mode() === "lab";
    return `
      <div class="docwrap home">
        <div class="eyebrow">Chronoscope · time, at every scale</div>
        <h1>Two perfect clocks. One is moving. They disagree.</h1>
        <p class="lede">Chronoscope looks at physics through the lens of time, from a single photon to the edge of the universe: more than twenty live simulations running the real equations, and every claim tagged by how sure physicists are.</p>
        <p class="hook">Why is there only one time dimension? Nobody knows for sure. <button class="linkish" data-go-tour="0" data-tour-id="puzzle">Tour 1 takes you to the edge of that question →</button></p>
        ${lastName && t === null ? `<a class="continue" href="${last}">Continue where you left off: <b>${lastName}</b> →</a>` : ""}
        ${Chrono.reviewDue && Chrono.reviewDue() ? `<a class="continue revdue" href="#review">🔁 <b>${Chrono.reviewDue()} question${Chrono.reviewDue() > 1 ? "s" : ""} to review</b> from labs you've explored. A minute or two →</a>` : ""}
        ${tourCard()}
        <h2 class="sect">Four scales of time</h2>
        <p class="meta">The same questions about time turn up at every scale — from an astronaut's watch to the edge of the universe. <a href="#" data-tab-jump="zoom">Take Tour 2, from astronauts to the whole cosmos →</a></p>
        <div class="scales">${SCALES.map(s => `<div class="scale" style="--sc:${s.col}"><div class="eyebrow">${s.sub}</div><h3>${s.name} ${Chrono.info ? Chrono.info("sc-" + s.id) : ""}</h3>
          <div class="labchips">${s.labs.map(([v, n]) => `<a href="#${v}" class="${P.seen(v) ? "seen" : ""}">${P.seen(v) ? "✓ " : ""}${n}</a>`).join("")}</div></div>`).join("")}</div>
        <div class="threadlist">${THREADS.map(th => `<div class="thread"><span class="th-name">${th.icon} ${th.name} ${Chrono.info ? Chrono.info(th.id) : ""}</span><span class="th-stops">${th.stops.map(([k, n, sc]) => `<a href="#${k}"><i>${SCALE_NAME[sc]}</i> ${n}</a>`).join(" → ")}</span></div>`).join("")}</div>
        <div class="doors">
          <a class="door d-map" href="#atlas"><div class="eyebrow">Explore</div><h2>🗺 The map of holes</h2>
            <p>${Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h))).length} open problems about time, and a century of attempts to fill them. Then put every idea on the <b>Test bench</b>.</p><span class="hgo">Open the Atlas →</span></a>
          <a class="door d-map" href="#story"><div class="eyebrow">The big picture</div><h2>📖 How it all fits together</h2>
            <p>The whole story in eight illustrated panels: gravity gathers, stars shine, light carries entropy away, black holes collect it — and the clock only runs forward.</p><span class="hgo">Read the story →</span></a>
          <a class="door d-map" href="#sure"><div class="eyebrow">Method</div><h2>⚖ How sure are we?</h2>
            <p>How a claim earns the label 'established' — worked through on the expanding universe.</p><span class="hgo">Open →</span></a>
          ${lab ? `<a class="door d-lab" href="#dims"><div class="eyebrow">◌ Lab mode</div><h2>The workbench</h2>
            <p>This project's own challenges to mainstream physics, your hypotheses in the Atlas, and the Dimension Map. Not mainstream physics — here to be tested.</p><span class="hgo">Open the Dimension Map →</span></a>` : ""}
        </div>
        <p class="meta">You've explored ${seen} of ${TOTAL.length} sections. Progress is kept in this browser only.</p>
      </div>`;
  }

  Chrono.lab.register({
    id: "home", kind: "doc", title: "How this works", eyebrow: "About", tier: "none",
    page,
    wire() {
      document.querySelectorAll("[data-go-tour]").forEach(b => b.onclick = () => startTour(+b.dataset.goTour, b.dataset.tourId));
      document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; $("#doc").innerHTML = page(); this.wire(); });
      document.querySelectorAll("[data-tab-jump]").forEach(a => a.onclick = e => { e.preventDefault(); tab = a.dataset.tabJump; $("#doc").innerHTML = page(); this.wire(); $(".tourhero").scrollIntoView({ behavior: "smooth", block: "start" }); });
    },
    aside: () => `
      <p>Everything here is labelled by how sure physicists are — you'll see these tags on every page.</p>
      <p><b>Learn</b> mode (the default) shows physics as physicists hold and debate it, plus published ideas from the fringe — every claim tagged.${Chrono.maxLevel >= 3 ? ` <b>◌ Lab</b> mode adds the Workbench: this project's own exploratory ideas, your hypotheses and the Dimension Map. Switch top right.` : ""}</p>
      ${Chrono.tierLegend()}
      <p class="meta">Press <b>?</b> any time for the Guide. Every view has its own link — share the address bar.</p>`
  });
})();
