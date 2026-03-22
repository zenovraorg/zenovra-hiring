# Zenovra Hiring Platform -- System Documentation

## 1. Project Overview

Zenovra Hiring is an enterprise Applicant Tracking System (ATS) built as a monorepo with two applications:

- **Frontend** (`apps/web`): React 19 SPA with Vite, Tailwind CSS v4, and a dark-themed UI
- **Backend** (`apps/api`): Python FastAPI REST API with MongoDB (Motor async driver)

The platform supports the full hiring lifecycle: job requisition creation, candidate management, pipeline tracking, interview scheduling, feedback collection, offer management, referrals, analytics, and notifications.

---

## 2. Project Structure

```
zenovra-hiring/
├── apps/
│   ├── api/                        # FastAPI backend (Python 3.12)
│   │   ├── app/
│   │   │   ├── api/v1/
│   │   │   │   ├── router.py       # Aggregates all sub-routers
│   │   │   │   └── routers/        # Individual route modules
│   │   │   │       ├── apply.py        # Public application endpoint (no auth)
│   │   │   │       ├── auth.py         # Auth / current user
│   │   │   │       ├── candidates.py   # Candidate CRUD + applications
│   │   │   │       ├── dashboard.py    # Dashboard aggregate stats
│   │   │   │       ├── feedback.py     # Interview feedback
│   │   │   │       ├── interviews.py   # Interview CRUD
│   │   │   │       ├── jobs.py         # Job requisition CRUD
│   │   │   │       ├── notifications.py# User notifications
│   │   │   │       ├── offers.py       # Offer CRUD
│   │   │   │       ├── pipeline.py     # Pipeline view per job
│   │   │   │       └── referrals.py    # Employee referrals
│   │   │   ├── core/
│   │   │   │   ├── config.py       # Pydantic Settings (env vars)
│   │   │   │   ├── database.py     # Motor MongoDB connection + indexes
│   │   │   │   └── security.py     # Firebase token verification
│   │   │   ├── models/             # Pydantic domain models
│   │   │   │   ├── base.py         # MongoBaseModel (_id, timestamps)
│   │   │   │   ├── candidate.py    # Candidate, Application
│   │   │   │   ├── interview.py    # Interview, Scorecard
│   │   │   │   ├── job.py          # JobRequisition, PipelineStage, Compensation
│   │   │   │   ├── offer.py        # Offer, OfferApproval
│   │   │   │   ├── organization.py # Organization, OrgSettings
│   │   │   │   └── user.py         # User, Membership
│   │   │   ├── repositories/       # Data access layer (MongoDB collections)
│   │   │   │   ├── base.py         # BaseRepository (CRUD, soft-delete, pagination)
│   │   │   │   ├── candidate_repository.py
│   │   │   │   ├── feedback_repository.py
│   │   │   │   ├── interview_repository.py
│   │   │   │   ├── job_repository.py
│   │   │   │   ├── notification_repository.py
│   │   │   │   ├── offer_repository.py
│   │   │   │   └── referral_repository.py
│   │   │   ├── schemas/            # Pydantic request/response schemas
│   │   │   │   ├── candidate.py    # CandidateCreate/Update, ApplicationCreate, StageMove
│   │   │   │   ├── common.py
│   │   │   │   ├── feedback.py     # FeedbackCreate
│   │   │   │   ├── interview.py    # InterviewCreate/Update
│   │   │   │   ├── job.py          # JobCreate/Update/Filter
│   │   │   │   ├── notification.py # NotificationCreate
│   │   │   │   ├── offer.py        # OfferCreate/Update
│   │   │   │   └── referral.py     # ReferralCreate
│   │   │   ├── services/           # Business logic layer
│   │   │   │   ├── candidate_service.py
│   │   │   │   ├── feedback_service.py
│   │   │   │   ├── interview_service.py
│   │   │   │   ├── job_service.py
│   │   │   │   ├── notification_service.py
│   │   │   │   ├── offer_service.py
│   │   │   │   └── referral_service.py
│   │   │   ├── scripts/
│   │   │   │   └── seed_all.py     # Database seeder
│   │   │   └── main.py             # FastAPI app entry point
│   │   ├── scripts/
│   │   │   └── seed.py             # Alternative seed script
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── Procfile                # Heroku/Railway process file
│   │   ├── railway.json            # Railway deployment config
│   │   ├── railpack.json
│   │   ├── nixpacks.toml           # Nixpacks build config (Railway)
│   │   └── runtime.txt
│   │
│   └── web/                        # React frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── providers.tsx    # React Query, Motion, Tooltip providers
│       │   │   └── router.tsx       # React Router route definitions
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── app-shell.tsx    # Main layout (sidebar + topbar + outlet)
│       │   │   │   ├── sidebar.tsx      # Collapsible sidebar navigation
│       │   │   │   └── topbar.tsx       # Top header with search, theme, user menu
│       │   │   ├── shared/
│       │   │   │   ├── animated-list.tsx
│       │   │   │   ├── command-palette.tsx  # Cmd+K command palette (cmdk)
│       │   │   │   ├── empty-state.tsx
│       │   │   │   ├── form-dialog.tsx
│       │   │   │   ├── page-header.tsx
│       │   │   │   ├── skeleton-loader.tsx
│       │   │   │   ├── stat-card.tsx
│       │   │   │   └── status-badge.tsx
│       │   │   └── ui/                 # Radix-based primitive components
│       │   │       ├── avatar.tsx
│       │   │       ├── badge.tsx
│       │   │       ├── button.tsx
│       │   │       ├── card.tsx
│       │   │       ├── dialog.tsx
│       │   │       ├── dropdown-menu.tsx
│       │   │       ├── input.tsx
│       │   │       ├── scroll-area.tsx
│       │   │       ├── separator.tsx
│       │   │       └── tooltip.tsx
│       │   ├── features/               # Feature-based page modules
│       │   │   ├── admin/
│       │   │   │   └── admin-page.tsx
│       │   │   ├── analytics/
│       │   │   │   └── analytics-page.tsx
│       │   │   ├── assessments/
│       │   │   │   └── assessments-page.tsx
│       │   │   ├── auth/
│       │   │   │   └── login-page.tsx
│       │   │   ├── candidate-portal/       # Candidate-facing portal
│       │   │   │   ├── portal-dashboard.tsx
│       │   │   │   ├── portal-documents.tsx
│       │   │   │   ├── portal-layout.tsx
│       │   │   │   └── portal-profile.tsx
│       │   │   ├── candidates/
│       │   │   │   ├── add-candidate-dialog.tsx
│       │   │   │   ├── candidate-detail-page.tsx
│       │   │   │   └── candidates-page.tsx
│       │   │   ├── careers/                # Public careers page
│       │   │   │   ├── career-apply.tsx
│       │   │   │   ├── career-job-detail.tsx
│       │   │   │   ├── career-login.tsx
│       │   │   │   └── careers-page.tsx
│       │   │   ├── dashboard/
│       │   │   │   └── dashboard-page.tsx
│       │   │   ├── feedback/
│       │   │   │   └── feedback-page.tsx
│       │   │   ├── interviews/
│       │   │   │   ├── interviews-page.tsx
│       │   │   │   └── schedule-interview-dialog.tsx
│       │   │   ├── jobs/
│       │   │   │   ├── create-job-page.tsx
│       │   │   │   ├── job-detail-page.tsx
│       │   │   │   └── jobs-page.tsx
│       │   │   ├── notifications/
│       │   │   │   └── notifications-page.tsx
│       │   │   ├── offers/
│       │   │   │   ├── create-offer-dialog.tsx
│       │   │   │   └── offers-page.tsx
│       │   │   ├── pipeline/
│       │   │   │   └── pipeline-page.tsx
│       │   │   └── referrals/
│       │   │       └── referrals-page.tsx
│       │   ├── hooks/
│       │   │   └── use-api.ts          # TanStack Query hooks for all API calls
│       │   ├── lib/
│       │   │   ├── api-client.ts       # Fetch-based HTTP client with auth
│       │   │   ├── demo-data.ts        # Comprehensive demo/seed data
│       │   │   ├── firebase.ts         # Firebase Auth + Storage init
│       │   │   ├── motion.ts           # Framer Motion animation presets
│       │   │   └── utils.ts            # cn(), formatDate, slugify, etc.
│       │   ├── stores/
│       │   │   └── app-store.ts        # Zustand global state (auth, UI, notifications)
│       │   ├── styles/
│       │   │   └── globals.css
│       │   ├── types/
│       │   │   └── index.ts            # All TypeScript interfaces
│       │   └── main.tsx                # React DOM entry point
│       ├── public/
│       │   └── symbol.png              # Zenovra logo
│       ├── dist/                       # Built output
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── postcss.config.js
│
├── docker/
│   ├── Dockerfile.api              # Python 3.12 slim, uvicorn
│   ├── Dockerfile.web              # Node 20 build -> nginx static
│   └── nginx.conf                  # SPA fallback + /api/ reverse proxy
│
├── docs/                           # Hand-written documentation
│   ├── overview.md
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── design-system.md
│   ├── integrations.md
│   ├── roles-and-permissions.md
│   └── setup.md
│
├── docker-compose.yml              # MongoDB + API + Web orchestration
├── package.json                    # Root monorepo scripts
├── .env.example                    # Environment variable template
└── .gitignore
```

