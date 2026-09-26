import prisma from "./prisma.js";

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully via Prisma");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDatabase;