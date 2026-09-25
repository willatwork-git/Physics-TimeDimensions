# tools/lib.sh — helpers shared by tools/regress.sh and tools/checks/*.sh. Sourced, not run.
# Environment provided to every check: REPO (repo root), WORK (scratch copy of the app), LOG (full-detail log).

# Chrome: $CHROME if set, else the macOS default. Empty if not found (browser checks then WARN and skip).
find_chrome() {
  if [ -n "${CHROME:-}" ] && [ -x "${CHROME:-}" ]; then echo "$CHROME"; return; fi
  local mac="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  [ -x "$mac" ] && echo "$mac" && return
  command -v google-chrome || command -v chromium || true
}

# Scratch copy of the app with a probe script injected before the first src/ script.
# usage: make_probe_copy <dir> <probe.js>
make_probe_copy() {
  local dir="$1" probe="$2"
  rm -rf "$dir" && mkdir -p "$dir"
  cp -R "$REPO/index.html" "$REPO/src" "$REPO/favicon.svg" "$dir/" 2>/dev/null
  cp "$probe" "$dir/probe.js"
  # insert <script src="probe.js"> before the first <script src="src/...">
  perl -0pi -e 's#(<script src="src/)#<script src="probe.js"></script>\n$1#' "$dir/index.html"
}

# Load a page headless and print whatever the probe wrote into <pre id="RES">.
# usage: run_page <file-url> <virtual-ms>
run_page() {
  "$CHROME_BIN" --headless=new --disable-gpu --allow-file-access-from-files --window-size=1440,900 --virtual-time-budget="$2" --dump-dom "$1" 2>/dev/null \
    | perl -0ne 'print $1 if /<pre id="RES">(.*?)<\/pre>/s'
}

# Output contract for checks: exactly one summary line per result, detail to $LOG.
pass() { echo "PASS $*"; }
warn() { echo "WARN $*"; }
fail() { echo "FAIL $*"; }
log()  { echo "$*" >> "$LOG"; }
# Read a field from probe JSON: jget "$json" errors  → array items joined by " | " (empty if none), or the scalar.
jget() { node -e 'const v=JSON.parse(process.argv[1])[process.argv[2]];process.stdout.write(Array.isArray(v)?v.join(" | "):String(v??""))' "$1" "$2"; }
