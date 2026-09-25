# CLAUDE.md — Chronoscope

## Purpose
An interactive, browser-based educational model with two independent investigations: **how many time dimensions?** and **which way does time point?** Hook: why does our universe have one time dimension (answer: strong constraints, no settled model-independent answer). Part of a wider "Reality OS" concept: a fake desktop where each app breaks one classical assumption about reality.

**Positioning (Will, 2026-09-26):** the app is a *lens over time* — every model is seen from time's point of view — but it isn't limited to time; it has grown into physics more broadly, with time as the central theme.

Now a free public learning tool with a life of its own: four scales (Quantum · Voyages · Physics · Cosmos), three tours, Concepts pages; **Learn** mode for newcomers, **Lab** mode for labelled exploratory ideas that challenge the mainstream (intentional). Later: an in-app Claude chat (needs a small server).

## Hosting and domain
- Live on GitHub Pages: `willatwork-git/Physics-TimeDimensions` → https://willatwork-git.github.io/Physics-TimeDimensions/
- Domain **chronoscope.com.au** registered to AgilityAI (Will's business). Not yet pointed at the site.
- Move order: DNS at registrar first → `CNAME` file + Pages custom domain → update og:url / og:image and README links. A CNAME before DNS works breaks the live site.
- Will commits and pushes; Claude only offers.

## Working rules
- Propose before executing any multi-step change. Will reviews; Claude builds.
- No sub-agents without asking Will first.
- Keep `ACTIVE.md` current — **replace, never append**. Archive finished material to `/archive`.
- Keep this file under ~60 lines.
- The GitHub repo is public: anything committed is published.

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
| `DESIGN.md` | Visual language + physics fidelity rules |
| `decisions.md` | Decision records |
| `todo.md` | Tasks |
| `stop-plans.md` | The 20 tour stops: question, setup, prediction, takeaway, handoff (UX spec Phase 0) |
| `sources.md` | References with confidence tags |
| `reviews/` | All reviews: `reviews.md` (external AI reviews, adopted / rejected), `learner-review.md`, the 2026-09-25 teaching and text reviews, and the UX, flow & stickiness design spec |
| `learning.md` | Will's questions, intuitions, aha moments |
| `HANDOVER.md` | Hosting + school edition notes |
| `README.md` | Public-facing (repo is public on GitHub) — keep in sync with features |