---

## 3. Tech Stack

### Frontend
| Category | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Build Tool | Vite | 6.2.x |
| Language | TypeScript | 5.8.x |
| Routing | React Router DOM | 7.13.x |
| State Management | Zustand | 5.x |
| Data Fetching | TanStack React Query | 5.x |
| HTTP Client | Native `fetch` (custom wrapper) | -- |
| Styling | Tailwind CSS | 4.x |
| UI Primitives | Radix UI (Avatar, Dialog, Dropdown, Scroll Area, Separator, Slot, Tooltip) | various |
| Animations | Motion (Framer Motion) | 12.x |
| Charts | Recharts | 3.8.x |
| Command Palette | cmdk | 1.x |
| Icons | Lucide React | 0.546.x |
| Auth | Firebase Auth | 12.x |
| AI | Google GenAI SDK | 1.29.x |
| Utilities | clsx, tailwind-merge, class-variance-authority | various |

### Backend
| Category | Technology | Version |
|---|---|---|
| Framework | FastAPI | 0.115.x |
| Server | Uvicorn | 0.32.x |
| Database Driver | Motor (async MongoDB) | 3.6.x |
| Database | MongoDB | 7.x |
| Validation | Pydantic | 2.9.x |
| Settings | Pydantic Settings | 2.6.x |
| Auth | Firebase Admin SDK | 6.5.x |
| JWT | python-jose | 3.3.x |
| File Storage | boto3 (S3), local filesystem | 1.34.x |
| HTTP Client | httpx | 0.27.x |
| Python | 3.12 | -- |

