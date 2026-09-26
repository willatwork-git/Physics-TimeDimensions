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
- [x] Stars reworked as an engine (D-054): One star / Generations, elements flying to their tiles, white dwarf vs explosion, What am I made of?; atom removed; arrow-of-time concept links back. Will to review the new text in `src/stars.js` and the concept section in `src/concepts.js`
- [x] The lab pattern written (DESIGN.md, D-054)
- [ ] Phase 5 · Lab pattern: controls take 3+ rows at 1440 px in delayed, frozen, voyage, spacetime, hawking, wormhole, expand (regression warns) — trim or regroup
- [x] Entropy/complexity thread (D-055): arrow-of-time concept section; complexity line in the Entropy box; star-formation curve + "Cosmic noon" on the timeline; Stars "Sun forms" moment and mission; gold trap reworded. Will to read the new concept text (`src/concepts.js`) and the Entropy box paragraph (`src/labs2.js`)
- [x] D-056: "Is entropy a thing?" (Entropy page), new concept page "Radiation: the beginning and the end", entropy wording sweep. Will to read both (`src/concepts.js`)
- [x] The maths layer, pilot (D-057): 5 labs, 15 worked examples tested by `65-maths`. Will to review the format
- [ ] The maths layer, rollout: the other 16 labs + Flatland; data labs (Stars, Timeline) say so and cite their tables; then make `65-maths` require an entry for every lab
- [ ] Verify every ☐ citation · light theme · teacher notes · keyboard Atlas · tidy public review/learning files
- [ ] Phone: canvas labels overlap in 10 labs (delayed, frozen, missions, mars, energy, field, wormhole, loops, timeline, horizons — mostly the model footnote hitting the text above). `35-phone` warns; make it fail once they're fixed
- [ ] Hosting (D-053): a clean public copy syncs to a Cloudflare site; this repo keeps the notes. Settle what's copied and whether this repo goes private — note that git history keeps anything already pushed
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
- [x] Phase 3 content work carried from 2c: control hints (3c), Try boxes → missions (3c), Flatland onto the template (3d-1). Explanation length deferred by Will (see Later)
- [x] Phase 3a · Missions (D-047): Spacetime ×3, Entropy box ×3, 1 g voyage ×3, Talking to Mars ×2 (15 across six labs)
- [x] Phase 3a (cont.) batch 1 · Missions (D-047): Mission clocks, Expanding universe, Cosmic horizons, Boot, Black holes evaporate, Earth's energy budget ×2 each (27 across 12 labs). Janus and Timeline deliberately have none: nothing to steer, so a mission would pass on arrival
- [x] Phase 3a batch 2 · Field Ocean ×2, Wormholes ×2, Time loops ×2, Two Films ×1 (34 across 16 labs)
- [x] Phase 3a batch 3 · Delayed choice ×2, Frozen universe ×2 — **3a complete: 38 missions across 18 labs**
- [x] Phase 3b-1 · Visual system: spec tokens in `:root` (old names kept as aliases), three levels — stage (brightest surface, borderless canvas panels via `g.panel`, soft glow in the lab's scale colour via `Chrono.scaleOf`), content (16 px, cards told apart by surface), chrome (12 px grey). Focus ring, 44 px touch targets, reduced-motion CSS, Shift+arrow big slider steps
- [x] Phase 3b-2 · Readout bars on all 20 labs: `#lab-readouts` under the canvas, ≤ 3 big labelled numbers from each lab's `readouts()`, hidden while a lab is locked for a guess. Headline lines removed from the canvas; labels on drawn objects kept. Panel titles now keep physics symbols' case (`Chrono.capsTitle`: "0.87 c", "t =", γ). Regression requires readouts() on every lab
- [x] Mission circles (Will, 2026-09-25): a circle per mission at the right of the card — hollow, ✓ done, ringed current; each one picks or replays its mission; shown on the done and all-done cards too. Regression checks them
- [ ] Later (Will): revisit long explanations — a collapsed "More" was declined for now (more clicking); check back once 3c is done
- [x] Phase 3c · Control hints (Will chose option 3): each slider shows its guide line underneath in Learn mode until first moved (remembered per browser); every matched control gets the full guide row as its tooltip; shared rows hint once. Guide row for Horizons' slider renamed to match the control. Regression: every slider must match a guide row
- [x] Phase 3c · Try boxes: in labs with missions they wait until every mission is done, then show as "More to try" (they gave missions away); labs without missions keep them. No text removed. Regression checks both states
- [x] Phase 3c · Canvas info panels that repeat bar numbers: **kept** — they're tables and sentences in context (the explanation); the bar is the glance. Cutting would leave gaps for little gain
- [x] Header on narrow screens (Will): brand on row 1; Tours · Explore · Guide aligned on row 2 (Guide had sat a row higher)
- [x] Home "Go deeper" tiles (Will): a small moving picture in each — story panels lighting in turn, Atlas links pulsing, a balance tipping to 'established'. Decorative; calm at rest (⅓ speed, 60% bright, one Atlas pulse) so the text leads — a card wakes up on hover/focus (Will: first version distracted from the text); picture moved below the text as a 60 px strip aligned along the card bottoms, so the text leads (Will: the picture dominated); paused off-screen, still under reduced motion
- [x] Phone: Clock Lab uses short panel titles when narrow (the 36% rest panel overlapped); readout bar stays one row at 390 px
- [x] Phase 3b-3 · Sims fill their zone: Clock Lab panels split 36/64 and the clock zooms with speed (up to 60% of the panel, while ~1¼ zig-zags stay in view; tick timing unchanged; hero untouched); River view 0.11 → 0.15 of the canvas. Contact sheet of all 20 labs: the rest already fill their zone; trails and pulses already present. Entropy readout relabelled (its 0–100 scale runs packed → spread, not absolute entropy)
- [x] Phase 3d-1 · Flatland on the lab template: end card (next chapter, or the tour's Next stop on tour stops; ← Previous chapter link), ⓘ controls popover over the stage, Learn-mode control hints, 3b stage visuals (surface, Physics glow, borderless panels, case-safe titles), readout bar on Sphere visits / Hypercone / Time as a slice (not Building up: it would give the corner counts away)
- [ ] Will: review the six new Flatland takeaways, chapters 1–6 (`src/guides.js`, "flatland/1"…"/6") — chapters 1–6 had none before
- [ ] Later: missions for Flatland (needs per-chapter state)
- [x] Regression: views check now drives the real frame loops (requestAnimationFrame shimmed onto a timer — headless ran no frames, so the blank-canvas check had been passing on transparent, never-drawn canvases); counts only painted pixels; all 7 Flatland chapters in all three modes. Negative-tested: stopping Flatland's or the labs' drawing turns every route red
- [x] Phase 3d-2 · Phone pass. New regression check `35-phone` (a real 390 × 844 frame; every lab and Flatland chapter): no sideways overflow, header menus on one row, stage ≥ 260 px, nothing blank, **no canvas text off the edge** (fillText wrapped to measure every label — found 134). Fixes: Wormholes drew nothing on phones (negative throat height → error); phone stage now sets its own height (min(125vw, 78svh)) so two-panel labs stack at full width instead of two ~170 px columns (38 → 3 clipped); shared label helpers shrink text to fit (not below 8 px); three labels get shorter phone wording ("tap" not "click"). Atlas on phones: the holes as a tappable list (name, summary, attempts) and tap wording on touch screens; checked in 35-phone
- [ ] Later: Atlas map labels are 9–10 px at phone scale (spec asks ≥ 12); the phone list now carries the content, so the map is optional there
- [x] Phase 3 · Roll out: framings on all 20 stops; tokens and three emphasis levels (3b); sim scaling + readout bars (3b); missions for every lab that has something to steer (3a, 38 missions)
- [x] Phase 4a · Passport (`#passport`, `src/passport.js`): thin progress bar in the header (Will: phones — a bar across the screen between brand and buttons; desktop — beside Guide) opening the Passport; dated tour stamps (earned only by visiting every stop); each scale's labs with ✓ and ★ per mission; prediction record (right / skipped, missed ones linked back with guess vs answer); review due; Save / Load passport as a JSON file. Home: 14-day "quick recap" of the tour's takeaways on the Continue card. Regression `50-passport` (negative-tested)
- [x] Home centred on wide screens, header lined up with the column (Will: right-side items felt orphaned); labs stay full width
- [x] Fix: tour cards showed "✓ done" for tours not finished — old builds stored a done flag on jumping to the last stop; `tourDone` now also requires every stop visited (regression covers it)
- [x] Phase 4b · Challenge links: after a reveal, "↗ Challenge a friend" (phones: system share sheet; elsewhere copies the link). The link carries only the question and the sender's option (`?c=<lab>&g=<n>#<lab>`), is cleared from the address bar on arrival, and shows "A friend guessed “…”. What's your guess?" above the question, then the friend's guess beside yours after the reveal. Lab and Flatland questions only — tour stops with their own framed question aren't shareable yet. Regression `55-challenge` (negative-tested; a malformed link is ignored)
- [ ] Later: share links for tour stops' own questions (the link would need to carry the tour framing)
- [x] Phase 4c · Teacher mode, level 1 (`src/teach.js`, Guide → For teachers, `#teach`): class link (`?class=<name>&t=<tour>` or `&l=<labs>`, `&m=1` missions count) — the student joins in their own browser, is taken onto the route, and sees a class bar with progress and "Get my completion code" (e.g. `T1-7/7-M9/12-P5/6-K3F`: stops, missions, predictions right, checksum over the class name). Checker on #teach decodes pasted codes (optionally "Name: code") into a table; wrong class or altered code shows ✗. Printable worksheet per tour (`#worksheet/<tour>`, print stylesheet). Router now accepts registered views without a menu button (it had been sending #worksheet to the Atlas). Regression `60-teach` = the spec's "done when" (class link → code → checker), negative-tested; views check now fails on silent redirects
- [x] Phase 4d · Regression `45-tours` (the spec's Phase 4 test list), every stop of every tour: a locked prediction gives nothing away (readout bar hidden; no right-answer text or explanation outside the question card); every setup inside its lab's slider ranges; no prediction key shared between stops. Negative-tested (leak and out-of-range both caught)
- [x] **Phase 4 complete** except the guess counter ("63% of visitors guessed…") — needs a small server; waits for the domain move

- [x] **Stars forge the elements** (Cosmos, `src/stars.js`, D-048) — done 2026-09-26: two scenes (inside a 25-Sun-mass star; the periodic table by origin, six cosmic-time steps), 2 missions, wired everywhere (nav, home, arrow thread, guides, stick, concepts, help, timeline next, story panels 2 and 5)
  - [ ] Will: read the element stories (H, He, Li, C, O, Fe, Au, Pb) and the aside
  - [ ] Optional: stories for Tc, Pm and U — left out on purpose (content filter); Will may draft them elsewhere. Astronomy angles: Tc in red giants (Merrill 1952); U as the clock that dates Earth
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
