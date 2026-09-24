# decisions.md

## D-001 — Plain HTML/JS, no build step (2026-09-24)
**Decision:** Single `index.html` + classic scripts in `/src`. **Why:** Double-click to run, zero tooling, easy to publish later. **Trade-off:** No ES module imports under `file://`; use a simple global namespace (`window.Chrono`).

## D-002 — Start with Chronoscope, standalone (2026-09-24)
**Decision:** Build the multiple-time-dimensions app first; defer the Reality OS shell. **Why:** Will's primary interest; proves the concept before investing in the shell.

## D-003 — Panel 1 (Dimension Map) is the first build (2026-09-24)
**Why:** Most distinctive; establishes the visual language and the claim-tagging pattern the others reuse.

## D-004 — Confidence tags on every claim (2026-09-24)
**Decision:** ESTABLISHED / CONTESTED / SPECULATIVE. **Why:** Counter hype inherited from press and AI summaries; the tagging is itself educational.

## D-005 — Two independent investigations (2026-09-24)
**Decision:** Split into I "How many time dimensions?" and II "Which way does time point?". **Why:** SOL review — they are independent; v1 implied the Surrey result bore on time dimensionality. See `reviews.md`.

## D-006 — Exact Fourier solutions for two-time wave demos (2026-09-24)
**Why:** Growth/blow-up must be provably physics, not numerical artefact. Supersedes the finite-difference plan in spec v1.

## D-007 — Boot-a-Universe entrance (2026-09-24)
**Why:** Google review framing; turns Tegmark's diagram into an action with named failure modes. Fits the later Reality OS concept.

## D-008 — Tag claims, not papers; show model assumptions (2026-09-24)
**Why:** SOL review. A paper can contain ESTABLISHED maths and SPECULATIVE physics.

## D-009 — No simulation of speculative theories (2026-09-24)
**Decision:** Bars, Pettini, Kletetschka appear as Case Files only. **Why:** A toy animation would not execute the theory faithfully and would imply endorsement.

## D-010 — Gemini additions (2026-09-24)
**Decision:** Add ERR_MATTER_UNSTABLE (two-time particle decay, exact vector kinematics), Janus-point N-body model (II.1), memory thread (II.4), Page–Wootters and quantum-switch cards (II.5). **Why:** Real, checkable physics that strengthens both investigations. Gemini's wave-equation sim and "teleological lockout" rejected as technically wrong — see `reviews.md`.

## D-011 — Audience and purpose reframed (2026-09-24)
**Decision:** Primary audience is Will (learning from zero), secondary is friends. Purpose: find the holes, see the attempts, overlay loose ideas — predict and challenge, not prove.

## D-012 — The Atlas is Layer 0 (2026-09-24)
**Decision:** Build a Hole Map × century timeline × test bench before the simulations. **Why:** Directly serves the "where doesn't it add up, and who tried what" goal; the simulations become deep dives from it.

## D-013 — ANALOGY and HYPOTHESIS tags; shareable hypotheses (2026-09-24)
**Decision:** Add two tags. User hypotheses stored in browser localStorage with JSON export/import. **Why:** Loose ideas are the fun part and must be clearly separated from physics. Export/import lets friends swap ideas without a server.

## D-014 — Flatland tab as a lens (2026-09-24)
**Decision:** Add a Flatland tab (5 chapters) at Will's request. **Why:** Shows why extra dimensions are hard to picture and teaches *slicing*, which is the core intuition for the block universe (H4) and for Two Films. Exact geometry throughout; story tagged ANALOGY.

## D-015 — Flatland expanded to 7 chapters (2026-09-24)
**Decision:** Add the video's squashed-4D diagram (ch. 4), hypercone 3D conics (ch. 5), exact tesseract slicing by orientation (ch. 6). **Why:** Will's source video; every shape computed exactly (hyperplane ∩ edges; quadric slice formula). Flagged on screen that w is a spatial dimension, unlike time.

## D-016 — Tiers and editions (2026-09-24)
**Decision:** Every item has a tier (Mainstream / Frontier / Exploratory / Lens). A header switch controls what is shown; `?edition=school` caps at Frontier. **Why:** Will asked that our experimental thinking be clearly separable from mainstream physics, so the app can be offered to Space School without the fringe content — while still keeping it in the full edition.

## D-017 — Exploratory ideas live in their own Atlas column (2026-09-24)
**Why:** Visual separation, not just labels: Will & Claude's ideas sit right of a dashed divider marked "Exploratory · not mainstream", not on the historical timeline.

## D-018 — Shared lab harness (2026-09-24)
**Decision:** `src/lab.js` provides canvas, loop, controls and aside for new labs and doc pages; each lab is one `register()` call. Flatland keeps its own engine for now.

