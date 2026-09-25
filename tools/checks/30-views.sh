#!/bin/bash
# Every header [data-view], tour stop and tour quiz, in Learn, Workbench and school edition:
# no JS errors, no lab canvas left blank.
source "$REPO/tools/lib.sh"
[ -z "$CHROME_BIN" ] && { warn "views: Chrome not found — set \$CHROME; skipped"; exit 0; }
make_probe_copy "$WORK/views" "$REPO/tools/probes/views.js"
for pair in "Learn|" "Workbench|?mode=lab" "School|?edition=school"; do
  name="${pair%%|*}"; q="${pair#*|}"
  res=$(run_page "file://$WORK/views/index.html$q" 60000)
  log "views $name: $res"
  [ -z "$res" ] && { fail "views $name: probe returned nothing (page crashed or timed out)"; continue; }
  n=$(jget "$res" views); e=$(jfirst "$res" errors); b=$(jget "$res" blank); mv=$(jget "$res" moved)
  bad="${e:+errors: $e  }${b:+blank canvas: $b  }${mv:+redirected: $mv}"
  if [ -n "$bad" ]; then fail "views $name: $bad"; else pass "views $name: $n routes, no errors, no blank canvases"; fi
done
