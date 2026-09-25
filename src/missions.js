/* Chronoscope — missions (D-044, UX spec §8): short, checkable goals that turn a lab's "Try:" hints into
   something you can pass. A mission only watches values the lab already computes, via def.state().
   { id, title, hint, check(s) → true when achieved, near(s) → 0…1 how close, hold (ms it must stay true, so
   dragging through the target doesn't count), reveal, tags, show (a setup for "Show me") }.
   Missions are always optional: nothing is locked behind them, there are no points, and wording describes an
   effect to produce — never "correct" or "fail". Progress is kept in this browser (progress.js). */
(function () {
  const $ = s => document.querySelector(s);
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;

  Chrono.MISSIONS = {
    clocks: [
      { id: "third", title: "Make the moving clock tick a third as fast as yours",
        hint: "Light clock mode: drag the speed up and watch γ. You're after γ = 3 — faster than any tour starts you.",
        check: s => s.mode === "light" && Math.abs(s.gamma - 3) < 0.1,
        near: s => s.mode === "light" ? 1 - Math.min(1, Math.abs(s.gamma - 3) / 2) : 0, hold: 1500,
        reveal: "That's about 0.94 of light speed (exactly √8⁄3 ≈ 0.943). In your frame the moving clock ticks once for every three of yours — and so would any clock riding with it. Watch the tick tapes: three teal pips for every yellow one.",
        tags: ["ESTABLISHED"], show: { mode: "light", v: 0.943 } },
      { id: "cancel", title: "In orbit: find the height where the two effects cancel",
        hint: "Switch to Clocks in orbit (GPS). Low orbits run slow (speed wins); high ones run fast (height wins). Somewhere between, the net is zero. The arrow keys move the altitude slider in 10 km steps.",
        check: s => s.mode === "gps" && s.alt >= 100 && Math.abs(s.net) < 1,
        near: s => s.mode === "gps" && s.alt >= 100 ? 1 - Math.min(1, Math.abs(s.net) / 30) : 0, hold: 1000,
        reveal: "About 3,190 km up — half an Earth radius above the ground. There, running faster in weaker gravity exactly cancels running slower from orbital speed. Below it speed wins (the ISS runs slow); above it height wins (GPS runs fast). In this model, which ignores Earth's spin.",
        tags: ["ESTABLISHED"], show: { mode: "gps", alt: 3190 } }
    ],
    river: [
      { id: "edge-out", title: "Get light out from just outside the horizon — within a fifth of its radius",
        hint: "Click just outside the orange ring, closer than a fifth of its radius, and follow the light aimed outward. Be patient: it crawls at first.",
        check: s => s.escMin < 1.2,
        near: s => s.escMin < 1.2 ? 1 : s.climb ? 0.25 + 0.75 * Math.min(1, s.climb - 1) : 0, hold: 200,
        reveal: "It gets out — slowly at first. Just outside the horizon the inflow is almost light speed, so outward light barely gains ground; as it climbs, the current weakens and it gets away. The closer you start, the longer the crawl.",
        tags: ["ESTABLISHED"], show: { fire: 1.12 } },
      { id: "no-way-out", title: "Find where light can't get out at all",
        hint: "Fire a flash from just inside the orange ring and follow the light aimed straight outward.",
        check: s => s.innerFell, near: s => s.innerFell ? 1 : s.innerLive ? 0.5 : 0, hold: 200,
        reveal: "Inside the horizon the flow outruns light, so even light aimed straight out is carried inward. The horizon isn't a wall — it's where the current reaches light speed, and past it every direction leads in.",
        tags: ["ESTABLISHED"], show: { fire: 0.85 } }
    ],
    spacetime: [
      { id: "flip", title: "Make lamp A flash first for the moving observer",
        hint: "Whose 'now'? scene. For you, A and B flash together; at 0.6 c the mover sees B first. Negative speeds move the other way.",
        check: s => s.mode === "now" && s.simul && s.aFirst,
        near: s => s.mode === "now" ? Math.max(0, Math.min(1, (0.6 - s.v) / 0.7)) : 0, hold: 800,
        reveal: "Moving the other way flips the order. Which lamp flashes first depends on who's asking — possible only because no signal could pass between the two flashes. For events that could cause one another, every observer agrees on the order.",
        tags: ["ESTABLISHED"], show: { mode: "now", v: -0.6 } },
      { id: "twins", title: "Send the travelling twin home at least 10 years younger",
        hint: "Twin paradox scene: raise the speed, or send them further. The Earth twin's extra years grow with both.",
        check: s => s.mode === "twins" && s.twinDiff >= 10,
        near: s => s.mode === "twins" ? Math.min(1, s.twinDiff / 10) : 0, hold: 800,
        reveal: "At 0.95 c to a star 8 light-years away, the Earth twin ages about 16.8 years and the traveller about 5.3 — over 11 years apart, permanently. The traveller is the one who turned round.",
        tags: ["ESTABLISHED"], show: { mode: "twins", twinV: 0.95, twinD: 8 } },
      { id: "fit", title: "Find the slowest speed at which the pole just fits in the barn",
        hint: "Pole and barn scene. At 0.8 c it fits easily; slow the pole down until it only just does.",
        check: s => s.mode === "barn" && s.fits && s.pbV <= 0.62,
        near: s => s.mode === "barn" ? (s.fits ? 1 - Math.min(1, (s.pbV - 0.61) / 0.3) : 0.3) : 0, hold: 800,
        reveal: "Just over 0.6 c. There γ = 1.25, so in the barn's frame the 5-unit pole shrinks to 5 ÷ 1.25 = 4 — exactly the barn's length. Any slower and the doors strike the pole, in every frame.",
        tags: ["ESTABLISHED"], show: { mode: "barn", pbV: 0.61 } }
    ],
    entropy: [
      { id: "spread", title: "Let the gas spread until under 60% of it is in the left half",
        hint: "Remove the partition and wait.", check: s => s.open && s.left < 0.6,
        near: s => s.open ? Math.min(1, (1 - s.left) / 0.4) : 0, hold: 300,
        reveal: "Nobody pushed it: there are vastly more ways for the discs to be spread out than bunched up, so that's where the gas goes.",
        tags: ["ESTABLISHED"], show: { open: true } },
      { id: "undo", title: "Run it backwards: get at least 95% of the discs back into the left half",
        hint: "Once the gas has spread (a few seconds), press Reverse every velocity and wait for it to retrace its steps.",
        check: s => !!s.last && !s.last.nudged && s.last.left >= 0.95, near: s => s.open ? 0.4 : 0, hold: 200,
        reveal: "Every disc, back where it started. The laws of motion run just as well backwards — the arithmetic here is exact, so the reversal is perfect.",
        tags: ["ESTABLISHED"], show: { open: true, reverse: "exact" } },
      { id: "nudge", title: "Now nudge one disc by a millionth of the box, then reverse",
        hint: "Once the gas has spread, press Nudge one disc, then reverse.",
        check: s => !!s.last && s.last.nudged, near: s => s.open ? 0.4 : 0, hold: 200,
        reveal: "The gathering fails: collisions amplify a millionth-of-a-box error until only about half the discs make it back. Real gases are never reversed perfectly — that's the arrow of time at work.",
        tags: ["ESTABLISHED"], show: { open: true, reverse: "nudge" } }
    ],
    voyage: [
      { id: "andromeda", title: "Reach the Andromeda galaxy within a 40-year working life of ship time",
        hint: "Andromeda is 2.5 million light-years away. Pick it and read the ship's clock.",
        check: s => s.dest === "andromeda" && s.tau <= 40, near: s => s.dest === "andromeda" ? 1 : 0.3, hold: 400,
        reveal: "About 29 years of ship time at 1 g — while 2.5 million years pass on Earth. Nothing passes light speed; the crew's clocks just run very slow.",
        tags: ["ESTABLISHED"], show: { dest: "andromeda", gs: 1 } },
      { id: "proxima", title: "Reach Proxima Centauri in under 3 years of ship time",
        hint: "At 1 g it takes about 3.5 ship-years. Push harder.",
        check: s => s.dest === "proxima" && s.tau < 3,
        near: s => s.dest === "proxima" ? Math.max(0, Math.min(1, (4.5 - s.tau) / 1.5)) : 0, hold: 600,
        reveal: "It takes about 1.3 g or more. Pushing 50% harder (1.5 g) trims the trip by only about a fifth, from 3.5 to 2.8 years — and the crew would feel one and a half times their weight the whole way.",
        tags: ["ESTABLISHED"], show: { dest: "proxima", gs: 1.5 } },
      { id: "gentle", title: "Reach Andromeda within 40 ship-years on the gentlest push you can",
        hint: "Pick Andromeda and ease the acceleration down while the ship's clock stays at 40 years or under.",
        check: s => s.dest === "andromeda" && s.tau <= 40 && s.gs <= 0.7,
        near: s => s.dest === "andromeda" && s.tau <= 40 ? Math.max(0, Math.min(1, (1.2 - s.gs) / 0.5)) : 0, hold: 800,
        reveal: "About 0.7 g — 39.9 years of ship time. Ease off to 0.65 g and it's 42.7. The fuel, even for a perfect photon rocket, is the part nobody can supply.",
        tags: ["ESTABLISHED"], show: { dest: "andromeda", gs: 0.7 } }
    ],
    mars: [
      { id: "closest", title: "Find when Mars is closest — the shortest delay",
        hint: "Let the planets run, or press Closest. Watch the one-way delay.",
        check: s => s.near < 0.01, near: s => Math.max(0, 1 - s.near * 1.5), hold: 400,
        reveal: "About 4.4 minutes each way in this model, when Earth passes Mars. (Real orbits are elliptical, so actual closest approaches give about 3 to 6 minutes.)",
        tags: ["ESTABLISHED"], show: { near: true } },
      { id: "reply", title: "Get the rover's answer back in under 10 minutes",
        hint: "Send a message when Mars is near — then wait for the reply to arrive.",
        check: s => s.answered && s.roundTrip < 10, near: s => s.answered ? 0.5 : Math.max(0, 1 - s.near * 1.5) * 0.8, hold: 300,
        reveal: "Only near closest approach does a question and answer take under 10 minutes. At the far side of the Sun it's about three-quarters of an hour — and around conjunction the Sun's glare disrupts the signal, so missions pause commands for about two weeks.",
        tags: ["ESTABLISHED"], show: { near: true, send: true } }
    ]
  };

  let run = null;                                           // { lab, m, held, done }
  const next = id => (Chrono.MISSIONS[id] || []).find(m => !Chrono.progress.missionDone(id, m.id));

  function card(def) {
    const list = Chrono.MISSIONS[def.id]; if (!list || !def.state) { run = null; return ""; }
    const m = next(def.id), k = m ? list.indexOf(m) : list.length;
    if (!m) { run = null; return `<div class="mission done"><div class="eyebrow">Missions</div><p>✓ All ${list.length} done here. <button class="linkish" data-m-reset>Try them again</button></p></div>`; }
    run = { lab: def.id, m, held: 0, done: false };
    return `<div class="mission" id="mission"><div class="eyebrow">Mission · ${k + 1} of ${list.length} · optional</div>
      <p class="m-title">${m.title}</p><div class="m-bar"><i style="width:0%"></i></div><p class="m-status meta">Not there yet.</p>
      <p class="m-hint meta" hidden>${m.hint}</p>
      <div class="m-btns"><button class="linkish" data-m-hint>Hint</button> · <button class="linkish" data-m-show>Show me</button></div></div>`;
  }
  function wire(def) {
    const h = $("#aside [data-m-hint]"); if (h) h.onclick = () => { const p = $("#aside .m-hint"); p.hidden = !p.hidden; };
    const sh = $("#aside [data-m-show]"); if (sh) sh.onclick = () => { if (run && def.applySetup) { def.applySetup(run.m.show); Chrono.lab.rebuild(); } };
    const r = $("#aside [data-m-reset]"); if (r) r.onclick = () => { Chrono.progress.missionReset(def.id); Chrono.lab.rebuild(); };
    const n = $("#aside [data-m-next]"); if (n) n.onclick = () => Chrono.lab.rebuild();
  }
  function tick(def, dt) {                                  // called each frame while the lab is unlocked
    if (!run || run.done || run.lab !== def.id || !def.state) return;
    const el = $("#mission"); if (!el) return;
    const s = def.state(), ok = run.m.check(s);
    run.held = ok ? run.held + dt * 1000 : 0;
    el.querySelector(".m-bar i").style.width = Math.round((ok ? 0.85 + 0.15 * Math.min(1, run.held / run.m.hold) : 0.85 * Math.max(0, run.m.near(s))) * 100) + "%";
    el.querySelector(".m-status").textContent = ok ? "That's it — hold it there…" : run.m.near(s) > 0.8 ? "Very close." : run.m.near(s) > 0.4 ? "Getting closer." : "Not there yet.";
    if (run.held >= run.m.hold) {
      run.done = true; Chrono.progress.setMissionDone(def.id, run.m.id);
      const w = $("#lab-canvas-wrap"); if (w) { w.classList.remove("pulse"); void w.offsetWidth; w.classList.add("pulse"); }
      const more = next(def.id);
      el.classList.add("done");
      el.innerHTML = `<div class="eyebrow">✓ Mission done</div><p class="m-title">${run.m.title}</p><p>${run.m.reveal} ${(run.m.tags || []).map(TG).join(" ")}</p>
        ${more ? `<button class="btn" data-m-next>Next mission →</button>` : `<p class="meta">That's every mission here.</p>`}`;
      wire(def);
    }
  }
  Chrono.missions = { card, wire, tick };
})();
