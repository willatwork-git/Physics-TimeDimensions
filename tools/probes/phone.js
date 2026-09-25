/* tools/probes/phone.js — runs inside a 390 × 844 frame (a real phone width: headless Chrome won't make a window
   narrower than ~485 px). Walks every lab and Flatland chapter, unlocked, and measures what a phone user would hit:
   sideways overflow, the header's three menus out of line, a squeezed stage, a blank canvas, and canvas text that
   runs off the canvas edge (fillText is wrapped to record each label's extent). Result JSON goes into <pre id="RES">. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno} [${location.hash}]`));
try { localStorage.clear(); } catch (e) { }
window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);   // headless runs no frames (see README)
window.cancelAnimationFrame = id => clearTimeout(id);
const clipped = new Map();
let texts = [], lastFrame = [];                           // text boxes of the frame being drawn, and of the last whole frame
const fr = CanvasRenderingContext2D.prototype.fillRect;
CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) {
  if (!x && !y && this.canvas.id && w >= this.canvas.clientWidth - 1) { lastFrame = texts; texts = []; }
  return fr.call(this, x, y, w, h);
};
const fill = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (txt, x, y, ...rest) {
  try {
    const cv = this.canvas, W = cv.clientWidth, w = this.measureText(txt).width, t = this.getTransform(), dpr = window.devicePixelRatio || 1;
    const X = (t.a * x + t.e) / dpr, al = this.textAlign, x0 = al === "center" ? X - w / 2 : al === "right" || al === "end" ? X - w : X;
    const size = parseFloat(this.font) || 10;
    if (cv.id && String(txt).trim()) texts.push({ t: String(txt), x0, x1: x0 + w, y0: (t.d * y + t.f) / dpr - size * 0.75, y1: (t.d * y + t.f) / dpr + size * 0.1 });
    if (W && cv.id && (x0 < -2 || x0 + w > W + 2) && String(txt).trim().length > 1) {
      const k = location.hash + " " + String(txt).replace(/[\d.,]+/g, "#").slice(0, 48), over = Math.round(Math.max(-x0, x0 + w - W)); if ((clipped.get(k) || 0) < over) clipped.set(k, over);   // one entry per label, numbers ignored
    }
  } catch (e) { }
  return fill.call(this, txt, x, y, ...rest);
};
window.addEventListener("load", () => setTimeout(async () => {
  const W8 = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s);
  const labs = [...new Set([...document.querySelectorAll("header [data-view]")].map(b => b.dataset.view))].filter(id => { const d = Chrono.lab.def(id); return d && d.kind !== "doc"; });
  const routes = labs.concat([1, 2, 3, 4, 5, 6, 7].map(n => "flatland/" + n));
  routes.forEach(r => Chrono.progress.setPred(r, { guess: -1 })); Chrono.progress.visit("flatland/1");
  const out = { routes: routes.length, overflow: [], header: [], small: [], blank: [], overlap: [], errors: __E };
  for (const r of routes) {
    location.hash = "#home"; await W8(60); location.hash = "#" + r; await W8(700);
    const L = lastFrame, seen = new Set();
    for (let a = 0; a < L.length; a++) for (let b = a + 1; b < L.length; b++) {
      const p = L[a], q = L[b], ox = Math.min(p.x1, q.x1) - Math.max(p.x0, q.x0), oy = Math.min(p.y1, q.y1) - Math.max(p.y0, q.y0);
      if (ox > 3 && oy > 3 && p.t !== q.t) { const k = `${r}: "${p.t.slice(0, 24)}" on "${q.t.slice(0, 24)}"`; if (!seen.has(k)) { seen.add(k); out.overlap.push(k); } }
    }
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw + 1) {
      const wide = [...document.querySelectorAll("body *")].filter(e => e.offsetParent && e.getBoundingClientRect().right > vw + 1 && !e.closest(".navmenu, nav"))
        .filter((e, _, a) => !a.includes(e.parentElement)).slice(0, 2).map(e => e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
      out.overflow.push(`${r}: ${document.documentElement.scrollWidth} px wide (${wide.join(", ")})`);
    }
    const tops = [".g-tours .navtop", ".g-explore .navtop", ".g-guide .navtop"].map(s => $(s)).filter(Boolean).map(e => Math.round(e.getBoundingClientRect().top));
    if (tops.length === 3 && Math.max(...tops) - Math.min(...tops) > 4) out.header.push(`${r}: menus at ${tops.join("/")} px`);
    const wrap = $(r.startsWith("flatland") ? "#fl-canvas-wrap" : "#lab-canvas-wrap"), h = wrap ? Math.round(wrap.getBoundingClientRect().height) : 0;
    if (h < 260) out.small.push(`${r}: stage ${h} px tall`);
    const c = $(r.startsWith("flatland") ? "#fl-canvas" : "#lab-canvas");
    const inked = () => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, bg = [1, 3, 5].map(k => parseInt(Chrono.C.bg.substr(k, 2), 16)); let n = 0;
      for (let i = 0; i < d.length; i += 4 * 37) if (d[i + 3] > 0 && Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 30) n++;
      return n; };
    if (c && c.width && !inked()) { await W8(300); if (!inked()) out.blank.push(r); }   // a resize clears the canvas until the next frame: look twice
  }
  location.hash = "#atlas"; await W8(700);                  // the Atlas on a phone: the holes as a tappable list
  const hl = document.querySelectorAll("#aside .holelist .hl");
  if (!hl.length) out.atlas = ["no hole list on a phone"];
  else { hl[0].click(); await W8(400); if (!/^#atlas\/H\d/.test(location.hash)) out.atlas = [`tapping "${hl[0].textContent.slice(0, 30)}" went to ${location.hash}`]; }
  out.holes = hl.length;
  out.clipped = [...clipped].map(([k, px]) => `${k}… (${px} px over)`);
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify(out); document.body.appendChild(p);
}, 400));
