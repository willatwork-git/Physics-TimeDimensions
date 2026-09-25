/* tools/probes/challenge.js — challenge links (Phase 4b). Opened as index.html?c=clocks&g=0#clocks (or a bad link):
   reports what the visitor sees before and after guessing, and what links the app builds. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`));
try { localStorage.clear(); } catch (e) { }
window.addEventListener("load", () => setTimeout(async () => {
  const W = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s), out = { errors: __E };
  out.search = location.search; out.challenge = Chrono.challenge;
  const f1 = $("#aside .pfriend"); out.before = f1 ? f1.textContent.trim() : null;
  const opt = Chrono.lab.def("clocks").predict.options; out.opt0 = opt[0];
  const b = $('#aside [data-guess="1"]'); if (b) { b.click(); await W(150); const c = $("#aside [data-pcheck]"); if (c) { c.click(); await W(150); } }
  const f2 = $("#aside .pfriend"); out.after = f2 ? f2.textContent.trim() : null; out.share = !!$("#aside [data-pshare]");
  out.link = Chrono.challengeLink("clocks", 1);
  const tour = Object.keys(Chrono.STOPS).find(id => Chrono.STOPS[id].stops.some(s => s.predict)), i = Chrono.STOPS[tour].stops.findIndex(s => s.predict);
  out.ownQuestionLink = Chrono.challengeLink(`${Chrono.STOPS[tour].stops[i].href.slice(1)}:${tour}:${i}`, 0);
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify(out); document.body.appendChild(p);
}, 500));
