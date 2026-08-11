import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Zap, Shield, Bot, FileText, BookOpen, Sliders, Briefcase, RefreshCw, QrCode, Copy, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useSubscription, PlanType } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';

export const UpgradePage: React.FC = () => {
  const { plan, setPlan, demoMode, toggleDemoMode } = useSubscription();
  const { t } = useLanguage();

  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(23);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);

  const upiId = '9391700862@ybl';

  useEffect(() => {
    let timer: any;
    if (isSimulating && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSimulating && countdown === 0) {
      setIsSimulating(false);
      setSimulationComplete(true);
    }
    return () => clearInterval(timer);
  }, [isSimulating, countdown]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCountdown(23);
    setSimulationComplete(false);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

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

      {/* Payment Demonstration Section */}
      <GlassCard className="p-6 border-sky-300/60 dark:border-sky-500/30">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* QR Code Graphic representing UPI ID 9391700862@ybl */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col items-center shrink-0">
            <div className="p-2 bg-slate-900 rounded-xl mb-2 text-white text-[10px] font-bold tracking-widest uppercase">
              UPI QR CODE
            </div>
            <svg className="h-32 w-32" viewBox="0 0 100 100" fill="none">
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

              {/* QR Pattern dots */}
              <rect x="38" y="8" width="8" height="8" rx="1" fill="#0284c7" />
              <rect x="50" y="8" width="10" height="8" rx="1" fill="#0f172a" />
              <rect x="38" y="20" width="12" height="8" rx="1" fill="#0f172a" />
              <rect x="54" y="20" width="8" height="8" rx="1" fill="#0284c7" />

              <rect x="8" y="38" width="8" height="12" rx="1" fill="#0f172a" />
              <rect x="20" y="38" width="12" height="8" rx="1" fill="#0284c7" />
              <rect x="8" y="54" width="12" height="8" rx="1" fill="#0f172a" />

              <rect x="38" y="38" width="24" height="24" rx="2" fill="#0f172a" />
              <rect x="42" y="42" width="16" height="16" rx="1" fill="#0284c7" />

              <rect x="68" y="38" width="10" height="12" rx="1" fill="#0f172a" />
              <rect x="82" y="38" width="10" height="8" rx="1" fill="#0284c7" />

              <rect x="38" y="68" width="12" height="10" rx="1" fill="#0f172a" />
              <rect x="54" y="68" width="10" height="12" rx="1" fill="#0f172a" />
              <rect x="68" y="68" width="12" height="12" rx="1" fill="#0284c7" />
              <rect x="84" y="68" width="8" height="24" rx="1" fill="#0f172a" />
              <rect x="38" y="82" width="24" height="10" rx="1" fill="#0284c7" />
            </svg>
            <span className="text-[11px] font-bold text-slate-800 mt-2">Scan to Pay</span>
          </div>

          {/* Details & Simulation Button */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-300/40">
                DEMONSTRATION PAYMENT UI
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                UPI Payment & Demo Simulation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You can test the payment workflow using the demonstration simulator below.
              </p>
            </div>

            {/* UPI ID box */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Demonstration UPI ID
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {upiId}
                </span>
              </div>
              <button
                onClick={handleCopyUPI}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedUPI ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedUPI ? 'Copied' : 'Copy UPI'}</span>
              </button>
            </div>

            {/* Simulation Status & Trigger */}
            <div className="space-y-3">
              {!isSimulating && !simulationComplete && (
                <button
                  onClick={handleStartSimulation}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>Start 23-Second Demo Payment Simulation</span>
                </button>
              )}

              {isSimulating && (
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-300/60 dark:border-sky-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                      <span>Demo Payment Simulation Processing...</span>
                    </span>
                    <span className="font-mono text-sm">{countdown}s remaining</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-1000"
                      style={{ width: `${((23 - countdown) / 23) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {simulationComplete && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-800 dark:text-amber-200 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>DEMO ONLY — NO REAL PAYMENT WAS VERIFIED</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Demo payment simulation completed. Please note that this is a UI demonstration only — no financial transaction occurred, no money was received, and no account was debited.
                  </p>
                  <button
                    onClick={handleStartSimulation}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 underline hover:text-sky-500 pt-1 block"
                  >
                    Run Simulation Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
