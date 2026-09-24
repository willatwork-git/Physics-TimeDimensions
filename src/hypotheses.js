/* User hypotheses: stored in this browser (localStorage), shareable via JSON export/import. */
(function () {
  const KEY = "chronoscope.hypotheses.v1";
  const H = Chrono.hyp = {};

  /* Imported files come from other people: treat them as untrusted data. Keep only known camps and
     holes, a plain id, and short strings — anything else is dropped rather than rendered. */
  const str = (v, max) => typeof v === "string" ? v.trim().slice(0, max) : "";
  function clean(h) {
    if (!h || typeof h !== "object") return null;
    const id = str(h.id, 40), name = str(h.name, 120);
    if (!/^[\w-]+$/.test(id) || !name) return null;
    const camps = Chrono.CAMPS.filter(c => c.id !== "bench").map(c => c.id);
    const holes = Array.isArray(h.holes) ? h.holes.filter(x => Chrono.HOLES.some(k => k.id === x)) : [];
    if (!camps.includes(h.camp) || !holes.length) return null;
    return { id, name, camp: h.camp, holes, plain: str(h.plain, 2000), pred: str(h.pred, 2000), kill: str(h.kill, 2000), who: str(h.who, 60) || "You" };
  }
  const cleanAll = list => Array.isArray(list) ? list.map(clean).filter(Boolean) : [];

  H.load = function () {
    try { return cleanAll(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch (e) { return []; }
  };
  H.save = function (list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: keep in memory only */ }
  };
  H.all = H.load();

  H.asIdeas = function () {
    return H.all.map(h => ({
      id: h.id, year: 2026, name: h.name, who: h.who || "You", camp: h.camp, holes: h.holes,
      tag: "HYPOTHESIS", outcome: "Yours", plain: h.plain, why: "", predicts: h.pred, kill: h.kill,
      c: { rel: "unk", pred: "unk", matter: "unk", arrow: "unk", test: "unk" },
      note: "", user: true
    }));
  };

  H.add = function (h) { H.all.push(h); H.save(H.all); };
  H.remove = function (id) { H.all = H.all.filter(h => h.id !== id); H.save(H.all); };

  H.exportJSON = function () {
    const blob = new Blob([JSON.stringify(H.all, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chronoscope-hypotheses.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  H.importJSON = function (file, done) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const raw = JSON.parse(r.result);
        if (!Array.isArray(raw)) return done(false);
        const ids = new Set(H.all.map(h => h.id));
        const incoming = cleanAll(raw).filter(h => !ids.has(h.id));
        H.all.push(...incoming); H.save(H.all);
        done(true, incoming.length, raw.length - incoming.length);
      } catch (e) { done(false); }
    };
    r.readAsText(file);
  };
})();
