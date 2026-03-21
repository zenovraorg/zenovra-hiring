import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { JobRequisition, Candidate, Application, PaginatedResponse, DashboardStats } from '@/types';

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

// Dashboard
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
  });
}
