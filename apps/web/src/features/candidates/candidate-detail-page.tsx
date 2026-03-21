import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Clock,
  Plus,
  Send,
  CalendarDays,
  ExternalLink,
  Linkedin,
  Globe,
  ChevronRight,
  MessageSquare,
  FileText,
  UserPlus,
  Building2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { demoCandidates, demoApplications, demoJobs, demoUsers, demoActivity } from '@/lib/demo-data';
import { getInitials, formatDate, formatRelativeTime } from '@/lib/utils';

type Tab = 'activity' | 'applications' | 'notes' | 'documents';

const tabs: { label: string; value: Tab }[] = [
  { label: 'Activity', value: 'activity' },
  { label: 'Applications', value: 'applications' },
  { label: 'Notes', value: 'notes' },
  { label: 'Documents', value: 'documents' },
];

// Demo notes for the notes tab
const demoNotes = [
  {
    id: 'note1',
    author: demoUsers[0],
    content: 'Had an initial call. Very strong communication skills and deep technical knowledge. Excited about the role.',
    created_at: '2024-09-12T14:00:00Z',
  },
  {
    id: 'note2',
    author: demoUsers[1],
    content: 'Reviewed portfolio. Impressive work on design systems at previous company. Would be a great culture fit.',
    created_at: '2024-09-14T10:30:00Z',
  },
  {
    id: 'note3',
    author: demoUsers[4],
    content: 'References check complete. All three references gave positive feedback, especially regarding leadership and collaboration.',
    created_at: '2024-09-16T16:00:00Z',
  },
];

// Demo activity timeline entries
const demoTimeline = [
  { id: 't1', action: 'applied', description: 'Applied for the position', date: '2024-09-02T09:00:00Z', actor: demoUsers[0] },
  { id: 't2', action: 'moved_stage', description: 'Moved to Phone Screen', date: '2024-09-05T14:00:00Z', actor: demoUsers[0] },
  { id: 't3', action: 'interview_scheduled', description: 'Phone screen scheduled', date: '2024-09-07T10:00:00Z', actor: demoUsers[1] },
  { id: 't4', action: 'feedback_submitted', description: 'Phone screen feedback: Strong Yes', date: '2024-09-08T16:30:00Z', actor: demoUsers[1] },
  { id: 't5', action: 'moved_stage', description: 'Moved to Technical Interview', date: '2024-09-10T09:00:00Z', actor: demoUsers[0] },
  { id: 't6', action: 'interview_scheduled', description: 'Technical interview scheduled for Sep 22', date: '2024-09-15T11:00:00Z', actor: demoUsers[1] },
];

