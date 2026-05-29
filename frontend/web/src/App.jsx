import { useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import BackendWakeNotice from "./components/BackendWakeNotice";
import Navbar from "./components/Navbar";
import ThemeProvider from "./components/ThemeProvider";
import { pageVariants, pageTransition } from "./utils/animations";
import { useAuthStore } from "./store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { warmBackend } from "./api/backendWakeMonitor";

const AnimatedAppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key="app-routes"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
      >
        <AppRoutes />
      </Motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const user = useAuthStore((state) => state.user);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is invoice page (hide navbar/footer)
  const isInvoicePage = location.pathname.includes("/invoice");

  useEffect(() => {
    if (location.pathname === "/") {
      warmBackend();
    }
  }, [location.pathname]);

  // Redirect unauthenticated users away from protected application areas.
  useEffect(() => {
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/products-guest",
      "/services",
    ];
    const currentPath = window.location.pathname;

    const isPublicRoute = publicRoutes.some((route) =>
      route === "/" ? currentPath === "/" : currentPath.startsWith(route),
    );

    if (sessionExpired && !["/login", "/register"].includes(currentPath)) {
      navigate("/login?expired=true", { replace: true });
      return;
    }

    if (!user && !isPublicRoute) {
      navigate("/login", { replace: true });
    }
  }, [user, sessionExpired, navigate]);

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
      <BackendWakeNotice />

      {/* Hide navbar on invoice page */}
      {!isInvoicePage && <Navbar />}

      <div
        className={`flex flex-col bg-page ${isInvoicePage ? "" : "min-h-screen"}`}
      >
        <main className="flex-1">
          <AnimatedAppRoutes />
        </main>

        {/* Hide footer on invoice page */}
        {!isInvoicePage && (
          <footer className="border-t border-slate-200/70 dark:border-cyan-950/40 bg-white/55 dark:bg-slate-950/35 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
              &copy; 2026 Cutting Edge Enterprises
            </div>
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
}
