import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import Service from "../models/Service.js";
import {
  submitServiceEnquiry,
  getMyServiceEnquiries,
} from "../controllers/servicesenquiry.controller.js";
import {
  createServiceQuote,
  getMyServiceQuotes,
  getServiceQuoteById,
  getServiceQuoteByEnquiryId,
  makeDecisionOnServiceQuote,
  downloadServiceQuotePDF,
} from "../controllers/servicesquote.controller.js";

const router = Router();

/**
 * =========================
 * PUBLIC — SERVICE DISCOVERY
 * =========================
 */

// Get all active services (guest + auth)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .select(
        "name slug description category rateLabel showRateToGuests applicableTo",
      );

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// Get service by slug (guest + auth)
router.get("/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

/**
 * =========================
 * AUTH — SERVICE ACTIONS
 * =========================
 */

router.post("/enquiry", requireAuth, submitServiceEnquiry);
router.get("/enquiry/my", requireAuth, getMyServiceEnquiries);

/**
 * =========================
 * AUTH — SERVICE QUOTES
 * =========================
 */

// Get all my service quotes
router.get("/quote/my", requireAuth, getMyServiceQuotes);

// Get service quote by ID
router.get("/quote/:id", requireAuth, getServiceQuoteById);

// Get service quote by enquiry ID
router.get(
  "/quote/by-enquiry/:enquiryId",
  requireAuth,
  getServiceQuoteByEnquiryId,
);

// Make decision on service quote (APPROVED/REJECTED)
router.post("/quote/:id/decision", requireAuth, makeDecisionOnServiceQuote);

// Download service quote PDF
router.get("/quote/:id/pdf", requireAuth, downloadServiceQuotePDF);

export default router;
