import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Linkedin, Globe, X, Plus, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const initialSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'GraphQL'];

export function PortalProfile() {
  const [saved, setSaved] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    fullName: 'Jamie Anderson',
    email: 'jamie.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/jamieanderson',
    portfolio: 'https://jamieanderson.dev',
    bio: 'Full-stack engineer with 6+ years of experience building performant web applications. Passionate about design systems, developer experience, and creating intuitive user interfaces. Previously at startups and mid-stage companies in the fintech and developer tools space.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Keep your profile up to date to stand out to recruiters.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <form onSubmit={handleSave}>
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Presence */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Online Presence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pl-2.5 pr-1.5 py-1 gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add a skill..."
                  className="max-w-xs"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                placeholder="Tell us about yourself..."
              />
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button type="submit" size="lg">
              {saved ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Changes Saved
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-success"
              >
                Profile updated successfully
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
