import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";

export default function ServiceQuoteDetails() {
  const { id, enquiryId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadQuote() {
    try {
      setLoading(true);
      setError("");

      // Determine which endpoint to use based on available params
      let url;
      if (id) {
        url = `${API_URL}/services/quote/${id}`;
      } else if (enquiryId) {
        url = `${API_URL}/services/quote/by-enquiry/${enquiryId}`;
      } else {
        throw new Error("No quote ID or enquiry ID provided");
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Quote not found");

      setQuote(data);
    } catch (err) {
      setError(err.message);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, [id, enquiryId]);

  async function handleDecision(decision) {
    try {
      setActionLoading(true);

      const res = await fetch(
        `${API_URL}/services/quote/${quote._id}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ decision }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refresh quote data
      loadQuote();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function downloadPDF() {
    try {
      const res = await fetch(`${API_URL}/services/quote/${quote._id}/pdf`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ServiceQuote-${quote._id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-sm border px-3 py-1 rounded hover:bg-gray-100"
            >
              ← Back
            </button>
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

  if (!quote) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p>Quote not available</p>
          </div>
        </div>
      </RoleGate>
    );
  }

  const isExpired = new Date(quote.validityDate) < new Date();
  const canDecide = quote.status === "SENT" && !isExpired;

  const getStatusBadge = () => {
    if (isExpired && quote.status === "SENT") {
      return { text: "EXPIRED", class: "bg-red-100 text-red-800" };
    }
    const styles = {
      SENT: { text: "SENT", class: "bg-blue-100 text-blue-800" },
      APPROVED: { text: "APPROVED", class: "bg-green-100 text-green-800" },
      REJECTED: { text: "REJECTED", class: "bg-red-100 text-red-800" },
      EXPIRED: { text: "EXPIRED", class: "bg-gray-100 text-gray-800" },
    };
    return (
      styles[quote.status] || {
        text: quote.status,
        class: "bg-gray-100 text-gray-800",
      }
    );
  };

  const statusBadge = getStatusBadge();

  return (
    <RoleGate allow={["PRIVATE", "PUBLIC"]}>
      <div className="min-h-screen bg py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm border px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Service Quotation
              </h2>
              <p className="text-gray-600">Quote ID: #{quote._id.slice(-6)}</p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.class}`}
            >
              {statusBadge.text}
            </span>
          </div>

          {/* Service Details Card */}
          <div className="bg-surface border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service Name</p>
                <p className="font-medium text-gray-900">
                  {quote.enquiry?.service?.name ||
                    quote.enquiry?.serviceNameSnapshot ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {quote.enquiry?.service?.category || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Quote Details Card */}
          <div className="bg-surface border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Quote Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Estimated Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{quote.estimatedAmount?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p
                  className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}
                >
                  {new Date(quote.validityDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {isExpired && (
                  <p className="text-xs text-red-500 mt-1">
                    This quote has expired
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Quote Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {quote.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Notes from Admin</p>
                <p className="text-gray-700 whitespace-pre-line">
                  {quote.notes}
                </p>
              </div>
            )}
          </div>

          {/* Enquiry Details Card */}
          <div className="bg-surface border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Your Requirements
            </h3>
            <div>
              <p className="text-sm text-gray-500 mb-2">Requirement Details:</p>
              <p className="text-gray-700 whitespace-pre-line bg-gray-50 rounded p-4">
                {quote.enquiry?.requirementDetails || "No details provided"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Enquiry Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(quote.enquiry?.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enquiry Status</p>
                <p className="font-medium text-gray-900">
                  {quote.enquiry?.status}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-surface border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Actions
            </h3>

            {/* Accept / Reject Buttons */}
            {canDecide ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Please review the quote and select your decision:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDecision("APPROVED")}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Processing..." : "✓ Accept Quote"}
                  </button>
                  <button
                    onClick={() => handleDecision("REJECTED")}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Processing..." : "✕ Reject Quote"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                {quote.status === "APPROVED" ? (
                  <div className="text-green-700">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-medium">You have accepted this quote</p>
                  </div>
                ) : quote.status === "REJECTED" ? (
                  <div className="text-red-700">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-medium">You have rejected this quote</p>
                  </div>
                ) : isExpired ? (
                  <div className="text-gray-600">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
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
                    <p className="font-medium">This quote has expired</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* PDF Download */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Quote (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
