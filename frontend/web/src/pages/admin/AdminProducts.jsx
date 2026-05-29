import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Pencil, Plus, Search, X } from "lucide-react";

import {
  deactivateProduct,
  fetchAllProducts,
  updateProduct,
} from "../../api/adminProducts";
import { Button } from "../../components/ui";

const PAGE_SIZES = [5, 10, 20];

const CATEGORIES = [
  "Networking equipment",
  "Computers",
  "Printers",
  "IT Accessories",
  "Software",
  "Storage",
  "Electronic Appliances",
  "Mi Mobiles"
];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  async function load() {
    const data = await fetchAllProducts();
    setProducts(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return products.filter((product) => {
      const matchSearch =
        product.name?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);
      const matchSegment = segment === "ALL" || product.segment === segment;
      const matchStatus =
        status === "ALL" ||
        (status === "ACTIVE" && product.isActive) ||
        (status === "INACTIVE" && !product.isActive);
      const matchCategory = category === "ALL" || product.category === category;

      return matchSearch && matchSegment && matchStatus && matchCategory;
    });
  }, [products, search, segment, status, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, segment, status, category, pageSize]);

  async function savePrice(id) {
    await updateProduct(id, { price: Number(editedPrice) });
    setEditingId(null);
    load();
  }

  return (
    <div className="space-y-5">
      <section className="hero-shell rounded-lg p-5 sm:p-6">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Catalogue Control
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
              Product management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Search, filter, price, and manage catalogue availability.
            </p>
          </div>

          <Button onClick={() => navigate("/admin/products/new")} size="sm">
            <Plus size={16} />
            New Product
          </Button>
        </div>
      </section>

      <section className="theme-card rounded-lg p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, SKU, category"
              className="input-base pl-9"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="input-base"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={segment}
            onChange={(event) => setSegment(event.target.value)}
            className="input-base"
          >
            <option value="ALL">All Segments</option>
            <option value="CONSUMER">Consumer</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-base"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="input-base"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="theme-card hidden overflow-hidden rounded-lg lg:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-950/45">
            <tr>
              {["Name", "Category", "Segment", "Price", "Status", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((product) => (
              <tr
                key={product._id}
                className="border-t border-slate-200/75 transition hover:bg-cyan-50/45 dark:border-cyan-950/45 dark:hover:bg-slate-900/55"
              >
                <td className="p-3">
                  <div className="font-semibold text-slate-950 dark:text-white">
                    {product.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    SKU: {product.sku || "N/A"}
                  </div>
                </td>

                <td className="p-3 text-slate-600 dark:text-slate-300">
                  {product.category || "--"}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-300">
                  {product.segment}
                </td>
                <td className="p-3">
                  {editingId === product._id ? (
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={editedPrice}
                        onChange={(event) => setEditedPrice(event.target.value)}
                        className="input-base h-8 w-24"
                      />
                      <button
                        onClick={() => savePrice(product._id)}
                        className="btn-success h-8 w-8"
                        aria-label="Save price"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-muted h-8 w-8"
                        aria-label="Cancel price edit"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(product._id);
                        setEditedPrice(product.price);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-cyan-800 dark:text-white dark:hover:text-cyan-200"
                    >
                      INR {product.price}
                      <Pencil size={13} />
                    </button>
                  )}
                </td>

                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      product.isActive
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/25 dark:text-emerald-200"
                        : "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/25 dark:text-red-200"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/${product._id}`} className="btn-muted">
                      Edit
                    </Link>
                    {product.isActive && (
                      <button
                        onClick={() => deactivateProduct(product._id).then(load)}
                        className="btn-danger"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!paginated.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {paginated.map((product) => (
          <div key={product._id} className="theme-card space-y-3 rounded-lg p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-slate-950 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {product.category} - {product.segment}
                </p>
              </div>
              <span
                className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  product.isActive
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Price: INR {product.price}
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Link to={`/admin/products/${product._id}`} className="btn-muted">
                Edit
              </Link>
              {product.isActive && (
                <button
                  onClick={() => deactivateProduct(product._id).then(load)}
                  className="btn-danger"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="theme-card flex flex-col gap-3 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2 sm:justify-end">
          <button
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="btn-muted disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="btn-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
