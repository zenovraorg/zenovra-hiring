import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Shield, Settings, FileText, Bell, Palette,
  Building2, MapPin, ChevronRight, Search,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { demoUsers, demoDepartments, demoLocations } from '@/lib/demo-data';
import { getInitials } from '@/lib/utils';

const adminSections = [
  { label: 'Users & Members', icon: Users, description: 'Manage team members and invitations', count: 5 },
  { label: 'Roles & Permissions', icon: Shield, description: 'Configure access control and roles', count: 7 },
  { label: 'Departments', icon: Building2, description: 'Manage organizational departments', count: 6 },
  { label: 'Locations', icon: MapPin, description: 'Office locations and remote settings', count: 4 },
  { label: 'Templates', icon: FileText, description: 'Email, scorecard, and pipeline templates' },
  { label: 'Notifications', icon: Bell, description: 'Configure notification preferences' },
  { label: 'Branding', icon: Palette, description: 'Customize your careers page appearance' },
  { label: 'General Settings', icon: Settings, description: 'Organization-wide settings' },
];

const roleLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'info' }> = {
  org_admin: { label: 'Admin', variant: 'default' },
  recruiter: { label: 'Recruiter', variant: 'info' },
  hiring_manager: { label: 'Hiring Manager', variant: 'secondary' },
  interviewer: { label: 'Interviewer', variant: 'secondary' },
  executive_viewer: { label: 'Executive', variant: 'secondary' },
};

export function AdminPage() {
  const [activeSection, setActiveSection] = useState('Users & Members');

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="Admin" description="Manage your organization settings" />

      <div className="flex gap-6 mt-6">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 space-y-1">
          {adminSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.label;
            return (
              <button
                key={section.label}
                onClick={() => setActiveSection(section.label)}
                className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{section.label}</span>
                {section.count && (
                  <span className="ml-auto text-xs text-muted-foreground">{section.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'Users & Members' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Team Members</h2>
                <Button size="sm">Invite Member</Button>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search members..." className="pl-9" />
              </div>
              <div className="border rounded-lg divide-y">
                {demoUsers.map((user) => {
                  const role = ['org_admin', 'recruiter', 'hiring_manager', 'interviewer', 'executive_viewer'][
                    Math.floor(Math.random() * 5)
                  ];
                  const roleConfig = roleLabels[role] || { label: role, variant: 'secondary' as const };
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.display_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeSection === 'Departments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Departments</h2>
                <Button size="sm">Add Department</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoDepartments.map((dept) => (
                  <Card key={dept.id} className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 5) + 1} open roles
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection !== 'Users & Members' && activeSection !== 'Departments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="rounded-full bg-muted p-4 mb-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{activeSection}</h3>
              <p className="text-sm text-muted-foreground">This section is ready for configuration.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
