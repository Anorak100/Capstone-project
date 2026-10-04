import { Router } from "express";
import {
  getAdminMetrics,
  getFlaggedTransfers,
  getTransaction,
  getTransactions,
  getUser,
  getUsers,
  setUserStatus,
} from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";
import validate from "../Middleware/validationMiddleware.js";
import validateRequest from "../Middleware/validateRequest.js";
import {
  adminTransactionListSchema,
  adminUserListSchema,
  flaggedTransferListSchema,
  transactionReferenceParamsSchema,
  updateUserStatusSchema,
  userIdParamsSchema,
} from "../validations/adminValidation.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.get("/users", validateRequest("query", adminUserListSchema), getUsers);
router.get("/users/:userId", validateRequest("params", userIdParamsSchema), getUser);
router.patch(
  "/users/:userId/status",
  validateRequest("params", userIdParamsSchema),
  validate(updateUserStatusSchema),
  setUserStatus,
);
router.get("/transactions", validateRequest("query", adminTransactionListSchema), getTransactions);
router.get("/transactions/flagged", validateRequest("query", flaggedTransferListSchema), getFlaggedTransfers);
router.get(
  "/transactions/:reference",
  validateRequest("params", transactionReferenceParamsSchema),
  getTransaction,
);
router.get("/metrics", getAdminMetrics);

export default router;
