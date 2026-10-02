import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../Config/prisma.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";

const SALT_ROUNDS = 12;

const createAccessToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { role: user.role },
    secret,
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

const toPublicUser = ({ id, firstName, lastName, fullName, email, phone, role, isActive, createdAt }) => ({
  id,
  firstName,
  lastName,
  fullName,
  email,
  phone,
  role,
  isActive,
  createdAt
});

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isAccountNumberCollision = (error) => {
  if (error.code !== "P2002") return false;

  const target = error.meta?.target;
  return Array.isArray(target)
    ? target.includes("accountNumber")
    : String(target).includes("accountNumber");
};

export const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  if (![firstName, lastName, email, phone, password].every((value) => typeof value === "string" && value.trim())) {
    throw createHttpError("First name, last name, email, phone, and password are required", 400);
  }

  if (phone.replace(/\D/g, "").length < 4) {
    throw createHttpError("A valid phone number is required", 400);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: passwordHash,
        isActive: false
      }
    });

    return {
      user: toPublicUser(user),
      onboarding: { complete: false, status: "OTP_VERIFICATION_REQUIRED" }
    };
  } catch (error) {
    if (error.code === "P2002") {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target[0]
        : "email or phone";
      throw createHttpError(`${field} is already registered`, 409);
    }

    throw error;
  }
};

export const verifyRegistrationOtp = async ({ identifier, code, bvn }) => {
  if (typeof identifier !== "string" || !identifier.trim() || typeof code !== "string" || !code.trim()) {
    throw createHttpError("Identifier and verification code are required", 400);
  }

  if (typeof bvn !== "string" || !/^\d{11}$/.test(bvn)) {
    throw createHttpError("BVN must be exactly 11 digits", 400);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const verification = await tx.verificationCode.findFirst({
          where: {
            identifier: identifier.trim(),
            code: code.trim(),
            type: "REGISTRATION",
            expiresAt: { gt: new Date() }
          },
          orderBy: { createdAt: "desc" }
        });

        if (!verification) {
          throw createHttpError("Invalid or expired verification code", 400);
        }

        const normalizedIdentifier = identifier.trim();
        const user = await tx.user.findFirst({
          where: {
            OR: [
              { email: normalizedIdentifier.toLowerCase() },
              { phone: normalizedIdentifier }
            ]
          }
        });

        if (!user) {
          throw createHttpError("User was not found", 404);
        }

        if (user.isActive) {
          throw createHttpError("User onboarding is already complete", 409);
        }

        const activation = await tx.user.updateMany({
          where: { id: user.id, isActive: false },
          data: { isActive: true, bvn }
        });

        if (activation.count !== 1) {
          throw createHttpError("User onboarding is already complete", 409);
        }

        const account = await tx.account.create({
          data: {
            userId: user.id,
            accountNumber: generateAccountNumber(user.phone),
            accountType: "SAVINGS",
            currency: "NGN",
            status: "ACTIVE"
          }
        });

        await tx.verificationCode.deleteMany({
          where: { identifier: verification.identifier, type: "REGISTRATION" }
        });

        return {
          user: toPublicUser({ ...user, isActive: true }),
          account,
          onboarding: { complete: true, status: "COMPLETE" }
        };
      });
    } catch (error) {
      if (isAccountNumberCollision(error) && attempt < 4) continue;

      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target[0]
          : "BVN";
        throw createHttpError(`${target} is already registered`, 409);
      }

      throw error;
    }
  }

  throw createHttpError("Unable to generate a unique account number", 503);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const credentialsError = createHttpError("Invalid email or password", 401);

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    throw credentialsError;
  }

  return {
    user: toPublicUser(user),
    accessToken: createAccessToken(user),
    tokenType: "Bearer"
  };
};
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
