/* Chronoscope — Voyages: time for people who travel. Mission clocks · Talking to Mars · The 1 g voyage.
   Real equations; each lab states its model. Constants SI unless noted. */
(function () {
  const $ = s => document.querySelector(s);
  const C = Chrono.C, TAU = Math.PI * 2;
  const GM = 3.986004418e14, c = 2.99792458e8, RE = 6.371e6, DAY_US = 86400e6;
  const GM_MOON = 4.9048695e12, R_MOON = 1.7374e6, R_MOON_ORBIT = 3.844e8;

  /* =====================================================================
     MISSION CLOCKS — weak-field relativity: Δrate = ΔΦ/c² − v²/2c² (circular orbits)
     ===================================================================== */
  const rate = r => ({ grav: GM / (c * c) * (1 / RE - 1 / r) * DAY_US, vel: -GM / (2 * r * c * c) * DAY_US });   // µs per day vs a clock on the ground
  const MOON_WELL = -GM_MOON / (R_MOON * c * c) * DAY_US;
  const MISSIONS = [
    { id: "iss", n: "ISS · six months", alt: 408, days: 182.5 },
    { id: "kelly", n: "A Year in Space (ISS, 340 days)", alt: 408, days: 340 },
    { id: "hubble", n: "Hubble telescope · a year", alt: 540, days: 365 },
    { id: "gps", n: "GPS satellite · a year", alt: 20200, days: 365 },
    { id: "geo", n: "Geostationary satellite · a year", alt: 35786, days: 365 },
    { id: "moon", n: "Moon base (Artemis) · a month", alt: 384400 - 6371, days: 30, moon: true }
  ];
  const MC = { m: MISSIONS[0], alt: 408, days: 182.5, moon: false };
  function mcRates() {
    const r = RE + MC.alt * 1000, o = rate(r);
    const well = MC.moon ? MOON_WELL : 0;
    return { ...o, well, net: o.grav + o.vel + well, v: Math.sqrt(GM / r) };
  }
  const fmtT = us => { const a = Math.abs(us); return a < 1000 ? `${a.toFixed(1)} µs` : a < 1e6 ? `${(a / 1000).toFixed(2)} ms` : `${(a / 1e6).toFixed(3)} s`; };
  const altToX = (alt, x0, w) => x0 + (Math.log10(alt) - 2) / (Math.log10(5e5) - 2) * w;

  Chrono.lab.register({
    predict: { q: "An astronaut spends six months on the International Space Station. When they come home, compared with a twin who stayed on the ground, they are…",
      options: ["Younger, by about 5 thousandths of a second", "Older, by about 5 thousandths of a second", "Younger, by about 5 minutes"], answer: 0,
      explain: "Two effects pull opposite ways: higher up, in weaker gravity, clocks run <i>faster</i>; moving fast, they run <i>slower</i>. At the ISS's low, fast orbit, speed wins — about 25 microseconds a day, 4.5 milliseconds over six months. For GPS satellites, higher up, gravity wins. On the Moon, clocks gain about 56 µs a day — which is why a lunar time standard is being set up." },
    id: "missions", title: "Mission clocks", eyebrow: "Voyages · how much younger does space make you?", tier: "mainstream", tags: ["ESTABLISHED"],
    controls() {
      return MISSIONS.map(m => `<button class="btn ${MC.m && MC.m.id === m.id ? "primary" : ""}" data-mission="${m.id}">${m.n.split(" · ")[0].replace(" (ISS, 340 days)", "")}</button>`).join("") +
        `<label class="ctl">Altitude <input type="range" id="mc-alt" min="0" max="1000" value="${Math.round((Math.log10(MC.alt) - 2) / (Math.log10(5e5) - 2) * 1000)}"><output id="mc-alto">${Math.round(MC.alt).toLocaleString()} km</output></label>
        <label class="ctl">Days <input type="range" id="mc-days" min="1" max="1000" value="${MC.days}"><output id="mc-dayso">${MC.days}</output></label>`;
    },
    wire() {
      document.querySelectorAll("[data-mission]").forEach(b => b.onclick = () => { const m = MISSIONS.find(x => x.id === b.dataset.mission); Object.assign(MC, { m, alt: m.alt, days: m.days, moon: !!m.moon }); Chrono.lab.rebuild(); });
      $("#mc-alt").oninput = e => { MC.alt = Math.pow(10, 2 + e.target.value / 1000 * (Math.log10(5e5) - 2)); MC.m = null; MC.moon = false; $("#mc-alto").textContent = Math.round(MC.alt).toLocaleString() + " km"; };
      $("#mc-days").oninput = e => { MC.days = +e.target.value; MC.m = null; $("#mc-dayso").textContent = MC.days; };
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.6), R = mcRates();
      g.panel(A.x, A.y, A.w, A.h, "Clock rate vs a clock on the ground — every altitude");
      const x0 = A.x + 48, w = A.w - 70, y0 = A.y + 44, h = A.h - 96, lo = -35, hi = 65;
      const Y = v => y0 + (hi - v) / (hi - lo) * h;
      for (let v = -30; v <= 60; v += 10) { g.line(x0, Y(v), x0 + w, Y(v), v === 0 ? C.muted : "rgba(255,255,255,0.05)"); g.label(`${v > 0 ? "+" : ""}${v}`, x0 - 6, Y(v) + 4, C.muted, 9, "right"); }
      [100, 1000, 10000, 100000].forEach(a => { const x = altToX(a, x0, w); g.line(x, y0, x, y0 + h, "rgba(255,255,255,0.05)"); g.label(a >= 1000 ? `${a / 1000}k km` : `${a} km`, x, y0 + h + 14, C.muted, 9, "center"); });
      g.label("µs per day", x0 - 40, y0 - 10, C.muted, 9);
      [["grav", C.teal, "gravity (higher → faster)"], ["vel", C.orange, "speed (faster → slower)"], ["net", C.amber, "net"]].forEach(([k, col, name], i) => {
        ctx.strokeStyle = col; ctx.lineWidth = k === "net" ? 2.5 : 1.5; ctx.beginPath();
        for (let j = 0; j <= 200; j++) { const alt = Math.pow(10, 2 + j / 200 * (Math.log10(5e5) - 2)), o = rate(RE + alt * 1000), v = k === "net" ? o.grav + o.vel : o[k], x = altToX(alt, x0, w), y = Y(Math.max(lo, Math.min(hi, v))); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke(); ctx.lineWidth = 1;
        g.label(name, x0 + w - 8, Y(28) + i * 14, col, 10, "right");
      });
      const cx = altToX(3186, x0, w); ctx.setLineDash([3, 4]); g.line(cx, y0, cx, y0 + h, g.alpha(C.amber, 0.5)); ctx.setLineDash([]);
      g.label("effects cancel (~3,190 km)", cx + 4, y0 + 12, C.amber, 9);
      MISSIONS.forEach(m => { const o = rate(RE + m.alt * 1000), v = o.grav + o.vel + (m.moon ? MOON_WELL : 0), x = altToX(m.alt, x0, w); g.dot(x, Y(v), 3.5, C.text); });
      g.label("ISS", altToX(408, x0, w) + 6, Y(-24.6) + 14, C.text, 9); g.label("GPS", altToX(20200, x0, w) - 6, Y(38.5) - 8, C.text, 9, "right");
      g.label("Moon base", altToX(378029, x0, w) - 6, Y(55.9) + 16, C.text, 9, "right");
      const sx = altToX(MC.alt, x0, w), sy = Y(Math.max(lo, Math.min(hi, R.net)));
      ctx.shadowColor = C.pink; ctx.shadowBlur = 12; g.dot(sx, sy, 7, C.pink); ctx.shadowBlur = 0;
      g.label("altitude (log scale) →", x0 + w, y0 + h + 30, C.muted, 9, "right");

      g.panel(B.x, B.y, B.w, B.h, MC.m ? MC.m.n : `Custom · ${Math.round(MC.alt).toLocaleString()} km · ${MC.days} days`);
      const bx = B.x + 14; let y = B.y + 50;
      [["Gravity", R.grav, C.teal], ["Speed", R.vel, C.orange]].concat(MC.moon ? [["Moon's own gravity", R.well, C.violet]] : []).forEach(([n, v, col]) => { g.label(n, bx, y, col, 11); g.label(`${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)} µs/day`, B.x + B.w - 14, y, col, 12, "right"); y += 20; });
      g.line(bx, y - 8, B.x + B.w - 14, y - 8, C.line);
      g.label("Net", bx, y + 4, C.amber, 12); g.label(`${R.net >= 0 ? "+" : "−"}${Math.abs(R.net).toFixed(2)} µs/day`, B.x + B.w - 14, y + 4, C.amber, 13, "right");
      y += 40;
      const tot = R.net * MC.days;
      g.text(`Over ${MC.days} days the clock ${tot >= 0 ? "gains" : "falls behind by"}`, bx, y, C.text, 13);
      y += 28; g.text(fmtT(tot), bx, y, tot >= 0 ? C.teal : C.orange, 26);
      y += 26; g.label(tot >= 0 ? "ahead of the ground — its owner ages slightly more" : "behind the ground — its owner ages slightly less", bx, y, C.muted, 11, "left", "Inter, sans-serif");
      y += 30; g.label(`Light travels ${(Math.abs(tot) * 1e-6 * c / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km in that time.`, bx, y, C.muted, 11, "left", "Inter, sans-serif");
      if (!MC.moon) { y += 16; g.label(`Orbital speed ${(R.v / 1000).toFixed(2)} km/s.`, bx, y, C.muted, 11, "left", "Inter, sans-serif"); }
      g.label("Model: weak-field relativity, circular orbits.", bx, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>Every clock in orbit runs at a slightly different rate from one on the ground. Two effects, pulling in opposite directions:</p>
      <ul class="biglist"><li><b style="color:var(--t-est)">Gravity</b>: higher up, in Earth's weaker gravity, clocks run <b>faster</b> (general relativity).</li>
      <li><b style="color:#ff7a59">Speed</b>: moving clocks run <b>slower</b> (special relativity — the Clock Lab's light clock).</li></ul>
      <div class="try"><b>Try:</b> pick <b>ISS</b>, then <b>GPS</b>. Low and fast, speed wins; high and slower, gravity wins. The dashed line near 3,190 km is where they cancel. Then try <b>Moon base</b>.</div>
      <p><b>A real problem:</b> clocks on the Moon gain about <b>56 microseconds a day</b> over Earth's. For navigation on and around the Moon, that adds up to kilometres of error within days — which is why space agencies are setting up a separate lunar time standard.</p>
      <p><b>Scott Kelly</b> spent 340 days on the ISS (2015–16) while his identical twin Mark stayed on Earth. By this model Scott came home about <b>8 milliseconds</b> younger — real, and far too small to notice.</p>
      <p class="meta">Model assumption: weak-field relativity (rate difference = gravitational potential difference/c² − v²/2c²); circular orbits; the ground clock at sea level; Earth's rotation ignored (a small extra effect). The Moon base adds the Moon's own gravity. <span class="tag ESTABLISHED">Established</span></p>`,
    next: { q: "Clocks disagree by microseconds. Light delay is far bigger: what does 'now' mean for a rover on Mars?", href: "#mars", label: "Talking to Mars" },
    sources: "N. Ashby, 'Relativity in the Global Positioning System', Living Rev. Relativ. 6 (2003); N. Ashby & B. Patla, 'A relativistic framework to establish coordinate time on the Moon and beyond' (2024); NASA Twins Study (2019)."
  });

  /* =====================================================================
     TALKING TO MARS — light delay across the solar system (circular, coplanar orbits)
     ===================================================================== */
  const AU = 1.495978707e11, LT_AU_MIN = AU / c / 60, R_MARS = 1.5237, P_E = 365.256, P_M = 686.98;
  const TM = { day: 250, play: true, msgs: [], clock: 0, speed: 1 };   // clock: minutes since the conversation began
  const ang = day => [TAU * day / P_E, TAU * day / P_M + 0.8];
  const posE = day => { const [a] = ang(day); return [Math.cos(a), Math.sin(a)]; };
  const posM = day => { const [, b] = ang(day); return [R_MARS * Math.cos(b), R_MARS * Math.sin(b)]; };
  const distAU = day => { const e = posE(day), m = posM(day); return Math.hypot(m[0] - e[0], m[1] - e[1]); };
  function conj(day) {                                   // angle at Earth between the Sun and Mars
    const e = posE(day), m = posM(day), s = [-e[0], -e[1]], d = [m[0] - e[0], m[1] - e[1]];
    return Math.acos((s[0] * d[0] + s[1] * d[1]) / (Math.hypot(...s) * Math.hypot(...d))) * 180 / Math.PI;
  }
  function send() {
    const oneWay = distAU(TM.day) * LT_AU_MIN;
    TM.play = false; TM.clock = 0; TM.oneWay = oneWay;
    TM.msgs = [{ from: "E", t0: 0, t1: oneWay, text: "Earth: \"Rover, report status.\"" }, { from: "M", t0: oneWay, t1: 2 * oneWay, text: "Rover: \"All well. Wheels turning.\"" }];
  }

  Chrono.lab.register({
    predict: { q: "Mars is at its farthest from Earth, on the far side of the Sun. You radio a rover a question. How long until you hear its answer?",
      options: ["About 40 seconds", "About 40 minutes", "About 4 hours"], answer: 1,
      explain: "Radio travels at light speed: about 21 minutes each way at Mars's farthest, so a question-and-answer takes about three-quarters of an hour. At its closest, about 7 minutes. (And right behind the Sun, the Sun's glare blocks the signal: missions pause commands for about two weeks.)" },
    id: "mars", title: "Talking to Mars", eyebrow: "Voyages · what does 'now' mean across space?", tier: "mainstream", tags: ["ESTABLISHED"],
    controls() {
      return `<button class="btn primary" id="tm-send">Send a message to the rover</button>
        <button class="btn" id="tm-play">${TM.play ? "Pause the planets" : "Move the planets"}</button>
        <button class="btn" id="tm-near">Closest</button><button class="btn" id="tm-far">Farthest</button>`;
    },
    wire() {
      $("#tm-send").onclick = () => { send(); Chrono.lab.rebuild(); };
      $("#tm-play").onclick = () => { TM.play = !TM.play; TM.msgs = []; Chrono.lab.rebuild(); };
      const seek = best => { let bd = best ? 1e9 : -1, bt = TM.day; for (let d = TM.day; d < TM.day + 800; d += 0.5) { const q = distAU(d); if (best ? q < bd : q > bd) { bd = q; bt = d; } } TM.day = bt; TM.play = false; TM.msgs = []; Chrono.lab.rebuild(); };
      $("#tm-near").onclick = () => seek(true); $("#tm-far").onclick = () => seek(false);
    },
    tick(dt) {
      if (TM.play) TM.day += dt * 25;
      if (TM.msgs.length) { TM.clock += dt * Math.max(2, TM.oneWay / 5); if (TM.clock > 2 * TM.oneWay + 6) TM.clock = 2 * TM.oneWay + 6; }
    },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.58), dAU = distAU(TM.day), oneWay = dAU * LT_AU_MIN, cj = conj(TM.day);
      g.panel(A.x, A.y, A.w, A.h, "The inner solar system from above (orbits to scale)");
      const cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 10, s = Math.min(A.w, A.h - 40) / 2 / 1.75;
      g.ring(cx, cy, s, g.alpha(C.accent, 0.25), 1, [3, 5]); g.ring(cx, cy, s * R_MARS, g.alpha(C.orange, 0.25), 1, [3, 5]);
      ctx.shadowColor = C.amber; ctx.shadowBlur = 24; g.dot(cx, cy, 9, C.amber); ctx.shadowBlur = 0;
      const e = posE(TM.day), m = posM(TM.day), E = [cx + e[0] * s, cy - e[1] * s], M = [cx + m[0] * s, cy - m[1] * s];
      g.line(E[0], E[1], M[0], M[1], cj < 3 ? g.alpha(C.pink, 0.5) : "rgba(255,255,255,0.12)", 1);
      g.dot(...E, 6, C.accent); g.label("Earth", E[0] + 9, E[1] + 4, C.accent, 11);
      g.dot(...M, 5, C.orange); g.label("Mars", M[0] + 9, M[1] + 4, C.orange, 11);
      TM.msgs.forEach(q => { if (TM.clock < q.t0 || TM.clock > q.t1) return; const f = (TM.clock - q.t0) / (q.t1 - q.t0), [a, b] = q.from === "E" ? [E, M] : [M, E];
        ctx.shadowColor = C.teal; ctx.shadowBlur = 12; g.dot(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 4, C.teal); ctx.shadowBlur = 0; });
      g.text(`Earth–Mars: ${(dAU * AU / 1e9).toFixed(0)} million km · light takes ${oneWay.toFixed(1)} minutes`, A.x + 14, A.y + A.h - 16, C.text, 12);
      if (cj < 3) g.text("The Sun is almost in line: solar conjunction — radio contact pauses for about two weeks.", A.x + 14, A.y + A.h - 34, C.pink, 12);

      g.panel(B.x, B.y, B.w, B.h, "The conversation, as a spacetime diagram");
      const px = B.x + 50, pw = B.w - 80, py = B.y + 40, ph = Math.max(60, B.h - 130), T = TM.msgs.length ? 2 * TM.oneWay : 2 * oneWay;
      const P = (x, t) => [px + x * pw, py + t / (T * 1.08) * ph];   // x: 0 = Earth, 1 = Mars; time runs downwards
      g.line(...P(0, 0), ...P(0, T * 1.08), C.accent, 2); g.line(...P(1, 0), ...P(1, T * 1.08), C.orange, 2);
      g.label("EARTH", ...P(0, 0).map((v, i) => v + (i ? -8 : 0)), C.accent, 10, "center"); g.label("MARS", ...P(1, 0).map((v, i) => v + (i ? -8 : 0)), C.orange, 10, "center");
      g.label("time ↓", px - 44, py + 10, C.muted, 9);
      for (let t = 0; t <= T * 1.05; t += T > 30 ? 10 : 5) { const [x, y] = P(0, t); g.label(`${t} min`, x - 6, y + 3, C.muted, 9, "right"); }
      TM.msgs.forEach(q => { const t = Math.min(TM.clock, q.t1); if (t < q.t0) return; const f = (t - q.t0) / (q.t1 - q.t0), a = q.from === "E" ? 0 : 1;
        g.line(...P(a, q.t0), ...P(a + (1 - 2 * a) * f, t), C.teal, 2); });
      if (TM.msgs.length) {
        const [, ny] = P(0, TM.clock); ctx.setLineDash([4, 4]); g.line(px, ny, px + pw, ny, g.alpha(C.accent, 0.6)); ctx.setLineDash([]);
        g.label("mission control's 'now'", px + pw, ny - 4, C.accent, 9, "right");
        let ly = py + ph + 22;
        g.label(`Clock: ${TM.clock.toFixed(1)} min`, B.x + 14, ly, C.text, 12); ly += 18;
        TM.msgs.forEach(q => { const state = TM.clock >= q.t1 ? `arrived at ${q.t1.toFixed(1)} min` : TM.clock >= q.t0 ? "in flight…" : "waiting…"; g.label(`${q.text} — ${state}`, B.x + 14, ly, C.muted, 10, "left", "Inter, sans-serif"); ly += 15; });
      } else g.label("Press 'Send a message' to talk to the rover.", B.x + 14, py + ph + 24, C.muted, 11, "left", "Inter, sans-serif");
    },
    aside: () => `
      <p>Radio travels at the speed of light — fast, but the solar system is big. Everything you hear from Mars is <b>minutes old</b>, and anything you send arrives minutes late.</p>
      <div class="try"><b>Try:</b> press <b>Closest</b>, then <b>Send a message</b>. Then <b>Farthest</b>, and send again. Watch the message cross the diagram on the right: each leg is a light ray.</div>
      <p><b>No joysticks on Mars.</b> A rover can't be steered live: by the time you see a rock in its camera, the rover has been sitting in front of it for up to 20 minutes. Rovers drive themselves, following plans sent a day ahead.</p>
      <p><b>What is 'now' on Mars?</b> Mission control's 'now' (the dashed line) can't include anything happening on Mars right now — no signal could have arrived yet. This is the Spacetime lab's lesson made practical: events that far apart have no single shared 'now'.</p>
      <p class="meta">For comparison: the Moon is 1.3 light-seconds away, the Sun 8.3 light-minutes, and Voyager 1 about 23 light-hours (2026).</p>
      <p class="meta">Model assumption: circular, flat orbits for Earth and Mars (Mars's real orbit is elliptical, so real closest approaches vary: about 3 to 22 minutes one way). Light speed exact. <span class="tag ESTABLISHED">Established</span></p>`,
    next: { q: "Light is the speed limit. So how far could a crew get in a lifetime?", href: "#voyage", label: "The 1 g voyage" },
    sources: "Speed of light (SI definition); NASA Mars mission communications (solar conjunction); planetary orbital data (JPL)."
  });

  /* =====================================================================
     THE 1 g VOYAGE — relativistic rocket: accelerate at g for half the trip, decelerate for the rest
     Proper time τ = (2/g)·acosh(1 + gD/2); Earth time t = (2/g)·sinh(gτ/2)  (units: years, light-years, c = 1)
     ===================================================================== */
  const G1 = 9.80665 * (365.25 * 86400) ** 2 / 9.4607304725808e15;   // 1 g in light-years per year² (≈ 1.032)
  const DEST = [
    { id: "mars", n: "Mars", d: 225e9 / 9.4607304725808e15, note: "average distance" },
    { id: "proxima", n: "Proxima Centauri", d: 4.24, note: "nearest star" },
    { id: "trappist", n: "TRAPPIST-1", d: 40.7, note: "seven Earth-sized planets" },
    { id: "pleiades", n: "The Pleiades", d: 444, note: "star cluster" },
    { id: "gc", n: "Centre of the galaxy", d: 26000, note: "" },
    { id: "andromeda", n: "Andromeda galaxy", d: 2.5e6, note: "nearest big galaxy" }
  ];
  const VY = { dest: DEST[1], gs: 1, p: 0, play: true, newton: false };
  /* Newton's version of the same trip — no speed limit, one time for everyone. Shown only for comparison. */
  function newtonTrip(g, D) {
    const th = Math.sqrt(D / g), T = 2 * th;
    return { T, vmax: g * th, x: t => t <= th ? g * t * t / 2 : D - g * (T - t) ** 2 / 2 };
  }
  function trip() {
    const g = VY.gs * G1, D = VY.dest.d, tau = 2 / g * Math.acosh(1 + g * D / 2), T = 2 / g * Math.sinh(g * tau / 2);
    const at = s => {   // state after a fraction s of the ship's own time
      const tt = s * tau, h = tau / 2;
      if (tt <= h) { const w = g * tt; return { tau: tt, t: Math.sinh(w) / g, x: (Math.cosh(w) - 1) / g, v: Math.tanh(w) }; }
      const w = g * (tau - tt); return { tau: tt, t: T - Math.sinh(w) / g, x: D - (Math.cosh(w) - 1) / g, v: Math.tanh(w) };
    };
    return { g, D, tau, T, at, vmax: Math.tanh(g * tau / 2), gmax: 1 + g * D / 2, fuel: Math.exp(g * tau) };
  }
  const fmtYears = y => y < 1 / 365.25 ? `${(y * 365.25 * 24).toFixed(1)} hours` : y < 0.25 ? `${(y * 365.25).toFixed(1)} days` : y < 1e4 ? `${y.toFixed(y < 10 ? 2 : 1)} years` : `${Math.round(y).toLocaleString()} years`;
  const fmtBig = x => x < 1e4 ? x.toFixed(x < 10 ? 1 : 0) : `${(x / 10 ** Math.floor(Math.log10(x))).toFixed(1)} × 10^${Math.floor(Math.log10(x))}`;
  const fmtV = v => { if (v < 0.999) return v.toFixed(3) + " c"; const nines = Math.floor(-Math.log10(1 - v)); return `0.${"9".repeat(Math.min(nines, 12))}… c`; };

  Chrono.lab.register({
    predict: { q: "A ship accelerates at a steady 1 g — the push of Earth's gravity — then turns and brakes at 1 g. How long does the crew, by their own clocks, take to reach the centre of our galaxy, 26,000 light-years away?",
      options: ["About 26,000 years", "About 20 years", "It can't be done — nothing gets that far that fast"], answer: 1,
      explain: "About 20 years by the crew's clocks. Nothing passes light speed, but the ship's clocks slow more and more as it approaches it (the twin paradox again), so a ship accelerating steadily can cross huge distances within a crew's lifetime. On Earth, 26,000 years pass. The catch is fuel: even a perfect matter–antimatter rocket would need about 700 million tonnes of fuel for each tonne of ship." },
    id: "voyage", title: "The 1 g voyage", eyebrow: "Voyages · how far in a lifetime?", tier: "mainstream", tags: ["ESTABLISHED", "SPECULATIVE"],
    controls() {
      return DEST.map(d => `<button class="btn ${VY.dest.id === d.id ? "primary" : ""}" data-dest="${d.id}">${d.n}</button>`).join("") +
        `<label class="ctl">Acceleration <input type="range" id="vy-g" min="10" max="300" value="${Math.round(VY.gs * 100)}"><output id="vy-go">${VY.gs.toFixed(1)} g</output></label>
        <button class="btn" id="vy-play">${VY.play ? "Pause" : "Fly"}</button>
        <label class="ctl"><input type="checkbox" id="vy-newton" ${VY.newton ? "checked" : ""}> Compare with Newton</label>`;
    },
    wire() {
      document.querySelectorAll("[data-dest]").forEach(b => b.onclick = () => { VY.dest = DEST.find(d => d.id === b.dataset.dest); VY.p = 0; VY.play = true; Chrono.lab.rebuild(); });
      $("#vy-g").oninput = e => { VY.gs = e.target.value / 100; $("#vy-go").textContent = VY.gs.toFixed(1) + " g"; VY.p = 0; };
      $("#vy-play").onclick = () => { VY.play = !VY.play; if (VY.play && VY.p >= 1) VY.p = 0; Chrono.lab.rebuild(); };
      $("#vy-newton").onchange = e => { VY.newton = e.target.checked; };
    },
    tick(dt) { if (VY.play) { VY.p = Math.min(1, VY.p + dt / 9); if (VY.p >= 1) VY.play = false; } },
    draw(g) {
      const { ctx } = g, { A, B } = g.split(0.55), tr = trip(), now = tr.at(VY.p);
      g.panel(A.x, A.y, A.w, A.h, "The voyage in spacetime (Earth's view)");
      const px = A.x + 56, pw = A.w - 90, py = A.y + 40, ph = A.h - 90, sx = pw / tr.D, st = ph / tr.T, sc = Math.min(sx, st);
      const P = (x, t) => [px + x * sx, py + ph - t * st];
      g.line(...P(0, 0), ...P(0, tr.T), C.accent, 2); g.label("Earth", ...P(0, tr.T).map((v, i) => v + (i ? -6 : 0)), C.accent, 10, "center");
      g.line(...P(tr.D, 0), ...P(tr.D, tr.T), g.alpha(C.orange, 0.4), 1); g.label(VY.dest.n, ...P(tr.D, tr.T).map((v, i) => v + (i ? -6 : 0)), C.orange, 10, "right");
      const lx = Math.min(tr.D, tr.T); ctx.setLineDash([3, 5]); g.line(...P(0, 0), ...P(lx, lx), g.alpha(C.amber, 0.6)); ctx.setLineDash([]);
      g.label("light", ...P(lx * 0.5, lx * 0.5).map((v, i) => v + (i ? -6 : 8)), C.amber, 9);
      ctx.strokeStyle = C.pink; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 160; i++) { const q = tr.at(i / 160), [x, y] = P(q.x, q.t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.lineWidth = 1;
      const NT = newtonTrip(tr.g, tr.D);
      if (VY.newton) {
        ctx.strokeStyle = g.alpha(C.violet, 0.9); ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 160; i++) { const t = i / 160 * NT.T, [x, y] = P(NT.x(t), t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
        const [nx, ny] = P(tr.D, NT.T); g.label("Newton's ship", nx - 6, ny - 6, C.violet, 10, "right");
      }
      const [ssx, ssy] = P(now.x, now.t); ctx.shadowColor = C.pink; ctx.shadowBlur = 12; g.dot(ssx, ssy, 6, C.pink); ctx.shadowBlur = 0;
      g.label("distance →", px + pw, py + ph + 18, C.muted, 9, "right"); g.label("Earth time ↑", px - 50, py + ph / 2, C.muted, 9);
      if (A.w > 560) g.label(`scales differ: distance ${fmtYears(tr.D).replace("years", "light-years").replace("days", "light-days").replace("hours", "light-hours")} across, Earth time ${fmtYears(tr.T)} up`, A.x + 14, A.y + A.h - 12, C.muted, 9);

      g.panel(B.x, B.y, B.w, B.h, `To ${VY.dest.n}${VY.dest.note ? " (" + VY.dest.note + ")" : ""} at ${VY.gs.toFixed(1)} g`);
      const bx = B.x + 14; let y = B.y + 52;
      g.label("SHIP'S CLOCK", bx, y, C.pink, 10); g.label("EARTH'S CLOCK", bx + (B.w - 28) / 2, y, C.accent, 10);
      y += 26; g.text(fmtYears(now.tau), bx, y, C.pink, 20); g.text(fmtYears(now.t), bx + (B.w - 28) / 2, y, C.accent, 20);
      y += 20; g.label(`of ${fmtYears(tr.tau)}`, bx, y, C.muted, 10); g.label(`of ${fmtYears(tr.T)}`, bx + (B.w - 28) / 2, y, C.muted, 10);
      y += 30; g.label("SPEED NOW", bx, y, C.muted, 10); g.bar(bx, y + 6, B.w - 28, 6, now.v, C.amber);
      y += 28; g.text(fmtV(now.v), bx, y, C.text, 14); g.label(`top speed ${fmtV(tr.vmax)} · clocks slowed up to ${fmtBig(tr.gmax)}×`, bx, y + 18, C.muted, 10);
      y += 48; g.label("FUEL, EVEN FOR A PERFECT PHOTON ROCKET", bx, y, C.muted, 10);
      y += 20; g.text(`${fmtBig(tr.fuel - 1)} tonnes per tonne of ship`, bx, y, C.orange, 13);
      y += 26; g.label(`At Voyager 1's speed (17 km/s): ${fmtYears(tr.D / (17e3 / c))}.`, bx, y, C.muted, 11, "left", "Inter, sans-serif");
      if (VY.newton) {
        y += 30; g.label("NEWTON'S PHYSICS (WRONG NEAR LIGHT SPEED)", bx, y, C.violet, 10);
        y += 18; y += g.wrap(`Top speed ${NT.vmax.toFixed(2)} c${NT.vmax > 1 ? " — faster than light, which never happens" : ""}. Trip ${fmtYears(NT.T)}, the same on every clock.`, bx, y, B.w - 28, 16, C.text, 12);
      }
      g.label("Model: special relativity, constant proper acceleration.", bx, B.y + B.h - 14, C.muted, 10);
    },
    aside: () => `
      <p>Nothing can pass the speed of light. But a ship that keeps accelerating gets its clocks slowed more and more — so, <b>by the crew's own clocks</b>, the distances that can be crossed in a lifetime are astonishing.</p>
      <p>This ship accelerates at a steady 1 g (it would feel like standing on Earth) for the first half of the trip, then turns round and brakes at 1 g for the second half, arriving at rest.</p>
      <div class="try"><b>Try:</b> <b>Proxima Centauri</b> — 3.5 years for the crew, 5.9 on Earth. Then <b>Centre of the galaxy</b> and <b>Andromeda</b>. Watch the ship's clock and Earth's clock pull apart.</div>
      <p>The pink curve is the ship's path through spacetime: it bends toward the light line but never crosses it — the twin paradox, stretched to its limit. It's exactly the Spacetime lab's physics.</p>
      <p><b>What's real and what isn't.</b> The clock effects are <span class="tag ESTABLISHED">Established</span> physics. The ship is <span class="tag SPECULATIVE">Speculative</span>: nobody knows how to build it. Even a perfect rocket that turned fuel entirely into light would need the fuel shown — for the galaxy's centre, about 700 million tonnes for each tonne of ship.</p>
      <p><b>Compare with Newton:</b> tick the box to fly the same trip with Newton's laws. His ship just keeps speeding up — to Proxima it would top out at about twice the speed of light — and every clock agrees. Newton's mechanics is superb at everyday speeds and <span class="tag RULEDOUT">Ruled out</span> near light speed: particle accelerators push particles ever closer to c but never past it.</p>
      <p class="meta">Model assumption: special relativity (flat spacetime), constant proper acceleration, instant turnaround at the midpoint, no gravity or interstellar dust. Fuel: the ideal photon-rocket equation, mass ratio = e^(gτ).</p>`,
    next: { q: "We've crossed the galaxy. Now zoom out to the universe as a whole: is everything flying away from us?", href: "#expand", label: "Cosmos · Expanding universe" },
    sources: "Relativistic rocket: e.g. C. Misner, K. Thorne & J. Wheeler, Gravitation (1973), §6; J. Ackeret (1946) photon-rocket equation. Destination distances: standard catalogues."
  });
})();
