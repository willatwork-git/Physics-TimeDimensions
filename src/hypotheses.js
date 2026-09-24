/* User hypotheses: stored in this browser (localStorage), shareable via JSON export/import. */
(function () {
  const KEY = "chronoscope.hypotheses.v1";
  const H = Chrono.hyp = {};

  H.load = function () {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
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
        const incoming = JSON.parse(r.result);
        const ids = new Set(H.all.map(h => h.id));
        incoming.forEach(h => { if (h && h.id && h.name && !ids.has(h.id)) H.all.push(h); });
        H.save(H.all); done(true);
      } catch (e) { done(false); }
    };
    r.readAsText(file);
  };
})();
