import React, { useState, useEffect } from 'react';
import { Route, Sparkles, CheckCircle, Clock, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DigitalTwinState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface RoadmapStage {
  phase: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Next Up' | 'Future' | string;
  items: string[];
}

interface AIRoadmapPageProps {
  state: DigitalTwinState;
}

export const AIRoadmapPage: React.FC<AIRoadmapPageProps> = ({ state }) => {
  const { t, language } = useLanguage();
  const { canAccess, incrementAiUsage } = useSubscription();

  const activeGoal = state.careerGoals.find((g) => g.id === state.activeCareerGoalId) || state.careerGoals[0];

  const [stages, setStages] = useState<RoadmapStage[]>([
    {
      phase: 'Phase 1: Academic & Programming Core',
      title: 'Master C++, Python & OOP Fundamentals',
      status: 'Completed',
      items: [
        'C++ Object-Oriented Programming (Classes, Inheritance, Virtual Functions)',
        'File Handling & Persistent Data Storage (POS System Project)',
        'Basic Python Syntax, Data Types & Control Flow',
      ],
    },
    {
      phase: 'Phase 2: Data Structures & Algorithms',
      title: 'DSA Problem Solving Mastery',
      status: 'In Progress',
      items: [
        'Arrays, Linked Lists, Stacks, Queues & Hash Maps',
        'Binary Search Trees, Recursion & Sorting Algorithms',
        'Solve 50+ DSA problems on LeetCode / HackerRank',
      ],
    },
    {
      phase: 'Phase 3: Machine Learning & Mathematics',
      title: 'Statistical ML Models & NumPy/Pandas',
      status: 'Next Up',
      items: [
        'Linear Algebra, Calculus & Probability for AI',
        'NumPy, Pandas, Matplotlib & Scikit-Learn Data Processing',
        'Build a Convolutional Neural Network (CNN) Image Classifier project',
      ],
    },
    {
      phase: 'Phase 4: Deep Learning & API Deployment',
      title: 'PyTorch, Neural Networks & FastAPI',
      status: 'Future',
      items: [
        'PyTorch Deep Learning Foundations & Model Training',
        'FastAPI REST Service API wrapping AI models',
        'Containerize with Docker & Deploy on Cloud (Render / Cloud Run)',
      ],
    },
    {
      phase: 'Phase 5: Internship & Portfolio Polish',
      title: 'GitHub Readme, Resume & Interview Prep',
      status: 'Future',
      items: [
        'Polish GitHub repositories with live demo links and documentation',
        'Tailor ATS-friendly resume highlighting AI/ML projects and metrics',
        'Apply for AI/ML Engineer summer internships',
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleGenerateAiRoadmap = async () => {
    if (!canAccess('ai_roadmap')) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);

    try {
      incrementAiUsage();
      const res = await fetch('/api/gemini/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: state.profile,
          skills: state.skills,
          goalTitle: activeGoal.title,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.stages) {
        setStages(data.stages);
      }
    } catch (err) {
      console.error('Roadmap generation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Personalized AI Roadmap"
      />

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Route className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('nav_ai_roadmap')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> GEMINI AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Tailored step-by-step career progression path toward becoming an{' '}
                <strong className="text-cyan-600 dark:text-cyan-400">{activeGoal.title}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiRoadmap}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-cyan-500/10 transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{loading ? t('loading') : 'Refresh AI Roadmap'}</span>
          </button>
        </div>
      </GlassCard>

      {/* Visual Timeline Stepper */}
      <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-[19px] sm:before:left-[35px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-600 before:to-slate-300 dark:before:to-slate-800">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status.toLowerCase().includes('complete');
          const isInProgress = stage.status.toLowerCase().includes('progress');

          return (
            <div key={idx} className="relative flex gap-4 sm:gap-6 items-start group">
              {/* Timeline Marker Dot */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-xs shadow-lg transition-transform group-hover:scale-110 z-10 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : isInProgress
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 ring-4 ring-cyan-500/20'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : idx + 1}
              </div>

              {/* Stage Content Card */}
              <GlassCard className="flex-1 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 dark:border-white/10 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {stage.phase}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {stage.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : isInProgress
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : isInProgress ? (
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                    ) : (
                      <Layers className="h-3.5 w-3.5" />
                    )}
                    <span>{stage.status}</span>
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {stage.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
