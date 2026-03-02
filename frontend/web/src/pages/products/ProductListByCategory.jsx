import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { getProducts } from "../../api/products";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../api/wishlist";
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
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [togglingWishlist, setTogglingWishlist] = useState(null);

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

  useEffect(() => {
    async function loadWishlist() {
      try {
        const data = await getWishlist();
        if (data.wishlist) {
          const wishlistIds = new Set(
            data.wishlist.map((item) => item.product?._id || item.product),
          );
          setWishlistItems(wishlistIds);
        }
      } catch (err) {}
    }
    loadWishlist();
  }, []);

  const handleToggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingWishlist === productId) return;
    setTogglingWishlist(productId);
    try {
      if (wishlistItems.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setWishlistItems((prev) => new Set([...prev, productId]));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update wishlist");
    } finally {
      setTogglingWishlist(null);
    }
  };

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
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-sm w-full bg-white dark:bg-slate-800 shadow-xl rounded-2xl pointer-events-auto flex items-center border border-slate-200 dark:border-slate-700 overflow-hidden`}
          >
            <div className="flex-1 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    Added to cart!
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 font-medium text-sm transition-colors"
            >
              View Cart
            </button>
          </div>
        ),
        { duration: 4000, position: "bottom-right" },
      );
    } catch (err) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 opacity-30 animate-pulse absolute inset-0" />
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto relative" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">
            Loading products...
          </p>
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
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
        className="w-[95%] sm:w-[90%] max-w-7xl mx-auto py-6 sm:py-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6">
          <Link
            to="/"
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 flex items-center"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          <Link
            to="/products"
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-600"
          >
            Categories
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">
            {decodedCategory}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {filteredProducts.length} Products
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                {decodedCategory}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Discover quality products in this category
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-60 pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-44 pl-11 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white appearance-none cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Categories</span>
          </Link>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              {searchTerm
                ? "No products found"
                : "No products in this category"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}"`
                : "Check back later for new products"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Clear search
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: Math.min(index * 0.03, 0.3),
                    duration: 0.4,
                  }}
                >
                  <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-all">
                    <Link
                      to={`/products/${product._id}`}
                      className="block relative aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden"
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
                          <Package className="h-20 w-20 text-slate-300" />
                        </div>
                      )}
                      <button
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-md transition-all hover:scale-110 ${togglingWishlist === product._id ? "opacity-50" : ""}`}
                        onClick={(e) => handleToggleWishlist(product._id, e)}
                        disabled={togglingWishlist === product._id}
                      >
                        {wishlistItems.has(product._id) ? (
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        )}
                      </button>
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <Link
                        to={`/products/${product._id}`}
                        className="block mb-2"
                      >
                        <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.round(product.rating?.average || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">
                          {product.rating?.count > 0
                            ? `(${product.rating.average.toFixed(1)})`
                            : "(No reviews)"}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-800 dark:text-white">
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
                      <div className="flex gap-2 mt-auto">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                          View Details
                        </Link>
                        {!isGovt && (
                          <button
                            onClick={() =>
                              handleAddToCart(product._id, product.name)
                            }
                            disabled={addingToCart === product._id}
                            className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${addedItems.has(product._id) ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"} disabled:opacity-50`}
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
          <motion.div className="space-y-4" variants={containerVariants}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col sm:flex-row shadow-md hover:shadow-lg transition-all">
                    <Link
                      to={`/products/${product._id}`}
                      className="block sm:w-48 lg:w-56 flex-shrink-0"
                    >
                      <div className="aspect-square sm:aspect-auto sm:h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center p-6">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-slate-300" />
                        )}
                      </div>
                    </Link>
                    <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center gap-5">
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-white hover:text-emerald-600 line-clamp-1 mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        {product.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.round(product.rating?.average || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                          {product.sku && (
                            <span className="text-xs text-slate-400">
                              SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 sm:flex-shrink-0">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            {isGovt
                              ? "Price on Request"
                              : `₹${product.price?.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-bold shadow-md"
                          >
                            View
                          </Link>
                          {!isGovt && (
                            <button
                              onClick={() =>
                                handleAddToCart(product._id, product.name)
                              }
                              disabled={addingToCart === product._id}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${addedItems.has(product._id) ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100"} disabled:opacity-50`}
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
