import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "../../components/ui";
import { getImageUrl } from "../../utils/productImages";

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/50",
    icon: ShoppingBag,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50",
    icon: Clock,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/50",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/50",
    icon: XCircle,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const getStatusConfig = (status) => statusConfig[status] || statusConfig.PLACED;

export default function MyOrders() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) navigate("/login");
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [accessToken, navigate]);

  const getProductImage = (item) => {
    return getImageUrl(item.product?.images?.[0]);
  };

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto flex max-w-5xl items-center justify-center px-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE"]} showFallback>
        <div className="min-h-screen bg-page py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="theme-card rounded-[24px] p-8 text-center">
              <XCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Error loading orders
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-5">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow={["PRIVATE"]} showFallback>
      <div className="min-h-screen bg-page px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <section className="hero-shell rounded-[28px] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div>
                <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Private customer workspace
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  My Orders
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Track current orders, delivery progress, and completed purchases from one place.
                </p>
              </div>

              <div className="panel-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total orders
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {orders.length}
                </p>
              </div>
            </div>
          </section>

          {orders.length === 0 ? (
            <div className="theme-card mt-8 rounded-[24px] p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                <Package className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                No orders yet
              </h2>
              <p className="mt-2 max-w-md mx-auto text-slate-500 dark:text-slate-400">
                Start shopping to see your order history here.
              </p>
              <Button onClick={() => navigate("/products")} className="mt-6 gap-2">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.map((order) => {
                const status = getStatusConfig(order.status);
                const StatusIcon = status.icon;
                const firstItem = order.items?.[0];
                const firstImage = getProductImage(firstItem);
                const totalItems =
                  order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <div key={order._id} className="theme-card overflow-hidden rounded-[24px]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 px-6 py-4 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Order ID
                          </p>
                          <p className="font-mono font-medium text-slate-900 dark:text-white">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Order Date
                          </p>
                          <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Total Amount
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {currencyFormatter.format(
                              order.pricing?.grandTotal || order.totalAmount || 0,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-5">
                        <div className="shrink-0">
                          {firstImage ? (
                            <div className="relative">
                              <img
                                src={firstImage}
                                alt={firstItem?.product?.name || "Product"}
                                className="h-24 w-24 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                              />
                              {order.items?.length > 1 && (
                                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-medium text-white dark:bg-cyan-600">
                                  +{order.items.length - 1}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                              <Package className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {firstItem?.product?.name || "Product"}
                          </h3>
                          <p className="mt-1 text-slate-500 dark:text-slate-400">
                            {totalItems} item{totalItems !== 1 ? "s" : ""} in this order
                          </p>

                          {order.items && order.items.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <span
                                  key={index}
                                  className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                >
                                  {item.quantity}x {item.product?.name?.slice(0, 20)}
                                  {item.product?.name?.length > 20 ? "..." : ""}
                                </span>
                              ))}
                            </div>
                          )}

                          <Link
                            to={`/orders/${order._id}`}
                            className="mt-5 inline-flex items-center text-sm font-medium text-cyan-700 transition-colors hover:text-orange-600 dark:text-cyan-300 dark:hover:text-orange-300"
                          >
                            View Order Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
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
