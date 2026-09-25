# stop-plans.md — Phase 0 of the UX spec (D-042)

**Status:** draft 4 — **signed off by SOL for Phase 1** (2026-09-26) and built into `src/stops.js` (D-043). Tour routes and shared-lab framing were signed off at draft 3; the
four content edits SOL asked for are made in this draft (see "Review log"). Draft 1's review: all points accepted.
Will's decisions: Tour 2 ends at the Cosmic timeline (option A, six stops); the 1 g voyage is split — Tour 2 asks
about crew time, Tour 3 about Earth time. **Ready for final content sign-off**, then Phase 1. 20 stops in all. Once signed off,
each stop becomes a `STOPS` entry in code (Phase 1) and the handoffs become the Next text on each end card.

**Predictions are a per-stop decision**, not a default. Each stop says what the visitor can notice by *reading*,
what they can *discover* by interacting, and whether a *guess* adds anything. Guesses go where the surprise is
strongest: about four per tour, so a tour never feels like a quiz. Labs keep their own question for Explore visits.

**Rule R — reading and exploring routes (every stop with a guess).** The guess card always offers two routes that
skip the guess: **Read the explanation first** (the explanation, takeaway and tags open at once and the page scrolls
to them; the sim is unlocked at the stop's setup) and **Explore freely** (the sim is unlocked at the setup, the
explanation open below). Neither records a guess, neither is penalised, and nothing — answer, readout or control —
stays held behind the guess. Built into the live app on 2026-09-26.

**How to read it.** A *lab* is a piece of physics, written once. A *stop* is the question a tour asks of that
lab. Each tour has a quick-scan table (to spot repetition and weak links), then one block per stop with the
spec's eight fields, plus the prediction and starting setup. Tags follow the app's rules: tag claims, not labs.

**What to check first:** the ⚑ items in "Findings" at the end. They are the places where the current tours
repeat themselves, jump a step, or ask a question the stop doesn't answer.

---

## Tour 1 · The puzzle of time
*For: the big question. Why is there one time, and only one?*

| # | Lab | Arrives with | New here | Handoff |
|---|---|---|---|---|
| 1 | Clock Lab | Do two perfect clocks agree? | In your frame, a moving clock records less time — every kind, by the same factor | Speed changes clock rates. Does gravity? |
| 2 | River | Does gravity change time too? | Gravity slows clocks; at a horizon, not even light escapes | If clocks disagree, do we even agree on what happens *at the same time*? |
| 3 | Spacetime · Whose 'now'? | Is there one 'now' for everyone? | Simultaneity depends on the observer; cause and effect never swap | If 'now' depends on who's asking, what is it at all? |
| 4 | Flatland ch. 7 | So what is 'now'? | Spacetime as a block; 'now' as a slice nothing singles out | A block has no 'now'. So why does time feel like it runs one way? |
| 5 | Entropy box | Why does time only run one way? | The arrow comes from the odds and an ordered start | We've asked why time has a direction. A different puzzle: why only one dimension of time? |
| 6 | Two Films | What would two times do? | For this equation, complete starting data no longer fixes what happens next | That's a strong constraint on two-time theories. Is it why there's one — or just how things are? |
| 7 | Atlas · H5 | Is one time dimension a law of nature? | Strong constraints, no settled answer; who has tried | → Tour quiz |

### 1.1 Clock Lab — Do two perfect clocks agree?
- **Arrives with:** clocks measure time; surely two perfect ones agree.
- **Already knows:** nothing yet.
- **New here:** in your frame, the moving clock records less time over the same interval, by the factor γ — and every kind of clock follows the same rule, so it isn't the mechanism.
- **Do:** press Run it and count ticks on both clocks for ten seconds.
- **Look at:** the two tick counters.
- **Takeaway:** at 0.87 c, in your frame, the moving clock ticks about once for every two of yours. Every kind of clock follows the same rule. ESTABLISHED
- **Limit:** one space dimension; an ideal light clock; flat spacetime (no gravity yet).
- **Handoff:** speed changes clock rates. Does gravity do the same?
- **Predict: yes.** Reading can't prepare you for "about 1"; almost everyone guesses 2. Existing question (0.87 c). **Setup:** light clock, v = 0.87.

