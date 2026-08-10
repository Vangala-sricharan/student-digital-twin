import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface ResumeAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingInfo: string[];
  improvements: string[];
  careerAlignment: string;
}

export const ResumeAnalyzerPage: React.FC = () => {
  const { t } = useLanguage();
  const { canAccess, incrementAiUsage } = useSubscription();

  const [resumeText, setResumeText] = useState(`Vangala Sricharan
B.Tech Computer Science & Engineering (AI/ML) - Marwadi University (2nd Year)
Email: sricharan@example.com | Location: Rajkot, Gujarat

OBJECTIVE:
Enthusiastic 2nd year B.Tech student specializing in AI/ML aiming to secure an AI/ML or Software Engineering Internship.

EDUCATION:
- B.Tech CSE (AI/ML), Marwadi University | 2024 - 2028 | CGPA: 8.4
- Class 12 Senior Secondary | Higher Secondary Board | 88%

TECHNICAL SKILLS:
- Languages: C, C++, Python, SQL
- Core Concepts: Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), DBMS
- AI/ML Foundations: NumPy, Pandas, Scikit-Learn, CNN Architectures
- Tools & OS: Git, GitHub, Linux, VS Code

PROJECTS:
1. C++ Restaurant POS & Inventory Management System
   - Object-Oriented C++ application with file storage, order processing, and bill generation.
2. C++ Automated Teller Machine (ATM) Management Simulator
   - Secure account authentication, balance ledger, and persistent transaction logs.

ACHIEVEMENTS & CERTIFICATIONS:
- Winner / Participant in AI Sparks '26 Hackathon
- Participant in Prompt Wars '26 Prompt Engineering Competition`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;

    if (!canAccess('ai_resume_analyzer')) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      incrementAiUsage();
      const res = await fetch('/api/gemini/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Resume Analyzer is temporarily unavailable.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Resume Analyzer is temporarily unavailable.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Resume analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="AI Resume Analyzer"
      />

      <GlassCard className="p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('resume_analyzer_title')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> PRO AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('resume_analyzer_subtitle')}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Upload / Text Editor */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-500" />
                <span>Resume Document / Text</span>
              </h3>

              <label className="cursor-pointer text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload TXT/MD</span>
                <input type="file" accept=".txt,.md,.doc" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={14}
              placeholder="Paste or upload your resume text here..."
              className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 leading-relaxed"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {resumeText.trim().split(/\s+/).length} words
              </span>

              <button
                onClick={handleAnalyze}
                disabled={loading || !resumeText.trim()}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>{loading ? t('loading') : t('analyze')}</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right: AI Analysis Results */}
        <div className="lg:col-span-6 space-y-4">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-3">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Ready for AI Resume Audit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Click "Analyze Now" to get your AI Resume Score, keyword gaps, and actionable improvement recommendations.
              </p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] space-y-3">
              <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Analyzing Resume Content...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating tech stack keywords, impact metrics, and AI/ML career alignment...
              </p>
            </GlassCard>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Score Header */}
              <GlassCard className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    AI Resume Score
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {result.score} / 100
                  </h2>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                    {result.careerAlignment}
                  </p>
                </div>
                <ScoreRing score={result.score} size={80} strokeWidth={8} label="Score" />
              </GlassCard>

              {/* Strengths */}
              <GlassCard className="p-5">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Resume Strengths</span>
                </h4>
                <ul className="space-y-1.5">
                  {result.strengths.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Weaknesses & Missing Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Areas to Improve</span>
                  </h4>
                  <ul className="space-y-1">
                    {result.weaknesses.map((item, i) => (
                      <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard className="p-4">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Missing Information</span>
                  </h4>
                  <ul className="space-y-1">
                    {result.missingInfo.map((item, i) => (
                      <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* Suggested Actionable Improvements */}
              <GlassCard className="p-5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  <span>Suggested Improvements</span>
                </h4>
                <div className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200"
                    >
                      {imp}
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
