import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("כתובת אימייל לא תקינה")
  .transform((email) => email.toLowerCase());

export const signupSchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים").max(100),
  email: emailSchema,
  password: z
    .string()
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .max(100),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "נא להזין סיסמה"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "נא להזין את הסיסמה הנוכחית"),
  newPassword: z
    .string()
    .min(8, "הסיסמה החדשה חייבת להכיל לפחות 8 תווים")
    .max(100),
});

export const locationSchema = z.object({
  name: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים").max(200),
  placeId: z
    .string()
    .min(10, "מזהה מקום לא תקין")
    .max(300)
    .refine(isValidPlaceId, "מזהה Google Place ID לא נראה תקין"),
});

export function isValidPlaceId(placeId: string): boolean {
  const trimmed = placeId.trim();
  if (trimmed.length < 10) return false;
  // Google Place IDs are URL-safe base64-like strings; common prefix ChIJ but not required
  return /^[A-Za-z0-9_-]+$/.test(trimmed);
}

export function parseFormData<T extends z.ZodType>(
  schema: T,
  formData: FormData
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "קלט לא תקין";
    return { success: false, error: firstError };
  }
  return { success: true, data: result.data };
}
