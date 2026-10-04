import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+?[1-9]\d{7,14}|0\d{9,10})$/, "Enter a valid phone number");

export const recipientLookupSchema = z
  .object({
    phone: phoneSchema.optional(),
    accountNumber: z.string().trim().regex(/^\d{10}$/, "Enter a valid account number").optional()
  })
  .refine(({ phone, accountNumber }) => Boolean(phone) !== Boolean(accountNumber), {
    message: "Provide either a phone number or an account number",
    path: ["phone"]
  });