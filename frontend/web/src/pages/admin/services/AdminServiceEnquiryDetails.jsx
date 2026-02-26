import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";

const STATUSES = ["NEW", "IN_PROGRESS", "QUOTED", "COMPLETED", "CLOSED"];

export default function AdminServiceEnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

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

      if (!id) {
        throw new Error("No enquiry ID provided in URL");
      }

      // Load enquiry
      const enquiryRes = await fetch(`${API_URL}/admin/service-enquiries/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!enquiryRes.ok) {
        throw new Error("Failed to load enquiry");
      }

      const enquiryData = await enquiryRes.json();
      setEnquiry(enquiryData);
      setStatus(enquiryData.status || "NEW");
      setAdminRemark(enquiryData.adminRemark || "");

      // Load quote if status is QUOTED
      if (enquiryData.status === "QUOTED") {
        try {
          const quoteRes = await fetch(`${API_URL}/admin/service-quotes`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const quotesData = await quoteRes.json();
          const quotes = quotesData.quotes || [];
          const foundQuote = quotes.find(q => q.enquiry?._id === id);
          setQuote(foundQuote);
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
    try {
      const res = await fetch(`${API_URL}/admin/service-enquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, adminRemark }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      load();
    } catch (err) {
      alert(err.message);
    }
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
        Service Enquiry #{enquiry._id.slice(-6).toUpperCase()}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-4 bg-white">
          <h3 className="font-medium mb-1">Customer</h3>
          <p className="text-sm">
            {enquiry.user?.organizationName || enquiry.user?.name}
          </p>
          <p className="text-xs text-slate-500">
            {enquiry.user?.officialEmail || enquiry.user?.email}
          </p>
          {enquiry.user?.phone && (
            <p className="text-xs text-slate-500">
              Phone: {enquiry.user.phone}
            </p>
          )}
        </div>

        <div className="border rounded p-4 bg-white">
          <h3 className="font-medium mb-1">Service</h3>
          <p className="text-sm">
            {enquiry.service?.name || enquiry.serviceNameSnapshot}
          </p>
          <p className="text-xs text-slate-500">
            Category: {enquiry.service?.category || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {status === "IN_PROGRESS" && !quote && (
          <button
            onClick={() =>
              navigate(`/admin/service-enquiries/${id}/create-quote`, {
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
            onClick={() => navigate(`/admin/service-quotes/${quote._id}`)}
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
              {s.replace("_", " ")}
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
          {enquiry.requirementDetails || "No requirements provided."}
        </p>
      </div>

      <div className="border rounded p-4 bg-white">
        <h3 className="font-medium mb-1">Enquiry Timeline</h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p>Created: {new Date(enquiry.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(enquiry.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
