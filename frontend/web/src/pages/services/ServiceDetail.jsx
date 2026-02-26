import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`${API_URL}/services/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Service not found");
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [slug]);

  if (loading) return <p className="p-6">Loading service…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <section className="bg-surface px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/services" className="text-sm text-primary">
          ← Back to services
        </Link>

        <h1 className="text-3xl font-extrabold hero-gradient-text">
          {service.name}
        </h1>

        <p className="text-muted-foreground leading-relaxed">
          {service.longDescription || service.description}
        </p>

        {user && (
          <Link
            to={`/enquiry?service=${service.slug}`}
            className="inline-flex rounded-xl bg-primary px-6 py-3
                       text-white font-medium hover:bg-primary/90"
          >
            Enquire Now
          </Link>
        )}
      </div>
    </section>
  );
}
