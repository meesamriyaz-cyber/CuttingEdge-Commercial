import { useEffect, useState } from "react";
import { MapPin, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleGate from "../../components/RoleGate";
import AddressManager from "../../components/AddressManager";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import OrderSummary from "../../components/OrderSummary";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import {
  fetchRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  reportPaymentFailed,
} from "../../api/payments";
import { Button } from "../../components/ui";

export default function Checkout() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const { cart, fetchCart, clearCart } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (!cart) fetchCart();
  }, [cart, fetchCart]);

  async function placeCODOrder() {
    if (!cart?.items?.length) return;
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "cod",
          shippingAddress: `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, Phone: ${selectedAddress.phone}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      clearCart();
      navigate("/order-success", {
        replace: true,
        state: { orderId: data.orderId, paymentMethod: "cod" },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  async function handleRazorpayPayment() {
    if (!cart?.items?.length) return;
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    const shippingAddress = `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, Phone: ${selectedAddress.phone}`;

    try {
      const Razorpay = await loadRazorpayScript();
      const razorpayKey = await fetchRazorpayKey();
      const orderData = await createRazorpayOrder();

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Cutting Edge Enterprises",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyData = await verifyRazorpayPayment(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              shippingAddress,
            );

            clearCart();
            navigate("/order-success", {
              replace: true,
              state: {
                orderId: verifyData.orderId,
                paymentMethod: "online",
                paymentId: response.razorpay_payment_id,
              },
            });
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#0f4c61",
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      const rzp = new Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        const errorMessage = response.error?.description || "Payment failed";
        setError(`Payment failed: ${errorMessage}`);
        setPlacing(false);

        try {
          await reportPaymentFailed({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            error: response.error,
          });
        } catch (emailErr) {
          console.error("Payment failure email failed:", emailErr);
        }
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      setPlacing(false);
    }
  }

  function handlePlaceOrder() {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    if (paymentMethod === "cod") {
      placeCODOrder();
    } else {
      handleRazorpayPayment();
    }
  }

  const checkoutSteps = [
    { label: "Cart review", icon: CheckCircle2 },
    { label: "Address", icon: MapPin },
    { label: "Payment", icon: CreditCard },
    { label: "Delivery", icon: Truck },
  ];

  return (
    <RoleGate allow={["PRIVATE"]} showFallback>
      <div className="min-h-screen bg-page px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <section className="hero-shell rounded-[28px] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Secure checkout
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  Checkout
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Confirm address, choose payment, and complete your order from one guided workspace.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {checkoutSteps.slice(1, 3).map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="panel-muted flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-4">
              <div className="theme-card rounded-[24px] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Items in this order
                </h2>
                <div className="mt-4 space-y-3">
                  {!cart?.items?.length ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your cart is empty.
                    </p>
                  ) : (
                    cart.items.map((item) => (
                      <div key={item.product._id} className="panel-muted flex items-center justify-between gap-4 p-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {item.product.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="theme-card rounded-[24px] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Delivery address
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Select the address for delivery and invoice communication.
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => setShowAddressModal(true)}>
                    {selectedAddress ? "Change" : "Add Address"}
                  </Button>
                </div>

                {selectedAddress ? (
                  <div className="panel-muted p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedAddress.label}
                      </span>
                      {selectedAddress.isDefault && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950/20 dark:text-orange-300">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {selectedAddress.street}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Phone: {selectedAddress.phone}
                    </p>
                  </div>
                ) : (
                  <div className="panel-muted border-dashed p-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Please select a delivery address to continue.
                    </p>
                  </div>
                )}
              </div>

              <div className="theme-card rounded-[24px] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Payment method
                </h2>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      value: "online",
                      title: "Online payment",
                      note: "Cards, UPI, net banking via Razorpay",
                    },
                    {
                      value: "cod",
                      title: "Cash on delivery",
                      note: "Pay when your order arrives",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                        paymentMethod === option.value
                          ? "border-cyan-400 bg-cyan-50/70 dark:border-cyan-700 dark:bg-cyan-950/20"
                          : "border-slate-200 bg-white/70 hover:border-cyan-200 dark:border-slate-800 dark:bg-slate-950/35 dark:hover:border-cyan-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {option.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {option.note}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <OrderSummary />
              <div className="theme-card rounded-[24px] p-5">
                <Button
                  disabled={placing || !cart?.items?.length || !selectedAddress}
                  onClick={handlePlaceOrder}
                  className="w-full"
                >
                  {placing
                    ? "Processing..."
                    : paymentMethod === "cod"
                      ? "Place Order (COD)"
                      : "Pay Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="theme-card max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[24px]">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Select delivery address
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddressModal(false)}
                className="px-2"
              >
                Close
              </Button>
            </div>
            <div className="max-h-[calc(90vh-76px)] overflow-y-auto p-4">
              <AddressManager
                showSelector
                selectedAddressId={selectedAddress?._id}
                onSelectAddress={(address) => {
                  setSelectedAddress(address);
                  setShowAddressModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </RoleGate>
  );
}
