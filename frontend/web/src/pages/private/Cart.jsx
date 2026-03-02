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
      <div className="min-h-screen bg-surface py-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
