import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { destroySession, getSession } from "@/lib/session";

export { createSession, destroySession, getSession } from "@/lib/session";
export type { SessionPayload } from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    await destroySession();
    return null;
  }

  return user;
}
