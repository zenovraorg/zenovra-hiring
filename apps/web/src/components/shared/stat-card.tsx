import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
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
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';
  delay?: number;
}

const accentGradients: Record<string, string> = {
  indigo: 'from-indigo-400/60 via-indigo-400/20 to-transparent',
  cyan: 'from-cyan-400/60 via-cyan-400/20 to-transparent',
  emerald: 'from-emerald-400/60 via-emerald-400/20 to-transparent',
  violet: 'from-violet-400/60 via-violet-400/20 to-transparent',
  amber: 'from-amber-400/60 via-amber-400/20 to-transparent',
  rose: 'from-rose-400/60 via-rose-400/20 to-transparent',
};

const accentIconBg: Record<string, string> = {
  indigo: 'text-indigo-400',
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  violet: 'text-violet-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
};

// Animated number hook
function useAnimatedValue(target: string | number, inView: boolean, delay: number) {
  const [display, setDisplay] = useState<string>('');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const targetStr = String(target);
    const numericMatch = targetStr.match(/^([\d,.]+)/);

    if (!numericMatch) {
      setDisplay(targetStr);
      return;
    }

    const numStr = numericMatch[1].replace(/,/g, '');
    const numTarget = parseFloat(numStr);
    const suffix = targetStr.slice(numericMatch[0].length);
    const hasCommas = numericMatch[1].includes(',');
    const duration = 1200;
    const startTime = performance.now() + delay * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numTarget * eased);
      const formatted = hasCommas ? current.toLocaleString() : String(current);
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, delay]);

  return display || String(target);
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  accentColor = 'indigo',
  delay = 0,
}: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animatedValue = useAnimatedValue(value, inView, delay);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="relative overflow-hidden p-5 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300 group">
        <div className={cn('absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b rounded-full', accentGradients[accentColor])} />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/50 font-medium">{title}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{animatedValue}</p>
          </div>
          <div className={cn('rounded-xl p-2.5 bg-white/[0.06] group-hover:bg-white/[0.08] transition-colors duration-200', accentIconBg[accentColor])}>
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
