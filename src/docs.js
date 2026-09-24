/* Chronoscope — HTML pages: Dimension Map (exploratory framework) and How sure are we? (method). */
(function () {
  const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TG = t => `<span class="tag ${t}">${Chrono.TAGS[t]}</span>`;

  /* ---------------- Dimension Map ---------------- */
  const NEUTRAL = ["What varies along it?", "What can't happen in it?", "What is conserved because of it?", "Do observers disagree about it?", "Where does it change type or vanish?", "How do we access it?"];
  const GROUPS = [
    { id: "space", name: "Space", color: "#7cc4ff", native: ["Can you rest in it?", "Can you return to a point?", "Are its members interchangeable?"],
      members: [
        { n: "x · y · z", tag: "ESTABLISHED", a: ["Position", "Nothing forbidden", "Momentum", "Yes — rotations and motion mix them", "Swaps role with time inside a black hole", "Senses, rulers, light"], note: "Three interchangeable copies of one thing. 'Length, width, depth' are labels from the human body." },
        { n: "Curled extra dimensions", tag: "SPECULATIVE", a: ["Position around a tiny loop", "Large motion", "Charge (in Kaluza–Klein)", "—", "Too small to see", "Only indirectly: heavy particle 'towers'"], note: "Kaluza–Klein, string theory." },
        { n: "Large / warped extra dimension", tag: "SPECULATIVE", a: ["Distance off our 3D 'sheet'", "Light and matter can't enter", "—", "—", "Our brane is its boundary", "Only through gravity"], note: "ADD, Randall–Sundrum, DGP. Tested: gravity's law holds to tens of micrometres." }
      ] },
    { id: "time", name: "Time", color: "#f2c94c", native: ["Persistence — what stays the same thing through it?", "Accumulation — what builds up along it (records, memory, entropy)?", "Loss of possibility — how many futures become one past?"],
      members: [
        { n: "Direction", tag: "ESTABLISHED", a: ["Before → after", "Going back", "Energy", "Yes — the order of distant events depends on motion", "Becomes space-like at the Hartle–Hawking origin; swaps with space in black holes", "Clocks, memory, entropy"], note: "The one member we know. Its one-way character is hole H3." },
        { n: "Texture", tag: "HYPOTHESIS", a: ["Smooth ↔ turbulent; continuous ↔ grainy; predictable ↔ random", "?", "?", "?", "?", "Ultra-precise clock noise, if anything"], note: "An exploratory candidate from this project. Echoes: spacetime foam, Oppenheim's wobble." },
        { n: "A second time axis", tag: "SPECULATIVE", a: ["A second before/after", "Stable prediction from the present alone", "A second energy-like quantity", "—", "Constraints can collapse it to one effective time (Bars)", "None yet"], note: "Bars, Pettini, Kletetschka. See the Two Films lab." }
      ] },
    { id: "internal", name: "Internal (charge)", color: "#e36bd0", native: ["Which forces live here?", "What particles carry it?"],
      members: [
        { n: "Electromagnetic circle", tag: "ESTABLISHED", a: ["A phase — a direction around a circle", "—", "Electric charge", "No", "—", "Light and charged particles"], note: "Gauge theory: light is the ripple of this hidden circle's geometry, as gravity is the ripple of spacetime's. Whether it is a 'real' dimension is open." },
        { n: "Weak (3) and strong (8)", tag: "ESTABLISHED", a: ["Directions in larger internal spaces", "—", "Weak isospin; colour charge", "No", "The weak one 'freezes' via the Higgs", "Particle colliders"], note: "The standard model's structure." }
      ] },
    { id: "scale", name: "Scale", color: "#9b8cff", native: ["What changes as you zoom?"],
      members: [
        { n: "The holographic direction", tag: "CONTESTED", a: ["Zoom level (energy scale)", "—", "—", "—", "At the boundary it stops being a place and becomes an energy scale", "Only in theory (AdS/CFT)"], note: "In holography, moving 'inward' in one dimension means zooming into the boundary. Links to 'space from entanglement'. (Separate result: in CDT and other quantum-gravity approaches, spacetime's effective dimension drops to about 2 at the smallest scales — see the Atlas.)" }
      ] },
    { id: "state", name: "State", color: "#4fd1a5", native: ["Is it a place, or a list of possibilities?"],
      members: [
        { n: "Quantum possibility space", tag: "ESTABLISHED", a: ["Which state, not where", "—", "Probability (total stays 1)", "Yes — Wigner's-friend scenarios", "Collapses on measurement (or branches)", "Interference experiments"], note: "Enormous numbers of dimensions of possibility, all run on one borrowed time parameter — hole H2." }
      ] }
  ];
  const ORPHANS = [
    ["Dark energy", "~68% of the universe", "Acceleration measured; no known dimension or particle explains it. Candidates: vacuum (H9), leakage to a 5th dimension (DGP), a timing illusion (timescape)."],
    ["Dark matter", "~27%", "Gravity measured many ways; nothing seen. Candidates: new particles, particles moving in curled dimensions, modified gravity."],
    ["The Hubble tension", "67 vs 73 (km/s per megaparsec)", "The expansion rate disagrees between methods (H10)."],
    ["The 'now'", "—", "Experienced by every observer; absent from every equation (H4)."]
  ];

  Chrono.lab.register({
    id: "dims", kind: "doc", title: "Dimension Map", eyebrow: "Framework · working draft", tier: "exploratory", tags: ["HYPOTHESIS"],
    page() {
      const cols = GROUPS.map(g => `
        <div class="dgroup" style="--gc:${g.color}">
          <div class="dhead">${g.name}</div>
          ${g.members.map(m => {
            const tier = Chrono.TIER_OF_TAG[m.tag];
            if (!Chrono.shows(tier)) return "";
            return `<div class="dcard ${tier === "exploratory" ? "exp" : ""}">
              <div class="dname">${esc(m.n)} ${TG(m.tag)}</div>
              <dl>${NEUTRAL.map((q, i) => `<dt>${q}</dt><dd>${esc(m.a[i])}</dd>`).join("")}</dl>
              <p class="meta">${esc(m.note)}</p></div>`;
          }).join("")}
          <div class="dnative"><b>Questions native to ${g.name}:</b><ul>${g.native.map(q => `<li>${esc(q)}</li>`).join("")}</ul></div>
        </div>`).join("");
      return `
        <div class="docwrap">
          <div class="dintro">${Chrono.expBanner()}
            <p><b>The idea:</b> stop describing every dimension with questions written for space. Sort dimensions into <b>groups</b>, give every group the same <b>neutral</b> questions, and let each group add its own <b>native</b> questions. Gaps and unanswered rows become visible.</p>
            <p class="meta">The <i>framework</i> is exploratory. The <i>contents</i> of each card carry their own tags — most are mainstream physics.</p>
          </div>
          <div class="dgrid">${cols}</div>
          <h3 style="margin-top:28px">Facts without a dimension — the unassigned column</h3>
          <p class="meta">In a data model, facts with no matching dimension key are the classic sign that a dimension is missing. About 95% of the universe is here.</p>
          <table class="orph"><tr><th>Anomaly</th><th>Size</th><th>Why it's unassigned</th></tr>
            ${ORPHANS.map(o => `<tr><td>${o[0]}</td><td>${o[1]}</td><td>${o[2]}</td></tr>`).join("")}</table>
        </div>`;
    },
    aside: () => `
      <p>Each group is a column. Each card is a candidate member, scored on the same six neutral questions.</p>
      <p><b>Space</b> and <b>Time</b> are different kinds of group — which is why physicists write <b>3 + 1</b>, not 4. The <b>Internal</b> group is where light lives: in gauge theory, light is the ripple of a hidden circle's geometry, just as gravity is the ripple of spacetime's. That's the most solid version of "light and gravity are more alike than different".</p>
      <p>Question marks are the point. The Texture card is almost all "?" — that's what a genuinely new idea looks like before anyone has tested it.</p>
      <p class="meta">Open for editing: add groups, cards or native questions in <code>src/docs.js</code>.</p>`,
    next: { q: "If physics has no agreed account of what a dimension is, who has tried to give one?", href: "#atlas/H11", label: "Atlas · hole H11" }
  });

  /* ---------------- How sure are we? ---------------- */
  const TESTS = [
    ["Supernovae unfold in slow motion", "Stretched by exactly (1 + z)", "No stretching", "Stretched by (1 + z) — Dark Energy Survey, 2024, ~1,500 supernovae", "Expansion"],
    ["The microwave background's spectrum", "A perfect thermal curve", "A distorted curve", "Perfect thermal curve — COBE, 1990", "Expansion"],
    ["The background was hotter in the past", "Temperature × (1 + z)", "No change", "Temperature × (1 + z) — measured in distant gas clouds", "Expansion"],
    ["Distant galaxies stay sharp", "Sharp", "Blurred by scattering", "Sharp", "Expansion"],
    ["Surface brightness dims", "By (1 + z)⁴", "By (1 + z)", "Consistent with (1 + z)⁴ once galaxy ageing is included", "Expansion (with caveats)"]
  ];
  Chrono.lab.register({
    id: "sure", kind: "doc", title: "How sure are we?", eyebrow: "Method · how a claim earns its tag", tier: "mainstream", tags: ["ESTABLISHED"],
    page() {
      return `
        <div class="docwrap">
          <h2 style="margin-top:0">Worked example: is the universe really expanding?</h2>
          <p>Distant galaxies look redder (<b>redshift</b>). Two explanations were on the table from 1929: <b>space is expanding</b>, or light simply <b>gets tired</b> on a long journey (Fritz Zwicky's idea — a natural one). How do we decide? Find tests where the two ideas predict <i>different</i> things, then look.</p>
          <table class="orph"><tr><th>Test</th><th>If space expands</th><th>If light gets tired</th><th>What we see</th><th>Winner</th></tr>
            ${TESTS.map(t => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td><td><b>${t[4]}</b></td></tr>`).join("")}</table>
          <p style="margin-top:14px"><b>Verdict:</b> expansion is <span class="tag ESTABLISHED">Established</span>. Independent tests agree, and tired light fails several of them.</p>
          <h3>What is still genuinely uncertain</h3>
          <ul class="biglist">
            <li><b>How fast?</b> Two methods disagree (67 vs 73 km/s per megaparsec) — the Hubble tension. ${TG("ESTABLISHED")} that the disagreement exists.</li>
            <li><b>What drives the acceleration?</b> "Dark energy" is a name, not an explanation. DESI hints it may be weakening. ${TG("CONTESTED")}</li>
            <li><b>Is the acceleration even real?</b> Timescape cosmology argues it's an effect of clocks ticking differently in voids. ${TG("CONTESTED")}</li>
          </ul>
          <h3>The ladder every claim climbs</h3>
          <ol class="biglist">
            <li><b>Idea</b> — anyone can have one. ${Chrono.shows("exploratory") ? TG("HYPOTHESIS") : ""}</li>
            <li><b>Proposal</b> — worked out mathematically and published. ${TG("SPECULATIVE")}</li>
            <li><b>Tested, disputed</b> — evidence exists, experts disagree. ${TG("CONTESTED")}</li>
            <li><b>Confirmed</b> — independent tests agree; alternatives fail. ${TG("ESTABLISHED")}</li>
          </ol>
          <p class="meta">"Established" never means "final". Newton's gravity was established — and still is, inside its limits. Relativity showed where those limits are.</p>
        </div>`;
    },
    aside: () => `
      <p>This page teaches the <b>method</b> rather than the answer: find where two ideas disagree, then look.</p>
      <p>Tired light is a good example to learn from because it was a <i>reasonable</i> idea. It failed tests, not ridicule.</p>
      <div class="try"><b>For classrooms:</b> give students only the first three columns and ask them to predict the winner before revealing what we see.</div>`,
    next: { q: "Now use the method on questions that are still open. Which attempts make predictions you could check?", href: "#bench", label: "Test bench" },
    sources: "DES Supernova Program, MNRAS 533, 3365 (2024); COBE FIRAS (1990); E. L. Wright, 'Errors in tired light cosmology' (UCLA)."
  });
})();
