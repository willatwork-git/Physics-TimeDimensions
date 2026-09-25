#!/bin/bash
# Every lab and Flatland chapter at a real phone width (390 × 844, inside a frame): no sideways overflow, the three
# header menus on one row, a stage at least 260 px tall, no blank canvas, no canvas text off the edge, and no canvas
# labels drawn on top of each other (warning for now).
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "phone: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/phone" "$REPO/tools/probes/phone.js"
cat > "$WORK/phone-frame.html" <<'HTML'
<body style="margin:0"><iframe id="f" src="phone/index.html" style="width:390px;height:844px;border:0"></iframe>
<script>const t = setInterval(() => { const r = document.getElementById("f").contentDocument.getElementById("RES");
  if (r) { clearInterval(t); const p = document.createElement("pre"); p.id = "RES"; p.textContent = r.textContent; document.body.appendChild(p); } }, 250);</script></body>
HTML
res=$(run_page "file://$WORK/phone-frame.html" 90000)
log "phone: $res"
[ -z "$res" ] && { fail "phone: probe returned nothing (page crashed or timed out)"; exit 0; }
n=$(jget "$res" routes); bad=""
for k in errors overflow header small blank atlas; do v=$(jfirst "$res" $k); [ -n "$v" ] && { fail "phone $k: $v"; bad=1; }; done
[ -z "$bad" ] && pass "phone: $n labs and chapters at 390 px — no overflow, header on one row, stage ≥ 260 px, nothing blank; Atlas lists $(jget "$res" holes) holes"
o=$(jget "$res" overlap); log "phone overlap: $o"
[ -n "$o" ] && warn "phone: canvas labels overlap in $(echo "$o" | tr '|' '\n' | cut -d: -f1 | sort -u | wc -l | tr -d ' ') labs — $(jfirst "$res" overlap)"   # warn until the known ones are fixed (todo.md → Phase 5)
c=$(jfirst "$res" clipped); [ -n "$c" ] && fail "phone: canvas text off the edge (shrinking stops at 8 px — shorten it for narrow panels) — $c"
exit 0