---

## 4. Frontend Routes

All routes defined in `apps/web/src/app/router.tsx` via `createBrowserRouter`.

### Public Routes (no auth required)
| Path | Component | Description |
|---|---|---|
| `/login` | `LoginPage` | Admin/recruiter login |
| `/careers` | `CareersPage` | Public careers listing page |
| `/careers/:id` | `CareerJobDetail` | Public job detail view |
| `/careers/:id/apply` | `CareerApply` | Public job application form |
| `/careers/login` | `CareerLogin` | Candidate portal login |

### Candidate Portal Routes
| Path | Component | Description |
|---|---|---|
| `/portal` | `PortalLayout` > `PortalDashboard` | Candidate portal dashboard (index) |
| `/portal/documents` | `PortalDocuments` | Candidate document management |
| `/portal/profile` | `PortalProfile` | Candidate profile editing |

### Authenticated Admin Routes (inside `AppShell`)
| Path | Component | Description |
|---|---|---|
| `/` | Redirects to `/careers` | Root redirect |
| `/dashboard` | `DashboardPage` | Overview stats, pipeline, activity feed |
| `/jobs` | `JobsPage` | Job requisition listing |
| `/jobs/new` | `CreateJobPage` | Create new job requisition |
| `/jobs/:id` | `JobDetailPage` | Single job detail view |
| `/candidates` | `CandidatesPage` | Candidate listing with search |
| `/candidates/:id` | `CandidateDetailPage` | Single candidate profile and history |
| `/pipeline` | `PipelinePage` | Kanban-style pipeline board |
| `/interviews` | `InterviewsPage` | Interview schedule listing |
| `/feedback` | `FeedbackPage` | Interview feedback listing |
| `/assessments` | `AssessmentsPage` | Candidate assessments |
| `/offers` | `OffersPage` | Offer management listing |
| `/analytics` | `AnalyticsPage` | Hiring analytics and metrics |
| `/notifications` | `NotificationsPage` | User notification feed |
| `/referrals` | `ReferralsPage` | Employee referral tracking |
| `/admin` | `AdminPage` | Admin panel / profile settings |
| `/admin/settings` | `AdminPage` | Organization settings |

