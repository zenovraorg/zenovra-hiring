import type {
  User, Organization, Department, Location, JobRequisition,
  Candidate, Application, PipelineStage, Interview, Offer,
  Notification, ActivityLog, DashboardStats, Referral
} from '@/types';

// Demo users
export const demoUsers: User[] = [
  { id: 'u1', email: 'sarah.chen@zenovra.com', display_name: 'Sarah Chen', firebase_uid: 'fb1', avatar_url: '', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
  { id: 'u2', email: 'marcus.johnson@zenovra.com', display_name: 'Marcus Johnson', firebase_uid: 'fb2', avatar_url: '', created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
  { id: 'u3', email: 'priya.patel@zenovra.com', display_name: 'Priya Patel', firebase_uid: 'fb3', avatar_url: '', created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z' },
  { id: 'u4', email: 'james.wilson@zenovra.com', display_name: 'James Wilson', firebase_uid: 'fb4', avatar_url: '', created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z' },
  { id: 'u5', email: 'lisa.nakamura@zenovra.com', display_name: 'Lisa Nakamura', firebase_uid: 'fb5', avatar_url: '', created_at: '2024-03-15T00:00:00Z', updated_at: '2024-03-15T00:00:00Z' },
];

export const demoOrg: Organization = {
  id: 'org1',
  name: 'Zenovra Tech',
  slug: 'zenovra',
  domain: 'zenovra.com',
  industry: 'Technology',
  size: '200-500',
  settings: {
    branding: { primary_color: '#6366f1' },
    hiring: { require_job_approval: true, require_offer_approval: true },
  },
  created_at: '2024-01-01T00:00:00Z',
};

export const demoDepartments: Department[] = [
  { id: 'dept1', org_id: 'org1', name: 'Engineering' },
  { id: 'dept2', org_id: 'org1', name: 'Product' },
  { id: 'dept3', org_id: 'org1', name: 'Design' },
  { id: 'dept4', org_id: 'org1', name: 'Sales' },
  { id: 'dept5', org_id: 'org1', name: 'Marketing' },
  { id: 'dept6', org_id: 'org1', name: 'People & Talent' },
];

export const demoLocations: Location[] = [
  { id: 'loc1', org_id: 'org1', name: 'San Francisco HQ', city: 'San Francisco', state: 'CA', country: 'US', is_remote: false },
  { id: 'loc2', org_id: 'org1', name: 'New York Office', city: 'New York', state: 'NY', country: 'US', is_remote: false },
  { id: 'loc3', org_id: 'org1', name: 'Remote', country: 'US', is_remote: true },
  { id: 'loc4', org_id: 'org1', name: 'London Office', city: 'London', country: 'UK', is_remote: false },
];

const defaultStages: PipelineStage[] = [
  { id: 'ps1', name: 'Applied', order: 0, type: 'sourced', color: '#6366f1' },
  { id: 'ps2', name: 'Phone Screen', order: 1, type: 'screening', color: '#8b5cf6' },
  { id: 'ps3', name: 'Technical Interview', order: 2, type: 'interview', color: '#0ea5e9' },
  { id: 'ps4', name: 'Onsite', order: 3, type: 'interview', color: '#06b6d4' },
  { id: 'ps5', name: 'Offer', order: 4, type: 'offer', color: '#10b981' },
  { id: 'ps6', name: 'Hired', order: 5, type: 'hired', color: '#22c55e' },
];

export const demoJobs: JobRequisition[] = [
  {
    id: 'j1', org_id: 'org1', title: 'Senior Frontend Engineer', slug: 'senior-frontend-engineer',
    department_id: 'dept1', department: demoDepartments[0], location_id: 'loc1', location: demoLocations[0],
    hiring_manager_id: 'u2', hiring_manager: demoUsers[1], recruiter_id: 'u1', recruiter: demoUsers[0],
    status: 'open', employment_type: 'full_time', experience_level: 'senior',
    description: 'We are looking for a Senior Frontend Engineer to join our product team and help build the next generation of our hiring platform.',
    requirements: ['5+ years React/TypeScript', 'Experience with design systems', 'Strong CSS/animation skills', 'Familiarity with testing frameworks'],
    nice_to_haves: ['GraphQL experience', 'Open source contributions'],
    compensation: { min_salary: 180000, max_salary: 240000, currency: 'USD', equity: '0.05% - 0.15%' },
    pipeline_stages: defaultStages, headcount: 2, filled_count: 0, candidate_count: 18,
    is_remote: false, is_published: true, published_at: '2024-09-01T00:00:00Z',
    created_at: '2024-08-28T00:00:00Z', updated_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'j2', org_id: 'org1', title: 'Product Manager — Growth', slug: 'product-manager-growth',
    department_id: 'dept2', department: demoDepartments[1], location_id: 'loc3', location: demoLocations[2],
    hiring_manager_id: 'u3', hiring_manager: demoUsers[2], recruiter_id: 'u1', recruiter: demoUsers[0],
    status: 'open', employment_type: 'full_time', experience_level: 'senior',
    description: 'Lead our growth product initiatives and drive key metrics across the platform.',
    requirements: ['4+ years product management', 'Data-driven decision making', 'Growth/PLG experience'],
    nice_to_haves: ['B2B SaaS experience', 'Technical background'],
    compensation: { min_salary: 160000, max_salary: 220000, currency: 'USD', equity: '0.03% - 0.10%' },
    pipeline_stages: defaultStages, headcount: 1, filled_count: 0, candidate_count: 24,
    is_remote: true, is_published: true, published_at: '2024-09-10T00:00:00Z',
    created_at: '2024-09-05T00:00:00Z', updated_at: '2024-09-18T00:00:00Z',
  },
  {
    id: 'j3', org_id: 'org1', title: 'Staff Backend Engineer', slug: 'staff-backend-engineer',
    department_id: 'dept1', department: demoDepartments[0], location_id: 'loc1', location: demoLocations[0],
    hiring_manager_id: 'u4', hiring_manager: demoUsers[3], recruiter_id: 'u5', recruiter: demoUsers[4],
    status: 'open', employment_type: 'full_time', experience_level: 'lead',
    description: 'Design and build scalable distributed systems that power our core hiring infrastructure.',
    requirements: ['8+ years backend experience', 'Python/Go expertise', 'Distributed systems', 'System design leadership'],
    nice_to_haves: ['Experience with MongoDB at scale', 'Mentorship experience'],
    compensation: { min_salary: 220000, max_salary: 300000, currency: 'USD', equity: '0.10% - 0.25%' },
    pipeline_stages: defaultStages, headcount: 1, filled_count: 0, candidate_count: 12,
    is_remote: false, is_published: true, published_at: '2024-09-12T00:00:00Z',
    created_at: '2024-09-10T00:00:00Z', updated_at: '2024-09-20T00:00:00Z',
  },
  {
    id: 'j4', org_id: 'org1', title: 'Senior Product Designer', slug: 'senior-product-designer',
    department_id: 'dept3', department: demoDepartments[2], location_id: 'loc3', location: demoLocations[2],
    hiring_manager_id: 'u3', hiring_manager: demoUsers[2], recruiter_id: 'u1', recruiter: demoUsers[0],
    status: 'open', employment_type: 'full_time', experience_level: 'senior',
    description: 'Shape the design direction of our platform and create beautiful, intuitive experiences.',
    requirements: ['5+ years product design', 'Strong systems thinking', 'Figma expertise', 'B2B SaaS portfolio'],
    nice_to_haves: ['Motion design', 'Design engineering skills'],
    compensation: { min_salary: 165000, max_salary: 210000, currency: 'USD', equity: '0.03% - 0.10%' },
    pipeline_stages: defaultStages, headcount: 1, filled_count: 0, candidate_count: 31,
    is_remote: true, is_published: true, published_at: '2024-09-05T00:00:00Z',
    created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-16T00:00:00Z',
  },
  {
    id: 'j5', org_id: 'org1', title: 'Enterprise Account Executive', slug: 'enterprise-ae',
    department_id: 'dept4', department: demoDepartments[3], location_id: 'loc2', location: demoLocations[1],
    hiring_manager_id: 'u4', hiring_manager: demoUsers[3], recruiter_id: 'u5', recruiter: demoUsers[4],
    status: 'open', employment_type: 'full_time', experience_level: 'senior',
    description: 'Drive enterprise sales and build relationships with Fortune 500 companies.',
    requirements: ['5+ years enterprise sales', '$1M+ quota attainment', 'SaaS experience'],
    nice_to_haves: ['HR tech experience', 'Existing network in HR/Talent space'],
    compensation: { min_salary: 140000, max_salary: 180000, currency: 'USD', bonus: 'OTE $300K-$400K' },
    pipeline_stages: defaultStages, headcount: 3, filled_count: 1, candidate_count: 15,
    is_remote: false, is_published: true, published_at: '2024-08-20T00:00:00Z',
    created_at: '2024-08-15T00:00:00Z', updated_at: '2024-09-14T00:00:00Z',
  },
  {
    id: 'j6', org_id: 'org1', title: 'DevOps Engineer', slug: 'devops-engineer',
    department_id: 'dept1', department: demoDepartments[0], location_id: 'loc3', location: demoLocations[2],
    hiring_manager_id: 'u2', hiring_manager: demoUsers[1], recruiter_id: 'u5', recruiter: demoUsers[4],
    status: 'pending_approval', employment_type: 'full_time', experience_level: 'mid',
    description: 'Build and maintain our cloud infrastructure and CI/CD pipelines.',
    requirements: ['3+ years DevOps/SRE', 'AWS/GCP', 'Kubernetes', 'Terraform'],
    nice_to_haves: ['SOC 2 compliance experience'],
    compensation: { min_salary: 150000, max_salary: 200000, currency: 'USD' },
    pipeline_stages: defaultStages, headcount: 1, filled_count: 0, candidate_count: 0,
    is_remote: true, is_published: false,
    created_at: '2024-09-18T00:00:00Z', updated_at: '2024-09-18T00:00:00Z',
  },
];

export const demoCandidates: Candidate[] = [
  {
    id: 'c1', org_id: 'org1', first_name: 'Alex', last_name: 'Rivera', email: 'alex.rivera@email.com',
    headline: 'Senior Frontend Engineer at Meta', location: 'San Francisco, CA',
    source: 'linkedin', tags: ['react', 'typescript'], skills: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
    experience_years: 7, current_company: 'Meta', current_title: 'Senior Frontend Engineer',
    owner_id: 'u1', owner: demoUsers[0], applications: [],
    created_at: '2024-09-02T00:00:00Z', updated_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'c2', org_id: 'org1', first_name: 'Jordan', last_name: 'Kim', email: 'jordan.kim@email.com',
    headline: 'Staff Engineer at Stripe', location: 'New York, NY',
    source: 'referral', source_detail: 'Referred by Marcus Johnson', tags: ['python', 'distributed-systems'],
    skills: ['Python', 'Go', 'Distributed Systems', 'PostgreSQL', 'Redis'],
    experience_years: 10, current_company: 'Stripe', current_title: 'Staff Engineer',
    owner_id: 'u5', owner: demoUsers[4], applications: [],
    created_at: '2024-09-05T00:00:00Z', updated_at: '2024-09-18T00:00:00Z',
  },
  {
    id: 'c3', org_id: 'org1', first_name: 'Maya', last_name: 'Thompson', email: 'maya.t@email.com',
    headline: 'Product Designer at Figma', location: 'Remote',
    source: 'careers_page', tags: ['design-systems', 'figma'], skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    experience_years: 6, current_company: 'Figma', current_title: 'Senior Product Designer',
    owner_id: 'u1', owner: demoUsers[0], applications: [],
    created_at: '2024-09-06T00:00:00Z', updated_at: '2024-09-16T00:00:00Z',
  },
  {
    id: 'c4', org_id: 'org1', first_name: 'Chen', last_name: 'Wei', email: 'chen.wei@email.com',
    headline: 'Product Manager at Notion', location: 'San Francisco, CA',
    source: 'direct', tags: ['growth', 'plg'], skills: ['Product Strategy', 'Growth', 'Analytics', 'SQL'],
    experience_years: 5, current_company: 'Notion', current_title: 'Senior PM — Growth',
    owner_id: 'u1', owner: demoUsers[0], applications: [],
    created_at: '2024-09-10T00:00:00Z', updated_at: '2024-09-17T00:00:00Z',
  },
  {
    id: 'c5', org_id: 'org1', first_name: 'Aisha', last_name: 'Okafor', email: 'aisha.o@email.com',
    headline: 'Frontend Engineer at Vercel', location: 'London, UK',
    source: 'linkedin', tags: ['react', 'next.js'], skills: ['React', 'Next.js', 'TypeScript', 'CSS', 'Animations'],
    experience_years: 5, current_company: 'Vercel', current_title: 'Frontend Engineer',
    owner_id: 'u1', owner: demoUsers[0], applications: [],
    created_at: '2024-09-08T00:00:00Z', updated_at: '2024-09-14T00:00:00Z',
  },
  {
    id: 'c6', org_id: 'org1', first_name: 'David', last_name: 'Park', email: 'david.park@email.com',
    headline: 'Enterprise AE at Salesforce', location: 'New York, NY',
    source: 'agency', tags: ['enterprise', 'saas-sales'], skills: ['Enterprise Sales', 'Consultative Selling', 'Salesforce'],
    experience_years: 8, current_company: 'Salesforce', current_title: 'Enterprise Account Executive',
    owner_id: 'u5', owner: demoUsers[4], applications: [],
    created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-12T00:00:00Z',
  },
];

export const demoApplications: Application[] = [
  { id: 'a1', candidate_id: 'c1', candidate: demoCandidates[0], job_id: 'j1', job: demoJobs[0], org_id: 'org1', stage_id: 'ps3', stage: defaultStages[2], status: 'interviewing', applied_at: '2024-09-02T00:00:00Z', moved_at: '2024-09-10T00:00:00Z', source: 'linkedin' },
  { id: 'a2', candidate_id: 'c2', candidate: demoCandidates[1], job_id: 'j3', job: demoJobs[2], org_id: 'org1', stage_id: 'ps4', stage: defaultStages[3], status: 'interviewing', applied_at: '2024-09-05T00:00:00Z', moved_at: '2024-09-14T00:00:00Z', source: 'referral' },
  { id: 'a3', candidate_id: 'c3', candidate: demoCandidates[2], job_id: 'j4', job: demoJobs[3], org_id: 'org1', stage_id: 'ps2', stage: defaultStages[1], status: 'screening', applied_at: '2024-09-06T00:00:00Z', moved_at: '2024-09-08T00:00:00Z', source: 'careers_page' },
  { id: 'a4', candidate_id: 'c4', candidate: demoCandidates[3], job_id: 'j2', job: demoJobs[1], org_id: 'org1', stage_id: 'ps3', stage: defaultStages[2], status: 'interviewing', applied_at: '2024-09-10T00:00:00Z', moved_at: '2024-09-15T00:00:00Z', source: 'direct' },
  { id: 'a5', candidate_id: 'c5', candidate: demoCandidates[4], job_id: 'j1', job: demoJobs[0], org_id: 'org1', stage_id: 'ps1', stage: defaultStages[0], status: 'new', applied_at: '2024-09-08T00:00:00Z', moved_at: '2024-09-08T00:00:00Z', source: 'linkedin' },
  { id: 'a6', candidate_id: 'c6', candidate: demoCandidates[5], job_id: 'j5', job: demoJobs[4], org_id: 'org1', stage_id: 'ps5', stage: defaultStages[4], status: 'offer', applied_at: '2024-09-01T00:00:00Z', moved_at: '2024-09-16T00:00:00Z', source: 'agency' },
];

export const demoInterviews: Interview[] = [
  {
    id: 'i1', application_id: 'a1', org_id: 'org1', title: 'Technical Interview — Frontend',
    type: 'technical', status: 'scheduled', scheduled_at: '2024-09-22T14:00:00Z', duration_minutes: 60,
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    interviewers: [{ user_id: 'u2', user: demoUsers[1], role: 'lead', feedback_submitted: false }],
    created_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'i2', application_id: 'a2', org_id: 'org1', title: 'Onsite — System Design',
    type: 'technical', status: 'scheduled', scheduled_at: '2024-09-23T10:00:00Z', duration_minutes: 90,
    location: 'San Francisco HQ',
    interviewers: [
      { user_id: 'u4', user: demoUsers[3], role: 'lead', feedback_submitted: false },
      { user_id: 'u2', user: demoUsers[1], role: 'participant', feedback_submitted: false },
    ],
    created_at: '2024-09-16T00:00:00Z',
  },
  {
    id: 'i3', application_id: 'a4', org_id: 'org1', title: 'Product Sense Interview',
    type: 'behavioral', status: 'completed', scheduled_at: '2024-09-18T11:00:00Z', duration_minutes: 45,
    meeting_link: 'https://meet.google.com/xyz-uvwx-yz',
    interviewers: [{ user_id: 'u3', user: demoUsers[2], role: 'lead', feedback_submitted: true }],
    created_at: '2024-09-14T00:00:00Z',
  },
];

export const demoOffers: Offer[] = [
  {
    id: 'o1', application_id: 'a6', org_id: 'org1', status: 'sent',
    title: 'Enterprise Account Executive', department: 'Sales',
    start_date: '2024-10-15', base_salary: 160000, currency: 'USD', bonus: 200000,
    benefits: ['Health/Dental/Vision', '401k match', 'Unlimited PTO', 'Home office stipend'],
    approvals: [
      { approver_id: 'u4', approver: demoUsers[3], status: 'approved', decided_at: '2024-09-15T00:00:00Z' },
    ],
    version: 1, expires_at: '2024-09-30T00:00:00Z',
    created_at: '2024-09-14T00:00:00Z', updated_at: '2024-09-16T00:00:00Z',
  },
];

export const demoNotifications: Notification[] = [
  { id: 'n1', user_id: 'u1', org_id: 'org1', type: 'application', title: 'New Application', message: 'Aisha Okafor applied for Senior Frontend Engineer', link: '/candidates/c5', is_read: false, created_at: '2024-09-18T10:00:00Z' },
  { id: 'n2', user_id: 'u1', org_id: 'org1', type: 'interview', title: 'Interview Scheduled', message: 'Technical interview with Alex Rivera is scheduled for Sep 22', link: '/interviews', is_read: false, created_at: '2024-09-17T15:00:00Z' },
  { id: 'n3', user_id: 'u1', org_id: 'org1', type: 'offer', title: 'Offer Sent', message: 'Offer sent to David Park for Enterprise AE position', link: '/offers/o1', is_read: true, created_at: '2024-09-16T09:00:00Z' },
  { id: 'n4', user_id: 'u1', org_id: 'org1', type: 'feedback', title: 'Feedback Submitted', message: 'Priya Patel submitted feedback for Chen Wei', link: '/feedback', is_read: true, created_at: '2024-09-15T16:00:00Z' },
];

export const demoActivity: ActivityLog[] = [
  { id: 'al1', org_id: 'org1', actor_id: 'u1', actor: demoUsers[0], action: 'moved_stage', entity_type: 'application', entity_id: 'a1', metadata: { from: 'Phone Screen', to: 'Technical Interview', candidate: 'Alex Rivera' }, created_at: '2024-09-18T11:30:00Z' },
  { id: 'al2', org_id: 'org1', actor_id: 'u5', actor: demoUsers[4], action: 'sent_offer', entity_type: 'offer', entity_id: 'o1', metadata: { candidate: 'David Park', job: 'Enterprise AE' }, created_at: '2024-09-16T14:00:00Z' },
  { id: 'al3', org_id: 'org1', actor_id: 'u3', actor: demoUsers[2], action: 'submitted_feedback', entity_type: 'scorecard', entity_id: 'sc1', metadata: { candidate: 'Chen Wei', rating: 'Strong Yes' }, created_at: '2024-09-15T16:30:00Z' },
  { id: 'al4', org_id: 'org1', actor_id: 'u1', actor: demoUsers[0], action: 'created_job', entity_type: 'job', entity_id: 'j6', metadata: { title: 'DevOps Engineer' }, created_at: '2024-09-18T09:00:00Z' },
  { id: 'al5', org_id: 'org1', actor_id: 'u2', actor: demoUsers[1], action: 'scheduled_interview', entity_type: 'interview', entity_id: 'i1', metadata: { candidate: 'Alex Rivera', type: 'Technical' }, created_at: '2024-09-15T10:00:00Z' },
];

export const demoDashboardStats: DashboardStats = {
  open_jobs: 5,
  active_candidates: 47,
  interviews_this_week: 8,
  offers_pending: 2,
  time_to_hire_avg: 32,
  acceptance_rate: 87,
  pipeline_by_stage: [
    { stage: 'Applied', count: 28 },
    { stage: 'Phone Screen', count: 14 },
    { stage: 'Technical', count: 9 },
    { stage: 'Onsite', count: 5 },
    { stage: 'Offer', count: 3 },
    { stage: 'Hired', count: 2 },
  ],
  hires_by_month: [
    { month: 'Apr', count: 3 },
    { month: 'May', count: 5 },
    { month: 'Jun', count: 4 },
    { month: 'Jul', count: 6 },
    { month: 'Aug', count: 5 },
    { month: 'Sep', count: 2 },
  ],
  source_breakdown: [
    { source: 'LinkedIn', count: 42, percentage: 35 },
    { source: 'Careers Page', count: 30, percentage: 25 },
    { source: 'Referrals', count: 24, percentage: 20 },
    { source: 'Direct', count: 14, percentage: 12 },
    { source: 'Agencies', count: 10, percentage: 8 },
  ],
  department_metrics: [
    { department: 'Engineering', open_roles: 3, candidates: 30, avg_time_to_fill: 35 },
    { department: 'Product', open_roles: 1, candidates: 24, avg_time_to_fill: 28 },
    { department: 'Design', open_roles: 1, candidates: 31, avg_time_to_fill: 25 },
    { department: 'Sales', open_roles: 1, candidates: 15, avg_time_to_fill: 21 },
  ],
  recent_activity: demoActivity,
};
