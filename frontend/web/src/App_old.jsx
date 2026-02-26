// changes for App.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import ThemeProvider from "./components/ThemeProvider";
import { pageVariants, pageTransition } from "./utils/animations";
import { useAuthStore } from "./store/authStore";
import { useNavigate } from "react-router-dom"; // <- add

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
  const isInit = useAuthStore((state) => state.isInit);
  const navigate = useNavigate(); // use navigate instead of window.location

  useEffect(() => {
    const { initSession } = useAuthStore.getState();
    initSession();
  }, []);

  useEffect(() => {
    if (!isInit) return;

    const publicRoutes = ["/login", "/register"];

    const currentPath = window.location.pathname;

    // If user is NOT logged in AND current route is NOT public
    if (!user && !publicRoutes.includes(currentPath)) {
      navigate("/login", { replace: true });
    }
  }, [isInit, user, navigate]);

  if (!isInit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {user ? (
        <div className="min-h-screen flex flex-col bg">
          <Navbar />
          <main className="flex-1">
            <AnimatedAppRoutes />
          </main>

          <footer className="bg-page border-0">
            <div className="max-w-6xl mx-auto px-4 py-3 text-center text-sm text-muted">
              © 2026 Cutting Edge Enterprises
            </div>
          </footer>
        </div>
      ) : (
        <AnimatedAppRoutes />
      )}
    </ThemeProvider>
  );
}
