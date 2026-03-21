# MongoDB Data Model

## Design Principles

- **Embed** when data is read together and doesn't grow unbounded
- **Reference** when data is shared across entities or grows large
- **Soft delete** for recoverable business data (jobs, candidates)
- **Text indexes** for searchable fields (ready for Elasticsearch migration)
- **Compound indexes** for org-scoped queries

## Collections

### organizations
```
{
  _id: string,
  name: string,
  slug: string (unique),
  logo_url?: string,
  domain?: string,
  industry?: string,
  size?: string,
  settings: {
    branding: { primary_color, logo_url, careers_page_title },
    hiring: { default_pipeline_id, require_job_approval, require_offer_approval }
  },
  created_at, updated_at
}
Indexes: slug (unique), domain
```

### users
```
{
  _id: string,
  email: string (unique),
  display_name: string,
  avatar_url?: string,
  firebase_uid: string (unique),
  is_active: boolean,
  created_at, updated_at
}
Indexes: email (unique), firebase_uid (unique)
```

### memberships
```
{
  _id: string,
  user_id: string,
  org_id: string,
  role: enum (super_admin | org_admin | recruiter | hiring_manager | interviewer | finance_approver | executive_viewer),
  department_id?: string,
  is_active: boolean,
  joined_at: datetime,
  created_at, updated_at
}
Indexes: (user_id, org_id) unique, org_id
```

### job_requisitions
```
{
  _id: string,
  org_id: string,
  title: string,
  slug: string,
  department_id: string,
  location_id: string,
  hiring_manager_id: string,
  recruiter_id?: string,
  status: enum (draft | pending_approval | open | on_hold | closed | cancelled),
  employment_type: enum,
  experience_level: enum,
  description: string,
  requirements: string[],
  nice_to_haves: string[],
  compensation: { min_salary, max_salary, currency, equity, bonus },
  pipeline_stages: [{ id, name, order, type, color }],  // embedded
  headcount: number,
  filled_count: number,
  candidate_count: number,
  is_remote: boolean,
  is_published: boolean,
  is_deleted: boolean,
  created_at, updated_at
}
Indexes: (org_id, status), (org_id, slug) unique, (org_id, department_id), text(title, description)
```

### candidates
```
{
  _id: string,
  org_id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone?: string,
  headline?: string,
  location?: string,
  source: enum,
  tags: string[],
  skills: string[],
  experience_years?: number,
  current_company?: string,
  current_title?: string,
  resume_url?: string,
  owner_id?: string,
  is_deleted: boolean,
  created_at, updated_at
}
Indexes: (org_id, email) unique, text(first_name, last_name, email, headline), (org_id, created_at)
```

### applications
```
{
  _id: string,
  candidate_id: string,
  job_id: string,
  org_id: string,
  stage_id: string,
  status: enum (new | screening | interviewing | offer | hired | rejected | withdrawn),
  applied_at: datetime,
  moved_at: datetime,
  rejected_reason?: string,
  source: string,
  created_at, updated_at
}
Indexes: (org_id, job_id), (org_id, candidate_id), (org_id, stage_id)
```

### interviews
```
{
  _id: string,
  application_id: string,
  org_id: string,
  title: string,
  type: enum,
  status: enum,
  scheduled_at: datetime,
  duration_minutes: number,
  location?: string,
  meeting_link?: string,
  interviewers: [{ user_id, role, feedback_submitted }],  // embedded
  notes?: string,
  created_at, updated_at
}
Indexes: (org_id, scheduled_at), application_id
```

### scorecards
```
{
  _id: string,
  interview_id: string,
  interviewer_id: string,
  overall_rating: number,
  recommendation: enum,
  criteria: [{ name, rating, notes }],  // embedded
  summary: string,
  submitted_at: datetime,
  created_at, updated_at
}
```

### offers
```
{
  _id: string,
  application_id: string,
  org_id: string,
  status: enum,
  title: string,
  department: string,
  start_date: date,
  base_salary: number,
  currency: string,
  bonus?: number,
  equity?: string,
  benefits: string[],
  approvals: [{ approver_id, status, comment, decided_at }],  // embedded
  version: number,
  expires_at?: datetime,
  created_at, updated_at
}
Indexes: (org_id, status), application_id
```

### activity_logs / audit_logs / notifications / referrals
All follow similar patterns with org_id scoping and timestamp-based indexes.

## Embedding vs Referencing Decisions

| Data | Strategy | Rationale |
|------|----------|-----------|
| Pipeline stages | Embedded in job | Read together, bounded (6-8 stages) |
| Interview participants | Embedded in interview | Small, always fetched with interview |
| Offer approvals | Embedded in offer | Small, read with offer |
| Scorecard criteria | Embedded in scorecard | Always accessed together |
| Candidate applications | Referenced | Can grow, queried independently |
| Department/location | Referenced | Shared across many jobs |
