import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { heroTextVariants, containerVariants } from "../utils/animations";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isInit = useAuthStore((state) => state.isInit);
  const cart = useCartStore((state) => state.cart);

  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/login";
  // Prevent flicker before auth hydration
  if (!isInit) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const cartCount = cart?.items?.length || 0;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <motion.header
      className="sticky top-0 z-50 bg-surface"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {!user ? (
          <Link
            to="/"
            className="outline-none focus:ring-0 w-full sm:w-auto flex justify-center"
          >
            <motion.span
              variants={heroTextVariants}
              custom={0}
              className="
          inline-flex items-center gap-2
          px-7 py-3 my-3
          rounded-full
          text-sm md:text-sm
          font-semibold tracking-wider uppercase
          bg-indigo-100 text-indigo-800
          shadow-sm
        "
            >
              {isLandingPage ? "Cutting-Edge Enterprises" : "Home"}
            </motion.span>
          </Link>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-3 outline-none focus:ring-0"
          >
            <div className="w-10 h-10 btn-theme-primary flex items-center justify-center text-xs text-white font-bold rounded-xl">
              Home
            </div>
            <div>
              <div className="text-lg font-bold text-text">
                Cutting Edge Enterprises
              </div>
              <div className="text-xs text-muted">
                Business Solutions & Digital Services
              </div>
            </div>
          </Link>
        )}
        {/* CENTER: Products & Services — GUEST ONLY */}

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* Cart — PRIVATE authenticated users only */}
          {user && user.clientType === "PRIVATE" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative group focus:outline-none focus:ring-0 cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6 text-text group-hover:scale-110 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Wishlist — PRIVATE authenticated users only */}
          {user && user.clientType === "PRIVATE" && (
            <button
              onClick={() => navigate("/wishlist")}
              className="relative group focus:outline-none focus:ring-0 cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6 text-text group-hover:scale-110 transition" />
            </button>
          )}

          {/* AUTHENTICATED */}
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full btn-theme-primary flex items-center justify-center text-white text-xs font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="text-sm font-semibold text-text">
                  {user.name}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm btn-theme-primary rounded-xl font-semibold focus:outline-none focus:ring-0 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            /* GUEST: show Login ONLY if not already on auth page */
            !isAuthPage && (
              <Link
                to="/login"
                className="px-4 py-2 text-sm btn-theme-primary rounded-xl font-semibold"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
}
