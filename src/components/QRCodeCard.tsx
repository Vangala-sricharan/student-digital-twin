import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface QRCodeCardProps {
  profile: StudentProfile;
  overallScore: number;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ profile, overallScore }) => {
  const [copied, setCopied] = useState(false);
  const slug = profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const publicUrl = `${window.location.origin}/#twin-${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG QR Code rendering simulation for Public Twin sharing
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#080E1A]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Public Digital Twin & Share Card</span>
              <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                V3 QR Code
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Share your verified student capabilities with recruiters and universities
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-slate-900 via-[#070D19] to-slate-950 p-5 rounded-xl border border-cyan-500/20 text-white">
        {/* QR Code Visual */}
        <div className="p-3 bg-white rounded-xl shadow-lg shrink-0 text-slate-900 flex flex-col items-center">
          <svg className="h-28 w-28" viewBox="0 0 100 100" fill="none">
            {/* Outer corners */}
            <rect x="5" y="5" width="28" height="28" rx="4" fill="#000" />
            <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
            <rect x="13" y="13" width="12" height="12" rx="1" fill="#000" />

            <rect x="67" y="5" width="28" height="28" rx="4" fill="#000" />
            <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
            <rect x="75" y="13" width="12" height="12" rx="1" fill="#000" />

            <rect x="5" y="67" width="28" height="28" rx="4" fill="#000" />
            <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
            <rect x="13" y="75" width="12" height="12" rx="1" fill="#000" />

            {/* Pattern Dots */}
            <rect x="40" y="10" width="8" height="8" fill="#06b6d4" />
            <rect x="52" y="10" width="8" height="8" fill="#000" />
            <rect x="40" y="22" width="8" height="8" fill="#000" />
            <rect x="40" y="40" width="8" height="8" fill="#000" />
            <rect x="52" y="40" width="8" height="8" fill="#06b6d4" />
            <rect x="64" y="40" width="8" height="8" fill="#000" />
            <rect x="22" y="40" width="8" height="8" fill="#000" />
            <rect x="10" y="52" width="8" height="8" fill="#000" />
            <rect x="22" y="52" width="8" height="8" fill="#06b6d4" />
            <rect x="40" y="52" width="8" height="8" fill="#000" />
            <rect x="52" y="52" width="8" height="8" fill="#000" />
            <rect x="76" y="52" width="8" height="8" fill="#000" />
            <rect x="40" y="64" width="8" height="8" fill="#06b6d4" />
            <rect x="64" y="64" width="8" height="8" fill="#000" />
            <rect x="52" y="76" width="8" height="8" fill="#000" />
            <rect x="64" y="76" width="8" height="8" fill="#06b6d4" />
            <rect x="76" y="76" width="8" height="8" fill="#000" />
            <rect x="40" y="84" width="8" height="8" fill="#000" />
            <rect x="76" y="84" width="8" height="8" fill="#000" />
          </svg>
          <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase">
            SCAN DIGITAL TWIN
          </span>
        </div>

        {/* Digital Twin Summary Card */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">{profile.name}</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>

          <p className="text-xs text-slate-300">
            {profile.degree} ({profile.branch}) • {profile.university}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Readiness: {overallScore}%</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-semibold">
              Goal: {profile.careerGoal}
            </div>
          </div>

          <p className="text-[11px] font-mono text-cyan-400/80 truncate pt-1">
            {publicUrl}
          </p>
        </div>
      </div>
    </div>
  );
};
