import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Upload, CheckCircle2, FileText, X, ArrowRight, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/hooks/use-api';
import { demoJobs } from '@/lib/demo-data';

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const steps = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Resume & Links' },
  { num: 3, label: 'Cover Letter' },
];

export function CareerApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    fullName: 'Jamie Anderson',
    email: 'jamie.anderson@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/jamieanderson',
    portfolio: 'https://jamieanderson.dev',
    coverLetter: `Dear Hiring Team,

I'm excited to apply for this position at Zenovra Tech. With over 6 years of experience building performant, accessible web applications, I believe I would be a strong addition to your team.

In my current role, I've led the development of a design system used by 50+ engineers and have driven significant improvements in page load times and user engagement metrics. I'm passionate about creating intuitive experiences and mentoring junior engineers.

Looking forward to discussing how I can contribute to your team.

Best regards,
Jamie Anderson`,
    heardFrom: 'LinkedIn',
  });

  const { data: jobsData } = useJobs();
  const jobs = jobsData?.items || demoJobs;
  const job = jobs.find((j) => j.id === id);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isApplicantLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate(`/careers/login?redirect=/careers/${id}/apply`);
    }
  }, [id, navigate]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Position Not Found</h2>
          <p className="text-white/40 mb-4">This job listing may have been removed.</p>
          <Button onClick={() => navigate('/careers')} className="bg-white text-[#0a0a0f] hover:bg-white/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api/v1';
      const res = await fetch(`${apiBase}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id || (job as any)._id,
          first_name: (form.fullName || '').split(' ')[0] || 'Unknown',
          last_name: (form.fullName || '').split(' ').slice(1).join(' ') || '',
          email: form.email,
          phone: form.phone,
          linkedin_url: form.linkedin,
          portfolio_url: form.portfolio,
          cover_letter: form.coverLetter,
          source: 'careers_page',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to submit application');
      }
      setSubmitted(true);
    } catch (err: any) {
      alert(`Application failed: ${err.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0].name);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6"
          >
            <Sparkles className="h-10 w-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold mb-3">Application Submitted!</h2>
          <p className="text-white/40 mb-2">
            Your application for <span className="font-semibold text-white/80">{job.title}</span> has been successfully submitted.
          </p>
          <p className="text-sm text-white/30 mb-10">
            We'll review your application and get back to you within 5-7 business days. Track your status in the portal.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/portal')} className="h-12 rounded-xl bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold">
              Go to My Applications
            </Button>
            <Button variant="ghost" onClick={() => navigate('/careers')} className="h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06]">
              Browse More Positions
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-indigo-500/30">
      {/* Header */}
      <nav className="border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/careers" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10">
              <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
            </div>
            <span className="font-bold">Zenovra Tech</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to={`/careers/${job.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Job Details
        </Link>

        {/* Job Info Banner */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35 mb-1 uppercase tracking-wider font-medium">Applying for</p>
            <h2 className="text-lg font-bold text-white/90">{job.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-semibold">
                {job.department?.name}
              </Badge>
              <Badge className="rounded-full bg-white/[0.06] text-white/40 border-white/[0.08] text-[10px] font-medium">
                {job.location?.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentStep === step.num
                    ? 'text-white'
                    : currentStep > step.num
                      ? 'text-indigo-400'
                      : 'text-white/25'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep === step.num
                      ? 'bg-white text-[#0a0a0f]'
                      : currentStep > step.num
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-white/[0.06] text-white/30 border border-white/[0.08]'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="h-4 w-4" /> : step.num}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-[1px] ${currentStep > step.num ? 'bg-indigo-500/30' : 'bg-white/[0.06]'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: smoothEase }}
        >
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <>
                  <h3 className="text-lg font-bold text-white/90">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-white/60">Full Name <span className="text-red-400">*</span></label>
                      <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/60">Email <span className="text-red-400">*</span></label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-white/60">Phone <span className="text-red-400">*</span></label>
                      <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="heardFrom" className="text-sm font-medium text-white/60">How did you hear about us?</label>
                      <select
                        id="heardFrom"
                        value={form.heardFrom}
                        onChange={(e) => setForm({ ...form, heardFrom: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                      >
                        <option value="LinkedIn" className="bg-background">LinkedIn</option>
                        <option value="Careers Page" className="bg-background">Careers Page</option>
                        <option value="Referral" className="bg-background">Referral</option>
                        <option value="Other" className="bg-background">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => setCurrentStep(2)} className="rounded-xl px-6 bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Resume & Links */}
              {currentStep === 2 && (
                <>
                  <h3 className="text-lg font-bold text-white/90">Resume & Links</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Resume <span className="text-red-400">*</span></label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => setResumeFile('Resume_JamieAnderson.pdf')}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-indigo-400/50 bg-indigo-500/[0.06]'
                          : resumeFile
                            ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                            : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03]'
                      }`}
                    >
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm font-medium text-white/70">{resumeFile}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }} className="text-white/30 hover:text-white/60">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-white/20 mx-auto mb-2" />
                          <p className="text-sm font-medium text-white/40 mb-1">Drop your resume here or click to browse</p>
                          <p className="text-xs text-white/25">PDF, DOC, or DOCX up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="text-sm font-medium text-white/60">LinkedIn URL</label>
                    <Input id="linkedin" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="portfolio" className="text-sm font-medium text-white/60">Portfolio URL <span className="text-white/25 font-normal">(optional)</span></label>
                    <Input id="portfolio" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="https://yourportfolio.com" className="bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20" />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setCurrentStep(1)} className="text-white/40 hover:text-white hover:bg-white/[0.06]">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(3)} className="rounded-xl px-6 bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Cover Letter */}
              {currentStep === 3 && (
                <>
                  <h3 className="text-lg font-bold text-white/90">Cover Letter</h3>
                  <div className="space-y-2">
                    <label htmlFor="coverLetter" className="text-sm font-medium text-white/60">Tell us why you're a great fit</label>
                    <textarea
                      id="coverLetter"
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      rows={10}
                      className="flex w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 resize-y"
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setCurrentStep(2)} className="text-white/40 hover:text-white hover:bg-white/[0.06]">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="rounded-xl px-8 bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 font-semibold shadow-lg shadow-indigo-500/20">
                      Submit Application
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-white/20">
          <p>Powered by Zenovra Hiring Platform</p>
        </div>
      </footer>
    </div>
  );
}
