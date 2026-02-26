import { Router } from "express";
import Service from "../models/Service.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Create
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

// Read all (admin)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const services = await Service.find().sort({ displayOrder: 1 });
  res.json(services);
});

// Update
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(service);
});

// Soft delete
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  const service = await Service.findById(req.params.id);
  service.isActive = !service.isActive;
  await service.save();
  res.json(service);
});

export default router;
