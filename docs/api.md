# API Reference

Base URL: `/api/v1`

All endpoints require `Authorization: Bearer <firebase-id-token>` header (except health check).

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Get current authenticated user |

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard KPIs and metrics |

## Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List jobs (paginated, filterable) |
| POST | `/jobs` | Create a new job requisition |
| GET | `/jobs/{id}` | Get job details |
| PATCH | `/jobs/{id}` | Update a job |
| DELETE | `/jobs/{id}` | Soft-delete a job |

Query parameters for `GET /jobs`:
- `status` — Filter by job status
- `department_id` — Filter by department
- `page` — Page number (default: 1)
- `page_size` — Items per page (default: 20, max: 100)

## Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | List candidates (paginated, searchable) |
| POST | `/candidates` | Create a new candidate |
| GET | `/candidates/{id}` | Get candidate details |
| PATCH | `/candidates/{id}` | Update a candidate |

Query parameters for `GET /candidates`:
- `search` — Full-text search
- `page`, `page_size` — Pagination

## Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/candidates/applications` | Create a new application |
| PATCH | `/candidates/applications/{id}/move` | Move application to a new stage |

## Pipeline

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pipeline/{job_id}` | Get all applications for a job pipeline |

## Response Format

### Paginated Response
```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

### Mutation Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## Future Endpoints (Planned)

- `/interviews` — CRUD + scheduling
- `/scorecards` — Feedback submission
- `/offers` — Offer management + approvals
- `/analytics` — Advanced reporting queries
- `/notifications` — User notifications
- `/referrals` — Referral tracking
- `/admin/*` — Organization administration
