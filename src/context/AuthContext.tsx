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
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any; data?: any; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  clearAuthError: () => void;
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

      if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
        window.history.replaceState({}, document.title, '/');
      }
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

      if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
        window.history.replaceState({}, document.title, '/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthError(null);
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedFullName = fullName.trim();

    if (!supabase) {
      const err = new Error('Supabase client is not configured');
      setAuthError(err.message);
      return { error: err };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanedEmail,
      password,
      options: {
        data: {
          full_name: cleanedFullName,
        },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      let formattedMsg = error.message;
      const lowerMsg = (error.message || '').toLowerCase();
      if (
        lowerMsg.includes('user already registered') ||
        lowerMsg.includes('already registered') ||
        lowerMsg.includes('already exists')
      ) {
        formattedMsg = 'An account with this email already exists. Please log in instead.';
      } else if (lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
        formattedMsg = 'Too many attempts. Please try again later.';
      }
      setAuthError(formattedMsg);
      return { error: new Error(formattedMsg), data };
    }

    // Check if user already exists (Supabase returns user object with identities: [] if already registered)
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const existingUserErr = new Error('An account with this email already exists. Please log in instead.');
      setAuthError(existingUserErr.message);
      return { error: existingUserErr, data };
    }

    const needsEmailConfirmation = !data?.session && Boolean(data?.user);

    return { error: null, data, needsEmailConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    const cleanedEmail = email.trim().toLowerCase();

    if (!supabase) {
      const err = new Error('Supabase client is not configured');
      setAuthError(err.message);
      return { error: err };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password,
    });

    if (error) {
      let formattedMsg = error.message;
      const lowerMsg = (error.message || '').toLowerCase();

      if (lowerMsg.includes('email not confirmed') || lowerMsg.includes('email_not_confirmed')) {
        formattedMsg = 'Please verify your email address before signing in.';
      } else if (
        lowerMsg.includes('invalid login credentials') ||
        lowerMsg.includes('invalid_credentials') ||
        lowerMsg.includes('invalid credentials')
      ) {
        formattedMsg = 'Incorrect email or password.';
      } else if (lowerMsg.includes('user not found') || lowerMsg.includes('user_not_found')) {
        formattedMsg = 'No account found with this email address.';
      } else if (lowerMsg.includes('too many') || lowerMsg.includes('rate limit')) {
        formattedMsg = 'Too many attempts. Please try again later.';
      } else if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('networkerror')) {
        formattedMsg = 'Unable to connect. Please try again.';
      }
      setAuthError(formattedMsg);
      return { error: new Error(formattedMsg), data };
    }

    return { error: null, data };
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!supabase) {
      const err = new Error('Supabase client is not configured');
      setAuthError(err.message);
      return { error: err };
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
    if (error) {
      let formattedMsg = error.message;
      if (formattedMsg.toLowerCase().includes('cancel')) {
        formattedMsg = 'Google sign-in was cancelled.';
      }
      setAuthError(formattedMsg);
      return { error: new Error(formattedMsg), data };
    }
    return { error: null, data };
  };

  const signOut = async () => {
    let signOutErr: any = null;
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) signOutErr = error;
      } catch (err) {
        signOutErr = err;
      }
    }
    setUser(null);
    setSession(null);
    setCloudSyncStatus('local');
    if (signOutErr) {
      return { error: signOutErr };
    }
    return { error: null };
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

  const clearAuthError = () => setAuthError(null);

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
        clearAuthError,
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
