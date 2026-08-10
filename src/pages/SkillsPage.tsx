import React, { useState } from 'react';
import { Cpu, Plus, Search, Trash2, Edit3, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Modal } from '../components/Modal';
import { Skill, SkillCategory, ProficiencyLevel } from '../types';
import { getProficiencyScore } from '../utils/formatters';

interface SkillsPageProps {
  skills: Skill[];
  onAddSkill: (skill: Skill) => void;
  onUpdateSkill: (skill: Skill) => void;
  onDeleteSkill: (id: string) => void;
  id?: string;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
  skills,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  id,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [numericScore, setNumericScore] = useState<number>(80);
  const [notes, setNotes] = useState('');

  const categories: (SkillCategory | 'All')[] = [
    'All',
    'Programming',
    'AI/ML',
    'Web Development',
    'Databases',
    'Data Structures',
    'Tools',
    'Soft Skills',
  ];

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setName('');
    setCategory('Programming');
    setProficiency('Intermediate');
    setNumericScore(80);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Skill) => {
    setEditingSkill(s);
    setName(s.name);
    setCategory(s.category);
    setProficiency(s.proficiency);
    setNumericScore(s.numericScore);
    setNotes(s.notes || '');
    setIsModalOpen(true);
  };

  const handleProficiencyChange = (p: ProficiencyLevel) => {
    setProficiency(p);
    setNumericScore(getProficiencyScore(p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSkill) {
      onUpdateSkill({
        ...editingSkill,
        name,
        category,
        proficiency,
        numericScore,
        notes,
      });
    } else {
      onAddSkill({
        id: `sk-${Date.now()}`,
        name,
        category,
        proficiency,
        numericScore,
        notes,
      });
    }

    setIsModalOpen(false);
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-500" />
            <span>Skills Radar & Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track, update, and refine your technical capabilities and proficiency ratings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full rounded-xl bg-white dark:bg-slate-800/60 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <GlassCard glow="none" className="p-12 text-center">
          <Cpu className="mx-auto h-12 w-12 text-slate-400 opacity-50 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No skills found</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            No skill matches your current category filter or search terms.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 text-white px-4 py-2 text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Skill</span>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => {
            const badgeColor =
              s.proficiency === 'Advanced'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : s.proficiency === 'Intermediate'
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                : s.proficiency === 'Basic'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

            return (
              <GlassCard key={s.id} glow="cyan" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {s.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSkill(s.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${badgeColor}`}>
                      {s.proficiency}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {s.numericScore}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${s.numericScore}%` }}
                    />
                  </div>

                  {s.notes && (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {s.notes}
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        subtitle="Define proficiency levels and category parameters"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. C++, PyTorch, SQL"
              required
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="Programming">Programming</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Web Development">Web Development</option>
              <option value="Databases">Databases</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Tools">Tools</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Proficiency Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Beginner', 'Basic', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => handleProficiencyChange(lvl)}
                  className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                    proficiency === lvl
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Custom Numeric Score
              </label>
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                {numericScore}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={numericScore}
              onChange={(e) => setNumericScore(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Key Topics
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. STL, memory management, fstream"
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
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
