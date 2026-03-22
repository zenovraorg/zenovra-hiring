import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Briefcase, Building2, Clock, DollarSign,
  Share2, Users, CheckCircle2, Star, Globe, Heart, Coffee,
  GraduationCap, Copy, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { demoOrg, demoJobs } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { useJobs } from '@/hooks/use-api';

export function CareerJobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { data } = useJobs();
  const jobs = data?.items || demoJobs;
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Position Not Found</h2>
          <p className="text-muted-foreground mb-4">This job listing may have been removed or is no longer available.</p>
          <Button onClick={() => navigate('/careers')}>
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
    { icon: Coffee, label: 'Unlimited PTO' },
    { icon: GraduationCap, label: 'Learning & development budget' },
    { icon: Users, label: 'Diverse & inclusive team' },
    { icon: Star, label: 'Equity for all employees' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/careers" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/symbol.png" alt="Zenovra" className="h-4 w-4 object-contain" />
            </div>
            <span className="font-semibold">Zenovra Tech</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Share2 className="mr-1.5 h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Positions
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Title & Meta */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-3">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span>{job.department?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">{(job.employment_type || '').replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{job.experience_level}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {job.experience_level}
                  </Badge>
                  <Badge variant="info" className="capitalize">
                    {(job.employment_type || '').replace('_', ' ')}
                  </Badge>
                  {job.is_remote && <Badge variant="success">Remote</Badge>}
                  {job.compensation?.min_salary && (
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {formatCurrency(job.compensation.min_salary)} &ndash; {formatCurrency(job.compensation?.max_salary || 0)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">About the Role</h2>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    You'll be joining a world-class team that values collaboration, technical excellence, and user-centric design.
                    This is an opportunity to work on products that are used by thousands of companies to transform their hiring processes.
                  </p>
                </div>

                <Separator />

                {/* Requirements */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                  <ul className="space-y-2.5">
                    {(job.requirements || []).map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                        <CheckCircle2 className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {job.nice_to_haves && job.nice_to_haves.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Nice to Have</h2>
                      <ul className="space-y-2.5">
                        {job.nice_to_haves.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                            <Star className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <Separator />

                {/* Compensation */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Compensation</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.compensation?.min_salary && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <DollarSign className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Base Salary</p>
                          <p className="font-semibold">
                            {formatCurrency(job.compensation.min_salary)} &ndash; {formatCurrency(job.compensation?.max_salary || 0)}
                          </p>
                        </div>
                      </div>
                    )}
                    {job.compensation?.equity && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                          <Star className="h-4.5 w-4.5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Equity</p>
                          <p className="font-semibold">{job.compensation.equity}</p>
                        </div>
                      </div>
                    )}
                    {job.compensation?.bonus && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10">
                          <Briefcase className="h-4.5 w-4.5 text-info" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bonus / OTE</p>
                          <p className="font-semibold">{job.compensation.bonus}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Apply CTA */}
              <Card className="border-primary/20 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Interested in this role?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join {job.candidate_count ?? 0}+ candidates who have already applied.
                  </p>
                  <Button size="lg" className="w-full" onClick={handleApply}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About {demoOrg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{demoOrg.industry}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="font-medium">{demoOrg.size} employees</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Headquarters</span>
                    <span className="font-medium">San Francisco, CA</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">2020</span>
                  </div>
                </CardContent>
              </Card>

              {/* Culture */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Why Zenovra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cultureHighlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                          <item.icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>Powered by Zenovra Hiring Platform</p>
        </div>
      </footer>
    </div>
  );
}
