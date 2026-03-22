import { motion } from 'motion/react';
import { UserPlus, Gift, TrendingUp, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { useReferrals } from '@/hooks/use-api';
import { getInitials, formatDate } from '@/lib/utils';

const statusColors: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
  submitted: 'info',
  reviewing: 'warning',
  accepted: 'success',
  rejected: 'secondary',
  hired: 'success',
};

export function ReferralsPage() {
  const { data: referralsData, isLoading } = useReferrals();
  const referrals = referralsData?.items || [];

  const reviewingCount = referrals.filter((r) => r.status === 'reviewing').length;
  const hiredCount = referrals.filter((r) => r.status === 'hired').length;
  const totalCount = referrals.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Referrals"
        description="Track employee referrals and rewards"
        actions={
          <div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Referral
            </Button>
          </div>        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Referrals" value={totalCount} icon={UserPlus} delay={0} />
        <StatCard title="In Review" value={reviewingCount} icon={TrendingUp} delay={0.05} />
        <StatCard title="Hired from Referrals" value={hiredCount} icon={CheckCircle2} delay={0.1} />
        <StatCard title="Conversion Rate" value={totalCount > 0 ? `${Math.round((hiredCount / totalCount) * 100)}%` : '0%'} icon={Gift} delay={0.15} />
      </div>

      {referrals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted/10">
            <UserPlus className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No referrals yet</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Referral
          </Button>
        </div>
      )}

      {referrals.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((ref, index) => {
                const candidateName = ref.candidate
                  ? `${ref.candidate.first_name || ''} ${ref.candidate.last_name || ''}`.trim() || 'Unknown Candidate'
                  : 'Unknown Candidate';
                const referrerName = ref.referrer?.display_name || 'Unknown';
                const jobTitle = ref.job?.title || '';

                return (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.25, 0.1, 0.25, 1] }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.02)' }}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">{getInitials(candidateName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{candidateName}</p>
                        <p className="text-xs text-muted-foreground">
                          Referred by {referrerName}{jobTitle ? ` · ${jobTitle}` : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusColors[ref.status] || 'secondary'} className="capitalize">
                      {ref.status}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
