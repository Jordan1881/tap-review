import { afterEach, describe, expect, test, vi } from "vitest";
import { assertRuntimeEnv, isSignupEnabled } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isSignupEnabled", () => {
  test("is open unless SIGNUP_ENABLED is the string false", () => {
    vi.stubEnv("SIGNUP_ENABLED", "");
    expect(isSignupEnabled()).toBe(true);

    vi.stubEnv("SIGNUP_ENABLED", "false");
    expect(isSignupEnabled()).toBe(false);
  });
});

describe("assertRuntimeEnv", () => {
  test("accepts a valid local runtime env", () => {
    vi.stubEnv("SESSION_SECRET", "ci-session-secret-at-least-32-chars!!");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://tapreview:tapreview@127.0.0.1:5432/tapreview"
    );
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    expect(() => assertRuntimeEnv()).not.toThrow();
  });

  test("rejects a short SESSION_SECRET", () => {
    vi.stubEnv("SESSION_SECRET", "too-short");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://tapreview:tapreview@127.0.0.1:5432/tapreview"
    );

    expect(() => assertRuntimeEnv()).toThrow(/SESSION_SECRET/);
  });

  test("rejects a non-postgres DATABASE_URL", () => {
    vi.stubEnv("SESSION_SECRET", "ci-session-secret-at-least-32-chars!!");
    vi.stubEnv("DATABASE_URL", "file:./dev.db");

    expect(() => assertRuntimeEnv()).toThrow(/DATABASE_URL/);
  });

  test("requires NEXT_PUBLIC_APP_URL in production", () => {
    vi.stubEnv("SESSION_SECRET", "ci-session-secret-at-least-32-chars!!");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://tapreview:tapreview@127.0.0.1:5432/tapreview"
    );
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    expect(() => assertRuntimeEnv()).toThrow(/NEXT_PUBLIC_APP_URL/);
  });
});
