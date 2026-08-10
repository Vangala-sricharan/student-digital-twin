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
    blue: 'hover:border-blue-500/40 hover:shadow-blue-500/15',
    cyan: 'hover:border-cyan-500/40 hover:shadow-cyan-500/15',
    teal: 'hover:border-teal-500/40 hover:shadow-teal-500/15',
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/15',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/15',
    indigo: 'hover:border-indigo-500/40 hover:shadow-indigo-500/15',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/80 dark:bg-slate-900/60
        backdrop-blur-2xl
        border border-sky-100/90 dark:border-white/10
        shadow-lg shadow-sky-900/5 dark:shadow-2xl dark:shadow-black/50
        transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/12 hover:bg-white/95 dark:hover:bg-slate-800/70 hover:border-sky-300/80 dark:hover:border-cyan-500/30' : ''}
        ${glowMap[glow]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Background ambient lighting subtle glass reflection */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-600/10 dark:bg-blue-600/15 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
