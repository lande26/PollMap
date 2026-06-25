import React from 'react';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = UserAuth();
  const location = useLocation();
  const { openAuthModal } = useAuthModal();
  const hasPromptedRef = React.useRef(false);

  React.useEffect(() => {
    if (loading || user || hasPromptedRef.current) {
      return;
    }

    hasPromptedRef.current = true;
    openAuthModal({
      mode: 'login',
      intent: 'signin',
    });
  }, [loading, user, openAuthModal]);

  React.useEffect(() => {
    if (user) {
      hasPromptedRef.current = false;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 px-8 py-6 text-center text-sm text-slate-300 backdrop-blur-xl">
          Loading your access...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),rgba(8,15,30,0.95)_58%)] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-8 py-7">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-200">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-white">
              Sign in to continue
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              PollMap keeps polls, rooms, analytics, and participation tied to authenticated sessions.
              This area is locked until you log in.
            </p>
          </div>

          <div className="grid gap-5 px-8 py-7 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <Lock className="mb-3 h-5 w-5 text-orange-200" />
              <p className="text-sm font-medium text-white">Protected access</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Guest users can no longer browse polls or vote routes directly.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <Sparkles className="mb-3 h-5 w-5 text-sky-200" />
              <p className="text-sm font-medium text-white">Modal-first flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Authentication happens in place instead of sending you to a separate screen.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm font-medium text-white">Instant resume</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">After sign-in, this route opens immediately with your session restored.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Requested route: {location.pathname}
            </p>
            <button
              type="button"
              onClick={() => openAuthModal({ mode: 'login', intent: 'signin' })}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:from-orange-400 hover:to-amber-300"
            >
              Open Auth
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
