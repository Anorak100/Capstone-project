import {
  getMetrics,
  getTransactionByReference,
  getUserDetails,
  listHighValueTransfers,
  listTransactions,
  listUsers,
  updateUserStatus,
} from "../services/adminService.js";

const handle = (operation, message, statusCode = 200) => async (req, res, next) => {
  try {
    const data = await operation(req);
    res.status(statusCode).json({ success: true, message, data });
  } catch (error) {
    next(error);
  }
};

export const getUsers = handle(
  (req) => listUsers(req.validatedQuery),
  "Users retrieved successfully",
);

export const getUser = handle(
  (req) => getUserDetails(req.validatedParams.userId),
  "User retrieved successfully",
);

export const setUserStatus = handle(
  (req) => updateUserStatus({
    ...req.body,
    ...req.validatedParams,
    adminId: req.user.userId,
  }),
  "User status updated successfully",
);

export const getTransactions = handle(
  (req) => listTransactions(req.validatedQuery),
  "Transactions retrieved successfully",
);

export const getTransaction = handle(
  (req) => getTransactionByReference(req.validatedParams.reference),
  "Transaction retrieved successfully",
);

export const getAdminMetrics = handle(
  () => getMetrics(),
  "Platform metrics retrieved successfully",
);

export const getFlaggedTransfers = handle(
  (req) => listHighValueTransfers(req.validatedQuery),
  "High-value transfers retrieved successfully",
);