---

## 5. API Endpoints

Base prefix: `/api/v1` (configured via `Settings.api_prefix`)

All endpoints except `/apply` and `/health` require Firebase Bearer token auth.

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check (returns `{"status": "healthy"}`) |

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/auth/me` | Yes | Returns current user from Firebase token |

### Dashboard (`/api/v1/dashboard`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/dashboard/stats` | Yes | Aggregate stats: open jobs, candidates, applications, offers, pipeline |

### Jobs (`/api/v1/jobs`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/jobs` | Yes | List jobs (filterable by `status`, `department_id`; paginated) |
| `POST` | `/jobs` | Yes | Create job requisition |
| `GET` | `/jobs/{job_id}` | Yes | Get single job |
| `PATCH` | `/jobs/{job_id}` | Yes | Update job |
| `DELETE` | `/jobs/{job_id}` | Yes | Soft-delete job |

### Candidates (`/api/v1/candidates`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/candidates` | Yes | List candidates (searchable, paginated) |
| `POST` | `/candidates` | Yes | Create candidate |
| `GET` | `/candidates/{candidate_id}` | Yes | Get single candidate |
| `PATCH` | `/candidates/{candidate_id}` | Yes | Update candidate |
| `POST` | `/candidates/applications` | Yes | Create application (link candidate to job) |
| `PATCH` | `/candidates/applications/{application_id}/move` | Yes | Move application to a different pipeline stage |

### Pipeline (`/api/v1/pipeline`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/pipeline/{job_id}` | Yes | Get all applications for a job (for Kanban view) |

### Interviews (`/api/v1/interviews`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/interviews` | Yes | List interviews (filterable by `job_id`, `status`; paginated) |
| `POST` | `/interviews` | Yes | Create interview |
| `GET` | `/interviews/{interview_id}` | Yes | Get single interview |
| `PATCH` | `/interviews/{interview_id}` | Yes | Update interview |
| `DELETE` | `/interviews/{interview_id}` | Yes | Soft-delete interview |

### Offers (`/api/v1/offers`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/offers` | Yes | List offers (filterable by `status`, `candidate_id`; paginated) |
| `POST` | `/offers` | Yes | Create offer |
| `GET` | `/offers/{offer_id}` | Yes | Get single offer |
| `PATCH` | `/offers/{offer_id}` | Yes | Update offer |
| `DELETE` | `/offers/{offer_id}` | Yes | Soft-delete offer |

### Feedback (`/api/v1/feedback`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/feedback` | Yes | List feedback (filterable by `candidate_id`, `job_id`; paginated) |
| `POST` | `/feedback` | Yes | Create feedback entry |
| `GET` | `/feedback/{feedback_id}` | Yes | Get single feedback |

### Notifications (`/api/v1/notifications`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | Yes | List notifications for current user (paginated) |
| `POST` | `/notifications` | Yes | Create notification |
| `PATCH` | `/notifications/read-all` | Yes | Mark all notifications as read |
| `PATCH` | `/notifications/{notification_id}/read` | Yes | Mark single notification as read |

### Referrals (`/api/v1/referrals`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/referrals` | Yes | List referrals (filterable by `status`, `job_id`; paginated) |
| `POST` | `/referrals` | Yes | Create referral |
| `GET` | `/referrals/{referral_id}` | Yes | Get single referral |

### Public Apply (`/api/v1/apply`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/apply` | **No** | Public application submission (creates candidate + application) |
| `GET` | `/apply/my-applications?email=...` | **No** | Get applications by candidate email (for portal) |

---

## 6. Data Models / MongoDB Collections

All models extend `MongoBaseModel` which provides `_id` (string), `created_at`, `updated_at`.

### organizations
| Field | Type | Notes |
|---|---|---|
| name | string | |
| slug | string | unique |
| logo_url | string? | |
| domain | string? | |
| industry | string? | |
| size | string? | |
| settings | OrgSettings | branding + hiring config |

### users
| Field | Type | Notes |
|---|---|---|
| email | string | unique |
| display_name | string | |
| avatar_url | string? | |
| firebase_uid | string | unique |
| is_active | boolean | |

