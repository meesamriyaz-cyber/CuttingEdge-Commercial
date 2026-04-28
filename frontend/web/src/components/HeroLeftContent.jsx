import { motion } from "framer-motion";
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
  Star,
  Building2,
  Headphones,
  UserRound,
} from "lucide-react";
import { Button } from "./ui";

const AUTH_TRUST_POINTS = [
  {
    icon: UserRound,
    title: "Private customers",
    text: "Cart, checkout, orders, and post-purchase support.",
  },
  {
    icon: Building2,
    title: "Government customers",
    text: "Product enquiries, quotations, and procurement tracking.",
  },
  {
    icon: Headphones,
    title: "Shared services",
    text: "Installation, AMC, repairs, and support after login.",
  },
];

export default function HeroLeftContent({
  hideCTA = true,
}) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <motion.section
      className="relative flex flex-col items-center lg:items-start justify-center text-center lg:text-left w-full h-full pr-4"
      variants={containerVariants}
    >
      {/* Tagline */}
      <motion.div
        variants={heroTextVariants}
        custom={0}
        className="signal-chip inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
      >
        <Star size={14} className="text-cyan-500" fill="currentColor" />
        Trusted Partner for Businesses
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={heroTextVariants}
        custom={0.1}
        className="mt-0 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 dark:text-white leading-[1.1]"
      >
        Products & Services{" "}
        <span className="text-cyan-700 dark:text-cyan-300">
          Made Simple
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={heroTextVariants}
        custom={0.2}
        className="mt-5 max-w-lg text-base text-slate-600 dark:text-slate-300 leading-relaxed"
      >
        Discover quality products and professional services tailored for your business needs. 
        Trusted by enterprises across sectors.
      </motion.p>

      {/* CTA */}
      {!user && !hideCTA && (
        <motion.div
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
        </motion.div>
      )}

      {/* Compact trust points for auth screens */}
      <motion.div
        variants={heroTextVariants}
        custom={0.4}
        className="mt-8 grid gap-3 w-full max-w-lg"
      >
        {AUTH_TRUST_POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <div
              key={point.title}
              className="tech-panel flex items-start gap-3 rounded-lg p-4 shadow-sm"
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
      </motion.div>

    </motion.section>
  );
}
