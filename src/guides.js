/* Chronoscope — "The controls": what every button, slider and drag in each simulation does.
   Shown in the right panel of every lab (even before a prediction — it gives nothing away).
   One entry per lab id (Flatland chapters as "flatland/N"). Each entry: a list of [control, what it does];
   a row with an empty control is a subheading. Keep each line short and concrete. */
(function () {
  const G = {
    field: [
      ["Send a ripple", "Launches a travelling wave in both fields at once — a race between light (top) and a massive particle (bottom)."],
      ["Pluck one spot", "Sets both fields ringing at one point, at rest. The massless ripple splits and flies apart; the massive one stays and vibrates."],
      ["Mass", "How strongly the bottom field couples to the Higgs field. At zero it behaves like light; higher, it travels slower."],
      ["Readouts", "Measured speed of each ripple, and two bars: its motion through space against its motion through time."]
    ],
    clocks: [
      ["", "Light clock"],
      ["Speed of the moving clock", "How fast the right-hand clock moves, as a fraction of light speed. Its light pulse traces a longer, diagonal path."],
      ["Tick counters", "Completed bounces for each clock — compare them."],
      ["", "Clocks in orbit (GPS)"],
      ["Altitude, or Ground / ISS / GPS / Geostationary", "Puts the orbiting clock at any height. Bars: how much faster gravity makes it run, how much slower its speed makes it, and the net, per day."],
      ["Drift figure", "How far a navigation system would wander in a day without the correction."]
    ],
    spacetime: [
      ["", "Whose 'now'?"],
      ["Moving observer's speed", "Tilts the orange clock path and 'now' line. Negative speeds move to the left."],
      ["Drag the events", "Move A, B and C anywhere; the table shows when each happens for each observer."],
      ["Draw it your way / their way", "Redraws the whole diagram from either observer's point of view (a Lorentz transformation)."],
      ["Reset events", "Puts A, B and C back where they started."],
      ["Equal-interval curves", "Curves of equal t² − x² from the origin — the spacetime interval. They're the same for every observer: switch frames and the events slide along them."],
      ["", "Twin paradox"],
      ["Speed, Distance", "The traveller's speed and how far away the star is."],
      ["Pause / Play", "The dots move along both paths together; the right panel shows each twin's clock."],
      ["", "Pole and barn"],
      ["Pole's speed", "How fast the 5-unit pole runs through the 4-unit barn. Below 0.6 c it doesn't fit in either frame."],
      ["Barn's frame / Pole's frame", "Redraws the same history from the barn's or the pole's point of view."],
      ["The strip (right)", "What's where at the white 'now' line: the barn, its doors (pink when shut) and the pole."]
    ],
    hawking: [
      ["Mass buttons", "Start from a black hole with the Sun's mass, the Moon's, a mountain's, or one that would be finishing right now."],
      ["Starting mass", "Any mass from 10⁹ to 10³¹ kg (a logarithmic slider)."],
      ["Through its life, Play its life", "Moves through the black hole's lifetime: it shrinks, heats up and radiates faster. The readouts are for that moment."],
      ["The Page curve (right)", "Entropy of the radiation over the lifetime: Hawking's rising curve against Page's, which turns over at the Page time."]
    ],
    timeline: [
      ["Powers of ten", "Each tick is ten times the one before, from 10⁻⁴⁴ s to 10¹⁰⁸ s."],
      ["Ordinary time", "The universe so far on an ordinary clock: the first 100 million years shrink to a point at the left."],
      ["Earlier / Later, or click an event", "Selects an event: when it happened, how sure we are, and where it falls on a one-year calendar."]
    ],
    energy: [
      ["Earth today, No greenhouse, Snowball Earth", "Presets for how much sunlight is reflected and how much infrared the greenhouse layer absorbs."],
      ["Reflected sunlight (albedo)", "The share of sunlight bounced straight back. More reflection: a colder Earth, radiating fewer photons."],
      ["Greenhouse layer absorbs", "A one-layer atmosphere absorbing this share of the ground's infrared. It warms the surface; what leaves for space stays the same."],
      ["Bars (right)", "Energy, photons and entropy in and out, per square metre."]
    ],
    river: [
      ["Click anywhere", "Fires a flash of light in every direction from that spot."],
      ["Fire outward from 3 distances", "Sends light straight out from well outside, just outside and inside the horizon."],
      ["Hover", "Shows how fast space flows there and how fast a clock held still would tick."],
      ["◌ Turbulent-river overlay", "Workbench mode only: this project's illustrative idea — no equations behind it."]
    ],
    entropy: [
      ["Remove the partition", "Lets the gas spread into the whole box."],
      ["Reverse every velocity", "Lights up after a few seconds. Replays every collision backwards — exactly."],
      ["Nudge one disc, then reverse", "Moves one disc by a millionth of the box first, then reverses."],
      ["Reset", "All discs back in the left half, partition in."],
      ["Reading it", "Disc colour shows where each started. The graph is entropy over time."]
    ],
    films: [
      ["Predict ▶ / Pause", "Plays both films forward from the identical starting frame."],
      ["Back to the starting frame", "Returns both films to t = 0."],
      ["Reveal the hidden time direction", "Shows each film across the second time direction s as a colour map. The white line is the only slice we could observe."],
      ["Difference size ε", "How different Film B is from Film A away from s = 0."],
      ["Readout", "The largest difference between the two films at the moment shown."]
    ],
    missions: [
      ["Mission buttons", "ISS, A Year in Space, Hubble, GPS, Geostationary, Moon base — each sets an altitude and a mission length."],
      ["Altitude", "Any height from 100 km to 500,000 km. The pink dot moves along the net curve."],
      ["Days", "Mission length. The big number is the total the clock gains or loses."],
      ["The chart", "Teal: gravity's effect. Orange: speed's effect. Amber: the net, at every altitude."]
    ],
    mars: [
      ["Send a message to the rover", "Freezes the planets and sends a radio message at light speed; the rover replies as soon as it arrives. Watch it cross both views."],
      ["Move / Pause the planets", "Runs the orbits — Earth laps Mars — changing the distance and the delay."],
      ["Closest / Farthest", "Jumps to the nearest or farthest point in the next two years."],
      ["The spacetime diagram", "Earth on the left, Mars on the right, time running down. Each message is a light ray; the dashed line is mission control's 'now'."]
    ],
    voyage: [
      ["Destination buttons", "From Mars to the Andromeda galaxy."],
      ["Acceleration", "0.1 g to 3 g. At 1 g the crew would feel their normal weight all the way."],
      ["Pause / Fly", "Replays the voyage."],
      ["Reading it", "Left: the ship's path through spacetime (Earth time up, distance across). Right: both clocks, the speed, and the fuel even a perfect rocket would need."]
    ],
    expand: [
      ["Presets", "Our universe, no dark energy, a heavy universe that recollapses, a nearly empty one."],
      ["Matter, Dark energy", "Any mix you like; curvature makes up the difference."],
      ["H₀ = 67.4 / 73", "The two disputed measurements of today's expansion rate. Changes the age."],
      ["Play / Pause", "Runs time forward from the early universe."],
      ["Click a galaxy", "Stand on it. The arrows are recession speeds seen from there."],
      ["The graph", "The size of the universe over time; the pink line is the moment shown on the left."]
    ],
    horizons: [
      ["Light at 45° / Ordinary distance and time", "Two drawings of the same cosmic history."],
      ["A galaxy, today at — the slider, or drag in the left view", "Picks a galaxy by its distance today. The right panel says when its light left, how stretched it arrives, and whether a signal could ever reach it."],
      ["The lines", "Blue: our past light cone — everything we can see. Pink dashed: the event horizon. Orange: when the microwave background was released."]
    ],
    boot: [
      ["", "Boot a universe"],
      ["Click a square", "Boots that universe — space dimensions across, time dimensions up. The log checks time, prediction, gravity, orbits, atoms and matter."],
      ["", "Orbits in n dimensions"],
      ["Space dimensions n", "Gravity weakens as 1/r^(n−1)."],
      ["Nudge the planet", "A small outward push. Stable orbits recover; unstable ones don't."],
      ["Reset orbit", "Back to a circular orbit."]
    ],
    janus: [
      ["Play / Pause", "Runs both directions of time at once."],
      ["From the Janus point", "Restarts both panels at the special moment."],
      ["A new swarm", "A different random swarm — the pattern repeats."],
      ["Reading it", "Left: the swarm run one way (violet) and the other (teal), shape only. Right: size and clumpiness across the whole history; pink dots mark the moment shown."]
    ],
    delayed: [
      ["Second beam splitter: In / Out", "In: the two routes recombine and interfere. Out: each detector sees only one route."],
      ["Decide late, at random", "The choice is made only after each photon has passed the first beam splitter."],
      ["Phase φ, Sweep the phase", "Delays one route relative to the other; with the splitter in, this moves photons between D1 and D2."],
      ["Fire photons, Many photons", "One photon at a time (watch it), or thousands (watch the statistics)."],
      ["Reading it", "Results are sorted by what was chosen. The dots trace the fringe for 'in' runs; the line is the quantum prediction."]
    ],
    frozen: [
      ["Entangled / Not entangled", "Whether each clock reading comes paired with its own spin direction — or not."],
      ["Read the clock at, Step through the readings", "Pick a clock reading; the right panel shows the spin given that reading."],
      ["Spin turns … per clock cycle", "How fast the spin turns relative to the clock."],
      ["Evolve the whole universe one tick", "Advances everything at once and compares with before: does the universe as a whole change?"]
    ],
    wormhole: [
      ["Click in our universe (right)", "Fires a light ray from that point — Inward or Outward."],
      ["The bridge at time V", "Moves the violet 'now' line up the diagram; the right panel shows the bridge's throat at that moment."],
      ["Watch the bridge open and close", "Animates the throat from the white-hole past to its pinch-off."],
      ["Reading it", "Right wedge: our universe. Left: the other one. Top: the black hole; bottom: the white hole. Light always runs at 45°."]
    ],
    loops: [
      ["Your distance from the centre", "In units of the critical radius, where light cones tip over far enough for loops."],
      ["Universe spins once every", "Sets how fast the universe rotates; faster spin brings the loops closer in."],
      ["Walk the circle", "Sends a traveller round your circle — slower than light all the way."],
      ["Reading it", "Left: light-cone slices tipping over as you go outwards. Right: your own light cone and the 'go round with no time passing' arrow."]
    ],
    "flatland/1": [
      ["Look around", "A Square turns his gaze by himself. Untick it to steer with the Gaze slider."],
      ["Gaze", "The direction A Square is looking."],
      ["Drag in the map", "Moves A Square."],
      ["The strip at the bottom", "Everything A Square can see: a single line. Fainter means farther."]
    ],
    "flatland/2": [
      ["Play / Pause", "The Sphere sinks through Flatland."],
      ["Sphere height", "Place the Sphere yourself."],
      ["Drag the 3D view", "Turns it."],
      ["Right-hand views", "Flatland from above, and A Square's single line of sight."]
    ],
    "flatland/3": [
      ["+ dimension / − dimension", "Drags the whole shape in a brand-new direction: point → line → square → cube → tesseract → 5D."],
      ["? buttons (right panel)", "Reveal the counts of corners, edges and faces — predict them first."]
    ],
    "flatland/4": [
      ["Play / Pause", "The 4D ball drifts along the fourth direction, w."],
      ["Position along w", "Place it yourself."],
      ["Drag the left view", "Turns it."],
      ["Right-hand view", "The 3D slice we would actually see."]
    ],
    "flatland/5": [
      ["sphere / ellipsoid / paraboloid / hyperboloid", "Jump to the tilt that gives that shape."],
      ["Tilt of our slice", "Any angle from 0° to 75°."],
      ["Sweep / Pause", "Animates the tilt."],
      ["Right-hand views", "The flat-world version (a 3D cone sliced by a plane) and the pattern linking the two."]
    ],
    "flatland/6": [
      ["Slice it / Shadow", "Two ways to see a tesseract."],
      ["cube-first … corner-first", "Slice mode: how the tesseract is turned as it passes through our world."],
      ["Play / Pause, Depth into our world", "Slice mode: move the tesseract through."],
      ["XY, XW, YW, ZW", "Shadow mode: rotate in those planes (W is the fourth direction)."]
    ],
    "flatland/7": [
      ["Play / Pause", "'Now' sweeps up through Flatland's history."],
      ["\"Now\"", "Place 'now' yourself."],
      ["Drag the 3D view", "Turns it."],
      ["Right-hand view", "What Flatlanders experience at that moment."]
    ]
  };
  /* The words around each lab (text review, D-033): a no-spoiler intro shown before predicting, and one
     sentence to remember at the end. */
  const TEXT = {
    field: ["Physics says particles aren't tiny balls — they're ripples in fields that fill all of space. Here are two fields side by side: one behaves like light, one like a particle with mass.",
      "Mass is what gives a particle an internal clock — and moving fast slows that clock."],
    clocks: ["Two identical clocks, one at rest and one moving. Do they keep the same time? A second mode does the same for real satellites in orbit.",
      "In your frame, a moving clock records less time — and every kind of clock, from light clocks to heartbeats, follows the same rule."],
    spacetime: ["A map of events: space runs across, time runs up. Observers moving past each other slice this map into moments differently — here you can see how. Three scenes (buttons top left): whose 'now', the twin paradox, and the pole and the barn.",
      "'At the same time' depends on who's asking — but cause and effect never swap places."],
    story: ["The labs each show one piece. Here is the whole story in eight panels.",
      "Gravity gathers, stars shine, light carries entropy away, black holes collect it, space stretches — and the clock only runs forward."],
    hawking: ["Black holes aren't quite black: quantum theory says they glow, and shrink. Where does everything that fell in go?",
      "Black holes glow, heat up as they shrink, and vanish, and whether the information inside comes back out is still argued over."],
    timeline: ["All of cosmic time on one line, from the Planck time — where today's physics stops being reliable — to the last black hole evaporating.",
      "On this powers-of-ten chart, today sits about 40% across — a place on the chart, not a share of the universe's life. On an ordinary clock, the story has barely begun. Early on, a smooth universe: all the order since is running down from there."],
    energy: ["Earth takes in sunlight and sends out infrared. The energy balances, so what does Earth actually get from the Sun?",
      "Earth sends back the energy it gets, as twenty times as many photons: what it takes from the Sun is low entropy, and everything here runs on it."],
    river: ["Near a black hole, time and space behave strangely. This lab uses one exact way to picture it: space itself flowing inward like a river.",
      "Gravity slows clocks too — and at the horizon, not even light can swim against the current."],
    entropy: ["A box of gas, all on one side. Remove the wall and it spreads out. The question: why does it never gather itself back?",
      "Time's arrow comes from the odds, not the laws of motion — and from a universe that started out ordered."],
    films: ["In our universe, if you knew everything about this moment, the laws would fix what happens next. This lab asks: would that still work with two time directions?",
      "Complete starting data — every value and every rate of change — didn't fix what this two-time equation does next. With one time it would: a strong constraint on two-time theories, not a proof against them."],
    missions: ["Clocks in space don't keep the same time as clocks on the ground. This lab works out by how much, for real missions.",
      "Speed slows clocks and height speeds them up — GPS corrects for both, every day."],
    mars: ["Earth and Mars on their orbits, with a radio link between them. How long does a conversation take — and what does 'now' mean on Mars?",
      "Everything you see far away is old news. What's happening there 'now' is worked out, not seen — and observers moving differently work it out differently."],
    voyage: ["A spaceship that keeps accelerating for the whole trip. How far could its crew get in a lifetime — by their own clocks?",
      "You can't beat light — but your own clock can make the trip short."],
    expand: ["A patch of the universe, full of galaxies. Run time forward and watch the distances between them grow — then ask where the centre is.",
      "On large scales, distant galaxies recede from every viewpoint — and no galaxy is the centre. Nearby, gravity holds groups of galaxies together."],
    horizons: ["Light takes time to reach us, and space keeps stretching while it travels. Together they give the universe two edges: how far we can see, and how far we can ever reach.",
      "There are two edges: how far we can see, and how far we can ever reach — and galaxies are slipping beyond the second all the time."],
    boot: ["Could a universe have four space dimensions, or two times? Boot one and see what breaks.",
      "Under the laws we know, other dimension counts break stable orbits, atoms or prediction. That makes 3 + 1 special — not proven necessary."],
    janus: ["A swarm of stars under gravity, started from one special moment and run both forwards and backwards in time.",
      "From one special moment, structure can grow both ways — so time might have an arrow on both sides of the Big Bang (contested)."],
    delayed: ["Two routes for a single photon, and a second beam splitter you can put in or take out — even after the photon has set off.",
      "A photon has no definite path until it's measured — and nothing needs to travel back in time for that to be true."],
    frozen: ["A whole universe — a clock and a spin — sitting in one unchanging quantum state. Can anything inside it tell that time is passing?",
      "The whole can be frozen while its parts see time pass: time may be a correlation, not a backdrop (contested)."],
    wormhole: ["The complete solution for a black hole, drawn so light always runs at 45° — including a bridge to a second universe.",
      "The bridge is real mathematics, but it pinches shut too fast for anything to cross — and real black holes don't have one."],
    loops: ["A universe where all the matter rotates. Watch what that does to light cones — and to the past.",
      "Einstein's equations allow time loops in spinning universes — ours isn't one, and nobody knows if nature forbids them."],
    "flatland/7": [null, "In the block picture every moment is equally there, and nothing marks one of them as 'now'. That's why 'now' is a puzzle."]
  };
  Chrono.introFor = key => TEXT[key] && TEXT[key][0] ? `<p class="intro">${TEXT[key][0]}</p>` : "";
  Chrono.rememberText = key => TEXT[key] && TEXT[key][1] || "";
  Chrono.rememberFor = key => TEXT[key] && TEXT[key][1] ? `<p class="remember"><b>Remember</b>${TEXT[key][1]}</p>` : "";

  Chrono.guideRows = key => G[key] || [];                 // raw [control, what it does] rows, for the hint lines under controls
  Chrono.guideFor = key => {
    const g = G[key]; if (!g) return "";
    return `<details class="guide" open><summary>The controls</summary><dl>${g.map(([k, v]) => k ? `<dt>${k}</dt><dd>${v}</dd>` : `<dt class="gsub">${v}</dt>`).join("")}</dl></details>`;
  };
})();
