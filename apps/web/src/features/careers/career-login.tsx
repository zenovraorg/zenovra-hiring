import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export function CareerLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/portal';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('jamie.anderson@email.com');
  const [password, setPassword] = useState('demo123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isApplicantLoggedIn', 'true');
    localStorage.setItem('applicantEmail', email);
    navigate(redirect);
  };

  const handleCreateAccount = () => {
    alert('Registration coming soon');
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-indigo-500/[0.08] via-violet-500/[0.04] to-transparent blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/10 mb-3">
            <img src="/symbol.png" alt="Zenovra" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xl font-display font-bold">Zenovra Tech</span>
          <p className="text-sm text-white/35 mt-1">Candidate Portal</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold mb-1 text-center text-white/90">Sign in to apply</h2>
          <p className="text-sm text-white/35 text-center mb-6">
            Access your applications and track your progress
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/60">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-white/60">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 bg-white/[0.025] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/40"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-white text-[#0a0a0f] hover:bg-white/90 font-semibold">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="h-[1px] bg-white/[0.06]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-white/25">
              or
            </span>
          </div>

          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]"
              onClick={handleCreateAccount}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>

            <Link to="/careers" className="block">
              <Button variant="ghost" className="w-full h-10 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.025]">
                Continue as Guest
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Are you a recruiter?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Admin Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
