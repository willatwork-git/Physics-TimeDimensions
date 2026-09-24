/* Chronoscope — header navigation: five groups (Explore · Voyages · Physics · Cosmos · Method), each a
   drop-down menu. Menus are positioned with fixed coordinates so they work inside the phone's scrolling
   nav row. The items are ordinary nav buttons with data-view, so routing (atlas.js) finds them as before. */
(function () {
  const $$ = s => document.querySelectorAll(s);
  let open = null;
  function close() { if (!open) return; open.classList.remove("open"); open.querySelector(".navtop").setAttribute("aria-expanded", "false"); open = null; }
  function show(g) {
    close(); open = g; g.classList.add("open"); g.querySelector(".navtop").setAttribute("aria-expanded", "true");
    const m = g.querySelector(".navmenu"), r = g.querySelector(".navtop").getBoundingClientRect();
    m.style.top = (r.bottom + 6) + "px";
    m.style.left = Math.max(8, Math.min(window.innerWidth - m.offsetWidth - 8, r.left)) + "px";
  }
  $$("nav .navgroup").forEach(g => {
    const top = g.querySelector(".navtop"), menu = g.querySelector(".navmenu");
    if (!menu) return;                                   // single-item groups are plain buttons
    top.addEventListener("click", e => { e.stopPropagation(); open === g ? close() : show(g); });
    menu.addEventListener("click", e => { if (e.target.closest("button[data-view]")) close(); });
  });
  document.addEventListener("click", e => { if (open && !open.contains(e.target)) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  window.addEventListener("resize", close);
  document.querySelector("nav").addEventListener("scroll", close);

  /* Show the current item's name on its group's button, e.g. "Physics · Spacetime". */
  Chrono.navSync = function () {
    $$("nav .navgroup").forEach(g => {
      const top = g.querySelector(".navtop"), menu = g.querySelector(".navmenu");
      if (!menu) { g.classList.toggle("active", top.classList.contains("on")); return; }
      const cur = menu.querySelector("button[data-view].on");
      if (!top.dataset.name) top.dataset.name = top.textContent;
      g.classList.toggle("active", !!cur);
      top.innerHTML = `${top.dataset.name}${cur ? ` <b>· ${cur.firstChild.textContent.trim()}</b>` : ""} <i>▾</i>`;
      const seen = [...menu.querySelectorAll("button[data-view]")].filter(b => b.style.display !== "none"), done = seen.filter(b => b.classList.contains("seen")).length;
      top.title = `${done} of ${seen.length} explored`;
    });
  };
})();