### 1.2 River — Does gravity change time too?
- **Arrives with:** speed slows clocks; gravity feels like something else.
- **Already knows:** moving clocks run slow.
- **New here:** clocks deeper in gravity run slow too; at a black hole's horizon, space flows in at light speed.
- **Do:** fire light outward from far away, just outside, and just inside the horizon.
- **Look at:** which flashes get out, and the clock-rate readout near the horizon.
- **Takeaway:** gravity slows clocks too. At the horizon, outward light stands still; inside, it's swept in. ESTABLISHED
- **Limit:** the river picture is one exact way of drawing a non-rotating black hole, not the only one. ANALOGY for "flowing space"; the geometry is ESTABLISHED.
- **Handoff:** clocks disagree about *how fast* time runs. Do observers even agree on what happens *at the same time*?
- **Predict: no.** The discovery is better by doing: fire the three flashes and see which escape. **Setup:** as now.

### 1.3 Spacetime · Whose 'now'? — Is there one 'now' for everyone?
- **Arrives with:** 'now' is the same everywhere, surely.
- **Already knows:** speed and gravity change clock rates.
- **New here:** two events simultaneous for you happen one after the other for someone moving past; only for events no signal could connect.
- **Do:** set speed to 0.6 c, then press "Draw it their way".
- **Look at:** the table — the order of A and B for each observer.
- **Takeaway:** 'at the same time' depends on who's asking, but cause and effect never swap. ESTABLISHED
- **Limit:** special relativity, one space dimension.
- **Handoff:** if 'now' depends on who's asking, what is 'now' at all?
- **Predict: yes.** "Same moment for everyone" is the common expectation; the table overturns it. Existing question (two lamps). **Setup:** scene "Whose 'now'?", v = 0.6.

### 1.4 Flatland ch. 7 — So what is 'now'?
- **Arrives with:** 'now' can't be universal. Then what is it?
- **Already knows:** simultaneity is relative.
- **New here:** stack every moment and you get a block of spacetime; 'now' is a slice, and nothing in the block marks which slice.
- **Do:** move the slice through the block — a way of *exploring* the diagram, not something physical travelling through it.
- **Look at:** the whole history sitting in one shape.
- **Takeaway:** in the block picture every moment is equally there, and nothing marks one as 'now'. That's why 'now' is a puzzle. Relativity of simultaneity: ESTABLISHED. That 'now' isn't physical at all: CONTESTED.
- **Limit:** the block is one interpretation (see hole H4); a growing block is a live alternative.
- **Handoff:** a block has no 'now' and no direction. So why does time feel like it runs one way?
- **Predict: no.** This stop is for reading and looking; a guess adds little. **Setup:** chapter 7.

### 1.5 Entropy box — Why does time only run one way?
- **Arrives with:** the laws of motion work both ways. So why don't eggs unbreak?
- **Already knows:** 'now' and simultaneity are relative.
- **New here:** reversal works exactly — and fails the instant anything is nudged; spread-out arrangements vastly outnumber gathered ones.
- **Do:** remove the wall, wait, reverse; then reverse with the nudge.
- **Look at:** the entropy curve and the left-half count.
- **Takeaway:** the arrow comes from the odds, not the laws — plus a universe that started ordered. ESTABLISHED (why it started ordered: open, hole H3). *Note:* this is one account of the arrow; the Janus point (Tour 2) offers a different one without that kind of beginning. Worth saying where both appear.
- **Limit:** a 2-D gas of 240 soft discs; integer arithmetic makes the reversal exact.
- **Handoff:** we've asked why time has a direction. A different puzzle is why it has only one dimension. What would two do?
- **Predict: yes.** People split on whether exact reversal works; the answer (it does — until the nudge) is the lesson. Existing question. **Setup:** as now.

### 1.6 Two Films — What would two times do?
- **Arrives with:** more time dimensions would mean more freedom.
- **Already knows:** time has one arrow, from the odds.
- **New here:** with two time dimensions, even complete starting data — every value and every rate of change on the slice we see — doesn't fix what this equation does next.
- **Do:** press play on two films that start from the same frame.
- **Look at:** where the films diverge.
- **Takeaway:** for the equation and starting data shown, the future isn't fixed; with one time it would be. That's a serious constraint on theories with two times — not a proof that they're impossible. ESTABLISHED (the mathematics); what it means for real two-time theories: CONTESTED.
- **Limit:** exact solutions of one wave equation with two times; a toy, not a universe.
- **Handoff:** that's a strong constraint on two times. Is it *why* there's only one — or just how things happen to be?
- **Predict: yes.** "Identical start, identical films" is the natural guess. Existing question. **Setup:** as now.

