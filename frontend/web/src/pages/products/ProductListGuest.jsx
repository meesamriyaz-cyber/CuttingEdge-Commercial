import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  LogIn,
  PackageCheck,
  Search,
  X,
} from "lucide-react";

import { API_URL } from "../../api/client";
import { Button } from "../../components/ui";
import { getProductPrimaryImage } from "../../utils/productImages";

function RatingStars({ rating }) {
  return [...Array(5)].map((_, index) => (
    <svg
      key={index}
      className={`h-3.5 w-3.5 ${
        index < Math.round(rating || 0)
          ? "fill-amber-400 text-amber-400"
          : "fill-slate-200 text-slate-200"
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ));
}

export default function ProductListGuest() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 12;

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/public/categories`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const url = selectedCategory
          ? `${API_URL}/public/products?category=${encodeURIComponent(selectedCategory)}`
          : `${API_URL}/public/products`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        setProducts(data);
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "We could not reach the product catalogue right now."
            : err.message,
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredProducts = products
    .filter((product) =>
      [product.name, product.sku, product.category]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "category") {
        return (a.category || "").localeCompare(b.category || "");
      }
      if (sortBy === "rating") {
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      }
      return (a.name || "").localeCompare(b.name || "");
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pageTitle = selectedCategory
    ? `${selectedCategory} Products`
    : "Product Catalogue";
  const pageDescription = selectedCategory
    ? `Explore ${selectedCategory.toLowerCase()} options, compare specifications, and continue with the right workflow after sign-in.`
    : "Compare categories, review specifications, and continue with the right workflow after sign-in.";
  const resultLabel = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} available`;

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#07111f]">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#07111f] px-4">
        <div className="max-w-lg rounded-lg border border-red-200 bg-white px-6 py-7 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
            <PackageCheck className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            Product catalogue unavailable
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {error} Please try again, or explore services while the catalogue
            connection recovers.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => window.location.reload()}>Try again</Button>
            <Button variant="secondary" onClick={() => navigate("/services")}>
              Explore services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="hero-shell rounded-lg p-5 sm:p-7">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {selectedCategory || "Product Catalogue"}
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-950 dark:text-white">
                {pageTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {pageDescription}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-cyan-900/50 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <PackageCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
                {resultLabel}
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-[1fr_180px] lg:w-auto">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  className="theme-input w-full pl-11 pr-4 lg:w-80"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="theme-input px-4"
              >
                <option value="name">Sort by name</option>
                <option value="category">Sort by category</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>
        </div>

        {!loadingCategories && categories.length > 0 && (
          <div className="w-full">
            <div className="md:hidden w-full">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="theme-input w-full appearance-none px-4 pr-10 font-medium"
                >
                  <option value="">
                    All Categories ({categories.reduce((sum, item) => sum + item.count, 0)})
                  </option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All ({categories.reduce((sum, item) => sum + item.count, 0)})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="gap-2"
                >
                  {category.name}
                  <span className="text-xs opacity-70">({category.count})</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="glass-premium flex items-start gap-3 rounded-lg p-4">
          <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Browse first, continue after sign-in
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review products, categories, and specifications now. After sign-in, the platform shows the right workflow for your account type.
            </p>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="theme-card group relative flex cursor-pointer flex-col overflow-hidden rounded-lg p-4 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300 dark:hover:border-cyan-800"
                onClick={() => setSelectedProduct(product)}
              >
                {product.category && (
                  <span className="absolute left-4 top-4 z-10 rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                    {product.category}
                  </span>
                )}

                <div className="flex h-44 items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-cyan-50/60 p-4 dark:from-slate-900 dark:to-cyan-950/20">
                  <img
                    src={getProductPrimaryImage(product)}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="mt-4 min-h-10 text-sm font-bold text-slate-950 dark:text-white line-clamp-2">
                  {product.name}
                </h3>

                <div className="mt-2 min-h-5 text-xs text-slate-500 dark:text-slate-400">
                  {product.sku ? `SKU: ${product.sku}` : "Catalogue listing"}
                </div>

                {product.rating?.count > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <RatingStars rating={product.rating.average} />
                    <span className="ml-1 text-xs text-slate-500">
                      ({product.rating.average.toFixed(1)})
                    </span>
                  </div>
                )}

                <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Verified listing
                </div>

                <Button className="mt-4 w-full gap-2" size="sm" to={`/products-guest/${product._id}`}>
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              No matching products
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try another search term or clear the selected category.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-md mx-auto gap-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              size="sm"
            >
              Prev
            </Button>

            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              size="sm"
            >
              Next
            </Button>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="theme-card bg-surface max-w-md w-full max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="flex items-center justify-between border-b border-border/60 p-4">
                <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Close product preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
                  <img
                    src={getProductPrimaryImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-semibold">Category</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedProduct.category || "Not specified"}
                  </p>
                </div>

                {selectedProduct.rating?.count > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold">Rating</h3>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={selectedProduct.rating.average} />
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {selectedProduct.rating.average.toFixed(1)} ({selectedProduct.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-1 text-sm font-semibold">Description</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {selectedProduct.description || "No description available."}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    navigate(`/products-guest/${selectedProduct._id}`);
                    setSelectedProduct(null);
                  }}
                >
                  Open full details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
