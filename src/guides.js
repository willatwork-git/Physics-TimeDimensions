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
      ["", "Twin paradox"],
      ["Speed, Distance", "The traveller's speed and how far away the star is."],
      ["Pause / Play", "The dots move along both paths together; the right panel shows each twin's clock."]
    ],
    river: [
      ["Click anywhere", "Fires a flash of light in every direction from that spot."],
      ["Fire outward from 3 distances", "Sends light straight out from well outside, just outside and inside the horizon."],
      ["Hover", "Shows how fast space flows there and how fast a clock held still would tick."],
      ["◌ Turbulent-river overlay", "Lab mode only: this project's illustrative idea — no equations behind it."]
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
      ["The galaxy slider, or drag in the left view", "Picks a galaxy by its distance today. The right panel says when its light left, how stretched it arrives, and whether a signal could ever reach it."],
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
      "Every moving clock runs slow — not because it's broken, but because time itself does."],
    spacetime: ["A map of events: space runs across, time runs up. Observers moving past each other slice this map into moments differently — here you can see how.",
      "'At the same time' depends on who's asking — but cause and effect never swap places."],
    river: ["Near a black hole, time and space behave strangely. This lab uses one exact way to picture it: space itself flowing inward like a river.",
      "Gravity slows clocks too — and at the horizon, not even light can swim against the current."],
    entropy: ["A box of gas, all on one side. Remove the wall and it spreads out. The question: why does it never gather itself back?",
      "Time's arrow comes from the odds, not the laws of motion — and from a universe that started out ordered."],
    films: ["In our universe, if you knew everything about this moment, the laws would fix what happens next. This lab asks: would that still work with two time directions?",
      "The frame was accurate. It just wasn't enough data: with two times, the present can't fix the future. In our universe, it can."],
    missions: ["Clocks in space don't keep the same time as clocks on the ground. This lab works out by how much, for real missions.",
      "Speed slows clocks and height speeds them up — GPS corrects for both, every day."],
    mars: ["Earth and Mars on their orbits, with a radio link between them. How long does a conversation take — and what does 'now' mean on Mars?",
      "Everything you see from far away is already old news — and there is no shared 'now' across the solar system."],
    voyage: ["A spaceship that keeps accelerating for the whole trip. How far could its crew get in a lifetime — by their own clocks?",
      "You can't beat light — but your own clock can make the trip short."],
    expand: ["A patch of the universe, full of galaxies. Run time forward and watch the distances between them grow — then ask where the centre is.",
      "Everything is moving apart from everything else — and no galaxy is the centre."],
    horizons: ["Light takes time to reach us, and space keeps stretching while it travels. Together they give the universe two edges: how far we can see, and how far we can ever reach.",
      "There are two edges: how far we can see, and how far we can ever reach — and galaxies are slipping beyond the second all the time."],
    boot: ["Could a universe have four space dimensions, or two times? Boot one and see what breaks.",
      "Other dimension counts break orbits, atoms or prediction — which is why we find ourselves in 3 + 1, though nobody has shown it had to be."],
    janus: ["A swarm of stars under gravity, started from one special moment and run both forwards and backwards in time.",
      "From one special moment, structure can grow both ways — so time might have an arrow on both sides of the Big Bang (contested)."],
    "flatland/7": [null, "In the block picture, nothing moves — only our slice through it does. That's why 'now' is a puzzle."]
  };
  Chrono.introFor = key => TEXT[key] && TEXT[key][0] ? `<p class="intro">${TEXT[key][0]}</p>` : "";
  Chrono.rememberFor = key => TEXT[key] && TEXT[key][1] ? `<p class="remember"><b>Remember</b>${TEXT[key][1]}</p>` : "";

  Chrono.guideFor = key => {
    const g = G[key]; if (!g) return "";
    return `<details class="guide" open><summary>The controls</summary><dl>${g.map(([k, v]) => k ? `<dt>${k}</dt><dd>${v}</dd>` : `<dt class="gsub">${v}</dt>`).join("")}</dl></details>`;
  };
})();
