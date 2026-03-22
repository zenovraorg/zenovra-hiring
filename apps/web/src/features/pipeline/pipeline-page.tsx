import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  MoreHorizontal, 
  Plus, 
  Table2, 
  Kanban, 
  Search, 
  Filter, 
  Download,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  Briefcase,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { AddCandidateDialog } from '@/features/candidates/add-candidate-dialog';
import { useJobs } from '@/hooks/use-api';
import { demoJobs, demoApplications } from '@/lib/demo-data';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import type { Application } from '@/types';

export function PipelinePage() {
  const navigate = useNavigate();
  const { data: jobsData } = useJobs();
  const jobs = jobsData?.items || demoJobs;
  const allApplications = demoApplications;
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [applications, setApplications] = useState<Application[]>(
    () => allApplications.filter((a) => a.job_id === jobs[0]?.id)
  );
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stages = selectedJob.pipeline_stages;

  const handleJobChange = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    setApplications(allApplications.filter((a) => a.job_id === job.id));
  };

  const getApplicationsForStage = useCallback(
    (stageId: string) => {
      return applications.filter((a) => {
        const matchesStage = a.stage_id === stageId;
        const matchesSearch = !searchQuery || 
          a.candidate?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.candidate?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.candidate?.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStage && matchesSearch;
      });
    },
    [applications, searchQuery]
  );

  const handleDragStart = (e: React.DragEvent, appId: string, stageId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ appId, stageId }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggingAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStageId(stageId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverStageId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    setDragOverStageId(null);
    setDraggingAppId(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { appId, stageId: sourceStageId } = data;

      if (sourceStageId === targetStageId) return;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, stage_id: targetStageId, moved_at: new Date().toISOString() }
            : app
        )
      );
    } catch {
      // ignore invalid drag data
    }
  };

  const handleDragEnd = () => {
    setDragOverStageId(null);
    setDraggingAppId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-8 max-w-[1800px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between shrink-0"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            <span>Active Pipeline</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
            {selectedJob.title}
            <Badge variant="outline" className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              {selectedJob.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Managing <span className="text-white font-bold">{applications.length}</span> candidates across <span className="text-white font-bold">{stages.length}</span> stages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                view === 'board' ? 'bg-white/[0.10] text-white border border-white/[0.08]' : 'text-white/50 hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                view === 'table' ? 'bg-white/[0.10] text-white border border-white/[0.08]' : 'text-white/50 hover:text-white'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
          <Separator orientation="vertical" className="h-8 mx-1 hidden md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl bg-white/[0.06] text-white/70 border-white/[0.08] hover:bg-white/[0.10] h-10">
                Switch Job
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl p-2 shadow-xl border-muted/20">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Open Roles</div>
              {jobs
                .filter((j) => j.status === 'open')
                .map((job) => (
                  <DropdownMenuItem key={job.id} onClick={() => handleJobChange(job)} className="rounded-lg cursor-pointer py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-sm">{job.title}</span>
                      <span className="text-xs text-muted-foreground">{job.department?.name} · {job.location?.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => setAddDialogOpen(true)} className="rounded-xl shadow-lg shadow-primary/20 h-10">
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Toolbar Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-white/[0.08] focus-visible:ring-white/20 bg-white/[0.04]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <AddCandidateDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />

      {/* Kanban Board */}
      <div className="flex-1 min-h-0 -mx-6 lg:-mx-8 px-6 lg:px-8 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-max pb-6">
          {stages.map((stage, index) => {
            const stageApps = getApplicationsForStage(stage.id);
            const isOver = dragOverStageId === stage.id;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col w-[320px] shrink-0"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: stage.color, boxShadow: `0 0 8px 2px ${stage.color}25, 0 0 0 2px ${stage.color}15` }}
                    />
                    <span className="text-sm font-bold text-white/90 uppercase tracking-wider">{stage.name}</span>
                    <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-bold text-white/70">
                      {stageApps.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06]">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Column Body - Drop Zone */}
                <div
                  className={`flex-1 space-y-3 rounded-2xl p-3 min-h-[200px] transition-all duration-300 overflow-y-auto custom-scrollbar ${
                    isOver
                      ? 'bg-white/[0.06] ring-2 ring-indigo-400/20'
                      : 'bg-white/[0.02] border border-white/[0.06]'
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <AnimatePresence mode="popLayout">
                    {stageApps.map((app) => (
                      <CandidateCard
                        key={app.id}
                        application={app}
                        isDragging={draggingAppId === app.id}
                        onNativeDragStart={(e) => handleDragStart(e, app.id, stage.id)}
                        onNativeDragEnd={handleDragEnd}
                        onViewProfile={() => navigate(`/candidates/${app.candidate_id}`)}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {stageApps.length === 0 && (
                    <div className={`flex flex-col items-center justify-center h-32 text-xs text-white/30 border-2 border-dashed rounded-xl transition-colors ${
                      isOver ? 'border-indigo-400/40 bg-indigo-400/5 text-indigo-400' : 'border-white/[0.08]'
                    }`}>
                      <Plus className="h-5 w-5 mb-2 opacity-40" />
                      <span>Drop candidates here</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({
  application,
  isDragging,
  onNativeDragStart,
  onNativeDragEnd,
  onViewProfile,
}: {
  application: Application;
  isDragging: boolean;
  onNativeDragStart: (e: React.DragEvent) => void;
  onNativeDragEnd: () => void;
  onViewProfile: () => void;
}) {
  const candidate = application.candidate;
  if (!candidate) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: isDragging ? 0.95 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`group bg-white/[0.03] rounded-xl border border-white/[0.06] cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.10] ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div 
        className="p-4"
        draggable
        onDragStart={onNativeDragStart}
        onDragEnd={onNativeDragEnd}
      >
        <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg shadow-sm">
            <AvatarImage src={`https://picsum.photos/seed/${candidate.id}/40/40`} />
            <AvatarFallback className="rounded-lg bg-white/[0.08] text-white/70 font-bold text-xs">
              {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white/90 leading-tight group-hover:text-white transition-colors">
              {candidate.first_name} {candidate.last_name}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground leading-tight mt-0.5 truncate">
              {candidate.current_title}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-muted/20">
            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={onViewProfile}>
              <Users className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => {}}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Interview
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => {}}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
              Reject Candidate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {candidate.skills.slice(0, 2).map((skill) => (
          <Badge key={skill} className="rounded-md bg-white/[0.06] text-white/50 text-[9px] font-bold border border-white/[0.08] px-1.5 py-0">
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 2 && (
          <span className="text-[9px] font-bold text-white/30">
            +{candidate.skills.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/30">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>4.8</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/30">
            <MessageSquare className="h-3 w-3" />
            <span>3</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-white/20">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(application.applied_at)}</span>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
