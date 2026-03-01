import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import ServiceCardSkeleton from "../../components/ServiceCardSkeleton";
import BrandLogos from "../../components/BrandLogos";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import BrandTrustStrip from "../../components/BrandTrustStrip";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

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
    <section className="bg-surface dark:bg-surface-alt min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            Professional Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Our Professional Services
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive IT solutions tailored to your business needs. From networking to maintenance, we've got you covered.
          </p>
        </motion.div>

        <BrandTrustStrip page="services" />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center"
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-4 sm:p-6"
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
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
                className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="ALL">All categories</option>
                <option value="Networking">Networking</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repairs">Repairs</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-4">
          {loading
            ? [...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)
            : filteredServices.map((service, idx) => (
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
