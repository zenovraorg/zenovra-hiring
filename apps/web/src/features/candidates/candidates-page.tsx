import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Mail,
  MapPin,
  Building2,
  MoreHorizontal,
  Users,
  Download,
  ChevronRight,
  Star,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

import { AddCandidateDialog } from '@/features/candidates/add-candidate-dialog';
import { useCandidates } from '@/hooks/use-api';
import { getInitials, formatRelativeTime } from '@/lib/utils';

export function CandidatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data, isLoading } = useCandidates({ search: search || undefined });
  const candidates = data?.items || [];

  const filtered = candidates.filter((c) => {
    if (!search || data?.items) return true;
    const q = search.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.headline?.toLowerCase().includes(q) ||
      (c.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-white/90">Candidate Pool</h1>
          <p className="text-muted-foreground">Manage your talent pipeline and track candidate progress across roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl bg-white/[0.025] text-white/70 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all">
            <Download className="mr-2 h-4 w-4" />
            Export Pool
          </Button>
          <Button onClick={() => setAddDialogOpen(true)} className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.04, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-2xl border-white/[0.06] focus-visible:ring-white/20 bg-white/[0.025]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-11 bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10]">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <span className="text-white font-bold">{filtered.length}</span>
            <span>Candidates</span>
          </div>
        </div>
      </motion.div>

      {/* Candidate List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Current Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Source</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Skills</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Added</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Rating</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <AnimatePresence mode="popLayout">
                {filtered.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.25, 0.1, 0.25, 1] }}
                    className="group hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl shadow-sm ring-2 ring-white/[0.06] group-hover:ring-white/[0.12] transition-all duration-200">
                          <AvatarImage src={`https://picsum.photos/seed/${candidate.id}/40/40`} />
                          <AvatarFallback className="rounded-xl bg-white/[0.08] text-white/70 font-bold">
                            {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                            {candidate.first_name} {candidate.last_name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/70 truncate">{candidate.current_title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{candidate.current_company}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="rounded-full bg-white/[0.06] text-white/40 font-bold uppercase tracking-widest text-[9px] px-2 border-white/[0.08]">
                        {(candidate.source || 'unknown').replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(candidate.skills || []).slice(0, 2).map((skill) => (
                          <Badge key={skill} className="rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                            {skill}
                          </Badge>
                        ))}
                        {(candidate.skills || []).length > 2 && (
                          <span className="text-[10px] font-bold text-white/30">
                            +{(candidate.skills || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatRelativeTime(candidate.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={cn(
                              "h-3 w-3", 
                              star <= Math.floor(Math.random() * 2) + 3 ? "fill-amber-400 text-amber-400" : "text-white/10"
                            )} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white/[0.08] hover:text-white"
                          onClick={(e) => { e.stopPropagation(); window.open(`mailto:${candidate.email}`); }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-muted/20">
                            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => navigate(`/candidates/${candidate.id}`)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => {}}>
                              <Briefcase className="mr-2 h-4 w-4" />
                              Add to Job
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => {}}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06]">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold font-display">No candidates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
          <Button onClick={() => setAddDialogOpen(true)} className="mt-6 rounded-xl">
            Add New Candidate
          </Button>
        </div>
      )}

      <AddCandidateDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
