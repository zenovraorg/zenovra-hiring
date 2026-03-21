import { motion } from 'motion/react';
import { ClipboardCheck, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { getInitials } from '@/lib/utils';

const demoAssessments = [
  { id: '1', candidate: 'Alex Rivera', job: 'Senior Frontend Engineer', type: 'Take-home', status: 'completed', score: 92, due: '2024-09-20' },
  { id: '2', candidate: 'Aisha Okafor', job: 'Senior Frontend Engineer', type: 'Coding Challenge', status: 'in_progress', score: null, due: '2024-09-25' },
  { id: '3', candidate: 'Chen Wei', job: 'Product Manager — Growth', type: 'Case Study', status: 'completed', score: 88, due: '2024-09-18' },
  { id: '4', candidate: 'Maya Thompson', job: 'Senior Product Designer', type: 'Design Challenge', status: 'pending', score: null, due: '2024-09-28' },
];

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; variant: 'success' | 'warning' | 'info' | 'muted' }> = {
  completed: { icon: CheckCircle2, variant: 'success' },
  in_progress: { icon: Clock, variant: 'warning' },
  pending: { icon: AlertCircle, variant: 'info' },
  expired: { icon: AlertCircle, variant: 'muted' },
};

export function AssessmentsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Assessments"
        description="Track candidate assessments and challenges"
        actions={
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </motion.div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Assessments" value={18} icon={ClipboardCheck} delay={0} />
        <StatCard title="In Progress" value={4} icon={Clock} delay={0.05} />
        <StatCard title="Completed" value={12} icon={CheckCircle2} delay={0.1} />
        <StatCard title="Avg Score" value="85%" change={5} changeLabel="vs last month" icon={ClipboardCheck} delay={0.15} />
      </div>

      <div>
        <div className="border rounded-lg">
          <div className="grid grid-cols-[1fr_180px_140px_100px_100px_80px] gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-t-lg">
            <span>Candidate</span>
            <span>Job</span>
            <span>Type</span>
            <span>Status</span>
            <span>Score</span>
            <span>Due</span>
          </div>
          {demoAssessments.map((assessment, index) => {
            const config = statusConfig[assessment.status] || statusConfig.pending;
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.03)', x: 2 }}
                className="grid grid-cols-[1fr_180px_140px_100px_100px_80px] gap-4 px-4 py-3 items-center border-t hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getInitials(assessment.candidate)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{assessment.candidate}</span>
                </div>
                <span className="text-sm text-muted-foreground truncate">{assessment.job}</span>
                <Badge variant="secondary" className="text-2xs w-fit">{assessment.type}</Badge>
                <Badge variant={config.variant} className="text-2xs w-fit capitalize">
                  {assessment.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm font-medium">
                  {assessment.score !== null ? `${assessment.score}%` : '—'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(assessment.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
