import { motion } from "framer-motion";

import teachmint from "../assets/images/teachmint-x.webp";
import microtek from "../assets/images/microtek.png";
import ocimum from "../assets/images/ocimum.png";
import promark from "../assets/images/promark.png";
import hp from "../assets/images/hp.jpg";
import dell from "../assets/images/dell.png";
import benq from "../assets/images/benq.png";
import lenovo from "../assets/images/lenovo.png";
import asus from "../assets/images/asus.png";
import realme from "../assets/images/realme.jpg";
import mi from "../assets/images/mi.png";

const PUBLIC_BRANDS = [teachmint, microtek, ocimum, promark, hp, dell, benq];
const PRIVATE_BRANDS = [hp, dell, lenovo, asus, realme, microtek, mi];

const COPY_BY_TYPE = {
  PUBLIC: {
    heading: "Brands and supply partners",
    description:
      "Selected OEM and infrastructure partners used across procurement and service workflows.",
  },
  PRIVATE: {
    heading: "Brands in our catalogue",
    description:
      "Selected brands customers can browse across devices, accessories, and infrastructure products.",
  },
  DEFAULT: {
    heading: "Brands in our catalogue",
    description:
      "A focused set of brands across products, peripherals, and service-backed supply.",
  },
};

export default function BrandTrustStrip({ clientType }) {
  const brands = clientType === "PUBLIC" ? PUBLIC_BRANDS : PRIVATE_BRANDS;
  const copy = COPY_BY_TYPE[clientType] || COPY_BY_TYPE.DEFAULT;

  return (
    <section className="w-full mt-14 sm:mt-18">
      <div className="w-[90%] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Trusted brands
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {copy.heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {copy.description}
            </p>
          </div>
        </div>

        <motion.div
          className="tech-panel rounded-lg p-4 sm:p-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {brands.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-24 p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <img
                  src={src}
                  alt="Brand partner"
                  className="max-h-12 sm:max-h-14 w-auto object-contain opacity-85"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
