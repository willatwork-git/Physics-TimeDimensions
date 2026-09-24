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