### memberships
| Field | Type | Notes |
|---|---|---|
| user_id | string | |
| org_id | string | |
| role | string | super_admin, org_admin, recruiter, hiring_manager, interviewer, finance_approver, executive_viewer |
| department_id | string? | |
| is_active | boolean | |

### job_requisitions
| Field | Type | Notes |
|---|---|---|
| org_id | string | |
| title | string | |
| slug | string | unique per org |
| department_id | string | |
| location_id | string | |
| hiring_manager_id | string | |
| recruiter_id | string? | |
| status | string | draft, pending_approval, open, on_hold, closed, cancelled |
| employment_type | string | full_time, part_time, contract, internship |
| experience_level | string | entry, mid, senior, lead, executive |
| description | string | |
| requirements | string[] | |
| nice_to_haves | string[] | |
| compensation | Compensation | min/max salary, currency, equity, bonus |
| pipeline_stages | PipelineStage[] | Embedded array of stage definitions |
| headcount | int | |
| filled_count | int | |
| candidate_count | int | |
| is_remote | boolean | |
| is_published | boolean | |
| is_deleted | boolean | Soft delete flag |

### candidates
| Field | Type | Notes |
|---|---|---|
| org_id | string | |
| first_name | string | |
| last_name | string | |
| email | string | unique per org |
| phone | string? | |
| headline | string? | |
| location | string? | |
| linkedin_url | string? | |
| portfolio_url | string? | |
| source | string | direct, referral, linkedin, agency, careers_page, other |
| tags | string[] | |
| skills | string[] | |
| experience_years | int? | |
| current_company | string? | |
| current_title | string? | |
| resume_url | string? | |
| is_deleted | boolean | |

### applications
| Field | Type | Notes |
|---|---|---|
| candidate_id | string | |
| job_id | string | |
| org_id | string | |
| stage_id | string | Links to a pipeline_stage.id within the job |
| status | string | new, screening, interviewing, offer, hired, rejected, withdrawn |
| source | string | |
| cover_letter | string? | |
| is_deleted | boolean | |

### interviews
| Field | Type | Notes |
|---|---|---|
| application_id | string | |
| org_id | string | |
| title | string | |
| type | string | phone_screen, technical, behavioral, culture_fit, panel, final, other |
| status | string | scheduled, in_progress, completed, cancelled, no_show |
| scheduled_at | string | ISO datetime |
| duration_minutes | int | |
| location | string? | |
| meeting_link | string? | |
| interviewers | InterviewParticipant[] | user_id, role, feedback_submitted |

### offers
| Field | Type | Notes |
|---|---|---|
| application_id | string | |
| org_id | string | |
| status | string | draft, pending_approval, approved, sent, accepted, declined, expired, withdrawn |
| title | string | |
| department | string | |
| start_date | string | |
| base_salary | int | |
| currency | string | default: USD |
| bonus | int? | |
| equity | string? | |
| benefits | string[] | |
| approvals | OfferApproval[] | approver_id, status, comment |
| version | int | |
| expires_at | string? | |

### notifications
| Field | Type | Notes |
|---|---|---|
| user_id | string | |
| org_id | string | |
| type | string | |
| title | string | |
| message | string | |
| link | string? | |
| is_read | boolean | |

### referrals
| Field | Type | Notes |
|---|---|---|
| org_id | string | |
| referrer_id | string | |
| candidate_id | string | |
| job_id | string? | |
| status | string | submitted, reviewing, accepted, rejected, hired |
| notes | string? | |

### Other collections (indexed but no dedicated model files)
- `activity_logs` -- Audit trail of user actions
- `audit_logs` -- Compliance audit trail

---

## 7. Component Reference

### Layout Components
| Component | File | Description |
|---|---|---|
| `AppShell` | `components/layout/app-shell.tsx` | Root layout with sidebar, topbar, decorative background gradients, and outlet for child routes |
| `Sidebar` | `components/layout/sidebar.tsx` | Collapsible left navigation with three sections (Main Menu, Operations, System) plus Public Careers link. Uses Motion `layoutId` for animated active indicator. |
| `Topbar` | `components/layout/topbar.tsx` | Top header bar with Cmd+K search trigger, theme toggle, notification bell, and user dropdown menu |

