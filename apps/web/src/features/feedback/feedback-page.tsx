import { motion } from 'motion/react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { useFeedback } from '@/hooks/use-api';
import { getInitials, formatRelativeTime } from '@/lib/utils';

const recColors: Record<string, 'success' | 'info' | 'warning' | 'destructive'> = {
  strong_yes: 'success',
  yes: 'info',
  neutral: 'warning',
  no: 'destructive',
  strong_no: 'destructive',
};

const recLabels: Record<string, string> = {
  strong_yes: 'Strong Yes',
  yes: 'Yes',
  neutral: 'Neutral',
  no: 'No',
  strong_no: 'Strong No',
};

export function FeedbackPage() {
  const { data: feedbackData, isLoading } = useFeedback();
  const feedbackItems = feedbackData?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const avgRating = feedbackItems.length > 0
    ? (feedbackItems.reduce((sum, fb: any) => sum + (fb.overall_rating || 0), 0) / feedbackItems.length).toFixed(1)
    : '0';
  const strongYesCount = feedbackItems.filter((fb: any) => fb.recommendation === 'strong_yes').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Feedback & Scorecards"
        description="Review interview feedback and evaluations"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Feedback" value={feedbackItems.length} icon={MessageSquare} delay={0} />
        <StatCard title="Avg Rating" value={avgRating} icon={Star} delay={0.05} />
        <StatCard title="Strong Yes" value={strongYesCount} icon={ThumbsUp} delay={0.1} />
        <StatCard title="Total Reviews" value={feedbackItems.length} icon={MessageSquare} delay={0.15} />
      </div>

      {feedbackItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted/10">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No feedback submitted yet</p>
        </div>
      )}

      <div className="space-y-3">
        {feedbackItems.map((fb: any, index: number) => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Card className="p-5 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {fb.candidate_name ? getInitials(fb.candidate_name) : fb.interviewer?.display_name ? getInitials(fb.interviewer.display_name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">{fb.candidate_name || 'Unknown Candidate'}</h3>
                    <p className="text-xs text-muted-foreground">{fb.job_title || ''}</p>
                    <p className="text-sm text-muted-foreground mt-2">{fb.summary || fb.notes || ''}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < (fb.overall_rating || 0) ? 'text-warning fill-warning' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      {fb.recommendation && (
                        <Badge variant={recColors[fb.recommendation] || 'info'}>
                          {recLabels[fb.recommendation] || fb.recommendation}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">
                    by {fb.interviewer?.display_name || 'Unknown'}
                  </p>
                  {fb.submitted_at && (
                    <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(fb.submitted_at)}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
