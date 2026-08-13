import React, { useState } from 'react';
import { Settings, RotateCcw, Trash2, Download, Upload, Sun, Moon, CheckCircle2, AlertTriangle, Globe, Zap, Sparkles, User, LogOut, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Modal } from '../components/Modal';
import { DigitalTwinState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';

interface SettingsPageProps {
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  currentState: DigitalTwinState;
  onImportState: (newState: DigitalTwinState) => void;
  id?: string;
  onNavigateToUpgrade?: () => void;
  user?: any | null;
  onSignOut?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onResetDemo,
  onClearAll,
  currentState,
  onImportState,
  id,
  onNavigateToUpgrade,
  user,
  onSignOut,
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { plan, demoMode, toggleDemoMode } = useSubscription();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student_digital_twin_${currentState.profile.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMessage('Digital Twin state exported successfully as JSON!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.profile) {
            onImportState(parsed);
            setSuccessMessage('Digital Twin state imported successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
          } else {
            alert('Invalid JSON structure for Student Digital Twin.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-cyan-500" />
            <span>Settings & Platform Preferences</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize language, visual theme, subscription tier, and backup/restore digital twin states.
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Account & Session Card if Authenticated */}
      {user && onSignOut && (
        <GlassCard className="p-6 space-y-4 border-cyan-500/30">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-500" />
            <span>Account & Authentication Session</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{user.email}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Active Session
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Signed in via {user.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
              </p>
            </div>

            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-500" />
            <span>Language & Region</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interface Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((langOption) => (
                <button
                  key={langOption.code}
                  onClick={() => setLanguage(langOption.code)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    language === langOption.code
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 ring-1 ring-cyan-500/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{langOption.flag}</span>
                  <div className="text-left">
                    <div className="font-bold">{langOption.name}</div>
                    <div className="text-[10px] opacity-70">{langOption.nativeName}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Appearance & Theme */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4 text-cyan-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
            <span>Appearance & Theme Mode</span>
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {theme === 'dark' ? 'Navy & obsidian glass aesthetic' : 'Frosted white light theme'}
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
            >
              Toggle Theme
            </button>
          </div>
        </GlassCard>

        {/* Subscription Plan & Demo Mode */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-500" />
            <span>Subscription Plan & Developer Mode</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Current Tier</span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {plan === 'pro' ? 'Pro Plan (₹499/mo)' : plan === 'pro_annual' ? 'Pro Annual (₹3,999/yr)' : 'Free Plan (₹0)'}
                </h3>
              </div>

              {onNavigateToUpgrade && (
                <button
                  onClick={onNavigateToUpgrade}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                >
                  Manage Plan
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Developer Demo Mode
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Instantly unlocks all Pro AI features for testing
                </p>
              </div>

              <button
                onClick={toggleDemoMode}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  demoMode
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {demoMode ? 'ON (Unlocked)' : 'OFF'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Data Backup & Export */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="h-4 w-4 text-cyan-500" />
            <span>Data Backup & Portability</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Export Digital Twin JSON
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Save complete profile & scores to JSON</p>
              </div>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Import Digital Twin JSON
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Restore profile from external file</p>
              </div>
              <label className="flex items-center gap-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Danger Zone */}
      <GlassCard className="p-6 border-rose-500/20">
        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Reset & Data Management</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Reset Demo Data</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Restores initial hardcoded dataset for Vangala Sricharan (B.Tech CSE AI/ML, Marwadi University).
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-cyan-600 hover:text-white text-slate-700 dark:text-slate-300 py-2 px-4 text-xs font-bold transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Sricharan Baseline</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400">Clear All Data</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Permanently wipes all skills, projects, and achievements from localStorage.
              </p>
            </div>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white py-2 px-4 text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Local Data</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Reset to Demo Data"
        subtitle="This will restore Vangala Sricharan's initial profile dataset"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to reset your Digital Twin state back to the original demo profile for{' '}
            <strong className="text-slate-900 dark:text-white">Vangala Sricharan</strong>?
            Any unsaved custom additions will be replaced.
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onResetDemo();
                setIsResetModalOpen(false);
                setSuccessMessage('Demo data restored successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
              className="rounded-xl bg-cyan-600 text-white px-5 py-2 text-xs font-bold shadow-lg shadow-cyan-600/20"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Confirm Clear All Data"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to permanently clear all profile information, skills, projects, and achievements from browser storage?
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClearAll();
                setIsClearModalOpen(false);
                setSuccessMessage('All data cleared.');
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
              className="rounded-xl bg-rose-600 text-white px-5 py-2 text-xs font-bold shadow-lg shadow-rose-600/20"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
