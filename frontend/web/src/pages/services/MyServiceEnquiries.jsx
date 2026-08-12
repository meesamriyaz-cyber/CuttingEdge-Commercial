import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";
import { Button } from "../../components/ui";

export default function MyServiceEnquiries() {
  const { accessToken } = useAuthStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEnquiries() {
    try {
      const res = await fetch(`${API_URL}/services/enquiry/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load enquiries");

      setEnquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      NEW: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
      IN_PROGRESS: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300",
      QUOTED: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
      COMPLETED: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
      CLOSED: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300",
    };
    return styles[status] || styles.NEW;
  };

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="theme-card rounded-[24px] p-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading service enquiries...</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="theme-card rounded-[24px] p-8 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow={["PRIVATE", "PUBLIC"]} showFallback>
      <div className="min-h-screen bg-page px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <section className="hero-shell rounded-[28px] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div>
                <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Service workflow
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  My Service Enquiries
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Track submitted service requirements, response progress, and issued quotes.
                </p>
              </div>

              <div className="panel-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total enquiries
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {enquiries.length}
                </p>
              </div>
            </div>
          </section>

          {enquiries.length === 0 ? (
            <div className="theme-card mt-8 rounded-[24px] p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                No service enquiries submitted yet
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Explore services to begin an enquiry.
              </p>
              <Button to="/services" className="mt-6">
                Browse Services
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="theme-card rounded-[24px] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {enquiry.serviceNameSnapshot || enquiry.service?.name || "Service Enquiry"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Submitted{" "}
                        {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Requirements
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {enquiry.requirementDetails}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                    {enquiry.status === "QUOTED" ? (
                      <Button to={`/service-quotes/enquiry/${enquiry._id}`}>View Quote</Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        Awaiting response
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
