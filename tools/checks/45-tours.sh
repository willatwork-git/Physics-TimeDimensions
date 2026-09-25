#!/bin/bash
# Every tour stop: a locked prediction gives nothing away; setups inside their labs' ranges; no shared prediction keys.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "tours: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/tours" "$REPO/tools/probes/tours.js"
res=$(run_page "file://$WORK/tours/index.html" 60000)
log "tours: $res"
[ -z "$res" ] && { fail "tours: probe returned nothing (page crashed or timed out)"; exit 0; }
bad=""
for k in errors leaks clamped shared; do v=$(jfirst "$res" $k); [ -n "$v" ] && { fail "tours $k: $v"; bad=1; }; done
[ -z "$bad" ] && pass "tours: $(jget "$res" stops) stops — locked predictions give nothing away, setups in range, no shared keys"
exit 0
