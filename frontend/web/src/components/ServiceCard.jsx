import { Link } from "react-router-dom";
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

const SERVICE_META = {
  "office-network-installation": ["Site survey", "Secure setup", "Wi-Fi & LAN"],
  "amc-maintenance": ["Preventive checks", "Priority support", "AMC reports"],
  "repairs-troubleshooting": ["Diagnostics", "On-site support", "Parts guidance"],
  "enterprise-it-solutions": ["Procurement", "Deployment", "Managed support"],
};

export default function ServiceCard({ service, index, isAuthenticated }) {
  const Icon = ICON_MAP[service.slug] || Building2;

  const canShowRate = isAuthenticated || service.showRateToGuests;
  const serviceTags = SERVICE_META[service.slug] || ["Assessment", "Quotation", "Support"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
       // onClick={handleCardClick}
       className="
         group relative overflow-hidden
         tech-panel
         rounded-lg
         p-5 sm:p-6
         cursor-pointer
         shadow-sm hover:shadow-md
         hover:border-orange-500/50 dark:hover:border-orange-400/50
         transition-all duration-300
         hover:-translate-y-0.5
       "
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 pointer-events-none bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* LEFT ICON */}
      <div className="shrink-0 mb-4 sm:mb-0 sm:absolute sm:top-6 sm:left-6">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-slate-950 dark:bg-cyan-500 shadow-sm"
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-slate-950" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="sm:pl-20 flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {service.name}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {serviceTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* RATE */}
        <div className="mt-4 flex items-center gap-3">
          {canShowRate ? (
            <span className="inline-flex rounded-full bg-orange-100 dark:bg-orange-900/40 px-4 py-1.5 text-sm font-semibold text-orange-700 dark:text-orange-300">
              {service.rateLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              Pricing available after sign-in
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          {isAuthenticated ? (
            <Link
              to={`/services/enquiry/${service.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-sm shadow-sm hover:bg-orange-700 hover:shadow-md transition-all duration-200"
            >
              Request Service
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 hover:shadow-md transition-all duration-200"
            >
              Sign in to continue
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
