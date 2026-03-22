import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from 'recharts';
import { Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


const COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const funnelData = [
  { stage: 'Applied', count: 450, rate: '100%' },
  { stage: 'Screened', count: 280, rate: '62%' },
  { stage: 'Interviewed', count: 120, rate: '43%' },
  { stage: 'Offered', count: 35, rate: '29%' },
  { stage: 'Hired', count: 25, rate: '71%' },
];

const timeToHireData = [
  { month: 'Jan', days: 38 },
  { month: 'Feb', days: 35 },
  { month: 'Mar', days: 42 },
  { month: 'Apr', days: 36 },
  { month: 'May', days: 32 },
  { month: 'Jun', days: 28 },
  { month: 'Jul', days: 30 },
  { month: 'Aug', days: 26 },
  { month: 'Sep', days: 32 },
];

const sourceData = [
  { source: 'LinkedIn', hires: 12, applications: 180 },
  { source: 'Careers Page', hires: 8, applications: 120 },
  { source: 'Referrals', hires: 10, applications: 60 },
  { source: 'Agencies', hires: 3, applications: 45 },
  { source: 'Direct', hires: 5, applications: 90 },
];

const recruiterData = [
  { name: 'Sarah Chen', hires: 8, interviews: 24, offers: 10, pipeline: 18 },
  { name: 'Lisa Nakamura', hires: 6, interviews: 20, offers: 8, pipeline: 15 },
  { name: 'Marcus Johnson', hires: 4, interviews: 15, offers: 5, pipeline: 12 },
];

const offerAcceptance = [
  { month: 'Q1', accepted: 12, declined: 2 },
  { month: 'Q2', accepted: 15, declined: 3 },
  { month: 'Q3', accepted: 18, declined: 2 },
  { month: 'Q4', accepted: 8, declined: 1 },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function AnalyticsPage() {
  const chartsRef = useRef(null);
  const chartsInView = useInView(chartsRef, { once: true, margin: '-50px' });
  const recruiterRef = useRef(null);
  const recruiterInView = useInView(recruiterRef, { once: true, margin: '-50px' });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Analytics"
        description="Hiring metrics and performance insights"
        actions={
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 90 Days
          </Button>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hires" value={25} change={15} changeLabel="vs last quarter" icon={Users} delay={0} />
        <StatCard title="Avg Time to Hire" value="32d" change={-12} changeLabel="faster" icon={Clock} delay={0.05} />
        <StatCard title="Offer Acceptance" value="87%" change={5} changeLabel="improvement" icon={TrendingUp} delay={0.1} />
        <StatCard title="Source Efficiency" value="68%" change={8} changeLabel="vs last quarter" icon={TrendingUp} delay={0.15} />
      </div>

      {/* Charts Grid */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={chartsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: smoothEase }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Hiring Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="stage" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {funnelData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time to Hire Trend */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={chartsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Time to Hire Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeToHireData}>
                    <defs>
                      <linearGradient id="tthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="days" stroke="#6366f1" strokeWidth={2} fill="url(#tthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Performance */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={chartsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="source" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
                    <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Offer Acceptance */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={chartsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Offer Acceptance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={offerAcceptance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="accepted" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} name="Accepted" />
                    <Bar dataKey="declined" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} name="Declined" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recruiter Performance */}
      <motion.div
        ref={recruiterRef}
        initial={{ opacity: 0, y: 30 }}
        animate={recruiterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recruiter Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-white/[0.06] rounded-lg">
              <div className="grid grid-cols-5 gap-4 px-4 py-2.5 text-xs font-medium text-white/40 bg-white/[0.03] rounded-t-lg">
                <span>Recruiter</span>
                <span className="text-center">Active Pipeline</span>
                <span className="text-center">Interviews</span>
                <span className="text-center">Offers Made</span>
                <span className="text-center">Hires</span>
              </div>
              {recruiterData.map((recruiter, i) => (
                <motion.div
                  key={recruiter.name}
                  initial={{ opacity: 0, x: -15 }}
                  animate={recruiterInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: smoothEase }}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.03)' }}
                  className="grid grid-cols-5 gap-4 px-4 py-3 items-center border-t border-white/[0.06] transition-colors"
                >
                  <span className="text-sm font-medium">{recruiter.name}</span>
                  <span className="text-sm text-center">{recruiter.pipeline}</span>
                  <span className="text-sm text-center">{recruiter.interviews}</span>
                  <span className="text-sm text-center">{recruiter.offers}</span>
                  <span className="text-sm text-center font-semibold text-indigo-400">{recruiter.hires}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
