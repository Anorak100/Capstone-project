import bcrypt from "bcryptjs";
import prisma from "../Config/prisma.js";
import generateReference from "../utils/generateReference.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseAmount = (amount) => {
  const value = typeof amount === "number" ? String(amount) : amount;
  if (typeof value !== "string" || !/^\d{1,13}(?:\.\d{1,2})?$/.test(value)) {
    throw createHttpError("Amount must be a positive number with at most two decimal places", 400);
  }

  const [whole, fraction = ""] = value.split(".");
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  if (cents <= 0n) {
    throw createHttpError("Amount must be greater than zero", 400);
  }

  return {
    cents,
    decimal: `${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`,
  };
};

const isRetryableTransactionError = (error) =>
  error.code === "P2034" || error.code === "P2002";

export const transfer = async ({ userId, fromAccountNumber, toAccountNumber, amount, description, pin }) => {
  if (typeof userId !== "string" || !userId) {
    throw createHttpError("Authentication is required", 401);
  }
  if (typeof fromAccountNumber !== "string" || !fromAccountNumber.trim()
    || typeof toAccountNumber !== "string" || !toAccountNumber.trim()) {
    throw createHttpError("Sender and recipient account numbers are required", 400);
  }
  if (fromAccountNumber.trim() === toAccountNumber.trim()) {
    throw createHttpError("Sender and recipient accounts must be different", 400);
  }
  if (description !== undefined && (typeof description !== "string" || description.length > 250)) {
    throw createHttpError("Description must be 250 characters or fewer", 400);
  }

  const parsedAmount = parseAmount(amount);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const transferReference = generateReference();

    try {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true, transactionPin: true, isActive: true },
        });

        if (!user || !user.isActive) {
          throw createHttpError("Sender account is not active", 403);
        }

        if (!user.transactionPin) {
          const pinError = createHttpError("Please set up your 4-digit transaction PIN before transferring", 428);
          pinError.code = "PIN_NOT_SET";
          throw pinError;
        }

        if (!pin || typeof pin !== "string" || !/^\d{4}$/.test(pin.trim())) {
          const pinError = createHttpError("Enter your 4-digit transaction PIN", 400);
          pinError.code = "PIN_REQUIRED";
          throw pinError;
        }

        const isPinValid = await bcrypt.compare(pin.trim(), user.transactionPin);
        if (!isPinValid) {
          const pinError = createHttpError("Invalid 4-digit transaction PIN", 401);
          pinError.code = "INVALID_PIN";
          throw pinError;
        }

        const senderAccount = await tx.account.findFirst({
          where: { accountNumber: fromAccountNumber.trim(), userId },
          select: { id: true, userId: true, accountNumber: true, currency: true, status: true }
        });

        if (!senderAccount) {
          throw createHttpError("Sender account was not found", 404);
        }
        if (senderAccount.status !== "ACTIVE") {
          throw createHttpError("Sender account is not active", 403);
        }

        const recipientAccount = await tx.account.findUnique({
          where: { accountNumber: toAccountNumber.trim() },
          select: { id: true, userId: true, accountNumber: true, currency: true, status: true }
        });

        if (!recipientAccount) {
          throw createHttpError("Recipient account was not found", 404);
        }
        if (recipientAccount.status !== "ACTIVE") {
          throw createHttpError("Recipient account is not active", 403);
        }
        if (senderAccount.currency !== recipientAccount.currency) {
          throw createHttpError("Transfers between different currencies are not supported", 400);
        }

        const debit = await tx.account.updateMany({
          where: {
            id: senderAccount.id,
            status: "ACTIVE",
            balance: { gte: parsedAmount.decimal }
          },
          data: { balance: { decrement: parsedAmount.decimal } }
        });

        if (debit.count !== 1) {
          throw createHttpError("Insufficient funds", 409);
        }

        const credit = await tx.account.updateMany({
          where: { id: recipientAccount.id, status: "ACTIVE" },
          data: { balance: { increment: parsedAmount.decimal } }
        });

        if (credit.count !== 1) {
          throw createHttpError("Recipient account is not active", 403);
        }

        const commonEntry = {
          amount: parsedAmount.decimal,
          type: "TRANSFER",
          status: "SUCCESSFUL",
          transferReference,
          senderId: senderAccount.userId,
          recipientId: recipientAccount.userId,
          fromAccountId: senderAccount.id,
          toAccountId: recipientAccount.id,
          description: description?.trim() || null
        };

        const debitEntry = await tx.transaction.create({
          data: {
            ...commonEntry,
            reference: `${transferReference}-D`,
            direction: "DEBIT"
          }
        });
        const creditEntry = await tx.transaction.create({
          data: {
            ...commonEntry,
            reference: `${transferReference}-C`,
            direction: "CREDIT"
          }
        });

        return {
          reference: transferReference,
          amount: parsedAmount.decimal,
          currency: senderAccount.currency,
          debit: debitEntry,
          credit: creditEntry
        };
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (isRetryableTransactionError(error) && attempt < 2) continue;
      throw error;
    }
  }

  throw createHttpError("Transfer could not be completed; please retry", 503);
};

export const getUserTransactions = async ({
  userId,
  page = 1,
  limit = 10,
  type,
  status,
  accountNumber
}) => {
  if (typeof userId !== "string" || !userId) {
    throw createHttpError("Authentication is required", 401);
  }

  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const normalizeFilter = (value, name) => {
    if (value === undefined || value === "") return undefined;
    if (typeof value !== "string") {
      throw createHttpError(`Transaction ${name} is invalid`, 400);
    }
    return value.trim().toUpperCase();
  };

  const normalizedType = normalizeFilter(type, "type");
  const normalizedStatus = normalizeFilter(status, "status");
  if (normalizedType && !["DEPOSIT", "WITHDRAWAL", "TRANSFER"].includes(normalizedType)) {
    throw createHttpError("Transaction type is invalid", 400);
  }
  if (normalizedStatus && !["SUCCESSFUL", "FAILED", "PENDING"].includes(normalizedStatus)) {
    throw createHttpError("Transaction status is invalid", 400);
  }
  let accountIds;

  if (accountNumber !== undefined) {
    if (typeof accountNumber !== "string" || !accountNumber.trim()) {
      throw createHttpError("Account number is invalid", 400);
    }
    const account = await prisma.account.findFirst({
      where: { accountNumber: accountNumber.trim(), userId },
      select: { id: true }
    });
    if (!account) {
      throw createHttpError("Account was not found", 404);
    }
    accountIds = [account.id];
  } else {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true }
    });
    accountIds = accounts.map((account) => account.id);
  }

  const where = {
    ...(normalizedType ? { type: normalizedType } : {}),
    ...(normalizedStatus ? { status: normalizedStatus } : {}),
    AND: [
      {
        OR: [
          {
            fromAccountId: { in: accountIds },
            OR: [{ type: { not: "TRANSFER" } }, { direction: "DEBIT" }, { direction: null }]
          },
          {
            toAccountId: { in: accountIds },
            OR: [{ type: { not: "TRANSFER" } }, { direction: "CREDIT" }, { direction: null }]
          }
        ]
      }
    ]
  };
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: {
        fromAccount: { select: { accountNumber: true } },
        toAccount: { select: { accountNumber: true } }
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit
    }),
    prisma.transaction.count({ where })
  ]);

  return {
    transactions,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit)
    }
  };
};
