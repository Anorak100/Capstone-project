import prisma from "../Config/prisma.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getUserBalance = async (userId) => {
  if (typeof userId !== "string" || !userId) {
    throw createHttpError("Authentication is required", 401);
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    select: {
      accountNumber: true,
      balance: true,
      currency: true,
      status: true
    },
    orderBy: { createdAt: "asc" }
  });

  if (accounts.length === 0) {
    throw createHttpError("No account was found for this user", 404);
  }

  return { accounts };
};

export const lookupAccountRecipient = async ({ phone, accountNumber }) => {
  const account = await prisma.account.findFirst({
    where: phone
      ? { user: { phone } }
      : { accountNumber },
    select: {
      accountNumber: true,
      currency: true,
      status: true,
      user: {
        select: { firstName: true, lastName: true, fullName: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  if (!account) {
    throw createHttpError("Recipient account was not found", 404);
  }
  if (account.status !== "ACTIVE") {
    throw createHttpError("Recipient account is not active", 403);
  }

  return {
    accountNumber: account.accountNumber,
    accountName: account.user.fullName || [account.user.firstName, account.user.lastName].filter(Boolean).join(" "),
    currency: account.currency
  };
};