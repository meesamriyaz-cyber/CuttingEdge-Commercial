import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Network, ShieldCheck, Wrench, Building2 } from "lucide-react";

/**
 * Local icon mapping (UI concern, NOT DB)
 */
const ICON_MAP = {
  "office-network-installation": Network,
  "amc-maintenance": ShieldCheck,
  "repairs-troubleshooting": Wrench,
  "enterprise-it-solutions": Building2,
};

/**
 * Gradient color mapping for each service type
 */
const GRADIENT_MAP = {
  "office-network-installation": "from-emerald-500 to-teal-600",
  "amc-maintenance": "from-emerald-500 to-teal-600",
  "repairs-troubleshooting": "from-orange-500 to-amber-600",
  "enterprise-it-solutions": "from-emerald-500 to-teal-600",
};

export default function ServiceCard({ service, index, isAuthenticated }) {
  const navigate = useNavigate();

  const Icon = ICON_MAP[service.slug] || Building2;
  const gradient = GRADIENT_MAP[service.slug] || "from-emerald-600 to-teal-500";

  const canShowRate = isAuthenticated || service.showRateToGuests;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on any button or link inside the card
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    // Navigate to service detail (disabled for now since route doesn't exist)
    // navigate(`/services/${service.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      // onClick={handleCardClick}
      className="
        group relative overflow-hidden
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
        rounded-2xl
        p-5 sm:p-6
        cursor-pointer
        shadow-lg hover:shadow-xl
        hover:border-emerald-500/50 dark:hover:border-emerald-400/50
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* LEFT ICON */}
      <div className="shrink-0 mb-4 sm:mb-0 sm:absolute sm:top-6 sm:left-6">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="sm:pl-20 flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {service.name}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* RATE */}
        <div className="mt-4 flex items-center gap-3">
          {canShowRate ? (
            <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {service.rateLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              Login to view pricing
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          {isAuthenticated ? (
            <Link
              to={`/services/enquiry/${service.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              Enquire Now
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
