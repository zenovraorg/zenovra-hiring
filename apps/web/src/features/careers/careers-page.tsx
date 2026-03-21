import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  ArrowRight, 
  Zap, 
  Globe, 
  LogIn, 
  CheckCircle2, 
  Users, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useJobs } from '@/hooks/use-api';
import { demoJobs } from '@/lib/demo-data';

export function CareersPage() {
  const navigate = useNavigate();
  const { data } = useJobs();
  const jobs = data?.items || demoJobs;
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
    <div className="min-h-screen bg-[#fafafa] text-primary selection:bg-primary/10 selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Zenovra Tech</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/careers/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Applicant Login
            </Link>
            <Button onClick={() => navigate('/login')} className="rounded-xl px-6 shadow-lg shadow-primary/20">
              Admin Portal
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[50%] w-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary/60 border-primary/10 bg-primary/5">
                Join our world-class team
              </Badge>
              <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-primary mb-8">
                Build the future of <span className="text-primary/40">talent acquisition.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground mb-12">
                We're on a mission to revolutionize how companies find and hire the best talent. 
                Join a fast-growing team of innovators, thinkers, and builders.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Remote First</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Premium Benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Equity Options</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="rounded-[2rem] bg-white p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-primary/5">
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Open Positions</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDept(null)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                    !selectedDept 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All Roles
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept === selectedDept ? null : dept!)}
                    className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                      selectedDept === dept 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by role or keyword..."
                className="h-14 pl-12 rounded-2xl border-muted/20 bg-muted/30 focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div 
                    onClick={() => navigate(`/careers/${job.id}`)}
                    className="group relative flex flex-col gap-6 rounded-3xl border border-primary/5 bg-white p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 cursor-pointer lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="rounded-full bg-primary/5 text-primary font-bold uppercase tracking-widest text-[10px]">
                          {job.department?.name}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                          {job.is_remote ? 'Remote' : job.location?.name}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="capitalize">{job.experience_level} Level</span>
                        </div>
                        {job.compensation.min_salary && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-warning" />
                            <span>{formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation.max_salary || 0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                      View Position
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No positions found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="bg-primary py-32 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">A culture built on <span className="text-white/40">trust and innovation.</span></h2>
              <p className="text-xl text-white/70 leading-relaxed">
                We believe that great work happens when talented people are given the freedom to excel. 
                Our culture is defined by transparency, collaboration, and a relentless focus on our mission.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Ownership", desc: "Every team member is an owner and has a voice." },
                  { title: "Growth", desc: "Continuous learning and professional development." },
                  { title: "Balance", desc: "Flexible work arrangements for a healthy life." },
                  { title: "Impact", desc: "Work on projects that matter to millions." }
                ].map((item) => (
                  <div key={item.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                      <h4 className="font-bold uppercase tracking-widest text-sm">{item.title}</h4>
                    </div>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-white/10 backdrop-blur-3xl p-8 border border-white/20">
                <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                  <Zap className="h-32 w-32 text-white animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight">Zenovra Tech</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              © 2026 Zenovra Tech Enterprise. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
