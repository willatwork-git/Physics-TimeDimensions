/* Chronoscope — edition settings.
   edition "full"   : Learn and Lab modes; Lab adds this project's exploratory ideas and visitor hypotheses.
   edition "school" : Learn mode only (mainstream + frontier physics and lenses). Exploratory content and the
                      hypothesis tools are hidden. Use this for classroom / Space School embedding.
   Override in the URL: index.html?edition=school
   Modes (full edition): "learn" (default) = mainstream + frontier, calm Atlas, guided links;
   "lab" = everything, including exploratory ideas, hypothesis tools and all filters.
   Link straight to a mode: index.html?mode=lab   (internally: learn = level 2, lab = level 3) */
window.Chrono = window.Chrono || {};
Chrono.CONFIG = { edition: "full" };
(function () {
  try {
    const p = new URLSearchParams(location.search).get("edition");
    if (p === "school" || p === "full") Chrono.CONFIG.edition = p;
  } catch (e) { /* file:// or sandbox: keep default */ }
  const maxLevel = Chrono.CONFIG.edition === "school" ? 2 : 3;
  let saved = null;
  try { saved = parseInt(localStorage.getItem("chronoscope.level"), 10); } catch (e) { }
  try {
    const m = new URLSearchParams(location.search).get("mode");
    if (m === "lab") saved = 3; else if (m === "learn") saved = 2;
  } catch (e) { }
  Chrono.level = Math.min(maxLevel, Math.max(2, saved || 2));
  Chrono.maxLevel = maxLevel;
  Chrono.setLevel = function (n) {
    Chrono.level = Math.max(2, Math.min(maxLevel, n));
    try { localStorage.setItem("chronoscope.level", String(Chrono.level)); } catch (e) { }
    (Chrono.onLevel || []).forEach(fn => fn(Chrono.level));
  };
  Chrono.onLevel = [];
  Chrono.mode = () => Chrono.level >= 3 ? "lab" : "learn";
  Chrono.shows = tier => (Chrono.TIER_LEVEL[tier] || 1) <= Chrono.level;
})();
