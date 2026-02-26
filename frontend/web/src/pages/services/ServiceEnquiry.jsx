import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function ServiceEnquiry() {
  const [params] = useSearchParams();
  const slug = params.get("service");
  const navigate = useNavigate();

  const { accessToken, user } = useAuthStore();

  const [service, setService] = useState(null);
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      const res = await fetch(`${API_URL}/services/${slug}`);
      const data = await res.json();
      if (res.ok) setService(data);
      setLoading(false);
    }
    loadService();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!requirement) {
      alert("Please describe your requirement");
      return;
    }

    const res = await fetch(`${API_URL}/services/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        serviceId: service._id,
        requirementDetails: requirement,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to submit enquiry");
      return;
    }

    navigate("/service-enquiries");
  }

  if (!user) return null;
  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <section className="min-h-screen bg-surface px-6 py-14 flex items-center">
      <div className="w-full max-w-xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-surface shadow-lg px-8 py-8 space-y-6"
        >
          <h1 className="text-2xl font-extrabold hero-gradient-text">
            Service Enquiry
          </h1>

          <input
            value={service.name}
            readOnly
            className="w-full rounded-xl bg-muted/40 px-4 py-3 text-sm"
          />

          <textarea
            rows={4}
            required
            placeholder="Describe your requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <button className="btn-theme-primary w-full">
            Submit Enquiry
          </button>
        </form>
      </div>
    </section>
  );
}
