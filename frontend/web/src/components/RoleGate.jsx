import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleGate({
  allow = [],
  children,
  showFallback = false,
  fallback = null,
}) {
  const { user } = useAuthStore();

  if (!user) return null;

  if (!allow.includes(user.clientType)) {
    if (!showFallback) return fallback;

    const isPrivate = user.clientType === "PRIVATE";
    const accountLabel = isPrivate ? "private customer" : "government client";

    return (
      <div className="min-h-[60vh] bg-page px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="theme-card rounded-[24px] p-8 text-center">
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Account area
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              This page is not available for your account
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              You are signed in as a {accountLabel}. Use the dashboard built for
              your workflow to continue.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-26px_rgba(8,16,29,0.78)] transition-transform hover:-translate-y-0.5"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
