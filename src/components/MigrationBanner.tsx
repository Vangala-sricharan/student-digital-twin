import React, { useState } from 'react';
import { CloudUpload, CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DigitalTwinState } from '../types';

interface MigrationBannerProps {
  localState: DigitalTwinState;
  onMigrationComplete: () => void;
}

export const MigrationBanner: React.FC<MigrationBannerProps> = ({
  localState,
  onMigrationComplete,
}) => {
  const { user, migrateV2LocalDataToCloud } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) return null;

  const handleMigrate = async () => {
    setMigrating(true);
    const res = await migrateV2LocalDataToCloud(localState);
    setResult(res);
    setMigrating(false);
    if (res.success) {
      setTimeout(() => {
        onMigrationComplete();
        setDismissed(true);
      }, 1500);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-slate-900/40 to-cyan-500/10 p-4 sm:p-5 backdrop-blur-xl text-slate-900 dark:text-white shadow-xl relative animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <CloudUpload className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Migrate V2 Digital Twin to Cloud
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                V3 Upgrade
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              We detected local Digital Twin data for <span className="font-semibold text-cyan-600 dark:text-cyan-400">{localState.profile.name}</span> ({localState.skills.length} skills, {localState.projects.length} projects). Sync it securely to your Supabase cloud account!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {result?.success ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" />
              <span>{result.message}</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setDismissed(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Keep Local Only
              </button>
              <button
                onClick={handleMigrate}
                disabled={migrating}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {migrating ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Migrate to Cloud</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
