/* tools/probes/tours.js — every stop of every tour (the UX spec's Phase 4 test list):
   1 · a locked prediction gives nothing away: readout bar hidden; outside the question card, no text shows the right
       option or the start of its explanation;
   2 · each stop's setup is inside its lab's ranges: every slider's value attribute (what the setup asked for) lies
       between its min and max — the browser would silently clamp it otherwise;
   3 · no prediction key is used by two stops (Flatland chapters keep one key whichever tour they're in). */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno} [${location.hash}]`));
try { localStorage.clear(); } catch (e) { }
window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);   // headless runs no frames (see README)
window.cancelAnimationFrame = id => clearTimeout(id);
window.addEventListener("load", () => setTimeout(async () => {
  const W = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s);
  const out = { stops: 0, leaks: [], clamped: [], shared: [], errors: __E }, used = {};
  const vis = el => el && el.offsetParent !== null;
  for (const id of Object.keys(Chrono.STOPS)) {
    for (const [i, s] of Chrono.STOPS[id].stops.entries()) {
      out.stops++;
      const lab = s.href.slice(1).split("/")[0], key = s.href.startsWith("#flatland/") ? s.href.slice(1) : `${lab}:${id}:${i}`;
      Chrono.startTour(i, id); await W(450);
      const info = Chrono.passport.predInfo(key), where = `Tour ${Object.keys(Chrono.STOPS).indexOf(id) + 1} stop ${i + 1} (${s.where})`;
      if (info) {
        (used[key] = used[key] || []).push(where);
        if (Chrono.progress.pred(key).guess === undefined) {       // locked: nothing may give the answer away
          const ro = $(s.href.startsWith("#flatland/") ? "#fl-readouts" : "#lab-readouts");
          if (vis(ro) && ro.textContent.trim()) out.leaks.push(`${where}: readout bar showing "${ro.textContent.trim().slice(0, 40)}"`);
          const aside = $("#aside").cloneNode(true); aside.querySelectorAll(".predict").forEach(n => n.remove());
          const text = [aside.textContent, ...[...document.querySelectorAll("#lab-controls, #fl-controls, #tourbar")].filter(vis).map(n => n.textContent)].join(" ");
          const ans = info.Q.options[info.Q.answer], exp = String(info.Q.explain || "").replace(/<[^>]+>/g, "").slice(0, 50);
          if (ans.length >= 12 && text.includes(ans)) out.leaks.push(`${where}: the answer "${ans}" is on screen`);
          if (exp.length >= 30 && text.includes(exp)) out.leaks.push(`${where}: the explanation shows before a guess`);
        }
      }
      document.querySelectorAll('#lab-controls input[type="range"], #fl-controls input[type="range"]').forEach(r => {
        const v = +r.getAttribute("value");                    // out of range only: a live slider (animation) or a step-rounded value is fine
        if (vis(r) && r.hasAttribute("value") && (v < +r.min - 1e-9 || v > +r.max + 1e-9))
          out.clamped.push(`${where}: slider set to ${r.getAttribute("value")}, outside ${r.min}–${r.max} (shows ${r.value})`);
      });
    }
  }
  Object.entries(used).forEach(([k, w]) => { if (w.length > 1) out.shared.push(`${k}: ${w.join(" and ")}`); });
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify(out); document.body.appendChild(p);
}, 600));
