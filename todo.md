# todo.md

Delivery builds are named by date/content below; spec.md "Build order" numbers the *planned* steps.

## Done
- [x] Atlas, Test bench, hypotheses (add/export/import) — delivery Build 1
- [x] Flatland tab (7 chapters) — Build 1.1
- [x] Tiers/editions, Atlas expansion, Field Ocean, Clock Lab, River, Two Films (I.4), Dimension Map, How sure are we?, Guide — delivery Build 2
- [x] Housekeeping (2026-09-24): public README + screenshots, .gitignore, import sanitising, reduced-motion fix, River timescale fix, Build 2 sources
- [x] Learner review Phase A (2026-09-24): Learn/Lab modes, deep links, RULED OUT, accuracy fixes, public voice, next-question chain, calm Atlas

## Will to decide
- [x] Licence — MIT code, CC BY 4.0 content (2026-09-24)
- [x] GitHub Pages live — https://willatwork-git.github.io/Physics-TimeDimensions/
- [ ] `learning.md` public or private

## Now
- [ ] Will: explore the Atlas; challenge scores; add hypotheses
- [ ] Verify ☐ citations in sources.md (Atlas, Build 2 section)

## Learner review — Phase B (the path) ✅ 2026-09-24 (D-026, D-027)
- [x] Home · 7-stop tour · Predict first (4 labs) · progress marks · glossary (33 terms) · bench reasons + own scores · predicts/overturned-by for 42 ideas
- [ ] Will: review `src/data3.js` (reasons, predictions, kill conditions) and the tour wording in `src/home.js`
- [x] Predict-first for Flatland chapters (Flatland has its own aside engine)

