import React from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  Cpu,
  FolderGit2,
  Trophy,
  Target,
  TrendingUp,
  Bot,
  FileText,
  BookOpen,
  Code2,
  Route,
  Briefcase,
  Sliders,
  Github,
  Zap,
  Settings,
  X,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';

export type ActiveTab =
  | 'dashboard'
  | 'profile'
  | 'students'
  | 'action-planner'
  | 'public-twin'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'career-goals'
  | 'progress'
  | 'ai-assistant'
  | 'resume-analyzer'
  | 'syllabus-analyzer'
  | 'project-analyzer'
  | 'ai-roadmap'
  | 'internship'
  | 'simulator'
  | 'github'
  | 'upgrade'
  | 'settings';



interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  onResetDemo: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  id?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onResetDemo,
  isMobileOpen,
  setIsMobileOpen,
  id,
}) => {
  const { t } = useLanguage();
  const { canAccess, plan, demoMode } = useSubscription();

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const navGroups = [
    {
      title: 'MY TWIN',
      items: [
        { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
        { id: 'profile', label: t('nav_profile'), icon: User },
        { id: 'skills', label: t('nav_skills'), icon: Cpu },
        { id: 'projects', label: t('nav_projects'), icon: FolderGit2 },
        { id: 'achievements', label: t('nav_achievements'), icon: Trophy },
        { id: 'students', label: '👥 Student Profiles', icon: Users },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { id: 'action-planner', label: '🎯 Action Planner', icon: Target },
        { id: 'career-goals', label: t('nav_goals'), icon: Target },
        { id: 'progress', label: t('nav_progress'), icon: TrendingUp },
        { id: 'internship', label: t('nav_internship'), icon: Briefcase, isPro: true },
        { id: 'github', label: t('nav_github'), icon: Github },
      ],
    },
    {
      title: 'AI CAREER OS',
      items: [
        { id: 'ai-assistant', label: t('nav_assistant'), icon: Bot, isPro: true },
        { id: 'resume-analyzer', label: t('nav_resume_analyzer'), icon: FileText, isPro: true },
        { id: 'syllabus-analyzer', label: t('nav_syllabus_analyzer'), icon: BookOpen, isPro: true },
        { id: 'project-analyzer', label: t('nav_project_analyzer'), icon: Code2, isPro: true },
        { id: 'ai-roadmap', label: t('nav_ai_roadmap'), icon: Route, isPro: true },
        { id: 'simulator', label: t('nav_simulator'), icon: Sliders, isPro: true },
      ],
    },
    {
      title: 'SHOWCASE',
      items: [
        { id: 'public-twin', label: '🌐 Public Twin View', icon: Sparkles },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'upgrade', label: t('nav_upgrade'), icon: Zap, highlight: true },
        { id: 'settings', label: t('nav_settings'), icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 font-black text-base">
              DT
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t('app_title')}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Career Readiness OS
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Identity Badge */}
        <div className="mt-4 rounded-2xl bg-sky-50/80 dark:bg-[#0B1626]/80 p-3 border border-sky-100/80 dark:border-sky-500/15">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-500/20">
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-[#F5F9FF]">
                {profile.name}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-[#B7C4D6]">
                {profile.degree} • {profile.branch.split('(')[1]?.replace(')', '') || 'AI/ML'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Group List */}
        <div className="mt-5 space-y-4">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F91A8] block mb-1">
                {group.title}
              </span>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLocked = item.isPro && !canAccess(item.id as any);

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id as ActiveTab)}
                    className={`
                      group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200
                      ${
                        isActive
                          ? 'bg-sky-500/15 text-sky-700 dark:bg-cyan-500/15 dark:text-cyan-300 font-bold border border-sky-300/40 dark:border-cyan-500/30 shadow-sm'
                          : item.highlight
                          ? 'bg-gradient-to-r from-sky-500/10 to-blue-600/10 text-sky-600 dark:text-cyan-400 border border-sky-300/30 font-bold hover:from-sky-500/20 hover:to-blue-600/20'
                          : 'text-slate-600 dark:text-[#B7C4D6] hover:bg-sky-50/60 dark:hover:bg-[#101D30]/80 hover:text-slate-900 dark:hover:text-[#F5F9FF]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-sky-600 dark:text-cyan-400'
                            : item.highlight
                            ? 'text-sky-500'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.isPro && (
                      <span className="flex items-center gap-1">
                        {isLocked ? (
                          <Lock className="h-3 w-3 text-slate-400" />
                        ) : (
                          <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                            PRO
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-6 pt-3 border-t border-slate-200/80 dark:border-sky-500/15 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handleNavClick('upgrade')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 py-2 px-3 text-xs font-bold hover:bg-cyan-500/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{demoMode || plan !== 'free' ? 'Pro Active' : t('upgrade_cta')}</span>
          </button>

          <button
            onClick={onResetDemo}
            title="Reset Demo Data (Vangala Sricharan)"
            className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0B1626]/80 p-2 text-slate-500 dark:text-[#B7C4D6] hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-sky-500/20 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
          Student Digital Twin v2.0 • Vercel Ready
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id={id}
        className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 glass-sidebar transition-colors"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] glass-sidebar border-r border-slate-200/80 dark:border-sky-500/15 shadow-2xl z-10 overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
