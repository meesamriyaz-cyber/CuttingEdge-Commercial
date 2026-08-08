import express from "express";
import {
  createRazorpayOrderFromCart,
  verifyRazorpayPayment,
  getKey,
  reportPaymentFailed,
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

router.post(
  "/razorpay/verify",
  requireAuth,
  requirePrivateClient,
  verifyRazorpayPayment,
);

router.post(
  "/razorpay/failure",
  requireAuth,
  requirePrivateClient,
  reportPaymentFailed,
);

export default router;
