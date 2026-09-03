import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";
import pg from "pg";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveSqlitePath(dbUrl: string): string {
  const dbPath = dbUrl.replace(/^file:/, "");
  if (path.isAbsolute(dbPath)) return dbPath;
  return path.join(process.cwd(), dbPath.replace(/^\.\//, ""));
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    const pool = new pg.Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  const resolvedPath = resolveSqlitePath(dbUrl);
  const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
