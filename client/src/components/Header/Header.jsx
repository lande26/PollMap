import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

function Header() {
  const { user, signOut } = UserAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const circleRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserId = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  const navItems = user ? [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/polls', label: 'Polls' },
  ] : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
      `}</style>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl transition-all duration-500">
        <nav
          className={`relative w-full flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-full px-3 py-2 shadow-2xl border border-white/20 transition-all duration-500 ${scrolled ? 'bg-white/5' : ''
            }`}
          style={{
            background: scrolled ? 'rgba(13, 20, 37, 0.6)' : 'rgba(13, 20, 37, 0.8)',
            backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'blur(20px)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
              : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            fontFamily: "'Lato', sans-serif"
          }}
        >
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className={`flex-shrink-0 flex items-center gap-2 hover:scale-105 transition-all duration-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 p-1.5">
              <img
                src="/polling.png"
                alt="PollMap Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Lato', sans-serif" }}>
              PollMap
            </span>
          </Link>

          {/* Desktop Navigation - Right Side Pills */}
          {user && (
            <div
              className={`hidden md:flex items-center gap-2 ml-auto mr-3 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              style={{ transitionDelay: '0.1s', fontFamily: "'Lato', sans-serif" }}
            >
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className={`
                      relative px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide overflow-hidden transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                        : 'text-gray-300 hover:text-white'
                      }
                    `} style={{ fontFamily: "'Lato', sans-serif" }}>
                      {/* Hover Circle Effect */}
                      {!isActive && (
                        <span
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full transition-transform duration-300 origin-center"
                          style={{
                            transform: hoveredIndex === i ? 'scale(1)' : 'scale(0)',
                          }}
                        />
                      )}

                      {/* Text */}
                      <span className="relative z-10">{item.label}</span>

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side - User Menu or Auth Buttons */}
          <div
            className={`flex items-center gap-3 flex-shrink-0 transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {user ? (
              <>
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="md:hidden w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/30"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {dropdownOpen ? '✕' : '☰'}
                </button>

                {/* Desktop User Avatar */}
                <div className="hidden md:block relative">
                  <div
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 ring-2 ring-blue-500/30 hover:ring-blue-400/50"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {getUserId()?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  {/* Desktop Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-3 w-56 bg-[#0D1425] rounded-2xl shadow-2xl border border-blue-900/50 overflow-hidden backdrop-blur-xl"
                      style={{
                        animation: 'slideDown 0.3s ease-out',
                        fontFamily: "'Lato', sans-serif"
                      }}
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-blue-900/30">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
                          <p className="text-sm text-white font-medium mt-1 truncate">{user?.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-600/20 hover:text-white transition-all duration-200 group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mr-3 group-hover:bg-blue-600/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-medium">Profile</span>
                        </Link>


                        <div className="px-2 py-2 border-t border-blue-900/30 mt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2.5 bg-red-600/10 text-red-400 rounded-xl hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center mr-3 group-hover:bg-red-600/30 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 text-sm hover:text-white whitespace-nowrap transition-colors duration-200 font-medium px-4"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {user && dropdownOpen && (
          <div
            className="md:hidden mt-3 bg-[#0D1425] rounded-2xl shadow-2xl border border-blue-900/50 overflow-hidden backdrop-blur-xl"
            style={{
              animation: 'slideDown 0.3s ease-out',
              fontFamily: "'Lato', sans-serif"
            }}
          >
            <div className="py-2">
              <div className="px-4 py-3 border-b border-blue-900/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Navigation</p>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 transition-all duration-200 ${location.pathname === item.href
                      ? 'bg-blue-600/30 text-white font-semibold'
                      : 'text-gray-300 hover:bg-blue-600/20 hover:text-white'
                    }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-blue-900/30 mt-2">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-600/20 hover:text-white transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
              </div>

              <div className="px-2 py-2 border-t border-blue-900/30">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2.5 bg-red-600/10 text-red-400 rounded-xl hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dropdown Backdrop */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-sm"
          onClick={() => setDropdownOpen(false)}
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default Header;