import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from '@/components/shared/command-palette';
import { motion, AnimatePresence } from 'motion/react';

export function AppShell() {
  const location = useLocation();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background selection:bg-accent-indigo/20 selection:text-white">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] h-[50%] w-[45%] rounded-full bg-indigo-500/[0.03] blur-[160px]" />
        <div className="absolute top-[30%] -right-[15%] h-[35%] w-[35%] rounded-full bg-violet-500/[0.025] blur-[140px]" />
        <div className="absolute -bottom-[15%] left-[30%] h-[40%] w-[35%] rounded-full bg-cyan-500/[0.02] blur-[160px]" />
      </div>

      <Sidebar />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
          <div className="mx-auto h-full w-full max-w-[1600px] p-5 lg:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
