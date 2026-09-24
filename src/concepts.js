/* Chronoscope — Concepts: the "why" behind the app's big ideas, in three depths (D-034).
   1. Glossary underline (glossary.js): what a word means.
   2. ⓘ marker → popup: why it's so, in ≤ 3 sentences, with "Read more".
   3. Concepts page (#concepts/<id>): the full story — why, how we know, how sure, where to see it.
   Every claim is tagged; every source is in sources.md. Add a concept: one entry in PAGES (and INFO for popups). */
(function () {
  const $ = s => document.querySelector(s);
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;
  const lab = (href, name) => `<a class="chip" href="${href}">${name}</a>`;

  /* ---------------- the pages ---------------- */
  const PAGES = {
    clock: {
      title: "Clocks disagree", icon: "⏱", tags: ["ESTABLISHED"],
      short: "Clocks run at different rates for two reasons. <b>Speed:</b> light's speed is the same for everyone, so a moving clock's ticks take longer (special relativity). <b>Gravity:</b> clocks deeper in a gravitational field run slower (general relativity) — and GPS corrects for both every day.",
      one: "Two clocks that start together, then take different paths through space and time, disagree when they meet. Nothing is wrong with the clocks: time itself passes at different rates.",
      sections: [
        ["Reason 1 — speed", `<p>Einstein's starting point (1905): the speed of light is the same for every observer, however they move. Picture a <b>light clock</b> — a pulse bouncing between two mirrors. Seen from outside, a moving light clock's pulse travels a longer, diagonal path at the same speed, so each tick takes longer. The slowing factor is called γ (gamma): at 87% of light speed it's 2.</p>
          <p>It isn't a quirk of light clocks. If some other clock — an atom, a heartbeat — slowed differently, you could compare them and detect your "absolute" motion, which relativity rules out. Every process slows alike. ${TG("ESTABLISHED")}</p>
          <p>Each of two passing observers sees the <i>other's</i> clock run slow. That's not a contradiction: they only compare directly if one turns round to meet the other — the twin paradox.</p>`],
        ["Reason 2 — gravity", `<p>General relativity (1915) rests on the <b>equivalence principle</b>: in a small enough region, gravity can't be told apart from acceleration. Follow that through and light climbing out of gravity loses energy — and clocks lower down tick slower. Near Earth's surface a clock one metre higher runs faster by about one part in 10¹⁶. ${TG("ESTABLISHED")}</p>
          <p>In orbit the two effects compete: higher up, gravity speeds a clock up; the orbital speed slows it down. On the ISS speed wins; for GPS satellites gravity wins.</p>`],
        ["At cosmic scale", `<p>Light from distant galaxies is stretched by the expansion of space (redshift), and everything it carries is stretched with it: a supernova at redshift 1 appears to unfold twice as slowly. That's expansion rather than speed or gravity in the everyday sense, but it's measured and it fits. ${TG("ESTABLISHED")}</p>`],
        ["How we know", `<ul class="evidence">
          <li><b>1941</b> — Muons made by cosmic rays high in the atmosphere reach the ground in numbers they shouldn't, given their short lives: their clocks run slow (Rossi &amp; Hall).</li>
          <li><b>1959–60</b> — Light sent up a 22.5 m tower at Harvard shifts in frequency by the amount gravity predicts (Pound &amp; Rebka).</li>
          <li><b>1971</b> — Atomic clocks flown round the world east and west disagree with clocks left at home, as predicted (Hafele &amp; Keating).</li>
          <li><b>1977</b> — Muons circling a storage ring at CERN at 99.94% of light speed live about 29 times longer (Bailey et al.).</li>
          <li><b>2010</b> — Optical clocks lifted just 33 cm run measurably faster (Chou et al., NIST).</li>
          <li><b>2022</b> — The effect measured across a single millimetre-sized cloud of atoms (Bothwell et al., JILA).</li>
          <li><b>Every day</b> — GPS satellite clocks are corrected by about 38 microseconds a day; without it positions would drift kilometres.</li></ul>`],
        ["How sure?", `<p>${TG("ESTABLISHED")} Both effects have been measured many ways, to high precision, for over eighty years. What's still open is deeper: why time behaves this way at all, and what time is when quantum mechanics and gravity meet (hole <a href="#atlas/H1">H1</a>).</p>`]
      ],
      labs: [["#missions", "Mission clocks"], ["#clocks", "Clock Lab"], ["#spacetime", "Spacetime · twin paradox"], ["#river", "River"], ["#expand", "Expanding universe"]],
      sources: "Einstein (1905, 1915); Rossi & Hall, Phys. Rev. 59 (1941); Pound & Rebka, PRL 4 (1960); Hafele & Keating, Science 177 (1972); Bailey et al., Nature 268 (1977); Chou et al., Science 329 (2010); Bothwell et al., Nature 602 (2022); Ashby, Living Rev. Relativ. 6 (2003)."
    },
    now: {
      title: "Light and 'now'", icon: "◬", tags: ["ESTABLISHED", "CONTESTED"],
      short: "Light's speed is finite and the same for everyone, so there is no single 'now' shared across space. What you see of distant things is already old — and observers moving differently even disagree about which distant events happen at the same time.",
      one: "'Now' is local. Across distances there's no universal present — only what light has had time to bring you, and a choice of how to slice spacetime into moments.",
      sections: [
        ["Everything you see is the past", `<p>Light takes time to arrive: the Moon is 1.3 seconds ago, the Sun 8.3 minutes, Mars 3 to 22 minutes, the Andromeda galaxy 2.5 million years. You never see what a distant thing is doing 'now' — only what it was doing when the light left. ${TG("ESTABLISHED")}</p>`],
        ["Correct for the delay — and it still doesn't work", `<p>You might hope to reconstruct a shared 'now' by allowing for light-travel time. Relativity says you can't do it uniquely. Observers moving relative to each other, each correcting perfectly for delay, disagree about which distant events were simultaneous (Einstein, 1905). ${TG("ESTABLISHED")}</p>
          <p>For events far enough apart that no signal could pass between them — outside each other's <b>light cones</b> — observers can even disagree about their order. For events that could affect each other, everyone agrees on the order, so cause never comes after effect.</p>`],
        ["So what is 'now'?", `<p>If no way of slicing spacetime into moments is special, many physicists and philosophers conclude that all times are equally real — the <b>block universe</b> (eternalism). Others hold that only the present exists (presentism) and relativity leaves room for it. ${TG("CONTESTED")} This is hole <a href="#atlas/H4">H4</a>.</p>`],
        ["With two time dimensions", `<p>A moment would no longer be a slice but a line through a time <i>plane</i> — and even perfect knowledge of it wouldn't fix what comes next (see Two Films). The mathematics is ${TG("ESTABLISHED")}; whether it tells us anything about our universe is ${TG("SPECULATIVE")}.</p>`],
        ["At cosmic scale", `<p>Our view of the universe is one enormous past light cone. The oldest light we see left 13.8 billion years ago; the matter that sent it is now about 46 billion light-years away. And because expansion is accelerating, there are galaxies we can see today that a message sent now will never reach. ${TG("ESTABLISHED")} within the standard model of cosmology.</p>`],
        ["How we know", `<ul class="evidence"><li>Light's speed is measured to be the same in every direction and for every source (Michelson–Morley, 1887, and its modern versions to about one part in 10¹⁸).</li>
          <li>Relativity of simultaneity isn't measured directly — it follows from the same symmetry (Lorentz invariance) that time dilation does, tested in particle accelerators, atomic clocks and GPS.</li></ul>`]
      ],
      labs: [["#mars", "Talking to Mars"], ["#spacetime", "Spacetime · whose 'now'?"], ["#flatland/7", "Flatland · Time as a slice"], ["#films", "Two Films"], ["#horizons", "Cosmic horizons"]],
      sources: "Einstein (1905); Michelson & Morley (1887) and modern tests (e.g. Nagel et al. 2015); Davis & Lineweaver (2004)."
    },
    arrow: {
      title: "The arrow of time", icon: "→", tags: ["ESTABLISHED", "CONTESTED"],
      short: "The basic laws run (almost) equally well backwards, yet eggs break and never unbreak. The usual explanation: the universe began in an extremely ordered, low-entropy state, and there are overwhelmingly more disordered ways to be. Why it started that way is still open.",
      one: "The laws barely care which way time runs. The world does. The difference comes from the odds — and from how the universe began.",
      sections: [
        ["The puzzle", `<p>Newton's laws, Maxwell's equations and quantum mechanics all work just as well run backwards. Film two billiard balls colliding and the reversed film looks fine. Yet a film of an egg breaking, played backwards, is obviously wrong. Where does the one-way-ness come from? Loschmidt raised this against Boltzmann in 1876. ${TG("ESTABLISHED")}</p>`],
        ["Entropy is counting", `<p>Boltzmann's answer (1877): <b>entropy</b> counts how many microscopic arrangements look the same from outside — S = k ln W. A gas spread through a box can be arranged in vastly more ways than a gas crammed in one corner, so spreading is overwhelmingly likely. Un-spreading isn't forbidden; for 10²³ molecules it is absurdly improbable. ${TG("ESTABLISHED")}</p>`],
        ["The catch: the past", `<p>Counting only gives an arrow if things <i>started</i> ordered. Everything traces back to the early universe being in an extraordinarily low-entropy state — the <b>Past Hypothesis</b>. Penrose estimated the odds of such a start by chance at 1 in 10 raised to the power 10¹²³. Why it began that way is unexplained: inflation, the Janus point, baby universes and cyclic models are all proposals. ${TG("CONTESTED")} This is hole <a href="#atlas/H3">H3</a>.</p>`],
        ["The other arrows", `<p>Several arrows point the same way. <b>Radiation</b> spreads out from sources, never converges onto them. <b>Memory</b>: records — photographs, fossils, memories — form in the direction entropy increases, which is why we remember the past, not the future. <b>Cosmology</b>: the universe is expanding. One more is tiny: the <b>weak force</b> treats past and future very slightly differently in a few particle decays — real, but far too weak to be the cause. ${TG("ESTABLISHED")} for each arrow; how they're linked is ${TG("CONTESTED")}.</p>`],
        ["How we know", `<ul class="evidence"><li>The second law of thermodynamics — entropy of an isolated system doesn't decrease — has never been seen to fail at everyday scales.</li>
          <li>Small systems do show brief, predictable backward fluctuations (fluctuation theorems), exactly as the counting predicts.</li>
          <li>The microwave background shows the early universe was extremely smooth — the low-entropy start the Past Hypothesis needs.</li></ul>`]
      ],
      labs: [["#entropy", "Entropy box"], ["#janus", "The Janus point"], ["#atlas/H3", "Atlas · hole H3"], ["#atlas/weak", "The weak force"]],
      sources: "Boltzmann (1877); Loschmidt (1876); Penrose, The Emperor's New Mind (1989); Barbour, Koslowski & Mercati (2014); CPLEAR (1998); Planck Collaboration (2020)."
    },
    dims: {
      title: "Why 3 + 1?", icon: "◇", tags: ["ESTABLISHED", "CONTESTED"],
      short: "Our universe has three space dimensions and one time. Other combinations seem to break orbits, atoms or prediction — which explains why observers find themselves in 3 + 1. But nobody has shown the universe had to be this way.",
      one: "Change the number of space or time dimensions and something essential breaks. That tells us why we're here — not why 'here' exists.",
      sections: [
        ["Picturing other dimensions", `<p>We can't picture a fourth direction, but we can reason one dimension down: a flat creature sees a passing sphere as a circle that grows and shrinks. The same trick shows what a 4D object passing through our world would look like. ${TG("ANALOGY")} (the story) · ${TG("ESTABLISHED")} (the geometry).</p>`],
        ["More space dimensions", `<p>Gravity and electric force spread out through space, so in n dimensions they weaken as 1/r<sup>n−1</sup>. With four or more space dimensions, orbits and atoms have no stable states: planets spiral in or fly off, electrons fall into nuclei or escape (Ehrenfest, 1917, and later quantum versions). ${TG("ESTABLISHED")} as mathematics.</p>`],
        ["Fewer space dimensions", `<p>In two space dimensions, gravity doesn't pull separated masses together in the ordinary way (2 + 1 gravity has no local degrees of freedom). ${TG("ESTABLISHED")} Whether that makes complex structures and observers impossible is argued, not proved. ${TG("CONTESTED")}</p>`],
        ["More time dimensions", `<p>With two times, a complete snapshot of the present no longer fixes the future for general starting data (Craig &amp; Weinstein, 2009), and particles could decay into heavier ones (Dorling, 1970). With no time at all, nothing evolves. ${TG("ESTABLISHED")} as mathematics.</p>`],
        ["So why 3 + 1?", `<p>Tegmark (1997) drew these results into one map: only 3 + 1 allows observers like us. That's an <i>anthropic</i> explanation — it says why we find ourselves here, not why the universe had to be this way. ${TG("CONTESTED")} Theories with hidden extra dimensions (string theory, two-time physics) are ${TG("SPECULATIVE")}. This is hole <a href="#atlas/H5">H5</a>.</p>`]
      ],
      labs: [["#flatland/4", "Flatland · A 4D visitor"], ["#films", "Two Films"], ["#boot", "Boot a Universe"], ["#atlas/H5", "Atlas · hole H5"]],
      sources: "Tegmark, Class. Quantum Grav. 14 (1997); Ehrenfest (1917); Dorling, Am. J. Phys. 38 (1970); Craig & Weinstein, Proc. R. Soc. A 465 (2009); Deser, Jackiw & 't Hooft (1984); Abbott, Flatland (1884)."
    },
    spacetime: {
      title: "Spacetime", icon: "▦", tags: ["ESTABLISHED", "SPECULATIVE"],
      short: "Relativity treats space and time as one four-dimensional geometry. Observers moving differently split it into 'space' and 'time' differently — but all agree on the spacetime separation between two events.",
      one: "Space and time aren't separate stages. They're one geometry, and each observer slices it into 'space' and 'time' in their own way.",
      sections: [
        ["One geometry", `<p>In 1908 Hermann Minkowski put Einstein's relativity into a picture: "Henceforth space by itself, and time by itself, are doomed to fade away into mere shadows, and only a kind of union of the two will preserve an independent reality." Events are points in a four-dimensional <b>spacetime</b>; a thing's whole history is a line through it (its <b>worldline</b>). ${TG("ESTABLISHED")}</p>`],
        ["What everyone agrees on", `<p>Observers disagree about distances and durations separately, but they all agree on one combination: the <b>interval</b>, (c × time)² − (distance)². The minus sign is what makes time a different kind of dimension from space. Light's path has an interval of zero. A clock's reading is the interval along its own path — its <b>proper time</b>. ${TG("ESTABLISHED")}</p>`],
        ["Light cones", `<p>From any event, light spreads out as a cone into the future (and came in as a cone from the past). Inside your future cone: everything you could ever affect. Inside your past cone: everything that could have affected you. Outside both: the 'elsewhere' — events that can't be connected to you by any signal, and whose timing relative to you depends on who's asking. ${TG("ESTABLISHED")}</p>`],
        ["Curved spacetime", `<p>General relativity (1915) goes further: mass and energy curve spacetime, and the curvature is gravity. Objects in free fall follow the straightest possible paths through curved spacetime. Confirmed by starlight bending at the 1919 eclipse, the precision of GPS, Gravity Probe B (2011), gravitational waves (2015) and images of black holes (2019, 2022). ${TG("ESTABLISHED")}</p>`],
        ["Is spacetime fundamental?", `<p>Many approaches to quantum gravity suggest spacetime may not be the bottom layer — it might emerge from something else, such as quantum entanglement or discrete building blocks. None is confirmed. ${TG("SPECULATIVE")} See holes <a href="#atlas/H1">H1</a> and <a href="#atlas/H11">H11</a>.</p>`]
      ],
      labs: [["#spacetime", "Spacetime diagram"], ["#flatland/7", "Flatland · Time as a slice"], ["#river", "River"], ["#horizons", "Cosmic horizons"]],
      sources: "Minkowski, 'Raum und Zeit' (1908); Einstein (1905, 1915); Dyson, Eddington & Davidson (1920); Everitt et al., Gravity Probe B, PRL 106 (2011); LIGO, PRL 116 (2016); Event Horizon Telescope (2019, 2022)."
    },
    dilation: {
      title: "Time dilation", icon: "⧗", tags: ["ESTABLISHED"],
      short: "Time dilation is the measured slowing of one clock compared with another — by a factor called γ for speed, and by depth in a gravitational field. At everyday speeds it's tiny; near light speed it's enormous.",
      one: "How much slower? At walking pace, immeasurably; on an airliner, billionths of a second a day; near light speed, years.",
      sections: [
        ["The size of it", `<table class="orph"><tr><th>Speed</th><th>γ (how many times slower)</th></tr>
          <tr><td>10% of light speed</td><td>1.005</td></tr><tr><td>50%</td><td>1.15</td></tr><tr><td>87%</td><td>2.0</td></tr><tr><td>99%</td><td>7.1</td></tr><tr><td>99.9%</td><td>22</td></tr></table>
          <p>A car at 100 km/h loses about a tenth of a microsecond a year. On an airliner, speed slows a clock by about 30 billionths of a second a day, while the height — 10 km up, in weaker gravity — speeds it up by about 90 billionths: height wins. An astronaut on the ISS ends up about 25 millionths of a second a day behind. ${TG("ESTABLISHED")}</p>`],
        ["Proper time: the length of your path", `<p>A clock measures the length of its own path through spacetime — its <b>proper time</b>. Between two meetings, the path that keeps to steady motion is the <i>longest</i>; any path with detours and turnarounds is shorter. That's the whole twin paradox: the travelling twin's path through spacetime is shorter, so less time passes for them. The turnaround is what breaks the symmetry. ${TG("ESTABLISHED")}</p>`],
        ["Gravity's version", `<p>Deeper in gravity, clocks run slower: near Earth, a clock one metre lower loses about one part in 10¹⁶. Near a black hole the effect grows without limit: seen from far away, a clock held still just outside the horizon barely ticks. ${TG("ESTABLISHED")}</p>`],
        ["Not an illusion — but relative", `<p>Two observers moving past each other each see the <i>other's</i> clock running slow; neither is wrong. When clocks are brought back together, though, the difference is real and permanent — measured with muons, flown atomic clocks and GPS. ${TG("ESTABLISHED")} For the evidence, see <a href="#concepts/clock">Clocks disagree</a>.</p>`]
      ],
      labs: [["#clocks", "Clock Lab"], ["#missions", "Mission clocks"], ["#spacetime", "Spacetime · twin paradox"], ["#voyage", "The 1 g voyage"], ["#field", "Field Ocean"]],
      sources: "Einstein (1905); Hafele & Keating (1972); Bailey et al. (1977); Chou et al. (2010); Ashby (2003)."
    },
    entropy: {
      title: "Entropy", icon: "⁂", tags: ["ESTABLISHED", "CONTESTED"],
      short: "Entropy counts how many microscopic arrangements look the same from outside. Left alone, systems drift towards states with more arrangements — not because they must, but because there are overwhelmingly more of them.",
      one: "Entropy isn't mess. It's a count — how many ways the parts could be arranged without the whole looking any different.",
      sections: [
        ["Counting, not mess", `<p>Boltzmann's formula, S = k ln W, is carved on his grave: entropy S grows with W, the number of microscopic arrangements consistent with what you see. 'Disorder' is a misleading shorthand — oil and water separating, or crystals forming, still raise the total entropy once the heat they release is counted. A better picture: energy spreading into more of the ways it can be shared. ${TG("ESTABLISHED")}</p>`],
        ["Why it grows", `<p>Most arrangements look 'spread out', so a system wandering at random among its arrangements almost always ends up there. For a handful of particles, backward steps happen and have been measured (fluctuation theorems); for the 10²³ molecules in a room, they're never seen. ${TG("ESTABLISHED")}</p>
          <p>A subtle point: the count depends on how coarsely you describe the system — which details you ignore. Physicists still discuss what that means for how objective entropy is. ${TG("CONTESTED")}</p>`],
        ["Information costs energy", `<p>Entropy and information are two sides of one coin. Landauer (1961) showed that erasing one bit of information must release a minimum amount of heat — measured in 2012 and, in 2025, in a quantum many-body system. ${TG("ESTABLISHED")}</p>`],
        ["Life runs on an entropy flow", `<p>Earth receives sunlight as relatively few high-energy photons and sends the same energy back to space as many more low-energy infrared photons — roughly twenty for every one received. Plants, weather and people live in that gap, building order locally while total entropy rises. ${TG("ESTABLISHED")}</p>`],
        ["Black holes and the universe", `<p>Black holes turn out to carry enormous entropy, set by the area of their horizon (Bekenstein and Hawking, 1970s) — widely accepted theory, not yet tested by experiment. They hold most of the entropy in the universe today. The smooth early universe, by contrast, had very low entropy — which is why everything since has had room to run downhill. ${TG("ESTABLISHED")} (the smooth start) · ${TG("CONTESTED")} (why it was so).</p>`]
      ],
      labs: [["#entropy", "Entropy box"], ["#janus", "The Janus point"], ["#atlas/prigogine", "Order from energy flow"], ["#concepts/arrow", "The arrow of time"]],
      sources: "Boltzmann (1877); Landauer, IBM J. Res. Dev. 5 (1961); Bérut et al., Nature 483 (2012); Nature Physics 21 (2025); Wang et al., PRL 89 (2002); Bekenstein, PRD 7 (1973); Hawking (1975); Penrose (1989)."
    },
    expansion: {
      title: "Expansion and redshift", icon: "◎", tags: ["ESTABLISHED", "CONTESTED"],
      short: "Distances between galaxies grow over time because space itself stretches. Light crossing it is stretched too — redshift. And the expansion is now speeding up, for reasons (called 'dark energy') nobody understands.",
      one: "The universe isn't exploding into empty space. The space between galaxies is growing — everywhere at once.",
      sections: [
        ["Hubble's law", `<p>The farther a galaxy, the faster it recedes: speed = H₀ × distance. Found in the 1920s (Lemaître 1927, Hubble 1929). Every galaxy sees the same law, so no galaxy is the centre. ${TG("ESTABLISHED")}</p>
          <p>Picture dots drawn on a balloon being blown up: every dot sees every other dot move away. ${TG("ANALOGY")} — the balloon's <i>surface</i> is the universe; there's no inside or outside to it.</p>`],
        ["Redshift is stretching", `<p>Light's wavelength stretches by exactly as much as the universe has grown while it travelled: a redshift of z = 1 means the universe has doubled in size since the light set out. Everything the light carries is stretched with it — which is why distant supernovae appear to unfold in slow motion. ${TG("ESTABLISHED")}</p>`],
        ["Faster than light? Yes — and that's fine", `<p>Galaxies beyond about 14.5 billion light-years (the Hubble distance) recede faster than light. Relativity forbids anything moving <i>through</i> space faster than light nearby; it doesn't limit how fast space between distant galaxies grows. We can even see some galaxies that are receding faster than light today. ${TG("ESTABLISHED")}</p>`],
        ["What doesn't expand", `<p>Atoms, people, the solar system and galaxies are held together by their own forces and gravity; they don't grow with the universe. Expansion shows up only between groups of galaxies. ${TG("ESTABLISHED")}</p>`],
        ["Speeding up — and the open questions", `<p>In 1998 two teams found distant supernovae fainter than expected: the expansion is accelerating (Nobel Prize 2011). Whatever drives it — 'dark energy', about 68% of the universe's energy — is unknown. ${TG("ESTABLISHED")} (the acceleration). Recent maps hint that dark energy may change over time, and two ways of measuring today's expansion rate disagree (67 vs 73 km/s per megaparsec). ${TG("CONTESTED")} Holes <a href="#atlas/H9">H9</a> and <a href="#atlas/H10">H10</a>.</p>`],
        ["How we know", `<ul class="evidence"><li>Redshift grows with distance for millions of galaxies.</li><li>The microwave background: the cooled glow of the hot early universe, with a perfect thermal spectrum (COBE, 1990).</li><li>The amounts of hydrogen, helium and lithium made in the first minutes.</li><li>Supernova light curves stretched by (1 + z) (DES, 2024).</li><li>Patterns frozen into the galaxy distribution (baryon acoustic oscillations).</li></ul>`]
      ],
      labs: [["#expand", "Expanding universe"], ["#horizons", "Cosmic horizons"], ["#sure", "How sure are we?"]],
      sources: "Lemaître (1927); Hubble, PNAS 15 (1929); Riess et al., AJ 116 (1998); Perlmutter et al., ApJ 517 (1999); Mather et al. (1990); DES (2024); Planck (2020); DESI (2024–25); Davis & Lineweaver (2004)."
    },
    horizons: {
      title: "Horizons", icon: "◐", tags: ["ESTABLISHED", "CONTESTED"],
      short: "A horizon is a boundary beyond which events can never affect you. Black holes have one. So does the expanding universe — two, in fact: the edge of what we can see, and the edge of what our signals can ever reach.",
      one: "Horizons aren't walls. They're limits on what can reach whom — set by light's speed and the shape of spacetime.",
      sections: [
        ["Black-hole horizons", `<p>Squeeze any mass inside its <b>Schwarzschild radius</b>, 2GM/c², and not even light can climb back out. For the Sun that radius would be 3 km; for Earth, 9 mm; for the black hole at the centre of our galaxy, about 13 million km. ${TG("ESTABLISHED")}</p>
          <p>Seen from far away, a clock lowered towards the horizon slows towards a stop. Yet someone falling through a large black hole's horizon feels nothing special there — the horizon isn't a surface, it's a point of no return. Inside, moving towards the centre becomes as unavoidable as moving into tomorrow. ${TG("ESTABLISHED")}</p>`],
        ["Do black holes last forever?", `<p>Hawking (1974) showed that, with quantum effects, black holes should glow faintly and slowly evaporate — a firm prediction of theory, not yet observed from a real black hole (lab analogues show the effect). Whether the information that fell in comes back out is the <b>information paradox</b>. ${TG("CONTESTED")} Hole <a href="#atlas/H7">H7</a>.</p>`],
        ["Cosmic horizons", `<p>The <b>particle horizon</b>: the farthest matter whose light has had time to reach us — about 46 billion light-years away today. That's the edge of the observable universe. The <b>event horizon</b>: because expansion is accelerating, light we send now can never reach galaxies beyond about 16–17 billion light-years, and their light emitted now will never reach us. ${TG("ESTABLISHED")} within the standard model of cosmology.</p>
          <p>The Hubble distance (about 14.5 billion light-years), where recession reaches light speed, is <i>not</i> a horizon: we see plenty of galaxies beyond it. ${TG("ESTABLISHED")}</p>`],
        ["How we know", `<ul class="evidence"><li>Stars orbiting the galaxy's centre (Nobel Prize 2020) and images of black holes' shadows (2019, 2022).</li><li>Gravitational waves from merging black holes (2015 onwards).</li><li>Cosmic horizons follow from the measured expansion history (see <a href="#concepts/expansion">Expansion and redshift</a>).</li></ul>`]
      ],
      labs: [["#river", "River"], ["#horizons", "Cosmic horizons"], ["#spacetime", "Spacetime diagram"]],
      sources: "Schwarzschild (1916); Hawking, Nature 248 (1974); Genzel & Ghez (Nobel 2020); Event Horizon Telescope (2019, 2022); LIGO (2016); Davis & Lineweaver (2004); Steinhauer (2016, 2019)."
    },
    scales: {
      title: "Three scales of time", icon: "⇲", tags: [],
      short: "The app is organised by scale: Voyages (people and spacecraft), Physics (the laws underneath) and Cosmos (the universe as a whole). The same questions about time turn up at every scale.",
      one: "An astronaut's watch, a light clock and the edge of the universe are the same story, told at different sizes.",
      sections: [
        ["Voyages — people and spacecraft", `<p>Time as it affects people who travel: astronauts' clocks, conversations with rovers on Mars, how far a crew could go in a lifetime. Everything here is <b>measured</b> or engineering-real, apart from the starship itself.</p>`],
        ["Physics — the laws underneath", `<p>Why clocks disagree, what 'now' means, why time runs one way, what an extra dimension would look like. Small, exact models of the laws themselves.</p>`],
        ["Cosmos — the universe as a whole", `<p>Expansion, horizons, the arrow of time on the largest scale, and why the universe has three space dimensions and one time. Where the biggest open questions live.</p>`],
        ["The threads", `<p>Four questions run across all three scales: <a href="#concepts/clock">Clocks disagree</a>, <a href="#concepts/now">Light and 'now'</a>, <a href="#concepts/arrow">The arrow of time</a> and <a href="#concepts/dims">Why 3 + 1?</a>. Each lab lists the threads it's on. Tour 2, <i>From the ISS to the edge of the universe</i>, walks all three scales in order.</p>`]
      ],
      labs: [["#missions", "Voyages · Mission clocks"], ["#clocks", "Physics · Clock Lab"], ["#expand", "Cosmos · Expanding universe"]],
      sources: "Project structure (D-031)."
    },
    tags: {
      title: "How sure? The tags", icon: "✓", tags: [],
      short: "Every claim carries a tag saying how sure physicists are: Established, Contested, Speculative or Ruled out — plus Analogy for pictures and stories, and Hypothesis for this project's own ideas. Tags go on claims, not whole papers.",
      one: "Science isn't one pile of facts. Each claim here says how far it has got — and one paper can hold claims at several levels.",
      sections: [
        ["The tags", `<dl class="tagdefs">
          <dt>${TG("ESTABLISHED")}</dt><dd>Independent tests agree and the alternatives have failed. Still open to revision at its limits — Newton's gravity was established, and still is, inside the limits relativity found.</dd>
          <dt>${TG("CONTESTED")}</dt><dd>Serious evidence or argument exists, but experts disagree about it.</dd>
          <dt>${TG("SPECULATIVE")}</dt><dd>A published proposal without supporting evidence yet. It may still make testable predictions — that's what to look for.</dd>
          <dt>${TG("RULEDOUT")}</dt><dd>Made clear predictions that failed. Kept, because how ideas die is the best lesson in method.</dd>
          <dt>${TG("ANALOGY")}</dt><dd>A picture or story to help thinking — not a claim about how nature works.</dd>
          <dt>${TG("HYPOTHESIS")}</dt><dd>This project's own ideas, or visitors' — not mainstream physics. Shown in Lab mode, to be tested, not believed.</dd></dl>`],
        ["Tag claims, not papers", `<p>A single paper can hold claims at different levels. Two Films is a good example: that the two films are exact solutions of a two-time wave equation is ${TG("ESTABLISHED")} mathematics; that this tells us anything about our universe is ${TG("SPECULATIVE")}.</p>`],
        ["Tiers and modes", `<p>Tags group into tiers: <b>Mainstream</b> (Established, Contested, Ruled out), <b>Frontier</b> (Speculative), <b>Exploratory</b> (Hypothesis) and <b>Lens</b> (Analogy). <b>Learn</b> mode shows Mainstream, Frontier and Lens; <b>Lab</b> mode adds Exploratory.</p>`],
        ["How a claim moves", `<p>Idea → worked-out proposal → tested and disputed → confirmed, or ruled out. <a href="#sure">How sure are we?</a> walks one claim — the expanding universe — up that ladder.</p>`]
      ],
      labs: [["#sure", "How sure are we?"], ["#bench", "Test bench"]],
      sources: "Project method (CLAUDE.md, D-004, D-008, D-016, D-025)."
    },
    hurdles: {
      title: "The five hurdles", icon: "⚖", tags: ["ESTABLISHED"],
      short: "Every idea on the Test bench faces the same five hurdles: agree with relativity's tests, keep the present predictive, allow stable matter, explain time's arrow, and make a new testable prediction.",
      one: "Five things any idea about time has to get past. They're a checklist, not a verdict — and the scores are made to be argued with.",
      sections: [
        ["1 · Matches relativity tests", `<p>Special and general relativity have passed every test for over a century — particle accelerators, atomic clocks, GPS, gravitational waves, black-hole images. An idea about time that contradicts them has to explain all that evidence away. Tired light struggled here (<a href="#atlas/tired">see it</a>).</p>`],
        ["2 · Present predicts future", `<p>In our world, knowing the present fixes the future — that's what lets physics forecast anything. Some ideas break this: universes with time loops (<a href="#atlas/godel">Gödel</a>) and two time dimensions (<a href="#atlas/cw">Craig &amp; Weinstein</a>).</p>`],
        ["3 · Allows stable matter", `<p>Atoms, planets and people need stable matter. Extra space dimensions destabilise orbits and atoms; extra time dimensions let particles decay into heavier ones (<a href="#atlas/dorling">Dorling</a>). Several multi-time proposals haven't yet shown how they avoid this.</p>`],
        ["4 · Explains the arrow", `<p>A full account of time should say why it runs one way. Most theories of the fundamental laws don't try — even relativity (<a href="#atlas/minkowski">Spacetime</a>) treats past and future alike and inherits the arrow from the early universe. Few ideas pass this hurdle.</p>`],
        ["5 · Makes a new testable prediction", `<p>An idea that predicts nothing new can't be checked, however elegant. Some famous proposals score poorly here (<a href="#atlas/tryon">the zero-energy universe</a>, <a href="#atlas/thermal">thermal time</a>); some speculative ones do well because they stuck their necks out (<a href="#atlas/smolin">Smolin's black-hole universes</a>).</p>`],
        ["Argue with the scores", `<p>The scores are a first-pass judgement drafted with Claude, an AI. Every partial or failing score has a written reason — open any idea, and use <b>Score it yourself</b> where you disagree.</p>`]
      ],
      labs: [["#bench", "Test bench"], ["#atlas", "Atlas"]],
      sources: "Test bench method (D-012, D-027); reasons per idea in src/data3.js."
    }
  };

  /* ---------------- popup text (ⓘ) — pages' short text plus a few extra keys ---------------- */
  const INFO = {
    "tier-mainstream": { t: "Mainstream", s: "What working physicists hold (Established), actively debate (Contested), or have tested and rejected (Ruled out).", p: "tags" },
    "tier-frontier": { t: "Frontier", s: "Speculative: published proposals from physicists, not yet supported by evidence. Look for what they predict.", p: "tags" },
    "tier-exploratory": { t: "Exploratory", s: "This project's own ideas and visitors' hypotheses. Not mainstream physics — shown to be tested, not believed.", p: "tags" },
    "tier-lens": { t: "Lens", s: "Analogies, history and stories that help thinking. They're pictures, not claims about how nature works.", p: "tags" },
    "sc-voyages": { t: "Voyages", s: "Time for people who travel: astronauts' clocks, talking to Mars, how far a crew could go in a lifetime.", p: "scales" },
    "sc-labs": { t: "Physics", s: "The laws underneath: small, exact models of why clocks disagree, what 'now' means and why time runs one way.", p: "scales" },
    "sc-cosmos": { t: "Cosmos", s: "The universe as a whole: expansion, horizons, the cosmic arrow of time, and why 3 + 1.", p: "scales" },
    "h-rel": { t: "Matches relativity tests", s: "Relativity has passed every test for over a century, from particle accelerators to GPS. An idea about time that contradicts it has to explain all that evidence away.", p: "hurdles" },
    "h-pred": { t: "Present predicts future", s: "In our world, knowing the present fixes the future — that's what lets physics forecast. Time loops and extra time dimensions can break this.", p: "hurdles" },
    "h-matter": { t: "Allows stable matter", s: "Atoms, planets and people need stable matter. Extra space dimensions destabilise orbits and atoms; extra time dimensions let particles decay into heavier ones.", p: "hurdles" },
    "h-arrow": { t: "Explains the arrow", s: "A full account of time should say why it runs one way. Most theories of the laws don't try — they inherit the arrow from the early universe.", p: "hurdles" },
    "h-test": { t: "Makes a new testable prediction", s: "An idea that predicts nothing new can't be checked, however elegant.", p: "hurdles" }
  };
  Object.entries(PAGES).forEach(([k, v]) => { if (!INFO[k]) INFO[k] = { t: v.title, s: v.short, p: k, tags: v.tags }; });

  /* ⓘ marker for any concept key */
  Chrono.info = key => INFO[key] ? `<button class="info" type="button" data-info="${key}" aria-label="About: ${INFO[key].t}">i</button>` : "";

  /* ---------------- the popup: hover (mouse), tap (touch), focus (keyboard) ---------------- */
  const pop = document.createElement("div"); pop.id = "infopop"; pop.setAttribute("role", "dialog"); document.body.appendChild(pop);
  let current = null, hideT = 0;
  function show(btn) {
    const c = INFO[btn.dataset.info]; if (!c) return;
    clearTimeout(hideT); current = btn;
    pop.innerHTML = `<div class="ip-title">${c.t}</div><p>${c.s}</p>${(c.tags || []).length ? `<div class="ip-tags">${c.tags.map(TG).join(" ")}</div>` : ""}<a class="ip-more" href="#concepts/${c.p}">Read more →</a>`;
    pop.style.display = "block";
    const r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left - 20)) + "px";
    pop.style.top = (r.bottom + 8 + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 8) : r.bottom + 8) + "px";
  }
  function hide() { pop.style.display = "none"; current = null; }
  const later = () => { clearTimeout(hideT); hideT = setTimeout(hide, 250); };
  const hover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("button.info");
    if (b) { e.preventDefault(); e.stopPropagation(); current === b ? hide() : show(b); return; }
    if (e.target.closest && e.target.closest(".ip-more")) { hide(); return; }
    if (current && !pop.contains(e.target)) hide();
  }, true);
  if (hover) {
    document.addEventListener("mouseover", e => { const b = e.target.closest && e.target.closest("button.info"); if (b && b !== current) show(b); else if (b || pop.contains(e.target)) clearTimeout(hideT); });
    document.addEventListener("mouseout", e => { const b = e.target.closest && e.target.closest("button.info"); if ((b || pop.contains(e.target)) && !(e.relatedTarget && (pop.contains(e.relatedTarget) || (e.relatedTarget.closest && e.relatedTarget.closest("button.info") === current)))) later(); });
  }
  document.addEventListener("focusin", e => { if (e.target.matches && e.target.matches("button.info")) show(e.target); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  window.addEventListener("hashchange", hide);
  document.addEventListener("scroll", () => current && hide(), true);

  /* ---------------- the Concepts view ---------------- */
  const GROUPS = [["The four threads", ["clock", "now", "arrow", "dims"]], ["Core ideas", ["spacetime", "dilation", "entropy", "expansion", "horizons"]], ["How this app works", ["scales", "tags", "hurdles"]]];
  const ORDER = GROUPS.flatMap(g => g[1]);
  /* Key ideas per view: shown as a row of links in each lab's side panel */
  const KEY = {
    missions: ["dilation", "clock"], mars: ["now", "spacetime"], voyage: ["dilation", "spacetime"],
    field: ["dilation"], clocks: ["dilation", "clock"], spacetime: ["spacetime", "now", "dilation"], river: ["horizons", "dilation"],
    entropy: ["entropy", "arrow"], films: ["dims", "now"], expand: ["expansion"], horizons: ["horizons", "expansion"],
    boot: ["dims"], janus: ["arrow", "entropy"],
    "flatland/1": ["dims"], "flatland/2": ["dims"], "flatland/3": ["dims"], "flatland/4": ["dims"], "flatland/5": ["dims"], "flatland/6": ["dims"], "flatland/7": ["spacetime", "now"]
  };
  Chrono.keyIdeas = key => KEY[key] ? `<div class="keyideas"><span class="ki-label">Key ideas</span>${KEY[key].map(k => `<span class="ki"><a href="#concepts/${k}">${PAGES[k].title}</a>${Chrono.info(k)}</span>`).join("")}</div>` : "";
  function article(k) {
    const c = PAGES[k];
    return `<div class="docwrap concept">
      <a class="backlink" href="#concepts">← All concepts</a>
      <div class="eyebrow">Concept</div>
      <h1>${c.icon} ${c.title}</h1>
      ${c.tags.length ? `<div class="pillrow">${c.tags.map(TG).join(" ")}</div>` : ""}
      <p class="lede">${c.one}</p>
      ${c.sections.map(([h, body]) => `<section><h2>${h}</h2>${body}</section>`).join("")}
      <h2>See it in the labs</h2><div class="labchips">${c.labs.map(([h, n]) => lab(h, n)).join("")}</div>
      <p class="caveat">Sources: ${c.sources}</p>
    </div>`;
  }
  function index() {
    return `<div class="docwrap concept">
      <div class="eyebrow">Explore</div><h1>Concepts</h1>
      <p class="lede">The ideas that run through the whole app, explained properly: why it's so, how we know, and how sure physicists are. Look for the <button class="info" type="button" tabindex="-1" aria-hidden="true">i</button> markers around the app for the short version.</p>
      ${GROUPS.map(([g, ks]) => `<h2 class="sect">${g}</h2><div class="cgrid">${ks.map(k => `<a class="ccard" href="#concepts/${k}"><span class="cc-icon">${PAGES[k].icon}</span><b>${PAGES[k].title}</b><span>${PAGES[k].one}</span><span class="hgo">Read →</span></a>`).join("")}</div>`).join("")}
    </div>`;
  }
  Chrono.lab.register({
    id: "concepts", kind: "doc", title: "Concepts", eyebrow: "Explore · the ideas behind the app", tier: "none",
    page() { const k = Chrono.conceptSel; setTimeout(() => { const d = $("#doc"); if (d) d.scrollTop = 0; window.scrollTo(0, 0); }); return PAGES[k] ? article(k) : index(); },
    aside: () => `
      <p>Three depths, so detail is there when you want it and out of the way when you don't:</p>
      <ul class="biglist"><li><b>Dotted underline</b> — what a word means.</li><li><b>ⓘ marker</b> — why it's so, in a few sentences.</li><li><b>This page</b> — the full story, the evidence, and how sure.</li></ul>
      <h3>All concepts</h3>
      ${GROUPS.map(([g, ks]) => `<div class="eyebrow" style="margin-top:12px">${g}</div><div class="barlist">${ks.map(k => `<a href="#concepts/${k}" class="${Chrono.conceptSel === k ? "on" : ""}">${PAGES[k].icon} ${PAGES[k].title}</a>`).join("")}</div>`).join("")}`
  });
})();
