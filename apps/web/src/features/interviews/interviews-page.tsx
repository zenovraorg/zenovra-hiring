import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, User, Plus, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { demoInterviews, demoApplications, demoCandidates } from '@/lib/demo-data';
import { getInitials, formatDate } from '@/lib/utils';

export function InterviewsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = demoInterviews.filter((i) => i.status === 'scheduled');
  const completed = demoInterviews.filter((i) => i.status === 'completed');

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Interviews"
        description={`${demoInterviews.length} total interviews`}
        actions={
          <Button onClick={() => window.alert('Schedule Interview dialog coming soon')}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        }
      />

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Upcoming
        </h2>
        <div className="space-y-3">
          {today.map((interview, index) => {
            const app = demoApplications.find((a) => a.id === interview.application_id);
            const candidate = app?.candidate;

            return (
              <motion.div key={interview.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                <Card className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${selectedId === interview.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedId(selectedId === interview.id ? null : interview.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-primary/5 px-3 py-2 text-center min-w-[60px]">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(interview.scheduled_at, { month: 'short' }).split(' ')[0]}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {new Date(interview.scheduled_at).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{interview.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(interview.scheduled_at).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>· {interview.duration_minutes}min</span>
                          </div>
                          {interview.meeting_link && (
                            <div className="flex items-center gap-1 text-info">
                              <Video className="h-3 w-3" />
                              <span>Video Call</span>
                            </div>
                          )}
                          {interview.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{interview.location}</span>
                            </div>
                          )}
                        </div>
                        {candidate && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-2xs">
                                {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {candidate.first_name} {candidate.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              for {app?.job?.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="interview" status={interview.status} />
                      <div className="flex -space-x-1.5">
                        {interview.interviewers.map((p) => (
                          <Avatar key={p.user_id} className="h-7 w-7 border-2 border-background">
                            <AvatarFallback className="text-2xs">
                              {p.user ? getInitials(p.user.display_name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completed Section */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Completed
          </h2>
          <div className="space-y-3">
            {completed.map((interview, index) => {
              const app = demoApplications.find((a) => a.id === interview.application_id);
              const candidate = app?.candidate;

              return (
                <motion.div key={interview.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                  <Card className={`p-4 opacity-75 hover:opacity-100 transition-opacity cursor-pointer ${selectedId === interview.id ? 'ring-2 ring-primary opacity-100' : ''}`} onClick={() => setSelectedId(selectedId === interview.id ? null : interview.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-3 py-2 text-center min-w-[60px]">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(interview.scheduled_at, { month: 'short' }).split(' ')[0]}
                          </span>
                          <span className="text-lg font-bold">
                            {new Date(interview.scheduled_at).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{interview.title}</h3>
                          {candidate && (
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-2xs">
                                  {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {candidate.first_name} {candidate.last_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <StatusBadge type="interview" status={interview.status} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
