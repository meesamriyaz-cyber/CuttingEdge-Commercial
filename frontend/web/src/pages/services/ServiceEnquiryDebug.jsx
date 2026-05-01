import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function ServiceEnquiryDebug() {
  const [params] = useSearchParams();
  const slug = params.get("service");
  const navigate = useNavigate();

  const { accessToken, user } = useAuthStore();

  console.log("DEBUG: ServiceEnquiry mounted", {
    slug,
    user,
    accessToken,
    hasUser: !!user,
    hasAccessToken: !!accessToken
  });

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadService = async () => {
      if (!slug) {
        setError("No service slug provided in URL");
        setLoading(false);
        return;
      }

      try {
        console.log("DEBUG: Fetching service by slug:", slug);
        const res = await fetch(`${API_URL}/services/${slug}`);
        const data = await res.json();
        console.log("DEBUG: API Response:", res.status, data);
        
        if (res.ok) {
          setService(data);
        } else {
          setError(data.message || `Service not found (${res.status})`);
        }
      } catch (err) {
        console.error("DEBUG: Service fetch error:", err);
        setError("Failed to load service: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [slug]);

  return (
    <section className="min-h-screen bg-surface px-6 py-14 flex items-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-3xl border border-border bg-surface shadow-lg px-8 py-8 space-y-6">
          <h1 className="text-2xl font-extrabold hero-gradient-text">
            Service Enquiry Debug Page
          </h1>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Information:</h3>
            <pre className="text-xs text-yellow-700 dark:text-yellow-300">
              {JSON.stringify({
                slug,
                isAuthenticated: !!user,
                accessToken: !!accessToken,
                user: user,
                params: Object.fromEntries([...params])
              }, null, 2)}
            </pre>
          </div>

          {loading && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Loading service...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error:</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {service && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Service Loaded:</h3>
              <p className="text-sm text-green-700 dark:text-green-300">{service.name}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{service.description}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              to="/services"
              className="px-6 py-2.5 rounded-xl bg-gray-600 text-white font-semibold text-sm hover:bg-gray-700 transition-colors"
            >
              Back to Services
            </Link>
            
            {!user && (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
