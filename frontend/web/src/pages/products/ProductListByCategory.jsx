import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { getProducts } from "../../api/products";
import LayoutContainer from "../../components/LayoutContainer";
import { containerVariants, fadeInVariants } from "../../utils/animations";
import {
  ArrowLeft,
  Package,
  Loader2,
  ShoppingCart,
  Search,
  Grid3X3,
  List,
  SortAsc,
  Eye,
  Heart,
  Star,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";

export default function ProductListByCategory() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || "");
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { updateQuantity, fetchCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [addedItems, setAddedItems] = useState(new Set());

  const clientType = user?.clientType;
  const isGovt = clientType === "PUBLIC";

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts(decodedCategory);
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [decodedCategory]);

  const filteredProducts = products
    .filter((p) =>
      [p.name, p.description, p.sku].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const handleAddToCart = async (productId, productName) => {
    if (isGovt) return;

    setAddingToCart(productId);
    try {
      await updateQuantity(productId, 1);
      await fetchCart();
      setAddedItems((prev) => new Set([...prev, productId]));
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto 
            flex items-center ring-1 ring-slate-200 overflow-hidden`}
          >
            <div className="flex-1 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Added to cart!</p>
                  <p className="text-sm text-slate-600 line-clamp-1">
                    {productName}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/cart");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-4 font-medium text-sm transition-colors"
            >
              View Cart
            </button>
          </div>
        ),
        { duration: 4000, position: "bottom-right" },
      );
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 opacity-20 animate-ping absolute inset-0" />
            <Loader2 className="h-12 w-12 animate-spin text-kashmiri-dal-600 mx-auto relative" />
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100/50">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-kashmiri-dal-200/50"
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
        className="w-[95%] sm:w-[90%] max-w-7xl mx-auto py-6 sm:py-8 overflow-x-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link
            to="/"
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <Link
            to="/products"
            className="text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px]">
            {decodedCategory}
          </span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-kashmiri-dal-50 to-kashmiri-pashmina-50 border border-kashmiri-dal-100 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-kashmiri-dal-500" />
                <span className="text-xs font-medium text-kashmiri-dal-700">
                  {filteredProducts.length} Products
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 mb-2">
                {decodedCategory}
              </h1>
              <p className="text-slate-600">
                Discover quality products in this category
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-60 pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                    text-slate-900 placeholder:text-slate-400 shadow-sm transition-all text-sm"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-44 pl-11 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                    text-slate-900 shadow-sm appearance-none cursor-pointer text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Categories</span>
          </Link>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm
                ? "No products found"
                : "No products in this category"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}"`
                : "Check back later for new products"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View - Premium Product Cards */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    delay: Math.min(index * 0.03, 0.3),
                    duration: 0.4,
                  }}
                >
                  <div
                    className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden
                    transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/40 hover:-translate-y-2
                    hover:border-indigo-200/60 h-full flex flex-col"
                  >
                    {/* Product Image Container */}
                    <Link
                      to={`/products/${product._id}`}
                      className="block relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
                    >
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-20 w-20 text-slate-200" />
                        </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                          <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-lg">
                            <Eye className="w-3.5 h-3.5" />
                            Quick View
                          </span>
                        </div>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm 
                          flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 
                          transition-all duration-300 hover:bg-white hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          // Wishlist functionality can be added here
                        }}
                      >
                        <Heart className="w-4 h-4 text-slate-600 hover:text-red-500 transition-colors" />
                      </button>
                    </Link>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Product Name */}
                      <Link
                        to={`/products/${product._id}`}
                        className="block mb-2"
                      >
                        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      {product.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">
                          {product.description}
                        </p>
                      )}

                      {/* Rating - Real data from backend */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(product.rating?.average || 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">
                          {product.rating?.count > 0
                            ? `(${product.rating.average.toFixed(1)})`
                            : "(No reviews)"}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold hero-gradient-text">
                            {isGovt
                              ? "Price on Request"
                              : `₹${product.price?.toLocaleString()}`}
                          </span>
                        </div>
                        {!isGovt && product.gstRate && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Inclusive of all taxes
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 
                            text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        >
                          View Details
                        </Link>
                        {!isGovt && (
                          <button
                            onClick={() =>
                              handleAddToCart(product._id, product.name)
                            }
                            disabled={addingToCart === product._id}
                            className={`flex items-center justify-center px-4 py-2.5 
                              rounded-xl text-sm font-semibold transition-all duration-300
                              ${
                                addedItems.has(product._id)
                                  ? "bg-emerald-500 text-white"
                                  : "btn-theme-primary shadow-lg shadow-indigo-200/30"
                              } disabled:opacity-50`}
                            title="Add to Cart"
                          >
                            {addingToCart === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : addedItems.has(product._id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* List View */
          <motion.div className="space-y-4" variants={containerVariants}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: Math.min(index * 0.02, 0.2) }}
                >
                  <div
                    className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden
                    transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/30 hover:border-indigo-200/60
                    flex flex-col sm:flex-row"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="block sm:w-48 lg:w-56 flex-shrink-0"
                    >
                      <div className="aspect-square sm:aspect-auto sm:h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-slate-200" />
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center gap-5">
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        {product.description && (
                          <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          {/* Rating - Real data from backend */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.round(product.rating?.average || 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-slate-500 ml-1">
                              {product.rating?.count > 0
                                ? `(${product.rating.average.toFixed(1)})`
                                : "(No reviews)"}
                            </span>
                          </div>
                          {product.sku && (
                            <span className="text-xs text-slate-400">
                              SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 sm:flex-shrink-0">
                        <div className="text-right">
                          <span className="text-2xl font-bold hero-gradient-text">
                            {isGovt
                              ? "Price on Request"
                              : `₹${product.price?.toLocaleString()}`}
                          </span>
                          {!isGovt && product.gstRate && (
                            <p className="text-xs text-slate-500">Incl. GST</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 
                              rounded-xl text-sm font-semibold transition-colors"
                          >
                            View
                          </Link>
                          {!isGovt && (
                            <button
                              onClick={() =>
                                handleAddToCart(product._id, product.name)
                              }
                              disabled={addingToCart === product._id}
                              className={`flex items-center gap-2 px-5 py-2.5 
                                rounded-xl text-sm font-semibold transition-all duration-300
                                ${
                                  addedItems.has(product._id)
                                    ? "bg-emerald-500 text-white"
                                    : "btn-theme-primary shadow-lg shadow-indigo-200/30"
                                } disabled:opacity-50`}
                            >
                              {addingToCart === product._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : addedItems.has(product._id) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
