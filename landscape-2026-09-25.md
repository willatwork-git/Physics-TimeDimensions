# landscape-2026-09-25.md — apps like Chronoscope, and what to learn from them

**Source:** two Google AI Overview answers Will found when searching for similar apps. Each site below was
opened and checked by Claude on 2026-09-25 (fetched pages, not the AI summaries). Where a site loads its
content by script and couldn't be read, that's said. Assessment is Claude's; decisions are Will's.

## At a glance

| Site | What it is (checked) | Overlap with Chronoscope | Worth borrowing |
|---|---|---|---|
| **Terence Tao — Spacetime diagram applet** | A 1+1 Minkowski diagram: events, worldlines, light rays, lines of simultaneity, observers, constant-interval hyperbolae, two independently boostable frames; Doppler colour, energy/momentum/proper-time readouts; worked scenes (twin paradox, pole-and-barn, light clock). First published 11 July 2026 — built with Claude Code's help | High, with our Spacetime lab — and more capable as a diagram tool | Constant-interval hyperbolae; a pole-and-barn scene; Doppler colouring. Link to it as "go deeper" |
| **Quantum Country** (Matuschak & Nielsen) | Free essays on quantum computing and mechanics, with spaced-repetition prompts embedded in the text — the "mnemonic medium". Assumes linear algebra | Low on content; high on method | The strongest answer to "did it stick?": short review prompts that come back days later |
| **Quantum Flytrap Virtual Lab** | Free drag-and-drop optical table: photon sources, beam splitters, detectors, up to four entangled photons; used in Oxford and Stanford courses; screenshots CC BY. Company closed 2022, lab maintained | Medium, with the proposed Delayed-choice lab | Keep our delayed-choice lab fixed and guided; link to Flytrap for build-your-own |
| **Ben Lansdell — SR simulator** | One slider (thrust) drives a spaceship; readouts of velocity, proper time, γ, momentum; worldline in two frames; a **Galilean mode** for comparison | Medium, with The 1 g voyage | A **Newton vs Einstein** toggle: in Newton's physics the ship sails past light speed — a vivid misconception buster |
| **Bartosz Ciechanowski** | Long essays with interactive 3D embedded in the text (Moon, Earth and Sun, GPS, Lights and Shadows, Cameras and Lenses…) | Low on content (GPS overlaps Mission clocks); high on format | Small live diagrams *inside* the Concepts pages (e.g. a light clock inside "Clocks disagree") |
| **Explorable Explanations — physics** | Directory of interactive essays and games (list loads by script; not readable here). Items named in the AI answer checked separately: *Entropy Explained, With Sheep* (Aatish Bhatia) — live; *A Slower Speed of Light* (MIT Game Lab, 2012) — live; *Velocity Raptor* (TestTube Games) — site blocks automated access | Medium, piecemeal | Link *With Sheep* from the Entropy concept; *A Slower Speed of Light* shows first-person relativistic visuals (Doppler, aberration) we don't attempt |
| **PhET** (CU Boulder) | The long-standing classroom standard for sandbox simulations, with teacher-contributed activities. Catalogue loads by script; Claude couldn't confirm any special-relativity sims | Low on content; high on classroom practice | The model for teacher notes: learning goals, timing, activity sheets per sim |
| **Einstein Online** (Max Planck Institute for Gravitational Physics) | Authoritative short articles on relativity, black holes, cosmology, quantum gravity; ~400-entry glossary | Medium, as reference | A source and "further reading" link. *Correction:* the AI answer said it covers the Janus point — it doesn't mention it |
| **PhysicsHub** | Open-source (MIT) classical-mechanics simulations: pendulums, double pendulum, three-body problem, gravity | Low | — |
| **physics-simulations.org** | Live (not examined in detail) | — | — |

## What's distinctive about Chronoscope

Nothing checked combines all of these:
1. **Organised around open problems** — the holes in physics' account of time — rather than settled topics.
2. **Every claim tagged by confidence**, with *what it predicts* and *what would overturn it* for each idea.
3. **Real equations across scales** — astronaut clocks to cosmic horizons — tied together by threads and tours.
4. **A place for the learner's own ideas** (Lab mode hypotheses, their own Test-bench scores).

Closest in spirit: Tao's applet (precision) and Quantum Country (learning method). Worth saying in the
AgilityAI write-up — and noting that Tao's applet was also built with Claude Code.

## Suggested borrowings, in order

| # | Idea | From | Where it lands | Size |
|---|---|---|---|---|
| 1 | **Further exploring** links on each Concepts page (Tao, Einstein Online, *With Sheep*, *A Slower Speed of Light*, Flytrap) | all | `concepts.js` | Small |
| 2 | **Newton vs Einstein toggle** on The 1 g voyage | Lansdell | `voyages.js` | Small |
| 3 | **Constant-interval hyperbolae** and a **pole-and-barn** scene in the Spacetime lab | Tao | `labs2.js` | Medium |
| 4 | **Review prompts that return** — a few questions per lab that resurface on later visits (localStorage), pairing with the planned quizzes | Quantum Country | new, with `progress.js` | Medium |
| 5 | **Live mini-diagrams inside Concepts pages** | Ciechanowski | `concepts.js` | Medium |
| 6 | **Teacher notes** per lab in PhET's style (goals, timing, one activity) | PhET | new pages | Medium |

Etiquette for a public repo: link and credit; don't copy code or text; screenshots only where licensed
(Flytrap's are CC BY).
