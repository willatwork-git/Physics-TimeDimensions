# text-review-2026-09-25.md — Chronoscope's on-screen text, read as a human would

**Status (2026-09-25):** Part 4 bugs fixed; Part 1 partly adopted (intro line, Remember card, controls moved after predicting); most Part 2 text fixes applied (D-033). Deferred: "How sure?" line, "Picture it" analogies, fine-print restyle, style rules.

**Scope:** every view's text as a visitor reads it — Home, Atlas (+ holes H1, H3, H5 and four idea panels),
Test bench, all 14 labs, Flatland 1–7, How sure are we?, the Guide. Captured by rendering the app headless
at 1440 × 900 (Learn mode), before and after the Predict-first card. Claude's review; decisions Will's.
Companion to `review-2026-09-25.md` (teaching, content, design); this file is only about **the words**.

Proposed text below is a draft for Will to edit. New factual claims are few and marked ☐ where they need a
`sources.md` entry.

## Verdict

The writing is already better than most science apps: short sentences, concrete numbers, honest caveats,
and the **Try:** boxes are excellent. The problems are about **order, framing and finish**, not quality:

1. **The panel reads in the wrong order.** Predict → Controls → *then* what you're looking at. A reader meets
   instructions for buttons before being told what the picture is.
2. **Before predicting, there is nothing to read** except the question and a button manual. No one-line
   "what is this" survives the Predict-first gate.
3. **Pages start well and stop abruptly.** No page ends with "the one thing to remember"; the last lines are
   thread chips, a next-question card and sources.
4. **The tag pills at the top don't say what they refer to.** `MAINSTREAM ESTABLISHED CONTESTED` — which
   claim is contested? The reader has to find out three paragraphs later.
5. **Technical fine print is mixed into the reading flow.** Model-assumption lines (comoving, ΛCDM,
   velocity-Verlet, Lagrange–Jacobi, coarse-grained, softened) sit at full weight among plain-English text.
6. **Analogies are under-used outside Flatland.** The physics labs lean on the simulation alone; one good
   everyday picture per lab would double what a newcomer keeps.

## Part 1 — One reading pattern for every lab

A fixed shape lets a reader learn *how to read* the app once. Every lab panel, in this order:

| # | Block | Length | Visible before predicting? | Exists now? |
|---|---|---|---|---|
| 1 | **Eyebrow + title** | — | yes | yes |
| 2 | **What you're looking at** — one or two sentences, no spoilers | ≤ 35 words | **yes** | no (buried in body) |
| 3 | **How sure?** — one line replacing the bare pill row: *"The clock effect: ESTABLISHED. The ship: SPECULATIVE."* | 1 line | yes | no (pills only) |
| 4 | Predict first → your answer + explanation | — | — | yes |
| 5 | **Try:** | 2–3 sentences | after | yes |
| 6 | **Why it matters** — the link to time's holes, in human terms | 2–4 sentences | after | partly |
| 7 | **Picture it this way** — one everyday analogy, tagged ANALOGY | 1–3 sentences | after | rarely |
| 8 | **The one thing to remember** — a single bold sentence | ≤ 20 words | after | no |
| 9 | Threads · Next question | — | after | yes |
| 10 | **The controls** — collapsed by default once the visitor has used the lab | — | yes | yes (open, high up) |
| 11 | **Fine print** — model assumption, maths, grid effects — smaller, under a "For the technically minded" label | — | after | yes (full weight) |
| 12 | Sources | — | after | yes |

Moves, in effect: controls go down and collapse; a no-spoiler intro goes up; "remember" and "picture it"
are new; model assumptions become fine print. *Proposed D-035.*

**Also cut repetition.** After a prediction is checked, the reveal text and the body say the same thing
twice (Clock Lab, Entropy box, Horizons, Expanding universe). Once the reveal is shown, the body's first
paragraph can drop the repeated sentence.

## Part 2 — Page by page

