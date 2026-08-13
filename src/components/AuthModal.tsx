import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'reset';
  onEnterDemoMode?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  onEnterDemoMode,
}) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, authError, clearAuthError, isCloudConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    clearAuthError();
    setSuccessMsg('');
    onClose();
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    clearAuthError();
    setSuccessMsg('');
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const cleanedEmail = email.trim().toLowerCase();

    try {
      if (mode === 'signin') {
        const { error } = await signIn(cleanedEmail, password);
        if (!error) {
          onClose();
        }
      } else if (mode === 'signup') {
        const result = await signUp(cleanedEmail, password, fullName);
        if (!result.error) {
          if (result.needsEmailConfirmation) {
            setSuccessMsg('Account created. Please confirm your email before signing in.');
            setTimeout(() => {
              setMode('signin');
              setSuccessMsg('');
            }, 4000);
          } else {
            setSuccessMsg('Account created successfully! Welcome to Student Digital Twin Cloud.');
            setTimeout(() => onClose(), 1200);
          }
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(cleanedEmail);
        if (!error) {
          setSuccessMsg('Password reset instructions have been sent to your email.');
        }
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F9FF]">
            {mode === 'signin'
              ? 'Welcome Back to Student Twin'
              : mode === 'signup'
              ? 'Create Your Student Twin'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#B7C4D6] mt-1 max-w-xs">
            {mode === 'signin'
              ? 'Sync your skills, readiness score, and career progress across all devices.'
              : mode === 'signup'
              ? 'Build your personalized AI-powered career profile.'
              : 'Enter your registered email address to receive password recovery details.'}
          </p>
        </div>

        {/* Supabase Configuration Warning if missing */}
        {!isCloudConfigured && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Cloud Sync Notice</p>
              <p className="mt-0.5">
                Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY) are not yet configured in environment variables. You are currently operating in local mode.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Error Message */}
        {authError && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#B7C4D6] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vangala Sricharan"
                  className="w-full rounded-xl bg-slate-50 dark:bg-[#0B1626] border border-slate-200 dark:border-sky-500/20 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-[#F5F9FF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#B7C4D6] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sricharan@marwadi.edu"
                className="w-full rounded-xl bg-slate-50 dark:bg-[#0B1626] border border-slate-200 dark:border-sky-500/20 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-[#F5F9FF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#B7C4D6]">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-50 dark:bg-[#0B1626] border border-slate-200 dark:border-sky-500/20 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-[#F5F9FF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signin'
                    ? 'Sign In to Cloud Twin'
                    : mode === 'signup'
                    ? 'Create Free Cloud Account'
                    : 'Send Password Reset Email'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth & Demo Options */}
        {mode !== 'reset' && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-sky-500/15 space-y-3">
            {isCloudConfigured && (
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B1626] dark:hover:bg-[#101D30] border border-slate-200 dark:border-sky-500/20 text-slate-800 dark:text-[#F5F9FF] font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.2 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1.01 9.99.01 12c0 2.01.43 3.9 1.2 5.44l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.2 2.7 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}

            {onEnterDemoMode && (
              <>
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-sky-500/15" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-[#07111F] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnterDemoMode();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500/15 to-blue-600/15 hover:from-sky-500/25 hover:to-blue-600/25 text-sky-700 dark:text-cyan-300 border border-sky-300/60 dark:border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <PlayCircle className="h-4 w-4 text-sky-600 dark:text-cyan-400" />
                  <span>Try Creator Demo →</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer Mode Switch */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signin' ? (
            <p>
              Don't have a Cloud Digital Twin?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              onClick={() => switchMode('signin')}
              className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
