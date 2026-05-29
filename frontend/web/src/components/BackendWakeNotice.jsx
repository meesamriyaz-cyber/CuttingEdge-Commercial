import { AnimatePresence, motion as Motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, WifiOff, X } from "lucide-react";
import { warmBackend } from "../api/backendWakeMonitor";
import { useBackendWakeStore } from "../store/backendWakeStore";

export default function BackendWakeNotice() {
  const visible = useBackendWakeStore((state) => state.visible);
  const status = useBackendWakeStore((state) => state.status);
  const dismiss = useBackendWakeStore((state) => state.dismiss);

  const isReady = status === "ready";
  const isIssue = status === "issue";

  return (
    <AnimatePresence>
      {visible && (
        <Motion.aside
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-sm overflow-hidden rounded-lg border border-cyan-200/80 bg-white/94 shadow-[0_24px_64px_-34px_rgba(8,16,29,0.55)] backdrop-blur-xl dark:border-cyan-900/60 dark:bg-slate-950/94 sm:bottom-6 sm:right-6 sm:left-auto sm:mx-0"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          role="status"
          aria-live="polite"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-orange-400 to-cyan-400" />
          <div className="flex items-start gap-3 p-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isIssue
                  ? "bg-red-50 text-red-600 dark:bg-red-950/35 dark:text-red-300"
                  : isReady
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-300"
                    : "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/35 dark:text-cyan-300"
              }`}
            >
              {isIssue ? (
                <WifiOff className="h-5 w-5" />
              ) : isReady ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                    {isIssue
                      ? "Taking longer than usual"
                      : isReady
                        ? "Ready"
                        : "Getting things ready"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isIssue
                      ? "Please try again in a moment."
                      : isReady
                        ? "You can continue now."
                        : "This may take a few seconds."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  aria-label="Dismiss status"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  {!isIssue && !isReady && (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>
                    {isIssue ? "Still trying" : isReady ? "Ready" : "Please hold"}
                  </span>
                </div>

                {isIssue && (
                  <button
                    type="button"
                    onClick={() => warmBackend({ force: true })}
                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-900/60 dark:bg-cyan-950/35 dark:text-cyan-200 dark:hover:bg-cyan-950/55"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </Motion.aside>
      )}
    </AnimatePresence>
  );
}
