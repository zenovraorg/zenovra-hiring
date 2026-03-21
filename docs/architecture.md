# Architecture Guide

## Monorepo Structure

```
zenovra-hiring/
├── apps/
│   ├── web/                    # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── app/            # Router, providers
│   │   │   ├── components/
│   │   │   │   ├── layout/     # AppShell, Sidebar, Topbar
│   │   │   │   ├── shared/     # Reusable components
│   │   │   │   └── ui/         # shadcn/ui primitives
│   │   │   ├── features/       # Feature modules (dashboard, jobs, etc.)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities, API client, Firebase, motion
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── styles/         # Global CSS, design tokens
│   │   │   └── types/          # TypeScript type definitions
│   │   └── ...config files
│   └── api/                    # FastAPI backend
│       └── app/
│           ├── api/v1/routers/ # Route handlers
│           ├── core/           # Config, database, security
│           ├── models/         # MongoDB document models
│           ├── schemas/        # Pydantic request/response schemas
│           ├── services/       # Business logic
│           ├── repositories/   # Data access layer
│           └── background/     # Background job infrastructure
├── docker/                     # Docker configuration
├── docs/                       # Documentation
└── docker-compose.yml
```

## Frontend Architecture

### Layout System
- `AppShell` wraps all authenticated pages with sidebar + topbar
- Sidebar supports collapsible mode with tooltip navigation
- Command palette (⌘K) for quick navigation
- Page transitions via Framer Motion

### Feature Modules
Each feature is self-contained in `src/features/<module>/`:
- Page components
- Feature-specific hooks (future)
- Feature-specific types (future)

### State Management
- **Server state**: TanStack Query for API data
- **Client state**: Zustand for UI state (sidebar, theme, auth)
- **Form state**: React Hook Form + Zod validation

### Design System
- Built on shadcn/ui + Radix primitives
- Tailwind CSS with custom design tokens
- CSS variables for theming (light/dark)
- Framer Motion for animations

## Backend Architecture

### Layered Architecture
```
Routers → Services → Repositories → MongoDB
```

- **Routers**: HTTP request handling, validation, response formatting
- **Services**: Business logic, orchestration
- **Repositories**: Data access, queries, CRUD operations
- **Models**: MongoDB document schemas (Pydantic)

### Authentication Flow
1. Frontend authenticates via Firebase Auth
2. Firebase ID token sent in Authorization header
3. Backend verifies token via Firebase Admin SDK
4. User/membership resolved for org-scoped access
5. RBAC checks applied per endpoint

### Database Design
- MongoDB with async Motor driver
- Strategic indexing for performance
- Soft deletion for recoverable data
- Text indexes for search capability
- Designed for future migration to Elasticsearch

## Deployment

### Docker Compose (Development)
```bash
docker-compose up
```
Starts MongoDB, API server, and Nginx-served frontend.

### Production Considerations
- Use managed MongoDB (Atlas)
- Deploy API behind a load balancer
- Serve frontend via CDN
- Configure Firebase for production
- Set up proper CORS origins
- Enable audit logging
