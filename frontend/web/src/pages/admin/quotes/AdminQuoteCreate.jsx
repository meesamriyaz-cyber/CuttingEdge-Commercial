import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createQuoteFromEnquiry } from "../../../api/adminQuotes";

export default function AdminQuoteCreate() {
  const { id: enquiryId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const enquiry = state?.enquiry;

  const [form, setForm] = useState({
    price: "",
    validityDate: "",
    notes: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await createQuoteFromEnquiry(enquiryId, form);
      // Redirect to enquiries page after successful quote creation
      navigate("/admin/enquiries", { replace: true });
    } catch (err) {
      alert(err.message || "Failed to create quote");
    }
  }

  if (!enquiry) {
    return <p className="p-4">Invalid enquiry context</p>;
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm border px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold">
        Create Quote for Enquiry #{enquiry._id.slice(-6).toUpperCase()}
      </h2>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-1">Organization</h3>
        <p className="text-sm">
          {enquiry.user?.organizationName ||
            enquiry.user?.departmentName ||
            enquiry.user?.name}
        </p>
        <p className="text-sm text-slate-500">
          {enquiry.user?.officialEmail || enquiry.user?.email}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-3 border rounded-md"
      >
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Quote Amount (₹)"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />

        <input
          name="validityDate"
          type="date"
          value={form.validityDate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Quote terms / notes"
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Create Quote
        </button>
      </form>
    </div>
  );
}
