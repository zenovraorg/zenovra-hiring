import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { type ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
        </LazyMotion>
      </MotionConfig>
    </QueryClientProvider>
  );
}
