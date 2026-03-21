import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Clock,
  MoreHorizontal,
  Building2,
  Briefcase,
  ChevronRight,
  Download,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useJobs } from '@/hooks/use-api';
import { demoJobs } from '@/lib/demo-data';
import { formatDate, formatCurrency } from '@/lib/utils';
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
  const { data, isLoading } = useJobs();
  const jobs = data?.items || demoJobs;
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');

  const filteredJobs = jobs.filter((job) => {
    if (activeTab !== 'all' && job.status !== activeTab) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Job Requisitions</h1>
          <p className="text-muted-foreground">Manage and track your organization's open positions and hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="rounded-xl shadow-sm bg-white/50 backdrop-blur-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => navigate('/jobs/new')} className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Create Requisition
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Openings" value={jobs.length.toString()} icon={Briefcase} trend="+2 this month" />
        <StatCard title="Active Candidates" value="142" icon={Users} trend="+12% vs last month" />
        <StatCard title="Avg. Time to Hire" value="18d" icon={Clock} trend="-2d improvement" />
        <StatCard title="Offer Accept Rate" value="92%" icon={CheckCircle2} trend="+5% increase" />
      </div>

      {/* Filters & Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl backdrop-blur-sm">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.value
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="jobs-active-tab"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requisitions..."
              className="pl-9 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20 bg-white/50 backdrop-blur-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl shrink-0 bg-white/50 backdrop-blur-sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  return (
    <div className="premium-card p-6 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-success">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-card group overflow-hidden bg-white/70 backdrop-blur-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{job.department?.name}</span>
              <span className="text-border">·</span>
              <MapPin className="h-3 w-3" />
              <span className="truncate">{job.location?.name}</span>
            </div>
          </div>
          <StatusBadge status={job.status} type="job" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/30 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Candidates</p>
            <p className="text-lg font-bold text-primary">{job.candidate_count}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filled</p>
            <p className="text-lg font-bold text-primary">{job.filled_count}/{job.headcount}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src={`https://picsum.photos/seed/user${i + (job.id as any)}/32/32`}
                alt=""
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold ring-2 ring-white">
              +{Math.floor(Math.random() * 10) + 2}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar for hiring pipeline */}
      <div className="h-1.5 w-full bg-muted/30">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(job.filled_count / job.headcount) * 100}%` }}
          className="h-full bg-primary"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
