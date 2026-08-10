import React from 'react';
import { motion } from 'motion/react';

interface ScoreRingProps {
  score: number; // 0 - 100
  size?: number; // width/height in px
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  id?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = 'Career Readiness',
  subLabel,
  id,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Gradient color selection based on score
  const getGradientColors = () => {
    if (score >= 80) return { start: '#10b981', end: '#06b6d4' }; // emerald -> cyan
    if (score >= 65) return { start: '#06b6d4', end: '#3b82f6' }; // cyan -> blue
    if (score >= 50) return { start: '#f59e0b', end: '#10b981' }; // amber -> emerald
    return { start: '#f43f5e', end: '#f59e0b' }; // rose -> amber
  };

  const colors = getGradientColors();
  const gradientId = `score-ring-grad-${id || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div id={id} className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800/80"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            {score}
          </motion.span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-3 text-center">
          <h3 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
            {label}
          </h3>
          {subLabel && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subLabel}</p>
          )}
        </div>
      )}
    </div>
  );
};
