import { motion } from "framer-motion";

// PUBLIC brands
import teachmint from "../assets/images/teachmint-x.webp";
import microtek from "../assets/images/microtek.png";
import ocimum from "../assets/images/ocimum.png";
import promark from "../assets/images/promark.png";
import hp from "../assets/images/hp.jpg";
import dell from "../assets/images/dell.png";
import benq from "../assets/images/benq.png";

// PRIVATE brands
import lenovo from "../assets/images/lenovo.png";
import asus from "../assets/images/asus.png";
import realme from "../assets/images/realme.jpg";
import mi from "../assets/images/mi.png";

import { useAuthStore } from "../store/authStore";
export default function BrandTrustStrip({ clientType, page }) {
  const brands =
    clientType === "PUBLIC"
      ? [teachmint, microtek, ocimum, promark, hp, dell, benq]
      : [hp, dell, lenovo, asus, realme, microtek, mi];

  return (
    <div
      className={
        page !== "services"
          ? "w-full mt-6 sm:mt-8 overflow-hidden"
          : "w-full mt-8 sm:mt-12 overflow-hidden"
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              Trusted Partners
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {clientType === "PUBLIC" || clientType === "PRIVATE"
              ? "Leading Brands"
              : "Authorized Services For"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {clientType === "PUBLIC" || clientType === "PRIVATE"
              ? "We partner with industry-leading brands to deliver quality products and services."
              : "Our authorized service centers ensure your devices receive expert care."}
          </p>
        </div>

        {/* Brand Logo Container */}
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white dark:from-slate-900 z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white dark:from-slate-900 z-10 pointer-events-none" />

          {/* Scrolling brand logos */}
          <div className="overflow-hidden py-4 sm:py-6 lg:py-8">
            <motion.div
              className="flex items-center gap-4 sm:gap-6 lg:gap-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
              {[...brands, ...brands].map((src, i) => (
                <div key={i} className="flex-shrink-0 px-2 sm:px-3">
                  <div className="relative px-3 sm:px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-lg">
                    <img
                      src={src}
                      alt="Brand partner"
                      className="object-contain w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics Cards (only show on non-services pages) */}
        {page !== "services" && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { value: "2+", label: "Years Experience" },
              { value: "100+", label: "Happy Clients" },
              { value: "20+", label: "Brand Partners" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
