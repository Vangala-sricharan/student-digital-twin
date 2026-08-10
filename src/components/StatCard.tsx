import React from 'react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'negative';
  glow?: 'blue' | 'cyan' | 'teal' | 'emerald' | 'amber' | 'indigo' | 'none';
  onClick?: () => void;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  trendType = 'positive',
  glow = 'cyan',
  onClick,
  id,
}) => {
  const trendColor = {
    positive: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    neutral: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    negative: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  }[trendType];

  return (
    <GlassCard glow={glow} onClick={onClick} id={id} className="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <h4 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </h4>
          {subtext && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200/60 dark:border-slate-700/60">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${trendColor}`}>
            {trend}
          </span>
        </div>
      )}
    </GlassCard>
  );
};
