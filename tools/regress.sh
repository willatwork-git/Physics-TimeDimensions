#!/usr/bin/env bash
# tools/regress.sh — Chronoscope's health check. One call from the repo root:  tools/regress.sh
# Runs every tools/checks/NN-*.sh in order. The screen gets a short summary (what passed, each failure with enough
# detail to start fixing it); full detail goes to tools/last-run.log. Exit 0 = healthy, 1 = at least one FAIL.
# Options: --only <pattern>   run only checks whose file name contains <pattern> (e.g. --only views)
set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"; export REPO
LOG="$REPO/tools/last-run.log"; export LOG
WORK="$(mktemp -d "${TMPDIR:-/tmp}/chrono-regress.XXXXXX")"; export WORK
trap 'rm -rf "$WORK"' EXIT
source "$REPO/tools/lib.sh"
CHROME_BIN="$(find_chrome)"; export CHROME_BIN
ONLY=""; [ "${1:-}" = "--only" ] && ONLY="${2:-}"

: > "$LOG"
log "Chronoscope regression · $(date '+%Y-%m-%d %H:%M') · $(git -C "$REPO" rev-parse --short HEAD 2>/dev/null)"
echo "Chronoscope regression · $(date '+%H:%M')"
start=$(date +%s); npass=0; nwarn=0; nfail=0
for c in "$REPO"/tools/checks/[0-9]*.sh; do
  name="$(basename "$c" .sh)"; [ -n "$ONLY" ] && [[ "$name" != *"$ONLY"* ]] && continue
  log ""; log "===== $name ====="
  out="$(bash "$c" 2>>"$LOG")"
  [ -z "$out" ] && out="FAIL $name: check printed nothing (see log)"
  while IFS= read -r line; do
    case "$line" in
      PASS*) npass=$((npass+1)); printf '  ✓ %s\n' "${line#PASS }" ;;
      WARN*) nwarn=$((nwarn+1)); printf '  ! %s\n' "${line#WARN }" ;;
      FAIL*) nfail=$((nfail+1)); printf '  ✗ %s\n' "${line#FAIL }" ;;
      *) log "$line" ;;
    esac
  done <<< "$out"
done
secs=$(( $(date +%s) - start ))
echo "Result: $npass passed · $nwarn warnings · $nfail failed · ${secs}s · detail: tools/last-run.log"
log ""; log "Result: $npass passed, $nwarn warnings, $nfail failed, ${secs}s"
[ "$nfail" -eq 0 ]
