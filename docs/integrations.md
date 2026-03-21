# Integration Architecture

## Current Integrations

### Firebase Authentication
- Email/password login
- ID token verification on backend via Firebase Admin SDK
- Session management via Firebase client SDK

### Firebase Storage (Pluggable)
- Resume and document uploads
- Abstracted behind a storage interface
- Can be swapped to S3 or local filesystem

## Integration Extension Points

The architecture is designed for future integrations via:

### 1. Calendar Integration
**Extension point**: `apps/api/app/services/calendar_service.py`
- Google Calendar API
- Microsoft Outlook Calendar
- Auto-create calendar events for interviews
- Availability checking

### 2. Email Integration
**Extension point**: `apps/api/app/services/email_service.py`
- Gmail API / Microsoft Graph
- Send interview invitations
- Candidate communication tracking
- Email templates

### 3. LinkedIn Integration
**Extension point**: `apps/api/app/services/linkedin_service.py`
- Candidate profile enrichment
- Job posting syndication
- LinkedIn Recruiter integration

### 4. Communication Platforms
**Extension point**: `apps/api/app/services/messaging_service.py`
- Slack notifications for pipeline events
- Microsoft Teams integration
- Webhook-based notification system

### 5. Assessment Platforms
**Extension point**: `apps/api/app/services/assessment_service.py`
- HackerRank, Codility, TestGorilla
- Auto-assign assessments
- Score synchronization

### 6. Background Check / Screening
**Extension point**: `apps/api/app/services/screening_service.py`
- Checkr, Sterling, GoodHire
- Initiate checks from offer stage
- Status tracking

### 7. HRIS / Payroll
**Extension point**: `apps/api/app/services/hris_service.py`
- BambooHR, Workday, Gusto
- Sync hired candidates to HRIS
- Department/location sync

### 8. E-Signature
**Extension point**: `apps/api/app/services/esign_service.py`
- DocuSign, HelloSign
- Send offer letters for signature
- Track signing status

## Webhook System (Future)

Architecture supports an event-driven webhook system:
```
Event → Activity Log → Webhook Dispatcher → External Endpoints
```

Events like `candidate.stage_moved`, `offer.sent`, `interview.scheduled` can trigger webhooks to external systems.
