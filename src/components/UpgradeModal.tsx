import React from 'react';
import { Lock, Sparkles, Check, Zap } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onOpenUpgradePage?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName = 'Pro AI System',
  onOpenUpgradePage,
}) => {
  const { toggleDemoMode, demoMode } = useSubscription();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/90 dark:bg-[#0B1626]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-sky-500/20 shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-500 border border-cyan-500/30 mb-4 shadow-lg shadow-cyan-500/10">
            <Lock className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Student Digital Twin Pro</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Unlock {featureName}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md">
            {t('unlock_pro_desc')} Get personalized Gemini AI advice, resume audits, syllabus study roadmaps, and internship readiness analytics.
          </p>

          <div className="w-full space-y-2 text-left bg-slate-100/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/60 dark:border-white/10 mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Gemini-powered AI Career Assistant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>AI Resume, Syllabus & Project Analyzers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Internship Readiness Breakdown & Simulator</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => {
                onClose();
                if (onOpenUpgradePage) onOpenUpgradePage();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>{t('upgrade_cta')}</span>
            </button>

            <button
              onClick={() => {
                toggleDemoMode();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200/80 dark:border-white/10 transition-colors"
            >
              Enable Demo Mode (Unlock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
