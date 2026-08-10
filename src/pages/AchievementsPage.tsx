import React, { useState } from 'react';
import { Trophy, Plus, ExternalLink, Trash2, Edit3, Award, Calendar, Building2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Modal } from '../components/Modal';
import { Achievement, AchievementType } from '../types';

interface AchievementsPageProps {
  achievements: Achievement[];
  onAddAchievement: (ach: Achievement) => void;
  onUpdateAchievement: (ach: Achievement) => void;
  onDeleteAchievement: (id: string) => void;
  id?: string;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  onAddAchievement,
  onUpdateAchievement,
  onDeleteAchievement,
  id,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<AchievementType>('Event');
  const [description, setDescription] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const handleOpenAdd = () => {
    setEditingAch(null);
    setTitle('');
    setOrganization('Marwadi University');
    setDate('2026');
    setType('Event');
    setDescription('');
    setCredentialUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Achievement) => {
    setEditingAch(a);
    setTitle(a.title);
    setOrganization(a.organization);
    setDate(a.date);
    setType(a.type);
    setDescription(a.description);
    setCredentialUrl(a.credentialUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingAch) {
      onUpdateAchievement({
        ...editingAch,
        title,
        organization,
        date,
        type,
        description,
        credentialUrl: credentialUrl.trim() || undefined,
      });
    } else {
      onAddAchievement({
        id: `ach-${Date.now()}`,
        title,
        organization,
        date,
        type,
        description,
        credentialUrl: credentialUrl.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <span>Achievements & Academic Activities</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log AI summits, hackathons, prompt engineering contests, workshops, and achievements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Activity / Certificate</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          return (
            <GlassCard key={ach.id} glow="amber" className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-bold shrink-0 border border-amber-500/20">
                    <Award className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ach)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAchievement(ach.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold border border-amber-500/20">
                    {ach.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {ach.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{ach.organization}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{ach.date}</span>
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {ach.credentialUrl && (
                <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <span>View Credential</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAch ? 'Edit Achievement' : 'Add Activity / Achievement'}
        subtitle="Log hackathons, summits, certificates, and university activities"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title / Event Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Sparks '26 or Prompt Wars"
              required
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Event Host
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Marwadi University"
                required
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AchievementType)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="Event">Event</option>
                <option value="Competition">Competition</option>
                <option value="Workshop">Workshop</option>
                <option value="Certificate">Certificate</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Internship">Internship</option>
                <option value="Award">Award</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date / Period
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. August 2026"
                required
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Credential URL (optional)
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe participation details, key takeaways..."
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
              {editingAch ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
