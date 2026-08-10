import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Sparkles, RefreshCw, CheckCircle, Sliders, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface RoadmapDay {
  day: number;
  topic: string;
  activities: string[];
  difficulty: string;
}

interface SyllabusAnalysisResult {
  subjects: string[];
  totalTopics: number;
  roadmap: RoadmapDay[];
}

export const SyllabusAnalyzerPage: React.FC = () => {
  const { t } = useLanguage();
  const { canAccess, incrementAiUsage } = useSubscription();

  const [syllabusText, setSyllabusText] = useState(`Course Syllabus: B.Tech CSE AI/ML - 2nd Year

MODULE 1: DATA STRUCTURES & ALGORITHMS IN C++
- Dynamic Arrays, Vectors, Memory Management & Pointers
- Linked Lists (Singly, Doubly, Circular)
- Stacks & Queues (Array & Linked List representations)
- Trees & Binary Search Trees (BST Traversals: Inorder, Preorder, Postorder)
- Searching & Sorting (Binary Search, Quick Sort, Merge Sort)

MODULE 2: PYTHON FOR MACHINE LEARNING & DATA SCIENCE
- NumPy: Multidimensional Arrays, Vectorization, Broadcasting
- Pandas: DataFrames, Series, Handling Missing Data, GroupBy
- Matplotlib & Seaborn: Data Visualization, Histograms, Scatter Plots
- Scikit-Learn: Linear Regression, Logistic Regression, Decision Trees

MODULE 3: DATABASE MANAGEMENT SYSTEMS & SQL
- Relational Database Models & ER Diagrams
- DDL & DML Commands in SQL
- Joins (Inner, Outer, Left, Right), Grouping & Aggregations
- Database Indexing, Transactions & ACID Properties`);

  const [days, setDays] = useState(14);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [difficulty, setDifficulty] = useState('Intermediate');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyllabusAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAnalyze = async () => {
    if (!syllabusText.trim()) return;

    if (!canAccess('ai_syllabus_analyzer')) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      incrementAiUsage();
      const res = await fetch('/api/gemini/syllabus-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText,
          days,
          hoursPerDay,
          difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate study roadmap');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Syllabus analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="AI Syllabus Analyzer"
      />

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('syllabus_analyzer_title')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> PRO AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('syllabus_analyzer_subtitle')}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input syllabus & parameters */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-500" />
              <span>Syllabus Content</span>
            </h3>

            <textarea
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              rows={10}
              placeholder="Paste course syllabus modules here..."
              className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />

            {/* Parameters */}
            <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-cyan-500" /> Target Duration:
                </span>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={7} className="dark:bg-slate-900">7 Days Sprint</option>
                  <option value={14} className="dark:bg-slate-900">14 Days Intensive</option>
                  <option value={30} className="dark:bg-slate-900">30 Days Standard</option>
                  <option value={60} className="dark:bg-slate-900">60 Days Deep Dive</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-500" /> Daily Commitment:
                </span>
                <select
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={1} className="dark:bg-slate-900">1 Hour / Day</option>
                  <option value={2} className="dark:bg-slate-900">2 Hours / Day</option>
                  <option value={3} className="dark:bg-slate-900">3 Hours / Day</option>
                  <option value={4} className="dark:bg-slate-900">4 Hours / Day</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-500" /> Difficulty Level:
                </span>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Beginner" className="dark:bg-slate-900">Beginner</option>
                  <option value="Intermediate" className="dark:bg-slate-900">Intermediate</option>
                  <option value="Advanced" className="dark:bg-slate-900">Advanced</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !syllabusText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{loading ? t('loading') : 'Generate Study Roadmap'}</span>
            </button>
          </GlassCard>
        </div>

        {/* Right: Generated Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-3">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Day-by-Day Study Plan Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Paste your course syllabus to convert raw modules into a structured, achievable daily learning schedule.
              </p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] space-y-3">
              <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Generating Personalized Study Roadmap...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parsing units, calculating daily topic workloads, and sequencing prerequisites...
              </p>
            </GlassCard>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Summary Header */}
              <GlassCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {result.subjects.join(' • ')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {result.roadmap.length} Days Plan • {hoursPerDay} hrs/day • {difficulty} level
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <span>{result.totalTopics} Topics Scheduled</span>
                </div>
              </GlassCard>

              {/* Day List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {result.roadmap.map((item) => (
                  <GlassCard key={item.day} className="p-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/10">
                        D{item.day}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.topic}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium">
                            {item.difficulty}
                          </span>
                        </div>

                        <div className="space-y-1 mt-2">
                          {item.activities.map((act, actIdx) => (
                            <div
                              key={actIdx}
                              className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2"
                            >
                              <ChevronRight className="h-3 w-3 text-cyan-500 shrink-0" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
