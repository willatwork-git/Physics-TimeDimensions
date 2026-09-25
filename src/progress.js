/* Chronoscope — the visitor's own progress: views seen, predictions made, tour position, their own
   test-bench scores, review schedule and quiz scores. Stored in this browser only (localStorage); nothing is sent anywhere.
   Every read and write survives blocked storage — the app then simply forgets between visits. */
(function () {
  const KEY = "chronoscope.progress.v1";
  let d = {};
  try { d = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { d = {}; }
  ["seen", "pred", "scores", "rev", "quiz"].forEach(k => { if (!d[k] || typeof d[k] !== "object") d[k] = {}; });
  const DAY = 864e5, LADDER = [1, 3, 7, 16, 35, 80];     // review intervals, in days
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { } };

  Chrono.progress = {
    visit(key) { if (!d.seen[key]) { d.seen[key] = 1; save(); } },
    seen: key => !!d.seen[key],
    last: () => typeof d.last === "string" ? d.last : null,
    setLast(hash) { if (d.last !== hash) { d.last = hash; save(); } },
    clearLast() { delete d.last; save(); },

    pred: id => d.pred[id] || {},
    setPred(id, p) { d.pred[id] = p; save(); },

    /* one tour runs at a time: d.tour = stop index, d.tourId = which tour; d.done = { tourId: true } */
    tour: () => Number.isInteger(d.tour) ? d.tour : null,
    tourId: () => typeof d.tourId === "string" ? d.tourId : "puzzle",
    setTour(i, id) { d.tour = i; if (id) d.tourId = id; save(); },
    tourDone: id => !!(d.done && d.done[id || "puzzle"]) || (!id || id === "puzzle") && !!d.tourDone,
    /* d.tv[tourId] = stop indices visited in that tour. A tour is "done" only when every stop was visited;
       jumping to the last stop and finishing just records reaching the finale (d.fin). */
    tourVisit(id, i) { d.tv = d.tv || {}; const a = d.tv[id] || (d.tv[id] = []); if (!a.includes(i)) { a.push(i); save(); } },
    tourVisited: id => (d.tv && d.tv[id]) || [],
    tourFinale: id => !!(d.fin && d.fin[id]),
    finishTour(n) { const id = Chrono.progress.tourId(), all = n && Chrono.progress.tourVisited(id).length >= n;
      if (all) { d.done = d.done || {}; d.done[id] = true; } else { d.fin = d.fin || {}; d.fin[id] = true; }
      d.tour = null; save(); return all; },

    /* review (D-037): d.rev[key] = { lv, due } — due is a timestamp; a right answer moves up the ladder */
    rev: k => d.rev[k] || null,
    revQueue: () => Object.keys(d.rev),
    revDue: () => Object.keys(d.rev).filter(k => d.rev[k].due <= Date.now()).sort((a, b) => d.rev[a].due - d.rev[b].due),
    revSeed(k) { if (!d.rev[k]) { d.rev[k] = { lv: 0, due: Date.now() + DAY }; save(); } },
    revAnswer(k, right) {
      const r = d.rev[k] || { lv: 0 }, lv = right ? Math.min(r.lv + 1, LADDER.length - 1) : 0;
      d.rev[k] = { lv, due: Date.now() + (right ? LADDER[lv] : 1) * DAY }; save();
    },
    /* missions (D-044): d.ms[lab] = ids done */
    missionDone: (lab, id) => !!(d.ms && d.ms[lab] && d.ms[lab].includes(id)),
    setMissionDone(lab, id) { d.ms = d.ms || {}; const a = d.ms[lab] || (d.ms[lab] = []); if (!a.includes(id)) { a.push(id); save(); } },
    missionReset(lab) { if (d.ms) { delete d.ms[lab]; save(); } },
    missionCount: () => d.ms ? Object.values(d.ms).reduce((n, a) => n + a.length, 0) : 0,
    quiz: id => d.quiz[id] || null,
    setQuiz(id, got, n) { const q = d.quiz[id] || { best: 0 }; d.quiz[id] = { best: Math.max(q.best, got), last: got, n }; save(); },

    score: (idea, hurdle) => (d.scores[idea] || {})[hurdle] || null,
    setScore(idea, hurdle, v) {
      const s = d.scores[idea] || (d.scores[idea] = {});
      if (v) s[hurdle] = v; else delete s[hurdle];
      save();
    }
  };
})();
