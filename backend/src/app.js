import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicProductRoutes from "./routes/publicProduct.routes.js";
import serviceRoutes from "./routes/services.route.js";
import adminServiceRoutes from "./routes/admin.services.route.js";
import paymentRoutes from "./routes/payment.routes.js";
import addressRoutes from "./routes/address.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
const app = express();

const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .map((value) => value.replace(/\/$/, ""))
  .filter(Boolean);

// CORS configuration - allow credentials (cookies)
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "https://commerce.cuttingedge-enterprises.in",
  "https://www.commerce.cuttingedge-enterprises.in",
  "https://cuttingedge-commercial.onrender.com",
  "https://cuttingedge-commercial-web.onrender.com",
  "https://cuttingedge-commercial-frontend.onrender.com",
  ...envOrigins,
]);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Refresh-Token"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Public Products
app.use("/public", publicProductRoutes);

// Auth
app.use("/auth", authRoutes);

// Govt
app.use("/govt/enquiries", enquiryRoutes);
app.use("/govt/quotes", quoteRoutes);

// Admin
app.use("/admin", adminRoutes);
app.use("/admin/quotes", quoteRoutes);
app.use("/admin/services", adminServiceRoutes);

// Commerce
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/addresses", addressRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishlistRoutes);

app.use("/services", serviceRoutes);
app.use("/payments", paymentRoutes);
app.use("/delivery", deliveryRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default app;
