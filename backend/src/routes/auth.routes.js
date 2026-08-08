import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import {
  registerPrivateClient,
  registerGovtClient,
  login,
  refreshToken,
  verifyGovtCode,
  resendGovtVerificationCode,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register/private", registerPrivateClient);
router.post("/register/govt", registerGovtClient);

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/verify", requireAuth, verifyGovtCode);
router.post("/verify/resend", requireAuth, resendGovtVerificationCode);
router.post("/logout", logout);

export default router;
