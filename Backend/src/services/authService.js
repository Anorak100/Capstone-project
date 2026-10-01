import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../Config/prisma.js";

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

const toPublicUser = ({ id, firstName, lastName, fullName, email, phone, role, createdAt }) => ({
  id,
  firstName,
  lastName,
  fullName,
  email,
  phone,
  role,
  createdAt
});

export const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        password: passwordHash
      }
    });

    return toPublicUser(user);
  } catch (error) {
    if (error.code === "P2002") {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target[0]
        : "email or phone";
      const conflict = new Error(`${field} is already registered`);
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const credentialsError = new Error("Invalid email or password");
  credentialsError.statusCode = 401;

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    throw credentialsError;
  }

  return {
    user: toPublicUser(user),
    accessToken: createAccessToken(user),
    tokenType: "Bearer"
  };
};