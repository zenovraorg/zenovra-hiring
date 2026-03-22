import { create } from 'zustand';
import type { User, Organization, Membership, Notification } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  membership: Membership | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationTrayOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Actions
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setMembership: (membership: Membership | null) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationTrayOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'admin-uid',
    email: 'narasimharao@zenovra.org',
    display_name: 'Narasimha Rao',
    firebase_uid: 'admin-uid',
    avatar_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  membership: {
    id: 'm1',
    org_id: 'org1',
    user_id: 'admin-uid',
    role: 'super_admin' as any,
    is_active: true,
    joined_at: new Date().toISOString(),
  },
  organization: {
    id: 'org1',
    name: 'Zenovra Tech',
    slug: 'zenovra-tech',
    domain: 'zenovra.org',
    logo_url: '/symbol.png',
    settings: {} as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isAuthenticated: true,
  isLoading: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationTrayOpen: false,
  theme: 'light',
  notifications: [],
  unreadCount: 0,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganization: (organization) => set({ organization }),
  setMembership: (membership) => set({ membership }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setNotificationTrayOpen: (notificationTrayOpen) => set({ notificationTrayOpen }),
  setTheme: (theme) => set({ theme }),
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.is_read).length }),
  markNotificationRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),
  logout: () =>
    set({
      user: null,
      membership: null,
      organization: null,
      isAuthenticated: false,
      notifications: [],
      unreadCount: 0,
    }),
}));
