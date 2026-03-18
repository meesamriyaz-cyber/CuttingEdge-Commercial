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
      setScrolled(window.scrollY > 10);
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
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {isRootPage ? (
            <Link to="/" className="flex items-center">
              <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-900 text-white">
                Home
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">
                  Cutting Edge
                </div>
                <div className="text-xs text-slate-500">Enterprises</div>
              </div>
            </Link>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart - Only for PRIVATE */}
            {user && user.clientType === "PRIVATE" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
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
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-slate-700" />
                </button>
              )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isAuthPage && (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-slate-700" />
            ) : (
              <Menu size={20} className="text-slate-700" />
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
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-3 space-y-2">
              {user && user.clientType === "PRIVATE" && (
                <>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <ShoppingCart size={18} />
                    <span className="font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto bg-slate-900 text-white text-xs font-medium rounded-full px-1.5 py-0.5">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <ClipboardList size={18} />
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
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <Inbox size={18} />
                    <span className="font-medium">My Enquiries</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/quotes");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <Quote size={18} />
                    <span className="font-medium">My Quotes</span>
                  </button>
                </>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 text-red-600"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                !isAuthPage && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-2.5 bg-slate-900 text-white rounded-lg font-medium"
                  >
                    <UserCircle size={18} />
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