### Shared Components
| Component | File | Description |
|---|---|---|
| `CommandPalette` | `shared/command-palette.tsx` | Global Cmd+K command palette using `cmdk` |
| `AnimatedList` | `shared/animated-list.tsx` | Motion-animated list wrapper |
| `EmptyState` | `shared/empty-state.tsx` | Empty state placeholder with icon + message |
| `FormDialog` | `shared/form-dialog.tsx` | Reusable dialog wrapper for form modals |
| `PageHeader` | `shared/page-header.tsx` | Consistent page header with title and actions |
| `SkeletonLoader` | `shared/skeleton-loader.tsx` | Loading skeleton placeholder |
| `StatCard` | `shared/stat-card.tsx` | Metric display card used on dashboard |
| `StatusBadge` | `shared/status-badge.tsx` | Color-coded status indicator badge |

### UI Primitives (Radix-based)
`avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `scroll-area.tsx`, `separator.tsx`, `tooltip.tsx`

### Feature Pages
| Feature | Components | Description |
|---|---|---|
| Auth | `login-page.tsx` | Firebase-based login |
| Dashboard | `dashboard-page.tsx` | Stats cards, pipeline funnel, hires chart, activity feed |
| Jobs | `jobs-page.tsx`, `create-job-page.tsx`, `job-detail-page.tsx` | Full CRUD for job requisitions |
| Candidates | `candidates-page.tsx`, `candidate-detail-page.tsx`, `add-candidate-dialog.tsx` | Candidate management with search |
| Pipeline | `pipeline-page.tsx` | Kanban board for applications per job |
| Interviews | `interviews-page.tsx`, `schedule-interview-dialog.tsx` | Interview scheduling and listing |
| Feedback | `feedback-page.tsx` | Interview feedback/scorecard management |
| Assessments | `assessments-page.tsx` | Candidate assessments view |
| Offers | `offers-page.tsx`, `create-offer-dialog.tsx` | Offer creation, approval flow, tracking |
| Analytics | `analytics-page.tsx` | Hiring metrics and charts |
| Notifications | `notifications-page.tsx` | User notification feed with mark-read |
| Referrals | `referrals-page.tsx` | Employee referral tracking |
| Admin | `admin-page.tsx` | Profile and organization settings |
| Careers (Public) | `careers-page.tsx`, `career-job-detail.tsx`, `career-apply.tsx`, `career-login.tsx` | Public-facing careers site |
| Candidate Portal | `portal-layout.tsx`, `portal-dashboard.tsx`, `portal-documents.tsx`, `portal-profile.tsx` | Candidate self-service portal |

---

## 8. State Management

### Zustand Store (`app-store.ts`)
Global application state managed via a single Zustand store:

- **Auth state**: `user`, `membership`, `organization`, `isAuthenticated`, `isLoading`
- **UI state**: `sidebarCollapsed`, `commandPaletteOpen`, `notificationTrayOpen`, `theme` (light/dark/system)
- **Notifications**: `notifications[]`, `unreadCount`
- **Actions**: `setUser`, `toggleSidebar`, `setTheme`, `markNotificationRead`, `logout`, etc.

Default state is pre-populated with a demo admin user (`narasimharao@zenovra.org`, role: `super_admin`).

### React Query (TanStack Query)
Server state managed via React Query hooks in `hooks/use-api.ts`:
- Queries: `useJobs`, `useJob`, `useCandidates`, `useCandidate`, `usePipeline`, `useInterviews`, `useOffers`, `useNotifications`, `useFeedback`, `useReferrals`, `useDashboardStats`
- Mutations: `useCreateJob`, `useCreateCandidate`, `useMoveApplication`, `useCreateInterview`, `useCreateOffer`, `useCreateFeedback`, `useCreateReferral`, `useMarkNotificationRead`, `useMarkAllRead`
- Config: 2-minute stale time, 1 retry, no refetch on window focus

---

## 9. Authentication

### Backend
- Firebase Admin SDK verifies Bearer tokens via `verify_firebase_token` dependency
- **Debug mode fallback**: When `DEBUG=true`, accepts `demo-token` and falls back to a hardcoded admin user if Firebase verification fails
- Token provides `uid`, `email`, `name` from Firebase claims

### Frontend
- Firebase Auth client SDK initialized in `lib/firebase.ts`
- API client (`lib/api-client.ts`) auto-attaches Bearer token from `auth.currentUser.getIdToken()`
- Falls back to `demo-token` when Firebase is not configured
- Firebase emulator support available via `VITE_USE_FIREBASE_EMULATOR=true`

---

## 10. Environment Variables

### Backend (`.env` / system env)
| Variable | Description | Default |
|---|---|---|
| `DEBUG` | Enable debug mode (bypasses strict auth) | `true` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `hiring` |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account JSON | (empty) |
| `FIREBASE_PROJECT_ID` | Firebase project ID | (empty) |
| `STORAGE_BACKEND` | Storage type: `local`, `s3`, or `firebase` | `local` |
| `STORAGE_BUCKET` | S3/Firebase storage bucket name | (empty) |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 storage | (empty) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 storage | (empty) |
| `AWS_REGION` | AWS region for S3 | `us-east-1` |
| `LOCAL_STORAGE_PATH` | Local file storage path | `./uploads` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["*"]` |

