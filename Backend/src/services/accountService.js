import bcrypt from "bcryptjs";
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

export const getPinStatus = async (userId) => {
  if (typeof userId !== "string" || !userId) {
    throw createHttpError("Authentication is required", 401);
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { transactionPin: true }
  });
  if (!user) {
    throw createHttpError("User not found", 404);
  }
  return { hasPin: Boolean(user.transactionPin) };
};

export const setTransactionPin = async ({ userId, pin, currentPin }) => {
  if (typeof userId !== "string" || !userId) {
    throw createHttpError("Authentication is required", 401);
  }
  if (typeof pin !== "string" || !/^\d{4}$/.test(pin.trim())) {
    throw createHttpError("PIN must be a 4-digit number", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, transactionPin: true }
  });
  if (!user) {
    throw createHttpError("User not found", 404);
  }

  // If user already has a PIN, require currentPin verification
  if (user.transactionPin) {
    if (!currentPin || typeof currentPin !== "string") {
      throw createHttpError("Current PIN is required to change PIN", 400);
    }
    const isCurrentValid = await bcrypt.compare(currentPin.trim(), user.transactionPin);
    if (!isCurrentValid) {
      throw createHttpError("Current PIN is incorrect", 401);
    }
  }

  const hashedPin = await bcrypt.hash(pin.trim(), 12);
  await prisma.user.update({
    where: { id: userId },
    data: { transactionPin: hashedPin }
  });

  return { hasPin: true, message: "Transaction PIN saved successfully" };
};