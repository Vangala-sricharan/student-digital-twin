import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Brain,
  Target,
  BarChart3,
  Bot,
  Zap,
  ArrowRight,
  UserCheck,
  Code,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  PlayCircle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  CloudCheck
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface PublicLandingPageProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onEnterDemo: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  user?: any | null;
  onSignOut?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onOpenAuth,
  onEnterDemo,
  onToggleTheme,
  theme,
  user,
  onSignOut
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-50/70 dark:bg-[#030712] text-slate-900 dark:text-[#F5F9FF] font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/20 dark:bg-blue-600/10 rounded-full blur-[140px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/15 dark:bg-sky-500/10 rounded-full blur-[120px] -ml-24 -mb-24" />
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-sky-300/20 dark:bg-cyan-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-sky-200/60 dark:border-sky-500/20 bg-white/80 dark:bg-[#07111F]/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-3xl shadow-lg shadow-sky-950/5 dark:shadow-black/40 mb-8 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-[#F5F9FF]">
                Student Digital Twin
              </span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-cyan-400 border border-sky-300/50 dark:border-sky-500/30">
                V3.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1626] border border-sky-200 dark:border-sky-500/30 text-slate-700 dark:text-[#F5F9FF] font-semibold text-xs hover:bg-slate-200 dark:hover:bg-[#101D30] active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Top-Right Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CloudCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Cloud Connected</span>
                </div>

                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B1626] border border-sky-200 dark:border-sky-500/30 text-slate-800 dark:text-[#F5F9FF] text-xs font-semibold">
                  <User className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </div>

                <button
                  onClick={onEnterDemo}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  My Twin →
                </button>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    title="Log Out"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onEnterDemo}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/15 dark:bg-sky-500/20 hover:bg-sky-500/25 dark:hover:bg-sky-500/30 active:scale-95 text-sky-800 dark:text-sky-300 border border-sky-300/60 dark:border-sky-500/30 font-bold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                >
                  <PlayCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Try Demo</span>
                </button>

                <button
                  onClick={() => onOpenAuth('signin')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/90 dark:bg-[#0B1626] hover:bg-slate-100 dark:hover:bg-[#101D30] active:scale-[0.98] active:bg-slate-200 dark:active:bg-[#152438] text-slate-800 dark:text-[#F5F9FF] border border-sky-200/80 dark:border-sky-500/30 font-bold text-xs transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <LogIn className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-slate-800 dark:text-[#F5F9FF]">Log In</span>
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                >
                  <UserPlus className="h-4 w-4 shrink-0" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-4 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 text-sky-800 dark:text-cyan-300 text-xs font-extrabold border border-sky-300/60 dark:border-sky-500/30 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-cyan-400" />
            <span>AI-POWERED PERSONAL CAREER OPERATING SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC] leading-tight">
            Track, Analyze & Elevate Your <br />
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Engineering Career Readiness
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#B7C4D6] max-w-2xl mx-auto leading-relaxed font-medium">
            Student Digital Twin models your skills, coursework, projects, and achievements into a real-time career twin powered by Gemini AI. Get instant industry readiness audits, personalized roadmaps, and resume feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span>Build Your Student Twin</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1626] hover:bg-slate-100 dark:hover:bg-[#101D30] active:scale-95 text-slate-800 dark:text-[#F5F9FF] font-bold text-sm border border-sky-200 dark:border-sky-500/30 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <PlayCircle className="h-4 w-4 text-sky-600 dark:text-cyan-400 shrink-0" />
              <span>Explore Creator Showcase (Demo)</span>
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12 pt-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-cyan-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F9FF] mt-1">
              How Student Digital Twin Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5 space-y-2 border-sky-200/80 dark:border-sky-500/20 bg-white/80 dark:bg-[#0B1626]/80">
              <span className="text-2xl font-black text-sky-600 dark:text-cyan-400">01</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F9FF]">Create Your Twin</h3>
              <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
                Sign up with Google or Email to generate your secure student career profile.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 border-sky-200/80 dark:border-sky-500/20 bg-white/80 dark:bg-[#0B1626]/80">
              <span className="text-2xl font-black text-sky-600 dark:text-cyan-400">02</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F9FF]">Add Skills & Projects</h3>
              <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
                Log technical proficiencies, built projects, certifications, and academic details.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 border-sky-200/80 dark:border-sky-500/20 bg-white/80 dark:bg-[#0B1626]/80">
              <span className="text-2xl font-black text-sky-600 dark:text-cyan-400">03</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F9FF]">AI Analyzes Profile</h3>
              <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
                Gemini AI evaluates career readiness score, skill gaps, and resume formatting.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 border-sky-200/80 dark:border-sky-500/20 bg-white/80 dark:bg-[#0B1626]/80">
              <span className="text-2xl font-black text-sky-600 dark:text-cyan-400">04</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F9FF]">Elevate Readiness</h3>
              <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
                Follow personalized action plans and AI career advice to target tier-1 roles.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="p-6 space-y-3 bg-white/80 dark:bg-[#0B1626]/80 border-sky-200/80 dark:border-sky-500/20">
            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-300/50 dark:border-sky-500/30 flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F9FF]">
              Deterministic Readiness Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
              Mathematical scoring algorithm evaluating core technical skills, project complexity, OOP fundamentals, DSA knowledge, and resume readiness.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-white/80 dark:bg-[#0B1626]/80 border-sky-200/80 dark:border-sky-500/20">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-300/50 dark:border-sky-500/30 flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F9FF]">
              Gemini AI Career Advisory
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
              Real-time server-side Gemini AI integration for resume auditing, day-by-day syllabus study roadmaps, project code analysis, and career simulation.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-white/80 dark:bg-[#0B1626]/80 border-sky-200/80 dark:border-sky-500/20">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-300/50 dark:border-sky-500/30 flex items-center justify-center">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F9FF]">
              Verified Public Share Twin
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
              Generate shareable public portfolio cards and QR codes for recruiters, internship evaluators, and university review boards.
            </p>
          </GlassCard>
        </div>

        {/* Creator & Developer Showcase Information Section */}
        <GlassCard className="p-8 mb-12 relative overflow-hidden border-sky-300/60 dark:border-sky-500/30 bg-white/80 dark:bg-[#0B1626]/90">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-cyan-300 text-[11px] font-bold border border-sky-300/50 dark:border-sky-500/30">
                <GraduationCap className="h-4 w-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                <span>CREATOR & DEVELOPER SHOWCASE</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-[#F5F9FF]">
                Engineered by Vangala Sricharan
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
                2nd-year B.Tech Computer Science & Engineering (AI/ML) student at Marwadi University, Rajkot, Gujarat, India. Designed as a personal career OS to bridge the gap between academic curriculum and tier-1 industry expectations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-[#B7C4D6]">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-[#F5F9FF]">
                  <Code className="h-3.5 w-3.5 text-sky-500 shrink-0" /> C++, Python, AI/ML, React, Supabase
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-[#F5F9FF]">
                  <Award className="h-3.5 w-3.5 text-sky-500 shrink-0" /> Marwadi University
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onEnterDemo}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <PlayCircle className="h-4 w-4 shrink-0" />
                <span>Launch Creator Demo Profile</span>
              </button>

              <p className="text-[10px] text-center text-slate-500 dark:text-[#B7C4D6]">
                Explore Sricharan's complete verified digital twin profile.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <footer className="pt-8 border-t border-sky-200/50 dark:border-sky-500/20 text-center text-xs text-slate-500 dark:text-[#B7C4D6]">
          <p>© 2026 Student Digital Twin V3.1 • Powered by Gemini AI & Supabase Cloud</p>
        </footer>
      </div>
    </div>
  );
};

