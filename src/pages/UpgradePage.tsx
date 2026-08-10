import React from 'react';
import { Sparkles, Check, Zap, Shield, Bot, FileText, BookOpen, Sliders, Briefcase, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useSubscription, PlanType } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';

export const UpgradePage: React.FC = () => {
  const { plan, setPlan, demoMode, toggleDemoMode } = useSubscription();
  const { t } = useLanguage();

  const handleSelectPlan = (selectedPlan: PlanType) => {
    setPlan(selectedPlan);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <GlassCard className="p-8 relative overflow-hidden text-center">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('app_title')} Pro</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Supercharge Your AI Career OS
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Unlock real-time Gemini AI career advisory, deep resume & syllabus auditing, internship readiness analytics, and mathematical career simulation.
          </p>

          {/* Developer Demo Mode Banner */}
          <div className="pt-2">
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 mx-auto ${
                demoMode
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              <span>
                Developer Demo Mode: <strong>{demoMode ? 'ACTIVE (Pro Features Unlocked)' : 'OFF'}</strong>
              </span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <GlassCard className={`p-6 flex flex-col justify-between relative ${plan === 'free' && !demoMode ? 'ring-2 ring-cyan-500' : ''}`}>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('plan_free')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {t('price_free')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  forever
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Core Digital Twin tracking, skills matrix, projects, and basic readiness score.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Deterministic Career Readiness Score</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Skill Gaps & Category Breakdown</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Projects & Resume Checklist</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 line-through">
                <span>Gemini AI Assistant & Analyzers</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('free')}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
              plan === 'free'
                ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/20'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10'
            }`}
          >
            {plan === 'free' ? 'Current Plan' : 'Select Free'}
          </button>
        </GlassCard>

        {/* Pro Monthly */}
        <GlassCard className={`p-6 flex flex-col justify-between relative ${plan === 'pro' ? 'ring-2 ring-cyan-500' : ''}`}>
          <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-[10px]">
            MOST POPULAR
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                {t('plan_pro')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {t('price_pro_monthly')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('per_month')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Full access to all AI systems, resume & syllabus analyzers, and internship readiness analytics.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited Gemini AI Career Assistant</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>AI Resume & Syllabus Analyzers</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>AI Project & GitHub Analyzer</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Internship Readiness & Simulator</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('pro')}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
              plan === 'pro'
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
            }`}
          >
            {plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </GlassCard>

        {/* Pro Annual */}
        <GlassCard className={`p-6 flex flex-col justify-between relative ${plan === 'pro_annual' ? 'ring-2 ring-cyan-500' : ''}`}>
          <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px]">
            SAVE 33%
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('plan_pro_annual')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {t('price_pro_annual')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('per_year')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-semibold">
                Equivalent to ₹333 / month
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Best value for 2nd and 3rd year engineering students aiming for long-term career readiness.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Priority AI Response Speed</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>JSON Portfolio Backup & Restore</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('pro_annual')}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
              plan === 'pro_annual'
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
            }`}
          >
            {plan === 'pro_annual' ? 'Current Plan' : 'Get Annual Pro'}
          </button>
        </GlassCard>
      </div>

      {/* Feature Matrix Table */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Feature Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 font-bold text-slate-900 dark:text-white">
                <th className="py-3 px-4">Feature / Capability</th>
                <th className="py-3 px-4 text-center">Free Plan (₹0)</th>
                <th className="py-3 px-4 text-center">Pro Plan (₹499)</th>
                <th className="py-3 px-4 text-center">Pro Annual (₹3,999)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold">Career Readiness Score Engine</td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Gemini AI Career Assistant</td>
                <td className="py-3 px-4 text-center text-slate-400">3 queries/day</td>
                <td className="py-3 px-4 text-center font-bold text-cyan-500">100 queries/day</td>
                <td className="py-3 px-4 text-center font-bold text-cyan-500">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">AI Resume Analyzer</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">AI Syllabus Day-by-Day Generator</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Career What-If Simulator</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">JSON Export & Restore</td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
