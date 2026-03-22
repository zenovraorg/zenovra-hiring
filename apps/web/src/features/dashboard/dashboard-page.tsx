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
  Loader2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import { useJobs, useDashboardStats, useNotifications } from '@/hooks/use-api';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b'];
const PIE_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b'];

const ease = [0.25, 0.1, 0.25, 1] as const;

const chartTooltipStyle = {
  backgroundColor: 'hsl(240 12% 7%)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.8)',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: notificationsData } = useNotifications();

  const openJobs = jobsData?.items?.filter(j => j.status === 'open') || [];
  const recentNotifications = notificationsData?.items?.slice(0, 5) || [];

  const stats = statsData || {
    open_jobs: 0, active_candidates: 0, interviews_this_week: 0,
    offers_pending: 0, time_to_hire_avg: 0, acceptance_rate: 0,
    pipeline_by_stage: [], hires_by_month: [], source_breakdown: [],
    department_metrics: [], recent_activity: [],
  };

  const chartsRef = useRef(null);
  const chartsInView = useInView(chartsRef, { once: true, margin: '-50px' });
  const bottomRef = useRef(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: '-50px' });
  const deptRef = useRef(null);
  const deptInView = useInView(deptRef, { once: true, margin: '-50px' });

  if (statsLoading && jobsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Hiring Dashboard"
        description="Overview of your organization's hiring health"
        actions={
          <Button size="sm" onClick={() => navigate('/jobs/new')} variant="gradient">
            <Briefcase className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard title="Open Jobs" value={stats.open_jobs} change={12} changeLabel="vs last month" icon={Briefcase} accentColor="indigo" delay={0} />
        <StatCard title="Active Candidates" value={stats.active_candidates} change={8} changeLabel="vs last month" icon={Users} accentColor="violet" delay={0.04} />
        <StatCard title="Interviews This Week" value={stats.interviews_this_week} change={-5} changeLabel="vs last week" icon={Calendar} accentColor="cyan" delay={0.08} />
        <StatCard title="Offers Pending" value={stats.offers_pending} icon={FileText} accentColor="amber" delay={0.12} />
        <StatCard title="Avg Time to Hire" value={`${stats.time_to_hire_avg}d`} change={-10} changeLabel="faster" icon={Clock} accentColor="emerald" delay={0.16} />
        <StatCard title="Acceptance Rate" value={`${stats.acceptance_rate}%`} change={3} changeLabel="vs last quarter" icon={CheckCircle2} accentColor="rose" delay={0.2} />
      </div>

      {/* Charts */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {stats.pipeline_by_stage.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.pipeline_by_stage} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} />
                      <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} width={90} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {stats.pipeline_by_stage.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/25 text-sm">No pipeline data yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Hires Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {stats.hires_by_month.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.hires_by_month}>
                      <defs>
                        <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#hiresGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/25 text-sm">No hiring data yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div ref={bottomRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.source_breakdown.length > 0 ? (
                <>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.source_breakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="count">
                          {stats.source_breakdown.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {stats.source_breakdown.map((item, i) => (
                      <div key={item.source} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-white/40 text-xs">{item.source}</span>
                        </div>
                        <span className="text-xs font-medium tabular-nums">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[160px] text-white/25 text-sm">No source data yet</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.06, ease }}
        >
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Open Positions</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-white/30 h-7" onClick={() => navigate('/jobs')}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {openJobs.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-white/25 text-sm">No open positions</div>
              ) : (
                <div className="space-y-1">
                  {openJobs.slice(0, 5).map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="flex items-center justify-between py-2 group cursor-pointer hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-white transition-colors">{job.title}</p>
                        <p className="text-xs text-white/30">{job.department?.name} &middot; {job.location?.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">{job.candidate_count || 0}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.12, ease }}
        >
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-white/30 h-7" onClick={() => navigate('/notifications')}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentNotifications.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-white/25 text-sm">No recent activity</div>
              ) : (
                <div className="space-y-2.5">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="py-1"
                    >
                      <p className="text-sm font-medium leading-snug">{notification.title}</p>
                      <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{notification.message}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{formatRelativeTime(notification.created_at)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Department Metrics */}
      {stats.department_metrics.length > 0 && (
        <motion.div
          ref={deptRef}
          initial={{ opacity: 0, y: 20 }}
          animate={deptInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Department Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.department_metrics.map((dept, i) => (
                  <motion.div
                    key={dept.department}
                    initial={{ opacity: 0, y: 12 }}
                    animate={deptInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease }}
                    className="rounded-xl border border-white/[0.06] p-4 hover:bg-white/[0.03] hover:border-white/[0.10] transition-all duration-200 bg-white/[0.015]"
                  >
                    <p className="text-sm font-semibold font-display">{dept.department}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/35">Open Roles</span>
                        <span className="font-medium tabular-nums">{dept.open_roles}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/35">Candidates</span>
                        <span className="font-medium tabular-nums">{dept.candidates}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/35">Avg Time to Fill</span>
                        <span className="font-medium tabular-nums">{dept.avg_time_to_fill}d</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
