<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git Auto Commit & Push Rule

When your task creates, edits, or deletes tracked or untracked files in this Git repository, always commit and push the changes before giving your final response, unless the user explicitly asks not to commit or push.

1. Check `git status --short` first. If there are no changes, skip commit and push.
2. Never stage secrets (e.g. `.env*`, credentials, private keys) or ignored build artifacts; verify the staged file list before committing.
3. Write a concise, clear commit message summarizing the changes (e.g. `feat:`, `fix:`, `docs:`, `chore:`).
4. Push to the configured remote branch (`git push origin <current-branch>`). Never force-push (`--force`).
5. If commit or push fails (e.g. remote rejection, conflict, auth error), stop and report the exact error to the user.
6. In your final response, state the commit hash and pushed branch only after verifying the command succeeded.
