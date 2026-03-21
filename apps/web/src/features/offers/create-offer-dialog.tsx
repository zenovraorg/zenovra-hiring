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

import { demoCandidates } from '@/lib/demo-data';

const benefitOptions = [
  'Health/Dental/Vision',
  '401k Match',
  'Unlimited PTO',
  'Home Office Stipend',
  'Learning Budget',
];

function getThreeWeeksFromNow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().split('T')[0];
}

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateOfferDialog({ open, onClose }: CreateOfferDialogProps) {
  const candidates = demoCandidates;
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? '');
  const [jobTitle, setJobTitle] = useState('Senior Frontend Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [baseSalary, setBaseSalary] = useState('200000');
  const [bonus, setBonus] = useState('30000');
  const [equity, setEquity] = useState('0.10%');
  const [startDate, setStartDate] = useState(getThreeWeeksFromNow);
  const [benefits, setBenefits] = useState<string[]>([...benefitOptions]);
  const [notes, setNotes] = useState('');

  const toggleBenefit = (b: string) => {
    setBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
          <DialogDescription>Configure the compensation package.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Candidate</label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Job Title</label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Department</label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Base Salary</label>
              <Input type="number" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bonus</label>
              <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Equity</label>
              <Input value={equity} onChange={(e) => setEquity(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Benefits</label>
            <div className="flex flex-wrap gap-3">
              {benefitOptions.map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={benefits.includes(b)}
                    onChange={() => toggleBenefit(b)}
                    className="rounded border-input"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            // TODO: Wire to API when offer endpoints are available
            onClose();
          }}>Create Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
