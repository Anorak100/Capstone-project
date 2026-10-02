import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const useSqlite = process.env.DATABASE_PROVIDER === "sqlite";

export default defineConfig({
  schema: useSqlite ? "prisma/schema.sqlite.prisma" : "prisma/schema.prisma",
  migrations: {
    path: useSqlite ? "prisma/migrations-sqlite" : "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
