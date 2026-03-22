import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Briefcase,
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { demoDashboardStats, demoActivity, demoJobs as fallbackJobs } from '@/lib/demo-data';
import { getInitials, formatRelativeTime, formatNumber } from '@/lib/utils';
import { useJobs } from '@/hooks/use-api';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b'];
const PIE_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b'];

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobsData } = useJobs();
  const openJobs = jobsData?.items?.filter(j => j.status === 'open') || fallbackJobs.filter(j => j.status === 'open');
  const stats = demoDashboardStats;
  const chartsRef = useRef(null);
  const chartsInView = useInView(chartsRef, { once: true, margin: '-50px' });
  const bottomRef = useRef(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: '-50px' });
  const deptRef = useRef(null);
  const deptInView = useInView(deptRef, { once: true, margin: '-50px' });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto relative">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
      >
      <PageHeader
        title="Hiring Dashboard"
        description="Overview of your organization's hiring health"
        actions={
          <Button size="sm" onClick={() => navigate('/jobs/new')}>
            <Briefcase className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        }
      />
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Open Jobs" value={stats.open_jobs} change={12} changeLabel="vs last month" icon={Briefcase} delay={0} />
        <StatCard title="Active Candidates" value={stats.active_candidates} change={8} changeLabel="vs last month" icon={Users} delay={0.05} />
        <StatCard title="Interviews This Week" value={stats.interviews_this_week} change={-5} changeLabel="vs last week" icon={Calendar} delay={0.1} />
        <StatCard title="Offers Pending" value={stats.offers_pending} icon={FileText} delay={0.15} />
        <StatCard title="Avg Time to Hire" value={`${stats.time_to_hire_avg}d`} change={-10} changeLabel="faster" icon={Clock} delay={0.2} />
        <StatCard title="Acceptance Rate" value={`${stats.acceptance_rate}%`} change={3} changeLabel="vs last quarter" icon={CheckCircle2} delay={0.25} />
      </div>

      {/* Charts Row */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <Card className="border-border/50 shadow-premium hover:shadow-hover transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold tracking-tight">Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.pipeline_by_stage} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="stage" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {stats.pipeline_by_stage.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hires by Month */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
        >
          <Card className="border-border/50 shadow-premium hover:shadow-hover transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold tracking-tight">Hires Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.hires_by_month}>
                    <defs>
                      <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#hiresGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div ref={bottomRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <Card className="h-full border-border/50 shadow-premium hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold tracking-tight">Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.source_breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {stats.source_breakdown.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {stats.source_breakdown.map((item, i) => (
                  <div key={item.source} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.source}</span>
                    </div>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
        >
          <Card className="h-full border-border/50 shadow-premium hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold tracking-tight">Open Positions</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate('/jobs')}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openJobs.slice(0, 5).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="flex items-center justify-between py-2 group cursor-pointer hover:bg-primary/[0.03] -mx-2 px-2 rounded-lg transition-all duration-200"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.department?.name} · {job.location?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-2xs">
                        {job.candidate_count} candidates
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
        >
          <Card className="h-full border-border/50 shadow-premium hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold tracking-tight">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate('/notifications')}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoActivity.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="flex items-start gap-3 py-1"
                  >
                    <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                      <AvatarFallback className="text-2xs">
                        {activity.actor ? getInitials(activity.actor.display_name) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{activity.actor?.display_name}</span>{' '}
                        <span className="text-muted-foreground">
                          {formatAction(activity.action)}
                        </span>{' '}
                        <span className="font-medium">
                          {(activity.metadata as Record<string, string>)?.candidate ||
                            (activity.metadata as Record<string, string>)?.title || ''}
                        </span>
                      </p>
                      <p className="text-2xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Department Metrics */}
      <motion.div
        ref={deptRef}
        initial={{ opacity: 0, y: 30 }}
        animate={deptInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <Card className="border-border/50 shadow-premium hover:shadow-hover transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold tracking-tight">Department Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.department_metrics.map((dept, i) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={deptInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: smoothEase }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-xl border border-border/50 p-4 hover:shadow-md hover:border-primary/10 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40"
                >
                  <p className="text-sm font-medium">{dept.department}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Open Roles</span>
                      <span className="font-medium">{dept.open_roles}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Candidates</span>
                      <span className="font-medium">{dept.candidates}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Time to Fill</span>
                      <span className="font-medium">{dept.avg_time_to_fill}d</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    moved_stage: 'moved',
    sent_offer: 'sent an offer to',
    submitted_feedback: 'submitted feedback for',
    created_job: 'created job',
    scheduled_interview: 'scheduled interview for',
  };
  return map[action] || action.replace(/_/g, ' ');
}
