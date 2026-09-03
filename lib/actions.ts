"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import {
  loginSchema,
  locationSchema,
  parseFormData,
  signupSchema,
} from "@/lib/validation";
import { generateUniqueSlug } from "@/lib/slug";

export type ActionState = {
  error?: string;
};

export async function signupAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseFormData(signupSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "כתובת האימייל כבר רשומה במערכת" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await createSession(user.id, user.email);
  redirect("/app");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseFormData(loginSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "אימייל או סיסמה שגויים" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "אימייל או סיסמה שגויים" };
  }

  await createSession(user.id, user.email);
  redirect("/app");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function createLocationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = parseFormData(locationSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { name, placeId } = parsed.data;
  const slug = await generateUniqueSlug();

  const location = await prisma.location.create({
    data: {
      userId: user.id,
      name: name.trim(),
      placeId: placeId.trim(),
      slug,
    },
  });

  redirect(`/app/locations/${location.id}`);
}

export async function updateLocationAction(
  locationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) redirect("/login");

  const location = await prisma.location.findFirst({
    where: { id: locationId, userId: user.id },
  });
  if (!location) {
    return { error: "המיקום לא נמצא" };
  }

  const parsed = parseFormData(locationSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  await prisma.location.update({
    where: { id: locationId },
    data: {
      name: parsed.data.name.trim(),
      placeId: parsed.data.placeId.trim(),
    },
  });

  return {};
}
