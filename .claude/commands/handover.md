---
description: End a session — confirm health, rewrite ACTIVE.md for a fresh reader, suggest a commit message
---
Close this session so a fresh one can start cold. Do these in order and show Will the result of each.

1. **Health.** Run `tools/regress.sh`. If anything fails, stop and report it — do not hand over a red build.
2. **Walk the done list** (CLAUDE.md → Ways of working → "Done means"). From this session's work (and `git status` / `git diff --stat`), list what was
   finished, what is half-done, and anything decided. Tick finished items in `todo.md`; add new decisions to
   `decisions.md` (next D-number); log any review points in `reviews/reviews.md`.
3. **Rewrite `ACTIVE.md`** — replace, never append. Write it for someone who has read nothing else today:
   current phase and what is next (concretely: the first file to open, the first step), open questions
   waiting on Will, known issues, and the "How to resume" line. Move finished material to `/archive`.
   Keep it short; detail belongs in todo.md and decisions.md.
4. **Check the other docs:** `README.md` (public — matches the features?), `CLAUDE.md` (under ~60 lines,
   still true?), `tools/README.md` (checks added this session listed?), `sources.md` (new claims traced?).
5. **Suggest a commit message** in the house style (`Commit NN - <phase/summary>`, then a short body of
   what changed). Will commits and pushes; do not commit.
