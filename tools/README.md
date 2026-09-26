# tools/ — Chronoscope regression

**Purpose.** Any session, fresh or long, confirms the app is healthy in one call — and the checks improve over
time instead of being reinvented.

```
tools/regress.sh               # everything (~15 s)
tools/regress.sh --only views  # checks whose file name contains "views"
```

The screen gets a short summary (✓ passed, ! warning, ✗ failed with enough detail to start fixing). Full
detail goes to `tools/last-run.log` (gitignored) — kept off screen because whatever is printed stays in an
AI session's context. Exit code 1 if anything failed.

## What it covers
| Check | What it proves |
|---|---|
| `10-syntax` | Every `src/*.js` parses (`node --check`) |
| `20-version` | Every `src/` link in `index.html` carries the same `?v=N`; fails if `src/` changed since the last commit but `?v=` didn't move (prints the fix) |
| `30-views` | Every `header [data-view]`, tour stop, tour quiz, Flatland chapter and worksheet loads — and stays where it was sent (a silent redirect fails, except Workbench-only views in Learn) in Learn, Workbench (`?mode=lab`) and school edition (`?edition=school`) with no JS errors and no blank lab canvas |
| `35-phone` | At a real phone width (390 × 844 frame): every lab and Flatland chapter has no sideways overflow, the three header menus on one row, a stage ≥ 260 px, no blank canvas, and no canvas text running off the edge (the probe wraps `fillText` to measure every label), and no two canvas labels drawn on top of each other (a warning until the known ten are fixed — todo.md → Phase 5); the Atlas shows its holes as a tappable list |
| `45-tours` | Every stop of every tour: a locked prediction gives nothing away (readout bar hidden; the right answer's text and the explanation appear only after a guess); each setup inside its lab's slider ranges (a value attribute outside min–max would be clamped silently); no prediction key shared by two stops |
| `50-passport` | The Passport's logic: save / load round trip (and a non-passport file refused without harm), prediction scoring for a lab's own and a tour stop's question, tour stamps dated only when every stop was visited, the header bar's count |
| `55-challenge` | Challenge links end to end: open `?c=clocks&g=0#clocks`, the link is cleared from the address bar, the friend's guess shows before guessing and beside yours after the reveal, Share appears; the app builds correct links, refuses one for a tour stop's own question, and ignores a malformed link |
| `60-teach` | Teacher mode end to end (the spec's Phase 4 "done when"): arrive by a class link → joined, link cleared, on stop 1, class bar showing → finish the route → the completion code decodes to exactly that progress; the same code fails against another class name or with one digit altered; a lab-set code round-trips; the teacher's link builder; the worksheet has one question per stop that asks one |
| `65-maths` | Every lab (and Flatland) has an entry in `src/maths.js`; each worked example — the lab set to the example's setup, or driven by the example's `run` — must reproduce the page's value (from the equation or the published figure; text answers compared exactly); each lab links to its page; each page renders |
| `40-labs` | Every lab's `tick` + `draw` steps without error; every lab has `readouts()` giving up to 3 `[label, value]` pairs with real values; controls take at most two rows at 1440 px (WARN — the lab pattern, DESIGN.md); every mission in `Chrono.MISSIONS` is **not** passed on arrival and **does** complete via "Show me", then advances; mission circles (one per mission, filled when done, each reopens its mission); Try boxes hidden until a lab's missions are done; every slider matches a guide row (control hints — a WARN names any that don't) |

**Pre-commit hook** (`tools/hooks/pre-commit`, enable once per clone: `git config core.hooksPath tools/hooks`):
if `src/` or `index.html` is staged it runs the regression and a failure blocks the commit. Doc gaps (src/
changed but ACTIVE.md or README.md not staged) only warn. Emergency bypass: `git commit --no-verify`.

## Known gaps — not checked yet
- Flatland engine internals (`#flatland` views load, but the step logic isn't driven)
- Visual layout: contrast, and overlaps between canvas text and drawn shapes (label-on-label overlap is checked). To see a canvas headless, export it with `toDataURL` from a probe — `--screenshot` fires before timers run. Phone widths: headless Chrome won't go below ~485 px, so a "390 px" screenshot is a cropped wider page — for a true phone view, load the app in a 390 px `<iframe>`
- Predict-first flow (lock → guess → reveal), tour completion and Continue card state
- Physics values against `sources.md` — correctness of numbers is still by review
- `src/stars.js` (not loaded yet)

## Adding a check
Drop `tools/checks/NN-name.sh` in (NN sets the order). Contract:
- Environment provided: `REPO`, `LOG`, `WORK` (scratch dir, removed after), `CHROME_BIN` (may be empty).
  `source "$REPO/tools/lib.sh"` for `pass` / `warn` / `fail` / `log`, `make_probe_copy`, `run_page`, `jget`.
- Print one or more lines `PASS|WARN|FAIL name: detail`. Anything else goes to the log only — use `log`.
- A browser check: write a probe in `tools/probes/` that runs before the app's scripts, does its work after
  `load`, and writes a JSON result into `<pre id="RES">`. Copy `30-views.sh` as the template.
- Prove the check can fail before trusting it: break the thing once, watch it go red, restore.

## Quirks
- **Headless Chrome runs no animation frames under virtual time** (timers do run). The views probe therefore
  replaces `requestAnimationFrame` with a 16 ms timer, so the app's real frame loops draw. Without that, every canvas
  stays transparent and a blank check passes on nothing (it did, until 2026-09-25). The labs probe instead steps
  `Chrono.lab.def(id).tick(dt)` and `Chrono.missions.tick(def, dt)` directly.
- A canvas looks empty for a moment after a resize clears it; the blank check looks twice (400 ms apart) before failing.
  Only painted pixels count (alpha > 0 and not the stage colour).
- `progress.js` reads localStorage when it loads — set state in a probe via `Chrono.progress.*` after `load`,
  not by writing localStorage.
- Browser errors carry the route that was showing and two stack frames. Chrome runs with `--allow-file-access-from-files`; without it, errors from `file://` scripts arrive as an opaque "Script error." with no detail.
- Some faults are timing-dependent (an animation still running just after you leave a page). If a check fails intermittently, run it a few times with `--only`: the route in the error says where to look.
- `run_page` un-escapes the dumped `<pre id="RES">` (the DOM dump HTML-escapes `&`, `<`, `>`, quotes), so probes can return URLs and text safely.
- Checks with several assertions keep them in a small node file next to the probe (e.g. `challenge.verify.js`) — inline `node -e '…'` breaks on apostrophes.
- Chrome path: `$CHROME` if set, else the macOS default. Without Chrome, browser checks warn and skip.
- The window is 1440×900; lab canvases need the page wider than ~500 px to size at all.
