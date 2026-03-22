# Documentation Loop

Reusable skill that enforces a documentation-driven workflow for every coding task.
Prevents guessing, breaking existing functionality, and undocumented changes.

## PRE-IMPLEMENTATION

Before writing any code:

1. **Read SYSTEM_DOCS.md** in the project root — understand the full architecture, routes, components, API endpoints, database collections, and deployment config.
2. **Read ROUTE_REFERENCE.md** (if it exists) — understand the route map and page structure.
3. **Identify correct files** — based on the docs, pinpoint the exact files, APIs, and database tables involved in this task. Do NOT guess file locations or API shapes.
4. **Check Known Issues** — read the Known Issues section in SYSTEM_DOCS.md to avoid re-introducing fixed bugs or conflicting with known problems.
5. **If required information is unclear:**
   - Do NOT guess or assume
   - Read the actual source code to verify
   - Grep for function names, route paths, or component names
   - Ask the user if still ambiguous

## IMPLEMENTATION

While writing code:

- **Follow existing architecture and patterns** — match the coding style, folder structure, naming conventions, and state management patterns already in the codebase.
- **Do not invent new patterns** — if the codebase uses Zustand, don't introduce Redux. If it uses Motor for MongoDB, don't add Mongoose. Match what exists.
- **Keep changes scoped** — only modify files directly relevant to the task. Do not refactor unrelated code unless explicitly asked.
- **Preserve existing fixes** — never regress on previously fixed UI issues or bugs. Check git log if unsure whether something was intentionally changed.

## POST-IMPLEMENTATION

After code changes are complete:

1. **Update SYSTEM_DOCS.md** with:
   - What changed (new routes, endpoints, components, collections)
   - Any new Known Issues discovered during implementation
   - Update the "Last Audited" date to today
   - Add entry to "Recent Changes" section (create if missing)
2. **Do NOT update ROUTE_REFERENCE.md** unless routes were actually added, removed, or changed.
3. **Verify the changes work** — run the dev server, check for errors, confirm the feature works as expected.

## RULES

- `SYSTEM_DOCS.md` is the **source of truth** for architecture understanding
- `ROUTE_REFERENCE.md` is the **reference map** for navigation and routing
- Only update documentation sections that were **actually modified or verified**
- Never mark documentation as "audited" for sections you didn't review
- When in doubt, read the code — docs may be stale
