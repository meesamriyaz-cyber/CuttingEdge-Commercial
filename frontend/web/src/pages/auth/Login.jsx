import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import HeroLeftContent from "../../components/HeroLeftContent";

import {
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setSessionExpired(true);
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({
        email: email.trim().toLowerCase(),
        password,
      });

      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      if (data.verificationRequired) {
        navigate("/verify-account", { replace: true });
      } else if (data.user?.roles?.includes("admin")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <HeroLeftContent hideCTA={true} />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-slate-400 mt-2">Sign in to access your account</p>
            </div>

            {/* Session Expired Alert */}
            {sessionExpired && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl px-4 py-3"
              >
                ⚠️ Your session has expired. Please log in again.
              </motion.div>
            )}

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-4 pr-12 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-center text-slate-400">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>

            {/* Trust Note */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-emerald-400" />
                <span>Secure access</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Trusted by businesses</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
