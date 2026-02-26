import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import enquiryRoutes from "./routes/enquiry.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/govt/enquiries", enquiryRoutes);
app.use("/admin", adminRoutes);
app.use("/govt/quotes", quoteRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);




export default app;
