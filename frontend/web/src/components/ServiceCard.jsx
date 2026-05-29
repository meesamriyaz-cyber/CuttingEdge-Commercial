import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Network, ShieldCheck, Wrench, Building2, Code2 } from "lucide-react";

/**
 * Local icon mapping (UI concern, NOT DB)
 */
const ICON_MAP = {
  "office-network-installation": Network,
  "amc-maintenance": ShieldCheck,
  "repairs-troubleshooting": Wrench,
  "enterprise-it-solutions": Building2,
  "web-development": Code2,
};

const SERVICE_META = {
  "office-network-installation": ["Site survey", "Secure setup", "Wi-Fi & LAN"],
  "amc-maintenance": ["Preventive checks", "Priority support", "AMC reports"],
  "repairs-troubleshooting": ["Diagnostics", "On-site support", "Parts guidance"],
  "enterprise-it-solutions": ["Procurement", "Deployment", "Managed support"],
  "web-development": ["Websites", "Web apps", "Deployment"],
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
         theme-card
         rounded-lg
         p-5 sm:p-6
         transition-all duration-300
         hover:-translate-y-1
         hover:border-cyan-300 dark:hover:border-cyan-800
       "
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-slate-900 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* LEFT ICON */}
      <div className="shrink-0 mb-4 sm:mb-0 sm:absolute sm:top-6 sm:left-6">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#07111f_0%,#0f766e_58%,#d97706_100%)] text-white shadow-[0_18px_38px_-26px_rgba(8,16,29,0.76)]"
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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
              className="rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* RATE */}
        <div className="mt-4 flex items-center gap-3">
          {canShowRate ? (
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/25 dark:text-orange-300">
              {service.rateLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              Pricing available after sign-in
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/88 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_14px_30px_-26px_rgba(8,16,29,0.62)] transition-all duration-200 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-800 dark:hover:text-cyan-300"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>

          {isAuthenticated ? (
            <Link
              to={`/services/enquiry/${service.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[linear-gradient(135deg,#07111f_0%,#0f766e_58%,#d97706_100%)] text-white font-semibold text-sm shadow-[0_18px_38px_-26px_rgba(8,16,29,0.76)] hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-26px_rgba(15,118,110,0.42)] transition-all duration-200"
            >
              Request Service
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#07111f_0%,#0f766e_58%,#d97706_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-26px_rgba(8,16,29,0.76)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign in to continue
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
