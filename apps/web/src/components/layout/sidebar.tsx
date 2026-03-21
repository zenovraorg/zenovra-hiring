import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
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
        className="relative flex h-full flex-col border-r bg-white/50 backdrop-blur-xl z-30"
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 fill-current" />
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
                  <span className="text-lg font-bold tracking-tight leading-none text-primary">HireFlow</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-0.5">Enterprise</span>
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
              "bg-primary/5 text-primary hover:bg-primary hover:text-white group shadow-sm",
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
          className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-md hover:scale-110 transition-transform z-50"
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
              <NavLink
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
                  collapsed && 'justify-center px-0'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10"
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
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </NavLink>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>}
          </Tooltip>
        );
      })}
    </>
  );
}
