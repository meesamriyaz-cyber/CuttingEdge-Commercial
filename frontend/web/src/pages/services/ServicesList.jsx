import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import ServiceCardSkeleton from "../../components/ServiceCardSkeleton";
import BrandLogos from "../../components/BrandLogos";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import BrandTrustStrip from "../../components/BrandTrustStrip";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

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
        console.log("Attempting to fetch services from /api/services");
        const res = await fetch("/api/services");
        console.log("Response status:", res.status, res.statusText);
        
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

  const categories = [
    { value: "ALL", label: "All Services" },
    { value: "Networking", label: "Networking" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Repairs", label: "Repairs" },
    { value: "Enterprise", label: "Enterprise" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200/30 to-emerald-200/30 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Sparkles size={16} />
              Professional Services
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Our{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Professional Services
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto mb-8"
            >
              Comprehensive IT solutions tailored to your business needs. 
              From networking to maintenance, we've got you covered.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {[
                "GeM Registered",
                "ISO Certified",
                "15+ Years Experience",
                "24/7 Support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-400">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f1f5f9" className="dark:fill-slate-800" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center mb-8"
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-6 mb-10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
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
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 text-lg"
              />
            </div>

            {/* Category Select */}
            <div className="relative lg:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer text-lg"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400 self-center mr-2">Popular:</span>
            {["Network Installation", "AMC Maintenance", "Repairs", "Enterprise Solutions"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSearch(filter)}
                className="px-4 py-2 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredServices.length}</span> services
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              No services found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("ALL");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Clear Filters <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        {!loading && filteredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Contact us for customized IT solutions tailored to your specific requirements. 
                Our expert team is ready to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@cuttingedgeenterprises.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
                >
                  Contact Us
                  <ArrowRight size={20} />
                </a>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors"
                >
                  Request Callback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Brand Trust Strip */}
      <div className="py-8">
        <BrandTrustStrip page="services" />
      </div>
    </div>
  );
}
