import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminQuote, updateQuoteStatus } from "../../../api/adminQuotes";
import { Skeleton } from "../../../components/Skeleton";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminQuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const { accessToken } = useAuthStore();

  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("");
  const [adminRemark, setAdminRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminQuote(id);
      setQuote(data);
    } catch (err) {
      setError("Failed to load quote");
      toast.error("Failed to load quote");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    // 🛑 StrictMode protection
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    load();
  }, [id]);

  async function handleUpdate() {
    //await updateQuoteStatus(id, status, adminRemark);
    load();
  }

  async function downloadPDF() {
    try {
      const res = await fetch(`${API_BASE}/admin/quotes/${quote._id}/pdf`, {
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
      a.download = `Quote-${quote._id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!quote) return <p>Quote not found</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm border px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold">
        Quote #{quote.quoteNumber || quote._id.slice(-6)}
      </h2>
      <h2 className="text-lg font-semibold flex items-center gap-3">
        Quote #{quote._id.slice(-6).toUpperCase()}
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
        bg-green-100 text-green-700 border border-green-300"
        >
          ✔ Email sent
        </span>
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-medium mb-2">Organization</h3>
          <p className="text-sm">
            {quote.user?.organizationName || quote.user?.name || "N/A"}
          </p>
          <p className="text-sm">
            {quote.user?.officialEmail || quote.user?.email || "N/A"}
          </p>
        </div>

        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-medium mb-2">Quote Summary</h3>

          <div className="text-sm space-y-1">
            <div>
              Amount: <b>₹ {quote.price}</b>
            </div>
            <div>
              Valid till: {new Date(quote.validityDate).toLocaleDateString()}
            </div>
            <div>
              Status: <b>{quote.status}</b>
            </div>
          </div>

          {quote.notes && (
            <div className="mt-3 text-sm">
              <div className="font-medium">Notes</div>
              <p className="whitespace-pre-line">{quote.notes}</p>
            </div>
          )}

          <button
            onClick={downloadPDF}
            className="inline-block mt-3 px-3 py-2 border rounded text-sm"
          >
            Download Quote PDF
          </button>
        </div>
      </div>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-2">Quote Details</h3>

        <p className="text-sm whitespace-pre-line">
          {quote.notes || quote.description || "—"}
        </p>
      </div>
    </div>
  );
}
