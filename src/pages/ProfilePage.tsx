import React, { useState } from 'react';
import { User, Save, Linkedin, Github, Globe, CheckCircle, GraduationCap, MapPin, Mail, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StudentProfile } from '../types';

interface ProfilePageProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  id?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdateProfile, id }) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-6 w-6 text-cyan-500" />
            <span>My Profile & Digital Identity</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal academic background, contact info, and social profile links.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 border border-emerald-500/20">
            <CheckCircle className="h-4 w-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card Overview */}
        <GlassCard glow="cyan" className="p-6 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-3xl shadow-xl shadow-cyan-500/20">
              {formData.name.charAt(0)}
            </div>
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
            {formData.degree} • {formData.branch}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-cyan-500" />
              {formData.university}
            </span>
            <span>•</span>
            <span>{formData.year}</span>
          </div>

          <div className="mt-6 w-full pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3 text-left text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Mail className="h-4 w-4 text-cyan-500 shrink-0" />
              <span className="truncate">{formData.email || 'Email not added'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>{formData.location || 'Location not added'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Target Role: <strong>{formData.careerGoal}</strong></span>
            </div>
          </div>

          {/* Social Links Badge Buttons */}
          <div className="mt-6 w-full space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <Linkedin className="h-4 w-4 text-blue-500" /> LinkedIn
              </span>
              {formData.linkedIn ? (
                <a href={formData.linkedIn} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline text-[11px] font-bold">
                  Connected
                </a>
              ) : (
                <span className="text-amber-500 font-medium text-[11px]">Add LinkedIn</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <Github className="h-4 w-4 text-slate-800 dark:text-white" /> GitHub
              </span>
              {formData.gitHub ? (
                <a href={formData.gitHub} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline text-[11px] font-bold">
                  Connected
                </a>
              ) : (
                <span className="text-amber-500 font-medium text-[11px]">Add GitHub</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <Globe className="h-4 w-4 text-emerald-500" /> Portfolio
              </span>
              {formData.portfolio ? (
                <a href={formData.portfolio} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline text-[11px] font-bold">
                  Connected
                </a>
              ) : (
                <span className="text-amber-500 font-medium text-[11px]">Add Portfolio</span>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Right 2 Columns: Editable Form */}
        <GlassCard glow="none" className="lg:col-span-2 p-6 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
            Edit Academic & Personal Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Degree Program
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                CGPA
              </label>
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="Not added"
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Career Goal
              </label>
              <input
                type="text"
                name="careerGoal"
                value={formData.careerGoal}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Professional Bio & Academic Focus
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-6 mb-3">
            Social & Professional Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                name="gitHub"
                value={formData.gitHub}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Portfolio URL
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};
