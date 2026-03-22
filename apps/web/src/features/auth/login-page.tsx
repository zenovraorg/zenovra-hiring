import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#060610] relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-[10%] left-[15%] h-[300px] w-[300px] rounded-full bg-indigo-500/[0.08] blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-violet-500/[0.06] blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] h-[200px] w-[200px] rounded-full bg-cyan-500/[0.05] blur-[100px] animate-float" style={{ animationDelay: '4s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/[0.08]">
              <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
            </div>
            <span className="text-xl font-semibold font-display">Zenovra Tech</span>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/60 mb-6 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Enterprise-grade ATS
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4 font-display bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              The modern hiring platform built for scale
            </h1>
            <p className="text-lg text-white/40 leading-relaxed">
              Streamline your recruiting workflow, from sourcing to onboarding. Designed for modern teams that move fast.
            </p>
            <div className="flex flex-wrap gap-2 mt-8">
              {['Pipeline Tracking', 'AI Matching', 'Team Collaboration', 'Analytics'].map((feature) => (
                <span key={feature} className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-white/40">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/20">Zenovra Tech &mdash; Part of Zenovra Org</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.06]">
              <img src="/symbol.png" alt="Zenovra" className="h-4 w-4 object-contain" />
            </div>
            <span className="text-lg font-semibold text-white/90 font-display">Zenovra Tech</span>
          </div>

          <h2 className="text-xl font-semibold font-display mb-1 text-white/90">Welcome back</h2>
          <p className="text-sm text-white/40 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" size="lg">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-white/30">
              or
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full h-11"
            size="lg"
            onClick={handleDemoLogin}
          >
            <img src="/symbol.png" alt="Zenovra" className="mr-2 h-4 w-4 object-contain" />
            Continue with Demo Account
          </Button>

          <p className="text-center text-xs text-white/30 mt-6">
            Looking for jobs?{' '}
            <a href="/careers" className="text-indigo-400 hover:underline font-medium">View open positions</a>
          </p>
          <p className="text-center text-xs text-white/30 mt-2">
            Applicant?{' '}
            <a href="/careers/login" className="text-indigo-400 hover:underline font-medium">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
