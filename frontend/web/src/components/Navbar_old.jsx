import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";
// import ThemeToggle from "./ThemeToggle"; // 🚫 TEMPORARILY DISABLED
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isInit = useAuthStore((state) => state.isInit);
  const clientType = user?.clientType
  const cart = useCartStore((state) => state.cart);

  const location = useLocation();
  const navigate = useNavigate();

  if (!isInit) return null;
  if (!user) return null;


  const authPages = ["/login", "/register"];
  if (authPages.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ✅ Real-time cart count (total quantity)
  const cartCount = cart?.items?.length || 0;


  return (
    <motion.header
      className="sticky top-0 z-50 bg-surface"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* ================= LEFT: BRAND ================= */}
        <Link to="/" className="flex items-center gap-3
    outline-none
    focus:outline-none
    focus:ring-0
    active:outline-none">
  
          <div className="w-10 h-10 rounded-xl btn-theme-primary flex items-center justify-center text-white font-bold">
            CE
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

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6">

          {/* 🚫 Theme toggle temporarily removed */}
          {/*
          <ThemeToggle />
          */}

          {/* 🛒 CART ICON (ONLY FOR LOGGED-IN USERS) */}
      {/* 🛒 CART ICON */}
{user && user.clientType === "PRIVATE" &&(
  <button
    onClick={() => navigate("/cart")}
    className="relative group"
    aria-label="Cart"
  >
    <ShoppingCart
      className="w-6 h-6 text-text group-hover:scale-110 transition"
    />

    {/* 🔴 Line count badge */}
    {cartCount > 0 && (
      <span
        className="
          absolute -top-2 -right-2
          bg-red-600 text-white
          text-xs font-bold
          rounded-full
          min-w-[18px] h-[18px]
          flex items-center justify-center
          px-1
        "
      >
        {cartCount}
      </span>
    )}
  </button>
)}


          {/* ================= USER ================= */}
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full btn-theme-primary flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-semibold text-text">
                  {user.name}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm btn-theme-primary rounded-xl font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
