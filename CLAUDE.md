# CLAUDE.md — Chronoscope

## Purpose
An interactive, browser-based educational model with two independent investigations: **how many time dimensions?** and **which way does time point?** Hook: why does our universe have one time dimension (answer: strong constraints, no settled model-independent answer). Part of a wider "Reality OS" concept: a fake desktop where each app breaks one classical assumption about reality.

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
| `sources.md` | References with confidence tags |
| `reviews.md` | External AI reviews: adopted / rejected |
| `learner-review.md` | Newcomer's-eye review; phases A (done) → B → C |
| `learning.md` | Will's questions, intuitions, aha moments |
| `HANDOVER.md` | Hosting + school edition notes |
| `README.md` | Public-facing (repo is public on GitHub) — keep in sync with features |
