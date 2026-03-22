import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const accentStyles: Record<string, { icon: string; bg: string }> = {
  indigo: { icon: 'text-indigo-400', bg: 'from-indigo-500/15 to-indigo-500/5' },
  cyan: { icon: 'text-cyan-400', bg: 'from-cyan-500/15 to-cyan-500/5' },
  emerald: { icon: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-500/5' },
  violet: { icon: 'text-violet-400', bg: 'from-violet-500/15 to-violet-500/5' },
  amber: { icon: 'text-amber-400', bg: 'from-amber-500/15 to-amber-500/5' },
  rose: { icon: 'text-rose-400', bg: 'from-rose-500/15 to-rose-500/5' },
};

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
    const duration = 1000;
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
  accentColor = 'indigo',
  delay = 0,
}: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animatedValue = useAnimatedValue(value, inView, delay);
  const style = accentStyles[accentColor];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-[13px] text-white/40 font-medium">{title}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums font-display">{animatedValue}</p>
          </div>
          <div className={cn('rounded-xl p-2 bg-gradient-to-br', style.bg, style.icon)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={cn(change >= 0 ? 'text-emerald-400' : 'text-red-400', 'font-medium')}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="text-white/30">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
