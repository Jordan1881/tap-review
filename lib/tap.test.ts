import { describe, expect, test, vi } from "vitest";
import { isPrefetchRequest, resolveTapRedirect } from "@/lib/tap";

describe("resolveTapRedirect", () => {
  test("returns not_found when the slug has no location", async () => {
    const recordTap = vi.fn();

    const result = await resolveTapRedirect({
      location: null,
      recordTap,
    });

    expect(result).toEqual({ kind: "not_found" });
    expect(recordTap).not.toHaveBeenCalled();
  });

  test("redirects to the Google review URL after a successful tap log", async () => {
    const recordTap = vi.fn().mockResolvedValue(undefined);

    const result = await resolveTapRedirect({
      location: { id: "loc_1", placeId: "ChIJTestPlace" },
      recordTap,
    });

    expect(recordTap).toHaveBeenCalledOnce();
    expect(result).toEqual({
      kind: "redirect",
      url: "https://search.google.com/local/writereview?placeid=ChIJTestPlace",
    });
  });

  test("still redirects to Google when tap logging throws", async () => {
    const recordTap = vi.fn().mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await resolveTapRedirect({
      location: { id: "loc_1", placeId: "ChIJTestPlace" },
      recordTap,
    });

    expect(result).toEqual({
      kind: "redirect",
      url: "https://search.google.com/local/writereview?placeid=ChIJTestPlace",
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("isPrefetchRequest", () => {
  test("treats sec-purpose prefetch as a prefetch", () => {
    const headers = new Headers({ "sec-purpose": "prefetch" });
    expect(isPrefetchRequest(headers)).toBe(true);
  });

  test("treats a normal browser request as not a prefetch", () => {
    const headers = new Headers({ "user-agent": "Mozilla/5.0" });
    expect(isPrefetchRequest(headers)).toBe(false);
  });
});
