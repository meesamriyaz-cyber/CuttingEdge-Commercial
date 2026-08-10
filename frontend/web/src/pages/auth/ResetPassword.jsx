import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { resetPassword } from "../../api/passwordReset";
import { Button } from "../../components/ui";
import { fadeInVariants } from "../../utils/animations";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      toast.success("Password reset successful");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Motion.div
        className="flex min-h-[calc(100vh-4rem)] items-center bg-page px-4 py-8 sm:px-6 sm:py-10"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="auth-form-transparent rounded-lg p-6 sm:p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invalid Link</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-orange-600 dark:text-cyan-300">
              <ArrowLeft size={15} />
              Request a new link
            </Link>
          </div>
        </div>
      </Motion.div>
    );
  }

  if (success) {
    return (
      <Motion.div
        className="flex min-h-[calc(100vh-4rem)] items-center bg-page px-4 py-8 sm:px-6 sm:py-10"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="auth-form-transparent rounded-lg p-6 sm:p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-200">
              <Check size={22} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Password Reset</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your password has been reset successfully.
            </p>
            <Link to="/login" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-orange-600 dark:text-cyan-300">
              <ArrowLeft size={15} />
              Back to login
            </Link>
          </div>
        </div>
      </Motion.div>
    );
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
              New Password
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter a new password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="field-3d space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    className="theme-input pr-10"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    className="theme-input pr-10"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
              Reset Password
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-semibold text-cyan-700 hover:text-orange-600 dark:text-cyan-300">
                <ArrowLeft size={14} className="inline mr-1" />
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Motion.div>
  );
}
