import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Network,
  ShieldCheck,
  Wrench,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
  "amc-maintenance": "from-blue-500 to-indigo-600",
  "repairs-troubleshooting": "from-orange-500 to-amber-600",
  "enterprise-it-solutions": "from-violet-500 to-purple-600",
};

/**
 * Badge color mapping for each service type
 */
const BADGE_COLOR_MAP = {
  "office-network-installation":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "amc-maintenance":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "repairs-troubleshooting":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "enterprise-it-solutions":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

export default function ServiceCard({ service, index, isAuthenticated }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[service.slug] || Building2;
  const gradient = GRADIENT_MAP[service.slug] || "from-emerald-600 to-teal-500";
  const badgeColor =
    BADGE_COLOR_MAP[service.slug] ||
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";

  const canShowRate = isAuthenticated || service.showRateToGuests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-500">
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Gradient Border Effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]`}
        >
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl" />
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-7">
          {/* Header with Icon and Badge */}
          <div className="flex items-start justify-between mb-5">
            <motion.div
              className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-7 h-7 text-white" />
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-lg opacity-50 group-hover:opacity-70 transition-opacity`}
              />
            </motion.div>

            {/* Service Type Badge */}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              Service
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-500 transition-all duration-300">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 line-clamp-2">
            {service.description}
          </p>

          {/* Pricing */}
          <div className="mb-5">
            {canShowRate ? (
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${badgeColor}`}
              >
                <span className="text-sm font-bold">{service.rateLabel}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Login to view pricing
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={`/services/enquiry/${service.slug}`}
                className={`group/btn relative flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25`}
              >
                <span className="relative z-10">Enquire Now</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