### Frontend (`.env.local` / `VITE_` prefixed)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | API base URL | `/api/v1` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `demo-api-key` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `demo.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `demo-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `demo.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `000000000000` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:000:web:000` |
| `VITE_USE_FIREBASE_EMULATOR` | Connect to Firebase Auth emulator | `false` |
| `GEMINI_API_KEY` | Google GenAI API key (exposed via Vite define) | -- |

---

## 11. Database Architecture

- **Database**: MongoDB 7.x
- **Driver**: Motor (async) with PyMongo
- **ID Strategy**: String-casted `ObjectId` stored as `_id` field
- **Soft Deletes**: All entities use `is_deleted` flag; queries filter `is_deleted: {$ne: true}`
- **Multi-tenancy**: All entities scoped by `org_id` (currently hardcoded to `"org1"`)

### Indexes (created on startup in `database.py`)
- `organizations`: unique on `slug`, indexed on `domain`
- `users`: unique on `email` and `firebase_uid`
- `memberships`: unique compound `(user_id, org_id)`, indexed on `org_id`
- `job_requisitions`: compound `(org_id, status)`, unique compound `(org_id, slug)`, compound `(org_id, department_id)`, text index on `(title, description)`
- `candidates`: unique compound `(org_id, email)`, text index on `(first_name, last_name, email, headline)`, compound `(org_id, created_at)`
- `applications`: compound `(org_id, job_id)`, compound `(org_id, candidate_id)`, compound `(org_id, stage_id)`
- `interviews`: compound `(org_id, scheduled_at)`, indexed on `application_id`
- `offers`: compound `(org_id, status)`, indexed on `application_id`
- `activity_logs`: compound `(org_id, created_at)`
- `audit_logs`: compound `(org_id, created_at)`
- `notifications`: compound `(user_id, is_read, created_at)`
- `referrals`: compound `(org_id, referrer_id)`

---

## 12. Backend Architecture Pattern

The API follows a three-layer architecture:

1. **Router Layer** (`api/v1/routers/`) -- FastAPI route handlers, request validation, HTTP concerns
2. **Service Layer** (`services/`) -- Business logic, validation, orchestration
3. **Repository Layer** (`repositories/`) -- Data access, MongoDB queries, pagination

`BaseRepository` provides standard CRUD operations: `create`, `get_by_id`, `update`, `soft_delete`, `list` (with pagination and sorting), `count`.

---

## 13. CORS Configuration

Hardcoded allowed origins in `main.py`:
- `https://hiring.zenovra.org` (production)
- `https://zenovra-hiring.pages.dev` (Cloudflare Pages)
- `http://localhost:3000` (local dev frontend)
- `http://localhost:5173` (Vite default port)

---

## 14. Deployment Configuration

### Frontend
- **Vercel**: Configured via `.vercel/project.json` (project: `web`, org: `team_FS72qADdQdgEAynh8pjXO4Tu`)
- **Cloudflare Pages**: Inferred from CORS origin `zenovra-hiring.pages.dev`
- **Docker**: Multi-stage build (Node 20 build -> nginx:alpine static serving)

### Backend
- **Railway**: Configured via `railway.json` + `nixpacks.toml` (Python 3.12, uvicorn)
- **Heroku-compatible**: `Procfile` present (`web: uvicorn app.main:app --host 0.0.0.0 --port 8000`)
- **Docker**: Python 3.12 slim with uvicorn

