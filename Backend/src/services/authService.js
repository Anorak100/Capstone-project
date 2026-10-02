import bcrypt from "bcryptjs";
import prisma from "../Config/prisma.js";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";
import { sendRegistrationCode } from "./emailService.js";

const createError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

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

export const registerUser = async (data) => {
  const { firstName, lastName, email, phone, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
  if (existingUser) {
    throw createError("Email or phone number is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { user, code } = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        password: hashedPassword,
        isActive: false,
      },
    });
    const verificationCode = await createRegistrationCode(transaction, email);

    return { user: createdUser, code: verificationCode };
  });

  let verificationEmailSent = true;
  try {
    await sendRegistrationCode(email, firstName, code);
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
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.isActive) {
    return { accepted: true };
  }

  const code = await prisma.$transaction((transaction) =>
    createRegistrationCode(transaction, email),
  );

  await sendRegistrationCode(email, user.firstName, code);
  return { accepted: true };
};

export const verifyRegistrationOtp = async ({ identifier, code }) => {
  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const verificationCode = await transaction.verificationCode.findFirst({
      where: {
        identifier,
        code,
        type: "REGISTRATION",
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      throw createError("Invalid or expired verification code", 400);
    }

    const user = await transaction.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      throw createError("Invalid or expired verification code", 400);
    }

    const consumedCode = await transaction.verificationCode.deleteMany({
      where: {
        id: verificationCode.id,
        expiresAt: { gt: now },
      },
    });

    if (consumedCode.count !== 1) {
      throw createError("Invalid or expired verification code", 400);
    }

    let account = await transaction.account.findFirst({
      where: { userId: user.id },
    });

    if (!account) {
      account = await transaction.account.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(user.phone),
        },
      });
    }

    const activatedUser = await transaction.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    return {
      user: toPublicUser(activatedUser),
      account,
      onboarding: { status: "complete" },
    };
  });
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("This account is inactive");
  }
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    },
  };
};
