/* Chronoscope — the visitor's own progress: views seen, predictions made, tour position, their own
   test-bench scores. Stored in this browser only (localStorage); nothing is sent anywhere.
   Every read and write survives blocked storage — the app then simply forgets between visits. */
(function () {
  const KEY = "chronoscope.progress.v1";
  let d = {};
  try { d = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { d = {}; }
  ["seen", "pred", "scores"].forEach(k => { if (!d[k] || typeof d[k] !== "object") d[k] = {}; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { } };

  Chrono.progress = {
    visit(key) { if (!d.seen[key]) { d.seen[key] = 1; save(); } },
    seen: key => !!d.seen[key],
    last: () => typeof d.last === "string" ? d.last : null,
    setLast(hash) { if (d.last !== hash) { d.last = hash; save(); } },

    pred: id => d.pred[id] || {},
    setPred(id, p) { d.pred[id] = p; save(); },

    tour: () => Number.isInteger(d.tour) ? d.tour : null,
    setTour(i) { d.tour = i; save(); },
    tourDone: () => !!d.tourDone,
    finishTour() { d.tour = null; d.tourDone = true; save(); },

    score: (idea, hurdle) => (d.scores[idea] || {})[hurdle] || null,
    setScore(idea, hurdle, v) {
      const s = d.scores[idea] || (d.scores[idea] = {});
      if (v) s[hurdle] = v; else delete s[hurdle];
      save();
    }
  };
})();
