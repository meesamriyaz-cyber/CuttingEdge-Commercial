import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Heart, Package, ShoppingCart, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../../api/wishlist";
import { useCartStore } from "../../store/cartStore";
import LayoutContainer from "../../components/LayoutContainer";

export default function Wishlist() {
  const navigate = useNavigate();
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
      setWishlist(prev => prev.filter(item => 
        (item.product?._id || item.product) !== productId
      ));
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
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <LayoutContainer>
      <motion.div 
        className="w-[95%] sm:w-[90%] max-w-7xl mx-auto py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-slate-600 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;
              
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <Link to={`/products/${product._id}`}>
                    <div className="aspect-square bg-slate-100">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-lg font-bold text-slate-900 mb-3">
                      ₹{product.price?.toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        disabled={removingItem === product._id}
                        className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {removingItem === product._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
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
