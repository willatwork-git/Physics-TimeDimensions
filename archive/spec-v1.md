# spec.md — Chronoscope

## Core question
**Why does our universe have exactly one time dimension?** And what do recent proposals (two arrows, 3D time, two-time physics) actually claim?

## Learning outcomes
A visitor leaves able to say:
1. The number of space (n) and time (m) dimensions determines what *kind* of equations physics obeys — and only some kinds allow prediction.
2. With one time and three space dimensions, orbits and atoms are stable and the future follows from the present. Change either number and something breaks.
3. "Time flows both ways" results mean the *laws* don't pick a direction — not that time runs backwards.
4. Multiple-time theories exist; they are speculative, and the deep obstacle is predictability.

## Structure
Four panels, navigated as tabs (later: windows in Reality OS). Each panel = one interactive + a short explainer + confidence tag + "Go deeper" (expandable) + sources link.

---

## Panel 1 — The Dimension Map  ← BUILD FIRST
**Concept:** Tegmark's (n, m) diagram as a living grid. Axes: space dims n = 0–5 (x), time dims m = 0–4 (y). Each cell is a region-coloured tile; hovering previews, clicking opens a live simulation in a side panel.

**Regions (per Tegmark 1997, Fig. 1 — verify exact cell boundaries against the paper):**
| Region | Cells | Reason | Live sim | Tag |
|---|---|---|---|---|
| **Our universe** | n=3, m=1 | Hyperbolic equations: present determines future; stable orbits & atoms | Kepler orbit, F ∝ 1/r² — stable, closed | ESTABLISHED |
| **Unstable** | n>3, m=1 | Force law F ∝ 1/r^(n−1): no stable orbits (Ehrenfest 1917); no stable atoms | Same orbit sim with n slider → spirals in or escapes | ESTABLISHED |
| **Too simple** | n<3, m=1 | 2+1 GR has no local gravitational dynamics; limited topology for complex structure | 2D network: signals/wires cannot cross without merging | Gravity fact ESTABLISHED; complexity argument CONTESTED |
| **Elliptic — no evolution** | m=0 | Equations are elliptic (Laplace-like): fields fixed by boundaries, nothing "happens" | Laplace solver: drag boundary values, interior snaps; no clock | ESTABLISHED |
| **Ultrahyperbolic — unpredictable** | m≥2 (n≥2) | Initial data on a surface does not stably determine evolution (Hadamard ill-posedness) | Links into Panel 3 blow-up sim | ESTABLISHED as math; CONTESTED as physics (see Craig & Weinstein) |
| **Swapped / tachyonic** | n=1, m≥2 region | Roles of space and time swap; Tegmark labels "tachyons only" | Text + diagram only (v1) | ESTABLISHED as math; verify cells |

**Interactions:**
- Hover a cell → region name + one-line reason.
- Click → side panel with live sim + explainer.
- "Where are we?" button → pulses (3,1).
- In the orbit sim: continuous n slider (2.0 → 5.0) so the transition to instability is visible, not just asserted. Small nudge button perturbs the orbit.

**Fidelity notes:** orbit sim integrates F = −k r̂ / r^(n−1) with a symplectic (velocity-Verlet) integrator. Laplace sim uses Jacobi relaxation on a coarse grid.

---

## Panel 2 — Two Arrows
**Concept:** A reversible system shows "irreversible" behaviour in *both* time directions away from a special moment.

**Sim:** Harmonic chain (~200 coupled oscillators, velocity-Verlet, exactly time-reversible). At t=0 one oscillator is excited. Integrate forward *and* backward. Plot tagged oscillator's energy over t ∈ [−T, +T]: it decays both ways — a symmetric "V" of relaxation.
- Scrubber: drag through t.
- "Reverse at +T": flip all velocities → energy refocuses (Loschmidt echo).
- "Add noise" before reversing: refocusing fails → why the arrow feels real.

**Honesty note:** This is a classical analogue of the Surrey result (quantum, open systems, Markovian limit). Say so on screen.
**Tag:** ESTABLISHED (physics of reversible relaxation); Surrey result ESTABLISHED as a mathematical result, not a claim that time runs backwards.

---

## Panel 3 — Time as a Plane
**Concept:** With two time dimensions, history is a surface, not a line — and prediction breaks.

**Part A (visual):** A (t₁, t₂) plane. The visitor steers an observer's path. Show that "the future" is not a single direction; closed loops are possible.

**Part B (sim):** Wave equation with two time dimensions, u_t₁t₁ + u_t₂t₂ = u_xx, evolved along t₁ on a (t₂, x) grid. Fourier modes with |k_t₂| > |k_x| grow exponentially → tiny noise explodes. Compare with the ordinary 1-time wave equation (stable).
- Toggle **"Constrained initial data"** (Craig & Weinstein): filter initial data to modes with |k_t₂| ≤ |k_x| → evolution becomes stable. Teaches: predictability is recoverable *only* with a non-local constraint on the present.

**Tag:** ESTABLISHED (mathematics); CONTESTED (whether it rules out multi-time physics).

---

## Panel 4 — The Frontier
Cards, each with: claim · status · what would test it · sources.
- **Two-time physics** (Itzhak Bars) — SPECULATIVE, mathematically careful; extra gauge symmetry removes ghosts; 4D world as "shadow" of 4+2.
- **Three-dimensional time** (Kletetschka, 2025) — SPECULATIVE / fringe; claims particle-mass predictions; minimal uptake.
- **Two arrows of time** (Guff, Shastry, Rocco, 2025) — links to Panel 2.
- **Tegmark's anthropic reading** — why observers find themselves at (3,1).

---

## Non-goals (v1)
- No Reality OS shell yet.
- No 3D (Three.js) unless Panel 3A needs it.
- No mobile optimisation beyond "doesn't break".
