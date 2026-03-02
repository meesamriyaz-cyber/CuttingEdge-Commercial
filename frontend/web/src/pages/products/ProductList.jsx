import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import { Link } from "react-router-dom";

export default function ProductList() {
  const { accessToken, user } = useAuthStore();
  const isGovt = user?.clientType === "PUBLIC";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;

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

  const filtered = products.filter((p) =>
    [p.name, p.description, p.sku, p.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-emerald-500 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold hero-gradient-text">
            Products
          </h1>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="theme-input px-4 py-3 rounded-xl w-full md:w-72"
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block theme-card bg-surface rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-white/30 hover:bg-surface-alt"
                >
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-alt">
                      {p.images?.[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-slate-400 flex items-center justify-center h-full">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium">{p.category}</td>

                  <td className="px-6 py-4 font-medium">{p.name}</td>

                  <td className="px-6 py-4 text-right">
                    {isGovt ? "Price on request" : `₹${p.price}`}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/products/${p._id}`}
                      className="btn-theme-primary animate-gradient px-4 py-2 rounded-xl font-semibold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid View */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {paginated.map((p) => (
            <div
              key={p._id}
              className="theme-card bg-surface rounded-2xl shadow-lg border border-white/30 p-5 flex flex-col items-center cursor-pointer transition-all hover:shadow-xl"
              onClick={() => setSelectedProduct(p)}
            >
              <div className="w-full h-32 rounded-xl bg-surface-alt flex items-center justify-center mb-4">
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
              <h3 className="text-sm font-semibold text-center text-text line-clamp-2 mb-3">
                {p.name}
              </h3>
              <span className="text-xs text-slate-600">
                {isGovt ? "Price on request" : `₹${p.price}`}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn-theme-primary px-5 py-3 rounded-xl disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn-theme-primary px-5 py-3 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

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
                <div>
                  <h3 className="font-semibold text-sm mb-1">Description</h3>
                  <p className="text-xs text-slate-600">
                    {selectedProduct.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Price</h3>
                  <p className="text-xs text-slate-600">
                    {isGovt ? "Price on request" : `₹${selectedProduct.price}`}
                  </p>
                </div>
                <Link
                  to={`/products/${selectedProduct._id}`}
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
