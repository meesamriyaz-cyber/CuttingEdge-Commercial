import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Grid3X3,
  LayoutList,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { API_URL } from "../../api/client";
import LayoutContainer from "../../components/LayoutContainer";
import { fadeInVariants } from "../../utils/animations";
import { Button } from "../../components/ui";
import { getProductPrimaryImage } from "../../utils/productImages";

const PRICE_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function RatingStars({ rating }) {
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={`h-3.5 w-3.5 ${
        index < Math.round(rating || 0)
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300 dark:text-slate-600"
      }`}
    />
  ));
}

export default function ProductList() {
  const { accessToken, user } = useAuthStore();
  const { updateQuantity, fetchCart } = useCartStore();
  const isGovt = user?.clientType === "PUBLIC";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedItems, setAddedItems] = useState(new Set());

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load products");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [accessToken]);

  const filteredProducts = products
    .filter((product) =>
      [product.name, product.description, product.sku, product.category]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (!isGovt && sortBy === "price-low") {
        return (a.price || 0) - (b.price || 0);
      }
      if (!isGovt && sortBy === "price-high") {
        return (b.price || 0) - (a.price || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  async function handleAddToCart(productId, productName) {
    if (isGovt) return;

    const product = products.find((item) => item._id === productId);
    if (Number(product?.stock || 0) < 1) {
      toast.error(`${productName} is out of stock`);
      return;
    }

    setAddingToCart(productId);
    try {
      await updateQuantity(productId, 1);
      await fetchCart();
      setAddedItems((prev) => new Set([...prev, productId]));
      toast.success(`${productName} added to cart`);
    } catch (err) {
      toast.error(err.message || "Failed to add item to cart");
    } finally {
      setAddingToCart(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07111f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-950 dark:bg-cyan-500">
            <Package className="h-7 w-7 text-white dark:text-slate-950 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading products...
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
            Unable to load products
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
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>
        </div>

        <section className="hero-shell rounded-lg p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {isGovt ? "Government product catalogue" : "Private product catalogue"}
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                All visible products
              </h1>
              <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {isGovt
                  ? "Browse every product currently visible to your government account and continue through the procurement enquiry workflow from product details."
                  : "Browse every product currently visible to your private account and continue through product details, cart, and checkout."}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_18px_40px_-32px_rgba(8,16,29,0.55)] backdrop-blur dark:border-cyan-950/50 dark:bg-slate-950/45">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Visible products
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {filteredProducts.length}
              </div>
            </div>
          </div>
        </section>

        <div className="glass-premium rounded-lg p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="theme-input w-full pl-11 pr-4"
                />
              </div>

              <div className="relative sm:w-52">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="theme-input w-full appearance-none pl-11 pr-10"
                >
                  <option value="newest">Newest first</option>
                  <option value="name">Name A-Z</option>
                  {!isGovt && <option value="price-low">Price: low to high</option>}
                  {!isGovt && <option value="price-high">Price: high to low</option>}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between lg:justify-end">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
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
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Package className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {searchTerm ? "No matching products" : "No products available"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {searchTerm
                ? `No products match "${searchTerm}".`
                : "Products visible to this account will appear here."}
            </p>
            {searchTerm && (
              <Button variant="secondary" className="mt-5" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.28 }}
              >
                <div className="group theme-card flex h-full flex-col rounded-lg p-4 transition-all duration-200 hover:-translate-y-1">
                  <Link to={`/products/${product._id}`} className="block">
                    <div className="flex h-44 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 p-5">
                      <img
                        src={getProductPrimaryImage(product)}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <div className="mt-4 flex-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {product.category || "Catalogue item"}
                    </div>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-1">
                      <RatingStars rating={product.rating?.average || 0} />
                      <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                        {product.rating?.count > 0
                          ? `(${product.rating.average.toFixed(1)})`
                          : "(No reviews)"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {isGovt
                        ? "Pricing via quotation"
                        : PRICE_FORMATTER.format(product.price || 0)}
                    </div>
                    {!isGovt && (
                      <p
                        className={`mt-1 text-xs font-medium ${
                          Number(product.stock || 0) > 0
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-red-600 dark:text-red-300"
                        }`}
                      >
                        {Number(product.stock || 0) > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {isGovt
                        ? "Continue from product details into the enquiry workflow."
                        : "Open details or add directly to cart."}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1 gap-2" size="sm" to={`/products/${product._id}`}>
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    {!isGovt && (
                      <Button
                        variant={addedItems.has(product._id) ? "primary" : "secondary"}
                        size="sm"
                        className="gap-2"
                        onClick={() => handleAddToCart(product._id, product.name)}
                        disabled={addingToCart === product._id || Number(product.stock || 0) < 1}
                      >
                        {addingToCart === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : addedItems.has(product._id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.25 }}
              >
                <div className="tech-panel flex flex-col md:flex-row gap-5 rounded-lg p-4 sm:p-5">
                  <Link to={`/products/${product._id}`} className="md:w-44 lg:w-52 shrink-0">
                    <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 p-5">
                      <img
                        src={getProductPrimaryImage(product)}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {product.category || "Catalogue item"}
                    </div>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-1">
                      <RatingStars rating={product.rating?.average || 0} />
                      <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                        {product.rating?.count > 0
                          ? `(${product.rating.average.toFixed(1)})`
                          : "(No reviews)"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {isGovt
                            ? "Pricing via quotation"
                            : PRICE_FORMATTER.format(product.price || 0)}
                        </div>
                        {!isGovt && (
                          <p
                            className={`mt-1 text-xs font-medium ${
                              Number(product.stock || 0) > 0
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-red-600 dark:text-red-300"
                            }`}
                          >
                            {Number(product.stock || 0) > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {isGovt
                            ? "Use product details to continue with enquiry."
                            : "Add directly to cart or open full details."}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="gap-2" to={`/products/${product._id}`}>
                          View details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        {!isGovt && (
                          <Button
                            variant={addedItems.has(product._id) ? "primary" : "secondary"}
                            size="sm"
                            className="gap-2"
                            onClick={() => handleAddToCart(product._id, product.name)}
                            disabled={addingToCart === product._id || Number(product.stock || 0) < 1}
                          >
                            {addingToCart === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : addedItems.has(product._id) ? (
                              <>
                                <Check className="h-4 w-4" />
                                Added
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4" />
                                Add
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
