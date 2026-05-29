import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import {
  ArrowLeft,
  ClipboardCheck,
  LogIn,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const SERVICE_POINTS = [
  "Requirement assessment and scope confirmation",
  "Clear quotation or AMC proposal before work begins",
  "Service updates through the customer workspace",
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`${API_URL}/services/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Service not found");
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen bg-page px-4 py-12">
        <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Wrench className="mx-auto h-10 w-10 animate-pulse text-cyan-600 dark:text-cyan-300" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading service details...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-page px-4 py-12">
        <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-red-900/20">
          <h1 className="text-xl font-semibold text-red-700 dark:text-red-200">
            Service unavailable
          </h1>
          <p className="mt-2 text-sm text-red-600 dark:text-red-200">
            {error}
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          Back to services
        </Link>

        <div className="hero-shell rounded-lg p-6 sm:p-8">
          <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {service.category || "Professional Service"}
          </span>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {service.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {service.longDescription || service.description}
              </p>
            </div>

            <div className="relative z-10 rounded-lg border border-slate-200 bg-white/78 p-4 shadow-[0_18px_40px_-32px_rgba(8,16,29,0.55)] backdrop-blur dark:border-cyan-950/50 dark:bg-slate-950/42">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Pricing
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {user || service.showRateToGuests
                  ? service.rateLabel || "Quote based"
                  : "Available after sign-in"}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Final pricing depends on scope, location, and support level.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SERVICE_POINTS.map((point, index) => {
            const icons = [ClipboardCheck, ShieldCheck, Wrench];
            const Icon = icons[index] || ClipboardCheck;

            return (
              <div
                key={point}
                className="theme-card rounded-lg p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                  {point}
                </p>
              </div>
            );
          })}
        </div>

        <div className="theme-card rounded-lg p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Continue with this service
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {user
              ? "Submit your requirement and track quote updates from your workspace."
              : "Sign in to submit your requirement and track quote updates from your workspace."}
          </p>

          <Link
            to={user ? `/services/enquiry/${service.slug}` : "/login"}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#07111f_0%,#0f766e_58%,#d97706_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-26px_rgba(8,16,29,0.76)] transition hover:-translate-y-0.5"
          >
            {user ? "Request Service" : "Sign in to continue"}
            {!user && <LogIn className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
