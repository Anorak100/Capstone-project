import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../Config/prisma.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";
import { sendRegistrationCode } from "./emailService.js";

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
});

const createRegistrationCode = async (transaction, email) => {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const configuredMinutes = Number(process.env.OTP_TTL_MINUTES);
  const lifetimeMinutes =
    Number.isInteger(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : 10;

  await transaction.verificationCode.deleteMany({
    where: { identifier: email, type: "REGISTRATION" },
  });
  await transaction.verificationCode.create({
    data: {
      identifier: email,
      code,
      type: "REGISTRATION",
      expiresAt: new Date(Date.now() + lifetimeMinutes * 60_000),
    },
  });

  return code;
};

const isAccountNumberCollision = (error) => {
  if (error.code !== "P2002") return false;

  const target = error.meta?.target;
  return Array.isArray(target)
    ? target.includes("accountNumber")
    : String(target).includes("accountNumber");
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
  const { user, code } = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: normalizedEmail,
        phone,
        password: passwordHash,
        isActive: false,
      },
    });
    const verificationCode = await createRegistrationCode(
      transaction,
      normalizedEmail,
    );

    return { user: createdUser, code: verificationCode };
  });

  let verificationEmailSent = true;
  try {
    await sendRegistrationCode(normalizedEmail, firstName, code);
  } catch {
    verificationEmailSent = false;
  }

  return {
    user: toPublicUser(user),
    verificationRequired: true,
    verificationEmailSent,
  };
};

export const resendRegistrationOtp = async (email) => {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || user.isActive) return { accepted: true };

  const code = await prisma.$transaction((transaction) =>
    createRegistrationCode(transaction, normalizedEmail),
  );
  await sendRegistrationCode(normalizedEmail, user.firstName, code);

  return { accepted: true };
};

export const verifyRegistrationOtp = async ({ identifier, code }) => {
  const normalizedIdentifier = identifier.trim();
  const normalizedEmail = normalizedIdentifier.toLowerCase();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const user = await transaction.user.findFirst({
          where: {
            OR: [
              { email: normalizedEmail },
              { phone: normalizedIdentifier },
            ],
          },
        });

        if (!user || user.isActive) {
          throw createError("Invalid or expired verification code", 400);
        }

        const verification = await transaction.verificationCode.findFirst({
          where: {
            identifier: user.email,
            code,
            type: "REGISTRATION",
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!verification) {
          throw createError("Invalid or expired verification code", 400);
        }

        const consumedCode = await transaction.verificationCode.deleteMany({
          where: { id: verification.id, expiresAt: { gt: new Date() } },
        });
        if (consumedCode.count !== 1) {
          throw createError("Invalid or expired verification code", 400);
        }

        const activatedUser = await transaction.user.update({
          where: { id: user.id },
          data: { isActive: true },
        });
        const account = await transaction.account.create({
          data: {
            userId: user.id,
            accountNumber: generateAccountNumber(user.phone),
          },
        });

        return {
          user: toPublicUser(activatedUser),
          account,
          onboarding: { complete: true, status: "COMPLETE" },
        };
      });
    } catch (error) {
      if (isAccountNumberCollision(error) && attempt < 4) continue;
      if (error.code === "P2002") {
        throw createError("Unable to create a unique account number", 409);
      }
      throw error;
    }
  }

  throw createError("Unable to create a unique account number", 503);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    throw createError("Invalid email or password", 401);
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
