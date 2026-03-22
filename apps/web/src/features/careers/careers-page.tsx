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
  LogIn,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp
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
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });
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
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-white/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10">
              <img src="/symbol.png" alt="Zenovra" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">Zenovra Tech</span>
              <span className="hidden sm:inline text-xs text-white/30 ml-2">Careers</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/careers/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              Applicant Login
            </Link>
            <Button
              onClick={() => navigate('/login')}
              className="rounded-xl px-6 bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold shadow-lg shadow-white/10"
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Animated background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Top gradient glow */}
          <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-indigo-500/[0.12] via-purple-500/[0.06] to-transparent blur-[120px]" />
          {/* Animated orbs */}
          <motion.div
            animate={{ x: [0, 40, -20, 0], y: [0, -50, 30, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/[0.08] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -30, 40, 0], y: [0, 40, -30, 0], scale: [1, 0.85, 1.15, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[10%] right-[10%] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.06] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 25, -35, 0], y: [0, -30, 50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-[10%] left-[35%] h-[300px] w-[300px] rounded-full bg-violet-500/[0.06] blur-[100px]"
          />
          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -100, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 8 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              className="absolute rounded-full bg-white/30"
              style={{
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                left: `${8 + i * 7.5}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
            />
          ))}
          {/* Sweeping light beam */}
          <motion.div
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[45%] h-[1px] w-[30%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          />
          <motion.div
            animate={{ x: ['300%', '-100%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 4 }}
            className="absolute top-[65%] h-[1px] w-[25%] bg-gradient-to-r from-transparent via-indigo-400/[0.08] to-transparent"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <Badge className="mb-8 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] bg-white/[0.06] text-white/60 border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08]">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-indigo-400" />
                We're Hiring — {publishedJobs.length} Open Roles
              </Badge>
            </motion.div>
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5.5rem] leading-[0.95] mb-8">
              {['Build', 'the', 'future'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: smoothEase }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
                className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                with us.
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: smoothEase }}
              className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-white/40 mb-14"
            >
              Join a team building enterprise software that shapes how companies hire.
              We value craft, curiosity, and impact.
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-10 text-sm font-medium text-white/30">
              {[
                { icon: ShieldCheck, label: 'Premium Benefits' },
                { icon: Star, label: 'Equity Options' },
                { icon: TrendingUp, label: 'Career Growth' },
                { icon: Users, label: 'Great Culture' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.08, ease: smoothEase }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4 text-indigo-400/60" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section ref={statsRef} className="relative border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Team Members' },
              { value: '12', label: 'Countries' },
              { value: '98%', label: 'Retention Rate' },
              { value: '4.9★', label: 'Glassdoor Rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: smoothEase }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold tracking-tight text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/30 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          ref={jobsSectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={jobsSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Open Positions</h2>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDept(null)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                    !selectedDept
                      ? 'bg-white text-[#0a0a0f] border-white/20 shadow-lg shadow-white/10'
                      : 'bg-white/[0.04] text-white/50 border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
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
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                      selectedDept === dept
                        ? 'bg-white text-[#0a0a0f] border-white/20 shadow-lg shadow-white/10'
                        : 'bg-white/[0.04] text-white/50 border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
                    }`}
                  >
                    {dept}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search by role or keyword..."
                className="h-14 pl-12 rounded-2xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus-visible:ring-white/20 focus-visible:border-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: smoothEase }}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <div
                    onClick={() => navigate(`/careers/${job.id}`)}
                    className="group relative flex flex-col gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-8 transition-all hover:bg-white/[0.05] hover:border-white/[0.12] cursor-pointer lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold uppercase tracking-widest text-[10px] hover:bg-indigo-500/15">
                          {job.department?.name}
                        </Badge>
                        <span className="text-xs font-medium text-white/25 uppercase tracking-widest">
                          {job.is_remote ? 'Remote' : job.location?.name}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white/30">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span className="capitalize">{job.experience_level} Level</span>
                        </div>
                        {job.compensation.min_salary && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400/60">$</span>
                            <span>{formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation.max_salary || 0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/40 group-hover:text-white/70 transition-colors">
                      <span>View Role</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="py-24 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <Search className="h-7 w-7 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white/70">No positions found</h3>
                <p className="text-white/30 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="relative overflow-hidden border-y border-white/[0.06]">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/[0.04] via-transparent to-purple-600/[0.04]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div ref={cultureRef} className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                A culture built on{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  trust and innovation.
                </span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed">
                We believe that great work happens when talented people are given the freedom to excel.
                Our culture is defined by transparency, collaboration, and a relentless focus on our mission.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
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
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                      <h4 className="font-bold text-sm text-white/80">{item.title}</h4>
                    </div>
                    <p className="text-sm text-white/30">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                {/* Glow ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-8 rounded-full border border-dashed border-white/[0.06]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-16 rounded-full border border-dashed border-white/[0.04]"
                />
                <div className="relative h-64 w-64 rounded-[3rem] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center">
                  <motion.img
                    src="/symbol.png"
                    alt="Zenovra"
                    className="h-24 w-24 object-contain"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                {/* Floating accent dots */}
                <motion.div
                  animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                />
                <motion.div
                  animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -left-6 h-8 w-8 rounded-full bg-cyan-500/15 border border-cyan-500/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Don't see your role?
            </h2>
            <p className="text-lg text-white/40">
              We're always looking for talented people. Send us your resume and we'll reach out when the right opportunity opens up.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => navigate('/careers/login')}
                className="h-14 rounded-2xl px-10 text-base font-semibold bg-white text-[#0a0a0f] hover:bg-white/90 shadow-lg shadow-white/10"
              >
                Submit Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16">
        <motion.div
          ref={footerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={footerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]">
                <img src="/symbol.png" alt="Zenovra" className="h-4 w-4 object-contain" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white/70">Zenovra Tech</span>
            </div>
            <p className="text-xs font-medium text-white/20">
              © 2026 Zenovra Tech · Part of Zenovra Org · All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-white/20">
              <a href="#" className="hover:text-white/50 transition-colors">Twitter</a>
              <a href="#" className="hover:text-white/50 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white/50 transition-colors">GitHub</a>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
