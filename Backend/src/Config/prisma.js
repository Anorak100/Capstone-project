import "dotenv/config";
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.DATABASE_PROVIDER === "sqlite") {
	const [{ PrismaBetterSqlite3 }, { PrismaClient: SqlitePrismaClient }] =
		await Promise.all([
			import("@prisma/adapter-better-sqlite3"),
			import("../generated/sqlite/index.js"),
		]);
	const adapter = new PrismaBetterSqlite3({
		url: process.env.DATABASE_URL || "file:./prisma/dev.db",
	});
	prisma = new SqlitePrismaClient({ adapter });
} else {
	const [{ Pool }, { PrismaPg }] = await Promise.all([
		import("pg"),
		import("@prisma/adapter-pg"),
	]);
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const adapter = new PrismaPg(pool);
	prisma = new PrismaClient({ adapter });
}

export default prisma;

