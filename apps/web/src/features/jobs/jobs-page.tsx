import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, MapPin, Users, Clock,
  Building2, Briefcase, ChevronRight, Download,
  CheckCircle2, TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/hooks/use-api';
import type { JobStatus, JobRequisition as Job } from '@/types';

const statusTabs: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Draft', value: 'draft' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Closed', value: 'closed' },
];

export function JobsPage() {
  const navigate = useNavigate();
  const { data } = useJobs();
  const jobs = data?.items || [];
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');

  const filteredJobs = jobs.filter((job) => {
    if (activeTab !== 'all' && job.status !== activeTab) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90 font-display">Job Requisitions</h1>
          <p className="text-[13px] text-white/40 mt-0.5">Manage and track your organization's open positions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => navigate('/jobs/new')} variant="gradient">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Create Requisition
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <QuickStat title="Total Openings" value={jobs.length.toString()} icon={Briefcase} trend="+2 this month" />
        <QuickStat title="Active Candidates" value="142" icon={Users} trend="+12% vs last month" />
        <QuickStat title="Avg. Time to Hire" value="18d" icon={Clock} trend="-2d improvement" />
        <QuickStat title="Offer Accept Rate" value="92%" icon={CheckCircle2} trend="+5% increase" />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-0.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 ${
                activeTab === tab.value ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="jobs-tab"
                  className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.06]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <Input
              placeholder="Search requisitions..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon-sm">
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuickStat({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between">
        <div className="rounded-xl p-2 bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 text-indigo-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-[13px] text-white/40 font-medium">{title}</p>
        <p className="text-xl font-bold text-white/90 font-display tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-[15px] leading-tight text-white/90 group-hover:text-white transition-colors truncate font-display">{job.title}</h3>
            <div className="flex items-center gap-1.5 text-[12px] text-white/35 mt-1">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{job.department?.name}</span>
              <span className="text-white/15">&middot;</span>
              <MapPin className="h-3 w-3" />
              <span className="truncate">{job.location?.name}</span>
            </div>
          </div>
          <StatusBadge status={job.status} type="job" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.04]">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Candidates</p>
            <p className="text-base font-bold text-white/90 tabular-nums mt-0.5">{job.candidate_count ?? 0}</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.04]">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Filled</p>
            <p className="text-base font-bold text-white/90 tabular-nums mt-0.5">{job.filled_count ?? 0}/{job.headcount ?? 0}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-1.5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                className="inline-block h-7 w-7 rounded-lg ring-2 ring-background object-cover"
                src={`https://picsum.photos/seed/user${i + (job.id as any)}/32/32`}
                alt=""
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-[9px] font-semibold text-white/40 ring-2 ring-background">
              +{Math.floor(Math.random() * 10) + 2}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white/40 group-hover:bg-white group-hover:text-background transition-all h-7 text-xs rounded-lg">
            View
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="h-[2px] w-full bg-white/[0.03]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${job.headcount ? ((job.filled_count || 0) / job.headcount) * 100 : 0}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
