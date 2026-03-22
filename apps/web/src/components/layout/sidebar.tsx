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
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        animate={{ width: sidebarCollapsed ? 72 : 252 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex h-full flex-col border-r border-white/[0.06] bg-background/80 backdrop-blur-xl z-30"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/[0.08]">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <span className="text-[15px] font-bold tracking-tight text-white/90 font-display">Zenovra</span>
                <span className="block text-[9px] uppercase tracking-[0.15em] font-semibold text-white/25 mt-px">Hiring Platform</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6 py-3">
            <NavSection label="Main" items={mainNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
            <NavSection label="Operations" items={secondaryNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
            <NavSection label="System" items={adminNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
          </div>
        </ScrollArea>

        {/* Careers link */}
        <div className="p-3 mt-auto">
          <NavLink
            to="/careers"
            className={cn(
              "flex items-center gap-2.5 rounded-xl p-2.5 text-[13px] font-medium transition-all duration-200",
              "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/80 group border border-white/[0.05] hover:border-white/[0.10]",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <Globe className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12" />
            {!sidebarCollapsed && <span>Public Careers</span>}
          </NavLink>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.10] bg-background text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 z-50 shadow-lg"
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

function NavSection({
  label,
  items,
  collapsed,
  currentPath,
}: {
  label: string;
  items: { label: string; icon: React.ComponentType<{ className?: string }>; href: string }[];
  collapsed: boolean;
  currentPath: string;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20">
          {label}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.href}
                  className={cn(
                    'group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'text-white'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-white/[0.07] border border-white/[0.06]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2.5px] rounded-full bg-gradient-to-b from-indigo-400 to-violet-400"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn(
                    "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                    isActive && "text-indigo-400"
                  )} />
                  {!collapsed && (
                    <span className="relative z-10 truncate">{item.label}</span>
                  )}
                </NavLink>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right" className="font-medium text-xs">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}
