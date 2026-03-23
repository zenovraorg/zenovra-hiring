# Documentation Loop

You are working in a production codebase with a documentation system.
Always follow this workflow.

## MODE DETECTION

Default: **NORMAL MODE**

If user says:
- "fix", "cleanup", "stabilize", "fix issues", "fix APIs"
→ Switch to **FIX MODE**

If user says:
- "rehaul", "redesign", "refactor entire", "rebuild", "rewrite", "breaking changes allowed"
→ Switch to **REHAUL MODE**

## PRE-IMPLEMENTATION (MANDATORY)

1. Read `SYSTEM_DOCS.md`
2. Read `ROUTE_REFERENCE.md` (if exists)
3. Identify:
   - Exact files to modify
   - APIs involved
   - Database tables involved
4. Check Known Issues

If anything is unclear:
- Do NOT guess
- Read actual code to confirm

## NORMAL MODE (default)

- Follow existing architecture and patterns
- Reuse existing APIs and components
- Do NOT invent routes, APIs, database tables, or schema
- Do NOT modify existing endpoints or contracts
- Keep changes minimal and scoped
- Do NOT modify unrelated files

## FIX MODE

Goal: Fix multiple issues WITHOUT breaking existing functionality

- Fix issues in small batches
- Prefer bug fixes and consistency fixes
- Do NOT redesign architecture
- Do NOT rename APIs, routes, or schema
- After each fix:
  - Verify nothing broke
  - Update `SYSTEM_DOCS.md`

If a fix requires breaking changes:
→ **STOP** and explain before proceeding

## REHAUL MODE

Goal: Perform large-scale redesign or system changes (UI, APIs, structure)

Before implementation:
1. Read `SYSTEM_DOCS.md` fully
2. Identify all impacted:
   - APIs
   - Routes
   - Components
   - Database areas
3. Clearly list:
   - What will change
   - Which APIs/routes will be modified
   - Potential risks

Then proceed ONLY after clarity.

During implementation:
- Breaking changes are allowed
- Maintain internal consistency
- Avoid partial or inconsistent updates

After implementation:
1. Update `SYSTEM_DOCS.md` with:
   - Full list of changes
   - New architecture notes
   - Updated Known Issues
   - Last Audited
2. Update `ROUTE_REFERENCE.md` if structure changed

## POST-IMPLEMENTATION (MANDATORY)

1. Verify:
   - No unintended breakage
   - System remains consistent
2. Update `SYSTEM_DOCS.md`:
   - What changed
   - Known Issues
   - Last Audited
   - Recent Changes
3. Update `ROUTE_REFERENCE.md` ONLY if routes changed
4. Update `llms.txt` / `llms-full.txt` (if they exist in `public/`) when:
   - New public-facing pages or routes are added
   - New public API endpoints are created
   - Product info, company info, or contact details change
   - New features that should be discoverable by AI apps are added
   - **ONLY add public/marketing info — NEVER add internal APIs, credentials, admin routes, or sensitive data**

## RULES

- `SYSTEM_DOCS.md` = source of truth
- `ROUTE_REFERENCE.md` = reference
- `llms.txt` / `llms-full.txt` = public AI-facing info (marketing only, no secrets)
- Never guess APIs, tables, or routes
- Only update sections you actually worked on
