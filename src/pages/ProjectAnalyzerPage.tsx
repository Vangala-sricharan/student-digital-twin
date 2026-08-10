import React, { useState } from 'react';
import { Code2, Github, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight, Award } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface ProjectAnalysisResult {
  technologies: string[];
  skillsDemonstrated: string[];
  difficulty: string;
  careerRelevance: string;
  missingSkills: string[];
  resumeValue: number;
  githubQualityScore: number;
  suggestedImprovements: string[];
}

export const ProjectAnalyzerPage: React.FC = () => {
  const { t } = useLanguage();
  const { canAccess, incrementAiUsage } = useSubscription();

  const [description, setDescription] = useState(
    'A C++ Restaurant Point of Sale (POS) and Inventory Management System implementing Object-Oriented Programming (OOP), file handling for persistent records, menu item management, order cart processing, and receipt generation.'
  );
  const [techStackInput, setTechStackInput] = useState('C++, OOP, File Handling, Data Structures');
  const [githubUrl, setGithubUrl] = useState('https://github.com/sricharan/cpp-restaurant-pos');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    if (!canAccess('ai_project_analyzer')) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    const techArray = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      incrementAiUsage();
      const res = await fetch('/api/gemini/project-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectDescription: description,
          techStack: techArray,
          githubUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze project');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Project analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="AI Project Analyzer"
      />

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('project_analyzer_title')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> PRO AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('project_analyzer_subtitle')}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-500" />
              <span>Project Details</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Description & Features
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe your project, features, and target user problems solved..."
                className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="e.g. C++, OOP, Python, OpenCV, Flask"
                className="w-full rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Github className="h-3.5 w-3.5 text-slate-500" />
                <span>GitHub Repository URL (Optional)</span>
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !description.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{loading ? t('loading') : 'Analyze Project Impact'}</span>
            </button>
          </GlassCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-3">
                <Code2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                AI Project Resume Value Evaluator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Enter your project details to evaluate difficulty, demonstrated technical depth, career relevance, and GitHub presentation score.
              </p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[380px] space-y-3">
              <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Evaluating Technical Complexity...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Checking architectural depth, AI relevance, and resume appeal...
              </p>
            </GlassCard>
          )}

          {result && !loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Resume Value
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {result.resumeValue} / 100
                    </h3>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
                      Level: {result.difficulty}
                    </span>
                  </div>
                  <ScoreRing score={result.resumeValue} size={64} strokeWidth={6} label="Value" />
                </GlassCard>

                <GlassCard className="p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      GitHub Quality Score
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {result.githubQualityScore} / 100
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Repo readiness
                    </span>
                  </div>
                  <ScoreRing score={result.githubQualityScore} size={64} strokeWidth={6} label="GitHub" />
                </GlassCard>
              </div>

              {/* Skills Demonstrated */}
              <GlassCard className="p-5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Demonstrated Technical Skills</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.skillsDemonstrated.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Career Relevance & Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-4">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>Career Relevance</span>
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {result.careerRelevance}
                  </p>
                </GlassCard>

                <GlassCard className="p-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Missing Technologies</span>
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {result.missingSkills.join(', ')}
                  </p>
                </GlassCard>
              </div>

              {/* Suggested Improvements */}
              <GlassCard className="p-5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  Actionable Portfolio Boosters
                </h4>
                <div className="space-y-2">
                  {result.suggestedImprovements.map((imp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                    >
                      <ArrowUpRight className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
