import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllProducts,
  deactivateProduct,
  updateProduct,
} from "../../api/adminProducts";

const PAGE_SIZES = [5, 10, 20];

const CATEGORIES = [
  "Networking equipment",
  "Computers",
  "Printers",
  "IT Accessories",
  "Software",
  "Storage",
  "Electronic Appliances",
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL"); // ✅ NEW

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  /* ---------------- Load ---------------- */
  async function load() {
    const data = await fetchAllProducts();
    setProducts(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, []);

  /* ---------------- Search + Filters ---------------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return products.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);

      const matchSegment =
        segment === "ALL" || p.segment === segment;

      const matchStatus =
        status === "ALL" ||
        (status === "ACTIVE" && p.isActive) ||
        (status === "INACTIVE" && !p.isActive);

      const matchCategory =
        category === "ALL" || p.category === category;

      return (
        matchSearch &&
        matchSegment &&
        matchStatus &&
        matchCategory
      );
    });
  }, [products, search, segment, status, category]);

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, segment, status, category, pageSize]);

  /* ---------------- Inline Price Edit ---------------- */
  async function savePrice(id) {
    await updateProduct(id, { price: Number(editedPrice) });
    setEditingId(null);
    load();
  }

  return (
    <div className="min-h-screen bg-page py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ================= Header ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Product Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search, filter and manage products
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="btn-theme-primary px-4 py-2 rounded-lg text-sm font-medium"
          >
            + New Product
          </Link>
        </div>

        {/* ================= Filters ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, category"
            className="input-base"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-base"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="input-base"
          >
            <option value="ALL">All Segments</option>
            <option value="CONSUMER">Consumer</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-base"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="input-base"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>

        {/* ================= Desktop Table ================= */}
        <div className="hidden lg:block rounded-xl border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Name", "Category", "Segment", "Price", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="p-3 text-left font-medium text-slate-700">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {paginated.map((p) => (
                <tr key={p._id} className="border-t hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">
                      SKU: {p.sku || "N/A"}
                    </div>
                  </td>

                  <td className="p-3 text-slate-600">
                    {p.category || "—"}
                  </td>

                  <td className="p-3">
                    {p.segment}
                  </td>

                  <td className="p-3">
                    {editingId === p._id ? (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="h-8 w-24 input-base"
                        />
                        <button
                          onClick={() => savePrice(p._id)}
                          className="btn-success h-8 w-8"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn-muted h-8 w-8"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(p._id);
                          setEditedPrice(p.price);
                        }}
                        className="hover:underline font-medium"
                      >
                        ₹ {p.price}
                      </button>
                    )}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${p._id}`}
                        className="btn-muted"
                      >
                        Edit
                      </Link>
                      {p.isActive && (
                        <button
                          onClick={() =>
                            deactivateProduct(p._id).then(load)
                          }
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
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= Mobile Cards ================= */}
        <div className="grid gap-4 lg:hidden">
          {paginated.map((p) => (
            <div
              key={p._id}
              className="rounded-xl border bg-white p-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-slate-500">
                    {p.category} • {p.segment}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    p.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="text-sm font-medium">
                Price: ₹ {p.price}
              </div>

              <div className="flex justify-end gap-2">
                <Link to={`/admin/products/${p._id}`} className="btn-muted">
                  Edit
                </Link>
                {p.isActive && (
                  <button
                    onClick={() =>
                      deactivateProduct(p._id).then(load)
                    }
                    className="btn-danger"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= Pagination ================= */}
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-muted disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-muted disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
