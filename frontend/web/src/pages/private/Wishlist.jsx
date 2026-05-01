import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Heart, Package, ShoppingCart, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../../api/wishlist";
import { useCartStore } from "../../store/cartStore";
import LayoutContainer from "../../components/LayoutContainer";
import { Button } from "../../components/ui";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);
  const { updateQuantity, fetchCart } = useCartStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFromWishlist(productId) {
    setRemovingItem(productId);
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) =>
        prev.filter((item) => (item.product?._id || item.product) !== productId),
      );
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemovingItem(null);
    }
  }

  async function handleAddToCart(product) {
    try {
      await updateQuantity(product._id, 1);
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <LayoutContainer>
      <motion.div
        className="mx-auto w-[95%] max-w-7xl py-8 sm:w-[90%] sm:py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <section className="hero-shell rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
                <Heart className="h-8 w-8 text-orange-500" />
                My Wishlist
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Saved products you may want to review or buy later.
              </p>
            </div>

            <div className="panel-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Saved items
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {wishlist.length}
              </p>
            </div>
          </div>
        </section>

        {wishlist.length === 0 ? (
          <div className="theme-card mt-8 rounded-[24px] p-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Heart className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Start saving products you want to revisit later.
            </p>
            <Button to="/products" className="mt-6">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="theme-card overflow-hidden rounded-[24px]"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="aspect-square bg-slate-100/90 dark:bg-slate-900/60">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-contain p-4"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="line-clamp-2 font-semibold text-slate-900 transition-colors hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                      {currencyFormatter.format(product.price || 0)}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] px-4 py-2.5 text-sm font-medium text-white"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        disabled={removingItem === product._id}
                        className="rounded-xl border border-red-200 px-3 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/20"
                      >
                        {removingItem === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
