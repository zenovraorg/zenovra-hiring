// Core entity types for the Zenovra Hiring Platform

export type Role =
  | 'super_admin'
  | 'org_admin'
  | 'recruiter'
  | 'hiring_manager'
  | 'interviewer'
  | 'finance_approver'
  | 'executive_viewer'
  | 'candidate';

export type JobStatus = 'draft' | 'pending_approval' | 'open' | 'on_hold' | 'closed' | 'cancelled';
export type ApplicationStatus = 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
export type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type OfferStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'declined' | 'expired' | 'withdrawn';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  firebase_uid: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  domain?: string;
  industry?: string;
  size?: string;
  settings: OrgSettings;
  created_at: string;
}

export interface OrgSettings {
  branding: {
    primary_color: string;
    logo_url?: string;
    careers_page_title?: string;
  };
  hiring: {
    default_pipeline_id?: string;
    require_job_approval: boolean;
    require_offer_approval: boolean;
  };
}

export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: Role;
  department_id?: string;
  is_active: boolean;
  joined_at: string;
  user?: User;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  head_id?: string;
  parent_id?: string;
}

export interface Location {
  id: string;
  org_id: string;
  name: string;
  city?: string;
  state?: string;
  country: string;
  is_remote: boolean;
}

export interface JobRequisition {
  id: string;
  org_id: string;
  title: string;
  slug: string;
  department_id: string;
  department?: Department;
  location_id: string;
  location?: Location;
  hiring_manager_id: string;
  hiring_manager?: User;
  recruiter_id?: string;
  recruiter?: User;
  status: JobStatus;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  description: string;
  requirements: string[];
  nice_to_haves: string[];
  compensation: {
    min_salary?: number;
    max_salary?: number;
    currency: string;
    equity?: string;
    bonus?: string;
  };
  pipeline_stages: PipelineStage[];
  headcount: number;
  filled_count: number;
  candidate_count: number;
  is_remote: boolean;
  is_published: boolean;
  published_at?: string;
  closes_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  type: 'sourced' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'custom';
  color: string;
}

export interface Candidate {
  id: string;
  org_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  headline?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  source: 'direct' | 'referral' | 'linkedin' | 'agency' | 'careers_page' | 'other';
  source_detail?: string;
  tags: string[];
  skills: string[];
  experience_years?: number;
  current_company?: string;
  current_title?: string;
  resume_url?: string;
  owner_id?: string;
  owner?: User;
  applications: Application[];
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  candidate?: Candidate;
  job_id: string;
  job?: JobRequisition;
  org_id: string;
  stage_id: string;
  stage?: PipelineStage;
  status: ApplicationStatus;
  applied_at: string;
  moved_at: string;
  rejected_reason?: string;
  source: string;
}

export interface Interview {
  id: string;
  application_id: string;
  application?: Application;
  org_id: string;
  title: string;
  type: 'phone_screen' | 'technical' | 'behavioral' | 'culture_fit' | 'panel' | 'final' | 'other';
  status: InterviewStatus;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewers: InterviewParticipant[];
  notes?: string;
  created_at: string;
}

export interface InterviewParticipant {
  user_id: string;
  user?: User;
  role: 'lead' | 'shadow' | 'participant';
  feedback_submitted: boolean;
}

export interface Scorecard {
  id: string;
  interview_id: string;
  interviewer_id: string;
  interviewer?: User;
  overall_rating: number;
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  criteria: ScorecardCriteria[];
  summary: string;
  submitted_at: string;
}

export interface ScorecardCriteria {
  name: string;
  rating: number;
  notes?: string;
}

export interface Offer {
  id: string;
  application_id: string;
  application?: Application;
  org_id: string;
  status: OfferStatus;
  title: string;
  department: string;
  start_date: string;
  base_salary: number;
  currency: string;
  bonus?: number;
  equity?: string;
  benefits: string[];
  notes?: string;
  approvals: OfferApproval[];
  version: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OfferApproval {
  approver_id: string;
  approver?: User;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  decided_at?: string;
}

export interface Referral {
  id: string;
  org_id: string;
  referrer_id: string;
  referrer?: User;
  candidate_id: string;
  candidate?: Candidate;
  job_id?: string;
  job?: JobRequisition;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected' | 'hired';
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  org_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  org_id: string;
  actor_id: string;
  actor?: User;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// API response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  open_jobs: number;
  active_candidates: number;
  interviews_this_week: number;
  offers_pending: number;
  time_to_hire_avg: number;
  acceptance_rate: number;
  pipeline_by_stage: { stage: string; count: number }[];
  hires_by_month: { month: string; count: number }[];
  source_breakdown: { source: string; count: number; percentage: number }[];
  department_metrics: { department: string; open_roles: number; candidates: number; avg_time_to_fill: number }[];
  recent_activity: ActivityLog[];
}
