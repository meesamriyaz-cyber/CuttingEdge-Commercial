import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminQuotes } from "../../../api/adminQuotes";

export default function AdminQuotes() {

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchAdminQuotes();
    setQuotes(Array.isArray(data) ? data : (data.quotes || []));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold text-slate-900">
        Government Quotes
      </h2>

      <div className="border rounded-md bg-white">
        <table className="w-full text-sm">
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
                  Loading…
                </td>
              </tr>
            )}

            {!loading && quotes.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan={5}>
                  No quotes found
                </td>
              </tr>
            )}

            {quotes.map(q => (
              <tr key={q._id} className="border-t">

                <td className="p-2">
                  {q.quoteNumber || q._id.slice(-6)}
                </td>

               <td className="p-2">
                {q.enquiry?.user?.organizationName ||
                q.user?.name ||
                "—"}
              </td>

              <td className="p-2">
                ₹ {q.price}
              </td>

                <td className="p-2">
                  {q.status}
                </td>

                <td className="p-2 text-right">
                  <Link
                    to={`/admin/quotes/${q._id}`}
                    className="px-2 py-1 border rounded"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
