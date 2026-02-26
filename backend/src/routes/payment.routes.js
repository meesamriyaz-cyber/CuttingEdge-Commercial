import express from "express";
import {
  createRazorpayOrderFromCart,
  verifyRazorpayPayment,
  getKey,
} from "../controllers/payment.controller.js";
import {
  requireAuth,
  requirePrivateClient,
} from "../middleware/auth.middleware.js";
const router = express.Router();

// Get Razorpay key for frontend
router.get("/razorpay/key", requireAuth, requirePrivateClient, getKey);

router.post(
  "/razorpay/create-order",
  requireAuth,
  requirePrivateClient,
  createRazorpayOrderFromCart,
);

// Step 3: Verify payment & finalize order
router.post(
  "/razorpay/verify",
  requireAuth,
  requirePrivateClient,
  verifyRazorpayPayment,
);

export default router;
