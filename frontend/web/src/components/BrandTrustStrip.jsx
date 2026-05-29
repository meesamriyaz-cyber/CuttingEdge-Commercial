import { motion as Motion } from "framer-motion";

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
      "OEM and infrastructure brands across procurement and service workflows.",
  },
  PRIVATE: {
    heading: "Brands in our catalogue",
    description:
      "Selected devices, accessories, and infrastructure brands.",
  },
  DEFAULT: {
    heading: "Brands in our catalogue",
    description:
      "A focused set of product and service-backed supply brands.",
  },
};

export default function BrandTrustStrip({ clientType }) {
  const brands = clientType === "PUBLIC" ? PUBLIC_BRANDS : PRIVATE_BRANDS;
  const copy = COPY_BY_TYPE[clientType] || COPY_BY_TYPE.DEFAULT;

  return (
    <section className="w-full mt-10 sm:mt-12">
      <div className="w-[90%] max-w-7xl mx-auto">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Trusted brands
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              {copy.description}
            </p>
          </div>
        </div>

        <Motion.div
          className="glass-premium rounded-lg p-3 sm:p-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {brands.map((src, index) => (
              <Motion.div
                key={`${src}-${index}`}
                className="flex min-h-20 items-center justify-center rounded-lg border border-slate-200/80 bg-white/74 p-3 shadow-[0_14px_30px_-28px_rgba(8,16,29,0.6)] transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/90 dark:border-cyan-950/50 dark:bg-slate-950/45 dark:hover:border-cyan-800"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <img
                  src={src}
                  alt="Brand partner"
                  className="max-h-10 w-auto object-contain opacity-85 sm:max-h-12"
                />
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
