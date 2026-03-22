import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useJob, usePipeline, useInterviews } from '@/hooks/use-api';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import type { JobRequisition, Application, Interview, User } from '@/types';

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

  const { data: job, isLoading } = useJob(id || '');
  const { data: pipelineData } = usePipeline(id || '');
  const { data: interviewsData } = useInterviews();

  const jobApplications = pipelineData?.items || [];
  const allInterviews = interviewsData?.items || [];
  const jobInterviews = allInterviews.filter((i) =>
    jobApplications.some((a) => a.id === i.application_id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="p-4 rounded-full bg-muted/20">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Job not found</h2>
        <p className="text-muted-foreground">The job you are looking for does not exist.</p>
        <Button variant="outline" onClick={() => navigate('/jobs')} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const hiringManager = job.hiring_manager;
  const recruiter = job.recruiter;

  const stageGroups = (job.pipeline_stages || []).map((stage) => ({
    stage,
    applications: jobApplications.filter((a) => a.stage_id === stage.id),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/jobs')}
          className="gap-2 text-muted-foreground hover:text-foreground transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </Button>
      </motion.div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge type="job" status={job.status} className="px-3 py-1" />
              {job.is_remote && (
                <Badge variant="info" className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1">
                  Remote
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary/60" />
                <span className="text-sm font-medium">{job.department?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                <span className="text-sm font-medium">{job.location?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary/60" />
                <span className="text-sm font-medium">Posted {formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full px-6 border-muted/30 hover:bg-muted/10">
              <XCircle className="h-4 w-4 mr-2" />
              Close Job
            </Button>
            <Button className="rounded-full px-8 shadow-lg shadow-primary/20" onClick={() => navigate(`/jobs/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pt-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-muted/20">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-1 py-4 text-sm font-semibold transition-all ${
                activeTab === tab.value
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.label}
                {(tab.value === 'candidates' || tab.value === 'interviews') && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {tab.value === 'candidates' ? jobApplications.length : jobInterviews.length}
                  </span>
                )}
              </div>
              {activeTab === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
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
      </motion.div>
    </div>
  );
}

/* --- Overview Tab --- */

function OverviewTab({
  job,
  hiringManager,
  recruiter,
}: {
  job: JobRequisition;
  hiringManager?: User;
  recruiter?: User;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="premium-card overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(job.requirements || []).map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/5 border border-muted/10">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {job.nice_to_haves && job.nice_to_haves.length > 0 && (
          <Card className="premium-card overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Nice to Have</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.nice_to_haves.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/5 border border-muted/10">
                    <div className="mt-1 h-5 w-5 rounded-full bg-muted/20 flex items-center justify-center shrink-0">
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <Card className="premium-card bg-primary/[0.02] border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              Compensation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {job.compensation && (
              <>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Annual Salary Range</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(job.compensation.min_salary || 0)} &ndash;{' '}
                    {formatCurrency(job.compensation.max_salary || 0)}
                    <span className="ml-2 text-sm font-medium text-muted-foreground uppercase">{job.compensation.currency}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted/10">
                  {job.compensation.equity && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Equity</p>
                      <p className="text-sm font-semibold">{job.compensation.equity}</p>
                    </div>
                  )}
                  {job.compensation.bonus && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Bonus / OTE</p>
                      <p className="text-sm font-semibold">{job.compensation.bonus}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Hiring Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {hiringManager && (
              <div className="flex items-center gap-4 group cursor-pointer">
                <Avatar className="h-12 w-12 rounded-xl ring-2 ring-muted/10 transition-all group-hover:ring-primary/20">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {getInitials(hiringManager.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{hiringManager.display_name}</p>
                  <p className="text-xs text-muted-foreground">Hiring Manager</p>
                </div>
              </div>
            )}
            {recruiter && (
              <div className="flex items-center gap-4 group cursor-pointer">
                <Avatar className="h-12 w-12 rounded-xl ring-2 ring-muted/10 transition-all group-hover:ring-primary/20">
                  <AvatarFallback className="bg-muted/10 text-muted-foreground font-bold">
                    {getInitials(recruiter.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{recruiter.display_name}</p>
                  <p className="text-xs text-muted-foreground">Recruiter</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-muted/5">
              <span className="text-sm text-muted-foreground">Headcount</span>
              <span className="text-sm font-bold">{job.filled_count} / {job.headcount} filled</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muted/5">
              <span className="text-sm text-muted-foreground">Experience</span>
              <span className="text-sm font-bold capitalize">{job.experience_level}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muted/5">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-bold capitalize">{job.employment_type?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm font-bold">{formatDate(job.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --- Candidates Tab --- */

function CandidatesTab({ applications }: { applications: Application[] }) {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-muted/10">
          <Users className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground font-medium">No candidates have applied to this job yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {applications.map((app, i) => {
        const candidate = app.candidate;
        if (!candidate) return null;

        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card
              className="premium-card group cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => navigate(`/candidates/${candidate.id}`)}
            >
              <CardContent className="flex items-center gap-4 py-5">
                <Avatar className="h-12 w-12 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold group-hover:text-primary transition-colors">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate font-medium">{candidate.headline}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge type="application" status={app.status} className="px-2 py-0.5 text-[10px]" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {app.stage?.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* --- Pipeline Tab --- */

function PipelineTab({
  stageGroups,
}: {
  stageGroups: {
    stage: { id: string; name: string; order: number; type: string; color: string };
    applications: Application[];
  }[];
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {stageGroups.map((group, i) => (
        <motion.div
          key={group.stage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="premium-card overflow-hidden">
            <CardHeader className="pb-4 bg-muted/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm"
                    style={{ backgroundColor: group.stage.color }}
                  />
                  <CardTitle className="text-base font-bold">{group.stage.name}</CardTitle>
                  <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none px-2 py-0.5 text-[10px] font-bold">
                    {group.applications.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {group.applications.length > 0 ? (
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.applications.map((app) => {
                    const candidate = app.candidate;
                    if (!candidate) return null;
                    return (
                      <div
                        key={app.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-muted/10 hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer transition-all group"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        <Avatar className="h-10 w-10 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarFallback className="bg-muted/10 text-muted-foreground text-xs font-bold">
                            {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">
                            {candidate.first_name} {candidate.last_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate font-medium">
                            {formatDate(app.moved_at || app.applied_at)}
                          </p>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            ) : (
              <CardContent className="py-8 text-center">
                <p className="text-xs text-muted-foreground italic">No candidates in this stage</p>
              </CardContent>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* --- Interviews Tab --- */

function InterviewsTab({ interviews }: { interviews: Interview[] }) {
  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-muted/10">
          <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground font-medium">No interviews scheduled for this job.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interviews.map((interview, i) => (
        <motion.div
          key={interview.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="premium-card group hover:border-primary/30 transition-all">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold group-hover:text-primary transition-colors">{interview.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDate(interview.scheduled_at, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span>{interview.duration_minutes} min</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <StatusBadge type="interview" status={interview.status} className="px-2 py-0.5 text-[10px]" />
                <div className="flex -space-x-2">
                  {(interview.interviewers || []).slice(0, 3).map((interviewer) => {
                    const user = interviewer.user;
                    return (
                      <Avatar key={interviewer.user_id} className="h-7 w-7 border-2 border-background shadow-sm">
                        <AvatarFallback className="text-[8px] font-bold bg-muted/20">
                          {user ? getInitials(user.display_name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {(interview.interviewers || []).length > 3 && (
                    <div className="h-7 w-7 rounded-full bg-muted/10 border-2 border-background flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                      +{(interview.interviewers || []).length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
