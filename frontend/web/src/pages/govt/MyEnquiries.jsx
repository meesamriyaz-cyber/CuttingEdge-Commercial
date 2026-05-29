import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import Pagination from "../../components/Pagination";
import DataTable from "../../components/DataTable";

export default function MyEnquiries() {
  const { accessToken } = useAuthStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showRequirements, setShowRequirements] = useState(false);

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const res = await fetch(`${API_URL}/govt/enquiries/my?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load enquiries");

      setEnquiries(data.enquiries || []);
      setTotalItems(data.total || data.enquiries.length);
    } catch (err) {
      setError(err.message);
      setEnquiries([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  useEffect(() => {
    loadEnquiries();
  }, [currentPage, pageSize, searchTerm, statusFilter, dateRange]);

  const getStatusColor = (status = "NEW") => {
    switch (status) {
      case "NEW":
        return "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/50";
      case "IN_REVIEW":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50";
      case "QUOTED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50";
      case "CLOSED":
        return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        accessor: (item) => item._id.slice(-8).toUpperCase(),
        className: "w-24",
        sortable: true,
      },
      {
        key: "product",
        header: "Product",
        accessor: (item) => item.product?.name || "Product",
        className: "w-48",
        sortable: true,
      },
      {
        key: "sku",
        header: "SKU",
        accessor: (item) => item.product?.sku || "N/A",
        className: "w-24",
        sortable: true,
      },
      {
        key: "quantity",
        header: "Qty",
        accessor: (item) => item.quantity || 1,
        className: "w-16 text-center",
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
        accessor: (item) => item.status || "NEW",
        render: (item) => (
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
            {(item.status || "NEW").replace("_", " ")}
          </span>
        ),
        className: "w-24",
        sortable: true,
      },
      {
        key: "createdAt",
        header: "Submitted",
        accessor: (item) => new Date(item.createdAt).toLocaleDateString("en-IN"),
        className: "w-32",
        sortable: true,
      },
      {
        key: "actions",
        header: "Actions",
        render: (item) => (
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEnquiry(item);
                setShowRequirements(true);
              }}
              className="text-sm font-medium text-cyan-700 transition-colors hover:text-orange-600 dark:text-cyan-300 dark:hover:text-orange-300"
            >
              View Requirements
            </button>
            {item.status === "QUOTED" && (
              <a
                href={`/quotes/enquiry/${item._id}`}
                className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-300"
              >
                View Quote
              </a>
            )}
          </div>
        ),
        className: "w-64",
        sortable: false,
      },
    ],
    [],
  );

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading && currentPage === 1) {
    return (
      <RoleGate allow={["PUBLIC"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="theme-card rounded-[24px] p-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading enquiries...</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PUBLIC"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="theme-card rounded-[24px] p-8 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow={["PUBLIC"]} showFallback>
      <div className="min-h-screen bg-page px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <motion.section
            className="hero-shell rounded-[28px] p-6 sm:p-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div>
                <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Procurement tracking
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  My Enquiries
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Search submitted requirements, monitor status, and move into quote review when available.
                </p>
              </div>

              <div className="panel-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total enquiries
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalItems}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.div
            className="theme-card mt-8 rounded-[24px] p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product, SKU, or status"
                  className="theme-input text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="theme-input text-sm"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="QUOTED">Quoted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="theme-input text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="theme-input text-sm"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setDateRange({ start: "", end: "" });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50/60 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:bg-slate-900"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="theme-card mt-6 overflow-hidden rounded-[24px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DataTable
              data={enquiries}
              columns={columns}
              isLoading={loading}
              emptyMessage="You have not submitted any enquiries yet."
              sortable
              searchable={false}
              className="border-0"
            />

            {totalPages > 1 && (
              <div className="px-5 pb-5">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={totalItems}
                />
              </div>
            )}
          </motion.div>

          {showRequirements && selectedEnquiry && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequirements(false)}
            >
              <motion.div
                className="theme-card w-full max-w-md rounded-[24px]"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Requirements
                    </h3>
                    <button
                      onClick={() => setShowRequirements(false)}
                      className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-500 dark:text-slate-400">
                        Product
                      </label>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedEnquiry.product?.name || "Product"}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-500 dark:text-slate-400">
                        Quantity
                      </label>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedEnquiry.quantity || 1}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-500 dark:text-slate-400">
                        Requirements
                      </label>
                      <div className="panel-muted p-3">
                        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                          {selectedEnquiry.requirements || "No additional requirements provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-200/80 pt-4 dark:border-slate-800">
                      <button
                        onClick={() => setShowRequirements(false)}
                        className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50/60 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:bg-slate-900"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
