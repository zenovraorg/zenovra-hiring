import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { JobRequisition, Candidate, Application, Interview, Offer, Notification, Referral, PaginatedResponse, DashboardStats } from '@/types';

// Jobs
export function useJobs(params?: { status?: string; department_id?: string; page?: number }) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => api.get<PaginatedResponse<JobRequisition>>('/jobs', params),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => api.get<JobRequisition>(`/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/jobs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// Candidates
export function useCandidates(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => api.get<PaginatedResponse<Candidate>>('/candidates', params),
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: () => api.get<Candidate>(`/candidates/${id}`),
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/candidates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

// Applications
export function useApplications(params?: { candidate_id?: string; job_id?: string; page?: number }) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => api.get<PaginatedResponse<Application>>('/candidates/applications', params),
    enabled: true,
  });
}

// Pipeline
export function usePipeline(jobId: string) {
  return useQuery({
    queryKey: ['pipeline', jobId],
    queryFn: () => api.get<{ items: Application[] }>(`/pipeline/${jobId}`),
    enabled: !!jobId,
  });
}

export function useMoveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, stageId }: { applicationId: string; stageId: string }) =>
      api.patch(`/candidates/applications/${applicationId}/move`, { stage_id: stageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
    },
  });
}

// Interviews
export function useInterviews(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['interviews', params],
    queryFn: () => api.get<PaginatedResponse<Interview>>('/interviews', params),
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: ['interviews', id],
    queryFn: () => api.get<Interview>(`/interviews/${id}`),
    enabled: !!id,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/interviews', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
}

// Offers
export function useOffers(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: () => api.get<PaginatedResponse<Offer>>('/offers', params),
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: ['offers', id],
    queryFn: () => api.get<Offer>(`/offers/${id}`),
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/offers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

// Notifications
export function useNotifications(params?: { page?: number }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => api.get<PaginatedResponse<Notification>>('/notifications', params),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Feedback
export function useFeedback(params?: { page?: number }) {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => api.get<PaginatedResponse<Record<string, unknown>>>('/feedback', params),
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/feedback', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

// Referrals
export function useReferrals(params?: { page?: number }) {
  return useQuery({
    queryKey: ['referrals', params],
    queryFn: () => api.get<PaginatedResponse<Referral>>('/referrals', params),
  });
}

export function useCreateReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/referrals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
}

// Dashboard
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
  });
}
