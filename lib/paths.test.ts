import { describe, expect, test } from "vitest";
import { isSafeAppPath } from "@/lib/paths";

describe("isSafeAppPath", () => {
  test("accepts a dashboard path", () => {
    expect(isSafeAppPath("/app/locations/abc")).toBe(true);
  });

  test("rejects an open redirect to another host", () => {
    expect(isSafeAppPath("https://evil.example/app")).toBe(false);
    expect(isSafeAppPath("//evil.example")).toBe(false);
    expect(isSafeAppPath("/login")).toBe(false);
  });
});
