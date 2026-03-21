import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cardHover } from '@/lib/motion';
import { demoJobs } from '@/lib/demo-data';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { JobStatus } from '@/types';

const statusTabs: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending_approval' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Closed', value: 'closed' },
];

export function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');

  const filteredJobs = demoJobs.filter((job) => {
    if (activeTab !== 'all' && job.status !== activeTab) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Jobs"
        description={`${demoJobs.length} job requisitions`}
        actions={
          <Button onClick={() => navigate('/jobs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.value
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="jobs-tab"
                  className="absolute inset-0 bg-background rounded-md shadow-sm"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Create your first job requisition to start hiring."
          actionLabel="Create Job"
          onAction={() => navigate('/jobs/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover="hover"
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <motion.div variants={cardHover}>
                <Card
                  className="p-5 cursor-pointer transition-colors hover:border-primary/20"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{job.department?.name}</span>
                        <span className="text-border">·</span>
                        <MapPin className="h-3 w-3" />
                        <span>{job.location?.name}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="shrink-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/careers')}>View Careers Page</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => { if (window.confirm('Are you sure you want to close this job?')) { /* demo - no action */ } }}>Close Job</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <StatusBadge type="job" status={job.status} />
                    <Badge variant="secondary" className="text-2xs">
                      {job.employment_type.replace('_', ' ')}
                    </Badge>
                    {job.is_remote && (
                      <Badge variant="info" className="text-2xs">Remote</Badge>
                    )}
                  </div>

                  {job.compensation.min_salary && (
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation.max_salary || 0)}
                      {job.compensation.equity && (
                        <span className="text-xs ml-1">+ equity</span>
                      )}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{job.candidate_count} candidates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(job.created_at, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job.filled_count}/{job.headcount} filled
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
