import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { getCategories } from "../../api/products";
import LayoutContainer from "../../components/LayoutContainer";
import { containerVariants, fadeInVariants } from "../../utils/animations";
import { Package, FolderOpen, ArrowRight, Loader2, Search, Grid3X3, LayoutGrid, Sparkles, ArrowLeft } from "lucide-react";

const categoryIcons = {
  laptops: "💻", phones: "📱", accessories: "🎧", servers: "🖥️", workstations: "🖥️", printers: "🖨️",
  monitors: "🖥️", storage: "💾", networking: "🌐", software: "💿", desktops: "🖥️", tablets: "📱",
  cameras: "📷", audio: "🔊", video: "📹", default: "📦",
};

const categoryGradients = [
  "from-emerald-400 to-teal-600", "from-teal-400 to-cyan-600", "from-cyan-400 to-blue-600",
  "from-blue-400 to-indigo-600", "from-emerald-300 to-teal-500", "from-teal-300 to-emerald-500",
  "from-emerald-500 to-teal-400", "from-teal-500 to-emerald-400",
];

export default function CategoryList() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const clientType = user?.clientType;
  const isGovt = clientType === "PUBLIC";

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-6 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <motion.div className="w-[95%] sm:w-[90%] max-w-7xl mx-auto py-8 sm:py-12" initial="hidden" animate="visible" variants={fadeInVariants}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={18} /><span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        <div className="text-center mb-10 sm:mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {isGovt ? "Government Procurement Portal" : "Premium Product Catalog"}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            Browse by Category
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            {isGovt ? "Explore our curated selection of commercial products designed for government and institutional procurement" : "Discover our wide range of quality products organized for easy browsing"}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search categories..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-white">{filteredCategories.length}</span> {filteredCategories.length === 1 ? "category" : "categories"}
              </p>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}><LayoutGrid className="h-4 w-4" /></button>
                <button onClick={() => setViewMode("compact")} className={`p-2.5 rounded-lg transition-all ${viewMode === "compact" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}><Grid3X3 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </motion.div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6"><FolderOpen className="h-12 w-12 text-slate-400" /></div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{searchTerm ? "No matches found" : "No categories available"}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{searchTerm ? `We couldn't find any categories matching "${searchTerm}"` : "Check back later for new categories"}</p>
            {searchTerm && <button onClick={() => setSearchTerm("")} className="text-emerald-600 hover:text-emerald-700 font-semibold">Clear search and show all</button>}
          </div>
        ) : viewMode === "grid" ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6" variants={containerVariants}>
            {filteredCategories.map((cat, index) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4 }}>
                <Link to={`/products/category/${encodeURIComponent(cat.name)}`} className="block group h-full">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl transition-all">
                    <div className={`h-1.5 bg-gradient-to-r ${categoryGradients[index % categoryGradients.length]}`} />
                    <div className="p-6">
                      <div className="relative mb-5">
                        <div className="w-full h-40 rounded-2xl overflow-hidden group-hover:scale-105 transition-all duration-300 shadow-md">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center`}>
                              <span className="text-4xl">{categoryIcons[cat.name.toLowerCase()] || categoryIcons.default}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg">{cat.count}</div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{cat.count} {cat.count === 1 ? "product" : "products"} available</p>
                      <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>Explore Category</span><ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4" variants={containerVariants}>
            {filteredCategories.map((cat, index) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(index * 0.03, 0.3) }}>
                <Link to={`/products/category/${encodeURIComponent(cat.name)}`} className="block group">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all text-center">
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300 shadow-md">
                      {cat.image ? (<img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />) : (
                        <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center`}>
                          <span className="text-2xl">{categoryIcons[cat.name.toLowerCase()] || categoryIcons.default}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">{cat.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{cat.count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
