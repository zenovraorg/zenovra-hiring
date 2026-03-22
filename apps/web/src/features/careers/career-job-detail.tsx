import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  ArrowLeft, MapPin, Briefcase, Building2, Clock, DollarSign,
  Share2, Users, CheckCircle2, Star, Globe, Heart, Coffee,
  GraduationCap, Copy, Check, ArrowRight, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { demoOrg, demoJobs } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { useJobs } from '@/hooks/use-api';

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function CareerJobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { data } = useJobs();
  const jobs = data?.items || demoJobs;
  const job = jobs.find((j) => j.id === id);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Position Not Found</h2>
          <p className="text-white/40 mb-4">This job listing may have been removed or is no longer available.</p>
          <Button onClick={() => navigate('/careers')} className="bg-white text-[#0a0a0f] hover:bg-white/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    const isLoggedIn = localStorage.getItem('isApplicantLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate(`/careers/${job.id}/apply`);
    } else {
      navigate(`/careers/login?redirect=/careers/${job.id}/apply`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cultureHighlights = [
    { icon: Globe, label: 'Remote-first culture' },
    { icon: Heart, label: 'Comprehensive benefits' },
    { icon: Coffee, label: 'Flexible PTO' },
    { icon: GraduationCap, label: 'Learning budget' },
    { icon: Users, label: 'Diverse & inclusive' },
    { icon: Star, label: 'Equity for all' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-indigo-500/30">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 z-[60] origin-left"
      />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/careers" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10">
              <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
            </div>
            <span className="font-bold">Zenovra Tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <Button
              onClick={handleApply}
              className="rounded-xl px-5 h-9 bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold text-sm"
            >
              Apply Now
            </Button>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-indigo-500/[0.08] to-transparent blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/30 mb-6">
            <Link to="/careers" className="hover:text-white/60 transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white/50">{job.department?.name}</span>
            <span>/</span>
            <span className="text-white/60">{job.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold uppercase tracking-widest text-[10px]">
                {job.department?.name}
              </Badge>
              {job.is_remote && (
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-semibold text-[10px]">
                  Remote
                </Badge>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/40">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.is_remote ? 'Remote' : job.location?.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{(job.employment_type || '').replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{job.experience_level}</span>
              </div>
              {job.compensation?.min_salary && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-400/60" />
                  <span>{formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation?.max_salary || 0)}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              className="space-y-10"
            >
              {/* About */}
              <div>
                <h2 className="text-lg font-bold mb-4 text-white/90">About the Role</h2>
                <p className="text-white/50 leading-relaxed">{job.description}</p>
                <p className="text-white/50 leading-relaxed mt-3">
                  You'll be joining a world-class team that values collaboration, technical excellence, and user-centric design.
                  This is an opportunity to work on products that are used by thousands of companies to transform their hiring processes.
                </p>
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              {/* Requirements */}
              <div>
                <h2 className="text-lg font-bold mb-4 text-white/90">Requirements</h2>
                <ul className="space-y-3">
                  {(job.requirements || []).map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/50">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {job.nice_to_haves && job.nice_to_haves.length > 0 && (
                <>
                  <div className="h-[1px] bg-white/[0.06]" />
                  <div>
                    <h2 className="text-lg font-bold mb-4 text-white/90">Nice to Have</h2>
                    <ul className="space-y-3">
                      {job.nice_to_haves.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/50">
                          <Star className="h-4 w-4 text-amber-400/60 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="h-[1px] bg-white/[0.06]" />

              {/* Compensation */}
              <div>
                <h2 className="text-lg font-bold mb-4 text-white/90">Compensation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.compensation?.min_salary && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <DollarSign className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/35 mb-0.5">Base Salary</p>
                        <p className="font-semibold text-white/90">
                          {formatCurrency(job.compensation.min_salary)} – {formatCurrency(job.compensation?.max_salary || 0)}
                        </p>
                      </div>
                    </div>
                  )}
                  {job.compensation?.equity && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Star className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/35 mb-0.5">Equity</p>
                        <p className="font-semibold text-white/90">{job.compensation.equity}</p>
                      </div>
                    </div>
                  )}
                  {job.compensation?.bonus && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <Briefcase className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/35 mb-0.5">Bonus / OTE</p>
                        <p className="font-semibold text-white/90">{job.compensation.bonus}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: smoothEase }}
              className="space-y-6 lg:sticky lg:top-24"
            >
              {/* Apply CTA */}
              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.06] to-transparent p-6 space-y-4">
                <h3 className="font-bold text-white/90">Interested in this role?</h3>
                <p className="text-sm text-white/40">
                  Join {job.candidate_count ?? 0}+ candidates who have already applied.
                </p>
                <Button onClick={handleApply} className="w-full h-11 rounded-xl bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Company Info */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                <h3 className="font-bold text-white/80 text-sm">About {demoOrg.name}</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Industry', value: demoOrg.industry },
                    { label: 'Company Size', value: `${demoOrg.size} employees` },
                    { label: 'Headquarters', value: 'San Francisco, CA' },
                    { label: 'Founded', value: '2020' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-white/35">{item.label}</span>
                      <span className="font-medium text-white/70">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culture */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                <h3 className="font-bold text-white/80 text-sm">Why Zenovra</h3>
                <div className="space-y-3">
                  {cultureHighlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <item.icon className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                      <span className="text-white/55">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-white/20">
          <p>Powered by Zenovra Hiring Platform</p>
        </div>
      </footer>
    </div>
  );
}
