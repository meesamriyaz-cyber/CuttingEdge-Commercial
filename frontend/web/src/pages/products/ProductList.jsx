import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Package,
  ShoppingCart,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  X,
} from "lucide-react";

export default function ProductList() {
  const { accessToken, user } = useAuthStore();
  const isGovt = user?.clientType === "PUBLIC";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 12;

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [accessToken]);

  const filtered = products
    .filter((p) =>
      [p.name, p.description, p.sku, p.category]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-emerald-500 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200/30 to-emerald-200/30 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Browse our wide range of genuine IT products with warranty. 
              Quality products for businesses and institutions.
            </p>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 85C120 70 240 40 360 25C480 10 600 10 720 15C840 20 960 30 1080 40C1200 50 1320 60 1380 65L1440 70V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#f1f5f9" className="dark:fill-slate-800" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-emerald-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 text-emerald-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Results Count */}
              <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {filtered.length} products
              </span>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-slate-400" />
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                        <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(4.0)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {isGovt ? (
                          <span className="text-sm text-slate-500">Price on request</span>
                        ) : (
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/products/${product._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {paginated.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 p-4 flex gap-6"
              >
                {/* Image */}
                <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {product.category} • {product.sku}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end justify-between">
                  <div>
                    {isGovt ? (
                      <span className="text-sm text-slate-500">Price on request</span>
                    ) : (
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/products/${product._id}`}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-colors ${
                    currentPage === i + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {paginated.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              No products found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("newest");
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Clear Filters <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Quick View
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
                    {selectedProduct.images?.[0]?.url ? (
                      <img
                        src={selectedProduct.images[0].url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-20 h-20 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="w-1/2">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    SKU: {selectedProduct.sku}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-4">
                    {selectedProduct.description}
                  </p>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                    {isGovt ? "Price on request" : `₹${selectedProduct.price?.toLocaleString()}`}
                  </div>
                  <Link
                    to={`/products/${selectedProduct._id}`}
                    onClick={() => setSelectedProduct(null)}
                    className="block w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
