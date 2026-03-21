import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, MoreHorizontal, Plus, Table2, Kanban } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddCandidateDialog } from '@/features/candidates/add-candidate-dialog';
import { useDataStore } from '@/stores/data-store';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import type { Application } from '@/types';

export function PipelinePage() {
  const navigate = useNavigate();
  const jobs = useDataStore((s) => s.jobs);
  const storeApplications = useDataStore((s) => s.applications);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [applications, setApplications] = useState<Application[]>(
    () => storeApplications.filter((a) => a.job_id === jobs[0]?.id)
  );
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const stages = selectedJob.pipeline_stages;

  const handleJobChange = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    setApplications(storeApplications.filter((a) => a.job_id === job.id));
  };

  const getApplicationsForStage = useCallback(
    (stageId: string) => applications.filter((a) => a.stage_id === stageId),
    [applications]
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
    // Only clear if we're actually leaving the column (not entering a child)
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
    <div className="p-6 lg:p-8 space-y-6 h-full flex flex-col">
      <div className="flex items-start justify-between shrink-0">
        <div>
          <PageHeader
            title="Pipeline"
            description={`${selectedJob.title} · ${applications.length} candidates`}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView('board')}
              className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                view === 'board' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                view === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>

          {/* Job Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedJob.title}
                <ChevronDown className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {jobs
                .filter((j) => j.status === 'open')
                .map((job) => (
                  <DropdownMenuItem key={job.id} onClick={() => handleJobChange(job)}>
                    {job.title}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      <AddCandidateDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {stages.map((stage, index) => {
            const stageApps = getApplicationsForStage(stage.id);
            const isOver = dragOverStageId === stage.id;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex flex-col w-[280px] shrink-0"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium">{stage.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {stageApps.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Column Body - Drop Zone */}
                <div
                  className={`flex-1 space-y-2 rounded-lg p-2 min-h-[200px] transition-all duration-200 ${
                    isOver
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/30 border-2 border-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {stageApps.map((app) => (
                    <CandidateCard
                      key={app.id}
                      application={app}
                      isDragging={draggingAppId === app.id}
                      onDragStart={(e) => handleDragStart(e, app.id, stage.id)}
                      onDragEnd={handleDragEnd}
                      onViewProfile={() => navigate(`/candidates/${app.candidate_id}`)}
                    />
                  ))}
                  {stageApps.length === 0 && (
                    <div className={`flex items-center justify-center h-20 text-xs text-muted-foreground border border-dashed rounded-md ${
                      isOver ? 'border-primary text-primary' : ''
                    }`}>
                      Drop candidates here
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
  onDragStart,
  onDragEnd,
  onViewProfile,
}: {
  application: Application;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onViewProfile: () => void;
}) {
  const candidate = application.candidate;
  if (!candidate) return null;

  return (
    <div
      className={`bg-card rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-2xs">
              {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-tight">
              {candidate.first_name} {candidate.last_name}
            </p>
            <p className="text-2xs text-muted-foreground leading-tight">
              {candidate.current_title}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewProfile}>View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.alert('Schedule Interview dialog coming soon')}>Schedule Interview</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.alert('Use drag and drop to move between stages')}>Move Stage</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => { if (window.confirm('Reject this candidate?')) { /* demo */ } }}>Reject</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="muted" className="text-2xs px-1.5 py-0">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-2xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-2xs capitalize">
            {application.source}
          </Badge>
        </div>
        <span>{formatRelativeTime(application.applied_at)}</span>
      </div>
    </div>
  );
}
