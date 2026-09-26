# ACTIVE

**Where things stand (2026-09-26):** UX spec Phases 0–4 complete, plus this session's work: Stars reworked as an
engine (D-054) and **the lab pattern** every lab follows (`DESIGN.md`); an entropy/complexity thread from Will's
insight (D-055); "Is entropy a thing?" and a Radiation concept page (D-056); and **the maths layer** — every lab has
a `#maths` page whose worked examples are tested against the lab's own code (D-057, `src/maths.js`). 21 labs +
Flatland, 42 missions, 56 worked examples. Assets at `?v=102`. `tools/regress.sh`: 17 pass, 2 warnings (below).

**Next: Phase 5, launch readiness** (`todo.md` → Phase 5). First step — the two regression warnings:
1. **Phone label overlaps** in 10 labs (`35-phone` warns; mostly a model footnote hitting the text above). Open
   `tools/last-run.log` for the list, fix each lab's canvas text, then make the check fail instead of warn.
2. **Lab pattern:** controls take 3+ rows at 1440 px in delayed, frozen, voyage, spacetime, hawking, wormhole,
   expand (`40-labs` warns). Trim or regroup, then tighten.
Then: verify ☐ citations in `sources.md` · light theme · teacher notes · keyboard Atlas · hosting (D-053: a
clean public copy on Cloudflare; DNS first).

**Waiting on Will:** read the new text — Stars aside and element stories (`src/stars.js`), the arrow-of-time and
entropy concept sections and the Radiation page (`src/concepts.js`), the Entropy box complexity paragraph
(`src/labs2.js`), the maths pages (`#maths`). Older reviews still open: Flatland takeaways, `src/stick.js`,
deep-time text, home text, story panels. Phase 1's five-visitor check.

**Ideas offered, not built:** a "What is radiation?" lab; a far-future Timeline step ("a radiation universe").
Will's questions and insights this session are in `learning.md`.

**Gotchas:** headless Chrome runs no animation frames — probes drive `requestAnimationFrame` from a timer; to see
a canvas, draw onto a fixed overlay canvas from a probe (a resize clears the lab canvas). Use Python for scripted
edits, not perl. Nuclear text can trip an output filter: small, astronomy-first pieces. New lab → follow the lab
pattern, including a `src/maths.js` entry (the regression requires it).

**How to resume:** read this file, then `todo.md` → Phase 5 and `decisions.md` from D-054. Check health with
`tools/regress.sh`. Bump `?v=` in `index.html` with every change to `src/`.
