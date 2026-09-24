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

Confidence tags (tokens `--t-*` in `src/style.css`): ESTABLISHED = teal `--t-est`; CONTESTED = amber `--t-con`; SPECULATIVE = orange `--t-spe`; ANALOGY = pink `--t-ana`; HYPOTHESIS = blue `--t-hyp`, **dashed** outline. Tags are small-caps pills, always visible next to the claim.

Tier pills (Mainstream / Frontier / ◌ Exploratory / Lens) sit beside the tags. Exploratory content is always dashed — outlines, arcs, card borders — so it is visually separable without reading labels (D-017).

## Typography
- UI/body: Inter (Google Fonts), fallback system-ui.
- Numerals, axes, equations: JetBrains Mono.
- Equations rendered as plain Unicode/HTML (no MathJax in v1).

## Layout
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
