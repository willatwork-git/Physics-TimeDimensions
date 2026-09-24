/* Chronoscope — header navigation: five groups (Explore · Voyages · Physics · Cosmos · Method), each a
   drop-down menu. Menus are positioned with fixed coordinates so they work inside the phone's scrolling
   nav row. The items are ordinary nav buttons with data-view, so routing (atlas.js) finds them as before. */
(function () {
  const $$ = s => document.querySelectorAll(s);
  let open = null;
  function close() { if (!open) return; open.classList.remove("open"); open.querySelector(".navtop").setAttribute("aria-expanded", "false"); open = null; }
  function show(g) {
    close(); open = g; g.classList.add("open"); g.querySelector(".navtop").setAttribute("aria-expanded", "true");
    const m = g.querySelector(".navmenu"), r = g.querySelector(".navtop").getBoundingClientRect(), narrow = window.innerWidth <= 600;
    m.style.top = (narrow ? document.querySelector("header").getBoundingClientRect().bottom + 4 : r.bottom + 6) + "px";
    m.style.width = narrow ? (window.innerWidth - 16) + "px" : "";
    m.style.maxHeight = (window.innerHeight - parseFloat(m.style.top) - 12) + "px";
    m.style.left = narrow ? "8px" : Math.max(8, Math.min(window.innerWidth - m.offsetWidth - 8, r.left)) + "px";
  }
  /* On a mouse (hover-capable) device menus also open on hover, with a short grace period so the
     pointer can travel from the button into the menu. Click always works (touch, keyboard). */
  const hover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let timer = 0, hoverOpenedAt = 0;
  $$("nav .navgroup").forEach(g => {
    const top = g.querySelector(".navtop"), menu = g.querySelector(".navmenu");
    if (!menu) return;                                   // single-item groups are plain buttons
    top.addEventListener("click", e => { e.stopPropagation(); if (open === g && Date.now() - hoverOpenedAt > 500) close(); else if (open !== g) show(g); });
    menu.addEventListener("click", e => { if (e.target.closest("button[data-view], [data-start-tour]")) close(); });
    if (hover) {
      g.addEventListener("mouseenter", () => { clearTimeout(timer); timer = setTimeout(() => { if (open !== g) { show(g); hoverOpenedAt = Date.now(); } }, open ? 0 : 120); });
      g.addEventListener("mouseleave", () => { clearTimeout(timer); timer = setTimeout(() => { if (open === g) close(); }, 280); });
    }
  });
  $$("nav [data-start-tour]").forEach(b => b.addEventListener("click", () => Chrono.startTour && Chrono.startTour(0, b.dataset.startTour)));
  document.addEventListener("click", e => { if (open && !open.contains(e.target)) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  let lastW = window.innerWidth;   // phones fire resize when the browser toolbar hides — only a real width change closes menus
  window.addEventListener("resize", () => { if (window.innerWidth !== lastW) { lastW = window.innerWidth; close(); } });
  document.querySelector("nav").addEventListener("scroll", close);

  /* Show the current item's name on its group's button, e.g. "Physics · Spacetime". */
  Chrono.navSync = function () {
    $$("nav .navgroup").forEach(g => {
      const top = g.querySelector(".navtop"), menu = g.querySelector(".navmenu");
      if (!menu) { g.classList.toggle("active", top.classList.contains("on")); return; }
      const cur = menu.querySelector("button[data-view].on");
      if (!top.dataset.name) top.dataset.name = top.textContent;
      g.classList.toggle("active", !!cur);
      top.innerHTML = `<span class="nt-name">${top.dataset.name}${cur ? ` <b>· ${cur.firstChild.textContent.trim()}</b>` : ""}</span><span class="nt-chev" aria-hidden="true"><svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
      const seen = [...menu.querySelectorAll("button[data-view]")].filter(b => b.style.display !== "none"), done = seen.filter(b => b.classList.contains("seen")).length;
      top.title = `${done} of ${seen.length} explored`;
    });
  };
})();
