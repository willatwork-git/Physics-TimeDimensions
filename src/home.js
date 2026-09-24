/* Chronoscope — Home (the hook and three doors) and the guided tour.
   The tour is a list of stops; each is an existing view plus the question it answers. A bar above the
   stage carries the question and Previous / Next. Add a stop by adding one object to TOUR. */
(function () {
  const $ = s => document.querySelector(s);
  const P = Chrono.progress;

  /* Stops 4–5 will move to the Spacetime diagram and Entropy box when those labs exist (learner-review, Phase C). */
  const TOUR = [
    { href: "#clocks", q: "Do clocks agree?", say: "Two perfect clocks, one moving. Push the speed up and count the ticks." },
    { href: "#river", q: "Does gravity change time too?", say: "Near a black hole, space flows inward. Hover close to the horizon and read the clock rate." },
    { href: "#flatland/2", q: "What would an extra dimension look like from inside?", say: "A sphere visits a flat world. Its inhabitant only ever sees one slice of it." },
    { href: "#flatland/7", q: "So what is 'now'?", say: "Stack every moment into one block. 'Now' becomes a slice — and nothing in the block says which one." },
    { href: "#atlas/H3", q: "Why does time only run one way?", say: "The laws barely care about direction. Read where physicists think the arrow comes from — and who has tried to explain it." },
    { href: "#films", q: "Why only one time direction?", say: "Give a universe two time directions and see what happens to predicting the future." },
    { href: "#atlas/H5", q: "So is one time dimension a law of nature?", say: "Strong constraints, no settled answer. Here is everyone who has tried — click any of them." }
  ];
  const LABS = [["flatland", "Flatland"], ["field", "Field Ocean"], ["clocks", "Clock Lab"], ["river", "River"], ["films", "Two Films"], ["sure", "How sure are we?"]];
  const TOTAL = ["atlas", "bench", "flatland", "field", "clocks", "river", "films", "sure"];

  /* ---------- tour bar ---------- */
  function startTour(i) { P.setTour(i); Chrono.nav(TOUR[i].href); }
  Chrono.tour = {
    stops: TOUR,
    renderBar() {
      const bar = $("#tourbar"), i = P.tour();
      document.body.classList.toggle("touring", i !== null);
      if (i === null || !TOUR[i]) { bar.style.display = "none"; bar.innerHTML = ""; return; }
      const s = TOUR[i], on = location.hash === s.href, last = i === TOUR.length - 1;
      bar.style.display = "flex";
      bar.innerHTML = on ? `
        <span class="tb-step">Tour · ${i + 1} / ${TOUR.length}</span>
        <span class="tb-q"><b>${s.q}</b> <span class="meta">${s.say}</span></span>
        <span class="tb-btns">
          <button class="btn" data-tb="prev" ${i === 0 ? "disabled" : ""}>←</button>
          <button class="btn primary" data-tb="next">${last ? "Finish the tour ✓" : `Next: ${TOUR[i + 1].q} →`}</button>
          <button class="btn" data-tb="leave" title="Leave the tour (you can resume from Home)">×</button>
        </span>` : `
        <span class="tb-step">Tour paused</span>
        <span class="tb-q meta">You've stepped off the tour route — explore freely.</span>
        <span class="tb-btns"><button class="btn primary" data-tb="resume">Back to stop ${i + 1}: ${s.q}</button>
          <button class="btn" data-tb="leave" title="Leave the tour">×</button></span>`;
      bar.querySelectorAll("[data-tb]").forEach(b => b.onclick = () => {
        const a = b.dataset.tb;
        if (a === "prev") startTour(i - 1);
        else if (a === "next") { if (last) { P.finishTour(); Chrono.nav("#home"); } else startTour(i + 1); }
        else if (a === "resume") Chrono.nav(s.href);
        else if (a === "leave") { P.setTour(null); Chrono.tour.renderBar(); }
      });
    }
  };

  /* ---------- home ---------- */
  function page() {
    const t = P.tour(), done = P.tourDone(), last = P.last();
    const seen = TOTAL.filter(v => P.seen(v)).length;
    const lastName = last && (document.querySelector(`nav button[data-view="${last.slice(1).split("/")[0]}"]`) || {}).textContent;
    const lab = Chrono.mode() === "lab";
    return `
      <div class="docwrap home">
        <div class="eyebrow">Chronoscope · the holes in time</div>
        <h1>Why does our universe have exactly one time dimension?</h1>
        <p class="lede">Nobody has a settled answer. Chronoscope is a place to find out why — and to explore the other places where physics' account of time doesn't add up: what physicists have tried, which ideas survived, and how to tell solid science from speculation. Every simulation runs the real equations.</p>
        ${lastName && t === null ? `<a class="continue" href="${last}">Continue where you left off: <b>${lastName}</b> →</a>` : ""}
        <div class="doors">
          <div class="door d-tour">
            <div class="eyebrow">Start here</div>
            <h2>▶ Take the tour</h2>
            <p>${TOUR.length} stops, about 20 minutes. From <i>"Do clocks agree?"</i> to <i>"Is one time dimension a law of nature?"</i></p>
            <button class="btn primary" data-go-tour="${t !== null ? t : 0}">${t !== null ? `Resume at stop ${t + 1}` : done ? "Take it again" : "Start the tour"}</button>
            ${done && t === null ? `<span class="meta">✓ Completed</span>` : ""}
          </div>
          <a class="door d-map" href="#atlas">
            <div class="eyebrow">Explore</div>
            <h2>🗺 The map of holes</h2>
            <p>${Chrono.HOLES.filter(h => Chrono.shows(Chrono.tierOf(h))).length} open problems about time, and a century of attempts to fill them. Then put every idea on the <b>Test bench</b>.</p>
            <span class="hgo">Open the Atlas →</span>
          </a>
          <div class="door d-labs">
            <div class="eyebrow">Hands on</div>
            <h2>🧪 The labs</h2>
            <p>Simulations running real physics. Drag, slide, predict.</p>
            <div class="labchips">${LABS.map(([v, n]) => `<a href="#${v}" class="${P.seen(v) ? "seen" : ""}">${P.seen(v) ? "✓ " : ""}${n}</a>`).join("")}</div>
          </div>
          ${lab ? `<a class="door d-lab" href="#dims">
            <div class="eyebrow">◌ Lab mode</div>
            <h2>The workbench</h2>
            <p>This project's own challenges to mainstream physics, your hypotheses in the Atlas, and the Dimension Map. Not mainstream physics — here to be tested.</p>
            <span class="hgo">Open the Dimension Map →</span>
          </a>` : ""}
        </div>
        <p class="meta">You've explored ${seen} of ${TOTAL.length} sections. Progress is kept in this browser only.</p>
      </div>`;
  }

  Chrono.lab.register({
    id: "home", kind: "doc", title: "How this works", eyebrow: "About", tier: "none",
    page,
    wire() { document.querySelectorAll("[data-go-tour]").forEach(b => b.onclick = () => startTour(+b.dataset.goTour)); },
    aside: () => `
      <p><b>Learn</b> mode (the default) shows physics as physicists hold and debate it, plus published ideas from the fringe — every claim tagged.${Chrono.maxLevel >= 3 ? ` <b>◌ Lab</b> mode adds this project's own exploratory ideas and your hypotheses. Switch top right.` : ""}</p>
      ${Chrono.tierLegend()}
      <p class="meta">Press <b>?</b> any time for the Guide. Every view has its own link — share the address bar.</p>`
  });
})();
