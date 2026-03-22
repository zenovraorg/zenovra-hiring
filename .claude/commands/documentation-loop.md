# Documentation Loop

You are working in a production codebase with a documentation system.
Always follow this workflow.

## MODE DETECTION

Default: **NORMAL MODE**

If user says:
- "fix", "cleanup", "stabilize", "fix issues", "fix APIs"
→ Switch to **FIX MODE**

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

## FIX MODE (for multiple issues)

Goal: Fix issues across the system WITHOUT breaking existing functionality

- Fix issues in small batches (one area at a time)
- Prefer bug fixes, consistency fixes, and corrections
- Do NOT redesign architecture
- Do NOT rename APIs, routes, or schema
- After each fix:
  - Verify nothing else broke
  - Update `SYSTEM_DOCS.md`

If a fix requires breaking changes:
→ **STOP** and explain before proceeding

## POST-IMPLEMENTATION (MANDATORY)

1. Verify:
   - No existing functionality is broken
   - APIs and responses remain unchanged
2. Update `SYSTEM_DOCS.md`:
   - What changed
   - Any new Known Issues
   - Update Last Audited
   - Add to Recent Changes
3. Update `ROUTE_REFERENCE.md` ONLY if routes changed

## RULES

- `SYSTEM_DOCS.md` is the source of truth
- `ROUTE_REFERENCE.md` is the reference
- Never guess APIs, tables, or routes
- Only update sections you actually worked on
