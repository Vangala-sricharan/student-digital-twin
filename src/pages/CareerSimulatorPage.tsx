import React, { useState } from 'react';
import { Sliders, RotateCcw, TrendingUp, Sparkles, CheckSquare, PlusCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { DigitalTwinState } from '../types';
import { calculateCareerReadiness } from '../services/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface CareerSimulatorPageProps {
  state: DigitalTwinState;
}

export const CareerSimulatorPage: React.FC<CareerSimulatorPageProps> = ({ state }) => {
  const { t } = useLanguage();

  const activeGoal = state.careerGoals.find((g) => g.id === state.activeCareerGoalId) || state.careerGoals[0];

  // Base calculation
  const baseReadiness = calculateCareerReadiness(
    state.profile,
    state.skills,
    state.projects,
    state.achievements,
    activeGoal,
    state.resumeChecklist
  );

  // Simulation controls
  const [dsaBoost, setDsaBoost] = useState(0); // 0, 15, 30
  const [aimlBoost, setAimlBoost] = useState(0); // 0, 20, 35
  const [addDeployedProject, setAddDeployedProject] = useState(false);
  const [addAiCert, setAddAiCert] = useState(false);
  const [completeResumeChecklist, setCompleteResumeChecklist] = useState(false);

  // Derive simulated state
  const simulatedSkills = state.skills.map((s) => {
    if (s.name.toLowerCase().includes('data structure') || s.name.toLowerCase().includes('algorithm')) {
      return { ...s, numericScore: Math.min(100, s.numericScore + dsaBoost) };
    }
    if (s.name.toLowerCase().includes('machine learning') || s.name.toLowerCase().includes('python')) {
      return { ...s, numericScore: Math.min(100, s.numericScore + aimlBoost) };
    }
    return s;
  });

  const simulatedProjects = [...state.projects];
  if (addDeployedProject) {
    simulatedProjects.push({
      id: 'sim-proj-1',
      name: 'Simulated CNN Computer Vision Classifier',
      description: 'Deep Learning PyTorch image model with live web demo and Docker deployment.',
      technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'OpenCV'],
      githubUrl: 'https://github.com/sricharan/simulated-cnn-classifier',
      liveUrl: 'https://cnn-classifier-demo.example.com',
      featured: true,
      status: 'Completed',
    });
  }

  const simulatedAchievements = [...state.achievements];
  if (addAiCert) {
    simulatedAchievements.push({
      id: 'sim-ach-1',
      title: 'PyTorch Deep Learning & Computer Vision Specialization',
      issuer: 'DeepLearning.AI / Coursera',
      date: '2026',
      verified: true,
    });
  }

  const simulatedResumeChecklist = {
    ...state.resumeChecklist,
    completedCount: completeResumeChecklist
      ? state.resumeChecklist.items.length
      : state.resumeChecklist.completedCount,
  };

  const simulatedReadiness = calculateCareerReadiness(
    state.profile,
    simulatedSkills,
    simulatedProjects,
    simulatedAchievements,
    activeGoal,
    simulatedResumeChecklist
  );

  const currentScore = baseReadiness.overallScore;
  const projectedScore = simulatedReadiness.overallScore;
  const delta = projectedScore - currentScore;

  const handleReset = () => {
    setDsaBoost(0);
    setAimlBoost(0);
    setAddDeployedProject(false);
    setAddAiCert(false);
    setCompleteResumeChecklist(false);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('simulator_title')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> MATHEMATICAL ENGINE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('simulator_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-white/10 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('reset')}</span>
          </button>
        </div>
      </GlassCard>

      {/* Comparison Hero Card */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
          {/* Current Score */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Current Readiness
            </span>
            <ScoreRing score={currentScore} size={90} strokeWidth={8} label="Current" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">
              {currentScore}%
            </span>
          </div>

          {/* Delta Indicator */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <TrendingUp className="h-8 w-8 mb-1" />
            <span className="text-2xl font-extrabold">
              {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Projected Boost
            </span>
          </div>

          {/* Projected Score */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {t('projected_score')}
            </span>
            <ScoreRing score={projectedScore} size={90} strokeWidth={8} label="Projected" />
            <span className="text-xl font-bold text-cyan-500 mt-2">
              {projectedScore}%
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {t('simulator_disclaimer')}
          </p>
        </div>
      </GlassCard>

      {/* Simulator Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Boosters */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-500" />
            <span>Simulate Skill Enhancements</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Data Structures & Algorithms (DSA) Improvement</span>
                <span className="text-cyan-600 dark:text-cyan-400">+{dsaBoost}% Score</span>
              </div>
              <div className="flex gap-2">
                {[0, 15, 30].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDsaBoost(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      dsaBoost === val
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    {val === 0 ? 'Current' : `+${val}% DSA`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>AI/ML Deep Learning Skills Improvement</span>
                <span className="text-cyan-600 dark:text-cyan-400">+{aimlBoost}% Score</span>
              </div>
              <div className="flex gap-2">
                {[0, 20, 35].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAimlBoost(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      aimlBoost === val
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    {val === 0 ? 'Current' : `+${val}% AI/ML`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Portfolio & Certification Boosters */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-cyan-500" />
            <span>Simulate Portfolio & Credentials</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all">
              <input
                type="checkbox"
                checked={addDeployedProject}
                onChange={(e) => setAddDeployedProject(e.target.checked)}
                className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Add Deployed AI/ML Project (Live Demo Link)
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Simulates adding a PyTorch computer vision web application hosted live on Vercel/Render.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all">
              <input
                type="checkbox"
                checked={addAiCert}
                onChange={(e) => setAddAiCert(e.target.checked)}
                className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Add Verified PyTorch / DeepLearning.AI Certification
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Simulates completing a recognized specialization in neural networks.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all">
              <input
                type="checkbox"
                checked={completeResumeChecklist}
                onChange={(e) => setCompleteResumeChecklist(e.target.checked)}
                className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Complete 100% Resume & Profile Checklist
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Simulates completing all resume checklist fields (education, skills, project links).
                </span>
              </div>
            </label>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
