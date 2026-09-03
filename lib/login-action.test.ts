import { beforeEach, describe, expect, test, vi } from "vitest";

const allow = vi.hoisted(() => vi.fn(() => true));
const findFirst = vi.hoisted(() => vi.fn());
const verifyPassword = vi.hoisted(() => vi.fn());
const createSession = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  })
);

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirect(url),
}));

vi.mock("@/lib/rate-limit", () => ({
  getClientIp: () => "127.0.0.1",
  rateLimiter: {
    allow: (key: string, limit: number, windowMs: number) =>
      allow(key, limit, windowMs),
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findFirst: (args: unknown) => findFirst(args) },
    location: {
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  createSession: (userId: string, email: string) => createSession(userId, email),
  destroySession: vi.fn(),
  hashPassword: vi.fn(),
  requireUser: vi.fn(),
  verifyPassword: (password: string, hash: string) =>
    verifyPassword(password, hash),
}));

import { loginAction } from "@/lib/actions";

function loginForm(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    formData.set(name, value);
  }
  return formData;
}

describe("loginAction error cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    allow.mockReturnValue(true);
  });

  test("rejects an empty password before touching the database", async () => {
    const result = await loginAction({}, loginForm({ email: "a@b.com", password: "" }));

    expect(result).toEqual({ error: "נא להזין סיסמה" });
    expect(findFirst).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  test("returns a generic error when the email is not in Postgres", async () => {
    findFirst.mockResolvedValue(null);

    const result = await loginAction(
      {},
      loginForm({ email: "missing@example.com", password: "password1" })
    );

    expect(result).toEqual({ error: "אימייל או סיסמה שגויים" });
    expect(verifyPassword).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  test("returns a generic error when the password hash does not match", async () => {
    findFirst.mockResolvedValue({
      id: "user_1",
      email: "a@example.com",
      passwordHash: "$2b$12$not-a-real-hash",
    });
    verifyPassword.mockResolvedValue(false);

    const result = await loginAction(
      {},
      loginForm({ email: "a@example.com", password: "wrong-password" })
    );

    expect(result).toEqual({ error: "אימייל או סיסמה שגויים" });
    expect(createSession).not.toHaveBeenCalled();
  });

  test("rate-limits repeated login attempts", async () => {
    allow.mockReturnValue(false);

    const result = await loginAction(
      {},
      loginForm({ email: "a@example.com", password: "password1" })
    );

    expect(result).toEqual({ error: "נסיונות רבים מדי. נסו שוב בעוד דקה." });
    expect(findFirst).not.toHaveBeenCalled();
  });

  test("creates a session and redirects when credentials are valid", async () => {
    findFirst.mockResolvedValue({
      id: "user_1",
      email: "a@example.com",
      passwordHash: "$2b$12$not-a-real-hash",
    });
    verifyPassword.mockResolvedValue(true);

    await expect(
      loginAction({}, loginForm({ email: "a@example.com", password: "password1" }))
    ).resolves.toEqual({ redirectTo: "/app" });

    expect(createSession).toHaveBeenCalledWith("user_1", "a@example.com");
  });
});
