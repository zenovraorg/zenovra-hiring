import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, DollarSign, Calendar, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/shared/stat-card';

import { CreateOfferDialog } from '@/features/offers/create-offer-dialog';
import { useOffers } from '@/hooks/use-api';
import { getInitials, formatCurrency, formatDate } from '@/lib/utils';

export function OffersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const { data: offersData, isLoading } = useOffers();
  const offers = offersData?.items || [];

  const pendingCount = offers.filter((o) => o.status === 'pending_approval' || o.status === 'draft').length;
  const acceptedCount = offers.filter((o) => o.status === 'accepted').length;
  const totalCount = offers.length;

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
        title="Offers"
        description="Manage compensation offers and approvals"
        actions={
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => setOfferDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </motion.div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Offers" value={totalCount} icon={DollarSign} delay={0} />
        <StatCard title="Pending" value={pendingCount} icon={Clock} delay={0.05} />
        <StatCard title="Accepted" value={acceptedCount} icon={CheckCircle2} delay={0.1} />
        <StatCard title="Acceptance Rate" value={totalCount > 0 ? `${Math.round((acceptedCount / totalCount) * 100)}%` : '0%'} icon={CheckCircle2} delay={0.15} />
      </div>

      {offers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted/10">
            <DollarSign className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No offers yet</p>
          <Button onClick={() => setOfferDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        </div>
      )}

      {/* Offer List */}
      <div className="space-y-3">
        {offers.map((offer, index) => {
          const candidate = offer.application?.candidate;

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${selectedId === offer.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedId(selectedId === offer.id ? null : offer.id)}>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {candidate ? getInitials(`${candidate.first_name} ${candidate.last_name}`) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {candidate?.first_name} {candidate?.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{offer.title} · {offer.department}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div>
                            <span className="text-xs text-muted-foreground">Base</span>
                            <p className="text-sm font-semibold">{formatCurrency(offer.base_salary)}</p>
                          </div>
                          {offer.bonus && (
                            <div>
                              <span className="text-xs text-muted-foreground">Bonus</span>
                              <p className="text-sm font-semibold">{formatCurrency(offer.bonus)}</p>
                            </div>
                          )}
                          {offer.equity && (
                            <div>
                              <span className="text-xs text-muted-foreground">Equity</span>
                              <p className="text-sm font-semibold">{offer.equity}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs text-muted-foreground">Start Date</span>
                            <p className="text-sm font-semibold">{formatDate(offer.start_date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge type="offer" status={offer.status} />
                      {offer.expires_at && (
                        <span className="text-xs text-muted-foreground">
                          Expires {formatDate(offer.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approvals */}
                  {offer.approvals && offer.approvals.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-xs font-medium text-muted-foreground">Approvals</span>
                      <div className="flex items-center gap-3 mt-2">
                        {offer.approvals.map((approval) => (
                          <div key={approval.approver_id} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-2xs">
                                {approval.approver ? getInitials(approval.approver.display_name) : '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{approval.approver?.display_name}</span>
                            {approval.status === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : approval.status === 'rejected' ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <Clock className="h-4 w-4 text-warning" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <CreateOfferDialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)} />
    </div>
  );
}
