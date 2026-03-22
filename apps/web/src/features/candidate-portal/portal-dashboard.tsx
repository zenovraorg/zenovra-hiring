import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  FileText, Clock, Calendar, ArrowRight, Building2, MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'muted' }> = {
  active: { label: 'Active', variant: 'info' },
  screening: { label: 'In Review', variant: 'warning' },
  interviewing: { label: 'Interviewing', variant: 'info' },
  offer: { label: 'Offer', variant: 'success' },
  hired: { label: 'Hired', variant: 'success' },
  rejected: { label: 'Closed', variant: 'muted' },
};

export function PortalDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || '/api/v1';
        // Use email from localStorage or default demo email
        const email = localStorage.getItem('applicantEmail') || 'jamie.anderson@email.com';
        const res = await fetch(`${apiBase}/apply/my-applications?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data.items || []);
        }
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const inProgress = applications.filter(a => a.status === 'active' && (a.current_stage_index || 0) > 0).length;
  const stats = [
    { label: 'Applications Submitted', value: applications.length, icon: FileText, color: 'text-indigo-400' },
    { label: 'In Progress', value: inProgress || applications.length, icon: Clock, color: 'text-amber-400' },
    { label: 'Interviews Scheduled', value: applications.filter(a => (a.current_stage_index || 0) >= 2).length, icon: Calendar, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">Track your applications and upcoming interviews.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '—' : stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Applications</h2>
          <Link to="/careers">
            <Button variant="outline" size="sm">
              Browse Jobs
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}><CardContent className="p-6 animate-pulse"><div className="h-16 bg-white/[0.04] rounded-lg" /></CardContent></Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No applications yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse our open positions and apply to get started.</p>
              <Link to="/careers">
                <Button>Browse Jobs <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => {
              const status = statusConfig[app.status] || statusConfig.active;
              const stages = app.stages || ['Applied', 'Phone Screen', 'Technical Interview', 'Onsite', 'Offer'];
              const currentStageIndex = app.current_stage_index || 0;

              return (
                <motion.div
                  key={app._id || app.id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <Card className="hover:border-white/[0.12] transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{app.job_title}</h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {app.department && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{app.department}</span>
                              </div>
                            )}
                            {(app.location || app.is_remote) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{app.is_remote ? 'Remote' : app.location}</span>
                              </div>
                            )}
                            {app.created_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stage Progress */}
                      <div className="flex items-center gap-1">
                        {stages.map((stage: string, i: number) => (
                          <div key={stage} className="flex-1 flex items-center gap-1">
                            <div className="flex-1">
                              <div
                                className={`h-1.5 rounded-full transition-colors ${
                                  i <= currentStageIndex ? 'bg-indigo-400' : 'bg-white/[0.06]'
                                }`}
                              />
                              <p className={`text-[10px] mt-1 ${
                                i === currentStageIndex
                                  ? 'text-indigo-400 font-medium'
                                  : i < currentStageIndex
                                    ? 'text-muted-foreground'
                                    : 'text-muted-foreground/50'
                              }`}>
                                {stage}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
