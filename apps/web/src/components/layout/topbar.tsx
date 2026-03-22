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
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-white/[0.05] bg-background/60 px-5 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2 text-[13px] text-white/35 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.10] hover:text-white/50 w-56 lg:w-80"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium font-mono text-white/25 border border-white/[0.06] sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-lg text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative rounded-lg text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-background" />
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-white/[0.06]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/[0.04] h-auto">
              <Avatar className="h-8 w-8 rounded-lg ring-1 ring-white/[0.08]">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-white/70 text-xs font-semibold">
                  {user ? getInitials(user.display_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-[13px] font-semibold leading-none text-white/85">
                  {user?.display_name || 'Demo User'}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-white/30 capitalize">
                  {membership?.role?.replace('_', ' ') || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-white/25" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm font-semibold">{user?.display_name || 'Demo User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'demo@zenovra.com'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => navigate('/admin')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive" onClick={() => navigate('/careers')}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
