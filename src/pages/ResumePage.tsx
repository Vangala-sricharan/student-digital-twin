import React, { useState } from 'react';
import { FileText, CheckSquare, Square, Sparkles, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScoreRing } from '../components/ScoreRing';
import { ResumeCheckitem, StudentProfile, Project, Skill } from '../types';

interface ResumePageProps {
  checklist: ResumeCheckitem[];
  onToggleCheckitem: (id: string) => void;
  profile: StudentProfile;
  projects: Project[];
  skills: Skill[];
  id?: string;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  checklist,
  onToggleCheckitem,
  profile,
  projects,
  skills,
  id,
}) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const checkedCount = checklist.filter((i) => i.checked).length;
  const resumeScore = Math.round((checkedCount / checklist.length) * 100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-cyan-500" />
          <span>Resume Lab & Readiness Analyzer</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Evaluate resume completeness, technical project representation, and recruiter visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Score Ring */}
        <GlassCard glow="cyan" className="p-6 flex flex-col items-center justify-center text-center">
          <ScoreRing
            score={resumeScore}
            size={180}
            label="Resume Readiness"
            subLabel={`${checkedCount} of ${checklist.length} Checkpoints Cleared`}
          />

          <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Education Section:</span>
              <span className="font-bold text-emerald-500">B.Tech CSE AI/ML</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Projects Included:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{projects.length} C++ Systems</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GitHub Link:</span>
              <span className={`font-bold ${profile.gitHub ? 'text-emerald-500' : 'text-amber-500'}`}>
                {profile.gitHub ? 'Linked' : 'Missing'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Right 2 Columns: Upload & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Upload Box */}
          <GlassCard glow="none" className="p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4 text-cyan-500" />
              <span>Resume File Storage & Metadata</span>
            </h2>

            <div className="mt-3 p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-100/40 dark:bg-slate-800/30">
              <input
                type="file"
                id="resume-upload-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="resume-upload-input" className="cursor-pointer block">
                <FileText className="mx-auto h-8 w-8 text-cyan-500 mb-2" />
                {uploadedFileName ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Loaded: {uploadedFileName}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Click to attach or drag resume PDF
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF, DOCX up to 5MB (Stored locally in browser state)
                    </p>
                  </>
                )}
              </label>
            </div>
          </GlassCard>

          {/* Resume Completeness Checklist */}
          <GlassCard glow="blue" className="p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Resume Checklist & Quality Standard
            </h2>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleCheckitem(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    item.checked
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 text-slate-900 dark:text-white'
                      : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.checked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
