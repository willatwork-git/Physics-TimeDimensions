/* tools/probes/views.js — injected before the app's scripts. Visits every header [data-view], every tour stop and
   every tour quiz; records JS errors and lab canvases left blank. Writes JSON into <pre id="RES">. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno} [${location.hash || "home"}]${e.error && e.error.stack ? " " + e.error.stack.split("\n").slice(1, 3).map(s => s.trim()).join(" ← ") : ""}`));
try { localStorage.clear(); } catch (e) { }
/* Headless Chrome under simulated time runs no animation frames, so a canvas would never be drawn and the blank check
   would test nothing. Timers do run: drive requestAnimationFrame from one, so the app's real frame loops draw. */
window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
window.cancelAnimationFrame = id => clearTimeout(id);
const drawn = () => {                                         // null when no lab or Flatland canvas is showing
  const fl = document.querySelector("#flatland"), onFl = fl && fl.offsetParent !== null;
  const c = document.querySelector(onFl ? "#fl-canvas" : "#lab-canvas"), lab = document.querySelector("#lab");
  if (!c || !c.width || (!onFl && (!lab || lab.style.display !== "flex"))) return null;
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, bg = [1, 3, 5].map(k => parseInt(Chrono.C.bg.substr(k, 2), 16)); let n = 0;   // pixels that differ from the stage colour
  for (let i = 0; i < d.length; i += 4 * 37) if (d[i + 3] > 0 && Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 30) n++;   // painted, and not just the stage colour (a never-drawn canvas is transparent)
  return n;
};
window.addEventListener("load", () => {
  const views = new Set([...document.querySelectorAll("header [data-view]")].map(b => b.dataset.view));
  ["concepts/quantum", "concepts/timetravel", "review/puzzle", "review/zoom", "review/time", "atlas/H5", "worksheet/puzzle", "worksheet/time", ...[1, 2, 3, 4, 5, 6, 7].map(n => "flatland/" + n)].forEach(v => views.add(v));   // deep routes
  Object.entries(Chrono.STOPS || {}).forEach(([id, T]) => { views.add("review/" + id); T.stops.forEach(s => views.add(s.href.slice(1))); });
  const list = [...views], blank = [], moved = []; let i = 0;
  let retried = false;
  const step = () => {
    if (i > 0 && drawn() === 0) {                            // a resize just cleared it? look once more before calling it blank
      if (!retried) { retried = true; setTimeout(step, 400); return; }
      blank.push(list[i - 1]);
    }
    retried = false;
    const v0 = list[i - 1] && list[i - 1].split("/")[0], btn = v0 && document.querySelector(`header button[data-view="${v0}"]`), hidden = btn && btn.dataset.tier && !Chrono.shows(btn.dataset.tier);   // Workbench-only views are meant to redirect in Learn
    if (i > 0 && !hidden && decodeURIComponent(location.hash.slice(1)).split("/")[0] !== v0) moved.push(`${list[i - 1]} → ${location.hash}`);   // redirected elsewhere
    if (i < list.length) { location.hash = list[i++]; setTimeout(step, 350); return; }
    const out = document.createElement("pre"); out.id = "RES"; out.textContent = JSON.stringify({ views: list.length, errors: __E, blank, moved }); document.body.appendChild(out);
  };
  step();
});
