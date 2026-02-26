import { Router } from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/address.controller.js";

import {
  requireAuth,
  requirePrivateClient
} from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication and private client access
router.get("/", requireAuth, requirePrivateClient, getAddresses);
router.post("/", requireAuth, requirePrivateClient, addAddress);
router.put("/:id", requireAuth, requirePrivateClient, updateAddress);
router.delete("/:id", requireAuth, requirePrivateClient, deleteAddress);
router.patch("/:id/default", requireAuth, requirePrivateClient, setDefaultAddress);

export default router;
