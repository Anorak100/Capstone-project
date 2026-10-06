import { z } from "zod";

const paginationSchema = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const adminUserListSchema = z.object({
  ...paginationSchema,
  search: z.string().trim().max(100).optional(),
});

export const adminTransactionListSchema = z.object({
  ...paginationSchema,
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]).optional(),
  status: z.enum(["SUCCESSFUL", "FAILED", "PENDING"]).optional(),
  userId: z.string().uuid().optional(),
  reference: z.string().trim().max(100).optional(),
  search: z.string().trim().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).refine(({ from, to }) => !from || !to || from <= to, {
  message: "The from date must be before or equal to the to date",
  path: ["from"],
});

export const flaggedTransferListSchema = z.object({
  ...paginationSchema,
  minAmount: z.string()
    .regex(/^\d{1,13}(?:\.\d{1,2})?$/, "Enter an amount with up to two decimal places")
    .refine((value) => {
      const [whole, fraction = ""] = value.split(".");
      return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0")) > 0n;
    }, "Minimum amount must be greater than zero"),
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid("User id must be a valid UUID"),
});

export const transactionReferenceParamsSchema = z.object({
  reference: z.string().trim().min(1).max(100),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