Format: **Add** = new text; **Rewrite** = replace; **Fix** = error or inconsistency.

### Home

- **Fix — hole count.** Home says "10 open problems", the Atlas panel says "one of 10 holes", the nav menu
  says "Eleven holes", README says 11. (H11 is Lab-only.) Use one rule: Learn shows "ten", Lab "eleven", or
  drop the number from the nav description.
- **Add** one sentence under the hook that says *why it matters to a person*:
  > Time is the one thing everyone uses and nobody in physics fully understands. Two of our best theories
  > disagree about what it even is.
- **Rewrite** the tour intro so a reader can choose between tours by *who they are*:
  > **Tour 1 · The puzzle of time** — if you want the big question: why is there one time, and only one?
  > **Tour 2 · From the ISS to the edge of the universe** — if you'd rather start with astronauts and
  > spacecraft and zoom out.
- The "How this works" aside explains tags before the reader has seen any. **Add** a first line:
  > Everything here is labelled by how sure physicists are. You'll see these tags on every page:

### Atlas (landing panel)

- Good hook. **Rewrite** the second paragraph so the metaphor is explained before it's used:
  > Think of physics' account of time as a map with holes in it — places where the theories don't add up.
  > The ten glowing nodes along the top are those holes. Every dot below is someone's attempt to fill one,
  > placed by year and coloured by approach.
- "Colour = camp" — **rewrite** to say what a camp is:
  > Colour shows the approach (the "camp"): some try to add more time, some argue for less, some look for
  > a cause in the cosmos.
- "Test-bench scores are Claude's first-pass judgement" — the public-voice rule (D-025) says "this
  project". **Rewrite:** "Test-bench scores are this project's first judgement — made to be argued with."

### Hole panels (H1–H10)

- Strong, compact. Each lacks the **plain-language stake**. **Add** a one-line "In one line" above the body
  (DESIGN.md already specifies this). Drafts:
  - H1: *Our two best theories disagree about what time is.*
  - H3: *The laws barely care which way time runs — so why does everything?*
  - H4: *Physics has no place in its equations for "now".*
  - H5: *Why exactly one time dimension? Nobody has shown it had to be.*
- H1: "(the Wheeler–DeWitt equation)" — fine, but **add** the glossary underline, and one clause:
  "…time dropped out altogether — the equation describes a universe that doesn't change."
- H3: "1 in 10^(10^123)" renders as caret text. **Fix:** superscripts, and **add** a human scale:
  > …a number with more zeros than there are particles in the observable universe.
- H3: **Fix** per `review-2026-09-25.md` §2.1 — "(almost)" is right here; make the exception explicit:
  "(almost — one rare particle process tells past from future, far too weakly to explain the arrow ☐)".
- "Attempts to fill it" lists names only. **Add** the tag colour dot or a one-word status (✓ established,
  ✗ ruled out) so the list reads as a story, not a roster.

### Idea panels

- **Fix — duplicated label.** Tired light shows "What killed it" as a heading and again as "What killed it:"
  at the start of the text.
- **Fix — four labels for one slot:** "Says" (Tegmark), "Predicts" (WDW), "Would predict" (Bars), "What it
  predicted" (Tired light). Keep status-dependent wording but fix one set: *Predicts / Would predict / Predicted*
  and *What would overturn it / What killed it*. "Says" → "Predicts".
- The byline status phrases ("Widely cited", "Mainstream problem", "Open, niche") are undefined. Either
  explain in the Guide or replace with plain words: "Widely discussed", "The problem itself", "Active, small
  community".
- The five "You: agree ▾" selectors make each panel long. **Collapse** them behind a single "Score it
  yourself" link; show the reasons alone by default.
- Jargon to unpack or glossary: "HΨ = 0", "gauge symmetry, Sp(2,ℝ)", "shadow of a 4+2 world".
  Bars rewrite:
  > Our world could be a "shadow" of one with four space and two time dimensions. A special symmetry of the
  > theory cancels the problems a second time normally causes.

