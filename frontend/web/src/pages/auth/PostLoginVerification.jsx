import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import {
  resendGovtVerificationCodeApi,
  verifyGovtCodeApi,
} from "../../api/auth";
import { Button, Input } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

export default function PostLoginVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, logout } = useAuthStore();

  const deliveryState = location.state?.emailDelivery;
  const officialEmail = user?.officialEmail || user?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState(
    deliveryState?.sent === false
      ? "We could not send a fresh code automatically. Please use Resend code below."
      : "",
  );
  const [success, setSuccess] = useState(
    deliveryState?.sent
      ? `A fresh verification code was sent to ${officialEmail}.`
      : "",
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await verifyGovtCodeApi({ code });
      updateUser(data.user);
      setSuccess("Account verified. Opening your procurement workspace...");
      setTimeout(() => navigate("/enquiries", { replace: true }), 500);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const data = await resendGovtVerificationCodeApi();
      if (data.user) updateUser(data.user);
      setSuccess(data.message || `Verification code sent to ${officialEmail}.`);
    } catch (err) {
      setError(err.message || "Could not resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="hidden lg:block">
          <div className="max-w-md">
            <span className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck size={13} />
              Government verification
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Confirm the official email for this account.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Verification keeps procurement enquiries, quotations, and
              department communication attached to the right official contact.
            </p>
          </div>
        </section>

        <motion.section
          className="theme-card rounded-[24px] p-6 shadow-[0_24px_60px_-42px_rgba(8,16,29,0.5)] sm:p-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="mb-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">
              <Mail size={22} />
            </div>
            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
              Enter verification code
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Use the 6-digit code sent to your official email. You can request
              a new code anytime if the earlier one expired or was not received.
            </p>
          </div>

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

            {success && (
              <motion.div
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="panel-muted space-y-4 p-4 sm:p-5">
              <Input
                label="Official email"
                type="email"
                value={officialEmail}
                readOnly
                className="cursor-not-allowed"
              />

              <Input
                label="Verification code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                required
                placeholder="Enter 6-digit code"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              isLoading={loading}
              className="w-full"
            >
              Complete Verification
            </Button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleResend}
              disabled={resendLoading}
              isLoading={resendLoading}
              className="w-full"
            >
              {!resendLoading && <RefreshCw size={16} />}
              Resend Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
