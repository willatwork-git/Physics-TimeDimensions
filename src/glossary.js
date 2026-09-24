/* Chronoscope — glossary. The first use of each term in a panel gets a dotted underline; hover, focus
   or tap shows a one-line definition. Definitions are standard textbook usage (ESTABLISHED).
   Add a term: one entry — [match pattern, definition]. The pattern is a regex fragment, case-insensitive. */
(function () {
  const TERMS = [
    ["spacetime", "Space and time treated as one four-dimensional geometry, as in relativity. Different observers slice it into 'space' and 'time' differently."],
    ["special relativity", "Einstein's 1905 theory: the laws of physics and the speed of light are the same for every steadily moving observer — so measurements of time and length depend on motion."],
    ["general relativity", "Einstein's 1915 theory of gravity: mass and energy curve spacetime, and that curvature guides how things move."],
    ["relativity", "Einstein's theories of space, time and gravity (special relativity, 1905; general relativity, 1915)."],
    ["quantum mechanics", "The theory of the very small. Outcomes are probabilities, and measurement plays a special role."],
    ["quantum field theory", "The framework behind all of particle physics: every kind of particle is a ripple in its own field that fills space."],
    ["quantum gravity", "A hoped-for theory joining quantum mechanics and general relativity. Several candidates exist; none is confirmed."],
    ["fields?", "Something with a value at every point in space and time — like temperature across a room. In modern physics, particles are ripples in fields."],
    ["Higgs field", "A field filling all of space; particles that interact with it gain mass. Its ripple, the Higgs boson, was found in 2012."],
    ["entropy", "How many microscopic arrangements look the same from outside. Left alone, it almost always increases — the usual explanation for time's arrow."],
    ["arrow of time|time's arrow", "The one-way direction of everyday processes: eggs break but never unbreak, we remember the past but not the future."],
    ["equilibrium", "A state that no longer changes overall — like gas that has spread evenly through a box."],
    ["horizon", "A black hole's boundary of no return: from inside it, nothing — not even light — can get back out."],
    ["black holes?", "A region where gravity is so strong that nothing, not even light, can escape from inside its horizon."],
    ["redshift", "Light stretched to longer, redder wavelengths — by motion, by gravity, or by the expansion of space."],
    ["light cones?", "All the places and times a signal from an event could reach, travelling at up to light speed. Events outside it can't affect it."],
    ["proper time", "The time a clock actually records along its own path. Clocks on different paths can disagree."],
    ["time dilation", "Clocks running at different rates because of relative motion or gravity."],
    ["megaparsecs?", "A distance unit used for galaxies: 3.26 million light-years."],
    ["Big Bang", "The hot, dense early state the universe has been expanding from for about 13.8 billion years. Not necessarily an absolute beginning."],
    ["dark energy", "Whatever is making the universe's expansion speed up — about 68% of its energy. Its nature is unknown."],
    ["dark matter", "Unseen mass revealed by its gravity on galaxies and light — about 27% of the universe's energy. Not yet detected directly."],
    ["microwave background", "The afterglow of the hot early universe, now cooled to 2.7 degrees above absolute zero and arriving from every direction."],
    ["inflation", "A proposed burst of extremely rapid expansion in the universe's first fraction of a second. Widely accepted; not directly confirmed."],
    ["quantum states?", "The complete description of a quantum system: it gives the probability of every possible measurement result."],
    ["entangle(?:ment|d)", "A link between quantum systems whose measurement results are correlated more strongly than any ordinary connection allows."],
    ["Wheeler–DeWitt equation", "The equation you get by applying quantum rules to the whole universe. Time does not appear in it."],
    ["Klein–Gordon equation", "The basic relativistic wave equation for a field with mass."],
    ["Planck scale", "Around 10⁻³⁵ metres or 10⁻⁴³ seconds — where the quantum effects of gravity are expected to matter."],
    ["tesseract", "The four-dimensional version of a cube: 16 corners, 32 edges, 24 square faces and 8 cubic 'cells'."],
    ["hyperplanes?", "A flat slice with one dimension fewer than the space it sits in: a plane in 3D, a 3D 'sheet' in 4D."],
    ["branes?", "In string-inspired models, a membrane-like surface that our 3D world might live on, inside a higher-dimensional space."],
    ["gauge theory", "A theory in which a force arises from a hidden symmetry. Electromagnetism is the simplest example."]
  ].map(([pat, def]) => [new RegExp(`(?<![\\w-])(?:${pat})(?![\\w-])`, "i"), def]);

  const SKIP = "a, button, h1, h2, h3, .eyebrow, .tag, .tier, code, dfn, label, select, .caveat, .popts, .labchips, table.bench, .th-name, .info, .ccard, .backlink, .crumb, .xcard, .qcard .eyebrow, .stcast, .stwho, .sthead";

  function annotate(root) {
    const used = new Set();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement && !n.parentElement.closest(SKIP) && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const queue = []; while (walker.nextNode()) queue.push(walker.currentNode);
    while (queue.length) {
      const node = queue.shift();
      let best = null;
      TERMS.forEach(([re, def], k) => {
        if (used.has(k)) return;
        const m = re.exec(node.nodeValue);
        if (m && (!best || m.index < best.m.index)) best = { m, def, k };
      });
      if (!best) continue;
      used.add(best.k);
      const rest = node.splitText(best.m.index), after = rest.splitText(best.m[0].length);
      const d = document.createElement("dfn");
      d.className = "gl"; d.tabIndex = 0; d.dataset.def = best.def; d.textContent = rest.nodeValue;
      rest.replaceWith(d);
      queue.unshift(after);
    }
  }

  /* one floating tooltip, clamped to the viewport */
  const tip = document.createElement("div"); tip.id = "gltip"; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
  function show(d) {
    tip.textContent = d.dataset.def; tip.style.display = "block";
    const r = d.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + "px";
    tip.style.top = (r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8) + "px";
  }
  const hide = () => { tip.style.display = "none"; };
  document.addEventListener("mouseover", e => { const d = e.target.closest && e.target.closest("dfn.gl"); d ? show(d) : hide(); });
  document.addEventListener("focusin", e => { if (e.target.matches && e.target.matches("dfn.gl")) show(e.target); });
  document.addEventListener("focusout", hide);
  document.addEventListener("click", e => { const d = e.target.closest && e.target.closest("dfn.gl"); if (d) show(d); });
  document.addEventListener("scroll", hide, true);

  /* annotate whenever a panel is re-rendered */
  ["#aside", "#doc"].forEach(sel => {
    const root = document.querySelector(sel);
    const obs = new MutationObserver(() => { obs.disconnect(); annotate(root); obs.observe(root, { childList: true }); });
    annotate(root); obs.observe(root, { childList: true });
  });
})();
