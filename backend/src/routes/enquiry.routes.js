import { Router } from "express";
import {
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  requireAdmin,
} from "../middleware/auth.middleware.js";

import {
  submitEnquiry,
  getMyEnquiries,
  getEnquiryById,
  getAllEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiry.controller.js";

const router = Router();

// user must be govt client
router.use(requireAuth, requireGovtClient);

// Only VERIFIED govt users can submit / view enquiries
router.post(
  "/",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  submitEnquiry,
);
router.get(
  "/my",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  getMyEnquiries,
);

router.get(
  "/:id",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  getEnquiryById,
);

// Admin routes
//router.use("/admin", requireAuth, requireAdmin);

export default router;
