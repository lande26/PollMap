import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserAuth } from './AuthContext.jsx';
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AUTH_RESUME_KEY = 'pollmap.pendingAuthAction';
const AUTH_RESUME_EVENT = 'pollmap:auth-resume';

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const { user } = UserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState('login');
  const [intent, setIntent] = useState('signin');
  const successRef = useRef(null);
  const pendingActionRef = useRef(null);

  const openAuthModal = useCallback(({ mode = 'login', intent: nextIntent = 'signin', onSuccess, pendingAuthAction = null } = {}) => {
    setDefaultTab(mode);
    setIntent(nextIntent);
    successRef.current = typeof onSuccess === 'function' ? onSuccess : null;
    pendingActionRef.current = pendingAuthAction;
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    successRef.current = null;
    pendingActionRef.current = null;
  }, []);

  const runSuccessHandler = useCallback(() => {
    const handler = successRef.current;
    successRef.current = null;
    pendingActionRef.current = null;
    setIsOpen(false);
    if (handler) {
      handler();
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const rawPending = window.sessionStorage.getItem(AUTH_RESUME_KEY);
    if (!rawPending) return;

    window.sessionStorage.removeItem(AUTH_RESUME_KEY);

    try {
      const detail = JSON.parse(rawPending);
      if (detail?.type === 'navigate' && detail?.path) {
        window.location.assign(detail.path);
        return;
      }
      window.dispatchEvent(new CustomEvent(AUTH_RESUME_EVENT, { detail }));
    } catch {
      // Ignore malformed pending action payloads.
    }
  }, [user]);

  const value = useMemo(() => ({
    isOpen,
    intent,
    openAuthModal,
    closeAuthModal,
    runSuccessHandler,
    defaultTab,
    currentPath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    authResumeKey: AUTH_RESUME_KEY,
    authResumeEvent: AUTH_RESUME_EVENT,
    getPendingAuthAction: () => pendingActionRef.current,
  }), [isOpen, intent, openAuthModal, closeAuthModal, runSuccessHandler, defaultTab]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

const RequirementBadge = ({ met, label }) => (
  <div className={`
    inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors
    ${met
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : 'border-white/10 bg-white/5 text-slate-400'}
  `}>
    {met && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
    <span>{label}</span>
  </div>
);

const AuthModal = () => {
  const {
    isOpen,
    closeAuthModal,
    runSuccessHandler,
    defaultTab,
    intent,
    currentPath,
    authResumeKey,
    getPendingAuthAction,
  } = useAuthModal();
  const { login, signup, signInWithGoogle } = UserAuth();

  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setTab(defaultTab);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setLoading(false);
    setError(null);
  }, [isOpen, defaultTab]);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Failed to sign in.');
      setLoading(false);
      return;
    }

    setLoading(false);
    runSuccessHandler();
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordValid) {
      setError('Please meet all password requirements.');
      setLoading(false);
      return;
    }

    const result = await signup(email, password);
    if (!result.success) {
      setError(result.error?.message || result.error || 'Failed to sign up.');
      setLoading(false);
      return;
    }

    setLoading(false);

    if (result.data?.session) {
      runSuccessHandler();
      return;
    }

    toast.success('Check your email to confirm your account.');
    closeAuthModal();
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);

    const pendingAction = getPendingAuthAction();
    if (pendingAction) {
      window.sessionStorage.setItem(authResumeKey, JSON.stringify({
        ...pendingAction,
        returnTo: currentPath,
      }));
    }

    const redirectTo = `${window.location.origin}${currentPath}`;

    const result = await signInWithGoogle(redirectTo);
    if (!result.success) {
      setError(result.error || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  const title = tab === 'signup' ? 'Create your PollMap account' : 'Sign in to PollMap';
  const description = intent === 'vote'
    ? 'Authenticate to vote and keep your poll activity tied to your account.'
    : 'Use one shared auth flow without leaving your current screen.';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : closeAuthModal())}>
      <DialogContent className="max-w-[460px] border border-white/10 bg-[#0C1324] p-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.38)] sm:max-w-[460px]">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#121827_0%,#0c1324_46%,#09101d_100%)]">
          <div className="relative px-7 pt-7 pb-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-display text-3xl font-semibold tracking-tight text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-300">
                {description}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={tab} onValueChange={setTab} className="mt-6">
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                <TabsTrigger value="login" className="rounded-xl border border-transparent py-2 shadow-none data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.06] data-[state=active]:text-white">
                  Log In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl border border-transparent py-2 shadow-none data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.06] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <AuthForm
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  loading={loading}
                  error={error}
                  submitLabel="Log In"
                  onSubmit={handleLogin}
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <AuthForm
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  loading={loading}
                  error={error}
                  submitLabel="Create Account"
                  onSubmit={handleSignup}
                >
                  <div className="flex flex-wrap gap-2">
                    <RequirementBadge met={passwordRequirements.length} label="8+ chars" />
                    <RequirementBadge met={passwordRequirements.uppercase} label="Uppercase" />
                    <RequirementBadge met={passwordRequirements.number} label="Number" />
                  </div>
                </AuthForm>
              </TabsContent>
            </Tabs>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-[0.26em] text-slate-400">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] text-white shadow-none ring-0 hover:bg-white/[0.07] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AuthForm = ({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  submitLabel,
  onSubmit,
  children,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="space-y-2">
      <label htmlFor="auth-email" className="block text-sm font-medium text-slate-300">
        Email Address
      </label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus-visible:border-white/14 focus-visible:ring-0"
          placeholder="name@example.com"
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <label htmlFor="auth-password" className="block text-sm font-medium text-slate-300">
        Password
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id="auth-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-slate-500 shadow-none focus-visible:border-white/14 focus-visible:ring-0"
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>

    {children}

    {error && (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{error}</p>
      </div>
    )}

    <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-[#f59d0d] text-slate-950 shadow-none ring-0 hover:bg-[#ffab1f] focus-visible:ring-0 focus-visible:ring-offset-0">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {submitLabel}
    </Button>
  </form>
);
