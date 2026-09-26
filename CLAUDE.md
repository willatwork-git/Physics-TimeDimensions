# CLAUDE.md — Chronoscope

## Purpose
An interactive, browser-based educational model with two independent investigations: **how many time dimensions?** and **which way does time point?** Hook: why does our universe have one time dimension (answer: strong constraints, no settled model-independent answer). Part of a wider "Reality OS" concept: a fake desktop where each app breaks one classical assumption about reality.

**Positioning (Will, 2026-09-26):** the app is a *lens over time* — every model is seen from time's point of view — but it isn't limited to time; it has grown into physics more broadly, with time as the central theme.

Now a free public learning tool with a life of its own: four scales (Quantum · Voyages · Physics · Cosmos), three tours, Concepts pages; **Learn** mode for newcomers, **Workbench** mode (internally `lab`, `?mode=lab`) for labelled exploratory ideas that challenge the mainstream (intentional). Later: an in-app Claude chat (needs a small server).

## Hosting and domain
- Live on GitHub Pages: `willatwork-git/Physics-TimeDimensions` → https://willatwork-git.github.io/Physics-TimeDimensions/
- Domain **chronoscope.com.au** registered to AgilityAI (Will's business). Not yet pointed at the site.
- Move order: DNS at registrar first → `CNAME` file + Pages custom domain → update og:url / og:image and README links. A CNAME before DNS works breaks the live site.
- Planned (D-053): at launch a clean public copy syncs to a Cloudflare site; this repo keeps the working notes.
- Will commits and pushes; Claude only offers.

## Ways of working
- **Roles.** Will sets direction, decides, and clears the path ahead; Claude proposes, builds, tests and records. No sub-agents without asking Will first.
- **Two kinds of change.** Housekeeping (`tools/`, tests, doc hygiene, refactors a visitor can't see): do it, tell Will in a line. Product (anything a visitor sees, physics content, UX): propose first. UX follows the UX spec (D-042); tour content lives in `src/stops.js`, from `stop-plans.md`.
- **Healthy = `tools/regress.sh` passes.** Run it after each change set. The harness is Claude's to own: when a bug slips past it, adding the check is part of the fix (see `tools/README.md`).
- **Done means:** regress passes · `?v=` bumped if `src/` changed · decision logged if one was made · ACTIVE.md true · README updated if a visible feature changed · new claims traced in `sources.md`.
- **Evidence.** Physics numbers come from the labs' own formulas, never estimates. Mission targets are reachable and never met at any starting setup. Text probes first; screenshots for visual questions.
- **Review (optional).** ChatGPT ("SOL") can review plans or spot-check the live site. Claude may suggest one when outside eyes would help. Judge each point on its merits, log it in `reviews/reviews.md`; Will arbitrates.
- **Sessions.** Staying in a long session is fine; a fresh session per big piece of work is cheaper and preferred. Keep ACTIVE.md true as you go (**replace, never append**; finished material to `/archive`), so `/handover` is quick whenever Will switches.
- Keep this file under ~60 lines. The GitHub repo is public: anything committed is published.

## Physics integrity (non-negotiable)
- Every on-screen claim carries a tag: **ESTABLISHED / CONTESTED / SPECULATIVE / ANALOGY / HYPOTHESIS** — tag claims, not papers. Loose ideas are welcome; they must be labelled, and should say what they predict and what would kill them.
- Every simulation shows its model assumption.
- Every claim traces to an entry in `sources.md`.
- Simulations run real equations (see `DESIGN.md` → Physics fidelity). Where we simplify, the UI says so.
- Do not inherit hype from press releases or AI summaries. Prefer the paper over the coverage.

## Tech constraints
- Plain HTML/CSS/JS. Opens by double-clicking `index.html`. No build step, no server.
- External libs only via cdnjs / jsdelivr, and only if earned (Three.js for 3D, nothing else by default).
- Cache-busting: every `src/` link in `index.html` carries `?v=N`. Bump N (one sed) whenever changed files ship, or returning visitors get stale code.
- Split into `/src/*.js` modules (classic `<script>` tags, not ES modules — `file://` blocks module imports).
- Must run smoothly on a MacBook; target 60fps, degrade gracefully.

## Docs map
| File | Role |
|---|---|
| `ACTIVE.md` | Current focus (always read) |
| `spec.md` | What each panel shows and teaches |
| `DESIGN.md` | Visual language, physics fidelity, and **the lab pattern** every new lab follows |
| `decisions.md` | Decision records |
| `todo.md` | Tasks |
| `stop-plans.md` | The 20 tour stops: question, setup, prediction, takeaway, handoff (UX spec Phase 0) |
| `sources.md` | References with confidence tags |
| `reviews/` | All reviews: `reviews.md` (external AI reviews, adopted / rejected), `learner-review.md`, the 2026-09-25 teaching and text reviews, and the UX, flow & stickiness design spec |
| `learning.md` | Will's questions, intuitions, aha moments |
| `HANDOVER.md` | Hosting + school edition notes |
| `README.md` | Public-facing (repo is public on GitHub) — keep in sync with features |
