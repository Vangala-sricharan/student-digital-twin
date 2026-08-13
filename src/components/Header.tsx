import React from 'react';
import { Menu, Search, Sparkles, RotateCcw, Globe, Sun, Moon, Zap, LogOut, User } from 'lucide-react';
import { StudentProfile, StudentRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { getISTGreeting } from '../utils/timeUtils';

interface HeaderProps {
  profile: StudentProfile;
  overallScore: number;
  onOpenMobileMenu: () => void;
  onResetDemo: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToUpgrade?: () => void;
  students?: StudentRecord[];
  activeStudentId?: string;
  onSelectStudent?: (id: string) => void;
  onNavigateToStudents?: () => void;
  onOpenAuth?: () => void;
  user?: any | null;
  onSignOut?: () => void;
  id?: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  overallScore,
  onOpenMobileMenu,
  onResetDemo,
  searchQuery,
  setSearchQuery,
  onNavigateToUpgrade,
  students,
  activeStudentId,
  onSelectStudent,
  onNavigateToStudents,
  onOpenAuth,
  user,
  onSignOut,
  id,
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { plan, demoMode } = useSubscription();


  const getGreeting = () => getISTGreeting();

  const firstName = profile.name ? (profile.name.split(' ')[1] || profile.name.split(' ')[0]) : 'Student';

  return (
    <header
      id={id}
      className="sticky top-0 z-20 flex h-16 items-center justify-between glass-header px-4 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-[#F5F9FF] flex items-center gap-1.5">
              <span>{getGreeting()}, {firstName}</span>
              <span className="text-sm">👋</span>
            </h2>

            {/* Quick Active Student Selector Dropdown if multiple students exist */}
            {students && students.length > 1 && onSelectStudent && (
              <select
                value={activeStudentId}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="text-[11px] font-bold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.5 outline-none cursor-pointer hidden sm:block"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-[#0B1626] text-slate-900 dark:text-[#F5F9FF]">
                    👤 {s.profile.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <p className="hidden sm:block text-[11px] text-slate-500 dark:text-[#B7C4D6]">
            Digital twin active • Goal: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{profile.careerGoal}</span>
          </p>
        </div>
      </div>


      {/* Right: Controls & Badge */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden md:block w-36 lg:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full rounded-xl bg-slate-100 dark:bg-[#0B1626]/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-[#F5F9FF] placeholder-slate-400 border border-slate-200/60 dark:border-sky-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        {/* Language Selector */}
        <div className="relative hidden xs:flex items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="appearance-none rounded-xl bg-slate-100/80 dark:bg-[#0B1626]/80 border border-slate-200/80 dark:border-sky-500/20 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F5F9FF] pr-5 focus:outline-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="dark:bg-[#0B1626]">
                {lang.flag} {lang.code.toUpperCase()}
              </option>
            ))}
          </select>
          <Globe className="h-3 w-3 text-slate-400 absolute right-1.5 pointer-events-none" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light mode"
          className="p-2 rounded-xl bg-slate-100/80 dark:bg-[#0B1626]/80 text-slate-600 dark:text-[#F5F9FF] hover:text-cyan-500 border border-slate-200/80 dark:border-sky-500/20 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* Cloud Sync Indicator */}
        {onOpenAuth && <CloudSyncIndicator onOpenAuth={onOpenAuth} compact={true} />}

        {/* Authenticated User Indicator & Log Out Button */}
        {user && onSignOut && (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-[#B7C4D6] bg-slate-100 dark:bg-[#0B1626] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-sky-500/20">
              <User className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
            </span>
            <button
              onClick={onSignOut}
              title={`Log Out (${user.email})`}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden xs:inline">Log Out</span>
            </button>
          </div>
        )}

        {/* Plan / Demo Badge */}
        {onNavigateToUpgrade && (
          <button
            onClick={onNavigateToUpgrade}
            title={demoMode ? 'DEMO PRO — All premium features are available for demonstration.' : undefined}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              demoMode || plan !== 'free'
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-cyan-500/30'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-cyan-500" />
            <span className="hidden sm:inline">
              {demoMode ? 'DEMO PRO' : plan === 'pro' ? 'PRO' : plan === 'pro_annual' ? 'ANNUAL' : 'FREE'}
            </span>
          </button>
        )}

        {/* Career Readiness Badge */}
        <div className="flex items-center gap-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 px-2.5 py-1 border border-cyan-500/30">
          <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
          <div className="text-left">
            <span className="hidden sm:block text-[9px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 leading-none">
              Readiness
            </span>
            <span className="text-xs font-black text-cyan-700 dark:text-cyan-300 leading-none">
              {overallScore}%
            </span>
          </div>
        </div>

        {/* Quick Reset Demo button - Hidden on small mobile */}
        <button
          onClick={onResetDemo}
          title="Reset to initial Sricharan profile demo"
          className="hidden md:flex p-2 rounded-xl bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-white/10 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
