import React from 'react';
import { Github, ExternalLink, CheckCircle2, AlertCircle, Code, GitBranch, FolderGit2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { StudentProfile, Project, Skill } from '../types';

interface GitHubPageProps {
  profile: StudentProfile;
  projects: Project[];
  skills: Skill[];
  onUpdateProfile: (p: StudentProfile) => void;
  id?: string;
}

export const GitHubPage: React.FC<GitHubPageProps> = ({
  profile,
  projects,
  skills,
  onUpdateProfile,
  id,
}) => {
  const projectsWithRepos = projects.filter((p) => p.githubUrl && p.githubUrl.trim().length > 0);

  // Calculate GitHub score
  let score = 30;
  if (profile.gitHub && profile.gitHub.trim().length > 0) score += 30;
  score += Math.min(30, projectsWithRepos.length * 15);
  const gitSkill = skills.find((s) => s.name.toLowerCase().includes('git'));
  if (gitSkill) score = Math.round((score + gitSkill.numericScore) / 2);
  score = Math.min(100, Math.max(25, score));

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Github className="h-6 w-6 text-cyan-500" />
          <span>GitHub Studio & Code Presence</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track repository links, code commit representation, and GitHub profile readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Score Ring */}
        <GlassCard glow="cyan" className="p-6 flex flex-col items-center justify-center text-center">
          <ScoreRing
            score={score}
            size={180}
            label="GitHub Readiness"
            subLabel={profile.gitHub ? 'Profile Linked' : 'Profile Missing'}
          />

          <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Linked Repositories:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{projectsWithRepos.length} / {projects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Git / GitHub Tools:</span>
              <span className="font-bold text-emerald-500">Intermediate</span>
            </div>
          </div>
        </GlassCard>

        {/* Right 2 Columns: Profile Link & Repo Status */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard glow="none" className="p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Github className="h-4 w-4 text-slate-800 dark:text-white" />
              <span>GitHub Account Link</span>
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="url"
                value={profile.gitHub}
                onChange={(e) => onUpdateProfile({ ...profile, gitHub: e.target.value })}
                placeholder="https://github.com/username"
                className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              {profile.gitHub ? (
                <a
                  href={profile.gitHub}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                >
                  <span>Visit</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-xs font-bold text-amber-500 shrink-0">Enter Link</span>
              )}
            </div>
          </GlassCard>

          {/* Repositories Checklist */}
          <GlassCard glow="blue" className="p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-cyan-500" />
              <span>Project Repositories Checklist</span>
            </h2>

            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{proj.name}</h3>
                    <p className="text-[11px] text-slate-400">{proj.technologies.join(', ')}</p>
                  </div>

                  {proj.githubUrl ? (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Repo Link</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-amber-500 font-medium">
                      GitHub link not added
                    </span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
