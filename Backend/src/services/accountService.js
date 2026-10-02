import prisma from "../Config/prisma.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createAccount = async (userId, accountType = "SAVINGS") => {
  const normalizedType = String(accountType ?? "SAVINGS").toUpperCase();
  if (!["SAVINGS", "CURRENT"].includes(normalizedType)) {
    throw createHttpError("Account type must be SAVINGS or CURRENT", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true, isActive: true }
  });

  if (!user?.isActive) {
    throw createHttpError("An active user is required to create an account", 403);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.account.create({
        data: {
          userId,
          accountNumber: generateAccountNumber(user.phone),
          accountType: normalizedType,
          currency: "NGN",
          status: "ACTIVE"
        }
      });
    } catch (error) {
      const target = error.meta?.target;
      const accountNumberCollision = error.code === "P2002" && (
        Array.isArray(target)
          ? target.includes("accountNumber")
          : String(target).includes("accountNumber")
      );

      if (!accountNumberCollision || attempt === 4) throw error;
    }
  }

  throw createHttpError("Unable to generate a unique account number", 503);
};

export const getUserAccounts = async (userId) => prisma.account.findMany({
  where: { userId },
  orderBy: { createdAt: "asc" }
});

export const getAccountByNumber = async (accountNumber, userId) => {
  const account = await prisma.account.findFirst({
    where: { accountNumber, userId }
  });

  if (!account) {
    throw createHttpError("Account was not found", 404);
  }

  return account;
};
