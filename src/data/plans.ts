import { PlanType } from '../context/SubscriptionContext';

export interface PlanConfig {
  id: PlanType;
  nameKey: string;
  name: string;
  priceDisplayKey: string;
  priceDisplay: string;
  amount: number; // in INR e.g. 0, 499, 3999
  billingPeriod: string;
  popular?: boolean;
  savingsBadge?: string;
  description: string;
  features: string[];
}

export const UPI_PAYEE_ID = '9391700862@ybl';
export const UPI_PAYEE_NAME = 'Student Digital Twin';

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: {
    id: 'free',
    nameKey: 'plan_free',
    name: 'Free Plan',
    priceDisplayKey: 'price_free',
    priceDisplay: '₹0',
    amount: 0,
    billingPeriod: 'Forever',
    description: 'Core Digital Twin tracking, skills matrix, projects, and basic readiness score.',
    features: [
      'Deterministic Career Readiness Score',
      'Skill Gaps & Category Breakdown',
      'Projects & Resume Checklist',
    ],
  },
  pro: {
    id: 'pro',
    nameKey: 'plan_pro',
    name: 'Pro Plan',
    priceDisplayKey: 'price_pro_monthly',
    priceDisplay: '₹499',
    amount: 499,
    billingPeriod: 'Monthly',
    popular: true,
    description: 'Full access to all AI systems, resume & syllabus analyzers, and internship readiness analytics.',
    features: [
      'Unlimited Gemini AI Career Assistant',
      'AI Resume & Syllabus Analyzers',
      'AI Project & GitHub Analyzer',
      'Internship Readiness & Simulator',
    ],
  },
  pro_annual: {
    id: 'pro_annual',
    nameKey: 'plan_pro_annual',
    name: 'Pro Annual',
    priceDisplayKey: 'price_pro_annual',
    priceDisplay: '₹3,999',
    amount: 3999,
    billingPeriod: 'Annual',
    savingsBadge: 'SAVE 33%',
    description: 'Best value for 2nd and 3rd year engineering students aiming for long-term career readiness.',
    features: [
      'Everything in Pro Plan',
      'Priority AI Response Speed',
      'JSON Portfolio Backup & Restore',
    ],
  },
};

export function generateUPIUri(amount: number): string {
  if (!amount || amount <= 0) return '';
  const encodedName = encodeURIComponent(UPI_PAYEE_NAME);
  return `upi://pay?pa=${UPI_PAYEE_ID}&pn=${encodedName}&am=${amount}&cu=INR`;
}

export function validateUPIUri(uri: string, expectedAmount: number): boolean {
  if (!uri) return false;
  const hasPA = uri.includes(`pa=${UPI_PAYEE_ID}`);
  const hasPN = uri.includes('pn=Student%20Digital%20Twin');
  const hasAM = uri.includes(`am=${expectedAmount}`);
  const hasCU = uri.includes('cu=INR');
  return hasPA && hasPN && hasAM && hasCU;
}
