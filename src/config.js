/* Chronoscope — edition settings.
   edition "full"   : everything, including exploratory (Will & Claude) ideas and visitor hypotheses.
   edition "school" : mainstream + frontier physics and lenses only. Exploratory content and the
                      hypothesis tools are hidden. Use this for classroom / Space School embedding.
   Override in the URL: index.html?edition=school  */
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
  Chrono.level = Math.min(maxLevel, saved || (Chrono.CONFIG.edition === "school" ? 2 : 3));
  Chrono.maxLevel = maxLevel;
  Chrono.setLevel = function (n) {
    Chrono.level = Math.max(1, Math.min(maxLevel, n));
    try { localStorage.setItem("chronoscope.level", String(Chrono.level)); } catch (e) { }
    (Chrono.onLevel || []).forEach(fn => fn(Chrono.level));
  };
  Chrono.onLevel = [];
  Chrono.shows = tier => (Chrono.TIER_LEVEL[tier] || 1) <= Chrono.level;
})();
