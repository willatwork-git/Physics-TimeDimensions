# ACTIVE

**Where things stand (2026-09-26):** UX spec Phases 0–4 complete (D-042 → D-051). **Stars forge the elements** is built,
wired (D-048) and reworked as an engine (D-054): 21 labs, 42 missions. The Black holes lab now says what evaporation does to entropy and why the
universe won't end as one black hole (D-052). New labs follow **the lab pattern** in `DESIGN.md`. Will's entropy insight became a thread (D-055): complexity in the Entropy box, star-birth curve on the timeline, a concept section. Entropy is a count, free energy the potential; a Radiation concept page (D-056). The maths layer is piloted on 5 labs (D-057, `#maths`), its worked examples tested on every change. Assets at `?v=100`. `tools/regress.sh`: 16 pass, 1 warning (below).

**Next: Phase 5, launch readiness** (`todo.md` → Phase 5), Will's chosen order after Stars:
1. **Phone label overlaps**: the new check (`35-phone`) finds canvas labels drawn over each other in 10 labs, mostly
   a model footnote hitting the text above. Fix them, then make the check fail instead of warn.
2. Verify ☐ citations in `sources.md` (D-048's new ones included) · light theme · teacher notes per lab ·
   keyboard access to Atlas nodes.
3. **Hosting (D-053)**: at launch, a clean public copy syncs to a Cloudflare site; this repo keeps the notes. Settle
   what the copy carries and whether this repo goes private. DNS first, as before.

**Waiting on Will:** try the reworked Stars lab; read its aside and element stories (`src/stars.js`) and the two new sections of the arrow-of-time concept (`src/concepts.js`), and the Entropy box's complexity paragraph (`src/labs2.js`) and the two new Black holes
paragraphs (`src/deeptime.js`); Tc, Pm and U have no stories on purpose (content filter; Will may draft them
elsewhere). Earlier reviews still open: Flatland takeaways (`src/guides.js`), `src/stick.js`, deep-time text, home
text, story panels. Phase 1's five-visitor check is still to do.

**Known gaps (todo.md → Later):** Flatland has no missions; tour stops with their own question can't be shared as
challenges; long explanations; the "how others guessed" counter needs a server.

**Gotchas:** headless Chrome runs no animation frames: probes drive `requestAnimationFrame` from a timer. To see a
canvas, export it with `toDataURL` from a probe (`--screenshot` fires too early). Use Python for scripted edits, not
perl. Nuclear-physics text can trip an output filter: write it in small, astronomy-first pieces.

**How to resume:** read this file, then `todo.md` → Phase 5 and `decisions.md` from D-048. Check health with
`tools/regress.sh`. Bump `?v=` in `index.html` with every change to `src/`.
