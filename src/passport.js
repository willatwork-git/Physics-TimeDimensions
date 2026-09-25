/* Chronoscope — the Passport (UX spec §Progress, Phase 4a): everything the visitor has done, in one place, and a
   thin progress bar in the header that opens it. Tour stamps (dated), each scale's labs (✓ visited, ★ per mission),
   the prediction record (right, missed — each missed one links back), review questions due, and Save / Load as a
   file. Everything is read from progress.js; nothing is stored here and nothing is sent anywhere. */
(function () {
  const $ = s => document.querySelector(s);
  const P = () => Chrono.progress;
  const TOUR_LOOK = { puzzle: ["🧩", "var(--physics)"], zoom: ["🚀", "var(--voyages)"], time: ["⏳", "var(--cosmos)"] };
  const DOCS = [["story", "How it all fits together"], ["atlas", "The Atlas"], ["bench", "Test bench"], ["concepts", "Concepts"], ["sure", "How sure are we?"], ["review", "Quizzes and review"]];
  const fmtDate = t => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

  /* ---------- counts ---------- */
  const explored = () => { const T = Chrono.TOTAL || []; return { n: T.filter(v => P().seen(v)).length, of: T.length }; };
  function missionCount() {
    let n = 0, of = 0;
    Object.entries(Chrono.MISSIONS || {}).forEach(([lab, list]) => list.forEach(m => { of++; if (P().missionDone(lab, m.id)) n++; }));
    return { n, of };
  }
  /* A prediction key is a lab id, "lab:tour:stop" (a tour's own framing) or "flatland/N". Resolve it to its question. */
  function predInfo(key) {
    const [lab, tour, i] = key.split(":");
    if (tour !== undefined) {
      const T = Chrono.STOPS && Chrono.STOPS[tour], stop = T && T.stops[+i], def = Chrono.lab.def(lab);
      if (!stop) return null;
      const Q = stop.predict !== undefined ? stop.predict : def && def.predict;
      return Q ? { Q, where: `${stop.where} · Tour ${Object.keys(Chrono.STOPS).indexOf(tour) + 1}`, href: stop.href } : null;
    }
    if (key.startsWith("flatland/")) { const n = +key.split("/")[1], Q = Chrono.flatland && Chrono.flatland.predictFor(n); return Q ? { Q, where: `Flatland, chapter ${n}`, href: "#" + key } : null; }
    const def = Chrono.lab.def(key); return def && def.predict ? { Q: def.predict, where: def.title, href: "#" + key } : null;
  }
  function predRecord() {
    const out = { made: 0, right: 0, skipped: 0, missed: [] };
    Object.entries(P().preds()).forEach(([k, g]) => {
      if (g.guess === undefined) return;
      if (g.guess < 0) { out.skipped++; return; }
      const info = predInfo(k); if (!info || info.Q.answer === undefined) return;
      out.made++;
      if (g.guess === info.Q.answer) out.right++;
      else out.missed.push({ ...info, guess: info.Q.options[g.guess], answer: info.Q.options[info.Q.answer] });
    });
    return out;
  }

  /* ---------- the page ---------- */
  function stamp(id, i) {
    const T = Chrono.STOPS[id], [icon, col] = TOUR_LOOK[id] || ["★", "var(--accent)"], done = P().tourDone(id), at = P().tourDoneAt(id);
    const seen = P().tourVisited(id).length, n = T.stops.length;
    return `<div class="stamp${done ? " on" : ""}" style="--sc:${col}">
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="st-ring"/><circle cx="60" cy="60" r="45" class="st-inner"/>
        <text x="60" y="72" text-anchor="middle" class="st-icon">${icon}</text></svg>
      <div><div class="eyebrow">Tour ${i + 1}</div><b>${T.name}</b>
        <span class="meta">${done ? `Stamped${at ? " · " + fmtDate(at) : ""}` : seen ? `${seen} of ${n} stops — finish every stop to earn the stamp` : "Not started"}</span></div></div>`;
  }
  function scaleCard(sc) {
    return `<div class="scale" style="--sc:${sc.col}"><div class="eyebrow">${sc.sub}</div><h3>${sc.name}</h3><div class="pp-labs">${sc.labs.map(([id, name]) => {
      const list = (Chrono.MISSIONS || {})[id] || [], stars = list.map(m => P().missionDone(id, m.id) ? "★" : "☆").join("");
      return `<a class="pp-lab${P().seen(id) ? " seen" : ""}" href="#${id}">${P().seen(id) ? "✓ " : ""}${name}${stars ? ` <i title="missions">${stars}</i>` : ""}</a>`; }).join("")}</div></div>`;
  }
  function page() {
    const ex = explored(), ms = missionCount(), pr = predRecord(), due = Chrono.reviewDue ? Chrono.reviewDue() : 0;
    const tours = Object.keys(Chrono.STOPS || {}), stamped = tours.filter(id => P().tourDone(id)).length;
    return `<div class="docwrap passport">
      <div class="eyebrow">Your passport</div>
      <h1>Where you've been in Chronoscope</h1>
      <p class="meta">Kept in this browser only — nothing is sent anywhere. Save it to a file to move it to another device.</p>
      <div class="pp-sum">
        <div><b>${ex.n}<i>/${ex.of}</i></b><span>explored</span></div>
        <div><b>${stamped}<i>/${tours.length}</i></b><span>tour stamps</span></div>
        <div><b>${ms.n}<i>/${ms.of}</i></b><span>missions</span></div>
        <div><b>${pr.right}<i>/${pr.made}</i></b><span>predictions right</span></div>
      </div>
      <h2 class="sect">Tour stamps</h2>
      <div class="stamps">${tours.map(stamp).join("")}</div>
      <h2 class="sect">By scale</h2>
      <div class="scales">${(Chrono.SCALES || []).map(scaleCard).join("")}</div>
      <div class="pp-labs pp-docs"><span class="eyebrow">Guides and maps</span>${DOCS.map(([id, n]) => `<a class="pp-lab${P().seen(id) ? " seen" : ""}" href="#${id}">${P().seen(id) ? "✓ " : ""}${n}</a>`).join("")}</div>
      <h2 class="sect">Your predictions</h2>
      ${pr.made || pr.skipped ? `<p>${pr.made} prediction${pr.made === 1 ? "" : "s"} · <b>${pr.right} right</b>${pr.skipped ? ` · ${pr.skipped} skipped` : ""}. Getting one wrong is the point: the surprise is what makes it stick.</p>` : `<p class="meta">None yet — each lab starts with a question to guess before you explore.</p>`}
      ${pr.missed.length ? `<div class="pp-missed"><div class="eyebrow">The ones that surprised you — worth another look</div>${pr.missed.map(m => `<a href="${m.href}"><b>${m.where}</b><span>You guessed “${m.guess}” · it's “${m.answer}”</span></a>`).join("")}</div>` : ""}
      <h2 class="sect">Review</h2>
      <p>${due ? `<a class="btn primary" href="#review">${due} question${due === 1 ? "" : "s"} ready · about a minute →</a>` : `<span class="meta">Nothing due. Questions from labs you've explored come back after 1, 3, 7, 16, 35 and 80 days.</span>`}</p>
      <h2 class="sect">Keep it</h2>
      <p><button class="btn" data-pp-save>⤓ Save my passport</button> <button class="btn" data-pp-load>⤒ Load a passport</button><input type="file" accept="application/json,.json" data-pp-file hidden></p>
      <p class="meta" data-pp-msg></p>
    </div>`;
  }
  function wire() {
    const msg = t => { const m = $("[data-pp-msg]"); if (m) m.textContent = t; };
    const sv = $("[data-pp-save]"); if (sv) sv.onclick = () => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([P().exportAll()], { type: "application/json" }));
      a.download = `chronoscope-passport-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove();
      msg("Saved. Load that file on any device to carry on where you left off.");
    };
    const f = $("[data-pp-file]"), ld = $("[data-pp-load]");
    if (ld && f) { ld.onclick = () => f.click(); f.onchange = () => { const file = f.files[0]; if (!file) return;
      file.text().then(t => { try { P().importAll(t); $("#doc").innerHTML = page(); wire(); update(); msg("Passport loaded."); } catch (e) { msg(e.message || "That file couldn't be read."); } }); }; }
  }

  /* ---------- the header bar: a thin line of progress; tap it for the passport ---------- */
  function update() {
    const bar = $("#progbar"); if (!bar || !Chrono.TOTAL) return;
    const ex = explored(), pct = ex.of ? Math.round(ex.n / ex.of * 100) : 0, label = `${ex.n} / ${ex.of}`;
    bar.querySelector("i").style.width = pct + "%"; bar.querySelector(".pb-n").textContent = label + " ›";
    bar.title = `Your passport: ${ex.n} of ${ex.of} explored`; bar.setAttribute("aria-label", bar.title);
  }
  window.addEventListener("hashchange", () => setTimeout(update, 60));
  window.addEventListener("load", () => setTimeout(update, 60));

  Chrono.passport = { update, predRecord, missionCount, explored };
  Chrono.lab.register({
    id: "passport", kind: "doc", title: "Your passport", eyebrow: "Progress", tier: "none",
    page, wire,
    aside: () => `<p>Your passport fills in as you go: a <b>stamp</b> for each tour you finish, a ✓ for every lab you open, a ★ for each mission.</p>
      <p>Predictions you got wrong are listed with a link back — they're the ones most worth a second look.</p>
      <p class="meta">Stored only in this browser. Clearing site data erases it, so save a copy if it matters to you.</p>`
  });
})();
