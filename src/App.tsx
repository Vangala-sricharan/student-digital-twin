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
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { useAuth } from './context/AuthContext';

import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';
import { MigrationBanner } from './components/MigrationBanner';
import { ActionPlanner } from './components/ActionPlanner';
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

function MainAppContent() {
  const [multiState, setMultiState] = useState<MultiStudentState>(() => loadMultiStudentState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const { canAccess, upgradeModalOpen, setUpgradeModalOpen, requiredFeatureForModal } = useSubscription();
  const { user, fetchCloudState, saveCloudState } = useAuth();

  // Load Cloud State when user logs in
  useEffect(() => {
    if (user) {
      fetchCloudState().then((cloudData) => {
        if (cloudData) {
          updateActiveStudent((prev) => ({
            ...prev,
            profile: cloudData.profile,
            skills: cloudData.skills,
            projects: cloudData.projects,
            achievements: cloudData.achievements,
            tasks: cloudData.tasks || prev.tasks || [],
          }));
        }
      });
    }
  }, [user]);

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

  // Persist multiState changes
  useEffect(() => {
    saveMultiStudentState(multiState);
  }, [multiState]);

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
    const resetState = resetToDemoData();
    setMultiState(resetState);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D19] text-slate-900 dark:text-white font-sans transition-colors duration-300 relative selection:bg-sky-500 selection:text-white">
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
          />

          <main id="app-main-content" className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-12">
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
              />
            )}
          </main>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
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
