import express from "express";
const router = express.Router();

import {
  canReviewProduct,
  getReviewableProducts,
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews,
} from "../controllers/review.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

// Public routes - get reviews for a product (no auth required)
router.get("/product/:productId", getProductReviews);

// Protected routes - require authentication
router.use(requireAuth);

// Check if user can review a product
router.get("/can-review/:productId", canReviewProduct);

// Get products that user can review
router.get("/reviewable", getReviewableProducts);

// Get current user's reviews
router.get("/my-reviews", getUserReviews);

// Create a new review
router.post("/", createReview);

// Update a review
router.put("/:reviewId", updateReview);

// Delete a review
router.delete("/:reviewId", deleteReview);

// Mark review as helpful
router.post("/:reviewId/helpful", markReviewHelpful);

export default router;
