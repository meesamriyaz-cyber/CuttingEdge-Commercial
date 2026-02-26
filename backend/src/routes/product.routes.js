import express from "express";
const router = express.Router();

import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deactivateProduct,
} from "../controllers/product.controller.js";

import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

// 🟢 Shared — get categories list (admin + customers)
router.get("/categories", requireAuth, getCategories);

// 🟢 Shared — products list (admin + customers)
router.get("/", requireAuth, getProducts);

// 🟢 Shared — product details
router.get("/:id", requireAuth, getProductById);

// 🟡 Admin Product Management
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deactivateProduct);

export default router;
