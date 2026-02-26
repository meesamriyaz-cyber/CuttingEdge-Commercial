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

export default function ServiceCard({ service, index, isAuthenticated }) {
  const navigate = useNavigate();

  const Icon =
    ICON_MAP[service.slug] || Building2; // safe fallback

  const canShowRate =
    isAuthenticated || service.showRateToGuests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/services/${service.slug}`)}
      className="
        group flex items-center gap-4
        rounded-2xl bg-surface
        border border-border/60
        p-5 cursor-pointer
        shadow-[0_1px_6px_rgba(0,0,0,0.06)]
        hover:border-primary/40
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
        transition-all
      "
    >
      {/* LEFT ICON */}
      <div className="shrink-0">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 space-y-2">
        <h3 className="text-sm font-semibold hero-gradient-text">
          {service.name}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {service.description}
        </p>

        {/* RATE */}
        <div className="pt-2 flex items-center gap-3">
          {canShowRate ? (
            <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              {service.rateLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              Login to view pricing
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              to={`/services/enquiry?service=${service.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="btn-theme-primary px-4 py-2 text-xs rounded-lg"
            >
              Enquire Now
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex rounded-lg border border-primary/30 px-3 py-1.5
                           text-xs font-medium text-primary
                           hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5
                           text-xs font-medium text-primary
                           hover:bg-primary hover:text-white transition-colors"
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
