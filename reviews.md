# reviews.md — External design reviews

Same 8-question brief sent to two AIs on 2026-09-24. Assessed by Claude; decisions by Will.

## Google AI Overview (≈2s, also produced a live demo)
**Adopted**
- **Universe Boot Sequence** framing — visitor "boots" an (n, m) universe and gets a specific failure report. Becomes the Dimension Map's core interaction.
- **Slice / shadow view** — an observer on one path through a time *plane* sees objects appear, split, vanish (Flatland-style). Adopted without the "infinite speed / most honest" embellishments.
- **Audio clock** idea — superseded by SOL's equation-driven version.
- "The future is a terrain, not a line" — phrase for a SPECULATIVE card.

**Rejected**
- Surrey paraphrase ("local arrow opposing global arrow in structured environments") — misdescribes the paper.
- Q5 additions ("lithium problem via multi-temporal metrics, confidence: high") — no evidence the work exists; failed the explicit uncertainty test.
- Tegmark tagged ESTABLISHED — too generous.
- "Free will / over-determination" aha — confused framing; the real point (the present can't be freely specified) is covered by SOL's two-films demo.
- Browser Back-button hijack — annoyance, not insight.
- **Evolution-angle slider — rejected on checking.** The two-time wave equation is rotationally symmetric in the (t₁, t₂) plane, so stability does *not* change with angle. Claude initially endorsed this; corrected. The true lesson (no preferred direction) is shown better by SOL's Future Compass.
- Live demo: puts orbits in "3+2" (orbit instability is a *space*-dimension result), shows unlabelled runaway numbers, and labels ("Metric Perturbation Factor") don't correspond to physics. Useful as a cautionary example.

## ChatGPT 6 SOL (≈4m 42s)
**Adopted**
- **Two investigations, one workspace:** "how many time dimensions?" and "which way does the arrow point?" are independent questions. Surrey supports nothing about a second time coordinate. *(Major structural change.)*
- **Tag claims, not papers**; show the model assumption beside every simulation.
- **Future Compass** — in ds² = dt₁² + dt₂² − dx², a direction can rotate from +t₁ to −t₁ while staying timelike: no clean future/past split.
- **Two Films aha** — exact solutions u_A, u_B with identical u, ∂ₜu, ∂ₛu at t=s=0 that later diverge. *Claude verified: both satisfy u_tt + u_ss − u_xx = 0, initial data match, all modes have |k_s| < |k_x| (no growth).*
- **Exact Fourier-mode solutions** instead of finite-difference integration — growth can never be a numerical artefact.
- **Mode explorer**: oscillation for |k_s| < |k_x|, cosh growth with rate √(k_s² − k_x²) otherwise; equation-driven sound.
- **Craig & Weinstein nuance**: constraint gives well-posedness from a full mixed-signature surface; data on t=s=0 alone can remain non-unique.
- **Proper-time clocks** as an entrance misconception-buster: different clock readings ≠ extra time dimension.
- **Correction**: fundamental physics is *not* exactly time-symmetric — T-violation measured in B mesons (BABAR 2012). Our v1 learning outcome overstated this.
- **Pauli two-state model** as exact, simple version of the two-arrows result (alongside the harmonic chain).
- **Pettini (3,2) spacetime** as a case file — verified real, and more on-topic than Kletetschka.
- **Landauer many-body experiment** (Nature Physics 2025) as a measured anchor for the arrow investigation — verified real.
- Soften "why exactly one?" — keep it as the hook, answer that there is no model-independent answer.

**Deferred**
- Prediction/wager game; personal claim ledger — good, but scope. Revisit after v1.
- Relational-clock PRD paper — not yet verified by Claude.

**Critique of SOL**
- Rigorous but visually cerebral: almost everything is a wave equation. Spectacle comes from Google's boot-sequence framing and our own orbit/chain sims.
- Two-films aha depends on the visitor grasping "hidden s-direction data" — needs careful staging (the slice view helps).

## Verdict
Google: framing and spectacle, unreliable on facts. SOL: rigour and the best single interaction; no invented citations among the four checked.

---

## Gemini 3.8 Flash (added 2026-09-24)
**Adopted**
- **Particle stability with two times (corrected version of its Sim 2).** With m ≥ 2, energy is a *vector* in the time plane. Conservation E = E₁ + E₂ with |Eᵢ| ≥ mᵢ allows m < m₁ + m₂ (vectors can partially cancel), so a particle can decay into *heavier* products. Exact kinematics, drawable as a vector triangle. Becomes boot error `ERR_MATTER_UNSTABLE`. Gemini's own framing ("can't decay to a photon in 1+1"; "evaporates instantly into vacuum") was wrong/overstated — in one time, two-photon decay is routine (π⁰ → γγ). Source to cite: Dorling (1970), via Tegmark.
- **Janus point (Barbour, Koslowski, Mercati; cf. Carroll & Chen).** Gravitating N-body system with a complexity minimum; integrate both directions → structure grows away from it both ways. The *cosmological* twin of the Pauli "V". Real equations, spectacular. Added to II.1.
- **Page–Wootters mechanism** — time emerging from entanglement between a clock and the rest of a static universe. Card in Investigation II; bridges to Reality OS's "emergent spacetime" theme.
- **Indefinite causal order (quantum switch)** — order of events can be non-classical *without* extra time dimensions. Card in Investigation II.
- Bars stress-test: correctly names the Sp(2,ℝ) gauge symmetry — use in the Case File.
- Kletetschka as sidebar case study on press amplification — agrees with our plan.
- Memory as a narrative thread for Investigation II ("records form in the direction entropy increases"), linked to the Landauer card.

**Rejected**
- **Sim 1 as specified is wrong.** It says *spatial* high-frequency modes grow ~e^{k t₁} and injects ε·sin(kx) noise. Growth requires |k_s| > |k_x| (variation along the *second time*); a purely spatial sin(kx) mode is stable and would never blow up. Also relies on numerical divergence, which D-006 rules out.
- **"Teleological lockout" aha** — misstates Craig & Weinstein: they use data on a full hypersurface with non-local constraints, not boundary data "at future infinity". Boundary-value-only describes the m = 0 (elliptic) case.
- **Treadmill metaphor** — "you cannot halt forward progression" imports an arrow of time into a dimension question (the conflation D-005 exists to prevent), and contradicts the bare two-time metric, where timelike directions rotate continuously to −t₁ (Future Compass).
- **Surrey paraphrase** — "non-Markovian memory kernels" misdescribes the paper (a time-symmetric treatment of the Markov approximation).
- **Tegmark ESTABLISHED** — too generous, same as Google Overview.
- **Binaural "time angle" chaos** — the equation is rotationally symmetric in (t₁, t₂); rotating the angle changes nothing. Same error as Google Overview's slider.
- DevTools-timeline hijack and 2D undo lattice — gimmicks that frustrate rather than teach.
- **"One time dimension because only there can anything be remembered"** — stated as fact; it's an argument. The proposed bistable flip-flop demo has no real two-time equation behind it.
- Observer section: "electron shells decay into tachyonic modes; matter dissolves into vacuum fluctuations" — overclaim beyond the kinematic result above.

**Critique:** Better physics vocabulary than AI Overview and three good additions, but several confident technical errors in the core wave-equation material — the part a reviewer would check first.

## Scorecard (Claude's assessment)
| | Framing / spectacle | Physics accuracy | Citations | Best contribution |
|---|---|---|---|---|
| Google AI Overview | Strong | Weak | Invented one | Boot a Universe |
| Gemini 3.8 Flash | Moderate | Mixed | Real, unverified details | Two-time particle decay; Janus point |
| ChatGPT 6 SOL | Moderate | Strong | 4/4 checked real | Two Films; two-investigation split |

---

## Google AI Overview — new-module proposals (2026-09-25)
Seven module ideas, sent by Will after searching for similar apps. Assessed by Claude; decisions by Will (pending: Quantum as a fourth scale, Tour 3).

**Adopt, corrected**
- **Delayed choice (Wheeler).** Best of the set: a real, repeated experiment (single-photon delayed choice, Jacques et al. 2007 ☐), exactly simulable (Mach–Zehnder amplitudes). *Correction:* the proposal says users "manipulate whether a particle has a definite past" and that it "challenges the linear progression of time". Standard QM needs no retrocausation; the lesson is that no definite path should be assigned before measurement. Interpretation CONTESTED.
- **The fade-out: Hawking evaporation.** Extends River and H7 with real formulas (T ∝ 1/M; lifetime ∝ M³). *Correction:* the infalling-pair picture is Hawking's own heuristic — tag ANALOGY. Show the information question as Hawking curve vs Page curve (Page 1993; islands 2019 ☐), CONTESTED.
- **Wormhole bridge (Kruskal–Szekeres).** The diagram is ESTABLISHED maths and a strong lab. *Correction — wrong as stated:* nothing can cross an Einstein–Rosen bridge into the other exterior "without breaking the speed limit"; the bridge pinches off faster than light can cross, and the white-hole region lies in the past, not ahead. The lab should show *why* it can't be crossed. Traversable wormholes need exotic matter (Morris & Thorne 1988 ☐) — SPECULATIVE.
- **Time loop (Gödel / closed timelike curves).** Light cones tipping in a rotating universe is exact, ESTABLISHED maths. *Correction:* our universe is measured not to rotate; the Tipler cylinder requires infinite length; chronology protection (Hawking 1992) is CONTESTED.
- **The frozen universe (Wheeler–DeWitt).** Already planned as the Page–Wootters "clock in a frozen universe" — build with the real formalism (Moreva et al. 2014 photon demonstration). *Correction:* "time as a domestic illusion" is garbled; the claim is that time can emerge as correlation between a clock and the rest.

**Reject as simulations → Concepts pages**
- **Two-time physics (4 + 2) sim.** A toy animation cannot execute Bars' theory faithfully (D-009). Instead: Boot a Universe's (4, 2) cell notes Bars' Sp(2,ℝ) gauge symmetry, SPECULATIVE. ("Caquality violations" — garbled; causality.)
- **Holographic projector (AdS/CFT).** No honest equation to run; "projects an arrow of time" is invented. A Holography concept page can present the real result (entanglement ↔ geometry, Ryu–Takayanagi ☐).

**Structure suggested:** a "Quantum & Emergence" section. Counter-proposal: **Quantum** as a fourth scale (the very small), ordered Quantum → Voyages → Physics → Cosmos; "Emergence" leans on interpretation. Wormhole + time loop + twin paradox + 1 g voyage → **Tour 3: Is time travel possible?**

**Critique:** Same pattern as before — strong framing and ideas, three confident technical errors (wormhole traversal, AdS/CFT arrow, delayed-choice retrocausation), two garbled phrases.
