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
          ? "mt-5 w-full max-w-md overflow-hidden"
          : "mt-10 flex w-full overflow-hidden items-center"
      }
    >
      <p
        className="text-sm sm:text-md font-bold uppercase tracking-wider mb-3 bg-linear-to-r from-indigo-600 via-cyan-600 to-pink-500
            bg-clip-text text-transparent"
      >
        {clientType === "PUBLIC" || clientType === "PRIVATE"
          ? "Leading Brands"
          : "Authorized Services For"}
      </p>

      <motion.div
        className="flex items-center gap-6 sm:gap-8 w-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...brands, ...brands].map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Brand partner"
            className="object-contain opacity-80 hover:opacity-100 transition w-12 h-12 sm:w-14 sm:h-14"
          />
        ))}
      </motion.div>
    </div>
  );
}
