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
  cardHoverVariants,
  buttonHoverVariants,
} from "../../utils/animations";

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

  // Check for expired session on mount
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setSessionExpired(true);
      // Clear the query param
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
      className="min-h-screen bg-surface text-text flex items-center justify-center px-6"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* HERO */}
        <motion.div variants={heroSideVariants}>
          <HeroLeftContent hideCTA clientType="PRIVATE" />
        </motion.div>

        {/* FORM */}
        <motion.div className="flex justify-center" variants={formSideVariants}>
          {
            <motion.div
              className="w-full max-w-md theme-card rounded-3xl bg-surface border border-white/40 shadow-2xl  p-8"
              variants={cardHoverVariants}
              whileHover="hover"
            >
              <>
                <h2 className="text-2xl font-bold text-center">
                  Sign in to your account
                </h2>

                <p className="text-sm text-center text-slate-600">
                  Secure access for registered customers & government users
                </p>

                <AnimatePresence>
                  {sessionExpired && (
                    <motion.div
                      className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ⚠️ Your session has expired. Please log in again.
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <input
                    type="email"
                    placeholder="xyz@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="theme-input w-full px-4 py-3 rounded-xl border-0 shadow-2xl"
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="theme-input w-full px-4 py-3 rounded-xl pr-12 border-0 shadow-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-sm text-slate-500"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 btn-theme-primary rounded-xl font-semibold animate-gradient"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </motion.button>
                </form>
              </>

              <p className="text-xs text-center text-slate-500 mt-3">
                🔒 Secure login · Role-based access · GeM-ready
              </p>
              <p className="mt-6 text-sm text-center text-slate-600">
                Don’t have an account?{" "}
                <Link to="/register" className="font-semibold text-indigo-600">
                  Create one
                </Link>
              </p>
            </motion.div>
          }
        </motion.div>
      </div>
    </motion.div>
  );
}
