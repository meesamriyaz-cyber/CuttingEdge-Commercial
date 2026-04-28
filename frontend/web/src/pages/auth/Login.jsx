import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

import HeroLeftContent from "../../components/HeroLeftContent";

import {
  authPageVariants,
  heroSideVariants,
  formSideVariants,
} from "../../utils/animations";

import { Eye, EyeOff, Package, ShieldCheck } from "lucide-react";
import { Button, Input } from "../../components/ui";

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
    <motion.div
      className="min-h-screen bg-slate-50 dark:bg-[#07111f] flex items-center justify-center px-4 sm:px-6 py-10"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* LEFT - Hero Content */}
        <motion.div variants={heroSideVariants} className="hidden lg:block">
          <HeroLeftContent hideCTA clientType="PRIVATE" />
        </motion.div>

        {/* RIGHT - Form */}
        <motion.div className="flex justify-center lg:justify-end" variants={formSideVariants}>
          <motion.div className="w-full max-w-md tech-panel rounded-lg p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="mb-7">
              <div className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4">
                <ShieldCheck size={13} />
                Secure customer access
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-950 dark:bg-cyan-500 rounded-lg shadow-sm mb-5">
                <Package className="w-6 h-6 text-white dark:text-slate-950" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Sign in to your account
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Access your account, continue your workflow, and manage requests from one secure workspace.
              </p>
            </div>

            <AnimatePresence>
              {sessionExpired && (
                <motion.div
                  className="mb-6 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Your session has expired. Please log in again.
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-cyan-950/50 bg-white/70 dark:bg-slate-950/40 p-4 sm:p-5 space-y-4">
              {/* Email */}
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Trust note */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-5 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-cyan-500" />
              Secure access for customers and institutions
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
