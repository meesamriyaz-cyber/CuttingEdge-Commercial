import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";

export default function MyServiceEnquiries() {
  const { accessToken } = useAuthStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEnquiries() {
    try {
      const res = await fetch(`${API_URL}/services/enquiry/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load enquiries");

      setEnquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
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

  if (!enquiries.length)
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-surface rounded-lg shadow-sm p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                My Service Enquiries
              </h2>
              <p className="text-gray-600">
                No service enquiries submitted yet.
              </p>
              <a
                href="/services"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Browse Services
              </a>
            </div>
          </div>
        </div>
      </RoleGate>
    );

  const getStatusBadge = (status) => {
    const styles = {
      NEW: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      QUOTED: "bg-green-100 text-green-800",
      COMPLETED: "bg-emerald-100 text-emerald-800",
      CLOSED: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <RoleGate allow={["PRIVATE", "PUBLIC"]}>
      <div className="min-h-screen bg py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Service Enquiries
            </h2>
            <p className="text-gray-600 mt-1">
              Track your service enquiries and quotes
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {enquiries.length}
              </div>
              <div className="text-sm text-gray-600">Total Enquiries</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {
                  enquiries.filter(
                    (e) => e.status === "NEW" || e.status === "IN_PROGRESS",
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {enquiries.filter((e) => e.status === "QUOTED").length}
              </div>
              <div className="text-sm text-gray-600">Quoted</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {enquiries.filter((e) => e.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 truncate">
                            {enq.serviceNameSnapshot ||
                              enq.service?.name ||
                              "Service Enquiry"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Submitted:{" "}
                            {new Date(enq.createdAt).toLocaleDateString(
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
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(enq.status)}`}
                      >
                        {enq.status}
                      </span>
                    </div>
                  </div>

                  {/* Requirement Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Requirements:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {enq.requirementDetails}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {enq.status === "QUOTED" ? (
                      <a
                        href={`/service-quotes/enquiry/${enq._id}`}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
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
                        View Quote
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-sm text-gray-500">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Awaiting admin response
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
