import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from '@/components/shared/command-palette';
import { motion } from 'motion/react';

export function AppShell() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background selection:bg-primary/10 selection:text-primary">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/[0.04] blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[30%] w-[30%] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-sky-500/[0.04] blur-[120px]" />
      </div>

      <Sidebar />
      
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none">
          <div className="mx-auto h-full w-full max-w-[1600px] p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
