import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Briefcase, Calendar, FileText, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { demoNotifications } from '@/lib/demo-data';
import { formatRelativeTime, cn } from '@/lib/utils';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  application: Briefcase,
  interview: Calendar,
  offer: FileText,
  feedback: MessageSquare,
};

export function NotificationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[800px] mx-auto">
      <PageHeader
        title="Notifications"
        description={`${demoNotifications.filter((n) => !n.is_read).length} unread`}
        actions={
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <div className="space-y-2">
        {demoNotifications.map((notification, index) => {
          const Icon = typeIcons[notification.type] || Bell;
          return (
            <motion.div key={notification.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
              <Card
                className={cn(
                  'p-4 cursor-pointer hover:shadow-sm transition-all',
                  !notification.is_read && 'border-l-2 border-l-primary bg-primary/[0.02]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'rounded-lg p-2 shrink-0',
                    !notification.is_read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn('text-sm', !notification.is_read && 'font-medium')}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {formatRelativeTime(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
