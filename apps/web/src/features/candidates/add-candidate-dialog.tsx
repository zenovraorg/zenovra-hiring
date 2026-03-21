import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataStore } from '@/stores/data-store';

const sourceOptions = ['LinkedIn', 'Referral', 'Careers Page', 'Direct', 'Agency'];

interface AddCandidateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddCandidateDialog({ open, onClose }: AddCandidateDialogProps) {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Morgan');
  const [email, setEmail] = useState('taylor.morgan@email.com');
  const [phone, setPhone] = useState('+1 (555) 987-6543');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/taylormorgan');
  const [currentCompany, setCurrentCompany] = useState('Google');
  const [currentTitle, setCurrentTitle] = useState('Senior Software Engineer');
  const [experienceYears, setExperienceYears] = useState('6');
  const [source, setSource] = useState('LinkedIn');
  const [skills, setSkills] = useState('React, Python, AWS, Docker');

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>Fill in the candidate details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current Company</label>
              <Input value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current Title</label>
              <Input value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Experience Years</label>
            <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {sourceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Skills (comma-separated)</label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            const sourceMap: Record<string, string> = {
              'LinkedIn': 'linkedin',
              'Referral': 'referral',
              'Careers Page': 'careers_page',
              'Direct': 'direct',
              'Agency': 'agency',
            };
            useDataStore.getState().addCandidate({
              first_name: firstName,
              last_name: lastName,
              email,
              phone: phone || undefined,
              linkedin_url: linkedinUrl || undefined,
              current_company: currentCompany || undefined,
              current_title: currentTitle || undefined,
              experience_years: experienceYears ? Number(experienceYears) : undefined,
              source: (sourceMap[source] || 'direct') as any,
              skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
            });
            onClose();
          }}>Add Candidate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