### 1.7 Atlas · H5 — Is one time dimension a law of nature?
- **Arrives with:** one time must be required by something.
- **Already knows:** clocks, 'now', the arrow, and why two times break prediction.
- **New here:** everyone who has tried to answer it, and how far they got.
- **Do:** click three ideas on H5 and read their test-bench scores.
- **Look at:** which ideas clear which hurdles.
- **Takeaway:** strong constraints, no settled answer. CONTESTED
- **Limit:** the scores are first-pass judgements, made to be argued with.
- **Handoff:** → the tour quiz.
- **Predict: none.** A reading and exploring stop; the tour quiz follows.

---

## Tour 2 · From the ISS to the edge of the universe
*For: people who'd rather start with astronauts and spacecraft, then zoom out — to the edge in space, then in time.* Six stops (Will, option A).

| # | Lab | Arrives with | New here | Handoff |
|---|---|---|---|---|
| 1 | Mission clocks | Does space travel make you younger? | Speed slows clocks, height speeds them up; real missions | Clocks differ between Earth and Mars. But could you even hold a conversation with Mars? |
| 2 | Talking to Mars | Can we talk to Mars live? | Signal delay: we see Mars's past; 'now' there must be worked out | Light limits messages. Does it limit how far people can go? |
| 3 | The 1 g voyage | How far could you go in a lifetime? | Crew time shrinks the trip; nothing passes light | Our clocks can cross the galaxy. But the galaxies themselves are moving apart. Are we the centre? |
| 4 | Expanding universe | Is everything flying away from us? | On large scales every galaxy sees the same pattern; no centre | If space keeps stretching, how far can we see, or ever reach? |
| 5 | Cosmic horizons | How far can we ever see? | Two edges: what we see, what we can reach | That's the edge in space. Where are we in the universe's story — and how far into the future can we trace it? |
| 6 | Cosmic timeline | How far into the future can we trace the universe's story? | Today sits ~40% across a powers-of-ten chart — a place on the chart, not a share of the universe's life | → Tour quiz · go deeper: the Janus point, Boot a Universe |

### 2.1 Mission clocks — Does space travel make you younger?
- **Arrives with:** astronauts come back younger, like in the films.
- **Already knows:** nothing yet.
- **New here:** two effects fight: speed slows clocks, height speeds them up. For the ISS speed wins; for GPS height wins.
- **Do:** pick ISS, then GPS, then Moon base.
- **Look at:** the net bar and the six-month total.
- **Takeaway:** six months on the ISS: about 4.5 thousandths of a second younger. Real, measured, far too small to feel. ESTABLISHED
- **Limit:** weak-field formulas, circular orbits.
- **Handoff:** clocks on the Moon and Mars tick at different rates. But could you even hold a conversation with Mars?
- **Predict: yes.** The film-fed expectation ("noticeably younger") is exactly what the lab corrects. Existing question. **Setup:** ISS six months (as now).

### 2.2 Talking to Mars — Can we talk to Mars live?
- **Arrives with:** you could just call Mars.
- **Already knows:** clocks run at different rates in space.
- **New here:** a question and answer take up to three-quarters of an hour; we only ever see Mars as it was.
- **Do:** press Farthest, then send a message.
- **Look at:** the message crossing the spacetime diagram.
- **Takeaway:** we see Mars as it was minutes ago. To say what is happening there *now*, we must choose a way to synchronise distant clocks — and observers moving differently can make different assignments. ESTABLISHED
- **Limit:** circular, coplanar orbits. Signal delay alone doesn't show the disagreement between observers; that needs a second viewpoint — **go deeper:** Spacetime · Whose 'now'?
- **Handoff:** light is the speed limit for messages. Is it also a limit on how far people can go?
- **Predict: no.** Pressing Farthest and watching the message discovers it directly. **Setup:** farthest (done in P0).

