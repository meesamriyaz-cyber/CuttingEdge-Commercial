import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../../components/ui";

export default function AdminServiceEnquiries() {
  const { accessToken } = useAuthStore();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/service-enquiries`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : data.enquiries || []);
    } catch (err) {
      console.error("Failed to load service enquiries", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const getStatusColor = (status = "NEW") => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "QUOTED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Service Enquiries
          </h2>
          <p className="text-slate-600 mt-1">
            {enquiries.length} total service enquiries
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto" />
              <p className="mt-2 text-slate-600 dark:text-slate-300">Loading enquiries…</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-600 dark:text-slate-300">
              No service enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700/50">
                  <tr>
                    <th className="p-4 text-left text-slate-600 dark:text-slate-300">ID</th>
                    <th className="p-4 text-left text-slate-600 dark:text-slate-300">Customer</th>
                    <th className="p-4 text-left text-slate-600 dark:text-slate-300">Service</th>
                    <th className="p-4 text-left text-slate-600 dark:text-slate-300">Status</th>
                    <th className="p-4 text-left text-slate-600 dark:text-slate-300">Date</th>
                    <th className="p-4 text-right text-slate-600 dark:text-slate-300">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        {enq._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {enq.user?.organizationName ||
                            enq.user?.name ||
                            "Customer"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {enq.user?.officialEmail || enq.user?.email}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {enq.service?.name ||
                            enq.serviceNameSnapshot ||
                            "Service"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {enq.service?.category || "N/A"}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            enq.status,
                          )}`}
                        >
                          {(enq.status || "NEW").replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          to={`/admin/service-enquiries/${enq._id}`}
                          className="min-h-8 px-3 py-1.5 text-xs"
                        >
                          View
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
