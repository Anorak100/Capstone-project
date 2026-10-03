import { Router } from "express";
import { login, register } from "../Controllers/authController.js";
import validate from "../Middleware/validationMiddleware.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
