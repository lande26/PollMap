import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, signInWithGoogle } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    const { session, error: loginError } = await login(email, password);
    if (loginError) {
      setError(loginError.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { success, error: googleError } = await signInWithGoogle();
    if (!success) {
      setError(googleError);
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans p-4">
      {/* Background handled by App.jsx particles */}

      <div className="w-full max-w-[440px]">
        {/* Floating Card */}
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/50 rounded-2xl p-12 w-full relative z-10">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">Welcome Back</h1>

            {/* Tabs */}
            <div className="flex gap-6 border-b-2 border-slate-700 pb-2">
              <Link
                to="/login"
                className={`relative pb-2 text-base font-medium transition-colors duration-200 ${isActive('/login') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Log In
                {isActive('/login') && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-blue-400" />
                )}
              </Link>
              <Link
                to="/signup"
                className={`relative pb-2 text-base font-medium transition-colors duration-200 ${isActive('/signup') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign Up
                {isActive('/signup') && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-blue-400 opacity-0" />
                )}
              </Link>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-[50px] bg-slate-800/60 border-2 border-slate-700 rounded-lg pl-12 pr-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-slate-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1 pr-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                  <Link to="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-[50px] bg-slate-800/60 border-2 border-slate-700 rounded-lg pl-12 pr-12 text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-slate-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-700/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg mt-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 text-base"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-700 flex-1" />
            <span className="text-sm text-slate-400 font-medium whitespace-nowrap px-2">OR WITH EMAIL</span>
            <div className="h-px bg-slate-700 flex-1" />
          </div>

          {/* Google Button - Fixed Contrast */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-[50px] bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;