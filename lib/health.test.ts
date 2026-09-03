import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

import { prisma } from "@/lib/db";
import { GET } from "@/app/health/route";

const queryRaw = prisma.$queryRaw as unknown as ReturnType<typeof vi.fn>;

describe("GET /health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns ok when Postgres answers", async () => {
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  test("returns 503 when Postgres is down", async () => {
    queryRaw.mockRejectedValue(new Error("ECONNREFUSED"));

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ ok: false });
  });
});
