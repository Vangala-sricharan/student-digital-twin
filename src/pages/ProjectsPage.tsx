import React, { useState } from 'react';
import { FolderGit2, Plus, Search, ExternalLink, Github, Trash2, Edit3, Calendar, Layers } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Modal } from '../components/Modal';
import { Project, ProjectStatus, ProjectDifficulty } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  id?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  id,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectStatus>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Completed');
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>('Intermediate');
  const [completionDate, setCompletionDate] = useState('');

  const handleOpenAdd = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setTechInput('C++, OOP, File Handling');
    setSkillsInput('Classes, File Streams, Arrays');
    setGithubUrl('');
    setLiveUrl('');
    setStatus('Completed');
    setDifficulty('Intermediate');
    setCompletionDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setTechInput(p.technologies.join(', '));
    setSkillsInput(p.skills.join(', '));
    setGithubUrl(p.githubUrl || '');
    setLiveUrl(p.liveUrl || '');
    setStatus(p.status);
    setDifficulty(p.difficulty);
    setCompletionDate(p.completionDate || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingProject) {
      onUpdateProject({
        ...editingProject,
        name,
        description,
        technologies,
        skills,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        status,
        difficulty,
        completionDate: completionDate.trim() || undefined,
      });
    } else {
      onAddProject({
        id: `proj-${Date.now()}`,
        name,
        description,
        technologies,
        skills,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        status,
        difficulty,
        completionDate: completionDate.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-cyan-500" />
            <span>Project Vault & Systems Portfolio</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase C++ systems, POS applications, DBMS projects, and software engineering solutions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {(['All', 'Planned', 'In Progress', 'Completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or tech..."
            className="w-full rounded-xl bg-white dark:bg-slate-800/60 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <GlassCard glow="none" className="p-12 text-center">
          <FolderGit2 className="mx-auto h-12 w-12 text-slate-400 opacity-50 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Start by adding your C++, AI/ML, or Web development projects.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 text-white px-4 py-2 text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const statusBadge =
              proj.status === 'Completed'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : proj.status === 'In Progress'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

            return (
              <GlassCard key={proj.id} glow="blue" className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{proj.name}</h3>
                      {proj.completionDate && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>{proj.completionDate}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 text-[11px] font-mono font-semibold border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {proj.skills && proj.skills.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Skills Demonstrated
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {proj.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusBadge}`}>
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {proj.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {proj.githubUrl ? (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Repository</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-amber-500/80 italic font-medium">
                        GitHub link not added
                      </span>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        subtitle="Document project tech stack, skills learned, and source links"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. C++ Restaurant POS System"
              required
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe key features, billing logic, file handling..."
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="C++, OOP, File Handling, GST Engine"
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skills Demonstrated (comma-separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Classes & Objects, Arrays, Billing Logic"
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ProjectDifficulty)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Completion Date
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
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
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
