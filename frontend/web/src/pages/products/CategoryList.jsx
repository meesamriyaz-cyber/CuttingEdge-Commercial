import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { getCategories } from "../../api/products";
import LayoutContainer from "../../components/LayoutContainer";
import { containerVariants, fadeInVariants } from "../../utils/animations";
import {
  Package,
  FolderOpen,
  ArrowRight,
  Loader2,
  Search,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

// Category icon mapping (fallback when no image)
const categoryIcons = {
  laptops: "💻",
  phones: "📱",
  accessories: "🎧",
  servers: "🖥️",
  workstations: "🖥️",
  printers: "🖨️",
  monitors: "🖥️",
  storage: "💾",
  networking: "🌐",
  software: "💿",
  desktops: "🖥️",
  tablets: "📱",
  cameras: "📷",
  audio: "🔊",
  video: "📹",
  default: "📦",
};

// Category image mapping using Unsplash (fallback only)
const categoryImages = {
  laptops: "https://source.unsplash.com/400x300/?business,laptop",
  phones: "https://source.unsplash.com/400x300/?smartphone,modern",
  accessories: "https://source.unsplash.com/400x300/?computer,accessories",
  servers: "https://source.unsplash.com/400x300/?data,server,rack",
  workstations: "https://source.unsplash.com/400x300/?desktop,workstation",
  printers: "https://source.unsplash.com/400x300/?office,printer",
  monitors: "https://source.unsplash.com/400x300/?computer,monitor,office",
  storage: "https://source.unsplash.com/400x300/?ssd,harddrive,storage",
  networking: "https://source.unsplash.com/400x300/?networking,router,switch",
  software: "https://source.unsplash.com/400x300/?software,code,development",
  computers: "https://source.unsplash.com/400x300/?desktop,computer,office",
  tablets: "https://source.unsplash.com/400x300/?tablet,device",
  cameras: "https://source.unsplash.com/400x300/?professional,camera",
  audio: "https://source.unsplash.com/400x300/?headphones,audio",
  video: "https://source.unsplash.com/400x300/?video,camera,production",
  default: "https://source.unsplash.com/400x300/?technology,business",
};

// Category gradient colors - Kashmiri palette
const categoryGradients = [
  "from-kashmiri-dal-500 to-kashmiri-pashmina-600",
  "from-kashmiri-pashmina-500 to-kashmiri-saffron-600",
  "from-kashmiri-saffron-500 to-kashmiri-chinar-600",
  "from-kashmiri-chinar-500 to-kashmiri-dal-600",
  "from-kashmiri-dal-400 to-kashmiri-saffron-500",
  "from-kashmiri-pashmina-400 to-kashmiri-chinar-500",
  "from-kashmiri-saffron-400 to-kashmiri-dal-500",
  "from-kashmiri-chinar-400 to-kashmiri-pashmina-500",
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

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 flex items-center justify-center shadow-2xl shadow-kashmiri-dal-500/30">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-6 font-medium">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-950/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white font-semibold shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <motion.div
        className="w-[95%] sm:w-[90%] max-w-7xl mx-auto py-8 sm:py-12 overflow-x-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Hero Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-kashmiri-dal-100 via-kashmiri-pashmina-100 to-kashmiri-saffron-100 dark:from-kashmiri-dal-950/50 dark:via-kashmiri-pashmina-950/50 dark:to-kashmiri-saffron-950/50 border border-kashmiri-dal-200 dark:border-kashmiri-dal-800 mb-6"
          >
            <Sparkles className="w-4 h-4 text-kashmiri-dal-600 dark:text-kashmiri-dal-400" />
            <span className="text-sm font-medium text-kashmiri-dal-700 dark:text-kashmiri-dal-300">
              {isGovt
                ? "Government Procurement Portal"
                : "Premium Product Catalog"}
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500">
              Browse by Category
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            {isGovt
              ? "Explore our curated selection of commercial products designed for government and institutional procurement"
              : "Discover our wide range of quality products organized for easy browsing"}
          </p>
        </div>

        {/* Search and Controls Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Results count */}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredCategories.length}
                </span>{" "}
                {filteredCategories.length === 1 ? "category" : "categories"}
              </p>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "compact"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  title="Compact view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {searchTerm ? "No matches found" : "No categories available"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm
                ? `We couldn't find any categories matching "${searchTerm}"`
                : "Check back later for new categories"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-2"
              >
                Clear search and show all
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View - Premium Cards */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            variants={containerVariants}
          >
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.05, 0.4),
                  duration: 0.4,
                }}
              >
                <Link
                  to={`/products/category/${encodeURIComponent(cat.name)}`}
                  className="block group h-full"
                >
                  <div
                    className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden
                    transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-2
                    hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    {/* Gradient accent bar */}
                    <div
                      className={`h-1.5 bg-gradient-to-r ${categoryGradients[index % categoryGradients.length]}`}
                    />

                    <div className="p-6">
                      {/* Image Container */}
                      <div className="relative mb-5">
                        <div className="w-full h-40 rounded-2xl overflow-hidden group-hover:scale-105 transition-all duration-300 shadow-md">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center`}
                            >
                              <span className="text-4xl">
                                {categoryIcons[cat.name.toLowerCase()] ||
                                  categoryIcons.default}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Product count badge */}
                        <div
                          className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500
                        text-white text-xs font-bold shadow-lg shadow-kashmiri-dal-500/30"
                        >
                          {cat.count}
                        </div>
                      </div>

                      {/* Category Name */}
                      <h3
                        className="text-lg font-bold text-slate-900 dark:text-white mb-2 
                        group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      >
                        {cat.name}
                      </h3>

                      {/* Product count text */}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {cat.count} {cat.count === 1 ? "product" : "products"}{" "}
                        available
                      </p>

                      {/* CTA */}
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        <span>Explore Category</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Compact View */
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            variants={containerVariants}
          >
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
              >
                <Link
                  to={`/products/category/${encodeURIComponent(cat.name)}`}
                  className="block group"
                >
                  <div
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5
                    transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1
                    hover:border-blue-300 dark:hover:border-blue-700 text-center"
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300 shadow-md">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center`}
                        >
                          <span className="text-2xl">
                            {categoryIcons[cat.name.toLowerCase()] ||
                              categoryIcons.default}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-sm font-semibold text-slate-900 dark:text-white 
                      group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1"
                    >
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {cat.count} items
                    </p>
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
