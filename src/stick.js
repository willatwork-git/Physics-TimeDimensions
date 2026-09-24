/* Chronoscope — making it stick (D-037).
   Per lab: "Picture it" (one everyday analogy, tagged ANALOGY, with where it breaks) and a "Common trap"
   (a belief people arrive with, why it's tempting, what the lab shows instead).
   One question bank, keyed by view. A tour's quiz is its stops' questions. Questions you've met come back
   for review after 1, 3, 7, 16, 35 and 80 days — longer each time you get one right (progress.js). */
(function () {
  const $ = s => document.querySelector(s);
  const P = Chrono.progress;
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;

  /* ---------- Picture it: [analogy, where it breaks] ---------- */
  const PIC = {
    field: ["A plain rope carries a ripple along at full speed. Now tie springs to the rope all along its length: every piece wants to bob in place as well, and the ripple travels more slowly. That bobbing is the particle's internal clock.",
      "There's no rope and no springs. The springs stand for the mass term in the field equation."],
    clocks: ["Everything moves through spacetime at one fixed rate. Spend some of it moving through space, and less is left for moving through time. Light spends all of it on space, so it never ticks at all.",
      "It's a picture of the maths (the spacetime interval), not a mechanism. Nothing is being spent."],
    spacetime: ["Think of spacetime as a loaf of bread. You slice it into moments one way; someone moving past you slices the same loaf at an angle. Both sets of slices are valid.",
      "No one can tilt their slice past light's 45°, which is why cause and effect never swap places. The loaf image is Brian Greene's."],
    river: ["A fish swimming upstream in a river that speeds up towards a waterfall. Past one point the current runs faster than any fish can swim. That point is the horizon.",
      "Space isn't a substance that flows. This is one exact way of drawing the geometry (Gullstrand–Painlevé), and other drawings are just as valid."],
    entropy: ["Shuffle a new deck of cards. It never shuffles back into order. It could, but there are vastly more shuffled orders than ordered ones.",
      "A gas shuffles itself by collisions, and it has far more pieces than a deck, so 'never' really does mean never."],
    films: ["In our universe, 'now' is like a sudoku with exactly one solution for tomorrow. With two time directions, the same starting grid allows many different tomorrows.",
      "A sudoku with many solutions is missing clues. Here even a complete, exact snapshot isn't enough: the equation itself doesn't fix the future."],
    missions: ["A tug of war between two effects. Speed pulls an orbiting clock back; height pushes it forward. In low orbit (the ISS) speed wins. Higher up (GPS) height wins.",
      "Nothing is pulling. The two corrections simply add, and which is bigger depends on the orbit's height."],
    mars: ["Seeing Mars is like reading a letter posted a while ago: it tells you how things were when it was sent, 3 to 21 minutes earlier.",
      "A letter carries a postmark everyone agrees on. Light doesn't: observers moving differently disagree about when it was 'sent'."],
    voyage: ["Picture a dimmer that can only creep towards full brightness. Every push adds the same kick, but the lamp gets ever closer to full without reaching it. What keeps growing without limit is how far you get for each year of your own life.",
      "The kicks aren't wasted. They go into the crew's slower clocks and shorter distances rather than into more speed."],
    expand: ["Dots drawn on a balloon: blow it up and every dot sees every other dot moving away. No dot is the centre.",
      "The universe is the balloon's surface, not its inside, and there's no outside for it to expand into."],
    horizons: ["An ant walks along a rubber band while someone stretches it. If the stretching speeds up, an ant far enough away can never reach the end, however long it walks. That's the event horizon.",
      "With steady stretching the ant does eventually arrive (a famous puzzle). It's the speeding up, from dark energy, that makes the horizon."],
    boot: ["Changing the number of dimensions is like changing the rules of chess. Most variants aren't wrong; they just can't hold a game worth playing: no stable orbits, no atoms, or no way to predict the next move.",
      "The rules of chess were chosen. Nobody knows whether the number of dimensions could have been different at all."],
    janus: ["A crowd in a square at the moment it's most tightly packed. Follow it forwards and it spreads out. Follow it backwards and it also spreads out. The packed moment is a middle, not a beginning.",
      "In the lab, gravity builds clumps as the swarm spreads. The growing structure, in both directions, has no crowd equivalent."],
    delayed: ["A chord in a piece of music. While it's a chord, 'which note is playing?' has no answer. With the second splitter in, you hear the chord; take it out and you hear one note, chosen at random.",
      "A chord is still two definite notes played at once; a photon isn't two particles. Quantum amplitudes have no everyday equivalent."],
    frozen: ["A flip-book is complete and still on the table. Time appears only when you relate one page to the next. Here the pages are the clock readings.",
      "Someone flicks a flip-book from outside. In the Page–Wootters picture there is no outside: the 'flicking' is the correlation between the clock and the rest."],
    wormhole: ["A drawbridge that rises as you drive onto it. The Einstein–Rosen bridge opens and closes again faster than light could cross it.",
      "Nobody raises it: the shape of spacetime itself changes. And black holes formed from collapsing stars have no bridge at all."],
    loops: ["A spiral staircase that brings you back to the same floor, but in time. Far enough from the centre, the rotation tips 'forwards in time' so far over that walking in a circle leads into your own past.",
      "There's no staircase. What tips is the light cones, and only in a universe that rotates, which ours doesn't measurably."],
    hawking: ["A coal that gets hotter as it burns down: the smaller it gets, the fiercer it glows, until it flares out.",
      "Real coals cool as they burn down. A black hole does the opposite because its temperature goes as one over its mass."],
    timeline: ["Squeeze the universe so far into one calendar year. The Big Bang is the first instant of 1 January, the Sun forms in early September, and all of recorded history fits into the last 11 seconds of 31 December.",
      "The calendar only covers the past. The universe's future would fill about 10⁹⁰ more calendar years."],
    energy: ["Swapping a $20 note for twenty $1 coins: the same money, in many more pieces, with far more ways to arrange them. Earth swaps sunlight for infrared the same way.",
      "Money isn't used up by the swap. What goes up here is the number of ways to arrange the photons: entropy."],
    connect: ["A transit map. It doesn't show every street, only how the lines connect and where you can change. It tells you how to get from gravity to the arrow of time.",
      "Real links in physics carry equations and numbers, and some lines on this map are still being surveyed."]
  };

  /* ---------- Common trap: [the belief, why it's tempting, what the lab shows, tag] ---------- */
  const TRAP = {
    field: ["Particles are tiny hard balls.", "That's how they're drawn in school.",
      "In quantum field theory, particles are ripples in fields that fill space. Mass is what makes a ripple tick, and what holds it below light speed.", "ESTABLISHED"],
    clocks: ["Moving clocks run slow because motion jiggles the mechanism.", "Real clocks are machines, and shaking a machine upsets it.",
      "Every kind of clock slows by exactly the same factor: light clocks, atomic clocks, decaying muons, heartbeats. It's time, not the mechanism.", "ESTABLISHED"],
    spacetime: ["Disagreements about 'at the same time' are just light delay: who sees the flash first.", "Signal delay is real, and familiar from thunder and lightning.",
      "Correct exactly for the light's travel time and the disagreement is still there. It's in the geometry of spacetime, not in the signals.", "ESTABLISHED"],
    river: ["You'd feel something dramatic as you crossed a black hole's horizon.", "It's the point of no return, so it sounds like a wall.",
      "For a large black hole nothing local marks the horizon: the current flows smoothly through it. Tides only become violent much deeper in.", "ESTABLISHED"],
    entropy: ["Entropy just means messiness.", "Untidy rooms and broken eggs are the usual examples.",
      "Entropy counts arrangements. Spread out wins because there are vastly more ways to be spread out. Some tidy-looking things, like crystals forming in a cooling liquid, still raise the total.", "ESTABLISHED"],
    films: ["More time dimensions would just mean more freedom: more ways to move.", "More space dimensions do give more room.",
      "The opposite happens: with two times, the present stops fixing the future, and prediction itself fails.", "ESTABLISHED"],
    missions: ["Astronauts come back noticeably younger.", "Films like <i>Interstellar</i> show huge time differences.",
      "Six months on the ISS leaves you about 4.5 thousandths of a second younger: real and measured, but far too small to notice.", "ESTABLISHED"],
    mars: ["We see Mars as it is now.", "Nearby things look instant, and light is very fast.",
      "What you see is 3 to 21 minutes old. What's happening on Mars 'now' can't be observed; it depends on a convention you choose.", "ESTABLISHED"],
    voyage: ["The galaxy's centre is 26,000 light-years away, so it takes at least 26,000 years to get there.", "That's what the light-speed limit seems to say.",
      "26,000 years pass on Earth, but only about 20 years for the crew. The limit is on speed, not on how much of your own life a journey takes.", "ESTABLISHED"],
    expand: ["The Big Bang was an explosion at one point, and galaxies are flying outwards through space.", "'Bang' sounds like an explosion, and explosions have centres.",
      "Every galaxy sees the others moving away. There's no centre and no edge: space itself stretches everywhere.", "ESTABLISHED"],
    horizons: ["Nothing can move away from us faster than light.", "It's the most famous rule in relativity.",
      "Galaxies beyond about 14.5 billion light-years recede faster than light today. Relativity limits motion through space nearby, not the stretching of space.", "ESTABLISHED"],
    boot: ["Physicists have proved the universe must have three space dimensions and one time.", "The failures in other universes look decisive.",
      "Other counts break orbits, atoms or prediction under the kinds of laws we know. That's a strong constraint, not a proof, and whether other kinds of law are possible is open.", "CONTESTED"],
    janus: ["Gravity makes things more disordered over time, like everything else.", "Entropy always rises, and clumping looks like the opposite of spreading out.",
      "With gravity, clumping is the natural direction: a spread-out gas gathers into stars and clusters. Gravity turns the usual 'spread out is likely' rule on its head.", "ESTABLISHED"],
    delayed: ["Choosing late sends a signal back in time and changes the path the photon already took.", "Popular articles often describe it that way.",
      "Nothing travels backwards: the pattern shows only once the records are sorted by what was chosen. What fails is the idea that the photon had a definite path before it was measured.", "ESTABLISHED"],
    frozen: ["If the universe as a whole doesn't change, time must be an illusion.", "'Frozen' sounds like 'nothing happens'.",
      "In this model, time inside is real and measurable: it's a relation between a clock and everything else. Whether our universe works this way is argued over.", "CONTESTED"],
    wormhole: ["Black holes are tunnels to other places.", "Science fiction uses them that way, and the maths does contain a bridge.",
      "The bridge pinches shut before even light can cross, and black holes formed from collapsing stars don't have one at all.", "ESTABLISHED"],
    loops: ["Relativity forbids travelling into the past.", "Everyone knows you can't go faster than light.",
      "Einstein's equations have exact solutions with loops in time, and no faster-than-light travel is needed. Whether nature forbids them (Hawking's 'chronology protection') is still a conjecture.", "ESTABLISHED"],
    hawking: ["Nothing ever comes out of a black hole.", "In classical physics, that's what makes it a black hole.",
      "With quantum theory included, black holes glow faintly and slowly lose mass (Hawking, 1974). It has never been observed, but it follows from two well-tested theories.", "ESTABLISHED"],
    timeline: ["Most of the universe's history is behind us.", "13.8 billion years sounds unimaginably old.",
      "On an ordinary clock the universe has barely begun: stars will keep shining for thousands of times longer than they have so far.", "ESTABLISHED"],
    energy: ["The Sun keeps Earth going by giving it energy.", "We talk about 'using' energy, and solar panels 'collect' it.",
      "Earth sends almost all of that energy back out. What gets used up is low entropy: sunlight arrives as a few hot photons and leaves as many cold ones.", "ESTABLISHED"],
    connect: ["Physics already has one equation that explains everything.", "Headlines about a 'theory of everything' make it sound close.",
      "Each arrow here has its own tested physics, but no single theory joins them all: gravity and quantum theory still disagree about what time is.", "ESTABLISHED"]
  };

  /* ---------- question bank: { q, o: options, a: answer index, why } ---------- */
  const QB = {
    field: { q: "In the Field Ocean, why does the massive ripple lag behind the massless one?", o: ["The field has friction, and heavier ripples feel more of it", "Its mass gives it an internal clock: its energy is shared between ticking and travelling, so it stays below light speed", "It started later"], a: 1,
      why: "The massless ripple spends everything on travelling, so it runs at light speed. The massive one also oscillates in place, and the faster it travels, the slower that internal clock ticks." },
    clocks: { q: "Why does a moving light clock tick more slowly?", o: ["Motion strains the mirrors", "Seen from outside, the light's path is longer, and light's speed is the same for everyone", "The light slows down inside a moving clock"], a: 1,
      why: "The light zig-zags, a longer path at the same speed, so each tick takes longer. Every other kind of clock must keep pace, or you could tell you were moving." },
    spacetime: { q: "Two lamps flash at the same moment for you. For someone moving past, they…", o: ["also flash together, once light delay is corrected for", "flash one after the other, and which comes first depends on the direction they move", "flash together only if the lamps are close to each other"], a: 1,
      why: "Simultaneity is relative for events that can't signal each other. For events that can, cause and effect, everyone agrees on the order." },
    river: { q: "In the river picture, what makes the horizon a point of no return?", o: ["Space flows inward at light speed there, so light aimed outward stands still", "Gravity becomes infinite at the horizon", "The horizon is a surface that absorbs light"], a: 0,
      why: "Outside, outward light still gains ground. At the horizon the inflow equals light speed, and inside it's faster. Nothing sits at the horizon to feel." },
    "flatland/7": { q: "In the 'block' picture of spacetime, what is 'now'?", o: ["A special moment built into the block", "One slice, and nothing in the block marks which slice is 'now'", "The edge where the block is still growing"], a: 1,
      why: "In the block every moment is equally there, and physics has no ingredient that singles one out. That's one of the holes. (A block that grows at its edge is a live alternative: contested philosophy, not physics.)" },
    entropy: { q: "Reversing every velocity exactly makes the gas gather back. Why does a real gas never do this?", o: ["The laws of motion forbid it", "It would need every molecule reversed perfectly; the tiniest nudge sends it back to spreading, and spread-out states vastly outnumber gathered ones", "Heat erases the molecules' memory"], a: 1,
      why: "The laws run both ways. The arrow comes from the odds, and from a universe that started out ordered." },
    films: { q: "In Two Films, why do two universes with identical starting frames end up different?", o: ["The simulation uses random numbers", "With two time directions, even a complete snapshot of 'now' doesn't fix the future", "Rounding errors in the computer"], a: 1,
      why: "Both films are exact solutions of the same equation, identical at the starting frame. With two times, the present doesn't determine what comes next." },
    "atlas/H5": { q: "Is 'one time dimension' known to be a law of nature?", o: ["Yes: Tegmark proved it in 1997", "No: there are strong constraints against other counts, but no settled, model-independent answer", "No: most physicists think there are several"], a: 1,
      why: "Other counts break orbits, atoms or prediction under the laws we know. That makes 3 + 1 special, not proven necessary." },
    missions: { q: "Why do GPS satellite clocks run fast overall, while ISS clocks run slow?", o: ["GPS satellites carry better clocks", "Higher up, gravity's speed-up wins; low and fast (the ISS), speed's slow-down wins", "The ISS is shielded from sunlight"], a: 1,
      why: "GPS: +45.7 µs a day from height and −7.2 from speed, net +38.5. ISS: speed wins, net about −25 µs a day." },
    mars: { q: "Why can't you hold a live conversation with someone on Mars?", o: ["Radio is too weak to reach Mars", "Light takes 3 to 21 minutes each way, depending on where the planets are", "Mars' atmosphere slows radio down"], a: 1,
      why: "A question and its answer take between about 7 minutes and three-quarters of an hour. Nothing, not even a signal, beats light." },
    voyage: { q: "How can a crew reach the galaxy's centre in about 20 years of their own time?", o: ["They pass light speed near the end", "Their clocks slow, and for them the distance shrinks; nothing exceeds light speed", "The centre is only 20 light-years away"], a: 1,
      why: "Earth's clocks record about 26,000 years. The crew's time is short because, as they near light speed, the journey contracts for them." },
    expand: { q: "If every galaxy sees the others moving away, where is the centre of the expansion?", o: ["At the Milky Way", "Where the Big Bang went off", "Nowhere: every point sees the same thing"], a: 2,
      why: "Space stretches everywhere at once. Every observer sees the same pattern, so no place is the centre." },
    horizons: { q: "Why can a signal we send today never reach some galaxies we can see?", o: ["They move through space faster than light", "Expansion is speeding up, carrying them beyond the reach of any light we send now", "Dust blocks the way"], a: 1,
      why: "That's the event horizon, about 16 billion light-years today. We see those galaxies by light they sent long ago; our reply can't catch up." },
    janus: { q: "In the Janus point lab, what happens to structure on either side of the special moment?", o: ["It grows in both directions of time", "It grows one way and decays the other", "It stays the same"], a: 0,
      why: "Gravity builds clumps as the swarm spreads, whichever way you run time. Barbour's proposal that our Big Bang is such a point is contested." },
    boot: { q: "What goes wrong in a universe with two time dimensions?", o: ["Nothing: it just has more history", "The present no longer fixes the future, so nothing can predict", "Everything moves faster than light"], a: 1,
      why: "With two times, the laws lose their power to predict from the present. Four space dimensions fail differently: orbits aren't stable." },
    delayed: { q: "Does the late choice in the delayed-choice experiment change what the photon did in the past?", o: ["Yes: it sends an effect backwards in time", "No: the pattern appears only when results are sorted by the choice, and the photon never had a definite path to change", "Only if a human makes the choice"], a: 1,
      why: "No signal goes back. What fails is picturing the photon as having taken one path before it was measured." },
    frozen: { q: "In the Page–Wootters picture, where does time come from?", o: ["From an outside clock that ticks for the whole universe", "From correlations, entanglement, between a clock and the rest of the universe", "From measurement errors"], a: 1,
      why: "The whole universe sits in one unchanging state; inside it, a clock's readings are paired with the rest. That pairing is what we experience as time passing." },
    wormhole: { q: "Why can't anything travel through the Einstein–Rosen bridge?", o: ["It's too narrow for a spacecraft", "It opens and pinches shut faster than light could cross", "The other universe repels matter"], a: 1,
      why: "Every path that tries to cross ends at the singularity. A wormhole you could cross would need exotic matter with negative energy." },
    loops: { q: "How does Gödel's universe allow a trip into your own past?", o: ["By travelling faster than light", "Its rotation tips light cones over, so far out a slower-than-light circle loops back in time", "Through a black hole"], a: 1,
      why: "It's an exact solution of Einstein's equations. Our universe, though, shows no measurable rotation." },
    "concepts/timetravel": { q: "Which kind of time travel has actually been measured?", o: ["Into the past, with entangled photons", "Into the future: every moving or high-up clock does it", "Neither"], a: 1,
      why: "Into the future: airliner clocks, GPS, astronauts. Into the past: allowed by some exact solutions, never observed, and every known recipe needs something our universe lacks." },
    hawking: { q: "Why does a black hole evaporate faster and faster as it shrinks?", o: ["Nearby stars tear it apart", "Smaller black holes are hotter, so they radiate harder", "Its horizon gets leakier with age"], a: 1,
      why: "Its temperature goes as one over its mass. Losing mass makes it hotter, and a hotter black hole loses mass faster: it ends in a flash." },
    timeline: { q: "On a powers-of-ten timeline from the first instant to the last black hole, where is today?", o: ["Near the very end", "A little under halfway along", "At the very start"], a: 1,
      why: "About 40% of the way along: as many powers of ten lie between the first instant and today as between today and the last black holes. On an ordinary clock we're at the very start." },
    energy: { q: "Earth sends back almost all the energy it absorbs from the Sun. So what does it actually gain?", o: ["Nothing: it's a perfect balance", "Low entropy: sunlight arrives as a few hot photons and leaves as many cold ones", "Mass, from sunlight turning into matter"], a: 1,
      why: "About 20 infrared photons leave for each photon of sunlight absorbed. Everything that builds order on Earth runs on that difference." },
    connect: { q: "Which of these links is still an unsolved problem?", o: ["Gravity slowing clocks", "Gravity and quantum theory's accounts of time", "Expansion stretching light"], a: 1,
      why: "The other two are measured every day, by GPS and by telescopes. Joining gravity with quantum theory is the biggest open gap on the map." }
  };
  const NAME = { "flatland/7": "Flatland · time as a slice", "atlas/H5": "Atlas · hole H5", "concepts/timetravel": "Concept · time travel" };
  const nameOf = k => NAME[k] || ((document.querySelector(`header button[data-view="${k}"]`) || {}).firstChild || {}).textContent || k;

  /* ---------- in each lab's aside, after Remember ---------- */
  Chrono.stickFor = key => {
    if (QB[key]) P.revSeed(key);                          // met the lab → its question joins the review queue
    const pic = PIC[key], trap = TRAP[key];
    return (pic ? `<div class="picture"><b>Picture it</b> ${TG("ANALOGY")}<p>${pic[0]}</p><p class="meta">Where it breaks: ${pic[1]}</p></div>` : "") +
      (trap ? `<details class="trap"><summary><b>Common trap</b><span>${trap[0]}</span></summary>
        <p class="meta">Why it's tempting: ${trap[1]}</p><p>${trap[2]} ${TG(trap[3])}</p></details>` : "");
  };

  /* ---------- quiz and review cards ---------- */
  /* options in a fixed per-question order: the answer's position cycles through the bank, so it isn't always in the same place */
  const KEYS = Object.keys(QB);
  function order(k) {
    const n = QB[k].o.length, at = (KEYS.indexOf(k) * 2 + 1) % n, rest = QB[k].o.map((_, j) => j).filter(j => j !== QB[k].a);
    rest.splice(at, 0, QB[k].a); return rest;
  }
  function card(k, i, pick) {
    const Q = QB[k]; if (!Q) return "";
    const done = pick !== undefined, right = pick === Q.a, href = "#" + k;
    return `<div class="qcard ${done ? (right ? "right" : "wrong") : ""}" data-qk="${k}">
      <div class="eyebrow">${i ? i + " · " : ""}${nameOf(k)}</div><p class="qq">${Q.q}</p>
      <div class="qopts">${order(k).map(j => `<button class="btn ${done && j === Q.a ? "ok" : done && j === pick ? "no" : ""}" data-pick="${j}" ${done ? "disabled" : ""}>${Q.o[j]}</button>`).join("")}</div>
      ${done ? `<p class="qwhy"><b>${right ? "✓ Right." : "Not quite."}</b> ${Q.why} <a href="${href}">See it again →</a></p>` : ""}</div>`;
  }
  const picks = {};                                        // this page's answers, keyed by question
  const TOURQ = id => (Chrono.tourStops ? Chrono.tourStops(id) : []).filter(k => QB[k]);
  const days = ms => Math.max(1, Math.round(ms / 864e5));

  function page(arg) {
    const tours = Chrono.tourList ? Chrono.tourList() : [];
    const T = tours.find(t => t.id === arg);
    if (T) {                                               // a tour's quiz
      const ks = TOURQ(T.id), n = ks.filter(k => picks[k] !== undefined).length, sc = ks.filter(k => picks[k] === QB[k].a).length, best = P.quiz(T.id);
      return `<div class="docwrap quiz">
        <div class="eyebrow">Tour quiz · ${T.name}</div>
        <h1>What stuck?</h1>
        <p class="lede">${P.tourDone(T.id) ? "Tour complete. " : ""}${ks.length} questions, one from each stop: a few minutes. Trying to remember is what makes it stick, so guess before you look back.</p>
        ${best ? `<p class="meta">Your best so far: ${best.best} of ${best.n}.</p>` : ""}
        ${ks.map((k, i) => card(k, i + 1, picks[k])).join("")}
        ${n === ks.length ? `<div class="qscore"><h2>${sc} of ${ks.length}</h2><p>${sc === ks.length ? "Every one. " : ""}These questions come back for review over the coming days, each one waiting longer as you get it right.</p>
          <button class="btn" data-qreset>Take it again</button> <a class="btn primary" href="#home">Back to Home →</a></div>` : ""}
      </div>`;
    }
    const due = P.revDue().filter(k => QB[k]), q = P.revQueue().filter(k => QB[k]);
    const later = q.filter(k => !due.includes(k)).map(k => P.rev(k).due).sort((a, b) => a - b);
    return `<div class="docwrap quiz">
      <div class="eyebrow">Explore · Quizzes and review</div>
      <h1>Review</h1>
      <p class="lede">Questions from the labs you've explored come back after a day, then three, a week, and longer each time you get one right. Miss one and it comes back tomorrow. A minute or two now and then keeps it all fresh.</p>
      ${due.length ? due.map((k, i) => card(k, i + 1, picks[k])).join("") : `<div class="qscore"><h2>${q.length ? "Nothing due" : "Nothing to review yet"}</h2>
        <p>${q.length ? `${q.length} question${q.length > 1 ? "s" : ""} in your queue. The next comes back in ${days(later[0] - Date.now())} day${days(later[0] - Date.now()) > 1 ? "s" : ""}.` : "Explore a lab and answer its prediction; its question joins your queue."}</p></div>`}
      <h2 class="sect">Tour quizzes</h2>
      <div class="qtours">${tours.map(t => { const b = P.quiz(t.id); return `<a class="qtour" href="#review/${t.id}"><span class="tp-name">${t.name}</span><span class="meta">${b ? `Best: ${b.best} of ${b.n}` : P.tourDone(t.id) ? "Not taken yet" : "Take it any time"}</span><span class="hgo">Take the quiz →</span></a>`; }).join("")}</div>
      <p class="meta">Everything is kept in this browser only.</p>
    </div>`;
  }

  let arg = null;
  function render() { $("#doc").innerHTML = page(arg); wire(); }
  function wire() {
    document.querySelectorAll(".qcard [data-pick]").forEach(b => b.onclick = () => {
      const k = b.closest(".qcard").dataset.qk, j = +b.dataset.pick;
      picks[k] = j; P.revAnswer(k, j === QB[k].a);
      const ks = arg && TOURQ(arg);
      if (ks && ks.length && ks.every(x => picks[x] !== undefined)) P.setQuiz(arg, ks.filter(x => picks[x] === QB[x].a).length, ks.length);
      const y = window.scrollY; render(); window.scrollTo(0, y);
    });
    const r = $("[data-qreset]"); if (r) r.onclick = () => { TOURQ(arg).forEach(k => delete picks[k]); render(); window.scrollTo(0, 0); };
  }
  Chrono.lab.register({
    id: "review", kind: "doc", title: "Quizzes and review", eyebrow: "Explore", tier: "none",
    page: () => { arg = Chrono.reviewSel || null; Object.keys(picks).forEach(k => delete picks[k]); return page(arg); },
    wire,
    aside: () => `<p>Two ways to check what stuck:</p>
      <p><b>Tour quizzes</b>: one question per stop, at the end of each tour.</p>
      <p><b>Review</b>: questions from labs you've explored come back after 1, 3, 7, 16, 35 and 80 days. Get one right and it waits longer; miss it and it's back tomorrow.</p>
      <p class="meta">Remembering is a skill of practice, not of reading: trying to recall something is what makes it last (the 'testing effect').</p>`
  });
  Chrono.reviewDue = () => P.revDue().filter(k => QB[k]).length;
})();
