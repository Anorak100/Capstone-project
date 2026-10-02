import { Router } from "express";
import {
	getTransactions,
	makeTransfer
} from "../Controllers/transactionController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/transfer", makeTransfer);
router.get("/history", getTransactions);

export default router;