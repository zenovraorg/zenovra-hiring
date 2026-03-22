import { motion } from 'motion/react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="relative overflow-hidden p-5 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300 group">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-indigo-400/60 via-indigo-400/20 to-transparent rounded-full" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/50 font-medium">{title}</p>
            <motion.p
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
            >
              {value}
            </motion.p>
          </div>
          <div className={cn('rounded-xl p-2.5 bg-white/[0.06] group-hover:bg-white/[0.08] transition-colors duration-200 text-indigo-400')}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={cn(change >= 0 ? 'text-emerald-400' : 'text-red-400', 'font-medium')}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
