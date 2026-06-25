import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard, LogOut, Menu, User as UserIcon, Users2, Vote, X } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext.jsx';

function Header() {
  const { user, signOut } = UserAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const navItems = useMemo(() => (
    user
      ? [
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/rooms', label: 'Rooms', icon: Users2 },
          { href: '/polls', label: 'Polls', icon: Vote },
        ]
      : []
  ), [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      setAccountOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userLabel = user?.email?.split('@')[0] || 'User';
  const userInitial = userLabel.charAt(0).toUpperCase() || 'U';

  return (
    <header className="fixed inset-x-0 top-4 z-[1000] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          className={`relative overflow-visible rounded-full border px-3 py-2 transition-all duration-300 ${
            scrolled
              ? 'border-white/10 bg-[rgba(10,14,22,0.78)] shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-2xl'
              : 'border-white/8 bg-[rgba(11,15,23,0.66)] shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl'
          }`}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 rounded-full bg-[radial-gradient(circle_at_left,rgba(247,165,64,0.16),transparent_68%)]" />
          <div className="flex items-center justify-between gap-3">
            <Link
              to={user ? '/dashboard' : '/'}
              className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#f59d0d] via-[#f6c15f] to-[#7bc6cf] shadow-[0_12px_26px_rgba(0,0,0,0.18)]">
                <img
                  src="/polling.png"
                  alt="PollMap logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <div className="font-display text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-white">
                  PollMap
                </div>
              </div>
            </Link>

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                        isActive
                          ? 'bg-[#f59d0d] text-[#120d06]'
                          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] md:hidden"
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>

                  <div className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setAccountOpen((value) => !value)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-sm font-semibold text-white transition hover:border-white/16 hover:bg-white/[0.08]"
                    >
                      {userInitial}
                    </button>

                    {accountOpen ? (
                      <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,29,0.96),rgba(10,14,22,0.96))] p-2 shadow-[0_24px_56px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
                        <div className="rounded-2xl border border-white/6 bg-white/[0.04] px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Account</p>
                          <p className="mt-2 truncate text-sm font-medium text-white">{user?.email}</p>
                        </div>

                        <div className="mt-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                            onClick={() => setAccountOpen(false)}
                          >
                            <UserIcon className="h-4 w-4 text-orange-200" />
                            Profile
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                          >
                            <LogOut className="h-4 w-4" />
                            Log out
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthModal({ mode: 'login', intent: 'signin' })}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal({ mode: 'signup', intent: 'signin' })}
                    className="rounded-full bg-[#f59d0d] px-5 py-2.5 text-sm font-semibold text-[#120d06] transition hover:bg-[#f7b339]"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>

          {user && mobileOpen ? (
            <div className="mt-3 space-y-2 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,29,0.94),rgba(10,14,22,0.96))] p-3 md:hidden">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                      isActive
                        ? 'bg-[#f59d0d] text-[#120d06]'
                        : 'text-slate-200 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed in as</p>
                <p className="mt-2 truncate text-sm text-white">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Compass className="h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-2xl bg-rose-500/10 px-4 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/16"
              >
                Log out
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Header;
