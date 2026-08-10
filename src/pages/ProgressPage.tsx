import React, { useState } from 'react';
import { TrendingUp, Plus, Calendar, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { Modal } from '../components/Modal';
import { ProgressSnapshot, CategoryScore } from '../types';

interface ProgressPageProps {
  progressHistory: ProgressSnapshot[];
  currentOverallScore: number;
  categoryScores: CategoryScore[];
  onAddSnapshot: (snapshot: ProgressSnapshot) => void;
  id?: string;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progressHistory,
  currentOverallScore,
  categoryScores,
  onAddSnapshot,
  id,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');

  const chartData = [
    ...progressHistory.map((s) => ({
      date: s.date,
      score: s.overallScore,
      note: s.note,
    })),
    {
      date: 'Today',
      score: currentOverallScore,
      note: 'Current calculated digital twin snapshot.',
    },
  ];

  const handleLogSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];

    const categoryMap: Record<string, number> = {};
    categoryScores.forEach((c) => {
      categoryMap[c.name] = c.score;
    });

    onAddSnapshot({
      id: `snap-${Date.now()}`,
      date: todayStr,
      overallScore: currentOverallScore,
      categoryScores: categoryMap,
      note: note.trim() || 'Logged milestone snapshot.',
    });

    setNote('');
    setIsModalOpen(false);
  };

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-cyan-500" />
            <span>Progress Timeline & Readiness Growth</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track historical career readiness progression, milestones, and category improvements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Log Current Progress Snapshot</span>
        </button>
      </div>

      {/* Main Readiness Trend Line Chart */}
      <GlassCard glow="cyan" className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span>Career Readiness Score Trend</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Score trajectory over academic semesters and project milestones.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Current Trajectory</span>
            <p className="text-xl font-black text-cyan-600 dark:text-cyan-400">
              {currentOverallScore} / 100
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 8, stroke: '#38bdf8', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Milestone History Log Cards */}
      <GlassCard glow="none" className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Milestone Snapshot History
        </h2>

        {progressHistory.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Calendar className="mx-auto h-10 w-10 text-slate-400 opacity-50 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No historical milestones logged yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your progress timeline will build as you continue using Student Digital Twin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {progressHistory.map((snap) => (
              <div
                key={snap.id}
                className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {snap.date}
                    </span>
                    <span className="rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 text-[10px] font-extrabold border border-cyan-500/20">
                      Overall Score: {snap.overallScore} / 100
                    </span>
                  </div>
                  {snap.note && (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {snap.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Add Snapshot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Progress Snapshot"
        subtitle="Save current Career Readiness state to your progress timeline"
      >
        <form onSubmit={handleLogSnapshot} className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Logging a snapshot captures your current calculated score of{' '}
              <strong className="text-cyan-600 dark:text-cyan-400">{currentOverallScore} / 100</strong>.
            </p>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Milestone Note / Reflection
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Completed C++ POS System and Prompt Wars event participation..."
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-cyan-600 text-white px-5 py-2 text-xs font-bold shadow-lg shadow-cyan-600/20"
            >
              Save Milestone Snapshot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
