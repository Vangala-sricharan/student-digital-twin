import React from 'react';
import { Cloud, CloudCheck, CloudOff, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CloudSyncIndicatorProps {
  onOpenAuth: () => void;
  compact?: boolean;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  onOpenAuth,
  compact = false,
}) => {
  const { user, cloudSyncStatus, isCloudConfigured } = useAuth();

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        title="Connect Supabase Cloud Account to sync across devices"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 dark:bg-[#0B1626] border border-slate-200 dark:border-sky-500/30 text-slate-800 dark:text-[#F5F9FF] hover:bg-slate-200 dark:hover:bg-[#101D30] hover:text-cyan-600 dark:hover:text-cyan-300 active:scale-95 text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      >
        <LogIn className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span className={compact ? 'hidden sm:inline' : 'inline'}>
          {isCloudConfigured ? 'Sign In / Cloud Sync' : 'Local Mode'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={onOpenAuth}
        title={`Signed in as ${user.email} (${cloudSyncStatus})`}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold cursor-pointer"
      >
        {cloudSyncStatus === 'saving' ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
        ) : cloudSyncStatus === 'error' ? (
          <CloudOff className="h-3.5 w-3.5 text-rose-500" />
        ) : (
          <CloudCheck className="h-3.5 w-3.5 text-emerald-500" />
        )}
        <span className={compact ? 'hidden sm:inline' : 'inline'}>
          {cloudSyncStatus === 'saving'
            ? 'Saving...'
            : cloudSyncStatus === 'error'
            ? 'Sync Error'
            : '☁ Cloud Connected'}
        </span>
      </div>
    </div>
  );
};
