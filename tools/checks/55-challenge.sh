#!/bin/bash
# Challenge links (Phase 4b): open a friend's link, see their guess, guess, check, compare; the links the app builds.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "challenge: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/challenge" "$REPO/tools/probes/challenge.js"
res=$(run_page "file://$WORK/challenge/index.html?c=clocks&g=0#clocks" 15000)
log "challenge: $res"
[ -z "$res" ] && { fail "challenge: probe returned nothing (page crashed or timed out)"; exit 0; }
bad=$(node "$REPO/tools/probes/challenge.verify.js" "$res")
res2=$(run_page "file://$WORK/challenge/index.html?c=clocks&g=x#clocks" 12000)
log "challenge (bad link): $res2"
echo "$res2" | grep -q '"challenge":null' || bad="${bad:+$bad · }a malformed link was accepted"
if [ -n "$bad" ]; then fail "challenge: $bad"; else pass "challenge: friend's link → their guess shown → yours checked → both compared; links built right; bad link ignored"; fi
exit 0
