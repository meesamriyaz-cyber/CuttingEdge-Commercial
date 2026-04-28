import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Menu, X, Package, User, ClipboardList, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isInit = useAuthStore((state) => state.isInit);
  const cart = useCartStore((state) => state.cart);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isInit) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const cartCount = cart?.items?.length || 0;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isHomePage = location.pathname === "/";
  const productPath = user ? "/products" : "/products-guest";
  const baseNavItems = user
    ? [
        { label: "Products", to: productPath, show: !isHomePage },
        { label: "Services", to: "/services", show: !isHomePage },
        { label: "Orders", to: "/orders", show: user.clientType === "PRIVATE" },
        { label: "Enquiries", to: "/enquiries", show: user.clientType === "PUBLIC" },
        { label: "Quotes", to: "/quotes", show: user.clientType === "PUBLIC" },
        { label: "Service Requests", to: "/service-enquiries", show: true },
      ].filter((item) => item.show)
    : [
        { label: "Products", to: "/products-guest", show: !isHomePage },
        { label: "Services", to: "/services", show: !isHomePage },
      ].filter((item) => item.show);
  const navItems = isAuthPage ? [] : baseNavItems;

  const navLinkClass = (to) =>
    `text-sm font-semibold transition-colors ${
      location.pathname === to || location.pathname.startsWith(`${to}/`)
        ? "text-cyan-700 dark:text-cyan-300"
        : "text-slate-700 hover:text-cyan-700 dark:text-slate-200 dark:hover:text-cyan-300"
    }`;

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/90 dark:bg-[#07111f]/95 backdrop-blur border-b border-slate-200 dark:border-cyan-950/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          {!user ? (
            <Link to="/" className="flex items-center">
              <span
                className="
                inline-flex items-center gap-2
                px-5 py-2.5
                rounded-lg
                text-sm md:text-base
                font-bold
                bg-slate-950 dark:bg-cyan-500
                text-white
                dark:text-slate-950
                shadow-sm
                hover:bg-slate-800 dark:hover:bg-cyan-400
                transition-all duration-300
              "
              >
                Cutting Edge Enterprises
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-950 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-slate-950 font-bold rounded-lg shadow-sm">
                <Package size={20} />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-bold text-slate-800 dark:text-white">
                  Cutting Edge Enterprises
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Business Solutions
                </div>
              </div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className={navLinkClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            {user && user.clientType === "PRIVATE" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist */}
            {user &&
              (user.clientType === "PRIVATE" ||
                user.clientType === "PUBLIC") && (
                <button
                  onClick={() => navigate("/wishlist")}
                  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </button>
              )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden lg:block">
                    {user.name}
                  </span>
                </div>

                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              !isAuthPage && (
                <Button onClick={() => navigate("/login")}>
                  Login
                </Button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  navigate(item.to);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
              >
                {item.label === "Services" ? <Wrench size={20} /> : <ClipboardList size={20} />}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {user && user.clientType === "PRIVATE" && (
              <>
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span className="font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-orange-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                >
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </button>
              </>
            )}

            {user && user.clientType === "PUBLIC" && (
              <button
                onClick={() => {
                  navigate("/wishlist");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                <Heart size={20} />
                <span className="font-medium">Wishlist</span>
              </button>
            )}

            {user ? (
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="w-full justify-start gap-3"
              >
                <User size={20} />
                <span className="font-medium">Logout</span>
              </Button>
            ) : (
              !isAuthPage && (
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center gap-2"
                >
                  Login
                </Button>
              )
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
