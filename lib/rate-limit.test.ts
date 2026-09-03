import { describe, expect, test } from "vitest";
import { MemoryRateLimiter, getClientIp } from "@/lib/rate-limit";

describe("MemoryRateLimiter", () => {
  test("allows requests under the limit inside the window", () => {
    const now = 1_000;
    const limiter = new MemoryRateLimiter(() => now);

    expect(limiter.allow("login:1.1.1.1", 2, 1_000)).toBe(true);
    expect(limiter.allow("login:1.1.1.1", 2, 1_000)).toBe(true);
    expect(limiter.allow("login:1.1.1.1", 2, 1_000)).toBe(false);
  });

  test("allows a new request after the window expires", () => {
    let now = 1_000;
    const limiter = new MemoryRateLimiter(() => now);

    expect(limiter.allow("tap:9.9.9.9", 1, 500)).toBe(true);
    expect(limiter.allow("tap:9.9.9.9", 1, 500)).toBe(false);
    now = 1_600;
    expect(limiter.allow("tap:9.9.9.9", 1, 500)).toBe(true);
  });
});

describe("getClientIp", () => {
  test("uses the first x-forwarded-for address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.10");
  });
});
