import { Router } from "express";
import { login, register, verifyOtp } from "../Controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

export default router;