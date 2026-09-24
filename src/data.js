/* Chronoscope — Atlas data.
   Holes = known gaps in our account of time. Ideas = a century of attempts to fill them.
   Constraint values are Claude's first-pass assessment (see sources.md) — meant to be argued with.
   Values: "yes" addresses/passes · "part" partial/evades · "no" fails/ignores · "na" not applicable · "unk" unknown */
window.Chrono = window.Chrono || {};

Chrono.TAGS = {
  ESTABLISHED: "Established",
  CONTESTED: "Contested",
  SPECULATIVE: "Speculative",
  ANALOGY: "Analogy",
  HYPOTHESIS: "Hypothesis",
  RULEDOUT: "Ruled out"
};

/* Tiers separate mainstream physics from frontier ideas and from our own exploratory thinking.
   mainstream = Established or Contested claims held by working physicists
   frontier   = Speculative proposals published by physicists
   exploratory= this project's own ideas and visitors' hypotheses — NOT mainstream physics
   lens       = analogies and history that help thinking (shown in every edition) */
Chrono.TIER_OF_TAG = { ESTABLISHED: "mainstream", CONTESTED: "mainstream", SPECULATIVE: "frontier", HYPOTHESIS: "exploratory", ANALOGY: "lens", RULEDOUT: "mainstream" };
Chrono.TIER_LEVEL = { lens: 1, mainstream: 1, frontier: 2, exploratory: 3 };
Chrono.tierOf = x => x.tier || Chrono.TIER_OF_TAG[x.tag] || "mainstream";

Chrono.CAMPS = [
  { id: "lens",   name: "Lenses",           desc: "Philosophy and analogy: ways of seeing, not physics." },
  { id: "origin", name: "Origins & arrows", desc: "Where time starts, and why it points one way." },
  { id: "less",   name: "Less time",        desc: "Time is not fundamental: it emerges from something timeless." },
  { id: "more",   name: "More dimensions",  desc: "Time or space is richer than 3 + 1." },
  { id: "cosmos", name: "Cosmos & expansion", desc: "How the universe grows, and what drives it." },
  { id: "found",  name: "Foundations",      desc: "The mainstream frameworks the holes appear in." },
  { id: "bench",  name: "Constraints",      desc: "Results that any idea about time must get past." }
];

Chrono.CONSTRAINTS = [
  { id: "rel",    name: "Matches relativity tests", short: "Relativity" },
  { id: "pred",   name: "Present predicts future",  short: "Predictable" },
  { id: "matter", name: "Allows stable matter",     short: "Stable matter" },
  { id: "arrow",  name: "Explains the arrow",       short: "Arrow" },
  { id: "test",   name: "Makes a new testable prediction", short: "New test" }
];

Chrono.HOLES = [
  { id: "H1", name: "Two clocks that disagree", tag: "ESTABLISHED",
    plain: "Quantum mechanics runs on one universal background clock. General relativity says no such clock exists. When physicists merged the two (the Wheeler–DeWitt equation), time dropped out altogether.",
    why: "This is the 'problem of time' in quantum gravity. It is not a gap in data; it is a clash between our two best theories about what time even is." },
  { id: "H2", name: "Time isn't measured like space", tag: "ESTABLISHED",
    plain: "In quantum mechanics, position is something you measure. Time is only a label on the measurements. Pauli showed in 1933 that time can't simply be promoted to a measurable quantity in the standard theory.",
    why: "Relativity insists space and time are a package. Quantum mechanics treats them completely differently. Both theories work, so something deeper is unresolved." },
  { id: "H3", name: "Why the arrow?", tag: "ESTABLISHED",
    plain: "The laws are (almost) the same run forwards or backwards, yet eggs never unbreak. The arrow traces back to the universe starting in an extraordinarily ordered state — Penrose put the odds at 1 in 10^(10^123).",
    why: "That starting condition (the 'Past Hypothesis') is assumed, not explained. The direction of time rests on it." },
  { id: "H4", name: "No 'now'", tag: "CONTESTED",
    plain: "In relativity, all moments exist together as a 'block'. Nothing in the equations marks the present or makes it move.",
    why: "Einstein said the problem of the Now worried him seriously. Some physicists argue relativity doesn't force the block view — hence Contested." },
  { id: "H5", name: "Why one time dimension?", tag: "ESTABLISHED",
    plain: "Three space dimensions, one time dimension. Nobody has derived why. The best-known argument (Tegmark) explains why observers would find themselves here, which is not the same thing.",
    why: "If there's no derivation, the number is an input, not an output — the kind of thing physicists expect a deeper theory to explain." },
  { id: "H6", name: "What came 'before'?", tag: "ESTABLISHED",
    plain: "The Big Bang model describes the universe evolving from a hot, dense state. It does not describe an origin, and the equations break down before they reach one.",
    why: "'Before the Big Bang' may be meaningless, a real earlier phase, or a place where time turns into something else. All three have serious advocates." },
  { id: "H7", name: "Time at the edge: black holes", tag: "ESTABLISHED",
    plain: "Seen from outside, time freezes at a black hole's horizon. Inside, space and time swap roles: moving 'forward in time' means moving toward the centre. What happens to information that falls in is unresolved.",
    why: "Black holes are where gravity and quantum theory meet head-on, so they are where the problem of time becomes concrete." }
];

