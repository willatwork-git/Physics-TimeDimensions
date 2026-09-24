# learner-review.md — Chronoscope through a learner's eyes (2026-09-24)

**Lens:** someone curious about how the universe works, with no physics training, who arrives on the
live site cold. Method: read every on-screen text in the order a visitor meets it, screenshot every
view at 1440×900 and 1280×800, trace where each view sends you next. Claude's review; decisions Will's.

## Verdict

The parts are good and the rigour is rare. Every lab runs real equations; the tagging is honest; the
writing in the labs is short, concrete and well paced, and the **Try:** boxes are the best single
device in the app. Flatland is a genuinely excellent seven-step lesson.

The app is **organised as a research notebook, not a learning journey**. It opens on its densest view
(49 overlapping labels), it has no path through, the labs don't hand you on to each other, and its
central method — *say what it predicts, say what would kill it* — is visible on only 4 of 49 ideas.
The fixes are mostly structural and cheap; the content is already there.

## What already works — keep it

- **Try: boxes** — a specific action, then a question. The pattern to copy everywhere.
- **Flatland** — chapters, Next →, predict-then-reveal in ch. 3, and ch. 7 hands you on to H4 and Two
  Films. This is the model for the rest of the app.
- **Two Films' closing line** — "The frame was accurate. It just wasn't enough data." Memorable.
- **How sure are we?** — teaches method, not answers. The classroom prompt is a gem.
- **Model-assumption lines and honesty notes** ("Grid effect: ~0.99 c", "Sideways light-bending
  simplified"). These build trust; learners notice.
- **Clock Lab GPS numbers** — real, surprising, checkable. "Kilometres per day" lands.

## The six biggest problems, ranked

### 1. The front door is the hardest room
First screen = the Atlas: 11 holes, 49 rotated labels, arcs everywhere, a toolbar of 12 filter chips,
and a four-paragraph aside. At 1280 px the 1990–2026 region is an unreadable knot. A newcomer can't
tell what to do first, and the hook — *why one time dimension?* — never appears on screen.

### 2. No path
Nine peer tabs, no suggested order, no sense of progress. Only Flatland has Next →. The labs are
islands: Clock Lab never mentions the River (same effect, gravity instead of speed) or Field Ocean
(why moving clocks slow: mass is an internal clock). The natural sequence exists; the app hides it.

### 3. The method is invisible where it matters most
Only the 4 exploratory ideas have *Would predict* / *Would be killed by*. The 45 physics ideas —
the ones a learner should learn the method from — don't. The Test bench shows ✓ ◐ ✗ with **no
reason per cell**, so "Spacetime ✗ Arrow" teaches nothing and can't be argued with.

### 4. Foundations are assumed
The app explains the *holes* before the *floor*. Nowhere does a learner see relativity of
simultaneity (the reason there's no universal "now"), what entropy is (the arrow), or why light speed
is a limit. Flatland ch. 7 asserts the block universe; no lab shows why relativity implies it.
Unexplained on first use: Wheeler–DeWitt (in H1's opening), km/s/Mpc, equilibrium, open quantum
system, HΨ = 0.

### 5. Insider voice in a public app
Visitors don't know who Will is. On-screen: "the video Will shared", "Will's candidate", "Will's
membrane idea", "Will & Claude's own thinking", and "This demo came from the ChatGPT review; Claude
verified every step" (Two Films). Worse, Field Ocean — a **Mainstream** lab — has the eyebrow
"Lab · matter from the membrane", leaking an exploratory term into mainstream framing (against D-017).

### 6. Nothing brings you back or lets you share
No deep links: you can't send someone "look at H5" or "Flatland chapter 7", and the browser Back
button leaves the app. No memory of where you were or what you've seen. Hypotheses, once saved, sit
there — nothing asks you to test them.

## Accuracy and labelling fixes found on the way

| Where | Issue | Fix |
|---|---|---|
| Atlas: Tired light, Serial time | Tagged SPECULATIVE (Frontier = "not yet supported by evidence") but outcomes are "Tested and ruled out" / "Abandoned" | Add a **RULED OUT** status (Mainstream tier). Failed ideas are the best method teachers |
| Flatland ch. 7 | "That's the block universe — and it's exactly why physics has no 'now'" — untagged, stronger than H4, which is CONTESTED | "…and why many physicists say the equations contain no 'now' (contested — see H4)" |
| Field Ocean | "Massive field — like an electron": electrons obey the Dirac equation, not Klein–Gordon | "like any particle with mass" (or note each component of the electron field also obeys it) |
| Field Ocean | Eyebrow "matter from the membrane" on a Mainstream lab | "Lab · particles as ripples" |
| Dimension Map | "Holographic direction" card credits the drop to ~2 dimensions to AdS/CFT; that result is CDT / asymptotic safety | Move the claim to the CDT card; keep holography as zoom-level ↔ depth |

## Text — how to write for this reader

1. **Hook first.** Every entry point opens on a question, not a description. Atlas aside: start with
   "Physics' account of time has holes. Here are eleven, and a century of attempts to fill them."
2. **One sentence, then more.** Each hole and idea: a ≤15-word *In one line*, then the current text,
   then *Go deeper*. DESIGN.md already specifies this ("one-line claim → two-sentence explanation →
   Go deeper"); the Atlas doesn't do it yet.
3. **Explain a term the first time, inline, or link it.** A small glossary (≈25 terms: spacetime,
   field, entropy, horizon, redshift, light cone, proper time, megaparsec, equilibrium, quantum state,
   gauge, brane…) with dotted-underline hover. Units in human scale: "73 km/s for every 3 million
   light-years".
4. **Name people once, in an About.** On screen: "the authors' exploratory idea" or "an exploratory
   idea (from this project)"; the video credit goes in Sources by title and creator. Process notes
   (which AI proposed what) go in About, not in the lesson.
5. **End every view with the next question.** Flatland ch. 7 does it. Clock Lab: "Speed slows clocks.
   So does gravity — see it in the River →". River: "Near the horizon space and time swap roles.
   What if there were two times? → Two Films".

## Flow — a proposed shape

```
HOME  "Why does our universe have exactly one time dimension?"
      ├─ ▶ Take the tour (≈20 min)        ← new: the default for first-time visitors
      ├─ 🗺 Explore the map (Atlas)
      └─ 🧪 Play in the labs
```

**The tour** — one question per stop, each stop ends by posing the next:
1. *Do clocks agree?* — Clock Lab (light clock) → no.
2. *So is there a universal "now"?* — **Spacetime diagram** (new) → no: simultaneity depends on motion.
3. *Then what is "now"?* — Flatland 1, 2, 7 → a slice through a block. (Hole H4.)
4. *Why does time only go one way?* — **Entropy box** (new) → the laws don't care; the starting state does. (H3.)
5. *Why only one time direction?* — Two Films → with two, the present stops predicting the future. (H5.)
6. *So is one time a law?* — Atlas, H5 selected → "strong constraints, no settled answer". Here are the
   people who tried. Your turn: + Your hypothesis.

That is the README's hook, answered in six steps, using mostly existing labs.

**The Atlas** needs a calmer default: labels on hover/select only (dots and holes visible), or a
**hole-first story mode** — pick a hole and its attempts play out as a short timeline narrative
(1908 → 2025) with the constraints that killed or survived each.

## Stickiness — what makes people come back and go deeper

Ranked by value for effort:

1. **Predict first.** Before each lab runs, one committed guess: "At 0.87 c, how many ticks for every
   2 of yours?" / "Light fired outward just outside the horizon — escapes?" / "Will the two films stay
   identical?" Then reveal. Physics-education research finds students who *predict* before a demo
   learn measurably more than those who only watch (Crouch, Fagen, Callan & Mazur, *Am. J. Phys.* 72,
   835, 2004 ☐). Flatland ch. 3 already does this — extend it.
2. **Deep links** (`#flatland/7`, `#atlas/H5`, `#idea/tegmark`) and Back-button support. Cheap;
   unlocks sharing, classroom handouts and LinkedIn posts that land on a specific moment.
3. **Argue with the bench.** Every cell clickable: one-line reason + "I'd score it differently" →
   saved with hypotheses and exported. The core loop becomes *disagree with evidence*.
4. **Predicts / would kill it for every idea.** 45 short pairs. The Atlas becomes a catalogue of the
   scientific method in action, and ties directly to How sure are we?
5. **Progress marks** — a ✓ on visited labs and chapters, "continue where you left off"
   (localStorage, per-viewer only). Low effort, surprisingly motivating.
6. **The graveyard** — a ruled-out filter/gallery: aether, tired light, serial time, self-accelerating
   DGP. How ideas die is the most transferable lesson in the app, and it's oddly compelling.
7. **Hypothesis coach** — when a visitor adds an idea, walk it through the five bench hurdles as
   questions ("Does it survive Michelson–Morley?"), and self-score. Turns a text box into a thinking
   tool.
8. **Default Show level** for the public site: Mainstream + Frontier, with an invitation to switch on
   Exploratory. First impressions stay mainstream; the exploratory column remains one click away.
   (Will's call — it trades visibility of our ideas for clarity.)

## Models that would add value

Chosen for: fills a gap a learner hits, runs a real equation in plain JS, serves an Atlas hole.

| # | Model | What the learner does / sees | Physics | Serves | Tag |
|---|---|---|---|---|---|
| 1 | **Spacetime diagram** (new) | Drag events; slide a boost; watch lines of "now" tilt and event order swap for spacelike pairs. Twin paradox on the same diagram: two worldlines, count proper time | Lorentz transform; τ = ∫√(1 − v²/c²) dt | H4; foundation for Flatland 7, Two Films, Future Compass | ESTABLISHED |
| 2 | **Entropy box** (new) | Gas behind a partition; remove it; watch it spread; reverse every velocity → it un-mixes; add a tiny nudge first → it doesn't. Live count of arrangements (S = k ln W) | Hard-disc dynamics, time-reversible integrator; coarse-grained Boltzmann entropy | H3 — the most intuitive hole, currently with no lab | ESTABLISHED |
| 3 | **Boot a Universe** (planned, spec) | Choose (space, time) dimensions, press BOOT, get a named failure; orbit demo with a continuous n slider | F ∝ 1/r^(n−1), velocity-Verlet; Tegmark map | H5 — **the hook itself** | ESTABLISHED maths; conclusion CONTESTED |
| 4 | **Expanding universe** (new) | Galaxies on a stretching grid; click any one to stand on it — everyone sees Hubble's law; watch a light wave stretch in flight | Scale factor a(t) from Friedmann (matter + Λ sliders); λ ∝ a | H10, H8 (light losing energy), How sure are we? | ESTABLISHED |
| 5 | **A clock inside a frozen universe** (new) | One static quantum state shown whole; pick a clock reading and the "rest" is seen evolving. Flatland ch. 7 in quantum dress | Page–Wootters history state, Σ\|t⟩⊗U^t\|ψ₀⟩, small exact linear algebra | H1, H2 — gives the "less time" camp its first lab (the "more time" camp has Two Films) | ESTABLISHED formalism; relevance CONTESTED |
| 6 | **Cosmic timeline** (new) | Log-time zoom from the Planck era to today, with where each hole lives | Standard cosmological history | Orientation for H6, H3 | ESTABLISHED |

Already in the spec and still worth building after these: Mode Explorer (I.3), Future Compass (I.2),
Pauli two-state and Janus-point models (II.1). The Entropy box could replace the harmonic chain as
II.1's spectacle model — same reversibility lesson, far more intuitive.

## Suggested order

**Status:** Phase A delivered 2026-09-24 (D-023 – D-025), with one change from this plan: at Will's request the
split is two modes, **Learn** and **Lab**, rather than a default Show level. The project's deliberately fringe ideas are
kept intact in Lab.

**Phase A — make what exists teach (no new models).** Text fixes and accuracy table above; remove
insider voice; hook on every entry; next-question links between labs; deep links; RULED OUT status;
calmer Atlas default. *Days, not weeks; biggest learner gain per hour.*

**Phase B — the path.** *Delivered 2026-09-24 (D-026, D-027), except Flatland predict cards.* Home screen with three doors; the tour; predict-first prompts; progress marks;
bench reasons + "I disagree".

**Phase C — the models.** Spacetime diagram and Entropy box first (they unlock the tour), then Boot a
Universe, Expanding universe, the Page–Wootters clock, cosmic timeline.

Also still open from todo.md and relevant here: tablet/phone layout (many learners browse on an iPad),
keyboard access to the Atlas.
