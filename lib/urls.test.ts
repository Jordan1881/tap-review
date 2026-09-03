import { describe, expect, test } from "vitest";
import { getAppUrl, getGoogleReviewUrl, getShortUrl } from "@/lib/urls";

describe("getGoogleReviewUrl", () => {
  test("encodes the Place ID into Google's official writereview URL", () => {
    expect(getGoogleReviewUrl("ChIJ a")).toBe(
      "https://search.google.com/local/writereview?placeid=ChIJ%20a"
    );
  });
});

describe("getShortUrl", () => {
  test("builds the public tap URL from the configured origin", () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://tap.example/";

    expect(getShortUrl("abc1234")).toBe("https://tap.example/r/abc1234");

    process.env.NEXT_PUBLIC_APP_URL = previous;
  });
});

describe("getAppUrl", () => {
  test("uses the configured origin when NEXT_PUBLIC_APP_URL is set", () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://reviews.example";

    expect(getAppUrl()).toBe("https://reviews.example");

    process.env.NEXT_PUBLIC_APP_URL = previous;
  });
});
