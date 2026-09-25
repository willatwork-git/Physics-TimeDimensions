#!/bin/bash
# Steps every lab's physics and drawing directly, then every mission: not passed on arrival, completes via "Show me".
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "labs: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/labs" "$REPO/tools/probes/labs.js"
res=$(run_page "file://$WORK/labs/index.html" 120000)
log "labs: $res"
[ -z "$res" ] && { fail "labs: probe returned nothing (page crashed or timed out)"; exit 0; }
get() { jget "$res" "$1"; }
labs=$(get labs); ms=$(get missions)
e=$(jfirst "$res" errors); s=$(jfirst "$res" stepErr)
nr=$(get noReadouts)
if [ -n "$e$s" ]; then fail "labs stepping: ${e:+errors $e  }${s:+step errors $s}"; else pass "labs: $labs labs step and draw without error"; fi
if [ -n "$nr" ]; then fail "readouts: no readout bar (every lab needs readouts(), UX spec 3b): $nr"; else pass "readouts: all $labs labs give up to 3 labelled numbers"; fi
a=$(jfirst "$res" arrival); u=$(jfirst "$res" unfinished)
[ -n "$a" ] && fail "missions: passed on arrival (breaks the mission rule): $a"
[ -n "$u" ] && fail "missions: 'Show me' does not complete: $u"
[ "$ms" = "0" ] && fail "missions: none found — the lab never showed a mission card (still locked, or a load error)"
[ -z "$a$u" ] && [ "$ms" != "0" ] && pass "missions: $ms tested — none passes on arrival, all complete via Show me"
exit 0
