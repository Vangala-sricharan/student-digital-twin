import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  FolderGit2,
  Trophy,
  FileText,
  Target,
  ChevronRight,
  Bot,
  Briefcase,
  Zap,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import {
  StudentProfile,
  CategoryScore,
  SkillGap,
  Recommendation,
  Project,
  Achievement,
  Skill,
} from '../types';
import { ActiveTab } from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { getISTGreeting } from '../utils/timeUtils';

interface DashboardPageProps {
  profile: StudentProfile;
  overallScore: number;
  categoryScores: CategoryScore[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  projects: Project[];
  achievements: Achievement[];
  skills: Skill[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleRecommendation?: (id: string) => void;
  id?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  overallScore,
  categoryScores,
  skillGaps,
  recommendations,
  projects,
  achievements,
  skills,
  setActiveTab,
  id,
}) => {
  const { t } = useLanguage();
  const { plan, demoMode } = useSubscription();

  const [recFilter, setRecFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredRecs = recommendations.filter((r) => {
    if (recFilter === 'All') return true;
    return r.priority === recFilter;
  });

  const completedProjects = projects.filter((p) => p.status === 'Completed').length;

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Top Banner & Hero Score Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Digital Twin Overview */}
        <GlassCard glow="cyan" className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Personal Career Operating System V2</span>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Zap className="h-3 w-3" />
                <span>{demoMode ? 'DEMO PRO (UNLOCKED)' : plan === 'pro' ? 'PRO PLAN' : plan === 'pro_annual' ? 'PRO ANNUAL' : 'FREE PLAN'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {getISTGreeting()}, {profile.name ? (profile.name.split(' ')[1] || profile.name.split(' ')[0]) : 'Student'} 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Your digital twin is tracking your journey toward becoming an{' '}
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {profile.careerGoal}
              </span>
              .
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {profile.university} • {profile.degree} {profile.branch} ({profile.year})
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skills Tracked</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{skills.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">Projects Done</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{completedProjects}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Achievements</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{achievements.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Goal</p>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 truncate mt-1">
                {profile.careerGoal}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Right 1 Col: Circular Career Readiness Score Ring */}
        <GlassCard glow="blue" className="p-6 flex flex-col items-center justify-center text-center">
          <ScoreRing
            score={overallScore}
            size={180}
            label="Career Readiness"
            subLabel={`${overallScore >= 70 ? 'Strong Alignment' : 'Active Growth Phase'}`}
          />
          <div className="mt-4 space-y-2 text-center w-full">
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Why your score is {overallScore}:
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#B7C4D6] mt-0.5">
                Evaluated across {skills.length} skills, {completedProjects} completed projects & {categoryScores.length} readiness dimensions.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('career-goals')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center justify-center gap-1 w-full"
            >
              <span>View Goal Requirements</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* 🎯 PROMINENT NEXT BEST ACTION CARD */}
      <GlassCard glow="cyan" className="p-6 border-cyan-500/30 bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-indigo-600/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-black border border-cyan-500/30">
              <Target className="h-3.5 w-3.5" />
              <span>🎯 YOUR NEXT BEST ACTION</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-[#F5F9FF]">
              {recommendations[0]?.action || 'Complete your GitHub & OOP C++ Project Documentation'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#B7C4D6] leading-relaxed">
              {recommendations[0]?.reason || 'Strengthen your core engineering project portfolio to improve career readiness and tier-1 company alignment.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                Potential Score Increase: +6 pts
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setActiveTab('action-planner')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Action →</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* V2 QUICK AI OS LAUNCHPAD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="p-5 rounded-3xl bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 border border-cyan-500/30 text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-500 font-bold group-hover:scale-110 transition-transform">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              GEMINI AI
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Career Assistant</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ask career, skill, and roadmap questions tailored to your profile.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('internship')}
          className="p-5 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-indigo-600/10 hover:from-blue-500/20 hover:to-indigo-600/20 border border-blue-500/30 text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-500 font-bold group-hover:scale-110 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
              ANALYTICS
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Internship Readiness</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluate blockers, readiness score, and score boosters.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className="p-5 rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-teal-600/10 hover:from-emerald-500/20 hover:to-teal-600/20 border border-emerald-500/30 text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 font-bold group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              SIMULATOR
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">What-If Simulator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate skill boosts and project additions in real-time.
          </p>
        </button>
      </div>

      {/* CATEGORY CARDS SECTION (8 Categories) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-500" />
              <span>Career Readiness Categories</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weighted scoring benchmark evaluated directly against your initial dataset.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryScores.map((cat) => {
            const statusStyle =
              cat.status === 'Strong'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : cat.status === 'On Track'
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';

            return (
              <GlassCard key={cat.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                    <span className="text-xs font-bold text-slate-400">{cat.weight}% Weight</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{cat.score}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusStyle}`}>
                    {cat.status}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* SKILL GAP ANALYSIS SECTION */}
      <div>
        <GlassCard className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>Skill Gap Analysis — {profile.careerGoal}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing your current proficiency vs required skill levels for your career goal.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('career-goals')}
              className="self-start sm:self-auto text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Change Career Target</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {skillGaps.slice(0, 6).map((gap) => {
              const gapBadgeColor =
                gap.status === 'High Gap'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : gap.status === 'Medium Gap'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : gap.status === 'Low Gap'
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

              return (
                <div
                  key={gap.skillName}
                  className="p-4 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {gap.skillName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        ({gap.category})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Current: <strong className="text-slate-900 dark:text-white">{gap.currentLevel}%</strong> / Required: <strong className="text-slate-900 dark:text-white">{gap.requiredLevel}%</strong>
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${gapBadgeColor}`}>
                        {gap.status} ({gap.gap > 0 ? `-${gap.gap}%` : 'Matched'})
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-500/20 dark:bg-blue-400/20"
                      style={{ width: `${gap.requiredLevel}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${gap.currentLevel}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* NEXT BEST ACTIONS RECOMMENDATION ENGINE */}
      <div>
        <GlassCard className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Next Best Actions</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated career readiness recommendations generated from your skill gap analysis.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRecFilter(filter)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    recFilter === filter
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecs.map((rec) => {
              const priorityBadge =
                rec.priority === 'High'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : rec.priority === 'Medium'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';

              return (
                <div
                  key={rec.id}
                  className="rounded-2xl bg-slate-100/70 dark:bg-white/5 p-5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${priorityBadge}`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {rec.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h3>

                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-slate-100">Reason:</strong> {rec.reason}
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-xs text-cyan-800 dark:text-cyan-300">
                        <strong>Action:</strong> {rec.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* QUICK HIGHLIGHTS: PROJECTS & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-cyan-500" />
              <span>C++ POS & Systems Projects</span>
            </h3>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              View All ({projects.length})
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{proj.name}</h4>
                  <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                    {proj.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {proj.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Key Achievements */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Activities & Achievements</span>
            </h3>
            <button
              onClick={() => setActiveTab('achievements')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              View All ({achievements.length})
            </button>
          </div>

          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-start gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-bold shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ach.organization} • {ach.date}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
