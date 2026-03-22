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
import { cn } from '@/lib/utils';

import { useCandidates, useJobs, useCreateInterview } from '@/hooks/use-api';

const interviewTypes = ['Phone Screen', 'Technical', 'Behavioral', 'Culture Fit', 'Panel', 'Final'];
const durationOptions = ['30', '45', '60', '90'];

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

interface ScheduleInterviewDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ScheduleInterviewDialog({ open, onClose }: ScheduleInterviewDialogProps) {
  const { data: candidatesData } = useCandidates();
  const { data: jobsData } = useJobs();
  const createInterview = useCreateInterview();

  const candidates = candidatesData?.items || [];
  const jobs = jobsData?.items || [];

  const [title, setTitle] = useState('Technical Interview — Frontend');
  const [candidateId, setCandidateId] = useState('');
  const [jobId, setJobId] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [date, setDate] = useState(getTomorrow);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('60');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Set defaults when data loads
  if (candidates.length > 0 && !candidateId) {
    setCandidateId(candidates[0].id);
  }
  if (jobs.length > 0 && !jobId) {
    const openJob = jobs.find((j) => j.status === 'open');
    if (openJob) setJobId(openJob.id);
    else if (jobs[0]) setJobId(jobs[0].id);
  }

  const toggleInterviewer = (id: string) => {
    setSelectedInterviewers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    createInterview.mutate(
      {
        title: title || `${interviewType} Interview`,
        candidate_id: candidateId,
        job_id: jobId,
        interview_type: interviewType.toLowerCase().replace(/\s+/g, '_'),
        scheduled_at: `${date}T${time}:00`,
        duration_minutes: Number(duration),
        interviewer_ids: selectedInterviewers,
        notes,
        status: 'scheduled',
      },
      {
        onSuccess: () => onClose(),
        onError: () => alert('Failed to schedule interview'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>Set up the interview details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Interview Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Candidate</label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {candidates.length === 0 && <option value="">No candidates</option>}
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Job</label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {jobs.length === 0 && <option value="">No jobs</option>}
                {jobs.filter((j) => j.status === 'open').map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Interview Type</label>
            <div className="flex flex-wrap gap-2">
              {interviewTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInterviewType(t)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
                    interviewType === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-input hover:bg-accent'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {durationOptions.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Meeting Link</label>
            <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
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
          <Button
            onClick={handleSubmit}
            disabled={createInterview.isPending || !candidateId || !jobId}
          >
            {createInterview.isPending ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
