/* Chronoscope — missions (D-044, UX spec §8): short, checkable goals that turn a lab's "Try:" hints into
   something you can pass. A mission only watches values the lab already computes, via def.state().
   { id, title, hint, check(s) → true when achieved, near(s) → 0…1 how close, hold (ms it must stay true, so
   dragging through the target doesn't count), reveal, tags, show (a setup for "Show me") }.
   Missions are always optional: nothing is locked behind them, there are no points, and wording describes an
   effect to produce — never "correct" or "fail". Progress is kept in this browser (progress.js). */
(function () {
  const $ = s => document.querySelector(s);
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;

  Chrono.MISSIONS = {
    clocks: [
      { id: "third", title: "Make the moving clock tick a third as fast as yours",
        hint: "Light clock mode: drag the speed up and watch γ. You're after γ = 3 — faster than any tour starts you.",
        check: s => s.mode === "light" && Math.abs(s.gamma - 3) < 0.1,
        near: s => s.mode === "light" ? 1 - Math.min(1, Math.abs(s.gamma - 3) / 2) : 0, hold: 1500,
        reveal: "That's about 0.94 of light speed (exactly √8⁄3 ≈ 0.943). In your frame the moving clock ticks once for every three of yours — and so would any clock riding with it. Watch the tick tapes: three teal pips for every yellow one.",
        tags: ["ESTABLISHED"], show: { mode: "light", v: 0.943 } },
      { id: "cancel", title: "In orbit: find the height where the two effects cancel",
        hint: "Switch to Clocks in orbit (GPS). Low orbits run slow (speed wins); high ones run fast (height wins). Somewhere between, the net is zero. The arrow keys move the altitude slider in 10 km steps.",
        check: s => s.mode === "gps" && s.alt >= 100 && Math.abs(s.net) < 1,
        near: s => s.mode === "gps" && s.alt >= 100 ? 1 - Math.min(1, Math.abs(s.net) / 30) : 0, hold: 1000,
        reveal: "About 3,190 km up — half an Earth radius above the ground. There, running faster in weaker gravity exactly cancels running slower from orbital speed. Below it speed wins (the ISS runs slow); above it height wins (GPS runs fast). In this model, which ignores Earth's spin.",
        tags: ["ESTABLISHED"], show: { mode: "gps", alt: 3190 } }
    ],
    river: [
      { id: "edge-out", title: "Get light out from just outside the horizon — within a fifth of its radius",
        hint: "Click just outside the orange ring, closer than a fifth of its radius, and follow the light aimed outward. Be patient: it crawls at first.",
        check: s => s.escMin < 1.2,
        near: s => s.escMin < 1.2 ? 1 : s.climb ? 0.25 + 0.75 * Math.min(1, s.climb - 1) : 0, hold: 200,
        reveal: "It gets out — slowly at first. Just outside the horizon the inflow is almost light speed, so outward light barely gains ground; as it climbs, the current weakens and it gets away. The closer you start, the longer the crawl.",
        tags: ["ESTABLISHED"], show: { fire: 1.12 } },
      { id: "no-way-out", title: "Find where light can't get out at all",
        hint: "Fire a flash from just inside the orange ring and follow the light aimed straight outward.",
        check: s => s.innerFell, near: s => s.innerFell ? 1 : s.innerLive ? 0.5 : 0, hold: 200,
        reveal: "Inside the horizon the flow outruns light, so even light aimed straight out is carried inward. The horizon isn't a wall — it's where the current reaches light speed, and past it every direction leads in.",
        tags: ["ESTABLISHED"], show: { fire: 0.85 } }
    ],
    spacetime: [
      { id: "flip", title: "Make lamp A flash first for the moving observer",
        hint: "Whose 'now'? scene. For you, A and B flash together; at 0.6 c the mover sees B first. Negative speeds move the other way.",
        check: s => s.mode === "now" && s.simul && s.aFirst,
        near: s => s.mode === "now" ? Math.max(0, Math.min(1, (0.6 - s.v) / 0.7)) : 0, hold: 800,
        reveal: "Moving the other way flips the order. Which lamp flashes first depends on who's asking — possible only because no signal could pass between the two flashes. For events that could cause one another, every observer agrees on the order.",
        tags: ["ESTABLISHED"], show: { mode: "now", v: -0.6 } },
      { id: "twins", title: "Send the travelling twin home at least 10 years younger",
        hint: "Twin paradox scene: raise the speed, or send them further. The Earth twin's extra years grow with both.",
        check: s => s.mode === "twins" && s.twinDiff >= 10,
        near: s => s.mode === "twins" ? Math.min(1, s.twinDiff / 10) : 0, hold: 800,
        reveal: "At 0.95 c to a star 8 light-years away, the Earth twin ages about 16.8 years and the traveller about 5.3 — over 11 years apart, permanently. The traveller is the one who turned round.",
        tags: ["ESTABLISHED"], show: { mode: "twins", twinV: 0.95, twinD: 8 } },
      { id: "fit", title: "Find the slowest speed at which the pole just fits in the barn",
        hint: "Pole and barn scene. At 0.8 c it fits easily; slow the pole down until it only just does.",
        check: s => s.mode === "barn" && s.fits && s.pbV <= 0.62,
        near: s => s.mode === "barn" ? (s.fits ? 1 - Math.min(1, (s.pbV - 0.61) / 0.3) : 0.3) : 0, hold: 800,
        reveal: "Just over 0.6 c. There γ = 1.25, so in the barn's frame the 5-unit pole shrinks to 5 ÷ 1.25 = 4 — exactly the barn's length. Any slower and the doors strike the pole, in every frame.",
        tags: ["ESTABLISHED"], show: { mode: "barn", pbV: 0.61 } }
    ],
    entropy: [
      { id: "spread", title: "Let the gas spread until under 60% of it is in the left half",
        hint: "Remove the partition and wait.", check: s => s.open && s.left < 0.6,
        near: s => s.open ? Math.min(1, (1 - s.left) / 0.4) : 0, hold: 300,
        reveal: "Nobody pushed it: there are vastly more ways for the discs to be spread out than bunched up, so that's where the gas goes.",
        tags: ["ESTABLISHED"], show: { open: true } },
      { id: "undo", title: "Run it backwards: get at least 95% of the discs back into the left half",
        hint: "Once the gas has spread (a few seconds), press Reverse every velocity and wait for it to retrace its steps.",
        check: s => !!s.last && !s.last.nudged && s.last.left >= 0.95, near: s => s.open ? 0.4 : 0, hold: 200,
        reveal: "Every disc, back where it started. The laws of motion run just as well backwards — the arithmetic here is exact, so the reversal is perfect.",
        tags: ["ESTABLISHED"], show: { open: true, reverse: "exact" } },
      { id: "nudge", title: "Now nudge one disc by a millionth of the box, then reverse",
        hint: "Once the gas has spread, press Nudge one disc, then reverse.",
        check: s => !!s.last && s.last.nudged, near: s => s.open ? 0.4 : 0, hold: 200,
        reveal: "The gathering fails: collisions amplify a millionth-of-a-box error until only about half the discs make it back. Real gases are never reversed perfectly — that's the arrow of time at work.",
        tags: ["ESTABLISHED"], show: { open: true, reverse: "nudge" } }
    ],
    voyage: [
      { id: "andromeda", title: "Reach the Andromeda galaxy within a 40-year working life of ship time",
        hint: "Andromeda is 2.5 million light-years away. Pick it and read the ship's clock.",
        check: s => s.dest === "andromeda" && s.tau <= 40, near: s => s.dest === "andromeda" ? 1 : 0.3, hold: 400,
        reveal: "About 29 years of ship time at 1 g — while 2.5 million years pass on Earth. Nothing passes light speed; the crew's clocks just run very slow.",
        tags: ["ESTABLISHED"], show: { dest: "andromeda", gs: 1 } },
      { id: "proxima", title: "Reach Proxima Centauri in under 3 years of ship time",
        hint: "At 1 g it takes about 3.5 ship-years. Push harder.",
        check: s => s.dest === "proxima" && s.tau < 3,
        near: s => s.dest === "proxima" ? Math.max(0, Math.min(1, (4.5 - s.tau) / 1.5)) : 0, hold: 600,
        reveal: "It takes about 1.3 g or more. Pushing 50% harder (1.5 g) trims the trip by only about a fifth, from 3.5 to 2.8 years — and the crew would feel one and a half times their weight the whole way.",
        tags: ["ESTABLISHED"], show: { dest: "proxima", gs: 1.5 } },
      { id: "gentle", title: "Reach Andromeda within 40 ship-years on the gentlest push you can",
        hint: "Pick Andromeda and ease the acceleration down while the ship's clock stays at 40 years or under.",
        check: s => s.dest === "andromeda" && s.tau <= 40 && s.gs <= 0.7,
        near: s => s.dest === "andromeda" && s.tau <= 40 ? Math.max(0, Math.min(1, (1.2 - s.gs) / 0.5)) : 0, hold: 800,
        reveal: "About 0.7 g — 39.9 years of ship time. Ease off to 0.65 g and it's 42.7. The fuel, even for a perfect photon rocket, is the part nobody can supply.",
        tags: ["ESTABLISHED"], show: { dest: "andromeda", gs: 0.7 } }
    ],
    mars: [
      { id: "closest", title: "Find when Mars is closest — the shortest delay",
        hint: "Let the planets run, or press Closest. Watch the one-way delay.",
        check: s => s.near < 0.01, near: s => Math.max(0, 1 - s.near * 1.5), hold: 400,
        reveal: "About 4.4 minutes each way in this model, when Earth passes Mars. (Real orbits are elliptical, so actual closest approaches give about 3 to 6 minutes.)",
        tags: ["ESTABLISHED"], show: { near: true } },
      { id: "reply", title: "Get the rover's answer back in under 10 minutes",
        hint: "Send a message when Mars is near — then wait for the reply to arrive.",
        check: s => s.answered && s.roundTrip < 10, near: s => s.answered ? 0.5 : Math.max(0, 1 - s.near * 1.5) * 0.8, hold: 300,
        reveal: "Only near closest approach does a question and answer take under 10 minutes. At the far side of the Sun it's about three-quarters of an hour — and around conjunction the Sun's glare disrupts the signal, so missions pause commands for about two weeks.",
        tags: ["ESTABLISHED"], show: { near: true, send: true } }
    ],
    missions: [
      { id: "older", title: "Come home a whole millisecond older than your twin — in 30 days or less",
        hint: "Speed makes an orbiting clock slow; height makes it fast. Go high enough that height wins by a lot, then set the days.",
        check: s => s.days <= 30 && s.total >= 1000,
        near: s => s.total > 0 ? Math.min(1, s.total / 1000) * (s.days <= 30 ? 1 : 0.7) : 0, hold: 800,
        reveal: "It takes an orbit above about 13,000 km, where clocks gain more than 33 microseconds a day. GPS satellites, at 20,200 km, gain 38.5 µs a day — about 1.2 ms a month — which is why their clocks are set slightly slow before launch. The Moon base gains a little more. Low orbits like the ISS always come home younger.",
        tags: ["ESTABLISHED"], show: { alt: 20200, days: 30 } },
      { id: "younger", title: "Come home 20 thousandths of a second younger than your twin",
        hint: "Stay low, where speed wins, and stay a long time. The Days slider goes up to 1,000.",
        check: s => s.total <= -20000,
        near: s => s.total < 0 ? Math.min(1, -s.total / 20000) : 0, hold: 800,
        reveal: "At ISS height you lose about 25 microseconds a day, so it takes over 800 days — more than two years in orbit, which only a handful of people have spent in space across all their missions. Even then the difference is a fiftieth of a second: real (clocks on aircraft and satellites confirm the effect), and far too small to feel.",
        tags: ["ESTABLISHED"], show: { alt: 408, days: 900 } }
    ],
    expand: [
      { id: "tension", title: "The Hubble tension: with H₀ = 73, get the universe's age back to 13.8 billion years",
        hint: "Press H₀ = 73 and the age drops. Then change how much matter there is: less matter braked the expansion less in the past, so the universe comes out older.",
        check: s => s.H0 === 73 && s.age !== null && Math.abs(s.age - 13.8) < 0.15,
        near: s => s.age === null ? 0 : (s.H0 === 73 ? 1 : 0.3) * (1 - Math.min(1, Math.abs(s.age - 13.8) / 2)), hold: 1000,
        reveal: "It takes about 0.23 in matter — but the microwave background and galaxy surveys measure 0.315, very precisely. That's the tension in miniature: the faster expansion rate measured from nearby supernovae (73) doesn't fit the rest of the picture unless the model is missing something or a measurement has an unrecognised error. Nobody knows which yet.",
        tags: ["CONTESTED"], show: { H0: 73, m: 0.23, l: 0.77 } },
      { id: "crunch", title: "Make a universe that falls back in a Big Crunch — even with some dark energy (at least 0.10)",
        hint: "Dark energy pushes apart; matter pulls back. Keep a little dark energy and load up the matter. Watch the fate.",
        check: s => s.l >= 0.1 && /recollapses/.test(s.fate),
        near: s => s.l >= 0.1 ? 0.9 * Math.min(1, s.m / 3) : 0.2, hold: 800,
        reveal: "With about three times the critical density in matter, gravity wins before dark energy takes over: this universe stops expanding and falls back in on itself. Dark energy's push doesn't thin out as space grows, so any universe that keeps expanding long enough ends up accelerating. Ours passed that point several billion years ago.",
        tags: ["ESTABLISHED"], show: { m: 3, l: 0.1 } }
    ],
    horizons: [
      { id: "reach", title: "Find the farthest galaxy a message sent today could ever reach",
        hint: "Drag the galaxy (or use the slider) and watch the line “A message we send today will…”. Find the last distance where it still arrives.",
        check: s => s.chi === Math.floor(s.horizon),
        near: s => 1 - Math.min(1, Math.abs(s.chi - s.horizon) / 15), hold: 800,
        reveal: "About 16 billion light-years today — the event horizon. Anything farther is out of reach forever, even though we still see many of those galaxies: their old light is still arriving. About 95% of the observable universe's volume already lies beyond it.",
        tags: ["ESTABLISHED"], show: { chi: 16 } },
      { id: "early", title: "Find a galaxy whose light left it in the universe's first billion years",
        hint: "Move the galaxy farther out. The panel says when its light set out.",
        check: s => s.tE !== null && s.tE < 1,
        near: s => Math.min(1, s.chi / 27), hold: 800,
        reveal: "From about 27 billion light-years out (today's distance). That light has travelled nearly 13 billion years and arrives stretched about seven-fold, so what left as visible light arrives as infrared. That's why the James Webb Space Telescope observes in the infrared: the youngest galaxies can only be seen that way.",
        tags: ["ESTABLISHED"], show: { chi: 30 } }
    ],
    boot: [
      { id: "time", title: "Boot a universe that fails because of time, not space",
        hint: "Rows are time dimensions. Pick a row other than 1, and let the log run to the end.",
        check: s => s.mode === "boot" && s.m !== 1 && s.read,
        near: s => s.mode === "boot" && s.m !== 1 ? 0.7 : 0, hold: 300,
        reveal: "With no time, nothing evolves. With two or more, a complete snapshot of 'now' no longer fixes the future, and matter becomes unstable. Either way: no predictable world, no observers. Only one time dimension lets the present predict the future. (Some speculative theories, like two-time physics, try to recover a 3 + 1 world from more.)",
        tags: ["ESTABLISHED", "CONTESTED"], show: { boot: [3, 2] } },
      { id: "orbit", title: "Keep a planet in orbit with more than 3.8 space dimensions",
        hint: "Switch to Orbits in n dimensions and slide n up. Don't nudge: near 4, even a small push is too much.",
        check: s => s.mode === "orbit" && s.on > 3.8 && !s.dead && s.t >= 30,
        near: s => s.mode === "orbit" ? Math.max(0, Math.min(1, (s.on - 3) / 0.8)) * Math.min(1, s.t / 30) : 0, hold: 300,
        reveal: "It survives just below 4 — but only just: the orbit sits on a knife-edge, and any wobble grows instead of dying away. At 4 space dimensions and above no orbit is stable at all, and neither is an atom. (Fractional dimensions are a mathematical dial here, not a physical world.)",
        tags: ["ESTABLISHED"], show: { on: 3.9 } }
    ],
    hawking: [
      { id: "warm", title: "Find the heaviest black hole that is shrinking today",
        hint: "A black hole only shrinks if it's hotter than the 2.7 K glow of the Big Bang around it. Lower the starting mass until the warning disappears — and stop there.",
        check: s => s.T > 2.725 && s.M0 >= Math.pow(10, 22.55),
        near: s => 1 - Math.min(1, Math.abs(Math.log10(s.M0) - 22.6) / 8), hold: 800,
        reveal: "About 4 × 10²² kg — half the Moon's mass, squeezed into a black hole less than a tenth of a millimetre across. Anything heavier is colder than the background glow, so today it absorbs more than it emits, and grows. Every black hole ever observed is far heavier, so none of them is evaporating yet.",
        tags: ["ESTABLISHED"], show: { M0: Math.pow(10, 22.6) } },
      { id: "page", title: "Play a black hole's life past its Page time",
        hint: "Press Play its life, or drag Through its life, and watch the entropy chart.",
        check: s => s.f >= s.page,
        near: s => Math.min(1, s.f / s.page), hold: 300,
        reveal: "About 65% of the way through its life, the black hole has lost half its entropy. If information escapes at all, it must start coming out around here: the radiation's entropy has to turn down and follow the black hole's to zero. That turn is the Page curve. How the information gets out is still being worked out.",
        tags: ["CONTESTED"], show: { play: true } }
    ],
    stars: [
      { id: "year", title: "Run the star to its first stage that lasts less than a year",
        hint: "Inside a star: step the Stage slider, or play the countdown, and watch how long each stage lasts.",
        check: s => s.scene === "star" && s.stage === 3,
        near: s => s.scene === "star" ? Math.min(1, s.stage / 3) : 0, hold: 600,
        reveal: "Neon burning: under a year, after carbon's 500-odd years. Oxygen then lasts months and silicon about two days. The hotter the core, the faster it burns, and much of the energy leaves as neutrinos that pass straight out of the star.",
        tags: ["ESTABLISHED"], show: { scene: "star", s: 3, play: false } },
      { id: "gold", title: "Find the earliest time there was any gold",
        hint: "Switch to Where the elements came from, select gold (Au), and step Cosmic time back until it goes dark.",
        check: s => s.scene === "table" && s.step === 2,
        near: s => s.scene === "table" ? 1 - Math.min(1, Math.abs(s.step - 2) / 3) : 0, hold: 800,
        reveal: "About half a billion years in, once the first neutron stars had time to collide. The exact timing is uncertain: some astronomers think rare exploding stars made heavy elements even earlier.",
        tags: ["CONTESTED"], show: { scene: "table", step: 2, sel: 79 } },
      { id: "iron", title: "Find the smallest star that makes iron in its core",
        hint: "Where the elements came from: move Star size up from our Sun until iron (Fe) lights up.",
        check: s => s.scene === "table" && s.star === 12,
        near: s => s.scene === "table" && s.star ? Math.min(1, s.star / 12) : 0, hold: 800,
        reveal: "About ten times the Sun's mass (12 is the first size on this slider that gets there). Smaller stars stop at oxygen, or at neon and magnesium, and end as white dwarfs. Our Sun will never make iron: every iron atom in your blood came from a star at least ten times heavier, or from an exploding white dwarf. Where exactly the line falls, between 8 and 10 Suns, is still being refined.",
        tags: ["ESTABLISHED", "CONTESTED"], show: { scene: "table", star: 5, sel: 26 } }
    ],
    energy: [
      { id: "freeze", title: "With today's greenhouse, make Earth icy enough to average 0 °C",
        hint: "Keep the greenhouse at 78% and raise the reflected sunlight: ice and cloud send light straight back to space.",
        check: s => Math.abs(s.eps - 0.78) < 0.005 && Math.abs(s.Tc) < 1,
        near: s => 1 - Math.min(1, Math.abs(s.Tc) / 15), hold: 800,
        reveal: "Reflecting about 43% of sunlight instead of 30% is enough. That's why ice is a feedback: more ice reflects more light, which cools the planet, which makes more ice. Push further (the Snowball Earth preset) and no greenhouse in this one-layer model can thaw it: even absorbing 100%, the average stays near −10 °C. Earth did escape its real snowball episodes, after millions of years of volcanic CO₂ — beyond what this simple model captures.",
        tags: ["ESTABLISHED"], show: { A: 0.43, eps: 0.78 } },
      { id: "warm", title: "Turn up the greenhouse until Earth averages 20 °C",
        hint: "Keep reflected sunlight at 30% and raise how much the greenhouse layer absorbs.",
        check: s => Math.abs(s.A - 0.3) < 0.005 && s.Tc >= 19.5 && s.Tc <= 20.6,
        near: s => 1 - Math.min(1, Math.abs(s.Tc - 20) / 10), hold: 800,
        reveal: "About 86% absorbed instead of 78% — roughly 0.6 °C of warming for each extra percent, in this one-layer model. The real climate responds through many layers and feedbacks (water vapour, ice, clouds), which is what full climate models add.",
        tags: ["ESTABLISHED"], show: { A: 0.3, eps: 0.86 } }
    ],
    field: [
      { id: "slow", title: "Make the massive ripple travel at under 60% of light speed",
        hint: "Send a ripple, then raise the mass. The top lane is massless and always moves at light speed; compare the bottom one against it.",
        check: s => s.mode === "travel" && s.ratio < 0.6,
        near: s => s.mode === "travel" ? Math.max(0, Math.min(1, (1 - s.ratio) / 0.4)) : 0, hold: 1500,
        reveal: "It takes a mass of about 0.34 here. Mass — coupling to the Higgs field — makes a ripple of the same wavelength travel slower. A massive ripple can move at any speed below light's; only a massless one is locked to light speed.",
        tags: ["ESTABLISHED"], show: { mode: "travel", m: 0.36 } },
      { id: "still", title: "Pluck a massless field — can the ripple stay where you put it?",
        hint: "Choose Pluck one spot and slide the mass all the way to zero. Watch the bottom lane.",
        check: s => s.mode === "rest" && s.m === 0,
        near: s => (s.mode === "rest" ? 0.5 : 0) + (s.m === 0 ? 0.4 : 0), hold: 2500,
        reveal: "No: with zero mass the ripple splits in two and races off both ways at light speed. A massless ripple can never be at rest — which is why light is never still. Give it mass and it stays put, vibrating in place: a particle at rest.",
        tags: ["ESTABLISHED"], show: { mode: "rest", m: 0 } }
    ],
    wormhole: [
      { id: "inward", title: "Fire a light ray inward and see where it ends",
        hint: "Choose Inward, then click anywhere in the right-hand region — our universe, outside the black hole.",
        check: s => s.sing,
        near: () => 0, hold: 300,
        reveal: "At the singularity — every inward ray does, from anywhere. None reaches the other universe on the left: to cross, it would have to travel faster than light. That's the bridge's verdict, even for light itself.",
        tags: ["ESTABLISHED"], show: { fire: [1.2, 0, -1] } },
      { id: "pinch", title: "Move the slice to where the bridge has pinched to half its widest",
        hint: "Drag The bridge at time V away from zero, either way. The throat is widest at V = 0.",
        check: s => Math.abs(s.throat - 0.5) < 0.03,
        near: s => 1 - Math.min(1, Math.abs(s.throat - 0.5) / 0.5), hold: 800,
        reveal: "At about V = ±0.91. The bridge opens from nothing, widens to one horizon radius and pinches shut again — all faster than light could cross it. An ordinary black hole is not a usable wormhole; keeping one open would need exotic matter with negative energy, which is speculative.",
        tags: ["ESTABLISHED", "SPECULATIVE"], show: { V: 0.91 } }
    ],
    loops: [
      { id: "loop", title: "Walk a circle that brings you back to the moment you set out",
        hint: "Move out past the dashed critical radius, then press Walk the circle.",
        check: s => s.loop && s.walked,
        near: s => s.loop ? 0.6 : Math.min(0.5, s.rr), hold: 500,
        reveal: "Beyond the critical radius the universe's rotation tips light cones so far that a circle, walked slower than light all the way, closes in time: you arrive at the moment you left, a little older. A closed timelike curve, in an exact solution of Einstein's equations.",
        tags: ["ESTABLISHED"], show: { rr: 1.06, walking: true, walk: 0 } },
      { id: "spin", title: "Spin the universe fast enough that time loops begin within a billion light-years",
        hint: "Lower the rotation period and watch where time loops begin.",
        check: s => s.Rc <= 1,
        near: s => 1 - Math.min(1, (s.Rc - 1) / 20), hold: 800,
        reveal: "A spin of once every 5 billion years or faster. Our universe shows no measurable rotation — the microwave background rules it out to high precision — so Gödel's loops are real mathematics, but not our world.",
        tags: ["ESTABLISHED", "CONTESTED"], show: { P: 5 } }
    ],
    films: [
      { id: "diverge", title: "Run the films until they differ, then reveal the hidden time direction",
        hint: "Press Predict and let it run. When the two films clearly differ, reveal what made them different.",
        check: s => s.t >= 4 && s.reveal,
        near: s => Math.min(1, s.t / 4) * (s.reveal ? 1 : 0.6), hold: 500,
        reveal: "Both films are exact solutions and started from an identical frame — yet they separated. With two times, 'now' is only a line through a plane of time, and it leaves out what the hidden direction is doing. The frame was accurate; it just wasn't enough data. That's why physics with two times can't predict.",
        tags: ["ESTABLISHED"], show: { play: true, reveal: true } }
    ],
    delayed: [
      { id: "dark", title: "With the second splitter in, make every photon land in detector 2",
        hint: "Choose In, then turn the phase φ. Watch where the photons go.",
        check: s => s.pIn < 0.02 && s.inD2 >= 10,
        near: s => 1 - s.pIn, hold: 1500,
        reveal: "Near φ = π the two routes interfere so that every photon reaches detector 2 — impossible if each photon had simply taken one route, which would send half to each. Take the second splitter out and it's 50 : 50 again, at any phase.",
        tags: ["ESTABLISHED"], show: { mode: "in", phi: Math.PI, sweep: false, run: true, fast: true } },
      { id: "fringe", title: "Build the whole interference fringe",
        hint: "With the splitter in (or deciding late), sweep the phase and fire many photons until every phase has counts.",
        check: s => s.filled >= 1,
        near: s => s.filled, hold: 300,
        reveal: "Detector 1's share rises and falls as cos²(φ⁄2), from all to none and back — built one photon at a time, and the same whether the splitter was put in early or late. The late choice doesn't reach back and change a path: there is no definite path until a measurement defines one. What that means is still argued over.",
        tags: ["ESTABLISHED", "CONTESTED"], show: { mode: "in", sweep: true, run: true, fast: true } }
    ],
    frozen: [
      { id: "opposite", title: "Stop the clock at the reading where the spin points the opposite way from reading 0",
        hint: "Pause the readings (or drag the clock slider), and look for the spin pointing down.",
        check: s => s.ent && !s.play && Math.abs(s.cos + 1) < 1e-6,
        near: s => s.ent ? (1 - s.cos) / 2 * (s.play ? 0.6 : 1) : 0, hold: 800,
        reveal: "Nothing in the universe changed: you only chose which clock reading to look at. At that reading the spin points the other way. The spin's 'turning' is a correlation between clock and spin, inside one unchanging state — the Page–Wootters idea of time seen from within.",
        tags: ["ESTABLISHED", "CONTESTED"], show: { play: false, f: 1, k: 6 } },
      { id: "unfreeze", title: "Break the entanglement, then evolve the whole universe one tick",
        hint: "Choose Not entangled, then press Evolve the whole universe one tick.",
        check: s => !s.ent && s.overlap !== null && s.overlap < 0.999,
        near: s => s.ent ? 0 : 0.5, hold: 300,
        reveal: "Now the whole changes when time is applied to it — and inside, the spin no longer changes as the clock ticks. Entanglement is what lets a frozen whole have a changing inside. That the same holds for our universe is a serious proposal, not a settled fact.",
        tags: ["ESTABLISHED", "CONTESTED"], show: { ent: false, evolve: true } }
    ]
  };

  let run = null;                                           // { lab, m, held, done }
  const next = id => (Chrono.MISSIONS[id] || []).find(m => !Chrono.progress.missionDone(id, m.id));
  const pick = {};                                          // lab → mission chosen from the circles (replay or jump ahead); cleared on completion
  /* One circle per mission, at the right of the card's header: hollow = not done, filled ✓ = done, ringed = the
     current one. Each is a button, so any mission can be picked or replayed. */
  function dots(def, cur) {
    return `<span class="m-dots" role="group" aria-label="Missions in this lab">${Chrono.MISSIONS[def.id].map((x, i) => {
      const done = Chrono.progress.missionDone(def.id, x.id);
      return `<button class="m-dot${done ? " done" : ""}${cur && x.id === cur.id ? " cur" : ""}" data-m-pick="${x.id}" title="${i + 1}. ${x.title}${done ? " — done" : ""}" aria-label="Mission ${i + 1}${done ? ", done" : ""}${cur && x.id === cur.id ? ", current" : ""}">${done ? "✓" : ""}</button>`; }).join("")}</span>`;
  }

  function card(def) {
    const list = Chrono.MISSIONS[def.id]; if (!list || !def.state) { run = null; return ""; }
    const m = (pick[def.id] && list.find(x => x.id === pick[def.id])) || next(def.id), k = m ? list.indexOf(m) : list.length;
    if (!m) { run = null; return `<div class="mission done"><div class="m-head"><div class="eyebrow">Missions</div>${dots(def, null)}</div><p>✓ All ${list.length} done here. Pick a circle to replay one, or <button class="linkish" data-m-reset>start them all again</button>.</p></div>`; }
    run = { lab: def.id, m, held: 0, done: false };
    return `<div class="mission" id="mission"><div class="m-head"><div class="eyebrow">Mission ${k + 1} of ${list.length} · optional</div>${dots(def, m)}</div>
      <p class="m-title">${m.title}</p><div class="m-bar"><i style="width:0%"></i></div><p class="m-status meta">Not there yet.</p>
      <p class="m-hint meta" hidden>${m.hint}</p>
      <div class="m-btns"><button class="linkish" data-m-hint>Hint</button> · <button class="linkish" data-m-show>Show me</button></div></div>`;
  }
  /* Try boxes (3c): in a lab with missions, the "Try:" suggestions would give missions away, so they wait until every
     mission there is done, then reappear as "More to try". Labs without missions keep them as they are. */
  function tryBoxes(def) {
    const list = Chrono.MISSIONS[def.id]; if (!list) return;
    const open = !next(def.id);
    document.querySelectorAll("#aside .try").forEach(t => {
      t.hidden = !open;
      const b = t.querySelector("b"); if (open && b && /^Try:?$/.test(b.textContent.trim())) b.textContent = "More to try:";
    });
  }
  function wire(def) {
    tryBoxes(def);
    const h = $("#aside [data-m-hint]"); if (h) h.onclick = () => { const p = $("#aside .m-hint"); p.hidden = !p.hidden; };
    const sh = $("#aside [data-m-show]"); if (sh) sh.onclick = () => { if (run && def.applySetup) { def.applySetup(run.m.show); Chrono.lab.rebuild(); } };
    const r = $("#aside [data-m-reset]"); if (r) r.onclick = () => { Chrono.progress.missionReset(def.id); Chrono.lab.rebuild(); };
    const n = $("#aside [data-m-next]"); if (n) n.onclick = () => Chrono.lab.rebuild();
    document.querySelectorAll("#aside [data-m-pick]").forEach(b => b.onclick = () => { pick[def.id] = b.dataset.mPick; Chrono.lab.rebuild(); });
  }
  function tick(def, dt) {                                  // called each frame while the lab is unlocked
    if (!run || run.done || run.lab !== def.id || !def.state) return;
    const el = $("#mission"); if (!el) return;
    const s = def.state(), ok = run.m.check(s);
    run.held = ok ? run.held + dt * 1000 : 0;
    el.querySelector(".m-bar i").style.width = Math.round((ok ? 0.85 + 0.15 * Math.min(1, run.held / run.m.hold) : 0.85 * Math.max(0, run.m.near(s))) * 100) + "%";
    el.querySelector(".m-status").textContent = ok ? "That's it — hold it there…" : run.m.near(s) > 0.8 ? "Very close." : run.m.near(s) > 0.4 ? "Getting closer." : "Not there yet.";
    if (run.held >= run.m.hold) {
      run.done = true; Chrono.progress.setMissionDone(def.id, run.m.id); delete pick[def.id];
      const w = $("#lab-canvas-wrap"); if (w) { w.classList.remove("pulse"); void w.offsetWidth; w.classList.add("pulse"); }
      const more = next(def.id);
      el.classList.add("done");
      if (!more) tryBoxes(def);
      el.innerHTML = `<div class="m-head"><div class="eyebrow">✓ Mission done</div>${dots(def, run.m)}</div><p class="m-title">${run.m.title}</p><p>${run.m.reveal} ${(run.m.tags || []).map(TG).join(" ")}</p>
        ${more ? `<button class="btn" data-m-next>Next mission →</button>` : `<p class="meta">That's every mission here.</p>`}`;
      wire(def);
    }
  }
  Chrono.missions = { card, wire, tick };
})();
