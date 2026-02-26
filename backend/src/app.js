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
const app = express();

// CORS configuration - allow credentials (cookies)
const allowedOrigins = [
  "http://localhost:5173",
  "https://commerce.cuttingedge-enterprises.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Refresh-Token"],
  })
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

app.use("/services", serviceRoutes);
app.use("/payments", paymentRoutes);

export default app;
