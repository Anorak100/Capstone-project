import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+?[1-9]\d{7,14}|0\d{9,10})$/, "Enter a valid phone number");

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address").toLowerCase(),
  phone: phoneSchema,
  password: z
    .string()
    .regex(/^\d{6}$/, "Password must be a 6-digit number"),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required"),
});
