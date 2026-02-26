import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import BrandMarquee from "./BrandMarquee";

export default function HeroLeftContent({
  hideCTA = true,
  clientType = "PRIVATE",
}) {
  const [showGemBadge, setShowGemBadge] = useState(
    typeof window !== "undefined" && window.innerWidth >= 760
  );

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleResize = () =>
      setShowGemBadge(window.innerWidth >= 760);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.section
      className="
        relative flex flex-col
        items-center lg:items-start
        justify-center
        text-center lg:text-left
        w-full h-full 
      "
      variants={containerVariants}
    >
      {/* GeM badge */}
      
      {showGemBadge && (
        <div className="absolute top-0 right-0">
        <span className="absolute right-1 top-3 font-bold text-sm bg-linear-to-r from-indigo-600 via-cyan-600 to-pink-500
          bg-clip-text text-transparent">4.5 Stars</span>
          <img
            src="/assets/images/gem_logo.webp"
            alt="Authorized GeM Seller"
            className="w-28 object-contain opacity-90"
          />
        </div>
      )}

      {/* Headline */}
      <motion.h1
        variants={heroTextVariants}
        custom={0.1}
        className="
          mt-0
          text-3xl md:text-4xl lg:text-6xl
          font-extrabold tracking-tight
          bg-linear-to-r from-indigo-600 via-cyan-600 to-pink-500
          bg-clip-text text-transparent
        "
      >
        Integrated Procurement & Service Platform
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={heroTextVariants}
        custom={0.2}
        className="
          mt-4 max-w-md
          text-base md:text-lg
          text-slate-600
        "
      >
        Buy products, manage quotations, and access professional services —
        trusted by businesses, institutions, and government departments.
      </motion.p>

      {/* CTA */}
      {!user && (
        <div className="mt-8 flex gap-4 flex-wrap justify-center lg:justify-start">
          <Link
            to="/products-guest"
            className="
              btn-theme-primary animate-gradient
              px-7 py-3.5 rounded-xl
              font-semibold flex items-center gap-2
            "
          >
            <PackageSearch size={18} />
            Browse Products
          </Link>

          <Link
            to="/services"
            className="
              btn-theme-primary animate-gradient
              px-7 py-3.5 rounded-xl
              font-semibold flex items-center gap-2
            "
          >
            <Wrench size={18} />
            Explore Services
          </Link>
        </div>
      )}

      {/* 🔥 TRUST STRIP — PERFECT SPOT */}
      <div className="mt-6 pt-0 border-t border-slate-200/60 w-full max-w-md">
       { clientType !== "PRIVATE" || clientType !== "PUBLIC" ? <BrandMarquee /> : <BrandTrustStrip clientType={clientType} />}
      </div>

      {!hideCTA && <div className="mt-8" />}
    </motion.section>
  );
}
