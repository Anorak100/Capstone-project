import {
  deposit,
  withdraw,
  transfer,
  getUserTransactions,
  getTransactionById
} from "../services/transactionService.js";

export const makeDeposit = async (req, res, next) => {
  try {
    const result = await deposit({
      userId: req.user.userId,
      accountNumber: req.body.accountNumber,
      amount: req.body.amount,
      description: req.body.description
    });

    res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const makeWithdrawal = async (req, res, next) => {
  try {
    const result = await withdraw({
      userId: req.user.userId,
      accountNumber: req.body.accountNumber,
      amount: req.body.amount,
      description: req.body.description
    });

    res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

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
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

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

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionById(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: {
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  makeDeposit,
  makeWithdrawal,
  makeTransfer,
  getTransactions,
  getTransaction
};