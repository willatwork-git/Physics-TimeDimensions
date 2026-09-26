#!/bin/bash
# The maths pages (D-057): every worked example on #maths/<lab> must match what the lab's own code computes.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "maths: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/maths" "$REPO/tools/probes/maths.js"
res=$(run_page "file://$WORK/maths/index.html" 30000)
log "maths: $res"
[ -z "$res" ] && { fail "maths: probe returned nothing (page crashed or timed out)"; exit 0; }
b=$(jfirst "$res" bad); e=$(jfirst "$res" errors)
if [ -n "$b$e" ]; then fail "maths: ${b}${e:+ · errors: $e}"; else pass "maths: $(jget "$res" n) worked examples match the labs' own code"; fi
exit 0
