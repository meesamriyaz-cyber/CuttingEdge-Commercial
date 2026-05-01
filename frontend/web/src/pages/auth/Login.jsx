import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Package, ShieldCheck, ArrowRight } from "lucide-react";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import HeroLeftContent from "../../components/HeroLeftContent";
import { Button, Input } from "../../components/ui";
import {
  authPageVariants,
  heroSideVariants,
  formSideVariants,
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
      className="min-h-screen bg-page px-4 sm:px-6 py-10 sm:py-14"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="hero-shell rounded-[28px] p-3 sm:p-4 shadow-[0_28px_64px_-44px_rgba(8,16,29,0.48)]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              variants={heroSideVariants}
              className="hidden rounded-[24px] tech-panel px-8 py-10 lg:block"
            >
              <HeroLeftContent hideCTA clientType="PRIVATE" />
            </motion.div>

            <motion.div variants={formSideVariants}>
              <div className="theme-card rounded-[24px] p-6 sm:p-8 lg:p-10">
                <div className="mb-7">
                  <div className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <ShieldCheck size={13} />
                    Secure access
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] text-white shadow-[0_18px_40px_-28px_rgba(8,16,29,0.82)]">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Sign in
                      </h1>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Continue your customer workspace in one place.
                      </p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {sessionExpired && (
                    <motion.div
                      className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Your session expired. Please sign in again.
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="panel-muted space-y-4 p-4 sm:p-5">
                    <Input
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    isLoading={loading}
                    className="w-full"
                  >
                    Sign In
                    {!loading && <ArrowRight size={16} />}
                  </Button>
                </form>

                <div className="mt-7 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    New here?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-cyan-700 transition-colors hover:text-orange-600 dark:text-cyan-300 dark:hover:text-orange-300"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck size={14} className="text-cyan-600 dark:text-cyan-300" />
                  One sign-in supports private commerce, public procurement, and service workflows.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
