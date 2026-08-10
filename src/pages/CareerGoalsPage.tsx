import React, { useState } from 'react';
import { Target, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CareerGoal, SkillGap } from '../types';

interface CareerGoalsPageProps {
  careerGoals: CareerGoal[];
  activeCareerGoalId: string;
  onSelectCareerGoal: (goalId: string) => void;
  skillGaps: SkillGap[];
  id?: string;
}

export const CareerGoalsPage: React.FC<CareerGoalsPageProps> = ({
  careerGoals,
  activeCareerGoalId,
  onSelectCareerGoal,
  skillGaps,
  id,
}) => {
  const activeGoal = careerGoals.find((g) => g.id === activeCareerGoalId) || careerGoals[0];

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-cyan-500" />
          <span>Career Goal Alignment & Target Profiles</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your target career path to recalibrate skill expectations, gap calculations, and recommendations.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {careerGoals.map((goal) => {
          const isSelected = goal.id === activeCareerGoalId;

          return (
            <GlassCard
              key={goal.id}
              glow={isSelected ? 'cyan' : 'none'}
              onClick={() => onSelectCareerGoal(goal.id)}
              className={`p-5 flex flex-col justify-between cursor-pointer border-2 transition-all ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {goal.title}
                  </h3>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Active Goal
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {goal.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-400">
                  {Object.keys(goal.targetSkills).length} Benchmark Skills
                </span>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <span>{isSelected ? 'Active Target' : 'Set as Goal'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Active Goal Detail & Skill Benchmark Matrix */}
      <GlassCard glow="cyan" className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Target Benchmark Profile</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeGoal.title} Target Matrix
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              {activeGoal.description}
            </p>
          </div>
        </div>

        {/* Skill Gap Comparison Table */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Skill Requirement Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Skill / Competency</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Current Level</th>
                  <th className="py-2.5 px-3">Required Target</th>
                  <th className="py-2.5 px-3">Skill Gap</th>
                  <th className="py-2.5 px-3 text-right">Alignment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {skillGaps.map((gap) => {
                  const statusBadge =
                    gap.status === 'High Gap'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      : gap.status === 'Medium Gap'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : gap.status === 'Low Gap'
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

                  return (
                    <tr key={gap.skillName} className="hover:bg-slate-100/40 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {gap.skillName}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{gap.category}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {gap.currentLevel}%
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-600 dark:text-cyan-400">
                        {gap.requiredLevel}%
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-500">
                        {gap.gap > 0 ? `-${gap.gap}%` : '0%'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusBadge}`}>
                          {gap.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Courses / Learning Paths */}
        {activeGoal.recommendedCourses && activeGoal.recommendedCourses.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-500" />
              <span>Recommended Learning Pathways for {activeGoal.title}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeGoal.recommendedCourses.map((course) => (
                <div
                  key={course}
                  className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
