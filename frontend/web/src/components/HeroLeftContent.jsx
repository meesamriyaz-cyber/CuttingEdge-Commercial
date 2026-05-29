import { motion as Motion } from "framer-motion";
import {
  heroTextVariants,
  containerVariants,
} from "../utils/animations";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  PackageSearch,
  Wrench,
  ArrowRight,
  Building2,
  BadgeCheck,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui";

const AUTH_TRUST_POINTS = [
  {
    icon: PackageSearch,
    title: "Catalogue desk",
    text: "Products, categories, and order-ready details stay easy to scan.",
  },
  {
    icon: Building2,
    title: "Procurement desk",
    text: "Enquiries, quotations, and department follow-up stay in one flow.",
  },
  {
    icon: LifeBuoy,
    title: "Service desk",
    text: "AMC, installation, repairs, and service quotes sit alongside supply.",
  },
];

const AUTH_METRICS = [
  { value: "2", label: "customer paths" },
  { value: "3", label: "workflows" },
  { value: "OEM", label: "supply focus" },
];

export default function HeroLeftContent({
  hideCTA = true,
}) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <Motion.section
      className="relative flex flex-col items-center lg:items-start justify-center text-center lg:text-left w-full h-full pr-4"
      variants={containerVariants}
    >
      <Motion.div variants={heroTextVariants} custom={0} className="auth-visual-panel w-full max-w-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950 shadow-[0_18px_34px_-26px_rgba(0,0,0,0.72)]">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="hidden text-lg font-extrabold uppercase tracking-wide text-cyan-50">
                  Cutting Edge Enterprises
                </p>
                <p className="text-sm font-semibold text-white">
                  Commercial access portal
                </p>
              </div>
            </div>
            <BadgeCheck className="h-5 w-5 text-orange-200" />
          </div>

          <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.65rem]">
            One workspace for products, quotations, and service.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-cyan-50/85 sm:text-base">
            Sign in once and continue into the right commercial path, whether it is a private order, public procurement enquiry, or service request.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {AUTH_METRICS.map((metric) => (
              <div key={metric.label} className="auth-metric-tile">
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100/80">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Motion.div>

      <Motion.h2
        variants={heroTextVariants}
        custom={0.1}
        className="mt-7 text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl"
      >
        Built for business buying,{" "}
        <span className="text-cyan-700 dark:text-cyan-300">
          not just browsing
        </span>
      </Motion.h2>

      <Motion.p
        variants={heroTextVariants}
        custom={0.2}
        className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
      >
        A cleaner front door for customers who need products, procurement paperwork, and support handled with the same level of care.
      </Motion.p>

      {!user && !hideCTA && (
        <Motion.div
          variants={heroTextVariants}
          custom={0.3}
          className="mt-8 flex gap-4 flex-wrap justify-center lg:justify-start"
        >
          <Button
            onClick={() => navigate("/products-guest")}
            className="group gap-2"
          >
            <PackageSearch size={18} />
            Browse Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/services")}
            className="gap-2"
          >
            <Wrench size={18} />
            Explore Services
          </Button>
        </Motion.div>
      )}

      <Motion.div
        variants={heroTextVariants}
        custom={0.4}
        className="mt-6 grid gap-3 w-full max-w-lg"
      >
        {AUTH_TRUST_POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <div
              key={point.title}
              className="auth-trust-row"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <Icon size={19} className="text-cyan-700 dark:text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {point.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {point.text}
                </p>
              </div>
            </div>
          );
        })}
      </Motion.div>

    </Motion.section>
  );
}