## D-019 — Guide overlay and grouped navigation (2026-09-24)
**Decision:** A "? Guide" overlay (header button or ? key) explains the idea, every section and the tags; it never opens automatically — first-time visitors get a small dismissible hint instead. Navigation is grouped into colour-coded segments (Explore blue, Labs teal, Method amber) with a filled active tab. **Why:** Will wanted help available but not in the way, and the flat menu was hard to scan.

## D-020 — Imported hypotheses are untrusted data (2026-09-24)
**Decision:** On load and import, keep only known fields: a plain id, a known camp, known hole ids, and length-capped strings. Anything else is dropped. Ids are also escaped where they're written into HTML. **Why:** Export/import exists so friends can swap files. Before this, a crafted file could inject HTML/script into the Atlas, and one with an unknown hole id crashed the idea panel.

## D-021 — Reduced motion pauses, not freezes (2026-09-24)
**Decision:** With `prefers-reduced-motion`, each sim opens still and starts running once the visitor interacts with it (`Chrono.motion` in `src/lab.js`, shared by Flatland). **Why:** Before this, dt was forced to 0 forever, so buttons like Two Films' Predict did nothing. DESIGN.md already specified pause-until-play.

## D-022 — Licence: MIT code, CC BY 4.0 content; live on GitHub Pages (2026-09-24)
**Decision:** `index.html` + `src/` (including in-app text and Atlas data) under MIT; Markdown documents and screenshots under CC BY 4.0. Served from `main` via GitHub Pages. **Why:** Will's choice — the permissive, standard pairing for an educational app, so schools and others can reuse and adapt it with credit.

## D-023 — Two modes: Learn and Lab (2026-09-24)
**Decision:** One header switch replaces the three-level Show switch. **Learn** (default) = mainstream + frontier + lenses: calm Atlas (idea names on hover), camp filters only, next-question links. **Lab** = everything: this project's exploratory ideas, visitor hypotheses, Dimension Map, overlays, tag filters, all labels. `?mode=lab` links into Lab; school edition is Learn with no switch. Internally still levels (learn = 2, lab = 3); the Mainstream-only level is retired from the UI. **Why:** Will wants a friendly educational app for newcomers and a raw research bench, cleanly split. Fringe *published* ideas stay in Learn, tagged; the project's own deliberate challenges to the mainstream live in Lab, unchanged. See `learner-review.md`.

## D-024 — Every view has a URL (2026-09-24)
**Decision:** Hash routing: `#view`, `#atlas/H5`, `#atlas/<idea id>`, `#bench/<idea id>`, `#flatland/3`. All navigation goes through `Chrono.nav`; Back works. **Why:** Sharing, classroom handouts and posts need to land on a specific moment.

## D-025 — RULED OUT tag; public voice (2026-09-24)
**Decision:** New tag RULED OUT (Mainstream tier, struck-through grey) for ideas tested and rejected — first: tired light. On-screen attribution says "this project" rather than naming people; credits stay in the Guide footer and README. **Why:** Frontier ("not yet supported by evidence") misdescribed refuted ideas; visitors don't know who "Will" is.

## D-026 — Home, tour, predict-first, progress (2026-09-24)
**Decision:** The app opens on a **Home** view (the hook + doors: tour · map · labs; Lab mode adds a workbench door). A **7-stop tour** strings existing views together with a tour bar (question, Previous/Next, leave/resume). Labs open with a **Predict first** card (skippable) that hides the explanation until the visitor commits a guess. **Progress** (views seen, predictions, tour position, own scores) lives in the browser (`src/progress.js`) and shows as ✓ marks and "continue where you left off". The auto "New here?" hint is retired — Home does that job. **Why:** learner-review Phase B. Predicting before observing measurably improves learning (Crouch et al. 2004, sources.md). Tour stops 4–5 move to the Spacetime diagram and Entropy box when Phase C builds them.

## D-027 — Every score has a reason; visitors can score differently; glossary (2026-09-24)
**Decision:** `src/data3.js` gives every physics idea *predicts* / *what would overturn it* (for ruled-out ideas: *what killed it*), and a one-sentence reason for every ◐, ✗ and ? on the Test bench (✓ and n/a use a generic line per hurdle). Visitors can set their own score per hurdle; it's stored locally and shown as a raised mark on the Test bench — not exported. A glossary (`src/glossary.js`, ~33 standard terms) underlines each term's first use in a panel, with a hover/tap definition. **Why:** the app's method (say what would kill it) was visible on 4 of 49 ideas; bare ✓/✗ taught nothing. Content is Claude's first pass — Will to review `data3.js`.
