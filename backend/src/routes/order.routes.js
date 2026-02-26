import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import {
  requireAuth,
  requirePrivateClient,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/place", requireAuth, requirePrivateClient, placeOrder);

router.get("/my", requireAuth, requirePrivateClient, getMyOrders);

router.get("/:id", requireAuth, requirePrivateClient, getOrderById);

// Admin routes
router.use("/admin", requireAuth, requireAdmin);

router.get("/admin", requireAuth, requireAdmin, getAllOrders);

router.get("/admin/:id", requireAuth, requireAdmin, getOrderById);

router.patch("/admin/:id/status", requireAuth, requireAdmin, updateOrderStatus);

export default router;
