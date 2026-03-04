import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  Package,
  User,
  Search,
  LogOut,
  UserCircle,
  ClipboardList,
  Inbox,
  Quote,
} from "lucide-react";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isInit = useAuthStore((state) => state.isInit);
  const cart = useCartStore((state) => state.cart);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isInit) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const cartCount = cart?.items?.length || 0;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isRootPage = location.pathname === "/";

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          {isRootPage ? (
            <Link to="/" className="flex items-center">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm md:text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300">
                Home
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                <Package size={20} />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-bold text-white">
                  Cutting Edge
                </div>
                <div className="text-xs text-slate-400">Enterprises</div>
              </div>
            </Link>
          )}

          {/* Desktop Navigation - Hidden - Products & Services accessed via hero */}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart - Only for PRIVATE */}
            {user && user.clientType === "PRIVATE" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2.5 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist - For both PRIVATE and PUBLIC */}
            {user &&
              (user.clientType === "PRIVATE" ||
                user.clientType === "PUBLIC") && (
                <button
                  onClick={() => navigate("/wishlist")}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-white" />
                </button>
              )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-white hidden lg:block">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-emerald-400 bg-slate-800/50 hover:bg-emerald-500/20 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isAuthPage && (
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-700 bg-slate-900"
          >
            <div className="px-4 py-4 space-y-3">
              {user && user.clientType === "PRIVATE" && (
                <>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-white"
                  >
                    <ShoppingCart size={20} />
                    <span className="font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-white"
                  >
                    <ClipboardList size={20} />
                    <span className="font-medium">My Orders</span>
                  </button>
                </>
              )}

              {user && user.clientType === "PUBLIC" && (
                <>
                  <button
                    onClick={() => {
                      navigate("/enquiries");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-white"
                  >
                    <Inbox size={20} />
                    <span className="font-medium">My Enquiries</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/quotes");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-white"
                  >
                    <Quote size={20} />
                    <span className="font-medium">My Quotes</span>
                  </button>
                </>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-900/30 transition-colors text-red-400"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                !isAuthPage && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg"
                  >
                    <UserCircle size={20} />
                    Login
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
