import { create } from 'zustand';
import type { JobRequisition, Candidate, Application, Interview, Offer, Notification } from '@/types';
import {
  demoJobs, demoCandidates, demoApplications, demoInterviews, demoOffers, demoNotifications,
  demoDepartments, demoLocations, demoUsers,
} from '@/lib/demo-data';

interface DataState {
  jobs: JobRequisition[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  offers: Offer[];
  notifications: Notification[];

  addJob: (job: Partial<JobRequisition>) => void;
  addCandidate: (candidate: Partial<Candidate>) => void;
  addInterview: (interview: Partial<Interview>) => void;
  addOffer: (offer: Partial<Offer>) => void;
  moveApplication: (applicationId: string, newStageId: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  jobs: [...demoJobs],
  candidates: [...demoCandidates],
  applications: [...demoApplications],
  interviews: [...demoInterviews],
  offers: [...demoOffers],
  notifications: [...demoNotifications],

  addJob: (jobData) => set((state) => {
    const newJob: JobRequisition = {
      id: 'j' + (state.jobs.length + 1),
      org_id: 'org1',
      title: jobData.title || 'Untitled Job',
      slug: (jobData.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
      department_id: jobData.department_id || 'dept1',
      department: demoDepartments.find((d) => d.id === (jobData.department_id || 'dept1')),
      location_id: jobData.location_id || 'loc1',
      location: demoLocations.find((l) => l.id === (jobData.location_id || 'loc1')),
      hiring_manager_id: jobData.hiring_manager_id || 'u2',
      hiring_manager: demoUsers.find((u) => u.id === (jobData.hiring_manager_id || 'u2')),
      recruiter_id: jobData.recruiter_id || 'u1',
      recruiter: demoUsers.find((u) => u.id === (jobData.recruiter_id || 'u1')),
      status: 'open',
      employment_type: (jobData.employment_type || 'full_time') as JobRequisition['employment_type'],
      experience_level: (jobData.experience_level || 'mid') as JobRequisition['experience_level'],
      description: jobData.description || '',
      requirements: jobData.requirements || [],
      nice_to_haves: jobData.nice_to_haves || [],
      compensation: jobData.compensation || { min_salary: 0, max_salary: 0, currency: 'USD' },
      pipeline_stages: demoJobs[0].pipeline_stages,
      headcount: jobData.headcount || 1,
      filled_count: 0,
      candidate_count: 0,
      is_remote: jobData.is_remote || false,
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { jobs: [newJob, ...state.jobs] };
  }),

  addCandidate: (candidateData) => set((state) => {
    const newCandidate: Candidate = {
      id: 'c' + (state.candidates.length + 1),
      org_id: 'org1',
      first_name: candidateData.first_name || '',
      last_name: candidateData.last_name || '',
      email: candidateData.email || '',
      phone: candidateData.phone,
      headline: candidateData.headline,
      location: candidateData.location,
      linkedin_url: candidateData.linkedin_url,
      source: (candidateData.source || 'direct') as Candidate['source'],
      tags: candidateData.tags || [],
      skills: candidateData.skills || [],
      experience_years: candidateData.experience_years,
      current_company: candidateData.current_company,
      current_title: candidateData.current_title,
      applications: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { candidates: [newCandidate, ...state.candidates] };
  }),

  addInterview: (interviewData) => set((state) => {
    const newInterview: Interview = {
      id: 'i' + (state.interviews.length + 1),
      application_id: interviewData.application_id || '',
      org_id: 'org1',
      title: interviewData.title || '',
      type: (interviewData.type || 'other') as Interview['type'],
      status: 'scheduled',
      scheduled_at: interviewData.scheduled_at || new Date().toISOString(),
      duration_minutes: interviewData.duration_minutes || 60,
      location: interviewData.location,
      meeting_link: interviewData.meeting_link,
      interviewers: interviewData.interviewers || [],
      created_at: new Date().toISOString(),
    };
    return { interviews: [newInterview, ...state.interviews] };
  }),

  addOffer: (offerData) => set((state) => {
    const newOffer: Offer = {
      id: 'o' + (state.offers.length + 1),
      application_id: offerData.application_id || '',
      org_id: 'org1',
      status: 'draft',
      title: offerData.title || '',
      department: offerData.department || '',
      start_date: offerData.start_date || '',
      base_salary: offerData.base_salary || 0,
      currency: 'USD',
      bonus: offerData.bonus,
      equity: offerData.equity,
      benefits: offerData.benefits || [],
      approvals: [],
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { offers: [newOffer, ...state.offers] };
  }),

  moveApplication: (applicationId, newStageId) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === applicationId ? { ...app, stage_id: newStageId, moved_at: new Date().toISOString() } : app
    ),
  })),
}));
