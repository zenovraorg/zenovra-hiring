import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from 'motion/react';
import {
  Search,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Heart,
  BookOpen,
  Gem,
  Palmtree,
  Rocket,
  Quote,
  ChevronDown,
  MapPin,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useJobs } from '@/hooks/use-api';
import { demoJobs } from '@/lib/demo-data';
import {
  heroReveal,
  heroStagger,
  sectionReveal,
  cardEntrance,
  cardStagger,
  smoothHover,
} from '@/lib/motion';

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

// Animated counter hook
function useAnimatedNumber(target: number, inView: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);
  return value;
}

// Department color mapping
const deptColors: Record<string, string> = {
  Engineering: 'from-indigo-500 to-blue-500',
  Design: 'from-pink-500 to-rose-500',
  Marketing: 'from-amber-500 to-orange-500',
  Sales: 'from-emerald-500 to-green-500',
  Product: 'from-violet-500 to-purple-500',
  Operations: 'from-cyan-500 to-teal-500',
  Finance: 'from-yellow-500 to-amber-500',
  'Human Resources': 'from-rose-500 to-pink-500',
};

const benefits = [
  { icon: Globe, title: 'Remote-First', desc: 'Work from anywhere. We care about output, not office hours.' },
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health coverage for you and your family.' },
  { icon: BookOpen, title: 'Learning Budget', desc: '₹50K annual budget for courses, books, and conferences.' },
  { icon: Gem, title: 'Equity', desc: 'Every team member is an owner with meaningful equity.' },
  { icon: Palmtree, title: 'Flexible PTO', desc: 'Take time off when you need it. No arbitrary limits.' },
  { icon: Rocket, title: 'Team Retreats', desc: 'Annual off-sites to connect, brainstorm, and recharge.' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Senior Engineer',
    quote: 'The level of ownership here is real. I shipped a feature in my first week and it was already impacting users.',
    initials: 'PS',
  },
  {
    name: 'Arjun Mehta',
    role: 'Product Designer',
    quote: "What drew me in was the culture of craft. Everyone here genuinely cares about building something excellent.",
    initials: 'AM',
  },
  {
    name: 'Sneha Reddy',
    role: 'Head of Growth',
    quote: "The founders set the tone — transparent, ambitious, and deeply supportive. It's rare to find all three.",
    initials: 'SR',
  },
];

