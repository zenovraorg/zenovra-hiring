import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0e1a] relative overflow-hidden">
        {/* Animated orbs */}
        <motion.div
          className="absolute top-[10%] left-[15%] h-[300px] w-[300px] rounded-full bg-blue-500/[0.15] blur-[100px]"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-cyan-500/[0.12] blur-[80px]"
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] h-[200px] w-[200px] rounded-full bg-indigo-500/[0.1] blur-[90px]"
          animate={{ x: [0, 20, -30, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/[0.08]">
              <img src="/symbol.png" alt="Zenovra" className="h-5 w-5 object-contain" />
            </div>
            <span className="text-xl font-semibold">Zenovra Tech</span>
          </motion.div>
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/60 mb-6 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              Enterprise-grade ATS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
            >
              The modern hiring platform built for scale
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-white/50 leading-relaxed"
            >
              Streamline your recruiting workflow, from sourcing to onboarding. Designed for modern teams that move fast.
            </motion.p>
            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {['Pipeline Tracking', 'AI Matching', 'Team Collaboration', 'Analytics'].map((feature, i) => (
                <span key={feature} className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-white/40">
                  {feature}
                </span>
              ))}
            </motion.div>
          </div>
          <p className="text-sm text-white/30">Zenovra Tech — Part of Zenovra Org</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0f]">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.06]">
              <img src="/symbol.png" alt="Zenovra" className="h-4 w-4 object-contain" />
            </div>
            <span className="text-lg font-semibold text-white/90">Zenovra Tech</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl font-semibold mb-1 text-white/90"
          >Welcome back</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm text-white/50 mb-6"
          >Sign in to your account to continue</motion.p>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 rounded-xl border-white/[0.08] focus-visible:ring-white/20 bg-white/[0.04] text-white/90 placeholder:text-white/30 transition-all duration-200 hover:border-white/[0.15]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
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
                  className="pl-9 pr-9 h-11 rounded-xl border-white/[0.08] focus-visible:ring-white/20 bg-white/[0.04] text-white/90 placeholder:text-white/30 transition-all duration-200 hover:border-white/[0.15]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full rounded-xl bg-white text-[#0a0a0f] hover:bg-white/90 shadow-lg transition-all duration-200" size="lg">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0f] px-2 text-xs text-white/30">
              or
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
                size="lg"
                onClick={handleDemoLogin}
              >
                <img src="/symbol.png" alt="Zenovra" className="mr-2 h-4 w-4 object-contain" />
                Continue with Demo Account
              </Button>
            </motion.div>
          </motion.div>

          <p className="text-center text-xs text-white/30 mt-6">
            Looking for jobs?{' '}
            <a href="/careers" className="text-indigo-400 hover:underline font-medium">View open positions</a>
          </p>
          <p className="text-center text-xs text-white/30 mt-2">
            Applicant?{' '}
            <a href="/careers/login" className="text-indigo-400 hover:underline font-medium">Sign in here</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
