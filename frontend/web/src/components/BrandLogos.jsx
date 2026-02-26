import { motion } from "framer-motion";
import {
  SiDell,
  SiHp,
  SiAsus,
  SiHitachi,
  SiXiaomi,
  SiRealm,
} from "react-icons/si";
import { Tablet as TvseIcon, Monitor as BenqIcon } from "lucide-react";

const brands = [
  { name: "Dell", icon: SiDell },
  { name: "HP", icon: SiHp },
  { name: "TVSe", icon: TvseIcon },
  { name: "Asus", icon: SiAsus },
  { name: "Benq", icon: BenqIcon },
  { name: "Hitachi", icon: SiHitachi },
  { name: "Mi", icon: SiXiaomi },
  { name: "Realme", icon: SiRealm },
];

export default function BrandLogos() {
  return (
      <div className="max-w-6xl mx-auto px-6 py-[-4rem]">
        <h2 className="text-sm font-bold text-center tracking-widest text-muted uppercase mb-6
        bg-linear-to-r from-indigo-600 via-cyan-600 to-pink-500
          bg-clip-text text-transparent">
          Authorized Services For
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all"
            >
              <brand.icon className="w-9 h-9 md:w-11 md:h-11 text-muted-foreground hover:text-primary transition-colors" />
              <span className="text-[10px] tracking-widest text-muted uppercase">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
  );
}
