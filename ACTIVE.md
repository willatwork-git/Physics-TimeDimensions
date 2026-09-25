# ACTIVE

**Where things stand (2026-09-26):** the UX spec's Phases 0–4 are complete — tours with predict-first framings,
38 missions, the visual system with readout bars, Flatland on the lab template, a phone pass, the Passport,
challenge links, and teacher mode with worksheets (D-042 → D-051). Live on GitHub Pages; assets at `?v=88`.
`tools/regress.sh` runs 16 checks, all green.

**Next — Will picks one:**
1. **Stars forge the elements** (D-048 reserved, Cosmos). Open `src/stars.js` (scene 1 drawn, not loaded) and
   `todo.md` → "Stars forge the elements" for the plan: scene 2 (periodic table of origins), register, wiring.
   The regression will insist on `readouts()`, a guide row per slider, and phone-safe labels.
   Content filter: write nuclear-physics text in small, astronomy-first chunks (memory note).
2. **Phase 5, launch readiness** (`todo.md` → Phase 5): verify ☐ citations in `sources.md`, light theme,
   teacher notes per lab, keyboard access to Atlas nodes, then the chronoscope.com.au move (DNS first).
3. **Optional:** a SOL spot-check of the Phase 4 flows on the live site (Passport, challenge a friend,
   a class link end to end).

**Waiting on Will:** review the six Flatland takeaways (`src/guides.js`, "flatland/1"–"/6"); analogies, traps
and quiz questions (`src/stick.js`); deep-time lab text (`src/deeptime.js`); home text; story panels. Decide
whether `learning.md` stays public. Phase 1's five-visitor check is still to do.

**Known gaps (logged in todo.md → Later):** Flatland has no missions; tour stops with their own question
can't be shared as challenges; Atlas map labels are 9–10 px on phones (the phone list covers it); long
explanations; the "how others guessed" counter needs a server (after the domain move).

**Gotchas:** headless Chrome runs no animation frames — probes drive `requestAnimationFrame` from a timer
(`tools/README.md`). For scripted edits use Python, not perl (perl expands `$(` in replacement text).

**How to resume:** read this file, then `todo.md` and `decisions.md` from D-047. Check health with
`tools/regress.sh` (see `tools/README.md`). Bump `?v=` in `index.html` with every change to `src/`.
