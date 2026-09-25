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
      { id: "half", title: "Make the moving clock tick half as fast as yours",
        hint: "Light clock mode: drag the speed up and watch γ. You're after γ = 2.",
        check: s => s.mode === "light" && Math.abs(s.gamma - 2) < 0.05,
        near: s => s.mode === "light" ? 1 - Math.min(1, Math.abs(s.gamma - 2)) : 0, hold: 1500,
        reveal: "That's about 0.87 of light speed (exactly √3⁄2 ≈ 0.866). In your frame the moving clock ticks once for every two of yours — and so would any clock riding with it.",
        tags: ["ESTABLISHED"], show: { mode: "light", v: 0.866 } },
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
