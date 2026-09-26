/* Chronoscope — the maths behind each lab (D-057). One entry per lab: the model in a line, its equations with every
   symbol defined, the constants used, what's simplified, where the model breaks, and worked examples. The worked
   examples are also the tests: tools/checks/65-maths.sh puts each lab in the example's setup, reads the lab's own
   state(), and compares it with the value given here — worked out independently, from the equation written on this
   page or from the published figure. So every number on these pages is checked on every commit. */
(function () {
  const $ = s => document.querySelector(s);
  const G = 6.6743e-11, c = 2.99792458e8, hbar = 1.054571817e-34, kB = 1.380649e-23, sigma = 5.670374e-8, Msun = 1.989e30, YR = 3.156e7;
  const gamma = v => 1 / Math.sqrt(1 - v * v);
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const sci = (v, d = 2) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${(v / 10 ** e).toFixed(d)} × 10${String(e).split("").map(ch => SUP[ch]).join("")}`; };

  Chrono.MATHS = {
    clocks: {
      model: "Special relativity for the light clock; the weak-field approximation of general relativity for clocks in circular orbit. Computed live.",
      eqs: [
        ["γ = 1 / √(1 − v²/c²)", "The time-stretch factor. A clock moving at speed v ticks once for every γ ticks of a clock at rest beside you."],
        ["Δt<sub>moving</sub> = Δt<sub>rest</sub> / γ", "Ticks counted on the moving clock during Δt<sub>rest</sub> of yours."],
        ["Δf/f ≈ GM/c² · (1/R − 1/r) − GM/(2rc²)", "An orbiting clock's rate against a clock on the ground: the first term is gravity (higher runs faster), the second is orbital speed v² = GM/r (faster runs slower). Multiplied by 86,400 × 10⁶ for microseconds per day."]
      ],
      consts: [["c", "299,792,458 m/s", "exact, by definition"], ["GM", "3.986004 × 10¹⁴ m³/s²", "Earth's gravitational parameter (IERS)"], ["R", "6,371 km", "Earth's mean radius"]],
      simplified: ["The light clock is ideal: mirrors that don't flex, light that doesn't scatter.", "Orbits are circular; Earth is a non-rotating sphere, so the small effect of the ground clock's own motion is left out."],
      breaks: "Near black holes or neutron stars the weak-field formula fails (use full general relativity — see the River). The light clock itself never breaks: γ applies to every clock.",
      examples: [
        { what: "γ at 0.87 of light speed", setup: { mode: "light", v: 0.87 }, read: s => s.gamma, expect: gamma(0.87), tol: 1e-9, show: v => v.toFixed(3), from: "the formula above" },
        { what: "γ at 0.943 c (a third of the rate)", setup: { mode: "light", v: 0.943 }, read: s => s.gamma, expect: gamma(0.943), tol: 1e-9, show: v => v.toFixed(3), from: "the formula above" },
        { what: "A GPS clock's gain per day", setup: { mode: "gps", alt: 20200 }, read: s => s.net, expect: 38.6, tol: 0.4, show: v => `+${v.toFixed(1)} µs/day`, from: "Ashby (2003): +45.7 from gravity, −7.1 from speed" }
      ],
      sources: "A. Einstein (1905, 1915); N. Ashby, Living Rev. Relativ. 6, 1 (2003)."
    },
    spacetime: {
      model: "Special relativity in one space dimension: Lorentz transformations between inertial observers. Computed live.",
      eqs: [
        ["t′ = γ (t − vx/c²),  x′ = γ (x − vt)", "The Lorentz transformation: when and where an event happens for an observer moving at speed v."],
        ["T<sub>Earth</sub> = 2D / v,  T<sub>traveller</sub> = T<sub>Earth</sub> / γ", "The twin paradox: a round trip to a star D light-years away at speed v (turnaround treated as instant)."],
        ["L = L₀ / γ", "Length contraction: a pole of rest length L₀ moving at speed v is shorter by γ in your frame."]
      ],
      consts: [["c", "1 light-year per year", "units chosen so c = 1"]],
      simplified: ["One space dimension.", "The traveller's turnaround is instant; a real ship would take time to decelerate and return (the 1 g voyage lab does that)."],
      breaks: "Only for flat spacetime: no gravity. With gravity, use general relativity.",
      examples: [
        { what: "Twins: 0.8 c to a star 4 light-years away — difference in ageing", setup: { mode: "twins", twinV: 0.8, twinD: 4 }, read: s => s.twinDiff, expect: 2 * 4 / 0.8 * (1 - 1 / gamma(0.8)), tol: 1e-9, show: v => `${v.toFixed(2)} years`, from: "Earth twin 10 years, traveller 6" },
        { what: "Pole (5) and barn (4): fits in the barn's frame at 0.7 c?", setup: { mode: "barn", pbV: 0.7 }, read: s => s.fits ? 1 : 0, expect: 5 / gamma(0.7) < 4 ? 1 : 0, tol: 0, show: v => v ? "yes" : "no", from: "L = 5/γ = 3.57 < 4" },
        { what: "…and at 0.5 c?", setup: { mode: "barn", pbV: 0.5 }, read: s => s.fits ? 1 : 0, expect: 5 / gamma(0.5) < 4 ? 1 : 0, tol: 0, show: v => v ? "yes" : "no", from: "L = 5/γ = 4.33 > 4" }
      ],
      sources: "H. Minkowski (1908); E. F. Taylor & J. A. Wheeler, Spacetime Physics (1992)."
    },
    expand: {
      model: "A smooth, uniform universe (the Friedmann equations) with matter, radiation and dark energy as a cosmological constant. The expansion is integrated step by step (fourth-order Runge–Kutta). Computed live.",
      eqs: [
        ["H² = H₀² [Ω<sub>r</sub>/a⁴ + Ω<sub>m</sub>/a³ + Ω<sub>k</sub>/a² + Ω<sub>Λ</sub>]", "How fast the universe expands (H) at each size a (a = 1 today). Ω are today's shares of radiation, matter, curvature and dark energy; Ω<sub>k</sub> = 1 − Ω<sub>m</sub> − Ω<sub>Λ</sub> − Ω<sub>r</sub>."],
        ["ä = H₀² [−Ω<sub>r</sub>/a³ − Ω<sub>m</sub>/(2a²) + Ω<sub>Λ</sub> a]", "The acceleration equation the lab integrates: matter and radiation brake, dark energy pushes."],
        ["age = time from a = 0 to a = 1,  in units of 1/H₀ = 977.8/H₀ billion years", "H₀ in km/s per megaparsec."]
      ],
      consts: [["Ω<sub>m</sub>, Ω<sub>Λ</sub>", "0.315, 0.685", "Planck Collaboration (2020)"], ["Ω<sub>r</sub>", "9.1 × 10⁻⁵", "photons + neutrinos"], ["H₀", "67.4 (or 73) km/s/Mpc", "Planck (2020); SH0ES (Riess et al.)"]],
      simplified: ["Perfectly smooth on large scales — galaxies' own motions ignored.", "Dark energy is a constant; other forms would change the future, not the past much."],
      breaks: "Before about 10⁻³⁰ seconds (inflation, if it happened, and quantum gravity). And if the universe's lumpiness matters more than assumed — see Timescape on the Atlas.",
      examples: [
        { what: "Age of our universe (Planck values)", setup: { m: 0.315, l: 0.685, H0: 67.4 }, read: s => s.age, expect: 13.787, tol: 0.05, show: v => `${v.toFixed(2)} billion years`, from: "Planck Collaboration (2020): 13.787 ± 0.020" },
        { what: "The same universe with H₀ = 73", setup: { m: 0.315, l: 0.685, H0: 73 }, read: s => s.age, expect: 13.787 * 67.4 / 73, tol: 0.05, show: v => `${v.toFixed(2)} billion years`, from: "age scales as 1/H₀" },
        { what: "Matter 3, dark energy 0.1: its fate", setup: { m: 3, l: 0.1 }, read: s => /recollapses/.test(s.fate) ? 1 : 0, expect: 1, tol: 0, show: v => v ? "recollapses" : "expands for ever", from: "closed, matter-dominated: gravity wins" }
      ],
      sources: "A. Friedmann (1922); G. Lemaître (1927); Planck Collaboration, A&A 641, A6 (2020); A. Riess et al. (SH0ES)."
    },
    hawking: {
      model: "Hawking's formulas for a non-rotating, uncharged black hole radiating as a black body, photons only. Computed live.",
      eqs: [
        ["T = ħc³ / (8πGMk<sub>B</sub>)", "The black hole's temperature: smaller holes are hotter."],
        ["P = ħc⁶ / (15360 π G² M²)", "Power radiated."],
        ["t<sub>life</sub> = 5120 π G² M³ / (ħ c⁴)", "Time to evaporate completely, from mass M."],
        ["r<sub>s</sub> = 2GM / c²", "Horizon radius."]
      ],
      consts: [["ħ", "1.054571817 × 10⁻³⁴ J·s", "CODATA"], ["G", "6.6743 × 10⁻¹¹ m³ kg⁻¹ s⁻²", "CODATA"], ["k<sub>B</sub>", "1.380649 × 10⁻²³ J/K", "exact"], ["M<sub>☉</sub>", "1.989 × 10³⁰ kg", "the Sun's mass"]],
      simplified: ["Photons only: counting neutrinos and gravitons shortens lifetimes by a factor of a few.", "The hole sits in empty space; today, any black hole heavier than about half the Moon is colder than the microwave background and grows instead."],
      breaks: "In the final instants, when the hole is near the Planck mass, where a theory of quantum gravity is needed.",
      examples: [
        { what: "Temperature of a Sun-mass black hole", setup: { M0: Msun }, read: s => s.T, expect: hbar * c ** 3 / (8 * Math.PI * G * Msun * kB), tol: 1e-12, show: v => `${sci(v)} K`, from: "the formula above — about 60 billionths of a degree" },
        { what: "Lifetime of a Sun-mass black hole", setup: { M0: Msun }, read: s => s.life / 1e67, expect: 5120 * Math.PI * G * G * Msun ** 3 / (hbar * c ** 4) / YR / 1e67, tol: 1e-6, show: v => `${v.toFixed(1)} × 10⁶⁷ years`, from: "the formula above" },
        { what: "Page time, as a share of the lifetime", setup: {}, read: s => s.page, expect: 1 - Math.pow(2, -1.5), tol: 1e-12, show: v => `${(v * 100).toFixed(1)}%`, from: "when the hole has lost half its entropy: 1 − 2<sup>−3/2</sup>" }
      ],
      sources: "S. W. Hawking, Nature 248, 30 (1974); D. N. Page, Phys. Rev. D 13, 198 (1976) and PRL 71, 3743 (1993)."
    },
    energy: {
      model: "A one-layer greenhouse model: Earth absorbs sunlight and radiates as a black body, with one atmospheric layer absorbing a share ε of the outgoing infrared. Computed live.",
      eqs: [
        ["Q = (1 − A) S₀ / 4", "Sunlight absorbed per square metre, averaged over the whole globe (a disc's worth of sunlight spread over a sphere). A is the share reflected."],
        ["T<sub>e</sub> = (Q / σ)<sup>1/4</sup>", "The temperature Earth radiates to space at."],
        ["T<sub>s</sub> = T<sub>e</sub> · (2 / (2 − ε))<sup>1/4</sup>", "The surface temperature under a layer absorbing a share ε of the infrared."]
      ],
      consts: [["S₀", "1361 W/m²", "sunlight at Earth (Kopp & Lean 2011)"], ["σ", "5.670374 × 10⁻⁸ W m⁻² K⁻⁴", "Stefan–Boltzmann, exact"], ["A", "0.30", "Earth's albedo"], ["ε", "0.78", "set so the surface comes out at today's 15 °C"]],
      simplified: ["One layer, one temperature; no weather, oceans or feedbacks.", "ε is tuned to today's average, not calculated."],
      breaks: "For forecasts or feedbacks — ice, clouds, water vapour — which is what full climate models add. This is a teaching model, and says so.",
      examples: [
        { what: "Earth's radiating temperature", setup: { A: 0.3, eps: 0.78 }, read: s => s.Te, expect: 255, tol: 1, show: v => `${v.toFixed(1)} K`, from: "the textbook 255 K" },
        { what: "Surface with no greenhouse", setup: { A: 0.3, eps: 0 }, read: s => s.Tc, expect: -18, tol: 1, show: v => `${v.toFixed(1)} °C`, from: "the textbook −18 °C" },
        { what: "Surface with today's greenhouse", setup: { A: 0.3, eps: 0.78 }, read: s => s.Tc, expect: 15, tol: 0.5, show: v => `${v.toFixed(1)} °C`, from: "today's global average, about 15 °C" }
      ],
      sources: "Kopp & Lean, GRL 38 (2011); any climate textbook (e.g. Pierrehumbert, Principles of Planetary Climate, 2010)."
    }
  };

  /* ---------- the pages: #maths (index) and #maths/<lab> ---------- */
  const title = id => { const d = Chrono.lab.def(id); return d ? d.title : id; };
  function entry(id) {
    const M = Chrono.MATHS[id];
    return `<div class="docwrap maths">
      <p class="meta"><a href="#maths">∑ The maths</a> › ${title(id)} · <a href="#${id}">open the lab →</a></p>
      <h1>${title(id)}: the maths</h1>
      <p>${M.model}</p>
      <h2 class="sect">Equations</h2>
      <dl class="eqs">${M.eqs.map(([e, m]) => `<dt>${e}</dt><dd>${m}</dd>`).join("")}</dl>
      <h2 class="sect">Constants</h2>
      <table class="mt">${M.consts.map(([k, v, s]) => `<tr><td>${k}</td><td>${v}</td><td class="meta">${s}</td></tr>`).join("")}</table>
      <h2 class="sect">Worked examples <span class="chk">✓ checked on every change</span></h2>
      <table class="mt">${M.examples.map(x => `<tr><td>${x.what}</td><td><b>${x.show(x.expect)}</b></td><td class="meta">${x.from}</td></tr>`).join("")}</table>
      <p class="meta">The app's test suite puts the lab in each setup, reads the lab's own result, and fails if it strays from these values.</p>
      <h2 class="sect">What's simplified</h2><ul>${M.simplified.map(s => `<li>${s}</li>`).join("")}</ul>
      <h2 class="sect">Where it breaks</h2><p>${M.breaks}</p>
      <p class="caveat">Sources: ${M.sources}</p>
    </div>`;
  }
  function page() {
    const id = (location.hash.split("/")[1] || "").split("?")[0];
    if (Chrono.MATHS[id]) return entry(id);
    return `<div class="docwrap maths">
      <div class="eyebrow">Under the hood</div>
      <h1>The maths</h1>
      <p>Every lab runs real equations. Here is each one's model: the equations with every symbol defined, the constants and where they come from, what's simplified, where the model stops working, and worked examples.</p>
      <p>The worked examples are also the app's tests. On every change, the test suite sets each lab to the example, reads the lab's own answer, and checks it against the value here — worked out independently, from the equation or from the published figure.</p>
      <div class="deeper">${Object.keys(Chrono.MATHS).map(k => `<a class="dcard" href="#maths/${k}"><b>∑ ${title(k)}</b><span>${Chrono.MATHS[k].model.split(".")[0]}.</span></a>`).join("")}</div>
      <p class="meta">A pilot: five labs so far, one from each kind of physics. The rest follow.</p>
    </div>`;
  }
  Chrono.lab.register({ id: "maths", kind: "doc", title: "The maths", eyebrow: "Under the hood", tier: "none", page,
    aside: () => `<p>For anyone who wants to check the working. Each page gives a lab's model in full; the worked examples are tested against the lab's own code on every change, so the numbers here and the numbers in the lab can't drift apart.</p>
      <p class="meta">Some labs show published data rather than computing it (the element shares, the timeline's dates); their pages will say so and point to the tables.</p>` });
})();
