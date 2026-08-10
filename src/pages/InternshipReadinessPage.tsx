import React, { useState } from 'react';
import {
  Briefcase,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Award,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { DigitalTwinState } from '../types';
import { calculateInternshipReadiness } from '../services/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface InternshipReadinessPageProps {
  state: DigitalTwinState;
}

export const InternshipReadinessPage: React.FC<InternshipReadinessPageProps> = ({ state }) => {
  const { t } = useLanguage();

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const result = calculateInternshipReadiness(
    state.profile,
    state.skills,
    state.projects,
    state.achievements,
    state.resumeChecklist.items
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Highly Prepared':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Strongly Prepared':
        return 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'Getting Ready':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Building Foundation':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const handleFetchAiAnalysis = async () => {
    setLoadingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Give me a concise 3-paragraph executive AI analysis of my Internship Readiness score of ${result.overallScore}/100 (${result.statusLabel}).

My Category Breakdown:
${result.categoryScores.map((c) => `- ${c.name}: ${c.score}% (${c.explanation})`).join('\n')}

Top Strengths: ${result.strongestAreas.map((s) => `${s.name} (${s.score}%)`).join(', ')}
Key Blockers: ${result.biggestBlockers.map((b) => `${b.name} (${b.score}%)`).join(', ')}

Please provide specific, high-leverage strategic advice to reach 90+ readiness for top tech summer internships.`,
          context: {
            overallScore: result.overallScore,
            categoryScores: result.categoryScores,
            skills: state.skills,
            projects: state.projects,
            achievements: state.achievements,
          },
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error('AI analysis is temporarily unavailable.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI analysis');
      }

      if (data.reply || data.response) {
        setAiAnalysis(data.reply || data.response);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('AI Internship Analysis error:', err);
      setAiError('AI analysis is temporarily unavailable. Please try again.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Internship Readiness
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Understand how prepared you are for your next internship.
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchAiAnalysis}
            disabled={loadingAi}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            {loadingAi ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Digital Twin...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{aiAnalysis ? 'Refresh AI Analysis' : 'Generate AI Analysis'}</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Hero Score Ring + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-5 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <ScoreRing score={result.overallScore} size={150} strokeWidth={12} label="Readiness" />

          <div className="space-y-2">
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(
                result.statusLabel
              )}`}
            >
              {result.statusLabel}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
              Overall score is deterministically computed from your 8 core engineering categories.
            </p>
          </div>
        </GlassCard>

        {/* Strongest Areas & Biggest Blockers side-by-side */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Strongest Areas */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Strongest Areas</span>
            </h3>

            <div className="space-y-3">
              {result.strongestAreas.map((area) => (
                <div
                  key={area.id}
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      ✓ {area.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {area.explanation}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 ml-2">
                    {area.score}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Biggest Blockers */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Biggest Blockers</span>
            </h3>

            <div className="space-y-3">
              {result.biggestBlockers.map((blocker) => (
                <div
                  key={blocker.id}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      ⚠ {blocker.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {blocker.explanation}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 ml-2">
                    {blocker.score}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Explanation Box if available */}
      {(aiAnalysis || aiError) && (
        <GlassCard className="p-6 space-y-3 border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <Sparkles className="h-5 w-5" />
            <span>AI Executive Feedback</span>
          </div>

          {aiError ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
              <span>{aiError}</span>
              <button
                onClick={handleFetchAiAnalysis}
                className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px]"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
              {aiAnalysis}
            </div>
          )}
        </GlassCard>
      )}

      {/* Category Breakdown Grid */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Category Breakdown</span>
          <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
            Weighted Average (100%)
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.categoryScores.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </span>
                <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                  {cat.score}% <span className="text-[10px] text-slate-400 font-normal">({cat.weight}%)</span>
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    cat.score >= 75
                      ? 'bg-emerald-500'
                      : cat.score >= 60
                      ? 'bg-cyan-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                {cat.explanation}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actionable Recommendations */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span>How to Improve</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