### 2.3 The 1 g voyage — How far could you go in a lifetime?
- **Arrives with:** 26,000 light-years must take 26,000 years.
- **Already knows:** light limits messages.
- **New here:** at a steady 1 g, the crew's own clock makes the trip short; nothing ever passes light speed.
- **Do:** fly to Proxima, then the galaxy's centre.
- **Look at:** crew years against Earth years.
- **Takeaway:** the galaxy's centre in about 20 years of crew time; about 26,000 years pass on Earth. ESTABLISHED (the fuel it would need is another matter — the lab shows the bill).
- **Limit:** constant proper acceleration; the fuel mass is shown, not solved.
- **Handoff:** our own clocks could carry us across the galaxy. But the galaxies themselves are moving apart. Are we at the centre?
- **Predict: yes.** "At least 26,000 years" is the near-universal guess; 20 is the surprise. Existing question. **Setup:** galactic centre (done in P0).

### 2.4 Expanding universe — Is everything flying away from us?
- **Arrives with:** galaxies fly away from us, so we're the centre.
- **Already knows:** distances in light-years; nothing passes light locally.
- **New here:** every galaxy sees the same pattern; space itself stretches.
- **Do:** click three different galaxies to stand on.
- **Look at:** the arrows from each viewpoint.
- **Takeaway:** on large scales, distant galaxies show the same expansion pattern from any galaxy's viewpoint; no galaxy is at its centre. Nearby, gravity holds groups of galaxies together. ESTABLISHED (the exact rate: CONTESTED, the Hubble tension).
- **Limit:** a flat universe with Planck 2018 values.
- **Handoff:** if space keeps stretching, how far can we ever see, and how far could we ever reach?
- **Predict: no.** Standing on three galaxies discovers "no centre" directly; the guesses in this tour go where reading can't prepare you. **Setup:** as now.

### 2.5 Cosmic horizons — How far can we ever see?
- **Arrives with:** the universe is 13.8 billion years old, so we see 13.8 billion light-years.
- **Already knows:** space stretches, and no place is the centre.
- **New here:** two edges: the farthest matter we see is now 46 billion light-years away; signals we send now reach only galaxies within about 16 billion.
- **Do:** drag the galaxy outward past both edges.
- **Look at:** the teardrop past light cone and the event horizon.
- **Takeaway:** two edges — how far we can see, and how far we can ever reach — and galaxies slip past the second all the time. ESTABLISHED
- **Limit:** standard cosmology (ΛCDM), Planck 2018 values.
- **Handoff:** that's the edge in space. Where are we in the universe's story — and how far into the future can we trace it?
- **Predict: yes.** 46 billion light-years is a genuine surprise. Existing question. **Setup:** as now.

### 2.6 Cosmic timeline — How far into the future can we trace the universe's story?
- **Arrives with:** 13.8 billion years is unimaginably old; surely most of the story is told.
- **Already knows:** space stretches; there are two edges to what we can see and reach.
- **New here:** everything from the Planck-time boundary (10⁻⁴⁴ s), where established descriptions become unreliable, to the last black holes evaporating (≈10¹⁰⁰ years), each event tagged by how sure we are.
- **Do:** step through the events with ◀ ▶, then switch to Ordinary time.
- **Look at:** "you are here" on the powers-of-ten axis; the one-year calendar line.
- **Takeaway:** today sits about 40% across this chart's logarithmic scale. That position depends on the chart's chosen endpoints; it is not a fraction of the universe's lifetime. On an ordinary clock the story has barely begun: squeeze it so far into a year and recorded history is the last 11 seconds of 31 December. ESTABLISHED (the history since the first seconds); the far future is a projection of today's physics; near the Planck boundary, SPECULATIVE.
- **Limit:** published times, not computed here; the far future assumes today's physics holds.
- **Handoff:** → the tour quiz. **Go deeper** (end card): *Where does time's arrow come from?* → the Janus point (a proposal, CONTESTED — a different account from the Entropy box's) · *Why three space dimensions and one time?* → Boot a Universe.
- **Predict: yes.** "We're latecomers" is the common guess; ~40% across the chart is the surprise. Existing question, reworded live (2026-09-26) to say "on that chart" and to start at the Planck time. **Setup:** powers of ten, "Today" selected (as now).

---

## Tour 3 · Is time travel possible?
*For: the question everyone asks first. Into the future, into the past — what physics allows.*

