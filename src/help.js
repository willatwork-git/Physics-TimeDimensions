/* Chronoscope — Guide (help overlay). Opened from the header "? Guide" button or the ? key.
   Not shown by default: first-time visitors get a small dismissible hint instead. */
(function () {
  const $ = s => document.querySelector(s);
  const SECTIONS = [
    { g: "explore", name: "Explore", blurb: "The big picture: where our account of time has gaps, and who has tried to fill them.", items: [
      { v: "atlas", n: "Atlas", d: "The map. Glowing nodes along the top are <b>holes</b> — known gaps in physics' account of time. Dots below are a century of <b>ideas</b> that tried to fill them, placed by year and grouped by approach. Hover a hole to light up every attempt at it; click anything for the detail." },
      { v: "bench", n: "Test bench", d: "Every idea scored against the same hurdles: does it match relativity, keep the future predictable, allow stable matter, explain time's arrow, make a new testable prediction?" },
      { v: "sure", n: "How sure are we?", d: "A worked example — is the universe really expanding? — showing how an idea earns the label 'established'." }
    ] },
    { g: "quantum", name: "Quantum", blurb: "Time at the very smallest scale.", items: [
      { v: "delayed", n: "Delayed choice", d: "Single photons, and a choice made after they set off. Why a photon has no definite path until it's measured." },
      { v: "frozen", n: "The frozen universe", d: "A universe in one unchanging state — and a clock inside it that still sees time pass." }
    ] },
    { g: "voyages", name: "Voyages", blurb: "Time for people who travel — astronauts, rovers, starships.", items: [
      { v: "missions", n: "Mission clocks", d: "How much younger the ISS, a GPS satellite or a Moon base makes you — gravity and speed pulling opposite ways." },
      { v: "mars", n: "Talking to Mars", d: "Radio at light speed takes minutes: a conversation with a rover, drawn as a spacetime diagram." },
      { v: "energy", n: "Earth's energy budget", d: "Earth sends back as much energy as it gets from the Sun, but as about twenty times as many photons. What it really takes in is low entropy: the arrow of time on a planet." },
      { v: "voyage", n: "The 1 g voyage", d: "Accelerate steadily and the galaxy's centre is 20 years away — by the crew's clocks. Plus the honest fuel bill." }
    ] },
    { g: "labs", name: "Physics", blurb: "The laws underneath — hands-on simulations running real equations. Drag, slide and click.", items: [
      { v: "flatland", n: "Flatland", d: "Why extra dimensions are so hard to picture. Seven chapters: a 2D world visited by a sphere, building a tesseract, 4D slices — and time as a slice." },
      { v: "field", n: "Field Ocean", d: "Particles as ripples in a field. Watch a massless ripple race at light speed while a massive one lags — and see why light's clock never ticks." },
      { v: "clocks", n: "Clock Lab", d: "Why moving clocks run slow (the light clock), and the real corrections GPS satellites need every day." },
      { v: "spacetime", n: "Spacetime", d: "Drag events and change your speed: observers disagree about what happens 'at the same time'. Plus the twin paradox, drawn exactly." },
      { v: "hawking", n: "Black holes evaporate", d: "Hawking radiation: black holes glow, heat up as they shrink, and vanish. Plus the Page curve: where the information goes." },
      { v: "river", n: "River", d: "A black hole pictured as space flowing inward. Fire light and see where it can and can't escape." },
      { v: "entropy", n: "Entropy box", d: "A gas spreads out and never gathers back — unless you reverse every velocity exactly. Why time has a direction." },
      { v: "wormhole", n: "Wormholes", d: "Einstein and Rosen's bridge between two universes, drawn exactly — and why nothing can cross it." },
      { v: "loops", n: "Time loops", d: "Gödel's spinning universe, where far enough out a circle leads back into your own past." },
      { v: "films", n: "Two Films", tier: "frontier", d: "If the universe had two time directions, could the present predict the future? Two identical starting frames, two different futures." }
    ] },
    { g: "cosmos", name: "Cosmos", blurb: "The universe as a whole.", items: [
      { v: "expand", n: "Expanding universe", d: "Stand on any galaxy: everything recedes from everywhere. Change matter and dark energy; see the age and fate." },
      { v: "timeline", n: "Cosmic timeline", d: "Everything from the first instant to the last black hole, in powers of ten, each event tagged by how sure we are. Plus the universe so far as a one-year calendar." },
      { v: "horizons", n: "Cosmic horizons", d: "How far we can see (46 billion light-years) and how far our signals can ever reach." },
      { v: "boot", n: "Boot a Universe", d: "Try other numbers of space and time dimensions and watch what breaks — orbits, atoms, prediction." },
      { v: "janus", n: "The Janus point", d: "A gravitating swarm whose structure grows in both directions of time from one special moment." }
    ] },
    { g: "guide", name: "Guide menu (top right)", blurb: "Ways into all of it.", items: [
      { v: "story", n: "How it all fits together", d: "The big picture as a comic strip: the cast (things, doers, and the rules), eight panels of cause and effect, and what we don't know yet. Each panel links to the lab that runs the real equations." },
      { v: "concepts", n: "Concepts", d: "The ideas that run through the whole app — why clocks disagree, what 'now' means, the arrow of time, why 3 + 1 — with the evidence, and every lab that shows each one. Look for ⓘ markers for the short version." },
      { v: "review", n: "Quizzes and review", d: "A short quiz at the end of each tour, and questions from labs you've explored that come back after a day, then three, a week and longer, to check what stuck. Each lab also has a 'Picture it' analogy and a 'Common trap'." }
    ] },
    { g: "work", name: "◌ Workbench (Lab mode)", blurb: "Ideas that aren't mainstream physics yet — to be tested, not believed.", items: [
      { v: "ideas", n: "Exploratory ideas", tier: "exploratory", d: "This project's own challenges to mainstream physics and your hypotheses, in one place, with the tools to add, export and share them." },
      { v: "dims", n: "Dimension Map", tier: "exploratory", d: "A working framework: sort dimensions into groups (space, time, charge, scale, state) and ask each the same questions. Gaps become visible." }
    ] }
  ];

  function html() {
    const secs = SECTIONS.map(s => {
      const items = s.items.filter(i => !i.tier || Chrono.shows(i.tier)).map(i => `
        <button class="hcard" data-go="${i.v}">
          <span class="hname">${i.n}${i.tier === "exploratory" ? ' <span class="tier tier-exp">◌ Exploratory</span>' : i.tier === "frontier" ? ' <span class="tier tier-front">Frontier</span>' : ""}</span>
          <span class="hdesc">${i.d}</span>
          <span class="hgo">Open →</span>
        </button>`).join("");
      if (!items) return "";
      return `<section class="hsec g-${s.g}"><h3><span class="hdot"></span>${s.name}</h3><p class="meta">${s.blurb}</p><div class="hgrid">${items}</div></section>`;
    }).join("");
    return `
      <button class="hclose" id="help-close" aria-label="Close guide">×</button>
      <div class="eyebrow">Guide</div>
      <h2 id="help-title">Chronoscope — time, at every scale</h2>
      <p class="hlead">A free, hands-on guide to time in physics, from a single photon to the edge of the universe. Live simulations run the real equations, and every claim is tagged with how sure physicists are, so you can tell solid science from the frontier — and see <b>where our account of time still doesn't add up</b>.</p>
      ${Chrono.maxLevel >= 3 ? `<section class="hsec"><h3>Two modes: Learn and Lab</h3>
        <p><b>Learn</b> (the default) shows physics as physicists hold and debate it, plus published proposals from the fringe — clearly tagged. The map stays uncluttered and each lab hands you on to the next question.</p>
        <p><b>◌ Lab</b> is the raw workbench. It adds the <b>◌ Workbench</b> menu: this project's own exploratory ideas, which deliberately challenge the mainstream, your own hypotheses, and the Dimension Map. Not mainstream physics — shown to be tested, not believed.</p>
        <p class="meta">Switch any time, top right. You're in <b>${Chrono.mode() === "lab" ? "Lab" : "Learn"}</b> mode.</p>
      </section>` : ""}
      ${secs}
      <section class="hsec"><h3>Mainstream or not? The tags</h3>
        <p class="meta">Every idea is labelled, so you always know what kind of claim you're looking at.</p>
        ${Chrono.tierLegend().replace(/<h3>How to read the tags.*?<\/h3>/, '')}
      </section>
      <section class="hsec"><h3>Tips</h3>
        <ul class="biglist">
          <li>The panel on the right always explains what you're looking at, with a <b>Try:</b> box suggesting something to do.</li>
          <li>Most 3D views can be <b>dragged</b> to turn them.</li>
          <li>Links in the right panel jump between related labs and Atlas holes.</li>
          ${Chrono.shows("exploratory") ? "<li><b>+ Add your hypothesis</b> (in the ◌ Workbench menu, or the Atlas) adds your own idea to the map. Say what it predicts and what would prove it wrong. <b>Export</b> saves your ideas to a file you can share; friends use <b>Import</b>.</li>" : ""}
          <li>Every view has its own link — copy the address bar to share exactly what you're looking at. The browser's Back button works.</li>
          <li>Press <b>?</b> at any time to reopen this guide; <b>Esc</b> closes it.</li>
        </ul>
      </section>
      <p class="caveat">Built by Will (AgilityAI) with Claude. Sources are listed in each panel.${Chrono.CONFIG.edition === "school" ? " School edition: Learn mode only." : ""}</p>`;
  }
  function open() {
    $("#helpbox").innerHTML = html();
    $("#help").style.display = "flex";
    $("#help-close").onclick = close;
    document.querySelectorAll("#helpbox [data-go]").forEach(b => b.onclick = () => { close(); Chrono.goView(b.dataset.go); });
    $("#help-close").focus();
    dismissHint();
  }
  function close() { $("#help").style.display = "none"; }
  function dismissHint() { $("#hint").style.display = "none"; try { localStorage.setItem("chronoscope.hinted", "1"); } catch (e) { } }
  Chrono.openHelp = open;

  $("#help").addEventListener("click", e => { if (e.target.id === "help") close(); });
  document.addEventListener("keydown", e => {
    if (e.target.matches && e.target.matches("input, textarea, select")) return;
    if (e.key === "?") { e.preventDefault(); open(); }
    if (e.key === "Escape") close();
  });
  /* The Home view now orients first-time visitors, so the hint no longer shows automatically (D-026). */
  $("#hint-open").onclick = open;
  $("#hint-x").onclick = dismissHint;
})();
