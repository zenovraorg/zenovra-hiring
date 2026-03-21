import { Badge } from '@/components/ui/badge';
import type { JobStatus, ApplicationStatus, OfferStatus, InterviewStatus } from '@/types';

const jobStatusConfig: Record<JobStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'muted' }> = {
  draft: { label: 'Draft', variant: 'muted' },
  pending_approval: { label: 'Pending Approval', variant: 'warning' },
  open: { label: 'Open', variant: 'success' },
  on_hold: { label: 'On Hold', variant: 'warning' },
  closed: { label: 'Closed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const applicationStatusConfig: Record<ApplicationStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'muted' }> = {
  new: { label: 'New', variant: 'info' },
  screening: { label: 'Screening', variant: 'warning' },
  interviewing: { label: 'Interviewing', variant: 'info' },
  offer: { label: 'Offer', variant: 'success' },
  hired: { label: 'Hired', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  withdrawn: { label: 'Withdrawn', variant: 'muted' },
};

const offerStatusConfig: Record<OfferStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'muted' }> = {
  draft: { label: 'Draft', variant: 'muted' },
  pending_approval: { label: 'Pending Approval', variant: 'warning' },
  approved: { label: 'Approved', variant: 'info' },
  sent: { label: 'Sent', variant: 'info' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'muted' },
  withdrawn: { label: 'Withdrawn', variant: 'secondary' },
};

const interviewStatusConfig: Record<InterviewStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'muted' }> = {
  scheduled: { label: 'Scheduled', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
};

type StatusType = 'job' | 'application' | 'offer' | 'interview';

const configs = {
  job: jobStatusConfig,
  application: applicationStatusConfig,
  offer: offerStatusConfig,
  interview: interviewStatusConfig,
};

interface StatusBadgeProps {
  type: StatusType;
  status: string;
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  const config = (configs[type] as Record<string, { label: string; variant: string }>)[status];
  if (!config) return <Badge variant="secondary">{status}</Badge>;
  return <Badge variant={config.variant as 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'muted'}>{config.label}</Badge>;
}
