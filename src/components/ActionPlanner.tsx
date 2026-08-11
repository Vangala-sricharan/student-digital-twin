import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, Calendar, Flag, Sparkles, Trash2, Filter } from 'lucide-react';
import { TaskItem, PriorityLevel } from '../types';

interface ActionPlannerProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const ActionPlanner: React.FC<ActionPlannerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Data Structures');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      notes: notes.trim(),
    });
    setTitle('');
    setNotes('');
    setShowAddForm(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-sky-500/20 bg-white/70 dark:bg-[#0B1626]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Today's Career Mission</span>
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  V3 Planner
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable daily tasks aligned with your AI/ML Engineer career roadmap
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-xl bg-slate-100 dark:bg-white/5 p-3 border border-slate-200/60 dark:border-white/10">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="text-slate-700 dark:text-slate-300">
            Mission Progress: {completedCount} of {tasks.length} completed
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{progressPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* New Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-cyan-500/30 bg-slate-50 dark:bg-white/5 p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            <span>Create Career Action Task</span>
          </h4>

          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve 3 LeetCode Graph problems in C++"
              className="w-full rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Data Structures">Data Structures</option>
                <option value="AI/ML">AI/ML</option>
                <option value="GitHub">GitHub & Projects</option>
                <option value="Databases">Databases / SQL</option>
                <option value="Resume">Resume / Portfolio</option>
                <option value="General">General Career</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              Save Mission Task
            </button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-white/10 pb-3">
        <Filter className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1">Filter:</span>
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
              filter === f
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No {filter} career tasks found. Click "Add Task" to create one!
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                t.completed
                  ? 'bg-slate-100/50 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 opacity-70'
                  : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id)}
                  className="mt-0.5 text-cyan-500 hover:text-cyan-400 transition-colors shrink-0 cursor-pointer"
                >
                  {t.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400 hover:text-cyan-500" />
                  )}
                </button>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold leading-snug ${
                      t.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {t.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold">
                      {t.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        t.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : t.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      <Flag className="h-2.5 w-2.5" />
                      <span>{t.priority}</span>
                    </span>

                    {t.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5 text-slate-400" />
                        <span>Due {t.dueDate}</span>
                      </span>
                    )}
                  </div>

                  {t.notes && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 italic">
                      "{t.notes}"
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
