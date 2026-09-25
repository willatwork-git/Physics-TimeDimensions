#!/bin/bash
# Teacher mode end to end (Phase 4c "done when"): class link → join → completion code → checker; tampering and the
# wrong class name are caught; a lab-set code round-trips; the teacher's link builder; the worksheet's questions.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "teach: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/teach" "$REPO/tools/probes/teach.js"
res=$(run_page "file://$WORK/teach/index.html?class=Year%209%20Physics&t=puzzle&m=1" 20000)
log "teach: $res"
[ -z "$res" ] && { fail "teach: probe returned nothing (page crashed or timed out)"; exit 0; }
b=$(jfirst "$res" bad); e=$(jfirst "$res" errors)
if [ -n "$b$e" ]; then fail "teach: ${b}${e:+ · errors: $e}"; else pass "teach: class link → code $(jget "$res" code) → checker ✓; tampering and wrong class caught; worksheet"; fi
exit 0
