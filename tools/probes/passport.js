/* tools/probes/passport.js — the Passport's logic (Phase 4a): save/load round trip, a bad file refused without harm,
   prediction scoring (a lab's own question and a tour stop's), tour stamps dated only for a full tour, the header bar. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`));
try { localStorage.clear(); } catch (e) { }
window.addEventListener("load", () => setTimeout(async () => {
  const W = ms => new Promise(r => setTimeout(r, ms)), P = Chrono.progress, bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  const clocks = Chrono.lab.def("clocks").predict, river = Chrono.lab.def("river").predict;
  P.visit("clocks"); P.visit("river"); P.visit("atlas");
  P.setPred("clocks", { guess: clocks.answer, checked: true });                       // right
  P.setPred("river", { guess: (river.answer + 1) % river.options.length, checked: true }); // wrong
  P.setPred("mars", { guess: -1 });                                                    // skipped
  const tour = Object.keys(Chrono.STOPS).find(id => Chrono.STOPS[id].stops.some(s => s.predict && s.predict.answer !== undefined));
  const si = Chrono.STOPS[tour].stops.findIndex(s => s.predict && s.predict.answer !== undefined), st = Chrono.STOPS[tour].stops[si];
  P.setPred(`${st.href.slice(1).split("/")[0]}:${tour}:${si}`, { guess: st.predict.answer, checked: true });   // a stop's own question, right
  let r = Chrono.passport.predRecord();
  ok(r.made === 3 && r.right === 2 && r.skipped === 1 && r.missed.length === 1 && r.missed[0].href === "#river", `prediction record ${JSON.stringify({ made: r.made, right: r.right, skipped: r.skipped, missed: r.missed.map(m => m.href) })}, expected 3 made · 2 right · 1 skipped · missed #river`);
  P.setTour(0, "zoom"); P.finishTour(Chrono.STOPS.zoom.stops.length);                  // jumped to the end: no stamp
  ok(!P.tourDone("zoom") && !P.tourDoneAt("zoom"), "a tour finished without visiting every stop got a stamp");
  P.setTour(0, "puzzle"); Chrono.STOPS.puzzle.stops.forEach((s, i) => P.tourVisit("puzzle", i)); P.finishTour(Chrono.STOPS.puzzle.stops.length);
  ok(P.tourDone("puzzle") && P.tourDoneAt("puzzle") > Date.now() - 60000, "a full tour didn't get a dated stamp");
  const saved = P.exportAll();
  P.visit("expand"); ok(P.seen("expand"), "visit not recorded");
  let refused = false; try { P.importAll('{"hello":1}'); } catch (e) { refused = true; }
  ok(refused && P.seen("expand"), "a non-passport file was accepted, or it damaged the progress");
  P.importAll(saved);
  ok(!P.seen("expand") && P.seen("clocks") && P.tourDone("puzzle") && Chrono.passport.predRecord().right === 2, "loading a saved passport didn't restore it exactly");
  const keep = P.exportAll();                                                          // a stale "done" flag from an old build, no stops visited
  P.importAll(JSON.stringify({ app: "chronoscope", v: 1, data: { seen: {}, pred: {}, scores: {}, rev: {}, quiz: {}, done: { time: true } } }));
  ok(!P.tourDone("time"), "a stored done flag with no stops visited still counts as done (the old-build badge bug)");
  P.importAll(keep);
  location.hash = "#passport"; await W(400);
  ok(document.querySelector(".stamp.on") && document.querySelectorAll(".stamp").length === Object.keys(Chrono.STOPS).length, "passport page: stamps missing");
  Chrono.passport.update(); const n = document.querySelector("#progbar .pb-n").textContent, ex = Chrono.passport.explored();
  ok(n.startsWith(`${ex.n} / ${ex.of}`) && ex.n === 3, `header bar says "${n}", expected ${ex.n} / ${ex.of} with 3 explored`);
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify({ bad, errors: __E }); document.body.appendChild(p);
}, 400));