| # | Lab | Arrives with | New here | Handoff |
|---|---|---|---|---|
| 1 | Clock Lab | Can you travel into the future? | Every moving clock does it | How far into Earth's future could a person really go? |
| 2 | The 1 g voyage | How far into the future? | A round trip to the galaxy's centre lands you ~52,000 years on | Why can't you turn round and come back to the same time? |
| 3 | Spacetime · Twin paradox | Why can't you just come back? | Only the traveller turns round; at the reunion they're younger | Forwards is easy. Backwards needs something stranger than speed. Could a black hole bend time enough? |
| 4 | River | Could a black hole be a shortcut? | Inside the horizon, the centre is in your future | A black hole is a trap, not a tunnel. But an idealised, eternal black-hole solution contains a bridge — could you cross that? |
| 5 | Wormholes | Can you cross a wormhole? | The bridge pinches shut before light can cross | Bridges pinch shut. What about a whole universe that loops time back on itself? |
| 6 | Time loops | Could you loop into your own past? | Gödel's rotating universe allows it; ours doesn't rotate | So what's the verdict? |
| 7 | Concept · Time travel | So — is time travel possible? | Forwards: measured. Backwards: allowed in some maths, never seen | → Tour quiz |

### 3.1 Clock Lab — Can you travel into the future?
- **Arrives with:** time travel is science fiction.
- **Already knows:** nothing yet.
- **New here:** every moving clock already travels into the future a little: it runs slow.
- **Do:** push the speed to 0.99 c.
- **Look at:** the ticks — and a years readout (**needs building**, Phase 1): "1 year for the traveller = 7.1 years for you".
- **Takeaway:** moving clocks run slow. A traveller who comes back has aged less, and steps into your future. ESTABLISHED
- **Limit:** one-way view; the come-back part is stop 3.
- **Handoff:** moving clocks run slow. How far into Earth's future could a person really go?
- **Predict: yes, new** — "At 0.99 c, a traveller's clock shows 1 year. How much time passes for you?" · About 1 year · About 7 years · About 100 years → 7 (γ = 7.09). **Setup:** light clock, v = 0.99.

### 3.2 The 1 g voyage — How far into the future?
- **Arrives with:** a few seconds' difference is all you'd ever get.
- **Already knows:** moving clocks run slow.
- **New here:** accelerate steadily and the jump becomes enormous: go to the galaxy's centre and back, and Earth is tens of thousands of years older.
- **Do:** fly to the galaxy's centre; read Earth's clock at arrival, then double it for the return.
- **Look at:** Earth years against crew years.
- **Takeaway:** for a symmetric round trip — 1 g to halfway, 1 g braking, then the same back — about 40 years of crew time; about 52,000 years pass on Earth. A one-way ticket to the future. ESTABLISHED
- **Limit:** constant 1 g; the fuel is the real barrier (shown, not solved).
- **Handoff:** that's a one-way trip forward. Why can't you turn round and come back to the *same* time?
- **Predict: no.** Stop 1 has just primed the same kind of guess; here the visitor reads Earth years against crew years. (Available if wanted: "…straight back, about 40 years by their clocks. How much time has passed on Earth?" → about 52,000.) **Setup:** galactic centre. **Needs:** a "there and back" readout stating the symmetric-journey assumption (Phase 1) before the 52,000 figure appears as a takeaway.

### 3.3 Spacetime · Twin paradox — Why can't you just come back?
- **Arrives with:** motion is relative, so each twin should see the other age less.
- **Already knows:** moving clocks run slow; big trips jump you forward.
- **New here:** only the traveller turns round — and changes frame. Which Earth events count as their 'now' swings at the turn; nothing happens on Earth.
- **Do:** switch to Twin paradox; speed 0.8 c, distance 4 light-years.
- **Look at:** the two clocks at the reunion (the pink swing explains the bookkeeping).
- **Takeaway:** the traveller really is younger — 6 years to Earth's 10 — and nothing about it can be undone by coming back. ESTABLISHED
- **Limit:** an instant turnaround; special relativity.
- **Handoff:** forwards is easy. Backwards needs something stranger than speed. Could a black hole bend time enough?
- **Predict: yes, new** — "One twin flies to a star 4 light-years away at 0.8 c and back. The Earth twin ages 10 years. The traveller ages…" · 10 years · About 6 years · 0 years → 6. **Setup:** scene Twin paradox, v = 0.8, D = 4.

