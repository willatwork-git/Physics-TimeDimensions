/* Chronoscope — Home, the guided tours, the three scales and the threads that run through them.
   Tours: lists of stops, each an existing view plus the question it answers. A bar above the stage carries
   the question and Previous / Next. Add a stop by adding one object to a tour's list.
   Scales: Voyages (people and spacecraft) · Physics (the laws underneath) · Cosmos (the universe as a whole).
   Threads: the same question about time followed across the scales; each lab shows the threads it's on. */
(function () {
  const $ = s => document.querySelector(s);
  const P = Chrono.progress;

  /* q = the stop's question · where = shown on Home · see = the Home teaser (no spoilers) · say = the tour-bar instruction */
  const TOURS = {
    puzzle: { name: "The puzzle of time", blurb: "From 'do clocks agree?' to 'is one time dimension a law of nature?'", stops: [
      { href: "#clocks", where: "Clock Lab", q: "Do clocks agree?", see: "Two perfect clocks — and a surprise when one of them moves.", say: "Two perfect clocks, one moving. Push the speed up and count the ticks." },
      { href: "#river", where: "The River", q: "Does gravity change time too?", see: "A black hole drawn as space flowing inward. Can light swim out?", say: "Near a black hole, space flows inward. Hover close to the horizon and read the clock rate." },
      { href: "#spacetime", where: "Spacetime", q: "Is there one 'now' for everyone?", see: "Two lamps flash together — or do they?", say: "Two lamps flash at the same moment for you. Set a speed and see whether they still do for someone moving." },
      { href: "#flatland/7", where: "Flatland", q: "So what is 'now'?", see: "A whole history stacked into one block.", say: "Stack every moment into one block. 'Now' becomes a slice — and nothing in the block says which one." },
      { href: "#entropy", where: "Entropy box", q: "Why does time only run one way?", see: "A gas spreads out. Can you make it gather back?", say: "Remove the partition, let the gas spread, then reverse every velocity. Then try the nudge." },
      { href: "#films", where: "Two Films", q: "Why only one time direction?", see: "Two identical starting frames. Watch what happens next.", say: "Give a universe two time directions and see what happens to predicting the future." },
      { href: "#atlas/H5", where: "The Atlas", q: "So is one time dimension a law of nature?", see: "Everyone who has tried to answer it — and how far they got.", say: "Strong constraints, no settled answer. Here is everyone who has tried — click any of them." }
    ] },
    zoom: { name: "From the ISS to the edge of the universe", blurb: "The same questions about time, zooming out from people to the whole cosmos.", stops: [
      { href: "#missions", where: "Mission clocks", q: "Does space travel make you younger?", see: "Clocks on the ISS, on GPS satellites, on the Moon.", say: "Pick ISS, then GPS, then Moon base. Which effect wins at each?" },
      { href: "#mars", where: "Talking to Mars", q: "What does 'now' mean on Mars?", see: "A question and answer that take the best part of an hour.", say: "Press Farthest, then send a message. Watch it cross the spacetime diagram." },
      { href: "#voyage", where: "The 1 g voyage", q: "How far could you go in a lifetime?", see: "The centre of the galaxy — by your own clock.", say: "Fly to Proxima, then the centre of the galaxy. Watch the two clocks pull apart." },
      { href: "#expand", where: "Expanding universe", q: "Is everything flying away from us?", see: "Stand on any galaxy and look around.", say: "Click a few different galaxies. Then try the presets — and H₀ = 73." },
      { href: "#horizons", where: "Cosmic horizons", q: "How far can we ever see?", see: "46 billion light-years — and a horizon no message can cross.", say: "Drag the galaxy outward. Then switch to ordinary distance and time." },
      { href: "#janus", where: "The Janus point", q: "Where does time's arrow come from?", see: "A swarm of stars run forwards and backwards.", say: "Watch both panels from the Janus point: structure grows both ways." },
      { href: "#boot", where: "Boot a Universe", q: "Why three space dimensions and one time?", see: "Boot other universes and watch them fail.", say: "Boot (4, 1), (2, 1) and (3, 2). Then try Orbits in n dimensions." }
    ] }
  };
  const SCALES = [
    { id: "voyages", name: "Voyages", sub: "People and spacecraft", col: "var(--c-lens)", labs: [["missions", "Mission clocks"], ["mars", "Talking to Mars"], ["voyage", "The 1 g voyage"]] },
    { id: "labs", name: "Physics", sub: "The laws underneath", col: "var(--t-est)", labs: [["flatland", "Flatland"], ["field", "Field Ocean"], ["clocks", "Clock Lab"], ["spacetime", "Spacetime"], ["river", "River"], ["entropy", "Entropy box"], ["films", "Two Films"]] },
    { id: "cosmos", name: "Cosmos", sub: "The universe as a whole", col: "var(--simple, #9b8cff)", labs: [["expand", "Expanding universe"], ["horizons", "Cosmic horizons"], ["boot", "Boot a Universe"], ["janus", "The Janus point"]] }
  ];
  /* Threads: [view key, label, scale] — scale V (voyages), P (physics), C (cosmos), A (atlas). */
  const THREADS = [
    { id: "clock", icon: "⏱", name: "Clocks disagree", stops: [["missions", "Mission clocks", "V"], ["clocks", "Clock Lab", "P"], ["spacetime", "Twin paradox", "P"], ["river", "Clocks near a black hole", "P"], ["expand", "Cosmic clocks (redshift)", "C"]] },
    { id: "now", icon: "◬", name: "Light and 'now'", stops: [["mars", "Talking to Mars", "V"], ["spacetime", "Whose 'now'?", "P"], ["flatland/7", "Time as a slice", "P"], ["films", "Two Films", "P"], ["horizons", "Cosmic horizons", "C"]] },
    { id: "arrow", icon: "→", name: "The arrow of time", stops: [["entropy", "Entropy box", "P"], ["janus", "The Janus point", "C"], ["atlas/H3", "Hole H3: why the arrow?", "A"]] },
    { id: "dims", icon: "◇", name: "Why 3 + 1?", stops: [["flatland/4", "A 4D visitor", "P"], ["films", "Two Films", "P"], ["boot", "Boot a Universe", "C"], ["atlas/H5", "Hole H5: why one time?", "A"]] }
  ];
  const SCALE_NAME = { V: "Voyages", P: "Physics", C: "Cosmos", A: "Atlas" };
  const TOTAL = ["atlas", "bench", ...SCALES.flatMap(s => s.labs.map(l => l[0])), "sure"];

  /* Threads a view belongs to, rendered for its aside. key: "clocks", "flatland/7", … */
  Chrono.threadsFor = key => {
    const on = THREADS.filter(t => t.stops.some(s => s[0] === key));
    if (!on.length) return "";
    return `<div class="threads">${on.map(t => `<div class="thread"><span class="th-name">${t.icon} ${t.name} — at every scale</span>
      <span class="th-stops">${t.stops.map(([k, n, sc]) => k === key ? `<b>${n}</b>` : `<a href="#${k}" title="${SCALE_NAME[sc]}">${n}</a>`).join(" → ")}</span></div>`).join("")}</div>`;
  };

  /* ---------- tour bar ---------- */
  const cur = () => TOURS[P.tourId()] || TOURS.puzzle;
  function startTour(i, id) { P.setTour(i, id); Chrono.nav(TOURS[id].stops[i].href); }
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
          <button class="btn primary" data-tb="next">${last ? "Finish the tour ✓" : `Next: ${S[i + 1].q} →`}</button>
          <button class="btn" data-tb="leave" title="Leave the tour (you can resume from Home)">×</button>
        </span>` : `
        <span class="tb-step">Tour paused</span>
        <span class="tb-q meta">You've stepped off the tour route — explore freely.</span>
        <span class="tb-btns"><button class="btn primary" data-tb="resume">Back to stop ${i + 1}: ${s.q}</button>
          <button class="btn" data-tb="leave" title="Leave the tour">×</button></span>`;
      bar.querySelectorAll("[data-tb]").forEach(b => b.onclick = () => {
        const a = b.dataset.tb;
        if (a === "prev") startTour(i - 1, id);
        else if (a === "next") { if (last) { P.finishTour(); Chrono.nav("#home"); } else startTour(i + 1, id); }
        else if (a === "resume") Chrono.nav(s.href);
        else if (a === "leave") { P.setTour(null); Chrono.tour.renderBar(); }
      });
    }
  };

  /* ---------- home ---------- */
  let tab = null;                                          // which tour the Home card shows
  function tourCard() {
    const running = P.tour(), rid = P.tourId();
    const id = tab || (running !== null ? rid : "puzzle"), T = TOURS[id], mine = running !== null && rid === id, done = P.tourDone(id);
    return `<section class="tourhero">
      <div class="th-tabs">${Object.entries(TOURS).map(([k, t]) => `<button class="${k === id ? "on" : ""}" data-tab="${k}">${k === "puzzle" ? "Tour 1" : "Tour 2"} · ${t.name}${P.tourDone(k) ? " ✓" : ""}</button>`).join("")}</div>
      <div class="th-head">
        <div><div class="eyebrow">Start here · a guided tour</div><h2>${T.name}</h2><p>${T.blurb} Seven stops, about 20 minutes. No physics background needed.</p></div>
        <div class="th-go"><button class="btn primary big" data-go-tour="${mine ? running : 0}" data-tour-id="${id}">${mine ? `▶ Resume at stop ${running + 1}` : done ? "▶ Take it again" : "▶ Start the tour"}</button>
          ${done && !mine ? `<span class="meta">✓ You've completed this tour</span>` : ""}</div>
      </div>
      <ol class="itinerary">${T.stops.map((s, i) => { const st = done && !mine ? "done" : mine && i < running ? "done" : mine && running === i ? "here" : "";
        return `<li class="${st}"><button data-go-tour="${i}" data-tour-id="${id}" title="Go to stop ${i + 1}"><span class="it-dot">${st === "done" ? "✓" : i + 1}</span><span class="it-q">${s.q}</span><span class="it-see">${s.see}</span><span class="it-where">${s.where}</span></button></li>`; }).join("")}</ol>
    </section>`;
  }
  function page() {
    const t = P.tour(), last = P.last(), seen = TOTAL.filter(v => P.seen(v)).length;
    const lb = last && document.querySelector(`nav button[data-view="${last.slice(1).split("/")[0]}"]`), lastName = lb && lb.firstChild.textContent.trim();
    const lab = Chrono.mode() === "lab";
    return `
      <div class="docwrap home">
        <div class="eyebrow">Chronoscope · the holes in time</div>
        <h1>Why does our universe have exactly one time dimension?</h1>
        <p class="lede">Nobody has a settled answer. Chronoscope is a place to find out why — and to explore the other places where physics' account of time doesn't add up: what physicists have tried, which ideas survived, and how to tell solid science from speculation. Every simulation runs the real equations.</p>
        ${lastName && t === null ? `<a class="continue" href="${last}">Continue where you left off: <b>${lastName}</b> →</a>` : ""}
        ${tourCard()}
        <h2 class="sect">Three scales of time</h2>
        <p class="meta">The same questions about time turn up at every scale — from an astronaut's watch to the edge of the universe.</p>
        <div class="scales">${SCALES.map(s => `<div class="scale" style="--sc:${s.col}"><div class="eyebrow">${s.sub}</div><h3>${s.name}</h3>
          <div class="labchips">${s.labs.map(([v, n]) => `<a href="#${v}" class="${P.seen(v) ? "seen" : ""}">${P.seen(v) ? "✓ " : ""}${n}</a>`).join("")}</div></div>`).join("")}</div>
        <div class="threadlist">${THREADS.map(th => `<div class="thread"><span class="th-name">${th.icon} ${th.name}</span><span class="th-stops">${th.stops.map(([k, n, sc]) => `<a href="#${k}"><i>${SCALE_NAME[sc]}</i> ${n}</a>`).join(" → ")}</span></div>`).join("")}</div>
        <div class="doors">
          <a class="door d-map" href="#atlas"><div class="eyebrow">Explore</div><h2>🗺 The map of holes</h2>
            <p>${Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h))).length} open problems about time, and a century of attempts to fill them. Then put every idea on the <b>Test bench</b>.</p><span class="hgo">Open the Atlas →</span></a>
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
    },
    aside: () => `
      <p><b>Learn</b> mode (the default) shows physics as physicists hold and debate it, plus published ideas from the fringe — every claim tagged.${Chrono.maxLevel >= 3 ? ` <b>◌ Lab</b> mode adds this project's own exploratory ideas and your hypotheses. Switch top right.` : ""}</p>
      ${Chrono.tierLegend()}
      <p class="meta">Press <b>?</b> any time for the Guide. Every view has its own link — share the address bar.</p>`
  });
})();
