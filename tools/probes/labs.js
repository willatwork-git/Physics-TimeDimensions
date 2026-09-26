/* tools/probes/labs.js — steps every lab's physics and drawing directly (headless Chrome runs no animation frames
   under simulated time), then tests every mission: it must not pass on arrival, and must complete via "Show me". */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno} [${location.hash || "home"}]${e.error && e.error.stack ? " " + e.error.stack.split("\n").slice(1, 3).map(s => s.trim()).join(" ← ") : ""}`));
try { localStorage.clear(); } catch (e) { }
const W = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s);
window.addEventListener("load", () => setTimeout(async () => {
  const labs = [...new Set([...document.querySelectorAll("header [data-view]")].map(b => b.dataset.view))]
    .filter(id => { const d = Chrono.lab.def(id); return d && d.kind !== "doc"; });
  labs.forEach(id => Chrono.progress.setPred(id, { guess: -1 }));   // skip the predict lock ("Explore freely")
  let sliders = 0, hinted = 0; const rows = []; const noHint = [], tries = [], picks = [], ro = [], stepErr = [], arrival = [], unfinished = []; let missions = 0;
  for (const id of labs) {                                    // physics + drawing, stepped
    location.hash = "#" + id; await W(250);
    const d = Chrono.lab.def(id), cv = $("#lab-canvas");
    const tops = new Set([...document.querySelectorAll("#lab-controls > *")].filter(e => e.offsetParent).map(e => Math.round(e.getBoundingClientRect().top / 8)));   // the lab pattern: controls on one row at desktop width
    if (tops.size > 2) rows.push(`${id} (${tops.size} rows)`);
    document.querySelectorAll("#lab-controls label.ctl").forEach(lb => { if (lb.querySelector('input[type="range"]')) { sliders++; if (lb.querySelector(".hint")) hinted++; else if (!lb.title) noHint.push(`${id}: "${lb.textContent.trim().slice(0, 40)}"`); } });
    try { for (let k = 0; k < 40; k++) { if (d.tick) d.tick(0.05); if (d.draw) Chrono.lab.drawOn(cv, g => d.draw(g)); } }
    catch (e) { stepErr.push(`${id}: ${e.message}`); }
    if (d.readouts) { ro.push(id); try { const r = d.readouts(); if (!Array.isArray(r) || r.length > 3 || r.some(x => !Array.isArray(x) || x.length !== 2 || /undefined|NaN/.test(String(x[1])))) stepErr.push(`${id}: readouts() must give up to 3 [label, value] pairs with real values — got ${JSON.stringify(r)}`); } catch (e) { stepErr.push(`${id} readouts: ${e.message}`); } }
  }
  for (const id of Object.keys(Chrono.MISSIONS || {})) {      // missions
    location.hash = "#home"; await W(100); location.hash = "#" + id; await W(300);
    const d = Chrono.lab.def(id);
    const vis = () => [...document.querySelectorAll("#aside .try")].filter(t => !t.hidden).length, all = () => document.querySelectorAll("#aside .try").length;
    if (vis()) tries.push(`${id}: a Try box shows before its missions are done`);
    for (let m = 0; m < 6; m++) {
      const t = $("#mission .m-title"); if (!t) break;
      const title = t.textContent; missions++;
      for (let k = 0; k < 30; k++) Chrono.missions.tick(d, 0.05);
      if ($("#aside .mission.done")) arrival.push(`${id}: "${title}"`);
      else {
        $("#aside [data-m-show]").click(); await W(80);
        for (let k = 0; k < 1600 && !$("#aside .mission.done"); k++) { if (d.tick) d.tick(0.05); Chrono.missions.tick(d, 0.05); }
        if (!$("#aside .mission.done")) unfinished.push(`${id}: "${title}" — state ${JSON.stringify(d.state && d.state()).slice(0, 160)}`);
      }
      const nx = $("#aside [data-m-next]"); if (!nx) break; nx.click(); await W(80);
    }
    if (all() && vis() !== all()) tries.push(`${id}: Try box still hidden after every mission is done`);
    const want = Chrono.MISSIONS[id].length, dots = document.querySelectorAll("#aside .m-dot"), filled = document.querySelectorAll("#aside .m-dot.done");
    if (dots.length !== want || filled.length !== want) picks.push(`${id}: ${dots.length} circles, ${filled.length} filled, after all ${want} missions`);
    else { dots[0].click(); await W(80); const t = $("#mission .m-title");     // replay the first one
      if (!t || $("#aside .mission.done") || t.textContent !== Chrono.MISSIONS[id][0].title) picks.push(`${id}: picking circle 1 didn't reopen "${Chrono.MISSIONS[id][0].title}"`); }
  }
  const out = document.createElement("pre"); out.id = "RES";
  out.textContent = JSON.stringify({ rows, tries, sliders, hinted, noHint, picks, labs: labs.length, readouts: ro.length, noReadouts: labs.filter(l => !ro.includes(l)), errors: __E, stepErr, missions, arrival, unfinished }); document.body.appendChild(out);
}, 400));
