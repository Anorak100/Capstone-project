import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/Config/prisma.js";

const ADMIN_PHONE = process.env.ADMIN_PHONE?.trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
  (ADMIN_PHONE
    ? `admin.${ADMIN_PHONE.replace(/\D/g, "")}@fhastpay.local`
    : undefined);

async function main() {
  if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
    console.error(
      "Seed skipped: set ADMIN_PHONE and ADMIN_PASSWORD in .env before running.",
    );
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 6) {
    console.error("Seed aborted: ADMIN_PASSWORD must be at least 6 characters.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { phone: ADMIN_PHONE },
    select: { id: true, role: true, phone: true },
  });

  if (existing) {
    console.log(
      `Admin seed skipped: user with phone ${existing.phone} already exists (role: ${existing.role}).`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.create({
    data: {
      firstName: "Platform",
      lastName: "Admin",
      fullName: "Platform Admin",
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    select: { id: true, phone: true, email: true, role: true },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
