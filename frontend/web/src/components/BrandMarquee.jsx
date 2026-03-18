import { motion } from "framer-motion";
import indianRailwayImage from "../assets/images/northern-railway.jpg";
import jkPoliceImage from "../assets/images/jkpolice.png";
import jkTourismImage from "../assets/images/jktourism.jpg";
import kvkImage from "../assets/images/kvk.webp";
import kvkBudgamImage from "../assets/images/kvk-budgam.png";
import universityOfKashmirImage from "../assets/images/uk.png";
import kvkSrinagarImage from "../assets/images/kvk-srinagar.jpg";
import rbSoporeImage from "../assets/images/R&B-sopore.jpg";
import skaustImage from "../assets/images/skaust.jpg";
import phq from "../assets/images/jk-phq.png";
import rbsopore from "../assets/images/R&B-sopore.jpg";

export default function BrandMarquee() {
  const brands = [
    { src: indianRailwayImage, alt: "Indian Railway" },
    { src: jkPoliceImage, alt: "JK Police" },
    { src: jkTourismImage, alt: "JK Tourism" },
    { src: kvkImage, alt: "KVK" },
    { src: kvkBudgamImage, alt: "KVK Budgam" },
    { src: universityOfKashmirImage, alt: "University of Kashmir" },
    { src: kvkSrinagarImage, alt: "kvk srinagar" },
    { src: rbSoporeImage, alt: "HP" },
    { src: skaustImage, alt: "skaust" },
    { src: phq, alt: "JK PHQ" },
    { src: rbsopore, alt: "R&B Sopore" },
  ];

  return (
    <div className="relative mt-6 overflow-hidden w-full max-w-md">
      <div className="text-xs uppercase tracking-wider text-center lg:text-left mb-3">
        <h1 className="text-sm font-semibold text-slate-500">Our Clients</h1>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 p-3">
        <motion.div
          className="flex gap-6 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {/* duplicate list for seamless loop */}
          {[...brands, ...brands].map((b, idx) => (
            <img
              key={idx}
              src={b.src}
              alt={b.alt}
              className="
                object-contain
                hover:grayscale-0 hover:opacity-100
                h-12 w-12
                scale-90  
                opacity-60 hover:opacity-100
                transition-all duration-300
              "
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
