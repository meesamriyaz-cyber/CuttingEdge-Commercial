import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  FolderOpen,
  Grid3X3,
  Headphones,
  LayoutGrid,
  Monitor,
  Network,
  Package,
  Printer,
  Search,
  Server,
  Smartphone,
  Tablet,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { getCategories } from "../../api/products";
import LayoutContainer from "../../components/LayoutContainer";
import { containerVariants, fadeInVariants } from "../../utils/animations";
import { Button } from "../../components/ui";

function getCategoryIcon(name) {
  const value = name.toLowerCase();

  if (value.includes("laptop") || value.includes("desktop") || value.includes("workstation")) {
    return Monitor;
  }
  if (value.includes("phone") || value.includes("mobile")) {
    return Smartphone;
  }
  if (value.includes("tablet")) {
    return Tablet;
  }
  if (value.includes("printer")) {
    return Printer;
  }
  if (value.includes("network")) {
    return Network;
  }
  if (value.includes("server") || value.includes("storage")) {
    return Server;
  }
  if (value.includes("audio") || value.includes("accessor")) {
    return Headphones;
  }

  return Box;
}

export default function CategoryList() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const isGovt = user?.clientType === "PUBLIC";
  const totalProducts = categories.reduce((sum, category) => sum + (category.count || 0), 0);

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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07111f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-950 dark:bg-cyan-500">
            <Package className="h-7 w-7 text-white dark:text-slate-950 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07111f] flex items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-red-200 dark:border-red-900/40 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
            <Package className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Unable to load categories
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>
          <Button className="mt-5" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <motion.div
        className="w-[92%] max-w-7xl mx-auto py-8 sm:py-10 space-y-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <Button variant="secondary" to="/products/all" className="gap-2">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <motion.section className="tech-panel rounded-lg p-6 sm:p-8" variants={containerVariants}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {isGovt ? "Government catalogue" : "Private catalogue"}
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Browse by category
              </h1>
              <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {isGovt
                  ? "These categories are already filtered for institutional procurement. Open a category to review products and continue through the enquiry and quotation workflow."
                  : "These categories are already filtered for ecommerce-ready products. Open a category to compare items, add to cart, and continue through checkout."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Categories
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {categories.length}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Visible products
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalProducts}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-cyan-900/50 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Categories reflect your account workflow
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isGovt
                ? "Government customers continue into procurement-friendly product flows after selecting a category."
                : "Private customers continue into browsing, cart, and order-ready product flows after selecting a category."}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredCategories.length}
                </span>{" "}
                {filteredCategories.length === 1 ? "category" : "categories"}
              </p>
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("compact")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "compact"
                      ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <FolderOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {searchTerm ? "No matching categories" : "No categories available"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {searchTerm
                ? `No categories match "${searchTerm}".`
                : "Categories will appear here when products are available."}
            </p>
            {searchTerm && (
              <Button variant="secondary" className="mt-5" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={containerVariants}
          >
            {filteredCategories.map((category, index) => {
              const Icon = getCategoryIcon(category.name);

              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.28), duration: 0.3 }}
                >
                  <Link
                    to={`/products/category/${encodeURIComponent(category.name)}`}
                    className="group tech-panel flex h-full flex-col rounded-lg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {category.count} items
                      </span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                            <Icon className="h-7 w-7 text-cyan-700 dark:text-cyan-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isGovt
                          ? "Open this category to review products and continue through procurement-oriented product details."
                          : "Open this category to compare products and continue into cart and checkout-ready product details."}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                      Open category
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={containerVariants}
          >
            {filteredCategories.map((category, index) => {
              const Icon = getCategoryIcon(category.name);

              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.25 }}
                >
                  <Link
                    to={`/products/category/${encodeURIComponent(category.name)}`}
                    className="group flex h-full flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-24 items-center justify-center">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                            <Icon className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {category.count} items
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
