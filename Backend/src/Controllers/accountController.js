import {
  createAccount,
  getUserAccounts,
  getAccountByNumber
} from "../services/accountService.js";

export const create = async (req, res, next) => {
  try {
    const account = await createAccount(
      req.user.userId,
      req.body.accountType
    );

    res.status(201).json({
      success: true,
      message: "Bank account created successfully",
      data: {
        account
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAccounts = async (req, res, next) => {
  try {
    const accounts = await getUserAccounts(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Accounts retrieved successfully",
      data: {
        accounts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (req, res, next) => {
  try {
    const account = await getAccountByNumber(
      req.params.accountNumber,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Account retrieved successfully",
      data: {
        account
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBalance = async (req, res, next) => {
  try {
    const account = await getAccountByNumber(
      req.params.accountNumber,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Balance retrieved successfully",
      data: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  getMyAccounts,
  getAccount,
  getBalance
};