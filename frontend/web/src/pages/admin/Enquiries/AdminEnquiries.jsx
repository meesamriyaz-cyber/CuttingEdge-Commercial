import { useEffect, useState } from "react";
import { fetchAdminEnquiries } from "../../../api/adminEnquiries";
import { Building2, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "../../../components/ui";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAdminEnquiries();
      setEnquiries(Array.isArray(data) ? data : data.enquiries || []);
    } catch (err) {
      console.error("Failed to load admin enquiries", err);
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
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "QUOTED":
        return "bg-green-100 text-green-800 border border-green-200";
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
            Government Enquiries
          </h2>
          <p className="text-slate-600 mt-1">
            {enquiries.length} total enquiries
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
              No enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Organization</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Qty</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        {enq._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {enq.user?.organizationName ||
                            enq.user?.departmentName ||
                            enq.user?.name ||
                            "Government Dept"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {enq.user?.officialEmail || enq.user?.email}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {enq.user?.clientType === "PRIVATE" ? (
                            <>
                              <ShoppingBag className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">Private</span>
                            </>
                          ) : enq.user?.clientType === "PUBLIC" ? (
                            <>
                              <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">Govt</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">—</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {enq.product?.name || "Product"}
                        </div>
                        <div className="text-xs text-slate-500">
                          SKU: {enq.product?.sku || "N/A"}
                        </div>
                      </td>

                      <td className="p-4">{enq.quantity || 1}</td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            enq.status,
                          )}`}
                        >
                          {(enq.status || "NEW").replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          to={`/admin/enquiries/${enq._id}`}
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
