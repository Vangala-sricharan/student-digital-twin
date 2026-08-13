import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  setDemoMode: (active: boolean) => void;
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
  const { user } = useAuth();

  const [plan, setPlanState] = useState<PlanType>('free');
  const [demoMode, setDemoModeState] = useState<boolean>(false);

  // Sync user-isolated plan & demo mode whenever authenticated user changes
  useEffect(() => {
    if (user && user.id) {
      // Authenticated user MUST NOT inherit creator/demo mode
      setDemoModeState(false);
      try {
        localStorage.setItem(DEMO_MODE_KEY, 'false');
      } catch (e) {}

      // Look up user-specific saved plan ONLY
      const userPlanKey = `${PLAN_STORAGE_KEY}_user_${user.id}`;
      const savedUserPlan = localStorage.getItem(userPlanKey);

      if (savedUserPlan === 'pro' || savedUserPlan === 'pro_annual') {
        setPlanState(savedUserPlan);
      } else {
        // ABSOLUTE RULE: All newly authenticated users MUST start on FREE plan (₹0 forever)
        setPlanState('free');
        try {
          localStorage.setItem(userPlanKey, 'free');
        } catch (e) {}
      }
    } else {
      // Unauthenticated / Guest state defaults to FREE plan
      setDemoModeState(false);
      const guestPlan = localStorage.getItem(`${PLAN_STORAGE_KEY}_guest`);
      if (guestPlan === 'pro' || guestPlan === 'pro_annual') {
        setPlanState(guestPlan);
      } else {
        setPlanState('free');
      }
    }
  }, [user?.id]);

  const setPlan = (newPlan: PlanType) => {
    setPlanState(newPlan);
    try {
      if (user?.id) {
        localStorage.setItem(`${PLAN_STORAGE_KEY}_user_${user.id}`, newPlan);
      } else {
        localStorage.setItem(`${PLAN_STORAGE_KEY}_guest`, newPlan);
      }
    } catch (e) {
      console.error('Failed to save plan', e);
    }
  };

  const setDemoMode = (active: boolean) => {
    if (user) {
      setDemoModeState(false);
      try {
        localStorage.setItem(DEMO_MODE_KEY, 'false');
      } catch (e) {}
      return;
    }
    setDemoModeState(active);
    try {
      localStorage.setItem(DEMO_MODE_KEY, String(active));
    } catch (e) {
      console.error('Failed to save demo mode', e);
    }
  };

  const toggleDemoMode = () => {
    if (user) {
      setDemoModeState(false);
      return;
    }
    const next = !demoMode;
    setDemoMode(next);
  };

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
    } catch (e) {}
    return 0;
  });

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [requiredFeatureForModal, setRequiredFeatureForModal] = useState('Pro AI Suite');

  const triggerUpgradeModal = (featureName = 'Pro AI Feature') => {
    setRequiredFeatureForModal(featureName);
    setUpgradeModalOpen(true);
  };

  const incrementAiUsage = () => {
    setAiUsageCount((prev) => {
      const next = prev + 1;
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(AI_USAGE_KEY, JSON.stringify({ date: today, count: next }));
      } catch (e) {}
      return next;
    });
  };

  // Authenticated user is ONLY Pro if their user-scoped plan is 'pro' or 'pro_annual'
  const isPro = user ? (plan === 'pro' || plan === 'pro_annual') : (plan === 'pro' || plan === 'pro_annual' || demoMode);

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
        demoMode: user ? false : demoMode,
        setDemoMode,
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
