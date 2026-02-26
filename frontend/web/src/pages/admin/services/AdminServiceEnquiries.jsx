import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";

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
        return "bg-purple-100 text-purple-800 border border-purple-200";
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

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto" />
              <p className="mt-2 text-slate-600">Loading enquiries…</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No service enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-medium">
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
                        <Link
                          to={`/admin/service-enquiries/${enq._id}`}
                          className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                        >
                          View
                        </Link>
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
