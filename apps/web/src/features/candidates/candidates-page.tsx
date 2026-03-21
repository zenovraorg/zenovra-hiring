import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Mail,
  MapPin,
  Building2,
  MoreHorizontal,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddCandidateDialog } from '@/features/candidates/add-candidate-dialog';
import { demoCandidates } from '@/lib/demo-data';
import { getInitials, formatRelativeTime } from '@/lib/utils';

export function CandidatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filtered = demoCandidates.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.headline?.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Candidates"
        description={`${demoCandidates.length} candidates in your talent pool`}
        actions={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filters
        </Button>
      </div>

      {/* Candidate List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="Add candidates to start building your talent pipeline."
          actionLabel="Add Candidate"
          onAction={() => {}}
        />
      ) : (
        <div className="border rounded-lg divide-y">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_200px_150px_120px_120px_40px] gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-t-lg">
            <span>Candidate</span>
            <span>Current Role</span>
            <span>Source</span>
            <span>Skills</span>
            <span>Added</span>
            <span />
          </div>

          {filtered.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="grid grid-cols-[1fr_200px_150px_120px_120px_40px] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/candidates/${candidate.id}`)}
            >
              {/* Name & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                </div>
              </div>

              {/* Current Role */}
              <div className="min-w-0">
                <p className="text-sm truncate">{candidate.current_title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{candidate.current_company}</span>
                </div>
              </div>

              {/* Source */}
              <div>
                <Badge variant="secondary" className="text-2xs capitalize">
                  {candidate.source.replace('_', ' ')}
                </Badge>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="muted" className="text-2xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 2 && (
                  <span className="text-2xs text-muted-foreground">
                    +{candidate.skills.length - 2}
                  </span>
                )}
              </div>

              {/* Added */}
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(candidate.created_at)}
              </span>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/candidates/${candidate.id}`)}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.alert('Select a job to add this candidate to')}>Add to Job</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(`mailto:${candidate.email}`)}>Send Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.alert('Note feature coming soon')}>Add Note</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>
      )}
      <AddCandidateDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </div>
  );
}