export function CareersPage() {
  const navigate = useNavigate();
  const { data } = useJobs();
  const jobs = data?.items || demoJobs;
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [navHidden, setNavHidden] = useState(false);

  // Refs
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });
  const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-80px' });
  const jobsSectionRef = useRef(null);
  const jobsSectionInView = useInView(jobsSectionRef, { once: true, margin: '-50px' });
  const cultureRef = useRef(null);
  const cultureInView = useInView(cultureRef, { once: true, margin: '-50px' });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-80px' });

  // Nav hide on scroll
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setNavHidden(latest > 100 && latest > prev);
  });

  // Animated stats
  const teamCount = useAnimatedNumber(50, statsInView);
  const countryCount = useAnimatedNumber(12, statsInView);
  const retentionCount = useAnimatedNumber(98, statsInView);

  const publishedJobs = jobs.filter((j) => j.is_published && j.status === 'open');
  const departments = [...new Set(publishedJobs.map((j) => j.department?.name).filter(Boolean))];

  const filteredJobs = publishedJobs.filter((job) => {
    if (selectedDept && job.department?.name !== selectedDept) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deptJobCounts = departments.reduce((acc, dept) => {
    acc[dept!] = publishedJobs.filter((j) => j.department?.name === dept).length;
    return acc;
  }, {} as Record<string, number>);

  const scrollToJobs = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: navHidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: smoothEase }}
        className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10">
              <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">Zenovra Tech</span>
              <span className="hidden sm:inline text-xs text-white/40 ml-2 font-medium">Careers</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/careers/login"
              className="text-sm font-medium text-white/40 hover:text-white transition-colors"
              aria-label="Applicant Login"
            >
              Applicant Login
            </Link>
            <Button
              onClick={() => navigate('/login')}
              className="rounded-xl px-5 h-9 bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold text-sm shadow-lg shadow-white/5"
            >
              Admin Portal
            </Button>
          </div>
        </div>
        {/* Gradient bottom line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-24 lg:pt-36 lg:pb-32">
        {/* Clean background — single radial glow + subtle grid */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Single central glow */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-b from-indigo-500/[0.10] via-violet-500/[0.05] to-transparent blur-[120px]" />
          {/* Subtle side accent */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.08, 0.06] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] right-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.06] blur-[120px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div className="text-center" variants={heroStagger} initial="hidden" animate="show">
            <motion.div variants={heroReveal}>
              <Badge className="mb-8 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] bg-white/[0.06] text-white/60 border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08]">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-indigo-400" />
                We're Hiring — {publishedJobs.length} Open Roles
              </Badge>
            </motion.div>

            <motion.h1
              variants={heroReveal}
              className="text-balance font-display font-extrabold tracking-tight text-hero mb-8"
            >
              Build the future
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                with us.
              </span>
            </motion.h1>

            <motion.p
              variants={heroReveal}
              className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-white/40 mb-12"
            >
              Join a team building enterprise software that shapes how companies hire.
              We value craft, curiosity, and impact.
            </motion.p>

            <motion.div variants={heroReveal} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={scrollToJobs}
                className="h-13 rounded-2xl px-8 text-base font-semibold bg-white text-[#0a0a0f] hover:bg-white/90 shadow-lg shadow-white/10"
              >
                Explore Roles
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
              <Link
                to="/careers/login"
                className="h-13 rounded-2xl px-8 text-base font-semibold inline-flex items-center border border-white/[0.12] bg-white/[0.025] hover:bg-white/[0.08] transition-colors"
              >
                Applicant Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section ref={statsRef} className="relative border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: `${teamCount}+`, label: 'Team Members' },
              { value: `${countryCount}`, label: 'Countries' },
              { value: `${retentionCount}%`, label: 'Retention Rate' },
              { value: '4.9★', label: 'Glassdoor Rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: smoothEase }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold tracking-tight text-white mb-1 font-display">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="section-padding">
        <div className="page-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="text-center mb-16"
          >
            <h2 className="text-section font-display font-bold tracking-tight mb-4">
              Why people love working here
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              We invest in our team because great products come from great people.
            </p>
          </motion.div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            animate={benefitsInView ? 'show' : 'hidden'}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={cardEntrance}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="glass-card p-6 space-y-3 hover:bg-white/[0.06] hover:border-white/[0.12] cursor-default"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <benefit.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white/90">{benefit.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="open-positions" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          ref={jobsSectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={jobsSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-section font-display font-bold tracking-tight">Open Positions</h2>
              <div className="flex flex-wrap gap-2">
                <motion.button
                                                      onClick={() => setSelectedDept(null)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                    !selectedDept
                      ? 'bg-white text-[#0a0a0f] border-white/20 shadow-lg shadow-white/10'
                      : 'bg-white/[0.025] text-white/40 border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
                  }`}
                  aria-label="Show all roles"
                  aria-pressed={!selectedDept}
                >
                  All Roles
                  <span className="ml-1.5 text-xs opacity-60">{publishedJobs.length}</span>
                </motion.button>
                {departments.map((dept, i) => (
                  <motion.button
                    key={dept}
                    initial={{ opacity: 0, y: 10 }}
                    animate={jobsSectionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: smoothEase }}
                                                            onClick={() => setSelectedDept(dept === selectedDept ? null : dept!)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                      selectedDept === dept
                        ? 'bg-white text-[#0a0a0f] border-white/20 shadow-lg shadow-white/10'
                        : 'bg-white/[0.025] text-white/40 border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
                    }`}
                    aria-label={`Filter by ${dept}`}
                    aria-pressed={selectedDept === dept}
                  >
                    {dept}
                    <span className="ml-1.5 text-xs opacity-60">{deptJobCounts[dept!]}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search by role or keyword..."
                className="h-13 pl-12 rounded-2xl border-white/[0.08] bg-white/[0.025] text-white placeholder:text-white/25 focus-visible:ring-white/20 focus-visible:border-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search open positions"
              />
            </div>
          </div>

          {/* Job count */}
          <p className="text-sm text-white/30 mb-6" aria-live="polite">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
          </p>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => {
                const deptName = job.department?.name || '';
                const colorClass = deptColors[deptName] || 'from-indigo-500 to-blue-500';

                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.04, ease: smoothEase }}
                  >
                    <div
                      onClick={() => navigate(`/careers/${job.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/careers/${job.id}`);
                        }
                      }}
                      role="link"
                      tabIndex={0}
                      className="group relative flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-7 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-lg hover:shadow-indigo-500/[0.03] cursor-pointer lg:flex-row lg:items-center lg:justify-between focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] outline-none"
                    >
                      {/* Department color bar */}
                      <div
                        className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${colorClass} opacity-40 group-hover:opacity-80 transition-opacity`}
                      />

                      <div className="space-y-2.5 pl-4">
                        <div className="flex items-center gap-3">
                          <Badge className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold uppercase tracking-widest text-[10px] hover:bg-indigo-500/15">
                            {deptName}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs font-medium text-white/30 uppercase tracking-widest">
                            <MapPin className="h-3 w-3" />
                            {job.is_remote ? 'Remote' : job.location?.name}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white/35">
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
                              <span>
                                {formatCurrency(job.compensation.min_salary)} –{' '}
                                {formatCurrency(job.compensation.max_salary || 0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4 lg:pl-0 text-sm font-semibold text-white/40 group-hover:text-indigo-400 transition-colors">
                        <span>View Role</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="py-24 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.025] border border-white/[0.08]">
                  <Search className="h-7 w-7 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white/70">No positions found</h3>
                <p className="text-white/35 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="relative overflow-hidden border-y border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/[0.04] via-transparent to-purple-600/[0.04]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div ref={cultureRef} className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="space-y-8"
            >
              <h2 className="text-section font-display font-bold tracking-tight leading-[1.1]">
                A culture built on{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  trust and innovation.
                </span>
              </h2>
              <p className="text-lg text-white/45 leading-relaxed">
                We believe that great work happens when talented people are given the freedom to excel. Our culture is
                defined by transparency, collaboration, and a relentless focus on our mission.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Ownership', desc: 'Every team member is an owner and has a voice.' },
                  { title: 'Growth', desc: 'Continuous learning and professional development.' },
                  { title: 'Balance', desc: 'Flexible work arrangements for a healthy life.' },
                  { title: 'Impact', desc: 'Work on projects that matter to millions.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={cultureInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                      <h4 className="font-bold text-sm text-white/85">{item.title}</h4>
                    </div>
                    <p className="text-sm text-white/35">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual — Gradient card with logo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={cultureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 rounded-[3rem] blur-3xl" />
                {/* Card */}
                <div className="relative h-full rounded-[3rem] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex flex-col items-center justify-center gap-6 p-12">
                  <motion.img
                    src="/symbol.png"
                    alt="Zenovra"
                    className="h-20 w-20 object-contain"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold font-display text-white/80">Zenovra Tech</p>
                    <p className="text-sm text-white/30">Building the future of hiring</p>
                  </div>
                  {/* Accent stats */}
                  <div className="flex gap-8 mt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-indigo-400">50+</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">People</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-violet-400">12</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">98%</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">Retention</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="section-padding">
        <div className="page-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="text-center mb-16"
          >
            <h2 className="text-section font-display font-bold tracking-tight mb-4">
              Hear from our team
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Don't take our word for it — here's what our team members have to say.
            </p>
          </motion.div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            animate={testimonialsInView ? 'show' : 'hidden'}
            className="grid gap-6 lg:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={cardEntrance}
                className="glass-card p-7 space-y-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <Quote className="h-5 w-5 text-indigo-400/40" />
                <p className="text-sm text-white/55 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 text-sm font-bold text-white/70">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{t.name}</div>
                    <div className="text-xs text-white/35">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="text-3xl font-display font-bold tracking-tight sm:text-5xl">Don't see your role?</h2>
            <p className="text-lg text-white/45">
              We're always looking for talented people. Send us your resume and we'll reach out when the right
              opportunity opens up.
            </p>
                          <Button
                onClick={() => navigate('/careers/login')}
                className="h-13 rounded-2xl px-10 text-base font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-500/20 border-0"
              >
                Submit Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Logo & tagline */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08]">
                  <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
                </div>
                <span className="text-base font-bold tracking-tight text-white/80">Zenovra Tech</span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">
                Building the future of enterprise hiring. Part of Zenovra Org.
              </p>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Company</h4>
              <div className="flex flex-col gap-2.5">
                <a href="https://zenovra.org" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  About
                </a>
                <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Blog
                </a>
                <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Press
                </a>
              </div>
            </div>

            {/* Careers */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Careers</h4>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={scrollToJobs}
                  className="text-sm text-white/30 hover:text-white/60 transition-colors text-left"
                >
                  Open Positions
                </button>
                <Link to="/careers/login" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Applicant Portal
                </Link>
              </div>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Connect</h4>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  GitHub
                </a>
                <a
                  href="mailto:careers@zenovra.org"
                  className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  careers@zenovra.org
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06] text-center">
            <p className="text-xs font-medium text-white/20">
              © 2026 Zenovra Tech · Part of Zenovra Org · All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