## Learner review — Phase C (new models)
- [x] Spacetime diagram (simultaneity + twins) · Entropy box — in the tour (D-030)
- [x] Voyages (3 labs), Cosmos (4 labs), drop-down nav, threads, Tour 2 (D-031)
- [x] Cosmic timeline (orientation, log-time) · a Voyages lab on the arrow thread (Earth's energy budget) — D-038
- [ ] README screenshots: add the home page and a Cosmos lab

## Roadmap (2026-09-25) — toward its own domain
Priority: credibility before launch; build what unlocks structure (Quantum scale, Tour 3) first.
### Phase 1 — Quick wins ✅ 2026-09-25 (D-035)
- [x] "Further exploring" links on Concepts pages (landscape-2026-09-25.md)
- [x] Newton vs Einstein switch on the 1 g voyage (after Lansdell)
- [x] Boot a Universe: Bars two-time note on (4, 2) — SPECULATIVE (reviews/reviews.md, 2026-09-25)
- [x] Predict-first for Flatland chapters
- [x] Launch basics: meta description, link preview (Open Graph image), favicon
### Phase 2 — Quantum and time travel ✅ 2026-09-25 (D-036)
- [x] Delayed-choice lab · Frozen universe (Page–Wootters) lab → Quantum scale (fourth scale)
- [x] Wormhole (Kruskal) lab · Time loop (Gödel) lab → Tour 3: Is time travel possible?
- [x] Concept pages: quantum time, time travel, holography, two-time physics
- [ ] Will: review the four labs' text and Tour 3 wording
### Phase 3 — Making it stick ✅ 2026-09-25 (D-037)
- [x] "Picture it" analogy (with where it breaks) and a "Common trap" card in all 17 labs
- [x] End-of-tour quizzes (one question per stop) · review questions that return after 1, 3, 7, 16, 35, 80 days
- [ ] Will: review the analogies, traps and 20 questions (`src/stick.js`)
- [ ] "Picture it" images: text only for now; Will to approve any images before they're added
### Phase 4 — Deep time ✅ 2026-09-25 (D-038)
- [x] Hawking evaporation lab (Page curve) · cosmic timeline · Earth's energy budget · Spacetime lab: hyperbolae, pole-and-barn
- [ ] Will: review the three new labs' text (`src/deeptime.js`) and the pole-and-barn wording (`src/labs2.js`)
### Review fixes ✅ 2026-09-25 (D-039)
- [x] Nav reorganised (⌂ Home, Guide menu, breadcrumb) · show-only Filter menu in both modes · ◌ Workbench for Lab · home text B
- [ ] Will: check the new home text (`src/home.js`) and the Exploratory ideas page
### Phase 5 — Launch readiness
- [ ] Verify every ☐ citation · light theme · teacher notes · keyboard Atlas · tidy public review/learning files
- [x] Domain chronoscope.com.au registered (AgilityAI)
- [ ] Domain move: set DNS at the registrar first → then add `CNAME` file + custom domain in GitHub Pages settings → update og:url / og:image and README links. Adding CNAME before DNS works breaks the live site
### Idea — the maths layer (research first, then decide) · Will, 2026-09-25
The labs run real equations but the text keeps the maths light. Give students and working scientists a way to
see the full physics (equations, derivations, the model's exact assumptions) without cluttering Learn.
**Hold until researched:** how to present it cleanly and with impact, and as tools that help people advance ideas.
- Form: a second marker per claim (e.g. **∑** beside ⓘ), a per-lab "The maths" panel, or a page-wide depth switch.
  Note: depth is a different axis from Learn/Lab (Learn/Lab = how sure; depth = how technical), so probably its
  own control rather than a third Learn/Lab state.
  Update (D-039): the ◌ Workbench (Lab mode) is the natural home — Learn for understanding, Lab for working with the raw physics.
- Research candidates: colour-coded equations whose terms highlight the matching part of the simulation
  (Stuart Riffle's colour-coded DFT; Better Explained); live equations whose numbers update with the sliders
  (Bret Victor, Ciechanowski); expandable derivations; KaTeX rendering (jsdelivr) with copy-as-LaTeX;
  "view the code" showing the actual JS that runs; export parameters/data; links to the paper and equation number.
- Related: reviews/review-2026-09-25.md §1.4 "Show me the maths" expander. Existing hooks: every lab's model line.

### Later
- [x] Concept map → How it all connects (D-040) → replaced by **How it all fits together**, a comic strip (D-041)
- [ ] Will: read the eight panels and the epilogue (`src/story.js`); illustrations could be replaced by approved artwork if wanted
## UX spec roadmap (D-042) — `reviews/Chronoscope — UX, Flow & Stickiness Design Spec.md`
- [x] P0 · Predict first, honestly: locked / guessed / free states, setups, phone card above sim (2026-09-26)
- [x] Phase 0 · Stop plans — draft 4 in `stop-plans.md` (20 stops), **signed off by SOL** (2026-09-26) (arrives with · already knows · new here · do · look at · takeaway · limit · handoff)
- [x] Phase 1a · Stops as data (`src/stops.js`, D-043): stop framings on all 20 stops, per-stop guess keys, setups via `applySetup`, end cards with handoffs, Tour 2 at six stops, Tour 3 readouts (Clock Lab years, voyage there-and-back)
- [x] Phase 1b · Missions (D-044): `src/missions.js`, Clock Lab's two (γ = 2; orbit height where the effects cancel, ≈ 3,190 km)
- [x] Phase 1c · Quick wins (D-044): Home Continue card; "Resume Tour N · stop k" chip replacing the paused banner
- [x] Phase 1 · the River's two missions (D-045) — Phase 1 complete
- [ ] Phase 1 check: five first-time visitors on Clock Lab (spec's visitor checks)
- [x] Phase 2a · Top bar: Home · Tours · Explore mega-menu · Guide with the mode switch; Learn / Workbench naming (D-045)
- [x] Phase 2b · Home in five blocks with the live hero light clock; no sidebar (D-045)
- [x] Phase 2c · Lab template on every lab (D-046): panel order; Picture it + Common trap collapsed; one end card everywhere with "Where this leads" and the review line; controls help as an overlay button — **Phase 2 complete**
- [ ] Phase 3 content work carried from 2c: one-line hints under each control; explanations ≤ 3 short paragraphs; "Try:" boxes → missions; Flatland onto the template
- [x] Phase 3a · Missions (D-047): Spacetime ×3, Entropy box ×3, 1 g voyage ×3, Talking to Mars ×2 (15 across six labs)
- [x] Phase 3a (cont.) batch 1 · Missions (D-047): Mission clocks, Expanding universe, Cosmic horizons, Boot, Black holes evaporate, Earth's energy budget ×2 each (27 across 12 labs). Janus and Timeline deliberately have none: nothing to steer, so a mission would pass on arrival
- [x] Phase 3a batch 2 · Field Ocean ×2, Wormholes ×2, Time loops ×2, Two Films ×1 (34 across 16 labs)
- [x] Phase 3a batch 3 · Delayed choice ×2, Frozen universe ×2 — **3a complete: 38 missions across 18 labs**
- [x] Phase 3b-1 · Visual system: spec tokens in `:root` (old names kept as aliases), three levels — stage (brightest surface, borderless canvas panels via `g.panel`, soft glow in the lab's scale colour via `Chrono.scaleOf`), content (16 px, cards told apart by surface), chrome (12 px grey). Focus ring, 44 px touch targets, reduced-motion CSS, Shift+arrow big slider steps
- [x] Phase 3b-2 · Readout bars on all 20 labs: `#lab-readouts` under the canvas, ≤ 3 big labelled numbers from each lab's `readouts()`, hidden while a lab is locked for a guess. Headline lines removed from the canvas; labels on drawn objects kept. Panel titles now keep physics symbols' case (`Chrono.capsTitle`: "0.87 c", "t =", γ). Regression requires readouts() on every lab
- [ ] Phase 3c · Trim the canvas info panels that still repeat bar numbers in sentences (Horizons, 1 g voyage, Hawking, Energy, Mission clocks)
- [ ] Phase 3b-3 · Sims fill their zone (Clock Lab mirrors to ~55–60% of height, tick timing unchanged); trails and pulses where missing
- [ ] Phase 3d · Phone: canvas labels run off the edge at 390 px (Expanding universe "you are here…", "arrows: …")
- [ ] Phase 3 · Roll out: framings on all 20 stops; tokens and three emphasis levels; sim scaling + readout bars; missions for every lab (rewrite the "not a wall you hit" reveal)
- [ ] Phase 4 · Return loop: passport (#passport), review sheet, challenge links, teacher mode level 1, print worksheets. Guess counter and analytics wait for the domain move (static until then)

- [ ] **Stars forge the elements** (Cosmos, `src/stars.js`, D-048 reserved) — IN PROGRESS, fit in between UX phases
  - [x] Scene 1 drawing: onion star + countdown of burning stages (25 Sun masses; WHW 2002 times: H 6.7 Myr · He 0.84 Myr · C 522 yr · Ne 0.89 yr · O 0.40 yr · Si ~2 days · collapse < 1 s)
  - [ ] Scene 2: periodic table of origins, Z 1–92, rounded shares after Johnson (2019) / Kobayashi et al. (2020); sources: Big Bang · cosmic rays · exploding massive stars · exploding white dwarfs · ageing giant stars · colliding neutron stars (site split CONTESTED) · made by people (Tc, Pm) · decay chains (Po–Ac, Pa); cosmic-time steps: 3 min → ~200 Myr → ~500 Myr → ~1 Gyr → Sun forms 9.2 Gyr → today; click an element for its story (H, Li, C, O, Fe, Tc, Eu, Au, Pb, U)
  - [ ] register (predict: where does core fusion stop? → iron), aside with the entropy strip (one fusion → ~20 million sunlight photons → ~400 million infrared from Earth), Picture it / Common trap ("the Sun will make gold") / quiz question
  - [ ] wire: index.html script + Cosmos nav, home SCALES, arrow thread (Entropy box → Stars → Earth's energy budget), guides, concepts KEY, timeline next → #stars, story panels 2 and 5 link to #stars; bump ?v=
  - Working note: an automated output filter has blocked long, dense nuclear-physics passages. Write in small chunks, astronomy-first wording; the nuclear-energy curve is left out for now
- [ ] Claude chat in the app (needs a small server) · notebook · live diagrams in Concepts · colour split (review 3.1)

## Space School readiness
- [ ] Teacher notes per lab
- [ ] Light theme
- [x] Mobile/tablet layout (D-029)
- [ ] Keyboard access to Atlas nodes (currently mouse-only)

## Next — spec Build order step 1: Boot a Universe entrance
- [ ] Boot console: (n, m) selectors, BOOT, line-by-line log, error codes
- [ ] Grid map view (Tegmark diagram) — verify cells vs Fig. 1
- [ ] ERR_ORBIT_UNSTABLE demo: orbit, continuous n slider, nudge
- [ ] Will reviews in browser

## Step 2 — exact-mode engine
- [ ] Shared Fourier-mode module (oscillating + cosh branches); refactor Two Films onto it
- [ ] I.3 Mode Explorer + constraint toggle (+ optional sound)
- [ ] ERR_MATTER_UNSTABLE energy-vector demo

## Later
- [ ] I.2 Future Compass
- [ ] II.1 Two Arrows (Pauli + harmonic chain + Janus point), II.2–II.5 cards
- [ ] Remaining boot demos (Laplace, 2D network, tachyonic note)
- [ ] Twin clocks card; Case Files
- [ ] Atlas: label collisions in dense years (2025 cluster)
- [ ] Deferred: prediction wager, claim ledger, Reality OS shell

## Verification backlog
- [ ] Surrey paper URL/details · Kletetschka DOI · Bars survey · Ehrenfest 1917 · Deser–Jackiw–'t Hooft · relational-clock PRD
