import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Users, FileText } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { demoDepartments, demoLocations, demoUsers } from '@/lib/demo-data';
import { useDataStore } from '@/stores/data-store';

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
    useDataStore.getState().addJob({
      title: form.title,
      department_id: form.department_id,
      location_id: form.location_id,
      hiring_manager_id: form.hiring_manager_id,
      recruiter_id: form.recruiter_id,
      employment_type: form.employment_type as any,
      experience_level: form.experience_level as any,
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
    });
    navigate('/jobs');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Job Requisition</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to create a new position</p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Description' },
          { num: 3, label: 'Compensation' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === s.num
                ? 'bg-primary text-primary-foreground'
                : step > s.num
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {step > s.num ? '✓' : s.num}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Job Title *</label>
                <Input
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Department *</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={form.department_id}
                    onChange={(e) => updateField('department_id', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {demoDepartments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location *</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Employment Type</label>
                  <div className="flex flex-wrap gap-2">
                    {employmentTypes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => updateField('employment_type', t.value)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          form.employment_type === t.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Experience Level</label>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => updateField('experience_level', l.value)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          form.experience_level === l.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Hiring Manager</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={form.hiring_manager_id}
                    onChange={(e) => updateField('hiring_manager_id', e.target.value)}
                  >
                    <option value="">Select hiring manager</option>
                    {demoUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.display_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Headcount</label>
                  <Input
                    type="number"
                    min="1"
                    value={form.headcount}
                    onChange={(e) => updateField('headcount', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_remote}
                    onChange={(e) => updateField('is_remote', e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">This is a remote position</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>
              Next: Description
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Description & Requirements */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description *</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px] resize-y"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium mb-1.5 block">Requirements</label>
                <div className="space-y-2">
                  {form.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder={`Requirement ${i + 1}`}
                        value={req}
                        onChange={(e) => updateListItem('requirements', i, e.target.value)}
                      />
                      {form.requirements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeListItem('requirements', i)}
                          className="text-muted-foreground shrink-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addListItem('requirements')}>
                    + Add requirement
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Nice to Have</label>
                <div className="space-y-2">
                  {form.nice_to_haves.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder={`Nice to have ${i + 1}`}
                        value={item}
                        onChange={(e) => updateListItem('nice_to_haves', i, e.target.value)}
                      />
                      {form.nice_to_haves.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeListItem('nice_to_haves', i)}
                          className="text-muted-foreground shrink-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addListItem('nice_to_haves')}>
                    + Add item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next: Compensation</Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Compensation */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Min Salary (USD)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 150000"
                    value={form.min_salary}
                    onChange={(e) => updateField('min_salary', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Max Salary (USD)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 220000"
                    value={form.max_salary}
                    onChange={(e) => updateField('max_salary', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Equity Range (optional)</label>
                <Input
                  placeholder="e.g. 0.05% - 0.15%"
                  value={form.equity}
                  onChange={(e) => updateField('equity', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Preview */}
          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <CardTitle className="text-base">Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
                <div>
                  <span className="text-muted-foreground">Title</span>
                  <p className="font-medium">{form.title || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium">
                    {demoDepartments.find((d) => d.id === form.department_id)?.name || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-medium">
                    {demoLocations.find((l) => l.id === form.location_id)?.name || '—'}
                    {form.is_remote && ' (Remote)'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p className="font-medium capitalize">{form.employment_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Compensation</span>
                  <p className="font-medium">
                    {form.min_salary && form.max_salary
                      ? `$${Number(form.min_salary).toLocaleString()} – $${Number(form.max_salary).toLocaleString()}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Headcount</span>
                  <p className="font-medium">{form.headcount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSubmit}>Save as Draft</Button>
              <Button onClick={handleSubmit}>Create & Publish</Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
