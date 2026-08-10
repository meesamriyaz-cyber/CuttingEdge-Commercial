import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllUsers);
router.get("/:id", requireAuth, requireAdmin, getUserById);
router.patch("/:id", requireAuth, requireAdmin, updateUser);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);
router.post("/:id/toggle-active", requireAuth, requireAdmin, toggleUserActive);

export default router;
