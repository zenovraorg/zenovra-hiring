import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, Check, CheckCheck, Briefcase, Calendar, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useNotifications, useMarkAllRead, useMarkNotificationRead } from '@/hooks/use-api';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { Notification } from '@/types';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  application: Briefcase,
  interview: Calendar,
  offer: FileText,
  feedback: MessageSquare,
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useNotifications();
  const markAllRead = useMarkAllRead();
  const markOneRead = useMarkNotificationRead();

  const notifications = notificationsData?.items || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markOneRead.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[800px] mx-auto">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread`}
        actions={
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={markAllRead.isPending}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted/10">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No notifications yet</p>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notification, index) => {
          const Icon = typeIcons[notification.type] || Bell;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                className={cn(
                  'p-4 cursor-pointer bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] transition-all',
                  !notification.is_read && 'border-l-2 border-l-indigo-400 bg-indigo-400/[0.04]'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'rounded-lg p-2 shrink-0',
                    !notification.is_read ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/[0.06] text-white/40'
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
