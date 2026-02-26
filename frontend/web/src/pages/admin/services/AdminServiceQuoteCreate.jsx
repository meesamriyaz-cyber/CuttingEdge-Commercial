import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";

export default function AdminServiceQuoteCreate() {
  const { id: enquiryId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { accessToken } = useAuthStore();

  const enquiry = state?.enquiry;

  const [form, setForm] = useState({
    estimatedAmount: "",
    validityDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/admin/service-quotes/from-enquiry/${enquiryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create quote");
      }

      // Redirect to enquiries page after successful quote creation
      navigate("/admin/service-enquiries", { replace: true });
    } catch (err) {
      alert(err.message || "Failed to create quote");
    } finally {
      setLoading(false);
    }
  }

  if (!enquiry) {
    return (
      <div className="p-4">
        <p className="text-red-600">Invalid enquiry context</p>
        <button
          onClick={() => navigate("/admin/service-enquiries")}
          className="mt-4 text-sm border px-3 py-1 rounded"
        >
          ← Back to Enquiries
        </button>
      </div>
    );
  }

  // Set default validity date to 30 days from now
  const defaultValidityDate = new Date();
  defaultValidityDate.setDate(defaultValidityDate.getDate() + 30);
  const formattedDefaultDate = defaultValidityDate.toISOString().split("T")[0];

  return (
    <div className="space-y-4 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm border px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold">
        Create Service Quote for Enquiry #{enquiry._id.slice(-6).toUpperCase()}
      </h2>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-1">Customer</h3>
        <p className="text-sm">
          {enquiry.user?.organizationName || enquiry.user?.name}
        </p>
        <p className="text-sm text-slate-500">
          {enquiry.user?.officialEmail || enquiry.user?.email}
        </p>
      </div>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-1">Service</h3>
        <p className="text-sm">
          {enquiry.service?.name || enquiry.serviceNameSnapshot}
        </p>
        <p className="text-xs text-slate-500">
          Category: {enquiry.service?.category || "N/A"}
        </p>
      </div>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-1">Requirements</h3>
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {enquiry.requirementDetails || "No requirements provided."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-3 border rounded-md"
      >
        <h3 className="font-medium">Quote Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Amount (₹)
          </label>
          <input
            name="estimatedAmount"
            type="number"
            value={form.estimatedAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valid Until
          </label>
          <input
            name="validityDate"
            type="date"
            value={form.validityDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Default: 30 days from today ({formattedDefaultDate})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Terms
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Enter any terms, conditions, or additional notes"
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Quote..." : "Create Quote"}
        </button>
      </form>
    </div>
  );
}
