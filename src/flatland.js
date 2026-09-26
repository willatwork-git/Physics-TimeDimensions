/* Chronoscope — Flatland tab.
   Seven chapters: Meet A Square · The Sphere visits · Building up dimensions · Our turn (4D) · Hypercone · Tesseract · Time as a slice.
   Geometry is exact (slices, projections, ray casting); the story is Abbott's 1884 analogy. */
(function () {
  const F = Chrono.flatland = {};
  const TAU = Math.PI * 2;
  const C = {
    bg: "#151924", panel: "#12151d", line: "#232836", text: "#e6e8ee", muted: "#8a90a2",
    accent: "#7cc4ff", pink: "#e36bd0", violet: "#9b8cff", teal: "#4fd1a5", amber: "#f2c94c", orange: "#ff7a59"
  };
  let canvas, ctx, W = 0, H = 0, raf = 0, active = false, chapter = 0, last = 0;
  const $ = s => document.querySelector(s);

  /* ---------- shared state ---------- */
  const st = {
    sq: { x: -1, y: -1.5, dir: 0.9 }, scan: true, dragging: false,
    sphereZ: 3.2, sphereR: 3, spherePlay: true, sphereV: -1, sphereXY: { x: 2.5, y: 1.5 },
    yaw: -0.6, pitch: 0.55,
    ladderN: 3, ladderT: 1, reveal: {},
    hyper: "sphere", w: 0.9, hyperPlay: true, hyperV: -1, rot: { xw: true, yw: false, zw: false, xy: true }, ang: 0,
    now: 0.3, nowPlay: true, nowV: 1,
    coneTh: 0, conePlay: true, coneV: 1, coneYaw: 0,
    tessMode: "slice", orient: "corner", tessPlay: true, tessD: -1, tessV: 1, tessYaw: 0.4
  };

  /* ---------- Flatland world ---------- */
  function regular(cx, cy, r, n, rot = 0) {
    const p = [];
    for (let i = 0; i < n; i++) { const a = rot + i * TAU / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }
  const WORLD = [
    { name: "house", color: C.amber, pts: regular(-6, 4.5, 2.3, 5, -Math.PI / 2), items: [[-6.4, 4.2], [-5.5, 5.1], [-6, 3.6]] },
    { name: "house", color: C.amber, pts: regular(5.5, 5, 2.1, 5, -Math.PI / 2), items: [[5.2, 5.3], [6, 4.6]] },
    { name: "house", color: C.amber, pts: regular(-5, -5.5, 2.2, 5, -Math.PI / 2), items: [[-5.3, -5.2], [-4.6, -6]] },
    { name: "triangle", color: C.orange, pts: regular(1.5, 6.5, 0.9, 3, 0.4) },
    { name: "hexagon", color: C.teal, pts: regular(-8, -0.5, 0.9, 6, 0.2) },
    { name: "circle", color: C.violet, pts: regular(4, -6.5, 0.9, 24) },
    { name: "pentagon", color: C.pink, pts: regular(7.5, -1, 0.9, 5, 0.3) }
  ];
  function squarePts(s) { return regular(s.x, s.y, 0.75, 4, s.dir + Math.PI / 4); }

  function castRays(eye, dir, fov, n, obstacles) {
    const out = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = dir - fov / 2 + fov * (i + 0.5) / n;
      const dx = Math.cos(a), dy = Math.sin(a);
      let best = Infinity, col = null;
      for (const o of obstacles) {
        const p = o.pts;
        for (let k = 0; k < p.length; k++) {
          const A = p[k], B = p[(k + 1) % p.length];
          const ex = B[0] - A[0], ey = B[1] - A[1];
          const den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-9) continue;
          const ax = A[0] - eye[0], ay = A[1] - eye[1];
          const t = (ax * ey - ay * ex) / den;
          const u = (ax * dy - ay * dx) / den;
          if (t > 0.02 && u >= 0 && u <= 1 && t < best) { best = t; col = o.color; }
        }
      }
      out[i] = { d: best, color: col };
    }
    return out;
  }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
  }

  /* ---------- drawing helpers ---------- */
  function label(txt, x, y, color = C.muted, size = 11, align = "left", font = "JetBrains Mono, monospace") {
    ctx.fillStyle = color; ctx.font = `${size}px ${font}`; ctx.textAlign = align;
    const room = align === "center" ? 2 * Math.min(x, W - x) - 8 : align === "right" ? x - 4 : W - x - 4, w = ctx.measureText(txt).width;
    if (W && room > 0 && w > room) ctx.font = `${Math.max(8, Math.floor(size * room / w))}px ${font}`;   // narrow screens: shrink to fit, not below 8 px
    ctx.fillText(txt, x, y);
  }
  function panel(x, y, w, h, title) {                     // a surface, not a border (3b), same as the labs
    ctx.fillStyle = "rgba(255,255,255,0.025)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 10) : ctx.rect(x, y, w, h); ctx.fill();
    if (title) label(Chrono.capsTitle ? Chrono.capsTitle(title) : title.toUpperCase(), x + 12, y + 20, C.muted, 10);
  }
  function poly(pts, map, fill, stroke, lw = 1.5) {
    ctx.beginPath();
    pts.forEach((p, i) => { const q = map(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }

  // top view of Flatland in a box; returns mapper
  function topView(x, y, w, h, extra, opts = {}) {
    const s = Math.min(w, h) / 23, cx = x + w / 2, cy = y + h / 2;
    const map = p => [cx + p[0] * s, cy - p[1] * s];
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (let g = -11; g <= 11; g += 2) { const a = map([g, -11]), b = map([g, 11]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); const c = map([-11, g]), d = map([11, g]); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke(); }
    // view wedge
    const e = eyeOf(st.sq), fov = 1.9;
    ctx.fillStyle = "rgba(124,196,255,0.06)";
    ctx.beginPath(); const e0 = map(e); ctx.moveTo(e0[0], e0[1]);
    for (let i = 0; i <= 20; i++) { const a = st.sq.dir - fov / 2 + fov * i / 20; const q = map([e[0] + 14 * Math.cos(a), e[1] + 14 * Math.sin(a)]); ctx.lineTo(q[0], q[1]); }
    ctx.closePath(); ctx.fill();
    WORLD.forEach(o => {
      poly(o.pts, map, shade(o.color, 0.18), o.color);
      (o.items || []).forEach(it => { const q = map(it); ctx.fillStyle = C.muted; ctx.fillRect(q[0] - 2, q[1] - 2, 4, 4); });
    });
    (extra || []).forEach(o => poly(o.pts, map, o.fill || shade(o.color, 0.3), o.color, 2));
    poly(squarePts(st.sq), map, shade(C.accent, 0.35), C.accent, 2);
    const q = map(e); ctx.fillStyle = C.text; ctx.beginPath(); ctx.arc(q[0], q[1], 2.5, 0, TAU); ctx.fill();
    ctx.restore();
    return map;
  }
  function eyeOf(s) { return [s.x + 0.53 * Math.cos(s.dir), s.y + 0.53 * Math.sin(s.dir)]; }

  function eyeStrip(x, y, w, h, extra) {
    const n = Math.max(120, Math.floor(w / 3));
    const rays = castRays(eyeOf(st.sq), st.sq.dir, 1.9, n, WORLD.concat(extra || []));
    ctx.fillStyle = "#050608"; ctx.fillRect(x, y, w, h);
    const cw = w / n;
    rays.forEach((r, i) => {
      if (!r.color) return;
      const k = Math.exp(-r.d / 7);
      ctx.fillStyle = shade(r.color, 0.15 + 0.85 * k);
      ctx.fillRect(x + (n - 1 - i) * cw, y, cw + 0.6, h);
    });
    ctx.strokeStyle = C.line; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
  }

  /* ---------- 3D helpers (orthographic, yaw + pitch) ---------- */
  function proj(p, cx, cy, s) {
    const [x, y, z] = p, a = st.yaw, b = st.pitch;
    const xr = x * Math.cos(a) - y * Math.sin(a), yr = x * Math.sin(a) + y * Math.cos(a);
    return [cx + s * xr, cy - s * (z * Math.cos(b) - yr * Math.sin(b)), yr * Math.cos(b) + z * Math.sin(b)];
  }
  function ellipseAt(cx3, cy3, z, r, CX, CY, s, fill, stroke, lw = 1) {
    const c = proj([cx3, cy3, z], CX, CY, s);
    ctx.beginPath(); ctx.ellipse(c[0], c[1], r * s, r * s * Math.sin(st.pitch), 0, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }
  function drawPlane(CX, CY, s, L, alpha, withWorld) {
    const corners = [[-L, -L, 0], [L, -L, 0], [L, L, 0], [-L, L, 0]].map(p => proj(p, CX, CY, s));
    ctx.beginPath(); corners.forEach((c, i) => i ? ctx.lineTo(c[0], c[1]) : ctx.moveTo(c[0], c[1])); ctx.closePath();
    ctx.fillStyle = `rgba(23,27,37,${alpha})`; ctx.fill(); ctx.strokeStyle = C.line; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let g = -L; g <= L; g += 2) {
      [[[g, -L, 0], [g, L, 0]], [[-L, g, 0], [L, g, 0]]].forEach(([a, b]) => { const p = proj(a, CX, CY, s), q = proj(b, CX, CY, s); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); });
    }
    if (withWorld) {
      const m = p => proj([p[0], p[1], 0], CX, CY, s);
      WORLD.forEach(o => poly(o.pts, m, shade(o.color, 0.25), o.color, 1));
      poly(squarePts(st.sq), m, shade(C.accent, 0.4), C.accent, 1.5);
    }
  }

  /* Two-pane layout: side by side on wide screens, stacked (A on top) on tall ones such as phones.
     frac = pane A's share of the width (or height when stacked). */
  function split(frac) {
    const pad = 16;
    if (H <= W * 1.05) { const aw = Math.floor((W - pad * 3) * frac); return { stacked: false, A: { x: pad, y: pad, w: aw, h: H - pad * 2 }, B: { x: pad * 2 + aw, y: pad, w: W - pad * 3 - aw, h: H - pad * 2 } }; }
    const ah = Math.floor((H - pad * 3) * Math.max(frac, 0.55));
    return { stacked: true, A: { x: pad, y: pad, w: W - pad * 2, h: ah }, B: { x: pad, y: pad * 2 + ah, w: W - pad * 2, h: H - pad * 3 - ah } };
  }

  /* ---------- chapters ---------- */
  const CH = [];

  // 1 — Meet A Square
  CH.push({
    title: "Meet A Square",
    controls() {
      return `<label class="ctl"><input type="checkbox" id="c-scan" ${st.scan ? "checked" : ""}> Look around</label>
              <label class="ctl">Gaze <input type="range" id="c-dir" min="0" max="628" value="${Math.round(((st.sq.dir % TAU) + TAU) % TAU * 100)}"></label>
              <span class="ctl">Drag in the map to move A Square</span>`;
    },
    wire() {
      $("#c-scan").onchange = e => st.scan = e.target.checked;
      $("#c-dir").oninput = e => { st.scan = false; $("#c-scan").checked = false; st.sq.dir = e.target.value / 100; };
    },
    tick(dt) { if (st.scan) st.sq.dir += dt * 0.35; },
    draw() {
      const stripH = 70, pad = 16;
      const mapH = H - stripH - pad * 4 - 20;
      panel(pad, pad, W - pad * 2, mapH + 30, "Flatland from above — your view");
      this.map = topView(pad, pad + 30, W - pad * 2, mapH, null);
      this.box = [pad, pad + 30, W - pad * 2, mapH];
      label("WHAT A SQUARE SEES — ALL OF IT", pad, H - stripH - pad - 10, C.accent, 10);
      eyeStrip(pad, H - stripH - pad, W - pad * 2, stripH);
    },
    aside: `
      <p>Edwin Abbott's <i>Flatland: A Romance of Many Dimensions</i> (1884) is narrated by <b>A Square</b>, who lives on a flat plane. Houses are pentagons; people are polygons.</p>
      <p>From above, you see everything at once: every shape, every house — even what's <i>inside</i> the houses (the small dots). A Square sees none of that.</p>
      <p>His whole visual world is the strip at the bottom: <b>a single line</b>. He judges distance only by how faint things are in the fog — Abbott's own idea.</p>
      <div class="try"><b>Try:</b> drag A Square toward a house and watch its segment in the strip grow and brighten. Turn off "Look around" and use the gaze slider.</div>
      <p class="meta">Notice: you can see inside a closed house. To him, a closed shape is perfectly sealed. Sagan used this to show what a being with one more dimension could do — see inside, reach inside, without breaking a wall.</p>`
  });

  // 2 — The Sphere visits
  CH.push({
    title: "The Sphere visits",
    controls() {
      return `<button class="btn" id="c-play">${st.spherePlay ? "Pause" : "Play"}</button>
              <label class="ctl">Sphere height <input type="range" id="c-z" min="-450" max="450" value="${Math.round(st.sphereZ * 100)}"><output id="o-z">${st.sphereZ.toFixed(1)}</output></label>
              <span class="ctl">Drag the 3D view to turn it</span>`;
    },
    wire() {
      $("#c-play").onclick = e => { st.spherePlay = !st.spherePlay; e.target.textContent = st.spherePlay ? "Pause" : "Play"; };
      $("#c-z").oninput = e => { st.spherePlay = false; $("#c-play").textContent = "Play"; st.sphereZ = e.target.value / 100; };
    },
    tick(dt) {
      if (st.spherePlay) { st.sphereZ += st.sphereV * dt * 1.1; if (st.sphereZ < -4.5) { st.sphereZ = -4.5; st.sphereV = 1; } if (st.sphereZ > 4.5) { st.sphereZ = 4.5; st.sphereV = -1; } }
      const o = $("#o-z"); if (o) { o.textContent = st.sphereZ.toFixed(1); $("#c-z").value = Math.round(st.sphereZ * 100); }
    },
    slice() {
      const R = st.sphereR, z = st.sphereZ;
      if (Math.abs(z) >= R) return [];
      const r = Math.sqrt(R * R - z * z);
      return [{ pts: regular(st.sphereXY.x, st.sphereXY.y, r, 40), color: C.accent, fill: "rgba(124,196,255,0.25)" }];
    },
    draw() {
      const { A, B } = split(0.55), stripH = 60;
      panel(A.x, A.y, A.w, A.h, "Our view — 3D");
      ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y, A.w, A.h); ctx.clip();
      const CX = A.x + A.w / 2, CY = A.y + A.h * 0.58, s = Math.min(A.w, A.h) / 34;
      this.box3d = [A.x, A.y, A.w, A.h];
      const R = st.sphereR, z0 = st.sphereZ, sx = st.sphereXY.x, sy = st.sphereXY.y;
      const N = 36, slices = [];
      for (let i = 0; i <= N; i++) { const z = -R + 2 * R * i / N; slices.push(z); }
      const drawSlice = (z, dim) => {
        const r = Math.sqrt(Math.max(0, R * R - z * z));
        const k = 0.35 + 0.65 * (z + R) / (2 * R);
        ellipseAt(sx, sy, z0 + z, r, CX, CY, s, shade(C.accent, (dim ? 0.25 : 0.5) * k), null);
        ellipseAt(sx, sy, z0 + z, r, CX, CY, s, null, `rgba(124,196,255,${dim ? 0.12 : 0.3})`, 0.7);
      };
      slices.filter(z => z0 + z < 0).forEach(z => drawSlice(z, true));
      drawPlane(CX, CY, s, 11, 0.82, true);
      slices.filter(z => z0 + z >= 0).forEach(z => drawSlice(z, false));
      if (Math.abs(z0) < R) {
        const r = Math.sqrt(R * R - z0 * z0);
        ellipseAt(sx, sy, 0, r, CX, CY, s, null, C.text, 2.2);
      }
      ctx.restore();
      label("FLATLAND (THE PLANE)", A.x + 14, A.y + A.h - 14, C.muted, 10);

      const rx = B.x, rightW = B.w, top = B.y, mapH = B.h - stripH - 70;
      panel(rx, top, rightW, mapH + 30, "Flatland from above");
      topView(rx, top + 30, rightW, mapH, this.slice());
      label("WHAT A SQUARE SEES", rx, top + mapH + 56, C.accent, 10);
      eyeStrip(rx, top + mapH + 64, rightW, stripH, this.slice());
      const rr = Math.abs(z0) < R ? Math.sqrt(R * R - z0 * z0) : 0;
      label(`slice radius √(R² − z²) = ${rr.toFixed(2)}`, rx + rightW, top + mapH + 56, C.muted, 10, "right");
    },
    aside: `
      <p>A <b>Sphere</b> from Spaceland visits. It passes through the plane — and to A Square, something impossible happens.</p>
      <p>A point appears from nowhere, grows into a circle, shrinks, and vanishes. He only ever sees the <b>slice</b> where the Sphere meets his plane. In his strip, it's just a segment that swells and fades.</p>
      <blockquote>"Upward, not Northward." — A Square, trying to describe the third dimension (<i>Flatland</i>, 1884)</blockquote>
      <p>The Sphere is one object throughout. What changes is only <i>which slice</i> meets Flatland. The slice's radius is exact: √(R² − z²).</p>
      <div class="try"><b>Try:</b> pause and drag the height slider. Then look only at the strip on the right, and imagine explaining "a sphere" using nothing but that.</div>
      <p class="meta">Carl Sagan performed this with an apple in <i>Cosmos</i>, episode 10, "The Edge of Forever" (1980).</p>`
  });

  // 3 — Building up dimensions
  const DIRS = [[1, 0], [0, -1], [0.55, -0.42], [-0.42, -0.62], [0.62, 0.34]];
  const NAMES = ["Point", "Line", "Square", "Cube", "Tesseract", "Penteract (5D)"];
  const choose = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; };
  CH.push({
    title: "Building up dimensions",
    controls() {
      return `<button class="btn" id="c-dn">− dimension</button><button class="btn primary" id="c-up">+ dimension</button>
              <span class="ctl">Each step drags the whole shape in a brand-new direction</span>`;
    },
    wire() {
      $("#c-up").onclick = () => { if (st.ladderN < 5) { st.ladderN++; st.ladderT = 0; renderAside(); } };
      $("#c-dn").onclick = () => { if (st.ladderN > 0) { st.ladderN--; st.ladderT = 1; renderAside(); } };
    },
    tick(dt) { st.ladderT = Math.min(1, st.ladderT + dt * 0.8); },
    draw() {
      const pad = 16; panel(pad, pad, W - pad * 2, H - pad * 2, `${NAMES[st.ladderN]} · ${st.ladderN}D`);
      const n = st.ladderN, s = Math.min(W, H) / 4.2;
      const verts = [];
      for (let m = 0; m < (1 << n); m++) {
        let x = 0, y = 0;
        for (let k = 0; k < n; k++) if (m & (1 << k)) { const f = k === n - 1 ? easeInOut(st.ladderT) : 1; x += DIRS[k][0] * f; y += DIRS[k][1] * f; }
        verts.push([x, y]);
      }
      let mx = 0, my = 0; verts.forEach(v => { mx += v[0]; my += v[1]; }); mx /= verts.length; my /= verts.length;
      const P = v => [W / 2 + (v[0] - mx) * s, H / 2 + (v[1] - my) * s];
      const colors = [C.accent, C.teal, C.amber, C.pink, C.violet];
      for (let a = 0; a < verts.length; a++) for (let k = 0; k < n; k++) {
        const b = a ^ (1 << k); if (b < a) continue;
        const p = P(verts[a]), q = P(verts[b]);
        ctx.strokeStyle = colors[k]; ctx.globalAlpha = k === n - 1 ? 0.95 : 0.55; ctx.lineWidth = k === n - 1 ? 2 : 1.4;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      verts.forEach(v => { const p = P(v); ctx.fillStyle = C.text; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, TAU); ctx.fill(); });
      // legend of directions
      for (let k = 0; k < n; k++) { ctx.fillStyle = colors[k]; ctx.fillRect(pad + 14, H - pad - 22 - (n - 1 - k) * 16, 18, 3); label(`direction ${k + 1}`, pad + 38, H - pad - 18 - (n - 1 - k) * 16, C.muted, 10); }
      if (n >= 4) label("Shadow on your flat screen: the 'inner cube' is not inside — it's displaced along a direction you can't point to.", W / 2, H - pad - 12, C.muted, 11, "center", "Inter, sans-serif");
    },
    asideFn() {
      const rows = [0, 1, 2, 3, 4, 5].map(n => {
        const vals = [1 << n, n * (1 << Math.max(0, n - 1)) * (n ? 1 : 0), n >= 2 ? choose(n, 2) * (1 << (n - 2)) : 0, n >= 3 ? choose(n, 3) * (1 << (n - 3)) : 0];
        const cells = vals.map((v, i) => {
          const key = n + "-" + i;
          return (n >= 4 && !st.reveal[key]) ? `<td><span class="hidden-val" data-rev="${key}">?</span></td>` : `<td>${v}</td>`;
        }).join("");
        return `<tr class="${n === st.ladderN ? "cur" : ""}"><td>${n}D ${NAMES[n].split(" ")[0]}</td>${cells}</tr>`;
      }).join("");
      return `
        <p>This is the step-by-step trick from the TED-Ed lesson <i>"Exploring other dimensions"</i> (Alex Rosenthal &amp; George Zaidan).</p>
        <p>Drag a <b>point</b> → a line. Drag the line sideways → a square. Drag the square in a new direction → a cube. Drag the cube in a direction <i>perpendicular to all three</i> → a <b>tesseract</b>.</p>
        <p>We can't point in that fourth direction. But we can still count — and the pattern keeps working.</p>
        <table class="counts"><tr><th>Shape</th><th>Corners</th><th>Edges</th><th>Squares</th><th>Cubes</th></tr>${rows}</table>
        <div class="try"><b>Try:</b> predict the 4D and 5D numbers before clicking the <b>?</b>s. Hint: every step doubles the old shape and joins each old corner to its copy.</div>
        <p class="meta">Maths can describe any number of dimensions with ease. The difficulty is only in our imagination — which is the point of this whole section.</p>`;
    }
  });
  function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  // 4 — Our turn: a 4D visitor (hypersphere, drawn in "squashed 4D space")
  function drawStackedSphere(CX, CY, s, sx, sy, z0, R, color, planeFn) {
    const N = 36, zs = [];
    for (let i = 0; i <= N; i++) zs.push(-R + 2 * R * i / N);
    const one = (z, dim) => {
      const r = Math.sqrt(Math.max(0, R * R - z * z)), k = 0.35 + 0.65 * (z + R) / (2 * R);
      ellipseAt(sx, sy, z0 + z, r, CX, CY, s, shade(color, (dim ? 0.25 : 0.5) * k), null);
      ellipseAt(sx, sy, z0 + z, r, CX, CY, s, null, dim ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.16)", 0.7);
    };
    zs.filter(z => z0 + z < 0).forEach(z => one(z, true));
    planeFn();
    zs.filter(z => z0 + z >= 0).forEach(z => one(z, false));
    if (Math.abs(z0) < R) ellipseAt(sx, sy, 0, Math.sqrt(R * R - z0 * z0), CX, CY, s, null, C.text, 2.2);
  }
  function shadedBall(cx, cy, r, color) {
    const g = ctx.createRadialGradient(cx - r * .35, cy - r * .35, r * .05, cx, cy, r);
    g.addColorStop(0, "#ffffff"); g.addColorStop(.35, color); g.addColorStop(1, shade(color, 0.18));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  }
  CH.push({
    title: "Our turn: a 4D visitor",
    controls() {
      return `<button class="btn" id="c-play">${st.hyperPlay ? "Pause" : "Play"}</button>
              <label class="ctl">Position along w <input type="range" id="c-w" min="-100" max="100" value="${Math.round(st.w * 100)}"><output id="o-w">${st.w.toFixed(2)}</output></label>
              <span class="ctl">Drag the left view to turn it</span>`;
    },
    wire() {
      $("#c-play").onclick = e => { st.hyperPlay = !st.hyperPlay; e.target.textContent = st.hyperPlay ? "Pause" : "Play"; };
      $("#c-w").oninput = e => { st.hyperPlay = false; $("#c-play").textContent = "Play"; st.w = e.target.value / 100; };
    },
    tick(dt) {
      if (st.hyperPlay) { st.w += st.hyperV * dt * 0.25; if (st.w < -1) { st.w = -1; st.hyperV = 1; } if (st.w > 1) { st.w = 1; st.hyperV = -1; } }
      const o = $("#o-w"); if (o) { o.textContent = st.w.toFixed(2); $("#c-w").value = Math.round(st.w * 100); }
    },
    draw() {
      const { A, B } = split(0.55);
      panel(A.x, A.y, A.w, A.h, "4D space — each flat sheet is a whole 3D space, squashed");
      this.box3d = [A.x, A.y, A.w, A.h];
      ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y, A.w, A.h); ctx.clip();
      const CX = A.x + A.w / 2, CY = A.y + A.h * 0.6, s = Math.min(A.w, A.h) / 34, R = 3, c = st.w * 4.5;
      [-4.5, 4.5].forEach(z => { const a = [[-9, -9, z], [9, -9, z], [9, 9, z], [-9, 9, z]].map(p => proj(p, CX, CY, s)); ctx.beginPath(); a.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.stroke(); });
      drawStackedSphere(CX, CY, s, 0, 0, c, R, C.pink, () => {
        drawPlane(CX, CY, s, 9, 0.82, false);
        const e = proj([0, 0, 0], CX, CY, s); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(e[0] + 5.5 * s, e[1] + 2.2 * s, 5, 0, TAU); ctx.fill();
      });
      const a0 = proj([-9, -9, -5], CX, CY, s), a1 = proj([-9, -9, 5.5], CX, CY, s);
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
      label("w", a1[0] - 6, a1[1] - 6, C.text, 12);
      const pl = proj([9, -9, 0], CX, CY, s); label("w = 0 · our whole 3D world", pl[0] - 6, pl[1] + 18, C.accent, 10, "right");
      ctx.restore();

      panel(B.x, B.y, B.w, B.h, "What we would see — the 3D slice");
      const r = Math.sqrt(Math.max(0, R * R - c * c)) / R, bx = B.x + B.w / 2, by = B.y + B.h * 0.45, BR = Math.min(B.w, B.h) * 0.3;
      if (r > 0.01) { shadedBall(bx, by, r * BR, C.pink); ctx.strokeStyle = "rgba(227,107,208,0.25)"; ctx.beginPath(); ctx.arc(bx, by, BR, 0, TAU); ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]); }
      else label("nothing — it's 'beside' our space", bx, by, C.muted, 12, "center", "Inter, sans-serif");
      label(`slice radius = √(R² − w²) = ${(r).toFixed(2)} R`, bx, B.y + B.h - 34, C.text, 12, "center");
      label("dashed ring: the hypersphere's full radius R", bx, B.y + B.h - 14, C.muted, 10, "center");
    },
    aside: `
      <p>Now <b>we</b> are the Flatlanders. On the left, our entire 3D world is squashed into one flat sheet so there's room to draw a fourth direction, <b>w</b>, going up. Every sheet stacked along w is a whole 3D space.</p>
      <p>We live on the <b>w = 0</b> sheet (the blue dot is us). A <b>hypersphere</b> — a 4D ball — drifts down the w axis and crosses our sheet.</p>
      <p>What we'd see, on the right: a point appearing from nowhere, swelling into a sphere, shrinking, vanishing. Watching how fast it grows and shrinks is how we'd "see" its roundness in the fourth direction — exactly as a Flatlander could infer a sphere's roundness from a circle's changing radius.</p>
      <div class="try"><b>Try:</b> compare with chapter 2 side by side. The picture on the left is <i>the same drawing</i>, relabelled. That's the whole trick of reasoning by analogy.</div>
      <p class="note"><b>Important for our question:</b> here w is a fourth direction of <i>space</i>. Time is different — it enters the equations with the opposite sign. Chapter 7 shows time as the stacking direction instead.</p>
      <p class="meta">The "squashed 3D + w axis" drawing follows a popular 4D visualisation video (link in Sources).</p>`
  });

  // 5 — Hypercone: 3D conic sections
  const CONE_PRESETS = { sphere: 0, ellipsoid: 28, paraboloid: 45, hyperboloid: 62 };
  function coneShape(th) { if (th < 0.5) return "sphere"; if (Math.abs(th - 45) < 0.6) return "paraboloid"; return th < 45 ? "ellipsoid" : "hyperboloid"; }
  CH.push({
    title: "Hypercone: 3D conics",
    controls() {
      return `${Object.keys(CONE_PRESETS).map(k => `<button class="btn" data-cone="${k}">${k}</button>`).join("")}
              <label class="ctl">Tilt of our slice <input type="range" id="c-th" min="0" max="75" step="0.5" value="${st.coneTh}"><output id="o-th">${st.coneTh}°</output></label>
              <button class="btn" id="c-play">${st.conePlay ? "Pause" : "Sweep"}</button>`;
    },
    wire() {
      document.querySelectorAll("[data-cone]").forEach(b => b.onclick = () => { st.conePlay = false; $("#c-play").textContent = "Sweep"; st.coneTh = CONE_PRESETS[b.dataset.cone]; });
      $("#c-th").oninput = e => { st.conePlay = false; $("#c-play").textContent = "Sweep"; st.coneTh = +e.target.value; };
      $("#c-play").onclick = e => { st.conePlay = !st.conePlay; e.target.textContent = st.conePlay ? "Pause" : "Sweep"; };
    },
    tick(dt) {
      if (st.conePlay) { st.coneTh += st.coneV * dt * 9; if (st.coneTh > 75) { st.coneTh = 75; st.coneV = -1; } if (st.coneTh < 0) { st.coneTh = 0; st.coneV = 1; } }
      st.coneYaw += dt * 0.25;
      const o = $("#o-th"); if (o) { o.textContent = st.coneTh.toFixed(1) + "°"; $("#c-th").value = st.coneTh; }
    },
    // radius of the 3D slice at position s along its axis: x²+y² = (s·sinθ + d)² − s²·cos²θ, one nappe (w ≥ 0)
    rho(s, th, d) { const w = s * Math.sin(th) + d; if (w < 0) return NaN; const q = w * w - s * s * Math.cos(th) * Math.cos(th); return q >= 0 ? Math.sqrt(q) : NaN; },
    draw() {
      const { A, B, stacked } = split(0.6), rw = B.w;
      const th = st.coneTh * Math.PI / 180, d = 2, L = 7, RMAX = 5.5;
      const name = coneShape(st.coneTh), col = { sphere: C.accent, ellipsoid: C.teal, paraboloid: C.amber, hyperboloid: C.orange }[name];
      panel(A.x, A.y, A.w, A.h, `The 3D slice we would see: ${name}`);
      this.box3d = [A.x, A.y, A.w, A.h];
      ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y, A.w, A.h); ctx.clip();
      const CX = A.x + A.w / 2, CY = A.y + A.h / 2, sc = Math.min(A.w, A.h) / 18;
      const save = [st.yaw, st.pitch]; st.yaw = 0.5 + 0.35 * Math.sin(st.coneYaw); st.pitch = 0.35;
      const P = (s, a, r) => proj([s, r * Math.cos(a), r * Math.sin(a)], CX, CY, sc);
      const S = [];
      for (let i = 0; i <= 270; i++) { const s = -L + 2 * L * i / 270, r = this.rho(s, th, d); S.push({ s, r: (isNaN(r) || r > RMAX) ? NaN : r }); }
      ctx.lineWidth = 1;
      S.forEach((o, i) => { if (isNaN(o.r) || i % 9) return; ctx.strokeStyle = shade(col, 0.55); ctx.beginPath(); for (let k = 0; k <= 40; k++) { const q = P(o.s, TAU * k / 40, o.r); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); });
      for (let m = 0; m < 12; m++) { const a = TAU * m / 12; ctx.strokeStyle = col; ctx.globalAlpha = 0.8; ctx.beginPath(); let on = false; S.forEach(o => { if (isNaN(o.r)) { on = false; return; } const q = P(o.s, a, o.r); on ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); on = true; }); ctx.stroke(); }
      ctx.globalAlpha = 1; [st.yaw, st.pitch] = save; ctx.restore();

      /* stacked: analog and pattern side by side under the 3D view (tablets) or one above the other (phones) */
      const side = stacked && B.w >= 520, tight = stacked && !side;
      const rx = B.x, top = B.y, aw = side ? Math.floor((B.w - 16) / 2) : rw, ih = side ? B.h : tight ? Math.floor((B.h - 12) * 0.55) : Math.min(rw, (B.h - 30) / 2);
      panel(rx, top, aw, ih, "Flatland analog: slice a 3D cone");
      const ox = rx + aw / 2, oy = top + ih * 0.55, s2 = Math.min(ih, aw) / 16;
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(rx + 10, oy); ctx.lineTo(rx + aw - 10, oy); ctx.stroke();
      [1, -1].forEach(sg => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); let on = false; S.forEach(o => { if (isNaN(o.r)) { on = false; return; } const x = ox + o.s * s2, y = oy - sg * o.r * s2; on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; }); ctx.stroke(); });
      ctx.lineWidth = 1;
      const cname = { sphere: "circle", ellipsoid: "ellipse", paraboloid: "parabola", hyperboloid: "hyperbola" }[name];
      label(`→ a ${cname}`, rx + 12, top + ih - 12, col, 11);

      const px = side ? rx + aw + 16 : rx, pw = side ? B.w - aw - 16 : rw, ty = side ? top : top + ih + (tight ? 12 : 30);
      panel(px, ty, pw, side ? B.h : B.h - (ty - top), "The pattern");
      const rows = [["circle", "sphere"], ["ellipse", "ellipsoid"], ["parabola", "paraboloid"], ["hyperbola", "hyperboloid"]];
      const r0 = tight ? 38 : 72, dr = tight ? 17 : 24;
      if (!tight) { label(side ? "3D cone → slice" : "3D cone → 2D slice", px + 16, ty + 46, C.muted, 10); label(side ? "4D → 3D" : "4D hypercone → 3D slice", px + pw - 16, ty + 46, C.muted, 10, "right"); }
      rows.forEach(([a, b], i) => { const on = a === cname; label(a, px + 16, ty + r0 + i * dr, on ? col : C.text, 12); label("→", px + pw / 2, ty + r0 + i * dr, C.muted, 12, "center"); label(b, px + pw - 16, ty + r0 + i * dr, on ? col : C.text, 12, "right"); });
    },
    aside: `
      <p>You may remember conic sections from school: slice a cone and you get a circle, ellipse, parabola or hyperbola. This chapter does the same, one dimension up.</p><p>A <b>hypercone</b> is a cone one dimension up: a spherical base drawn out to a point along w. Its slices straight across are spheres of changing size.</p>
      <p>But what if our 3D "sheet" cuts it at a <b>tilt</b>? Then we'd see other shapes: an <b>ellipsoid</b>, a <b>paraboloid</b>, a <b>hyperboloid</b> — and, as the hypercone turned, a smooth morph between them.</p>
      <p>The pattern is the payoff. Slice an ordinary cone with a flat plane and you get the conic sections every student meets: circle, ellipse, parabola, hyperbola. Slice a hypercone with a 3D "plane" and you get their 3D twins — the left view is literally the right-hand curve spun around its axis.</p>
      <div class="try"><b>Try:</b> press <b>Sweep</b>. Watch the shape tip over from closed (ellipsoid) to open (hyperboloid). The switch happens exactly at 45°, where our slice runs parallel to the cone's side.</div>
      <p class="meta">Maths: cone x² + y² + z² = w² (one nappe, w ≥ 0), sliced by a hyperplane tilted by θ. The slice is x² + y² = (s·sin θ + d)² − s²·cos² θ. <span class="tag ESTABLISHED">Established</span></p>`
  });

  // 6 — Tesseract: slices and shadows
  const dot = (a, b) => a.reduce((t, v, i) => t + v * b[i], 0);
  const norm = a => { const l = Math.sqrt(dot(a, a)); return a.map(v => v / l); };
  function basisFor(n) {
    const k = n.length, B = [];
    for (let i = 0; i < k && B.length < k - 1; i++) {
      let v = Array.from({ length: k }, (_, j) => j === i ? 1 : 0);
      [n, ...B].forEach(b => { const p = dot(v, b); v = v.map((x, j) => x - p * b[j]); });
      if (Math.sqrt(dot(v, v)) > 1e-6) B.push(norm(v));
    }
    return B;
  }
  function cubeVerts(k) { const V = []; for (let m = 0; m < (1 << k); m++) V.push(Array.from({ length: k }, (_, j) => (m >> j & 1) ? 1 : -1)); return V; }
  function edgePts(V, n, d, keep) {
    const out = [];
    for (let a = 0; a < V.length; a++) for (let j = 0; j < n.length; j++) {
      const b = a ^ (1 << j); if (b < a) continue;
      if (keep && !keep(V[a], V[b])) continue;
      const fa = dot(V[a], n) - d, fb = dot(V[b], n) - d;
      if (fa * fb > 0 || fa === fb) continue;
      const t = fa / (fa - fb); out.push(V[a].map((x, i) => x + t * (V[b][i] - x)));
    }
    return out;
  }
  function dedupe(P) { const out = []; P.forEach(p => { if (!out.some(q => q.every((x, i) => Math.abs(x - p[i]) < 1e-6))) out.push(p); }); return out; }
  function orderPoly(P) {
    const c = P[0].map((_, i) => P.reduce((t, p) => t + p[i], 0) / P.length);
    const u = norm(P[0].map((x, i) => x - c[i]));
    let nrm = null;
    for (let k = 1; k < P.length && !nrm; k++) { const w = P[k].map((x, i) => x - c[i]); const cr = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; if (Math.sqrt(dot(cr, cr)) > 1e-6) nrm = norm(cr); }
    if (!nrm) return P;
    const v = [nrm[1] * u[2] - nrm[2] * u[1], nrm[2] * u[0] - nrm[0] * u[2], nrm[0] * u[1] - nrm[1] * u[0]];
    return P.slice().sort((a, b) => { const A = a.map((x, i) => x - c[i]), Bv = b.map((x, i) => x - c[i]); return Math.atan2(dot(A, v), dot(A, u)) - Math.atan2(dot(Bv, v), dot(Bv, u)); });
  }
  const ORIENT = { cell: [0, 0, 0, 1], face: [0, 0, 1, 1], edge: [0, 1, 1, 1], corner: [1, 1, 1, 1] };
  const ORIENT_NAME = { cell: "cube-first", face: "face-first", edge: "edge-first", corner: "corner-first" };
  const CELL_COLORS = [C.accent, C.teal, C.amber, C.pink];
  CH.push({
    title: "Tesseract: slices & shadows",
    controls() {
      if (st.tessMode === "shadow") {
        return `<button class="btn" id="c-slice">Slice it</button><button class="btn primary" id="c-shadow">Shadow</button>
          <span class="ctl">Rotate in plane:</span>${Object.keys(st.rot).map(k => `<label class="ctl"><input type="checkbox" data-rot="${k}" ${st.rot[k] ? "checked" : ""}> ${k.toUpperCase()}</label>`).join("")}`;
      }
      return `<button class="btn primary" id="c-slice">Slice it</button><button class="btn" id="c-shadow">Shadow</button>
        ${Object.keys(ORIENT).map(k => `<button class="btn ${st.orient === k ? "primary" : ""}" data-or="${k}">${ORIENT_NAME[k]}</button>`).join("")}
        <button class="btn" id="c-play">${st.tessPlay ? "Pause" : "Play"}</button>
        <label class="ctl">Depth into our world <input type="range" id="c-d" min="-100" max="100" value="${Math.round(st.tessD * 100)}"></label>`;
    },
    wire() {
      $("#c-slice").onclick = () => { st.tessMode = "slice"; buildControls(); renderAside(); };
      $("#c-shadow").onclick = () => { st.tessMode = "shadow"; buildControls(); renderAside(); };
      document.querySelectorAll("[data-or]").forEach(b => b.onclick = () => { st.orient = b.dataset.or; buildControls(); });
      const p = $("#c-play"); if (p) p.onclick = e => { st.tessPlay = !st.tessPlay; e.target.textContent = st.tessPlay ? "Pause" : "Play"; };
      const dd = $("#c-d"); if (dd) dd.oninput = e => { st.tessPlay = false; $("#c-play").textContent = "Play"; st.tessD = e.target.value / 100; };
      document.querySelectorAll("[data-rot]").forEach(c => c.onchange = e => st.rot[c.dataset.rot] = e.target.checked);
    },
    tick(dt) {
      st.ang += dt * 0.5; st.tessYaw += dt * 0.3;
      if (st.tessMode === "slice" && st.tessPlay) { st.tessD += st.tessV * dt * 0.22; if (st.tessD > 1) { st.tessD = 1; st.tessV = -1; } if (st.tessD < -1) { st.tessD = -1; st.tessV = 1; } }
      const dd = $("#c-d"); if (dd) dd.value = Math.round(st.tessD * 100);
    },
    draw() {
      const pad = 16;
      if (st.tessMode === "shadow") return this.drawShadow(pad);
      const { A, B: PB, stacked } = split(0.62), rw = PB.w;
      const n4 = norm(ORIENT[st.orient]), span = dot([1, 1, 1, 1].map((_, i) => Math.sign(n4[i]) || 1), n4) * 0.999, d = st.tessD * span;
      const B = basisFor(n4), V = cubeVerts(4);
      panel(A.x, A.y, A.w, A.h, `3D slice of a tesseract · ${ORIENT_NAME[st.orient]}`);
      this.box3d = [A.x, A.y, A.w, A.h];
      const CX = A.x + A.w / 2, CY = A.y + A.h / 2, sc = Math.min(A.w, A.h) / 6.2;
      const save = [st.yaw, st.pitch]; st.yaw = st.tessYaw; st.pitch = 0.45;
      const faces = [];
      for (let ax = 0; ax < 4; ax++) for (const sg of [-1, 1]) {
        let P = dedupe(edgePts(V, n4, d, (a, b) => a[ax] === sg && b[ax] === sg));
        if (P.length < 3) continue;
        P = orderPoly(P.map(p => B.map(b => dot(p, b))));
        const Q = P.map(p => proj(p, CX, CY, sc));
        faces.push({ Q, col: CELL_COLORS[ax], z: Q.reduce((t, q) => t + q[2], 0) / Q.length });
      }
      faces.sort((a, b) => b.z - a.z);
      faces.forEach(f => { ctx.beginPath(); f.Q.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = shade(f.col, 0.35); ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = f.col; ctx.lineWidth = 1.6; ctx.stroke(); });
      ctx.lineWidth = 1; [st.yaw, st.pitch] = save;
      if (!faces.length) label("nothing — the tesseract is outside our world", CX, CY, C.muted, 12, "center", "Inter, sans-serif");
      label(`${faces.length} faces · one from each of the tesseract's 8 cubic cells it cuts`, A.x + 14, A.y + A.h - 14, C.muted, 10);

      // Flatland analog: slice a cube with a plane, same orientation one dimension down
      /* stacked: analog and reading notes side by side under the 3D view (tablets) or one above the other (phones) */
      const side = stacked && PB.w >= 520, tight = stacked && !side;
      const rx = PB.x, top = PB.y, aw = side ? Math.floor((PB.w - 16) / 2) : rw, ih = side ? PB.h : tight ? Math.floor((PB.h - 12) * 0.58) : Math.min(rw, PB.h * 0.55);
      panel(rx, top, aw, ih, "Flatland analog: a cube through a plane");
      const n3 = norm(ORIENT[st.orient].slice(1)), span3 = dot([1, 1, 1].map((_, i) => Math.sign(n3[i]) || 1), n3) * 0.999, B3 = basisFor(n3);
      let P3 = dedupe(edgePts(cubeVerts(3), n3, st.tessD * span3));
      const ox = rx + aw / 2, oy = top + ih / 2 + 10, s3 = Math.min(ih, aw) / 7;
      if (P3.length >= 3) {
        P3 = P3.map(p => B3.map(b => dot(p, b)));
        const c = [P3.reduce((t, p) => t + p[0], 0) / P3.length, P3.reduce((t, p) => t + p[1], 0) / P3.length];
        P3.sort((a, b) => Math.atan2(a[1] - c[1], a[0] - c[0]) - Math.atan2(b[1] - c[1], b[0] - c[0]));
        poly(P3, p => [ox + p[0] * s3, oy - p[1] * s3], shade(C.violet, 0.35), C.violet, 2);
      }
      const nm = ["", "", "", "triangle", "square / rectangle", "pentagon", "hexagon"][P3.length] || "";
      label(`${P3.length >= 3 ? P3.length + " sides: " + nm : "nothing"}`, rx + 12, top + ih - 12, C.violet, 11);
      const tx = side ? rx + aw + 16 : rx, ty = side ? top : top + ih + (tight ? 12 : 16);
      panel(tx, ty, side ? PB.w - aw - 16 : rw, side ? PB.h : PB.h - (ty - top), "Reading it");
      const lines = { cell: ["A cube, unchanging, then gone —", "like a square passing through", "Flatland face-first."],
        face: ["A box that stretches then shrinks —", "the cube's analog is a rectangle", "that widens and narrows."],
        edge: ["Triangular prisms and hexagonal", "shapes — as the cube corner-first", "gives triangles then hexagons."],
        corner: ["Tetrahedron → truncated shapes →", "octahedron → back. A corner", "arrives first, like the cube's triangle."] }[st.orient];
      lines.forEach((t, i) => label(t, tx + 14, ty + (tight ? 38 : 44) + i * (tight ? 16 : 18), C.text, stacked ? 11 : 12, "left", "Inter, sans-serif"));
    },
    drawShadow(pad) {
      panel(pad, pad, W - pad * 2, H - pad * 2, "A tesseract's shadow in 3D, drawn on your 2D screen");
      const V = cubeVerts(4), a = st.ang;
      const rotP = (v, i, j, t) => { const c = Math.cos(t), s = Math.sin(t); const x = v[i], y = v[j]; v[i] = x * c - y * s; v[j] = x * s + y * c; };
      const P = V.map(v0 => {
        const v = v0.slice();
        if (st.rot.xy) rotP(v, 0, 1, a * 0.4);
        if (st.rot.xw) rotP(v, 0, 3, a);
        if (st.rot.yw) rotP(v, 1, 3, a * 0.7);
        if (st.rot.zw) rotP(v, 2, 3, a * 0.55);
        const f = 1 / (3 - v[3]);
        return { p: [v[0] * f * 2.4, v[1] * f * 2.4, v[2] * f * 2.4], w: v[3] };
      });
      const cx = W / 2, cy = H / 2, s = Math.min(W, H) * 0.2;
      const save = [st.yaw, st.pitch]; st.pitch = 0.35;
      const S = P.map(o => ({ q: proj(o.p, cx, cy, s), w: o.w }));
      for (let i = 0; i < 16; i++) for (let k = 0; k < 4; k++) {
        const j = i ^ (1 << k); if (j < i) continue;
        const t = ((S[i].w + S[j].w) / 2 + 1.8) / 3.6;
        ctx.strokeStyle = k === 3 ? C.pink : C.accent; ctx.globalAlpha = 0.35 + 0.6 * Math.max(0, Math.min(1, t)); ctx.lineWidth = 1 + 1.5 * t;
        ctx.beginPath(); ctx.moveTo(S[i].q[0], S[i].q[1]); ctx.lineTo(S[j].q[0], S[j].q[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.lineWidth = 1;
      S.forEach(o => { ctx.fillStyle = C.text; ctx.beginPath(); ctx.arc(o.q[0], o.q[1], 2.5, 0, TAU); ctx.fill(); });
      [st.yaw, st.pitch] = save;
      label("pink edges run along the 4th direction", pad + 14, H - pad - 14, C.pink, 10);
    },
    asideFn() {
      return st.tessMode === "slice" ? `
        <p>A tesseract passing <b>through</b> our world. We'd never see the whole thing — only the 3D slice where it meets our space.</p>
        <p>The slice is built the way a well-known 4D visualisation video does it (link in Sources): the tesseract's boundary is <b>8 cubes</b> ("cells"). Our world cuts each cell in a flat polygon; those polygons (coloured by cell) join up into the solid you see.</p>
        <p>Its <b>orientation</b> changes everything. Cube-first, it's just a cube. Corner-first, a tiny <b>tetrahedron</b> appears, grows into an <b>octahedron</b> at the middle, then shrinks away.</p>
        <div class="try"><b>Try:</b> pick an orientation, watch the <b>Flatland analog</b> on the right first (a cube through a plane), then watch the 3D slice. Same story, one dimension up.</div>
        <p class="meta">Exact geometry: intersection of the hyperplane n·x = d with the tesseract's 32 edges. <span class="tag ESTABLISHED">Established</span></p>` : `
        <p>We can't see a tesseract. We can see its <b>shadow</b>: a projection into 3D, drawn again on your flat screen — a shadow of a shadow.</p>
        <p>Rotating in <b>XY</b> looks ordinary. Rotating in <b>XW</b>, <b>YW</b> or <b>ZW</b> — planes that include the fourth direction — makes the "inner" cube swell and turn inside out. Nothing is deforming: as the video puts it, a cube turning in Flatland would look just as strange.</p>
        <p>Four dimensions have <b>six</b> planes of rotation (we have three), and allow "double rotations" in two planes at once — impossible in 3D.</p>
        <div class="try"><b>Try:</b> only XY, then only XW. Then XW + YW together.</div>
        <p class="meta">This is the image Carl Sagan showed in <i>Cosmos</i> (1980).</p>`;
    }
  });

  // 7 — Time as a slice
  CH.push({
    title: "Time as a slice",
    controls() {
      return `<button class="btn" id="c-play">${st.nowPlay ? "Pause" : "Play"}</button>
              <label class="ctl">"Now" <input type="range" id="c-now" min="0" max="1000" value="${Math.round(st.now * 1000)}"><output id="o-now"></output></label>
              <span class="ctl">Drag the 3D view to turn it</span>`;
    },
    wire() {
      $("#c-play").onclick = e => { st.nowPlay = !st.nowPlay; e.target.textContent = st.nowPlay ? "Pause" : "Play"; };
      $("#c-now").oninput = e => { st.nowPlay = false; $("#c-play").textContent = "Play"; st.now = e.target.value / 1000; };
    },
    tick(dt) {
      if (st.nowPlay) { st.now += st.nowV * dt * 0.07; if (st.now > 1) { st.now = 1; st.nowV = -1; } if (st.now < 0) { st.now = 0; st.nowV = 1; } }
      const o = $("#o-now"); if (o) { o.textContent = "t = " + st.now.toFixed(2); $("#c-now").value = Math.round(st.now * 1000); }
    },
    // Flatland history: positions as functions of t in [0,1]
    history(t) {
      const out = [];
      out.push({ kind: "square", x: -7 + 12 * t, y: -3 + 4 * Math.sin(t * 3), r: 0.7, color: C.accent });
      out.push({ kind: "hex", x: 5 - 3 * t, y: 5 - 9 * t * t, r: 0.8, color: C.teal });
      const R = 3.2, tc = 0.55, zc = (t - tc) * 14;
      if (Math.abs(zc) < R) out.push({ kind: "sphere", x: 1, y: 2, r: Math.sqrt(R * R - zc * zc), color: C.pink });
      return out;
    },
    draw() {
      const { A, B } = split(0.6);
      panel(A.x, A.y, A.w, A.h, "Flatland's whole history as one 3D block (up = time)");
      this.box3d = [A.x, A.y, A.w, A.h];
      ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y, A.w, A.h); ctx.clip();
      const CX = A.x + A.w / 2, CY = A.y + A.h * 0.74, s = Math.min(A.w, A.h) / 40, TZ = 16;
      const box = (z, a) => { const c = [[-9, -9, z], [9, -9, z], [9, 9, z], [-9, 9, z]].map(p => proj(p, CX, CY, s)); ctx.beginPath(); c.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); return c; };
      ctx.strokeStyle = C.line; box(0); ctx.stroke(); box(TZ); ctx.stroke();
      [[-9, -9], [9, -9], [9, 9], [-9, 9]].forEach(([x, y]) => { const a = proj([x, y, 0], CX, CY, s), b = proj([x, y, TZ], CX, CY, s); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
      const steps = 70, nowZ = st.now * TZ;
      const rings = [];
      for (let i = 0; i <= steps; i++) { const t = i / steps; this.history(t).forEach(o => rings.push({ ...o, z: t * TZ })); }
      ctx.globalAlpha = 0.28; rings.filter(o => o.z <= nowZ).forEach(o => ellipseAt(o.x, o.y, o.z, o.r, CX, CY, s, null, o.color, 1));
      box(nowZ); ctx.fillStyle = "rgba(124,196,255,0.10)"; ctx.globalAlpha = 1; ctx.fill(); ctx.strokeStyle = C.accent; ctx.stroke();
      ctx.globalAlpha = 0.28; rings.filter(o => o.z > nowZ).forEach(o => ellipseAt(o.x, o.y, o.z, o.r, CX, CY, s, null, o.color, 1));
      ctx.globalAlpha = 1;
      this.history(st.now).forEach(o => ellipseAt(o.x, o.y, nowZ, o.r, CX, CY, s, shade(o.color, 0.6), C.text, 2));
      const ends = [[-9, -9], [9, -9], [9, 9], [-9, 9]].map(([x, y]) => proj([x, y, 0], CX, CY, s));
      const li = ends.reduce((b, e, i) => e[0] < ends[b][0] ? i : b, 0);
      const cxy = [[-9, -9], [9, -9], [9, 9], [-9, 9]][li];
      const b0 = proj([cxy[0], cxy[1], 0], CX, CY, s), b1 = proj([cxy[0], cxy[1], TZ], CX, CY, s);
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.moveTo(b0[0] - 14, b0[1]); ctx.lineTo(b1[0] - 14, b1[1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b1[0] - 18, b1[1] + 8); ctx.lineTo(b1[0] - 14, b1[1]); ctx.lineTo(b1[0] - 10, b1[1] + 8); ctx.stroke();
      label("later", b1[0] - 20, b1[1] + 4, C.muted, 10, "right"); label("earlier", b0[0] - 20, b0[1] + 4, C.muted, 10, "right");
      label("time", (b0[0] + b1[0]) / 2 - 20, (b0[1] + b1[1]) / 2, C.muted, 10, "right");
      const nl = proj([cxy[0], cxy[1], nowZ], CX, CY, s); label("NOW", nl[0] - 20, nl[1] + 4, C.accent, 11, "right");
      ctx.restore();

      const rx = B.x, rw = B.w, sz = Math.max(60, Math.min(B.w, B.h - 60));
      panel(rx, B.y, rw, sz + 30, "What Flatlanders experience at this 'now'");
      const sc = sz / 22, ox = rx + rw / 2, oy = B.y + 30 + sz / 2;
      this.history(st.now).forEach(o => { ctx.beginPath(); ctx.arc(ox + o.x * sc, oy - o.y * sc, o.r * sc, 0, TAU); ctx.fillStyle = shade(o.color, 0.35); ctx.fill(); ctx.strokeStyle = o.color; ctx.lineWidth = 2; ctx.stroke(); });
      ctx.lineWidth = 1;
      label("blue: A Square moving · teal: a hexagon · pink: the Sphere's visit", rx, B.y + sz + 52, C.muted, 10);
    },
    aside: `
      <p>Stack every moment of Flatland's history on top of each other and you get a <b>3D block</b>. We can see it whole — past and future at once.</p>
      <p>A Square moving becomes a wavy <b>tube</b>. And the Sphere's visit — the circle that appeared from nowhere — is, in the block, a perfect <b>sphere</b>. Flatlanders experience it as an event in time; we see it as a shape.</p>
      <p>Relativity treats <i>our</i> history the same way: a 4D block, with "now" as a slice moving through it. That's the <b>block universe</b> — and why many physicists say the equations contain no "now" (contested: see H4).</p>
      <div class="try"><b>Try:</b> pause, then drag "Now". Nothing in the block moves; only the slice does. Ask: what, in the block, is doing the moving?</div>
      <p class="meta">This is hole <a href="#" data-hole="H4">H4 — No 'now'</a> in the Atlas. And with <i>two</i> time dimensions, "now" would be a line through a time <i>plane</i>, not a single slice — the setting of the <a href="#" data-view-link="films">Two Films lab</a>.</p>`
  });

  /* ---------- aside + controls ---------- */
  /* ---------- chapter bar + contents ----------
     Seven chapters in three acts. The bar above the stage is the chapter navigation; the contents card
     opens over the stage on a first visit (or from the bar) and lets visitors jump to the highlights. */
  const ACTS = [
    { name: "In Flatland", chs: [0, 1] },
    { name: "Up a dimension", chs: [2, 3, 4, 5] },
    { name: "Time", chs: [6] }
  ];
  const SHORT = ["Meet A Square", "Sphere visits", "Building up", "A 4D visitor", "Hypercone", "Tesseract", "Time as a slice"];
  const HOOK = [
    "See a whole world as its inhabitant does: a single line.",
    "A 3D visitor, seen one slice at a time — a point that grows, shrinks and vanishes.",
    "Point, line, square, cube … tesseract. Predict the corners before you count them.",
    "Now we are the Flatlanders: a 4D ball passes through our world.",
    "Slice a 4D cone at a tilt: spheres, ellipsoids, paraboloids, hyperboloids.",
    "A 4D cube passing through our space — and its shadow turning inside out.",
    "All of Flatland's history as one block. 'Now' is just a slice."
  ];
  const STAR = new Set([3, 4, 5]);
  const actOf = i => ACTS.find(a => a.chs.includes(i));
  let introOpen = false;
  const seenCh = i => Chrono.progress.seen("flatland/" + (i + 1));

  function renderSteps() {
    $("#fl-steps").innerHTML = ACTS.map(a => `<div class="flact"><span class="flact-name">${a.name}</span><div class="flact-chs">${a.chs.map(i => `
      <button class="flstep${i === chapter && !introOpen ? " on" : ""}${seenCh(i) ? " seen" : ""}" data-ch="${i}" title="${HOOK[i]}">
        <span class="n">${i + 1}</span>${STAR.has(i) ? '<span class="star" aria-label="highlight">★</span>' : ""}${SHORT[i]}</button>`).join("")}</div></div>`).join("")
      ;
    document.querySelectorAll("#fl-steps [data-ch]").forEach(b => b.onclick = () => { introOpen = false; go(+b.dataset.ch); });
  }
  function renderIntro() {
    const box = $("#fl-intro");
    box.style.display = introOpen ? "flex" : "none";
    if (!introOpen) return;
    box.innerHTML = `<div class="flintro">
      <div class="eyebrow">Flatland · a lens on dimensions</div>
      <h2>Why are extra dimensions so hard to picture?</h2>
      <p>In 1884 Edwin Abbott imagined a flat world whose people can't picture "up". Seven short, hands-on chapters use his trick — reason one dimension down, then climb back up — to picture a fourth dimension, and then to see time as a slice.</p>
      <div class="flacts">${ACTS.map(a => `<div><div class="eyebrow">${a.name}</div>${a.chs.map(i => `
        <button class="flpick${STAR.has(i) ? " star" : ""}" data-pick="${i}"><b>${i + 1}. ${CH[i].title}${STAR.has(i) ? " ★" : ""}${seenCh(i) ? ' <i class="seen-mark">✓</i>' : ""}</b><span>${HOOK[i]}</span></button>`).join("")}</div>`).join("")}</div>
      <div class="row" style="justify-content:flex-start;gap:10px">
        <button class="btn primary" data-pick="0">Start at the beginning →</button>
        <button class="btn" data-pick="3">★ Jump to the highlights: a 4D visitor</button>
        <span class="meta">★ = the chapters where the fourth dimension appears</span>
      </div></div>`;
    box.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { introOpen = false; go(+b.dataset.pick); if (+b.dataset.pick === chapter) { renderSteps(); renderIntro(); } });
  }

  /* Predict first, for the chapters where the answer surprises (same card as the labs). */
  const PREDICT = {
    2: { q: "A sphere passes down through Flatland. What does A Square, living in the plane, actually see?",
      options: ["A sphere, coming closer", "A point that grows into a circle, shrinks, and vanishes", "Nothing — the sphere is in another dimension"], answer: 1,
      explain: "He only ever sees the slice where the sphere meets his plane: first a point, then a circle that grows to the sphere's full width, then shrinks back to a point and vanishes. One object, seen one slice at a time." },
    4: { q: "Now we're the Flatlanders. A 4D ball passes through our 3D world. What would we see?",
      options: ["A 4D ball", "A point that swells into a sphere, then shrinks and vanishes", "A flat circle"], answer: 1,
      explain: "Exactly what A Square saw, one dimension up: we'd see only the 3D slice where the 4D ball meets our space — a sphere appearing from nowhere, growing, shrinking and vanishing." },
    6: { q: "A tesseract (a 4D cube) passes corner-first through our world. What's the first shape to appear?",
      options: ["A tiny cube", "A tiny tetrahedron (a triangular pyramid)", "A tiny square"], answer: 1,
      explain: "A corner arrives first, and the slice near a corner is a small tetrahedron — just as a cube pushed corner-first through Flatland first shows a small triangle. It grows into an octahedron in the middle, then shrinks away." },
    7: { q: "Stack every moment of Flatland's history into one 3D block. In that block, what does the Sphere's visit look like?",
      options: ["A circle", "A sphere", "A straight line"], answer: 1,
      explain: "A sphere. The Flatlanders lived it as an event in time — a circle appearing, growing, shrinking — but in the block of their whole history it's simply a shape. That's the block-universe picture of time." }
  };
  F.predictFor = n => PREDICT[n] || null;
  /* The exact geometry behind the chapters, named so the maths page's checks can reach it (D-057). */
  F.fx = { sliceR: (R, z) => Math.abs(z) < R ? Math.sqrt(R * R - z * z) : 0, coneShape: th => coneShape(th),
    cube: n => { let e = 0; for (let a = 0; a < (1 << n); a++) for (let k = 0; k < n; k++) if ((a ^ (1 << k)) > a) e++; return { v: 1 << n, e }; },
    tessSlice: (o, d) => dedupe(edgePts(cubeVerts(4), ORIENT[o], d)).length };                  // the passport's prediction record
  function renderAside() {
    const ch = CH[chapter], pkey = "flatland/" + (chapter + 1), pred = PREDICT[chapter + 1];
    const waiting = pred && Chrono.progress.pred(pkey).guess === undefined;
    const body = waiting ? "" : ch.asideFn ? ch.asideFn() : ch.aside;
    $("#aside").innerHTML = `${Chrono.crumb ? Chrono.crumb() : ""}
      <div class="flhead"><span class="eyebrow">Flatland · ${chapter + 1} of ${CH.length} · ${actOf(chapter).name}</span><button class="linkish" data-contents>☰ All chapters</button></div>
      <h2>${ch.title}</h2>
      <div class="pillrow"><span class="tag ANALOGY">Analogy</span> <span class="tag ESTABLISHED">Established geometry</span></div>
      ${pred ? Chrono.predictCard(pkey, pred) : ""}
      ${body}
      ${waiting ? "" : Chrono.stickFor ? Chrono.stickFor(pkey) : ""}
      ${Chrono.keyIdeas ? Chrono.keyIdeas(pkey) : ""}
      ${waiting || !Chrono.endCard ? "" : Chrono.endCard({ id: pkey, next: chapter < CH.length - 1
        ? { q: HOOK[chapter + 1], href: "#flatland/" + (chapter + 2), label: `chapter ${chapter + 2}, ${SHORT[chapter + 1]}` }
        : { q: "Flatland showed time as one slice through a block. What if there were two time directions?", href: "#films", label: "Two Films" } }, Chrono.stopFor ? Chrono.stopFor() : null)}
      ${chapter > 0 ? `<p class="meta"><button class="linkish" data-step="-1">← Previous chapter: ${SHORT[chapter - 1]}</button></p>` : ""}
      <p class="meta mlink"><a href="#maths/flatland">∑ The maths behind this lab →</a></p>
      <p class="caveat">Sources: E. A. Abbott, <i>Flatland</i> (1884, public domain) · C. Sagan, <i>Cosmos</i> ep. 10 (1980) · TED-Ed, "Exploring other dimensions" (Rosenthal &amp; Zaidan) · 4D visualisation video (YouTube): <a href="https://www.youtube.com/watch?v=4URVJ3D8e8k" target="_blank">youtube.com/watch?v=4URVJ3D8e8k</a>.</p>`;
    document.querySelectorAll("#aside [data-step]").forEach(b => b.onclick = () => go(chapter + +b.dataset.step));
    document.querySelectorAll("#aside [data-tour-next]").forEach(b => b.onclick = () => Chrono.tourNext && Chrono.tourNext());
    if (pred) Chrono.wirePredict(pkey, renderAside);
    $("#aside [data-contents]").onclick = () => { introOpen = !introOpen; renderSteps(); renderIntro(); };
    document.querySelectorAll("[data-rev]").forEach(b => b.onclick = () => { st.reveal[b.dataset.rev] = true; renderAside(); });
    document.querySelectorAll("#aside [data-hole]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goHole(a.dataset.hole); });
    document.querySelectorAll("#aside [data-view-link]").forEach(a => a.onclick = e => { e.preventDefault(); Chrono.goView(a.dataset.viewLink); });
  }
  function buildControls() {
    const key = "flatland/" + (chapter + 1), help = Chrono.guideFor ? Chrono.guideFor(key) : "", pop = $("#fl-pop");
    $("#fl-controls").innerHTML = CH[chapter].controls() + (help ? `<button class="btn ctlhelp" data-ctlhelp aria-expanded="false" title="What each control does">ⓘ What the controls do</button>` : "");
    if (pop) { pop.hidden = true; pop.innerHTML = help; }
    const b = $("#fl-controls [data-ctlhelp]"); if (b && pop) b.onclick = () => { pop.hidden = !pop.hidden; b.setAttribute("aria-expanded", !pop.hidden); };
    CH[chapter].wire();
    if (Chrono.controlHints) Chrono.controlHints({ id: key }, "#fl-controls");
  }
  /* Readout bar (3b), only where a chapter has a headline number that doesn't give a prediction away. */
  const READ = {
    1: () => { const z = st.sphereZ, R = st.sphereR, r = Math.abs(z) < R ? Math.sqrt(R * R - z * z) : 0;
      return [["Sphere's height above the plane", z.toFixed(2)], ["What A Square sees", r > 0 ? `a circle, radius ${r.toFixed(2)}` : "nothing"]]; },
    4: () => [["Tilt of the slice", `${Math.round(st.coneTh)}°`], ["The slice is", coneShape(st.coneTh)]],
    6: () => [["'Now'", st.now.toFixed(2)]]
  };
  let roHTML = "", roT = 0;
  function readouts() {
    const el = $("#fl-readouts"); if (!el) return;
    const pred = PREDICT[chapter + 1], waiting = pred && Chrono.progress.pred("flatland/" + (chapter + 1)).guess === undefined;
    const r = !waiting && READ[chapter] ? READ[chapter]() : null;
    const html = r ? r.map(([k, v]) => `<div class="ro"><b>${v}</b><span>${k}</span></div>`).join("") : "";
    if (html !== roHTML) { roHTML = html; el.innerHTML = html; el.hidden = !html; }
  }
  F.readouts = () => READ[chapter] ? READ[chapter]() : null;   // for the regression
  const clampCh = i => Math.max(0, Math.min(CH.length - 1, Number.isInteger(i) ? i : 0));
  /* Chapter changes go through the URL (#flatland/3) so chapters can be linked to and Back works. */
  function go(i) { Chrono.nav("#flatland/" + (clampCh(i) + 1)); }
  F.setChapter = i => { chapter = clampCh(i); };

  /* ---------- canvas + loop ---------- */
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = Math.max(300, r.width); H = Math.max(300, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(ts) {
    if (!active) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    CH[chapter].tick(Chrono.motion.dt(dt));
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    CH[chapter].draw();
    if (ts - roT > 100) { roT = ts; readouts(); }
    raf = requestAnimationFrame(frame);
  }
  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  function initCanvas() {
    canvas = $("#fl-canvas"); ctx = canvas.getContext("2d");
    window.addEventListener("resize", () => active && resize());
    let drag = null;
    canvas.addEventListener("pointerdown", e => {
      const [x, y] = pointer(e), ch = CH[chapter];
      if (chapter === 0 && ch.box) drag = "square";
      else if (ch.box3d && x >= ch.box3d[0] && x <= ch.box3d[0] + ch.box3d[2] && y >= ch.box3d[1] && y <= ch.box3d[1] + ch.box3d[3]) drag = { yaw: st.yaw, pitch: st.pitch, x, y };
      if (drag) { canvas.setPointerCapture(e.pointerId); move(e); }
    });
    const move = e => {
      if (!drag) return;
      const [x, y] = pointer(e);
      if (drag === "square") {
        const [bx, by, bw, bh] = CH[0].box, s = Math.min(bw, bh) / 23;
        st.sq.x = Math.max(-10, Math.min(10, (x - (bx + bw / 2)) / s));
        st.sq.y = Math.max(-10, Math.min(10, -(y - (by + bh / 2)) / s));
      } else {
        st.yaw = drag.yaw + (x - drag.x) * 0.008;
        st.pitch = Math.max(0.12, Math.min(1.35, drag.pitch + (y - drag.y) * 0.006));
      }
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", () => drag = null);
  }

  F.show = function () {
    if (!canvas) initCanvas();
    const firstVisit = !CH.some((c, i) => seenCh(i));
    introOpen = firstVisit && !/^#flatland\/\d/.test(location.hash);
    document.body.dataset.scale = "labs";                   // the Physics glow on the stage
    active = true; resize(); Chrono.motion.reset(); buildControls(); renderAside(); renderSteps(); renderIntro(); readouts();
    if (!introOpen) Chrono.progress.visit("flatland/" + (chapter + 1));
    cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame);
  };
  F.hide = function () { active = false; cancelAnimationFrame(raf); };
  F.go = go;
})();
