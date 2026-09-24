# Chronoscope — handover notes (for Space School / SpacePort Australia)

## What it is
An interactive, offline-capable web app exploring the open questions about **time**: an Atlas of the known "holes" in physics' account of time and a century of attempts to fill them, plus hands-on labs (Flatland, Field Ocean, Clock Lab, River, Two Films) and a method page ("How sure are we?").

## Editions: separating mainstream from exploratory
Every item carries a tier:
| Tier | Tags | Meaning |
|---|---|---|
| Mainstream | Established, Contested | Held or actively debated by working physicists |
| Frontier | Speculative | Published proposals without supporting evidence yet |
| Exploratory | Hypothesis | Will & Claude's ideas and visitors' hypotheses — **not mainstream physics** |
| Lens | Analogy | History, stories and analogies (e.g. Flatland) |

- **Full edition** (default): all tiers, with a "Show" switch in the header.
- **School edition**: open `index.html?edition=school`. Exploratory content, the Dimension Map and the hypothesis tools are hidden; mainstream + frontier + lenses remain. To make it the default, set `edition: "school"` in `src/config.js`.

## Hosting
- Static files only — no server code, no build step. Upload the folder (`index.html` + `src/`) anywhere, or embed in a page with an `<iframe src=".../index.html?edition=school" style="width:100%;height:90vh;border:0">`.
- Only external request: Google Fonts (falls back to system fonts offline).
- A built-in Guide ("? Guide" button, or press ?) explains the app for first-time visitors.
- Visitor hypotheses are stored in the visitor's own browser only; nothing is sent anywhere.

## Suggested before publishing
- [ ] Teacher-facing notes per lab (age level, suggested questions). The "How sure are we?" page already includes one classroom prompt.
- [ ] Light theme to match the Space School site (currently dark only).
- [ ] Mobile/tablet layout (currently desktop-first, 1024px+).
- [ ] Verify remaining ☐ citations in `sources.md`.
- [ ] Decide licence/credits (Flatland text is public domain; app code by Will with Claude).

## Credits
Concept and direction: Will (AgilityAI). Built with Claude (Anthropic). External design reviews: ChatGPT, Gemini, Google AI Overview (see `reviews.md`).
