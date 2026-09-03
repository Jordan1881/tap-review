import { describe, expect, test } from "vitest";
import {
  changePasswordSchema,
  isValidPlaceId,
  loginSchema,
  parseFormData,
  signupSchema,
} from "@/lib/validation";

describe("signupSchema", () => {
  test("lowercases and trims email on a valid signup", () => {
    const result = signupSchema.safeParse({
      name: "ישראל",
      email: "  Jordan@Example.COM ",
      password: "password1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jordan@example.com");
    }
  });

  test("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      name: "ישראל",
      email: "a@b.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  test("normalizes login email to lowercase", () => {
    const result = loginSchema.safeParse({
      email: "A@B.COM",
      password: "secret",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("a@b.com");
    }
  });

  test("rejects a missing password so login cannot submit an empty secret", () => {
    const result = loginSchema.safeParse({
      email: "a@b.com",
      password: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("נא להזין סיסמה");
    }
  });
});

describe("changePasswordSchema", () => {
  test("requires the new password to be at least 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "123",
    });

    expect(result.success).toBe(false);
  });
});

describe("isValidPlaceId", () => {
  test("accepts a typical Google Place ID", () => {
    expect(isValidPlaceId("ChIJd8BlQ2BZwokRAFUEcm_qrcA")).toBe(true);
  });

  test("rejects a place id with spaces", () => {
    expect(isValidPlaceId("not a place")).toBe(false);
  });
});

describe("parseFormData", () => {
  test("returns the first Hebrew validation message on invalid input", () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");
    formData.set("password", "secret");

    const result = parseFormData(loginSchema, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("כתובת אימייל לא תקינה");
    }
  });
});
