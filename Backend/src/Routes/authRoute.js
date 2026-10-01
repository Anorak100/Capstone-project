import express from "express";
import { register, login } from "../Controllers/authController.js";
import validate from "../Middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = express.Router();
import { Router } from "express";
import { z } from "zod";


const router = Router();

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(128, "Password must be no more than 128 characters long")
	.regex(/[a-z]/, "Password must contain a lowercase letter")
	.regex(/[A-Z]/, "Password must contain an uppercase letter")
	.regex(/[0-9]/, "Password must contain a number")
	.regex(/[^A-Za-z0-9]/, "Password must contain a special character");

const registerSchema = z.object({
	firstName: z.string().trim().min(2).max(50),
	lastName: z.string().trim().min(2).max(50),
	email: z.string().trim().email().transform((email) => email.toLowerCase()),
	phone: z.string().trim().regex(/^(?:\+?[1-9]\d{7,14}|0\d{9,10})$/, "Enter a valid phone number"),
	password: passwordSchema
});

const loginSchema = z.object({
	email: z.string().trim().email().transform((email) => email.toLowerCase()),
	password: z.string().min(1, "Password is required")
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