### 3.4 River — Could a black hole be a shortcut?
- **Arrives with:** black holes are tunnels to elsewhere.
- **Already knows:** speed only takes you forward.
- **New here:** inside the horizon the inflow beats light; the centre lies in your future as surely as tomorrow does.
- **Do:** fire light outward from just inside the horizon.
- **Look at:** the flash being swept inward.
- **Takeaway:** a black hole is a trap, not a shortcut: once inside, every path leads to the centre. ESTABLISHED
- **Limit:** non-rotating black hole; spinning ones are stranger (not shown).
- **Handoff:** a black hole is a trap. But an idealised, eternal black-hole solution contains a bridge to somewhere else — could you cross that?
- **Predict: yes, new** (Tour 1 doesn't use the lab's flash question now, but keep them apart) — "You fall through a large black hole's horizon. Can any rocket, however powerful, get you back out?" · Yes, with enough power · No — the centre is in your future · Only if you go faster than light → No. **Setup:** as now.

### 3.5 Wormholes — Can you cross a wormhole?
- **Arrives with:** wormholes are how you'd travel through time.
- **Already knows:** black holes trap you.
- **New here:** the Einstein–Rosen bridge opens and pinches shut faster than light could cross.
- **Do:** fire light inward, then watch the bridge open and close.
- **Look at:** every ray ending at the singularity; the throat shrinking.
- **Takeaway:** the bridge is real mathematics but can't be crossed; one you could cross would need exotic matter with negative energy. ESTABLISHED (the bridge); traversable wormholes: SPECULATIVE.
- **Limit:** the eternal black hole; real black holes formed from stars have no bridge.
- **Handoff:** bridges pinch shut. What about a whole universe that loops time back on itself?
- **Predict: no.** Firing rays and watching the bridge close discovers it better than a guess. **Setup:** as now.

### 3.6 Time loops — Could you loop into your own past?
- **Arrives with:** relativity forbids going back.
- **Already knows:** speed, black holes and wormholes all fail.
- **New here:** in Gödel's rotating universe, circling far enough out — slower than light the whole way — returns you to your own past.
- **Do:** slide past the critical radius and walk the circle.
- **Look at:** the light cone tipping over the circle.
- **Takeaway:** Einstein's equations allow time loops; our universe doesn't rotate measurably, and nobody knows whether nature forbids them. ESTABLISHED (the solution); chronology protection: CONTESTED.
- **Limit:** Gödel's exact solution; it doesn't expand, unlike ours.
- **Handoff:** so what's the verdict?
- **Predict: yes.** "Relativity forbids it" is the strong belief this overturns. Existing question. **Setup:** as now.

### 3.7 Concept · Time travel — So, is time travel possible?
- **Arrives with:** the verdict.
- **Already knows:** everything above.
- **New here:** the paradoxes, and Hawking's party for time travellers.
- **Do:** read.
- **Look at:** the three recipes and what each needs.
- **Takeaway:** forwards: yes, and measured every day. Backwards: allowed by some solutions, never seen, and every recipe needs something our universe lacks. ESTABLISHED / CONTESTED as marked on the page.
- **Limit:** —
- **Handoff:** → the tour quiz.
- **Predict: none.** Reading; the tour quiz follows.

---

## Findings — for Will to decide

**Labs used by more than one tour** (framing matters most here):

| Lab | Tours | Different enough? |
|---|---|---|
| Clock Lab | T1 · 1, T3 · 1 | Yes, once T3 gets its own question (0.99 c) and a years readout |
| River | T1 · 2, T3 · 4 | Yes, once T3 asks "can you get back out?" instead of reusing T1's flash question |
| Spacetime | T1 · 3 (now), T3 · 3 (twins) | Yes — different scenes |
| The 1 g voyage | T2 · 3, T3 · 2 | ⚑ Close. Proposed split: T2 = crew time (how far in a lifetime), T3 = Earth time (how far into the future) |

**Decided by Will (2026-09-26)**
1. **Tour 2's route: option A.** Six stops, ending at the Cosmic timeline; the Janus point and Boot a Universe become "go deeper" links on its end card. Phase 1 needs: Home's tour card to take its stop count from the data (it says "Seven stops" today), and Tour 2's quiz to follow the new stops (it's built from them).
2. **The 1 g voyage split:** Tour 2 asks about crew time (how far in a lifetime); Tour 3 about Earth time (how far into the future).