// Demo documents
const demoDocuments = [
  { id: 'doc1', name: 'Resume.pdf', type: 'resume', size: '245 KB', uploaded_at: '2024-09-02T09:00:00Z' },
  { id: 'doc2', name: 'Cover_Letter.pdf', type: 'cover_letter', size: '128 KB', uploaded_at: '2024-09-02T09:00:00Z' },
  { id: 'doc3', name: 'Portfolio_Samples.zip', type: 'portfolio', size: '4.2 MB', uploaded_at: '2024-09-03T14:00:00Z' },
];

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const [noteText, setNoteText] = useState('');

  const candidate = demoCandidates.find((c) => c.id === id);
  const candidateApplications = demoApplications.filter((a) => a.candidate_id === id);

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-semibold">Candidate not found</h2>
        <p className="text-muted-foreground">The candidate you are looking for does not exist.</p>
        <Button variant="outline" onClick={() => navigate('/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  const fullName = `${candidate.first_name} ${candidate.last_name}`;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate('/candidates')} className="gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Candidates
        </Button>
      </motion.div>

      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-start gap-5"
      >
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{getInitials(fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{candidate.headline}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <UserPlus className="h-4 w-4" />
                Add to Job
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button size="sm" className="gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Schedule Interview
              </Button>
            </div>
          </div>

          {/* Contact + meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {candidate.location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {candidate.location}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {candidate.email}
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {candidate.phone}
              </div>
            )}
            <Badge variant="secondary" className="capitalize">
              {candidate.source.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Main layout: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {(candidate.skills || []).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.experience_years && (
                <div>
                  <p className="text-xs text-muted-foreground">Years of Experience</p>
                  <p className="text-sm font-medium">{candidate.experience_years} years</p>
                </div>
              )}
              {candidate.current_company && (
                <div>
                  <p className="text-xs text-muted-foreground">Current Company</p>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{candidate.current_company}</p>
                  </div>
                </div>
              )}
              {candidate.current_title && (
                <div>
                  <p className="text-xs text-muted-foreground">Current Title</p>
                  <p className="text-sm font-medium">{candidate.current_title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {candidate.linkedin_url ? (
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Linkedin className="h-4 w-4" />
                  No LinkedIn profile
                </div>
              )}
              {candidate.portfolio_url ? (
                <a
                  href={candidate.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  No portfolio
                </div>
              )}
            </CardContent>
          </Card>

          {/* Source details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="info" className="capitalize">
                {candidate.source.replace('_', ' ')}
              </Badge>
              {candidate.source_detail && (
                <p className="text-xs text-muted-foreground">{candidate.source_detail}</p>
              )}
              <div>
                <p className="text-xs text-muted-foreground mt-2">Added</p>
                <p className="text-sm">{formatDate(candidate.created_at)}</p>
              </div>
              {candidate.owner && (
                <div>
                  <p className="text-xs text-muted-foreground mt-2">Owner</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(candidate.owner.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">{candidate.owner.display_name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-1 border-b"
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.value === 'applications' && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({candidateApplications.length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          {activeTab === 'activity' && <ActivityTab />}
          {activeTab === 'applications' && (
            <ApplicationsTab applications={candidateApplications} />
          )}
          {activeTab === 'notes' && (
            <NotesTab noteText={noteText} setNoteText={setNoteText} />
          )}
          {activeTab === 'documents' && <DocumentsTab />}
        </div>
      </div>
    </div>
  );
}

/* ─── Activity Tab ────────────────────────────────────────────────────── */

function ActivityTab() {
  return (
    <div className="space-y-1">
      {demoTimeline.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="flex gap-4 py-3"
        >
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mt-1.5 ${
                event.action === 'feedback_submitted'
                  ? 'bg-success'
                  : event.action === 'interview_scheduled'
                  ? 'bg-info'
                  : event.action === 'moved_stage'
                  ? 'bg-warning'
                  : 'bg-primary'
              }`}
            />
            {i < demoTimeline.length - 1 && (
              <div className="w-px flex-1 bg-border mt-1" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{event.description}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(event.date)}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px]">
                  {getInitials(event.actor.display_name)}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">{event.actor.display_name}</p>
              <span className="text-xs text-muted-foreground">&middot;</span>
              <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Applications Tab ────────────────────────────────────────────────── */

function ApplicationsTab({ applications }: { applications: typeof demoApplications }) {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center py-12 text-muted-foreground"
      >
        No applications found for this candidate.
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app, i) => {
        const job = app.job || demoJobs.find((j) => j.id === app.job_id);
        if (!job) return null;

        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{job.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{job.department?.name}</span>
                    <span>&middot;</span>
                    <span>{job.location?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="text-sm font-medium">{app.stage?.name || 'Unknown'}</p>
                  </div>
                  <StatusBadge type="application" status={app.status} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Applied</p>
                  <p className="text-xs">{formatDate(app.applied_at)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Notes Tab ───────────────────────────────────────────────────────── */

function NotesTab({
  noteText,
  setNoteText,
}: {
  noteText: string;
  setNoteText: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Add note form */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card>
          <CardContent className="pt-6">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this candidate..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button size="sm" disabled={!noteText.trim()} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing notes */}
      {demoNotes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(note.author.display_name)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{note.author.display_name}</p>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(note.created_at)}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">{note.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Documents Tab ───────────────────────────────────────────────────── */

function DocumentsTab() {
  return (
    <div className="space-y-3">
      {demoDocuments.map((doc, i) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Badge variant="muted" className="text-[10px] capitalize">
                    {doc.type.replace('_', ' ')}
                  </Badge>
                  <span>&middot;</span>
                  <span>{doc.size}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(doc.uploaded_at)}</p>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Upload button */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
