import React, { createContext, useContext, useState } from 'react';

export type PlanType = 'free' | 'pro' | 'pro_annual';

export type FeatureKey =
  | 'basic_dashboard'
  | 'profile'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'career_goals'
  | 'progress'
  | 'ai_assistant'
  | 'ai_resume_analyzer'
  | 'ai_syllabus_analyzer'
  | 'ai_project_analyzer'
  | 'ai_roadmap'
  | 'internship_readiness'
  | 'career_simulator'
  | 'advanced_analytics'
  | 'export_import';

interface SubscriptionContextType {
  plan: PlanType;
  setPlan: (plan: PlanType) => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
  canAccess: (feature: FeatureKey | string) => boolean;
  aiUsageCount: number;
  incrementAiUsage: () => void;
  aiLimit: number;
  remainingAiUsage: number;
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
  requiredFeatureForModal: string;
  triggerUpgradeModal: (featureName?: string) => void;
}

const PLAN_STORAGE_KEY = 'student_digital_twin_plan';
const DEMO_MODE_KEY = 'student_digital_twin_demo_mode';
const AI_USAGE_KEY = 'student_digital_twin_ai_usage';

const AI_DAILY_LIMIT_FREE = 3;
const AI_DAILY_LIMIT_PRO = 100;

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlanState] = useState<PlanType>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved === 'free' || saved === 'pro' || saved === 'pro_annual') {
        return saved;
      }
    } catch (e) {
      console.error('Failed to read plan', e);
    }
    return 'pro';
  });

  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DEMO_MODE_KEY);
      if (saved === 'false') return false;
      return true;
    } catch (e) {
      return true; // default demo mode enabled
    }
  });

  const [aiUsageCount, setAiUsageCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(AI_USAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.date === today) {
          return parsed.count || 0;
        }
      }
    } catch (e) {
      // fallback
    }
    return 0;
  });

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [requiredFeatureForModal, setRequiredFeatureForModal] = useState('Pro AI Suite');

  const triggerUpgradeModal = (featureName = 'Pro AI Feature') => {
    setRequiredFeatureForModal(featureName);
    setUpgradeModalOpen(true);
  };

  const setPlan = (newPlan: PlanType) => {
    setPlanState(newPlan);
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, newPlan);
    } catch (e) {
      console.error('Failed to save plan', e);
    }
  };

  const toggleDemoMode = () => {
    const next = !demoMode;
    setDemoModeState(next);
    try {
      localStorage.setItem(DEMO_MODE_KEY, String(next));
    } catch (e) {
      console.error('Failed to save demo mode', e);
    }
  };

  const incrementAiUsage = () => {
    setAiUsageCount((prev) => {
      const next = prev + 1;
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(AI_USAGE_KEY, JSON.stringify({ date: today, count: next }));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const isPro = plan === 'pro' || plan === 'pro_annual' || demoMode;

  const aiLimit = isPro ? AI_DAILY_LIMIT_PRO : AI_DAILY_LIMIT_FREE;
  const remainingAiUsage = Math.max(0, aiLimit - aiUsageCount);

  const canAccess = (feature: FeatureKey | string): boolean => {
    if (isPro) return true;

    const freeFeatures = [
      'basic_dashboard',
      'profile',
      'skills',
      'projects',
      'achievements',
      'career_goals',
      'progress',
      'dashboard',
      'github',
      'settings',
    ];

    if (freeFeatures.includes(feature as string)) {
      return true;
    }

    return false;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan,
        demoMode,
        toggleDemoMode,
        canAccess,
        aiUsageCount,
        incrementAiUsage,
        aiLimit,
        remainingAiUsage,
        upgradeModalOpen,
        setUpgradeModalOpen,
        requiredFeatureForModal,
        triggerUpgradeModal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
