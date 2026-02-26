import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";

export default function MyServiceQuotes() {
  const { accessToken } = useAuthStore();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuotes() {
    try {
      const res = await fetch(`${API_URL}/services/quote/my`, {
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
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
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
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
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
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
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
                My Service Quotes
              </h2>
              <p className="text-gray-600">No service quotes issued yet.</p>
              <a
                href="/service-enquiries"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View My Enquiries
              </a>
            </div>
          </div>
        </div>
      </RoleGate>
    );

  const isExpired = (validityDate) => new Date(validityDate) < new Date();

  const getStatusBadge = (quote) => {
    if (isExpired(quote.validityDate) && quote.status === "SENT") {
      return "bg-red-100 text-red-800";
    }
    const styles = {
      SENT: "bg-blue-100 text-blue-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };
    return styles[quote.status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (quote) => {
    if (isExpired(quote.validityDate) && quote.status === "SENT") {
      return "EXPIRED";
    }
    return quote.status;
  };

  return (
    <RoleGate allow={["PRIVATE", "PUBLIC"]}>
      <div className="min-h-screen bg py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Service Quotes
            </h2>
            <p className="text-gray-600 mt-1">
              View and manage your service quotations
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {quotes.length}
              </div>
              <div className="text-sm text-gray-600">Total Quotes</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  quotes.filter(
                    (q) => q.status === "SENT" && !isExpired(q.validityDate),
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {quotes.filter((q) => q.status === "APPROVED").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  quotes.filter(
                    (q) =>
                      q.status === "REJECTED" ||
                      (q.status === "SENT" && isExpired(q.validityDate)),
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Rejected/Expired</div>
            </div>
          </div>

          {/* Quotes List */}
          <div className="space-y-4">
            {quotes.map((quote) => {
              const expired = isExpired(quote.validityDate);

              return (
                <div
                  key={quote._id}
                  className={`bg-surface rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                    expired && quote.status === "SENT"
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Service Info */}
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {quote.enquiry?.service?.name ||
                                quote.enquiry?.serviceNameSnapshot ||
                                "Service Quote"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quote Date:{" "}
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
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quote)}`}
                        >
                          {getStatusText(quote)}
                        </span>
                      </div>
                    </div>

                    {/* Quote Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{quote.estimatedAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p
                          className={`text-sm font-medium ${expired ? "text-red-600" : "text-gray-900"}`}
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
                        <p className="text-sm text-gray-500">Quote ID</p>
                        <p className="text-sm font-medium text-gray-900">
                          #{quote._id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={`/service-quotes/${quote._id}`}
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
