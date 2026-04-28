import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoleGate from "../../components/RoleGate";
import CartItem from "./CartItem";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../../components/ui";

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
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-900/20 dark:from-orange-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>

          {!cart?.items?.length && (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <p className="text-gray-600">Your cart is empty.</p>
              <Button
                onClick={() => navigate("/products")}
                className="mt-6"
              >
                Browse Products
              </Button>
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
              <Button
                variant="secondary"
                onClick={clearCart}
              >
                Clear Cart
              </Button>

              <Button
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
