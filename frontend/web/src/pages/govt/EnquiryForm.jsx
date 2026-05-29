import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import toast from "react-hot-toast";
export default function EnquiryForm() {
  const navigate = useNavigate();
  const { state } = useLocation(); // received from product page

  const accessToken = useAuthStore((state) => state.accessToken);

  const [quantity, setQuantity] = useState(1);
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const productId = state?.productId;
  const productName = state?.productName;

  if (!productId) {
    return (
      <div className="min-h-screen bg-page px-4 py-12">
        <div className="theme-card mx-auto max-w-xl rounded-[24px] p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Invalid enquiry request
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Please select a product before submitting an enquiry.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/govt/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId,
          quantity: parseInt(quantity, 10),
          requirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit enquiry");

      toast.success("Enquiry submitted successfully");
      navigate("/enquiries", { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <section className="hero-shell rounded-[28px] p-6 sm:p-8">
          <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Government enquiry
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            Submit product enquiry
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Share quantity and requirement details so the team can prepare an
            accurate procurement quote.
          </p>
        </section>

        <div className="theme-card mt-8 rounded-[24px] p-6 sm:p-8">
          <div className="panel-muted mb-6 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Product
            </p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">
              {productName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="theme-input"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Requirements & Specifications
              </label>
              <textarea
                rows="5"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="theme-input"
                placeholder="Describe your requirements, specifications, delivery location, timeline, etc."
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-slate-200 bg-white/80 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-200"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
