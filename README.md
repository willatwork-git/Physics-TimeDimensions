# Chronoscope — the holes in time

An interactive, browser-based guide to the open questions about **time**: where physics' account of
time doesn't add up, what physicists have proposed over the last century, and how to tell solid
science from speculation.

The hook: *why does our universe have exactly one time dimension?* The honest answer, which you reach
by exploring, is that physics has strong constraints on it but no settled, model-independent answer.

**▶ Try it live: [willatwork-git.github.io/Physics-TimeDimensions](https://willatwork-git.github.io/Physics-TimeDimensions/index.html#home)**
· [Lab mode](https://willatwork-git.github.io/Physics-TimeDimensions/index.html?mode=lab#home)
· [classroom edition](https://willatwork-git.github.io/Physics-TimeDimensions/index.html?edition=school#home)

![Home: the hook, two guided tours and the three scales of time](docs/screenshot-home.png)

## Run it locally

Download or clone the repo and **double-click `index.html`**. There is no install, build step or server.
It works offline; fonts fall back to system fonts without a connection.

| Want | Open |
|---|---|
| Learn mode (default): mainstream and frontier physics, guided | `index.html` |
| Lab mode: the raw workbench, including exploratory ideas | `index.html?mode=lab` |
| Classroom version (Learn only, no switch) | `index.html?edition=school` |

## Two modes: Learn and Lab

Chronoscope has two audiences, split by one switch in the header.

- **Learn** (the default) — physics as physicists hold and debate it, plus published proposals from
  the fringe, all tagged. The Atlas stays uncluttered (idea names appear as you hover) and each lab
  ends with the next question and a link to where it's explored.
- **◌ Lab** — the raw workbench for experimenting with ideas. It adds this project's own exploratory
  ideas, which deliberately challenge the mainstream, plus your own hypotheses, the Dimension Map,
  exploratory overlays and every filter. None of it is mainstream physics; it's there to be tested.

Every view has its own link (for example `#atlas/H5` or `#flatland/7`), so you can share exactly
what you're looking at, and the browser's Back button works.

The app opens on a home page: take the **7-stop guided tour** (about 20 minutes), explore the map, or go
straight to a lab. Press **?** inside the app for the built-in guide. Works on phones and tablets (the page stacks: simulation first, explanation below); the Atlas map and the 3D Flatland views are at their best on a tablet or desktop.

## What's inside

**Explore**
- **Atlas** — 11 *holes* (known gaps in our account of time, such as the problem of time in quantum
  gravity, the arrow of time, the missing "now") and around 50 *ideas* from 1880 to 2026 that tried to
  fill them. Ideas are placed by year and grouped by approach. Hover a hole to see every attempt at it.
- **Test bench** — every idea scored against the same five hurdles: matches relativity tests, keeps the
  present predictive, allows stable matter, explains the arrow, makes a new testable prediction. Every
  partial, failing or unknown score has a written reason, and you can record your own score where you
  disagree. Each idea also says what it predicts and what would overturn it.
- **Dimension Map** *(Lab)* — a working framework that asks every kind of dimension (space,
  time, internal, scale, state) the same questions, to make the gaps visible.

**Voyages** — time for people who travel
- **Mission clocks** — how much younger the ISS, a GPS satellite or a Moon base makes you (clocks on the
  Moon gain about 56 µs a day — why a lunar time standard is being set up).
- **Talking to Mars** — light delay across the solar system, the conversation drawn as a spacetime diagram.
- **The 1 g voyage** — a steadily accelerating ship reaches the galaxy's centre in about 20 years of
  crew time, 26,000 on Earth. Plus the honest fuel bill.

**Physics labs** — small simulations that run the real equations
- **Flatland** — seven chapters in three acts (with a contents page to jump straight to the 4D chapters) on why extra dimensions are hard to picture: Abbott's Flatland, sphere
  and hypersphere slices, hypercone conics, tesseract slices and shadows, and time as a slice.
- **Field Ocean** — particles as ripples in a field (Klein–Gordon equation). A massless ripple runs at
  light speed; a massive one lags, and its internal clock slows as it speeds up.
- **Clock Lab** — the light clock, and the real relativistic corrections GPS satellites need
  (about +38 µs a day) at any altitude.
- **Spacetime** — drag events and change your speed: observers disagree about what happens "at the same
  time". Includes the twin paradox, drawn exactly.
- **Entropy box** — a gas spreads out and never gathers back. Reverse every velocity (exactly — the
  arithmetic is integer) and it does; nudge one disc by a millionth first and it doesn't.
- **River** — a black hole pictured as space flowing inward (the Gullstrand–Painlevé "river model").
  Fire light and see where it can escape.
- **Two Films** — two exact solutions of a wave equation with *two* time directions that are identical
  at the starting frame and then diverge. With two times, a complete snapshot of "now" doesn't fix
  the future.

**Cosmos** — the universe as a whole
- **Expanding universe** — stand on any galaxy; change matter and dark energy; age and fate.
- **Cosmic horizons** — how far we can see (46 billion light-years) and how far our signals can reach.
- **Boot a Universe** — try other numbers of space and time dimensions and watch what breaks.
- **The Janus point** — a gravitating swarm whose structure grows in both directions of time.

![Cosmic horizons: light at 45°, our past light cone and the event horizon](docs/screenshot-cosmos.png)

![The Atlas: open problems about time along the top, a century of attempts to fill them below](docs/screenshot-atlas.png)

**Learning aids**
- **Two guided tours** — *The puzzle of time* (seven stops from "Do clocks agree?" to "Is one time
  dimension a law of nature?") and *From the ISS to the edge of the universe*.
- **Threads** — each lab links to the same question at the other scales (clocks, 'now', the arrow, 3 + 1).
- **Concepts** — ⓘ markers give a short "why" on hover or tap; the Concepts pages (under Explore) tell the full
  story with the evidence: why clocks disagree, what 'now' means, the arrow of time, why 3 + 1.
- **Predict first** — each lab asks for your guess before explaining (skippable).
- **Glossary** — dotted-underlined terms show a plain definition on hover or tap.
- **Progress** — ✓ marks on what you've seen, and "continue where you left off" (kept in your browser).

**Method**
- **How sure are we?** — a worked example (expanding space vs "tired light") showing how a claim earns
  the label *established*.

![Two Films: the hidden second time direction revealed](docs/screenshot-films.png)

## How claims are labelled

Every claim on screen is labelled. The labels apply to individual claims, not whole papers, because one
paper can contain established maths and speculative physics.

| Tier | Tags | Meaning |
|---|---|---|
| Mainstream | Established · Contested · Ruled out | Held, actively debated, or tested and rejected by working physicists |
| Frontier | Speculative | Published proposals without supporting evidence yet |
| Exploratory | Hypothesis | This project's own ideas and visitors' hypotheses (Lab mode). **Not mainstream physics.** Drawn with dashed outlines |
| Lens | Analogy | History, stories and analogies that help thinking |

Learn mode shows Mainstream, Frontier and Lens; Lab adds Exploratory.

Other rules the project follows:
- Every simulation states its **model assumption** and says where it simplifies.
- Simulations use real equations. Two Films uses exact solutions, so nothing on screen can be a
  numerical artefact.
- Speculative theories (for example two-time physics, three-dimensional time) are described, not
  simulated, because a toy animation would not faithfully execute the theory and would imply
  endorsement.
- References are in [`sources.md`](sources.md), each with a confidence tag. Entries marked ☐ are still
  being checked against the primary source.

## Your own hypotheses

In Lab mode, **+ Your hypothesis** adds an idea to the Atlas. You're asked what it would
predict and what observation would rule it out. Ideas are stored **only in your browser**
(`localStorage`); nothing is sent anywhere. **Export** saves them to a JSON file you can send a friend,
who uses **Import** to add them to their own Atlas. Imported files are treated as untrusted: only
recognised fields are kept.

## Hosting or embedding

The app is static files: `index.html`, `src/` and `docs/`, with no server code. This repo is served by
GitHub Pages from `main`. Put the folder on any other static host, or embed the classroom edition:

```html
<iframe src="https://willatwork-git.github.io/Physics-TimeDimensions/index.html?edition=school#home"
        style="width:100%;height:90vh;border:0"></iframe>
```

The only external request is Google Fonts. To make the school edition the default, set
`edition: "school"` in `src/config.js`. More detail is in [`HANDOVER.md`](HANDOVER.md).

## Project layout

```
index.html          entry point; loads the scripts below in order
src/
  config.js         edition (full / school) and mode (learn / lab)
  progress.js       the visitor's progress, predictions, tour position, own scores (browser only)
  data.js           Atlas: tags, tiers, camps, hurdles, holes H1–H7, first 25 ideas
  data2.js          Atlas expansion: holes H8–H11 and later ideas
  data3.js          what each idea predicts, what would overturn it, and a reason per bench score
  hypotheses.js     visitor hypotheses: storage, export, import
  lab.js            shared drawing helpers, lab harness, reduced-motion handling
  labs.js           Field Ocean, Clock Lab, River, Two Films
  labs2.js          Spacetime diagram, Entropy box
  voyages.js        Mission clocks, Talking to Mars, The 1 g voyage
  cosmos.js         Expanding universe, Cosmic horizons, Boot a Universe, The Janus point
  nav.js            header drop-down menus (Explore · Voyages · Physics · Cosmos · Method)
  docs.js           Dimension Map, How sure are we?
  home.js           Home page, the two tours, the three scales and the threads
  flatland.js       the seven Flatland chapters (own engine)
  atlas.js          Atlas, Test bench, hypothesis form, mode switch, URL routing
  help.js           the Guide overlay
  guides.js         'The controls' — what every button and slider does, per lab
  concepts.js       Concepts pages and the ⓘ popups (why clocks disagree, 'now', the arrow, 3 + 1, tags, hurdles)
  glossary.js       glossary terms and hover definitions
  style.css         all styling (dark theme; colour tokens at the top)
docs/               screenshots for this README
archive/            superseded specs (v1, v2)
```

The code is plain HTML, CSS and JavaScript. Files load as classic `<script>` tags rather than ES
modules, because browsers block module imports from `file://`. Scripts share one global namespace,
`window.Chrono`.

**Adding an Atlas idea** means adding one entry to `src/data2.js`. Copy a neighbouring `E(...)` call:
id, year, name, who, camp, holes, tag, outcome, plain description, reasoning, hurdle scores, note.
**Adding a lab** means one `Chrono.lab.register({...})` call. See the existing labs in `src/labs.js`.

## Project documents

| File | Purpose |
|---|---|
| [`spec.md`](spec.md) | What each panel shows and teaches; the planned build order |
| [`DESIGN.md`](DESIGN.md) | Visual language and physics-fidelity rules |
| [`decisions.md`](decisions.md) | Decision records (D-001 onward) |
| [`sources.md`](sources.md) | References, with confidence tags |
| [`reviews.md`](reviews.md) | Design reviews from other AI systems, and what was adopted or rejected (and why) |
| [`learner-review.md`](learner-review.md) | The app reviewed from a newcomer's point of view, with a phased plan |
| [`todo.md`](todo.md) | Task list |
| [`ACTIVE.md`](ACTIVE.md) | Current focus |
| [`HANDOVER.md`](HANDOVER.md) | Notes for hosting and school use |
| [`learning.md`](learning.md) | The author's learning log: questions, intuitions, aha moments |
| [`CLAUDE.md`](CLAUDE.md) | Working rules for the AI collaborator |

## Status

Working and usable: the Atlas, Test bench, all labs listed above, Learn and Lab modes, the guided tour,
and the school edition. Next are new labs (see [`learner-review.md`](learner-review.md), Phase C). Also planned
(see [`spec.md`](spec.md)): a "Boot a Universe" entrance that turns Tegmark's (space, time)
dimension diagram into named failure modes, a Mode Explorer and Future Compass for two-time physics,
and an arrow-of-time investigation. Also still to do before wider classroom use: a light theme, a
tablet/mobile layout, and teacher notes.

## Credits

Concept and direction: Will ([AgilityAI](https://agilityai.com.au)). Built with Claude (Anthropic).
Design critiques from ChatGPT, Gemini and Google AI Overview are recorded, with what was adopted and
rejected, in [`reviews.md`](reviews.md). The *Flatland* text (E. A. Abbott, 1884) is public domain.

## Licence

- **Code** (`index.html`, `src/`): [MIT](LICENSE).
- **Written documents and screenshots** (the Markdown files, `docs/`):
  [CC BY 4.0](LICENSE-CONTENT). Reuse freely with credit.
- *Flatland* excerpts (E. A. Abbott, 1884): public domain.
