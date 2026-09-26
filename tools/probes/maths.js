/* tools/probes/maths.js — the maths pages' worked examples are the tests (D-057). For every example: put the lab in
   its setup, read the lab's own state(), compare with the value on the page (from the equation or the published
   figure). Also: each covered lab links to its page, and each page renders its examples. */
window.__E = []; window.addEventListener("error", e => __E.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`));
try { localStorage.clear(); } catch (e) { }
window.addEventListener("load", () => setTimeout(async () => {
  const W = ms => new Promise(r => setTimeout(r, ms)), out = { n: 0, bad: [], errors: __E };
  for (const [id, M] of Object.entries(Chrono.MATHS)) {
    Chrono.progress.setPred(id, { guess: -1 }); location.hash = "#" + (id === "flatland" ? "flatland/1" : id); await W(300);
    const d = Chrono.lab.def(id);
    if (!document.querySelector(`#aside a[href="#maths/${id}"]`)) out.bad.push(`${id}: no "The maths behind this lab" link`);
    for (const x of M.examples) {
      out.n++;
      try { const got = x.run ? x.run(d) : (d.applySetup(x.setup), x.read(d.state()));   // run: the example drives the lab itself (orbits, Flatland)
        const ok = typeof x.expect === "string" ? got === x.expect : Math.abs(got - x.expect) <= x.tol;
        if (!ok) out.bad.push(`${id} · ${x.what}: the lab gives ${got}, the page says ${x.expect} (± ${x.tol}; ${x.from})`); }
      catch (e) { out.bad.push(`${id} · ${x.what}: ${e.message}`); }
    }
    location.hash = "#maths/" + id; await W(250);
    const rows = document.querySelectorAll(".maths .mt tr").length;
    if (rows < M.examples.length + M.consts.length) out.bad.push(`#maths/${id}: page shows ${rows} table rows, expected at least ${M.examples.length}`);
  }
  const labs = [...new Set([...document.querySelectorAll("header [data-view]")].map(b => b.dataset.view))].filter(v => { const d = Chrono.lab.def(v); return d && d.kind !== "doc"; }).concat(["flatland"]);
  labs.filter(v => !Chrono.MATHS[v]).forEach(v => out.bad.push(`${v}: no entry in src/maths.js — every lab needs one (DESIGN.md → the lab pattern)`));
  out.labs = labs.length;
  const p = document.createElement("pre"); p.id = "RES"; p.textContent = JSON.stringify(out); document.body.appendChild(p);
}, 500));
