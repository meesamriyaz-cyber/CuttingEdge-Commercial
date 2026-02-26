import express from "express";
import {
  getPublicProducts,
  getPublicProductById,
  getPublicCategories,
  getPublicProductReviews,
  getPublicReviewSummary,
} from "../controllers/publicProduct.controller.js";

const router = express.Router();

router.get("/products", getPublicProducts);
router.get("/products/:id", getPublicProductById);
router.get("/categories", getPublicCategories);
router.get("/products/:productId/reviews", getPublicProductReviews);
router.get("/products/:productId/review-summary", getPublicReviewSummary);

export default router;
