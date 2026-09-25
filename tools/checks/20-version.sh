# 20-version — cache-busting. Every src/ link in index.html carries the same ?v=N, and if src/ has changed since the
# last commit, N must have been bumped (or returning visitors get stale code).
source "$REPO/tools/lib.sh"
vs="$(grep -oE 'src/[A-Za-z0-9_.-]+\?v=[0-9]+' "$REPO/index.html")"
links=$(echo "$vs" | grep -c .); versions="$(echo "$vs" | sed -E 's/.*\?v=//' | sort -u)"
unver="$(grep -oE '(src|href)="src/[A-Za-z0-9_.-]+\.(js|css)"' "$REPO/index.html")"
log "links with ?v=: $links · versions: $(echo $versions)"; [ -n "$unver" ] && log "without ?v=: $unver"
if [ "$(echo "$versions" | grep -c .)" -ne 1 ]; then fail "version: mixed ?v= values in index.html: $(echo $versions) — make them all the same"; exit 0; fi
if [ -n "$unver" ]; then fail "version: $(echo "$unver" | wc -l | tr -d ' ') src/ link(s) have no ?v= (see log)"; exit 0; fi
v="$versions"
if git -C "$REPO" rev-parse HEAD >/dev/null 2>&1; then
  changed="$(git -C "$REPO" status --porcelain -- src | awk '{print $2}')"
  headv="$(git -C "$REPO" show HEAD:index.html 2>/dev/null | grep -oE '\?v=[0-9]+' | head -1 | tr -d '?v=')"
  log "HEAD ?v=$headv · src changed since HEAD: $(echo $changed)"
  if [ -n "$changed" ] && [ "$headv" = "$v" ]; then
    fail "version: src/ changed since the last commit ($(echo "$changed" | wc -l | tr -d ' ') file(s)) but ?v= is still $v — run: sed -i '' 's/?v=$v/?v=$((v+1))/g' index.html"; exit 0; fi
fi
pass "version: ?v=$v on all $links src/ links$([ -n "${changed:-}" ] && echo " · bumped since last commit")"
