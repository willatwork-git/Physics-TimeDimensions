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

  /* independent re-derivations used by the worked examples below */
  const OR = 9.1e-5, OM = 0.315, OL = 0.685, OK = 1 - OM - OL - OR, TH = 977.8 / 67.4;   // Planck 2018, H₀ = 67.4: 1/H₀ in billions of years
  const simpson = (f, a, b, n = 4000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const particleGly = TH * simpson(a => 1 / Math.sqrt(OR + OM * a + OK * a * a + OL * a ** 4), 0, 1);            // ∫₀¹ da / (a² E)
  const eventGly = TH * simpson(u => 1 / Math.sqrt(OR * u ** 4 + OM * u ** 3 + OK * u * u + OL), 0, 1);          // ∫₁^∞ da / (a² E), a = 1/u
  const bisect = (f, lo, hi) => { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; f(lo) * f(m) <= 0 ? hi = m : lo = m; } return (lo + hi) / 2; };
  const md = z => Math.pow(1 + z, 2.7) / (1 + Math.pow((1 + z) / 2.9, 5.6));     // Madau & Dickinson (2014) star-formation fit
  const ageAt = z => TH * simpson(a => 1 / Math.sqrt(OR / (a * a) + OM / a + OK + OL * a * a), 1e-9, 1 / (1 + z));   // t(z) = ∫ da / (a E)
  const zPeak = (() => { let best = 0, zb = 0; for (let z = 0; z < 8; z += 0.001) { const v = md(z); if (v > best) { best = v; zb = z; } } return zb; })();
  const lnFact = n => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };

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
    },
    missions: {
      model: "The weak-field approximation of general relativity for clocks in circular orbit (the Moon base adds the Moon's own gravity). Computed live.",
      eqs: [
        ["Δf/f ≈ GM/c² · (1/R − 1/r) − GM/(2rc²)", "Rate against a ground clock: gravity (higher is faster) minus orbital speed (faster is slower); × 86,400 × 10⁶ for µs per day."],
        ["Δt = Δf/f × days", "What the clock gains or loses over the mission."]
      ],
      consts: [["GM", "3.986004418 × 10¹⁴ m³/s²", "Earth (IERS)"], ["R", "6,371 km", "Earth's mean radius"], ["c", "299,792,458 m/s", "exact"]],
      simplified: ["Circular orbits; Earth doesn't rotate in the model, so the ground clock's own small motion is ignored.", "The Moon base uses the Moon's surface gravity plus its orbit around Earth."],
      breaks: "Near very strong gravity (neutron stars, black holes), where the weak-field formula stops being accurate.",
      examples: [
        { what: "ISS (408 km): rate per day", setup: { alt: 408, days: 182.5 }, read: s => s.net, expect: (() => { const GM = 3.986004418e14, R = 6.371e6, r = R + 408e3, c2 = 299792458 ** 2; return (GM / c2 * (1 / R - 1 / r) - GM / (2 * r * c2)) * 86400e6; })(), tol: 1e-6, show: v => `${v.toFixed(1)} µs/day`, from: "the formula above: speed wins" },
        { what: "GPS (20,200 km): rate per day", setup: { alt: 20200, days: 365 }, read: s => s.net, expect: 38.6, tol: 0.4, show: v => `+${v.toFixed(1)} µs/day`, from: "Ashby (2003)" },
        { what: "Six months on the ISS: total", setup: { alt: 408, days: 182.5 }, read: s => s.total / 1000, expect: (() => { const GM = 3.986004418e14, R = 6.371e6, r = R + 408e3, c2 = 299792458 ** 2; return (GM / c2 * (1 / R - 1 / r) - GM / (2 * r * c2)) * 86400e6 * 182.5 / 1000; })(), tol: 1e-6, show: v => `${v.toFixed(2)} ms`, from: "about 4.5 thousandths of a second younger" }
      ],
      sources: "N. Ashby, Living Rev. Relativ. 6, 1 (2003); IERS Conventions (2010)."
    },
    mars: {
      model: "Earth and Mars on circular orbits around the Sun; radio travels at light speed. Computed live.",
      eqs: [
        ["d(t) = |r<sub>M</sub>(t) − r<sub>E</sub>(t)|", "Distance between the planets, each moving round its circle (periods 365.256 and 686.98 days)."],
        ["delay = d / c", "One-way light time. A question and its answer take twice that."]
      ],
      consts: [["AU", "1.495978707 × 10¹¹ m", "exact, by definition"], ["Mars's orbit", "1.5237 AU", "mean radius"], ["c", "299,792,458 m/s", "exact"]],
      simplified: ["Circular orbits: Mars's real orbit is noticeably elliptical, so real delays range from about 3 to 22 minutes.", "Near conjunction the Sun's glare disrupts the signal; the model shows the geometry only."],
      breaks: "It doesn't — for the geometry. Only the orbits' shapes are simplified.",
      examples: [
        { what: "One-way delay at closest approach", setup: { near: true }, read: s => s.oneWay, expect: (1.5237 - 1) * 1.495978707e11 / 299792458 / 60, tol: 0.05, show: v => `${v.toFixed(2)} min`, from: "(1.5237 − 1) AU ÷ c" },
        { what: "One-way delay at farthest", setup: { far: true }, read: s => s.oneWay, expect: (1.5237 + 1) * 1.495978707e11 / 299792458 / 60, tol: 0.05, show: v => `${v.toFixed(2)} min`, from: "(1.5237 + 1) AU ÷ c" }
      ],
      sources: "NASA/JPL planetary fact sheets; IAU (2012) definition of the astronomical unit."
    },
    voyage: {
      model: "Special relativity for a ship with constant proper acceleration (what the crew feels), accelerating to halfway and braking the rest. Computed live.",
      eqs: [
        ["τ = (2c/g) · arcosh(1 + gD / 2c²)", "Time on the ship's clock for a trip of distance D."],
        ["T = (2c/g) · sinh(gτ / 2c)", "Time on Earth's clock for the same trip."],
        ["v<sub>max</sub> = c · tanh(gτ / 2c)", "Top speed, at the halfway point."]
      ],
      consts: [["g", "9.80665 m/s² ≈ 1.032 light-years per year²", "standard gravity"], ["light-year", "9.4607304725808 × 10¹⁵ m", "exact"]],
      simplified: ["No fuel limit: the ship is a perfect photon rocket (the fuel ratio shows what that would still cost).", "No dust, radiation or time to turn round."],
      breaks: "Never, for the kinematics — this is exact special relativity. Only the engineering is imaginary.",
      examples: [
        { what: "Proxima Centauri (4.24 ly) at 1 g: the crew's time", setup: { dest: "proxima", gs: 1 }, read: s => s.tau, expect: (() => { const g = 9.80665 * (365.25 * 86400) ** 2 / 9.4607304725808e15; return 2 / g * Math.acosh(1 + g * 4.24 / 2); })(), tol: 1e-9, show: v => `${v.toFixed(2)} years`, from: "the formula above" },
        { what: "…and Earth's time", setup: { dest: "proxima", gs: 1 }, read: s => s.T, expect: 5.9, tol: 0.05, show: v => `${v.toFixed(2)} years`, from: "the commonly quoted 5.9 years" },
        { what: "Centre of the galaxy (26,000 ly): the crew's time", setup: { dest: "gc", gs: 1 }, read: s => s.tau, expect: (() => { const g = 9.80665 * (365.25 * 86400) ** 2 / 9.4607304725808e15; return 2 / g * Math.acosh(1 + g * 26000 / 2); })(), tol: 1e-9, show: v => `${v.toFixed(1)} years`, from: "the formula above" }
      ],
      sources: "C. Misner, K. Thorne & J. Wheeler, Gravitation (1973), §6; J. Baez, 'The Relativistic Rocket' (Usenet Physics FAQ)."
    },
    field: {
      model: "The Klein–Gordon equation (a relativistic field) on a lattice of points, integrated step by step. The lower field has mass m; the upper is massless. Computed live.",
      eqs: [
        ["∂²φ/∂t² = ∂²φ/∂x² − m²φ", "The field equation: waves on a field whose 'mass' resists being moved."],
        ["ω² = 4 sin²(k/2) + m²", "How fast a ripple of wavenumber k oscillates on the lattice (in the continuum, ω² = k² + m²)."],
        ["v<sub>group</sub> = dω/dk = sin k / ω", "How fast the ripple travels. For m = 0 it's the speed of light (almost exactly, at this k); for m > 0 it's slower."]
      ],
      consts: [["k", "0.25 per lattice step", "the travelling ripple's wavenumber"], ["c", "1 lattice step per time step", "units"]],
      simplified: ["One space dimension; a classical field (no quantum particles), which is how the wave side of a particle behaves.", "Mass is a slider: in nature it comes from the Higgs field, fixed for each particle."],
      breaks: "At lattice-scale wavelengths (k near π), where the grid shows; the travelling ripple is kept well above that.",
      examples: [
        { what: "Massive ripple's speed as a share of light's, m = 0.36", setup: { mode: "travel", m: 0.36 }, read: s => s.ratio, expect: (Math.sin(0.25) / Math.sqrt(4 * Math.sin(0.125) ** 2 + 0.36 ** 2)) / (Math.sin(0.25) / Math.sqrt(4 * Math.sin(0.125) ** 2)), tol: 1e-9, show: v => `${(v * 100).toFixed(1)}%`, from: "v = sin k / ω, both fields" },
        { what: "…with no mass", setup: { mode: "travel", m: 0 }, read: s => s.ratio, expect: 1, tol: 1e-12, show: v => `${(v * 100).toFixed(0)}%`, from: "a massless ripple travels at light speed" }
      ],
      sources: "O. Klein (1926); W. Gordon (1926); any quantum-field-theory text (e.g. Peskin & Schroeder, 1995, ch. 2)."
    },
    delayed: {
      model: "An ideal Mach–Zehnder interferometer sent one photon at a time; whether the second splitter is in can be chosen after the photon passes the first. Quantum probabilities, sampled photon by photon.",
      eqs: [
        ["P(D1) = cos²(φ/2)", "Second splitter in: the chance a photon reaches detector 1 at phase difference φ between the arms."],
        ["P(D1) = ½", "Second splitter out: each detector sees one arm."]
      ],
      consts: [["φ", "0 to 2π", "the phase difference, set by the slider"]],
      simplified: ["Ideal, lossless optics and perfect detectors.", "Photons are sampled one at a time with a random-number generator following the probabilities above."],
      breaks: "It doesn't, for single photons — the experiment has been done (Jacques et al. 2007) and matches.",
      examples: [
        { what: "Splitter in, φ = 0: chance of detector 1", setup: { mode: "in", phi: 0 }, read: s => s.pIn, expect: 1, tol: 1e-12, show: v => `${(v * 100).toFixed(0)}%`, from: "cos²(0) = 1" },
        { what: "Splitter in, φ = π", setup: { mode: "in", phi: Math.PI }, read: s => s.pIn, expect: 0, tol: 1e-12, show: v => `${(v * 100).toFixed(0)}%`, from: "cos²(π/2) = 0" },
        { what: "Splitter in, φ = π/2", setup: { mode: "in", phi: Math.PI / 2 }, read: s => s.pIn, expect: 0.5, tol: 1e-12, show: v => `${(v * 100).toFixed(0)}%`, from: "cos²(π/4) = ½" }
      ],
      sources: "J. A. Wheeler (1978); V. Jacques et al., Science 315, 966 (2007)."
    },
    frozen: {
      model: "The Page–Wootters picture: a 12-reading clock entangled with a spin-½, in one stationary state of the whole. Exact, computed live.",
      eqs: [
        ["|Ψ⟩ = (1/√N) Σ<sub>k</sub> |k⟩<sub>clock</sub> ⊗ U<sup>k</sup>|↑⟩<sub>spin</sub>", "The whole universe's state: clock reading k paired with the spin turned k steps. It doesn't change."],
        ["θ<sub>k</sub> = 2π f k / N", "The spin's direction when the clock reads k (f turns per clock cycle)."],
        ["P(up) = cos²(θ<sub>k</sub>/2)", "The chance the spin is measured 'up the page', given that reading."],
        ["|⟨Ψ|W|Ψ⟩|² = cos²(πf/N)", "Without entanglement, applying one tick to the whole changes it by this overlap (1 would mean unchanged)."]
      ],
      consts: [["N", "12", "clock readings"], ["f", "1–3", "spin turns per clock cycle"]],
      simplified: ["A toy universe: one clock, one spin. The real proposal concerns the whole universe.", "The clock is ideal and discrete."],
      breaks: "As a model of our universe, what counts as a 'clock' and how it's chosen are open questions — the reason it's tagged contested.",
      examples: [
        { what: "Clock reads 6, f = 1: spin direction (cos θ)", setup: { f: 1, k: 6, ent: true }, read: s => s.cos, expect: Math.cos(2 * Math.PI * 6 / 12), tol: 1e-12, show: v => v.toFixed(0), from: "θ = π: pointing the other way" },
        { what: "Not entangled, f = 1: overlap after one tick", setup: { f: 1, ent: false, evolve: true }, read: s => s.overlap, expect: Math.cos(Math.PI / 12) ** 2, tol: 1e-12, show: v => v.toFixed(3), from: "cos²(π/12): the whole has changed" }
      ],
      sources: "D. N. Page & W. K. Wootters, Phys. Rev. D 27, 2885 (1983); E. Moreva et al., Phys. Rev. A 89, 052122 (2014)."
    },
    horizons: {
      model: "The same smooth ΛCDM universe as the Expanding-universe lab, drawn in conformal time so light travels at 45°. Tables of conformal time built by integration. Computed live.",
      eqs: [
        ["η(a) = ∫₀<sup>a</sup> da′ / (a′² H(a′))", "Conformal time: how far light can have travelled (in today's distances) by the time the universe had size a."],
        ["particle horizon = c · η(1)", "The edge of the observable universe: the farthest matter whose light has had time to reach us."],
        ["event horizon = c · [η(∞) − η(1)]", "The farthest galaxy a signal sent today can ever reach, because accelerating expansion carries the rest away."]
      ],
      consts: [["Ω<sub>m</sub>, Ω<sub>Λ</sub>, Ω<sub>r</sub>", "0.315, 0.685, 9.1 × 10⁻⁵", "Planck Collaboration (2020)"], ["H₀", "67.4 km/s/Mpc", "Planck (2020)"]],
      simplified: ["A perfectly smooth universe.", "Distances are 'proper distance today' (comoving)."],
      breaks: "Only if the ΛCDM model does — for example if dark energy isn't constant.",
      examples: [
        { what: "Observable universe (particle horizon), today", setup: {}, read: s => s.particle, expect: particleGly, tol: 0.15, show: v => `${v.toFixed(1)} billion ly`, from: "the integral above, done independently — about 46 billion light-years" },
        { what: "Event horizon, today", setup: {}, read: s => s.horizon, expect: eventGly, tol: 0.1, show: v => `${v.toFixed(1)} billion ly`, from: "the integral above — about 16.7 billion light-years" }
      ],
      sources: "T. M. Davis & C. H. Lineweaver, PASA 21, 97 (2004); Planck Collaboration (2020)."
    },
    boot: {
      model: "Tegmark's map of space and time dimensions, as a checklist of published results; and one planet orbiting a star with gravity generalised to n space dimensions, integrated step by step (velocity Verlet). Computed live.",
      eqs: [
        ["F ∝ 1 / r<sup>n−1</sup>", "Gravity spreads over the surface of an n-dimensional sphere, so it weakens as 1/r<sup>n−1</sup>."],
        ["V<sub>eff</sub>(r) = L²/(2r²) − k / r<sup>n−2</sup>", "The effective potential for an orbit with angular momentum L. It has a stable minimum only when n < 4: at 4 or more, a nudged circular orbit spirals in or flies off."]
      ],
      consts: [["n", "2 to 5 (a continuous dial)", "space dimensions"]],
      simplified: ["Newtonian gravity generalised to n dimensions; fractional n is a mathematical dial, not a physical world.", "The boot checks are published results, summarised — not computed here."],
      breaks: "For the checklist: it's a map of arguments (Ehrenfest, Dorling, Tegmark), not a proof that observers need 3 + 1.",
      examples: [
        { what: "n = 3.9: does an orbit survive?", run: d => { d.applySetup({ on: 3.9 }); for (let k = 0; k < 400; k++) { d.tick(0.05); if (d.state().dead) return 0; } return 1; }, expect: 1, tol: 0, show: v => v ? "yes" : "no", from: "n < 4: a stable minimum exists" },
        { what: "n = 4.2: does an orbit survive?", run: d => { d.applySetup({ on: 4.2 }); for (let k = 0; k < 400; k++) { d.tick(0.05); if (d.state().dead) return 0; } return 1; }, expect: 0, tol: 0, show: v => v ? "yes" : "no", from: "n ≥ 4: no stable orbit (Ehrenfest 1917)" }
      ],
      sources: "P. Ehrenfest (1917); J. Dorling, Am. J. Phys. 38, 539 (1970); M. Tegmark, Class. Quantum Grav. 14, L69 (1997)."
    },
    wormhole: {
      model: "The complete (maximally extended) Schwarzschild black hole in Kruskal–Szekeres coordinates, where light travels at 45°. Exact.",
      eqs: [
        ["U² − V² = (r/r<sub>s</sub> − 1) e<sup>r/r<sub>s</sub></sup>", "Kruskal coordinates U (space-like) and V (time-like), related to the radius r."],
        ["(1 − r/r<sub>s</sub>) e<sup>r/r<sub>s</sub></sup> = V²", "On the slice at time V, the throat of the bridge (U = 0) has this radius: widest (r = r<sub>s</sub>) at V = 0, pinching to zero at V = ±1."]
      ],
      consts: [["r<sub>s</sub>", "2GM/c²", "the horizon radius (units of the lab)"]],
      simplified: ["An eternal black hole with a second universe: a real black hole formed by collapse has no bridge.", "The bridge picture on the right is schematic; the throat radius is exact."],
      breaks: "At the singularity (V² − U² = 1), and for real, collapsing black holes.",
      examples: [
        { what: "Throat radius at V = 0", setup: { V: 0 }, read: s => s.throat, expect: 1, tol: 1e-9, show: v => `${v.toFixed(2)} r_s`, from: "widest: one horizon radius" },
        { what: "Throat radius at V = 0.91", setup: { V: 0.91 }, read: s => s.throat, expect: bisect(r => (1 - r) * Math.exp(r) - 0.91 ** 2, 0, 1), tol: 1e-9, show: v => `${v.toFixed(3)} r_s`, from: "solving (1 − r) eʳ = V²" }
      ],
      sources: "M. Kruskal, Phys. Rev. 119, 1743 (1960); G. Szekeres (1960); R. Fuller & J. Wheeler, Phys. Rev. 128, 919 (1962)."
    },
    loops: {
      model: "Gödel's rotating universe (1949), an exact solution of Einstein's equations. The light cones along a circle are computed from the metric. Exact.",
      eqs: [
        ["dt/dφ = −√2 sinh²r ± sinh r √(sinh²r + 1)", "Light going round a circle of coordinate radius r: how the light cone tilts."],
        ["sinh r<sub>c</sub> = 1", "Beyond r<sub>c</sub> = arsinh(1) ≈ 0.881 the circle itself lies inside the light cone: a closed timelike curve."],
        ["R<sub>c</sub> = √2 · arsinh(1) · c / ω", "That critical radius as a real distance, for a universe rotating at rate ω = 2π/P."]
      ],
      consts: [["P", "the rotation period (slider)", "Gödel's universe; ours shows no measurable rotation (Saadeh et al. 2016)"]],
      simplified: ["The cone slices are drawn at a few radii; the circle walk is schematic in time."],
      breaks: "As a picture of our universe: it isn't rotating, and has matter that Gödel's solution doesn't.",
      examples: [
        { what: "Loops begin, for a spin every 100 billion years", setup: { P: 100 }, read: s => s.Rc, expect: Math.SQRT2 * Math.asinh(1) * 100 / (2 * Math.PI), tol: 0.01, show: v => `${v.toFixed(1)} billion ly`, from: "√2 · arsinh(1) · P / 2π" },
        { what: "At coordinate radius 1.06: a time loop?", setup: { rr: 1.06 }, read: s => s.loop ? 1 : 0, expect: 1.06 > Math.asinh(1) ? 1 : 0, tol: 0, show: v => v ? "yes" : "no", from: "1.06 > arsinh(1)" }
      ],
      sources: "K. Gödel, Rev. Mod. Phys. 21, 447 (1949); S. Hawking & G. Ellis, The Large Scale Structure of Space-Time (1973), §5.7."
    },
    river: {
      model: "The Gullstrand–Painlevé ('river') picture of a black hole: space flows inward at the Newtonian escape speed, and light moves at c through the flowing space. Exact for a non-rotating hole.",
      eqs: [
        ["v<sub>flow</sub> = c √(r<sub>s</sub> / r)", "The inward speed of space at radius r: light speed exactly at the horizon."],
        ["dr/dt = ±c − v<sub>flow</sub>", "Light's speed over the ground, outward (+) or inward (−)."],
        ["rate of a clock held still = √(1 − r<sub>s</sub>/r)", "How fast a clock hovering at radius r ticks compared with a distant one."]
      ],
      consts: [["r<sub>s</sub>", "2GM/c²", "the horizon radius (units of the lab)"]],
      simplified: ["Top view of a slice; the flow is drawn at a playback speed.", "Non-rotating, uncharged hole."],
      breaks: "Inside the horizon the picture holds right to the centre, where the singularity lies — there, general relativity itself gives out.",
      examples: [
        { what: "Flow speed at 4 horizon radii", setup: {}, read: s => s.flowAt(4), expect: 0.5, tol: 1e-12, show: v => `${v.toFixed(2)} c`, from: "√(1/4)" },
        { what: "A held-still clock at 4 horizon radii", setup: {}, read: s => s.clockAt(4), expect: Math.sqrt(0.75), tol: 1e-12, show: v => `${(v * 100).toFixed(1)}%`, from: "√(1 − 1/4)" }
      ],
      sources: "A. Hamilton & J. Lisle, Am. J. Phys. 76, 519 (2008); P. Painlevé (1921); A. Gullstrand (1922)."
    },
    entropy: {
      model: "240 soft discs under Newton's laws, integrated in exact integer arithmetic so reversing every velocity retraces the past exactly. Entropy is counted on a coarse 8 × 4 grid. Computed live.",
      eqs: [
        ["S = ln W,  W = N! / (n₁! n₂! … n₃₂!)", "Boltzmann's entropy (in units of k): W counts the ways to put N discs into the 32 cells with these counts."],
        ["S<sub>shown</sub> = (S − S<sub>packed</sub>) / (S<sub>even</sub> − S<sub>packed</sub>)", "The 0–100 scale: from all discs evenly in the left half to evenly everywhere."],
        ["complexity = runs of equal density along each row (16 × 8 grid, smoothed, 3 levels)", "A simple stand-in for the compressed size of the coarse-grained picture (Aaronson, Carroll & Ouellette 2014)."]
      ],
      consts: [["N", "240 discs", ""], ["cells", "8 × 4 = 32", "the coarse-graining"]],
      simplified: ["Two dimensions, soft discs, a small N — so fluctuations show (they shrink as 1/√N).", "How to measure complexity isn't settled; this is one simple choice."],
      breaks: "Never for the reversibility — the integer arithmetic is exact. The entropy value depends on the grid chosen, as coarse-grained entropy always does.",
      examples: [
        { what: "All 240 discs in one cell: ln W", setup: {}, read: s => s.lnW([240].concat(new Array(31).fill(0))), expect: 0, tol: 1e-9, show: v => v.toFixed(0), from: "only one way: W = 1" },
        { what: "Evenly spread (7 or 8 per cell): ln W", setup: {}, read: s => s.lnW(new Array(16).fill(7).concat(new Array(16).fill(8))), expect: lnFact(240) - 16 * lnFact(7) - 16 * lnFact(8), tol: 1e-6, show: v => `${v.toFixed(1)}`, from: "ln 240! − 16 ln 7! − 16 ln 8!" },
        { what: "Evenly in the left half (15 per cell there): ln W", setup: {}, read: s => s.lnW(new Array(16).fill(15).concat(new Array(16).fill(0))), expect: lnFact(240) - 16 * lnFact(15), tol: 1e-6, show: v => `${v.toFixed(1)}`, from: "ln 240! − 16 ln 15!" }
      ],
      sources: "L. Boltzmann (1877); S. Aaronson, S. M. Carroll & L. Ouellette, arXiv:1405.6903 (2014)."
    },
    films: {
      model: "Two exact solutions of a wave equation with two time directions, u<sub>tt</sub> + u<sub>ss</sub> − u<sub>xx</sub> = 0, chosen to agree completely on the starting slice. Exact.",
      eqs: [
        ["u<sub>A</sub> = cos 2x · cos 2t", "Film A."],
        ["u<sub>B</sub> = u<sub>A</sub> + ε cos 3x · (cos 3t − cos √5 t · cos 2s)", "Film B. The extra term and all its first rates of change vanish at t = 0, s = 0 — yet it grows as t increases."],
        ["u<sub>tt</sub> + u<sub>ss</sub> − u<sub>xx</sub> = 0", "Both films satisfy this exactly (check: −9 + 0 + 9 = 0 for the first part, −5 − 4 + 9 = 0 for the second)."]
      ],
      consts: [["ε", "0.10–0.60 (slider)", "the size of the difference"]],
      simplified: ["One space dimension and two time dimensions.", "The point is mathematical: complete data on one slice doesn't fix the solution."],
      breaks: "It doesn't — both are exact solutions. It's a statement about equations with two times, the reason physics with two times struggles to predict.",
      examples: [
        { what: "Largest difference on the starting slice", setup: { eps: 0.35 }, read: s => { let m = 0; for (let i = 0; i <= 200; i++) { const x = i / 200 * 2 * Math.PI; m = Math.max(m, Math.abs(s.uB(x, 0, 0) - s.uA(x, 0))); } return m; }, expect: 0, tol: 1e-12, show: v => v.toFixed(3), from: "identical start" },
        { what: "Largest difference at t = 2 (s = 0)", setup: { eps: 0.35 }, read: s => { let m = 0; for (let i = 0; i <= 2000; i++) { const x = i / 2000 * 2 * Math.PI; m = Math.max(m, Math.abs(s.uB(x, 2, 0) - s.uA(x, 2))); } return m; }, expect: 0.35 * Math.abs(Math.cos(6) - Math.cos(2 * Math.sqrt(5))), tol: 1e-4, show: v => v.toFixed(3), from: "ε |cos 6 − cos 2√5|" },
        { what: "Film B obeys the equation (largest error, finite differences)", setup: { eps: 0.35 }, read: s => { const h = 1e-3, u = s.uB; let m = 0; for (const [x, t, q] of [[0.3, 0.7, 0.2], [1.1, 1.9, 0.9], [2.5, 0.4, 1.4]]) { const tt = (u(x, t + h, q) - 2 * u(x, t, q) + u(x, t - h, q)) / h / h, ss = (u(x, t, q + h) - 2 * u(x, t, q) + u(x, t, q - h)) / h / h, xx = (u(x + h, t, q) - 2 * u(x, t, q) + u(x - h, t, q)) / h / h; m = Math.max(m, Math.abs(tt + ss - xx)); } return m; }, expect: 0, tol: 1e-3, show: v => v.toFixed(4), from: "zero, up to rounding" }
      ],
      sources: "I. Bars, 'Survey of two-time physics' (2001); W. Craig & S. Weinstein, Proc. R. Soc. A 465, 3023 (2009)."
    },
    timeline: {
      model: "Mostly published data: each event's date is taken from the literature, not computed here. One curve is computed: the measured rate of star birth over cosmic time.",
      data: true,
      eqs: [
        ["ψ(z) ∝ (1 + z)<sup>2.7</sup> / [1 + ((1 + z)/2.9)<sup>5.6</sup>]", "The cosmic star-formation rate against redshift z — Madau & Dickinson's fit to the measurements."],
        ["t(z) = ∫ da / (a H(a)),  a = 1/(1 + z)", "Turning redshift into time since the Big Bang, with the same ΛCDM universe as the other labs."]
      ],
      consts: [["Ω<sub>m</sub>, Ω<sub>Λ</sub>", "0.315, 0.685", "Planck (2020)"], ["H₀", "67.4 km/s/Mpc", "Planck (2020)"]],
      simplified: ["Event dates are rounded; the far future is extrapolated from today's physics (Adams & Laughlin 1997) and tagged by how sure it is."],
      breaks: "Early events (before about a second) and the far future carry the tags CONTESTED or SPECULATIVE — each event says which.",
      examples: [
        { what: "When star birth peaked ('cosmic noon')", setup: {}, read: s => s.sfrPeak, expect: ageAt(zPeak), tol: 0.1, show: v => `${v.toFixed(1)} billion years after the Big Bang`, from: "the fit's peak, turned into time independently" },
        { what: "Today's rate, as a share of the peak", setup: {}, read: s => s.sfrToday, expect: md(0) / md(zPeak), tol: 0.01, show: v => `${(v * 100).toFixed(0)}%`, from: "roughly a tenth" }
      ],
      sources: "P. Madau & M. Dickinson, ARA&A 52, 415 (2014); Planck Collaboration (2020); F. C. Adams & G. Laughlin, Rev. Mod. Phys. 69, 337 (1997)."
    },
    janus: {
      model: "A swarm of 60 stars under Newtonian gravity (softened), started at the Janus point — its moment of least size — and integrated both forwards and backwards in time. Total energy is set exactly to zero, as in Barbour, Koslowski & Mercati's model. Computed live.",
      eqs: [
        ["E = Σ ½ m v² − Σ G m<sub>i</sub> m<sub>j</sub> / √(r<sub>ij</sub>² + ε²) = 0", "Kinetic plus (softened) gravitational energy: zero for the whole swarm, so it can expand for ever in both directions."],
        ["C = (size) × (tightness)", "A measure of clumpiness (the 'complexity'): lowest at the Janus point, growing both ways."]
      ],
      consts: [["N", "60", "stars"], ["ε", "0.04", "softening length"]],
      simplified: ["Two dimensions; equal masses; softened gravity so close passes don't blow up the integration.", "The energy is zero by construction, so there's no worked example that would test more than the definition; the code's own check (energy stays within about 10⁻⁶ of zero through the run) is noted in the source."],
      breaks: "As a model of our universe the Janus-point idea is contested: it's a proposal for where the arrow of time comes from, not established physics.",
      examples: [],
      sources: "J. Barbour, T. Koslowski & F. Mercati, PRL 113, 181101 (2014); J. Barbour, The Janus Point (2020)."
    },
    stars: {
      model: "Mostly published data: which elements a star of each mass makes, how long it lives, and where each element in the Solar System came from. The moving pictures are pictures. One sum is computed: how much of your body was made in stars.",
      data: true,
      eqs: [
        ["share from stars = 1 − Σ<sub>elements</sub> (body share × Big-Bang share) / Σ (body share)", "Your mass by origin: each element's share of your body, times the share of that element made by each source."]
      ],
      consts: [["body composition", "O 65%, C 18%, H 10%, N 3%, Ca 1.5%, P 1% …", "Emsley (2011)"], ["element origins", "rounded to the nearest 10%", "Johnson (2019); Kobayashi, Karakas & Lugaro (2020)"], ["stage times", "for a 25-Sun star", "Woosley, Heger & Weaver (2002)"]],
      simplified: ["Which stage makes which element is rounded; the mass thresholds are rounded from stellar models and the 8–10 Sun boundary is uncertain.", "Origin shares are for the Solar System, rounded to 10%."],
      breaks: "Where the models disagree: the split of heavy elements between colliding neutron stars and rare collapsing stars (contested).",
      examples: [
        { what: "Heaviest element a Sun-like star's core makes", run: d => { d.applySetup({ mode: "star", star: 2, p: 2.99, play: false }); for (let k = 0; k < 40; k++) d.tick(0.05); return d.readouts()[2][1]; }, expect: "Oxygen", show: v => v, from: "stellar models: the Sun stops at carbon and oxygen" },
        { what: "…a 12-Sun star's", run: d => { d.applySetup({ mode: "star", star: 5, p: 5.9, play: false }); for (let k = 0; k < 40; k++) d.tick(0.05); return d.readouts()[2][1]; }, expect: "Nickel", show: v => v, from: "core fusion stops at the iron group" },
        { what: "Your mass made in stars", setup: {}, read: s => s.bodyStars, expect: 0.9, tol: 0.01, show: v => `${Math.round(v * 100)}%`, from: "Emsley (2011) × Johnson (2019): all but the hydrogen" }
      ],
      sources: "S. E. Woosley, A. Heger & T. A. Weaver, RMP 74, 1015 (2002); J. A. Johnson, Science 363, 474 (2019); C. Kobayashi, A. I. Karakas & M. Lugaro, ApJ 900, 179 (2020); J. Emsley, Nature's Building Blocks (2011)."
    },
    flatland: {
      title: "Flatland",
      model: "Exact geometry: slices of spheres, cones and cubes by a lower-dimensional space, projections, and ray casting for A Square's view. The story is Abbott's 1884 analogy.",
      eqs: [
        ["r = √(R² − z²)", "The circle A Square sees when a sphere of radius R is at height z above his plane (nothing when |z| ≥ R)."],
        ["corners = 2ⁿ,  edges = n · 2ⁿ⁻¹", "An n-dimensional cube: each step doubles the shape and joins every corner to its copy."],
        ["tilt < 45° → ellipsoid;  = 45° → paraboloid;  > 45° → hyperboloid", "Slicing a 4D cone at a tilt: the 3D cousins of the ellipse, parabola and hyperbola."],
        ["tesseract ∩ {x + y + z + w = d}", "A tesseract passing corner-first through our space: its slice starts as a tetrahedron and is an octahedron halfway."]
      ],
      consts: [["dimensions", "2 (Flatland) to 5", ""]],
      simplified: ["Orthographic projection for the 3D views; the Flatland world is drawn from above for us, and as a single line for A Square."],
      breaks: "It doesn't — the geometry is exact. The analogy is the part to hold lightly: tagged ANALOGY.",
      examples: [
        { what: "Sphere R = 3 at height 2.7: the slice's radius", run: () => Chrono.flatland.fx.sliceR(3, 2.7), expect: Math.sqrt(9 - 2.7 * 2.7), tol: 1e-12, show: v => v.toFixed(3), from: "√(R² − z²)" },
        { what: "Tesseract (n = 4): corners and edges", run: () => { const c = Chrono.flatland.fx.cube(4); return c.v * 1000 + c.e; }, expect: 16 * 1000 + 32, tol: 0, show: v => `${Math.floor(v / 1000)} corners, ${v % 1000} edges`, from: "2⁴ and 4 · 2³" },
        { what: "4D cone sliced at exactly 45°", run: () => Chrono.flatland.fx.coneShape(45), expect: "paraboloid", show: v => v, from: "the conic at the cone's own slope" },
        { what: "Tesseract corner-first, just past the corner: slice's corners", run: () => Chrono.flatland.fx.tessSlice("corner", 3.5), expect: 4, tol: 0, show: v => `${v} (a tetrahedron)`, from: "4 edges meet at a corner" },
        { what: "…halfway through", run: () => Chrono.flatland.fx.tessSlice("corner", 0), expect: 6, tol: 0, show: v => `${v} (an octahedron)`, from: "the 6 corners with two +1s and two −1s" }
      ],
      sources: "E. A. Abbott, Flatland (1884); H. S. M. Coxeter, Regular Polytopes (1973)."
    }
  };

  /* ---------- the pages: #maths (index) and #maths/<lab> ---------- */
  const title = id => { const M = Chrono.MATHS[id], d = Chrono.lab.def(id); return M && M.title || (d ? d.title : id); };
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
      ${M.data ? `<p class="meta"><b>Data, not a simulation:</b> the numbers here are published values, shown as they are. The sources below are the tables.</p>` : ""}
      ${M.examples.length ? `<h2 class="sect">Worked examples <span class="chk">✓ checked on every change</span></h2>
      <table class="mt">${M.examples.map(x => `<tr><td>${x.what}</td><td><b>${x.show(x.expect)}</b></td><td class="meta">${x.from}</td></tr>`).join("")}</table>
      <p class="meta">The app's test suite puts the lab in each setup, reads the lab's own result, and fails if it strays from these values.</p>` : ""}
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
      <p class="meta">Every lab has a page. Labs that show published data rather than computing it say so, and point to their tables.</p>
    </div>`;
  }
  Chrono.lab.register({ id: "maths", kind: "doc", title: "The maths", eyebrow: "Under the hood", tier: "none", page,
    aside: () => `<p>For anyone who wants to check the working. Each page gives a lab's model in full; the worked examples are tested against the lab's own code on every change, so the numbers here and the numbers in the lab can't drift apart.</p>
      <p class="meta">Some labs show published data rather than computing it (the element shares, the timeline's dates); their pages will say so and point to the tables.</p>` });
})();
