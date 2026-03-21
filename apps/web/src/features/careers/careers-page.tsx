import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, Building2, ArrowRight, Zap, Globe, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { formatCurrency } from '@/lib/utils';
import { useDataStore } from '@/stores/data-store';

export function CareersPage() {
  const navigate = useNavigate();
  const jobs = useDataStore((s) => s.jobs);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const publishedJobs = jobs.filter((j) => j.is_published && j.status === 'open');

  const departments = [...new Set(publishedJobs.map((j) => j.department?.name).filter(Boolean))];

  const filteredJobs = publishedJobs.filter((job) => {
    if (selectedDept && job.department?.name !== selectedDept) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b">
        <div className="gradient-mesh absolute inset-0" />
        {/* Sign In links */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-4 flex justify-end gap-4">
          <Link
            to="/careers/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            Applicant Sign In
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Admin Login
          </Link>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold">Zenovra Tech</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              {publishedJobs.length} open positions across {departments.length} teams
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Build the Future With Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join a team of builders, thinkers, and innovators shaping how the world hires talent.
              We offer competitive compensation, equity, and the chance to make real impact.
            </p>
            <div className="flex items-center gap-6 justify-center text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span>Actively Hiring</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>SF, NYC, London & Remote</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedDept(null)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              !selectedDept ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
            }`}
          >
            All ({publishedJobs.length})
          </button>
          {departments.map((dept) => {
            const count = publishedJobs.filter((j) => j.department?.name === dept).length;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept === selectedDept ? null : dept!)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedDept === dept ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>

        {/* Job Listings */}
        <div className="space-y-3">
          {filteredJobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
              <Card className="p-5 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group" onClick={() => navigate(`/careers/${job.id}`)}>
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/careers/${job.id}`} className="text-base font-semibold group-hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{job.department?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{job.location?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {job.experience_level}
                      </Badge>
                      {job.is_remote && <Badge variant="info" className="text-xs">Remote</Badge>}
                      {job.compensation.min_salary && (
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation.max_salary || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => { e.stopPropagation(); navigate(`/careers/${job.id}`); }}
                  >
                    Apply
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No positions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>Powered by Zenovra Hiring Platform</p>
        </div>
      </footer>
    </div>
  );
}
