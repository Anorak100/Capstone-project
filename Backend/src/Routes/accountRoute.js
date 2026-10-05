import { Router } from "express";
import {
  getBalance,
  lookupRecipient,
  getPinStatusController,
  setPinController,
} from "../Controllers/accountController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import validate from "../Middleware/validationMiddleware.js";
import {
  recipientLookupSchema,
  setPinSchema,
} from "../validations/accountValidation.js";

const router = Router();

router.use(authMiddleware);
router.get("/balance", getBalance);
router.post("/lookup", validate(recipientLookupSchema), lookupRecipient);
router.get("/pin-status", getPinStatusController);
router.post("/pin", validate(setPinSchema), setPinController);

export default router;