Chrono.IDEAS = [
  { id: "minkowski", year: 1908, name: "Spacetime", who: "Einstein, Minkowski", camp: "found", holes: ["H4","H5"], tag: "ESTABLISHED", outcome: "Mainstream",
    plain: "Space and time form one four-dimensional geometry. Moving clocks run slow; observers disagree about what is simultaneous.",
    why: "It unified the experiments of the day and has passed every test since — GPS corrects for it daily.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "no", test: "yes" },
    note: "Describes time superbly but says nothing about why it has a direction or a present." },

  { id: "kk", year: 1921, name: "A hidden fifth dimension", who: "Kaluza (1921), Klein (1926)", camp: "found", holes: ["H5"], tag: "SPECULATIVE", outcome: "Fringe → mainstream idea",
    plain: "Add one tiny, curled-up space dimension and gravity and electromagnetism fall out of one equation.",
    why: "Einstein sat on Kaluza's paper for two years. Ignored for decades, the idea became the template for string theory's extra dimensions.",
    c: { rel: "yes", pred: "yes", matter: "unk", arrow: "na", test: "part" },
    note: "Pattern: an extra dimension proposed for elegance, not evidence. The extra dimension itself has never been detected." },

  { id: "bergson", year: 1922, name: "Lived time vs physicists' time", who: "Bergson vs Einstein, Paris", camp: "lens", holes: ["H4"], tag: "ANALOGY", outcome: "Philosophy",
    plain: "The philosopher Henri Bergson publicly debated Einstein: the time we live through (duration) is not the time on a clock.",
    why: "Einstein replied that 'the time of the philosophers does not exist'. The debate arguably cost Einstein a Nobel citation for relativity.",
    c: { rel: "na", pred: "na", matter: "na", arrow: "na", test: "na" },
    note: "A lens on H4 — the gap between experienced 'now' and the block universe." },

  { id: "dunne", year: 1927, name: "Serial time", who: "J. W. Dunne, An Experiment with Time", camp: "more", holes: ["H4","H5"], tag: "SPECULATIVE", outcome: "Abandoned by physics",
    plain: "Each time dimension is observed from a higher one, in an infinite series. Dunne claimed dreams could glimpse the future.",
    why: "Not a physicist's theory, but hugely influential — on Priestley, Borges and others. It shows how 'more time' intuitions arise from the puzzle of the moving now.",
    c: { rel: "unk", pred: "unk", matter: "na", arrow: "na", test: "no" },
    note: "His dream-precognition experiments did not replicate." },

  { id: "lemaitre", year: 1931, name: "The primeval atom", who: "Georges Lemaître", camp: "origin", holes: ["H6"], tag: "ESTABLISHED", outcome: "Fringe → mainstream",
    plain: "The expanding universe began from a single dense 'atom'. Now called the Big Bang.",
    why: "Einstein initially called Lemaître's physics 'abominable'. Evidence (expansion, the cosmic microwave background) turned it mainstream.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "part", test: "yes" },
    note: "Gives time a starting point but not the reason the start was so ordered (H3)." },

  { id: "wf", year: 1945, name: "Signals from the future", who: "Wheeler & Feynman", camp: "origin", holes: ["H3"], tag: "CONTESTED", outcome: "Dormant, revived",
    plain: "Radiation goes both forwards and backwards in time; we only see the forward part because of how the rest of the universe absorbs it.",
    why: "It puts the arrow of radiation into cosmic boundary conditions rather than the laws. Revived later in the transactional interpretation of quantum mechanics.",
    c: { rel: "yes", pred: "part", matter: "yes", arrow: "part", test: "no" },
    note: "Needs a condition on the future (a perfect absorber) — predictability becomes global, not local." },

  { id: "godel", year: 1949, name: "A universe with time loops", who: "Kurt Gödel", camp: "less", holes: ["H4","H1"], tag: "CONTESTED", outcome: "Valid maths, not our universe",
    plain: "A rotating universe that solves Einstein's equations and contains loops in time.",
    why: "Gödel's aim was philosophical: if relativity permits such worlds, then objective passing time can't be fundamental.",
    c: { rel: "yes", pred: "no", matter: "yes", arrow: "na", test: "yes" },
    note: "It predicts a rotating universe. Ours isn't measurably rotating, so it isn't our universe — but the argument about time stands." },

  { id: "wdw", year: 1967, name: "The equation with no time", who: "Wheeler, DeWitt", camp: "less", holes: ["H1","H2"], tag: "ESTABLISHED", outcome: "Mainstream problem",
    plain: "Applying quantum rules to the whole universe gives an equation, HΨ = 0, in which time does not appear at all.",
    why: "This is where the 'problem of time' becomes unavoidable. Everything in the 'less time' camp starts here.",
    c: { rel: "yes", pred: "part", matter: "na", arrow: "no", test: "no" },
    note: "Not a repair attempt — the discovery of the hole." },

  { id: "dorling", year: 1970, name: "Two times make matter unstable", who: "Jeremy Dorling", camp: "bench", holes: ["H5"], tag: "ESTABLISHED", outcome: "Absorbed (Tegmark)",
    plain: "With two time dimensions, energy acts like an arrow on a plane. Particles could then decay into heavier particles — ordinary matter wouldn't be stable.",
    why: "A kinematic result: conservation laws stop forbidding decays they forbid in our universe.",
    c: { rel: "na", pred: "na", matter: "na", arrow: "na", test: "na" },
    note: "A hurdle every multi-time idea must clear. (Boot error ERR_MATTER_UNSTABLE.)" },

  { id: "pathria", year: 1972, name: "The universe as a black hole", who: "R. K. Pathria", camp: "origin", holes: ["H6","H7"], tag: "SPECULATIVE", outcome: "Revived repeatedly",
    plain: "Our observable universe has roughly the size and mass for which it would sit inside its own horizon.",
    why: "A numerical coincidence that keeps attracting attention; it links the origin question to black holes.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "unk", test: "part" },
    note: "Pattern: a coincidence of numbers as a starting point — the same move as Dirac's large numbers." },

  { id: "hh", year: 1983, name: "No boundary: time becomes space", who: "Hartle & Hawking", camp: "origin", holes: ["H6","H3"], tag: "CONTESTED", outcome: "Open",
    plain: "Near the beginning, time turns into a space-like direction. Asking what came before the Big Bang is like asking what is north of the North Pole.",
    why: "It removes the need for a 'first moment'. Hawking later claimed the arrow would reverse if the universe recollapsed — then called that his greatest mistake after Don Page showed the error.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "part", test: "part" },
    note: "Closest mainstream idea to 'time wrapping' — time is not an infinite line at the start." },

  { id: "pw", year: 1983, name: "Time from entanglement", who: "Page & Wootters", camp: "less", holes: ["H1","H2"], tag: "CONTESTED", outcome: "Open; lab analogues",
    plain: "The universe as a whole is static. 'Time' is the correlation between one part (a clock) and the rest.",
    why: "It turns the timeless Wheeler–DeWitt equation from a disaster into a feature. A 2013 photon experiment demonstrated the idea in miniature.",
    c: { rel: "part", pred: "yes", matter: "yes", arrow: "no", test: "part" },
    note: "Original form is non-relativistic; relativistic versions are active research." },

  { id: "smolin", year: 1992, name: "Universes born in black holes", who: "Lee Smolin", camp: "origin", holes: ["H6","H7"], tag: "SPECULATIVE", outcome: "Open, under strain",
    plain: "Each black hole spawns a new universe with slightly changed constants — cosmic natural selection favours universes that make many black holes.",
    why: "Unusually for a speculative cosmology, it made a falsifiable prediction: an upper limit on neutron-star mass.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "na", test: "yes" },
    note: "Neutron stars of about two solar masses (found since 2010) are widely seen as a problem for it." },

  { id: "thermal", year: 1994, name: "Thermal time", who: "Connes & Rovelli", camp: "less", holes: ["H1","H3"], tag: "SPECULATIVE", outcome: "Open",
    plain: "Time's flow isn't in the laws; it comes from our incomplete, statistical knowledge of a system — like temperature.",
    why: "It explains why the timeless fundamental theory can look timeful to observers who can't see every detail. An example of emergence: the everyday flow of time appearing from a deeper, timeless description, as temperature appears from moving molecules.",
    c: { rel: "yes", pred: "yes", matter: "na", arrow: "part", test: "no" },
    note: "Scale and coarse-graining create time — emergence, not addition." },

  { id: "tegmark", year: 1997, name: "Why 3+1?", who: "Max Tegmark", camp: "bench", holes: ["H5"], tag: "CONTESTED", outcome: "Widely cited",
    plain: "Other combinations of space and time dimensions lose predictability or stable structures. Observers should expect to find 3 space + 1 time.",
    why: "It combines hard maths with an 'observers can only exist here' argument — the maths is established, the conclusion is contested.",
    c: { rel: "na", pred: "na", matter: "na", arrow: "na", test: "na" },
    note: "The map behind Boot a Universe." },

  { id: "bars", year: 1998, name: "Two-time physics", who: "Itzhak Bars", camp: "more", holes: ["H5"], tag: "SPECULATIVE", outcome: "Open, niche",
    plain: "Our world is a 'shadow' of a 4+2 world with two times. A gauge symmetry, Sp(2,ℝ), removes the pathologies of the extra time.",
    why: "Different one-time theories turn out to be different shadows of one two-time theory — a hidden unity.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "na", test: "part" },
    note: "Pattern: the constraints that make it consistent also collapse it to one effective time." },

  { id: "barbour", year: 1999, name: "The End of Time → the Janus point", who: "Julian Barbour (later with Koslowski, Mercati)", camp: "less", holes: ["H1","H3","H4","H6"], tag: "CONTESTED", outcome: "Open",
    plain: "Time is nothing but change. The universe is a collection of 'nows'. Later: from a point of minimum complexity, arrows of time point away in both directions.",
    why: "It removes time as a background entirely and gets an arrow without assuming a special start.",
    c: { rel: "part", pred: "yes", matter: "na", arrow: "yes", test: "unk" },
    note: "Two arrows, one on each side of the Janus point — 'before the Big Bang' is another 'after'." },

  { id: "cc", year: 2004, name: "Spontaneous inflation", who: "Carroll & Chen", camp: "origin", holes: ["H3","H6"], tag: "SPECULATIVE", outcome: "Open",
    plain: "Baby universes nucleate from an empty background in both time directions, so the arrow is symmetric on the largest scales.",
    why: "It tries to explain the low-entropy start instead of assuming it.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "yes", test: "no" },
    note: "Explains the arrow at the cost of a much larger unobservable structure." },

  { id: "ccc", year: 2005, name: "Conformal cyclic cosmology", who: "Roger Penrose", camp: "origin", holes: ["H3","H6"], tag: "CONTESTED", outcome: "Open, disputed evidence",
    plain: "The universe is an endless series of aeons; the infinitely expanded end of one becomes the Big Bang of the next.",
    why: "It addresses the ordered start (H3) through a geometric reset. Penrose's team claims signals ('Hawking points') in the microwave background.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "part", test: "yes" },
    note: "The claimed Hawking points are disputed by other analyses." },

  { id: "cw", year: 2009, name: "Predictability with two times", who: "Craig & Weinstein", camp: "bench", holes: ["H5"], tag: "ESTABLISHED", outcome: "Established maths",
    plain: "With two times, the present generally can't predict the future — unless the present obeys a strange non-local constraint.",
    why: "Shows multi-time physics isn't simply impossible; it's expensive. You pay with freedom over the present.",
    c: { rel: "na", pred: "na", matter: "na", arrow: "na", test: "na" },
    note: "The basis of the Two Films demo." },

  { id: "surrey", year: 2025, name: "Opposing arrows in open quantum systems", who: "Guff, Shastry, Rocco (Surrey)", camp: "origin", holes: ["H3"], tag: "CONTESTED", outcome: "New",
    plain: "Derived without choosing a direction, the equations for a system in an environment relax toward equilibrium in both directions of a single time.",
    why: "It suggests the arrow is imposed by us choosing a direction, not written in the equations. Nothing to do with a second time dimension.",
    c: { rel: "na", pred: "yes", matter: "na", arrow: "part", test: "no" },
    note: "Headlines said 'time flows both ways'. The paper is a mathematical model result." },

  { id: "pettini", year: 2025, name: "Entanglement via a second time", who: "Pettini et al.", camp: "more", holes: ["H5","H1"], tag: "SPECULATIVE", outcome: "New",
    plain: "In a (3,2) spacetime, quantum entanglement could arise from local causes travelling through the extra time.",
    why: "Entanglement's 'spooky' non-locality is one of physics' deepest puzzles; an extra time is offered as the hidden channel.",
    c: { rel: "part", pred: "unk", matter: "unk", arrow: "na", test: "part" },
    note: "A 2026 follow-up proposes a test. Must still clear Dorling's and Craig–Weinstein's hurdles." },

  { id: "kletetschka", year: 2025, name: "Three-dimensional time", who: "Gunther Kletetschka", camp: "more", holes: ["H5"], tag: "SPECULATIVE", outcome: "New; little uptake",
    plain: "Time has three dimensions; space is a secondary effect. Claims to reproduce particle masses.",
    why: "Heavily amplified in press. The key question for the test bench: are the masses new predictions or fits to known values?",
    c: { rel: "unk", pred: "unk", matter: "unk", arrow: "na", test: "part" },
    note: "Case study in press amplification. Must clear the same hurdles as every multi-time idea." },

  { id: "bhu", year: 2025, name: "We live inside a black hole", who: "Gaztañaga et al.; others", camp: "origin", holes: ["H6","H7"], tag: "SPECULATIVE", outcome: "New",
    plain: "Our universe formed from a collapse and bounce inside a black hole in a larger universe.",
    why: "Revives Pathria's coincidence with modern tools, and ties the start of time to black-hole physics.",
    c: { rel: "yes", pred: "yes", matter: "yes", arrow: "unk", test: "part" },
    note: "Media coverage often also cites JWST galaxy-rotation claims, which are separately disputed." },

  { id: "ai", year: 2026, name: "Time as seen by a language model", who: "Chronoscope project", camp: "lens", holes: ["H1","H4"], tag: "ANALOGY", outcome: "Lens",
    plain: "A trained model is static weights; its only 'time' is the order of text in a conversation. Five minutes or five days between messages feel identical unless it's told the date.",
    why: "Structurally close to Page–Wootters: time as correlation inside a static whole. Watching a being with 'thinner' time is Flatland one level down.",
    c: { rel: "na", pred: "na", matter: "na", arrow: "na", test: "na" },
    note: "An intuition pump, not evidence." }
];