### Test bench

- **Fix — wrong panel.** The Test bench shows the Atlas intro ("Hover a hole…"). It needs its own:
  > **Test bench.** Every idea faces the same five hurdles. A good theory of time has to pass all five —
  > so far, nothing does. Click any row to see why it scored as it did, and set your own score where you
  > disagree.
  > *✓ passes · ◐ partly · ✗ fails · – doesn't apply · ? unknown*
- **Add** one line per hurdle explaining why it's a hurdle (in a legend or header tooltip), e.g.
  "Keeps the present predictive — if knowing now doesn't fix the future, physics can't forecast anything."

### Mission clocks

- **Add — before predicting:**
  > Clocks in space don't keep the same time as clocks on the ground. This lab works out by how much, for
  > real missions.
- **Add — Picture it:** "Two runners on a track: one runs faster (speed slows its clock), one runs uphill
  and gets a head start from weaker gravity. Which wins depends on the orbit." *(tag ANALOGY)* — optional;
  the two-effects list already does this well.
- **Remember:** *Speed slows clocks, height speeds them up — and GPS has to correct for both every day.*
- The Scott Kelly paragraph is the best human hook in the app; **move it up** to straight after the
  two-effects list.

### Talking to Mars

- Already the most readable lab. **Add — Remember:** *Everything you see from far away is already old
  news — and there is no shared "now" across the solar system.*
- "Voyager 1 about 23 light-hours (2026)" — keep the year; this ages. Fine.

### The 1 g voyage

- Tags `MAINSTREAM ESTABLISHED SPECULATIVE` before any text — the paragraph "What's real and what isn't"
  answers the question the pills raise. **Move it up** as the "How sure?" line:
  > The clocks: ESTABLISHED. The ship: SPECULATIVE — nobody knows how to build it.
