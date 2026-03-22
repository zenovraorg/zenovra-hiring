import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Kanban,
  Calendar,
  MessageSquare,
  ClipboardCheck,
  FileText,
  BarChart3,
  Bell,
  UserPlus,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Jobs', icon: Briefcase, href: '/jobs' },
  { label: 'Candidates', icon: Users, href: '/candidates' },
  { label: 'Pipeline', icon: Kanban, href: '/pipeline' },
  { label: 'Interviews', icon: Calendar, href: '/interviews' },
  { label: 'Feedback', icon: MessageSquare, href: '/feedback' },
  { label: 'Assessments', icon: ClipboardCheck, href: '/assessments' },
  { label: 'Offers', icon: FileText, href: '/offers' },
];

const secondaryNav = [
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Referrals', icon: UserPlus, href: '/referrals' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
];

const adminNav = [
  { label: 'Admin', icon: Shield, href: '/admin' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex h-full flex-col border-r border-border/40 bg-gradient-to-b from-white/80 via-white/60 to-white/80 backdrop-blur-2xl z-30 shadow-[1px_0_30px_-10px_rgba(0,0,0,0.06)]"
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/10">
            <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight leading-none text-primary">Zenovra Tech</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-0.5">Part of Zenovra Org</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-4">
            <div>
              {!sidebarCollapsed && (
                <h4 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Main Menu
                </h4>
              )}
              <nav className="space-y-1">
                <SidebarSection items={mainNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
              </nav>
            </div>

            <div>
              {!sidebarCollapsed && (
                <h4 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Operations
                </h4>
              )}
              <nav className="space-y-1">
                <SidebarSection items={secondaryNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
              </nav>
            </div>

            <div>
              {!sidebarCollapsed && (
                <h4 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  System
                </h4>
              )}
              <nav className="space-y-1">
                <SidebarSection items={adminNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Footer / Careers */}
        <div className="p-4 mt-auto">
          <NavLink
            to="/careers"
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-200",
              "bg-gradient-to-r from-primary/[0.06] to-primary/[0.03] text-primary hover:from-primary hover:to-primary/90 hover:text-white group shadow-sm border border-primary/10 hover:border-transparent hover:shadow-lg hover:shadow-primary/20",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <Globe className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-12" />
            {!sidebarCollapsed && <span>Public Careers</span>}
          </NavLink>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-border/50 bg-white shadow-lg shadow-black/5 hover:scale-110 hover:shadow-xl hover:shadow-black/10 transition-all duration-200 z-50"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}

function SidebarSection({
  items,
  collapsed,
  currentPath,
}: {
  items: { label: string; icon: React.ComponentType<{ className?: string }>; href: string }[];
  collapsed: boolean;
  currentPath: string;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={!isActive ? { x: 2 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
              <NavLink
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-primary/[0.04] hover:text-primary',
                  collapsed && 'justify-center px-0'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/[0.08] via-primary/[0.12] to-primary/[0.06] shadow-[inset_0_0_0_1px_rgba(var(--color-primary),0.08)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/60"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn(
                  "relative z-10 h-5 w-5 shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {!collapsed && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="sidebar-active-dot"
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(var(--color-primary),0.3)]"
                  />
                )}
              </NavLink>
              </motion.div>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>}
          </Tooltip>
        );
      })}
    </>
  );
}
