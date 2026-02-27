import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user's wishlist
router.get("/", getWishlist);

// Check if product is in wishlist
router.get("/check/:productId", checkWishlist);

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.post("/remove", removeFromWishlist);

export default router;
