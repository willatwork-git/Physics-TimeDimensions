/* tools/probes/teach.js — teacher mode end to end (Phase 4c, the spec's "done when"): class link → the student's
   completion code → the teacher's checker. Opened as index.html?class=Year 9 Physics&t=puzzle&m=1. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`));
try { localStorage.clear(); } catch (e) { }
window.addEventListener("load", () => setTimeout(async () => {
  const W = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s), P = Chrono.progress, bad = [], ok = (c, m) => { if (!c) bad.push(m); };
  const c = P.cls();
  ok(c && c.name === "Year 9 Physics" && c.t === "puzzle" && c.m === true, "didn't join the class from the link: " + JSON.stringify(c));
  ok(!/class=/.test(location.search), "class parameters left in the address bar");
  ok(location.hash === Chrono.STOPS.puzzle.stops[0].href, "not taken to stop 1 (at " + location.hash + ")");
  ok($("#classbar") && !$("#classbar").hidden && /Year 9 Physics/.test($("#classbar").textContent), "class bar not showing");
  const stops = Chrono.STOPS.puzzle.stops;                    // the student works through the tour
  stops.forEach((s, i) => P.tourVisit("puzzle", i));
  const keys = stops.map((s, i) => s.href.startsWith("#flatland/") ? s.href.slice(1) : `${s.href.slice(1).split("/")[0]}:puzzle:${i}`).filter(k => Chrono.passport.predInfo(k));
  keys.forEach((k, j) => { const Q = Chrono.passport.predInfo(k).Q; P.setPred(k, { guess: j % 2 ? (Q.answer + 1) % Q.options.length : Q.answer, checked: true }); });
  const right = keys.filter((k, j) => j % 2 === 0).length;
  const labs = [...new Set(stops.map(s => s.href.slice(1).split("/")[0]))], ms = labs.flatMap(id => (Chrono.MISSIONS[id] || []).map(m => [id, m.id]));
  ms.slice(0, 3).forEach(([id, m]) => P.setMissionDone(id, m));
  const code = Chrono.teach.code(P.cls()), want = `T1-${stops.length}/${stops.length}-M${Math.min(3, ms.length)}/${ms.length}-P${right}/${keys.length}`;
  ok(code.startsWith(want + "-"), `code ${code}, expected ${want}-…`);
  const d = Chrono.teach.decode("Sam: " + code, "Year 9 Physics");
  ok(d && d.ok && d.who === "Sam" && d.full && d.preds === `${right}/${keys.length} predictions right`, "checker didn't decode the code: " + JSON.stringify(d));
  ok(!Chrono.teach.decode(code, "Year 10 Physics").ok, "a code checked against another class name passed");
  const tampered = code.replace(/P(\d+)\//, (m, n) => `P${(+n + 1) % 10}/`);
  ok(!Chrono.teach.decode(tampered, "Year 9 Physics").ok, "an altered code passed");
  const L = Chrono.teach.code({ name: "Lab set", l: ["clocks", "river"] }), dl = Chrono.teach.decode(L, "Lab set");
  ok(/^L2-/.test(L) && dl && dl.ok, "a lab-set code didn't round-trip: " + L);
  $("#classbar [data-cls-code]").click(); await W(100);
  ok($("#classbar .cb-code code") && $("#classbar .cb-code code").textContent === code, "the class bar doesn't show the code");
  location.hash = "#teach"; await W(400);                    // the teacher builds a link
  $("[data-t-name]").value = "Year 9 Physics"; $("[data-t-make]").click(); await W(100);
  const url = ($("[data-t-url]") || {}).value || "";
  ok(/\?class=Year\+9\+Physics&t=puzzle&m=1$/.test(url), "teacher's link is " + url);
  location.hash = "#worksheet/puzzle"; await W(400);
  ok(document.querySelectorAll(".worksheet .ws-q").length === keys.length, `worksheet has ${document.querySelectorAll(".worksheet .ws-q").length} questions, the tour asks ${keys.length}`);
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify({ bad, errors: __E, code }); document.body.appendChild(p);
}, 700));
