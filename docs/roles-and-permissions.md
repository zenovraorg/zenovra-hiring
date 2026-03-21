# Roles & Permissions

## Role Hierarchy

| Role | Scope | Description |
|------|-------|-------------|
| Super Admin | Platform | Full platform access across all orgs |
| Org Admin | Organization | Full access within an organization |
| Recruiter | Organization | Manage jobs, candidates, pipeline, scheduling |
| Hiring Manager | Department | Create jobs, review candidates, approve offers |
| Interviewer | Assignment | View assigned candidates, submit feedback |
| Finance/Approver | Organization | Review and approve offers/compensation |
| Executive Viewer | Organization | Read-only access to dashboards and analytics |
| Candidate | Self | Access own portal, applications, documents |

## Permission Matrix

| Action | Super Admin | Org Admin | Recruiter | Hiring Mgr | Interviewer | Finance | Executive |
|--------|:-----------:|:---------:|:---------:|:-----------:|:-----------:|:-------:|:---------:|
| Create jobs | x | x | x | x | | | |
| Edit any job | x | x | x | | | | |
| View all candidates | x | x | x | x | | | |
| Add candidates | x | x | x | x | | | |
| Move pipeline stages | x | x | x | x | | | |
| Schedule interviews | x | x | x | x | | | |
| Submit feedback | x | x | x | x | x | | |
| Create offers | x | x | x | x | | | |
| Approve offers | x | x | | | | x | |
| View analytics | x | x | x | x | | | x |
| Manage users | x | x | | | | | |
| Org settings | x | x | | | | | |
| Audit logs | x | x | | | | | |

## Implementation

RBAC is enforced at two levels:
1. **Frontend**: Route guards and UI element visibility
2. **Backend**: Middleware that checks membership role against required permissions

Membership documents link users to organizations with their role, enabling multi-tenant access control.
