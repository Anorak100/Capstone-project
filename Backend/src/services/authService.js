import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../Config/prisma.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";
import generateReference from "../utils/generateReference.js";

const WELCOME_BONUS_AMOUNT = 100000.00;

const createError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

const toPublicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  hasPin: Boolean(user.transactionPin),
});

const isAccountNumberCollision = (error) => {
  const target = error.meta?.target;
  return error.code === "P2002" &&
    (Array.isArray(target)
      ? target.includes("accountNumber")
      : String(target).includes("accountNumber"));
};

export const registerUser = async (data) => {
  const { firstName, lastName, email, phone, password } = data;
  const normalizedEmail = email.toLowerCase();
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { phone }] },
  });

  if (existingUser) {
    throw createError("Email or phone number is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      // The transaction rolls back user creation if account creation fails.
      const result = await prisma.$transaction(async (transaction) => {
        const user = await transaction.user.create({
          data: {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email: normalizedEmail,
            phone,
            password: passwordHash,
            isActive: true,
          },
        });
        const account = await transaction.account.create({
          data: {
            userId: user.id,
            accountNumber: generateAccountNumber(phone),
            balance: WELCOME_BONUS_AMOUNT,
          },
        });

        await transaction.transaction.create({
          data: {
            reference: generateReference(),
            amount: WELCOME_BONUS_AMOUNT,
            type: "DEPOSIT",
            direction: "CREDIT",
            status: "SUCCESSFUL",
            description: "Welcome signup bonus",
            recipientId: user.id,
            toAccountId: account.id,
          },
        });

        return { user: toPublicUser(user), account };
      });

      return result;
    } catch (error) {
      if (isAccountNumberCollision(error) && attempt < 4) continue;
      if (error.code === "P2002") {
        throw createError("Email or phone number is already registered", 409);
      }
      throw error;
    }
  }

  throw createError("Unable to create a unique account number", 503);
};

export const loginUser = async ({ phone, password }) => {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    throw createError("Invalid phone number or password", 401);
  }
  if (!process.env.JWT_SECRET) {
    throw createError("JWT_SECRET is not configured", 500);
  }

  return {
    token: jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    ),
    user: toPublicUser(user),
  };
};
