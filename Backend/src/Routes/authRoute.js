import { Router } from "express";
import {
  login,
  register,
  resendVerification,
  verifyRegistration,
} from "../Controllers/authController.js";
import validate from "../Middleware/validationMiddleware.js";
import {
  loginSchema,
  resendVerificationSchema,
  registerSchema,
  verificationSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify", validate(verificationSchema), verifyRegistration);
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerification,
);

export default router;
