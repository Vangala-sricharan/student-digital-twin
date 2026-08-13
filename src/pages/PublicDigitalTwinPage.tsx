import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Github, Linkedin, Mail, ExternalLink, ArrowLeft, Award, FolderGit2, CheckCircle2, FileText, RefreshCw } from 'lucide-react';
import { DigitalTwinState, StudentRecord } from '../types';
import { QRCodeCard } from '../components/QRCodeCard';
import { generateStudentPDF } from '../utils/pdfGenerator';

interface PublicDigitalTwinPageProps {
  state: DigitalTwinState;
  overallScore: number;
  onBackToApp: () => void;
}

export const PublicDigitalTwinPage: React.FC<PublicDigitalTwinPageProps> = ({
  state,
  overallScore,
  onBackToApp,
}) => {
  const { profile, skills, projects, achievements } = state;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const studentRecord: StudentRecord = {
        id: `rec-${Date.now()}`,
        ...state,
      };
      await generateStudentPDF(studentRecord);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D19] text-white p-4 sm:p-6 lg:p-12 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-cyan-400 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to App Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isGeneratingPDF ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-black tracking-wider uppercase text-cyan-400">
              Student Digital Twin V3 Verified
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Student Profile Hero Header Card */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-[#0C1322] to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
              </div>

              <p className="text-sm font-semibold text-cyan-400 mb-1">
                {profile.degree} ({profile.branch}) • {profile.university}
              </p>

              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-2">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
                <span>📍 {profile.location}</span>
                <span>🎓 {profile.year} ({profile.semester})</span>
                <span>🎯 Goal: <strong className="text-white">{profile.careerGoal}</strong></span>
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center shrink-0 w-full md:w-44">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
                Verified Career Readiness
              </span>
              <span className="text-4xl font-black text-white leading-none mb-1">
                {overallScore}%
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Industry Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <QRCodeCard profile={profile} overallScore={overallScore} />

        {/* Core Skills Matrix */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>Verified Technical Skills</span>
            <span className="text-xs font-normal text-slate-400">({skills.length} tracked)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white truncate">{skill.name}</span>
                  <span className="text-[10px] font-extrabold text-cyan-400">{skill.numericScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${skill.numericScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Showcase */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            <span>Featured Technical Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white">{proj.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & Certifications */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <span>Verified Achievements & Competitions</span>
          </h2>

          <div className="space-y-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">{ach.title}</h3>
                  <p className="text-[11px] text-cyan-400 font-medium">{ach.organization} • {ach.date}</p>
                  <p className="text-xs text-slate-300 mt-1">{ach.description}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-cyan-500/20 text-cyan-300 shrink-0">
                  {ach.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
