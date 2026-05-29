import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminQuotes } from "../../../api/adminQuotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchAdminQuotes();
    setQuotes(Array.isArray(data) ? data : data.quotes || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const quoteRows = quotes.map((quote) => ({
    id: quote._id,
    number: quote.quoteNumber || quote._id.slice(-6),
    department:
      quote.enquiry?.user?.organizationName || quote.user?.name || "—",
    amount: quote.price,
    status: quote.status,
  }));

  return (
    <div className="space-y-4 px-4 py-6 sm:px-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Government Quotes
      </h2>

      <div className="hidden overflow-x-auto rounded-md border bg-white md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="p-2 text-left">Quote #</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && quoteRows.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan={5}>
                  No quotes found
                </td>
              </tr>
            )}

            {quoteRows.map((quote) => (
              <tr key={quote.id} className="border-t">
                <td className="p-2">{quote.number}</td>
                <td className="p-2">{quote.department}</td>
                <td className="p-2">₹ {quote.amount}</td>
                <td className="p-2">{quote.status}</td>
                <td className="p-2 text-right">
                  <Link
                    to={`/admin/quotes/${quote.id}`}
                    className="rounded border px-2 py-1"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {loading && (
          <div className="rounded-lg border bg-white p-4 text-center text-sm">
            Loading...
          </div>
        )}

        {!loading && quoteRows.length === 0 && (
          <div className="rounded-lg border bg-white p-4 text-center text-sm text-slate-500">
            No quotes found
          </div>
        )}

        {quoteRows.map((quote) => (
          <div key={quote.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quote #{quote.number}
                </p>
                <h3 className="mt-1 break-words font-semibold text-slate-900">
                  {quote.department}
                </h3>
                <p className="mt-1 text-sm text-slate-600">₹ {quote.amount}</p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {quote.status}
              </span>
            </div>
            <Link
              to={`/admin/quotes/${quote.id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