### Docker Compose (local development)
Three services:
- `mongodb`: MongoDB 7, port 27017, persistent volume
- `api`: FastAPI, port 8000, connects to internal MongoDB
- `web`: nginx, port 80, proxies `/api/` to `api:8000`

### Nginx Config
- SPA fallback: `try_files $uri $uri/ /index.html`
- Reverse proxy: `/api/` -> `http://api:8000`
- Health proxy: `/health` -> `http://api:8000`
- Gzip enabled for text/css/json/js/xml

---

## 15. Roles and Permissions

Defined in `types/index.ts` and `models/user.py`:

| Role | Description |
|---|---|
| `super_admin` | Full system access |
| `org_admin` | Organization-level admin |
| `recruiter` | Manages jobs, candidates, pipeline |
| `hiring_manager` | Reviews candidates for their department |
| `interviewer` | Conducts interviews, submits feedback |
| `finance_approver` | Approves offers |
| `executive_viewer` | Read-only analytics access |
| `candidate` | External candidate (portal access) |

**Note**: Role-based access control is defined in the data model but not yet enforced at the API level. All authenticated users currently have full access. The `org_id` is also hardcoded to `"org1"` across all endpoints (marked with `TODO` comments).

---

## 16. Known TODOs and Limitations

1. **Multi-tenancy incomplete**: `org_id` is hardcoded to `"org1"` in all routers; should be resolved from token/membership
2. **RBAC not enforced**: Role-based permissions exist in the data model but are not checked at the API layer
3. **Demo mode default**: The system ships with `DEBUG=true` and demo token authentication, requiring no real Firebase setup
4. **No file upload endpoint**: `resume_url` and `avatar_url` fields exist but there is no file upload API endpoint
5. **Assessments**: Page exists on frontend but no corresponding backend API
6. **No WebSocket/SSE**: Notifications are poll-based via React Query, no real-time push
7. **Pipeline stages are embedded**: Stored inside `job_requisitions`, not as separate collection

---

## 17. Recent Changes

### Full UI Revamp (2026-03-22) -- REHAUL MODE

**Scope**: Complete frontend visual redesign across all pages, components, and design tokens.

**Design System Changes**:
- **Typography**: Switched display font from Outfit to Plus Jakarta Sans for a more premium SaaS feel
- **Color System**: Refined dark theme with deeper blacks (hsl 240 15% 3.5%), more subtle surface tiers (0.025/0.045/0.065 opacity steps), and violet accent additions
- **Elevation**: Replaced heavy shadow system with subtle border-opacity transitions
- **Radius**: Standardized to rounded-2xl (1rem) for cards, rounded-xl for inputs/buttons, rounded-lg for badges
- **Spacing**: Tighter, more information-dense layout with reduced padding
- **Animations**: Faster, more subtle -- 200ms transitions, spring physics for layout animations, reduced stagger delays

**Component Changes**:
- Button: Added `gradient` variant (indigo-to-violet), refined all variant colors, added cursor-pointer
- Card: Simplified to minimal bg-white/[0.025] with 0.06 opacity borders
- Badge: Rounded-lg instead of rounded-full, refined color variants
- Input: Indigo focus ring, refined placeholder colors
- Dialog: Rounded-2xl, refined overlay opacity
- Tooltip: Light background (white/95%) for better readability
- Sidebar: Reduced width (252px/72px), single layoutId for active state, gradient accent bar
- Topbar: Reduced height (56px), more compact user menu
- StatCard: Gradient icon backgrounds, removed hover scale animations
- PageHeader: Smaller title size (text-xl), font-display class
- CommandPalette: Refined spacing, better contrast

**Pages Updated**: All 25+ pages updated with consistent design language:
- Dashboard, Jobs, Job Detail, Create Job, Candidates, Candidate Detail
- Pipeline, Interviews, Feedback, Assessments, Offers
- Analytics, Notifications, Referrals, Admin
- Login, Careers (public), Career Detail, Career Apply, Career Login
- Candidate Portal (Dashboard, Profile, Documents)

**Anti-patterns Removed**:
- Removed whileHover scale animations on buttons (causes jank)
- Removed whileHover y-offset on cards (CSS transitions only)
- Removed excessive motion delays (capped at 0.3s)
- Removed premium-card utility class (replaced with direct Tailwind classes)

**No API/backend changes**. No route changes. No functionality changes.

Last Audited: 2026-03-22
