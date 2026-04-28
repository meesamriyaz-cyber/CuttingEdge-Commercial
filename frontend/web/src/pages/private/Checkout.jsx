import { useEffect, useState } from "react";
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
} from "../../api/payments";
import { Button } from "../../components/ui";

export default function Checkout() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  const { cart, pricing, fetchCart, clearCart } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "online"
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Ensure cart is loaded (in case user refreshes checkout page)
  useEffect(() => {
    if (!cart) fetchCart();
  }, []);

  // Handle Cash on Delivery order
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

  // Handle Razorpay payment
  async function handleRazorpayPayment() {
    if (!cart?.items?.length) return;
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    // Format shipping address
    const shippingAddress = `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, Phone: ${selectedAddress.phone}`;

    try {
      // Load Razorpay script
      const Razorpay = await loadRazorpayScript();

      // Get Razorpay key
      const razorpayKey = await fetchRazorpayKey();

      // Create order on server
      const orderData = await createRazorpayOrder();

      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CuttingEdge Commercial",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const verifyData = await verifyRazorpayPayment(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              shippingAddress,
            );

            // Clear cart and redirect to success
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
          color: "#4f46e5", // Indigo-600
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setPlacing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      setPlacing(false);
    }
  }

  // Handle order placement based on payment method
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

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-surface py-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-900/20 dark:from-orange-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {/* LEFT: ITEMS */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Checkout
            </h2>

            {!cart?.items?.length && (
              <p className="text-slate-600">Your cart is empty.</p>
            )}

            {cart?.items?.map((item) => (
              <div
                key={item.product._id}
                className="bg-white shadow rounded p-4"
              >
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
            ))}

            {/* Delivery Address Section */}
            <div className="bg-white shadow rounded p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddressModal(true)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    {selectedAddress ? "Change" : "+ Add New Address"}
                  </Button>
                </div>

              {selectedAddress ? (
                <div className="border-2 border-orange-500 bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {selectedAddress.label}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {selectedAddress.phone}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>Please select a delivery address</p>
                  <Button
                    variant="link"
                    onClick={() => setShowAddressModal(true)}
                    className="mt-2"
                  >
                    Select Address
                  </Button>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white shadow rounded p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              <div className="space-y-3">
                {/* Online Payment Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "online"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Online Payment
                      </span>
                      <span className="text-sm text-gray-500">
                        Cards, UPI, NetBanking
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Secure payment via Razorpay
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="space-y-4">
            <OrderSummary />

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

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Delivery Address
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <AddressManager
                showSelector={true}
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
