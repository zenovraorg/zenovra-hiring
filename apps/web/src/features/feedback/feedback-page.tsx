import { motion } from 'motion/react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { getInitials } from '@/lib/utils';

const demoFeedback = [
  { id: '1', interviewer: 'Priya Patel', candidate: 'Chen Wei', job: 'Product Manager — Growth', rating: 4, recommendation: 'strong_yes', summary: 'Excellent product sense and strong analytical thinking. Clear frameworks for prioritization.', submitted: '2h ago' },
  { id: '2', interviewer: 'Marcus Johnson', candidate: 'Alex Rivera', job: 'Senior Frontend Engineer', rating: 3, recommendation: 'yes', summary: 'Solid React fundamentals, good system design instincts. Could improve on testing approaches.', submitted: '1d ago' },
  { id: '3', interviewer: 'James Wilson', candidate: 'Jordan Kim', job: 'Staff Backend Engineer', rating: 5, recommendation: 'strong_yes', summary: 'Outstanding distributed systems knowledge. Great communicator. Would be a strong culture add.', submitted: '2d ago' },
];

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
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Feedback & Scorecards"
        description="Review interview feedback and evaluations"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Feedback" value={28} icon={MessageSquare} delay={0} />
        <StatCard title="Avg Rating" value="3.8" icon={Star} delay={0.05} />
        <StatCard title="Strong Yes" value={12} change={15} changeLabel="vs last month" icon={ThumbsUp} delay={0.1} />
        <StatCard title="Pending Reviews" value={4} icon={MessageSquare} delay={0.15} />
      </div>

      <div className="space-y-3">
        {demoFeedback.map((fb, index) => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card className="p-5 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(fb.candidate)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">{fb.candidate}</h3>
                    <p className="text-xs text-muted-foreground">{fb.job}</p>
                    <p className="text-sm text-muted-foreground mt-2">{fb.summary}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < fb.rating ? 'text-warning fill-warning' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <Badge variant={recColors[fb.recommendation]}>
                        {recLabels[fb.recommendation]}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">by {fb.interviewer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{fb.submitted}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
