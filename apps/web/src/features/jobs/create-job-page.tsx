import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Users, FileText, X, XCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { demoDepartments, demoLocations, demoUsers } from '@/lib/demo-data';
import { useCreateJob } from '@/hooks/use-api';

const employmentTypes = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
];

export function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: 'Senior Full Stack Engineer',
    department_id: 'dept1',
    location_id: 'loc1',
    hiring_manager_id: 'u2',
    recruiter_id: 'u1',
    employment_type: 'full_time',
    experience_level: 'senior',
    is_remote: false,
    description: 'We are looking for a Senior Full Stack Engineer to join our platform team and help build scalable, high-performance features that power the Zenovra hiring platform. You will work across the stack — from React frontends to Python APIs — and have a direct impact on how modern companies hire talent.',
    requirements: ['5+ years of full stack development experience', 'Strong proficiency in React, TypeScript, and Python', 'Experience with MongoDB or similar NoSQL databases', 'Familiarity with cloud infrastructure (AWS/GCP)', 'Strong communication and collaboration skills'],
    nice_to_haves: ['Experience building SaaS products', 'Background in HR tech or recruiting platforms', 'Open source contributions'],
    min_salary: '180000',
    max_salary: '250000',
    equity: '0.05% - 0.15%',
    headcount: '2',
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateListItem = (field: 'requirements' | 'nice_to_haves', index: number, value: string) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field: 'requirements' | 'nice_to_haves') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'requirements' | 'nice_to_haves', index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    createJob.mutate(
      {
        title: form.title,
        department_id: form.department_id,
        location_id: form.location_id,
        hiring_manager_id: form.hiring_manager_id,
        recruiter_id: form.recruiter_id,
        employment_type: form.employment_type,
        experience_level: form.experience_level,
        is_remote: form.is_remote,
        description: form.description,
        requirements: form.requirements.filter(Boolean),
        nice_to_haves: form.nice_to_haves.filter(Boolean),
        compensation: {
          min_salary: Number(form.min_salary) || 0,
          max_salary: Number(form.max_salary) || 0,
          currency: 'USD',
          equity: form.equity || undefined,
        },
        headcount: Number(form.headcount) || 1,
        status: 'open',
        is_published: true,
      },
      {
        onSuccess: () => navigate('/jobs'),
        onError: (err: any) => {
          console.error('Failed to create job:', err);
          const detail = err?.data?.detail || err?.message || 'Unknown error';
          alert(`Failed to create job: ${detail}`);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/jobs')}
          className="rounded-full hover:bg-muted/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job Requisition</h1>
          <p className="text-muted-foreground">Define the role and start your hiring process</p>
        </div>
      </motion.div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between px-2">
        {[
          { num: 1, label: 'Job Details', icon: Briefcase },
          { num: 2, label: 'Description', icon: FileText },
          { num: 3, label: 'Compensation', icon: DollarSign },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-3 transition-all ${
                step === s.num ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                step === s.num ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'border-muted/30'
              }`}>
                <s.icon className={`h-5 w-5 ${step === s.num ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Step 0{s.num}</p>
                <p className="text-sm font-bold">{s.label}</p>
              </div>
            </button>
            {i < 2 && (
              <div className="flex-1 mx-6 h-px bg-muted/20 hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="mt-8">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">Job Title</label>
                  <Input
                    placeholder="e.g. Senior Product Designer"
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="h-12 text-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Department</label>
                    <select
                      className="flex h-12 w-full rounded-xl border border-muted/30 bg-background px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={form.department_id}
                      onChange={(e) => updateField('department_id', e.target.value)}
                    >
                      <option value="">Select department</option>
                      {demoDepartments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Location</label>
                    <select
                      className="flex h-12 w-full rounded-xl border border-muted/30 bg-background px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={form.location_id}
                      onChange={(e) => updateField('location_id', e.target.value)}
                    >
                      <option value="">Select location</option>
                      {demoLocations.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground/80">Employment Type</label>
                    <div className="flex flex-wrap gap-2">
                      {employmentTypes.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => updateField('employment_type', t.value)}
                          className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                            form.employment_type === t.value
                              ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
                              : 'bg-muted/5 border-muted/20 hover:border-primary/30'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground/80">Experience Level</label>
                    <div className="flex flex-wrap gap-2">
                      {experienceLevels.map((l) => (
                        <button
                          key={l.value}
                          onClick={() => updateField('experience_level', l.value)}
                          className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                            form.experience_level === l.value
                              ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
                              : 'bg-muted/5 border-muted/20 hover:border-primary/30'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/[0.02] border border-primary/10">
                  <input
                    type="checkbox"
                    id="is_remote"
                    checked={form.is_remote}
                    onChange={(e) => updateField('is_remote', e.target.checked)}
                    className="h-4 w-4 rounded border-muted/30 text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="is_remote" className="text-sm font-bold cursor-pointer">
                    This is a remote-friendly position
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20">
                Continue to Description
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Role Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">About the Role</label>
                  <textarea
                    className="flex w-full rounded-xl border border-muted/30 bg-background px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[200px] resize-none"
                    placeholder="Describe the mission, impact, and daily life in this role..."
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground/80">Key Requirements</label>
                    <Button variant="ghost" size="sm" onClick={() => addListItem('requirements')} className="text-primary font-bold">
                      + Add Requirement
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {form.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <Input
                          placeholder={`Requirement #${i + 1}`}
                          value={req}
                          onChange={(e) => updateListItem('requirements', i, e.target.value)}
                          className="h-11 rounded-xl"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeListItem('requirements', i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full px-8 h-12 font-bold">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20">
                Continue to Compensation
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Compensation & Perks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Minimum Salary (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="120,000"
                        value={form.min_salary}
                        onChange={(e) => updateField('min_salary', e.target.value)}
                        className="h-12 pl-10 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Maximum Salary (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="180,000"
                        value={form.max_salary}
                        onChange={(e) => updateField('max_salary', e.target.value)}
                        className="h-12 pl-10 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">Equity Range</label>
                  <Input
                    placeholder="e.g. 0.01% - 0.05%"
                    value={form.equity}
                    onChange={(e) => updateField('equity', e.target.value)}
                    className="h-12 rounded-xl font-medium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Final Review */}
            <Card className="premium-card bg-primary/[0.02] border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Final Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Title</p>
                    <p className="text-sm font-bold truncate">{form.title}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</p>
                    <p className="text-sm font-bold">{demoDepartments.find(d => d.id === form.department_id)?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Location</p>
                    <p className="text-sm font-bold">{demoLocations.find(l => l.id === form.location_id)?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Salary</p>
                    <p className="text-sm font-bold">${Number(form.min_salary).toLocaleString()} - ${Number(form.max_salary).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)} className="rounded-full px-8 h-12 font-bold">
                Back
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleSubmit} className="rounded-full px-8 h-12 font-bold border-muted/30">
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} className="rounded-full px-12 h-12 font-bold shadow-lg shadow-primary/20">
                  Create & Publish Job
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
