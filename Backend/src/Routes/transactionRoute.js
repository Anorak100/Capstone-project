import { Router } from "express";
import {
  getTransactions,
  makeTransfer,
} from "../Controllers/transactionController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import transferRateLimiter from "../Middleware/transferRateLimiter.js";

const router = Router();

router.use(authMiddleware);
router.post("/transfer", transferRateLimiter, makeTransfer);
router.get("/history", getTransactions);

export default router;
