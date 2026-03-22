# Zenovra Hiring — Claude Instructions

## Documentation-Driven Workflow (MANDATORY)

Every coding task MUST follow the Documentation Loop before writing any code.

### Before Any Code Change:
1. Read `SYSTEM_DOCS.md` — understand architecture, routes, APIs, database, deployment
2. Read `ROUTE_REFERENCE.md` (if exists) — understand route map
3. Identify the exact files, APIs, and database tables involved
4. Check Known Issues section to avoid regressions
5. If unclear — read actual source code. Do NOT guess.

### During Implementation:
- Follow existing patterns (React 19, Vite 6, Tailwind v4, Zustand, TanStack Query, FastAPI, Motor/MongoDB)
- Do not introduce new frameworks or patterns not already in the codebase
- Keep changes scoped to relevant files only
- Never regress on previously fixed issues

### After Implementation:
1. Update `SYSTEM_DOCS.md`: what changed, new known issues, update Last Audited date
2. Only update `ROUTE_REFERENCE.md` if routes were added/changed
3. Verify changes work — check for errors

## Project Context
- **Frontend**: React 19 + Vite 6 + Tailwind v4 + Zustand + TanStack Query + Radix UI
- **Backend**: FastAPI + Motor (MongoDB Atlas) + JWT + Firebase SSO
- **26 routes**, 35 API endpoints, 10+ MongoDB collections
- **Git**: Push to `origin` remote, `main` branch
- **Domain**: Recruitment/hiring platform for Zenovra
