import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  Clock,
  DollarSign,
  Edit,
  Globe,
  XCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CalendarDays,
  Mail,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { demoJobs, demoApplications, demoCandidates, demoUsers, demoInterviews } from '@/lib/demo-data';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';

type Tab = 'overview' | 'candidates' | 'pipeline' | 'interviews';

const tabs: { label: string; value: Tab }[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Candidates', value: 'candidates' },
  { label: 'Pipeline', value: 'pipeline' },
  { label: 'Interviews', value: 'interviews' },
];

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const job = demoJobs.find((j) => j.id === id);
  const jobApplications = demoApplications.filter((a) => a.job_id === id);
  const jobInterviews = demoInterviews.filter((i) =>
    jobApplications.some((a) => a.id === i.application_id)
  );

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <p className="text-muted-foreground">The job you are looking for does not exist.</p>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const hiringManager = job.hiring_manager || demoUsers.find((u) => u.id === job.hiring_manager_id);
  const recruiter = job.recruiter || demoUsers.find((u) => u.id === job.recruiter_id);

  // Group applications by pipeline stage for the pipeline tab
  const stageGroups = (job.pipeline_stages || []).map((stage) => ({
    stage,
    applications: jobApplications.filter((a) => a.stage_id === stage.id),
  }));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')} className="gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PageHeader
          title={job.title}
          description={`${job.department?.name || 'Unknown Department'} · ${job.location?.name || 'Unknown Location'}`}
          actions={
            <div className="flex items-center gap-2">
              {job.status === 'open' && (
                <Button variant="outline" size="sm" className="gap-1.5">
                  <XCircle className="h-4 w-4" />
                  Close Job
                </Button>
              )}
              {(job.status === 'draft' || job.status === 'pending_approval') && (
                <Button variant="success" size="sm" className="gap-1.5">
                  <Globe className="h-4 w-4" />
                  Publish
                </Button>
              )}
              <Button size="sm" className="gap-1.5" onClick={() => navigate(`/jobs/${id}/edit`)}>
                <Edit className="h-4 w-4" />
                Edit Job
              </Button>
            </div>
          }
        />
      </motion.div>

      {/* Status + Meta row */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-wrap items-center gap-3"
      >
        <StatusBadge type="job" status={job.status} />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          {job.department?.name}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {job.location?.name}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {job.candidate_count} candidates
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {job.employment_type?.replace('_', ' ')} · {job.experience_level}
        </div>
        {job.is_remote && <Badge variant="info">Remote</Badge>}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex gap-1 border-b"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.value === 'candidates' && (
              <span className="ml-1.5 text-xs text-muted-foreground">({jobApplications.length})</span>
            )}
            {tab.value === 'interviews' && (
              <span className="ml-1.5 text-xs text-muted-foreground">({jobInterviews.length})</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <OverviewTab job={job} hiringManager={hiringManager} recruiter={recruiter} />
      )}
      {activeTab === 'candidates' && (
        <CandidatesTab applications={jobApplications} />
      )}
      {activeTab === 'pipeline' && (
        <PipelineTab stageGroups={stageGroups} />
      )}
      {activeTab === 'interviews' && (
        <InterviewsTab interviews={jobInterviews} />
      )}
    </div>
  );
}

/* ─── Overview Tab ────────────────────────────────────────────────────── */

function OverviewTab({
  job,
  hiringManager,
  recruiter,
}: {
  job: (typeof demoJobs)[0];
  hiringManager: (typeof demoUsers)[0] | undefined;
  recruiter: (typeof demoUsers)[0] | undefined;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(job.requirements || []).map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nice to haves */}
        {job.nice_to_haves && job.nice_to_haves.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Nice to Have</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.nice_to_haves.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Compensation */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.compensation && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(job.compensation.min_salary || 0)} &ndash;{' '}
                      {formatCurrency(job.compensation.max_salary || 0)}{' '}
                      <span className="text-muted-foreground font-normal">{job.compensation.currency}</span>
                    </p>
                  </div>
                  {job.compensation.equity && (
                    <div>
                      <p className="text-xs text-muted-foreground">Equity</p>
                      <p className="text-sm font-medium">{job.compensation.equity}</p>
                    </div>
                  )}
                  {job.compensation.bonus && (
                    <div>
                      <p className="text-xs text-muted-foreground">Bonus / OTE</p>
                      <p className="text-sm font-medium">{job.compensation.bonus}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Job details */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Headcount</p>
                <p className="text-sm font-medium">
                  {job.filled_count} / {job.headcount} filled
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Published</p>
                <p className="text-sm font-medium">
                  {job.published_at ? formatDate(job.published_at) : 'Not published'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDate(job.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hiring Team */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hiring Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hiringManager && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {getInitials(hiringManager.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{hiringManager.display_name}</p>
                    <p className="text-xs text-muted-foreground">Hiring Manager</p>
                  </div>
                </div>
              )}
              {recruiter && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {getInitials(recruiter.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{recruiter.display_name}</p>
                    <p className="text-xs text-muted-foreground">Recruiter</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Candidates Tab ──────────────────────────────────────────────────── */

function CandidatesTab({ applications }: { applications: typeof demoApplications }) {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center py-12 text-muted-foreground"
      >
        No candidates have applied to this job yet.
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app, i) => {
        const candidate = app.candidate || demoCandidates.find((c) => c.id === app.candidate_id);
        if (!candidate) return null;

        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/candidates/${candidate.id}`)}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{candidate.headline}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="text-sm font-medium">{app.stage?.name || 'Unknown'}</p>
                  </div>
                  <StatusBadge type="application" status={app.status} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Pipeline Tab ────────────────────────────────────────────────────── */

function PipelineTab({
  stageGroups,
}: {
  stageGroups: {
    stage: { id: string; name: string; order: number; type: string; color: string };
    applications: typeof demoApplications;
  }[];
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {stageGroups.map((group, i) => (
        <motion.div
          key={group.stage.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: group.stage.color }}
                  />
                  <CardTitle className="text-base">{group.stage.name}</CardTitle>
                  <Badge variant="secondary" className="ml-1">
                    {group.applications.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {group.applications.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {group.applications.map((app) => {
                    const candidate = app.candidate || demoCandidates.find((c) => c.id === app.candidate_id);
                    if (!candidate) return null;
                    return (
                      <div
                        key={app.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {candidate.first_name} {candidate.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{candidate.headline}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(app.moved_at || app.applied_at)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Interviews Tab ──────────────────────────────────────────────────── */

function InterviewsTab({ interviews }: { interviews: typeof demoInterviews }) {
  if (interviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center py-12 text-muted-foreground"
      >
        No interviews scheduled for this job.
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview, i) => (
        <motion.div
          key={interview.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{interview.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDate(interview.scheduled_at, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>&middot;</span>
                  <span>{interview.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {interview.interviewers.map((interviewer) => {
                    const user = interviewer.user || demoUsers.find((u) => u.id === interviewer.user_id);
                    return (
                      <Avatar key={interviewer.user_id} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-[10px]">
                          {user ? getInitials(user.display_name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                </div>
                <StatusBadge type="interview" status={interview.status} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
