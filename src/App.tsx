/**
 * Student Digital Twin V2 — Personal Career Readiness Operating System
 * Student Identity: Vangala Sricharan
 * Institution: Marwadi University (B.Tech CSE - AI/ML)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  Skill,
  Project,
  Achievement,
  ProgressSnapshot,
  DigitalTwinState,
  StudentRecord,
  MultiStudentState,
} from './types';
import {
  loadMultiStudentState,
  saveMultiStudentState,
  resetToDemoData,
  clearAllData,
  DEFAULT_SRICHARAN_RECORD,
} from './services/storage';
import { calculateCareerReadiness } from './services/scoringEngine';

import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { useAuth } from './context/AuthContext';

import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';
import { MigrationBanner } from './components/MigrationBanner';
import { ActionPlanner } from './components/ActionPlanner';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { PublicDigitalTwinPage } from './pages/PublicDigitalTwinPage';

import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { StudentProfilesPage } from './pages/StudentProfilesPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { CareerGoalsPage } from './pages/CareerGoalsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ResumePage } from './pages/ResumePage';
import { GitHubPage } from './pages/GitHubPage';
import { AILabPage } from './pages/AILabPage';
import { SettingsPage } from './pages/SettingsPage';

// V2 AI Feature Pages
import { AICareerAssistantPage } from './pages/AICareerAssistantPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SyllabusAnalyzerPage } from './pages/SyllabusAnalyzerPage';
import { ProjectAnalyzerPage } from './pages/ProjectAnalyzerPage';
import { AIRoadmapPage } from './pages/AIRoadmapPage';
import { InternshipReadinessPage } from './pages/InternshipReadinessPage';
import { CareerSimulatorPage } from './pages/CareerSimulatorPage';
import { UpgradePage } from './pages/UpgradePage';

import { PlayCircle, LogIn, UserPlus, Sparkles, LogOut, Shield } from 'lucide-react';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'signin' | 'signup'>('signin');

  // Demo session state: when user clicks "Try Demo"
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);
  // Onboarding state for new user
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  const { canAccess, upgradeModalOpen, setUpgradeModalOpen, requiredFeatureForModal, setDemoMode } = useSubscription();
  const { user, fetchCloudState, saveCloudState, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [multiState, setMultiState] = useState<MultiStudentState>(() => loadMultiStudentState(user?.id));

  // Sync demoMode in SubscriptionContext whenever isDemoSession or user changes
  useEffect(() => {
    if (user) {
      if (isDemoSession) {
        setIsDemoSession(false);
      }
      setDemoMode(false);
    } else {
      setDemoMode(isDemoSession);
    }
  }, [user, isDemoSession, setDemoMode]);

  // Helper to create a clean blank StudentRecord for new authenticated users
  const createBlankUserRecord = (email: string, fullName?: string): StudentRecord => {
    const displayName = fullName && fullName.trim() !== '' ? fullName : email ? email.split('@')[0] : 'Student User';
    return {
      id: `usr-${Date.now()}`,
      profile: {
        name: displayName,
        degree: 'B.Tech',
        branch: 'Computer Science',
        university: '',
        year: '1st Year',
        semester: '1st Semester',
        cgpa: '',
        careerGoal: 'Software Engineer',
        bio: '',
        linkedIn: '',
        gitHub: '',
        portfolio: '',
        email: email,
        location: '',
        academicFocus: [],
      },
      skills: [],
      projects: [],
      achievements: [],
      activeCareerGoalId: 'cg-swe',
      careerGoals: [
        {
          id: 'cg-swe',
          title: 'Software Engineer',
          description: 'Build robust software applications and systems.',
          targetSkills: { DataStructures: 70, Algorithms: 70, SystemDesign: 60 },
          recommendedCourses: ['Data Structures & Algorithms', 'System Design Fundamentals'],
        },
      ],
      progressHistory: [
        {
          id: `p-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          overallScore: 0,
          categoryScores: { skills: 0, projects: 0, academics: 0, achievements: 0 },
          note: 'Initial Student Twin initialized',
        },
      ],
      resumeChecklist: [],
      customRecommendations: [],
      tasks: [],
    };
  };

  // Sign out handler - complete state reset
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsDemoSession(false);
      setNeedsOnboarding(false);
      setMultiState(loadMultiStudentState(undefined));
      setActiveTab('dashboard');
    }
  };

  // Load Cloud State when user logs in or switches accounts
  useEffect(() => {
    if (user) {
      setIsDemoSession(false);
      // Immediately reset local state to user-scoped storage to prevent rendering another user's profiles
      const userLocal = loadMultiStudentState(user.id);
      setMultiState(userLocal);

      fetchCloudState().then((cloudData) => {
        if (
          cloudData &&
          cloudData.profile &&
          cloudData.profile.name &&
          cloudData.profile.name.trim() !== '' &&
          cloudData.profile.name !== 'Student User'
        ) {
          // Existing user with saved cloud profile
          setNeedsOnboarding(false);
          const cloudRecord: StudentRecord = {
            id: `usr-${user.id}`,
            ...cloudData,
          };
          const cloudMulti = {
            students: [cloudRecord],
            activeStudentId: cloudRecord.id,
          };
          setMultiState(cloudMulti);
          saveMultiStudentState(cloudMulti, user.id);
        } else {
          // Check if local user-scoped record exists
          const existing = loadMultiStudentState(user.id);
          if (
            existing &&
            existing.students &&
            existing.students.length > 0 &&
            existing.students[0].profile.name !== 'Student User'
          ) {
            setMultiState(existing);
            setNeedsOnboarding(false);
          } else {
            // New user (Google or Email) -> create clean empty profile and show onboarding wizard
            const blankRecord = createBlankUserRecord(user.email || '', user.user_metadata?.full_name);
            const newMulti = {
              students: [blankRecord],
              activeStudentId: blankRecord.id,
            };
            setMultiState(newMulti);
            saveMultiStudentState(newMulti, user.id);
            setNeedsOnboarding(true);
          }
        }
      });
    } else {
      setNeedsOnboarding(false);
      setMultiState(loadMultiStudentState(undefined));
    }
  }, [user]);

  // Handle Onboarding completion
  const handleOnboardingComplete = (newState: DigitalTwinState) => {
    setNeedsOnboarding(false);
    const updatedRecord: StudentRecord = {
      id: `usr-${user?.id || Date.now()}`,
      ...newState,
    };
    const updatedMulti = {
      students: [updatedRecord],
      activeStudentId: updatedRecord.id,
    };
    setMultiState(updatedMulti);
    if (user?.id) {
      saveMultiStudentState(updatedMulti, user.id);
    }
    saveCloudState(newState);
  };

  // Task Mutators
  const handleAddTask = (newTask: Omit<import('./types').TaskItem, 'id'>) => {
    const taskWithId = { ...newTask, id: `task-${Date.now()}` };
    updateActiveStudent((prev) => ({
      ...prev,
      tasks: [taskWithId, ...(prev.tasks || [])],
    }));
  };

  const handleToggleTask = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      tasks: (prev.tasks || []).map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const handleDeleteTask = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      tasks: (prev.tasks || []).filter((t) => t.id !== id),
    }));
  };


  // Active Student computed from multiState
  const activeStudent = useMemo(() => {
    return (
      multiState.students.find((s) => s.id === multiState.activeStudentId) ||
      multiState.students[0] ||
      DEFAULT_SRICHARAN_RECORD
    );
  }, [multiState.students, multiState.activeStudentId]);

  // Persist multiState changes with user scoping
  useEffect(() => {
    saveMultiStudentState(multiState, user?.id);
  }, [multiState, user?.id]);

  // Helper to mutate active student record
  const updateActiveStudent = (updater: (prev: StudentRecord) => StudentRecord) => {
    setMultiState((prev) => {
      const updatedStudents = prev.students.map((s) =>
        s.id === prev.activeStudentId ? updater(s) : s
      );
      return { ...prev, students: updatedStudents };
    });
  };

  // Multi-Student Handlers
  const handleSelectStudent = (id: string) => {
    setMultiState((prev) => ({ ...prev, activeStudentId: id }));
  };

  const handleAddStudent = (newStudent: StudentRecord) => {
    setMultiState((prev) => ({
      students: [newStudent, ...prev.students],
      activeStudentId: newStudent.id,
    }));
  };

  const handleUpdateStudent = (updatedStudent: StudentRecord) => {
    setMultiState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
  };

  const handleDeleteStudent = (id: string) => {
    setMultiState((prev) => {
      const remaining = prev.students.filter((s) => s.id !== id);
      if (remaining.length === 0) return prev;
      const nextActiveId = prev.activeStudentId === id ? remaining[0].id : prev.activeStudentId;
      return {
        students: remaining,
        activeStudentId: nextActiveId,
      };
    });
  };

  // Find Active Career Goal
  const activeCareerGoal = useMemo(() => {
    return (
      activeStudent.careerGoals.find((g) => g.id === activeStudent.activeCareerGoalId) ||
      activeStudent.careerGoals[0]
    );
  }, [activeStudent.careerGoals, activeStudent.activeCareerGoalId]);

  // Compute Career Readiness Score Engine Result
  const readinessResult = useMemo(() => {
    return calculateCareerReadiness(
      activeStudent.profile,
      activeStudent.skills,
      activeStudent.projects,
      activeStudent.achievements,
      activeCareerGoal,
      activeStudent.resumeChecklist
    );
  }, [
    activeStudent.profile,
    activeStudent.skills,
    activeStudent.projects,
    activeStudent.achievements,
    activeCareerGoal,
    activeStudent.resumeChecklist,
  ]);

  // State Mutators
  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    updateActiveStudent((prev) => ({ ...prev, profile: updatedProfile }));
  };

  const handleAddSkill = (newSkill: Skill) => {
    updateActiveStudent((prev) => ({ ...prev, skills: [newSkill, ...prev.skills] }));
  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    updateActiveStudent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)),
    }));
  };

  const handleDeleteSkill = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const handleAddProject = (newProject: Project) => {
    updateActiveStudent((prev) => ({ ...prev, projects: [newProject, ...prev.projects] }));
  };

  const handleUpdateProject = (updatedProject: Project) => {
    updateActiveStudent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    }));
  };

  const handleDeleteProject = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const handleAddAchievement = (newAch: Achievement) => {
    updateActiveStudent((prev) => ({ ...prev, achievements: [newAch, ...prev.achievements] }));
  };

  const handleUpdateAchievement = (updatedAch: Achievement) => {
    updateActiveStudent((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === updatedAch.id ? updatedAch : a)),
    }));
  };

  const handleDeleteAchievement = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  const handleSelectCareerGoal = (goalId: string) => {
    const goal = activeStudent.careerGoals.find((g) => g.id === goalId);
    updateActiveStudent((prev) => ({
      ...prev,
      activeCareerGoalId: goalId,
      profile: {
        ...prev.profile,
        careerGoal: goal ? goal.title : prev.profile.careerGoal,
      },
    }));
  };

  const handleToggleResumeCheckitem = (id: string) => {
    updateActiveStudent((prev) => ({
      ...prev,
      resumeChecklist: prev.resumeChecklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleAddSnapshot = (snapshot: ProgressSnapshot) => {
    updateActiveStudent((prev) => ({
      ...prev,
      progressHistory: [...prev.progressHistory, snapshot],
    }));
  };

  const handleResetDemo = () => {
    if (user) {
      const blankRecord = createBlankUserRecord(user.email || '', user.user_metadata?.full_name);
      const resetState: MultiStudentState = {
        students: [blankRecord],
        activeStudentId: blankRecord.id,
      };
      setMultiState(resetState);
      saveMultiStudentState(resetState, user.id);
    } else {
      const resetState = resetToDemoData(undefined);
      setMultiState(resetState);
    }
  };

  const handleClearAll = () => {
    handleResetDemo();
  };

  const handleImportState = (newState: DigitalTwinState) => {
    updateActiveStudent((prev) => ({ ...prev, ...newState }));
  };


  // Tab change handler with gate check
  const handleTabChange = (tab: ActiveTab) => {
    const proGatedTabs: ActiveTab[] = [
      'ai-assistant',
      'resume-analyzer',
      'syllabus-analyzer',
      'project-analyzer',
      'ai-roadmap',
      'internship',
      'simulator',
    ];

    if (proGatedTabs.includes(tab) && !canAccess(tab as any)) {
      setActiveTab(tab); // still show page which will prompt upgrade or modal
    } else {
      setActiveTab(tab);
    }
  };

  // 1. If not logged in and not in demo mode -> render Public Landing Page
  if (!user && !isDemoSession) {
    return (
      <>
        <PublicLandingPage
          onOpenAuth={(mode) => {
            setAuthDefaultMode(mode);
            setAuthModalOpen(true);
          }}
          onEnterDemo={() => setIsDemoSession(true)}
          onToggleTheme={toggleTheme}
          theme={theme}
          user={user}
          onSignOut={handleSignOut}
        />
        <AuthModal
          isOpen={authModalOpen}
          defaultMode={authDefaultMode}
          onClose={() => setAuthModalOpen(false)}
          onEnterDemoMode={() => {
            setAuthModalOpen(false);
            setIsDemoSession(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-[#F5F9FF] font-sans transition-colors duration-300 relative selection:bg-sky-500 selection:text-white">
      {/* Demo Session Top Banner */}
      {isDemoSession && (
        <div className="bg-sky-500/10 border-b border-sky-300/40 dark:border-sky-500/30 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-sky-800 dark:text-sky-200 relative z-30">
          <div className="flex flex-wrap items-center gap-2 font-bold">
            <PlayCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">DEMO MODE — CREATOR SHOWCASE</span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-black border border-sky-400/40 uppercase tracking-wider">
              DEMO PRO
            </span>
            <span className="text-[11px] text-sky-700/90 dark:text-sky-300/80 font-normal hidden md:inline">
              — All premium features are available for demonstration.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => {
                setAuthDefaultMode('signup');
                setAuthModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Sign Up / Log In
            </button>
            <button
              onClick={() => setIsDemoSession(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-[#0B1626] text-slate-800 dark:text-[#F5F9FF] font-bold text-xs hover:bg-slate-300 dark:hover:bg-[#101D30] active:scale-95 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Exit Demo
            </button>
          </div>
        </div>
      )}

      {/* New User Onboarding Wizard Modal */}
      {user && needsOnboarding && (
        <OnboardingWizard
          userEmail={user.email || ''}
          userName={user.user_metadata?.full_name || ''}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Background Ambient Mesh Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/20 dark:bg-blue-600/15 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/15 dark:bg-emerald-500/15 rounded-full blur-[100px] -ml-24 -mb-24" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-sky-200/25 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar
          id="app-sidebar"
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          profile={activeStudent.profile}
          onResetDemo={handleResetDemo}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          user={user}
          onSignOut={handleSignOut}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header
            id="app-header"
            profile={activeStudent.profile}
            overallScore={readinessResult.overallScore}
            onOpenMobileMenu={() => setIsMobileOpen(true)}
            onResetDemo={handleResetDemo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigateToUpgrade={() => setActiveTab('upgrade')}
            students={multiState.students}
            activeStudentId={multiState.activeStudentId}
            onSelectStudent={handleSelectStudent}
            onNavigateToStudents={() => setActiveTab('students')}
            onOpenAuth={() => setAuthModalOpen(true)}
            user={user}
            onSignOut={handleSignOut}
          />

          <main id="app-main-content" className="flex-1 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 min-w-0 max-w-full overflow-x-hidden">
            {/* V3 Migration Banner */}
            <MigrationBanner
              localState={activeStudent}
              onMigrationComplete={() => {
                fetchCloudState();
              }}
            />

            {activeTab === 'dashboard' && (
              <DashboardPage
                profile={activeStudent.profile}
                overallScore={readinessResult.overallScore}
                categoryScores={readinessResult.categoryScores}
                skillGaps={readinessResult.skillGaps}
                recommendations={readinessResult.recommendations}
                projects={activeStudent.projects}
                achievements={activeStudent.achievements}
                skills={activeStudent.skills}
                setActiveTab={handleTabChange}
              />
            )}

            {activeTab === 'action-planner' && (
              <ActionPlanner
                tasks={activeStudent.tasks || []}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'public-twin' && (
              <PublicDigitalTwinPage
                state={activeStudent}
                overallScore={readinessResult.overallScore}
                onBackToApp={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'profile' && (

              <ProfilePage
                profile={activeStudent.profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'students' && (
              <StudentProfilesPage
                students={multiState.students}
                activeStudentId={multiState.activeStudentId}
                onSelectStudent={handleSelectStudent}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsPage
                skills={activeStudent.skills}
                onAddSkill={handleAddSkill}
                onUpdateSkill={handleUpdateSkill}
                onDeleteSkill={handleDeleteSkill}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsPage
                projects={activeStudent.projects}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsPage
                achievements={activeStudent.achievements}
                onAddAchievement={handleAddAchievement}
                onUpdateAchievement={handleUpdateAchievement}
                onDeleteAchievement={handleDeleteAchievement}
              />
            )}

            {activeTab === 'career-goals' && (
              <CareerGoalsPage
                careerGoals={activeStudent.careerGoals}
                activeCareerGoalId={activeStudent.activeCareerGoalId}
                onSelectCareerGoal={handleSelectCareerGoal}
                skillGaps={readinessResult.skillGaps}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressPage
                progressHistory={activeStudent.progressHistory}
                currentOverallScore={readinessResult.overallScore}
                categoryScores={readinessResult.categoryScores}
                onAddSnapshot={handleAddSnapshot}
              />
            )}

            {activeTab === 'resume' && (
              <ResumePage
                checklist={activeStudent.resumeChecklist}
                onToggleCheckitem={handleToggleResumeCheckitem}
                profile={activeStudent.profile}
                projects={activeStudent.projects}
                skills={activeStudent.skills}
              />
            )}

            {activeTab === 'github' && (
              <GitHubPage
                profile={activeStudent.profile}
                projects={activeStudent.projects}
                skills={activeStudent.skills}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'ai-hub' && (
              <AILabPage
                profile={activeStudent.profile}
                skills={activeStudent.skills}
                projects={activeStudent.projects}
              />
            )}

            {/* V2 AI OS Pages */}
            {activeTab === 'ai-assistant' && (
              <AICareerAssistantPage state={activeStudent} onNavigateToUpgrade={() => handleTabChange('upgrade')} />
            )}

            {activeTab === 'resume-analyzer' && (
              <ResumeAnalyzerPage />
            )}

            {activeTab === 'syllabus-analyzer' && (
              <SyllabusAnalyzerPage />
            )}

            {activeTab === 'project-analyzer' && (
              <ProjectAnalyzerPage />
            )}

            {activeTab === 'ai-roadmap' && (
              <AIRoadmapPage state={activeStudent} />
            )}

            {activeTab === 'internship' && (
              <InternshipReadinessPage state={activeStudent} />
            )}

            {activeTab === 'simulator' && (
              <CareerSimulatorPage state={activeStudent} />
            )}

            {activeTab === 'upgrade' && (
              <UpgradePage onNavigateToFeature={(tab) => handleTabChange(tab as ActiveTab)} />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                onResetDemo={handleResetDemo}
                onClearAll={handleClearAll}
                currentState={activeStudent}
                onImportState={handleImportState}
                onNavigateToUpgrade={() => handleTabChange('upgrade')}
                user={user}
                onSignOut={handleSignOut}
              />
            )}
          </main>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        defaultMode={authDefaultMode}
        onClose={() => setAuthModalOpen(false)}
        onEnterDemoMode={() => {
          setAuthModalOpen(false);
          setIsDemoSession(true);
        }}
      />

      {/* Upgrade Pro Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        requiredFeature={requiredFeatureForModal}
        onNavigateToUpgrade={() => handleTabChange('upgrade')}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <MainAppContent />
        </SubscriptionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
