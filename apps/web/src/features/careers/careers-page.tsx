import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  ArrowRight, 
  Zap, 
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

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function CareersPage() {
  const navigate = useNavigate();
  const { data } = useJobs();
  const jobs = data?.items || demoJobs;
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const cultureRef = useRef(null);
  const cultureInView = useInView(cultureRef, { once: true, margin: '-50px' });
  const footerRef = useRef(null);
  const footerInView = useInView(footerRef, { once: true, margin: '-50px' });
  const jobsSectionRef = useRef(null);
  const jobsSectionInView = useInView(jobsSectionRef, { once: true, margin: '-50px' });

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
        {/* Animated background orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 30, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 20, -30, 0], y: [0, -20, 40, 0], scale: [1, 1.1, 0.9, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-[0%] left-[30%] h-[350px] w-[350px] rounded-full bg-violet-500/[0.05] blur-[100px]"
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -60, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: 4 + i * 2,
                height: 4 + i * 2,
                left: `${15 + i * 14}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary/60 border-primary/10 bg-primary/5">
                Open Positions
              </Badge>
            </motion.div>
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-primary mb-8">
              {['Build', 'the', 'future'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: smoothEase }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: smoothEase }}
                className="text-primary/40 inline-block"
              >
                with us.
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: smoothEase }}
              className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground mb-12"
            >
              Explore open roles and find your next opportunity.
              We're looking for talented people to join our growing team.
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              {[
                { icon: ShieldCheck, label: 'Premium Benefits' },
                { icon: Star, label: 'Equity Options' },
                { icon: Users, label: 'Great Culture' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: smoothEase }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <motion.div
          ref={jobsSectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={jobsSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="rounded-[2rem] bg-white p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-primary/5"
        >
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Open Positions</h2>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDept(null)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                    !selectedDept
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All Roles
                </motion.button>
                {departments.map((dept, i) => (
                  <motion.button
                    key={dept}
                    initial={{ opacity: 0, y: 10 }}
                    animate={jobsSectionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: smoothEase }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDept(dept === selectedDept ? null : dept!)}
                    className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                      selectedDept === dept
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {dept}
                  </motion.button>
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
                  transition={{ duration: 0.4, delay: index * 0.08, ease: smoothEase }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
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
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button className="h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                        View Position
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
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
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="bg-primary py-32 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div ref={cultureRef} className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="space-y-8"
            >
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
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={cultureInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                      <h4 className="font-bold uppercase tracking-widest text-sm">{item.title}</h4>
                    </div>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] bg-white/10 backdrop-blur-3xl p-8 border border-white/20">
                <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                  <Zap className="h-32 w-32 text-white animate-float" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-20">
        <motion.div
          ref={footerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={footerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mx-auto max-w-7xl px-6 lg:px-8"
        >
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
        </motion.div>
      </footer>
    </div>
  );
}
