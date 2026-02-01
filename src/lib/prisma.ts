import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {prisma : PrismaClient};

function ensureDatabaseEnv() {
	// Support Vercel/Neon env var names without forcing you to duplicate them.
	// Prisma uses DATABASE_URL (runtime) and DIRECT_URL (migrations / direct).
	process.env.DATABASE_URL ??=
		process.env.POSTGRES_PRISMA_URL ||
		process.env.POSTGRES_URL ||
		process.env.NEON_DATABASE_URL ||
		process.env.NEON_POSTGRES_URL;

	process.env.DIRECT_URL ??=
		process.env.POSTGRES_URL_NON_POOLING ||
		process.env.POSTGRES_URL ||
		process.env.DATABASE_URL;
}

ensureDatabaseEnv();

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({ log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;