import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { fetchAddresses } from "../../api/addresses";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { Button } from "../../components/ui";

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    color: "bg-blue-100/80 text-blue-700 border-blue-200",
    icon: ShoppingBag,
    description: "Your order has been received and is being processed.",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-yellow-100/80 text-yellow-700 border-yellow-200",
    icon: Clock,
    description: "Your order is being prepared for shipment.",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100/80 text-purple-700 border-purple-200",
    icon: Truck,
    description: "Your order has been shipped and is on its way.",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100/80 text-green-700 border-green-200",
    icon: CheckCircle,
    description: "Your order has been delivered successfully.",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100/80 text-red-700 border-red-200",
    icon: XCircle,
    description: "This order has been cancelled.",
  },
};

const paymentStatusConfig = {
  PENDING: { label: "Payment Pending", color: "text-yellow-600" },
  PAID: { label: "Paid", color: "text-green-600" },
  FAILED: { label: "Payment Failed", color: "text-red-600" },
};

// Helper to get token from store OR localStorage (avoids race condition on refresh)
const getAccessToken = () => {
  // Try store first
  try {
    const storeToken = useAuthStore.getState().accessToken;
    if (storeToken) return storeToken;
  } catch (e) {
    console.warn("[OrderDetails] Could not read from auth store:", e);
  }

  // Fallback to localStorage
  try {
    const session = JSON.parse(localStorage.getItem("session") || "null");
    return session?.accessToken || null;
  } catch {
    return null;
  }
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackAddress, setFallbackAddress] = useState(null);

  // Fetch order details - get token INSIDE async function to avoid race condition
  useEffect(() => {
    const loadOrder = async () => {
      const token = getAccessToken();

      if (!token) {
        console.log(
          "[OrderDetails] No access token available (checked store + localStorage)",
        );
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include", // Send cookies with the request
        });
        const data = await res.json();

        // Handle 401 - session expired
        if (res.status === 401) {
          console.warn("[OrderDetails] 401 Unauthorized - clearing session");
          localStorage.removeItem("session");
          try {
            useAuthStore.getState().logout();
          } catch (e) {
            console.error("[OrderDetails] Failed to logout:", e);
          }
          window.location.href = "/login?expired=true";
          return;
        }

        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
        setOrder(data);
      } catch (err) {
        console.error("[OrderDetails] Failed to load order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // Fetch fallback address if order has no shipping address
  useEffect(() => {
    if (!order || order.shippingAddress) return;

    const token = getAccessToken();
    if (!token) return;

    fetchAddresses()
      .then((data) => {
        const addresses = data.addresses || [];
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        if (defaultAddr) {
          const formatted = `${defaultAddr.label}: ${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}, Phone: ${defaultAddr.phone}`;
          setFallbackAddress(formatted);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch fallback address:", err);
      });
  }, [order]);

  const getProductImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      return item.product.images[0].url;
    }
    return null;
  };

  function buildInvoice(order) {
    return {
      invoiceNo: `INV-${order._id.slice(-6).toUpperCase()}`,
      invoiceDate: new Date(order.createdAt).toLocaleDateString(),

      seller: {
        name: "CuttingEdge Enterprises",
        address: "Doulatabad, Srinagar, J&K, India - 190003",
        gstin: "01CYSPA5416L1ZF",
      },

      buyer: {
        name: order.user?.name || "Customer",
        address: order.shippingAddress || fallbackAddress || "India",
      },

      items: order.items.map((item) => ({
        name: item.product.name,
        hsn: item.product.hsn || "8471",
        quantity: item.quantity,
        unitPrice: item.priceAtOrder,
        total: item.quantity * item.priceAtOrder,
      })),

      pricing: order.pricing,
    };
  }

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-surface py-8">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              <p className="text-slate-500">Loading order details...</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-surface py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-xl p-8 text-center theme-card bg-surface border border-white/40 shadow-lg">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Error
              </h3>
              <p className="text-slate-500">{error}</p>
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/orders")}
                >
                  Back to Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (!order) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-surface py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-xl p-8 text-center theme-card bg-surface border border-white/40 shadow-lg">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Order Not Found
              </h3>
              <p className="text-slate-500">
                The order you're looking for doesn't exist.
              </p>
              <Button
                variant="ghost"
                onClick={() => navigate("/orders")}
                className="mt-4 gap-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PLACED;
  const StatusIcon = status.icon;
  const paymentStatus =
    paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-6 gap-1"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </Button>

          {/* Order Header */}
          <div className="rounded-2xl p-6 mb-6 theme-card bg-surface border border-white/40 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm mb-1 text-slate-500">Order ID</p>
                <h1 className="text-2xl font-bold text-slate-900">
                  #{order._id.slice(-8).toUpperCase()}
                </h1>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(`/orders/${order._id}/invoice`, {
                      state: { invoice: buildInvoice(order) },
                    })
                  }
                  className="gap-2"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Invoice
                </Button>
                <Button
                  onClick={() =>
                    navigate(`/orders/${order._id}/invoice`, {
                      state: { invoice: buildInvoice(order) },
                    })
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
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
                  <p className="text-xs text-slate-500">Payment Status</p>
                  <p className={`font-medium ${paymentStatus.color}`}>
                    {paymentStatus.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`rounded-xl border p-6 mb-6 ${status.color}`}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/50 rounded-xl">
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{status.label}</h3>
                <p className="opacity-90 mt-1">{status.description}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                  <Package className="w-5 h-5 text-slate-400" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
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
                        <h3 className="font-semibold truncate text-slate-900">
                          {item.product?.name || "Product"}
                        </h3>
                        <p className="text-sm mt-1 text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-slate-500">
                          Price: ₹{item.priceAtOrder?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ₹
                          {(item.quantity * item.priceAtOrder)?.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl p-6 theme-card bg-surface border border-white/40 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  Shipping Address
                  {fallbackAddress && (
                    <span className="text-xs font-normal text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full ml-2">
                      Auto-filled from profile
                    </span>
                  )}
                </h2>
                <div className="rounded-xl p-4 bg-slate-100">
                  <p className="font-medium text-slate-900">
                    {order.user?.name || "Customer"}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {order.shippingAddress ||
                      fallbackAddress ||
                      "No shipping address provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="rounded-2xl p-6 sticky top-6 theme-card bg-surface border border-white/40 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-slate-900">
                  Order Summary
                </h2>

                {order.pricing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>
                        ₹{order.pricing.taxableAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>CGST (9%)</span>
                      <span>
                        ₹{order.pricing.cgst?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>SGST (9%)</span>
                      <span>
                        ₹{order.pricing.sgst?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {order.pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          -₹
                          {order.pricing.discountAmount?.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3 border-slate-200">
                      <div className="flex justify-between text-lg font-semibold text-slate-900">
                        <span>Total</span>
                        <span>
                          ₹{order.pricing.grandTotal?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="border-t pt-3 mt-3 border-slate-200">
                      <div className="flex justify-between text-lg font-semibold text-slate-900">
                        <span>Total</span>
                        <span>
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 text-center border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
