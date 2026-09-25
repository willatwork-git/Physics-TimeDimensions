/* tools/probes/views.js — injected before the app's scripts. Visits every header [data-view], every tour stop and
   every tour quiz; records JS errors and lab canvases left blank. Writes JSON into <pre id="RES">. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`));
try { localStorage.clear(); } catch (e) { }
const drawn = () => {                                         // null when no lab canvas is showing
  const c = document.querySelector("#lab-canvas"), lab = document.querySelector("#lab");
  if (!c || !lab || lab.style.display !== "flex" || !c.width) return null;
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0;
  for (let i = 0; i < d.length; i += 4 * 37) if (Math.abs(d[i] - 11) + Math.abs(d[i + 1] - 13) + Math.abs(d[i + 2] - 18) > 30) n++;
  return n;
};
window.addEventListener("load", () => {
  const views = new Set([...document.querySelectorAll("header [data-view]")].map(b => b.dataset.view));
  ["concepts/quantum", "concepts/timetravel", "review/puzzle", "review/zoom", "review/time", "flatland/7", "atlas/H5"].forEach(v => views.add(v));   // deep routes
  Object.entries(Chrono.STOPS || {}).forEach(([id, T]) => { views.add("review/" + id); T.stops.forEach(s => views.add(s.href.slice(1))); });
  const list = [...views], blank = []; let i = 0;
  const step = () => {
    if (i > 0 && drawn() === 0) blank.push(list[i - 1]);
    if (i < list.length) { location.hash = list[i++]; setTimeout(step, 350); return; }
    const out = document.createElement("pre"); out.id = "RES"; out.textContent = JSON.stringify({ views: list.length, errors: __E, blank }); document.body.appendChild(out);
  };
  step();
});
