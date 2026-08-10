import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: 'blue' | 'cyan' | 'teal' | 'emerald' | 'amber' | 'indigo' | 'none';
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glow = 'none',
  onClick,
  id,
}) => {
  const glowMap = {
    none: '',
    blue: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
    cyan: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
    teal: 'hover:border-teal-500/40 hover:shadow-teal-500/10',
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    indigo: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/80 dark:bg-white/5
        backdrop-blur-xl
        border border-slate-200/80 dark:border-white/10
        shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/30
        transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-white/[0.08] dark:hover:border-white/20' : ''}
        ${glowMap[glow]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Background ambient lighting subtle reflection */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
