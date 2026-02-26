import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminOrders } from "../../../api/adminOrders";
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  Users,
  Filter,
  Search,
  TrendingUp,
  Building2,
} from "lucide-react";

const statusConfig = {
  PLACED: {
    label: "Placed",
    color: "bg-blue-100/80 text-blue-700 border-blue-200",
    icon: ShoppingBag,
  },
  PENDING: {
    label: "Pending",
    color: "bg-gray-100/80 text-gray-700 border-gray-200",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-yellow-100/80 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  PACKED: {
    label: "Packed",
    color: "bg-orange-100/80 text-orange-700 border-orange-200",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100/80 text-purple-700 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100/80 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100/80 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const getStatusConfig = (status) =>
  statusConfig[status] || statusConfig.PENDING;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  async function load() {
    setLoading(true);
    const data = await fetchAdminOrders();
    setOrders(Array.isArray(data) ? data : data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || order.total || 0),
    0,
  );
  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING",
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              All Orders
            </h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
              Admin
            </span>
          </div>
          <p className="text-slate-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {totalOrders}
                </p>
                <p className="text-slate-500">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-slate-500">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {pendingOrders}
                </p>
                <p className="text-slate-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {deliveredOrders}
                </p>
                <p className="text-slate-500">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 theme-card bg-surface border border-white/40 shadow-lg">
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, order ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none bg-slate-100 text-slate-900 border border-slate-200"
            >
              <option value="ALL">All Status</option>
              {Object.keys(statusConfig).map((status) => (
                <option key={status} value={status}>
                  {statusConfig[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl overflow-hidden theme-card bg-surface border border-white/40 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-slate-900">
                    Order Details
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-900">
                    Customer
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-900">
                    Type
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-900">
                    Amount
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const status = getStatusConfig(order.status);
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={order._id}
                        className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-mono font-medium text-slate-900">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                              <Users className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {order.user?.name || "—"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {order.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {order.user?.clientType === "PRIVATE" ? (
                              <>
                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900">Private</span>
                              </>
                            ) : order.user?.clientType === "PUBLIC" ? (
                              <>
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900">Govt</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900">—</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">
                            ₹
                            {(
                              order.totalAmount ||
                              order.total ||
                              0
                            ).toLocaleString("en-IN")}
                          </p>
                        </td>
                        <td className="p-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span className="text-sm font-medium">
                              {status.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-80 bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200"
                          >
                            View
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
