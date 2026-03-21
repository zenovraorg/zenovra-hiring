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
  const { sidebarCollapsed, toggleSidebar, organization } = useAppStore();
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex h-full flex-col border-r bg-sidebar"
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <span className="text-base font-semibold tracking-tight">Zenovra Tech</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-3">
            <SidebarSection items={mainNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
            <div className="py-2">
              <Separator />
            </div>
            <SidebarSection items={secondaryNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
            <div className="py-2">
              <Separator />
            </div>
            <SidebarSection items={adminNav} collapsed={sidebarCollapsed} currentPath={location.pathname} />
          </nav>
        </ScrollArea>

        {/* Careers page link */}
        <div className="border-t px-3 py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/careers"
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors',
                  sidebarCollapsed && 'justify-center'
                )}
              >
                <Globe className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Careers Page</span>}
              </NavLink>
            </TooltipTrigger>
            {sidebarCollapsed && <TooltipContent side="right">Careers Page</TooltipContent>}
          </Tooltip>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
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
                  'group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                  collapsed && 'justify-center'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-md bg-sidebar-accent"
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}
              </NavLink>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
          </Tooltip>
        );
      })}
    </>
  );
}
