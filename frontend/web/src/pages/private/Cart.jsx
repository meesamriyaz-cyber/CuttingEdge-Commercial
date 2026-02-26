import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoleGate from "../../components/RoleGate";
import CartItem from "./CartItem";
import { useCartStore } from "../../store/cartStore";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>

          {!cart?.items?.length && (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <p className="text-gray-600">Your cart is empty.</p>
              <Link
                  to="/products"
                  className="mt-6 inline-flex items-center justify-center
                            btn-theme-primary animate-gradient
                            px-6 py-3 rounded-xl font-semibold"
                >
                  Browse Products
            </Link>
            </div>
          )}

          <div className="space-y-4">
            {cart?.items?.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onIncrease={() => updateQuantity(item.product._id, 1)}
                onDecrease={() => updateQuantity(item.product._id, -1)}
                onRemove={() => removeItem(item.product._id)}
              />
            ))}
          </div>

          {cart?.items?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={clearCart}
                className="btn-theme-primary px-6 py-2"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-theme-primary px-6 py-2"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
