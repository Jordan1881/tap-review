import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
  destroySession: vi.fn(),
  createSession: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { destroySession, getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const findUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;

describe("requireUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns null when there is no session", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(requireUser()).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
    expect(destroySession).not.toHaveBeenCalled();
  });

  test("returns null for a valid JWT whose user row is gone", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: "user_missing",
      email: "gone@example.com",
    });
    findUnique.mockResolvedValue(null);

    await expect(requireUser()).resolves.toBeNull();
    expect(destroySession).not.toHaveBeenCalled();
  });

  test("returns the user when the session matches a row", async () => {
    const user = {
      id: "user_1",
      email: "a@example.com",
      name: "A",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    vi.mocked(getSession).mockResolvedValue({
      userId: user.id,
      email: user.email,
    });
    findUnique.mockResolvedValue(user);

    await expect(requireUser()).resolves.toEqual(user);
    expect(destroySession).not.toHaveBeenCalled();
  });
});
