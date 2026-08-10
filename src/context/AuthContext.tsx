import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { CloudSyncStatus, DigitalTwinState, StudentProfile } from '../types';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  authError: string | null;
  cloudSyncStatus: CloudSyncStatus;
  isCloudConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  migrateV2LocalDataToCloud: (localState: DigitalTwinState) => Promise<{ success: boolean; message: string }>;
  fetchCloudState: () => Promise<DigitalTwinState | null>;
  saveCloudState: (state: DigitalTwinState) => Promise<boolean>;
  setCloudSyncStatus: (status: CloudSyncStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(
    isSupabaseConfigured ? 'synced' : 'local'
  );

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setCloudSyncStatus('local');
      return;
    }

    // Clean up /auth/callback URL path after OAuth redirect if present
    if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
      window.history.replaceState({}, document.title, '/' + window.location.search + window.location.hash);
    }

    // Get current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setCloudSyncStatus('synced');
      } else {
        setCloudSyncStatus('local');
      }
      setLoading(false);
    });

    // Listen to Auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setCloudSyncStatus('synced');
      } else {
        setCloudSyncStatus('local');
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthError(null);
    if (!supabase) {
      return { error: new Error('Supabase client is not configured') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) setAuthError(error.message);
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    if (!supabase) {
      return { error: new Error('Supabase client is not configured') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
    return { error, data };
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!supabase) {
      return { error: new Error('Supabase client is not configured') };
    }
    const customUrl = (import.meta as any).env?.VITE_AUTH_REDIRECT_URL;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let redirectUrl = origin;
    if (customUrl && typeof customUrl === 'string' && customUrl.trim() !== '') {
      redirectUrl = customUrl.trim();
    }
    if (!redirectUrl.endsWith('/auth/callback')) {
      redirectUrl = `${redirectUrl.replace(/\/$/, '')}/auth/callback`;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) setAuthError(error.message);
    return { error, data };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setCloudSyncStatus('local');
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    if (!supabase) {
      return { error: new Error('Supabase client is not configured') };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setAuthError(error.message);
    return { error, data };
  };

  // Cloud State Syncing Methods
  const fetchCloudState = async (): Promise<DigitalTwinState | null> => {
    if (!supabase || !user) return null;
    try {
      setCloudSyncStatus('saving');

      // 1. Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // 2. Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);

      // 3. Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      // 4. Fetch achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      // 5. Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      // 6. Fetch career goals
      const { data: goalsData } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id);

      // 7. Fetch readiness scores
      const { data: readinessData } = await supabase
        .from('readiness_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true });

      setCloudSyncStatus('synced');

      if (!profileData) return null;

      const profile: StudentProfile = {
        name: profileData.full_name || 'Student User',
        degree: profileData.degree || 'B.Tech',
        branch: profileData.branch || 'CSE (AI/ML)',
        university: profileData.university || 'Marwadi University',
        year: profileData.year || '2nd Year',
        semester: profileData.semester || '4th Semester',
        cgpa: profileData.cgpa || '8.5',
        careerGoal: profileData.career_goal || 'AI/ML Engineer',
        bio: profileData.bio || '',
        linkedIn: profileData.linkedin || '',
        gitHub: profileData.github || '',
        portfolio: profileData.portfolio || '',
        email: profileData.email || user.email || '',
        location: profileData.location || 'Rajkot, Gujarat, India',
        academicFocus: profileData.academic_focus || [],
      };

      const skills = (skillsData || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        numericScore: s.numeric_score,
        notes: s.notes,
      }));

      const projects = (projectsData || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        technologies: p.technologies || [],
        skills: p.skills || [],
        githubUrl: p.github_url,
        liveUrl: p.live_url,
        status: p.status || 'In Progress',
        difficulty: p.difficulty || 'Intermediate',
        completionDate: p.completion_date,
      }));

      const achievements = (achievementsData || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        organization: a.organization,
        date: a.date || '',
        type: a.type || 'Event',
        description: a.description || '',
        credentialUrl: a.credential_url,
      }));

      const tasks = (tasksData || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        category: t.category || 'General',
        priority: t.priority || 'Medium',
        dueDate: t.due_date,
        completed: t.completed || false,
        notes: t.notes,
      }));

      const careerGoals = (goalsData || []).map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        targetSkills: g.target_skills || {},
        recommendedCourses: g.recommended_courses || [],
      }));

      const progressHistory = (readinessData || []).map((r: any) => ({
        id: r.id,
        date: r.recorded_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        overallScore: r.overall_score,
        categoryScores: r.category_scores || {},
        note: r.note,
      }));

      return {
        profile,
        skills,
        projects,
        achievements,
        activeCareerGoalId: careerGoals[0]?.id || 'cg-aiml',
        careerGoals,
        progressHistory,
        resumeChecklist: [],
        customRecommendations: [],
        tasks,
      };
    } catch (err) {
      console.error('Error fetching cloud state:', err);
      setCloudSyncStatus('error');
      return null;
    }
  };

  const saveCloudState = async (state: DigitalTwinState): Promise<boolean> => {
    if (!supabase || !user) return false;
    try {
      setCloudSyncStatus('saving');

      // Upsert profile
      await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          full_name: state.profile.name,
          email: state.profile.email,
          degree: state.profile.degree,
          branch: state.profile.branch,
          university: state.profile.university,
          year: state.profile.year,
          semester: state.profile.semester,
          cgpa: state.profile.cgpa,
          career_goal: state.profile.careerGoal,
          bio: state.profile.bio,
          linkedin: state.profile.linkedIn,
          github: state.profile.gitHub,
          portfolio: state.profile.portfolio,
          location: state.profile.location,
          academic_focus: state.profile.academicFocus,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      setCloudSyncStatus('synced');
      return true;
    } catch (err) {
      console.error('Error saving cloud state:', err);
      setCloudSyncStatus('error');
      return false;
    }
  };

  const migrateV2LocalDataToCloud = async (
    localState: DigitalTwinState
  ): Promise<{ success: boolean; message: string }> => {
    if (!supabase || !user) {
      return { success: false, message: 'Please log in to migrate data to the cloud.' };
    }
    try {
      setCloudSyncStatus('saving');

      // 1. Save Profile
      await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          full_name: localState.profile.name,
          email: localState.profile.email || user.email,
          degree: localState.profile.degree,
          branch: localState.profile.branch,
          university: localState.profile.university,
          year: localState.profile.year,
          semester: localState.profile.semester,
          cgpa: localState.profile.cgpa,
          career_goal: localState.profile.careerGoal,
          bio: localState.profile.bio,
          linkedin: localState.profile.linkedIn,
          github: localState.profile.gitHub,
          portfolio: localState.profile.portfolio,
          location: localState.profile.location,
          academic_focus: localState.profile.academicFocus,
        },
        { onConflict: 'user_id' }
      );

      // 2. Clear & insert skills
      await supabase.from('skills').delete().eq('user_id', user.id);
      if (localState.skills.length > 0) {
        const skillRows = localState.skills.map((s) => ({
          user_id: user.id,
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
          numeric_score: s.numericScore,
          notes: s.notes || '',
        }));
        await supabase.from('skills').insert(skillRows);
      }

      // 3. Clear & insert projects
      await supabase.from('projects').delete().eq('user_id', user.id);
      if (localState.projects.length > 0) {
        const projectRows = localState.projects.map((p) => ({
          user_id: user.id,
          name: p.name,
          description: p.description,
          technologies: p.technologies,
          skills: p.skills,
          github_url: p.githubUrl,
          live_url: p.liveUrl,
          status: p.status,
          difficulty: p.difficulty,
          completion_date: p.completionDate || null,
        }));
        await supabase.from('projects').insert(projectRows);
      }

      // 4. Clear & insert achievements
      await supabase.from('achievements').delete().eq('user_id', user.id);
      if (localState.achievements.length > 0) {
        const achievementRows = localState.achievements.map((a) => ({
          user_id: user.id,
          title: a.title,
          organization: a.organization,
          date: a.date || null,
          type: a.type,
          description: a.description,
          credential_url: a.credentialUrl,
        }));
        await supabase.from('achievements').insert(achievementRows);
      }

      // 5. Insert tasks if any
      if (localState.tasks && localState.tasks.length > 0) {
        await supabase.from('tasks').delete().eq('user_id', user.id);
        const taskRows = localState.tasks.map((t) => ({
          user_id: user.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          due_date: t.dueDate || null,
          completed: t.completed,
          notes: t.notes || '',
        }));
        await supabase.from('tasks').insert(taskRows);
      }

      setCloudSyncStatus('synced');
      return {
        success: true,
        message: 'Successfully migrated local Digital Twin records to Supabase Cloud!',
      };
    } catch (err: any) {
      console.error('Migration failed:', err);
      setCloudSyncStatus('error');
      return { success: false, message: err.message || 'Data migration failed.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        cloudSyncStatus,
        isCloudConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        migrateV2LocalDataToCloud,
        fetchCloudState,
        saveCloudState,
        setCloudSyncStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
