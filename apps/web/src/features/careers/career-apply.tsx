import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Upload, CheckCircle2, FileText, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/hooks/use-api';
import { demoJobs } from '@/lib/demo-data';

export function CareerApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
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

I'm particularly drawn to Zenovra's mission of transforming the hiring process. I'd love the opportunity to contribute to a product that makes recruiting more human and efficient.

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Position Not Found</h2>
          <p className="text-muted-foreground mb-4">This job listing may have been removed.</p>
          <Button onClick={() => navigate('/careers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            Your application for <span className="font-medium text-foreground">{job.title}</span> has been successfully submitted.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We'll review your application and get back to you within 5-7 business days. You can track your application status in your portal.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/portal')} size="lg">
              Go to My Applications
            </Button>
            <Button variant="outline" onClick={() => navigate('/careers')} size="lg">
              Browse More Positions
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/careers" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/symbol.png" alt="Zenovra" className="h-4 w-4 object-contain" />
            </div>
            <span className="font-semibold">Zenovra Tech</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to={`/careers/${job.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Job Details
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Job Info Banner */}
          <Card className="mb-8 border-primary/20 bg-primary/[0.02]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-0.5">Applying for</p>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-xs">{job.department?.name}</Badge>
                  <Badge variant="info" className="text-xs">{job.location?.name}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone <span className="text-destructive">*</span></label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Portfolio URL <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <Separator />

                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resume <span className="text-destructive">*</span></label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => setResumeFile('Resume_JamieAnderson.pdf')}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : resumeFile
                          ? 'border-success/50 bg-success/5'
                          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium">{resumeFile}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium mb-1">Drop your resume here or click to browse</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Cover Letter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter</label>
                  <textarea
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    rows={10}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  />
                </div>

                {/* How did you hear */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">How did you hear about us?</label>
                  <select
                    value={form.heardFrom}
                    onChange={(e) => setForm({ ...form, heardFrom: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Careers Page">Careers Page</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Separator />

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    to={`/careers/${job.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </Link>
                  <Button type="submit" size="lg">
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>Powered by Zenovra Hiring Platform</p>
        </div>
      </footer>
    </div>
  );
}
