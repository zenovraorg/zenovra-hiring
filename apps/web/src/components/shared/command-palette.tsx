import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Kanban,
  Calendar,
  BarChart3,
  Settings,
  Search,
  FileText,
  UserPlus,
  Shield,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const pages = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', group: 'Navigate' },
  { name: 'Jobs', icon: Briefcase, path: '/jobs', group: 'Navigate' },
  { name: 'Create Job', icon: Briefcase, path: '/jobs/new', group: 'Actions' },
  { name: 'Candidates', icon: Users, path: '/candidates', group: 'Navigate' },
  { name: 'Pipeline Board', icon: Kanban, path: '/pipeline', group: 'Navigate' },
  { name: 'Interviews', icon: Calendar, path: '/interviews', group: 'Navigate' },
  { name: 'Offers', icon: FileText, path: '/offers', group: 'Navigate' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics', group: 'Navigate' },
  { name: 'Referrals', icon: UserPlus, path: '/referrals', group: 'Navigate' },
  { name: 'Admin Panel', icon: Shield, path: '/admin', group: 'Navigate' },
  { name: 'Settings', icon: Settings, path: '/admin/settings', group: 'Navigate' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof pages>();
    pages.forEach((page) => {
      const group = map.get(page.group) || [];
      group.push(page);
      map.set(page.group, group);
    });
    return map;
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command className="rounded-xl border bg-popover shadow-2xl">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search pages, candidates, jobs..."
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                {Array.from(groups.entries()).map(([group, items]) => (
                  <Command.Group key={group} heading={group} className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.path}
                          value={item.name}
                          onSelect={() => handleSelect(item.path)}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent transition-colors"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {item.name}
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
