import { Router } from "express";
import {
  getMyCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCart
} from "../controllers/cart.controller.js";

import {
  requireAuth,
  requirePrivateClient
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requirePrivateClient, getMyCart);
 router.patch("/item", requireAuth, requirePrivateClient, updateCart);

router.post("/add", requireAuth, requirePrivateClient, addToCart);

router.post("/remove", requireAuth, requirePrivateClient, removeFromCart);

router.post("/clear", requireAuth, requirePrivateClient, clearCart);

export default router;
