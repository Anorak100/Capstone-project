import { Router } from "express";
import {
	create,
	getAccount,
	getBalance,
	getMyAccounts
} from "../Controllers/accountController.js";
import authenticate from "../Middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/", getMyAccounts);
router.get("/:accountNumber/balance", getBalance);
router.get("/:accountNumber", getAccount);

export default router;