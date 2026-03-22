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
import { demoCandidates } from '@/lib/demo-data';
import { getInitials, formatRelativeTime } from '@/lib/utils';

export function CandidatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data, isLoading } = useCandidates({ search: search || undefined });
  const candidates = data?.items || demoCandidates;

  const filtered = candidates.filter((c) => {
    if (!search || data?.items) return true;
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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Candidate Pool</h1>
          <p className="text-muted-foreground">Manage your talent pipeline and track candidate progress across roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="rounded-xl shadow-sm bg-white/50 backdrop-blur-sm">
              <Download className="mr-2 h-4 w-4" />
              Export Pool
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => setAddDialogOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20 bg-white/50 backdrop-blur-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 bg-white/50 backdrop-blur-sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <span className="text-primary font-bold">{filtered.length}</span>
            <span>Candidates</span>
          </div>
        </div>
      </motion.div>

      {/* Candidate List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="premium-card overflow-hidden bg-white/70 backdrop-blur-sm border-border/40"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-gradient-to-r from-muted/30 to-muted/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Current Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Source</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Skills</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Added</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Rating</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <AnimatePresence mode="popLayout">
                {filtered.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group hover:bg-gradient-to-r hover:from-primary/[0.03] hover:to-transparent transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl shadow-sm ring-2 ring-primary/[0.06] group-hover:ring-primary/[0.12] transition-all duration-200">
                          <AvatarImage src={`https://picsum.photos/seed/${candidate.id}/40/40`} />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                            {getInitials(`${candidate.first_name} ${candidate.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-primary group-hover:text-primary transition-colors">
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
                        <p className="text-sm font-medium text-primary/80 truncate">{candidate.current_title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{candidate.current_company}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="rounded-full bg-muted/50 text-muted-foreground font-bold uppercase tracking-widest text-[9px] px-2">
                        {candidate.source.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} className="rounded-lg bg-primary/5 text-primary text-[10px] font-bold border-none">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="text-[10px] font-bold text-muted-foreground/60">
                            +{candidate.skills.length - 2}
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
                              star <= Math.floor(Math.random() * 2) + 3 ? "fill-warning text-warning" : "text-muted/30"
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
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
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
        <div className="py-20 text-center premium-card bg-white/50 border-border/40">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 shadow-inner">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No candidates found</h3>
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
