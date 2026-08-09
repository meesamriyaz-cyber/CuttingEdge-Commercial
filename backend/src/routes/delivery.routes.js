import { Router } from "express";
import { checkDelivery } from "../controllers/delivery.controller.js";

const router = Router();

router.post("/check", checkDelivery);

export default router;
