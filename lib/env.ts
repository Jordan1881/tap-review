export const MIN_SESSION_SECRET_LENGTH = 32;

export function isSignupEnabled(): boolean {
  return process.env.SIGNUP_ENABLED !== "false";
}

export function assertRuntimeEnv() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      `SESSION_SECRET must be set and at least ${MIN_SESSION_SECRET_LENGTH} characters`
    );
  }

  const dbUrl = process.env.DATABASE_URL ?? "";
  if (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://")) {
    throw new Error("DATABASE_URL must be a postgresql:// connection string");
  }

  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL must be set in production");
  }
}
