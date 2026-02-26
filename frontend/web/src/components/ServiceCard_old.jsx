import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index, onEnquire }) {
  const navigate = useNavigate();
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/services/${service.slug}`)}
      className="group flex items-center gap-4 rounded-xl border border-border
                 bg-white dark:bg-surface p-4 cursor-pointer
                 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      {/* LEFT */}
      <div className="flex-shrink-0">
        <img
          src={service.image}
          alt={service.title}
          className="hidden sm:block w-20 h-20 object-contain rounded-lg
                     bg-muted/30 dark:bg-muted/20 p-2"
        />

        <div className="sm:hidden w-12 h-12 flex items-center justify-center
                        rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">
          {service.title}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {service.desc}
        </p>

        <div className="mt-2 text-xs">
          <span className="text-muted-foreground uppercase tracking-wide">
            Rate:
          </span>{" "}
          <span className="font-medium text-foreground">
            {service.rate}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onEnquire(service);
        }}
      >
       <Link
        to={`/enquiry-guest?service=${service.slug}`}
        className="inline-flex items-center gap-1 rounded-lg
                    btn-theme-primary px-4 py-2 text-xs font-medium text-primary
                    hover:bg-primary hover:text-white transition-colors"
        >
        Enquire →
        </Link>

      </div>
    </motion.div>
  );
}
