# spec.md — Chronoscope (v3, 2026-09-24)

v1, v2 archived in `archive/`. Rationale: `reviews/reviews.md`, `learning.md`.

## Audience and purpose (v3)
- **Primary:** Will, learning the topic from zero; **secondary:** friends, as a shared discussion tool.
- **Purpose:** find the places where our account of time doesn't add up, see what physicists have tried, and overlay looser ideas — to *predict and challenge*, not prove.
- Two camps respond to the same holes: **more time** (richer than one axis) and **less time** (time emerges from something timeless).

## Layer 0 — The Atlas  ✅ Build 1 done
- **Holes (H1–H7):** problem of time · time not an observable · why the arrow · no 'now' · why one time dimension · what came before · black holes.
- **Attempts:** ~25 ideas, 1908–2026, placed by year in camp lanes (Lenses, Origins & arrows, Less time, More time, Foundations, Constraints), arcs to the holes they target.
- **Test bench:** every attempt scored against the same five hurdles (relativity, predictability, stable matter, arrow, new testable prediction). Scores are Claude's first pass, open to challenge.
- **Your hypotheses:** add loose ideas (camp, holes, prediction, what would kill it); stored in the browser; export/import JSON to share with friends.
- Data lives in `src/data.js` — adding an idea is one object.

