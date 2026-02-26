import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleGate from "../../components/RoleGate";
import { useCartStore } from "../../store/cartStore";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import OrderSummary from "../../components/OrderSummary";

export default function Checkout() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { cart, fetchCart, clearCart } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cart) fetchCart();
  }, []);

  async function placeOrder() {
    setPlacing(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      clearCart();
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(String(err.message || "An error occurred"));
    } finally {
      setPlacing(false);
    }
  }

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Checkout
            </h2>

            {(!Array.isArray(cart?.items) || !cart.items.length) && (
              <p className="text-slate-600">Your cart is empty.</p>
            )}

            {Array.isArray(cart?.items) &&
              cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
              ))}

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div className="space-y-4">
            <OrderSummary />

            <button
              disabled={
                placing || !Array.isArray(cart?.items) || !cart.items.length
              }
              onClick={placeOrder}
              className="btn-theme-primary w-full py-3 disabled:opacity-50"
            >
              {placing ? "Placing Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
