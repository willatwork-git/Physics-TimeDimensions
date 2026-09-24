# Chronoscope — handover notes (for Space School / SpacePort Australia)

## What it is
An interactive, offline-capable web app exploring the open questions about **time**: an Atlas of the known "holes" in physics' account of time and a century of attempts to fill them, plus hands-on labs (Flatland, Field Ocean, Clock Lab, River, Two Films) and a method page ("How sure are we?").

## Editions: separating mainstream from exploratory
Every item carries a tier:
| Tier | Tags | Meaning |
|---|---|---|
| Mainstream | Established, Contested, Ruled out | Held, actively debated, or tested and rejected by working physicists |
| Frontier | Speculative | Published proposals without supporting evidence yet |
| Exploratory | Hypothesis | This project's own ideas and visitors' hypotheses — **not mainstream physics** (Lab mode) |
| Lens | Analogy | History, stories and analogies (e.g. Flatland) |

- **Full edition** (default): a **Learn | Lab** switch in the header. Learn (default for new visitors) = mainstream + frontier + lenses. Lab adds exploratory content, the Dimension Map and the hypothesis tools. `?mode=lab` opens in Lab.
- **School edition**: open `index.html?edition=school`. Learn mode only, no switch. To make it the default, set `edition: "school"` in `src/config.js`.
- **Deep links:** every view has a URL — e.g. `index.html?edition=school#flatland/7` or `#atlas/H5` — handy for lesson handouts.

## Hosting
- **Live:** https://willatwork-git.github.io/Physics-TimeDimensions/index.html#home (GitHub Pages, from `main`). School edition: `index.html?edition=school#home`.
- Static files only — no server code, no build step. Upload the folder (`index.html` + `src/`) anywhere, or embed in a page with an `<iframe src=".../index.html?edition=school" style="width:100%;height:90vh;border:0">`.
- Only external request: Google Fonts (falls back to system fonts offline).
- A built-in Guide ("? Guide" button, or press ?) explains the app for first-time visitors.
- Visitor hypotheses, progress, predictions and own scores are stored in the visitor's own browser only; nothing is sent anywhere. Imported hypothesis files are sanitised (D-020).
- Honours `prefers-reduced-motion`: simulations wait for the visitor to interact before moving.

## Suggested before publishing
- [ ] Teacher-facing notes per lab (age level, suggested questions). Each lab now opens with a Predict-first question, and the 7-stop tour gives a ready lesson sequence; "How sure are we?" includes a classroom prompt.
- [ ] Light theme to match the Space School site (currently dark only).
- [ ] Mobile/tablet layout (currently desktop-first, 1024px+).
- [ ] Verify remaining ☐ citations in `sources.md`.
- [x] Licence: code MIT (`LICENSE`), documents CC BY 4.0 (`LICENSE-CONTENT`); Flatland text public domain.
- [ ] Keyboard access to Atlas nodes (currently mouse-only).

## Credits
Concept and direction: Will (AgilityAI). Built with Claude (Anthropic). External design reviews: ChatGPT, Gemini, Google AI Overview (see `reviews.md`).
