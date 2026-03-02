import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  heroTextVariants,
  containerVariants,
} from "../utils/animations";
import BrandTrustStrip from "./BrandTrustStrip";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  PackageSearch,
  Wrench,
  ArrowRight,
  Star,
} from "lucide-react";
import BrandMarquee from "./BrandMarquee";

export default function HeroLeftContent({
  hideCTA = true,
  clientType = "PRIVATE",
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <motion.section
      className="relative flex flex-col items-center lg:items-start justify-center text-center lg:text-left w-full h-full pr-4"
      variants={containerVariants}
    >
      {/* Tagline */}
      <motion.div
        variants={heroTextVariants}
        custom={0}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6"
      >
        <Star size={14} className="text-emerald-500" fill="currentColor" />
        Trusted Partner for Businesses
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={heroTextVariants}
        custom={0.1}
        className="mt-0 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-800 dark:text-white leading-[1.1]"
      >
        Products & Services{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
          Made Simple
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={heroTextVariants}
        custom={0.2}
        className="mt-6 max-w-lg text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
      >
        Discover quality products and professional services tailored for your business needs. 
        Trusted by enterprises across sectors.
      </motion.p>

      {/* CTA */}
      {!user && (
        <motion.div
          variants={heroTextVariants}
          custom={0.3}
          className="mt-8 flex gap-4 flex-wrap justify-center lg:justify-start"
        >
          <Link
            to="/products-guest"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            <PackageSearch size={18} />
            Browse Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/services"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
          >
            <Wrench size={18} />
            Explore Services
          </Link>
        </motion.div>
      )}

      {/* Trust Strip */}
      <motion.div
        variants={heroTextVariants}
        custom={0.4}
        className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 w-full max-w-lg"
      >
        {clientType !== "PRIVATE" || clientType !== "PUBLIC" ? (
          <BrandMarquee />
        ) : (
          <BrandTrustStrip clientType={clientType} />
        )}
      </motion.div>

      {!hideCTA && <div className="mt-8" />}
    </motion.section>
  );
}
