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
| `30-views` | Every `header [data-view]`, tour stop and tour quiz loads in Learn, Workbench (`?mode=lab`) and school edition (`?edition=school`) with no JS errors and no blank lab canvas |
| `40-labs` | Every lab's `tick` + `draw` steps without error; every mission in `Chrono.MISSIONS` is **not** passed on arrival and **does** complete via "Show me", then advances |

**Pre-commit hook** (`tools/hooks/pre-commit`, enable once per clone: `git config core.hooksPath tools/hooks`):
if `src/` or `index.html` is staged it runs the regression and a failure blocks the commit. Doc gaps (src/
changed but ACTIVE.md or README.md not staged) only warn. Emergency bypass: `git commit --no-verify`.

## Known gaps — not checked yet
- Flatland engine internals (`#flatland` views load, but the step logic isn't driven)
- Visual layout: overlaps, text overflow, contrast. Phone widths (only 1440×900 is rendered)
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
- **Headless Chrome runs no animation frames under virtual time.** Frame-driven logic is tested by calling
  `Chrono.lab.def(id).tick(dt)` and `Chrono.missions.tick(def, dt)` directly.
- `progress.js` reads localStorage when it loads — set state in a probe via `Chrono.progress.*` after `load`,
  not by writing localStorage.
- Browser errors carry the route that was showing and two stack frames. Chrome runs with `--allow-file-access-from-files`; without it, errors from `file://` scripts arrive as an opaque "Script error." with no detail.
- Some faults are timing-dependent (an animation still running just after you leave a page). If a check fails intermittently, run it a few times with `--only`: the route in the error says where to look.
- Chrome path: `$CHROME` if set, else the macOS default. Without Chrome, browser checks warn and skip.
- The window is 1440×900; lab canvases need the page wider than ~500 px to size at all.
