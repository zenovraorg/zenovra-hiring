import { motion } from 'framer-motion';
import { UserPlus, Gift, TrendingUp, CheckCircle2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { getInitials } from '@/lib/utils';

const demoReferrals = [
  { id: '1', referrer: 'Marcus Johnson', candidate: 'Jordan Kim', job: 'Staff Backend Engineer', status: 'reviewing', date: '2024-09-05' },
  { id: '2', referrer: 'Priya Patel', candidate: 'Kai Zhang', job: 'Product Manager — Growth', status: 'accepted', date: '2024-09-12' },
  { id: '3', referrer: 'James Wilson', candidate: 'Emma Davis', job: 'Senior Frontend Engineer', status: 'submitted', date: '2024-09-15' },
];

const statusColors: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
  submitted: 'info',
  reviewing: 'warning',
  accepted: 'success',
  rejected: 'secondary',
  hired: 'success',
};

export function ReferralsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Referrals"
        description="Track employee referrals and rewards"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Referral
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Referrals" value={14} change={25} changeLabel="vs last month" icon={UserPlus} delay={0} />
        <StatCard title="In Review" value={5} icon={TrendingUp} delay={0.05} />
        <StatCard title="Hired from Referrals" value={3} icon={CheckCircle2} delay={0.1} />
        <StatCard title="Conversion Rate" value="21%" change={8} changeLabel="vs last quarter" icon={Gift} delay={0.15} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoReferrals.map((ref, index) => (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">{getInitials(ref.candidate)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{ref.candidate}</p>
                    <p className="text-xs text-muted-foreground">
                      Referred by {ref.referrer} · {ref.job}
                    </p>
                  </div>
                </div>
                <Badge variant={statusColors[ref.status] || 'secondary'} className="capitalize">
                  {ref.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
