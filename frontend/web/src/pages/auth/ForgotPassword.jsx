import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { requestPasswordReset } from "../../api/passwordReset";
import { Button } from "../../components/ui";
import { fadeInVariants } from "../../utils/animations";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Motion.div
      className="flex min-h-[calc(100vh-4rem)] items-center bg-page px-4 py-8 sm:px-6 sm:py-10"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto w-full max-w-md">
        <div className="auth-form-transparent rounded-lg p-6 sm:p-8">
          <div className="mb-7 text-center">
            <div className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Password Reset
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="field-3d text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-200">
                <Mail size={22} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                If an account exists with that email, you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-orange-600 dark:text-cyan-300">
                <ArrowLeft size={15} />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="field-3d space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    className="theme-input mt-1"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
                Send Reset Link
                {!loading && <ArrowRight size={16} />}
              </Button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <Link to="/login" className="font-semibold text-cyan-700 hover:text-orange-600 dark:text-cyan-300">
                  <ArrowLeft size={14} className="inline mr-1" />
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
