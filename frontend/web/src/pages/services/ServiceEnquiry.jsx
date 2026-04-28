import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui";

export default function ServiceEnquiry() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { accessToken, user } = useAuthStore();

  const [service, setService] = useState(null);
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadService() {
      if (!slug) {
        setError("No service specified");
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_URL}/services/${slug}`);
        const data = await res.json();
        
        if (res.ok) {
          setService(data);
        } else {
          setError(data.message || "Service not found");
        }
      } catch (err) {
        setError("Failed to load service. Please try again.");
      } finally {
        setLoading(false);
      }
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

  // Handle unauthenticated users - show login prompt
  if (!user) {
    return (
      <section className="min-h-screen bg-surface px-6 py-14 flex items-center">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="rounded-3xl border border-border bg-surface shadow-lg px-8 py-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Login Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please login to submit an enquiry about our services.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) return <p className="p-6">Loading…</p>;
  
  // Handle errors
  if (error) {
    return (
      <section className="min-h-screen bg-surface px-6 py-14 flex items-center">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="rounded-3xl border border-red-200 bg-red-50 dark:bg-red-900/20 shadow-lg px-8 py-12">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/services")}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </section>
    );
  }

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
            value={service?.name || ""}
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

          <Button
            type="submit"
            className="w-full"
          >
            Submit Enquiry
          </Button>
        </form>
      </div>
    </section>
  );
}