**⚑ Done in drafts 2–3, or needed in Phase 1**
3. **Tour 1 · 6 asked the wrong question** ("Why only one time direction?" — Two Films is about time *dimensions*). Reworded: "What would two times do?" The live tour text changes when stops go into code (Phase 1).
4. **Tour 1 · 5 → 6 is a change of question, and now says so:** "We've asked why time has a direction. A different puzzle is why it has only one dimension."
5. **Tour 3 · 1 needs a years readout** in Clock Lab ("1 year for them = 7.1 years for you").
6. **Tour 3 · 2's 52,000 years needs a "there and back" readout** that states the symmetric-journey assumption before the figure is used as a takeaway.
7. **Tour 3 predictions** (stops 1, 3, 4) are new, so a Tour 1 guess never answers a Tour 3 question. Storage key: `lab:tour:question`.
8. **Stops 1.7 and 3.7 aren't labs** (Atlas, Concept page): no prediction, no missions; their end card goes straight to the quiz.

**Physics checked:** 1 g round trip to the galactic centre (symmetric): 52,004 Earth years, 39.5 crew years; one way 26,002 and 19.8. γ(0.99 c) = 7.09. Computed from the lab's own formulas.

---

## Review log

**Draft 1 → draft 2 · ChatGPT (SOL), 2026-09-26.** Held scientific and editorial sign-off until resolved. All accepted:
1. *Mars joined two lessons.* Signal delay shows we see Mars's past; it doesn't by itself show observers disagreeing about simultaneity. → 2.2 rewritten (synchronisation is a choice; observers moving differently assign it differently), with Spacetime as the go-deeper link. Also fixed in the live lab's Remember line.
2. *Model results stated as general conclusions.* → Two Films now says "for the equation and complete starting data shown", and calls it a constraint, not a proof. Boot a Universe now says "under the laws we assume … special, not shown necessary". Both fixed in the live Remember lines too.
3. *The two arrow stops give different accounts.* → Noted on 1.5 and 2.6. The Janus takeaway now uses the reviewer's wording: the behaviour is established in the model; whether it explains our arrow remains open.
4. *Vivid phrases.* → Flatland: moving the slice explores the diagram; the block has no moving 'now'. Twins: Earth doesn't jump — the traveller's frame, and so their assignment of 'now', changes; the reunion age difference is central. Both fixed in the live app (Flatland ch. 7 Remember, Spacetime side panel, the diagram's label, the Tour 3 instruction).
5. *Transitions imposed by the route.* → Tour 1's 5 → 6 now names the change of question. Tour 2's route is decision 1 above.
6. *Tour 3's bridge handoff* → "an idealised, eternal black-hole solution contains a bridge". *Round-trip figures* → need the readout or the stated symmetric assumption (6 above).
7. *Predict as a per-stop decision* → every stop now says yes or no, with the reason (read, discover, or guess). Four guesses per tour.

**Draft 3 → draft 4 · ChatGPT (SOL), 2026-09-26.** Signed off: the tour routes and the shared-lab framing. Held final content sign-off for four edits, all made:
1. *Cosmic timeline.* "How long does the universe go on?" has no answer at the chart's last marker, and "40% through" is 40% across a chosen logarithmic chart. → New question: "How far into the future can we trace the universe's story?"; takeaway states that the position depends on the chart's endpoints; the start is "the Planck-time boundary, where established descriptions become unreliable". Also fixed in the live lab (question, explanation, eyebrow, side panel, Remember, quiz question, menu).
2. *Expansion claim too broad.* → "On large scales, distant galaxies show the expansion pattern from any galaxy's viewpoint; no galaxy is its centre" — and nearby groups stay bound. Also fixed in the live Remember line.
3. *Clock Lab's core claim.* "It isn't the clock, it's time" sounded like one clock has an absolute, slower time. → "In your frame, the moving clock records less time…; every kind of clock follows the same rule"; "about" once per two ticks at 0.87 c. Also fixed in the live Remember line.
4. *A direct reading route for stops with a guess.* → Rule R above, and built into the app: every guess card now offers "Read the explanation first" and "Explore freely", with nothing held back.
Also adopted (editorial): Talking to Mars asks "Can we talk to Mars live?", keeping 'now' as its closing surprise.
