import { Router } from "express";
import {
  getAllEnquiries,
  updateEnquiryStatus,
  getEnquiryByIdAdmin,
} from "../controllers/enquiry.controller.js";
import {
  getAllServiceEnquiriesAdmin,
  getServiceEnquiryByIdAdmin,
  updateServiceEnquiryStatus,
  createServiceQuoteAdmin,
  getAllServiceQuotesAdmin,
  getServiceQuoteByIdAdmin,
  getServiceQuoteByEnquiryAdmin,
} from "../controllers/servicesenquiry.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

// Admin Orders routes
router.get("/orders", requireAuth, requireAdmin, getAllOrders);
router.get("/orders/:id", requireAuth, requireAdmin, getOrderById);
router.patch("/orders/:id/status", requireAuth, requireAdmin, updateOrderStatus);

// Product Enquiries routes
router.get("/enquiries", requireAuth, requireAdmin, getAllEnquiries);
router.get("/enquiries/:id", requireAuth, requireAdmin, getEnquiryByIdAdmin);
router.patch(
  "/enquiries/:id/status",
  requireAuth,
  requireAdmin,
  updateEnquiryStatus,
);

// Service Enquiries routes
router.get(
  "/service-enquiries",
  requireAuth,
  requireAdmin,
  getAllServiceEnquiriesAdmin,
);
router.get(
  "/service-enquiries/:id",
  requireAuth,
  requireAdmin,
  getServiceEnquiryByIdAdmin,
);
router.patch(
  "/service-enquiries/:id/status",
  requireAuth,
  requireAdmin,
  updateServiceEnquiryStatus,
);

// Service Quotes routes
router.get(
  "/service-quotes",
  requireAuth,
  requireAdmin,
  getAllServiceQuotesAdmin,
);
router.get(
  "/service-quotes/by-enquiry/:enquiryId",
  requireAuth,
  requireAdmin,
  getServiceQuoteByEnquiryAdmin,
);
router.get(
  "/service-quotes/:id",
  requireAuth,
  requireAdmin,
  getServiceQuoteByIdAdmin,
);
router.post(
  "/service-quotes/from-enquiry/:enquiryId",
  requireAuth,
  requireAdmin,
  createServiceQuoteAdmin,
);

export default router;
