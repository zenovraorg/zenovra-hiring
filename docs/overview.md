# Zenovra Hiring Platform — Product Overview

## What is Zenovra?

Zenovra is an enterprise-grade Applicant Tracking System (ATS) and Hiring Platform built for modern organizations. It provides end-to-end hiring workflow management from job requisition to offer acceptance.

## Target Users

- **Recruiters** — Manage candidates, pipeline, and scheduling
- **Hiring Managers** — Create jobs, review feedback, approve offers
- **Interviewers** — Submit scorecards and feedback
- **Executives** — View hiring health dashboards and analytics
- **Organization Admins** — Manage users, roles, settings
- **Candidates** — Apply, track applications, respond to offers

## Core Modules

1. **Dashboard** — Hiring health overview with KPIs, charts, and activity feed
2. **Job Requisitions** — Create, approve, and manage open positions
3. **Candidate Management** — Talent pool with search, filtering, and profiles
4. **ATS Pipeline** — Kanban board for tracking candidates through stages
5. **Interview Scheduling** — Schedule, assign, and track interviews
6. **Feedback & Scorecards** — Structured evaluation with ratings
7. **Assessments** — Track candidate challenges and scores
8. **Offer Management** — Build offers with approval workflows
9. **Analytics** — Funnel, source, time-to-hire, and recruiter metrics
10. **Referrals** — Employee referral tracking
11. **Notifications** — System event notifications
12. **Admin Panel** — Users, roles, departments, settings
13. **Careers Page** — Branded public job board
14. **Candidate Portal** — Application tracking for candidates

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Python + FastAPI + Pydantic
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: Firebase Authentication + Admin SDK
- **Storage**: Pluggable (local/S3/Firebase Storage)
- **Charts**: Recharts
- **State Management**: Zustand + TanStack Query
