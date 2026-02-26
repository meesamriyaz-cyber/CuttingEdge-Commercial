import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cardHoverVariants, themeButtonVariants } from "../utils/animations";

const DataTable = ({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = "No data available",
  className = "",
  sortable = true,
  searchable = true,
  searchPlaceholder = "Search...",
  defaultSortField = null,
  defaultSortDirection = "asc",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(
    defaultSortField
      ? { key: defaultSortField, direction: defaultSortDirection }
      : null
  );

  // Handle sorting
  const handleSort = useCallback((field) => {
    setSortConfig((prevConfig) => {
      if (!prevConfig || prevConfig.key !== field) {
        return { key: field, direction: "asc" };
      }
      if (prevConfig.direction === "asc") {
        return { key: field, direction: "desc" };
      }
      return null;
    });
  }, []);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((item) => {
      return columns.some((column) => {
        if (!column.searchable) return false;

        const value = column.accessor
          ? column.accessor(item)
          : item[column.key];
        if (value == null) return false;

        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.accessor
        ? sortConfig.accessor(a)
        : a[sortConfig.key];
      const bValue = sortConfig.accessor
        ? sortConfig.accessor(b)
        : b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Get sort icon
  const getSortIcon = (field) => {
    if (!sortConfig || sortConfig.key !== field) {
      return (
        <svg
          className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4 text-primary-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-primary-600"
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
    );
  };

  return (
    <div className={`theme-card overflow-hidden ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-card-border">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="
                w-full pl-10 pr-4 py-2 rounded-lg border border-card-border
                bg-card-bg text-text text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
              "
            />
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider
                    ${
                      sortable && column.sortable !== false
                        ? "cursor-pointer group"
                        : ""
                    }
                    ${column.className || ""}
                  `}
                  onClick={() =>
                    sortable &&
                    column.sortable !== false &&
                    handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortable &&
                      column.sortable !== false &&
                      getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-card-border">
            {isLoading ? (
              // Loading state
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin h-6 w-6 border-b-2 border-primary-600 rounded-full" />
                    <span className="text-text-muted">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-text-muted"
                >
                  {searchTerm
                    ? `No results found for "${searchTerm}"`
                    : emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((item, index) => (
                <motion.tr
                  key={item._id || index}
                  className={`
                    hover:bg-surface-alt transition-colors duration-200
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                  onClick={() => onRowClick && onRowClick(item)}
                  variants={cardHoverVariants}
                  whileHover="hover"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-text ${
                        column.cellClassName || ""
                      }`}
                    >
                      {column.render
                        ? column.render(item)
                        : column.accessor
                        ? column.accessor(item)
                        : item[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-card-border">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary-600 rounded-full" />
              <span className="text-text-muted">Loading data...</span>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="p-6 text-center text-text-muted">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : emptyMessage}
          </div>
        ) : (
          sortedData.map((item, index) => (
            <motion.div
              key={item._id || index}
              className={`
                p-4 theme-card
                ${onRowClick ? "cursor-pointer" : ""}
              `}
              onClick={() => onRowClick && onRowClick(item)}
              variants={cardHoverVariants}
              whileHover="hover"
            >
              <div className="space-y-3">
                {/* First row: ID and Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-muted">ID</span>
                    <div className="font-medium">
                      {columns.find(c => c.key === 'id')?.accessor ? 
                        columns.find(c => c.key === 'id').accessor(item) : 
                        item._id?.slice(-8).toUpperCase() || "N/A"}
                    </div>
                  </div>
                  <div>
                    {columns.find(c => c.key === 'status')?.render ? 
                      columns.find(c => c.key === 'status').render(item) : 
                      (item.status || "NEW").replace("_", " ")}
                  </div>
                </div>

                {/* Second row: Product and SKU */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-text-muted">Product</span>
                    <div className="font-medium">
                      {columns.find(c => c.key === 'product')?.accessor ? 
                        columns.find(c => c.key === 'product').accessor(item) : 
                        item.product?.name || "Product"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">SKU</span>
                    <div className="font-medium">
                      {columns.find(c => c.key === 'sku')?.accessor ? 
                        columns.find(c => c.key === 'sku').accessor(item) : 
                        item.product?.sku || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Third row: Quantity and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-text-muted">Quantity</span>
                    <div className="font-medium">
                      {columns.find(c => c.key === 'quantity')?.accessor ? 
                        columns.find(c => c.key === 'quantity').accessor(item) : 
                        item.quantity || 1}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">Submitted</span>
                    <div className="font-medium">
                      {columns.find(c => c.key === 'createdAt')?.accessor ? 
                        columns.find(c => c.key === 'createdAt').accessor(item) : 
                        new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-card-border">
                  {columns.find(c => c.key === 'actions')?.render ? 
                    columns.find(c => c.key === 'actions').render(item) : 
                    null}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataTable;
