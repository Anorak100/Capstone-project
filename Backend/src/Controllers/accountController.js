import { getUserBalance, lookupAccountRecipient } from "../services/accountService.js";

export const getBalance = async (req, res, next) => {
  try {
    const result = await getUserBalance(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Balance retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const lookupRecipient = async (req, res, next) => {
  try {
    const recipient = await lookupAccountRecipient(req.body);

    res.status(200).json({
      success: true,
      message: "Recipient retrieved successfully",
      data: recipient
    });
  } catch (error) {
    next(error);
  }
};

export default { getBalance, lookupRecipient };