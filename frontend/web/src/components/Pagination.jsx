import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cardHoverVariants, themeButtonVariants } from "../utils/animations";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  siblingCount = 1,
}) => {
  const [goToPage, setGoToPage] = useState("");

  // Reset go to page input when page changes
  useEffect(() => {
    setGoToPage("");
  }, [currentPage]);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = 7; // Total number of page buttons to show

    // Case 1: If the number of pages is less than the page numbers we want to show in our paginationComponent, we return the range [1..totalPages]
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, "DOTS", totalPages];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);

      return [firstPageIndex, "DOTS", ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }
  }, [totalPages, currentPage, siblingCount]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-muted">Items per page:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="
            px-3 py-1.5 rounded-lg border border-card-border
            bg-card-bg text-text text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
          "
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            px-3 py-1.5 rounded-lg border border-card-border
            bg-card-bg text-text text-sm
            hover:bg-surface-alt hover:border-surface
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card-bg
            transition-all duration-200
          "
          variants={themeButtonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === "DOTS") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 py-1.5 text-sm text-text-muted"
                >
                  ...
                </span>
              );
            }

            return (
              <motion.button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  border border-card-border
                  transition-all duration-200
                  ${
                    currentPage === pageNumber
                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                      : "bg-card-bg text-text hover:bg-surface-alt hover:border-surface"
                  }
                `}
                variants={cardHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {pageNumber}
              </motion.button>
            );
          })}
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            px-3 py-1.5 rounded-lg border border-card-border
            bg-card-bg text-text text-sm
            hover:bg-surface-alt hover:border-surface
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card-bg
            transition-all duration-200
          "
          variants={themeButtonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="flex items-center gap-1">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </motion.button>
      </div>

      {/* Go to page input */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-muted">Go to page:</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Page"
            className="
              w-16 px-2 py-1.5 rounded-lg border border-card-border
              bg-card-bg text-text text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all duration-200
            "
            min="1"
            max={totalPages}
          />
          <motion.button
            onClick={handleGoToPage}
            disabled={!goToPage || parseInt(goToPage) < 1 || parseInt(goToPage) > totalPages}
            className="
              px-3 py-1.5 rounded-lg border border-card-border
              bg-card-bg text-text text-sm
              hover:bg-surface-alt hover:border-surface
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card-bg
              transition-all duration-200
            "
            variants={themeButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Go
          </motion.button>
        </div>
      </div>

      {/* Info text */}
      <div className="text-sm text-text-muted">
        Page {currentPage} of {totalPages} • Showing{" "}
        {Math.min((currentPage - 1) * pageSize + 1, totalItems)} -{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
      </div>
    </div>
  );
};

// Helper function to create range of numbers
const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export default Pagination;
