import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import RoleGate from "../../components/RoleGate";
import CartItem from "./CartItem";
import OrderSummary from "../../components/OrderSummary";
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
  }, [fetchCart]);

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-page px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="theme-card rounded-[24px] p-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading cart...</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-page px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="theme-card rounded-[24px] p-8 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  const itemCount = cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0;

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-page px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <section className="hero-shell rounded-[28px] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div>
                <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Private customer checkout
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  Shopping cart
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  Review your selected products, adjust quantities, and continue to delivery and payment.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="panel-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Items
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {itemCount}
                  </p>
                </div>
                <div className="panel-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Next step
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Confirm address, choose payment, and place the order securely.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {!cart?.items?.length ? (
            <div className="theme-card mt-8 rounded-[24px] p-12 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                <Package className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Your cart is empty
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Add products from the catalogue to start checkout.
              </p>
              <Button onClick={() => navigate("/products")} className="mt-6">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onIncrease={() => updateQuantity(item.product._id, 1)}
                    onDecrease={() => updateQuantity(item.product._id, -1)}
                    onRemove={() => removeItem(item.product._id)}
                  />
                ))}
              </div>

              <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <OrderSummary />

                <div className="theme-card rounded-[24px] p-5 space-y-3">
                  <Button onClick={() => navigate("/checkout")} className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Button>

                  <Button variant="secondary" onClick={clearCart} className="w-full">
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
