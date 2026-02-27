// src/pages/products/ProductListGuest.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { Link } from "react-router-dom";

export default function ProductListGuest() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 12;

  // Load categories
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

  // Load products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `${API_URL}/public/products?category=${encodeURIComponent(selectedCategory)}`
          : `${API_URL}/public/products`;
        const res = await fetch(url, {
          cache: "no-store",
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
    setCurrentPage(1);
  }, [selectedCategory]);

  const filtered = products.filter((p) =>
    [p.name, p.sku, p.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Star rating helper
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.round(rating || 0)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold hero-gradient-text">
            Our Products
          </h1>

          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="theme-input px-4 py-3 rounded-xl w-full md:w-72"
          />
        </div>

        {/* CATEGORIES - Dropdown on mobile, buttons on desktop */}
        {!loadingCategories && categories.length > 0 && (
          <div className="w-full">
            {/* Mobile Dropdown */}
            <div className="md:hidden w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-alt border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">
                  All Categories (
                  {categories.reduce((acc, c) => acc + c.count, 0)})
                </option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === ""
                    ? "btn-theme-primary"
                    : "bg-surface-alt text-slate-600 hover:bg-indigo-50"
                }`}
              >
                All ({categories.reduce((acc, c) => acc + c.count, 0)})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.name
                      ? "btn-theme-primary"
                      : "bg-surface-alt text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  {cat.name}
                  <span className="text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT GRID - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {paginated.map((p) => (
            <div
              key={p._id}
              className="
                relative
                theme-card bg-surface
                rounded-2xl
                border border-white/30
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                p-6
                flex flex-col items-center
                cursor-pointer
              "
              onClick={() => setSelectedProduct(p)}
            >
              {/* SEGMENT TAG */}
              {p.segment && (
                <span
                  className={`
                    absolute top-4 right-4
                    text-[10px] font-bold tracking-wide
                    px-2 py-1 rounded-full
                    ${
                      p.segment === "CONSUMER"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >
                  {p.segment}
                </span>
              )}
              {p.category && (
                <span
                  className="
                    absolute top-4 left-4
                    text-[10px] font-semibold
                    bg-surface-alt text-slate-700
                    px-2 py-1 rounded-full
                "
                >
                  {p.category}
                </span>
              )}

              {/* IMAGE */}
              <div
                className="
                  w-full h-40
                  bg-surface-alt
                  rounded-xl
                  flex items-center justify-center
                  p-4
                "
              >
                {p.images?.[0]?.url ? (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
              </div>

              {/* NAME */}
              <h3 className="mt-4 text-sm font-semibold text-center text-text line-clamp-2">
                {p.name}
              </h3>

              {/* RATING */}
              {p.rating?.count > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {renderStars(p.rating.average)}
                  <span className="text-xs text-slate-500 ml-1">
                    ({p.rating.average.toFixed(1)})
                  </span>
                </div>
              )}

              {/* CTA */}
              <Link
                to={`/products-guest/${p._id}`}
                className="
                  mt-4
                  text-xs
                  btn-theme-primary
                  animate-gradient
                  px-5 py-3
                  rounded-lg
                  font-semibold
                  w-full text-center
                "
                onClick={(e) => e.stopPropagation()}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-md mx-auto gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn-theme-primary px-5 py-3 rounded-xl disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn-theme-primary px-5 py-3 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="theme-card bg-surface rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-border/60 flex justify-between items-center">
                <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="w-full h-40 rounded-xl bg-surface-alt flex items-center justify-center">
                  {selectedProduct.images?.[0]?.url ? (
                    <img
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Category</h3>
                  <p className="text-xs text-slate-600">
                    {selectedProduct.category}
                  </p>
                </div>
                {/* Rating in Modal */}
                {selectedProduct.rating?.count > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Rating</h3>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedProduct.rating.average)}
                      <span className="text-xs text-slate-600">
                        {selectedProduct.rating.average.toFixed(1)} (
                        {selectedProduct.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm mb-1">Description</h3>
                  <p className="text-xs text-slate-600">
                    {selectedProduct.description}
                  </p>
                </div>
                <Link
                  to={`/products-guest/${selectedProduct._id}`}
                  className="btn-theme-primary w-full py-2 rounded-xl font-semibold text-sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
