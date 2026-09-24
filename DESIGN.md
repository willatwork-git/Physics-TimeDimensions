# DESIGN.md — Chronoscope

## Mood
A scientific instrument, not a sci-fi poster. Think observatory console at night: dark, precise, luminous data. Beauty comes from the simulations themselves, not decoration.

## Palette (CSS custom properties)
The region colours below are the original Dimension Map plan; the live token set is at the top of `src/style.css` (camp colours `--c-*`, tag colours `--t-*`).
| Token | Hex | Use |
|---|---|---|
| `--bg` | #0b0d12 | Page background |
| `--panel` | #12151d | Panels, cards |
| `--line` | #232836 | Grid lines, borders |
| `--text` | #e6e8ee | Body text |
| `--muted` | #8a90a2 | Secondary text |
| `--accent` | #7cc4ff | Our universe (3,1), primary highlights |
| `--unstable` | #ff7a59 | Unstable region |
| `--simple` | #9b8cff | Too-simple region |
| `--elliptic` | #4fd1a5 | Elliptic region |
| `--ultra` | #f2c94c | Ultrahyperbolic region |
| `--tachyon` | #e36bd0 | Swapped/tachyonic region |

Confidence tags (tokens `--t-*` in `src/style.css`): ESTABLISHED = teal `--t-est`; CONTESTED = amber `--t-con`; SPECULATIVE = orange `--t-spe`; ANALOGY = pink `--t-ana`; HYPOTHESIS = blue `--t-hyp`, **dashed** outline; RULED OUT = muted, struck through. Tags are small-caps pills, always visible next to the claim.

Tier pills (Mainstream / Frontier / ◌ Exploratory / Lens) sit beside the tags. Exploratory content is always dashed — outlines, arcs, card borders — so it is visually separable without reading labels (D-017).

## Typography
- UI/body: Inter (Google Fonts), fallback system-ui.
- Numerals, axes, equations: JetBrains Mono.
- Equations rendered as plain Unicode/HTML (no MathJax in v1).

## Modes (D-023)
- **Learn**: calm by default — Atlas idea names only on hover/select (`.mode-learn`), camp filters only, every lab aside ends with a **Next question** card linking onward. Never show exploratory content.
- **Lab**: dense and raw — all labels, tag filters, hypothesis tools, exploratory overlays. The switch shows Lab with the dashed exploratory style.
- Every view is a URL (`Chrono.nav`, D-024). Link between views with plain `href="#view"`.
- **Flatland**: chapter bar above the stage in three acts, ★ = 4D chapters; contents card on first visit (D-028).
- **Home** is the landing view, with the tour as its hero and a 7-stop itinerary; the **tour bar** sits above the stage while touring and hides next-question cards (the tour owns the path).
- **Predict first** cards (amber) sit under the lab title and hold back the explanation until a guess or skip.
- **Three depths of explanation (D-034):** glossary underline (what a word means) → ⓘ popup, ≤ 3 sentences (why it's so) → Concepts page (the full story, evidence, how sure). ⓘ goes on labels only — thread names, tier rows, hurdles — never inside running text.
- **The controls** (D-032): every lab's right panel lists its controls, from `src/guides.js`. A new lab needs an entry there.
- **Glossary**: dotted underline, first use per panel only; never inside headings, buttons, tags or links.

## Scales and threads (D-031)
- Four scales, colour-coded in the nav, smallest first: **Quantum** cyan `#5ee0e6` (D-036), **Voyages** pink, **Physics** teal, **Cosmos** violet (Explore blue, Method amber).
- A new lab joins a **thread** by adding its view key to `THREADS` in `src/home.js`; the aside shows the thread automatically.

## Layout
- **Small screens (D-029):** one column below 900 px portrait — stage first, explanation below. Two-pane canvases use `split()` (flatland.js) or a `tall` check (labs.js): side by side when wide, stacked when tall. New labs must do the same.
- Desktop-first, 1280–1920px. Min supported 1024px.
- Panel 1: grid on the left (~55%), live-sim + explainer side panel on the right.
- Explainers: one-line claim → two-sentence explanation → "Go deeper" expander.

## Motion
- Simulations are the motion. UI transitions ≤ 200ms, ease-out.
- Particles/trails use additive glow (canvas `globalCompositeOperation = 'lighter'`) sparingly.
- Respect `prefers-reduced-motion`: each sim opens still and runs once the visitor interacts with it (`Chrono.motion`, D-021).

## Physics fidelity
- Integrators: velocity-Verlet (symplectic, time-reversible) for orbits and the harmonic chain.
- Show units or dimensionless labels honestly; never imply real-world scale we haven't computed.
- Where a sim is an analogue or simplified model (Investigation II), a visible "Analogue" label says so.
- Two-time wave demos (I.3, I.4) use **exact Fourier-mode solutions** — no numerical integration, so growth is never an artefact.
- Every simulation displays a **Model assumption** line.

## Sound
- Web Audio, **muted by default**, with a visual equivalent always shown. Frequencies come from the equations (ω = √(k_x² − k_s²)).

## Entrance console
- Boot log in JetBrains Mono, line-by-line reveal, error codes coloured by region. Success on (3,1) resolves into the calm observatory view.

## Future: Reality OS
Chronoscope becomes one "app" window. Keep each panel self-contained (own canvas, own state, init/destroy functions) so it can be lifted into a window manager later.
