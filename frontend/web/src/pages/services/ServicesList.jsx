import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import ServiceCardSkeleton from "../../components/ServiceCardSkeleton";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";
import { Search, Filter, ClipboardCheck, FileText, Wrench, CheckCircle2 } from "lucide-react";
import { API_URL } from "../../api/client";

const SERVICE_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Submit Requirement",
    text: "Share the issue, location, or installation need.",
  },
  {
    icon: FileText,
    title: "Receive Quote",
    text: "Get a clear estimate or AMC proposal.",
  },
  {
    icon: Wrench,
    title: "Service Execution",
    text: "Technician support, installation, or repair work.",
  },
  {
    icon: CheckCircle2,
    title: "Closure Support",
    text: "Completion update and after-service assistance.",
  },
];

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load services");
        setServices(data);
      } catch (err) {
        console.error("Error loading services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "ALL" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-page relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-shell grid gap-6 rounded-lg p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-end"
        >
          <div className="relative z-10">
            <span className="signal-chip inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full">
              Professional Services
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 dark:text-white">
              Service support without guesswork.
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Compare installation, AMC, repair, and development services before
              signing in. Each service has a detail page so customers know the
              scope before raising a request.
            </p>
          </div>

          <div className="relative z-10 rounded-lg border border-slate-200 bg-white/80 p-4 shadow-[0_18px_40px_-32px_rgba(8,16,29,0.55)] backdrop-blur dark:border-cyan-950/50 dark:bg-slate-950/45">
            <div className="text-3xl font-bold text-slate-950 dark:text-white">
              {services.length || 5}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Active service workflows for offices, homes, and institutions.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="tech-panel rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        {!isAuthenticated && (
          <div className="glass-premium flex items-start gap-3 rounded-lg p-4">
            <Search className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Browse first, continue after sign-in
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review services and support categories now. After sign-in, you can request service and continue with pricing or quote workflows.
              </p>
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center"
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-premium rounded-lg p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="theme-input w-full pl-12 pr-4"
              />
            </div>

            {/* Category Select */}
            <div className="relative sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="theme-input w-full cursor-pointer appearance-none pl-12 pr-10"
              >
                <option value="ALL">All categories</option>
                <option value="Networking">Networking</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repairs">Repairs</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-4">
          {loading
            ? [...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)
            : filteredServices?.map((service, idx) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  index={idx}
                  isAuthenticated={isAuthenticated}
                />
              ))}
        </div>

        {/* No Results Message */}
        {!loading && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No services found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
