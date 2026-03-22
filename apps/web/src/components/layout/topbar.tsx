import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';

export function Topbar() {
  const navigate = useNavigate();
  const { user, membership, unreadCount, setCommandPaletteOpen, theme, setTheme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-border/40 bg-white/70 px-6 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group flex items-center gap-3 rounded-xl border border-border/50 bg-gradient-to-r from-white/80 to-white/50 px-4 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-white hover:shadow-md hover:shadow-black/[0.03] hover:border-primary/20 focus:ring-2 focus:ring-primary/10 w-64 lg:w-96"
        >
          <Search className="h-4 w-4 transition-colors group-hover:text-primary" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-bold font-mono text-muted-foreground/70 border border-border/50 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 hover:shadow-sm"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="h-8 mx-2" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 rounded-xl px-2 hover:bg-primary/[0.04] transition-all duration-200">
              <Avatar className="h-10 w-10 rounded-xl shadow-sm ring-2 ring-primary/[0.06]">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                  {user ? getInitials(user.display_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-bold leading-none text-primary">
                  {user?.display_name || 'Demo User'}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {membership?.role?.replace('_', ' ') || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-xl border-muted/20">
            <DropdownMenuLabel className="px-2 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.display_name || 'Demo User'}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {user?.email || 'demo@zenovra.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="rounded-lg cursor-pointer py-2" onClick={() => navigate('/admin')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer py-2" onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Organization Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-lg cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/5" onClick={() => navigate('/careers')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
