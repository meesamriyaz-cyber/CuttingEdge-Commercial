import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";
import { Button } from "../../components/ui";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function MyServiceQuotes() {
  const { accessToken } = useAuthStore();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuotes() {
    try {
      const res = await fetch(`${API_URL}/services/quote/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load quotes");

      setQuotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  const isExpired = (validityDate) => new Date(validityDate) < new Date();

  const getStatusBadge = (quote) => {
    if (isExpired(quote.validityDate) && quote.status === "SENT") {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300";
    }

    const styles = {
      SENT: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300",
      APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300",
      REJECTED: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300",
    };

    return styles[quote.status] || "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";
  };

  const getStatusText = (quote) => {
    if (isExpired(quote.validityDate) && quote.status === "SENT") {
      return "EXPIRED";
    }
    return quote.status;
  };

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="theme-card rounded-[24px] p-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading service quotes...</p>
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
                  Service quotation workflow
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  My Service Quotes
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Review issued service quotations, validity timelines, and response status.
                </p>
              </div>

              <div className="panel-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total quotes
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {quotes.length}
                </p>
              </div>
            </div>
          </section>

          {quotes.length === 0 ? (
            <div className="theme-card mt-8 rounded-[24px] p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                No service quotes issued yet
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Quotes will appear here once your service enquiries are reviewed.
              </p>
              <Button to="/service-enquiries" className="mt-6">
                View My Enquiries
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {quotes.map((quote) => {
                const expired = isExpired(quote.validityDate);

                return (
                  <div key={quote._id} className="theme-card rounded-[24px] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {quote.enquiry?.service?.name || quote.enquiry?.serviceNameSnapshot || "Service Quote"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Quote date{" "}
                          {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(quote)}`}>
                        {getStatusText(quote)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-slate-200/80 pt-5 dark:border-slate-800 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Amount</p>
                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                          {currencyFormatter.format(quote.estimatedAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Valid until</p>
                        <p className={`mt-1 text-sm font-medium ${expired ? "text-red-600 dark:text-red-300" : "text-slate-900 dark:text-white"}`}>
                          {new Date(quote.validityDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Quote ID</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                          #{quote._id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                      <Button to={`/service-quotes/${quote._id}`}>View Quote Details</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
