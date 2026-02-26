import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchAdminOrder, updateOrderStatus } from "../../../api/adminOrders";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Users,
  Building2,
  Save,
  PackageCheck,
  Box,
} from "lucide-react";

const ORDER_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    icon: Package,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    value: "PACKED",
    label: "Packed",
    icon: Box,
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
  },
];

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
    icon: Package,
  },
  PACKED: {
    label: "Packed",
    color: "bg-orange-100/80 text-orange-700 border-orange-200",
    icon: Box,
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

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetchAdminOrder(id);
    setOrder(data);
    setStatus(data.status);
    setLoading(false);
  }

  async function handleStatusChange() {
    setUpdating(true);
    await updateOrderStatus(id, status);
    setUpdating(false);
    load();
  }

  useEffect(() => {
    load();
  }, [id]);

  const getProductImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      return item.product.images[0].url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-xl p-8 text-center theme-card bg-surface border border-white/40 shadow-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              Order Not Found
            </h3>
            <p className="text-slate-500">
              The order you're looking for doesn't exist.
            </p>
            <Link
              to="/admin/orders"
              className="inline-flex items-center mt-4 font-medium text-indigo-600 hover:opacity-80"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = getStatusConfig(order.status);
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/admin/orders"
          className="inline-flex items-center mb-6 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>

        {/* Header with Admin Badge */}
        <div className="rounded-2xl p-6 mb-6 theme-card bg-surface border border-white/40 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm text-slate-500">Order ID</p>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Admin
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                #{order._id ? order._id.slice(-8).toUpperCase() : "N/A"}
              </h1>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border ${currentStatus.color}`}
            >
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium">{currentStatus.label}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Order Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="font-medium text-slate-900">
                  ₹
                  {(order.totalAmount || order.total || 0).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Users className="w-5 h-5 text-slate-400" />
              Customer Information
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100">
                <Users className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {order.user?.name || "—"}
                </p>
                <p className="text-slate-500">{order.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
              {order.user?.clientType === "PRIVATE" ? (
                <>
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-900">
                    Private Customer
                  </span>
                </>
              ) : order.user?.clientType === "PUBLIC" ? (
                <>
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-900">
                    Government Client
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-900">—</span>
                </>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <PackageCheck className="w-5 h-5 text-slate-400" />
              Update Order Status
            </h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl mb-4 outline-none bg-slate-100 text-slate-900 border border-slate-200"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusChange}
              disabled={updating || status === order.status}
              className="w-full px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 btn-theme-primary animate-gradient"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl p-6 mb-6 theme-card bg-surface border border-white/40 shadow-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Package className="w-5 h-5 text-slate-400" />
            Order Items
          </h3>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-xl bg-slate-100"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {getProductImage(item) ? (
                    <img
                      src={getProductImage(item)}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-surface border border-slate-200">
                      <Package className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold truncate text-slate-900">
                    {item.product?.name || "Product"}
                  </h4>
                  <p className="text-sm mt-1 text-slate-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-slate-500">
                    Price: ₹
                    {item.priceAtOrder?.toLocaleString("en-IN") ||
                      item.price?.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ₹
                    {(
                      item.quantity * (item.priceAtOrder || item.price || 0)
                    )?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <MapPin className="w-5 h-5 text-slate-400" />
            Shipping Address
          </h3>
          <div className="rounded-xl p-4 bg-slate-100">
            <p className="font-medium text-slate-900">
              {order.user?.name || "Customer"}
            </p>
            <p className="mt-1 text-slate-500">
              {order.shippingAddress || "No shipping address provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
