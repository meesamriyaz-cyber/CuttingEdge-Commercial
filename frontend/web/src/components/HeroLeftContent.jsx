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
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui";

const AUTH_TRUST_POINTS = [
  {
    icon: PackageSearch,
    title: "Products",
    text: "Browse catalogue, check stock, and order directly.",
  },
  {
    icon: Wrench,
    title: "Services",
    text: "Request AMC, installation, repairs, and support.",
  },
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
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950 shadow-[0_18px_34px_-26px_rgba(0,0,0,0.72)]">
              <ShieldCheck size={21} />
            </div>
            <p className="text-sm font-semibold text-white">
              Commercial access portal
            </p>
          </div>

          <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl">
            One workspace for products, quotations, and service.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cyan-50/85 sm:text-base">
            Sign in once and continue into the right commercial path — private order, procurement enquiry, or service request.
          </p>
        </div>
      </Motion.div>

      <Motion.div
        variants={heroTextVariants}
        custom={0.3}
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
