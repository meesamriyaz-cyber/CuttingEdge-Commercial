import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";

export default function MyQuotes() {
  const { accessToken } = useAuthStore();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuotes() {
    try {
      const res = await fetch(`${API_URL}/govt/quotes/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load quotes");

      setQuotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadQuotes();
  }, []);

  if (loading) {
    return (
      <RoleGate allow={["PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface rounded-lg p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (!quotes.length)
    return (
      <RoleGate allow={["PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-surface rounded-lg shadow-sm p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                My Quotes
              </h2>
              <p className="text-gray-600">No quotes have been issued yet.</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );

  return (
    <RoleGate allow={["PUBLIC"]}>
      <div className="min-h-screen bg py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Quotes
            </h2>
            <p className="text-gray-600 mt-1">
              View and manage your quotations
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {quotes.length}
              </div>
              <div className="text-sm text-gray-600">Total Quotes</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {quotes.filter((q) => q.status === "SENT").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {quotes.filter((q) => q.status === "ACCEPTED").length}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {quotes.filter((q) => q.status === "REJECTED").length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  quotes.filter((q) => new Date(q.validityDate) < new Date())
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </div>

          {/* Quotes List */}
          <div className="space-y-4">
            {quotes.map((quote) => {
              const isExpired = new Date(quote.validityDate) < new Date();
              const hasEnquiry = quote.enquiry && quote.enquiry._id;

              return (
                <div
                  key={quote._id}
                  className={`bg-surface rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                    isExpired ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {quote.enquiry?.product?.name ||
                                "Service / Product"}
                            </h4>
                            {quote.enquiry?.product?.sku && (
                              <p className="text-sm text-gray-500">
                                SKU: {quote.enquiry.product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge - Combined into single badge */}
                      <div className="flex-shrink-0">
                        {isExpired ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            EXPIRED
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              quote.status === "SENT"
                                ? "bg-blue-100 text-blue-800"
                                : quote.status === "ACCEPTED"
                                  ? "bg-green-100 text-green-800"
                                  : quote.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {quote.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quote Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{quote.price?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p
                          className={`text-sm font-medium ${
                            isExpired ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {new Date(quote.validityDate).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quote Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(quote.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {hasEnquiry ? (
                        <a
                          href={`/quotes/enquiry/${quote.enquiry._id}`}
                          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Quote Details
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Enquiry Data Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
