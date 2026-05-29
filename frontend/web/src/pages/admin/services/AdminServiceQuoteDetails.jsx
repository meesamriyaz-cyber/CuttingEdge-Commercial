import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, CalendarDays, FileText, UserRound } from "lucide-react";

import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminServiceQuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/admin/service-quotes/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load service quote");
        }

        setQuote(data);
      } catch (err) {
        setQuote(null);
        toast.error(err.message || "Failed to load service quote");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadQuote();
  }, [id, accessToken]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200" />
        <div className="theme-card rounded-[24px] p-8">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="theme-card max-w-3xl rounded-[24px] p-8 text-center">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Service quote not found
        </p>
      </div>
    );
  }

  const service = quote.enquiry?.service;

  return (
    <div className="max-w-4xl space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-cyan-300 hover:text-cyan-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="theme-card rounded-[24px] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Service quote
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              Quote #{quote._id.slice(-6).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {service?.name || quote.enquiry?.serviceNameSnapshot || "Service"}
            </p>
          </div>

          <span className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            {quote.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="panel-muted p-4">
            <FileText className="h-5 w-5 text-cyan-700" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Estimated amount
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {currencyFormatter.format(quote.estimatedAmount || 0)}
            </p>
          </div>

          <div className="panel-muted p-4">
            <CalendarDays className="h-5 w-5 text-orange-600" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Valid until
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {formatDate(quote.validityDate)}
            </p>
          </div>

          <div className="panel-muted p-4">
            <UserRound className="h-5 w-5 text-emerald-600" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {quote.user?.organizationName || quote.user?.name || "Customer"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="theme-card rounded-[24px] p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Customer
          </h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <p>{quote.user?.organizationName || quote.user?.name || "N/A"}</p>
            <p>{quote.user?.officialEmail || quote.user?.email || "N/A"}</p>
            {quote.user?.phone && <p>{quote.user.phone}</p>}
          </div>
        </div>

        <div className="theme-card rounded-[24px] p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Service
          </h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <p>{service?.name || quote.enquiry?.serviceNameSnapshot || "N/A"}</p>
            <p>Category: {service?.category || "N/A"}</p>
            <p>Enquiry: {quote.enquiry?._id?.slice(-8).toUpperCase() || "N/A"}</p>
          </div>
        </div>
      </section>

      <section className="theme-card rounded-[24px] p-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Notes and requirements
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="panel-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quote notes
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
              {quote.notes || "No quote notes added."}
            </p>
          </div>
          <div className="panel-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer requirement
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
              {quote.enquiry?.requirementDetails || "No requirement details provided."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
