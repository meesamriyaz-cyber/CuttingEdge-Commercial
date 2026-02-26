import { Router } from "express";

import {
  createQuoteFromEnquiry,
  getMyQuotes,
  getQuoteByEnquiry,
  decideQuote,
  getAllQuotes,
  getQuoteById,
} from "../controllers/quote.controller.js";

import {
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  requireAdmin,
} from "../middleware/auth.middleware.js";
import { getQuoteByEnquiryAdmin,  } from "../controllers/quote.controller.js";
import { downloadQuotePdf } from "../utils/downloadQuotePdf.js";

import { generateQuotePDF} from "../controllers/quote.pdf.controller.js";

const router = Router();

/* =========================================================
   GOVT USER ROUTES
   ========================================================= */

// Govt user: list my quotes (optional dashboard)
router.get(
  "/my",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  getMyQuotes,
);

// Govt user: view quote by enquiry (PRIMARY FLOW)
router.get(
  "/by-enquiry/:enquiryId",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  getQuoteByEnquiry,
);

// Govt user: accept / reject quote (FINAL DECISION)
router.post(
  "/by-enquiry/:enquiryId/decision",
  requireAuth,
  requireGovtClient,
  requireGovtVerified,
  decideQuote,
);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Admin: create quote from enquiry (ONLY creation path)
router.post(
  "/from-enquiry/:enquiryId",
  requireAuth,
  requireAdmin,
  createQuoteFromEnquiry,
);

// Admin: view all quotes
router.get("/", requireAuth, requireAdmin, getAllQuotes);

// Admin: view single quote (READ-ONLY)
router.get("/:id", requireAuth, requireAdmin, getQuoteById);

// Admin: view quote by enquiry ID
router.get(
  "/by-enquiry/:enquiryId",
  requireAuth,
  requireAdmin,
  getQuoteByEnquiryAdmin,
);
//router.get("/:id/pdf", requireAuth,   downloadQuotePdf);

router.get("/:id/pdf", requireAuth, generateQuotePDF);

export default router;