- "hundreds of millions of tonnes" (reveal) vs "about a billion times the ship's mass" (body) — both are
  fine for different destinations but read as a contradiction. **Rewrite** the reveal to name the
  destination: "…for the galaxy's centre, about a billion tonnes of fuel for each tonne of ship."
  (Check against the lab's own number ☐.)
- **Remember:** *You can't beat light — but your own clock can make the trip short.*

### Flatland (1–7)

The best-written section. Mostly small fixes.

- **Ch. 3 — "the point of this whole tab"** → "the point of this whole section" (there are no tabs now).
- **Ch. 6 — "exactly as the video explains"** — the reader doesn't know which video. **Rewrite:** "…built
  the way a well-known 4D visualisation does it (link in Sources)."
- **Ch. 5** is the one chapter that loses non-mathematicians ("one nappe", "hyperplane tilted by θ").
  **Add** a first line: "You may remember conic sections from school: slice a cone and you get a circle,
  ellipse, parabola or hyperbola. This chapter does the same one dimension up." Move the formula to fine
  print.
- **Ch. 7 — final button** reads "Next →" with no destination. **Rewrite:** "Next: Two Films →" or "Back to
  the tour →".
- **Ch. 7 — add Remember:** *In the block picture, nothing moves — only our slice through it does. That's
  why "now" is a puzzle.*
- **All chapters:** the Sources footer repeats four sources on every chapter. Show only the ones used in
  that chapter.

### Field Ocean

- Has the hardest idea for newcomers and the fewest handholds. **Add — before predicting:**
  > Physics says particles aren't tiny balls — they're ripples in fields that fill all of space. Here are
  > two fields side by side: one for light, one for a particle with mass.
- "the speed-budget bars trade off exactly" — the "budget" is never introduced. **Add** before it:
  > Picture it this way: every ripple has a fixed budget. It can spend it moving through space or ticking
  > through time. Light spends all of it on space — so it never ticks.
  *(ANALOGY; it is a picture of the γ relationship, not a law in itself.)*
- "(the Klein–Gordon equation, φtt = φxx − m²φ)" → fine print.
- **Remember:** *Mass is what gives a particle an internal clock — and moving fast slows it.*

### Clock Lab

- "by the factor γ = 1/√(1 − v²/c²)" — **add** the plain version first: "by a factor physicists call gamma:
  at 87% of light speed it's 2, so the moving clock ticks half as fast." Formula to fine print.
- GPS mode has no in-body explanation — only the controls. **Add** two lines:
  > Without these corrections, GPS positions would drift about 10 km a day ☐ (check against the lab's drift
  > figure). Relativity isn't exotic — it's inside your phone.
- **Remember:** *Every moving clock runs slow — not because it's broken, but because time itself does.*

### Spacetime diagram

- Dense but careful. **Add — Picture it:** "Think of spacetime as a loaf of bread. You slice it into
  moments one way; someone moving past you slices the same loaf at an angle. Both sets of slices are
  valid." *(ANALOGY — Brian Greene's image ☐ credit in sources.)*
- "outside each other's light cones" — introduce "light cone" once in plain words: "the region a signal
  could reach in time".
- **Remember:** *'At the same time' depends on who's asking — but cause and effect never flip.*

### The River

- **Add — before predicting:**
  > Near a black hole, time and space behave strangely. This lab uses one exact way to picture it: space
  > itself flowing inward like a river.
- "at the horizon, space and time swap roles" — the claim is stated but never explained. **Add** one
  sentence: "Inside, moving toward the centre is no more avoidable than moving into tomorrow."
- **Remember:** *Gravity slows clocks too — and at the horizon, not even light can swim against the current.*

### Entropy box

- **Fix** (from the other review): "The laws of motion don't care which way time runs" and the next-question
  card — soften to "almost all the laws".
- "coarse-grained over a 8 × 4 grid" → "an 8 × 4 grid", and to fine print.
- **Add — Picture it:** "Shuffle a new deck of cards. It never shuffles back into order — not because it
  can't, but because there are vastly more shuffled orders than ordered ones."
- **Remember:** *Time's arrow comes from the odds, not the laws — and from a universe that started ordered.*

### Two Films

- The strongest idea in the app, but the text is the hardest in the physics labs. **Add — before
  predicting:**
  > In our universe, if you knew everything about this moment, the laws would fix what happens next. This
  > lab asks: would that still work with two time directions?
- "a periodic toy example of the non-uniqueness Craig & Weinstein describe" → plain: "a simple example of
  a result proved by Craig & Weinstein (2009)". Maths to fine print.
- The closing quote "The frame was accurate. It just wasn't enough data." — keep, but **make it the
  Remember line**, and add the pay-off: "…So a universe with two times couldn't be predicted from its
  present. Ours can."
- Tag row `FRONTIER ESTABLISHED SPECULATIVE` → "How sure?" line: *"The maths: ESTABLISHED. Whether it tells
  us anything about our universe: SPECULATIVE."*

### Expanding universe

- **Add — Picture it:** "Dots drawn on a balloon: blow it up and every dot sees every other dot moving
  away. No dot is the centre." *(ANALOGY; note the balloon's surface is the universe, not its inside.)*
- "H₀ = 67.4" — the H₀ symbol and units appear before being defined. **Add:** "the expansion rate, H₀ —
  how fast space stretches, in km/s for every 3.26 million light-years (a megaparsec)".
- **Remember:** *Everything is moving apart from everything else — no centre, and no edge.*

### Cosmic horizons

- The hardest Cosmos lab to read. "conformal", "comoving", "ΛCDM", "teardrop" arrive fast. **Add — Picture
  it:** "An ant walks along a rubber band that's being stretched. Its starting point ends up far further away
  than the ant has walked — that's why we can see light from things now 46 billion light-years away in a
  13.8-billion-year-old universe."
- **Rewrite** "Light at 45° (conformal)" button label to "Light at 45° (stretched view)"; keep "conformal"
  in fine print.
- **Remember:** *There are two edges: how far we can see, and how far we can ever reach — and the second
  is shrinking.*

### Boot a Universe

- Good. "How sure is this?" paragraph is exactly the right pattern — use it as the model for other labs.
- **Add — before predicting:** "Could a universe have four space dimensions, or two times? Boot one and
  see what breaks."
- **Remember:** *Other dimension counts break orbits, atoms or prediction — which is why we find ourselves
  in 3 + 1, though nobody has shown it had to be.*

### The Janus point

- Opening line is the best bridge in the app ("The Entropy box explained why a gas spreads — but only if
  it starts ordered"). Copy this pattern: **every lab's body could open by linking to the previous one.**
- "Lagrange–Jacobi relation", "softened", "root-mean-square distance × mean inverse distance" → fine print.
- **Remember:** *From a special moment, structure grows both ways — so time could have an arrow on both
  sides of the Big Bang (contested).*

### How sure are we?

- Excellent. Two additions:
  - **Add** a one-sentence opener above the table: "Scientists don't settle arguments by vote. They find a
    test where two ideas predict different things — then look."
  - The ladder section: **add** a fifth rung, "Ruled out — failed tests. Still useful to learn from.", to
    match the RULED OUT tag.
- "DESI hints it may be weakening" — needs a date and a source ☐ (it will age).

### Guide

- Clear. Two fixes:
  - The Guide describes Two Films with a FRONTIER pill but no other lab carries a pill here — consistent
    or none.
  - "Built by Will (AgilityAI) with Claude" is fine here (credits belong in the Guide, D-025).

## Part 3 — Global style rules (add to DESIGN.md)

1. **Quote marks:** the app mixes 'now' and "now". Pick one (suggest single quotes for scare quotes, double
   for speech).
2. **Numbers:** always give a human scale after an extreme number ("about 25 millionths of a second a day —
   4.5 milliseconds over a six-month mission").
3. **Formulas:** plain words first, formula in fine print. Exception: when the formula *is* the lesson
   (Flatland ch. 2's √(R² − z²)).
4. **Every term the first time:** light cone, comoving, H₀, megaparsec, redshift, entropy, horizon, γ —
   either glossary underline or a clause.
5. **Bold lead-ins** ("A real problem.", "What's real and what isn't.", "How sure?") work — make them a
   standard set: *Picture it · Why it matters · How sure? · Remember*.
6. **One idea per paragraph, ≤ 60 words.** Most already comply; Janus, Horizons and Two Films don't.
7. **Don't repeat the reveal.** The predict explanation and body shouldn't open with the same sentence.

## Part 4 — Bugs found while reading

| Where | Issue |
|---|---|
| Tired light panel | "What killed it" printed twice |
| Test bench | Shows the Atlas intro text |
| Home / Atlas / nav / README | 10 vs 11 holes |
| Flatland ch. 7 | Final button "Next →" with no destination |
| Entropy box model line | "a 8 × 4 grid" |
| H3 | 10^(10^123) as plain text |
| Flatland ch. 3 | "this whole tab" |

## Suggested order

1. **Bugs** (Part 4) and the Entropy/H3 accuracy fix — an hour.
2. **Reading pattern** (Part 1): reorder panels, collapse controls, fine-print styling — mostly `lab.js`
   and CSS, one change for all labs.
3. **New text:** "What you're looking at", "How sure?" line and "Remember" for all 14 labs, then "Picture
   it" analogies — `labs.js`, `labs2.js`, `voyages.js`, `cosmos.js`.
4. **Idea panels and Test bench** text.
5. **Style rules** into DESIGN.md.

## For Will to decide

- Adopt the fixed reading pattern (proposed D-035)?
- Analogies: one per lab, all tagged ANALOGY — happy with the balloon, rubber band and loaf of bread, or
  prefer fresher images?
- Collapse "The controls" by default after first use, or keep open (D-032 made them visible on purpose)?
