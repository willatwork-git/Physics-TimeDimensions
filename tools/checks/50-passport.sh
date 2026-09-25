#!/bin/bash
# The Passport's logic (Phase 4a): save/load round trip, bad file refused, prediction scoring, dated tour stamps, header bar.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "passport: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/passport" "$REPO/tools/probes/passport.js"
res=$(run_page "file://$WORK/passport/index.html" 20000)
log "passport: $res"
[ -z "$res" ] && { fail "passport: probe returned nothing (page crashed or timed out)"; exit 0; }
b=$(jfirst "$res" bad); e=$(jfirst "$res" errors)
if [ -n "$b$e" ]; then fail "passport: ${b}${e:+ · errors: $e}"; else pass "passport: save/load round trip, scoring, dated stamps, header bar"; fi
exit 0
