import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import Pagination from "../../components/Pagination";
import DataTable from "../../components/DataTable";
import { motion } from "framer-motion";

export default function MyEnquiries() {
  const { accessToken } = useAuthStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Requirements modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showRequirements, setShowRequirements] = useState(false);

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      // Build query parameters
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

  // Reload enquiries when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadEnquiries();
  }, [searchTerm, statusFilter, dateRange]);

  // Reload enquiries when page or page size changes
  useEffect(() => {
    loadEnquiries();
  }, [currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  const getStatusColor = (status = "NEW") => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "QUOTED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              item.status,
            )}`}
          >
            {(item.status || "NEW").replace("_", " ")}
          </span>
        ),
        className: "w-24",
        sortable: true,
      },
      {
        key: "createdAt",
        header: "Submitted",
        accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
        className: "w-32",
        sortable: true,
      },
      {
        key: "actions",
        header: "Actions",
        render: (item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEnquiry(item);
                setShowRequirements(true);
              }}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View Requirements
            </button>
          {item.status === "QUOTED" && (
            <a
              href={`/quotes/enquiry/${item._id}`}
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
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

  const handleRowClick = (item) => {
    // Handle row click - could navigate to details or expand row
    console.log("Row clicked:", item);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading && currentPage === 1) {
    return (
      <RoleGate allow={["PUBLIC"]}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            className="theme-card p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full mx-auto" />
            <p className="mt-4 text-text-muted">Loading enquiries…</p>
          </motion.div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PUBLIC"]}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            className="theme-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 text-red-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow={["PUBLIC"]}>
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-text">My Enquiries</h2>
            <p className="text-text-muted mt-1">{totalItems} total enquiries</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="theme-card p-4 mb-6 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product, SKU, or status..."
                  className="
                  w-full px-3 py-2 rounded-lg border border-card-border
                  bg-card-bg text-text text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  transition-all duration-200
                "
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
                  w-full px-3 py-2 rounded-lg border border-card-border
                  bg-card-bg text-text text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  transition-all duration-200
                "
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="QUOTED">Quoted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="
                    w-full px-3 py-2 rounded-lg border border-card-border
                    bg-card-bg text-text text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                  "
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="
                    w-full px-3 py-2 rounded-lg border border-card-border
                    bg-card-bg text-text text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                  "
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setDateRange({ start: "", end: "" });
                  }}
                  className="
                  w-full px-4 py-2 rounded-lg border border-card-border
                  bg-card-bg text-text text-sm
                  hover:bg-surface-alt hover:border-surface
                  transition-all duration-200
                "
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            className="theme-card overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <DataTable
              data={enquiries}
              columns={columns}
              onRowClick={handleRowClick}
              isLoading={loading}
              emptyMessage="You have not submitted any enquiries yet."
              sortable={true}
              searchable={false} // We have our own search in filters
              className="border-0"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={totalItems}
              />
            )}
          </motion.div>

          {/* Requirements Modal */}
          {showRequirements && selectedEnquiry && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequirements(false)}
            >
              <motion.div
                className="theme-card max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text">
                      Requirements
                    </h3>
                    <button
                      onClick={() => setShowRequirements(false)}
                      className="text-text-muted hover:text-text transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Product
                      </label>
                      <p className="text-text">
                        {selectedEnquiry.product?.name || "Product"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Quantity
                      </label>
                      <p className="text-text">
                        {selectedEnquiry.quantity || 1}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Requirements
                      </label>
                      <div className="bg-surface p-3 rounded-lg">
                        <p className="text-text whitespace-pre-wrap">
                          {selectedEnquiry.requirements ||
                            "No additional requirements provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-card-border">
                      <button
                        onClick={() => setShowRequirements(false)}
                        className="px-4 py-2 rounded-lg border border-card-border bg-card-bg text-text hover:bg-surface-alt transition-colors"
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
