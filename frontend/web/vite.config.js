import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Handle SPA routing - serve index.html for all non-API routes
    historyApiFallback: true,
    proxy: {
      // API routes - must come before general page routes
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy if it's a browser page request (accepts HTML)
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url; // Return the URL to serve index.html instead
          }
        },
      },
      "/cart": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy if it's a browser page request (accepts HTML)
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url;
          }
        },
      },
      "/orders/my": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/orders/": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy if it's a browser page request (accepts HTML)
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url; // Return the URL to serve index.html instead
          }
        },
      },
      "/services": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy if it's a browser page request (accepts HTML)
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url; // Return the URL to serve index.html instead
          }
        },
      },
      "/public": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Page routes with HTML bypass - these come after API routes
      "/admin": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy if it's a browser page request (accepts HTML)
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url; // Return the URL to serve index.html instead
          }
        },
      },
      "/govt": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url;
          }
        },
      },
      "/orders": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          const accept = req.headers.accept || "";
          if (accept.includes("text/html")) {
            return req.url;
          }
        },
      },
    },
  },
});
