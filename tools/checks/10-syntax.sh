# 10-syntax — every src/*.js parses (node --check). Cheapest check; catches a broken edit before the browser runs.
source "$REPO/tools/lib.sh"
if ! command -v node >/dev/null; then warn "syntax: node not found — skipped"; exit 0; fi
bad=0; n=0
for f in "$REPO"/src/*.js; do n=$((n+1)); if ! out="$(node --check "$f" 2>&1)"; then bad=$((bad+1)); log "$out"; fail "syntax: $(basename "$f") — $(echo "$out" | grep -m1 -E 'Error' )"; fi; done
[ "$bad" -eq 0 ] && pass "syntax: $n files parse"
