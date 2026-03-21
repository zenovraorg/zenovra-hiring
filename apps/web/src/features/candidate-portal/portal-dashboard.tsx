import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, Clock, Calendar, CheckCircle2, ArrowRight, Briefcase,
  MapPin, Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const demoPortalApplications = [
  {
    id: 'pa1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Zenovra Tech',
    department: 'Engineering',
    location: 'San Francisco, CA',
    appliedDate: '2024-09-15',
    status: 'interviewing' as const,
    currentStage: 'Technical Interview',
    stages: ['Applied', 'Phone Screen', 'Technical Interview', 'Onsite', 'Offer'],
    currentStageIndex: 2,
  },
  {
    id: 'pa2',
    jobTitle: 'Product Manager \u2014 Growth',
    company: 'Zenovra Tech',
    department: 'Product',
    location: 'Remote',
    appliedDate: '2024-09-18',
    status: 'screening' as const,
    currentStage: 'Phone Screen',
    stages: ['Applied', 'Phone Screen', 'Technical Interview', 'Onsite', 'Offer'],
    currentStageIndex: 1,
  },
  {
    id: 'pa3',
    jobTitle: 'Senior Product Designer',
    company: 'Zenovra Tech',
    department: 'Design',
    location: 'Remote',
    appliedDate: '2024-09-10',
    status: 'new' as const,
    currentStage: 'Applied',
    stages: ['Applied', 'Phone Screen', 'Technical Interview', 'Onsite', 'Offer'],
    currentStageIndex: 0,
  },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'muted' }> = {
  new: { label: 'Applied', variant: 'info' },
  screening: { label: 'In Review', variant: 'warning' },
  interviewing: { label: 'Interviewing', variant: 'info' },
  offer: { label: 'Offer', variant: 'success' },
  hired: { label: 'Hired', variant: 'success' },
};

const stats = [
  { label: 'Applications Submitted', value: 3, icon: FileText, color: 'text-primary' },
  { label: 'In Progress', value: 2, icon: Clock, color: 'text-warning' },
  { label: 'Interviews Scheduled', value: 1, icon: Calendar, color: 'text-info' },
];

export function PortalDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Jamie</h1>
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
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
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

        <div className="space-y-4">
          {demoPortalApplications.map((app, index) => {
            const status = statusConfig[app.status] || statusConfig.new;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{app.jobTitle}</h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{app.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{app.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Applied {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stage Progress */}
                    <div className="flex items-center gap-1">
                      {app.stages.map((stage, i) => (
                        <div key={stage} className="flex-1 flex items-center gap-1">
                          <div className="flex-1">
                            <div
                              className={`h-1.5 rounded-full transition-colors ${
                                i <= app.currentStageIndex
                                  ? 'bg-primary'
                                  : 'bg-muted'
                              }`}
                            />
                            <p className={`text-[10px] mt-1 ${
                              i === app.currentStageIndex
                                ? 'text-primary font-medium'
                                : i < app.currentStageIndex
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
      </div>
    </div>
  );
}
