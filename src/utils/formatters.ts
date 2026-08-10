/**
 * Utility formatters for Indian Rupees and standard display formatting
 */

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberIN(amount: number): string {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function getProficiencyScore(level: string): number {
  switch (level) {
    case 'Beginner':
      return 35;
    case 'Basic':
      return 60;
    case 'Intermediate':
      return 80;
    case 'Advanced':
      return 95;
    default:
      return 50;
  }
}

export function getScoreBadgeColor(score: number): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500 to-teal-400',
    };
  }
  if (score >= 65) {
    return {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/30',
      gradient: 'from-cyan-500 to-blue-500',
    };
  }
  if (score >= 50) {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500 to-yellow-400',
    };
  }
  return {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    gradient: 'from-rose-500 to-pink-500',
  };
}