## Lens — Flatland tab  ✅ Build 1.1 done
Why multiple dimensions are hard for 3+1 minds to picture, and how slicing works. Seven chapters:
1. **Meet A Square** — top view vs his 1D view (ray-cast strip, depth as fog, per Abbott).
2. **The Sphere visits** — 3D view + top view + strip; exact slice radius √(R² − z²).
3. **Building up dimensions** — point → line → square → cube → tesseract → 5D (TED-Ed method); corners/edges/squares/cubes table with predict-then-reveal.
4. **Our turn: a 4D visitor** — "squashed 3D + w axis" diagram (from Will's video) with a hypersphere crossing w = 0; 3D slice radius √(R² − w²). Notes that w here is *space*, not time.
5. **Hypercone: 3D conics** — tilted slices give sphere / ellipsoid / paraboloid / hyperboloid; inset shows the 2D conic that the 3D shape is spun from.
6. **Tesseract: slices & shadows** — exact slices through the 8 cubic cells, cube-/face-/edge-/corner-first, with a Flatland analog (cube through a plane); plus the rotating shadow (XY, XW, YW, ZW).
7. **Time as a slice** — Flatland's history as a 3D block; 'now' as a moving slice; the Sphere's visit is a sphere in the block. Links to hole H4; sets up Two Films.
Tags: ANALOGY (the story) + ESTABLISHED (the geometry).

## Build 2 (2026-09-24) ✅
- **Edition / tier system:** Mainstream · Frontier · Exploratory · Lens. Header "Show" switch; `?edition=school` hides exploratory. Exploratory items: dashed outlines, "◌ Exploratory" banners, a separate right-hand column in the Atlas.
- **Atlas expansion:** holes H8 (cosmic energy), H9 (what is empty space made of), H10 (expansion rate), H11 (what is a dimension — exploratory). ~20 new ideas (Michelson–Morley, Noether, tired light, foam, Tryon, Prigogine, Unruh, Jacobson, ADD, Randall–Sundrum, DGP, ekpyrotic, Volovik, CDT, timescape, river model, CPT universe, Hubble tension, DESI, Victorian 4D spiritualism). Will & Claude exploratory: membrane-ocean, turbulent time river, time as a dimension group, interwoven universes.
- **Labs:** Field Ocean (Klein–Gordon field; matter as ripples; light vs matter speed budget), Clock Lab (light clock; GPS orbit clocks with real numbers), River (Gullstrand–Painlevé river model; optional exploratory eddy overlay), Two Films (exact two-time solutions + reveal).
- **Pages:** Dimension Map (exploratory framework, level 3 only), How sure are we? (expansion vs tired light, the claim ladder).
- See `HANDOVER.md` for hosting and the school edition.

## Modes (D-023)
**Learn** (default): Mainstream + Frontier + Lens, guided. **Lab**: adds Exploratory content and the ◌ Workbench menu (exploratory ideas, hypothesis tools, Dimension Map). Filters (show-only, by approach and by tag) are in both modes (D-039).

## Learning layer (D-026, D-027)
Home (hook + doors) · 7-stop tours · Predict first per lab · Picture it + Common trap per lab · end-of-tour quiz + spaced review (D-037) · progress marks · glossary · reasons for every non-✓ bench score and visitor's own scores · predicts / overturned-by for every physics idea.

## Scales, threads and tours (D-031, D-036)
Four scales, smallest first: **Quantum** (Delayed choice, The frozen universe) · **Voyages** (Mission clocks, Talking to Mars, The 1 g voyage, Earth's energy budget) · **Physics** (Flatland, Field Ocean, Clock Lab, Spacetime, River, Black holes evaporate, Entropy box, Two Films, Wormholes, Time loops) · **Cosmos** (Cosmic timeline, Expanding universe, Cosmic horizons, Boot a Universe, The Janus point). Four threads cross them (clocks · 'now' · arrow · 3 + 1). Three tours: *The puzzle of time* · *From the ISS to the edge of the universe* · *Is time travel possible?* Concepts pages (D-034) give the full story behind each lab.

## Tags (v3)
ESTABLISHED · CONTESTED · **RULED OUT** (Mainstream) · SPECULATIVE (Frontier) · **HYPOTHESIS** (Exploratory: ours and visitors') · **ANALOGY** (Lens)

## Hook
**"Why does our universe have exactly one time dimension?"**
Honest answer the visitor reaches: physics has strong constraints, not a settled, model-independent answer.

## Structure: two investigations, one workspace
These are **independent questions**. The UI must never imply one answers the other.
- **Investigation I — How many time dimensions?** What changes when an equation gains a second time coordinate.
- **Investigation II — Which way does time point?** Why irreversibility appears along a *single* time coordinate.
Bridge: a visitor-controlled side-by-side comparison, not a claim that the theories agree.

## Claim-tagging rules
- Tag **claims, not papers.** "This equation has two valid solutions" = ESTABLISHED (maths); "our universe obeys it" = SPECULATIVE.
- Every simulation shows a **Model assumption** line (e.g. "Assumes the metric ds² = dt₁² + dt₂² − dx²").
- Every claim links to `sources.md`.

## Learning outcomes
1. Clocks can disagree in our one-time universe; that is not evidence of extra time.
2. Adding a time coordinate changes the *type* of equation; a generic present no longer fixes the future.
3. Even a perfectly accurate snapshot of "now" can be insufficient with two times (Two Films).
4. The arrow of time and the number of time dimensions are separate questions.
5. The laws are *nearly* time-symmetric (small measured violation); everyday irreversibility has a different origin.
6. Multi-time theories exist, are speculative, and differ in what they would have to predict.

---

## Entrance — Boot a Universe
Console-style hub. Visitor chooses (n space, m time) and presses **BOOT**. System returns a boot log ending in success (3,1) or a specific failure:
`ERR_ORBIT_UNSTABLE` · `ERR_NO_EVOLUTION` · `ERR_ILL_POSED` · `ERR_MATTER_UNSTABLE` · `WARN_TOO_SIMPLE` · `WARN_TACHYONIC`
Each failure opens its live demo. Grid view (Tegmark's diagram) available as a map of all boot results.
**Tag:** Tegmark's overall conclusion **CONTESTED** ("for the classes of laws considered, 3+1 has especially favourable conditions"). Individual mathematical facts tagged separately.

**Misconception card (small):** Twin clocks — dτ = dt√(1 − v²/c²). Speed + duration sliders; clocks reunite showing different elapsed times. "Different clock readings don't need another time dimension." ESTABLISHED.

---

## Investigation I — How many time dimensions?

### I.1 Boot failures (from the Entrance)
| Error | Demo | Equation | Tag |
|---|---|---|---|
| ERR_ORBIT_UNSTABLE (n>3, m=1) | Orbit with continuous n slider 2.0→5.0 + nudge | F ∝ 1/r^(n−1), velocity-Verlet | ESTABLISHED (maths) |
| WARN_TOO_SIMPLE (n<3, m=1) | 2D network: wires can't cross | 2+1 gravity has no local d.o.f. | Gravity ESTABLISHED; complexity argument CONTESTED |
| ERR_NO_EVOLUTION (m=0) | Laplace relaxation; drag boundary, interior snaps; no clock | ∇²φ = 0 | ESTABLISHED |
| ERR_ILL_POSED (m≥2) | → I.3 Mode Explorer | u_tt + u_ss − u_xx = 0 | ESTABLISHED (maths) |
| ERR_MATTER_UNSTABLE (m≥2) | Energy-vector triangle: drag product energy vectors in the (E₁, E₂) plane; parent of mass m decays into products with m₁ + m₂ > m because vectors partially cancel. Contrast 1-time case (collinear, m ≥ m₁ + m₂ forced) | E = E₁ + E₂, \|Eᵢ\| ≥ mᵢ | ESTABLISHED (kinematics permits it; whether it happens depends on dynamics) |
| WARN_TACHYONIC (n=1, m≥2) | Text + diagram | — | verify against Tegmark Fig. 1 |
Note: orbit instability is a **space**-dimension result. Never show orbits "breaking" because of a second time.

### I.2 Future Compass  (opening image of Investigation I)
Rotate a glowing direction arrow in the (t₁, t₂) plane. Readout of ds² = dt₁² + dt₂² − dx².
- One-time mode: rotating from +t to −t must pass through spacelike; future and past cones are separate.
- Two-time mode: at dx = 0 the arrow stays timelike all the way from +t₁ to −t₁ → no clean future/past split.
- Caption: "Geometry of an assumed metric — not a claim that anyone can travel into their past."
**Tag:** ESTABLISHED maths; SPECULATIVE physical premise.
(This absorbs the "evolution angle" idea: the equation is rotationally symmetric in (t₁, t₂), so no direction is special.)

### I.3 Mode Explorer
Sliders: k_x (space frequency), k_s (second-time frequency), tiny starting amplitude.
- |k_s| < |k_x| → oscillates at ω = √(k_x² − k_s²).
- |k_s| > |k_x| → grows as cosh(λt), λ = √(k_s² − k_x²).
- Spectrum view shows *which* modes grow. Add many random modes → tiny noise explodes.
- **Constraint toggle:** restrict to |k_s| ≤ |k_x| (Craig & Weinstein) → stable.
- **Sound (optional, mute default):** each mode sounds at ω; crossing into growth replaces pitch with a swelling amplitude at rate λ. Visual equivalent always present.
- All values from **exact Fourier solutions**, not numerical integration.
**Tag:** ESTABLISHED maths within the model.

### I.4 Two Films  ← the "aha"  ✅ built (Build 2, `src/labs.js`)
Periodic x-strip. Visitor saves everything on the starting slice t = s = 0 (u, ∂ₜu, ∂ₛu) and presses **Predict**. Two films play from the identical frame and diverge.
- u_A = cos(2x)·cos(2t)
- u_B = u_A + ε·cos(3x)·[cos(3t) − cos(√5 t)·cos(2s)]
- Both solve u_tt + u_ss − u_xx = 0; identical data at t = s = 0; all modes non-growing. (Verified.)
- **Reveal:** slice view opens the hidden s-direction; their data away from s = 0 always differed.
- Closing line: **"The frame was accurate. It just wasn't enough data."**
- Slice view: an observer path through the (t, s) plane; features appear and vanish as the path cuts the surface.
**Tag:** ESTABLISHED maths (toy instance of Craig & Weinstein non-uniqueness); physical relevance SPECULATIVE.

---

## Investigation II — Which way does time point?  (one time coordinate throughout)

### II.1 Two Arrows
- **Exact simple model (Pauli two-state):** p(t) = ½ + (p₀ − ½)·e^(−2γ|t|). Entropy rises away from t = 0 in both directions. Controls: p₀, γ, choice of origin. Label: "Simplified demonstration, not the full quantum bath of the Surrey paper."
- **Spectacle model (harmonic chain):** ~200 oscillators, velocity-Verlet (exactly reversible). Excite one at t = 0; integrate both ways; tagged energy decays symmetrically. Buttons: reverse velocities (Loschmidt echo refocuses); add noise first (refocusing fails).
- **Cosmic model (Janus point):** Newtonian N-body (~50–150 bodies, zero energy and angular momentum). From the moment of minimum complexity, integrate both directions; complexity/clustering grows away from it both ways. The cosmological twin of the Pauli "V". Label: Barbour–Koslowski–Mercati model; cosmological interpretation CONTESTED.
**Tag:** Model results ESTABLISHED; broader interpretation of Surrey CONTESTED.

### II.2 Almost symmetric
Card: time-reversal violation measured directly in neutral B mesons (BABAR 2012). Tiny, microscopic, and not why eggs don't unbreak. ESTABLISHED.

### II.3 Measured anchor
Card: Landauer's principle probed in a quantum many-body system (Nature Physics 2025): the energy cost of erasing information, measured. ESTABLISHED (experiment); link to the arrow is interpretive.

---

### II.4 Memory and records
Narrative thread: records (memories, photographs, fossils) form in the direction entropy increases — which is why we remember the past, not the future. Ties II.1 to II.3. CONTESTED as a full explanation; widely held.

### II.5 Cards beyond the arrow
- **Time from entanglement (Page–Wootters, 1983):** a static universe in which a subsystem clock and the rest are correlated; time emerges internally. ESTABLISHED formalism; cosmological relevance CONTESTED. Bridge to Reality OS.
- **Indefinite causal order (quantum switch):** photonic experiments put the *order* of two operations in superposition — non-classical order without a second time dimension. ESTABLISHED (experiment); interpretation CONTESTED.

---

## Case Files — the frontier
Each: claim · status · what it would have to predict · what would change our mind · sources. No fake "simulation" of these theories.
- **Bars — two-time physics (4+2):** an Sp(2,ℝ) gauge symmetry removes ghosts; gauge constraints relate different effective one-time descriptions. SPECULATIVE as physics.
- **Pettini — (3,2) spacetime and entanglement (2025; follow-up preprint 2026):** extra time used to model entanglement without nonlocal causation; proposes a test. SPECULATIVE.
- **Kletetschka — three-dimensional time (2025):** claim file; separate *fits to known values* from *new predictions*. SPECULATIVE.
- **"The future is a terrain, not a line":** what a two-time observer might experience — and where that speculation breaks (no derivation of experience from the metric alone). SPECULATIVE.

---

## Build order
(Planned steps. Delivery builds in `todo.md` are named separately — "Build 2" there is the tiers/labs release, not step 2 here.)
0. ✅ Atlas + Test bench + hypotheses (Build 1)
0b. ✅ Flatland lens (Build 1.1)
1. Entrance: Boot a Universe + ERR_ORBIT_UNSTABLE demo; later, 'load a theory' from the Atlas into the console
2. I.4 Two Films (the aha) + I.3 Mode Explorer (shared exact-mode engine) + ERR_MATTER_UNSTABLE
3. I.2 Future Compass
4. Investigation II (Pauli, harmonic chain, Janus point, cards)
5. Remaining boot demos, Case Files, twin clocks
6. Deferred: prediction wager, claim ledger, Reality OS shell

## Non-goals (v1)
- No simulation of Bars/Pettini/Kletetschka theories.
- No JWST, holography, Wigner's friend (Reality OS, later).
