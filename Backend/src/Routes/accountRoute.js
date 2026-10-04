import { Router } from "express";
import { getBalance, lookupRecipient } from "../Controllers/accountController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import validate from "../Middleware/validationMiddleware.js";
import { recipientLookupSchema } from "../validations/accountValidation.js";

const router = Router();

router.use(authMiddleware);
router.get("/balance", getBalance);
router.post("/lookup", validate(recipientLookupSchema), lookupRecipient);

export default router;