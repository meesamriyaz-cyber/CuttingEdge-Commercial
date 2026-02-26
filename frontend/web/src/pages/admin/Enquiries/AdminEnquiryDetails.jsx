import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminEnquiry,
  updateEnquiryStatus,
} from "../../../api/adminEnquiries";
import { fetchQuoteByEnquiry } from "../../../api/adminQuotes";
import { Building2, ShoppingBag } from "lucide-react";

const STATUSES = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];

export default function AdminEnquiryDetails() {
  const { id } = useParams();
  console.log("AdminEnquiryDetails - ID from URL params:", id);
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("NEW");
  const [adminRemark, setAdminRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading enquiry with ID:", id);

      if (!id) {
        throw new Error("No enquiry ID provided in URL");
      }

      const enquiryData = await fetchAdminEnquiry(id);
      console.log("Enquiry data received:", enquiryData);

      if (!enquiryData || !enquiryData._id) {
        throw new Error("Invalid enquiry data received from server");
      }

      setEnquiry(enquiryData);
      setStatus(enquiryData.status || "NEW");
      setAdminRemark(enquiryData.adminRemark || "");

      if (enquiryData.status === "QUOTED") {
        try {
          const q = await fetchQuoteByEnquiry(id);
          setQuote(q);
        } catch (quoteErr) {
          console.error("Failed to load quote:", quoteErr);
          setQuote(null);
        }
      } else {
        setQuote(null);
      }
    } catch (err) {
      console.error("Failed to load enquiry:", err);
      setError(err.message || "Failed to load enquiry");
      setEnquiry(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    await updateEnquiryStatus(id, status, adminRemark);
    load();
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <p className="p-4">Loading…</p>;
  if (!enquiry)
    return (
      <div className="p-4">
        <p className="text-red-600 font-medium">Enquiry not found</p>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p className="font-medium">Error details:</p>
            <p>{error}</p>
          </div>
        )}
        <p className="mt-2 text-slate-600 text-sm">ID: {id}</p>
      </div>
    );

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm border px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold">
        Enquiry #{enquiry._id.slice(-6).toUpperCase()}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-4 bg-white">
          <h3 className="font-medium mb-1">Organization</h3>
          <p className="text-sm">
            {enquiry.user?.organizationName ||
              enquiry.user?.departmentName ||
              enquiry.user?.name}
          </p>
          <p className="text-xs text-slate-500">
            {enquiry.user?.officialEmail || enquiry.user?.email}
          </p>
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
            {enquiry.user?.clientType === "PRIVATE" ? (
              <>
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Private Customer</span>
              </>
            ) : enquiry.user?.clientType === "PUBLIC" ? (
              <>
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Government Client
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">—</span>
              </>
            )}
          </div>
        </div>

        {status === "IN_REVIEW" && !quote && (
          <button
            onClick={() =>
              navigate(`/admin/enquiries/${id}/create-quote`, {
                state: { enquiry },
              })
            }
            className="h-fit px-4 py-2 rounded bg-emerald-600 text-white text-sm"
          >
            Create Quote
          </button>
        )}

        {quote && (
          <button
            onClick={() => navigate(`/admin/quotes/${quote._id}`)}
            className="h-fit px-4 py-2 rounded bg-indigo-600 text-white text-sm"
          >
            View Quote
          </button>
        )}
      </div>

      <div className="border rounded p-4 bg-white space-y-2">
        <h3 className="font-medium">Status Management</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <textarea
          value={adminRemark}
          onChange={(e) => setAdminRemark(e.target.value)}
          placeholder="Internal admin remarks"
          className="border rounded px-2 py-1 text-sm w-full"
          rows={3}
        />

        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Save Update
        </button>
      </div>

      <div className="border rounded p-4 bg-white">
        <h3 className="font-medium mb-1">Client Requirements</h3>
        <p className="text-sm whitespace-pre-line text-slate-700">
          {enquiry.requirements || "No special requirements provided."}
        </p>
      </div>
    </div>
  );
}
