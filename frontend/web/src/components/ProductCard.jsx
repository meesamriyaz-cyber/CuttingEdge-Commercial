import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Check, Star, Package, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  product,
  index = 0,
  isAuthenticated = false,
  isInWishlist = false,
  isInCart = false,
  onToggleWishlist,
  onAddToCart,
  togglingWishlist = false,
  addingToCart = false,
  showPrice = true,
  guest = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryColors = {
    "Laptops": "from-blue-500 to-indigo-600",
    "Desktops": "from-emerald-500 to-teal-600",
    "Printers": "from-orange-500 to-amber-600",
    "Accessories": "from-violet-500 to-purple-600",
    "Networking": "from-cyan-500 to-blue-600",
  };

  const gradient = categoryColors[product.category] || "from-emerald-500 to-teal-600";
  const productLink = guest ? `/products-guest/${product._id}` : `/products/${product._id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-500">
        
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]`}>
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl" />
        </div>

        {/* Wishlist Button */}
        {isAuthenticated && onToggleWishlist && (
          <button
            onClick={(e) => onToggleWishlist(product._id, e)}
            disabled={togglingWishlist}
            className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${togglingWishlist ? "opacity-50" : ""}`}
          >
            {isInWishlist ? (
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors" />
            )}
          </button>
        )}

        {/* Image Section */}
        <Link to={productLink} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
          )}
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-contain p-6 transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-300" />
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-semibold shadow-lg`}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {product.category}
              </span>
            </div>
          )}
        </Link>

        {/* Content Section */}
        <div className="relative p-5">
          {/* Title */}
          <Link to={productLink}>
            <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-500 transition-all duration-300 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(product.rating.average) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                ({product.rating.average.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price & Actions */}
          <div className="flex items-center justify-between gap-3 mt-4">
            {showPrice ? (
              <div className="flex-1">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {product.price === 0 || product.price === null
                    ? "Price on Request"
                    : `₹${product.price?.toLocaleString()}`}
                </span>
                {product.gstRate && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    +{product.gstRate}% GST
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-slate-500 italic">Login for price</span>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link
                to={productLink}
                className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-300`}
              >
                View
              </Link>
              
              {onAddToCart && isAuthenticated && showPrice && (
                <button
                  onClick={() => onAddToCart(product._id, product.name)}
                  disabled={addingToCart}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    isInCart
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  } disabled:opacity-50`}
                >
                  {addingToCart ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.div>
                  ) : isInCart ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
