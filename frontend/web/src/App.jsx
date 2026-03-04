import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";
import { pageVariants, pageTransition } from "./utils/animations";
import { useAuthStore } from "./store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AnimatedAppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-routes"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
      >
        <AppRoutes />
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Check if current route is invoice page (hide navbar/footer)
  const isInvoicePage = location.pathname.includes("/invoice");

  // 🔹 Redirect unauthenticated users
  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/register",
      "/products-guest",
      "/services",
    ];
    const currentPath = window.location.pathname;

    const isPublicRoute = publicRoutes.some((route) =>
      currentPath.startsWith(route),
    );

    if (!user && !isPublicRoute) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      {/* Hide navbar on invoice page */}
      {!isInvoicePage && <Navbar />}

      <div
        className={`flex flex-col bg ${isInvoicePage ? "" : "min-h-screen"}`}
      >
        <main className="flex-1">
          <AnimatedAppRoutes />
        </main>

        {/* Hide footer on invoice page */}
        {!isInvoicePage && <Footer />}
      </div>
    </ThemeProvider>
  );
}
