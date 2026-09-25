/* Chronoscope — teacher mode, level 1 (UX spec §Shareable challenges and teacher mode, Phase 4c). No backend.
   A teacher picks a tour or a set of labs and gets a class link: index.html?class=<name>&t=<tour> (or &l=<lab,lab>)&m=1.
   A student who opens it joins the class in their own browser: a class bar shows the route and their progress, and
   gives a short completion code — stops, missions and predictions right, plus a checksum that includes the class
   name. The teacher pastes codes into the checker on #teach. Codes are easy to fake for a determined student;
   that's accepted at this level. Also: a printable prediction worksheet per tour (#worksheet/<tour>).
   Nothing is sent anywhere; no student data leaves the student's browser. */
(function () {
  const $ = s => document.querySelector(s), P = () => Chrono.progress;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cleanName = s => String(s || "").replace(/[^\w \-]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  const tours = () => Object.keys(Chrono.STOPS || {});
  const labIds = () => (Chrono.SCALES || []).flatMap(s => s.labs.map(l => l[0]));
  const labName = id => { const l = (Chrono.SCALES || []).flatMap(s => s.labs).find(x => x[0] === id); return l ? l[1] : id; };

  /* ---------- a class's scope: its stops (or labs), missions and prediction keys ---------- */
  function scope(c) {
    let items, done, labs, keys;
    if (c.t) {
      const T = Chrono.STOPS[c.t]; items = T.stops.length; done = P().tourVisited(c.t).length;
      labs = [...new Set(T.stops.map(s => s.href.slice(1).split("/")[0]))];
      keys = T.stops.map((s, i) => s.href.startsWith("#flatland/") ? s.href.slice(1) : `${s.href.slice(1).split("/")[0]}:${c.t}:${i}`);
    } else {
      labs = c.l; items = labs.length; done = labs.filter(id => P().seen(id)).length;
      keys = labs.flatMap(id => id === "flatland" ? [1, 2, 3, 4, 5, 6, 7].map(n => "flatland/" + n) : [id]);
    }
    keys = keys.filter(k => Chrono.passport.predInfo(k));   // only stops that ask a question
    const ms = labs.flatMap(id => ((Chrono.MISSIONS || {})[id] || []).map(m => P().missionDone(id, m.id)));
    return { items, done, md: ms.filter(Boolean).length, mo: ms.length, pr: keys.filter(k => (Chrono.passport.predResult(k) || {}).right).length, po: keys.length };
  }
  const scopeLabel = c => c.t ? `Tour ${tours().indexOf(c.t) + 1}: ${Chrono.STOPS[c.t].name}` : `${c.l.length} lab${c.l.length === 1 ? "" : "s"}`;

  /* ---------- completion codes: T1-7/7-M11/14-P5/7-K3F (L4-… for a set of labs) ---------- */
  function check(name, body) {                               // FNV-1a over the class name and the code: 3 characters
    let h = 0x811c9dc5; for (const ch of cleanName(name).toLowerCase() + "|" + body) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(36).toUpperCase().slice(-3).padStart(3, "0");
  }
  function code(c) {
    const s = scope(c), body = `${c.t ? "T" + (tours().indexOf(c.t) + 1) : "L" + c.l.length}-${s.done}/${s.items}-M${s.md}/${s.mo}-P${s.pr}/${s.po}`;
    return body + "-" + check(c.name, body);
  }
  const CODE_RE = /([TL]\d+)-(\d+)\/(\d+)-M(\d+)\/(\d+)-P(\d+)\/(\d+)-([0-9A-Z]{3})/i;
  function decode(line, className) {
    const m = String(line).match(CODE_RE); if (!m) return null;
    const who = line.slice(0, m.index).replace(/[:\-–—\s]+$/, "").trim(), body = m[0].slice(0, -4).toUpperCase();
    const T = m[1].toUpperCase(), tourId = T[0] === "T" ? tours()[+T.slice(1) - 1] : null;
    return { who, ok: check(className, body) === m[8].toUpperCase(),
      what: tourId ? `Tour ${T.slice(1)}` : `${T.slice(1)} labs`, stops: `${m[2]}/${m[3]} ${tourId ? "stops" : "labs"}`,
      missions: `${m[4]} of ${m[5]} missions`, preds: `${m[6]}/${m[7]} predictions right`, full: +m[2] === +m[3] };
  }

  /* ---------- joining a class from a link ---------- */
  (function join() {
    const q = new URLSearchParams(location.search), name = cleanName(q.get("class"));
    if (!name) return;
    const t = q.get("t"), l = (q.get("l") || "").split(",").filter(Boolean);
    const c = { name, m: q.get("m") === "1", at: Date.now() };
    if (t && Chrono.STOPS && Chrono.STOPS[t]) c.t = t;
    else { const ok = l.filter(id => labIds().includes(id)); if (!ok.length) return; c.l = ok; }
    P().setCls(c); Chrono.classJoined = true;
    ["class", "t", "l", "m"].forEach(k => q.delete(k));
    try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash); } catch (e) { }
  })();

  /* ---------- the class bar ---------- */
  let codeOpen = false;
  function renderBar() {
    const bar = $("#classbar"), c = P().cls(); if (!bar) return;
    if (!c || !(c.t ? Chrono.STOPS[c.t] : c.l)) { bar.hidden = true; return; }
    const s = scope(c), next = c.t ? Chrono.STOPS[c.t].stops.findIndex((x, i) => !P().tourVisited(c.t).includes(i)) : -1;
    bar.hidden = false;
    bar.innerHTML = `<div class="cb-row"><span class="cb-name">📋 ${esc(c.name)}</span><span class="cb-what">${esc(scopeLabel(c))} · ${s.done} of ${s.items} ${c.t ? "stops" : "labs"}${c.m ? " · missions count" : ""}</span>
      ${c.t && next >= 0 ? `<button class="btn" data-cls-go="${next}">▶ Stop ${next + 1}</button>` : ""}
      <button class="btn${s.done >= s.items ? " primary" : ""}" data-cls-code>${codeOpen ? "Hide my code" : "Get my completion code"}</button>
      <button class="linkish" data-cls-leave title="Stop showing this class. Your progress stays.">leave class</button></div>
      ${c.l ? `<div class="cb-labs">${c.l.map(id => `<a href="#${id}"${P().seen(id) ? ' class="seen"' : ""}>${P().seen(id) ? "✓ " : ""}${esc(labName(id))}</a>`).join("")}</div>` : ""}
      ${codeOpen ? `<div class="cb-code"><code>${code(c)}</code><button class="btn" data-cls-copy>Copy</button>
        <span class="meta">Give this code to your teacher with your name. It shows how far you got — ${s.done} of ${s.items} ${c.t ? "stops" : "labs"}, ${s.md} of ${s.mo} missions, ${s.pr} of ${s.po} predictions right. Nothing is sent anywhere.</span></div>` : ""}`;
    const go = bar.querySelector("[data-cls-go]"); if (go) go.onclick = () => Chrono.startTour && Chrono.startTour(+go.dataset.clsGo, c.t);
    bar.querySelector("[data-cls-code]").onclick = () => { codeOpen = !codeOpen; renderBar(); };
    bar.querySelector("[data-cls-leave]").onclick = () => { P().setCls(null); codeOpen = false; renderBar(); };
    const cp = bar.querySelector("[data-cls-copy]"); if (cp) cp.onclick = () => { try { navigator.clipboard.writeText(code(c)); cp.textContent = "Copied"; } catch (e) { } };
  }
  window.addEventListener("hashchange", () => setTimeout(renderBar, 80));
  window.addEventListener("load", () => setTimeout(() => {
    renderBar();
    const c = P().cls();                                     // arrived by the link: take the student straight onto the route
    if (Chrono.classJoined && c) { if (c.t && Chrono.startTour) Chrono.startTour(Math.max(0, Chrono.STOPS[c.t].stops.findIndex((x, i) => !P().tourVisited(c.t).includes(i))), c.t); else if (c.l) Chrono.nav("#" + c.l[0]); }
  }, 80));

  /* ---------- the For teachers page ---------- */
  let lastClass = "";
  function teachPage() {
    return `<div class="docwrap teach">
      <div class="eyebrow">For teachers</div>
      <h1>Set a route, collect completion codes</h1>
      <p>Pick a tour or a set of labs and share the class link. Each student works in their own browser; at the end they give you a short <b>completion code</b>, which you check below. No accounts, no sign-in, and nothing about your students is sent anywhere.</p>
      <h2 class="sect">1 · Make a class link</h2>
      <div class="tform">
        <label>Class name <input type="text" data-t-name maxlength="40" placeholder="e.g. Year 9 Physics"></label>
        <fieldset><legend>Route</legend>${tours().map((id, i) => `<label class="tch"><input type="radio" name="troute" value="${id}"${i ? "" : " checked"}> Tour ${i + 1}: ${esc(Chrono.STOPS[id].name)} <span class="meta">(${Chrono.STOPS[id].stops.length} stops)</span></label>`).join("")}
          <label class="tch"><input type="radio" name="troute" value="labs"> A set of labs I choose</label>
          <div class="tlabs" data-t-labs hidden>${(Chrono.SCALES || []).map(s => `<div><div class="eyebrow">${s.name}</div>${s.labs.map(([id, n]) => `<label class="tch"><input type="checkbox" value="${id}"> ${esc(n)}</label>`).join("")}</div>`).join("")}</div></fieldset>
        <label class="tch"><input type="checkbox" data-t-missions checked> Missions count (students see "missions count" on their class bar)</label>
        <p><button class="btn primary" data-t-make>Make the class link</button></p>
        <div data-t-out></div>
      </div>
      <h2 class="sect">2 · Check completion codes</h2>
      <p class="meta">Paste the codes, one per line. Put a name first if you like: <code>Sam: T1-7/7-M9/12-P5/6-K3F</code>.</p>
      <div class="tform"><label>Class name (exactly as in the link) <input type="text" data-c-name maxlength="40"></label>
        <textarea data-c-codes rows="6" placeholder="Paste completion codes here"></textarea>
        <p><button class="btn primary" data-c-check>Check</button></p><div data-c-out></div></div>
      <h2 class="sect">3 · Printable worksheets</h2>
      <p>One page per tour: each stop's prediction question with boxes to tick and room to explain — for classes without a device each.</p>
      <p>${tours().map((id, i) => `<a class="btn" href="#worksheet/${id}">🖨 Tour ${i + 1} worksheet</a>`).join(" ")}</p>
      <p class="meta">Honest limit: a determined student could make up a code. This is a light-touch check of who got how far, not an exam.</p>
    </div>`;
  }
  function teachWire() {
    const labsBox = $("[data-t-labs]");
    document.querySelectorAll('input[name="troute"]').forEach(r => r.onchange = () => { labsBox.hidden = r.value !== "labs" || !r.checked; });
    $("[data-c-name]").value = lastClass;
    $("[data-t-make]").onclick = () => {
      const name = cleanName($("[data-t-name]").value), route = document.querySelector('input[name="troute"]:checked').value, out = $("[data-t-out]");
      if (!name) { out.innerHTML = `<p class="meta">Give the class a name first — it's part of every student's code.</p>`; return; }
      const labs = [...document.querySelectorAll("[data-t-labs] input:checked")].map(i => i.value);
      if (route === "labs" && !labs.length) { out.innerHTML = `<p class="meta">Tick at least one lab.</p>`; return; }
      const q = new URLSearchParams({ class: name }); if (route === "labs") q.set("l", labs.join(",")); else q.set("t", route); if ($("[data-t-missions]").checked) q.set("m", "1");
      const url = `${location.origin === "null" ? location.href.split(/[?#]/)[0] : location.origin + location.pathname}?${q}`;
      lastClass = name; $("[data-c-name]").value = name;
      out.innerHTML = `<div class="tlink"><input type="text" readonly value="${esc(url)}" data-t-url><button class="btn" data-t-copy>Copy link</button> <a href="${esc(url)}" target="_blank" rel="noopener">Open it as a student ↗</a></div>`;
      $("[data-t-copy]").onclick = () => { const i = $("[data-t-url]"); i.select(); try { navigator.clipboard.writeText(i.value); $("[data-t-copy]").textContent = "Copied"; } catch (e) { document.execCommand("copy"); } };
    };
    $("[data-c-check]").onclick = () => {
      const name = $("[data-c-name]").value, lines = $("[data-c-codes]").value.split(/\n/).map(x => x.trim()).filter(Boolean), out = $("[data-c-out]");
      if (!cleanName(name)) { out.innerHTML = `<p class="meta">Enter the class name — the codes are checked against it.</p>`; return; }
      out.innerHTML = lines.length ? `<table class="ctable"><tr><th></th><th>Student</th><th>Route</th><th>Progress</th><th>Missions</th><th>Predictions</th></tr>${lines.map(l => { const d = decode(l, name);
        return !d ? `<tr class="bad"><td>?</td><td colspan="5">Not a code: ${esc(l.slice(0, 60))}</td></tr>`
          : `<tr class="${d.ok ? "" : "bad"}"><td>${d.ok ? "✓" : "✗"}</td><td>${esc(d.who || "—")}</td><td>${d.what}</td><td>${d.stops}${d.full ? " ✓" : ""}</td><td>${d.missions}</td><td>${d.preds}</td></tr>`; }).join("")}</table>
        <p class="meta">✗ means the code doesn't match this class name — mistyped, from another class, or made up.</p>` : `<p class="meta">Paste at least one code.</p>`;
    };
  }

  /* ---------- printable worksheet: #worksheet/<tour> ---------- */
  function worksheetPage() {
    const id = (location.hash.split("/")[1] || "").split("?")[0], T = Chrono.STOPS && Chrono.STOPS[id];
    if (!T) return `<div class="docwrap"><p>No such tour. <a href="#teach">Back to For teachers</a></p></div>`;
    const qs = T.stops.map((s, i) => { const k = s.href.startsWith("#flatland/") ? s.href.slice(1) : `${s.href.slice(1).split("/")[0]}:${id}:${i}`, info = Chrono.passport.predInfo(k); return info ? { s, Q: info.Q, i } : null; }).filter(Boolean);
    return `<div class="docwrap worksheet">
      <p class="noprint"><button class="btn primary" onclick="window.print()">🖨 Print this worksheet</button> <a href="#teach">← For teachers</a></p>
      <div class="eyebrow">Chronoscope · Tour ${tours().indexOf(id) + 1}</div>
      <h1>${esc(T.name)} — prediction worksheet</h1>
      <p class="ws-who">Name ______________________ &nbsp; Class ______________ &nbsp; Date __________</p>
      <p>For each question: tick your prediction <b>before</b> you try the lab, and say why. Then run it and see.</p>
      ${qs.map((x, n) => `<div class="ws-q"><div class="eyebrow">${n + 1} · ${esc(x.s.where)}</div><p><b>${x.Q.q.replace(/<[^>]+>/g, "")}</b></p>
        <ul>${x.Q.options.map(o => `<li>☐ ${esc(o)}</li>`).join("")}</ul><p class="ws-why">Why do you think so?</p><div class="ws-lines"></div><p class="ws-why">What happened when you tried it?</p><div class="ws-lines short"></div></div>`).join("")}
      <p class="meta">chronoscope · ${esc(location.origin === "null" ? "" : location.origin + location.pathname)}</p>
    </div>`;
  }

  Chrono.teach = { code, decode, scope, renderBar };
  Chrono.lab.register({ id: "teach", kind: "doc", title: "For teachers", eyebrow: "Guide", tier: "none", page: teachPage, wire: teachWire,
    aside: () => `<p><b>How it works.</b> The class link carries only the route and the class name. Each student's progress stays in their own browser; the completion code is the only thing they hand back.</p>
      <p>Codes look like <code>T1-7/7-M9/12-P5/6-K3F</code>: tour 1, 7 of 7 stops, 9 of 12 missions, 5 of 6 predictions right, and a check on the class name.</p>` });
  Chrono.lab.register({ id: "worksheet", kind: "doc", title: "Worksheet", eyebrow: "For teachers", tier: "none", page: worksheetPage,
    aside: () => `<p>Print this page, or save it as a PDF from the print dialog. The side panel, menus and buttons are left off the printout.</p>` });
})();
