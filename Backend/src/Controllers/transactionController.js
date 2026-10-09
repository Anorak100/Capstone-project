import {
  transfer,
  getUserTransactions
} from "../services/transactionService.js";

export const makeTransfer = async (req, res, next) => {
  try {
    const result = await transfer({
      userId: req.user.userId,
      fromAccountNumber: req.body.fromAccount,
      toAccountNumber: req.body.toAccount,
      amount: req.body.amount,
      description: req.body.description
    });

    res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    const result = await getUserTransactions({
      userId: req.user.userId,
      page,
      limit,
      type: req.query.type,
      status: req.query.status,
      accountNumber: req.query.accountNumber
    });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  makeTransfer,
  getTransactions
};